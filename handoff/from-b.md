# 방 B(제작기 2)가 보내는 알림 — v3.0
이 파일은 B 방만 쓴다. 다른 방은 읽기만. 새 항목은 '---' 아래 맨 위(최신이 위). 찜은 handoff/할일.md 에서만 한다(v3).
v2.x 까지는 '보너스 B'·'메인' 이름을 썼다(아래 옛 항목은 그대로 둠).

---
## 2026-11-15 08:20 · 세희가 화면 안 넘기고 「볼 거」 라벨 · [중요] · 받는 쪽: A·C
- 무엇: 보스 — "질문만 했는데 세희가 혼자 휙휙 난리". 적는 건 자동 그대로, 화면 이동만 없앰. js/work.js — SEE·seeMark(k,id)·seeFlush(k)(k = pan·cal·people), workShow(c)(그 화면을 보고 있거나 args.show·calendar 일 때만 옮겨 보여 줌), 아니면 workAfter 에서 seeMark. 'view'·'people' 보너스 이벤트로 그 화면을 열면 반짝. js/office.js 끝 처리 PPL 갈래 — 사람 서랍을 보고 있을 때만 반짝, 아니면 seeMark('people'). js/ai.js add_item·update_item 에 show, 지침 「세희는 보고만 한다」 한 줄(답 먼저, 묻지 않은 제안·확인 질문 덧붙이지 않음). css/b.css 맨 아래 라벨.
- 받는 쪽에게 필요한 일: A — '묻기보다 먼저 한다'(v1.5.40)는 그대로 살아 있음(적기는 자동). 새 지침 줄과 부딪히는 문구를 넣지 말 것. C — 새 화면 이동 코드를 넣을 땐 workShow·seeMark 를 거칠 것. 보고서 카드(make_card)는 보스가 시킨 거라 지금처럼 보드를 띄움.
- 관련 파일·버전: ship.sh 가 찍은 번호 / tests/tsee v1 · twork 고침

## 2026-11-15 07:50 · 달력 사무 메모·화면 기억·달력 안 넘어감 · [중요] · 받는 쪽: A·C
- 무엇: js/ai.js add_item·update_item 에 memo(달력용 9자 안팎 명사형)·calendar(보스가 '달력에 적어'라고 콕 집은 때만 true) 인자, 프롬프트 한 줄. CAL.changed 는 이제 calendar:true 이거나 달력이 열려 있을 때만 — 그 밖엔 CAL.focus 만(다음에 달력 열면 그 날 확대). itemBrief 에 memo. js/office.js 끝 처리의 CAL.changed 갈래는 calShowDate(d) 한 줄로. js/calendar.js calItemOf 는 달력이 안 열려 있고 calendar 가 없으면 null(작업 중계가 달력으로 안 감). calMemo(it)(memo 없으면 말투 끝 떼기), CAL_COL 150, CAL_ROWMIN 150, CAL.view(닫을 때 배율·위치·달 저장), calCenter(d).
- 받는 쪽에게 필요한 일: A — 생성기·하루 생성에서 날짜 있는 일을 만들 때 memo 도 넣어 주면 달력이 깔끔함. C — 달력 칸 글은 calMemo(it) 로(it.text 직접 쓰지 말 것), 일정 바뀌면 CAL.focus 를 쓰면 다음 열 때 그 날로 감.
- 관련 파일·버전: ship.sh 가 찍은 번호 / tests/tcalwide v4 · tcalzoom

## 2026-11-15 07:30 · 달력 포스트잇 빼고 한 줄 글씨 · [보통] · 받는 쪽: C (A 참고)
- 무엇: 보스 말로 포스트잇(.cb-pi·'pi' 클릭) 없앰. calPack() 이 이제 칸마다 한 줄(nowrap) 일정들의 폭·높이를 재서 다 들어가게 --fs(글씨 배율)를 칸에 매김. 열 때(calPageOpen)·'오늘' 누를 때 CAL.zoom = CAL_ZTODAY(1) + calCenter()(오늘 칸 가운데, 가로·세로). 확대 최대 4, sehee.calZoom 저장은 뺌.
- 받는 쪽에게 필요한 일: C — .cb-it 은 white-space:nowrap + font-size:calc(1rem*var(--fs)). 칸 글씨 크기를 따로 고정하지 말 것(--fs 를 덮음).
- 관련 파일·버전: ship.sh 가 찍은 번호 / tests/tcalwide v3

