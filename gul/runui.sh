#!/bin/bash
# UI 묶음 시험 — runui.sh v3.8 (v3.8: ui7260 더함 · v3.7: ui7254 더함 · v3.6: ui7253 더함 · v3.5: ui7252 더함 · v3.4: ui7251 더함 · v3.3: ui7250 더함 · v3.2: ui7245 더함 · v3.1: ui7244 더함 · v3.0: ui7243 더함 · v2.9: ui7242 더함 · v2.8: ui7241 더함 · v2.7: ui7240 더함 · v2.6: ui7233 더함 · v2.5: ui7231 더함 · v2.4: ui7230 더함 · v2.3: ui7223 · ui7224 더함 · v2.2: ui7222 더함 · v2.1: ui7221 더함 · v2.0: ui722 더함 · v1.9: ui7213 더함 · v1.8: ui7211 · ui7212 더함 · v1.7: ui721 더함 · v1.6: ui7201 더함 · v1.5: ui720 더함 · v1.4: ui7192 더함 · v1.3: ui7191 더함 · v1.2: ui719 더함 · v1.1: ui718 더함 · 요즘 UI 시험 · 모바일 점검 · 카드 클릭을 차례로 · 결과 끝줄만)
cd "$(dirname "$0")"
for t in ui711 ui712 ui713 ui714 ui715 ui7151 ui716 ui7161 ui7162 ui7163 ui7171 ui718 ui719 ui7191 ui7192 ui720 ui7201 ui721 ui7211 ui7212 ui7213 ui722 ui7221 ui7222 ui7223 ui7224 ui7230 ui7231 ui7233 ui7240 ui7241 ui7242 ui7243 ui7244 ui7245 ui7250 ui7251 ui7252 ui7253 ui7254 ui7260 ui7100 ui795 ui794 ui790 clicktest2; do
  timeout 170 node $t.js > out_$t.txt 2>&1; echo "$t: $(grep -E 'ALL|FAIL|Error' out_$t.txt | tail -1)"
done
timeout 400 node mobaudit.js > out_mobaudit.txt 2>&1; echo "mobaudit: $(grep '찾은 것' out_mobaudit.txt)"; grep '^- ' out_mobaudit.txt | head -5
echo RUNUI_DONE
