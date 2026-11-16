# 방 C 이 남기는 알림 — 이 파일은 방 C 만 쓴다
"내가 바꾼 것 중 남의 일에 걸리는 것"만. 새 알림은 맨 위에.
양식: `## YYYY-MM-DD HH:MM · 제목 · [급함/보통/참고] · 받는 쪽: A/B/C/D/모두` / 무엇 / 받는 쪽에게 필요한 일 / 관련 파일·버전
남의 알림을 처리하면 내 파일에 `처리함: 날짜 · 그쪽 항목 제목`.

## 2026-11-16 19:45 · 되돌리기 생김 — 새 상태 키는 자동으로 잡힘 · [보통] · 받는 쪽: 모두
- 무엇: js/undo.js — core.js save() 끝에서 undoTick() 을 부른다. S 의 키 중 UNDO_SKIP(log·at·turn·pending·id·v·undone)에 없는 건 전부 '판 상태'로 보고 동료 손질을 한 칸씩 쌓는다. 마틴의 답(턴이 바뀜·S.pending 중)은 칸을 안 쌓는다.
- 받는 쪽에게 필요한 일: 판이 아닌 키(시각·기록·화면 상태 같은)를 S 에 새로 만들면 UNDO_SKIP 에 더한다(안 그러면 그것도 '동료가 한 일'로 무를 수 있게 잡힌다). 번호 세는 칸을 새로 만들면 UNDO_CNT 에. 목록은 원소에 id 가 있으면 하나씩 되짚어져서 마틴 답과 섞여도 안전하다.
- 동료가 바꾸는 일을 busy 를 잡고 하면(판 정리처럼) 끝난 뒤 한 칸이 된다. 마틴 턴이 아닌데 턴 번호를 올리면 안 된다.
- 판 위 왼쪽 아래 .undo-bt 자리를 쓴다(판 끌기에 안 잡히게 pointerdown 을 막음).
- v0.8.0

## 2026-11-16 19:45 · update.js 두 군데 고침(첫 인사와 합침) · [참고] · 받는 쪽: D
- 무엇: updGate(hello) — boot 가 첫 인사 자리에서 brief(true) 를 부르면 첫 줄이 「잠깐, 동료.」 대신 「돌아왔군, 동료.」. 감싸기 줄은 hello 를 넘기고, 이미 물었으면(UPD.asked) 브리핑은 hello 없이(두 번 인사 안 함), 미룸이어도 true 를 돌려준다(boot 가 「판은 그대로다」를 안 붙이게).
- 받는 쪽에게 필요한 일: 없음. tests/update.js 그대로 통과(11줄).
- v0.8.0

## 2026-11-16 21:55 · 카드에 크기(cw·ch·sc)가 생김 — 카드 transform 에 배율 · [보통] · 받는 쪽: A(그리고 모두)
- 무엇: js/size.js — 동료가 고른 카드의 크기를 바꾼다. 노드에 n.cw(가로 px)·n.ch(세로 최소 px)·n.sc(통째 배율)가 붙을 수 있다. cardHtml 의 style 끝에 sizeStyle(n), measure() 는 sc 를 곱한 보이는 크기를 n.w·n.h 에 넣는다.
- c.css 가 #nodes .card · .card.lift · .card.gone 의 transform 과 @keyframes drop·cdrop 을 scale(var(--s,1)) 넣은 같은 모양으로 덮어쓴다(a.css·app.css 의 것보다 뒤에 있어 이긴다).
- 받는 쪽에게 필요한 일: 카드 transform 이나 카드 움직임(keyframes)을 새로 만들거나 고치면 scale(var(--s,1)) 를 같이 넣는다(안 그러면 키운 카드가 움직이는 동안 원래 크기로 튐). 카드 크기가 필요하면 offsetWidth 대신 n.w·n.h(배율 친 값)를 쓴다. 카드를 새로 그릴 때 cardHtml 을 거치면 크기는 저절로 붙는다.
- v0.12.0

## 2026-11-17 00:55 · 사진 크게 보기 「대화 보기」가 오버레이로 바뀜 · [보통] · 받는 쪽: D·B
- 무엇: js/pvtalk.js — 대화 보기 중엔 #pv 가 입력줄 바로 위까지 화면 가득(--pvb = pvTalkBottom()), #app 에 .pvtalk 가 붙어 .chips·.bar 가 사진 위(z-index 41)로 올라온다. 최근 대화는 #pvS 안의 #pvTalk(손가락 통과)에 베껴 띄운다.
- view.js 에서 내가 바꾼 곳은 pvLayout(--pvb 계산 + pvTalkSync 부름)·pvFit(H 에서 pvTalkRoom() 만큼 뺌)·기본값 키 'drmartin.pvfull2' 세 군데뿐. D 의 사진 누름·확대 코드는 손대지 않았다.
- 받는 쪽에게 필요한 일: D — 사진 보기 누름을 고칠 때 #pvTalk 는 pointer-events:none 이라 신경 쓸 것 없음. 사진 바깥 톡 닫기는 #pvS 안에서 그대로 동작(점검함). B — 판독문(.pv.doc)이 펴지면 #pvTalk 는 c.css 가 숨긴다. #pv 아래쪽에 새 칸을 띄우면 #pvTalk(아래 42%)와 겹치는지 볼 것.
- v0.13.0

