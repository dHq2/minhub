# v8.8.6 작업 메모 — notes_886 v1.0

- patch8860.py v1.0 (patch8850 위): pbMul(W,u,t,J,pw,arcX) 새 함수, penPower 에 t 인자 추가 (방패 · 몸 두 곳 모두 t 넘김), penRes 결과에 pb (영거리가 아니면 못 뚫었을 것을 뚫은 배율), strike 에서 o.pb · tag. 환경변수 PB='{"gk":0.8,...}' 로 값 덮어쓰기 가능.
- page8860.py v1.0 (page8850 위): 버전 8.8.6 · RULES_MIG 8.8.6 · 머리글 안내.
- 시험: eng8860.js v1.0 (수치표 · 거리별 관통력 단조 · 샷건 판금 · 적 사수 대칭 · 마법/투창 제외) · 측정용 _dbg886.js · eng8850.js v1.1 (밀침 조건 완화).
- 회귀: par886.sh v1.0 (ENG 에 eng8860) — 엔진 47개 · reg 묶음 통과, UI 일부 (ui8840 · ui7251 · ui8830 · ui7250) 통과.
- 곡사는 제외 (pbMul 은 arcX 면 1), 투창 · 마법 칸에는 pb 가 없음.
