/* ── 기본 (v1.5.0 에 나눔) — 상수 · 날짜 · 저장소(IndexedDB) · 상태 · 저장 · 판 그리기 · 알림 · 항목 다루기 · 아래 판 ── */
const PALETTE = ['#a13b2c','#3a6b64','#a3823f','#5f7a55','#6b5b95','#3d5a80','#8a6d3b','#7a2e2e'];
const DEFAULT_SECTIONS = [
  { id:'today', label:'오늘 할 일',    color:'#a13b2c' },
  { id:'sched', label:'다가오는 일정', color:'#3a6b64' },
  { id:'memo',  label:'기억해둘 것',   color:'#a3823f' },
  { id:'order', label:'확정된 지시',   color:'#5f7a55' },
  { id:'me',    label:'개인',          color:'#6b5b95' },
];
const TAGS = [ { k:'퇴근 전', c:'#D32029' }, { k:'미정', c:'#5C6670' } ];
const FREE_TAG = '#1B5FC1';
const FACES = ['-_-','^_^','T_T','>_<','¬_¬',';_;','o_O'];
const FS_STEPS = [ {v:.9,t:'작게'}, {v:1,t:'보통'}, {v:1.15,t:'크게'}, {v:1.3,t:'아주 크게'} ];

/* ── 날짜 ── */
const pad = n => String(n).padStart(2,'0');
const ymd = d => d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const todayStr = () => ymd(new Date());
const parseYmd = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const dayDiff = (a,b) => Math.round((parseYmd(b) - parseYmd(a)) / 86400000);
const WD = '일월화수목금토';
const dayLabel = s => { const d = parseYmd(s); return (d.getMonth()+1)+'월 '+d.getDate()+'일 ('+WD[d.getDay()]+')'; };
const uid = () => Math.random().toString(36).slice(2,8) + Date.now().toString(36).slice(-4);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ── 저장소 (이 폰 안) ── */
let dbp = null;
function idb(){
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    const r = indexedDB.open('sehee', 1);
    r.onupgradeneeded = () => { const db = r.result; db.createObjectStore('pans', { keyPath:'date' }); db.createObjectStore('kv'); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function tx(store, mode, fn){
  const db = await idb();
  return new Promise((res, rej) => {
    const t = db.transaction(store, mode); let out;
    const r = fn(t.objectStore(store)); if (r) r.onsuccess = () => { out = r.result; };
    t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
  });
}
const getPan   = d => tx('pans','readonly',  s => s.get(d));
const putPan   = p => tx('pans','readwrite', s => s.put(p)).then(r => { syncMark('pan:' + p.date); return r; });
const allPans  = () => tx('pans','readonly', s => s.getAll());
const allDates = () => tx('pans','readonly', s => s.getAllKeys());
const kvGet    = k => tx('kv','readonly',  s => s.get(k));
const kvSet    = (k,v) => tx('kv','readwrite', s => s.put(v,k)).then(r => { if (syncKey(k)) syncMark('kv:' + k); return r; });
const kvKeys   = () => tx('kv','readonly', s => s.getAllKeys());

/* ── 상태 ── */
const S = { settings:null, today:todayStr(), date:null, pan:null, dates:[], folded:{}, persisted:null, persistAsked:false };
const $ = id => document.getElementById(id);
const secs = () => S.settings.sections;
const secById = id => secs().find(s => s.id === id);

function emptyPan(date){ return { date, line:'', face:'-_-', items:[], inbox:[], carriedFrom:null, createdAt:Date.now(), updatedAt:Date.now() }; }

/* 오늘 판이 없으면 — 가장 최근 판에서 안 끝난 일과 받은 것을 그대로 이어받아 만든다 */
async function makeToday(date){
  const prevDate = S.dates.filter(d => d < date).sort().pop();
  const p = emptyPan(date);
  if (prevDate){
    const prev = await getPan(prevDate);
    const first = secs()[0].id;
    p.items = (prev.items || []).filter(it => !it.done).map(it => ({ ...it, sec: secById(it.sec) ? it.sec : first }));
    p.inbox = (prev.inbox || []).map(x => ({ ...x }));
    p.carriedFrom = prevDate;
  }
  await putPan(p);
  S.dates = (await allDates()).sort();
  return p;
}

async function goDate(date){
  await flush();
  let p = await getPan(date);
  if (!p && date === S.today) p = await makeToday(date);
  S.date = date; S.pan = p || null;
  render();
  window.scrollTo(0, 0); document.body.scrollTop = 0; $('main').scrollTop = 0;
}

/* ── 저장 ── */
let saveT = null;
function touch(now){
  if (!S.pan) return;
  S.pan.updatedAt = Date.now();
  clearTimeout(saveT);
  if (now) return flush(true);
  saveT = setTimeout(() => flush(true), 350);
}
async function flush(force){
  if (!saveT && !force) return;
  clearTimeout(saveT); saveT = null;
  if (!S.pan) return;
  await putPan(S.pan);
  const el = $('saved'); el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 1400);
  askPersist();
}
async function saveSettings(){ await kvSet('settings', S.settings); }
async function askPersist(){
  if (S.persistAsked) return; S.persistAsked = true;
  try{
    if (navigator.storage && navigator.storage.persist){
      S.persisted = (await navigator.storage.persisted()) || (await navigator.storage.persist());
    }
  }catch(e){}
}

/* ── 그리기 ── */
function render(){
  $('ver').textContent = APP_VERSION;
  $('day').innerHTML = esc(dayLabel(S.date)) + (S.date === S.today ? '<small>오늘</small>' : '');
  $('prev').disabled = !S.dates.some(d => d < S.date);
  $('next').disabled = S.date >= S.today;
  $('today').disabled = S.date === S.today;
  $('open').classList.toggle('on', !!S.settings.openOnly);
  $('old').classList.toggle('on', S.date !== S.today);
  $('fab').style.display = S.pan ? '' : 'none';

  const m = $('main');
  if (!S.pan){
    m.innerHTML = '<div class="empty">이 날은 판이 없어요.<br>세희가 쉬었거나, 아직 앱을 쓰기 전이에요.</div>' + footer();
    return;
  }
  /* v1.5.1 메모칸에 쓰는 중에 다시 그려져도(동기화·세희 작업) 쓰던 자리 그대로 */
  const fa = document.activeElement, fm = fa && fa.dataset && fa.dataset.memo ? { id:fa.dataset.memo, a:fa.selectionStart, b:fa.selectionEnd } : null;
  m.innerHTML = seheeBlock() + inboxBlock() + secs().map(sectionBlock).join('') + footer();
  const ta = m.querySelector('#line'); if (ta) grow(ta);
  m.querySelectorAll('textarea[data-memo].has').forEach(t => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; });
  if (fm){ const t = m.querySelector(`textarea[data-memo="${fm.id}"]`); if (t){ t.focus({ preventScroll:true }); try{ t.setSelectionRange(fm.a, fm.b); }catch(e){} } }
}

