# v9.6.4 엔진 — patch9100.py v1.0 (v1.0: ① 전우조 · 대장-부하는 3칸 넘게 떨어지지 않으려 함 — 멀어지면 짝 (부하는 대장) 의 측후방으로 (짝이 뛰거나 많이 멀면 질주) ② 짝이 돌격하면 서둘러 돌격 대상의 옆구리로 질주해 함께 침 (사수는 짝의 측후방) · 맞붙어 싸우는 중 · 명령을 받은 몸은 그대로 · 양쪽 편 같은 규칙 ③ 줍기 명령에 서둘러 (hurry) — 뛰어서 주우러 감)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9090.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠\n",
    "  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠\n  if (!u.order && pairStep(W, u, dt)) return;   /* v9.6.4 전우조 · 대장 곁으로 (돌격하면 옆구리로) */\n")
rep("const pactFreeM = (W, u) =>", """// v9.6.4 짝 붙어 다니기: 전우 (서로) · 대장 (부하만 따라감). 짝이 돌격하면 그 대상의 옆구리로 질주 · 3칸 넘게 멀어지면 짝의 측후방으로
const pairBusy = (W, u) => !u.alive || u.gone || u.down || u.crawl || u.lie || u.kb || u.heldBy != null || W.t < (u.proneT || -9) || W.t < (u.stunT || -9) || (u.flee && W.t < u.flee.until) || u.summon;
function pairStep(W, u, dt){
  if ((!u.cg && !u.chiefLk) || pairBusy(W, u) || u.cls === '치유' && u.act) return false;
  const K = W.rules.cmates || {}, keep = K.keep || 3, PS = [...matesOf(W, u), ...(chiefOfU(W, u) ? [chiefOfU(W, u)] : [])].filter(p => !p.down && !p.crawl && !p.gone);
  if (!PS.length) return false;
  const eng = W.units.some(f => f.alive && !f.gone && f.side !== u.side && !f.down && gap(u, f) < Math.max(u.rng, 0.5) + 0.35);   // 맞붙어 싸우는 중이면 그 자리 싸움
  let chg = PS.find(p => p.act && p.act.k === 'charge' && p.act.b != null && W.units[p.act.b] && W.units[p.act.b].alive), T0 = chg ? W.units[chg.act.b] : null;
  if (chg) u.pairFl = { p: chg.i, b: T0.i, until: W.t + 3 };   // 돌격이 부딪혀 끝나도 3초 동안 옆구리 임무를 이어감
  else if (u.pairFl && W.t < u.pairFl.until){ const P2 = W.units[u.pairFl.p], T2 = W.units[u.pairFl.b]; if (P2 && P2.alive && !P2.down && T2 && T2.alive && !T2.down && PS.includes(P2)){ chg = P2; T0 = T2; } else u.pairFl = null; }
  const go = (x, y, run, how, p, t) => { x = Math.max(0.7, Math.min(W.map.W - 0.7, x)); y = Math.max(0.7, Math.min(W.map.H - 0.7, y)); if (boxRock(W, x, y, u.r * 0.9)){ const q = freeSpot(W, x, y, u.r); if (!q) return false; x = q.x; y = q.y; }
    u.stay = null; if (run) u.mv = { k: 'pair', run: true, until: W.t + 0.35 };
    if (u.pairLog == null || W.t - u.pairLog > 4 || u.pairHow !== how){ u.pairLog = W.t; u.pairHow = how; L(W, { k: 'pairGo', a: u.i, b: p.i, tg: t ? t.i : null, how, run: !!run, chief: !isMateOf(u, p), vis: u.side === 0 || !!u.seenBy }); }
    setMood(W, u, how === 'flank' ? (t ? t.name + '의 옆구리로 — ' : '') + p.name + '와 함께' : p.name + ' 곁으로', t ? t.i : null); goTo(W, u, x, y, dt); return true; };
  if (chg && !eng){ const T = T0;
    if (!isFar(u) && T.side !== u.side){   // 돌격 대상의 옆구리 (짝이 오는 쪽에서 90° 돈 쪽 · 내가 있는 쪽으로)
      const a0 = Math.atan2(chg.y - T.y, chg.x - T.x), s = Math.sin(Math.atan2(u.y - T.y, u.x - T.x) - a0) >= 0 ? 1 : -1, fa = a0 + s * 1.57, R = T.r + u.r + Math.max(0.25, u.rng * 0.7);
      const fx = T.x + Math.cos(fa) * R, fy = T.y + Math.sin(fa) * R;
      if (gap(u, T) < u.rng + 0.35 && angDiff(Math.atan2(u.y - T.y, u.x - T.x), fa) < 0.7){ u.target = T; u.state = 'hunt'; u.pairFl = null; return false; }   // 자리 잡음 → 침
      return go(fx, fy, true, 'flank', chg, T); }
    const f = chg.face || 0, s = Math.sin(Math.atan2(u.y - chg.y, u.x - chg.x) - f) >= 0 ? 1 : -1;   // 사수: 짝의 측후방
    if (dist(u, chg) > 2.2) return go(chg.x - Math.cos(f) * 1.4 + Math.cos(f + s * 1.57) * 1.1, chg.y - Math.sin(f) * 1.4 + Math.sin(f + s * 1.57) * 1.1, true, 'rear', chg, null);
    return false; }
  if (eng) return false;
  const far = PS.filter(p => dist(u, p) > (u.pairOn ? keep - 0.8 : keep)).sort((a, b) => dist(u, b) - dist(u, a))[0];   // 멀어진 짝 (다가가는 중엔 2.2칸까지)
  if (!far){ u.pairOn = false; return false; }
  if (W.units.some(f => f.alive && !f.gone && f.side !== u.side && u.target === f && gap(u, f) < u.rng + 1.2)) return false;   // 막 치려는 적이 코앞
  u.pairOn = true; const f = far.face || 0, s = Math.sin(Math.atan2(u.y - far.y, u.x - far.x) - f) >= 0 ? 1 : -1;
  return go(far.x - Math.cos(f) * 1.1 + Math.cos(f + s * 1.57) * 1.0, far.y - Math.sin(f) * 1.1 + Math.sin(f + s * 1.57) * 1.0, running(W, far) || dist(u, far) > keep + 1.5, 'keep', far, null);
}
const pactFreeM = (W, u) =>""")
# 줍기 서둘러
rep("    setMood(W, u, it.name + ' 주우러'); goTo(W, u, it.x, it.y, dt); return;",
    "    if (o.hurry) u.mv = { k: 'pick', run: true, until: W.t + 0.35 };   /* v9.6.4 두 번 눌러 서둘러 */\n    setMood(W, u, it.name + (o.hurry ? ' 서둘러 주우러' : ' 주우러')); goTo(W, u, it.x, it.y, dt); return;")
rep("module.exports = { tgIn,", "module.exports = { pairStep, tgIn,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9100 OK')
