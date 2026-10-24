# v9.6.2 페이지 — page9110.py v1.0 (v1.0: 전우조 · 대장 연결이 눈에 띄게 — ① 명령 칸의 '관계' 줄을 기술 줄 바로 아래로 (예전엔 긴 단추 줄 맨 아래라 화면 밖) ② PC 아래 기술 막대에 🤝 전우조 · 🎖 대장 단추 (예전엔 휴대폰 도크에만) 아군 카드에는 이미 🤝 · 🎖 표시가 있어 그대로)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9100.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.6.1 (2026-10-24)', '<!-- 굴의 전투판 v9.6.2 (2026-10-24)')
rep('     v9.6.1: 대장이 서둘러 뛰면', '''     v9.6.2: 전우조 · 대장 연결이 눈에 띄게 — 명령 칸의 '관계' 줄을 기술 줄 바로 아래로 (긴 단추 줄 맨 아래라 화면 밖이던 것) · PC 아래 기술 막대에 🤝 전우조 · 🎖 대장 단추 (휴대폰 도크에만 있던 것)
     v9.6.1: 대장이 서둘러 뛰면''')
for a, b in (('h1::after{content:" v9.6.1"', 'h1::after{content:" v9.6.2"'), ('<footer>굴의 전투판 v9.6.1', '<footer>굴의 전투판 v9.6.2'), ('return `굴의 전투판 v9.6.1 · ${title}', 'return `굴의 전투판 v9.6.2 · ${title}'),
             ("copyText('굴의 전투판 v9.6.1 자동 판 기록", "copyText('굴의 전투판 v9.6.2 자동 판 기록"), ("o.push(`굴의 전투판 v9.6.1 — ${C.run", "o.push(`굴의 전투판 v9.6.2 — ${C.run"),
             ('의 버전 기록에 — v9.6.1 대장이 뛰면', '의 버전 기록에 — v9.6.2 전우조 · 대장 연결 단추가 눈에 띄게 / v9.6.1 대장이 뛰면'),
             ('">v9.6.1 · 대장 서둘러 · 암계 역장 · 되돌아가기 · 비전투 맵 만남</span>', '">v9.6.2 · 전우조 · 대장 단추 눈에 띄게 · 대장 서둘러 · 암계 역장</span>'),
             ("ver: '9.6.1', kind:", "ver: '9.6.2', kind:"), ("RULES_MIG = '9.6.1',", "RULES_MIG = '9.6.2',")):
    rep(a, b)
# ① 관계 줄을 기술 줄 아래로
rep("    ${relRowHtml(Wd, L)}\n    <div class=\"row postures\"", "    <div class=\"row postures\"")
rep("}).join('')}</div>\n    <div class=\"row\"><button class=\"btn\" type=\"button\" data-ord=\"auto\"", "}).join('')}</div>\n    ${relRowHtml(Wd, L)}\n    <div class=\"row\"><button class=\"btn\" type=\"button\" data-ord=\"auto\"")
rep(".lk.b{background:#16294a;color:#8fb8ff} .rels .lbl{opacity:.8}", ".lk.b{background:#16294a;color:#8fb8ff} .rels .lbl{opacity:.8} .row.rels{border:1px dashed #b89a4a;background:rgba(184,154,74,.12);border-radius:8px;padding:4px 6px;align-items:center}   /* v9.6.2 */")
# ② PC 기술 막대에 단추
rep("</button>` : ''; })()}` : '';   /* v7.25.1 두 번째 총 */",
    "</button>` : ''; })()}<span class=\"sksep\"></span><button type=\"button\" class=\"sk cmd rel ${relPick === 'mate' ? 'on' : ''}\" data-cmd=\"mate\" title=\"전우조 — 여럿을 골랐으면 바로 맺고 (같은 짝이면 풀림), 한 명이면 누른 뒤 짝을 눌러요\"><span class=\"ic\">🤝</span><span class=\"nm\">전우조</span><span class=\"sb\">${L.length >= 2 && L.every(u => u.cg && u.cg === L[0].cg) ? '풀기' : relPick === 'mate' ? '짝 누르기' : '맺기'}</span></button><button type=\"button\" class=\"sk cmd rel ${relPick === 'chief' ? 'on' : ''}\" data-cmd=\"chief\" title=\"대장-부하 — 고른 아군이 부하가 돼요. 누른 뒤 대장이 될 아군을 눌러요\"><span class=\"ic\">🎖</span><span class=\"nm\">대장</span><span class=\"sb\">${relPick === 'chief' ? '대장 누르기' : '연결'}</span></button>` : '';   /* v7.25.1 두 번째 총 */   /* v9.6.2 전우조 · 대장 */")
rep(".skbar .sksep{", ".sk.rel{flex:0 0 56px;width:56px} .sk.rel .sb{max-width:54px}   /* v9.6.2 */\n.skbar .sksep{")
open(F, 'w', encoding='utf-8').write(s)
print('page9110 OK')
