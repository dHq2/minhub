/* martin/js/habits.js — 수사 버릇 · 실의 이유와 끊기(v0.14, 11-17 B). 고칠 땐 이 줄 아래에 「11-17 B: …」처럼 날짜·방 주석 */
/* 보스: 「세계 최고의 탐정」이라 명령하는 게 아니라, 진짜 수사 기술을 상황에 맞게 골라 쓰게 — 단 프롬프트에 먹히는 기계는 싫다.
   그래서 기술 목록(35개)이 아니라 마틴의 몸에 밴 「버릇」 일곱 줄 + 때를 골라 켜는 두 가지만 둔다. 대사엔 기술 이름이 아니라 버릇의 결과만 나온다.
   · habitText() — buildPrompt 의 「판단 규칙」 바로 아래(ai.js 한 줄). 늘 들어가는 버릇 + 때가 맞을 때만 「뒤집어 보기」·「전제 의심」.
   · tagSpot — 실 꼬리표 자리. 실 한가운데가 카드 위면 실을 따라 카드 없는 곳으로 옮긴다(board.js renderStrings 한 줄에서 부름).
   · 판(첫 장편 사건 최종판): 실이 거의 다 한 사람에게로만 모이고 조각끼리 잇는 실이 없었다, 추측 실(점선)이 끝까지 물음표로 남았다.
     → 실에 why(왜 이었나), 틀린 실은 cut 으로 끊음(S.cuts 에 남아 다시 잇지 않게). doOp 는 board.js(A) — 여기서 감싸서 cut·why 만 더한다 */
