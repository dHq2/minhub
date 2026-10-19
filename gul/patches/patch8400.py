# v8.4.0 엔진 — patch8400.py v1.0 (patch8300.py 를 먼저 돌린 뒤: [레이더] (3초마다 14칸 안의 적을 1.2초 동안 앎 — 어둠 · 벽 · 은신과 상관없이 · 양쪽 같음) · 녹아 사라진 몸 (gone 'merge' — 소환이 합쳐지거나 녹음) 은 '넘어감' 으로 세지 않음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8300.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

H = rep(H, "brand: { tremor: 0.15,", "radar: { gap: 3, dur: 1.2, r: 14 },   /* v8.4.0 [레이더]: gap 초마다 r 칸 안의 적을 dur 초 동안 앎 */\n  brand: { tremor: 0.15,")
T = rep(T, "regenHp: p.trinket === '성해포' ? 1.5 : (+p.regenHp || 0),", "regenHp: p.trinket === '성해포' ? 1.5 : (+p.regenHp || 0), radar: tr.includes('레이더'),")
M = rep(M, "function canSee(W, u, t){\n  const d = Math.hypot(u.x - t.x, u.y - t.y);\n",
        "function canSee(W, u, t){\n  const d = Math.hypot(u.x - t.x, u.y - t.y);\n"
        "  if (u.radar && t.rpT && t.side !== u.side && t.rpT[u.side] > W.t && d <= ((W.rules.radar || {}).r || 14)) return true;   /* v8.4.0 [레이더] */\n")
T = rep(T, "  for (const u of W.units) if (u.alive && u.regenHp > 0",
        "  if (W.t >= (W.rpNext || 0)){ const RD = W.rules.radar || {}; W.rpNext = W.t + (RD.gap || 3);   /* v8.4.0 [레이더] 맥박 */\n"
        "    for (const u of W.units) if (u.alive && u.radar && !u.gone){ u.rpLast = W.t; for (const e of W.units) if (e.alive && !e.gone && e.side !== u.side && Math.hypot(e.x - u.x, e.y - u.y) <= (RD.r || 14)) (e.rpT || (e.rpT = [0, 0]))[u.side] = W.t + (RD.dur || 1.2); } }\n"
        "  for (const u of W.units) if (u.alive && u.regenHp > 0")
H2 = H + M + T
for nm, s in (('head', H), ('mid', M), ('tail', T)):
    if "u.gone && u.gone !== 'left') ? 'exit' : 'lose'" in s:
        s = rep(s, "u.gone && u.gone !== 'left') ? 'exit' : 'lose'", "u.gone && u.gone !== 'left' && u.gone !== 'merge') ? 'exit' : 'lose'")
        if nm == 'head': H = s
        elif nm == 'mid': M = s
        else: T = s
for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8400 OK')
