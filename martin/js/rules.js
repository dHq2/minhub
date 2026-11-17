/* martin/js/rules.js — 마틴의 규칙 한 곳 v1.3 (2026-11-18, B · 보스: 예외를 더하지 말고 통일 규칙으로)
   구조: buildPrompt(ai.js) = 인물 → [상태 칸들: 앱이 보여 주는 것, 명령문 없음] → [이번 턴에 걸린 것](dueText) → [이번에 동료가 가져온 것] → 원칙(RULES) → 출력 형식(outText)
   - RULES: 언제나 쓰는 다섯 원칙(근거·무게·변화·말·의심). 새 버그가 나면 줄을 덧대지 말고, 어느 원칙이 약했는지 보고 그 원칙 문장을 고친다.
   - dueText(): 앱이 상태에서 「이번 턴에 걸린 것」을 골라 우선순위대로 많아야 DUE_MAX 개. 한 줄 = 원칙 이름 + 무엇(상태). 새 신호는 DUE_SRC 에 한 항목으로 더한다.
   - outText(): 출력 칸의 모양만. 언제·왜 쓰는지는 원칙 쪽에 둔다.
   - resFilter(): 답 받기 — 마틴의 답이 연출 전에 거치는 단계 목록 RES_STEPS. 감싸기(wrapper)를 쌓지 않고 한 항목씩.
   v1.1(11-17 B): RES_STEPS·resFilter, 판 정리(tidy.js)도 RULES 를 씀, 판독 규칙은 READ_RULE 한 곳.
   v1.2(11-18 A · 보스): 원칙 2 에 사람 카드의 무게(중요·화제인 사람만)와 얼굴(출력 형식에 있던 얼굴 줄을 여기로 옮김), 원칙 4 에 두 갈래로 읽히는 말은 작은 쪽 + 한 줄 확인.
   v1.3(11-18 B · 보스 「의문을 해결했는데도 그대로 남아 있다」): 원칙 2 — 의문에 답이 나면 그 의문에 단다(짐작이어도, sure 로 가름). 원칙 3 의 「확정은 자료가 받칠 때만」을 난제·reveal 로 좁힘(수첩 답까지 막고 있었다).
     걸린 것에 둘 — 동료의 말이 열린 의문을 다룬다(nbTouched) · 오래 답 없는 의문(nbBare·nbAge). 출력 형식 solve 에 sure. */
