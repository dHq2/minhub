# v8.7.8 페이지 (4) — page8780d.py v1.1 (v1.1: 치료 방침 단추 · 상세 · 단축키가 엔진과 같은 기본 (healPolOf — 마력 치유는 '알아서') · 정령의 손길 남은 대기는 600초 안만 · v1.0: 물레 · 콜라이더 · 테헤라 (명세 C8 · B10 · 도감 C-174 · C-175 · C-016 · 3D 기술표) — 설계 · 도감 정체성 (뽑기에는 없음 — 네오의 문 · 세 번 청함으로만) ·
#   고유 · 특성 · 기술 글 · 아이콘 판 8 × 10 꽉 참 (61 ~ 79 — ico878/mkico_d.py) · 기술 칸 (제자리 기술은 바로 · 바닥 · 동료 · 적을 찍음) · 기록 · 서술 · 동작 이름 ·
#   그림 (장판 · 문 · 방벽 · 장막 · 기술 예고 · 꼬리 · 광역 손짓 · 빛가루 · 걸린 것 · 날개 · 땅의 정령 · 물 정령 탄 · 별빛 탄) · 상세 줄 · 땅의 정령은 고를 수 없음 (쥐처럼) ·
#   마족 · 정령 · 요정 적의 종족 (유혹의 손짓 마계 3초 · 인사) · 인사 (bow) 대화 선택지 (3D 패시브 — 콜라이더: 마족 · 물레: 정령 · 요정 / 층마다 한 번 · 보통 싸움) ·
#   함께 고친 것: 대상 없는 빗나감 (가방 · 뿌리 벽 · 투척 · 기술) 에 기록 글이 멈추던 것 · 가방 일을 '공격이 빗나간다' 로 서술하던 것 · 마력 치유 (딸기 · 물레 · 테헤라) 를 '의무 (구급상자)' 로 적던 것)
import subprocess, shutil
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8780c.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep("아이콘 판 80칸.\n     v8.7.7: ", """아이콘 판 80칸.
         물레 (명세 C8 · 도감 C-174 — 정령계 앰버서더 · 물계열 대정령 · 5성 서포터 · 네오 정령계의 문을 넘으면 합류): 정령 지시 (12칸 물 정령 탄 — 맞으면 1초 걸음 −20%) ·
         정령의 손길 (마력 치유 — 10칸 · 25% + 이어서 4초 초당 2% · 10초) · 정령 강림 (9칸 안 바닥 · 반지름 8 · 6초 — 동료 초당 3% · 걸음 +15% / 적 걸음 −30% · 14초) ·
         정령 방벽 (앞 3칸 · 너비 4 · 4초 — 적 탄을 막고 닿은 근접 적을 2칸 밀어냄 · 10초) · 땅의 정령 (20초 — 체력이 가장 낮은 동료를 따라 3초마다 5% · 25초) · 물 정령 탄 (세 발 × 0.6 · 6초) ·
         ◆정령 계약 (편 모두 최대 체력 +8% · 곁 5칸 초당 0.6% · 쓰러진 [불사] 동료가 두 배 빨리 일어남).
         콜라이더 (명세 C8 · 도감 C-175 — 마계 대사 대귀족 · 심연계 마족 · 5성 딜 서포터 · 대악마 하딤을 넘으면 합류): 갈퀴 꼬리 (몸 가운데부터 3칸 · 부채꼴 100° 두 번 — 둘째는 검은 파편 0.5초 휘청) ·
         별빛 지목 (15칸 탄 — 6초 받는 피해 +20% · 처음엔 덩굴 0.8초 · 8초) · 차원 문 (앞 4칸 · 8초 — 반지름 4 의 적을 1초마다 1.5칸 끌어옴 (대형 · 보스는 버팀) · 닿은 적 탄은 사라짐 · 다시 쓰면 15칸 안 동료 하나를 문 앞으로 · 12초) ·
         마계 장막 (반지름 6 · 5초 — 안의 동료 원거리 피해 −50% · 넘어 들어오는 적 0.5초 휘청 · 16초) · 유혹의 손짓 (앞 8칸 60° — 적 하나 2초 매혹 · 마계 적 3초 · 보스는 절반 · 12초) ·
         ◆마계 대사 (같은 편 마법 피해 +10% · 숨이 끊길 일격을 꼬리 그림자가 한 번 대신 막음).
         테헤라 (명세 B10 · 도감 C-016 — 우주의 테헤라 · 7성 요정 서포터 · 세 번 청하면 합류): 손짓 (12칸 빛가루 탄 — 곡사 없음 · 1초 걸음 −20%) · 요정의 축복 (마력 힐 — 곁 5칸 동료 모두 25% + 4초 받는 피해 −15% · 9초) ·
         광역 손짓 (방사형 8칸 90° — 동료도 맞음 · 둔기 · 중대형까지 넘어짐 · 10초) · 은빛 비행 (8칸 날아감 · 바위를 넘음 · 지나간 줄의 적 × 0.4 · 0.8초 둔화 · 7초) ·
         날개 방패 (2초 받는 피해 −80% · 끝에 둘레 3칸 눈멂 1초 · 10초) · 나른한 꿈 (앉아서 반지름 6 · 5초 — 적 공격 속도 −40% · 동료 초당 1% · 14초) ·
         [축복:테헤라] (곁 5칸 동료 재생 초당 1.5 · 받는 피해 × 0.9) · ◆요정 날개 (늘 떠 있음 — 장판 · 얕은 물을 밟지 않음 · 원거리 15% 흘림).
         셋의 기술은 적 · 아군 같은 두뇌로 스스로 씀 (기술 칸 1 · 2 는 명령으로 — 제자리 기술은 바로). 장판 · 문 · 방벽 · 장막은 판 위에 모양 그대로 · 땅의 정령은 고를 수 없음.
         인사 (3D 패시브): 콜라이더는 마족만의 무리 · 물레는 정령 · 요정 무리를 만나면 싸우기 전에 인사할 수 있음 (층마다 한 번 · 보통 싸움 — 받아들이면 길을 비켜 줌 · 전리품 없음).
         함께 고친 것: 대상 없는 빗나감 (가방 · 뿌리 벽 · 투척) 에 기록 글이 멈추던 것 · 마력 치유를 '의무 (구급상자)' 로 적던 것. 아이콘 판 80칸 꽉 참.
     v8.7.7: """)
rep("의 버전 기록에 — v8.7.8 굿윌 · 포렌 (쥐 군단) · 어퐁 · 카리우스 · 감전 한 틀 / v8.7.7 유물 34 · 노먼 전직", "의 버전 기록에 — v8.7.8 굿윌 · 포렌 (쥐 군단) · 어퐁 · 카리우스 · 물레 · 콜라이더 · 테헤라 · 감전 한 틀 / v8.7.7 유물 34 · 노먼 전직")
rep('">v8.7.8 · 굿윌 · 포렌 · 어퐁 · 카리우스 · 감전 한 틀</span>', '">v8.7.8 · 굿윌 · 포렌 · 어퐁 · 카리우스 · 물레 · 콜라이더 · 테헤라 · 감전 한 틀</span>')

# ---------- 설계 · 도감 정체성 (명세 C8 · B10 · 3D 기술표) — 뽑기에는 없음 (noDraw) ----------
MU_ACT = "['정령 강림', '정령 방벽', '땅의 정령', '물 정령 탄']"
CO_ACT = "['별빛 지목', '차원 문', '마계 장막', '유혹의 손짓']"
TE_ACT = "['광역 손짓', '은빛 비행', '날개 방패', '나른한 꿈']"
MU_SK = "{ name: '정령의 손길', kit: true, inf: true, pool: 99, pct: 0.25, min: 10, cap: 999, hot: 0, hotN: 0, cd: 10, wind: 0.5, rec: 0.4, rng: 10, auto: 0.55, hotB: 0.02, hotT: 4 }"
TE_SK = "{ name: '요정의 축복', kit: true, inf: true, pool: 99, pct: 0.25, min: 10, cap: 999, hot: 0, hotN: 0, cd: 9, wind: 0.5, rec: 0.4, rng: 5, auto: 0.55, aoe: 5, gK: 0.85, gT: 4 }"
MU_NOTE = ("정령계 앰버서더 · 물계열 대정령 (5성 · 업적보상). 20층 무렵 굴을 찾아오는 세력의 대사 — 종족적인 이유로 플레이어와 우호를 쌓으려 함 (물레라는 이름은 플레이어의 뇌가 번역한 결과). "
           "힐 서폿: 정령 지시 (12칸 물 정령 탄 — 맞으면 1초 걸음 −20%) · 정령의 손길 (마력 치유 10칸). 기술 칸 1 = 정령 강림 (바닥을 탭) · 2 = 정령 방벽 (막을 쪽을 탭) — 땅의 정령 · 물 정령 탄은 스스로")
CO_NOTE = ("마계 대사 대귀족 (5성). 마계라고 하지만 정령이나 차원계 쪽에 가까운 인물 — 20층 무렵 물레와 함께 굴을 찾아오는 대사 (\"20층까지 돌파한 세력은 300년 만에 처음입니다. 우리는 당신을 돕고 싶습니다.\"). "
           "딜 서폿: 갈퀴 꼬리 (몸 가운데부터 3칸 부채꼴 · 두 번). 기술 칸 1 = 별빛 지목 (적을 탭) · 2 = 차원 문 (바닥을 탭 — 열려 있는 동안 동료를 탭하면 문 앞으로) — 마계 장막 · 유혹의 손짓은 스스로")
TE_NOTE = ("우주의 테헤라 — 외계 출신 요정 (생물학적으로는 곤충 계열?) · 7성 서포터 · 1기 · 정령왕의 축복 속의 초월자. 체력 200 · 방어 약함 · 기동 좋음 (명세 B10). "
           "손짓 (12칸 빛가루 탄 · 곡사 없음) · 요정의 축복 (마력 힐 — 곁 5칸 동료 모두). 기술 칸 1 = 광역 손짓 (쓸어낼 쪽을 탭 — 동료도 맞음) · 2 = 은빛 비행 (날아갈 곳을 탭) — 날개 방패 · 나른한 꿈은 스스로")
MU_BASE = (f"cls: '치유', role: '지원', weapon: '정령 지시', sm: 0.93, height: 1.72, weight: 55, sizeCls: '중형', ov: {{ hp: 280, atk: 26 }}, traits: [], unique: ['정령 계약'], race: '정령 (물 — 대정령)', origin: '정령계', "
           f"active: {MU_ACT}, skill: {MU_SK}, tactic: '힐 서폿 · 정령 장판 · 방벽', note: '{MU_NOTE}'")
CO_BASE = (f"cls: '근접', role: '미드필더', weapon: '갈퀴 꼬리', sm: 1.04, height: 1.8, weight: 58, sizeCls: '중형', ov: {{ hp: 320, atk: 34 }}, traits: ['갑피C', '괴력C', '속력B'], unique: ['마계 대사'], race: '마족 (심연계)', origin: '마계 (차원계에 가까움)', "
           f"active: {CO_ACT}, tactic: '딜 서폿 · 표식 · 차원 문 · 장막', note: '{CO_NOTE}'")
