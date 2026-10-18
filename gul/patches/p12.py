s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
# ---- version
rep("""<!-- 굴의 전투판 v4.1 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
""","""<!-- 굴의 전투판 v4.2 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v4.2: 재생 속도: 예전 ½× 를 기본 (1×) 으로. 단추는 ½× · 1× · 2× · 4× (예전 ¼ · ½ · 1 · 2 배).
           옐로 기술 [양동이 약]: 양동이에 담은 액체로 모두 합쳐 500 만큼 회복 (한 번에 최대 120, 손 닿는 동료 · 자기 자신, 붓는 데 0.8초).
           평소엔 명령 (옐로를 고르고 '양동이 약' → 치유할 아군을 누름), 동료 체력이 25% 아래로 떨어지면 (아주 위급) 명령 없이도 달려가 씀 (다른 명령 중이면 3칸 안만).
           시선: 모든 인물에 부채꼴 — 앞 (±60°, 진하게) · 옆 (±120°, 옅게) 은 알아채고, 등 뒤 (±60°) 는 못 알아챔. '시선' 칸으로 끄고 켬.
           공격 범위: 기본으로 켬. 근접처럼 짧은 사거리도 보이게 몸 둘레 띠 (몸 가장자리 ~ 사거리) 로 그림.
""")
rep("""<span class="ver">v4.1 · 한 턴씩 · 사선 · 감각 · expert 적 · 도감 2026-10-10 기준</span>""","""<span class="ver">v4.2 · 한 턴씩 · 사선 · 감각 · expert 적 · 기술 · 도감 2026-10-10 기준</span>""")
rep("""  <footer>굴의 전투판 v4.1 — ""","""  <footer>굴의 전투판 v4.2 — """)
rep("""copyText('굴의 전투판 v4.1 자동 판 기록""","""copyText('굴의 전투판 v4.2 자동 판 기록""")
rep("""  return `굴의 전투판 v4.1 · ${title}""","""  return `굴의 전투판 v4.2 · ${title}""")
# ---- speed: old 0.5 = new 1×
rep("""<span class="seg" id="speedSeg" aria-label="재생 속도"><button type="button" data-sp="0.5">½×</button><button type="button" data-sp="1" class="on">1×</button><button type="button" data-sp="2">2×</button><button type="button" data-sp="4">4×</button></span>""",
"""<span class="seg" id="speedSeg" aria-label="재생 속도"><button type="button" data-sp="0.25">½×</button><button type="button" data-sp="0.5" class="on">1×</button><button type="button" data-sp="1">2×</button><button type="button" data-sp="2">4×</button></span>""")
rep("""let mode = 'edit', paused = false, speed = 1, world = null,""","""let mode = 'edit', paused = false, speed = 0.5, world = null,""")
# ---- sight toggle + range default on
rep("""          <label class="ck" for="rangeAll"><input id="rangeAll" type="checkbox"> 공격 범위</label>""","""          <label class="ck" for="sightAll"><input id="sightAll" type="checkbox" checked> 시선</label>
          <label class="ck" for="rangeAll"><input id="rangeAll" type="checkbox" checked> 공격 범위</label>""")
# drawRange: annulus band so short reach is visible
rep("""function drawRange(u, ox, oy, ts, k){
  const px = ox + u.x * ts, py = oy + u.y * ts, R = (u.r + u.rng) * ts, c = u.side ? '255,120,95' : '140,202,255';
  ctx.fillStyle = `rgba(${c},${0.07 * k + 0.03})`; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.fill();
  ctx.strokeStyle = `rgba(${c},${0.55 * k + 0.2})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.stroke();""","""function drawRange(u, ox, oy, ts, k){
  const px = ox + u.x * ts, py = oy + u.y * ts, r0 = u.r * ts + 2, R = Math.max(r0 + 3, (u.r + u.rng) * ts), c = u.side ? '255,120,95' : '140,202,255';
  // 몸 가장자리 ~ 사거리 띠 (근접처럼 짧아도 보이게)
  ctx.fillStyle = `rgba(${c},${0.1 * k + 0.05})`; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.arc(px, py, r0, 0, 6.283, true); ctx.fill();
  ctx.strokeStyle = `rgba(${c},${0.55 * k + 0.3})`; ctx.lineWidth = k >= 1 ? 2 : 1.5; if (k < 1) ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);""")
