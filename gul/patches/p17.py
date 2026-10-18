s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
rep("""<!-- 굴의 전투판 v4.6 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
""","""<!-- 굴의 전투판 v4.7 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v4.7: [공통스킬:투창] — 굴 3D (cave-3d) 의 투창을 옮김: 조준 0.7초 → 던짐 (꺾이지 않는 투사체, 18칸/초 · 6칸), 명중 97%→75% · 피해 ×2.2 · 치명 35% (×1.8).
           한 번뿐: 던지면 맨손. 몸에 박히면 그 자리, 방어에 막히면 앞으로 튕김, 바위에 튕기거나 빗나가면 떨어진 자리에 창이 남음 (금빛 고리) → 주워야 다시 던짐.
           AI: 보이는 상대 중 사선이 열린 (아군 · 이쪽을 막는 방패 없음) 가장 좋은 상대에게, 확률이 기준 이상이면 던짐. 안 되면 방패 옆으로 비켜 사선을 찾음. 던진 뒤엔 창 둘레가 안전할 때 주우러 감.
           아군: 공격 명령으로는 던지지 않음 — 고르고 R (또는 '투창' 단추) → 적을 누름. 창 줍기는 E. 자동이면 AI 처럼 던지고 주움.
           적 탱커: 방패병 (검방패병 등) 이 무리 앞 전선 · 노출된 동료 막아서기 ('뒤로!'), 적 전선은 밀고 나가지 않고 버팀. 적 창병 · 보통 근접은 싸울 거리가 아니면 방패 뒤 → 대치.
           창병 (창병 · 창병2 · 흑기사창병) 에 [공통스킬:투창]. '방패 대치 예제' 배치 (검방패병 · 창병 둘 · 저격총수 · 똥개 ↔ 포렌 · 옐로 · 인주).
""")
for a,b in [("""<span class="ver">v4.6 · 한 턴씩""","""<span class="ver">v4.7 · 한 턴씩"""),("""  <footer>굴의 전투판 v4.6 — ""","""  <footer>굴의 전투판 v4.7 — """),("""copyText('굴의 전투판 v4.6 자동 판 기록""","""copyText('굴의 전투판 v4.7 자동 판 기록"""),("""  return `굴의 전투판 v4.6 · ${title}""","""  return `굴의 전투판 v4.7 · ${title}""")]: rep(a,b)
# traits + profiles
rep("""  '제약:총포류': '총 · 저격총 · 샷건을 못 다룸',""","""  '공통스킬:투창': '창을 던짐 (조준 0.7초 · 6칸 · 명중 97%→75% · 피해 ×2.2 · 치명 35% ×1.8). 한 번 던지면 맨손 — 박히거나 막히거나 튕긴 창을 주워야 다시 던짐',
  '제약:총포류': '총 · 저격총 · 샷건을 못 다룸',""")
rep("""  'C-006': { traits: ['높은후각', '반사신경'],""","""  'C-053': { traits: ['공통스킬:투창'], tactic: '투창', note: '방패 뒤에서 기다리다 사선이 열리고 확실할 때 창을 던짐. 막히면 옆으로 비켜 사선을 찾음. 던진 뒤엔 맨손 — 안전할 때 주우러 감' },
  'C-162': { traits: ['공통스킬:투창'], tactic: '투창', note: '방패 뒤에서 기다리다 사선이 열리고 확실할 때 창을 던짐. 던진 뒤엔 맨손 — 안전할 때 주우러 감' },
  'C-164': { traits: ['공통스킬:투창'], tactic: '투창', note: '방패 뒤에서 기다리다 사선이 열리고 확실할 때 창을 던짐. 던진 뒤엔 맨손 — 안전할 때 주우러 감' },
  'C-054': { tactic: '방패벽 (적 탱커)', note: '싸울 상대가 붙지 않으면 무리 앞에 방패를 세우고 (뒤로!), 노출된 동료 앞을 막아섬. 밀고 나가지 않고 버팀' },
  'C-149': { tactic: '방패벽 (적 탱커)', note: '싸울 상대가 붙지 않으면 무리 앞에 방패를 세우고, 노출된 동료 앞을 막아섬' },
  'C-150': { tactic: '방패벽 (적 탱커)', note: '싸울 상대가 붙지 않으면 무리 앞에 방패를 세우고, 노출된 동료 앞을 막아섬' },
  'C-154': { tactic: '방패벽 (적 탱커)', note: '싸울 상대가 붙지 않으면 무리 앞에 방패를 세우고, 노출된 동료 앞을 막아섬' },
  'C-148': { tactic: '방패벽 (적 탱커)', note: '싸울 상대가 붙지 않으면 무리 앞에 방패를 세우고, 노출된 동료 앞을 막아섬' },
  'C-006': { traits: ['높은후각', '반사신경'],""")