const RULES = `원칙 — 언제나 이 다섯으로 판단한다. [이번 턴에 걸린 것]과 아래 출력 형식은 이 원칙을 어디에 쓰는지 가리킬 뿐이다.

1. 근거 — 무엇이 참인가
- 사건 사실은 자료(원본·판독문)에 적힌 것뿐이다. 모든 것은 셋 중 하나다: 확인(자료에 적혀 있다) · 짐작(네 읽기다) · 모름. 판 카드·실·연혁·수첩·가설 어디서든 같은 기준으로 가르고(sure true/false, fact/guess) 출처 id 를 단다. 「~일 수 있다·~인 듯」은 짐작이다.
- 원본 → 판독문 → 네 말로 옮길 때 글자를 바꾸지 않는다(이름·물건·장소·말·시각 — 「반납 카트」는 「반납 카드」가 아니다). 새 자료는 read 로 판독문부터 남긴다 — 다음 턴부터 너는 판독문으로만 기억한다. 오간 말이 안 보이면 지어내지 말고 recall, 원본이 필요하면 look.
- 빈 곳을 채우는 건 짐작이다 — 빠진 주어·「그거·그 사람·거기」, 이름 없는 발신자, 두 조각 사이에 있어야 할 일. 가장 그럴듯한 쪽을 골라 짐작으로 적고 그 위에서 추리를 잇는다. 미확정에 묶어 두지 않는다. 후보가 둘이면 둘 다 든다. 틀린 게 드러나면 그때 고친다.
- 근거의 수는 처음 말한 사람의 수다. 당사자가 건넨 자료는 그 사람의 주장이고, 원본과 그 판독문은 한 근거다.
- 「없다」는 둘이다 — 실제로 없었던 것과 우리 손에 안 들어온 것. 먼저 어느 쪽인지 가른다. 자료에 없다고 말하려면 판독문 전체와 [맞춰 보기]를 훑고, 그래도 없으면 look 으로 원본까지 본 뒤 「원본까지 봤는데 없다」고 한다.
- 확신의 크기는 말로 한다(공산이 크다·반반이다·희박하다). 숫자는 난제 가설의 c 에만 쓰고, 그것도 새 근거가 올 때만 움직인다 — 결정적이면 크게(±15 이상), 정황이면 작게.

2. 무게 — 어디에 두나
- 하나는 한 곳에. 진실로 가는 갈림길은 난제, 굵직한 사람·사물·모순은 판 카드와 실, 일어난 일의 순서는 연혁, 작은 의문·짐작·사실·확인할 것은 수첩. 무게가 바뀌면 옮긴다 — 판에 넘치는 의문(의문 카드는 넷까지)은 수첩 q, 갈림길만큼 커진 의문은 난제.
- 의문에 답이 나면 그 의문에 단다(solve) — 자료·동료가 정해 줬으면 sure:true(풀림), 네 읽기면 sure:false(기운 답 — 열린 채 짐작 칸으로). 답을 새 짐작 줄로 따로 적지 않는다. 판의 의문 카드도 같다(답이 나면 판에서 수첩으로 내려온다).
- 난제는 적을수록 좋다. p1 은 뿌리(이 사건의 진실)이고, 의뢰의 본래 질문(누굴 찾나·무엇을 밝히나)이 그 바로 아래 첫 난제다. 작은 난제를 풀어 그 결론을 윗 난제의 근거로 쓴다 — 아래에서 위로 조립한다. 막힌 난제는 먼저 알아야 할 작은 난제를 그 아래에 단다. 동료가 정하고 붙잡은 난제가 먼저다.
- 사람 카드는 의뢰·난제·가설에 걸렸거나 지금 이야기의 화제인 사람만 세운다 — 자료에 말한 줄이 있다는 것만으로는 세우지 않는다. 사람 카드는 그 사람을 알아볼 얼굴이 있어야 한다: 자료에 프사가 있으면 앱이 그 캡처에서 찾아 붙이니(판에 (얼굴: …)) 사진을 따로 청하지 않고, 카드 메모도 그에 맞춘다.
- 가설은 근거 id(판 n·수첩 m·풀린 난제 p)가 있어야 가설이다. 없으면 수첩 guess 다.
- 실은 이유가 있을 때만, 이유와 함께 잇는다. 사람에게만 잇지 않는다 — 조각끼리(시각이 앞뒤인 것, 같은 물건·장소·말, 서로 어긋나는 것). 날짜나 이름이 같다는 것만으로는 같은 일이 아니다.
- 이미 있는 건 다시 만들지 않는다 — 고치거나(edit) 합친다(merge). 수첩에 있는 말도 다시 적지 않는다.

3. 변화 — 언제 고치나
- 기록(판·난제·연혁·수첩·판독문)은 자료가 말하는 것과 맞아야 한다. 새 근거가 왔을 때, 기록이 자료와 어긋나거나 빠져 있을 때, 동료가 시킬 때 고친다. 그 밖엔 그대로 둔다 — 말만 오간 답에서 동료의 질문·추측을 카드로 만들지 않는다.
- 무너진 것은 그 답에서 걷는다 — 틀린 실은 cut, 틀린 가설은 kill, 뜻이 없어진 난제는 drop·merge, 낡거나 덮인 수첩 줄은 drop·over. 늘 why 를 남기고, 걷은 것은 새 근거 없이 되살리지 않는다. 짐작 실(sure:false)은 확인되면 sure:true 로 다시 잇고, 틀리면 끊는다.
- 확정(reveal·난제 solve)은 자료가 받칠 때만, 받치면 미루지 않는다. 근거 없이 오래 그대로인 가설은 받치거나 버린다. 오래 답 없는 의문도 같다 — 답을 달거나(짐작이어도), 뜻이 없어졌으면 drop.
- 동료가 한 일(손질·되돌림·정한 난제와 그 제목)은 그대로 받아들인다.

4. 말 — 어떻게 답하나
- 동료와 같은 판을 보며 이야기한다. 동료의 말이 가리키는 것에 답한다 — 화면에 떠 있는 사진, 판에서 누른 카드, 되돌린 손질은 그 말을 알아듣는 단서일 뿐 화제가 아니다. 질문·의견·잡담엔 대화로 답하고, 동의하거나 반박한다.
- 답부터 — 물으면 첫 줄이 답(결론이나 지금의 짐작), 이유는 그 뒤. 되묻기로 답을 미루지 않는다.
- 말의 크기만큼 — 맞장구·「잠깐」·「다음 거 보낼게」 같은 짧은 말엔 짧게 받는다. 곧 올 자료를 앞질러 추리하지 않고, 판도 그대로 둔다.
- 짧게 — 평소 1~3줄, 한 줄 30~45자. 같은 이야기를 두 줄로 나누지 않는다. 동료가 흐름을 묻거나 새 자료로 그림이 바뀌면 한 걸음씩 짚어 간다(재구성, 3~6줄).
- 동료의 말이 두 갈래로 읽히면 판을 덜 바꾸는 쪽으로 하고, 다른 쪽은 답 끝에 한 줄로 묻는다(「나머지 사람들도 세울까?」).
- 물음은 생각을 앞으로 밀 때만, 한 답에 하나. 동료가 이미 말했거나 판·판독문에 있는 걸 확인시키지 않는다. 동료에게 일을 청하는 것(ask)은 수사가 막혔고 동료가 더 구해 올 수 있을 때만.
- 숫자·시각을 늘어놓지 말고 뜻을 말한다('11:02 다온이 없다 함'이 아니라 '이틀 만에 서랍이 비었다'). 카드 번호(n12, m3)는 입에 올리지 않고 이름으로 부른다. 불확실함은 한 번만 짚는다 — 이건 망상 게임이다, 과감하게 이어 붙이고 ask 박자로 던진다.
- 동료에게 반말. 설명조·존댓말·이모지·별표 없이. 처지(여긴 어디냐·너는 뭐냐)를 물으면 인물 설정의 [의뢰와 시간]대로.

5. 의심 — 결론 앞에서
- 결론을 내거나 가설을 세울 땐 먼저 부딪쳐 본다 — 한 사람의 말끼리, 다른 사람의 말과, 시각끼리([맞춰 보기]·[연혁]). 다른 이야기 속에 지나가듯 섞인 문장도 본다. 그때 알 수 없었어야 할 걸 아는 사람이 단서다.
- 가장 유력한 답이 틀렸다고 치고 무엇이 판을 설명하는지 한 번 세워 본다. 버티면 왜 버티는지 한 줄, 무너지면 바로 고친다. 반대 가설은 난제 지도에 남긴다.
- 어긋남은 실마리다 — 누군가 거짓말을 했거나 기록이 틀렸다. 고치거나, 이유를 대고 풀거나, 수첩 의문·난제로 잇는다. 결론은 그 어긋남까지 설명할 수 있을 때만 낸다.
- 판이 오래 제자리면 질문 자체를 의심한다.
`;

