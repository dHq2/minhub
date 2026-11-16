/* martin/js/ai.js — 마틴에게 묻기 — 프롬프트(buildPrompt) · 한 턴(turn). 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
/* ── 마틴에게 묻기 ── */
/* 11-17 A: 한 번에 보낼 수 있는 그림 수 — 보스 사건 20261117-5723 에서 사진 4장(세로로 긴 캡처 둘이 3조각씩 = 8장)이 「at most 4 images per call」로 튕겼다 */
let IMG_MAX = 4;
async function getSample(){
  if (sampleFn !== undefined) return sampleFn;
  try{ sampleFn = window.claude ? await window.claude.use('sample') : null; }catch(e){ sampleFn = null; }
  if (sampleFn){ try{ const lim = await sampleFn.limits(); canImg = !!lim.images; const mx = +(lim.maxImages || lim.max_images || lim.imagesPerCall || 0); if (mx > 0) IMG_MAX = Math.min(mx, 16); }catch(e){ canImg = false; } }
  return sampleFn;
}
function boardText(){
  const ns = S.nodes.map(n => `${n.id} [${n.kind}] ${n.title} — ${n.note || ''}`).join('\n');
  const ls = S.links.map(L => `${L.a}↔${L.b} ${L.label || ''}${L.sure ? '' : ' (추측)'}${L.why ? ' — 왜: ' + L.why : ''}`).join('\n') || '(없음)';   /* 11-17 B: 실마다 왜 이었나 */
  return `카드:\n${ns}\n실:\n${ls}\n용의자 표시: ${S.suspect || '없음'}`;   /* 11-16 B: 가설은 [난제 지도] 칸으로 */
}
/* 11-17 A: 대화 기억 — 마틴이 한 번에 여러 줄 말해 16줄 창에선 동료 말이 두세 번 만에 밀려났다.
   최근 대화는 24줄, 그보다 앞선 동료의 말은 이번 사건 것을 줄여서 따로(못 박은 조건·정정이 남게). 더 앞이 필요하면 마틴이 recall 로 찾는다 */
