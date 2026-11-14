/* ── 체험 공간 (v1.5.28, A) — 주소에 ?space=이름 을 붙이면 이 탭만 따로 된 빈 세희가 된다(로그인 없는 새 사용자처럼).
   이 기기의 저장(localStorage·IndexedDB)을 이름표를 붙여 나눠 쓴다 — 원래 세희 기록은 안 보이고 안 건드린다. 같은 탭에선 새로 고쳐도 유지.
   나가기: 주소에 ?space= (빈 값) 또는 새 탭에서 원래 주소. 개발자가 같은 크롬 탭에서 같이 보며 시험할 때 쓴다. */
(function(){
  let sp = null; const q = new URLSearchParams(location.search);
  try{ if (q.has('space')){ sp = q.get('space').trim().slice(0, 20); if (sp) sessionStorage.setItem('sehee.space', sp); else sessionStorage.removeItem('sehee.space'); } else sp = sessionStorage.getItem('sehee.space'); }catch(e){}
  if (!sp) return;
  window.SEHEE_SPACE = sp;
  const P = 'space~' + sp + '~', SP = Storage.prototype, g = SP.getItem, st = SP.setItem, rm = SP.removeItem;
  SP.getItem = function(k){ return g.call(this, this === localStorage ? P + k : k); };
  SP.setItem = function(k, v){ return st.call(this, this === localStorage ? P + k : k, v); };
  SP.removeItem = function(k){ return rm.call(this, this === localStorage ? P + k : k); };
  if (q.has('space')){ q.delete('space'); const rest = q.toString(); history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + location.hash); }   /* v1.5.31: ?sync= 같은 다른 값은 남김 */
  addEventListener('DOMContentLoaded', () => { const b = document.createElement('div'); b.id = 'spaceBar'; b.textContent = '🧪 체험 공간 · ' + sp + ' — 원래 세희와 따로예요'; document.body.appendChild(b); document.body.classList.add('space'); });
})();
/* ── 개발자 로그 (v1.2.8) — 프로그램이 도는 걸 실시간으로 적는다. 설정에서 켠 기기에서만 「로그」 탭이 보인다.
   메모리에 600줄, 이 기기 localStorage 에 마지막 300줄(새로 고침해도 남게). v1.5.21 부터 계정 서버로도(아래 개발 블랙박스). */
const DBG = { lines:[], max:600, seq:0, paused:false, filter:'all', subs:new Set(), dirty:false };
try{ DBG.lines = JSON.parse(localStorage.getItem('sehee.dbg') || '[]'); DBG.seq = DBG.lines.length ? DBG.lines[DBG.lines.length - 1].n : 0; }catch(e){}
function dlog(cat, msg, data){
  const l = { n:++DBG.seq, t:Date.now(), c:cat, m:String(msg).slice(0, 400) };
  if (data !== undefined){ try{ l.d = typeof data === 'string' ? data.slice(0, 4000) : JSON.stringify(data, (k, v) => typeof v === 'string' && v.length > 600 ? v.slice(0, 600) + '…(' + v.length + '자)' : v).slice(0, 4000); }catch(e){ l.d = String(data); } }
  DBG.lines.push(l); if (DBG.lines.length > DBG.max) DBG.lines.splice(0, DBG.lines.length - DBG.max);
  DBG.dirty = true; for (const f of DBG.subs) try{ f(l); }catch(e){}
}
setInterval(() => { if (!DBG.dirty) return; DBG.dirty = false; DBG.up = true; try{ localStorage.setItem('sehee.dbg', JSON.stringify(DBG.lines.slice(-300))); }catch(e){} }, 2000);
/* ── 개발 블랙박스 (v1.5.21, A) — 계정 서버 /log 로 새 줄만 올린다. 서버의 LOG_USERS 계정(보스)만 받고, 나머지는 서버가 '안 받음'으로 답해 바로 멈춘다.
   설정 「개발 기록 남김」(기본 켬). 쓰는 중엔 새 줄이 있으면 15초마다, 아니면 2분마다 상태만. 앱을 내릴 때 한 번 더.
   서버는 5분마다 비공개 GitHub 금고로 내보낸다(30일) — 세 방이 보스 컴퓨터 없이도 읽는다(handoff/디버그-모니터링.md). */
