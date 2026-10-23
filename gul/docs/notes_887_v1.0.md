# v8.8.7 작업 메모 — notes_887 v1.0
- tools/polyfix.py v1.1 (새): d5/poly/<제목>.json (floor · block · cover 다각형 · in · out · cells 손 고침 · crop) → d5/fix + d5/raw (자른 그림). 칸 판정: 바닥 ≥ 0.5 · 막힘 ≥ 0.3 · 엄폐 ≥ 0.3.
- tools/maps8.py 는 그대로 (전부 다시 뽑아도 옛 166장은 같음 — 비교 확인).
- page8870.py v1.0 (page8860 위): FIX8[2] (rows) · r8FloorDef 가 rows 를 가져감 · bare (r8Sec 의 place 가 아무것도 안 놓음 · S.art8sec 에 저장) · ruin2* z=1 · 버전 8.8.7.
- 시험: ui8870.js v1.0 (맵 5장 · 칸 크기 · 1층 → 2층 · 세 칸 · 적 0 · 소품 0 · 바닥 위 · 아래 계단 → 3층 · 3번째 칸 무작위). par887.sh · allreg v4.7.
