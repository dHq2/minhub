/* ── 기본 (v1.5.0 에 나눔) — 상수 · 날짜 · 저장소(IndexedDB) · 상태 · 저장 · 판 그리기 · 알림 · 항목 다루기 · 아래 판 ── */
const PALETTE = ['#a13b2c','#3a6b64','#a3823f','#5f7a55','#6b5b95','#3d5a80','#8a6d3b','#7a2e2e'];
const DEFAULT_SECTIONS = [
  { id:'today', label:'오늘 할 일',    color:'#a13b2c' },
  { id:'sched', label:'다가오는 일정', color:'#3a6b64' },
  { id:'memo',  label:'기억해둘 것',   color:'#a3823f' },
  { id:'me',    label:'개인',          color:'#6b5b95' },
];
/* v1.5.13 (C) 보편 설계 — 기본 칸·꼬리표에 직장·학원 말을 박지 않는다(누가 써도 같은 판). 개인 필요는 ⚙ 칸 더하기·이름 고치기로 */
const TAGS = [ { k:'오늘 안에', c:'#D32029' }, { k:'미정', c:'#5C6670' } ];
const TAG_OLD = { '퇴근 전':'#D32029' };   /* 예전 판에 남은 꼬리표도 같은 색으로 */
/* 예전 기본 칸 '확정된 지시'를 한 번 정리 — 이름을 안 바꾼 채 그대로면 뺀다(거기 있던 일은 판 첫 칸에 그대로 보임). 사용자가 새로 만든 칸은 건드리지 않는다 */
function panUniversal(){
  if (S.settings.uni1) return false; S.settings.uni1 = true;
  const list = S.settings.sections || [], i = list.findIndex(s => s.id === 'order' && s.label === '확정된 지시');
  if (i < 0 || list.length < 2) return true;
  list.splice(i, 1); S.uniNote = true; dlog('판', "보편 설계 — 기본 칸 '확정된 지시' 뺌"); return true;
}
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
    /* v1.5.2 (C) 「내일」 누른 일은 오늘 판에 🔁 로 다시 올라온다. 🔁 표시는 하루만 */
    p.items = (prev.items || []).filter(it => !it.done).map(it => { const x = { ...it, sec: secById(it.sec) ? it.sec : first };
      if (x.later){ delete x.later; x.back = true; } else delete x.back; return x; });
    p.inbox = (prev.inbox || []).map(x => ({ ...x }));
    p.carriedFrom = prevDate;
  }
  p.ver = { label:verHour(p.createdAt), at:p.createdAt, by:'app', why:prevDate ? '날이 바뀜' : '첫 판' }; p.vers = [];   /* v1.5.14 날이 바뀌면 새 판 */
  await putPan(p);
  S.dates = (await allDates()).sort();
  return p;
}

