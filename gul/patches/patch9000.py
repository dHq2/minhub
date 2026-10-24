# v9.0.0 엔진 — patch9000.py v1.0 (v1.0: 2층 대규모 업데이트 1단계 — 모든 굴에 적용되는 규칙)
#   · 아군 기본 지침 = 돌격 금지 (rules.chgPol.allyOff) — 명령 (돌진 명령 · 기술 칸) 은 그대로, '돌격 안 함' 단추를 끄면 스스로 판단
#   · 던지기 공통: 단검 · 창 · 도끼 (무기표 '도끼' thr) — 초대형은 못 던짐 (noThrow)
#   · 막거나 방어로 깎인 피해 숫자는 회색 (num 색 z)
#   · 스텝은 중대형까지 (대형 · 초대형은 안 함)
#   · [미라]: 머리가 완전히 부서져야 죽음 — 심장 · 내장 같은 장기 상처는 체력 · 전투력에 영향 없음 (세자르)
import subprocess, json, os
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8860.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# 수치표
rep("  squad: { t: 0.5, flank: 3.2,", "  chgPol: { allyOff: true },   /* v9.0.0 아군 기본 지침: 돌격 금지 (스스로 돌격하지 않음 — 명령은 따름). 끄면 스스로 판단 */\n  squad: { t: 0.5, flank: 3.2,")
rep("'창':{rng:1.5, kind:'날붙이'},", "'창':{rng:1.5, kind:'날붙이'}, '도끼':{rng:0.55, kind:'날붙이', spdW:0.92, thr:true, axe:true}, '손도끼':{rng:0.45, kind:'날붙이', spdW:0.85, thr:true, axe:true},")
# 1) 아군 기본 돌격 금지
rep("noChg: !!p.noChg || p.cls === '치유', noChg0: !!p.noChg || p.cls === '치유',", "noChg: !!p.noChg || p.cls === '치유' || (p.side === 0 && ((rules.chgPol || {}).allyOff !== false)), noChg0: !!p.noChg || p.cls === '치유' || (p.side === 0 && ((rules.chgPol || {}).allyOff !== false)),")
# 2) 던지기: 초대형은 못 던짐
rep("|| !!wp.thr) && (wp.kind === '날붙이' || /창$/.test(p.weapon || '')) && !wp.noThr, spearHeld: true,", "|| !!wp.thr) && (wp.kind === '날붙이' || /창$/.test(p.weapon || '')) && !wp.noThr && p.sizeCls !== '초대형' && !p.noThrow, spearHeld: true,")
rep("u.jav = !far && (/창$/.test(name) || !!wp.thr) && !wp.noThr;", "u.jav = !far && (/창$/.test(name) || !!wp.thr) && !wp.noThr && u.sizeCls !== '초대형' && !u.noThrow;")
rep("const nm = isKnife(W, u) ? '투척' : '투창';", "const nm = isKnife(W, u) ? (((W.rules.weapons || {})[u.weapon] || {}).axe ? '도끼 투척' : '투척') : '투창';")
# 3) 막은 · 깎인 피해는 회색
rep("s: o.block ? '막음 -' + Math.round(real) : '-' + Math.round(real), c: o.block ? 'b' : t.side ? 'd' : 'o', t0: W.t });", "s: o.block ? '막음 -' + Math.round(real) : '-' + Math.round(real), c: o.block || o.armor ? 'z' : t.side ? 'd' : 'o', t0: W.t });   /* v9.0.0 막거나 방어구로 깎인 피해는 회색 */")
# 4) 스텝은 중대형까지
rep("return !!ST.on && W.t >= (u.stepCd == null ? -9 : u.stepCd) && !(u.raised && u.shield)", "return !!ST.on && u.sizeCls !== '대형' && u.sizeCls !== '초대형' && W.t >= (u.stepCd == null ? -9 : u.stepCd) && !(u.raised && u.shield)")
# 5) [미라]
rep("noOrg: tr.includes('무장기'),", "noOrg: tr.includes('무장기'), mummy: tr.includes('미라'),")
rep("const vp = part === '머리' && (rangedV || meleeV) ? '머리' : heart ? '심장' : null;", "const vp = part === '머리' && (rangedV || meleeV) ? '머리' : heart && !t.mummy ? '심장' : null;   /* v9.0.0 [미라]: 심장은 급소가 아님 */")
rep("  if (t.noOrg) return;   /* v8.7.3 [무장기]: 피를 흘리지 않음 */", "  if (t.noOrg || t.mummy) return;   /* v8.7.3 [무장기]: 피를 흘리지 않음 · v9.0.0 [미라] */")
rep("  if (t.noOrg && ['neck', 'skull', 'face', 'chest', 'belly'].includes(zone)) return;   /* v8.7.3 [무장기]: 장기 · 머리 · 목의 상처 없음 (팔다리만) */", "  if (t.noOrg && ['neck', 'skull', 'face', 'chest', 'belly'].includes(zone)) return;   /* v8.7.3 [무장기]: 장기 · 머리 · 목의 상처 없음 (팔다리만) */\n  if (t.mummy && ['chest', 'belly'].includes(zone)) return;   /* v9.0.0 [미라]: 가슴 · 배 (심장 · 내장) 의 상처는 없음 — 머리 · 목은 그대로 (머리가 부서지면 죽음) */")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9000 OK')
