/* martin/js/mode.js — 자료 형편(자료 닫힘 모드)(v0.14, 11-17 B). 고칠 땐 이 줄 아래에 「11-17 B: …」처럼 날짜·방 주석 */
/* 보스의 첫 장편 사건: 동료가 「더 캘 수 없다」고 못 박았는데도 마틴이 「가져와라」를 28번 했다(계획 v0.14 진단 3).
   S.closed — true = 닫힘(더 가져올 자료 없음) · false = 열림(더 구해 올 수 있음) · 없음 = 아직 모름.
   켜는 길 둘: ① 동료의 말에서 앱이 감지(modeSense — buildPrompt 가 modeText 를 부를 때) ② 마틴이 답에 "mode":"closed"|"open".
   닫히면 modeFilter(res) 가 ask(캐 올 것)와 「가져와라」류 말·수첩 할 일을 걸러 내고, 프롬프트(modeText)는 「아직 안 맞춰 본 조합을 내놓아라」.
   모르는 채로 사건이 시작되면 첫머리에 한 번만 「자료를 더 구할 수 있나」 묻게 한다(S.moreAsked).
   수첩 서랍 맨 위(#nbMode — .nb-top 과 #nbBody 사이)에 한 줄 표시. notebook.js 는 안 건드린다 */
