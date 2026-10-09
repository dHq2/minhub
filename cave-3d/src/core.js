/* 굴의 프롤로그 3D 시제품 · core.js v0.1
   공용: 상태 · 입력 · 수학 · 그림(스프라이트 정의) · 텍스처 */
'use strict';
const VERSION = 'v0.78';
const TICKS = [];   // v0.55 한 프레임마다 부르는 것들 (engage · sol · squad · drill이 넣음): f(dt)
// v0.49 게임이 업데이트되면 (VERSION이 바뀌면) 저장을 모두 지우고 새로 시작 (민수: 진행 중 저장은 되게, 단 업데이트되면 초기화)
let SAVE_RESET = null;
try { const sv = localStorage.getItem('cave3d.ver'); if (sv && sv !== VERSION){ for (const k of ['cave3d.pro.v1', 'cave3d.rpg.v1', 'cave3d.exp.v1']) localStorage.removeItem(k); SAVE_RESET = sv; } localStorage.setItem('cave3d.ver', VERSION); } catch (e) {}

const G = {
  t: 0, dt: 0, scene: null, renderer: null,
  mode: 'boot',            // boot · lobby · load · floor · end
  units: [], projs: [], decals: [], fx: [], props: [], inspect: [],
  hitstop: 0, slow: 1, lock: false, map: null, player: null,
  cmd: 'free',             // 동료 지시: follow · focus · free
  focusTarget: null, boss: null, flags: {},
};

/* ---------- 수학 ---------- */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const norm = (x, z) => { const l = Math.hypot(x, z) || 1; return { x: x / l, z: z / l }; };
const rnd = (a, b) => a + Math.random() * (b - a);
const angDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

/* ---------- 입력 ---------- */
const keys = new Set(), pressed = new Set();
const mouse = { x: 0, y: 0, left: false, right: false, moved: -99, wx: 0, wz: 0, over: null, inside: false };
addEventListener('keydown', e => {
  if (['Space', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  if (!keys.has(e.code)) pressed.add(e.code);
  SFX.wake();
  keys.add(e.code);
});
addEventListener('keyup', e => keys.delete(e.code));
// 창이 포커스를 잃거나 (우클릭 메뉴 · 다른 창) 숨으면 눌린 키 · 버튼을 모두 놓은 것으로 (키가 눌린 채 남아 엉뚱하게 움직이던 것)
function releaseAll(){ keys.clear(); mouse.left = mouse.right = false; }
addEventListener('blur', releaseAll);
document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });
// 우클릭 (투창)이 어디서 떨어지든 브라우저 메뉴 (복사 · 붙여넣기)가 뜨지 않게, 글자도 드래그로 선택되지 않게
addEventListener('contextmenu', e => e.preventDefault());
// 게임 화면 어디든 누르면 키보드가 이 화면으로 옴 (다른 창 · 입력칸에 글자가 들어가던 것). 소리도 이때 깨움
addEventListener('pointerdown', () => { try { window.focus(); if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); } catch (e) {} SFX.wake(); }, true);
addEventListener('selectstart', e => { if (!e.target.closest || !e.target.closest('input,textarea')) e.preventDefault(); });
const hit = code => pressed.has(code);
const down = code => keys.has(code);
function bindMouse(el){
  el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.moved = G.t; mouse.inside = true; });
  el.addEventListener('mouseleave', () => { mouse.inside = false; });
  el.addEventListener('mousedown', e => { if (e.button === 0){ mouse.left = true; pressed.add('Mouse0'); } if (e.button === 2){ mouse.right = true; pressed.add('Mouse2'); } });
  addEventListener('mouseup', e => { if (e.button === 0) mouse.left = false; if (e.button === 2) mouse.right = false; });
  el.addEventListener('contextmenu', e => e.preventDefault());
}

