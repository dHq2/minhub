/* martin/js/undo.js — 되돌리기 · 다시 하기 (11-16 C). 고칠 땐 이 줄 아래에 「11-16 C: …」처럼 날짜·방 주석
   무엇을: 동료(플레이어)가 한 일만 한 걸음씩 되돌린다 — 수첩 적기·지우기, 난제 지정·붙잡기·풀림·지우기, 판 정리, 프사 빼기, 첨부 빼기…
           마틴이 쓰고 꽂은 것(마틴의 답 하나, 그때 같이 꽂힌 사진 카드)은 되돌리지 않는다 — 혼란만 생긴다(보스 11-16). 대화도 되돌리지 않는다.
           글을 쓰는 중의 Ctrl+Z 는 브라우저의 글자 되돌리기 그대로(이 파일은 입력칸에선 비켜선다).
   어떻게: save() 가 부를 때마다(core.js 한 줄) 0.7초 모아서 판 상태를 비교한다. 동료가 바꾼 것이면 '앞 → 뒤' 한 칸을 쌓고,
           마틴의 답(턴 번호가 바뀜·자료 건넴 중)이면 칸을 쌓지 않고 기준만 옮긴다.
           되돌릴 땐 통째로 덮지 않고 그 칸에서 바뀐 것만 되짚는다 — 카드·실·수첩 줄·난제처럼 id 가 있는 건 하나씩,
           지금도 '뒤' 그대로인 것만 '앞'으로(그 뒤에 마틴이 손댄 것은 건드리지 않고 건너뜀). 그래서 마틴의 답이 사이에 끼어도 동료가 한 일만 빠진다.
   11-18 A(보스): 마틴의 답 하나도 한 칸이다 — 그 답이 판에 한 것(카드·실·수첩·난제·연혁)을 통째로 한 번에 무른다(하나씩이 아니라). 대화와 판독문은 그대로.
           앱이 뒤따라 스스로 하는 손질(프사 붙이기 같은)은 undoApp() 을 부르고 바꾸면 바로 앞 마틴의 칸에 합쳐진다(동료의 칸으로 쌓이지 않게).
           앱이 알아낸 것(판독문·프사 찾아본 기록 — UNDO_LEARN)은 비교에서 빼고, 되짚을 때도 지금 것을 그대로 둔다.
   기억: 이 화면에서만(다시 열면 비어 있다). 마틴은 S.undone(최근 8개)으로 '동료가 되돌린 것'을 안다 — ai.js 프롬프트 undoText().
   새 상태 키를 만드는 방은 따로 할 일 없다 — UNDO_SKIP 에 없는 S 의 키는 전부 판 상태로 잡힌다. 판이 아닌 키(기록·시각 같은)를 만들면 UNDO_SKIP 에 더한다. */
const UNDO_SKIP = new Set(['log', 'at', 'turn', 'pending', 'id', 'v', 'undone']);   /* 판 상태가 아닌 것 — 되돌리지 않는다 */
const UNDO_CNT = ['nid', 'nmax', 'pmax', 'hmax'];   /* 번호 세는 칸 — 되돌리지 않는다(같은 번호를 두 번 쓰지 않게) */
const UNDO_BIG = new Set(['img', 'thumb', 'big', 'mid', 'face']);   /* 사진 글자열 — 비교할 땐 있음/없음만 */
const UNDO_FLEET = new Set(['w', 'h']);   /* 화면이 잰 크기 — 비교에서 뺀다 */
const UNDO_LEARN = ['read', 'readTurn', 'bfFail', 'faceTried'];   /* 11-18 A: 앱이 알아낸 것 — 판 손질이 아니라 비교에서 빼고 되짚어도 지금 것 그대로 */
const UN = { S:null, base:null, key:'', back:[], fwd:[], t:0, turn:0, mart:false, app:false };
const dcopy = v => Array.isArray(v) ? v.map(dcopy) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, dcopy(x)])) : v;   /* 글자열은 그대로 나눠 쓴다(복사 비용 없음) */
function boardOf(s){ const b = {}; for (const k of Object.keys(s)) if (!UNDO_SKIP.has(k)) b[k] = dcopy(s[k]); return b; }
const undoKey = b => JSON.stringify(b === undefined ? null : b, (k, v) => UNDO_BIG.has(k) ? (v ? 1 : 0) : UNDO_FLEET.has(k) || UNDO_CNT.includes(k) || UNDO_LEARN.includes(k) ? undefined : v);
const keepLearn = (to, cur) => { if (to && cur && typeof to === 'object') for (const k of UNDO_LEARN){ if (k in cur) to[k] = cur[k]; else delete to[k]; } return to; };
const same = (x, y) => undoKey(x) === undoKey(y);

