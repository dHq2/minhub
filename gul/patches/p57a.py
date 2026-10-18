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
("/* ===== 전투 엔진 v5.6 —", "/* ===== 전투 엔진 v5.7 —"),
("""   v5.6: 줍기 · 회수""", """   v5.7: 무게 어림 — 키 · 무게가 비어 있으면 체력으로 몸집을 어림 (기본 체력 106 = 62kg, 체력^0.6), 방패는 +8kg. 넘어짐은 확률 — 부딪힌 속력 (돌격) · 날아간 거리 (밀침)
         × 무게 비 (민 쪽 / 받은 쪽)^0.5, 막고 있었으면 ×0.6, 붙어 선 동료 (전열) 한 명마다 덜 넘어짐.
   v5.6: 줍기 · 회수"""),
("""  mass: { base: 62, exp: 2.5, giant: 1.3, armor: 400 },""", """  mass: { base: 62, exp: 2.5, giant: 1.3, armor: 400, hpRef: 106, hpExp: 0.6, shield: 8 },   // v5.7 키 · 무게가 비면 체력으로 어림 (hpRef 체력 = base kg, ^hpExp), 방패 +shield kg"""),
]
T=[
("""function massOf(p, rules, h, gear){
  if (p.weight != null && p.weight !== '' && +p.weight > 0) return +p.weight;
  const M = rules.mass || {}, tr = p.traits || [];
  const body = (M.base || 62) * Math.pow(h / 1.7, M.exp || 2.5) * (tr.includes('거구') ? M.giant || 1.3 : 1);""",
 """function massOf(p, rules, h, gear, hp){
  if (p.weight != null && p.weight !== '' && +p.weight > 0) return +p.weight;
  const M = rules.mass || {}, tr = p.traits || [];
  // v5.7 키도 무게도 비어 있으면 (거구 · 짐승 아님) 체력으로 몸집을 어림 — 체력 1265 의 괴물이 62kg 이던 것
  const est = !(p.height != null && +p.height > 0) && !tr.includes('거구') && p.tac !== 'pack' && hp > 0;
  const body = est ? (M.base || 62) * Math.max(0.75, Math.min(5, Math.pow(hp / (M.hpRef || 106), M.hpExp != null ? M.hpExp : 0.6))) : (M.base || 62) * Math.pow(h / 1.7, M.exp || 2.5) * (tr.includes('거구') ? M.giant || 1.3 : 1);"""),
("""  return Math.round(body + arm);
}""", """  return Math.round(body + arm + (p.shield ? (M.shield != null ? M.shield : 8) : 0));   // v5.7 방패 무게
}"""),
("""mass: massOf(p, rules, hh, gearOf(p, rules)),""", """mass: massOf(p, rules, hh, gearOf(p, rules), s.hp), massEst: !(p.weight > 0) && !(p.height > 0) && !tr.includes('거구'),"""),
# 넘어짐 확률
("""  if (K.left <= 0.01){ u.kb = null; if (K.o.down != null ? K.o.down : K.len >= (S.downLen || 0.9)) knockDown(W, u, S.prone || 0.9, K.by, '나가떨어짐'); }""",
 """  if (K.left <= 0.01){ u.kb = null; if (W.rand() < downOdds(W, u, K)) knockDown(W, u, S.prone || 0.9, K.by, '나가떨어짐'); }   // v5.7 넘어짐은 확률"""),
("""// 막을 수 없는 몸 충격 (짓뭉개짐 · 부딪힘 · 짓밟기)""", """// v5.7 넘어질 확률: 기세 (돌격은 부딪힌 속력 v, 밀침은 날아간 거리) × (민 쪽 무게 / 받은 쪽 무게)^0.5 (1.5 까지) · 막고 있었으면 ×0.6 · 붙어 선 동료마다 덜 (전열의 관절)
function downOdds(W, u, K){
  const S = W.rules.shove || {}, C = W.rules.charge || {}, a = W.units[K.by], dv = C.downV || 4, dl = S.downLen || 0.9;
  let p = K.o.v != null ? (K.o.v - dv * 0.6) / (dv * 0.8) : (K.len - dl * 0.5) / dl;
  if (a && a !== u) p *= Math.min(1.5, Math.sqrt((a.mass || 62) / Math.max(20, u.mass || 62)));
  if (a && guardOn(W, u) && inGuard(W, u, a)) p *= 0.6;
  p /= 1 + 0.25 * formMates(W, u) + (u.line ? 0.15 * Math.min(4, u.line.n - 1) : 0);
  return Math.max(0, Math.min(0.95, p));
}
// 막을 수 없는 몸 충격 (짓뭉개짐 · 부딪힘 · 짓밟기)"""),
("""fling(W, u, hit, vB2 * KB * shK, nx, ny, { how: hc ? 'clash' : 'charge', down: vB2 > dv });""", """fling(W, u, hit, vB2 * KB * shK, nx, ny, { how: hc ? 'clash' : 'charge', v: vB2 });"""),
("""fling(W, hit, u, -vA2 * KB * (sh ? 0.6 : 1), -nx, -ny, { how: 'recoil', down: -vA2 * (sh ? 0.6 : 1) > dv });""", """fling(W, hit, u, -vA2 * KB * (sh ? 0.6 : 1), -nx, -ny, { how: 'recoil', v: -vA2 * (sh ? 0.6 : 1) });"""),
]
check('rt3_head.js',H); check('rt3_tail.js',T)
patch('rt3_head.js',H); patch('rt3_tail.js',T)
print('ok')
