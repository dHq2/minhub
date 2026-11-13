/* ── 개발자 로그 (v1.2.8) — 프로그램이 도는 걸 실시간으로 적는다. 설정에서 켠 기기에서만 「로그」 탭이 보인다.
   메모리에 600줄, 이 기기 localStorage 에 마지막 300줄(새로 고침해도 남게). 서버로는 안 올린다. */
const DBG = { lines:[], max:600, seq:0, paused:false, filter:'all', subs:new Set(), dirty:false };
try{ DBG.lines = JSON.parse(localStorage.getItem('sehee.dbg') || '[]'); DBG.seq = DBG.lines.length ? DBG.lines[DBG.lines.length - 1].n : 0; }catch(e){}
function dlog(cat, msg, data){
  const l = { n:++DBG.seq, t:Date.now(), c:cat, m:String(msg).slice(0, 400) };
  if (data !== undefined){ try{ l.d = typeof data === 'string' ? data.slice(0, 4000) : JSON.stringify(data, (k, v) => typeof v === 'string' && v.length > 600 ? v.slice(0, 600) + '…(' + v.length + '자)' : v).slice(0, 4000); }catch(e){ l.d = String(data); } }
  DBG.lines.push(l); if (DBG.lines.length > DBG.max) DBG.lines.splice(0, DBG.lines.length - DBG.max);
  DBG.dirty = true; for (const f of DBG.subs) try{ f(l); }catch(e){}
}
setInterval(() => { if (!DBG.dirty) return; DBG.dirty = false; DBG.up = true; try{ localStorage.setItem('sehee.dbg', JSON.stringify(DBG.lines.slice(-300))); }catch(e){} }, 2000);
/* 개발자 로그를 켠 기기는 10초마다 마지막 300줄을 계정 서버에도 올린다 — 개발자가 같이 보며 원인을 찾게(v1.3.1) */
setInterval(() => { try{ if (!DBG.up || localStorage.getItem('sehee.dev') !== '1' || typeof kvSet !== 'function') return; DBG.up = false; kvSet('dbg', { at:Date.now(), v:APP_VERSION, lines:DBG.lines.slice(-300) }); }catch(e){} }, 10000);
window.addEventListener('error', e => dlog('오류', (e.message || '스크립트 오류') + (e.filename ? ` @${e.filename.split('/').pop()}:${e.lineno}` : ''), e.error && e.error.stack));
window.addEventListener('unhandledrejection', e => dlog('오류', '처리 안 된 실패: ' + ((e.reason && e.reason.message) || e.reason), e.reason && e.reason.stack));
for (const k of ['error', 'warn']){ const o = console[k].bind(console); console[k] = (...a) => { try{ dlog(k === 'error' ? '오류' : '경고', a.map(x => x && x.message ? x.message : typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ').slice(0, 300)); }catch(e){} o(...a); }; }
document.addEventListener('visibilitychange', () => dlog('화면', document.hidden ? '앱을 내림(숨김)' : '앱으로 돌아옴'));
window.addEventListener('online', () => dlog('네트워크', '인터넷 연결됨')); window.addEventListener('offline', () => dlog('네트워크', '인터넷 끊김'));
