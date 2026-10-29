# v9.13.0 엔진 — patch9320.py v1.0 (v1.0: 막힘 점검 (audit_jam.js) — ① 이어 닿기 도착: 같은 자리로 가는 무리는 이미 선 동료 (그 자리에 더 가까움) 에 닿으면 도착 (끝없이 비집던 것) ② 둘 다 치는 중이어도 겹치면 반씩 밀어냄 (서로 버티며 겹쳐 있던 것) ③ 지키던 자리를 동료가 차지하면 지금 선 자리를 새 자리로 (밀려난 뒤 되돌아가 다시 밀던 것) · 끝자리 0.5칸 안에서 동료에 닿으면 도착)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9310.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# ① 이어 닿기 도착
rep("      else if (d0 < 1.2 && W.t - pc.t > 0.8){ L(W, { k: 'arrive', a: u.i, near: +d0.toFixed(2) });",
"""      else if (d0 < 3.2 && W.t - pc.t > 0.15 && W.units.some(f => f !== u && f.alive && f.side === u.side && !f.down && gap(u, f) < 0.15 && !(f.order && f.order.k === 'move' && !f.path) && !(f.path && f.path.length && Math.hypot(f.vx || 0, f.vy || 0) > 0.3) && (Math.hypot(f.x - o.x, f.y - o.y) < d0 - 0.2 || d0 < 0.5))){ L(W, { k: 'arrive', a: u.i, near: +d0.toFixed(2), chain: true }); u.order = null; u.stay = { x: u.x, y: u.y }; stop(u); return; }   /* v9.13.0 이어 닿기: 그 자리에 먼저 선 동료에 닿으면 나도 도착 (비집지 않음) */
      else if (d0 < 1.2 && W.t - pc.t > 0.8){ L(W, { k: 'arrive', a: u.i, near: +d0.toFixed(2) });""")
# ② 둘 다 치는 중
rep("    let pw = P.act ? 0 : Q.act ? 2 : 1, qw = Q.act ? 0 : P.act ? 2 : 1;", "    let pw = P.act ? 0 : Q.act ? 2 : 1, qw = Q.act ? 0 : P.act ? 2 : 1; if (P.act && Q.act && P.side === Q.side){ pw = 0.5; qw = 0.5; }   /* v9.13.0 둘 다 치는 중이면 반씩 (버티며 겹쳐 있던 것) */")
rep("    if (Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 0.4){ setMood(W, u, '자리로'); goTo(W, u, u.stay.x, u.stay.y, dt); } else stop(u);", "    if (Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 0.4 && Math.hypot(u.x - u.stay.x, u.y - u.stay.y) < 2.5 && W.units.some(f => f !== u && f.alive && f.side === u.side && Math.hypot(f.x - u.stay.x, f.y - u.stay.y) < f.r + u.r - 0.05)) u.stay = { x: u.x, y: u.y };   /* v9.13.0 지키던 자리를 동료가 차지함 → 지금 자리를 새 자리로 (되돌아가 밀지 않음) */\n    if (Math.hypot(u.x - u.stay.x, u.y - u.stay.y) > 0.4){ setMood(W, u, '자리로'); goTo(W, u, u.stay.x, u.stay.y, dt); } else stop(u);")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9320 OK')
