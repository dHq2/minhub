# v9.6.1 엔진 — patch9080.py v1.0 (v1.0: 대장이 서둘러 뛰면 부하도 서둘러 (명세 B6) — 따라가는 이는 그 따를 이 (인주 · 대장) 가 뛰는 동안 뜀걸음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9070.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("    if (boxRock(W, gx, gy, u.r * 0.9)){ gx = HL.x; gy = HL.y; }\n    if (dist(u, HL) > (dk ? fd + 0.35 : 2.2)",
    "    if (boxRock(W, gx, gy, u.r * 0.9)){ gx = HL.x; gy = HL.y; }\n    if (!u.order && running(W, HL)) u.mv = { k: 'crun', run: true, until: W.t + 0.4 };   /* v9.6.1 따르는 이가 뛰면 같이 뜀 (대장이 서두르면 부하도) */\n    if (dist(u, HL) > (dk ? fd + 0.35 : 2.2)")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9080 OK')
