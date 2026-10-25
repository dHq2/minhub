#!/bin/bash
# 전체 회귀 (나란히) — par982.sh v1.0 (v1.0: par981 v1.0 에 eng9820 (역장 · 화살비) 더함)
# 쓰는 법: bash par947.sh <스냅숏 폴더 이름> [나란히 수]
SP="$(cd "$(dirname "$0")" && pwd)"
DST=$SP/${1:-rrpar}; P=${2:-3}
rm -rf "$DST"; mkdir -p "$DST/out"; cp -r "$SP/build" "$DST/"; cp "$SP"/*.js "$DST/" 2>/dev/null; cp "$SP"/*.json "$DST/" 2>/dev/null
cd "$DST"
ENG="lie711 lie712 net713 chi714 step7141 ev715 supp716 roe7161 eng717 ter718 eng719 eng7191 eng7192 eng720 eng7201 eng721 eng722 eng7222 eng7223 eng7230 eng7231 eng7232 eng7233 eng7240 eng7241 eng7242 eng7243 eng7244 eng7250 eng7251 eng8730 eng8740 eng8750 eng8760 eng8770 eng8780 eng8780b eng8780c eng8780d eng8790 eng8800 eng8810 eng8820 eng8830 eng8840 eng8850 eng8860 eng9010 eng9020 eng9030 eng9040 eng9050 eng9060 eng9070 eng9080 eng9090 eng9100 eng9700 eng9710 eng9720 eng9730 eng9810 eng9820"
REG="mob1 mob4 mob5 mob7 mob7b mob10 mob12 pg572 pg57 pg586 pg589c det56 bar554 slot551 reb2 kar2 keep598 kar598b pick599 inj5100 ai600 tac610 tac620 mig610 chg620 chg631 chg632 chg633 int630 wdg634 mvp640 mvp641 mvp650 mvp650b fatui660 arc661 arc662"
UI="ui711 ui712 ui713 ui714 ui715 ui7151 ui716 ui7161 ui7162 ui7163 ui7171 ui718 ui719 ui7191 ui7192 ui720 ui7201 ui721 ui7211 ui7212 ui7213 ui722 ui7221 ui7222 ui7223 ui7224 ui7230 ui7231 ui7233 ui7240 ui7241 ui7242 ui7243 ui7244 ui7245 ui7250 ui7251 ui7252 ui7253 ui7254 ui7260 ui7261 ui7262 ui7270 ui7270c ui7280 ui7290 ui8000 ui8100 ui8200 ui8210 ui8300 ui8400 ui8410 ui8500 ui8510 ui8700 ui8710 ui8711 ui8720 ui8730 ui8730b ui8730c ui8730d ui8730e ui8740 ui8760 ui8770 ui8780 ui8780b ui8780c ui8780d ui7100 ui795 ui794 ui790 clicktest2 mobaudit ui8790 ui8800 ui8810 ui8820 ui8830 ui8840 ui8870 ui8880 ui8890 ui8920 ui8930 ui9010 ui9020 ui9030 ui9040 ui9050 ui9060 ui9070 ui9071 ui9080 ui9090 ui9100 ui9110 ui9120 ui9130 ui9150 ui9170 ui9190"
case "$ONLY" in eng) REG=""; UI="";; reg) ENG=""; UI="";; ui) ENG=""; REG="";; esac
echo $ENG $REG $UI | tr ' ' '\n' | xargs -P "$P" -I{} sh -c 'timeout 600 node {}.js > out/{}.txt 2>&1; echo "exit $?" >> out/{}.txt'
echo "== 엔진"; for t in $ENG; do echo "$t: $(grep -E 'ALL|FAIL|Error' out/$t.txt | tail -1)"; done
echo "== reg670"; for t in $REG; do e=$(grep -E "^errors" out/$t.txt | tail -1); echo "$t: ${e:-NO_ERRORS_LINE} $(grep -ciE 'FAIL|MISMATCH|TypeError|ReferenceError' out/$t.txt)"; done | grep -v ": errors \[\] 0$"
echo "== UI"; for t in $UI; do echo "$t: $(grep -E 'ALL|FAIL|Error|찾은 것' out/$t.txt | tail -1)"; done
echo PAR_DONE
