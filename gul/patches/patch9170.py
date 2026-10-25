# v9.8.1 엔진 — patch9170.py v1.0 (v1.0: 길찾기 개선 ① A* (대각선 √2 비용 · 옛 BFS 는 대각선도 1 이라 지그재그) ② 길 곧게 펴기 — 몸 폭으로 곧장 걸을 수 있는 모퉁이는 건너뜀 ③ 걷는 중에도 다음 모퉁이가 보이면 건너뜀 ④ 앞을 막은 같은 편 (서 있거나 마주 오는) 은 옆으로 비켜 감 (뭉침 · 받침은 일부러 붙으니 제외) ⑤ 0.5초 넘게 끼면 옆걸음 + 길을 다시 찾음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9160.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("function findPath(m, sx, sy, gx, gy, maxN, cr){", r"""// v9.8.1 A* (팔방 · 대각선 √2 · 모서리 끼기 금지) — 큰 몸은 옛 방식 (몸이 들어가는 칸 · 가장 가까운 칸까지)
function findPath(m, sx, sy, gx, gy, maxN, cr){
  if (cr > 0.55) return findPathOld(m, sx, sy, gx, gy, maxN, cr);
  const W = m.W, s = (sy | 0) * W + (sx | 0), g = (gy | 0) * W + (gx | 0);
  if (rock(m, gx, gy)) return null; if (s === g) return [];
  const N = m.W * m.H, gs = new Float32Array(N).fill(1e9), prev = new Int32Array(N).fill(-1), done = new Uint8Array(N), hq = [], gx0 = g % W, gy0 = (g / W) | 0;
  const hf = c => { const dx = Math.abs(c % W - gx0), dy = Math.abs(((c / W) | 0) - gy0); return Math.max(dx, dy) + 0.4142 * Math.min(dx, dy); };
  const push = (c, f) => { hq.push([f, c]); let i = hq.length - 1; while (i){ const p = (i - 1) >> 1; if (hq[p][0] <= hq[i][0]) break; [hq[p], hq[i]] = [hq[i], hq[p]]; i = p; } };
  const pop = () => { const t = hq[0], l = hq.pop(); if (hq.length){ hq[0] = l; let i = 0; for (;;){ const a = 2 * i + 1, b = a + 1; let k = i; if (a < hq.length && hq[a][0] < hq[k][0]) k = a; if (b < hq.length && hq[b][0] < hq[k][0]) k = b; if (k === i) break; [hq[k], hq[i]] = [hq[i], hq[k]]; i = k; } } return t; };
  gs[s] = 0; prev[s] = s; push(s, hf(s)); let n = 0;
  while (hq.length && n++ < (maxN || 6000)){ const [, p] = pop(); if (done[p]) continue; done[p] = 1;
    if (p === g){ const path = []; let c = g; while (c !== s){ path.push({ x: c % W + 0.5, y: ((c / W) | 0) + 0.5 }); c = prev[c]; } return path.reverse(); }
    const x = p % W, y = (p / W) | 0;
    for (const [dx, dy] of DIR8){ const nx = x + dx, ny = y + dy; if (rock(m, nx, ny)) continue; if (dx && dy && (rock(m, x + dx, y) || rock(m, x, y + dy))) continue;
      const np = ny * W + nx, ng = gs[p] + (dx && dy ? 1.4142 : 1); if (ng < gs[np]){ gs[np] = ng; prev[np] = p; push(np, ng + hf(np)); } } }
  return null;
}
// v9.8.1 길 곧게 펴기: 지금 자리에서 몸 폭으로 곧장 걸을 수 있는 가장 먼 모퉁이로
function smoothPath(m, x, y, P, r, big){ const ok = (a, b, c, d) => big ? bigWalk(m, a, b, c, d, r) : walkClear(m, a, b, c, d, r); const out = []; let cx = x, cy = y, i = 0;
  while (i < P.length){ let j = P.length - 1; while (j > i && !ok(cx, cy, P[j].x, P[j].y)) j--; out.push(P[j]); cx = P[j].x; cy = P[j].y; i = j + 1; } return out; }
