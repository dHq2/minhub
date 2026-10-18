import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
# header
rep("<!-- 굴의 전투판 v5.7 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.7.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.7.1: 방패를 든 채 침 (방패 뒤에서 찌르기 ×0.85 · 치는 동안 막는 폭이 좁아짐). 막기 유지는 틈이 보일 때만 치고, 공격 위주는 방패를 내려 온 힘으로.
             무구로 막기 — 방패가 없으면 쥔 칼 · 창 · 둔기로 받아 냄 (근접만, 좁게, ×0.5). 화살 · 총알 · 투창 · 돌진하는 몸 · 거구의 휘두르기는 못 받아 냄.
             상대의 일격이 내 일격보다 먼저 떨어지면 치기를 거두고 받아 낸 뒤 되받아침. 맨손일 때만 맨몸 막기 (팔 위험).
             두 손으로 쥠 — 방패가 없으면 장검 · 대검 · 창을 두 손으로 (공격 ×1.15). 그래서 방패를 안 드는 것도 선택.
             [재생] (레베카 — ◆축복:불사 의 정체): 모든 신체가 재생 = 초당 최대 체력의 4% (쓰러진 채로도). 부위 · 출혈 · 상처가 남지 않음.
             사수: 적을 한 번 누르면 먼저 사선을 열 자리로 비켜서서 쏘고, 연달아 누르면 그 자리에서 바로 쏨 (오사 감수). 근접에게 연달아 누르면 서둘러 뜀.
             전열이 더 잘 보이게 (굵은 선 · 어두운 테두리 · 마디 수 표시).
""",'notes')
rep('<span class="ver">v5.7 · 전열','<span class="ver">v5.7.1 · 무구로 막기 · 방패 뒤에서 치기 · 재생 · 전열','ver')
rep("<footer>굴의 전투판 v5.7","<footer>굴의 전투판 v5.7.1",'footer')
rep("return `굴의 전투판 v5.7 · ${title}","return `굴의 전투판 v5.7.1 · ${title}",'export')
# Rebecca design: add 재생
rep("weapon: '장검', height: 1.6, nv: true, nvG: 'A', traits: ['불사'],","weapon: '장검', height: 1.6, nv: true, nvG: 'A', traits: ['불사', '재생'],",'reb')
# migration
rep("const fixNorman = p =>","""// v5.7.1 레베카 = [재생] (◆축복:불사 의 정체) — 옛 저장 · 내 설계에도
const fixRegen = p => { if (p.ref !== 'C-002' || !(p.traits || []).includes('불사') || (p.traits || []).includes('재생')) return false; p.traits = [...p.traits, '재생']; return true; };
const fixNorman = p =>""",'fixRegen')
rep("if (!S.v552){","if (!S.v571){ for (const u of S.units) fixRegen(u); try { const mine = myDesigns(); if (mine.some(fixRegen)) saveMyDesigns(mine); } catch (e) {} S.v571 = true; }\nif (!S.v552){",'mig')
# traits text
rep("  '불사': '죽지 않음 — 쓰러져도 계속 재생해 피가 움직일 만큼 차면 그 적은 피로 일어남",
    "  '재생': '모든 신체가 재생 — 초당 최대 체력의 4% 를 되찾음 (쓰러진 채로도). 눈 · 팔 · 다리를 잃지 않고 피를 흘리지 않으며 상처가 남지 않음. ◆축복:불사 의 정체',\n  '불사': '죽지 않음 — 쓰러져도 계속 재생해 피가 움직일 만큼 차면 그 적은 피로 일어남",'trait')
# guardName
rep("const guardName = u => u.shield ? '방패' : (Wd_rules_guard(u) ? u.weapon : '반사신경');",
    "const guardName = u => u.shield ? '방패' : (u.parry || Wd_rules_guard(u)) && u.weapon && !ITEM_NATURAL.includes(u.weapon) ? u.weapon : '반사신경';   // v5.7.1 무구로 막기",'gn')
rep("        if (e.block) tags.push(`${guardName(b)}로 막음 ×${R.blockMul}${e.broke ? ' · 자세 무너짐!' : ''}`",
    "        if (e.block) tags.push(`${guardName(b)}${e.parry ? '로 받아 냄 ×' + ((R.parry || {}).mul || 0.5) : '로 막음 ×' + R.blockMul}${e.broke ? ' · 자세 무너짐!' : ''}`",'lltag')
rep("s: `${ga(b.name)} ${ro(guardName(b))} ${a.name}의 ${far ? '탄환' : '공격'}을 막아낸다 (−${e.dmg}).",
    "s: `${ga(b.name)} ${ro(guardName(b))} ${a.name}의 ${far ? '탄환' : '공격'}을 ${e.parry ? '받아 낸다' : '막아낸다'} (−${e.dmg}).",'narrblk')
# parryReady narration (log only)
rep("      case 'lineBreak': out.push(","      case 'parryReady': out.push(`${T(e)}🗡 ${n(e.a)} 치기를 거두고 ${n(e.b)}의 일격을 받아 낼 자세`); break;   // v5.7.1\n      case 'lineBreak': out.push(",'pr1')
rep("    case 'lineBreak': return e.side === 0 ?","    case 'parryReady': return null;\n    case 'lineBreak': return e.side === 0 ?",'pr2')
# guard texts
rep("const GM_TXT = { auto: '자동 (위협이 보이면 듦)', hold: '유지 (늘 듦 — 못 치고 방패 밀치기만)', off: '공격 위주 (안 듦)' }",
    "const GM_TXT = { auto: '자동 (위협이 보이면 듦 · 방패는 든 채 침)', hold: '유지 (늘 듦 — 틈이 보일 때만 침 · 상대가 휘두르면 먼저 받아 냄)', off: '공격 위주 (안 듦 — 온 힘으로 · 갑옷만)' }",'gm')
rep("    if (!C.length){ toast('막을 방패 · 대검이 없어요 — 맨몸으로 창칼을 막지 않고 움직여서 피해요 (막는 역할은 방패병)'); return; }",
    "    if (!C.length){ toast('막을 방패 · 무기가 없어요 (사수 · 맨손) — 움직여서 피해요'); return; }",'gtoast')
rep("""title="자동: 위협이 보이면 듦 · 유지: 늘 듦 (못 치고 걸음이 느림, 방패 밀치기만) · 공격 위주: 안 듦 (갑옷만)">""",
    """title="자동: 위협이 보이면 듦 (방패는 든 채 침) · 유지: 늘 듦, 틈이 보일 때만 침 · 공격 위주: 안 듦 (온 힘으로 · 갑옷만)">""",'gbtn')
# detail rows
rep("    ${!u.canGuard && !isFar(u) && u.side === 0 && known ? `<span class=\"tr\"><span class=\"lb\">방어</span> 막을 방패 · 대검이 없음 — 맨몸으로 창칼을 막지 않고 움직여 피함 (막는 역할은 방패병 · 갑옷만 받아 냄)</span>` : ''}",
    "    ${!u.canGuard && !isFar(u) && u.side === 0 && known ? `<span class=\"tr\"><span class=\"lb\">방어</span> 막을 방패 · 무기가 없음 — 움직여 피함 (갑옷만 받아 냄)</span>` : ''}",'det1')
rep("${bareGuard(Wd, u) ? ' · 맨몸 — 무기를 막으면 팔이 받아 낼 수 있음 (자동은 무기를 막지 않음)' : ''} · 바라보는 방향 ±${u.gArc}°",
    "${u.parry && !u.shield && parryArc(Wd, u) ? ` · 무구로 막기 (${esc(u.weapon)}) — 근접만 · 받는 피해 ×${(Wd.rules.parry || {}).mul || 0.5} · 화살 · 돌진 · 거구의 휘두르기는 못 받음 · 치는 동안 못 막음` : ''}${u.shield ? ` · 방패 뒤에서 침 (×${(Wd.rules.guard || {}).strikeMul || 0.85} · 치는 동안 폭 ×${(Wd.rules.guard || {}).strikeArc || 0.6})` : ''}${twoHanded(Wd, u) ? ` · 두 손으로 쥠 (공격 ×${Wd.rules.twoHand || 1.15})` : ''}${bareGuard(Wd, u) ? ' · 맨손 — 무기를 막으면 팔이 받아 낼 수 있음 (자동은 무기를 막지 않음)' : ''} · 바라보는 방향 ±${Math.round(guardArc(Wd, u))}°",'det2')
# rules rows
rep("    ['ward.medic', '지킬 사람: 남은 약 ×'],",
    "    ['parry.blade', '무구로 막기: 검 폭 (°)'], ['parry.long', '무구로 막기: 장검 폭 (°)'], ['parry.spear', '무구로 막기: 창 폭 (°)'], ['parry.blunt', '무구로 막기: 둔기 폭 (°)'], ['parry.dagger', '무구로 막기: 단검 폭 (°)'], ['parry.mul', '무구로 막기: 받는 피해 ×'], ['parry.post', '무구로 막기: 자세 깎임 ×'],\n    ['guard.strikeMul', '방패 뒤에서 치기: 공격 ×'], ['guard.strikeArc', '방패 뒤에서 치는 동안 막는 폭 ×'], ['twoHand', '두 손으로 쥔 장검 · 대검 · 창: 공격 ×'], ['regen.hp', '[재생]: 초당 최대 체력의 몫'],\n    ['ward.medic', '지킬 사람: 남은 약 ×'],",'rules')
# rapid attack click
rep("""  L.forEach(u => { u.order = { k: 'attack', b: t.i }; u.last = { x: t.x, y: t.y }; }); noteOrders(L); hud();
}""","""  // v5.7.1 같은 적을 0.7초 안에 다시 누르면 급함: 사수는 그 자리에서 바로 쏨 (오사 감수), 근접은 서둘러 뜀. 한 번이면 사수는 사선을 열 자리부터 잡음
  const now0 = performance.now(), key = L.map(u => u.i).join(',') + '>' + t.i, rush = !!(lastAC && now0 - lastAC.t < 700 && lastAC.key === key); lastAC = { t: now0, key };
  L.forEach(u => { u.order = { k: 'attack', b: t.i, ...(rush ? { now: true, ...(isFar(u) ? {} : { hurry: true }) } : {}) }; u.last = { x: t.x, y: t.y }; }); noteOrders(L); hud();
  if (rush) toast(`${L.map(u => u.name).join(' · ')}: ${L.some(u => isFar(u)) ? '바로 쏴! — 사선에 동료가 있어도 (오사 감수)' : ''}${L.some(u => isFar(u)) && L.some(u => !isFar(u)) ? ' · ' : ''}${L.some(u => !isFar(u)) ? '서둘러 들이침 (방패를 내리고 뜀)' : ''}`);
}
let lastAC = null;""",'ga')
rep("const ACK = o => { const t = o && o.b != null && world ? world.units[o.b] : null, tn = t ? t.name : '';\n  return !o ? ['자동', '#d8cfc0'] : o.k === 'attack' ? ['⚔ ' + tn, '#ffb27a']",
    "const ACK = o => { const t = o && o.b != null && world ? world.units[o.b] : null, tn = t ? t.name : '';\n  return !o ? ['자동', '#d8cfc0'] : o.k === 'attack' && o.now ? ['⚔⚔ ' + tn + '!', '#ffcf6e'] : o.k === 'attack' ? ['⚔ ' + tn, '#ffb27a']",'ack')
# line visibility: outline + thicker + count label
rep("    ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2 + Math.min(3, M.length * 0.6);\n    ctx.beginPath(); ctx.moveTo(P[0].x, P[0].y);\n    for (let k = 1; k < P.length - 1; k++) ctx.quadraticCurveTo(P[k].x, P[k].y, (P[k].x + P[k + 1].x) / 2, (P[k].y + P[k + 1].y) / 2);\n    ctx.lineTo(P[P.length - 1].x, P[P.length - 1].y); ctx.stroke();",
"""    const curve = () => { ctx.beginPath(); ctx.moveTo(P[0].x, P[0].y); for (let k = 1; k < P.length - 1; k++) ctx.quadraticCurveTo(P[k].x, P[k].y, (P[k].x + P[k + 1].x) / 2, (P[k].y + P[k + 1].y) / 2); ctx.lineTo(P[P.length - 1].x, P[P.length - 1].y); ctx.stroke(); };
    const lw = 4 + Math.min(4, M.length);   // v5.7.1 더 잘 보이게: 어두운 테두리 + 밝은 선
    ctx.strokeStyle = 'rgba(8,6,12,.85)'; ctx.lineWidth = lw + 4; curve();
    ctx.strokeStyle = ln.side ? 'rgba(255,150,110,1)' : 'rgba(150,215,255,1)'; ctx.lineWidth = lw; curve();
    { const mx = P.reduce((a, p) => a + p.x, 0) / P.length + fx * band * 0.55, my = P.reduce((a, p) => a + p.y, 0) / P.length + fy * band * 0.55, tx = `전열 ${M.length}`;
      ctx.font = '700 11px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(tx).width;
      ctx.fillStyle = 'rgba(8,6,12,.8)'; ctx.fillRect(mx - tw / 2 - 4, my - 8, tw + 8, 16); ctx.fillStyle = ln.side ? '#ffb49a' : '#bfe4ff'; ctx.fillText(tx, mx, my + 0.5); }""",'linevis')
rep("    for (const p of P){ ctx.fillStyle = `rgba(${col},.95)`; if (p.sh) ctx.fillRect(p.x - 3.5, p.y - 3.5, 7, 7); else { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.283); ctx.fill(); } }",
    "    for (const p of P){ ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(8,6,12,.9)'; ctx.lineWidth = 2; if (p.sh){ ctx.strokeRect(p.x - 5, p.y - 5, 10, 10); ctx.fillRect(p.x - 5, p.y - 5, 10, 10); } else { ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, 6.283); ctx.stroke(); ctx.fill(); } }",'joints')
open(P,'w').write(s); print('ok')
