// Saved checklists for standalone pages on sauravsood.com (first user: the
// Baby Prep Survival Kit at sauravsood.com/baby-prep/). No sign-in: each
// visitor's browser makes a long random id, and whoever has that id (it is in
// their personal link) can read and write that one list.
//
//   GET /api/lists/<id>   -> { name, data, updated_at }  (404 if never saved)
//   PUT /api/lists/<id>   <- { name, data: { got: {...}, seen: {...}, t } }
//
// Only a first name and which boxes are ticked are stored.

const ID_RE = /^[a-z0-9]{16,40}$/;
const KEY_RE = /^[a-z]?\d{1,3}(-\d{1,3})?$/;
const MAX_NAME = 40;
const MAX_KEYS = 300;
const NEW_PER_DAY = 40; // new lists one visitor can start in a day
const ORIGIN_RE = /^https:\/\/([a-z0-9-]+\.)*sauravsood\.com$/;
const LOCAL_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export const LISTS_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS lists (
     id TEXT PRIMARY KEY,
     name TEXT,
     data TEXT NOT NULL,
     visitor TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS lists_by_visitor ON lists (visitor, created_at)`,
];

function allowedOrigin(origin, env) {
  if (!origin) return null;
  if (ORIGIN_RE.test(origin)) return origin;
  if (env.DEV_LOGIN === "1" && LOCAL_RE.test(origin)) return origin;
  return null;
}

function reply(data, status, origin) {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store", Vary: "Origin" };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, PUT, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(status === 204 ? null : JSON.stringify(data), { status, headers });
}

async function sha256(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Keep only { "<short key>": 1 } pairs, so nothing else can be stored here.
function ticks(obj) {
  const out = {};
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return out;
  let n = 0;
  for (const k of Object.keys(obj)) {
    if (n >= MAX_KEYS) break;
    if (KEY_RE.test(k) && obj[k]) { out[k] = 1; n++; }
  }
  return out;
}

export async function handleLists(request, env, url, ensureSchema) {
  const origin = allowedOrigin(request.headers.get("Origin"), env);
  const method = request.method;
  if (method === "OPTIONS") return reply(null, origin ? 204 : 403, origin);
  if (!origin) return reply({ error: "Not allowed from this site" }, 403, null);

  const id = url.pathname.slice("/api/lists/".length);
  if (!ID_RE.test(id)) return reply({ error: "Not found" }, 404, origin);
  if (!env.DB) return reply({ error: "Saving is offline right now" }, 503, origin);
  await ensureSchema(env.DB);

  if (method === "GET") {
    const row = await env.DB.prepare("SELECT name, data, updated_at FROM lists WHERE id = ?").bind(id).first();
    if (!row) return reply({ error: "Not found" }, 404, origin);
    let data = {};
    try { data = JSON.parse(row.data); } catch {}
    return reply({ name: row.name || "", data, updated_at: row.updated_at }, 200, origin);
  }

  if (method !== "PUT") return reply({ error: "Method not allowed" }, 405, origin);

  let body;
  try {
    const text = await request.text();
    if (text.length > 20_000) return reply({ error: "Too big" }, 413, origin);
    body = JSON.parse(text);
  } catch {
    return reply({ error: "Bad request" }, 400, origin);
  }
  if (!body || typeof body !== "object") return reply({ error: "Bad request" }, 400, origin);

  const name = String(body.name ?? "").replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, MAX_NAME);
  const src = body.data && typeof body.data === "object" ? body.data : {};
  const now = Date.now();
  const t = Number.isFinite(src.t) ? Math.min(Math.max(0, Math.floor(src.t)), now + 60_000) : now;
  const data = JSON.stringify({ got: ticks(src.got), seen: ticks(src.seen), t });

  const exists = await env.DB.prepare("SELECT 1 AS x FROM lists WHERE id = ?").bind(id).first();
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const visitor = (await sha256(`${ip}|${new Date(now).toISOString().slice(0, 10)}`)).slice(0, 32);
  if (!exists) {
    const made = await env.DB.prepare("SELECT COUNT(*) AS n FROM lists WHERE visitor = ? AND created_at > ?")
      .bind(visitor, now - 86_400_000).first();
    if (made && made.n >= NEW_PER_DAY) return reply({ error: "Too many new lists today" }, 429, origin);
  }

  await env.DB.prepare(
    `INSERT INTO lists (id, name, data, visitor, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET name = excluded.name, data = excluded.data, updated_at = excluded.updated_at`
  ).bind(id, name || null, data, visitor, now, now).run();

  return reply({ ok: true, updated_at: now }, 200, origin);
}