TE_BASE = (f"cls: '치유', role: '지원', weapon: '손짓', sm: 0.98, height: 1.7, weight: 40, sizeCls: '중형', ov: {{ hp: 200, atk: 18 }}, traits: ['축복:테헤라'], unique: ['요정 날개'], race: '요정', origin: '외계', "
           f"active: {TE_ACT}, skill: {TE_SK}, tactic: '서포터 · 마력 힐 · 광역 손짓 · 은빛 비행', note: '{TE_NOTE}'")
n0 = s.index("  { key: '어퐁', side: 0, ref: 'C-103'"); n1 = s.index('\n', n0) + 1
s = s[:n1] + (f"  {{ key: '물레', side: 0, ref: 'C-174', name: '물레', tier: 2, {MU_BASE}, nv: true, nvG: 'B', noDraw: true }},   /* v8.7.8 물레 (명세 C8 · 도감 C-174 · 3D 기술표 — 네오 정령계의 문 (15층) 을 넘으면 합류 · 뽑기에 없음) */\n"
              f"  {{ key: '콜라이더', side: 0, ref: 'C-175', name: '콜라이더', tier: 2, {CO_BASE}, nv: true, nvG: 'A', noDraw: true }},   /* v8.7.8 콜라이더 (명세 C8 · 도감 C-175 · 3D 기술표 — 대악마 하딤 (15층) 을 넘으면 합류 · 뽑기에 없음) */\n"
              f"  {{ key: '테헤라', side: 0, ref: 'C-016', name: '테헤라', tier: 2, {TE_BASE}, nv: true, nvG: 'B', noDraw: true }},   /* v8.7.8 테헤라 (명세 B10 · 도감 C-016 · 3D 기술표 — 테헤라 맵에서 세 번 청하면 합류 · 뽑기에 없음) */\n") + s[n1:]
n0 = s.index("  'C-103': { cls: '지휘', role: '전선', weapon: '어퐁의 철퇴'"); n1 = s.index('\n', n0) + 1
s = s[:n1] + (f"  'C-174': {{ {MU_BASE}, allyNv: 'B' }},   // v8.7.8 물레 (도감에서 바로 뽑아도 설계와 같게)\n"
              f"  'C-175': {{ {CO_BASE}, allyNv: 'A' }},   // v8.7.8 콜라이더\n"
              f"  'C-016': {{ {TE_BASE}, allyNv: 'B' }},   // v8.7.8 테헤라\n") + s[n1:]
rep("/* v8.7.8 카리우스 3D 기술 · 어퐁 */\n",
    "/* v8.7.8 카리우스 3D 기술 · 어퐁 */\n"
    f"  'C-174': {{ unique: ['정령 계약'], active: {MU_ACT}, skill: true }}, 'C-175': {{ unique: ['마계 대사'], active: {CO_ACT} }}, 'C-016': {{ traits: ['축복:테헤라'], unique: ['요정 날개'], active: {TE_ACT}, skill: true }},   /* v8.7.8 물레 · 콜라이더 · 테헤라 */\n")
# 뽑기 (여정 · 1층) · 저장된 도전자 에서 빠짐 — 합류는 이야기로만 (1층은 그대로)
rep("  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !have.has(d.key) && !have.has(d.name) && d.key !== '인주')",
    "  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !d.noDraw && !have.has(d.key) && !have.has(d.name) && d.key !== '인주')")   # v8.7.8 물레 · 콜라이더 · 테헤라는 이야기로만
rep("  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !CAMP_FIX.includes(d.key) && !CAMP_NO.includes(d.key))",
    "  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !d.noDraw && !CAMP_FIX.includes(d.key) && !CAMP_NO.includes(d.key))")
rep("  if (k === '@saved'){ const P = DESIGN_DEFAULTS.filter(x => x.side === 0 && x.key !== '인주');",
    "  if (k === '@saved'){ const P = DESIGN_DEFAULTS.filter(x => x.side === 0 && !x.noDraw && x.key !== '인주');   /* v8.7.8 대사 · 요정은 지난 도전자가 아님 */")

# ---------- 고유 · 특성 · 기술 글 ----------
rep("const UNIQUE = {\n", """const UNIQUE = {
  '정령 계약': { who: 'C-174',   // v8.7.8 물레 (3D 기술표 패시브 · 업적보상 앰버서더)
    lore: ['정령계 앰버서더 물레 — 20층 이후 찾아오는 세력의 대사이자 5성 서포터. 종족적인 이유로 플레이어와 우호관계를 쌓으려는 세력.', '물레라는 이름은 그저 플레이어의 뇌가 번역한 결과 — <천벌:바벨> 이전의 지역인 굴에서는 언어의 본질적인 의사소통이 가능하다.', '물계열 대정령. 정령 · 요정 쪽 마을에서는 인사 (bow) 로 대화 선택지가 생긴다.'],
    effects: ['싸움을 시작하면 편 모두 최대 체력 +8% (소환은 빼고)', '곁 5칸의 동료는 초당 최대 체력의 0.6% 를 되찾음 (3D 그대로)', '쓰러진 [불사] 동료가 두 배 빨리 일어남 (3D: 쓰러진 아군 살리는 시간 −50%)', '인사: 정령 · 요정 무리를 만나면 싸우기 전에 인사할 수 있음 (층마다 한 번 · 보통 싸움 — 받아들이면 길을 비켜 줌 · 전리품 없음)'],
    derived: [], limits: [], flags: {} },
  '마계 대사': { who: 'C-175',   // v8.7.8 콜라이더 (3D 기술표 패시브)
    lore: ['마계 대사 대귀족 콜라이더. 마계라고 하지만 정령이나 차원계 쪽에 가까운 인물이다. 20층 이후 시점에 물레와 함께 굴을 방문하는 대사.', '"20층까지 돌파한 세력은 300년 만에 처음입니다. 우리는 당신을 돕고 싶습니다." — 결국 탈출을 원하는 종족이 있고, 유지하려는 종족이 있다.', '심연계 마족 · 갈퀴 꼬리 — 코트 차림의 귀족.'],
    effects: ['함께 있는 같은 편의 마법 피해 +10% (탄 · 기술 모두 — 적 편 콜라이더면 적 편이)', '꼬리 그림자: 숨이 끊길 일격을 한 번 대신 막음 — 체력 1 로 버팀 (판에 한 번 · 출혈 · 화상 같은 지속 피해는 막지 못함)', '인사: 마족만의 무리를 만나면 싸우기 전에 인사할 수 있음 (층마다 한 번 · 보통 싸움 — 받아들이면 길을 비켜 줌 · 전리품 없음)', '유혹의 손짓은 마계 적에게 3초 (다른 적 2초)'],
    derived: [], limits: [], flags: {} },
  '요정 날개': { who: 'C-016',   // v8.7.8 테헤라 (3D 기술표 패시브)
    lore: ['우주의 테헤라 — 인카운터로 등장하는 외계 출신 요정 (생물학적으로는 곤충 계열?). 잠자리 같은 날개.', '빛의 정원에서 정령왕의 축복 속에 서 있는 초월자 — 귀찮아하지만 세 번 청하면 함께 간다.'],
    effects: ['늘 떠 있음 — 장판 (불 · 피 웅덩이 · 정령 강림의 적 쪽 늦춤) 과 얕은 물을 밟지 않음', '날아오는 원거리 (화살 · 탄 · 마법 · 투창) 를 15% 로 날개로 흘림', '은빛 비행은 바위 · 구덩이를 넘어 내려앉음'],
    derived: [], limits: [], flags: {} },
""")
rep("const TRAITS = {\n", """const TRAITS = {
  '축복:테헤라': '테헤라의 축복 (명세 B10) — 곁 5칸의 동료 (테헤라 자신도): 재생D (초당 체력 1.5 — 성해포의 재생과 같은 등급) · 받는 피해 × 0.9',   /* v8.7.8 */
""")
rep("const ACTIVE = {\n", """const ACTIVE = {
  '정령 강림': '물레 (3D) — 9칸 안의 바닥 (반지름 8) 에 물의 정령이 6초 내려앉음: 안의 동료 초당 최대 체력의 3% · 걸음 +15% / 안의 적 걸음 −30% (떠 있는 몸은 빼고). 예고 0.6초. 대기 14초. 명령: 기술 칸 1 → 바닥을 탭',
  '정령 방벽': '물레 (3D) — 앞 3칸에 너비 4칸 물 장막 4초: 넘어오는 적의 탄 (화살 · 탄 · 마법 · 창 · 곡사) 을 막고, 닿은 근접 적을 2칸 밀어냄 (준비가 끊김 · 한 번씩). 대기 10초. 명령: 기술 칸 2 → 막을 쪽을 탭',
  '땅의 정령': '물레 (3D 땅의 정령 부르기) — 무릎을 꿇고 작은 땅의 정령을 20초 부름: 체력이 가장 낮은 동료를 따라다니며 3초마다 회복탄 (최대 체력의 5% · 6칸). 정령은 고를 수 없고, 싸움이 끝나면 돌아감. 대기 25초',
  '물 정령 탄': '물레 (3D) — 물 정령 탄 세 발 (0.2초 간격 · 12칸 · 공격 × 0.6 씩 · 마법 · 맞으면 1초 걸음 −20%). 위급한 동료가 없을 때. 대기 6초',
  '별빛 지목': '콜라이더 (3D) — 15칸 가시 덩굴 끝의 별 탄: 맞은 적은 6초 동안 우리 편 모두에게 받는 피해 +20% · 처음 맞을 때 덩굴로 0.8초 묶임. 보스 · 동료가 노리는 적 · 센 적을 먼저. 대기 8초. 명령: 기술 칸 1 → 적을 탭',
  '차원 문': '콜라이더 (3D) — 앞 4칸에 검은 소용돌이 문을 8초 엶: 반지름 4 안의 적을 1초마다 1.5칸 문 쪽으로 끌어옴 (대형 · 보스 · 뛰어오른 몸은 버팀) · 문에 닿은 적 탄은 사라짐. 열려 있는 동안 다시 쓰면 15칸 안 동료 하나를 문 앞으로 순간이동 (한 번). 대기 12초 (연 때부터). 명령: 기술 칸 2 → 바닥을 탭 · 열린 동안 동료를 탭',
  '마계 장막': '콜라이더 (3D) — 둘레 반지름 6 의 반투명 날개 돔 5초: 안의 동료는 원거리 피해 −50% · 돔 경계를 넘어 들어오는 적은 0.5초 휘청 (한 번씩). 동료가 사격을 받거나 적이 몰려올 때. 대기 16초',
  '유혹의 손짓': '콜라이더 (3D) — 이마에 손 (0.7초) → 앞 8칸 60° 의 적 하나를 2초 매혹 (공격을 멈추고 콜라이더 쪽으로 걸어옴 · 준비가 끊김) · 마계 적은 3초 · 보스는 절반. 위급한 동료를 치려는 적 · 나를 치려는 적에게. 대기 12초',
  '광역 손짓': '테헤라 (명세 B10) — 방사형: 앞 8칸 90° 를 손짓으로 쓸어냄 (예고 0.6초) — 안의 모두 (동료도!) 공격 × 1.2 · 둔기 · 중대형까지 넘어짐 (막으면 밀리기만). 스스로는 동료가 없을 때만. 대기 10초. 명령: 기술 칸 1 → 쓸어낼 쪽 (적 · 바닥) 을 탭',
  '은빛 비행': '테헤라 (3D) — 몸을 눕혀 8칸 날아감 (바위 · 구덩이를 넘음 · 날아가는 동안 끊기지 않음): 지나간 줄 (폭 1) 의 적 공격 × 0.4 · 0.8초 둔화. 붙은 근접을 피해 동료 쪽으로. 대기 7초. 명령: 기술 칸 2 → 날아갈 곳을 탭',
  '날개 방패': '테헤라 (3D) — 날개로 몸을 감쌈 2초 (움직이지 못함): 받는 피해 −80% · 끝날 때 둘레 3칸 빛가루로 적 1초 눈멂. 치명적인 일격이 올 때 (날아 피할 수 없으면). 대기 10초',
  '나른한 꿈': '테헤라 (3D) — 자리에 앉아 졸음 (5초 · 움직이지 못함): 둘레 반지름 6 장판 — 안의 적 공격 속도 −40% · 안의 동료 초당 1%. 동료와 맞붙은 적이 둘 넘을 때 (내게 붙은 적이 없을 때). 대기 14초',
""")
rep("const RAT_TOAST = ", "const SPIRIT_TOAST = '🌿 땅의 정령은 물레의 기술로만 움직여요 (고를 수 없음 — 다친 동료를 스스로 따라다님)';   /* v8.7.8 */\nconst noPick = u => !!u && (u.ratOf != null || u.spiritOf != null);   /* v8.7.8 쥐 · 땅의 정령은 고를 수 없음 */\nconst RAT_TOAST = ")
rep("${u.skill && u.skill.kit ? ' · 겸: 의무 (구급상자)' : u.skill ? ' · 겸: 치유' : ''}",
    "${u.skill && u.skill.kit && !u.skill.inf ? ' · 겸: 의무 (구급상자)' : u.skill ? ' · 겸: 치유' + (u.skill.inf ? ' (' + esc(u.skill.name) + ' — 마력)' : '') : ''}")   # v8.7.8 마력 치유 (딸기 · 물레 · 테헤라) 는 구급상자가 아님

