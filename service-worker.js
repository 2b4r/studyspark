const VERSION = 'studyspark-v6';
const BASE = new URL('./', self.location).pathname;

const ASSETS = [
  BASE, BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c=>c.put(req, copy)); return res;
    }).catch(()=>caches.match(req).then(r=>r||caches.match(BASE + 'index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
