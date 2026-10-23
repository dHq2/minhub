# v8.9.0 페이지 — page8900.py v1.0 (v1.0: 2층을 민수가 짠 순서로 — 입구 → 계단 → 전투룸1 → 전투룸2 (낙사) → 계단1 → 계단2 → 전투룸3 (복도) → 보스룸1 → 아래 계단 · 칸 이름표에 맵 이름 · 이름 정리 · 방 · 회랑 분리 폐기)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8890.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.8.9 (2026-10-23)', '<!-- 굴의 전투판 v8.9.0 (2026-10-23)')
rep('     v8.8.9: 전투맵 2 · 3 (', '''     v8.9.0: 2층 짜기 (민수 — "1. 입구 → 2. 계단 → 3. 지상전투룸1 → 4. 전투맵2 (낙사) → 5. 지상계단1 → 6. 지상계단2 → 7. 전투맵3 (좁은 복도) → 8. 지상보스룸1 · 구분하기 쉽게 이름 다시 · ? (랜덤 인카운터) 도 넣을 수 있게 · 무너진 유적 회랑과 방 = 이벤트룸1 (분리 안 함) · 지상이벤트룸1 (중간보스 가능) · 지상전투룸1 (중간보스 가능) · 보스룸 클리어하면 중앙에서 빛이 나며 다음 층으로 (메모)"):
         2층 = 위 순서의 여덟 칸 + 아래 계단 (모두 지나가기 · 비어 있음). 칸 이름표에 그 칸의 맵 이름이 나옴. 맵 이름은 [구역 종류 번호] 로 통일: 유적 입구 · 유적 계단 · 유적 이벤트룸1 (회랑과 방 · 분리 폐기 — 방 · 회랑 잘라낸 그림은 뺌) · 지상 전투룸1 · 지상 전투룸2 · 낙사 · 지상 전투룸3 · 좁은 복도 · 지상 계단1 · 지상 계단2 · 지상 이벤트룸1 · 지상 보스룸1 · 원형. 보스룸 나가는 곳은 한가운데 (클리어하면 빛이 나는 자리 — 메모, 아직 기믹은 없음). 중간보스 가능 칸 (지상 이벤트룸1 · 지상 전투룸1) 은 칸에 mid 표시만. ? 는 이미 있는 만남 칸 (enc) 그대로 — 순서에 넣어 주면 걸음.
     v8.8.9: 전투맵 2 · 3 (''')
for a, b in (('h1::after{content:" v8.8.9"', 'h1::after{content:" v8.9.0"'), ('<footer>굴의 전투판 v8.8.9', '<footer>굴의 전투판 v8.9.0'), ('return `굴의 전투판 v8.8.9 · ${title}', 'return `굴의 전투판 v8.9.0 · ${title}'),
             ("copyText('굴의 전투판 v8.8.9 자동 판 기록", "copyText('굴의 전투판 v8.9.0 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.9 — ${C.run", "o.push(`굴의 전투판 v8.9.0 — ${C.run"),
             ('의 버전 기록에 — v8.8.9 전투맵 2 · 3 /', '의 버전 기록에 — v8.9.0 2층 짜기 / v8.8.9 전투맵 2 · 3 /'),
             ('">v8.8.9 · 전투맵 2 (낙사) · 3 (좁은 복도)</span>', '">v8.9.0 · 2층 짜기 (여덟 칸) · 맵 이름 정리</span>'),
             ("ver: '8.8.9', kind:", "ver: '8.9.0', kind:"), ("RULES_MIG = '8.8.9',", "RULES_MIG = '8.9.0',")):
    rep(a, b)
rep("['ruin2a', 'ruin2b', 'ruin2c', 'ruin2c1', 'ruin2c2', 'gboss1',", "['ruin2a', 'ruin2b', 'ruin2c', 'gboss1',")
old2 = s[s.index("  2: { name: '무너진 유적', band: 'ruin',"):s.index("  3: { theme: 'cave', name: '여신의 호수'")]
new2 = """  2: { name: '무너진 유적', band: 'ruin', maps: ['ruin2a', 'ruin2b', 'gfight1', 'fmap2', 'gstair1', 'gstair2', 'fmap3', 'gboss1'], narr: ['어둠 속에 무너진 유적이 떠 있다.', '위로 이어지는 계단이 보인다.'],   /* v8.9.0 2층 (민수가 짠 순서) · 모두 비어 있음 · mid = 중간보스 가능 (메모) */
    rows: [[{ t: 'fight', ms: 'pass', src8: 'ruin2a', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'ruin2b', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'gfight1', empty: true, bare: true, mid: true }], [{ t: 'fight', ms: 'pass', src8: 'fmap2', empty: true, bare: true }],
      [{ t: 'fight', ms: 'pass', src8: 'gstair1', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'gstair2', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'fmap3', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'gboss1', empty: true, bare: true }], [{ t: 'stairs' }]] },
"""
s = s.replace(old2, new2)
# 칸 이름표: 비어 있는 고정 맵은 맵 이름
rep("n.champ ? '관중 통로' : n.ms === 'pass' ? '지나가기'", "n.champ ? '관중 통로' : n.bare && MAPS8[n.src8] ? MAPS8[n.src8].name : n.ms === 'pass' ? '지나가기'")
open(F, 'w', encoding='utf-8').write(s)
print('page8900 OK')
