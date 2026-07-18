const CACHE = 'galactic-drop-neon-v2-4-0';
const ASSETS = [
  './', './index.html', './style.css', './app.js', './manifest.json',
  './assets/icon-192.png', './assets/icon-512.png', './assets/logo-djkizomba-galactic.png',
  './assets/cover-only-jha-knows.png', './assets/only-jha-knows.mp3',
  './assets/cover-starlight-v2.png', './assets/cover-starlight.svg', './assets/cover-lovely.svg', './assets/cover-rayon.svg',
  './assets/cover-waka.svg', './assets/cover-level.svg', './assets/cover-default.svg', './assets/cover-ma-vie.svg', './assets/cover-voice-frequency.svg'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => caches.match('./index.html'))));
});
