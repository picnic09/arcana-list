const CACHE_NAME = "arcana-cache-v1"; // ←バージョン番号を上げる

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./index.html",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    })
  );
  self.skipWaiting(); // ←インストール後すぐに有効化
});

self.addEventListener("activate", e => {
  // 古いキャッシュを削除
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim(); // ←すぐにコントロールを引き継ぐ
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