async function goDate(date){
  await flush(); RPT.view = null;
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
  /* v1.5.16 (C) 제목 = 보고서 목록 단추. 지난 판을 보는 중이면 제목 옆에 '4시 · 지난 판' */
  $('day').innerHTML = esc(dayLabel(S.date)) + (RPT.view ? '' : S.date === S.today ? '<small>오늘</small>' : '') + '<i class="dv-dn">▾</i>' + (RPT.view ? `<small class="dv-old">${esc(RPT.view)} 보고서 · 지난 판</small>` : '');
  $('day').setAttribute('aria-label', '보고서 목록 열기');
  $('prev').disabled = !S.dates.some(d => d < S.date);
  $('next').disabled = S.date >= S.today;
  $('today').disabled = S.date === S.today && !RPT.view;
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
  /* v1.5.14 지난 판을 보는 중이면 그 판을 잠깐 꺼내 같은 모양으로 그린다(보기 전용) */
  const live = S.pan, snap = RPT.view ? (verEnsure(live).vers || []).find(v => v.label === RPT.view) : null;
  if (RPT.view && !snap) RPT.view = null;
  if (snap) S.pan = { ...live, items:snap.items || [], inbox:snap.inbox || [], line:snap.line || '', face:snap.face || '-_-' };
  try{ m.innerHTML = seheeBlock() + inboxBlock() + secs().map(sectionBlock).join('') + footer(); } finally { S.pan = live; }
  m.classList.toggle('ro', !!snap);
  if (snap) m.querySelectorAll('textarea, input').forEach(x => { x.readOnly = true; });
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
  const open = all.filter(it => !it.done && !it.later), parked = all.filter(it => !it.done && it.later), done = all.filter(it => it.done);
  const shown = S.settings.openOnly ? open : all;   /* v1.5.9 (C) 보스: 끝낸 일·내일로 미룬 일도 아래로 내리지 않고 그 자리에서 취소선·흐리게 — 적은 순서 그대로 */
  const folded = S.folded[s.id];
  return `<section class="sec ${folded ? 'folded' : ''}" style="--c:${s.color}" data-sec="${s.id}">
    <div class="sh" data-act="fold"><b>${esc(s.label)}</b><span class="cnt">${open.length}${parked.length ? ' · 내일 ' + parked.length : ''}${done.length ? ' · 끝남 ' + done.length : ''}</span><span class="fold">${folded ? '펼치기' : '접기'}</span></div>
    <div class="list">${shown.map(itemRow).join('')}</div>
    <div class="add"><input placeholder="+ 적기" enterkeyhint="enter" data-sec="${s.id}"><button class="ib" data-act="add">넣기</button></div>
  </section>`;
}

function itemRow(it){
  const t = it.tag ? (TAGS.find(x => x.k === it.tag)?.c || TAG_OLD[it.tag] || FREE_TAG) : null;
  const age = it.since && it.since < S.pan.date ? dayDiff(it.since, S.pan.date) + 1 : 0;
  const stamped = S.justDone === it.id; if (stamped) S.justDone = null;
  const ew = wayOf(it), mk = it.back ? '<span class="mk" title="내일로 미뤘던 일">🔁</span>' : it.since === S.pan.date && !it.done ? '<span class="mk" title="오늘 새로">🆕</span>' : '';
  return `<div class="it ${it.done ? 'done' : ''}${it.later && !it.done ? ' later' : ''}${stamped ? ' stamped' : ''}" data-id="${it.id}">
    <button class="ck" data-act="toggle" aria-label="${it.done ? '끝냄 취소' : '끝냄'}">${it.done ? '<span class="seal">完</span>' : ''}</button>
    <div class="body"><div class="tx" data-act="edit">${mk}${esc(it.text)}</div>${it.cm ? `<div class="icm"><i>세희</i>${esc(it.cm)}</div>` : ''}
      <div class="meta">${it.due ? `<span class="due${it.due === S.pan.date ? ' now' : it.due < S.pan.date ? ' past' : ''}">📅 ${esc(dueText(it))}</span>` : ''}${t ? `<span class="tag" style="--c:${t}">${esc(it.tag)}</span>` : ''}${age > 1 && !it.done ? `<span class="age">${age}일째</span>` : ''}${it.by === 'sehee' ? '<span class="age">세희가 적음</span>' : ''}</div>
      <div class="ways">${WAYS.map(w => `<button class="wy${ew === w ? ' on' : ''}" data-act="way" data-w="${w}">${esc(wayName(w))}</button>`).join('')}${ew ? `<span class="wyok">✓ ${esc(wayName(ew))}${ew === '내일' ? ' ' + mdShort(it.later) : ''}</span>` : ''}</div>
      <textarea class="memo${it.note ? ' has' : ''}" data-memo="${it.id}" rows="1" placeholder="✎ 메모" enterkeyhint="enter">${esc(it.note || '')}</textarea></div>
    <button class="more" data-act="menu" aria-label="더보기">⋯</button>
  </div>`;
}

