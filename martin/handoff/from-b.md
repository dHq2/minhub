# 방 B 이 남기는 알림 — 이 파일은 방 B 만 쓴다
"내가 바꾼 것 중 남의 일에 걸리는 것"만. 새 알림은 맨 위에.
양식: `## YYYY-MM-DD HH:MM · 제목 · [급함/보통/참고] · 받는 쪽: A/B/C/D/모두` / 무엇 / 받는 쪽에게 필요한 일 / 관련 파일·버전
남의 알림을 처리하면 내 파일에 `처리함: 날짜 · 그쪽 항목 제목`.

## 2026-11-16 19:30 · 큰 가설 띠 없앰 → 난제 지도(v0.6.0) · [보통] · 받는 쪽: 모두
- 무엇: 위 가설 띠를 한 줄 「붙잡은 난제」 띠로 바꾸고, 가설은 전부 난제 지도(js/puzzles.js, 상태 S.probs·S.pmax·S.hmax·S.pfocus·S.pgone)로 옮겼다. 난제는 merge·drop 으로 합쳐지거나 없어지고, 흔적은 S.pgone. 마틴 답은 hypothesis 대신 pz. S.hyp 는 이제 갱신되지 않는다(옛 판 옮기기용으로만 남김).
- 받는 쪽에게 필요한 일: 가설을 읽거나 쓰는 기능은 S.hyp 말고 S.probs(pzRoot·liveHy·probOf·hypOf)를 쓴다. #hypRow·#hypMore 는 없다(renderHyp 는 renderPzBar 를 부른다). 난제 서랍 id 는 #pzm·#pzmBody… — #pz 는 붙여넣기 칸이니 겹치지 말 것. 클래스도 .pzn(.pz 는 붙여넣기 칸). 띠 도장은 .pzst(.stamp 는 A 의 판 위 확정 도장).
- 관련 파일·버전: js/puzzles.js(새), index.html, js/board.js(renderHyp·play·merge), js/ai.js(프롬프트), css/b.css · v0.6.0

## 2026-11-16 21:45 · 마틴 페르소나(인물 설정 v2, 보스 확정) · [보통] · 받는 쪽: 모두, 특히 A
- 무엇: 마틴이라는 사람을 js/persona.js 에 모았다 — MARTIN_WHO(한 턴 프롬프트 맨 앞), MARTIN_SHORT(짧은 프롬프트 맨 앞 한 줄). 원본은 martin/persona.md(보스가 쓴 v2 그대로). 게임 안에 따로 드러내지 않는다 — 그냥 이런 사람. 이상한 말투도 습관도 없다.
- 운용 원칙(보스): 차분하고 절제됐지만 억지로 무뚝뚝·냉소적이지 않게, 말버릇·반복 의성어·상징적 행동 없음, 담배·술·그림자·시체를 대화에 끌어오지 않음, 무조건 동조하지 않음, 과시 독백·과장된 탐정물 대사 없음, 실제 사람처럼 자연스럽게.
- ai.js 「말투:」 줄의 정해진 대사 예시(「하! 그래서 그런 거였군」 「봐라. 정답이다」 등)를 걷었다.
- 받는 쪽에게 필요한 일: A — tidy.js 의 소개 줄(「느와르 추리 만화의 탐정」·「짧고 단정한 하드보일드 반말」)을 `${MARTIN_SHORT}` 와 위 원칙으로 바꿔 달라. 시선 따라가기 예문(「이걸 봐라」 「그래.」)과 확정 연출의 boom('하!') 도 원칙(감탄사·과장 없음)에 맞는지 봐 달라 — 판단은 보스. 모두 — 마틴 고정 대사(첫 인사·안내 등)를 새로 쓰면 이 원칙에 맞춘다.
- 관련 파일·버전: js/persona.js(새, index.html 에서 ai.js 바로 앞), persona.md(새), js/ai.js(첫 줄·말투 줄), js/brief.js(첫 줄·말투 줄) · v0.10.1

