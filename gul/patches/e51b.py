import sys
def patch(p, pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        c=s.count(o)
        if c!=1: print('MISMATCH',p,c,o[:100]); sys.exit(1)
        s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)
patch('rt3_head.js',[
("""  // v5.1 갑옷 · 투구 ([갑피] = 둘 다 몸에): 맞은 무기 종류별 받는 피해 × — 갑옷은 몸통 · 팔 · 다리, 투구는 머리 (헤드샷 · 날붙이에 강하고 둔기에 약함)
  armor: {
    '갑옷': { '날붙이': 0.7, '둔기': 0.9, '짐승': 0.75, '활': 0.6, '총포류': 0.85, '마법': 1, '맨손': 0.8 },
    '투구': { '날붙이': 0.5, '둔기': 0.85, '짐승': 0.6, '활': 0.45, '총포류': 0.6, '마법': 1, '맨손': 0.7 },
  },""",
"""  // v5.1 방어구 재질: 몸 칸 (몸통 · 팔 · 다리) · 머리 칸. vs = 3성 기준 받는 피해 × (등급이 오르면 막는 몫 × 등급/3, 0.15 아래로는 안 내려감), w = 등급마다 무게 (속력에서 뺌)
  armor: {
    '판금': { slot: '몸', w: 0.02, vs: { '날붙이': 0.65, '둔기': 0.9, '짐승': 0.7, '활': 0.55, '총포류': 0.85, '마법': 1, '맨손': 0.75 } },
    '사슬': { slot: '몸', w: 0.012, vs: { '날붙이': 0.7, '둔기': 0.95, '짐승': 0.75, '활': 0.7, '총포류': 0.9, '마법': 1, '맨손': 0.85 } },
    '가죽': { slot: '몸', w: 0.006, vs: { '날붙이': 0.85, '둔기': 0.9, '짐승': 0.8, '활': 0.85, '총포류': 0.95, '마법': 1, '맨손': 0.85 } },
    '방탄': { slot: '몸', w: 0.01, vs: { '날붙이': 0.85, '둔기': 0.9, '짐승': 0.85, '활': 0.7, '총포류': 0.55, '마법': 1, '맨손': 0.9 } },
    '투구': { slot: '머리', w: 0.004, vs: { '날붙이': 0.5, '둔기': 0.85, '짐승': 0.6, '활': 0.45, '총포류': 0.6, '마법': 1, '맨손': 0.7 } },   // 헤드샷 · 날붙이에 강하고 둔기에 약함
  },
  galpi: 3,           // [갑피] (피부가 갑옷 + 투구): 몸 칸 판금 · 머리 칸 투구를 이 등급으로 (무게 없음, 더 좋은 장비를 입으면 그 칸은 장비)"""),
("""'저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:80, kind:'총포류'},""","""'저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:80, kind:'총포류'}, '어부의 창':{rng:1.0, kind:'날붙이'},"""),
])
patch('rt3_tail.js',[
("""const roleStat = (p, rules) => (rules.roles && rules.roles[roleOf(p, rules)]) || {};""",
"""const roleStat = (p, rules) => (rules.roles && rules.roles[roleOf(p, rules)]) || {};
// v5.1 방어구: p.gear = { 몸: { name, mat, tier }, 머리: { … } } (재질 = rules.armor). [갑피] 는 몸에 판금 · 투구 (galpi 등급, 무게 없음) — 더 좋은 장비면 그 칸은 장비
const GEAR_SLOTS = ['몸', '머리'];
function gearOf(p, rules){
  const G = p.gear || {}, A = rules.armor || {}, out = {};
  for (const slot of GEAR_SLOTS){ const it = G[slot]; if (it && A[it.mat]) out[slot] = { name: it.name || it.mat, mat: it.mat, tier: Math.max(1, Math.min(5, Math.round(+it.tier || 1))) }; }
  if ((p.traits || []).includes('갑피')){
    const tg = rules.galpi || 3;
    if (A['판금'] && (!out['몸'] || out['몸'].tier < tg)) out['몸'] = { name: '갑피', mat: '판금', tier: tg, innate: true };
    if (A['투구'] && (!out['머리'] || out['머리'].tier < tg)) out['머리'] = { name: '갑피', mat: '투구', tier: tg, innate: true };
  }
  return out;
}
const gearW = (g, rules) => Object.values(g || {}).reduce((s, it) => s + (it.innate ? 0 : it.tier * (((rules.armor || {})[it.mat] || {}).w || 0)), 0);
// 맞은 부위 · 무기 종류에 따른 방어구 받는 피해 ×
function armorMul(rules, t, part, wk){
  const it = t.gear && t.gear[part === '머리' ? '머리' : '몸']; if (!it) return { m: 1, it: null };
  const M = (rules.armor || {})[it.mat]; if (!M || !M.vs || M.vs[wk] == null) return { m: 1, it };
  return { m: Math.max(0.15, Math.min(1, 1 - (1 - M.vs[wk]) * it.tier / 3)), it };
}
// 입기 · 벗기 (싸우는 중에도): 같은 칸은 바뀜 (예: 노먼의 방탄복 2성 → 갑주 5성 = 무게가 늘고 더 막음). item = null 이면 벗음
function equip(W, u, slot, item){
  u.gear = u.gear || {};
  const A = W.rules.armor || {};
  if (item && A[item.mat]) u.gear[slot] = { name: item.name || item.mat, mat: item.mat, tier: Math.max(1, Math.min(5, Math.round(+item.tier || 1))) }; else delete u.gear[slot];
  u.spd = +(u.spd0 * (1 - gearW(u.gear, W.rules))).toFixed(2);
  if (W.log) L(W, { k: 'equip', a: u.i, slot, name: u.gear[slot] ? u.gear[slot].name : null, tier: u.gear[slot] ? u.gear[slot].tier : null });
}"""),
("""    spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1) * gradeMul(rules, p.traits, '속력') * (RO.spd || 1)).toFixed(2),""",
"""    spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1) * gradeMul(rules, p.traits, '속력') * (RO.spd || 1) * (1 - gearW(gearOf(p, rules), rules))).toFixed(2),   // 방어구 무게만큼 느려짐"""),
("""      arm: tr.includes('갑옷') || tr.includes('갑피'), helm: tr.includes('투구') || tr.includes('갑피'), undying: tr.includes('불사'), down: false, riseT: null,""",
"""      gear: gearOf(p, rules), undying: tr.includes('불사'), down: false, riseT: null,"""),
("""  const armK = part === '머리' ? (t.helm ? '투구' : null) : (t.arm ? '갑옷' : null), AR = (R.armor || {})[armK] || {}, armMul = armK && AR[wk] != null ? AR[wk] : 1;
  const dmg = Math.max(1, Math.round(base * flank * (P[part] ? P[part].mul : 1) * (amb ? R.ambushMul || 1 : 1) * (crit ? J.critMul : 1) * armMul));
  o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit; o.armor = armMul < 1 ? armK : null; o.wk = wk;""",
"""  const AM = armorMul(R, t, part, wk), armMul = AM.m;
  const dmg = Math.max(1, Math.round(base * flank * (P[part] ? P[part].mul : 1) * (amb ? R.ambushMul || 1 : 1) * (crit ? J.critMul : 1) * armMul));
  o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit; o.armor = armMul < 1 ? AM.it.name : null; o.armMul = +armMul.toFixed(2); o.wk = wk;"""),
("""if (typeof module !== 'undefined') module.exports = { rise, startReload,""","""if (typeof module !== 'undefined') module.exports = { gearOf, gearW, armorMul, equip, GEAR_SLOTS, rise, startReload,"""),
])
# spd0 (방어구 무게 빼기 전) — 유닛에 저장
s=open('rt3_tail.js',encoding='utf-8').read()
o="""      x: p.x, y: p.y, home: { x: p.x, y: p.y }, r: bodyR(p.tier), hp: s.hp, max: s.hp, atk: s.atk, spd: s.spd, rng: s.rng,"""
n="""      x: p.x, y: p.y, home: { x: p.x, y: p.y }, r: bodyR(p.tier), hp: s.hp, max: s.hp, atk: s.atk, spd: s.spd, spd0: (p.ov && p.ov.spd != null) ? s.spd : +(s.spd / Math.max(0.2, 1 - gearW(gearOf(p, rules), rules))).toFixed(3), rng: s.rng,"""
assert s.count(o)==1, 'spd0'; s=s.replace(o,n); open('rt3_tail.js','w',encoding='utf-8').write(s)
print('ok')
