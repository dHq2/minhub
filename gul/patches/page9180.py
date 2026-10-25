# v9.7.3 페이지 — page9180.py v1.1 (v1.1: 을/를 받침 / v1.0: 핵심 줄에 '돌격 방식' 단추 (기본 → 공격 → 방어 → 기본, 돌격할 수 있는 고른 아군에게) · 공격돌격 로그 글 (달려와 찌름) · 방어돌격은 몸 충돌 로그에 표시 · 상태 줄에 돌격 방식 · 엔진 patch9150 — 공격돌격 / 방어돌격 시험판)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9170.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.7.2 (2026-10-25)', '<!-- 굴의 전투판 v9.7.3 (2026-10-25)')
rep('     v9.7.2: 돌격 방어 —', '''     v9.7.3: 공격돌격 / 방어돌격 시험판 — 돌격 방식 단추 (기본 = 옛 돌격 그대로 · 공격 = 무기가 먼저 닿는 순간 달려온 힘으로 찌름 (몸은 안 부딪힘 · 피해 큼 · 덜 밀어냄) · 방어 = 몸 · 방패로 들이받음 (더 밀어내고 자세를 크게 깎음 · 무기 피해 적음)) · 양쪽 편 같은 규칙
     v9.7.2: 돌격 방어 —''')
for a, b in (('h1::after{content:" v9.7.2"', 'h1::after{content:" v9.7.3"'), ('<footer>굴의 전투판 v9.7.2', '<footer>굴의 전투판 v9.7.3'), ('return `굴의 전투판 v9.7.2 · ${title}', 'return `굴의 전투판 v9.7.3 · ${title}'),
             ("copyText('굴의 전투판 v9.7.2 자동 판 기록", "copyText('굴의 전투판 v9.7.3 자동 판 기록"), ("o.push(`굴의 전투판 v9.7.2 — ${C.run", "o.push(`굴의 전투판 v9.7.3 — ${C.run"),
             ('의 버전 기록에 — v9.7.2 돌격 방어', '의 버전 기록에 — v9.7.3 공격돌격 / 방어돌격 시험판 / v9.7.2 돌격 방어'),
             ('">v9.7.2 시험판 · 🧱 뭉침 (돌격 방어) · 버팀은 닿은 몸만 · 곁의 동료가 돌격을 받쳐 줌 · 지금 하는 일 보임</span>', '">v9.7.3 시험판 · 돌격 방식 (기본 · 공격 · 방어) · 🧱 뭉침 (돌격 방어) · 버팀은 닿은 몸만 · 지금 하는 일 보임</span>'),
             ("ver: '9.7.2', kind:", "ver: '9.7.3', kind:"), ("RULES_MIG = '9.7.2',", "RULES_MIG = '9.7.3',")):
    rep(a, b)
CM = "{ '': '기본', atk: '공격', def: '방어' }"
rep('<button class="btn ${L.length && L.every(u => u.order && u.order.k === \'clump\') ? \'on\' : \'\'}" type="button" data-ord="clump"',
    '${L.some(u => u.canCharge) ? `<button class="btn ${L.find(u => u.canCharge).chgMode ? \'on\' : \'\'}" type="button" data-ord="chgmode" title="돌격 방식 (누를 때마다 바뀜) — 기본: 예전 돌격 그대로 · 공격: 달리다 무기가 먼저 닿는 순간 찌름 (피해 큼 · 덜 밀어냄 · 몸은 안 부딪힘) · 방어: 몸 · 방패로 들이받음 (더 밀어내고 자세를 크게 깎음 · 피해 적음)">⚔ 돌격: ${' + CM + '[L.find(u => u.canCharge).chgMode || \'\']}</button>` : \'\'}<button class="btn ${L.length && L.every(u => u.order && u.order.k === \'clump\') ? \'on\' : \'\'}" type="button" data-ord="clump"')
rep("  else if (k === 'clump'){", """  else if (k === 'chgmode'){ const C = L.filter(u => u.canCharge); if (!C.length) return; const nx = { '': 'atk', atk: 'def', def: '' }[C[0].chgMode || ''];   /* v9.7.3 돌격 방식 */
    C.forEach(u => { u.chgMode = nx || null; }); toast(`⚔ ${C.map(u => u.name).join(' · ')} 돌격 방식: ${""" + CM + """[nx]}${nx === 'atk' ? ' — 무기가 먼저 닿는 순간 찌름' : nx === 'def' ? ' — 몸 · 방패로 들이받음' : ' — 예전 돌격'}`); hud(); }
  else if (k === 'clump'){""")
rep("  if (u.canCharge && u.noChg) g.push('🚫 돌격 안 함');", "  if (u.canCharge && u.noChg) g.push('🚫 돌격 안 함');\n  if (u.canCharge && u.chgMode) g.push(`⚔ 돌격: ${" + CM + "[u.chgMode]}`);   /* v9.7.3 */")
rep("      case 'impact': if (e.held){", "      case 'chgStab': out.push(`${T(e)}🗡💨 ${n(e.a)} 공격돌격 — 달려와 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 찌름${e.block ? (e.broke ? ' (막았지만 자세가 무너짐)' : ' (막힘)') : ''} · ${e.run}칸 달림`); break;   /* v9.7.3 */\n      case 'impact': if (e.mode === 'def') out.push(`${T(e)}🛡💨 ${n(e.a)} 방어돌격 — 몸으로 들이받음`); if (e.held){")
rep("    case 'impact': if (e.clash)", "    case 'chgStab': return { c: 'bad', s: `${ga(n(e.a))} 달려온 힘을 실어 ${n(e.b)}에게 무기를 내지른다.${e.block ? ' 막혔다.' : ''}` };   /* v9.7.3 */\n    case 'impact': if (e.clash)")
open(F, 'w', encoding='utf-8').write(s)
print('page9180 OK')
