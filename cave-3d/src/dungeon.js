/* dungeon.js v1.0 — 원정 층 만들기
   · 절차 생성: 방 7 ~ 11개 (겹치지 않게) + 2칸 복도 (가장 짧게 잇고 + 고리 몇 개) → 글자 지도 → buildWorld (굴 · 1층과 같은 판)
   · 방 종류: 시작 (귀환 줄) · 계단 (가장 먼 방) · 싸움 · 강적 · 보물 · 쉼터 (모닥불) · 무덤 (1층) · 제단 (4층)
   · 층 테마 10: 땅 · 벽 · 빛 색 · 적 · 소품 (도감 소품 75종, art/dun)
   · 어둠: 바닥 · 벽은 횃불 · 촛대 빛으로만 밝음, 인물 · 소품 그림은 빛까지의 거리로 어둡게. 걸은 곳만 지도에 */
'use strict';
const DA = 'art/dun/';
// 층마다: name · sub · 색 · 적 (가중치) · 강적 · 방 수 · 소품 · 빛 소품
const FLOOR_DEF = [null,
  { name: '무덤 어귀', sub: '회색 대지 · 무덤 · 촛불', floor: 0x46434d, wall: 0x2b2831, pillar: 0x56515f, glow: 0xffb070,
    foes: { swordsman: 3, spearman: 3, shieldman: 2, foeJelly: 1 }, elite: ['brute'], rooms: [7, 9], graves: 3,
    props: ['H-007', 'H-027', 'H-052', 'H-191', 'H-205', 'H-283', 'H-009', 'H-289', 'H-287', 'H-195', 'H-074', 'H-286'], lights: ['H-101', 'H-236', 'H-196'] },
  { name: '뼈의 회랑', sub: '좁은 회랑 · 뼈 무더기 · 궁수 진형', floor: 0x4a4440, wall: 0x2c2724, pillar: 0x5a524c, glow: 0xffa060,
    foes: { archer: 3, shieldman: 3, spearman: 2, foeDevil: 1 }, elite: ['brute'], rooms: [8, 9],
    props: ['H-056', 'H-169', 'H-194', 'H-207', 'H-289', 'H-009', 'H-286', 'H-179', 'H-119', 'H-168'], lights: ['H-206', 'H-107', 'H-158'] },
  { name: '젖은 묘지', sub: '비 · 물웅덩이 · 늪', floor: 0x3c4446, wall: 0x262d30, pillar: 0x4c585a, glow: 0x9fd0ff, wet: true,
    foes: { foeSlime: 3, foeJelly: 3, foeFairy: 2, swordsman: 1 }, elite: ['brute'], rooms: [8, 10], graves: 2,
    props: ['H-027', 'H-049', 'H-288', 'H-198', 'H-372', 'H-137', 'H-200', 'H-202', 'H-205'], lights: ['H-293', 'H-236', 'H-196'] },
  { name: '지하 예배당', sub: '제단 · 촛대 · 핏자국', floor: 0x463c44, wall: 0x2c232b, pillar: 0x5c4c58, glow: 0xff8a6a,
    foes: { foeCultist: 4, foeDevil: 3, swordsman: 2, archer: 1 }, elite: ['brute'], rooms: [8, 10], altar: true,
    props: ['H-033', 'H-109', 'H-159', 'H-201', 'H-031', 'H-053', 'H-058', 'H-197', 'H-153', 'H-105', 'H-160'], lights: ['H-101', 'H-196', 'H-206'] },
  { name: '세자르의 알현실', sub: '관 · 신성 봉인 · 기둥', floor: 0x4c4650, wall: 0x2e2834, pillar: 0x66606e, glow: 0xffd8a0,
    foes: { swordsman: 3, shieldman: 3, archer: 2, foeCultist: 2 }, elite: ['brute', 'brute'], rooms: [8, 10],
    props: ['H-198', 'H-049', 'H-288', 'H-195', 'H-058', 'H-153', 'H-166', 'H-023'], lights: ['H-101', 'H-206', 'H-196'] },
  { name: '안개 늪', sub: '안개 · 진흙 · 도깨비불', floor: 0x3a4238, wall: 0x232a22, pillar: 0x4a5448, glow: 0x9fffb0, fog: 0.75, wet: true,
    foes: { foeSlime: 3, foeFairy: 3, foeJelly: 2, archer: 2 }, elite: ['brute'], rooms: [9, 10],
    props: ['H-137', 'H-200', 'H-202', 'H-372', 'H-151', 'H-074', 'H-193'], lights: ['H-293', 'H-236'] },
  { name: '도깨비 시장', sub: '등불 · 노점 · 북소리', floor: 0x4a3c34, wall: 0x2e231c, pillar: 0x5e4a3c, glow: 0xffc070,
    foes: { foeDevil: 4, foeCultist: 2, swordsman: 2, archer: 2 }, elite: ['brute'], rooms: [9, 11],
    props: ['H-130', 'H-115', 'H-254', 'H-255', 'H-110', 'H-165', 'H-117'], lights: ['H-158', 'H-107', 'H-206'] },
  { name: '쇠의 진지', sub: '목책 · 깃발 · 진형', floor: 0x44403c, wall: 0x2a2622, pillar: 0x585048, glow: 0xffa050,
    foes: { shieldman: 4, spearman: 3, archer: 3, swordsman: 2 }, elite: ['brute', 'brute'], rooms: [9, 11],
    props: ['H-006', 'H-021', 'H-047', 'H-117', 'H-119', 'H-165', 'H-168', 'H-057'], lights: ['H-158', 'H-206'] },
  { name: '눈알의 굴', sub: '짙은 어둠 · 지껄임', floor: 0x3a3442, wall: 0x221d29, pillar: 0x4a4256, glow: 0xd08aff, dark: 0.7,
    foes: { foeCultist: 3, foeDevil: 3, foeSlime: 2, archer: 2 }, elite: ['brute', 'brute'], rooms: [9, 11],
    props: ['H-160', 'H-156', 'H-105', 'H-109', 'H-033', 'H-327', 'H-008'], lights: ['H-196', 'H-293'] },
  { name: '대장군의 전장', sub: '넓은 벌판 · 깃발 · 군단', floor: 0x48423a, wall: 0x2c2620, pillar: 0x5c5448, glow: 0xffa040,
    foes: { swordsman: 3, spearman: 3, shieldman: 3, archer: 3 }, elite: ['brute', 'brute'], rooms: [10, 12],
    props: ['H-006', 'H-021', 'H-165', 'H-117', 'H-166', 'H-023', 'H-110', 'H-057'], lights: ['H-158', 'H-206'] },
];
const FOE_XP = { swordsman: 12, spearman: 12, shieldman: 15, archer: 12, brute: 55, foeJelly: 7, foeDevil: 8, foeFairy: 8, foeSlime: 10, foeCultist: 9 };
const FOE_DEF = { swordsman: 3, spearman: 3, shieldman: 8, archer: 1, brute: 12, foeJelly: 0, foeDevil: 1, foeFairy: 0, foeSlime: 2, foeCultist: 1 };
const HOLY_FOE = new Set(['foeCultist', 'foeDevil']);   // 신 계열 (신성 특공)

