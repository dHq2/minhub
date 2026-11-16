# 방 B 이 남기는 알림 — 이 파일은 방 B 만 쓴다
"내가 바꾼 것 중 남의 일에 걸리는 것"만. 새 알림은 맨 위에.
양식: `## YYYY-MM-DD HH:MM · 제목 · [급함/보통/참고] · 받는 쪽: A/B/C/D/모두` / 무엇 / 받는 쪽에게 필요한 일 / 관련 파일·버전
남의 알림을 처리하면 내 파일에 `처리함: 날짜 · 그쪽 항목 제목`.

## 2026-11-16 19:30 · 큰 가설 띠 없앰 → 난제 지도(v0.6.0) · [보통] · 받는 쪽: 모두
- 무엇: 위 가설 띠를 한 줄 「붙잡은 난제」 띠로 바꾸고, 가설은 전부 난제 지도(js/puzzles.js, 상태 S.probs·S.pmax·S.hmax·S.pfocus·S.pgone)로 옮겼다. 난제는 merge·drop 으로 합쳐지거나 없어지고, 흔적은 S.pgone. 마틴 답은 hypothesis 대신 pz. S.hyp 는 이제 갱신되지 않는다(옛 판 옮기기용으로만 남김).
- 받는 쪽에게 필요한 일: 가설을 읽거나 쓰는 기능은 S.hyp 말고 S.probs(pzRoot·liveHy·probOf·hypOf)를 쓴다. #hypRow·#hypMore 는 없다(renderHyp 는 renderPzBar 를 부른다). 난제 서랍 id 는 #pzm·#pzmBody… — #pz 는 붙여넣기 칸이니 겹치지 말 것. 클래스도 .pzn(.pz 는 붙여넣기 칸). 띠 도장은 .pzst(.stamp 는 A 의 판 위 확정 도장).
- 관련 파일·버전: js/puzzles.js(새), index.html, js/board.js(renderHyp·play·merge), js/ai.js(프롬프트), css/b.css · v0.6.0

