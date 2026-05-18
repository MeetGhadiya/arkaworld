const CACHE = 'arkaworld-v5';
const ASSETS = [
  '/', '/index.html', '/products.html', '/about.html', '/contact.html',
  '/faq.html', '/product-detail.html',
  '/css/style.css', '/js/main.js', '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(
        ASSETS.map(url => 
          fetch(url, { credentials: 'same-origin' })
            .then(res => res.ok ? cache.put(url, res) : Promise.reject('failed'))
            .catch(() => console.warn(`Failed to cache: ${url}`))
        )
      ))
      .then(() => self.skipWaiting())
      .catch(err => console.error('Cache install error:', err))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});
