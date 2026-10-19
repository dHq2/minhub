/* ===== run8_h.js v1.6 (v1.6: 맵 장치 — 구획 안에 돌벽 토막 (타일 벽 · 이어짐 검사) · 진지의 큰 설비 표시 (포대 자리) · 두 맵을 잘라 이은 싸움판 (MS 싸움 15% · 다른 그림 둘 · 뚫은 통로) · 판 그림 위에 v8.7.1.1 장치를 그림 · v1.5: 히든 층 (r8Hidden — run8_i) · 층 정의의 rows (줄마다 갈래) · 히든 보스는 BOSS8 의 맵 · 빈 회랑 (적 없음) · 판을 만든 뒤 r8HookI · v1.4: 도감 적 설계에 도감 정체성 특성을 이어받음 (검사 · 검방패병 · 붉은 망토 궁수 · 곤봉 거한 = [망자]) · v1.3: 21 ~ 29층 MS 하나는 챔피언 로드 관중 통로 (민수가 준 그림) · v1.2: 소품을 여럿 놓을 때 앞서 놓은 칸을 빼고 길이 끊기는지 잼 (둘째부터 모두 거절되던 것) · v1.1: 구획 이름에 씨앗 (같은 칸 이름이 다른 층 · 여정과 겹치지 않게) · 엄폐 소품 3 ~ 6) · v1.0 — v8.7.0 여정 구조 v2 (민수 명세 spec_870 A 절)
   · 층 = 주제 (지대). 무작위 층은 깊이에 맞는 지대를 뽑고, 고정층 (3 · 5 · 10 · 15 · 20 · 25 · 30) 은 화면에 "고정층" 으로 밝힘
   · 층의 흐름: MS - MS - S - MS - S - (MS / S / S 갈림길) - S - 층 보스.  MS = 그 층 맵을 잘라 만든 싸움판 · S = 인카운터 · 쉼터 · 상인 · 보물 · 정예
   · MS 는 맵 전체가 아니라 확대한 맵에서 구획을 잘라 씀 (이어진 바닥만 · 못 가는 곳은 막음) + 소품으로 엄폐 · 진지 (도감 소품 · 3기 전장 설비)
   · MS 갈래: 싸움 · 지나가기 (출구가 처음부터 열림 — 싸우지 않고 빠져나가도 됨) · 진지 (적 쪽에 바리케이드 · 설비)
   · 도감의 팩션 · 짐승 · 마족을 적 설계로 (DX8) 넣고 지대마다 무리로
   · 칼데라 (2 ~ 9층): 아주 큰 맵 · 나가는 곳은 침대 · 강적 많이 (출구는 처음부터 열림) */

// ---------- 도감 적 설계 (도감 별 = 기준 강함 · 꼴 = 무기 · 몸) ----------
const T8 = [0, [70, 16], [150, 28], [250, 38], [400, 46], [650, 54], [1000, 62], [1400, 70]];
const PRE8 = {
  bs: { cls: '기동', weapon: '이빨·발톱', height: 0.6, weight: 25, sizeCls: '소형', hp: 0.5, atk: 0.75, traits: ['회피B', '후각B'] },
  bm: { weapon: '이빨·발톱', height: 1.3, weight: 110, hp: 1, atk: 1, traits: ['근력B', '후각B'] },
  bl: { weapon: '이빨·발톱', height: 2.8, weight: 700, sizeCls: '대형', hp: 1.5, atk: 1.15, traits: ['거구', '갑피'] },
  bx: { weapon: '이빨·발톱', height: 5, weight: 4000, sizeCls: '초대형', hp: 2, atk: 1.25, traits: ['거구', '갑피'] },
  sw: { weapon: '검', height: 1.8, weight: 80 },
  sh: { weapon: '검', shield: true, height: 1.8, weight: 90, traits: ['방어 자세'] },
  sp: { weapon: '창', height: 1.8, weight: 80, traits: ['공통스킬:투창'] },
  gs: { weapon: '대검', height: 1.9, weight: 100, hp: 1.1 },
  br: { weapon: '둔기', height: 2.4, weight: 220, sizeCls: '중대형', hp: 1.35, traits: ['거구', '근력A'] },
  ar: { role: '사수', weapon: '활', ammo: 30, height: 1.75, weight: 70, hp: 0.8, traits: ['사격B'] },
  gn: { role: '사수', weapon: '권총', ammo: 30, height: 1.75, weight: 70, hp: 0.8, traits: ['사격B'] },
  rf: { role: '사수', weapon: '소총', ammo: 30, height: 1.75, weight: 75, hp: 0.85, traits: ['사격B'] },
  sn: { role: '사수', weapon: '저격총', ammo: 20, height: 1.75, weight: 70, hp: 0.7, traits: ['사격A', '은신B'] },
  sg: { role: '사수', weapon: '샷건', ammo: 24, height: 1.8, weight: 85, hp: 0.9 },
  mg: { role: '사수', weapon: '마법', height: 1.75, weight: 65, hp: 0.75 },
  as: { cls: '기동', weapon: '단검', height: 1.75, weight: 65, hp: 0.8, traits: ['회피A', '은신A', '속력A'], active: ['도약'] },
  kn: { weapon: '장검', height: 1.9, weight: 110, hp: 1.2, traits: ['갑피', '베테랑'], gear: { 몸: { name: '판금', mat: '판금', tier: 2 } } },
  cv: { weapon: '창', height: 2.6, weight: 650, sizeCls: '중대형', hp: 1.4, traits: ['속력A', '갑피'], active: ['돌진'] },
  gh: { weapon: '맨손', height: 1.7, weight: 40, hp: 0.8, traits: ['회피A', '은신B', '망자'] },
  dm: { weapon: '검', height: 1.9, weight: 85, traits: ['야시'] } };
