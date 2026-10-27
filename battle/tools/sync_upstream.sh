#!/bin/bash
# 원본 굴 엔진을 vendor/gul 로 가져온다 (수정 없이 복사). 사용: bash battle/tools/sync_upstream.sh [브랜치]
set -e
cd "$(dirname "$0")/../.."
BR="${1:-claude/adoring-darwin-gkixgo}"
git fetch origin "$BR"
REF="origin/$BR"
for f in rt3_head.js rt3_mid.js rt3_tail.js; do
  git show "$REF:gul/$f" > "battle/vendor/gul/$f"
done
HASH=$(git rev-parse "$REF")
sed -i "s/^- 가져온 시점: 커밋 \`[0-9a-f]*\`.*/- 가져온 시점: 커밋 \`$HASH\` ($(date +%F) 동기화)/" battle/vendor/gul/UPSTREAM.md
echo "동기화 완료: $HASH"
