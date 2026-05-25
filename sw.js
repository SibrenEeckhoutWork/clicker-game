/* ============================================================
   PORTFOLIO CLICKER — SERVICE WORKER
   Cache-first for local assets, network-first for fonts.
   ============================================================ */

const CACHE = 'portfolio-clicker-sw-v1';

const LOCAL_ASSETS = [
  './index.html',
  './config.js',
  './game.js',
  './styles.css',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg',
];

const FONT_HOST = 'fonts.googleapis.com';
const FONT_GSTATIC = 'fonts.gstatic.com';

// ── Install: pre-cache local assets ─────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(LOCAL_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: delete stale caches ───────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Fonts: stale-while-revalidate (serve cached, refresh in bg)
  if (url.hostname === FONT_HOST || url.hostname === FONT_GSTATIC) {
    e.respondWith(staleWhileRevalidate(e.request));
    return;
  }

  // Same-origin local assets: cache-first
  if (url.origin === self.location.origin) {
    e.respondWith(cacheFirst(e.request));
    return;
  }

  // Everything else (CDN, analytics): network only
  e.respondWith(fetch(e.request));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res.ok) {
    const cache = await caches.open(CACHE);
    cache.put(req, res.clone());
  }
  return res;
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then((res) => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached || fetchPromise;
}
