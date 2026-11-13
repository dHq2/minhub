/* ── 화면 (v0.9.2) — 판 · 사무실. 달력·보드·사람은 사무실 오른쪽 서류철 ──
   사무실 오른쪽 끝에 서류 뭉치처럼 견출지가 튀어나와 있다. 누르면 열리고, 왼쪽으로 끌면 손가락을 따라 실시간으로 빠져나온다.
   열린 서류는 견출지를 다시 누르거나, 머리를 잡고 오른쪽으로 끌면 들어간다. 세희가 그 일을 하면 저절로 열린다. */
const VIEWS = ['pan', 'office'];
const DRAWERS = ['cal', 'board', 'people'];
const TAB_OF = { pan:'tabPan', office:'tabOffice' };
const VIEW_EL = { pan:'main', office:'office' };
const hashView = () => { const h = location.hash.slice(1); return h === 'office' || DRAWERS.includes(h) ? 'office' : 'pan'; };
const curView = () => document.body.classList.contains('office') ? 'office' : 'pan';
function goView(v){
  if (v === 'pan'){ history.replaceState(null, '', location.pathname); showView('pan'); }
  else if (DRAWERS.includes(v)){ if (curView() !== 'office') goView('office'); dwOpen(v); }
  else { if (location.hash !== '#office') history.pushState(null, '', location.pathname + '#office'); showView('office'); }   /* 해시를 직접 바꾸면 컴퓨터 틀에서 #office 칸으로 문서가 굴러가 서랍 머리가 잘림(보조 방 발견) — pushState 로 */
}
function showView(v){
  setTimeout(() => bonusEmit('view', curView()), 0);
  dlog('화면', '보기 → ' + v);
  const want = DRAWERS.includes(location.hash.slice(1)) ? location.hash.slice(1) : null;
  if (!VIEWS.includes(v)) v = 'pan';
  const b = document.body;
  b.classList.toggle('office', v === 'office'); b.classList.toggle('alt', v !== 'pan');
  for (const x of VIEWS) $(TAB_OF[x]).classList.toggle('on', x === v);
  (v === 'pan' ? $('ptSay') : $('office')).appendChild($('say'));
  if (v === 'office') openOffice(); else { b.classList.remove('typing'); render(); loadChat().then(renderPanTalk); }
  if (v === 'office' && want){ history.replaceState(null, '', location.pathname + '#office'); dwOpen(want); }
  const a = SWIPE.anim; SWIPE.anim = '';
  if (a){
    const el = $(VIEW_EL[v]);
    el.classList.remove('slide-inL', 'slide-inR'); void el.offsetWidth; el.classList.add(a);
    el.addEventListener('animationend', () => el.classList.remove(a), { once:true });
  }
}
for (const v of VIEWS) $(TAB_OF[v]).onclick = () => goView(v);
window.addEventListener('hashchange', () => showView(hashView()));
window.addEventListener('popstate', () => showView(hashView()));

