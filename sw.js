const CACHE_NAME = 'ahorros-hormiga-v2';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// Instalar y forzar al Service Worker a activarse inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Limpiar cachés viejas cuando hay una nueva versión (v2, v3, etc.)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia "Network First" (Priorizar Internet)
self.addEventListener('fetch', event => {
  // Ignorar Firebase para evitar bloqueos en la base de datos
  if (event.request.url.includes('firestore.googleapis.com')) {
      return; 
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, descarga la versión más nueva, actualiza la caché y la muestra
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => {
        // Si falla (no hay internet), saca la versión guardada de la memoria
        return caches.match(event.request);
      })
  );
});