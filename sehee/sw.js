/* 세희 깡통 — 앱 껍데기를 폰에 담아두는 일꾼.
   VERSION 을 올려서 올리면 폰이 새 껍데기를 받아 대기시키고, 켤 때 보스에게 묻는다(v1.3.9).
   v1.4.2 — 받은 index.html 버전이 VERSION 과 같을 때만 받는다.
   v1.5.0 — 본체가 css/app.css · js/*.js 로 쪼개짐. 새 파일을 만들면 아래 CODE 목록에도 꼭 넣는다(안 넣으면 오프라인·업데이트 때 빠짐).
            CODE 파일은 주소 뒤에 ?v=VERSION 을 붙여 받는다 — 중간 캐시에 남은 옛 파일이 새 index.html 과 섞이지 않게.
   데이터(판)는 IndexedDB 에 따로 있어서 껍데기가 바뀌어도 그대로다. */
const VERSION = 'v1.5.9';
const CACHE = 'sehee-' + VERSION;
/* 본체 코드 — index.html 의 <script src> 순서 그대로 */
const CODE = ['./css/app.css',
  './js/dev.js', './js/base.js', './js/settings.js', './js/update.js', './js/ai.js', './js/ocr.js', './js/report.js', './js/people.js', './js/work.js', './js/bonus-api.js', './js/sync.js', './js/job.js', './js/docs.js', './js/office.js', './js/views.js', './js/calendar.js', './js/board.js', './js/boot.js'];
const SHELL = [...CODE, './', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './art/loading.webp', './art/bg-office.webp', './art/desk.webp', './art/papers.webp', './art/monitor.webp',
  './art/s-lean.webp', './art/s-hip.webp', './art/s-think.webp', './art/s-smug.webp', './art/s-talk.webp', './art/s-surprised.webp', './art/s-front.webp'];

/* v1.3.9 새 껍데기는 대기 — 대기는 늘 가장 최신 하나뿐이라 '업데이트' 한 번이면 최신 */
/* v1.4.2 (보너스 C) 올린 직후 반쯤 올라온 상태 막기 — 받은 index.html 의 APP_VERSION 이 이 VERSION 과 다르면 이번엔 받지 않는다(다음 확인 때 다시) */
async function getShell(){
  const c = await caches.open(CACHE);
  const got = await Promise.all(SHELL.map(async u => { const r = await fetch(new Request(CODE.includes(u) ? u + '?v=' + VERSION : u, { cache: 'reload' })); if (!r.ok) throw new Error(u + ' ' + r.status); return [u, r]; }));
  for (const [u, r] of got){
    if (u !== './' && u !== './index.html') continue;
    const t = await r.clone().text();
    if (!t.includes("APP_VERSION = '" + VERSION + "'")){ await caches.delete(CACHE); throw new Error('index.html 이 아직 ' + VERSION + ' 이 아님'); }
  }
  await Promise.all(got.map(([u, r]) => c.put(u, r)));
}

self.addEventListener('install', e => {
  e.waitUntil(getShell());   /* v1.3.9 받아 두기만 — 켤 때 보스에게 묻고 '업데이트'면 skip */
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('sehee-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });

/* 안드로이드 공유하기(v0.7) — 사진·txt·글을 POST 로 받아 'share-inbox' 에 넣어 두고 화면으로 넘긴다.
   (이름이 sehee- 로 시작하지 않아서 새 버전이 와도 안 지워진다) */
async function stashShare(req){
  const scope = self.registration.scope;
  try{
    const fd = await req.formData(), c = await caches.open('share-inbox');
    for (const k of await c.keys()) await c.delete(k);
    const meta = { at:Date.now(), title:String(fd.get('title') || ''), text:String(fd.get('text') || ''), url:String(fd.get('url') || ''), files:[] };
    let i = 0;
    for (const f of fd.getAll('files')){
      if (!f || typeof f === 'string') continue;
      const key = new URL('./__share/' + (i++), scope).href;
      await c.put(key, new Response(f, { headers:{ 'content-type':f.type || 'application/octet-stream' } }));
      meta.files.push({ key, name:f.name || '', type:f.type || '' });
    }
    await c.put(new URL('./__share/meta', scope).href, new Response(JSON.stringify(meta), { headers:{ 'content-type':'application/json' } }));
  }catch(err){}
  return Response.redirect(new URL('./?shared=1#office', scope).href, 303);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method === 'POST' && new URL(req.url).pathname.endsWith('/share-target')){ e.respondWith(stashShare(req)); return; }
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

/* 알림을 누르면 열린 세희로, 없으면 새로 (v0.7.2) */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './#office', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type:'window', includeUncontrolled:true }).then(list => {
    for (const c of list){ if (c.url.startsWith(self.registration.scope)) return c.focus(); }   /* 하던 일이 끊기지 않게 새로 고치지 않는다 */
    return self.clients.openWindow(url);
  }));
});
