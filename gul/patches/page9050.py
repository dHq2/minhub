# v9.4.1 페이지 — page9050.py v1.1 (v1.1: 대화 글자 타이머가 대화 없이 돌다 오류 내던 것 — 가끔 ui8870 이 'null 의 n' 을 봄 · v1.0: 소모품 특수 스킬 (명세 A10) — 가방에 오래된 약병이 있는 아군의 기술 칸에 '약병' (8번) 이 뜸: 동료 (자기도) 를 눌러 먹임 · 다 쓰면 칸이 사라짐 · 장송 치유도 같은 길 (동료 고르기))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9040.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.4.0 (2026-10-24)', '<!-- 굴의 전투판 v9.4.1 (2026-10-24)')
rep('     v9.4.0: 2층 대규모 업데이트 5단계', '''     v9.4.1: 소모품 특수 스킬 (명세 A10) — 가방의 오래된 약병이 있는 아군에게 기술 칸 8번 '약병' 이 뜸 (숫자키 8 · 모바일 기술 고리): 누르고 먹일 동료 (자기도) 를 누름 — 곁 1.7칸 · 최대 체력 25% (15 ~ 60) · 약병 하나 씀 · 다 쓰면 칸도 사라짐. 장송 치유 (동료 고르기) 도 같은 길
     v9.4.0: 2층 대규모 업데이트 5단계''')
for a, b in (('h1::after{content:" v9.4.0"', 'h1::after{content:" v9.4.1"'), ('<footer>굴의 전투판 v9.4.0', '<footer>굴의 전투판 v9.4.1'), ('return `굴의 전투판 v9.4.0 · ${title}', 'return `굴의 전투판 v9.4.1 · ${title}'),
             ("copyText('굴의 전투판 v9.4.0 자동 판 기록", "copyText('굴의 전투판 v9.4.1 자동 판 기록"), ("o.push(`굴의 전투판 v9.4.0 — ${C.run", "o.push(`굴의 전투판 v9.4.1 — ${C.run"),
             ('의 버전 기록에 — v9.4.0 ❓ 만남 구조', '의 버전 기록에 — v9.4.1 오래된 약병 (특수 스킬) / v9.4.0 ❓ 만남 구조'),
             ('">v9.4.0 · ❓ 만남 구조 (쉬기 · 비전투 맵 · 노숙악마 · 두건)</span>', '">v9.4.1 · 오래된 약병 (특수 스킬) · ❓ 만남 구조</span>'),
             ("ver: '9.4.0', kind:", "ver: '9.4.1', kind:"), ("RULES_MIG = '9.4.0',", "RULES_MIG = '9.4.1',")):
    rep(a, b)

rep("const OLD_VIAL8 = { k: 'potion', name: '오래된 약병', label: '', heal: 0.25, min: 15, cap: 60 };", "const OLD_VIAL8 = { k: 'potion', name: '오래된 약병', label: '', vial: true, heal: 0.25, min: 15, cap: 60 };")
# 기술 칸: 8번 약병
rep("const specAt = (u, k) => (u.spec || [])[k === 'spec2' ? 1 : 0];", "const specAt = (u, k) => (u.spec || []).filter(x => x.k !== 'vial')[k === 'spec2' ? 1 : 0];   /* v9.4.1 약병은 따로 8번 칸 */")
rep("{ k: 'spec1', name: '특수 1', has: u => (u.spec || []).length >= 1 && !u.crawl },", "{ k: 'spec1', name: '특수 1', has: u => (u.spec || []).filter(x => x.k !== 'vial').length >= 1 && !u.crawl },")
rep("{ k: 'spec2', name: '특수 2', has: u => (u.spec || []).length >= 2 && !u.crawl },\n];", "{ k: 'spec2', name: '특수 2', has: u => (u.spec || []).filter(x => x.k !== 'vial').length >= 2 && !u.crawl },\n  { k: 'pot', name: '약병', has: u => (u.spec || []).some(x => x.k === 'vial') && !u.crawl },   // v9.4.1 소모품 특수 스킬 (오래된 약병)\n];")
rep("const SLOT_IC = { charge: '💨', throw: '🔱', leap: '⤴', skill: '✚', palm: '💥', spec1: '★', spec2: '★' };", "const SLOT_IC = { charge: '💨', throw: '🔱', leap: '⤴', skill: '✚', palm: '💥', spec1: '★', spec2: '★', pot: '🧪' };")
rep("const spOf = (C, k) => k === 'leap' || k === 'palm' || k === 'skill' || k === 'spec1' || k === 'spec2' ||", "const spOf = (C, k) => k === 'leap' || k === 'palm' || k === 'skill' || k === 'spec1' || k === 'spec2' || k === 'pot' ||")
rep("  const kcd = Math.max(0, ...C.map(u => u.skill.kit ? u.skill.cdT - Wd.t : 0)), ko = C.find(u => u.order && u.order.k === 'skill');",
    "  if (S2.k === 'pot'){ const n = C.reduce((a, u) => a + ((specOf(u, 'vial') || {}).n || 0), 0), cd = Math.max(0, ...C.map(u => (specOf(u, 'vial') || { cdT: 0 }).cdT - Wd.t)); return armed && armed.k === 'spec' && armed.slot === 'pot' ? SPEC_TGT.vial : '오래된 약병 ×' + n + (cd > 0 ? ' (' + f2(cd) + '초)' : ''); }   /* v9.4.1 */\n  const kcd = Math.max(0, ...C.map(u => u.skill.kit ? u.skill.cdT - Wd.t : 0)), ko = C.find(u => u.order && u.order.k === 'skill');")
