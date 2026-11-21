// Trace's AI helper on claude-server (server/ in this repo), reached through
// the Cloudflare tunnel at AI_URL. Only signed-in families can use it: the
// grown-up's session token goes along in X-Kids-Session and the AI server
// checks it against /api/me before doing anything.
//
//   POST /api/ai/say      {"text": "..."}  -> MP3 of the line in the storybook voice
//   POST /api/ai/outline  JPEG             -> JSON masks, one per animal
//
// If AI_URL isn't set or the server can't be reached, the answer is 503 and
// Trace falls back to the recordings and the on-device outline model.

const JOBS = {
  say: { type: /^application\/json/, max: 2_000, wait: 20_000 },
  outline: { type: /^image\/jpeg$/, max: 1_500_000, wait: 45_000 },
};

export async function handleAi(request, env, job, token) {
  const spec = JOBS[job];
  const reply = (status, error) => new Response(JSON.stringify({ error }), {
    status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
  if (!spec || request.method !== "POST") return reply(404, "Not found");
  if (!env.AI_URL) return reply(503, "AI server isn't set up");
  const type = request.headers.get("Content-Type") || "";
  if (!spec.type.test(type)) return reply(415, "Wrong type");
  const data = await request.arrayBuffer();
  if (!data.byteLength || data.byteLength > spec.max) return reply(413, "Too big");
  let res;
  try {
    res = await fetch(`${env.AI_URL.replace(/\/$/, "")}/${job}`, {
      method: "POST",
      headers: { "Content-Type": type, "X-Kids-Session": token },
      body: data,
      signal: AbortSignal.timeout(spec.wait),
    });
  } catch {
    return reply(503, "AI server is away");
  }
  if (res.status >= 500 || res.status === 404 || res.status === 530) return reply(503, "AI server is away");
  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
