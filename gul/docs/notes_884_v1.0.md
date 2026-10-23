# v8.8.4 작업 메모 — notes_884 v1.0 (옐로: 돌진 출발 · 3~5타 · 도약 스택)

엔진 (patch8840 v1.1): claw.rush spd 4 · sp0 1.2 · pow 1 · full 3.5 · spec.yclaw (tick 0.4 · nMin 3 · nMax 5 · mul 0.7 · fin 1.6 · rBase 0.5) · clawInit (저항 속도 → 타수) · clawStep (게이지 A.res · 타 · 마지막 타) · clawDone (놓아줌 · 박차고 떨어짐) · 도약 스택 (leap.stackCd · leapCdNext · stepLeapStk · leapTo 가 스택 만큼 멀리 · 스택 수만큼 소비 · yHop) · oldrules 추가.

페이지 (page8840 v1.0): 돌진 · 연속 도약 · 달라붙기 난도질 글 · 저항 게이지 그림 (고리 + 막대 + 'N/M타') · 큰 할큄 자국 (마지막 타) · 도약 칸 ●○ · 기록 글 · 버전 · RULES_MIG 8.8.4.

시험: eng8840 v1.0 (ALL OK — 돌진 배율 (출발 같음 · 어디서나 ≥ 남들) · 3 ~ 5타 (고블린 5 · 창병 4 · 거구 3) · 게이지 단조 증가 · 스택 (짧게 1 · 멀리 2 · 충전 · 스스로)) · ui8840 v1.0 (ALL UI8840 OK) · eng8820 (G · 달라붙기 타수) · eng8830 (부상 쌓임은 도망 못 가는 아군 대상) · ui8820 (할큄 그림 · 칸 이름) 고침. 돌진 · 도약 · 붙잡기와 이어진 회귀 25여 개 통과 (eng7240_v1.0 은 보관본 — 현재 eng7240 은 통과).
