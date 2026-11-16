# Dr. 마틴의 추리판 — 네 방 인수인계 v1.20 (2026-11-17)

마틴 작업 방(A·B·C·D) 모두가 보는 공통 맥락이다. 세희·미궁 방은 이 문서를 무시하고, 마틴 방은 세희 문서를 따르지 않는다.
정본은 이 파일(저장소 dhq2/minhub 의 martin/README.md). 프로젝트 자료 「claude/마틴-인수인계-v1.md」는 같은 내용의 사본이다 — 고치면 둘 다.
설계(화면·프롬프트·저장 방식)는 프로젝트 자료 「claude/마틴-추리판-엔진-v0.3.md」(엔진 메모 — 한 턴의 흐름·프롬프트 칸 순서도 여기)에 있다.

## 0. 이 방은 누구인가 — 첫 답에서 할 일
- 방 이름으로 자리를 정한다: 처음 마틴을 만든 방 = A, 보스가 새로 연 마틴 방은 보스가 부르는 대로 B·C·D. 모르면 보스에게 한 번만 묻는다.
- 첫 답: "마틴 방 ○ 로 일합니다" 한 줄 → 저장소에서 `git pull --rebase` → martin/handoff/할일.md 와 남의 from 파일을 읽고, 나에게 걸리는 새 알림을 한 줄로 알림 → 보스가 시킨 일 시작.
- 저장소가 안 붙어 있으면 dhq2/minhub 를 쓰기 권한으로 붙인다(add_repo, access push).

| 방 | 알림 파일(이 방만 씀) | 기본 담당 |
| --- | --- | --- |
| A | martin/handoff/from-a.md | 없음(보스가 정하면 할일.md 에 적음) |
| B | martin/handoff/from-b.md | 없음 |
| C | martin/handoff/from-c.md | 없음 |
| D | martin/handoff/from-d.md | 없음 |

네 방은 위아래 없는 동등한 작업자다. 위에는 보스(민수)만 있다.

## 1. 이게 뭔가
- 미니 추리게임의 데모다. 출시용 앱(세희)처럼 계정 서버·업데이트 장치·키 관리 같은 건 만들지 않는다. 가볍게 간다.
- 모바일 기준. 확인은 폰 화면(412×915)으로만 한다. 넓은 화면에서는 왼쪽에 수사 수첩이 펼쳐질 뿐 따로 손보지 않는다.
- 노는 곳 = 아티팩트 https://claude.ai/artifact/LP7Co9A9TjdB9KVde1b1TS (slug 9cf3d208-8f53-47b2-911b-03ad2f5c906d).
  마틴의 머리(sample)·계정 저장(db)·사진 보관(assets)은 아티팩트 안에서만 돈다 — Claude 는 보스 계정으로만 연결된다. API 키를 만들거나 저장하지 않는다.