# ---------- 아이콘 판 8 × 10 꽉 참 (61 ~ 79) · 기술 칸 그림 · 겨눌 곳 글 ----------
rep('"딥 킥": 60,', '"딥 킥": 60, "정령 강림": 61, "정령 방벽": 62, "땅의 정령": 63, "물 정령 탄": 64, "정령 계약": 65, "정령의 손길": 66, "차원 문": 67, "별빛 지목": 68, "마계 장막": 69, "유혹의 손짓": 70, "마계 대사": 71, "갈퀴 꼬리": 72, "광역 손짓": 73, "은빛 비행": 74, "날개 방패": 75, "나른한 꿈": 76, "요정 날개": 77, "축복:테헤라": 78, "요정의 축복": 79,')   # v8.7.8 물레 · 콜라이더 · 테헤라
shutil.copy(D + 'ico878/icons_v878d.webp', D + 'build/icons.webp')   # v1.0 아이콘 판 8 × 10 (mkico_d.py — 61 ~ 79)
rep("kslam: '🔨', krush: '🐗' };   /* v8.7.8 굿윌 · 포렌 · 어퐁 · 카리우스 (전엔 ★) */",
    "kslam: '🔨', krush: '🐗', mdesc: '💧', mwall: '🌊', mspirit: '🌿', mvolley: '💦', cgate: '🕳', cstar: '⭐', cveil: '🦇', clure: '💗', tsweep: '🌬', tflight: '🦋', twing: '🛡', tdream: '💤' };   /* v8.7.8 굿윌 · 포렌 · 어퐁 · 카리우스 · 물레 · 콜라이더 · 테헤라 (전엔 ★) */")
rep("const SPEC_TGT = { asup:",
    "const SPEC_TGT = { mdesc: '💧 정령 강림: 바닥을 탭 (9칸 안 — 반지름 8 · 6초 · 동료 회복 · 적 느려짐)', mwall: '🌊 정령 방벽: 막을 쪽 (바닥 · 적) 을 탭 (앞 3칸 · 너비 4 · 4초)', mspirit: '🌿 땅의 정령: 바로 부름', mvolley: '💦 물 정령 탄: 적을 탭 (12칸 · 세 발)', "
    "cgate: '🕳 차원 문: 열 쪽 (바닥 · 적) 을 탭 (앞 4칸) · 열려 있으면 동료를 탭 = 문 앞으로', cstar: '⭐ 별빛 지목: 적을 탭 (15칸 — 6초 받는 피해 +20%)', cveil: '🦇 마계 장막: 바로 (둘레 6칸 · 5초)', clure: '💗 유혹의 손짓: 적을 탭 (앞 8칸 60° — 2초 매혹)', "
    "tsweep: '🌬 광역 손짓: 쓸어낼 쪽 (적 · 바닥) 을 탭 (8칸 90° — 동료도 맞음)', tflight: '🦋 은빛 비행: 날아갈 곳 (바닥) 을 탭 (8칸 · 바위를 넘음)', twing: '🛡 날개 방패: 바로 (2초)', tdream: '💤 나른한 꿈: 바로 (앉아서 5초)', asup:")
# 제자리 기술 (땅의 정령 · 마계 장막 · 날개 방패 · 나른한 꿈) 은 겨눌 것 없이 바로
rep("    if (sp.k === 'ward' || sp.k === 'pfort'){",
    "    if (SUP_SELF_TX[sp.k]){ D.forEach(u => { u.order = { k: 'spec', s: sp.k }; }); noteOrders(D); toast(`${D.map(u => u.name).join(' · ')}: ${SUP_SELF_TX[sp.k]}${specCd(world, D, S2.k) > 0 ? ' — ' + f2(specCd(world, D, S2.k)) + '초 뒤' : ''}`); hud(); return; }   /* v8.7.8 제자리 기술 — 바로 */\n"
    "    if (sp.k === 'ward' || sp.k === 'pfort'){")
rep("let sweepAim = null;   /* v7.24.4 */",
    "let sweepAim = null;   /* v7.24.4 */\n"
    "const SUP_SELF_TX = { mspirit: '땅의 정령을 부름 (20초 — 다친 동료를 따라 회복탄)', cveil: '마계 장막 (둘레 6칸 · 5초 — 안의 동료 원거리 피해 절반)', twing: '날개 방패 (2초 — 받는 피해 −80% · 끝에 빛가루)', tdream: '나른한 꿈 (앉아서 5초 — 둘레 적 공격 속도 −40%)' };   /* v8.7.8 */\n"
    "const SUP_GND = { mdesc: '정령 강림', mwall: '정령 방벽', cgate: '차원 문', tsweep: '광역 손짓', tflight: '은빛 비행' };   /* v8.7.8 바닥을 찍는 기술 */")
# 바닥 · 동료를 찍음 (적을 찍으면 위의 공통 길 — 그 적 쪽으로)
rep("    if ((!u || (u.side === 0 && !C.includes(u))) && A0.s === 'root'){",
    "    if ((!u || (u.side === 0 && !C.includes(u))) && SUP_GND[A0.s]){   /* v8.7.8 물레 · 콜라이더 · 테헤라: 바닥 (동료 곁 바닥도) — 차원 문이 열려 있으면 동료 = 문 앞으로 */\n"
    "      if (A0.s === 'cgate' && u && u.side === 0){ const L2 = C.filter(x => sfOf(Wd, 'gate', x.i) && !sfOf(Wd, 'gate', x.i).tpd); if (L2.length){ L2.forEach(x => { x.order = { k: 'spec', s: 'cgate', b: u.i }; }); noteOrders(L2); toast(`${L2.map(x => x.name).join(' · ')}: ${reul(u.name)} 차원 문 앞으로`); return done(); } }\n"
    "      if (A0.s === 'tflight' && rock(Wd.map, w.x, w.y)){ toast('바위 위로는 내려앉을 수 없어요 — 바위 너머 바닥을 누르세요'); return; }\n"
    "      C.forEach(x => { x.order = { k: 'spec', s: A0.s, x: w.x, y: w.y }; }); noteOrders(C); toast(`${C.map(x => x.name).join(' · ')}: ${ro(coord(w.x, w.y))} ${SUP_GND[A0.s]}${A0.s === 'tsweep' ? ' (동료도 맞을 수 있어요)' : ''}`); return done(); }\n"
    "    if ((!u || (u.side === 0 && !C.includes(u))) && A0.s === 'root'){")

# ---------- 동작 이름 ----------
rep("  if (a.k === 'karRoar') return '불경자 — 울부짖음';   /* v8.7.8 카리우스 */\n",
    "  if (a.k === 'karRoar') return '불경자 — 울부짖음';   /* v8.7.8 카리우스 */\n"
    "  if (a.k === 'cwhip') return a.ph === 'wind' ? `🦂 갈퀴 꼬리${b ? ' → ' + b.name : ''} (${f2(a.left)}초)` : a.ph === 'hit2' ? '🦂 갈퀴 꼬리 — 검은 파편' : `갈퀴 꼬리 뒤 (${f2(a.left)}초 남음)`;   /* v8.7.8 콜라이더 */\n"
    "  if (a.k === 'tfly') return '🦋 은빛 비행 — 날아가는 중 (끊기지 않음)';   /* v8.7.8 테헤라 */\n"
    "  if (a.k === 'twing') return `🛡 날개 방패 — 몸을 감쌈 (${f2(a.left)}초 · 받는 피해 −80%)`;\n"
    "  if (a.k === 'tdream') return `💤 나른한 꿈 — 앉아 졸음 (${f2(a.left)}초)`;\n"
    "  if (a.k === 'spec' && a.s === 'mvolley' && a.ph === 'rec') return '💦 물 정령 탄 — 연달아';\n")

