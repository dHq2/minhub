#!/bin/bash
# v6.7 회귀 시험: 각 시험의 errors 줄만 모음
for t in mob1 mob4 mob5 mob7 mob7b mob10 mob12 pg572 pg57 pg586 pg589c det56 bar554 slot551 reb2 kar2 keep598 kar598b pick599 inj5100 ai600 tac610 tac620 mig610 chg620 chg631 chg632 chg633 int630 wdg634 mvp640 mvp641 mvp650 mvp650b fatui660 arc661 arc662; do
  out=$(timeout 300 node $t.js 2>&1); e=$(echo "$out" | grep -E "^errors" | tail -1); echo "$t: ${e:-NO_ERRORS_LINE} $(echo "$out" | grep -ciE 'FAIL|MISMATCH|TypeError|ReferenceError')"
done
