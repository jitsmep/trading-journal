const CACHE_NAME = "antigravity-journal-v1";
const ASSETS = [
  "/",
  "/login",
  "/journal",
  "/analytics",
  "/calendar",
  "/settings",
  "/manifest.json"
];

// Install stage: Save structural pages to offline storage cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch stage: Serve offline pages instantly if internet network is gone
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