# sight fan: draw before portraits (in the unit loop, before clip)
rep("""    ctx.globalAlpha = vis ? 1 : 0.42;
    ctx.save(); ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.closePath(); ctx.fillStyle = '#1c1a20'; ctx.fill(); ctx.clip();""","""    ctx.globalAlpha = vis ? 1 : 0.42;
    // 시선: 앞 ±frontArc (진하게) · 옆 (옅게) 은 알아챔, 등 뒤는 비워 둠 (못 알아챔)
    if ($('sightAll').checked && !ed){
      const fa0 = u.face || 0, F = Wd.rules.frontArc * Math.PI / 180, Sd = (180 - Wd.rules.frontArc) * Math.PI / 180, strong = u.pid === hoverPid || (sel.has(u.i) && u.side === 0), R3 = r + ts * (strong ? 1.6 : 0.95), c = u.side ? '255,140,110' : '150,205,255';
      const fan = (a0, a1, al) => { const g = ctx.createRadialGradient(px, py, r, px, py, R3); g.addColorStop(0, `rgba(${c},${al})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, R3, a0, a1); ctx.arc(px, py, r, a1, a0, true); ctx.closePath(); ctx.fill(); };
      fan(fa0 - F, fa0 + F, strong ? 0.34 : 0.2); fan(fa0 + F, fa0 + Sd, strong ? 0.14 : 0.08); fan(fa0 - Sd, fa0 - F, strong ? 0.14 : 0.08);
      if (strong){ ctx.strokeStyle = `rgba(${c},.5)`; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); for (const a of [fa0 - Sd, fa0 + Sd]){ ctx.beginPath(); ctx.moveTo(px + Math.cos(a) * r, py + Math.sin(a) * r); ctx.lineTo(px + Math.cos(a) * R3, py + Math.sin(a) * R3); ctx.stroke(); } ctx.setLineDash([]);
        if (ts >= 30){ const ba = fa0 + Math.PI, t = '등 뒤 (못 알아챔)'; ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const lx = px + Math.cos(ba) * (r + ts * 0.75), ly = py + Math.sin(ba) * (r + ts * 0.75), tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(10,8,12,.7)'; ctx.fillRect(lx - tw / 2 - 3, ly - 7, tw + 6, 14); ctx.fillStyle = '#d8cfc0'; ctx.fillText(t, lx, ly); } }
    }
    ctx.save(); ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.closePath(); ctx.fillStyle = '#1c1a20'; ctx.fill(); ctx.clip();""")
# wind line color for skill
rep("""      ctx.strokeStyle = u.act.k === 'heal' ? 'rgba(111,224,143,.85)'""","""      ctx.strokeStyle = u.act.k === 'heal' || u.act.k === 'skill' ? 'rgba(111,224,143,.85)'""")
# order line for skill
rep("""        if (u.order.k === 'attack'){ const t = Wd.units[u.order.b]; if (t.alive && (t.seenBy || see)){""","""        if (u.order.k === 'skill'){ const t = Wd.units[u.order.b]; if (t && t.alive){ const p = { x: ox + t.x * ts, y: oy + t.y * ts }, r = t.r * ts; ctx.strokeStyle = `rgba(111,224,143,${al})`; if (t !== u){ ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(p.x, p.y); ctx.stroke(); }
          ctx.setLineDash([]); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p.x + r + 4, p.y - r); ctx.lineTo(p.x + r + 12, p.y - r); ctx.moveTo(p.x + r + 8, p.y - r - 4); ctx.lineTo(p.x + r + 8, p.y - r + 4); ctx.stroke(); ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); } }
        if (u.order.k === 'attack'){ const t = Wd.units[u.order.b]; if (t.alive && (t.seenBy || see)){""")