function seheeBlock(){
  const p = S.pan;
  return `<div class="sehee">
    <div class="fig">${$('seheeFig').innerHTML}<div class="cap">비서 강세희</div></div>
    <div class="bubble"><textarea id="line" rows="1" placeholder="세희 한마디">${esc(p.line)}</textarea>
      <button class="stamp" id="stamp" title="도장 바꾸기">${esc(p.face || '-_-')}</button></div>
  </div>`;
}

function inboxBlock(){
  const ib = S.pan.inbox || [];
  if (!ib.length) return '';
  const chips = secs().map(s => `<button class="chip" data-act="ibmove" data-sec="${s.id}"><span class="dot" style="background:${s.color}"></span>${esc(s.label)}</button>`).join('');
  return `<section class="inbox"><h3>받은 것 ${ib.length}<small>칸으로 옮겨 담아요 · AI가 붙으면 세희가 나눠 담아요</small></h3>
    ${ib.map(x => `<div class="ibx" data-id="${x.id}">
      <div class="ibtx">${esc(x.text)}</div>${x.text.split('\n').length > 6 || x.text.length > 260 ? '<button class="ibmore" data-act="ibexp">펼치기</button>' : ''}
      <div class="ibact">${chips}<button class="chip x" data-act="ibdel">버리기</button></div>
    </div>`).join('')}
  </section>`;
}

