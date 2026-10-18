#!/bin/bash
cd "$(dirname "$0")"
cat rt3_head.js rt3_mid.js rt3_tail.js > rt3.js && python3 build10.py && node wrap.js && node --check page10_check.js && echo SYNTAX_OK; node idaudit2.js 2>&1 | tail -2; node verscheck.js 2>&1 | tail -2