const DX8 = [   // [이름, 도감, 별, 꼴, 더할 것, 한 줄]
  // 짐승
  ['똥개', 'C-076', 1, 'bs', {}, '굴의 들개 — 떼로 문다'],
  ['들쥐', 'C-147', 2, 'bs', { hp: 0.8 }, '사람 크기만 한 들쥐'],
  ['굴 개', 'C-139', 2, 'bs', { hp: 0.8 }, '사냥개 — 냄새로 쫓아온다'],
  ['곤충괴', 'C-143', 3, 'bm', { traits: ['갑피', '근력B'] }, '딱딱한 등딱지의 곤충 괴물'],
  ['군마', 'C-144', 1, 'bm', { cls: '기동', weight: 450, height: 1.7, sizeCls: '중대형', hp: 1.6, traits: ['속력A'] }, '주인을 잃은 군마'],
  ['스팅요', 'C-155', 4, 'bl', { traits: ['거구', '갑피', '속력B'] }, '매우 강한 괴수 — 꼬리 침'],
  ['흑우', 'C-074', 4, 'bl', { traits: ['거구', '근력A'], active: ['돌진'] }, '검은 거대 소 — 들이받는다'],
  ['거대 괴수', 'C-066', 5, 'bx', { height: 5, weight: 5000 }, '10M 마계 괴수'],
  ['거대괴수B', 'C-237', 4, 'bl', {}, '거대 괴수 (작은 쪽)'],
  ['보라빛 대낫 괴수', 'C-246', 3, 'bl', { hp: 1.2, traits: ['거구', '속력B'] }, '낫 같은 팔의 괴수'],
  ['민트괴수', 'C-242', 2, 'bm', {}, '민트빛 괴수'],
  ['기묘한 적 생물', 'C-137', 1, 'bs', { hp: 0.9 }, '굴의 기묘한 생물'],
  ['이질적인 기묘한 적', 'C-134', 1, 'bm', { hp: 0.7 }, '이세계 짐승'],
  ['눈깔괴물', 'C-080', 4, 'bm', { role: '사수', weapon: '마법', hp: 0.9 }, '눈에서 빛을 쏜다'],
  ['성난 인광달팽이', 'C-037', 2, 'bm', { weight: 200, traits: ['갑피'], hp: 1.2 }, '화가 난 인광달팽이 — 주변을 부순다'],
  // 슬라임 · 심해
  ['슬라임녀', 'C-063', 1, 'sw', { weapon: '맨손', traits: ['재생'] }, '찢어도 붙는다'],
  ['젤리 괴물', 'C-065', 1, 'bm', { weapon: '맨손', traits: ['재생'] }, '초록 젤리'],
  ['산호천사', 'C-125', 3, 'sp', { traits: ['갑피', '가호:바다'] }, '심해 부족 — 적대하면 매우 강함'],
  // 마족
  ['꼬마악마', 'C-068', 1, 'bs', { weapon: '단검' }, '작은 악마'],
  ['마족녀', 'C-071', 1, 'dm', {}, '떠도는 마족'],
  ['떠돌이 마족', 'C-129', 3, 'dm', {}, '무리지어 다니는 마족'],
  ['마족 전사', 'C-130', 3, 'dm', { weapon: '대검', traits: ['야시', '근력A'] }, '개개인이 모두 강한 마족'],
  ['반미', 'C-091', 4, 'gn', { traits: ['사격A', '야시'] }, '원거리 악마'],
  ['노란악마', 'C-128', 2, 'dm', { weapon: '창', traits: ['야시', '속력B'] }, '노란악마 팩션의 전사'],
  ['노란악마녀', 'C-231', 4, 'mg', { traits: ['보스', '회피A'] }, '노란악마 팩션의 우두머리'],
  ['요정악마', 'C-127', 1, 'bs', { role: '사수', weapon: '마법' }, '정령계의 악한 요정'],
  ['톱날 대검 망토 기사', 'C-187', 3, 'gs', { traits: ['지휘A', '베테랑'] }, '마계의 장군'],
  ['검은 뿔 귀족', 'C-252', 3, 'kn', {}, '귀족적인 중세 마계 종족'],
  ['검은 장막 술사', 'C-253', 3, 'mg', {}, '검은 장막 — 같은 종족의 술사'],
  // 망령 · 유령
  ['귀신 유령', 'C-075', 2, 'gh', {}, '흐릿하게 떠다니는 귀신'],
  ['귀신녀', 'C-230', 4, 'gh', { traits: ['보스', '회피A', '은신A'] }, '귀신의 우두머리'],
  ['망령A', 'C-251', 5, 'gh', { weapon: '장검', traits: ['보스', '망자', '회피B'] }, '망령계의 대장'],
  ['망령군', 'C-258', 2, 'sw', { traits: ['망자'] }, '창랑의 종족 — 쇠퇴한 망령계'],
  ['낙오 방랑자', 'C-119', 2, 'sw', {}, '굴에 떨어진 방랑자'],
  // 사람 · 기사
  ['검사', 'C-052', 2, 'sw', {}, '칼잡이'],
  ['창병', 'C-053', 2, 'sp', {}, '창병'],
  ['창병2', 'C-162', 1, 'sp', {}, '어린 창병'],
  ['검방패병', 'C-054', 2, 'sh', {}, '검과 방패'],
  ['방패곤봉', 'C-149', 2, 'sh', { weapon: '둔기' }, '방패와 곤봉'],
  ['방패대검', 'C-150', 2, 'gs', {}, '대검을 든 방패병'],
  ['성방패', 'C-154', 2, 'sh', { traits: ['방어 자세', '신성D'] }, '성스러운 방패'],
  ['적기사', 'C-160', 1, 'kn', { hp: 0.9 }, '붉은 기사'],
  ['검방흑기사', 'C-141', 4, 'kn', { shield: true }, '검과 방패의 흑기사'],
  ['흑기사창병', 'C-164', 4, 'kn', { weapon: '창', traits: ['갑피', '베테랑', '공통스킬:투창'] }, '흑기사 창병'],
  ['도끼기사', 'C-083', 4, 'kn', { weapon: '대검' }, '도끼 기사'],
  ['기병기사', 'C-072', 4, 'cv', {}, '말을 탄 기사 — 돌진'],
  ['해머기사', 'C-233', 3, 'kn', { weapon: '둔기' }, '망치 기사'],
  ['광신도', 'C-064', 2, 'sw', { weapon: '단검' }, '광신도'],
  ['막아서는 자', 'C-084', 1, 'sh', {}, '길을 막아서는 자'],
  ['지키는자', 'C-161', 4, 'sh', { traits: ['갑피', '방어 자세', '베테랑'] }, '무언가를 지키는 자'],
  ['벤킨', 'C-057', 3, 'sw', {}, '벤킨'],
  ['붉은 망토 궁수', 'C-056', 3, 'ar', { traits: ['사격A'] }, '붉은 망토의 궁수'],
  ['곤봉 거한', 'C-055', 3, 'br', {}, '곤봉을 든 거한'],
  ['손가락 구멍', 'C-050', 3, 'bm', { weapon: '맨손' }, '손가락 구멍'],
  ['샷건병', 'C-152', 1, 'sg', {}, '샷건'],
  ['저격총수', 'C-159', 2, 'sn', {}, '저격총수'],
  ['멧돼지방패병', 'C-148', 1, 'sh', {}, '멧돼지 방패병'],
  ['관남', 'C-167', 1, 'sw', {}, '관을 쓴 사내'],
  ['철의 잔재', 'C-118', 3, 'kn', {}, '함께 떨어진 낙오 기사들'],
  ['수인족 기사', 'C-115', 2, 'kn', { traits: ['갑피', '속력B'] }, '수인계 팩션의 기사'],
  ['선봉장', 'C-232', 3, 'kn', { shield: true, active: ['돌진'], traits: ['갑피', '지휘B', '베테랑'] }, '선봉장 (강적)'],
  ['테드', 'C-249', 4, 'br', {}, '테드 (강적)'],
  ['대전사 마카로프', 'C-210', 4, 'gs', { traits: ['베테랑', '근력A'] }, '대전사 (강적)'],
  ['아컴', 'C-227', 4, 'kn', { traits: ['갑피', '지휘A', '베테랑'] }, '장군'],
  ['카키', 'C-239', 3, 'as', {}, '카키 (중간급)'],
  ['레임', 'C-243', 3, 'sw', { traits: ['회피A'] }, '레임 (중간급)'],
  ['마도사', 'C-240', 3, 'mg', {}, '마도사'],
  ['푸른 뚱보', 'C-079', 4, 'br', {}, '푸른 뚱보'],
  ['일반적괴물', 'C-157', 1, 'bm', {}, '괴물'],
  ['니드런', 'C-146', 3, 'sw', { traits: ['회피B'] }, '니드런'],
  ['부케', 'C-185', 5, 'gs', { traits: ['갑피', '베테랑'] }, '부족의 이레귤러 — 딜탱'],
  ['마리의 부족민', 'C-109', 3, 'sp', {}, '마리와 같은 부족'],
  ['붉은 부족 전사', 'C-110', 2, 'sw', {}, '어딘가에 적응한 부족'],
  ['심연의 그림자 생존자', 'C-113', 3, 'as', { traits: ['은신A', '회피B'] }, '굴에 정착한 종족'],
  // 도깨비 · 요괴
  ['일반개비', 'C-180', 1, 'sw', { weapon: '둔기', traits: ['야시'] }, '도깨비'],
  ['도깨비 패거리', 'C-156', 1, 'sw', { weapon: '둔기', traits: ['야시'] }, '도깨비 패거리'],
  ['청승', 'C-088', 3, 'mg', { traits: ['회피B'] }, '도깨비 자매 — 언니'],
  ['작약', 'C-089', 3, 'sw', { traits: ['회피A', '속력A'] }, '도깨비 자매 — 동생'],
  ['아량', 'C-217', 4, 'kn', { traits: ['갑피', '보스', '지휘A'] }, '요괴 장수 (보스)'],
  ['보광', 'C-090', 4, 'mg', {}, '마법 딜러'],
  ['광냥', 'C-092', 4, 'as', { weapon: '검' }, '중간보스급 고양이 검객'],
  // 정령
  ['꼬마요정', 'C-069', 1, 'bs', { role: '사수', weapon: '마법' }, '작은 요정'],
  ['요정', 'C-126', 1, 'bs', { role: '사수', weapon: '마법', hp: 0.6 }, '떠도는 요정'],
  ['짐승 마인', 'C-116', 3, 'sp', { traits: ['후각B'] }, '정령을 숭배하는 부족 — 저주 · 특수 효과'],
  ['텐던 콰이어', 'C-257', 4, 'mg', { traits: ['갑피'] }, '힘줄 성가대 — 광신도 종족의 강적'],
  ['뿌리 광신도', 'C-255', 2, 'sw', { weapon: '단검' }, '마젠타 뿌리 군단 — 정령계열'],
  // 기계 · 천사 · 외계
  ['기계인간', 'C-123', 3, 'rf', { traits: ['갑피', '사격B'] }, 'SF 계열의 낙오자'],
  ['기계천사', 'C-124', 2, 'sp', { traits: ['갑피'], active: ['도약'] }, '기계천사 — 하나를 건드리면 모두 적대'],
  ['고대천사', 'C-067', 4, 'kn', { traits: ['갑피', '신성C'], active: ['도약 강타'] }, '고대천사'],
  ['창백한 천공군', 'C-256', 3, 'sp', { traits: ['신성D'], active: ['도약'] }, '창백한 천공군'],
  ['푸른 외투단', 'C-254', 3, 'rf', { traits: ['사격A', '베테랑'] }, '기계 · 사이버 · 외계 종족'],
  ['천천', 'C-105', 3, 'sn', { traits: ['사격S', '은신B'] }, '저격수 — 포획 가능한 유일 개체'],
  ['외계인', 'C-132', 2, 'mg', {}, '외계 종족'],
  ['경찰', 'C-142', 1, 'gn', {}, '굴의 경찰'],
  // 히든 · 고대
  ['고대 몬스터 데두라', 'C-078', 7, 'bx', { traits: ['보스', '거구', '갑피'] }, '둥둥 떠다니며 광역 저주를 뿌림'],
  ['고대 몬스터 햘', 'C-073', 7, 'bx', { traits: ['보스', '거구', '갑피', '속력B'] }, '세계관 최상위 고대종 — 개미여왕'],
  ['렉사', 'C-100', 7, 'kn', { traits: ['보스', '신성A', '갑피', '회피A'], active: ['도약 강타'] }, '현존하는 고대천사 셋 중 하나'],
  ['하르겐', 'C-047', 7, 'kn', { weapon: '대검', traits: ['보스', '베테랑', '갑피', '회피A'] }, '천천히 걸어오며 싸움이 시작된다'],
  ['봉인된 시체', 'C-151', 5, 'gh', { traits: ['보스', '망자', '재생'] }, '봉인을 풀면 광범위 저주'] ];
