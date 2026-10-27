# battle (흑백 전술 전투판) v3.0

굴 원본 엔진 위에 만든 모바일/PC 겸용 전술 게임.

## 빌드와 실행
    python3 tools/build.py          # dist/battle.html 생성 (단일 파일, 브라우저에서 바로 열기)
    python3 tools/build.py --test   # 빌드 후 테스트까지

## 테스트
    node tests/core.test.js         # 엔진 어댑터, 결정성, 명령, 10v10/20v20
    node tests/game.test.js         # 캠페인, 루팅, 저장
    node tests/ui.test.js           # Playwright 모바일+PC 전체 흐름 (스크린샷 build/shots/)

## 원본 엔진 동기화
    tools/sync_upstream.sh          # gul/rt3_*.js 를 가져오고 vendor/gul/UPSTREAM.md 해시 갱신
vendor/gul 은 직접 고치지 않는다. 바꿔야 하면 tools/patches/ 에 패치를 둔다.

## 문서
- docs/design_v3.0.md 설계와 변경 기록
- docs/findings_v1.0.md 원본 점검 결과
- docs/archive/ 옛 설계
