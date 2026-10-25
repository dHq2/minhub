# v9.7.2 페이지 — page9170.py v1.0 (v1.0: 핵심 줄에 '🧱 뭉침 (돌격 방어)' 단추 — 고른 무리가 어깨를 붙여 적 쪽으로 섬 · 명령 이름 · 로그 '돌격 방어 — 뒤를 받침' · 상태 줄 이유 글 (뭉침 · 돌격 방어) · 엔진 patch9140 — 버팀은 닿은 몸만 · 돌격 방어 본능 (양쪽) · 뭉침 명령)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9160.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.7.1 (2026-10-25)', '<!-- 굴의 전투판 v9.7.2 (2026-10-25)')
rep('     v9.7.1: 생각 순서 고침', '''     v9.7.2: 돌격 방어 — 버팀은 실제로 닿은 몸만 (떨어진 이웃 무게는 안 옴) · 곁의 동료에게 돌격이 오면 근접병이 그 뒤에 몸을 붙여 받침 (양쪽 편) · 🧱 뭉침 명령 (어깨를 붙여 적 쪽으로 · 사수는 뒷줄 · 막기를 든 채)
     v9.7.1: 생각 순서 고침''')
for a, b in (('h1::after{content:" v9.7.1"', 'h1::after{content:" v9.7.2"'), ('<footer>굴의 전투판 v9.7.1', '<footer>굴의 전투판 v9.7.2'), ('return `굴의 전투판 v9.7.1 · ${title}', 'return `굴의 전투판 v9.7.2 · ${title}'),
             ("copyText('굴의 전투판 v9.7.1 자동 판 기록", "copyText('굴의 전투판 v9.7.2 자동 판 기록"), ("o.push(`굴의 전투판 v9.7.1 — ${C.run", "o.push(`굴의 전투판 v9.7.2 — ${C.run"),
             ('의 버전 기록에 — v9.7.1 생각 순서', '의 버전 기록에 — v9.7.2 돌격 방어 (뭉침 · 닿은 몸만 버팀) / v9.7.1 생각 순서'),
             ('">v9.7.1 시험판 · 지금 하는 일 (이유) 보임 · 전우조는 싸움 · 전열 다음 · 무기 그림 · 명령 칸 정리</span>', '">v9.7.2 시험판 · 🧱 뭉침 (돌격 방어) · 버팀은 닿은 몸만 · 곁의 동료가 돌격을 받쳐 줌 · 지금 하는 일 보임</span>'),
             ("ver: '9.7.1', kind:", "ver: '9.7.2', kind:"), ("RULES_MIG = '9.7.1',", "RULES_MIG = '9.7.2',")):
    rep(a, b)
# 단추 (핵심 줄 · 제자리 앞)
rep('<button class="btn" type="button" data-ord="hold" title="그 자리에 멈춰 지킴', '<button class="btn ${L.length && L.every(u => u.order && u.order.k === \'clump\') ? \'on\' : \'\'}" type="button" data-ord="clump" title="돌격 방어 — 고른 무리가 어깨를 붙여 적 쪽으로 섬 (근접 앞줄 · 사수 뒷줄 · 막기를 든 채). 붙어 있을수록 돌격에 덜 밀림 · 대신 사선이 좁아지고 옆 · 뒤 · 범위 공격에 약함">🧱 뭉침</button><button class="btn" type="button" data-ord="hold" title="그 자리에 멈춰 지킴')
rep("  else if (k === 'hold'){ L.forEach(u => { u.order = { k: 'hold' }; stop(u); }); noteOrders(L); }", """  else if (k === 'hold'){ L.forEach(u => { u.order = { k: 'hold' }; stop(u); }); noteOrders(L); }
  else if (k === 'clump'){ const C = L.filter(u => !u.crawl && !u.down); if (!C.length) return; const cx = C.reduce((a, u) => a + u.x, 0) / C.length, cy = C.reduce((a, u) => a + u.y, 0) / C.length;   /* v9.7.2 뭉침 (돌격 방어) */
    const F = world.units.filter(f => f.alive && f.side !== 0 && !f.gone && (f.seenBy || mode === 'edit')).sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy))[0], fa = F ? Math.atan2(F.y - cy, F.x - cx) : (C[0].face || 0), g = (world.cgN = (world.cgN || 0) + 1);
    C.forEach((u, j) => { u.order = { k: 'clump', g, j, x: cx, y: cy, f: fa }; u.stay = null; }); noteOrders(C, 'user', '뭉침 (돌격 방어)'); toast(`🧱 ${C.map(u => u.name).join(' · ')} — 어깨를 붙여 ${F ? F.name + ' 쪽으로' : '앞으로'} 섬 (다른 명령을 주면 풀림)`); }""")
rep("function orderLabel(Wd, o){", "function orderLabel(Wd, o){\n  if (o && o[0] === 'clump') return '🧱 뭉침 (돌격 방어)';   /* v9.7.2 */")
rep("const ordOf = u => u.order && u.order.k === 'frally' ? ['frally'] :", "const ordOf = u => u.order && u.order.k === 'clump' ? ['clump'] : u.order && u.order.k === 'frally' ? ['frally'] :")
# 로그
rep("      case 'pairGo': out.push(", "      case 'cbrace': out.push(`${T(e)}🧱 ${n(e.a)} — ${n(e.c)}의 돌격을 보고 ${n(e.b)}의 뒤에 몸을 붙여 받침`); break;   /* v9.7.2 */\n      case 'pairGo': out.push(")
rep("    case 'pairGo': return e.how === 'keep'", "    case 'cbrace': return { c: 'good', s: `${ga(n(e.a))} ${n(e.c)}의 돌격을 보고 ${n(e.b)}의 등에 어깨를 댄다.` };   /* v9.7.2 */\n    case 'pairGo': return e.how === 'keep'")
rep("'mateRescue', 'stayShot', 'pairGo'].includes(e.k)", "'mateRescue', 'stayShot', 'pairGo', 'cbrace'].includes(e.k)")
rep("pairGo: `🤝 ${n(e.a)} ${e.how === 'pincer'", "cbrace: `🧱 ${n(e.a)} ${n(e.c)}의 돌격 → ${n(e.b)} 뒤를 받침`, pairGo: `🤝 ${n(e.a)} ${e.how === 'pincer'")
rep("HUNT: '적에게 다가감', HEAL: '치유' };", "HUNT: '적에게 다가감', HEAL: '치유', CLUMP: '뭉침 — 어깨를 붙여 버팀', BRACE_CHARGE: '돌격 방어 — 동료 뒤를 받침' };")
open(F, 'w', encoding='utf-8').write(s)
print('page9170 OK')
