# v9.12.0 엔진 — patch9310.py v1.0 (v1.0: 세자르 다시 (2D 판 결 살리기) — ① 빠르게 몸을 돌림 (돌아서기 × 2.6) ② 걸음 박자가 바뀜 (아주 천천히 · 걷기 · 뜀 · 질주 · 짧은 도약) ③ 탐색 중엔 일행 전체의 둘레를 돎 (무리 중심 · 가장 바깥 몸 + 간격) ④ 기술 대기가 짧게 · 판마다 다르게 시작 ⑤ 탐색 중에도 가끔 불쑥 하늘 가르기 · 관통 찌르기 · 냉기 참격 ⑥ 딜타임의 기술 순서가 늘 같지 않음 (준비된 것 가운데 무작위) ⑦ 탐색 ↔ 딜타임 박자 짧게 (탐색 2.5 ~ 4.5초) ⑧ 누가 다가오면 그 몸과 간격부터 · 둘레를 도는 동안에도 톡톡 옆걸음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9300.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
def cut(a, b):   # a 부터 b 앞까지 (한 곳)
    hits = [k for k in P if a in P[k]]; assert len(hits) == 1 and P[hits[0]].count(a) == 1, a[:80]
    v = P[hits[0]]; i = v.index(a); j = v.index(b, i); return v[i:j]
# ① 돌아서기
rep("const turnMul = (W, u) => Math.max(", "const turnMul = (W, u) => u.cz ? (W.rules.cz || {}).turn || 2.6 : Math.max(")
# ⑦ 박자 · 둘레
rep("cz: { bulletEv: 0.7, evCd: 0.35, probe: [4.5, 7], fury: 4.5,", "cz: { bulletEv: 0.7, evCd: 0.35, turn: 2.6, surp: 0.5, ring: 1.0, ringLead: 0.9, probe: [2.5, 4.5], fury: 4.5,")
# ④ 기술 대기 시작값
rep("spin: 1, shoulder: 3, back: 0, flank: 3, rush: 5, punish: 0, combo: null, jog: 0, upcut: 8, thrust: 4, wave: 5, ult: 10,", "spin: 0.5, shoulder: 1.5, back: 0, flank: 2, rush: 3, punish: 0, combo: null, jog: 0, upcut: 2.5 + W.rand() * 3.5, thrust: 1 + W.rand() * 2, wave: 2 + W.rand() * 3, ult: 5 + W.rand() * 4,   /* v9.12.0 기술이 일찍 · 판마다 다르게 */")
# ⑥ 딜타임: 준비된 기술 가운데 무작위
a0 = "    if (z.ult <= 0 && fr && dist(u, fr) < (U.rng || 8.4)){"
blk = cut(a0, "    if (z.shoulder <= 0 && gap(u, t) < (SH.rng || 3.3)")
new = blk.replace("    if (z.ult <= 0 && fr && dist(u, fr) < (U.rng || 8.4)){ z.ult = U.cd || 22; return czStart(W, u, 'ult', fr, { tb: fr.i }); }", "    const CAN = [];   /* v9.12.0 준비된 큰 기술 가운데 무작위 (늘 같은 순서가 아님) */\n    if (z.ult <= 0 && fr && dist(u, fr) < (U.rng || 8.4)) CAN.push(() => { z.ult = U.cd || 22; return czStart(W, u, 'ult', fr, { tb: fr.i }); });")
new = new.replace("if (z.upcut <= 0){ const o = pick(", "if (z.upcut <= 0){ const o = pick(").replace("if (o) return czStart(W, u, 'upcut', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }", "if (o) CAN.push(() => czStart(W, u, 'upcut', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) })); }")
new = new.replace("if (o) return czStart(W, u, 'thrust', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }", "if (o) CAN.push(() => czStart(W, u, 'thrust', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) })); }")
new = new.replace("if (o) return czStart(W, u, 'wave', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) }); }", "if (o) CAN.push(() => czStart(W, u, 'wave', o, { ang: Math.atan2(o.y - u.y, o.x - u.x) })); }\n    if (CAN.length) return CAN[Math.floor(W.rand() * CAN.length)]();")
assert new.count('CAN.push') == 4, new
rep(blk, new)
# ⑤ 탐색 중 불쑥
rep("  if (z.fury){ const S = Z.spin || {}, SH = Z.shoulder || {};", """  if (!z.fury && W.rand() < dt * (Z.surp != null ? Z.surp : 0.5)){ const d = dist(u, t), UP = Z.upcut || {}, TH = Z.thrust || {}, WV = Z.wave || {}, op = [];   /* v9.12.0 탐색 중에도 불쑥 — 버틸 만하다 싶을 때 하늘 가르기 */
    if (z.upcut <= 0 && d > (UP.d0 || 2.1) && d < (UP.d1 || 10)) op.push('upcut'); if (z.thrust <= 0 && d > (TH.d0 || 1.8) && d < (TH.d1 || 6.3)) op.push('thrust'); if (z.wave <= 0 && d > (WV.d0 || 3.1) && d < (WV.d1 || 7)) op.push('wave');
    if (op.length){ const s = op[Math.floor(W.rand() * op.length)]; L(W, { k: 'czSurp', a: u.i, b: t.i, s, vis: u.side === 0 || !!u.seenBy }); return czStart(W, u, s, t, { ang: Math.atan2(t.y - u.y, t.x - u.x) }); } }
  if (z.fury){ const S = Z.spin || {}, SH = Z.shoulder || {};""")
