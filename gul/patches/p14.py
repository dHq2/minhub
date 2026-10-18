s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
# version
rep("""<!-- 굴의 전투판 v4.3.1 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
""","""<!-- 굴의 전투판 v4.4 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v4.4: 명령을 매끄럽게 — 진행 중에도 명령이 바로 먹음 (턴 끝을 기다리지 않음, 로그에 '새 명령'). 오른쪽 클릭 = 명령 (바닥 이동 · 적 공격 · 아군에게 옐로의 약),
           왼쪽 클릭도 그대로 됨. 오른쪽 끌기 = 둘러보기. 단축키 H 제자리 · G 자동 · Q 약 · E 횃불 줍기 · T 횃불 내려놓기.
           옐로: 기동 (빠르고 공격 준비가 짧음) · 공격 ×1.35 (인물 공격 배율 am) · [사족보행] 2칸 넘게 달릴 때 네 발로 (속력 ×1.4) · 기형적인 손이라 총 · 활 못 다룸 (무기 고르기에서 빠짐).
""")
for a,b in [("""<span class="ver">v4.3.1 · 한 턴씩""","""<span class="ver">v4.4 · 한 턴씩"""),("""  <footer>굴의 전투판 v4.3.1 — ""","""  <footer>굴의 전투판 v4.4 — """),("""copyText('굴의 전투판 v4.3.1 자동 판 기록""","""copyText('굴의 전투판 v4.4 자동 판 기록"""),("""  return `굴의 전투판 v4.3.1 · ${title}""","""  return `굴의 전투판 v4.4 · ${title}""")]: rep(a,b)
# ---- orders anytime + logging
rep("""let sel = new Set(), hudT = 0, boxSel = null, skillPick = null;""","""let sel = new Set(), hudT = 0, boxSel = null, skillPick = null;
// 진행 중에 준 명령은 로그에 '새 명령' 으로 남김 (턴 시작 명령표에는 안 나오니)
const logEv = (W, o) => { o.t = +W.t.toFixed(2); W.log.push(o); };
function noteOrders(list){ if (mode === 'run' && world) for (const u of list) logEv(world, { k: 'order', a: u.i, o: orderTxt(u.order, u) }); }""")
rep("""  if (mode !== 'plan'){ toast('턴이 끝난 뒤에 명령할 수 있어요'); return true; }
  for (const i of skillPick){ const u = world.units[i]; if (u.alive && u.skill && u.skill.left > 0) u.order = { k: 'skill', b: t.i }; }
  skillPick = null;""","""  const C = skillPick.map(i => world.units[i]).filter(u => u.alive && u.skill && u.skill.left > 0);
  for (const u of C) u.order = { k: 'skill', b: t.i };
  noteOrders(C); skillPick = null;""")
rep("""$('foes').addEventListener('click', e => { const b = e.target.closest('[data-foe]'); if (!b || mode !== 'plan') return; giveAttack(world.units[+b.dataset.foe]); });""","""$('foes').addEventListener('click', e => { const b = e.target.closest('[data-foe]'); if (!b || mode === 'edit' || !world || world.over) return; giveAttack(world.units[+b.dataset.foe]); });""")
rep("""  if (k === 'none'){ sel = new Set(); hud(); return; }
  if (mode !== 'plan'){ toast('턴이 끝난 뒤에 명령할 수 있어요'); return; }
  const L = selUnits(world);
  if (k === 'auto') L.forEach(u => { u.order = null; u.stay = null; });   // 자리를 풀고 주인공을 따라감
  else if (k === 'hold') L.forEach(u => { u.order = { k: 'hold' }; stop(u); });""","""  if (k === 'none'){ sel = new Set(); hud(); return; }
  if (world.over) return;
  ordKey(k);
});
// 명령 단추 · 단축키 공통 (진행 중에도 바로 먹음)
function ordKey(k){
  const L = selUnits(world);
  if (!L.length && k !== 'torch'){ toast('먼저 명령할 아군을 고르세요'); return; }
  if (k === 'auto'){ L.forEach(u => { u.order = null; u.stay = null; }); noteOrders(L); }   // 자리를 풀고 주인공을 따라감
  else if (k === 'hold'){ L.forEach(u => { u.order = { k: 'hold' }; stop(u); }); noteOrders(L); }""")
