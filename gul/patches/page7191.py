# v7.19.1 페이지 — page7191.py v1.2 (v1.2: 철퇴 후리기 로그 이름 flailSweep · v1.1: 대상 없는 기술 준비 (철퇴 후리기) 로그 · 서술이 깨지지 않게 · 고유 기술 다섯: 설계 · 정체성 · 액티브 설명 · 기술 칸 6 · 7 (특수 1 · 2) · 대상 고르기 · 부채 · 숫자키 · 로그 · 서술 · 상세 · 아이콘 · 옛 저장)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
import json, re
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
IX = json.load(open(D + 'icons_idx.json', encoding='utf-8'))

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.19.0 (2026-10-18)', '<!-- 굴의 전투판 v7.19.1 (2026-10-18)')
rep('     v7.19.0: ', '''     v7.19.1: 고유 기술 다섯 (적 · 아군 같은 규칙 · 명령 + 스스로) — 기술 칸 6 · 7 (특수 1 · 2) · 꾹 누름 부채 · 숫자키 6 · 7.
         탕아 [공중제비]: 적을 누르면 3.2칸까지 뛰어올라 몸 앞에 내려찍음 (뛴 방향 세로 1.5칸 · 폭 0.9 안의 적 모두 · 피해 ×2.3 · 치명 +25% · 넘어뜨림) · 바닥을 누르면 그쪽으로 2.6칸 빠짐. 7초 (빠지기 3초). 스스로: 닿을 거리면 내려찍고, 다치면 빠짐.
         쟝 [머리 찍기]: 판에 한 번 — 다음 일격이 머리에 확정 치명 · 중대형까지 2% 즉사. 간두 [영거리 사격]: 특수탄 (100) 샷건 — 2.4칸 안 · 피해 ×2.6 · 크게 날려 보냄 (2.8초). 붙으면 스스로.
         모닝스타 [철퇴 후리기]: 둘레 1.9칸을 뒤부터 한 바퀴 — 동료도 맞음 · 맞으면 쓸려 나감 · 중대형 이상이 막으면 50% 로 회전이 멈춤 (8초). [휘둘러 치기]: 3.6칸까지 후려침 — 머리 직격 50% (치명 · 2% 즉사) · 크게 날림 (6초).
     v7.19.0: ''')
rep('h1::after{content:" v7.19.0"', 'h1::after{content:" v7.19.1"')
rep('<footer>굴의 전투판 v7.19.0', '<footer>굴의 전투판 v7.19.1')
rep('return `굴의 전투판 v7.19.0 · ${title}', 'return `굴의 전투판 v7.19.1 · ${title}')
rep("copyText('굴의 전투판 v7.19.0 자동 판 기록", "copyText('굴의 전투판 v7.19.1 자동 판 기록")
rep('의 버전 기록에 — v7.19.0 새 인물 아홉 (2단계)', '의 버전 기록에 — v7.19.1 고유 기술 다섯 (공중제비 · 머리 찍기 · 영거리 사격 · 철퇴 기술) / v7.19.0 새 인물 아홉 (2단계)')
rep('">v7.19.0 · 새 인물 아홉</span>', '">v7.19.1 · 고유 기술 다섯</span>')
rep("RULES_MIG = '7.19.0'", "RULES_MIG = '7.19.1'")

# ---------- 아이콘 표 다시 (뒤에 다섯) ----------
s, nn = re.subn(r"const ICO = \{.*?\}, ICO_GC = ", lambda m: "const ICO = " + json.dumps({'cols': IX['cols'], 'rows': IX['rows'], 'map': IX['map']}, ensure_ascii=False) + ", ICO_GC = ", s, count=1, flags=re.S)
assert nn == 1

