# minhub 작업 규칙 v1.8

v1.8 (2026-10-10): 도감 파이프라인에 g4_extra (4기 칸 · src4 원본) 추가.
v1.7 (2026-10-10): 도감 정리 후보 (codex/cands.json · tools/cands.py) — 지우지 않고 꼬리표만. 파이프라인 trash_apply 뒤에 cands.
v1.6 (2026-10-10): 도감 무거운 그림 (움짤 · hi 원본) 은 자산 보관함 (blobs.js · tools/blobs.py) — 화질은 낮추지 않음 (민수: 퀄리티 유지). 쓰레기통 뒤엔 pack.py 만. 저장소 기록이 1000건 넘으면 나눠 읽기.
v1.5 (2026-10-09): 도감 파이프라인에 m10_poses (잡몹 10명 동작) 추가 · 한 판 256MiB 한도면 shrink_anim.py.
v1.4 (2026-10-08): 본명이 바뀌면 cave-3d/tools/sync_names.py 로 게임 이름도 맞춤.
v1.3 (2026-10-08): 인물 본명 = 도감에서 고친 이름 (marks[C-…].name), 최우선 (민수 지시).
v1.2 (2026-10-07): 모션 고치면 콜로세움 업뎃! 칸에 올림 (민수 지시).
v1.1 (2026-10-07): 대화는 한국어로 고정 (민수 지시).
v1.0 (2026-10-07): 도감 관리 규칙 (민수 지시).

## 대화

- 민수와의 대화는 처음부터 끝까지 한국어로만. 중간 보고 · 진행 알림 · 정리 · 표 제목까지 전부 한국어 (코드 · 파일 이름 · 명령어 그 자체만 예외)

## 도감 (codex/) — 민수가 직접 지우고 고침, Claude 는 묻지 않음

- 도감 게시본: https://claude.ai/artifact/4BEgULpvxs1oSpZVkgka51 (저장소 'marks' 모음에 체크 · 메모 · 인물 구분 · 등급 · 이름 · 대표 초상화 · 삭제 표시)
- 매 턴 시작에 (도감 이야기가 없어도) 쓰레기통을 확인하고 바로 반영. 묻지 않음
  1. ArtifactData list marks (limit 1000, out_dir 로 내려받기 — 결과에 next_cursor 가 있으면 cursor 로 이어 받아 같은 폴더에)
  2. `python3 codex/tools/trash_apply.py <내려받은 폴더>` — 삭제 표시 (체크 + 메모가 '삭제' 로 시작) 그림 · 인물을 catalog 에서 빼고 codex/trash.json 에 기록
  3. codex/tools/trash_out.json 의 delete_docs 를 저장소에서 지움 (ArtifactData batch delete, 50개씩)
  4. 지운 게 있으면 pack.py 다시 (hipack.py 는 새 그림을 넣을 때만 — hi 는 보관함이라 다시 만들면 다시 올려야 함) → 도감 게시 · 커밋 · 푸시. 한 줄로만 알림 ("도감 쓰레기통 N개 비움")
- 인물 본명 = 도감에서 고친 이름 (marks[C-…].name). 초상화 줄 · 격자 · 묶음 머리 · 이름 단추 어디서 고쳐도 같은 칸. 파일명 · 그림 번호 · catalog 이름 · 게임 내부 이름보다 최우선 — 인물을 부르거나 문서 · 게임에 이름을 쓸 땐 이 이름을 먼저 읽음 (비어 있을 때만 catalog 이름). 게임 이름은 `python3 cave-3d/tools/sync_names.py <내려받은 marks 폴더>` → src/names.js 로 맞춤 (이름이 바뀌었으면 게임 게시 때 같이)
- 인물 이름 바꾸기 (marks[C-…].name) · 대표 초상화 (marks[C-…].face) · 구분 · 등급은 도감 화면이 바로 씀. 게임 쪽 반영이 필요하면 그때 읽어서 씀
- 백업: codex/backup/2026-10-07/ (catalog · packs · hipacks · index · 저장소 marks 646건). 지운 것은 trash.json 기록 + git 에서 되살릴 수 있음
- 파이프라인 순서: h2_poses → h3_extra → faction_heroes → m10_poses (인자 없이) → g4_extra (인자 없이 — codex/src4 에서 다시) → renames → trash_apply (인자 없이) → cands → pack · hipack — 다른 도구가 되살려도 쓰레기통이 다시 지움
- 정리 후보: codex/cands.json (세계관 · 그림체가 굴과 동떨어진 그림, 이유 · 단계) → `python3 codex/tools/cands.py` → cands.js. 도감에 꼬리표 · 거르기만, 지우는 건 민수의 🗑 삭제 표시로만
- 게시: 한 번에 64MB · 255개, 한 판 256MiB · 511개 까지. 바뀐 파일만 files 로 보냄 (나머지는 그대로 남음). 목록은 `python3 codex/tools/publish_files.py`
- 무거운 그림은 자산 보관함 (도감 아티팩트 assets, 1GiB · 5000개 — 한 판에 안 셈): 묶이지 않은 움짤 (img/** 여러 장 webp) + 꽉 찬 화면 원본 hi/*.webp. 지도 codex/blobs.json → blobs.js (화면은 '/_blob/' + id 로 읽음)
  - 새 움짤 · hipack 을 돌린 뒤: `python3 codex/tools/blobs.py plan` → 찍힌 묶음을 Artifact (url=도감, asset: true, file_paths 25개씩) 로 올림 → 결과 글을 파일로 저장 → `python3 codex/tools/blobs.py add <파일>…` → blobs.js 를 files 로 게시. plan 이 찍은 옛 id (바뀐 hi 등) 는 올린 뒤 지움 (delete_asset)
  - 화질을 낮춰 공간을 내지 않음 (shrink_anim.py 는 쓰지 않음). 공간이 모자라면 보관함으로 더 옮김

## 콜로세움 업뎃! 칸 (cave-3d) — 모션 시험용

- 인물의 동작 · 크기 · 보는 방향 · 그림을 고치면 cave-3d/src/drill.js 의 COLO_UPD 맨 앞에 묶음 하나를 더함 ({ v: 게임 버전, n: 한 줄 설명, ids: 콜로세움 명단 id — 동료 'kariusAlly' · 드라이브 명단 'h2:slug' · 옛 적 'cesar' })
- 콜로세움 편성 창 맨 위에 노란 테두리 + '업뎃!' 표시로 뜸. 묶음이 3개를 넘으면 가장 오래된 것을 뺌
