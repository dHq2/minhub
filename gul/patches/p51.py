import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
def rep(o,n,c=1):
    global s
    k=s.count(o)
    if k!=c: print('MISMATCH',k,o[:100]); sys.exit(1)
    s=s.replace(o,n)

# ---------- 버전 ----------
rep("<!-- 굴의 전투판 v5.0 (2026-10-11)","<!-- 굴의 전투판 v5.1 (2026-10-11)")
rep("     v5.0: 역할 (포지션)","""     v5.1: 기본 판 (인주 · 노먼 · 레베카 · 카리우스 ↔ 검방패기사 · 창병 · 궁수 · 검기사 · 곤봉적) · 설계 칸 · 방어구 · 명령 취소 · 우클릭 지우기.
           설계 칸: 자주 쓰는 인물 (기본 적 다섯 · 기본 아군 넷) 을 칸에 두고 붓으로 놓음. 고른 인물을 칸에 저장 (덮어쓰기) · 칸 지우기 · JSON 복사 · 붙여넣기.
           별 (★) 은 희귀도: 동료 · 펫의 별은 강함이 아님 — 새로 놓는 동료는 전투 등급 2 (중몹) 로 시작 (설계 칸 인물은 따로 정함).
           방어구: 몸 · 머리 칸 (재질 판금 · 사슬 · 가죽 · 경갑 · 방탄 · 투구 × 등급 1~5). 등급이 오르면 더 막고 무게만큼 느려짐 (같은 칸은 바뀜 — 노먼 방탄복 2성 → 갑주 5성).
           판 위 아이콘 (갑옷 · 투구 + 등급). 갑옷 · 투구는 날붙이에 강하고 둔기에 조금 강함. [갑피] = 피부가 갑옷 + 투구.
           굴의 생물 · 낙하자는 곰처럼 단단함: 총포류 피해 ×0.6 ([일반인] = 일반 인간계 사람만 그대로). 총이 만능은 아님.
           소총 (탄 120 · 탄창 30 · 재장전 2.5초 · 점사 2발, 10% 는 6발 "드르르륵!"). 인물마다 탄약을 정할 수 있음 (궁수 화살 40).
           [불사] (레베카): 쓰러져도 8초 뒤 30% 로 일어남 · 초당 2.5% 재생 · 상처가 남지 않음. 구급상자 (노먼 응급처치 5번 · 40% · 5초 대기, 쓰러진 [불사] 는 일으킴).
           [거구] (카리우스 3M): 몸이 큼 · 키 차이 1M 이상이면 그 너머가 안 보임 (아군 · 적 모두, 0.5~1M 는 일부, 조금 돌면 보임). [돌진]: 1.5~5칸 앞으로 들이받음.
           [개조된 신체]: 받는 피해 ×0.7 · 움찔 절반. [도약] (궁수): 근접이 오면 뒤로 뛰어 거리를 벌림. 야시 C (2.5칸) 추가. 키 (m) 를 인물마다.
           명령 취소: X (또는 Backspace) · '명령 취소' 단추 · 카드의 ✕ · 아군 위 오른쪽 클릭. 배치에서는 오른쪽 클릭으로 바로 지움.
     v5.0: 역할 (포지션)""")
for o,n in [('<span class="ver">v5.0 ·','<span class="ver">v5.1 ·'),("<footer>굴의 전투판 v5.0 —","<footer>굴의 전투판 v5.1 —"),("return `굴의 전투판 v5.0 ·","return `굴의 전투판 v5.1 ·"),("copyText('굴의 전투판 v5.0 자동 판 기록","copyText('굴의 전투판 v5.1 자동 판 기록")]: rep(o,n)

# ---------- 특성 설명 ----------
rep("""  '방패': '방어 자세: 앞에서 오는 공격을 막음""","""  '불사': '쓰러져도 몇 초 뒤 일어남 (체력 30%) · 싸우는 중에도 조금씩 재생 · 상처 (팔 · 다리) 가 남지 않음. 구급상자로 바로 일으킬 수 있음',
  '갑피': '피부가 갑옷 + 투구: 장비 없이도 몸 칸 판금 · 머리 칸 투구 (3성) 를 입은 것과 같음 · 무게 없음 (더 좋은 장비를 입으면 그 칸은 장비)',
  '개조된 신체': '받는 피해 ×0.7 · 맞고 움찔하는 시간 절반',
  '거구': '몸이 큼 (×1.3). 키 차이가 1M 넘는 쪽은 이 몸 너머를 못 봄 (아군 · 적 모두) — 조금 돌면 보임',
  '돌진': '1.5 ~ 5칸 앞의 상대에게 곧게 돌진해 들이받음 (방패 자세를 크게 깎고 밀침 · 움찔 · 준비를 끊음). 8초마다',
  '도약': '근접 상대가 2칸 안으로 오면 뒤로 뛰어 단숨에 거리를 벌림 (1.1초마다)',
  '일반인': '일반 인간계 사람 — 굴의 생물 · 낙하자처럼 단단하지 않음 (총에 맞으면 그대로 다침)',
  '방패': '방어 자세: 앞에서 오는 공격을 막음""")

