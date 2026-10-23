# v8.8.0 엔진 — patch8800.py v1.2 (v1.2: [방어X] 는 막는 재능의 바닥 (베테랑 · 반사신경과 같은 틀 — C 0.7 · B 0.8 · A 0.9 = 베테랑 · S 1 = 전선) — 곱하기 (1.04 ~ 1.16) 는 방패 공격수 (0.5) 에겐 거의 없고 전선 (1) 은 막기 피해가 0 에 닿는 벼랑 (1.25) 쪽으로 밀어서 · 막는 폭 (gArc) 도 같은 재능으로 · v1.1: 숨은 걸음은 숨을 수 있는 몸만 (숨는 솜씨가 수치표 stealth.min 밑이면 — 거구 · 개조된 몸 — 숨어도 보이므로 셈하지 않음) · v1.0: 한 일대로 성장 (I17 · 민수 L3) 의 셈 — 숨은 채 걸은 거리 (sneakMv — 들키면 은신이 풀리므로 '들키지 않은 걸음') ·
#   내가 내리거나 전한 명령이 동료에게 닿은 수 (cmdOk — 명령 줄의 c · m · m2) · [방어X] 등급 (막을 수 있는 몸만) ·
#   위층으로 (A8) 는 페이지 (page8800))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8790.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 수치표: [방어X] (막기 재능 ×) ----------
rep("'의학': { S: 1.45, A: 1.3, B: 1.15, C: 1 } },", "'의학': { S: 1.45, A: 1.3, B: 1.15, C: 1 }, '방어': { S: 1, A: 0.9, B: 0.8, C: 0.7 } },   /* v8.8.0 [방어X] = 막는 재능의 바닥 (베테랑 0.9 · 반사신경 0.9 와 같은 틀 · 역할 전선 1 · 미드필더 0.6 · 공격수 · 사수 · 지원 0.5) — 막아 낸 공격으로 자람 (I17) */")
rep("function gradeMul(rules, traits, key){", "const gdFloor = (rules, p) => (p.traits || []).some(t => /^방어[SABC]$/.test(t)) ? gradeMul(rules, p.traits, '방어') : 0;   /* v8.8.0 [방어X] 막는 재능의 바닥 (없으면 0) */\nfunction gradeMul(rules, traits, key){")
rep("      gTal: (sh || wp.guard || parryArcW(rules, p.weapon) > 0) ? Math.max((roleStat(p, rules).guard != null ? roleStat(p, rules).guard : 1), (p.traits || []).includes('반사신경') ? 0.9 : 0, vet ? vT.tal : 0) : 1, vet,",
    "      gTal: (sh || wp.guard || parryArcW(rules, p.weapon) > 0) ? Math.max((roleStat(p, rules).guard != null ? roleStat(p, rules).guard : 1), (p.traits || []).includes('반사신경') ? 0.9 : 0, vet ? vT.tal : 0, gdFloor(rules, p)) : 1, vet,   /* v8.8.0 [방어X] */")
rep("0.6 + 0.4 * Math.max((roleStat(p, rules).guard != null ? roleStat(p, rules).guard : 1), (p.traits || []).includes('반사신경') ? 0.9 : 0, vet ? vT.tal : 0) : 1)),",
    "0.6 + 0.4 * Math.max((roleStat(p, rules).guard != null ? roleStat(p, rules).guard : 1), (p.traits || []).includes('반사신경') ? 0.9 : 0, vet ? vT.tal : 0, gdFloor(rules, p)) : 1)),   /* v8.8.0 [방어X] 막는 폭도 */")

# ---------- 셈: 들키지 않은 걸음 · 닿은 명령 ----------
rep("  u.moved += Math.hypot(u.x - ox, u.y - oy);\n}",
    "  { const dm = Math.hypot(u.x - ox, u.y - oy); u.moved += dm; if (u.stealth && (u.stealthE || 0) >= (STL(W).min || 0)) u.sneakMv = (u.sneakMv || 0) + dm; }   /* v8.8.0 숨은 채 걸은 거리 (들키면 은신이 풀림 · 숨을 수 없는 몸은 셈하지 않음 — 은신 성장) */\n}")
rep("      L(W, { k: 'cmdRecv', a: u.i, c: P.c, dep:",
    "      for (const ci of new Set([P.c, P.m, P.m2].filter(x => x != null && x !== u.i))){ const cu = W.units[ci]; if (cu && cu.side === 0) cu.cmdOk = (cu.cmdOk || 0) + 1; }   /* v8.8.0 내가 내리거나 전한 명령이 닿음 (지휘 성장) */\n"
    "      L(W, { k: 'cmdRecv', a: u.i, c: P.c, dep:")

for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch8800 OK')
