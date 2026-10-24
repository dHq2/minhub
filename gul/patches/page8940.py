# v8.9.4 페이지 — page8940.py v1.0 (v1.0: 2층 열한 칸 — 유적 입구 → 유적 계단 → ❓ → 전투룸1 → 전투룸2 · 낙사 → ❓ → 계단1 → 계단2 → 전투룸3 · 좁은 복도 → ❓ → 보스룸1 · 원형 → 아래 계단 · ❓ = 랜덤 인카운터 (만남 칸 enc) · 버전)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8930.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.9.3 (2026-10-23)', '<!-- 굴의 전투판 v8.9.4 (2026-10-24)')
rep('     v8.9.3: 대화용 스프라이트 다섯 (', '''     v8.9.4: 2층 열한 칸 (민수 — "1. 유적 입구 → 2. 유적 계단 → 3. ❓ 랜덤 인카운터 → 4. 지상 전투룸1 → 5. 지상 전투룸2 · 낙사 → 6. ❓ → 7. 지상 계단1 → 8. 지상 계단2 → 9. 지상 전투룸3 · 좁은 복도 → 10. ❓ → 11. 지상 보스룸1 · 원형. 2층은 이렇게 진행될 것임"):
         2층 = 위 열한 칸 + 아래 계단. ❓ = 만남 칸 (enc · 그 층에 맞는 만남이 무게대로 무작위 — 여정에 한 번씩 · 이미 만난 이름 있는 만남은 안 나옴). 나머지는 그대로 (지나가기 · 비어 있음 · 지상 전투룸1 은 중간보스 가능 표시).
     v8.9.3: 대화용 스프라이트 다섯 (''')
for a, b in (('h1::after{content:" v8.9.3"', 'h1::after{content:" v8.9.4"'), ('<footer>굴의 전투판 v8.9.3', '<footer>굴의 전투판 v8.9.4'), ('return `굴의 전투판 v8.9.3 · ${title}', 'return `굴의 전투판 v8.9.4 · ${title}'),
             ("copyText('굴의 전투판 v8.9.3 자동 판 기록", "copyText('굴의 전투판 v8.9.4 자동 판 기록"), ("o.push(`굴의 전투판 v8.9.3 — ${C.run", "o.push(`굴의 전투판 v8.9.4 — ${C.run"),
             ('의 버전 기록에 — v8.9.3 대화용 스프라이트 다섯 /', '의 버전 기록에 — v8.9.4 2층 열한 칸 (❓ 셋) / v8.9.3 대화용 스프라이트 다섯 /'),
             ('">v8.9.3 · 대화용 스프라이트 다섯 (노숙악마 · 헌팅나이프 · 카밀라 · 반 · 테리)</span>', '">v8.9.4 · 2층 열한 칸 (랜덤 인카운터 ❓ 셋)</span>'),
             ("ver: '8.9.3', kind:", "ver: '8.9.4', kind:"), ("RULES_MIG = '8.9.3',", "RULES_MIG = '8.9.4',")):
    rep(a, b)
i = s.index("  2: { name: '무너진 유적', band: 'ruin',"); j = s.index("  3: { theme: 'cave', name: '여신의 호수'")
new2 = """  2: { name: '무너진 유적', band: 'ruin', maps: ['ruin2a', 'ruin2b', 'gfight1', 'fmap2', 'gstair1', 'gstair2', 'fmap3', 'gboss1'], narr: ['어둠 속에 무너진 유적이 떠 있다.', '위로 이어지는 계단이 보인다.'],   /* v8.9.4 2층 열한 칸 (민수가 짠 순서 · ❓ = 랜덤 인카운터) · 맵은 비어 있음 · mid = 중간보스 가능 (메모) */
    rows: [[{ t: 'fight', ms: 'pass', src8: 'ruin2a', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'ruin2b', empty: true, bare: true }], [{ t: 'enc', s: true }], [{ t: 'fight', ms: 'pass', src8: 'gfight1', empty: true, bare: true, mid: true }], [{ t: 'fight', ms: 'pass', src8: 'fmap2', empty: true, bare: true }], [{ t: 'enc', s: true }],
      [{ t: 'fight', ms: 'pass', src8: 'gstair1', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'gstair2', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'fmap3', empty: true, bare: true }], [{ t: 'enc', s: true }], [{ t: 'fight', ms: 'pass', src8: 'gboss1', empty: true, bare: true }], [{ t: 'stairs' }]] },
"""
s = s[:i] + new2 + s[j:]
open(F, 'w', encoding='utf-8').write(s)
print('page8940 OK')
