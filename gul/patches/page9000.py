# v9.0.0 페이지 — page9000.py v1.0 (v1.0: 2층 대규모 업데이트 1단계 — 공통 규칙: 아군 기본 돌격 금지 · 던지기 (단검 · 창 · 도끼) · 회색 피해 숫자 · 스텝 중대형까지 · [미라] (세자르) · 동료 뽑기 확률 낮게 · 영입 상한 12)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8940.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.9.4 (2026-10-24)', '<!-- 굴의 전투판 v9.0.0 (2026-10-24)')
rep('     v8.9.4: 2층 열한 칸 (', '''     v9.0.0: 2층 대규모 업데이트 1단계 — 모든 굴에 적용되는 공통 규칙 (민수 2026-10-24):
         · 아군은 기본 지침이 돌격 금지 (자동 돌격이 없는 게 아니라 기본이 금지 — '🚫 돌격 안 함' 단추를 끄면 스스로 판단 · 돌진 명령 · 기술 칸은 언제나 됨) · 적은 그대로
         · 던지기 공통: 단검 · 창 · 도끼 (무기표 '도끼' · '손도끼') 는 던질 수 있음 — 초대형은 못 던짐
         · 막거나 방어구로 깎인 피해 숫자는 회색 · 스텝은 중대형까지 (대형 · 초대형은 못 함) · 도약은 종족 · 특성
         · [미라] (세자르): 머리가 완전히 부서져야 죽음 — 심장 · 내장의 상처는 체력 · 전투력에 영향 없음
         · 층을 내려갈 때 동료가 뜰 확률 매우 낮게 (카드 한 장당 6%) · 영입은 몇 명이든 (상한 12 — 많이 죽고 조금 얻게)
     v8.9.4: 2층 열한 칸 (''')
for a, b in (('h1::after{content:" v8.9.4"', 'h1::after{content:" v9.0.0"'), ('<footer>굴의 전투판 v8.9.4', '<footer>굴의 전투판 v9.0.0'), ('return `굴의 전투판 v8.9.4 · ${title}', 'return `굴의 전투판 v9.0.0 · ${title}'),
             ("copyText('굴의 전투판 v8.9.4 자동 판 기록", "copyText('굴의 전투판 v9.0.0 자동 판 기록"), ("o.push(`굴의 전투판 v8.9.4 — ${C.run", "o.push(`굴의 전투판 v9.0.0 — ${C.run"),
             ('의 버전 기록에 — v8.9.4 2층 열한 칸 (❓ 셋) /', '의 버전 기록에 — v9.0.0 공통 규칙 / v8.9.4 2층 열한 칸 (❓ 셋) /'),
             ('">v8.9.4 · 2층 열한 칸 (랜덤 인카운터 ❓ 셋)</span>', '">v9.0.0 · 공통 규칙 (돌격 금지 기본 · 던지기 · 회색 피해 · 스텝 · 미라)</span>'),
             ("ver: '8.9.4', kind:", "ver: '9.0.0', kind:"), ("RULES_MIG = '8.9.4',", "RULES_MIG = '9.0.0',")):
    rep(a, b)
# 회색 피해 숫자 (num 색 z)
rep("ctx.fillStyle = f.c === 'h' ? '#6fe08f' : f.c === 'o' ? '#ff8a70' :", "ctx.fillStyle = f.c === 'z' ? '#a3a09a' : f.c === 'h' ? '#6fe08f' : f.c === 'o' ? '#ff8a70' :")
# 영입 상한 · 뽑기 동료 확률
rep("const R8 = { cap: 8, draws: 3,", "const R8 = { cap: 12, allyP: 0.06, draws: 3,")
rep("if (Math.random() < R8.relicP || !pool.length){ const L = RELIC8_POOL.filter(k => !R.relics.includes(k)); if (L.length) return { k: 'relic', id: r8Pick(L) }; }", "if (Math.random() >= (R8.allyP != null ? R8.allyP : 0.06) || !pool.length){ const L = RELIC8_POOL.filter(k => !R.relics.includes(k)); if (L.length && Math.random() < 0.8) return { k: 'relic', id: r8Pick(L) }; if (Math.random() >= (R8.allyP != null ? R8.allyP : 0.06) || !pool.length) return { k: 'gold', n: r8Rnd(18, 34) }; }   /* v9.0.0 동료는 매우 드물게 (카드 한 장당 allyP) — 나머지는 유물 · 동전 */")
# [미라]
rep("'망자': '죽은 시대의 망자 —", "'미라': '미라의 몸 (세자르): 머리가 완전히 부서져야 죽음 — 심장 · 내장 같은 장기가 상해도 체력 · 전투력엔 영향이 없고 (급소 · 출혈 · 내출혈 없음), 머리 · 목의 상처는 그대로. 기계 종족과 비슷',\n  '망자': '죽은 시대의 망자 —")
rep("traits: ['보스', '베테랑', '회피S', '속력S', '갑피', '망자'], gear: { 머리: { name: '노인의 왕관'", "traits: ['보스', '베테랑', '회피S', '속력S', '갑피', '망자', '미라'], gear: { 머리: { name: '노인의 왕관'")
open(F, 'w', encoding='utf-8').write(s)
print('page9000 OK')
