/* ── 계정·동기화 (v1.0) — 암호를 넣으면 그 사람의 판·대화·보드·설정이 어느 브라우저에서든 열린다 ──
   · 서버: sehee-sync (Cloudflare Worker + D1). 주소는 설정 → 계정에서 넣거나 ?sync=주소 로 한 번 열면 기억한다
   · 바뀐 것만 0.8초 뒤 바로 올린다(실시간 저장). 인터넷이 끊기면 모아 뒀다가 다시 올리고, 앱을 닫는 순간에도 한 번 더 보낸다
   · 한 사람은 한 기기에서만. 다른 기기에서 암호를 넣으면 여기는 다음 확인(20초 안) 때 닫힌다
   · 서버 기록으로 덮어쓰기 전에, 이 기기에 있던 기록은 'presync' 로 따로 남겨 둔다 */
const SYNC = { url:'', token:'', user:'', device:'', last:0, on:false, dead:false, busy:false, again:false, fails:0, timer:null, dirty:new Map(), gen:0 };
const SYNC_KV = ['settings', 'ai', 'usage', 'chat', 'board', 'ailog', 'people', 'pplpics', 'pplclues', 'dbg'];   /* v1.5.5 pplpics = 인간관계 프로필 사진 · v1.5.14 pplclues = 사진 단서 글(C) */
/* 보너스(b_·c_로 시작하는 키)도 계정에 같이 — v1.3.5 / v1.4.0. v1.5.14(C) 사진 단서 사진(clue_<id>)도 한 장씩 따로 */
const SYNC_PFX = /^([bc]_|clue_)/;
function syncKey(k){ return SYNC_KV.includes(k) || SYNC_PFX.test(String(k)); }
const SYNC_LS = 'sehee-sync';
function deviceName(){
  const u = navigator.userAgent;
  const os = /Android/.test(u) ? (/Mobile/.test(u) ? '안드로이드 폰' : '안드로이드 태블릿') : /iPhone/.test(u) ? '아이폰' : /iPad/.test(u) ? '아이패드' : /Windows/.test(u) ? '윈도우 컴퓨터' : /Mac OS/.test(u) ? '맥' : /Linux/.test(u) ? '리눅스' : '기기';
  const br = /SamsungBrowser/.test(u) ? '삼성 인터넷' : /Edg\//.test(u) ? '엣지' : /Chrome\//.test(u) ? '크롬' : /Firefox\//.test(u) ? '파이어폭스' : /Safari\//.test(u) ? '사파리' : '';
  return (os + (br ? ' ' + br : '') + (matchMedia('(display-mode: standalone)').matches ? ' (앱)' : '')).trim();
}
function syncLoad(){
  try{ const o = JSON.parse(localStorage.getItem(SYNC_LS) || '{}'); Object.assign(SYNC, { url:o.url || '', token:o.token || '', user:o.user || '', device:o.device || '', last:o.last || 0 }); }catch(e){}
  try{ for (const k of JSON.parse(localStorage.getItem(SYNC_LS + '-dirty') || '[]')) SYNC.dirty.set(k, ++SYNC.gen); }catch(e){}
}
function syncKeep(){
  try{
    localStorage.setItem(SYNC_LS, JSON.stringify({ url:SYNC.url, token:SYNC.token, user:SYNC.user, device:SYNC.device, last:SYNC.last }));
    localStorage.setItem(SYNC_LS + '-dirty', JSON.stringify([...SYNC.dirty.keys()]));
  }catch(e){}
}
function syncBadge(state){
  const el = $('cloud'); if (!el) return;
  const map = { ok:['☁', '서버에 저장됨'], up:['☁…', '올리는 중'], wait:['☁!', '못 올림 — 다시 시도 중'], off:['', ''], dead:['☁✕', '다른 기기에서 열림'] };
  const [t, tip] = map[state] || map.off; el.textContent = SYNC.url && SYNC.token ? t : ''; el.title = tip; el.className = 'cloud ' + state;
}
function syncMark(key){
  if (!SYNC.on || SYNC.dead) return;
  SYNC.dirty.set(key, ++SYNC.gen); syncKeep();
  clearTimeout(SYNC.timer); SYNC.timer = setTimeout(() => syncFlush(), 800);
}
async function readLocal(k){
  if (k.startsWith('pan:')) return await getPan(k.slice(4));
  if (k.startsWith('kv:')) return await kvGet(k.slice(3));
}
const authH = () => ({ authorization:'Bearer ' + SYNC.token });
async function syncFlush(beacon){
  dlog('동기화', `↑ 올리기${beacon ? '(비콘)' : ''} · 바뀐 것 ${SYNC.dirty.size}개`);
  if (!SYNC.on || SYNC.dead || !SYNC.url || !SYNC.token || !SYNC.dirty.size) return;
  if (SYNC.busy && !beacon){ SYNC.again = true; return; }
  const snap = [...SYNC.dirty.entries()], puts = {}, dels = [];
  for (const [k] of snap){ const v = await readLocal(k); if (v === undefined || v === null) dels.push(k); else puts[k] = v; }
  const body = JSON.stringify({ puts, dels });
  if (beacon){
    /* 앱을 닫는 순간 — 작으면 한 번에 던진다(답은 못 받는다. 다음에 열 때 다시 올린다) */
    if (body.length < 60000 && navigator.sendBeacon) navigator.sendBeacon(SYNC.url + '/beacon?t=' + encodeURIComponent(SYNC.token), new Blob([body], { type:'text/plain' }));
    return;
  }
  SYNC.busy = true; syncBadge('up');
  try{
    const r = await fetch(SYNC.url + '/data', { method:'POST', headers:{ 'content-type':'application/json', ...authH() }, body });
    if (r.status === 401){ syncDead(await r.json().catch(() => ({}))); return; }
    if (!r.ok) throw new Error('HTTP ' + r.status);
    for (const [k, g] of snap) if (SYNC.dirty.get(k) === g) SYNC.dirty.delete(k);
    SYNC.last = Date.now(); SYNC.fails = 0; syncKeep(); syncBadge('ok');
  }catch(e){
    SYNC.fails++; syncBadge('wait');
    clearTimeout(SYNC.timer); SYNC.timer = setTimeout(() => syncFlush(), Math.min(30000, 1500 * 2 ** SYNC.fails));
  }finally{
    SYNC.busy = false;
    if (SYNC.again){ SYNC.again = false; clearTimeout(SYNC.timer); SYNC.timer = setTimeout(() => syncFlush(), 300); }
  }
}
async function syncCheck(){
  try{
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 6000);
    const r = await fetch(SYNC.url + '/session', { headers:authH(), signal:ctl.signal }); clearTimeout(t);
    if (r.ok) return { st:'ok' };
    if (r.status === 401){ const j = await r.json().catch(() => ({})); return { st:j.error === 'replaced' ? 'replaced' : 'out', device:j.device }; }
    return { st:'offline' };
  }catch(e){ return { st:'offline' }; }
}
/* 서버 기록 → 이 기기. 덮어쓰기 전에 이 기기 기록을 presync 로 남긴다 */
async function syncPull(){
  dlog('동기화', '↓ 서버에서 받기');
  const r = await fetch(SYNC.url + '/data', { headers:authH() });
  if (r.status === 401){ syncDead(await r.json().catch(() => ({}))); throw new Error('다른 기기에서 열렸어요'); }
  if (!r.ok) throw new Error('서버 응답 ' + r.status);
  const recs = (await r.json()).records || {}, keys = Object.keys(recs);
  if (!keys.length) return 0;
  const localPans = await allPans();
  if (localPans.length){
    const kv = {}; for (const n of SYNC_KV) kv[n] = await kvGet(n);
    const old = await kvGet('presync');
    if (!old || old.user !== SYNC.user) await tx('kv', 'readwrite', s => s.put({ at:Date.now(), user:SYNC.user, pans:localPans, kv }, 'presync'));
  }
  await tx('pans', 'readwrite', s => { s.clear(); for (const k of keys) if (k.startsWith('pan:') && recs[k].v && recs[k].v.date) s.put(recs[k].v); });
  const localB = (await kvKeys()).filter(k => SYNC_PFX.test(String(k))), names = [...new Set([...SYNC_KV, ...localB, ...keys.filter(k => /^kv:([bc]_|clue_)/.test(k)).map(k => k.slice(3))])];
  await tx('kv', 'readwrite', s => { for (const n of names){ const rec = recs['kv:' + n]; if (rec) s.put(rec.v, n); else s.delete(n); } });
  SYNC.last = Date.now(); syncKeep();
  return keys.length;
}
/* 서버가 비어 있으면 이 기기 기록을 통째로 올린다 */
async function syncUploadAll(){
  for (const d of await allDates()) SYNC.dirty.set('pan:' + d, ++SYNC.gen);
  for (const n of [...SYNC_KV, ...(await kvKeys()).filter(k => SYNC_PFX.test(String(k)))]) if ((await kvGet(n)) !== undefined) SYNC.dirty.set('kv:' + n, ++SYNC.gen);
  syncKeep(); await syncFlush();
}
function syncDead(j){
  if (SYNC.dead) return;
  SYNC.dead = true; SYNC.on = false; clearTimeout(SYNC.timer); syncBadge('dead');
  const who = j && j.device ? `다른 기기(${j.device})` : '다른 기기';
  const el = document.createElement('div'); el.id = 'deadVeil';
  el.innerHTML = `<div class="dv"><b>${j && j.error === 'replaced' ? esc(who) + '에서 열렸어요' : '로그아웃됐어요'}</b><p>여기 화면은 닫았어요. 저장은 열린 쪽에서 이어서 해요.</p><button class="chip" id="dvGo">여기서 다시 열기</button></div>`;
  document.body.appendChild(el);
  $('dvGo').onclick = () => location.reload();
}
/* 화면이 보일 때마다, 그리고 20초마다 — 아직 내 차례인지 */
setInterval(async () => { if (SYNC.on && !SYNC.dead && !document.hidden){ const c = await syncCheck(); if (c.st === 'replaced' || c.st === 'out') syncDead({ error:c.st === 'replaced' ? 'replaced' : 'logged-out', device:c.device }); } }, 20000);
document.addEventListener('visibilitychange', async () => {
  if (!SYNC.on || SYNC.dead) return;
  if (document.hidden){ clearTimeout(SYNC.timer); syncFlush(true); }
  else { const c = await syncCheck(); if (c.st === 'replaced' || c.st === 'out') syncDead({ error:c.st === 'replaced' ? 'replaced' : 'logged-out', device:c.device }); else syncFlush(); }
});
window.addEventListener('pagehide', () => { if (SYNC.on && !SYNC.dead) syncFlush(true); });
window.addEventListener('online', () => { if (SYNC.on && !SYNC.dead) syncFlush(); });