# ---------- 기록 (글) ----------
rep("      case 'apSup': out.push(", (
    "      case 'pact': out.push(`${T(e)}💧 ◆정령 계약 — ${e.side === 0 ? '우리' : '적'} 편 ${e.n}명 최대 체력 +${Math.round((((Wd.rules.sup8 || {}).pact || {}).hp || 0.08) * 100)}%`); break;   // v8.7.8 물레\n"
    "      case 'mdesc': out.push(`${T(e)}💧 ${n(e.a)} 정령 강림 — 안의 동료 ${e.n} · 적 ${e.m} (${(SPR(Wd, 'mdesc').t || 6)}초)`); break;\n"
    "      case 'mwall': out.push(`${T(e)}🌊 ${n(e.a)} 정령 방벽 (${(SPR(Wd, 'mwall').t || 4)}초)`); break;\n"
    "      case 'wallBlock': out.push(`${T(e)}🌊 ${n(e.a)}의 방벽이 ${n(e.b)}의 ${e.jav ? '창' : e.arc ? '곡사' : shotNm(Wd, Wd.units[e.b])}을 막음`); break;\n"
    "      case 'wallPush': out.push(`${T(e)}🌊 ${n(e.b)} 방벽에 밀려남 (${n(e.a)})`); break;\n"
    "      case 'mspirit': out.push(`${T(e)}🌿 ${n(e.a)} 땅의 정령을 부름 (${(SPR(Wd, 'mspirit').t || 20)}초)`); break;\n"
    "      case 'spiritHeal': out.push(`${T(e)}🌿 땅의 정령 → ${n(e.b)} 회복탄 +${e.amt}`); break;\n"
    "      case 'spiritGone': out.push(`${T(e)}🌿 땅의 정령이 돌아감 (${e.why})`); break;\n"
    "      case 'mvolley': out.push(`${T(e)}💦 ${n(e.a)} 물 정령 탄 → ${n(e.b)} (${e.n}발)`); break;\n"
    "      case 'cgate': out.push(`${T(e)}🕳 ${n(e.a)} 차원 문을 엶 — 둘레 적 ${e.n} (${(SPR(Wd, 'cgate').t || 8)}초)`); break;   // v8.7.8 콜라이더\n"
    "      case 'gatePull': out.push(`${T(e)}🕳 ${n(e.a)}의 문이 ${e.n}명을 끌어당김${e.heavy ? ' · 큰 몸 ' + e.heavy + ' 버팀' : ''}`); break;\n"
    "      case 'gateEat': out.push(`${T(e)}🕳 ${n(e.a)}의 문이 ${n(e.b)}의 ${e.jav ? '창' : shotNm(Wd, Wd.units[e.b])}을 삼킴`); break;\n"
    "      case 'gateTp': out.push(`${T(e)}🕳 ${n(e.a)} → ${n(e.b)} 차원 문 앞으로 (${e.d}칸)`); break;\n"
    "      case 'gateClose': out.push(`${T(e)}🕳 ${n(e.a)}의 차원 문이 닫힘${e.tp ? ' (동료를 옮김)' : ''}`); break;\n"
    "      case 'cstar': out.push(`${T(e)}⭐ ${n(e.a)} 별빛 지목 → ${n(e.b)}`); break;\n"
    "      case 'starMark': out.push(`${T(e)}⭐ ${n(e.b)} 별 표식 — ${(SPR(Wd, 'cstar').t || 6)}초 받는 피해 +${Math.round(((SPR(Wd, 'cstar').k || 1.2) - 1) * 100)}%${e.vine ? ' · 덩굴에 ' + (SPR(Wd, 'cstar').vine || 0.8) + '초 묶임' : ''}`); break;\n"
    "      case 'cveil': out.push(`${T(e)}🦇 ${n(e.a)} 마계 장막 — 안의 동료 ${e.n} (${(SPR(Wd, 'cveil').t || 5)}초 · 원거리 피해 절반)`); break;\n"
    "      case 'veilStun': out.push(`${T(e)}🦇 ${n(e.b)} 장막을 넘다 휘청 (${n(e.a)}의 장막)`); break;\n"
    "      case 'clure': out.push(`${T(e)}💗 ${n(e.a)} 유혹의 손짓 → ${n(e.b)} 매혹 ${e.dur}초${e.demon ? ' (마계)' : ''}`); break;\n"
    "      case 'charmEnd': out.push(`${T(e)}💗 ${n(e.a)} 매혹이 풀림`); break;\n"
    "      case 'colTail': out.push(`${T(e)}🦂 ${n(e.b)} ◆마계 대사 — 꼬리 그림자가 ${n(e.a)}의 일격을 대신 막음 (체력 1)`); break;\n"
    "      case 'cwhip': out.push(`${T(e)}🦂 ${n(e.a)} 갈퀴 꼬리${e.n === 2 ? ' — 검은 파편' : ''}${e.hit.length ? ' → ' + e.hit.map(n).join(' · ') : ' (맞은 적 없음)'}`); break;\n"
    "      case 'wingDodge': out.push(`${T(e)}🦋 ${n(e.a)} 날개로 ${n(e.b)}의 ${shotNm(Wd, Wd.units[e.b])}을 흘림`); break;   // v8.7.8 테헤라\n"
    "      case 'fairyBless': out.push(`${T(e)}✨ ${n(e.a)} 요정의 축복 — ${e.n}명 (${(((Wd.units[e.a] || {}).skill || {}).gT || 4)}초 받는 피해 −15%)`); break;\n"
    "      case 'tsweep': out.push(`${T(e)}🌬 ${n(e.a)} 광역 손짓 — ${e.hit.length}명${e.down ? ' · ' + e.down + '명 넘어짐' : ''}${e.ff ? ' · 동료 ' + e.ff + '명도 맞음' : ''}`); break;\n"
    "      case 'tflight': out.push(`${T(e)}🦋 ${n(e.a)} 은빛 비행 (${e.d}칸)`); break;\n"
    "      case 'tland': out.push(`${T(e)}🦋 ${n(e.a)} 내려앉음${e.n ? ' — 지나간 줄의 적 ' + e.n + '명' : ''}`); break;\n"
    "      case 'twing': out.push(`${T(e)}🛡 ${n(e.a)} 날개 방패 (${(SPR(Wd, 'twing').t || 2)}초 · 받는 피해 −80%)`); break;\n"
    "      case 'twingEnd': out.push(`${T(e)}✨ ${n(e.a)} 날개를 펼침 — 빛가루${e.n ? ' · 적 ' + e.n + '명 눈멂' : ''}`); break;\n"
    "      case 'tdream': out.push(`${T(e)}💤 ${n(e.a)} 나른한 꿈 — 둘레 적 ${e.m} (${(SPR(Wd, 'tdream').t || 5)}초 · 공격 속도 −40%)`); break;\n"
    "      case 'apSup': out.push("))
# 대상 없는 빗나감 (가방 · 뿌리 벽 · 투척 · 기술) — 전엔 기록 글이 여기서 멈춤
rep("      case 'miss': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 빗나감: ${e.why}",
    "      case 'miss': if (e.b == null || !Wd.units[e.b]){ out.push(`${T(e)}✗ ${n(e.a)}${e.spec ? ' ' + SPEC_NM(e.spec) : ''} — ${e.why}`); break; } if (e.spec){ out.push(`${T(e)}✗ ${n(e.a)} ${SPEC_NM(e.spec)} → ${n(e.b)} — ${e.why}`); break; }   /* v8.7.8 대상 없는 빗나감 (가방 · 뿌리 벽 · 투척) 에 기록 글이 멈추던 것 · 기술은 기술 이름으로 */\n"
    "        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 빗나감: ${e.why}")

# ---------- 서술 ----------
rep("    case 'miss': { const a = U(e.a), b = U(e.b);\n",
    "    case 'miss': { const a = U(e.a), b = e.b != null ? U(e.b) : null;\n"
    "      if (e.inv) return null;   /* v8.7.8 가방 · 장비 일 — 공격이 아님 (전엔 '공격이 빗나간다') */\n"
    "      if (e.spec) return a.side === 0 || a.seenBy ? { c: 'dim', s: `${ga(a.name)} ${reul(SPEC_NM(e.spec))} 헛친다 — ${e.why}.` } : null;\n"
    "      if (!b) return null;\n")
rep("    case 'apSweep': if (", (
    "    case 'pact': return e.side === 0 ? { c: 'good', s: `물레가 두 손을 모은다 — 정령 계약. 모두의 몸에 맑은 물기가 돈다.` } : null;   // v8.7.8 물레\n"
    "    case 'mdesc': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 손을 들자 물의 정령이 내려앉는다 — 정령 강림!` };\n"
    "    case 'mwall': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${n(e.a)} 앞에 물 장막이 솟는다 — 정령 방벽.` };\n"
    "    case 'wallBlock': return { c: 'dim', s: `${n(e.b)}의 ${e.jav ? '창' : shotNm(Wd, U(e.b))}이 물 장막에 막힌다.` };\n"
    "    case 'mspirit': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 무릎을 꿇는다 — 작은 땅의 정령이 깨어난다.` };\n"
    "    case 'mvolley': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 손가락으로 가리킨다 — 물 정령 탄 세 발!` };\n"
    "    case 'cgate': return U(e.a).side === 0 || U(e.a).seenBy ? { c: U(e.a).side ? 'bad' : 'good', s: `${n(e.a)}의 앞에 검은 소용돌이 문이 열린다 — 차원 문.` } : { c: 'bad', s: '어둠 속에 검은 소용돌이 문이 열린다.' };   // v8.7.8 콜라이더 (이름은 보이는 시전자만)\n"
    "    case 'gatePull': if (e.n < 2 || !e.vis) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${e.n}명이 검은 문 쪽으로 끌려간다.` };\n"
    "    case 'gateEat': return { c: 'dim', s: `날아가던 ${e.jav ? '창' : shotNm(Wd, U(e.b))}이 검은 문에 삼켜진다.` };\n"
    "    case 'gateTp': if (!(U(e.b).side === 0 || U(e.b).seenBy)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.b))} 검은 문을 지나 앞으로 나선다.` };\n"
    "    case 'starMark': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${n(e.b)}에게 별 표식이 박힌다${e.vine ? ' — 가시 덩굴이 발을 묶는다!' : '.'}` };\n"
    "    case 'cveil': return { c: U(e.a).side ? 'bad' : 'good', s: U(e.a).side === 0 || U(e.a).seenBy ? `${n(e.a)} 둘레로 반투명한 날개 돔이 펼쳐진다 — 마계 장막.` : '어둠 속에 반투명한 날개 돔이 펼쳐진다.' };\n"
    "    case 'veilStun': if (!e.vis) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.b))} 장막을 넘다 휘청인다.` };\n"
    "    case 'clure': if (!e.vis) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${n(e.a)}의 손짓 — ${ga(n(e.b))} 넋을 잃고 걸어온다.${e.demon ? ' (같은 마계의 피)' : ''}` };\n"
    "    case 'colTail': if (!(U(e.b).side === 0 || U(e.b).seenBy || U(e.a).side === 0)) return null; return { c: U(e.b).side ? 'bad' : 'good', s: `꼬리 그림자가 일격을 대신 받는다 — ${ga(n(e.b))} 버틴다!` };\n"
    "    case 'fairyBless': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 허리를 굽혀 손을 뻗는다 — 요정의 축복.` };   // v8.7.8 테헤라\n"
    "    case 'tsweep': return { c: U(e.a).side ? 'bad' : 'good', s: `${U(e.a).side === 0 || U(e.a).seenBy ? ga(n(e.a)) + ' 크게 손을 휘젓는다 — 광역 손짓!' : '어둠 속에서 거센 바람이 쓸고 지나간다!'}${e.down ? ' ' + e.down + '명이 쓸려 넘어진다.' : ''}${e.ff ? ' (같은 편도 휩쓸렸다)' : ''}` };\n"
    "    case 'tflight': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 몸을 눕혀 은빛으로 날아간다.` };\n"
    "    case 'twing': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 날개로 몸을 감싼다.` };\n"
    "    case 'twingEnd': if (!e.n || !e.vis) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `날개가 펼쳐지며 빛가루가 흩날린다 — ${e.n}명이 눈을 감싼다.` };\n"
    "    case 'tdream': return { c: U(e.a).side ? 'bad' : 'good', s: U(e.a).side === 0 || U(e.a).seenBy ? `${ga(n(e.a))} 자리에 앉아 꾸벅인다 — 나른한 꿈이 번진다.` : '나른한 졸음이 번져 온다.' };\n"
    "    case 'apSweep': if ("))

