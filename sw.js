// DiplomacySim Service Worker — v5
// Strategy: Network-first for HTML/API, Cache-first for static assets (CSS/JS/fonts).
const CACHE_VER = 'diplomacysim-v5';

// Static shell — cached on install
const STATIC_SHELL = [
  '/index.html', '/categories.html', '/leaderboard.html',
  '/login.html', '/profile.html', '/forum.html', '/result.html', '/scenario.html',
  '/style.css', '/transitions.js', '/sounds.js', '/manifest.json',
  '/js/ds-config.js', '/nav-init.js', '/favicon.svg'
];

// These origins are NEVER intercepted — let them talk directly
function shouldBypass(url) {
  return url.includes('firestore.googleapis.com')
    || url.includes('firebase')
    || url.includes('googleapis.com')
    || url.includes('cloudinary.com')
    || url.includes('pexels.com')
    || url.includes('gstatic.com');
}

// ── Install: pre-cache shell ─────────────────────────────────────
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_VER)
      .then(function(cache) { return cache.addAll(STATIC_SHELL); })
      .catch(function(err) { console.warn('[SW] install cache failed:', err); })
  );
  self.skipWaiting();
});

// ── Activate: purge old caches ───────────────────────────────────
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_VER; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────
self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = req.url;
  if (shouldBypass(url)) return;

  var isHtml = req.headers.get('accept') && req.headers.get('accept').includes('text/html');

  if (isHtml) {
    // HTML: Network-first, fall back to cache
    e.respondWith(
      fetch(req).then(function(res) {
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE_VER).then(function(c){ c.put(req, clone); });
        }
        return res;
      }).catch(function() {
        return caches.match(req).then(function(r){ return r || caches.match('/index.html'); });
      })
    );
  } else {
    // Static assets (CSS/JS/images/fonts): Cache-first, update in background
    e.respondWith(
      caches.match(req).then(function(cached) {
        var networkFetch = fetch(req).then(function(res) {
          if (res && res.status === 200) {
            var clone = res.clone();
            caches.open(CACHE_VER).then(function(c){ c.put(req, clone); });
          }
          return res;
        }).catch(function(){});

        return cached || networkFetch;
      })
    );
  }
});
