/* ── 화이트보드 (v0.9) — 세희가 만든 표·목록·메모·차트, 보스가 넘긴 문서가 테이프로 붙는다 ──
   지우라고 하기 전까지 그대로 남는다. 아래 말풍선은 사무실과 같은 대화(틀만 다르다). */
const BOARD = { cards:null, changed:null };
async function boardLoad(){ if (!BOARD.cards) BOARD.cards = ((await kvGet('board')) || {}).cards || []; return BOARD.cards; }
const boardSave = () => kvSet('board', { cards:BOARD.cards });
const cell = v => v === null || v === undefined ? '' : String(v).slice(0, 300);
function cardFrom(a, by){
  const kind = ['report', 'table', 'list', 'note', 'chart', 'file'].includes(a.kind) ? a.kind : (a.sections ? 'report' : a.rows ? 'table' : a.items ? 'list' : a.values ? 'chart' : 'note');
  const c = { id:uid(), kind, title:String(a.title || '제목 없음').slice(0, 80), at:Date.now(), by:by || 'sehee' };
  return cardApply(c, a);
}
function cardApply(c, a){
  if (a.title) c.title = String(a.title).slice(0, 80);
  if (Array.isArray(a.columns)) c.columns = a.columns.slice(0, 12).map(cell);
  if (Array.isArray(a.rows)) c.rows = a.rows.slice(0, 300).map(r => (Array.isArray(r) ? r : [r]).slice(0, 12).map(cell));
  if (Array.isArray(a.items)) c.items = a.items.slice(0, 150).map(cell);
  if (typeof a.text === 'string') c.text = a.text.slice(0, 60000);
  if (a.chart_type) c.chartType = a.chart_type === 'line' ? 'line' : 'bar';
  if (Array.isArray(a.labels)) c.labels = a.labels.slice(0, 40).map(cell);
  if (Array.isArray(a.values)) c.values = a.values.slice(0, 40).map(v => Number(v) || 0);
  if (typeof a.unit === 'string') c.unit = a.unit.slice(0, 12);
  if (a.name) c.name = String(a.name);
  if (typeof a.summary === 'string') c.summary = plainChat(a.summary).slice(0, 2000);
  if (typeof a.basis === 'string') c.basis = a.basis.slice(0, 300);
  if (Array.isArray(a.highlights)) c.highlights = a.highlights.slice(0, 4).map(h => ({ label:plainChat(cell(h && h.label)).slice(0, 20), value:plainChat(cell(h && h.value)).slice(0, 24) })).filter(h => h.label || h.value);
  if (Array.isArray(a.sections)) c.sections = a.sections.slice(0, 20).map(x => ({ heading:plainChat(cell(x && x.heading)), text:plainChat(String((x && x.text) || '')).slice(0, 6000),
    points:Array.isArray(x && x.points) ? x.points.slice(0, 30).map(v => plainChat(cell(v))) : [],
    cols:Array.isArray(x && x.table_columns) ? x.table_columns.slice(0, 10).map(cell) : [], rows:Array.isArray(x && x.table_rows) ? x.table_rows.slice(0, 60).map(r => (Array.isArray(r) ? r : [r]).slice(0, 10).map(cell)) : [] }));
  if (a.pages) c.pages = a.pages;
  c.edited = Date.now();
  return c;
}
async function boardAdd(c, note){
  await boardLoad(); BOARD.cards.unshift(c); await boardSave();
  if (note !== false){ O.log.push({ who:'a', board:true, text:`화이트보드에 붙였어요 — ${c.title}`, at:Date.now() }); renderLog(); saveLog(); }
  return c;
}
async function boardContext(){
  await boardLoad();
  if (!BOARD.cards.length) return '화이트보드: 비어 있음';
  return '화이트보드 카드 (최근 것부터):\n' + BOARD.cards.slice(0, 20).map(c => `- #${c.id} ${({ report:'보고서', table:'표', list:'목록', note:'메모', chart:'차트', file:'문서' })[c.kind]} '${c.title}'${c.rows ? ` (${c.rows.length}행)` : c.items ? ` (${c.items.length}개)` : ''}`).join('\n');
}
const BOARD_TOOLS = () => [
  { name:'make_card', description:'화이트보드에 카드를 붙인다. 표·목록·비교·수치 정리·차트·긴 메모처럼 눈으로 볼 자료를 만들 때 쓴다(판 항목과 별개).', schema:{ type:'object', properties:{
    kind:{ type:'string', enum:['report', 'table', 'list', 'note', 'chart'], description:'report=정리 보고서, table=표, list=목록, note=메모, chart=막대·선 차트' },
    title:{ type:'string', description:'짧은 제목' },
    columns:{ type:'array', items:{ type:'string' }, description:'표 머리(열 이름)' },
    rows:{ type:'array', items:{ type:'array', items:{ type:'string' } }, description:'표 내용. 행마다 칸 글자 배열' },
    items:{ type:'array', items:{ type:'string' }, description:'목록 줄들' },
    text:{ type:'string', description:'메모 본문' },
    chart_type:{ type:'string', enum:['bar', 'line'] },
    labels:{ type:'array', items:{ type:'string' }, description:'차트 가로축 이름들' },
    values:{ type:'array', items:{ type:'number' }, description:'차트 값들(labels 와 같은 순서)' },
    unit:{ type:'string', description:'값 단위. 예: 명, 원, %' },
    summary:{ type:'string', description:'보고서 맨 위 핵심 요약 2~3문장' },
    basis:{ type:'string', description:'보고서 근거 자료. 예: 11/8 원장님 카톡, 민수실장_분석.docx' },
    highlights:{ type:'array', description:'보고서 맨 위 핵심 숫자·사실 2~4개(선택). 예: {label:"남은 일", value:"4건"}', items:{ type:'object', properties:{ label:{ type:'string' }, value:{ type:'string' } }, required:['label', 'value'] } },
    sections:{ type:'array', description:'보고서 본문 섹션들', items:{ type:'object', properties:{
      heading:{ type:'string', description:'섹션 제목' }, text:{ type:'string', description:'문단. 평범한 문장' },
      points:{ type:'array', items:{ type:'string' }, description:'짧은 요점 줄(선택)' },
      table_columns:{ type:'array', items:{ type:'string' }, description:'섹션 안 표 머리(선택)' },
      table_rows:{ type:'array', items:{ type:'array', items:{ type:'string' } }, description:'섹션 안 표 내용(선택)' } }, required:['heading'] } } }, required:['kind', 'title'] } },
  { name:'update_card', description:'화이트보드 카드를 고친다. 바꿀 것만 넣는다(표는 columns·rows 를 통째로).', schema:{ type:'object', properties:{
    id:{ type:'string', description:'카드 id (# 없이)' }, title:{ type:'string' },
    columns:{ type:'array', items:{ type:'string' } }, rows:{ type:'array', items:{ type:'array', items:{ type:'string' } } },
    items:{ type:'array', items:{ type:'string' } }, text:{ type:'string' },
    labels:{ type:'array', items:{ type:'string' } }, values:{ type:'array', items:{ type:'number' } },
    summary:{ type:'string' }, sections:{ type:'array', items:{ type:'object', properties:{ heading:{ type:'string' }, text:{ type:'string' }, points:{ type:'array', items:{ type:'string' } } } } } }, required:['id'] } },
  { name:'remove_card', description:'화이트보드에서 카드를 뗀다. 보스가 분명히 떼라고 할 때만.', schema:{ type:'object', properties:{ id:{ type:'string' } }, required:['id'] } },
  { name:'read_card', description:'화이트보드 카드 내용을 전부 본다(문서 카드의 본문 포함).', schema:{ type:'object', properties:{ id:{ type:'string' } }, required:['id'] } },
];
async function runBoardTool(c){
  await boardLoad();
  const a = c.args || {}, id = String(a.id || '').replace(/^#/, ''), card = BOARD.cards.find(x => x.id === id);
  if (c.name === 'make_card'){
    const nc = cardFrom(a); await boardAdd(nc); BOARD.changed = nc.id;
    return { ok:true, id:nc.id };
  }
  if (!card) return { ok:false, error:'그 id의 카드가 없음' };
  if (c.name === 'update_card'){
    cardApply(card, a); await boardSave(); BOARD.changed = card.id;
    O.log.push({ who:'a', board:true, text:`화이트보드 카드를 고쳤어요 — ${card.title}`, at:Date.now() }); renderLog(); saveLog();
    return { ok:true, id:card.id };
  }
  if (c.name === 'remove_card'){
    BOARD.cards = BOARD.cards.filter(x => x !== card); await boardSave(); if (DW.open === 'board') boardRender();
    O.log.push({ who:'a', board:true, text:`화이트보드에서 뗐어요 — ${card.title}`, at:Date.now() }); renderLog(); saveLog();
    return { ok:true };
  }
  if (c.name === 'read_card') return { ok:true, card:{ ...card, text:card.text ? card.text.slice(0, 30000) : undefined } };
  return { ok:false, error:'모르는 도구' };
}
/* 그리기 */
const REPORT_CSS = `.rp{font-size:.9rem;line-height:1.7}.rp-meta{font-size:.7rem;color:#777}.rp-t{font:700 1.25rem var(--f-head);margin:4px 0 10px;padding-bottom:6px;border-bottom:2px solid #2b2417}
.rp-sum{background:#f3efe2;border-left:4px solid #a13b2c;padding:7px 11px;margin:0 0 12px}.rp-sum b{font-size:.75rem;color:#a13b2c}.rp-sum p{margin:2px 0 0}
.rp-s h3{font-size:.95rem;margin:12px 0 4px}.rp-s p{margin:0 0 6px}.rp-s ul{margin:2px 0 6px;padding-left:18px}
.rp .ct{border-collapse:collapse;width:100%;font-size:.8rem;margin:4px 0 8px}.rp .ct th,.rp .ct td{border:1px solid #ccc;padding:3px 6px;text-align:left}.rp .ct th{background:#f0ebdc}`;
const tapeRot = id => { let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0; return ((h % 9) - 4) * 0.8; };
function tableHtml(c, max){
  const rows = c.rows || [], cols = c.columns || [], R = max ? rows.slice(0, max) : rows, w = Math.max(cols.length, ...rows.map(r => r.length), 0), C = max ? Math.min(w, 4) : w;
  return `<table class="ct">${cols.length ? `<thead><tr>${cols.slice(0, C).map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead>` : ''}<tbody>${R.map(r => `<tr>${[...Array(C)].map((_, i) => `<td>${esc(r[i] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table>`
    + (max && (rows.length > max || w > C) ? `<small class="more">${rows.length}행 × ${w}열</small>` : '');
}
function chartSvg(c, W, H){
  const L = c.labels || [], V = c.values || [], n = Math.max(L.length, V.length); if (!n) return '<p class="note">값이 없어요</p>';
  const max = Math.max(...V, 0) || 1, pl = 6, pb = 18, pt = 14, cw = (W - pl * 2) / n, ch = H - pb - pt, y = v => pt + ch - (Math.max(v, 0) / max) * ch;
  const lab = (s, i) => `<text x="${pl + cw * i + cw / 2}" y="${H - 5}" text-anchor="middle" font-size="9" fill="#5c5340">${esc(String(s).slice(0, Math.max(2, Math.floor(cw / 7))))}</text>`;
  const val = (v, i, yy) => `<text x="${pl + cw * i + cw / 2}" y="${yy - 3}" text-anchor="middle" font-size="9" fill="#2b2417">${(+v).toLocaleString('ko-KR')}</text>`;
  let body = '';
  if (c.chartType === 'line'){
    const pts = V.map((v, i) => `${pl + cw * i + cw / 2},${y(v)}`).join(' ');
    body = `<polyline points="${pts}" fill="none" stroke="#3a6b64" stroke-width="2"/>` + V.map((v, i) => `<circle cx="${pl + cw * i + cw / 2}" cy="${y(v)}" r="3" fill="#3a6b64"/>${val(v, i, y(v))}`).join('');
  } else body = V.map((v, i) => `<rect x="${pl + cw * i + cw * 0.18}" y="${y(v)}" width="${cw * 0.64}" height="${pt + ch - y(v)}" fill="#a13b2c" rx="2"/>${val(v, i, y(v))}`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="cc"><line x1="${pl}" y1="${pt + ch}" x2="${W - pl}" y2="${pt + ch}" stroke="#c3b795"/>${body}${L.map(lab).join('')}</svg>${c.unit ? `<small class="more">단위: ${esc(c.unit)}</small>` : ''}`;
}
function reportHtml(c){
  const d = new Date(c.edited || c.at);
  return `<article class="rp"><div class="rp-meta">보고 · 강세희 · ${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}${c.basis ? ' · 근거: ' + esc(c.basis) : ''}</div>
    <h2 class="rp-t">${esc(c.title)}</h2>${c.summary ? `<div class="rp-sum"><b>요약</b><p>${esc(c.summary)}</p></div>` : ''}
    ${(c.sections || []).map((x, i) => `<section class="rp-s"><h3>${i + 1}. ${esc(x.heading)}</h3>${x.text ? x.text.split(/\n+/).map(t => `<p>${esc(t)}</p>`).join('') : ''}
      ${x.points && x.points.length ? `<ul>${x.points.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      ${x.rows && x.rows.length ? tableHtml({ columns:x.cols, rows:x.rows }, 0) : ''}</section>`).join('')}</article>`;
}
function reportText(c){
  const L = [c.title, ''];
  if (c.summary) L.push('요약', c.summary, '');
  (c.sections || []).forEach((x, i) => { L.push(`${i + 1}. ${x.heading}`); if (x.text) L.push(x.text); for (const t of x.points || []) L.push('· ' + t);
    if (x.rows && x.rows.length) for (const r of [x.cols || [], ...x.rows].filter(r => r.length)) L.push(r.join('\t')); L.push(''); });
  if (c.basis) L.push('근거: ' + c.basis);
  return L.join('\n').trim();
}
function cardBody(c, full){
  if (c.kind === 'report') return full ? reportHtml(c) : thumbHtml(c);
  if (c.kind === 'table') return tableHtml(c, full ? 0 : 5);
  if (c.kind === 'list') return `<ul class="cl">${(full ? c.items || [] : (c.items || []).slice(0, 6)).map(x => `<li>${esc(x)}</li>`).join('')}</ul>${!full && (c.items || []).length > 6 ? `<small class="more">${c.items.length}개</small>` : ''}`;
  if (c.kind === 'chart') return chartSvg(c, full ? 340 : 200, full ? 200 : 120);
  if (c.kind === 'file') return full ? `<pre class="cf">${esc(c.text || '')}</pre>` : `<div class="cfile">📄 ${esc(c.name || c.title)}</div><p class="cn">${esc((c.text || '').slice(0, 140))}</p><small class="more">${(c.text || '').length.toLocaleString('ko-KR')}자${c.pages ? ` · ${c.pages}쪽` : ''}</small>`;
  return full ? `<pre class="cf">${esc(c.text || '')}</pre>` : `<p class="cn">${esc((c.text || '').slice(0, 200))}</p>`;
}
async function boardOpen(){
  await boardLoad();
  if (!O.loaded){ O.log = (await kvGet('chat')) || []; O.loaded = true; }
  boardRender(); renderBoardTalk(); bdGrow();
}
function fitThumbs(){ document.querySelectorAll('.th-wrap').forEach(w => w.style.setProperty('--k', (w.clientWidth / 420).toFixed(4))); }
function boardRender(){
  const cs = BOARD.cards || [];
  $('wbSeg').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.mode === RL.mode));
  $('rlSeg').hidden = RL.mode !== 'reports'; $('rlSeg').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === RL.view));
  $('wbMemo').hidden = RL.mode === 'reports';
  if (RL.mode === 'reports'){
    const n = cs.filter(c => c.kind === 'report').length; $('wbCount').textContent = n ? `보고서 ${n}건` : '';
    $('wbGrid').classList.add('rl'); $('wbGrid').innerHTML = reportsHtml(); requestAnimationFrame(fitThumbs); return;
  }
  $('wbGrid').classList.remove('rl');
  $('wbCount').textContent = cs.length ? `카드 ${cs.length}장` : '';
  $('wbGrid').innerHTML = cs.length ? cs.map(c => `<div class="card k-${c.kind}" data-card="${c.id}" style="--r:${tapeRot(c.id)}deg"><i class="tape"></i><div class="ch">${esc(c.title)}</div>${cardBody(c, false)}<div class="cm">${c.by === 'boss' ? '보스' : c.kind === 'file' ? '받은 문서' : '세희'} · ${new Date(c.edited || c.at).getMonth() + 1}/${new Date(c.edited || c.at).getDate()}</div></div>`).join('')
    : `<div class="wb-empty">아직 붙은 게 없어요.<br>세희에게 "이번 주 일정 표로 정리해줘" 같은 걸 시키거나, 문서를 넘기면 여기 붙어요.</div>`;
  requestAnimationFrame(fitThumbs);
}
$('wbSeg').addEventListener('click', e => { const b = e.target.closest('[data-mode]'); if (!b) return; RL.mode = b.dataset.mode; boardRender(); });
$('rlSeg').addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; RL.view = b.dataset.v; localStorage.setItem('sehee-rlview', RL.view); boardRender(); });
window.addEventListener('resize', () => requestAnimationFrame(fitThumbs));
function flashCard(id){ const el = document.querySelector(`[data-card="${id}"]`); if (!el) return; el.scrollIntoView({ block:'nearest', behavior:'smooth' }); el.classList.remove('new'); void el.offsetWidth; el.classList.add('new'); }
async function loadChat(){ if (!O.loaded){ O.log = (await kvGet('chat')) || []; O.loaded = true; } }
function talkHtml(empty){
  const lastU = [...O.log].reverse().find(m => m.who === 'u'), lastS = [...O.log].reverse().find(m => m.who === 's');
  let h = '';
  if (lastU) h += `<div class="bt-u">보스 · ${esc((lastU.text || (lastU.pics ? '📷 사진 ' + lastU.pics + '장' : lastU.docs ? '📄 ' + lastU.docs.join(', ') : '')).slice(0, 90))}</div>`;
  if (WORK.ask) h += `<div class="bt-s ask">${esc(WORK.ask.m.text)}${askButtons(WORK.ask.m)}</div>`;
  else if (O.busy && O.live) h += O.live.text ? `<div class="bt-s">${esc(parseFace(O.live.text).t)}</div>` : `<div class="bt-s wait"><i><span></span><span></span><span></span></i><small>${esc(waitText())}</small></div>`;
  else if (lastS) h += `<div class="bt-s${lastS.err ? ' err' : ''}">${esc(lastS.text)}${askButtons(lastS)}${lastS.src && lastS.src.length ? `<span class="src">출처 ${lastS.src.map(x => `<a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.t || hostOf(x.u))}</a>`).join(' · ')}</span>` : ''}</div>`;
  else h += `<div class="bt-s">${empty}</div>`;
  /* 막힌 말풍선이면 여기서도 다시 시도 */
  const li = O.log.lastIndexOf(lastS);
  /* v1.5.5 말풍선 아래 아이콘(↻ 다시 · 🗑 지우기) — 대화창과 같은 단추 */
  if (lastS) h += `<div class="mfoot bt-foot">${msgTools(lastS, li, li)}</div>`;
  return { h, face:O.busy ? (O.live && O.live.faced ? 'talk' : 2) : (lastS ? lastS.face : 0) };
}
function renderPanTalk(){
  if (curView() !== 'pan' || !O.loaded) return;
  const t = talkHtml('판을 같이 봐요. "이거 끝났어", "내일 3시로 옮겨줘"처럼 말하면 바로 고칠게요.');
  $('ptBub').innerHTML = t.h; $('ptBub').scrollTop = $('ptBub').scrollHeight;
  const src = FACE(t.face); if ($('ptSpr').getAttribute('src') !== src) $('ptSpr').setAttribute('src', src);
}
let talkSig = '';
function renderBoardTalk(){
  renderPanTalk();
  if (BONUS.subs.talk){ const t = talkHtml(''), k = t.h + '|' + t.face; if (k !== talkSig){ talkSig = k; bonusEmit('talk', t); } }
  if (DW.open !== 'board') return;
  const t = talkHtml('카드를 누르면 크게 보여요. 물어보시면 브리핑할게요.');
  $('btBub').innerHTML = t.h; $('btBub').scrollTop = $('btBub').scrollHeight;
  const src = FACE(t.face); if ($('btSpr').getAttribute('src') !== src) $('btSpr').setAttribute('src', src);
}
setInterval(() => { if (O.busy && (DW.open === 'board' || curView() === 'pan') && !(O.live && O.live.text)) renderBoardTalk(); }, 1000);
let bonusWasBusy = false; setInterval(() => { if (bonusWasBusy && !O.busy) bonusEmit('turnEnd'); bonusWasBusy = !!O.busy; }, 400);
/* 대화 상자 옆으로 접기 (v1.5.2, B) — 판·보드·사람 대화 상자 공통.
   이름표(강세희)를 견출지처럼 오른쪽으로 끌면 상자가 화면 밖으로 접히고 오른쪽 끝에 '세희' 꼬리만 남는다(그만큼 아래가 보인다).
   꼬리를 왼쪽으로 끌거나 누르면 다시 나온다. 이름표를 그냥 눌러도 접힌다. 접혀 있을 때 세희 새 답이 오면 꼬리에 빨간 점.
   기기마다 기억(localStorage sehee.fold.<이름>). v1.2.8 의 위아래 접기(sehee.ptFold)는 이걸로 바뀜 */
function btFold(box, key){
  if (!box || box.dataset.fold) return; box.dataset.fold = key;
  const tag = box.querySelector('.bt-name b'); if (!tag) return;
  tag.classList.add('noswipe'); tag.title = '옆으로 끌거나 눌러서 접기';
  /* v1.5.11 이름 옆 ▶▷ — 은은하게 반짝이며 '끌거나 누르면 접힌다'를 알려 줌. 이름표 안에 있어 같이 끌린다 */
  if (!tag.querySelector('.bt-hint')) tag.insertAdjacentHTML('beforeend', '<i class="bt-hint" aria-hidden="true"><span>▶</span><span>▷</span></i>');
  const peek = document.createElement('button'); peek.type = 'button'; peek.className = 'bt-peek noswipe'; peek.setAttribute('aria-label', '세희 대화 펴기');
  peek.innerHTML = '<span>세희</span><i></i>'; box.appendChild(peek);
  const K = 'sehee.fold.' + key, lastAt = () => { for (let i = O.log.length - 1; i >= 0; i--) if (O.log[i].who === 's') return O.log[i].at; return 0; };
  let seen = 0;
  const save = on => { try{ localStorage.setItem(K, on ? '1' : '0'); }catch(e){} };
  const scale = () => (box.getBoundingClientRect().width / box.offsetWidth) || 1;
  const slide = (x, ms) => { box.style.transition = ms ? `transform ${ms}ms cubic-bezier(.2,.8,.2,1)` : 'none'; box.style.transform = x ? `translateX(${x}px)` : ''; };
  function fold(fromX){
    const w = box.offsetWidth; box.classList.remove('bt-sliding');
    slide(fromX || 0, 0); void box.offsetWidth; slide(w + 12, 260);
    setTimeout(() => { box.classList.add('sfold'); slide(0, 0); seen = lastAt(); peek.classList.remove('new'); save(true); dlog('화면', `대화 상자 접음(${key})`); }, 260);
  }
  function open(fromX){
    box.classList.remove('sfold'); const w = box.offsetWidth;
    slide(fromX == null ? w + 12 : fromX, 0); void box.offsetWidth; slide(0, 260);
    setTimeout(() => { box.style.transition = ''; }, 280); peek.classList.remove('new'); save(false); dlog('화면', `대화 상자 폄(${key})`);
  }
  /* 이름표 끌기 — 오른쪽으로만 따라온다. 28% 넘게 끌거나 50px 넘게 휙 밀면 접힘 */
  let d = null;
  tag.addEventListener('pointerdown', e => { if (e.button > 0) return; d = { x0:e.clientX, t0:performance.now(), on:false, k:scale(), w:box.offsetWidth, pid:e.pointerId }; try{ tag.setPointerCapture(e.pointerId); }catch(x){} });
  tag.addEventListener('pointermove', e => { if (!d || e.pointerId !== d.pid) return; const dx = (e.clientX - d.x0) / d.k;
    if (!d.on){ if (Math.abs(dx) < 6) return; d.on = true; } slide(Math.max(0, dx), 0); });
  const tagUp = e => { if (!d || e.pointerId !== d.pid) return; const g = d; d = null; const dx = Math.max(0, (e.clientX - g.x0) / g.k), v = dx / Math.max(1, performance.now() - g.t0);
    if (!g.on){ fold(0); return; }
    if (dx > g.w * 0.28 || (v > 0.8 && dx > 50)) fold(dx); else slide(0, 200); };   // 짧은 움직임은 휙이어도 제자리
  tag.addEventListener('pointerup', tagUp); tag.addEventListener('pointercancel', e => { if (d && e.pointerId === d.pid){ d = null; slide(0, 200); } });
  /* 꼬리 끌기 — 왼쪽으로 당기면 상자가 따라 나온다. 28% 넘게 나오거나 휙 당기면 펴짐, 아니면 다시 접힘. 그냥 누르면 펴짐 */
  let q = null;
  peek.addEventListener('pointerdown', e => { if (e.button > 0) return; e.preventDefault(); q = { x0:e.clientX, t0:performance.now(), on:false, k:scale(), pid:e.pointerId }; try{ peek.setPointerCapture(e.pointerId); }catch(x){} });
  peek.addEventListener('pointermove', e => { if (!q || e.pointerId !== q.pid) return; const dx = (e.clientX - q.x0) / q.k;
    if (!q.on){ if (dx > -6) return; q.on = true; box.classList.remove('sfold'); box.classList.add('bt-sliding'); q.w = box.offsetWidth; }
    slide(Math.max(0, q.w + 12 + dx), 0); });
  const peekUp = e => { if (!q || e.pointerId !== q.pid) return; const g = q; q = null;
    if (!g.on){ open(); return; }
    const dx = (e.clientX - g.x0) / g.k, out = -dx, v = out / Math.max(1, performance.now() - g.t0); box.classList.remove('bt-sliding');
    if (out > g.w * 0.28 || (v > 0.8 && out > 50)) open(Math.max(0, g.w + 12 + dx)); else fold(Math.max(0, g.w + 12 + dx)); };
  peek.addEventListener('pointerup', peekUp); peek.addEventListener('pointercancel', e => { if (q && e.pointerId === q.pid){ q = null; box.classList.remove('bt-sliding'); fold(box.offsetWidth); } });
  peek.addEventListener('click', e => e.preventDefault());
  /* 접혀 있을 때 새 답 → 빨간 점 */
  setInterval(() => { if (box.classList.contains('sfold')){ const a = lastAt(); if (a && seen && a > seen) peek.classList.add('new'); } }, 800);
  let on = false; try{ on = localStorage.getItem(K) === '1'; }catch(e){}
  if (on){ box.classList.add('sfold'); setTimeout(() => { seen = lastAt(); }, 1500); }
  box.btFold = { fold, open, folded:() => box.classList.contains('sfold') };
}
/* 판 위 대화 상자: 이름표 끌기/누르기 = 옆으로 접기(v1.5.2), 높이만큼 판 아래를 비워 둔다. 대화 보기 단추는 v1.5.11 에 없앰(↻·🗑 등 다른 단추로 충분) */
(function panTalkInit(){
  const pt = $('panTalk');
  try{ if (localStorage.getItem('sehee.ptFold') === '1' && localStorage.getItem('sehee.fold.pan') === null) localStorage.setItem('sehee.fold.pan', '1'); localStorage.removeItem('sehee.ptFold'); }catch(e){}
  $('ptName').textContent = '강세희';
  btFold(pt.querySelector('.pt-box'), 'pan');
  btFold(document.querySelector('#dw-board .bt'), 'board');
  $('ptBub').addEventListener('click', e => { msgToolClick(e); });
  const fit = () => document.body.style.setProperty('--pth', pt.offsetHeight + 'px');
  if (window.ResizeObserver) new ResizeObserver(fit).observe(pt); fit();
})();
const tsvOf = c => c.kind === 'report' ? reportText(c) : c.kind === 'table' ? [c.columns || [], ...(c.rows || [])].filter(r => r.length).map(r => r.map(x => String(x).replace(/[\t\n]/g, ' ')).join('\t')).join('\n')
  : c.kind === 'list' ? (c.items || []).map(x => '• ' + x).join('\n') : c.kind === 'chart' ? (c.labels || []).map((l, i) => `${l}\t${(c.values || [])[i] ?? ''}`).join('\n') : (c.text || '');
function csvOf(c){
  const rows = c.kind === 'table' ? [c.columns || [], ...(c.rows || [])].filter(r => r.length) : c.kind === 'chart' ? (c.labels || []).map((l, i) => [l, (c.values || [])[i]]) : (c.items || [c.text || '']).map(x => [x]);
  return '﻿' + rows.map(r => r.map(x => { const s = String(x ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\r\n');
}
function cardSheet(id){
  const c = (BOARD.cards || []).find(x => x.id === id); if (!c) return;
  openSheet(`<h4>${esc(c.title)}</h4><div class="card-full k-${c.kind}">${cardBody(c, true)}</div>
    <div class="row" style="margin-top:10px;flex-wrap:wrap;gap:6px">
      <button class="chip" data-bact="copy" data-id="${c.id}">${c.kind === 'table' ? '표 복사 (엑셀에 붙여넣기)' : '글 복사'}</button>
      ${c.kind === 'report' ? `<button class="chip" data-bact="print" data-id="${c.id}">인쇄 · PDF로 저장</button>` : ''}
      ${c.kind === 'table' || c.kind === 'chart' ? `<button class="chip" data-bact="csv" data-id="${c.id}">엑셀 파일(CSV) 받기</button>` : ''}
      <button class="chip" data-bact="brief" data-id="${c.id}">세희 브리핑</button>
      <button class="chip danger" data-bact="del" data-id="${c.id}">떼기</button>
    </div><p class="note" id="bnote"></p>`);
}
$('btBub').addEventListener('click', e => { msgToolClick(e); });
$('wbGrid').addEventListener('click', e => {
  const r = e.target.closest('[data-rep]'); if (r){ rvOpen(r.dataset.rep); return; }
  const el = e.target.closest('[data-card]'); if (!el) return;
  const c = (BOARD.cards || []).find(x => x.id === el.dataset.card);
  if (c && c.kind === 'report') rvOpen(c.id); else cardSheet(el.dataset.card);
});
$('sheet').addEventListener('click', async e => {
  const b = e.target.closest('[data-bact]'); if (!b) return;
  const c = (BOARD.cards || []).find(x => x.id === b.dataset.id); if (!c) return;
  const a = b.dataset.bact;
  if (a === 'copy') navigator.clipboard.writeText(tsvOf(c)).then(() => { $('bnote').textContent = '복사했어요. 엑셀·시트·카톡에 붙여넣으면 돼요.'; }, () => { $('bnote').textContent = '복사가 막혔어요.'; });
  else if (a === 'csv'){ const u = URL.createObjectURL(new Blob([csvOf(c)], { type:'text/csv;charset=utf-8' })), l = document.createElement('a'); l.href = u; l.download = (c.title.replace(/[\\/:*?"<>|]/g, '') || 'sehee') + '.csv'; l.click(); setTimeout(() => URL.revokeObjectURL(u), 2000); }
  else if (a === 'print'){
    const w = window.open('', '_blank'); if (!w){ $('bnote').textContent = '새 창이 막혔어요.'; return; }
    w.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${esc(c.title)}</title><style>${REPORT_CSS}body{margin:28px auto;max-width:720px;font-family:"Noto Sans KR","Malgun Gothic",sans-serif;color:#222}</style></head><body>${reportHtml(c)}<script>setTimeout(()=>print(),300)<\/script></body></html>`);
    w.document.close();
  }
  else if (a === 'brief'){ closeSheet(); $('sayText').value = `'${c.title}' 카드 브리핑해줘`; sendSay(); }
  else if (a === 'del'){
    if (!b.textContent.includes('한 번 더')){ b.textContent = '한 번 더 누르면 떼요'; return; }
    BOARD.cards = BOARD.cards.filter(x => x !== c); await boardSave(); closeSheet(); boardRender();
  }
});
$('wbMemo').onclick = () => {
  openSheet(`<h4>메모 붙이기</h4><input class="free" id="memoT" placeholder="제목"><textarea class="big" id="memoX" placeholder="내용"></textarea><div class="row" style="margin-top:8px"><button class="chip" data-bact2="memo">붙이기</button></div>`);
};
$('sheet').addEventListener('click', async e => {
  const b = e.target.closest('[data-bact2="memo"]'); if (!b) return;
  const t = $('memoT').value.trim(), x = $('memoX').value.trim(); if (!t && !x) return;
  const c = cardFrom({ kind:'note', title:t || x.slice(0, 20), text:x }, 'boss'); await boardAdd(c, false); closeSheet(); boardRender(); flashCard(c.id);
});
/* 보드 아래 입력칸 — 사무실과 같은 대화로 보낸다 */
const bdGrow = () => { const t = $('bdText'); if (t.offsetParent){ t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 100) + 'px'; } $('bdGo').disabled = !t.value.trim() || O.busy; };
$('bdText').addEventListener('input', bdGrow);
$('bdText').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); if ($('bdText').value.trim()) sendSay($('bdText')); } });
$('bdText').addEventListener('focus', () => document.body.classList.add('typing'));
$('bdText').addEventListener('blur', () => document.body.classList.remove('typing'));
$('bdGo').addEventListener('pointerdown', e => e.preventDefault());
$('bdGo').onclick = () => { if ($('bdText').value.trim()) sendSay($('bdText')); };
(function measure(){
  const set = () => {
    $('office').style.setProperty('--sayh', $('say').offsetHeight + 'px');
    document.documentElement.style.setProperty('--hh', document.querySelector('header').offsetHeight + 'px');
    const r1 = document.querySelector('header .hrow'); document.documentElement.style.setProperty('--hh1', (r1.offsetTop + r1.offsetHeight + 6) + 'px');
    document.documentElement.style.setProperty('--tb', $('tabs').offsetHeight + 'px');
  };
  set(); if (window.ResizeObserver){ const ro = new ResizeObserver(set); ro.observe(document.querySelector('header')); ro.observe($('tabs')); ro.observe($('say')); }
})();