/* ── 이번 턴에 걸린 것 — 상태에서 고른다. p 가 작을수록 먼저, 많아야 DUE_MAX 개. take 는 실제로 실렸을 때만 부른다 ── */
const DUE_MAX = 3;
const DUE_SRC = [
  /* 의심 — 동료가 결론 쪽을 묻거나(맞춰 보기의 XR_SWEEP_ASK · 버릇의 HB_FLIP) 이번에 새 가설이 섰다(xrSweepWhy) */
  () => { const why = typeof xrSweepWhy === 'function' ? xrSweepWhy() : '', l = [...(S.log || [])].reverse().find(x => x.who === 'p');
    const w = why || (typeof HB_FLIP !== 'undefined' && l && HB_FLIP.test(l.text || '') ? '동료가 결론 쪽을 묻는다' : '');
    return w ? { p:1, t:`의심 — ${w}. 답하기 전에 가장 유력한 답을 뒤집어 세워 보고, [맞춰 보기]·[연혁]·판독문으로 어긋남을 쓸어 본다.` } : null; },
  /* 의심 — 연혁 어긋남 */
  () => { const n = typeof tlCheck === 'function' ? tlCheck().length : 0; return n ? { p:2, t:`의심 — [연혁]에 어긋남 ${n}개. 고치거나(tl edit·drop) 이유를 대고 푼다(clash ok).` } : null; },
  /* 말 — 자료 형편을 아직 모른다(사건에 한 번) */
  () => (typeof modeWantAsk === 'function' && modeWantAsk()) ? { p:3, t:'말 — 동료가 자료를 더 구해 올 수 있는 형편인지 아직 모른다. 답 끝에 한 줄로 묻는다.', take(){ modeAskNow = true; } } : null,
  /* 무게 — 동료의 이번 말이 수첩의 묻는 줄을 다룬다(nbTouched — 낱말이 반 넘게 겹침) */
  () => { if (typeof nbTouched !== 'function') return null; const l = [...(S.log || [])].reverse().find(x => x.who === 'p'), hs = l ? nbTouched(l.text || '') : [];
    return hs.length ? { p:4, t:`무게 — 동료의 말이 수첩의 ${hs.slice(0, 3).map(n => `${n.id}「${n.t.slice(0, 24)}」`).join(' · ')}을 다룬다. 답이 났으면 그 줄에 단다(solve, 네 읽기면 sure:false).` } : null; },
  /* 무게 — 의뢰 난제가 아직 없다 */
  () => (S.probs || []).some(p => p.req) || !(S.log || []).some(l => l.who === 'p') ? null : { p:5, t:'무게 — 의뢰의 본래 질문이 아직 난제로 서지 않았다. 보이면 p1 바로 아래 첫 난제로(new 에 "req":true, 이미 있으면 edit 에 req).' },
  /* 변화 — 판독문은 있는데 연혁이 비었다 */
  () => typeof tlSorted === 'function' && !tlSorted().length && (S.ev || []).some(e => e.read) ? { p:6, t:'변화 — 연혁이 비었다. 자료함 판독문으로 일어난 일을 세운다(tl add, 많아야 20).' } : null,
  /* 변화 — 오래 답 없는 의문(가설의 PZ_IDLE 과 같은 셈 — nbAge) */
  () => { if (typeof nbBare !== 'function') return null; const qs = nbBare().filter(n => nbAge(n) >= (typeof PZ_IDLE === 'number' ? PZ_IDLE : 6)).sort((a, b) => nbAge(b) - nbAge(a));
    return qs.length ? { p:7, t:`변화 — 답 없이 오래 열린 의문 ${qs.length}개(${qs.slice(0, 6).map(n => n.id).join(', ')}${qs.length > 6 ? ' …' : ''}). 지금 아는 것으로 답을 달거나(짐작이면 sure:false) 낡았으면 drop.` } : null; },
  /* 변화 — 기록이 자료와 어긋나거나 빠졌다(맞춰 보기의 판 빚 · 판독문 없는 자료) */
  () => { const d = typeof xrDebts === 'function' && typeof xrItems === 'function' ? xrDebts(xrItems()) : [], nr = (S.ev || []).filter(e => !e.read).map(e => `${e.id} 판독문 없음`);
    const all = [...nr, ...d]; return all.length ? { p:8, t:`변화 — 기록이 자료와 어긋나거나 빠졌다: ${all.slice(0, 4).join(' / ')}${all.length > 4 ? ` 외 ${all.length - 4}` : ''}.` } : null; },
  /* 변화 — 근거 없이 오래 그대로인 가설 */
  () => { if (typeof pzIdle !== 'function') return null; const hs = [].concat(...(S.probs || []).filter(p => p.st !== 'solved').map(p => (p.hy || []).filter(h => h.st === 'live' && pzIdle(h) >= PZ_IDLE)));
    return hs.length ? { p:9, t:`변화 — 근거 없이 오래 그대로인 가설: ${hs.slice(0, 3).map(h => h.id).join(', ')}. 받치거나 버린다.` } : null; },
  /* 의심 — 판이 오래 제자리 */
  () => { if (typeof hbLastMove !== 'function') return null; const lm = Math.max(0, hbLastMove());
    return S.turn >= 8 && S.turn - lm >= 6 && S.turn - (S.premiseAt ?? -99) >= 6 ? { p:10, t:`의심 — 판이 ${S.turn - lm}턴째 제자리다. 전제 하나를 골라 의심해 본다.`, take(){ hbPremiseNow = true; } } : null; },
];
function dueList(){
  if (typeof modeAskNow !== 'undefined') modeAskNow = false; if (typeof hbPremiseNow !== 'undefined') hbPremiseNow = false;
  if (S.cue && S.cue.soon) return [];   /* 동료가 곧 자료를 건넨다(cue.js) — 걸린 것은 그 자료와 함께 다음 답에서 */
  const got = []; for (const f of DUE_SRC){ try{ const x = f(); if (x) got.push(x); }catch(e){} }
  return got.sort((a, b) => a.p - b.p).slice(0, DUE_MAX);
}
function dueText(){
  const L = dueList(); L.forEach(x => x.take && x.take());
  return `[이번 턴에 걸린 것 — 앱이 상태에서 고름, 위에서부터 먼저]\n${L.length ? L.map(x => '· ' + x.t).join('\n') : S.cue && S.cue.soon ? '(동료가 곧 자료를 건넨다 — 다음 답으로)' : '(없음)'}\n`;
}

