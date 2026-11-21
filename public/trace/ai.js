// Trace's AI helper on claude-server (server/ in the repo), reached through
// the kids Worker at /api/ai/*. Everything here is optional: when it can't be
// reached (offline, signed out, server away) each call fails quickly and the
// caller uses its recording or on-device model instead.

const SAY_CACHE = "trace-say-v1";
const SAY_WAIT = 12000;
const OUTLINE_WAIT = 40000;
let awayUntil = 0; // after a failure, don't keep asking for a minute

function away() { awayUntil = Date.now() + 60000; }

async function post(path, body, type, wait) {
  if (Date.now() < awayUntil || (typeof navigator !== "undefined" && navigator.onLine === false)) {
    throw new Error("AI server away");
  }
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), wait);
  try {
    const res = await fetch(path, {
      method: "POST", body, credentials: "same-origin", signal: ctl.signal,
      headers: { "Content-Type": type },
    });
    if (!res.ok) {
      if (res.status >= 500) away();
      throw new Error(`AI ${res.status}`);
    }
    return res;
  } catch (err) {
    if (err.name === "AbortError") away();
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function hash(text) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(b)].slice(0, 12).map((x) => x.toString(16).padStart(2, "0")).join("");
}

// One storybook line spoken live in the books' own voice (Kokoro af_heart),
// e.g. "And Maya’s animal went to sea". Kept on the device afterwards, so it
// plays offline next time. -> ArrayBuffer of MP3.
export async function liveLine(text) {
  const key = `/trace/voice/live/${await hash(text)}.mp3`;
  let cache = null;
  try {
    cache = await caches.open(SAY_CACHE);
    const hit = await cache.match(key);
    if (hit) return hit.arrayBuffer();
  } catch { /* no cache storage */ }
  const res = await post("/api/ai/say", JSON.stringify({ text }), "application/json", SAY_WAIT);
  const bytes = await res.arrayBuffer();
  try { await cache?.put(key, new Response(bytes.slice(0), { headers: { "Content-Type": "audio/mpeg" } })); } catch { /* full */ }
  return bytes;
}

// The animals in a photo, found and cut out by Grounded SAM 2 on the server.
// jpeg: a Blob already shrunk and redrawn on a canvas (so no EXIF goes).
// -> { width, height, found, animals: [{ box, score, area, mask (PNG base64) }] }
export async function serverMasks(jpeg) {
  const res = await post("/api/ai/outline", jpeg, "image/jpeg", OUTLINE_WAIT);
  return res.json();
}