/* ── 일간보고서 판 (v1.5.14, A — handoff/설계-일간보고서.md) ──
   날짜 판 하나에 '지금 판'(ver)과 얼린 지난 판들(vers)이 같이 들어 있다 → 동기화(pan:날짜)를 그대로 탄다.
   새 판은 날이 바뀔 때(makeToday)·세희의 큰 갱신(new_report)·보스의 「새 판」에서만. 작은 수정은 지금 판 안에서. 지난 판은 고치지 않는다.
   이름은 쓴 시각의 시(5시·17시). 같은 시가 겹치면 앞 판을 '5시-1'로 바꾸고 새 판은 '5시-2', 다음 '5시-3'. */
const RPT = { view:null, arm:false };
const VER_MAX = 24;
const verHour = at => new Date(at || Date.now()).getHours() + '시';
function verEnsure(p){ if (!p) return p; if (!p.ver) p.ver = { label:verHour(p.createdAt), at:p.createdAt || Date.now(), by:'app', why:'' }; if (!p.vers) p.vers = []; return p; }
function verNextLabel(p){
  /* newReport 가 지금 판을 vers 에 얼려 넣은 뒤 부른다 — 그래서 vers 만 보면 그날 판이 다 있다 */
  const h = verHour(Date.now()), all = p.vers, same = all.filter(v => v.label === h || v.label.startsWith(h + '-'));
  if (!same.length) return h;
  for (const v of all) if (v.label === h) v.label = h + '-1';
  return h + '-' + (same.length + 1);
}
const verTitle = (p, v) => { const d = parseYmd(p.date); return `${d.getMonth() + 1}월 ${d.getDate()}일 보고서 - ${v.label}`; };
const verClone = x => JSON.parse(JSON.stringify(x || []));
async function newReport(p, why, by){
  verEnsure(p);
  p.vers.push({ ...p.ver, until:Date.now(), line:p.line || '', face:p.face || '-_-', items:verClone(p.items), inbox:verClone(p.inbox) });
  if (p.vers.length > VER_MAX) p.vers.splice(0, p.vers.length - VER_MAX);
  p.ver = { label:verNextLabel(p), at:Date.now(), by:by || 'sehee', why:String(why || '').trim().slice(0, 80) };
  p.updatedAt = Date.now();
  if (S.pan === p){ await flush(true); if (!RPT.view) render(); } else await putPan(p);
  dlog('판', '새 판 ' + verTitle(p, p.ver) + (p.ver.why ? ' · ' + p.ver.why : ''));
  return p.ver;
}
/* (v1.5.16 C — 판 위 보고서 띠는 보스 지시로 없앰. 지난 판·새 판은 제목을 눌러 여는 보고서 목록에서) */
function verBarOld(live, snap){
  verEnsure(live); const v = snap || live.ver, n = live.vers.length;
  return `<div class="verbar${snap ? ' old' : ''}"><span class="vb-t">📄 ${esc(verTitle(live, v))}</span><span class="vb-s">${snap ? '지난 판 · 보기만' : '지금'}</span>
    ${snap ? '<button class="vb-b" data-ver="">지금 판으로</button>' : `${n ? `<button class="vb-b" data-verlist="1">지난 판 ${n} ▾</button>` : ''}${live.date === S.today ? `<button class="vb-b vb-new${RPT.arm ? ' on' : ''}" data-vernew="1">${RPT.arm ? '한 번 더 누르면 새 판' : '새 판'}</button>` : ''}`}</div>`;
}
const verHM = t => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
/* ── 보고서 목록 (v1.5.16 · C) — 맨 위 제목(날짜)을 누르면 지금까지 보고서 전부. 다섯 줄만 보이고 그 아래는 굴려 본다 ── */
async function reportList(){
  await flush();
  const pans = (await allPans()).filter(x => x && x.date && x.date <= S.today).sort((a, b) => a.date < b.date ? 1 : -1), rows = [];
  for (const p of pans){ verEnsure(p);
    rows.push({ date:p.date, v:p.ver, live:true, n:(p.items || []).length, end:p.date === S.today ? '지금' : '' });
    for (const v of p.vers.slice().reverse()) rows.push({ date:p.date, v, live:false, n:(v.items || []).length, end:verHM(v.until) }); }
  const cur = r => r.date === S.date && (r.live ? !RPT.view : RPT.view === r.v.label);
  openSheet(`<h4>보고서 — 모두 ${rows.length}개</h4>
    <div class="rl-list" id="rlList">${rows.map(r => `<button class="rl-row${cur(r) ? ' now' : ''}${r.live ? '' : ' past'}" data-rl="${r.date}" data-rlv="${r.live ? '' : esc(r.v.label)}">
      <b>${esc(verTitle({ date:r.date }, r.v))}</b><span>${verHM(r.v.at)}${r.end ? '~' + r.end : ''} · 항목 ${r.n}${r.live ? '' : ' · 지난 판'}</span>${r.v.why ? `<small>${esc(r.v.why)}</small>` : ''}</button>`).join('') || '<p class="note">아직 보고서가 없어요.</p>'}</div>
    <div class="row" style="margin-top:8px;gap:6px"><button class="chip" data-rlnew="1">오늘 새 판 만들기</button><button class="chip" data-rlpick="1">날짜로 찾기</button></div>
    <p class="note">지난 판은 그때 그대로 남아 있어요(보기만). 새 판은 날이 바뀔 때, 세희가 크게 정리할 때, 여기서 만들 때 생겨요.</p>`);
  const now = document.querySelector('#rlList .rl-row.now'); if (now) now.scrollIntoView({ block:'nearest' });
}
function verSheet(){ return reportList(); }
function verSheetOld(){
  const p = verEnsure(S.pan); if (!p) return;
  const row = (v, now) => `<button class="vs-row${now ? ' now' : ''}" data-ver="${now ? '' : esc(v.label)}"><b>${esc(v.label)} 보고서</b><span>${verHM(v.at)}~${now ? "지금" : verHM(v.until)} · 항목 ${(now ? p.items : v.items || []).length}</span>${v.why ? `<small>${esc(v.why)}</small>` : ''}</button>`;
  openSheet(`<h4>${esc(verTitle(p, { label:'' }).replace(/ - $/, ''))} — 판 ${p.vers.length + 1}개</h4><div class="vs-list">${row(p.ver, true)}${p.vers.slice().reverse().map(v => row(v, false)).join('')}</div>
    <p class="note">지난 판은 그때 그대로 남아 있어요(고칠 수 없어요). 새 판은 날이 바뀔 때, 세희가 크게 정리할 때만 생겨요.</p>`);
}
/* 지난 판을 보는 동안은 판 띠 말고는 아무것도 안 눌리게(입력도 막음) */
$('main').addEventListener('click', e => { if ($('main').classList.contains('ro') && !e.target.closest('.verbar')){ e.stopImmediatePropagation(); e.preventDefault(); } }, true);
document.addEventListener('click', async e => {
  const t = e.target;
  const rl = t.closest('[data-rl]');
  if (rl && rl.closest('#sheet')){ closeSheet(); const v = rl.dataset.rlv || null; if (rl.dataset.rl !== S.date) await goDate(rl.dataset.rl); RPT.view = v; render(); $('main').scrollTop = 0; return; }
  const rn = t.closest('[data-rlnew]');
  if (rn){ if (!rn.classList.contains('armed')){ rn.classList.add('armed'); rn.textContent = '한 번 더 누르면 새 판'; return; }
    closeSheet(); if (S.date !== S.today) await goDate(S.today); RPT.view = null; const v = await newReport(await todayPanRef(), '보스가 새 판', 'boss'); render(); toast(`새 판 — ${v.label} 보고서`); return; }
  if (t.closest('[data-rlpick]')){ closeSheet(); const p = $('pick'); p.max = S.today; p.value = S.date; try{ p.showPicker(); }catch(x){ p.click(); } return; }
  if (t.closest('[data-verlist]')) return verSheet();
  const vn = t.closest('[data-vernew]');
  if (vn){ if (!RPT.arm){ RPT.arm = true; render(); setTimeout(() => { if (RPT.arm){ RPT.arm = false; render(); } }, 4000); return; }
    RPT.arm = false; const v = await newReport(S.pan, '보스가 새 판', 'boss'); toast(`새 판 — ${v.label} 보고서`); return; }
  const vv = t.closest('[data-ver]');
  if (vv && (vv.closest('.verbar') || vv.closest('#sheet'))){ RPT.view = vv.dataset.ver || null; if (vv.closest('#sheet')) closeSheet(); render(); $('main').scrollTop = 0; }
});

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

