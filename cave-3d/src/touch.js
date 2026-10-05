/* touch.js v1.1 — (v1.1: 전체화면 버튼 ⛶ · 가로 고정 시도, 막혀 있으면 브라우저로 여는 법 안내 · '화면을 클릭하면' 안내 숨김) (v1.0, v0.50) 모바일 · 터치 조작
   · 켜지는 때: 손가락 화면 (pointer: coarse) · 주소에 ?touch. 일시정지 창에서 끄고 켬 (저장됨)
   · 왼쪽 아래 아무 데나 엄지를 대면 그 자리가 이동 스틱 (WASD). 끝까지 밀면 달리기 (Shift)
   · 오른쪽: 큰 공격 (J) + 스킬 (K, 누르고 있기 = 투창 당김) · 구르기 (Q) · 점프 (Space) · 막기 (F, 누르는 동안) · 숙이기 (G) · 잡기 (V) · 태클 (T)
     달리면서 V = 테이크다운 · G = 슬라이딩 · 점프 중 J = 니킥 / 드롭킥 — 키보드와 같은 조합
   · E 버튼은 살펴볼 것이 있을 때만 그 이름과 함께 크게 뜸
   · 위 오른쪽 작은 줄: 일시정지 · 가방 · 기술표 · 지도 · 먹기 (N) · 카메라 돌리기. 소모품 4 ~ 7은 공격 버튼 위에
   · 글상자가 떠 있으면 화면 아무 데나 톡 = 다음
   · 손가락 화면에선 영웅 칸 · 지도 · 지시 버튼을 작게 줄이고, 스킬 줄은 버튼으로 대신함 */
