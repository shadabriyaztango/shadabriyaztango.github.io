/* Service worker for the Pin app.
   Bump CACHE whenever a cached file changes. */

const CACHE = 'pin-v1';

const ASSETS = [
  './',
  './index.html',
  './pin.css',
  './pin.js',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          // Only our own caches — the origin's cache store is shared with the
          // other service worker on this site.
          .filter((k) => k.startsWith('pin-') && k !== CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Map tiles: always network, never cached — they'd blow out the cache.
  if (url.hostname.endsWith('tile.openstreetmap.org')) return;

  // Same-origin: cache-first, falling back to the network.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => caches.match('./index.html'))
      )
    );
    return;
  }

  // Cross-origin (fonts, Leaflet): network-first, falling back to cache.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
