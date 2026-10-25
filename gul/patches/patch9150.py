# v9.7.3 엔진 — patch9150.py v1.0 (v1.0: 리모델 P1b 2단계 공격돌격 / 방어돌격 시험판 — 사람마다 u.chgMode: 없음 = 기본 돌격 (옛 그대로) · 'atk' 공격돌격 (달리다 무기가 먼저 닿는 순간 찌름 · 속력만큼 셈 · 무기로 멈추면 몸은 부딪히지 않음 · 막히면 자세를 깎음) · 'def' 방어돌격 (몸 · 방패로 들이받음 — 무게 ×1.3 · 막아도 자세 ×1.5 · 무기 피해 ×0.35). 양쪽 편 같은 규칙)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9140.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("  u.act = { k: 'charge', phase: 'wind', b: t ? t.i : null, px: pt ? pt.x : null, py: pt ? pt.y : null, t0: W.t, end: W.t + (C.wind != null ? C.wind : 0.35) };",
    "  u.act = { k: 'charge', phase: 'wind', b: t ? t.i : null, px: pt ? pt.x : null, py: pt ? pt.y : null, t0: W.t, end: W.t + (C.wind != null ? C.wind : 0.35), ...(u.chgMode ? { mode: u.chgMode } : {}) };   /* v9.7.3 돌격 방식 */")
rep("dx: (tx - u.x) / d, dy: (ty - u.y) / d, sp, v0, run: 0, ...(u.act.sup ? { sup: true, lim: d + 1.5 } : {}) };",
    "dx: (tx - u.x) / d, dy: (ty - u.y) / d, sp, v0, run: 0, ...(u.act.sup ? { sup: true, lim: d + 1.5 } : {}), ...(u.act.mode && !u.act.sup ? { mode: u.act.mode } : {}) };   /* v9.7.3 */")
rep("  const stuck = Math.hypot(u.x - x0, u.y - y0) < A.sp * dt * 0.3;\n  if (hit && !(hit.act",
"""  // v9.7.3 공격돌격: 무기가 먼저 닿는 순간 (몸이 닿기 전) 달려온 힘으로 찌름 · 침 — 무기로 멈추면 몸은 부딪히지 않음
  if (A.mode === 'atk' && !hit && tg && tg.alive && tg.side !== u.side && !tg.down && gap(u, tg) <= u.rng + 0.05 && angDiff(Math.atan2(tg.y - u.y, tg.x - u.x), Math.atan2(A.dy, A.dx)) < 0.7 && !(tg.act && tg.act.k === 'leap' && tg.act.air)){
    if (!(tg.act && tg.act.k === 'charge' && tg.act.phase === 'run') && evadeCharge(W, tg, u, A)) return;
    const k = Math.max(0.6, Math.min(1.6, A.sp / 4.5)), pw0 = Math.min(1, (A.run || 0) / (C.full || 3)), blocked = inGuard(W, tg, u, true);
    strike(W, u, tg, tg, 1, false, { mul: (C.atkDmg != null ? C.atkDmg : 1.15) * k * (0.6 + 0.4 * pw0), wk: heavyKind(W, u), tag: '공격돌격' });
    if (blocked && tg.alive){ tg.post -= (C.post || 60) * 0.5 * k; if (tg.post <= 0){ tg.post = 0; tg.brokenT = W.t + W.rules.breakTime; } }
    else if (tg.alive) stun(W, tg, 0.35 * k, u.i);
    if (tg.alive) interrupt(W, tg, '찔려 준비가 끊김');
    L(W, { k: 'chgStab', a: u.i, b: tg.i, block: blocked, broke: blocked && tg.brokenT > W.t, run: +(A.run || 0).toFixed(1), vis: u.side === 0 || !!u.seenBy || !!tg.seenBy });
    u.act = { k: 'atk', phase: 'rec', b: tg.i, t0: W.t, end: W.t + 0.45, t1: W.t }; u.offBal = W.t + 0.35; return; }
  const stuck = Math.hypot(u.x - x0, u.y - y0) < A.sp * dt * 0.3;
  if (hit && !(hit.act""")
rep("e = C.e != null ? C.e : 0.3; let mA = u.mass, mB = br.mass, mtB = false;", "e = C.e != null ? C.e : 0.3; let mA = u.mass * (A.mode === 'def' ? (C.defMass || 1.3) : 1), mB = br.mass, mtB = false;   /* v9.7.3 방어돌격: 몸 · 방패를 실어 들이받음 */")
rep("strike(W, u, hit, hit, 1, false, { mul: (C.dmg || 0.6) * k * (u.rush", "strike(W, u, hit, hit, 1, false, { mul: (C.dmg || 0.6) * (A.mode === 'def' ? (C.defDmg != null ? C.defDmg : 0.35) : 1) * k * (u.rush")
rep("    if (blocked && hit.alive){ hit.post -= (C.post || 60) * k * shK;", "    if (blocked && hit.alive){ hit.post -= (C.post || 60) * k * shK * (A.mode === 'def' ? 1.5 : 1);")
rep("L(W, { k: 'impact', a: u.i, b: hit.i, armB: !!hit.armShield,", "L(W, { k: 'impact', a: u.i, b: hit.i, mode: A.mode || null, armB: !!hit.armShield,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9150 OK')