/* ── 서류철 ── */
const DW = { open:null };
const dwEl = k => $('dw-' + k);
const dwW = k => dwEl(k).getBoundingClientRect().width || 300;
function dwSet(k, x, anim){   /* x = 0(다 열림) ~ 너비(다 닫힘) */
  const el = dwEl(k), w = dwW(k);
  el.style.transition = anim ? 'transform .32s cubic-bezier(.2,.8,.25,1)' : 'none';
  el.style.transform = `translateX(${Math.max(0, Math.min(w + 40, x))}px)`;
  el.classList.add('moving');
}
async function dwOpen(k, quiet){
  dlog('화면', '서랍 열기 → ' + k + (quiet ? '(조용히)' : ''));
  if (!DRAWERS.includes(k)) return;
  for (const o of DRAWERS) if (o !== k && (DW.open === o || dwEl(o).classList.contains('moving'))) dwClose(o);
  DW.open = k; document.body.classList.add('dw-on');
  dwEl(k).classList.add('open'); dwSet(k, 0, true);
  $('dwTabs').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.dw === k));
  if (!quiet){ if (k === 'cal') await calOpen(); else if (k === 'board') await boardOpen(); else if (k === 'people') await pplOpen(); }
}
function dwClose(k){
  k = k || DW.open; if (!k) return;
  const el = dwEl(k); dwSet(k, dwW(k) + 40, true);
  setTimeout(() => { if (DW.open !== k){ el.classList.remove('open', 'moving'); el.style.transform = ''; } }, 340);
  if (DW.open === k){ DW.open = null; document.body.classList.remove('dw-on'); }
  $('dwTabs').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.dw === DW.open));
}
/* 견출지 — 누르기·왼쪽으로 끌기 */
(function dwDrag(){
  const tabs = $('dwTabs'); let g = null;
  tabs.addEventListener('pointerdown', e => {
    const b = e.target.closest('button[data-dw]'); if (!b) return;
    const k = b.dataset.dw, wasOpen = DW.open === k;
    g = { k, x:e.clientX, t:performance.now(), wasOpen, moved:false, prepared:false };
    try{ tabs.setPointerCapture(e.pointerId); }catch(x){}
    e.preventDefault();
  });
  tabs.addEventListener('pointermove', e => {
    if (!g) return;
    const dx = e.clientX - g.x;
    if (!g.moved && Math.abs(dx) < 6) return;
    g.moved = true;
    if (!g.prepared){
      g.prepared = true;
      for (const o of DRAWERS) if (o !== g.k && DW.open === o) dwClose(o);
      const el = dwEl(g.k); el.classList.add('open', 'moving');
      if (!g.wasOpen){ if (g.k === 'cal') calOpen(); else if (g.k === 'board') boardOpen(); else if (g.k === 'people') pplOpen(); }
    }
    const w = dwW(g.k);
    dwSet(g.k, g.wasOpen ? Math.max(0, dx) : w + 40 + Math.min(0, dx) * 1.05, false);
  });
  const up = e => {
    if (!g) return;
    const { k, wasOpen, moved } = g, dx = e.clientX - g.x, v = dx / Math.max(1, performance.now() - g.t), w = dwW(k);
    g = null;
    if (!moved){ wasOpen ? dwClose(k) : dwOpen(k); return; }
    const pulled = wasOpen ? -dx : -dx;
    if (wasOpen){ (dx > w * 0.3 || v > 0.5) ? dwClose(k) : dwOpen(k, true); }
    else { (pulled > w * 0.28 || v < -0.45) ? dwOpen(k, true) : dwClose(k); }
  };
  tabs.addEventListener('pointerup', up); tabs.addEventListener('pointercancel', up);
})();
/* 열린 서류의 머리를 잡고 오른쪽으로 끌면 닫힘 */
(function dwGrip(){
  /* v1.2.5 머리뿐 아니라 옆면(오른쪽 서류 등 22px·왼쪽 끝 14px)을 잡고 끌어도 닫힘 */
  const grips = k => { const el = dwEl(k), out = [el.querySelector('.dw-head')];
    for (const side of ['r', 'l']){ const d = document.createElement('div'); d.className = 'dw-grip noswipe ' + side; el.appendChild(d); out.push(d); }
    const fit = () => { const h = out[0].offsetHeight; if (h) for (const d of out.slice(1)) d.style.top = h + 'px'; };
    if (window.ResizeObserver) new ResizeObserver(fit).observe(out[0]); else setTimeout(fit, 500);
    return out; };
  for (const k of DRAWERS) for (const head of grips(k)){
    let g = null;
    head.addEventListener('pointerdown', e => { if (e.target.closest('button,input') && !e.target.closest('.dw-x')) return; g = { x:e.clientX, t:performance.now(), moved:false, onX:!!e.target.closest('.dw-x') }; try{ head.setPointerCapture(e.pointerId); }catch(x){} });
    head.addEventListener('pointermove', e => { if (!g) return; const dx = e.clientX - g.x; if (!g.moved && Math.abs(dx) < 6) return; g.moved = true; dwSet(k, Math.max(0, dx), false); });
    const up = e => { if (!g) return; const dx = e.clientX - g.x, v = dx / Math.max(1, performance.now() - g.t), moved = g.moved, onX = g.onX; g = null;
      if (!moved){
        if (onX){ dwClose(k); return; }
        if (head.classList.contains('dw-grip')){ head.style.pointerEvents = 'none'; const under = document.elementFromPoint(e.clientX, e.clientY); head.style.pointerEvents = ''; if (under) under.click(); return; }
        return; }
      (dx > dwW(k) * 0.3 || v > 0.5) ? dwClose(k) : dwOpen(k, true); };
    head.addEventListener('pointerup', up); head.addEventListener('pointercancel', up);
    head.addEventListener('lostpointercapture', e => { if (g && g.moved) up(e); });
  }
})();
/* 크기가 바뀌면(키보드·창 크기) 닫힌 서류는 계속 밖에 */
window.addEventListener('resize', () => { for (const k of DRAWERS) if (DW.open !== k && dwEl(k).classList.contains('moving')) dwSet(k, dwW(k) + 40, false); });