# migration v47
rep("""// v4.4: 옐로 = 기동 · 원거리 무기면 검으로""","""// v4.7: 창병에 [공통스킬:투창] · 방패병 전술 설명
if (!S.v47){ for (const u of S.units){ const pf = PROFILE[u.ref]; if (pf && ['C-053', 'C-162', 'C-164', 'C-054', 'C-149', 'C-150', 'C-154', 'C-148'].includes(u.ref)){ if (pf.traits) u.traits = [...new Set([...(u.traits || []), ...pf.traits])]; u.tactic = pf.tactic; u.note = pf.note; } } S.v47 = true; }
// v4.4: 옐로 = 기동 · 원거리 무기면 검으로""")
s=s.replace("""v42: true, v43: true, v44: true, v46: true,""","""v42: true, v43: true, v44: true, v46: true, v47: true,""")
# example: shield standoff preset
rep("""// 아군은 시작 자리 둘레로, 적은 무리째 멀리. torches = 벽 횃불도 다시""","""// 방패 대치 예제: 검방패병 h8 · 창병 g9 · i9 (투창) · 저격총수 h10 · 똥개 l8 ↔ 포렌 g3 (대검) · 옐로 i3 · 인주 h2 (총)
function exampleShield(){
  const S = exampleLine(); S.units = [];
  const put = (ref, side, c, ex) => S.units.push({ ...unitFromRef(ref, side, ex), ...at(S, c) });
  put('C-001', 0, 'h2', { hero: true, nv: false }); put('C-006', 0, 'g3', { nv: false, weapon: '대검' }); put('C-008', 0, 'i3', { nv: false });
  put('C-054', 1, 'h8'); put('C-053', 1, 'g9'); put('C-053', 1, 'i9'); put('C-159', 1, 'h10'); put('C-076', 1, 'l8');
  return S;
}
// 아군은 시작 자리 둘레로, 적은 무리째 멀리. torches = 벽 횃불도 다시""")
rep("""            <button class="btn" id="lineExBtn" type="button">사선 예제 놓기</button>""","""            <button class="btn" id="lineExBtn" type="button">사선 예제 놓기</button>
            <button class="btn" id="shieldExBtn" type="button">방패 대치 예제</button>""")
rep("""$('lineExBtn').addEventListener('click', () => {""","""$('shieldExBtn').addEventListener('click', () => {
  if (mode !== 'edit'){ toast('⟲ 배치로를 누른 뒤에 놓을 수 있어요'); return; }
  const L = exampleShield();
  Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: true, seed: L.seed, flips: [], units: L.units, torches: L.torches, draft: L.draft });
  selId = null; renderDraft(); rebuildMap(); setMapUI(); changed(); centerStart(); hud();
  toast('방패 대치 예제: 검방패병 h8 · 창병 g9 · i9 (투창) · 저격총수 h10 · 똥개 l8 ↔ 포렌 g3 · 옐로 i3 · 인주 h2');
});
$('lineExBtn').addEventListener('click', () => {""")
# draw spears on ground (after torches) + javelin tracer
rep("""  for (const t of Wd.torches) drawFlame(ox + t.x * ts, oy + t.y * ts, ts * 0.32, t.dropped);""","""  for (const t of Wd.torches) drawFlame(ox + t.x * ts, oy + t.y * ts, ts * 0.32, t.dropped);
  // 땅에 떨어진 창 (던진 뒤 주워야 함): 금빛 고리 + 비스듬한 창
  if (!ed) for (const it of Wd.items || []){ if (it.k !== 'spear') continue; const p = { x: ox + it.x * ts, y: oy + it.y * ts }, o = Wd.units[it.owner];
    ctx.strokeStyle = 'rgba(255,211,90,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, ts * 0.22, 0, 6.283); ctx.stroke();
    ctx.strokeStyle = '#d8c8a8'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p.x - ts * 0.3, p.y + ts * 0.2); ctx.lineTo(p.x + ts * 0.3, p.y - ts * 0.2); ctx.stroke();
    ctx.fillStyle = o && o.side ? '#ff8a70' : '#8ccaff'; ctx.beginPath(); ctx.moveTo(p.x + ts * 0.3, p.y - ts * 0.2); ctx.lineTo(p.x + ts * 0.2, p.y - ts * 0.24); ctx.lineTo(p.x + ts * 0.24, p.y - ts * 0.12); ctx.closePath(); ctx.fill();
    if (ts >= 30){ ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(255,225,150,.9)'; ctx.fillText(o ? o.name + '의 창' : '창', p.x, p.y + ts * 0.25); } }""")
