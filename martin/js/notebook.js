/* martin/js/notebook.js — 수사 수첩(v0.5). 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 수사 수첩 (v0.5) — 판에 꽂기엔 작은 것들: 의문·짐작·확인할 것·사사로운 사실·풀린 의문·내 메모
   넓은 화면은 앱 왼쪽 바깥에 늘 펼침, 폰은 「수첩」 단추로 왼쪽 서랍. 마틴은 notes/solve/drop 으로 고친다 */
const NK = { q:'의문', guess:'짐작', todo:'확인할 것', fact:'사사로운 사실', me:'내 메모' };
function classifyMemo(t){
  if (/의문 카드|상한|정리 후보|tidy|merge|remove/.test(t)) return null;   /* 마틴의 작업 메모는 버림 */
  if (/확인할 것|확인$|캐 와|대조할 것|볼 것|보라|가져와|확인 필요|확인할/.test(t)) return 'todo';
  if (/추정|같다|보이나|미확정|추측|공산|듯/.test(t)) return 'guess';
  if (/\?\s*$|왜 |누구/.test(t)) return 'q';
  return 'fact';
}
function ensureNotes(){
  if (!S || S.notes) return;
  S.notes = []; S.nmax = 0;
  for (const t of S.memo || []){ const k = classifyMemo(t); if (!k) continue; S.notes.push({ id:'m' + (++S.nmax), k, t:String(t).slice(0, 140), by:'you', at:S.at || Date.now(), turn:null }); }
}
function addNote(k, t, by, extra){
  t = String(t || '').trim().slice(0, 140); if (!t || !NK[k]) return null;
  if (S.notes.some(x => !x.done && x.t === t)) return null;
  const n = { id:'m' + (++S.nmax), k, t, by:by === 'me' ? 'me' : 'you', at:Date.now(), turn:S.turn, ...(extra || {}) }; S.notes.push(n); return n;
}
function solveNote(id, a){ const n = S.notes.find(x => x.id === id); if (!n || n.done) return null; n.done = 1; n.a = String(a || '').slice(0, 120); n.doneAt = Date.now(); n.doneTurn = S.turn; return n; }
function cardSolved(card, a){   /* 판의 의문 카드가 떼어질 때 — 풀린 의문 칸으로 옮겨 흔적을 남긴다 */
  if (!card || card.kind !== 'question') return null;
  return addNote('q', card.title + (card.note ? ' — ' + card.note : ''), 'you', { done:1, a:String(a || '판에서 풀림').slice(0, 120), doneAt:Date.now(), doneTurn:S.turn, card:card.id });
}
let nbFlash = new Set();
async function applyNotes(raw){
  const r = raw || {}, made = [], solved = [], dropped = [];
  const notes = Array.isArray(r.notes) ? r.notes : [];
  for (const x of notes.slice(0, 6)){ const n = x && typeof x === 'object' ? addNote(x.k in NK ? x.k : 'fact', x.t, x.by) : addNote('fact', x, 'you'); if (n) made.push(n.id); }
  for (const x of (Array.isArray(r.memo) ? r.memo : r.memo ? [r.memo] : []).slice(0, 3)){ const k = classifyMemo(String(x)); if (k){ const n = addNote(k, x, 'you'); if (n) made.push(n.id); } }
  for (const s of (Array.isArray(r.solve) ? r.solve : []).slice(0, 8)){
    const id = typeof s === 'string' ? s : s && s.id, a = s && s.a;
    if (/^n\d+$/.test(id || '')){ const c = nodeOf(id); if (c && c.kind === 'question'){ await doOp({ op:'remove', id, why:a }).catch(() => {}); solved.push(id); } }
    else if (solveNote(id, a)) solved.push(id);
  }
  for (const id of (Array.isArray(r.drop) ? r.drop : []).slice(0, 10)){ const i = S.notes.findIndex(x => x.id === id && x.k !== 'me'); if (i >= 0){ S.notes.splice(i, 1); dropped.push(id); } }
  if (made.length || solved.length || dropped.length){ nbFlash = new Set([...made, ...solved]); renderNb(); nbPing(made.length + solved.length); save(); }
  return { made, solved, dropped };
}
function noteText(){
  const open = k => S.notes.filter(n => n.k === k && !n.done);
  const line = n => `${n.id}${n.by === 'me' ? '(동료)' : ''} ${n.t}`;
  const qs = S.nodes.filter(n => n.kind === 'question');
  const facts = open('fact').slice(-30), solvedQ = S.notes.filter(n => n.done).slice(-8);
  return `열린 의문: ${[...qs.map(c => `${c.id}[판] ${c.title} — ${c.note || ''}`), ...open('q').map(line)].join(' / ') || '(없음)'}
짐작(미확정): ${open('guess').map(line).join(' / ') || '(없음)'}
확인할 것: ${open('todo').map(line).join(' / ') || '(없음)'}
사사로운 사실${open('fact').length > 30 ? '(최근 30)' : ''}: ${facts.map(line).join(' / ') || '(없음)'}
동료가 수첩에 직접 적은 것: ${open('me').map(n => `${n.id} ${n.t}`).join(' / ') || '(없음)'}
최근 풀린 것: ${solvedQ.map(n => `${n.id} ${n.t} → ${n.a || ''}`).join(' / ') || '(없음)'}`;
}
const nbOpenCount = () => S.notes.filter(n => !n.done && (n.k === 'q' || n.k === 'todo')).length + S.nodes.filter(n => n.kind === 'question').length;
function nbPing(n){ const b = $('#nbN'); if (!b) return; b.textContent = nbOpenCount() || ''; if (n){ const t = $('#btnNb'); t.classList.remove('ping'); void t.offsetWidth; t.classList.add('ping'); } }
function renderNb(){
  if (!S) return; ensureNotes();
  const tm = n => n.turn != null ? `턴 ${n.turn}` : '';
  const item = n => `<li class="nt k-${n.k}${n.done ? ' done' : ''}${nbFlash.has(n.id) ? ' new' : ''}" data-n="${n.id}"><span class="mk"></span><span class="tx">${n.done ? `<s>${esc(n.t)}</s>` : esc(n.t)}${n.done && n.a ? `<em>→ ${esc(n.a)}</em>` : ''}</span><span class="mt">${n.by === 'me' ? '나' : '마틴'}${tm(n) ? ' · ' + tm(n) : ''}<button type="button" class="nx" data-ndel="${n.id}" aria-label="지우기">×</button></span></li>`;
  const sec = (title, list, empty, extra = '') => `<section class="ns"><h5>${title}<small>${list.length || ''}</small></h5><ul>${list.join('') || `<li class="nt none"><span class="tx">${empty}</span></li>`}</ul>${extra}</section>`;
  const open = k => S.notes.filter(n => n.k === k && !n.done);
  const cardQ = S.nodes.filter(n => n.kind === 'question').map(c => `<li class="nt k-q card" data-card="${c.id}"><span class="mk"></span><span class="tx">${esc(c.title)}${c.note ? `<em>${esc(c.note)}</em>` : ''}</span><span class="mt">판의 의문 카드</span></li>`);
  $('#nbBody').innerHTML =
    sec('의문', [...cardQ, ...open('q').map(item)], '아직 없다') +
    sec('짐작 · 미확정', open('guess').map(item), '아직 없다') +
    sec('확인할 것', open('todo').map(item), '아직 없다') +
    sec('사사로운 사실', open('fact').slice().reverse().map(item), '아직 없다') +
    sec('풀린 의문', S.notes.filter(n => n.done).slice().reverse().map(item), '아직 없다') +
    sec('내 메모', open('me').map(item), '적어 둘 것을 아래에', `<form class="nbadd" id="nbAdd"><input id="nbIn" maxlength="140" placeholder="한 줄 적기 — 마틴도 읽는다" autocomplete="off"><button type="submit">적기</button></form>`);
  $('#nbCase').textContent = (nodeOf('n1') || {}).title || '새 사건';
  nbPing(0); setTimeout(() => { nbFlash = new Set(); }, 50);
}
const nbOpen = on => { document.body.classList.toggle('nbopen', on); if (on){ act('수첩 열기'); renderNb(); } };
$('#btnNb').onclick = () => nbOpen(!document.body.classList.contains('nbopen'));
$('#nbX').onclick = () => nbOpen(false); $('#nbScrim').onclick = () => nbOpen(false);
$('#nb').addEventListener('click', async e => {
  const del = e.target.closest('[data-ndel]'); if (del){ const i = S.notes.findIndex(x => x.id === del.dataset.ndel); if (i >= 0){ act('수첩 지움', { id:S.notes[i].id, t:S.notes[i].t }); S.notes.splice(i, 1); save(); renderNb(); } return; }
  const c = e.target.closest('[data-card]'); if (c){ const n = nodeOf(c.dataset.card); if (n){ if (innerWidth < 980) nbOpen(false); act('수첩에서 카드로', { id:n.id }); await fly(n.x, n.y, 1, 600); const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el){ el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } } return; }
  const li = e.target.closest('.nt[data-n]'); if (li){ const n = S.notes.find(x => x.id === li.dataset.n); if (!n || n.k === 'fact' || n.k === 'me') return;
    if (n.done){ n.done = 0; delete n.a; act('수첩 되돌림', { id:n.id }); } else { solveNote(n.id, '동료가 풀림 표시'); act('수첩 풀림 표시', { id:n.id }); } save(); renderNb(); }
});
$('#nb').addEventListener('submit', e => { e.preventDefault(); const i = $('#nbIn'); const t = i.value.trim(); if (!t) return; const n = addNote('me', t, 'me'); i.value = ''; if (n){ act('수첩에 적음', { t }); nbFlash = new Set([n.id]); save(); renderNb(); setTimeout(() => $('#nbIn') && $('#nbIn').focus(), 0); } });

