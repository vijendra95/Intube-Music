const CACHE_NAME = 'intube-music-v2';
const OFFLINE_URL = '/';

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete ALL old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy: always try network, fall back to cache only for navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL) || new Response('Offline'))
    );
    return;
  }

  // For all other requests (JS, CSS, API, images) — always use network, no caching
  event.respondWith(fetch(event.request));
});