# ---------- 그림: 장판 · 문 · 방벽 · 장막 (바닥 위 · 몸 아래) ----------
rep("  // 벽 횃불 불꽃\n", "  if (!ed && Wd.sf8 && Wd.sf8.length) drawSupFields(Wd, ox, oy, ts, see);   /* v8.7.8 물레 · 콜라이더 · 테헤라 */\n  // 벽 횃불 불꽃\n")
rep("  if (!ed && Wd.units.some(u => u.alive && u.act && ((u.act.k === 'spec' && KAR_TG.includes(u.act.s)) || u.act.sup))) drawKarWarn(Wd, ox, oy, ts);   /* v8.7.8 카리우스 · 어퐁 */",
    "  if (!ed && Wd.units.some(u => u.alive && u.act && ((u.act.k === 'spec' && KAR_TG.includes(u.act.s)) || u.act.sup))) drawKarWarn(Wd, ox, oy, ts);   /* v8.7.8 카리우스 · 어퐁 */\n"
    "  if (!ed && Wd.sup8) drawSupWarn(Wd, ox, oy, ts);   /* v8.7.8 물레 · 콜라이더 · 테헤라 */")
rep("// v8.7.4 3D 보스 기술표 예고:", r"""// v8.7.8 물레 · 콜라이더 · 테헤라의 장판 · 문 · 방벽 · 장막 — 엔진 W.sf8 그대로 (모양 · 자리 · 남은 때). 우리 편 푸른 테 · 적 붉은 테 (적의 것은 보이는 시전자 · 모두 보기 · 우리 몸이 닿은 것만)
const SF_NM = { desc: '💧 정령 강림', dream: '💤 나른한 꿈', veil: '🦇 마계 장막', gate: '🕳 차원 문', wall: '🌊 정령 방벽' };
function drawSupFields(Wd, ox, oy, ts, see){
  const now = Wd.t;
  for (const F of Wd.sf8){ if (now >= F.until) continue; const by = Wd.units[F.by], R0 = F.k === 'wall' ? F.h : F.r || 1;
    if (F.side !== 0 && !see && !(by && by.seenBy) && !Wd.units.some(u => u.side === 0 && u.alive && Math.hypot(u.x - F.x, u.y - F.y) <= R0 + 1)) continue;
    const left = F.until - now, fade = Math.min(1, left / 0.5, (now - (F.t0 || now - 1)) / 0.25 + 0.2), cx = ox + F.x * ts, cy = oy + F.y * ts, rim = F.side === 0 ? '120,200,255' : '255,110,90';
    ctx.save(); ctx.globalAlpha = Math.max(0.15, Math.min(1, fade));
    if (F.k === 'desc' || F.k === 'dream'){ const R = F.r * ts, col = F.k === 'desc' ? '90,170,255' : '200,160,255';
      ctx.fillStyle = `rgba(${col},0.11)`; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();
      for (let k = 0; k < 2; k++){ const q = ((now * 0.5 + k * 0.5) % 1); ctx.strokeStyle = `rgba(${col},${(0.35 * (1 - q)).toFixed(2)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * (0.25 + 0.75 * q), 0, 6.283); ctx.stroke(); }
      ctx.strokeStyle = `rgba(${rim},.75)`; ctx.lineWidth = 2; ctx.setLineDash([ts * 0.3, ts * 0.15]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }
    else if (F.k === 'veil'){ const R = F.r * ts, g = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R); g.addColorStop(0, 'rgba(120,80,160,0.04)'); g.addColorStop(1, 'rgba(150,100,200,0.24)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill(); ctx.strokeStyle = `rgba(${rim},.8)`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
      ctx.strokeStyle = 'rgba(210,190,240,.35)'; ctx.lineWidth = 1; for (let k = 0; k < 6; k++){ const a = k * 1.047 + 0.3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx + Math.cos(a + 0.4) * R * 0.6, cy + Math.sin(a + 0.4) * R * 0.6, cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke(); } }
    else if (F.k === 'gate'){ const R = F.r * ts, e = (F.eat || 0.9) * ts;
      ctx.strokeStyle = `rgba(${rim},.45)`; ctx.lineWidth = 1.5; ctx.setLineDash([ts * 0.2, ts * 0.2]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, e * 1.3); g.addColorStop(0, 'rgba(5,0,12,0.95)'); g.addColorStop(0.7, 'rgba(40,10,70,0.75)'); g.addColorStop(1, 'rgba(60,20,90,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, e * 1.3, 0, 6.283); ctx.fill();
      ctx.strokeStyle = 'rgba(190,150,255,.8)'; ctx.lineWidth = 2; for (let k = 0; k < 3; k++){ const a0 = -now * 3 + k * 2.094; ctx.beginPath(); ctx.arc(cx, cy, e * (0.45 + 0.2 * k), a0, a0 + 2.2); ctx.stroke(); } }
    else if (F.k === 'wall'){ const x0 = ox + (F.x - F.ux * F.h) * ts, y0 = oy + (F.y - F.uy * F.h) * ts, x1 = ox + (F.x + F.ux * F.h) * ts, y1 = oy + (F.y + F.uy * F.h) * ts;
      ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(110,190,255,.35)'; ctx.lineWidth = Math.max(8, ts * 0.45); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = `rgba(${rim},.9)`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = 'rgba(220,240,255,.6)'; ctx.lineWidth = 1.2; for (let k = 0; k < 4; k++){ const q = ((now * 0.8 + k * 0.25) % 1), px = x0 + (x1 - x0) * q, py = y0 + (y1 - y0) * q; ctx.beginPath(); ctx.arc(px, py, ts * 0.12, 0, 6.283); ctx.stroke(); } }
    ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const t = `${SF_NM[F.k] || F.k} ${Math.ceil(left)}초`, ly = cy - (F.k === 'wall' ? 0.6 * ts : F.k === 'gate' ? (F.eat || 0.9) * ts * 1.5 : F.r * ts) - 9, tw = ctx.measureText(t).width;
    ctx.fillStyle = 'rgba(8,10,20,.72)'; ctx.fillRect(cx - tw / 2 - 3, ly - 6, tw + 6, 13); ctx.fillStyle = F.side === 0 ? '#cfe8ff' : '#ffc8b8'; ctx.fillText(t, cx, ly + 0.5);
    ctx.restore(); }
}
// v8.7.8 서포터 기술 예고 (엔진 supResolve 와 같은 모양): 정령 강림 · 장막 · 꿈 (원) · 방벽 (줄) · 차원 문 (원 + 가운데) · 광역 손짓 (90°) · 유혹 (60°) · 은빛 비행 (화살) · 물 정령 탄 · 별빛 (점선) — 적 붉게 · 아군 푸르게
function drawSupWarn(Wd, ox, oy, ts){
  const see = $('seeAll').checked, now = Wd.t;
  for (const u of Wd.units){ const A = u.act; if (!u.alive || !A || A.k !== 'spec' || A.phase !== 'wind' || !SUP_K.includes(A.s) || !(u.side === 0 || u.seenBy || see)) continue;
    const S = SPR(Wd, A.s), col = u.side ? '255,70,60' : '110,190,255', px = ox + u.x * ts, py = oy + u.y * ts, q = Math.min(1, (now - A.t0) / Math.max(0.05, A.end - A.t0)), ang = A.ang != null ? A.ang : u.face || 0, t = A.b != null ? Wd.units[A.b] : null;
    const circ = (x, y, R) => { ctx.fillStyle = `rgba(${col},${(0.1 + 0.15 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill(); ctx.fillStyle = `rgba(${col},${(0.18 + 0.25 * q).toFixed(2)})`; ctx.beginPath(); ctx.arc(x, y, R * q, 0, 6.283); ctx.fill(); ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.stroke(); };
    const fan = (R, arc) => { const a0 = ang - arc / 2, a1 = ang + arc / 2, f0 = r0 => { ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, r0, a0, a1); ctx.closePath(); }; ctx.fillStyle = `rgba(${col},${(0.1 + 0.15 * q).toFixed(2)})`; f0(R); ctx.fill(); ctx.fillStyle = `rgba(${col},${(0.18 + 0.25 * q).toFixed(2)})`; f0(R * q); ctx.fill(); ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2; f0(R); ctx.stroke(); };
    ctx.save();
    if (A.s === 'mdesc') circ(ox + (A.px != null ? A.px : u.x) * ts, oy + (A.py != null ? A.py : u.y) * ts, (S.r || 8) * ts);
    else if (A.s === 'cveil' || A.s === 'tdream') circ(px, py, (S.r || 6) * ts);
    else if (A.s === 'cgate' && A.tp != null){ const G = sfOf(Wd, 'gate', u.i), a = Wd.units[A.tp]; if (G && a){ ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ox + a.x * ts, oy + a.y * ts); ctx.lineTo(ox + G.x * ts, oy + G.y * ts); ctx.stroke(); ctx.setLineDash([]); } }
    else if (A.s === 'cgate'){ const d = S.ahead || 4; circ(px + Math.cos(ang) * d * ts, py + Math.sin(ang) * d * ts, (S.r || 4) * ts); }
    else if (A.s === 'mwall'){ const d = S.ahead || 3, h = (S.len || 4) / 2, c = Math.cos(ang), s0 = Math.sin(ang), wx = px + c * d * ts, wy = py + s0 * d * ts; ctx.strokeStyle = `rgba(${col},${(0.45 + 0.45 * q).toFixed(2)})`; ctx.lineWidth = Math.max(4, ts * 0.25); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(wx + s0 * h * ts, wy - c * h * ts); ctx.lineTo(wx - s0 * h * ts, wy + c * h * ts); ctx.stroke(); }
    else if (A.s === 'tsweep') fan((S.rng || 8) * ts, (S.arc || 90) * Math.PI / 180);
    else if (A.s === 'clure') fan((S.rng || 8) * ts, (S.arc || 60) * Math.PI / 180);
    else if (A.s === 'tflight'){ const L0 = Math.min(S.len || 8, Math.hypot((A.px != null ? A.px : u.x) - u.x, (A.py != null ? A.py : u.y) - u.y)) * ts, ex = px + Math.cos(ang) * L0, ey = py + Math.sin(ang) * L0; ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(ex, ey, u.r * ts, 0, 6.283); ctx.stroke(); }
    else if ((A.s === 'mvolley' || A.s === 'cstar') && t && t.alive){ const tx = ox + t.x * ts, ty = oy + t.y * ts; ctx.strokeStyle = `rgba(${col},.9)`; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(tx, ty, t.r * ts + 4 + 4 * q, 0, 6.283); ctx.stroke(); }
    ctx.restore(); ctx.save(); ctx.font = '700 12px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = u.side ? '#ffb4a8' : '#cfe8ff'; ctx.fillText((SPEC_IC[A.s] || '') + ' ' + SPEC_NM(A.s), px, py - u.r * ts - 8); ctx.restore(); }
}
// v8.7.8 걸린 것 · 몸의 모습 (보이는 몸만): 별 표식 · 덩굴 · 매혹 · 느려짐 · 눈멂 · 축복 · 정령 강림 · 장막 · 꿈 · 정령의 손길 · 날개 방패 · 앉아 졸음 · 은빛 비행 · 요정 날개 · 땅의 정령
function supMarks(Wd, u, px, py, r, now){
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (u.fairyW && !(u.act && u.act.k === 'twing')){ const fa = (u.face || 0) + Math.PI, fl = 0.35 + 0.15 * Math.sin(now * 14); ctx.fillStyle = 'rgba(230,240,255,.28)'; ctx.strokeStyle = 'rgba(240,248,255,.55)'; ctx.lineWidth = 1; for (const s0 of [-1, 1]){ const a = fa + s0 * 0.7; ctx.beginPath(); ctx.ellipse(px + Math.cos(a) * r * 0.95, py + Math.sin(a) * r * 0.95, r * 0.75, r * fl, a, 0, 6.283); ctx.fill(); ctx.stroke(); } }   // 늘 떠 있는 날개
  if (u.act && u.act.k === 'twing'){ ctx.fillStyle = 'rgba(250,235,250,.45)'; ctx.strokeStyle = 'rgba(255,240,255,.9)'; ctx.lineWidth = 2; for (const s0 of [-1, 1]){ ctx.beginPath(); ctx.ellipse(px + s0 * r * 0.45, py, r * 0.75, r * 1.15, s0 * 0.35, 0, 6.283); ctx.fill(); ctx.stroke(); } }
  if (u.act && u.act.k === 'tfly'){ const A = u.act, g = ctx.createLinearGradient(ox8 + A.fx * ts8, oy8 + A.fy * ts8, px, py); g.addColorStop(0, 'rgba(220,230,255,0)'); g.addColorStop(1, 'rgba(230,238,255,.8)'); ctx.strokeStyle = g; ctx.lineWidth = Math.max(3, r * 0.6); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ox8 + A.fx * ts8, oy8 + A.fy * ts8); ctx.lineTo(px, py); ctx.stroke(); }   // 은빛 비행 — 날아온 길
  if (u.act && u.act.k === 'tdream'){ ctx.font = `700 ${Math.max(10, r * 0.7)}px sans-serif`; ctx.fillStyle = 'rgba(220,200,255,.95)'; const q = (now * 0.8) % 1; ctx.fillText('z', px + r * 0.6 + q * r * 0.4, py - r - q * r * 0.8); ctx.fillText('Z', px + r * 1.0, py - r * 1.5 - q * r * 0.4); }
  if (u.star8 && now < u.star8.until){ ctx.strokeStyle = `rgba(255,215,90,${(0.55 + 0.35 * Math.sin(now * 6)).toFixed(2)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, r + 4, 0, 6.283); ctx.stroke(); ctx.font = `${Math.max(10, r * 0.75)}px sans-serif`; ctx.fillStyle = '#ffd95a'; ctx.fillText('★', px + r * 0.95, py - r * 0.95); }
  if (now < (u.vineT || -9)){ ctx.strokeStyle = 'rgba(90,200,110,.95)'; ctx.lineWidth = 2.5; for (let k = 0; k < 5; k++){ const a = k * 1.257 + 0.4; ctx.beginPath(); ctx.arc(px + Math.cos(a) * r * 0.75, py + Math.sin(a) * r * 0.75, r * 0.35, a + 1.2, a + 4.2); ctx.stroke(); } }
  if (u.charm){ ctx.font = `${Math.max(10, r * 0.7)}px sans-serif`; ctx.fillStyle = '#ff8fc8'; const q = (now * 1.2) % 1; ctx.fillText('♥', px - r * 0.5, py - r - 4 - q * 6); ctx.fillText('♥', px + r * 0.5, py - r - 8 + q * 4); }
  if (u.slow8 && now < u.slow8.until){ ctx.strokeStyle = 'rgba(120,190,255,.75)'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(px, py, r + 2, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }
  if (now < (u.descSlowT || -9)){ ctx.strokeStyle = 'rgba(90,150,255,.8)'; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r + 3, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }
  if (now < (u.descT || -9)){ ctx.fillStyle = 'rgba(90,170,255,.16)'; ctx.beginPath(); ctx.arc(px, py, r + 4, 0, 6.283); ctx.fill(); }
  if (now < (u.dreamT || -9)){ ctx.font = `600 ${Math.max(9, r * 0.55)}px sans-serif`; ctx.fillStyle = 'rgba(210,190,255,.9)'; ctx.fillText('z', px - r * 0.9, py - r * 0.9); }
  if (now < (u.veilT || -9)){ ctx.strokeStyle = 'rgba(170,120,220,.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, py, r + 5, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  if (now < (u.blessT || -9)){ ctx.fillStyle = 'rgba(255,235,160,.85)'; for (let k = 0; k < 3; k++){ const a = now * 1.6 + k * 2.094; ctx.beginPath(); ctx.arc(px + Math.cos(a) * (r + 5), py + Math.sin(a) * (r + 5), 1.8, 0, 6.283); ctx.fill(); } }
  if (now < (u.fairyGT || -9)){ ctx.strokeStyle = 'rgba(255,240,200,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, r + 6, -2.4, -0.7); ctx.stroke(); }
  if (u.hotB8 && now < u.hotB8.until){ ctx.font = `700 ${Math.max(9, r * 0.55)}px sans-serif`; ctx.fillStyle = 'rgba(120,230,150,.9)'; ctx.fillText('+', px + r * 0.9, py + r * 0.2 - ((now * 1.5) % 1) * r * 0.6); }
  if (now < (u.blindT8 || -9)){ ctx.font = `${Math.max(10, r * 0.7)}px sans-serif`; ctx.fillStyle = '#fff6c8'; ctx.fillText('✷', px, py - r * 0.2); }
  if (u.spiritOf != null){ const t = u.spiritFol != null ? Wd.units[u.spiritFol] : null, left = Math.max(0, (u.spiritUntil || now) - now), T0 = SPR(Wd, 'mspirit').t || 20;
    ctx.fillStyle = 'rgba(120,220,140,.22)'; ctx.beginPath(); ctx.arc(px, py, r + 3, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(140,240,160,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, r + 3, -Math.PI / 2, -Math.PI / 2 + 6.283 * (left / T0)); ctx.stroke();
    if (t && t.alive){ ctx.strokeStyle = 'rgba(140,240,160,.35)'; ctx.lineWidth = 1; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ox8 + t.x * ts8, oy8 + t.y * ts8); ctx.stroke(); ctx.setLineDash([]); }
    ctx.font = `${Math.max(9, r * 0.9)}px sans-serif`; ctx.fillStyle = '#c8ffd0'; ctx.fillText('🌿', px, py - r - 7); }
  ctx.restore();
}
let ox8 = 0, oy8 = 0, ts8 = 1;   // supMarks 의 판 자리 (땅의 정령 → 따르는 동료 선)
// v8.7.4 3D 보스 기술표 예고:""")
rep("/* v8.7.8 벼락 — 연기를 토함 */\n",
    "/* v8.7.8 벼락 — 연기를 토함 */\n"
    "  if (!ed && Wd.sup8){ ox8 = ox; oy8 = oy; ts8 = ts; for (const u of Wd.units){ if (!u.alive || hid0(u) || !(u.side === 0 || see || u.seenBy)) continue; supMarks(Wd, u, ox + u.x * ts, oy + u.y * ts, u.r * ts, Wd.t); } }   /* v8.7.8 물레 · 콜라이더 · 테헤라 — 걸린 것 · 날개 · 땅의 정령 */\n")
