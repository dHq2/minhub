/* ---------- v8.0.0 30층 여정 — run8_a.js v1.1 (v1.1: 층마다 세지는 폭 낮춤 (체력 3.5 → 2.5% · 공격 2.5 → 1.8%) — 자동 시험에서 6층부터 20초 안에 전멸 · v1.0: 맵 · 층 표 · 적 설계 · 유물) ----------
   1F 프롤로그 (S 다섯) 를 넘으면 2층부터: 층마다 갈림길 지도 (줄 4 ~ 6 · 칸 6 ~ 10) → 칸 = ⚔ 싸움 · ☠ 정예 · ❓ 만남 · ⛺ 쉼터 · 🛒 상인 · 💎 보물 · 👑 보스.
   층에 들어설 때 뽑기 세 번 (동료 · 유물) · 10 · 20층 보스 뒤 정산 (나가기 = 생환 결말 / 계속) · 30층 결승.
   싸움 칸은 그림 맵 (드라이브 5기 — MAPS8: 칸 지도 · 들어서는 곳 · 계단 · 밝기) · 만남 칸은 1F 의 인카운터 (오딜 · 아이텐 · 친칠라 · 탕아 · 호레이쇼 · 레지나 …) 를 그대로. */
const MAPS8 = /*MAPS8*/{};
const R8 = { cap: 8, draws: 3, gold: { fight: [12, 22], elite: [36, 52], boss: [90, 120] }, scale: { hp: 0.025, atk: 0.018 }, rest: 0.45, floorHeal: 0.12, foeN: [3, 6], relicP: 0.42 };
// 층 표 — band = 무리 · maps = 그림 맵 (없으면 1F 지형) · fixed = 고정 칸 (맨 위) · boss = 층 보스 · settle = 보스 뒤 정산 · narr = 들어설 때
const F8 = {
  2: { name: '하수구', band: 'sewer', maps: ['sewer1', 'sewer2'], narr: ['계단은 물 흐르는 소리 쪽으로 이어진다.', '썩은 물 냄새. 그리고 — 작은 발톱들이 벽을 긁는 소리.'] },
  3: { name: '여신의 호수', band: 'cave', maps: ['lime1', 'sewer2'], fixed: 'goddess', narr: ['동굴이 넓어지며 차가운 바람이 분다.', '저 아래 어딘가에서 물빛이 흔들린다 — 사람 크기가 아닌 무언가가 누워 있다.'] },
  4: { name: '몽환동굴', band: 'cave', maps: ['dream1', 'lime1'], narr: ['벽이 숨을 쉬듯 빛을 낸다.', '오래 걸었는데도 같은 자리인 것 같다.'] },
  5: { name: '수정동굴', band: 'crystal', maps: ['crystal1', 'crystal2'], boss: 'serpa', narr: ['수정이 횃불을 받아 사방으로 빛을 흩뿌린다.', '바닥이 젤리처럼 출렁인다. 슬라임의 왕국이다.'] },
  6: { name: '마젠타 도시', band: 'neon', maps: ['magenta1', 'magenta2'], narr: ['갑자기 하늘이 생긴다 — 가짜 하늘이다. 네온 간판이 깜빡인다.', '굴 속에 도시가 통째로 떨어져 있다.'] },
  7: { name: '네온 뒷골목', band: 'neon', maps: ['magenta2', 'cyber1', 'magenta1'], elite: 'jelly', narr: ['골목마다 누군가 숨어서 지켜본다.', '빗물에 네온이 번진다. 암살자들의 거리다.'] },
  8: { name: '요괴 마을', band: 'yokai', maps: ['yokai1', 'dokkaebi1'], narr: ['초롱불이 저절로 켜진다.', '처마 밑에서 도깨비불이 웃는다.'] },
  9: { name: '도깨비 고개', band: 'yokai', maps: ['dokkaebi1', 'yokai1'], elite: 'hong', narr: ['고개 너머에서 북소리가 난다.', '요괴 장군의 깃발이 보인다.'] },
  10: { name: '레지나의 알현실', band: 'yokai', maps: ['yokai1'], boss: 'regina', settle: true, narr: ['검은 복도가 끝없이 이어진다.', '옥좌 위에 권태로운 기사 하나.'] },
  11: { name: '심계 (지옥계)', band: 'hell', maps: ['hell2', 'hell1'], narr: ['공기가 뜨겁다. 쇠사슬 끄는 소리.', '처형장의 불은 꺼진 적이 없다.'] },
  12: { name: '심계 처형장', band: 'hell', maps: ['hell1', 'hell2'], elite: 'hunter', narr: ['누군가 우리를 오래전부터 겨누고 있었다.', '붉은 하늘 아래, 군인들의 발소리.'] },
  13: { name: '심계 (마계)', band: 'abyss', maps: ['abyss1', 'gothic1'], narr: ['마족의 노랫소리가 바람에 섞인다.', '부서진 성당의 그림자가 길다.'] },
  14: { name: '고딕 폐허', band: 'abyss', maps: ['gothic1', 'abyss1'], elite: 'redarmor', narr: ['석상들이 고개를 돌린 것 같다.', '무너진 첨탑 아래로 길이 난다.'] },
  15: { name: '네오의 경계', band: 'neo', maps: ['neodemon1', 'neospirit1'], boss: 'neo', narr: ['두 세계가 겹쳐 보인다 — 네온 마계와 빛나는 정령의 도시.', '이 층의 문은 둘 중 하나로만 열린다.'] },
  16: { name: '정령계', band: 'spirit', maps: ['spirit1', 'neospirit1'], narr: ['나무뿌리가 다리가 되고, 빛이 길이 된다.', '정령들이 우리를 시험하듯 따라온다.'] },
  17: { name: '기계천사계', band: 'machina', maps: ['machina1', 'spirit1'], elite: 'machinaA', narr: ['날개 달린 기계들이 하늘을 덮는다.', '찬송가가 기계음으로 반복된다.'] },
  18: { name: '성전', band: 'temple', maps: ['temple1', 'church1'], narr: ['향 냄새. 그리고 총 기름 냄새.', '기사단과 교단이 같은 문을 지킨다.'] },
  19: { name: '하얀 도시', band: 'temple', maps: ['rozel', 'church1'], elite: 'rozel', narr: ['모든 것이 하얗다. 소리조차.', '헬바 로젤의 저주가 바닥에 스며 있다.'] },
  20: { name: '테이론의 우주', band: 'space', maps: ['theron'], boss: 'theron', settle: true, narr: ['하얀 공간. 아무것도 없다.', '그가 검을 뽑는 순간 — 별이 쏟아진다.'] },
  21: { name: '빌딩 옥상', band: 'cyber', maps: ['roof1', 'cyber1'], narr: ['MC: "챔피언 로드 첫 무대! 떨어지면 끝입니다, 여러분!"', '바람이 세다. 아래는 끝이 보이지 않는다.'] },
  22: { name: '중화사이버', band: 'cyber', maps: ['cyber1', 'roof1', 'magenta2'], elite: 'machinaB', narr: ['간판의 글자가 계속 바뀐다.', '관중의 함성이 도시 전체에 울린다.'] },
  23: { name: '공성전', band: 'war', maps: ['siege1', 'field1'], narr: ['성벽 위에서 거인의 그림자가 일어선다.', 'MC: "이번 층은 전쟁입니다! 숫자로 밀어붙여요!"'] },
  24: { name: '야전', band: 'war', maps: ['field1', 'siege1'], elite: 'giant', narr: ['포성. 깃발. 끝없는 진흙.', '15M 거인이 발을 내딛을 때마다 땅이 운다.'] },
  25: { name: '삼신의 피바다', band: 'gods', maps: ['blood'], boss: 'gods', narr: ['붉은 바다 위의 무대. 세 개의 옥좌.', '세 초월자가 우리를 내려다본다.'] },
  26: { name: '차원의 틈', band: 'void', maps: ['dim1', 'eye1'], elite: 'mask', narr: ['공간이 접힌다. 거대한 눈이 깜빡인다.', '가면을 쓴 누군가가 또 웃는다.'] },
  27: { name: '데이터 1', band: 'data', maps: ['data1', 'data2'], narr: ['벽이 숫자로 흘러내린다.', '관리자의 작업장 — 지난 도전자들이 저장되어 있다.'] },
  28: { name: '데이터 2', band: 'data', maps: ['data2', 'data1'], elite: 'forget', narr: ['저장된 얼굴들이 우리를 알아본다.', '"이번 시즌 도전자 확인." — 어디선가 기계음.'] },
  29: { name: '데이터 3', band: 'data', maps: ['data1', 'data2'], narr: ['마지막 계단. 위에서 비트가 들린다.', 'MC: "다음 층이, 결승입니다!!"'] },
  30: { name: '스타디움', band: 'stadium', maps: ['stadium'], final: true, narr: ['피라미드 꼭대기에서 디스코볼이 돈다.', '관중석이 터져 나갈 듯하다.'] } };