function undoReset(){ clearTimeout(UN.t); UN.S = S; UN.base = S ? boardOf(S) : null; UN.key = UN.base ? undoKey(UN.base) : ''; UN.back = []; UN.fwd = []; UN.turn = S ? S.turn : 0; UN.mart = false; UN.app = false; undoBtns(); }
/* 11-18 A: 앱이 스스로 판을 고치기 직전에 부른다 — 그 전의 동료 손질은 먼저 칸으로 닫고, 이번 손질은 앞의 마틴 칸에 합친다(없으면 기준만 옮김) */
function undoApp(){ if (!S || S !== UN.S) return; undoCommit(); UN.app = true; }
function undoTick(){ if (!S) return; if (S !== UN.S) return undoReset(); clearTimeout(UN.t); UN.t = setTimeout(undoCommit, 700); }
function undoRebase(b, k){ UN.base = b || boardOf(S); UN.key = k || undoKey(UN.base); UN.turn = S.turn; }
function undoCommit(){
  clearTimeout(UN.t); if (!S || S !== UN.S) return undoReset();
  if (busy && !S.pending){ UN.t = setTimeout(undoCommit, 700); return; }   /* 판 정리 중이거나 마틴이 판을 고치는 중 — 끝나면 */
  const b = boardOf(S), k = undoKey(b);
  if (S.pending){ UN.mart = true; if (k !== UN.key) undoRebase(b, k); return; }   /* 자료를 건네는 중 — 대화에 묶인 것(사진 카드)이라 되돌리지 않는다 */
  const app = UN.app; UN.app = false;
  if (S.turn !== UN.turn || UN.mart){ UN.mart = false; if (k !== UN.key) undoPush(b, k, S.turn); else undoRebase(b, k); return; }   /* 11-18 A: 마틴의 답 — 그 답이 판에 한 것 전부가 한 칸 */
  if (k === UN.key) return;
  if (app){ const L = UN.back[UN.back.length - 1];   /* 앱의 뒤따름 손질 — 바로 앞이 마틴의 칸이면 거기에 합치고, 아니면 기준만 */
    if (L && L.mart){ L.b = b; L.why = undoWhy(L.a, b, L.mart); undoRebase(b, k); undoBtns(); } else undoRebase(b, k); return; }
  undoPush(b, k, 0);
}
const undoWhy = (a, b, mart) => (mart ? '마틴의 답 — ' : '') + undoWhat(a, b);
function undoPush(b, k, mart){
  UN.back.push({ a:UN.base, b, why:undoWhy(UN.base, b, mart), ...(mart ? { mart } : {}) }); if (UN.back.length > 40) UN.back.shift();
  UN.fwd = []; undoRebase(b, k); undoBtns();
}
/* 한 칸 되짚기 — cur(S)에서, from → to 로 바뀐 것만 to → from 쪽으로. 지금도 from 그대로인 것만 고치고 아니면 건너뜀 */
const idList = v => Array.isArray(v) && v.every(x => x && typeof x === 'object' && 'id' in x);
function patch(cur, from, to){
  let done = 0, skip = 0;
  for (const k of new Set([...Object.keys(from), ...Object.keys(to)])){
    if (UNDO_SKIP.has(k) || UNDO_CNT.includes(k) || same(from[k], to[k])) continue;
    const f = from[k], t = to[k];
    if ((f === undefined || idList(f)) && (t === undefined || idList(t)) && (cur[k] === undefined || idList(cur[k]))){ const r = patchList(cur[k] || [], f || [], t || []); cur[k] = r.list; done += r.done; skip += r.skip; }
    else if (same(cur[k], f)){ if (t === undefined) delete cur[k]; else cur[k] = dcopy(t); done++; }
    else skip++;
  }
  return { done, skip };
}
function patchList(list, f, t){
  const fm = new Map(f.map(x => [x.id, x])), tm = new Map(t.map(x => [x.id, x])); let done = 0, skip = 0; list = list.slice();
  for (const [id, fx] of fm){ const tx = tm.get(id), i = list.findIndex(x => x.id === id);
    if (!tx){ if (i < 0) continue; if (same(list[i], fx)){ list.splice(i, 1); done++; } else skip++; }   /* 그 걸음에서 생긴 것 → 뗀다 */
    else if (!same(fx, tx)){ if (i >= 0 && same(list[i], fx)){ list[i] = keepLearn(dcopy(tx), list[i]); done++; } else skip++; } }   /* 그 걸음에서 고친 것 → 되돌린다 */
  for (const [id, tx] of tm){ if (fm.has(id) || list.some(x => x.id === id)) continue;   /* 그 걸음에서 없어진 것 → 원래 자리 근처로 되살린다 */
    const pos = t.findIndex(x => x.id === id); let at = pos === 0 ? 0 : list.length;
    for (let j = pos - 1; j >= 0; j--){ const q = list.findIndex(x => x.id === t[j].id); if (q >= 0){ at = q + 1; break; } }
    list.splice(at, 0, dcopy(tx)); done++; }
  return { list, done, skip };
}
/* 무엇이 바뀌었나 — 버튼 말풍선·마틴에게 알리는 한 줄 */
function undoWhat(a, b){
  if (!a || !b) return '판 손질';
  const ids = l => new Map((l || []).map(x => [x.id, x])), q = t => '「' + String(t || '').slice(0, 22) + '」', out = [];
  const na = ids(a.nodes), nb = ids(b.nodes), add = [...nb.keys()].filter(i => !na.has(i)), del = [...na.keys()].filter(i => !nb.has(i));
  if (add.length) out.push(`카드 ${add.length}장 꽂음`);
  if (del.length) out.push(`카드 ${del.slice(0, 3).map(i => q(na.get(i).title)).join(', ')}${del.length > 3 ? ` 외 ${del.length - 3}장` : ''} 뗌`);
  let moved = 0; const ed = [], sized = [];
  for (const [i, n] of nb){ const o = na.get(i); if (!o) continue; const sz = o.cw !== n.cw || o.ch !== n.ch || (+o.sc || 1) !== (+n.sc || 1);   /* 11-16 C: 크기(size.js) */
    if (sz) sized.push(n.title); else if (o.x !== n.x || o.y !== n.y) moved++; if (o.title !== n.title || o.note !== n.note || !!o.face !== !!n.face) ed.push(n.title); }
  if (sized.length) out.push(`카드 ${sized.slice(0, 2).map(q).join(', ')}${sized.length > 2 ? ` 외 ${sized.length - 2}장` : ''} 크기 바꿈`);
  if (ed.length) out.push(`카드 ${ed.slice(0, 2).map(q).join(', ')}${ed.length > 2 ? ` 외 ${ed.length - 2}장` : ''} 고침`);
  if (moved) out.push(`카드 ${moved}장 자리 옮김`);
  if (undoKey(a.links || []) !== undoKey(b.links || [])) out.push('실 바뀜');
  if ((a.suspect || null) !== (b.suspect || null)) out.push('용의자 표시 바뀜');
  const ma = ids(a.notes), mb = ids(b.notes), ndel = [...ma.values()].filter(x => !mb.has(x.id)), nadd = [...mb.values()].filter(x => !ma.has(x.id)), nfl = [...mb.values()].filter(x => ma.has(x.id) && !!ma.get(x.id).done !== !!x.done);
  if (ndel.length) out.push(`수첩 ${ndel.slice(0, 2).map(x => q(x.t)).join(', ')}${ndel.length > 2 ? ` 외 ${ndel.length - 2}줄` : ''} 지움`);
  if (nadd.length) out.push(`수첩 ${nadd.length}줄 적음`);
  if (nfl.length) out.push(`수첩 ${nfl.length}줄 풀림 바뀜`);
  const NAME = { probs:'난제 지도', pfocus:'난제 지도', hyp:'가설', tl:'연혁', tclash:'연혁', closed:'자료 형편' }, seen = new Set();   /* 11-18 A: 바뀐 칸 이름대로 */
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])){ if (['nodes', 'links', 'suspect', 'notes', ...UNDO_CNT].includes(k) || undoKey(a[k]) === undoKey(b[k])) continue; const nm = NAME[k]; if (nm && !seen.has(nm)){ seen.add(nm); out.push(nm + ' 바뀜'); } }
  return out.join(' · ').slice(0, 180) || '판 손질';
}
function undoShow(){
  if (typeof unfocus === 'function') Promise.resolve().then(() => unfocus(true)).catch(() => {});   /* 마틴이 비추던 연출이 남아 있으면 걷는다 */
  renderAll(); measure(); renderStrings(); renderMarks();
}
/* dir -1 = 되돌리기, 1 = 다시 하기 */
function undoGo(dir){
  if (!S || busy) return;
  if (S !== UN.S) undoReset(); else undoCommit();   /* 방금 한 일이 아직 칸에 안 들어갔으면 먼저 넣는다 */
  const from = dir < 0 ? UN.back : UN.fwd, to = dir < 0 ? UN.fwd : UN.back, e = from.pop(); if (!e) return undoBtns();
  const pre = dir < 0 ? '↶ 되돌림 — ' : '↷ 다시 함 — ';
  if (e.att){   /* 첨부 칩 — 건네기 전에만 */
    if (S.log.length !== e.logN){ undoBtns(); return undoToast('이미 건넨 뒤라 첨부는 되돌릴 수 없다 — ' + e.why); }
    if (dir < 0) att.splice(Math.min(e.i, att.length), 0, e.att); else { const i = att.indexOf(e.att); if (i >= 0) att.splice(i, 1); }
    renderChips(); to.push(e); act(dir < 0 ? '되돌리기' : '다시 하기', { what:e.why }); undoBtns(); return undoToast(pre + e.why);
  }
  const r = dir < 0 ? patch(S, e.b, e.a) : patch(S, e.a, e.b);
  if (!r.done){ act('되돌리기 못 함', { what:e.why }); undoBtns(); return undoToast('그 뒤에 마틴이 같은 곳을 고쳐서 되돌릴 게 남지 않았다 — ' + e.why); }
  to.push(e); undoShow();
  S.undone = [...(S.undone || []), { at:Date.now(), turn:S.turn, what:e.why, ...(e.mart ? { mart:e.mart } : {}), ...(dir > 0 ? { redo:1 } : {}) }].slice(-8);
  act(dir < 0 ? '되돌리기' : '다시 하기', { what:e.why, skip:r.skip });
  undoRebase(); save(); clearTimeout(UN.t);
  undoBtns(); undoToast(pre + e.why + (r.skip ? ' (그 뒤에 마틴이 고친 곳은 그대로 둠)' : ''));
}
function undoBtns(){
  const u = $('#btnUndo'), r = $('#btnRedo'); if (!u) return;
  u.disabled = !UN.back.length; r.hidden = !UN.fwd.length;
  u.title = UN.back.length ? '되돌리기 — ' + UN.back[UN.back.length - 1].why : '되돌릴 것이 없다';
  r.title = UN.fwd.length ? '다시 하기 — ' + UN.fwd[UN.fwd.length - 1].why : '';
}
function undoToast(t){ const b = $('#board'); if (!b) return; const old = b.querySelector('.undo-toast'); if (old) old.remove();
  const el = document.createElement('div'); el.className = 'undo-toast'; el.textContent = t; b.appendChild(el); setTimeout(() => el.classList.add('out'), 2600); setTimeout(() => el.remove(), 3200); }
