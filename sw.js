const CACHE_NAME = 'ahorros-hormiga-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// Instalar y guardar en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para que funcione offline (excepto Firebase)
self.addEventListener('fetch', event => {
  // Ignorar las peticiones a Firestore (deben ir por red)
  if (event.request.url.includes('firestore.googleapis.com')) {
      return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo en caché si existe, si no, lo busca en internet
        return response || fetch(event.request);
      })
  );
});