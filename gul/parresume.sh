#!/bin/bash
# 끊긴 회귀 이어 돌리기 — parresume.sh v1.0 (v1.0: par877.sh 의 목록 가운데 out/<시험>.txt 에 'exit' 줄이 없는 것만 다시 돎 · 끝나면 par877.sh 와 같은 모아 보기)
SP="$(cd "$(dirname "$0")" && pwd)"; DST=$SP/${1:-rrpar}; P=${2:-3}
eval "$(grep -E '^(ENG|REG|UI)=' $SP/par877.sh)"
cd "$DST"
TODO=""; for t in $ENG $REG $UI; do grep -q '^exit' out/$t.txt 2>/dev/null || TODO="$TODO $t"; done
echo "남은 것:$TODO" | head -c 2000; echo
echo $TODO | tr ' ' '\n' | grep -v '^$' | xargs -P "$P" -I{} sh -c 'timeout 600 node {}.js > out/{}.txt 2>&1; echo "exit $?" >> out/{}.txt'
echo "== 엔진"; for t in $ENG; do echo "$t: $(grep -E 'ALL|FAIL|Error' out/$t.txt | tail -1)"; done
echo "== reg670"; for t in $REG; do e=$(grep -E "^errors" out/$t.txt | tail -1); echo "$t: ${e:-NO_ERRORS_LINE} $(grep -ciE 'FAIL|MISMATCH|TypeError|ReferenceError' out/$t.txt)"; done | grep -v ": errors \[\] 0$"
echo "== UI"; for t in $UI; do echo "$t: $(grep -E 'ALL|FAIL|Error|찾은 것' out/$t.txt | tail -1)"; done
echo PAR_DONE
