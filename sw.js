const CACHE = "myco-v1";
const ASSETS = [
  "/", "/index.html",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  "https://cdn.tailwindcss.com"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const { request } = event;
  // Network-first for API calls, cache-first for static assets
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(request, clone)).catch(()=>{});
        return r;
      }).catch(() => caches.match(request))
    );
  } else {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(request, clone)).catch(()=>{});
        return r;
      }))
    );
  }
});
