# v9.9.7 엔진 — patch9260.py v1.0 (v1.0: 공식 부대장 없앰 — 직책 (rank) 을 쓰지 않음 (노먼 고정 부대장 · 2편대 = 부대장의 부하 · 부대장 우선 승계 · 중계 가산 · 부대장 자율 지휘 모두 꺼짐). 지휘는 [지휘X] 점수와 대장-부하 관계로만 · 지휘관이 쓰러지면 지휘 점수가 가장 높은 이가 이어받음 (양쪽 편))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9250.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("rank: p.rank != null ? p.rank : RANK_REF[p.ref] || '', sqLead: null,", "rank: '', sqLead: null,   /* v9.9.7 공식 부대장 (직책) 없앰 */")
rep("const RANK_REF = { 'C-007': '부대장' };   // v7.10 공식 부대장 (노먼)", "const RANK_REF = {};   // v9.9.7 공식 부대장 없앰 (옛: 노먼)")
rep("  { const Dp = W.units.find(u => u.side === 0 && u.rank === '부대장'); if (Dp) setup.units.forEach(", "  { const Dp = null; if (Dp) setup.units.forEach(")   # v9.9.7 2편대 = 부대장의 부하 없앰
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9260 OK')
