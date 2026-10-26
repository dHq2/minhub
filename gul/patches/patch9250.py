# v9.9.6 엔진 — patch9250.py v1.0 (v1.0: 모순 정리 — ① 인주가 낀 대장-부하 관계도 다음 판 · 층에 이어짐 (v9.9.0 부터 인주도 부하 · 대장이 되는데 저장된 관계를 불러올 땐 인주를 빼던 것) ② 보호 관계도 전우조 · 대장처럼 다음 판에 이어짐 (protNm))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9240.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("    if (p.chiefNm !== undefined && !u.hero){\n      const C = p.chiefNm ? W.units.find(c => c.side === 0 && c !== u && c.name === p.chiefNm && !c.summon && !c.hero) : null;",
    "    if (p.protNm){ const Pt = W.units.find(c => c.side === 0 && c !== u && c.name === p.protNm && !c.summon); u.protOf = Pt ? Pt.i : null; }   /* v9.9.6 보호도 이어짐 */\n    if (p.chiefNm !== undefined){   /* v9.9.6 인주도 (v9.9.0 공통) */\n      const C = p.chiefNm ? W.units.find(c => c.side === 0 && c !== u && c.name === p.chiefNm && !c.summon) : null;")
rep("p.chiefNm = C ? C.name : ''; }", "p.chiefNm = C ? C.name : ''; const Pt = u.protOf != null ? W.units[u.protOf] : null; p.protNm = Pt && Pt.alive ? Pt.name : ''; }")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9250 OK')