/* ---------- 소리 (WebAudio로 즉석 합성: 천둥 · 쿵 · 바람) ---------- */
const SFX = {
  ctx: null, noise: null,
  wake(){ try { if (!this.ctx){ const C = window.AudioContext || window.webkitAudioContext; if (!C) return; this.ctx = new C(); const n = this.ctx.sampleRate * 3, b = this.ctx.createBuffer(1, n, this.ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.noise = b; } if (this.ctx.state === 'suspended') this.ctx.resume(); } catch (e) {} },
  // 걸러낸 잡음 한 덩이: type (lowpass · highpass · bandpass), f 주파수 (→ f2로 미끄러짐), 크기, 올라오는 시간, 사라지는 시간, 늦게 시작
  burst({ type = 'lowpass', f = 400, f2 = null, q = 0.7, gain = 0.5, att = 0.005, dec = 0.5, delay = 0 }){
    const c = this.ctx; if (!c || !this.noise) return;
    const t = c.currentTime + delay, src = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    src.buffer = this.noise; src.playbackRate.value = rnd(0.8, 1.2); fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + att + dec); fl.Q.value = q;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + att + dec);
    src.connect(fl).connect(g).connect(c.destination); src.start(t, Math.random() * 1.5); src.stop(t + att + dec + 0.05);
  },
  thump(f = 60, gain = 0.6, dec = 0.5, delay = 0){
    const c = this.ctx; if (!c) return; const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(f * 2, t); o.frequency.exponentialRampToValueAtTime(f * 0.5, t + dec); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dec + 0.05);
  },
  // 천둥: 쩍 (갈라지는 소리) → 쾅 → 우르르릉 (길게 굴러감)
  thunder(){ this.burst({ type: 'highpass', f: 1800, gain: 0.7, dec: 0.18 }); this.burst({ type: 'lowpass', f: 900, f2: 200, gain: 0.9, att: 0.01, dec: 0.6 }); this.thump(55, 0.9, 0.7);
    for (let i = 0; i < 4; i++) this.burst({ type: 'lowpass', f: 260 - i * 30, gain: 0.55 - i * 0.08, att: 0.15, dec: 1.0 + i * 0.4, delay: 0.25 + i * 0.35 }); },
  boom(big = 1){ this.thump(48, 0.8 * big, 0.6 * big); this.burst({ type: 'lowpass', f: 300, f2: 80, gain: 0.7 * big, dec: 0.7 * big }); },
  whoosh(){ this.burst({ type: 'bandpass', f: 300, f2: 2400, q: 1.5, gain: 0.45, att: 0.25, dec: 0.25 }); },
  hit(){ this.burst({ type: 'bandpass', f: 1200, q: 1, gain: 0.25, dec: 0.08 }); this.thump(110, 0.3, 0.12); },
};

/* ---------- 텍스처 ---------- */
const texCache = {};
const texLoader = new THREE.TextureLoader();
function loadTex(src){
  if (texCache[src]) return texCache[src];
  let t;
  if (propAt(src)){ t = new THREE.Texture(); const fill = () => { const c = propCanvas(src); if (!c) return false; t.image = c; t.needsUpdate = true; return true; }; if (!fill()) propWait.push(fill); }
  else t = texLoader.load(src);
  t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  return (texCache[src] = t);
}
/* v0.74 소품 묶음 그림 (src/prop_atlas.js · tools/prop_atlas.py): 낱장 171장 → 3장. 게시 칸 아끼기
   원래 경로 그대로 부르면 됨 — 그림판은 loadTex, 화면 그림 (<img> · CSS)은 artSrc 가 묶음에서 잘라 줌 */
const propSheets = [], propCut = {}, propURL = {}, propWait = [];
function propAt(src){ return typeof PROP_ART !== 'undefined' && PROP_ART.at[src]; }
function propCanvas(src){
  if (propCut[src]) return propCut[src];
  const a = propAt(src), im = a && propSheets[a[0]];
  if (!im || !im.naturalWidth) return null;
  const c = document.createElement('canvas'); c.width = a[3]; c.height = a[4];
  c.getContext('2d').drawImage(im, a[1], a[2], a[3], a[4], 0, 0, a[3], a[4]);
  return (propCut[src] = c);
}
function artSrc(src){
  if (!propAt(src)) return src;
  if (propURL[src]) return propURL[src];
  const c = propCanvas(src); return c ? (propURL[src] = c.toDataURL()) : src;
}
function propLoad(){   // 묶음 그림 불러오기 (preload 가 기다림). crossOrigin 은 three.js TextureLoader 와 같게 — 잘라 쓰는 canvas 가 막히지 않음
  if (typeof PROP_ART === 'undefined') return Promise.resolve();
  return Promise.all(PROP_ART.sheets.map((s, i) => new Promise(res => { const im = new Image(); im.crossOrigin = 'anonymous'; propSheets[i] = im; im.onload = () => (im.decode ? im.decode() : Promise.resolve()).catch(() => {}).then(res); im.onerror = () => res(); im.src = s; })))
    .then(() => { for (const f of propWait.splice(0)) if (!f()) propWait.push(f); });
}
// 빠뜨린 <img> 가 있어도 낱장이 없으면 (게시본) 묶음에서 잘라 다시 넣음
addEventListener('error', e => { const el = e.target; if (!el || el.tagName !== 'IMG') return; const s = el.getAttribute('src'); if (s && propAt(s)){ const u = artSrc(s); if (u !== s) el.src = u; } }, true);
function canvasTex(w, h, draw){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}

