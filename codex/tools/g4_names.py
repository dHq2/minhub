# g4_names.py v1.0 (2026-10-10) — 4기 동작 이름 (도감 칸 이름 · '게임:' 줄) — h2_poses.py v1.7 · g4_extra.py 가 같이 씀
#  · PN4: 동작 키 → 한글 이름 (4기에 새로 생긴 동작 이름 포함). 없으면 h2_poses 의 PN · PN2, 그래도 없으면 키 그대로
#  · ENG4: 4기 적 · 1기 영웅 (foe4) · 잡몹 9인 (mob9) 이 게임에서 그 동작을 쓰는 때 (cave-3d motion.js v1.5 · ai.js v0.35 · heroes.js v1.1 · prologue.js v0.116)
PN4 = {
  'idle': '기본', 'idle2': '기본 2', 'ready': '태세', 'walk': '걷기', 'walk2': '걷기 2', 'walkB': '뒤로 걷기', 'run': '달리기', 'run2': '달리기 2',
  'windup': '예고 (준비)', 'windup2': '예고 2 (크게 들기)', 'attack': '공격', 'attackB': '공격 (번갈아)', 'attack2': '공격 2', 'attack3': '공격 3',
  'hurt': '맞음', 'hurt2': '맞음 2', 'stun': '기절', 'kneel': '무릎 꿇고 일어남', 'kneel2': '무릎 꿇음 2', 'down': '쓰러짐', 'dead': '죽음',
  'guard': '막기', 'guard2': '막기 2', 'crouch': '웅크림', 'low': '낮은 자세', 'jump': '도약', 'leap': '뛰어듦', 'rest': '쉬기', 'rest2': '쉬기 2', 'rest3': '쉬기 3',
  'sit': '앉아 쉬기', 'sit2': '앉아 쉬기 2', 'stance': '자세', 'special': '필살', 'spwind': '특수 준비', 'skill': '기술', 'cast': '시전', 'heal': '치유', 'summon': '소환',
  'slam': '내려찍기', 'smash': '내려치기', 'thrust': '찌르기', 'thrust2': '찌르기 2', 'stepthrust': '스텝 찌르기', 'lunge': '찌르며 들어감', 'upper': '올려 치기',
  'sweep': '휩쓸기', 'swing': '휘두르기', 'wide': '넓게 휘두르기', 'whirl': '회전 베기', 'spin': '회전', 'twirl': '돌리기', 'twist': '비틀기', 'cross': '교차 베기',
  'chop': '내려 베기', 'slash': '베기', 'jumpslash': '뛰어 베기', 'triple': '3연속 베기', 'combo': '연속기', 'combo2': '연속기 2', 'execute': '처형', 'draw': '뽑기',
  'kick': '발차기', 'kick2': '발차기 2', 'rear': '뒷발', 'punch': '주먹', 'headsmash': '머리 박치기', 'shoulder': '어깨 들이받기', 'push': '밀치기', 'bash': '방패 치기',
  'grab': '붙잡기', 'lift': '들어 올리기', 'liver': '간 치기', 'noir': '느와르', 'claw': '할퀴기', 'reach': '손 뻗기', 'pound': '마운트 파운딩',
  'throw': '던지기', 'flythrow': '날며 던지기', 'skythrow': '공중 투창', 'bigthrow': '큰 투창', 'cannon': '창 대포', 'pillar': '솟는 창', 'spear': '창', 'plunge': '내리꽂기',
  'shoot': '사격', 'aim': '조준', 'multishot': '여러 발', 'skyshot': '하늘로 쏘기', 'leapshot': '뛰어 쏘기', 'kneelshot': '무릎 쏴', 'prone': '엎드려 쏘기', 'crawl': '포복',
  'dash': '돌진', 'fly': '날기', 'charm': '유혹', 'taunt': '도발', 'flex': '힘자랑', 'wave': '손 흔들기', 'command': '지휘', 'spread': '펼치기', 'stretch': '기지개',
  'read': '읽기', 'tea': '차 마시기', 'eat': '냠냠', 'snack': '간식', 'bandage': '붕대 감기', 'stumble': '휘청 넘어짐', 'stool': '의자에 앉음', 'carry': '이고 나르기',
  'hug': '무릎 감싸 안기', 'sleep': '낮잠', 'burstReady': '팜 버스트 준비', 'burst': '팜 버스트 (폭발)',
  'gs_guard': '대검 막기', 'gs_raise': '대검 들기', 'gs_slam': '대검 내려찍기', 'gs_swing': '대검 휘두르기', 'gs_thrust': '대검 찌르기'}
ENG4 = {
  'idle': '서 있을 때', 'ready': '싸움 태세 (적이 가까울 때 · 들킨 뒤)', 'walk': '걸을 때', 'run': '뛸 때 · 들이받기', 'hurt': '맞았을 때 (두 가지 번갈아)', 'hurt2': '맞았을 때 (두 가지 번갈아)',
  'stun': '오래 휘청일 때 (기절)', 'kneel': '넘어졌다 일어날 때 · 쉬다 깰 때', 'down': '넘어졌을 때 · 쓰러졌을 때', 'dead': '죽었을 때', 'guard': '앞에서 막을 때 · 방어 자세',
  'crouch': '숙이기 · 매복 · 엄폐', 'jump': '도약 · 뛰어오름', 'windup': '공격 예고', 'attack': '기본 공격 (번갈아)', 'attackB': '기본 공격 (번갈아)', 'attack2': '기본 공격 (번갈아)',
  'attack3': '기본 공격 (번갈아)', 'windup2': '번갈아 크게 들어 내려찍기 (예고)', 'slam': '번갈아 크게 들어 내려찍기', 'spwind': '고유 기술 예고', 'special': '고유 기술 · 가끔 특수 공격',
  'rest': '오래 가만히 있을 때 쉬기 · 모닥불 곁', 'rest2': '오래 가만히 있을 때 쉬기 · 모닥불 곁', 'rest3': '모닥불 곁에서 쉬기', 'sit': '오래 가만히 있을 때 앉기', 'sit2': '오래 가만히 있을 때 앉기',
  'stance': '싸움 없을 때 가끔', 'idle2': '싸움 없을 때 가끔', 'spread': '싸움 없을 때 가끔', 'pound': 'GOOD WILL 마운트 파운딩 (넘어진 적에 올라타 주먹 넷)',
  'burstReady': '청광묵 팜 버스트 준비 (0.5초 작은 붉은 장판)', 'burst': '청광묵 팜 버스트 (폭발 · 반동 · 넉백 · 화상, 치명상이면 머리가 터지며 즉사)',
  'eat': '굴: 끼니 뒤 냠냠', 'carry': '굴: 들고 서 있을 때', 'hug': '굴: 달팽이가 죽어 슬플 때', 'snack': '굴 · 싸움 없을 때 가끔', 'bandage': '굴 · 싸움 없을 때 가끔', 'stumble': '싸움 없을 때 가끔',
  'stool': '굴: 오래 가만히 있을 때', 'sleep': '굴: 오래 가만히 있을 때'}
def pn(k, *more):
    for d in (PN4, *more):
        if k in d: return d[k]
    return k