rep("""  else if (k === 'pick'){ const u = L.find(x => !x.torch), tc = u && nearTorch(world, u, 99); if (!tc){ toast('주울 횃불이 없어요'); return; } u.order = { k: 'pick', x: tc.x, y: tc.y }; toast(`${u.name}${jong(u.name) ? '이' : '가'} ${coord(tc.x, tc.y)}의 횃불을 주우러 가요`); }
  else if (k === 'skill'){ const C = L.filter(u => u.skill && u.skill.left > 0); if (!C.length){ toast('남은 약이 없어요'); return; } skillPick = skillPick ? null : C.map(u => u.i); if (skillPick) toast('치유할 아군을 판이나 카드에서 누르세요 (자기 자신도 돼요)'); }
  hud();
});""","""  else if (k === 'pick'){ const u = L.find(x => !x.torch), tc = u && nearTorch(world, u, 99); if (!tc){ toast('주울 횃불이 없어요'); return; } u.order = { k: 'pick', x: tc.x, y: tc.y }; noteOrders([u]); toast(`${u.name}${jong(u.name) ? '이' : '가'} ${coord(tc.x, tc.y)}의 횃불을 주우러 가요`); }
  else if (k === 'skill'){ const C = L.filter(u => u.skill && u.skill.left > 0); if (!C.length){ toast(L.some(u => u.skill) ? '남은 약이 없어요' : '고른 아군 중에 약을 가진 이가 없어요'); return; } skillPick = skillPick ? null : C.map(u => u.i); if (skillPick) toast('치유할 아군을 누르세요 (오른쪽 클릭 · 자기 자신도 돼요)'); }
  hud();
}""")
rep("""  L.forEach(u => { u.order = { k: 'attack', b: t.i }; u.last = { x: t.x, y: t.y }; }); hud();""","""  L.forEach(u => { u.order = { k: 'attack', b: t.i }; u.last = { x: t.x, y: t.y }; }); noteOrders(L); hud();""")
rep("""  if (L.length === 1){ L[0].order = { k: 'move', x: tx, y: ty }; return; }""","""  if (L.length === 1){ L[0].order = { k: 'move', x: tx, y: ty }; noteOrders(L); return; }""")
rep("""    taken.add(gx + ',' + gy); u.order = { k: 'move', x: gx + 0.5, y: gy + 0.5 };
  }
}""","""    taken.add(gx + ',' + gy); u.order = { k: 'move', x: gx + 0.5, y: gy + 0.5 };
  }
  noteOrders(L);
}""")
rep("""  if (skillPick){ skillPick = null; toast('약 쓰기를 취소했어요'); hud(); return; }
  if (mode !== 'plan'){ toast('턴이 끝난 뒤에 명령할 수 있어요'); return; }
  if (u && u.side === 1){ giveAttack(u); return; }""","""  if (skillPick){ skillPick = null; toast('약 쓰기를 취소했어요'); hud(); return; }
  if (u && u.side === 1){ giveAttack(u); return; }""")
rep("""function editClick(w){""","""// 오른쪽 클릭 = 명령: 적 → 공격, 아군 → (약을 가진 아군을 골랐으면) 그 아군에게 약, 바닥 → 이동
function rightClick(w){
  if (!world || world.over) return;
  const u = unitAt(world, w.x, w.y, false), L = selUnits(world);
  if (!L.length){ toast('먼저 명령할 아군을 고르세요'); return; }
  if (u && u.side === 1){ giveAttack(u); return; }
  if (u && u.side === 0){
    const C = L.filter(x => x.skill && x.skill.left > 0);
    if (C.length){ skillPick = C.map(x => x.i); giveSkill(u); return; }
    toast('아군 위 오른쪽 클릭은 약을 가진 아군 (옐로) 을 골랐을 때 약 쓰기예요'); return;
  }
  skillPick = null; groupMove(L, w.x, w.y); hud();
}
function editClick(w){""")
rep("""  pd = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, unit: null, box: mode !== 'edit' && e.button === 0, shift: e.shiftKey };""","""  pd = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, unit: null, box: mode !== 'edit' && e.button === 0, shift: e.shiftKey, right: e.button === 2 };""")
rep("""  if (mode === 'edit') editClick(w); else playClick(w, e.shiftKey);""","""  if (mode === 'edit') editClick(w); else if (d.right) rightClick(w); else playClick(w, e.shiftKey);""")
# keyboard
rep("""  if (k === 't' && mode === 'plan' && world && !world.over){ if (world.spare > 0){ dropTorch(world); renderLog(); hud(); } else toast('남은 횃불이 없어요'); }""","""  if (k === 't' && mode !== 'edit' && world && !world.over){ if (world.spare > 0){ dropTorch(world); renderLog(); hud(); } else toast('남은 횃불이 없어요'); }
  if (mode !== 'edit' && world && !world.over && !e.ctrlKey && !e.metaKey){ const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick' }[k]; if (m){ e.preventDefault(); ordKey(m); } }""")
