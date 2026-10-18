# v7.25.1 페이지 — page7251.py v1.1 (v1.1: 도감 정보 (PROFILE) 의 영거리 사격도 뺌 · 간두: 기술 (영거리 사격) 대신 두 번째 총 샷건 (특수탄 100) — 바꿔 들기 단추 (M) · 기동 사수 ([반사신경] · [전투센스] · 기동) / [전투센스] 설명 ·
#   저장된 간두 옮김 · 상세에 두 번째 총 · 로그 · 이야기)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7250.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.25.0 (2026-10-18)', '<!-- 굴의 전투판 v7.25.1 (2026-10-18)')
rep('     v7.25.0: ', '''     v7.25.1: 간두 — 샷건은 기술이 아니라 두 번째 총: 늘 지니고 바꿔 들면 (총끼리 0.35초) 지금 총과 탄이 서로 자리를 바꿈. 특수탄 100 은 샷건 몫. 샷건은 코앞 (1.8칸) 에서 피해 × 2.2 · 밀어냄.
         자동: 근접이 붙으면 샷건 · 멀어지면 권총. 단추 '🔁 무기 바꾸기 (M)'. 기동 사수 — [반사신경] · [전투센스] (못 본 쪽 공격도 잘 피함 · 고립돼 맞아도 엎드리지 않고 움직이며 쏨) · 기동 (걸음 3.2).
     v7.25.0: ''')
rep('h1::after{content:" v7.25.0"', 'h1::after{content:" v7.25.1"')
rep('<footer>굴의 전투판 v7.25.0', '<footer>굴의 전투판 v7.25.1')
rep('return `굴의 전투판 v7.25.0 · ${title}', 'return `굴의 전투판 v7.25.1 · ${title}')
rep("copyText('굴의 전투판 v7.25.0 자동 판 기록", "copyText('굴의 전투판 v7.25.1 자동 판 기록")
rep('의 버전 기록에 — v7.25.0 알현실 빛 · 철퇴 · 세자르 고침', '의 버전 기록에 — v7.25.1 간두 두 번째 총 · 기동 사수 / v7.25.0 알현실 빛 · 철퇴 · 세자르 고침')
rep('">v7.25.0 · 알현실 · 철퇴 · 세자르</span>', '">v7.25.1 · 간두 샷건 · 기동 사수</span>')
rep("ver: '7.25.0', at:", "ver: '7.25.1', at:")
rep("RULES_MIG = '7.25.0'", "RULES_MIG = '7.25.1'")   # 새 칸 (샷건 near · 빠른 바꿔 들기 · csense) 채움

# 간두
rep("cls: '원거리', role: '사수', weapon: '권총', ammo: 100, sm: 1.38, height: 1.9, weight: 85, sizeCls: '중형', nv: true, nvG: 'B', ov: { hp: 110, atk: 26 }, traits: ['사격A', '회피B', '은신C'], active: ['영거리 사격'], shells: 100, race: '인간', origin: '인간계와 비슷한 어느 곳 — 항쟁 끝에 하수구로 도망쳐 당도', tactic: '권총 연사 · 샷건 영거리 사격 (특수탄)', note: '갱스터. 권총을 빠르게 연사 (12발 탄창 · 일반탄 100). 엎드려 쏠 수 있음. 회피가 좋고 근접에도 재능. 샷건 영거리 사격 (특수탄 100) — 붙은 상대를 날려 보냄' },",
    "cls: '기동', role: '사수', weapon: '권총', ammo: 100, alt: { name: '샷건', ammo: 100 }, sm: 0.95, height: 1.9, weight: 85, sizeCls: '중형', nv: true, nvG: 'B', ov: { hp: 110, atk: 26 }, traits: ['사격A', '회피B', '은신C', '반사신경', '전투센스'], race: '인간', origin: '인간계와 비슷한 어느 곳 — 항쟁 끝에 하수구로 도망쳐 당도', tactic: '기동 사수 — 권총 연사 · 붙으면 샷건으로 바꿔 듦 (특수탄)', note: '갱스터. 반사신경 · 전투 센스 · 기동이 뛰어난 기동 사수 — 엎드리기보다 움직이며 쏨. 권총을 빠르게 연사 (12발 탄창 · 일반탄 100). 두 번째 총 샷건 (특수탄 100) 을 늘 지니고 바꿔 듦 — 코앞에서 크게 맞히고 날려 보냄' },   /* v7.25.1 */")
