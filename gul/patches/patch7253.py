# v7.25.3 엔진 — patch7253.py v1.0 (공통 전투의 상황: setup.startK 로 적의 시작을 고름 — 'roam' (흩어져 떠돎 · 예전 그대로) · front 정면 대치 · pincer 양쪽 협공 · ambush 매복 · rear 후방 기습 · column 행군 중 조우 / 적이 둘보다 적으면 떠돎)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7252.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)
T = rep(T, "  if (setup.randStart && !(opt && opt.noStart)) patrolStart(W);   // v7.8.1",
           "  if (setup.randStart && !(opt && opt.noStart)){ if (setup.startK && setup.startK !== 'roam' && W.units.filter(u => u.side === 1).length >= 2) startScenario(W, setup.startK); else patrolStart(W); }   /* v7.25.3 공통 전투의 상황 (startK) — 없으면 떠돎 */   // v7.8.1")
T = rep(T, "function startScenario(W){\n", "function startScenario(W, kf){   /* v7.25.3 kf = 고른 상황 */\n")
T = rep(T, "let r = W.rand() * tot, k = 'front'; for (const [j, w] of K){ r -= w; if (r <= 0){ k = j; break; } }",
           "let r = W.rand() * tot, k = 'front'; for (const [j, w] of K){ r -= w; if (r <= 0){ k = j; break; } } if (kf && K.some(x => x[0] === kf)) k = kf;")
for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch7253 OK')
