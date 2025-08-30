const CACHE_NAME='quran-site-v3';
const CORE_ASSETS=['/','index.html','style.css?v=3','script.js?v=3','manifest.json',
'adhkar.html','ruqyah.html','duaa_dead.html','ahadith.html',
'adhkar.json','ruqyah.json','duaa_dead.json','ahadith.json','surahs.json?v=3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE_ASSETS))); self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null)))); self.clients.claim();});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('.mp3')) return; // لا نكاش الصوتيات
  if(e.request.method==='GET'){
    e.respondWith(
      caches.match(e.request).then(cached=> cached || fetch(e.request).then(resp=>{
        const cloned=resp.clone();
        caches.open(CACHE_NAME).then(c=>{ if(e.request.url.startsWith(self.location.origin)) c.put(e.request, cloned); });
        return resp;
      }).catch(()=>cached))
    );
  }
});