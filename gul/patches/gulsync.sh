#!/bin/bash
# GitHub 보관 맞춤 — gulsync.sh v1.0 (작업 폴더 → /home/user/minhub/gul : 엔진 · 화면 · 빌드 · 시험 · patches · docs · 그림 · 완성본. 판마다 실행)
S=/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad; G=/home/user/minhub/gul
cd $S || exit 1
T=$( (grep -oE "for t in [^;]*" allreg.sh runui.sh reg670.sh | sed 's/.*for t in //' | tr ' ' '\n'; echo mobaudit scen_lib790 t4 build10 wrap idaudit2 verscheck) | sort -u | grep -v '^$')
mkdir -p $G/build $G/patches $G/docs
cp rt3_head.js rt3_mid.js rt3_tail.js page10.tpl.html roster4.json oldrules.json $G/
for f in bld.sh allreg.sh runui.sh reg670.sh; do sed 's#^cd /tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad$#cd "$(dirname "$0")"#' $f > $G/$f; done
for t in $T; do [ -f $t.js ] && cp $t.js $G/; done
cp *.py $G/patches/ && mv -f $G/patches/build10.py $G/
cp *.md odile_spec_orig.txt $G/docs/ 2>/dev/null
cp -r build/art $G/build/ && cp build/faces.webp build/icons.webp build/faces_idx.json build/wrapped.html $G/build/
echo "gulsync OK $(du -sh $G | cut -f1)"
