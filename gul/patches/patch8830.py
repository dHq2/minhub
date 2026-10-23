# v8.8.3 엔진 — patch8830.py v1.0 (v1.0: 양동이 뿌리기 다시 — 민수 "양동이는 확실히 틱 피해가 들어가거나 부상에 가시적으로 나와줘야 하고, 아군 적군 모두 피해받는 장판기야")
#   맥아 장판: 아군 · 적군 · 누구나 (뿌린 옐로만 빼고 — 핏빛 장판과 같음) → 맥아 상태 (u.malt — 화상 틀: 초당 피해 · 장판을 나간 뒤에도 잠시) + 부상 (woundAdd — 단계마다 늘어남) + 떠오르는 숫자
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8820.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 수치표: 초당 피해 · 남는 때 · 부상 단계 ----------
rep("slow: 0.55, melt: 0.3, dot: 2.5, linger: 1.5 }", "slow: 0.55, melt: 0.3, dps: 5, linger: 2, stage: 2.5 }", 2)
rep("걸음 × slow · 받는 피해 +melt · 초당 dot × 2) */", "걸음 × slow · 받는 피해 +melt · 초당 dps (누구나 — 아군도 · 옐로만 빼고) · 나간 뒤 linger 초 더 · 안에 stage 초 있을 때마다 부상 한 단계 더) */")

# ---------- 맥아 장판: 누구나 · 맥아 상태 · 부상 ----------
a = P['tail'].index("// 저주:맥아 장판 (양동이 뿌리기)")
b = P['tail'].index("// 옐로의 돌진 맞음")
NEW = r'''// 저주:맥아 장판 (양동이 뿌리기): 안에 선 모두 (아군도 · 뿌린 옐로만 빼고) 에게 <저주:맥아> — 걸음 느려짐 · 받는 피해 + · 살이 녹음 (초당 dps — 화상과 같은 틀의 상태 u.malt · 장판을 나간 뒤 linger 초 더) · 부상이 한 단계씩 쌓임 (woundAdd)
const MALT_W = [['맥아에 살이 무름', ['받는 피해 +30%', '걸음 ×0.55']], ['살갗이 녹아내림', ['살이 녹는 중']], ['살이 문드러짐', ['살이 녹는 중']], ['뼈가 드러남', ['살이 녹는 중']]];
function maltWound(W, P, e, st){ const w = MALT_W[Math.min(st, 3)], by = W.units[P.by] || null; woundAdd(W, by, e, 'malt', w[0], w[1], { fx: st ? '맥아 부식' : null }); }
function stepMalt(W, P, dt){
  const Sy = SPY(W, 'ybucket');
  for (const e of W.units){ if (!e.alive || e.i === P.by || e.fairyW) continue;
    const d = Math.hypot(e.x - P.x, e.y - P.y); if (d > P.r + e.r * 0.5) continue;
    const was = e.malt && W.t < e.malt.until;
    e.malt = { dps: Sy.dps || 5, until: W.t + (Sy.linger || 2), by: P.by }; e.maltT = e.malt.until;
    if (!was){ e.maltExp = 0; e.maltStage = 0; L(W, { k: 'maltOn', a: P.by, b: e.i, ff: e.side === P.side, vis: e.side === 0 || P.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.3, s: '저주:맥아', c: 'g', t0: W.t }); maltWound(W, P, e, 0); }
    else { e.maltExp = (e.maltExp || 0) + dt; const st = Math.min(3, Math.floor(e.maltExp / (Sy.stage || 2.5))); if (st > (e.maltStage || 0)){ e.maltStage = st; maltWound(W, P, e, st); } }
    if (!e.flee && !e.down && !e.kb && !(e.side === 0 && e.order) && !(e.act && e.act.phase !== 'wind')){ const a = d > 0.05 ? Math.atan2(e.y - P.y, e.x - P.x) : W.rand() * 6.283, Dd = P.r + e.r + 0.4;   /* 장판을 본 쪽은 밖으로 피함 (핏빛 장판과 같음 — 명령 받은 아군은 그대로) */
      e.flee = { x: Math.max(0.6, Math.min(W.map.W - 0.6, P.x + Math.cos(a) * Dd)), y: Math.max(0.6, Math.min(W.map.H - 0.6, P.y + Math.sin(a) * Dd)), until: W.t + 1.2 }; }
  }
}
// 맥아 상태: 매 순간 초당 피해 (화상처럼 갑옷과 상관없이 살이 녹음) · 숫자가 떠오름 · 죽으면 '맥아 부식'
function stepMaltDot(W, u, dt){
  const m = u.malt; if (!m) return;
  if (W.t >= m.until){ u.malt = null; u.maltT = null; u.maltAcc = 0; L(W, { k: 'maltStop', a: u.i, vis: u.side === 0 || !!u.seenBy }); return; }
  const d = m.dps * dt * (mbOn(W, u) ? mbF(W, u, 'dmg') : 1); u.maltDmg = (u.maltDmg || 0) + d; u.maltAcc = (u.maltAcc || 0) + d;
  if (u.hp - d < 0.5){ const by = W.units[m.by] || u; u.malt = null; u.maltT = null; applyDmg(W, by, u, Math.max(1, Math.ceil(u.hp)), { ff: by !== u && by.side === u.side, far: false, part: null, tag: '맥아 부식' }); return; }
  u.hp -= d;
  if (u.maltAcc >= 2){ if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y - 0.1, s: '-' + Math.round(u.maltAcc), c: 'g', t0: W.t }); u.maltAcc = 0; }
}
'''
P['tail'] = P['tail'][:a] + NEW + P['tail'][b:]
rep("if (P.kind === 'malt'){ stepMalt(W, P); continue; }", "if (P.kind === 'malt'){ stepMalt(W, P, dt); continue; }")
rep("  for (const u of W.units) if (u.alive && u.burn) stepBurn(W, u, dt);   // v6.7 화상", "  for (const u of W.units) if (u.alive && u.burn) stepBurn(W, u, dt);   // v6.7 화상\n  for (const u of W.units) if (u.alive && u.malt) stepMaltDot(W, u, dt);   /* v8.8.3 맥아 (저주) */")
# 치료로 모두 나으면 맥아도 (화상과 같은 줄)
rep("t.burn = null; t.koT = null;", "t.burn = null; t.malt = null; t.maltT = null; t.koT = null;")
# 스스로 뿌릴 때: 동료가 장판에 걸리지 않게
rep("&& !W.units.some(a => a.alive && a.side === u.side && a !== u && a.hp / a.max < 0.4)){",
    "&& !W.units.some(a => a.alive && a.side === u.side && a !== u && a.hp / a.max < 0.4) && !W.units.some(a => a.alive && a.side === u.side && a !== u && Math.hypot(a.x - t.x, a.y - t.y) <= (B.r || 1.6) + a.r + 0.7)){   /* v8.8.3 동료도 맞으니 곁에 동료가 없는 자리에만 */")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch8830 OK')