## 2026-11-15 07:10 · 달력 확대·축소 — 휠·두 손가락, 끝까지 줄이면 한 달 전체, 휠 누르고 끌기 = 손바닥 · [보통] · 받는 쪽: C (A 참고)
- 무엇: js/calendar.js — CAL.zoom(sehee.calZoom), calZoomApply()(--cz 를 .cb-wd·.cb-grid 의 CSS zoom 으로, 칸 폭은 늘 124px×7, 최소 배율 = 보드 폭/868, --rowh = 남은 높이/줄 수/min(배율,1), 끝에 calPack), calZoomTo(z, 화면 x, y)(그 자리 고정). wideMouse 다시 씀: 휠 = 확대·축소, Shift·옆 휠 = 옆으로, 가운데 버튼 끌기 = 손바닥. pinch(touch 이벤트). boardSwipe 는 CAL.pinchAt 600ms 안이면 달 안 넘김. 낙서 캔버스는 이제 .cb-grid 안(inset:0, 같이 확대) — 크기는 getBoundingClientRect 기준.
- 받는 쪽에게 필요한 일: C — 칸 위치는 offsetLeft 대신 getBoundingClientRect 로(확대 중엔 offset 이 확대 전 값). .cb-grid 에 position:relative 가 생김. #calSheet 스크롤바는 숨김.
- 관련 파일·버전: ship.sh 가 찍은 번호 / tests/tcalzoom v1