# ---------- 별 = 희귀도 · 설계 칸 ----------
rep("""function unitFromRef0(ref, side, extra){ const r = RBY[ref]; return { id: uid(), ref, name: r[1], tier: r[3] || 1,""",
"""function unitFromRef0(ref, side, extra){ const r = RBY[ref]; return { id: uid(), ref, name: r[1], tier: ALLY(r[2]) ? 2 : r[3] || 1,   // v5.1 동료 · 펫의 별은 희귀도 — 강함은 중몹 (2) 부터""")
rep("""const isGrid = t => t === 'grid' || t === 'gridC';""","""/* ---------- v5.1 설계 칸: 자주 쓰는 인물 (기본 적 · 기본 아군). 코드의 기본값 + 이 브라우저에 저장한 것 (같은 이름이면 저장한 쪽) ---------- */
const KIT = { name: '응급처치', kit: true, pool: 5, pct: 0.4, cd: 5, wind: 0.85, rec: 0.3, rng: 0.8, auto: 0.5 };
const DESIGN_DEFAULTS = [
  { key: '인주', side: 0, ref: 'C-001', name: '인주', tier: 2, hero: true, weapon: '어부의 창', height: 1.6, nv: true, nvG: 'C', traits: ['일반인'], tactic: '주인공 · 어부의 창', note: '가장 최근에 떨어진 일반 인간계 사람. 횃불을 듦' },
  { key: '노먼', side: 0, ref: 'C-007', name: '노먼', tier: 2, cls: '기동', role: '사수', weapon: '소총', bold: 0.5, height: 1.8, nv: true, nvG: 'A', gear: { 몸: { name: '방탄복', mat: '방탄', tier: 2 } }, skill: KIT, tactic: '기동 소총사수 · 응급처치', note: '베테랑 정규군. 점사 · 재장전 · 구급상자 (다친 동료 50% 아래면 스스로)' },
  { key: '레베카', side: 0, ref: 'C-002', name: '레베카', tier: 2, sm: 1, height: 1.6, nv: true, nvG: 'A', traits: ['불사'], gear: { 몸: { name: '낡은 판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '기사 투구', mat: '투구', tier: 3 } }, tactic: '버티기 탱커 · 불사', note: '훈련받은 기사 · 굴 생활이 김. 쓰러져도 일어남' },
  { key: '카리우스', side: 0, ref: 'C-003', name: '카리우스', tier: 2, sm: 0.75, height: 3, nv: true, nvG: 'B', ov: { hp: 450, atk: 40 }, traits: ['갑피', '괴력A', '거구', '돌진', '개조된 신체'], tactic: '느린 거구 탱커 · 돌진', note: '높은 체력 · 높은 방어. 평소엔 느리지만 돌진으로 전선에 충격을 주며 들어감. 몸이 방패 · 3M 몸이 시야를 가림' },
  { key: '검방패기사', side: 1, ref: 'C-054', name: '검방패기사', tier: 2, height: 2.1, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 2 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 1 } }, tactic: '방패벽 (적 탱커)', note: '무리 앞에 방패를 세우고 버티다가 분명히 유리하면 밀고 나옴' },
  { key: '창병', side: 1, ref: 'C-053', name: '창병', tier: 2, height: 2.0, traits: ['공통스킬:투창'], gear: { 몸: { name: '사슬 갑옷', mat: '사슬', tier: 2 } }, tactic: '투창', note: '방패 뒤에서 기다리다 확실할 때 창을 던짐' },
  { key: '궁수', side: 1, ref: 'C-056', name: '궁수', tier: 2, sm: 1.25, role: '사수', ammo: 40, height: 1.9, traits: ['도약'], gear: { 몸: { name: '전신 경갑옷', mat: '경갑', tier: 2 }, 머리: { name: '경갑 투구', mat: '투구', tier: 2 } }, tactic: '기동 사수 · 도약', note: '뒤로 뛰며 단숨에 거리를 벌리는 재빠른 궁수. 화살 넉넉히 (40). 쏘는 상대 · 사수부터' },
  { key: '검기사', side: 1, ref: 'C-052', name: '검기사', tier: 2, height: 2.2, tac: '', gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 2 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 1 } }, tactic: '검기사', note: '' },
  { key: '곤봉적', side: 1, ref: 'C-055', name: '곤봉적', tier: 3, height: 2.5, traits: ['거구'], gear: { 몸: { name: '두꺼운 판금', mat: '판금', tier: 3 } }, tactic: '거구 근육질', note: '2M50 거구. 둔기' },
];
const DLS = 'gul-battle-designs';
function myDesigns(){ try { const o = JSON.parse(localStorage.getItem(DLS) || 'null'); return o && Array.isArray(o.list) ? o.list : []; } catch (e) { return []; } }
function saveMyDesigns(list){ try { localStorage.setItem(DLS, JSON.stringify({ v: 1, list })); return true; } catch (e) { toast('이 브라우저에 저장하지 못했어요 (설계 복사로 따로 보관하세요)'); return false; } }
function designList(){ const mine = myDesigns(), keys = new Set(mine.map(d => d.key)); return [...DESIGN_DEFAULTS.filter(d => !keys.has(d.key)).map(d => ({ ...d, base: true })), ...mine.map(d => ({ ...d, mine: true, over: DESIGN_DEFAULTS.some(b => b.key === d.key) }))]; }
const designByKey = k => designList().find(d => d.key === k);
// 설계 → 놓을 인물 (도감 기본값 위에 설계를 덮음, 프로필은 다시 안 씌움)
const DKEEP = ['name', 'tier', 'cls', 'sm', 'shield', 'weapon', 'nv', 'nvG', 'hero', 'ov', 'traits', 'gear', 'role', 'bold', 'height', 'ammo', 'skill', 'tac', 'tactic', 'note', 'race', 'origin', 'unique', 'am', 'smellG', 'bladeHands', 'noRanged'];
function fromDesign(d, side){
  const r = d.ref ? RBY[d.ref] : null, sd = side != null ? side : d.side || 0;
  const u = { id: uid(), ref: d.ref || null, name: r ? r[1] : d.name, tier: r ? (r[3] || 1) : 1, cls: r ? r[4] : '근접', sm: r ? r[9] || 1 : 1, shield: r ? !!r[10] : false, weapon: r ? r[11] || '' : '', side: sd, x: 0, y: 0, nv: sd === 1, nvG: sd === 1 ? 'B' : '', hero: false, ov: {}, grp: uid(), traits: [] };
  for (const k of DKEEP) if (d[k] !== undefined) u[k] = clone(d[k]);
  if (sd !== 0) u.hero = false;
  if (u.skill) u.skill = clone(u.skill);
  return u;
}
function designFromUnit(p){ const d = { key: p.name, side: p.side, ref: p.ref || null }; for (const k of DKEEP) if (p[k] !== undefined && k !== 'hero') d[k] = clone(p[k]); if (p.hero) d.hero = true; return d; }
const isGrid = t => t === 'grid' || t === 'gridC';""")

