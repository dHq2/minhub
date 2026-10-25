# v9.9.0 페이지 — page9240.py v1.0 (v1.0: 막기 방식 단추를 '막기 풀기' 하나로 (경계 · 전투 중엔 자동으로 듦) · 돌격 방식 단추 없앰 (돌격은 한 가지) · 냄새 부채꼴은 예전처럼 늘 보임 · 인주도 부하가 될 수 있음 (관계 칸 · 연결) · 상태 줄 막기 글 · 엔진 patch9190)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9230.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.8.2 (2026-10-25)', '<!-- 굴의 전투판 v9.9.0 (2026-10-25)')
rep('     v9.8.2: 암계 역장 새로', '''     v9.9.0: 막기 자동 (경계 · 전투 중엔 늘 듦 · '막기 풀기' 만) · 돌격은 한 가지 (무기가 먼저 닿으면 무기로 치고 넉백 · 방패 · 맨손 · 거구는 몸으로) · 인주도 공통 (부하 가능) · 넓게 휘두르기 준비 중 동료가 들어오면 찍기로 · 대기 몸짓 (고개 · 0.3칸 안 걸음) · 냄새 부채꼴 늘 보임
     v9.8.2: 암계 역장 새로''')
for a, b in (('h1::after{content:" v9.8.2"', 'h1::after{content:" v9.9.0"'), ('<footer>굴의 전투판 v9.8.2', '<footer>굴의 전투판 v9.9.0'), ('return `굴의 전투판 v9.8.2 · ${title}', 'return `굴의 전투판 v9.9.0 · ${title}'),
             ("copyText('굴의 전투판 v9.8.2 자동 판 기록", "copyText('굴의 전투판 v9.9.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.8.2 — ${C.run", "o.push(`굴의 전투판 v9.9.0 — ${C.run"),
             ('의 버전 기록에 — v9.8.2 역장', '의 버전 기록에 — v9.9.0 막기 자동 · 돌격 한 가지 · 인주 공통 / v9.8.2 역장'),
             ('">v9.8.2 역장 (보랏빛 장벽) · 화살비 (붉은 원) · 길찾기 개선 · 무기 = 사거리 · 세포막</span>', '">v9.9.0 막기 자동 · 돌격 한 가지 · 인주도 부하 가능 · 역장 · 화살비 · 길찾기</span>'),
             ("ver: '9.8.2', kind:", "ver: '9.9.0', kind:"), ("RULES_MIG = '9.8.2',", "RULES_MIG = '9.9.0',")):
    rep(a, b)
# 냄새 부채꼴 늘 보임
rep(" && (detail() || see || OVL.sense)){   /* v9.8.0 냄새 부채꼴은 볼 때만 */", "){   /* v9.9.0 냄새 부채꼴은 늘 (예전처럼) */")
# 막기 단추 → 막기 풀기
rep("""${L.some(u => u.canGuard) ? `<button class="btn ${L.find(u => u.canGuard).guardMode === 'hold' ? 'on' : ''}" type="button" data-ord="guard" title="자동: 위협이 보이면 듦 (방패는 든 채 침) · 유지: 늘 듦, 틈이 보일 때만 침 · 공격 위주: 안 듦 (온 힘으로 · 갑옷만)">막기: ${GM_SHORT[L.find(u => u.canGuard).guardMode || 'auto']} <kbd>B</kbd></button>`""",
    """${L.some(u => u.canGuard) ? `<button class="btn ${L.find(u => u.canGuard).guardOff ? 'on' : ''}" type="button" data-ord="guard" title="막기는 자동 — 적을 알고 맵이 정리되기 전 (경계 · 전투) 엔 늘 들고, 평소엔 위협이 보일 때만. 이 단추는 일부러 내려 두기 (온 힘으로 치기) · 다시 누르면 자동">${L.find(u => u.canGuard).guardOff ? '🛡 막기 풀어 둠' : '🛡 막기 자동'} <kbd>B</kbd></button>`""")