rep("    } else if (f.k === 'prRing' && age < 0.6){",
    "    } else if (f.k === 'cwhip' && age < 0.35){   // v8.7.8 콜라이더 갈퀴 꼬리 — 부채꼴 두 번 (둘째는 검은 파편)\n"
    "      const a = Wd.units[f.a]; if (!a || a.side === 0 || $('seeAll').checked || a.seenBy){ const q = age / 0.35, p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.strokeStyle = f.n === 2 ? `rgba(40,25,60,${(0.9 * (1 - q)).toFixed(2)})` : `rgba(235,230,245,${(0.85 * (1 - q)).toFixed(2)})`; ctx.lineWidth = f.n === 2 ? 5 : 3; ctx.beginPath(); ctx.arc(p.x, p.y, f.r * ts * (0.7 + 0.3 * q), f.ang - f.arc / 2, f.ang + f.arc / 2); ctx.stroke();\n"
    "        if (f.n === 2){ ctx.fillStyle = `rgba(30,20,45,${(0.85 * (1 - q)).toFixed(2)})`; for (let k = 0; k < 6; k++){ const aa = f.ang - f.arc / 2 + f.arc * (k + 0.5) / 6, rr = f.r * ts * (0.5 + 0.5 * q); ctx.beginPath(); ctx.arc(p.x + Math.cos(aa) * rr, p.y + Math.sin(aa) * rr, 2.5, 0, 6.283); ctx.fill(); } } }\n"
    "    } else if (f.k === 'tsweep' && age < 0.5){   // v8.7.8 테헤라 광역 손짓 — 부채꼴로 쓸리는 바람 (보이는 테헤라만)\n"
    "      const a = Wd.units[f.a]; if (!a || a.side === 0 || $('seeAll').checked || a.seenBy){ const q = age / 0.5, p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.fillStyle = `rgba(230,240,255,${(0.28 * (1 - q)).toFixed(2)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, f.r * ts * (0.3 + 0.7 * q), f.ang - f.arc / 2, f.ang + f.arc / 2); ctx.closePath(); ctx.fill();\n"
    "        ctx.strokeStyle = `rgba(255,250,235,${(0.7 * (1 - q)).toFixed(2)})`; ctx.lineWidth = 2; for (let k = 0; k < 5; k++){ const aa = f.ang - f.arc / 2 + f.arc * (k + 0.5) / 5, r0 = f.r * ts * q * 0.6, r1 = f.r * ts * (0.3 + 0.7 * q); ctx.beginPath(); ctx.moveTo(p.x + Math.cos(aa) * r0, p.y + Math.sin(aa) * r0); ctx.lineTo(p.x + Math.cos(aa) * r1, p.y + Math.sin(aa) * r1); ctx.stroke(); } }\n"
    "    } else if (f.k === 'dust8' && age < 0.7){   // v8.7.8 날개 방패 끝 — 빛가루 (둘레 3칸)\n"
    "      const q = age / 0.7, p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.fillStyle = `rgba(255,245,200,${(0.85 * (1 - q)).toFixed(2)})`; for (let k = 0; k < 14; k++){ const aa = k * 0.449 + f.t0 * 3, rr = f.r * ts * (0.25 + 0.75 * q) * (0.6 + 0.4 * ((k * 37) % 10) / 10); ctx.beginPath(); ctx.arc(p.x + Math.cos(aa) * rr, p.y + Math.sin(aa) * rr, 2.2, 0, 6.283); ctx.fill(); }\n"
    "    } else if (f.k === 'prRing' && age < 0.6){")
