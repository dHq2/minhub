# v9.3.0 엔진 — patch9040.py v1.4 (v1.4: 넘어짐 완화 (tripS 0.2 · trip × 1.7) · v1.3: 전우조는 적도 — 설정 cg 를 모든 편이 읽음 · 협공 약속도 적이 함 · v1.2: 비탈 값 — 오름 3M / 12칸 기준으로 넘어짐 완화 (tripS 0.18 · trip × 2.0) · v1.1: 사격 — 아래에서 위로 쏠 때 높이 보정 × stairUp.aim · v1.0: 2층 대규모 업데이트 4단계 — 계단은 고지대 판정: 올라가는 쪽이 불리 (잘 넘어지고 · 더 느리고 · 돌격이 힘을 못 얻고 · 사격이 덜 맞음) · setup.stairs)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9030.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("  terrain: { crouch: 0.55,", "  terrain: { stairUp: { climb: 1.7, trip: 1.7, tripS: 0.2, charge: 0.7, aim: 2.4 }, crouch: 0.55,")   # v9.3.0 계단: 오르막 · 더 느림 · 더 잘 넘어짐 · 돌격 × · 사격 높이 보정 ×
rep("  m.hills = hills.length ? hills : null; m.pk = null; m.piles = 0;", "  m.hills = hills.length ? hills : null; m.pk = null; m.piles = 0; m.stairs = !!setup.stairs && !!m.hills;   /* v9.3.0 계단 (고지대 판정) */")
rep("  return sl > 0 ? 1 / (1 + (T.climb != null ? T.climb : 0.8) * sl) : 1 + (T.down != null ? T.down : 0.1) * Math.min(1, -sl); }",
    "  return sl > 0 ? 1 / (1 + (W.map.stairs && T.stairUp ? T.stairUp.climb : T.climb != null ? T.climb : 0.8) * sl) : 1 + (T.down != null ? T.down : 0.1) * Math.min(1, -sl); }")
rep("const [gx, gy] = gGrad(W.map, u.x, u.y), g = Math.hypot(gx, gy), T = TER(W), s0 = T.tripS != null ? T.tripS : 0.3; if (g <= s0) return;\n  const l = Math.hypot(dx, dy) || 1, down = (gx * dx + gy * dy) / l < 0;",
    "const [gx, gy] = gGrad(W.map, u.x, u.y), g = Math.hypot(gx, gy), T = TER(W), SU = W.map.stairs ? T.stairUp : null, s0 = SU ? SU.tripS : T.tripS != null ? T.tripS : 0.3; if (g <= s0) return;\n  const l = Math.hypot(dx, dy) || 1, down = (gx * dx + gy * dy) / l < 0;")
rep("* (g - s0) / 0.2 * (down ? 1.5 : 1) * (u.vet ? 0.6 : 1)", "* (g - s0) / 0.2 * (down ? 1.5 : SU ? SU.trip : 1) * (u.vet ? 0.6 : 1)")
# 돌격: 오르막은 힘을 못 얻음
rep("  tryMove(W, u, u.x + A.dx * A.sp * dt, u.y + A.dy * A.sp * dt);\n  A.run = (A.run || 0) + Math.hypot(u.x - x0, u.y - y0);", "  { const SU = W.map.stairs ? TER(W).stairUp : null, upK = SU && W.map.hills ? (() => { const [gx, gy] = gGrad(W.map, u.x, u.y), sl = gx * A.dx + gy * A.dy; return sl > 0.08 ? SU.charge : 1; })() : 1; tryMove(W, u, u.x + A.dx * A.sp * dt * upK, u.y + A.dy * A.sp * dt * upK); }   /* v9.3.0 계단을 오르며 돌격 — 힘을 못 얻음 */\n  A.run = (A.run || 0) + Math.hypot(u.x - x0, u.y - y0);")
rep("  return c * (1 + (T.aimHi != null ? T.aimHi : 0.05) * Math.max(-2, Math.min(2, dh))); }",
    "  return c * (1 + (T.aimHi != null ? T.aimHi : 0.05) * (W.map.stairs && T.stairUp && dh < 0 ? T.stairUp.aim : 1) * Math.max(-2, Math.min(2, dh))); }   /* v9.3.0 계단: 아래에서 위로 쏘면 더 안 맞음 */")
# 전우조는 적도 (같은 규칙): 설정의 cg 를 모든 편이 읽고 · 옆구리 협공 (맞붙은 전우 곁으로) 도 적이 함
rep("  setup.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0) return;\n    if (p.cg) u.cg = String(p.cg);", "  setup.units.forEach((p, k) => { const u = W.units[k]; if (!u) return;\n    if (p.cg) u.cg = String(p.cg);\n    if (u.side !== 0) return;")
rep("freeM = S === 0 ? E.filter(e => pactFreeM(W, e)) : [], taken", "freeM = E.filter(e => pactFreeM(W, e)), taken")
rep("    if (S === 0 && A.cg && !isFar(A) && !A.crawl && !A.down){", "    if (A.cg && !isFar(A) && !A.crawl && !A.down){")
rep("const pactFreeM = (W, u) => u.alive && u.side === 0 && !!u.cg", "const pactFreeM = (W, u) => u.alive && !!u.cg")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9040 OK')
