/* martin/js/size.js — 고른 카드 크기 손잡이 (11-16 C). 고칠 땐 이 줄 아래에 「11-16 C: …」처럼 날짜·방 주석
   고른 카드(금빛 테두리, view.js 의 SELC)에 손잡이 셋:
     오른쪽 변 = 가로 늘이기·줄이기(n.cw) · 아래 변 = 세로 늘이기·줄이기(n.ch) · 왼쪽 아래 모서리 = 통째 확대·축소(n.sc)
   늘이는 동안 카드 위쪽은 제자리(핀·실이 덜 흔들림), 확대·축소는 오른쪽 위 모서리를 붙잡고 커진다. 손잡이를 두 번 누르면 그 크기만 원래대로.
   카드에 붙는 법: board.js cardHtml 의 style 끝에 sizeStyle(n). measure() 가 sc 까지 친 보이는 크기를 n.w·n.h 에 넣는다 — 실·판 정리(tidy)가 그대로 따라감.
   저장은 손을 뗄 때 한 번(save → 되돌리기 한 칸). */
const SZ = { w:[70, 460], h:[40, 640], s:[.5, 2.6] };
const clampTo = (v, [a, b]) => Math.max(a, Math.min(b, v));
function sizeStyle(n){
  let s = '';
  if (n.cw || n.ch) s += ';box-sizing:border-box';
  if (n.cw) s += `;width:${n.cw}px;--cw:${n.cw}px`;
  if (n.ch) s += `;min-height:${n.ch}px;--ch:${n.ch}px`;
  if (n.sc && n.sc !== 1) s += `;--s:${n.sc}`;
  return s;
}
/* 고른 카드에만 손잡이 — 판이 다시 그려져도 붙어 있게 */
const SZ_LABEL = { r:'가로 늘이기', b:'세로 늘이기', c:'확대·축소' };
function szHandles(){
  const el = SELC && cardElOf(SELC);
  document.querySelectorAll('#nodes .szh').forEach(h => { if (!el || h.parentNode !== el) h.remove(); });
  if (!el || el.querySelector('.szh')) return;
  el.insertAdjacentHTML('beforeend', ['r', 'b', 'c'].map(k => `<button type="button" class="szh szh-${k}" data-sz="${k}" aria-label="${SZ_LABEL[k]}" title="${SZ_LABEL[k]} — 두 번 누르면 원래대로"></button>`).join(''));
  szZoom(true);
}
new MutationObserver(szHandles).observe($('#nodes'), { childList:true, subtree:true, attributes:true, attributeFilter:['class'] });
/* 손잡이는 판을 멀리서 봐도 손가락 크기 그대로 — 판 배율·카드 배율을 거꾸로 곱한다 */
let szK = 0;
function szZoom(force){
  const el = SELC && cardElOf(SELC); if (!el) return;
  const n = nodeOf(SELC), v = 1 / (cam.k * (n && +n.sc || 1));
  if (force || Math.abs(v - szK) > .001 || el.style.getPropertyValue('--hk') === ''){ szK = v; el.style.setProperty('--hk', v.toFixed(3)); }
}
(function szLoop(){ if (SELC) szZoom(); requestAnimationFrame(szLoop); })();

const wpt = (x, y) => { const r = board.getBoundingClientRect(); return { x:cam.x + (x - r.left - r.width / 2) / cam.k, y:cam.y + (y - r.top - r.height / 2) / cam.k }; };
let RS = null;
function szPut(){   /* 지금 n 의 크기·자리를 카드에 바로 — 다시 그리지 않고 */
  const { el, n } = RS;
  for (const k of ['width', 'min-height', 'box-sizing', '--cw', '--ch', '--s']) el.style.removeProperty(k);
  for (const part of sizeStyle(n).split(';').filter(Boolean)){ const i = part.indexOf(':'); el.style.setProperty(part.slice(0, i), part.slice(i + 1)); }
  const s = +n.sc || 1, W = el.offsetWidth * s, H = el.offsetHeight * s;
  if (RS.k === 'c'){ n.x = Math.round(RS.ax - W / 2); n.y = Math.round(RS.ay + H / 2); }   /* 오른쪽 위 모서리 고정 */
  else { n.x = Math.round(RS.left + W / 2); n.y = Math.round(RS.top + H / 2); }   /* 왼쪽 위 모서리 고정 */
  el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; n.w = Math.round(W); n.h = Math.round(H);
  if (!RS.raf) RS.raf = requestAnimationFrame(() => { if (RS) RS.raf = 0; renderStrings(); renderMarks(); });
}
$('#nodes').addEventListener('pointerdown', e => {
  const h = e.target.closest('.szh'); if (!h) return;
  e.preventDefault(); e.stopPropagation(); if (busy) return;
  const el = h.closest('.card'), n = el && nodeOf(el.dataset.id); if (!n) return;
  try{ h.setPointerCapture(e.pointerId); }catch(x){}
  const s0 = +n.sc || 1, W = el.offsetWidth * s0, H = el.offsetHeight * s0, p0 = wpt(e.clientX, e.clientY);
  RS = { k:h.dataset.sz, el, n, pid:e.pointerId, p0, s0, W0:el.offsetWidth, H0:el.offsetHeight, left:n.x - W / 2, top:n.y - H / 2, ax:n.x + W / 2, ay:n.y - H / 2, from:{ cw:n.cw, ch:n.ch, sc:n.sc } };
  RS.d0 = Math.max(20, Math.hypot(p0.x - RS.ax, p0.y - RS.ay));
  el.classList.add('sizing');
});
addEventListener('pointermove', e => {
  if (!RS || e.pointerId !== RS.pid) return;
  const p = wpt(e.clientX, e.clientY), dx = p.x - RS.p0.x, dy = p.y - RS.p0.y, { n, s0 } = RS;
  if (RS.k === 'r') n.cw = Math.round(clampTo((RS.W0 * s0 + dx) / s0, SZ.w));
  else if (RS.k === 'b') n.ch = Math.round(clampTo((RS.H0 * s0 + dy) / s0, SZ.h));
  else n.sc = Math.round(clampTo(s0 * Math.hypot(p.x - RS.ax, p.y - RS.ay) / RS.d0, SZ.s) * 100) / 100;
  szPut();
});
const szEnd = e => {
  if (!RS || e.pointerId !== RS.pid) return;
  const { n, el, k, from } = RS; RS = null; el.classList.remove('sizing');
  if (n.sc === 1) delete n.sc;
  if (from.cw === n.cw && from.ch === n.ch && from.sc === n.sc) return;
  measure(); renderStrings(); renderMarks(); save();
  act('카드 크기', { id:n.id, what:SZ_LABEL[k], cw:n.cw || null, ch:n.ch || null, sc:n.sc || 1 });
};
addEventListener('pointerup', szEnd); addEventListener('pointercancel', szEnd);
/* 두 번 누르면 그 크기만 원래대로 */
$('#nodes').addEventListener('dblclick', e => {
  const h = e.target.closest('.szh'); if (!h || busy) return; e.stopPropagation();
  const el = h.closest('.card'), n = el && nodeOf(el.dataset.id); if (!n) return;
  const key = { r:'cw', b:'ch', c:'sc' }[h.dataset.sz]; if (!(key in n)) return;
  delete n[key]; el.outerHTML = cardHtml(n); measure(); renderStrings(); renderMarks(); save();
  act('카드 크기 원래대로', { id:n.id, what:SZ_LABEL[h.dataset.sz] });
});
