# v7.18.0 엔진 — patch718.py v1.3 (v1.3: 무작위 더미 중 뺀 칸 (setup.pileOff) · v1.2: 미끄러져 멈추면 그 걸음은 끝 (길이 없어짐) · v1.1: 갑옷 무더기 1.1M · 웅크림 ×0.55 — 웅크리면 무더기 뒤에 다 가려짐 · 1F 1.5단계: 언덕 (가우스 봉우리 · 높이 M) · 더미 (갑옷 무더기 · 굳은 시체 — 못 지나가는 낮은 엄폐) · 몸 높이 (서 있음 · 웅크림 = 은신 · 엎드림) · 드러난 몫 (높이 시야) · 엄폐에 막힘 · 고저 보정 (명중 · 근접 · 시야) · 오르막 느림 · 비탈에서 미끄러짐)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

# ---------- 수치표 ----------
h = rd('rt3_head.js')
h = rep(h, "  reachB: { k: 0.25, lo: -0.1, hi: 0.25 },   /* v7.17 몸 리치: 든 근접 무기 사거리 + k × (키 − 1.7) (lo ~ hi) */",
        """  reachB: { k: 0.25, lo: -0.1, hi: 0.25 },   /* v7.17 몸 리치: 든 근접 무기 사거리 + k × (키 − 1.7) (lo ~ hi) */
  terrain: { crouch: 0.55, lieH: 0.45, pileH: { 갑옷: 1.1, 시체: 0.6 }, seeMin: 0.05, sightHi: 0.6, cov0: 0.2, arcCov: 0.8, aimHi: 0.05, meleeHi: 0.08, climb: 0.8, down: 0.1, tripS: 0.3, trip: 0.12, tripT: 0.8 },   /* v7.18 지형: 웅크림 키 × · 엎드림 키 · 더미 높이 · 보일 최소 몫 · 높이차 1M 당 시야 + · 엄폐 명중 (cov0 + 드러난 몫) · 곡사는 arcCov 까지 · 높이차 1M 당 명중 · 근접 · 오르막 느림 · 내리막 · 미끄러지는 기울기 · 확률 · 넘어짐 초 */""")
wr('rt3_head.js', h)

# ---------- 맵: 지형 · 시야 ----------
m = rd('rt3_mid.js')
m = rep(m, """  for (const k of setup.flips || []){ const [x, y] = k.split(',').map(Number); if (x >= 0 && y >= 0 && x < m.W && y < m.H) m.t[y * m.W + x] ^= 1; }
  return m;
}
const rock = (m, x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[(y | 0) * m.W + (x | 0)] === 1;""",
"""  for (const k of setup.flips || []){ const [x, y] = k.split(',').map(Number); if (x >= 0 && y >= 0 && x < m.W && y < m.H) m.t[y * m.W + x] ^= 1; }
  terrainOf(m, setup);   // v7.18 언덕 · 더미
  return m;
}
// v7.18 지형: 더미 칸 = 2 (못 지나감 · 낮은 엄폐 — 시야 · 탄은 높이로 봄). rock = 못 지나감 (바위 · 벽 · 더미), solid = 시야 · 탄을 막는 바위 · 벽만
const rock = (m, x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[(y | 0) * m.W + (x | 0)] !== 0;
const solid = (m, x, y) => x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[(y | 0) * m.W + (x | 0)] === 1;
const PILE_NM = { 1: '갑옷', 2: '시체' };
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
  m.hills = hills.length ? hills : null; m.pk = null; m.piles = 0;
  const off = new Set(setup.pileOff || []), busy = (x, y) => off.has(x + ',' + y) || (setup.units || []).some(u => Math.floor(u.x) === x && Math.floor(u.y) === y) || (setup.torches || []).some(t => Math.floor(t.x) === x && Math.floor(t.y) === y);   // 누가 서 있는 칸 · 횃불 칸 · 손으로 뺀 칸은 비움
  for (const [x, y, k] of piles){ if (x < 0 || y < 0 || x >= m.W || y >= m.H || m.t[y * m.W + x] === 1 || busy(x, y)) continue; m.pk = m.pk || new Uint8Array(m.W * m.H); m.t[y * m.W + x] = 2; m.pk[y * m.W + x] = k; m.piles++; }
  return m;
}""")
m = rep(m, "for (let i = 1; i < n; i++){ const t = i / n; if (rock(m, x0 + dx * t, y0 + dy * t)) return false; }",
        "for (let i = 1; i < n; i++){ const t = i / n; if (solid(m, x0 + dx * t, y0 + dy * t)) return false; }   // v7.18 더미는 높이로 따로 봄 (expoOf)")