// 시드 난수
function rngOf(seed){
  let a = seed >>> 0;
  const f = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));
  f.pick = arr => arr[Math.floor(f() * arr.length)];
  f.wpick = obj => { const ks = Object.keys(obj), tot = ks.reduce((s, k) => s + obj[k], 0); let r = f() * tot; for (const k of ks){ r -= obj[k]; if (r <= 0) return k; } return ks[0]; };
  return f;
}

/* ---------- 층 만들기 ---------- */
function genDungeon(F, seed){
  const R = rngOf(seed), D = FLOOR_DEF[Math.min(F, FLOOR_DEF.length - 1)];
  const W = Math.min(60, 42 + F * 2), H = W;
  const g = Array.from({ length: H }, () => new Array(W).fill('#'));
  const nRooms = R.int(D.rooms[0], D.rooms[1]), rooms = [];
  for (let tries = 0; rooms.length < nRooms && tries < 600; tries++){
    const w = R.int(6, 11), h = R.int(6, 9), x = R.int(2, W - w - 3), z = R.int(2, H - h - 3);
    if (rooms.some(r => x < r.x + r.w + 3 && x + w + 3 > r.x && z < r.z + r.h + 3 && z + h + 3 > r.z)) continue;
    rooms.push({ id: rooms.length, x, z, w, h, cx: x + (w - 1) / 2, cz: z + (h - 1) / 2, type: 'fight', links: [] });
  }
  for (const r of rooms) for (let j = r.z; j < r.z + r.h; j++) for (let i = r.x; i < r.x + r.w; i++) g[j][i] = '.';
  // 잇기: 가장 짧은 나무 (Prim) + 고리 몇 개
  const dd = (a, b) => Math.abs(a.cx - b.cx) + Math.abs(a.cz - b.cz), edges = [], inT = new Set([0]);
  while (inT.size < rooms.length){
    let best = null;
    for (const i of inT) for (const r of rooms) if (!inT.has(r.id)){ const d = dd(rooms[i], r); if (!best || d < best.d) best = { a: i, b: r.id, d }; }
    edges.push(best); inT.add(best.b);
  }
  for (let i = 0; i < rooms.length; i++) for (let j = i + 1; j < rooms.length; j++){
    if (edges.some(e => (e.a === i && e.b === j) || (e.a === j && e.b === i))) continue;
    if (dd(rooms[i], rooms[j]) < 22 && R() < 0.16) edges.push({ a: i, b: j, d: dd(rooms[i], rooms[j]) });
  }
  const carve = (i, j) => { for (let dj = 0; dj < 2; dj++) for (let di = 0; di < 2; di++){ const x = i + di, z = j + dj; if (x > 0 && z > 0 && x < W - 1 && z < H - 1 && g[z][x] === '#') g[z][x] = ','; } };
  for (const e of edges){
    const a = rooms[e.a], b = rooms[e.b]; a.links.push(b.id); b.links.push(a.id);
    let x = Math.round(a.cx), z = Math.round(a.cz); const tx = Math.round(b.cx), tz = Math.round(b.cz), hFirst = R() < 0.5;
    const stepX = () => { while (x !== tx){ carve(x, z); x += Math.sign(tx - x); } }, stepZ = () => { while (z !== tz){ carve(x, z); z += Math.sign(tz - z); } };
    if (hFirst){ stepX(); stepZ(); } else { stepZ(); stepX(); }
    carve(x, z);
  }
  // 방 종류: 시작 = 가장자리에 가까운 방, 계단 = 시작에서 (방 그래프로) 가장 먼 방
  const start = rooms.reduce((b, r) => (r.cx + r.cz < b.cx + b.cz ? r : b), rooms[0]);
  const dist = new Map([[start.id, 0]]), q = [start.id];
  while (q.length){ const c = q.shift(); for (const n of rooms[c].links) if (!dist.has(n)){ dist.set(n, dist.get(c) + 1); q.push(n); } }
  const byFar = rooms.slice().sort((a, b) => dist.get(b.id) - dist.get(a.id) || dd(b, start) - dd(a, start));
  const stairs = byFar[0];
  start.type = 'start'; stairs.type = 'stairs';
  const rest = rooms.filter(r => r.type === 'fight' && r !== start && r !== stairs);
  const take = (type, n, pref) => { for (let k = 0; k < n && rest.length; k++){ const pool = pref ? rest.filter(pref) : rest; const r = (pool.length ? pool : rest)[Math.floor(R() * (pool.length ? pool : rest).length)]; r.type = type; rest.splice(rest.indexOf(r), 1); } };
  take('elite', 1, r => dist.get(r.id) >= 2);
  take('treasure', R() < 0.5 ? 2 : 1, r => r.links.length === 1);   // 막다른 방이 보물방
  if (rooms.length >= 7) take('rest', 1, r => dist.get(r.id) >= 2);
  if (D.graves) take('graves', 1);
  if (D.altar) take('altar', 1);
  // 꾸밈: 큰 방에 기둥, 가끔 바위 (문을 막지 않게 벽에서 한 칸 띄움)
  for (const r of rooms){
    if (r.w >= 9 && r.h >= 8 && r.type !== 'start' && R() < 0.6) for (const [i, j] of [[r.x + 2, r.z + 2], [r.x + r.w - 3, r.z + 2], [r.x + 2, r.z + r.h - 3], [r.x + r.w - 3, r.z + r.h - 3]]) g[j][i] = 'o';
    if (r.type === 'fight' && R() < 0.5){ const i = R.int(r.x + 2, r.x + r.w - 3), j = R.int(r.z + 2, r.z + r.h - 3); if (g[j][i] === '.') g[j][i] = 'r'; }
  }
  // 복도 표시 (,)는 바닥으로
  const rows = g.map(row => row.join('').replace(/,/g, '.'));
  return { F, W, H, rows, rooms, start, stairs, R, D, dist };
}

