/* Eenvoudige offline-cache voor Run Coach. Verhoog CACHE bij elke update. */
const CACHE = "runcoach-rotterdam-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=2",
  "./app.js?v=2",
  "./coach.jpg",
  "./coach-logo.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./bartlopen-runcoach.png",
  "./manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isPagina = e.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith(".html");
  const isCode = /\.(?:js|css|json|webmanifest)$/.test(url.pathname);

  /* Pagina en code: eerst het netwerk, zodat een telefoon nooit op een oude
     versie van de app blijft hangen. Offline valt hij terug op de cache. */
  if (isPagina || isCode) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(e.request).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  /* Plaatjes en overige bestanden: uit de cache, dat is sneller en scheelt data. */
  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
    )
  );
});