m = rep(m, "const tx = m.t[y * m.W + x] ? cx - (cx - s.x) / d * 0.6 : cx, ty = m.t[y * m.W + x] ? cy - (cy - s.y) / d * 0.6 : cy;",
        "const tx = m.t[y * m.W + x] === 1 ? cx - (cx - s.x) / d * 0.6 : cx, ty = m.t[y * m.W + x] === 1 ? cy - (cy - s.y) / d * 0.6 : cy;")
m = rep(m, "  if (d > W.rules.sight) return false;\n", "  if (d > W.rules.sight + (W.map.hills ? (TER(W).sightHi != null ? TER(W).sightHi : 0.6) * Math.abs(gH(W.map, u.x, u.y) - gH(W.map, t.x, t.y)) : 0)) return false;   // v7.18 높이차만큼 멀리 보고 · 멀리서 보임\n")
m = rep(m, "  return d < 1.2 || losClear(W.map, u.x, u.y, t.x, t.y);\n}",
        "  return d < 1.2 || (losClear(W.map, u.x, u.y, t.x, t.y) && (!terrOn(W) || expoOf(W, u, t) > (TER(W).seeMin != null ? TER(W).seeMin : 0.05)));   // v7.18 언덕 마루 · 더미 뒤 (웅크리면 다 가려짐)\n}")
wr('rt3_mid.js', m)

