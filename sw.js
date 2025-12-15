self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("dna-brain").then(cache =>
      cache.addAll(["./", "./index.html", "./style.css", "./brain.js"])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
