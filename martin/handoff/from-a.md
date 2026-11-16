# 방 A 이 남기는 알림 — 이 파일은 방 A 만 쓴다
"내가 바꾼 것 중 남의 일에 걸리는 것"만. 새 알림은 맨 위에.
양식: `## YYYY-MM-DD HH:MM · 제목 · [급함/보통/참고] · 받는 쪽: A/B/C/D/모두` / 무엇 / 받는 쪽에게 필요한 일 / 관련 파일·버전
남의 알림을 처리하면 내 파일에 `처리함: 날짜 · 그쪽 항목 제목`.

## 2026-11-16 19:20 · say 줄 모양이 바뀜(시선 따라가기) · [보통] · 받는 쪽: 모두
- clean() 이 say 를 {t, on:[카드], beat} 객체 목록으로 돌려준다(예전엔 글자열). play 는 sayLine(l) 로 말한다 — 카드를 짚으며.
- speak(t, keep, meta) 셋째 인자 생김 — meta.on·beat 가 S.log 줄에 같이 남는다(대화창에서 눌러 그 카드로). 로그의 at 은 여전히 시각이다(카드는 on).
- 판 비추기 상태: world.focus · .card.spot · .str.hot · #strings .ghost. 다른 연출을 붙일 땐 unfocus() 로 걷고 시작.
- tests/run.sh 가 tests/*.js 를 전부 돈다 — 새 점검은 파일만 만들면 된다.
- v0.5.2

## 2026-11-16 19:45 · 자료함 생김(v0.7.0) · [보통] · 받는 쪽: 모두
- 새 상태 S.ev·S.emax(js/evidence.js). 사진 카드 = 판의 표시, 자료함 = 원본 정본. 카드를 지우거나 합치는 코드를 새로 짜면 evDetach(카드, 합친쪽) 를 불러 줄 것.
- openPv(id) 는 이제 카드 id(n…)도 자료 id(e…)도 받는다. 보는 중인 것은 pvOpenId()(n 또는 e), 아래 글은 pvRefresh() 로 다시 그림. itemOf(id) = 카드든 자료든.
- keepPhoto(n, a, ev) 셋째 인자, 첨부 a.orig(올린 파일 그대로). 마틴 답 칸 read·look·lookLine 추가 — look 이 오면 turn 안에서 한 번 더 묻는다(turns/ 로그에 part:'look' 줄).
- 위 단추가 넷(자료·수첩·난제·사건) — .top .tb 좌우 여백을 10px 로 줄였다(css/a.css).
- v0.7.0

## 2026-11-16 20:35 · 판 정리가 묶음 배치로 바뀜(v0.9.0) · [보통] · 받는 쪽: 모두
- 새 상태 S.groups = [{a:중심 카드, name, cards, c:색}] (js/tidy.js). 판 정리 = rebuildBoard()(마틴에게 묶음을 받음), 자리만 다시 = relayout(). 옛 tidyPlan·tidy() 는 없다.
- renderStrings 가 실을 나눈다: 묶음 중심↔구성원 = #zones 기둥(.spine), 같은 묶음 = #strings .str.gin(묶음 색), 묶음 사이 = #xl(카드 위) .str.xg. 실을 고르는 코드는 '#strings .str, #xl .str, #zones .spine' 셋 다 볼 것. 꼬리표 .tag 는 이제 카드 위(z 3).
- 카드를 떼는 코드는 그대로 두면 된다(묶음은 그릴 때 없는 카드를 거른다). 새 카드를 묶음에 넣으려면 joinGroup(id, 중심 id).
- 마틴 add op 에 of(묶음 중심) 칸이 생겼다. world 에 CSS 변수 --ik(멀리서 볼 때 이름표 키우기).
- v0.9.0

## 2026-11-16 21:30 · 판 손잡이가 바뀜 — 카드 고르기·옮기기, 실은 카드 위(v0.10.0) · [보통] · 받는 쪽: 모두
- js/view.js 판 누르기: 한 번 = 고름(SELC, .card.sel) · 고른 카드 한 번 더 = cardSheet · 고른 카드 끌기 = 옮김(.lift → .dropped, save) · 안 고른 카드·빈 곳 끌기 = 판 굴리기 · 두 손가락·휠 = camZoom(그 자리 중심). 카드를 누르면 바로 뭔가 여는 코드를 새로 붙이지 말 것(한 번은 고르기).
- 실은 이제 전부 #xl(카드 위) — #strings 는 비어 있다. 실을 고르려면 '#xl .str'. 핀 머리 #xl .pinh. 꼬리표 .tag z 4.
- 묶음(S.groups)은 판 정리 때 자리 잡는 데만 쓴다 — 묶음 상자·이름표·묶음 색 실은 없다(보스: 지금은 필요 없음). 자리는 보스가 옮기니, 마틴 턴에서 판 전체를 다시 놓는 코드를 넣지 말 것.
- v0.10.0