# 기본 판
rep("""// 아군은 시작 자리 둘레로, 적은 무리째 멀리.""","""// v5.1 기본 판: 인주 h2 · 노먼 g2 · 레베카 h3 · 카리우스 i3 ↔ 검방패기사 h8 · 창병 g9 · 곤봉적 i8 · 검기사 f8 · 궁수 h10
function exampleBase(){
  const S = { v: 3, v4: true, v41: true, v42: true, v43: true, v44: true, v46: true, v47: true, v50: true, v51: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: { cands: newDraft().cands, picks: ['C-007', 'C-002', 'C-003'], done: true } };
  const put = (k, c) => { const d = designByKey(k); if (d) S.units.push({ ...fromDesign(d, d.side), ...at(S, c) }); };
  put('인주', 'h2'); put('노먼', 'g2'); put('레베카', 'h3'); put('카리우스', 'i3');
  put('검방패기사', 'h8'); put('창병', 'g9'); put('곤봉적', 'i8'); put('검기사', 'f8'); put('궁수', 'h10');
  S.torches = autoTorches(buildMap(S), S.seed, Math.round(S.W * S.H / 420));
  return S;
}
// 아군은 시작 자리 둘레로, 적은 무리째 멀리.""")
rep("""function example(){
  const S = {""","""function example(){
  return exampleBase();
}
function exampleDraft(){
  const S = {""")
