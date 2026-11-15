// Trace's service worker: keeps the app (page, code, animal outlines and
// icons) on the device so Trace opens and works with no internet.
//
// Files come from the network when it answers quickly, so updates show up
// straight away, and from the cache otherwise. /api/* is never cached here:
// drawings are kept in IndexedDB and synced by sync.js.
//
// Add new files Trace needs offline to FILES and bump VERSION.
//
// The My Animals outline maker (the U²-Net model and onnxruntime, about
// 20 MB) is cached the first time it's used, in a cache of its own that
// survives VERSION bumps. Change MODELS when those files change.

const VERSION = "trace-v2";
const MODELS = "trace-models-v1";
const FILES = [
  "./",
  "app.js",
  "sync.js",
  "local.js",
  "photo.js",
  "animals.js",
  "style.css",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "vendor/perfect-freehand/perfect-freehand.mjs",
  "/shared/apple.js",
];
const NETWORK_WAIT_MS = 2500;

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(FILES.map((f) => new Request(f, { cache: "reload" })));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("trace-") && key !== VERSION && key !== MODELS) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    // Every Trace address is the one page (screens are #hashes).
    event.respondWith(networkFirst(request, new URL("./", self.registration.scope).href));
    return;
  }
  const scope = new URL(self.registration.scope).pathname;
  if (url.pathname.startsWith(`${scope}models/`) || url.pathname.startsWith(`${scope}vendor/onnxruntime/`)) {
    event.respondWith(cacheFirst(request, url.origin + url.pathname));
    return;
  }
  if (url.pathname.startsWith(scope) || url.pathname.startsWith("/shared/")) {
    event.respondWith(networkFirst(request, url.origin + url.pathname));
  }
});

async function networkFirst(request, cacheKey) {
  const cache = await caches.open(VERSION);
  const network = fetch(request).then(async (res) => {
    if (res.ok && res.type === "basic") await cache.put(cacheKey, res.clone());
    return res;
  });
  network.catch(() => {}); // a late failure after the cache answered is fine
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_WAIT_MS, null));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
  } catch {
    // offline: fall through to the cache
  }
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  return network.catch(() => new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } }));
}

// Big files that rarely change: from the cache when there, else fetched once and kept.
async function cacheFirst(request, cacheKey) {
  const cache = await caches.open(MODELS);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok && res.type === "basic") await cache.put(cacheKey, res.clone());
  return res;
}
