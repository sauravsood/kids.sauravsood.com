// API for the kids site: Google and Apple sign-in and sessions (shared by every app),
// Trace's saved drawings and usage stats, and one saved JSON document per
// app for Pocket Money and My Routines. Also the site-wide feedback bubble
// (src/feedback.js) and saved checklists for sauravsood.com pages (src/lists.js).
// Static files in public/ are served by Cloudflare's asset handler; only
// /api/* requests reach this Worker (see run_worker_first in wrangler.jsonc).

import { FEEDBACK_SCHEMA, handleFeedback } from "./feedback.js";
import { LISTS_SCHEMA, handleLists } from "./lists.js";
import { APPLE, GOOGLE, TokenError, emailVerified, verifyIdToken } from "./oidc.js";

const SESSION_COOKIE = "trace_session";
const SESSION_DAYS = 180;
const MAX_BODY = 1_800_000; // D1 rows are limited to about 2 MB
const MAX_THUMB = 150_000;
const ANIMAL_RE = /^[a-z]{2,20}$/;
const CLIENT_ID_RE = /^[A-Za-z0-9_-]{1,40}$/;  // drawing ids made on the device, so saving offline works
const RETURN_RE = /^\/[a-z]{2,20}(\/[a-z]{2,20})?\/$/; // where Apple sign-in sends people back to
const APPLE_STATE_COOKIE = "apple_state";
const STATE_APPS = new Set(["money", "routines"]);
const MAX_STATE = 100_000;
// My Animals (Trace): outlines made on the device from a child's photo.
const MINE_ID_RE = /^my[a-z]{6,18}$/;
const SHAPE_RE = /^<path (class="line" )?d="[MQLZ0-9 -]{3,20000}"\/>$/;
const PHOTO_RE = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]{100,60000}$/;
const MAX_MINE = 500;
const MAX_KIDS = 8;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     google_sub TEXT NOT NULL UNIQUE,
     email TEXT,
     kid_name TEXT,
     seconds INTEGER NOT NULL DEFAULT 0,
     created_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (
     token_hash TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL,
     expires_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS drawings (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER NOT NULL,
     animal TEXT NOT NULL,
     strokes TEXT NOT NULL,
     thumb TEXT,
     seconds INTEGER NOT NULL DEFAULT 0,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS drawings_by_user ON drawings (user_id, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS usage (
     user_id INTEGER NOT NULL,
     day TEXT NOT NULL,
     seconds INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (user_id, day))`,
  `CREATE TABLE IF NOT EXISTS app_state (
     user_id INTEGER NOT NULL,
     app TEXT NOT NULL,
     data TEXT NOT NULL,
     updated_at INTEGER NOT NULL,
     PRIMARY KEY (user_id, app))`,
  // Extra sign-ins (Apple, or a second provider) pointing at an existing user.
  // users.google_sub holds the first one: a Google sub, "apple:<sub>" or "dev:<email>".
  `CREATE TABLE IF NOT EXISTS identities (
     sub TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL,
     created_at INTEGER NOT NULL)`,
  // My Animals: shapes is a JSON list of SVG <path> strings; photo is a small
  // JPEG of the animal made on the device (no EXIF). hidden = removed by the child.
  `CREATE TABLE IF NOT EXISTS my_animals (
     user_id INTEGER NOT NULL,
     client_id TEXT NOT NULL,
     shapes TEXT NOT NULL,
     photo TEXT,
     tint TEXT NOT NULL,
     hidden INTEGER NOT NULL DEFAULT 0,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     PRIMARY KEY (user_id, client_id))`,
  ...FEEDBACK_SCHEMA,
  ...LISTS_SCHEMA,
];

async function addColumn(db, table, column) {
  try {
    await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column}`).run();
  } catch (err) {
    if (!/duplicate column/i.test(String(err && err.message))) throw err;
  }
}