function sectionBlock(s, i){
  /* 지운 칸에 있던 지난 판 항목은 첫 칸에 보여준다 — 안 보이게 사라지면 안 된다 */
  const known = new Set(secs().map(x => x.id));
  const all = S.pan.items.filter(it => it.sec === s.id || (i === 0 && !known.has(it.sec)));
  const open = all.filter(it => !it.done), done = all.filter(it => it.done);
  const shown = S.settings.openOnly ? open : open.concat(done);
  const folded = S.folded[s.id];
  return `<section class="sec ${folded ? 'folded' : ''}" style="--c:${s.color}" data-sec="${s.id}">
    <div class="sh" data-act="fold"><b>${esc(s.label)}</b><span class="cnt">${open.length}${done.length ? ' · 끝남 ' + done.length : ''}</span><span class="fold">${folded ? '펼치기' : '접기'}</span></div>
    <div class="list">${shown.map(itemRow).join('')}</div>
    <div class="add"><input placeholder="+ 적기" enterkeyhint="enter" data-sec="${s.id}"><button class="ib" data-act="add">넣기</button></div>
  </section>`;
}

function itemRow(it){
  const t = it.tag ? (TAGS.find(x => x.k === it.tag)?.c || FREE_TAG) : null;
  const age = it.since && it.since < S.pan.date ? dayDiff(it.since, S.pan.date) + 1 : 0;
  const stamped = S.justDone === it.id; if (stamped) S.justDone = null;
  return `<div class="it ${it.done ? 'done' : ''}${stamped ? ' stamped' : ''}" data-id="${it.id}">
    <button class="ck" data-act="toggle" aria-label="${it.done ? '끝냄 취소' : '끝냄'}">${it.done ? '<span class="seal">完</span>' : ''}</button>
    <div class="body"><div class="tx" data-act="edit">${esc(it.text)}</div>
      <div class="meta">${it.due ? `<span class="due${it.due === S.pan.date ? ' now' : it.due < S.pan.date ? ' past' : ''}">📅 ${esc(dueText(it))}</span>` : ''}${t ? `<span class="tag" style="--c:${t}">${esc(it.tag)}</span>` : ''}${age > 1 && !it.done ? `<span class="age">${age}일째</span>` : ''}${it.by === 'sehee' ? '<span class="age">세희가 적음</span>' : ''}</div>
      <textarea class="memo${it.note ? ' has' : ''}" data-memo="${it.id}" rows="1" placeholder="✎ 메모" enterkeyhint="enter">${esc(it.note || '')}</textarea></div>
    <button class="more" data-act="menu" aria-label="더보기">⋯</button>
  </div>`;
}

function footer(){
  return `<footer>세희 깡통 ${APP_VERSION} · 데이터는 이 폰 안에만 있어요 · 백업은 ⚙ 에서</footer>`;
}

function grow(ta){ ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }

/* ── 알림 ── */
let toastT = null, undoFn = null;
function toast(msg, undo){
  dlog('알림', msg);
  $('toastMsg').textContent = msg; undoFn = undo || null;
  $('toastUndo').style.display = undo ? '' : 'none';
  $('toast').classList.add('on'); clearTimeout(toastT);
  toastT = setTimeout(() => { $('toast').classList.remove('on'); undoFn = null; }, undo ? 5000 : 2200);
}
$('toastUndo').onclick = () => { const f = undoFn; undoFn = null; $('toast').classList.remove('on'); if (f) f(); };

/* ── 항목 다루기 ── */
const findItem = id => S.pan.items.find(it => it.id === id);
function snapshot(){ return JSON.stringify({ items:S.pan.items, inbox:S.pan.inbox }); }
function restore(snap){ const o = JSON.parse(snap); S.pan.items = o.items; S.pan.inbox = o.inbox; touch(true); render(); }

function addItem(sec, text){
  text = text.trim(); if (!text) return;
  S.pan.items.push({ id:uid(), sec, text, tag:null, done:false, since:S.pan.date });
  touch(true);
}

function startEdit(row){
  const it = findItem(row.dataset.id); if (!it) return;
  const tx = row.querySelector('.tx');
  const ta = document.createElement('textarea'); ta.className = 'ed'; ta.value = it.text; ta.rows = 1;
  tx.replaceWith(ta); grow(ta); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
  ta.addEventListener('input', () => grow(ta));
  ta.addEventListener('blur', () => {
    const v = ta.value.trim();
    if (!v){ const snap = snapshot(); S.pan.items = S.pan.items.filter(x => x.id !== it.id); touch(true); render(); toast('지웠어요', () => restore(snap)); return; }
    if (v !== it.text){ it.text = v; touch(true); }
    render();
  }, { once:true });
}

