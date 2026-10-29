# v9.14.0 엔진 — patch9350.py v1.2 (v1.6: 임명한 지휘관 (⚜) 이 지휘 전달망의 우두머리 (cmdBoss) · v1.5: 손 닿는 상대를 두고 던질 자리 찾기로 물러서지 않음 · 대열 자리에 서 있어도 닿는 상대는 찌름 ·  창 대열 자리가 방패병 몸 양옆으로 (역장이 방패병 앞에 붙어 다녀 가운데 자리가 방패병과 겹쳐 뒤로 밀리고 못 찌르던 것) · v1.4: 역장을 펼친 방패병은 걸음 × 0.35 · 적이 역장 2.2칸 안이면 버팀 (천천히 — 너무 빨리 밀고 나가 뒤의 창이 못 찌르던 것) · v1.3: 상대를 훑는 곳 (살아 있고 · 다른 편) 모두에 비선공 거름 (100곳 넘게 — 하나하나 찾던 것을 한 번에) · v1.2: 탱커 판단 · 다른 표적 각 잡기에서도 비선공 상대는 뺌 · 어느 길로 고른 표적이든 비선공 상대면 놓음 (싸우는 중 · 기술 · 줄 서기 · 사선 — 생각 밖 길에서도) · 도발은 일부러 노린 공격만 (곁불 · 빗나간 휩쓸기는 아님) · v1.1: 정리 · 승패 셈에서 도발 안 된 비선공 제3세력은 빠짐 (남아 있어도 맵 정리) · v1.0: 제3세력의 비선공 (peace0) — 우리 편 (0편) 에게 먼저 덤비지 않고 · 우리 편도 스스로 노리지 않음 · 우리 편이 치면 (맞히거나 · 지정해 공격 명령) 그 몸과 전우조가 함께 적대 (prov0) · 다른 편 (망자 · 암계) 과는 그대로 싸움)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9340.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("  const R = W.rules, foes = W.units.filter(f => f.alive && f.side !== u.side);", "  const R = W.rules, foes = W.units.filter(f => f.alive && f.side !== u.side && !peaceP(u, f));   /* v9.14.0 비선공 제3세력 */")
rep("  let b = null, bd = 1e9; for (const f of W.units) if (f.alive && f.side !== u.side){ const s = u.sense[f.i],", "  let b = null, bd = 1e9; for (const f of W.units) if (f.alive && f.side !== u.side && !peaceP(u, f)){ const s = u.sense[f.i],")
rep("function applyDmg(W, u, t, dmg, o){\n", "function applyDmg(W, u, t, dmg, o){\n  if (u && t && u.side === 0 && t.peace0 && !t.prov0 && dmg > 0 && (u.target === t || (u.order && u.order.b === t.i))) provoke0(W, t, u);   /* v9.14.0 우리 편이 일부러 치면 적대 (곁불은 아님) */\n")
rep("    if (doThink && !u.act) think(W, u);\n", "    if (u.target && peaceP(u, u.target)) peaceDrop(u);   /* v9.14.0 비선공 상대는 어느 길로 골랐든 놓음 */\n    if (doThink && !u.act) think(W, u);\n")
rep("function hitCover(W, u, dt){", """// v9.14.0 비선공 제3세력: 0편과 서로 먼저 노리지 않음 (도발되면 끝) · 도발은 그 몸의 전우조까지
const peaceP = (a, b) => (a.peace0 && !a.prov0 && b.side === 0) || (b.peace0 && !b.prov0 && a.side === 0);
function provoke0(W, t, by){ const G = W.units.filter(o => o === t || (t.cg && o.cg === t.cg && o.side === t.side)); for (const o of G){ if (o.prov0) continue; o.prov0 = true; if (by && o.alive){ o.target = by; o.state = 'hunt'; } } L(W, { k: 'provoke', a: by ? by.i : null, b: t.i, n: G.length, vis: true }); }
function bfWalk(W, u){ if (!u.bfT || W.t >= u.bfT) return 1; const F = (W.sf8 || []).find(f => f.by === u.i && f.hard && W.t < f.until); if (!F) return 1; return W.units.some(e => e.alive && e.side !== u.side && !peaceP(u, e) && Math.hypot(e.x - F.x, e.y - F.y) < 2.2) ? 0 : 0.35; }\nfunction peaceDrop(u){ const t = u.target; u.target = null; if (u.act && t && (u.act.b === t.i || u.act.t === t || u.act.tg === t)) u.act = null; if (u.state === 'fight') u.state = u.side === 0 ? 'idle' : 'hunt'; }
function hitCover(W, u, dt){""")
rep("const a = W.units.some(u => u.alive && u.side === 0), b = W.units.some(u => u.alive && u.side >= 1);", "const a = W.units.some(u => u.alive && u.side === 0), b = W.units.some(u => u.alive && u.side >= 1 && !(u.peace0 && !u.prov0));   /* v9.14.0 비선공 제3세력은 빼고 셈 */")
rep("b = W.units.some(u => up(u) && u.side >= 1);", "b = W.units.some(u => up(u) && u.side >= 1 && !(u.peace0 && !u.prov0));")
rep("  const f0 = W.units.filter(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f))).sort(", "  const f0 = W.units.filter(f => f.alive && f.side !== u.side && !peaceP(u, f) && (u.side === 0 ? f.seenBy : canSee(W, u, f))).sort(")
rep("    for (const f of W.units.filter(f => f.alive && f !== t && f.side !== u.side && !f.down && (know(f)", "    for (const f of W.units.filter(f => f.alive && f !== t && f.side !== u.side && !peaceP(u, f) && !f.down && (know(f)")
rep("  const A = W.units[P.a], X = W.units[P.x];\n", "  const A = W.units[P.a], X = W.units[P.x];\n  if (X && peaceP(u, X)) return false;   /* v9.14.0 비선공 상대에겐 약속 없음 */\n")
rep(".filter(f => f.side !== u.side && !isFar(f) && !W.hm.pins.get(f.i).includes(u.i) && dist(u, f) < 9", ".filter(f => f.side !== u.side && !peaceP(u, f) && !isFar(f) && !W.hm.pins.get(f.i).includes(u.i) && dist(u, f) < 9")
rep("const spdNow = (W, u) => spdNow0(W, u) *", "const spdNow = (W, u) => spdNow0(W, u) * bfWalk(W, u) *   /* v9.14.0 역장을 펼친 채로는 천천히 · 적이 역장에 닿으면 버팀 (방패벽 — 뒤의 창이 찌름) */")
rep("const k = M.indexOf(u); if (k < 0) return false; const n = M.length, sp = Math.min(1.15, (F.h * 2 - 0.8) / Math.max(1, n - 1)), a0 = (k - (n - 1) / 2) * sp;",
    "const k = M.indexOf(u); if (k < 0) return false; const n = M.length, sp = Math.min(1.15, (F.h * 2 - 0.8) / Math.max(1, n - 1)); let a0 = (k - (n - 1) / 2) * sp;\n  { const B = F.follow ? W.units[F.by] : null; if (B && B !== u && B.alive){ const bA = al(B), gp = B.r + u.r + 0.15, nl = Math.floor(n / 2);   /* v9.14.0 역장이 방패병 앞에 붙어 다니니 가운데 자리는 방패병 몸 — 그 양옆으로 나란히 */\n    a0 = k < nl ? bA - gp - (nl - 1 - k) * sp : bA + gp + (k - nl) * sp; } }")
