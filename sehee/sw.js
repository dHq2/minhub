/* 세희 깡통 — 앱 껍데기를 폰에 담아두는 일꾼.
   VERSION 을 올려서 올리면 폰이 새 껍데기를 받아 대기시키고, 화면에 「새 버전」 띠가 뜬다.
   데이터(판)는 IndexedDB 에 따로 있어서 껍데기가 바뀌어도 그대로다. */
const VERSION = 'v0.6.6';
const CACHE = 'sehee-' + VERSION;
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './art/bg-office.webp', './art/desk.webp', './art/papers.webp', './art/monitor.webp',
  './art/s-lean.webp', './art/s-hip.webp', './art/s-think.webp', './art/s-smug.webp', './art/s-talk.webp', './art/s-surprised.webp', './art/s-front.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('sehee-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate'){
    /* 공유하기로 ?text=… 가 붙어 와도 같은 화면을 내준다 */
    e.respondWith(caches.match('./index.html').then(r => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
});