# button labels with shortcuts
rep("""<button class="btn" type="button" data-ord="auto" title="지키던 자리를 풀고 주인공을 따라가며 스스로 판단">자동 (따라감)</button><button class="btn" type="button" data-ord="hold">제자리 (닿는 적만 침)</button>""","""<button class="btn" type="button" data-ord="auto" title="지키던 자리를 풀고 주인공을 따라가며 스스로 판단">자동 · 따라감 <kbd>G</kbd></button><button class="btn" type="button" data-ord="hold">제자리 <kbd>H</kbd></button>""")
rep("""<button class="btn" type="button" data-ord="pick">횃불 줍기</button>""","""<button class="btn" type="button" data-ord="pick">횃불 줍기 <kbd>E</kbd></button>""")
rep("""${skillPick ? '치유할 아군을 누르세요 (Esc 취소)' : esc(L.find(u => u.skill).skill.name) + ' (남은 ' + L.filter(u => u.skill).map(u => u.skill.left).join('·') + ')'}</button>""","""${skillPick ? '치유할 아군을 누르세요 (Esc 취소)' : esc(L.find(u => u.skill).skill.name) + ' (남은 ' + L.filter(u => u.skill).map(u => u.skill.left).join('·') + ') <kbd>Q</kbd>'}</button>""")
rep("""<p class="keys">아군을 고르고 → 바닥 = 그 칸으로 가서 지킴 (도착하면 스스로 판단) · 보이는 적 = 공격 · <kbd>Space</kbd> 다음 턴. 커서를 올리면 그 인물의 시선 (등 뒤는 못 알아챔) · 공격 범위 · 하는 일이 보여요.</p>""",
"""<p class="keys">아군을 고르고 (왼쪽 클릭 · 끌어 네모 · 숫자키) → 오른쪽 클릭: 바닥 = 그 칸으로 가서 지킴 (도착하면 스스로 판단) · 적 = 공격 · 아군 = 옐로의 약. 명령은 진행 중에도 바로 먹어요. <kbd>H</kbd> 제자리 · <kbd>G</kbd> 자동 · <kbd>Q</kbd> 약 · <kbd>E</kbd> 횃불 줍기 · <kbd>Space</kbd> 다음 턴 · 오른쪽 끌기 = 둘러보기.</p>""")
rep("""    : mode === 'run' ? `턴 ${Wd.turn} 진행 중 · ${f2(Wd.t)} / ${f2(Wd.turnEnd)}초${cont ? ' · 계속 진행 (▶▶ 를 누르면 이 턴 끝에서 멈춤)' : ''}`""","""    : mode === 'run' ? `턴 ${Wd.turn} 진행 중 · ${f2(Wd.t)} / ${f2(Wd.turnEnd)}초${cont ? ' · 계속 진행 (▶▶ 를 누르면 이 턴 끝에서 멈춤)' : ''} · 지금도 명령할 수 있어요`""")
rep("""      case 'torchDrop':""","""      case 'order': out.push(`${T(e)}${n(e.a)} 새 명령 → ${orderLabel(Wd, e.o)}`); break;
      case 'quad': out.push(`${T(e)}${n(e.a)} 네 발로 달림 (속력 ×${Wd.rules.quadMul})`); break;
      case 'torchDrop':""")
rep("""    case 'torchDrop': return""","""    case 'quad': return U(e.a).side === 0 || e.vis ? { s: `${ga(n(e.a))} 네 발로 땅을 박차며 달린다.` } : null;
    case 'torchDrop': return""")
# ---- 옐로 profile
rep("""  'C-008': { skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.8, rec: 0.4, rng: 0.8 }, tactic: '양동이 약', note: '양동이에 담은 자기 세계의 약. 모두 합쳐 500 만큼 회복 (한 번에 최대 120). 평소엔 명령으로, 동료가 아주 위급하면 (체력 25% 아래) 스스로 달려가 씀' },""",
"""  'C-008': { cls: '기동', am: 1.35, traits: ['사족보행'], noRanged: true, skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.8, rec: 0.4, rng: 0.8 }, tactic: '기동 · 양동이 약', note: '기형적인 손이라 총 · 활은 못 다룸. 가끔 네 발로 짐승처럼 뛰어다니고, 공격이 셈. 양동이에 담은 자기 세계의 약으로 모두 합쳐 500 만큼 회복 (한 번에 최대 120) — 평소엔 명령으로, 동료가 아주 위급하면 (체력 25% 아래) 스스로' },""")
rep("""if (pf.tac) u.tac = pf.tac; if (pf.skill && !u.skill) u.skill = clone(pf.skill);""","""if (pf.tac) u.tac = pf.tac; if (pf.cls) u.cls = pf.cls; if (pf.am) u.am = pf.am; if (pf.noRanged) u.noRanged = true; if (pf.skill && !u.skill) u.skill = clone(pf.skill);""")
rep("""  '반사신경': '반사신경과 직감:""","""  '사족보행': '가끔 네 발로 짐승처럼 뛰어다님: 2칸 넘게 달릴 때 속력 ×1.4 (공격하려면 일어섬)',
  '반사신경': '반사신경과 직감:""")