const HABITS = `수사 버릇 (몸에 밴 것 — 기술 이름은 입에 올리지 않고 결과만 말한다)
- 빈 주어 채우기: 대화 캡처를 읽으면 빠진 주어·목적어와 「그거·거기·그때·그 사람」이 누구·무엇인지 앞뒤로 채운다. 후보가 둘이면 둘 다 들고 간다. 채운 건 원문이 아니라 네 읽기다.
- 그때 알 수 있었나: 누가 무엇을 말하거나 했으면, 그 사람이 그 시각에 그걸 알 수 있었는지 따진다. 아직 몰랐어야 할 걸 아는 사람이 단서다.
- 사이의 일: 두 조각이 이어지는데 사이가 비면(물건이 다른 손에 가 있다, 장소가 바뀌었다, 말이 바뀌었다) 그 사이에 있어야 할 일을 세운다. 그건 가설이다 — 난제나 수첩 q 로.
- 없음 가르기: 기록이 비는 시간·답이 없는 질문을 보면, 실제로 없었던 건지 우리 손에 안 들어온 건지 먼저 가른다.
- 한 출처: 같은 이야기가 여러 자료에 나와도 처음 말한 사람이 하나면 근거는 하나다. 당사자가 건넨 자료는 그 사람의 주장이다. 판독문은 원본을 옮긴 것이라 원본과 두 번 세지 않는다.
- 조각끼리 잇기: 실을 사람에게만 잇지 않는다. 조각끼리 — 시각이 앞뒤인 것, 같은 물건·장소·말이 나오는 것, 서로 어긋나는 것 — 를 잇는다. 이을 땐 why 에 왜 이었는지 한 줄. 날짜·이름이 같다는 것만으로는 같은 일이라고 잇지 않는다.
- 확률은 말로: 「공산이 크다·반반이다·희박하다」. 근거 없이 정밀한 숫자를 붙이지 않는다.`;
const HB_FLIP = /(결론|범인|진범|누가\s*(했|한|그랬)|누구(야|지|냐|일까)|정리해|진실|확정|마무리|맞(지|아)\s*\?|그 사람이(지|야))/;
let hbPremiseNow = false;
function hbLastMove(){   /* 판이 마지막으로 움직인 턴 — 새 자료·난제 변화 */
  let t = -1;
  for (const e of S.ev || []) if (e.turn != null && e.turn > t) t = e.turn;
  for (const p of S.probs || []) for (const g of p.log || []) if (g.turn != null && g.turn > t) t = g.turn;
  return t;
}
function habitText(){
  if (!S) return '';
  const out = [HABITS], last = [...(S.log || [])].reverse().find(l => l.who === 'p'), said = last && last.text || '';
  if (HB_FLIP.test(said)) out.push(`[이번엔 뒤집어 보기] 동료가 결론 쪽을 묻는다. 답하기 전에 지금 가장 유력한 가설이 틀렸다고 치고, 무엇이 판을 설명하는지 한 번 세워 본다. 버티면 왜 버티는지 한 줄, 무너지면 바로 고친다(kill·cut·edit). 반대 가설은 난제 지도에 남긴다.`);
  const lm = Math.max(0, hbLastMove()); hbPremiseNow = false;
  if (S.turn >= 8 && S.turn - lm >= 6 && S.turn - (S.premiseAt ?? -99) >= 6){ hbPremiseNow = true;
    out.push(`[전제 의심] ${S.turn - lm}턴째 판이 제자리다(새 자료도 난제 변화도 없다). 이번 답에서 전제를 하나 골라 의심해 본다 — 우리가 질문 자체를 잘못 잡았을 수 있다. 「잠깐」으로 시작해도 좋다. 틀린 전제가 보이면 난제·실을 고친다.`); }
  if ((S.cuts || []).length) out.push(`끊은 실(다시 잇지 않는다 — 새 근거가 오면 그때만): ${S.cuts.slice(-8).map(c => `${c.a}↔${c.b}${c.label ? ' ' + c.label : ''} — ${c.why || '이유 없음'}`).join(' / ')}`);
  return out.join('\n') + '\n';
}
/* doOp 감싸기 — link 에 why, 새 op cut. board.js(A)의 doOp 는 그대로 두고 앞뒤에서만 */
{
  const doOpBase = doOp;
  doOp = async function(op){
    if (op && op.op === 'cut'){
      const L = (S.links || []).find(x => (x.a === op.a && x.b === op.b) || (x.a === op.b && x.b === op.a) || x.id === op.id); if (!L) return;
      const A = nodeOf(L.a), B = nodeOf(L.b);
      if (A && B){ await fly((A.x + B.x) / 2, (A.y + B.y) / 2, Math.max(.45, Math.min(cam.k, 1)), 550); }
      (S.cuts || (S.cuts = [])).push({ a:L.a, b:L.b, label:L.label || '', why:String(op.why || '').slice(0, 80), turn:S.turn, at:Date.now() }); if (S.cuts.length > 30) S.cuts.splice(0, S.cuts.length - 30);
      S.links = S.links.filter(x => x !== L); renderStrings(); act('실 끊음', { ids:[L.a, L.b], label:L.label || '', why:op.why || '' });
      if (A && B && typeof sfx === 'function') sfx((A.x + B.x) / 2, (A.y + B.y) / 2 - 40, '툭'); await sleep(600); return;
    }
    const r = await doOpBase(op);
    if (op && op.op === 'link' && op.why){ const L = (S.links || []).find(x => (x.a === op.a && x.b === op.b) || (x.a === op.b && x.b === op.a)); if (L){ L.why = String(op.why).slice(0, 80); L.whyTurn = S.turn; } }
    if (op && op.op === 'link' && S.cuts){ S.cuts = S.cuts.filter(c => !((c.a === op.a && c.b === op.b) || (c.a === op.b && c.b === op.a))); }   /* 다시 이었으면 끊은 기록에서 뺀다 */
    return r;
  };
}
if (typeof UNDO_SKIP !== 'undefined') UNDO_SKIP.add('premiseAt');
/* 이번 프롬프트가 「전제 의심」을 시켰으면 기록 — 6턴 안엔 다시 안 시킴(modeFilter 뒤에 붙어 돈다) */
{
  const mf = typeof modeFilter === 'function' ? modeFilter : null;
  modeFilter = function(res){ if (hbPremiseNow){ S.premiseAt = S.turn; hbPremiseNow = false; } return mf ? mf(res) : res; };
}
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