# ---------- 꼬리: 몸 높이 · 드러난 몫 · 보정 ----------
s = rd('rt3_tail.js')
s = rep(s, "/* v7.17 몸 리치: 든 근접 무기 (날붙이 · 둔기) 만 키만큼 길어지고 짧아짐. 체급: 소형 · 중형 · 중대형 · 대형 · 초대형 */",
"""/* v7.18 지형: 몸 높이 (서 있음 · 웅크림 = 은신하고 가만히 · 엎드림) · 드러난 몫 (보는 눈 → 몸 꼭대기 사이를 언덕 · 더미가 가린 만큼) · 고저 보정 */
const TER = W => W.rules.terrain || {};
const terrOn = W => !!(W.map && (W.map.hills || W.map.piles));
const crouching = (W, u) => !!u.stealth && u.alive && !u.act && !u.lie && !(u.torch && !u.torchOff) && !(u.order && u.order.hurry);
const bodyH = (W, u) => u.lie && !u.lieSw ? (TER(W).lieH || 0.45) : crouching(W, u) ? (u.h || 1.7) * (TER(W).crouch || 0.55) : (u.h || 1.7);
const pileH = (W, k) => ((TER(W).pileH || {})[PILE_NM[k]] != null ? TER(W).pileH[PILE_NM[k]] : k === 2 ? 0.6 : 1.1);
function expoOf(W, u, t, info){
  const m = W.map; if (!m.hills && !m.piles) return 1;
  const g1 = gH(m, t.x, t.y), eye = gH(m, u.x, u.y) + bodyH(W, u) * 0.92, bh = bodyH(W, t), top = g1 + bh, dx = t.x - u.x, dy = t.y - u.y, d = Math.hypot(dx, dy);
  if (d < 1.2) return 1;
  const n = Math.ceil(d * 3); let cut = g1;
  for (let i = 1; i < n; i++){ const k = i / n; if (d * k < (u.r || 0.3) || d * (1 - k) < (t.r || 0.3) * 0.6) continue;
    const x = u.x + dx * k, y = u.y + dy * k, pk = m.piles ? pileAt(m, x, y) : 0, O = gH(m, x, y) + (pk ? pileH(W, pk) : 0); if (O <= g1) continue;
    const need = eye + (O - eye) / k; if (need > cut){ cut = need; if (info){ info.k = k; info.pile = pk; } } if (cut >= top) return 0; }
  return Math.max(0, Math.min(1, (top - cut) / bh));
}
// 원거리 명중 × : 엄폐 (cov0 + 드러난 몫 — 곡사는 위에서 떨어져 arcCov 까지) × 높이차 (1M 당 aimHi)
function terrAim(W, u, t, arc){ const T = TER(W), e = expoOf(W, u, t), c0 = T.cov0 != null ? T.cov0 : 0.2, c = arc ? Math.max(e, T.arcCov != null ? T.arcCov : 0.8) : e <= 0 ? 0.05 : c0 + (1 - c0) * e, dh = W.map.hills ? gH(W.map, u.x, u.y) - gH(W.map, t.x, t.y) : 0;
  return c * (1 + (T.aimHi != null ? T.aimHi : 0.05) * Math.max(-2, Math.min(2, dh))); }
const hiMelee = (W, u, t, far) => far || !W.map.hills ? 1 : 1 + (TER(W).meleeHi != null ? TER(W).meleeHi : 0.08) * Math.max(-1.5, Math.min(1.5, gH(W.map, u.x, u.y) - gH(W.map, t.x, t.y)));
// 오르막은 느리고 내리막은 조금 빠름 (가는 방향의 기울기)
function slopeK(W, u, dx, dy){ const l = Math.hypot(dx, dy); if (!l || !W.map.hills) return 1; const [gx, gy] = gGrad(W.map, u.x, u.y), sl = (gx * dx + gy * dy) / l, T = TER(W);
  return sl > 0 ? 1 / (1 + (T.climb != null ? T.climb : 0.8) * sl) : 1 + (T.down != null ? T.down : 0.1) * Math.min(1, -sl); }
// 비탈을 뛰면 미끄러져 넘어질 수 있음 (0.5초마다 판정 · 내리막이 더 위험 · 베테랑 · 네 발은 덜)
function slopeTrip(W, u, dx, dy){ if (!W.map.hills || W.t - (u.tripT == null ? -9 : u.tripT) < 0.5 || u.lie || u.crawl) return; u.tripT = W.t;
  const [gx, gy] = gGrad(W.map, u.x, u.y), g = Math.hypot(gx, gy), T = TER(W), s0 = T.tripS != null ? T.tripS : 0.3; if (g <= s0) return;
  const l = Math.hypot(dx, dy) || 1, down = (gx * dx + gy * dy) / l < 0;
  if (W.rand() < (T.trip != null ? T.trip : 0.12) * (g - s0) / 0.2 * (down ? 1.5 : 1) * (u.vet ? 0.6 : 1) * (u.quadOn ? 0.5 : 1)) knockDown(W, u, T.tripT || 0.8, null, down ? '비탈을 뛰어 내려가다 미끄러짐' : '비탈을 뛰어 오르다 미끄러짐'); }
/* v7.17 몸 리치: 든 근접 무기 (날붙이 · 둔기) 만 키만큼 길어지고 짧아짐. 체급: 소형 · 중형 · 중대형 · 대형 · 초대형 */""")
# 원거리 명중 (사격 · 투창)
s = rep(s, "  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음\n  return Math.max(0.02, Math.min(0.99, p));\n}\n// u 가 아는 몸",
        "  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음\n  if (terrOn(W)) p *= terrAim(W, u, t, arc);   // v7.18 엄폐 · 고저\n  return Math.max(0.02, Math.min(0.99, p));\n}\n// u 가 아는 몸")
