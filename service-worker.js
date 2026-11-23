/* ============================================================
   SnapStrip – Service Worker (offline caching)
   ============================================================ */

const CACHE_NAME = 'snapstrip-christmas-v14';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/camera.css',
  './css/responsive.css',
  './js/app.js',
  './js/camera.js',
  './js/pose-guide.js',
  './js/countdown.js',
  './js/capture.js',
  './js/filters.js',
  './js/photostrip.js',
  './js/download.js',
  './assets/poses/pointing.svg',
  './assets/poses/peace-sign.svg',
  './assets/poses/finger-heart.svg',
  './assets/poses/cute-pose.svg',
  './assets/icons/favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Network-first for navigation (so updates land), cache-first for assets
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Only cache same-origin successful responses
        if (res.ok && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