for (const [key, ref, tier, pre, o, note] of DX8){
  if (FOE8[key]) continue;
  const P = PRE8[pre] || PRE8.sw, [hp0, atk0] = T8[tier] || T8[2], hm = o.hp || P.hp || 1, am = o.atk || P.atk || 1;
  const d = { cls: o.cls || P.cls || (((o.role || P.role) === '사수') ? '원거리' : '근접'), weapon: o.weapon || P.weapon, role: o.role || P.role || '공격수', height: o.height || P.height || 1.8, weight: o.weight || P.weight || 80, ov: { hp: Math.round(hp0 * hm), atk: Math.round(atk0 * am) }, traits: [...(o.traits || P.traits || [])] };
  if (o.sizeCls || P.sizeCls) d.sizeCls = o.sizeCls || P.sizeCls;
  if (o.shield != null ? o.shield : P.shield) d.shield = true;
  if (o.ammo || P.ammo) d.ammo = o.ammo || P.ammo;
  if (o.active || P.active) d.active = [...(o.active || P.active)];
  if (o.gear || P.gear) d.gear = clone(o.gear || P.gear);
  if (typeof idTraits === 'function') for (const t of idTraits(ref)) if (!d.traits.includes(t)) d.traits.push(t);   // 도감 정체성 (예: 1층 망자 병사들의 [망자]) 은 그대로
  FOE8[key] = { key, name: key, side: 1, ref, tier, nv: true, nvG: 'A', tactic: note, note, ...d };
}

// ---------- 지대 (층의 주제) ----------
// maps: 그 지대의 그림 맵 (칸 지도가 있는 것만 씀) · d: 나오는 층 · w: 무게 · band: 무리 · el: 층 보스 (정예) 후보 · fort: 진지 소품 갈래 · rock: 엄폐 소품 갈래
const THEME8 = {
  sewer: { name: '하수구', d: [2, 6], w: 1, maps: ['sewer1', 'sewer2', 'sewer3'], band: [['하수구 쥐', 3], ['쥐 기사', 1.5], ['들쥐', 1.5], ['하수구 망자', 2], ['슬라임녀', 1], ['젤리 괴물', 1], ['이계악마 망향', 0.6], ['게 몬스터', 0.5]], el: ['rats'], fort: 'camp', rock: 'rubble', narr: ['계단은 물 흐르는 소리 쪽으로 이어진다.', '썩은 물 냄새. 그리고 — 작은 발톱들이 벽을 긁는 소리.'] },
  cave: { name: '동굴', d: [2, 8], w: 1, maps: ['cave1', 'cave2', 'cave3', 'lime1', 'lime2', 'lime3'], band: [['등딱지 딱정벌레', 2], ['삼각머리 짐승', 2], ['바위껍질 짐승', 1.5], ['곤충괴', 1], ['성난 인광달팽이', 0.8], ['하수구 망자', 1], ['괴수 A', 0.5]], el: ['stingyo', 'beastA'], fort: null, rock: 'rubble', narr: ['동굴이 넓어지며 차가운 바람이 분다.', '어둠 속에서 무언가 바위를 긁는다.'] },
  dream: { name: '몽환동굴', d: [3, 9], w: 0.9, maps: ['dream1', 'dream2', 'dream3'], band: [['이질적인 기묘한 적', 2], ['기묘한 적 생물', 2], ['꼬마요정', 1.5], ['요정악마', 1], ['귀신 유령', 1.5]], el: ['ghostlady'], fort: null, rock: 'odd', narr: ['벽이 숨을 쉬듯 빛을 낸다.', '오래 걸었는데도 같은 자리인 것 같다.'] },
  crystal: { name: '수정동굴', d: [2, 9], w: 0.9, maps: ['crystal1', 'crystal2', 'crystal3'], band: [['슬라임', 3], ['젤리 괴물', 1.5], ['등딱지 딱정벌레', 1.5], ['바위껍질 짐승', 1], ['굴란', 0.3]], el: ['rockgiant'], fort: null, rock: 'odd', narr: ['수정이 횃불을 받아 사방으로 빛을 흩뿌린다.', '바닥이 젤리처럼 출렁인다.'] },
  forest: { name: '어두운 숲', d: [2, 9], w: 1, maps: ['forest1', 'forest2', 'forest3', 'forestb1', 'forestc1', 'forestc2', 'forestc3', 'road1'], band: [['똥개', 3], ['굴 개', 1.5], ['곤충괴', 1], ['민트괴수', 1], ['짐승 마인', 1], ['보라빛 대낫 괴수', 0.5], ['군마', 0.5]], el: ['stingyo', 'scythe'], fort: 'camp', rock: 'nature', narr: ['굴 안에 숲이 있다. 나무들이 빛 없이 자란다.', '뼈가 걸린 가지 사이로 무언가 지나간다.'] },
  medieval: { name: '중세 폐허', d: [2, 9], w: 1, maps: ['med1', 'med2', 'medr1', 'medr2', 'medr3'], band: [['검사', 2], ['창병', 2], ['검방패병', 1.5], ['붉은 망토 궁수', 1], ['광신도', 1.5], ['낙오 방랑자', 1.5], ['곤봉 거한', 0.6], ['샷건병', 0.5]], el: ['blackknights'], fort: 'camp', rock: 'rubble', narr: ['통째로 떨어진 중세 마을. 우물에서 아직 물이 찰랑인다.', '창문마다 누군가 숨어 있다.'] },
  caldera: { name: '칼데라', d: [2, 9], w: 0.45, maps: ['caldera'], band: [['스팅요', 1], ['곤봉 거한', 1.5], ['흑우', 0.8], ['검방흑기사', 1], ['보라빛 대낫 괴수', 1], ['붉은 망토 궁수', 1.5], ['괴수 A', 1]], el: ['calderabed'], fort: 'camp', rock: 'rubble', strong: true, narr: ['하얀 분화구. 끝이 보이지 않는다.', '저 멀리 — 분화구 한가운데에 침대 하나가 놓여 있다.'] },
  neon: { name: '마젠타 도시', d: [5, 13], w: 1, maps: ['magenta1', 'magenta2', 'magenta3', 'magenta4', 'magenta5', 'magenta6', 'magenta7', 'magenta8'], band: [['사이버 암살자', 2], ['네온 총잡이', 2], ['블루블랙 전투단', 1.2], ['경찰', 1], ['뿌리 광신도', 1], ['쥐 기사', 0.5]], el: ['jelly'], fort: 'urban', rock: 'urban', narr: ['갑자기 하늘이 생긴다 — 가짜 하늘이다. 네온 간판이 깜빡인다.', '빗물에 네온이 번진다.'] },
  yokai: { name: '요괴 마을', d: [6, 14], w: 1, maps: ['yokai1', 'yokai2', 'yokai3', 'yokai4', 'dokkaebi1', 'east1', 'east2', 'east3'], band: [['도깨비 졸개', 2], ['도깨비 궁수', 1.5], ['일반개비', 2], ['도깨비 패거리', 1.5], ['청승', 0.5], ['작약', 0.5], ['광냥', 0.3], ['마노', 0.4]], el: ['hong', 'aryang'], fort: 'camp', rock: 'nature', narr: ['초롱불이 저절로 켜진다.', '처마 밑에서 도깨비불이 웃는다.'] },
  mari: { name: '마리부족', d: [6, 14], w: 0.8, maps: ['mari0', 'mari1', 'mari2', 'marial1', 'marial2', 'marial3'], band: [['마리의 부족민', 2.5], ['붉은 부족 전사', 1.5], ['수인족 기사', 1], ['멧돼지방패병', 1], ['벤킨', 0.8]], el: ['buke'], fort: 'camp', rock: 'rubble', narr: ['황금빛 등불이 이어진 부족의 도시.', '부족민들이 우리를 사냥감처럼 본다.'] },
  maze: { name: '지하미궁', d: [6, 16], w: 0.8, maps: ['maze0', 'maze1', 'maze2'], band: [['손가락 구멍', 1.5], ['막아서는 자', 2], ['해머기사', 1], ['망령군', 1.5], ['일반적괴물', 1.5], ['니드런', 0.8]], el: ['guardian'], fort: null, rock: 'rubble', narr: ['같은 모양의 방이 끝없이 이어진다.', '벽 너머에서 무거운 발소리가 돈다.'] },
  hell: { name: '심계 (지옥계)', d: [9, 18], w: 1, maps: ['hell1', 'hell2', 'hell3', 'hell4', 'hellx1', 'hellx3'], band: [['심계 병사', 3], ['심계 궁병', 2], ['꼬마악마', 1.5], ['마족녀', 1], ['반미', 0.5], ['기체 B', 0.5]], el: ['hunter', 'heukwoo'], fort: 'grim', rock: 'rubble', narr: ['공기가 뜨겁다. 쇠사슬 끄는 소리.', '처형장의 불은 꺼진 적이 없다.'] },
  abyss: { name: '심계 (마계)', d: [11, 19], w: 1, maps: ['abyss1', 'abyss2', 'abyss3', 'abyss4', 'abyss5'], band: [['하류', 1.2], ['흑익', 1.2], ['떠돌이 마족', 2], ['마족 전사', 1], ['노란악마', 1], ['마신족 병사', 0.7], ['검은 뿔 귀족', 0.6], ['검은 장막 술사', 0.6]], el: ['redarmor', 'sawblade', 'yellow'], fort: 'grim', rock: 'rubble', narr: ['마족의 노랫소리가 바람에 섞인다.', '뼈로 된 아치 아래로 길이 난다.'] },
  gothic: { name: '고딕 폐허', d: [11, 19], w: 0.9, maps: ['gothic1', 'gothic2', 'gothic3'], band: [['검방흑기사', 1], ['흑기사창병', 1], ['도끼기사', 0.8], ['성방패', 1.5], ['적기사', 2], ['귀신 유령', 1]], el: ['oldangel', 'redarmor'], fort: 'camp', rock: 'rubble', narr: ['석상들이 고개를 돌린 것 같다.', '무너진 첨탑 아래로 길이 난다.'] },
  impious: { name: '불경', d: [11, 19], w: 0.8, maps: ['impious1', 'impious2', 'impious3', 'impious4', 'impious5'], band: [['광신도', 3], ['뿌리 광신도', 2], ['텐던 콰이어', 0.6], ['포자', 1.5], ['귀신 유령', 1]], el: ['tendon'], fort: 'arc', rock: 'odd', narr: ['분홍 이끼가 뼈 석상을 덮고 있다.', '누군가 낮게 찬송을 부른다 — 신을 모욕하는 노래를.'] },
  deep: { name: '심해', d: [12, 24], w: 0.5, maps: ['deep1', 'deep2', 'deep3'], band: [['산호천사', 1.5], ['젤리 괴물', 2], ['슬라임녀', 1.5], ['게 몬스터', 1]], el: ['coral'], fort: 'odd', rock: 'odd', narr: ['숨이 막히지 않는 바다 밑. 해파리가 빛을 낸다.', '산호 사이로 무언가 우리를 지켜본다.'] },
  neo: { name: '네오의 경계', d: [13, 19], w: 0.7, maps: ['neodemon1', 'neodemon2', 'neodemon3', 'neodemon4', 'neodemon5', 'neodemon6', 'neospirit1', 'neospirit2', 'neospirit3', 'neospirit4', 'neospirit5'], band: [['하류', 1], ['흑익', 1], ['포자', 1], ['천사 경비병', 1], ['기계인간', 0.8], ['반미', 0.5]], el: ['hadimguard'], fort: 'mech', rock: 'urban', narr: ['두 세계가 겹쳐 보인다 — 네온 마계와 빛나는 정령의 도시.', '붉은 등과 푸른 등이 같은 거리에 걸려 있다.'] },
  spirit: { name: '정령계', d: [14, 22], w: 1, maps: ['spirit1', 'spirit2', 'spirit3', 'spirit4', 'spirit5', 'spirit6', 'spiritc1', 'spiritc2', 'spiritc3'], band: [['포자', 2], ['꼬마요정', 1.5], ['요정', 1], ['요정악마', 1], ['짐승 마인', 1.5], ['천사 경비병', 0.8]], el: ['beastmen'], fort: 'arc', rock: 'odd', narr: ['나무뿌리가 다리가 되고, 빛이 길이 된다.', '정령들이 우리를 시험하듯 따라온다.'] },
  machina: { name: '기계천사계', d: [16, 24], w: 1, maps: ['machina1', 'machina2', 'machina3'], band: [['천사 경비병', 2], ['기계천사', 2], ['기계인간', 1], ['기체 A', 0.6], ['기체 B', 1], ['창백한 천공군', 1]], el: ['machinaA', 'oldangel'], fort: 'mech', rock: 'urban', narr: ['날개 달린 기계들이 하늘을 덮는다.', '찬송가가 기계음으로 반복된다.'] },
  temple: { name: '성전', d: [16, 24], w: 1, maps: ['temple1', 'temple2', 'temple3', 'temple4', 'temple5', 'church1'], band: [['쌍피스톨기사', 1.5], ['오리엔탈 피스톨', 1.5], ['갈퀴창 병사', 2], ['철판포 거한', 0.6], ['장총 척후', 1], ['성방패', 1]], el: ['arkum'], fort: 'iron', rock: 'rubble', narr: ['향 냄새. 그리고 총 기름 냄새.', '기사단과 교단이 같은 문을 지킨다.'] },
  cyber: { name: '중화사이버', d: [21, 26], w: 1, maps: ['roof1', 'roof2', 'roof3', 'cyber1', 'cyber2', 'cyber3', 'cyber4'], band: [['사이버 암살자', 2], ['블루블랙 전투단', 2], ['푸른 외투단', 1.2], ['기체 B', 1], ['네온 총잡이', 1], ['천천', 0.2]], el: ['machinaB', 'bluecoat'], fort: 'mech', rock: 'urban', narr: ['간판의 글자가 계속 바뀐다.', '관중의 함성이 도시 전체에 울린다.'] },
  war: { name: '전장', d: [21, 27], w: 1, maps: ['siege1', 'siege2', 'siege3', 'field1', 'field2', 'field3'], band: [['갈퀴창 병사', 2.5], ['장총 척후', 2], ['철판포 거한', 1], ['마신족 병사', 1], ['저격총수', 1], ['기병기사', 0.6], ['선봉장', 0.4], ['붉은갑주', 0.3]], el: ['giant', 'makarov'], fort: 'iron', rock: 'rubble', narr: ['포성. 깃발. 끝없는 진흙.', '성벽 위에서 거인의 그림자가 일어선다.'] },
  other: { name: '이계', d: [22, 29], w: 0.8, maps: ['other1', 'other2', 'other3'], band: [['등딱지 딱정벌레', 1.5], ['삼각머리 짐승', 1.5], ['바위껍질 짐승', 1.5], ['외계인', 1.5], ['이질적인 기묘한 적', 1]], el: ['oddbeast'], fort: 'odd', rock: 'odd', narr: ['각진 바위판이 허공에 떠 있다.', '이세계의 짐승들이 교차로에 모인다.'] },
  void: { name: '차원의 틈', d: [24, 29], w: 1, maps: ['dim1', 'dim2', 'dim3', 'eye1', 'eye0', 'eye2'], band: [['흑익', 1], ['하류', 1], ['기체 B', 1], ['포자', 1], ['눈깔괴물', 0.8]], el: ['mask'], fort: 'odd', rock: 'odd', narr: ['공간이 접힌다. 거대한 눈이 깜빡인다.', '가면을 쓴 누군가가 또 웃는다.'] },
  data: { name: '데이터', d: [26, 29], w: 1, maps: ['data1', 'data2', 'data3'], band: [['@saved', 3], ['기체 B', 1], ['블루블랙 전투단', 1]], el: ['forget'], fort: 'mech', rock: 'urban', narr: ['벽이 숫자로 흘러내린다.', '관리자의 작업장 — 지난 도전자들이 저장되어 있다.'] } };