rep("""    const tl = Math.min(0.9, Math.hypot(sh.x - sh.x0, sh.y - sh.y0)), hx = ox + sh.x * ts, hy = oy + sh.y * ts;
    ctx.strokeStyle = sh.side ? 'rgba(255,150,110,.9)' : 'rgba(160,215,255,.9)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';""","""    const tl = Math.min(sh.jav ? 0.7 : 0.9, Math.hypot(sh.x - sh.x0, sh.y - sh.y0)), hx = ox + sh.x * ts, hy = oy + sh.y * ts;
    ctx.strokeStyle = sh.jav ? '#e8d8b0' : sh.side ? 'rgba(255,150,110,.9)' : 'rgba(160,215,255,.9)'; ctx.lineWidth = sh.jav ? 3.5 : 2.5; ctx.lineCap = 'round';""")
# orders: throw pick mode (R) + pick spear (E)
rep("""let sel = new Set(), hudT = 0, boxSel = null, skillPick = null;""","""let sel = new Set(), hudT = 0, boxSel = null, skillPick = null, throwPick = null;
// 투창 대상 고르기: 고른 투창수 (throwPick) 에게 '그 적에게 던져' 명령
function giveThrow(t){
  if (!throwPick || !world) return false;
  if (!t.seenBy){ toast('안 보이는 적에게는 못 던져요'); return true; }
  const C = throwPick.map(i => world.units[i]).filter(u => u.alive && u.jav && u.spearHeld);
  for (const u of C) u.order = { k: 'throw', b: t.i };
  noteOrders(C); throwPick = null; toast(`${t.name}에게 창을 던지라고 했어요`); hud(); return true;
}""")
rep("""  if (u && u.side === 0 && skillPick){ giveSkill(u); return; }
  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }""","""  if (u && u.side === 0 && skillPick){ giveSkill(u); return; }
  if (u && u.side === 1 && throwPick){ giveThrow(u); return; }
  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }
  if (throwPick){ throwPick = null; toast('투창을 취소했어요'); hud(); return; }""")
rep("""  if (u && u.side === 1){ giveAttack(u); return; }
  if (u && u.side === 0){
    const C = L.filter(x => x.skill && x.skill.left > 0);""","""  if (u && u.side === 1){ if (throwPick){ giveThrow(u); return; } giveAttack(u); return; }
  if (u && u.side === 0){
    const C = L.filter(x => x.skill && x.skill.left > 0);""")
rep("""  else if (k === 'pick'){ const u = L.find(x => !x.torch), tc = u && nearTorch(world, u, 99);""","""  else if (k === 'throw'){ const C = L.filter(u => u.jav && u.spearHeld); if (!C.length){ toast(L.some(u => u.jav) ? '창을 이미 던졌어요 (E 로 줍기)' : '고른 아군 중에 투창을 할 수 있는 이가 없어요'); return; } throwPick = throwPick ? null : C.map(u => u.i); if (throwPick) toast('던질 적을 누르세요 (Esc 취소)'); }
  else if (k === 'pick' && L.some(u => u.jav && !u.spearHeld && mySpear(world, u))){ const C = L.filter(u => u.jav && !u.spearHeld && mySpear(world, u)); C.forEach(u => { u.order = { k: 'pick', spear: true }; }); noteOrders(C); toast('던진 창을 주우러 가요'); }
  else if (k === 'pick'){ const u = L.find(x => !x.torch), tc = u && nearTorch(world, u, 99);""")
