const CACHE_NAME = 'quran-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/surahs.json',
  '/adhkar.html',
  '/adhkar.json',
  '/ahadith.html',
  '/ahadith.json',
  '/duaa_dead.html',
  '/duaa_dead.json',
  '/ruqyah.html',
  '/ruqyah.json',
  '/icon-192.png',
  '/icon-512.png'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// تفعيل الـ Service Worker وتحديث النسخة
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      )
    )
  );
});

// التقاط الطلبات واستخدام الكاش أولاً
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
