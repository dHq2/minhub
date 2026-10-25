# v9.9.3 엔진 — patch9220.py v1.0 (v1.0: ① 지원 추종 (치유 · 사수 부하): 돌지 않고 대장 등 뒤에 딱 붙음 · 사수가 나를 겨누면 대장을 방패 삼는 자리로 뛰어감 · 치료가 먼저 · 쏠 수 있을 때만 쏨 (빼꼼 포함) — 그 밖엔 자리 지킴 ② 돌격이 대장 · 전우에게 오면 부하 · 전우는 (사수 · 치유도) 4.5칸 안에서 달려와 등 뒤를 받침 — 양쪽 편 같음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9210.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# ② 돌격 받침: 대장 · 전우면 지원 인력도 · 4.5칸
rep("  if (AI6.includes('cbrace') || isFar(u) || u.cls === '치유' || u.crawl || u.lie || u.kb || u.act || W.t < u.proneT || u.down || (u.stunT && W.t < u.stunT)) return false;\n  let best = null;",
    "  if (AI6.includes('cbrace') || u.crawl || u.lie || u.kb || u.act || W.t < u.proneT || u.down || (u.stunT && W.t < u.stunT)) return false;\n  const sup = isSupport(u); let best = null;   /* v9.9.3 사수 · 치유는 대장 · 전우일 때만 */")
rep("    if (!t || t === u || !t.alive || t.side !== u.side || t.down || dist(u, t) > 2.2 || !(u.side === 0 ? (e.seenBy || canSee(W, u, e)) : canSee(W, u, e))) continue;",
    "    const rel = (u.chiefLk && u.sqLead === t.i) || (u.cg && t.cg === u.cg); if (!t || t === u || !t.alive || t.side !== u.side || t.down || (sup && !rel) || dist(u, t) > (rel ? 4.5 : 2.2) || !(u.side === 0 ? (e.seenBy || canSee(W, u, e)) : canSee(W, u, e))) continue;")
rep("  if (Math.hypot(p.x - u.x, p.y - u.y) > 0.08) goTo(W, u, p.x, p.y, dt); else stop(u);\n  u.fg = Math.atan2(e.y - u.y, e.x - u.x); u.wantT = W.t; if (u.canGuard",
    "  if (Math.hypot(p.x - u.x, p.y - u.y) > 0.08){ if (Math.hypot(p.x - u.x, p.y - u.y) > 1.2) u.mv = { k: 'crun', run: true, until: W.t + 0.35 }; goTo(W, u, p.x, p.y, dt); } else stop(u);\n  u.fg = Math.atan2(e.y - u.y, e.x - u.x); u.wantT = W.t; if (u.canGuard")
# ① 지원 추종
rep("  const heal = u.cls === '치유', ft = C.target", "  const heal = isSupport(u), ft = C.target")
rep("  if (busyHere()) return false;   // 내 손 · 사선에 적 — 제 싸움 (끝나면 다시 등 뒤로)",
"""  if (heal){   /* v9.9.3 지원 추종 (치유 · 사수): 돌지 않고 등 뒤 · 겨눠지면 대장을 방패로 · 쏠 수 있을 때만 쏨 */
    const g = shooterOn(W, u); if (g && g !== C){ const d = dist(C, g) || 1, x = C.x + (C.x - g.x) / d * (C.r + u.r + 0.05), y = C.y + (C.y - g.y) / d * (C.r + u.r + 0.05);
      if (Math.hypot(x - u.x, y - u.y) > 0.12){ u.pairHow = 'cover'; return go(x, y, true, 'link', C, null); } }
    if (W.units.some(f => seenF(f) && gap(u, f) < Math.max(u.rng, 0.5) + 0.3 && !isFar(u))) return false;   // 코앞 적은 쳐냄
    if (isFar(u) && u.cls !== '치유'){ const know = knows(W, u); if (W.units.some(f => seenF(f) && dist(u, f) <= u.rng + 0.3 && losClear(W.map, u.x, u.y, f.x, f.y) && firstOnLineP(W, u, f, know) === f)) return false; } }   // 쏠 수 있음 → 쏨 (빼꼼 포함)
  else if (busyHere()) return false;   // 내 손 · 사선에 적 — 제 싸움 (끝나면 다시 등 뒤로)""")
rep("  const R = C.r + u.r + (heal ? 0.9 : 0.08), sx =", "  const R = C.r + u.r + (heal && !isFar(u) ? 0.3 : 0.06), sx =")
rep("function chargeBrace(W, u, dt){", "// v9.9.3 지원 인력: 사수 · 근접 무구가 없는 치유 (치유라도 창 · 방패를 쥐면 보병처럼)\nconst isSupport = u => isFar(u) || (u.cls === '치유' && !u.shield && !u.armShield && (unarmed(u) || !u.canGuard));\nfunction chargeBrace(W, u, dt){")
rep("  if (u.cls === '치유') chg = null;   /* v9.9.1 치유는 짝의 돌격을 따라 뛰어들지 않음 */\n  if (!chg && !isFar(u) && u.cls !== '치유'){", "  if (isSupport(u)) chg = null;   /* v9.9.1 지원 인력은 짝의 돌격을 따라 뛰어들지 않음 (v9.9.3 장비로 판단) */\n  if (!chg && !isFar(u) && !isSupport(u)){")
rep("module.exports = { peekSpot,", "module.exports = { isSupport, peekSpot,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9220 OK')
