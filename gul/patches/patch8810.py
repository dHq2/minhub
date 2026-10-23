# v8.8.1 엔진 — patch8810.py v1.0 (v1.0: 진형 폐기 — 민수 "적어도 진형은 폐기하자 … 개별로 했을 때가 훨씬 좋았던 것 같아". 진형 버프 (방패벽 · 쐐기 돌파 · 삼각 엄호 · 사방 경계 · 흩어짐 — 우리 대형 · 적의 대치 진형 · 쐐기 돌파) 를 수치표 fbuf.on (기본 0) 으로 끔.
#   대형 (setup.form) 은 페이지가 넘길 때만 켜지므로 엔진은 그대로 — 페이지 (page8810) 가 더는 넘기지 않음. 조합 버프는 그대로.)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8800.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 진형 버프 끔 (fbuf.on 0) ----------
rep("  fbuf: { arc: 20,", "  fbuf: { on: 0, arc: 20,")
rep("  for (const u of W.units) u.fb = null;\n  for (const sq in W.form || {}){",
    "  for (const u of W.units) u.fb = null;\n  if (!(S.on > 0)) return;   /* v8.8.1 진형 버프 폐기 (민수) — 수치표 fbuf.on 을 1 로 하면 다시 켜짐 */\n  for (const sq in W.form || {}){")

for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch8810 OK')