## 2026-11-16 22:00 · 대화창 높이가 고정 208px 이 아님(v0.11.2) · [보통] · 받는 쪽: 모두
- 무엇: js/split.js 가 .stage 높이를 비율로 정한다(기본 판과 반반, 손잡이 #split 로 25~75%). 높이를 바꿀 때마다 window 에 가짜 resize 신호를 보낸다(isTrusted false).
- 받는 쪽에게 필요한 일: 대화창·판 크기에 기대는 코드는 208px 같은 고정값 대신 그때그때 offsetHeight 를 재고, resize 를 들어 다시 맞춘다(applyCam·pvLayout 은 이미 그렇게 됨). resize 를 듣다가 다시 높이를 바꾸는 코드는 e.isTrusted 로 가짜 신호를 걸러야 고리가 안 생긴다. 판 아래 가운데(가로 84px · 아래 11px)는 손잡이 자리다.
- 관련 파일·버전: js/split.js(새, boot.js 바로 앞), index.html, css/b.css · v0.11.2

## 2026-11-17 00:40 · 사진 크게 보기 위 줄이 두 줄로, 아래 칸은 숨김(v0.12.2) · [보통] · 받는 쪽: D, A
- 무엇: #pv 위 줄 = 이름(#pvT) + ×(#pvX), 그 아래 .pv-btns 에 #pvR(다시 읽혀) · #pvD(판독문, 새) · #pvC(대화 숨기기). #pvN(판독·메모)은 평소 display:none, #pv.doc 일 때만 사진 위에 절대 위치로 펼침(pvdoc.js pvDocSet). pvRefresh 의 #pvN 글은 「마틴의 판독 … / 카드 메모 …」 꼴.
- 받는 쪽에게 필요한 일: D — 사진 자리(#pvS)가 위아래로 넓어졌다(위 줄 약 84px, 아래 칸 없음). 누름·확대 손볼 때 이 크기 기준으로. A — 판독문을 화면에 보이게 하는 기능을 새로 만들면 #pvN 이 숨겨져 있다는 것만 기억.
- 관련 파일·버전: index.html(#pv), js/view.js(pvRefresh), js/pvdoc.js(새), css/b.css · v0.12.2

## 2026-11-17 00:55 · size.js 에 두 손가락 넘기기(szToPinch·szCancel) · [참고] · 받는 쪽: C, A
- 무엇: 손잡이 위 터치도 판에 손가락이 이미 있으면 view.js 의 pts·pinch·drag·moved 에 직접 넣어 확대·축소로 넘긴다. 늘이던 중 두 번째 손가락이 오면(board 잡는 단계 pointerdown) 크기를 from 으로 되돌리고 넘긴다.
- 받는 쪽에게 필요한 일: A — view.js 의 pts·pinch·drag·moved 이름이나 pinch 모양({d,k})을 바꾸면 size.js szToPinch 도 같이. C — 손잡이 쪽을 다시 손대면 tests/size-b.js(진짜 두 손가락 터치)도 돌려 줘.
- 관련 파일·버전: js/size.js, css/b.css(위 단추 한 줄), tests/size-b.js · v0.12.3

## 2026-11-17 03:50 · v0.14 B 판단 규칙 들어감(v0.14.1) · [보통] · 받는 쪽: A, C, D
- 무엇: js/mode.js(새) — modeFilter(res)(A 의 turn() 고리)와 modeText()(buildPrompt 의 [이번에 동료가 가져온 것] 바로 위에 한 줄 심음). 새 상태 S.closed(true/false/없음)·S.closedTurn·S.moreAsked·S.modeSeen(뒤의 셋은 UNDO_SKIP 에 넣음). 마틴 답의 새 칸 "mode":"closed"|"open".
- buildPrompt 에서 B 가 고친 줄: 「대화와 단서를 가른다」 첫 줄, 새 「판단 규칙」 칸, 난제 지도 칸의 확신·kill·solve·의뢰 줄, 말과 시선의 줄 수 두 군데, ask·mode 줄, 「지어내지 않는다」 줄. hist·read·자료함·고리 줄은 안 건드렸다.
- 난제: 가설 확신 변화는 b 에 새 id 가 있을 때만 받는다(applyPz). 가설에 bturn(근거가 붙은 턴). 난제에 req(의뢰의 본래 질문, 사건에 하나 — new·edit 의 "req":true).
- 받는 쪽에게 필요한 일: A — turn() 고칠 때 modeFilter 고리 자리(연출 전)만 지켜 주면 된다. 판독문 다시 읽기 같은 두 번째 묻기(look·recall)에도 modeText 가 들어가 있으니 그대로 두면 된다. C — 수첩 서랍 .nb-top 과 #nbBody 사이에 #nbMode 가 끼어 있다(mode.js 가 넣음). 서랍 구조를 바꾸면 그 자리를 남겨 줘. 「모순 쓸기」 지시와 B 의 「없다 말하기 전에 판독문·대조 칸 훑기」가 같이 간다. D — 업데이트 안내 재료(changes.js)에 v0.14.1 줄을 넣었다(짧게 세 줄).
- 관련 파일: js/mode.js(새), js/ai.js(규칙 문장), js/puzzles.js, js/persona.js·persona.md(v2.2), index.html(script 한 줄 — undo.js 다음), css/b.css, tests/mode-b.js(새)

## 2026-11-17 04:40 · 수사 버릇·실 why·cut·꼬리표 자리(v0.14.4) · [보통] · 받는 쪽: A, C, D
- 무엇: js/habits.js(새, mode.js 다음). ① doOp 를 감쌌다 — 새 op "cut"({a,b,why} → 실 떼고 S.cuts 최근 30), link 뒤 L.why·L.whyTurn 저장(다시 이으면 S.cuts 에서 뺌). ② modeFilter 를 감쌌다 — 전제 의심을 시킨 턴을 S.premiseAt 에(UNDO_SKIP). ③ board.js renderStrings 꼬리표 자리 한 줄 — tagSpot(L,c,placed)(핀↔핀 직선 위 카드 상자를 피하는 자리). ④ ai.js 규칙 문장: boardText 실 줄에 「— 왜」, habitText() 를 「판 고치기 (ops)」 위에, ops 8번 cut(tidy 9번), 이름 없는 발신자 확률은 말로, notes 의 "over" 줄(C 요청 반영). A 의 처지 줄(v2.3)은 그대로 살렸다.
- 받는 쪽에게 필요한 일: A — doOp·renderStrings·modeFilter 고리를 고칠 때 이 감싸기들이 뒤에서 다시 씌운다는 것만 기억. 나중에 doOp 안으로 cut·why 를 들이면 habits.js 쪽을 지워 달라고 말해 줘. C — 수첩 정돈의 "over" 를 판단 규칙에 한 줄로 넣었다. D — changes.js 맨 아래 v0.14.3 줄이 두 번(하나는 사건 시계 내용, v0.14.2 와 같은 글) 들어가 있다. 확인 부탁.
- 관련 파일·버전: js/habits.js(새), js/ai.js, js/board.js(한 줄), index.html, css/b.css, tests/habits-b.js(새) · v0.14.4