rep("""(gu ? `<button type="button" class="db ${gu.guardMode === 'hold' ? 'on' : ''}" data-dk="guard"><span class="ic">🛡</span>막기<small>${GM_SHORT[gu.guardMode || 'auto']}</small></button>`""",
    """(gu ? `<button type="button" class="db ${gu.guardOff ? 'on' : ''}" data-dk="guard"><span class="ic">🛡</span>막기<small>${gu.guardOff ? '풀어 둠' : '자동'}</small></button>`""")
i0 = s.index("    const nx = { auto: 'hold', hold: 'off', off: 'auto' }[C[0].guardMode || 'auto'];"); i1 = s.index("\n  }\n", i0)
s = s[:i0] + "    const off = !C[0].guardOff; C.forEach(u => { u.guardOff = off; u.guardMode = off ? 'off' : 'auto'; logEv(world, { k: 'guardMode', a: u.i, m: off ? 'off' : 'auto', why: '명령', live: mode === 'run' && !paused, ctx: cmdCtx(world, [u])[0] }); });   /* v9.9.0 막기는 자동 · 풀기만 */\n    toast(`${C.map(u => u.name).join(' · ')} — ${off ? '막기를 풀어 둠 (온 힘으로 침 · 다시 누르면 자동)' : '막기 자동 (경계 · 전투 중엔 늘 듦)'}`);" + s[i1:]
rep("  if (u.canGuard) g.push(`<span title=\"자세 — 막을 때마다 깎이고 0이면 막기가 깨짐\">🛡 자세 ${q(u.post)}${Wd.t < u.brokenT ? ' (깨짐)' : ''}</span>`, `<span title=\"막기\">막기 ${GM_SHORT[u.guardMode || 'auto']}${guardOn(Wd, u) ? ' · 들었음' : ''}</span>`);",
    "  if (u.canGuard) g.push(`<span title=\"자세 — 막을 때마다 깎이고 0이면 막기가 깨짐\">🛡 자세 ${q(u.post)}${Wd.t < u.brokenT ? ' (깨짐)' : ''}</span>`, `<span title=\"막기\">막기 ${u.guardOff ? '풀어 둠' : alertOn(Wd, u.side) ? '유지 (경계)' : '평소'}${guardOn(Wd, u) ? ' · 들었음' : ''}</span>`);")
# 돌격 방식 단추 없앰
i0 = s.index("${L.some(u => u.canCharge) ? `<button class=\"btn ${L.find(u => u.canCharge).chgMode ? 'on' : ''}\" type=\"button\" data-ord=\"chgmode\""); i1 = s.index("</button>` : ''}", i0) + len("</button>` : ''}"); s = s[:i0] + s[i1:]
i0 = s.index("      + (L.some(u => u.canCharge) ? `<button type=\"button\" class=\"db ${L.find(u => u.canCharge).chgMode ? 'on' : ''}\" data-dk=\"chgmode\""); i1 = s.index("</button>` : '')", i0) + len("</button>` : '')"); s = s[:i0] + s[i1:]
rep("  if (u.canCharge && u.chgMode) g.push(", "  if (false && u.canCharge && u.chgMode) g.push(")
# 인주도 공통
rep("const Fo = L.filter(u => !u.hero); if (!Fo.length){ toast('부하로 삼을 아군을 먼저 고르세요 (인주는 부하가 될 수 없어요)'); return;", "const Fo = L.slice(); if (!Fo.length){ toast('부하로 삼을 아군을 먼저 고르세요'); return;")
rep("  for (const u of al){ if (u.sqLead == null || u.hero) continue;", "  for (const u of al){ if (u.sqLead == null) continue;")
rep("${p.hero ? '<span class=\"lb\">인주 — 모두의 기본 대장</span>' : relSelects(p,", "${relSelects(p,")
rep("u.rank = p.rank != null ? p.rank : u.rank; if (u.hero) return; u.cg = null;", "u.rank = p.rank != null ? p.rank : u.rank; u.cg = null;")
rep("const u = W.units[k]; if (!u || u.side !== 0 || u.hero) return; if (Dp && u !== Dp", "const u = W.units[k]; if (!u || u.side !== 0) return; if (Dp && u !== Dp")
open(F, 'w', encoding='utf-8').write(s)
print('page9240 OK')
