import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.8.3 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.8.4 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.8.4: 보병 · 곡사 · 1층.
             · 근접 보병은 모두 돌진 (방패가 있든 없든 · 미드필더 · 지원도). 방패를 들면 '방패 돌진' — 달리는 동안에도 앞을 막고 더 세게 밀침 (더 안전).
             · 활의 곡사: 앞이 막히면 (동료 · 이쪽을 막는 방패 · 큰 몸 · 명령한 상대 앞의 다른 적) 높이 쏘아 넘김. 명중 ×0.7 · 피해 ×0.85 · 덜 꿰뚫음 · 머리 · 어깨로 떨어짐.
               쏜 순간 상대가 있던 자리로 떨어짐 (움직이면 피함) — 판에 떨어질 자리 (점선 고리) 가 보임. 든 방패는 어느 쪽이든 70% 막음 (무구 · 반사신경은 못 받음). 떨어질 둘레의 동료가 위험하면 안 쏨.
             · 모양: 동그라미 = 보병 (창병 · 방패병도), 네모 = 방어 전문 영웅 (전선 역할의 이름 있는 인물 — 동료 · 중간보스 이상). 방패를 든 인물은 앞 왼쪽에 방패 표시 (들면 초록 · 무너지면 붉게).
             · 레베카 = 장검 · 방패를 든 보병 (기본). 옛 판 · 내 설계의 레베카에도 방패를 쥐여 줌 (한 번).
             · 층 (저장한 기초 배치): 1층 = 궁수 g9 · h9 · i9 · 창병 g7 · i7 · 검방패기사 g6 · i6 · 곤봉적 h6 ↔ 카리우스 h3 · 레베카 i3 · 인주 h2 · 노먼 i2 (바위 · 벽 횃불 없음). 지금 배치를 층으로 저장할 수도 있음.