/* ---------- 그림 정의 (기존 2D 원화 그대로)
   pose: src · w,h (그림 한 칸 크기) · n (가로 칸 수) · fps · ax,ay (발 기준점) · f (원화가 보는 쪽: 1 오른쪽, -1 왼쪽)
   h0: 대기 그림 속 키 (px), tall: 실제 키 (칸) */
const A = 'assets/';
// 적뢰 팩 묶음 그림의 한 동작: 파일 · 줄 수 · 시작 칸 · 장수 · 초당 장수 · 발 x · 한 번만 · 원화가 보는 쪽 · 발 y
const jr = (file, rows, from, count, fps, ax, once = true, f = -1, ay = 324) => ({ src: 'art/jr/' + file + '.webp', w: 468, h: 328, cols: 8, rows, n: 8 * rows, from, count, fps, ax, ay, f, once });
const SPR = {
  player: { h0: 354, tall: 1.25, poses: {
    idle:   { src: A + 'inju_idle.png',   w: 211, h: 354, n: 20, fps: 4.2, ax: 107, ay: 354, f: -1 },
    walk:   { src: A + 'inju_walk.png',   w: 305, h: 360, n: 8,  fps: 7,   ax: 144, ay: 360, f: 1 },
    run:    { src: A + 'inju_run.png',    w: 393, h: 340, n: 8,  fps: 12,  ax: 193, ay: 340, f: 1 },
    attack: { src: A + 'inju_charge.png', w: 273, h: 267, ax: 141, ay: 267, f: 1 },        // 찌르기: 창을 내지름
    windup: { src: A + 'inju_attack.png', w: 254, h: 337, ax: 125, ay: 337, f: -1 },       // 당김
    aim:    { src: A + 'inju_attack.png', w: 254, h: 337, ax: 125, ay: 337, f: -1 },       // 투창 겨눔
    throw:  { src: A + 'inju_throw.png',  w: 230, h: 338, ax: 118, ay: 338, f: 1 },
    hurt:   { src: A + 'inju_hurt.png',   w: 195, h: 343, ax: 106, ay: 343, f: 1 } } },
  morningstar: { h0: 399, tall: 1.3, poses: { idle: { src: A + 'morningstar.png', w: 316, h: 399, n: 8, fps: 6, ax: 162, ay: 399, f: 1 } } },
  norman: { h0: 330, tall: 1.4, poses: {
    idle:  { src: A + 'norman.png', w: 268, h: 332, n: 16, from: 0, count: 9, fps: 10, ax: 139, ay: 332, f: 1 },
    heal:  { src: A + 'norman.png', w: 268, h: 332, n: 16, from: 9, count: 6, fps: 10, ax: 139, ay: 332, f: 1 },
    shoot: { src: A + 'norman.png', w: 268, h: 332, n: 16, from: 15, count: 1, fps: 1, ax: 139, ay: 332, f: 1 } } },
  swordsman: { h0: 460, tall: 1.9, poses: {
    idle:   { src: A + 'sword_idle.png',   w: 298, h: 460, ax: 197, ay: 460, f: 1 },
    attack: { src: A + 'sword_attack.png', w: 378, h: 451, ax: 209, ay: 430, f: -1 } } },
  spearman: { h0: 460, tall: 1.75, poses: {
    idle:   { src: A + 'spear_idle.png',   w: 384, h: 460, ax: 245, ay: 460, f: -1 },
    attack: { src: A + 'spear_attack.png', w: 386, h: 282, ax: 225, ay: 282, f: -1 } } },
  shieldman: { h0: 440, tall: 1.6, poses: {
    idle:   { src: A + 'shield_idle.png',   w: 340, h: 440, ax: 165, ay: 440, f: 1 },
    windup: { src: A + 'shield_attack.png', w: 357, h: 436, ax: 185, ay: 436, f: 1 } } },
  archer: { h0: 440, tall: 1.85, poses: {
    idle: { src: A + 'archer_idle.png', w: 262, h: 440, ax: 110, ay: 440, f: 1 },
    aim:  { src: A + 'archer_aim.png',  w: 279, h: 432, ax: 145, ay: 432, f: 1 } } },
  brute: { h0: 480, tall: 3.0, poses: {
    idle:   { src: A + 'brute_idle.png',   w: 385, h: 480, ax: 245, ay: 480, f: -1 },
    attack: { src: A + 'brute_attack.png', w: 394, h: 411, ax: 250, ay: 355, f: -1 } } },
  // 적뢰: 적뢰 팩 (2026-10-03). 묶음 그림 = 468x328 칸, 가로 8칸. 발 기준점은 대기 자세의 발 (가운데 x, 아래 y)
  jeokroe: { h0: 250, tall: 3.6, poses: {
    idle:      jr('kick', 5, 0, 12, 9, 290, false),
    prep:      jr('kick', 5, 12, 7, 8.75, 290),
    leap:      jr('kick', 5, 19, 5, 20, 290),
    kick:      jr('kick', 5, 24, 14, 22, 290),
    punchUp:   jr('punch', 3, 4, 5, 14, 233),
    punchHit:  jr('punch', 3, 9, 8, 14, 233),
    raise:     jr('raise', 3, 11, 10, 5, 233),
    raiseEnd:  jr('raise', 3, 21, 3, 8, 233),
    roundUp:   jr('round', 3, 5, 4, 8, 190, true, 1),
    roundHit:  jr('round', 3, 9, 10, 16, 190, true, 1),
    laserUp:   jr('laser', 3, 4, 7, 8, 320),
    laserShot: jr('laser', 3, 11, 8, 12, 320),
    jumpUp:    jr('jlaser', 3, 4, 8, 8, 310),
    jumpShot:  jr('jlaser', 3, 12, 7, 12, 310),
    flyUp:     jr('fspear', 3, 7, 8, 9, 341, true, -1, 312),
    flyShot:   jr('fspear', 3, 15, 7, 10, 341, true, -1, 312),
    fly:       { ...jr('fspear', 3, 0, 7, 8, 341, false, -1, 312), pingpong: true },   // 날고 있음: 날면서 창 던지기의 앞 7장을 왕복 재생
    hurt:      { src: A + 'jeokroe_hurt.png', w: 217, h: 300, ax: 108, ay: 299, f: -1, scale: 0.95 * 250 / 300 } } },
};
// 그림 없는 인물 (레베카 · 허수아비): 캔버스로 대충 그림 (자리 잡기용)
function drawRebecca(g, w, h){
  g.translate(w / 2, h);
  g.fillStyle = '#5a5f6e'; g.fillRect(-26, -150, 52, 95);            // 갑옷 몸
  g.fillStyle = '#7d8394'; g.fillRect(-30, -150, 60, 22);
  g.fillStyle = '#3b3f4a'; g.fillRect(-22, -58, 18, 58); g.fillRect(4, -58, 18, 58);   // 다리
  g.fillStyle = '#f0d4bd'; g.beginPath(); g.arc(0, -178, 24, 0, Math.PI * 2); g.fill();   // 얼굴
  g.fillStyle = '#b3162b'; g.beginPath(); g.ellipse(0, -186, 30, 26, 0, Math.PI, 0); g.fill();   // 루비색 머리
  g.fillRect(-30, -186, 12, 92); g.fillRect(18, -186, 12, 92);
  g.fillStyle = '#2b1d14'; g.fillRect(-9, -180, 5, 5); g.fillRect(5, -180, 5, 5);
  g.strokeStyle = '#d8dce6'; g.lineWidth = 6; g.beginPath(); g.moveTo(30, -110); g.lineTo(62, -10); g.stroke();   // 검
}
function drawDummy(g, w, h){
  g.translate(w / 2, h);
  g.fillStyle = '#5b4026'; g.fillRect(-5, -160, 10, 160);
  g.fillStyle = '#c9a45c'; g.beginPath(); g.ellipse(0, -110, 30, 46, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(0, -168, 20, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#8a6a32'; g.lineWidth = 4; g.beginPath(); g.moveTo(-34, -126); g.lineTo(34, -126); g.stroke();
  g.strokeStyle = '#b3162b'; g.lineWidth = 3; g.beginPath(); g.arc(0, -110, 12, 0, Math.PI * 2); g.stroke();
}
// 레베카: 움직이는 대기 22장 (2026-10-03 원화, 반 크기 314칸 · 가로 8칸). 걷기 · 뛰기 그림도 있음 (도감)
SPR.rebecca = { h0: 305, tall: 1.3, poses: { idle: { src: 'art/char/rebecca_idle.webp', w: 314, h: 314, cols: 8, rows: 3, n: 24, from: 0, count: 22, fps: 9, ax: 171, ay: 310, f: 1 } } };
SPR.dummy = { h0: 190, tall: 1.2, poses: { idle: { canvas: drawDummy, w: 120, h: 190, ax: 60, ay: 190, f: 1 } } };
const SPRITE_SCALE = 1.3;   // 3D에서 조금 크게 (카메라가 멀리 있음)
