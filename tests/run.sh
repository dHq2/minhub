#!/usr/bin/env bash
# 세희 회귀 테스트 — v2.0 (2026-11-15, A · 작업 속도 개편)
# 쓰는 법:  bash tests/run.sh               ← 전부, 줄 3개로 나눠 동시에(서버 쓰는 테스트는 한 줄에서 차례로)
#           bash tests/run.sh tregen tbt    ← 고른 것만(+ tcode·tload 는 늘 같이)
#           J=1 bash tests/run.sh           ← 예전처럼 하나씩(흔들리는 테스트 찾을 때)
# 준비(처음 한 번): npm i -g playwright && npx playwright install --with-deps chromium
# 판정: 예외로 죽지 않고(종료 코드 0), _guard.js 가 모은 페이지 오류가 0개면 통과. 실패한 건 마지막에 혼자 한 번 더 돌려 본다(동시에 돌아서 흔들린 것 거르기).
#   통과/실패만 보지 말고, 바꾼 기능의 테스트는 출력 줄을 직접 읽어 기대한 값인지 확인한다(자기 검증).
# v1.1 → v2.0: 동시에 3줄 · 서버 쓰는 테스트(8787·8766)는 한 줄 · 실패는 혼자 다시 · 고른 것만 돌릴 때도 tcode·tload 같이.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/tests"
export NODE_PATH="${NODE_PATH:-}:$(npm root -g 2>/dev/null):/opt/npm-tools/node_modules"
J="${J:-3}"

# 서버 3개: 저장소 루트(8765) · 업데이트 테스트용 복사본(8766) · 계정 서버 대역(8787)
{ pkill -f "http.server 8765"; pkill -f "http.server 8766"; pkill -f "serve.mjs"; } >/dev/null 2>&1
(cd "$ROOT" && python3 -m http.server 8765 >/dev/null 2>&1 &)
rm -rf /tmp/updt && mkdir -p /tmp/updt && cp -r "$ROOT/sehee" /tmp/updt/sehee
(cd /tmp/updt && python3 -m http.server 8766 >/dev/null 2>&1 &)
(node "$ROOT/tests/syncsrv/serve.mjs" >/dev/null 2>&1 &)
sleep 1.5

ALL="$(ls t*.js | sed 's/\.js$//' | grep -v '^tcode$\|^tload$' | tr '\n' ' ')"
if [ $# -gt 0 ]; then LIST="tcode tload $*"; else LIST="tcode tload $ALL"; fi
SERIAL_RE='8787|8766|syncsrv'   # 같은 계정 서버·업데이트 복사본을 쓰는 테스트는 서로 밀어낼 수 있어 한 줄에서 차례로

one(){   # 테스트 하나 → 결과 파일에 '통과 이름' 또는 '실패 이름' + 마지막 줄들
  local t="$1" out code
  out="$(timeout 150 node --require ./_guard.js "$t.js" 2>&1)"; code=$?
  if [ $code -eq 0 ] && echo "$out" | grep -q "^GUARD errors \[\]$"; then echo "통과  $t"
  else echo "실패  $t"; echo "$out" | grep -vE "^\s+at " | tail -6 | sed 's/^/      /'; fi
  [ "$t" = "tupd2" ] && rm -rf /tmp/updt/sehee && cp -r "$ROOT/sehee" /tmp/updt/sehee
  return 0
}
RES="$(mktemp -d)"
serial=""; par=()
for t in $LIST; do
  if [ "$t" = "tcode" ] || [ "$t" = "tload" ] || grep -qE "$SERIAL_RE" "$t.js"; then serial="$serial $t"; else par+=("$t"); fi
done
lanes=$(( J > 1 ? J - 1 : 1 ))
start=$(date +%s)
if [ "$J" -le 1 ]; then for t in $LIST; do one "$t"; done > "$RES/lane0"
else
  ( for t in $serial; do one "$t"; done > "$RES/lane0" ) &
  for ((i=0; i<lanes; i++)); do ( for ((k=i; k<${#par[@]}; k+=lanes)); do one "${par[$k]}"; done > "$RES/lane$((i+1))" ) & done
  wait
fi
cat "$RES"/lane* | sort -s -k1,1r
failed="$(cat "$RES"/lane* | grep '^실패' | awk '{print $2}' | tr '\n' ' ')"
if [ -n "$failed" ]; then
  echo "── 실패한 것만 혼자 다시:"
  refail=""
  for t in $failed; do r="$(one "$t")"; echo "$r" | head -1; echo "$r" | grep -q '^실패' && { refail="$refail $t"; echo "$r" | tail -n +2; }; done
  failed="$refail"
fi
{ pkill -f "http.server 8765"; pkill -f "http.server 8766"; pkill -f "serve.mjs"; } >/dev/null 2>&1
n=$(echo $LIST | wc -w); f=$(echo $failed | wc -w)
echo "────────"; echo "통과 $((n - f)) · 실패 $f${failed:+ ·$failed} · $(( $(date +%s) - start ))초"
rm -rf "$RES"
[ $f -eq 0 ]
