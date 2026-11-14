/* ── 달력 쪽 (11-15 C, v2.0) — 서랍 달력·연간 달력 폐기. 달력만의 쪽 ──
   학교·사무실 벽의 「이달의 일정」 화이트보드: 위에 월간 칠판, 왼쪽 아래 세희(서 있는 그림), 오른쪽 아래 대사창.
   대사창은 사무실 대화와 같은 내용(talkHtml)이고 여기서 바로 말할 수 있다.
   날짜(due)가 있는 판 항목이 칠판에 저절로 붙는다. ‹ › 나 칠판을 옆으로 밀어 달을 바꾼다(처음은 오늘이 든 달). 연간은 나중에.
   날짜를 누르면 그날 쪽지(포스트잇)가 붙고, 거기서 바로 넣을 수 있다.
   세희가 날짜 있는 일을 적거나 옮기면(작업 중계 — js/work.js) 이 쪽이 저절로 켜지고, 세희가 메모하는 그림으로 바뀌며 그 칸에 마커로 써진다.
   옛 이름(calOpen·calYear·calMonth·dwOpen('cal')·#calSheet [data-d])은 남의 파일이 부르므로 그대로 둔다. */
const CAL = { year:null, month:null, day:null, items:[], byDate:{}, changed:null, on:false, writing:false, fresh:null, swiped:0 };
const secColor = id => (secById(id) || secs()[0] || {}).color || '#3a6b64';
/* 세희 얼굴 번호(대화) → 서 있는 그림. 0 기본은 브리핑 손짓 */
const CAL_VN = { 0:'vn-present', 1:'vn-ponder', 2:'vn-think', 3:'vn-smile', 4:'vn-explain', 5:'vn-explain', 6:'vn-scold', talk:'vn-offer' };
async function calLoad(){
  const pans = (await allPans()).sort((a, b) => a.date < b.date ? -1 : 1), last = {}, latest = pans.length ? pans[pans.length - 1].date : S.today;
  for (const p of pans) for (const it of p.items) last[it.id] = { it, seen:p.date };
  CAL.items = Object.values(last).filter(x => x.it.due && (x.it.done || x.seen === latest)).map(x => x.it);
  CAL.byDate = {};
  for (const it of CAL.items) (CAL.byDate[it.due] = CAL.byDate[it.due] || []).push(it);
  for (const d in CAL.byDate) CAL.byDate[d].sort((a, b) => (a.time || '99') < (b.time || '99') ? -1 : 1);
}
function monthCells(y, m){
  const first = new Date(y, m, 1), start = first.getDay(), days = new Date(y, m + 1, 0).getDate(), cells = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(ymd(new Date(y, m, d)));
  while (cells.length % 7) cells.push(null);
  return cells;
}
/* 쪽 열기·닫기 */
let calPreloaded = false;
async function calPageOpen(){
  const pg = $('calPage');
  if (CAL.year === null || CAL.month === null){ const t = parseYmd(S.today); CAL.year = t.getFullYear(); CAL.month = t.getMonth(); }
  if (!calPreloaded){ calPreloaded = true; [...new Set(Object.values(CAL_VN).concat('vn-memo'))].forEach(n => { const i = new Image(); i.src = `art/${n}.webp`; }); }
  await calLoad(); calMonth(CAL.month, true);
  if (!CAL.on){
    CAL.on = true; dlog('화면', '달력 쪽 열기');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    pg.hidden = false; pg.classList.remove('out', 'in'); void pg.offsetWidth; pg.classList.add('in');
    document.body.classList.add('cal-on');
  }
  await loadChat(); renderCalTalk();
}
const calOpen = calPageOpen;   /* 옛 이름 */
function calPageClose(){
  if (!CAL.on) return;
  CAL.on = false; dlog('화면', '달력 쪽 닫기'); calDay(null);
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  const pg = $('calPage'); pg.classList.remove('in'); pg.classList.add('out'); document.body.classList.remove('cal-on');
  setTimeout(() => { if (!CAL.on){ pg.hidden = true; pg.classList.remove('out'); } }, 340);
}
function calYear(){}   /* 연간은 나중에 — 옛 부름이 남아 있어 빈 함수로 둔다 */
/* 칠판 한 달 */
function calMonth(m, quiet, dir){
  let y = CAL.year;
  if (m < 0){ y--; m = 11; } else if (m > 11){ y++; m = 0; }
  CAL.year = y; CAL.month = m;
  $('cpTitle').innerHTML = `<small>${y}</small>${m + 1}월`;
  $('cpToday').textContent = +S.today.slice(8);
  const n = Object.keys(CAL.byDate).filter(d => d.startsWith(`${y}-${pad(m + 1)}`)).reduce((s, d) => s + CAL.byDate[d].length, 0);
  const chip = it => `<span class="cb-it${it.done ? ' done' : ''}${CAL.fresh === it.id ? ' fresh' : ''}" data-id="${esc(it.id)}" style="--c:${secColor(it.sec)}">${it.time ? `<i>${esc(it.time)}</i>` : ''}${esc(it.text)}</span>`;
  const sh = $('calSheet');
  sh.innerHTML = `<div class="cb-wd">${[...WD].map((w, i) => `<span class="${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${w}</span>`).join('')}</div>
    <div class="cb-grid">${monthCells(y, m).map((d, i) => {
      if (!d) return '<div class="cb-c off"></div>';
      const list = CAL.byDate[d] || [], wd = i % 7;
      return `<div class="cb-c${d === S.today ? ' today' : ''}${d === CAL.day ? ' sel' : ''}${wd === 0 ? ' sun' : wd === 6 ? ' sat' : ''}" data-cal="d" data-d="${d}"><span class="n">${+d.slice(8)}</span>${
        list.slice(0, 3).map(chip).join('')}${list.length > 3 ? `<span class="more">+${list.length - 3}</span>` : ''}</div>`; }).join('')}</div>
    <p class="cb-foot">${n ? `이달 일정 ${n}개` : '이달 일정 없음'} · 날짜를 누르면 쪽지</p>`;
  if (dir){ sh.classList.remove('wipeL', 'wipeR'); void sh.offsetWidth; sh.classList.add(dir < 0 ? 'wipeL' : 'wipeR'); }
  if (CAL.day && !CAL.day.startsWith(`${y}-${pad(m + 1)}`)) calDay(null);
}
const calGo = (delta) => { calMonth(CAL.month + delta, true, delta); };
/* 그날 쪽지 — 칠판에 붙는 포스트잇 */
function calDay(d){
  CAL.day = d; const el = $('calDay');
  document.querySelectorAll('#calSheet .cb-c.sel').forEach(c => c.classList.remove('sel'));
  if (!d){ el.classList.remove('on'); return; }
  const c = document.querySelector(`#calSheet [data-d="${d}"]`); if (c) c.classList.add('sel');
  const x = parseYmd(d), list = CAL.byDate[d] || [];
  el.innerHTML = `<div class="cn-head"><b>${x.getMonth() + 1}월 ${x.getDate()}일 (${WD[x.getDay()]})</b>${d === S.today ? '<span class="tg">오늘</span>' : ''}<button data-cal="dclose" aria-label="쪽지 떼기">✕</button></div>
    <div class="cn-list">${list.length ? list.map(it => `<div class="cn-it${it.done ? ' done' : ''}" style="--c:${secColor(it.sec)}"><span class="t">${esc(it.time || '시간 미정')}</span><span class="x">${esc(it.text)}</span><span class="s">${esc(secName(it.sec))}${it.tag ? ' · ' + esc(it.tag) : ''}</span></div>`).join('') : '<p class="cn-empty">아직 없어요</p>'}</div>
    <div class="cn-add"><input id="calAdd" placeholder="+ 이 날 일정 (예: 15:00 미팅)" enterkeyhint="done"><button data-cal="add">넣기</button></div>`;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
}
async function calAddItem(){
  const v = $('calAdd').value.trim(); if (!v || !CAL.day) return;
  const m = v.match(/^(\d{1,2}):(\d{2})\s+(.+)$/) || v.match(/^(\d{1,2})시(?:\s*(\d{1,2})분)?\s+(.+)$/);
  const time = m ? pad(+m[1]) + ':' + pad(+(m[2] || 0)) : null, text = m ? m[3] : v;
  CAL.quiet = true; const r = await runTool({ name:'add_item', args:{ section:secById('sched') ? 'sched' : secs()[0].id, text, due:CAL.day, ...(time ? { time } : {}) } }); CAL.quiet = false;
  saveLog(); await calLoad(); CAL.fresh = (r && r.item && r.item.id) || null; calMonth(CAL.month, true); CAL.fresh = null; calDay(CAL.day); toast('칠판에 붙였어요 — 판에도 적혔어요');
}
/* 칸 반짝(세희가 고친 날) — office.js 끝 처리도 #calSheet [data-d] 로 부른다 */
function calFlash(d){ const c = document.querySelector(`#calSheet [data-d="${d}"]`); if (c){ c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); } return c; }
async function calShowDate(d){
  const x = parseYmd(d); if (!CAL.on) await calPageOpen();
  const dir = (x.getFullYear() - CAL.year) * 12 + x.getMonth() - CAL.month;
  CAL.year = x.getFullYear(); await calLoad(); calMonth(x.getMonth(), true, dir ? Math.sign(dir) : 0);
  return calFlash(d);
}
/* 대사창 — 사무실 대화와 같은 말(talkHtml), 얼굴은 서 있는 그림으로 */
function renderCalTalk(){
  if (!CAL.on || !O.loaded) return;
  const t = talkHtml('칠판에 이달 일정을 붙여 뒀어요. "20일 3시 회의 넣어줘"처럼 말하면 바로 적을게요.');
  const bub = $('cpBub'); if (bub.innerHTML !== t.h){ bub.innerHTML = t.h; bub.scrollTop = bub.scrollHeight; }
  const src = `art/${CAL.writing ? 'vn-memo' : (CAL_VN[t.face] || CAL_VN[0])}.webp`, im = $('cpSpr');
  if (im.getAttribute('src') !== src){ im.setAttribute('src', src); im.classList.remove('pop'); void im.offsetWidth; im.classList.add('pop'); }
  cpGrow();
}
/* 세희가 일하는 모습(js/work.js 가 부른다) — 날짜 있는 일만 */
const calItemOf = c => { const a = c.args || {}; if (c.name === 'add_item') return a.due ? { due:a.due } : null;
  if (['update_item', 'complete_item', 'delete_item'].includes(c.name)){ const it = typeof findItem === 'function' ? findItem(String(a.id || '').replace(/^#/, '')) : null; const due = a.due || (it && it.due); return due ? { due, id:it && it.id } : null; }
  return null; };
async function calWorkBefore(c){
  const x = calItemOf(c); if (!x) return false;
  CAL.writing = true; await calShowDate(x.due); renderCalTalk();
  if (x.id){ const ch = document.querySelector(`#calSheet .cb-it[data-id="${x.id}"]`); if (ch) hl(ch); }
  await wsleep(wpace() * 0.6);
  return true;
}
async function calWorkAfter(c, r){
  const x = calItemOf(c) || (c.args && c.args.due ? { due:c.args.due } : null); if (!x){ CAL.writing = false; return; }
  const id = (r && ((r.item && r.item.id) || r.id)) || (c.args || {}).id;
  await calLoad(); CAL.fresh = String(id || '').replace(/^#/, '');
  const xd = parseYmd(x.due); CAL.year = xd.getFullYear(); calMonth(xd.getMonth(), true); CAL.fresh = null; calFlash(x.due);
  await wsleep(Math.max(900, wpace() * 1.3));
  CAL.writing = false; renderCalTalk();
}
/* 입력칸 — 사무실과 같은 대화로 보낸다 */
const cpGrow = () => { const t = $('cpText'); if (t.offsetParent){ t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 92) + 'px'; } $('cpGo').disabled = !t.value.trim() || O.busy; };
$('cpText').addEventListener('input', cpGrow);
$('cpText').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); if ($('cpText').value.trim()) sendSay($('cpText')); } });
$('cpText').addEventListener('focus', () => $('calPage').classList.add('typing'));
$('cpText').addEventListener('blur', () => $('calPage').classList.remove('typing'));
$('cpGo').addEventListener('pointerdown', e => e.preventDefault());
$('cpGo').onclick = () => { if ($('cpText').value.trim()) sendSay($('cpText')); };
$('cpBub').addEventListener('click', e => { msgToolClick(e); });
$('cpX').onclick = calPageClose;
document.addEventListener('keydown', e => { if (e.key === 'Escape' && CAL.on && !document.querySelector('.vn')) calPageClose(); });
$('cal').addEventListener('click', e => {
  const b = e.target.closest('[data-cal]'); if (!b) return;
  const a = b.dataset.cal;
  if (a === 'pm' || a === 'nm') calGo(a === 'pm' ? -1 : 1);
  else if (a === 'today'){ const t = parseYmd(S.today), dir = (t.getFullYear() - CAL.year) * 12 + t.getMonth() - CAL.month; CAL.year = t.getFullYear(); calMonth(t.getMonth(), true, Math.sign(dir)); calFlash(S.today); }
  else if (a === 'd'){ if (Date.now() - CAL.swiped < 400) return; calDay(CAL.day === b.dataset.d ? null : b.dataset.d); }
  else if (a === 'dclose') calDay(null);
  else if (a === 'add') calAddItem();
});
$('cal').addEventListener('keydown', e => { if (e.target.id === 'calAdd' && e.key === 'Enter' && !e.isComposing){ e.preventDefault(); calAddItem(); } });
/* 칠판을 옆으로 밀면 앞뒤 달 */
(function boardSwipe(){
  const sh = $('calSheet'); let g = null;
  sh.addEventListener('pointerdown', e => { g = { x:e.clientX, y:e.clientY }; });
  sh.addEventListener('pointerup', e => {
    if (!g) return; const dx = e.clientX - g.x, dy = e.clientY - g.y; g = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4){ CAL.swiped = Date.now(); calGo(dx < 0 ? 1 : -1); }
  });
  sh.addEventListener('pointercancel', () => { g = null; });
})();
/* 세희 끝 처리를 못 받은 경우(판 화면에서 쪽을 연 채 작업 중계를 끈 때) — 쪽이 열려 있으면 그 날로 */
setInterval(() => { if (CAL.on && CAL.changed && !O.busy){ const d = CAL.changed; CAL.changed = null; calShowDate(d); } if (CAL.on && O.busy) renderCalTalk(); }, 600);
