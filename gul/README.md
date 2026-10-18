# 굴의 전투판 — 소스 보관 v1

- v1 (2026-10-18): 처음 올림. 게임 v7.26.0 (오딜의 방) 기준.

공개 판: https://claude.ai/artifact/Bb3MmvnUEH7EeisHZ87U1j (판 146 = v7.26.0)

## 무엇이 어디에
- rt3_head.js · rt3_mid.js · rt3_tail.js — 전투 엔진 (세 조각을 이어 rt3.js 로 씀)
- page10.tpl.html — 화면 (UI · 캠페인 · 대화 · 인카운터 · 오딜의 방)
- build10.py · wrap.js · bld.sh — 빌드. `bash bld.sh` → build/wrapped.html
- idaudit2.js (정체성 누락 검사) · verscheck.js (판 번호 검사)
- roster4.json · oldrules.json · build/faces_idx.json — 빌드에 들어가는 자료
- build/art · build/faces.webp · build/icons.webp — 그림 (대화 그림 · 방 가구 · 얼굴 · 아이콘)
- build/wrapped.html — 바로 열어 볼 수 있는 완성본 (그림은 build/art 를 옆에 두고)
- ui*.js · eng*.js 그 밖의 .js — 시험. `bash runui.sh` (UI 묶음) · `bash allreg.sh` (전체 회귀)
- patches/ — 판마다 바꾼 기록 (patchNNNN.py = 엔진 · pageNNNN.py = 화면). 안의 경로는 만들 때의 작업 폴더라, 다시 쓰려면 맨 위 D 를 이 폴더로 바꿈
- docs/ — 설계 · 상태 문서 (design_*.md · 캐릭터 설정 프롬프트 · 오딜의 방 원문)

## 빌드 · 시험에 필요한 것
- python3 · node · (시험) playwright + chromium
- 엔진 시험은 `RT3=rt3.js node engNNNN.js` 처럼 엔진 파일을 알려 줌 (allreg.sh 가 알아서 함)
