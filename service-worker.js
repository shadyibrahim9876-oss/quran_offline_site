const CACHE_NAME = 'quran_offline_site_v2'; // غيّر الرقم عند أي تحديث
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/surahs.json',
    '/manifest.json',
    // لو في ملفات صوتية ثابتة أو أي صور، أضفهم هنا
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // يجبر التفعيل فورًا
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); // مسح الكاش القديم
                    }
                })
            );
        })
    );
    self.clients.claim(); // يربط الـ service worker بالصفحات فورًا
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
    );
});
