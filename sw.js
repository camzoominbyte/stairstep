/* Taper to Zero — offline cache.
   Bump CACHE on any deploy so installed phones pick up the new version. */
var CACHE = 'ttz-v8.0.0';
var SHELL = './index.html';
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

/* Only a real, complete, same-origin 200 is worth storing. A captive
   portal's login page, a 404 mid-deploy, or an opaque redirect all arrive
   as perfectly valid Responses — cached under the shell key, any one of
   them replaces the app with itself for as long as the phone is offline. */
function worthCaching(res) {
  return !!res && res.ok && res.status === 200 &&
    (res.type === 'basic' || res.type === 'default');
}

function put(key, res) {
  if (!worthCaching(res)) return;
  var copy = res.clone();
  caches.open(CACHE).then(function (c) { c.put(key, copy); }).catch(function () {});
}

/* addAll is atomic: one flaky fetch among ten rejects the whole install,
   the worker never activates, and the app silently has no offline copy at
   all. Cache each asset on its own and let the stragglers fail — but the
   shell is the one thing worth failing the install over.
   'reload' keeps a fresh CACHE generation from being seeded out of a stale
   HTTP cache, which would defeat the version bump entirely. */
function fetchAndPut(c, url) {
  return fetch(new Request(url, { cache: 'reload' })).then(function (res) {
    if (!worthCaching(res)) throw new Error('bad response for ' + url);
    return c.put(url, res);
  });
}

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (url) {
        return fetchAndPut(c, url).catch(function () { return null; });
      })).then(function () {
        // the shell is non-negotiable — without it there is no offline app
        return c.match(SHELL).then(function (hit) {
          return hit ? null : fetchAndPut(c, SHELL);
        });
      });
    }).then(function () { return self.skipWaiting(); })
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
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return; // let cross-origin through untouched

  var isNav = req.mode === 'navigate' || /\.html$/.test(url.pathname);

  if (isNav) {
    // network-first for pages, each cached under its OWN key — a guide
    // visit must never overwrite the app shell with guide markup
    var key = /guide\.html$/.test(url.pathname) ? './guide.html' : SHELL;
    e.respondWith(
      fetch(req).then(function (res) {
        if (worthCaching(res)) { put(key, res); return res; }
        // reachable but wrong (portal, 404, redirect): prefer the last good copy
        return caches.match(key).then(function (hit) { return hit || res; });
      }).catch(function () {
        return caches.match(key).then(function (hit) {
          // never resolve to undefined — that surfaces as a network error page
          return hit || caches.match(SHELL).then(function (shell) {
            return shell || new Response(
              '<!doctype html><meta charset="utf-8"><title>Offline</title>' +
              '<body style="font:16px system-ui;padding:2rem;color:#5b5140;background:#faf6ee">' +
              'Offline, and no cached copy on this device yet. Reconnect once and it will work from then on.',
              { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
          });
        });
      })
    );
  } else {
    // cache-first for fonts/icons/manifest
    e.respondWith(
      caches.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          put(req, res);
          return res;
        }).catch(function () {
          return new Response('', { status: 503, statusText: 'Offline' });
        });
      })
    );
  }
});
