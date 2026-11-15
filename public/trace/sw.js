// Trace's service worker: keeps the app (page, code, animal outlines and
// icons) on the device so Trace opens and works with no internet.
//
// Files come from the network when it answers quickly, so updates show up
// straight away, and from the cache otherwise. /api/* is never cached here:
// drawings are kept in IndexedDB and synced by sync.js.
//
// Add new files Trace needs offline to FILES and bump VERSION.

const VERSION = "trace-v1";
const FILES = [
  "./",
  "app.js",
  "sync.js",
  "local.js",
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
      if (key.startsWith("trace-") && key !== VERSION) await caches.delete(key);
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