'use strict';
const TOUCH = { on: false, stick: null, held: new Set() };
function touchWanted(){
  try { const v = localStorage.getItem('cave3d.touch'); if (v === '1') return true; if (v === '0') return false; } catch (e) {}
  return /[?&]touch/.test(location.search) || (matchMedia && matchMedia('(pointer: coarse)').matches);
}
function vkDown(code){ if (!keys.has(code)) pressed.add(code); keys.add(code); TOUCH.held.add(code); SFX.wake && SFX.wake(); }
function vkUp(code){ keys.delete(code); TOUCH.held.delete(code); }
const TBTN = [   // [키, 글, 클래스, 누르고 있기]
  ['KeyJ', '공격', 'big', true], ['KeyK', '스킬', 'k', true], ['KeyQ', '구르기', 'q', false], ['Space', '점프', 'sp', false],
  ['KeyF', '막기', 'f', true], ['KeyG', '숙이기', 'g', true], ['KeyV', '잡기', 'v', false], ['KeyT', '태클', 't', false],
];
const TTOP = [['FS', '⛶', '전체화면'], ['Escape', '⏸', '일시정지'], ['KeyI', '🎒', '가방 · 장비'], ['KeyH', '📜', '기술표'], ['KeyM', '🗺', '큰 지도'], ['KeyN', '🍖', '바로 먹기'], ['KeyZ', '↺', '카메라'], ['KeyC', '↻', '카메라']];
function touchBuild(){
  if (document.getElementById('touchUI')) return;
  const el = document.createElement('div'); el.id = 'touchUI';
  el.innerHTML = `<div id="tStickZone"><div id="tStick"><i></i></div></div>
    <div id="tTop">${TTOP.map(([k, t, n]) => `<button data-k="${k}" aria-label="${n}">${t}</button>`).join('')}</div>
    <div id="tQuick">${[0, 1, 2, 3].map(i => `<button data-q="${i}"><kbd>${i + 4}</kbd><span></span></button>`).join('')}</div>
    <button id="tE" data-k="KeyE" hidden><b>E</b><span></span></button>
    <div id="tPad">${TBTN.map(([k, t, c, hold]) => `<button class="${c}" data-k="${k}" ${hold ? 'data-hold="1"' : ''}>${t}</button>`).join('')}</div>
    <div id="tTurn" hidden>가로로 돌리면 더 넓게 보여요</div>`;
  document.body.appendChild(el);
  // 버튼: 누르면 키 누름, 떼면 뗌 (여러 손가락)
  const press = (b, on) => { const k = b.dataset.k; if (!k) return; if (on){ vkDown(k); b.classList.add('on'); } else { vkUp(k); b.classList.remove('on'); } };
  el.querySelector('[data-k="FS"]').removeAttribute('data-k');
  const fsb = el.querySelector('#tTop button'); fsb.dataset.fs = '1';
  fsb.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); goFull(); }, { passive: false });
  fsb.addEventListener('click', e => { e.stopPropagation(); goFull(); });
  el.querySelectorAll('button[data-k]').forEach(b => {
    b.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); press(b, true); if (!b.dataset.hold) setTimeout(() => press(b, false), 90); }, { passive: false });
    b.addEventListener('touchend', e => { e.preventDefault(); e.stopPropagation(); if (b.dataset.hold) press(b, false); }, { passive: false });
    b.addEventListener('touchcancel', () => press(b, false));
    b.addEventListener('mousedown', e => { e.stopPropagation(); press(b, true); if (!b.dataset.hold) setTimeout(() => press(b, false), 90); });
    b.addEventListener('mouseup', () => { if (b.dataset.hold) press(b, false); });
  });
  el.querySelectorAll('[data-q]').forEach(b => b.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); typeof quickUse === 'function' && quickUse(+b.dataset.q); }, { passive: false }));
  // 이동 스틱: 왼쪽 아래 아무 데나
  const zone = el.querySelector('#tStickZone'), stick = el.querySelector('#tStick'), knob = stick.querySelector('i'), R = 56;
  const setDir = (dx, dy) => {
    const d = Math.hypot(dx, dy), k = Math.min(1, d / R), a = Math.atan2(dy, dx);
    knob.style.transform = `translate(${Math.cos(a) * k * R}px,${Math.sin(a) * k * R}px)`;
    const on = d > 14, nx = dx / (d || 1), ny = dy / (d || 1);
    const want = { KeyW: on && ny < -0.38, KeyS: on && ny > 0.38, KeyA: on && nx < -0.38, KeyD: on && nx > 0.38, ShiftLeft: on && k > 0.92 };
    for (const [c, w] of Object.entries(want)){ if (w && !keys.has(c)) vkDown(c); if (!w && TOUCH.held.has(c)) vkUp(c); }
  };
  zone.addEventListener('touchstart', e => {
    e.preventDefault(); if (TOUCH.stick) return; const t = e.changedTouches[0];
    TOUCH.stick = { id: t.identifier, x: t.clientX, y: t.clientY };
    stick.style.left = (t.clientX - 70) + 'px'; stick.style.top = (t.clientY - 70) + 'px'; stick.classList.add('on'); setDir(0, 0);
  }, { passive: false });
  const move = e => { const S = TOUCH.stick; if (!S) return; for (const t of e.changedTouches) if (t.identifier === S.id){ e.preventDefault(); setDir(t.clientX - S.x, t.clientY - S.y); } };
  const end = e => { const S = TOUCH.stick; if (!S) return; for (const t of e.changedTouches) if (t.identifier === S.id){ TOUCH.stick = null; setDir(0, 0); stick.classList.remove('on'); stick.style.left = stick.style.top = ''; for (const c of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft']) vkUp(c); } };
  zone.addEventListener('touchmove', move, { passive: false }); zone.addEventListener('touchend', end); zone.addEventListener('touchcancel', end);
}
function touchSet(on){
  TOUCH.on = on; document.body.classList.toggle('touch', on);
  if (on) touchBuild();
  const el = document.getElementById('touchUI'); if (el) el.hidden = !on;
  try { localStorage.setItem('cave3d.touch', on ? '1' : '0'); } catch (e) {}
}
// 글상자 · 결과 창: 화면 아무 데나 톡 = 다음 (버튼 · 창 안은 그대로)
addEventListener('touchstart', e => {
  if (!TOUCH.on) return;
  if (e.target.closest && e.target.closest('#touchUI button, button, .rw-box, .cf-box, #storeMenu, .pp-box, .rs-box, #movelist')) return;
  if (G.waitInput) pressed.add('Enter');
}, { passive: true });
// 매 0.15초: E 버튼 · 소모품 칸 · 세로 화면 안내
setInterval(() => {
  if (!TOUCH.on) return;
  const e = document.getElementById('tE'); if (!e) return;
  const it = !G.lock && !G.waitInput ? (G.nearIt || G.freeE) : null;
  e.hidden = !it || !PLAY_MODES.has(G.mode);
  if (it){ const t = String(it.label || '살펴보기').split(' — ')[0]; const s = e.querySelector('span'); if (s.textContent !== t) s.textContent = t; }
  document.querySelectorAll('#tQuick [data-q]').forEach(b => { const id = RPG.quick[+b.dataset.q], it2 = id && RPG.bag.find(o => o.id === id); const s = b.querySelector('span'); const t = it2 ? (itemDef(it2).n || '').slice(0, 4) + (it2.n > 1 ? ' ×' + it2.n : '') : ''; if (s.textContent !== t) s.textContent = t; b.classList.toggle('empty', !it2); });
  const q = document.getElementById('tQuick'); if (q) q.hidden = G.mode !== 'exp';
  const tt = document.getElementById('tTurn'); if (tt) tt.hidden = innerWidth >= innerHeight;
  const pad = document.getElementById('tPad'); if (pad) pad.classList.toggle('dim', !PLAY_MODES.has(G.mode) || !!G.waitInput);
}, 150);
// 일시정지 창에 "터치 조작 켜기/끄기"
if (typeof pauseOpen === 'function'){
  const _pauseT = pauseOpen;
  pauseOpen = function(){
    _pauseT();
    const box = document.querySelector('#confirm .cf-box div'); if (!box || box.querySelector('[data-p="touch"]')) return;
    const b = document.createElement('button'); b.dataset.p = 'touch'; b.textContent = TOUCH.on ? '터치 조작 끄기' : '터치 조작 켜기';
    b.addEventListener('click', ev => { ev.stopPropagation(); touchSet(!TOUCH.on); b.textContent = TOUCH.on ? '터치 조작 끄기' : '터치 조작 켜기'; });
    box.appendChild(b);
  };
}
touchSet(touchWanted());

// 전체화면: 브라우저에선 됨. 앱 안의 미리보기 (iframe)에선 막혀 있을 수 있음 → 브라우저로 여는 법 안내
async function goFull(){
  const d = document, el = d.documentElement;
  try {
    if (d.fullscreenElement || d.webkitFullscreenElement){ await (d.exitFullscreen || d.webkitExitFullscreen).call(d); return; }
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req || d.fullscreenEnabled === false) throw new Error('blocked');
    await req.call(el, { navigationUI: 'hide' });
    try { await screen.orientation.lock('landscape'); } catch (e) {}
  } catch (e) {
    typeof uiToast === 'function' && uiToast('이 화면 (앱 안 미리보기)에선 전체화면이 막혀 있어요 — 오른쪽 위 공유 → 링크를 크롬 같은 브라우저로 열면 ⛶로 꽉 찬 화면이 됩니다. 브라우저 메뉴의 "홈 화면에 추가"로 앱처럼 열 수도 있어요', 'warn');
  }
}
