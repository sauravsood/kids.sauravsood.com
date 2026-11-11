// API for Trace: Google sign-in, sessions, saved drawings and usage stats.
// Static files in public/ are served by Cloudflare's asset handler; only
// /api/* requests reach this Worker (see run_worker_first in wrangler.jsonc).

const SESSION_COOKIE = "trace_session";
const SESSION_DAYS = 180;
const MAX_BODY = 1_800_000; // D1 rows are limited to about 2 MB
const MAX_THUMB = 150_000;
const ANIMAL_RE = /^[a-z]{2,20}$/;

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
];

let schemaReady = null;
function ensureSchema(db) {
  schemaReady ??= db.batch(SCHEMA.map((s) => db.prepare(s))).catch((e) => { schemaReady = null; throw e; });
  return schemaReady;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    try {
      if (!env.DB) return json({ error: "Database is not connected" }, 503);
      await ensureSchema(env.DB);
      return await route(request, env, url);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, err.status);
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
    return json({ googleClientId: env.GOOGLE_CLIENT_ID || null, devLogin: env.DEV_LOGIN === "1" });
  }
  if (path === "/api/auth/google" && method === "POST") {
    const { credential } = await body(request);
    const claims = await verifyGoogleToken(credential, env.GOOGLE_CLIENT_ID);
    return signIn(env, claims.sub, claims.email || null);
  }
  if (path === "/api/auth/dev" && method === "POST" && env.DEV_LOGIN === "1") {
    const { email } = await body(request);
    return signIn(env, `dev:${email}`, email);
  }
  if (path === "/api/auth/logout" && method === "POST") {
    const token = readCookie(request, SESSION_COOKIE);
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
    return json({ ok: true }, 200, { "Set-Cookie": cookie("", 0) });
  }

  const user = await currentUser(request, env);

  if (path === "/api/me" && method === "GET") return json(await profile(env, user));
  if (path === "/api/me" && method === "PUT") {
    const { kidName } = await body(request);
    const name = String(kidName || "").trim().slice(0, 30);
    if (!name) throw new HttpError(400, "Name is required");
    await env.DB.prepare("UPDATE users SET kid_name = ? WHERE id = ?").bind(name, user.id).run();
    return json(await profile(env, { ...user, kid_name: name }));
  }

  if (path === "/api/usage" && method === "POST") {
    const { seconds } = await body(request);
    const s = Math.max(0, Math.min(120, Math.round(Number(seconds) || 0)));
    if (s) {
      const day = new Date().toISOString().slice(0, 10);
      await env.DB.batch([
        env.DB.prepare("UPDATE users SET seconds = seconds + ? WHERE id = ?").bind(s, user.id),
        env.DB.prepare(`INSERT INTO usage (user_id, day, seconds) VALUES (?, ?, ?)
                        ON CONFLICT (user_id, day) DO UPDATE SET seconds = seconds + excluded.seconds`).bind(user.id, day, s),
      ]);
    }
    return json(await stats(env, user.id));
  }

  if (path === "/api/drawings" && method === "GET") {
    const { results } = await env.DB.prepare(
      `SELECT id, animal, thumb, seconds, created_at, updated_at FROM drawings
       WHERE user_id = ? ORDER BY created_at DESC LIMIT 200`).bind(user.id).all();
    return json({ drawings: results.map(publicDrawing) });
  }
  if (path === "/api/drawings" && method === "POST") {
    const d = validDrawing(await body(request));
    const now = Date.now();
    const row = await env.DB.prepare(
      `INSERT INTO drawings (user_id, animal, strokes, thumb, seconds, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, animal, thumb, seconds, created_at, updated_at`)
      .bind(user.id, d.animal, d.strokes, d.thumb, d.seconds, now, now).first();
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
         WHERE id = ? AND user_id = ? RETURNING id, animal, thumb, seconds, created_at, updated_at`)
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

async function signIn(env, sub, email) {
  const now = Date.now();
  const user = await env.DB.prepare(
    `INSERT INTO users (google_sub, email, created_at) VALUES (?, ?, ?)
     ON CONFLICT (google_sub) DO UPDATE SET email = excluded.email
     RETURNING id, kid_name, email`).bind(sub, email, now).first();
  const token = randomToken();
  const maxAge = SESSION_DAYS * 86400;
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND expires_at < ?").bind(user.id, now),
    env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
      .bind(await sha256(token), user.id, now + maxAge * 1000),
  ]);
  return json(await profile(env, user), 200, { "Set-Cookie": cookie(token, maxAge) });
}

async function currentUser(request, env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) throw new HttpError(401, "Not signed in");
  const user = await env.DB.prepare(
    `SELECT users.id, users.kid_name, users.email FROM sessions JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ? AND sessions.expires_at > ?`).bind(await sha256(token), Date.now()).first();
  if (!user) throw new HttpError(401, "Not signed in");
  return user;
}

async function profile(env, user) {
  return { kidName: user.kid_name || null, email: user.email || null, stats: await stats(env, user.id) };
}

async function stats(env, userId) {
  const row = await env.DB.prepare(
    `SELECT (SELECT COUNT(*) FROM drawings WHERE user_id = ?1) AS drawings,
            (SELECT seconds FROM users WHERE id = ?1) AS seconds,
            (SELECT COALESCE(seconds, 0) FROM usage WHERE user_id = ?1 AND day = ?2) AS today`)
    .bind(userId, new Date().toISOString().slice(0, 10)).first();
  return { drawings: row.drawings || 0, seconds: row.seconds || 0, todaySeconds: row.today || 0 };
}

// ---------- Google ID token check ----------

let jwksCache = { keys: null, expires: 0 };

async function googleKeys() {
  if (jwksCache.keys && Date.now() < jwksCache.expires) return jwksCache.keys;
  const res = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!res.ok) throw new HttpError(502, "Could not reach Google");
  const { keys } = await res.json();
  const maxAge = Number((res.headers.get("cache-control") || "").match(/max-age=(\d+)/)?.[1] || 3600);
  jwksCache = { keys, expires: Date.now() + maxAge * 1000 };
  return keys;
}

async function verifyGoogleToken(token, clientId) {
  if (!clientId) throw new HttpError(503, "Google sign-in is not set up");
  if (typeof token !== "string" || token.split(".").length !== 3) throw new HttpError(400, "Bad sign-in token");
  const [h, p, s] = token.split(".");
  const header = JSON.parse(b64urlText(h));
  const claims = JSON.parse(b64urlText(p));
  const jwk = (await googleKeys()).find((k) => k.kid === header.kid);
  if (!jwk || header.alg !== "RS256") throw new HttpError(401, "Unknown sign-in key");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlBytes(s), new TextEncoder().encode(`${h}.${p}`));
  const now = Date.now() / 1000;
  if (!ok
    || !["accounts.google.com", "https://accounts.google.com"].includes(claims.iss)
    || claims.aud !== clientId
    || !(claims.exp > now)
    || !claims.sub) {
    throw new HttpError(401, "Sign-in could not be verified");
  }
  return claims;
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

function publicDrawing(row) {
  return { id: row.id, animal: row.animal, thumb: row.thumb, seconds: row.seconds, createdAt: row.created_at, updatedAt: row.updated_at };
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

function b64urlBytes(s) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function b64urlText(s) {
  return new TextDecoder().decode(b64urlBytes(s));
}