for (const [k, T] of Object.entries(THEME8)) BAND8['t_' + k] = T.band;   // r8Foes 가 쓰는 무리
// 지대 층 보스 (정예)
Object.assign(ELITE8, {
  rats: { name: '쥐떼와 게 괴물', foes: [['게 몬스터', 1], ['쥐 기사', 2], ['하수구 쥐', 4]] },
  stingyo: { name: '스팅요', foes: [['스팅요', 1], ['곤충괴', 2]] },
  beastA: { name: '동굴의 괴수', foes: [['괴수 A', 1], ['바위껍질 짐승', 2], ['삼각머리 짐승', 2]] },
  ghostlady: { name: '귀신녀', foes: [['귀신녀', 1], ['귀신 유령', 3]] },
  rockgiant: { name: '붉은암석', foes: [['붉은암석', 1], ['바위껍질 짐승', 2]] },
  scythe: { name: '보라빛 대낫 괴수', foes: [['보라빛 대낫 괴수', 2], ['똥개', 4]] },
  blackknights: { name: '흑기사단', foes: [['검방흑기사', 1], ['흑기사창병', 2], ['붉은 망토 궁수', 2]] },
  calderabed: { name: '칼데라 — 침대까지', foes: [['스팅요', 1], ['흑우', 1], ['곤봉 거한', 2], ['검방흑기사', 1], ['붉은 망토 궁수', 3], ['보라빛 대낫 괴수', 1]], open: true },
  aryang: { name: '요괴 장수 아량', foes: [['아량', 1], ['일반개비', 3], ['청승', 1], ['작약', 1]] },
  buke: { name: '부케와 부족 전사들', foes: [['부케', 1], ['수인족 기사', 2], ['벤킨', 2]] },
  guardian: { name: '지키는자', foes: [['지키는자', 1], ['해머기사', 2], ['손가락 구멍', 2]] },
  heukwoo: { name: '흑우와 심계 병사', foes: [['흑우', 1], ['심계 병사', 3], ['심계 궁병', 1]] },
  sawblade: { name: '톱날 대검의 장군', foes: [['톱날 대검 망토 기사', 1], ['떠돌이 마족', 2], ['마족 전사', 2]] },
  yellow: { name: '노란악마녀', foes: [['노란악마녀', 1], ['노란악마', 4]] },
  oldangel: { name: '고대천사', foes: [['고대천사', 1], ['성방패', 2], ['검방흑기사', 1]] },
  tendon: { name: '힘줄 성가대', foes: [['텐던 콰이어', 2], ['광신도', 3]] },
  coral: { name: '산호천사 부족', foes: [['산호천사', 3], ['젤리 괴물', 2]] },
  hadimguard: { name: '네오의 문지기', foes: [['하류', 1], ['흑익', 1], ['반미', 1], ['기계인간', 2]] },
  beastmen: { name: '짐승 마인 부족', foes: [['짐승 마인', 3], ['요정악마', 2], ['포자', 1]] },
  arkum: { name: '장군 아컴', foes: [['아컴', 1], ['쌍피스톨기사', 2], ['성방패', 2]] },
  bluecoat: { name: '푸른 외투단과 천천', foes: [['푸른 외투단', 3], ['천천', 1]] },
  makarov: { name: '대전사 마카로프', foes: [['대전사 마카로프', 1], ['선봉장', 1], ['갈퀴창 병사', 3]] },
  oddbeast: { name: '이계의 교차로', foes: [['거대괴수B', 1], ['등딱지 딱정벌레', 2], ['외계인', 2]] } });
NODE8.ms = { ic: '⚔', nm: '싸움' };

