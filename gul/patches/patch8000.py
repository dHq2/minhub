# v8.0.0 엔진 — patch8000.py v1.1 (v1.1: 출구 잠금 (W.exitLock) — 맵을 끝내기 전엔 계단 앞에서 기다림 · v1.0: 30층 여정: 그림 맵에서 물러날 때 (아래로) 는 들어온 자리 (W.entry) 로 가서 나감)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7290.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

T = rep(T, "  if (!dn && W.stairs){ const S0 = W.stairs;",
        "  if (dn && W.entry){ const E0 = W.entry; if (Math.hypot(E0.x - u.x, E0.y - u.y) <= (E0.r || 1.2)){ leaveMap(W, u, 'down'); return; } setMood(W, u, '물러남'); goTo(W, u, E0.x, E0.y, dt); return; }   /* v8.0.0 여정: 들어온 자리로 물러남 */\n"
        "  if (!dn && W.stairs && W.exitLock && !W.cleared){ const S0 = W.stairs; setMood(W, u, '출구 — 적이 남아 있음'); if (Math.hypot(S0.x - u.x, S0.y - u.y) > 1.6) goTo(W, u, S0.x, S0.y, dt); else { u.vx = 0; u.vy = 0; } return; }   /* v8.0.0 여정: 맵을 끝내야 열림 */\n"
        "  if (!dn && W.stairs){ const S0 = W.stairs;")

for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8000 OK')
