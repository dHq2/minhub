# v8.8.4 엔진 — patch8840.py v1.1 (v1.1: 달라붙기 난도질 3 ~ 5타 + 상대 저항 게이지 · 도약 스택제 (쿨마다 하나씩 충전 · 짧게 뛰면 하나 · 멀리 뛰면 둘 다) / v1.0: 옐로 돌진 출발은 남들과 같게 — 민수 "옐로 돌진도 동일한 배율로 스타트, 남들보다 훨씬 빨라져야 해. 시작은 남들과 같아야 하고" · "잡아서 할퀴는 건 최대 5타까지야. 3 ~ 5타. 상대도 게이지로 저항하는 게 뜨고" · "도약은 쿨타임만큼 스택제도로 … 도약거리를 멀게 하면 두 개 다 쓰고, 짧으면 하나만")
import subprocess, json, re, os
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8830.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 돌진: 출발은 남들과 같게 (×1.2) · 달릴수록 훨씬 빠르게 (×4.0 · 남들 ×2.6) ----------
rep("spd: 3.3, sp0: 0.75, pow: 2.2, full: 5.5", "spd: 4, sp0: 1.2, pow: 1, full: 3.5")
rep("(사족보행 — 처음엔 sp0 × 느리게, 달릴수록 pow 제곱으로 빨라져 full 칸에서 spd × ·", "(사족보행 — 출발은 남들과 같은 sp0 (×1.2), 달릴수록 pow 제곱으로 남들보다 훨씬 빨라져 full 칸에서 spd × (남들은 ×2.6) ·")

# ---------- 달라붙기 난도질: 3 ~ 5타 · 상대 저항 게이지 ----------
rep("yclaw: { rng: 1.3, wind: 0.3, rec: 0.5, hold: 2, cd: 14, tick: 0.2, mul: 0.26, fin: 2.5, brk: 0.2 }",
    "yclaw: { rng: 1.3, wind: 0.3, rec: 0.5, cd: 14, tick: 0.4, nMin: 3, nMax: 5, mul: 0.7, fin: 1.6, brk: 0.2, rBase: 0.5 }", 2)
rep("달라붙기 난도질 (rng 칸 안 · hold 초 동안 tick 초마다 mul × 날붙이 · 마지막 한 번 × fin · 맞은 피해가 최대 체력의 brk 를 넘으면 놓침)",
    "달라붙기 난도질 (rng 칸 안 · tick 초마다 mul × 날붙이 — 3 ~ 5타 (nMin ~ nMax): 상대가 저항 게이지를 채우는 만큼 (상대 무게 · 근력 · 괴력 ÷ 옐로 · rBase 초당) 타수가 정해짐 · 마지막 타 × fin · 맞은 피해가 최대 체력의 brk 를 넘으면 놓침)")
a = P['tail'].index("// 달라붙기 난도질: 붙잡기"); b = P['tail'].index("// 저주:맥아 장판 (양동이 뿌리기)")
P['tail'] = P['tail'][:a] + r'''// 달라붙기 난도질: 붙잡기 (잡아찢기와 같은 틀 — 맞으면 놓침) 동안 tick 초마다 날붙이로 할큄 (막을 수 없음) — 3 ~ 5타. 상대는 저항 게이지 (A.res 0 → 1) 를 채우며 버티고, 가득 차면 풀려남 (마지막 타)
function clawInit(W, u, A, t, S){
  const f = Math.max(0.6, Math.min(1.8, Math.sqrt((t.mass || 70) / Math.max(20, u.mass || 52)))) * (t.might || 1) * (t.strMul || 1), r = (S.rBase || 0.5) * f, tk = S.tick || 0.4;
  A.n = Math.max(S.nMin || 3, Math.min(S.nMax || 5, Math.round(1 / Math.max(0.1, r) / tk))); A.t0r = W.t; A.hn = 0; A.res = 0; A.rate = +r.toFixed(2); A.end = W.t + A.n * tk + 0.12;
}
function clawStep(W, u, dt){
  const A = u.act, S = SPY(W, 'yclaw'), t = W.units[A.held], tk = S.tick || 0.4;
  if (!t || !t.alive){ if (t) t.heldBy = null; u.act = { k: 'spec', s: 'yclaw', b: A.b, phase: 'rec', t0: W.t, end: W.t + (S.rec || 0.5) }; return; }
  A.res = Math.min(1, (W.t - A.t0r) / Math.max(0.1, A.n * tk));
  let n = 0;
  while (A.hn < A.n && W.t >= A.tick && n < 3){ A.tick += tk; A.hn++; n++;
    if (t.side === u.side) continue;
    const last = A.hn === A.n;
    strike(W, u, t, t, 1, false, { mul: (S.mul || 0.7) * (0.9 + 0.2 * W.rand()) * (last ? S.fin || 1.6 : 1), tag: last ? '달라붙어 할큄 — 마지막 일격' : '달라붙어 할큄', wk: '날붙이', grab: true });
    if (W.fxOn) W.fx.push({ k: 'claw', x: t.x, y: t.y, ang: W.rand() * 6.283, t0: W.t, big: last });
    if (!t.alive) break; }
}
function clawDone(W, u, A){
  const S = SPY(W, 'yclaw'), t = W.units[A.held]; u.act = { k: 'spec', s: 'yclaw', b: A.b, phase: 'rec', t0: W.t, end: W.t + (S.rec || 0.5) }; u.atkT = W.t;
  if (!t) return; t.heldBy = null; if (!t.alive) return;
  if (t.side !== u.side){ const d = dist(u, t) || 1; fling(W, u, t, 1.2, (t.x - u.x) / d, (t.y - u.y) / d, { how: '옐로가 박차고 떨어짐' }); }
  L(W, { k: 'clawEnd', a: u.i, b: t.i, n: A.hn || 0, vis: u.side === 0 || t.side === 0 || !!u.seenBy || !!t.seenBy });
}
''' + P['tail'][b:]
rep("A.dmg = 0; A.tick = W.t + (S.tick || 0.2);", "A.dmg = 0; A.tick = W.t + (S.tick || 0.4); if (k === 'yclaw') clawInit(W, u, A, t, S);")
rep("sec: S.hold || 2.2,", "sec: k === 'yclaw' ? +(A.end - W.t).toFixed(1) : S.hold || 2.2, n: A.n || null,")