# ---------- 설계 · 정체성 · 액티브 ----------
rep("gear: { 몸: { name: '용사의 갑옷', mat: '판금', tier: 2 } }, race: '인간 (용사)'", "gear: { 몸: { name: '용사의 갑옷', mat: '판금', tier: 2 } }, active: ['공중제비'], race: '인간 (용사)'")
rep("traits: ['회피A', '급소A', '후각B', '은신B', '일반인'], race: '인간', origin: '인간계 (회사원)", "traits: ['회피A', '급소A', '후각B', '은신B', '일반인'], active: ['머리 찍기'], race: '인간', origin: '인간계 (회사원)")
rep("traits: ['사격A', '회피B', '은신C'], race: '인간', origin: '인간계와 비슷한", "traits: ['사격A', '회피B', '은신C'], active: ['영거리 사격'], shells: 100, race: '인간', origin: '인간계와 비슷한")
rep("샷건 영거리 사격 (특수탄 100) 은 v7.19.1' },", "샷건 영거리 사격 (특수탄 100) — 붙은 상대를 날려 보냄' },")
rep("gear: { 몸: { name: '경갑', mat: '경갑', tier: 1 } }, race: '인간 (초인계)'", "gear: { 몸: { name: '경갑', mat: '경갑', tier: 1 } }, active: ['철퇴 후리기', '휘둘러 치기'], race: '인간 (초인계)'")
rep("'unique', 'am', 'smellG', 'bladeHands', 'noRanged', 'active', 'weight', 'modBody', 'cry', 'mute', 'rank', 'sq', 'sizeCls', 'regenK', 'leapN'];", "'unique', 'am', 'smellG', 'bladeHands', 'noRanged', 'active', 'weight', 'modBody', 'cry', 'mute', 'rank', 'sq', 'sizeCls', 'regenK', 'leapN', 'shells'];")
rep("'sq', 'cls', 'sizeCls', 'regenK', 'leapN', 'race', 'origin']) if (pf[k] === undefined && d[k] !== undefined) pf[k] = clone(d[k]);", "'sq', 'cls', 'sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells']) if (pf[k] === undefined && d[k] !== undefined) pf[k] = clone(d[k]);")
rep("  for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]);", "  for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]);")
rep("'C-221': { traits: ['영웅'] }, 'C-218': { skill: true }, 'C-018': { skill: true, traits: ['일반인'] }, 'C-262': { traits: ['일반인'] },", "'C-221': { traits: ['영웅'], active: ['공중제비'] }, 'C-218': { skill: true }, 'C-018': { skill: true, traits: ['일반인'] }, 'C-262': { traits: ['일반인'], active: ['머리 찍기'] }, 'C-195': { active: ['영거리 사격'] }, 'C-005': { active: ['철퇴 후리기', '휘둘러 치기'] },")
rep("};   // 야시 · 방패는 따로 켜고 끄는 칸", """  '공중제비': '탕아의 고유 — 이동기가 곧 공격기. 적을 누르면 3.2칸까지 뛰어올라 그 몸 바로 앞에 내려찍음: 뛴 방향으로 세로 1.5칸 · 폭 0.9 안의 적 모두 (피해 ×2.3 · 치명 +25% · 막을 수는 있음 · 맞으면 넘어짐). 바닥을 누르면 그쪽으로 2.6칸 빠짐. 7초마다 (빠지기는 3초). 스스로: 닿을 거리의 막지 않은 상대에게 내려찍고, 다치면 뒤로 빠짐',
  '머리 찍기': '쟝의 필살기 — 판에 한 번. 노린 상대에게 들어가는 다음 일격이 머리에 확정 치명 (장도리). 중대형까지는 2% 로 즉사. 스스로: 맞붙은 강한 상대 (체력 150 넘음) 에게',
  '영거리 사격': '간두의 샷건 — 특수탄 (100발) 으로 2.4칸 안의 상대를 쏨: 피해 ×2.6 · 크게 날려 보냄 · 총성. 2.8초마다. 스스로: 근접이 2칸 안으로 붙으면',
  '철퇴 후리기': '모닝스타 — 뒤로 먼저 돌려 관성을 실어 둘레 1.9칸을 한 바퀴 (뒤부터): 닿는 모두 (동료도!) 피해 ×1.5 · 쓸려 나감. 관통 없음 — 중대형 이상이 막으면 50% 로 회전이 멈춤. 8초마다. 스스로: 둘레에 적 둘 넘고 동료가 없을 때 (셋 넘으면 동료 하나까지)',
  '휘둘러 치기': '모닝스타 — 머리 위로 빙빙 돌리다 휙, 3.6칸까지 후려침: 피해 ×2 · 크게 날림 · 머리 직격 50% (치명 70% · 중대형까지 2% 즉사). 6초마다. 스스로: 철퇴가 안 닿는 1.6 ~ 3.6칸의 상대 (사이에 동료가 없을 때)',
};   // 야시 · 방패는 따로 켜고 끄는 칸""")

