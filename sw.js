/**
 * Jonli Algebra — Service Worker (PWA Offline-First)
 * 100% Offline ta'lim imkoniyati — internetsiz ham barcha darslar va sahnalar ishlaydi.
 */
var CACHE_NAME = "jonli-algebra-v2";
var PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./assets/icons/favicon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./css/base.css",
  "./css/dashboard.css",
  "./css/dars.css",
  "./js/darslar.js",
  "./js/progress.js",
  "./js/dashboard.js",
  "./js/board.js",
  "./js/features.js",
  "./js/dars-render.js",
  "./js/sahna-base.js",
  "./js/sahna-x2-parabola.js",
  "./js/sahna-abc-parabola.js",
  "./js/sahna-unit-circle.js",
  "./js/sahna-trig-add.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS).catch(function (err) {
        console.warn("Precache failed for some assets, continuing...", err);
      });
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  var url = new URL(event.request.url);
  // Do not intercept external requests if any
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        // Cache hit — serve cached, update cache in background
        fetch(event.request).then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(function () {});
        return cachedResponse;
      }

      // Cache miss — fetch from network, cache response
      return fetch(event.request).then(function (networkResponse) {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        var responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(function () {
        // Offline fallback for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