rep("  else { const K = C[0].skill; st.nm = K.name; st.ix = K.inf ? '재생'", "  else if (S2.k === 'pot'){ const n = C.reduce((a, u) => a + ((specOf(u, 'vial') || {}).n || 0), 0), so = C.find(u => u.order && u.order.k === 'spec' && u.order.s === 'vial'); st.nm = '오래된 약병'; st.ix = '약병'; st.ic = '🧪'; st.cd = Math.max(0, ...C.map(u => (specOf(u, 'vial') || { cdT: 0 }).cdT - Wd.t)); st.cdMax = ((Wd.rules.spec || {}).vial || {}).cd || 1; st.on = !!(armed && armed.k === 'spec' && armed.slot === 'pot'); st.ord = so && so.order.b != null && Wd.units[so.order.b] ? Wd.units[so.order.b].name : null; st.sb = st.on ? '동료를 누름' : '×' + n; }   /* v9.4.1 */\n  else { const K = C[0].skill; st.nm = K.name; st.ix = K.inf ? '재생'")
rep("  ordKey('skill');\n}\n// v6.7.4 도약:", "  if (S2.k === 'pot'){ const D = C.filter(u => specOf(u, 'vial')); armed = armed && armed.k === 'spec' && armed.slot === 'pot' ? null : { k: 'spec', slot: 'pot', s: 'vial', cas: D.map(u => u.i) }; chargePick = throwPick = skillPick = palmPick = leapPick = null; if (armed) toast('🧪 오래된 약병 — 먹일 동료를 누르세요 (자기 자신도 · Esc 취소)'); hud(); return; }   // v9.4.1\n  ordKey('skill');\n}\n// v6.7.4 도약:")
rep("if (/^[1-7]$/.test(e.code ? e.code.replace('Digit', '') : k) && mode !== 'edit' && world && !world.over && sel.size && !e.shiftKey){", "if (/^[1-8]$/.test(e.code ? e.code.replace('Digit', '') : k) && mode !== 'edit' && world && !world.over && sel.size && !e.shiftKey){")
rep("const SPEC_IC = { bfield: '🛡',", "const SPEC_IC = { vial: '🧪', bfield: '🛡',")
rep("const SPEC_TGT = { bfield: ", "const SPEC_TGT = { vial: '🧪 오래된 약병: 먹일 동료를 탭 (자기 자신도 — 곁 1.7칸 · 최대 체력 25% (15 ~ 60) 를 먹임 · 약병 하나 씀 · 멀면 다가감)', bfield: ")
# 동료 고르기 (약병 · 장송 치유)
rep("    if (u && u.side !== 0){ if (!u.seenBy){ toast('안 보이는 적에게는 못 써요'); return; } C.forEach(x => { x.order = { k: 'spec', s: A0.s, b: u.i }; });",
    "    if (u && u.side === 0 && (A0.s === 'vial' || A0.s === 'bmend')){ C.forEach(x => { x.order = { k: 'spec', s: A0.s, b: u.i }; }); noteOrders(C); toast(`${C.map(x => x.name).join(' · ')} → ${u.name}: ${nm}`); return done(); }   /* v9.4.1 동료 고르기 */\n    if (u && u.side !== 0){ if (!u.seenBy){ toast('안 보이는 적에게는 못 써요'); return; } C.forEach(x => { x.order = { k: 'spec', s: A0.s, b: u.i }; });")
# 로그 · 해설
rep("      case 'bmend': out.push(", "      case 'vial': out.push(`${T(e)}🧪 ${n(e.a)} → ${e.a === e.b ? '스스로' : n(e.b)} 오래된 약병 +${e.n} (남은 ${e.left})`); break;   // v9.4.1\n      case 'bmend': out.push(")
rep("    case 'bmend': return {", "    case 'vial': return { c: 'good', s: e.a === e.b ? `${ga(n(e.a))} 오래된 약병을 단숨에 들이켠다.` : `${ga(n(e.a))} ${n(e.b)}의 입에 오래된 약병을 기울여 준다.` };   // v9.4.1\n    case 'bmend': return {")
rep("  TK.timer = setInterval(() => { TK.n += 2; el.textContent = full.slice(0, TK.n); if (TK.n >= full.length) talkDone(); }, 32);",
    "  const tmr = TK.timer = setInterval(() => { if (!TK){ clearInterval(tmr); return; } TK.n += 2; el.textContent = full.slice(0, TK.n); if (TK.n >= full.length) talkDone(); }, 32);   /* v9.4.1 대화가 (시험 · 오류로) 먼저 없어졌으면 글자 타이머도 멈춤 */")
open(F, 'w', encoding='utf-8').write(s)
print('page9050 OK')
