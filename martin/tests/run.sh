#!/usr/bin/env bash
# 마틴 점검 실행 v1.1 (2026-11-16, A — v1.1: tests/ 의 *.js 전부, 이름을 주면 그것만). 준비(처음 한 번, 없으면): npm i -g playwright && npx playwright install --with-deps chromium
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
export NODE_PATH="${NODE_PATH:-}:$(npm root -g 2>/dev/null):/opt/npm-tools/node_modules"
for f in "$ROOT"/martin/js/*.js; do node --check "$f" || { echo "문법 오류: $f"; exit 1; }; done
pkill -f "http.server 8790" >/dev/null 2>&1; (cd "$ROOT" && python3 -m http.server 8790 >/dev/null 2>&1 &); sleep 1
code=0; for t in ${@:-$(cd "$ROOT/martin/tests" && ls *.js | sed "s/\.js$//")}; do echo "── $t"; node "$ROOT/martin/tests/$t.js" || code=1; done
pkill -f "http.server 8790" >/dev/null 2>&1; exit $code
