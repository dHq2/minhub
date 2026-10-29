# v9.14.2 페이지 — page9400.py v1.0 (v1.0: 층마다 동료 하나는 꼭 (뽑기 세 장 중 한 장) · 판 위 아군 지휘관 깃발 (머리 위) = 빨강 (아군 칸 🚩 와 같은 색 · 예전 금색) · 적 지휘관 깃발 = 보라 (예전 붉은색 — 헷갈리지 않게) · 도움말 글도)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9390.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.14.1 (2026-10-29)', '<!-- 굴의 전투판 v9.14.2 (2026-10-29)')
rep('     v9.14.1: 암계 장비 그림', '''     v9.14.2: 층마다 동료 하나는 꼭 (층 뽑기 세 장 중 한 장 — 전엔 장당 6% 라 거의 없었음) · 판 위 아군 지휘관 깃발 = 빨강 (아군 칸 🚩 와 같은 색 · 예전 금색) · 적 지휘관 깃발 = 보라 · 임명한 지휘관 (⚜) 이 지휘 전달망의 우두머리 (예전엔 표시뿐)
     v9.14.1: 암계 장비 그림''')
for a, b in (('h1::after{content:" v9.14.1"', 'h1::after{content:" v9.14.2"'), ('<footer>굴의 전투판 v9.14.1', '<footer>굴의 전투판 v9.14.2'), ('return `굴의 전투판 v9.14.1 · ${title}', 'return `굴의 전투판 v9.14.2 · ${title}'),
             ("copyText('굴의 전투판 v9.14.1 자동 판 기록", "copyText('굴의 전투판 v9.14.2 자동 판 기록"), ("o.push(`굴의 전투판 v9.14.1 — ${C.run", "o.push(`굴의 전투판 v9.14.2 — ${C.run"),
             ('의 버전 기록에 — v9.14.1 암계 장비 그림', '의 버전 기록에 — v9.14.2 층마다 동료 · 지휘 깃발 빨강 / v9.14.1 암계 장비 그림'),
             ('">v9.14.1 암계 장비 아이콘', '">v9.14.2 층마다 동료 · 지휘 깃발 빨강 · v9.14.1 암계 장비 아이콘')):
    rep(a, b)
rep("    const fx0 = ox + C.x * ts, fy0 = oy + C.y * ts - C.r * ts - 6, col = side ? '#ff7a6a' : '#ffd56a';",
    "    const fx0 = ox + C.x * ts, fy0 = oy + C.y * ts - C.r * ts - 6, col = side ? '#b48cff' : '#ff2f2f';   /* v9.14.2 아군 지휘 깃발 = 빨강 (아군 칸 🚩 와 같은 색) · 적은 보라 (헷갈리지 않게) */")
rep("  // v7.4 지휘관 깃발 (아군 금색 · 적 붉은색", "  // v7.4 지휘관 깃발 (v9.14.2 아군 빨강 · 적 보라")
rep("머리 위 금색 깃발 (적은 붉은 깃발, 보일 때만)", "머리 위 빨간 깃발 (적은 보라 깃발, 보일 때만)")
# 층마다 동료 하나는 꼭: 뽑기 세 장에 동료가 없으면 (장당 6% — 거의 늘 없었음) 한 장을 동료로 (뽑을 동료가 남아 있으면)
rep("return d ? { k: 'ally', key: d.key, ref: d.ref, name: d.name || d.key, tier: d.tier } : { k: 'gold', n: 30 }; });\n  R.drawCards = cards;",
    "return d ? { k: 'ally', key: d.key, ref: d.ref, name: d.name || d.key, tier: d.tier } : { k: 'gold', n: 30 }; });\n  if (!cards.some(c => c.k === 'ally') && pool.length && R.party.length < R8.cap){ const d = pool.splice(rarPick(pool), 1)[0]; if (d) cards[Math.floor(Math.random() * cards.length)] = { k: 'ally', key: d.key, ref: d.ref, name: d.name || d.key, tier: d.tier }; }   /* v9.14.2 층마다 동료 하나는 꼭 */\n  R.drawCards = cards;")
rep("<div class=\"r8sub\">계단 아래에서 무언가를 주웠다. 세 장을 뒤집으세요 (동료 · 유물).</div>", "<div class=\"r8sub\">계단 아래에서 무언가를 주웠다. 세 장을 뒤집으세요 — 한 장은 꼭 동료예요 (유물 · 동전).</div>")
open(F, 'w', encoding='utf-8').write(s)
print('page9400 OK')
