# v8.7.0 페이지 — page8700.py v1.2 (v1.2: 지도 칸 '관중 통로' · v1.1: 층 보스 정산 단추 '▼ 아래층으로' · v1.0: 여정 구조 v2 — page8600.py 를 먼저 돌린 뒤: run8_h.js (지대 · 구획 · 소품 · 도감 적 설계) 를 붙이고 · 판을 만든 뒤 r8BattleHook · 지나가기 / 칼데라는 출구가 처음부터 열림 (동전 40%) · 층 보스를 이기면 아래층 · 지도 칸 이름 (지나가기 · 진지) · 소품 그림 잘라 build/art/prop · 판 번호 8.7.0)
import subprocess, re, json
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8600.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.6.0 (2026-10-19)', '<!-- 굴의 전투판 v8.7.0 (2026-10-19)')
rep('     v8.6.0: ', '''     v8.7.0: 여정 구조 v2 — 층 = 주제 (지대 25 · 깊이마다 무작위) · 고정층 (3 · 5 · 10 · 15 · 20 · 25 · 30) 을 화면에 밝힘 · 층의 흐름 MS-MS-S-MS-S-(MS/S/S)-S-층 보스 · MS 는 확대한 맵을 잘라 만든 구획 (못 가는 곳은 막고 · 소품으로 엄폐 · 진지) · 지나가기 (싸우지 않고 빠져나가도 됨) · 칼데라 (2 ~ 9층 · 침대까지) · 그림 맵 166장 · 도감 적 설계 100 (팩션 · 짐승 · 마족) · 층 보스 정예 23
     v8.6.0: ''')
for a, b in (('h1::after{content:" v8.6.0"', 'h1::after{content:" v8.7.0"'), ('<footer>굴의 전투판 v8.6.0', '<footer>굴의 전투판 v8.7.0'), ('return `굴의 전투판 v8.6.0 · ${title}', 'return `굴의 전투판 v8.7.0 · ${title}'),
             ("copyText('굴의 전투판 v8.6.0 자동 판 기록", "copyText('굴의 전투판 v8.7.0 자동 판 기록"), ("ver: '8.6.0', kind: '1F 여정 기록'", "ver: '8.7.0', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.6.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.7.0 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.6.0 적뢰 충실 이식 (2D · 3D)', '의 버전 기록에 — v8.7.0 여정 구조 v2 / v8.6.0 적뢰 충실 이식 (2D · 3D)'),
             ('">v8.6.0 · 적뢰 충실 이식</span>', '">v8.7.0 · 여정 구조 v2</span>'),
             ("RULES_MIG = '8.6.0'", "RULES_MIG = '8.7.0'")):
    rep(a, b)
# 판을 만든 뒤: 지나가기 · 칼데라
rep("world.exitLock = true; if (M && M.fall) world.fall8 = true; }", "world.exitLock = true; if (M && M.fall) world.fall8 = true; if (typeof r8BattleHook === 'function') r8BattleHook(n, M); }")
# 캠페인 띠: 출구가 열려 있으면 '출구로'
rep("else if (S.art8){ h = W.cleared ? h.replace", "else if (S.art8){ h = (W.cleared || !W.exitLock) ? h.replace")
# 보상: 지나가기로 빠져나가면 동전 40% · 유물 없음
rep("Math.round(r8Rnd(G[0], G[1]) * (r8Has('coin') ? 1.5 : 1) * cm.mul)", "Math.round(r8Rnd(G[0], G[1]) * (r8Has('coin') ? 1.5 : 1) * cm.mul * ((W.r8 || {}).pass && !W.cleared ? 0.4 : 1))")
rep("if (node.t === 'elite' || (node.t === 'fight' && Math.random() < 0.18)) relic = r8GiveRelic();", "if (!((W.r8 || {}).pass && !W.cleared) && (node.t === 'elite' || (node.t === 'fight' && Math.random() < 0.18))) relic = r8GiveRelic();")
# 층 보스를 이기면 아래층으로
rep("    if (node.t === 'boss'){ r8AfterBoss(node); return; }", "    if (node.t === 'boss'){ r8AfterBoss(node); return; }\n    if (node.stair){ world = null; r8Next(); return; }   /* v8.7.0 층 보스 */")
rep("'다음 심판으로' : '지도로', after, party);", "'다음 심판으로' : node.stair ? '▼ 아래층으로' : '지도로', after, party);")
# 지도 칸 이름 · 머리말
rep("n.t === 'fixed' ? r8FixedName(n.k) : N.nm;", "n.t === 'fixed' ? r8FixedName(n.k) : n.champ ? '관중 통로' : n.ms === 'pass' ? '지나가기' : n.ms === 'fort' ? '진지' : n.ms === 'open' ? '칼데라' : N.nm;")
rep("F.boss ? '보스가 기다리는 층' : '갈림길 — 빛나는 칸을 골라 나아가세요'", "(F.fixed8 ? '✧ 고정층 · ' : `무작위 지대 · `) + (F.boss ? '보스가 기다리는 층' : 'MS · S 를 지나 층 보스까지 — 한 번은 갈림길')")
# 모듈
E = open(D + 'run8_h.js', encoding='utf-8').read()
rep("\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일", '\n' + E + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")
open(F, 'w', encoding='utf-8').write(s)
# 소품 그림 (도감 꾸러미에서 잘라 build/art/prop)
ids = sorted(set(re.findall(r"\['((?:H|P3)-[A-Za-z0-9-]+)',", E)) | {'H-120'})
subprocess.run(['python3', '-I', D + 'tools/props.py', 'cut'] + ids, check=True)
print('page8700 OK props', len(ids))