# ---- profile: 옐로 skill
rep("""  'C-006': { traits: ['높은후각', '반사신경'],""","""  'C-008': { skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.8, rec: 0.4, rng: 0.5 }, tactic: '양동이 약', note: '양동이에 담은 자기 세계의 약. 모두 합쳐 500 만큼 회복 (한 번에 최대 120). 평소엔 명령으로, 동료가 아주 위급하면 (체력 25% 아래) 스스로 달려가 씀' },
  'C-006': { traits: ['높은후각', '반사신경'],""")
rep("""if (pf.tac) u.tac = pf.tac; u.tactic = pf.tactic; u.note = pf.note; return u; }""","""if (pf.tac) u.tac = pf.tac; if (pf.skill && !u.skill) u.skill = clone(pf.skill); u.tactic = pf.tactic; u.note = pf.note; return u; }""")
rep("""if (!S.v41){ for (const u of S.units) applyProfile(u); S.v41 = true; }""","""if (!S.v41){ for (const u of S.units) applyProfile(u); S.v41 = true; }
// v4.2: 기술 (옐로 양동이 약)
if (!S.v42){ for (const u of S.units){ const pf = PROFILE[u.ref]; if (pf && pf.skill && !u.skill){ u.skill = clone(pf.skill); u.tactic = pf.tactic; u.note = pf.note; } } S.v42 = true; }""")
rep("""  const S = { v: 3, v4: true, v41: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: newDraft() };""","""  const S = { v: 3, v4: true, v41: true, v42: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: newDraft() };""")
rep("""  const S = { v: 3, v4: true, v41: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: { cands:""","""  const S = { v: 3, v4: true, v41: true, v42: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: { cands:""")
# ---- labels
rep("""  if (o[0] === 'attack') return `${Wd.units[o[1]].name} 공격`;""","""  if (o[0] === 'attack') return `${Wd.units[o[1]].name} 공격`;
  if (o[0] === 'skill') return `${Wd.units[o[1]].name}에게 약`;""")
rep("""const ordOf = u => !u.order ? ['auto'] : u.order.k === 'move' ? ['move', u.order.x, u.order.y] : u.order.k === 'attack' ? ['attack', u.order.b] : ['hold'];""","""const ordOf = u => !u.order ? ['auto'] : u.order.k === 'move' ? ['move', u.order.x, u.order.y] : u.order.k === 'attack' ? ['attack', u.order.b] : u.order.k === 'skill' ? ['skill', u.order.b] : ['hold'];""")
rep("""  if (a.ph === 'wind') return a.k === 'heal' ?""","""  if (a.k === 'skill') return a.ph === 'wind' ? `${u.skill ? u.skill.name : '기술'} → ${b.name} (${f2(a.left)}초 뒤 회복)${a.why ? ' · 위급해서 스스로' : ''}` : `약을 부은 뒤 (${f2(a.left)}초 남음)`;
  if (a.ph === 'wind') return a.k === 'heal' ?""")
rep("""function gearTxt(Wd, u){
  if (!u.alive) return '';
  return `${u.ammo != null""","""function gearTxt(Wd, u){
  if (!u.alive) return '';
  return `${u.skill ? ' · 약 ' + u.skill.left : ''}${u.ammo != null""")
rep("""    <span class="tr"><span class="lb">대담함</span>""","""    ${u.skill ? `<span class="tr"><i>[${esc(u.skill.name)}]</i> 남은 ${u.skill.left}/${u.skill.pool} · 한 번에 최대 ${u.skill.per} · 손 닿는 동료 (자기 자신도) · 붓는 데 ${u.skill.wind}초 · 동료 체력 ${Math.round(Wd.rules.bucketAuto * 100)}% 아래면 스스로</span>` : ''}
    <span class="tr"><span class="lb">대담함</span>""")
