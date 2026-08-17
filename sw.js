/* =========================================================
   SERVICE WORKER — Órtesis Center
   Estrategia: "red primero, caché de respaldo".
   Así, cada vez que el celular tiene internet, la app carga
   SIEMPRE la versión más reciente que subiste a GitHub — no
   hay que desinstalar ni reinstalar nada. El caché solo se
   usa como respaldo si el cliente abre la app sin conexión.
   ========================================================= */

const CACHE_NAME = "ortesis-center-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/config.js",
  "./js/mock-data.js",
  "./js/app.js",
  "./manifest.json",
  "./images/logo.png",
  "./images/icon-192.png",
  "./images/icon-512.png"
];

// Al instalar: guarda una primera copia del "esqueleto" de la app
// y toma el control de inmediato (no espera a cerrar pestañas viejas).
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

// Al activarse: borra cachés de versiones anteriores del service worker.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// Estrategia de red: intenta internet primero (así siempre hay contenido
// fresco); si falla (sin señal / avión), usa lo último guardado en caché.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
