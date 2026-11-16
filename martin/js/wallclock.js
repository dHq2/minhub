/* martin/js/wallclock.js — 벽시계 (v0.14.2, 11-17 A). 고칠 땐 이 줄 아래에 「11-17 D: …」처럼 날짜·방 주석
   보스가 준 벽시계 그림(배경 투명, 바늘 지움 — img/clock.webp)에 바늘을 그려 판 왼쪽 위에 늘 걸어 둔다.
   시계가 가리키는 건 사건 시계 — 처음 10:50, 동료가 판에 와 있는 동안만 실제 속도로 흐른다(계산·기록은 D 의 js/clock.js: S.clock = { ms, start:'10:50' }).
   D 가 clockMs()(지금 쌓인 ms) 를 내놓으면 그걸 쓰고, 없으면 S.clock.ms 를 받아 보이는 동안만 이어 센다(clock.js 가 아직 없어도 돈다 — 그땐 이번 접속 동안만).
   누르면 크게 + 사건 시계·실제 추리 시간. 그림 단위: 원본 1048×1118, 바늘 축 (532,529). */
const WC = { live:[], raf:0, base:null, perf:performance.now(), focus:document.hasFocus() };
addEventListener('focus', () => { WC.focus = true; WC.perf = performance.now(); });
addEventListener('blur', () => { WC.focus = false; });
const wcHere = () => document.visibilityState === 'visible' && WC.focus;
/* 사건 시계 ms — D 의 것을 믿고, 그 사이는 이어 센다 */
function wcMs(){
  if (typeof clockMs === 'function'){ try{ const v = clockMs(); if (typeof v === 'number' && isFinite(v)) return v; }catch(e){} }
  const now = performance.now(), c = S && S.clock, sv = c && typeof c.ms === 'number' ? c.ms : null;
  if (WC.base === null || (sv !== null && sv !== WC.seen)){ WC.base = sv !== null ? sv : (WC.base || 0); WC.seen = sv; WC.perf = now; }
  if (wcHere()){ WC.base += now - WC.perf; } WC.perf = now; return WC.base;
}
function wcStart(){ const st = (S && S.clock && S.clock.start) || '10:50'; const [h, m] = String(st).split(':').map(Number); return ((h || 10) * 60 + (m || 0)) * 60; }
const wcFmt = sec => { sec = Math.floor(sec) % 86400; const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60; return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };
const wcDur = ms => { const t = Math.max(0, ms) / 1000, h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = (t % 60).toFixed(2).padStart(5, '0'); return `${h ? h + '시간 ' : ''}${m}분 ${s}초`; };
let wcN = 0;
function wcMake(el){
  const id = 'wc' + (++wcN);
  el.innerHTML = `<img class="wc-face" src="img/clock.webp" alt="" draggable="false">
  <svg class="wc-hands" viewBox="0 0 1048 1118" aria-hidden="true"><defs><filter id="${id}s" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="7" dy="10" stdDeviation="4" flood-color="#1c130c" flood-opacity=".4"/></filter>
   <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#3a2e26"/><stop offset=".5" stop-color="#211913"/><stop offset="1" stop-color="#2d231c"/></linearGradient></defs>
   <g filter="url(#${id}s)">
    <path class="wc-h" fill="url(#${id}g)" d="M-7 30 L-7.5 0 L-5.5 -150 L-15 -203 L-15.5 -232 L0 -288 L15.5 -232 L15 -203 L5.5 -150 L7.5 0 L7 30 Z"/>
    <path class="wc-m" fill="url(#${id}g)" d="M-6 42 L-6.5 0 L-5 -378 L0 -414 L5 -378 L6.5 0 L6 42 Z"/>
    <g class="wc-s"><rect x="-1.6" y="-392" width="3.2" height="462" rx="1.2" fill="#7c2419"/><circle cx="0" cy="52" r="10" fill="#7c2419"/></g>
   </g>
   <image href="img/clock-cap.webp" x="491.5" y="488.5" width="81" height="81"/>
  </svg>`;
  const h = el.querySelector('.wc-h'), m = el.querySelector('.wc-m'), s = el.querySelector('.wc-s');
  const o = { el, set(sec){   /* sec = 시계가 가리킬 하루 속 초 */
    const f = sec - Math.floor(sec), x = Math.min(1, f / .16) - 1, tick = 1 + 2.70158 * x * x * x + 1.70158 * x * x;   /* 초침은 '딱' 하고 살짝 튕긴다(ease-out-back 0.16초) */
    const sa = (Math.floor(sec) - 1 + tick) * 6, ma = (sec / 60) % 60 * 6, ha = (sec / 3600) % 12 * 30;
    h.setAttribute('transform', `translate(532 529) rotate(${ha.toFixed(2)})`); m.setAttribute('transform', `translate(532 529) rotate(${ma.toFixed(2)})`); s.setAttribute('transform', `translate(532 529) rotate(${sa.toFixed(2)})`);
    el.dataset.t = wcFmt(sec); } };
  WC.live.push(o); return o;
}
function wcLoop(){
  WC.raf = 0; WC.live = WC.live.filter(o => o.el.isConnected);
  const sec = wcStart() + wcMs() / 1000; for (const o of WC.live) o.set(sec);
  const big = document.getElementById('wcInfo'); if (big) big.innerHTML = wcInfoHtml(sec);
  if (WC.live.length && document.visibilityState === 'visible') WC.raf = requestAnimationFrame(wcLoop);
}
document.addEventListener('visibilitychange', () => { WC.perf = performance.now(); if (!WC.raf && document.visibilityState === 'visible') WC.raf = requestAnimationFrame(wcLoop); });
function wcInfoHtml(sec){ return `<b>${wcFmt(sec)}</b><span>사건 시계 — 판에 와 있을 때만 흐른다</span><span>이 사건에 들인 시간 ${wcDur(wcMs())}</span>`; }
function wcSheet(){
  act('벽시계 크게');
  if (typeof clockSheet === 'function') return clockSheet();   /* D 가 사건 시계 서랍을 만들면 그쪽이 먼저 */
  openSheet(`<h3>벽시계</h3><div class="wc-big" id="wcBig"></div><p class="wc-info" id="wcInfo"></p>`);
  wcMake(document.getElementById('wcBig')); if (!WC.raf) WC.raf = requestAnimationFrame(wcLoop);
}
(() => {   /* 판 왼쪽 위에 건다 */
  const b = document.getElementById('board'); if (!b) return;
  const el = document.createElement('button'); el.type = 'button'; el.className = 'wallclock'; el.id = 'wallclock'; el.setAttribute('aria-label', '벽시계 — 사건 시계');
  b.appendChild(el); wcMake(el); el.addEventListener('click', e => { e.stopPropagation(); wcSheet(); });
  WC.raf = requestAnimationFrame(wcLoop);
})();
