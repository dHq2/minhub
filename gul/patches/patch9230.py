# v9.9.4 엔진 — patch9230.py v1.0 (v1.0: ① 철퇴형 특수무기 (모닝스타 — 무기 수치에 flail) 는 예전 그대로 — 돌격해도 '무기가 먼저 닿으면 무기로' 를 쓰지 않음 (철퇴는 던졌다 당겨 오는 제 방식) ② 대기 몸짓을 하지 않는 몸 (u.noFid — 과녁 · 시험용 허수아비 · 석상))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9220.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("!u.giant && !u.rush && u.rng >= 0.4 ? { mode: 'atk' } : {}) };", "!u.giant && !u.rush && u.rng >= 0.4 && !flailOf(W, u) ? { mode: 'atk' } : {}) };   /* v9.9.4 철퇴형은 예전 그대로 */")
rep("  const still = u.alive && !u.down && !u.act", "  const still = u.alive && !u.noFid && !u.down && !u.act")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9230 OK')