# ② 걸음 박자 · ③ 일행 둘레
rep("  z.jog = (z.jog || 0) - dt; if (!z.fury && z.jog < -2.5 && W.rand() < dt * 0.3) z.jog = 0.7;   // 탐색 중 가끔 잠깐 뜀\n  u.czSpd = z.fury ? (Z.furyWalk || 0.8) : z.jog > 0 ? (Z.jog || 1.4) : (Z.walk || 0.45);",
"""  z.tmT = (z.tmT || 0) - dt; if (z.tmT <= 0){ const r = W.rand(), was = z.tm; z.tm = z.fury ? (r < 0.4 ? 'run' : r < 0.75 ? 'walk' : 'dash') : (r < 0.4 ? 'slow' : r < 0.65 ? 'walk' : r < 0.85 ? 'run' : 'dash'); z.tmT = z.tm === 'dash' ? 0.35 + W.rand() * 0.35 : 0.6 + W.rand() * 1.4;   /* v9.12.0 걸음 박자: 아주 천천히 · 걷기 · 뜀 · 질주 — 바뀔 때 가끔 짧은 도약 */
    if (was && was !== z.tm && W.rand() < 0.35 && W.t >= (z.stepT || 0)){ const S = Z.step || {}, aT = Math.atan2(t.y - u.y, t.x - u.x), o = z.orbit || 1; if (czStep(W, u, t, [aT + o * 1.57, aT + o * 1.1, aT - o * 1.57], (S.d || 1.6) * 1.5, null, '짧은 도약')) return true; } }
  u.czSpd = { slow: Z.walk || 0.6, walk: Z.furyWalk || 1.0, run: Z.jog || 1.4, dash: Z.run || 3 }[z.tm || 'slow'];""")
rep("  const keep = z.fury ? u.rng * 0.8 + t.r + u.r : (Z.keep || 3.5), a = Math.atan2(u.y - t.y, u.x - t.x) + z.orbit * (Z.orbit || 0.25), gx = t.x + Math.cos(a) * keep, gy = t.y + Math.sin(a) * keep;",
"""  let gx, gy; if (z.fury){ const keep = u.rng * 0.8 + t.r + u.r, a = Math.atan2(u.y - t.y, u.x - t.x) + z.orbit * (Z.orbit || 0.25); gx = t.x + Math.cos(a) * keep; gy = t.y + Math.sin(a) * keep; }
  else if (dist(u, t) - t.r - u.r < (Z.keep || 3.5) * 0.7){ const keep = Z.keep || 3.5, a = Math.atan2(u.y - t.y, u.x - t.x) + z.orbit * (Z.orbit || 0.25); gx = t.x + Math.cos(a) * keep; gy = t.y + Math.sin(a) * keep; }   /* v9.12.0 누가 다가오면 그 몸과 간격부터 */
  else { const cx = F.reduce((s, f) => s + f.x, 0) / F.length, cy = F.reduce((s, f) => s + f.y, 0) / F.length, R = Math.max(...F.map(f => Math.hypot(f.x - cx, f.y - cy) + f.r)) + (Z.keep || 3.5) * (Z.ring != null ? Z.ring : 1), a = Math.atan2(u.y - cy, u.x - cx) + z.orbit * (Z.ringLead || 0.9);   /* v9.12.0 탐색: 일행 전체의 둘레를 돎 (가장 바깥 몸 + 간격) */
    gx = cx + Math.cos(a) * R; gy = cy + Math.sin(a) * R; }""")
rep("      if (g < (Z.keep || 3.5) + 2.5){ const o = z.orbit || 1,", "      if (g < (Z.keep || 3.5) + 4.5){ const o = z.orbit || 1,")   # v9.12.0 일행 둘레를 도는 동안에도 톡톡 옆걸음
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9310 OK')