/* ---------- 그림 (빌보드 소품): 카메라 각도만 봄, 빛까지 거리로 어둡게 ---------- */
const DUN = { bills: [], lights: [], sources: [], plights: [], torch: null, seen: null, mm: null, items: [] };
function dbill(src, x, z, h, o = {}){
  const t = loadTex(src);
  const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.25, side: THREE.DoubleSide, fog: true });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  const g = new THREE.Group(); g.add(m); g.position.set(x, (o.y || 0) + heightAt(G.map, x, z), z);
  G.scene.add(g); G.props.push(g);
  const b = { g, m, t, h, x, z, sized: false, fit: o.fit || 0, tint: o.tint || 0.92, glow: o.glow || 0, flat: !!o.flat };
  if (o.flat){ m.rotation.x = -Math.PI / 2; }
  DUN.bills.push(b); return b;
}
function sizeDBills(){
  for (const b of DUN.bills){
    if (!b.sized && b.t.image && b.t.image.width){
      const r = b.t.image.width / b.t.image.height; let h = b.h, w = h * r;
      if (b.fit && w > b.fit){ w = b.fit; h = w / r; }
      b.m.scale.set(w, h, 1); b.m.position.y = b.flat ? 0.02 : h / 2; b.sized = true; b.w = w;
    }
    if (!b.flat) b.g.rotation.y = CAM.yaw;
  }
}
// 빛: 횃불 (인주) + 방의 촛대 · 화로. 가까운 몇 개만 진짜 점광원 (무거움), 나머지는 그림 밝기로만
function addSource(x, z, r, color, k = 1, y = 1.6){ const s = { x, z, r, color, k, y, flick: rnd(0, 6) }; DUN.sources.push(s); return s; }
function lightAt(x, z){
  let L = DUN.amb;
  for (const s of DUN.sources){ const d = Math.hypot(s.x - x, s.z - z); if (d < s.r) L += Math.pow(1 - d / s.r, 1.3) * s.k; }
  const tc = DUN.torchSrc; if (tc){ const d = Math.hypot(tc.x - x, tc.z - z); if (d < tc.r) L += Math.pow(1 - d / tc.r, 1.1) * tc.k; }
  return Math.min(1.1, L);
}
function setupDarkness(D){
  DUN.amb = 0.05 * (D.dark ? 0.6 : 1);
  hemi.intensity = 0.1 * (D.dark ? 0.6 : 1); hemi.color.setHex(0x8a90b8); hemi.groundColor.setHex(0x120c10);
  moon.intensity = 0.0;
  // 인주 횃불: 진짜 빛 (그림자 없음)
  const t = new THREE.PointLight(0xffb070, 1.4, 10, 2); G.scene.add(t); G.props.push(t); DUN.torch = t;
  // 방 빛 6개 (가까운 촛대에 붙임)
  DUN.plights = [];
  for (let i = 0; i < 6; i++){ const l = new THREE.PointLight(0xffa060, 0, 6, 2); G.scene.add(l); G.props.push(l); DUN.plights.push(l); }
}
function tickLights(dt, vision, lit){
  const pl = G.player; if (!pl) return;
  const fl = 0.88 + Math.sin(G.t * 11) * 0.05 + Math.sin(G.t * 23.7) * 0.04 + Math.random() * 0.05;
  const r = lit ? vision : 2.2;
  DUN.torch.position.set(pl.x, pl.y + 2.1 + (pl.jy || 0), pl.z);
  DUN.torch.distance = r * 2.1; DUN.torch.intensity = (lit ? 1.5 : 0.45) * fl;
  DUN.torch.color.setHex(lit ? 0xffb070 : 0x8890c0);
  DUN.torchSrc = { x: pl.x, z: pl.z, r: r * 1.15, k: (lit ? 1.0 : 0.55) * fl };
  // 가까운 빛 6개에 점광원
  DUN.pT = (DUN.pT || 0) - dt;
  if (DUN.pT <= 0){
    DUN.pT = 0.4;
    const near = DUN.sources.slice().sort((a, b) => Math.hypot(a.x - pl.x, a.z - pl.z) - Math.hypot(b.x - pl.x, b.z - pl.z)).slice(0, DUN.plights.length);
    DUN.plights.forEach((l, i) => { const s = near[i]; l.userData.s = s || null; if (s){ l.position.set(s.x, s.y, s.z); l.color.setHex(s.color); l.distance = s.r * 1.7; } });
  }
  for (const l of DUN.plights){ const s = l.userData.s; l.intensity = s ? 0.95 * s.k * (0.85 + 0.15 * Math.sin(G.t * 9 + s.flick)) : 0; }
  for (const s of DUN.sources) if (s.flame){ s.flame.scale.set(0.9 + Math.sin(G.t * 9 + s.flick) * 0.08, 1 + Math.random() * 0.12, 1); s.flame.rotation.y = CAM.yaw; }
  // 그림 밝기: 인물 · 소품
  for (const u of G.units){
    if (u.dead && !u.fading) continue;
    const L = lightAt(u.x, u.z), base = u.mat.color.r;   // updateSprite가 0.92 (+ 번쩍)으로 둠
    u.mat.color.multiplyScalar(Math.max(0.06, L));
    u.dark = L < 0.16 && u.side === 'enemy';
    if (u.tag) u.tag.style.opacity = L < 0.2 ? 0.35 : 1;
  }
  for (const b of DUN.bills){ if (b.glow) continue; const L = lightAt(b.x, b.z); b.m.material.color.setScalar(b.tint * Math.max(0.05, L)); }
  for (const it of DUN.items){ if (!it.m) continue; const L = Math.max(0.35, lightAt(it.x, it.z)); it.m.material.color.setScalar(Math.min(1, L + 0.15)); }
}

