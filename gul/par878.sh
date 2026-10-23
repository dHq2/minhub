#!/bin/bash
# 전체 회귀 (나란히) — par878.sh v1.0 (v1.0: par877.sh v1.0 에 eng8780 (굿윌 · 감전 한 틀) · ui8780 (굿윌 · 감전 ⚡ · 뽑기 희귀도) 더함 · 그 앞: par877.sh v1.0 — par876.sh v1.0 에 eng8770 (유물 고리 · 선봉장 대방패) · ui8770 (유물 34 · 지닌 이 · 노먼 전직 · 야전병원) 더함 · 그 앞: par876.sh v1.0 — par875.sh v1.0 에 eng8760 (인벤토리 v2 엔진 — 장비 명령 · 무기 칸 · 전리품 · 갑피 위) · ui8760 (장비 · 가방 탭 · 이름표 · 전리품 비교 · 나가기 전 전리품) 더함 · 그 앞: par875.sh v1.0 — par874.sh v1.0 에 eng8750 (대형 · 진형 · 조합 버프 · 좁은 길 · 좁은 골목) · ui8750 (대형 띠 · 모여 · 깃발 · 편성 창) 더함 · 그 앞: par874.sh v1.0 — par873.sh v1.2 에 eng8740 (갑피 등급 · 붉은암석 · 망각 · 돌진 길) · ui8740 더함 · 그 앞: v1.2: ui8730e (휴대폰 판 아래쪽 탭 고르기) 더함 · 스크립트가 있는 폴더를 기준으로 (보관 폴더 gul/ 에서도 그대로 돎) · v1.1: eng8730 (넉백 무게 · 막아도 즉사 · 받쳐 줌 · 버팀 · 미리 비켜서기 · 기습 · 창 · 이어진 휘청 · 사수 다른 표적) · ui8730d 더함 · v1.0: allreg.sh v2.9 의 엔진 시험 · reg670 · runui (v5.5 목록 + ui8730 · ui8730b · ui8730c) · mobaudit 를 빌드 사본 (스냅숏 폴더) 에서 셋씩 나란히 · 결과는 폴더/out 에 · 끝에 한 줄씩 모아 봄)
# 쓰는 법: bash par878.sh <스냅숏 폴더 이름> [나란히 수]
SP="$(cd "$(dirname "$0")" && pwd)"
DST=$SP/${1:-rrpar}; P=${2:-3}
rm -rf "$DST"; mkdir -p "$DST/out"; cp -r "$SP/build" "$DST/"; cp "$SP"/*.js "$DST/" 2>/dev/null; cp "$SP"/*.json "$DST/" 2>/dev/null
cd "$DST"
ENG="lie711 lie712 net713 chi714 step7141 ev715 supp716 roe7161 eng717 ter718 eng719 eng7191 eng7192 eng720 eng7201 eng721 eng722 eng7222 eng7223 eng7230 eng7231 eng7232 eng7233 eng7240 eng7241 eng7242 eng7243 eng7244 eng7250 eng7251 eng8730 eng8740 eng8750 eng8760 eng8770 eng8780"
REG="mob1 mob4 mob5 mob7 mob7b mob10 mob12 pg572 pg57 pg586 pg589c det56 bar554 slot551 reb2 kar2 keep598 kar598b pick599 inj5100 ai600 tac610 tac620 mig610 chg620 chg631 chg632 chg633 int630 wdg634 mvp640 mvp641 mvp650 mvp650b fatui660 arc661 arc662"
UI="ui711 ui712 ui713 ui714 ui715 ui7151 ui716 ui7161 ui7162 ui7163 ui7171 ui718 ui719 ui7191 ui7192 ui720 ui7201 ui721 ui7211 ui7212 ui7213 ui722 ui7221 ui7222 ui7223 ui7224 ui7230 ui7231 ui7233 ui7240 ui7241 ui7242 ui7243 ui7244 ui7245 ui7250 ui7251 ui7252 ui7253 ui7254 ui7260 ui7261 ui7262 ui7270 ui7270c ui7280 ui7290 ui8000 ui8100 ui8200 ui8210 ui8300 ui8400 ui8410 ui8500 ui8510 ui8700 ui8710 ui8711 ui8720 ui8730 ui8730b ui8730c ui8730d ui8730e ui8740 ui8750 ui8760 ui8770 ui8780 ui7100 ui795 ui794 ui790 clicktest2 mobaudit"
echo $ENG $REG $UI | tr ' ' '\n' | xargs -P "$P" -I{} sh -c 'timeout 600 node {}.js > out/{}.txt 2>&1; echo "exit $?" >> out/{}.txt'
echo "== 엔진"; for t in $ENG; do echo "$t: $(grep -E 'ALL|FAIL|Error' out/$t.txt | tail -1)"; done
echo "== reg670"; for t in $REG; do e=$(grep -E "^errors" out/$t.txt | tail -1); echo "$t: ${e:-NO_ERRORS_LINE} $(grep -ciE 'FAIL|MISMATCH|TypeError|ReferenceError' out/$t.txt)"; done | grep -v ": errors \[\] 0$"
echo "== UI"; for t in $UI; do echo "$t: $(grep -E 'ALL|FAIL|Error|찾은 것' out/$t.txt | tail -1)"; done
echo PAR_DONE