## 2026-11-15 06:40 · 달력 칠판 낙서 — 받침대 마커·지우개가 진짜로 됨 · [보통] · 받는 쪽: C (A 참고)
- 무엇: index.html .cp-tray 의 <i> 넷에 role·data-t(r·b·k·er), aria-hidden 뺌. js/calendar.js — INK 상태, calInk()(calPack 끝에서 불림: #calSheet 안 canvas.cb-ink 를 .cb-grid 크기에 맞추고 이달 획을 다시 그림), inkBind(그리기·지우개 destination-out), inkSet·calInkTool·inkWipe(두 번 톡, toast 되돌리기), trayPick(#cal 캡처 단계 pointerdown/up — 받침대 둘레를 누르면 가장 가까운 도구). 저장 키 sehee.calInk {'YYYY-MM': [획]} 칸 비율 좌표, 40만 자 넘으면 오래된 획부터. calPageClose 에서 inkSet(null). wideMouse 는 INK.tool 이면 끌기 안 함.
- 받는 쪽에게 필요한 일: C — #calSheet 는 이제 position:relative(낙서 캔버스 기준). 칸 z: 일반 auto · 캔버스 1 · 포스트잇 칸 2 · 앞에 나온 포스트잇 3 · 요일 줄·안내 줄 5. .pen 일 땐 칸 pointer-events 없음. 받침대 마커에 클릭 처리를 따로 달지 말 것(trayPick 이 함).
- 관련 파일·버전: ship.sh 가 찍은 번호 / tests/tcalink v1

## 2026-11-15 06:10 · 달력 칸 고정 + 넘치면 포스트잇 · [보통] · 받는 쪽: C (A 참고)
- 무엇: 보스가 "칸이 늘어나는 게 짜친다"고 해서 줄 높이를 모두 같게(b.css grid-auto-rows:var(--rowh)). js/calendar.js 에 calPack() — calWide 의 fit 끝과 Gaegu 글꼴 로드 뒤에 불림. 칸에 안 들어가는 .cb-it 를 칸 안 .cb-pi(data-cal="pi") 로 옮김. 클릭 'pi' — 처음엔 칸에 .up(앞으로), 또 누르면 calDay.
- 받는 쪽에게 필요한 일: C — calMonth 다시 그릴 땐 끝에 calWide 를 꼭 부를 것(그래야 포스트잇이 붙음). .cb-it 을 찾는 코드는 #calSheet .cb-it 로(포스트잇 안에도 있음). 칸 높이를 내용대로 늘리는 스타일을 다시 넣지 말 것.
- 관련 파일·버전: ship.sh 가 찍은 번호 / tests/tcalwide v2

## 2026-11-15 06:00 · 달력이 가로 보드로 — 매직 글씨·옆으로 밀기·안 잘림 · [보통] · 받는 쪽: C (A 참고)
- 무엇: js/calendar.js calMonth 의 칸 글이 다 나옴(slice(0,3)·.more 없앰), 칩에 --mk(마커 색 calMarker)·--rot(calTilt). 새 calWide(dir) — #calSheet 에 --cbw(칸 124px×7)·--rowh·.wide, 열면 오늘을 가운데로 scrollLeft. 밀기(boardSwipe)는 .wide 면 달을 안 넘김(보드가 움직임), 마우스 끌기·휠(wideMouse). Gaegu 700 글꼴을 달력 열 때 한 번 불러옴. 스타일은 css/b.css(#calSheet 로 c.css 를 이김).
- 받는 쪽에게 필요한 일: C — 칠판 칸을 그리는 건 calMonth 로(끝에 calWide 를 부름). .cb-it 의 두 줄 자르기·+N 을 다시 넣지 말 것(보스: 실제 보드처럼 안 잘림). 칠판을 옆으로 밀어 달을 넘기던 동작은 이제 보드가 넓을 땐 안 함(‹ › 로만).
- 관련 파일·버전: ship.sh 가 찍은 번호 / tests/tcalwide v1

## 2026-11-15 05:20 · 보스 써 보고 다섯 가지 — 세희 기록 창·자료 지침·말 나누기·보고서 목록·업데이트 한마디 · [보통] · 받는 쪽: A · C
- 무엇: ai.js toMessages 가 '줄 24개' → '보스 말 14마디(최대 160줄)'. 오래된 긴 붙여 넣은 글은 앞 1500자 + 자료 번호. materials() 에 붙여 넣은 긴 글 포함, 새 도구 read_chat(readChat). 지침 '자료 받았을 때'를 '묻지 않고 판에 적고 말로 정리'로(보고서는 시킬 때만). office.js updateLive 가 쓰는 중에 문단 단위로 먼저 내보냄(liveSplit·liveRest — seheePart·seheeSaysSplit 가 이미 낸 문단을 뺌, 끝난 뒤 쪼개기 없음). base.js 보고서 목록이 #sheet → 제목 아래 #rlDrop(reportList 다시 누르면 접힘, rlClose). update.js 는 본체 번호가 바뀌면 언제나 updBrief.
- 받는 쪽에게 필요한 일: C — treport 의 목록 고르는 자리만 #rlDrop 으로 바꿨음. 보고서 목록을 #sheet 에서 찾는 코드가 있으면 #rlDrop. A·C — O.log 를 직접 잘라 AI 에 넘기는 곳이 있으면 toMessages 를 쓸 것(보스 말 마디 기준).
- 관련 파일·버전: ship.sh 가 찍은 번호 / tests/tfive v1 · treport(C) 손봄 · css 는 b.css

## 2026-11-15 04:30 · B 작업 시간 검수 v1 — 보스 요청, A 에게 · [참고] · 받는 쪽: A (C 도 보면 좋음)
- 무엇: handoff/검수-작업시간-B.md — B 일 7건을 기록(처음 만든 시각·실제 올린 시각)으로 재고, 전체 검사 50종을 하나씩 초시계로 잼(640초). C 진단과 같은 점·다른 점, B 자신의 문제, 줄이는 순서 의견.
- 받는 쪽에게 필요한 일: 5번(번호 자동화·자리 나누기·검사 방식)은 세 방 규칙 — 보스·A 가 정하면 B 가 인수인계 v4 초안. 6번(B 테스트 가볍게·주석 번호 빼기·from-b 정리)은 B 가 바로 함.
- 관련 파일·버전: 문서만(본체 번호 안 올림)

## 2026-11-15 02:50 · 본체 v1.5.30 — 업데이트 묻기가 띠 → 게임 대화 장면 + 재사용 장면 js/scene.js · [보통] · 받는 쪽: 모두(특히 C — 업데이트 장치)
- 무엇: update.js askUpdate 가 scenePlay(SCENES.update) 로 묻는다(예 → doUpdate, 구버전 → updDeclined). 장면을 못 열면 예전 updBand. updAfterBoot 는 '예'로 본체가 바뀐 경우(from.A ≠ now.A)만 띠 대신 office.js updBrief(from, to) — 사무실에서 세희(AI)가 CHANGELOG 그 사이 항목을 숨은 말(O.log 의 m.hide:true · upd)로 받아 설명·자료 손보기, ask_boss 는 O.updTour 동안 켜짐(ai.js 한 줄). renderLog·talkHtml 은 m.hide 를 안 그림.
- 받는 쪽에게 필요한 일: 업데이트 띠 문구·단추를 테스트하던 코드는 장면에서 고르게(.vn-c 단추 '예'/'구버전으로 계속', .vn-box 누르면 채우기·다음). C 의 tests/tupd2.js 를 그렇게 바꿈(띠 단추 누르는 두 줄만). O.log 를 훑는 코드가 있으면 m.hide(보스가 쓴 말 아님)를 빼고 볼 것.
- 장면은 다른 곳에도 쓸 수 있음: scenePlay([{ ex:'설명', text:'…', choices:[{ t:'예', v:'yes' }] }]) → 고른 값. 표정 이름은 scene.js VN_FACE.
- 관련 파일·버전: 본체 v1.5.30 / tests/tvnupd v1 · tupd2(C) 손봄

## 2026-11-15 01:40 · 본체 v1.5.24 — 기록부「고치기」 없어짐(그 자리에서 고침) · 실 위 글씨 한두 단어 · [보통] · 받는 쪽: A · C
- 무엇: js/people.js 인물 기록부가 한 가지 모습만 — 보이는 칸이 곧 입력란(class pd-in), 칠 때마다 pdCollect → 0.5초 뒤 pplSave·pplRender. #pdEdit 단추와 PD.edit 쓰임 없어짐(PD.edit 는 늘 false 로 남겨 둠). 닫을 때 pdTidy 가 빈 줄 치움. tieRows(p) 는 인자 하나, 줄마다 '둘 사이' 입력(data-tlb → t.label).
- 판 글씨: relWord(s)·pplTag(p)·tieLabel(t) 새로. pplStrings 의 나와의 실 글씨 = pplTag(p)(p.tag 또는 rel 끝 낱말), 사람끼리 실 = 가운데 하나 tieLabel(t)(t.label → 없으면 aIs·bIs 를 줄여 '엄마·딸', 같으면 '친구'). aIs·bIs 데이터는 그대로 둠.
- A 에게: 기록부 공식 능력치·실 단추 처리(pdBody click/change)는 그대로 옮겨 둠(pdCollect 를 늘 먼저 부름). A 테스트 tdoss·tpplpic·tstat·tstory 에서 #pdEdit 누르는 줄만 뺐고 tstat 은 data-tme 대신 data-tlb 로 '어머니'를 넣음. 새 칸 p.tag(판 이름) — 세희 add/update_person tag 로도 들어감.
- 관련 파일·버전: 본체 v1.5.24 / tests/tpdlive v1

## 2026-11-14 07:10 · 본체 v1.5.19 — 인간관계 판 끝없이 넓어짐 + 카드 크기(--bs) · [보통] · 받는 쪽: 모두
- 무엇: js/people.js pplRender 가 판 크기를 S×S 고정에서 '기본 판(S) ∪ 모든 카드 ± PPL_PAD(150)' 로 바꿈. #ppMap 의 style.width/height 가 W·H(정사각형 아님), data-s=S(기본 판, 나 = S/2), data-l·data-t=넓힌 만큼(음수). 카드 left = 본체 좌표 − L. svg 는 viewBox="L T W H" 라 줄 좌표는 본체 좌표 그대로. BONUS.size{id:배율} 이 있으면 카드에 --bs 를 붙임. css 맨 아래 B 구역에서 #ppMap .pp-node transform 에 scale(var(--bs,1)) 덧붙임. 처음 맞춤은 W·H 각각 기준.
- 받는 쪽에게 필요한 일: #ppMap 크기를 parseFloat(style.width) 하나로 '판 = 정사각형 S' 라고 쓰는 코드가 있으면 data-s·l·t 를 쓸 것(A 의 공식 능력치 2단계(판에 실 그리기 — lineLook)는 svg viewBox 가 본체 좌표라 줄 좌표는 그대로 S 기준으로 쓰면 됨, 카드 left/top 을 읽을 땐 + data-l·t). .pp-node 의 transform 을 새로 덮을 땐 scale(var(--bs,1)) 를 끝에 같이 넣을 것(안 그러면 보스가 정한 크기가 사라짐). 저장 키 b_ppSize 는 B 것.
- 누르기 바뀜: 인간관계 판 카드는 한 번 누르면 '고름'(기록부 안 열림), 고른 카드를 한 번 더 누르면 기록부(pdOpen). 판 카드 누르기로 기록부가 바로 열린다고 가정한 테스트·코드가 있으면 두 번 누를 것. 꾹 누르기로 옮기기는 없어짐.
- 관련 파일·버전: 본체 v1.5.19 / B0.11 / tests/tppfree v1.1

## 2026-11-14 05:40 · 본체 v1.5.11 — 대화 보기 단추 없앰 + 이름표 옆 ▶▷ · [참고] · 받는 쪽: 모두
- 무엇: index.html 의 #ptAll·#btAll(대화 보기 ›)과 board.js 의 그 onclick 두 줄, 실험 B 의 #bPpAll 을 없앰. btFold 가 이름표 b 안에 <i class="bt-hint"><span>▶</span><span>▷</span></i> 를 붙임(pointer-events:none — 끌기·누르기는 이름표로). css 맨 아래 B 구역 '.bt-hint'·@keyframes btHint.
- 받는 쪽에게 필요한 일: #ptAll·#btAll 을 부르는 코드가 있으면 지울 것(지금 저장소엔 없음). C 의 '대화 글씨 크기'는 ▶▷ 가 em 단위라 같이 커지고 작아짐. 테스트 스크린샷은 tests/README v1.1 대로 /tmp — tests/ 의 vbtfold·vdwstack PNG 지움.
- 관련 파일·버전: 본체 v1.5.11 / B0.9 / tests/tbtfold v1.1

## 2026-11-13 20:15 · 본체 v1.5.6 — 서류철 견출지가 서류철에 딸려 나옴 + 서류철 묶음 · [참고] · 받는 쪽: 모두
- 무엇: js/views.js dwSet(k, x) 가 이제 견출지도 같이 옮긴다(dwTabAt — 견출지 오른쪽 끝을 서류철 왼쪽 끝에 붙임, 제자리보다 오른쪽은 안 감, 사무실 왼쪽 밖은 clip-path 로 자름, 다 열리면 .pulled). 닫히면 dwTabRest 로 inline transform·clipPath 지움. 견출지 끌기 출발점은 '서류철 왼쪽 끝 = 견출지 오른쪽 끝'(전엔 w+40). #office 에 div#dwStack.dw-stack(오른쪽 10px 종이 가장자리, z 14) 추가. css 맨 아래 '서류철 묶음' 구역에서 .dw-tabs{right:8px;width:26px} .dw{right:34px} .pan-dw{right:8px;width:26px} 로 덮어씀.
- 받는 쪽에게 필요한 일: 서류철을 여닫는 새 길을 만들면 dwSet 을 거치면 견출지가 따라온다(style.transform 을 직접 만지지 말 것). 견출지 button 의 inline transform·clipPath 는 views.js 몫. 서류철 폭이 4px 줄었다(오른쪽 30→34px).
- 관련 파일·버전: 본체 v1.5.6 / tests/tdwstack.js(run.sh 목록) — run.sh 전부 통과

## 2026-11-13 18:55 · 본체 v1.5.2 — 대화 상자 옆으로 접기 · [참고] · 받는 쪽: 모두
- 무엇: js/board.js 에 btFold(box, 이름) — 판(#panTalk .pt-box)·보드(#dw-board .bt)·사람(#bPpTalk, 실험 B) 대화 상자 공통. 이름표 .bt-name b 가 이제 끌기 손잡이(pointer-events:auto, touch-action:none, .noswipe). 접히면 상자에 .sfold(높이 80px·손 통과, 안의 것 숨김)와 꼬리 button.bt-peek(right:24px — 서랍 옆면 손잡이 .dw-grip.r 바로 안쪽). box.btFold = {fold, open, folded}. 기억은 localStorage sehee.fold.pan/board/people, 옛 sehee.ptFold(위아래 접기)는 없앰. css/app.css 맨 아래 '대화 상자 옆으로 접기' 구역(A 의 v1.5.1 구역 아래). #ptName 글자는 '강세희'(▾ 없음).
- 받는 쪽에게 필요한 일: 대화 상자를 새로 만들면 btFold(상자, '이름') 한 줄이면 같은 접기가 붙는다. 이름표·꼬리 자리에 다른 손짓을 얹을 땐 알려 주기. 실험 B0.8: 다시 답하기(on regen)로 지워진 답의 b_vis 카드도 지운다.
- 관련 파일·버전: 본체 v1.5.2 / B0.8 / tests/tbtfold.js(run.sh 목록에 넣음) — run.sh 28개 통과

처리함: 2026-11-13 · from-a 「본체 v1.4.3 — 다시 답하기」의 B 일(on regen 로 b_vis 정리) → B0.8
처리함: 2026-11-13 · from-a 「본체 v1.5.1 — 完 도장·항목 메모칸」 → css 는 A 구역 아래에 이어 붙이고 v1.5.2 로

## 2026-11-13 17:20 · 재응답·삭제 — 보스 요구와 구조 제안 · [보통, 순서는 보스가 정함] · 받는 쪽: 메인
- 무엇(보스 요구 그대로):
  1. 재응답: 세희 마지막 답을 다시 받는다. 새 답은 이전 답(1번 답)을 될 수 있는 한 참조하지 않는다.
  2. 삭제: 보스가 보낸 말·세희 답을 지울 수 있다. 지운 말·답은 세희가 기억하지 않는다.
- 제안(구조):
  1. 차례 번호 — 보스 말의 at 를 그 차례의 번호로, 그 차례에 생긴 모든 것(세희 답·작업 표시 a·세희 메모·보드 카드·보너스 b_vis)에 붙인다. 모든 쓰기 도구(판·보드·사람)는 되돌리기 기록(before/after)을 남긴다(지금은 판만 undoAction 있음). 재응답·삭제·'여기서부터 다시'·'내 말 고쳐 보내기'가 모두 '차례 되감기' 한 장치로 된다.
  2. 재응답 = 그 차례 되감기 후 다시: ① 그 차례의 쓰기를 되돌리고(못 되돌리는 게 있으면 "N개는 되돌릴 수 없어요, 그래도?" 확인) ② 이전 답은 toMessages 에서 완전히 빼고, 숨은 지시에도 이전 답의 내용·존재를 넣지 않는다(방향 고르기는 '더 짧게/더 자세히/쉽게/다시 검색' 같은 일반 지시만) ③ retryLast 와 같은 길로 다시. 단추는 마지막 세희 답에 '↻ 다시' + 방향 고르기. 옛 답은 화면에서 ‹1/2› 넘겨 보기만(기억에는 고른 하나만, 안 고른 건 기억 안 함) — 보스가 원하면 옛 답도 그 자리에서 삭제.
  3. 삭제 = 말풍선 꾹 누르기 → 삭제. 보스 말을 지우면 그 차례 전체(세희 답·작업 표시)를 같이 지울지 묻기(기본 같이). O.log 에서 완전히 빼고(숨김 표시 아님) chat 저장·동기화로 덮어쓰기, toMessages 에 '지운 말이 있었다' 같은 흔적도 금지. 세희 답만 지우면 남은 보스 말을 세희가 숙제로 다시 꺼내지 않게(실패 처리처럼) 하거나 "이 말도 지울까요?". 같이 지울 것: O.thumbs·사진 사본, job, 개발자 로그(dlog 에 말 앞 60자가 남고 서버에도 올라감), 보너스 카드(아래 창구로 B가 지움). 그 차례가 만든 결과물(판 일·세희 메모·보드 카드)은 자동으로 지우지 말고 "이 대화로 생긴 것 N개도 지울까요?".
  4. 창구: on('turnRemoved', {ats:[…]}) · on('regen', {oldAt, newAt}) — B 가 b_vis 카드를 지우거나 새 답으로 옮긴다.
  5. 참고: 계정 서버 D1 은 무료 요금제에서 7일치 되돌리기 기록(Time Travel)을 따로 둔다. 세희는 그걸 읽지 않으니 '기억'에는 안 들어가지만, 서버 어딘가에 며칠 남는다는 건 보스에게 한 줄 알려 두면 좋음.
- 왜: 보스 16:27·16:32 — "채팅에 재응답 기능이 필요", "재응답은 이전 응답을 참조해서는 안 되고, 보냈던 채팅을 삭제할 수도 있어야 한다(삭제한 건 기억도 하면 안 됨)".
- 받는 쪽에게 필요한 일: 위 설계로 본체에 재응답·삭제. 순서는 보스가 정함(15:25 사진 1·2번과의 앞뒤).
- 관련 파일·버전: 본체 v1.4.1 (retryLast·undoAction·toMessages·saveLog) / B0.7.1

처리함: 2026-11-13 · from-main 「B 파일 긴급 수정(B0.7.1) + SEHEE.og 열림」 → B0.7.1 그대로 이어받음(메인이 한 og 우선·한 줄만 = B 가 하려던 것과 같음)

## 2026-11-13 16:40 · B0.7 — 출처 화면 캡처 카드 · [참고] · 받는 쪽: 메인
- 무엇: 세희가 웹 검색 출처(m.src)로 답하면 출처 페이지 화면 캡처를 '출처 화면' 카드로 말풍선에 붙인다. 캡처는 WordPress.com mShots(https://s0.wp.com/mshots/v1/주소?w=&h=, 키 없음, 무료·비상업용) 그림 주소를 img 로 거는 것뿐이라 서버 일 없음. 처음엔 '만드는 중' 그림이 와서 6초·14초 뒤 다시 부른다. b_visual web 도 og 창구가 없으면 캡처로.
- 왜: 보스 — 쇼핑 상품(무설탕 비타민 캔디)에 출처 글씨만 나오고 사진이 없었음. 위키에는 쇼핑 상품 사진이 없다.
- 받는 쪽에게 필요한 일: 없음, 참고. 앱을 지인에게 내거나 팔게 되면 mShots 는 비상업용이라 바꿔야 한다 — 그땐 SEHEE.og(15:25 요청 3번, 상품 대표 사진)가 정식 길. 출처 주소(공개 검색 결과 주소)만 WordPress.com 으로 간다.
- 관련 파일·버전: sehee/bonus/bonus.js B0.7 / 본체 v1.4.0 / C0.1 같이 켜서 회귀(폰·컴퓨터, 오류 0)

## 2026-11-13 16:25 · B0.6 — 다른 주제면 사무실로 + 물건 사진 자동 카드 · [보통] · 받는 쪽: 메인
- 무엇: ① 세희 도구 b_to_office + 지침(지금 열린 서랍을 알려 주고, 그 서랍과 상관없는 말이면 먼저 부르게). 판이면 goView('office'), 사무실 서랍이면 closeDrawer(). 자료 카드가 붙는 답이면 서랍에 있어도 사무실로. ② 세희가 웹 검색 출처(m.src)로 답했는데 카드가 없으면, 보너스가 출처 제목으로 위키백과·위키미디어 공용 사진을 찾아 제목 낱말이 맞을 때만 자동으로 붙임(날씨·뉴스·환율 등 건너뜀). b_visual web 은 og 창구가 없으면 query(모델명)로 위키·사진을 대신 찾음.
- 왜: 보스 요청 — 판을 연 채 "이거 원가 얼마냐? 제품정보좀 찾아봐" 했을 때 사무실로 돌아오고, 갤럭시 탭 A7 Lite 같은 물건이면 사진이 확실히 붙게.
- 받는 쪽에게 필요한 일: 창구 SEHEE.drawer() → 'cal'|'board'|'people'|null (사무실 안에서 지금 열린 서랍). 지금은 body.dw-on 과 #dwTabs button.on 을 읽는다. 생기면 바로 그리로. 그리고 15:25 [급함] 1번(사진을 이미지 그대로)이 되면 세희가 사진 속 물건을 직접 알아봐서 자동 카드가 더 정확해진다.
- 관련 파일·버전: sehee/bonus/bonus.js B0.6 / 본체 v1.4.0 / C0.1 같이 켜서 회귀(폰·컴퓨터, 오류 0)

## 2026-11-13 15:40 · B0.5.1 — 판 견출지 다시 넘어감 막기 + 세 방 체제 확인 · [참고] · 받는 쪽: 메인
- 무엇: from-main 14:55 참고 사항 처리. 화면이 바뀔 때(view 알림·마우스 떼기) 마우스가 이미 #panDw 위에 있으면, 견출지 밖으로 한 번 나갔다 들어올 때까지 마우스 올리기로 넘어가지 않는다. 본체 v1.4.0 + 보너스 C0.1 을 같이 켜고 B 기능 전부 회귀(폰·컴퓨터, 오류 0), B 끔 상태도 확인.
- 왜: 견출지로 서랍을 닫고 판으로 돌아온 직후 다시 사무실로 튀는 것 막기.
- 받는 쪽에게 필요한 일: 없음, 참고. 다만 인수인계 v2 기준으로 B 가 아직 본체 화면을 직접 읽는 곳을 적어 둔다(창구가 생기면 하나씩 뺀다): #ppMap·#ppScroll·#ppCenter·#people·#dw-people(사진 끌기·확대·대화 상자 자리), #panDw(마우스 올리기), #log 의 i번째 자식(자료 카드 → addMsgPart 요청 중). 이 id 들을 바꿀 땐 from-main 에 한 줄 남겨 주면 바로 맞춘다.
- 관련 파일·버전: sehee/bonus/bonus.js B0.5.1 / 본체 v1.4.0 / C0.1

처리함: 2026-11-13 · from-main 「판이 왼쪽 서랍으로 바뀜 + B0.4 답(본체 v1.3.8)」의 참고(견출지 마우스 올리기 다시 넘어감) → B0.5.1

## 2026-11-13 15:25 · 사진을 세희가 직접 보기 + 보스 사진 크게 + 자료 카드 창구 · [급함]
- 무엇: 보스가 펜 사진 한 장을 올리고 "이 제품 상품명 찾아볼 수 있나" 했는데, 세희가 사진 속 펜이 아니라 뒤에 놓인 교재 표지 글자(해커스 리딩 스마트)로 답했다. 지금 사진은 전부 카톡 캡처 해독 길로 가서 해독본 글자만 세희에게 넘어가고, 사진 자체는 안 넘어간다(userContent 는 m.ocr 만 붙임). 썸네일(O.thumbs)은 메모리에만 있어 앱을 다시 켜면 "📷 캡처 1장" 글씨만 남는다.
- 왜: 보스 요청 — "세희도 사진·시각자료를 같이 보여 줬으면(GPT처럼), 내 사진도 크게". 보스 승인함(매번은 아니고, 비슷한 거라도 보여 주기).
- 상대에게 필요한 일:
  1. [급함] 사진을 세희 머리에 이미지 그대로 넘기기. 휴대폰 화면 캡처(세로로 긴 화면 비율)는 지금처럼 해독, 그 밖의 사진은 이미지로(Haiku·Sonnet 둘 다 봄). 보스가 말풍선에서 "사진으로 보기 / 캡처로 읽기"를 바꿀 수 있으면 더 좋음. 사진을 본 세희가 특징(예: 판다 토퍼·민트 몸통·아이보리 그립)으로 검색하게 지침 한 줄.
  2. 보스 사진 크게: 말풍선 안 사진을 폭 70% 정도로, 누르면 전체 화면 + 두 손가락 확대. 다시 켜도 남게 1280px 정도로 줄인 사본을 기기 IndexedDB 에 — 계정 서버 chat 칸에는 넣지 않기(그 칸 하나가 2MB 한도에 걸릴 수 있음).
  3. 창구 SEHEE.og(url) → Promise<{img,title,site}|null>: 계정 서버(sehee-sync)에 GET /og?u= (로그인 토큰 필요) — 그 페이지 HTML 앞부분(200KB까지)을 받아 og:image·twitter:image·title 을 뽑아 돌려준다. 상대 주소면 절대 주소로. 보너스 b_visual(kind:'web')이 이걸로 쇼핑몰·블로그 대표 사진 카드를 만든다. 창구가 생기면 보너스는 고칠 것 없이 자동으로 씀.
  4. (보통) 창구 SEHEE.addMsgPart(fn(m,i) → html) + 사람·보드 대화 상자에도 같은 붙임. 지금은 보너스가 #log 의 i 번째 자식 = O.log[i] 로 보고 말풍선 time 앞에 .b-vis 를 끼워 넣는다(MutationObserver). 창구가 생기면 그리로 옮긴다.
- 참고: B0.5 b_visual 도구 — kind photo(위키미디어 공용)·wiki(위키백과)·web(위 3번)·chart(막대·꺾은선 SVG). 카드 기록은 b_vis(동기화, 최근 60개 답). 세희 지침: 생김새·물건·상품·장소·숫자 비교일 때만, 같은 게 없으면 similar:true.
- 관련 파일·버전: sehee/bonus/bonus.js B0.5 / 본체 v1.3.8 위에서 회귀 확인(오류 0)

처리함: 2026-11-13 · to-bonus 「판이 왼쪽 서랍으로 바뀜 + B0.4 답(v1.3.8)」 → B0.5 에서 굴림 되돌리기는 예전 본체만, pplZoom 사용

## 2026-11-13 14:40 · B0.4 올림 — 새 창구로 옮김 + 인간관계 판 확대·이동 + 판 견출지 마우스 올리기 · [참고]
- 무엇: 사진 자리는 pplPosAll·pplPos·pplRedraw 로 본체가 그린다(끄는 동안의 미리 보기만 보너스가 카드·실을 움직임). 대화창은 SEHEE.talk·on('talk'). 판 #panDw 에 마우스를 올리면 0.12초 뒤 SEHEE.goView(k). 인간관계 판 확대·이동(폰 두 손가락, 컴퓨터 휠·휠 버튼 손바닥)은 #ppMap 의 zoom 과 #ppScroll 굴림을 보너스가 바꾸고, on('people') 뒤에 보던 배율·자리를 다시 씌운다. 서랍을 새로 열거나 #ppCenter 를 누르면 본체 배율로 돌려준다.
- 왜: 보스 요청.
- 상대에게 필요한 일: 없음, 참고. 다만 본체에서 본 것 두 가지(보너스 끔 상태에서도 같음):
  1. 컴퓨터 틀(1366×860)에서 goView(서랍) 하면 주소에 #office 가 붙는 순간 브라우저가 #office 칸으로 문서를 36px 굴려 서랍 머리가 잘린다(scrollY 36). 보너스는 넘어간 뒤 scrollTo 로 되돌리는 중. 본체 goView 쪽에서 막아 주면 보너스 되돌리기는 뺀다.
  2. 컴퓨터에서 판 옆면(#panGrip)을 마우스로 끌어 사무실로 간 뒤, goView('pan') 으로 돌아와 같은 옆면 아래쪽(y≈564)을 다시 끌면 사무실로 안 넘어간다(위쪽 y≈300 은 됨). v1.3.3 에서 확인, v1.3.6 에서는 다시 안 봄.
  3. 창구 하나 더(급하지 않음): 인간관계 판 배율을 본체가 다시 그릴 때 지켜 주는 SEHEE.pplZoom(k|null) 이 있으면 보너스의 '다시 씌우기'를 뺄 수 있다.
- 관련 파일·버전: sehee/bonus/bonus.js B0.4 / 본체 v1.3.6 위에서 회귀 확인(오류 0)

처리함: 2026-11-13 · to-bonus 「창구 요청 3가지 다 열림(본체 v1.3.5)」 → B0.3·B0.4 에서 옮김

## 2026-11-13 13:40 · 창구 요청 3가지 (인간관계 판 B0.2 때문에) · [보통]
- 무엇: B0.2에서 인간관계 판 사진 카드를 꾹 눌러 옮기기 + 판 아래 게임식 대화창을 넣었다. 창구에 없는 부분은 지금 인간관계 판 화면(#ppMap·#people·#dw-people·#ppScroll·#ppCenter, .pp-node·.pp-str·.pp-lk)을 직접 읽어서 맞췄다. 못 찾으면 조용히 쉰다.
- 왜: 보스 요청. 다만 이대로면 메인이 인간관계 판 속을 바꾸면 보너스가 조용히 멈춘다. 아래 창구가 생기면 보너스를 거기로 옮기고 화면 직접 읽기는 뺀다.
- 상대에게 필요한 일:
  1. b_ 로 시작하는 kv 키도 계정 동기화에 넣어 주기(지금 SYNC_KV 목록에 없어서 b_ppPos 가 기기마다 따로). 가장 급함.
  2. SEHEE.talk(빈칸글) → { html, face } (talkHtml 그대로, 다시 시도·고르기 단추 포함) 와 on('talk') — 대화창 내용이 바뀔 때. 지금은 로그만 보고 흉내 내서 실시간 글자·고르기 단추·다시 시도가 빠짐.
  3. on('people') — 인간관계 판을 다시 그린 직후. 가능하면 SEHEE.pplPos(id) 덮어쓰기 자리(보너스가 {x,y} 비율을 주면 본체가 그 자리로 그리고 실도 그쪽으로). 그러면 보너스가 실을 다시 그릴 필요가 없어진다.
- 관련 파일·버전: sehee/bonus/bonus.js B0.2 / 본체 v1.3.3

처리함: 2026-11-13 · 보너스 자리 열림, 시작해도 됨 (B0.2부터 보너스 시작)

## 변경 기록
| 버전 | 날짜 | 바뀐 것 |
| --- | --- | --- |
| v1 | 2026-11-13 | 빈 통로 |
| v1.1 | 2026-11-13 | 첫 항목: 창구 요청 3가지(B0.2) |
| v1.2 | 2026-11-13 | B0.4 알림, 본체에서 본 것 2가지, pplZoom 창구 제안 |
| v1.3 | 2026-11-13 | 사진 직접 보기·사진 크게·og/addMsgPart 창구 요청(B0.5) |
| v2.1 | 2026-11-13 | 세 방 체제(from-b) 첫 항목: 지금 맡은 일 채움, B0.5.1 |
| v2.2 | 2026-11-13 | B0.6 알림, SEHEE.drawer 창구 요청 |
| v2.3 | 2026-11-13 | B0.7 출처 화면 캡처 알림 |
| v2.4 | 2026-11-13 | 재응답·삭제 요청(보스 요구 + 차례 되감기 구조), B0.7.1 처리함 |
| v3.0 | 2026-11-13 | v3 세 방 동등 — 찜은 할일.md, 이 파일은 알림만. 본체 v1.5.2 알림 |
