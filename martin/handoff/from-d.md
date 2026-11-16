# 방 D 이 남기는 알림 — 이 파일은 방 D 만 쓴다
"내가 바꾼 것 중 남의 일에 걸리는 것"만. 새 알림은 맨 위에.
양식: `## YYYY-MM-DD HH:MM · 제목 · [급함/보통/참고] · 받는 쪽: A/B/C/D/모두` / 무엇 / 받는 쪽에게 필요한 일 / 관련 파일·버전
남의 알림을 처리하면 내 파일에 `처리함: 날짜 · 그쪽 항목 제목`.

## 2026-11-16 19:25 · brief 앞에 업데이트 묻기가 끼워짐 · [보통] · 받는 쪽: C(그리고 모두)
- 무엇: js/update.js(새, index.html 에서 brief.js 바로 다음·boot.js 앞)가 맨 아래 한 줄로 brief 를 감싼다 — brief 를 부르면 먼저 updGate() 가 돌고, true 일 때만 원래 brief 가 이어진다.
- updGate: 본 버전(drmartin.seen/meta/seen)이 있고 VER 보다 옛것이며 CHANGES 에 새 줄이 있으면 마틴이 "새로운 업데이트가 있다. 적용하겠나?" + #updAsk 단추. 적용 → #updProg 3단계 → true. 미룸 → false(본 표시 안 함 → 다음에 다시 묻기). 기록 없으면 묻지 않고 true.
- C 에게 필요한 일: 첫 인사·브리핑을 합치면서 brief 를 다른 이름으로 바꾸거나 boot 에서 brief 를 안 부르게 되면, 브리핑 직전에 `if (!(await updGate())) return;` 한 줄을 넣고 update.js 맨 아래 감싸기 줄은 지워 달라. 이름을 그대로 두면 할 일 없음. 묻는 동안 busy 는 boot 가 잡고 있어야 한다(건네기 잠김).
- 새 기기 키 drmartin.bak = 적용 직전 판 사본 {from,to,at,s}. 새 점검 tests/update.js.
- v0.6.1

## 2026-11-16 19:10 · 수사 수첩 목록형으로 바뀜 · [참고] · 받는 쪽: 모두
- 수첩 항목 마크업이 .nt/.ns → .nl/.nl-s/.nl-h 로 바뀌었다(js/notebook.js renderNb, 스타일 css/d.css). 클릭 처리도 .nl[data-n].
- app.css 의 옛 수첩 규칙(.ns·.nt·.k-*·.nbadd 입력)은 이제 거의 안 쓰인다. 지우고 싶은 방은 할일.md 에 찜하고 지우면 된다.
- 수첩을 고칠 땐 css/d.css 의 「11-16 D: 수사 수첩 목록형」 묶음을 같이 본다.
- v0.5.1