/* ── 아래 판 ── */
function openSheet(html){ $('sheet').innerHTML = html; $('veil').classList.add('on'); $('sheet').classList.add('on'); }
function closeSheet(){ $('veil').classList.remove('on'); $('sheet').classList.remove('on'); }
$('veil').onclick = closeSheet;

function itemMenu(id){
  const it = findItem(id); if (!it) return;
  const isFree = it.tag && !TAGS.some(t => t.k === it.tag);
  openSheet(`<h4>이 일</h4><p class="q">${esc(it.text)}</p>
    <label class="t">태그</label>
    <div class="row">${TAGS.map(t => `<button class="chip ${it.tag === t.k ? 'on' : ''}" data-mact="tag" data-v="${esc(t.k)}">${esc(t.k)}</button>`).join('')}
      <button class="chip ${!it.tag ? 'on' : ''}" data-mact="tag" data-v="">없음</button></div>
    <div class="row" style="margin-top:6px"><input class="free" id="freeTag" placeholder="직접 쓰기 (예: 3시, 금요일까지)" value="${isFree ? esc(it.tag) : ''}"><button class="chip" data-mact="freetag">달기</button></div>
    <label class="t">다른 칸으로</label>
    <div class="row">${secs().filter(s => s.id !== it.sec).map(s => `<button class="chip" data-mact="move" data-v="${s.id}"><span class="dot" style="background:${s.color}"></span>${esc(s.label)}</button>`).join('')}</div>
    ${it.due ? `<p class="note" style="margin:10px 0 0">📅 ${esc(dueText(it))} <button class="chip" data-mact="nodue">날짜 지우기</button></p>` : ''}
    <hr class="s">
    <div class="row"><button class="chip danger" data-mact="del">지우기</button>${it.since ? `<span class="note" style="margin-left:auto">${esc(dayLabel(it.since))}부터</span>` : ''}</div>`);
  $('sheet').dataset.item = id;
}

$('sheet').addEventListener('click', e => {
  const b = e.target.closest('[data-mact]'); if (!b) return;
  const it = findItem($('sheet').dataset.item); if (!it) return closeSheet();
  const a = b.dataset.mact;
  if (a === 'tag'){ it.tag = b.dataset.v || null; }
  else if (a === 'nodue'){ it.due = null; it.time = null; }
  else if (a === 'freetag'){ const v = $('freeTag').value.trim(); it.tag = v || null; }
  else if (a === 'move'){ const snap = snapshot(); it.sec = b.dataset.v; touch(true); closeSheet(); render(); toast(`'${secById(b.dataset.v).label}'(으)로 옮겼어요`, () => restore(snap)); return; }
  else if (a === 'del'){ const snap = snapshot(); S.pan.items = S.pan.items.filter(x => x !== it); touch(true); closeSheet(); render(); toast('지웠어요', () => restore(snap)); return; }
  touch(true); closeSheet(); render();
});

function passSheet(){
  openSheet(`<h4>세희에게 넘기기</h4>
    <p class="note" style="margin:0 0 8px">카톡에서 복사한 내용, 메모, 무엇이든 붙여넣어요. 받은 것에 들어가요.<br>안드로이드는 카톡 메시지를 꾹 눌러 공유 → 세희로 바로 보낼 수도 있어요.</p>
    <textarea class="big" id="passText" placeholder="여기에 붙여넣기"></textarea>
    <label class="row note" style="margin-top:8px;gap:6px"><input type="checkbox" id="passSplit"> 줄마다 따로 넣기</label>
    <button class="go" id="passGo">받은 것에 넣기</button>`);
  setTimeout(() => $('passText').focus(), 220);
  $('passGo').onclick = () => {
    const raw = $('passText').value.trim(); if (!raw) return closeSheet();
    const parts = $('passSplit').checked ? raw.split('\n').map(s => s.trim()).filter(Boolean) : [raw];
    receive(parts);
    closeSheet();
  };
}

/* 받은 것은 언제나 오늘 판에 들어간다 */
async function receive(parts){
  if (S.date !== S.today) await goDate(S.today);
  for (const t of parts) S.pan.inbox.push({ id:uid(), text:t, at:Date.now() });
  touch(true); render();
  toast(parts.length > 1 ? `받은 것에 ${parts.length}개 들어왔어요` : '받은 것에 들어왔어요');
}