# 이주
rep("""// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)""","""// v5.1: 새 무기 (소총 · 어부의 창) · 활 화살 12 → 30
if (!S.v51){ for (const w in DEFAULT_RULES.weapons) if (!S.rules.weapons[w]) S.rules.weapons[w] = clone(DEFAULT_RULES.weapons[w]); if (S.rules.weapons['활'] && S.rules.weapons['활'].ammo === 12) S.rules.weapons['활'].ammo = 30; S.v51 = true; }
// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)""")

# ---------- 설계 칸 UI ----------
rep("""        <div class="selbox" id="selBox" hidden></div>""","""        <div class="selbox" id="selBox" hidden></div>
        <div class="box" id="designBox"></div>""")
rep("""            <button class="btn" id="lineExBtn" type="button">사선 예제 놓기</button>""","""            <button class="btn go" id="baseExBtn" type="button">기본 판 놓기</button>
            <button class="btn" id="lineExBtn" type="button">사선 예제 놓기</button>""")
rep("""$('shieldExBtn').addEventListener('click', () => {""","""$('baseExBtn').addEventListener('click', () => {
  if (mode !== 'edit'){ toast('⟲ 배치로를 누른 뒤에 놓을 수 있어요'); return; }
  const L = exampleBase();
  Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: true, seed: L.seed, flips: [], units: L.units, torches: L.torches, draft: L.draft });
  selId = null; renderDraft(); rebuildMap(); setMapUI(); changed(); centerStart(); hud();
  toast('기본 판: 인주 · 노먼 · 레베카 · 카리우스 ↔ 검방패기사 · 창병 · 곤봉적 · 검기사 · 궁수');
});
/* ---------- 설계 칸 ---------- */
const MAT_IC = { '판금': '#d8dde6', '사슬': '#aab2bd', '가죽': '#c89a6a', '경갑': '#9cc3e6', '방탄': '#a7b878', '투구': '#d8dde6' };
function gearShort(g){ return GEAR_SLOTS.filter(k => g && g[k]).map(k => `${g[k].name} ${g[k].tier}성`).join(' · '); }
function renderDesigns(){
  const L = designList();
  $('designBox').innerHTML = `<p class="lab">설계 칸 · 자주 쓰는 인물 (기본 적 · 기본 아군)</p>
    <p class="note">누르면 붓이 돼요 (판에 놓기). 인물을 고르고 '설계 칸에 저장' 을 누르면 같은 이름 칸을 덮어써요. 이 브라우저에 저장돼요 — 옮기거나 남기려면 '설계 복사'.</p>
    <div class="dgrid">${L.map(d => { const r = d.ref ? RBY[d.ref] : null, on = brush && brush.design === d.key;
      return `<div class="dsl ${on ? 'on' : ''} ${d.side ? 'f' : 'a'}"><button type="button" class="dc" data-dsg="${esc(d.key)}" aria-pressed="${on}"><span class="fc" style="${r ? faceCss(r[8], 36) : ''}"></span><span class="n">${esc(d.key)}${d.mine ? ' <i title="저장한 설계">●</i>' : ''}</span>
        <span class="m">${d.side ? '적' : '아군'} · ${esc(TNAME[d.tier] || '')} · ${esc(d.weapon || (r ? r[11] : '') || '')}${d.role ? ' · ' + esc(d.role) : ''}${d.height ? ' · ' + d.height + 'm' : ''}</span>
        ${d.gear && Object.keys(d.gear).length ? `<span class="m">${esc(gearShort(d.gear))}</span>` : ''}${(d.traits || []).length ? `<span class="m">${esc(d.traits.map(t => '[' + t + ']').join(' '))}</span>` : ''}</button>
        ${d.mine ? `<button type="button" class="btn sm" data-ddel="${esc(d.key)}" title="${d.over ? '저장한 것을 지우고 코드 기본값으로' : '이 칸 지우기'}">${d.over ? '기본으로' : '지우기'}</button>` : ''}</div>`; }).join('')}</div>
    <div class="row"><button class="btn" type="button" id="dsgPlaceFoes">기본 적 무리 놓기</button><button class="btn" type="button" id="dsgCopy">설계 복사 (JSON)</button><button class="btn" type="button" id="dsgPaste">붙여넣기로 불러오기</button></div>`;
}
$('designBox').addEventListener('click', e => {
  const b = e.target.closest('[data-dsg]'), del = e.target.closest('[data-ddel]');
  if (del){ const k = del.dataset.ddel; saveMyDesigns(myDesigns().filter(d => d.key !== k)); if (brush && brush.design === k) brush = null; renderDesigns(); renderBrush(); toast(`'${k}' 칸을 ${DESIGN_DEFAULTS.some(d => d.key === k) ? '기본값으로 되돌렸어요' : '지웠어요'}`); return; }
  if (b){ const d = designByKey(b.dataset.dsg); if (!d) return; setSide(d.side || 0); brush = { design: d.key, name: d.key, tier: d.tier, cls: d.cls }; setTool('brush'); renderRoster(); renderDesigns(); return; }
  if (e.target.id === 'dsgPlaceFoes'){
    if (mode !== 'edit'){ toast('⟲ 배치로를 누른 뒤에 놓을 수 있어요'); return; }
    S.units = S.units.filter(u => u.side !== 1);
    const gid = uid(); for (const k of ['검방패기사', '창병', '곤봉적', '검기사', '궁수']){ const d = designByKey(k); if (d) S.units.push({ ...fromDesign(d, 1), grp: gid }); }
    placeAll(S, false, true); changed(); toast('기본 적 다섯을 한 무리로 놓았어요'); return;
  }
  if (e.target.id === 'dsgCopy'){ copyText(JSON.stringify({ v: 1, list: myDesigns().length ? myDesigns() : DESIGN_DEFAULTS }, null, 1), '설계를 복사했어요'); return; }
  if (e.target.id === 'dsgPaste'){
    const t = prompt('설계 JSON 을 붙여넣으세요 (설계 복사로 얻은 글)'); if (!t) return;
    try { const o = JSON.parse(t), L = Array.isArray(o) ? o : o.list; if (!Array.isArray(L)) throw 0;
      const mine = myDesigns(); for (const d of L){ if (!d || !d.key) continue; const i = mine.findIndex(x => x.key === d.key); if (i >= 0) mine[i] = d; else mine.push(d); }
      if (saveMyDesigns(mine)){ renderDesigns(); toast(`설계 ${L.length}개를 불러왔어요`); }
    } catch (err) { toast('읽을 수 없는 글이에요'); }
  }
});
$('shieldExBtn').addEventListener('click', () => {""")
# 붓: 설계로 놓기
rep("""    const u = brush.ref ? Object.assign(unitFromRef(brush.ref, sideNow), { x: tx, y: ty }) :""","""    const u = brush.design && designByKey(brush.design) ? Object.assign(fromDesign(designByKey(brush.design), sideNow), { x: tx, y: ty }) : brush.ref ? Object.assign(unitFromRef(brush.ref, sideNow), { x: tx, y: ty }) :""")
rep("""  brush = { ref: r[0], name: r[1], tier: r[3] || 1, cls: r[4] }; setTool('brush'); renderRoster();""","""  brush = { ref: r[0], name: r[1], tier: r[3] || 1, cls: r[4] }; setTool('brush'); renderRoster(); renderDesigns();""")