rep("""  if (mode !== 'edit' && world && !world.over && !e.ctrlKey && !e.metaKey){ const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick' }[k];""","""  if (mode !== 'edit' && world && !world.over && !e.ctrlKey && !e.metaKey){ const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick', r: 'throw' }[k];""")
rep("""  if (k === 'escape' && mode !== 'edit'){ if (skillPick){ skillPick = null; hud(); return; }""","""  if (k === 'escape' && mode !== 'edit'){ if (throwPick){ throwPick = null; hud(); return; } if (skillPick){ skillPick = null; hud(); return; }""")
rep("""${Wd.torches.some(t => t.dropped) && L.some(u => !u.torch) ? `<button class="btn" type="button" data-ord="pick">횃불 줍기 <kbd>E</kbd></button>` : ''}""","""${L.some(u => u.jav) ? `<button class="btn ${throwPick ? 'on' : ''}" type="button" data-ord="throw">${throwPick ? '던질 적을 누르세요 (Esc 취소)' : L.some(u => u.jav && u.spearHeld) ? '투창 <kbd>R</kbd>' : '창 없음 — 줍기 <kbd>E</kbd>'}</button>` : ''}${L.some(u => u.jav && !u.spearHeld && mySpear(Wd, u)) ? `<button class="btn" type="button" data-ord="pick">창 줍기 <kbd>E</kbd></button>` : Wd.torches.some(t => t.dropped) && L.some(u => !u.torch) ? `<button class="btn" type="button" data-ord="pick">횃불 줍기 <kbd>E</kbd></button>` : ''}""")
rep("""  if (o[0] === 'pick') return `${coord(o[1], o[2])} 횃불 줍기`;""","""  if (o[0] === 'pick') return `${coord(o[1], o[2])} 횃불 줍기`;
  if (o[0] === 'throw') return `${Wd.units[o[1]].name}에게 투창`;
  if (o[0] === 'pickSpear') return '던진 창 줍기';""")
rep("""const ordOf = u => !u.order ? (u.stay ? ['auto', u.stay.x, u.stay.y] : ['auto']) :""","""const ordOf = u => u.order && u.order.k === 'throw' ? ['throw', u.order.b] : u.order && u.order.k === 'pick' && u.order.spear ? ['pickSpear'] : !u.order ? (u.stay ? ['auto', u.stay.x, u.stay.y] : ['auto']) :""")
# tooltip weapon line + card gear
rep("""${esc(u.weaponNow ? u.weaponNow + ' (' + u.weapon + ' 탄약이 떨어짐)' : u.weapon || '없음')}""","""${esc(u.jav && !u.spearHeld ? '맨손 (' + u.weapon + '을 던짐 — 주워야 다시 던짐)' : u.weaponNow ? u.weaponNow + ' (' + u.weapon + ' 탄약이 떨어짐)' : u.weapon || '없음')}""")
rep("""  return `${u.skill ? ' · 약 ' + u.skill.left : ''}${u.ammo != null""","""  return `${u.jav ? (u.spearHeld ? ' · 투창' : ' · 창 없음') : ''}${u.skill ? ' · 약 ' + u.skill.left : ''}${u.ammo != null""")
# log lines
rep("""      case 'order': out.push(""","""      case 'throw': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창! (명중률 ${Math.round(e.p * 100)}%) → 맨손`); break;
      case 'spearDrop': out.push(`${T(e)}${n(e.a)}의 창이 ${{ stuck: '몸에 박혔다가 떨어짐', block: '방어에 막혀 앞으로 튕김', bounce: '바위에 튕김', miss: '빗나가 땅에 꽂힘' }[e.how] || '떨어짐'} (${coord(e.x, e.y)})`); break;
      case 'spearPick': out.push(`${T(e)}${n(e.a)} 창을 다시 주움 (${coord(e.x, e.y)})`); break;
      case 'order': out.push(""")