const F8_MAX = 30;
// 무리 (층대마다): [적 설계 키, 무게]
const BAND8 = {
  sewer: [['하수구 쥐', 3], ['쥐 기사', 1.5], ['하수구 망자', 2], ['이계악마 망향', 1], ['게 몬스터', 0.6]],
  cave: [['등딱지 딱정벌레', 2], ['삼각머리 짐승', 2], ['바위껍질 짐승', 1.5], ['하수구 망자', 1], ['괴수 A', 0.5]],
  crystal: [['슬라임', 4], ['등딱지 딱정벌레', 1.5], ['바위껍질 짐승', 1], ['굴란', 0.4]],
  neon: [['사이버 암살자', 2], ['네온 총잡이', 2], ['블루블랙 전투단', 1.2], ['쥐 기사', 0.6]],
  yokai: [['도깨비 졸개', 3], ['도깨비 궁수', 2], ['마노', 0.5], ['삼각머리 짐승', 0.6]],
  hell: [['심계 병사', 3], ['심계 궁병', 2], ['기체 B', 0.8], ['기체 A', 0.4]],
  abyss: [['하류', 1.5], ['흑익', 1.5], ['심계 병사', 1.5], ['마신족 병사', 0.7], ['붉은갑주', 0.3]],
  neo: [['하류', 1], ['흑익', 1], ['포자', 1], ['천사 경비병', 1]],
  spirit: [['포자', 2], ['천사 경비병', 1.5], ['삼각머리 짐승', 1], ['마신족 병사', 0.7]],
  machina: [['천사 경비병', 2], ['기체 A', 0.8], ['기체 B', 1.2], ['장총 척후', 1]],
  temple: [['쌍피스톨기사', 1.5], ['오리엔탈 피스톨', 1.5], ['갈퀴창 병사', 2], ['철판포 거한', 0.6], ['장총 척후', 1]],
  space: [['기체 B', 1], ['천사 경비병', 1]],
  cyber: [['사이버 암살자', 2], ['블루블랙 전투단', 2], ['기체 B', 1], ['네온 총잡이', 1]],
  war: [['갈퀴창 병사', 2.5], ['장총 척후', 2], ['철판포 거한', 1], ['마신족 병사', 1], ['붉은갑주', 0.4]],
  gods: [['천사 경비병', 1], ['마신족 병사', 1], ['사이버 암살자', 1]],
  void: [['흑익', 1], ['하류', 1], ['기체 B', 1], ['포자', 1]],
  data: [['@saved', 3], ['기체 B', 1], ['블루블랙 전투단', 1]],
  stadium: [] };
