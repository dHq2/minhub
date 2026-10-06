/* h2_roster.js — 자동 생성 (tools/h2_roster.py). 손으로 고치지 말 것: art/h2/notes/*.json을 고치고 다시 돌림 */
'use strict';
const H2R = {
"ancientangel": {
"slug": "ancientangel",
"name": "고대천사",
"rank": "보스",
"folder": "보스,강자들",
"role": "보스",
"tall": 4.0,
"weight": 220,
"palette": [
"#503a3d",
"#77595c",
"#977578",
"#b08d8e",
"#c5a2a3"
],
"missing": [
"attack",
"special",
"fly",
"hurt",
"down",
"dead",
"walk"
],
"kit": {
"basic": "날개 깃털 쏘기 (그림 없음 — idle 로 대신) — 중거리 10m",
"skills": [
{
"name": "깃털 비",
"pose": "idle",
"desc": "날개를 펼쳐 깃털 칼날을 부채꼴로 쏨"
},
{
"name": "갈퀴 낚아채기",
"pose": "idle",
"desc": "날개 끝 갈퀴 손으로 앞 4m 적을 잡아 던짐"
},
{
"name": "고대의 날갯짓",
"pose": "idle",
"desc": "강한 바람으로 주변 적을 밀어냄"
}
],
"passive": "깃털 몸: 공중에 떠 있는 동안 근접 피해 25% 감소"
},
"apt": {
"melee": 3,
"spear": 0,
"bow": 3,
"gun": 0,
"magic": 5,
"stealth": 0
},
"tag": "mage",
"role_job": "지휘",
"bag": 8,
"stats": {
"hp": 4200,
"atk": 80,
"spd": 5,
"weight_kg": 220,
"tall_m": 4.0
},
"portrait": "art/h2/ancientangel/portrait.webp",
"face": "art/h2/ancientangel/face.webp",
"poses": {
"idle": {
"src": "art/h2/ancientangel/idle.webp",
"w": 1060,
"h": 701,
"ax": 488,
"ay": 698,
"orig": "서 있음 (날개 펼침)"
}
}
},
"bel": {
"slug": "bel",
"name": "인공천사 벨",
"rank": "1성",
"folder": "1성 인공천사 벨",
"role": "동료 (적으로도 가능)",
"tall": 1.62,
"weight": 52,
"palette": [
"#e9b85a",
"#f4f1ee",
"#b8323c",
"#8fc6d8",
"#f6d9c8"
],
"missing": [
"walk",
"hurt",
"dead (down 으로 대신 가능)",
"reload"
],
"kit": {
"basic": "쌍권총 연사 (shoot) — 원거리 10m",
"skills": [
{
"name": "천사의 탄막",
"pose": "jump",
"desc": "뛰어올라 공중에서 앞 부채꼴로 연사, 착지까지 무적 짧게"
},
{
"name": "낮은 사격",
"pose": "low",
"desc": "몸을 낮춰 다리 · 작은 적 노리기, 이 동안 받는 원거리 피해 감소"
},
{
"name": "엄호 자세",
"pose": "crouch",
"desc": "앉아서 앞뒤 두 방향 사격 (뒤에서 오는 적 견제)"
}
],
"passive": "인공 후광: 아군 근처에 있으면 명중 +10%, 쓰러지면 (down) 한 번 버팀"
},
"apt": {
"melee": 1,
"spear": 0,
"bow": 1,
"gun": 5,
"magic": 2,
"stealth": 1
},
"tag": "soldier",
"role_job": "사수",
"bag": 10,
"stats": {
"hp": 520,
"atk": 34,
"spd": 6.5,
"weight_kg": 52,
"tall_m": 1.62
},
"portrait": "art/h2/bel/portrait.webp",
"face": "art/h2/bel/face.webp",
"poses": {
"idle": {
"src": "art/h2/bel/idle.webp",
"w": 454,
"h": 703,
"ax": 269,
"ay": 700,
"orig": "쌍권총 들고 서 있음"
},
"shoot": {
"src": "art/h2/bel/shoot.webp",
"w": 599,
"h": 624,
"ax": 318,
"ay": 621,
"orig": "두 팔 뻗어 쌍권총 사격 (총구 불꽃)"
},
"crouch": {
"src": "art/h2/bel/crouch.webp",
"w": 569,
"h": 550,
"ax": 358,
"ay": 547,
"orig": "쪼그려 앉아 한 총은 뒤, 한 총은 위로"
},
"down": {
"src": "art/h2/bel/down.webp",
"w": 639,
"h": 429,
"ax": 337,
"ay": 426,
"orig": "바닥에 주저앉아 총 겨눔 (넘어짐)"
},
"low": {
"src": "art/h2/bel/low.webp",
"w": 564,
"h": 538,
"ax": 204,
"ay": 535,
"orig": "무릎 꿇듯 낮게 앉아 아래로 사격 (탄피 · 불꽃)"
},
"jump": {
"src": "art/h2/bel/jump.webp",
"w": 623,
"h": 610,
"ax": 330,
"ay": 607,
"orig": "공중에서 쌍권총 사격"
}
}
},
"bishot": {
"slug": "bishot",
"name": "비숏",
"rank": "2성",
"folder": "2성 비숏",
"role": "둘 다 (초인계 마수 — 적 강자 또는 동료)",
"tall": 1.75,
"weight": 72,
"palette": [
"#b0262c",
"#c9a4d0",
"#9a98e0",
"#1c1a1a",
"#ff8a1e"
],
"missing": [
"walk",
"hurt",
"rest · down 따로 (지금은 dead 겸용)",
"jump 따로 (지금은 special 겸용)"
],
"kit": {
"basic": "라이트 (windup→attack) — 불꽃 주먹, 근접 1.5m",
"skills": [
{
"name": "점핑파이어",
"pose": "special",
"desc": "무릎 차올리며 불꽃 고리 — 주변 2m 불 피해 + 화상"
},
{
"name": "내려찍기",
"pose": "finisher",
"desc": "땅 내려쳐 앞 3m 불기둥 · 돌 파편"
},
{
"name": "확인사살",
"pose": "finisher",
"desc": "넘어진 적에게 2배 피해"
}
],
"passive": "초인계 마수: 불 피해 면역, 주먹마다 화상 1스택"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 1
},
"tag": "brawler",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 340,
"atk": 28,
"spd": 7,
"weight_kg": 72,
"tall_m": 1.75
},
"portrait": "art/h2/bishot/portrait.webp",
"face": "art/h2/bishot/face.webp",
"poses": {
"idle": {
"src": "art/h2/bishot/idle.webp",
"w": 590,
"h": 702,
"ax": 294,
"ay": 699,
"orig": "기본 (권투 자세, 왼 주먹 불꽃)"
},
"dead": {
"src": "art/h2/bishot/dead.webp",
"w": 840,
"h": 336,
"ax": 420,
"ay": 333,
"orig": "죽음 (옆으로 누움, 눈 감음 — 쉼 · 넘어짐 겸용)"
},
"windup": {
"src": "art/h2/bishot/windup.webp",
"w": 657,
"h": 681,
"ax": 328,
"ay": 678,
"orig": "공격준비 (두 주먹 들고 오른 주먹 불꽃)"
},
"attack": {
"src": "art/h2/bishot/attack.webp",
"w": 755,
"h": 697,
"ax": 381,
"ay": 694,
"orig": "라이트 (불꽃 오른 주먹 곧게)"
},
"finisher": {
"src": "art/h2/bishot/finisher.webp",
"w": 874,
"h": 561,
"ax": 439,
"ay": 558,
"orig": "확인사살 · 내려찍기 (불꽃 주먹으로 땅 내려치기, 폭발 · 돌)"
},
"special": {
"src": "art/h2/bishot/special.webp",
"w": 549,
"h": 722,
"ax": 176,
"ay": 719,
"orig": "특수기 · 점핑파이어 (무릎 들고 두 손 불꽃 고리)"
},
"rest": {
"src": "art/h2/bishot/dead.webp",
"w": 840,
"h": 336,
"ax": 420,
"ay": 333,
"orig": "쉼 — 따로 그림 없음, 죽음 그림 겸용"
},
"down": {
"src": "art/h2/bishot/dead.webp",
"w": 840,
"h": 336,
"ax": 420,
"ay": 333,
"orig": "넘어짐 — 따로 그림 없음, 죽음 그림 겸용"
},
"jump": {
"src": "art/h2/bishot/special.webp",
"w": 549,
"h": 722,
"ax": 176,
"ay": 719,
"orig": "점핑파이어 — 특수기 그림 겸용"
},
"slam": {
"src": "art/h2/bishot/finisher.webp",
"w": 874,
"h": 561,
"ax": 439,
"ay": 558,
"orig": "내려찍기 — 확인사살 그림 겸용"
}
}
},
"changra": {
"slug": "changra",
"name": "창라 (그림 파일에는 '차리')",
"rank": "3성",
"folder": "3성 창라",
"role": "둘 다 (거구 맨주먹 동료 · 적이면 중간 보스)",
"tall": 2.4,
"weight": 220,
"palette": [
"#444953",
"#191a1d",
"#8a8c8e",
"#e8de8a",
"#3ee8b0"
],
"missing": [
"walk",
"hurt",
"jump"
],
"kit": {
"basic": "바위 주먹 (attack) — 앞 2m, 강한 넉백",
"skills": [
{
"name": "대지 찍기",
"pose": "attack2",
"desc": "주먹으로 땅을 찍어 반경 3m 넘어뜨림 + 파편 피해"
},
{
"name": "돌격",
"pose": "dash",
"desc": "8m 일직선 돌진, 부딪힌 적 밀어내며 기절 1초"
},
{
"name": "바위 막기",
"pose": "guard",
"desc": "3초간 정면 피해 60% 감소, 끝날 때 주변 반격"
}
],
"passive": "거구: 넉백 · 경직 면역, 들고 다닐 수 있는 무게 2배"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "brawler",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 2000,
"atk": 70,
"spd": 4,
"weight_kg": 220,
"tall_m": 2.4
},
"portrait": "art/h2/changra/portrait.webp",
"face": "art/h2/changra/face.webp",
"poses": {
"idle": {
"src": "art/h2/changra/idle.webp",
"w": 599,
"h": 700,
"ax": 289,
"ay": 697,
"orig": "차리 기본"
},
"attack": {
"src": "art/h2/changra/attack.webp",
"w": 777,
"h": 642,
"ax": 398,
"ay": 639,
"orig": "차리 공격"
},
"guard": {
"src": "art/h2/changra/guard.webp",
"w": 615,
"h": 666,
"ax": 286,
"ay": 663,
"orig": "막기 (옆얼굴)"
},
"dead": {
"src": "art/h2/changra/dead.webp",
"w": 809,
"h": 331,
"ax": 436,
"ay": 328,
"orig": "넘어짐 (눈 감음)"
},
"guardfront": {
"src": "art/h2/changra/guardfront.webp",
"w": 614,
"h": 663,
"ax": 286,
"ay": 660,
"orig": "차리막기 (정면 얼굴)"
},
"down": {
"src": "art/h2/changra/down.webp",
"w": 809,
"h": 331,
"ax": 436,
"ay": 328,
"orig": "차리 넘어짐"
},
"attack2": {
"src": "art/h2/changra/attack2.webp",
"w": 648,
"h": 480,
"ax": 386,
"ay": 477,
"orig": "차리찍기"
},
"dash": {
"src": "art/h2/changra/dash.webp",
"w": 697,
"h": 498,
"ax": 194,
"ay": 495,
"orig": "차리 돌격"
}
}
},
"cheonmyeong": {
"slug": "cheonmyeong",
"name": "천명",
"rank": "보스",
"folder": "보스,강자들",
"role": "보스",
"tall": 2.4,
"weight": 300,
"palette": [
"#463126",
"#7b5b3e",
"#ac8357",
"#cca26c",
"#e2bb84"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"windup"
],
"kit": {
"basic": "대검 베기 (attack) — 근접 3m",
"skills": [
{
"name": "하늘의 명령 (투구창)",
"pose": "special",
"desc": "십자 가면 투구가 금빛 창살 창으로 7m 앞까지 뻗어 꿰뚫음, 관통"
},
{
"name": "붙잡기",
"pose": "special",
"desc": "뻗은 왼손으로 앞 적을 끌어당김 (special 그림 같이 씀)"
},
{
"name": "낮은 베기",
"pose": "attack",
"desc": "자세를 낮춰 다리를 베어 둔화"
}
],
"passive": "붕대 갑옷: 받는 근접 피해 20% 감소, 불에 약함"
},
"apt": {
"melee": 5,
"spear": 4,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 0
},
"tag": "knight",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 3600,
"atk": 80,
"spd": 4,
"weight_kg": 300,
"tall_m": 2.4
},
"portrait": "art/h2/cheonmyeong/portrait.webp",
"face": "art/h2/cheonmyeong/face.webp",
"poses": {
"idle": {
"src": "art/h2/cheonmyeong/idle.webp",
"w": 654,
"h": 702,
"ax": 329,
"ay": 699,
"orig": "서 있음 (옆, 대검 끌기)"
},
"idle2": {
"src": "art/h2/cheonmyeong/idle2.webp",
"w": 548,
"h": 699,
"ax": 263,
"ay": 696,
"orig": "서 있음 (정면, 대검 아래로)"
},
"attack": {
"src": "art/h2/cheonmyeong/attack.webp",
"w": 832,
"h": 650,
"ax": 315,
"ay": 647,
"orig": "낮은 자세 대검 베기"
},
"special": {
"src": "art/h2/cheonmyeong/special.webp",
"w": 906,
"h": 598,
"ax": 440,
"ay": 595,
"orig": "투구 가면이 긴 창살 창으로 뻗어나감 + 손 뻗기"
}
}
},
"dolsoe": {
"slug": "dolsoe",
"name": "돌쇠",
"rank": "2성",
"folder": "2성 돌쇠, 마당쇠",
"role": "둘 다 (마당쇠와 짝 — 동료 또는 조직 적)",
"tall": 1.75,
"weight": 62,
"palette": [
"#222121",
"#d4d0cc",
"#e8e8e8",
"#6b6b6b",
"#191818"
],
"missing": [
"walk",
"hurt",
"guard",
"dead (down 으로 대신)"
],
"kit": {
"basic": "쇠지렛대 내려찍기 (windup→attack) — 근접 1.5m",
"skills": [
{
"name": "갈고리 걸기",
"pose": "low",
"desc": "발목 걸어 끌어당기고 넘어뜨림"
},
{
"name": "비틀어 치기",
"pose": "attack2",
"desc": "뒤로 크게 휘둘러 옆 2명까지 맞힘"
},
{
"name": "문 따기",
"pose": "low",
"desc": "(탐험) 잠긴 문 · 상자 열기"
}
],
"passive": "복면: 은신 중 첫 공격 피해 +40%, 마당쇠와 같이 있으면 속도 +10%"
},
"apt": {
"melee": 4,
"spear": 1,
"bow": 0,
"gun": 1,
"magic": 0,
"stealth": 4
},
"tag": "soldier",
"role_job": "척후",
"bag": 10,
"stats": {
"hp": 270,
"atk": 24,
"spd": 7,
"weight_kg": 62,
"tall_m": 1.75
},
"portrait": "art/h2/dolsoe/portrait.webp",
"face": "art/h2/dolsoe/face.webp",
"poses": {
"idle": {
"src": "art/h2/dolsoe/idle.webp",
"w": 335,
"h": 698,
"ax": 185,
"ay": 695,
"orig": "서 있음 (오른손 쇠지렛대 아래로)"
},
"attack": {
"src": "art/h2/dolsoe/attack.webp",
"w": 701,
"h": 513,
"ax": 350,
"ay": 510,
"orig": "쇠지렛대로 땅 내려찍기 (파편 · 그림자 포함)"
},
"windup": {
"src": "art/h2/dolsoe/windup.webp",
"w": 488,
"h": 597,
"ax": 243,
"ay": 594,
"orig": "두 손 쇠지렛대 머리 위로 치켜듦"
},
"down": {
"src": "art/h2/dolsoe/down.webp",
"w": 732,
"h": 211,
"ax": 366,
"ay": 208,
"orig": "엎드려 쓰러짐 (머리 오른쪽, 쇠지렛대 쥔 채)"
},
"low": {
"src": "art/h2/dolsoe/low.webp",
"w": 532,
"h": 531,
"ax": 277,
"ay": 528,
"orig": "웅크려 쇠지렛대 갈고리로 바닥 긁기 (하단 공격, 파편)"
},
"attack2": {
"src": "art/h2/dolsoe/attack2.webp",
"w": 487,
"h": 721,
"ax": 241,
"ay": 718,
"orig": "몸 비틀어 쇠지렛대 뒤로 휘두르기"
},
"dead": {
"src": "art/h2/dolsoe/down.webp",
"w": 732,
"h": 211,
"ax": 366,
"ay": 208,
"orig": "죽음 그림 없음 — down 으로 대신"
}
}
},
"gallia": {
"slug": "gallia",
"name": "갈리아",
"rank": "3성 장군",
"folder": "3성 장군 갈리아",
"role": "둘 다 (동료 장군 · 적 쪽이면 중간 보스). 중장 대검 기사",
"tall": 1.8,
"weight": 140,
"palette": [
"#4a4456",
"#261b29",
"#6e1f33",
"#2a2238",
"#a3a0a9"
],
"missing": [
"walk",
"hurt",
"dead"
],
"kit": {
"basic": "대검 휘두르기 (attack) — 앞 3m 반원",
"skills": [
{
"name": "대지 가르기",
"pose": "attack3",
"desc": "대검을 내려찍어 앞 5m 일직선 충격파, 넘어뜨림"
},
{
"name": "도약 강타",
"pose": "jump",
"desc": "6m 안 지점으로 뛰어 내려베기, 착지 반경 2.5m"
},
{
"name": "장군의 찌르기",
"pose": "attack2",
"desc": "windup 으로 모은 뒤 4m 관통 찌르기, 방어 무시 30%"
},
{
"name": "철벽",
"pose": "guard",
"desc": "대검을 세워 정면 피해 70% 감소, 넉백 면역"
}
],
"passive": "장군의 위엄: 곁 (5m) 아군 방어 +10%, 자신은 넉백 면역"
},
"apt": {
"melee": 5,
"spear": 3,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "knight",
"role_job": "지휘",
"bag": 12,
"stats": {
"hp": 1400,
"atk": 65,
"spd": 4,
"weight_kg": 140,
"tall_m": 1.8
},
"portrait": "art/h2/gallia/portrait2.webp",
"face": "art/h2/gallia/face2.webp",
"poses": {
"idle": {
"src": "art/h2/gallia/idle.webp",
"w": 589,
"h": 703,
"ax": 281,
"ay": 700,
"orig": "대검 어깨에 메고 섬"
},
"attack": {
"src": "art/h2/gallia/attack.webp",
"w": 813,
"h": 620,
"ax": 351,
"ay": 617,
"orig": "수평 휘두르기"
},
"windup": {
"src": "art/h2/gallia/windup.webp",
"w": 651,
"h": 667,
"ax": 361,
"ay": 664,
"orig": "대검 뒤로 치켜듦"
},
"rest": {
"src": "art/h2/gallia/rest.webp",
"w": 768,
"h": 383,
"ax": 335,
"ay": 380,
"orig": "팔꿈치 괴고 누움"
},
"attack2": {
"src": "art/h2/gallia/attack2.webp",
"w": 794,
"h": 607,
"ax": 207,
"ay": 604,
"orig": "찌르기"
},
"down": {
"src": "art/h2/gallia/down.webp",
"w": 819,
"h": 333,
"ax": 461,
"ay": 330,
"orig": "엎드려 쓰러짐"
},
"attack3": {
"src": "art/h2/gallia/attack3.webp",
"w": 908,
"h": 524,
"ax": 577,
"ay": 521,
"orig": "내려찍기 (지면 파쇄)"
},
"jump": {
"src": "art/h2/gallia/jump.webp",
"w": 664,
"h": 670,
"ax": 403,
"ay": 667,
"orig": "도약 내려베기"
},
"guard": {
"src": "art/h2/gallia/guard.webp",
"w": 476,
"h": 742,
"ax": 175,
"ay": 739,
"orig": "대검 세운 대비 자세"
}
}
},
"gandu": {
"slug": "gandu",
"name": "갱스터 간두",
"rank": "2성",
"folder": "2성 갱스터 간두",
"role": "둘 다 (의리파 갱스터 — 동료 또는 적 조직 간부)",
"tall": 1.88,
"weight": 75,
"palette": [
"#eed267",
"#f2ece0",
"#302c24",
"#3c3c3c",
"#f6e6b4"
],
"missing": [
"walk",
"hurt",
"숙여피하기 따로 (지금은 crouch 겸용)",
"down 따로 (지금은 dead 겸용)"
],
"kit": {
"basic": "권총 쏘기 (attack) — 원거리 12m",
"skills": [
{
"name": "백스텝 사격",
"pose": "backstep",
"desc": "뒤로 3m 뛰며 2발 — 근접 적에서 거리 벌림"
},
{
"name": "앉아쏴",
"pose": "crouch",
"desc": "앉아서 명중 +30%, 받는 원거리 피해 -30%"
},
{
"name": "확인사살",
"pose": "finisher",
"desc": "넘어진 적에게 2배 피해"
}
],
"passive": "의리파: 근처 아군이 쓰러지면 5초 공격 +30%"
},
"apt": {
"melee": 1,
"spear": 0,
"bow": 1,
"gun": 5,
"magic": 0,
"stealth": 2
},
"tag": "soldier",
"role_job": "사수",
"bag": 12,
"stats": {
"hp": 280,
"atk": 26,
"spd": 6,
"weight_kg": 75,
"tall_m": 1.88
},
"portrait": "art/h2/gandu/portrait.webp",
"face": "art/h2/gandu/face.webp",
"poses": {
"idle": {
"src": "art/h2/gandu/idle.webp",
"w": 354,
"h": 702,
"ax": 164,
"ay": 699,
"orig": "스탠딩 (권총 얼굴 옆에 세움, 왼손 주머니)"
},
"attack": {
"src": "art/h2/gandu/attack.webp",
"w": 720,
"h": 554,
"ax": 351,
"ay": 551,
"orig": "기본 공격 (권총 쏘기, 총구 불꽃 · 탄피)"
},
"finisher": {
"src": "art/h2/gandu/finisher.webp",
"w": 666,
"h": 437,
"ax": 327,
"ay": 434,
"orig": "확인사살 · 하단공격 (무릎 꿇고 아래로 쏘기)"
},
"backstep": {
"src": "art/h2/gandu/backstep.webp",
"w": 650,
"h": 597,
"ax": 325,
"ay": 594,
"orig": "백스텝 · 특수기 (뒤로 뛰며 쏘기, 공중)"
},
"crouch": {
"src": "art/h2/gandu/crouch.webp",
"w": 656,
"h": 540,
"ax": 309,
"ay": 537,
"orig": "앉아쏴 (한 무릎 세우고 앉아 겨눔 — 숙여피하기 겸용)"
},
"dead": {
"src": "art/h2/gandu/dead.webp",
"w": 672,
"h": 344,
"ax": 336,
"ay": 341,
"orig": "간두 죽음 (엎어짐, 권총 쥔 채 — 넘어짐 겸용)"
},
"low": {
"src": "art/h2/gandu/finisher.webp",
"w": 666,
"h": 437,
"ax": 327,
"ay": 434,
"orig": "하단공격 — 확인사살 그림 겸용"
},
"special": {
"src": "art/h2/gandu/backstep.webp",
"w": 650,
"h": 597,
"ax": 325,
"ay": 594,
"orig": "특수기 — 백스텝 그림 겸용"
},
"shoot": {
"src": "art/h2/gandu/crouch.webp",
"w": 656,
"h": 540,
"ax": 309,
"ay": 537,
"orig": "앉아쏴"
},
"down": {
"src": "art/h2/gandu/dead.webp",
"w": 672,
"h": 344,
"ax": 336,
"ay": 341,
"orig": "넘어짐 — 죽음 그림 겸용"
}
}
},
"garam": {
"slug": "garam",
"name": "가람",
"rank": "미정 (폴더 이름에 등급 없음)",
"folder": "가람, 히라리",
"role": "동료 (적으로도 가능)",
"tall": 1.68,
"weight": 56,
"palette": [
"#1a1b22",
"#3c3c4b",
"#1f9fa6",
"#f2d6c8",
"#c9ccd6"
],
"missing": [
"walk",
"down",
"dead",
"jump",
"windup",
"attack2",
"shoot (해당 없음)"
],
"kit": {
"basic": "한손 장검 찌르기 — 근접 2.2m (attack)",
"skills": [
{
"name": "청록 검기 올려베기",
"pose": "special",
"desc": "낮게 파고들어 위로 크게 베며 청록 검기로 앞 4m 부채꼴 피해"
},
{
"name": "확인사살",
"pose": "finisher",
"desc": "쓰러진 적에게 두손으로 검을 꽂아 큰 피해 (쓰러짐 상태 적 2배)"
},
{
"name": "포복 침투",
"pose": "crawl",
"desc": "엎드려 기어가며 눈에 덜 띔 (은신 + 이동 느림)"
},
{
"name": "사선 막기",
"pose": "guard",
"desc": "두손 검으로 앞 공격 막기 (근접 피해 60% 감소, 짧게)"
}
],
"passive": "그림자 검사: 은신/포복 상태에서 첫 공격 치명 확률 +30%"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 1,
"gun": 1,
"magic": 0,
"stealth": 4
},
"tag": "soldier",
"role_job": "척후",
"bag": 10,
"stats": {
"hp": 120,
"atk": 16,
"spd": 6.2,
"weight_kg": 56,
"tall_m": 1.68
},
"portrait": "art/h2/garam/portrait.webp",
"face": "art/h2/garam/face.webp",
"poses": {
"idle": {
"src": "art/h2/garam/idle.webp",
"w": 416,
"h": 702,
"ax": 166,
"ay": 699,
"orig": "기본 아이들 (검 내려 든 채 섬)"
},
"run": {
"src": "art/h2/garam/run.webp",
"w": 685,
"h": 614,
"ax": 121,
"ay": 611,
"orig": "뛰기"
},
"attack": {
"src": "art/h2/garam/attack.webp",
"w": 810,
"h": 548,
"ax": 395,
"ay": 545,
"orig": "공격 (한손 찌르기)"
},
"guard": {
"src": "art/h2/garam/guard.webp",
"w": 650,
"h": 717,
"ax": 372,
"ay": 714,
"orig": "수비 자세 (두손 검 사선 막기)"
},
"hurt": {
"src": "art/h2/garam/hurt.webp",
"w": 733,
"h": 641,
"ax": 496,
"ay": 638,
"orig": "피격에 흔들림 (충격선 있음)"
},
"hurt2": {
"src": "art/h2/garam/hurt2.webp",
"w": 727,
"h": 664,
"ax": 422,
"ay": 661,
"orig": "피격 반응"
},
"hurt3": {
"src": "art/h2/garam/hurt3.webp",
"w": 731,
"h": 642,
"ax": 492,
"ay": 639,
"orig": "피격 (hurt 와 거의 같음, 충격선 없음)"
},
"special": {
"src": "art/h2/garam/special.webp",
"w": 727,
"h": 685,
"ax": 347,
"ay": 682,
"orig": "필살기 (낮게 올려베기 + 청록 검기)"
},
"crawl": {
"src": "art/h2/garam/crawl.webp",
"w": 889,
"h": 354,
"ax": 541,
"ay": 351,
"orig": "포복 / 엎드림 / 쉼 (먼지 효과)"
},
"finisher": {
"src": "art/h2/garam/finisher.webp",
"w": 624,
"h": 540,
"ax": 358,
"ay": 537,
"orig": "확살 (확인사살 — 두손으로 검을 아래로 꽂음; 파일 이름 순서로는 하단일 수도)"
},
"armor_idle": {
"src": "art/h2/garam/armor_idle.webp",
"w": 353,
"h": 699,
"ax": 94,
"ay": 696,
"orig": "판금 갑옷 버전 서 있음 (다른 옷)"
},
"armor_ready": {
"src": "art/h2/garam/armor_ready.webp",
"w": 393,
"h": 653,
"ax": 33,
"ay": 650,
"orig": "판금 갑옷 버전 두손 검 겨눔 (다른 옷)"
}
}
},
"garam2": {
"slug": "garam2",
"name": "가람 (망토 갑옷 버전)",
"rank": "미정",
"folder": "가람, 히라리",
"role": "동료 (가람의 다른 옷 / 강화 형태 후보)",
"tall": 1.72,
"weight": 60,
"palette": [
"#1b1b22",
"#3e3e45",
"#3f8a86",
"#f2d8cc",
"#a9b1b5"
],
"missing": [
"walk",
"run",
"hurt",
"dead",
"special",
"crawl"
],
"kit": {
"basic": "장검 찌르기 — 근접 2.5m (attack)",
"skills": [
{
"name": "도약 베기",
"pose": "attack2",
"desc": "뛰어올라 반달 검기로 앞 3m 베기"
},
{
"name": "낮은 자세 베기",
"pose": "low",
"desc": "무릎 꿇고 다리 베기 (느려짐)"
},
{
"name": "겨눔",
"pose": "guard",
"desc": "두손 겨눔 — 다음 공격 반격"
}
],
"passive": "찢긴 망토: 회피 +10%"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 1,
"gun": 0,
"magic": 0,
"stealth": 3
},
"tag": "knight",
"role_job": "선봉",
"bag": 10,
"stats": {
"hp": 140,
"atk": 18,
"spd": 5.8,
"weight_kg": 60,
"tall_m": 1.72
},
"portrait": "art/h2/garam2/portrait.webp",
"face": "art/h2/garam2/face.webp",
"poses": {
"idle": {
"src": "art/h2/garam2/idle.webp",
"w": 458,
"h": 703,
"ax": 253,
"ay": 700,
"orig": "서 있음 (장검 아래로)"
},
"attack": {
"src": "art/h2/garam2/attack.webp",
"w": 1011,
"h": 607,
"ax": 383,
"ay": 604,
"orig": "한손 길게 찌르기 (런지)"
},
"guard": {
"src": "art/h2/garam2/guard.webp",
"w": 643,
"h": 374,
"ax": 246,
"ay": 371,
"orig": "두손 검 겨눔 (낮은 전투 자세)"
},
"down": {
"src": "art/h2/garam2/down.webp",
"w": 654,
"h": 152,
"ax": 440,
"ay": 149,
"orig": "쓰러짐 (검 쥔 채 엎드림)"
},
"low": {
"src": "art/h2/garam2/low.webp",
"w": 581,
"h": 352,
"ax": 306,
"ay": 349,
"orig": "한 무릎 꿇은 낮은 검 자세 (하단)"
},
"attack2": {
"src": "art/h2/garam2/attack2.webp",
"w": 522,
"h": 471,
"ax": 476,
"ay": 468,
"orig": "뛰어오르며 베기 (검기 효과)"
}
}
},
"gari": {
"slug": "gari",
"name": "갱스터 가리",
"rank": "1성",
"folder": "1성 갱스터 가리",
"role": "동료 (적 졸개로도 가능)",
"tall": 1.95,
"weight": 110,
"palette": [
"#e8c032",
"#5e4f6b",
"#2a2624",
"#d8d2c4",
"#6b4a2a"
],
"missing": [
"walk",
"hurt",
"dead",
"grab(잡기)"
],
"kit": {
"basic": "원투 (attack) — 근접 1.5m",
"skills": [
{
"name": "바디블로",
"pose": "attack2",
"desc": "숙여 들어가 배를 침, 상대 경직"
},
{
"name": "엘보 훅",
"pose": "attack3",
"desc": "짧은 거리 강타, 갑옷 무시 일부"
},
{
"name": "버티기",
"pose": "guard",
"desc": "가드 동안 앞 근접 피해 50% 감소, 끝나며 반격"
}
],
"passive": "뒷골목 맷집: 체력 30% 아래에서 공격력 +20%"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 1,
"magic": 0,
"stealth": 1
},
"tag": "brawler",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 900,
"atk": 40,
"spd": 5.5,
"weight_kg": 110,
"tall_m": 1.95
},
"portrait": "art/h2/gari/portrait.webp",
"face": "art/h2/gari/face.webp",
"poses": {
"idle": {
"src": "art/h2/gari/idle.webp",
"w": 421,
"h": 700,
"ax": 215,
"ay": 697,
"orig": "주먹 들고 서 있음 (권투 자세)"
},
"attack": {
"src": "art/h2/gari/attack.webp",
"w": 590,
"h": 670,
"ax": 353,
"ay": 667,
"orig": "오른 주먹 곧게 뻗기 (스트레이트)"
},
"guard": {
"src": "art/h2/gari/guard.webp",
"w": 560,
"h": 702,
"ax": 286,
"ay": 699,
"orig": "낮게 버티고 두 주먹 가드"
},
"down": {
"src": "art/h2/gari/down.webp",
"w": 939,
"h": 331,
"ax": 580,
"ay": 328,
"orig": "옆으로 누워 쓰러짐 (턱 괴고 눈 뜸 — 쉼으로도)"
},
"attack2": {
"src": "art/h2/gari/attack2.webp",
"w": 593,
"h": 567,
"ax": 297,
"ay": 564,
"orig": "몸 숙여 낮게 어퍼컷 준비 / 바디블로"
},
"attack3": {
"src": "art/h2/gari/attack3.webp",
"w": 485,
"h": 684,
"ax": 249,
"ay": 681,
"orig": "팔꿈치 치켜올리기 (엘보 · 훅)"
}
}
},
"goldknight": {
"slug": "goldknight",
"name": "금기사",
"rank": "1성",
"folder": "1성 금기사",
"role": "동료",
"tall": 1.78,
"weight": 85,
"palette": [
"#f0c8a0",
"#9a9898",
"#3a4258",
"#1e1e24",
"#3b78b0"
],
"missing": [
"walk",
"hurt",
"dead",
"block(방패 없음 — guard 로 대신)"
],
"kit": {
"basic": "장검 베기 (attack) — 근접 2m",
"skills": [
{
"name": "관통 찌르기",
"pose": "attack2",
"desc": "앞으로 3m 런지, 일직선 관통"
},
{
"name": "검 세우기",
"pose": "guard",
"desc": "받아넘기기 — 근접 공격 하나를 흘리고 반격"
},
{
"name": "숨 고르기",
"pose": "windup",
"desc": "1초 멈춰 다음 공격 2배 · 기력 회복"
}
],
"passive": "기사의 맹세: 아군이 쓰러지면 잠깐 공격력 +25%"
},
"apt": {
"melee": 5,
"spear": 2,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 1
},
"tag": "knight",
"role_job": "선봉",
"bag": 10,
"stats": {
"hp": 950,
"atk": 42,
"spd": 5.0,
"weight_kg": 85,
"tall_m": 1.78
},
"portrait": "art/h2/goldknight/portrait.webp",
"face": "art/h2/goldknight/face.webp",
"poses": {
"idle": {
"src": "art/h2/goldknight/idle.webp",
"w": 448,
"h": 702,
"ax": 253,
"ay": 699,
"orig": "장검 늘어뜨리고 서 있음"
},
"attack": {
"src": "art/h2/goldknight/attack.webp",
"w": 841,
"h": 685,
"ax": 422,
"ay": 682,
"orig": "두 손으로 장검 위로 뻗어 베기 / 찌르기"
},
"guard": {
"src": "art/h2/goldknight/guard.webp",
"w": 695,
"h": 706,
"ax": 281,
"ay": 703,
"orig": "두 손으로 검 비스듬히 세운 겨눔 자세"
},
"down": {
"src": "art/h2/goldknight/down.webp",
"w": 779,
"h": 416,
"ax": 391,
"ay": 413,
"orig": "바닥에 주저앉음 (검 쥔 채)"
},
"windup": {
"src": "art/h2/goldknight/windup.webp",
"w": 598,
"h": 598,
"ax": 277,
"ay": 595,
"orig": "검을 땅에 꽂듯 내리고 몸 숙임 (공격 준비 · 숨 고르기)"
},
"attack2": {
"src": "art/h2/goldknight/attack2.webp",
"w": 867,
"h": 592,
"ax": 405,
"ay": 589,
"orig": "한 손 앞찌르기 (런지)"
}
}
},
"gun": {
"slug": "gun",
"name": "건",
"rank": 4,
"folder": "4성 차원영웅 건",
"role": "동료 (주인공급)",
"tall": 1.78,
"weight": 70,
"palette": [
"#434c5d",
"#50607b",
"#3f8fd8",
"#9ea2a8",
"#2b2f37"
],
"missing": [
"walk",
"run",
"hurt",
"dead",
"shoot (권총 사격)",
"rod 조율봉 동작"
],
"kit": {
"basic": "브레이커 찌르기 (attack)",
"skills": [
{
"name": "브레이커 휘두르기",
"pose": "attack2",
"note": "앞쪽 넓은 부채꼴"
},
{
"name": "지면 분쇄",
"pose": "special",
"note": "충격파 + 방어 깎기"
},
{
"name": "차원 조율",
"pose": "rod",
"note": "조율봉으로 아군 버프 · 차원 틈 열기 (무기 전환)"
},
{
"name": "예비 권총",
"pose": "pistol",
"note": "원거리 견제 (무기 전환)"
}
],
"passive": "차원 영웅: 무기 세 가지 (곤봉 · 조율봉 · 권총) 를 바꿔 들 수 있음"
},
"apt": {
"melee": 4,
"spear": 3,
"bow": 0,
"gun": 3,
"magic": 2,
"stealth": 1
},
"tag": "knight",
"role_job": "지휘",
"bag": 14,
"stats": {
"hp": 140,
"atk": 18,
"spd": 1.0
},
"portrait": "art/h2/gun/portrait.webp",
"face": "art/h2/gun/face.webp",
"poses": {
"idle": {
"src": "art/h2/gun/idle.webp",
"w": 270,
"h": 701,
"ax": 163,
"ay": 698,
"orig": "기본 (금속 곤봉 = '건 원화'와 같은 그림)"
},
"rod": {
"src": "art/h2/gun/rod.webp",
"w": 344,
"h": 702,
"ax": 196,
"ay": 699,
"orig": "조율봉 (끝이 갈래진 봉, 파란 구슬) 든 다른 차림 — 긴 코트"
},
"pistol": {
"src": "art/h2/gun/pistol.webp",
"w": 243,
"h": 698,
"ax": 113,
"ay": 695,
"orig": "권총 든 다른 차림 (옆모습)"
},
"ready": {
"src": "art/h2/gun/ready.webp",
"w": 468,
"h": 595,
"ax": 210,
"ay": 592,
"orig": "왼쪽: 양면 브레이커 봉 낮게 든 대기"
},
"attack": {
"src": "art/h2/gun/attack.webp",
"w": 683,
"h": 511,
"ax": 381,
"ay": 508,
"orig": "오른쪽: 두 손 찌르기"
},
"attack2": {
"src": "art/h2/gun/attack2.webp",
"w": 617,
"h": 592,
"ax": 339,
"ay": 589,
"orig": "오른쪽: 크게 휘두르기 (궤적)"
},
"special": {
"src": "art/h2/gun/special.webp",
"w": 529,
"h": 486,
"ax": 338,
"ay": 483,
"orig": "왼쪽: 무릎 꿇고 지면 내려찍기 (파편)"
},
"guard": {
"src": "art/h2/gun/guard.webp",
"w": 491,
"h": 536,
"ax": 351,
"ay": 533,
"orig": "왼쪽: 봉 가로로 막기"
},
"down": {
"src": "art/h2/gun/down.webp",
"w": 659,
"h": 228,
"ax": 315,
"ay": 225,
"orig": "오른쪽: 옆으로 쓰러짐 (봉 쥔 채)"
}
}
},
"gundevil": {
"slug": "gundevil",
"name": "권총악마",
"rank": "1성",
"folder": "1성 권총악마",
"role": "동료 (악마 — 적으로도)",
"tall": 1.7,
"weight": 58,
"palette": [
"#f0dca0",
"#8c1a2a",
"#201e1e",
"#f2efe8",
"#c0305a"
],
"missing": [
"walk",
"hurt",
"dead",
"reload"
],
"kit": {
"basic": "쌍권총 사격 (shoot) — 원거리 10m",
"skills": [
{
"name": "도약 난사",
"pose": "jump",
"desc": "옆으로 뛰며 연사, 이동 중 회피"
},
{
"name": "발밑 사격",
"pose": "low",
"desc": "땅을 쏴 파편 — 앞 근거리 둔화"
},
{
"name": "엎드려쏴",
"pose": "prone",
"desc": "누워서 쏨 — 피격 판정 작아지고 명중 +20%"
}
],
"passive": "악마의 뿔: 밤 · 어두운 굴 안에서 치명 +15%"
},
"apt": {
"melee": 1,
"spear": 0,
"bow": 0,
"gun": 5,
"magic": 1,
"stealth": 3
},
"tag": "soldier",
"role_job": "사수",
"bag": 9,
"stats": {
"hp": 560,
"atk": 38,
"spd": 6.0,
"weight_kg": 58,
"tall_m": 1.7
},
"portrait": "art/h2/gundevil/portrait.webp",
"face": "art/h2/gundevil/face.webp",
"poses": {
"idle": {
"src": "art/h2/gundevil/idle.webp",
"w": 391,
"h": 701,
"ax": 205,
"ay": 698,
"orig": "양손 권총 들고 서 있음 (하나는 위로)"
},
"shoot": {
"src": "art/h2/gundevil/shoot.webp",
"w": 826,
"h": 521,
"ax": 290,
"ay": 518,
"orig": "낮게 디딘 자세로 두 팔 뻗어 쌍권총 겨눔"
},
"low": {
"src": "art/h2/gundevil/low.webp",
"w": 806,
"h": 476,
"ax": 387,
"ay": 473,
"orig": "넓게 디디고 아래로 사격 (불꽃 · 파편)"
},
"jump": {
"src": "art/h2/gundevil/jump.webp",
"w": 688,
"h": 606,
"ax": 345,
"ay": 603,
"orig": "공중 쌍권총 사격 (불꽃 · 탄피)"
},
"crouch": {
"src": "art/h2/gundevil/crouch.webp",
"w": 487,
"h": 494,
"ax": 285,
"ay": 491,
"orig": "한쪽 무릎 꿇고 엄폐 자세 (총 하나 위로)"
},
"prone": {
"src": "art/h2/gundevil/prone.webp",
"w": 784,
"h": 315,
"ax": 413,
"ay": 312,
"orig": "옆으로 누워 사격 (넘어짐 · 엎드려쏴로도)"
}
}
},
"hadim": {
"slug": "hadim",
"name": "대악마 하딤",
"rank": "보스",
"folder": "보스,강자들",
"role": "보스",
"tall": 2.6,
"weight": 260,
"palette": [
"#2a2727",
"#3e3437",
"#593f48",
"#b8285e",
"#e05a9a"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"windup"
],
"kit": {
"basic": "대검 휘두르기 (attack) — 근접 3m",
"skills": [
{
"name": "찢는 일격",
"pose": "attack",
"desc": "한 발 크게 내딛으며 대검을 앞으로 길게 휘둠, 출혈"
},
{
"name": "뼈날개 개방",
"pose": "special",
"desc": "등에서 갈퀴 같은 뼈 촉수 6개가 튀어나옴: 주변 4m 를 찌르고 대검으로 땅을 갈라 앞 6m 충격파"
},
{
"name": "비웃음",
"pose": "idle2",
"desc": "대검을 늘어뜨린 채 웃음: 주변 적 공포 (공격력 감소) — 별도 그림 없음"
}
],
"passive": "찢긴 망토: 피가 반 아래면 공격 속도 +30%"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 1
},
"tag": "knight",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 3200,
"atk": 85,
"spd": 5,
"weight_kg": 260,
"tall_m": 2.6
},
"portrait": "art/h2/hadim/portrait.webp",
"face": "art/h2/hadim/face.webp",
"poses": {
"idle": {
"src": "art/h2/hadim/idle.webp",
"w": 650,
"h": 700,
"ax": 266,
"ay": 697,
"orig": "서 있음 (대검 끌기)"
},
"idle2": {
"src": "art/h2/hadim/idle2.webp",
"w": 492,
"h": 703,
"ax": 252,
"ay": 700,
"orig": "서 있음 (대검 아래로)"
},
"attack": {
"src": "art/h2/hadim/attack.webp",
"w": 951,
"h": 563,
"ax": 400,
"ay": 560,
"orig": "대검 내지르기 / 휘두르기"
},
"special": {
"src": "art/h2/hadim/special.webp",
"w": 899,
"h": 593,
"ax": 360,
"ay": 590,
"orig": "등뼈 날개 펼치고 대검 내려찍기 자세"
}
}
},
"hari": {
"slug": "hari",
"name": "하리",
"rank": "천사 (성 표시 없음)",
"folder": "천사 하리",
"role": "동료 (깃털귀 천사 마법사, 원거리 딜러). 은신.png 목록에도 있음",
"tall": 1.72,
"weight": 60,
"palette": [
"#f08cc0",
"#f5f2ee",
"#a8202c",
"#5a5650",
"#a040e0"
],
"missing": [
"hurt",
"dead",
"jump",
"run"
],
"kit": {
"basic": "보라 구슬 탄 (attack) — 10m 직선 마법탄",
"skills": [
{
"name": "심연 내려찍기",
"pose": "attack2",
"desc": "지팡이로 땅을 찍어 반경 2.5m 보라 폭발"
},
{
"name": "보라 소용돌이",
"pose": "skill",
"desc": "8m 지점에 소용돌이를 만들어 3초간 적을 끌어당기며 피해"
},
{
"name": "지팡이 막기",
"pose": "guard",
"desc": "근접 공격 1회 완전히 막고 뒤로 물러남"
}
],
"passive": "깃털귀 천사: 낙하 피해 없음, 은신 중 첫 마법 피해 +40%"
},
"apt": {
"melee": 2,
"spear": 2,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 3
},
"tag": "mage",
"role_job": "사수",
"bag": 10,
"stats": {
"hp": 750,
"atk": 55,
"spd": 5,
"weight_kg": 60,
"tall_m": 1.72
},
"portrait": "art/h2/hari/portrait2.webp",
"face": "art/h2/hari/face2.webp",
"poses": {
"idle": {
"src": "art/h2/hari/idle.webp",
"w": 458,
"h": 709,
"ax": 258,
"ay": 706,
"orig": "지팡이 세워 섬"
},
"attack": {
"src": "art/h2/hari/attack.webp",
"w": 880,
"h": 640,
"ax": 317,
"ay": 637,
"orig": "지팡이 내질러 마법 발사"
},
"attack2": {
"src": "art/h2/hari/attack2.webp",
"w": 846,
"h": 608,
"ax": 565,
"ay": 605,
"orig": "내려찍기 폭발"
},
"skill": {
"src": "art/h2/hari/skill.webp",
"w": 657,
"h": 686,
"ax": 405,
"ay": 683,
"orig": "지팡이 들어 소용돌이"
},
"guard": {
"src": "art/h2/hari/guard.webp",
"w": 528,
"h": 576,
"ax": 243,
"ay": 573,
"orig": "지팡이 가로 막기"
},
"down": {
"src": "art/h2/hari/down.webp",
"w": 701,
"h": 240,
"ax": 386,
"ay": 237,
"orig": "쓰러짐 (눈 감음)"
},
"stand": {
"src": "art/h2/hari/stand.webp",
"w": 465,
"h": 708,
"ax": 216,
"ay": 705,
"orig": "전투 자세 (원화와 같은 그림)"
},
"walk": {
"src": "art/h2/hari/walk.webp",
"w": 465,
"h": 724,
"ax": 161,
"ay": 721,
"orig": "전투 태세 (한 발 내딛음)"
}
}
},
"hirari": {
"slug": "hirari",
"name": "히라리",
"rank": "미정 (폴더 이름에 등급 없음)",
"folder": "가람, 히라리",
"role": "동료",
"tall": 1.62,
"weight": 48,
"palette": [
"#e89ec9",
"#e35fd6",
"#d3dfdd",
"#65455b",
"#f9d4cb"
],
"missing": [
"walk",
"down",
"dead",
"windup",
"cast (skill 로 대신)"
],
"kit": {
"basic": "별봉 별탄 — 중거리 8m (attack)",
"skills": [
{
"name": "뾰로롱",
"pose": "skill",
"desc": "별봉으로 가리킨 아군 1명 회복 + 공격력 증가 (지원기)"
},
{
"name": "별빛 방패",
"pose": "guard",
"desc": "앞에 별 마법진 방패 — 투사체 막음"
},
{
"name": "별똥별 무리",
"pose": "special",
"desc": "별봉을 치켜들어 앞 반원에 별 다발 낙하"
},
{
"name": "땅별 터뜨리기",
"pose": "low",
"desc": "발밑 앞 2m 땅에 별 폭발 — 넘어진/낮은 적에게 강함"
}
],
"passive": "후광: 주변 아군 정신력 회복 +, 성장 게이지가 차면 변신 (hirari2)"
},
"apt": {
"melee": 1,
"spear": 1,
"bow": 1,
"gun": 0,
"magic": 5,
"stealth": 1
},
"tag": "mage",
"role_job": "지원",
"bag": 9,
"stats": {
"hp": 80,
"atk": 14,
"spd": 5.8,
"weight_kg": 48,
"tall_m": 1.62
},
"portrait": "art/h2/hirari/portrait.webp",
"face": "art/h2/hirari/face.webp",
"poses": {
"idle": {
"src": "art/h2/hirari/idle.webp",
"w": 499,
"h": 700,
"ax": 333,
"ay": 697,
"orig": "기본 아이들 (별봉 내려 듦)"
},
"run": {
"src": "art/h2/hirari/run.webp",
"w": 656,
"h": 678,
"ax": 595,
"ay": 675,
"orig": "뛰기"
},
"attack": {
"src": "art/h2/hirari/attack.webp",
"w": 672,
"h": 573,
"ax": 336,
"ay": 570,
"orig": "별봉 내밀어 별 쏘기"
},
"guard": {
"src": "art/h2/hirari/guard.webp",
"w": 685,
"h": 677,
"ax": 428,
"ay": 674,
"orig": "수비 — 별 마법 방패"
},
"hurt": {
"src": "art/h2/hirari/hurt.webp",
"w": 718,
"h": 671,
"ax": 440,
"ay": 668,
"orig": "피격에 흔들림 (충격선)"
},
"hurt2": {
"src": "art/h2/hirari/hurt2.webp",
"w": 717,
"h": 700,
"ax": 462,
"ay": 697,
"orig": "피격 반응 (가슴에 손)"
},
"hurt3": {
"src": "art/h2/hirari/hurt3.webp",
"w": 718,
"h": 671,
"ax": 441,
"ay": 668,
"orig": "피격 (두 팔 자연스러운 수정판)"
},
"special": {
"src": "art/h2/hirari/special.webp",
"w": 686,
"h": 706,
"ax": 487,
"ay": 703,
"orig": "필살기 — 별봉 치켜들어 별 무리 쏟기"
},
"crawl": {
"src": "art/h2/hirari/crawl.webp",
"w": 809,
"h": 399,
"ax": 412,
"ay": 396,
"orig": "포복 / 엎드림 / 쉼 (먼지 효과)"
},
"low": {
"src": "art/h2/hirari/low.webp",
"w": 670,
"h": 690,
"ax": 383,
"ay": 687,
"orig": "하단 — 별봉을 아래로 휘둘러 땅에 별 폭발 (파일 이름 순서로는 확살일 수도)"
},
"skill": {
"src": "art/h2/hirari/skill.webp",
"w": 466,
"h": 704,
"ax": 308,
"ay": 701,
"orig": "뾰로롱 — 별봉 겨눔 (특별 이미지)"
},
"talk": {
"src": "art/h2/hirari/talk.webp",
"w": 378,
"h": 700,
"ax": 280,
"ay": 697,
"orig": "특수 아이들 / 대사 (손 흔들기)"
}
}
},
"hirari2": {
"slug": "hirari2",
"name": "히라리 (변신 · 성장 형태, 히라히라)",
"rank": "미정",
"folder": "가람, 히라리",
"role": "동료 (히라리 변신 후)",
"tall": 1.68,
"weight": 52,
"palette": [
"#f4a6c8",
"#f9f6f5",
"#b7a4b3",
"#b8964a",
"#2a2626"
],
"missing": [
"walk",
"run",
"hurt",
"dead",
"skill"
],
"kit": {
"basic": "날개고리 지팡이 휘두르기 — 근접 2.5m (attack)",
"skills": [
{
"name": "천상 광휘",
"pose": "special",
"desc": "뛰어올라 손바닥에서 빛 폭발 — 앞 5m 부채꼴"
},
{
"name": "대지 내려치기",
"pose": "low",
"desc": "지팡이로 땅을 내려쳐 주변 적 넘어뜨림"
},
{
"name": "지팡이 막기",
"pose": "guard",
"desc": "정면 막기"
}
],
"passive": "성장한 천사: 변신 동안 받는 피해 20% 감소, 시간이 끝나면 hirari 로 돌아옴"
},
"apt": {
"melee": 3,
"spear": 2,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 0
},
"tag": "mage",
"role_job": "선봉",
"bag": 9,
"stats": {
"hp": 130,
"atk": 20,
"spd": 6.0,
"weight_kg": 52,
"tall_m": 1.68
},
"portrait": "art/h2/hirari2/portrait.webp",
"face": "art/h2/hirari2/face.webp",
"poses": {
"idle": {
"src": "art/h2/hirari2/idle.webp",
"w": 475,
"h": 780,
"ax": 177,
"ay": 777,
"orig": "서 있음 (날개고리 지팡이)"
},
"idle2": {
"src": "art/h2/hirari2/idle2.webp",
"w": 309,
"h": 793,
"ax": 134,
"ay": 790,
"orig": "서 있음 2 (뒤돌아 웃음)"
},
"attack": {
"src": "art/h2/hirari2/attack.webp",
"w": 1065,
"h": 713,
"ax": 369,
"ay": 710,
"orig": "지팡이 크게 휘두르기 (빛 궤적 대부분 지워짐)"
},
"guard": {
"src": "art/h2/hirari2/guard.webp",
"w": 895,
"h": 705,
"ax": 488,
"ay": 702,
"orig": "지팡이 사선으로 막기"
},
"down": {
"src": "art/h2/hirari2/down.webp",
"w": 1180,
"h": 335,
"ax": 847,
"ay": 332,
"orig": "쓰러짐 (엎드려 지팡이 쥠)"
},
"low": {
"src": "art/h2/hirari2/low.webp",
"w": 1144,
"h": 577,
"ax": 569,
"ay": 574,
"orig": "무릎 꿇고 지팡이로 땅 내려치기 (불꽃)"
},
"special": {
"src": "art/h2/hirari2/special.webp",
"w": 980,
"h": 717,
"ax": 599,
"ay": 714,
"orig": "뛰어오르며 손바닥 빛 폭발 (빛 효과 옅게 남음)"
}
}
},
"inclador": {
"slug": "inclador",
"name": "갱스터 잉끌레이도르",
"rank": "2성",
"folder": "2성 갱스터 잉끌레이도르",
"role": "둘 다 (갱스터 — 적 조직원 또는 동료)",
"tall": 1.8,
"weight": 68,
"palette": [
"#212020",
"#d8d4cc",
"#d6b25e",
"#a0703a",
"#5a5a5e"
],
"missing": [
"attack (진짜 휘두르기)",
"walk",
"hurt",
"down",
"dead",
"guard"
],
"kit": {
"basic": "장도리 내려치기 (windup→attack) — 근접 1.2m",
"skills": [
{
"name": "못 빼기",
"pose": "windup",
"desc": "장도리 뒷면으로 방패 · 갑옷 벗기기 (방어 -30% 5초)"
},
{
"name": "미친 웃음",
"pose": "idle",
"desc": "주변 적 1명 겁먹게 (공격 -20% 4초)"
}
],
"passive": "흉터: 피가 30% 아래면 공격 속도 +25%"
},
"apt": {
"melee": 4,
"spear": 0,
"bow": 0,
"gun": 1,
"magic": 0,
"stealth": 3
},
"tag": "brawler",
"role_job": "척후",
"bag": 9,
"stats": {
"hp": 260,
"atk": 26,
"spd": 7,
"weight_kg": 68,
"tall_m": 1.8
},
"portrait": "art/h2/inclador/portrait.webp",
"face": "art/h2/inclador/face.webp",
"poses": {
"idle": {
"src": "art/h2/inclador/idle.webp",
"w": 254,
"h": 699,
"ax": 126,
"ay": 696,
"orig": "서 있음 (오른손 장도리 낮게, 왼손 주머니)"
},
"windup": {
"src": "art/h2/inclador/windup.webp",
"w": 403,
"h": 691,
"ax": 183,
"ay": 688,
"orig": "두 손 장도리 치켜듦 (휘두르기 직전)"
},
"attack": {
"src": "art/h2/inclador/windup.webp",
"w": 403,
"h": 691,
"ax": 183,
"ay": 688,
"orig": "공격 그림 없음 — windup 을 앞으로 기울여 대신 (임시)"
}
}
},
"joshua": {
"slug": "joshua",
"name": "투구게 조슈아",
"rank": 4,
"folder": "4성 투구게 SF",
"role": "동료 (적 · 보스로도 가능)",
"tall": 2.3,
"weight": 320,
"palette": [
"#af9454",
"#8f7541",
"#372b26",
"#5a2328",
"#27201c"
],
"missing": [
"walk",
"run",
"hurt",
"dead"
],
"kit": {
"basic": "스트레이트 (attack)",
"skills": [
{
"name": "지면 강타",
"pose": "special",
"note": "앞쪽 원뿔 범위 기절"
},
{
"name": "케이블 채찍",
"pose": "skill",
"note": "중거리 끌어당기기 (등 뒤 케이블)"
},
{
"name": "철벽",
"pose": "guard",
"note": "정면 피해 크게 줄임"
}
],
"passive": "갑각 장갑: 받는 물리 피해 -20%, 넉백 면역"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 1,
"magic": 0,
"stealth": 0
},
"tag": "brawler",
"role_job": "선봉",
"bag": 14,
"stats": {
"hp": 240,
"atk": 22,
"spd": 0.75
},
"portrait": "art/h2/joshua/portrait.webp",
"face": "art/h2/joshua/face.webp",
"poses": {
"idle": {
"src": "art/h2/joshua/idle.webp",
"w": 309,
"h": 699,
"ax": 173,
"ay": 696,
"orig": "기본 (두 손 모으고 선 자세 = '투구게 조슈아' 초상과 같은 그림)"
},
"ready": {
"src": "art/h2/joshua/ready.webp",
"w": 616,
"h": 664,
"ax": 272,
"ay": 661,
"orig": "왼쪽: 두 주먹 모은 전투 대기"
},
"attack": {
"src": "art/h2/joshua/attack.webp",
"w": 792,
"h": 632,
"ax": 317,
"ay": 629,
"orig": "오른쪽: 스트레이트 펀치"
},
"special": {
"src": "art/h2/joshua/special.webp",
"w": 646,
"h": 524,
"ax": 439,
"ay": 521,
"orig": "왼쪽: 지면 강타 (주먹으로 땅을 부숨, 파편)"
},
"skill": {
"src": "art/h2/joshua/skill.webp",
"w": 751,
"h": 678,
"ax": 387,
"ay": 675,
"orig": "오른쪽: 손 뻗으며 등 뒤 케이블 (촉수) 휘몰아침"
},
"guard": {
"src": "art/h2/joshua/guard.webp",
"w": 522,
"h": 558,
"ax": 215,
"ay": 555,
"orig": "왼쪽: 팔로 머리 막기"
},
"down": {
"src": "art/h2/joshua/down.webp",
"w": 830,
"h": 252,
"ax": 411,
"ay": 249,
"orig": "오른쪽: 엎어져 쓰러짐"
}
}
},
"kanya": {
"slug": "kanya",
"name": "여검방기사 칸야",
"rank": "2성",
"folder": "2성 여검방기사 칸야",
"role": "동료",
"tall": 1.68,
"weight": 70,
"palette": [
"#333946",
"#171b21",
"#3a6fd8",
"#8a93a8",
"#f0d6c8"
],
"missing": [
"walk",
"hurt",
"dead (down 으로 대신)"
],
"kit": {
"basic": "장검 찌르기 (attack) — 근접 2m",
"skills": [
{
"name": "방패 돌진",
"pose": "jump",
"desc": "방패 앞세워 4m 뛰어들어 부딪힌 적 넘어뜨림"
},
{
"name": "검방 자세",
"pose": "guard",
"desc": "막기 + 막은 직후 찌르기 반격"
},
{
"name": "무릎 방벽",
"pose": "crouch",
"desc": "웅크려 방패 세움 — 뒤의 아군 화살 · 총알 막아 줌"
}
],
"passive": "남색 결의: 아군 사수가 뒤에 있으면 방어 +15%"
},
"apt": {
"melee": 4,
"spear": 2,
"bow": 1,
"gun": 0,
"magic": 0,
"stealth": 1
},
"tag": "knight",
"role_job": "선봉",
"bag": 10,
"stats": {
"hp": 330,
"atk": 22,
"spd": 7,
"weight_kg": 70,
"tall_m": 1.68
},
"portrait": "art/h2/kanya/portrait.webp",
"face": "art/h2/kanya/face.webp",
"poses": {
"idle": {
"src": "art/h2/kanya/idle.webp",
"w": 485,
"h": 700,
"ax": 236,
"ay": 697,
"orig": "서 있음 (장검 아래로, 방패 앞)"
},
"attack": {
"src": "art/h2/kanya/attack.webp",
"w": 874,
"h": 584,
"ax": 290,
"ay": 581,
"orig": "두 손 장검 찌르기 (방패 앞, 깊은 런지)"
},
"crouch": {
"src": "art/h2/kanya/crouch.webp",
"w": 683,
"h": 569,
"ax": 341,
"ay": 566,
"orig": "한 무릎 꿇고 방패 세움, 검 앞 아래"
},
"jump": {
"src": "art/h2/kanya/jump.webp",
"w": 735,
"h": 625,
"ax": 330,
"ay": 622,
"orig": "방패 앞세워 뛰어듦 (검 뒤로) — 공중"
},
"guard": {
"src": "art/h2/kanya/guard.webp",
"w": 621,
"h": 670,
"ax": 255,
"ay": 667,
"orig": "방패 방어 + 검 가로로 겨눔"
},
"down": {
"src": "art/h2/kanya/down.webp",
"w": 883,
"h": 317,
"ax": 441,
"ay": 314,
"orig": "옆으로 쓰러짐 (머리 오른쪽, 방패 · 검 쥔 채)"
},
"idle2": {
"src": "art/h2/kanya/idle2.webp",
"w": 412,
"h": 699,
"ax": 167,
"ay": 696,
"orig": "원화 서 있음 (검 비스듬히, 배율 따로 0.478)"
},
"dead": {
"src": "art/h2/kanya/down.webp",
"w": 883,
"h": 317,
"ax": 441,
"ay": 314,
"orig": "죽음 그림 없음 — down 으로 대신"
}
}
},
"langpang": {
"slug": "langpang",
"name": "랑팡",
"rank": "3성 NPC",
"folder": "NPC, 3성, 이계 탐험가 랑팡",
"role": "NPC (이계 탐험가 · 마력공학자). 영입하면 동료",
"tall": 1.6,
"weight": 48,
"palette": [
"#8fc8e8",
"#2f4a55",
"#2c2f35",
"#8a6a3a",
"#4ab0e8"
],
"missing": [
"walk",
"hurt",
"dead",
"jump"
],
"kit": {
"basic": "마력 충격 (attack) — 앞 6m 충격파, 작은 넉백",
"skills": [
{
"name": "톱니 마법진",
"pose": "skill",
"desc": "앞에 회전 톱니 고리를 세워 5초간 투사체 막기 + 닿은 적 지속 피해"
},
{
"name": "지면 방전",
"pose": "special",
"desc": "땅을 쳐 반경 3m 감전, 1.5초 기절"
},
{
"name": "이계 탐지",
"pose": "crouch",
"desc": "웅크려 장갑으로 주변 10m 함정 · 숨은 적 · 유물 표시"
}
],
"passive": "이계 탐험가: 함정 피해 50% 감소, 상자 · 유물에서 얻는 것 +1"
},
"apt": {
"melee": 2,
"spear": 0,
"bow": 1,
"gun": 3,
"magic": 4,
"stealth": 3
},
"tag": "mage",
"role_job": "척후",
"bag": 16,
"stats": {
"hp": 650,
"atk": 40,
"spd": 5.5,
"weight_kg": 48,
"tall_m": 1.6
},
"portrait": "art/h2/langpang/portrait.webp",
"face": "art/h2/langpang/face.webp",
"poses": {
"idle": {
"src": "art/h2/langpang/idle.webp",
"w": 316,
"h": 702,
"ax": 145,
"ay": 699,
"orig": "서 있음"
},
"attack": {
"src": "art/h2/langpang/attack.webp",
"w": 683,
"h": 650,
"ax": 434,
"ay": 647,
"orig": "장갑 손바닥 내지르기"
},
"special": {
"src": "art/h2/langpang/special.webp",
"w": 536,
"h": 354,
"ax": 278,
"ay": 351,
"orig": "땅 치기 방전"
},
"skill": {
"src": "art/h2/langpang/skill.webp",
"w": 379,
"h": 450,
"ax": 209,
"ay": 447,
"orig": "톱니 마법진"
},
"crouch": {
"src": "art/h2/langpang/crouch.webp",
"w": 430,
"h": 391,
"ax": 169,
"ay": 388,
"orig": "웅크려 살피기"
},
"down": {
"src": "art/h2/langpang/down.webp",
"w": 576,
"h": 180,
"ax": 311,
"ay": 177,
"orig": "쓰러짐 (눈 감음)"
}
}
},
"levi": {
"slug": "levi",
"name": "레비",
"rank": 4,
"folder": "4성 악마 소환사 레비",
"role": "동료 (적으로도 가능)",
"tall": 1.68,
"weight": 58,
"palette": [
"#4b4a40",
"#636054",
"#5a4630",
"#b8ab90",
"#201f1b"
],
"missing": [
"walk",
"run",
"hurt",
"dead",
"reload",
"jump"
],
"kit": {
"basic": "소총 점사 (shoot)",
"skills": [
{
"name": "그림자 용 소환",
"pose": "summon",
"note": "levi_beast를 불러 돌진시킴 (beast dash)"
},
{
"name": "무릎 강타",
"pose": "special",
"note": "주변 지면 충격, 근접 적 넉백"
},
{
"name": "무릎 쏴",
"pose": "crouch",
"note": "멈춰 앉아 정밀 사격, 명중 · 사거리 증가"
},
{
"name": "지휘",
"pose": "command",
"note": "소환수 강화 · 어그로 끌기 (궁극기)"
}
],
"passive": "계약의 그림자: 체력이 30% 아래로 떨어지면 소환수가 자동으로 나타나 한 번 막아 줌",
"melee": "소총 휘두르기 (attack)"
},
"apt": {
"melee": 2,
"spear": 0,
"bow": 1,
"gun": 4,
"magic": 4,
"stealth": 2
},
"tag": "mage",
"role_job": "사수",
"bag": 12,
"stats": {
"hp": 110,
"atk": 16,
"spd": 1.0
},
"portrait": "art/h2/levi/portrait.webp",
"face": "art/h2/levi/face.webp",
"poses": {
"idle": {
"src": "art/h2/levi/idle.webp",
"w": 294,
"h": 700,
"ax": 185,
"ay": 697,
"orig": "기본 (레비 기본 — 뒤돌아보며 소총을 아래로 듦)"
},
"ready": {
"src": "art/h2/levi/ready.webp",
"w": 347,
"h": 701,
"ax": 165,
"ay": 698,
"orig": "왼쪽: 소총 낮춰 든 전투 대기"
},
"shoot": {
"src": "art/h2/levi/shoot.webp",
"w": 621,
"h": 678,
"ax": 245,
"ay": 675,
"orig": "오른쪽: 견착 사격 (총구 불꽃)"
},
"attack": {
"src": "art/h2/levi/attack.webp",
"w": 575,
"h": 660,
"ax": 337,
"ay": 657,
"orig": "왼쪽: 소총 공격 (개머리 · 총열 휘두르기)"
},
"summon": {
"src": "art/h2/levi/summon.webp",
"w": 459,
"h": 698,
"ax": 251,
"ay": 695,
"orig": "오른쪽: 소환 (한 손 뻗음)"
},
"summon2": {
"src": "art/h2/levi/summon2.webp",
"w": 481,
"h": 693,
"ax": 296,
"ay": 690,
"orig": "오른쪽: 소환 자세 (두 손 뻗음)"
},
"special": {
"src": "art/h2/levi/special.webp",
"w": 602,
"h": 546,
"ax": 421,
"ay": 543,
"orig": "왼쪽: 무릎 강타 (한 무릎 꿇고 주먹으로 땅을 침, 파편)"
},
"crouch": {
"src": "art/h2/levi/crouch.webp",
"w": 473,
"h": 533,
"ax": 298,
"ay": 530,
"orig": "왼쪽: 무릎 쏴 (앉아 겨눔)"
},
"down": {
"src": "art/h2/levi/down.webp",
"w": 642,
"h": 397,
"ax": 597,
"ay": 394,
"orig": "오른쪽: 넘어진 채 소총 겨눔"
},
"command": {
"src": "art/h2/levi/command.webp",
"w": 466,
"h": 701,
"ax": 156,
"ay": 698,
"orig": "검은 괴수를 지휘 (그림자 용과 함께, 좌우 반전)"
}
}
},
"levi_beast": {
"slug": "levi_beast",
"name": "레비의 소환수 (숯빛 그림자 용)",
"rank": 4,
"folder": "4성 악마 소환사 레비",
"role": "소환수 (레비 편)",
"tall": 2.8,
"weight": 900,
"palette": [
"#332f32",
"#242224",
"#484346",
"#5d5659",
"#d02020"
],
"missing": [
"attack(물기 · 할퀴기)",
"hurt",
"dead(그림자로 흩어짐)",
"appear(소환 연출)"
],
"kit": {
"basic": "할퀴기",
"skills": [
{
"name": "돌진",
"pose": "dash",
"note": "직선 관통 돌진"
}
],
"passive": "그림자 몸: 일정 시간 뒤 사라짐 (지속 소환수)"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 1,
"stealth": 1
},
"tag": "beast",
"role_job": "선봉",
"bag": 0,
"stats": {
"hp": 260,
"atk": 28,
"spd": 1.3
},
"poses": {
"idle": {
"src": "art/h2/levi_beast/idle.webp",
"w": 962,
"h": 698,
"ax": 620,
"ay": 695,
"orig": "왼쪽: 대기"
},
"dash": {
"src": "art/h2/levi_beast/dash.webp",
"w": 971,
"h": 677,
"ax": 845,
"ay": 674,
"orig": "오른쪽: 돌진 (입 벌리고 앞발 뻗음)"
}
}
},
"madangsoe": {
"slug": "madangsoe",
"name": "마당쇠",
"rank": "2성",
"folder": "2성 돌쇠, 마당쇠",
"role": "둘 다 (돌쇠와 짝 — 동료 또는 조직 적)",
"tall": 1.92,
"weight": 95,
"palette": [
"#1f1f1f",
"#d9a930",
"#e8e4dc",
"#988d7a",
"#101010"
],
"missing": [
"walk",
"hurt",
"dead (down 으로 대신)",
"windup"
],
"kit": {
"basic": "곧은 주먹 (attack) — 근접 1.2m, 빠름",
"skills": [
{
"name": "늑대 날아차기",
"pose": "kick",
"desc": "3m 뛰어 차기, 맞은 적 밀려남"
},
{
"name": "땅 울리기",
"pose": "special",
"desc": "주먹으로 땅 쳐 주변 2.5m 적 넘어뜨림 (파편)"
},
{
"name": "가드 올리기",
"pose": "guard",
"desc": "앞 피해 50% 막고 다음 주먹 +30%"
}
],
"passive": "황금 늑대 가면: 맨손 — 무기 없어도 감 0, 돌쇠와 같이 있으면 hp 회복 +"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 1
},
"tag": "brawler",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 360,
"atk": 26,
"spd": 6,
"weight_kg": 95,
"tall_m": 1.92
},
"portrait": "art/h2/madangsoe/portrait.webp",
"face": "art/h2/madangsoe/face.webp",
"poses": {
"idle": {
"src": "art/h2/madangsoe/idle.webp",
"w": 310,
"h": 702,
"ax": 154,
"ay": 699,
"orig": "서 있음 (왼손 주머니, 오른 주먹)"
},
"attack": {
"src": "art/h2/madangsoe/attack.webp",
"w": 661,
"h": 625,
"ax": 330,
"ay": 622,
"orig": "오른 주먹 곧게 뻗기 (바람 선 · 발밑 파편)"
},
"guard": {
"src": "art/h2/madangsoe/guard.webp",
"w": 418,
"h": 552,
"ax": 204,
"ay": 549,
"orig": "두 주먹 얼굴 앞 (권투 막기)"
},
"down": {
"src": "art/h2/madangsoe/down.webp",
"w": 742,
"h": 220,
"ax": 371,
"ay": 217,
"orig": "엎드려 쓰러짐 (머리 오른쪽)"
},
"special": {
"src": "art/h2/madangsoe/special.webp",
"w": 652,
"h": 531,
"ax": 325,
"ay": 528,
"orig": "주먹으로 땅 내려치기 (돌 파편 터짐)"
},
"kick": {
"src": "art/h2/madangsoe/kick.webp",
"w": 653,
"h": 549,
"ax": 320,
"ay": 546,
"orig": "날아 차기 (공중, 오른발 뻗음)"
},
"dead": {
"src": "art/h2/madangsoe/down.webp",
"w": 742,
"h": 220,
"ax": 371,
"ay": 217,
"orig": "죽음 그림 없음 — down 으로 대신"
},
"jump": {
"src": "art/h2/madangsoe/kick.webp",
"w": 653,
"h": 549,
"ax": 320,
"ay": 546,
"orig": "점프 그림 없음 — kick 으로 대신"
}
}
},
"makarov": {
"slug": "makarov",
"name": "대전사 마카로프",
"rank": "강적",
"folder": "강적 대전사 마카로프",
"role": "적 (강적)",
"tall": 2.2,
"weight": 180,
"palette": [
"#282320",
"#48403a",
"#726454",
"#92816d",
"#c4b19a"
],
"missing": [
"walk",
"hurt",
"dead(down 으로 대신 가능)"
],
"kit": {
"basic": "철퇴 휘두르기 (attack) — 근접 2.5m",
"skills": [
{
"name": "내려찍기",
"pose": "windup→attack2",
"desc": "치켜들었다가 땅을 내려찍음, 앞 3m 범위 + 기절"
},
{
"name": "도약 강타",
"pose": "jump",
"desc": "6m 뛰어올라 착지하며 철퇴로 침"
},
{
"name": "쓸어치기",
"pose": "attack",
"desc": "옆으로 크게 쓸어 돌 파편을 튀김 (넓은 부채꼴)"
}
],
"passive": "뼈갑옷: 앞에서 오는 화살 · 총알 피해 30% 감소"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "brawler",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 1400,
"atk": 60,
"spd": 4.5,
"weight_kg": 180,
"tall_m": 2.2
},
"portrait": "art/h2/makarov/portrait.webp",
"face": "art/h2/makarov/face.webp",
"poses": {
"idle": {
"src": "art/h2/makarov/idle.webp",
"w": 509,
"h": 706,
"ax": 304,
"ay": 703,
"orig": "서 있음 (철퇴 늘어뜨림)"
},
"windup": {
"src": "art/h2/makarov/windup.webp",
"w": 559,
"h": 691,
"ax": 249,
"ay": 688,
"orig": "철퇴 머리 위로 치켜들기"
},
"attack": {
"src": "art/h2/makarov/attack.webp",
"w": 921,
"h": 599,
"ax": 300,
"ay": 596,
"orig": "철퇴 옆으로 쓸어 땅 치기"
},
"attack2": {
"src": "art/h2/makarov/attack2.webp",
"w": 756,
"h": 612,
"ax": 330,
"ay": 609,
"orig": "철퇴 내려찍기 (땅 터짐)"
},
"jump": {
"src": "art/h2/makarov/jump.webp",
"w": 733,
"h": 696,
"ax": 366,
"ay": 693,
"orig": "뛰어올라 철퇴 휘두르기"
},
"down": {
"src": "art/h2/makarov/down.webp",
"w": 865,
"h": 289,
"ax": 432,
"ay": 286,
"orig": "뒤로 쓰러짐 (철퇴 쥔 채)"
}
}
},
"mangak": {
"slug": "mangak",
"name": "망각",
"rank": "보스",
"folder": "보스 망각",
"role": "보스",
"tall": 6.6,
"weight": 18000,
"palette": [
"#252420",
"#5f5f53",
"#7b7b6a",
"#c8202a",
"#e8d27a"
],
"missing": [
"hurt",
"down",
"dead",
"roar(포효)",
"tail(꼬리 휘두르기)",
"turn(뒤돌기)"
],
"kit": {
"basic": "앞발 할퀴기 (attack) — 앞 6m 부채꼴, 넘어뜨림",
"skills": [
{
"name": "돌진 할퀴기",
"pose": "attack",
"desc": "8m 앞으로 뛰어들며 앞발 갈퀴로 긁음, 맞으면 넘어짐"
},
{
"name": "망각의 아가리",
"pose": "special",
"desc": "턱이 네 갈래로 벌어지며 앞 5m 를 물어 삼킴: 큰 피해 + 잠깐 '망각' (기술 · 아이템 못 씀 3초)"
},
{
"name": "어슬렁 포위",
"pose": "walk",
"desc": "천천히 옆으로 돌며 꼬리 끝 가시로 뒤쪽 견제 (꼬리 그림 없음 — walk 로 대신)"
}
],
"passive": "비늘 깃털 갑옷: 정면 원거리 피해 30% 감소, 옆구리 · 등은 약점"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 1,
"stealth": 0
},
"tag": "beast",
"role_job": "선봉",
"bag": 6,
"stats": {
"hp": 6000,
"atk": 90,
"spd": 4.5,
"weight_kg": 18000,
"tall_m": 6.6,
"length_m": 10
},
"portrait": "art/h2/mangak/portrait.webp",
"face": "art/h2/mangak/face.webp",
"poses": {
"idle": {
"src": "art/h2/mangak/idle.webp",
"w": 1055,
"h": 699,
"ax": 545,
"ay": 696,
"orig": "서 있음 (네 발 웅크림)"
},
"walk": {
"src": "art/h2/mangak/walk.webp",
"w": 858,
"h": 695,
"ax": 458,
"ay": 692,
"orig": "어슬렁 (네 발 걷기)"
},
"attack": {
"src": "art/h2/mangak/attack.webp",
"w": 1060,
"h": 695,
"ax": 420,
"ay": 692,
"orig": "앞발 할퀴기 돌진"
},
"special": {
"src": "art/h2/mangak/special.webp",
"w": 1063,
"h": 708,
"ax": 420,
"ay": 705,
"orig": "턱 펼쳐 삼키기"
}
}
},
"manghyang": {
"slug": "manghyang",
"name": "이계악마 망향",
"rank": "동료·적",
"folder": "동료·적 이계악마 망향",
"role": "둘 다 (동료 / 적)",
"tall": 1.8,
"weight": 75,
"palette": [
"#3e1f2e",
"#863959",
"#e26592",
"#d198ac",
"#f6dde5"
],
"missing": [
"walk",
"hurt",
"dead",
"skill"
],
"kit": {
"basic": "갈퀴손 할퀴기 (attack) — 근접 1.8m, 2연타",
"skills": [
{
"name": "돌진 할퀴기",
"pose": "attack",
"desc": "4m 뛰어들며 할퀴어 출혈"
},
{
"name": "엑스 막기",
"pose": "guard",
"desc": "두 팔 교차 막기, 막은 뒤 다음 공격 강화"
},
{
"name": "그리움 (망향)",
"pose": "idle",
"desc": "근처 아군 수만큼 힘이 오름 (그림 없음)"
}
],
"passive": "이계의 몸: 쓰러지면 한 번 피 1로 버팀"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 1
},
"tag": "brawler",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 420,
"atk": 28,
"spd": 6.5,
"weight_kg": 75,
"tall_m": 1.8
},
"portrait": "art/h2/manghyang/portrait.webp",
"face": "art/h2/manghyang/face.webp",
"poses": {
"idle": {
"src": "art/h2/manghyang/idle.webp",
"w": 390,
"h": 701,
"ax": 167,
"ay": 698,
"orig": "서 있음"
},
"attack": {
"src": "art/h2/manghyang/attack.webp",
"w": 631,
"h": 623,
"ax": 323,
"ay": 620,
"orig": "앞으로 뛰어들며 갈퀴손 할퀴기"
},
"guard": {
"src": "art/h2/manghyang/guard.webp",
"w": 459,
"h": 473,
"ax": 226,
"ay": 470,
"orig": "두 팔 X 자 막기 (넓게 버팀)"
},
"down": {
"src": "art/h2/manghyang/down.webp",
"w": 740,
"h": 277,
"ax": 370,
"ay": 274,
"orig": "엎드려 쓰러짐 (머리 오른쪽)"
}
}
},
"mano": {
"slug": "mano",
"name": "마노",
"rank": "보스",
"folder": "보스,강자들",
"role": "보스",
"tall": 2.5,
"weight": 90,
"palette": [
"#151a23",
"#1c1f28",
"#27333c",
"#799dac",
"#9fd6ea"
],
"missing": [
"hurt",
"down",
"dead",
"jump"
],
"kit": {
"basic": "긴 팔 할퀴기 (attack) — 근접 3.5m (팔이 길어 사거리 김)",
"skills": [
{
"name": "그림자 낫",
"pose": "special",
"desc": "팔다리가 초승달 칼날로 늘어나 주변 5m 를 휘감아 벰"
},
{
"name": "기어 다가오기",
"pose": "walk",
"desc": "낮게 웅크려 빠르게 접근, 이때 원거리 덜 맞음"
},
{
"name": "늘어난 손",
"pose": "attack",
"desc": "6m 떨어진 적까지 손을 뻗어 할퀴고 당김"
}
],
"passive": "그림자 몸: 어두운 곳에서 이동 속도 +30%, 빛 피해 2배"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 5
},
"tag": "beast",
"role_job": "척후",
"bag": 6,
"stats": {
"hp": 2400,
"atk": 75,
"spd": 7,
"weight_kg": 90,
"tall_m": 2.5
},
"portrait": "art/h2/mano/portrait.webp",
"face": "art/h2/mano/face.webp",
"poses": {
"idle": {
"src": "art/h2/mano/idle.webp",
"w": 303,
"h": 700,
"ax": 150,
"ay": 697,
"orig": "서 있음 (가늘고 긴 몸)"
},
"walk": {
"src": "art/h2/mano/walk.webp",
"w": 413,
"h": 525,
"ax": 250,
"ay": 522,
"orig": "웅크려 기어오기"
},
"attack": {
"src": "art/h2/mano/attack.webp",
"w": 643,
"h": 495,
"ax": 310,
"ay": 492,
"orig": "팔 뻗어 갈퀴 할퀴기"
},
"special": {
"src": "art/h2/mano/special.webp",
"w": 726,
"h": 596,
"ax": 343,
"ay": 593,
"orig": "몸이 낫 모양 그림자 칼날로 변함"
}
}
},
"ohe": {
"slug": "ohe",
"name": "오헤",
"rank": "1성",
"folder": "(2기멤버 동료,적 모음 바로 아래 낱장) 오헤 (1성악마동료).png",
"role": "동료 (1성 악마)",
"tall": 1.75,
"weight": 55,
"palette": [
"#141416",
"#262425",
"#594f54",
"#8a84d8",
"#79d4ff"
],
"missing": [
"walk",
"run",
"attack",
"skill",
"guard",
"hurt",
"down",
"dead"
],
"kit": {
"basic": "갈고리 손톱 할퀴기 — 근접 1.5m (그림 없음 — sneak 로 대신)",
"skills": [
{
"name": "그림자 숨기",
"pose": "sneak",
"desc": "웅크려 어둠에 섞임 — 은신"
},
{
"name": "뒤에서 할퀴기",
"pose": "sneak",
"desc": "은신 중 첫 공격 피해 2배"
}
],
"passive": "악마의 눈: 어두운 곳에서 시야 +, 빛 마법(히라리 등)에 약함"
},
"apt": {
"melee": 3,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 5
},
"tag": "beast",
"role_job": "척후",
"bag": 6,
"stats": {
"hp": 70,
"atk": 11,
"spd": 6.8,
"weight_kg": 55,
"tall_m": 1.75
},
"portrait": "art/h2/ohe/portrait.webp",
"face": "art/h2/ohe/face.webp",
"poses": {
"idle": {
"src": "art/h2/ohe/idle.webp",
"w": 258,
"h": 710,
"ax": 135,
"ay": 707,
"orig": "서 있음 (정면, 꼬리)"
},
"sneak": {
"src": "art/h2/ohe/sneak.webp",
"w": 413,
"h": 433,
"ax": 184,
"ay": 430,
"orig": "은신 — 낮게 웅크린 자세 (갈고리 손)"
}
}
},
"pearl": {
"slug": "pearl",
"name": "인공타천사 펄",
"rank": "1성",
"folder": "1성 인공타천사 펄",
"role": "둘 다 (캡처에 \"3인방\" — 적 3인조로 먼저 나오고 동료가 될 수 있음)",
"tall": 1.58,
"weight": 48,
"palette": [
"#f2d468",
"#1a1618",
"#f8dfcf",
"#d0303c",
"#8a8a8a"
],
"missing": [
"walk",
"hurt",
"dead",
"fly(날기)"
],
"kit": {
"basic": "밀치기 (attack) — 근접 1.5m, 넉백",
"skills": [
{
"name": "철 깃털 (철 특수기)",
"pose": "special",
"desc": "강철 깃털 부채꼴 발사 — 중거리 8m, 출혈"
},
{
"name": "꼬깃꼬깃 착지",
"pose": "land",
"desc": "날아올랐다 내려찍기, 주변 2m 충격파"
},
{
"name": "움츠리기",
"pose": "crouch",
"desc": "날개로 몸 감싸 2초 동안 받는 피해 60% 감소"
}
],
"passive": "타천 날개: 떨어질 때 피해 없음, 점프 높이 +50%"
},
"apt": {
"melee": 3,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 4,
"stealth": 2
},
"tag": "mage",
"role_job": "척후",
"bag": 7,
"stats": {
"hp": 480,
"atk": 36,
"spd": 7.0,
"weight_kg": 48,
"tall_m": 1.58
},
"portrait": "art/h2/pearl/portrait.webp",
"face": "art/h2/pearl/face.webp",
"poses": {
"idle": {
"src": "art/h2/pearl/idle.webp",
"w": 345,
"h": 699,
"ax": 100,
"ay": 696,
"orig": "펄기본 — 날개 접고 서서 웃음"
},
"attack": {
"src": "art/h2/pearl/attack.webp",
"w": 639,
"h": 700,
"ax": 433,
"ay": 697,
"orig": "펄 공격 — 손바닥 뻗어 밀치기 (날개 펼침)"
},
"land": {
"src": "art/h2/pearl/land.webp",
"w": 505,
"h": 705,
"ax": 338,
"ay": 702,
"orig": "착지 / 꼬깃꼬깃 — 발 구르며 내려앉기 (땅 깨짐 효과)"
},
"special": {
"src": "art/h2/pearl/special.webp",
"w": 665,
"h": 693,
"ax": 360,
"ay": 690,
"orig": "철 특수기 / 공격 — 뒤돌아 손 뻗어 검은 깃털 날리기 (깃털 효과 포함)"
},
"crouch": {
"src": "art/h2/pearl/crouch.webp",
"w": 340,
"h": 428,
"ax": 150,
"ay": 425,
"orig": "펄 앉기 — 쪼그려 앉아 자기 몸 감쌈 (겁먹음)"
},
"down": {
"src": "art/h2/pearl/down.webp",
"w": 579,
"h": 257,
"ax": 304,
"ay": 254,
"orig": "넘어짐 — 엎어져 아파함"
}
}
},
"rook": {
"slug": "rook",
"name": "룩 (창병)",
"rank": "1성",
"folder": "1성 룩 창병 흑인",
"role": "동료 (적 병사로도 가능)",
"tall": 1.85,
"weight": 120,
"palette": [
"#3b2a22",
"#8a8580",
"#242222",
"#b9b3ab",
"#141413"
],
"missing": [
"walk",
"hurt",
"dead (down 으로 대신)",
"throw(창 던지기)"
],
"kit": {
"basic": "창 찌르기 (attack) — 근접 2.5m",
"skills": [
{
"name": "방패 돌진",
"pose": "dash",
"desc": "5m 돌진, 부딪힌 적 넘어뜨림"
},
{
"name": "창벽",
"pose": "guard",
"desc": "앞 120도 화살 · 총알 막기, 다가오는 적에게 찌르기 반격"
},
{
"name": "땅 찌르기",
"pose": "low",
"desc": "쓰러진 적 · 작은 적에게 하단 공격 (확인사살)"
}
],
"passive": "대방패: 정면 원거리 피해 40% 감소"
},
"apt": {
"melee": 3,
"spear": 5,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "knight",
"role_job": "선봉",
"bag": 12,
"stats": {
"hp": 1100,
"atk": 30,
"spd": 4.5,
"weight_kg": 120,
"tall_m": 1.85
},
"portrait": "art/h2/rook/portrait.webp",
"face": "art/h2/rook/face.webp",
"poses": {
"idle": {
"src": "art/h2/rook/idle.webp",
"w": 505,
"h": 829,
"ax": 254,
"ay": 826,
"orig": "창 세워 들고 방패 들고 서 있음"
},
"attack": {
"src": "art/h2/rook/attack.webp",
"w": 1065,
"h": 591,
"ax": 384,
"ay": 588,
"orig": "방패 뒤에서 창 찌르기"
},
"guard": {
"src": "art/h2/rook/guard.webp",
"w": 880,
"h": 607,
"ax": 354,
"ay": 604,
"orig": "방패 앞세우고 창 겨눈 수비 자세"
},
"down": {
"src": "art/h2/rook/down.webp",
"w": 974,
"h": 543,
"ax": 513,
"ay": 540,
"orig": "뒤로 넘어짐 (창 · 방패 쥔 채, 먼지)"
},
"low": {
"src": "art/h2/rook/low.webp",
"w": 959,
"h": 597,
"ax": 497,
"ay": 594,
"orig": "창끝으로 땅 찍기 (하단 찌르기, 돌 파편)"
},
"dash": {
"src": "art/h2/rook/dash.webp",
"w": 965,
"h": 631,
"ax": 282,
"ay": 628,
"orig": "방패 들고 돌진 (창 겨눔, 흙먼지)"
}
}
},
"ryang": {
"slug": "ryang",
"name": "아량",
"rank": "보스",
"folder": "보스,강자들",
"role": "보스",
"tall": 2.8,
"weight": 120,
"palette": [
"#2f3647",
"#7f93af",
"#a7bad7",
"#bfcde6",
"#d0dcf1"
],
"missing": [
"walk(떠다니기)",
"hurt",
"down",
"dead",
"summon"
],
"kit": {
"basic": "유령 손 할퀴기 — 근접 2m",
"skills": [
{
"name": "유령 떼",
"pose": "attack",
"desc": "망토 속 유령 수십이 앞으로 8m 쏟아져 나감, 여러 번 맞음"
},
{
"name": "삼키는 망토",
"pose": "special",
"desc": "망토가 손 가득한 큰 입으로 벌어져 앞 5m 적을 붙잡아 끌어들임"
},
{
"name": "유령 소환",
"pose": "idle2",
"desc": "작은 유령 3마리 소환 (따로 그림 없음)"
}
],
"passive": "유령 몸: 물리 피해 30% 감소, 마법 · 빛에 약함, 떠 있어 함정 무시"
},
"apt": {
"melee": 2,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 2
},
"tag": "mage",
"role_job": "지휘",
"bag": 10,
"stats": {
"hp": 2800,
"atk": 70,
"spd": 3.5,
"weight_kg": 120,
"tall_m": 2.8
},
"portrait": "art/h2/ryang/portrait.webp",
"face": "art/h2/ryang/face.webp",
"poses": {
"idle": {
"src": "art/h2/ryang/idle.webp",
"w": 667,
"h": 700,
"ax": 318,
"ay": 697,
"orig": "서 있음 (정면, 유령 망토)"
},
"idle2": {
"src": "art/h2/ryang/idle2.webp",
"w": 636,
"h": 700,
"ax": 299,
"ay": 697,
"orig": "서 있음 (손 모음)"
},
"attack": {
"src": "art/h2/ryang/attack.webp",
"w": 1045,
"h": 667,
"ax": 337,
"ay": 664,
"orig": "유령 떼 내뿜기 (오른쪽으로)"
},
"special": {
"src": "art/h2/ryang/special.webp",
"w": 1054,
"h": 701,
"ax": 434,
"ay": 698,
"orig": "유령 손 아가리 (오른쪽 큰 입)"
}
}
},
"sanddalgi": {
"slug": "sanddalgi",
"name": "산딸기",
"rank": "3성 [대정령]",
"folder": "3성 [대정령] 산딸기",
"role": "동료 (식물 대정령 마법사, 딜 · 지원). 숲 지역 적 정령으로도 가능",
"tall": 1.75,
"weight": 58,
"palette": [
"#e8283c",
"#2a8592",
"#e6e6ea",
"#1c1e24",
"#4a3530"
],
"missing": [
"walk",
"hurt",
"dead",
"jump"
],
"kit": {
"basic": "수정잎 지팡이 찍기 (attack) — 앞 2m 지면 충격, 작은 넉백",
"skills": [
{
"name": "덩굴 속박",
"pose": "skill",
"desc": "앞 5m 지점에 덩굴을 솟게 해 반경 2m 적을 2초 묶고 지속 피해"
},
{
"name": "수정잎 방벽",
"pose": "guard",
"desc": "앞에 잎 방패를 세워 3초간 정면 피해 흡수 (아군도 뒤에 숨을 수 있음)"
},
{
"name": "정령의 손짓",
"pose": "cast",
"desc": "손을 뻗어 주변 아군 회복 + 이동 속도 증가 (딜서폿)"
}
],
"passive": "대정령의 숲: 흙 · 풀 바닥 위에서 마력 재생 +30%, 곁의 아군 체력 조금씩 회복"
},
"apt": {
"melee": 1,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 2
},
"tag": "mage",
"role_job": "지원",
"bag": 10,
"stats": {
"hp": 700,
"atk": 45,
"spd": 5,
"weight_kg": 58,
"tall_m": 1.75
},
"portrait": "art/h2/sanddalgi/portrait2.webp",
"face": "art/h2/sanddalgi/face3.webp",
"poses": {
"idle": {
"src": "art/h2/sanddalgi/idle.webp",
"w": 492,
"h": 700,
"ax": 257,
"ay": 697,
"orig": "서 있음 (지팡이)"
},
"cast": {
"src": "art/h2/sanddalgi/cast.webp",
"w": 573,
"h": 691,
"ax": 399,
"ay": 688,
"orig": "손 뻗어 주문"
},
"guard": {
"src": "art/h2/sanddalgi/guard.webp",
"w": 589,
"h": 605,
"ax": 258,
"ay": 602,
"orig": "수정잎 방패 (수호)"
},
"down": {
"src": "art/h2/sanddalgi/down.webp",
"w": 698,
"h": 383,
"ax": 342,
"ay": 380,
"orig": "옆으로 누움"
},
"attack": {
"src": "art/h2/sanddalgi/attack.webp",
"w": 540,
"h": 668,
"ax": 379,
"ay": 665,
"orig": "지팡이 내려찍기"
},
"skill": {
"src": "art/h2/sanddalgi/skill.webp",
"w": 547,
"h": 627,
"ax": 362,
"ay": 624,
"orig": "덩굴 소환"
}
}
},
"shedor": {
"slug": "shedor",
"name": "배신자 셰도르",
"rank": "일반 적 NPC",
"folder": "일반 적 NPC 배신자 셰도르",
"role": "적 (NPC)",
"tall": 1.85,
"weight": 80,
"palette": [
"#222029",
"#3c313c",
"#a33a28",
"#ada7ae",
"#e2e2e6"
],
"missing": [
"walk",
"hurt",
"down(dead 로 대신)"
],
"kit": {
"basic": "장검 베기 (attack) — 근접 2m",
"skills": [
{
"name": "배신의 일격",
"pose": "windup→attack",
"desc": "치켜들었다 크게 베기, 등 뒤에서 맞히면 2배"
},
{
"name": "겨눔",
"pose": "guard",
"desc": "앞 근접 공격 막기, 막으면 반격"
},
{
"name": "무릎 꿇는 척",
"pose": "crouch",
"desc": "피가 적으면 항복하는 척 무릎 꿇음 — 다가오면 기습 (이야기용)"
}
],
"passive": "웃는 가면: 대화 · 거래 중 속임수 (배신 이벤트)"
},
"apt": {
"melee": 4,
"spear": 1,
"bow": 1,
"gun": 0,
"magic": 0,
"stealth": 3
},
"tag": "soldier",
"role_job": "척후",
"bag": 10,
"stats": {
"hp": 320,
"atk": 24,
"spd": 6,
"weight_kg": 80,
"tall_m": 1.85
},
"portrait": "art/h2/shedor/portrait.webp",
"face": "art/h2/shedor/face.webp",
"poses": {
"idle": {
"src": "art/h2/shedor/idle.webp",
"w": 447,
"h": 700,
"ax": 219,
"ay": 697,
"orig": "서 있음 (장검 아래로)"
},
"attack": {
"src": "art/h2/shedor/attack.webp",
"w": 648,
"h": 657,
"ax": 331,
"ay": 654,
"orig": "장검 베기 (뒤로 휘두른 잔상)"
},
"windup": {
"src": "art/h2/shedor/windup.webp",
"w": 599,
"h": 700,
"ax": 350,
"ay": 697,
"orig": "장검 치켜들기 (왼손 앞으로)"
},
"guard": {
"src": "art/h2/shedor/guard.webp",
"w": 523,
"h": 511,
"ax": 195,
"ay": 508,
"orig": "두 손 장검 겨눔 (방어 자세)"
},
"crouch": {
"src": "art/h2/shedor/crouch.webp",
"w": 549,
"h": 536,
"ax": 200,
"ay": 533,
"orig": "무릎 꿇고 장검 땅에 꽂음"
},
"dead": {
"src": "art/h2/shedor/dead.webp",
"w": 650,
"h": 211,
"ax": 325,
"ay": 208,
"orig": "쓰러져 죽음 (머리 오른쪽)"
}
}
},
"sosucha": {
"slug": "sosucha",
"name": "소스차",
"rank": 4,
"folder": "4성 소스차",
"role": "동료 (적으로도 가능)",
"tall": 1.72,
"weight": 55,
"palette": [
"#160a1a",
"#40194a",
"#a646b1",
"#e576e9",
"#380a44"
],
"missing": [
"walk",
"run",
"hurt",
"dead",
"검 내려친 뒤 (slash 마무리)"
],
"kit": {
"basic": "정권 (attack)",
"skills": [
{
"name": "공중 옆차기",
"pose": "attack3",
"note": "짧은 도약 돌진 킥"
},
{
"name": "진각",
"pose": "attack2",
"note": "발밑 범위 충격"
},
{
"name": "영혼검",
"pose": "windup",
"note": "빛 검 소환 후 내려치기 (원래 맨손, 검은 마력으로 만듦)"
},
{
"name": "마젠타 불꽃",
"pose": "skill",
"note": "원거리 불꽃 탄"
}
],
"passive": "악마의 몸: 맨발 · 맨몸 — 이동 빠르고 회피 +15%, 방어구 못 입음"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 3
},
"tag": "brawler",
"role_job": "척후",
"bag": 8,
"stats": {
"hp": 100,
"atk": 19,
"spd": 1.25
},
"portrait": "art/h2/sosucha/portrait.webp",
"face": "art/h2/sosucha/face.webp",
"poses": {
"idle": {
"src": "art/h2/sosucha/idle.webp",
"w": 139,
"h": 702,
"ax": 55,
"ay": 699,
"orig": "왼쪽: 옆으로 선 기본"
},
"stand": {
"src": "art/h2/sosucha/stand.webp",
"w": 122,
"h": 698,
"ax": 59,
"ay": 695,
"orig": "옆으로 선 자세 (원화와 같은 그림, 왼쪽을 봐서 좌우 반전)"
},
"attack": {
"src": "art/h2/sosucha/attack.webp",
"w": 957,
"h": 609,
"ax": 415,
"ay": 606,
"orig": "오른쪽: 정권 지르기 (분홍 잔상)"
},
"attack2": {
"src": "art/h2/sosucha/attack2.webp",
"w": 581,
"h": 694,
"ax": 304,
"ay": 691,
"orig": "왼쪽: 발 구르기 (지면 분홍 폭발)"
},
"attack3": {
"src": "art/h2/sosucha/attack3.webp",
"w": 618,
"h": 570,
"ax": 140,
"ay": 567,
"orig": "오른쪽: 공중 옆차기 (분홍 궤적)"
},
"skill": {
"src": "art/h2/sosucha/skill.webp",
"w": 220,
"h": 716,
"ax": 91,
"ay": 713,
"orig": "손끝에 마젠타 불꽃"
},
"windup": {
"src": "art/h2/sosucha/windup.webp",
"w": 738,
"h": 580,
"ax": 299,
"ay": 577,
"orig": "왼쪽: 빛나는 검을 머리 위로 (내려치기 준비)"
},
"low": {
"src": "art/h2/sosucha/low.webp",
"w": 903,
"h": 305,
"ax": 740,
"ay": 302,
"orig": "오른쪽: 엎드려 검 휘두르기 (하단)"
},
"windup2": {
"src": "art/h2/sosucha/windup2.webp",
"w": 579,
"h": 580,
"ax": 301,
"ay": 577,
"orig": "왼쪽: 같은 자세 무기 없음 (두 손 모아 머리 위)"
},
"crawl": {
"src": "art/h2/sosucha/crawl.webp",
"w": 798,
"h": 293,
"ax": 391,
"ay": 290,
"orig": "오른쪽: 엎드려 기기 (무기 없음)"
}
}
},
"tanga": {
"slug": "tanga",
"name": "탕아",
"rank": "3성 [영웅]",
"folder": "3성 [영웅] 탕아",
"role": "동료 (용사 · 대검 근접 딜러)",
"tall": 1.85,
"weight": 85,
"palette": [
"#e8c46a",
"#3e8f9f",
"#16191d",
"#d6d8dc",
"#2a5560"
],
"missing": [
"walk",
"hurt",
"dead"
],
"kit": {
"basic": "대검 베기 (attack) — 앞 3m 부채꼴",
"skills": [
{
"name": "공중 참격",
"pose": "jump",
"desc": "뛰어올라 아래로 내려 베기, 착지 지점 반경 2m 피해 + 넘어뜨림"
},
{
"name": "갈고리 찌르기",
"pose": "attack2",
"desc": "앞 4m 찌르고 갈고리 끝으로 적을 앞으로 끌어옴"
},
{
"name": "일섬",
"pose": "windup",
"desc": "windup 으로 모았다가 attack3 로 앞 6m 일직선 관통 베기"
},
{
"name": "수비",
"pose": "guard",
"desc": "정면 피해 60% 감소, 막은 직후 반격 피해 +50%"
}
],
"passive": "용사의 기세: 적을 쓰러뜨릴 때마다 다음 공격 피해 +30% (최대 3번 쌓임)"
},
"apt": {
"melee": 5,
"spear": 2,
"bow": 1,
"gun": 0,
"magic": 0,
"stealth": 1
},
"tag": "knight",
"role_job": "선봉",
"bag": 10,
"stats": {
"hp": 1100,
"atk": 60,
"spd": 5.5,
"weight_kg": 85,
"tall_m": 1.85
},
"portrait": "art/h2/tanga/portrait2.webp",
"face": "art/h2/tanga/face2.webp",
"poses": {
"idle": {
"src": "art/h2/tanga/idle.webp",
"w": 452,
"h": 707,
"ax": 214,
"ay": 704,
"orig": "서 있음 (대검 끌기)"
},
"stand": {
"src": "art/h2/tanga/stand.webp",
"w": 347,
"h": 699,
"ax": 153,
"ay": 696,
"orig": "장검 들고 선 뒤 3/4 (다른 버전)"
},
"attack": {
"src": "art/h2/tanga/attack.webp",
"w": 611,
"h": 574,
"ax": 381,
"ay": 571,
"orig": "지상 참격"
},
"jump": {
"src": "art/h2/tanga/jump.webp",
"w": 543,
"h": 594,
"ax": 257,
"ay": 591,
"orig": "공중 참격"
},
"attack2": {
"src": "art/h2/tanga/attack2.webp",
"w": 756,
"h": 602,
"ax": 383,
"ay": 599,
"orig": "찌르기"
},
"guard": {
"src": "art/h2/tanga/guard.webp",
"w": 761,
"h": 518,
"ax": 287,
"ay": 515,
"orig": "수비"
},
"down": {
"src": "art/h2/tanga/down.webp",
"w": 630,
"h": 349,
"ax": 285,
"ay": 346,
"orig": "쓰러짐"
},
"windup": {
"src": "art/h2/tanga/windup.webp",
"w": 625,
"h": 520,
"ax": 299,
"ay": 517,
"orig": "검 낮춘 준비 자세"
},
"attack3": {
"src": "art/h2/tanga/attack3.webp",
"w": 744,
"h": 501,
"ax": 368,
"ay": 498,
"orig": "수평 찌르기 · 베기"
}
}
},
"tank": {
"slug": "tank",
"name": "중장 탱크",
"rank": "2성",
"folder": "2성 중장 탱크(SF)",
"role": "동료 (중장 방패 탱커)",
"tall": 2.05,
"weight": 140,
"palette": [
"#515050",
"#a3a1a2",
"#2d2d2d",
"#2fd6d0",
"#747374"
],
"missing": [
"walk",
"hurt",
"dead (down 으로 대신)",
"skill (SF 장비 쓰는 동작)"
],
"kit": {
"basic": "철퇴 치기 (attack) — 근접 1.8m, 느림",
"skills": [
{
"name": "내려찍기",
"pose": "windup→attack2",
"desc": "치켜든 철퇴로 앞 2m 원형 충격, 넘어뜨림"
},
{
"name": "다리 쓸기",
"pose": "low",
"desc": "낮게 쓸어 앞 120도 적 넘어뜨림"
},
{
"name": "강철 방벽",
"pose": "guard",
"desc": "피해 80% 막기, 주변 적 어그로 끌기"
}
],
"passive": "청록 바이저 (SF): 어둠 · 연기 속에서도 적 보임, 넘어짐 저항 +60%"
},
"apt": {
"melee": 3,
"spear": 1,
"bow": 0,
"gun": 1,
"magic": 0,
"stealth": 0
},
"tag": "knight",
"role_job": "선봉",
"bag": 14,
"stats": {
"hp": 520,
"atk": 22,
"spd": 3,
"weight_kg": 140,
"tall_m": 2.05
},
"portrait": "art/h2/tank/portrait.webp",
"face": "art/h2/tank/face.webp",
"poses": {
"idle": {
"src": "art/h2/tank/idle.webp",
"w": 484,
"h": 703,
"ax": 263,
"ay": 700,
"orig": "대기 (철퇴 아래로, 방패 왼팔)"
},
"attack": {
"src": "art/h2/tank/attack.webp",
"w": 602,
"h": 610,
"ax": 251,
"ay": 607,
"orig": "철퇴 아래로 휘둘러 치기"
},
"idle2": {
"src": "art/h2/tank/idle2.webp",
"w": 484,
"h": 666,
"ax": 265,
"ay": 663,
"orig": "대기 2"
},
"attack2": {
"src": "art/h2/tank/attack2.webp",
"w": 525,
"h": 690,
"ax": 263,
"ay": 687,
"orig": "철퇴 머리 위로 치켜들기 (내려찍기)"
},
"low": {
"src": "art/h2/tank/low.webp",
"w": 584,
"h": 475,
"ax": 291,
"ay": 472,
"orig": "몸 숙여 철퇴 낮게 쓸기 (하단 공격)"
},
"windup": {
"src": "art/h2/tank/windup.webp",
"w": 654,
"h": 442,
"ax": 264,
"ay": 439,
"orig": "방패 앞, 철퇴 뒤로 크게 젖힘 (공격 준비)"
},
"guard": {
"src": "art/h2/tank/guard.webp",
"w": 602,
"h": 552,
"ax": 291,
"ay": 549,
"orig": "수비 (방패 세우고 낮게 버팀)"
},
"down": {
"src": "art/h2/tank/down.webp",
"w": 615,
"h": 346,
"ax": 307,
"ay": 343,
"orig": "전복 — 뒤로 넘어져 주저앉음"
},
"front": {
"src": "art/h2/tank/front.webp",
"w": 458,
"h": 700,
"ax": 245,
"ay": 697,
"orig": "정면 서 있음 (원화와 같은 그림, 배율 따로 0.472)"
},
"dead": {
"src": "art/h2/tank/down.webp",
"w": 615,
"h": 346,
"ax": 307,
"ay": 343,
"orig": "죽음 그림 없음 — down 으로 대신"
}
}
},
"venti": {
"slug": "venti",
"name": "중장 벤티",
"rank": "2성",
"folder": "2정 중장 벤티",
"role": "동료 (적 병사로도 가능 — 둘 다)",
"tall": 1.78,
"weight": 95,
"palette": [
"#987550",
"#3d3126",
"#bb9a78",
"#55483b",
"#cfd0d4"
],
"missing": [
"hurt",
"run",
"skill (특수기 없음 — bash 로 대신)"
],
"kit": {
"basic": "한 손 검 찌르기 (attack) — 근접 1.8m",
"skills": [
{
"name": "방패 밀치기",
"pose": "bash",
"desc": "앞 1.5m 적 밀어내고 0.8초 휘청"
},
{
"name": "청동 벽",
"pose": "guard",
"desc": "앞 120도 피해 70% 막기, 막는 동안 느리게 걷기"
},
{
"name": "낮은 찌르기",
"pose": "windup→attack2",
"desc": "웅크렸다가 깊게 찔러 2.5m 돌진"
}
],
"passive": "중장갑: 넘어짐 (down) 저항 +50%, 화살 피해 -20%"
},
"apt": {
"melee": 4,
"spear": 2,
"bow": 1,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "knight",
"role_job": "선봉",
"bag": 12,
"stats": {
"hp": 380,
"atk": 20,
"spd": 5,
"weight_kg": 95,
"tall_m": 1.78
},
"portrait": "art/h2/venti/portrait.webp",
"face": "art/h2/venti/face.webp",
"poses": {
"idle": {
"src": "art/h2/venti/idle.webp",
"w": 392,
"h": 699,
"ax": 195,
"ay": 696,
"orig": "서 있음 (검 아래로, 방패 왼팔)"
},
"attack": {
"src": "art/h2/venti/attack.webp",
"w": 687,
"h": 647,
"ax": 258,
"ay": 644,
"orig": "한 손 검 찌르기 (앞으로 뻗음)"
},
"walk": {
"src": "art/h2/venti/walk.webp",
"w": 476,
"h": 656,
"ax": 200,
"ay": 653,
"orig": "방패 들고 성큼 나아감 (뒷발 딛고 앞발 듦)"
},
"bash": {
"src": "art/h2/venti/bash.webp",
"w": 686,
"h": 608,
"ax": 294,
"ay": 605,
"orig": "방패 앞으로 내밀어 밀치기 (검은 뒤로)"
},
"windup": {
"src": "art/h2/venti/windup.webp",
"w": 552,
"h": 517,
"ax": 278,
"ay": 514,
"orig": "낮게 웅크려 방패 앞, 검 뒤로 (공격 준비)"
},
"dead": {
"src": "art/h2/venti/dead.webp",
"w": 709,
"h": 234,
"ax": 354,
"ay": 231,
"orig": "엎어져 쓰러짐 (머리 오른쪽, 검 앞으로)"
},
"idle2": {
"src": "art/h2/venti/idle2.webp",
"w": 377,
"h": 638,
"ax": 190,
"ay": 635,
"orig": "서 있음 2 (어깨 펴고 검 아래로)"
},
"attack2": {
"src": "art/h2/venti/attack2.webp",
"w": 762,
"h": 579,
"ax": 280,
"ay": 576,
"orig": "방패 뒤에서 검 높이 찌르기 (깊은 런지)"
},
"guard": {
"src": "art/h2/venti/guard.webp",
"w": 598,
"h": 598,
"ax": 296,
"ay": 595,
"orig": "방패 방어 (낮게 버팀)"
},
"down": {
"src": "art/h2/venti/down.webp",
"w": 660,
"h": 342,
"ax": 330,
"ay": 339,
"orig": "뒤로 넘어짐 (등 대고 누움, 방패 위)"
},
"front": {
"src": "art/h2/venti/front.webp",
"w": 351,
"h": 700,
"ax": 178,
"ay": 697,
"orig": "정면 서 있음 (원화와 같은 그림, 배율 따로 0.469)"
}
}
},
"whistle": {
"slug": "whistle",
"name": "휘슬",
"rank": "1성",
"folder": "1성 휘슬",
"role": "동료",
"tall": 1.68,
"weight": 55,
"palette": [
"#d8283c",
"#1b1617",
"#f0c9be",
"#a01c30",
"#b8b8bc"
],
"missing": [
"hurt",
"down",
"dead",
"run",
"jump"
],
"kit": {
"basic": "장검 베기 (attack) — 근접 2m",
"skills": [
{
"name": "붉은 검기",
"pose": "attack",
"desc": "넓게 베며 붉은 궤적 — 앞 반원 3m"
},
{
"name": "수평 일섬",
"pose": "attack2",
"desc": "한 팔 찌르기로 4m 뻗음, 빠름"
},
{
"name": "도발",
"pose": "taunt",
"desc": "검 어깨에 걸치고 주변 적 끌기, 3초 회피 +30%"
}
],
"passive": "무심: 첫 공격은 항상 치명타 (전투 시작 · 은신 뒤)"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 3
},
"tag": "brawler",
"role_job": "척후",
"bag": 8,
"stats": {
"hp": 700,
"atk": 45,
"spd": 6.5,
"weight_kg": 55,
"tall_m": 1.68
},
"portrait": "art/h2/whistle/portrait.webp",
"face": "art/h2/whistle/face.webp",
"poses": {
"idle": {
"src": "art/h2/whistle/idle.webp",
"w": 345,
"h": 700,
"ax": 158,
"ay": 697,
"orig": "검 늘어뜨리고 서 있음 (비키니 · 붉은 망토 버전)"
},
"guard": {
"src": "art/h2/whistle/guard.webp",
"w": 587,
"h": 628,
"ax": 285,
"ay": 625,
"orig": "두 손으로 검 비스듬히 겨눔"
},
"attack": {
"src": "art/h2/whistle/attack.webp",
"w": 724,
"h": 599,
"ax": 402,
"ay": 596,
"orig": "크게 옆으로 베기 (붉은 검기 궤적 포함) — 원래 왼쪽을 봄"
},
"walk": {
"src": "art/h2/whistle/walk.webp",
"w": 354,
"h": 626,
"ax": 189,
"ay": 623,
"orig": "걸음 내딛으며 검 들고 감 (돌아서기)"
},
"attack2": {
"src": "art/h2/whistle/attack2.webp",
"w": 614,
"h": 417,
"ax": 361,
"ay": 414,
"orig": "수평 검격 — 한 팔로 검 곧게 뻗기 (크롭탑 · 반바지 버전) — 원래 왼쪽을 봄"
},
"taunt": {
"src": "art/h2/whistle/taunt.webp",
"w": 350,
"h": 711,
"ax": 176,
"ay": 708,
"orig": "검 어깨에 걸치고 허리에 손 (자신만만한 정면)"
},
"idle2": {
"src": "art/h2/whistle/idle2.webp",
"w": 317,
"h": 699,
"ax": 155,
"ay": 696,
"orig": "서 있음 (바디수트 · 붉은 망토 버전)"
},
"idle3": {
"src": "art/h2/whistle/idle3.webp",
"w": 370,
"h": 704,
"ax": 211,
"ay": 701,
"orig": "서 있음 — 원화 옷 (언더붑 재킷 · 끈 하의 · 사이하이 · 군화)"
}
}
},
"yuli": {
"slug": "yuli",
"name": "율리",
"rank": 4,
"folder": "4성 율리",
"role": "동료 (적으로도 가능)",
"tall": 1.85,
"weight": 72,
"palette": [
"#171816",
"#31322b",
"#49493d",
"#6b6a4a",
"#0b0b0b"
],
"missing": [
"walk",
"run",
"hurt",
"dead",
"knife attack (단검 찌르기)"
],
"kit": {
"basic": "그림자 탄 (attack)",
"skills": [
{
"name": "중력구",
"pose": "skill",
"note": "구에 적을 끌어모아 묶음"
},
{
"name": "그림자 분출",
"pose": "special",
"note": "발밑 범위 폭발 + 둔화"
},
{
"name": "그림자 벽",
"pose": "guard",
"note": "투사체 막기"
},
{
"name": "그림자 단검",
"pose": "ready",
"note": "근접 기습 (은신 연계)"
}
],
"passive": "얼굴 없는 자: 어둠 속에서 적에게 늦게 발견됨 (은신 보너스)"
},
"apt": {
"melee": 2,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 4
},
"tag": "mage",
"role_job": "지원",
"bag": 10,
"stats": {
"hp": 95,
"atk": 20,
"spd": 1.05
},
"portrait": "art/h2/yuli/portrait.webp",
"face": "art/h2/yuli/face.webp",
"poses": {
"idle": {
"src": "art/h2/yuli/idle.webp",
"w": 283,
"h": 701,
"ax": 145,
"ay": 698,
"orig": "기본 (한 손 주머니, 다른 손에 검은 연기)"
},
"ready": {
"src": "art/h2/yuli/ready.webp",
"w": 256,
"h": 700,
"ax": 131,
"ay": 697,
"orig": "단검을 쥔 대기"
},
"cast": {
"src": "art/h2/yuli/cast.webp",
"w": 391,
"h": 711,
"ax": 228,
"ay": 708,
"orig": "손바닥 위 올리브빛 그림자 소용돌이"
},
"windup": {
"src": "art/h2/yuli/windup.webp",
"w": 403,
"h": 688,
"ax": 184,
"ay": 685,
"orig": "왼쪽: 주먹에 그림자 모으기"
},
"attack": {
"src": "art/h2/yuli/attack.webp",
"w": 753,
"h": 619,
"ax": 305,
"ay": 616,
"orig": "오른쪽: 팔 뻗어 그림자 발사"
},
"special": {
"src": "art/h2/yuli/special.webp",
"w": 667,
"h": 425,
"ax": 386,
"ay": 422,
"orig": "왼쪽: 웅크려 땅에 손 — 그림자 폭발 (지면)"
},
"skill": {
"src": "art/h2/yuli/skill.webp",
"w": 718,
"h": 583,
"ax": 375,
"ay": 580,
"orig": "오른쪽: 두 손 사이 중력구 (검은 소용돌이 구)"
},
"guard": {
"src": "art/h2/yuli/guard.webp",
"w": 555,
"h": 599,
"ax": 313,
"ay": 596,
"orig": "왼쪽: 두 손으로 그림자 벽 (막기)"
},
"down": {
"src": "art/h2/yuli/down.webp",
"w": 770,
"h": 243,
"ax": 224,
"ay": 240,
"orig": "오른쪽: 쓰러짐 (손에 연기 남음)"
}
}
}
};