# ---------- 배치: 오른쪽 클릭 = 지우기 ----------
rep("""  if (mode === 'edit') editClick(w); else if (d.right) rightClick(w); else playClick(w, e.shiftKey);""","""  if (mode === 'edit'){ if (d.right) editErase(w); else editClick(w); } else if (d.right) rightClick(w); else playClick(w, e.shiftKey);""")
rep("""  if (tool === 'erase'){
    const u = unitAt(preview, w.x, w.y, true);
    if (u){ S.units = S.units.filter(x => x.id !== u.pid); if (selId === u.pid) selId = null; changed(); return; }
    const ti = S.torches.findIndex(t => Math.hypot(t.x - w.x, t.y - w.y) < 0.8);
    if (ti >= 0){ S.torches.splice(ti, 1); changed(); }
    return;
  }""","""  if (tool === 'erase'){ editErase(w); return; }""")
rep("""function editClick(w){""","""// 지우기 (지우개 도구 · 배치 중 오른쪽 클릭): 인물, 없으면 횃불
function editErase(w){
  const u = unitAt(preview, w.x, w.y, true);
  if (u){ const p = S.units.find(x => x.id === u.pid); S.units = S.units.filter(x => x.id !== u.pid); if (selId === u.pid) selId = null; changed(); if (p) toast(`${p.name} 뺌`); return; }
  const ti = S.torches.findIndex(t => Math.hypot(t.x - w.x, t.y - w.y) < 0.8);
  if (ti >= 0){ S.torches.splice(ti, 1); changed(); toast('횃불 뺌'); }
}
function editClick(w){""")

