# v9.6.5 엔진 — patch9110.py v1.0 (v1.0: 전우조는 한 몸처럼 — 짝이 스스로 움직이면 (명령 · 뜀 · 걸음) 바로 연동돼 따라붙고, 늘 1 ~ 1.5칸 안 어깨 옆 (가는 쪽의 옆 1.1칸) 에 붙어 다님 · 1.5칸 넘게 벌어지면 곧바로 붙음 (멀거나 짝이 뛰면 질주) · 짝을 따르는 걸음끼리는 서로 끌지 않음 · 대장-부하는 3칸 그대로 · 양쪽 편 같은 규칙)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9100.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("""  if (eng) return false;
  const far = PS.filter(p => dist(u, p) > (u.pairOn ? keep - 0.8 : keep)).sort((a, b) => dist(u, b) - dist(u, a))[0];   // 멀어진 짝 (다가가는 중엔 2.2칸까지)
  if (!far){ u.pairOn = false; return false; }
  if (W.units.some(f => f.alive && !f.gone && f.side !== u.side && u.target === f && gap(u, f) < u.rng + 1.2)) return false;   // 막 치려는 적이 코앞
  u.pairOn = true; const f = far.face || 0, s = Math.sin(Math.atan2(u.y - far.y, u.x - far.x) - f) >= 0 ? 1 : -1;
  return go(far.x - Math.cos(f) * 1.1 + Math.cos(f + s * 1.57) * 1.0, far.y - Math.sin(f) * 1.1 + Math.sin(f + s * 1.57) * 1.0, running(W, far) || dist(u, far) > keep + 1.5, 'keep', far, null);
}""", """  if (eng) return false;
  if (W.units.some(f => f.alive && !f.gone && f.side !== u.side && u.target === f && gap(u, f) < u.rng + 0.3)) return false;   // 팔이 닿는 적을 치는 중
  // v9.6.5 전우: 한 몸처럼 — 짝이 스스로 움직이면 (명령 · 뜀 · 걸음) 바로 따라붙고, 1.5칸 넘게 벌어지면 곧장 어깨 옆으로 (1 ~ 1.5칸)
  const selfMove = p => !(p.pairT != null && W.t - p.pairT < 0.25) && ((p.order && p.order.k !== 'hold') || (running(W, p) && !(p.mv && p.mv.k === 'pair')) || Math.hypot(p.vx || 0, p.vy || 0) > 0.3);
  const MS = matesOf(W, u).filter(p => !p.down && !p.crawl && !p.gone);
  const LP = MS.filter(selfMove).sort((a, b) => dist(u, a) - dist(u, b))[0] || MS.filter(p => dist(u, p) > (u.pairOn ? 1.15 : 1.5)).sort((a, b) => dist(u, b) - dist(u, a))[0];
  if (LP){ const vx = LP.vx || 0, vy = LP.vy || 0, sp = Math.hypot(vx, vy), f = sp > 0.3 ? Math.atan2(vy, vx) : LP.face || 0, s = Math.sin(Math.atan2(u.y - LP.y, u.x - LP.x) - f) >= 0 ? 1 : -1;
    const x = LP.x + vx * 0.35 + Math.cos(f + s * 1.57) * 1.1 - Math.cos(f) * 0.15, y = LP.y + vy * 0.35 + Math.sin(f + s * 1.57) * 1.1 - Math.sin(f) * 0.15;
    if (Math.hypot(x - u.x, y - u.y) < 0.2 && sp < 0.3){ u.pairOn = false; return false; }
    u.pairOn = true; u.pairT = W.t; const d0 = dist(u, LP);
    return go(x, y, running(W, LP) || d0 > 2.5 || sp > u.spd * 0.85, d0 > 2.5 ? 'keep' : 'link', LP, null); }
  u.pairOn = false;
  // 부하: 대장에게서 3칸 넘게 떨어지지 않음 (측후방)
  const C = chiefOfU(W, u); if (!C || C.down || C.crawl || C.gone) return false;
  if (dist(u, C) <= (u.pairOnC ? keep - 0.8 : keep)){ u.pairOnC = false; return false; }
  u.pairOnC = true; const f = C.face || 0, s = Math.sin(Math.atan2(u.y - C.y, u.x - C.x) - f) >= 0 ? 1 : -1;
  return go(C.x - Math.cos(f) * 1.1 + Math.cos(f + s * 1.57) * 1.0, C.y - Math.sin(f) * 1.1 + Math.sin(f + s * 1.57) * 1.0, running(W, C) || dist(u, C) > keep + 1.5, 'keep', C, null);
}""")
# 연동 걸음 (link) 은 로그에 남기지 않음 — 벌어졌다 붙을 때 (keep) · 돌격 옆구리 (flank) 만
rep("    u.stay = null; if (run) u.mv = { k: 'pair', run: true, until: W.t + 0.35 };\n    if (u.pairLog == null",
    "    u.stay = null; if (run) u.mv = { k: 'pair', run: true, until: W.t + 0.35 };\n    if (how !== 'link' && (u.pairLog == null")
rep("|| u.pairHow !== how){ u.pairLog = W.t;", "|| u.pairHow !== how)){ u.pairLog = W.t;")
rep("setMood(W, u, how === 'flank' ? (t ? t.name + '의 옆구리로 — ' : '') + p.name + '와 함께' : p.name + ' 곁으로', t ? t.i : null);",
    "setMood(W, u, how === 'flank' ? (t ? t.name + '의 옆구리로 — ' : '') + p.name + '와 함께' : how === 'link' ? p.name + '와 붙어 감 (전우조)' : p.name + ' 곁으로', t ? t.i : null);")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9110 OK')