# ---------- 기술 칸 6 · 7 (특수 1 · 2) ----------
rep("  { k: 'palm', name: '팜 버스트', has: u => !!u.palm && !u.noArms },   // v6.7 청광묵", "  { k: 'palm', name: '팜 버스트', has: u => !!u.palm && !u.noArms },   // v6.7 청광묵\n  { k: 'spec1', name: '특수 1', has: u => (u.spec || []).length >= 1 && !u.crawl },   // v7.19.1 고유 기술 (탕아 · 쟝 · 간두 · 모닝스타)\n  { k: 'spec2', name: '특수 2', has: u => (u.spec || []).length >= 2 && !u.crawl },")
rep("function slotLabel(Wd, L, n){", """// v7.19.1 특수 칸: 그 인물의 첫째 · 둘째 고유 기술
const specAt = (u, k) => (u.spec || [])[k === 'spec2' ? 1 : 0];
const SPEC_IC = { flip: '🤸', head: '🔨', pb: '💥', sweep: '🌀', hurl: '☄' };
const SPEC_TGT = { flip: '🤸 공중제비: 적을 탭 (뛰어올라 내려찍음) · 바닥을 탭 (그쪽으로 빠짐)', head: '🔨 머리 찍기: 노릴 적을 탭 (판에 한 번 — 머리 확정 치명)', pb: '💥 영거리 사격: 샷건을 쏠 적을 탭 (2.4칸 · 특수탄)', hurl: '☄ 휘둘러 치기: 후려칠 적을 탭 (3.6칸까지)' };
const specCd = (Wd, C, k) => Math.max(0, ...C.map(u => { const x = specAt(u, k); return x ? x.cdT - Wd.t : 0; }));
function slotLabel(Wd, L, n){""")
rep("  const kcd = Math.max(0, ...C.map(u => u.skill.kit ? u.skill.cdT - Wd.t : 0)), ko = C.find(u => u.order && u.order.k === 'skill');",
    "  if (S2.k === 'spec1' || S2.k === 'spec2'){ const sp = specAt(C[0], S2.k), cd = specCd(Wd, C, S2.k); return armed && armed.k === 'spec' && armed.slot === S2.k ? SPEC_TGT[sp.k] : sp.name + (sp.n === 0 ? ' (다 씀)' : '') + (cd > 0 ? ' (' + f2(cd) + '초)' : ''); }   // v7.19.1\n  const kcd = Math.max(0, ...C.map(u => u.skill.kit ? u.skill.cdT - Wd.t : 0)), ko = C.find(u => u.order && u.order.k === 'skill');")
