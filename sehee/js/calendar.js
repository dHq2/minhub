/* ── 달력 (v0.9) — 날짜(due)가 있는 판 항목이 저절로 달력에 붙는다 ──
   연간: 열두 달 미니 달력. 오른쪽 서류철 견출지(1~12월)를 누르거나 끌면 그 달 시트가 서류철에서 빠져나온다.
   달 시트: 날마다 일정 칩. 날짜를 누르면 그날 쪽지가 아래에서 올라온다. 시트를 옆으로 밀면 앞뒤 달. */
const CAL = { year:null, month:null, day:null, items:[], byDate:{}, changed:null };
const secColor = id => (secById(id) || secs()[0] || {}).color || '#3a6b64';
async function calLoad(){
  const pans = (await allPans()).sort((a, b) => a.date < b.date ? -1 : 1), last = {}, latest = pans.length ? pans[pans.length - 1].date : S.today;
  for (const p of pans) for (const it of p.items) last[it.id] = { it, seen:p.date };
  CAL.items = Object.values(last).filter(x => x.it.due && (x.it.done || x.seen === latest)).map(x => x.it);
  CAL.byDate = {};
  for (const it of CAL.items) (CAL.byDate[it.due] = CAL.byDate[it.due] || []).push(it);
  for (const d in CAL.byDate) CAL.byDate[d].sort((a, b) => (a.time || '99') < (b.time || '99') ? -1 : 1);
}
async function calOpen(){
  if (CAL.year === null){ const t = parseYmd(S.today); CAL.year = t.getFullYear(); }
  await calLoad(); calYear(); calTabs();
  if (CAL.month !== null) calMonth(CAL.month, true);
}
function monthCells(y, m){
  const first = new Date(y, m, 1), start = first.getDay(), days = new Date(y, m + 1, 0).getDate(), cells = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(ymd(new Date(y, m, d)));
  while (cells.length % 7) cells.push(null);
  return cells;
}
function calYear(){
  const y = CAL.year;
  $('calYear').innerHTML = `<div class="cy-head"><button class="ib" data-cal="py">‹</button><b>${y}년</b><button class="ib" data-cal="ny">›</button><small>${CAL.items.filter(it => it.due.startsWith(y + '-')).length}개 일정</small></div>
    <div class="cy-grid">${[...Array(12)].map((_, m) => `<div class="cy-m" data-cal="m" data-m="${m}"><div class="cy-t">${m + 1}월</div><div class="cy-d">${
      monthCells(y, m).map(d => !d ? '<i></i>' : `<i class="${d === S.today ? 'today' : ''}${CAL.byDate[d] ? ' ev' : ''}" ${CAL.byDate[d] ? `style="--c:${secColor(CAL.byDate[d][0].sec)}"` : ''}>${+d.slice(8)}</i>`).join('')
    }</div></div>`).join('')}</div>`;
}
function calTabs(){
  $('calTabs').innerHTML = [...Array(12)].map((_, m) => `<button data-m="${m}" class="${CAL.month === m ? 'on' : ''}">${m + 1}월</button>`).join('');
}
function calMonth(m, quiet){
  if (m < 0){ CAL.year--; m = 11; calYear(); } else if (m > 11){ CAL.year++; m = 0; calYear(); }
  CAL.month = m; calTabs();
  const y = CAL.year, sh = $('calSheet');
  sh.innerHTML = `<div class="cs-ear">${m + 1}월</div>
    <div class="cs-head"><button class="ib" data-cal="pm">‹</button><b>${y}년 ${m + 1}월</b><button class="ib" data-cal="nm">›</button><button class="ib" data-cal="close" aria-label="연간으로">✕</button></div>
    <div class="cs-wd">${[...WD].map((w, i) => `<span class="${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${w}</span>`).join('')}</div>
    <div class="cs-grid">${monthCells(y, m).map(d => !d ? '<div class="cs-c off"></div>' : `<div class="cs-c${d === S.today ? ' today' : ''}" data-cal="d" data-d="${d}"><span class="n">${+d.slice(8)}</span>${
      (CAL.byDate[d] || []).slice(0, 3).map(it => `<span class="chip${it.done ? ' done' : ''}" style="--c:${secColor(it.sec)}">${it.time ? it.time + ' ' : ''}${esc(it.text)}</span>`).join('')
    }${(CAL.byDate[d] || []).length > 3 ? `<span class="more">+${CAL.byDate[d].length - 3}</span>` : ''}</div>`).join('')}</div>
    <p class="cs-hint">날짜를 누르면 그날 쪽지가 나와요 · 옆으로 밀면 다른 달</p>`;
  if (!quiet || !sh.classList.contains('on')){ sh.classList.remove('on'); void sh.offsetWidth; sh.classList.add('on'); }
  if (CAL.day && !CAL.day.startsWith(`${y}-${pad(m + 1)}`)) calDay(null);
}
function calDay(d){
  CAL.day = d; const el = $('calDay');
  if (!d){ el.classList.remove('on'); return; }
  const x = parseYmd(d), list = CAL.byDate[d] || [];
  el.innerHTML = `<div class="cd-head"><b>${x.getMonth() + 1}월 ${x.getDate()}일 (${WD[x.getDay()]})</b>${d === S.today ? '<span class="tg">오늘</span>' : ''}<button class="ib" data-cal="dclose" aria-label="닫기">✕</button></div>
    <div class="cd-list">${list.length ? list.map(it => `<div class="cd-it${it.done ? ' done' : ''}" style="--c:${secColor(it.sec)}"><span class="t">${it.time || '시간 미정'}</span><span class="x">${esc(it.text)}</span><span class="s">${esc(secName(it.sec))}${it.tag ? ' · ' + esc(it.tag) : ''}</span></div>`).join('') : '<p class="note">이 날은 비어 있어요.</p>'}</div>
    <div class="cd-add"><input id="calAdd" placeholder="+ 이 날 일정 (예: 15:00 학부모 상담)" enterkeyhint="done"><button class="ib" data-cal="add">넣기</button></div>`;
  el.classList.add('on');
}
async function calAddItem(){
  const v = $('calAdd').value.trim(); if (!v || !CAL.day) return;
  const m = v.match(/^(\d{1,2}):(\d{2})\s+(.+)$/) || v.match(/^(\d{1,2})시(?:\s*(\d{1,2})분)?\s+(.+)$/);
  const time = m ? pad(+m[1]) + ':' + pad(+(m[2] || 0)) : null, text = m ? m[3] : v;
  CAL.quiet = true; await runTool({ name:'add_item', args:{ section:secById('sched') ? 'sched' : secs()[0].id, text, due:CAL.day, ...(time ? { time } : {}) } }); CAL.quiet = false;
  saveLog(); await calLoad(); calYear(); calMonth(CAL.month, true); calDay(CAL.day); toast('달력에 넣었어요 — 판에도 적혔어요');
}
$('cal').addEventListener('click', e => {
  const b = e.target.closest('[data-cal]'); if (!b) return;
  const a = b.dataset.cal;
  if (a === 'py' || a === 'ny'){ CAL.year += a === 'py' ? -1 : 1; calYear(); if (CAL.month !== null) calMonth(CAL.month, true); }
  else if (a === 'm') calMonth(+b.dataset.m);
  else if (a === 'pm' || a === 'nm') calMonth(CAL.month + (a === 'pm' ? -1 : 1), true);
  else if (a === 'close'){ CAL.month = null; calDay(null); $('calSheet').classList.remove('on'); calTabs(); }
  else if (a === 'd') calDay(b.dataset.d);
  else if (a === 'dclose') calDay(null);
  else if (a === 'add') calAddItem();
});
$('cal').addEventListener('keydown', e => { if (e.target.id === 'calAdd' && e.key === 'Enter' && !e.isComposing){ e.preventDefault(); calAddItem(); } });
/* 서류철 견출지 — 누르거나 위아래로 끌면 그 달이 빠져나온다 */
(function calScrub(){
  const tabs = $('calTabs'); let on = false;
  const pick = e => { const el = document.elementFromPoint(e.clientX, e.clientY), b = el && el.closest('#calTabs button'); if (b && +b.dataset.m !== CAL.month) calMonth(+b.dataset.m, CAL.month !== null); };
  tabs.addEventListener('pointerdown', e => { on = true; try{ tabs.setPointerCapture(e.pointerId); }catch(x){} pick(e); e.preventDefault(); });
  tabs.addEventListener('pointermove', e => { if (on) pick(e); });
  const stop = () => { on = false; };
  tabs.addEventListener('pointerup', stop); tabs.addEventListener('pointercancel', stop);
})();
/* 달 시트를 옆으로 밀면 앞뒤 달 */
(function sheetSwipe(){
  const sh = $('calSheet'); let g = null;
  sh.addEventListener('pointerdown', e => { if (e.target.closest('button,input')) return; g = { x:e.clientX, y:e.clientY }; });
  sh.addEventListener('pointerup', e => {
    if (!g) return; const dx = e.clientX - g.x, dy = e.clientY - g.y; g = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4){ calMonth(CAL.month + (dx < 0 ? 1 : -1), true); const s = $('calSheet'); s.classList.remove('flipL', 'flipR'); void s.offsetWidth; s.classList.add(dx < 0 ? 'flipR' : 'flipL'); }
  });
  sh.addEventListener('pointercancel', () => { g = null; });
})();
