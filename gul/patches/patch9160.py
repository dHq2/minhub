# v9.8.0 엔진 — patch9160.py v1.0 (v1.0: 뭉침 · 돌격 방어는 서로 살짝 밀어붙임 — 뭉침 자리는 무리 가운데로 0.06칸 당겨지고, 받쳐 주는 자리는 0.03칸 겹치게 → 몸끼리 비비며 (밀어내기) 실제로 닿은 채 버팀)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9150.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("const { e, t } = best, d0 = dist(e, t) || 1, dx = (t.x - e.x) / d0, dy = (t.y - e.y) / d0, R = t.r + u.r + 0.02,", "const { e, t } = best, d0 = dist(e, t) || 1, dx = (t.x - e.x) / d0, dy = (t.y - e.y) / d0, R = t.r + u.r - 0.03,   /* v9.8.0 살짝 겹치게 — 밀어붙임 */")
rep("  const px = o.x + Math.cos(o.f + Math.PI / 2) * off - Math.cos(o.f) * back, py = o.y + Math.sin(o.f + Math.PI / 2) * off - Math.sin(o.f) * back;",
    "  const sq = 1 - 0.06 / Math.max(0.3, Math.hypot(off, back)), px = o.x + (Math.cos(o.f + Math.PI / 2) * off - Math.cos(o.f) * back) * sq, py = o.y + (Math.sin(o.f + Math.PI / 2) * off - Math.sin(o.f) * back) * sq;   /* v9.8.0 가운데로 살짝 당김 — 어깨를 비빔 */")
rep("  if (Math.hypot(px - u.x, py - u.y) > 0.08 && !u.act) goTo(W, u, Math.max(0.6", "  if (Math.hypot(px - u.x, py - u.y) > 0.05 && !u.act) goTo(W, u, Math.max(0.6")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9160 OK')
