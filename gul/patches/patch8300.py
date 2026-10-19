# v8.3.0 엔진 — patch8300.py v1.0 (patch8000.py 를 먼저 돌린 뒤: [낙인:적뢰] 수전증 (행동이 가끔 안 나감 — 1.5초에 한 번 굴림) · 성해포 (재생 초당 1.5 · 신성E · 낙인의 수전증 없음))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8000.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

H = rep(H, "flip: { d: 6, back: 2.6,", "brand: { tremor: 0.15, tremGap: 1.5, tremStun: 0.55 },   /* v8.3.0 [낙인:적뢰] 수전증: 행동을 시작할 때 (tremGap 초에 한 번) tremor 확률로 손이 떨려 tremStun 초 멈춤 */\n  flip: { d: 6, back: 2.6,")
T = rep(T, "leapN: +p.leapN || 1,", "leapN: +p.leapN || 1, tremor: (p.curses || []).includes('낙인:적뢰') && p.trinket !== '성해포', regenHp: p.trinket === '성해포' ? 1.5 : (+p.regenHp || 0),   /* v8.3.0 낙인 · 성해포 */")
T = rep(T, "function startAct(W, u, t, why){\n",
        "function startAct(W, u, t, why){\n"
        "  if (u.tremor && W.t >= (u.tremCd || -9)){ const B = W.rules.brand || {}; u.tremCd = W.t + (B.tremGap || 1.5); if (W.rand() < (B.tremor != null ? B.tremor : 0.15)){ L(W, { k: 'tremor', a: u.i, vis: u.side === 0 || !!u.seenBy }); stun(W, u, B.tremStun || 0.55, null); return; } }   /* v8.3.0 [낙인:적뢰] 수전증 */\n")
T = rep(T, "  for (const u of W.units){ if (!u.undying && !(u.regen > 0)) continue;",
        "  for (const u of W.units) if (u.alive && u.regenHp > 0 && u.hp < u.max) u.hp = Math.min(u.max, u.hp + u.regenHp * dt);   /* v8.3.0 성해포 (재생D — 초당 일정량, 몸 전체 재생은 아님) */\n"
        "  for (const u of W.units){ if (!u.undying && !(u.regen > 0)) continue;")
for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8300 OK')
