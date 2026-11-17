/* martin/js/habits.js — 실의 이유와 끊기 · 꼬리표 자리 · 결론 물음 감지 v1.2 (11-17 B · v1.2: doOp·modeFilter 감싸기를 걷고 실 기록 함수·답 받기 단계로). 고칠 땐 이 줄 아래에 「11-17 B: …」처럼 날짜·방 주석 */
/* v1.1(11-17 B, 프롬프트 통일 규칙): 버릇 일곱 줄(habitText)은 rules.js 원칙(근거·무게·의심)으로 녹였다. 여기 남은 것:
   · HB_FLIP·hbLastMove — 「이번 턴에 걸린 것」(rules.js)이 뒤집어 보기·전제 의심을 고를 때 읽는다. hbPremiseNow 는 rules.js 가 켜고 hbStep(답 받기 단계)이 S.premiseAt 에 적는다.
   · 실 기록 strLink·strCut·strFind — link 의 why(L.why), cut(S.cuts — boardText 의 「끊은 실」로 보임). board.js doOp 와 tidy.js 판 정리가 같이 부른다(v1.2 — 감싸기 걷음).
   · tagSpot — 실 꼬리표 자리(board.js renderStrings 가 부름). */
const HB_FLIP = /(결론|범인|진범|누가\s*(했|한|그랬)|누구(야|지|냐|일까)|정리해|진실|확정|마무리|맞(지|아)\s*\?|그 사람이(지|야))/;
let hbPremiseNow = false;
function hbLastMove(){   /* 판이 마지막으로 움직인 턴 — 새 자료·난제 변화 */
  let t = -1;
  for (const e of S.ev || []) if (e.turn != null && e.turn > t) t = e.turn;
  for (const p of S.probs || []) for (const g of p.log || []) if (g.turn != null && g.turn > t) t = g.turn;
  return t;
}
/* 11-17 B: habitText 는 걷었다 — 버릇 일곱 줄은 rules.js 원칙(근거·무게·의심)으로, 뒤집어 보기·전제 의심은 「이번 턴에 걸린 것」으로, 끊은 실은 boardText 의 상태로 */
/* 실 기록 — 잇기(이유)·끊기(이유와 함께 S.cuts)를 한 곳에서. 대화 중 판 고침(board.js doOp)과 판 정리(tidy.js)가 같이 부른다 */
function strLink(a, b, label, sure, why){
  const old = S.links.find(L => (L.a === a && L.b === b) || (L.a === b && L.b === a));
  const L = old || { id:a + '-' + b, a, b }; L.label = String(label || '').slice(0, 8); L.sure = sure !== false; if (!old) S.links.push(L);
  if (why){ L.why = String(why).slice(0, 80); L.whyTurn = S.turn; }
  if (S.cuts) S.cuts = S.cuts.filter(c => !((c.a === a && c.b === b) || (c.a === b && c.b === a)));   /* 다시 이었으면 끊은 기록에서 뺀다 */
  return L;
}
function strFind(x){ return x && (S.links || []).find(L => L.id === x.id || L.id === x || (x.a && ((L.a === x.a && L.b === x.b) || (L.a === x.b && L.b === x.a))) || (typeof x === 'string' && L.b + '-' + L.a === x)); }
function strCut(L, why){
  (S.cuts || (S.cuts = [])).push({ a:L.a, b:L.b, label:L.label || '', why:String(why || '').slice(0, 80), turn:S.turn, at:Date.now() }); if (S.cuts.length > 30) S.cuts.splice(0, S.cuts.length - 30);
  S.links = S.links.filter(x => x !== L); act('실 끊음', { ids:[L.a, L.b], label:L.label || '', why:why || '' });
}
if (typeof UNDO_SKIP !== 'undefined') UNDO_SKIP.add('premiseAt');
/* 답 받기 단계(rules.js RES_STEPS) — 이번 프롬프트가 「전제 의심」을 실었으면 그 턴을 적는다(6턴 안엔 다시 안 실림) */
function hbStep(res){ if (hbPremiseNow){ S.premiseAt = S.turn; hbPremiseNow = false; } return res; }
/* 실 꼬리표 자리 — 핀에서 핀까지 곧은 실 위, 한가운데부터 바깥쪽으로 훑어 카드와 다른 꼬리표를 피한 첫 자리 */
const TAG_T = [.5, .42, .58, .34, .66, .27, .73, .2, .8];
function tagSpot(L, c, placed){
  const A = nodeOf(L.a), B = nodeOf(L.b); if (!A || !B) return { x:c.lx, y:c.ly };
  const pa = pinOf(A), pb = pinOf(B), boxes = S.nodes.map(n => ({ l:n.x - (n.w || 112) / 2 - 12, r:n.x + (n.w || 112) / 2 + 12, t:n.y - (n.h || 140) / 2 - 10, b:n.y + (n.h || 140) / 2 + 10 }));
  let best = null, bestHit = 1e9;
  for (const t of TAG_T){
    const x = pa.x + (pb.x - pa.x) * t, y = pa.y + (pb.y - pa.y) * t;
    const hit = boxes.filter(q => x > q.l && x < q.r && y > q.t && y < q.b).length * 10 + placed.filter(q => Math.abs(q.x - x) < 70 && Math.abs(q.y - y) < 26).length * 4 + Math.abs(t - .5) * 2;
    if (hit < bestHit){ bestHit = hit; best = { x:Math.round(x), y:Math.round(y) }; }
  }
  placed.push(best); return best;
}
