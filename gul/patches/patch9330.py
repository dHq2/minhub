# v9.13.0 엔진 — patch9330.py v1.0 (v1.0: 총안 다시 — 총구가 전열 몸 앞으로 나옴: 사수가 표적 쪽 전열 (근접 · 지원 아님) 과 0.45칸 안이면 바로 총안 (걸어가지 않음) · 탄은 그 전열 몸을 지나 나감 (그 전열은 절대 안 맞음) · 그 너머의 몸은 평소 규칙 · 어깨 둘 사이면 둘 다 · 전열이 막아 주는 가까운 적에겐 물러서거나 기다리지 않고 총안으로 쏨 · 양쪽 편)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9320.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("function peekState(W, u){ if (!u.alive || u.down || !isFar(u) || u.lie || u.crawl) return null;", """// v9.13.0 총안: 표적 쪽으로 맞닿은 (0.45칸 안) 전열 몸들 — 총구가 그 몸 앞으로 나오므로 탄이 그 몸을 지나감
function loophole(W, u, t){ if (!t || !u.alive || u.down || !isFar(u) || u.lie || u.crawl || u.kb) return []; const ta = Math.atan2(t.y - u.y, t.x - u.x), dT = dist(u, t), LH = (W.rules.loop || {}).gap != null ? W.rules.loop.gap : 0.45;
  return W.units.filter(o => o !== u && o !== t && o.alive && o.side === u.side && frontL(o) && gap(u, o) <= LH && dist(u, o) < dT && angDiff(Math.atan2(o.y - u.y, o.x - u.x), ta) < 1.2); }
// 총안으로 쏠 수 있나: 그 전열을 빼고 사선 · 오사를 셈 (빼꼼 자리 셈과 같은 자리 — _pkEx)
function loopClear(W, u, t, know){ const LP = loophole(W, u, t); if (!LP.length) return null; const ids = LP.map(o => o.i);
  const B = lineBodies(W, u, t, u, know).filter(b => !ids.includes(b.i)); if (B.length && B[0].side === u.side) return null;
  u._pkT = W.t; u._pkTg = t.i; u._pkX = u.x; u._pkY = u.y; u._pkEx = ids; u.loopT = W.t; u.loopB = ids[0]; return LP; }
function peekState(W, u){ if (u.target && u.target.alive){ const L0 = loophole(W, u, u.target); if (L0.length) return L0[0]; }
  if (!u.alive || u.down || !isFar(u) || u.lie || u.crawl) return null;""")
rep("function firstOnLineP(W, u, t, know){ const f = firstOnLine(W, u, t, u, know);", "function firstOnLineP(W, u, t, know){ if (isFar(u) && !AI6.includes('peek') && loopClear(W, u, t, know)) return t;   /* v9.13.0 총안 */\n  const f = firstOnLine(W, u, t, u, know);")
rep("  const fb = firstOnLine(W, u, t, u, knows(W, u));\n  let b = fb !== t && fb.side === u.side ? fb : null;", "  const lhF = !jav && !AI6.includes('peek') ? loopClear(W, u, t, knows(W, u)) : null, fb = lhF ? t : firstOnLine(W, u, t, u, knows(W, u));   /* v9.13.0 총안: 그 전열은 빼고 셈 */\n  if (lhF && (u.peekLog == null || W.t - u.peekLog > 3)){ u.peekLog = W.t; L(W, { k: 'peek', a: u.i, b: t.i, c: lhF[0].i, loop: true, vis: u.side === 0 || !!u.seenBy }); }   /* v9.13.0 총안 기록 */\n  let b = fb !== t && fb.side === u.side ? fb : null;")
rep("W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + ddx * (u.r + 0.02),", "W.shots.push({ ...((q => q.length ? { pass: q.map(o => o.i) } : {})(loophole(W, u, t))), id: ++W.shotN, a: u.i, meant: t.i, x: u.x + ddx * (u.r + 0.02),")
rep("  W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5,", "  W.shots.push({ ...((q => q.length ? { pass: q.map(o => o.i) } : {})(loophole(W, u, t))), id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: u.rng + u.r + 2.5,   /* v9.13.0 총안: 총구가 전열 몸 앞 — 그 몸은 지나감 */")
rep("module.exports = { peekState,", "module.exports = { loophole, loopClear, peekState,")
rep("    const fb = firstOnLine(W, u, t, u, knows(W, u));\n    if (!ordFire(u, t) && ((fb !== t && fb.side === u.side)", "    const fb = loopClear(W, u, t, knows(W, u)) ? t : firstOnLine(W, u, t, u, knows(W, u));   /* v9.13.0 점사 다음 발도 총안 */\n    if (!ordFire(u, t) && ((fb !== t && fb.side === u.side)")
rep("if (!ordered && !isFar(t) && u.bold < 0.6 && !cornered(W, u) && kiteEng(W, u)){", "if (!ordered && !isFar(t) && u.bold < 0.6 && !cornered(W, u) && !loophole(W, u, t).length && kiteEng(W, u)){")   # v9.13.0 전열이 막아 주면 기다리지 않음
rep("if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) + (u.mood === '거리 벌리기' ? 0.4 : 0) && u.bold < 0.6 && !cornered(W, u)", "if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) + (u.mood === '거리 벌리기' ? 0.4 : 0) && u.bold < 0.6 && !cornered(W, u) && !loophole(W, u, t).length")   # v9.13.0 전열 뒤 (총안) 면 물러서지 않음
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9330 OK')