""",'notes')
rep('<span class="ver">v5.8.3 · 정체성 전수 고정 · 탭하면 기술 고리','<span class="ver">v5.8.4 · 보병 모두 돌진 · 활 곡사 · 1층 · 정체성 전수 고정 · 탭하면 기술 고리','ver')
rep("<footer>굴의 전투판 v5.8.3","<footer>굴의 전투판 v5.8.4",'footer')
rep("return `굴의 전투판 v5.8.3 · ${title}","return `굴의 전투판 v5.8.4 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.8.3\";","body.mob .top h1::after{content:\" v5.8.4\";",'mobver')

# ---- 레베카 = 장검 · 방패 보병
rep("  'C-002': { traits: ['불사', '재생'], shield: false, role: '공격수', weapon: '장검',",
    "  'C-002': { traits: ['불사', '재생'], shield: true, role: '공격수', weapon: '장검',",'pfReb')
rep("tactic: '선봉 · 불사', note: '훈련받은 기사 · 굴 생활이 김. 방어는 약하지만 쓰러져도 일어남 — 쓰러진 채 맞으면 (확인사살) 늦게 일어남' },\n  'C-006'",
    "tactic: '선봉 · 불사', note: '훈련받은 기사 · 굴 생활이 김. 장검과 방패를 든 보병 (v5.8.4). 쓰러져도 일어남 — 쓰러진 채 맞으면 (확인사살) 늦게 일어남' },\n  'C-006'",'pfRebNote')
rep("  { key: '레베카', side: 0, ref: 'C-002', name: '레베카', tier: 2, sm: 1, shield: false, role: '공격수',",
    "  { key: '레베카', side: 0, ref: 'C-002', name: '레베카', tier: 2, sm: 1, shield: true, role: '공격수',",'dsReb')
rep("tactic: '선봉 · 불사', note: '훈련받은 기사 · 굴 생활이 김. 방어는 약하지만 쓰러져도 일어남 — 쓰러진 채 맞으면 (확인사살) 늦게 일어남' },\n  { key: '카리우스'",
    "tactic: '선봉 · 불사', note: '훈련받은 기사 · 굴 생활이 김. 장검과 방패를 든 보병 (v5.8.4). 쓰러져도 일어남 — 쓰러진 채 맞으면 (확인사살) 늦게 일어남' },\n  { key: '카리우스'",'dsRebNote')
rep("  if (pf.shield === false) u.shield = false; if (pf.weapon)",
    "  if (pf.shield === false) u.shield = false; else if (pf.shield === true) u.shield = true; if (pf.weapon)",'applyShield')
rep("  if (d.shield === false && pf.shield === undefined) pf.shield = false;",
    "  if (typeof d.shield === 'boolean' && pf.shield === undefined) pf.shield = d.shield;",'mergeShield')
rep("if (!S.v571){ for (const u of S.units) fixRegen(u);",
"""// v5.8.4 레베카 = 장검 · 방패를 든 보병 (기본). 옛 판 · 내 설계의 방패 없는 레베카 → 방패를 쥐여 줌 (한 번만 — 그 뒤 빼는 건 자유)
const fixRebShield = p => { if (p.ref !== 'C-002' || p.shield) return false; p.shield = true; if (!p.weapon) p.weapon = '장검'; if (!p.role || p.role === '전선') p.role = '공격수'; return true; };
if (!S.v584){ let n = 0; for (const u of S.units) if (fixRebShield(u)) n++;
  try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixRebShield(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  S.v584 = true; setTimeout(() => { save(); if (n) toast('레베카에게 방패를 쥐여 줬어요 — 장검 · 방패를 든 보병이 기본'); }, 900); }
if (!S.v571){ for (const u of S.units) fixRegen(u);""",'migr')

# ---- 모양 · 방패 표시
rep("const shapeOf = u => u.role === '전선' ? 'sq' : u.role === '미드필더' ? 'tri' : u.role === '사수' ? 'pent' : 'circ';",
"""// v5.8.4 네모 = 방어 전문 영웅만 (전선 역할의 이름 있는 인물: 도감 '동료' · 중간보스 이상). 방패를 든 일반 병사 · 창병 · 곤봉 거한 같은 병사는 동그라미 (보병) — 방패는 방패 표시로
const heroOf = u => { const r = u.ref && RBY[u.ref]; return r ? r[2] === '동료' || (r[3] || 0) >= 4 : !!u.hero || (u.tier || 0) >= 4; };
const shapeOf = u => u.role === '전선' && heroOf(u) ? 'sq' : u.role === '미드필더' ? 'tri' : u.role === '사수' ? 'pent' : 'circ';
// v5.8.4 방패 표시: 앞 왼쪽 테두리에 똑바로 선 방패 (바라보는 쪽을 따라 돎). 막는 중 = 초록 · 자세 무너짐 = 붉게 · 그 밖 = 편 색 테두리
function shieldMark(x, y, r, fa, on, broke, sc){
  const a = fa - 0.85, s = Math.max(7, r * 0.56), cx = x + Math.cos(a) * r * 0.92, cy = y + Math.sin(a) * r * 0.92;
  ctx.save(); ctx.translate(cx, cy);
  ctx.beginPath(); ctx.moveTo(-s * 0.62, -s * 0.62); ctx.quadraticCurveTo(0, -s * 0.78, s * 0.62, -s * 0.62); ctx.lineTo(s * 0.6, s * 0.02); ctx.quadraticCurveTo(s * 0.48, s * 0.58, 0, s * 0.82); ctx.quadraticCurveTo(-s * 0.48, s * 0.58, -s * 0.6, s * 0.02); ctx.closePath();
  ctx.lineWidth = Math.max(3, s * 0.36); ctx.strokeStyle = 'rgba(8,6,10,.85)'; ctx.stroke();
  ctx.fillStyle = on ? '#bff0cc' : broke ? '#ffb4a0' : '#e9e3d6'; ctx.fill(); ctx.lineWidth = Math.max(1.4, s * 0.16); ctx.strokeStyle = on ? '#2f9a58' : broke ? '#c0283a' : sc; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.6); ctx.moveTo(-s * 0.42, -s * 0.12); ctx.lineTo(s * 0.42, -s * 0.12); ctx.strokeStyle = on ? 'rgba(30,110,60,.8)' : 'rgba(60,45,40,.6)'; ctx.lineWidth = Math.max(1, s * 0.11); ctx.stroke();
  ctx.restore();
}""",'shape')
rep("    shapePath(ctx, shp, px, py, r, sa); ctx.stroke(); ctx.setLineDash([]);\n    // v5.2 넘어짐 · 기어다님 · 밀려남 표시 (붉은 글씨, 이름 위)",
    "    shapePath(ctx, shp, px, py, r, sa); ctx.stroke(); ctx.setLineDash([]);\n    if (u.shield) shieldMark(px, py, r, u.face || 0, !ed && guardOn(Wd, u), !ed && Wd.t < u.brokenT, SIDEC[u.side]);   // v5.8.4 방패 표시\n    // v5.2 넘어짐 · 기어다님 · 밀려남 표시 (붉은 글씨, 이름 위)",'mark')
rep("      if (u.canGuard) iconShield(px + r * 0.82, py - r * 0.82, is,",
    "      if (u.canGuard && !u.shield) iconShield(px + r * 0.82, py - r * 0.82, is,",'iconSkip')
rep("<span><i class=\"ln\" style=\"color:#d8cfc0\">■</i>네모 탱크 · ▲ 세모 기동 · ⬟ 오각 사수 · ● 원 보병</span>",
    "<span><i class=\"ln\" style=\"color:#d8cfc0\">●</i>원 = 보병 (창병 · 방패병도) · ■ 네모 = 방어 전문 영웅 · ▲ 세모 기동 · ⬟ 오각 사수</span><span><i class=\"ln\" style=\"color:#e9e3d6\">⛉</i>앞 왼쪽 방패 표시 = 방패를 듦 (초록 = 막는 중)</span><span><i class=\"ln\" style=\"color:#ffb27a\">◌</i>점선 고리 = 곡사 화살이 떨어질 자리</span>",'legend')
rep("초상화 모양 = 역할 (네모 = 전선 · 탱크, 세모 = 미드필더 · 기동 (꼭짓점이 바라보는 쪽), 오각형 = 사수, 동그라미 = 보병)",
    "초상화 모양 = 역할 (동그라미 = 보병 — 창병 · 방패병도, 네모 = 방어 전문 영웅 (전선 역할의 이름 있는 인물), 세모 = 미드필더 · 기동 (꼭짓점이 바라보는 쪽), 오각형 = 사수. 방패를 든 인물은 앞 왼쪽에 방패 표시) · 점선 고리 = 곡사 화살이 떨어질 자리 (움직이면 피함)",'help')
rep("<span class=\"lb\">돌진</span> 보병 · 탱커 공통 기술 —",
    "<span class=\"lb\">돌진</span> 근접 보병 모두의 기술 (방패가 있든 없든) —",'chgTxt')
rep("    ${u.canGuard && known ? `<span class=\"tr\"><span class=\"lb\">방어</span> 막기 ${GM_SHORT",
    "    ${u.lob ? `<span class=\"tr\"><span class=\"lb\">곡사</span> 앞이 막히면 (동료 · 이쪽을 막는 방패 · 큰 몸 · 명령한 상대 앞의 다른 적) 높이 쏘아 넘김 — 명중 ×${(Wd.rules.arc || {}).aim || 0.7} · 피해 ×${(Wd.rules.arc || {}).mul || 0.85} · 쏜 순간 상대가 있던 자리로 떨어짐 (움직이면 피함) · 든 방패는 어느 쪽이든 ${Math.round(((Wd.rules.arc || {}).shield || 0.7) * 100)}% 막음 · ${(Wd.rules.arc || {}).min || 2}칸 넘게 떨어진 상대만</span>` : ''}\n    ${u.canGuard && known ? `<span class=\"tr\"><span class=\"lb\">방어</span> 막기 ${GM_SHORT",'lobTxt')

# ---- 곡사 화살 그리기
rep("""  if (!ed) for (const sh of Wd.shots || []){
    const tl = Math.min""",
"""  // v5.8.4 곡사: 그림자 (땅) · 포물선 위 화살 · 떨어질 자리 점선 고리 (움직이면 피함)
  if (!ed) for (const sh of Wd.shots || []){ if (!sh.arc) continue;
    const q = sh.q || 0, D = Math.hypot(sh.lx - sh.x0, sh.ly - sh.y0), Hm = Math.max(0.6, D * 0.32), hh = q2 => 4 * Hm * q2 * (1 - q2), gx = ox + sh.x * ts, gy = oy + sh.y * ts, ax = gx, ay = gy - hh(q) * ts;
    const q0 = Math.max(0, q - 0.08), bx = ox + (sh.x0 + (sh.lx - sh.x0) * q0) * ts, by = oy + (sh.y0 + (sh.ly - sh.y0) * q0) * ts - hh(q0) * ts, lx = ox + sh.lx * ts, ly = oy + sh.ly * ts;
    const c = sh.side ? '255,170,110' : '160,215,255';
    ctx.strokeStyle = `rgba(${c},${0.45 + 0.4 * q})`; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(lx, ly, Math.max(5, ts * (0.22 + 0.18 * (1 - q))), 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(gx, gy, 3, 1.6, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = `rgba(${c},.95)`; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ax, ay); ctx.stroke();
    ctx.fillStyle = '#fff4d6'; ctx.beginPath(); ctx.arc(ax, ay, 2.5, 0, 6.283); ctx.fill();
  }
  if (!ed) for (const sh of Wd.shots || []){ if (sh.arc) continue;
    const tl = Math.min""",'drawArc')

# ---- 서술 · 기록
rep("const MOOD_TAG = { '경계': '경계',", "const MOOD_TAG = { '곡사 · 동료 너머로': '곡사', '곡사 · 앞을 넘겨': '곡사', '경계': '경계',",'mood')
rep("      if (e.bash) return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} 방패를 앞세워",
    "      if (e.arc) return { c: a.side ? 'bad' : 'good', s: a.side ? `${ga(a.name)} 활을 높이 들어 ${b.name} 쪽으로 화살을 쏘아 올린다 — 떨어질 자리를 비켜라!` : `${ga(a.name)} 활을 높이 들어 ${e.why && /동료/.test(e.why) ? '동료 너머 ' : '앞을 넘겨 '}${b.name}에게 화살을 쏘아 올린다.` };   // v5.8.4 곡사\n      if (e.bash) return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} 방패를 앞세워",'narrWind')
rep("      if (e.bareArm) return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 맨팔로",
    "      if (e.arc && e.block) return { c: b.side === 0 ? 'good' : '', s: `${ga(b.name)} 방패를 머리 위로 들어 떨어지는 화살을 막는다 (−${e.dmg}).` };   // v5.8.4 곡사\n      if (e.arc && !e.vital && !e.ff) return { c: b.side === 0 ? 'bad' : 'good', s: `하늘에서 떨어진 ${a.name}의 화살이 ${b.name}의 ${e.part === '머리' ? '머리 위로' : e.part === '몸통' ? '어깨에' : e.part ? e.part + '에' : '몸에'} 꽂힌다${v}.${e.meant != null ? ` (${n(e.meant)}${jong(n(e.meant)) ? '을' : '를'} 노렸음)` : ''}` };\n      if (e.bareArm) return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 맨팔로",'narrHit')
rep("        if (e.jav) tags.push('투창 ×' + R.javelin.mul);",
    "        if (e.jav) tags.push('투창 ×' + R.javelin.mul);\n        if (e.arc) tags.push('곡사 ×' + ((R.arc || {}).mul || 0.85));   // v5.8.4",'logHit')
rep("      case 'hold': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.jav ? '던지려다' : '쏘려다'} 멈춤: ${n(e.by)} 사선에 들어옴 (오사 피함)",
    "      case 'hold': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.jav ? '던지려다' : '쏘려다'} 멈춤: ${n(e.by)} ${e.arc ? '떨어질 자리 곁에 있음' : '사선에 들어옴'} (오사 피함)",'logHold')

# ---- 층 (저장한 기초 배치)
rep("""            <button class="btn" id="scatterBtn" type="button">적 무리 다시 흩기</button>""",
"""            <button class="btn go" id="floor1Btn" type="button">1층 놓기</button>
            <button class="btn" id="scatterBtn" type="button">적 무리 다시 흩기</button>""",'floorBtn')
rep("""        <div class="box" id="designBox"></div>""",
"""        <div class="box" id="designBox"></div>
        <div class="box" id="floorBox"></div>""",'floorBox')
rep("// 아군은 시작 자리 둘레로, 적은 무리째 멀리. torches = 벽 횃불도 다시\nfunction placeAll(",
"""// v5.8.4 층 (저장한 기초 배치): 코드에 든 1층 + 이 브라우저에 저장한 층. 누르면 그 배치 (맵 · 바위 · 벽 횃불 · 인물 자리) 를 그대로 놓음
const FLOOR_LS = 'gul-battle-floors';
const FLOOR_DEFAULTS = [{ name: '1층', note: '격자 14×10 · 바위 · 벽 횃불 없음 · 맞붙기까지 두 칸', torches: 0,
  put: [['인주', 'h2'], ['노먼', 'i2'], ['카리우스', 'h3'], ['레베카', 'i3'], ['검방패기사', 'g6'], ['곤봉적', 'h6'], ['검방패기사', 'i6'], ['창병', 'g7'], ['창병', 'i7'], ['궁수', 'g9'], ['궁수', 'h9'], ['궁수', 'i9']] }];
function myFloors(){ try { const L = JSON.parse(localStorage.getItem(FLOOR_LS) || '[]'); return Array.isArray(L) ? L : []; } catch (e) { return []; } }
function saveMyFloors(L){ try { localStorage.setItem(FLOOR_LS, JSON.stringify(L)); return true; } catch (e) { toast('이 브라우저에 저장하지 못했어요'); return false; } }
function floorList(){ const mine = myFloors(); return [...FLOOR_DEFAULTS.filter(d => !mine.some(m => m.name === d.name)).map(d => ({ ...d, code: true })), ...mine.map(m => ({ ...m, mine: true, over: FLOOR_DEFAULTS.some(d => d.name === m.name) }))]; }
function floorSetup(f){
  if (f.snap) return clone(f.snap);   // 저장한 층: 그때 배치 그대로
  const L = { type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], draft: { cands: newDraft().cands, picks: ['C-007', 'C-002', 'C-003'], done: true } };
  for (const [k, c] of f.put){ const d = designByKey(k); if (d) L.units.push({ ...fromDesign(d, d.side), ...at(L, c) }); }
  L.torches = f.torches ? autoTorches(buildMap(L), L.seed, f.torches) : [];
  return L;
}
function placeFloor(name){
  const f = floorList().find(x => x.name === name); if (!f) return;
  const L = floorSetup(f);
  Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: L.mapC !== false, seed: L.seed, flips: L.flips || [], units: L.units.map(u => ({ ...u, id: uid() })), torches: L.torches || [], draft: L.draft || S.draft });
  selId = null; renderDraft(); rebuildMap(); setMapUI(); changed(); centerStart(); hud(); renderFloors();
  toast(f.put ? `${f.name}: ${f.put.map(([k, c]) => k + ' ' + c).join(' · ')}` : `${f.name}: 저장한 배치 그대로 놓았어요`);
}
function renderFloors(){
  const box = $('floorBox'); if (!box) return;
  box.innerHTML = `<p class="lab">층 · 저장한 기초 배치</p><p class="note">누르면 그 배치를 그대로 놓아요 (맵 · 바위 · 벽 횃불 · 인물 자리). '지금 배치를 층으로 저장' 은 이 브라우저에 남아요.</p>
    <div class="row">${floorList().map(f => `<button class="btn ${f.code ? 'go' : ''}" type="button" data-floor="${esc(f.name)}" title="${esc(f.note || '')}">${esc(f.name)}${f.mine ? ' <i title="저장한 층">●</i>' : ''}</button>${f.mine ? `<button class="btn sm" type="button" data-fdel="${esc(f.name)}">${f.over ? '기본으로' : '지우기'}</button>` : ''}`).join('')}
    <button class="btn" type="button" id="floorSave">지금 배치를 층으로 저장</button></div>`;
}
$('floorBox').addEventListener('click', e => {
  const b = e.target.closest('[data-floor]'), del = e.target.closest('[data-fdel]');
  if (del){ const k = del.dataset.fdel; saveMyFloors(myFloors().filter(f => f.name !== k)); renderFloors(); toast(`'${k}' 를 ${FLOOR_DEFAULTS.some(d => d.name === k) ? '기본으로 되돌렸어요' : '지웠어요'}`); return; }
  if (b){ if (mode !== 'edit'){ toast('⟲ 배치로를 누른 뒤에 놓을 수 있어요'); return; } placeFloor(b.dataset.floor); return; }
  if (e.target.id === 'floorSave'){
    const L = floorList(); let k = 1; while (L.some(f => f.name === k + '층')) k++;
    const name = (prompt('층 이름 (같은 이름이면 덮어써요)', k + '층') || '').trim(); if (!name) return;
    const snap = clone({ type: S.type, W: S.W, H: S.H, mapC: S.mapC, seed: S.seed, flips: S.flips || [], units: S.units, torches: S.torches || [], draft: S.draft });
    const mine = myFloors().filter(f => f.name !== name); mine.push({ name, note: `${S.units.filter(u => u.side === 0).length} 대 ${S.units.filter(u => u.side === 1).length} · ${new Date().toLocaleDateString()}`, snap });
    if (saveMyFloors(mine)){ renderFloors(); toast(`지금 배치를 '${name}' 으로 저장했어요`); }
  }
});
$('floor1Btn').addEventListener('click', () => { if (mode !== 'edit'){ toast('⟲ 배치로를 누른 뒤에 놓을 수 있어요'); return; } placeFloor('1층'); });
// 아군은 시작 자리 둘레로, 적은 무리째 멀리. torches = 벽 횃불도 다시
function placeAll(""",'floorFns')
rep("renderDraft(); renderChips(); renderRoster(); renderDesigns(); setSide(1);",
    "renderDraft(); renderChips(); renderRoster(); renderDesigns(); renderFloors(); setSide(1);",'initFloors')
# 모바일 메뉴: 층
rep("""    <p class="lab">그 밖</p><div class="mrow"><button class="db" data-dm="fs">""",
"""    <p class="lab">층 (기초 배치 — 지금 판을 접고 그 배치로)</p><div class="mrow">${floorList().map(f => `<button class="db" data-dm="floor" data-v="${esc(f.name)}">▦<small>${esc(f.name)}</small></button>`).join('')}</div>
    <p class="lab">그 밖</p><div class="mrow"><button class="db" data-dm="fs">""",'mobFloor')
rep("  else if (k === 'reset'){ toggleMenu(false); resetToEdit(); return; }",
    "  else if (k === 'reset'){ toggleMenu(false); resetToEdit(); return; }\n  else if (k === 'floor'){ toggleMenu(false); if (mode !== 'edit') resetToEdit(); placeFloor(b.dataset.v); return; }   // v5.8.4",'mobFloorH')
open(P,'w').write(s); print('ok')
