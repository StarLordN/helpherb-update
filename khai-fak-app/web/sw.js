// Offline shell for the PWA. Caches the app files; falls back to the cached page when offline.
const CACHE = "khai-fak-v1";
const SHELL = [
  "./", "./index.html", "./css/styles.css",
  "./js/app.js", "./js/i18n.js", "./js/calc.js", "./js/validate.js", "./js/data.js", "./js/store.js",
  "./manifest.webmanifest", "./icon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match("./index.html")))
  );
});