/* ---------- 걸은 곳 (지도) ---------- */
function revealAround(x, z, r){
  const m = G.map, S = DUN.seen; if (!S) return;
  const i0 = Math.round(x), j0 = Math.round(z), R2 = Math.ceil(r);
  for (let j = j0 - R2; j <= j0 + R2; j++) for (let i = i0 - R2; i <= i0 + R2; i++){
    if (i < 0 || j < 0 || i >= m.w || j >= m.h) continue;
    const k = j * m.w + i; if (S[k]) continue;
    if ((i - x) * (i - x) + (j - z) * (j - z) > r * r) continue;
    if (m.solid[k] && !m.low[k]){   // 벽: 바로 옆 바닥이 보이면 그림
      if (losClear(m, x, z, i + Math.sign(x - i) * 0.6, j + Math.sign(z - j) * 0.6)) S[k] = 2;
      continue;
    }
    if (losClear(m, x, z, i, j)) S[k] = 1;
  }
}
function drawMinimap(big){
  const cv = big ? document.getElementById('bigmap') : document.getElementById('minimap'); if (!cv || !G.map || !DUN.seen) return;
  const m = G.map, s = big ? Math.floor(Math.min(innerWidth * 0.8, innerHeight * 0.8) / m.w) : 3;
  if (cv.width !== m.w * s){ cv.width = m.w * s; cv.height = m.h * s; }
  const c = cv.getContext('2d'); c.clearRect(0, 0, cv.width, cv.height);
  c.fillStyle = 'rgba(8,6,10,.82)'; c.fillRect(0, 0, cv.width, cv.height);
  const S = DUN.seen, all = EXP && EXP.reveal;
  for (let j = 0; j < m.h; j++) for (let i = 0; i < m.w; i++){
    const k = j * m.w + i, v = S[k] || (all && !m.solid[k] ? 3 : 0); if (!v) continue;
    c.fillStyle = v === 2 ? '#5a5260' : v === 3 ? '#2e2a34' : m.solid[k] ? '#6a6070' : '#a8a0ac';
    c.fillRect(i * s, j * s, s, s);
  }
  const dotAt = (x, z, col, r) => { c.fillStyle = col; c.beginPath(); c.arc((x + 0.5) * s, (z + 0.5) * s, r, 0, 6.3); c.fill(); };
  for (const mk of DUN.marks || []){
    const k = Math.round(mk.z) * m.w + Math.round(mk.x); if (!S[k] && !(all && mk.always) && !mk.known) continue;
    c.fillStyle = mk.col; c.font = `bold ${big ? 16 : 9}px sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(mk.icon, (mk.x + 0.5) * s, (mk.z + 0.5) * s);
  }
  for (const u of G.units){
    if (u.dead) continue;
    if (u.side === 'ally') dotAt(u.x, u.z, u === G.player ? '#ffd35a' : '#7fd0ff', big ? 5 : 2.2);
    else if (u.side === 'enemy' && (G.t - (u.visT || -9) < 0.6 || (EXP && EXP.radar))) dotAt(u.x, u.z, '#ff4a3a', big ? 4 : 1.8);
  }
}
