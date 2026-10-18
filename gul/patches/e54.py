import sys
def patch(p, pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        c=s.count(o)
        if c!=1: print('MISMATCH',p,c,o[:120]); sys.exit(1)
        s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)

# 먼저 모두 확인 (하나라도 어긋나면 아무것도 안 씀)
H='rt3_head.js'; T='rt3_tail.js'
head_pairs=[
("/* ===== 전투 엔진 v5.3 —", "/* ===== 전투 엔진 v5.4 —"),
("   v5.3: 돌격 = 보병", """   v5.4: 지휘 = 재능 [지휘S/A/B/C] (4 · 3 · 2 · 1점). 편의 지휘력 (살아 있는 지휘의 합) 이 있으면 진형 · 대치: 탱커를 앞에, 창은 탱커 바로 뒤 (방진 틈으로 찌름),
         칼은 양 날개, 사수는 뒤. 상대 맨 앞에서 form.gap 칸 떨어져 서로 틈을 노리며 옆으로 돎 (서클링). 들어가는 때: 우위 · 빈틈 · 사격에 밀림 · 오래 대치 (인내는 지휘만큼 김) · 맞붙음.
         지휘가 쓰러지면 진형이 풀림. 지휘가 없으면 마구 들어감. 돌격 예고 (charge.wind 초 준비 — 예고선), 혼자 진형에 뛰어들지 않음 (지휘가 있으면 더 엄격).
         방진: 한 명이라도 더 붙어 설수록 굳건함 (버팀 무게 · 막을 때 자세 덜 깎임) — 탱커 뒤 창 · 보병도 방진. 창은 모두 장창 (사거리 1.5).
   v5.3: 돌격 = 보병"""),
("""'창':{rng:1.0, kind:'날붙이'},""", """'창':{rng:1.5, kind:'날붙이'},"""),
("""'어부의 창':{rng:1.0, kind:'날붙이'}""", """'어부의 창':{rng:1.5, kind:'날붙이'}"""),
("""  grades: { '속력': { S: 1.35, A: 1.2, B: 1.1, C: 1.05 }, '괴력': { S: 1.6, A: 1.45, B: 1.3, C: 1.15 } },""",
 """  grades: { '속력': { S: 1.35, A: 1.2, B: 1.1, C: 1.05 }, '괴력': { S: 1.6, A: 1.45, B: 1.3, C: 1.15 }, '지휘': { S: 4, A: 3, B: 2, C: 1 } },   // v5.4 [지휘X] = 편의 지휘력 점수
  // v5.4 진형 · 대치: gap = 상대 맨 앞에서 떨어져 서는 거리 (칸), sway · amp = 옆으로 도는 빠르기 (rad/초) · 폭 (칸), patience + 지휘력 × perCmd = 대치를 참는 시간 (초),
  // adv = 이만큼 우세하면 들어감, open = 빈틈 (돌격 값이 기준보다 이만큼 높음) 이면 들어감, walk = 진형으로 걷는 속력 ×, lane = 탱커 사이 (칸), postForm = 방진 한 명마다 막을 때 자세 덜 깎임
  form: { gap: 4, sway: 0.35, amp: 1.2, patience: 6, perCmd: 1.5, adv: 1.5, open: 0.8, walk: 0.7, lane: 1.1, postForm: 0.15 },"""),
("""  charge: { min: 1.5, max: 5, spd: 2.2,""", """  charge: { wind: 0.35, min: 1.5, max: 5, spd: 2.2,"""),
]
tail_pairs=[
# 유닛: 지휘
("""      heads: tr.includes('머리 넷') ? 4 : 1,""", """      cmd: cmdOf0(p, rules),   // v5.4 [지휘X] 점수
      heads: tr.includes('머리 넷') ? 4 : 1,"""),
("""covers: {}, fxOn""", """covers: {}, stance: {}, farDmg: [0, 0], fxOn"""),
# 돌격 예고 (준비 → 달림)
("""  const d = dist(u, t) || 1, sp = spdNow(W, u) * (C.spd || 2.2);
  u.act = { k: 'charge', phase: 'run', b: t.i, t0: W.t, end: W.t + (d + 0.6) / sp, dx: (t.x - u.x) / d, dy: (t.y - u.y) / d, sp };""",
 """  // v5.4 돌격 예고: wind 초 동안 자세를 낮추고 노려봄 (예고선) → 달림
  u.act = { k: 'charge', phase: 'wind', b: t.i, t0: W.t, end: W.t + (C.wind != null ? C.wind : 0.35) };"""),
("""function resolveAct(W, u){""", """function resolveAct(W, u){
  if (u.act.k === 'charge' && u.act.phase === 'wind'){   // v5.4 예고 끝 → 그때 상대 쪽으로 달림
    const C = W.rules.charge || {}, t = W.units[u.act.b];
    if (!t || !t.alive){ u.act = null; return; }
    const d = dist(u, t) || 1, sp = spdNow(W, u) * (C.spd || 2.2);
    u.act = { k: 'charge', phase: 'run', b: t.i, t0: W.t, end: W.t + (d + 0.6) / sp, dx: (t.x - u.x) / d, dy: (t.y - u.y) / d, sp };
    u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x); return;
  }"""),
# 혼자 뛰어들지 않음 (지휘가 있으면 엄격)
("""  const crowd = W.units.filter(o => o.alive && o !== t && o.side === t.side && !isFar(o) && dist(o, t) < 1.6).length, mates = W.units.filter(o => o.alive && o !== u && o.side === u.side && dist(o, t) < 2.2).length;
  if (crowd > mates + 1) v -= 1.5 * (crowd - mates - 1);""",
 """  // v5.4 혼자 뛰어들지 않음: 부딪힐 자리 둘레 (2.2칸) 상대 근접 수 > 따라올 동료 (상대 2.5칸 · 나 1.6칸 안 근접) + 1 이면 깎음. 진형을 떠나는 전선 (대치 중) 도.
  // 지휘가 있으면 이 판단이 엄격 (×1.5), 없으면 무모함 (×0.6)
  const cm = cmdOf(W, u.side) > 0 ? 1.5 : 0.6;
  const foesAt = W.units.filter(o => o.alive && o.side === t.side && !isFar(o) && dist(o, t) < 2.2).length, supp = W.units.filter(o => o.alive && o !== u && o.side === u.side && !isFar(o) && (dist(o, t) < 2.5 || dist(o, u) < 1.6)).length;
  if (foesAt > supp + 1) v -= 1.8 * cm * (foesAt - supp - 1);
  if (u.role === '전선' && W.stance[u.side] && W.stance[u.side].k === 'hold' && W.units.some(o => o.alive && o !== u && o.side === u.side && dist(o, u) < 1.5)) v -= 1.5 * cm;"""),
# 방진: 한 명이라도 더 → 막을 때 자세 덜 깎임
("""rv(W, 'wallPost', 1.3) : 1); t.blockT = W.t; t.blocked++;""", """rv(W, 'wallPost', 1.3) : 1) / (1 + ((W.rules.form || {}).postForm != null ? W.rules.form.postForm : 0.15) * formMates(W, t)); t.blockT = W.t; t.blocked++;   // v5.4 방진: 붙어 선 동료만큼 덜 깎임"""),
# 원거리 피해 셈 (사격에 밀리는가)
("""  if (o.ff) u.ff += real;""", """  if (o.ff) u.ff += real;
  if (o.far && !o.ff && W.farDmg) W.farDmg[t.side] += real;   // v5.4 사격에 밀리는가 (대치)"""),
# 진형 지키기 (자동)
("""  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠""", """  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠
  if (!u.order && holdForm(W, u, dt)) return;   // v5.4 진형 · 대치"""),
# 세상 한 걸음: 대치 판단
("""W.sqT = (W.sqT || 0) - dt; if (W.sqT <= 0){ W.sqT = (R.squad || {}).t || 0.5; planSquads(W); }""",
 """W.sqT = (W.sqT || 0) - dt; if (W.sqT <= 0){ W.sqT = (R.squad || {}).t || 0.5; planSquads(W); planStance(W); }   // v5.4 진형 · 대치"""),
("""if (typeof module !== 'undefined') module.exports = { avoidGiant,""", """if (typeof module !== 'undefined') module.exports = { cmdOf, cmdOf0, formMates, planStance, holdForm, avoidGiant,"""),
("""  for (const da of [0.5, -0.5, 0.9, -0.9, 0.25, -0.25]) for (const dr of [0.1, 0.3]){""", """  for (const da of [0, 0.25, -0.25, 0.5, -0.5, 0.9, -0.9]) for (const dr of [0.1, 0.3]){   // v5.4 장창: 동료 바로 뒤부터 (방진 틈으로)"""),
("""/* ---------- v5.2 적의 조 나누기 · 산개 ---------- */""", open('v54_block.js',encoding='utf-8').read() + """/* ---------- v5.2 적의 조 나누기 · 산개 ---------- */"""),
]
for p,pairs in [(H,head_pairs),(T,tail_pairs)]:
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        if s.count(o)!=1: print('MISMATCH',p,s.count(o),o[:120]); sys.exit(1)
patch(H,head_pairs); patch(T,tail_pairs)
print('ok')
