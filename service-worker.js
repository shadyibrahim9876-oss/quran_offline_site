const CACHE = 'quran-audio-v1';
const CORE = [
  './',
  './index.html',
  './assets/surahs.json',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.pathname.includes('/audio/')) {
    e.respondWith(
      caches.open(CACHE).then(async c=>{
        const cached = await c.match(e.request);
        if (cached) return cached;
        try {
          const fresh = await fetch(e.request);
          c.put(e.request, fresh.clone());
          return fresh;
        } catch (err) {
          return new Response('Offline ولم يتم تحميل هذا المقطع بعد', {status: 503});
        }
      })
    );
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});