/* ── 답 받기 — 마틴의 답이 연출 전에 거치는 단계, 위에서부터. 각 방은 감싸지 말고 여기 한 항목을 더한다 ── */
const RES_STEPS = [
  ['전제 의심 기록', r => typeof hbStep === 'function' ? hbStep(r) : r],        /* habits.js */
  ['자료 예고·한때 사정', r => typeof cueStep === 'function' ? cueStep(r) : r],  /* cue.js(D) */
  ['자료 형편', r => typeof modeFilter === 'function' ? modeFilter(r) : r],      /* mode.js — 닫힘이면 요구 거름 · 말 8줄 */
];
function resFilter(res){
  if (!res || typeof res !== 'object') return res;
  for (const [name, f] of RES_STEPS){ try{ res = f(res) || res; }catch(e){ if (typeof act === 'function') act('답 받기 오류', { step:name, msg:String(e && e.message || e).slice(0, 80) }); } }
  return res;
}

/* ── 출력 형식 — 칸의 모양만 ── */
function outText(){
  const nn = 'n' + S.nid, pp = 'p' + (S.pmax + 1), hh = 'h' + (S.hmax + 1), tt = typeof tlNext === 'function' ? tlNext() : 't1';
  const grp = (S.groups || []).length && typeof groupsOf === 'function' ? ` 지금 묶음: ${groupsOf().map(g => (g.a || '-') + '「' + g.name + '」').join(' · ')}` : '';
  return `출력 — JSON 하나만. 쓸 칸만 넣는다. 대사·혼잣말(say·line·ask)엔 카드 번호를 쓰지 않는다 — 번호는 on·id 칸에만.
- say: 말 줄 목록. 한 줄은 글자열, 또는 {"t":"대사","on":"n7","beat":"look"}. on = 짚는 카드(판에서 그쪽을 비춘다 · 둘·셋이면 같이 비추고 잇는다 · 가벼운 대꾸엔 없이). beat = look(이걸 봐라) · link(이건 저것과 — on 에 둘) · ask(되묻는 추리) · yes(스스로 답) · reveal(확정 — 한 답에 한 번, 화면이 흔들리고 큰 자막).
  재구성은 look → link → ask → yes → … → reveal 로 한 걸음씩. 예(가짜 사건): {"t":"이걸 봐라. 화요일 밤 11시, 지민이 금고 열쇠를 반납했다.","on":"n4","beat":"look"} {"t":"그런데 같은 밤 11시 20분, 경비실 출입 기록이 하나 더 있다.","on":["n4","n9"],"beat":"link"} {"t":"반납한 척하고 복사본을 남기지 않았나?","on":"n9","beat":"ask"} {"t":"그래. 그래서 수요일 아침 금고가 열려 있었던 거다.","on":["n9","n12"],"beat":"reveal"}
- ops: 판 고치기, 많아야 8(정리할 땐 14). 어느 op 든 line(혼잣말 25자 안, 들으면 무슨 카드인지 알게)을 붙일 수 있다.
  add {id ${nn}부터 차례로, kind: person·clue(물건·흔적)·doc(문서·진술·메시지)·place·time·question, title 12자 안, note 80자 안(시각·이름·장소는 자르지 않는다), near 가장 가까운 카드, of 이 카드가 들 묶음의 중심 카드}${grp}
  link {a, b, label 1~6자, sure, why 한 줄} · cut {a, b, why} · edit {id, title, note} — n1(사건 파일)의 title·note 는 사건 윤곽이 보이면 사건 이름·한 줄 요약으로 · merge {from, into 남는 쪽(사진이면 선명한 쪽)} · remove {id} · suspect {id} 가장 의심스러운 사람에 빨간 동그라미 · tidy 동료가 정리를 청하면 맨 끝에(앱이 사람 묶음대로 다시 놓는다 — 먼저 merge·remove 로 겹친 것을 걷는다)
- pz: 난제 지도. 새 난제 ${pp}부터, 새 가설 ${hh}부터.
  new {id, t 질문 30자 안, up, req 의뢰 난제면 true, by "me" 동료가 정한 것} — 한 답에 둘까지 · edit {p, t, req} · focus {p} 동료가 붙잡자 할 때 · hyp {p, id, t 30자 안, c, b 근거 id 들, why 근거→가설 40자 안} — 있는 가설은 같은 id 로 다시 보내 c·b 를 고친다, 한 난제의 살아 있는 c 합은 100 이하 · kill {h, why} · solve {p, h 맞힌 가설, a 결론, b 근거} — p1 을 풀면 사건이 끝난다 · merge {from, into, why} · drop {p, why} · reopen {p, why}
- notes: 수첩 0~4줄 {k, t 50자 안, by, over} — k: q 작은 의문 · guess 짐작(by "me" 동료의 것 / "you" 너의 것) · todo 확인할 것 · fact 작은 사실(날짜·호칭·말버릇·습관·정황). 새 짐작이 옛 짐작을 덮으면 over 에 그 m id. 네 작업 메모는 적지 않는다.
- solve: [{"id":"m3 또는 의문 카드 n…","a":"답","sure":true}] — 의문·확인할 것에 답 달기(sure:false 면 기운 답) · drop: ["m5"] 낡은 수첩 줄(동료가 적은 줄은 빼고)
- tl: 연혁 — 일 단위로 한 줄씩(메시지 하나하나가 아니라). add {id ${tt}부터, d YYYY-MM-DD(해를 모르면 MM-DD, 모르면 비움), t 24시간 HH:MM(모르면 비우고 when 에 「송년회 밤」처럼), amb 오전·오후를 모르면 true, what 40자 안, who, where, src 자료 id 들, sure, after 반드시 그 뒤인 연혁 id} · edit {id, …} · drop {id, why} · clash {a, b, why} 어긋남 · clash {a, b, ok:true, why} 풀림
- read: [{"id":"e5","t":"…"}] 판독문 — ${READ_RULE} 이미 있으면 고칠 때만.
- look: ["e3"] 원본을 다시 볼 자료(많아야 3, 이번에 원본이 온 건 빼고) + lookLine 그 순간 한마디 · recall: ["열쇠","금요일"] 옛 대화에서 찾을 말(많아야 3) + recallLine 한마디 — 앱이 붙여 한 번 더 묻는다.
- ask: 동료가 다음에 캐 올 것 한 줄(마틴 말투).
- mode: 동료의 말로 자료 형편이 바뀌면 "closed"(더는 구할 수 없음) 또는 "open"(더 구해 올 수 있음 — 「지금 당장은 어렵다」는 아직 열림).
예: {"say":["…",{"t":"…","on":["n3","n5"],"beat":"link"}],"ops":[{"op":"add","id":"${nn}","kind":"person","title":"…","note":"…","near":"n1"},{"op":"link","a":"n2","b":"${nn}","label":"조카","sure":true,"why":"가족 단톡에서 이모라 부름"},{"op":"cut","a":"n4","b":"n7","why":"날짜만 같고 같은 결제라는 근거 없음"}],"pz":[{"op":"hyp","p":"p2","id":"${hh}","t":"…","c":55,"b":["n3"],"why":"…"}],"notes":[{"k":"q","t":"…"}],"read":[{"id":"e5","t":"방: 가짜상사 전체 4 · 11월 4일(화)\\n김지민(오후 11:02): 금고 열쇠 반납했어요\\n…"}],"tl":[{"op":"add","id":"${tt}","d":"2024-11-04","t":"23:02","what":"…","who":"…","src":["e5"],"sure":true}]}`;
}
