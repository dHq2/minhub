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
  if (!CAL.on) CAL.zoom = CAL_ZTODAY;   /* 11-15 B: 열 때는 늘 오늘 쪽을 확대해서 */
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
  CAL.on = false; dlog('화면', '달력 쪽 닫기'); calDay(null); inkSet(null);
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
  /* 11-15 B: 가로 보드에 매직으로 쓴 글 — 칸 색 대신 마커 색(오늘 할 일 빨강·일정 파랑·개인 초록·그 밖 검정), 손으로 쓴 듯 살짝 기울임. 글은 다 적음(자르기·+N 없음) */
  const chip = it => `<span class="cb-it${it.done ? ' done' : ''}${CAL.fresh === it.id ? ' fresh' : ''}" data-id="${esc(it.id)}" style="--c:${secColor(it.sec)};--mk:${calMarker(it.sec)};--rot:${calTilt(it.id)}deg">${it.time ? `<i>${esc(it.time)}</i>` : ''}${esc(it.text)}</span>`;
  const sh = $('calSheet');
  sh.innerHTML = `<div class="cb-wd">${[...WD].map((w, i) => `<span class="${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${w}</span>`).join('')}</div>
    <div class="cb-grid">${monthCells(y, m).map((d, i) => {
      if (!d) return '<div class="cb-c off"></div>';
      const list = CAL.byDate[d] || [], wd = i % 7;
      return `<div class="cb-c${d === S.today ? ' today' : ''}${d === CAL.day ? ' sel' : ''}${wd === 0 ? ' sun' : wd === 6 ? ' sat' : ''}" data-cal="d" data-d="${d}"><span class="n">${+d.slice(8)}</span>${
        list.map(chip).join('')}</div>`; }).join('')}</div>
    <p class="cb-foot">${n ? `이달 일정 ${n}개` : '이달 일정 없음'} · 확대·축소 · 밀기 · 날짜 누르면 쪽지</p>`;
  calWide(dir);
  if (dir){ sh.classList.remove('wipeL', 'wipeR'); void sh.offsetWidth; sh.classList.add(dir < 0 ? 'wipeL' : 'wipeR'); }
  if (CAL.day && !CAL.day.startsWith(`${y}-${pad(m + 1)}`)) calDay(null);
}
const calGo = (delta) => { calMonth(CAL.month + delta, true, delta); };
/* ── 11-15 B: 가로 보드 — 벽에 거는 가로형 월간 화이트보드처럼 칸을 넉넉히(폰 한 화면에 3~4일), 손가락으로 옆으로 밀어 본다.
   글은 줄이지도 자르지도 않음 — 한 칸에 많으면 그 주만 길어지고 보드를 위아래로도 굴린다. 열면 오늘(그 달이 아니면 1일)이 가운데. ── */
const CAL_COL = 124;   /* 한 칸 폭(px) — 매직 글씨 한 줄에 예닐곱 자 */
const calMarker = sec => ({ today:'#c62828', sched:'#1f3c88', me:'#2e7d32' })[sec] || '#222';
const calTilt = id => { let h = 0; for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) | 0; return ((Math.abs(h) % 7) - 3) * 0.35; };
let calFontReady = false;
function calWide(dir){
  if (!calFontReady){ calFontReady = true; if (!document.querySelector('link[data-cal-font]')){ const l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.calFont = '1'; l.href = 'https://fonts.googleapis.com/css2?family=Gaegu:wght@700&display=swap'; document.head.appendChild(l); } }
  const sh = $('calSheet'); if (!sh) return;
  const fit = () => { const w = sh.clientWidth; if (!w) return; calZoomApply();
    if (dir === undefined || dir === 0 || !CAL.wideAt) calCenter(); else { sh.scrollLeft = dir > 0 ? 0 : sh.scrollWidth; sh.scrollTop = 0; } CAL.wideAt = Date.now(); };
  fit(); requestAnimationFrame(fit);
  if (document.fonts && !document.fonts.check('700 16px Gaegu')) document.fonts.load('700 16px Gaegu').then(() => { if (CAL.on) calPack(); }).catch(() => {});
}
/* ── 11-15 B: 확대·축소 — 컴퓨터는 휠(커서 자리 기준), 폰은 두 손가락 벌리기·오므리기. 제일 줄이면 한 달 전체가 한 화면.
   CSS zoom 으로 요일 줄·칸·포스트잇·낙서가 같이 커지고 작아짐. 줄일 땐 칸이 세로로 화면을 채워(배율만큼 칸이 길어짐) 포스트잇이 줄어듦.
   열 때·'오늘'을 누를 때는 오늘 쪽 확대(CAL_ZTODAY)로 돌아감 ── */
const CAL_ZTODAY = 1;   /* 오늘 쪽 확대 — 폰 한 화면에 사흘쯤 */
CAL.zoom = CAL_ZTODAY;
/* 오늘(그 달이 아니면 1일) 칸을 보드 가운데로 */
function calCenter(){ const sh = $('calSheet'), t = sh.querySelector('.cb-c.today') || sh.querySelector('.cb-c[data-d$="-01"]'); if (!t) return;
  const sr = sh.getBoundingClientRect(), r = t.getBoundingClientRect();
  sh.scrollLeft = Math.max(0, r.left - sr.left + sh.scrollLeft + r.width / 2 - sr.width / 2); sh.scrollTop = Math.max(0, r.top - sr.top + sh.scrollTop + r.height / 2 - sr.height / 2); }
const calZMin = () => { const sh = $('calSheet'); return Math.min(1, (sh.clientWidth - 2) / (CAL_COL * 7)); };
const calZMax = 4;   /* 한 줄로 줄인 글씨도 확대하면 읽히게 */
function calZoomApply(){
  const sh = $('calSheet'); const w = sh.clientWidth; if (!w) return;
  const zmin = Math.max(.2, (w - 2) / (CAL_COL * 7)), z = Math.max(zmin, Math.min(calZMax, CAL.zoom));
  sh.style.setProperty('--cbw', (CAL_COL * 7) + 'px'); sh.style.setProperty('--cz', z);
  sh.classList.toggle('wide', CAL_COL * 7 * z > w + 2); sh.classList.toggle('zmin', z <= zmin + .001);
  const rows = Math.ceil(sh.querySelectorAll('.cb-grid > .cb-c').length / 7) || 5, wd = sh.querySelector('.cb-wd'), ft = sh.querySelector('.cb-foot');
  const avail = sh.clientHeight - (wd ? wd.getBoundingClientRect().height : 20) - (ft ? ft.getBoundingClientRect().height : 0) - 4;
  sh.style.setProperty('--rowh', Math.max(70, Math.floor(avail / rows / Math.min(z, 1))) + 'px');
  calPack();
}
function calZoomTo(z, cx, cy){   /* cx·cy = 화면 좌표(그 자리를 고정) */
  const sh = $('calSheet'), g = sh.querySelector('.cb-grid'); if (!g) return;
  const sr = sh.getBoundingClientRect(), gr = g.getBoundingClientRect();
  if (cx === undefined){ cx = sr.left + sr.width / 2; cy = sr.top + sr.height / 2; }
  const fx = (cx - gr.left) / gr.width, fy = (cy - gr.top) / gr.height;
  CAL.zoom = Math.max(calZMin(), Math.min(calZMax, z));
  calZoomApply();
  const g2 = sh.querySelector('.cb-grid').getBoundingClientRect();
  sh.scrollLeft += (g2.left + fx * g2.width) - cx; sh.scrollTop += (g2.top + fy * g2.height) - cy;
}
window.addEventListener('resize', () => { if (CAL.on) calWide(); });
/* 11-15 B: 컴퓨터 — 휠 = 확대·축소(커서 자리), Shift+휠·트랙패드 옆밀기 = 옆으로. 휠 누르고 끌기(가운데 버튼) = 손바닥, 왼쪽 끌기도 손바닥(마커를 들었을 땐 그림) */
(function wideMouse(){
  const sh = $('calSheet'); let g = null;
  const can = () => sh.scrollWidth > sh.clientWidth + 2 || sh.scrollHeight > sh.clientHeight + 2;
  sh.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault();
    if ((e.button === 0 && INK.tool) || (e.button !== 0 && e.button !== 1) || !can() || e.target.closest('input,button')) return;
    g = { x:e.clientX, y:e.clientY, l:sh.scrollLeft, t:sh.scrollTop, moved:false, mid:e.button === 1 }; if (g.mid) sh.classList.add('grab'); });
  sh.addEventListener('auxclick', e => { if (e.button === 1) e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (!g) return; const dx = e.clientX - g.x, dy = e.clientY - g.y; if (!g.moved && Math.hypot(dx, dy) < 5) return; g.moved = true; sh.classList.add('grab'); sh.scrollLeft = g.l - dx; sh.scrollTop = g.t - dy; });
  window.addEventListener('mouseup', () => { if (!g) return; if (g.moved) CAL.swiped = Date.now(); g = null; sh.classList.remove('grab'); });
  let acc = 0, raf = 0, last = null;
  sh.addEventListener('wheel', e => {
    if (e.shiftKey || (!e.ctrlKey && Math.abs(e.deltaX) > Math.abs(e.deltaY))){ if (e.shiftKey && !e.deltaX){ e.preventDefault(); sh.scrollLeft += e.deltaY; } return; }
    e.preventDefault(); acc += e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY; last = e;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; const k = Math.exp(-acc * (last.ctrlKey ? .01 : .0013)); acc = 0; calZoomTo(CAL.zoom * k, last.clientX, last.clientY); });
  }, { passive:false });
})();
/* 11-15 B: 폰 — 두 손가락으로 벌리면 확대, 오므리면 축소(한 손가락은 그대로 밀기) */
(function pinch(){
  const sh = $('calSheet'); let p = null;
  const mid = t => [(t[0].clientX + t[1].clientX) / 2, (t[0].clientY + t[1].clientY) / 2], dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  sh.addEventListener('touchstart', e => { if (e.touches.length > 1) CAL.pinchAt = Date.now(); if (e.touches.length === 2 && !INK.tool){ p = { d:dist(e.touches), z:CAL.zoom }; CAL.swiped = Date.now(); } }, { passive:true });
  sh.addEventListener('touchmove', e => { if (!p || e.touches.length !== 2) return; if (e.cancelable) e.preventDefault(); const [x, y] = mid(e.touches); calZoomTo(p.z * dist(e.touches) / p.d, x, y); CAL.swiped = CAL.pinchAt = Date.now(); }, { passive:false });
  sh.addEventListener('touchend', e => { if (p || e.touches.length) CAL.pinchAt = CAL.swiped = Date.now(); if (p && e.touches.length < 2) p = null; });
})();
/* 11-15 B: 칸은 모두 같은 높이(그어 둔 칸). 일정은 한 줄씩 대충 적고, 칸에 다 안 들어가면 그 칸 글씨를 통째로 줄인다(자르지 않음) —
   자세히는 확대해서 본다. 열 때는 오늘 쪽이 확대돼 있음. (포스트잇 방식은 보스 말로 뺌) */
function calPack(){
  const sh = $('calSheet'); if (!sh) return;
  sh.querySelectorAll('.cb-grid > .cb-c[data-d]').forEach(c => {
    const its = [...c.querySelectorAll(':scope > .cb-it')]; c.style.removeProperty('--fs'); if (!its.length) return;
    const cs = getComputedStyle(c), n = c.querySelector(':scope > .n');
    const aw = c.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 2;
    const ah = c.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (n ? n.offsetHeight : 0) - 2;
    const gap = parseFloat(cs.rowGap) || 0, w = Math.max(...its.map(it => it.scrollWidth)), h = its.reduce((a, it) => a + it.offsetHeight, 0) + gap * its.length;
    const k = Math.min(1, aw / w, ah / h); if (k < 1) c.style.setProperty('--fs', Math.max(.05, k * .98).toFixed(3));
  });
  calInk();
}
/* ── 11-15 B: 칠판 낙서 — 받침대의 마커(빨강·파랑·검정)를 들면 손가락·마우스로 칠판에 그리고, 지우개로 문질러 지운다.
   다시 누르면 내려놓기(그때부터 다시 밀어 보기). 지우개 두 번 톡 = 이달 낙서 싹 지우기(되돌리기 있음). 일정 글씨는 안 지워짐.
   낙서는 포스트잇 밑, 일정 글씨 위. 달마다 이 기기에만(sehee.calInk) — 칸 비율로 저장해 화면 크기가 바뀌어도 제자리 ── */
const INK = { tool:null, key:'', strokes:[], cur:null, erTap:0 };
const INK_COL = { r:'#c62828', b:'#1f3c88', k:'#222' }, INK_NAME = { r:'빨강', b:'파랑', k:'검정' };
const inkKey = () => `${CAL.year}-${pad(CAL.month + 1)}`;
function inkAll(){ try { return JSON.parse(localStorage.getItem('sehee.calInk') || '{}') || {}; } catch { return {}; } }
function inkPut(k, strokes){
  const all = inkAll(); if (strokes.length) all[k] = strokes; else delete all[k];
  let txt = JSON.stringify(all); while (txt.length > 400000 && all[k] && all[k].length){ all[k].shift(); txt = JSON.stringify(all); }   /* 너무 많으면 오래된 획부터 */
  try { localStorage.setItem('sehee.calInk', txt); } catch {}
}
function inkLine(x, s, W, H){
  x.globalCompositeOperation = s.e ? 'destination-out' : 'source-over';
  x.strokeStyle = s.e ? '#000' : (INK_COL[s.c] || '#222'); x.shadowColor = x.strokeStyle; x.shadowBlur = s.e ? 0 : .8;
  x.lineWidth = s.w * W; x.lineCap = x.lineJoin = 'round';
  const p = s.p; x.beginPath(); x.moveTo(p[0] * W, p[1] * H);
  if (p.length === 2) x.lineTo(p[0] * W + .01, p[1] * H); for (let i = 2; i < p.length; i += 2) x.lineTo(p[i] * W, p[i + 1] * H);
  x.stroke();
}
function inkDraw(cv){ const x = cv.getContext('2d'), r = cv.getBoundingClientRect(), W = r.width, H = r.height, dpr = cv.width / (W || 1);
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); x.setTransform(dpr, 0, 0, dpr, 0, 0);
  INK.strokes.forEach(s => inkLine(x, s, W, H)); x.globalCompositeOperation = 'source-over'; }
function calInk(){   /* 캔버스는 .cb-grid 안(같이 확대·축소) — 픽셀은 화면에 보이는 크기 기준 */
  const sh = $('calSheet'), g = sh && sh.querySelector('.cb-grid'); if (!g) return;
  let cv = g.querySelector(':scope > .cb-ink'); if (!cv){ cv = document.createElement('canvas'); cv.className = 'cb-ink'; g.appendChild(cv); inkBind(cv); }
  const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  const pw = Math.max(1, Math.round(r.width * dpr)), ph = Math.max(1, Math.round(r.height * dpr)); if (cv.width !== pw || cv.height !== ph){ cv.width = pw; cv.height = ph; }
  const k = inkKey(); if (INK.key !== k){ INK.key = k; INK.strokes = inkAll()[k] || []; INK.cur = null; }
  inkDraw(cv);
}
function inkBind(cv){
  const at = e => { const r = cv.getBoundingClientRect(); return [+((e.clientX - r.left) / r.width).toFixed(4), +((e.clientY - r.top) / r.height).toFixed(4)]; };
  const seg = (s, a, b) => { const x = cv.getContext('2d'), r = cv.getBoundingClientRect(), W = r.width, H = r.height, dpr = cv.width / (W || 1); x.setTransform(dpr, 0, 0, dpr, 0, 0); inkLine(x, { ...s, p:[...a, ...b] }, W, H); x.globalCompositeOperation = 'source-over'; };
  cv.addEventListener('pointerdown', e => { if (!INK.tool || (e.button && e.button !== 0)) return; e.preventDefault(); e.stopPropagation(); try { cv.setPointerCapture(e.pointerId); } catch {}
    const er = INK.tool === 'er', p = at(e), W = cv.getBoundingClientRect().width || 1;
    INK.cur = er ? { e:1, w:+(26 / W).toFixed(5), p } : { c:INK.tool, w:+(3.4 / W).toFixed(5), p }; seg(INK.cur, p, p); });
  cv.addEventListener('pointermove', e => { const s = INK.cur; if (!s) return; e.preventDefault(); const q = at(e), n = s.p.length, r = cv.getBoundingClientRect(), W = r.width, H = r.height;
    if (Math.hypot((q[0] - s.p[n - 2]) * W, (q[1] - s.p[n - 1]) * H) < 1.5) return; seg(s, [s.p[n - 2], s.p[n - 1]], q); s.p.push(q[0], q[1]); });
  const end = e => { if (!INK.cur) return; e.stopPropagation(); INK.strokes.push(INK.cur); INK.cur = null; inkPut(INK.key, INK.strokes); };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
}
function inkSet(t){
  INK.tool = t || null; const sh = $('calSheet');
  sh.classList.toggle('pen', !!INK.tool); sh.classList.toggle('erase', INK.tool === 'er');
  document.querySelectorAll('#cal .cp-tray [data-t]').forEach(i => i.classList.toggle('on', i.dataset.t === INK.tool));
}
function calInkTool(t){
  const now = Date.now();
  if (t === 'er' && now - INK.erTap < 380){ INK.erTap = 0; inkSet('er'); inkWipe(); return; }   /* 지우개 두 번 톡 */
  INK.erTap = t === 'er' ? now : 0;
  if (INK.tool === t){ inkSet(null); toast('내려놨어요 — 다시 밀어서 볼 수 있어요'); return; }
  inkSet(t); toast(t === 'er' ? '지우개 — 문질러 지워요 · 두 번 톡 치면 싹 지우기' : `${INK_NAME[t]} 마커를 들었어요 — 칠판에 그려 보세요 · 다시 누르면 내려놓기`);
}
/* 받침대 — 마커가 작고 바로 위에 안내 줄이 있어 손가락이 빗나가기 쉬움: 받침대 둘레를 넉넉히 누르면 가장 가까운 마커·지우개를 집는다 */
(function trayPick(){
  const cal = $('cal'), tray = cal.querySelector('.cp-tray'); let hit = null, at = 0;
  const near = e => { const r = tray.getBoundingClientRect(); if (e.clientY < r.top - 24 || e.clientY > r.bottom + 18 || e.clientX < r.left - 12 || e.clientX > r.right + 12) return null;
    let best = null, bd = 14; tray.querySelectorAll('[data-t]').forEach(i => { const q = i.getBoundingClientRect(), d = Math.abs(e.clientX - (q.left + q.width / 2)) - q.width / 2; if (d < bd){ bd = d; best = i.dataset.t; } }); return best; };
  cal.addEventListener('pointerdown', e => { const t = near(e); if (!t) return; hit = { t, x:e.clientX, y:e.clientY }; e.preventDefault(); e.stopPropagation(); }, true);
  cal.addEventListener('pointerup', e => { if (!hit) return; const h = hit; hit = null; e.stopPropagation(); if (Math.hypot(e.clientX - h.x, e.clientY - h.y) < 14){ at = Date.now(); calInkTool(h.t); } }, true);
  cal.addEventListener('pointercancel', () => { hit = null; }, true);
  cal.addEventListener('click', e => { if (Date.now() - at < 600){ e.preventDefault(); e.stopPropagation(); } }, true);
})();
function inkWipe(){
  const k = INK.key, old = INK.strokes; if (!old.length){ toast('지울 낙서가 없어요'); return; }
  INK.strokes = []; inkPut(k, []); calInk();
  toast('이달 낙서를 싹 지웠어요', () => { if (INK.key === k){ INK.strokes = old; calInk(); } inkPut(k, old); });
}
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
  else if (a === 'today'){ const t = parseYmd(S.today), dir = (t.getFullYear() - CAL.year) * 12 + t.getMonth() - CAL.month; CAL.year = t.getFullYear(); CAL.zoom = CAL_ZTODAY; calMonth(t.getMonth(), true, Math.sign(dir)); calCenter(); calFlash(S.today); }
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
    if (Date.now() - (CAL.pinchAt || 0) < 600) return;   /* 11-15 B: 두 손가락 확대·축소 중엔 달 안 넘김 */
    if (sh.classList.contains('wide')){ if (Math.abs(dx) > 8) CAL.swiped = Date.now(); return; }   /* 11-15 B: 가로 보드는 옆으로 밀면 보드가 움직임(달은 ‹ ›) */
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4){ CAL.swiped = Date.now(); calGo(dx < 0 ? 1 : -1); }
  });
  sh.addEventListener('pointercancel', () => { g = null; });
})();
/* 세희 끝 처리를 못 받은 경우(판 화면에서 쪽을 연 채 작업 중계를 끈 때) — 쪽이 열려 있으면 그 날로 */
setInterval(() => { if (CAL.on && CAL.changed && !O.busy){ const d = CAL.changed; CAL.changed = null; calShowDate(d); } if (CAL.on && O.busy) renderCalTalk(); }, 600);
