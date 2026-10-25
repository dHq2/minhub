# v9.9.5 엔진 — patch9240.py v1.0 (v1.0: 뭉침 = 태세 하나로 — ① 단단한 순 (방패 · 체력 비율 · 몸무게) 으로 앞줄, 체력 절반 아래는 뒤로 · 사수는 늘 뒷줄 ② 앞줄은 가운데부터 좌우로 몸 폭대로 채움 — 가장 단단한 이가 가운데 (명령 자리) 에 먼저 서고 나머지가 어깨에 붙음 (큰 몸은 그만큼 넓게) ③ 선 (o.len) 이 있으면 그 길이에 몸 폭이 들어가는 만큼 앞줄 · 나머지는 살짝 휜 뒷줄 ④ 혼자 뭉침 = 제자리 태세 — 막기를 든 뭉침은 돌격 버팀 × 1.25 (양쪽 편) ⑤ 대기 몸짓은 정말 한가할 때만 (쫓기 · 싸움 · 수색 · 치료 중엔 안 함 — 매복 모퉁이 · 철퇴 감기 · 근접 스텝을 흐트리던 것) ⑥ 싸우는 중엔 짝이 멀어도 (2.5칸 넘게) 팔이 닿을 만한 적이 곁에 있으면 짝에게 붙으러 싸움을 버리지 않음 (맞붙던 적이 넉백으로 잠깐 떨어져도) ⑦ 바로잡기: 결승 직접 조작의 막기 유지 (K) 는 막기 자동이 덮지 않음 (u.ctlHold))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9230.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("""  const A = [...M.filter(m => !isFar(m)), ...M.filter(m => isFar(m))].sort((a, b) => (isFar(a) - isFar(b)) || a.order.j - b.order.j), n = A.length, k = A.indexOf(u);
  const front = A.filter(m => !isFar(m)).length, rowN = front >= 2 ? Math.min(front, 6) : Math.min(n, 4), rr = Math.max(...A.map(m => m.r)), sp = rr * 2 + 0.03;
  const row = k < rowN ? 0 : 1, col = row ? k - rowN : k, cnt = row ? n - rowN : rowN, off = (col - (cnt - 1) / 2) * sp, back = row * sp;
  const sq = 1 - 0.06 / Math.max(0.3, Math.hypot(off, back)),""", """  const A = M.slice().sort((a, b) => (isFar(a) - isFar(b)) || (clumpTough(b) - clumpTough(a)) || a.order.j - b.order.j), n = A.length;
  const melee = A.filter(m => !isFar(m) && m.hp >= m.max * 0.5), wOf = m => m.r * 2 + 0.03;   /* v9.9.5 다친 이 · 사수는 뒷줄 */
  let rowN; if (o.len){ let s = 0; rowN = 0; for (const m of melee){ if (rowN && s + wOf(m) > o.len + 0.15) break; s += wOf(m); rowN++; } rowN = Math.max(1, rowN); }
  else rowN = melee.length >= 2 ? Math.min(melee.length, 6) : Math.min(n, melee.length ? 1 : 4);
  const R0 = A.filter(m => melee.slice(0, rowN).includes(m)), R1 = A.filter(m => !R0.includes(m)), row = R0.length && !R0.includes(u) ? 1 : 0, RW = !R0.length ? R1 : row ? R1 : R0;   /* 앞줄이 없으면 (모두 사수 · 다침) 한 줄 */
  const offs = (() => { const out = new Map(); let rE = 0, lE = 0; RW.forEach((m, i) => { if (!i){ out.set(m, 0); rE = m.r + 0.015; lE = -(m.r + 0.015); return; } if (i % 2){ out.set(m, rE + m.r + 0.015); rE += wOf(m); } else { out.set(m, lE - m.r - 0.015); lE -= wOf(m); } }); return out; })();   /* 가운데부터 좌우로 몸 폭대로 */
  const rr = Math.max(...R0.map(m => m.r), u.r), off = offs.get(u) || 0, half = Math.max(0.5, ...[...offs.values()].map(Math.abs)), back = row && R0.length ? rr + Math.max(...R1.map(m => m.r), u.r) + 0.03 + 0.35 * u.r * Math.pow(off / half, 2) : 0;   /* 뒷줄은 살짝 휨 */
  const sq = 1 - 0.06 / Math.max(0.3, Math.hypot(off, back)),""")
rep("function clumpStep(W, u, dt){", """// v9.9.5 뭉침 앞줄 순서: 방패 · 체력 비율 · 몸무게 (다친 이는 뒤)
const clumpTough = m => (m.shield ? 1.5 : 0) + (m.armShield ? 1 : 0) + (m.hp / Math.max(1, m.max)) + Math.min(2, (m.mass || 70) / 200) - (m.hp < m.max * 0.5 ? 2 : 0);
function clumpStep(W, u, dt){""")
rep("  return { mass: (t.mass * (t.poise || 1) + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0, line: !!t.line, ids };",
    "  const setK = t.order && t.order.k === 'clump' && guardOn(W, t) ? 1.25 : 1;   /* v9.9.5 태세 (뭉침) — 막기를 든 채 버팀 */\n  return { mass: (t.mass * (t.poise || 1) + m) * (trained ? C.trained || 1.6 : 1) * setK, trained, mates: m > 0, line: !!t.line, ids, set: setK > 1 };")
rep("  if (u.guardMode === 'hold') u.guardMode = 'auto'; if (u.guardOff)", "  if (u.guardMode === 'hold' && !u.ctlHold) u.guardMode = 'auto'; if (u.guardOff)")   # 직접 조작 (결승) 의 막기 유지는 그대로
rep("  const still = u.alive && !u.noFid && !u.down", "  const still = u.alive && !u.noFid && !['hunt', 'fight', 'search', 'heal'].includes(u.state) && !u.down")   # 대기 몸짓은 한가할 때만
rep("    if (!back && d0 < 2.5){   /* v9.7.1 중재", "    if (!back && (d0 < 2.5 || (u.state === 'fight' && u.hp >= u.max * 0.35 && u.target && u.target.alive && u.target.side !== u.side && gap(u, u.target) < 2.5 && !(u.rescueGo && W.t < u.rescueGo)))){   /* v9.9.5 싸우는 중이면 짝이 멀어도 (붙으러 가기 전에) 팔이 닿을 만한 적을 먼저 봄 */   /* v9.7.1 중재")
rep("module.exports = { isSupport,", "module.exports = { clumpTough, isSupport,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9240 OK')
