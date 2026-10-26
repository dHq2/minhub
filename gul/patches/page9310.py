# v9.9.8 페이지 — page9310.py v1.0 (v1.0: '🏳 부지휘' 이름표 없앰 — 지휘관이 아닌 [지휘X] 스킬을 가진 이 (노먼 등) 에게 늘 붙던 표시. 직책이 아니라 스킬의 효과 (전달이 조금 더 잘 됨 · 지휘관이 쓰러지면 지휘 점수 순으로 이어받음 · 대장일 때 판단) 일 뿐이고, 이 표시가 먼저 나오느라 그 사람의 부하 · 대장 · 고립 · 명령 닿음 % 표시를 가렸음. 이제 다른 동료와 같게 보이고 '대장' 은 부하를 둘 때만 · 남은 부대장 표시 코드도 지움)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9300.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.7 (2026-10-26)', '<!-- 굴의 전투판 v9.9.8 (2026-10-26)')
rep('     v9.9.7: 공식 부대장 없앰', '''     v9.9.8: '🏳 부지휘' 이름표 없앰 — [지휘X] 스킬은 스킬일 뿐 (대장은 부하를 두는 순간부터)
     v9.9.7: 공식 부대장 없앰''')
for a, b in (('h1::after{content:" v9.9.7"', 'h1::after{content:" v9.9.8"'), ('<footer>굴의 전투판 v9.9.7', '<footer>굴의 전투판 v9.9.8'), ('return `굴의 전투판 v9.9.7 · ${title}', 'return `굴의 전투판 v9.9.8 · ${title}'),
             ("copyText('굴의 전투판 v9.9.7 자동 판 기록", "copyText('굴의 전투판 v9.9.8 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.7 — ${C.run", "o.push(`굴의 전투판 v9.9.8 — ${C.run"),
             ('의 버전 기록에 — v9.9.7 공식 부대장 없앰', '의 버전 기록에 — v9.9.8 부지휘 이름표 없앰 / v9.9.7 공식 부대장 없앰'),
             ('">v9.9.7 공식 부대장 없앰', '">v9.9.8 부지휘 이름표 없앰 · v9.9.7 공식 부대장 없앰'),
             ("ver: '9.9.7', kind:", "ver: '9.9.8', kind:"), ("RULES_MIG = '9.9.7',", "RULES_MIG = '9.9.8',")):
    rep(a, b)
i = s.index("  if (false) return relB + `<span class=\"lk c\" title=\"공식 부대장"); j = s.index("\n", s.index("🏳 부지휘</span>", i))
s = s[:i] + "  /* v9.9.8 부대장 · 부지휘 이름표 없앰 — 지휘 스킬이 있어도 다른 동료와 같게 (대장은 부하를 둘 때만) */" + s[j:]
rep("(sqN && u.rank !== '부대장' ? `<span class=\"lk c\" title=\"대장", "(sqN ? `<span class=\"lk c\" title=\"대장")
open(F, 'w', encoding='utf-8').write(s)
print('page9310 OK')