# ---------- 명령 취소 ----------
rep("""  if (k === 'auto'){ L.forEach(u => { u.order = null; u.stay = null; }); noteOrders(L); }   // 자리를 풀고 주인공을 따라감""",
"""  if (k === 'auto'){ L.forEach(u => { u.order = null; u.stay = null; }); noteOrders(L); }   // 자리를 풀고 주인공을 따라감
  else if (k === 'cancel'){ cancelOrders(L); }""")
rep("""function giveAttack(t){""","""// v5.1 명령 취소: 준 명령을 거둠 (명령이 없으면 지키던 자리도 풂) → 스스로 판단
function cancelOrders(L){
  const C = L.filter(u => u.order || u.stay); if (!C.length){ toast('취소할 명령이 없어요'); return; }
  C.forEach(u => { if (u.order){ u.order = null; } else u.stay = null; });
  throwPick = null; skillPick = null; noteOrders(C); toast(`${C.map(u => u.name).join(' · ')} 명령 취소 — 스스로 판단`); hud();
}
function giveAttack(t){""")
rep("""<button class="btn" type="button" data-ord="hold">제자리 <kbd>H</kbd></button>""","""<button class="btn" type="button" data-ord="hold">제자리 <kbd>H</kbd></button><button class="btn" type="button" data-ord="cancel" title="준 명령을 거둠 (명령이 없으면 지키던 자리도 풂)">명령 취소 <kbd>X</kbd></button>""")
rep("""const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick', r: 'throw' }[k]; if (m){ e.preventDefault(); ordKey(m); } }""","""const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick', r: 'throw', x: 'cancel', backspace: 'cancel', delete: 'cancel' }[k]; if (m){ e.preventDefault(); ordKey(m); } }
  if (mode === 'edit' && (k === 'delete' || k === 'backspace') && selId){ e.preventDefault(); const p = S.units.find(x => x.id === selId); S.units = S.units.filter(x => x.id !== selId); selId = null; changed(); if (p) toast(`${p.name} 뺌`); }""")
rep("""    toast('아군 위 오른쪽 클릭은 약을 가진 아군 (옐로) 을 골랐을 때 약 쓰기예요'); return;""","""    if (u.order || u.stay){ cancelOrders([u]); return; }   // v5.1 아군 위 오른쪽 클릭 = 그 아군 명령 취소
    toast('아군 위 오른쪽 클릭: 약 · 구급상자를 가진 아군을 골랐으면 치유, 아니면 그 아군의 명령 취소'); return;""")
rep("""$('party').addEventListener('click', e => { const b = e.target.closest('[data-ally]');""","""$('party').addEventListener('click', e => { const xc = e.target.closest('[data-cancel]'); if (xc && world && mode !== 'edit'){ e.stopPropagation(); cancelOrders([world.units[+xc.dataset.cancel]]); return; } const b = e.target.closest('[data-ally]');""")
rep("""      <span class="st">${Math.ceil(u.hp)}/${u.max}${gearTxt(Wd, u)}${ed ? '' : ' · 명령 ' + orderLabel(Wd, ordOf(u))}</span>""",
"""      <span class="st">${Math.ceil(u.hp)}/${u.max}${gearTxt(Wd, u)}${ed ? '' : ' · 명령 ' + orderLabel(Wd, ordOf(u))}${!ed && u.alive && (u.order || u.stay) ? ` <span class="xo" data-cancel="${u.i}" title="명령 취소 (X)">✕</span>` : ''}</span>""")
rep("""    const what = !u.alive ? '쓰러짐' : ed ?""","""    const what = u.down ? `쓰러짐 — [불사] ${f2(Math.max(0, u.riseT - Wd.t))}초 뒤 일어남` : !u.alive ? '쓰러짐' : ed ?""")

open(p,'w',encoding='utf-8').write(s)
print('ok part1')
