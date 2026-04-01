
const CACHE_NAME = "freshcatch-v1";
const URLS = [
  "./",
  "./index.html",
  "./track.html",
  "./admin.html",
  "./admin-login.html",
  "./styles.css",
  "./app.js",
  "./config.js",
  "./admin-auth.js",
  "./admin-dashboard.js",
  "./manifest.json",
  "./assets/freshcatch-logo-trimmed.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS)).catch(()=>{}));
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request).catch(() => caches.match("./index.html")))
  );
});