// Added after the first release: drawings get an id made on the device
// (client_id), so a drawing saved offline can be sent more than once
// without turning into two drawings. Older drawings get "s<id>".
// Then kids: a family can have more than one child. Each extra child is a
// users row of its own (family_id = the grown-up's row, google_sub
// "kid:…", never signed in to), so drawings, time, My Animals and app
// state stay apart without changing those tables. The grown-up's own row is
// the first child. sessions.kid_id is the child picked on that device;
// users.last_kid is the one picked last, for the next sign-in.
async function migrate(db) {
  await addColumn(db, "drawings", "client_id TEXT");
  await addColumn(db, "users", "family_id INTEGER");
  await addColumn(db, "users", "last_kid INTEGER");
  await addColumn(db, "sessions", "kid_id INTEGER");
  await db.batch([
    db.prepare("UPDATE drawings SET client_id = 's' || id WHERE client_id IS NULL"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS drawings_by_client ON drawings (user_id, client_id)"),
  ]);
}

let schemaReady = null;
function ensureSchema(db) {
  schemaReady ??= db.batch(SCHEMA.map((s) => db.prepare(s)))
    .then(() => migrate(db))
    .catch((e) => { schemaReady = null; throw e; });
  return schemaReady;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (url.pathname === "/api/feedback") {
      try {
        return await handleFeedback(request, env, ctx, ensureSchema);
      } catch (err) {
        console.error(err);
        const origin = request.headers.get("Origin") || "";
        return new Response(JSON.stringify({ error: "Something went wrong" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...(/^https:\/\/([a-z0-9-]+\.)*sauravsood\.com$/.test(origin) ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}) },
        });
      }
    }
    if (url.pathname.startsWith("/api/lists/")) {
      const origin = request.headers.get("Origin") || "";
      try {
        return await handleLists(request, env, url, ensureSchema);
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Something went wrong" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...(/^https:\/\/([a-z0-9-]+\.)*sauravsood\.com$/.test(origin) ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}) },
        });
      }
    }
    try {
      if (!env.DB) return json({ error: "Database is not connected" }, 503);
      await ensureSchema(env.DB);
      return await route(request, env, url);
    } catch (err) {
      if (err instanceof HttpError || err instanceof TokenError) return json({ error: err.message }, err.status);
      console.error(err);
      return json({ error: "Something went wrong" }, 500);
    }
  },
};

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function route(request, env, url) {
  const { method } = request;
  const path = url.pathname;

  if (path === "/api/config" && method === "GET") {
    return json({
      googleClientId: env.GOOGLE_CLIENT_ID || null,
      appleClientId: env.APPLE_CLIENT_ID || null,
      devLogin: env.DEV_LOGIN === "1",
    });
  }
  if (path === "/api/auth/google" && method === "POST") {
    const { credential } = await body(request);
    const claims = await verifyIdToken(credential, GOOGLE, { audience: env.GOOGLE_CLIENT_ID });
    const { user, setCookie } = await signIn(env, claims.sub, claims.email || null, emailVerified(claims));
    return json(await profile(env, user), 200, { "Set-Cookie": setCookie });
  }
  if (path === "/api/auth/apple/callback" && method === "POST") return appleCallback(request, env);
  if (path === "/api/auth/dev" && method === "POST" && env.DEV_LOGIN === "1") {
    const { email } = await body(request);
    const { user, setCookie } = await signIn(env, `dev:${email}`, email, true);
    return json(await profile(env, user), 200, { "Set-Cookie": setCookie });
  }
  if (path === "/api/auth/logout" && method === "POST") {
    const token = readCookie(request, SESSION_COOKIE);
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
    return json({ ok: true }, 200, { "Set-Cookie": cookie("", 0) });
  }

  const user = await currentUser(request, env);

  if (path === "/api/me" && method === "GET") return json(await profile(env, user));
  // Kids in the family: add one (a grown-up action, behind the sum check in
  // the app) or pick which one is using this device.
  if (path === "/api/kids" && method === "POST") {
    const name = kidName((await body(request)).name);
    const { n } = await env.DB.prepare("SELECT COUNT(*) AS n FROM users WHERE id = ?1 OR family_id = ?1").bind(user.parentId).first();
    if (n >= MAX_KIDS) throw new HttpError(409, "That's a lot of kids already");
    const kid = await env.DB.prepare(
      `INSERT INTO users (google_sub, kid_name, family_id, created_at) VALUES (?, ?, ?, ?) RETURNING id, kid_name`)
      .bind(`kid:${user.parentId}:${randomToken().slice(0, 16)}`, name, user.parentId, Date.now()).first();
    return json(await profile(env, await pickKid(env, user, kid)), 201);
  }
  if (path === "/api/kids/switch" && method === "POST") {
    const kid = await familyKid(env, user.parentId, (await body(request)).kid);
    if (!kid) throw new HttpError(404, "That kid isn't on this account");
    return json(await profile(env, await pickKid(env, user, kid)));
  }

  if (path === "/api/me" && method === "PUT") {
    const name = kidName((await body(request)).kidName);
    await env.DB.prepare("UPDATE users SET kid_name = ? WHERE id = ?").bind(name, user.id).run();
    return json(await profile(env, { ...user, kid_name: name }));
  }

  if (path === "/api/usage" && method === "POST") {
    const { seconds, day: sentDay } = await body(request);
    const s = Math.max(0, Math.min(120, Math.round(Number(seconds) || 0)));
    if (s) {
      // Time spent offline is sent later with the (UTC) day it was spent on.
      const today = new Date().toISOString().slice(0, 10);
      const age = (Date.parse(today) - Date.parse(String(sentDay))) / 86400000;
      const day = /^\d{4}-\d{2}-\d{2}$/.test(String(sentDay)) && age >= 0 && age <= 60 ? sentDay : today;
      await env.DB.batch([
        env.DB.prepare("UPDATE users SET seconds = seconds + ? WHERE id = ?").bind(s, user.id),
        env.DB.prepare(`INSERT INTO usage (user_id, day, seconds) VALUES (?, ?, ?)
                        ON CONFLICT (user_id, day) DO UPDATE SET seconds = seconds + excluded.seconds`).bind(user.id, day, s),
      ]);
    }
    return json(await stats(env, user.id));
  }

  // One JSON document per user and app (Pocket Money, My Routines).
  const stateMatch = path.match(/^\/api\/state\/([a-z]+)$/);
  if (stateMatch) {
    const app = stateMatch[1];
    if (!STATE_APPS.has(app)) throw new HttpError(404, "Not found");
    if (method === "GET") {
      const row = await env.DB.prepare("SELECT data, updated_at FROM app_state WHERE user_id = ? AND app = ?")
        .bind(user.id, app).first();
      return json({ data: row ? JSON.parse(row.data) : null, updatedAt: row ? row.updated_at : null });
    }
    if (method === "PUT") {
      const { data } = await body(request);
      if (!data || typeof data !== "object" || Array.isArray(data)) throw new HttpError(400, "Data must be an object");
      const text = JSON.stringify(data);
      if (text.length > MAX_STATE) throw new HttpError(413, "Too much to save");
      const now = Date.now();
      await env.DB.prepare(
        `INSERT INTO app_state (user_id, app, data, updated_at) VALUES (?, ?, ?, ?)
         ON CONFLICT (user_id, app) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`)
        .bind(user.id, app, text, now).run();
      return json({ ok: true, updatedAt: now });
    }
  }

  // My Animals. GET ?meta=1 lists ids and times; GET ?ids=a,b gets them in
  // full; PUT creates or updates one (the newest edit wins, safe to repeat).
  if (path === "/api/mine" && method === "GET") {
    if (url.searchParams.get("meta") === "1") {
      const { results } = await env.DB.prepare(
        "SELECT client_id, updated_at FROM my_animals WHERE user_id = ? LIMIT 2000").bind(user.id).all();
      return json({ animals: results.map((r) => ({ id: r.client_id, updatedAt: r.updated_at })) });
    }
    const ids = (url.searchParams.get("ids") || "").split(",").filter((id) => MINE_ID_RE.test(id)).slice(0, 20);
    if (!ids.length) return json({ animals: [] });
    const { results } = await env.DB.prepare(
      `SELECT * FROM my_animals WHERE user_id = ? AND client_id IN (${ids.map(() => "?").join(",")})`)
      .bind(user.id, ...ids).all();
    return json({ animals: results.map((r) => ({
      id: r.client_id, shapes: JSON.parse(r.shapes), photo: r.photo, tint: r.tint, hidden: !!r.hidden,
      createdAt: r.created_at, updatedAt: r.updated_at,
    })) });
  }
  const mineMatch = path.match(/^\/api\/mine\/([a-z]{2,20})$/);
  if (mineMatch && method === "PUT") {
    const id = mineMatch[1];
    if (!MINE_ID_RE.test(id)) throw new HttpError(400, "Bad id");
    const raw = await body(request);
    const shapes = raw.shapes;
    if (!Array.isArray(shapes) || !shapes.length || shapes.length > 40
      || !shapes.every((x) => typeof x === "string" && SHAPE_RE.test(x))) throw new HttpError(400, "Bad outline");
    const photo = raw.photo == null ? null : String(raw.photo);
    if (photo !== null && !PHOTO_RE.test(photo)) throw new HttpError(400, "Bad photo");
    const tint = String(raw.tint || "");
    if (!/^#[0-9a-f]{6}$/.test(tint)) throw new HttpError(400, "Bad colour");
    const now = Date.now();
    const updatedAt = clampTime(raw.updatedAt, now);
    const createdAt = Math.min(clampTime(raw.createdAt, now), updatedAt);
    const existing = await env.DB.prepare("SELECT 1 FROM my_animals WHERE user_id = ? AND client_id = ?").bind(user.id, id).first();
    if (!existing) {
      const { n } = await env.DB.prepare("SELECT COUNT(*) AS n FROM my_animals WHERE user_id = ?").bind(user.id).first();
      if (n >= MAX_MINE) throw new HttpError(413, "Too many animals");
    }
    await env.DB.prepare(
      `INSERT INTO my_animals (user_id, client_id, shapes, photo, tint, hidden, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (user_id, client_id) DO UPDATE SET
         shapes = excluded.shapes, photo = excluded.photo, tint = excluded.tint, hidden = excluded.hidden,
         updated_at = excluded.updated_at
       WHERE excluded.updated_at >= my_animals.updated_at`)
      .bind(user.id, id, JSON.stringify(shapes), photo, tint, raw.hidden ? 1 : 0, createdAt, updatedAt).run();
    return json({ ok: true });
  }

  if (path === "/api/drawings" && method === "GET") {
    // ?meta=1: every drawing, without pictures, so a device can see what changed.
    if (url.searchParams.get("meta") === "1") {
      const { results } = await env.DB.prepare(
        `SELECT client_id, animal, seconds, created_at, updated_at FROM drawings
         WHERE user_id = ? ORDER BY created_at DESC LIMIT 5000`).bind(user.id).all();
      return json({ drawings: results.map((r) => ({
        clientId: r.client_id, animal: r.animal, seconds: r.seconds, createdAt: r.created_at, updatedAt: r.updated_at,
      })) });
    }
    // ?ids=a,b,c: those drawings in full (strokes and thumbnail), up to 20.
    const ids = (url.searchParams.get("ids") || "").split(",").filter((id) => CLIENT_ID_RE.test(id)).slice(0, 20);
    if (ids.length) {
      const { results } = await env.DB.prepare(
        `SELECT * FROM drawings WHERE user_id = ? AND client_id IN (${ids.map(() => "?").join(",")})`)
        .bind(user.id, ...ids).all();
      return json({ drawings: results.map((r) => ({ ...publicDrawing(r), strokes: JSON.parse(r.strokes) })) });
    }
    const { results } = await env.DB.prepare(
      `SELECT id, client_id, animal, thumb, seconds, created_at, updated_at FROM drawings
       WHERE user_id = ? ORDER BY created_at DESC LIMIT 200`).bind(user.id).all();
    return json({ drawings: results.map(publicDrawing) });
  }

  // Drawings by the id the device gave them. PUT creates or updates (the
  // newest edit wins), so sending the same drawing twice is harmless.
  const byClient = path.match(/^\/api\/drawings\/c\/([A-Za-z0-9_-]{1,40})$/);
  if (byClient) {
    const clientId = byClient[1];
    if (method === "PUT") {
      const raw = await body(request);
      const d = validDrawing(raw);
      const now = Date.now();
      const updatedAt = clampTime(raw.updatedAt, now);
      const createdAt = Math.min(clampTime(raw.createdAt, now), updatedAt);
      await env.DB.prepare(
        `INSERT INTO drawings (user_id, client_id, animal, strokes, thumb, seconds, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (user_id, client_id) DO UPDATE SET
           strokes = excluded.strokes, thumb = excluded.thumb, seconds = excluded.seconds, updated_at = excluded.updated_at
         WHERE excluded.updated_at >= drawings.updated_at`)
        .bind(user.id, clientId, d.animal, d.strokes, d.thumb, d.seconds, createdAt, updatedAt).run();
      return json({ ok: true, stats: await stats(env, user.id) });
    }
    if (method === "DELETE") {
      await env.DB.prepare("DELETE FROM drawings WHERE client_id = ? AND user_id = ?").bind(clientId, user.id).run();
      return json({ ok: true, stats: await stats(env, user.id) });
    }
  }
  if (path === "/api/drawings" && method === "POST") {
    const d = validDrawing(await body(request));
    const now = Date.now();
    const row = await env.DB.prepare(
      `INSERT INTO drawings (user_id, animal, strokes, thumb, seconds, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, animal, thumb, seconds, created_at, updated_at`)
      .bind(user.id, d.animal, d.strokes, d.thumb, d.seconds, now, now).first();
    await env.DB.prepare("UPDATE drawings SET client_id = 's' || id WHERE id = ?").bind(row.id).run();
    row.client_id = `s${row.id}`;
    return json({ drawing: publicDrawing(row), stats: await stats(env, user.id) }, 201);
  }

  const match = path.match(/^\/api\/drawings\/(\d+)$/);
  if (match) {
    const id = Number(match[1]);
    if (method === "GET") {
      const row = await env.DB.prepare("SELECT * FROM drawings WHERE id = ? AND user_id = ?").bind(id, user.id).first();
      if (!row) throw new HttpError(404, "Not found");
      return json({ drawing: { ...publicDrawing(row), strokes: JSON.parse(row.strokes) } });
    }
    if (method === "PUT") {
      const d = validDrawing(await body(request));
      const row = await env.DB.prepare(
        `UPDATE drawings SET strokes = ?, thumb = ?, seconds = ?, updated_at = ?
         WHERE id = ? AND user_id = ? RETURNING id, client_id, animal, thumb, seconds, created_at, updated_at`)
        .bind(d.strokes, d.thumb, d.seconds, Date.now(), id, user.id).first();
      if (!row) throw new HttpError(404, "Not found");
      return json({ drawing: publicDrawing(row), stats: await stats(env, user.id) });
    }
    if (method === "DELETE") {
      await env.DB.prepare("DELETE FROM drawings WHERE id = ? AND user_id = ?").bind(id, user.id).run();
      return json({ ok: true, stats: await stats(env, user.id) });
    }
  }

  throw new HttpError(404, "Not found");
}

// ---------- Accounts and sessions ----------

// Finds or creates the account for a sign-in and starts a session.
// `sub` is the provider's id for the person ("apple:…" for Apple). A new
// provider with the same verified email joins the existing account, so a
// grown-up who used Google on one device and Apple on another sees the
// same drawings. Apple's private relay addresses never match anything.
async function signIn(env, sub, email, verified) {
  const now = Date.now();
  const db = env.DB;
  let user = await db.prepare(
    `SELECT users.id, users.kid_name, users.email, users.google_sub, users.last_kid FROM identities
     JOIN users ON users.id = identities.user_id WHERE identities.sub = ?`).bind(sub).first();
  user ??= await db.prepare("SELECT id, kid_name, email, google_sub, last_kid FROM users WHERE google_sub = ?").bind(sub).first();
  if (!user && email && verified) {
    user = await db.prepare(
      "SELECT id, kid_name, email, google_sub, last_kid FROM users WHERE lower(email) = lower(?) AND family_id IS NULL ORDER BY id LIMIT 1").bind(email).first();
    if (user) {
      await db.prepare("INSERT OR IGNORE INTO identities (sub, user_id, created_at) VALUES (?, ?, ?)").bind(sub, user.id, now).run();
    }
  }
  if (!user) {
    user = await db.prepare(
      `INSERT INTO users (google_sub, email, created_at) VALUES (?, ?, ?)
       RETURNING id, kid_name, email, google_sub, last_kid`).bind(sub, email, now).first();
  } else if (user.google_sub === sub && email && email !== user.email) {
    await db.prepare("UPDATE users SET email = ? WHERE id = ?").bind(email, user.id).run();
    user.email = email;
  }
  // Start with the child picked last time (on any device).
  const kid = (user.last_kid && await familyKid(env, user.id, user.last_kid)) || user;
  const token = randomToken();
  const maxAge = SESSION_DAYS * 86400;
  await db.batch([
    db.prepare("DELETE FROM sessions WHERE user_id = ? AND expires_at < ?").bind(user.id, now),
    db.prepare("INSERT INTO sessions (token_hash, user_id, kid_id, expires_at) VALUES (?, ?, ?, ?)")
      .bind(await sha256(token), user.id, kid.id, now + maxAge * 1000),
  ]);
  return { user: { id: kid.id, kid_name: kid.kid_name, email: user.email, parentId: user.id }, setCookie: cookie(token, maxAge) };
}

// Sign in with Apple, web flow. The page sets a short-lived apple_state
// cookie and sends the browser to Apple; Apple posts the result here
// (response_mode=form_post). The ID token is checked against Apple's keys,
// so no Apple private key is needed. Then back to the app that asked.
async function appleCallback(request, env) {
  const form = await request.formData();
  const [nonce, back] = String(form.get("state") || "").split("~");
  const returnTo = RETURN_RE.test(back || "") ? back : "/trace/";
  const headers = new Headers({ "Cache-Control": "no-store" });
  headers.append("Set-Cookie", `${APPLE_STATE_COOKIE}=; Path=/api/auth/apple; Max-Age=0; HttpOnly; Secure; SameSite=None`);
  const redirect = (to) => { headers.set("Location", to); return new Response(null, { status: 303, headers }); };
  if (form.get("error")) return redirect(returnTo); // closed or cancelled
  const expected = readCookie(request, APPLE_STATE_COOKIE);
  if (!nonce || !expected || nonce !== expected) return redirect(`${returnTo}?signin=failed`);
  try {
    const claims = await verifyIdToken(String(form.get("id_token") || ""), APPLE, { audience: env.APPLE_CLIENT_ID, nonce });
    const { setCookie } = await signIn(env, `apple:${claims.sub}`, claims.email || null, emailVerified(claims));
    headers.append("Set-Cookie", setCookie);
    return redirect(returnTo);
  } catch (err) {
    console.error(err);
    return redirect(`${returnTo}?signin=failed`);
  }
}

// The signed-in grown-up and the child using this device. `id` is the
// child's row, which every drawing, time and app query uses; `parentId` is
// the grown-up's. Trace sends X-Kid with each request so a sync that was on
// its way when someone switched kids still lands on the right child.
async function currentUser(request, env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) throw new HttpError(401, "Not signed in");
  const tokenHash = await sha256(token);
  const row = await env.DB.prepare(
    `SELECT p.id AS parent_id, p.email, p.kid_name AS parent_kid_name, k.id AS kid_id, k.kid_name
     FROM sessions s JOIN users p ON p.id = s.user_id
     LEFT JOIN users k ON k.id = s.kid_id AND k.family_id = p.id
     WHERE s.token_hash = ? AND s.expires_at > ?`).bind(tokenHash, Date.now()).first();
  if (!row) throw new HttpError(401, "Not signed in");
  let kid = row.kid_id ? { id: row.kid_id, kid_name: row.kid_name } : { id: row.parent_id, kid_name: row.parent_kid_name };
  const asked = request.headers.get("X-Kid");
  if (asked && /^\d{1,12}$/.test(asked) && Number(asked) !== kid.id) {
    kid = await familyKid(env, row.parent_id, asked);
    if (!kid) throw new HttpError(409, "That kid isn't on this account");
  }
  return { id: kid.id, kid_name: kid.kid_name, email: row.email, parentId: row.parent_id, tokenHash };
}