/* 마틴에게 — 지난 답 뒤로 동료가 되돌린 것 (ai.js buildPrompt 가 부른다) */
function undoText(){
  const u = (S && S.undone || []).filter(x => x.turn === S.turn); if (!u.length) return '';
  const one = x => x.mart ? `네 답이 판에 한 것 통째로(${String(x.what).replace(/^마틴의 답 — /, '')})` : x.what;   /* 11-18 A: 마틴의 답도 한 칸으로 무를 수 있다 */
  return `\n[동료가 되돌렸다 — 네 지난 답 뒤로 동료가 '되돌리기'를 눌렀다. 대화는 그대로다]\n${u.map(x => `- ${x.redo ? '다시 함' : '되돌림'}: ${one(x)}`).join('\n')}\n`;
}
$('#btnUndo').onclick = () => undoGo(-1);
$('#chips').addEventListener('click', e => { const x = e.target.closest('[data-x]'); if (!x) return; const i = +x.dataset.x, a = att[i]; if (!a) return;   /* 첨부 뺌도 동료의 일 — input.js 가 빼기 전에 적어 둔다 */
  UN.back.push({ att:a, i, logN:S ? S.log.length : 0, why:`첨부 「${a.name}」 뺌` }); UN.fwd = []; undoBtns(); }, true);
