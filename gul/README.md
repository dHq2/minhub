# 굴의 전투판 — 소스 보관 v2.0

- v2.0 (2026-10-19): 게임 v8.4.0 (세르파 슬라임 조직 — 뽑기 · 합치기 · 레이더 · 수정 우박). 엔진 patches/patch8400.py · 화면 patches/page8400.py · 모듈 run8_f.js · 시험 ui8400 · 판 재기 sim8400. 설계 docs/design_800_v1.5.md.
- v1.9 (2026-10-19): 게임 v8.3.0 (히든보스 적뢰 — 1F 1S 굴 밖으로 · 폭우 · 낙하 · 날라차기 · 번개창 · 천벌 · [낙인:적뢰] · 성해포). 엔진 patches/patch8300.py · 화면 patches/page8300.py · 모듈 run8_e.js · 시험 ui8300 · 판 재기 sim8300. 설계 docs/design_800_v1.4.md.
- v1.8 (2026-10-19): 게임 v8.2.1 (그만두기 · 확인 창 고침 — 아티팩트 화면은 브라우저 confirm · prompt 를 막음 → 판 위의 창). patches/page8210.py · 시험 ui8210.
- v1.7 (2026-10-19): 게임 v8.2.0 (30층 결승 — 링 · 춤추는 거인 · DJ 춘향 · 글리치 챔피언 1대1 직접 조작). 모듈 run8_d.js (patches/page8200.py 가 page8100 다음에 붙임). 설계 docs/design_800_v1.3.md.
- v1.6 (2026-10-19): 게임 v8.1.0 (챔피언 로드 — 관중 열기 · 응원 · 야유 · 축복 · 증오 · MC 실황 · 깜짝 규칙). 모듈 run8_c.js (patches/page8100.py 가 page8000 다음에 붙임).
- v1.5 (2026-10-19): 게임 v8.0.0 (30층 여정 — 갈림길 지도 · 그림 맵 34장 · 뽑기 · 유물 · 보스 · 정산 · 결말). 여정 모듈은 run8_a.js · run8_b.js (patches/page8000.py 가 page10.tpl.html 에 붙임), 그림 맵 목록은 docs/maps8/maps8.json, 그림은 build/art/maps. 설계는 docs/design_800_v1.2.md.
- v1.4 (2026-10-19): 게임 v7.29.0 (싸움 바로잡기 — 철퇴 오사 · 돌격 안 함 · 세자르 버팀 · 왕관 권위E). docs 에 30층 여정 설계 (design_800) · 드라이브 5기 목록 · 그림 맵 칸 고침 (mapfix).
- v1.3 (2026-10-18): 게임 v7.28.0 (연출 — 카메라 워킹 · 보스 치명타 · 가벼운 진동).
- v1.2 (2026-10-18): 게임 v7.27.0 (레지나 인카운터 · 세자르 알현실 도감 그림 · 새 대화 그림). 그림 손질 도구는 patches/tools.
- v1.1 (2026-10-18): 게임 v7.26.2 (이동 · 합류 · 샷건 · 문 · 인카운터 바로 해 보기). gulsync.sh 로 맞춤.
- v1 (2026-10-18): 처음 올림. 게임 v7.26.0 (오딜의 방) 기준.

공개 판: https://claude.ai/artifact/Bb3MmvnUEH7EeisHZ87U1j (판 156 = v8.4.0)

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
- patches/tools/ — 도감 그림 손질 (czmask · czgrid · czcells · czclean: 체크무늬 걷기 · 칸 맞추기 · 막힌 칸 지도)
- docs/ — 설계 · 상태 문서 (design_*.md · 캐릭터 설정 프롬프트 · 오딜의 방 원문)

## 빌드 · 시험에 필요한 것
- python3 · node · (시험) playwright + chromium
- 엔진 시험은 `RT3=rt3.js node engNNNN.js` 처럼 엔진 파일을 알려 줌 (allreg.sh 가 알아서 함)