rep("""        if (e.blade) tags.push('날붙이 판정');""","""        if (e.jav) tags.push('투창 ×' + R.javelin.mul);
        if (e.crit) tags.push('치명 ×' + R.javelin.critMul);
        if (e.blade) tags.push('날붙이 판정');""")
rep("""      case 'wind': if (e.skill){""","""      case 'wind': if (e.jav){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창 조준 (${f2(e.end)}초에 던짐)${e.why && e.why !== '투창' ? ' · ' + e.why : ''}${e.hid ? ' [아군에겐 안 보임]' : ''}`); break; }
        if (e.skill){""")
# narration
rep("""    case 'shout': return { c: 'good', s: `${n(e.a)}: "${e.s}"` };""","""    case 'shout': return U(e.a).side === 0 ? { c: 'good', s: `${n(e.a)}: "${e.s}"` } : e.vis !== false && U(e.a).seenBy ? { c: 'bad', s: `${n(e.a)}: "${e.s}" — 방패를 세운다.` } : null;
    case 'throw': return e.vis ? { c: U(e.a).side === 0 ? 'good' : 'bad', s: `${ga(n(e.a))} ${n(e.b)}에게 창을 던진다!` } : { c: 'bad', s: '어둠 속에서 무언가 날아온다!' };
    case 'spearDrop': return e.how === 'block' ? { s: `창이 방어에 막혀 튕겨 나간다.` } : e.how === 'miss' ? { c: 'dim', s: `창이 빗나가 땅에 꽂힌다.` } : null;
    case 'spearPick': return e.vis ? { c: U(e.a).side === 0 ? 'good' : 'bad', s: `${ga(n(e.a))} 창을 다시 주워 든다.` } : null;""")
rep("""      if (e.ambush) return { c: b.side === 0 ? 'bad' : 'good', s:""","""      if (e.jav && !e.block) return { c: b.side === 0 ? 'bad' : 'good', s: `창이 ${b.name}에게 꽂힌다${e.crit ? ' — 치명!' : ''}${v}.${wd}` };
      if (e.ambush) return { c: b.side === 0 ? 'bad' : 'good', s:""")
rep("""'두리번': '두리번' };""","""'두리번': '두리번', '투창': '투창', '창 주우러': '창 주우러', '사선 찾기': '사선 찾기', '투창 거리로': '투창 거리로' };""")
# rules tab javelin table
rep("""        <div class="box"><p class="lab">등급 특성""","""        <div class="box"><p class="lab">[공통스킬:투창] (굴 3D 의 투창을 옮김)</p><div class="tw"><table class="tbl" id="javTbl"></table></div></div>
        <div class="box"><p class="lab">등급 특성""")
rep("""  $('gradeTbl').innerHTML =""","""  $('javTbl').innerHTML = '<tbody>' + [['wind', '조준 시간 (초)', 0.05], ['vel', '날아가는 빠르기 (칸/초)', 1], ['rng', '사거리 (칸)', 0.5], ['aimNear', '명중률: 가까이', 0.01], ['aimFar', '명중률: 사거리 끝', 0.01], ['mul', '피해 ×', 0.1], ['crit', '치명 확률', 0.05], ['critMul', '치명 피해 ×', 0.1], ['post', '막힐 때 상대 자세 깎임 ×', 0.25]].map(([k, lab, st]) => `<tr><td class="l">${lab}</td><td>${n('javelin.' + k, rules.javelin[k], st)}</td></tr>`).join('') + '</tbody>';
  $('gradeTbl').innerHTML =""")
rep("""<kbd>H</kbd> 제자리 · <kbd>G</kbd> 자동 · <kbd>Q</kbd> 약 · <kbd>E</kbd> 횃불 줍기""","""<kbd>H</kbd> 제자리 · <kbd>G</kbd> 자동 · <kbd>Q</kbd> 약 · <kbd>R</kbd> 투창 · <kbd>E</kbd> 줍기 (창 · 횃불)""")
open('page10.tpl.html','w').write(s)
print('ok')
