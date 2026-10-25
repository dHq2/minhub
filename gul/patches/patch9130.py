# v9.7.1 엔진 — patch9130.py v1.2 (v1.2: 빈손 (창을 던짐 · 무기를 잃음) 은 망치 기동보다 무장 회복 먼저 / v1.1: 자리 없는 뜀 표시 (전우조) 가 적의 기동 단계로 새어 NaN 이 되던 것 고침 / v1.0: 리모델 P1a 1단계 ① 행동 이유 코드 — act2 의 각 단계가 왜 골랐는지 u.why · W.whyN 에 남김 (A 의 6.6) ② 전우조 따라붙기가 싸움 · 전열 버팀을 굶기지 않음 — 위협이 팔 닿을 거리에 있거나 전열에 서 있으면 붙어 가기를 쉼 (같이 물러날 때만 예외) ③ 거구 휘두르기 · 곡사 아끼기의 제 편 오사 허용치를 편과 상관없이 한 기준으로)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9120.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ① 행동 이유 코드
CODES = [('czBrain', 'UNIQUE'), ('h2Brain', 'UNIQUE'), ('gwBrain', 'UNIQUE'), ('ratBrain', 'UNIQUE'), ('porenBrain', 'UNIQUE'), ('emergency', 'EMERGENCY_HEAL'),
         ('evadeMove', 'EVADE'), ('rallyStep', 'RALLY'), ('offStep', 'COMMAND_UNHEARD'), ('hammerStep', 'HAMMER'), ('pinDown', 'PIN_DOWN'), ('pairStep', 'PAIR'),
         ('formStep', 'FORMATION'), ('shadowStep', 'ENEMY_PLAN'), ('suppAct', 'ENEMY_PLAN'), ('patrolStep', 'PATROL'), ('lurkStep', 'AMBUSH'), ('wardenStep', 'WARDEN'),
         ('clearSweep', 'EVADE_AOE'), ('lretStep', 'LINE_RETREAT'), ('withdrawStep', 'ENEMY_PLAN'), ('wedgeStep', 'ENEMY_PLAN'), ('mvStep', 'MANEUVER'), ('holdForm', 'HOLD_FORM'),
         ('tankAI', 'TANK'), ('lineKeep', 'LINE'), ('retrieveSpear', 'PICKUP'), ('scavenge', 'PICKUP'), ('behindCover', 'COVER')]
t = P['tail']; a0 = t.index('function act2('); a1 = t.index('\n}\n', a0); body = t[a0:a1]; n0 = 0
for fn, code in CODES:
    pat = re.compile(r"(\n  if \([^\n]*\b" + fn + r"\(W, u, dt\)[^\n]*?\) )return;")
    m = pat.findall(body); assert len(m) >= 1, fn
    body, k = pat.subn(lambda m: m.group(1) + "return whyS(W, u, '" + code + "');", body); n0 += k
body = body.replace("  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }", "  if (u.side === 0 && u.order){ doOrder(W, u, dt); return whyS(W, u, 'PLAYER_ORDER'); }", 1)
body = body.replace("startReload(W, u); return; }", "startReload(W, u); return whyS(W, u, 'RELOAD'); }", 1)
body = body.replace("setMood(W, u, '약 받는 중'); return; }", "setMood(W, u, '약 받는 중'); return whyS(W, u, 'TAKE_HEAL'); }", 1)
body = body.replace("setMood(W, u, '틈 메움'); goTo(W, u, u.fill.x, u.fill.y, dt); return; }", "setMood(W, u, '틈 메움'); goTo(W, u, u.fill.x, u.fill.y, dt); return whyS(W, u, 'FILL_GAP'); }", 1)
body = body.replace("    fight(W, u, t, dt, see, false);\n", "    fight(W, u, t, dt, see, false); whyS(W, u, u.state === 'fight' ? 'FIGHT' : 'HUNT');\n", 1)
body = body.replace("    if (inReach(u, u.target)) startAct(W, u, u.target); else goTo(W, u, u.target.x, u.target.y, dt);\n", "    if (inReach(u, u.target)) startAct(W, u, u.target); else goTo(W, u, u.target.x, u.target.y, dt); whyS(W, u, 'HEAL');\n", 1)
body = body.replace("{\n", "{\n  u.why = null;   /* v9.7.1 이번 틱에 고른 이유 (아래 단계가 채움 · 못 채우면 그냥 걷기 · 둘러보기) */\n", 1)
assert body.count('whyS(') >= 34, body.count('whyS(')
P['tail'] = t[:a0] + body + t[a1:]
rep("function pairStep(W, u, dt){", """// v9.7.1 행동 이유 (리모델 6.6): 고른 단계의 코드를 남김 — 화면에는 짧은 글로, 시험에는 횟수로
function whyS(W, u, c){ if (c === 'PAIR') c = 'PAIR_' + (u.pairHow || 'link').toUpperCase(); else if (c === 'MANEUVER' && u.mv && u.mv.k === 'jink') c = 'DODGE_AIM';
  u.why = c; u.whyT = W.t; const N = W.whyN || (W.whyN = {}); const k = c + (u.side ? '@1' : '@0'); N[k] = (N[k] || 0) + 1; }
function pairStep(W, u, dt){""")
rep("    if (how !== 'link' && (u.pairLog == null", "    u.pairHow = how; if (how !== 'link' && (u.pairLog == null")
# pairLog 의 '같은 how' 비교는 따로 (pairHow 는 이제 늘 마지막 how)
rep("u.pairHow = how; if (how !== 'link' && (u.pairLog == null || W.t - u.pairLog > 4 || u.pairHow !== how)){ u.pairLog = W.t; u.pairHow = how;",
    "u.pairHow = how; if (how !== 'link' && (u.pairLog == null || W.t - u.pairLog > 4 || u.pairLH !== how)){ u.pairLog = W.t; u.pairLH = how;")

