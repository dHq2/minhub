/* martin/js/cue.js — 자료 예고 알아듣기 v1.2 (11-17 D · v1.1: 프롬프트 문장 대신 상태 S.cue 만 — B 통일 작업 맞춤 · v1.2 B: 감싸기 대신 cueStep 한 항목). 고칠 땐 이 줄 아래에 「11-17 D: …」처럼 날짜·방 주석 */
/* 보스 사건 20261117-5723 에서 생긴 일 두 가지(로그 진단):
   ① 턴 9 — 마틴이 「쪽지 원본과 열흘 치 일기를 더 받아 올 수 있나」 묻자 보스가 「지금 당장은 힘들어」.
      한때 사정이었는데 마틴이 답에 "mode":"closed" 를 실어 자료 닫힘이 켜졌다(자료가 다 끝난 것처럼).
   ② 턴 13 — 보스가 「좋아. 다음 기록이다.」(다음 사진을 곧 넘기겠다는 말). 사진이 안 붙은 말이라 프롬프트엔
      [자료 없음]이 붙고, 닫힘 모드가 「있는 조각으로 추리를 밀어라」고 시켜서 마틴이 「새 자료가 안 왔으니 있는 조각으로 간다」.
   그래서 여기서:
   · 자료 예고(다음 기록·다음 거·보낼게·올릴게·잠깐만 …)를 사진 없이 말하면 → S.cue 를 세우고(프롬프트 글은 B 가 잇는다),
     닫혀 있었으면 연다(modeSet(false)), 그 턴 마틴 답의 ask·closed 는 받지 않는다.
   · 동료의 말이 「지금은·당장은·아직은·나중에 … 힘들다·어렵다」처럼 한때 사정이면 → 마틴이 closed 를 실어도 받지 않는다.
   v1.2(11-17 B): 감싸기를 걷었다 — cueSense 는 mode.js modeText 가 부르고, 답 거르기는 cueStep 한 항목으로 rules.js RES_STEPS(답 받기 단계)에 */
const CUE_SOON = /(다음\s*(기록|거|것|꺼|자료|사진|캡처|캡쳐|일기|장|카톡|편)\s*(이다|야|임|입니다|간다|갈게|줄게|보자|나간다)?(?=\s|$|[.!~,…ㅋㅎ])|(보낼|올릴|넘길|넘겨\s*줄|붙일|가져갈)\s*(게|께|게요|께요)(?=\s|$|[.!~,…ㅋㅎ])|이어서\s*(간다|갈게|보낸다)|하나\s*더\s*(있|간다|줄게))/;
const CUE_WAIT = /^(잠깐만?|잠시만|기다려\s*(봐|줘)?|대기|ㄱㄷ)[.!~…ㅋㅎ\s]*$/;   /* 이 말만 짧게 했을 때 */
const CUE_LATER = /(지금\s*(당장)?\s*은|당장\s*은|아직\s*은|오늘\s*은|이번\s*엔|나중에|이따가?)[^.!?\n]{0,12}(힘들|어렵|안\s*돼|안\s*되|못\s*(해|구|가져|받)|무리)/;
let cueNow = '';   /* 이번 프롬프트에 자료 예고를 붙였나(그때 동료의 말) */
function cueLast(){
  if (typeof S === 'undefined' || !S) return null;
  return [...(S.log || [])].reverse().find(l => l.who === 'p') || null;
}
/* 사진·파일·띄워 둔 사진 없이 말만 온 자료 예고인가 */
function cueSoon(m){
  if (!m || !m.text) return false;
  if ((m.photos && m.photos.length) || (m.files && m.files.length) || m.viewing) return false;
  const t = m.text.trim(); if (t.length > 80) return false;   /* 긴 말은 예고가 아니라 이야기다 */
  return CUE_SOON.test(t) || CUE_WAIT.test(t);
}
function cueLater(m){ return !!(m && m.text && CUE_LATER.test(m.text.slice(0, 400))); }
if (typeof UNDO_SKIP !== 'undefined') UNDO_SKIP.add('cue');   /* 판 상태가 아니다 — 되돌리지 않는다 */
/* 11-17 D: B 의 「프롬프트 통일」(from-b [급함]) 동안 프롬프트 문장은 더하지 않는다. 상태만 정한다 —
   S.cue = { soon:true, text:'동료의 말', turn } — 이번 턴 동료가 사진 없이 다음 자료를 예고했다(없으면 지운다).
   B 가 「이번 턴에 걸린 것」 칸에 잇는다: 받을 채비만 한두 줄, 있는 조각으로 앞질러 추리하지 않음, 판·수첩·ask 비움.
   cueState() — 프롬프트에 쓸 짧은 상태 글(문장 아님). modeText 를 감싸는 건 그 직전에 상태를 맞추고 닫힘을 여는 일만 한다 */
function cueSense(){
  if (typeof S === 'undefined' || !S) return null;
  const m = cueLast();
  if (cueSoon(m)){
    S.cue = { soon:true, text:m.text.trim().slice(0, 40), turn:S.turn };
    if (S.closed === true && typeof modeSet === 'function') modeSet(false, '동료가 다음 자료를 예고함');
  } else delete S.cue;
  cueNow = S.cue ? S.cue.text : '';
  return S.cue || null;
}
function cueState(){ return (typeof S !== 'undefined' && S && S.cue && S.cue.soon) ? `자료 예고 — 「${S.cue.text}」(사진 없이, 곧 건넴)` : ''; }
/* 답 받기 단계(rules.js RES_STEPS) — 자료 예고·한때 사정이면 마틴의 closed·ask 를 받지 않는다. 자료 예고 감지(cueSense)는 mode.js modeText 가 부른다(11-17 B: 감싸기를 걷음) */
function cueStep(res){
  if (res && typeof res === 'object'){
    const m = cueLast();
    if (String(res.mode || '').toLowerCase() === 'closed' && cueLater(m) && !(typeof MODE_CLOSE !== 'undefined' && MODE_CLOSE.test(m.text.slice(0, 400)))){
      delete res.mode; if (typeof act === 'function') act('자료 닫힘 보류', { why:'동료의 말이 한때 사정(지금은·당장은 …)' });
    }
    if (cueNow && String(res.mode || '').toLowerCase() === 'closed') delete res.mode;   /* 예고한 턴엔 닫지 않는다 */
    if (cueNow){ if (res.ask) res.ask = ''; }
  }
  cueNow = '';
  return res;
}