// 정예 · 보스 (적 묶음)
const ELITE8 = {
  jelly: { name: '젤리 보스와 사이버 암살자들', foes: [['젤리 보스', 1], ['사이버 암살자', 3]] },
  hong: { name: '요괴 장군 홍두깨', foes: [['홍두깨', 1], ['도깨비 졸개', 3], ['도깨비 궁수', 2]] },
  hunter: { name: '심계 소령 헌팅나이프', foes: [['헌팅나이프', 1], ['카밀라', 1], ['심계 병사', 2]], talk: 'hunter' },
  redarmor: { name: '붉은갑주와 붉은암석', foes: [['붉은갑주', 1], ['붉은암석', 1], ['흑익', 2]] },
  machinaA: { name: '기체 A — 칼날 다리', foes: [['기체 A', 2], ['천사 경비병', 2]] },
  rozel: { name: '헬바 로젤', foes: [['헬바 로젤', 1], ['오리엔탈 피스톨', 2]], boss: true },
  machinaB: { name: '기체 B 편대', foes: [['기체 B', 3], ['블루블랙 전투단', 2]] },
  giant: { name: '15M 거인병사', foes: [['15M 거인병사', 1], ['갈퀴창 병사', 3]] },
  mask: { name: '가면', foes: [['가면', 1], ['하류', 2]] },
  forget: { name: '망각', foes: [['망각', 1], ['@saved', 2]] },
  hall: { name: '황량', foes: [['황량', 1]] }, lady: { name: '귀족부인', foes: [['귀족부인', 1], ['도깨비 졸개', 2]] } };