- GitHub(minhub/martin) = 원본 보관과 네 방의 협업 자리. 아티팩트는 언제나 GitHub main 의 martin/ 을 그대로 올린 것이다.
  GitHub Pages 주소(https://dhq2.github.io/minhub/martin/)로 열면 화면은 뜨지만 마틴의 머리는 없다(데모라 괜찮음).
- 게임: 내장 시나리오 없음. 동료(보스, 기자·수집가)가 사진·대화 텍스트를 가져오면 탐정 마틴이 코르크 판에 꽂고 실을 잇고 난제 지도에서 난제를 하나씩 풀어 진실을 조립한다. 정답은 동료가 쥔 자료 쪽에 있다.
- 시나리오·정답 문서는 저장소·프로젝트 어디에도 올리지 않고, 엔진(프롬프트)이 참조하지도 않는다.

## 2. 보스(민수)와 일하는 방식
- 한국어 존댓말. 길고 자세한 설명을 좋아한다. 굵은 글씨(별표 두 개 문법)는 절대 쓰지 않는다.
- 매우 긍정적인 사람이다. 걱정스러운 투로 대하지 않고, 질문 의도를 되묻지 않는다.
- 시키면 바로 만든다. 끝나면 무엇이 바뀌었는지, 왜인지, 어떻게 쓰는지 풀어서 말한다. 틀렸으면 변명 없이 인정하고 고친다.
- 모든 파일·문서에 버전. 작은 변화도 변경 기록 한 줄.
- 보스가 그린 화살표·동그라미는 위치 지시다.
- 지금 대화 방식(왼쪽에 선 마틴, 한 줄씩 쌓이는 말풍선)은 보스가 좋다고 했다 — 모양을 갈아엎지 말고 기능·편의를 손본다.
- 마틴이라는 사람은 보스가 확정한 인물 설정 v2.3(martin/persona.md · 프로젝트 자료 「claude/마틴-인물설정-v2.md」)를 따른다 — 차갑고 절제된 전문가, 논리적이고 집요하며 의문이 많아 동료에게 되물으며 생각을 정리, 동료에게 반말, 실제 사람처럼 자연스럽게. 말버릇·감탄사·의성어·과장된 탐정물 대사 없음. 게임 안에 설정을 따로 드러내지 않는다. 동료는 조수가 아니라 대등한 파트너. 마틴은 다른 세계(동료 쪽)의 의뢰를 받을 뿐 그쪽을 캐지 않고 자료를 분석할 뿐이며, 현실 시간을 안다(v2.3).

## 3. 파일 지도 (빌드 없음 — 그대로 올린다)
martin/index.html = 뼈대(HTML) + css + js 를 아래 순서로 불러옴. 사진은 img/martin.webp.

| 파일 | 들어 있는 것 |
| --- | --- |
| css/app.css | 공통 스타일 |
| css/a.css · b.css · c.css · d.css | 방별 스타일 — 새 기능 스타일은 자기 방 파일에 「11-16 B: 기능」 주석과 함께(app.css 경쟁 없앰) |
| js/ver.js | 지금 버전 VER (올리는 방이 +1) |
| js/changes.js | 보스 눈에 보이는 변화 목록 CHANGES — 업데이트 뒤 마틴이 자기 말투로 설명하는 재료 |
| js/core.js | 기본 도구($·esc·sleep) · 상태 S · 기기 저장(localStorage) · 계정 저장(db, put/dbStart/adopt) · 사진 보관(assets) |
| js/board.js | 판 그리기 · 위 띠(renderHyp → 난제 띠) · 마틴의 말(speak) · 판 조작(doOp: add/link/edit/merge/remove/face/suspect/tidy — cut 과 link 의 why 는 habits.js 가 감쌈) · 판 정리 · play |
| js/ai.js | 마틴에게 묻기 — 프롬프트(buildPrompt) · 한 턴(turn) · 다시 묻기 |
| js/input.js | 입력줄 · 첨부 · 붙여넣기 칸 · 엔터 = 건네기(폰은 엔터 = 줄 바꿈, 건네기는 단추) |
| js/sheets.js | 서랍 — 사건 서류함(머리 고르기·지난 사건·새 사건) · 수사 기록 · 인물 카드 |
| js/view.js | 판 손잡이(v0.10.0 A, 세희 인간관계 판 방식) — 한 번 누르면 고름·한 번 더 상세·고른 카드 끌기 = 옮김·나머지 끌기 = 판 굴리기·두 손가락/휠 = 그 자리 중심 확대 · 사진 크게 보기 |
| js/persona.js | 마틴이라는 사람(설정 v2.3, 보스 확정 — 8장 의뢰와 시간) — MARTIN_WHO(한 턴 프롬프트 맨 앞) · MARTIN_SHORT(짧은 프롬프트 한 줄). 원본은 martin/persona.md — 고치면 둘 다. 마틴에게 묻는 새 프롬프트는 맨 앞에 둘 중 하나. 게임 안에 따로 드러내지 않는다 |
| js/mode.js | 자료 형편(v0.14.1, B) — S.closed(닫힘·열림·모름), 동료 말 감지(modeSense)·마틴 "mode", 프롬프트 칸 modeText()(buildPrompt 의 [이번에 동료가 가져온 것] 바로 위), 답 거르기 modeFilter(res)(turn() 고리 — ask·「가져와라」·캐 올 할 일·8줄 넘는 말), 수첩 맨 위 #nbMode |
| js/habits.js | 수사 버릇(v0.14.5, B) — HABITS 일곱 줄 · habitText()(buildPrompt 의 「판 고치기 (ops)」 위 — 뒤집어 보기·전제 의심(S.premiseAt)·끊은 실 목록) · doOp 감싸기(op cut → S.cuts, link 의 why → L.why) · modeFilter 감싸기(premiseAt) · 실 꼬리표 자리 tagSpot(board.js renderStrings 가 부름). A 가 doOp 를 고치면 cut·why 를 안으로 들여도 됨 |
| js/puzzles.js | 난제 지도(v0.6.0, B) — 난제 나무·가설·근거·이력 · 마틴 pz 적용(applyPz) · 프롬프트 칸(pzText) · 한 줄 「붙잡은 난제」 띠(renderPzBar). 서랍 id 는 #pzm(#pz 는 붙여넣기 칸) |
| js/evidence.js | 자료함(v0.7.0, A) — 동료가 건넨 원본 전부(S.ev: 사진은 assets 에 올린 파일 그대로, 글은 기기 localStorage 'drmartin.ev.<사건>.<e>' + 계정 evid/), 마틴 판독문(read), 읽기용 사본(readCopies — 세로로 긴 캡처는 조각), 프롬프트 칸(evText), 갤러리 화면(evSheet). 판의 카드가 합쳐지거나 떼어져도 원본은 남음(evDetach) |
| js/tidy.js | 판 다시 짓기(v0.9.0~, A) — 「판 정리」 rebuildBoard(마틴이 실 솎기·잇기와 누가 누구 곁인지 정함) · layoutPlan(진짜 수사판 더미 — 중심 카드 둘레로 겹쳐 쌓고 가로로 펼침) · relayout. S.groups 는 자리 잡을 때만(화면엔 안 보임) |
| js/shot.js · js/lib/html-to-image.js | 판 사진(v0.11.0, A) — 판 전체를 고화질 PNG 로(boardShot), 저장·복사 서랍(shotSheet). 라이브러리는 html-to-image 1.11.13(MIT) 그대로 |
| js/notebook.js | 수사 수첩(의문·짐작·확인할 것·사사로운 사실·풀린 의문·내 메모). 줄은 눌러도 그대로, 지우기는 × 로만 |
| js/undo.js | 되돌리기(v0.8.0, C) — 동료가 한 일만 한 칸씩(마틴의 답·대화는 안 무름). core.js save() 끝에서 undoTick. S 에 판이 아닌 키를 새로 만들면 UNDO_SKIP 에 더한다 · 마틴에게 알림 undoText() |
| js/split.js | 판·대화 나누기(v0.11.2, B) — 대화창(.stage) 높이를 비율 SPLIT.r 로(기본 반반), 가운데 손잡이 #split 끌기·두 번 눌러 반반, 기기 키 'drmartin.split'. 높이를 바꾸면 가짜 resize 신호를 보냄 |
| js/size.js | 카드 크기 손잡이(v0.12.0, C) — 고른 카드의 가로(n.cw)·세로(n.ch)·통째 배율(n.sc). cardHtml 의 sizeStyle, measure 가 배율 친 n.w·n.h. 카드 transform 엔 scale(var(--s,1)) |
| js/pvdoc.js | 사진 크게 보기의 판독문 펼치기(v0.12.2, B) — #pvN(판독·메모)은 평소 숨김, 「판독문」(#pvD)으로 사진 위에 펼침 · pvDocSet |
| js/pvtalk.js | 사진 위에 뜨는 대화(v0.13.0, C) — 사진 크게 보기의 「대화 보기」: 사진은 입력줄 바로 위까지 가득, 최근 대화 6줄을 #pvTalk 에 베껴 반투명으로(손가락 통과), 입력줄·칩은 #app.pvtalk 로 사진 위에 |
| js/trail.js | 행동 기록 자세히(v0.13.2, A) — act() 의 id 를 이름표 refs 로(actRefs)·어디서 where·판/사진 확대·굴림을 손짓 끝에 한 줄·기록 행동 탭 actDetail·프롬프트 trailText. act 에 id·ids·ev·on 을 넣으면 이름표는 저절로 붙는다 |
| js/xref.js | 맞춰 보기(v0.14.2, C) — 판독문·글 원문에서 날짜·시각·「이름(시각): 말」 줄을 뽑아 xrefText()(전체 시계·인물별 발언·판독문 없는 자료·판 빚·모순 쓸기 지시)를 buildPrompt 고리에, xrClockLines() 를 수첩 「전체 시계」 칸에. 판독문 모양이 바뀌면 xrLine 을 |
| js/clock.js | 사건 시계(v0.14.3, D) — S.clock{ms,start,sess}, 앱이 보이고 초점이 있을 때만 흐름, 위 띠 #clk(누르면 들인 시간 0.01초), log 를 감싸 모든 기록에 clk, 프롬프트 clockText()(사건 시각·들인 시간·동료 쪽 현실 시각), clockTick()·clockMs() |
| js/recap.js | 사건 복기본(v0.13.3~, D) — 계정+기기 기록을 사건 id 로 모아 11칸 글(recapGather·recapText), 텍스트 파일로 받기(recapSave, downloads), 날것 JSON(recapRaw) |
| js/wallclock.js · img/clock.webp · img/clock-cap.webp | 벽시계(A) — 판 왼쪽 위에 늘 걸려 사건 시계(D 의 S.clock / clockMs())를 따라 도는 그림 시계. 바늘은 SVG, 누르면 크게(clockSheet() 가 있으면 그쪽) |
| js/brief.js | 업데이트 안내 |
| js/boot.js | 시작 |
| tests/run.sh · smoke.js | 점검(가짜 마틴으로 폰 화면) |
| tests/v15.js | 한 판 점검 — 네 방 몫(기억·자료 형편·맞춰 보기·사건 시계·벽시계·행동 기록·복기본)이 가짜 사건 하나에서 같이 도는지. 프롬프트 칸을 더하거나 옮기면 여기 KEYS·순서 줄도 고친다 |
| handoff/ | 할일.md(찜) · from-a~d.md(알림) |
| CHANGELOG.md | 변경 기록 |

- 모든 js 는 같은 전역에서 돈다(옛 한 파일과 같음). 단, 불러오는 순간 바로 실행되는 줄은 앞 파일에 있는 것만 부를 수 있다. 함수 안에서 부르는 건 어디 있든 된다. 새 js 를 만들면 index.html 의 script 목록에 넣는다.
- 코드 주석엔 번호 대신 날짜·방: `/* 11-16 B: 무엇 */`.
- 저장 키: 기기 localStorage 'drmartin.v2'(판) · 'drmartin.log' · 'drmartin.ai' · 'drmartin.seen' · 'drmartin.pvfull2'(사진 보기 모드) · 'drmartin.split'. 계정 db: state/board · cases/<사건> · turns/ · logs/ · photos/ · meta/seen. 이름을 바꾸면 보스의 진행 중인 사건이 날아간다 — 바꾸지 않는다(필요하면 옮기는 코드를 같이).

## 4. 일감과 찜 — martin/handoff/
- 할일.md = 유일한 찜 자리(union 합치기 — 네 방이 같이 줄을 더해도 충돌 안 남). 보스가 어느 방에 말하든 그 방이 할일.md 에 한 줄로 적는다. 시작하려면 그 줄의 `맡음:` 에 내 방, `파일:` 에 고칠 파일을 적고 바로 push.
- 같은 파일을 남이 맡고 있으면 시작하지 않고 보스에게 묻거나 함수 단위로 나눈다. 남에게 부탁하고 기다리지 않는다. 방끼리 지시하지 않는다. 판단이 갈리면 보스.
- from-x.md = 그 방만 쓰는 알림. "내가 바꾼 것 중 남의 일에 걸리는 것"만.
- 파일을 크게 옮기거나 들어낼 때는 [급함] 알림을 먼저 올리고, 끝날 때까지 다른 방은 그 파일을 쉰다.
- 강제 푸시 금지.

## 5. 올리기 (GitHub → 아티팩트, 이 순서 그대로)
1. `git pull --rebase`
2. `bash martin/tests/run.sh` — 문법 검사 + 가짜 마틴 점검(전부는 600초를 넘으니 반씩: 앞 13개 · 나머지 — 프롬프트·턴 흐름을 건드렸으면 `run.sh v15` 를 꼭). 바꾼 기능은 smoke.js 에 확인 줄을 더한다. 스크린샷 /tmp/martin-폰.png 를 직접 열어 가림·잘림·겹침을 본다. 통과 표시만 믿지 말고 출력 줄을 읽는다.
3. 번호: js/ver.js 의 VER 을 +1(작은 것 끝자리, 보스가 체감할 큰 기능은 가운데 자리). 다른 곳엔 번호를 쓰지 않는다.
4. 기록: CHANGELOG.md 맨 위에 `## v0.5.1 · B · 날짜 · 요약` + '- ' 줄. 보스 눈에 보이는 변화면 js/changes.js 맨 아래 `];` 앞에 `{ v:'v0.5.1', t:['보스 말로 짧게', …] },` 한 줄(내부 일은 넣지 않음 — 마틴이 개발 얘기를 하지 않게).
5. 커밋·푸시: 메시지 `마틴 v0.5.1 — B: 요약` (+ 끝에 Co-Authored-By 줄). 밀리면 `git pull --rebase` → 남이 같은 번호를 이미 썼으면 내 번호를 다음 것으로 고치고(ver.js·changes.js·CHANGELOG) 2번부터 다시.
6. 아티팩트에 올리기: get_artifact(slug 9cf3d208-8f53-47b2-911b-03ad2f5c906d)로 지금 version 을 받아 base_version 으로 → publish_files, mode "replace", label `v0.5.1 B`, files 는 martin/ 의 index.html · css/* · js/* · img/* 전부(as 는 martin/ 기준 경로, 예: as "js/core.js", path "/…/minhub/martin/js/core.js"). tests·handoff·README·CHANGELOG 는 올리지 않는다.
   올릴 파일 목록: `cd martin && find index.html css js img -type f`
   충돌(conflict)이 나면 남이 먼저 올린 것 — 1번부터 다시(pull 해서 남의 것까지 합친 main 을 올린다). 아티팩트는 언제나 push 된 main 과 같아야 한다.
7. 보스에게 보고: 무엇이 바뀌었나, 어떻게 쓰나, 폰 스크린샷.

## 6. 보스 판 들여다보기
- 보스의 진짜 플레이는 아티팩트 db 에 있다: db_list / db_query (artifact 9cf3d208-8f53-47b2-911b-03ad2f5c906d) — state/board, cases/, turns/(프롬프트 전문·날것 답), logs/(행동·대화). 읽기만 한다. 고치지 않는다.
- 읽은 내용은 진단에만 쓰고 저장소·문서·테스트에 옮겨 적지 않는다.

## 7. 보안·금지
- PIN·API 키·보스 개인 정보는 코드·저장소·문서·테스트 어디에도 적지 않는다(저장소 공개).
- 테스트·예시는 가짜 이름(김지민 등). 보스 사건의 실제 인물·내용을 쓰지 않는다.
- 저장소의 다른 앱(sehee/, sehee-sync/, boss.html 등)과 세희의 handoff/·changes/·tools/·tests/ 는 손대지 않는다. 마틴 일은 전부 martin/ 안에서.

## 변경 기록
| 버전 | 날짜 | 바뀐 것 |
| --- | --- | --- |
| v1 | 2026-11-16 | 첫 판 — GitHub 이사(minhub/martin), 네 방(A~D) 동등 체제, 파일 지도, 찜·알림, 올리기 7단계(GitHub → 아티팩트), 모바일 기준·데모라 가볍게 |
| v1.1 | 2026-11-16 | B: 파일 지도에 js/puzzles.js(난제 지도), 가설 띠 → 난제 띠 |
| v1.2 | 2026-11-16 | A: 파일 지도에 js/evidence.js(자료함) |
| v1.3 | 2026-11-16 | C: 파일 지도에 js/undo.js(되돌리기), 수첩 줄 × 로만 |
| v1.4 | 2026-11-16 | A: 파일 지도에 js/tidy.js(판 다시 짓기) |
| v1.5 | 2026-11-16 | A: 판 손잡이(고르기·옮기기)·진짜 수사판 배치로 파일 지도 고침 |
| v1.6 | 2026-11-16 | B: 파일 지도에 js/persona.js · persona.md(마틴 인물 설정 v2) |
| v1.7 | 2026-11-16 | B: 2장 마틴 말투 줄 → 인물 설정 v2(정해진 대사 예시 걷음) |
| v1.8 | 2026-11-16 | A: 파일 지도에 js/shot.js(판 사진)·js/lib |
| v1.9 | 2026-11-16 | B: 파일 지도에 js/split.js(판·대화 나누기), 기기 키 drmartin.split |
| v1.10 | 2026-11-16 | B: 마틴 인물 설정 v2.1(추리하는 방식과 말) |
| v1.11 | 2026-11-16 | C: 파일 지도에 js/size.js(카드 크기 손잡이) |
| v1.12 | 2026-11-17 | B: 파일 지도에 js/pvdoc.js(사진 보기 판독문 단추) |
| v1.13 | 2026-11-17 | C: 파일 지도에 js/pvtalk.js(사진 위에 뜨는 대화), 기기 키 drmartin.pvfull → pvfull2 |
| v1.14 | 2026-11-17 | A: 폰에서 엔터 = 줄 바꿈(js/input.js) |
| v1.15 | 2026-11-17 | A: 파일 지도에 js/trail.js(행동 기록 자세히) |
| v1.16 | 2026-11-17 | B: 파일 지도에 js/mode.js(자료 형편), 인물 설정 v2.2 |
| v1.17 | 2026-11-17 | C: 파일 지도에 js/xref.js(맞춰 보기), 수첩 정돈(합치기·덮기) |
| v1.18 | 2026-11-17 | A: 파일 지도에 js/wallclock.js·img/clock(벽시계), 마틴 인물 설정 v2.3(다른 세계의 의뢰·현실 시간) |
| v1.19 | 2026-11-17 | A: v0.15.0 — 엔진 메모 v0.3 으로, 한 판 점검 tests/v15.js, 점검은 반씩, 파일 지도에 빠져 있던 js/clock.js·js/recap.js(D) |
| v1.20 | 2026-11-17 | B: 파일 지도에 js/habits.js(수사 버릇·실 why·cut·꼬리표 자리), doOp 에 cut (v0.14.5) — v1.19 는 A 의 v0.15.0 몫(엔진 메모 v0.3·tests/v15.js)이 쓸 번호 |