rep("const spOf = (C, k) => k === 'leap' || k === 'palm' || k === 'skill' ||", "const spOf = (C, k) => k === 'leap' || k === 'palm' || k === 'skill' || k === 'spec1' || k === 'spec2' ||")
rep("  else { const K = C[0].skill; st.nm = K.name;", "  else if (S2.k === 'spec1' || S2.k === 'spec2'){ const sp = specAt(C[0], S2.k), so = C.find(u => u.order && u.order.k === 'spec' && u.order.s === sp.k); st.nm = sp.name; st.ix = sp.name; st.ic = SPEC_IC[sp.k] || '★'; st.cd = specCd(Wd, C, S2.k); st.cdMax = ((Wd.rules.spec || {})[sp.k] || {}).cd || 5; st.on = !!(armed && armed.k === 'spec' && armed.slot === S2.k); st.ord = so && so.order.b != null && Wd.units[so.order.b] ? Wd.units[so.order.b].name : null; st.sb = st.on ? '대상을 누름' : sp.n === 0 ? '다 씀' : sp.k === 'pb' ? '특수탄 ' + C.map(u => u.shells || 0).join('·') : sp.k === 'head' ? '한 번' : ''; if (sp.n === 0) st.cd = 1, st.cdMax = 1; }   // v7.19.1 고유 기술\n  else { const K = C[0].skill; st.nm = K.name;")
rep(".sp-leap{--sc:#4fc3f7}", ".sp-spec1,.sp-spec2{--sc:#ffcf6e}.sp-leap{--sc:#4fc3f7}")
rep("  ordKey('skill');\n}\n// v6.7.4 도약", """  if (S2.k === 'spec1' || S2.k === 'spec2'){ const sp = specAt(C[0], S2.k), D = C.filter(u => { const x = specAt(u, S2.k); return x && x.k === sp.k; });   // v7.19.1 고유 기술
    if (sp.n === 0){ toast(`${sp.name} — 이 판에서 이미 썼어요`); return; }
    if (sp.k === 'sweep'){ D.forEach(u => { u.order = { k: 'spec', s: 'sweep' }; }); noteOrders(D); toast(`${D.map(u => u.name).join(' · ')}: 철퇴 후리기 — 둘레를 한 바퀴 (동료도 맞을 수 있어요)`); hud(); return; }
    armed = armed && armed.k === 'spec' && armed.slot === S2.k ? null : { k: 'spec', slot: S2.k, s: sp.k, cas: D.map(u => u.i) }; chargePick = throwPick = skillPick = palmPick = leapPick = null;
    if (armed) toast(armedTxt() + (specCd(world, D, S2.k) > 0 ? ` — ${f2(specCd(world, D, S2.k))}초 뒤에 씀 (다가가며 기다림)` : '')); hud(); return; }
  ordKey('skill');
}
// v6.7.4 도약""")
rep("flare: '🔥 횃불 던지기: 밝힐 곳 (바닥, 7칸까지) 을 탭',", "flare: '🔥 횃불 던지기: 밝힐 곳 (바닥, 7칸까지) 을 탭', spec: armed && armed.s ? SPEC_TGT[armed.s] || '고유 기술: 대상을 탭' : '',")
rep("  if (k === 'palm'){ if (u && u.side === 1){ givePalm(u, detourArm); return done(); } toast('팜 버스트: 적을 탭 · 아래로 쓸면 취소'); return; }   // v6.7", """  if (k === 'palm'){ if (u && u.side === 1){ givePalm(u, detourArm); return done(); } toast('팜 버스트: 적을 탭 · 아래로 쓸면 취소'); return; }   // v6.7
  if (k === 'spec'){ const A0 = armed, C = (A0.cas || []).map(i => Wd.units[i]).filter(x => x && x.alive), nm = (specOf(C[0] || {}, A0.s) || {}).name || '고유 기술';   // v7.19.1
    if (u && u.side === 1){ if (!u.seenBy){ toast('안 보이는 적에게는 못 써요'); return; } C.forEach(x => { x.order = { k: 'spec', s: A0.s, b: u.i }; }); if (detourArm) applyDetour(C, u.x, u.y); noteOrders(C); toast(`${C.map(x => x.name).join(' · ')} → ${u.name}: ${nm}`); return done(); }
    if (!u && A0.s === 'flip'){ if (rock(Wd.map, w.x, w.y)){ toast('바위로는 뛸 수 없어요'); return; } C.forEach(x => { x.order = { k: 'spec', s: 'flip', x: w.x, y: w.y }; }); noteOrders(C); toast(`${C.map(x => x.name).join(' · ')}: 공중제비로 ${coord(w.x, w.y)} 쪽으로 빠짐`); return done(); }
    toast(SPEC_TGT[A0.s] + ' · 아래로 쓸면 취소'); return; }""")
rep("armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp' || armed.k === 'area' || armed.k === 'flare' || armed.k === 'flank')", "armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp' || armed.k === 'area' || armed.k === 'flare' || armed.k === 'flank' || armed.k === 'spec')", 2)
rep("  const pm = slotState(Wd, C, 5); if (!pm.off) out.push({ k: 'palm', ic: '💥', ix: '팜 버스트', nm: '팜 버스트', cd: pm.cd });   // v6.7", "  const pm = slotState(Wd, C, 5); if (!pm.off) out.push({ k: 'palm', ic: '💥', ix: '팜 버스트', nm: '팜 버스트', cd: pm.cd });   // v6.7\n  for (const [n, kk] of [[6, 'spec1'], [7, 'spec2']]){ const st = slotState(Wd, C, n); if (!st.off) out.push({ k: kk, ic: st.ic, ix: st.ix, nm: st.nm, cd: st.cd }); }   // v7.19.1 고유 기술")
rep("  if (k === 'leap'){ useSlot(3); hud(); return; }", "  if (k === 'leap'){ useSlot(3); hud(); return; }\n  if (k === 'spec1' || k === 'spec2'){ useSlot(k === 'spec1' ? 6 : 7); hud(); return; }   // v7.19.1")
rep("if (/^[1-5]$/.test(e.code ? e.code.replace('Digit', '') : k)", "if (/^[1-7]$/.test(e.code ? e.code.replace('Digit', '') : k)")

