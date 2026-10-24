
/* ---------- 맵: 세포 자동자 동굴 · 가장 큰 방만 남김 ---------- */
function genMap(W, H, seed){
  const R = mulberry32(seed), t = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) t[y * W + x] = (x < 2 || y < 2 || x >= W - 2 || y >= H - 2) ? 1 : (R() < 0.45 ? 1 : 0);
  for (let k = 0; k < 5; k++){
    const n = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){
      if (x < 1 || y < 1 || x >= W - 1 || y >= H - 1){ n[y * W + x] = 1; continue; }
      let c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) c += t[(y + dy) * W + x + dx];
      n[y * W + x] = c >= 5 ? 1 : 0;
    }
    t.set(n);
  }
  // 이어진 바닥 덩어리 중 가장 큰 것만
  const reg = new Int32Array(W * H).fill(-1); let best = -1, bestN = 0, id = 0;
  for (let c = 0; c < W * H; c++){
    if (t[c] || reg[c] >= 0) continue;
    const q = [c]; reg[c] = id; let n = 0;
    for (let h = 0; h < q.length; h++){ const p = q[h], x = p % W, y = (p / W) | 0; n++;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx = x + dx, ny = y + dy, np = ny * W + nx; if (!t[np] && reg[np] < 0){ reg[np] = id; q.push(np); } } }
    if (n > bestN){ bestN = n; best = id; } id++;
  }
  for (let c = 0; c < W * H; c++) if (!t[c] && reg[c] !== best) t[c] = 1;
  // 시작 자리: 왼쪽 가운데에 가까운, 사방이 트인 바닥
  let start = null, sd = 1e9;
  for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++){
    let open = true; for (let dy = -1; dy <= 1 && open; dy++) for (let dx = -1; dx <= 1; dx++) if (t[(y + dy) * W + x + dx]){ open = false; break; }
    if (!open) continue; const d = x * 1.0 + Math.abs(y - H / 2) * 0.6; if (d < sd){ sd = d; start = { x: x + 0.5, y: y + 0.5 }; }
  }
  return { W, H, t, seed, start };
}
// 격자 맵: 바위 없는 판. 시작 자리 = 아래 가운데
function gridMap(W, H){ return { W, H, t: new Uint8Array(W * H), seed: 0, start: { x: Math.floor(W / 2) + 0.5, y: H - 1.5 }, grid: true }; }
// 배치에 맞는 맵: 종류 (격자 · 동굴) + 손으로 놓은 바위 (flips: "x,y" 칸을 뒤집음)
// C자 통로 격자: 가운데 (W-4)×H 판 + 양옆에 벽 한 줄 · 통로 한 줄. 벽은 위아래 두 줄씩 뚫려 있어
// 통로가 판 위에서 나가 바깥으로 돌아 아래로 다시 들어옴 (왼쪽 C, 오른쪽 반대 C)
function gridCMap(W, H){
  const m = gridMap(W, H);
  for (let y = 2; y <= H - 3; y++){ m.t[y * W + 1] = 1; m.t[y * W + W - 2] = 1; }
  m.cways = true;
  return m;
}
function buildMap(setup){
  const m = setup.type === 'grid' ? gridMap(setup.W, setup.H) : setup.type === 'gridC' ? gridCMap(setup.W, setup.H) : genMap(setup.W, setup.H, setup.seed);
  for (const k of setup.flips || []){ const [x, y] = k.split(',').map(Number); if (x >= 0 && y >= 0 && x < m.W && y < m.H) m.t[y * m.W + x] ^= 1; }
  terrainOf(m, setup);   // v7.18 언덕 · 더미
  return m;
}
// v7.18 지형: 더미 칸 = 2 (못 지나감 · 낮은 엄폐 — 시야 · 탄은 높이로 봄). rock = 못 지나감 (바위 · 벽 · 더미), solid = 시야 · 탄을 막는 바위 · 벽만
const rock = (m, x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[(y | 0) * m.W + (x | 0)] !== 0;
const solid = (m, x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[(y | 0) * m.W + (x | 0)] === 1 || m.t[(y | 0) * m.W + (x | 0)] === 3;   // v7.19.2 뿌리 벽 (3) 도 시야 · 탄을 막음
const PILE_NM = { 1: '갑옷', 2: '시체', 3: '관', 4: '잔해' };   /* v7.23.1 관 (5S 알현실) · v7.27.0 잔해 (쓰러진 기둥 · 돌무더기) */
const pileAt = (m, x, y) => !m.pk || x < 0 || y < 0 || x >= m.W || y >= m.H ? 0 : m.t[(y | 0) * m.W + (x | 0)] === 2 ? m.pk[(y | 0) * m.W + (x | 0)] || 1 : 0;
// 땅 높이 (M): 언덕 = 가우스 봉우리의 합 (부드러움 · 칸과 상관없음)
const gH = (m, x, y) => { const H = m.hills; if (!H) return 0; let h = 0; for (const k of H){ const dx = x - k.x, dy = y - k.y, q = (dx * dx + dy * dy) / (k.r * k.r); if (q < 9) h += k.h * Math.exp(-q); } return h; };
const gGrad = (m, x, y) => { if (!m.hills) return [0, 0]; const e = 0.25; return [(gH(m, x + e, y) - gH(m, x - e, y)) / (2 * e), (gH(m, x, y + e) - gH(m, x, y - e)) / (2 * e)]; };
// 지형 만들기: 손으로 놓은 언덕 (setup.hills [{x, y, r, h}]) · 더미 (setup.piles ["x,y,종류"]) + 1F 무작위 (terr: '1F' 가끔 언덕 · 갑옷 무더기 · 굳은 시체 / 'hills' 언덕 많이)
function terrainOf(m, setup){
  const hills = (setup.hills || []).map(k => ({ x: +k.x, y: +k.y, r: +k.r || 4, h: +k.h || 1.5 })), piles = [];
  for (const k of setup.piles || []){ const [x, y, t] = String(k).split(',').map(Number); piles.push([x, y, t || 1]); }
  if (setup.terr === '1F' || setup.terr === 'hills'){
    const R = mulberry32(((setup.tseed || 1) * 7919) ^ 0x5eed), many = setup.terr === 'hills';
    const nH = many ? 2 + (R() < 0.5 ? 1 : 0) : R() < 0.45 ? 1 + (R() < 0.25 ? 1 : 0) : 0;
    for (let i = 0; i < nH; i++) hills.push({ x: 3 + R() * (m.W - 6), y: 3 + R() * (m.H - 7), r: 2.8 + R() * 2.8, h: +(1 + R() * 1.4).toFixed(2) });
    const nA = many ? 1 + (R() * 2 | 0) : 2 + (R() * 3 | 0), nC = many ? 1 + (R() * 2 | 0) : 2 + (R() * 3 | 0);
    for (let i = 0; i < nA + nC; i++){ const kind = i < nA ? 1 : 2, n = kind === 1 ? 3 + (R() * 3 | 0) : 1;   // 갑옷 무더기 (3 ~ 5칸이 모임) · 굳은 시체 (한 칸)
      for (let tr = 0; tr < 30; tr++){ const cells = [[2 + (R() * (m.W - 4) | 0), 2 + (R() * (m.H - 7) | 0)]];
        while (cells.length < n){ const c = cells[R() * cells.length | 0], d = [[1, 0], [-1, 0], [0, 1], [0, -1]][R() * 4 | 0], nx = c[0] + d[0], ny = c[1] + d[1]; if (!cells.some(q => q[0] === nx && q[1] === ny)) cells.push([nx, ny]); }
        if (cells.some(([x, y]) => x < 1 || y < 1 || x >= m.W - 1 || y >= m.H - 4 || m.t[y * m.W + x] || piles.some(p => Math.abs(p[0] - x) <= 1 && Math.abs(p[1] - y) <= 1))) continue;
        for (const [x, y] of cells) piles.push([x, y, kind]); break; } }
  }
  m.hills = hills.length ? hills : null; m.pk = null; m.piles = 0; m.stairs = !!setup.stairs && !!m.hills;   /* v9.3.0 계단 (고지대 판정) */
  m.indoor = !!setup.indoor; { const Z = (setup.zones || []).filter(z => z && isFinite(+z.amb)).map(z => ({ x0: Math.max(0, +z.x0 | 0), y0: Math.max(0, +z.y0 | 0), x1: Math.min(m.W - 1, +z.x1 | 0), y1: Math.min(m.H - 1, +z.y1 | 0), amb: Math.max(0, Math.min(1, +z.amb)) })); m.zones = Z.length ? Z : null; }   /* v7.23 실내 (벽이 시야를 자름) · 구역 빛 (맵 일부에만 주변광 — 사막 끝 햇살 등) */
  { const Wt = (setup.water || []).filter(w => w && isFinite(+w.x) && isFinite(+w.y)).map(w => ({ x: +w.x, y: +w.y, rx: Math.max(0.5, +w.rx || 3), ry: Math.max(0.5, +w.ry || 2) })); m.water = Wt.length ? Wt : null; }   // v7.22 얕은 물 (타원)
  const off = new Set(setup.pileOff || []), busy = (x, y) => off.has(x + ',' + y) || (setup.units || []).some(u => Math.floor(u.x) === x && Math.floor(u.y) === y) || (setup.torches || []).some(t => Math.floor(t.x) === x && Math.floor(t.y) === y);   // 누가 서 있는 칸 · 횃불 칸 · 손으로 뺀 칸은 비움
  for (const [x, y, k] of piles){ if (x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[y * m.W + x] === 1 || busy(x, y)) continue; m.pk = m.pk || new Uint8Array(m.W * m.H); m.t[y * m.W + x] = 2; m.pk[y * m.W + x] = k; m.piles++; }
  return m;
}

// 시작에서 바닥으로 걸어서 몇 칸인지 (자리 고를 때 씀)
function walkDist(m, sx, sy){
  const d = new Int32Array(m.W * m.H).fill(-1), s = (sy | 0) * m.W + (sx | 0), q = [s]; d[s] = 0;
  for (let h = 0; h < q.length; h++){ const p = q[h], x = p % m.W, y = (p / m.W) | 0;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const np = (y + dy) * m.W + x + dx; if (!rock(m, x + dx, y + dy) && d[np] < 0){ d[np] = d[p] + 1; q.push(np); } } }
  return d;
}
// 벽에 붙은 횃불: 시작에서 조금 떨어진 곳부터, 서로 멀리
function autoTorches(m, seed, n){
  const R = mulberry32(seed ^ 0x9e3779b9), d = walkDist(m, m.start.x, m.start.y), cand = [];
  for (let y = 1; y < m.H - 1; y++) for (let x = 1; x < m.W - 1; x++){
    const c = y * m.W + x; if (m.t[c] || d[c] < 9) continue;
    if (rock(m, x + 1, y) || rock(m, x - 1, y) || rock(m, x, y + 1) || rock(m, x, y - 1)) cand.push({ x: x + 0.5, y: y + 0.5, k: R() });
  }
  cand.sort((a, b) => a.k - b.k);
  const out = [];
  for (const c of cand){ if (out.length >= n) break; if (out.every(o => Math.hypot(o.x - c.x, o.y - c.y) >= 11)) out.push({ x: c.x, y: c.y }); }
  return out;
}
// 무리 자리: 시작에서 걸어서 멀고, 무리끼리 떨어진 바닥
function groupAnchors(m, seed, n){
  const R = mulberry32(seed ^ 0x51ed27), d = walkDist(m, m.start.x, m.start.y), cand = [];
  for (let c = 0; c < m.W * m.H; c++) if (!m.t[c] && d[c] >= 14) cand.push({ x: c % m.W + 0.5, y: ((c / m.W) | 0) + 0.5, d: d[c], k: R() });
  cand.sort((a, b) => a.k - b.k);
  const out = [];
  for (const c of cand){ if (out.length >= n) break; if (out.every(o => Math.hypot(o.x - c.x, o.y - c.y) >= 9)) out.push(c); }
  out.sort((a, b) => a.d - b.d);   // 가까운 무리부터
  return out;
}
function freeNear(m, x, y, taken){
  for (let r = 0; r < 8; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++){
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
    const tx = (x | 0) + dx, ty = (y | 0) + dy;
    if (!rock(m, tx, ty) && !taken.has(tx + ',' + ty)){ taken.add(tx + ',' + ty); return { x: tx + 0.5, y: ty + 0.5 }; }
  }
  return { x, y };
}

/* ---------- 시야 · 빛 ---------- */
function losClear(m, x0, y0, x1, y1){
  const dx = x1 - x0, dy = y1 - y0, n = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * 2.5);
  for (let i = 1; i < n; i++){ const t = i / n; if (solid(m, x0 + dx * t, y0 + dy * t)) return false; }   // v7.18 더미는 높이로 따로 봄 (expoOf)
  return true;
}
function lightSources(W){
  const L = [];
  for (const h of W.units) if (h.torch && h.alive && !h.torchOff) L.push({ x: h.x, y: h.y, r: W.rules.heroLight * (W.torchK && h.side === 0 ? W.torchK : 1), f: 0 });   /* v8.7.7 여신의 눈물 — 횃불이 더 밝음 (torchK) */   // 횃불을 든 이 (처음엔 주인공)   // v7.5 끈 횃불은 안 비춤
  W.torches.forEach((t, i) => { if (!t.off) L.push({ x: t.x, y: t.y, r: t.r || W.rules.torchLight, f: i + 1 }); });   // v7.8 모닥불 · 장작은 제 반경
  return L;
}
function computeLight(W){
  const m = W.map, Lm = W.light; Lm.fill(W.amb || 0);   // v7.22.2 주변광 (밝은 맵)
  if (m.zones) for (const z of m.zones) for (let y = z.y0; y <= z.y1; y++) for (let x = z.x0; x <= z.x1; x++){ const i = y * m.W + x; if (z.amb > Lm[i]) Lm[i] = z.amb; }   /* v7.23 구역 빛 */
  for (const s of lightSources(W)){
    const r = s.r * (1 + 0.035 * Math.sin(W.t * 11 + s.f * 2.1) + 0.02 * Math.sin(W.t * 23 + s.f)), r2 = r * Math.max(1, W.rules.dimR || 1);   // v7.7 어스름 띠
    const x0 = Math.max(0, Math.floor(s.x - r2)), x1 = Math.min(m.W - 1, Math.ceil(s.x + r2)), y0 = Math.max(0, Math.floor(s.y - r2)), y1 = Math.min(m.H - 1, Math.ceil(s.y + r2));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++){
      const cx = x + 0.5, cy = y + 0.5, d = Math.hypot(cx - s.x, cy - s.y); if (d > r2) continue;
      if (d > 1.2){
        // 벽 칸은 앞면까지 비춤: 벽이면 빛 쪽으로 반 칸 당긴 점까지 막힘 확인
        const tx = m.t[y * m.W + x] === 1 ? cx - (cx - s.x) / d * 0.6 : cx, ty = m.t[y * m.W + x] === 1 ? cy - (cy - s.y) / d * 0.6 : cy;
        if (!losClear(m, s.x, s.y, tx, ty)) continue;
      }
      const v = d <= r ? Math.pow(1 - d / r, 0.75) : DIM + (LIT * 0.9 - DIM) * (1 - (d - r) / Math.max(0.01, r2 - r));   // v7.7 빛 밖 = 어스름 (LIT 아래)
      const i = y * m.W + x; if (v > Lm[i]) Lm[i] = v;
    }
  }
}
const litAt = (W, x, y) => W.light[(y | 0) * W.map.W + (x | 0)] > LIT;
const glowAt = (W, x, y) => W.light[(y | 0) * W.map.W + (x | 0)] > DIM;   // v7.7 빛 또는 어스름 (실루엣이라도 보임)
function canSee(W, u, t){
  const d = Math.hypot(u.x - t.x, u.y - t.y);
  if (W.camp && W.t < (W.rules.see0 != null ? W.rules.see0 : 0.3) && !W.duel && t.side !== u.side && d > (u.r || 0) + (t.r || 0) + 0.35) return false;   /* v8.7.3 여정 맵에 들어선 첫 0.3초는 발견 없음 (양쪽 같음) — 몸이 닿은 것만 (훈련장은 그대로) */
  if (u.radar && t.rpT && t.side !== u.side && t.rpT[u.side] > W.t && d <= ((W.rules.radar || {}).r || 14)) return true;   /* v8.4.0 [레이더] */
  if (d > W.rules.sight + (W.map.hills ? (TER(W).sightHi != null ? TER(W).sightHi : 0.6) * Math.abs(gH(W.map, u.x, u.y) - gH(W.map, t.x, t.y)) : 0)) return false;   // v7.18 높이차만큼 멀리 보고 · 멀리서 보임
  if (u.smell && d <= u.smell) return true;   // 높은후각: 빛 · 바위와 상관없이 냄새로 앎
  if (t.lie && !t.lieSw && !W.lieOff && t.side !== u.side && lieHid(W, u, t, d)) return false;   // v7.11 엎드린 몸: 아직 모르는 눈에는 가까이서만 (후각은 위에서 먼저 맡음 · 몸이 닿아도 모름 — 밟을 수 있음)
  if (d <= (u.r || 0) + (t.r || 0) + 0.35 && (u.face == null || u.heads > 1 || sideV(W, u, t) !== 'back')) return true;   // v4.0: 몸이 닿을 만큼 붙으면 어둠 속에서도 앎 (v4.1: 등 뒤는 모름)
  if (u.blind) return false;   // v5.5 실명: 몸에 닿는 것만 앎
  if (u.blindL && d > 1 && u.face != null){ const ra = Math.atan2(t.y - u.y, t.x - u.x) - u.face, s = Math.atan2(Math.sin(ra), Math.cos(ra)); if (s < -0.35 && s > -2.6) return false; }   // v6.7 [실명:좌안] 왼쪽 옆 (20° ~ 150°) 은 1칸 밖이 안 보임 (사각)
  if (u.sightMul != null && u.sightMul < 1 && d > W.rules.sight * u.sightMul) return false;   // v5.5 눈을 잃음: 보는 거리 ×
  const sk0 = t.side !== u.side ? Math.min(1, stealthK(W, t) * (u.spotK || 1)) : 1, sk = sk0 < 1 && lookOn(W, u) && sideOf(W, u, t) === 'back' ? sk0 * ((W.rules.watch || {}).glance || 0.6) : sk0; if (sk < 1 && d > W.rules.sight * sk) return false;   // v7.5 은신: 들킬 거리 ×   // v7.7 잠깐 돌아본 눈은 덜 멀리 (glance)
  if (sk < 1 && (W.rules.stealth || {}).back && u.face != null && !(u.heads > 1) && sideV(W, u, t) === 'back') return false;   // v7.7 돌아보는 중이면 그쪽   // v7.6 숨은 몸은 등 뒤에서는 안 보임 (후각은 위에서 먼저 맡음)
  if (!litAt(W, t.x, t.y) && glowAt(W, t.x, t.y) && glareAt(W, u) && d > W.rules.sight * sk * (W.rules.glare.dim || 0.8)) return false;
  if (!glowAt(W, t.x, t.y)){ if (!u.nv) return false; const sp = sk >= 1 && t.stealthG && t.side !== u.side ? stealthP(W, t) : 1, sq = sk * sp; /* v7.14 숨지 않아도 은신 등급만큼 어둠 속에선 덜 멀리 보임 */ if (sp < 1 && d > W.rules.sight * sp) return false; if (glareAt(W, u) && d > glareReach(W, u) * sq) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5) * sq) return false; if (u.nvG === 'C' && d > (W.rules.nvC || 3.75) * sq) return false; if (u.nvG === 'D' && d > (W.rules.nvD || 2.5) * sq) return false; }   // 야시 B 는 어둠 속에선 nvB 칸까지   // v7.8 화광 실명: 밝은 빛 속에 선 눈은 빛 · 어스름 밖 어둠을 glareReach 까지만   // 야시 B 는 어둠 속에선 nvB 칸까지   // v7.8 화광 실명: 밝은 빛 속에 선 눈은 빛 · 어스름 밖 어둠을 glareReach 까지만
  // v5.1 큰 몸 (키 2.2M 넘음, 예: 3M 카리우스) 이 시야를 가림 — 아군 · 적 모두. 보는 쪽과 대상 사이 (양 끝은 빼고) 줄 가까이에 서 있으면 안 보임.
  // 가리는 폭 = 몸 반지름 × giantBlock × (키 차이에 따라 0 ~ 1): 키 차이 (가리는 몸 − 보는 쪽 · 대상 중 큰 쪽) 가 tallBlock[0] 아래면 안 가림, tallBlock[1] 이상이면 다 가림
  if (W.giants) for (const g of W.giants){
    if (!g.alive || g === u || g === t) continue;
    const TB = W.rules.tallBlock || [0.5, 1], dh = g.h - Math.max(u.h || 1.7, t.h || 1.7); if (dh < TB[0]) continue;
    const vx = t.x - u.x, vy = t.y - u.y, L2 = vx * vx + vy * vy || 1, k = ((g.x - u.x) * vx + (g.y - u.y) * vy) / L2;
    if (k > 0.05 && k < 0.95 && Math.hypot(g.x - u.x - vx * k, g.y - u.y - vy * k) < g.r * (W.rules.giantBlock || 0.7) * Math.min(1, (dh - TB[0]) / Math.max(0.01, TB[1] - TB[0]))) return false;
  }
  return d < 1.2 || (losClear(W.map, u.x, u.y, t.x, t.y) && (!terrOn(W) || expoOf(W, u, t) > (TER(W).seeMin != null ? TER(W).seeMin : 0.05)));   // v7.18 언덕 마루 · 더미 뒤 (웅크리면 다 가려짐)
}

