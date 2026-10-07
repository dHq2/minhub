# 투기장 (arena) v1.3

v1.3 (2026-10-07): 투기장 페이지 하나에 탭으로 모음 (티어표 · 순위 / 명경기). 새 기록은 새 페이지를 만들지 않고 같은 페이지에 탭을 더함. 명경기 움짤은 게시할 때 hl/<id>.webp · hl/<id>_still.jpg 로 붙임 (arena_tpl.html 의 HL 목록).

v1.2 (2026-10-06): 명경기 녹화 arena_highlights.js v1.3 — 대진 (highlights/sc*.json) 을 여러 번 붙여 조건에 맞는 판을 고르고, 화면 없이 빨리 돌리다 막판 (한쪽 체력 35% 아래) 부터 0.2초마다 찍음. `node arena_highlights.js sc1.json` → f/<id>/*.jpg, 움짤은 PIL 로 webp. 페이지 틀 highlights/highlights.html.

v1.1 (2026-10-06, 게임 v0.66): 3기-2 26명을 더해 92명 · 8372판 다시 돌림 (오류 0 · 멈춤 0). arena_analyze.py v1.0 (판 결과 → arena.json) 추가 · arena_build.py v1.1 (결과 폴더 인자).

2기 · 3기 인물 (h2) 전원 1대1 리그. 2026-10-06 첫 판 (게임 v0.64): 66명 · 4290판.

- arena_sim.js v1.0 — 훈련장 (#drill) 을 Playwright 로 열고 그리기를 끈 채 loop() 를 0.05초씩 직접 돌려 대결.
  `node arena_sim.js <결과.json> <짝목록.json> [제한초=45]` · 정적 서버가 localhost:8767 에 저장소 뿌리를 띄워야 함.
  짝목록 = [[A, B], ...] (A 는 아군 자리 h2_A, B 는 적 자리 h2e_B). 각 쌍은 자리 바꿔 두 번.
- arena_build.py v1.0 — arena.json + 판 결과 (r1~r4.json) → 티어표 페이지 (arena_tpl.html 틀).
- arena_analyze.py v1.0 — `python3 arena_analyze.py <결과 폴더>` → 그 폴더에 arena.json.
- data/arena.json — 최근 판 정리 결과 (92명, 순위 · 쌍 점수 표).

점수: KO 승 0.5 + 0.5 × 남은 피 · KO 패 그 반대 · 45초 판정은 남은 피 차. 쌍 점수 = 두 판 합 (−2 ~ +2), 순위 = 평균.