// A child in this grown-up's family (the grown-up's own row is the first one).
async function familyKid(env, parentId, kidId) {
  const id = Number(kidId);
  if (!Number.isInteger(id) || id <= 0) return null;
  return env.DB.prepare("SELECT id, kid_name FROM users WHERE id = ?1 AND (id = ?2 OR family_id = ?2)")
    .bind(id, parentId).first();
}

// Makes `kid` the child on this device, and the one to start with next sign-in.
async function pickKid(env, user, kid) {
  await env.DB.batch([
    env.DB.prepare("UPDATE sessions SET kid_id = ? WHERE token_hash = ?").bind(kid.id, user.tokenHash),
    env.DB.prepare("UPDATE users SET last_kid = ? WHERE id = ?").bind(kid.id, user.parentId),
  ]);
  return { ...user, id: kid.id, kid_name: kid.kid_name };
}

async function profile(env, user) {
  const parentId = user.parentId ?? user.id;
  const { results } = await env.DB.prepare(
    "SELECT id, kid_name FROM users WHERE id = ?1 OR family_id = ?1 ORDER BY id").bind(parentId).all();
  const kids = results.filter((k) => k.kid_name || k.id === user.id).map((k) => ({ id: k.id, name: k.kid_name || null }));
  return { account: user.id, kidName: user.kid_name || null, email: user.email || null, kids, stats: await stats(env, user.id) };
}

