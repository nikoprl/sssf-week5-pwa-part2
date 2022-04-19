"use strict";
self.importScripts("./js/fetchGQL.js");
self.importScripts("./js/idb.js");
const cacheName = "hello-pwa";
const filesToCache = [
  "./",
  "./index.html",
  "./favicon.ico",
  "./css/style.css",
  "./js/fetchGQL.js",
  "./js/idb.js",
  "./js/main.js",
  "./images/pwa.png",
];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        return cache.addAll(filesToCache);
      } catch (e) {
        console.log("after install", e.message);
      }
    })()
  );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
  // console.log(e.request);
  e.respondWith(
    (async () => {
      try {
        const response = await caches.match(e.request);
        // console.log('resp', response);
        return response || fetch(e.request);
      } catch (e) {
        console.log("load cache", e.message);
      }
    })()
  );
});


self.addEventListener("sync", (e) => {
  if (e.tag == "greeting-sync") {
    console.log("onsync");
    e.waitUntil(sendToServer());
  }
});

self.addEventListener('online', function() {
  if(!navigator.serviceWorker && !window.SyncManager) {
    console.log("online");
      fetchData().then(function(response) {
          if(response.length > 0) {
              return sendToServer();
          }
      });
  }
});

self.addEventListener('offline', function() {
  alert('You have lost internet access!');
});