rep("""// v4.3: 무기표에 탄속 (vel)""","""// v4.4: 옐로 = 기동 · 공격 ×1.35 · [사족보행] · 총 · 활 못 다룸
if (!S.v44){ for (const u of S.units) if (u.ref === 'C-008'){ const pf = PROFILE['C-008']; u.cls = pf.cls; u.am = pf.am; u.noRanged = true; u.traits = [...new Set([...(u.traits || []), ...pf.traits])]; u.tactic = pf.tactic; u.note = pf.note; if (rules.weapons[u.weapon] && rules.weapons[u.weapon].rng > 1) u.weapon = '검'; } S.v44 = true; }
// v4.3: 무기표에 탄속 (vel)""")
s=s.replace("""v42: true, v43: true,""","""v42: true, v43: true, v44: true,""")
# editor weapon select + am
rep("""      <select id="selWeapon" aria-label="무기">${Object.keys(rules.weapons).map(w =>""","""      <select id="selWeapon" aria-label="무기">${Object.keys(rules.weapons).filter(w => !p.noRanged || rules.weapons[w].rng <= 1).map(w =>""")
rep("""    <div class="row"><label class="brush" for="selBold">대담함 (0~1)""","""    ${p.noRanged ? '<p class="note">기형적인 손: 총 · 활 같은 원거리 무기는 못 다뤄요 (무기 목록에서 빠짐)</p>' : ''}
    <div class="row"><label class="brush" for="selAm">공격 배율 <input id="selAm" type="number" min="0.1" step="0.05" value="${p.am != null ? p.am : ''}" placeholder="1"></label><label class="brush" for="selBold">대담함 (0~1)""")
rep("""  if (e.target.id === 'selSmellG'){""","""  if (e.target.id === 'selAm'){ const v = e.target.value.trim(); if (v === '' || !(+v > 0)) delete p.am; else p.am = +v; changed(); return; }
  if (e.target.id === 'selSmellG'){""")
# draft card class
rep("""<span class="m">${esc(tLabel(r[3], r[2]))} · ${r[4]}${r[10] ? ' · 방패' : ''}<br>${esc(r[11] || '')} · 속력 ${(rules.classes[r[4]].spd * (r[9] || 1)).toFixed(1)}""","""<span class="m">${esc(tLabel(r[3], r[2]))} · ${(PROFILE[c] && PROFILE[c].cls) || r[4]}${r[10] ? ' · 방패' : ''}<br>${esc(r[11] || '')} · 속력 ${(rules.classes[(PROFILE[c] && PROFILE[c].cls) || r[4]].spd * (r[9] || 1)).toFixed(1)}""")
# quad tag on board (overrides mood tag)
rep("""      if (!ed && ts >= 30 && u.mood && !u.act && MOOD_TAG[u.mood] && (detail() || u.side === 1 || u.pid === hoverPid || sel.has(u.i))){ ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; const t = MOOD_TAG[u.mood], tw = ctx.measureText(t).width;""","""      if (!ed && ts >= 30 && !u.act && (u.quadOn || (u.mood && MOOD_TAG[u.mood] && (detail() || u.side === 1 || u.pid === hoverPid || sel.has(u.i))))){ ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; const t = u.quadOn ? '네 발로' : MOOD_TAG[u.mood], tw = ctx.measureText(t).width;""")
# tooltip
rep("""    <span class="tr"><span class="lb">대담함</span>""","""    ${u.quad || p.noRanged || (p.am && p.am !== 1) ? `<span class="tr"><span class="lb">몸</span> ${[p.am && p.am !== 1 ? '공격 ×' + p.am : '', u.quad ? (u.quadOn ? '지금 네 발로 달리는 중 (속력 ×' + Wd.rules.quadMul + ')' : '먼 거리는 네 발로') : '', p.noRanged ? '총 · 활 못 다룸' : ''].filter(Boolean).join(' · ')}</span>` : ''}
    <span class="tr"><span class="lb">대담함</span>""")
rep("""['turnRate', '돌아서는 빠르기 (초당 도)', 30],""","""['turnRate', '돌아서는 빠르기 (초당 도)', 30], ['quadMul', '[사족보행] 네 발로 달릴 때 속력 ×', 0.05],""")
open('page10.tpl.html','w').write(s)
print('ok')
