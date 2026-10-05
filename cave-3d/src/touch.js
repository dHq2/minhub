/* touch.js v1.4 — (v1.4, v0.54: 스킬 버튼 = 조준 스틱 — 누른 채 끌면 그쪽으로 조준 (투창 · 활 · 총), 왼손 스틱으로는 앞 · 뒤 · 옆으로 움직이면서. 손을 떼면 던짐. 버튼 배치: 아래 줄 숙이기 · 구르기 · 공격 · 점프 (크게), 그 위 스킬 (크게) + 막기 · 잡기 · 태클 (작게)) (v1.3, v0.53: 버튼을 그림 (픽토그램)으로 · 점프 · 구르기 크게 · 👥 동료 · 상대 창 · 약한 조준 보정 — 조이스틱이 가리키는 쪽 ±26° · 12칸 안의 적에게 붙음, 노린 적 발밑에 노란 고리) (v1.2, v0.52: 화면이 잘 보이게 — 카메라를 가깝게 (굴은 인주를 따라감) · 조금 밝게 · 버튼 작고 옅게 · 굴 정보는 한 줄 (톡 = 펼침). 조준 · 투창은 조이스틱 방향 (손을 떼면 마지막 방향), 자동 조준 · 화면 톡 공격 없음) (v1.1: 전체화면 버튼 ⛶ · 가로 고정 시도, 막혀 있으면 브라우저로 여는 법 안내 · '화면을 클릭하면' 안내 숨김) (v1.0, v0.50) 모바일 · 터치 조작
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
const TBTN = [   // [키, 글, 클래스, 누르고 있기] — 아래 줄: 숙이기 · 구르기 · 공격 · 점프 (크게) / 위 줄: 스킬 (크게, 끌어서 조준) · 막기 · 잡기 · 태클 (작게)
  ['KeyG', '숙이기', 'g', true], ['KeyQ', '구르기', 'q', false], ['KeyJ', '공격', 'big', true], ['Space', '점프', 'sp', false],
  ['KeyK', '스킬', 'k', true], ['KeyF', '막기', 'f', true], ['KeyV', '잡기', 'v', false], ['KeyT', '태클', 't', false],
];
const TTOP = [['FS', 'fs', '전체화면'], ['Escape', 'pause', '일시정지'], ['KeyU', 'party', '동료 · 상대'], ['KeyI', 'bag', '가방 · 장비'], ['KeyH', 'list', '기술표'], ['KeyM', 'map', '큰 지도'], ['KeyN', 'food', '바로 먹기'], ['KeyZ', 'ccw', '카메라 왼쪽'], ['KeyC', 'cw', '카메라 오른쪽']];
// 픽토그램 (24칸, 선 그림 — 글자 없이도 알아보게)
const TICON = {
  KeyJ: '<path d="M19 4 8.5 14.5M19 4h-4.5M19 4v4.5M6 12l6 6M4 20l3.5-3.5"/>',
  KeyK: '<path d="M4 20 19 5M19 5h-5.5M19 5v5.5M3 11h4M11 21v-4"/>',
  KeyQ: '<circle cx="9" cy="14" r="5"/><path d="M9 9.5v4.5l3 2M15 6h6M17 10h4"/>',
  Space: '<path d="M12 17V4M6.5 9.5 12 4l5.5 5.5M5 21h14"/>',
  KeyF: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  KeyG: '<path d="M12 3v12M6.5 9.5 12 15l5.5-5.5M5 20h14"/>',
  KeyV: '<path d="M8 12.5V6a1.5 1.5 0 0 1 3 0v5M11 10.5V4.5a1.5 1.5 0 0 1 3 0v6M14 10.5V6a1.5 1.5 0 0 1 3 0v7c0 4.5-2.5 8-6.5 8-3 0-4.6-1.8-5.6-4.4L4 13.4a1.5 1.5 0 0 1 2.6-1.3L8 14"/>',
  KeyT: '<path d="M3 8h5M2 12h6M3 16h5M11 5.5 20 12l-9 6.5z"/>',
  fs: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', pause: '<path d="M9 5v14M15 5v14"/>',
  party: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14c2.8 0 4.5 2.2 4.5 5"/>',
  bag: '<path d="M5 8h14l-1.2 12H6.2zM9 8V6a3 3 0 0 1 6 0v2"/>', list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/>',
  map: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20zM9 4v13.5M15 6.5V20"/>', food: '<path d="M3 11h18a9 8 0 0 1-18 0zM8 8c0-1.6 1.2-2 1.2-3.6M12 8c0-1.6 1.2-2 1.2-3.6M16 8c0-1.6 1.2-2 1.2-3.6"/>',
  ccw: '<path d="M4.5 13a7.5 7.5 0 1 0 2.4-6.4M4 3v4.5h4.5"/>', cw: '<path d="M19.5 13a7.5 7.5 0 1 1-2.4-6.4M20 3v4.5h-4.5"/>',
};
const ticon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${TICON[k] || ''}</svg>`;
function touchBuild(){
  if (document.getElementById('touchUI')) return;
  const el = document.createElement('div'); el.id = 'touchUI';
  el.innerHTML = `<div id="tStickZone"><div id="tStick"><i></i></div></div>
    <div id="tTop">${TTOP.map(([k, t, n]) => `<button data-k="${k}" aria-label="${n}" title="${n}">${ticon(t)}</button>`).join('')}</div>
    <div id="tQuick">${[0, 1, 2, 3].map(i => `<button data-q="${i}"><kbd>${i + 4}</kbd><span></span></button>`).join('')}</div>
    <button id="tE" data-k="KeyE" hidden><b>E</b><span></span></button>
    <div id="tPad">${TBTN.map(([k, t, c, hold]) => `<button class="${c}" data-k="${k}" ${hold ? 'data-hold="1"' : ''} aria-label="${t}">${ticon(k)}<small>${t}</small></button>`).join('')}</div>
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
  // v1.4 스킬 버튼 끌기 = 조준
  const kb = el.querySelector('#tPad [data-k="KeyK"]');
  kb.addEventListener('touchstart', e => { const t = e.changedTouches[0]; TOUCH.drag = { id: t.identifier, x0: t.clientX, y0: t.clientY, dx: 0, dy: 0, on: false }; }, { passive: false });
  kb.addEventListener('touchmove', e => { const D = TOUCH.drag; if (!D) return; for (const t of e.changedTouches) if (t.identifier === D.id){ e.preventDefault(); D.dx = t.clientX - D.x0; D.dy = t.clientY - D.y0; if (Math.hypot(D.dx, D.dy) > 12) D.on = true; kb.style.setProperty('--ax', Math.max(-40, Math.min(40, D.dx)) + 'px'); kb.style.setProperty('--ay', Math.max(-40, Math.min(40, D.dy)) + 'px'); kb.classList.toggle('drag', D.on); } }, { passive: false });
  const kEnd = () => { setTimeout(() => { TOUCH.drag = null; }, 120); kb.classList.remove('drag'); };   // 던지는 프레임까지 방향 유지
  kb.addEventListener('touchend', kEnd); kb.addEventListener('touchcancel', kEnd);
  el.querySelectorAll('[data-q]').forEach(b => b.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); typeof quickUse === 'function' && quickUse(+b.dataset.q); }, { passive: false }));
  // 이동 스틱: 왼쪽 아래 아무 데나
  const zone = el.querySelector('#tStickZone'), stick = el.querySelector('#tStick'), knob = stick.querySelector('i'), R = 44;
  const setDir = (dx, dy) => {
    const d = Math.hypot(dx, dy), k = Math.min(1, d / R), a = Math.atan2(dy, dx);
    knob.style.transform = `translate(${Math.cos(a) * k * R}px,${Math.sin(a) * k * R}px)`;
    const on = d > 10, nx = dx / (d || 1), ny = dy / (d || 1);
    const want = { KeyW: on && ny < -0.38, KeyS: on && ny > 0.38, KeyA: on && nx < -0.38, KeyD: on && nx > 0.38, ShiftLeft: on && k > 0.92 };
    for (const [c, w] of Object.entries(want)){ if (w && !keys.has(c)) vkDown(c); if (!w && TOUCH.held.has(c)) vkUp(c); }
  };
  zone.addEventListener('touchstart', e => {
    e.preventDefault(); if (TOUCH.stick) return; const t = e.changedTouches[0];
    TOUCH.stick = { id: t.identifier, x: t.clientX, y: t.clientY };
    stick.style.left = (t.clientX - 56) + 'px'; stick.style.top = (t.clientY - 56) + 'px'; stick.classList.add('on'); setDir(0, 0);
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

// v1.2 조준: 손가락 화면에선 마우스 · 자동 조준 대신 조이스틱 방향 (손을 떼면 마지막으로 본 쪽)
//  공격 · 투창 · 활 · 총 · 마력 폭발 모두 aimPoint → 이 점을 향함. 적 위를 가리키는 마우스 (mouse.over)도 끔
const _aimPointT = aimPoint;
aimPoint = function(u){
  if (!TOUCH.on || u !== G.player) return _aimPointT(u);
  if (mouse.over && !mouse.over.dead) return { x: mouse.over.x, z: mouse.over.z };   // 조준 보정이 잡은 적
  const d = touchDragDir(), a = touchAimAngle(u), L = THROW.range * (d ? d.k : 1);   // 끈 길이 = 던질 거리
  return { x: u.x + Math.cos(a) * L, z: u.z + Math.sin(a) * L };
};
const _mouseOverT = mouseOverEnemy;
mouseOverEnemy = function(){ if (!TOUCH.on) return _mouseOverT(); const t = touchAssist(); touchMark(t); return t; };
// v1.3 약한 조준 보정: 조이스틱 (놓았으면 마지막 방향)이 가리키는 쪽 ±26° · 12칸 안의 적 중 가장 각이 맞는 놈. 보이지 않는 (벽 너머) 적은 빼고
//  고른 적은 마우스로 가리킨 것과 같게 다룸 (투창은 그 몸 가운데로, 공격 · 막기는 그쪽으로 돎). 발밑에 노란 고리
const ASSIST = { arc: 0.45, range: 12 };
// 조준 방향: 스킬 버튼을 끌고 있으면 그쪽 (화면 기준 → 세계), 아니면 이동 스틱, 아니면 바라보는 쪽
function touchDragDir(){
  const D = TOUCH.drag; if (!D || !D.on) return null;
  const L = Math.hypot(D.dx, D.dy) || 1, ix = D.dx / L, iy = -D.dy / L, y = CAM.yaw || 0;
  const v = norm(Math.cos(y) * ix - Math.sin(y) * iy, -Math.sin(y) * ix - Math.cos(y) * iy);
  return { a: Math.atan2(v.z, v.x), k: Math.max(0.25, Math.min(1, L / 70)) };
}
function touchAimAngle(u){ const d = touchDragDir(); if (d) return d.a; const mv = G.lock ? null : inputDir(); return mv ? Math.atan2(mv.z, mv.x) : u.aim; }
function touchAssist(){
  const u = G.player; if (!u || G.lock || !PLAY_MODES.has(G.mode)) return null;
  const a = touchAimAngle(u);
  let best = null, bs = 1e9;
  for (const e of foes()){
    if (e.dead || e.downed || e.D.dummy && !e.D.spar) continue;
    const d = dist(u, e); if (d > ASSIST.range) continue;
    const da = Math.abs(angDiff(Math.atan2(e.z - u.z, e.x - u.x), a)); if (da > ASSIST.arc + Math.min(0.35, 0.6 / Math.max(1, d))) continue;   // 가까울수록 조금 너그럽게
    if (typeof sees === 'function' && !sees(u, e)) continue;
    const sc = da * 6 + d * 0.15; if (sc < bs){ bs = sc; best = e; }
  }
  if (best){ const base = best.y + (best.lift || 0) + (best.jy || 0), f = toScreen(best.x, base + bodyH(best) * 0.55, best.z, UI.W, UI.H); mouse.x = f.x; mouse.y = f.y; }
  return best;
}
let _tMark = null;
function touchMark(t){
  if (!G.scene) return;
  if (!_tMark){ _tMark = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.56, 28), new THREE.MeshBasicMaterial({ color: 0xffd35a, transparent: true, opacity: 0.75, depthWrite: false, side: THREE.DoubleSide })); _tMark.rotation.x = -Math.PI / 2; _tMark.renderOrder = 5; }
  if (_tMark.parent !== G.scene) G.scene.add(_tMark);
  _tMark.visible = !!t;
  if (t){ const r = Math.max(0.5, t.r * 1.3); _tMark.position.set(t.x, (t.y || 0) + 0.04, t.z); _tMark.scale.setScalar(r / 0.5 * (1 + Math.sin(G.t * 8) * 0.06)); }
}
// 화면 (그림판)을 톡 해도 마우스 클릭 (공격)이 되지 않게: 터치가 만드는 가짜 마우스를 막음
(function(){
  const cv = G.renderer && G.renderer.domElement;
  const block = el => el.addEventListener('touchstart', e => { if (TOUCH.on && e.cancelable) e.preventDefault(); }, { passive: false });
  if (cv) block(cv); else { const st = document.getElementById('stage'); st && block(st); }
})();

// v1.2 카메라: 손가락 화면은 작으니 가깝게. 굴 (한눈에 보는 고정 카메라)은 인주를 따라가며 절반 거리, 원정은 0.8배
const _updCamT = updateCamera;
updateCamera = function(dt, target){
  if (!TOUCH.on) return _updCamT(dt, target);
  const cave = !!G.camAnchor, b = CAM.base, y = b.y, back = b.back, k = cave ? 0.56 : 0.8;
  if (cave && G.player && !G.lock) target = { x: lerp(target.x, G.player.x, 0.85), z: lerp(target.z, G.player.z, 0.85) };
  b.y = y * k; b.back = back * k;
  try { _updCamT(dt, target); } finally { b.y = y; b.back = back; }
};
// 굴 정보 창: 손가락 화면에선 위에 한 줄 → 아래 화면을 밀어 올리지 않음. 톡 하면 펼침 / 접음
const _caveBarT = caveBar;
caveBar = function(){
  _caveBarT();
  if (!TOUCH.on) return;
  PRO.barH = 0; const pr = document.getElementById('prompt'), gd = document.getElementById('guide'); if (pr) pr.style.bottom = ''; if (gd) gd.style.bottom = '';
};
document.getElementById('cavebar').addEventListener('touchstart', e => { if (!TOUCH.on) return; e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.toggle('open'); }, { passive: false });

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

// v1.3 안내 글: 손가락 화면에선 마우스 · 키 이름 대신 버튼 이름으로
if (typeof guide === 'function'){
  const _guideT = guide;
  guide = function(html, ...a){
    if (TOUCH.on && typeof html === 'string') html = html.replace(/좌클릭/g, '공격 버튼').replace(/우클릭/g, '스킬 버튼').replace(/<em>(Q|F|E|G|V|T|J|K|Space|Shift)<\/em>\s*/g, '').replace(/\b(WASD|마우스)\b/g, '조이스틱');
    return _guideT(html, ...a);
  };
}
