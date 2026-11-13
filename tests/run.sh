#!/usr/bin/env bash
# 세희 회귀 테스트 한 번에 돌리기 — v1.0 (2026-11-13, 메인)
# 쓰는 법:  bash tests/run.sh            ← 전부
#           bash tests/run.sh tregen tbt ← 고른 것만
# 준비(처음 한 번): npm i -g playwright && npx playwright install --with-deps chromium
#   playwright 가 다른 곳에 깔려 있으면 NODE_PATH 로 알려 준다.
# 판정: 예외로 죽지 않고(종료 코드 0), _guard.js 가 모은 페이지 오류가 0개면 통과.
#   통과/실패만 보지 말고, 바꾼 기능의 테스트는 출력 줄을 직접 읽어 기대한 값인지 확인한다(자기 검증).
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/tests"
export NODE_PATH="${NODE_PATH:-}:$(npm root -g 2>/dev/null):/opt/npm-tools/node_modules"

# 서버 3개: 저장소 루트(8765) · 업데이트 테스트용 복사본(8766) · 계정 서버 대역(8787)
{ pkill -f "http.server 8765"; pkill -f "http.server 8766"; pkill -f "serve.mjs"; } >/dev/null 2>&1
(cd "$ROOT" && python3 -m http.server 8765 >/dev/null 2>&1 &)
rm -rf /tmp/updt && mkdir -p /tmp/updt && cp -r "$ROOT/sehee" /tmp/updt/sehee
(cd /tmp/updt && python3 -m http.server 8766 >/dev/null 2>&1 &)
(node "$ROOT/tests/syncsrv/serve.mjs" >/dev/null 2>&1 &)
sleep 1.5

ALL="tcode tload tmemo tpanway tregen tretry twork tpdr tdoss tpdout tbapi tlanes tbt tppl tscroll tsync tvis tgo tupd2 toff tdraw tx tcal tjob tshare tdev tnote tswipe2 tbtfold"
LIST="${*:-$ALL}"
pass=0; fail=0; failed=""
for t in $LIST; do
  out="$(timeout 150 node --require ./_guard.js "$t.js" 2>&1)"; code=$?
  if [ $code -eq 0 ] && echo "$out" | grep -q "^GUARD errors \[\]$"; then pass=$((pass+1)); echo "통과  $t"
  else fail=$((fail+1)); failed="$failed $t"; echo "실패  $t"; echo "$out" | grep -vE "^\s+at " | tail -6 | sed 's/^/      /'; fi
  [ "$t" = "tupd2" ] && rm -rf /tmp/updt/sehee && cp -r "$ROOT/sehee" /tmp/updt/sehee
done
{ pkill -f "http.server 8765"; pkill -f "http.server 8766"; pkill -f "serve.mjs"; } >/dev/null 2>&1
echo "────────"; echo "통과 $pass · 실패 $fail${failed:+ ·$failed}"
[ $fail -eq 0 ]