rep("  if (Math.hypot(sx - u.x, sy - u.y) < 0.3){ u.goal = null; u.path = null; setMood(W, u, '대열', t.i); return true; }   // 자리에 섬 — 상대가 닿으면 보통 싸움이 이어서 처리\n  if (gap(u, t) <= u.rng + 0.2) return false;   // 이미 닿는 상대가 있으면 대열보다 일격\n",
    "  if (gap(u, t) <= u.rng + 0.02) return false;   // 이미 닿는 상대가 있으면 대열보다 일격 (v9.14.0 자리에 서 있어도 — 예전엔 자리에 서면 닿아도 안 찔렀음)\n  if (Math.hypot(sx - u.x, sy - u.y) < 0.3){ u.goal = null; u.path = null; setMood(W, u, '대열', t.i); return true; }   // 자리에 섬\n")
rep("  if (!dt || !t || gap(u, t) > J.rng + 0.5) return false;   // v5.4.3 명령이어도 사선을 찾아 비켜섬\n", "  if (!dt || !t || gap(u, t) > J.rng + 0.5) return false;   // v5.4.3 명령이어도 사선을 찾아 비켜섬\n  if (!ordered && inReach(u, t)) return false;   /* v9.14.0 손이 닿는 상대를 두고 던질 자리를 찾아 물러서지 않음 (그대로 찌름) */\n")
rep(".sort((a, b) => b.cmd - a.cmd || (b.rank === '부대장' ? 1 : 0) - (a.rank === '부대장' ? 1 : 0) || (a.cmdTmp ? 1 : 0) - (b.cmdTmp ? 1 : 0))[0] || null;", ".sort((a, b) => (b.cmdHat ? 1 : 0) - (a.cmdHat ? 1 : 0) || b.cmd - a.cmd || (b.rank === '부대장' ? 1 : 0) - (a.rank === '부대장' ? 1 : 0) || (a.cmdTmp ? 1 : 0) - (b.cmdTmp ? 1 : 0))[0] || null;   /* v9.14.2 임명한 지휘관이 지휘 전달망의 우두머리 (예전엔 지휘 등급이 높은 이가 그대로 — 임명이 표시뿐이었음) */")
rep("module.exports = { supDash,", "module.exports = { peaceP, provoke0, supDash,")
import re
# v1.3 상대를 훑는 곳 (살아 있고 · 다른 편) 모두에 비선공 거름 — 표적 · 위협 · 전선 · 각 잡기 · 망치 · 약속 …
nP = 0
for k in P:
    P[k], c = re.subn(r"\b(\w+)\.alive && \1\.side !== u\.side(?! && !peaceP)", lambda m: m.group(0) + " && !peaceP(u, %s)" % m.group(1), P[k]); nP += c
assert nP > 100, nP
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9350 OK')
