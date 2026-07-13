/* Taper to Zero — offline cache.
   Bump CACHE on any deploy so installed phones pick up the new version. */
var CACHE = 'ttz-v3.6.0';
var ASSETS = [
  './',
  './index.html',
  './guide.html',
  './manifest.webmanifest',
  './fonts/fraunces.woff2',
  './fonts/fraunces-italic.woff2',
  './fonts/karla.woff2',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var isNav = e.request.mode === 'navigate' || e.request.url.match(/index\.html$/);
  if (isNav) {
    // network-first for the page itself, so updates land when online
    e.respondWith(
      fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      })
    );
  } else {
    // cache-first for fonts/icons/manifest
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          return res;
        });
      })
    );
  }
});
