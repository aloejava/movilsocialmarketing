const CACHE_NAME = 'msm-cache-v1';
const urlsToCache = [
  '/msm/',
  '/msm/index.html',
  '/msm/logo.png',
  '/msm/logo-192.png',
  '/msm/logo-512.png',
  '/msm/manifest.json',
  '/msm/offline.html'
];

const offlineFallbackPage = '/msm/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(offlineFallbackPage))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});