/* v1.5.22: 같은 브라우저에 세희 탭이 둘 열려도 서로 안 밀리게 — 기기 번호(localStorage)에 탭 번호(sessionStorage)를 붙이고, 어디까지 올렸는지는 탭마다 따로 */
const LOGUP = { sent:0, last:0, busy:false, off:false, fails:0, st:'' };
function devId(){
  let id = localStorage.getItem('sehee.devid'); if (!id){ id = Math.random().toString(36).slice(2, 8); try{ localStorage.setItem('sehee.devid', id); }catch(e){} }
  let tab = sessionStorage.getItem('sehee.tabid'); if (!tab){ tab = Math.random().toString(36).slice(2, 4); try{ sessionStorage.setItem('sehee.tabid', tab); }catch(e){} }
  return id + '-' + tab;
}
try{
  const mine = sessionStorage.getItem('sehee.logsent');
  if (mine !== null && +mine <= DBG.seq) LOGUP.sent = +mine;   /* 이 탭이 새로 고침만 한 경우 */
  else { const all = +(localStorage.getItem('sehee.logsent') || 0); LOGUP.sent = all <= DBG.seq ? all : DBG.seq; if (mine !== null) sessionStorage.removeItem('sehee.tabid'); }   /* 새 탭 — 남이 이미 올린 줄은 건너뜀 */
}catch(e){}
const logOn = () => localStorage.getItem('sehee.devlog') !== '0';
function logState(){
  try{ const p = S.pan;
    return { v:APP_VERSION, space:window.SEHEE_SPACE || null, view:curView(), busy:!!O.busy, model:AI.cfg && AI.cfg.model, observer:!!SYNC.observer, drawer:typeof DW === 'object' ? DW.open || null : null,
      pan:p ? { date:p.date, ver:p.ver && p.ver.label, open:p.items.filter(i => !i.done).length, done:p.items.filter(i => i.done).length } : null,
      people:PPL.list ? PPL.list.length : null, ties:PPL.ties ? PPL.ties.length : null, chat:O.log ? O.log.length : null,
      lastErr:(DBG.lines.filter(l => l.c === '오류').pop() || {}).m || null, syncLast:SYNC.last, dirty:SYNC.dirty.size, screen:innerWidth + 'x' + innerHeight };
  }catch(e){ return { v:typeof APP_VERSION === 'string' ? APP_VERSION : '', err:String(e) }; }
}
async function logPush(force){
  if (LOGUP.busy || LOGUP.off || !logOn() || typeof SYNC !== 'object' || !SYNC.on || SYNC.dead || !SYNC.url || !SYNC.token) return;
  const fresh = DBG.lines.filter(l => l.n > LOGUP.sent), now = Date.now();
  if (!force && !(fresh.length && now - LOGUP.last >= 15000) && now - LOGUP.last < 120000) return;
  if (LOGUP.fails && now - LOGUP.last < Math.min(300000, 15000 * 2 ** LOGUP.fails)) return;
  LOGUP.busy = true;
  try{
    const st = logState(), stj = JSON.stringify({ ...st, syncLast:0 });   /* 상태는 바뀌었을 때만(계정 서버 쓰기 아끼기) */
    if (!fresh.length && stj === LOGUP.st){ LOGUP.last = now; return; }
    const r = await fetch(SYNC.url + '/log', { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer ' + SYNC.token }, body:JSON.stringify({ dev:(myDevName() || SYNC.device || deviceName()) + (SYNC.observer && myDevName() ? ' · 관전석' : '') + ' #' + devId(), lines:fresh.slice(-300), ...(stj !== LOGUP.st ? { state:st } : {}) }), keepalive:!!force });
    const j = await r.json().catch(() => ({})); LOGUP.last = now;
    if (r.ok){ LOGUP.fails = 0; LOGUP.st = stj; if (j.logging === false) LOGUP.off = true; else if (fresh.length){ LOGUP.sent = fresh[fresh.length - 1].n; try{ sessionStorage.setItem('sehee.logsent', String(LOGUP.sent)); if (LOGUP.sent > +(localStorage.getItem('sehee.logsent') || 0)) localStorage.setItem('sehee.logsent', String(LOGUP.sent)); }catch(e){} } }
    else LOGUP.fails++;
  }catch(e){ LOGUP.fails++; LOGUP.last = now; }finally{ LOGUP.busy = false; }
}
setInterval(() => { if (!document.hidden) logPush(); }, 5000);
document.addEventListener('visibilitychange', () => { if (document.hidden) logPush(true); });
/* 누른 것 — 단추·견출지·카드. 암호 화면(#pinVeil)과 입력칸은 절대 안 적는다 */
document.addEventListener('click', e => { try{
  const b = e.target.closest('button, [data-act], [data-pp], .it .tx, a, [role="button"]'); if (!b || b.closest('#pinVeil') || b.matches('input, textarea')) return;
  const label = (b.getAttribute('aria-label') || b.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40), where = b.id ? '#' + b.id : b.dataset.act ? 'act:' + b.dataset.act : b.dataset.pp ? 'pp:' + b.dataset.pp : b.className ? '.' + String(b.className).split(' ')[0] : b.tagName.toLowerCase();
  dlog('누름', `${label || '(이름 없음)'} · ${where}`);
}catch(x){} }, true);
window.addEventListener('error', e => dlog('오류', (e.message || '스크립트 오류') + (e.filename ? ` @${e.filename.split('/').pop()}:${e.lineno}` : ''), e.error && e.error.stack));
window.addEventListener('unhandledrejection', e => dlog('오류', '처리 안 된 실패: ' + ((e.reason && e.reason.message) || e.reason), e.reason && e.reason.stack));
for (const k of ['error', 'warn']){ const o = console[k].bind(console); console[k] = (...a) => { try{ dlog(k === 'error' ? '오류' : '경고', a.map(x => x && x.message ? x.message : typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ').slice(0, 300)); }catch(e){} o(...a); }; }
document.addEventListener('visibilitychange', () => dlog('화면', document.hidden ? '앱을 내림(숨김)' : '앱으로 돌아옴'));
window.addEventListener('online', () => dlog('네트워크', '인터넷 연결됨')); window.addEventListener('offline', () => dlog('네트워크', '인터넷 끊김'));
