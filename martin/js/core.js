/* martin/js/core.js — 기본 도구 · 상태 · 기기/계정 저장 · 사진 보관. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const hash = s => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const KINDS = { person:'인물', clue:'단서', doc:'문서', place:'장소', time:'시각', question:'의문', photo:'사진', brief:'사건' };

const OPEN = ['왔군, 동료.', '취재해 온 건 사진이든 대화든 다 꺼내 봐라. 무슨 일이 있었는지는 내가 꿰어 내지.'];

/* ── 상태 ── */
const MODELS = [['claude-sonnet-5-5', 'Sonnet 5.5', '기본 · 균형'], ['claude-opus-5-5', 'Opus 5.5', '깊이 · 느림'], ['claude-haiku-5-5', 'Haiku 5.5', '빠름 · 가벼움']];
const EFFORTS = [['low', '낮음'], ['medium', '중간'], ['high', '높음']];
let AI = { model:'claude-sonnet-5-5', effort:'medium' };
try{ const a = JSON.parse(localStorage.getItem('drmartin.ai') || 'null'); if (a && MODELS.some(m => m[0] === a.model) && EFFORTS.some(e => e[0] === a.effort)) AI = a; }catch(e){}
const brainTxt = () => MODELS.find(m => m[0] === AI.model)[1].replace(' 5.5', '') + ' · ' + EFFORTS.find(e => e[0] === AI.effort)[1];
let S = null, busy = false, att = [], sampleFn, canImg = false, curLines = [];
const KEY = 'drmartin.v2', SID = Math.random().toString(36).slice(2, 8);
const newId = () => { const d = new Date(); return String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'); }; const _nid = newId; /* 날짜 */
const caseId = () => _nid() + '-' + Math.random().toString(36).slice(2, 6);
function fresh(){
  const s = { v:3, id:caseId(), nodes:[], links:[], suspect:null, hyp:{ n:0, title:'', body:'', confidence:0, culprit:null, alts:[] }, log:[], memo:[], notes:[], nmax:0, ev:[], emax:0, turn:0, nid:2, at:Date.now() };
  s.nodes.push({ id:'n1', kind:'brief', title:'새 사건', note:'아직 아무것도 없다. 사진이나 대화를 가져와라.', x:1000, y:1000, r:-1.5 });
  return s;
}
function load(){ try{ const t = localStorage.getItem(KEY); if (t){ const s = JSON.parse(t); if (s && (s.v === 2 || s.v === 3)) return s; } }catch(e){} return fresh(); }
const clone = o => JSON.parse(JSON.stringify(o));
let saveT = 0;
/* v0.3 실시간 저장 — 바뀔 때마다 기기에 바로, 계정 저장소엔 0.9초 모아서 */
const slim = (k, v) => k === 'mid' || k === 'big' ? undefined : v;   /* 기기 저장엔 미리보기만 — 큰 사본은 보관함·저장소에 */
function save(){ S.at = Date.now(); try{ localStorage.setItem(KEY, JSON.stringify(S, slim)); }catch(e){}
  clearTimeout(saveT); saveT = setTimeout(dbSave, 900); if (typeof undoTick === 'function') undoTick(); }   /* 11-16 C: 되돌리기 칸 쌓기(undo.js) */
/* ── 계정 저장소 (v0.3) ──
   state/board = 지금 판(사진 몸통 빼고) · cases/<사건> = 사건마다 마지막 판 · turns/<사건>-<턴> = 프롬프트·날것 답·판 · logs/<사건>-<접속>-<묶음> = 행동·대화 120줄씩
   사진 = assets(원본 1600px) → 카드엔 asset id. assets 가 없으면 photos/<사건>-<카드> 에 1000px 사본 */
let DB = null, AS = null; const pending = [], W8 = {};
function put(path, data){   /* 한 문서에 한 번에 하나만 쓴다 — 쓰는 중이면 마지막 것만 기다렸다가 */
  if (!DB) return; const w = W8[path] || (W8[path] = { busy:false, next:null });
  if (w.busy){ w.next = data; return; } w.busy = true;
  DB.doc(path).set(data).catch(e => { if (e && e.code === 'quota_exceeded') toastNote('계정 저장소가 가득 찼다. 기록은 기기에만 남는다.'); })
    .finally(() => { w.busy = false; if (w.next){ const d = w.next; w.next = null; put(path, d); } });
}
let LB = { k:0, items:[], cid:'' }, logT = 0;
function log(type, data){
  const e = { ts:Date.now(), at:new Date().toISOString(), sid:SID, cid:S ? S.id : '', type, ...data };
  try{ const a = JSON.parse(localStorage.getItem('drmartin.log') || '[]'); a.push(e); localStorage.setItem('drmartin.log', JSON.stringify(a.slice(-600))); }catch(x){}
  if (type === 'turn'){ const k = `turns/${e.cid}-${e.n || 0}${e.ok ? '' : '-f' + e.ts}`; if (DB) put(k, e); else pending.push([k, e]); return; }
  if (LB.cid !== e.cid){ flushLog(); LB = { k:0, items:[], cid:e.cid }; }
  LB.items.push(e); if (LB.items.length >= 120){ flushLog(); LB = { k:LB.k + 1, items:[], cid:LB.cid }; }
  clearTimeout(logT); logT = setTimeout(flushLog, 1500);
}
function flushLog(){ if (!LB.items.length || !LB.cid) return; const k = `logs/${LB.cid}-${SID}-${LB.k}`, d = { cid:LB.cid, sid:SID, k:LB.k, items:LB.items.slice() }; if (DB) put(k, d); else pending.push([k, d]); }
addEventListener('pagehide', () => { flushLog(); dbSave(); });
document.addEventListener('visibilitychange', () => { if (document.hidden){ flushLog(); dbSave(); } });
const act = (what, more) => { more = more || {}; try{ const x = typeof actRefs === 'function' ? actRefs(more) : null; if (x) more = { ...more, ...x }; }catch(e){} log('action', { act:what, ...more }); };   /* 11-17 A: id 를 이름표(카드 이름·자료·파일)로 풀고 어디서 눌렀는지 붙임(trail.js) */
const lean = n => { const { img, thumb, big, mid, h, w, ...r } = n; return r; };
const snap = () => ({ nodes:S.nodes.map(lean), links:S.links, suspect:S.suspect, hyp:S.hyp, notes:S.notes, turn:S.turn });
function toastNote(t){ try{ speak(t, false); }catch(x){} }
/* v0.4.3 빈 판은 절대 계정에 쓰지 않는다 — 새 브라우저가 빈 판으로 계정 판을 덮어쓴 사고(11-16 18:15·18:18) 방지 */
const isBlank = s => !s || !(s.log || []).some(l => l.who === 'p') && (s.nodes || []).length <= 1;
function dbSave(){ if (!DB || !S || isBlank(S)) return; try{ const { nodes, ev, ...rest } = S, d = clone({ ...rest, nodes:nodes.map(lean), ev:(ev || []).map(lean) });   /* 11-16 A: 자료함도 미리보기 빼고 */ put('state/board', d); put('cases/' + S.id, d); }catch(x){} }
function adopt(v, why){   /* 계정에서 받은 판으로 갈아탄다(사진 미리보기는 이 기기 것 살림) */
  const local = S && S.id === v.id ? S : null;
  for (const n of v.nodes || []) if (n.kind === 'photo'){ const o = local && local.nodes.find(x => x.id === n.id); if (o && (o.thumb || o.img)) n.thumb = o.thumb || o.img; }
  for (const e of v.ev || []){ const o = local && (local.ev || []).find(x => x.id === e.id); if (o && o.thumb) e.thumb = o.thumb; }
  S = v; try{ localStorage.setItem(KEY, JSON.stringify(S, slim)); }catch(x){} renderAll(); renderChat(true); fitAll(0); act(why, { cid:S.id, turn:S.turn }); dbSave();   /* 계정의 지금 판 자리도 진짜 사건으로 되돌림 */
  for (const n of S.nodes) if (n.kind === 'photo' && !n.asset && !n.thumb) DB.doc('photos/' + S.id + '-' + n.id).get().then(ph => { const p = ph && ph.exists ? ph.data() : null; if (p && p.img){ n.thumb = p.img; renderNodes(); renderStrings(); renderMarks(); } }).catch(() => {});
}
async function listCases(){ try{ const q = await DB.collection('cases').orderBy('at', 'desc').limit(30).get(); return q.docs.map(d => clone(d.data())).filter(v => v && !isBlank(v)); }catch(e){ return []; } }
async function dbStart(){
  try{ DB = window.claude ? await window.claude.use('db') : null; }catch(e){ DB = null; }
  try{ AS = window.claude ? await window.claude.use('assets') : null; }catch(e){ AS = null; }
  if (!DB) return;
  while (pending.length){ const [k, d] = pending.shift(); put(k, d); }
  try{ const d = await Promise.race([DB.doc('state/board').get(), sleep(10000).then(() => null)]);
    let v = d && d.exists ? clone(d.data()) : null;   /* 저장소가 주는 판은 얼어 있다 — 꼭 복사해서 쓴다 */
    if (busy) return;
    if (isBlank(S)){   /* 이 기기는 빈 판 — 계정 판을, 그것도 비었으면 가장 최근의 진짜 사건을 */
      if (!v || isBlank(v)){ const cs = await listCases(); v = cs[0] || null; }
      if (v && !isBlank(v)) adopt(v, '계정에서 판 불러옴');
    } else if (v && !isBlank(v) && v.at > (S.at || 0)) adopt(v, '계정에서 더 새 판 불러옴');
    else dbSave(); }catch(e){}
}
/* 사진 — 보이는 곳마다 가장 좋은 것: 보관함 원본 > 이 기기에서 방금 고른 원본 > 1000px 사본 > 미리보기 */
const photoSrc = n => n.asset ? '/_blob/' + n.asset : (n.big || n.mid || n.thumb || n.img || '');
const photoThumb = n => n.thumb || n.img || (n.asset ? '/_blob/' + n.asset : n.big || '');
async function keepPhoto(n, a, ev){   /* 11-16 A: 올린 파일 그대로(jpg·png·webp, 12MB 아래) — 글자를 다시 읽을 수 있게. 아니면 1600px */
  const raw = a.orig && /^image\/(jpeg|png|webp)$/.test(a.orig.type) && a.orig.size < 12e6 ? a.orig : null;
  if (AS){ try{ const r = await AS.upload(raw || a.blob, { type:raw ? raw.type : 'image/jpeg' }); n.asset = r.id; if (ev) ev.asset = r.id; save(); act('사진 보관', { id:n.id, kb:Math.round((r.sizeBytes || 0) / 1024) }); return; }catch(e){ act('사진 보관 실패', { id:n.id, code:e && e.code || '' }); } }
  if (DB && a.mid){ put('photos/' + S.id + '-' + n.id, { img:a.mid, cid:S.id, id:n.id }); n.pid = 1; if (ev) ev.pid = 1; save(); }
}
const nodeOf = id => S.nodes.find(n => n.id === id);

