# minhub 작업 규칙 v1.1

v1.1 (2026-10-07): 대화는 한국어로 고정 (민수 지시).
v1.0 (2026-10-07): 도감 관리 규칙 (민수 지시).

## 대화

- 민수와의 대화는 처음부터 끝까지 한국어로만. 중간 보고 · 진행 알림 · 정리 · 표 제목까지 전부 한국어 (코드 · 파일 이름 · 명령어 그 자체만 예외)

## 도감 (codex/) — 민수가 직접 지우고 고침, Claude 는 묻지 않음

- 도감 게시본: https://claude.ai/artifact/4BEgULpvxs1oSpZVkgka51 (저장소 'marks' 모음에 체크 · 메모 · 인물 구분 · 등급 · 이름 · 대표 초상화 · 삭제 표시)
- 매 턴 시작에 (도감 이야기가 없어도) 쓰레기통을 확인하고 바로 반영. 묻지 않음
  1. ArtifactData list marks (limit 1000, out_dir 로 내려받기)
  2. `python3 codex/tools/trash_apply.py <내려받은 폴더>` — 삭제 표시 (체크 + 메모가 '삭제' 로 시작) 그림 · 인물을 catalog 에서 빼고 codex/trash.json 에 기록
  3. codex/tools/trash_out.json 의 delete_docs 를 저장소에서 지움 (ArtifactData batch delete, 50개씩)
  4. 지운 게 있으면 pack.py · hipack.py 다시 → 도감 게시 · 커밋 · 푸시. 한 줄로만 알림 ("도감 쓰레기통 N개 비움")
- 인물 이름 바꾸기 (marks[C-…].name) · 대표 초상화 (marks[C-…].face) · 구분 · 등급은 도감 화면이 바로 씀. 게임 쪽 반영이 필요하면 그때 읽어서 씀
- 백업: codex/backup/2026-10-07/ (catalog · packs · hipacks · index · 저장소 marks 646건). 지운 것은 trash.json 기록 + git 에서 되살릴 수 있음
- 파이프라인 순서: h2_poses → h3_extra → faction_heroes → renames → trash_apply (인자 없이) → pack · hipack — 다른 도구가 되살려도 쓰레기통이 다시 지움