# log header who
rep("""${u.smellG ? ' · 후각 ' + u.smellG : ''}${u.pack ? ' · 포위 사냥' : u.stalk ? ' · 어둠 속 우회' : ''}""","""${u.smellG ? ' · 후각 ' + u.smellG : ''}${u.pack ? ' · 포위 사냥' : u.stalk ? ' · 어둠 속 우회' : ''}${u.skill ? ' · [' + u.skill.name + ' ' + u.skill.pool + ', 한 번에 ' + u.skill.per + ']' : ''}""")
# log lines
rep("""      case 'wind': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비""","""      case 'skill': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.name} +${e.amt} (${n(e.b)} ${e.hp}/${Wd.units[e.b].max}) · 남은 약 ${e.left}${e.auto ? ' · 위급해서 스스로' : ' · 명령'}`); break;
      case 'skillSkip': out.push(`${T(e)}${n(e.a)}: ${n(e.b)}의 체력이 가득이라 약을 아낌 → 제자리`); break;
      case 'wind': if (e.skill){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.skill} 붓기 시작 (${f2(e.end)}초에 회복)${e.auto ? ' · 위급해서 스스로' : ''}`); break; }
        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비""")
rep("""          const gear = `${s.mood && !s.act ? ' · [' + s.mood + ']' : ''}""","""          const gear = `${s.skill != null ? ' · 약 ' + s.skill : ''}${s.mood && !s.act ? ' · [' + s.mood + ']' : ''}""")
# narration
rep("""    case 'wind': { const a = U(e.a), b = U(e.b), far = a.rng > 1;
      if (e.heal) return""","""    case 'skill': return { c: 'good', s: `${ga(n(e.a))} 양동이의 약을 ${e.a === e.b ? '자기 몸에' : n(e.b) + '에게'} 끼얹는다 (+${e.amt}, 남은 약 ${e.left}).` };
    case 'skillSkip': return { c: 'dim', s: `${n(e.b)}의 상처가 없어 ${ga(n(e.a))} 약을 아낀다.` };
    case 'wind': { const a = U(e.a), b = U(e.b), far = a.rng > 1;
      if (e.skill) return e.auto && a.side === 0 ? { c: 'good', s: `${ga(a.name)} 쓰러져 가는 ${e.a === e.b ? '자기 몸' : b.name}에게 양동이를 기울인다!` } : null;
      if (e.heal) return""")
rep("""'막힘': { c: 'dim', s: `${ga(a)} ${b}의 방어에 막혀 사선을 찾는다.` }, '수색':""","""'막힘': { c: 'dim', s: `${ga(a)} ${b}의 방어에 막혀 사선을 찾는다.` }, '응급': { c: 'good', s: `${ga(a)} 양동이를 들고 ${b}에게 달려간다!` }, '수색':""")
rep("""'살핌': '살핌', '어둠 속 접근': '접근', '파고듦': '파고듦' };""","""'살핌': '살핌', '어둠 속 접근': '접근', '파고듦': '파고듦', '응급': '응급!', '치유하러': '치유하러', '치유': '치유' };""")
# orders panel: skill button + pick mode
rep("""${L.some(u => u.hero) ? `<button class="btn" type="button" data-ord="torch">횃불 내려놓기 (${Wd.spare})</button>` : ''}""","""${L.some(u => u.hero) ? `<button class="btn" type="button" data-ord="torch">횃불 내려놓기 (${Wd.spare})</button>` : ''}${L.some(u => u.skill) ? `<button class="btn ${skillPick ? 'on' : ''}" type="button" data-ord="skill">${skillPick ? '치유할 아군을 누르세요 (Esc 취소)' : esc(L.find(u => u.skill).skill.name) + ' (남은 ' + L.filter(u => u.skill).map(u => u.skill.left).join('·') + ')'}</button>` : ''}""")
rep("""  else if (k === 'torch'){ if (world.spare <= 0) toast('남은 횃불이 없어요'); else { dropTorch(world); renderLog(); } }""","""  else if (k === 'torch'){ if (world.spare <= 0) toast('남은 횃불이 없어요'); else { dropTorch(world); renderLog(); } }
  else if (k === 'skill'){ const C = L.filter(u => u.skill && u.skill.left > 0); if (!C.length){ toast('남은 약이 없어요'); return; } skillPick = skillPick ? null : C.map(u => u.i); if (skillPick) toast('치유할 아군을 판이나 카드에서 누르세요 (자기 자신도 돼요)'); }""")