// v9.8.1 앞을 막은 같은 편 비켜 가기: 서 있거나 · 느리거나 · 마주 오는 동료가 가는 길 1.3칸 안에 있으면 옆으로 (덜 막힌 쪽)
function avoidVec(W, u, w){
  if (!w || u.kb || (u.order && u.order.k === 'clump') || u.why === 'BRACE_CHARGE' || u.why === 'CLUMP' || (u.act && u.act.k === 'charge')) return null;
  const dx = w.x - u.x, dy = w.y - u.y, d = Math.hypot(dx, dy); if (d < 0.35) return null; const ux = dx / d, uy = dy / d, px = -uy, py = ux;
  let blk = null, bt = 9;
  for (const o of W.units){ if (o === u || !o.alive || o.side !== u.side || o.down || (o.act && o.act.air)) continue; const ox = o.x - u.x, oy = o.y - u.y, t = ox * ux + oy * uy; if (t <= 0 || t > Math.min(d, 1.9)) continue;
    const lat = ox * px + oy * py, need = u.r + o.r + 0.12; if (Math.abs(lat) >= need) continue; const ov = (o.vx || 0) * ux + (o.vy || 0) * uy; if (ov > (u.spd || 2) * 0.7) continue;   // 같은 쪽으로 잘 가는 동료는 따라감
    if (t < bt){ bt = t; blk = { o, lat, need }; } }
  const sideT = u.sideT && W.t < u.sideT;
  if (!blk && !sideT) return null;
  let sg = sideT ? u.sideS : blk.lat > 0 ? -1 : 1;
  if (!sideT){ const free = k => !rock(W.map, u.x + px * k * (u.r + 0.4), u.y + py * k * (u.r + 0.4)) && !W.units.some(o => o !== u && o.alive && Math.hypot(o.x - (u.x + px * k * (u.r + 0.5)), o.y - (u.y + py * k * (u.r + 0.5))) < o.r + u.r * 0.8); if (!free(sg) && free(-sg)) sg = -sg; }
  const k = sideT ? 1.4 : Math.min(1.6, (blk.need - Math.abs(blk.lat)) / Math.max(0.25, bt) * 1.6 + 0.35), vx = ux + px * sg * k, vy = uy + py * sg * k, l = Math.hypot(vx, vy);
  return { x: vx / l, y: vy / l };
}
function findPathOld(m, sx, sy, gx, gy, maxN, cr){""")
rep("""  u.path = (big ? bigWalk(W.map, u.x, u.y, x, y, u.r * 0.9) : walkClear(W.map, u.x, u.y, x, y, u.r * 1.12)) ? [{ x, y }] : findPath(W.map, u.x, u.y, x, y, undefined, big ? u.r * 0.9 : 0) || null;   // v7.21 무더기는 돌아감
  if (u.path && u.path.length && (!big || bigOk(W.map, x, y, u.r * 0.9))) u.path[u.path.length - 1] = { x, y };""",
"""  u.path = (big ? bigWalk(W.map, u.x, u.y, x, y, u.r * 0.9) : walkClear(W.map, u.x, u.y, x, y, u.r * 1.12)) ? [{ x, y }] : findPath(W.map, u.x, u.y, x, y, undefined, big ? u.r * 0.9 : 0) || null;   // v7.21 무더기는 돌아감
  if (u.path && u.path.length && (!big || bigOk(W.map, x, y, u.r * 0.9))) u.path[u.path.length - 1] = { x, y };
  if (u.path && u.path.length > 1) u.path = smoothPath(W.map, u.x, u.y, u.path, big ? u.r * 0.9 : u.r * 1.12, big);   /* v9.8.1 곧게 펴기 */""")
rep("""    const s = Math.min(rem, d); u.fg = keepF ? fa : Math.atan2(w.y - u.y, w.x - u.x);
    tryMove(W, u, u.x + (w.x - u.x) / d * s, u.y + (w.y - u.y) / d * s);""",
"""    const s = Math.min(rem, d); u.fg = keepF ? fa : Math.atan2(w.y - u.y, w.x - u.x);
    const av = w === u.path[0] && rem > 0 ? avoidVec(W, u, w) : null;   /* v9.8.1 막은 동료 비켜 감 */
    if (av){ tryMove(W, u, u.x + av.x * s, u.y + av.y * s); break; }
    tryMove(W, u, u.x + (w.x - u.x) / d * s, u.y + (w.y - u.y) / d * s);""")
rep("""  if (u.goal && u.path && u.path.length > 1 && W.t - (u.skipT || 0) > 0.3){ u.skipT = W.t; if (walkClear(W.map, u.x, u.y, u.goal.x, u.goal.y, u.r * 1.12)) u.path = [u.goal]; }""",
"""  if (u.goal && u.path && u.path.length > 1 && W.t - (u.skipT || 0) > 0.25){ u.skipT = W.t; if (walkClear(W.map, u.x, u.y, u.goal.x, u.goal.y, u.r * 1.12)) u.path = [u.goal]; else { let k = 0; while (k++ < 3 && u.path.length > 1 && walkClear(W.map, u.x, u.y, u.path[1].x, u.path[1].y, u.r * 1.12)) u.path.shift(); } }   /* v9.8.1 다음 모퉁이가 보이면 건너뜀 */
  if (u.path && u.path.length){ if (u.stkT == null || W.t - u.stkT > 0.5){ const mv = u.stkT == null ? 1 : Math.hypot(u.x - u.stkX, u.y - u.stkY);   /* v9.8.1 끼임: 0.5초에 0.12칸도 못 가면 옆걸음 + 길 다시 */
      if (mv < 0.12 && !u.act && !u.kb && Math.hypot(u.path[u.path.length - 1].x - u.x, u.path[u.path.length - 1].y - u.y) > 0.6){ u.sideS = u.sideS === 1 ? -1 : 1; u.sideT = W.t + 0.45; const gl = u.goal; if (gl){ u.goal = null; setGoal(W, u, gl.x, gl.y); } }
      u.stkT = W.t; u.stkX = u.x; u.stkY = u.y; } } else u.stkT = null;""")
rep("module.exports = { chargeBrace,", "module.exports = { smoothPath, avoidVec, chargeBrace,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9170 OK')