# ---------- 로그 · 서술 ----------
rep("      case 'palmDash':", """      case 'flip': out.push(`${T(e)}🤸 ${n(e.a)} 공중제비 ${e.slam ? '→ ' + n(e.b) + '에게 뛰어올라 내려찍기' : '— 뒤로 빠짐'} (${e.len}칸)`); break;   // v7.19.1
      case 'slam': out.push(`${T(e)}🤸 ${n(e.a)} 내려찍기 — ${e.n ? e.n + '명이 세로로 맞음' : '아무도 없음'}`); break;
      case 'specArm': out.push(`${T(e)}🔨 ${n(e.a)} → ${n(e.b)}의 머리를 노림 (머리 찍기 — 판에 한 번)`); break;
      case 'pb': out.push(`${T(e)}💥 ${n(e.a)} → ${n(e.b)} 샷건 영거리 사격 (남은 특수탄 ${e.left})`); break;
      case 'flailSweep': out.push(`${T(e)}🌀 ${n(e.a)} 철퇴 후리기 — ${e.n}명${e.stop != null ? ' · ' + n(e.stop) + '이(가) 막아 회전이 멈춤' : ''}`); break;
      case 'hurl': out.push(`${T(e)}☄ ${n(e.a)} → ${n(e.b)} 철퇴를 휘둘러 후려침`); break;
      case 'palmDash':""")
rep("    case 'prone': if (/짓뭉개짐/.test(e.why)) return null;", """    case 'slam': return e.n ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 공중제비로 솟구쳐 내려찍는다 — 대검이 세로로 떨어진다!` } : null;   // v7.19.1
    case 'flailSweep': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 철퇴를 뒤로 돌려 한 바퀴 휘두른다${e.stop != null ? ' — ' + n(e.stop) + '이(가) 받아 내 멈춘다' : '!'}` };
    case 'pb': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 코앞의 ${reul(n(e.b))} 샷건으로 날려 버린다!` };
    case 'hurl': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 머리 위로 돌리던 철퇴를 휙 — ${n(e.b)}에게 꽂는다!` };
    case 'prone': if (/짓뭉개짐/.test(e.why)) return null;""")

rep("      case 'wind': if (e.palm){", "      case 'wind': if (e.spec){ out.push(`${T(e)}${n(e.a)}${e.b != null ? ' → ' + n(e.b) : ''} [${e.w}] 준비 (${f2(e.end)}초)${e.why && e.why !== e.w ? ' · ' + e.why : ''}`); break; }   /* v7.19.1 고유 기술 (대상 없는 것도) */\n        if (e.palm){")
rep("    case 'wind': { const a = U(e.a), b = U(e.b), far = isFar(a);", "    case 'wind': { if (e.spec) return null; const a = U(e.a), b = U(e.b), far = isFar(a);   /* v7.19.1 고유 기술은 결과 서술로 */")
# ---------- 상세: 고유 기술 대기 · 특수탄 ----------
rep("    ${(u.active || []).length ? `<span class=\"tr\"><span class=\"lb\">액티브</span>", "    ${(u.spec || []).map(x => `<span class=\"tr\">${ico(x.name, '', x.name)}<i>[${esc(x.name)}]</i> ${x.n === 0 ? '이 판에서 씀' : !ed && Wd.t < x.cdT ? '대기 ' + f2(x.cdT - Wd.t) + '초' : '준비됨'}${x.k === 'pb' ? ' · 특수탄 ' + (u.shells || 0) : ''}</span>`).join('')}\n    ${(u.active || []).length ? `<span class=\"tr\"><span class=\"lb\">액티브</span>")

# ---------- 옛 저장 한 번: 고유 기술 붙이기 ----------
rep("// v7.19 2단계 인물 (한 번):", """// v7.19.1 고유 기술 (한 번): 탕아 · 쟝 · 간두 · 모닝스타에 액티브 (간두는 특수탄 100)
const SPEC719 = { 'C-221': ['공중제비'], 'C-262': ['머리 찍기'], 'C-195': ['영거리 사격'], 'C-005': ['철퇴 후리기', '휘둘러 치기'] };
const fix7191 = p => { if (!p || (p.side || 0) !== 0 || !SPEC719[p.ref]) return false; const miss = SPEC719[p.ref].filter(a => !(p.active || []).includes(a)); if (!miss.length) return false; p.active = [...(p.active || []), ...miss]; if (p.ref === 'C-195' && p.shells == null) p.shells = 100; return true; };
if (!S.v7191k){ let n = 0; for (const u of S.units) if (fix7191(u)) n++; try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fix7191(d)){ dc = true; n++; } if (dc) saveMyDesigns(mine); } catch (e) {}
  S.v7191k = true; if (n) setTimeout(() => { save(); toast(`고유 기술을 붙였어요 (${n}곳 — 공중제비 · 머리 찍기 · 영거리 사격 · 철퇴 기술)`); }, 1900); }
// v7.19 2단계 인물 (한 번):""")

open(F, 'w', encoding='utf-8').write(s)
print('page7191 OK')