const MODE_END = String.raw`(?=\s|$|[.!~,…ㅋㅎ])`;
const MODE_CLOSE = new RegExp([
  String.raw`더\s*(이상\s*)?(없어|없다|없음|없습니다|없네|없어요|없거든|없는데|없을\s*거)(?!\s*보)`,
  String.raw`(캘|구할|가져올|찾을)\s*수\s*(가\s*)?없`, String.raw`못\s*캐`, String.raw`더는\s*못\s*(구|가져|캐|찾)`,
  String.raw`(이게|이것이|이거)\s*(다|전부|끝)((이?야|예요|이에요|이다|임|입니다)` + MODE_END + String.raw`|(?=$|[.!~,…]))`,
  String.raw`더\s*가져올\s*(게|것|건|자료)?\s*없`, String.raw`자료(는|가)?\s*(이게\s*)?(끝|전부)(이?야|이다|다|임)?` + MODE_END
].join('|'));
const MODE_OPEN = /(더\s*(구해|가져|캐|찾아)\s*(올|와|볼)\s*수\s*있|더\s*구할\s*수\s*있|또\s*가져올\s*수|자료\s*(가|는)?\s*더\s*있)/;
const MODE_FETCH = /(가져\s*와|가져다\s*(줘|달라)|캐\s*와|구해\s*와|찾아\s*와|보내\s*(줘|와)|가져올\s*수\s*있(나|겠|냐|어)|확보해\s*(와|줘))/;
let modeAskNow = false;   /* 이번 프롬프트가 「더 구할 수 있나」를 시켰나 */
function modeSet(v, why){
  if (!S || S.closed === v) return;
  if (v === undefined) delete S.closed; else S.closed = v;
  S.closedTurn = S.turn; act(v ? '자료 닫힘' : '자료 열림', { why }); save(); modeBar();
}
/* 동료의 마지막 말에서 자료 형편을 읽는다(그 말 한 번에 한 번만) */
function modeSense(){
  if (!S) return;
  const m = [...(S.log || [])].reverse().find(l => l.who === 'p'); if (!m || !m.text || m.at === S.modeSeen) return;
  S.modeSeen = m.at; const t = m.text.slice(0, 400);
  if (MODE_OPEN.test(t)) modeSet(false, '동료의 말');
  else if (MODE_CLOSE.test(t)) modeSet(true, '동료의 말');
}
/* 프롬프트 한 칸 — buildPrompt 가 [이번에 동료가 가져온 것] 바로 위에 붙인다 */
function modeText(){
  modeSense(); modeAskNow = false;
  if (S.closed === true) return `[자료 형편 — 닫힘(턴 ${S.closedTurn ?? '-'}부터)] 동료가 더 가져올 자료가 없다고 했다. 자료를 요구하지 마라 — ask 는 비우고, 「가져와라·캐 와라·구해 와라」 같은 말도 하지 않는다. 대신 이미 있는 조각 중 아직 맞춰 보지 않은 조합(다른 방의 시각끼리, 한 사람의 말끼리, 판독문 속 지나가듯 적힌 문장)을 꺼내 추리를 앞으로 민다. 동료가 새 자료를 구했다고 하면 mode 에 "open".\n`;
  if (S.closed === false) return `[자료 형편 — 열림] 동료는 자료를 더 구해 올 수 있다. 그래도 ask 는 수사가 막혔을 때만, 한 번에 하나. 동료가 더 없다고 하면 mode 에 "closed".\n`;
  if (!S.moreAsked && (S.log || []).some(l => l.who === 'p')){ modeAskNow = true;
    return `[자료 형편 — 아직 모름] 이번 답에서 한 번만, 동료가 자료를 더 구해 올 수 있는 형편인지 짧게 물어라(say 끝에 한 줄). 동료가 답하면 mode 에 "closed"(더 없음) 또는 "open"(더 구해 올 수 있음).\n`; }
  return `[자료 형편 — 아직 모름] 동료가 자료가 더 없다고 하면 mode 에 "closed", 더 구해 올 수 있다고 하면 "open".\n`;
}
/* 마틴의 답을 연출 전에 거른다(ai.js turn() 의 고리) */
function modeFilter(res){
  if (!res || typeof res !== 'object') return res;
  if (modeAskNow){ S.moreAsked = S.turn + 1; modeAskNow = false; }
  const mv = String(res.mode || '').toLowerCase();
  if (mv === 'closed') modeSet(true, '마틴'); else if (mv === 'open') modeSet(false, '마틴');
  if (S.closed === true){
    const cut = [];
    if (res.ask){ cut.push('ask'); res.ask = ''; }
    if (Array.isArray(res.say)){ const n0 = res.say.length; res.say = res.say.filter(l => !MODE_FETCH.test(typeof l === 'string' ? l : (l && l.t) || '')); if (res.say.length < n0) cut.push(`말 ${n0 - res.say.length}줄`); }
    if (Array.isArray(res.notes)){ const n0 = res.notes.length; res.notes = res.notes.filter(n => !(n && n.k === 'todo' && MODE_FETCH.test(n.t || '') || n && n.k === 'todo' && /(캐|가져|구해|확보)/.test(n.t || ''))); if (res.notes.length < n0) cut.push(`수첩 할 일 ${n0 - res.notes.length}줄`); }
    if (cut.length) act('자료 닫힘 — 요구 걸러냄', { cut:cut.join(' · ') });
  }
  if (Array.isArray(res.say) && res.say.length > 8){ const n0 = res.say.length; res.say = [...res.say.slice(0, 7), res.say[n0 - 1]]; act('말 줄임', { from:n0, to:8 }); }   /* 말 줄 수 — 많아야 8(마지막 못 박는 줄은 남김) */
  return res;
}
/* 수첩 맨 위 한 줄 */
function modeBar(){
  const on = typeof S !== 'undefined' && !!S && S.closed === true;   /* 사건을 불러오기 전엔 S 가 비어 있다 */
  let el = $('#nbMode');
  if (!el){ const top = $('#nb .nb-top'); if (!top) return; top.insertAdjacentHTML('afterend', '<div id="nbMode" class="nbmode"></div>'); el = $('#nbMode');
    el.addEventListener('click', e => { if (e.target.closest('[data-mopen]')){ modeSet(false, '동료가 단추로'); } }); }
  if (on){ el.innerHTML = `<b>자료 닫힘</b><span>더 가져올 자료 없음 — 있는 조각으로만${S.closedTurn != null ? ` · 턴 ${S.closedTurn}부터` : ''}</span><button type="button" data-mopen>다시 열기</button>`; el.hidden = false; }
  else { el.innerHTML = ''; el.hidden = true; }
  modeBar.on = on;
}
if (typeof UNDO_SKIP !== 'undefined') for (const k of ['modeSeen', 'moreAsked', 'closedTurn']) UNDO_SKIP.add(k);   /* 판 상태가 아님 — 되돌리지 않는다(closed 자체는 판처럼 되돌릴 수 있게 둔다) */
modeBar();
new MutationObserver(() => { if (!$('#nbMode')) modeBar(); }).observe($('#nb'), { childList:true });
setInterval(() => { if (typeof S !== 'undefined' && S && (S.closed === true) !== !!modeBar.on) modeBar(); }, 800);   /* 사건을 바꾸거나 되돌리면 표시도 따라감 */
