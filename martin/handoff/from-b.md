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

## 2026-11-17 04:40 · 수사 버릇·실 why·cut·꼬리표 자리(v0.14.5 — C 와 번호가 겹쳐 하나 올림) · [보통] · 받는 쪽: A, C, D
- 무엇: js/habits.js(새, mode.js 다음). ① doOp 를 감쌌다 — 새 op "cut"({a,b,why} → 실 떼고 S.cuts 최근 30), link 뒤 L.why·L.whyTurn 저장(다시 이으면 S.cuts 에서 뺌). ② modeFilter 를 감쌌다 — 전제 의심을 시킨 턴을 S.premiseAt 에(UNDO_SKIP). ③ board.js renderStrings 꼬리표 자리 한 줄 — tagSpot(L,c,placed)(핀↔핀 직선 위 카드 상자를 피하는 자리). ④ ai.js 규칙 문장: boardText 실 줄에 「— 왜」, habitText() 를 「판 고치기 (ops)」 위에, ops 8번 cut(tidy 9번), 이름 없는 발신자 확률은 말로, notes 의 "over" 줄(C 요청 반영). A 의 처지 줄(v2.3)은 그대로 살렸다.
- 받는 쪽에게 필요한 일: A — doOp·renderStrings·modeFilter 고리를 고칠 때 이 감싸기들이 뒤에서 다시 씌운다는 것만 기억. 나중에 doOp 안으로 cut·why 를 들이면 habits.js 쪽을 지워 달라고 말해 줘. C — 수첩 정돈의 "over" 를 판단 규칙에 한 줄로 넣었다. D — changes.js 맨 아래 v0.14.3 줄이 두 번(하나는 사건 시계 내용, v0.14.2 와 같은 글) 들어가 있다. 확인 부탁.
- 관련 파일·버전: js/habits.js(새), js/ai.js, js/board.js(한 줄), index.html, css/b.css, tests/habits-b.js(새) · v0.14.5

## 2026-11-17 16:25 · 프롬프트 통일 규칙 — 끝날 때까지 프롬프트 문장 쉬기 · [급함] · 받는 쪽: A, C, D
- 무엇: 보스 지시 「예외를 더하지 말고 통일 규칙으로, 다 뜯어고쳐」. 마틴에게 가는 프롬프트의 규칙부를 다섯 원칙(근거·무게·변화·말·의심)으로 다시 묶고, 각 방 데이터 칸(맞춰 보기·연혁·자료 형편·난제·끊은 실 등)에 붙은 명령문은 상태만 남기고 걷어서 「이번 턴에 걸린 것」 한 칸에서 원칙 이름으로 가리키게 한다. 같은 규칙이 여러 번 적힌 곳(「없다」 세 군데, 줄 수 네 군데, over 두 번, 처지 두 번)은 한 곳으로.
- 받는 쪽에게 필요한 일: 끝나서 이 알림 아래에 「끝」 줄이 붙을 때까지 프롬프트에 들어가는 글(buildPrompt, …Text 함수의 문장)을 새로 더하거나 고치지 말아 주세요. 기능 코드(화면·저장·판 조작)는 그대로 하셔도 됩니다. D — cue.js 는 modeText 를 감싸 문장을 더하는 대신, 「자료가 곧 온다」 같은 상태(S 의 값)만 정해 주시면 제가 그 상태를 「걸린 것」 칸에 잇겠습니다.
- 관련 파일: 할일.md 의 「프롬프트 통일 규칙」 줄

## 2026-11-17 17:05 · 끝 — 프롬프트 통일 규칙(v0.15.4) · 프롬프트 문장 다시 고쳐도 됩니다 · [보통] · 받는 쪽: A, C, D
- 무엇: 규칙은 js/rules.js 한 곳 — RULES(다섯 원칙: 근거·무게·변화·말·의심), dueText()(「이번 턴에 걸린 것」 — 신호 DUE_SRC 를 우선순위로 많아야 셋, 원칙 이름으로만), outText()(출력 칸 모양만). buildPrompt 는 조립만. 상태 칸(xrefText·tlText·modeText·pzText·evText·undoText·trailText·clockText·boardText)은 상태만 — 명령문을 걷었다. habitText 는 없앴다(버릇은 원칙으로, 뒤집어 보기·전제 의심은 신호로, 끊은 실은 boardText 의 「끊은 실:」 줄로).
- 받는 쪽에게 필요한 일(모두): 앞으로 마틴이 무언가를 하게 하고 싶으면 ① 상태 칸에 「~해라」를 붙이지 말고 상태만 보이게 하고 ② 그 상태가 이번 턴에 꼭 걸려야 하면 rules.js 의 DUE_SRC 에 신호 한 항목(p 우선순위, t 「원칙 — 무엇」)을 더하고 ③ 행동 자체가 원칙에 없으면 다섯 원칙 중 맞는 문장을 고친다(새 줄을 덧대기 전에). tests/rules-b.js 가 이 구조를 본다 — 프롬프트를 고치면 v15·rules-b 를 같이 돌려 주세요. 인수인계 2-1 「구조 원칙」(보스 지시, 모든 방 공통).
- A — ai.js 는 buildPrompt 를 조립만으로 바꿨고, turn() 의 건넨 것 글(자료 없음·사진·화면·그림 4장·다시 보기)에서 지시 문장만 걷었다(흐름은 그대로). C — xrDebts 의 문장을 상태로(「…인물 카드가 없다」, 「… 그대로인데 수첩 m9 에 「…」」, 「오전·오후 없는 시각 N개」), xrefText 의 「판 빚」 머리 → 「기록과 자료가 안 맞는 곳」, 모순 쓸기 문장은 rules.js 의 의심 신호(xrSweepWhy 를 그대로 읽음). D — cue.js 의 cueState() 는 modeText 의 [자료 형편] 칸 끝에 붙고, S.cue 가 있으면 「걸린 것」은 다음 답으로 미룬다. 바라던 행동(짧게 받기·앞질러 추리 안 함·판 그대로)은 원칙 4 「말의 크기만큼」 한 문장으로, 「지금 당장은 어렵다」는 mode 정의(아직 열림)로 녹였다.
- 관련 파일·버전: js/rules.js(새), js/ai.js, js/xref.js, js/timeline.js, js/mode.js, js/habits.js, js/puzzles.js, js/evidence.js, js/undo.js, js/trail.js, index.html(rules.js — timeline.js 다음), tests/rules-b.js(새) 외 점검 7개 · v0.15.4

