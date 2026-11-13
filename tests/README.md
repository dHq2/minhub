# 세희 회귀 테스트 — v1.1 (2026-11-13)

세 방이 올리기 전에 똑같이 돌리는 테스트. 진짜 API 키·PIN 은 쓰지 않는다(AI 는 가짜 응답, 계정 서버는 syncsrv/ 대역, 대역 PIN 은 2580).

## 돌리기
```
npm i -g playwright && npx playwright install --with-deps chromium   # 처음 한 번
bash tests/run.sh             # 전부 (약 4~6분)
bash tests/run.sh tregen tbt  # 고른 것만
```
run.sh 가 저장소 루트를 8765, 업데이트 테스트용 복사본(/tmp/updt)을 8766, 계정 서버 대역을 8787 에 띄운다.
판정: 종료 코드 0 + `_guard.js` 가 모은 페이지 오류 0개. 통과만 보지 말고, 바꾼 기능의 테스트는 출력 줄을 직접 읽어 기대한 값인지 본다.

## 무엇을 보나
| 테스트 | 보는 것 |
| --- | --- |
| tcode | index.html 의 css·js 목록 = sw.js 의 CODE 목록, 파일 있음, 두 버전 같음 |
| tload | 첫 화면이 오류 없이 뜸 |
| tregen · tretry | 다시 답하기(앞 답 안 보냄, 판 되돌림) · 실패 후 다시 시도 |
| twork · tbt | 작업 중계·작업 중 질문 · 보드 대화 상자 |
| tpdr · tpdout · tdoss · tppl · tvis | 판 서랍 · 서랍 밖 누르기 · 인물 기록부 · 인간관계 판 · 자료 카드 |
| tbapi · tlanes | SEHEE 창구 · 실험 파일(B·C) 켜고 끄기 |
| tscroll · tdraw · tswipe2 · tgo · tx | 판 굴리기 · 서랍 끌기 · 옆으로 밀기 · 화면 이동 · ✕ 단추 |
| tsync · toff | 계정 동기화·PIN 잠금 · 오프라인 |
| tupd2 | 켤 때 업데이트 묻기·거절·한 번에 최신 |
| tcal · tjob · tshare · tnote · tdev | 달력 · 긴 일(캡처 해독) · 공유하기 · 폰 알림 · 개발자 로그 |

## 새 테스트 넣기
- 파일 이름 t○○.js, `http://localhost:8765/sehee/` 를 연다. AI 는 page.route 로 가짜 SSE(tregen.js 참고).
- 폴더에 t○○.js 로 두기만 하면 run.sh 가 저절로 모은다(v1.1 — 목록 줄 충돌 없음).
- 스크린샷은 /tmp 에 저장한다(tests/ 에 PNG 를 만들면 다른 방 pull 이 막힌다).
- 이름·사정이 실제 사람 같은 예시는 쓰지 않는다(이 저장소는 공개).

## 변경 기록
- v1.1 (2026-11-13, A) run.sh 가 t*.js 를 저절로 모음. 스크린샷은 /tmp 로. sehee/CHANGELOG.md 는 .gitattributes 로 union 병합(동시에 맨 위에 덧붙여도 충돌 안 남 — 순서만 손봄).
- v1.0 (2026-11-13, A) 처음. A 방 작업 공간에 있던 테스트 25종을 옮김(실제 이름·PIN 은 가짜로 바꿈) + tcode · _guard.js · run.sh.
