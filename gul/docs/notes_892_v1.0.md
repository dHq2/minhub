# v8.9.2 작업 메모 — notes_892 v1.0
- d5/poly/pearl1.json: nx 10 · floor 한 다각형 (35 + 33 점) · cells {'.': [[7,1]]} (맨 윗줄 한 칸) · in [200,1560,500,1810] · out [330,130] · amb 0.85. 원본 그림 d5/raw/pearl1_src.png (= 대화 이미지 23, 667 × 2000) → polyfix 가 d5/raw/pearl1.png 로.
- 칸 너비 점검: 줄별 이어진 바닥 최소 5 (0 · 맨 아래 끝줄 제외). 시험 ui8920.js v1.1 이 줄마다 셈.
- page8920.py v1.1 (page8900 위): 버전 8.9.2 · z=1 목록에 pearl1 · x_pearlFight 의 맵 → pearl1 + bare. (v1.0 은 소품이 무작위로 놓여 수레 · 바위가 다리 위에 — 그래서 bare.)
- ui8790.js v1.3 (싸움 맵 = pearl1 로 기대값 고침) · sim8790.js (x_pearl 맵 pearl1) · ui8920.js v1.1 · par892.sh v1.0 (par890 + ui8920).
- 맵 다시 만들기 tools/maps8.py 약 2분 → d5/maps8.json 에 pearl1 (177 장).
- 도감: abyss/push catalog v2.01 (+ 11) · img/map6/ 11장 (webp q92) · index v2.16 — 도감 판 135.
