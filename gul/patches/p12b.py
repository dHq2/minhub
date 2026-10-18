s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
rep("""           어둠 속 명중: 야시도 후각 (거리 안) 도 없는 인물이 빛 없는 칸의 상대를 치면 근접 25% · 원거리 ×0.1. 횃불이 사라지면 극도로 낮아짐 (적 · 아군 같음).
""","""           어둠 속 명중: 야시도 후각 (거리 안) 도 없는 인물이 빛 없는 칸의 상대를 치면 근접 25% · 원거리 ×0.1. 횃불이 사라지면 극도로 낮아짐 (적 · 아군 같음). 옐로 · 인주는 야시가 없어 그대로 받음.
           야시 등급: A = 어둠 속에서도 보는 거리 전부 (9칸), B = 어둠 속에서는 5칸까지. 적은 모두 야시 B, 검사는 야시 A (v4.1 의 '저격총수 · 검사 야시 없음' 을 바꿈).
           횃불: 든 이 (처음엔 인주) 가 쓰러지면 그 자리에 떨어지고 계속 탐. 아군을 고르고 '횃불 줍기' 로 주워 들 수 있음 (자동인 동료는 든 이가 없으면 4칸 안의 횃불을 스스로 주움).
""")
rep("""  '야시': '어둠 속에서도 보는 거리 안이면 상대를 봄',""","""  '야시': 'A: 어둠 속에서도 보는 거리 전부 (9칸). B: 어둠 속에서는 5칸까지. 야시가 없으면 빛 없는 칸의 상대는 몸이 닿아야 겨우 알고, 거의 못 맞힘',""")
rep("""side, x: 0, y: 0, nv: side === 1, hero: false,""","""side, x: 0, y: 0, nv: side === 1, nvG: side === 1 ? 'B' : '', hero: false,""")
rep("""  'C-076': { nv: false, traits: ['높은후각'], tac: 'pack',""","""  'C-076': { nv: true, nvG: 'B', traits: ['높은후각'], tac: 'pack',""")
rep("""  'C-159': { nv: false, tac: 'stalk', tactic: '어둠 속 저격', note: '야시는 없지만 불빛으로 위치를 앎.""","""  'C-159': { nv: true, nvG: 'B', tac: 'stalk', tactic: '어둠 속 저격', note: '야시 B (어둠 속 5칸) · 횃불은 멀리서도 봄.""")
rep("""  'C-052': { nv: false, tac: 'stalk', tactic: '우회 · 암살', note: '야시는 없지만 불빛으로 위치를 앎.""","""  'C-052': { nv: true, nvG: 'A', tac: 'stalk', tactic: '우회 · 암살', note: '야시 A (어둠 속에서도 다 봄) · 횃불은 멀리서도 봄.""")
rep("""function applyProfile(u, keepNv){ const pf = PROFILE[u.ref]; if (!pf) return u; if (pf.nv !== undefined && u.side === 1 && !keepNv) u.nv = pf.nv;""","""function applyProfile(u, keepNv){ const pf = PROFILE[u.ref]; if (!pf) return u; if (pf.nv !== undefined && u.side === 1 && !keepNv){ u.nv = pf.nv; u.nvG = pf.nvG || (pf.nv ? 'B' : ''); }""")
rep("""if (!S.v42){ for (const u of S.units){ const pf = PROFILE[u.ref]; if (pf && pf.skill && !u.skill){ u.skill = clone(pf.skill); u.tactic = pf.tactic; u.note = pf.note; } } S.v42 = true; }""","""// v4.2: 기술 (옐로 양동이 약) · 야시 등급 (적은 모두 B, 검사 A)
if (!S.v42){ for (const u of S.units){ const pf = PROFILE[u.ref];
    if (pf && pf.skill && !u.skill){ u.skill = clone(pf.skill); u.tactic = pf.tactic; u.note = pf.note; }
    if (u.side === 1 && pf && pf.nv !== undefined){ u.nv = pf.nv; u.nvG = pf.nvG || 'B'; u.note = pf.note; }
    if (u.nv && !u.nvG) u.nvG = 'B'; }
  S.v42 = true; }""")
# editor nv grade
rep("""<label class="ck" for="selNv"><input id="selNv" type="checkbox" ${p.nv ? 'checked' : ''}> 야시 (어둠 속에서도 봄)</label>""","""<label class="ck" for="selNv"><input id="selNv" type="checkbox" ${p.nv ? 'checked' : ''}> 야시 (어둠 속에서도 봄)</label>${p.nv ? `<select id="selNvG" aria-label="야시 등급"><option value="A" ${p.nvG === 'A' ? 'selected' : ''}>야시 A (9칸)</option><option value="B" ${p.nvG !== 'A' ? 'selected' : ''}>야시 B (5칸)</option></select>` : ''}""")
rep("""  if (e.target.id === 'selNv'){ p.nv = e.target.checked; changed(); return; }""","""  if (e.target.id === 'selNv'){ p.nv = e.target.checked; if (p.nv && !p.nvG) p.nvG = 'B'; changed(); return; }
  if (e.target.id === 'selNvG'){ p.nvG = e.target.value; changed(); return; }""")