# 탄: 물 정령 탄 (푸른 물방울) · 별빛 탄 (금빛 별) — 그 밖은 그대로
rep("    ctx.strokeStyle = sh.jav ? '#e8d8b0' : sh.side ? 'rgba(255,150,110,.9)' : 'rgba(160,215,255,.9)'; ctx.lineWidth = sh.jav ? 3.5 : 2.5; ctx.lineCap = 'round';",
    "    ctx.strokeStyle = sh.jav ? '#e8d8b0' : sh.star ? 'rgba(255,215,90,.95)' : sh.sup ? 'rgba(110,200,255,.95)' : sh.side ? 'rgba(255,150,110,.9)' : 'rgba(160,215,255,.9)'; ctx.lineWidth = sh.jav ? 3.5 : 2.5; ctx.lineCap = 'round';   /* v8.7.8 별빛 탄 · 물 정령 탄 */")
rep("    ctx.fillStyle = '#fff4d6'; ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, 6.283); ctx.fill();\n  }",
    "    ctx.fillStyle = sh.star ? '#ffe680' : sh.sup ? '#cdeeff' : '#fff4d6'; ctx.beginPath(); ctx.arc(hx, hy, sh.star || sh.sup ? 3.4 : 2.5, 0, 6.283); ctx.fill();\n  }")

# ---------- 상세: 서포터 줄 (기술 · 패시브 · 장판) · 걸린 것 (누구든) ----------
rep("    ${!ed && known && u.alive && specOf(u, 'asup') ? `<span class=\"tr\"><span class=\"lb\">초돌진</span> ${esc(apRow(Wd, u))}</span>` : ''}",
    "    ${!ed && known && u.alive && specOf(u, 'asup') ? `<span class=\"tr\"><span class=\"lb\">초돌진</span> ${esc(apRow(Wd, u))}</span>` : ''}\n"
    "    ${(() => { const s0 = !ed && known && u.alive && Wd.sup8 ? supRow(Wd, u) : ''; return s0 ? `<span class=\"tr\" style=\"color:#bfe3ff\"><span class=\"lb\">${u.spiritOf != null ? '땅의 정령' : u.mulKit || u.colKit || u.fairyW || u.tBless ? '서포터' : '걸린 것'}</span> ${esc(s0)}</span>` : ''; })()}")
rep("function apRow(Wd, u){", r"""// v8.7.8 물레 · 콜라이더 · 테헤라 상세 줄 (그 몸의 기술 · 패시브 · 편 장판) · 누구든 걸린 것
function supRow(Wd, u){ const S8 = Wd.rules.sup8 || {}, o = [], now = Wd.t, nm = i => (Wd.units[i] || {}).name || '?';
  if (u.spiritOf != null) o.push(`${nm(u.spiritOf)}의 땅의 정령 — ${Math.ceil(Math.max(0, (u.spiritUntil || now) - now))}초 남음 · ${u.spiritFol != null ? nm(u.spiritFol) + ' 곁' : '따를 동료를 찾음'} · 3초마다 회복탄 ${Math.round((SPR(Wd, 'mspirit').pct || 0.05) * 100)}% (${SPR(Wd, 'mspirit').rng || 6}칸) · 고를 수 없음`);
  if (u.mulKit){ const P = S8.pact || {}; o.push(`◆정령 계약 — 편 모두 최대 체력 +${Math.round((P.hp || 0.08) * 100)}%${u.pactUp ? ' (나 +' + u.pactUp + ')' : ''} · 곁 ${P.r || 5}칸 초당 ${((P.regen || 0.006) * 100).toFixed(1)}% · 쓰러진 [불사] 동료가 ${P.revive || 2}배 빨리 일어남`); }
  if (u.colKit) o.push(`◆마계 대사 — 같은 편 마법 피해 × ${(S8.envoy || {}).magic || 1.1} · 꼬리 그림자 ${u.tailUsed ? '씀 (이 판)' : '남음 (숨이 끊길 일격을 한 번 대신 막음)'}`);
  if (u.tBless){ const B = S8.bless || {}; o.push(`[축복:테헤라] 곁 ${B.r || 5}칸 동료 재생 (초당 ${B.regen || 1.5}) · 받는 피해 × ${B.dmg || 0.9}`); }
  if (u.fairyW) o.push(`◆요정 날개 — 늘 떠 있음 (장판 · 얕은 물을 밟지 않음) · 원거리 ${Math.round(((S8.wings || {}).evade || 0.15) * 100)}% 흘림`);
  if (u.skill && (u.skill.hotB || u.skill.aoe)) o.push(`${u.skill.name} — ${u.skill.aoe ? '곁 ' + u.skill.aoe + '칸 동료 모두' : u.skill.rng + '칸 안 하나'} ${Math.round(u.skill.pct * 100)}%${u.skill.hotB ? ' + 이어서 ' + (u.skill.hotT || 4) + '초 초당 ' + Math.round(u.skill.hotB * 100) + '%' : ''}${u.skill.gK ? ' + ' + (u.skill.gT || 4) + '초 받는 피해 × ' + u.skill.gK : ''} (마력 · 대기 ${u.skill.cd}초${u.skill.cdT > now && u.skill.cdT - now < 600 ? ' — ' + (u.skill.cdT - now).toFixed(1) + '초 남음' : ''})`);
  for (const F of Wd.sf8 || []) if (F.by === u.i && now < F.until) o.push(`${SF_NM[F.k] || F.k} ${Math.ceil(F.until - now)}초 남음${F.k === 'gate' ? (F.tpd ? ' (동료를 옮김)' : ' — 다시 쓰면 동료를 문 앞으로') : ''}`);
  if (u.star8 && now < u.star8.until) o.push(`⭐ 별 표식 — 받는 피해 × ${u.star8.k} (${Math.ceil(u.star8.until - now)}초)`);
  if (now < (u.vineT || -9)) o.push('🌿 덩굴에 묶임');
  if (u.charm) o.push(`💗 매혹 — ${nm(u.charm.by)}에게 이끌림 (${Math.max(0, u.charm.until - now).toFixed(1)}초)`);
  if (u.slow8 && now < u.slow8.until) o.push(`느려짐 (걸음 × ${(1 - u.slow8.k).toFixed(2)})`);
  if (now < (u.descT || -9)) o.push(`💧 정령 강림 안 — 걸음 × ${SPR(Wd, 'mdesc').fast || 1.15} · 초당 ${Math.round((SPR(Wd, 'mdesc').heal || 0.03) * 100)}%`);
  if (now < (u.descSlowT || -9)) o.push(`💧 정령 강림 (상대의) — 걸음 × ${SPR(Wd, 'mdesc').slow || 0.7}`);
  if (now < (u.dreamT || -9)) o.push(`💤 나른한 꿈 — 공격 속도 × ${SPR(Wd, 'tdream').atk || 0.6}`);
  if (now < (u.veilT || -9)) o.push(`🦇 장막 안 — 원거리 피해 × ${SPR(Wd, 'cveil').far || 0.5}`);
  if (now < (u.blessT || -9) && !u.tBless) o.push(`테헤라의 축복 — 재생 · 받는 피해 × ${(S8.bless || {}).dmg || 0.9}`);
  if (now < (u.fairyGT || -9)) o.push(`✨ 요정의 축복 — 받는 피해 × ${u.fairyGK || 0.85} (${Math.ceil(u.fairyGT - now)}초)`);
  if (u.hotB8 && now < u.hotB8.until) o.push(`정령의 손길 — 초당 ${Math.round(u.hotB8.k * 100)}% (${Math.ceil(u.hotB8.until - now)}초)`);
  if (now < (u.blindT8 || -9)) o.push('✷ 빛가루에 눈멂');
  if (u.act && u.act.k === 'twing') o.push(`🛡 날개 방패 — 받는 피해 × ${SPR(Wd, 'twing').k || 0.2}`);
  if (u.act && u.act.k === 'tdream') o.push('💤 앉아 졸음 (움직이지 못함)');
  return o.join(' · '); }
function apRow(Wd, u){""")
# 동료 줄: 물레 곁에 땅의 정령 (🌿 남은 초)
rep("${esc(u.name)}${ratBadge(Wd, u)}", "${esc(u.name)}${ratBadge(Wd, u)}${spBadge(Wd, u)}")
rep("const RAT_PLAIN = ['ratS', 'ratM', 'ratL'];   /* v8.7.8 이름 없는 쥐 */\n",
    "const RAT_PLAIN = ['ratS', 'ratM', 'ratL'];   /* v8.7.8 이름 없는 쥐 */\n"
    "function spBadge(Wd, u){ if (!u.mulKit || mode === 'edit' || !u.alive) return ''; const s0 = Wd.units.find(x => x.alive && !x.gone && x.spiritOf === u.i); return s0 ? ` <i class=\"stb\" title=\"물레의 땅의 정령 — 다친 동료를 따라 회복탄\">🌿${Math.ceil(Math.max(0, (s0.spiritUntil || Wd.t) - Wd.t))}초</i>` : ''; }   /* v8.7.8 */\n")

# ---------- 땅의 정령은 고를 수 없음 (쥐와 같은 자리 모두) ----------
rep("    if (!ed && u.side === 0 && u.ratOf == null) badge(px - r - 3, py - r * 0.15, allyNo(Wd, u), 1);", "    if (!ed && u.side === 0 && !noPick(u)) badge(px - r - 3, py - r * 0.15, allyNo(Wd, u), 1);")
rep("    if (u.nv && (ed || u.side === 0) && u.ratOf == null){", "    if (u.nv && (ed || u.side === 0) && !noPick(u)){")
rep("const selUnits = Wd => Wd ? [...sel].map(i => Wd.units[i]).filter(u => u && u.alive && u.side === 0 && u.ratOf == null) : [];   /* v8.7.8 쥐는 빠짐 */",
    "const selUnits = Wd => Wd ? [...sel].map(i => Wd.units[i]).filter(u => u && u.alive && u.side === 0 && !noPick(u)) : [];   /* v8.7.8 쥐 · 땅의 정령은 빠짐 */")
rep("const allyNo = (Wd, u) => Wd.units.filter(a => a.side === 0 && a.ratOf == null).indexOf(u) + 1;", "const allyNo = (Wd, u) => Wd.units.filter(a => a.side === 0 && !noPick(a)).indexOf(u) + 1;")
rep("function pickAlly(i, add){ { const U0 = world && world.units[i]; if (U0 && U0.ratOf != null){ toast(RAT_TOAST); return; } }",
    "function pickAlly(i, add){ { const U0 = world && world.units[i]; if (noPick(U0)){ toast(U0.spiritOf != null ? SPIRIT_TOAST : RAT_TOAST); return; } }")
