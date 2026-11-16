#!/usr/bin/env bash
# 마틴 점검 실행 v1.0 (2026-11-16, A). 준비(처음 한 번, 없으면): npm i -g playwright && npx playwright install --with-deps chromium
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
export NODE_PATH="${NODE_PATH:-}:$(npm root -g 2>/dev/null):/opt/npm-tools/node_modules"
for f in "$ROOT"/martin/js/*.js; do node --check "$f" || { echo "문법 오류: $f"; exit 1; }; done
pkill -f "http.server 8790" >/dev/null 2>&1; (cd "$ROOT" && python3 -m http.server 8790 >/dev/null 2>&1 &); sleep 1
node "$ROOT/martin/tests/smoke.js"; code=$?
pkill -f "http.server 8790" >/dev/null 2>&1; exit $code
