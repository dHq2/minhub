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