/* ── 옆으로 밀기 — 판 ↔ 사무실 (서류철 위에서는 서류가 먼저) ── */
const SWIPE = { anim:'' };
(function swipeNav(){
  let g = null;
  const EDGE = 18, LOCK = 10, GO = 70;
  const reset = el => { el.style.transition = 'transform .18s ease, opacity .18s ease'; el.style.transform = ''; el.style.opacity = '';
    setTimeout(() => { el.style.transition = ''; }, 200); };
  document.addEventListener('touchstart', e => {
    g = null;
    if (e.touches.length !== 1 || $('sheet').classList.contains('on') || document.body.classList.contains('typing') || DW.open) return;
    if (e.target.closest('.sheet,#veil,.noswipe')) return;
    const ae = document.activeElement;
    if (ae && ae !== document.body && ae.matches('input,textarea,select,[contenteditable]') && (e.target === ae || ae.contains(e.target))) return;
    const t = e.touches[0];
    if (t.clientX < EDGE || t.clientX > window.innerWidth - EDGE) return;
    g = { x:t.clientX, y:t.clientY, t:performance.now(), axis:'', v:curView() };
  }, { passive:true });
  document.addEventListener('touchmove', e => {
    if (!g) return;
    const t = e.touches[0], dx = t.clientX - g.x, dy = t.clientY - g.y;
    if (!g.axis){
      if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) return;
      g.axis = Math.abs(dx) > Math.abs(dy) * 1.3 ? 'x' : 'y';
      if (g.axis === 'y'){ g = null; return; }
    }
    const can = g.v === 'office' ? dx > 0 : dx < 0, d = can ? dx : dx * 0.15, el = $(VIEW_EL[g.v]);
    el.style.transition = '';
    if (g.v === 'pan') panFollow(d);
    else { el.style.transform = `translateX(${Math.round(d * 0.55)}px)`; el.style.opacity = String(Math.max(0.55, 1 - Math.abs(d) / 700)); }
    g.dx = dx;
  }, { passive:true });
  const end = () => {
    if (!g || g.axis !== 'x'){ g = null; return; }
    const dx = g.dx || 0, sp = Math.abs(dx) / Math.max(1, performance.now() - g.t), el = $(VIEW_EL[g.v]), v = g.v;
    g = null;
    const far = Math.abs(dx) > GO || (Math.abs(dx) > 35 && sp > 0.45);
    if (far && v === 'office' && dx > 0){ el.style.transform = ''; el.style.opacity = ''; SWIPE.anim = 'slide-inL'; goView('pan'); }
    else if (far && v === 'pan' && dx < 0) panAway();
    else if (v === 'pan') panBack();
    else reset(el);
  };
  document.addEventListener('touchend', end, { passive:true });
  document.addEventListener('touchcancel', () => { if (g){ g.v === 'pan' ? panBack() : reset($(VIEW_EL[g.v])); g = null; } }, { passive:true });
})();
/* 판 끌기 — 판·대화 상자·넘기기 단추가 함께 왼쪽으로. 멀리 끌었으면 끝까지 밀어내고 사무실로, 아니면 제자리로 */
(function panDrawerInit(){
  $('panNav').appendChild(document.querySelector('header .nav')); $('panNav').appendChild($('old'));
  $('panDrawer').appendChild($('panTalk'));
  $('panX').onclick = () => { SWIPE.anim = 'slide-inR'; goView('office'); };
})();
const PAN_MOVERS = () => ['panDrawer', 'panGrip'].map(id => $(id)).filter(Boolean);
function panFollow(d){ const x = Math.min(0, Math.round(d)); for (const el of PAN_MOVERS()){ el.style.transition = 'none'; el.style.transform = `translateX(${x}px)`; } }
function panBack(){ for (const el of PAN_MOVERS()){ el.style.transition = 'transform .2s ease'; el.style.transform = ''; setTimeout(() => { el.style.transition = ''; }, 220); } }
function panAway(){
  const w = $('panDrawer').offsetWidth + 40;
  for (const el of PAN_MOVERS()){ el.style.transition = 'transform .2s ease-in'; el.style.transform = `translateX(${-w}px)`; }
  setTimeout(() => { for (const el of PAN_MOVERS()){ el.style.transition = ''; el.style.transform = ''; } goView('office'); }, 200);
}
/* 판 쪽 서랍 견출지 — 누르거나 왼쪽으로 끌면 판이 밀려나고 사무실의 그 서랍이 열린다 */
(function panDwTabs(){
  const box = $('panDw'); let g = null;
  const go = async k => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); SWIPE.anim = 'slide-inR'; goView('office'); await new Promise(r => setTimeout(r, 120)); dwOpen(k); };
  box.addEventListener('pointerdown', e => { const b = e.target.closest('[data-pdw]'); if (!b) return; g = { k:b.dataset.pdw, x:e.clientX, moved:false }; try{ box.setPointerCapture(e.pointerId); }catch(x){} e.preventDefault(); });
  box.addEventListener('pointermove', e => { if (!g) return; const dx = e.clientX - g.x; if (!g.moved && Math.abs(dx) < 6) return; g.moved = true; if (dx < 0) panFollow(dx * 0.6); });
  const up = e => { if (!g) return; const { k, x, moved } = g; g = null; const dx = e.clientX - x; panBack(); if (!moved || dx < -40) go(k); };
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', () => { g = null; panBack(); });
})();

