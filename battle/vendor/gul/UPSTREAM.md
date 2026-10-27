# 원본 굴 엔진 (vendor) — 수정 금지

- 원본: GitHub `dHq2/minhub` 브랜치 `claude/adoring-darwin-gkixgo` 의 `gul/rt3_head.js` · `rt3_mid.js` · `rt3_tail.js`
- 가져온 시점: 커밋 `2afc35d6916e302293ff8ad396bcf16fea590b86` (원본 게임 v9.10.0, 2026-10-26)
- 이 폴더의 세 파일은 **원본 그대로** 두는 것이 규칙입니다. 고칠 일이 있으면 `tools/patches/` 에 패치를 만들어 빌드 때 입히고, 이유를 패치 머리에 적습니다. (원본이 바뀌어도 패치가 먼저 깨져 알려 줍니다.)
- 원본 설계도: 원본 브랜치 `gul/docs/gul_blueprint_v1.0.md` (엔진 수치 · 규칙 전체), 최신 노트 `gul/docs/notes_990_1000_v1.0.md`

## 새 원본을 가져오려면

```
bash battle/tools/sync_upstream.sh            # 원본 브랜치 최신으로 (이 문서의 커밋 번호도 갱신)
python3 battle/tools/build.py --test          # 패치 · 엔진 불러오기 · 헤드리스 시험
```
시험이 통과하면 커밋. 깨지면 `tools/patches/` 의 어느 패치인지 이름이 나옵니다.
