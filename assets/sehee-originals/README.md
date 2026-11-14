# 세희 그림 원본 v1.2

보스가 준 세희 앱용 그림 원본(2026-11-12). 앱에는 이걸 줄여서 `sehee/art/`에 webp로 넣어 쓴다.
원본은 여기서 건드리지 않는다. 고칠 때는 이 파일을 복사해서 쓴다.

| 파일 | 크기 | 무엇 | 앱에서 쓰는 곳 |
| --- | --- | --- | --- |
| bg-office-teal.png | 1024×1536 | 청록 사무실 배경 (창문·블라인드·책장·서류함) | `art/bg-office.webp` 사무실 화면 배경 |
| prop-desk-front.png | 1024×1536 (아래쪽에 책상) | 나무 책상 앞면 | `art/desk.webp` 세희 앞 책상 |
| prop-papers-stack.png | 1536×1024 | 서류 더미 | `art/papers.webp` 책상 왼쪽 |
| prop-monitor-back.png | 1536×1024 | 모니터 뒷면 | `art/monitor.webp` 책상 오른쪽 |
| sehee-stand-lean-neutral.png | 1024×1536 | 세희, 책상 짚고 선 무표정 | `art/s-lean.webp` 기본 자세 |
| sehee-sit-hip-serious.png | 1024×1536 | 세희, 허리에 손 · 진지 | `art/s-hip.webp` 표정 태그 [의심] |
| sehee-sit-think-chin.png | 1024×1536 | 세희, 턱 괴고 곁눈 | `art/s-think.webp` [생각] · 대답 기다리는 중 |
| sehee-sit-smug-smile.png | 1024×1536 | 세희, 손 모으고 살짝 웃음 | `art/s-smug.webp` [미소] |
| sehee-sit-talk-gesture.png | 1024×1536 | 세희, 손바닥 내밀며 말하는 중 | `art/s-talk.webp` [당황] · 글자 들어오는 중 |
| sehee-sit-surprised.png | 1024×1536 | 세희, 놀람 | `art/s-surprised.webp` [놀람] |
| sehee-sit-front-neutral.png | 1024×1536 | 세희, 정면 앉은 무표정 | `art/s-front.webp` [삐침] |
| loading-office-dots.png | 941×1672 | 형광등과 점 세 개 — 책상에 앉은 세희, 책상 앞면에 점 세 개 | `art/loading.webp` 로딩 화면 (임시) |
| sehee-stand-hip-present.png | 1024×1536 | 세희, 선 채 허리에 손 · 손바닥 내밀어 안내 · 무표정 | `art/vn-present.webp` 장면 표정 [안내] |
| sehee-stand-memo-paper.png | 1024×1536 | 세희, 서류 보며 펜으로 적음 · 찌푸림 | `art/vn-memo.webp` 장면 표정 [검토] |
| sehee-stand-point-scold.png | 1024×1536 | 세희, 검지 들고 따끔하게 · 서류철 | `art/vn-scold.webp` 장면 표정 [지적] |
| sehee-stand-pen-think-up.png | 1024×1536 | 세희, 펜 턱에 대고 위쪽 곁눈 | `art/vn-think.webp` 장면 표정 [생각] |
| sehee-stand-point-explain.png | 1024×1536 | 세희, 검지 들고 설명 · 서류철 · 정면 | `art/vn-explain.webp` 장면 표정 [설명] |
| sehee-stand-pen-think-side.png | 1024×1536 | 세희, 펜 턱에 대고 옆 곁눈 · 팔짱 | `art/vn-ponder.webp` 장면 표정 [고민] |
| sehee-stand-palm-calm.png | 1024×1536 | 세희, 손바닥 내밀어 권함 · 반쯤 감은 눈 | `art/vn-offer.webp` 장면 표정 [권유] |
| sehee-stand-smile-back.png | 1024×1536 | 세희, 뒷짐 지고 살짝 웃음 | `art/vn-smile.webp` 장면 표정 [미소] |

장면(게임 대화, js/scene.js) 그림은 선 세희 전신 — 투명 바탕 그대로 720×1080 webp(품질 84)로 줄였다. 표정 이름 ↔ 파일은 scene.js 의 VN_FACE.
앱 그림 만들 때: 세희 그림은 위에서 980px까지만 잘라(상반신) 560×536으로 줄이고, 배경은 720×1080, 소품은 가장자리 투명 부분을 잘라낸 뒤 줄였다.
로딩 그림은 크기 그대로 두고, 책상 앞면의 점 세 개(중심 x 439·470·501, y 1574)만 지운 뒤 webp로 줄였다. 앱이 그 자리에 깜빡이는 점을 다시 그린다.

## 변경 기록
| 버전 | 날짜 | 내용 |
| --- | --- | --- |
| v1 | 2026-11-12 | 첫 원본 11장 보관, 앱 v0.6.4 에 적용 |
| v1.1 | 2026-11-12 | 로딩 화면 그림(형광등과 점 세 개) 추가, 앱 v0.7.0 에 적용 |
| v1.2 | 2026-11-15 | 장면용 선 세희 표정 8장(안내·검토·지적·생각·설명·고민·권유·미소) 보관, 앱 v1.5.30 장면에 적용 |