document.querySelector('.undo-bt').addEventListener('pointerdown', e => e.stopPropagation());   /* 판 끌기(view.js)가 손가락을 잡아 가지 않게 */
$('#btnRedo').onclick = () => undoGo(1);
addEventListener('keydown', e => {   /* 넓은 화면 — Ctrl+Z 되돌리기, Ctrl+Shift+Z·Ctrl+Y 다시 하기. 글을 쓰는 중엔 글자 되돌리기에 양보 */
  if (!(e.ctrlKey || e.metaKey) || /^(INPUT|TEXTAREA)$/.test((document.activeElement || {}).tagName || '')) return;
  const k = e.key.toLowerCase(); if (k === 'z' && !e.shiftKey){ e.preventDefault(); undoGo(-1); } else if (k === 'y' || (k === 'z' && e.shiftKey)){ e.preventDefault(); undoGo(1); }
});
setInterval(() => { if (S && S !== UN.S) undoReset(); }, 300);
addEventListener('pointerdown', () => { if (UN.t && S && S === UN.S && !busy) undoCommit(); }, true);   /* 11-16 C: 새 손짓이 시작되면 앞 손짓을 먼저 한 칸으로 — 빠르게 이어 해도 한 칸씩 무를 수 있게 */   /* 사건이 바뀌면(불러옴·새 사건·지난 사건) 되돌리기 칸을 비우고 새로 시작 */