// ---------- 고정층 ----------
// seq 가 있으면 그 칸들만 (S 하나짜리 층) · theme 가 있으면 그 지대로 일반 흐름 + top
const FIX8 = {
  3: { theme: 'cave', name: '여신의 호수', top: { t: 'fixed', k: 'goddess' } },
  5: { theme: 'crystal', name: '수정동굴 — 세르파의 왕국', top: { t: 'boss', b: 'serpa' } },
  10: { name: '레지나의 알현실', band: 'yokai', seq: [{ t: 'boss', b: 'regina' }], settle: true, narr: ['검은 복도가 끝없이 이어진다.', '옥좌 위에 권태로운 기사 하나.'] },
  15: { theme: 'neo', name: '네오의 경계', top: { t: 'boss', b: 'neo' } },
  20: { name: '테이론의 우주', band: 'space', maps: ['theron'], seq: [{ t: 'boss', b: 'theron' }], settle: true, narr: ['하얀 공간. 아무것도 없다.', '그가 검을 뽑는 순간 — 별이 쏟아진다.'] },
  25: { name: '삼신의 피바다', band: 'gods', maps: ['blood'], seq: [{ t: 'boss', b: 'gods' }], narr: ['붉은 바다 위의 무대. 세 개의 옥좌.', '세 초월자가 우리를 내려다본다.'] },
  30: { name: '스타디움', band: 'stadium', maps: ['stadium'], seq: [{ t: 'final' }], final: true, narr: ['피라미드 꼭대기에서 디스코볼이 돈다.', '관중석이 터져 나갈 듯하다.'] } };
const r8MapOk = id => !!(MAPS8[id] && MAPS8[id].rows);
function r8PickTheme(f){
  const R = R8S(); R.themes = R.themes || {};
  if (R.themes[f]) return R.themes[f];
  const recent = [R.themes[f - 1], R.themes[f - 2]], used = new Set(Object.values(R.themes));
  const L = Object.entries(THEME8).filter(([k, T]) => f >= T.d[0] && f <= T.d[1] && !recent.includes(k) && T.maps.some(r8MapOk)).map(([k, T]) => [k, T.w * (used.has(k) ? 0.3 : 1)]);
  const k = L.length ? r8WPick(L) : 'cave'; R.themes[f] = k; return k;
}
// 층 정의를 F8[f] 에 (다른 코드가 F8 을 읽음: 이름 · 무리 · 나레이션 · 정산)
function r8FloorDef(f){
  const HD = typeof r8Hidden === 'function' ? r8Hidden(f) : null;
  if (HD){ const tk = HD.band.replace(/^t_/, ''), T = THEME8[tk] || {}; const D = { ...HD, maps: [], theme: tk, fixed8: false, settle: false, final: false, strong: true, narr: HD.narr || T.narr || [] }; const last = HD.rows[HD.rows.length - 1].find(x => x.t === 'boss'); if (last) D.boss = last.b; F8[f] = D; return D; }
  const X = FIX8[f]; let T = null, tk = null;
  if (X && X.theme){ tk = X.theme; (R8S().themes = R8S().themes || {})[f] = tk; } else if (!X) tk = r8PickTheme(f);
  if (tk) T = THEME8[tk];
  const D = { name: (X && X.name) || (T && T.name) || '', band: X && X.band ? X.band : 't_' + tk, maps: X && X.maps ? X.maps : T ? T.maps.filter(r8MapOk) : [], narr: (X && X.narr) || (T && T.narr) || [], theme: tk, fixed8: !!X, seq: X && X.seq, top: X && X.top, settle: !!(X && X.settle), final: !!(X && X.final), strong: !!(T && T.strong) };
  if (X && X.top && X.top.t === 'boss') D.boss = X.top.b; if (X && X.top && X.top.t === 'fixed') D.fixed = X.top.k;
  if (X && X.seq && X.seq[0].t === 'boss') D.boss = X.seq[0].b;
  F8[f] = D; return D;
}

// ---------- 갈림길 대신: 층의 흐름 ----------
// MS - MS - S - MS - S - (MS / S / S) - S - 층 보스
function r8Gen(f){
  const D = r8FloorDef(f), R = R8S(), rnd = Math.random;
  const msKind = () => { const r = rnd(); return D.theme === 'caldera' ? 'open' : r < 0.16 ? 'pass' : r < 0.36 && THEME8[D.theme] && THEME8[D.theme].fort ? 'fort' : 'fight'; };
  const sPick = () => r8WPick([['enc', 46], ['rest', 15], ['shop', 12], ['chest', 10], ['elite', f >= 3 ? 9 : 0], ['fight', 8]].filter(x => x[1] > 0));
  const mk = (r, i, n, t) => { const o = { id: `n${r}_${i}`, r, i, x: (i + 0.5) / n, next: [], seed: 1 + Math.floor(rnd() * 1e9) };
    if (t === 'ms'){ o.t = 'fight'; o.ms = msKind(); } else if (t === 's'){ o.t = sPick(); o.s = true; if (o.t === 'elite') o.e = r8Pick(((THEME8[D.theme] || {}).el || ['hall'])); } else Object.assign(o, t); return o; };
  let plan;
  if (D.rows) plan = D.rows.map(row => row.map(x => ({ ...x })));   // 히든 층
  else if (D.seq) plan = [D.seq.map(x => ({ ...x }))];
  else { const top = D.top ? { ...D.top } : { t: 'elite', e: r8Pick((THEME8[D.theme] || {}).el || ['hall']), top: true };
    plan = [['ms'], ['ms'], ['s'], ['ms'], ['s'], ['ms', 's', 's'], ['s'], [top]]; }
  const rows = plan.map((row, r) => row.map((t, i) => mk(r, i, row.length, t)));
  for (const row of rows) for (const nd of row) if (nd.t === 'elite' && !ELITE8[nd.e]) nd.e = 'hall';
  if (f >= 21 && f < 30 && !D.seq && !D.rows && r8MapOk('champ')){ const L = rows.flat().filter(nd => nd.ms === 'fight'); if (L.length){ const nd = r8Pick(L); nd.src8 = 'champ'; nd.champ = true; } }   // 챔피언 로드: 관중 통로에서 한 판
  const last = rows[rows.length - 1][0]; if (last.t === 'boss'){ last.id = 'boss'; }   /* 히든 층: 마지막 줄 = 보스 / 계단 */ else if (last.t === 'final') last.id = 'final'; else if (last.t === 'fixed') last.id = 'fixed';
  if (!D.seq && !D.rows && last.t !== 'boss' && last.t !== 'fixed') last.stair = true;   // 층 보스를 이기면 아래로
  for (let r = 0; r < rows.length - 1; r++) for (const a of rows[r]) a.next = rows[r + 1].map(b => b.id);
  return { rows, v: 2 };
}
// 층 카드 — 고정층 · 무작위 지대를 밝힘
function r8FloorCard(f, then){
  const F = F8[f] || {}, el = $('ldFx'); if (!el){ then(); return; }
  const kind = F.final ? '🏟 결승 — 고정층' : F.fixed8 ? `✧ 고정층${F.boss ? ' · 👑 보스' : ''}` : `무작위 지대 · ${esc(F.name || '')}`;
  el.className = 'ldfx' + (F.band === 'stadium' ? ' lite' : ''); el.style.setProperty('--ldMs', '3200ms');
  el.innerHTML = `<div class="lf">${f}층${f >= 20 ? ' · 챔피언 로드' : ''}</div><div class="ls">${esc(F.name || '')}</div><div class="lk">${kind}</div>${(F.narr || []).map(t => `<p class="ln">${esc(t)}</p>`).join('')}<div class="lb"><i></i></div><div class="lh">누르면 넘어감</div>`;
  el.hidden = false; requestAnimationFrame(() => el.classList.add('on'));
  let done = false; const go = () => { if (done) return; done = true; el.classList.add('out'); setTimeout(() => { el.hidden = true; el.className = 'ldfx'; el.innerHTML = ''; }, 380); el.onclick = null; then(); };
  el.onclick = go; setTimeout(go, navigator.webdriver ? 10 : 3200);
}