s = rep(s, "  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음\n  return Math.max(0.02, Math.min(0.99, p));\n}\nfunction startThrow",
        "  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음\n  if (terrOn(W)) p *= terrAim(W, u, t, false);   // v7.18 엄폐 · 고저\n  return Math.max(0.02, Math.min(0.99, p));\n}\nfunction startThrow")
# 직사: 겨눔은 맞았는데 엄폐가 가린 몫이면 더미 · 마루에 막힘
s = rep(s, "  const ang = base + Math.atan2(off, d), dx = Math.cos(ang), dy = Math.sin(ang);\n  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1, gun: wp.kind === '총포류' });",
        "  const ang = base + Math.atan2(off, d), dx = Math.cos(ang), dy = Math.sin(ang);\n  let cov = null; if (!good && terrOn(W)){ const inf = {}, e = expoOf(W, u, t, inf), T = TER(W), c0 = T.cov0 != null ? T.cov0 : 0.2, c = e <= 0 ? 0.05 : c0 + (1 - c0) * e; if (e < 1 && inf.k != null){ const p0 = Math.min(0.99, p / Math.max(0.05, c)); if (W.rand() < p0 * (1 - c) / Math.max(0.01, 1 - p)) cov = { d: inf.k * d, pile: inf.pile || 0 }; } }   // v7.18 엄폐에 막힘\n  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1, gun: wp.kind === '총포류', cov });")
s = rep(s, "      if (rock(W.map, nx, ny)){ s.done = true; if (!s.supp){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: '빗나가 바위에 맞음', fired: true, p: s.p }); }",
        "      if (s.cov && Math.hypot(nx - s.x0, ny - s.y0) >= s.cov.d){ s.done = true; s.x = s.x0 + s.dx * s.cov.d; s.y = s.y0 + s.dy * s.cov.d; if (!s.supp){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: s.cov.pile ? (s.cov.pile === 2 ? '굳은 시체에 막힘 (엄폐)' : '갑옷 무더기에 막힘 (엄폐)') : '언덕 마루에 막힘', fired: true, p: s.p, cover: true }); } break; }   // v7.18\n      if (solid(W.map, nx, ny)){ s.done = true; if (!s.supp){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: '빗나가 바위에 맞음', fired: true, p: s.p }); }")
# 근접 고저
s = rep(s, "let dir = arcX ? 'front' : sideOf(W, t, u); const base = u.atk * u.atkMul *", "let dir = arcX ? 'front' : sideOf(W, t, u); const base = hiMelee(W, u, t, isF || !!J) * u.atk * u.atkMul *")
# 오르막 · 미끄러짐
s = rep(s, "  const s = spdNow(W, u) * dt;\n  tryMove(W, u, u.x + dx * s, u.y + dy * s);", "  const s = spdNow(W, u) * dt * slopeK(W, u, dx, dy);   // v7.18 오르막\n  tryMove(W, u, u.x + dx * s, u.y + dy * s);")
s = rep(s, "  let rem = spdNow(W, u) * dt * (slow || 1);\n", "  let rem = spdNow(W, u) * dt * (slow || 1) * (W.map.hills && u.path[0] ? slopeK(W, u, u.path[0].x - u.x, u.path[0].y - u.y) : 1);   // v7.18 오르막 느림 · 내리막\n  if (W.map.hills && u.path[0] && running(W, u)){ slopeTrip(W, u, u.path[0].x - u.x, u.path[0].y - u.y); if (!u.path || !u.path.length) return; }   // v7.18 비탈을 뛰면 미끄러짐\n")
s = rep(s, "if (typeof module !== 'undefined') module.exports = { ", "if (typeof module !== 'undefined') module.exports = { gH, gGrad, solid, pileAt, terrainOf, expoOf, bodyH, crouching, terrAim, hiMelee, slopeK, slopeTrip, terrOn, ")
wr('rt3_tail.js', s)
print('patch718 OK')