/* ---------- 길찾기: 8방향 BFS (모서리 넘어가기 없음), 가는 길에 직선이 트이면 질러감 ---------- */
const DIR8 = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function findPath(m, sx, sy, gx, gy, maxN, cr){
  const W = m.W, s = (sy | 0) * W + (sx | 0); let g = (gy | 0) * W + (gx | 0);
  const big = cr > 0.55, no = big ? (x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || !bigOk(m, x + 0.5, y + 0.5, cr) : (x, y) => rock(m, x, y);   /* v8.7.4 큰 몸: 몸이 들어가는 칸만 */
  if (rock(m, gx, gy)) return null;
  if (s === g) return [];
  const prev = new Int32Array(m.W * m.H).fill(-1); prev[s] = s; const q = [s]; let best = s, bd = Math.hypot((s % W) + 0.5 - gx, ((s / W) | 0) + 0.5 - gy);
  const back = c => { const path = []; while (c !== s){ path.push({ x: c % W + 0.5, y: ((c / W) | 0) + 0.5 }); c = prev[c]; } return path.reverse(); };
  for (let h = 0; h < q.length && h < (maxN || 4000); h++){
    const p = q[h], x = p % W, y = (p / W) | 0;
    for (const [dx, dy] of DIR8){
      const nx = x + dx, ny = y + dy; if (no(nx, ny)) continue;
      if (dx && dy && (no(x + dx, y) || no(x, y + dy))) continue;
      const np = ny * W + nx; if (prev[np] >= 0) continue; prev[np] = p; q.push(np);
      if (np === g) return back(g);
      if (big){ const d = Math.hypot(nx + 0.5 - gx, ny + 0.5 - gy); if (d < bd){ bd = d; best = np; } }
    }
  }
  return big && best !== s ? back(best) : null;   // 큰 몸: 목표 칸에 몸이 안 들어가면 가장 가까이 닿는 칸까지
}

