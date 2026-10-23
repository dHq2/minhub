#!/bin/bash
# 전체 회귀 — allreg.sh v3.8 (v3.8: eng8780d (물레 · 콜라이더 · 테헤라) 더함 · v3.7: eng8780c (어퐁 · 카리우스) 더함 · v3.6: eng8780b (포렌) 더함 · v3.5: eng8780 (굿윌 · 감전 한 틀) 더함 · v3.4: eng8770 더함 · v3.3: eng8760 더함 · v3.2: eng8750 더함 · v3.1: eng8740 더함 · v3.0: eng8730 더함 · v2.9: eng7251 더함 · v2.8: eng7250 더함 · v2.7: eng7244 더함 · v2.6: eng7242 · eng7243 더함 · v2.5: eng7241 더함 · v2.4: eng7240 더함 · v2.3: eng7233 더함 · v2.2: eng7232 더함 · v2.1: eng7231 더함 · v2.0: eng7230 더함 · v1.9: eng7223 더함 · v1.8: eng7222 더함 · v1.7: eng722 더함 · v1.6: eng721 더함 · v1.5: eng7201 더함 · v1.4: eng720 더함 · v1.3: eng7192 더함 · v1.2: eng7191 더함 · v1.1: eng719 더함 · 엔진 시험 · reg670 · UI 묶음 · 연기 판 48)
cd "$(dirname "$0")"
for t in lie711 lie712 net713 chi714 step7141 ev715 supp716 roe7161 eng717 ter718 eng719 eng7191 eng7192 eng720 eng7201 eng721 eng722 eng7222 eng7223 eng7230 eng7231 eng7232 eng7233 eng7240 eng7241 eng7242 eng7243 eng7244 eng7250 eng7251 eng8730 eng8740 eng8750 eng8760 eng8770 eng8780 eng8780b eng8780c eng8780d; do echo "$t: $(timeout 300 node $t.js 2>&1 | grep -E 'ALL|FAIL|Error' | tail -1)"; done
bash reg670.sh 2>&1 | grep -v ": errors \[\] 0$" ; echo "reg670 done"
bash runui.sh
