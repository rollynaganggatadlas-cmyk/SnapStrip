/* ============================================================
   SnapStrip – Service Worker (offline caching)
   ============================================================ */

const CACHE_NAME = 'snapstrip-christmas-v30'; // Bumped to v28!
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
  './assets/poses/meme1.jpg',
  './assets/poses/meme2.jpg',
  './assets/poses/meme3.jpg',
  './assets/poses/meme4.jpg',
  './assets/poses/meme5.jpg',
  './assets/poses/meme6.jpg',
  './assets/poses/meme7.jpg',
  './assets/poses/meme8.jpg',
  './assets/poses/meme9.jpg',
  './assets/poses/meme10.jpg',
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
        if (res.ok && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