/* ── 암호 화면 — 앱을 열 때 ── */
function pinScreen(note){
  return new Promise(resolve => {
    const el = document.createElement('div'); el.id = 'pinVeil';
    el.innerHTML = `<div class="pin"><div class="pin-t">세희 · 계정 열기</div><div class="pin-d" id="pinD"><i></i><i></i><i></i><i></i></div>
      <p class="pin-m" id="pinM">${esc(note || '암호 네 자리를 눌러 주세요')}</p>
      <div class="pin-k">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-k="${n}">${n}</button>`).join('')}<button data-k="skip" class="sm">이 기기만</button><button data-k="0">0</button><button data-k="del" class="sm">지우기</button></div></div>`;
    document.body.appendChild(el);
    let v = '', busy = false;
    const dots = () => $('pinD').querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i < v.length));
    const msg = (t, bad) => { $('pinM').textContent = t; $('pinM').classList.toggle('bad', !!bad); };
    const done = r => { document.removeEventListener('keydown', onKey); el.remove(); resolve(r); };
    const go = async () => {
      busy = true; msg('여는 중…');
      try{
        const r = await fetch(SYNC.url + '/login', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ pin:v, device:deviceName() }) });
        const j = await r.json().catch(() => ({}));
        if (r.status === 429){ v = ''; dots(); msg(`너무 많이 틀려서 잠겼어요. ${Math.ceil((j.wait || 900) / 60)}분 뒤에 다시 해 주세요.`, true); busy = false; return; }
        if (!r.ok){ v = ''; dots(); el.querySelector('.pin').classList.add('shake'); setTimeout(() => el.querySelector('.pin').classList.remove('shake'), 400);
          msg(j.error === 'wrong' ? `암호가 틀렸어요${j.left ? ` · ${j.left}번 더 틀리면 15분 잠겨요` : ''}` : '서버가 이상해요: ' + (j.error || r.status), true); busy = false; return; }
        Object.assign(SYNC, { token:j.token, user:j.user, device:j.device, dead:false }); syncKeep();
        msg(`${j.user} 열었어요${j.prev ? ` · ${j.prev}는 닫혀요` : ''}`);
        if (j.records){ msg('기록 받는 중…'); await syncPull(); SYNC.on = true; }
        else { SYNC.on = true; msg('처음이라 이 기기 기록을 올리는 중…'); await syncUploadAll(); }
        syncBadge('ok'); done('in');
      }catch(e){ v = ''; dots(); msg('서버에 닿지 않아요. 인터넷을 확인하거나 「이 기기만」으로 열어 주세요.', true); busy = false; }
    };
    const press = k => {
      if (busy) return;
      if (k === 'skip'){ SYNC.on = false; done('local'); return; }
      if (k === 'del'){ v = v.slice(0, -1); dots(); return; }
      if (v.length >= 4) return;
      v += k; dots(); if (v.length === 4) go();
    };
    const onKey = e => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); };
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
  });
}
/* 앱을 열 때 맨 먼저 — 저장소를 읽기 전에 계정을 정한다 */
async function syncStart(){
  syncLoad();
  const q = new URLSearchParams(location.search), su = q.get('sync');
  if (su){ SYNC.url = su.replace(/\/+$/, ''); syncKeep(); history.replaceState(null, '', location.pathname + location.hash); }
  if (!SYNC.url) return 'local';
  let note = '';
  if (SYNC.token){
    spStep('계정 확인 중');
    const c = await syncCheck();
    if (c.st === 'ok'){
      SYNC.on = true;
      if (SYNC.dirty.size){ spStep('못 올린 기록 올리는 중'); await syncFlush(); }
      spStep('최신 기록 받는 중'); try{ await syncPull(); }catch(e){}
      syncBadge(SYNC.dead ? 'dead' : 'ok'); return 'in';
    }
    if (c.st === 'offline'){ SYNC.on = true; syncBadge('wait'); return 'offline'; }
    note = c.st === 'replaced' ? `${c.device || '다른 기기'}에서 열려서 여기는 닫혔어요. 다시 열려면 암호를 눌러 주세요.` : '';
    SYNC.token = ''; SYNC.dirty.clear(); syncKeep();
  }
  spStep('암호를 기다리는 중');
  return await pinScreen(note);
}
async function syncLogout(){
  try{ await syncFlush(); await fetch(SYNC.url + '/logout', { method:'POST', headers:authH() }); }catch(e){}
  SYNC.token = ''; SYNC.on = false; SYNC.dirty.clear(); syncKeep(); location.reload();
}
function syncLine(){
  if (!SYNC.url) return '계정 서버가 아직 없어요. 서버 주소를 넣으면 앱을 열 때 암호를 물어요.';
  if (!SYNC.token || !SYNC.on) return '이 기기만 쓰는 중이에요(계정으로 안 열었어요).';
  const t = SYNC.last ? new Date(SYNC.last) : null;
  return `${SYNC.user} · ${SYNC.device || deviceName()} 에서 열림 · 마지막으로 올린 때 ${t ? pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds()) : '아직'}${SYNC.dirty.size ? ` · 올릴 것 ${SYNC.dirty.size}개` : ''}`;
}
