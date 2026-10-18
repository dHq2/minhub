import sys, re
P='page10.tpl.html'
s=open(P,encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('MISMATCH',c,a[:140]); sys.exit(1)
    s=s.replace(a,b)

# ---------- 판 · 머리말 ----------
rep("""<!-- 굴의 전투판 v5.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.""",
"""<!-- 굴의 전투판 v5.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.2: 몸으로 싸우기. 왼쪽 클릭 = 공격 (적 = 공격 · 바닥 = 공격 이동), 오른쪽 클릭 = 이동. F = 액티브 스킬 (돌진 · 도약), V = 거구 휘두르기 (자동 · 넓게 · 찍기).
           ◆[개조된 신체] (카리우스 고유특성: 거구 · 갑피 · 괴력A 파생). 무게 · 밀침 · 벽에 짓뭉개짐 · 넘어짐 · 기어다님 (다리 불구) · 치명타 · 짓밟기 (확인사살).
           거구 = 중전차 (몸이 방패 — 동료를 가리고 지킴), 넓게 휘두르기 (동료도 맞음) · 찍기. 방패 밀치기 · 피하기 · 발놀림 · 벽을 등짐. 적의 조 나누기 · 떼어 내기 · [불사] 눌러 두기.
           초상화 모양 = 역할 (전선 네모 · 미드필더 세모 · 사수 오각형 · 보병 동그라미, 바라보는 쪽으로 돎 · 넘어지면 눕힘). 화살 · 투창 관통 · 총은 안정적.""")
rep("""<span class="ver">v5.1 · 한 턴씩""", """<span class="ver">v5.2 · 몸으로 싸우기 · 한 턴씩""")
rep("""<footer>굴의 전투판 v5.1 —""", """<footer>굴의 전투판 v5.2 —""")
rep("""  return `굴의 전투판 v5.1 · ${title}""", """  return `굴의 전투판 v5.2 · ${title}""")
rep("""copyText('굴의 전투판 v5.1 자동 판 기록""", """copyText('굴의 전투판 v5.2 자동 판 기록""")
rep("""<p class="lab">몸 · 기술 (v5.1) — 단단함 · 불사 · 거구 · 돌진 · 도약 · 개조된 신체</p>""", """<p class="lab">몸 · 기술 (v5.2) — 단단함 · 불사 · 거구 · 돌진 · 도약 · 개조된 신체 · 무게 · 밀침 · 넘어짐 · 치명 · 휘두르기 · 피하기</p>""")

# 조작 설명
m=re.search(r'<p class="keys">아군을 고르고 \(왼쪽 클릭 · 끌어 네모 · 숫자키\).*?</p>', s, re.S)
assert m
s=s.replace(m.group(0), """<p class="keys">아군을 고르고 (아군 왼쪽 클릭 · 끌어 네모 · 숫자키) → <b>왼쪽 클릭 = 공격</b> (적 = 그 적을 공격 · 바닥 = 공격 이동: 가는 길의 적과 싸우며 그 칸으로) · <b>오른쪽 클릭 = 이동</b> (싸우지 않고 그 칸으로 가서 지킴). 명령은 진행 중에도 바로 먹어요. <kbd>F</kbd> 액티브 스킬 (돌진 · 도약) · <kbd>V</kbd> 거구 휘두르기 (자동 → 넓게 → 찍기) · <kbd>X</kbd> 명령 취소 · <kbd>H</kbd> 제자리 · <kbd>G</kbd> 자동 · <kbd>Q</kbd> 약 · <kbd>R</kbd> 투창 · <kbd>E</kbd> 줍기 · <kbd>Space</kbd> 다음 턴 · 오른쪽 끌기 = 둘러보기.</p>""",1)
rep("""명령: 바닥 = 그 칸으로 이동 (여럿이면 대형 그대로 각자 다른 칸), 보이는 적 = 쫓아가 공격 ·""", """명령: 왼쪽 클릭 = 공격 (보이는 적 = 쫓아가 공격, 바닥 = 공격 이동), 오른쪽 클릭 = 이동 (여럿이면 대형 그대로 각자 다른 칸) · 초상화 모양 = 역할 (네모 = 전선 · 탱크, 세모 = 미드필더 · 기동 (꼭짓점이 바라보는 쪽), 오각형 = 사수, 동그라미 = 보병) · 누운 얼굴 = 넘어짐 (기어다님 = 다리를 잃음) · 주황 부채꼴 = 거구가 넓게 휘두르려는 범위 (동료도 맞음) ·""")
rep("""아군을 고르고 판에서 바닥 (이동) 이나 보이는 적 (공격) 을 누르세요.""", """아군을 고르고 판에서 왼쪽 클릭 = 공격 (적 · 바닥은 공격 이동), 오른쪽 클릭 = 이동.""")

# ---------- 특성 · 액티브 · 고유특성 ----------
rep("""  '개조된 신체': '받는 피해 ×0.7 · 맞고 움찔하는 시간 절반',
  '거구': '몸이 큼 (×1.3). 키 차이가 1M 넘는 쪽은 이 몸 너머를 못 봄 (아군 · 적 모두) — 조금 돌면 보임',
  '돌진': '1.5 ~ 5칸 앞의 상대에게 곧게 돌진해 들이받음 (방패 자세를 크게 깎고 밀침 · 움찔 · 준비를 끊음). 8초마다',
  '도약': '근접 상대가 2칸 안으로 오면 뒤로 뛰어 단숨에 거리를 벌림 (1.1초마다)',""",
"""  '거구': '몸이 큼 (×1.3) · 무거움 · 몸이 방패 (중전차): 막는 게 아니라 동료를 가리고 지킴 (사선 · 시야). 키 차이가 1M 넘는 쪽은 이 몸 너머를 못 봄. 근접은 넓게 휘두르기 (동료도 맞음 · 넉백) · 찍기 (치명이면 넘어뜨림) · 넘어진 상대 짓밟기 · 내려찍기 (확인사살)',""")
rep("""const EXTRA_TRAITS = Object.keys(TRAITS).filter(k => k !== '야시' && k !== '방패' && k !== '방어 자세');""",
"""const EXTRA_TRAITS = Object.keys(TRAITS).filter(k => k !== '야시' && k !== '방패' && k !== '방어 자세');
// v5.2 액티브 스킬 (p.active): 명령으로 쓰거나 (F) AI 가 알아서
const ACTIVE = {
  '돌진': '1.5 ~ 5칸 앞의 상대에게 곧게 돌진해 들이받음 — 무게 비만큼 날려 보냄 (벽이면 짓뭉개짐) · 방패 자세를 크게 깎음 · 준비를 끊음. 8초마다',
  '도약': '뒤로 뛰어 단숨에 거리를 벌림 (근접 상대가 2칸 안으로 오면 스스로, 1.1초마다)',
};""")
rep("""    effects: ['근접 타격이 날붙이 판정을 받음 (맨손 · 발톱이어도 날붙이 — 무방비한 등에 들어가면 암살 치명상)'],
    derived: ['사족보행', '속력A', '괴력B'], limits: ['제약:총포류', '제약:활'], flags: { bladeHands: true } },""",
"""    effects: ['근접 타격이 날붙이 판정을 받음 (맨손 · 발톱이어도 날붙이 — 무방비한 등에 들어가면 암살 치명상)'],
    derived: ['사족보행', '속력A', '괴력B'], limits: ['제약:총포류', '제약:활'], flags: { bladeHands: true } },
  // v5.2 카리우스 (굴 설정 원문 LORE.md · 3D판 karius.js)
  '개조된 신체': { who: 'C-003',
    lore: ['어느 세계의 신에게 불경죄로 갇힌 학자, 카이로스 경. 본래는 180cm 의 평범하고 앙상한 몸이었다.', '서로 얼굴도 모르던 같은 세계의 죄수 넷 — 카이로스 경 · 광대 · 노인 · 슬픈 여자 — 이 3M 의 한 몸으로 꿰매어졌다.', '꿰맨 신은 그 영혼들에 매료되어 그대로 보존했다. 넷은 서로를 존중한다.', '신의 정성 덕에 후유증은 없다. 불 · 얼음 · 벼락 · 독에도 좀 더 버틴다.'],
    effects: ['받는 피해 ×0.7 (수치표 [개조된 신체])', '움찔 · 넘어짐 시간 절반', '3M 융합 거구 — 몸이 방패, 무게 300'],
    derived: ['거구', '갑피', '괴력A'], limits: [], flags: { modBody: true } },""")
rep("""    if (d.flags && d.flags.bladeHands) u.bladeHands = true; }""", """    if (d.flags && d.flags.bladeHands) u.bladeHands = true;
    if (d.flags && d.flags.modBody) u.modBody = true; }""")

# ---------- 설계 칸 기본값 ----------
rep("""  { key: '레베카', side: 0, ref: 'C-002', name: '레베카', tier: 2, sm: 1, height: 1.6, nv: true, nvG: 'A', traits: ['불사'], gear: { 몸: { name: '낡은 판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '기사 투구', mat: '투구', tier: 3 } }, tactic: '버티기 탱커 · 불사', note: '훈련받은 기사 · 굴 생활이 김. 쓰러져도 일어남' },
  { key: '카리우스', side: 0, ref: 'C-003', name: '카리우스', tier: 2, sm: 0.75, height: 3, nv: true, nvG: 'B', ov: { hp: 450, atk: 40 }, traits: ['갑피', '괴력A', '거구', '돌진', '개조된 신체'], tactic: '느린 거구 탱커 · 돌진', note: '높은 체력 · 높은 방어. 평소엔 느리지만 돌진으로 전선에 충격을 주며 들어감. 몸이 방패 · 3M 몸이 시야를 가림' },""",
"""  { key: '레베카', side: 0, ref: 'C-002', name: '레베카', tier: 2, sm: 1, shield: false, role: '공격수', weapon: '장검', height: 1.6, nv: true, nvG: 'A', traits: ['불사'], gear: { 몸: { name: '낡은 판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '기사 투구', mat: '투구', tier: 3 } }, tactic: '선봉 · 불사', note: '훈련받은 기사 · 굴 생활이 김. 방어는 약하지만 쓰러져도 일어남 — 쓰러진 채 맞으면 (확인사살) 늦게 일어남' },
  { key: '카리우스', side: 0, ref: 'C-003', name: '카리우스', tier: 2, sm: 0.75, shield: false, weapon: '맨손', height: 3, weight: 300, nv: true, nvG: 'B', ov: { hp: 450, atk: 40, rng: 0.6 }, traits: ['거구', '갑피', '괴력A'], unique: ['개조된 신체'], modBody: true, active: ['돌진'], tactic: '중전차 · 돌진', note: '높은 체력 · 높은 방어 · 느림. 돌진으로 전선에 충격을 주며 들어감. 몸이 방패 (동료를 가림) · 넓게 휘두르기 · 찍기 · 넘어진 상대는 짓밟음' },""")
rep("""  { key: '검방패기사', side: 1, ref: 'C-054', name: '검방패기사', tier: 2, height: 2.1, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 2 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 1 } }, tactic: '방패벽 (적 탱커)', note: '무리 앞에 방패를 세우고 버티다가 분명히 유리하면 밀고 나옴' },""",
"""  { key: '검방패기사', side: 1, ref: 'C-054', name: '검방패기사', tier: 2, height: 2.1, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 2 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 1 } }, tactic: '방패벽 (경전차) · 방패 밀치기', note: '무리 앞에 방패를 세우고 버티다가 분명히 유리하면 밀고 나옴. 벽 쪽 · 동료를 노리는 상대는 방패로 밀쳐 냄' },""")
rep("""traits: ['도약'], gear: { 몸: { name: '전신 경갑옷', mat: '경갑', tier: 2 }""", """active: ['도약'], gear: { 몸: { name: '전신 경갑옷', mat: '경갑', tier: 2 }""")
rep("""  { key: '곤봉적', side: 1, ref: 'C-055', name: '곤봉적', tier: 3, height: 2.5, traits: ['거구'], gear: { 몸: { name: '두꺼운 판금', mat: '판금', tier: 3 } }, tactic: '거구 근육질', note: '2M50 거구. 둔기' },""",
"""  { key: '곤봉적', side: 1, ref: 'C-055', name: '곤봉적', tier: 3, height: 2.5, ov: { rng: 0.75 }, traits: ['거구'], gear: { 몸: { name: '두꺼운 판금', mat: '판금', tier: 3 }, 머리: { name: '곤봉적 투구', mat: '투구', tier: 2 } }, tactic: '중전차 · 곤봉', note: '2M50 거구 근육질. 넓게 휘두르기 (동료도 맞음 · 넉백) · 찍기 · 넘어진 상대는 곤봉으로 내려찍어 확인사살' },""")
rep("""const DKEEP = ['name', 'tier', 'cls', 'sm', 'shield', 'weapon', 'nv', 'nvG', 'hero', 'ov', 'traits', 'gear', 'role', 'bold', 'height', 'ammo', 'skill', 'tac', 'tactic', 'note', 'race', 'origin', 'unique', 'am', 'smellG', 'bladeHands', 'noRanged'];""",
"""const DKEEP = ['name', 'tier', 'cls', 'sm', 'shield', 'weapon', 'nv', 'nvG', 'hero', 'ov', 'traits', 'gear', 'role', 'bold', 'height', 'ammo', 'skill', 'tac', 'tactic', 'note', 'race', 'origin', 'unique', 'am', 'smellG', 'bladeHands', 'noRanged', 'active', 'weight', 'modBody'];""")
rep("""  if (sd !== 0) u.hero = false;
  if (u.skill) u.skill = clone(u.skill);
  return u;""", """  if (sd !== 0) u.hero = false;
  if (u.skill) u.skill = clone(u.skill);
  if ((u.unique || []).length) applyUnique(u);   // v5.2 ◆고유특성의 파생특성 · 판정
  return u;""")
rep("""const S = { v: 3, v4: true, v41: true, v42: true, v43: true, v44: true, v46: true, v47: true, v50: true, v51: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], tor""",
    """const S = { v: 3, v4: true, v41: true, v42: true, v43: true, v44: true, v46: true, v47: true, v50: true, v51: true, v52: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], tor""")

# ---------- 옮기기 (v5.2) ----------
rep("""// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)""", """// v5.2: 돌진 · 도약 = 액티브 스킬, [개조된 신체] = ◆고유특성, 카리우스 · 레베카는 방패 없음 (몸이 방패는 [거구]), 카리우스 맨손 (팔 · 발), 곤봉적 투구. 규칙 칸 채움 · 관통
function migrate52(p){
  const tr = p.traits || [], act = tr.filter(t => t === '돌진' || t === '도약');
  if (act.length){ p.active = [...new Set([...(p.active || []), ...act])]; p.traits = tr.filter(t => !act.includes(t)); }
  if ((p.traits || []).includes('개조된 신체')){ p.traits = p.traits.filter(t => t !== '개조된 신체'); p.unique = [...new Set([...(p.unique || []), '개조된 신체'])]; applyUnique(p); }
  if (p.ref === 'C-003' && (p.unique || []).includes('개조된 신체')){ p.shield = false; if (p.weapon === '검'){ p.weapon = '맨손'; p.ov = { ...(p.ov || {}) }; if (p.ov.rng == null) p.ov.rng = 0.6; } if (p.weight == null) p.weight = 300; }
  if (p.ref === 'C-002' && (p.traits || []).includes('불사')){ p.shield = false; if (!p.role) p.role = '공격수'; }
  if (p.ref === 'C-055' && (p.traits || []).includes('거구')){ p.gear = p.gear || {}; if (!p.gear['머리']) p.gear['머리'] = { name: '곤봉적 투구', mat: '투구', tier: 2 }; p.ov = p.ov || {}; if (p.ov.rng == null) p.ov.rng = 0.75; }
  return p;
}
if (!S.v52){ S.units.forEach(migrate52);
  for (const k in DEFAULT_RULES){ const d = DEFAULT_RULES[k], r = S.rules[k]; if (d && typeof d === 'object' && !Array.isArray(d) && r && typeof r === 'object' && k !== 'weapons') for (const j in d) if (r[j] === undefined) r[j] = clone(d[j]); }
  for (const w in DEFAULT_RULES.weapons){ const d = DEFAULT_RULES.weapons[w], r = S.rules.weapons[w]; if (!r) continue; for (const j of ['pen', 'penK', 'jit']) if (r[j] === undefined && d[j] !== undefined) r[j] = d[j]; }
  if (S.rules.weapons['소총'] && S.rules.weapons['소총'].rng === 6) S.rules.weapons['소총'].rng = 7;
  if (S.rules.weapons['총'] && S.rules.weapons['총'].rng === 5) S.rules.weapons['총'].rng = 6;
  S.v52 = true; }
try { const mine = myDesigns(); if (mine.some(d => (d.traits || []).some(t => t === '돌진' || t === '도약' || t === '개조된 신체'))){ mine.forEach(migrate52); saveMyDesigns(mine); } } catch (e) {}
// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)""")

# ---------- 조작: 왼쪽 = 공격, 오른쪽 = 이동 ----------
rep("""let sel = new Set(), hudT = 0, boxSel = null, skillPick = null, throwPick = null;""", """let sel = new Set(), hudT = 0, boxSel = null, skillPick = null, throwPick = null, chargePick = null;
// v5.2 돌진 대상 고르기 (F): 고른 돌진 가능 아군에게 '그 적에게 돌진' 명령
function giveCharge(t){
  const C = (chargePick || []).map(i => world.units[i]).filter(u => u && u.alive && u.canCharge && !u.crawl); chargePick = null;
  if (!C.length){ hud(); return; }
  if (!t.seenBy){ toast('안 보이는 적에게는 돌진할 수 없어요'); hud(); return; }
  C.forEach(u => { u.order = { k: 'charge', b: t.i }; u.last = { x: t.x, y: t.y }; }); noteOrders(C); toast(`${C.map(u => u.name).join(' · ')} → ${t.name} 돌진!`); hud();
}
const SWING_NM = { '': '자동', '휘두르기': '넓게', '찍기': '찍기' };""")
rep("""function groupMove(L, wx, wy){""", """function groupMove(L, wx, wy, kind){
  kind = kind || 'move';   // v5.2 'amove' = 공격 이동""")
rep("""  if (L.length === 1){ L[0].order = { k: 'move', x: tx, y: ty }; noteOrders(L); return; }""", """  if (L.length === 1){ L[0].order = { k: kind, x: tx, y: ty }; noteOrders(L); return; }""")
rep("""    taken.add(gx + ',' + gy); u.order = { k: 'move', x: gx + 0.5, y: gy + 0.5 };""", """    taken.add(gx + ',' + gy); u.order = { k: kind, x: gx + 0.5, y: gy + 0.5 };""")
rep("""  if (u && u.side === 1 && throwPick){ giveThrow(u); return; }
  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }
  if (throwPick){ throwPick = null; toast('투창을 취소했어요'); hud(); return; }
  if (skillPick){ skillPick = null; toast('약 쓰기를 취소했어요'); hud(); return; }
  if (u && u.side === 1){ giveAttack(u); return; }
  const L = selUnits(world);
  if (!L.length){ toast('먼저 명령할 아군을 고르세요 (판에서 끌어 네모로 여럿 고르기)'); return; }
  groupMove(L, w.x, w.y); hud();
}""", """  if (u && u.side === 1 && throwPick){ giveThrow(u); return; }
  if (u && u.side === 1 && chargePick){ giveCharge(u); return; }
  if (u && u.side === 0){ pickAlly(u.i, add); hud(); return; }
  if (throwPick){ throwPick = null; toast('투창을 취소했어요'); hud(); return; }
  if (skillPick){ skillPick = null; toast('약 쓰기를 취소했어요'); hud(); return; }
  if (chargePick){ chargePick = null; toast('돌진을 취소했어요'); hud(); return; }
  if (u && u.side === 1){ giveAttack(u); return; }
  // v5.2 왼쪽 클릭 바닥 = 공격 이동 (가는 길에 보이는 적과 싸우며 그 칸으로)
  const L = selUnits(world);
  if (!L.length){ toast('먼저 명령할 아군을 고르세요 (판에서 끌어 네모로 여럿 고르기)'); return; }
  groupMove(L, w.x, w.y, 'amove'); hud();
}""")
rep("""// 오른쪽 클릭 = 명령: 적 → 공격, 아군 → (약을 가진 아군을 골랐으면) 그 아군에게 약, 바닥 → 이동
function rightClick(w){
  if (!world || world.over) return;
  const u = unitAt(world, w.x, w.y, false), L = selUnits(world);
  if (!L.length){ toast('먼저 명령할 아군을 고르세요'); return; }
  if (u && u.side === 1){ if (throwPick){ giveThrow(u); return; } giveAttack(u); return; }
  if (u && u.side === 0){
    const C = L.filter(x => x.skill && x.skill.left > 0);
    if (C.length){ skillPick = C.map(x => x.i); giveSkill(u); return; }
    if (u.order || u.stay){ cancelOrders([u]); return; }   // v5.1 아군 위 오른쪽 클릭 = 그 아군 명령 취소
    toast('아군 위 오른쪽 클릭: 약 · 구급상자를 가진 아군을 골랐으면 치유, 아니면 그 아군의 명령 취소'); return;
  }
  skillPick = null; groupMove(L, w.x, w.y); hud();
}""", """// v5.2 오른쪽 클릭 = 이동 (싸우지 않고 그 칸으로 가서 지킴) — 어디를 누르든 (적 · 아군 위여도 그 자리로)
function rightClick(w){
  if (!world || world.over) return;
  const L = selUnits(world);
  if (!L.length){ toast('먼저 명령할 아군을 고르세요'); return; }
  skillPick = null; throwPick = null; chargePick = null; groupMove(L, w.x, w.y, 'move'); hud();
}""")
rep("""const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick', r: 'throw', x: 'cancel', backspace: 'cancel', delete: 'cancel' }[k];""",
    """const m = { h: 'hold', g: 'auto', q: 'skill', e: 'pick', r: 'throw', f: 'active', v: 'swing', x: 'cancel', backspace: 'cancel', delete: 'cancel' }[k];""")
rep("""if (k === 'escape' && mode !== 'edit'){ if (throwPick){ throwPick = null; hud(); return; }""", """if (k === 'escape' && mode !== 'edit'){ if (chargePick){ chargePick = null; hud(); return; } if (throwPick){ throwPick = null; hud(); return; }""")
rep("""  else if (k === 'skill'){ const C = L.filter(u => u.skill && u.skill.left > 0);""", """  else if (k === 'active'){   // v5.2 액티브 스킬: 돌진 (적을 누름) · 도약 (바로)
    const C = L.filter(u => u.canCharge && !u.crawl), Lp = L.filter(u => u.canLeap && !u.crawl);
    if (C.length){ chargePick = chargePick ? null : C.map(u => u.i); if (chargePick) toast(C.some(u => world.t < u.chargeCd) ? `돌진은 ${f2(Math.max(...C.map(u => u.chargeCd - world.t)))}초 뒤에 다시 쓸 수 있어요 — 누른 적에게 다가가 기다려요` : '들이받을 적을 누르세요 (Esc 취소)'); }
    else if (Lp.length){ Lp.forEach(u => { u.order = { k: 'leap' }; }); noteOrders(Lp); toast('뒤로 도약'); }
    else { toast('고른 아군 중에 액티브 스킬 (돌진 · 도약) 을 가진 이가 없어요'); return; }
  }
  else if (k === 'swing'){   // v5.2 거구 휘두르기: 자동 → 넓게 → 찍기
    const C = L.filter(u => u.canSweep); if (!C.length){ toast('고른 아군 중에 거구 (넓게 휘두르기 · 찍기) 가 없어요'); return; }
    const nx = { '': '휘두르기', '휘두르기': '찍기', '찍기': '' }[C[0].swing || ''];
    C.forEach(u => { u.swing = nx || null; });
    toast(`${C.map(u => u.name).join(' · ')}: ${nx === '휘두르기' ? '넓게 휘두르기 (동료가 곁에 있어도)' : nx === '찍기' ? '찍기만 (한 놈씩)' : '자동 (이득을 따져 고름 — 동료가 곁에 있으면 웬만하면 안 휘두름)'}`);
  }
  else if (k === 'skill'){ const C = L.filter(u => u.skill && u.skill.left > 0);""")
rep("""<button class="btn" type="button" data-ord="all">모두 고르기</button><button class="btn" type="button" data-ord="none">고르기 풀기</button></div>""",
    """${L.some(u => u.canCharge || u.canLeap) ? `<button class="btn ${chargePick ? 'on' : ''}" type="button" data-ord="active" title="액티브 스킬">${chargePick ? '들이받을 적을 누르세요 (Esc 취소)' : L.some(u => u.canCharge) ? '돌진' + (L.filter(u => u.canCharge).some(u => Wd.t < u.chargeCd) ? ' (' + f2(Math.max(...L.filter(u => u.canCharge).map(u => u.chargeCd - Wd.t))) + '초)' : '') : '도약'} <kbd>F</kbd></button>` : ''}${L.some(u => u.canSweep) ? `<button class="btn" type="button" data-ord="swing" title="거구의 근접 — 자동: 이득을 따져 고름 (동료가 곁에 있으면 웬만하면 안 휘두름) · 넓게: 동료가 있어도 넓게 휘두름 · 찍기: 한 놈만">휘두르기: ${SWING_NM[L.find(u => u.canSweep).swing || '']} <kbd>V</kbd></button>` : ''}<button class="btn" type="button" data-ord="all">모두 고르기</button><button class="btn" type="button" data-ord="none">고르기 풀기</button></div>""")
rep(""" 바닥 = 이동${L.length > 1 ? ' (대형 그대로 각자 다른 칸)' : ''}, 보이는 적 = 공격.</p>`;""", """ 왼쪽 클릭: 적 = 공격 · 바닥 = 공격 이동. 오른쪽 클릭: 이동${L.length > 1 ? ' (대형 그대로 각자 다른 칸)' : ''}.</p>`;""")
rep("""  if (o[0] === 'move') return `${ro(coord(o[1], o[2]))} 이동`;""", """  if (o[0] === 'move') return `${ro(coord(o[1], o[2]))} 이동`;
  if (o[0] === 'amove') return `${ro(coord(o[1], o[2]))} 공격 이동`;
  if (o[0] === 'charge') return `${Wd.units[o[1]].name}에게 돌진`;""")
rep("""const ordOf = u => u.order && u.order.k === 'throw'""", """const ordOf = u => u.order && u.order.k === 'amove' ? ['amove', u.order.x, u.order.y] : u.order && u.order.k === 'charge' ? ['charge', u.order.b] : u.order && u.order.k === 'throw'""")
rep("""        if (u.order.k === 'move'){""", """        if (u.order.k === 'move' || u.order.k === 'amove'){
          if (u.order.k === 'amove') ctx.strokeStyle = `rgba(255,140,100,${al})`;   // v5.2 공격 이동 = 붉은 선""")
rep("""        if (u.order.k === 'attack'){ const t = Wd.units[u.order.b];""", """        if (u.order.k === 'attack' || u.order.k === 'charge'){ const t = Wd.units[u.order.b];""")

# ---------- 판 그리기: 초상화 모양 · 넘어짐 · 휘두르기 예고 · 쓰러진 [불사] ----------
rep("""  // 말
  const now = Wd.t;""", """  // 말
  const now = Wd.t;
  // v5.2 쓰러진 [불사]: 누운 얼굴 · 일어날 때까지 남은 초 (상대가 눌러 두고 있으면 '눌림')
  if (!ed) for (const u of Wd.units){
    if (!u.down || u.alive || (u.side === 1 && !see)) continue;
    const px = ox + u.x * ts, py = oy + u.y * ts, r = u.r * ts, fi = faceOf(u.ref), pin = now - (u.pinnedT == null ? -9 : u.pinnedT) < 2.5;
    ctx.save(); ctx.globalAlpha = 0.75; ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.clip(); ctx.translate(px, py); ctx.rotate(Math.PI / 2); ctx.translate(-px, -py);
    if (fi >= 0 && atlasOK) ctx.drawImage(atlas, (fi % FACE.COLS) * FACE.S, Math.floor(fi / FACE.COLS) * FACE.S, FACE.S, FACE.S, px - r, py - r, r * 2, r * 2); else { ctx.fillStyle = SIDEC[u.side]; ctx.fillRect(px - r, py - r, r * 2, r * 2); }
    ctx.fillStyle = 'rgba(40,0,0,.45)'; ctx.fillRect(px - r, py - r, r * 2, r * 2); ctx.restore();
    ctx.strokeStyle = SIDEC[u.side]; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
    if (ts >= 26){ const t = `[불사] ${f2(Math.max(0, u.riseT - now))}초${pin ? ' · 눌림' : ''}`; ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(10,8,12,.8)'; ctx.fillRect(px - tw / 2 - 3, py - r - 14, tw + 6, 13); ctx.fillStyle = pin ? '#ff8a70' : '#bfe0ff'; ctx.fillText(t, px, py - r - 7.5); }
  }""")
rep("""    ctx.globalAlpha = vis ? 1 : 0.42;
    // 시선:""", """    ctx.globalAlpha = vis ? 1 : 0.42;
    // v5.2 넓게 휘두르기 예고: 준비하는 동안 주황 부채꼴 (동료도 맞음)
    if (!ed && u.act && u.act.k === 'atk' && u.act.phase === 'wind' && u.act.mode === 'sweep' && Wd.units[u.act.b]){ const S2 = Wd.rules.sweep || {}, R2 = (u.r + u.rng + (S2.reach || 0.35)) * ts, ar = (S2.arc || 65) * Math.PI / 180, b = Wd.units[u.act.b], a0 = Math.atan2(b.y - u.y, b.x - u.x), k = Math.min(1, (now - u.act.t0) / Math.max(0.05, u.act.end - u.act.t0));
      ctx.fillStyle = `rgba(255,150,60,${0.12 + 0.22 * k})`; ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, R2, a0 - ar, a0 + ar); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,170,80,.85)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    // 시선:""")
rep("""    ctx.save(); ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.closePath(); ctx.fillStyle = '#1c1a20'; ctx.fill(); ctx.clip();
    const fi = faceOf(u.ref);""", """    // v5.2 초상화 모양 = 역할 (전선 네모 · 미드필더 세모 · 사수 오각형 · 보병 동그라미 — 네모 · 세모는 바라보는 쪽으로 돎). 넘어지면 얼굴을 눕힘
    const shp = shapeOf(u), sa = u.face || 0, lying = !ed && (u.crawl || now < u.proneT || !!u.kb);
    ctx.save(); shapePath(ctx, shp, px, py, r, sa); ctx.fillStyle = '#1c1a20'; ctx.fill(); ctx.clip();
    if (lying){ ctx.translate(px, py); ctx.rotate(Math.PI / 2); ctx.translate(-px, -py); }
    const fi = faceOf(u.ref);""")
rep("""    if (!vis) ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);""", """    if (!vis) ctx.setLineDash([3, 3]);
    shapePath(ctx, shp, px, py, r, sa); ctx.stroke(); ctx.setLineDash([]);
    // v5.2 넘어짐 · 기어다님 · 밀려남 표시 (붉은 글씨, 이름 위)
    if (lying && vis && ts >= 22){ const t = u.crawl ? `기어다님 · 다리 ${u.legLoss || ''}` : u.kb ? '밀려남' : '넘어짐'; ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(60,8,8,.85)'; ctx.fillRect(px - tw / 2 - 3, py + r * 0.15 - 6, tw + 6, 12); ctx.fillStyle = '#ff9a86'; ctx.fillText(t, px, py + r * 0.15); }""")
rep("""    } else if (f.k === 'spark' && age < 0.25){""", """    } else if (f.k === 'sweep' && age < 0.3){   // v5.2 넓게 휘두른 자리
      const a = Wd.units[f.a], p = { x: ox + a.x * ts, y: oy + a.y * ts }; ctx.fillStyle = `rgba(255,236,200,${0.4 * (1 - age / 0.3)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, f.r * ts, f.ang - f.arc, f.ang + f.arc); ctx.closePath(); ctx.fill();
    } else if (f.k === 'crush' && age < 0.5){   // v5.2 짓뭉개짐 · 짓밟기
      const p = { x: ox + f.x * ts, y: oy + f.y * ts }, k = age / 0.5; ctx.strokeStyle = `rgba(210,30,40,${1 - k})`; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(p.x, p.y, ts * (0.3 + k * 0.7), 0, 6.283); ctx.stroke();
    } else if (f.k === 'spark' && age < 0.25){""")
rep("""// v5.1 방어구 아이콘:""", """// v5.2 초상화 모양 (역할): 전선 (탱크) = 네모 (바라보는 쪽으로 돎) · 미드필더 (기동) = 세모 (꼭짓점이 바라보는 · 공격 방향) · 사수 = 오각형 · 공격수 · 지원 (기초 보병) = 동그라미
const shapeOf = u => u.role === '전선' ? 'sq' : u.role === '미드필더' ? 'tri' : u.role === '사수' ? 'pent' : 'circ';
function shapePath(c, k, x, y, r, a){
  c.beginPath();
  if (k === 'circ'){ c.arc(x, y, r, 0, 6.283); c.closePath(); return; }
  const n = k === 'sq' ? 4 : k === 'tri' ? 3 : 5, R = r * (k === 'sq' ? 1.2 : k === 'tri' ? 1.4 : 1.1), a0 = k === 'sq' ? a + Math.PI / 4 : k === 'tri' ? a : -Math.PI / 2;
  for (let i = 0; i < n; i++){ const t = a0 + i * 2 * Math.PI / n; if (i) c.lineTo(x + Math.cos(t) * R, y + Math.sin(t) * R); else c.moveTo(x + Math.cos(t) * R, y + Math.sin(t) * R); }
  c.closePath();
}
// v5.1 방어구 아이콘:""")

# ---------- 설명 상자 (커서) ----------
rep("""    <span class="tr"><span class="lb">몸</span> 키 ${u.h}m${u.h >= 2.2 ? ' (큰 몸 — 1M 넘게 작은 쪽은 이 너머를 못 봄)' : ''}""", """    <span class="tr"><span class="lb">몸</span> 키 ${u.h}m · 무게 ${u.mass}kg${u.bodyShield ? ' · 몸이 방패 (중전차 — 막는 게 아니라 동료를 가리고 지킴)' : ''}${u.h >= 2.2 ? ' (큰 몸 — 1M 넘게 작은 쪽은 이 너머를 못 봄)' : ''}""")
rep("""    ${u.canGuard && known ? `<span class="tr"><span class="lb">방어</span> 바라보는 방향 ±${u.gArc}°""", """    ${!ed && (u.crawl || Wd.t < u.proneT) ? `<span class="tr" style="color:#ff9a86"><span class="lb">넘어짐</span> ${u.crawl ? `다리 ${esc(u.legLoss || '')} — 기어다님 (못 일어남 · 쏠 수는 있고 근접은 못 함 · 속력 ×${Wd.rules.crawl})` : `${f2(u.proneT - Wd.t)}초 뒤 일어남 · 못 움직이고 못 막음`} · 받는 피해 ×${Wd.rules.proneHit} · 치명 +${Math.round(((Wd.rules.crit || {}).prone || 0) * 100)}%${Wd.units.some(f => f.alive && f.side !== u.side && f.canSweep) ? ' · 거구는 짓밟거나 내려찍어 확인사살' : ''}</span>` : ''}
    ${!ed && u.alive && Wd.units.some(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) < 1.5 && backToWall(Wd, u, f)) ? `<span class="tr" style="color:#ffb27a"><span class="lb">벽을 등짐</span> 피하기 ×${(Wd.rules.dodge || {}).wall} · 막으면 자세 ×${Wd.rules.wallPost} · 밀리면 짓뭉개짐 · 물러설 곳 없음</span>` : ''}
    ${(u.active || []).length ? `<span class="tr"><span class="lb">액티브</span> ${u.active.map(a => `<i>[${esc(a)}]</i> ${esc(ACTIVE[a] || '')}`).join(' · ')}${!ed && u.canCharge && Wd.t < u.chargeCd ? ` · 돌진 ${f2(u.chargeCd - Wd.t)}초 뒤` : ''} (<kbd>F</kbd>)</span>` : ''}
    ${u.canSweep ? `<span class="tr"><span class="lb">거구의 공격</span> 넓게 휘두르기 (앞 ±${(Wd.rules.sweep || {}).arc}° · 동료도 맞음 · 넉백) · 찍기 (치명이면 넘어뜨림 · 막아도 자세 크게 깎음) · ${u.weapon && u.weapon !== '맨손' ? '내려찍기' : '짓밟기'} (넘어진 상대 · ${Math.round(((Wd.rules.heavy || {}).stompKill || 0) * 100)}% 확인사살) — ${u.swing ? '명령: ' + (u.swing === '휘두르기' ? '넓게' : '찍기') : '자동 (이득을 따져 고름)'}</span>` : ''}
    ${u.canGuard && known ? `<span class="tr"><span class="lb">방어</span> 바라보는 방향 ±${u.gArc}°""")
rep("""${!u.shield ? ' · 자기 공격 중엔 못 막음' : ''}</span>` : ''}""", """${!u.shield ? ' · 자기 공격 중엔 못 막음' : ' · 방패 밀치기 (벽으로 · 동료를 노리는 놈 · 둘러싸이면)'}</span>` : ''}""")
rep("""  for (const f of th){ const g = firstOnLine(Wd, f, u, f.i >= 0 ? f : null); if (g === u || g.side !== u.side || !inGuard(Wd, g, f)) return null; g0 = g; }""",
    """  for (const f of th){ const g = firstOnLine(Wd, f, u, f.i >= 0 ? f : null); if (g === u || g.side !== u.side || !blocksFor(Wd, g, f)) return null; g0 = g; }   // v5.2 큰 몸도 가려 줌""")

# ---------- 카드 ----------
rep("""${dark ? '어둠 속에서 맞는 중 · ' : ''}${esc(what)}""", """${dark ? '어둠 속에서 맞는 중 · ' : ''}${!ed && u.alive && u.crawl ? '기어다님 (다리 ' + esc(u.legLoss || '') + ') · ' : !ed && u.alive && Wd.t < u.proneT ? '넘어짐 · ' : ''}${!ed && u.down && Wd.t - (u.pinnedT == null ? -9 : u.pinnedT) < 2.5 ? '눌림 (확인사살 중) · ' : ''}${esc(what)}""")

# ---------- 배치 편집: 액티브 · 무게 ----------
rep("""    <div class="row"><label class="brush" for="selName">이름 <input id="selName" type="text" style="width:9em" value="${esc(p.name)}"></label>""",
    """    <div class="row">${Object.keys(ACTIVE).map(a => `<label class="ck" for="ac-${a}" title="${esc(ACTIVE[a])}"><input id="ac-${a}" type="checkbox" data-active="${a}" ${(p.active || []).includes(a) ? 'checked' : ''}> 액티브 [${a}]</label>`).join('')}<label class="brush" for="selWeight">무게 (kg) <input id="selWeight" type="number" min="5" max="2000" step="5" style="width:5.5em" value="${p.weight != null ? p.weight : ''}" placeholder="${massOf(p, rules, heightOf(p), gearOf(p, rules))}"></label></div>
    <div class="row"><label class="brush" for="selName">이름 <input id="selName" type="text" style="width:9em" value="${esc(p.name)}"></label>""")
rep("""  if (e.target.id === 'selHeight'){""", """  if (e.target.dataset.active){ const a = e.target.dataset.active; p.active = (p.active || []).filter(x => x !== a); if (e.target.checked) p.active.push(a); if (!p.active.length) delete p.active; changed(); return; }
  if (e.target.id === 'selWeight'){ const v = e.target.value.trim(); if (v === '' || !(+v > 0)) delete p.weight; else p.weight = Math.round(+v); changed(); return; }
  if (e.target.id === 'selHeight'){""")

# ---------- 수치표 ----------
rep("""['leap.near', '[도약]: 근접 상대가 이 거리 안이면 (칸)'], ['leap.dist', '[도약]: 뛰는 거리 (칸)'], ['leap.time', '[도약]: 걸리는 시간 (초)'], ['leap.cd', '[도약]: 다시 쓰기 (초)']]""",
    """['leap.near', '[도약]: 근접 상대가 이 거리 안이면 (칸)'], ['leap.dist', '[도약]: 뛰는 거리 (칸)'], ['leap.time', '[도약]: 걸리는 시간 (초)'], ['leap.cd', '[도약]: 다시 쓰기 (초)'],
    ['undying.pin', '[불사]: 쓰러진 채 맞으면 (확인사살) 일어나는 때가 밀리는 시간 (초)'],
    ['mass.base', '무게: 키 1.7m 의 몸무게 (kg, 방어구 · [거구] 빼고)'], ['mass.exp', '무게: 키 배율 지수'], ['mass.giant', '무게: [거구] ×'], ['mass.armor', '무게: 방어구 (등급 × w × 이 값 kg)'],
    ['shove.exp', '밀침: 무게 비 지수 (날아가는 거리 = 힘 × (무게 비)^이 값)'], ['shove.cap', '밀침: 최대 (힘 ×)'], ['shove.vel', '밀침: 날아가는 빠르기 (칸/초)'], ['shove.crush', '짓뭉개짐 (벽에 박힘): 공격 ×'], ['shove.wall', '짓눌림 (처음부터 벽에 붙음): ×'], ['shove.crushProne', '짓뭉개지면 넘어짐 (초)'], ['shove.downLen', '이 칸 넘게 날아가면 넘어짐'], ['shove.prone', '나가떨어지면 넘어짐 (초)'], ['shove.bowl', '날아가다 부딪힘: 공격 ×'],
    ['sweep.arc', '넓게 휘두르기: 폭 (±도)'], ['sweep.reach', '넓게 휘두르기: 사거리 + (칸)'], ['sweep.mul', '넓게 휘두르기: 공격 ×'], ['sweep.p', '넓게 휘두르기: 밀치는 힘'], ['sweep.crit', '넓게 휘두르기: 치명 +'],
    ['heavy.mul', '찍기: 공격 ×'], ['heavy.post', '찍기: 막아도 깎이는 자세'], ['heavy.crit', '찍기: 치명 + (치명이면 넘어뜨림)'], ['heavy.down', '찍기 치명: 넘어짐 (초)'], ['heavy.wind', '거구의 공격: 준비 시간 ×'], ['heavy.stompKill', '짓밟기 · 내려찍기: 확인사살 확률'], ['heavy.stomp', '짓밟기: 공격 × (확인사살이 아니면)'],
    ['crit.base', '치명타 확률 (모든 공격)'], ['crit.prone', '넘어진 상대: 치명 +'], ['crit.mul', '치명 피해 ×'], ['crit.cripple', '다리에 치명이면 불구 (기어다님) 확률'], ['crit.legMin', '불구: 최대 체력의 이 비율 넘게 맞아야'], ['proneHit', '넘어진 몸이 받는 피해 ×'], ['crawl', '기어다닐 때 속력 ×'],
    ['bash.p', '방패 밀치기: 힘'], ['bash.dmg', '방패 밀치기: 공격 ×'], ['bash.post', '방패 밀치기: 상대 자세 깎임'], ['bash.cd', '방패 밀치기: 다시 쓰기 (초)'],
    ['dodge.p', '피하기: 확률 (× 날렵함 · 둘레 여유)'], ['dodge.step', '피하기: 비켜서는 거리 (칸)'], ['dodge.cd', '피하기: 다시 (초)'], ['dodge.wall', '피하기: 벽을 등지면 ×'], ['wallPost', '벽을 등지고 막으면 자세 깎임 ×'], ['footwork', '발놀림 속력 × (0 = 기다릴 때 멈춰 섬)'],
    ['squad.flank', '적 우회 조: 도는 거리 (칸)'], ['squad.spread', '큰 몸 앞에서 서로 떨어지는 거리 (칸)'], ['pierce.str', '투구째 꿰뚫음: 괴력 배율 이 이상'], ['pierce.kill', '투구째 꿰뚫음: 즉사 확률']]""")
rep("""<th>탄속</th><th>총성</th>""", """<th>탄속</th><th>관통 · 몫 · 흔들림</th><th>총성</th>""")
rep("""<td>${far ? o(`weapons.${w}.vel`, W.vel, 2, 40) : ''}</td>""", """<td>${far ? o(`weapons.${w}.vel`, W.vel, 2, 40) : ''}</td><td>${far ? o(`weapons.${w}.pen`, W.pen, 0.05, '-') + ' ' + o(`weapons.${w}.penK`, W.penK, 0.05, '-') + ' ' + o(`weapons.${w}.jit`, W.jit, 0.05, rules.jitter) : ''}</td>""")
rep("""['critMul', '치명 피해 ×', 0.1], ['post', '막힐 때 상대 자세 깎임 ×', 0.25]]""", """['critMul', '치명 피해 ×', 0.1], ['post', '막힐 때 상대 자세 깎임 ×', 0.25], ['pen', '관통 확률 (+ 근력)', 0.05], ['penK', '관통하면 갑옷이 막는 몫에서 덜어 냄', 0.05], ['jit', '피해 흔들림 ±', 0.05]]""")

# ---------- 기분 · 동작 이름 ----------
rep("""'돌진': '돌진!', '구급상자 준비': '구급상자 준비' };""", """'돌진': '돌진!', '구급상자 준비': '구급상자 준비',
  '방패 밀치기': '방패 밀치기', '확인사살': '확인사살', '기어서 물러남': '기어서 물러남', '기어감': '기어감', '기어다님': '기어다님', '공격 이동': '공격 이동', '돌진 거리로': '돌진 거리로', '우회 (조)': '우회 조' };""")
rep("""  if (a.k === 'leap') return '뒤로 도약';""", """  if (a.k === 'leap') return '뒤로 도약';
  if (a.k === 'dodge') return '몸을 빼 피함';
  if (a.k === 'bash') return a.ph === 'wind' ? `방패 밀치기 → ${b ? b.name : ''}` : '방패 밀친 뒤';""")

# ---------- 로그 (자세히) ----------
rep("""      case 'shout': out.push(`${T(e)}${n(e.a)}: "${e.s}" (${e.s === '뒤로!' ? '전선으로 나서며 동료를 뒤로' : '노출된 동료 앞을 막아섬'})`); break;""",
    """      case 'shout': out.push(`${T(e)}${n(e.a)}: "${e.s}" (${e.s === '뒤로!' ? '전선으로 나서며 동료를 뒤로' : e.s === '비켜!' ? '넓게 휘두르기 전 — 곁에 동료가 있음' : '노출된 동료 앞을 막아섬'})`); break;
      case 'shove': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${{ sweep: '휘둘러 날려 보냄', bash: '방패로 밀침', charge: '들이받아 날려 보냄', bowl: '부딪혀 밀려남' }[e.how] || '밀침'} ${e.len}칸 (무게 ${Wd.units[e.a].mass} → ${Wd.units[e.b].mass}kg)`); break;
      case 'bowl': out.push(`${T(e)}날아가던 ${ga(n(e.b))} ${wa(n(e.c))} 부딪힘 — 둘 다 다침`); break;
      case 'crush': out.push(`${T(e)}${ga(n(e.b))} ${e.pinned ? '벽과 ' + n(e.a) + ' 사이에 짓눌림' : '벽에 박혀 짓뭉개짐'} (막을 수 없음 · 넘어짐)`); break;
      case 'prone': out.push(`${T(e)}${n(e.b)} 넘어짐 ${e.sec}초 (${e.why}${e.a !== e.b ? ' · ' + n(e.a) : ''})`); break;
      case 'cripple': out.push(`${T(e)}✚ ${n(e.b)} 다리 ${e.how} — 기어다님 (못 일어남 · 근접 못 함 · ${n(e.a)}의 치명타)`); break;
      case 'sweep': out.push(`${T(e)}${n(e.a)} 넓게 휘두르기 → ${e.foes.map(n).join(' · ') || '아무도 없음'}${e.ff.length ? ' · 동료도 맞음: ' + e.ff.map(n).join(' · ') : ''}`); break;
      case 'stomp': out.push(`${T(e)}${n(e.a)} → 넘어진 ${n(e.b)} ${e.how || '짓밟기'}${e.kill ? ' — 확인사살' : ' (막을 수 없음)'}`); break;
      case 'dodge': out.push(`${T(e)}${n(e.a)} 피함 (${n(e.b)}의 ${e.mate ? '휘두르기 — 동료' : '공격'}${e.wall ? ' · 벽을 등지고도' : ''})`); break;
      case 'squad': out.push(`${T(e)}적이 조를 나눔: ${e.a.map(n).join(' · ')} → 옆으로 우회해 ${n(e.aim)} 노림 (정면 ${e.rest})`); break;
      case 'peel': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 떼어 내러 감 (${n(e.v)}에게 붙어 있음)`); break;
      case 'pinGo': out.push(`${T(e)}${n(e.a)} → 쓰러진 ${n(e.b)}에게 감 (확인사살)`); break;
      case 'pinDown': out.push(`${T(e)}${n(e.a)} → 쓰러진 ${n(e.b)} 확인사살 ([불사] 일어나는 때 ${e.rise}초 뒤로)`); break;
      case 'guardBreak': out.push(`${T(e)}${n(e.a)}의 찍기에 ${n(e.b)} 자세 무너짐`); break;""")
rep("""        if (e.skill){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.skill} 붓기 시작""", """        if (e.bash){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 방패 밀치기 준비${e.why ? ' · ' + e.why : ''}`); break; }
        if (e.skill){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.skill} 붓기 시작""")
rep("""        if (e.wound) tags.push(e.wound === '팔' ? '팔 상처 (공격 ×0.85)' : '다리 상처 (속력 ×0.8)');""", """        if (e.wound) tags.push(e.wound === '팔' ? '팔 상처 (공격 ×0.85)' : '다리 상처 (속력 ×0.8)');
        if (e.tag) tags.push(e.tag); if (e.hcrit) tags.push('치명타 ×' + ((R.crit || {}).mul || 1.5)); if (e.pen) tags.push('관통');""")

# ---------- 이야기 (나레이션) ----------
rep("""    case 'shout': return U(e.a).side === 0 ? { c: 'good', s: `${n(e.a)}: "${e.s}"` } :""", """    case 'shout': if (e.s === '비켜!') return U(e.a).side === 0 ? { c: 'dim', s: `${n(e.a)}: "비켜!" — 크게 휘두르려 한다.` } : U(e.a).seenBy ? { c: 'bad', s: `${n(e.a)}: "비켜!" — 동료까지 휩쓸 기세로 휘두르려 한다!` } : null;
      return U(e.a).side === 0 ? { c: 'good', s: `${n(e.a)}: "${e.s}"` } :""")
rep("""      if (e.heal) return a.side === 0 ? { s: `${ga(a.name)} ${b.name}에게 다가가 상처를 살핀다.` } : null;""", """      if (e.heal) return a.side === 0 ? { s: `${ga(a.name)} ${b.name}에게 다가가 상처를 살핀다.` } : null;
      // v5.2 거구의 공격 · 방패 밀치기
      if (e.hid) return null;
      if (e.bash) return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} 방패를 앞세워 ${reul(b.name)} 밀쳐 내려 한다${e.why === '벽으로 밀침' ? ' — 벽 쪽이다!' : '.'}` };
      if (e.mode === 'sweep') return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} ${a.weapon === '둔기' ? '곤봉을' : a.weapon && a.weapon !== '맨손' ? a.weapon + '을' : '거대한 팔을'} 크게 뒤로 젖힌다 — 넓게 휘두르려 한다!` };
      if (e.mode === 'stomp') return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} 넘어진 ${b.name} 위로 ${a.weapon && a.weapon !== '맨손' ? '무기를 높이 든다' : '발을 높이 든다'}…` };""")
rep("""    case 'hit': { const a = U(e.a), b = U(e.b), far = !!e.far, v = ` (−${e.dmg}${e.part && e.part !== '몸통' ? ', ' + e.part : ''}${e.dir === 'back' ? ', 뒤' : e.dir === 'side' ? ', 측면' : ''}${e.armor ? ', ' + ga(e.armor) + ' 덜어 냄' : ''})`;""",
    """    case 'hit': { const a = U(e.a), b = U(e.b), far = !!e.far, v = ` (−${e.dmg}${e.part && e.part !== '몸통' ? ', ' + e.part : ''}${e.dir === 'back' ? ', 뒤' : e.dir === 'side' ? ', 측면' : ''}${e.pen ? ', 갑옷 관통' : e.armor ? ', ' + ga(e.armor) + ' 덜어 냄' : ''}${e.hcrit ? ', 치명타!' : ''})`;
      // v5.2 몸 충격 · 거구의 공격 · 꿰뚫음
      if (e.tag === '부딪힘') return { c: 'dim', s: `${ga(b.name)} 부딪혀 다친다 (−${e.dmg}).` };
      if (e.tag && /짓뭉개짐|짓눌림/.test(e.tag)) return { c: b.side === 0 ? 'bad' : 'good', s: `뼈가 으스러지는 소리 (−${e.dmg}).` };
      if (e.tag && /확인사살/.test(e.tag)) return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(a.name)} 넘어진 ${reul(b.name)} ${/내려찍기/.test(e.tag) ? '내려찍는다' : '짓밟는다'} — 확인사살.` };
      if (e.tag === '짓밟기' || e.tag === '내려찍기') return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(a.name)} 넘어진 ${reul(b.name)} ${e.tag === '내려찍기' ? '내려찍는다' : '짓밟는다'} (−${e.dmg}).` };
      if (e.tag && /꿰뚫림/.test(e.tag)) return { c: b.side === 0 ? 'bad' : 'good', s: `${a.name}의 ${e.jav ? '창' : '화살'}이 ${b.name}의 투구째 머리를 꿰뚫는다 — 즉사!` };
      if (e.tag === '넓게 휘두르기' && !e.block) return { c: e.ff ? 'bad' : b.side === 0 ? 'bad' : 'good', s: `${e.ff ? '휩쓸린 동료 ' : ''}${ga(b.name)} 휘두름에 맞는다${v}.` };
      if (e.tag === '찍기' && !e.block) return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(a.name)} ${reul(b.name)} 내리찍는다${v}.` };
      if (e.tag === '방패 밀치기') return null;""")
rep("""    case 'impact': return""", """    // v5.2 몸으로 싸우기
    case 'shove': if (e.how === 'bash') return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 방패로 ${reul(n(e.b))} 밀쳐 낸다${e.len >= 0.9 ? ' — 멀리 나가떨어진다' : ''}.` };
      if ((e.how === 'sweep' || e.how === 'charge') && e.len >= 1) return { s: `${ga(n(e.b))} ${e.len}칸을 날아간다!` }; return null;
    case 'bowl': return { s: `날아간 ${ga(n(e.b))} ${wa(n(e.c))} 부딪힌다!` };
    case 'crush': return { c: U(e.b).side ? 'good' : 'bad', s: e.pinned ? `${ga(n(e.b))} 벽과 ${n(e.a)} 사이에 끼어 짓눌린다!` : `${ga(n(e.b))} 벽에 처박혀 짓뭉개진다!` };
    case 'prone': if (/짓뭉개짐/.test(e.why)) return null; return { c: U(e.b).side ? 'good' : 'bad', s: e.why === '치명타' ? `${n(e.a)}의 일격에 ${ga(n(e.b))} 나동그라진다!` : `${ga(n(e.b))} 넘어진다!` };
    case 'cripple': return { c: U(e.b).side ? 'good' : 'bad', s: `${n(e.a)}의 치명타 — ${n(e.b)}의 다리가 ${e.how === '절단' ? '잘려 나간다' : '부서진다'}! ${ga(n(e.b))} 바닥을 긴다.` };
    case 'sweep': return e.ff.length ? { c: 'bad', s: `${ga(n(e.a))} 크게 휘두른다 — ${e.ff.map(n).join(' · ')}까지 휩쓸린다!` } : e.foes.length >= 2 ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 크게 휘둘러 ${e.foes.map(n).join(' · ')}을 한꺼번에 휩쓴다!` } : null;
    case 'stomp': return null;
    case 'dodge': { const k = 'd' + e.a; if (narr.seenDodge && Wd.t - (narr.seenDodge[k] || -99) < 5) return null; (narr.seenDodge = narr.seenDodge || {})[k] = Wd.t; return e.mate ? { c: 'dim', s: `${ga(n(e.a))} 동료의 휘두름을 피해 몸을 날린다.` } : { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 몸을 비틀어 ${n(e.b)}의 공격을 피한다${e.wall ? ' — 벽을 등지고도!' : '.'}` }; }
    case 'squad': return e.vis ? { c: 'bad', s: `적이 조를 나눈다. ${e.a.map(n).join(' · ')} — 옆으로 돌아 ${n(e.aim)} 쪽을 노린다!` } : { c: 'dim', s: '어둠 속에서 발소리가 옆으로 갈라진다.' };
    case 'peel': return U(e.a).side === 0 ? { c: 'good', s: `${ga(n(e.a))} ${n(e.v)}에게 달라붙은 ${reul(n(e.b))} 떼어 내러 간다.` } : null;
    case 'pinGo': return U(e.a).side ? { c: 'bad', s: `${ga(n(e.a))} 쓰러진 ${n(e.b)}에게 다가간다 — 확인사살하려 한다!` } : { c: 'good', s: `${ga(n(e.a))} 쓰러진 ${n(e.b)}에게 다가간다.` };
    case 'pinDown': { const k = 'p' + e.b; if (narr.seenPin && Wd.t - (narr.seenPin[k] || -99) < 4) return null; (narr.seenPin = narr.seenPin || {})[k] = Wd.t; return { c: U(e.b).side ? 'good' : 'bad', s: `${ga(n(e.a))} 쓰러진 ${reul(n(e.b))} 내리친다. [불사] 의 재생이 늦어진다 (${e.rise}초).` }; }
    case 'guardBreak': return { c: U(e.b).side ? 'good' : 'bad', s: `${n(e.a)}의 찍기에 ${n(e.b)}의 방패가 무너진다!` };
    case 'impact': return""")

open(P,'w',encoding='utf-8').write(s)
print('ok')
