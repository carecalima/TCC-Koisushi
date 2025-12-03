self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("koi-sushi-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/css/login.css",
        "/js/login.js",
        "/icons/icon-192.png",
        "/icons/icon-512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