// ---------- 소품 (도감) ----------
// [도감 id, 칸 너비, 칸 높이, 막힘 '#' / 낮은 엄폐 'r']
const PROPSET8 = {
  rubble: [['H-156', 2, 1, 'r'], ['H-074', 2, 2, '#'], ['H-193', 2, 1, 'r'], ['H-204', 2, 1, 'r'], ['H-176', 2, 2, '#'], ['H-195', 1, 1, '#'], ['H-273', 2, 2, '#'], ['H-277', 2, 2, '#'], ['H-279', 2, 1, 'r'], ['H-282', 2, 1, 'r'], ['H-549', 2, 1, 'r'], ['H-548', 2, 1, 'r'], ['H-561', 2, 1, 'r'], ['H-457', 2, 1, 'r'], ['H-291', 2, 1, 'r']],
  nature: [['H-060', 2, 1, 'r'], ['H-151', 2, 2, 'r'], ['H-200', 1, 1, '#'], ['H-210', 2, 1, 'r'], ['H-543', 2, 1, 'r'], ['H-546', 2, 1, 'r'], ['H-553', 2, 1, 'r'], ['H-544', 2, 1, 'r'], ['H-137', 2, 2, '#'], ['H-551', 2, 2, '#'], ['H-280', 1, 1, 'r'], ['H-552', 1, 1, 'r']],
  odd: [['H-382', 2, 2, '#'], ['H-383', 2, 2, '#'], ['H-386', 2, 2, '#'], ['H-390', 2, 2, '#'], ['H-536', 2, 1, 'r'], ['H-522', 2, 2, '#'], ['H-556', 2, 1, 'r'], ['H-492', 1, 1, '#']],
  urban: [['H-020', 2, 1, 'r'], ['H-275', 2, 1, 'r'], ['H-323', 2, 1, 'r'], ['H-326', 2, 1, 'r'], ['H-451', 2, 1, 'r'], ['H-468', 2, 1, 'r'], ['H-322', 1, 1, 'r']],
  // 진지 (적 쪽): [바리케이드들, 큰 설비들]
  f_camp: [[['H-006', 2, 1, 'r'], ['H-021', 2, 1, 'r'], ['H-047', 2, 1, '#'], ['H-111', 2, 1, 'r'], ['H-162', 2, 1, '#'], ['H-274', 2, 1, 'r'], ['H-110', 2, 1, 'r'], ['H-161', 2, 1, 'r']], [['H-084', 2, 2, '#'], ['H-029', 2, 2, '#'], ['H-022', 2, 2, '#'], ['H-046', 2, 2, '#'], ['H-132', 2, 2, '#'], ['H-028', 2, 1, 'r'], ['H-048', 2, 1, 'r']]],
  f_urban: [[['H-020', 2, 1, 'r'], ['H-275', 2, 1, 'r'], ['H-323', 2, 1, 'r'], ['H-326', 2, 1, 'r'], ['H-451', 2, 1, 'r'], ['H-468', 2, 1, 'r'], ['H-015', 1, 1, '#']], [['P3-ironfort-05', 2, 1, '#'], ['P3-mechgear-02', 2, 2, '#'], ['P3-ironfort-06', 2, 2, '#']]],
  f_iron: [[['H-274', 2, 1, 'r'], ['H-275', 2, 1, 'r'], ['P3-ironfort-05', 2, 1, '#'], ['H-111', 2, 1, 'r']], [['P3-ironfort-01', 2, 2, '#'], ['P3-ironfort-02', 2, 2, '#'], ['P3-ironfort-03', 2, 2, '#'], ['P3-ironfort-04', 2, 2, '#'], ['P3-ironfort-09', 2, 2, '#'], ['P3-ironfort-10', 2, 2, '#'], ['H-084', 2, 2, '#']]],
  f_mech: [[['P3-mechgear-02', 2, 2, '#'], ['P3-ironfort-05', 2, 1, '#'], ['H-468', 2, 1, 'r'], ['H-451', 2, 1, 'r']], [['P3-mechgear-01', 2, 2, '#'], ['P3-mechgear-04', 2, 2, '#'], ['P3-mechgear-08', 2, 2, '#'], ['P3-mechgear-09', 2, 2, '#'], ['P3-mechgear-10', 2, 2, '#'], ['P3-ironfort-08', 2, 2, '#']]],
  f_grim: [[['P3-grimbase-01', 2, 1, '#'], ['H-162', 2, 1, '#'], ['H-281', 2, 1, 'r'], ['H-025', 2, 1, 'r']], [['P3-grimbase-02', 2, 2, '#'], ['P3-grimbase-04', 2, 2, '#'], ['P3-grimbase-05', 2, 2, '#'], ['P3-grimbase-06', 2, 2, '#'], ['P3-grimbase-10', 2, 2, '#'], ['P3-biosupply-01', 2, 2, '#'], ['P3-biosupply-06', 2, 2, '#']]],
  f_arc: [[['P3-arcsapper-06', 2, 1, '#'], ['P3-arcfield-09', 2, 1, 'r'], ['H-021', 2, 1, 'r']], [['P3-arcfield-01', 2, 2, '#'], ['P3-arcfield-05', 2, 2, '#'], ['P3-arcfield-10', 1, 1, '#'], ['P3-arcsapper-02', 2, 1, '#'], ['P3-arcsapper-08', 2, 2, '#'], ['P3-arcfield-02', 2, 2, '#']]],
  f_odd: [[['P3-oddsupport-01', 2, 1, '#'], ['P3-biosupply-02', 2, 1, 'r'], ['H-556', 2, 1, 'r']], [['P3-oddsupport-03', 2, 2, '#'], ['P3-oddsupport-04', 2, 2, '#'], ['P3-oddsupport-09', 2, 2, '#'], ['P3-oddsupport-10', 2, 2, '#'], ['P3-biosupply-04', 2, 2, '#']]] };

