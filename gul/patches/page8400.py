# v8.4.0 페이지 — page8400.py v1.0 (세르파 슬라임 조직: page8300.py 를 먼저 돌린 뒤 run8_f.js 를 붙이고 · 판마다 sp8Tick · 그림 sp8Draw · 판을 만들기 전 소환 걷음 · 소환은 정산 · 조작판 칩 · 캠페인 띠 셈에서 빠짐 · [레이더] [군주] 설명 · 수치표 이전 8.4.0)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8300.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.3.0 (2026-10-19)', '<!-- 굴의 전투판 v8.4.0 (2026-10-19)')
rep('     v8.3.0: ', '''     v8.4.0: 세르파 슬라임 조직 — 세르파는 작은 슬라임을 계속 뽑아 곁에 둠 (코스트) · 넷을 모아 굴란 (검사) · 몽 (탱커) · 핀 (저격) · 튤린 (치유) 으로 합침 (상황을 보고 고름).
         수정 우박 (예고 원) · 세르파가 쓰러지면 작은 슬라임은 녹음 · 보스든 동료든 같은 규칙. [레이더] (3초마다 둘레 14칸의 적을 앎 — 어둠 · 벽 · 은신과 상관없이).
     v8.3.0: ''')
for a, b in (('h1::after{content:" v8.3.0"', 'h1::after{content:" v8.4.0"'), ('<footer>굴의 전투판 v8.3.0', '<footer>굴의 전투판 v8.4.0'), ('return `굴의 전투판 v8.3.0 · ${title}', 'return `굴의 전투판 v8.4.0 · ${title}'),
             ("copyText('굴의 전투판 v8.3.0 자동 판 기록", "copyText('굴의 전투판 v8.4.0 자동 판 기록"), ("ver: '8.3.0', kind: '1F 여정 기록'", "ver: '8.4.0', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.3.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.4.0 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.3.0 히든보스 적뢰', '의 버전 기록에 — v8.4.0 세르파 슬라임 조직 / v8.3.0 히든보스 적뢰'),
             ('">v8.3.0 · 히든보스 적뢰</span>', '">v8.4.0 · 세르파 슬라임 조직</span>'),
             ("RULES_MIG = '8.3.0'", "RULES_MIG = '8.4.0'")):
    rep(a, b)

# 판마다 · 그림
rep("jrTickAll(world); }   /* v8.3.0 적뢰 · 성해포 */", "jrTickAll(world); sp8Tick(world); }   /* v8.3.0 적뢰 · 성해포 · v8.4.0 세르파 조직 */")
rep("  if (!ed && (Wd.jr8 || Wd.jrq || Wd.jrLines || Wd.rain)) jr8Draw(Wd, ox, oy, ts);", "  if (!ed && (Wd.jr8 || Wd.jrq || Wd.jrLines || Wd.rain)) jr8Draw(Wd, ox, oy, ts);\n  if (!ed && (Wd.sp8 || Wd.sp8Fx || Wd.rpNext)) sp8Draw(Wd, ox, oy, ts);   /* v8.4.0 슬라임 합치기 · 우박 · 레이더 */")
# 소환은 판을 만들기 전에 걷음 · 셈에서 빠짐
rep("  world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0);", "  S.units = S.units.filter(p => !p.summon);   /* v8.4.0 지난 판의 소환 (슬라임) 은 남지 않음 */\n  world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0);")
rep("const stageStats = W => W.units.filter(u => u.side === 0)", "const stageStats = W => W.units.filter(u => u.side === 0 && !u.summon)")
rep("v.out = W.units.filter(u => u.side === 0)", "v.out = W.units.filter(u => u.side === 0 && !u.summon)")
rep("gone = W ? W.units.filter(u => u.side === 0 && u.gone && u.gone !== 'left').length : 0, left = W ? W.units.filter(u => u.side === 0 && u.alive).length : 0", "gone = W ? W.units.filter(u => u.side === 0 && !u.summon && u.gone && u.gone !== 'left').length : 0, left = W ? W.units.filter(u => u.side === 0 && !u.summon && u.alive).length : 0")
rep("const allies = Wd && !(S.mode === 'story' && !S.camp) ? Wd.units.filter(u => u.side === 0) : [];", "const allies = Wd && !(S.mode === 'story' && !S.camp) ? Wd.units.filter(u => u.side === 0 && !(u.summon && (u.gone || u.summon === 'slime'))) : [];   /* v8.4.0 작은 슬라임은 칩 없음 */")
# 특성 설명
rep("\n  '보스': '", "\n  '레이더': '적 위치 탐색 — 3초마다 둘레 14칸의 적을 1.2초 동안 앎 (어둠 · 벽 · 은신과 상관없이). 세르파의 합친 슬라임 넷 (굴란 · 몽 · 핀 · 튤린)',\n  '군주': '무리의 왕 — 세르파: 작은 슬라임을 계속 뽑아 곁에 두고, 넷을 모아 굴란 · 몽 · 핀 · 튤린으로 합침 · 수정 우박',\n  '보스': '")

E = open(D + 'run8_f.js', encoding='utf-8').read()
rep("\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일", '\n' + E + "\nsetMob(); if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); });   // v5.8 모바일")
open(F, 'w', encoding='utf-8').write(s)
print('page8400 OK')