# ---------- 도약 스택제 (연속 도약) ----------
rep("leap: { chain: 0.3, chainCd: 1.6, dist: 1.7,", "leap: { chain: 0.3, chainCd: 1.6, stackCd: 2.2, dist: 1.7,")
m = re.search(r"function leapCdNext\(W, u, R\)\{[^\n]*\n", P['tail']); assert m
P['tail'] = P['tail'][:m.start()] + '''// v8.8.4 도약 스택 (leapN 2 — 옐로 [연속 도약]): 스택이 쿨 (stackCd) 마다 하나씩 차오름 · 짧게 뛰면 스택 하나 (dist 칸) · 멀리 뛰면 둘 다 (dist × 2 칸) — 스택이 남아 있으면 chain 초 뒤 다시 뛸 수 있고, 다 쓰면 다음 스택이 찰 때까지
function leapCdNext(W, u, R){ const n = u.leapN || 1; if (n <= 1) return R.cd || 1.1; const need = u.leapNeed || 1; u.leapNeed = 0; const cur = u.stk == null ? n : u.stk; u.stk = Math.max(0, cur - need); if (u.stkT == null || cur >= n) u.stkT = W.t + (R.stackCd || 2.2); return u.stk > 0 ? (R.chain || 0.3) : Math.max(0.05, u.stkT - W.t); }
function stepLeapStk(W, u){ const n = u.leapN || 1; if (n <= 1) return; if (u.stk == null){ u.stk = n; return; } if (u.stk >= n){ u.stkT = null; return; } if (u.stkT != null && W.t >= u.stkT){ u.stk++; u.stkT = u.stk < n ? u.stkT + ((W.rules.leap || {}).stackCd || 2.2) : null; if (u.leapCd > W.t) u.leapCd = Math.min(u.leapCd, W.t); } }
''' + P['tail'][m.end():]
rep("  const k = Math.min(1, D / l); let tx = u.x + dx * k, ty = u.y + dy * k;",
    "  const stk = u.leapN >= 2 ? Math.max(1, u.stk == null ? u.leapN : u.stk) : 1, k = Math.min(1, D * stk / l); let tx = u.x + dx * k, ty = u.y + dy * k;   /* v8.8.4 스택 만큼 멀리 */")
rep("  const len = Math.hypot(tx - u.x, ty - u.y); if (boxRock(W, tx, ty, u.r * 0.9) || len < 0.3) return false;",
    "  const len = Math.hypot(tx - u.x, ty - u.y); if (boxRock(W, tx, ty, u.r * 0.9) || len < 0.3) return false;\n  u.leapNeed = u.leapN >= 2 ? Math.min(stk, Math.max(1, Math.ceil(len / D - 0.02))) : 1;   /* v8.8.4 가까우면 스택 하나 · 멀리 찍으면 둘 다 */")
rep("  for (const u of W.units) if (u.alive && u.skill && u.skill.regen > 0 && u.skill.left < u.skill.pool)",
    "  for (const u of W.units) if (u.alive && u.leapN >= 2) stepLeapStk(W, u);   /* v8.8.4 도약 스택 충전 */\n  for (const u of W.units) if (u.alive && u.skill && u.skill.regen > 0 && u.skill.left < u.skill.pool)")
rep("  const LP = W.rules.leap || {}, D = LP.dist || 1.7, mid = u.leapQ != null && u.leapQ > 0 && u.leapQ < u.leapN;", "  const LP = W.rules.leap || {}, D = LP.dist || 1.7, stk = u.stk == null ? u.leapN : u.stk;   /* v8.8.4 스택 */")
rep("  if (g <= u.rng + 0.25 || g > D * 2 + 1.2) return false;", "  if (stk < 1 || g <= u.rng + 0.25 || g > D * stk + 1.2) return false;")
rep("  if (!mid && g > 3.4 && u.canCharge && W.t >= u.chargeCd) return false;", "  if (g > 3.4 && u.canCharge && W.t >= u.chargeCd) return false;")

for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
# ---------- 저장된 수치표: 옛 기본값이면 새 기본값으로 ----------
O = json.load(open(D + 'oldrules.json'))
have = {json.dumps(p) for p, _ in O}
for path, old in [(['claw', 'rush', 'spd'], [3.3]), (['claw', 'rush', 'sp0'], [0.75]), (['claw', 'rush', 'pow'], [2.2]), (['claw', 'rush', 'full'], [5.5]),
                  (['spec', 'yclaw', 'tick'], [0.2]), (['spec', 'yclaw', 'mul'], [0.26]), (['spec', 'yclaw', 'fin'], [2.5]), (['spec', 'ybucket', 'linger'], [1.5])]:
    if json.dumps(path) not in have: O.append([path, old])
json.dump(O, open(D + 'oldrules.json', 'w'), ensure_ascii=False)
print('patch8840 OK')