/* 마우스·펜으로도: 판 오른쪽 옆면(서류 등)을 잡고 왼쪽으로 끈다 */
(function panGrip(){
  const gp = $('panGrip'); let g = null;
  /* 머리(🗒️ 판 띠)를 잡고 끌어도 똑같이 */
  (function headDrag(){ const hd = $('panHead'); let h = null;
    hd.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; h = { x:e.clientX, t:performance.now(), moved:false }; try{ hd.setPointerCapture(e.pointerId); }catch(x){} });
    hd.addEventListener('pointermove', e => { if (!h) return; const dx = e.clientX - h.x; if (!h.moved && Math.abs(dx) < 6) return; h.moved = true; panFollow(dx); });
    const up = e => { if (!h) return; const dx = e.clientX - h.x, v = -dx / Math.max(1, performance.now() - h.t), mv = h.moved; h = null; if (!mv) return; (-dx > $('panDrawer').offsetWidth * 0.3 || v > 0.5) ? panAway() : panBack(); };
    hd.addEventListener('pointerup', up); hd.addEventListener('pointercancel', up); })();
  const place = () => { const r = $('main').getBoundingClientRect(), b = document.body.getBoundingClientRect(), framed = getComputedStyle(document.body).transform !== 'none'; gp.style.left = (r.right - (framed ? b.left : 0) - 22) + 'px'; };
  window.addEventListener('resize', place); new MutationObserver(place).observe(document.body, { attributes:true, attributeFilter:['class'] }); setTimeout(place, 300);
  gp.addEventListener('pointerdown', e => { place(); g = { x:e.clientX, t:performance.now(), moved:false }; try{ gp.setPointerCapture(e.pointerId); }catch(x){} });
  gp.addEventListener('pointermove', e => { if (!g) return; const dx = e.clientX - g.x; if (!g.moved && Math.abs(dx) < 6) return; g.moved = true; panFollow(dx); });
  const up = e => { if (!g) return; const dx = e.clientX - g.x, v = -dx / Math.max(1, performance.now() - g.t), moved = g.moved; g = null;
    if (!moved) return; (-dx > $('main').offsetWidth * 0.3 || v > 0.5) ? panAway() : panBack(); };
  gp.addEventListener('pointerup', up); gp.addEventListener('pointercancel', up);
})();
