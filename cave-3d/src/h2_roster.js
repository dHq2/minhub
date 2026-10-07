/* h2_roster.js — 자동 생성 (tools/h2_roster.py). 손으로 고치지 말 것: art/h2/notes/*.json을 고치고 다시 돌림 */
'use strict';
const H2R = {
"ahae": {
"slug": "ahae",
"name": "아해",
"rank": "4성",
"folder": "3기-2/4성 도깨비 아해",
"role": "동료 (4성 = 영입 가능한 동료로 봄. 도감에는 예전 묶음 '아해 · 적 · 보스' 가 있어 적 · 보스로도 쓸 수 있음 → 둘 다 가능)",
"tall": 1.75,
"weight": 62,
"palette": [
"#60c0d8",
"#181818",
"#c0c0c0",
"#909090",
"#d01818"
],
"missing": [
"dead (down 으로 대신)",
"guard (막기)",
"run",
"catch (돌아온 차크람 받기)",
"transform (변신 순간)"
],
"kit": {
"basic": "갈고리 검 베기 · 찌르기 (attack) — 근접 2.5m 앞 부채꼴 90도, 3타째는 낮게 쓸어베기 (attack2) 로 넘어뜨림",
"skills": [
{
"name": "차크람 던지기",
"pose": "throw",
"desc": "12m 줄 사격 — 차크람이 회전하며 날아가 줄 위 적을 모두 관통하고 끝에서 되돌아와 다시 한 번 벰 (돌아올 때 아해 손에 잡히면 재사용 대기 30% 감소). 대기 중엔 근접이 검만으로 바뀜 (throw2 · windup 으로 준비 동작)"
},
{
"name": "원념 소환",
"pose": "summon",
"desc": "소환 — 붉은 원념 (ahae_wraith) 1체를 앞 3m 에 12초 부름. 원념은 6m 까지 팔을 늘여 할퀴고 (attack) 적 하나를 붙잡아 1.5초 묶음 (attack2). 아해가 cast 로 가리키면 그 적에게 달려듦"
},
{
"name": "도약 내려치기",
"pose": "jump",
"desc": "도약 — 6m 앞 지점으로 뛰어올라 차크람을 내려침, 반지름 2.5m 원 피해 + 0.5초 경직. 쓰러진 적에게는 low 로 이어 확인사살 (피해 2배)"
},
{
"name": "각성 — 사슬낫",
"pose": "summon2",
"desc": "변신 — 붉은 원념을 몸에 둘러 ahae2 (각성 모드, 사슬낫) 로 20초 바뀜. 체력 50% 아래에서만 쓸 수 있음, 쓰면 체력 15% 회복"
}
],
"passive": "무기 바꿔 쥐기: 검 · 차크람 · 맨손을 그때그때 바꿔 쓰는 올라운더 — 같은 기술을 연달아 쓰지 않고 다른 무기 기술로 이으면 다음 공격 피해 +15% (최대 3겹)"
},
"apt": {
"melee": 4,
"spear": 2,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 2
},
"tag": "brawler",
"role_job": "선봉",
"bag": 10,
"stats": {
"hp": 900,
"atk": 32,
"spd": 6.2,
"weight_kg": 62,
"tall_m": 1.75
},
"desc": "하늘색 피부에 외뿔 하나, 검은 긴 머리의 4성 도깨비. 늘 담배를 물고 다니며 갈고리 검 · 차크람 · 맨손을 바꿔 쓰는 올라운더, 등 뒤로 붉은 원념을 부린다.",
"gen": 3,
"codex_g": "ahae",
"batch": "3기-2",
"portrait": "art/h2/ahae/portrait.webp",
"face": "art/h2/ahae/face.webp",
"poses": {
"idle": {
"src": "art/h2/ahae/idle.webp",
"w": 389,
"h": 699,
"ax": 245,
"ay": 696,
"orig": "서 있음 — 오른손에 갈고리 검 (끝이 낫처럼 굽은 외날 검)을 늘어뜨리고 왼손 뒤로 차크람, 담배를 입에 묾 (기본 무장 대기)",
"scale": 1.43
},
"idle2": {
"src": "art/h2/ahae/idle2.webp",
"w": 298,
"h": 706,
"ax": 211,
"ay": 703,
"orig": "서 있음 — 차크람만 들고 담배 피움 (검 없음)",
"scale": 1.35
},
"idle3": {
"src": "art/h2/ahae/idle3.webp",
"w": 341,
"h": 706,
"ax": 221,
"ay": 703,
"orig": "서 있음 — 큰 초승달 차크람을 늘어뜨리고 담배 피움",
"scale": 1.37
},
"smoke": {
"src": "art/h2/ahae/smoke.webp",
"w": 262,
"h": 709,
"ax": 102,
"ay": 706,
"orig": "맨손으로 서서 담배 피움 (무기 없는 평상 대기)",
"scale": 1.58
},
"walk": {
"src": "art/h2/ahae/walk.webp",
"w": 504,
"h": 672,
"ax": 371,
"ay": 669,
"orig": "걷기 — 검을 아래로, 차크람을 옆으로 든 채 성큼 걸음",
"scale": 1.35
},
"walk2": {
"src": "art/h2/ahae/walk2.webp",
"w": 506,
"h": 675,
"ax": 328,
"ay": 672,
"orig": "걷기 2 — 검 · 차크람 들고 걸음 (머리카락 휘날림)",
"scale": 1.43
},
"ready": {
"src": "art/h2/ahae/ready.webp",
"w": 623,
"h": 692,
"ax": 287,
"ay": 689,
"orig": "맨손 전투 자세 — 다리 넓게 벌리고 두 손 갈퀴처럼 폄",
"scale": 1.58
},
"ready2": {
"src": "art/h2/ahae/ready2.webp",
"w": 556,
"h": 592,
"ax": 304,
"ay": 589,
"orig": "맨손 자세 2 — 한쪽 다리 들어 옆걸음, 두 손 벌림 (피하기 · 옆걸음으로도)",
"scale": 1.58
},
"ready3": {
"src": "art/h2/ahae/ready3.webp",
"w": 523,
"h": 682,
"ax": 298,
"ay": 679,
"orig": "차크람 낮게 쥐고 다른 손 앞으로 뻗은 전투 자세",
"scale": 1.37
},
"cast": {
"src": "art/h2/ahae/cast.webp",
"w": 665,
"h": 694,
"ax": 426,
"ay": 691,
"orig": "뒷모습, 오른쪽으로 손바닥을 쭉 내밂 (장풍 · 원념 지시)",
"scale": 1.58
},
"attack": {
"src": "art/h2/ahae/attack.webp",
"w": 767,
"h": 568,
"ax": 371,
"ay": 565,
"orig": "검 찌르기 — 크게 벌린 자세로 갈고리 검을 앞으로 쭉 뻗음, 뒷손에 차크람",
"scale": 1.35
},
"attack2": {
"src": "art/h2/ahae/attack2.webp",
"w": 732,
"h": 559,
"ax": 333,
"ay": 556,
"orig": "검 낮게 쓸어베기 — 몸 숙여 다리 뻗고 검으로 바닥을 쓸며 휘두름 (궤적 선), 차크람은 위로",
"scale": 1.43
},
"attack3": {
"src": "art/h2/ahae/attack3.webp",
"w": 600,
"h": 600,
"ax": 275,
"ay": 597,
"orig": "차크람 휘두르기 — 큰 초승달 차크람을 옆으로 크게 벰 (궤적 선)",
"scale": 1.37
},
"attack4": {
"src": "art/h2/ahae/attack4.webp",
"w": 610,
"h": 416,
"ax": 374,
"ay": 413,
"orig": "낮게 뛰어들며 차크람으로 바닥 쓸기 (돌진 베기)",
"scale": 1.37
},
"throw": {
"src": "art/h2/ahae/throw.webp",
"w": 567,
"h": 574,
"ax": 273,
"ay": 571,
"orig": "뒷모습, 차크람 던지기 — 팔을 뻗었고 차크람이 돌며 날아감, 다른 손엔 검",
"scale": 1.35
},
"throw2": {
"src": "art/h2/ahae/throw2.webp",
"w": 591,
"h": 684,
"ax": 417,
"ay": 681,
"orig": "차크람 던지기 2 — 뒷모습, 손에서 막 떠난 차크람이 회전 (궤적)",
"scale": 1.43
},
"windup": {
"src": "art/h2/ahae/windup.webp",
"w": 431,
"h": 633,
"ax": 336,
"ay": 630,
"orig": "차크람을 머리 위로 치켜들고 검은 아래로 — 던지기 · 내려치기 준비",
"scale": 1.35
},
"low": {
"src": "art/h2/ahae/low.webp",
"w": 467,
"h": 540,
"ax": 253,
"ay": 537,
"orig": "몸을 숙여 검 끝으로 땅을 찍음 (검은 먹 튐) — 하단 공격 · 확인사살",
"scale": 1.35
},
"low2": {
"src": "art/h2/ahae/low2.webp",
"w": 571,
"h": 490,
"ax": 376,
"ay": 487,
"orig": "하단 찍기 2 — 무릎 굽혀 검으로 땅 찍기 (먹 튐), 차크람 뒤로",
"scale": 1.43
},
"kick": {
"src": "art/h2/ahae/kick.webp",
"w": 478,
"h": 645,
"ax": 233,
"ay": 642,
"orig": "담배 문 채 무릎 높이 들어 차기 (차크람 늘어뜨림)",
"scale": 1.37
},
"jump": {
"src": "art/h2/ahae/jump.webp",
"w": 548,
"h": 653,
"ax": 512,
"ay": 650,
"orig": "뛰어오르며 차크람을 머리 위로 치켜듦 (공중 내려치기)",
"scale": 1.37
},
"dash": {
"src": "art/h2/ahae/dash.webp",
"w": 569,
"h": 626,
"ax": 111,
"ay": 623,
"orig": "미끄러지며 멈춤 — 몸을 비틀어 검 · 차크람을 뒤로 감아 듦, 발밑 흙먼지",
"scale": 1.43
},
"summon": {
"src": "art/h2/ahae/summon.webp",
"w": 529,
"h": 591,
"ax": 136,
"ay": 588,
"orig": "원념 부르기 — 담배 든 채 앞을 손가락으로 가리킴, 등 뒤에서 붉은 원념이 갈퀴 손을 뻗음",
"scale": 1.58
},
"summon2": {
"src": "art/h2/ahae/summon2.webp",
"w": 561,
"h": 594,
"ax": 289,
"ay": 591,
"orig": "원념 부르기 2 — 낮은 자세로 손을 치켜듦, 뒤에서 붉은 원념의 두 팔",
"scale": 1.58
},
"summon3": {
"src": "art/h2/ahae/summon3.webp",
"w": 466,
"h": 674,
"ax": 216,
"ay": 671,
"orig": "차크람 치켜들고 검 쥔 채 자세, 등 뒤에 붉은 원념 (흰 눈) 이 일어남",
"scale": 1.43
},
"hurt": {
"src": "art/h2/ahae/hurt.webp",
"w": 367,
"h": 403,
"ax": 201,
"ay": 400,
"orig": "맞음 — 웅크려 앉아 한 손으로 머리 감쌈, 차크람 쥠",
"scale": 1.37
},
"down": {
"src": "art/h2/ahae/down.webp",
"w": 778,
"h": 350,
"ax": 455,
"ay": 347,
"orig": "쓰러짐 — 옆으로 누워 기댐, 차크람 · 검 쥔 채",
"flat": true,
"scale": 1.35
},
"down2": {
"src": "art/h2/ahae/down2.webp",
"w": 795,
"h": 337,
"ax": 387,
"ay": 334,
"orig": "쓰러짐 2 — 누운 채 차크람 쳐들고 검은 바닥에",
"flat": true,
"scale": 1.43
},
"down3": {
"src": "art/h2/ahae/down3.webp",
"w": 845,
"h": 393,
"ax": 375,
"ay": 390,
"orig": "쓰러짐 3 — 누운 채 큰 차크람을 치켜듦",
"flat": true,
"scale": 1.37
},
"sit": {
"src": "art/h2/ahae/sit.webp",
"w": 583,
"h": 412,
"ax": 330,
"ay": 409,
"orig": "바닥에 앉아 무릎 세우고 담배 (쉬기 · 진영 대기)",
"scale": 1.58
}
}
},
"ahae2": {
"slug": "ahae2",
"name": "아해 (각성 모드 · 사슬낫)",
"rank": "4성",
"folder": "3기-2/4성 도깨비 아해",
"role": "동료 (아해 변신 후)",
"tall": 1.75,
"weight": 62,
"palette": [
"#60c0d8",
"#181818",
"#c8c4bc",
"#808080",
"#d01818"
],
"missing": [
"walk",
"run",
"hurt",
"down",
"dead",
"guard",
"transform (변신 순간)"
],
"kit": {
"basic": "사슬낫 휘두르기 (attack · swing) — 앞 4.5m 부채꼴 120도, 붉은 궤적에 맞은 적 출혈 3초",
"skills": [
{
"name": "사슬 던져 끌어오기",
"pose": "throw",
"desc": "끌어오기 — 사슬낫을 앞 10m 줄로 던져 처음 맞은 적을 꽂고 pull 로 아해 앞 1.5m 까지 끌어옴 (큰 적 · 보스는 반대로 아해가 그쪽으로 당겨짐)"
},
{
"name": "휘감아 묶기",
"pose": "bind",
"desc": "사슬로 앞 6m 안 적 하나를 칭칭 감아 2초 묶음 (움직임 · 공격 불가), 풀릴 때 피해"
},
{
"name": "붉은 회전베기",
"pose": "spin",
"desc": "원 — 두 사슬낫을 몸 둘레로 돌려 반지름 4m 원 안 적에게 3번 연속 피해, 끝에 slam 으로 내려앉아 반지름 3m 충격"
},
{
"name": "원념 무리",
"pose": "summon",
"desc": "소환 — 여러 팔 달린 큰 붉은 원념을 불러 앞 5m 부채꼴을 2초간 할큄 (ahae_wraith 3체 효과)"
}
],
"passive": "각성: 변신 동안 공격 속도 +25%, 체력 흡수 10%. 20초가 지나거나 쓰러질 만큼 맞으면 ahae 로 돌아옴"
},
"apt": {
"melee": 5,
"spear": 3,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 1
},
"tag": "brawler",
"role_job": "선봉",
"bag": 10,
"stats": {
"hp": 1100,
"atk": 42,
"spd": 6.6,
"weight_kg": 62,
"tall_m": 1.75
},
"desc": "붉은 원념을 두른 아해의 각성 모습. 두 자루 사슬낫을 멀리 던져 적을 휘감아 끌어오고, 붉은 궤적으로 베어 낸다.",
"gen": 3,
"codex_g": "ahae",
"batch": "3기-2",
"portrait": "art/h2/ahae2/portrait.webp",
"face": "art/h2/ahae2/face.webp",
"poses": {
"idle": {
"src": "art/h2/ahae2/idle.webp",
"w": 480,
"h": 702,
"ax": 227,
"ay": 699,
"orig": "서 있음 — 두 손에 사슬낫 (낫 날 끝이 붉게 물듦) 늘어뜨림",
"scale": 1.58
},
"idle2": {
"src": "art/h2/ahae2/idle2.webp",
"w": 451,
"h": 706,
"ax": 232,
"ay": 703,
"orig": "서 있음 2 — 두 손에 사슬낫, 사슬 길게 늘어뜨림",
"scale": 1.47
},
"front": {
"src": "art/h2/ahae2/front.webp",
"w": 470,
"h": 691,
"ax": 226,
"ay": 688,
"orig": "정면으로 다리 벌리고 사슬낫 두 자루 들고 섬",
"scale": 1.47
},
"ready": {
"src": "art/h2/ahae2/ready.webp",
"w": 512,
"h": 619,
"ax": 225,
"ay": 616,
"orig": "사슬낫 하나 치켜들고 사슬을 몸에 감듯 늘인 전투 자세",
"scale": 1.47
},
"ready2": {
"src": "art/h2/ahae2/ready2.webp",
"w": 621,
"h": 596,
"ax": 284,
"ay": 593,
"orig": "낮게 다리 벌린 자세, 두 손의 사슬낫 (붉은 날)",
"scale": 1.58
},
"throw": {
"src": "art/h2/ahae2/throw.webp",
"w": 1110,
"h": 679,
"ax": 238,
"ay": 676,
"orig": "뒷모습, 사슬낫을 멀리 던짐 — 팔 뻗고 사슬이 쭉 뻗어 낫이 끝에 (긴 사거리)",
"scale": 1.47
},
"throw2": {
"src": "art/h2/ahae2/throw2.webp",
"w": 891,
"h": 618,
"ax": 278,
"ay": 615,
"orig": "사슬낫 던지기 2 — 사슬을 앞으로 뿌리고 붉은 기운이 튐",
"scale": 1.58
},
"swing": {
"src": "art/h2/ahae2/swing.webp",
"w": 550,
"h": 554,
"ax": 246,
"ay": 551,
"orig": "사슬을 당겨 낫을 옆으로 크게 휘돌림 (궤적 선)",
"scale": 1.47
},
"attack": {
"src": "art/h2/ahae2/attack.webp",
"w": 812,
"h": 564,
"ax": 246,
"ay": 561,
"orig": "사슬낫 휘두르기 — 몸을 틀어 사슬을 크게 돌림, 붉은 궤적",
"scale": 1.58
},
"slash": {
"src": "art/h2/ahae2/slash.webp",
"w": 562,
"h": 557,
"ax": 291,
"ay": 554,
"orig": "낮게 웅크려 사슬낫으로 둥글게 베기, 붉은 베기 궤적",
"scale": 1.47
},
"spin": {
"src": "art/h2/ahae2/spin.webp",
"w": 803,
"h": 469,
"ax": 473,
"ay": 466,
"orig": "웅크려 두 사슬낫을 몸 둘레로 돌림 — 붉은 원형 궤적 (회전 베기)",
"scale": 1.58
},
"dash": {
"src": "art/h2/ahae2/dash.webp",
"w": 818,
"h": 586,
"ax": 395,
"ay": 583,
"orig": "앞으로 몸을 날려 뛰어듦 (한 손 바닥 짚음), 머리 위로 사슬낫 붉은 큰 호",
"scale": 1.58
},
"pull": {
"src": "art/h2/ahae2/pull.webp",
"w": 663,
"h": 591,
"ax": 470,
"ay": 588,
"orig": "뒤로 몸을 젖혀 사슬을 끌어당김 — 사슬 끝 두 낫이 앞쪽 (끌어오기)",
"scale": 1.47
},
"bind": {
"src": "art/h2/ahae2/bind.webp",
"w": 687,
"h": 679,
"ax": 340,
"ay": 676,
"orig": "뒷모습, 사슬로 나무 기둥 (적 대신) 을 칭칭 감고 당김, 붉은 충격 선 (휘감기)",
"scale": 1.58
},
"slam": {
"src": "art/h2/ahae2/slam.webp",
"w": 781,
"h": 653,
"ax": 376,
"ay": 650,
"orig": "내려앉으며 한 무릎 · 발 쾅, 두 사슬낫을 양옆으로 펼침, 바닥 파편",
"scale": 1.58
},
"summon": {
"src": "art/h2/ahae2/summon.webp",
"w": 628,
"h": 710,
"ax": 287,
"ay": 707,
"orig": "여러 팔 달린 큰 붉은 원념 무리를 불러냄 — 한 손 뻗음, 다른 손 사슬낫",
"scale": 1.47
}
}
},
"ahae_wraith": {
"slug": "ahae_wraith",
"name": "아해의 원념 (붉은 원념 유령)",
"rank": "4성",
"folder": "3기-2/4성 도깨비 아해",
"role": "소환수 (아해 편)",
"tall": 1.6,
"weight": 0,
"palette": [
"#d80000",
"#a80000",
"#180000",
"#000000",
"#f0f0f0"
],
"missing": [
"appear (소환 연출)",
"dead (흩어짐)",
"dash (기본아해.png 맨 아랫줄 2번 — 작아서 안 자름)"
],
"kit": {
"basic": "팔 늘여 할퀴기 (attack) — 앞 6m 줄",
"skills": [
{
"name": "움켜쥐기",
"pose": "attack2",
"desc": "끌어오기 — 두 팔로 앞 4m 안 적 하나를 붙잡아 1.5초 묶고 원념 쪽으로 2m 끌어옴"
}
],
"passive": "원념: 12초 뒤 사라짐. 물리 피해 50% 덜 받음 (몸이 기운이라), 아해가 쓰러지면 함께 사라짐"
},
"apt": {
"melee": 4,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 2
},
"tag": "beast",
"role_job": "선봉",
"bag": 0,
"stats": {
"hp": 250,
"atk": 22,
"spd": 5.0,
"weight_kg": 0,
"tall_m": 1.6
},
"desc": "얼굴 없는 붉은 머리에 길게 늘어나는 갈퀴 팔, 아래는 검은 연기 꼬리로 떠다니는 아해의 원념. 주인처럼 담배를 문다.",
"gen": 3,
"codex_g": "ahae",
"batch": "3기-2",
"portrait": "art/h2/ahae_wraith/portrait.webp",
"face": "art/h2/ahae_wraith/face.webp",
"poses": {
"idle": {
"src": "art/h2/ahae_wraith/idle.webp",
"w": 625,
"h": 651,
"ax": 284,
"ay": 648,
"orig": "똬리 튼 꼬리로 떠 있음, 한 손 갈퀴 들고 다른 손으로 담배 (얼굴 없는 붉은 머리)",
"scale": 1.35
},
"attack": {
"src": "art/h2/ahae_wraith/attack.webp",
"w": 1303,
"h": 589,
"ax": 325,
"ay": 586,
"orig": "몸을 길게 늘여 앞으로 팔을 쭉 뻗어 할큄 (긴 사거리 손)",
"scale": 1.35
},
"hurt": {
"src": "art/h2/ahae_wraith/hurt.webp",
"w": 752,
"h": 649,
"ax": 383,
"ay": 646,
"orig": "몸을 말아 웅크리고 두 손으로 머리를 감쌈 (괴로워함 · 맞음)",
"scale": 1.35
},
"attack2": {
"src": "art/h2/ahae_wraith/attack2.webp",
"w": 1152,
"h": 662,
"ax": 418,
"ay": 659,
"orig": "두 팔 갈퀴를 앞으로 뻗어 움켜쥐기 (붙잡기)",
"scale": 1.35
}
}
},
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
},
"idle_b": {
"src": "art/h2/ancientangel/idle_b.webp",
"w": 620,
"h": 704,
"ax": 460,
"ay": 701,
"orig": "날개 접어 몸 뒤로 두르고 곧게 섬 (두 손 갈퀴 늘어뜨림)",
"scale": 0.885
},
"attack": {
"src": "art/h2/ancientangel/attack.webp",
"w": 1045,
"h": 607,
"ax": 458,
"ay": 604,
"orig": "다리 넓게 벌리고 오른 날개를 앞으로 쭉 뻗어 날개 끝 갈퀴 손으로 낚아채기",
"scale": 0.885
}
}
},
"ancientdeer": {
"slug": "ancientdeer",
"name": "고대사슴",
"rank": "5성 이상",
"folder": "3기-2/고대사슴 5성이상",
"role": "동료 (5성 이상 = 높은 등급 동료로 봄. 덩치 큰 괴수라 적 · 보스로도 쓸 수 있음 → 둘 다 가능)",
"tall": 4.0,
"weight": 3000,
"palette": [
"#2a2a2c",
"#525152",
"#080a0b",
"#40d8d0",
"#a040c0"
],
"missing": [
"walk",
"run",
"hurt",
"down",
"dead",
"back",
"roar (포효)"
],
"kit": {
"basic": "앞발 할퀴기 (attack) — 뒷발로 서서 앞 4.5m 부채꼴 90도, 넘어뜨림",
"skills": [
{
"name": "가시뿔 돌진",
"pose": "dash",
"desc": "돌진 — windup 으로 0.6초 준비 뒤 12m 직선 돌진, 부딪힌 적 모두 넘어뜨리고 3m 밀어냄, 벽에 박으면 자기도 1초 멈춤"
},
{
"name": "대지 짓밟기",
"pose": "slam",
"desc": "뒷발로 일어서 앞발로 내려찍기 — 반지름 6m 원 피해 + 1초 기절, 그 자리에 가시 뿌리 장판 4초 (밟은 적 이동 -40%)"
},
{
"name": "뿔 방벽",
"pose": "low",
"desc": "막기 — 3초 동안 머리를 낮춰 뿔을 앞세움, 정면 150도 피해 60% 감소, 그 사이 다가온 근접 적은 가시 반격 (공격력 50%)"
}
],
"passive": "고대의 가시: 받은 근접 피해 15% 되돌림. 체력 50% 아래면 청록 · 보라 맥이 밝게 빛나며 공격 +20%. 덩치가 커서 배낭 대신 짐 싣기 (bag 칸 큼)"
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
"bag": 20,
"stats": {
"hp": 4000,
"atk": 90,
"spd": 6.5,
"weight_kg": 3000,
"tall_m": 4.0
},
"desc": "돌 비늘 갑각과 나뭇가지처럼 갈라진 검은 가시 뿔 · 등 가시를 가진 고대 사슴 괴수 (5성 이상). 몸에 청록 · 보라 빛 맥이 흐르고, 뒷발로 일어서 거대한 앞발로 내려찍는다.",
"gen": 3,
"codex_g": "coraldeer",
"batch": "3기-2",
"portrait": "art/h2/ancientdeer/portrait.webp",
"face": "art/h2/ancientdeer/face.webp",
"poses": {
"idle": {
"src": "art/h2/ancientdeer/idle.webp",
"w": 594,
"h": 739,
"ax": 305,
"ay": 736,
"orig": "네 발로 서서 목을 높이 세움, 나뭇가지 같은 검은 가시 뿔 · 등 가시, 청록 · 보라 빛 맥",
"scale": 1.6
},
"windup": {
"src": "art/h2/ancientdeer/windup.webp",
"w": 661,
"h": 514,
"ax": 323,
"ay": 511,
"orig": "머리를 낮추고 앞발을 벌려 돌진 준비",
"scale": 1.6
},
"dash": {
"src": "art/h2/ancientdeer/dash.webp",
"w": 800,
"h": 574,
"ax": 368,
"ay": 571,
"orig": "앞으로 몸을 날려 도약 돌진 (네 다리 뻗음)",
"scale": 1.6
},
"slam": {
"src": "art/h2/ancientdeer/slam.webp",
"w": 498,
"h": 755,
"ax": 176,
"ay": 752,
"orig": "뒷발로 일어서서 거대한 앞발 주먹을 높이 듦 (내려찍기 직전)",
"scale": 1.6
},
"low": {
"src": "art/h2/ancientdeer/low.webp",
"w": 637,
"h": 486,
"ax": 369,
"ay": 483,
"orig": "몸을 낮추고 뿔 · 가시를 앞으로 세워 노려봄 (뿔 방벽)",
"scale": 1.6
},
"front": {
"src": "art/h2/ancientdeer/front.webp",
"w": 578,
"h": 781,
"ax": 319,
"ay": 778,
"orig": "앞모습으로 목을 세우고 서 있음",
"scale": 1.6
},
"attack": {
"src": "art/h2/ancientdeer/attack.webp",
"w": 664,
"h": 688,
"ax": 335,
"ay": 685,
"orig": "뒷발로 서서 앞발을 앞으로 크게 휘둘러 할큄",
"scale": 1.6
},
"crouch": {
"src": "art/h2/ancientdeer/crouch.webp",
"w": 605,
"h": 528,
"ax": 350,
"ay": 525,
"orig": "낮게 웅크려 머리를 앞으로 내밀고 다가감 (사냥 자세)",
"scale": 1.6
}
}
},
"arkam": {
"slug": "arkam",
"name": "아컴",
"rank": "장군 (성계장군 — 시트 파일 이름 '성계 장군 아컴 보스 시트')",
"folder": "창병B",
"role": "보스 (성계 장군 — 시트 이름에 '보스'. 폴더는 '창병B' 지만 그림은 낫창 든 장군이라 보스로 봄. 암계 장군 흑익 · 하류와 맞서는 쪽 장군일 수 있음)",
"tall": 2.3,
"weight": 110,
"palette": [
"#14161c",
"#232c44",
"#2f4f8a",
"#4a6fb0",
"#3fe0d0"
],
"missing": [
"back",
"walk",
"guard",
"hurt",
"down",
"dead",
"sweep (낫 휘둘러 베기)"
],
"kit": {
"basic": "낫창 찌르기 (attack) — 앞 4m 줄 (폭 0.8m)",
"skills": [
{
"name": "초승 베기",
"pose": "attack",
"desc": "낫날로 앞 4.5m 부채꼴 160도 크게 휘둘러 베기 + 낫으로 걸어 1.5m 끌어오기"
},
{
"name": "성계 돌진",
"pose": "attack",
"desc": "7m 돌진 찌르기, 줄 위 적 관통 + 넘어뜨림 1초"
},
{
"name": "별의 창벽",
"pose": "idle",
"desc": "낫창을 땅에 세워 3초 막기: 앞 140도 원거리 막기, 다가오는 적에게 자동 찌르기 반격 (4m)"
}
],
"passive": "긴 팔: 공격 거리 +1m, 3m 밖 적에게 주는 피해 +15% (가까이 붙으면 약함)"
},
"apt": {
"melee": 3,
"spear": 5,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 1
},
"tag": "knight",
"role_job": "지휘",
"bag": 10,
"stats": {
"hp": 3800,
"atk": 74,
"spd": 5.2,
"weight_kg": 110,
"tall_m": 2.3
},
"desc": "뾰족 뿔 투구에 청록 눈빛, 검푸른 갑옷과 해진 파란 코트를 두른 성계의 장군. 초승달 낫이 달린 긴 창으로 멀리서 베고 걸어 당긴다.",
"gen": 3,
"portrait": "art/h2/arkam/portrait.webp",
"face": "art/h2/arkam/face.webp",
"poses": {
"idle": {
"src": "art/h2/arkam/idle.webp",
"w": 304,
"h": 702,
"ax": 143,
"ay": 699,
"orig": "옆모습 (오른쪽 봄): 긴 낫창 (끝이 초승달 낫) 을 세워 쥐고 섬",
"scale": 0.84
},
"front": {
"src": "art/h2/arkam/front.webp",
"w": 382,
"h": 716,
"ax": 202,
"ay": 713,
"orig": "3/4 앞모습: 뾰족 뿔 투구 (청록 눈빛), 검푸른 갑옷 + 해진 파란 긴 코트 (허리띠 · 버클), 길쭉한 몸",
"scale": 0.84
},
"attack": {
"src": "art/h2/arkam/attack.webp",
"w": 763,
"h": 524,
"ax": 277,
"ay": 521,
"orig": "낮게 벌려 서서 낫창을 앞으로 길게 찌름 (끈 장식 휘날림, 코트 펄럭)",
"scale": 0.84
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
"orig": "쌍권총 들고 서 있음",
"scale": 0.73
},
"shoot": {
"src": "art/h2/bel/shoot.webp",
"w": 599,
"h": 624,
"ax": 318,
"ay": 621,
"orig": "두 팔 뻗어 쌍권총 사격 (총구 불꽃)",
"scale": 0.73
},
"crouch": {
"src": "art/h2/bel/crouch.webp",
"w": 569,
"h": 550,
"ax": 358,
"ay": 547,
"orig": "쪼그려 앉아 한 총은 뒤, 한 총은 위로",
"scale": 0.73
},
"down": {
"src": "art/h2/bel/down.webp",
"w": 639,
"h": 429,
"ax": 337,
"ay": 426,
"orig": "바닥에 주저앉아 총 겨눔 (넘어짐)",
"flat": true,
"scale": 0.73
},
"low": {
"src": "art/h2/bel/low.webp",
"w": 564,
"h": 538,
"ax": 204,
"ay": 535,
"orig": "무릎 꿇듯 낮게 앉아 아래로 사격 (탄피 · 불꽃)",
"scale": 0.73
},
"jump": {
"src": "art/h2/bel/jump.webp",
"w": 623,
"h": 610,
"ax": 330,
"ay": 607,
"orig": "공중에서 쌍권총 사격",
"scale": 0.73
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
"orig": "죽음 (옆으로 누움, 눈 감음 — 쉼 · 넘어짐 겸용)",
"flat": true
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
"orig": "확인사살 · 내려찍기 (불꽃 주먹으로 땅 내려치기, 폭발 · 돌)",
"f": -1
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
"orig": "쉼 — 따로 그림 없음, 죽음 그림 겸용",
"flat": true
},
"down": {
"src": "art/h2/bishot/dead.webp",
"w": 840,
"h": 336,
"ax": 420,
"ay": 333,
"orig": "넘어짐 — 따로 그림 없음, 죽음 그림 겸용",
"flat": true
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
"orig": "내려찍기 — 확인사살 그림 겸용",
"f": -1
}
}
},
"blackrabbit": {
"slug": "blackrabbit",
"name": "흑토끼기사",
"rank": "1기 펫 · NPC (등급 글자 없음 — 파일 이름 '흑토끼', 도감: 펫 · 전설)",
"folder": "3기-2 (흑토끼.png)",
"role": "동료 (도감에서 인카운터 유물 펫 '흑토끼기사' — 소환 동료 · 펫. 검은 기사 모습이라 적 정예로도 가능)",
"tall": 1.75,
"weight": 85,
"palette": [
"#121211",
"#21201f",
"#3d3837",
"#564e4c",
"#e0203c",
"#d9d6d4"
],
"missing": [
"hurt",
"down",
"dead",
"dash"
],
"kit": {
"basic": "대검 찌르기 (attack) — 앞 3.5m 줄, 붉은 날로 관통",
"skills": [
{
"name": "내리쪼개기",
"pose": "windup",
"desc": "0.5초 대검을 머리 위로 들었다가 앞 4m 줄로 내려침 — 피해 2.5배, 넘어뜨림"
},
{
"name": "토끼 도약",
"pose": "plunge",
"desc": "6m 앞으로 뛰어올라 칼끝으로 내리꽂음 — 떨어진 자리 반지름 2m 원 피해 + 0.8초 기절"
},
{
"name": "붉은 검 꽂기",
"pose": "guard",
"desc": "대검을 땅에 꽂고 버팀 — 2초 동안 앞 막기 (피해 70% 감소), 끝날 때 반지름 2.5m 원 붉은 충격"
},
{
"name": "도발",
"pose": "front",
"desc": "손짓으로 반지름 8m 적을 4초 동안 자기에게 끌어 붙임 (어그로)"
}
],
"passive": "흑토끼의 충성: 주인 (플레이어) 이 맞으면 다음 공격 피해 +25%, 주인 체력 30% 아래면 이동 속도 +20%"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 1,
"stealth": 2
},
"tag": "knight",
"role_job": "선봉",
"bag": 6,
"stats": {
"hp": 1250,
"atk": 36,
"spd": 4.8,
"weight_kg": 85,
"tall_m": 1.75
},
"desc": "검은 토끼 귀 투구 · 찢긴 검은 판금 치마 갑옷 · 긴 흑발의 여기사. 붉게 빛나는 날의 대검을 어깨에 메고 다닌다. 얼굴은 머리칼 그늘에 가려 붉은 눈만 보인다.",
"gen": 1,
"codex_g": "blackrabbit",
"batch": "3기-2",
"portrait": "art/h2/blackrabbit/portrait.webp",
"face": "art/h2/blackrabbit/face.webp",
"poses": {
"idle": {
"src": "art/h2/blackrabbit/idle.webp",
"w": 666,
"h": 698,
"ax": 229,
"ay": 695,
"orig": "붉은 날 대검을 어깨에 메고 서 있음 (칼끝 오른쪽)",
"scale": 1.6
},
"walk": {
"src": "art/h2/blackrabbit/walk.webp",
"w": 704,
"h": 614,
"ax": 475,
"ay": 611,
"orig": "대검을 앞으로 비스듬히 늘어뜨리고 오른쪽으로 걸음",
"scale": 1.6
},
"windup": {
"src": "art/h2/blackrabbit/windup.webp",
"w": 459,
"h": 768,
"ax": 262,
"ay": 765,
"orig": "다리를 벌리고 대검을 두 손으로 머리 위로 높이 치켜듦",
"scale": 1.6
},
"attack": {
"src": "art/h2/blackrabbit/attack.webp",
"w": 690,
"h": 491,
"ax": 301,
"ay": 488,
"orig": "깊게 내딛으며 대검을 오른쪽으로 수평 찌르기 · 베기",
"scale": 1.6
},
"front": {
"src": "art/h2/blackrabbit/front.webp",
"w": 507,
"h": 696,
"ax": 223,
"ay": 693,
"orig": "앞모습, 대검을 아래로 늘어뜨리고 왼손을 갈퀴처럼 뻗음 (도발)",
"scale": 1.6
},
"plunge": {
"src": "art/h2/blackrabbit/plunge.webp",
"w": 357,
"h": 646,
"ax": 312,
"ay": 643,
"orig": "공중에서 몸을 웅크리고 대검 끝을 아래로 (도약 내리꽂기)",
"scale": 1.6
},
"guard": {
"src": "art/h2/blackrabbit/guard.webp",
"w": 400,
"h": 704,
"ax": 231,
"ay": 701,
"orig": "대검을 땅에 꽂고 손잡이에 기대 섬 (반쯤 등을 보임)",
"scale": 1.6
},
"back": {
"src": "art/h2/blackrabbit/back.webp",
"w": 498,
"h": 722,
"ax": 265,
"ay": 719,
"orig": "뒷모습, 대검을 어깨에 멤 (칼끝 왼쪽)",
"scale": 1.6
}
}
},
"blueflame": {
"slug": "blueflame",
"name": "푸른불꽃",
"rank": "미상 (폴더 이름 '푸른불꽃' 에 등급 글자 없음)",
"folder": "푸른불꽃",
"role": "둘 다 (토끼 가면의 쇠사슬 · 철사 고리 사냥꾼 — 적 강자로 먼저 나오고 영입 가능. 원본 참고 캡처가 만화 장면이라 이야기 인물로 봄)",
"tall": 1.95,
"weight": 72,
"palette": [
"#1e1e20",
"#3a3a3c",
"#b9b9b7",
"#e2e2e0",
"#3fd9d0"
],
"missing": [
"back",
"walk",
"hurt",
"down",
"dead",
"skill (푸른 불꽃 효과 — 이름의 근원, 그림에는 눈빛만 청록)"
],
"kit": {
"basic": "갈퀴 손 할퀴기 (idle) — 앞 2m 부채꼴, 빠름 (0.5초)",
"skills": [
{
"name": "철사 올가미",
"pose": "attack",
"desc": "앞 8m 줄로 고리를 던짐: 처음 맞은 적을 내 앞 1.5m 까지 끌어오기 + 묶기 1초"
},
{
"name": "푸른 불꽃",
"pose": "attack",
"desc": "고리에 청록 불을 붙여 휘두름: 앞 4m 부채꼴 120도 불 피해 + 화상 4초 (매초 피해)"
},
{
"name": "그림자 걸음",
"pose": "idle",
"desc": "몸을 숙여 5m 순간 돌진 (적 뒤로 지나감), 다음 할퀴기 피해 2배"
}
],
"passive": "사냥꾼의 눈: 끌어오거나 묶인 적에게 주는 피해 +20%, 화상 걸린 적의 위치가 벽 너머로 보임"
},
"apt": {
"melee": 4,
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
"hp": 900,
"atk": 44,
"spd": 6.8,
"weight_kg": 72,
"tall_m": 1.95
},
"desc": "회색 토끼 해골 가면에 청록 눈빛, 해진 긴 코트를 입은 사냥꾼. 철사 고리로 적을 끌어와 푸른 불꽃으로 태운다.",
"gen": 3,
"portrait": "art/h2/blueflame/portrait.webp",
"face": "art/h2/blueflame/face.webp",
"poses": {
"idle": {
"src": "art/h2/blueflame/idle.webp",
"w": 350,
"h": 702,
"ax": 181,
"ay": 699,
"orig": "옆모습 (오른쪽 봄): 등 굽히고 긴 갈퀴 손 늘어뜨림, 해진 긴 코트",
"scale": 0.92
},
"front": {
"src": "art/h2/blueflame/front.webp",
"w": 394,
"h": 784,
"ax": 199,
"ay": 781,
"orig": "3/4 앞모습: 한 손 주머니, 회색 토끼 해골 가면 (청록 눈빛, 이빨 마스크), 흰 티 · 검은 바지 · 군화",
"scale": 0.92
},
"attack": {
"src": "art/h2/blueflame/attack.webp",
"w": 666,
"h": 670,
"ax": 350,
"ay": 667,
"orig": "다리 벌려 한 손을 앞으로 휘둘러 철사 · 채찍 고리를 던짐 (올가미)",
"scale": 0.92
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
"orig": "넘어짐 (눈 감음)",
"flat": true
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
"orig": "차리 넘어짐",
"flat": true
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
"collider": {
"slug": "collider",
"name": "콜라이더",
"rank": "5성",
"folder": "3기-2/5성 서폿 마계 앰버서터 콜라이더 (+ 콜라이더2)",
"role": "동료 (5성 = 높은 등급 동료, 파일 이름 \"서폿\" → 지원형. 마계 앰버서더 = 마계 쪽 대사라 마족 적과 엮이는 이야기에 씀)",
"tall": 1.8,
"weight": 58,
"palette": [
"#2e2a3a",
"#e5e6eb",
"#4c485b",
"#1a1820",
"#f7f3ea"
],
"missing": [
"walk (run 으로 대신)",
"down",
"dead",
"attack2 (꼬리 두 번째 휘두르기)",
"idle (코트 차림 옆모습 — 코트 차림은 front 뿐)"
],
"kit": {
"basic": "갈퀴 꼬리 채찍 (attack) — 앞 4m 부채꼴 100도, 2타 (두 번째는 검은 파편이 튀어 0.5초 경직)",
"skills": [
{
"name": "차원 문",
"pose": "cast2",
"desc": "소환 · 끌어오기 — 앞 4m 에 검은 소용돌이 문을 8초 엶. 반지름 4m 안 적을 1초마다 1.5m 씩 문 쪽으로 끌어오고, 문에 닿은 적 투사체는 사라짐. 다시 쓰면 아군 1명을 문 앞으로 순간이동 (15m 안)"
},
{
"name": "별빛 지목",
"pose": "shoot",
"desc": "사격 — 15m 단일 대상에게 가시 덩굴 끝 별 표식, 6초 동안 그 적이 받는 피해 +20% (모든 아군), 처음 맞을 때 덩굴로 0.8초 묶음"
},
{
"name": "마계 장막",
"pose": "special",
"desc": "막기 · 장판 — 자기 둘레 반지름 6m 반투명 날개 돔 5초. 안의 아군은 원거리 피해 50% 감소, 돔 경계를 넘어 들어오는 적은 0.5초 경직"
},
{
"name": "유혹의 손짓",
"pose": "cast",
"desc": "앞 8m 부채꼴 60도 — 적 1체 2초 매혹 (공격을 멈추고 콜라이더 쪽으로 걸어옴). 마계 적에게는 3초. skill (이마에 손) 은 시전 전 집중 동작"
}
],
"passive": "마계 대사: 마족 적과의 첫 교전 전에 대화 선택지가 생김 (bow). 함께 있는 아군의 마법 피해 +10%, 콜라이더가 쓰러지면 꼬리 그림자가 1번 대신 막아 줌 (체력 1 로 버팀, 전투당 1번)"
},
"apt": {
"melee": 2,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 3
},
"tag": "mage",
"role_job": "지원",
"bag": 8,
"stats": {
"hp": 950,
"atk": 34,
"spd": 6.2,
"weight_kg": 58,
"tall_m": 1.8
},
"desc": "검은 실루엣 몸에 흰 무늬, 굽은 두 뿔과 갈고리 꼬리를 가진 5성 마계 앰버서더 (대사). 차원 문 · 별빛 표식 · 날개 장막으로 아군을 돕는 서포터, 정장 때는 찢어진 긴 망토 코트를 걸친다.",
"gen": 3,
"codex_g": "N-023b",
"batch": "3기-2",
"portrait": "art/h2/collider/portrait.webp",
"face": "art/h2/collider/face.webp",
"poses": {
"idle": {
"src": "art/h2/collider/idle.webp",
"w": 273,
"h": 707,
"ax": 166,
"ay": 704,
"orig": "3/4 옆모습으로 반듯이 서 있음 — 맨몸 검은 · 흰 무늬 몸 (보디슈트 같은 피부), 굽은 두 뿔 투구 머리, 끝이 갈고리인 긴 꼬리, 하이힐",
"scale": 1.4
},
"cast": {
"src": "art/h2/collider/cast.webp",
"w": 428,
"h": 720,
"ax": 252,
"ay": 717,
"orig": "걸으며 오른손을 앞으로 내밀어 손짓 (유혹 · 손짓하는 시전)",
"scale": 1.4
},
"skill": {
"src": "art/h2/collider/skill.webp",
"w": 308,
"h": 704,
"ax": 184,
"ay": 701,
"orig": "손끝을 이마에 대고 집중 (마안 · 정신 집중)",
"scale": 1.4
},
"guard": {
"src": "art/h2/collider/guard.webp",
"w": 428,
"h": 728,
"ax": 235,
"ay": 725,
"orig": "팔을 뻗어 손바닥을 앞으로 세움 — 멈춰 / 막기",
"scale": 1.4
},
"back": {
"src": "art/h2/collider/back.webp",
"w": 406,
"h": 669,
"ax": 54,
"ay": 666,
"orig": "뒷모습, 오른팔을 옆으로 뻗음 (꼬리 늘어뜨림)",
"scale": 1.4
},
"hurt": {
"src": "art/h2/collider/hurt.webp",
"w": 295,
"h": 652,
"ax": 157,
"ay": 649,
"orig": "가슴을 움켜쥐고 몸을 앞으로 접음 (맞음 · 휘청)",
"scale": 1.4
},
"run": {
"src": "art/h2/collider/run.webp",
"w": 466,
"h": 676,
"ax": 301,
"ay": 673,
"orig": "두 팔 벌리고 앞으로 달려 나감 (꼬리 뒤로 휨)",
"scale": 1.4
},
"crouch": {
"src": "art/h2/collider/crouch.webp",
"w": 521,
"h": 490,
"ax": 384,
"ay": 487,
"orig": "네 발로 낮게 웅크려 덮칠 자세 (손끝 갈퀴 땅 짚음)",
"scale": 1.4
},
"front": {
"src": "art/h2/collider/front.webp",
"w": 593,
"h": 701,
"ax": 293,
"ay": 698,
"orig": "긴 찢어진 망토 코트를 입고 앞모습으로 서서 왼손 내밂 (코트 차림 대기)",
"scale": 1.62
},
"cast2": {
"src": "art/h2/collider/cast2.webp",
"w": 688,
"h": 705,
"ax": 382,
"ay": 702,
"orig": "뒤돌아 오른손을 뻗어 검은 소용돌이 문 (차원 구멍) 을 엶, 검은 파편",
"scale": 1.62
},
"shoot": {
"src": "art/h2/collider/shoot.webp",
"w": 586,
"h": 705,
"ax": 298,
"ay": 702,
"orig": "손가락으로 가리켜 가시 덩굴 끝에 별빛 표식을 날림",
"scale": 1.62
},
"special": {
"src": "art/h2/collider/special.webp",
"w": 687,
"h": 661,
"ax": 284,
"ay": 658,
"orig": "손바닥을 들어 반투명 날개 장막 (돔) 을 둘러침, 가시 별 장식",
"scale": 1.62
},
"attack": {
"src": "art/h2/collider/attack.webp",
"w": 703,
"h": 619,
"ax": 353,
"ay": 616,
"orig": "몸을 비틀어 런지 — 낫 갈퀴 꼬리를 크게 휘둘러 검은 파편이 튐",
"scale": 1.62
},
"bow": {
"src": "art/h2/collider/bow.webp",
"w": 538,
"h": 609,
"ax": 332,
"ay": 606,
"orig": "한 손 가슴, 한 팔 펼치고 허리 숙여 정중한 인사 (대사 인사)",
"scale": 1.62
}
}
},
"colossus15": {
"slug": "colossus15",
"name": "15M 거인병사",
"rank": "미상 (폴더 이름 '15M 거인병사' — 등급 글자 없음, 거신병 병졸급으로 봄)",
"folder": "15M 거인병사",
"role": "적 (거인 병졸 — 키 15m 의 돌 갑옷 창병, 무리 전투에서 '움직이는 성벽' 역할. 보스전 배경 · 중간 보스로도 가능)",
"tall": 15,
"weight": 90000,
"palette": [
"#5b6470",
"#798594",
"#242830",
"#7fa6d8",
"#3b4451"
],
"missing": [
"back",
"walk",
"guard",
"hurt",
"down",
"dead",
"stomp(밟기)"
],
"kit": {
"basic": "거창 찌르기 (attack) — 앞 12m 줄 (폭 2m), 맞은 적 넘어뜨림",
"skills": [
{
"name": "성벽 찌르기",
"pose": "attack",
"desc": "방패 뒤에서 창을 길게 내질러 앞 18m 줄 (폭 3m) 관통, 끝 4m 원 충격파"
},
{
"name": "탑방패 내려찍기",
"pose": "front",
"desc": "탑방패를 땅에 내리찍어 앞 8m 부채꼴 120도 충격 + 흙먼지, 넘어뜨림 2초"
},
{
"name": "거인의 행군",
"pose": "idle",
"desc": "천천히 6m 전진하며 발밑 4m 원을 밟음 (작은 적 큰 피해), 앞쪽 투사체는 방패로 막음"
}
],
"passive": "돌 거신 — 넘어지지 않음, 크기 때문에 작은 적의 근접 공격은 다리 (아래 3m) 만 맞힐 수 있음, 원거리 피해 25% 감소"
},
"apt": {
"melee": 4,
"spear": 5,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "soldier",
"role_job": "선봉",
"bag": 0,
"stats": {
"hp": 12000,
"atk": 120,
"spd": 3.0,
"weight_kg": 90000,
"tall_m": 15
},
"desc": "돌을 깎은 듯한 푸른 잿빛 판금의 15m 거인 병사. 투구 위로 푸른 불꽃 같은 장식이 흩날리고, 긴 창과 성벽 같은 탑방패로 전장을 밀고 나간다.",
"gen": 3,
"portrait": "art/h2/colossus15/portrait.webp",
"face": "art/h2/colossus15/face.webp",
"poses": {
"idle": {
"src": "art/h2/colossus15/idle.webp",
"w": 392,
"h": 760,
"ax": 223,
"ay": 757,
"orig": "옆모습 (오른쪽 보기) 서 있음, 창 세워 들고 큰 네모 탑방패",
"scale": 1.0
},
"front": {
"src": "art/h2/colossus15/front.webp",
"w": 542,
"h": 792,
"ax": 325,
"ay": 789,
"orig": "앞모습 서 있음, 창 · 탑방패, 투구에서 푸른 불꽃 같은 장식이 흩날림",
"scale": 1.0
},
"attack": {
"src": "art/h2/colossus15/attack.webp",
"w": 815,
"h": 533,
"ax": 369,
"ay": 530,
"orig": "몸 낮추고 방패 뒤에서 창을 오른쪽 아래로 찌름",
"scale": 1.0
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
"orig": "엎드려 쓰러짐 (머리 오른쪽, 쇠지렛대 쥔 채)",
"flat": true
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
"orig": "죽음 그림 없음 — down 으로 대신",
"flat": true
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
"orig": "팔꿈치 괴고 누움",
"flat": true
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
"orig": "엎드려 쓰러짐",
"flat": true
},
"attack3": {
"src": "art/h2/gallia/attack3.webp",
"w": 908,
"h": 524,
"ax": 245,
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
"orig": "간두 죽음 (엎어짐, 권총 쥔 채 — 넘어짐 겸용)",
"flat": true
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
"orig": "넘어짐 — 죽음 그림 겸용",
"flat": true
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
"ax": 274,
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
"w": 791,
"h": 644,
"ax": 533,
"ay": 641,
"orig": "배를 움켜쥐고 휘청 (팔 안 꺾인 판)",
"scale": 0.8
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
"orig": "포복 / 엎드림 / 쉼 (먼지 효과)",
"flat": true
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
"ax": 121,
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
"orig": "두손 검 겨눔 (낮은 전투 자세)",
"scale": 1.92
},
"down": {
"src": "art/h2/garam2/down.webp",
"w": 654,
"h": 152,
"ax": 440,
"ay": 149,
"orig": "쓰러짐 (검 쥔 채 엎드림)",
"flat": true
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
"orig": "주먹 들고 서 있음 (권투 자세)",
"scale": 0.738
},
"attack": {
"src": "art/h2/gari/attack.webp",
"w": 590,
"h": 670,
"ax": 353,
"ay": 667,
"orig": "오른 주먹 곧게 뻗기 (스트레이트)",
"scale": 0.738
},
"guard": {
"src": "art/h2/gari/guard.webp",
"w": 560,
"h": 702,
"ax": 286,
"ay": 699,
"orig": "낮게 버티고 두 주먹 가드",
"scale": 0.888
},
"down": {
"src": "art/h2/gari/down.webp",
"w": 939,
"h": 331,
"ax": 580,
"ay": 328,
"orig": "옆으로 누워 쓰러짐 (턱 괴고 눈 뜸 — 쉼으로도)",
"flat": true,
"scale": 0.888
},
"attack2": {
"src": "art/h2/gari/attack2.webp",
"w": 593,
"h": 567,
"ax": 297,
"ay": 564,
"orig": "몸 숙여 낮게 어퍼컷 준비 / 바디블로",
"scale": 0.738
},
"attack3": {
"src": "art/h2/gari/attack3.webp",
"w": 485,
"h": 684,
"ax": 249,
"ay": 681,
"orig": "팔꿈치 치켜올리기 (엘보 · 훅)",
"scale": 0.738
}
}
},
"ghostgirl": {
"slug": "ghostgirl",
"name": "귀신녀 (유령 보스)",
"rank": "보스",
"folder": "귀신녀1",
"role": "적 · 보스 (원본 시트 파일 이름 '하리 유령 보스 캐릭터 시트'. 공포 원령형이라 동료보다 적이 어울림)",
"tall": 1.75,
"weight": 0,
"palette": [
"#0f1216",
"#1b1f23",
"#292d32",
"#949aa0",
"#e6e8ea"
],
"missing": [
"back",
"walk",
"hurt",
"down",
"dead",
"vanish(사라짐)"
],
"kit": {
"basic": "손톱 할퀴기 (attack) — 근접 2m, 2연타",
"skills": [
{
"name": "원령의 덮침",
"pose": "attack",
"desc": "벽 · 적을 통과하며 앞으로 7m 미끄러지듯 돌진 (폭 1.5m 줄), 맞은 적 피해 + 2초 공포 (뒤로 도망, 조작 불가 아님 — 공격 못함)"
},
{
"name": "비명",
"pose": "front",
"desc": "정면으로 돌아 찢어진 입으로 비명: 반경 6m 원, 1.5초 기절 + 횃불 · 빛 아이템 꺼짐. 재사용 15초"
},
{
"name": "그림자 걸음",
"pose": "idle",
"desc": "반투명 (알파 0.3) 이 되어 3초간 피해 받지 않고 떠다니다 가장 가까운 적 뒤 2m 로 순간이동 (그림 없음 — idle 흐리게)"
}
],
"passive": "원령: 물리 피해 40% 감소, 마법 · 빛 피해 50% 더 받음. 바닥에 닿지 않아 함정 · 장판 무시"
},
"apt": {
"melee": 3,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 4,
"stealth": 5
},
"tag": "mage",
"role_job": "척후",
"bag": 4,
"stats": {
"hp": 2400,
"atk": 45,
"spd": 5.5,
"weight_kg": 0,
"tall_m": 1.75
},
"desc": "발목까지 오는 검은 머리칼에 검은 드레스와 찢어진 흰 소매를 걸친 원령. 해골처럼 비어 있는 큰 눈과 찢어진 입으로 덮쳐 온다.",
"gen": 3,
"portrait": "art/h2/ghostgirl/portrait.webp",
"face": "art/h2/ghostgirl/face.webp",
"poses": {
"idle": {
"src": "art/h2/ghostgirl/idle.webp",
"w": 322,
"h": 701,
"ax": 144,
"ay": 698,
"orig": "옆모습으로 고개 숙이고 떠 있음 (오른쪽 봄)",
"scale": 0.77
},
"front": {
"src": "art/h2/ghostgirl/front.webp",
"w": 351,
"h": 719,
"ax": 158,
"ay": 716,
"orig": "앞모습 (조금 오른쪽으로 튼 3/4), 두 손 갈퀴 늘어뜨림",
"scale": 0.77
},
"attack": {
"src": "art/h2/ghostgirl/attack.webp",
"w": 482,
"h": 596,
"ax": 230,
"ay": 593,
"orig": "입 찢어지게 벌리고 두 손 갈퀴 뻗으며 앞으로 덮침 (머리칼 뒤로 휘날림)",
"scale": 0.77
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
"orig": "장검 늘어뜨리고 서 있음",
"scale": 0.825
},
"attack": {
"src": "art/h2/goldknight/attack.webp",
"w": 841,
"h": 685,
"ax": 422,
"ay": 682,
"orig": "두 손으로 장검 위로 뻗어 베기 / 찌르기",
"scale": 0.825
},
"guard": {
"src": "art/h2/goldknight/guard.webp",
"w": 695,
"h": 706,
"ax": 281,
"ay": 703,
"orig": "두 손으로 검 비스듬히 세운 겨눔 자세",
"scale": 0.825
},
"down": {
"src": "art/h2/goldknight/down.webp",
"w": 779,
"h": 416,
"ax": 391,
"ay": 413,
"orig": "바닥에 주저앉음 (검 쥔 채)",
"flat": true,
"scale": 0.825
},
"windup": {
"src": "art/h2/goldknight/windup.webp",
"w": 598,
"h": 598,
"ax": 277,
"ay": 595,
"orig": "검을 땅에 꽂듯 내리고 몸 숙임 (공격 준비 · 숨 고르기)",
"scale": 0.825
},
"attack2": {
"src": "art/h2/goldknight/attack2.webp",
"w": 867,
"h": 592,
"ax": 405,
"ay": 589,
"orig": "한 손 앞찌르기 (런지)",
"scale": 0.825
}
}
},
"goldmask": {
"slug": "goldmask",
"name": "노란악마녀",
"rank": "보스",
"folder": "노란악마녀",
"role": "보스 (시트 파일 이름이 '보스 시트', 가면 · 뿔 · 갈퀴 손의 악마라 적 쪽 우두머리)",
"tall": 1.8,
"weight": 58,
"palette": [
"#e8d97a",
"#1d1b1a",
"#e0cca8",
"#f2e86a",
"#8a8a8a"
],
"missing": [
"back",
"walk",
"hurt",
"down",
"dead",
"cast(마법)",
"jump"
],
"kit": {
"basic": "갈퀴 손톱 할퀴기 (attack) — 앞 2.5m 부채꼴 90도, 2연타",
"skills": [
{
"name": "악마의 덮치기",
"pose": "attack",
"desc": "앞으로 7m 돌진하며 두 손 갈퀴로 3연속 할퀴기 (앞 3m 부채꼴), 맞은 적 출혈 4초"
},
{
"name": "그림자 자락",
"pose": "front",
"desc": "찢어진 치마 자락이 그림자로 퍼져 주위 5m 원 장판 5초: 안의 적 이동 -40%, 매초 작은 피해"
},
{
"name": "사슬 끌어오기",
"pose": "idle",
"desc": "허리 사슬을 던져 줄 8m, 처음 맞은 적을 앞 1.5m 로 끌어옴 (뒤이어 할퀴기 연계)"
}
],
"passive": "빛나는 눈 — 체력 50% 아래면 광폭: 이동 +20%, 공격 속도 +15%, 가면 눈빛이 짙어짐"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 3
},
"tag": "brawler",
"role_job": "척후",
"bag": 6,
"stats": {
"hp": 3200,
"atk": 60,
"spd": 7.0,
"weight_kg": 58,
"tall_m": 1.8
},
"desc": "검은 가면에 노란 눈빛, 길게 늘어진 금발과 작은 뿔의 악마녀. 갈퀴 손으로 덮쳐 찢는 날쌘 근접 보스.",
"gen": 3,
"portrait": "art/h2/goldmask/portrait.webp",
"face": "art/h2/goldmask/face.webp",
"poses": {
"idle": {
"src": "art/h2/goldmask/idle.webp",
"w": 253,
"h": 702,
"ax": 149,
"ay": 699,
"orig": "옆모습 (오른쪽 보기) 서 있음, 갈퀴 손 늘어뜨림",
"scale": 0.78
},
"front": {
"src": "art/h2/goldmask/front.webp",
"w": 346,
"h": 736,
"ax": 197,
"ay": 733,
"orig": "앞모습 (조금 오른쪽) 서 있음, 찢어진 망토 치마 펼쳐짐",
"scale": 0.78
},
"attack": {
"src": "art/h2/goldmask/attack.webp",
"w": 559,
"h": 585,
"ax": 358,
"ay": 582,
"orig": "앞으로 크게 내딛으며 갈퀴 손 뻗기 (할퀴기 · 덮치기)",
"scale": 0.78
}
}
},
"grinvan": {
"slug": "grinvan",
"name": "선봉장 (검은 미소 거신)",
"rank": "강적",
"folder": "강적 선봉장",
"role": "적 (폴더 '강적 선봉장' — 적 무리 맨 앞에서 방패로 막는 거구 정예, 보스 앞 관문지기)",
"tall": 4.5,
"weight": 3500,
"palette": [
"#c4c9cc",
"#585757",
"#1a1a1a",
"#b49ab8",
"#343334"
],
"missing": [
"back",
"walk",
"attack(몽둥이 내려치기 끝 동작)",
"guard",
"hurt",
"down",
"dead"
],
"kit": {
"basic": "몽둥이 내려치기 (dash 그림 재사용) — 앞 3.5m 부채꼴 100도, 넘어뜨림",
"skills": [
{
"name": "방패 돌진",
"pose": "dash",
"desc": "방패 앞세워 10m 돌진, 부딪힌 적 밀쳐 넘어뜨리고 끝에서 몽둥이 휘두르기 (앞 4m 부채꼴)"
},
{
"name": "성벽 방패",
"pose": "idle",
"desc": "타원 방패를 땅에 박아 3초 막기: 앞 150도 원거리 · 근접 피해 90% 막음, 뒤 아군도 가려 줌"
},
{
"name": "검은 미소",
"pose": "front",
"desc": "까만 얼굴 속 웃는 눈이 빛남 — 주위 8m 원 도발 4초 (적이 선봉장만 노림), 그동안 받는 피해 -30%"
}
],
"passive": "무쇠 몸통 — 넘어지지 않음 (밀치기 · 넘어뜨리기 면역), 정면 피해 30% 감소, 등은 약점 (+30%)"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "knight",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 5200,
"atk": 70,
"spd": 3.5,
"weight_kg": 3500,
"tall_m": 4.5
},
"desc": "회백색 판금으로 몸을 감싼 뚱뚱한 거구. 투구 속은 새까만 얼굴에 웃는 눈만 떠 있다. 큰 타원 방패와 쇠 몽둥이로 적 무리 맨 앞을 막는 선봉장.",
"gen": 3,
"portrait": "art/h2/grinvan/portrait.webp",
"face": "art/h2/grinvan/face.webp",
"poses": {
"idle": {
"src": "art/h2/grinvan/idle.webp",
"w": 468,
"h": 739,
"ax": 231,
"ay": 736,
"orig": "옆모습 (오른쪽 보기) 서 있음, 몽둥이 늘어뜨리고 큰 타원 방패 세움",
"scale": 1.15
},
"front": {
"src": "art/h2/grinvan/front.webp",
"w": 670,
"h": 888,
"ax": 279,
"ay": 885,
"orig": "앞모습 서 있음, 몽둥이 · 타원 방패, 허리 앞자락에 보라 문양",
"scale": 1.15
},
"dash": {
"src": "art/h2/grinvan/dash.webp",
"w": 846,
"h": 626,
"ax": 529,
"ay": 623,
"orig": "방패 앞세워 오른쪽으로 돌진, 몽둥이 든 팔은 뒤로 젖힘 (휘두르기 직전)",
"scale": 1.15
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
"ax": 245,
"ay": 533,
"orig": "왼쪽: 봉 가로로 막기"
},
"down": {
"src": "art/h2/gun/down.webp",
"w": 659,
"h": 228,
"ax": 315,
"ay": 225,
"orig": "오른쪽: 옆으로 쓰러짐 (봉 쥔 채)",
"flat": true
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
"orig": "양손 권총 들고 서 있음 (하나는 위로)",
"scale": 0.833
},
"shoot": {
"src": "art/h2/gundevil/shoot.webp",
"w": 826,
"h": 521,
"ax": 290,
"ay": 518,
"orig": "낮게 디딘 자세로 두 팔 뻗어 쌍권총 겨눔",
"scale": 0.833
},
"low": {
"src": "art/h2/gundevil/low.webp",
"w": 806,
"h": 476,
"ax": 387,
"ay": 473,
"orig": "넓게 디디고 아래로 사격 (불꽃 · 파편)",
"scale": 0.81
},
"jump": {
"src": "art/h2/gundevil/jump.webp",
"w": 688,
"h": 606,
"ax": 345,
"ay": 603,
"orig": "공중 쌍권총 사격 (불꽃 · 탄피)",
"scale": 0.81
},
"crouch": {
"src": "art/h2/gundevil/crouch.webp",
"w": 487,
"h": 494,
"ax": 285,
"ay": 491,
"orig": "한쪽 무릎 꿇고 엄폐 자세 (총 하나 위로)",
"scale": 0.77
},
"prone": {
"src": "art/h2/gundevil/prone.webp",
"w": 784,
"h": 315,
"ax": 413,
"ay": 312,
"orig": "옆으로 누워 사격 (넘어짐 · 엎드려쏴로도)",
"flat": true,
"scale": 0.77
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
"hammerknight": {
"slug": "hammerknight",
"name": "해머기사 (이름 미상)",
"rank": "미상 (폴더 이름 '해머기사 적' — 등급 글자 없음, 정예 졸개급으로 봄)",
"folder": "해머기사 적",
"role": "적 (폴더 이름이 '적'. 이름 없는 중장 해머 병사 — 무리 속 정예 · 관문지기. 대화 · 동료 요소 없음)",
"tall": 2.25,
"weight": 260,
"palette": [
"#5a5a5c",
"#2f2f31",
"#4a3b30",
"#6b4a33",
"#9a9a98"
],
"missing": [
"attack (내려찍은 순간 — windup 다음 장면)",
"back",
"walk",
"hurt",
"down",
"dead"
],
"kit": {
"basic": "해머 휘두르기 (idle → windup 짧게) — 앞 2.5m 부채꼴 90도, 느림 (1.4초), 맞으면 밀려남 2m",
"skills": [
{
"name": "대지 내려찍기",
"pose": "windup",
"desc": "1초 모은 뒤 앞 3m 원 (지름 3m) 내려찍기: 큰 피해 + 넘어뜨림 1.5초, 바닥에 돌 파편 장판 3초 (밟으면 둔화 30%)"
},
{
"name": "해머 버티기",
"pose": "front",
"desc": "해머를 땅에 박고 2초 버팀: 받는 피해 50% 감소 + 밀려나지 않음, 끝날 때 주변 2m 원 충격파 (밀쳐냄)"
},
{
"name": "짓밟기 확인사살",
"pose": "windup",
"desc": "쓰러진 적이 2m 안에 있으면 해머로 내리찍어 큰 피해 (쓰러진 대상 피해 2배)"
}
],
"passive": "두꺼운 판금: 근접 · 화살 피해 25% 감소, 넘어뜨리기 · 밀치기에 강함 (지속 시간 절반). 대신 이동 느리고 마법 · 불 피해 +20%"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "knight",
"role_job": "선봉",
"bag": 14,
"stats": {
"hp": 1800,
"atk": 58,
"spd": 3.4,
"weight_kg": 260,
"tall_m": 2.25
},
"desc": "네모난 통 투구에 낡은 판금 · 털가죽 짐을 진 거구의 해머 병사. 말없이 거대한 돌망치를 끌고 다니며 앞을 막는다.",
"gen": 3,
"portrait": "art/h2/hammerknight/portrait.webp",
"face": "art/h2/hammerknight/face.webp",
"poses": {
"idle": {
"src": "art/h2/hammerknight/idle.webp",
"w": 510,
"h": 697,
"ax": 268,
"ay": 694,
"orig": "옆모습: 대형 돌 해머를 한 손으로 비스듬히 끌듯 들고 섬, 등에 털가죽 짐",
"scale": 1.12
},
"front": {
"src": "art/h2/hammerknight/front.webp",
"w": 616,
"h": 877,
"ax": 353,
"ay": 874,
"orig": "3/4 앞모습: 해머 머리를 땅에 짚고 섬, 통 투구 (네모 면갑, 눈구멍 검게 뚫림)",
"scale": 1.12
},
"windup": {
"src": "art/h2/hammerknight/windup.webp",
"w": 757,
"h": 892,
"ax": 334,
"ay": 889,
"orig": "다리 크게 벌리고 두 손으로 해머를 머리 위로 치켜듦 (내려찍기 직전)",
"scale": 1.12
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
"ax": 295,
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
"orig": "쓰러짐 (눈 감음)",
"flat": true
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
"haryu": {
"slug": "haryu",
"name": "하류",
"rank": "암계장군",
"folder": "암계장군 하류",
"role": "보스 (암계 장군 — 티어표 \"암계 장군 '흑익' & '하류'\" 둘 중 하류. 흑익과 짝 보스, 나중에 영입 가능한 둘 다 후보)",
"tall": 1.85,
"weight": 68,
"palette": [
"#1c1a1d",
"#3a3238",
"#8a8a8c",
"#b5a9a3",
"#e08a2a"
],
"missing": [
"back",
"walk",
"guard",
"hurt",
"down",
"dead",
"skill (암계 효과)"
],
"kit": {
"basic": "대검 베기 (idle) — 앞 3m 부채꼴 120도",
"skills": [
{
"name": "암류 베어올리기",
"pose": "attack",
"desc": "5m 돌진하며 대검을 베어 올림: 앞 줄 (폭 1.2m) 피해 + 띄우기 1초 (공중 적에게 다음 공격 피해 +30%)"
},
{
"name": "검은 물결",
"pose": "front",
"desc": "대검을 땅에 그어 앞 8m 부채꼴 60도로 검은 물결 파동: 피해 + 둔화 40% 3초"
},
{
"name": "처형 일섬",
"pose": "attack",
"desc": "체력 30% 아래 적에게 4m 순간 이동 후 일섬 — 큰 피해 (확인사살), 처치 시 쿨 초기화 1번"
}
],
"passive": "암계의 장군 (흑익과 짝): 흑익이 10m 안에 있으면 둘 다 받는 피해 15% 감소. 하류 혼자면 공격 속도 +20%"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 2
},
"tag": "knight",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 4000,
"atk": 78,
"spd": 6.0,
"weight_kg": 68,
"tall_m": 1.85
},
"desc": "숫양 뿔과 검은 복면, 주황 눈빛의 암계 장군. 자기 키만 한 외날 대검을 가볍게 휘두르는 흑익의 짝.",
"gen": 3,
"portrait": "art/h2/haryu/portrait.webp",
"face": "art/h2/haryu/face.webp",
"poses": {
"idle": {
"src": "art/h2/haryu/idle.webp",
"w": 508,
"h": 700,
"ax": 172,
"ay": 697,
"orig": "옆모습 (오른쪽 봄): 대검을 한 손으로 비스듬히 아래로 늘어뜨림",
"scale": 0.98
},
"front": {
"src": "art/h2/haryu/front.webp",
"w": 517,
"h": 798,
"ax": 219,
"ay": 795,
"orig": "3/4 앞모습: 숫양 뿔, 회색 긴 곱슬머리, 검은 복면 · 주황 눈, 트임 긴 검은 드레스, 판금 허벅지 장화 (하이힐), 큰 외날 대검",
"scale": 0.98
},
"attack": {
"src": "art/h2/haryu/attack.webp",
"w": 732,
"h": 658,
"ax": 488,
"ay": 655,
"orig": "등을 보이며 몸을 틀어 두 손으로 대검을 앞 위로 길게 찌름 / 베어 올림, 머리 · 치마 휘날림",
"scale": 0.98
}
}
},
"heugik": {
"slug": "heugik",
"name": "흑익",
"rank": "암계장군",
"folder": "암계장군 흑익",
"role": "보스 (암계 장군 — 티어표 \"암계 장군 '흑익' & '하류'\" 둘 중 흑익. 나중에 영입 가능한 둘 다 후보)",
"tall": 1.92,
"weight": 95,
"palette": [
"#29292b",
"#1b1b1c",
"#878788",
"#cfcdcc",
"#f2f2f0"
],
"missing": [
"back",
"walk",
"guard (막기)",
"hurt",
"down",
"dead",
"skill (어둠 날개 · 효과)"
],
"kit": {
"basic": "세검 찌르기 (attack) — 앞 3.5m 줄 (폭 0.6m), 빠름",
"skills": [
{
"name": "흑익 섬격",
"pose": "attack",
"desc": "6m 돌진 찌르기, 지나간 줄 위 적 모두 관통 피해 + 출혈 4초. 돌진 중 무적 0.2초"
},
{
"name": "검은 날개 망토",
"pose": "front",
"desc": "망토를 펼쳐 2초 막기: 앞 150도 원거리 막기, 막는 동안 맞으면 즉시 찌르기 반격 (4m)"
},
{
"name": "확인사살",
"pose": "idle",
"desc": "체력 25% 아래 적에게 순간 이동 3m 후 세검 내리찌르기 — 큰 피해 (처형)"
}
],
"passive": "암계의 장군: 주변 10m 암계 아군 공격 +10%, 처치할 때마다 이동 속도 +15% 4초 (최대 3번)"
},
"apt": {
"melee": 5,
"spear": 3,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 3
},
"tag": "knight",
"role_job": "지휘",
"bag": 10,
"stats": {
"hp": 4200,
"atk": 72,
"spd": 6.2,
"weight_kg": 95,
"tall_m": 1.92
},
"desc": "암계 장군 \"흑익\". 흰 장발에 얼굴 없는 검은 투구 가면, 늑골 무늬 검은 갑옷과 해진 망토, 가늘고 긴 세검을 쓰는 검사. 짝 장군은 \"하류\".",
"gen": 3,
"portrait": "art/h2/heugik/portrait.webp",
"face": "art/h2/heugik/face.webp",
"poses": {
"front": {
"src": "art/h2/heugik/front.webp",
"w": 436,
"h": 734,
"ax": 206,
"ay": 731,
"orig": "앞모습: 늑골 무늬 검은 갑옷, 해진 긴 망토, 흰 장발, 검은 투구 가면 (흰 눈빛), 오른손에 긴 세검",
"scale": 0.9
},
"idle": {
"src": "art/h2/heugik/idle.webp",
"w": 410,
"h": 710,
"ax": 178,
"ay": 707,
"orig": "옆모습 (오른쪽 봄): 세검을 비스듬히 아래로 내려 듦",
"scale": 0.9
},
"attack": {
"src": "art/h2/heugik/attack.webp",
"w": 784,
"h": 504,
"ax": 391,
"ay": 501,
"orig": "다리를 크게 벌려 세검을 앞으로 길게 찌름 (런지), 머리 · 망토 휘날림",
"scale": 0.9
}
}
},
"hiddenkkaebi": {
"slug": "hiddenkkaebi",
"name": "히든깨비",
"rank": "초강적",
"folder": "3기-2 (초강적 히든깨비.png)",
"role": "적 (파일 이름 '초강적' — 숨은 (히든) 강적 · 검객 보스급. 동료 그림체 아님)",
"tall": 2.4,
"weight": 130,
"palette": [
"#080304",
"#27181b",
"#4d1b1f",
"#662e2c",
"#d8322a",
"#5a2a5e"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"back"
],
"kit": {
"basic": "대각 베기 (attack) — 앞 4m 부채꼴 120도, 붉은 궤적",
"skills": [
{
"name": "잔영 돌진",
"pose": "dash",
"desc": "잔상을 남기며 14m 순간 돌진 — 줄 위 모든 적 베기, 0.5초 뒤 잔상이 한 번 더 벰"
},
{
"name": "혈검 낙하",
"pose": "slam",
"desc": "칼을 거꾸로 쥐고 땅에 꽂음 — 반지름 5m 원 붉은 균열 + 바위 파편, 넘어뜨림"
},
{
"name": "혈단검 고리",
"pose": "skill",
"desc": "몸 둘레에 붉은 단검 12자루를 띄움 (5초) — 다가오는 적 자동으로 찌르고, 끝날 때 바깥으로 사방 발사 (15m 사격)"
},
{
"name": "공간 찢기",
"pose": "attack2",
"desc": "칼을 곧게 찔러 앞 6m 줄에 보랏빛 균열 — 2초 뒤 터지며 피해 + 끌어오기"
},
{
"name": "올려 베기",
"pose": "attack3",
"desc": "무릎 꿇었다가 위로 올려 벰 — 앞 3m, 맞은 적 띄움 · 바위 파편"
}
],
"passive": "숨은 도깨비: 전투 밖에서는 보이지 않다가 (히든) 첫 공격이 확정 치명타, 체력 50% 아래에서 붉은 기운이 짙어져 공격 속도 +20%"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 4
},
"tag": "knight",
"role_job": "선봉",
"bag": 6,
"stats": {
"hp": 5200,
"atk": 78,
"spd": 4.6,
"weight_kg": 130,
"tall_m": 2.4
},
"desc": "검붉은 누더기 로브에 붉은 실 · 장신구를 칭칭 감고 붉은 탈 같은 얼굴을 한 키 큰 도깨비 검객. 몸에서 붉은 기운 · 불티가 흐르고, 칼 하나로 잔상 · 균열 · 단검 고리를 부린다.",
"gen": 3,
"codex_g": "hiddenkkaebi",
"batch": "3기-2",
"portrait": "art/h2/hiddenkkaebi/portrait.webp",
"face": "art/h2/hiddenkkaebi/face.webp",
"poses": {
"idle": {
"src": "art/h2/hiddenkkaebi/idle.webp",
"w": 781,
"h": 731,
"ax": 368,
"ay": 728,
"orig": "칼을 오른쪽 아래로 늘어뜨리고 서 있음, 붉은 불티가 흩날림",
"scale": 1.8
},
"front": {
"src": "art/h2/hiddenkkaebi/front.webp",
"w": 727,
"h": 720,
"ax": 360,
"ay": 717,
"orig": "앞모습, 칼을 낮게 들고 발밑에 붉은 기운이 소용돌이",
"scale": 1.8
},
"attack": {
"src": "art/h2/hiddenkkaebi/attack.webp",
"w": 911,
"h": 698,
"ax": 548,
"ay": 695,
"orig": "깊게 내딛으며 왼쪽 위에서 오른쪽 아래로 크게 대각 베기, 붉은 궤적",
"scale": 1.8
},
"slam": {
"src": "art/h2/hiddenkkaebi/slam.webp",
"w": 850,
"h": 774,
"ax": 413,
"ay": 771,
"orig": "칼을 두 손으로 거꾸로 쥐고 땅에 내리꽂음, 붉은 섬광 · 바위 파편",
"scale": 1.8
},
"dash": {
"src": "art/h2/hiddenkkaebi/dash.webp",
"w": 911,
"h": 481,
"ax": 448,
"ay": 478,
"orig": "칼을 오른쪽으로 겨누고 잔상을 남기며 돌진 (보랏빛 잔상 · 흙먼지)",
"scale": 1.8
},
"skill": {
"src": "art/h2/hiddenkkaebi/skill.webp",
"w": 923,
"h": 772,
"ax": 380,
"ay": 769,
"orig": "손을 들어 붉은 단검 열두 자루를 몸 둘레에 띄움 (소환 단검 고리)",
"scale": 1.8
},
"attack2": {
"src": "art/h2/hiddenkkaebi/attack2.webp",
"w": 891,
"h": 808,
"ax": 346,
"ay": 805,
"orig": "칼을 오른쪽으로 곧게 찌름, 칼끝에 보랏빛 균열 (공간 찢기)",
"scale": 1.8
},
"attack3": {
"src": "art/h2/hiddenkkaebi/attack3.webp",
"w": 774,
"h": 803,
"ax": 380,
"ay": 800,
"orig": "한쪽 무릎을 꿇은 채 칼을 오른쪽 위로 올려 벰, 붉은 궤적 · 바위 파편",
"scale": 1.8
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
"w": 716,
"h": 690,
"ax": 467,
"ay": 687,
"orig": "손을 가슴에 대고 놀라 뒤로 젖힘 (새 판)",
"scale": 0.8
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
"orig": "포복 / 엎드림 / 쉼 (먼지 효과)",
"flat": true
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
"orig": "서 있음 2 (뒤돌아 웃음)",
"scale": 1.3
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
"orig": "쓰러짐 (엎드려 지팡이 쥠)",
"flat": true
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
"hongdukkae": {
"slug": "hongdukkae",
"name": "홍두깨",
"rank": "강적 (폴더 이름 머리말 '강적' — 원본 참고에 글자 없음)",
"folder": "강적 홍두깨",
"role": "적 (붉은 오니 가면의 거구 둔기 전사 — 강적 · 중간 보스. 이름처럼 커다란 가시 쇠몽둥이가 상징)",
"tall": 2.3,
"weight": 230,
"palette": [
"#a3202a",
"#d0262c",
"#1e1a1c",
"#3a3436",
"#6e2a2a"
],
"missing": [
"back",
"walk",
"windup (몽둥이 치켜들기)",
"hurt",
"down",
"dead",
"slam (위에서 내려찍기)"
],
"kit": {
"basic": "쇠몽둥이 휘두르기 (attack) — 앞 3m 부채꼴 100도, 맞으면 밀려남 2m",
"skills": [
{
"name": "홍두깨 휩쓸기",
"pose": "attack",
"desc": "한 걸음 내디디며 앞 4m 부채꼴 160도를 낮게 휩쓸어 넘어뜨림, 방패 막기를 무시 (막아도 50% 피해)"
},
{
"name": "어깨 메고 돌진",
"pose": "idle",
"desc": "몽둥이를 어깨에 멘 채 7m 돌진, 부딪힌 적 1.5초 기절, 벽에 부딪히면 자신도 1초 멈춤"
},
{
"name": "오니의 확인사살",
"pose": "attack",
"desc": "쓰러진 적에게만 쓰는 하단 내려치기 — 앞 2.5m, 큰 피해 (쓰러진 적 피해 2배)"
}
],
"passive": "오니 가면: 체력 50% 아래에서 분노 — 공격 속도 +25%, 넘어뜨림 · 밀려남에 면역"
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
"bag": 6,
"stats": {
"hp": 2600,
"atk": 70,
"spd": 4.0,
"weight_kg": 230,
"tall_m": 2.3
},
"desc": "두 가닥 긴 뿔이 솟은 붉은 오니 가면을 쓰고, 해진 핏빛 트렌치코트에 검은 판금 팔다리를 두른 거구. 가시 박힌 거대한 쇠몽둥이 홍두깨를 어깨에 메고 다닌다.",
"gen": 3,
"portrait": "art/h2/hongdukkae/portrait.webp",
"face": "art/h2/hongdukkae/face.webp",
"poses": {
"idle": {
"src": "art/h2/hongdukkae/idle.webp",
"w": 498,
"h": 698,
"ax": 285,
"ay": 695,
"orig": "옆모습 (오른쪽 보기) 서 있음, 가시 쇠몽둥이를 오른쪽 어깨에 걸침",
"scale": 0.88
},
"front": {
"src": "art/h2/hongdukkae/front.webp",
"w": 466,
"h": 715,
"ax": 173,
"ay": 712,
"orig": "앞모습 (3/4 정면) 서 있음, 쇠몽둥이를 오른손에 늘어뜨림",
"scale": 0.88
},
"attack": {
"src": "art/h2/hongdukkae/attack.webp",
"w": 673,
"h": 607,
"ax": 305,
"ay": 604,
"orig": "몸을 낮추고 두 손으로 쇠몽둥이를 앞 아래로 크게 휘두름 (낮은 휩쓸기 · 내려치기 끝 자세), 해진 코트 자락이 뒤로 휘날림",
"scale": 0.88
}
}
},
"hornbeast": {
"slug": "hornbeast",
"name": "거대괴수B (검은 뿔 괴수)",
"rank": "거대괴수 (시트 제목 \"보스\")",
"folder": "거대괴수B",
"role": "보스 (거대괴수 — 맵 하나를 차지하는 큰 보스)",
"tall": 7.5,
"weight": 26000,
"palette": [
"#19191c",
"#252428",
"#333336",
"#444447",
"#b8b3a8"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"roar (따로)",
"back",
"charge (돌진)"
],
"kit": {
"basic": "갈퀴 휘두르기 (attack) — 앞 7m 부채꼴 120도, 넘어뜨림",
"skills": [
{
"name": "뿔 들이받기",
"pose": "idle",
"desc": "몸을 숙인 채 앞으로 14m 돌진 — 줄 위 적을 밀쳐 넘어뜨리고 벽에 박으면 2초 기절"
},
{
"name": "아가리 포효",
"pose": "attack",
"desc": "입을 벌려 울부짖음 — 반지름 15m 원, 2초 공포 (뒤로 도망) + 방어 −20% 6초"
},
{
"name": "대지 내려찍기",
"pose": "front",
"desc": "일어서서 두 팔로 땅을 침 — 반지름 9m 원 충격파, 가까울수록 큰 피해, 돌 파편이 3초 장판"
}
],
"passive": "가시 털가죽: 근접 공격한 적에게 받은 피해 15% 되돌림, 원거리 피해 20% 감소"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "beast",
"role_job": "선봉",
"bag": 6,
"stats": {
"hp": 8000,
"atk": 110,
"spd": 4.0,
"weight_kg": 26000,
"tall_m": 7.5
},
"desc": "온몸이 검은 깃털 같은 비늘과 가시로 덮인 거대 괴수. 머리에 긴 뿔 네 가닥, 눈 없이 톱니 이빨만 드러낸다.",
"gen": 3,
"portrait": "art/h2/hornbeast/portrait.webp",
"face": "art/h2/hornbeast/face.webp",
"poses": {
"idle": {
"src": "art/h2/hornbeast/idle.webp",
"w": 578,
"h": 705,
"ax": 284,
"ay": 702,
"orig": "옆모습, 앞으로 숙여 긴 팔을 땅에 드리우고 서 있음",
"scale": 1.05
},
"front": {
"src": "art/h2/hornbeast/front.webp",
"w": 545,
"h": 840,
"ax": 224,
"ay": 837,
"orig": "앞모습 (3/4), 똑바로 서서 고개 숙임",
"scale": 1.05
},
"attack": {
"src": "art/h2/hornbeast/attack.webp",
"w": 675,
"h": 607,
"ax": 412,
"ay": 604,
"orig": "낮게 웅크려 입을 쩍 벌리고 앞발 갈퀴를 휘두르기 직전 (포효 · 덮치기)",
"scale": 1.05
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
"jaru": {
"slug": "jaru",
"name": "자루",
"rank": "수집가 (등급 글자 없음 — 티어표에서 거신급 칸 아래 \"외계 유물학자 '자루'\")",
"folder": "수집가 자루",
"role": "둘 다 (외계 유물학자 · 수집가 NPC. 유물을 걸고 싸우는 중간 보스로도, 영입 동료 마법사로도)",
"tall": 1.78,
"weight": 70,
"palette": [
"#4a3a36",
"#5e7f88",
"#7a5a40",
"#a8d8d4",
"#c9a86a"
],
"missing": [
"back",
"walk",
"hurt",
"down",
"dead",
"cast 별도 효과 (빛 · 마법진)"
],
"kit": {
"basic": "초승달 유물 휘두르기 (attack) — 앞 2.5m 부채꼴 90도, 맞은 적 1m 밀침",
"skills": [
{
"name": "달빛 파편",
"pose": "attack",
"desc": "초승달을 앞으로 내질러 유물 조각 3개를 앞 12m 부채꼴 30도로 쏨. 조각마다 피해 + 2초 둔화 30%"
},
{
"name": "유물 감정",
"pose": "idle",
"desc": "유물을 받쳐 들고 2초 집중 — 반경 8m 안 적 하나의 버프 하나를 빼앗아 자신에게 6초 옮김 (수집가)"
},
{
"name": "달 정령 소환",
"pose": "front",
"desc": "초승달의 작은 정령을 떼어 내 15초 동안 곁에 둠: 1.5초마다 가까운 적에게 6m 빛 구슬 사격, 정령이 맞으면 사라짐"
}
],
"passive": "수집가의 자루: 쓰러뜨린 적에게서 아이템을 1개 더 얻을 확률 +25%, 유물 장비 효과 +15%"
},
"apt": {
"melee": 1,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 4,
"stealth": 2
},
"tag": "mage",
"role_job": "지원",
"bag": 20,
"stats": {
"hp": 640,
"atk": 30,
"spd": 5.0,
"weight_kg": 70,
"tall_m": 1.78
},
"desc": "외계 유물을 모으는 학자 \"자루\". 얼굴 그린 작은 정령이 붙은 초승달 유물을 지팡이 삼아 싸우는 마스크 쓴 장발 여성.",
"gen": 3,
"portrait": "art/h2/jaru/portrait.webp",
"face": "art/h2/jaru/face.webp",
"poses": {
"front": {
"src": "art/h2/jaru/front.webp",
"w": 480,
"h": 754,
"ax": 213,
"ay": 751,
"orig": "앞모습: 초승달 유물 (얼굴 그린 작은 정령이 붙음)을 왼손에 얹고 섬",
"scale": 0.89
},
"idle": {
"src": "art/h2/jaru/idle.webp",
"w": 377,
"h": 704,
"ax": 150,
"ay": 701,
"orig": "옆모습 (오른쪽 봄): 초승달 유물을 두 손으로 받쳐 듦",
"scale": 0.89
},
"attack": {
"src": "art/h2/jaru/attack.webp",
"w": 643,
"h": 623,
"ax": 339,
"ay": 620,
"orig": "초승달 유물을 지팡이처럼 앞으로 내지르며 다리 벌린 시전 자세",
"scale": 0.89
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
"orig": "오른쪽: 엎어져 쓰러짐",
"flat": true
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
"orig": "옆으로 쓰러짐 (머리 오른쪽, 방패 · 검 쥔 채)",
"flat": true
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
"orig": "죽음 그림 없음 — down 으로 대신",
"flat": true
}
}
},
"khaki": {
"slug": "khaki",
"name": "카키",
"rank": "중간급",
"folder": "중간급 카키",
"role": "적 (보스급 중간 적 — 티어표 \"문명 초월의 기준 2명\" 의 SF초월인간. 지역 보스로 알맞음)",
"tall": 2.3,
"weight": 420,
"palette": [
"#1e2030",
"#383b4c",
"#4e5560",
"#36e0f0",
"#191a23"
],
"missing": [
"back",
"walk",
"hurt",
"down",
"dead",
"shoot (포신 발사 효과)"
],
"kit": {
"basic": "기계 손 할퀴기 — 앞 2.5m 부채꼴 100도",
"skills": [
{
"name": "신장 집게팔",
"pose": "attack",
"desc": "팔을 9m 줄로 뻗어 찌름. 맞은 적 하나를 집게로 잡아 3m 앞까지 끌어옴 (끌어오기)"
},
{
"name": "축전 포격",
"pose": "attack",
"desc": "팔 끝 집게가 벌어지며 파란 광선 1.2초 충전 후 앞 16m 줄 (폭 1m) 관통 사격"
},
{
"name": "분석 렌즈",
"pose": "front",
"desc": "외눈이 반경 10m 를 훑어 은신 · 투명 적을 드러내고 5초간 받는 피해 +15% (표식)"
}
],
"passive": "초월 신체: 정면 근접 피해 25% 감소, 넘어뜨림 · 밀침 면역 (등 뒤 회로가 약점)"
},
"apt": {
"melee": 4,
"spear": 3,
"bow": 0,
"gun": 4,
"magic": 1,
"stealth": 1
},
"tag": "soldier",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 3200,
"atk": 58,
"spd": 4.2,
"weight_kg": 420,
"tall_m": 2.3
},
"desc": "SF초월인간 \"카키\". 해진 남색 후드 망토 속은 파란 회로가 흐르는 기계 몸, 얼굴은 해골 + 외눈 렌즈. 팔을 길게 늘여 집게 창 · 포신으로 씀.",
"gen": 3,
"portrait": "art/h2/khaki/portrait.webp",
"face": "art/h2/khaki/face.webp",
"poses": {
"front": {
"src": "art/h2/khaki/front.webp",
"w": 521,
"h": 808,
"ax": 196,
"ay": 805,
"orig": "앞모습: 해진 후드 망토, 해골 얼굴 + 파란 외눈 렌즈, 커다란 기계 손",
"scale": 1.07
},
"idle": {
"src": "art/h2/khaki/idle.webp",
"w": 427,
"h": 702,
"ax": 270,
"ay": 699,
"orig": "옆모습 (오른쪽 봄): 구부정하게 서서 기계 팔을 늘어뜨림",
"scale": 1.07
},
"attack": {
"src": "art/h2/khaki/attack.webp",
"w": 1070,
"h": 548,
"ax": 428,
"ay": 545,
"orig": "오른팔을 길게 늘여 집게 · 포신 달린 기계 창처럼 앞으로 내지름",
"scale": 1.07
}
}
},
"knightcaptain": {
"slug": "knightcaptain",
"name": "기사단장",
"rank": "미정 (파일 이름에 등급 없음)",
"folder": "3기-2 / 기사단장.png (도감 1기 묶음 knightcommander 와 같은 인물)",
"role": "둘 다 (보스 · 동료) — 왕국 기사단장이라 적 쪽이면 기사단을 이끄는 보스, 아군이면 지휘형 동료. 도감에서도 역할 미정",
"tall": 1.85,
"weight": 95,
"palette": [
"#5e6571",
"#303139",
"#b3bac5",
"#8e95a1",
"#d6dce3"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"back",
"옆모습 idle (idle 은 3/4 앞모습)"
],
"kit": {
"basic": "장검 가로베기 (attack) — 앞 3m 부채꼴 140도. guard 자세로 막기 (정면 근접 막기, 막은 직후 low 자세에서 반격 베기 1회)",
"skills": [
{
"name": "일섬 찌르기",
"pose": "attack2",
"desc": "한 손으로 쭉 뻗는 찌르기 — 앞 6m 줄 관통, 방어 무시 30%"
},
{
"name": "돌진 베기",
"pose": "dash",
"desc": "8m 앞으로 돌진하며 찔러 들어감 — 줄 위 적 넘어뜨림, 마지막 적에게 추가 피해"
},
{
"name": "천근 내려찍기",
"pose": "windup",
"desc": "0.8초 장검을 치켜들었다 내려찍음 — 앞 3m 원 (반지름 2.5m) 큰 피해 + 1초 기절, 쓰러진 적에게 확인사살"
},
{
"name": "기사단 호령",
"pose": "skill",
"desc": "장검을 하늘로 들어 호령 — 반지름 10m 원 안 아군 공격 +20% · 방어 +15% 8초, 적은 2초 공포"
}
],
"passive": "백랑 털망토: 정면에서 받는 피해 15% 감소, 체력 30% 아래로 떨어지면 공격 +20%"
},
"apt": {
"melee": 5,
"spear": 2,
"bow": 0,
"gun": 0,
"magic": 1,
"stealth": 0
},
"tag": "knight",
"role_job": "지휘",
"bag": 14,
"stats": {
"hp": 2600,
"atk": 75,
"spd": 4.6,
"weight_kg": 95,
"tall_m": 1.85
},
"desc": "흰 늑대 털망토와 은빛 판금 갑옷을 두른 왕국 기사단장. 투구 아래로 검은 긴 머리를 늘어뜨리고, 붉은 술이 달린 장검 한 자루로 싸운다.",
"gen": 1,
"codex_g": "knightcommander",
"batch": "3기-2",
"portrait": "art/h2/knightcaptain/portrait.webp",
"face": "art/h2/knightcaptain/face.webp",
"poses": {
"idle": {
"src": "art/h2/knightcaptain/idle.webp",
"w": 524,
"h": 687,
"ax": 253,
"ay": 684,
"orig": "3/4 앞모습으로 똑바로 섬, 붉은 술 달린 장검을 땅에 세워 두 손으로 자루를 쥠, 흰 늑대 털망토 · 흰 천 망토가 발까지 늘어짐",
"scale": 1.55
},
"guard": {
"src": "art/h2/knightcaptain/guard.webp",
"w": 687,
"h": 617,
"ax": 297,
"ay": 614,
"orig": "다리를 넓게 벌리고 허리 높이에서 두 손으로 장검을 오른쪽으로 길게 겨눈 겨눔 자세 (막기 자세)",
"scale": 1.55
},
"attack": {
"src": "art/h2/knightcaptain/attack.webp",
"w": 784,
"h": 615,
"ax": 382,
"ay": 612,
"orig": "두 손 장검으로 오른쪽 가로베기, 흰 베기 궤적이 몸 앞을 휘감음, 머리칼 · 망토가 뒤로 휘날림 (오른쪽 끝에 섞인 4번째 그림 머리칼 · 망토 지움)",
"scale": 1.55
},
"attack2": {
"src": "art/h2/knightcaptain/attack2.webp",
"w": 668,
"h": 547,
"ax": 333,
"ay": 544,
"orig": "오른팔을 쭉 뻗어 한 손 찌르기, 다리 넓게 벌린 깊은 자세, 붉은 술 나부낌 (왼쪽에 섞인 3번째 그림 칼끝 지움)",
"scale": 1.55
},
"low": {
"src": "art/h2/knightcaptain/low.webp",
"w": 604,
"h": 522,
"ax": 255,
"ay": 519,
"orig": "한 무릎 굽혀 낮게 웅크리고 장검을 오른쪽 아래로 비스듬히 내린 자세 — 반격 · 발도 준비",
"scale": 1.55
},
"windup": {
"src": "art/h2/knightcaptain/windup.webp",
"w": 622,
"h": 792,
"ax": 260,
"ay": 789,
"orig": "두 손으로 장검을 머리 위로 높이 치켜든 내려찍기 직전 자세, 붉은 술이 손잡이에서 늘어짐 (오른쪽에 섞인 3번째 그림 머리칼 지움)",
"scale": 1.55
},
"dash": {
"src": "art/h2/knightcaptain/dash.webp",
"w": 758,
"h": 620,
"ax": 368,
"ay": 617,
"orig": "앞으로 크게 내딛으며 한 손으로 장검을 오른쪽 아래로 뻗은 돌진 찌르기, 검은 머리 · 망토가 뒤로 길게 휘날림",
"scale": 1.55
},
"skill": {
"src": "art/h2/knightcaptain/skill.webp",
"w": 574,
"h": 797,
"ax": 226,
"ay": 794,
"orig": "왼손 주먹 쥐고 오른팔로 장검을 하늘 높이 치켜든 호령 자세 (기사단 지휘)",
"scale": 1.55
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
"orig": "쓰러짐 (눈 감음)",
"flat": true
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
"orig": "오른쪽: 넘어진 채 소총 겨눔",
"flat": true
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
"face": "art/h2/levi_beast/face.webp",
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
"orig": "엎드려 쓰러짐 (머리 오른쪽)",
"flat": true
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
"orig": "죽음 그림 없음 — down 으로 대신",
"flat": true
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
"madosa": {
"slug": "madosa",
"name": "마도사",
"rank": "적 (원본 참고에 등급 글자 없음 — 폴더 이름 '마도사 적', 시트 파일 이름은 '자주색 망토 보스 3면 시트')",
"folder": "마도사 적",
"role": "적 (얼굴이 그림자에 가려 눈만 빛나는 정체불명의 마녀형 마법사 — 강적 · 중간 보스로 알맞음. 동료 그림체는 아님)",
"tall": 2.15,
"weight": 70,
"palette": [
"#3a2638",
"#5b3f5a",
"#7a2a3a",
"#c9c6c8",
"#ece4d0"
],
"missing": [
"back",
"walk",
"hurt",
"down",
"dead",
"마법 효과 (구체 · 빛줄기 그림 없음)"
],
"kit": {
"basic": "지팡이 마탄 (cast) — 앞 줄 14m, 보랏빛 마탄 1발, 맞으면 0.5초 경직",
"skills": [
{
"name": "저주의 창끝",
"pose": "cast",
"desc": "지팡이 끝을 겨눠 18m 줄 모양 관통 광선, 줄 위 모든 적 피해 + 4초 동안 받는 피해 15% 증가 (저주)"
},
{
"name": "그림자 장막",
"pose": "idle",
"desc": "제자리에서 망토를 여미며 반지름 5m 원 장판 — 안쪽 적 이동 속도 40% 감소, 마도사는 3초 동안 원거리 피해 50% 감소"
},
{
"name": "이빨 모자의 부름",
"pose": "front",
"desc": "지팡이로 땅을 짚어 앞 8m 지점에 그림자 졸개 2마리 소환 (10초 유지, 근접 할퀴기)"
}
],
"passive": "얼굴 없는 자: 얼굴이 그림자에 가려 표식 · 조준 계열 효과가 50% 확률로 빗나감. 체력 30% 아래로 떨어지면 마탄 연사 속도 +30%"
},
"apt": {
"melee": 1,
"spear": 2,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 3
},
"tag": "mage",
"role_job": "지원",
"bag": 8,
"stats": {
"hp": 1600,
"atk": 48,
"spd": 4.5,
"weight_kg": 70,
"tall_m": 2.15
},
"desc": "뾰족한 챙 넓은 마녀 모자에 하얀 이빨 장식을 두른 자주색 망토의 마도사. 얼굴은 검은 그림자 속에 노란 눈만 보이고, 은빛 갑옷 하이힐과 창끝 달린 가는 지팡이를 짚고 다닌다.",
"gen": 3,
"portrait": "art/h2/madosa/portrait.webp",
"face": "art/h2/madosa/face.webp",
"poses": {
"idle": {
"src": "art/h2/madosa/idle.webp",
"w": 357,
"h": 704,
"ax": 181,
"ay": 701,
"orig": "옆모습 (오른쪽 보기) 서 있음, 오른손으로 지팡이 짚음",
"scale": 0.9
},
"front": {
"src": "art/h2/madosa/front.webp",
"w": 423,
"h": 736,
"ax": 198,
"ay": 733,
"orig": "앞모습 (3/4 정면) 서 있음, 지팡이 짚음",
"scale": 0.9
},
"cast": {
"src": "art/h2/madosa/cast.webp",
"w": 709,
"h": 576,
"ax": 253,
"ay": 573,
"orig": "다리 벌리고 버틴 채 오른팔로 지팡이를 앞으로 곧게 겨눔 (마법 쏘기 · 지휘)",
"scale": 0.9
}
}
},
"magusgirl": {
"slug": "magusgirl",
"name": "마도사 맨얼굴 (주황 머리 · 뿔 — 마도사와 같은 사람)",
"rank": "중적",
"folder": "3기-2 (중적 마도사녀.png)",
"role": "적 (파일 이름 '중적' — 중간급 적 마법사. 엘리트 · 소보스로 알맞음)",
"tall": 1.78,
"weight": 58,
"palette": [
"#17191c",
"#2a272a",
"#2b4fb0",
"#e02a2a",
"#e7e0e2",
"#5a1a1e"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"back"
],
"kit": {
"basic": "혈편 사격 (cast) — 앞 14m 부채꼴 20도로 붉은 파편 5발",
"skills": [
{
"name": "푸른 반달 방벽",
"pose": "guard",
"desc": "앞에 반달 방벽 3초 — 앞 120도 원거리 공격을 막고 화살 · 총알을 되튕김"
},
{
"name": "혈마법진",
"pose": "skill",
"desc": "1초 땅에 마법진을 그림 — 12m 안 지정 자리 반지름 3.5m 원 장판 4초, 초당 피해 + 둔화 30%"
},
{
"name": "지팡이 낙하",
"pose": "slam",
"desc": "떠올랐다가 지팡이를 땅에 내리꽂음 — 반지름 4m 원 붉은 폭발, 넘어뜨림"
},
{
"name": "붉은 소용돌이 찌르기",
"pose": "attack",
"desc": "도끼날 지팡이를 앞 4m 줄로 내지름, 끝에 소용돌이 — 맞은 적 2m 끌어오기"
}
],
"passive": "마녀의 망토: 체력 50% 아래가 되면 한 번 dash 로 8m 뒤로 미끄러져 빠지고 2초 투명"
},
"apt": {
"melee": 2,
"spear": 2,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 1
},
"tag": "mage",
"role_job": "사수",
"bag": 8,
"stats": {
"hp": 1500,
"atk": 34,
"spd": 4.4,
"weight_kg": 58,
"tall_m": 1.78
},
"desc": "민수 확인: 주황 머리에 뿔 = 마도사와 같은 사람 (모자를 벗은 맨얼굴 모습). 긴 붉은 머리 · 머리 양옆의 검은 나선 뿔 · 푸른 무늬가 찢긴 검은 로브 · 흰 치마 · 검은 사이하이 부츠. 도끼날 달린 검은 지팡이로 붉은 피의 마법과 푸른 방벽을 쓴다.",
"gen": 3,
"batch": "3기-2",
"portrait": "art/h2/magusgirl/portrait.webp",
"face": "art/h2/magusgirl/face.webp",
"poses": {
"idle": {
"src": "art/h2/magusgirl/idle.webp",
"w": 557,
"h": 711,
"ax": 254,
"ay": 708,
"orig": "한 손을 머리(뿔)에 얹고 지팡이를 세워 든 채 서 있음 (3/4 앞)",
"scale": 1.62
},
"front": {
"src": "art/h2/magusgirl/front.webp",
"w": 637,
"h": 705,
"ax": 344,
"ay": 702,
"orig": "앞모습, 도끼날 지팡이를 아래로 비스듬히 늘어뜨림",
"scale": 1.62
},
"cast": {
"src": "art/h2/magusgirl/cast.webp",
"w": 711,
"h": 661,
"ax": 361,
"ay": 658,
"orig": "지팡이를 짚고 오른팔을 뻗어 붉은 파편을 쏨",
"scale": 1.62
},
"guard": {
"src": "art/h2/magusgirl/guard.webp",
"w": 693,
"h": 635,
"ax": 318,
"ay": 632,
"orig": "손바닥을 내밀어 푸른 반달 방벽을 세움",
"scale": 1.62
},
"skill": {
"src": "art/h2/magusgirl/skill.webp",
"w": 685,
"h": 671,
"ax": 312,
"ay": 668,
"orig": "한쪽 무릎을 꿇고 손가락으로 바닥에 붉은 마법진을 그림",
"scale": 1.62
},
"dash": {
"src": "art/h2/magusgirl/dash.webp",
"w": 710,
"h": 573,
"ax": 263,
"ay": 570,
"orig": "로브를 휘날리며 몸을 눕혀 오른쪽으로 미끄러지듯 날아감",
"scale": 1.62
},
"slam": {
"src": "art/h2/magusgirl/slam.webp",
"w": 512,
"h": 711,
"ax": 297,
"ay": 708,
"orig": "공중에서 지팡이를 땅에 내리꽂아 붉은 폭발 · 파편",
"scale": 1.62
},
"attack": {
"src": "art/h2/magusgirl/attack.webp",
"w": 740,
"h": 624,
"ax": 331,
"ay": 621,
"orig": "다리를 벌리고 지팡이를 오른쪽으로 내지름, 도끼날 끝에 붉은 소용돌이",
"scale": 1.62
}
}
},
"majin": {
"slug": "majin",
"name": "마신족 병사",
"rank": "병사 (그림 제목은 \"마신족 보스\")",
"folder": "마신족 병사",
"role": "적 (마신족 병사 — 무리로 나오는 적. 크게 키우면 소보스로도)",
"tall": 2.3,
"weight": 170,
"palette": [
"#aa4e6d",
"#7b3d50",
"#433436",
"#2b2b2b",
"#e3d8bf"
],
"missing": [
"attack (내려친 뒤)",
"walk",
"hurt",
"down",
"dead",
"fly (날개)",
"back"
],
"kit": {
"basic": "철퇴 치기 (idle 에서 휘두름) — 앞 2.5m 부채꼴 90도",
"skills": [
{
"name": "마신 내려찍기",
"pose": "windup",
"desc": "1초 치켜든 뒤 앞 3m 내려찍기 — 반지름 2m 원 큰 피해 + 넘어뜨림 (치켜드는 동안 맞으면 끊김)"
},
{
"name": "철퇴 쓸어치기",
"pose": "front",
"desc": "두 손으로 자루를 잡고 옆으로 쓸기 — 앞 3m 부채꼴 160도, 맞은 적 2m 밀쳐냄"
},
{
"name": "날개 뛰기",
"pose": "idle",
"desc": "날개를 펴 8m 도약해 적 뒤로 내려앉음 (날기 그림 없음 — idle 로 대신)"
}
],
"passive": "마신족 무리: 근처 10m 에 다른 마신족이 있으면 공격 +10% (최대 3마리)"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 1,
"stealth": 0
},
"tag": "soldier",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 700,
"atk": 40,
"spd": 5.0,
"weight_kg": 170,
"tall_m": 2.3
},
"desc": "용 머리에 굽은 숫양 뿔, 박쥐 날개와 꼬리를 단 마신족 병사. 해진 자홍색 천을 두르고 가시 철퇴를 든다.",
"gen": 3,
"portrait": "art/h2/majin/portrait.webp",
"face": "art/h2/majin/face.webp",
"poses": {
"idle": {
"src": "art/h2/majin/idle.webp",
"w": 593,
"h": 686,
"ax": 280,
"ay": 683,
"orig": "옆모습, 철퇴를 한 손으로 늘어뜨리고 서 있음",
"scale": 1.1
},
"front": {
"src": "art/h2/majin/front.webp",
"w": 632,
"h": 801,
"ax": 345,
"ay": 798,
"orig": "앞모습 (3/4), 두 손으로 철퇴 자루를 비스듬히 쥠, 날개 펼침",
"scale": 1.1
},
"windup": {
"src": "art/h2/majin/windup.webp",
"w": 684,
"h": 853,
"ax": 320,
"ay": 850,
"orig": "두 손으로 가시 철퇴를 머리 위로 치켜듦 (내려찍기 직전), 다리 벌려 낮춤",
"scale": 1.1
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
"orig": "뒤로 쓰러짐 (철퇴 쥔 채)",
"flat": true
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
},
"walk_b": {
"src": "art/h2/mangak/walk_b.webp",
"w": 964,
"h": 698,
"ax": 500,
"ay": 695,
"orig": "어슬렁 서기 (꼬리 들고 네 발로 버팀, 망각2 walk 의 새 그림판)",
"scale": 1.13
},
"attack_b": {
"src": "art/h2/mangak/attack_b.webp",
"w": 1162,
"h": 686,
"ax": 470,
"ay": 683,
"orig": "앞발 갈퀴 뻗어 뛰어들기 (입 벌림, 망각2 attack 의 새 그림판)",
"scale": 1.13
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
"orig": "엎드려 쓰러짐 (머리 오른쪽)",
"flat": true
},
"slam": {
"src": "art/h2/manghyang/slam.webp",
"w": 610,
"h": 590,
"ax": 300,
"ay": 587,
"orig": "한쪽 무릎 꿇고 착지하며 오른손 갈퀴로 땅 내리찍기 (검은 · 분홍 파편 폭발, 왼손 갈퀴 뒤로 치켜듦)",
"scale": 0.703
},
"back": {
"src": "art/h2/manghyang/back.webp",
"w": 446,
"h": 673,
"ax": 234,
"ay": 670,
"orig": "등 돌려 어깨 너머로 보며 웃음, 두 갈퀴손에 분홍 기운을 모음 (검은 깃털 흩날림) — 뒷모습 · 기 모으기로 씀",
"scale": 0.703
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
"mari": {
"slug": "mari",
"name": "마리",
"rank": "1기 NPC (등급 글자 없음 — 파일 이름 '마리1~3', 도감: 마리 · NPC · 부족 전사)",
"folder": "3기-2 (마리1.png · 마리2.png · 마리3.png)",
"role": "둘 다 (도감에서는 NPC — 창을 쓰는 부족 전사, 와킨과 사실혼 관계인 파트너. 이번에 전투 동작 24장이 와서 영입 동료로 쓰기 좋고, 부족 쪽 적 우두머리로도 쓸 수 있음)",
"tall": 1.95,
"weight": 95,
"palette": [
"#1b160f",
"#363026",
"#bca061",
"#e2c45a",
"#6e6447"
],
"missing": [
"walk",
"hurt",
"down",
"dead (쓰러지는 그림 없음 — crouch 로 대신)"
],
"kit": {
"basic": "창 찌르기 (attack) — 앞 3m 줄 찌르기, 2번째 적까지 관통",
"skills": [
{
"name": "창 돌진",
"pose": "dash",
"desc": "8m 돌진, 처음 맞은 적을 창에 걸어 2m 밀고 넘어뜨림 (공격력 1.6배). 재사용 9초"
},
{
"name": "투창",
"pose": "aim",
"desc": "aim (0.5초 조준) → throw: 22m 사격, 줄 위 적 2명 관통 (공격력 1.8배). 등에 멘 여분 창 (back 그림) 3자루까지 연달아, 다 쓰면 12초 뒤 채움"
},
{
"name": "하늘 내리꽂기",
"pose": "slam",
"desc": "jump 로 6m 도약 → slam: 떨어진 자리 반지름 3.5m 원 충격, 넘어뜨림 + 돌 파편 (반지름 5m 안 작은 피해). 재사용 12초"
},
{
"name": "금빛 원 베기",
"pose": "spin",
"desc": "창을 한 바퀴 휘둘러 반지름 3m 원 360도 피해 + 1.5m 밀치기. 둘러싸였을 때"
}
],
"passive": "부족 전사의 피: 적을 쓰러뜨릴 때마다 6초 동안 공격력 +10% (3번 겹침), 넘어뜨리기에 30% 덜 밀림"
},
"apt": {
"melee": 4,
"spear": 5,
"bow": 2,
"gun": 0,
"magic": 0,
"stealth": 2
},
"tag": "soldier",
"role_job": "선봉",
"bag": 12,
"stats": {
"hp": 1500,
"atk": 42,
"spd": 5.2,
"weight_kg": 95,
"tall_m": 1.95
},
"desc": "금빛 긴 머리 · 금테 두른 검은 가시 갑옷 · 금빛 깃털 망토의 키 큰 부족 여전사. 창 한 자루로 찌르고 던지고 내리꽂는다. 와킨 (철퇴)과 함께 다니는 짝.",
"gen": 1,
"codex_g": "mari",
"batch": "3기-2",
"portrait": "art/h2/mari/portrait.webp",
"face": "art/h2/mari/face.webp",
"poses": {
"idle": {
"src": "art/h2/mari/idle.webp",
"w": 417,
"h": 759,
"ax": 191,
"ay": 756,
"orig": "창을 오른손에 세워 쥐고 똑바로 서서 웃음 (가장 반듯한 선 모습, 반쯤 앞을 봄)",
"scale": 1.4
},
"idle2": {
"src": "art/h2/mari/idle2.webp",
"w": 489,
"h": 720,
"ax": 247,
"ay": 717,
"orig": "창을 세워 쥐고 서서 노려봄 (반쯤 앞모습, 발밑 돌 부스러기)",
"scale": 1.4
},
"front": {
"src": "art/h2/mari/front.webp",
"w": 491,
"h": 706,
"ax": 196,
"ay": 703,
"orig": "앞모습, 왼손에 창을 세우고 오른손을 내밀며 웃음 (도발)",
"scale": 1.4
},
"back": {
"src": "art/h2/mari/back.webp",
"w": 426,
"h": 664,
"ax": 254,
"ay": 661,
"orig": "뒷모습, 등에 창 여러 자루를 묶어 메고 주먹을 쥠, 어깨 너머 오른쪽을 봄",
"scale": 1.4
},
"attack": {
"src": "art/h2/mari/attack.webp",
"w": 731,
"h": 547,
"ax": 82,
"ay": 544,
"orig": "크게 내디디며 두 손으로 창을 앞으로 찌름 (발밑 흙먼지)",
"scale": 1.4
},
"dash": {
"src": "art/h2/mari/dash.webp",
"w": 630,
"h": 510,
"ax": 180,
"ay": 507,
"orig": "몸을 낮게 던져 창을 앞세우고 돌진 (머리 · 털망토 뒤로 휘날림, 흙먼지)",
"scale": 1.4
},
"jump": {
"src": "art/h2/mari/jump.webp",
"w": 504,
"h": 685,
"ax": 372,
"ay": 682,
"orig": "땅에 꽂은 창을 짚고 장대뛰기처럼 몸을 띄움 (창끝 돌 파편)",
"scale": 1.4
},
"leap": {
"src": "art/h2/mari/leap.webp",
"w": 574,
"h": 673,
"ax": 258,
"ay": 670,
"orig": "던진 창이 땅에 꽂힌 뒤 한 손을 뻗은 채 공중으로 뛰어오름 (창 궤적 선 · 돌 파편)",
"scale": 1.4
},
"slam": {
"src": "art/h2/mari/slam.webp",
"w": 465,
"h": 717,
"ax": 222,
"ay": 714,
"orig": "공중에서 두 손으로 창을 거꾸로 내리꽂아 땅이 터짐 (큰 돌 파편 · 빛 줄기)",
"scale": 1.4
},
"spin": {
"src": "art/h2/mari/spin.webp",
"w": 773,
"h": 616,
"ax": 270,
"ay": 613,
"orig": "뒤돌아선 채 창을 크게 휘둘러 둥근 금빛 궤적 (원 베기)",
"scale": 1.4
},
"kneel": {
"src": "art/h2/mari/kneel.webp",
"w": 717,
"h": 681,
"ax": 251,
"ay": 678,
"orig": "한 무릎 꿇고 창을 비스듬히 위로 찔러 올림 (대공 찌르기)",
"scale": 1.4
},
"guard": {
"src": "art/h2/mari/guard.webp",
"w": 694,
"h": 571,
"ax": 247,
"ay": 568,
"orig": "다리를 넓게 벌리고 창을 낮게 비스듬히 겨눈 수비 자세",
"scale": 1.4
},
"windup": {
"src": "art/h2/mari/windup.webp",
"w": 577,
"h": 720,
"ax": 434,
"ay": 717,
"orig": "창을 머리 위로 치켜들어 던지기 직전, 외침 (옆 그림과 붙어 있어 다각형으로 가름)",
"scale": 1.4
},
"aim": {
"src": "art/h2/mari/aim.webp",
"w": 710,
"h": 700,
"ax": 332,
"ay": 697,
"orig": "창을 머리 위 뒤로 당기고 왼손으로 과녁을 가리킴 (투창 조준, 옆 그림과 붙어 있어 다각형으로 가름)",
"scale": 1.4
},
"throw": {
"src": "art/h2/mari/throw.webp",
"w": 839,
"h": 630,
"ax": 302,
"ay": 627,
"orig": "뒷모습으로 창을 던진 직후 — 창이 앞으로 날아가고 손을 뻗음",
"scale": 1.4
},
"bash": {
"src": "art/h2/mari/bash.webp",
"w": 521,
"h": 622,
"ax": 242,
"ay": 619,
"orig": "창을 짧게 쥐고 창 자루 끝으로 앞을 내지름 (자루 치기, 이를 드러냄, attack 창끝과 붙어 있어 다각형으로 가름)",
"scale": 1.4
},
"crouch": {
"src": "art/h2/mari/crouch.webp",
"w": 570,
"h": 463,
"ax": 199,
"ay": 460,
"orig": "쭈그려 앉아 창을 땅에 눕혀 쥐고 노려봄 (매복 · 쉬기)",
"scale": 1.4
}
}
},
"mintbeast": {
"slug": "mintbeast",
"name": "민트괴수 (민트 외눈 괴수)",
"rank": "미정 (폴더에 등급 없음 · 그림 제목은 \"보스\")",
"folder": "민트괴수",
"role": "보스 (또는 강적 — 그림 제목이 보스 시트)",
"tall": 3.1,
"weight": 240,
"palette": [
"#1f2222",
"#3b3f3f",
"#687069",
"#89a094",
"#8fdcc0"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"back",
"crawl (기어가기)"
],
"kit": {
"basic": "갈퀴 할퀴기 — 앞 3m 부채꼴 120도",
"skills": [
{
"name": "둥근 아가리",
"pose": "attack",
"desc": "5m 덮치며 둥근 이빨 입으로 물기 — 큰 피해 + 피해의 30% 회복, 맞은 적 1초 붙잡힘"
},
{
"name": "외눈 응시",
"pose": "front",
"desc": "검은 눈구멍으로 바라봄 — 앞 12m 줄, 맞은 적 2초 굳음 (돌아서 있으면 안 걸림)"
},
{
"name": "누더기 숨기",
"pose": "idle",
"desc": "몸을 숙여 4초 은신 이동 (반투명), 은신 뒤 첫 공격 피해 +50%"
}
],
"passive": "누더기 그림자: 어두운 곳에서 받는 원거리 공격 명중 −30%, 등의 가지 뿔에 원거리 피해 15% 감소"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 4
},
"tag": "beast",
"role_job": "척후",
"bag": 6,
"stats": {
"hp": 2400,
"atk": 55,
"spd": 5.5,
"weight_kg": 240,
"tall_m": 3.1
},
"desc": "민트빛 긴 머리카락이 얼굴을 덮은 외눈 괴물. 비늘 몸에 누더기를 두르고 등에서 사슴뿔 같은 가지가 뻗으며, 머리카락 속 둥근 아가리로 문다.",
"gen": 3,
"portrait": "art/h2/mintbeast/portrait.webp",
"face": "art/h2/mintbeast/face.webp",
"poses": {
"idle": {
"src": "art/h2/mintbeast/idle.webp",
"w": 371,
"h": 698,
"ax": 145,
"ay": 695,
"orig": "옆모습, 구부정히 숙이고 긴 팔과 갈퀴를 늘어뜨림",
"scale": 0.9
},
"front": {
"src": "art/h2/mintbeast/front.webp",
"w": 432,
"h": 752,
"ax": 217,
"ay": 749,
"orig": "앞모습, 민트 머리카락 사이 검은 외눈 (구멍) 이 정면을 봄",
"scale": 0.9
},
"attack": {
"src": "art/h2/mintbeast/attack.webp",
"w": 682,
"h": 677,
"ax": 319,
"ay": 674,
"orig": "낮게 덮치며 머리카락 사이 둥근 이빨 아가리를 벌리고 두 갈퀴손을 뻗음",
"scale": 0.9
}
}
},
"moro": {
"slug": "moro",
"name": "모로",
"rank": "5성",
"folder": "3기-2/5성모로",
"role": "동료 (5성 = 높은 등급 동료. 파일에 역할 글자 없음 — 낫 팔 근접형으로 봄)",
"tall": 1.75,
"weight": 60,
"palette": [
"#3c3439",
"#eadfd6",
"#89858f",
"#8a5a62",
"#1e1c1e"
],
"missing": [
"walk",
"run",
"fly (날개로 날기)",
"hurt",
"down",
"dead",
"back"
],
"kit": {
"basic": "낫 팔 휘두르기 (attack) — 앞 3m 부채꼴 160도, 2타",
"skills": [
{
"name": "난도질",
"pose": "attack2",
"desc": "앞 4m 부채꼴 90도 5연타 할퀴기 + 출혈 3초 (초당 공격력 20%)"
},
{
"name": "나방 찌르기",
"pose": "skill",
"desc": "돌진 · 줄 — 6m 앞으로 긴 낫 팔을 내찌르며 미끄러짐, 줄 위 적 모두 관통 피해"
},
{
"name": "가루 날개",
"pose": "guard",
"desc": "막기 — 2초 동안 날개로 몸을 감싸 모든 방향 피해 70% 감소, 끝날 때 반지름 4m 인분 가루 장판 4초 (안의 적 명중 -30%)"
},
{
"name": "급강하",
"pose": "crouch",
"desc": "도약 — 8m 앞 지점으로 날아 내려앉음, 반지름 3m 원 피해 + 넘어뜨림. 쓰러진 적에게는 low (쓸어베기) 로 확인사살 (피해 2배)"
}
],
"passive": "밤나방: 어두운 곳 (동굴 · 밤) 에서 이동 +10% · 회피 +10%. 싸우지 않을 때는 idle2 (하품) 로 졸음"
},
"apt": {
"melee": 5,
"spear": 2,
"bow": 0,
"gun": 0,
"magic": 1,
"stealth": 3
},
"tag": "beast",
"role_job": "척후",
"bag": 8,
"stats": {
"hp": 1300,
"atk": 48,
"spd": 6.5,
"weight_kg": 60,
"tall_m": 1.75
},
"desc": "더듬이와 흰 털 목도리, 회청 무늬 나방 날개 넷, 톱날 낫 같은 두 팔을 가진 5성 나방 여인. 늘 졸린 얼굴이지만 낫 팔로 휘몰아치듯 베는 근접형.",
"gen": 1,
"codex_g": "moro",
"batch": "3기-2",
"portrait": "art/h2/moro/portrait.webp",
"face": "art/h2/moro/face.webp",
"poses": {
"idle": {
"src": "art/h2/moro/idle.webp",
"w": 393,
"h": 696,
"ax": 202,
"ay": 693,
"orig": "앞모습에 가깝게 서서 낫 팔과 날개를 몸 앞으로 모음 (3/4, 오른쪽)",
"scale": 1.63
},
"attack": {
"src": "art/h2/moro/attack.webp",
"w": 735,
"h": 717,
"ax": 384,
"ay": 714,
"orig": "몸을 돌리며 두 낫 팔을 크게 휘둘러 원을 그림 (베기 궤적)",
"scale": 1.63
},
"attack2": {
"src": "art/h2/moro/attack2.webp",
"w": 544,
"h": 689,
"ax": 243,
"ay": 686,
"orig": "오른손 손톱을 뻗어 여러 줄 할퀴기 궤적 (연속 할퀴기)",
"scale": 1.63
},
"skill": {
"src": "art/h2/moro/skill.webp",
"w": 931,
"h": 663,
"ax": 470,
"ay": 660,
"orig": "다리를 벌리고 긴 낫 팔을 앞으로 곧게 내찔러 뻗음 (찌르기 궤적)",
"scale": 1.63
},
"guard": {
"src": "art/h2/moro/guard.webp",
"w": 525,
"h": 655,
"ax": 263,
"ay": 652,
"orig": "날개 네 장과 낫 팔로 몸을 감싸 웅크림 (막기)",
"scale": 1.63
},
"low": {
"src": "art/h2/moro/low.webp",
"w": 791,
"h": 649,
"ax": 532,
"ay": 646,
"orig": "낮게 런지하며 낫 팔로 땅을 쓸어 벰 (발밑 궤적)",
"scale": 1.63
},
"crouch": {
"src": "art/h2/moro/crouch.webp",
"w": 986,
"h": 515,
"ax": 472,
"ay": 512,
"orig": "날개를 펼친 채 한 손으로 땅을 짚고 웅크려 착지",
"scale": 1.63
},
"idle2": {
"src": "art/h2/moro/idle2.webp",
"w": 566,
"h": 681,
"ax": 346,
"ay": 678,
"orig": "낫 팔을 들고 다른 손으로 입을 가리며 하품 (졸린 대기, 방울)",
"scale": 1.63
}
}
},
"mstar": {
"slug": "mstar",
"name": "모닝스타 (\"슈퍼스타\")",
"rank": "1기 동료 · E (등급 글자 없음 — 파일 이름 '모닝스타1'. LORE 원문 '##E' 칸, 도감: 모닝스타 · 동료)",
"folder": "3기-2 (모닝스타1.png)",
"role": "동료 (2D 판: 2층 보스 오르소를 이기면 영입 · 4층 영입 동료, LORE \"옛 1층 동료\". 게임 안 DEFS.morningstar 가 이미 있음 — 이 h2 slug 는 새 3D 전투 그림 묶음)",
"tall": 1.5,
"weight": 45,
"palette": [
"#110f0d",
"#4a4240",
"#f5e3db",
"#7a2e24",
"#d9b23c"
],
"missing": [
"walk",
"hurt",
"dead (down 으로 대신)",
"front"
],
"kit": {
"basic": "사슬 철퇴 휘두르기 (attack) — 앞 3.5m 부채꼴 120도, 맞은 자리 반지름 1m 주변 피해 (2D splashR 그대로)",
"skills": [
{
"name": "철퇴 던지기",
"pose": "attack2",
"desc": "사슬을 7m 줄로 내던져 처음 맞은 적에게 피해 (공격력 1.5배) + 발 앞 1.5m 로 끌어오기. 재사용 8초"
},
{
"name": "광란의 회전",
"pose": "spin",
"desc": "3초 동안 철퇴를 머리 위로 돌려 반지름 3m 원 0.4초마다 피해, 돌면서 걸을 수 있음 (이동 속도 −30%), 원거리 투사체 30% 튕김"
},
{
"name": "별 떨어뜨리기",
"pose": "windup",
"desc": "0.6초 치켜든 뒤 앞 4m 지점 반지름 1.8m 원 내려찍기 — 넘어뜨림 + 1초 기절. 재사용 10초"
}
],
"passive": "슈퍼스타의 광기: 잃은 체력 10%마다 공격력 +4%. 전투마다 한 번, 쓰러지면 (down) 2초 뒤 체력 20%로 웃으며 일어남"
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
"hp": 950,
"atk": 40,
"spd": 5.0,
"weight_kg": 45,
"tall_m": 1.5
},
"desc": "검은 트윈테일 · 노란 별 눈 · 송곳니의 작은 광기 소녀. 녹슨 가시 철퇴를 사슬째 휘두르는 근딜, 별명 \"슈퍼스타\".",
"gen": 1,
"codex_g": "morningstar",
"batch": "3기-2",
"portrait": "art/h2/mstar/portrait.webp",
"face": "art/h2/mstar/face.webp",
"poses": {
"idle": {
"src": "art/h2/mstar/idle.webp",
"w": 480,
"h": 696,
"ax": 287,
"ay": 693,
"orig": "철퇴를 땅에 늘어뜨린 채 서서 손톱 세운 손을 들고 송곳니를 드러냄 (광기 어린 대기)",
"scale": 1.65
},
"attack": {
"src": "art/h2/mstar/attack.webp",
"w": 833,
"h": 710,
"ax": 310,
"ay": 707,
"orig": "다리를 넓게 벌리고 두 손으로 사슬을 당겨 가시 철퇴를 옆으로 크게 휘두름, 씩 웃음",
"scale": 1.65
},
"attack2": {
"src": "art/h2/mstar/attack2.webp",
"w": 936,
"h": 614,
"ax": 397,
"ay": 611,
"orig": "크게 내디디며 사슬을 앞으로 내던져 철퇴를 멀리 뻗음 (철퇴 던지기)",
"scale": 1.65
},
"windup": {
"src": "art/h2/mstar/windup.webp",
"w": 584,
"h": 870,
"ax": 265,
"ay": 867,
"orig": "한 팔로 사슬을 높이 들어 철퇴를 머리 위로 치켜듦, 외침 (내려찍기 직전)",
"scale": 1.65
},
"spin": {
"src": "art/h2/mstar/spin.webp",
"w": 688,
"h": 822,
"ax": 280,
"ay": 819,
"orig": "두 팔을 머리 위로 들어 사슬 철퇴를 머리 위에서 빙빙 돌림",
"scale": 1.65
},
"crouch": {
"src": "art/h2/mstar/crouch.webp",
"w": 526,
"h": 574,
"ax": 298,
"ay": 571,
"orig": "쭈그려 앉아 사슬을 몸에 감고 음흉하게 웃음 (철퇴는 발치에)",
"scale": 1.65
},
"down": {
"src": "art/h2/mstar/down.webp",
"w": 688,
"h": 393,
"ax": 295,
"ay": 390,
"orig": "옆으로 쓰러져 엎드린 채 이를 악물고 노려봄 (사슬 늘어짐)",
"flat": true,
"scale": 1.65
},
"back": {
"src": "art/h2/mstar/back.webp",
"w": 559,
"h": 741,
"ax": 229,
"ay": 738,
"orig": "뒷모습, 어깨 너머로 오른쪽을 보며 철퇴를 아래로 늘어뜨림",
"scale": 1.65
}
}
},
"mulle": {
"slug": "mulle",
"name": "물레",
"rank": "5성 (업적보상)",
"folder": "3기-2/5성 업적보상 정령서포터 앰버서더 물레",
"role": "동료 (5성 업적보상 = 업적을 달성하면 얻는 동료. 정령 서포터 → 지원)",
"tall": 1.72,
"weight": 55,
"palette": [
"#97baf1",
"#b02a2a",
"#d8b04a",
"#b070c0",
"#5d5c78"
],
"missing": [
"walk",
"run",
"hurt",
"down",
"dead",
"front"
],
"kit": {
"basic": "정령 지시 (attack) — 손가락으로 가리켜 물 정령 탄 1발, 12m 사격 단일, 1초 이동 -20%",
"skills": [
{
"name": "정령의 손길",
"pose": "cast",
"desc": "치유 — 10m 안 아군 1명 체력 25% 즉시 회복 + 4초 동안 초당 2% 회복"
},
{
"name": "정령 방벽",
"pose": "guard",
"desc": "막기 — 앞 3m 에 너비 4m 물 장막 4초, 원거리 공격을 막고 닿은 근접 적을 2m 밀어냄"
},
{
"name": "정령 강림",
"pose": "skill",
"desc": "장판 — 반지름 8m 원 6초, 안의 아군 초당 3% 회복 · 이동 +15%, 적 이동 -30%"
},
{
"name": "땅의 정령 부르기",
"pose": "kneel",
"desc": "소환 — 무릎 꿇고 작은 정령 1체를 20초 부름. 정령은 체력이 가장 낮은 아군을 따라다니며 3초마다 회복탄 (5%)"
}
],
"passive": "정령 계약 (업적보상 앰버서더): 파티 전원 최대 체력 +8%, 쓰러진 아군 살리는 시간 50% 단축. 정령 · 요정 쪽 마을에서 bow 로 대화 선택지"
},
"apt": {
"melee": 0,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 1
},
"tag": "mage",
"role_job": "지원",
"bag": 8,
"stats": {
"hp": 900,
"atk": 28,
"spd": 6.0,
"weight_kg": 55,
"tall_m": 1.72
},
"desc": "푸른 피부에 붉은 눈, 단발머리에 작은 붉은 관을 쓴 5성 업적보상 동료. 정령을 부리는 앰버서더 (대사) 로, 치유 · 방벽 · 장판으로 파티를 지킨다.",
"gen": 3,
"codex_g": "N-023a",
"batch": "3기-2",
"portrait": "art/h2/mulle/portrait.webp",
"face": "art/h2/mulle/face.webp",
"poses": {
"idle": {
"src": "art/h2/mulle/idle.webp",
"w": 164,
"h": 699,
"ax": 82,
"ay": 696,
"orig": "옆모습으로 반듯이 서서 손을 가슴에 얹음",
"scale": 1.48
},
"cast": {
"src": "art/h2/mulle/cast.webp",
"w": 374,
"h": 704,
"ax": 127,
"ay": 701,
"orig": "손바닥을 위로 해 앞으로 내밂 (정령에게 내주는 손짓 · 치유)",
"scale": 1.48
},
"guard": {
"src": "art/h2/mulle/guard.webp",
"w": 346,
"h": 710,
"ax": 85,
"ay": 707,
"orig": "팔을 곧게 뻗어 손바닥을 세움 (멈춰 · 막기)",
"scale": 1.48
},
"kneel": {
"src": "art/h2/mulle/kneel.webp",
"w": 441,
"h": 509,
"ax": 166,
"ay": 506,
"orig": "한쪽 무릎 꿇고 손을 앞으로 뻗음 (땅의 정령 부르기)",
"scale": 1.48
},
"attack": {
"src": "art/h2/mulle/attack.webp",
"w": 454,
"h": 739,
"ax": 115,
"ay": 736,
"orig": "팔을 곧게 뻗어 손가락으로 가리킴 (정령에게 공격 지시)",
"scale": 1.48
},
"back": {
"src": "art/h2/mulle/back.webp",
"w": 238,
"h": 734,
"ax": 113,
"ay": 731,
"orig": "뒷모습 (돌아봄)",
"scale": 1.48
},
"bow": {
"src": "art/h2/mulle/bow.webp",
"w": 222,
"h": 718,
"ax": 104,
"ay": 715,
"orig": "손을 가슴에 얹고 허리 숙여 인사",
"scale": 1.48
},
"skill": {
"src": "art/h2/mulle/skill.webp",
"w": 303,
"h": 744,
"ax": 81,
"ay": 741,
"orig": "두 손을 얼굴 앞으로 들어 올려 정령을 받드는 시전",
"scale": 1.48
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
"orig": "펄기본 — 날개 접고 서서 웃음",
"scale": 0.711
},
"attack": {
"src": "art/h2/pearl/attack.webp",
"w": 639,
"h": 700,
"ax": 433,
"ay": 697,
"orig": "펄 공격 — 손바닥 뻗어 밀치기 (날개 펼침)",
"scale": 0.711
},
"land": {
"src": "art/h2/pearl/land.webp",
"w": 505,
"h": 705,
"ax": 338,
"ay": 702,
"orig": "착지 / 꼬깃꼬깃 — 발 구르며 내려앉기 (땅 깨짐 효과)",
"scale": 0.711
},
"special": {
"src": "art/h2/pearl/special.webp",
"w": 665,
"h": 693,
"ax": 360,
"ay": 690,
"orig": "철 특수기 / 공격 — 뒤돌아 손 뻗어 검은 깃털 날리기 (깃털 효과 포함)",
"scale": 0.711
},
"crouch": {
"src": "art/h2/pearl/crouch.webp",
"w": 340,
"h": 428,
"ax": 150,
"ay": 425,
"orig": "펄 앉기 — 쪼그려 앉아 자기 몸 감쌈 (겁먹음)",
"scale": 0.52
},
"down": {
"src": "art/h2/pearl/down.webp",
"w": 579,
"h": 257,
"ax": 304,
"ay": 254,
"orig": "넘어짐 — 엎어져 아파함",
"flat": true,
"scale": 0.52
}
}
},
"rain": {
"slug": "rain",
"name": "레임 (외계 민달팽이왕)",
"rank": "중간급",
"folder": "중간급 레인",
"role": "적 (보스급 중간 적 — 티어표 \"문명 초월의 기준 2명\" 의 외계 민달팽이왕. 여왕형 보스)",
"tall": 2.2,
"weight": 260,
"palette": [
"#f8ee2c",
"#2c2c27",
"#1d1910",
"#fbf375",
"#aba43c"
],
"missing": [
"back",
"walk (미끄러지기)",
"hurt",
"down",
"dead (녹아내림)",
"cast (점액 뿌리기)"
],
"kit": {
"basic": "점액 갈퀴 (attack) — 앞 4m 부채꼴 120도, 1.5초 둔화 40%",
"skills": [
{
"name": "늘어나는 손",
"pose": "attack",
"desc": "점액 팔을 7m 줄로 늘여 할퀴고, 맞은 적을 2m 끌어옴 + 끈적임 (3초 점프 · 구르기 불가)"
},
{
"name": "왕의 점액길",
"pose": "idle",
"desc": "5초 동안 지나간 자리에 점액 장판 (폭 2m, 8초 유지): 적 둔화 50% + 초당 작은 산성 피해, 자신은 그 위에서 이동 +30%"
},
{
"name": "산성 왕관",
"pose": "front",
"desc": "검은 뿔 왕관에서 산성 방울을 반경 6m 원으로 흩뿌림: 방어 -20% 6초 (갑옷 부식)"
}
],
"passive": "흐르는 몸: 물리 피해 20% 감소, 불 피해 25% 더 받음. 바닥에 점액 흔적을 남김"
},
"apt": {
"melee": 4,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 3,
"stealth": 1
},
"tag": "beast",
"role_job": "선봉",
"bag": 0,
"stats": {
"hp": 3000,
"atk": 48,
"spd": 3.8,
"weight_kg": 260,
"tall_m": 2.2
},
"desc": "외계 민달팽이왕 \"레임\". 노란 점액이 흘러내리는 여왕 모습 (검은 얼굴 · 검은 뿔 왕관), 하체는 검은 드레스 같은 민달팽이 발 · 말린 꼬리.",
"gen": 3,
"portrait": "art/h2/rain/portrait.webp",
"face": "art/h2/rain/face.webp",
"poses": {
"front": {
"src": "art/h2/rain/front.webp",
"w": 626,
"h": 816,
"ax": 324,
"ay": 813,
"orig": "앞모습: 노란 점액 몸 + 검은 드레스형 민달팽이 하체, 검은 뿔 왕관, 늘어진 긴 손가락",
"scale": 1.12
},
"idle": {
"src": "art/h2/rain/idle.webp",
"w": 458,
"h": 697,
"ax": 230,
"ay": 694,
"orig": "옆모습 (오른쪽 봄): 고개 숙이고 점액을 흘리며 섬, 꼬리 끝이 뒤로 말림",
"scale": 1.12
},
"attack": {
"src": "art/h2/rain/attack.webp",
"w": 905,
"h": 510,
"ax": 284,
"ay": 507,
"orig": "몸을 앞으로 숙이고 점액 팔을 길게 늘여 갈퀴처럼 할큄 (점액 방울 튐)",
"scale": 1.12
}
}
},
"ratknight": {
"slug": "ratknight",
"name": "쥐 기사 (포렌의 쥐 · 이름 없는 방패창병)",
"rank": "유닛 (이름 없는 쥐 기사, 생환하면 이름 · 3~4번 생환하면 쥐 베테랑)",
"folder": "3기-2/포렌의 쥐들",
"role": "동료 (포렌의 쥐 군대 — 포렌이 부름)",
"tall": 1.2,
"weight": 45,
"palette": [
"#9fd65a",
"#4b4a3f",
"#25231f",
"#6b4a32",
"#59603f"
],
"missing": [
"walk (dash 로 대신)",
"hurt",
"dead (down 으로 대신 — 누운 그림이 쉬는 듯 편안해 보임)",
"back · front"
],
"kit": {
"basic": "짧은 창 찌르기 (attack) — 앞 2.2m 줄, 방패를 앞에 둔 채 찌름",
"skills": [
{
"name": "창 거리 유지",
"pose": "stance",
"desc": "적이 1.6m 안으로 들어오면 0.4초 동안 1m 뒷걸음질하며 창끝을 겨눔 — 2.2m 거리를 지키며 견제 찌르기 (피해 70%), 쿨 4초"
},
{
"name": "방패 막기",
"pose": "guard",
"desc": "웅크려 둥근 방패를 앞세움 — 정면 90도 부채꼴에서 오는 근접 · 화살 피해 70% 감소, 최대 2초, 막는 동안 이동 불가, 쿨 6초"
},
{
"name": "돌격",
"pose": "dash",
"desc": "창을 앞세우고 6m 직선 돌진 — 처음 닿은 적에게 창 피해 130% + 1m 밀침, 벽에 박으면 멈춤, 쿨 10초"
}
],
"passive": "쥐 떼: 반지름 3m 안 다른 쥐 기사 1마리당 방어 +5% (최대 +15%). 생환 기록 — 전투 끝까지 살아 돌아오면 생환 +1, 첫 생환에 이름 (쥐기사 A, B …), 3~4번 생환하면 ratvet 로 승급"
},
"apt": {
"melee": 2,
"spear": 3,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 1
},
"tag": "soldier",
"role_job": "선봉",
"bag": 4,
"stats": {
"hp": 220,
"atk": 14,
"spd": 5.0,
"weight_kg": 45,
"tall_m": 1.2
},
"desc": "포렌 (쥐들의 대왕, 1인군단)이 부르는 쥐 군대의 이름 없는 방패창병. 녹색 땋은 머리에 쥐 귀 투구, 쥐 꼬리, 낡은 철 갑옷의 작은 소녀 모습. 대부분 전투에서 죽고, 살아 돌아온 쥐만 이름을 얻는다.",
"gen": 3,
"codex_g": "ratKnight",
"batch": "3기-2",
"portrait": "art/h2/ratknight/portrait.webp",
"face": "art/h2/ratknight/face.webp",
"poses": {
"idle": {
"src": "art/h2/ratknight/idle.webp",
"w": 477,
"h": 708,
"ax": 278,
"ay": 705,
"orig": "오른손에 짧은 창 세워 쥐고 왼팔에 둥근 철 방패, 반듯이 서서 앞을 봄 — 4단 크기 비교 시트 (같은 동작을 작게→크게 4번, 성장 단계 비교로도 보임) — 가장 큰 오른쪽 하나만 씀",
"scale": 0.95
},
"salute": {
"src": "art/h2/ratknight/salute.webp",
"w": 351,
"h": 720,
"ax": 236,
"ay": 717,
"orig": "오른손을 투구 챙에 붙여 경례, 방패는 등에 멤, 창 없음 — 4단 크기 비교 시트 (같은 동작을 작게→크게 4번, 성장 단계 비교로도 보임) — 가장 큰 오른쪽 하나만 씀",
"scale": 0.95
},
"command": {
"src": "art/h2/ratknight/command.webp",
"w": 485,
"h": 687,
"ax": 279,
"ay": 684,
"orig": "다리를 벌리고 서서 오른팔을 뒤쪽 (왼쪽)으로 곧게 뻗어 손바닥을 폄 — 길 안내 · 명령 대기 · 열 맞추기 손짓, 방패는 등에 — 4단 크기 비교 시트 (같은 동작을 작게→크게 4번, 성장 단계 비교로도 보임) — 가장 큰 오른쪽 하나만 씀",
"f": -1,
"scale": 0.95
},
"attack": {
"src": "art/h2/ratknight/attack.webp",
"w": 609,
"h": 548,
"ax": 280,
"ay": 545,
"orig": "앞발 내딛고 두 손으로 창을 수평으로 찌름, 왼팔 방패를 앞에 붙임 — 4단 크기 비교 시트 (같은 동작을 작게→크게 4번, 성장 단계 비교로도 보임) — 가장 큰 오른쪽 하나만 씀",
"scale": 0.95
},
"guard": {
"src": "art/h2/ratknight/guard.webp",
"w": 537,
"h": 573,
"ax": 299,
"ay": 570,
"orig": "낮게 쪼그려 앉아 둥근 방패 뒤로 몸을 숨기고 창은 비스듬히 위로 세움 (방패 막기) — 4단 크기 비교 시트 (같은 동작을 작게→크게 4번, 성장 단계 비교로도 보임) — 가장 큰 오른쪽 하나만 씀",
"scale": 0.95
},
"stance": {
"src": "art/h2/ratknight/stance.webp",
"w": 536,
"h": 692,
"ax": 294,
"ay": 689,
"orig": "다리 벌려 버티고 방패를 앞세운 채 창을 허리 높이에서 비스듬히 앞으로 겨눔 (거리 유지 · 찌르기 준비) — 4단 크기 비교 시트 (같은 동작을 작게→크게 4번, 성장 단계 비교로도 보임) — 가장 큰 오른쪽 하나만 씀",
"scale": 0.95
},
"down": {
"src": "art/h2/ratknight/down.webp",
"w": 520,
"h": 428,
"ax": 368,
"ay": 425,
"orig": "옆으로 누워 팔꿈치로 상체를 받치고 창은 앞 바닥에 놓임, 방패는 등 뒤, 꼬리 위로 — 쓰러짐 (쉬는 모습으로도 보임) — 4단 크기 비교 시트 (같은 동작을 작게→크게 4번, 성장 단계 비교로도 보임) — 가장 큰 오른쪽 하나만 씀",
"flat": true,
"scale": 0.95
},
"dash": {
"src": "art/h2/ratknight/dash.webp",
"w": 581,
"h": 622,
"ax": 265,
"ay": 619,
"orig": "창을 앞으로 수평으로 겨누고 방패 들고 크게 뛰어 달림, 땋은 머리 · 꼬리 뒤로 날림 (돌격) — 4단 크기 비교 시트 (같은 동작을 작게→크게 4번, 성장 단계 비교로도 보임) — 가장 큰 오른쪽 하나만 씀",
"scale": 0.95
}
}
},
"ratsmall": {
"slug": "ratsmall",
"name": "일반 쥐 (포렌의 쥐)",
"rank": "유닛 (일반쥐)",
"folder": "3기-2/포렌의 쥐들",
"role": "동료 (포렌의 쥐 군대 — 포렌이 부름)",
"tall": 0.25,
"weight": 0.4,
"palette": [
"#0d0d0d",
"#1e1e1e",
"#3a3a3a",
"#7a7a7a",
"#a8e030"
],
"missing": [
"attack (물기)",
"run 따로 (idle 을 호다닥 달리기로 같이 씀)",
"hurt",
"dead"
],
"kit": {
"basic": "물기 — 앞 0.5m, 작은 피해, 0.3초마다",
"skills": [
{
"name": "호다닥",
"pose": "idle",
"desc": "낮게 몸을 깔고 8m 를 빠르게 달려 적 발밑에 붙음 — 붙은 적 이동 속도 −10% (쥐가 여럿이면 겹침, 최대 −30%)"
},
{
"name": "따라 물기",
"pose": "idle",
"desc": "쥐 베테랑의 '작은 표식'이 찍힌 적을 따라가 4초 동안 물어뜯음 (초당 작은 피해)"
}
],
"passive": "작은 몸: 원거리 공격에 맞을 확률 −40%, 대신 한두 대면 죽음"
},
"apt": {
"melee": 1,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 4
},
"tag": "beast",
"role_job": "척후",
"bag": 0,
"stats": {
"hp": 12,
"atk": 3,
"spd": 7.5,
"weight_kg": 0.4,
"tall_m": 0.25
},
"desc": "포렌이 부르는 진짜 검은 쥐 한 마리. 초록 눈, 검은 털, 긴 꼬리. 떼로 몰려 발밑을 물고 다님.",
"gen": 3,
"batch": "3기-2",
"portrait": "art/h2/ratsmall/portrait.webp",
"face": "art/h2/ratsmall/face.webp",
"poses": {
"idle": {
"src": "art/h2/ratsmall/idle.webp",
"w": 926,
"h": 329,
"ax": 480,
"ay": 326,
"orig": "검은 쥐 한 마리 옆모습, 네 발로 낮게 걷는 (호다닥) 기본 자세, 초록 눈 · 긴 꼬리 · 수염",
"scale": 0.92
}
}
},
"ratvet": {
"slug": "ratvet",
"name": "쥐 베테랑 (포렌의 쥐 · 3~4번 생환한 쥐 기사)",
"rank": "베테랑 (쥐 기사 승급형)",
"folder": "3기-2/포렌의 쥐들",
"role": "동료 (포렌의 쥐 군대 — 포렌이 부름, 베테랑은 로비에서 포렌을 졸졸 따라다님)",
"tall": 1.25,
"weight": 62,
"palette": [
"#8fd04a",
"#5b6340",
"#2a2824",
"#e8a530",
"#efe3c8",
"#3f5233"
],
"missing": [
"walk · run",
"hurt",
"dead (down 으로 대신)",
"front · back"
],
"kit": {
"basic": "긴 창 찌르기 (attack) — 앞 3m 줄. 적이 1.2m 안에 붙으면 등의 짧은 검으로 바꿔 찌르기 (sword_attack, 1.6m)",
"skills": [
{
"name": "구르기 방패 박치기 (무겁게)",
"pose": "bash",
"desc": "roll_in → roll_flip → bash: 앞으로 4m 굴러 (구르는 0.4초 무적) 큰 방패로 몸통 박치기 — 맞은 적 피해 160% + 2.5m 밀침 + 1초 기절, 무거워서 끝나고 본인도 0.6초 경직 (roll_land), 쿨 9초"
},
{
"name": "뒷구르기",
"pose": "broll_flip",
"desc": "broll_fall → broll_flip → broll_land: 뒤로 3m 굴러 빠짐, 0.3초 무적, 착지 뒤 1초 방패 막기 자동 — 위험할 때 (HP 30% 아래) 스스로도 씀, 쿨 7초"
},
{
"name": "작은 방진",
"pose": "guard2",
"desc": "무릎 꿇고 창을 세워 방패를 박음 (포렌 방진의 마이너 카피) — 4초 동안 반지름 2.5m 안 쥐 기사 최대 2마리와 받는 피해를 나눠 받음 (셋이 1/3씩), 정면 120도 근접 피해 50% 감소, 쿨 15초"
},
{
"name": "작은 표식",
"pose": "command",
"desc": "손을 뻗어 적 1명 지목 (포렌 표식의 마이너 카피, 찍!) — 6초 표식, 근처 일반 쥐 (ratsmall) 2마리가 달려와 따라 묾, 쥐 기사들의 다음 공격 +20%, 쿨 18초"
}
],
"passive": "베테랑의 근성: 첫 치명상 한 번은 HP 1로 버팀 (전투당 1번). 큰 장식 방패 — 정면 원거리 피해 35% 감소. 이름 있는 쥐 — 죽으면 포렌이 그 이름을 부름"
},
"apt": {
"melee": 4,
"spear": 4,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 1
},
"tag": "soldier",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 520,
"atk": 24,
"spd": 5.2,
"weight_kg": 62,
"tall_m": 1.25
},
"desc": "전투에서 3~4번 살아 돌아와 쥐 베테랑이 된 포렌의 쥐 기사. 더 큰 장식 방패 · 긴 창 · 등의 짧은 검 · 고급 갑옷 · 투구의 주황 리본, 한쪽 눈을 감은 여유. 구르고 방패로 박는 무거운 싸움, 포렌 기술의 작은 흉내 (방진 · 표식)를 씀.",
"gen": 3,
"batch": "3기-2",
"portrait": "art/h2/ratvet/portrait.webp",
"face": "art/h2/ratvet/face.webp",
"poses": {
"idle": {
"src": "art/h2/ratvet/idle.webp",
"w": 546,
"h": 815,
"ax": 366,
"ay": 812,
"orig": "왼손에 긴 창 세워 쥐고 오른쪽에 키만 한 큰 장식 방패 (녹색 바탕 금색 백합 무늬, 금 테 · 리벳), 반듯이 서서 앞을 봄. 투구 옆 주황 리본 · 반짝임, 한쪽 눈 감음, 허리까지 오는 굵은 녹색 땋은 머리, 등에 짧은 검",
"scale": 0.56
},
"salute": {
"src": "art/h2/ratvet/salute.webp",
"w": 401,
"h": 755,
"ax": 251,
"ay": 752,
"orig": "오른손을 투구 챙에 대고 경례, 왼손은 옆에 내림, 방패는 등에 멤, 한쪽 눈 감고 고개 듦",
"scale": 0.513
},
"command": {
"src": "art/h2/ratvet/command.webp",
"w": 527,
"h": 742,
"ax": 283,
"ay": 739,
"orig": "다리 벌리고 서서 오른팔을 뒤쪽 (왼쪽)으로 곧게 뻗어 손바닥 폄 — 경례 전 대기 · 명령 · 표식 지목 손짓, 방패 등에, 검 자루 보임",
"f": -1,
"scale": 0.55
},
"ready": {
"src": "art/h2/ratvet/ready.webp",
"w": 638,
"h": 848,
"ax": 435,
"ay": 845,
"orig": "창 세워 들고 큰 방패 옆에 세운 채 서 있음 (idle 과 같은 차림, 다른 각도의 대기)",
"scale": 1.17
},
"guard": {
"src": "art/h2/ratvet/guard.webp",
"w": 656,
"h": 813,
"ax": 389,
"ay": 810,
"orig": "무릎 굽혀 낮게 웅크리고 큰 방패를 땅에 박듯 앞세움, 창은 방패 뒤에서 비스듬히 위로 (방패 막기)",
"scale": 1.17
},
"attack": {
"src": "art/h2/ratvet/attack.webp",
"w": 1073,
"h": 610,
"ax": 433,
"ay": 607,
"orig": "다리 넓게 벌리고 두 손으로 긴 창을 수평으로 길게 찌름, 방패는 뒤에 (창 찌르기)",
"scale": 1.17
},
"attack2": {
"src": "art/h2/ratvet/attack2.webp",
"w": 1228,
"h": 724,
"ax": 54,
"ay": 721,
"orig": "몸을 날려 앞으로 뛰며 창을 수평으로 찌름, 방패를 몸 앞에 붙임 (도약 찌르기 · 돌격 찌르기)",
"scale": 1.17
},
"down": {
"src": "art/h2/ratvet/down.webp",
"w": 980,
"h": 482,
"ax": 771,
"ay": 479,
"orig": "방패에 깔려 옆으로 쓰러짐, 창 쥔 채 한쪽 눈 감고 지친 얼굴 (쓰러짐)",
"flat": true,
"scale": 1.17
},
"guard2": {
"src": "art/h2/ratvet/guard2.webp",
"w": 678,
"h": 854,
"ax": 459,
"ay": 851,
"orig": "한쪽 무릎 꿇고 창을 땅에 세워 쥐고 방패를 옆에 세움 (방진 · 버티기)",
"scale": 1.17
},
"block_up": {
"src": "art/h2/ratvet/block_up.webp",
"w": 572,
"h": 820,
"ax": 243,
"ay": 817,
"orig": "두 팔로 큰 방패를 머리 위로 들어 위에서 오는 공격을 막음",
"scale": 1.73
},
"crouch": {
"src": "art/h2/ratvet/crouch.webp",
"w": 507,
"h": 544,
"ax": 277,
"ay": 541,
"orig": "방패 뒤에 깊이 웅크려 숨음 (검 · 창 없이)",
"scale": 1.73
},
"sword_ready": {
"src": "art/h2/ratvet/sword_ready.webp",
"w": 573,
"h": 612,
"ax": 315,
"ay": 609,
"orig": "방패 세우고 짧은 검을 낮게 뒤로 뺌 (검 자세)",
"scale": 1.73
},
"sword_windup": {
"src": "art/h2/ratvet/sword_windup.webp",
"w": 433,
"h": 657,
"ax": 220,
"ay": 654,
"orig": "검을 어깨 위로 들어 올림, 방패 앞세움 (내려베기 준비)",
"scale": 1.73
},
"sword_thrust": {
"src": "art/h2/ratvet/sword_thrust.webp",
"w": 566,
"h": 580,
"ax": 306,
"ay": 577,
"orig": "방패 뒤에서 검을 앞으로 내밀어 찌름 (방패 너머 찌르기)",
"scale": 1.73
},
"grab": {
"src": "art/h2/ratvet/grab.webp",
"w": 537,
"h": 671,
"ax": 356,
"ay": 668,
"orig": "왼손을 크게 뻗어 움켜쥐려 함, 검은 아래로 (붙잡기)",
"scale": 1.73
},
"sword_low": {
"src": "art/h2/ratvet/sword_low.webp",
"w": 551,
"h": 659,
"ax": 225,
"ay": 656,
"orig": "다리 넓게 벌려 낮은 자세, 검 아래로 비스듬히 (낮은 검 자세)",
"scale": 1.73
},
"sword_attack": {
"src": "art/h2/ratvet/sword_attack.webp",
"w": 757,
"h": 594,
"ax": 307,
"ay": 591,
"orig": "몸을 앞으로 기울여 검을 길게 찔러 뻗음, 방패는 뒤 (검 찌르기)",
"scale": 1.73
},
"sword_cry": {
"src": "art/h2/ratvet/sword_cry.webp",
"w": 592,
"h": 818,
"ax": 317,
"ay": 815,
"orig": "검을 머리 위로 높이 들고 입 벌려 외침, 방패 앞세움 (함성 · 내려베기)",
"scale": 1.73
},
"sword_kneel": {
"src": "art/h2/ratvet/sword_kneel.webp",
"w": 465,
"h": 735,
"ax": 291,
"ay": 732,
"orig": "한쪽 무릎 꿇고 방패 숨어 검을 비스듬히 세움 (낮은 반격 자세)",
"scale": 1.73
},
"throw": {
"src": "art/h2/ratvet/throw.webp",
"w": 717,
"h": 773,
"ax": 232,
"ay": 770,
"orig": "긴 창을 머리 위로 들어 던지려는 자세, 방패 앞에 세움 (창 던지기)",
"scale": 1.73
},
"dive": {
"src": "art/h2/ratvet/dive.webp",
"w": 654,
"h": 643,
"ax": 418,
"ay": 640,
"orig": "앞으로 몸을 날리며 왼팔을 쭉 뻗음, 방패 등 뒤, 꼬리 휨 (앞으로 몸 날리기 · 구르기 시작)",
"scale": 1.73
},
"slash": {
"src": "art/h2/ratvet/slash.webp",
"w": 552,
"h": 633,
"ax": 288,
"ay": 630,
"orig": "방패 앞세우고 검을 비스듬히 위로 휘두름, 입 벌림 (검 베기)",
"scale": 1.73
},
"cover": {
"src": "art/h2/ratvet/cover.webp",
"w": 460,
"h": 464,
"ax": 252,
"ay": 461,
"orig": "방패를 등에 지고 손 짚고 낮게 엎드림 (방패 덮개 · 구르기 직전)",
"scale": 1.73
},
"tumble": {
"src": "art/h2/ratvet/tumble.webp",
"w": 497,
"h": 578,
"ax": 303,
"ay": 575,
"orig": "방패를 등에 진 채 거꾸로 뒤집혀 구름, 다리 하늘로 (구르기)",
"scale": 1.73
},
"land": {
"src": "art/h2/ratvet/land.webp",
"w": 531,
"h": 528,
"ax": 246,
"ay": 525,
"orig": "구르고 나서 한 손 짚고 낮게 착지, 방패 등에 (구르기 끝)",
"scale": 1.73
},
"sword_raise": {
"src": "art/h2/ratvet/sword_raise.webp",
"w": 521,
"h": 798,
"ax": 216,
"ay": 795,
"orig": "방패 세우고 검을 머리 위로 비스듬히 치켜듦",
"scale": 1.73
},
"shield_push": {
"src": "art/h2/ratvet/shield_push.webp",
"w": 669,
"h": 561,
"ax": 370,
"ay": 558,
"orig": "큰 방패를 수평으로 눕혀 낮게 밀어붙이며 검을 앞으로 내지름 (방패 밀치기)",
"scale": 1.73
},
"knee": {
"src": "art/h2/ratvet/knee.webp",
"w": 452,
"h": 751,
"ax": 272,
"ay": 748,
"orig": "한쪽 무릎을 높이 들어 차올리듯 서고 검은 아래로 늘어뜨림 (무릎 차기 · 밟기)",
"scale": 1.73
},
"sword_back": {
"src": "art/h2/ratvet/sword_back.webp",
"w": 542,
"h": 708,
"ax": 244,
"ay": 705,
"orig": "방패 뒤에서 검을 몸 앞으로 가로 잡음 (검 막기 · 역수 자세)",
"scale": 1.73
},
"roll_in": {
"src": "art/h2/ratvet/roll_in.webp",
"w": 629,
"h": 606,
"ax": 363,
"ay": 603,
"orig": "방패를 앞에 세우고 손 짚어 낮게 웅크림 (앞구르기 준비)",
"scale": 1.73
},
"bash": {
"src": "art/h2/ratvet/bash.webp",
"w": 707,
"h": 582,
"ax": 522,
"ay": 579,
"orig": "방패를 앞세우고 몸을 수평으로 날려 부딪침 (굴러서 방패로 박치기, 무겁게)",
"scale": 1.73
},
"roll_flip": {
"src": "art/h2/ratvet/roll_flip.webp",
"w": 722,
"h": 633,
"ax": 306,
"ay": 630,
"orig": "방패를 몸에 붙인 채 거꾸로 뒤집혀 앞구르기 (머리 아래 · 다리 위)",
"scale": 1.73
},
"roll_land": {
"src": "art/h2/ratvet/roll_land.webp",
"w": 628,
"h": 509,
"ax": 345,
"ay": 506,
"orig": "구르기 끝, 방패 앞세우고 한 손 짚고 낮게 착지",
"scale": 1.73
},
"helmet": {
"src": "art/h2/ratvet/helmet.webp",
"w": 592,
"h": 756,
"ax": 358,
"ay": 753,
"orig": "구르고 일어나 투구를 한 손으로 바로잡고 서 있음, 방패 옆에 세움 (정비 · 대기)",
"scale": 1.73
},
"broll_fall": {
"src": "art/h2/ratvet/broll_fall.webp",
"w": 689,
"h": 507,
"ax": 294,
"ay": 504,
"orig": "방패를 앞에 둔 채 뒤로 주저앉으며 넘어감 (뒷구르기 시작)",
"flat": true,
"scale": 1.73
},
"broll_flip": {
"src": "art/h2/ratvet/broll_flip.webp",
"w": 730,
"h": 564,
"ax": 384,
"ay": 561,
"orig": "방패를 덮고 거꾸로 뒤집혀 뒷구르기 (다리 위)",
"scale": 1.73
},
"broll_land": {
"src": "art/h2/ratvet/broll_land.webp",
"w": 623,
"h": 564,
"ax": 375,
"ay": 561,
"orig": "뒷구르기 끝, 방패 앞세우고 손 짚고 낮게 착지",
"scale": 1.73
}
}
},
"redarmor": {
"slug": "redarmor",
"name": "붉은갑주 (붉은 갑각 전사)",
"rank": "강적",
"folder": "강적 붉은갑주",
"role": "적 (강적 — 중간 보스급)",
"tall": 2.5,
"weight": 320,
"palette": [
"#ba4c65",
"#84384d",
"#412530",
"#e8c2b2",
"#c7818a"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"attack2 (내려 베기)",
"back"
],
"kit": {
"basic": "갑각 낫 베기 (attack) — 앞 3.5m 부채꼴 150도",
"skills": [
{
"name": "돌진 베기",
"pose": "attack",
"desc": "6m 앞으로 돌진하며 낫으로 쓸어 벰 — 줄 위 모든 적, 출혈 3초"
},
{
"name": "갑각 굳히기",
"pose": "front",
"desc": "두 팔 벌려 버팀 3초 — 받는 피해 50% 감소, 그 동안 근접으로 친 적에게 반격 베기"
},
{
"name": "붉은 처형",
"pose": "attack",
"desc": "쓰러진 적 · 체력 25% 아래 적에게 앞 2m 큰 내려 베기 (확인사살, 피해 2배)"
}
],
"passive": "붉은 갑주: 정면 피해 25% 감소, 등 · 배 (살구빛 맨살) 는 약점 (+20% 피해)"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "brawler",
"role_job": "선봉",
"bag": 8,
"stats": {
"hp": 1600,
"atk": 62,
"spd": 4.5,
"weight_kg": 320,
"tall_m": 2.5
},
"desc": "새우 · 가재 같은 붉은 갑각을 두른 거구 전사. 오른팔이 커다란 초승달 낫날로 되어 있고, 해골 같은 하얀 얼굴에 붉은 뿔 두 개.",
"gen": 3,
"portrait": "art/h2/redarmor/portrait.webp",
"face": "art/h2/redarmor/face.webp",
"poses": {
"idle": {
"src": "art/h2/redarmor/idle.webp",
"w": 603,
"h": 693,
"ax": 304,
"ay": 690,
"orig": "옆 (3/4 오른쪽) 으로 서서 오른팔 갑각 낫을 늘어뜨림",
"scale": 1.05
},
"front": {
"src": "art/h2/redarmor/front.webp",
"w": 520,
"h": 811,
"ax": 228,
"ay": 808,
"orig": "앞모습 (3/4), 두 팔 벌리고 똑바로 섬",
"scale": 1.05
},
"attack": {
"src": "art/h2/redarmor/attack.webp",
"w": 738,
"h": 601,
"ax": 338,
"ay": 598,
"orig": "다리 넓게 디디고 몸을 틀어 오른팔 낫날을 앞으로 휘두름",
"scale": 1.05
}
}
},
"redrock": {
"slug": "redrock",
"name": "붉은암석 (5M 붉은암석)",
"rank": "강적 (폴더 이름 머리말 '강적' — 원본 참고에 글자 없음)",
"folder": "강적 5M붉은암석",
"role": "적 (키 5m 의 붉은 바위 거인 — 강적 · 동굴 관문 보스로 알맞음)",
"tall": 5.0,
"weight": 9000,
"palette": [
"#7a3b3a",
"#9a5452",
"#4a2224",
"#2e1a1a",
"#d8cdb4"
],
"missing": [
"back",
"walk",
"attack (주먹 내지른 끝 자세)",
"slam (땅 내려찍기)",
"hurt",
"down",
"dead",
"throw (바위 던지기)"
],
"kit": {
"basic": "바위 주먹 (windup → 내지름) — 앞 4m 부채꼴, 넘어뜨림 (내지른 끝 그림이 없어 windup 그림을 앞으로 미는 연출로 대신)",
"skills": [
{
"name": "대지 내려찍기",
"pose": "windup",
"desc": "1.2초 기 모은 뒤 두 주먹으로 땅을 찍어 반지름 6m 원 충격파, 안쪽 적 넘어짐 + 돌 파편 장판 4초 (밟으면 느려짐)"
},
{
"name": "암석 돌진",
"pose": "idle",
"desc": "어깨를 앞세워 10m 직선 돌진, 길 위 적 밀쳐냄 · 나무 상자 같은 장애물 부숨"
},
{
"name": "바위 갑피",
"pose": "front",
"desc": "제자리에 서서 5초 동안 받는 피해 50% 감소, 그동안 근접 공격한 적은 1m 튕겨남"
}
],
"passive": "붉은 암석 몸: 화살 · 총알 피해 40% 감소, 대신 둔기 · 폭발 피해 30% 더 받음. 크고 느려서 회전이 느림 (뒤쪽이 약점)"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 0
},
"tag": "beast",
"role_job": "선봉",
"bag": 0,
"stats": {
"hp": 5200,
"atk": 95,
"spd": 3.2,
"weight_kg": 9000,
"tall_m": 5.0
},
"desc": "붉은 바위 조각이 근육처럼 겹겹이 붙은 키 5m 의 암석 거인. 머리에 굽은 상아빛 뿔 두 개, 이빨을 드러낸 비웃음, 몸통만 한 바위 주먹이 특징.",
"gen": 3,
"portrait": "art/h2/redrock/portrait.webp",
"face": "art/h2/redrock/face.webp",
"poses": {
"idle": {
"src": "art/h2/redrock/idle.webp",
"w": 356,
"h": 797,
"ax": 216,
"ay": 794,
"orig": "옆모습 (오른쪽 보기) 서 있음, 거대한 바위 주먹 늘어뜨림",
"scale": 1.0
},
"front": {
"src": "art/h2/redrock/front.webp",
"w": 583,
"h": 801,
"ax": 268,
"ay": 798,
"orig": "앞모습 (3/4 정면) 서 있음, 두 주먹 쥐고 히죽 웃음",
"scale": 1.0
},
"windup": {
"src": "art/h2/redrock/windup.webp",
"w": 739,
"h": 626,
"ax": 311,
"ay": 623,
"orig": "몸을 낮추고 뒤쪽 주먹을 머리 위로 크게 끌어올림, 앞 주먹은 땅 가까이 — 큰 주먹질 직전 기 모으기 (입 벌려 포효)",
"scale": 1.0
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
"orig": "창 세워 들고 방패 들고 서 있음",
"scale": 1.0
},
"attack": {
"src": "art/h2/rook/attack.webp",
"w": 1065,
"h": 591,
"ax": 384,
"ay": 588,
"orig": "방패 뒤에서 창 찌르기",
"scale": 1.0
},
"guard": {
"src": "art/h2/rook/guard.webp",
"w": 880,
"h": 607,
"ax": 354,
"ay": 604,
"orig": "방패 앞세우고 창 겨눈 수비 자세",
"scale": 0.93
},
"down": {
"src": "art/h2/rook/down.webp",
"w": 974,
"h": 543,
"ax": 513,
"ay": 540,
"orig": "뒤로 넘어짐 (창 · 방패 쥔 채, 먼지)",
"flat": true,
"scale": 0.93
},
"low": {
"src": "art/h2/rook/low.webp",
"w": 959,
"h": 597,
"ax": 497,
"ay": 594,
"orig": "창끝으로 땅 찍기 (하단 찌르기, 돌 파편)",
"scale": 1.0
},
"dash": {
"src": "art/h2/rook/dash.webp",
"w": 965,
"h": 631,
"ax": 282,
"ay": 628,
"orig": "방패 들고 돌진 (창 겨눔, 흙먼지)",
"scale": 1.0
}
}
},
"rozel": {
"slug": "rozel",
"name": "로젤 (붉은 가시 성당의 주인)",
"rank": "보스 (파일 이름 '보스 로젤')",
"folder": "3기-2 (보스 로젤.png)",
"role": "보스 (2D 판 3층 붉은 가시 성당 보스룸의 주인. 영입 동료 아님)",
"tall": 1.85,
"weight": 55,
"palette": [
"#100706",
"#1d1715",
"#d01418",
"#641617",
"#e8e2e0"
],
"missing": [
"walk",
"attack (때리는 그림 없음 — 모두 주문 자세)",
"hurt",
"dead (down 으로 대신)",
"back"
],
"kit": {
"basic": "가시 줄기 (cast) — 9m 앞 한 점에서 가시 한 줄기가 솟음 (사격), 절단 (3초 동안 초당 최대 체력 1%)",
"skills": [
{
"name": "가시 문장",
"pose": "cast2",
"desc": "상대 발밑에 반지름 2.5m 붉은 문장 → 1초 뒤 가시가 솟음: 공격력 1.4배 + 0.8초 묶임 + 50% 절단. 체력 절반 아래면 문장 둘. 문장 밖으로 빠지면 피함 (2D 기술 그대로). 재사용 6초"
},
{
"name": "가시 정원",
"pose": "front",
"desc": "두 팔을 벌려 자신 둘레 반지름 8m 원 장판 6초 — 안의 적 이동 −35%, 1초마다 피해, 장판 위 로젤은 피해 15% 덜 받음. 재사용 18초"
},
{
"name": "뿌리 부르기",
"pose": "skill",
"desc": "땅을 쓰다듬어 붉은 가시 뿌리 촉수 3개 소환 (8초, 각자 6m 안 적을 휘둘러 침 · 0.5초 묶음). 체력 절반 아래면 5개"
}
],
"passive": "붉은 가시 로브: 2m 안에서 때린 근접 공격자에게 받은 피해 20% 되돌림 + 절단. 넘어뜨리기 · 밀치기 무시"
},
"apt": {
"melee": 1,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 5,
"stealth": 1
},
"tag": "mage",
"role_job": "지휘",
"bag": 6,
"stats": {
"hp": 3800,
"atk": 70,
"spd": 3.6,
"weight_kg": 55,
"tall_m": 1.85
},
"desc": "붉은 가시 성당의 주인. 붉은 긴 머리가 얼굴을 가린 검은 수도복 여인으로, 로브 자락에서 핏빛 가시 뿌리가 바닥으로 번진다. 손짓 하나로 발밑에 가시 문장을 펼친다.",
"gen": 1,
"codex_g": "agnes",
"batch": "3기-2",
"portrait": "art/h2/rozel/portrait.webp",
"face": "art/h2/rozel/face.webp",
"poses": {
"idle": {
"src": "art/h2/rozel/idle.webp",
"w": 525,
"h": 700,
"ax": 241,
"ay": 697,
"orig": "옆모습으로 서서 두 손을 내림 — 로브 자락 끝에서 붉은 가시 뿌리가 바닥으로 방사형으로 퍼짐",
"scale": 1.45
},
"idle2": {
"src": "art/h2/rozel/idle2.webp",
"w": 500,
"h": 686,
"ax": 314,
"ay": 683,
"orig": "똑바로 서서 한 손을 가슴께에 얹고 고개를 숙임",
"scale": 1.45
},
"front": {
"src": "art/h2/rozel/front.webp",
"w": 551,
"h": 702,
"ax": 259,
"ay": 699,
"orig": "앞모습, 두 팔을 양옆으로 벌려 손바닥을 펼침 (큰 주문 · 가시 퍼뜨리기)",
"scale": 1.45
},
"cast": {
"src": "art/h2/rozel/cast.webp",
"w": 508,
"h": 703,
"ax": 216,
"ay": 700,
"orig": "한 손을 위로 들어 손가락을 펼침 (주문)",
"scale": 1.45
},
"cast2": {
"src": "art/h2/rozel/cast2.webp",
"w": 516,
"h": 684,
"ax": 276,
"ay": 681,
"orig": "몸을 숙이며 한 손을 아래로 뻗어 바닥을 가리킴 (가시 문장 펼치기)",
"scale": 1.45
},
"cast3": {
"src": "art/h2/rozel/cast3.webp",
"w": 571,
"h": 674,
"ax": 268,
"ay": 671,
"orig": "고개를 돌리며 한 손바닥을 위로 펴 내밂 (부르기 · 손짓)",
"scale": 1.45
},
"skill": {
"src": "art/h2/rozel/skill.webp",
"w": 505,
"h": 692,
"ax": 186,
"ay": 689,
"orig": "허리를 깊이 숙여 한 팔을 높이 치켜들고 다른 손으로 바닥의 가시를 쓰다듬음",
"scale": 1.45
},
"down": {
"src": "art/h2/rozel/down.webp",
"w": 550,
"h": 505,
"ax": 243,
"ay": 502,
"orig": "무릎 꿇고 엎드려 한 손으로 가시 바닥을 짚음 (쓰러짐 — 가시 소환 자세로도 씀)",
"flat": true,
"scale": 1.45
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
"orig": "옆으로 누움",
"flat": true
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
"scythebeast": {
"slug": "scythebeast",
"name": "보라빛 대낫 괴수 (이름 미상)",
"rank": "강적",
"folder": "암계 강적",
"role": "적 (암계의 강적 괴수 — 이름 없는 정예 몬스터. 대화 · 동료 요소 없음)",
"tall": 2.6,
"weight": 380,
"palette": [
"#3e2f4c",
"#241a2c",
"#584968",
"#8a7aa0",
"#d8d0e8"
],
"missing": [
"back",
"walk",
"hurt",
"down",
"dead",
"windup (낫 치켜들기)",
"jump"
],
"kit": {
"basic": "대낫 베기 (attack) — 앞 3.5m 부채꼴 140도, 출혈 3초",
"skills": [
{
"name": "초승 대참",
"pose": "attack",
"desc": "0.6초 몸을 낮춘 뒤 앞 5m 반원 (180도) 크게 베기. 큰 피해 + 넘어뜨림, 막기 자세면 막기 깨짐"
},
{
"name": "도약 베기",
"pose": "attack",
"desc": "8m 앞으로 뛰어들어 착지 지점 반경 2.5m 원 베기 (jump 그림 없음 — attack 으로 대신)"
},
{
"name": "포식의 웃음",
"pose": "front",
"desc": "이빨을 드러내며 포효: 반경 6m 적 1.5초 공포 (뒤로 물러남), 자신 공격속도 +20% 6초"
}
],
"passive": "가시 비늘: 근접으로 때린 적에게 받은 피해 10% 되돌림, 체력 30% 아래에서 이동 속도 +25%"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 1
},
"tag": "beast",
"role_job": "선봉",
"bag": 0,
"stats": {
"hp": 2400,
"atk": 62,
"spd": 5.5,
"weight_kg": 380,
"tall_m": 2.6
},
"desc": "암계에 사는 보라빛 비늘 괴수. 오른팔(그림 기준 왼쪽 팔)이 통째로 거대한 낫 날이고, 뿔 달린 머리에 이빨만 웃는 얼굴. 티어표에는 그림만 있고 이름 글자가 없음.",
"gen": 3,
"portrait": "art/h2/scythebeast/portrait.webp",
"face": "art/h2/scythebeast/face.webp",
"poses": {
"front": {
"src": "art/h2/scythebeast/front.webp",
"w": 536,
"h": 785,
"ax": 213,
"ay": 782,
"orig": "앞모습: 왼팔이 거대한 낫 날로 이어짐, 이빨 드러낸 웃음",
"scale": 1.0
},
"idle": {
"src": "art/h2/scythebeast/idle.webp",
"w": 290,
"h": 773,
"ax": 138,
"ay": 770,
"orig": "옆모습 (오른쪽 봄): 낫 팔을 몸 뒤로 늘어뜨리고 섬",
"scale": 1.0
},
"attack": {
"src": "art/h2/scythebeast/attack.webp",
"w": 878,
"h": 625,
"ax": 350,
"ay": 622,
"orig": "몸을 낮추고 낫 팔을 앞으로 크게 휘두름",
"scale": 1.0
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
"orig": "쓰러져 죽음 (머리 오른쪽)",
"flat": true
}
}
},
"slra": {
"slug": "slra",
"name": "슬라 (산호천사)",
"rank": "미정",
"folder": "3기-2/기본슬라천사",
"role": "동료 (등급 글자 없음. 상냥한 젤리 천사 → 지원 동료, 싸울 때는 slra2 전투 모습으로 변신)",
"tall": 1.62,
"weight": 70,
"palette": [
"#f6f0ef",
"#c070d8",
"#e8d070",
"#f0f0b0",
"#d02a3a"
],
"missing": [
"attack (그림 없음 — wave 로 대신)",
"hurt",
"down",
"dead",
"back"
],
"kit": {
"basic": "산호 방울 던지기 (그림 없음 — wave 로 대신) — 8m 사격, 끈적 젤리 방울로 2초 이동 -20%",
"skills": [
{
"name": "산호 축복",
"pose": "special",
"desc": "떠오르며 반지름 7m 원 — 안의 아군 체력 20% 회복 + 4초 받는 피해 10% 감소"
},
{
"name": "젤리 회전",
"pose": "skill",
"desc": "빙글 돌아 반지름 3m 원 — 젤리 치마로 적을 3m 밀어내고 2초 이동 -30%"
},
{
"name": "산호 싹",
"pose": "summon",
"desc": "소환 — 앞 3m 에 산호 싹 15초, 반지름 4m 안 아군 초당 2% 회복 (싹은 체력 200, 적이 노림)"
},
{
"name": "산호 기사 변신",
"pose": "bow",
"desc": "변신 — 치마를 들어 인사하며 slra2 (산호 갑옷 + 장검) 로 25초 바뀜. 변신 동안 지원 기술 대신 근접 검술"
}
],
"passive": "젤리 몸: 받는 근접 피해 15% 흡수, 앉아 쉬면 (sit) 회복 2배"
},
"apt": {
"melee": 1,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 4,
"stealth": 0
},
"tag": "mage",
"role_job": "지원",
"bag": 9,
"stats": {
"hp": 800,
"atk": 22,
"spd": 5.5,
"weight_kg": 70,
"tall_m": 1.62
},
"desc": "흰 젤리 드레스에 보라 · 노랑 얼룩과 금빛 방울이 흐르는 산호천사 슬라. 산호 머리장식과 머리 위 고리, 늘 웃는 상냥한 회복 지원 동료이며 싸울 때는 산호 기사 (slra2) 로 변신한다.",
"gen": 3,
"codex_g": "cheonsasl",
"batch": "3기-2",
"portrait": "art/h2/slra/portrait.webp",
"face": "art/h2/slra/face.webp",
"poses": {
"idle": {
"src": "art/h2/slra/idle.webp",
"w": 503,
"h": 699,
"ax": 256,
"ay": 696,
"orig": "앞모습으로 두 팔을 살짝 벌리고 웃으며 서 있음 — 흰 젤리 드레스 (보라 · 노랑 얼룩, 금빛 방울), 산호 머리장식, 머리 위 고리",
"scale": 1.4
},
"bow": {
"src": "art/h2/slra/bow.webp",
"w": 469,
"h": 665,
"ax": 257,
"ay": 662,
"orig": "두 손으로 젤리 치마를 들고 눈웃음 인사",
"scale": 1.4
},
"skill": {
"src": "art/h2/slra/skill.webp",
"w": 552,
"h": 707,
"ax": 325,
"ay": 704,
"orig": "빙글 돌아 젤리 치마가 크게 퍼짐 (회전)",
"scale": 1.4
},
"wave": {
"src": "art/h2/slra/wave.webp",
"w": 413,
"h": 696,
"ax": 214,
"ay": 693,
"orig": "한 손 가슴, 한 손 흔들며 인사",
"scale": 1.4
},
"walk": {
"src": "art/h2/slra/walk.webp",
"w": 552,
"h": 657,
"ax": 248,
"ay": 654,
"orig": "맨발로 사뿐 걸음",
"scale": 1.4
},
"special": {
"src": "art/h2/slra/special.webp",
"w": 486,
"h": 622,
"ax": 240,
"ay": 619,
"orig": "두 팔 활짝 벌리고 공중에 떠오름 (축복)",
"scale": 1.4
},
"sit": {
"src": "art/h2/slra/sit.webp",
"w": 571,
"h": 560,
"ax": 296,
"ay": 557,
"orig": "젤리 치마 위에 앉아 쉼",
"scale": 1.4
},
"summon": {
"src": "art/h2/slra/summon.webp",
"w": 507,
"h": 581,
"ax": 261,
"ay": 578,
"orig": "앉아서 손바닥 위의 작은 산호 싹을 들여다봄 (반짝 표시)",
"scale": 1.4
}
}
},
"slra2": {
"slug": "slra2",
"name": "슬라 (산호천사 · 전투 모습)",
"rank": "미정",
"folder": "3기-2/슬라(산호천사)전투",
"role": "동료 (slra 의 전투 변신 — 같은 인물, 산호 갑옷 + 장검)",
"tall": 1.62,
"weight": 64,
"palette": [
"#f1e6d9",
"#d6c4af",
"#b080c8",
"#c8a050",
"#4b3a3e"
],
"missing": [
"down",
"dead",
"walk",
"run",
"back",
"attack2 (베기 — 원본의 베기 그림은 빨간 X)"
],
"kit": {
"basic": "장검 찌르기 (attack) — 앞 3.5m 줄, 3타째는 관통",
"skills": [
{
"name": "도약 베기",
"pose": "jump",
"desc": "도약 — 7m 앞 지점으로 뛰어올라 내려벰, 반지름 2.5m 원 피해 + 넘어뜨림"
},
{
"name": "산호 자세",
"pose": "guard",
"desc": "막기 — 2초 정면 막기, 막는 순간 맞으면 찌르기 반격 (피해 150%)"
},
{
"name": "기합 돌진",
"pose": "windup",
"desc": "1.2초 검을 세워 모은 뒤 10m 돌진 찌르기 (attack 으로 이어짐), 줄 위 적 관통"
},
{
"name": "웃음 도발",
"pose": "taunt",
"desc": "반지름 8m 원 적을 4초 끌어들임 (어그로), 그 동안 받는 피해 15% 감소"
}
],
"passive": "산호 갑옷: 변신 동안 받는 피해 15% 감소, 25초가 끝나면 slra 로 돌아옴 (돌아올 때 체력 10% 회복)"
},
"apt": {
"melee": 4,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 0
},
"tag": "knight",
"role_job": "선봉",
"bag": 9,
"stats": {
"hp": 1150,
"atk": 40,
"spd": 6.0,
"weight_kg": 64,
"tall_m": 1.62
},
"desc": "슬라가 산호 갑옷 드레스와 긴 금빛 장검으로 변신한 전투 모습. 밝게 웃으며 찌르기 · 도약 베기로 앞에 선다.",
"gen": 3,
"batch": "3기-2",
"portrait": "art/h2/slra2/portrait.webp",
"face": "art/h2/slra2/face.webp",
"poses": {
"idle": {
"src": "art/h2/slra2/idle.webp",
"w": 539,
"h": 702,
"ax": 319,
"ay": 699,
"orig": "오른손에 긴 금빛 장검을 늘어뜨리고 서 있음 — 흰 산호 갑옷 드레스 (찢어진 천 자락, 보라 얼룩), 산호 머리장식, 고리",
"scale": 1.6
},
"windup": {
"src": "art/h2/slra2/windup.webp",
"w": 584,
"h": 709,
"ax": 418,
"ay": 706,
"orig": "한 다리를 들고 장검을 사선으로 높이 세움 (베기 준비 자세)",
"scale": 1.6
},
"attack": {
"src": "art/h2/slra2/attack.webp",
"w": 675,
"h": 589,
"ax": 321,
"ay": 586,
"orig": "다리를 벌리고 장검을 앞으로 곧게 내찌름 (칼끝은 원본에서 잘려 있음)",
"scale": 1.6
},
"jump": {
"src": "art/h2/slra2/jump.webp",
"w": 530,
"h": 816,
"ax": 142,
"ay": 813,
"orig": "공중으로 뛰어올라 장검을 머리 위로 치켜듦 (도약 베기)",
"scale": 1.6
},
"guard": {
"src": "art/h2/slra2/guard.webp",
"w": 682,
"h": 822,
"ax": 321,
"ay": 819,
"orig": "다리를 넓게 벌리고 두 손으로 장검을 세워 막음",
"scale": 1.6
},
"hurt": {
"src": "art/h2/slra2/hurt.webp",
"w": 595,
"h": 674,
"ax": 395,
"ay": 671,
"orig": "고개를 숙여 앞머리로 눈을 가리고 비틀거림, 장검 아래로",
"scale": 1.6
},
"taunt": {
"src": "art/h2/slra2/taunt.webp",
"w": 638,
"h": 802,
"ax": 482,
"ay": 799,
"orig": "눈 감고 크게 웃으며 손을 내밂, 장검은 아래로 (도발)",
"scale": 1.6
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
"orig": "오른쪽: 엎드려 검 휘두르기 (하단)",
"flat": true
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
"orig": "오른쪽: 엎드려 기기 (무기 없음)",
"flat": true
}
}
},
"spore": {
"slug": "spore",
"name": "포자 (이름 미상)",
"rank": "미상 (폴더 이름 '포자 적' — 등급 글자 없음. 시트 파일 이름에 '보스 포즈' 라 강적~보스급)",
"folder": "포자 적",
"role": "적 (폴더 이름이 '적', 시트 이름 '보스 포즈' — 지역 보스 · 강적. 사람 말 없는 괴물이라 동료 아님)",
"tall": 2.4,
"weight": 90,
"palette": [
"#2a2a2a",
"#555555",
"#8a8a88",
"#c79a3a",
"#c0304a"
],
"missing": [
"back",
"walk (미끄러지듯 이동으로 대신)",
"hurt",
"down",
"dead",
"cast (포자 뿌리기 효과)"
],
"kit": {
"basic": "갈퀴 할퀴기 (idle) — 앞 2.5m 부채꼴 100도, 2연타",
"skills": [
{
"name": "공허의 아가리",
"pose": "attack",
"desc": "4m 앞으로 덮쳐 머리 껍질을 벌려 물기: 큰 피해 + 붙잡기 1.5초 (그동안 매초 피해, 아군이 때리면 풀림)"
},
{
"name": "황금 포자 구름",
"pose": "front",
"desc": "제자리에서 머리 구멍으로 포자를 뿜어 주변 5m 원 장판 6초: 매초 독 피해 + 시야 좁아짐 + 회복 50% 감소"
},
{
"name": "포자 번식",
"pose": "idle",
"desc": "포자 장판 위에 쓰러진 적 · 시체에서 작은 포자 졸개 1~2마리 소환 (hp 낮음, 15초)"
}
],
"passive": "공허의 껍질: 몸통 (로브) 은 피해 30% 감소, 머리 (황금 껍질) 를 맞히면 피해 1.5배 — 약점. 포자 장판 위에서 초당 체력 1% 회복"
},
"apt": {
"melee": 4,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 4,
"stealth": 2
},
"tag": "beast",
"role_job": "선봉",
"bag": 4,
"stats": {
"hp": 2600,
"atk": 52,
"spd": 4.8,
"weight_kg": 90,
"tall_m": 2.4
},
"desc": "황금빛 구멍투성이 버섯 껍질을 머리에 쓴 공허의 괴물. 해진 로브 아래 붉은 핏줄이 비치고, 머리 껍질이 갈라지며 모든 것을 삼킨다.",
"gen": 3,
"portrait": "art/h2/spore/portrait.webp",
"face": "art/h2/spore/face.webp",
"poses": {
"idle": {
"src": "art/h2/spore/idle.webp",
"w": 394,
"h": 699,
"ax": 175,
"ay": 696,
"orig": "옆모습 (오른쪽 봄): 몸을 숙이고 긴 갈퀴 손을 앞으로 늘어뜨림",
"scale": 0.82
},
"front": {
"src": "art/h2/spore/front.webp",
"w": 403,
"h": 701,
"ax": 185,
"ay": 698,
"orig": "3/4 앞모습: 해진 회흑 로브, 가슴 은 브로치, 노란 구멍 숭숭한 버섯 · 해골 머리, 검은 목에 붉은 핏줄",
"scale": 0.82
},
"attack": {
"src": "art/h2/spore/attack.webp",
"w": 499,
"h": 645,
"ax": 214,
"ay": 642,
"orig": "웅크려 덮치기: 머리 (황금 포자 껍질) 가 크게 벌어져 검은 아가리, 두 갈퀴 손 뻗음",
"scale": 0.82
}
}
},
"stagbeast": {
"slug": "stagbeast",
"name": "사슴",
"rank": "초강적",
"folder": "3기-2 (초강적 사슴.png)",
"role": "적 (파일 이름 '초강적' — 맨손 격투형 괴수 강적, 보스 바로 아래. 동료 그림체 아님)",
"tall": 2.8,
"weight": 320,
"palette": [
"#1d1c1f",
"#3e3f43",
"#455056",
"#4fd6e8",
"#dcd7d1",
"#3a2a22"
],
"missing": [
"walk",
"hurt",
"down",
"dead"
],
"kit": {
"basic": "뒤돌려 주먹 (attack) — 앞 3m, 2연타",
"skills": [
{
"name": "뿔소 돌진",
"pose": "dash",
"desc": "몸을 낮추고 12m 돌진 — 줄 위 적을 갈퀴로 긁고 밀쳐 넘어뜨림, 벽에 박으면 1.5초 기절"
},
{
"name": "대지 짓밟기",
"pose": "slam",
"desc": "발을 굴러 반지름 5m 원 충격파 + 바위 파편 3초 장판 (밟으면 피해 · 둔화)"
},
{
"name": "무릎 차올리기",
"pose": "jump",
"desc": "4m 뛰어들며 무릎으로 올려 침 — 맞은 적 공중에 띄움 1초 (windup 으로 이어 치기)"
},
{
"name": "숲의 포효",
"pose": "roar",
"desc": "반지름 10m 원 포효 — 적 2초 공포, 자신 8초 공격 +30% · 푸른 문양이 밝아짐"
}
],
"passive": "고목의 뿔: 정면에서 받는 근접 피해 20% 감소, 체력 40% 아래에서 공격 속도 +25%"
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
"bag": 4,
"stats": {
"hp": 4200,
"atk": 70,
"spd": 5.0,
"weight_kg": 320,
"tall_m": 2.8
},
"desc": "큰 사슴뿔이 달린 해골 가면 머리, 검은 깃털 갈기, 푸른 빛 문양이 흐르는 검푸른 근육질 몸의 암컷 괴수. 손목 · 정강이에 뼈 가시 팔찌, 맨손 갈퀴와 발굽 같은 발로 싸운다.",
"gen": 3,
"batch": "3기-2",
"portrait": "art/h2/stagbeast/portrait.webp",
"face": "art/h2/stagbeast/face.webp",
"poses": {
"idle": {
"src": "art/h2/stagbeast/idle.webp",
"w": 501,
"h": 769,
"ax": 269,
"ay": 766,
"orig": "앞모습으로 다리 벌려 섬, 두 손 갈퀴를 늘어뜨림 (가장 반듯한 선 모습)",
"scale": 1.57
},
"windup": {
"src": "art/h2/stagbeast/windup.webp",
"w": 663,
"h": 771,
"ax": 299,
"ay": 768,
"orig": "주먹을 뒤로 크게 당기고 오른쪽으로 체중을 실음 (주먹 준비)",
"scale": 1.57
},
"attack": {
"src": "art/h2/stagbeast/attack.webp",
"w": 637,
"h": 779,
"ax": 396,
"ay": 776,
"orig": "등을 보이며 오른쪽으로 팔꿈치 · 주먹을 내지름",
"scale": 1.57
},
"jump": {
"src": "art/h2/stagbeast/jump.webp",
"w": 491,
"h": 760,
"ax": 183,
"ay": 757,
"orig": "무릎을 차올리며 뛰어오름, 갈퀴 손을 앞으로 (무릎 차기)",
"scale": 1.57
},
"dash": {
"src": "art/h2/stagbeast/dash.webp",
"w": 735,
"h": 755,
"ax": 594,
"ay": 752,
"orig": "몸을 낮추고 두 갈퀴를 벌린 채 오른쪽으로 돌진 (뒤로 흙먼지)",
"f": -1,
"scale": 1.57
},
"slam": {
"src": "art/h2/stagbeast/slam.webp",
"w": 506,
"h": 750,
"ax": 293,
"ay": 747,
"orig": "발을 굴러 땅을 짓밟음, 바위 파편이 튐",
"scale": 1.57
},
"roar": {
"src": "art/h2/stagbeast/roar.webp",
"w": 736,
"h": 670,
"ax": 370,
"ay": 667,
"orig": "앞모습, 두 주먹을 쥐고 가슴을 펴 포효 (힘 모으기)",
"scale": 1.57
},
"claw": {
"src": "art/h2/stagbeast/claw.webp",
"w": 451,
"h": 766,
"ax": 242,
"ay": 763,
"orig": "몸을 틀어 등을 보이며 오른쪽으로 갈퀴 손을 치켜듦",
"scale": 1.57
}
}
},
"stoneglove": {
"slug": "stoneglove",
"name": "돌장갑",
"rank": "미정 (폴더 이름에 등급 없음)",
"folder": "돌장갑",
"role": "동료 (적 격투가로도 가능)",
"tall": 1.62,
"weight": 95,
"palette": [
"#ecd8cf",
"#e6e0d4",
"#272422",
"#7e7672",
"#8a4fb0"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"slam (내려찍기)",
"back"
],
"kit": {
"basic": "돌주먹 연타 (guard 자세에서) — 앞 2m, 3타째 넘어뜨림",
"skills": [
{
"name": "도약 돌주먹",
"pose": "attack",
"desc": "6m 앞으로 뛰어들며 주먹 — 맞은 적 4m 밀어냄, 착지 반지름 2.5m 원 넘어뜨림"
},
{
"name": "바위 자세",
"pose": "guard",
"desc": "2초 동안 앞 120도 막기 (피해 70% 감소), 막는 동안 맞으면 반격 주먹"
},
{
"name": "토끼 고함",
"pose": "idle2",
"desc": "입을 크게 벌려 소리침 — 반지름 6m 원 도발 (적이 3초간 자신을 노림)"
}
],
"passive": "돌갑주: 팔다리 돌 장갑으로 근접 피해 20% 감소, 넘어지지 않음 (대신 이동 −10%)"
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
"hp": 950,
"atk": 38,
"spd": 5.0,
"weight_kg": 95,
"tall_m": 1.62
},
"desc": "흰 털 망토를 두른 토끼 귀 격투가. 바위로 깎은 큼직한 장갑과 정강이 갑옷으로 때리고 버틴다.",
"gen": 3,
"portrait": "art/h2/stoneglove/portrait.webp",
"face": "art/h2/stoneglove/face.webp",
"poses": {
"idle": {
"src": "art/h2/stoneglove/idle.webp",
"w": 432,
"h": 695,
"ax": 206,
"ay": 692,
"orig": "서 있음 (입 조금 벌림), 돌장갑 낀 두 팔 늘어뜨림",
"scale": 0.82
},
"idle2": {
"src": "art/h2/stoneglove/idle2.webp",
"w": 428,
"h": 692,
"ax": 204,
"ay": 689,
"orig": "서 있음 — idle 과 같은 자세에 입을 크게 벌림 (idle 중 가끔 바꿔 끼우는 입모양 그림)",
"scale": 0.82
},
"guard": {
"src": "art/h2/stoneglove/guard.webp",
"w": 459,
"h": 594,
"ax": 242,
"ay": 591,
"orig": "다리 넓게 벌려 낮추고 두 돌주먹을 앞에 모은 격투 자세",
"scale": 0.82
},
"attack": {
"src": "art/h2/stoneglove/attack.webp",
"w": 561,
"h": 535,
"ax": 230,
"ay": 532,
"orig": "뛰어들며 오른 돌주먹 내지르기 (공중, 발이 땅에 안 닿음)",
"scale": 0.82
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
"ax": 201,
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
"orig": "쓰러짐",
"flat": true
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
"orig": "전복 — 뒤로 넘어져 주저앉음",
"flat": true
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
"orig": "죽음 그림 없음 — down 으로 대신",
"flat": true
}
}
},
"ted": {
"slug": "ted",
"name": "테드 (마계 사령관)",
"rank": "강적 (폴더 이름 '강적 사령관 테드', 시트 파일 이름 '마계 사령관 테드' — 원본 참고에 글자 없음)",
"folder": "강적 사령관 테드",
"role": "적 (마계 군대의 사령관 — 강적 · 지휘관 보스. 사람 모습의 미남 검사라 나중에 동료로 돌아서는 이야기도 가능해 둘 다 가능성 있음)",
"tall": 1.85,
"weight": 95,
"palette": [
"#2a2a2e",
"#4a4a52",
"#8a1c2c",
"#5e1a26",
"#d8d8dc"
],
"missing": [
"back",
"walk",
"guard",
"hurt",
"down",
"dead",
"slash (베기)",
"command (지휘 · 호령)"
],
"kit": {
"basic": "장검 찌르기 (attack) — 앞 줄 3.5m, 빠른 2연 찌르기",
"skills": [
{
"name": "마계 돌격찌르기",
"pose": "attack",
"desc": "검을 겨눈 채 8m 직선 돌진 찌르기, 첫 적 관통 후 그 뒤 적까지 피해 70%, 맞은 적 출혈 3초"
},
{
"name": "사령관의 호령",
"pose": "idle",
"desc": "제자리 호령 — 반지름 12m 안 아군 마물 공격력 +20% · 이동 속도 +15% 8초 (호령 그림이 없어 idle 로 대신)"
},
{
"name": "처단",
"pose": "attack",
"desc": "체력 25% 아래 또는 쓰러진 적에게 앞 3m 확인사살 찌르기, 피해 2.5배"
}
],
"passive": "흑철 갑주: 정면 근접 피해 25% 감소. 근처 (10m) 졸개가 쓰러질 때마다 공격력 +5% (최대 5번)"
},
"apt": {
"melee": 5,
"spear": 3,
"bow": 1,
"gun": 0,
"magic": 2,
"stealth": 1
},
"tag": "knight",
"role_job": "지휘",
"bag": 10,
"stats": {
"hp": 2200,
"atk": 62,
"spd": 5.2,
"weight_kg": 95,
"tall_m": 1.85
},
"desc": "은백 머리에 무표정한 눈매의 마계 사령관. 가시 돋은 흑철 갑주와 톱니 모양 붉은 안감 깃, 끝이 찢긴 진홍 망토를 두르고, 붉은 보석 박힌 가는 장검으로 정확하게 찌른다.",
"gen": 3,
"portrait": "art/h2/ted/portrait.webp",
"face": "art/h2/ted/face.webp",
"poses": {
"idle": {
"src": "art/h2/ted/idle.webp",
"w": 454,
"h": 703,
"ax": 209,
"ay": 700,
"orig": "옆모습 (오른쪽 보기) 서 있음, 오른손에 가는 장검 비스듬히 아래로",
"scale": 0.97
},
"front": {
"src": "art/h2/ted/front.webp",
"w": 510,
"h": 802,
"ax": 250,
"ay": 799,
"orig": "앞모습 (3/4 정면) 서 있음, 장검을 아래로 늘어뜨림",
"scale": 0.97
},
"attack": {
"src": "art/h2/ted/attack.webp",
"w": 711,
"h": 585,
"ax": 393,
"ay": 582,
"orig": "다리 크게 벌리고 두 손으로 검을 어깨 높이에서 앞으로 길게 겨눔 (찌르기 · 돌진 찌르기 자세), 망토 뒤로 휘날림",
"scale": 0.97
}
}
},
"tehera": {
"slug": "tehera",
"name": "테헤라",
"rank": "1기 동료 (등급 글자 없음 — 파일 이름 '테헤라1~3', 도감: 우주의 테헤라 · 동료 영입 가능)",
"folder": "3기-2 (테헤라1.png · 테헤라2.png · 테헤라3.png)",
"role": "동료 (도감 인카운터 '우주의 테헤라 (동료 영입 가능)' — 영입형 요정. 싸우는 그림이 없어 지원형)",
"tall": 1.7,
"weight": 40,
"palette": [
"#d8c98a",
"#e4d8cf",
"#d58aa8",
"#c9a64a",
"#805e51",
"#f2eef0"
],
"missing": [
"attack (때리는 그림 없음 — cast · reach 로 대신)",
"dead (hurt · sit 으로 대신)",
"down"
],
"kit": {
"basic": "빛가루 뿌리기 (cast) — 12m 앞 사격, 맞은 적 1초 둔화 20%",
"skills": [
{
"name": "요정의 축복",
"pose": "reach",
"desc": "허리 굽혀 손을 뻗음 — 4m 안 아군 하나 체력 25% 회복 + 4초 동안 받는 피해 15% 감소"
},
{
"name": "날개 방패",
"pose": "guard",
"desc": "날개로 몸을 감쌈 — 2초 동안 자신 피해 80% 감소, 끝날 때 반지름 3m 원 빛가루로 적 1초 눈멂"
},
{
"name": "은빛 비행",
"pose": "dash",
"desc": "몸을 눕혀 8m 날아 이동 (지나간 줄 위 적 0.8초 둔화), 벽 · 구덩이 넘음"
},
{
"name": "나른한 꿈",
"pose": "sit",
"desc": "자리에 앉아 졸음 — 반지름 6m 원 장판 5초, 안의 적 공격 속도 −40%, 아군 초당 체력 1% 회복 (본인은 못 움직임)"
}
],
"passive": "요정 날개: 늘 떠 있어 함정 · 장판을 밟지 않음, 원거리 회피 15%"
},
"apt": {
"melee": 0,
"spear": 0,
"bow": 1,
"gun": 0,
"magic": 5,
"stealth": 3
},
"tag": "mage",
"role_job": "지원",
"bag": 8,
"stats": {
"hp": 620,
"atk": 14,
"spd": 5.2,
"weight_kg": 40,
"tall_m": 1.7
},
"desc": "잠자리 같은 투명한 금테 날개 · 긴 금발 · 뾰족 귀 · 분홍 드레스의 요정. 우주 바위 위에 나른하게 앉아 빛가루를 흩날리는, 어느 종족의 왕이었을 법한 존재.",
"gen": 1,
"codex_g": "tehera",
"batch": "3기-2",
"portrait": "art/h2/tehera/portrait.webp",
"face": "art/h2/tehera/face.webp",
"poses": {
"idle": {
"src": "art/h2/tehera/idle.webp",
"w": 454,
"h": 704,
"ax": 339,
"ay": 701,
"orig": "하이힐로 서서 다리를 꼬고 고개를 오른쪽으로, 날개 접음 (가장 반듯한 선 모습)",
"scale": 1.41
},
"walk": {
"src": "art/h2/tehera/walk.webp",
"w": 543,
"h": 592,
"ax": 322,
"ay": 589,
"orig": "날개를 펴고 오른쪽으로 성큼 걸음, 손을 앞으로",
"scale": 1.41
},
"rise": {
"src": "art/h2/tehera/rise.webp",
"w": 517,
"h": 735,
"ax": 187,
"ay": 732,
"orig": "두 팔을 벌리고 위를 보며 떠오름 (드레스 휘날림)",
"scale": 1.41
},
"crouch": {
"src": "art/h2/tehera/crouch.webp",
"w": 509,
"h": 568,
"ax": 221,
"ay": 565,
"orig": "몸을 낮춰 웅크리고 한 손을 땅에 뻗음",
"scale": 1.41
},
"walk2": {
"src": "art/h2/tehera/walk2.webp",
"w": 506,
"h": 685,
"ax": 259,
"ay": 682,
"orig": "날개를 세우고 걸음, 한 손을 뒤로",
"scale": 1.41
},
"dash": {
"src": "art/h2/tehera/dash.webp",
"w": 543,
"h": 633,
"ax": 228,
"ay": 630,
"orig": "몸을 눕혀 오른쪽으로 날아감, 두 팔을 앞뒤로 뻗음",
"scale": 1.41
},
"sit": {
"src": "art/h2/tehera/sit.webp",
"w": 664,
"h": 544,
"ax": 470,
"ay": 541,
"orig": "바닥에 앉아 손에 볼을 괴고 졸린 얼굴 (날개로 몸을 감쌈)",
"scale": 1.41
},
"front": {
"src": "art/h2/tehera/front.webp",
"w": 415,
"h": 694,
"ax": 277,
"ay": 691,
"orig": "앞모습, 두 손을 모으고 서 있음",
"scale": 1.41
},
"land": {
"src": "art/h2/tehera/land.webp",
"w": 622,
"h": 702,
"ax": 425,
"ay": 699,
"orig": "날개를 크게 펴고 무릎 꿇듯 내려앉아 한 손을 땅에 짚음",
"scale": 1.41
},
"float": {
"src": "art/h2/tehera/float.webp",
"w": 393,
"h": 733,
"ax": 306,
"ay": 730,
"orig": "발끝을 세운 채 똑바로 떠 있음, 고개 숙임 (맨발 · 뾰족한 발)",
"scale": 1.41
},
"walk3": {
"src": "art/h2/tehera/walk3.webp",
"w": 457,
"h": 722,
"ax": 348,
"ay": 719,
"orig": "치맛자락을 쥐고 사뿐히 걸음",
"scale": 1.41
},
"drift": {
"src": "art/h2/tehera/drift.webp",
"w": 561,
"h": 702,
"ax": 254,
"ay": 699,
"orig": "몸을 뒤로 눕힌 채 떠 있음, 팔을 늘어뜨림",
"scale": 1.41
},
"cast": {
"src": "art/h2/tehera/cast.webp",
"w": 550,
"h": 701,
"ax": 175,
"ay": 698,
"orig": "앞으로 날아가며 한 손을 아래로 뻗어 빛가루를 뿌림",
"scale": 1.41
},
"reach": {
"src": "art/h2/tehera/reach.webp",
"w": 454,
"h": 677,
"ax": 166,
"ay": 674,
"orig": "허리를 굽혀 아래로 손을 뻗음 (치유 · 축복)",
"scale": 1.41
},
"guard": {
"src": "art/h2/tehera/guard.webp",
"w": 385,
"h": 670,
"ax": 189,
"ay": 667,
"orig": "날개로 몸을 감싸고 손을 가슴에 얹음 (날개 방패)",
"scale": 1.41
},
"sit2": {
"src": "art/h2/tehera/sit2.webp",
"w": 687,
"h": 499,
"ax": 274,
"ay": 496,
"orig": "바닥에 앉아 한 무릎을 세움 (원본 왼쪽 보기 → 뒤집음)",
"scale": 1.41
},
"dash2": {
"src": "art/h2/tehera/dash2.webp",
"w": 681,
"h": 541,
"ax": 50,
"ay": 538,
"orig": "몸을 쭉 펴고 오른쪽으로 쏜살같이 날아감",
"scale": 1.41
},
"jump": {
"src": "art/h2/tehera/jump.webp",
"w": 417,
"h": 743,
"ax": 23,
"ay": 740,
"orig": "무릎을 들고 위로 솟구침, 고개를 쳐듦",
"scale": 1.41
},
"back": {
"src": "art/h2/tehera/back.webp",
"w": 494,
"h": 709,
"ax": 133,
"ay": 706,
"orig": "뒷모습, 어깨 너머로 오른쪽을 봄 (드러난 등 · 날개)",
"scale": 1.41
},
"fly": {
"src": "art/h2/tehera/fly.webp",
"w": 399,
"h": 722,
"ax": 296,
"ay": 719,
"orig": "무릎을 굽힌 채 떠서 날갯짓",
"scale": 1.41
},
"hurt": {
"src": "art/h2/tehera/hurt.webp",
"w": 578,
"h": 594,
"ax": 531,
"ay": 591,
"orig": "고개를 젖히고 뒤로 넘어가듯 떨어짐 (맞음 · 기절)",
"scale": 1.41
},
"low": {
"src": "art/h2/tehera/low.webp",
"w": 773,
"h": 613,
"ax": 514,
"ay": 610,
"orig": "다리를 길게 뻗고 한 손을 땅에 짚어 낮게 내려앉음, 다른 팔은 뒤로",
"scale": 1.41
},
"curl": {
"src": "art/h2/tehera/curl.webp",
"w": 364,
"h": 630,
"ax": 309,
"ay": 627,
"orig": "무릎을 끌어안고 날개로 몸을 감싸 공처럼 웅크림",
"scale": 1.41
},
"front2": {
"src": "art/h2/tehera/front2.webp",
"w": 460,
"h": 656,
"ax": 199,
"ay": 653,
"orig": "앞모습, 날개를 접고 공중에 서 있음",
"scale": 1.41
}
}
},
"unitA": {
"slug": "unitA",
"name": "기체 A",
"rank": "미정 (파일 이름에 등급 없음)",
"folder": "3기-2 / 기체A1.png · 기체A2.png · 기체A4족,기체B쌍검.png (아래 줄)",
"role": "적 (기계 병기 — 기체 B 와 짝을 이루는 기계 인형. 이름 대신 번호로 불려 적 병기로 봄, 나중에 동료화 여지는 있음)",
"tall": 2.2,
"weight": 180,
"palette": [
"#2e272b",
"#cda9c0",
"#b3477c",
"#1a1517",
"#692947"
],
"missing": [
"hurt",
"dead (down 으로 대신)",
"옆모습 idle (idle 은 3/4 앞모습)"
],
"kit": {
"basic": "레이저 검 찌르기 (attack · attack2 번갈아) — 앞 4m 줄",
"skills": [
{
"name": "4족 돌격",
"pose": "walk",
"desc": "몸을 낮춰 거미처럼 8m 빠르게 기어 돌진 — 줄 위 적을 날 다리로 쳐 넘어뜨림, 끝에 dash 로 뛰어듦"
},
{
"name": "날개 회전 베기",
"pose": "skill",
"desc": "날 다리 넷을 사방으로 펼쳐 한 바퀴 — 원 반지름 3.5m 베기 2타 + 출혈 3초"
},
{
"name": "공중제비 꿰뚫기",
"pose": "flip",
"desc": "6m 도약 (jump) 후 공중제비로 거꾸로 떨어지며 날 다리로 내리꽂음 — 착지 원 반지름 2m 큰 피해 + 1초 묶기"
},
{
"name": "X 날 내려베기",
"pose": "windup",
"desc": "0.6초 날 다리 둘을 머리 위로 교차했다가 내려벰 — 앞 4m 부채꼴 90도, 막기 무시"
}
],
"passive": "4족 기체: 넘어짐 · 밀려남 면역, 날 다리가 정면 근접 피해 20% 막음 (guard 자세 때 40%)"
},
"apt": {
"melee": 5,
"spear": 3,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 1
},
"tag": "soldier",
"role_job": "선봉",
"bag": 6,
"stats": {
"hp": 2200,
"atk": 70,
"spd": 5.5,
"weight_kg": 180,
"tall_m": 2.2
},
"desc": "분홍 고깔 투구 · 흰 긴 머리 · 연보라 몸의 기계 인형. 허리와 등에서 뻗은 검은 바탕 분홍 무늬 날 다리 넷으로 거미처럼 걷거나 날개처럼 펼쳐 싸우고, 손에는 분홍 레이저 검.",
"gen": 3,
"codex_g": "mechA",
"batch": "3기-2",
"portrait": "art/h2/unitA/portrait.webp",
"face": "art/h2/unitA/face.webp",
"poses": {
"idle": {
"src": "art/h2/unitA/idle.webp",
"w": 535,
"h": 706,
"ax": 243,
"ay": 703,
"orig": "3/4 앞모습으로 섬, 허리 · 등에서 검은 바탕 분홍 무늬 날 다리 넷이 땅을 짚음, 한 손에 분홍 레이저 검을 아래로 비스듬히",
"scale": 1.34
},
"attack": {
"src": "art/h2/unitA/attack.webp",
"w": 883,
"h": 555,
"ax": 508,
"ay": 552,
"orig": "오른쪽으로 레이저 검 한 손 찌르기, 다리를 넓게 벌리고 뒤쪽 가시 다리 하나를 왼쪽으로 길게 뻗음",
"scale": 1.34
},
"attack2": {
"src": "art/h2/unitA/attack2.webp",
"w": 610,
"h": 666,
"ax": 173,
"ay": 663,
"orig": "날 다리 넷으로 버티고 서서 레이저 검을 오른쪽으로 쭉 뻗은 찌르기",
"scale": 1.34
},
"back": {
"src": "art/h2/unitA/back.webp",
"w": 531,
"h": 697,
"ax": 203,
"ay": 694,
"orig": "뒷모습, 흰 긴 머리가 등을 덮음, 날 다리 넷 · 왼손 레이저 검 (오른쪽 아래에 섞인 4번째 그림 레이저 지움)",
"scale": 1.34
},
"low": {
"src": "art/h2/unitA/low.webp",
"w": 545,
"h": 557,
"ax": 229,
"ay": 554,
"orig": "날 다리 넷을 펼친 채 무릎 굽혀 웅크리고 레이저 검을 앞 아래로 겨눔 (왼쪽에 섞인 3번째 그림 날 다리 지움)",
"scale": 1.34
},
"walk": {
"src": "art/h2/unitA/walk.webp",
"w": 650,
"h": 504,
"ax": 351,
"ay": 501,
"orig": "4족 보행 — 몸을 앞으로 숙이고 분홍 가시 다리 넷으로 거미처럼 땅을 짚음, 손에 레이저 검",
"scale": 1.34
},
"kick": {
"src": "art/h2/unitA/kick.webp",
"w": 658,
"h": 630,
"ax": 303,
"ay": 627,
"orig": "뒷모습으로 서서 날 다리 하나를 오른쪽 위로 높이 차올림",
"scale": 1.34
},
"kick2": {
"src": "art/h2/unitA/kick2.webp",
"w": 677,
"h": 583,
"ax": 244,
"ay": 580,
"orig": "한 다리로 서서 오른쪽으로 하이킥, 레이저 검은 머리 위로 치켜듦, 분홍 가시 다리들이 땅을 짚음",
"scale": 1.34
},
"guard": {
"src": "art/h2/unitA/guard.webp",
"w": 720,
"h": 701,
"ax": 338,
"ay": 698,
"orig": "몸을 뒤로 젖히고 레이저 검을 비스듬히 세워 막는 자세, 가시 다리 넷이 앞뒤로 버팀",
"scale": 1.34
},
"dash": {
"src": "art/h2/unitA/dash.webp",
"w": 693,
"h": 635,
"ax": 373,
"ay": 632,
"orig": "무릎을 끌어안듯 몸을 웅크리고 공중으로 뛰어드는 돌진, 가시 다리 · 레이저 검을 사방으로 뻗음",
"scale": 1.34
},
"windup": {
"src": "art/h2/unitA/windup.webp",
"w": 614,
"h": 744,
"ax": 340,
"ay": 741,
"orig": "한 무릎 들고 서서 가시 다리 둘을 머리 위로 X 자로 교차해 치켜든 내려베기 직전 자세",
"scale": 1.34
},
"jump": {
"src": "art/h2/unitA/jump.webp",
"w": 666,
"h": 639,
"ax": 383,
"ay": 636,
"orig": "공중으로 뛰어오름, 두 팔 벌리고 큰 날 다리 넷을 날개처럼 펼침, 흰 머리 휘날림",
"scale": 1.34
},
"fly": {
"src": "art/h2/unitA/fly.webp",
"w": 615,
"h": 634,
"ax": 266,
"ay": 631,
"orig": "공중에 떠 정면을 보며 한 무릎 들고 큰 날 다리 넷을 X 자로 펼침 (호버링)",
"scale": 1.34
},
"skill": {
"src": "art/h2/unitA/skill.webp",
"w": 667,
"h": 674,
"ax": 346,
"ay": 671,
"orig": "두 팔을 활짝 벌리고 발끝으로 서서 큰 날 다리 넷을 사방으로 펼친 회전 베기 자세",
"scale": 1.34
},
"flip": {
"src": "art/h2/unitA/flip.webp",
"w": 619,
"h": 701,
"ax": 287,
"ay": 698,
"orig": "머리가 아래로 간 공중제비, 흰 머리가 위로 쏟아지고 날 다리가 위아래로 뻗음",
"scale": 1.34
},
"down": {
"src": "art/h2/unitA/down.webp",
"w": 665,
"h": 628,
"ax": 269,
"ay": 625,
"orig": "땅에 주저앉아 한 팔로 몸을 받치고 큰 날 다리 넷이 앞으로 겹쳐 쓰러짐",
"flat": true,
"scale": 1.34
}
}
},
"unitB": {
"slug": "unitB",
"name": "기체 B",
"rank": "미정 (파일 이름에 등급 없음)",
"folder": "3기-2 / 기체A4족,기체B쌍검.png (위 줄) · 기체B날라다니고 공중제비등.png · 기체B전트.png (전투의 오타로 봄)",
"role": "적 (기계 병기 — 기체 A 와 짝을 이루는 날랜 암살형 기계 인형. 나중에 동료화 여지는 있음)",
"tall": 1.8,
"weight": 110,
"palette": [
"#dbb6d3",
"#191315",
"#32272b",
"#976787",
"#65314d"
],
"missing": [
"walk",
"hurt",
"dead (down 으로 대신)",
"옆모습 idle (idle 은 정면)"
],
"kit": {
"basic": "쌍단검 연속 베기 (attack) — 앞 3m 부채꼴 100도 2타, 3타째 하이킥 (kick2) 으로 1m 띄움",
"skills": [
{
"name": "비상 돌입",
"pose": "fly",
"desc": "공중으로 떠올라 (jump) 10m 비스듬히 날아들며 줄 위 적을 벰, 착지 (crouch) 때 원 반지름 2m 베기"
},
{
"name": "공중제비 베기",
"pose": "flip",
"desc": "제자리 공중제비 — 원 반지름 2.5m 회전 베기 2타, 이 동안 원거리 공격 피함"
},
{
"name": "승천 베기",
"pose": "skill",
"desc": "앞 2m 적을 단검으로 올려 베며 함께 솟구침 — 1.2초 띄움, 공중의 적에게 피해 +50% (kick 으로 마무리)"
},
{
"name": "십자 막기",
"pose": "guard",
"desc": "1.5초 두 단검을 머리 위 X 로 막음 — 정면 근접 · 위쪽 공격 막고, 막으면 stance 에서 반격 십자베기 (앞 2.5m)"
}
],
"passive": "큰 삿갓: 위에서 떨어지는 투사체 · 낙하 공격 피해 30% 감소, 공중에 있는 동안 회피 +20%"
},
"apt": {
"melee": 5,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 3
},
"tag": "brawler",
"role_job": "척후",
"bag": 6,
"stats": {
"hp": 1600,
"atk": 80,
"spd": 7.0,
"weight_kg": 110,
"tall_m": 1.8
},
"desc": "검은 바탕에 분홍 얼룩 큰 삿갓 · 검은 마스크 · 분홍빛 긴 머리의 기계 인형. 양손 분홍 레이저 단검 두 자루로 날아다니며 공중제비 · 발차기 · 베기를 잇는 날랜 격투형.",
"gen": 3,
"codex_g": "mechB",
"batch": "3기-2",
"portrait": "art/h2/unitB/portrait.webp",
"face": "art/h2/unitB/face.webp",
"poses": {
"idle": {
"src": "art/h2/unitB/idle.webp",
"w": 525,
"h": 702,
"ax": 290,
"ay": 699,
"orig": "정면으로 똑바로 섬, 검은 바탕 분홍 얼룩 큰 삿갓, 양손에 분홍 레이저 단검을 아래로 늘어뜨림, 허리에 검은 · 분홍 장갑 술",
"scale": 1.55
},
"attack": {
"src": "art/h2/unitB/attack.webp",
"w": 815,
"h": 676,
"ax": 460,
"ay": 673,
"orig": "다리를 넓게 벌리고 오른쪽으로 레이저 단검 찌르기, 다른 손 단검은 뒤로 낮게",
"scale": 1.55
},
"back": {
"src": "art/h2/unitB/back.webp",
"w": 623,
"h": 684,
"ax": 361,
"ay": 681,
"orig": "뒷모습, 분홍빛 긴 머리가 등을 덮음, 양손 단검을 양옆으로 비스듬히",
"scale": 1.55
},
"low": {
"src": "art/h2/unitB/low.webp",
"w": 623,
"h": 556,
"ax": 319,
"ay": 553,
"orig": "삿갓을 앞으로 기울이고 무릎을 깊게 굽혀 웅크린 자세, 양손 단검을 좌우로 뻗음",
"scale": 1.55
},
"fly": {
"src": "art/h2/unitB/fly.webp",
"w": 825,
"h": 653,
"ax": 348,
"ay": 650,
"orig": "몸을 비스듬히 기울여 날아다님, 머리칼이 뒤로 길게 날림, 단검 둘을 앞 아래 · 뒤 위로 뻗음",
"scale": 1.55
},
"jump": {
"src": "art/h2/unitB/jump.webp",
"w": 905,
"h": 666,
"ax": 417,
"ay": 663,
"orig": "한 무릎 들고 공중으로 뛰어들며 양손 단검을 앞뒤로 펼침",
"scale": 1.55
},
"kick": {
"src": "art/h2/unitB/kick.webp",
"w": 747,
"h": 744,
"ax": 552,
"ay": 741,
"orig": "한 손으로 삿갓을 잡고 한 다리를 오른쪽 위로 높이 차올림, 다른 손 단검은 아래로",
"scale": 1.55
},
"skill": {
"src": "art/h2/unitB/skill.webp",
"w": 628,
"h": 966,
"ax": 339,
"ay": 963,
"orig": "몸을 세로로 곧게 세워 솟아오르며 한 손 단검을 하늘로 치켜듦 — 승천 베기",
"scale": 1.55
},
"flip": {
"src": "art/h2/unitB/flip.webp",
"w": 790,
"h": 860,
"ax": 454,
"ay": 857,
"orig": "거꾸로 뒤집힌 공중제비, 한 다리를 위로 뻗고 삿갓이 아래로, 단검 둘을 좌우로",
"scale": 1.55
},
"crouch": {
"src": "art/h2/unitB/crouch.webp",
"w": 834,
"h": 584,
"ax": 564,
"ay": 581,
"orig": "한 무릎 꿇고 착지, 양손 단검을 좌우 아래로 뻗음",
"scale": 1.55
},
"kick2": {
"src": "art/h2/unitB/kick2.webp",
"w": 901,
"h": 721,
"ax": 313,
"ay": 718,
"orig": "한 다리로 서서 오른쪽으로 하이킥, 양손 단검은 뒤로 낮게 늘어뜨림",
"scale": 1.55
},
"down": {
"src": "art/h2/unitB/down.webp",
"w": 1054,
"h": 439,
"ax": 492,
"ay": 436,
"orig": "땅에 옆으로 주저앉아 한 손으로 몸을 받치고 다른 손 단검을 오른쪽으로 겨눔 (쓰러진 자세)",
"flat": true,
"scale": 1.55
},
"stance": {
"src": "art/h2/unitB/stance.webp",
"w": 601,
"h": 780,
"ax": 278,
"ay": 777,
"orig": "한 무릎을 높이 들고 서서 단검 하나는 세로로 몸 앞에, 다른 하나는 아래 뒤로 — 반격 대기 자세",
"scale": 1.55
},
"windup": {
"src": "art/h2/unitB/windup.webp",
"w": 862,
"h": 770,
"ax": 301,
"ay": 767,
"orig": "등을 보이며 다리를 넓게 벌리고 한 손 단검을 머리 위로, 다른 손 단검을 아래로 — 베기 직전",
"scale": 1.55
},
"dash": {
"src": "art/h2/unitB/dash.webp",
"w": 770,
"h": 711,
"ax": 366,
"ay": 708,
"orig": "앞으로 크게 내딛는 돌진, 오른손을 앞으로 뻗고 뒤쪽 단검을 끌고 감",
"scale": 1.55
},
"guard": {
"src": "art/h2/unitB/guard.webp",
"w": 679,
"h": 733,
"ax": 416,
"ay": 730,
"orig": "한 무릎 꿇고 두 단검을 머리 위로 X 자 교차해 막음",
"scale": 1.55
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
"orig": "엎어져 쓰러짐 (머리 오른쪽, 검 앞으로)",
"flat": true
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
"orig": "뒤로 넘어짐 (등 대고 누움, 방패 위)",
"flat": true
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
"vicky": {
"slug": "vicky",
"name": "비키 (보라빛 차원 연구자)",
"rank": "미정 (폴더 머리말 \"연구가\", 등급 글자 없음)",
"folder": "연구가 비키",
"role": "둘 다 (연구가 — 동료 마법사로도, 이빨 드러낸 웃음 · 차원 장치로 보아 적 학자로도)",
"tall": 1.68,
"weight": 56,
"palette": [
"#3b3447",
"#5c4a86",
"#8b87a9",
"#2a2534",
"#b39a6a"
],
"missing": [
"walk",
"hurt",
"down",
"dead",
"cast (장치 펼쳐 띄우기)",
"back"
],
"kit": {
"basic": "측정기 찌르기 (attack) — 앞 2.5m 찌르기, 맞은 적에 차원 표식 1중첩",
"skills": [
{
"name": "차원 투사",
"pose": "attack",
"desc": "펼친 측정기 끝에서 보라 광선 — 앞 10m 줄 관통 사격, 표식 중첩마다 피해 +15%"
},
{
"name": "좌표 고정",
"pose": "front",
"desc": "12m 안 지점에 반지름 3m 원 장판 (보라 고리) 4초 — 안의 적 이동 −40%, 끝날 때 균열 폭발"
},
{
"name": "공간 접기",
"pose": "idle",
"desc": "측정기를 내려 땅에 꽂는 순간 8m 순간이동 (뒤로 · 옆으로), 원래 자리에 1초 잔상 미끼"
}
],
"passive": "관측 기록: 같은 적을 맞힐 때마다 그 적이 받는 마법 피해 +5% (최대 5중첩, 6초)"
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
"bag": 12,
"stats": {
"hp": 480,
"atk": 32,
"spd": 5.5,
"weight_kg": 56,
"tall_m": 1.68
},
"desc": "보라 피부에 톱니 이빨로 웃는 차원 연구자. 컴퍼스 · 고리로 된 황동 측정기로 공간 좌표를 재고 찢는다.",
"gen": 3,
"portrait": "art/h2/vicky/portrait.webp",
"face": "art/h2/vicky/face.webp",
"poses": {
"idle": {
"src": "art/h2/vicky/idle.webp",
"w": 252,
"h": 693,
"ax": 135,
"ay": 690,
"orig": "옆으로 서서 차원 측정기를 아래로 늘어뜨려 쥠",
"scale": 0.8
},
"front": {
"src": "art/h2/vicky/front.webp",
"w": 331,
"h": 781,
"ax": 121,
"ay": 778,
"orig": "앞 (3/4) 으로 서서 별 모양 측정기를 어깨 높이로 들어 보임",
"scale": 0.8
},
"attack": {
"src": "art/h2/vicky/attack.webp",
"w": 589,
"h": 621,
"ax": 352,
"ay": 618,
"orig": "다리 크게 벌리고 펼친 측정기 (컴퍼스 · 고리) 를 앞으로 내지름",
"scale": 0.8
}
}
},
"wangnim": {
"slug": "wangnim",
"name": "하르겐 (푸른 왕 · 파일 이름 '왕님')",
"rank": "보스 (파일 이름 '보스 왕님')",
"folder": "3기-2 (보스 왕님.png)",
"role": "보스 (2D 판 4층 왕관의 회랑의 보스 하르겐과 같은 인물로 판단 — 왕관 · 푸른 얼굴 · 하늘만 올려다보는 대기 · 푸른 장검이 도감 하르겐 대기 그림과 같음)",
"tall": 2.2,
"weight": 110,
"palette": [
"#0b0b09",
"#463a31",
"#8a6440",
"#5f7da6",
"#b08a4a"
],
"missing": [
"hurt",
"down",
"dead",
"back",
"front"
],
"kit": {
"basic": "장검 찌르기 (attack) — 앞 4.5m 줄",
"skills": [
{
"name": "청검 일섬",
"pose": "special",
"desc": "1초 웅크려 칼을 거두며 12m 일직선 예고 → 한 번에 벰 (공격력 2.2배, 막을 수 없음, 맞은 적 0.5초 경직). 체력 절반 아래면 두 번 연달아 (두 번째는 비스듬히). 거두는 동안 크게 휘청이면 끊김 (2D 기술 그대로). 재사용 7초 (절반 아래 4.5초)"
},
{
"name": "왕의 내려찍기",
"pose": "windup",
"desc": "0.8초 치켜든 뒤 앞 3m 지점 반지름 2m 원 내려찍기 — 넘어뜨림, 막으면 막은 쪽 1초 경직"
},
{
"name": "망토 쓸어 베기",
"pose": "low",
"desc": "몸을 낮춰 앞 5m 부채꼴 150도 다리 베기 — 2초 둔화 40%"
},
{
"name": "올려 베기",
"pose": "attack2",
"desc": "앞 3m 비스듬히 올려 베어 맞은 적을 1초 띄움 (공중 확인사살과 이어짐)"
}
],
"passive": "하늘만 보는 왕: 정면에서 오는 원거리 피해 30% 감소. 체력 절반 아래면 이동 속도 +20% · 청검 일섬 재사용 단축"
},
"apt": {
"melee": 5,
"spear": 1,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 0
},
"tag": "knight",
"role_job": "지휘",
"bag": 6,
"stats": {
"hp": 5200,
"atk": 95,
"spd": 4.2,
"weight_kg": 110,
"tall_m": 2.2
},
"desc": "민수 확인: 이름은 하르겐. 왕관의 회랑의 푸른 왕. 가시 왕관을 쓴 푸른 얼굴의 마른 노왕이 바닥까지 끌리는 갈색 망토를 두르고, 하늘만 올려다보다가 긴 푸른 장검 한 번에 베어 버린다.",
"gen": 1,
"codex_g": "hargen",
"batch": "3기-2",
"portrait": "art/h2/wangnim/portrait.webp",
"face": "art/h2/wangnim/face.webp",
"poses": {
"idle": {
"src": "art/h2/wangnim/idle.webp",
"w": 482,
"h": 699,
"ax": 240,
"ay": 696,
"orig": "하늘을 올려다보며 긴 푸른 장검을 땅에 세워 두 손으로 짚고 섬 (도감 하르겐 대기와 같은 자세)",
"scale": 1.55
},
"attack": {
"src": "art/h2/wangnim/attack.webp",
"w": 1037,
"h": 609,
"ax": 242,
"ay": 606,
"orig": "팔을 쭉 뻗어 긴 푸른 장검으로 앞을 찌름 (망토 자락 휘날림)",
"scale": 1.55
},
"attack2": {
"src": "art/h2/wangnim/attack2.webp",
"w": 592,
"h": 758,
"ax": 286,
"ay": 755,
"orig": "몸을 뒤로 젖히며 장검을 비스듬히 위로 올려 벰, 다른 손은 갈퀴처럼 펼침",
"scale": 1.55
},
"low": {
"src": "art/h2/wangnim/low.webp",
"w": 966,
"h": 377,
"ax": 327,
"ay": 374,
"orig": "몸을 낮게 숙여 망토를 넓게 펼치고 장검을 비스듬히 아래로 끌며 휘두름 (원본에서 칼끝이 옆 그림 망토에 닿아 있어, 칼끝 둘레의 망토 조각은 색으로 걸러 지움)",
"scale": 1.55
},
"windup": {
"src": "art/h2/wangnim/windup.webp",
"w": 498,
"h": 718,
"ax": 234,
"ay": 715,
"orig": "한 무릎 꿇고 두 손으로 장검을 머리 위로 높이 치켜듦 (내려찍기 직전). 원본에서 옆 그림 (low) 칼날이 망토 앞을 지나가 그 칼날을 지움 — 망토 아랫단에 가는 빈 틈이 남음",
"scale": 1.55
},
"windup2": {
"src": "art/h2/wangnim/windup2.webp",
"w": 553,
"h": 711,
"ax": 280,
"ay": 708,
"orig": "장검을 어깨 너머 뒤로 젖혀 들어 올림 (크게 베기 준비)",
"scale": 1.55
},
"walk": {
"src": "art/h2/wangnim/walk.webp",
"w": 673,
"h": 668,
"ax": 288,
"ay": 665,
"orig": "장검을 아래로 늘어뜨려 칼끝을 끌며 성큼 걸음",
"scale": 1.55
},
"special": {
"src": "art/h2/wangnim/special.webp",
"w": 663,
"h": 346,
"ax": 202,
"ay": 343,
"orig": "망토를 땅에 펼치고 낮게 웅크려 장검을 수평으로 겨눔 (청검 일섬 자세)",
"scale": 1.55
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
"orig": "검 늘어뜨리고 서 있음 (비키니 · 붉은 망토 버전)",
"scale": 1.0
},
"guard": {
"src": "art/h2/whistle/guard.webp",
"w": 587,
"h": 628,
"ax": 285,
"ay": 625,
"orig": "두 손으로 검 비스듬히 겨눔",
"scale": 1.0
},
"attack": {
"src": "art/h2/whistle/attack.webp",
"w": 724,
"h": 599,
"ax": 402,
"ay": 596,
"orig": "크게 옆으로 베기 (붉은 검기 궤적 포함) — 원래 왼쪽을 봄",
"scale": 1.0
},
"walk": {
"src": "art/h2/whistle/walk.webp",
"w": 354,
"h": 626,
"ax": 189,
"ay": 623,
"orig": "걸음 내딛으며 검 들고 감 (돌아서기)",
"scale": 1.0
},
"attack2": {
"src": "art/h2/whistle/attack2.webp",
"w": 614,
"h": 417,
"ax": 361,
"ay": 414,
"orig": "수평 검격 — 한 팔로 검 곧게 뻗기 (크롭탑 · 반바지 버전) — 원래 왼쪽을 봄",
"scale": 0.42
},
"taunt": {
"src": "art/h2/whistle/taunt.webp",
"w": 350,
"h": 711,
"ax": 176,
"ay": 708,
"orig": "검 어깨에 걸치고 허리에 손 (자신만만한 정면)",
"scale": 0.483
},
"idle2": {
"src": "art/h2/whistle/idle2.webp",
"w": 317,
"h": 699,
"ax": 155,
"ay": 696,
"orig": "서 있음 (바디수트 · 붉은 망토 버전)",
"scale": 0.483
},
"idle3": {
"src": "art/h2/whistle/idle3.webp",
"w": 370,
"h": 704,
"ax": 211,
"ay": 701,
"orig": "서 있음 — 원화 옷 (언더붑 재킷 · 끈 하의 · 사이하이 · 군화)",
"scale": 0.507
}
}
},
"wraitha": {
"slug": "wraitha",
"name": "망령A",
"rank": "보스",
"folder": "망령A",
"role": "적 (시트 이름은 '보스 시트'지만 폴더 이름이 '망령A' 라 같은 망령 무리의 하나 — 중간 보스 · 정예 적으로 알맞음)",
"tall": 1.9,
"weight": 70,
"palette": [
"#2b283a",
"#3b3f8f",
"#8a7a9a",
"#a08460",
"#4a3f3a"
],
"missing": [
"back",
"walk",
"hurt",
"down",
"dead",
"float(떠다니기)"
],
"kit": {
"basic": "갈고리 베기 (attack) — 앞 3m 부채꼴 60도",
"skills": [
{
"name": "갈고리 낚아채기",
"pose": "attack",
"desc": "기계 팔이 늘어나 줄 7m 앞으로 뻗음, 맞은 적을 붙잡아 1m 앞으로 끌어오고 1초 묶음"
},
{
"name": "망령 걸음",
"pose": "idle",
"desc": "몸이 흐려지며 4m 순간 이동 (적 뒤로), 다음 공격 피해 +50%"
},
{
"name": "넝마 장막",
"pose": "front",
"desc": "망토 자락을 펼쳐 앞 120도 2초 막기, 막는 동안 받은 근접 공격자에게 갈고리 반격"
}
],
"passive": "망령 — 받는 물리 피해 20% 감소, 빛 · 불 속성 피해는 30% 더 받음"
},
"apt": {
"melee": 4,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 4
},
"tag": "brawler",
"role_job": "척후",
"bag": 6,
"stats": {
"hp": 1800,
"atk": 42,
"spd": 5.5,
"weight_kg": 70,
"tall_m": 1.9
},
"desc": "붕대 감은 보라 해골 얼굴에 둥근 고글 안경, 넝마 망토의 망령. 오른팔은 낫 갈고리 기계 팔로, 멀리서 낚아채 끌어온다.",
"gen": 3,
"portrait": "art/h2/wraitha/portrait.webp",
"face": "art/h2/wraitha/face.webp",
"poses": {
"idle": {
"src": "art/h2/wraitha/idle.webp",
"w": 454,
"h": 702,
"ax": 232,
"ay": 699,
"orig": "옆모습 (오른쪽 보기) 구부정하게 서 있음, 기계 갈고리 팔 늘어뜨림",
"scale": 1.12
},
"front": {
"src": "art/h2/wraitha/front.webp",
"w": 615,
"h": 852,
"ax": 274,
"ay": 849,
"orig": "앞모습 (조금 오른쪽) 서 있음, 갈고리 팔 · 넝마 망토",
"scale": 1.12
},
"attack": {
"src": "art/h2/wraitha/attack.webp",
"w": 982,
"h": 619,
"ax": 432,
"ay": 616,
"orig": "몸 낮추고 기계 팔을 길게 뻗어 낫 같은 갈고리 집게를 벌림 (잡기 · 끌어오기)",
"scale": 1.12
}
}
},
"yellow": {
"slug": "yellow",
"name": "옐로",
"rank": "1기 동료 · ★ (등급 글자 없음 — 파일 이름 '옐로1~3'. 2D 판 '새 영웅: 옐로 (★, 근접 힐러)')",
"folder": "3기-2 (옐로1.png · 옐로2.png · 옐로3.png)",
"role": "동료 (2D 판 2층 · 3층 영입 동료, 근접 힐러)",
"tall": 1.6,
"weight": 48,
"palette": [
"#f7f3ee",
"#f2c64a",
"#2f6f8f",
"#d8262b",
"#2d2724"
],
"missing": [
"walk",
"down",
"dead",
"back",
"roller (2D 설정의 롤러스케이트 — 새 그림은 굽 높은 흰 장화)"
],
"kit": {
"basic": "갈퀴 할퀴기 (attack) — 앞 2m 부채꼴 90도 2연타",
"skills": [
{
"name": "덮치기",
"pose": "jump2",
"desc": "crouch 0.3초 → 7m 도약 덮치기, 떨어진 자리 반지름 1.5m 피해 + 0.6초 넘어뜨림. 재사용 7초"
},
{
"name": "연속 할퀴기",
"pose": "attack2",
"desc": "앞 2.5m 5연타, 마지막 타에 출혈 (3초 초당 공격력 20%)"
},
{
"name": "응급 처치",
"pose": "heal",
"desc": "3m 안 아군 하나에게 무릎 꿇고 1초 시전 — 즉시 체력 30% + 4초 동안 초당 2% 회복. 재사용 12초"
},
{
"name": "치고 빠지기",
"pose": "dash",
"desc": "6m 대시, 지나가는 줄 위 적을 할큄 (공격력 0.8배), 끝나면 0.5초 회피 상승"
}
],
"passive": "장난꾸러기 간호사: 근접 공격으로 피해를 줄 때마다 4m 안에서 체력이 가장 낮은 아군 회복 (준 피해의 15%) — 2D 근접 힐러 그대로"
},
"apt": {
"melee": 4,
"spear": 0,
"bow": 0,
"gun": 0,
"magic": 2,
"stealth": 3
},
"tag": "brawler",
"role_job": "지원",
"bag": 10,
"stats": {
"hp": 880,
"atk": 30,
"spd": 6.0,
"weight_kg": 48,
"tall_m": 1.6
},
"desc": "금발 긴 트윈테일 · 흰 간호모와 찢어진 흰 간호복 · 파란 기계 갈퀴 손의 장난꾸러기 간호사. 짐승처럼 치고 빠지며 할퀴고, 그 손으로 동료를 고친다.",
"gen": 1,
"codex_g": "yellow",
"batch": "3기-2",
"portrait": "art/h2/yellow/portrait.webp",
"face": "art/h2/yellow/face.webp",
"poses": {
"idle": {
"src": "art/h2/yellow/idle.webp",
"w": 490,
"h": 697,
"ax": 237,
"ay": 694,
"orig": "두 팔을 벌리고 파란 기계 갈퀴 손을 펼친 채 서서 웃음 (원본 왼쪽 보기 → 뒤집음)",
"scale": 1.45
},
"idle2": {
"src": "art/h2/yellow/idle2.webp",
"w": 387,
"h": 738,
"ax": 177,
"ay": 735,
"orig": "한 손을 얼굴 옆에 들어 갈퀴 손가락을 꼼지락거리며 웃고 섬 (원본 왼쪽 보기 → 뒤집음)",
"scale": 1.45
},
"taunt": {
"src": "art/h2/yellow/taunt.webp",
"w": 478,
"h": 735,
"ax": 276,
"ay": 732,
"orig": "고개를 젖혀 크게 웃으며 갈퀴 손을 얼굴 옆에 듦 (도발)",
"scale": 1.45
},
"attack": {
"src": "art/h2/yellow/attack.webp",
"w": 634,
"h": 679,
"ax": 258,
"ay": 676,
"orig": "등을 보이며 몸을 틀어 갈퀴 손을 앞으로 길게 내뻗어 할큄 (손톱 궤적)",
"scale": 1.45
},
"attack2": {
"src": "art/h2/yellow/attack2.webp",
"w": 663,
"h": 689,
"ax": 279,
"ay": 686,
"orig": "두 갈퀴 손으로 연달아 할큄 (손톱 궤적 선 두 줄)",
"scale": 1.45
},
"crouch": {
"src": "art/h2/yellow/crouch.webp",
"w": 534,
"h": 503,
"ax": 141,
"ay": 500,
"orig": "네 발로 낮게 엎드려 갈퀴 손을 땅에 짚음 (짐승처럼 덮칠 준비)",
"scale": 1.45
},
"prowl": {
"src": "art/h2/yellow/prowl.webp",
"w": 536,
"h": 647,
"ax": 203,
"ay": 644,
"orig": "낮게 웅크려 한 손을 땅에 짚고 고개를 숙인 채 노려봄 (트윈테일 크게 휘날림)",
"scale": 1.45
},
"dash": {
"src": "art/h2/yellow/dash.webp",
"w": 590,
"h": 639,
"ax": 116,
"ay": 636,
"orig": "앞으로 기울여 오른쪽으로 달려 나감, 트윈테일 뒤로 휘날림",
"scale": 1.45
},
"jump": {
"src": "art/h2/yellow/jump.webp",
"w": 568,
"h": 652,
"ax": 82,
"ay": 649,
"orig": "무릎을 들고 공중으로 뛰어올라 갈퀴 손을 뻗음 (이를 드러냄)",
"scale": 1.45
},
"jump2": {
"src": "art/h2/yellow/jump2.webp",
"w": 544,
"h": 583,
"ax": 197,
"ay": 580,
"orig": "무릎을 모아 웅크린 채 공중에 떠서 갈퀴 손을 앞으로 뻗음 (덮치기)",
"scale": 1.45
},
"heal": {
"src": "art/h2/yellow/heal.webp",
"w": 529,
"h": 605,
"ax": 257,
"ay": 602,
"orig": "한 무릎 꿇고 갈퀴 손을 앞으로 내밀어 손끝이 빛남 (치료 — 옐로1.png 같은 자리 그림에는 앞에 회색 환자 실루엣이 있어 그것 없는 옐로2 를 씀)",
"scale": 1.45
},
"hurt": {
"src": "art/h2/yellow/hurt.webp",
"w": 577,
"h": 612,
"ax": 313,
"ay": 609,
"orig": "무릎 꿇고 눈을 감은 채 붉게 빛나는 손목을 감싸 쥠 (맞음 · 아픔, 둘레에 흔들림 선 — 자기 치료로도 쓸 수 있음)",
"scale": 1.45
}
}
},
"yongmyo": {
"slug": "yongmyo",
"name": "용묘화",
"rank": "1기 동료 (등급 글자 없음 — 파일 이름 '용묘화1')",
"folder": "3기-2 (용묘화1.png)",
"role": "동료 (1기 동료 — 2D 판에서 성당 · 회랑에서 영입. 적 그림체 아님)",
"tall": 1.78,
"weight": 68,
"palette": [
"#141213",
"#302525",
"#624e48",
"#fad8bd",
"#a12a2a",
"#c9a24a"
],
"missing": [
"walk",
"dead",
"front",
"back",
"dash (돌진 — 2D 판에 있음)",
"guard (막기 — 2D 판에 있음)"
],
"kit": {
"basic": "삽 찌르기 (attack) — 앞 2.8m 줄, 삽날로 내지름 · 밀어냄 0.5m",
"skills": [
{
"name": "모아 내려치기",
"pose": "windup",
"desc": "0.6초 삽을 치켜들었다가 (windup) 앞 3m 원 (반지름 1.6m) 을 내려찍음 (dig 그림으로 끝) — 피해 2.2배, 1초 기절"
},
{
"name": "파내기",
"pose": "dig",
"desc": "삽날을 땅에 꽂아 앞 4m 부채꼴 90도로 흙 · 돌을 퍼 던짐 — 피해 1.2배, 2초 둔화 40%, 작은 함정 · 덫을 없앰"
},
{
"name": "휘둘러 쳐내기",
"pose": "attack2",
"desc": "몸을 돌려 삽을 크게 휘두름 — 앞 3.2m 부채꼴 150도, 맞은 적 2m 밀쳐 냄 (둘러싸였을 때)"
},
{
"name": "매복",
"pose": "crouch",
"desc": "쪼그려 숨어 3초 동안 눈에 덜 띔 (발각 거리 반) — 다음 공격 피해 1.5배"
}
],
"passive": "묘지기: 적을 쓰러뜨리면 그 자리를 '묻어' 체력 3% 회복, 쓰러진 적에게 주는 피해 +30% (확인사살)"
},
"apt": {
"melee": 5,
"spear": 3,
"bow": 0,
"gun": 0,
"magic": 0,
"stealth": 2
},
"tag": "brawler",
"role_job": "선봉",
"bag": 14,
"stats": {
"hp": 1150,
"atk": 32,
"spd": 4.6,
"weight_kg": 68,
"tall_m": 1.78
},
"desc": "龍墓花. 검은 군모 · 선글라스 · 검은 코트 (붉은 끈 바느질 · 금 견장) 의 여장부. 등과 팔에 용 문신, 큰 삽 하나로 싸우고 묻는다.",
"gen": 1,
"codex_g": "tomoe",
"batch": "3기-2",
"portrait": "art/h2/yongmyo/portrait.webp",
"face": "art/h2/yongmyo/face.webp",
"poses": {
"idle": {
"src": "art/h2/yongmyo/idle.webp",
"w": 453,
"h": 696,
"ax": 236,
"ay": 693,
"orig": "삽을 몸 앞에 비스듬히 쥐고 다리 벌려 선 자세 (3/4 앞, 얼굴 오른쪽)",
"scale": 1.48
},
"attack": {
"src": "art/h2/yongmyo/attack.webp",
"w": 749,
"h": 662,
"ax": 350,
"ay": 659,
"orig": "두 손으로 삽을 오른쪽으로 길게 내지름 (삽날 찌르기 · 밀어치기), 코트 자락 펄럭",
"scale": 1.48
},
"hurt": {
"src": "art/h2/yongmyo/hurt.webp",
"w": 400,
"h": 681,
"ax": 263,
"ay": 678,
"orig": "뒤로 젖혀지며 비틀거림, 삽 끝이 땅에 끌림 (맞고 밀림)",
"scale": 1.48
},
"down": {
"src": "art/h2/yongmyo/down.webp",
"w": 573,
"h": 456,
"ax": 473,
"ay": 453,
"orig": "땅에 주저앉아 한 손으로 버팀, 삽은 옆에 눕힘 (쓰러짐)",
"flat": true,
"scale": 1.48
},
"windup": {
"src": "art/h2/yongmyo/windup.webp",
"w": 451,
"h": 734,
"ax": 266,
"ay": 731,
"orig": "삽을 머리 위 뒤로 크게 치켜듦 (등이 보이는 각도, 모아 내려치기 준비)",
"scale": 1.48
},
"dig": {
"src": "art/h2/yongmyo/dig.webp",
"w": 669,
"h": 596,
"ax": 519,
"ay": 593,
"orig": "앞으로 깊게 내딛으며 삽날을 땅에 꽂아 퍼냄 (파내기 · 땅 찍기)",
"scale": 1.48
},
"attack2": {
"src": "art/h2/yongmyo/attack2.webp",
"w": 690,
"h": 709,
"ax": 240,
"ay": 706,
"orig": "등을 보이며 삽을 오른쪽으로 크게 휘둘러 내지름 (등의 용 문신 · 견장 보임)",
"scale": 1.48
},
"crouch": {
"src": "art/h2/yongmyo/crouch.webp",
"w": 582,
"h": 466,
"ax": 241,
"ay": 463,
"orig": "쪼그려 앉아 무릎 위에 삽을 가로로 걸침 (쉬기 · 매복)",
"scale": 1.48
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
"orig": "오른쪽: 쓰러짐 (손에 연기 남음)",
"flat": true
}
}
}
};