rep("for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells']) if (pf[k] != null && u[k] == null)", "for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells', 'alt']) if (pf[k] != null && u[k] == null)")
rep("'sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells']) if (pf[k] === undefined && d[k] !== undefined)", "'sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells', 'alt']) if (pf[k] === undefined && d[k] !== undefined)")
rep("'regenK', 'leapN', 'shells', 'brain',", "'regenK', 'leapN', 'shells', 'alt', 'brain',")
rep("'C-195': ['영거리 사격'], ", "")   # v7.25.1 간두는 기술 대신 두 번째 총
rep("'C-195': { active: ['영거리 사격'] }", "'C-195': {}")   # v7.25.1 도감 정보에서도 뺌
rep("if (!S.v7250m){", """// v7.25.1 저장된 간두: 영거리 사격 (기술) → 두 번째 총 샷건 (남은 특수탄 그대로) · 기동 사수 ([반사신경] · [전투센스] · 기동)
const fix7251 = p => { if (!p || p.ref !== 'C-195' || (p.side || 0) !== 0 || p.alt) return false; p.active = (p.active || []).filter(a => a !== '영거리 사격'); p.alt = { name: '샷건', ammo: p.shells != null ? +p.shells : 100 }; delete p.shells;
  if (p.cls === '원거리'){ p.cls = '기동'; if (+p.sm === 1.38) p.sm = 0.95; } p.traits = p.traits || []; for (const t of ['반사신경', '전투센스']) if (!p.traits.includes(t)) p.traits.push(t); return true; };
if (!S.v7251m){ try { const L = [...(S.units || []), ...((S.campBak || {}).units || []), ...(((S.story || {}).board || {}).units || []), ...(((S.camp || {}).lostP) || []), ...((((S.story || {}).camp || {}).lostP) || [])]; for (const u of L) fix7251(u); const mine = myDesigns(); let dc = false; for (const d of mine) if (fix7251(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {} S.v7251m = true; }
if (!S.v7250m){""")
rep("  '반사신경': '반사신경과 직감:", "  '전투센스': '싸움을 읽는 감 (v7.25.1) — 못 본 쪽 (옆 · 뒤 · 어둠) 에서 오는 공격도 잘 피함 (회피 감각 0.8 — 보통은 0.35) · 고립돼 탄이 쏟아져도 엎드리지 않고 움직이며 쏨 (기동 사수)',\n  '반사신경': '반사신경과 직감:")

# 바꿔 들기 단추 · 명령 · 단축키 (M)
rep("  else if (k === 'line') giveLine(L);   // v5.7 전열 명령",
    "  else if (k === 'line') giveLine(L);   // v5.7 전열 명령\n"
    "  else if (k === 'alt'){ const A = L.filter(u => u.alive && u.alt); if (!A.length){ toast('바꿔 들 두 번째 총이 없어요'); return; } A.forEach(u => { u.order = { k: 'alt' }; }); noteOrders(A, 'user', '무기 바꾸기'); toast(A.map(u => `${u.name}: ${u.weapon} → ${u.alt.name}`).join(' · ')); }   // v7.25.1")
rep("{ h: 'hold', g: 'auto', q: 'skill',", "{ m: 'alt', h: 'hold', g: 'auto', q: 'skill',")
rep('data-cmd="lret" title="전열 후퇴 (K) — 전열째로 방패를 든 채 물러섬"><kbd>K</kbd><span class="ic">🛡</span><span class="nm">전열 후퇴</span><span class="sb">${(lretLine(Wd, lr) || { ids: [] }).ids.length}마디</span></button>` : \'\'}` : \'\';',
    'data-cmd="lret" title="전열 후퇴 (K) — 전열째로 방패를 든 채 물러섬"><kbd>K</kbd><span class="ic">🛡</span><span class="nm">전열 후퇴</span><span class="sb">${(lretLine(Wd, lr) || { ids: [] }).ids.length}마디</span></button>` : \'\'}${(() => { const a = L.find(u => u.alt); return a ? `<button type="button" class="sk cmd" data-cmd="alt" title="무기 바꾸기 (M) — ${esc(a.weapon)} ↔ ${esc(a.alt.name)} (총끼리 0.35초)"><kbd>M</kbd><span class="ic">🔁</span><span class="nm">${esc(a.alt.name)}으로</span><span class="sb">${a.alt.ammo != null ? \'탄 \' + a.alt.ammo : \'\'}</span></button>` : \'\'; })()}` : \'\';   /* v7.25.1 두 번째 총 */')
rep("  if (['amove', 'hold', 'auto', 'line', 'lret',", "  if (['alt', 'amove', 'hold', 'auto', 'line', 'lret',")
rep('      + `<button type="button" class="db" data-dk="hold"><span class="ic">■</span>제자리</',
    '      + (L.some(u => u.alt) ? `<button type="button" class="db" data-dk="alt"><span class="ic">🔁</span>${esc(L.find(u => u.alt).alt.name)}으로<small>${L.find(u => u.alt).alt.ammo != null ? \'탄 \' + L.find(u => u.alt).alt.ammo : \'\'}</small></button>` : \'\')   // v7.25.1 두 번째 총\n'
    '      + `<button type="button" class="db" data-dk="hold"><span class="ic">■</span>제자리</')
# 상세 · 로그 · 이야기
rep("    ${(u.spec || []).map(x => `<span class=\"tr\">", "    ${u.alt ? `<span class=\"tr\">🔁 <i>[두 번째 총]</i> ${esc(u.alt.name)}${u.alt.ammo != null ? ' · ' + (/샷건|저격총/.test(u.alt.name) ? '특수탄' : '탄') + ' ' + u.alt.ammo : ''} — 바꿔 들기 (M)</span>` : ''}${(u.spec || []).map(x => `<span class=\"tr\">")
rep("      case 'bagSwap': out.push(", "      case 'altSwap': out.push(`${T(e)}🔁 ${n(e.a)} ${e.from} → ${e.w} 바꿔 듦${e.n != null ? ' (탄 ' + e.n + ')' : ''}${e.why ? ' — ' + e.why : ''}`); break;   // v7.25.1\n      case 'bagSwap': out.push(")
rep("    case 'bagSwap': return e.vis ?", "    case 'altSwap': return e.vis ? { c: 'dim', s: `${ga(n(e.a))} ${reul(e.from)} 집어넣고 ${reul(e.w)} 꺼내 든다.` } : null;   // v7.25.1\n    case 'bagSwap': return e.vis ?")
open(F, 'w', encoding='utf-8').write(s)
print('page7251 OK')
