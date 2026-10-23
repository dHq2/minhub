# v8.8.5 엔진 — patch8850.py v1.0 (v1.0: 간두의 샷건 — 민수 "조준이 거의 필요 없으니 사격이 더 빨라야 … 코앞에선 강한 위력과 넉백을 내는 히든카드 … 초기 탄약 50발 … 위력도 더 좋아야 … 몇 판 시험해 보고 조정해 봐")
#   샷건: 조준 시간 aimK (등급 조준 × aimK) · 쏜 뒤 거둠 recK · 산탄 한 알 mul · 코앞 (near.r 칸 안) mul · 밀침 kb · 관통 penK
import subprocess, json, os
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8840.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
T = dict(aimK=0.2, recK=0.55, cone=0.4, nearMul=3.2, nearR=2.2, kb=1.5, penK=0.5, Ppow=55, draw=0.02)
T.update(json.loads(os.environ.get('SHOT', '{}')))
OLD = "'샷건':{rng:2.5, cone:{n:5, ang:0.32, mul:0.32}, ammo:4, loud:true, aim:0.6, vel:220, P:45, draw:0.05, kind:'총포류', pen:1, penK:0.3, jit:0.1, near:{r:1.8, mul:2.2, kb:1.0}}"
NEW = "'샷건':{rng:2.5, cone:{n:5, ang:0.32, mul:%s}, ammo:4, loud:true, aim:0.6, aimK:%s, recK:%s, vel:220, P:%s, draw:%s, kind:'총포류', pen:1, penK:%s, jit:0.1, near:{r:%s, mul:%s, kb:%s}}" % (T['cone'], T['aimK'], T['recK'], T['Ppow'], T['draw'], T['penK'], T['nearR'], T['nearMul'], T['kb'])
rep(OLD, NEW)
rep("  return (g * (u.vet ? G.vet || 1 : 1) + (wp.draw || 0)) * famMul(W, u); }", "  return (g * (u.vet ? G.vet || 1 : 1) * (wp.aimK != null ? wp.aimK : 1) + (wp.draw || 0)) * famMul(W, u); }   /* v8.8.5 샷건은 조준이 거의 필요 없음 (aimK) */")
rep("A.end = W.t + u.rec * supAtkK(W, u) * (far ? (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) : wpnSpd(W, u))",
    "A.end = W.t + u.rec * supAtkK(W, u) * (far ? (A.sm === 'rapid' ? ((R.sshot || {}).rapid || {}).rec || 0.7 : 1) * ((((R.weapons || {})[u.weapon]) || {}).recK || 1) : wpnSpd(W, u))")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
# 저장된 수치표: 옛 샷건 표면 새 표로
O = json.load(open(D + 'oldrules.json'))
old = {"rng": 2.5, "cone": {"n": 5, "ang": 0.32, "mul": 0.32}, "ammo": 4, "loud": True, "aim": 0.6, "vel": 220, "P": 45, "draw": 0.05, "kind": "총포류", "pen": 1, "penK": 0.3, "jit": 0.1, "near": {"r": 1.8, "mul": 2.2, "kb": 1.0}}
if not any(p == ['weapons', '샷건'] for p, _ in O): O.append([['weapons', '샷건'], [old]])
json.dump(O, open(D + 'oldrules.json', 'w'), ensure_ascii=False)
print('patch8850 OK', T)