rep("  $('party').innerHTML = Wd.units.filter(u => u.side === 0 && u.ratOf == null).map(u => {", "  $('party').innerHTML = Wd.units.filter(u => u.side === 0 && !noPick(u)).map(u => {")
rep("  const foes = Wd.units.filter(u => u.side !== 0 && u.ratOf == null), vis =", "  const foes = Wd.units.filter(u => u.side !== 0 && !noPick(u)), vis =")
rep("  if (k === 'all'){ sel = new Set(world.units.filter(u => u.side === 0 && u.alive && u.ratOf == null).map(u => u.i)); hud(); return; }",
    "  if (k === 'all'){ sel = new Set(world.units.filter(u => u.side === 0 && u.alive && !noPick(u)).map(u => u.i)); hud(); return; }")
rep("  const C = Wd.units.filter(u => u.side === 0 && u.alive && !u.gone && u.ratOf == null && canTake(", "  const C = Wd.units.filter(u => u.side === 0 && u.alive && !u.gone && !noPick(u) && canTake(")
rep("  if (u && u.side === 0 && u.ratOf != null && !selUnits(world).length){ toast(RAT_TOAST); return; }   /* v8.7.8 쥐는 고를 수 없음 — 고른 이가 있으면 그 자리 바닥으로 */",
    "  if (u && u.side === 0 && noPick(u) && !selUnits(world).length){ toast(u.spiritOf != null ? SPIRIT_TOAST : RAT_TOAST); return; }   /* v8.7.8 쥐 · 땅의 정령은 고를 수 없음 — 고른 이가 있으면 그 자리 바닥으로 */")
rep("  if (u && u.side === 0 && u.ratOf == null){ if (sel.size === 1 && sel.has(u.i)){ clearSel(); return; }", "  if (u && u.side === 0 && !noPick(u)){ if (sel.size === 1 && sel.has(u.i)){ clearSel(); return; }")
rep("  if (k === 'all'){ if (!world) return; const A = world.units.filter(u => u.side === 0 && u.alive && u.ratOf == null);", "  if (k === 'all'){ if (!world) return; const A = world.units.filter(u => u.side === 0 && u.alive && !noPick(u));")
rep("Wd.units.filter(u => u.side === 0 && u.ratOf == null && !(u.summon && (u.gone || u.summon === 'slime'))) : [];", "Wd.units.filter(u => u.side === 0 && !noPick(u) && !(u.summon && (u.gone || u.summon === 'slime'))) : [];")
rep("const al = world.units.filter(u => u.side === 0 && u.ratOf == null);", "const al = world.units.filter(u => u.side === 0 && !noPick(u));")
rep("sel = new Set(world.units.filter(u => u.side === 0 && u.alive && u.ratOf == null).map(u => u.i)); hud(); }", "sel = new Set(world.units.filter(u => u.side === 0 && u.alive && !noPick(u)).map(u => u.i)); hud(); }")
rep("    const inBox = world.units.filter(u => u.alive && u.side === 0 && u.ratOf == null &&", "    const inBox = world.units.filter(u => u.alive && u.side === 0 && !noPick(u) &&")
rep("  if (u && u.side === 0 && u.ratOf != null && !selUnits(world).length){ toast(RAT_TOAST); return; }   /* v8.7.8 */",
    "  if (u && u.side === 0 && noPick(u) && !selUnits(world).length){ toast(u.spiritOf != null ? SPIRIT_TOAST : RAT_TOAST); return; }   /* v8.7.8 */")
rep("  if (u && u.side === 0 && u.ratOf == null){ pickAlly(u.i, add); hud(); return; }", "  if (u && u.side === 0 && !noPick(u)){ pickAlly(u.i, add); hud(); return; }")

# ---------- 적의 종족 (도감 · 설명 그대로): 마족 · 정령 · 요정 — 유혹의 손짓 (마계 3초) · 인사 ----------
rep("FOE8['로지나 (손님)'] = ", r"""/* v8.7.8 적의 종족 — 엔진 isDemon (유혹의 손짓: 마계 적 3초) · 인사 (bow): 도감 설명이 마족 · 악마 · 마계 · 정령 · 요정인 적 */
{ const RACE8 = { '대악마 하딤': ['마족 (대악마)', '네오마계'], '하류': ['마족', '마계'], '흑익': ['마족', '마계'], '붉은암석': ['마족 (바위 거인)', '마계'], '마신족 병사': ['마족 (마신족)', '마계'],
    '꼬마악마': ['악마', '마계'], '마족녀': ['마족', '마계'], '떠돌이 마족': ['마족', '마계'], '마족 전사': ['마족', '마계'], '반미': ['악마', '마계'], '노란악마': ['악마 (노란악마)', '마계'], '노란악마녀': ['악마 (노란악마)', '마계'],
    '톱날 대검 망토 기사': ['마족', '마계'], '검은 뿔 귀족': ['마족 (검은 뿔)', '마계'], '검은 장막 술사': ['마족 (검은 뿔)', '마계'], '이계악마 망향': ['악마 (이계)', '이계'], '거대 괴수': ['괴수', '마계'],
    '포자': ['정령 (저주)', '정령계'], '사슴': ['정령 (사슴)', '정령계'], '요정악마': ['요정 (악한)', '정령계'], '꼬마요정': ['요정', '정령계'], '요정': ['요정', '정령계'], '뿌리 광신도': ['정령 (뿌리)', '정령계'] };
  for (const [k, [race, origin]] of Object.entries(RACE8)) if (FOE8[k]){ if (!FOE8[k].race) FOE8[k].race = race; if (!FOE8[k].origin) FOE8[k].origin = origin; } }
FOE8['로지나 (손님)'] = """)

# ---------- 인사 (bow) 대화 선택지 — 3D 패시브 (콜라이더: 마족 적과의 첫 교전 전 · 물레: 정령 · 요정 쪽) ----------
rep("  r8Hide(); r8Battle(n);\n}", r"""  if (r8BowOffer(n)) return;   /* v8.7.8 인사 (bow) */
  r8Hide(); r8Battle(n);
}
// v8.7.8 인사 (bow): 보통 싸움 · 층마다 한 번 — 콜라이더 (마족만의 무리) · 물레 (정령 · 요정이 반 넘고 마족이 없는 무리). 받아들이면 길을 비켜 줌 (싸움 · 전리품 없음) / 거절하면 그대로 싸움 (같은 무리)
function r8BowOffer(n){
  const R = R8S(); if (!R || n.t !== 'fight' || n.empty || (R.flags || {})['bow' + R.f]) return false;
  const live = R.party.filter(p => !R.dead.includes(p.name) && !(p.hpNow != null && +p.hpNow <= 0)), keys = n.preKeys || (n.preKeys = r8Foes(n)), ds = keys.map(k => FOE8[k]).filter(Boolean); if (!ds.length || ds.length !== keys.length) return false;
  const dem = d => /마족|악마/.test(d.race || ''), spi = d => /정령|요정/.test(d.race || '') && !dem(d);   // 마계의 짐승 (거대 괴수) 은 인사를 받지 않음
  const col = live.find(p => p.ref === 'C-175'), mul = live.find(p => p.ref === 'C-174'), who = col && ds.every(dem) ? col : mul && !ds.some(dem) && ds.filter(spi).length * 2 > ds.length ? mul : null; if (!who) return false;
  save(); r8BowAsk = { who: who.name, col: who.ref === 'C-175' };
  talkLines(who.ref === 'C-175' ? [{ narr: '마족의 무리가 길을 막고 선다. 콜라이더가 앞으로 나서 코트 자락을 쥔다.' }, { t: '…마계 대사 콜라이더. 길을 비켜 주겠어요?', name: '콜라이더' }, { ask: [['🙇 콜라이더가 인사한다 — 길을 비켜 달라 (싸움 · 전리품 없음)', '!r8:bowYes'], ['⚔ 싸운다', '!r8:bowNo']] }]
    : [{ narr: '정령 · 요정의 무리가 빛 속에서 이쪽을 살핀다. 물레가 두 손을 모은다.' }, { t: '정령계의 앰버서더, 물레예요. 지나가게 해 줄래요?', name: '물레' }, { ask: [['🙇 물레가 인사한다 — 길을 비켜 달라 (싸움 · 전리품 없음)', '!r8:bowYes'], ['⚔ 싸운다', '!r8:bowNo']] }]);
  return true;
}
let r8BowAsk = null;""")
rep("  if (a === 'battle'){ const n = r8Node(R.at); r8Hide(); r8Battle(n); return; }",
    "  if (a === 'battle'){ const n = r8Node(R.at); r8Hide(); r8Battle(n); return; }\n"
    "  if (a === 'bowYes' || a === 'bowNo'){ const n = r8Node(R.at); R.flags['bow' + R.f] = 1; const B0 = r8BowAsk || {}; r8BowAsk = null; if (!n){ r8MapShow(); return; }   /* v8.7.8 인사 (bow) */\n"
    "    if (a === 'bowNo'){ r8Hide(); r8Battle(n); return; }\n"
    "    delete n.preKeys; (R.bowLog = R.bowLog || []).push({ f: R.f, who: B0.who || '' }); save();\n"
    "    say(B0.col ? [{ narr: '콜라이더가 고개를 숙인다. 마족들이 서로 눈짓을 주고받더니, 무기를 거두고 길을 비킨다.' }, { box: '🙇 마계 대사의 인사 — 싸움 없이 지나감 (전리품 없음)' }] : [{ narr: '물레가 고개를 숙이자, 빛이 잔잔해진다. 정령들이 길을 열어 준다.' }, { box: '🙇 정령계 앰버서더의 인사 — 싸움 없이 지나감 (전리품 없음)' }]); return; }")
rep("  const keys = n.t === 'boss' && n.b === 'gods' ? BOSS8.gods.waves[waveK || 0].length && Array.from({ length: BOSS8.gods.waves[waveK || 0][1] }, () => BOSS8.gods.waves[waveK || 0][0]) : r8Foes(n);",
    "  const keys = n.t === 'boss' && n.b === 'gods' ? BOSS8.gods.waves[waveK || 0].length && Array.from({ length: BOSS8.gods.waves[waveK || 0][1] }, () => BOSS8.gods.waves[waveK || 0][0]) : n.preKeys ? n.preKeys.splice(0) : r8Foes(n); delete n.preKeys;   /* v8.7.8 인사를 거절하면 같은 무리 */")

# ---------- v1.1 치료 방침의 기본 (엔진 healPolOf 와 같게 — 마력 치유는 '알아서') ----------
rep("(u.healPol || (Wd.rules.heal || {}).pol || 'dying')", "healPolOf(Wd, u)", 2)
rep("HEAL_NM[u.healPol || (Wd.rules.heal || {}).pol || 'dying']", "HEAL_NM[healPolOf(Wd, u)]")
rep("(u.healPol || (W.rules.heal || {}).pol || 'dying')", "healPolOf(W, u)")
rep("(L2[0].healPol || (world.rules.heal || {}).pol || 'dying')", "healPolOf(world, L2[0])")

open(F, 'w', encoding='utf-8').write(s)
print('page8780d OK')