## 2026-11-17 19:50 · 통일 규칙 마저(v0.15.5) — 감싸기 걷음 · [보통] · 받는 쪽: A, D (C 참고)
- 무엇: 보스 「한번에 시작해」로 A·D 파일을 같이 고쳤다(할일.md 끝난 일 줄에 파일 목록). ① 판 정리 프롬프트(tidy.js tidyPrompt)를 MARTIN_SHORT + RULES + 묶음 짜는 법으로 — 옛 「느와르·하드보일드」 말투와 겹친 실 규칙을 걷음, cut·link 는 why 와 함께. ② 판독 지시 「화면 속 글자를 빠짐없이 …」를 READ_RULE 맨 앞으로 옮기고 evReadOne·outText 는 READ_RULE 만 부름. ③ 감싸기를 걷었다 — modeFilter(mode←cue←habits)·modeText(cue)·doOp(habits) 재할당이 없다.
- 받는 쪽에게 필요한 일(모두): 앞으로 마틴의 답을 연출 전에 거르거나 기록해야 하면 함수를 감싸지 말고 rules.js 의 RES_STEPS 에 [이름, 함수] 한 항목을 더한다(순서 = 목록 순서). 실을 잇거나 끊는 코드는 habits.js 의 strLink(a,b,label,sure,why)·strCut(L,why)·strFind(id 나 {a,b}) 를 부른다 — 이유와 「끊은 실」 기록이 저절로 따라온다. A — board.js doOp 의 link 가지가 strLink 를 부르고 cut 가지가 새로 생겼다. turn() 고리 한 줄은 modeFilter → resFilter. D — cue.js 는 감싸기 대신 cueStep(res) 함수가 되었고 cueSense 는 mode.js modeText 가 부른다(tests/cue.js 는 resFilter 로). tests/rules-b.js 가 「감싸기 없음」도 본다.
- 관련 파일·버전: 할일.md 끝난 일 「통일 규칙 마저」 줄 · v0.15.5

## 11-18 B · v0.15.8 수첩 의문이 답을 품는다 · 맞춰 보기 날짜·사람 · 연혁 앞뒤 — [중요] · 받는 쪽: C, A, 모두
- 무엇: 보스 「의문을 해결했는데도 그대로 남아 있고 참조도 안 한다」. 수첩의 묻는 줄(의문·확인할 것)에 답 달기를 notebook.js 의 nbAnswer(n, a, sure) 한 길로 — sure 면 풀림, 아니면 기운 답(n.lean·n.leanTurn, 열린 채 짐작 칸에 「의문 → 답」). solve(이제 sure 칸)·over(묻는 줄을 가리키면 새 줄 없이 그 줄의 답)·판 의문 카드 내림(cardSolved 가 card.lean 을 들고)이 다 이 길. 덮기의 「마틴 줄만」 조건은 걷음.
- C(notebook.js·xref.js): ① 「열린」 묻는 줄 = !done && !lean. 짐작 칸 = nbLeaning()(짐작 + 기운 답 달린 묻는 줄), 열린 수 nbOpenCount 도 lean 을 뺌. 수첩 줄을 새로 그리는 코드는 n.lean 을 「→ 답」으로 보여 주면 된다(li 에 .lean, 표시 「?~」). ② xref: 날짜는 줄 머리에서만(xrLine 의 stamp — 날짜 줄·줄 앞 도장·괄호 도장), 말 속 날짜는 말. 날짜 줄은 「날짜 구분선:」 같은 이름표를 떼고 본다. 시각 없는 「X: 말」 줄은 loose — xrItems 가 시각 도장 붙은 줄로 아는 사람일 때만 남긴다. XR_STOP 에 물음 낱말(누구·무엇·어디·언제 …) — 수첩 nbIn 이 같은 xrToks 를 쓴다.
- A(timeline.js): tlCheck 의 순서 대조는 tlBefore(x, y) 한 곳 — 해·날짜·시각을 둘 다 아는 자리까지만, 오전·오후 모르는 시각은 두 갈래 어느 쪽으로도 앞설 때만. tests/timeline.js v1.1 은 그래서 순서 어긋남을 t5·t1 로 바꿨다(t3 은 오전·오후 모름).
- 모두: 「이번 턴에 걸린 것」 번호를 목록 순서대로 1~10 으로 다시 매겼다(새 둘: 무게 — 동료 말이 수첩 의문을 다룸 · 변화 — 답 없이 오래 열린 의문). 새 신호는 들어갈 자리에 넣고 번호를 다시 매기면 된다.
- 관련 파일·버전: notebook.js, xref.js, timeline.js, rules.js v1.3, tests/notebook-b.js(새)·timeline.js · v0.15.8
