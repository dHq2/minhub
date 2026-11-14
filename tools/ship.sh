#!/usr/bin/env bash
# 올리기 — v1.1 (2026-11-15, A · 작업 속도 개편 · v1.1: INTERNAL=1 · 테스트 중 멈춤 handoff/FREEZE)
# 버전 번호와 CHANGELOG 는 올리는 그 순간에만 찍는다. 방은 index.html·sw.js 번호와 CHANGELOG 맨 위를 직접 고치지 않는다.
# 쓰는 법:  bash tools/ship.sh A "한 줄 요약"
#   - 변경 설명(여러 줄)은 미리 changes/A.md 에 써 둔다(없으면 한 줄 요약만 들어감). 올라가면 이 파일은 지워진다.
#   - TESTS="tregen tdel" bash tools/ship.sh A "…"  ← 고른 검사만(가벼운 길: 문구·색·간격·문서). 빼면 전체(동시에 3줄, 6분 안팎).
#   - TESTS=none → 검사 없이(문서·할일·알림만 바꾼 때만).
#   - DRY=1 → 올리지 않고 찍기까지만 보여 줌.
#   - INTERNAL=1 → 사용자에게 안 보이는 일(작업 방식·테스트·도구)은 제목에 '(내부)' — 업데이트 때 세희 설명에서 빠진다. 줄 하나만 내부면 그 줄에 '(내부)'.
#   - handoff/FREEZE 파일이 있으면(보스가 실전 테스트 중) 안 올린다 — 급하면 FORCE=1. 테스트가 끝나면 그 파일을 지운다.
# 하는 일: ① 지금 바뀐 것 커밋 ② pull --rebase ③ 검사 ④ 최신 번호 +1 을 index.html·sw.js 에 찍고 changes/방.md 를 CHANGELOG 맨 위로 ⑤ push
#   push 가 밀리면(남이 먼저 올림): 찍은 커밋만 되돌리고 다시 pull → 남의 코드가 들어왔으면 검사 다시 → 다시 찍고 push (최대 5번). 같은 번호 두 개는 생길 수 없다.
set -euo pipefail
ROOM="${1:?방 이름(A·B·C)}"; MSG="${2:?한 줄 요약}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$ROOT"
FRAG="changes/$ROOM.md"
if [ -f handoff/FREEZE ] && [ -z "${FORCE:-}" ]; then echo "!! 지금은 테스트 중이라 올리기 멈춤(handoff/FREEZE: $(head -1 handoff/FREEZE)). 급하면 FORCE=1"; exit 1; fi
[ -n "${INTERNAL:-}" ] && MSG="(내부) $MSG"
TAIL=$'\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'"${SHIP_TRAILER:+$'\n'$SHIP_TRAILER}"
run_tests(){
  local t="${TESTS:-}"
  if [ "$t" = "none" ]; then echo "· 검사 생략(TESTS=none)"; return 0; fi
  if [ -n "$t" ]; then bash tests/run.sh $t; else bash tests/run.sh; fi
}
git add -A
if ! git diff --cached --quiet; then git commit -q -m "$MSG — $ROOM (작업)$TAIL"; fi
git checkout -q -- 'tests/*.png' 2>/dev/null || true
git pull -q --rebase || { echo "!! 합치다 충돌 — 손으로 풀고(git status) 다시 ship.sh"; exit 1; }
if [ -f handoff/FREEZE ] && [ -z "${FORCE:-}" ]; then echo "!! 받아 보니 테스트 중(handoff/FREEZE) — 커밋은 내 쪽에 두고 멈춤. 끝나면 다시 ship.sh"; exit 1; fi
run_tests
for try in 1 2 3 4 5; do
  cur="$(grep -o "APP_VERSION = 'v[0-9.]*'" sehee/index.html | grep -o 'v[0-9.]*')"
  next="$(echo "$cur" | awk -F. '{printf "%s.%s.%d", $1, $2, $3 + 1}')"
  sed -i "s/APP_VERSION = '$cur'/APP_VERSION = '$next'/" sehee/index.html
  sed -i "0,/VERSION = '$cur'/s//VERSION = '$next'/" sehee/sw.js
  body=""; [ -f "$FRAG" ] && body="$(cat "$FRAG")"
  python3 - "$next" "$ROOM" "$MSG" "$body" <<'PY'
import sys
v, room, msg, body = sys.argv[1:5]
p = 'sehee/CHANGELOG.md'; s = open(p, encoding='utf-8').read()
i = s.index('\n## v') + 1
entry = f"## {v} · {room} · {msg}\n" + (body.strip() + "\n" if body.strip() else "") + "\n"
open(p, 'w', encoding='utf-8').write(s[:i] + entry + s[i:])
PY
  [ -f "$FRAG" ] && git rm -q "$FRAG"
  git add sehee/index.html sehee/sw.js sehee/CHANGELOG.md
  git commit -q -m "$next — $ROOM: $MSG$TAIL"
  if [ -n "${DRY:-}" ]; then echo "DRY: $next 찍음(안 올림)"; git log --oneline -2; exit 0; fi
  if git push -q 2>/dev/null; then echo "올림: $next — $ROOM: $MSG"; exit 0; fi
  echo "· 밀림($try) — 남이 먼저 올림. 찍은 것만 되돌리고 다시 받는다"
  git reset -q --hard HEAD~1
  before="$(git rev-parse '@{u}')"; git pull -q --rebase || { echo "!! 합치다 충돌 — 손으로 풀고 다시 ship.sh"; exit 1; }
  after="$(git rev-parse '@{u}')"
  if git diff --name-only "$before" "$after" -- sehee sehee-sync tests | grep -vqE '^sehee/(index\.html|sw\.js|CHANGELOG\.md)$'; then echo "· 남의 코드가 들어옴 → 검사 다시"; run_tests; fi
done
echo "!! 5번 밀림 — 잠시 뒤 다시"; exit 1
