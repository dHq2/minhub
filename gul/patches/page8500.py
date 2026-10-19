# v8.5.0 페이지 — page8500.py v1.0 (전리품 창 다시: page8410.py 를 먼저 돌린 뒤 loot85.js 를 붙이고 · 옛 lootCards 는 lootCardsOld 로 · '받는 사람' · ✨ 알맞게 나누기 클릭 · 새 모양 (l8) · 판 번호 8.5.0)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8410.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.4.1 (2026-10-19)', '<!-- 굴의 전투판 v8.5.0 (2026-10-19)')
rep('     v8.4.1: ', '''     v8.5.0: 전리품 창 다시 — 위에 '받는 사람' 한 줄 (얼굴 · 가방 칸) · 물건은 종류별 (무기 · 방패 / 갑옷 · 투구 / 화살 · 탄) 한 줄씩 · 줄마다 '→ 받는 사람' 단추 하나.
         알맞은 동료가 따로 있으면 ★ 추천 단추 (같은 갈래 무기 · 방패 없는 근접 · 빈 칸 · 체급) · ✨ 알맞게 나누기 (한 번에) · 챙긴 것은 아래 한 줄로.
     v8.4.1: ''')
for a, b in (('h1::after{content:" v8.4.1"', 'h1::after{content:" v8.5.0"'), ('<footer>굴의 전투판 v8.4.1', '<footer>굴의 전투판 v8.5.0'), ('return `굴의 전투판 v8.4.1 · ${title}', 'return `굴의 전투판 v8.5.0 · ${title}'),
             ("copyText('굴의 전투판 v8.4.1 자동 판 기록", "copyText('굴의 전투판 v8.5.0 자동 판 기록"), ("ver: '8.4.1', kind: '1F 여정 기록'", "ver: '8.5.0', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.4.1 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.5.0 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.4.1 조작 다듬기', '의 버전 기록에 — v8.5.0 전리품 창 다시 / v8.4.1 조작 다듬기'),
             ('">v8.4.1 · 조작 다듬기</span>', '">v8.5.0 · 전리품 창 다시</span>'),
             ("RULES_MIG = '8.4.1'", "RULES_MIG = '8.5.0'")):
    rep(a, b)

rep("function lootCards(Wd, PL){", "function lootCardsOld(Wd, PL){   /* v8.5.0 → loot85.js 의 lootCards */")
rep("  const g = e.target.closest('[data-lgive]'); if (g && world){",
    "  { const lt = e.target.closest('[data-lto]'); if (lt){ lootTo = lt.dataset.lto; if ($('crBody')) crRender(); else renderLoot(); return; }   /* v8.5.0 받는 사람 · 알맞게 나누기 */\n"
    "    if (e.target.closest('[data-lauto]') && world){ lootSplit(world, $('crBody') && crCtx ? crCtx.party : lootParty()); if ($('crBody')) crRender(); else renderLoot(); return; } }\n"
    "  const g = e.target.closest('[data-lgive]'); if (g && world){")
rep("/* v7.25.2 정산 · 전리품 카드 */\n", """/* v7.25.2 정산 · 전리품 카드 */
/* v8.5.0 전리품 창 다시 (l8): 받는 사람 한 줄 · 종류별 줄 · 단추 하나 · 추천 */
.banner .lhd .l8auto{margin-left:8px;min-height:32px;padding:4px 12px;border-radius:999px;border:1px solid #d9a94e;background:#2d2633;color:#f3dfae;font:700 12.5px var(--body);cursor:pointer}
.banner .l8to{display:flex;align-items:center;gap:6px;overflow-x:auto;padding:6px 2px 8px;margin-bottom:6px;border-bottom:1px solid #3a3240}
.banner .l8tl{flex:none;font:700 12px var(--body);color:#a39a8c}
.banner .l8p{flex:none;display:flex;flex-direction:column;align-items:center;gap:1px;min-width:52px;min-height:58px;padding:4px;border-radius:9px;border:1px solid #4a3f52;background:#221d27;color:#ece4d6;cursor:pointer}
.banner .l8p.on{border-color:#d9a94e;background:#3a2f22;box-shadow:0 0 0 1px #d9a94e inset}
.banner .l8p i{width:30px;height:30px;border-radius:6px} .banner .l8p small{font:700 11px var(--body)} .banner .l8p em{font:500 10px var(--mono);color:#a39a8c;font-style:normal}
.banner .l8g{margin-bottom:8px} .banner .l8gh{font:800 12.5px var(--body);color:#cfc4b4;margin:2px 0 4px} .banner .l8gh small{color:#8e8577;font-weight:500}
.banner .l8r{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:9px;background:#221d27;border:1px solid #3a3240;margin-bottom:4px;flex-wrap:wrap}
.banner .l8r.worn{border-color:#6b4a3a} .banner .l8r .lnm{flex:1;min-width:120px;position:relative;padding-bottom:4px} .banner .l8r .dur{position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:2px}
.banner .l8go{min-height:36px;padding:4px 12px;border-radius:8px;border:1px solid #6a5a3a;background:#3a2f22;color:#f3dfae;font:700 12.5px var(--body);cursor:pointer} .banner .l8go:disabled{opacity:.5;cursor:default}
.banner .l8fit{min-height:36px;padding:4px 10px;border-radius:8px;border:1px dashed #7bd389;background:transparent;color:#a9e6b2;font:700 12px var(--body);cursor:pointer}
.banner .l8took{margin-top:6px;padding:6px 8px;border-radius:8px;background:#1d1922;font:500 11.5px/1.6 var(--body);color:#a39a8c} .banner .l8took b{color:#cfc4b4;margin-right:4px}
""")
E = open(D + 'loot85.js', encoding='utf-8').read()
rep("\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일", '\n' + E + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")
open(F, 'w', encoding='utf-8').write(s)
print('page8500 OK')