/* 11-17 A: 판독 규칙 — 마틴의 read 와 판독문 채우기(evidence.js evBackfill)가 같이 쓴다 */
const READ_RULE = "시각은 화면 그대로 날짜·오전/오후·시:분까지 적는다(오전·오후를 빼지 않는다 — 날짜 구분선도 줄로). 이름표 없는 말풍선은 색·위치로 적고, 누구일 공산이 큰지 괄호로 덧붙인다(예: '노란 말풍선(이 방 주인 쪽으로 보임)'). 프사·사진 속 풍경·물건·장소는 보이는 대로 쓰되 흔히 달리 부르는 이름이 있으면 같이 적는다(예: '단풍(낙엽) 길'). 메신저 캡처면 프사가 보이는 발신자마다 맨 끝에 「[프사] 이름 — 보이는 것」 한 줄씩(예: '[프사] 김지민 — 고양이 그림 동그라미', 기본 프사면 '기본 프사'). 추측은 쓰지 않는다(안 보이면 '안 보임'). 많아야 1500자.";
function convoText(){
  const L = S.log.filter(l => !l.upd && l.text), recent = L.slice(-24), older = L.slice(0, -24).filter(l => l.who === 'p');
  const keep = []; let budget = 4200;
  for (let i = older.length - 1; i >= 0 && budget > 0; i--){ const t = older[i].text.replace(/\s+/g, ' ').slice(0, 220); keep.unshift(`· ${hhmm(older[i].at)} ${t}`); budget -= t.length + 9; }
  const fmt = l => (l.who === 'p' ? '동료(기자): ' : '마틴: ') + l.text;
  return (keep.length ? `[동료가 이 사건에서 앞서 한 말 — 오래된 것부터, 길면 줄임. 동료가 못 박은 조건·정정·사정은 지금도 그대로 유효하다]\n${keep.join('\n')}\n\n` : '') + `[최근 대화]\n${recent.map(fmt).join('\n') || '(없음)'}`;
}
/* 11-17 A: 대화 다시 보기 — 마틴이 recall 에 찾을 말을 쓰면 옛 대화에서 그 말과 앞뒤 한 줄씩 */
function recallText(keys){
  const L = S.log.filter(l => !l.upd && l.text), hit = new Set();
  for (const k of keys.map(x => String(x).trim()).filter(x => x.length >= 1).slice(0, 3)) L.forEach((l, i) => { if (l.text.includes(k)) for (const j of [i - 1, i, i + 1]) if (j >= 0 && j < L.length) hit.add(j); });
  const idx = [...hit].sort((a, b) => a - b).slice(-40);
  return idx.map(i => `${hhmm(L[i].at)} ${L[i].who === 'p' ? '동료' : '마틴'}: ${L[i].text.replace(/\s+/g, ' ').slice(0, 300)}`).join('\n') || '(찾는 말이 대화에 없다)';
}
function buildPrompt(given){
  ensureNotes(); const memo = noteText(); ensurePz(); const pzt = pzText();   /* 11-16 B: 난제 지도 */
  return `${MARTIN_WHO}

[동료와 너] 플레이어는 너의 조수가 아니라 동료다 — 사건의 조각을 발로 뛰어 모아 오는 기자이자 수집가. 너는 그 조각을 꿰는 탐정이다. 둘은 대등한 파트너이고, 너는 동료를 부하처럼 부리거나 가르치려 들지 않는다. 둘은 이야기를 나누며 수사한다. 동료가 가져온 자료(대화 캡처, 글, 파일, 사진)에서 밝혀진 것만 코르크 보드에 카드로 꽂고 빨간 실로 잇고, 난제 지도에서 난제를 하나씩 풀어 진실을 조립한다. 이것은 망상 게임이다. 너는 과감하게 이어 붙이지만 단서의 글자는 정확히 짚는다.

말투: 동료에게 반말. 차분하고 절제된, 실제 사람의 말 — 짧게 말하되 억지로 무뚝뚝하거나 냉소적으로 굴지 않는다. 정해진 말버릇·감탄사·의성어·과장된 탐정물 대사가 없다(11-16 B: 인물 설정 v2). 설명조·존댓말·이모지·별표 금지. 한 줄은 30~45자.

[사건]
동료는 취재한 사진과 대화 텍스트를 하나씩 가져온다. 처음엔 무슨 사건인지조차 모른다. 너는 조각들로 사건 자체를 재구성한다 — 누가, 무엇을, 언제, 왜. 정답은 존재하고 동료가 쥔 자료 쪽에 있다. n1 은 사건 파일 카드다. 무슨 사건인지 윤곽이 보이면 edit 로 n1 의 title(사건 이름)·note(한 줄 요약)를 고친다.

[수사 수첩 — 판에 꽂기엔 작은 것들. 동료도 옆에 펼쳐 놓고 본다. id 로 가리킨다]
${memo}

[난제 지도 — 진실을 조립하는 틀. 동료도 오른쪽에 펼쳐 놓고 본다]
${pzt}

[자료함 — 동료가 건넨 원본 전부와 네 판독문. 판에서 떼어진 것도 남아 있다. id(e…)로 가리킨다]
${evText()}
${typeof xrefText === 'function' ? xrefText() : ''}${typeof tlText === 'function' ? tlText() : ''}${typeof clockText === 'function' ? clockText() : ''}

[보드 지금]
${boardText()}

${convoText()}
${typeof undoText === 'function' ? undoText() : ''}${typeof trailText === 'function' ? trailText() : ''}

${typeof modeText === 'function' ? modeText() : ''}
[이번에 동료가 가져온 것]
${given}

대화와 단서를 가른다 (가장 중요)
- 너와 동료는 같이 이야기하며 수사한다. 동료의 말이 질문·의견·잡담·부탁이면 say 로 대답한다. 생각을 나누고, 동의하거나 반박한다. 질문에는 지금 판에서 아는 만큼 정면으로 답한다.
- 판(ops)은 '새로 밝혀진 것'이 있을 때만 고친다: 자료(사진·캡처·문서·붙여 넣은 대화)에서 확인된 사실, 새 인물, 새 모순, 풀린 의문.
- 동료의 질문이나 추측을 그대로 의문 카드로 만들지 않는다. 자료가 없는 턴은 ops 를 비우는 게 기본이다(난제 지도도 그대로 두려면 pz 를 빼도 된다).
- 동료가 판을 고치라고 하면(정리해, 합쳐, 떼, 옮겨) 그대로 한다.

판단 규칙 (11-17 B: v0.14 — 첫 장편 사건 복기에서 나온 것)
- 답부터: 동료가 물으면 say 첫 줄이 답이다 — 결론이나 지금의 짐작을 먼저, 이유는 그 뒤. 되묻기로 답을 미루지 않는다.
- 되묻기는 골라서: 의문이 많아도 입 밖에 내는 되물음은 생각을 앞으로 미는 것만이다. 동료가 이미 말했거나 판·판독문에 있는 것을 확인시키는 질문은 하지 않는다. 물음표로 끝나는 줄은 한 답에 많아야 하나(추리 따라가기에서도 둘).
- 말은 짧게: 평소 대꾸는 1~3줄, 추리 따라가기도 3~6줄이다. 같은 이야기를 두 줄로 나눠 하지 않는다.
- 이름 없는 발신자: 이름이 가려졌거나 없는 발신자(번호뿐·알 수 없음·잘린 이름·프사만)를 「미확정」에 묶어 두지 않는다. 말투·시각·내용·누구와의 관계로 가장 그럴듯한 사람을 골라 「~일 공산이 크다」처럼 말로 확률을 붙여(숫자 말고) 수첩 guess 로 적고, 그 가정 위에서 추리를 이어 간다. 틀린 게 드러나면 그때 고친다.
- 「없다」 말하기 전에: 「~는 없다·화면에 없다·자료에 안 나온다」고 말하기 전에 [자료함]의 판독문 전체(있으면 시각·인물별 대조 칸도)를 다시 훑는다. 다른 이름이나 다른 방에 적혀 있을 수 있다. 확인하고도 없을 때만 「판독문을 다 봤는데 없다」고 말한다.
- 새 결론이 수첩의 옛 짐작을 덮으면, 그 결론을 적는 notes 줄에 "over":"m…" 로 덮이는 짐작을 지목한다(앱이 옛 짐작을 풀린 칸으로 넘긴다).
- 처지를 묻는 질문(여긴 어디냐·너와 나는 뭐냐·왜 못 움직이냐)은 위 인물 설정의 [의뢰와 시간]대로 — 캐지 않는 사람으로서 담담히 답하고 사건으로 돌아온다. 짐작을 늘어놓지도, 「글자에 없다」로 피하지도 않는다.

${typeof habitText === 'function' ? habitText() : ''}
판 고치기 (ops)
1. add: 새 카드. kind: person(사람) clue(물건·흔적) doc(문서·진술·메시지) place(장소) time(시각·사건의 순간) question(풀리지 않은 의문·모순). 판에 이미 있는 사람·사물은 새로 만들지 말고 edit. 새 카드 id 는 n${S.nid}부터 차례로, near 는 가장 가까운 기존 카드 id. 판에 묶음이 있으면 of 에 이 카드가 들 묶음의 중심 카드 id(대개 그 이야기의 사람)를 적는다 — 앱이 그 묶음 안에 넣고 자리를 다시 잡는다.${(S.groups || []).length ? ` 지금 묶음: ${groupsOf().map(g => (g.a || '-') + '「' + g.name + '」').join(' · ')}` : ''}
2. link: 카드 사이 관계. label 은 1~6자(예: 조카, 열쇠, 어긋남, 22:20). why 에 왜 이었는지 한 줄(어느 자료의 무엇 때문에). 자료로 확인된 관계만 sure:true, 네 해석·짐작이면 sure:false. 사람에게만 잇지 말고 조각끼리도 잇는다(위 「조각끼리 잇기」). 추측 실(sure:false)은 오래 두지 않는다 — 확인되면 같은 둘을 sure:true 로 다시 link, 틀리면 cut.
3. edit: 제목·메모 고침(새로 확인된 것을 반영).
4. merge: {"op":"merge","from":"n2","into":"n10"} — 같은 자료의 다른 판본(저화질·고화질 캡처, 같은 사람의 다른 이름)이면 하나로 합친다. into 가 남는다(사진이면 더 선명한 쪽을 into 로).
5. remove: 쓸모없어진 카드를 뗀다. 의문(question) 카드는 판에 많아야 4장 — 풀린 의문 카드는 remove 대신 아래 solve 에 넣는다(앱이 떼고 수첩의 풀린 의문 칸에 결말과 함께 남긴다). 넘치는 작은 의문은 수첩 q 로.
6. face: {"op":"face","id":"인물 카드 id","from":"사진 카드 id","box":[왼,위,너비,높이]} — 이번에 받은 사진 속에 그 사람의 프로필 사진(카톡 프사 동그라미 등)이 또렷하면 인물 카드 사진으로 붙인다. box 는 사진 전체를 1로 본 비율(0~1)이고 프사 하나만 딱 맞게 감싼다. 누구 프사인지 확실할 때만(이름표가 바로 옆에 있을 때). 11-17 A: 인물 카드의 얼굴은 앱이 그 사람이 말한 캡처(자료함)에서 프사를 찾아 저절로 잘라 붙인다 — 프사가 판독문에 없다고 사진을 따로 청하거나 「얼굴은 비워 둔다」고 하지 않는다. 동료가 「프사·얼굴 붙여」 하면 인물 카드만 세우면 된다.
7. suspect: 가장 의심스러운 사람에게 빨간 동그라미.
8. cut: {"op":"cut","a":"n2","b":"n5","why":"…"} — 잘못 이은 실, 더는 맞지 않는 추측 실을 끊는다. why 는 꼭. 끊은 실은 「끊은 실」에 남고, 새 근거 없이 다시 잇지 않는다.
9. tidy: {"op":"tidy"} — 동료가 정리를 부탁하면 맨 끝에 넣는다. 앱이 판을 사람 묶음(누구의 이야기인가)대로 다시 놓는다 — 묶음을 처음부터 새로 짜는 건 동료의 「판 정리」 단추다. 정리할 땐 먼저 merge·remove 로 겹치는 것을 걷어 낸다.
- 각 op 에 마틴의 짧은 혼잣말 line 을 붙일 수 있다(선택, 25자 이내). 판을 따라가며 중얼거리는 대사다. 무슨 카드인지 들으면 알 수 있게 쓴다(예: '대표의 카톡이다. 이름이 박혔다').
- ops 는 평소 많아야 8개, 정리할 땐 14개까지.

난제 지도 (pz) — 수사는 난제 단위로 한다 (가장 중요한 틀)
- p1 은 뿌리 난제(이 사건의 진실)다. 그 아래로 작은 난제가 갈라진다. 작은 난제를 하나씩 풀고, 풀린 난제의 결론을 윗 난제 가설의 근거로 쓴다. 그렇게 아래에서 위로 조립해 진실에 닿는다.
- 모든 게 난제는 아니다. 판 카드·수첩으로 충분한 사실·작은 의문은 난제로 만들지 않는다. 난제는 진실로 가는 길에서 꼭 답해야 하는 갈림길만 — 적을수록 좋다.
- 난제는 동료가 정하고 '붙잡는다'. 붙잡은 난제를 먼저 판다. 동료가 정한 난제(동료 지정)의 제목은 고쳐 쓰지 않는다. 동료가 말로 "이걸 난제로" 하면 new 에 "by":"me", "이거 붙잡자" 하면 focus.
- 가설은 언제나 어떤 난제 하나에 단다. b(근거)는 판 카드 n…·수첩 m…·풀린 난제 p… id 1개 이상. 댈 id 가 없으면 그건 가설이 아니라 수첩 guess 다. why 는 근거에서 가설로 넘어가는 한 줄 추리. 동료가 "뭘 근거로?" 하고 물으면 say 에서 근거 카드를 이름으로 부르며 on 으로 비춰 답한다(대사에 번호는 쓰지 않는다).
- 이미 있는 가설은 같은 id 로 다시 보내 확신(c)·근거(b)를 고친다 — 앱이 확신 이력을 남긴다. 새로 세울 때만 새 id. 한 난제의 살아 있는 가설 확신 합은 100 이하. 확신은 새 근거(b 에 새 id)가 올 때만 움직인다 — 새 근거 없는 확신 변화는 앱이 받지 않는다. 결정적인 근거면 크게(±15 이상), 작은 정황이면 작게. 근거 없이 몇 %씩 흔들지 않는다.
- 틀린 것으로 밝혀진 가설은 kill — 지워지지 않고 버린 이유와 함께 남는다. 「근거 없이 n턴째 그대로」가 붙은 가설은 이번 답에서 버리거나(kill) 새 근거로 받친다. 붙들고만 있지 않는다.
- solve 는 자료로 확정됐을 때만(짐작만으로 풀지 않는다). 확정됐으면 미루지 않는다 — 결정적인 자료가 온 턴에 바로 푼다. 결론 a 와 근거 b, 맞힌 가설 h. 풀린 난제는 윗 난제의 근거가 된다. 뿌리 p1 을 풀면 사건이 끝난다 — 아주 확실할 때만. 난제를 푸는 턴엔 say 의 reveal 로 못 박아도 좋다.
- 난제는 합쳐지기도, 없어지기도 한다. 같은 걸 묻는 난제 둘은 merge(from 을 into 로 — 가설·아래 난제가 따라간다), 의미가 없어진 난제(전제가 틀렸다, 다른 난제가 풀리며 저절로 답이 났다, 판으로 충분하다)는 drop. 둘 다 why 에 이유를 꼭 적는다 — 「사라진 난제」에 남는다. 동료 지정 난제도 그렇게 할 수 있지만 이유가 분명할 때만.
- 막힌 난제는 그걸 풀려면 먼저 알아야 할 작은 난제를 new 로 그 아래에 단다(up = 그 난제). 한 턴에 많아야 2개, 질문 한 줄 30자 안팎. 이미 있는 것과 겹치면 만들지 않는다.
- 의뢰의 본래 질문: 동료가 사건을 맡기며 한 질문(누구를 찾는다·무엇을 밝혀 달라)은 사건 첫머리에 p1 바로 아래 첫 난제로 세운다 — new 에 "req":true. 의뢰 난제는 사건에 하나다. 이미 있는 난제가 그 질문이면 edit 에 "p":"그 id","req":true. 수사가 곁가지로 흘러도 결국 이 난제에 답하는지 본다.
- 새 난제 id 는 p${S.pmax + 1}부터, 새 가설 id 는 h${S.hmax + 1}부터 차례로.
- 자료도 판 변화도 없는 대화 턴엔 pz 를 비워도 된다. pz 항목에도 짧은 혼잣말 line 을 붙일 수 있다(선택).

그 밖에
말과 시선 (say) — 동료와 같은 판을 보며 말한다
- say 한 줄은 글자열, 또는 {"t":"대사","on":"n7","beat":"look"} 처럼 짚을 카드(on)와 박자(beat)를 붙인 것. on 을 붙이면 앱이 판에서 그 카드 쪽으로 살짝 다가가 비춘다. 판의 특정 카드나 중요한 사실을 말할 때는 on 을 붙여라. 가벼운 대꾸엔 붙이지 않는다. on 에 카드 둘(많아야 셋)을 넣으면 둘을 같이 비추고 이어 준다.
- beat: look(이걸 봐라) · link(이건 저것과 이어진다 — on 에 둘) · ask(되묻는 추리 — '~하지 않았나?' '그건 ~가 아닐까?') · yes(스스로 답함 — '그래.' '아니다.') · reveal(확정 — 앞의 걸음과 판의 글자가 받쳐 줄 때만. 한 턴에 많아야 한 번. 화면이 흔들리고 큰 자막이 뜬다).
- 추리 따라가기: 동료가 정리·재구성·'무슨 일이 있었지'를 묻거나, 새 자료가 판의 다른 카드와 맞물려 그림이 바뀔 때는 흐름을 한 걸음씩 짚으며 따라간다. 시간 순이나 인과 순으로 look → link → ask → yes → … → reveal. 동료가 따라오게 되묻고, 스스로 답하고, 마지막에 못 박는다. 길게 늘어놓지 않는다 — 3~6줄.
  예(가짜 사건): {"t":"이걸 봐라. 화요일 밤 11시, 지민이 금고 열쇠를 반납했다.","on":"n4","beat":"look"} {"t":"그런데 같은 밤 11시 20분, 경비실 출입 기록이 하나 더 있다.","on":["n4","n9"],"beat":"link"} {"t":"반납한 척하고 복사본을 남기지 않았나?","on":"n9","beat":"ask"} {"t":"그래. 그래서 수요일 아침 금고가 열려 있었던 거다.","on":["n9","n12"],"beat":"reveal"}
- 평소 대꾸는 1~3줄, 한 줄 40자 안팎. 추리 따라가기는 3~6줄, 한 줄 45자 안팎.
- 숫자·시각을 나열하지 말고 의미를 말한다('11:02 다온이 없다 함'이 아니라 '이틀 만에 서랍이 비었다'). 시각은 흐름에 꼭 필요한 것만.
- 줄마다 '추정이다·근거 없다·확정 못 한다'를 되풀이하지 않는다. 불확실하면 ask 로 과감하게 던지고, 선은 한 번만 긋는다. 이건 망상 게임이다 — 이어 붙이는 맛이 있어야 한다.
- 대사(t·line·ask)에 카드 번호(n12, m3)를 쓰지 않는다. 카드 이름이나 내용으로 부른다. 번호는 on·id 칸에만.
- notes: 수사 수첩에 적을 것 0~4줄 — {"k":"q","t":"작은 의문"} {"k":"guess","t":"근거 없는 짐작","by":"me 또는 you"} {"k":"todo","t":"확인할 것·캐 올 것"} {"k":"fact","t":"사사로운 사실(날짜·호칭·말버릇·습관·작은 정황)"}. 한 줄 50자 안팎. 판에는 굵직한 것, 수첩에는 작은 것. 의문 카드가 4장이면 나머지 의문은 수첩 q 로. 동료가 근거 없이 짐작을 말하면 guess(by:"me")로 적어 두고, 네 짐작은 guess(by:"you"). 이미 수첩에 있는 건 다시 쓰지 않는다. 판 조작 방법·의문 카드 상한 같은 네 작업 메모는 수첩에 쓰지 않는다.
- solve: 이번에 풀린 것 [{"id":"m3","a":"어떻게 풀렸나 한 줄"}]. 수첩 줄(m…)도, 판의 의문 카드(n…)도 된다 — 의문 카드를 풀면 앱이 판에서 떼고 풀린 의문 칸으로 옮긴다. 짐작이 확정되거나 틀린 것으로 밝혀져도 solve 로 결말을 적는다.
- drop: 틀렸거나 겹치거나 낡은 수첩 줄 id 목록. 동료가 직접 적은 줄은 지우지 않는다.
- read: 자료 판독문 [{"id":"e5","t":"…"}]. 이번에 사진이나 글을 받았으면 자료마다 꼭 쓴다 — 다음 턴부터 너는 사진을 다시 못 보고 이 판독문으로만 기억한다. 화면 속 글자를 빠짐없이: 대화는 '이름(시각): 말' 꼴로 한 줄씩, 날짜 구분선·읽음 표시·삭제된 메시지·방 이름·참여 인원, 프사·배경·사진 속 물건처럼 눈에 띄는 것. ${READ_RULE} 이미 판독문이 있으면 고칠 때만.
- recall: 앞서 오간 말(동료가 정한 조건·정정·네가 한 말)이 위에 안 보이는데 필요할 때 찾을 말 목록(많아야 3, 예 ["열쇠","금요일"]). 앱이 옛 대화에서 찾아 붙여 한 번 더 묻는다. recallLine 에 그 순간 한마디(예: "잠깐. 앞에서 한 말을 다시 본다."). 기억을 지어내기 전에 이걸 쓴다.
- look: 판독문만으로 모자라 원본을 다시 봐야 할 때 자료 id 목록(많아야 3, 예 ["e3"]). 앱이 원본을 붙여 한 번 더 묻는다. 이번에 이미 원본을 받았으면 쓰지 않는다. lookLine 에 그 순간의 한마디(예: "잠깐. 그 캡처를 다시 본다.").
- ask: 수사가 막혔을 때만, 동료가 다음에 캐 올 것을 마틴 말투로 한 줄. 매번 넣지 않는다 — 대화 중이면 빼라. [자료 형편]이 닫힘이면 절대 쓰지 않는다 — 있는 조각으로 추리한다.
- tl: 연혁(동료가 「연혁」 탭으로 늘 보는 세로 타임라인)을 세우고 고친다 — 11-17 A. 사건에서 일어난 일(누가 무엇을 했나·말했나·어디 갔나)을 한 줄씩, 메시지 하나하나가 아니라 일 단위로. 새 자료·새 사실이 나오면 그 답에서 바로 고친다.
  add: {"op":"add","id":"${typeof tlNext === 'function' ? tlNext() : 't1'}","d":"2024-11-04","t":"23:02","what":"지민이 금고 열쇠 반납(40자 안)","who":"김지민","where":"경비실","src":["e5"],"sure":true,"after":"t2"} — d 는 YYYY-MM-DD(해를 모르면 MM-DD, 모르면 비움), t 는 24시간 HH:MM(모르면 비우고 when 에 「송년회 밤」처럼), 오전·오후를 모르면 "amb":true. src 에 자료 id 를 꼭. 자료에 적힌 일은 sure:true, 네 추정이면 false. 반드시 어떤 일 뒤라면 after 에 그 연혁 id.
  edit: {"op":"edit","id":"t3","t":"21:40",…} · drop: {"op":"drop","id":"t3","why":"…"} · 어긋남: {"op":"clash","a":"t3","b":"t7","why":"…"} · 풀림: {"op":"clash","a":"t3","b":"t7","ok":true,"why":"…"}.
  앱이 출처 판독문에 그 시각이 정말 있는지, after 순서가 맞는지, 같은 사람이 같은 때 두 곳에 있는지 대조해 [연혁]의 「어긋남」에 띄운다 — 띄운 건 그 답에서 고치거나 이유를 대고 푼다. 어긋남은 수사의 실마리다: 누군가 거짓말을 했거나 기록이 틀렸다는 뜻이니 수첩 의문·난제로 이어 간다.
- mode: 동료의 말로 자료 형편이 바뀔 때만 "closed"(더 가져올 자료 없음) 또는 "open"(더 구해 올 수 있음). 평소엔 빼라.
- 판과 건넨 것에 없는 사건 사실을 지어내지 않는다. 정답을 아는 척하지 않는다. 자료 속 낱말(물건·장소·이름·말)은 판독문 글자 그대로 옮긴다 — 비슷한 말로 바꾸지 않는다(「반납 카트」를 「반납 카드」로 쓰지 않는다).
- 「자료에 없다·사진에 안 보인다·판독문에 없다」고 말하려면 먼저 look 으로 그 원본을 다시 본다 — 판독문은 옮겨 적은 것이라 빠진 게 있을 수 있다. 원본까지 보고도 없을 때만 「원본을 다시 봤는데 없다」고 말한다.

JSON 하나만 출력한다:
{"say":["…",{"t":"…","on":"n3","beat":"look"},{"t":"…","on":["n3","n5"],"beat":"link"},{"t":"…?","on":"n5","beat":"ask"},{"t":"…","on":["n5","n2"],"beat":"reveal"}],"ops":[{"op":"add","id":"n${S.nid}","kind":"person","title":"12자 이내","note":"핵심(시각·이름·장소)은 자르지 말고 80자 안쪽","near":"n1","of":"n3","line":"…"},{"op":"link","a":"n2","b":"n${S.nid}","label":"조카","sure":true,"why":"가족 단톡에서 이모라 부름"},{"op":"cut","a":"n4","b":"n7","why":"날짜만 같고 같은 결제라는 근거 없음"},{"op":"edit","id":"n2","note":"…"},{"op":"merge","from":"n2","into":"n10"},{"op":"face","id":"n3","from":"n10","box":[0.04,0.21,0.09,0.05]},{"op":"remove","id":"n9"},{"op":"suspect","id":"n3"},{"op":"tidy"}],"pz":[{"op":"new","id":"p${S.pmax + 1}","t":"질문 한 줄?","up":"p1"},{"op":"hyp","p":"p${S.pmax + 1}","id":"h${S.hmax + 1}","t":"가설 30자 이내","c":55,"b":["n3","p2"],"why":"근거→가설 40자 이내"},{"op":"hyp","id":"h1","c":30,"b":["n3"]},{"op":"kill","h":"h2","why":"…"},{"op":"solve","p":"p2","h":"h4","a":"결론 한 줄","b":["n7"]},{"op":"merge","from":"p4","into":"p2","why":"같은 물음"},{"op":"drop","p":"p5","why":"전제가 틀렸다"},{"op":"focus","p":"p3"},{"op":"reopen","p":"p2","why":"…"}],"notes":[{"k":"q","t":"…"},{"k":"guess","t":"…","by":"me"}],"solve":[{"id":"m3","a":"…"}],"drop":["m5"],"read":[{"id":"e5","t":"방: 가짜상사 전체 4 · 11월 4일(화)\n김지민(23:02): 금고 열쇠 반납했어요\n박팀장(23:05): 확인. 내일 봐요\n…"}],"look":[],"tl":[{"op":"add","id":"${typeof tlNext === 'function' ? tlNext() : 't1'}","d":"2024-11-04","t":"23:02","what":"…","who":"…","src":["e5"],"sure":true}],"ask":"…"}`;
}
/* 11-17 A: 「자료에 없다」류 말 — 그 말이 짚은 카드의 자료, 아니면 그 말의 낱말이 판독문에 나오는 자료, 아니면 최근 사진 */
const NOPE_RE = /(자료|판독문|사진|캡처|카톡|화면|원본|프사|프로필)[^.!?]{0,18}(없다|없어|없는|없음|안 보|보이지 않|나오지 않|안 나와|안 나온|빠져 있)/;
function nopePick(lines){
  const photos = (S.ev || []).filter(e => e.kind === 'photo'); if (!photos.length) return [];
  const on = [].concat(...lines.map(l => l && typeof l === 'object' ? [].concat(l.on || []) : [])).map(id => evOf(id) || (nodeOf(id) && evByCard(id))).filter(e => e && e.kind === 'photo');
  if (on.length) return [...new Set(on)].slice(0, 2);
  const stop = /^(자료|판독문|사진|캡처|카톡|화면|원본|지금|가진|없다|안|보인다|새로|받아|와야|붙는다|얘기)$/;
  const toks = [...new Set(lines.map(l => typeof l === 'string' ? l : l.t || '').join(' ').match(/[가-힣A-Za-z]{2,}/g) || [])].map(w => w.replace(/(은|는|이|가|을|를|에|에서|의|도|만)$/, '')).filter(w => w.length >= 2 && !stop.test(w));
  const sc = photos.map(e => ({ e, s:toks.reduce((a, w) => a + ((e.read || '') + (e.title || '')).split(w).length - 1, 0) })).sort((a, b) => b.s - a.s);
  return (sc[0] && sc[0].s ? sc.filter(x => x.s).map(x => x.e) : photos.slice().reverse()).slice(0, 2);
}
function setBusy(on){ busy = on; $('#send').disabled = on; $('#send').textContent = on ? '추리 중' : '건네기'; }
async function turn({ text = '', atts = [], retry = false }){
  if (busy) return; setBusy(true); curLines = [];
  const sample = await getSample();
  if (!sample){ await speak('…연결이 끊겼다. 여기선 내 머리가 돌아가지 않는다.', false); setBusy(false); return; }
  let imgs = [], photos = [], given = ''; const evs = [], tiles = {}, shots = [];
  if (retry && S.pending){ given = S.pending.given; photos = S.pending.photos || [];
    for (const id of photos){ const n = nodeOf(id); if (!n) continue; try{ const b = await (await fetch(photoSrc(n))).blob(); if (b.size) imgs.push(b); }catch(e){} }
    renderChat(); }
  else {
    for (const a of atts) if (a.type === 'img'){
      const id = 'n' + S.nid++, p = placeNear('n1'), n = { id, kind:'photo', title:'사진', note:'', thumb:a.thumb, big:URL.createObjectURL(a.blob), mid:a.mid, x:p.x, y:p.y, r:(hash(id) % 9) - 4 };
      await fly(n.x, n.y, .85, 600); S.nodes.push(n); $('#nodes').insertAdjacentHTML('beforeend', cardHtml(n, 'drop')); measure(); sfx(n.x + 50, n.y - 80, '탁');
      const ev = addEv({ kind:'photo', card:id, title:a.name || '사진', name:a.name, thumb:a.thumb, big:n.big }); evs.push(ev.id); save(); keepPhoto(n, a, ev); await sleep(500);
      const rc = canImg ? await readCopies(a.orig || a.blob) : []; if (rc.length > 1) tiles[ev.id] = rc.length;   /* 11-16 A: 세로로 긴 캡처는 조각으로 — 글자가 읽히게 */
      imgs.push(...(rc.length ? rc : [a.blob])); photos.push(id); shots.push({ e:ev, rc, src:a.orig || a.blob }); }
    const longPaste = text.length >= 300 || /\[.+\] \[(오전|오후)/.test(text);   /* 11-16 A: 붙여 넣은 대화·긴 글은 자료함에 원문째 */
    if (text){ let tag = ''; if (longPaste){ const e = addEv({ kind:'text', name:'붙여 넣은 글', len:text.length, head:text.slice(0, 160) }); keepText(e, text); evs.push(e.id); tag = ` — 자료함 ${e.id}`; } given += `[동료의 말/붙여넣기${tag}]\n${text.slice(0, 12000)}\n`; }
    for (const a of atts) if (a.type === 'txt'){ const e = addEv({ kind:'text', name:a.name, len:a.text.length, head:a.text.slice(0, 160) }); keepText(e, a.text); evs.push(e.id); given += `[파일 ${a.name} — 자료함 ${e.id}]\n${a.text.slice(0, 12000)}\n`; }
    const view = pvOpenId();
    if (view){ const vn = itemOf(view), ve = /^e/.test(view) ? vn : evByCard(view), vt = /^e/.test(view) ? evTitle(vn) : vn.title; let rc = [];
      if (canImg){ try{ rc = ve ? await evCopies(ve) : await readCopies(photoSrc(vn)); }catch(e){ rc = []; } imgs.push(...rc); }
      /* 11-16 D: 띄워 둔 사진이 있다고 무조건 사진에 잇지 않게 — 카드를 고르면 사진이 저절로 뜨기도 한다(보스 판 11-16 21:44). 사진 속을 가리키는 말일 때만 사진에서 답하고, 나머지는 앞 대화를 잇는다 */
      const vSaid = Math.max(0, S.log.filter(l => l.who === 'p').length - (PV.n0 || 0));
      given += `[화면 — 동료 옆에 ${ve ? '자료함 ' + ve.id + (ve.card ? '(판 ' + ve.card + ')' : '') : '판의 ' + view}「${vt}」 원본이 크게 펼쳐져 있다. 판에서 카드를 고르다 저절로 뜬 것일 수도 있다.${vSaid ? ` 띄운 뒤로 동료가 ${vSaid}번 더 말했다.` : ''}${rc.length ? ` 원본을 같이 보낸다${rc.length > 1 ? `(세로로 긴 사진이라 위에서부터 ${rc.length}조각)` : ''}.` : ''}
먼저 동료의 이 말이 무엇에 대한 것인지 가른다.
· 사진 속(나온 사람·말·글자·물건)을 짚거나 '이거·여기·이 사람·이 말·이 사진'처럼 화면을 가리키는 말 → 사진에서 찾아 답한다. 새로 밝혀진 게 있으면 판에 반영한다.
· 그 밖의 말 — [최근 대화]를 이어 가는 물음·의견·잡담 → 그 대화에 답한다. 사진이 떠 있다는 것만으로 화제를 사진 쪽으로 돌리지 않는다. '사진을 다시 봤다'로 말을 열지 않는다. 사진은 답에 정말 필요할 때만 한 줄 꺼낸다.${ve && rc.length ? `\n어느 쪽이든 ${ve.id} 판독문이 없거나 빠진 게 있으면 read 로 써 둔다(말로는 꺼내지 않는다).` : ''}]\n`; }
    if (!view && !photos.length && !atts.length && text.length < 300 && !/\[.+\] \[(오전|오후)/.test(text)) given = `[자료 없음 — 동료가 말만 건넸다. 대화로 답하고, 판은 동료가 고치라고 할 때만 고친다]\n` + given;
    if (photos.length) given += canImg ? `[사진 ${photos.length}장 — 이미 보드에 ${photos.join(', ')} 카드로 꽂았고, 원본은 자료함 ${evs.filter(x => evOf(x).kind === 'photo').join(', ')} 에 보관했다${Object.keys(tiles).length ? ` (세로로 긴 사진은 위에서부터 조각내 보낸다: ${Object.entries(tiles).map(([k, v]) => k + ' ' + v + '조각').join(', ')})` : ''}. 사진을 보고 edit 로 제목·메모를 붙이고 이어라. 그리고 사진마다 read 로 판독문을 꼭 남겨라.]\n` : `[사진 ${photos.length}장을 ${photos.join(', ')} 카드로 꽂았지만 너는 사진 속을 볼 수 없다. 동료에게 무엇이 찍혔는지 물어라.]\n`;
    const m = { who:'p', text:text.slice(0, 1500), at:Date.now(), photos, files:atts.filter(a => a.type === 'txt').map(a => a.name), ...(view ? { viewing:view } : {}) }; S.log.push(m); chatEl().insertAdjacentHTML('beforeend', msgHtml(m)); toEnd(true);
    S.pending = { given:given.slice(0, 26000), photos:view ? [...photos, view] : photos, at:Date.now() }; save();   /* 보내는 순간 저장 — 끊겨도 다시 묻기 */
    log('chat', { who:'p', text, files:atts.map(a => ({ name:a.name, type:a.type, chars:a.text ? a.text.length : undefined })), photos, ...(view ? { viewing:view } : {}) });
  }
  renderAll(); thinking(true);
  /* 11-17 A: 그림은 한 번에 IMG_MAX 장까지 — 넘으면 사진마다 원본(조각)을 먼저 따로 읽혀 판독문을 적어 두고, 이번 답엔 사진을 한 장씩 줄여 보낸다 */
  if (canImg && imgs.length > IMG_MAX && shots.length){
    let n = 0; for (const x of shots){ const e = evOf(x.e.id) || x.e; if (e.read) continue; const t = await evReadOne(e, (x.rc.length ? x.rc : []).slice(0, IMG_MAX), AI.effort); if (t){ e.read = t; e.readTurn = S.turn + 1; n++; } }
    const whole = []; for (const x of shots.slice(0, IMG_MAX)){ try{ const w = await readCopies(x.src, { whole:true }); if (w[0]) whole.push(w[0]); }catch(e){} }
    act('사진 먼저 판독', { n, imgs:imgs.length, max:IMG_MAX }); evPing(n);
    imgs = whole;
    given += `[그림은 한 번에 ${IMG_MAX}장까지라, 앱이 사진마다 원본을 먼저 따로 읽혀 판독문을 [자료함]에 적어 두었다. 이번엔 사진 ${imgs.length}장을 한 장씩 줄여 같이 보낸다. 판독문을 바탕으로 답하고, 빠지거나 틀린 게 보이면 read 로 고쳐 쓴다.]\n`;
    if (S.pending) S.pending.given = given.slice(0, 26000); save(); }
  if (imgs.length > IMG_MAX) imgs = imgs.slice(0, IMG_MAX);
  let res; const prompt = buildPrompt(given), t0 = Date.now();
  const tier = () => AI.model.includes('opus') ? 'complex' : AI.model.includes('haiku') ? 'quick' : 'default';
  /* 11-17 A: JSON 이 안 오면 조용히 한 번 더 — 보스가 다시 묻기를 열 번 누르던 것 */
  const ask = async (p, images) => { const o = { model:AI.model, effort:AI.effort, modelTier:tier() }; if (images && images.length && canImg) o.images = images;
    try{ return await sample.json(p, o); }
    catch(e){ const c = e && e.code || ''; if (c !== 'invalid_json' && !/json/i.test(String(e && e.message || ''))) throw e;
      log('turn', { ok:false, n:S.turn + 1, part:'json', model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt:p, error:{ code:c, message:String(e && e.message || e) } }); act('JSON 다시 묻기');
      return await sample.json(p + '\n\n[앞서 낸 답이 JSON 이 아니었다. 위 형식의 JSON 객체 하나만 낸다. 말은 전부 say 안에.]', o); } };
  try{ res = await ask(prompt, imgs); }
  catch(e){ thinking(false); const c = e && e.code; log('turn', { ok:false, n:S.turn + 1, model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, error:{ code:c || '', message:String(e && e.message || e) } });
    await speak(c === 'rate_limited' ? '…머리가 과열됐다. 잠시 뒤에 다시 묻자.' : c === 'not_granted' ? '…생각할 허락이 없다. 연결을 허락해 줘야 움직인다.' : '…실이 끊겼다. 다시 묻기를 눌러라.', false);
    save(); setBusy(false); renderChat(); return; }
  /* 11-16 A: 다시 보기(look — 원본) · 11-17 A: 대화 다시 보기(recall — 옛 대화). 둘 다 청하면 한 번에 붙여 한 번 더 묻는다 */
  const want = (Array.isArray(res && res.look) ? res.look : []).map(String).map(id => evOf(id) || (nodeOf(id) && evByCard(id))).filter(e => e && e.kind === 'photo').slice(0, 3);
  const keys = (Array.isArray(res && res.recall) ? res.recall : res && typeof res.recall === 'string' ? [res.recall] : []).map(String).filter(Boolean).slice(0, 3);
  const lookOk = want.length && canImg;
  if (lookOk || keys.length){
    log('turn', { ok:true, n:S.turn + 1, part:lookOk ? (keys.length ? 'look+recall' : 'look') : 'recall', model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, response:res });
    const line = lookOk ? res.lookLine || '잠깐. 원본을 다시 본다.' : res.recallLine || '잠깐. 앞에서 한 말을 다시 본다.';
    thinking(false); if (sayable(line)) await speak(line, true, { on:lookOk ? want.map(e => e.card).filter(id => id && nodeOf(id)) : [] }); thinking(true);
    const more = []; if (lookOk) for (const e of want){ try{ more.push(...(await evCopies(e))); }catch(x){} }
    let add = '';
    if (more.length) add += `\n[다시 보기 — 네가 청한 원본 ${want.map(e => e.id).join(', ')} 를 같이 보낸다(세로로 긴 건 위에서부터 조각). 판독문은 read 로 고쳐 쓴다.]\n`;
    if (keys.length) add += `\n[대화 다시 보기 — 네가 찾은 말(${keys.join(', ')})이 나온 옛 대화와 앞뒤 한 줄씩, 오래된 것부터]\n${recallText(keys)}\n`;
    if (add){ add += '[이걸 보고 이번 답을 처음부터 다시 써라. look 과 recall 은 비워라.]\n';
      try{ const r2 = await ask(buildPrompt(given + add), [...more, ...imgs].slice(0, IMG_MAX)); if (r2 && typeof r2 === 'object') res = r2;
        if (more.length) act('다시 보기', { ids:want.map(e => e.id), imgs:more.length }); if (keys.length) act('대화 다시 보기', { keys }); }
      catch(e){ act('다시 보기 실패', { code:e && e.code || '' }); } }
  }
  /* 11-17 A: 「자료에 없다·안 보인다」고 하면 원본을 다시 본다 — 판독문에 없으면 원본에도 없다고 단정하던 것(보스 사건 20261117-5723 3턴: 「프로필 사진은 자료에선 안 보인다」) */
  if (!lookOk && canImg && !imgs.length){
    const tx = l => typeof l === 'string' ? l : (l && l.t) || '';
    const bad = (Array.isArray(res && res.say) ? res.say : []).filter(l => NOPE_RE.test(tx(l)));
    const pick = bad.length ? nopePick(bad) : [];
    if (pick.length){
      log('turn', { ok:true, n:S.turn + 1, part:'nolook', model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, response:res });
      thinking(false); await speak('잠깐. 원본을 다시 본다.', true, { on:pick.map(e => e.card).filter(id => id && nodeOf(id)) }); thinking(true);
      const more = []; for (const e of pick){ if (more.length >= IMG_MAX) break; try{ more.push(...(await evCopies(e)).slice(0, IMG_MAX - more.length)); }catch(x){} }
      if (more.length){
        const add = `\n[다시 보기 — 너는 「${bad.map(tx).join(' / ').slice(0, 160)}」라고 하려 했다. 그 말을 하기 전에 원본 ${pick.map(e => e.id).join(', ')} 을 같이 보낸다(세로로 긴 건 위에서부터 조각). 원본에 있으면 그대로 답하고 판독문을 read 로 고친다. 원본에도 정말 없을 때만 「원본을 다시 봤는데 없다」고 말한다. look 과 recall 은 비워라.]\n`;
        try{ const r2 = await ask(buildPrompt(given + add), more); if (r2 && typeof r2 === 'object') res = r2; act('없다 전 다시 보기', { ids:pick.map(e => e.id), imgs:more.length }); }
        catch(e){ act('다시 보기 실패', { code:e && e.code || '' }); } } } }
  if (typeof modeFilter === 'function'){ try{ res = modeFilter(res) || res; }catch(e){} }   /* 11-17 A: v0.14 연결 고리 — B(mode.js) 자료 닫힘 등 */
  thinking(false); S.turn++; delete S.pending;
  log('turn', { ok:true, n:S.turn, model:AI.model, effort:AI.effort, ms:Date.now() - t0, prompt, response:res });
  /* 11-17 A: 저장 먼저, 연출은 뒤 — 판독문은 바로 적고, 나머지(판 고침·수첩·난제)는 play 가 단계마다 기기에 적어 두며 한다. 중간에 화면이 다시 열려도 resumePlay 가 마저 한다 */
  applyReads(res); if (typeof applyTl === 'function'){ try{ applyTl(res); }catch(e){} } const cr = clean(res); save();   /* 11-17 A: 연혁도 연출 전에 바로 */
  await play(cr);
  const mm = (S.notes || []).filter(n => n.turn === S.turn).map(n => n.k + ':' + n.t);
  if (curLines.length) log('chat', { who:'m', text:curLines.join(' / ') });
  log('memory', { n:S.turn, newMemo:mm, board:snap(), pz:S.probs, pfocus:S.pfocus });   /* 11-16 B: 난제 지도도 */
  save(); renderAll(); setBusy(false);
  if (typeof evBackfill === 'function') setTimeout(evBackfill, 1500);   /* 11-17 A: 판독문 없는 자료가 있으면 한가할 때 채운다 */
  if (typeof faceAuto === 'function') setTimeout(faceAuto, 2500);   /* 11-17 A: 얼굴 없는 인물 카드엔 캡처 속 프사를 */
}