// ---------- 구획: 확대한 맵에서 잘라 쓰는 싸움판 ----------
function r8Rng(seed){ let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
// 칸 지도 rows 에서 이어진 바닥 덩어리 (가장 큰 것)
function r8Comp(rows, W, H){
  const seen = new Uint8Array(W * H); let best = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){ if (seen[y * W + x] || rows[y][x] !== '.') continue;
    const cells = [], q = [[x, y]]; seen[y * W + x] = 1;
    while (q.length){ const [a, b] = q.pop(); cells.push([a, b]); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const p = a + dx, q2 = b + dy; if (p < 0 || q2 < 0 || p >= W || q2 >= H || seen[q2 * W + p] || rows[q2][p] !== '.') continue; seen[q2 * W + p] = 1; q.push([p, q2]); } }
    if (cells.length > best.length) best = cells; }
  return best;
}
function r8Dist(rows, W, H, from){
  const d = new Int32Array(W * H).fill(-1), q = []; for (const [x, y] of from){ d[y * W + x] = 0; q.push([x, y]); }
  for (let i = 0; i < q.length; i++){ const [x, y] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const p = x + dx, q2 = y + dy; if (p < 0 || q2 < 0 || p >= W || q2 >= H || d[q2 * W + p] >= 0 || rows[q2][p] !== '.') continue; d[q2 * W + p] = d[y * W + x] + 1; q.push([p, q2]); } }
  return d;
}
// opt: { kind: 'fight' · 'pass' · 'fort' · 'open' · 'boss', theme, whole }
function r8Sec(srcId, seed, opt){
  const M = MAPS8[srcId]; if (!M || !M.rows) return null; const rnd = r8Rng(seed), o = opt || {};
  const z = o.z || M.z || (srcId === 'caldera' ? 1.2 : M.NX * M.NY <= 800 ? 1.6 : 1.4);   // 확대 (그림 45px 칸 → 28 ~ 32px 칸)
  const ZX = Math.floor(M.NX * z), ZY = Math.floor(M.NY * z);
  const Z = Array.from({ length: ZY }, (_, y) => Array.from({ length: ZX }, (_, x) => M.rows[Math.min(M.NY - 1, Math.floor(y / z))][Math.min(M.NX - 1, Math.floor(x / z))]).join(''));
  // 창: 보스 · 칼데라 · 작은 맵은 통째로, 나머지는 잘라 씀
  let win = null;
  const whole = o.whole || o.kind === 'boss' || o.kind === 'open' || (ZX <= 40 && ZY <= 36);
  const tries = whole ? [[0, 0, ZX, ZY]] : Array.from({ length: 18 }, () => { const w = Math.min(ZX, 28 + Math.floor(rnd() * 14)), h = Math.min(ZY, 24 + Math.floor(rnd() * 12)); return [Math.floor(rnd() * (ZX - w + 1)), Math.floor(rnd() * (ZY - h + 1)), w, h]; });
  for (const [x0, y0, w, h] of tries){
    const rows = Z.slice(y0, y0 + h).map(r => r.slice(x0, x0 + w)); const comp = r8Comp(rows, w, h);
    if (!whole && comp.length < Math.max(140, w * h * 0.28)) continue;
    const sc = comp.length + rnd() * 30; if (!win || sc > win.sc) win = { x0, y0, w, h, rows, comp, sc }; }
  if (!win){ const rows = Z; win = { x0: 0, y0: 0, w: ZX, h: ZY, rows, comp: r8Comp(rows, ZX, ZY) }; }
  const { w, h, comp } = win, inC = new Set(comp.map(c => c[0] + ',' + c[1]));
  // 못 가는 곳은 막음 (덩어리 밖 바닥 → #) · 덩어리에 붙은 낮은 엄폐는 남김
  const g = win.rows.map((r, y) => [...r].map((c, x) => inC.has(x + ',' + y) ? '.' : c === 'r' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => inC.has((x + dx) + ',' + (y + dy))) ? 'r' : '#'));
  const S2 = () => g.map(r => r.join(''));
  // 들어서는 곳: 바닥이 가장 많이 닿은 가장자리 (원래 맵의 in 이 창 안이면 그것)
  let inn = null, startCells = null;
  if (M.in){ const ix0 = Math.floor(M.in[0] * z) - win.x0, iy0 = Math.floor(M.in[1] * z) - win.y0, ix1 = Math.floor((M.in[2] + 1) * z) - 1 - win.x0, iy1 = Math.floor((M.in[3] + 1) * z) - 1 - win.y0;
    const L = comp.filter(([x, y]) => x >= ix0 && x <= ix1 && y >= iy0 && y <= iy1); if (L.length >= 7 && (whole || rnd() < 0.5)) startCells = L; }
  if (!startCells){
    const sides = [['S', c => c[1] >= h - 2], ['N', c => c[1] <= 1], ['W', c => c[0] <= 1], ['E', c => c[0] >= w - 2]].map(([k, f]) => [k, comp.filter(f)]).filter(s => s[1].length >= 3);
    let pick = sides.length ? r8WPick(sides.map(s => [s, s[1].length])) : null;
    if (pick) startCells = pick[1]; else { const cx = comp.reduce((a, c) => a + c[0], 0) / comp.length; startCells = [comp.slice().sort((a, b) => Math.abs(b[0] - cx) - Math.abs(a[0] - cx))[0]]; } }
  // 들어서는 칸: 시작 칸에서 넓혀 14칸
  { const dd = r8Dist(S2(), w, h, startCells.slice(0, 1)); const near = comp.filter(([x, y]) => dd[y * w + x] >= 0).sort((a, b) => dd[a[1] * w + a[0]] - dd[b[1] * w + b[0]]).slice(0, 14);
    inn = [Math.min(...near.map(c => c[0])), Math.min(...near.map(c => c[1])), Math.max(...near.map(c => c[0])), Math.max(...near.map(c => c[1]))]; startCells = near; }
  // 나가는 칸: 들어선 곳에서 가장 먼 바닥 (원래 맵 out 이 창 안이고 멀면 그것)
  let dist = r8Dist(S2(), w, h, startCells), far = 0, out = null;
  for (const [x, y] of comp){ const d = dist[y * w + x]; if (d > far){ far = d; out = [x, y]; } }
  if (M.out){ const ox = Math.floor((M.out[0] + 0.5) * z) - win.x0, oy = Math.floor((M.out[1] + 0.5) * z) - win.y0; if (ox >= 0 && oy >= 0 && ox < w && oy < h && dist[oy * w + ox] >= far * 0.7) out = [ox, oy]; }
  // 소품: 엄폐 (모든 싸움판) · 진지 (fort · open)
  const props = [], T = THEME8[o.theme] || {}; let used = 0;
  const place = (P, zone, tries0) => {
    for (let k = 0; k < (tries0 || 30); k++){
      const [id, pw, ph, v] = P, c = comp[Math.floor(rnd() * comp.length)]; if (!c) return false; const [x, y] = c;
      if (x + pw > w || y + ph > h || (zone && !zone(x, y))) continue;
      let ok = true; for (let yy = y - 1; yy <= y + ph && ok; yy++) for (let xx = x - 1; xx <= x + pw && ok; xx++){ if (yy < 0 || xx < 0 || yy >= h || xx >= w) { ok = false; break; } if (g[yy][xx] !== '.') ok = false; }
      if (!ok) continue;
      if (Math.abs(x - (inn[0] + inn[2]) / 2) + Math.abs(y - (inn[1] + inn[3]) / 2) < 6 || Math.abs(x - out[0]) + Math.abs(y - out[1]) < 4) continue;
      const keep = []; for (let yy = y; yy < y + ph; yy++) for (let xx = x; xx < x + pw; xx++){ keep.push([xx, yy]); g[yy][xx] = v; }
      const d2 = r8Dist(S2(), w, h, startCells); let reach = 0; for (const [a, b] of comp) if (d2[b * w + a] >= 0) reach++;
      if (d2[out[1] * w + out[0]] < 0 || reach < comp.length - used - pw * ph - 2){ for (const [a, b] of keep) g[b][a] = '.'; continue; }
      props.push({ id, x, y, w: pw, h: ph }); used += pw * ph; return true; }
    return false; };
  const RS = PROPSET8[T.rock || 'rubble'] || PROPSET8.rubble;
  const nCover = o.kind === 'boss' ? 1 + Math.floor(rnd() * 2) : 3 + Math.floor(rnd() * 4);
  for (let i = 0; i < nCover; i++) place(RS[Math.floor(rnd() * RS.length)], null, 50);
  // 돌벽 토막 (타일 벽): 싸움 · 진지 · 지나가기 — 길을 끊지 않을 때만
  if (o.kind === 'fight' || o.kind === 'fort' || o.kind === 'pass'){ const nW = 1 + Math.floor(rnd() * 3); for (let i = 0; i < nW; i++){ const len = 3 + Math.floor(rnd() * 4), hor = rnd() < 0.5; place(['wall', hor ? len : 1, hor ? 1 : len, '#'], null, 40); } }
  if ((o.kind === 'fort' || o.kind === 'open') && T.fort){
    const F = PROPSET8['f_' + T.fort]; const enemy = (x, y) => dist[y * w + x] > far * 0.55;
    const nB = o.kind === 'open' ? 8 : 3 + Math.floor(rnd() * 3), nL = o.kind === 'open' ? 5 : 1 + Math.floor(rnd() * 2);
    for (let i = 0; i < nB; i++) place(F[0][Math.floor(rnd() * F[0].length)], enemy, 40);
    for (let i = 0; i < nL; i++) if (place(F[1][Math.floor(rnd() * F[1].length)], (x, y) => dist[y * w + x] > far * 0.7, 40)) props[props.length - 1].big = 1; }   // 큰 설비 = 포대 자리 (v8.7.1.1)
  if (/^caldera/.test(srcId)) props.push({ id: 'H-120', x: out[0] - 1, y: out[1] - 1, w: 2, h: 2, decor: true });   // 칼데라: 나가는 곳은 침대 (그림엔 없어 도감 소품을 놓음)
  const pxPerCell = M.cs / z;
  return { name: M.name, tag: M.tag, src: M.src, pw: M.pw, ph: M.ph, cs: pxPerCell, NX: w, NY: h, rows: S2(), in: inn, out, amb: M.amb, fall: M.fall, sx: win.x0, sy: win.y0, props, base: srcId, sec: true };
}
// 두 맵을 잘라 이은 싸움판: 왼쪽 구획 A · 오른쪽 구획 B · 사이 두 칸 벽을 뚫어 통로 (두 줄)
function r8Stitch(a, b, seed, o){
  const A = r8Sec(a, seed, { ...o, kind: 'fight' }), B = r8Sec(b, seed + 77, { ...o, kind: 'fight' }); if (!A || !B) return A;
  const gap = 2, W = A.NX + gap + B.NX, H = Math.max(A.NY, B.NY), fill = n => '#'.repeat(n);
  const g = Array.from({ length: H }, (_, y) => [...((A.rows[y] || fill(A.NX)) + fill(gap) + (B.rows[y] || fill(B.NX)))]);
  let best = null;
  for (let y = 1; y < H - 2; y++){ const ax = (A.rows[y] || '').lastIndexOf('.'), bx = (B.rows[y] || '').indexOf('.'); if (ax < 0 || bx < 0) continue; const c = (A.NX - 1 - ax) + bx; if (!best || c < best.c) best = { y, ax, bx, c }; }
  if (!best) return A;
  const off = A.NX + gap, props = [...A.props, ...B.props.map(p => ({ ...p, x: p.x + off }))], pc = new Set(); for (const p of props) for (let yy = p.y; yy < p.y + p.h; yy++) for (let xx = p.x; xx < p.x + p.w; xx++) pc.add(xx + ',' + yy);
  const cut = [], span = y => { const L = []; for (let x = best.ax; x <= off + best.bx; x++) L.push(x); return L; };
  for (const y of [best.y, best.y + 1]){ const L = span(y); if (y !== best.y && L.some(x => pc.has(x + ',' + y))) continue; for (const x of L) if (g[y][x] !== '.' && !pc.has(x + ',' + y)){ g[y][x] = '.'; cut.push([x, y]); } }
  return { name: A.name + ' → ' + B.name, tag: A.tag, src: A.src, pw: A.pw, ph: A.ph, cs: A.cs, NX: W, NY: H, rows: g.map(r => r.join('')), in: A.in, out: [B.out[0] + off, B.out[1]], amb: Math.min(A.amb, B.amb), fall: A.fall || B.fall, sx: A.sx, sy: A.sy, props, cut, base: a, base2: b, sec: true,
    parts: [{ src: A.src, sx: A.sx, sy: A.sy, cs: A.cs, pw: A.pw, ph: A.ph, ox: 0, w: A.NX, h: A.NY }, { src: B.src, sx: B.sx, sy: B.sy, cs: B.cs, pw: B.pw, ph: B.ph, ox: off, w: B.NX, h: B.NY }] };
}
// 구획을 MAPS8 에 올림 (판을 다시 열 때도 같은 씨앗으로 다시 만듦)
function r8SecReg(key, srcId, seed, opt){
  if (MAPS8[key] && MAPS8[key].sec) return key;
  const M = opt && opt.src2 ? r8Stitch(srcId, opt.src2, seed, opt) : r8Sec(srcId, seed, opt); if (!M) return null; MAPS8[key] = M; return key;
}
// 노드의 판 맵
function r8MapFor(n){
  const R = R8S(), F = F8[R.f] || {};
  if (n.t === 'boss' && n.b === 'neo'){ const k = R.neo || (R.neo = Math.random() < 0.5 ? 'neodemon' : 'neospirit'); return BOSS8[k].map; }
  if (F.fixed8 && F.seq && F.maps && F.maps.length) return F.maps.find(r8MapOk) || null;
  if (n.t === 'boss' && F.hidden8 && BOSS8[n.b] && r8MapOk(BOSS8[n.b].map)) return BOSS8[n.b].map;   // 히든 보스 (하르겐 · 데두라) 는 맵 통째로   // S 하나짜리 고정층 (테이론 · 삼신 · 결승)
  const L = (F.maps || []).filter(r8MapOk); if (!L.length && !n.src8) return null;
  n.src8 = n.src8 && r8MapOk(n.src8) ? n.src8 : r8Pick(L.length > 1 ? L.filter(k => k !== R.lastSrc8) : L); R.lastSrc8 = n.src8;
  const kind = n.champ ? 'boss' : n.t === 'boss' ? 'boss' : n.ms || (n.t === 'elite' && ELITE8[n.e] && ELITE8[n.e].open ? 'open' : n.t === 'elite' ? 'fort' : 'fight');
  // 두 맵 잇기: 보통 MS 싸움의 15% (그 지대에 맵이 둘 넘을 때 · 관중 통로 · 히든 빼고)
  if (n.stitch === undefined) n.stitch = kind === 'fight' && n.t === 'fight' && !n.champ && !n.empty && L.length >= 2 && ((n.seed || 7) % 100) < 15 ? L.filter(k => k !== n.src8)[(n.seed || 7) % (L.length - 1)] || null : null;
  const src2 = n.stitch && r8MapOk(n.stitch) ? n.stitch : null;
  const key = `~${R.f}_${n.id}_${n.seed || 7}`; S.art8sec = { key, src: n.src8, src2, seed: n.seed || 7, kind, theme: F.theme };
  return r8SecReg(key, n.src8, n.seed || 7, { kind, theme: F.theme, src2 });
}
function r8SecRestore(){ const A = S.art8sec; if (A && S.art8 === A.key && !MAPS8[A.key]) r8SecReg(A.key, A.src, A.seed, { kind: A.kind, theme: A.theme, src2: A.src2 || null }); }
// 적 묶음 — 지대 무리 · 지나가기는 적음 · 칼데라는 강적
function r8Foes(n){
  const R = R8S(), f = R.f, F = F8[f] || {};
  if (n.empty) return [];   // 빈 회랑 (히든 층)
  if (n.t === 'elite') return (ELITE8[n.e] || ELITE8.hall).foes.flatMap(([k, c]) => Array.from({ length: c }, () => k));
  if (n.t === 'boss'){ let B = BOSS8[n.b]; if (n.b === 'neo') B = BOSS8[R.neo || 'neodemon']; if (B.waves) return B.waves[0].slice(0, 1).flatMap(([k, c]) => Array.from({ length: c }, () => k)); return (B.foes || []).flatMap(([k, c]) => Array.from({ length: c }, () => k)); }
  const P = BAND8[F.band] || BAND8.sewer, nP = R.party.length;
  let n0 = Math.max(R8.foeN[0], Math.min(R8.foeN[1] + 2, Math.round(nP * (0.6 + f * 0.01) + Math.random() * 1.6)));
  if (n.ms === 'pass') n0 = Math.max(2, Math.round(n0 * 0.7));
  if (n.ms === 'open' || F.strong) n0 = Math.round(n0 * 1.4);
  return Array.from({ length: n0 }, () => r8WPick(P));
}
// 판을 만든 뒤 (r8Battle 끝에서 부름): 지나가기 · 칼데라는 출구가 처음부터 열림
function r8BattleHook(n, M){
  const W = world; if (!W || !W.r8) return;
  const open = n.ms === 'pass' || n.ms === 'open' || (n.t === 'elite' && ELITE8[n.e] && ELITE8[n.e].open);
  if (open){ W.exitLock = false; W.r8.pass = true; logEv(W, { k: 'r8', s: n.ms === 'pass' ? '🚪 출구가 열려 있다 — 싸우지 않고 빠져나가도 된다' : '🛏 칼데라 — 침대 (출구) 까지 가면 빠져나간다', c: 'dim', vis: true }); }
  if (n.ms === 'pass') for (const u of W.units) if (u.side === 1 && u.alive){ u.alert = 0; }
  if (typeof r8HookI === 'function') r8HookI(n, W);   // v8.7.1 손님 · 맵 위 NPC · 항복
}
// 그림 맵 · 구획 · 소품
const PROPIMG8 = {};
function drawArt8(Wd, ox, oy, ts){
  r8SecRestore();
  const M = MAPS8[S.art8]; if (!M) return; const a = ART8IMG[M.src] || (ART8IMG[M.src] = Object.assign(new Image(), { src: M.src }));
  if (M.parts){ for (const P of M.parts){ const im = ART8IMG[P.src] || (ART8IMG[P.src] = Object.assign(new Image(), { src: P.src })); if (!im.complete || !im.naturalWidth) continue; const k = ts / P.cs;
      ctx.save(); ctx.beginPath(); ctx.rect(ox + P.ox * ts, oy, P.w * ts, P.h * ts); ctx.clip(); ctx.drawImage(im, ox + (P.ox - P.sx) * ts, oy - P.sy * ts, P.pw * k, P.ph * k); ctx.restore(); }
    ctx.save(); for (const [x, y] of M.cut || []){ ctx.fillStyle = '#2a2420'; ctx.fillRect(ox + x * ts, oy + y * ts, ts + 0.5, ts + 0.5); ctx.strokeStyle = 'rgba(120,96,70,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ox + x * ts, oy + (y + 0.5) * ts); ctx.lineTo(ox + (x + 1) * ts, oy + (y + 0.5) * ts); ctx.stroke(); } ctx.restore(); }
  else if (a.complete && a.naturalWidth){ const k = ts / M.cs;
    if (M.sec){ ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, M.NX * ts, M.NY * ts); ctx.clip(); ctx.drawImage(a, ox - M.sx * ts, oy - M.sy * ts, M.pw * k, M.ph * k); ctx.restore(); }
    else ctx.drawImage(a, ox, oy, M.pw * k, M.ph * k); }
  for (const p of M.props || []){ if (p.id !== 'wall') continue; const x = ox + p.x * ts, y = oy + p.y * ts, wd = p.w * ts, ht = p.h * ts;   // 돌벽 토막
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x + ts * 0.12, y + ts * 0.18, wd, ht); ctx.fillStyle = '#4a443d'; ctx.fillRect(x, y, wd, ht); ctx.fillStyle = '#5f584f'; ctx.fillRect(x, y, wd, ts * 0.22);
    ctx.strokeStyle = 'rgba(20,16,12,.7)'; ctx.lineWidth = 1; for (let yy = 0; yy < p.h; yy++) for (let xx = 0; xx < p.w; xx++){ const bx = x + xx * ts, by = y + yy * ts; ctx.strokeRect(bx + 0.5, by + 0.5, ts - 1, ts - 1); ctx.beginPath(); ctx.moveTo(bx + ts * ((xx + yy) % 2 ? 0.5 : 0.3), by + ts * 0.5); ctx.lineTo(bx + ts * ((xx + yy) % 2 ? 0.5 : 0.3), by + ts); ctx.moveTo(bx, by + ts * 0.5); ctx.lineTo(bx + ts, by + ts * 0.5); ctx.stroke(); }
    ctx.restore(); }
  for (const p of M.props || []){ if (!p.id || p.id === 'wall') continue; const im = PROPIMG8[p.id] || (PROPIMG8[p.id] = Object.assign(new Image(), { src: `art/prop/${p.id}.webp` }));
    if (!im.complete || !im.naturalWidth) continue; const wpx = p.w * ts * 1.25, hpx = wpx * im.naturalHeight / im.naturalWidth;
    const cx = ox + (p.x + p.w / 2) * ts, by = oy + (p.y + p.h) * ts + ts * 0.1;
    ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(cx, by - ts * 0.15, wpx * 0.42, ts * 0.22, 0, 0, 6.283); ctx.fill(); ctx.restore();
    ctx.drawImage(im, cx - wpx / 2, by - hpx, wpx, hpx); }
  if (Wd.duel && typeof duel8Draw === 'function') duel8Draw(Wd, ox, oy, ts);   // v8.2 거인 · 조명
  if (typeof r8DrawI === 'function') r8DrawI(Wd, ox, oy, ts);   // v8.7.1.1 봉인 문양
  const st = Wd.stairs; if (st && (Wd.cleared || !Wd.exitLock)){ const x = ox + st.x * ts, y = oy + st.y * ts, t = performance.now() / 600; ctx.save(); ctx.strokeStyle = `rgba(240,200,110,${0.55 + 0.35 * Math.sin(t)})`; ctx.lineWidth = Math.max(2, ts * 0.08); ctx.beginPath(); ctx.arc(x, y, ts * 0.75, 0, 6.283); ctx.stroke(); ctx.fillStyle = 'rgba(240,200,110,.9)'; ctx.font = `bold ${Math.max(11, ts * 0.38)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(F8[(R8S() || {}).f] && F8[R8S().f].theme === 'caldera' ? '🛏 침대 (출구)' : '▼ 출구', x, y - ts * 0.95); ctx.restore(); }
}

// 칸 끝: 층 보스 · 고정 칸을 마치면 아래층으로
function r8NodeDone(){ const R = R8S(); if (R.at && !R.done.includes(R.at)) R.done.push(R.at); save(); const n = r8Node(R.at); if (n && (n.stair || n.t === 'fixed')){ r8Next(); return; } r8MapShow(); }
function r8NodeDesc(n){
  if (!n) return '';
  const T = { fight: n.champ ? '챔피언 로드 관중 통로 — 양쪽 관중 사이 긴 길에서 한 판' : n.ms === 'pass' ? '지나가기 — 출구가 처음부터 열려 있음 (싸우지 않고 빠져나가도 됨 · 그러면 동전이 적음)' : n.ms === 'fort' ? '진지 — 적이 바리케이드 · 설비 뒤에 자리 잡음' : n.ms === 'open' ? '칼데라 — 침대 (출구) 까지 가면 빠져나감' : '싸움 — 그 층 지대의 무리 (맵을 잘라 만든 구획) · 이기면 동전 · 가끔 유물', elite: `${n.stair ? '층 보스' : '정예'}: ${(ELITE8[n.e] || {}).name || ''} — 강하지만 유물을 줌${n.stair ? ' · 이기면 아래층으로' : ''}`, enc: '누군가 · 무언가를 만남 (말 · 거래 · 싸움 · 영입)', rest: '쉬기 (모두 회복) 또는 수련 (한 명 성장)', shop: '상인 — 동전으로 유물 · 약 · 탄', chest: '보물 — 유물 하나 (가끔 함정)', stairs: '아래층으로 내려가는 계단', boss: `보스: ${r8BossName(n.b)}`, fixed: r8FixedName(n.k), final: '결승 — 글리치 챔피언과 1대1' };
  return `${(NODE8[n.t] || {}).ic} ${n.s ? 'S · ' : n.ms ? 'MS · ' : ''}${T[n.t] || ''}`;
}
