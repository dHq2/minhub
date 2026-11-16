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
function healNotes(){   /* 11-16 C: 예전 줄 누르기로 '동료가 풀림 표시'가 된 줄을 제자리로(한 번만 일어남 — 이제 그 표시를 만드는 길이 없다).
     저장은 하지 않는다 — S.at 이 새로워지면 다른 기기의 더 새 판을 덮을 수 있어서. 다음 저장(계정 판 받기·아무 행동) 때 같이 실린다 */
  if (!S || !S.notes) return 0; let k = 0;
  for (const x of S.notes) if (x.done && x.a === '동료가 풀림 표시'){ x.done = 0; delete x.a; delete x.doneAt; delete x.doneTurn; k++; }
  if (k){ act('수첩 되살림', { n:k }); try{ localStorage.setItem(KEY, JSON.stringify(S, slim)); }catch(e){} } return k;
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
function renderNb(){   /* 11-16 D: 코드처럼 작은 글씨 한 줄 목록 — 제목·상세 두 줄과 「마틴 · 턴」 꼬리표를 없앰, 줄 번호는 css 카운터, 판의 의문 카드는 제목만(상세는 판 카드에) */
  if (!S) return; ensureNotes(); healNotes();
  const mk = { q:'?', guess:'~', todo:'[ ]', fact:'-', me:'>' };
  const item = n => `<li class="nl k-${n.k}${n.done ? ' done' : ''}${n.by === 'me' ? ' byme' : ''}${nbFlash.has(n.id) ? ' new' : ''}" data-n="${n.id}"><b class="nl-k">${n.done ? (n.k === 'todo' ? '[x]' : '✓') : mk[n.k]}</b><span class="nl-t"><span class="nl-v">${esc(n.t)}</span>${n.done && n.a ? `<i class="nl-a"> → ${esc(n.a)}</i>` : ''}</span><button type="button" class="nl-x" data-ndel="${n.id}" aria-label="지우기">×</button></li>`;
  const sec = (title, list, empty, extra = '') => `<section class="nl-s"><div class="nl-h">// ${title}<i>${list.length || ''}</i></div><ol>${list.join('') || `<li class="nl none"><b class="nl-k"></b><span class="nl-t">${empty}</span></li>`}</ol>${extra}</section>`;
  const open = k => S.notes.filter(n => n.k === k && !n.done);
  const cardQ = S.nodes.filter(n => n.kind === 'question').map(c => `<li class="nl k-q nl-card" data-card="${c.id}"><b class="nl-k">?</b><span class="nl-t">${esc(c.title)}<u>판</u></span></li>`);
  $('#nbBody').innerHTML =
    sec('의문', [...cardQ, ...open('q').map(item)], '(없음)') +
    sec('짐작 · 미확정', open('guess').map(item), '(없음)') +
    sec('확인할 것', open('todo').map(item), '(없음)') +
    sec('사사로운 사실', open('fact').slice().reverse().map(item), '(없음)') +
    sec('풀린 의문', S.notes.filter(n => n.done).slice().reverse().map(item), '(없음)') +
    sec('내 메모', open('me').map(item), '(없음)', `<form class="nbadd nl-add" id="nbAdd"><b>›</b><input id="nbIn" maxlength="140" placeholder="한 줄 적기 — 마틴도 읽는다" autocomplete="off"><button type="submit">적기</button></form>`);
  $('#nbCase').textContent = (nodeOf('n1') || {}).title || '새 사건';
  nbPing(0); setTimeout(() => { nbFlash = new Set(); }, 50);
}
const nbOpen = on => { document.body.classList.toggle('nbopen', on); if (on){ act('수첩 열기'); renderNb(); } };
$('#btnNb').onclick = () => nbOpen(!document.body.classList.contains('nbopen'));
$('#nbX').onclick = () => nbOpen(false); $('#nbScrim').onclick = () => nbOpen(false);
$('#nb').addEventListener('click', async e => {
  const del = e.target.closest('[data-ndel]'); if (del){ e.stopPropagation(); const i = S.notes.findIndex(x => x.id === del.dataset.ndel); if (i >= 0){ act('수첩 지움', { id:S.notes[i].id, t:S.notes[i].t }); S.notes.splice(i, 1); save(); renderNb(); } return; }
  const c = e.target.closest('[data-card]'); if (c){ const n = nodeOf(c.dataset.card); if (n){ if (innerWidth < 980) nbOpen(false); act('수첩에서 카드로', { id:n.id }); await fly(n.x, n.y, 1, 600); const el = document.querySelector(`#nodes [data-id="${n.id}"]`); if (el){ el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } } return; }
  /* 11-16 C: 줄을 눌러도 아무 일 없다 — 예전엔 누르면 '풀린 의문'으로 넘어가 지워진 것처럼 보였다(보스 판에서 8줄). 지우기는 줄 끝 × 로만, 실수는 판의 되돌리기로 */
});
$('#nb').addEventListener('submit', e => { e.preventDefault(); const i = $('#nbIn'); const t = i.value.trim(); if (!t) return; const n = addNote('me', t, 'me'); i.value = ''; if (n){ act('수첩에 적음', { t }); nbFlash = new Set([n.id]); save(); renderNb(); setTimeout(() => $('#nbIn') && $('#nbIn').focus(), 0); } });