# ② 전우조 따라붙기는 싸움 · 전열 버팀보다 뒤 (같이 물러남은 그대로)
rep("    const back = th && ((LP.x - th.x) * vx + (LP.y - th.y) * vy) / (dist(LP, th) || 1) > sp * 0.5;   /* v9.6.5 짝이 적에게서 물러나는 중 */",
"""    const back = th && ((LP.x - th.x) * vx + (LP.y - th.y) * vy) / (dist(LP, th) || 1) > sp * 0.5;   /* v9.6.5 짝이 적에게서 물러나는 중 */
    if (!back && d0 < 2.5){   /* v9.7.1 중재: 팔이 닿을 만한 적이 보이거나 · 전열에 서서 적을 마주하면 붙어 가기를 쉼 (싸움 · 막기 · 전열 버팀이 먼저) */
      const near = W.units.some(f => f.alive && !f.gone && !f.down && f.side !== u.side && (u.side === 0 ? (f.seenBy || canSee(W, u, f)) : canSee(W, u, f)) && gap(u, f) < Math.max(f.rng, u.rng) + 1.2);
      const lineHold = u.line && W.units.some(f => f.alive && !f.gone && !f.down && f.side !== u.side && dist(u, f) < 4.5 && (u.side === 0 ? (f.seenBy || canSee(W, u, f)) : canSee(W, u, f)));
      if (near || lineHold){ u.pairOn = false; u.pairYield = near ? 'threat' : 'line'; if (u.mv && u.mv.k === 'pair') u.mv = null; return false; } }""")
# 뜀 표시 (k: 'pair' · 'crun') 는 자리 (x, y) 가 없음 — 적의 기동 단계가 그 자리로 가려다 NaN 이 되지 않게
rep("  const M = u.mv, T = M.b != null ? W.units[M.b] : null;\n  if (M.k === 'kite'){", "  const M = u.mv, T = M.b != null ? W.units[M.b] : null;\n  if (M.x == null && !['surround', 'rally', 'bguard', 'cut', 'close', 'pace', 'rush', 'near', 'interpose', 'lead', 'follow', 'cover', 'feint'].includes(M.k)) return false;   /* v9.7.1 자리 없는 뜀 표시 (전우조 · 따라감) 는 기동이 아님 */\n  if (M.k === 'kite'){")

# ③ 제 편 오사 허용치 — 편과 상관없이
rep("  if (u.side === 1 && F.length < 2){   // v6.0 숙련된 용병:", "  if (F.length < 2){   /* v9.7.1 양쪽 같은 기준 */   // v6.0 숙련된 용병:")
rep("  if (M.length) D -= 1.5 * (1.2 - u.bold) + (u.side === 1 ? 2.5 : 0);", "  if (M.length) D -= 1.5 * (1.2 - u.bold) + 2.5;   /* v9.7.1 양쪽 같은 기준 */")
rep("const f = arcRisk(W, u, t, fly); if (f.p <= (u.side === 1 && !isFar(t) && pHp(W, u.side, t) >= 0.3 ? 0.12 : 0.2)) return false;", "const f = arcRisk(W, u, t, fly); if (f.p <= (!isFar(t) && pHp(W, u.side, t) >= 0.3 ? 0.12 : 0.2)) return false;   /* v9.7.1 양쪽 같은 기준 */")
# 망치 (옆 · 뒤로 돌기) 는 손에 무기가 있을 때만 — 창을 던졌거나 무기를 잃은 몸은 먼저 무장 회복 (짐승의 이빨 · 발톱은 무기로 셈)
rep("  if (W.t < (u.hmCd || 0)) return false;\n  let t = u.hmS", "  if (W.t < (u.hmCd || 0)) return false;\n  if (unarmed(u) && !ITEM_NATURAL.includes(u.weapon)) return false;   /* v9.7.1 빈손은 망치보다 무장 회복이 먼저 */\n  let t = u.hmS")
rep("module.exports = { jinkStep,", "module.exports = { whyS, jinkStep,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9130 OK', n0)
