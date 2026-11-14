// Feedback bubble API: POST /api/feedback from any page on sauravsood.com or
// its subdomains (the bubble script is public/feedback/bubble.js).
//
// Every submission is saved in D1 (table `feedback`). If the Worker has the
// secret FEEDBACK_GITHUB_TOKEN and the variable FEEDBACK_GITHUB_REPO
// ("owner/name" of a PRIVATE repo), it is also filed there as an issue, which
// is where Claude picks it up for accept/reject. Emails never go anywhere
// public: keep that repo private.

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 4000;
const PER_HOUR = 5; // submissions per visitor per hour
const TYPES = new Set(["idea", "issue", "other"]);
const ORIGIN_RE = /^https:\/\/([a-z0-9-]+\.)*sauravsood\.com$/;
const LOCAL_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FEEDBACK_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS feedback (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     created_at INTEGER NOT NULL,
     site TEXT NOT NULL,
     page TEXT,
     type TEXT NOT NULL,
     name TEXT,
     email TEXT,
     message TEXT NOT NULL,
     visitor TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'new',
     issue INTEGER)`,
  `CREATE INDEX IF NOT EXISTS feedback_by_visitor ON feedback (visitor, created_at)`,
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
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(status === 204 ? null : JSON.stringify(data), { status, headers });
}

async function sha256(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function clean(v, max) {
  // Drop control characters except newlines and tabs.
  return String(v ?? "").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, max);
}

export async function handleFeedback(request, env, ctx, ensureSchema) {
  const origin = allowedOrigin(request.headers.get("Origin"), env);
  if (request.method === "OPTIONS") return reply(null, origin ? 204 : 403, origin);
  if (request.method !== "POST") return reply({ error: "Method not allowed" }, 405, origin);
  if (!origin) return reply({ error: "Not allowed from this site" }, 403, null);

  let data;
  try {
    const text = await request.text();
    if (text.length > 20_000) return reply({ error: "That’s too long" }, 413, origin);
    data = JSON.parse(text);
  } catch {
    return reply({ error: "Bad request" }, 400, origin);
  }
  if (!data || typeof data !== "object") return reply({ error: "Bad request" }, 400, origin);

  // Honeypot filled in: pretend it worked so bots don't retry.
  if (data.website) return reply({ ok: true }, 200, origin);

  const message = clean(data.message, MAX_MESSAGE);
  const name = clean(data.name, MAX_NAME);
  const email = clean(data.email, MAX_EMAIL);
  const type = TYPES.has(data.feedbackType) ? data.feedbackType : "other";
  if (message.length < 2) return reply({ error: "Please write a few words" }, 400, origin);
  if (email && !EMAIL_RE.test(email)) return reply({ error: "That email doesn’t look right" }, 400, origin);

  let page = "";
  try {
    const u = new URL(String(data.page || ""));
    if (u.origin === origin) page = (u.origin + u.pathname).slice(0, 500);
  } catch {}
  const site = new URL(origin).hostname;

  if (!env.DB) return reply({ error: "Feedback is offline right now" }, 503, origin);
  await ensureSchema(env.DB);

  const now = Date.now();
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const visitor = (await sha256(`${ip}|${new Date(now).toISOString().slice(0, 10)}`)).slice(0, 32);
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM feedback WHERE visitor = ? AND created_at > ?")
    .bind(visitor, now - 3600_000).first();
  if (recent && recent.n >= PER_HOUR) return reply({ error: "Thanks! That’s plenty for now. Try again later." }, 429, origin);

  const row = await env.DB.prepare(
    `INSERT INTO feedback (created_at, site, page, type, name, email, message, visitor)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(now, site, page || null, type, name || null, email || null, message, visitor).first();

  if (env.FEEDBACK_GITHUB_TOKEN && env.FEEDBACK_GITHUB_REPO) {
    const item = { id: row.id, created_at: now, site, page, type, name, email, message };
    const job = fileIssue(env, item).catch((e) => console.error("feedback issue failed", e));
    if (ctx && ctx.waitUntil) ctx.waitUntil(job); else await job;
  }

  return reply({ ok: true }, 200, origin);
}

async function fileIssue(env, f) {
  const oneLine = f.message.replace(/\s+/g, " ");
  const title = `[${f.type}] ${oneLine.length > 70 ? oneLine.slice(0, 69) + "…" : oneLine}`;
  const quoted = f.message.split("\n").map((l) => "> " + l).join("\n");
  const bodyText = [
    `**From:** ${f.name || "(no name)"}${f.email ? ` <${f.email}>` : ""}`,
    `**Site:** ${f.site}${f.page ? ` · ${f.page}` : ""}`,
    `**Type:** ${f.type}`,
    `**When:** ${new Date(f.created_at).toISOString()}`,
    `**Feedback #:** ${f.id}`,
    "",
    quoted,
  ].join("\n");

  const res = await fetch(`https://api.github.com/repos/${env.FEEDBACK_GITHUB_REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FEEDBACK_GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "sauravsood-feedback-worker",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ title, body: bodyText }),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const issue = await res.json();
  await env.DB.prepare("UPDATE feedback SET issue = ? WHERE id = ?").bind(issue.number, f.id).run();
}