const BOSS8 = {
  serpa: { name: '슬라임의 왕 세르파', foes: [['세르파', 1], ['굴란', 1], ['몽', 1], ['핀', 1], ['튤린', 1], ['슬라임', 3]], join: 'C-277', joinTxt: '세르파가 작은 손을 든다 — "...졌어. 데려가."' },
  regina: { npc: 'regina' },
  neo: { pick: ['neodemon', 'neospirit'] },
  neodemon: { name: '네오마계의 대악마 하딤', foes: [['대악마 하딤', 1], ['하류', 2], ['흑익', 2]], reward: 'C-175', map: 'neodemon1' },
  neospirit: { name: '네오 정령계의 사슴', foes: [['사슴', 1], ['포자', 2], ['천사 경비병', 2]], reward: 'C-174', map: 'neospirit1' },
  theron: { name: '테이론', foes: [['테이론', 1]], tear: 2 },
  gods: { name: '삼신의 심판', waves: [['천사 경비병', 3, '라비스'], ['마신족 병사', 3, '모켈'], ['사이버 암살자', 3, '모란']], tear: 3 } };
// 적 설계 (여정 전용 — 도감 그림 ref · 이 판의 수치). 층이 깊을수록 R8.scale 만큼 세짐
const FOE8 = {};
[
  ['하수구 쥐', 'C-270', 1, { cls: '기동', weapon: '이빨·발톱', height: 0.45, weight: 6, sizeCls: '소형', ov: { hp: 40, atk: 11 }, traits: ['회피B', '은신B', '후각B'] }, '떼로 몰려와 발목을 문다'],
  ['쥐 기사', 'C-059', 1, { weapon: '검', shield: true, height: 0.9, weight: 20, sizeCls: '소형', ov: { hp: 70, atk: 16 }, traits: ['회피C'] }, '작은 방패와 칼 — 쥐들의 기사'],
  ['하수구 망자', 'C-120', 1, { weapon: '단검', height: 1.7, weight: 55, ov: { hp: 90, atk: 18 }, traits: ['망자'] }, '누더기를 걸친 망자'],
  ['이계악마 망향', 'C-212', 2, { weapon: '검', height: 1.9, weight: 80, ov: { hp: 150, atk: 30 }, traits: ['야시A', '회피C'] }, '고향을 잃은 이계의 악마'],
  ['게 몬스터', 'C-077', 3, { weapon: '이빨·발톱', height: 1.4, weight: 180, sizeCls: '중대형', ov: { hp: 300, atk: 38 }, traits: ['갑피', '근력A'] }, '집게 한 번에 갑옷이 찌그러진다'],
  ['등딱지 딱정벌레', 'C-133', 1, { weapon: '이빨·발톱', height: 0.8, weight: 40, sizeCls: '소형', ov: { hp: 90, atk: 18 }, traits: ['갑피'] }, '보라 쿠션 등딱지'],
  ['삼각머리 짐승', 'C-136', 1, { cls: '기동', weapon: '이빨·발톱', height: 1.6, weight: 60, ov: { hp: 80, atk: 22 }, traits: ['속력A', '회피B'] }, '흰 삼각 머리 · 긴 다리'],
  ['바위껍질 짐승', 'C-138', 1, { weapon: '이빨·발톱', height: 1.5, weight: 140, ov: { hp: 160, atk: 26 }, traits: ['갑피'] }, '흰 바위 껍질을 쓴 두 발 짐승'],
  ['괴수 A', 'C-070', 3, { weapon: '이빨·발톱', height: 2.6, weight: 400, sizeCls: '대형', ov: { hp: 320, atk: 40 }, traits: ['거구', '근력B'] }, '동굴의 괴수'],
  ['슬라임', null, 1, { weapon: '맨손', height: 0.6, weight: 30, sizeCls: '소형', ov: { hp: 60, atk: 14 }, traits: ['회피C'] }, '세르파가 뽑아낸 작은 슬라임'],
  ['굴란', null, 4, { weapon: '검', height: 1.8, weight: 90, ov: { hp: 220, atk: 36 }, traits: ['갑피', '속력B', '근력B', '레이더'] }, '슬라임 넷이 모인 검사'],
  ['몽', null, 4, { weapon: '장검', shield: true, height: 2.0, weight: 160, ov: { hp: 320, atk: 30 }, traits: ['갑피', '레이더'] }, '슬라임 탱커 — 에너지 참격'],
  ['핀', null, 4, { role: '사수', weapon: '저격총', ammo: 99, height: 1.6, weight: 60, ov: { hp: 140, atk: 44 }, traits: ['사격A', '레이더'] }, '탄약이 끝없는 슬라임 저격수'],
  ['튤린', null, 4, { role: '지원', cls: '치유', weapon: '마법', skill: { name: '슬라임 치유', kit: true, inf: true, pool: 99, pct: 0.12, min: 8, cap: 24, hot: 3, hotN: 5, hotGap: 0.5, cd: 3, wind: 0.5, rec: 0.3, rng: 4, auto: 0.5 }, height: 1.5, weight: 50, ov: { hp: 120, atk: 14 }, traits: ['레이더'] }, '슬라임 치유사'],
  ['세르파', 'C-277', 5, { role: '사수', weapon: '마법', height: 1.0, weight: 25, sizeCls: '소형', ov: { hp: 160, atk: 28 }, traits: ['회피A', '갑피', '군주', '보스'] }, '슬라임의 왕 — 바닥에서 수정을 뽑아 쏜다'],
  ['사이버 암살자', null, 3, { cls: '기동', weapon: '단검', height: 1.75, weight: 65, ov: { hp: 120, atk: 34 }, traits: ['회피A', '은신A', '속력A'], active: ['도약'] }, '네온 그림자 속의 암살자'],
  ['네온 총잡이', null, 2, { role: '사수', weapon: '권총', ammo: 30, height: 1.75, weight: 70, ov: { hp: 100, atk: 30 }, traits: ['사격B'] }, '골목의 총잡이'],
  ['블루블랙 전투단', null, 3, { role: '사수', weapon: '소총', ammo: 40, height: 1.8, weight: 80, ov: { hp: 130, atk: 34 }, traits: ['사격A', '베테랑'], gear: { 몸: { name: '전투복', mat: '사슬', tier: 2 } } }, '블루블랙 도시 전투단'],
  ['젤리 보스', null, 5, { weapon: '맨손', height: 2.6, weight: 500, sizeCls: '대형', ov: { hp: 650, atk: 42 }, traits: ['재생', '거구', '보스'] }, '출렁이는 거대한 젤리 — 찢어도 붙는다'],
  ['도깨비 졸개', null, 2, { weapon: '둔기', height: 1.8, weight: 85, ov: { hp: 150, atk: 28 }, traits: ['야시B'], active: ['도약'] }, '방망이를 든 도깨비'],
  ['도깨비 궁수', null, 2, { role: '사수', weapon: '활', ammo: 30, height: 1.7, weight: 70, ov: { hp: 140, atk: 26 }, traits: ['사격B', '야시B'] }, '사격 재능이 있는 요괴'],
  ['홍두깨', 'C-236', 4, { weapon: '둔기', height: 2.8, weight: 320, sizeCls: '대형', ov: { hp: 560, atk: 52 }, traits: ['거구', '지휘A', '베테랑', '보스'], gear: { 몸: { name: '요괴 장군의 갑주', mat: '판금', tier: 3 } } }, '요괴계의 장군'],
  ['마노', 'C-213', 3, { weapon: '창', height: 1.9, weight: 85, ov: { hp: 300, atk: 40 }, traits: ['베테랑', '회피B'], active: ['돌진'] }, '요괴 장수'],
  ['황량', 'C-295', 5, { weapon: '장검', height: 2.1, weight: 90, ov: { hp: 640, atk: 58 }, traits: ['보스', '회피A', '속력A', '베테랑'], active: ['도약 강타'] }, '어디서나 낮은 확률로 — 매우 강한 요괴'],
  ['귀족부인', 'C-300', 5, { weapon: '이빨·발톱', height: 2.4, weight: 260, sizeCls: '대형', ov: { hp: 720, atk: 50 }, traits: ['갑피', '거구', '보스'] }, '잡아서 치명상을 낸다 · 매우 단단함'],
  ['심계 병사', null, 2, { weapon: '창', height: 1.9, weight: 90, ov: { hp: 170, atk: 32 }, traits: ['갑피', '야시A'], gear: { 몸: { name: '심계 판금', mat: '판금', tier: 2 } } }, '지옥계의 군인'],
  ['심계 궁병', null, 2, { role: '사수', weapon: '활', ammo: 30, height: 1.85, weight: 80, ov: { hp: 140, atk: 30 }, traits: ['사격B', '야시A'] }, '불화살을 재는 군인'],
  ['헌팅나이프', 'C-290', 4, { cls: '기동', weapon: '단검', height: 1.85, weight: 80, ov: { hp: 230, atk: 44 }, traits: ['회피A', '은신A', '사격S', '베테랑', '야시A'], active: ['도약'] }, '심계 소령 — 말 잘하면 교전 중지'],
  ['카밀라', 'C-291', 4, { weapon: '샷건', role: '사수', ammo: 24, height: 1.7, weight: 62, ov: { hp: 200, atk: 40 }, traits: ['베테랑', '회피B', '생존자'] }, '라스트 솔져'],
  ['기체 A', 'C-183', 3, { weapon: '장검', height: 2.4, weight: 420, sizeCls: '중대형', ov: { hp: 360, atk: 46 }, traits: ['갑피', '속력A'], active: ['도약 강타'] }, '칼날 다리 넷 · 점프 찍기'],
  ['기체 B', 'C-184', 3, { cls: '기동', weapon: '검', height: 1.9, weight: 140, ov: { hp: 240, atk: 40 }, traits: ['회피S', '속력A', '갑피'] }, '쌍검 기동 · 회피는 세자르 바로 아래'],
  ['하류', 'C-234', 3, { cls: '기동', weapon: '검', height: 1.9, weight: 80, ov: { hp: 260, atk: 42 }, traits: ['속력A', '회피A'] }, '마계 중간보스 — 근접 · 기동'],
  ['흑익', 'C-235', 3, { role: '사수', weapon: '마법', height: 1.9, weight: 75, ov: { hp: 220, atk: 44 }, traits: ['야시A'] }, '검은 날개 — 참격 · 마법'],
  ['붉은갑주', 'C-244', 4, { weapon: '대검', height: 2.3, weight: 260, ov: { hp: 520, atk: 50 }, traits: ['갑피', '거구'] }, '붉은 갑주의 대검사'],
  ['붉은암석', 'C-245', 4, { weapon: '둔기', height: 2.4, weight: 600, sizeCls: '대형', ov: { hp: 760, atk: 44 }, traits: ['갑피', '거구'] }, '매우 단단한 바위 거인'],
  ['마신족 병사', 'C-241', 3, { weapon: '창', height: 2.2, weight: 150, ov: { hp: 300, atk: 44 }, traits: ['갑피', '근력A'], active: ['돌진'] }, '마신족 — 돌진이 매우 강함'],
  ['포자', 'C-247', 2, { role: '사수', weapon: '마법', height: 1.6, weight: 40, ov: { hp: 150, atk: 30 }, traits: ['회피B'] }, '정령계의 저주 · 감염'],
  ['천사 경비병', 'C-259', 2, { weapon: '창', height: 2.0, weight: 90, ov: { hp: 240, atk: 40 }, traits: ['갑피', '근력B'], active: ['도약'] }, '날개 달린 경비병'],
  ['대악마 하딤', 'C-201', 5, { weapon: '대장군의 도끼', height: 2.9, weight: 380, sizeCls: '대형', ov: { hp: 950, atk: 62 }, traits: ['보스', '거구', '베테랑', '갑피', '지휘A'], active: ['회전 투척', '도약 강타'] }, '네오마계의 대악마'],
  ['사슴', 'C-273', 5, { weapon: '맨손', height: 2.6, weight: 420, sizeCls: '대형', ov: { hp: 880, atk: 60 }, traits: ['보스', '거구', '근력A', '괴력A'] }, '정령계의 레슬러 — 대형까지 던짐'],
  ['쌍피스톨기사', 'C-298', 3, { role: '사수', weapon: '권총', ammo: 40, height: 1.9, weight: 95, ov: { hp: 220, atk: 38 }, traits: ['사격A', '베테랑'], gear: { 몸: { name: '기사단 판금', mat: '판금', tier: 3 } } }, '기사단의 쌍권총'],
  ['오리엔탈 피스톨', 'C-299', 3, { role: '사수', weapon: '권총', ammo: 40, height: 1.75, weight: 65, ov: { hp: 180, atk: 36 }, traits: ['사격A', '회피B'] }, '교단의 총잡이'],
  ['갈퀴창 병사', 'C-252', 2, { weapon: '창', height: 1.85, weight: 85, ov: { hp: 180, atk: 34 }, traits: ['공통스킬:투창'] }, '갈퀴창 — 끌어당김'],
  ['철판포 거한', 'C-253', 3, { weapon: '둔기', height: 2.5, weight: 300, sizeCls: '대형', ov: { hp: 440, atk: 48 }, traits: ['거구'] }, '철판을 두른 거한'],
  ['장총 척후', 'C-255', 2, { role: '사수', weapon: '소총', ammo: 30, height: 1.75, weight: 70, ov: { hp: 140, atk: 38 }, traits: ['사격A', '은신B'] }, '긴 총의 척후'],
  ['헬바 로젤', 'C-046', 7, { role: '사수', weapon: '마법', height: 1.8, weight: 60, ov: { hp: 1100, atk: 58 }, traits: ['보스', '재생', '회피B'], active: ['핏빛 장판', '피의 검기', '혈염'] }, '하얀 도시의 헤마 — [저주:헤마]'],
  ['테이론', 'C-086', 7, { weapon: '대검', height: 2.2, weight: 120, sizeCls: '중대형', ov: { hp: 1300, atk: 70 }, traits: ['보스', '베테랑', '회피A', '갑피'], active: ['회전 투척', '도약 강타'] }, '작은 우주를 호령하던 군주 — 말이 없다'],
  ['15M 거인병사', 'C-229', 5, { weapon: '둔기', height: 15, weight: 20000, sizeCls: '초대형', ov: { hp: 1600, atk: 80 }, traits: ['거구', '갑피'] }, '밟히면 죽는다 · 다리를 계속 치면 넘어진다'],
  ['가면', 'C-051', 6, { cls: '기동', weapon: '단검', height: 1.8, weight: 70, ov: { hp: 720, atk: 60 }, traits: ['보스', '회피S', '은신S'], active: ['혈영보'] }, '만날수록 위험해지는 가면'],
  ['망각', 'C-211', 6, { weapon: '대검', height: 2.3, weight: 300, ov: { hp: 1100, atk: 66 }, traits: ['보스', '갑피', '베테랑'] }, '광석계 마인'],
  ['천명', 'C-192', 6, { weapon: '맨손', height: 6, weight: 3000, sizeCls: '초대형', ov: { hp: 1400, atk: 70 }, traits: ['거구', '보스'] }, '천계의 대형 보스 — 이성 없음']
].forEach(([key, ref, tier, o, note]) => { FOE8[key] = { key, name: key, side: 1, ref: ref || undefined, tier, cls: o.cls || (o.role === '사수' || o.role === '지원' ? '원거리' : '근접'), role: o.role || '공격수', nv: true, nvG: 'A', tactic: note, note, ...o }; });
const foe8 = (k, f) => {   // f = 층 (세짐)
  let d;
  if (k === '@saved'){ const P = DESIGN_DEFAULTS.filter(x => x.side === 0 && x.key !== '인주'); const b = P[Math.floor(Math.random() * P.length)]; d = { ...clone(b), side: 1, name: '저장된 ' + b.name, key: '@saved', traits: [...(b.traits || []).filter(t => t !== '영웅'), '망자'], note: '관리자가 저장해 둔 지난 도전자' }; }
  else d = clone(FOE8[k] || FOE8['하수구 망자']);
  const n = Math.max(0, (f || 2) - 2); d.ov = { ...(d.ov || {}) }; if (d.ov.hp) d.ov.hp = Math.round(d.ov.hp * (1 + R8.scale.hp * n)); if (d.ov.atk) d.ov.atk = Math.round(d.ov.atk * (1 + R8.scale.atk * n));
  return { ...fromDesign(d, 1), id: uid() };
};
// 유물 — 효과는 싸움을 만들 때 (r8Pre: 설계에 얹었다가 판을 만든 뒤 걷음 · r8Post: 판의 몸에) 또는 정해진 때
const RELIC8 = {
  tear: { name: '여신의 눈물', ic: '💧', d: '횃불이 더 밝음 · 아군 최대 체력 +6% (모을수록)', st: true },
  odtear: { name: '오딜의 눈물', ic: '🌹', d: '인주에게 [가호:오딜] — 받는 피해 −10%' },
  scale: { name: '사르딜락의 비늘조각', ic: '🐉', d: '인주 최대 체력 +20% · 불 · 냉기에 강함' },
  nurse: { name: '간호사장의 모자', ic: '⛑', d: '치유하는 동료의 약이 두 번 더' },
  violin: { name: '루미의 바이올린', ic: '🎻', d: '싸움이 끝날 때마다 모두 최대 체력의 10% 회복' },
  candle: { name: '왐의 머리촛대', ic: '🕯', d: '지닌 이 (가장 앞의 동료) 가 쓰러지면 체력 10% 로 일어남 — 다섯 번' },
  gamyu: { name: '가뮤의 대검', ic: '🗡', d: '가장 큰 동료 (중대형 이상) 의 공격 +30%' },
  duck: { name: '러버덕의 리볼버', ic: '🦆', d: '사수들의 공격 +20%' },
  rabis: { name: '라비스의 투구', ic: '🪶', d: '아군 모두 최대 체력 +10% (삼신 — 질서)' },
  moran: { name: '모란의 가면', ic: '🎭', d: '인주의 회피 +15% (삼신 — 칼끝)' },
  mokel: { name: '모켈의 갑옷', ic: '🛡', d: '인주가 받는 피해 −15% (삼신 — 거래)' },
  rokto: { name: '록토의 로브', ic: '💀', d: '아군 모두 은신이 한 단계 좋아짐 (괴이)' },
  tea: { name: '오딜의 차', ic: '🍵', d: '층에 들어설 때 모두 최대 체력의 20% 회복' },
  branch: { name: '친칠라의 하얀 가지', ic: '🌿', d: '활을 쏘는 동료의 공격 +25%' },
  coin: { name: '굴 동전 주머니', ic: '👛', d: '싸움에서 얻는 동전 +50%' },
  boots: { name: '망자의 장화', ic: '🥾', d: '아군 모두 조금 빠름 (+6%)' },
  crown: { name: '부서진 왕관 조각', ic: '👑', d: '치명타를 맞을 때 한 번 버팀 (싸움마다 한 명)' },
  dice: { name: '왐의 주사위', ic: '🎲', d: '상인 값이 20% 쌈' } };
const RELIC8_POOL = ['odtear', 'scale', 'nurse', 'violin', 'candle', 'gamyu', 'duck', 'rokto', 'tea', 'branch', 'coin', 'boots', 'crown', 'dice'];
