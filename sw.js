const CACHE_NAME = 'ahorros-hormiga-v3';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './vendor/firebase-app-compat.js',
  './vendor/firebase-firestore-compat.js',
  './vendor/confetti.browser.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
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
  // Solo se guardan peticiones GET (las demás no se pueden guardar en la caché)
  if (event.request.method !== 'GET') return;

  // Ignorar Firebase para evitar bloqueos en la base de datos
  if (event.request.url.includes('firestore.googleapis.com')) {
      return; 
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, descarga la versión más nueva, actualiza la caché y la muestra
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone)).catch(() => {});
        return response;
      })
      .catch(() => {
        // Si falla (no hay internet), saca la versión guardada de la memoria
        return caches.match(event.request);
      })
  );
});