rep("""    ${traits.length ? traits.map(t => `<span class="tr"><i>[${esc(t === '높은후각' ? t + ' ' + (u.smellG || 'A') : t)}]</i>""","""    ${traits.length ? traits.map(t => `<span class="tr"><i>[${esc(t === '높은후각' ? t + ' ' + (u.smellG || 'A') : t === '야시' ? t + ' ' + (u.nvG || 'B') : t)}]</i>""")
rep("""${u.nv ? ' · 야시' : ''}${u.canGuard ? ' · 방어 ±'""","""${u.nv ? ' · 야시 ' + (u.nvG || 'B') : ' · 야시 없음'}${u.canGuard ? ' · 방어 ±'""")
# torch carrier visuals
rep("""    if (u.hero) drawFlame(px + r * 0.95, py + r * 0.35, r * 0.55, false);""","""    if (u.torch) drawFlame(px + r * 0.95, py + r * 0.35, r * 0.55, false);""")
rep("""  const L = [], h = Wd.units.find(u => u.hero && u.alive);
  if (h) L.push({ x: h.x, y: h.y, r: rules.heroLight, f: 0 });""","""  const L = [];
  for (const h of Wd.units) if (h.torch && h.alive) L.push({ x: h.x, y: h.y, r: rules.heroLight, f: 0 });""")
rep("""<b class="no">${allyNo(Wd, u)}</b> ${esc(u.name)}${u.hero ? ' 🔥' : ''}""","""<b class="no">${allyNo(Wd, u)}</b> ${esc(u.name)}${u.torch || (mode === 'edit' && u.hero) ? ' 🔥' : ''}""")
rep("""const h = Wd.units.find(u => u.hero && u.alive) || Wd.units.find(u => u.side === 0 && u.alive);""","""const h = Wd.units.find(u => u.torch && u.alive && u.side === 0) || Wd.units.find(u => u.side === 0 && u.alive);""")
# orders: pick torch
rep("""${L.some(u => u.skill) ? `<button class="btn ${skillPick ? 'on' : ''}" type="button" data-ord="skill">""","""${Wd.torches.some(t => t.dropped) && L.some(u => !u.torch) ? `<button class="btn" type="button" data-ord="pick">횃불 줍기</button>` : ''}${L.some(u => u.skill) ? `<button class="btn ${skillPick ? 'on' : ''}" type="button" data-ord="skill">""")
rep("""  else if (k === 'skill'){ const C = L.filter""","""  else if (k === 'pick'){ const u = L.find(x => !x.torch), tc = u && nearTorch(world, u, 99); if (!tc){ toast('주울 횃불이 없어요'); return; } u.order = { k: 'pick', x: tc.x, y: tc.y }; toast(`${u.name}${jong(u.name) ? '이' : '가'} ${coord(tc.x, tc.y)}의 횃불을 주우러 가요`); }
  else if (k === 'skill'){ const C = L.filter""")
rep("""  if (o[0] === 'skill') return `${Wd.units[o[1]].name}에게 약`;""","""  if (o[0] === 'skill') return `${Wd.units[o[1]].name}에게 약`;
  if (o[0] === 'pick') return `${coord(o[1], o[2])} 횃불 줍기`;""")
rep("""u.order.k === 'skill' ? ['skill', u.order.b] : ['hold'];""","""u.order.k === 'skill' ? ['skill', u.order.b] : u.order.k === 'pick' ? ['pick', u.order.x, u.order.y] : ['hold'];""")
# log + narration for torch
rep("""      case 'skillSkip':""","""      case 'torchDrop': out.push(`${T(e)}🔥 ${n(e.a)} 쓰러지며 횃불이 떨어짐 (${coord(e.x, e.y)}, 계속 탐)`); break;
      case 'torchPick': out.push(`${T(e)}🔥 ${ga(n(e.a))} 횃불을 주워 듦 (${coord(e.x, e.y)})`); break;
      case 'skillSkip':""")
rep("""    case 'skillSkip': return""","""    case 'torchDrop': return { c: 'bad', s: `${n(e.a)}의 손에서 횃불이 떨어져 바닥에서 타오른다.` };
    case 'torchPick': return { c: 'good', s: `${ga(n(e.a))} 횃불을 주워 든다.` };
    case 'skillSkip': return""")
rep("""'응급': '응급!', '치유하러': '치유하러', '치유': '치유' };""","""'응급': '응급!', '치유하러': '치유하러', '치유': '치유', '횃불 줍기': '횃불 줍기' };""")
# rules row nvB
rep("""const vis = [['sight', '보는 거리 (칸)', 0.5],""","""const vis = [['sight', '보는 거리 (칸)', 0.5], ['nvB', '야시 B: 어둠 속에서 보는 거리 (칸, A 는 보는 거리 전부)', 0.5],""")
# tooltip carrier
rep("""    ${u.skill ? `<span class="tr"><i>[${esc(u.skill.name)}]</i>""","""    ${u.torch && !ed ? `<span class="tr"><span class="lb">횃불</span> 들고 있음 (빛 ${Wd.rules.heroLight}칸 · 멀리서도 보임)</span>` : ''}
    ${u.skill ? `<span class="tr"><i>[${esc(u.skill.name)}]</i>""")
open('page10.tpl.html','w').write(s)
print('ok')