/* ── 처리 단추 (v1.5.2 · C) — 넷: 끝 · 안 함 · 내일 · 기억만 ──
   끝 = 한 일(完 도장과 같음) · 안 함 = 안 하기로(내 일 아님) 닫음 · 내일 = 오늘은 접고 내일 판에 🔁 로 다시 · 기억만 = '기억해둘 것' 칸으로 내림.
   같은 단추를 다시 누르면 취소. 누른 순서는 it.wayLog 에 남긴다(지우지 않음). 세희는 읽기만 한다.
   v1.5.13 보편 설계: 안쪽 값(it.way·data-w)은 예전 그대로('알바노' 등) 두고, 보이는 이름만 기본 '안 함' — ⚙ 설정에서 사용자가 단추 이름을 바꾼다 */
const WAYS = ['끝', '알바노', '내일', '기억만'];
const WAY_DEFAULT = { '끝':'끝', '알바노':'안 함', '내일':'내일', '기억만':'기억만' };
const wayName = k => ((S.settings && S.settings.wayNames && S.settings.wayNames[k]) || WAY_DEFAULT[k] || k);
const mdShort = d => { if (!d) return ''; const x = parseYmd(d); return (x.getMonth() + 1) + '/' + x.getDate(); };
function wayOf(it){ if (it.done) return it.way === '알바노' ? '알바노' : '끝'; if (it.later) return '내일'; if (it.way === '기억만') return '기억만'; return null; }
function setWay(it, w){
  const cur = wayOf(it), snap = snapshot(), undo = cur === w;
  (it.wayLog = it.wayLog || []).push({ w: undo ? '취소' : w, at: Date.now() }); if (it.wayLog.length > 20) it.wayLog = it.wayLog.slice(-20);
  if (cur === '기억만' && it.waySec && secById(it.waySec)) it.sec = it.waySec;
  it.done = false; it.doneAt = null; delete it.later; delete it.way; delete it.waySec;
  let msg = `'${wayName(w)}' 풀었어요`;
  if (!undo){
    if (w === '끝' || w === '알바노'){ it.done = true; it.doneAt = Date.now(); it.way = w; S.justDone = it.id; msg = w === '끝' ? '끝냈어요' : `${wayName(w)} — 안 하기로 닫았어요`; }
    else if (w === '내일'){ const t = parseYmd(S.pan.date); t.setDate(t.getDate() + 1); it.later = ymd(t); msg = `내일(${mdShort(it.later)}) 판에 다시 올라와요`; }
    else if (w === '기억만'){ it.way = '기억만'; const m = secById('memo');
      if (m && it.sec !== 'memo'){ it.waySec = it.sec; it.sec = 'memo'; msg = `'${m.label}'으로 내렸어요`; } else msg = '기억만 해 둘게요'; }
  }
  dlog('판', `처리 단추 ${undo ? wayName(w) + ' 취소' : wayName(w)} #${it.id}`);
  touch(true); render(); toast(msg, () => restore(snap));
}
$('main').addEventListener('click', e => {
  const b = e.target.closest('[data-act="way"]'); if (!b) return;
  const row = b.closest('.it'), it = row && findItem(row.dataset.id); if (it) setWay(it, b.dataset.w);
});

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