function kidName(value) {
  const name = String(value || "").trim().slice(0, 30);
  if (!name) throw new HttpError(400, "Name is required");
  return name;
}

async function stats(env, userId) {
  const row = await env.DB.prepare(
    `SELECT (SELECT COUNT(*) FROM drawings WHERE user_id = ?1) AS drawings,
            (SELECT seconds FROM users WHERE id = ?1) AS seconds,
            (SELECT COALESCE(seconds, 0) FROM usage WHERE user_id = ?1 AND day = ?2) AS today`)
    .bind(userId, new Date().toISOString().slice(0, 10)).first();
  return { drawings: row.drawings || 0, seconds: row.seconds || 0, todaySeconds: row.today || 0 };
}

// ---------- Helpers ----------

function validDrawing(d) {
  const animal = String(d.animal || "");
  if (!ANIMAL_RE.test(animal)) throw new HttpError(400, "Unknown animal");
  if (!Array.isArray(d.strokes)) throw new HttpError(400, "Strokes must be a list");
  const strokes = JSON.stringify(d.strokes);
  const thumb = typeof d.thumb === "string" && d.thumb.startsWith("data:image/") && d.thumb.length <= MAX_THUMB ? d.thumb : null;
  const seconds = Math.max(0, Math.min(86400, Math.round(Number(d.seconds) || 0)));
  return { animal, strokes, thumb, seconds };
}

function clampTime(value, now) {
  const t = Math.round(Number(value));
  return t > 1_600_000_000_000 && t <= now + 60_000 ? t : now;
}

function publicDrawing(row) {
  return { id: row.id, clientId: row.client_id || `s${row.id}`, animal: row.animal, thumb: row.thumb, seconds: row.seconds, createdAt: row.created_at, updatedAt: row.updated_at };
}

async function body(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) throw new HttpError(413, "Drawing is too big");
  try { return JSON.parse(text || "{}"); } catch { throw new HttpError(400, "Bad JSON"); }
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

function cookie(value, maxAge) {
  return `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

function readCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256(text) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
