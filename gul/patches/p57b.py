import sys
def check(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        if s.count(o)!=1: print('MISMATCH',p,s.count(o),o[:140]); sys.exit(1)
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs: s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)
H=[
("""   v5.7: 무게 어림 —""", """   v5.7: 막기는 선택 — 방패 · 대검 · [반사신경] 은 '들어 올려야' 막음 (drop 하면 갑옷만). 치는 · 던지는 · 약을 붓는 · 재장전하는 동안은 못 막음 (방패 밀치기 · 방패 돌진은 방패로 함).
         막기 자동 = 위협이 보이면 들고 없으면 내림 · 유지 = 늘 듦 (치지 않음, 밀치기만) · 공격 위주 = 안 듦. 드는 데 guard.raise 초 ([반사신경] 은 guard.reflex), 든 채로는 걸음 ×guard.walk.
         나란히 막는 방패끼리 (1.4칸 · 같은 쪽) 방패벽: 막는 폭 +guard.wall°.
   v5.7: 무게 어림 —"""),
("""  mass: { base: 62,""", """  guard: { raise: 0.25, reflex: 0.08, near: 1.2, walk: 0.75, wall: 25 },   // v5.7 막기는 선택: 드는 데 (초) · [반사신경] · 자동이 드는 거리 (상대 손 닿는 곳 + 칸) · 든 채 걸음 × · 방패벽 막는 폭 +°
  mass: { base: 62,"""),
]
T=[
("""canGuard: !!p.shield || !!wp.guard || (p.traits || []).includes('반사신경'), post: 100,""", """canGuard: !!p.shield || !!wp.guard || (p.traits || []).includes('반사신경'), guardMode: 'auto', raised: false, raiseAt: 1e9, reflex: (p.traits || []).includes('반사신경'), post: 100,   // v5.7 막기는 선택"""),
("""const guardOn = (W, u) => u.alive && u.canGuard && W.t >= u.brokenT && !(u.act && !u.shield) && !u.crawl && W.t >= u.proneT && !u.kb && W.t >= (u.stunT || -9);   // v5.5.3 휘청이면 못 막음 · 방패는 돌진 중에도 막음""",
 """const guardOn = (W, u) => u.alive && u.canGuard && u.raised && W.t >= u.raiseAt && W.t >= u.brokenT && !u.crawl && W.t >= u.proneT && !u.kb && W.t >= (u.stunT || -9);   // v5.7 들어 올렸을 때만 · v5.5.3 휘청이면 못 막음
// v5.7 방패벽: 나란히 (1.4칸) 같은 쪽을 보고 막는 방패끼리 — 막는 폭이 넓어짐
const shieldWall = (W, t) => t.shield && W.units.some(o => o !== t && o.alive && o.side === t.side && o.shield && o.raised && W.t >= o.raiseAt && dist(o, t) < 1.4 && angDiff(o.face, t.face) < 0.7);
// v5.7 막기는 선택: 자동 = 위협 (나 · 곁 동료를 노리는 상대, 겨눈 사수, 손 닿는 곳 + near 칸 안의 상대) 이 보이면 들고 없으면 내림 · 유지 = 늘 듦 · 공격 위주 = 안 듦.
// 치는 · 던지는 · 약 · 재장전 · 도약 동안은 못 막음 (방패 밀치기 · 방패 돌진은 방패로 함). 드는 데 raise 초 ([반사신경] 은 reflex 초)
function updateGuard(W, u){
  const G = W.rules.guard || {}, a = u.act, shieldAct = a && (a.k === 'bash' || (a.k === 'charge' && u.shield));
  let want = false;
  if (shieldAct) want = true;
  else if (!a && u.alive && !u.crawl && !u.kb && W.t >= u.proneT && W.t >= (u.stunT || -9)){
    if (u.guardMode === 'hold') want = true;
    else if (u.guardMode !== 'off') want = !!dangerOf(W, u) || W.units.some(e => e.alive && e.side !== u.side && !isFar(e) && gap(u, e) < e.rng + (G.near != null ? G.near : 1.2) && (u.side === 0 ? (e.seenBy || canSee(W, u, e)) : canSee(W, u, e)));
  }
  if (want && !u.raised){ u.raised = true; u.raiseAt = shieldAct ? W.t : W.t + (u.reflex ? (G.reflex != null ? G.reflex : 0.08) : (G.raise != null ? G.raise : 0.25)); }
  else if (!want && u.raised){ u.raised = false; u.raiseAt = 1e9; }
}"""),
("""const inGuard = (W, t, a) => guardOn(W, t) && angDiff(t.face, Math.atan2(a.y - t.y, a.x - t.x)) * 180 / Math.PI <= t.gArc;""",
 """const inGuard = (W, t, a) => guardOn(W, t) && angDiff(t.face, Math.atan2(a.y - t.y, a.x - t.x)) * 180 / Math.PI <= t.gArc + (shieldWall(W, t) ? ((W.rules.guard || {}).wall != null ? W.rules.guard.wall : 25) : 0);   // v5.7 방패벽"""),
("""const spdNow = (W, u) => u.spd * u.spdMul * (W.t < u.pinT ? 0.4 : 1)""", """const spdNow = (W, u) => u.spd * u.spdMul * (u.raised && !(u.act && u.act.k === 'charge') ? ((W.rules.guard || {}).walk || 0.75) : 1) * (W.t < u.pinT ? 0.4 : 1)"""),   # v5.7 방패를 든 채로는 느림
("""    if (!u.alive || !u.canGuard) continue;""", """    if (!u.alive || !u.canGuard) continue;
    updateGuard(W, u);   // v5.7 막기는 선택"""),
("""function startAct(W, u, t, why){
  const heal = u.cls === '치유' && t.side === u.side;""", """function startAct(W, u, t, why){
  const heal = u.cls === '치유' && t.side === u.side;
  // v5.7 막기 유지 중엔 치지 않음 (방패 밀치기만 — 손 닿으면)
  if (!heal && u.guardMode === 'hold' && u.canGuard && !isFar(u)){ if (u.canBash && W.t >= u.bashCd && gap(u, t) <= u.rng + 0.3 && t.side !== u.side) startBash(W, u, t, '막기 유지'); else setMood(W, u, '막기 유지', t.i); return; }"""),
("""function preempt(W, u){
  const o = u.order, a = u.act; let did = false;""", """function preempt(W, u){
  const o = u.order, a = u.act; let did = false;
  if (o && ['attack', 'charge', 'throw', 'amove'].includes(o.k) && u.guardMode === 'hold'){ u.guardMode = 'auto'; L(W, { k: 'guardMode', a: u.i, m: 'auto', why: '공격 명령', vis: true }); }   // v5.7 공격 명령이면 막기 유지를 풂"""),
("""if (typeof module !== 'undefined') module.exports = { downOdds,""", """if (typeof module !== 'undefined') module.exports = { updateGuard, shieldWall, guardOn, inGuard, downOdds,"""),
]
check('rt3_head.js',H); check('rt3_tail.js',T)
patch('rt3_head.js',H); patch('rt3_tail.js',T)
print('ok')