rep("""let sel = new Set(), hudT = 0, boxSel = null;""","""let sel = new Set(), hudT = 0, boxSel = null, skillPick = null;
// 기술 대상 고르기: 고른 시전자 (skillPick) 에게 '그 아군에게 약' 명령
function giveSkill(t){
  if (!skillPick || !world) return false;
  if (mode !== 'plan'){ toast('턴이 끝난 뒤에 명령할 수 있어요'); return true; }
  for (const i of skillPick){ const u = world.units[i]; if (u.alive && u.skill && u.skill.left > 0) u.order = { k: 'skill', b: t.i }; }
  skillPick = null; toast(`${t.name}에게 약을 쓰라고 했어요`); hud(); return true;
}""")
rep("""  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }
  if (mode !== 'plan'){ toast('턴이 끝난 뒤에 명령할 수 있어요'); return; }""","""  if (u && u.side === 0 && skillPick){ giveSkill(u); return; }
  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }
  if (skillPick){ skillPick = null; toast('약 쓰기를 취소했어요'); hud(); return; }
  if (mode !== 'plan'){ toast('턴이 끝난 뒤에 명령할 수 있어요'); return; }""")
rep("""$('party').addEventListener('click', e => { const b = e.target.closest('[data-ally]'); if (!b || mode === 'edit') return; pickAlly(+b.dataset.ally, e.shiftKey); hud(); });""","""$('party').addEventListener('click', e => { const b = e.target.closest('[data-ally]'); if (!b || mode === 'edit') return; if (skillPick && giveSkill(world.units[+b.dataset.ally])) return; pickAlly(+b.dataset.ally, e.shiftKey); hud(); });""")
rep("""  if (k === 'escape' && mode !== 'edit'){ sel = new Set(); hud(); }""","""  if (k === 'escape' && mode !== 'edit'){ if (skillPick){ skillPick = null; hud(); return; } sel = new Set(); hud(); }""")
# rules rows
rep("""['ambushMul', '암살 (알아차리지 못한 옆 · 뒤 근접) 피해 ×', 0.25]].map(row).join('') + '</tbody>';""","""['ambushMul', '암살 (알아차리지 못한 옆 · 뒤 근접) 피해 ×', 0.25],
    ['bucketAuto', '치유 기술: 동료 체력이 이 비율 아래면 명령 없이도 씀', 0.05], ['skillReach', '치유 기술: 다른 명령 중에도 위급한 동료에게 달려가는 거리 (칸)', 0.5]].map(row).join('') + '</tbody>';""")
# editor: skill fields
rep("""    <div class="row"><label class="brush" for="selBold">대담함 (0~1)""","""    ${p.skill ? `<div class="row"><span class="brush">기술 <b>${esc(p.skill.name)}</b></span><label class="brush" for="skPool">총량 <input id="skPool" type="number" min="0" step="10" value="${p.skill.pool}"></label><label class="brush" for="skPer">한 번에 <input id="skPer" type="number" min="1" step="10" value="${p.skill.per}"></label></div>` : ''}
    <div class="row"><label class="brush" for="selBold">대담함 (0~1)""")
rep("""  if (e.target.id === 'selSmellG'){""","""  if (e.target.id === 'skPool' || e.target.id === 'skPer'){ const v = Math.max(e.target.id === 'skPer' ? 1 : 0, Math.round(+e.target.value || 0)); p.skill[e.target.id === 'skPool' ? 'pool' : 'per'] = v; changed(); return; }
  if (e.target.id === 'selSmellG'){""")
# help text
rep("""왼쪽 위 이야기 상자는 위아래로 올려 지난 일을 볼 수 있어요.""","""왼쪽 위 이야기 상자는 위아래로 올려 지난 일을 볼 수 있어요. 시선 부채꼴: 진한 앞 · 옅은 옆은 알아채고, 비어 있는 등 뒤는 못 알아채요 (암살은 거기서). 옐로를 고르고 '양동이 약' → 치유할 아군을 누르면 그 아군에게 가서 약을 부어요.""")
open('page10.tpl.html','w').write(s)
print('ok')
