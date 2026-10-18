# v7.20 엔진 — patch720.py v1.2 (v1.2: 공용 착용 규칙 wearWhy · 가방 칸 bagCapP · [개조된 신체] 장비 제한은 수치표 inv.modBody · 떨어뜨림 로그에 이름 · v1.1: 꺼낼 방패는 새로 들 무기 기준으로 고름 · 몸 충격 (짓뭉갬 · 짓밟기) 도 갑옷이 닳음 · 3단계 소지품: 가방 칸 · 바꿔 들기 (자동 · 명령) · 가방 탄 · 내구도 (무기 · 방패 · 갑옷 · 투구) · 근접 무기 파손 · 방패 부서짐 · 갑옷 망가짐 · 루팅 이름 · 남의 장비 (무게 · 공격 · 준비) · 큰 갑옷 무게 · 두 손 무기 · 카리우스 제한 (몸 갑옷 · 원거리) — 적 · 아군 같은 규칙)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  grab: { p: 0.05, cap: 0.15, cd: 2.5,", """  inv: { cap: { 소형: 5, 중형: 8, 중대형: 10, 대형: 12, 초대형: 14 }, stack: { 일반: 20, 특수: 8, 화살: 30 }, special: ['저격총', '샷건'], swap: 0.8, swapSh: 0.5, ammoT: 1.2, big: 0.35, foreign: { atk: 0.93, wind: 1.06, w: 1.1 }, modBody: { body: false, ranged: false, wmax: 4, head: '중형', cap: 16 } },   /* v7.20 소지품: 체급별 가방 칸 · 탄 한 칸 묶음 · 특수탄 무기 · 바꿔 들기 (초 · 방패 더) · 가방 탄 꺼내기 (초) · 한 단계 큰 갑옷 무게 + · 남의 장비 (근접 공격 × · 준비 × · 갑옷 무게 ×) · [개조된 신체] (카리우스: 몸 갑옷 · 원거리 무기 못 씀 · 무기 4개 · 머리는 일반인 · 가방 16칸) */
  dur: { hit: 0.25, clash: 0.6, breakP: 0.0015, old: 3, blunt: 2, heavy: 3, shield: 0.12, armor: 0.1, low: 25 },   /* v7.20 내구도 (0 ~ 100): 근접 무기 맞힘 · 막힘/막음 − · 막힐 때 부러질 확률 (낡을수록 × 1 + old · 둔기 × · 센 기술 ×) · 방패 막은 피해 × · 갑옷 막아 낸 피해 × · low 아래 낡음 */
  grab: { p: 0.05, cap: 0.15, cd: 2.5,""")
h = rep(h, "'대검':{rng:0.7, guard:true, kind:'날붙이'}", "'대검':{rng:0.7, guard:true, two:true, kind:'날붙이'}")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
# ---------- 갑옷 · 투구: 내구도 · 체급 · 주인 ----------
s = rep(s, "for (const slot of GEAR_SLOTS){ const it = G[slot]; if (it && A[it.mat]) out[slot] = { name: it.name || it.mat, mat: it.mat, tier: Math.max(1, Math.min(5, Math.round(+it.tier || 1))) }; }",
        "for (const slot of GEAR_SLOTS){ const it = G[slot]; if (it && A[it.mat]) out[slot] = { name: it.name || it.mat, mat: it.mat, tier: Math.max(1, Math.min(5, Math.round(+it.tier || 1))), dur: it.dur != null && isFinite(+it.dur) ? Math.max(0, Math.min(100, +it.dur)) : 100, size: it.size || null, own: it.own || null }; }   // v7.20 내구도 · 체급 · 원래 주인")
s = rep(s, "const gearW = (g, rules) => Object.values(g || {}).reduce((s, it) => s + (it.innate ? 0 : it.tier * (((rules.armor || {})[it.mat] || {}).w || 0)), 0);",
        """const gearW = (g, rules, bs) => Object.values(g || {}).reduce((s, it) => s + (it.innate ? 0 : it.tier * (((rules.armor || {})[it.mat] || {}).w || 0) * gearWK(rules, it, bs)), 0);
// v7.20 한 단계 큰 갑옷은 무겁고 (× 1 + big), 남의 장비 (몸에 맞춘 게 아님) 는 × foreign.w — bs = { size: 몸 체급, ref: 주인 }
const gearWK = (rules, it, bs) => { const I = rules.inv || {}; let k = 1; if (!bs) return k; if (it.size && (SIZE_RANK[it.size] || 0) > (SIZE_RANK[bs.size] != null ? SIZE_RANK[bs.size] : 1)) k *= 1 + (I.big != null ? I.big : 0.35); if (it.own && bs.ref && it.own !== bs.ref) k *= (I.foreign || {}).w || 1.1; return k; };
const sizeP = p => p.sizeCls || ((p.traits || []).includes('거구') || p.modBody || (p.traits || []).includes('개조된 신체') ? '대형' : (+p.height || 1.7) >= 2 ? '중대형' : ((+p.height || 1.7) < 1.45 || (+p.weight > 0 && +p.weight < 45)) ? '소형' : '중형');
const bsOf = p => ({ size: sizeP(p), ref: p.ref || ('#' + String(p.name || '').replace(/\\s*\\d+$/, '')) });
const isMB = p => !!p.modBody || (p.traits || []).includes('개조된 신체') || (p.unique || []).includes('개조된 신체');
const eqRuleP = (rules, p) => p.eq || (isMB(p) ? ((rules.inv || {}).modBody || null) : null);
const bagCapP = (rules, p) => +p.bagCap || (eqRuleP(rules, p) || {}).cap || ((rules.inv || {}).cap || {})[sizeP(p)] || 8;
// v7.20 입을 · 들 수 있나 (설계 소지품 화면 · 전리품 공통): 못 하면 까닭, 되면 ''
function wearWhy(rules, p, it){
  const E = eqRuleP(rules, p) || {}, nm = p.name || '', W0 = rules.weapons || {}, bs = SIZE_RANK[sizeP(p)] != null ? SIZE_RANK[sizeP(p)] : 1;
  if (!it) return '없음';
  if (it.k === 'armor' || it.k === 'helm'){
    if (it.dur != null && it.dur <= 0) return '망가짐';
    if (it.k === 'armor' && E.body === false) return nm + ' 몸에 맞는 갑옷은 없음 (투구만)';
    const hs = p.headSize || E.head, b = it.k === 'helm' && hs && SIZE_RANK[hs] != null ? SIZE_RANK[hs] : bs, a = it.size && SIZE_RANK[it.size] != null ? SIZE_RANK[it.size] : b;
    if (a < b) return (it.k === 'helm' ? '머리' : '몸') + '에 비해 작음 (' + it.size + ')'; if (a > b + 1) return '너무 큼 (' + it.size + ')'; return ''; }
  if (it.k === 'shield'){ const wp = W0[p.weapon] || {}; if (it.dur != null && it.dur <= 0) return '부서짐'; if (p.shield) return '이미 방패를 듦'; if (wp.two) return '두 손 무기 (' + p.weapon + ') 를 든 채로는 방패를 못 듦'; if (isRangedW(wp)) return '원거리 무기 (' + p.weapon + ') 를 든 채로는 방패를 못 듦'; return ''; }
  if (it.k === 'weapon'){ const wp = W0[it.name]; if (!wp) return '모르는 무기'; if (E.ranged === false && isRangedW(wp)) return '원거리 무기를 못 씀 (' + nm + ' — 손이 기형)';
    if (wp.req && !sizeOK({ sizeCls: sizeP(p) }, wp.req, (p.traits || []).some(x => /^괴력/.test(x)))) return '근력이 모자람 (' + wp.req + ' 이상 · 괴력)';
    if (p.shield && (wp.two || isRangedW(wp))) return '방패를 든 채로는 못 듦 (' + (wp.two ? '두 손 무기' : '원거리') + ')'; if (it.dur != null && it.dur <= 0 && !isRangedW(wp)) return '부러짐'; return ''; }
  if (it.k === 'ammo') return '탄은 쓰는 무기에 저절로 채움';
  return '끼울 수 없음';
}""")
s = rep(s, """  const M = (rules.armor || {})[it.mat]; if (!M || !M.vs || M.vs[wk] == null) return { m: 1, it };
  return { m: Math.max(0.15, Math.min(1, 1 - (1 - M.vs[wk]) * it.tier / 3)), it };""",
        """  if (it.dur != null && it.dur <= 0) return { m: 1, it: null, broken: it };   // v7.20 망가진 갑옷 · 투구는 막지 못함
  const M = (rules.armor || {})[it.mat]; if (!M || !M.vs || M.vs[wk] == null) return { m: 1, it };
  const lo = (rules.dur || {}).low || 25, f = it.dur != null && it.dur < lo ? 0.5 + 0.5 * it.dur / lo : 1;   // v7.20 낡으면 막는 몫이 줆
  return { m: Math.max(0.15, Math.min(1, 1 - (1 - M.vs[wk]) * it.tier / 3 * f)), it };""")
s = rep(s, """  u.gear = u.gear || {};
  const A = W.rules.armor || {};
  if (item && A[item.mat]) u.gear[slot] = { name: item.name || item.mat, mat: item.mat, tier: Math.max(1, Math.min(5, Math.round(+item.tier || 1))) }; else delete u.gear[slot];
  u.spd = +(u.spd0 * (1 - gearW(u.gear, W.rules))).toFixed(2);""",
        """  u.gear = u.gear || {};
  const A = W.rules.armor || {};
  if (item && slot === '몸' && u.eqRule && u.eqRule.body === false) return;   // v7.20 카리우스: 몸 갑옷 못 입음
  if (item && A[item.mat]) u.gear[slot] = { name: item.name || item.mat, mat: item.mat, tier: Math.max(1, Math.min(5, Math.round(+item.tier || 1))), dur: item.dur != null ? +item.dur : 100, size: item.size || null, own: item.own || null }; else delete u.gear[slot];
  u.spd = +(u.spd0 * (1 - gearW(u.gear, W.rules, { size: sizeOf(u), ref: ownKey(u) }))).toFixed(2);""")
s = rep(s, "spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1) * gradeMul(rules, p.traits, '속력') * (RO.spd || 1) * (1 - gearW(gearOf(p, rules), rules))).toFixed(2)",
        "spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1) * gradeMul(rules, p.traits, '속력') * (RO.spd || 1) * (1 - gearW(gearOf(p, rules), rules, bsOf(p)))).toFixed(2)")
s = rep(s, "spd0: (p.ov && p.ov.spd != null) ? s.spd : +(s.spd / Math.max(0.2, 1 - gearW(gearOf(p, rules), rules))).toFixed(3)",
        "spd0: (p.ov && p.ov.spd != null) ? s.spd : +(s.spd / Math.max(0.2, 1 - gearW(gearOf(p, rules), rules, bsOf(p)))).toFixed(3)")
# ---------- 판 위 인물: 가방 · 든 것의 내구도 · 이름 · 주인 · 착용 규칙 ----------
s = rep(s, "gear: gearOf(p, rules), undying:",
        "gear: gearOf(p, rules), bag: (p.bag || []).filter(it => it && it.k).map((it, k) => ({ ...it, uid: i * 100 + k + 1 })), bagCap: bagCapP(rules, p), eqRule: eqRuleP(rules, p), headSize: p.headSize || (eqRuleP(rules, p) || {}).head || null, wDur: p.wDur != null ? +p.wDur : 100, sDur: p.sDur != null ? +p.sDur : 100, wName: p.wName || '', sName: p.sName || '', wOwn: p.wOwn || null, sOwn: p.sOwn || null, wForeign: !!p.wOwn && p.wOwn !== (p.ref || ('#' + String(p.name || '').replace(/\\s*\\d+$/, ''))), undying:")   # v7.20
# ---------- 남의 무기: 근접 공격 × · 준비 × ----------
s = rep(s, "const base = hiMelee(W, u, t, isF || !!J) * u.atk * u.atkMul *", "const base = hiMelee(W, u, t, isF || !!J) * u.atk * u.atkMul * (u.wForeign && !isF && !J ? ((R.inv || {}).foreign || {}).atk || 0.93 : 1) *")
s = rep(s, "const wpnSpd = (W, u) => ((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).spdW || 1;",
        "const wpnSpd = (W, u) => (((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).spdW || 1) * (u.wForeign ? ((W.rules.inv || {}).foreign || {}).wind || 1.06 : 1);   // v7.20 남의 무기는 살짝 더딤")
# ---------- 내구도: 막음 · 맞음 ----------
s = rep(s, "    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - (pr ? (PR.mul != null ? PR.mul : 0.5) : R.blockMul)) * (t.gTal != null ? t.gTal : 1)))), o);\n    if (!o.far && !J) grabTry(W, t, u, 'block');",
        "    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - (pr ? (PR.mul != null ? PR.mul : 0.5) : R.blockMul)) * (t.gTal != null ? t.gTal : 1)))), o);\n    wearBlock(W, u, t, o, base, extra);   // v7.20 내구도 (방패 · 막은 무기 · 막힌 무기)\n    if (!o.far && !J) grabTry(W, t, u, 'block');")
s = rep(s, "  applyDmg(W, u, t, dmg, o);\n  { const wkb = !J &&", "  applyDmg(W, u, t, dmg, o);\n  wearHit(W, u, t, o, AM0.it, dmg, armMul);   // v7.20 내구도 (친 무기 · 막아 낸 갑옷)\n  { const wkb = !J &&")
# ---------- 땅에 떨어진 것: 루팅 이름 · 내구도 · 주인 ----------
s = rep(s, "  const it = { id: (W.itemN = (W.itemN || 0) + 1), k, name, x: +p.x.toFixed(2), y: +p.y.toFixed(2), owner: u.i, t: W.t, how: how || '', ...(extra || {}) };",
        "  const it = { id: (W.itemN = (W.itemN || 0) + 1), k, name, x: +p.x.toFixed(2), y: +p.y.toFixed(2), owner: u.i, t: W.t, how: how || '', own: ownKey(u), ...(extra || {}) };\n  if (!it.label) it.label = lootName(u, k, name);   // v7.20 '검기사의 장검' · '창병의 방패'")
s = rep(s, "  if (u.weapon && !ITEM_NATURAL.includes(u.weapon) && !(u.jav && !u.spearHeld) && !u.weaponGone) dropItem(W, u, 'weapon', u.weapon, u.ammo != null ? { ammo: u.ammo, mag: u.mag } : null, how);",
        "  if (u.weapon && !ITEM_NATURAL.includes(u.weapon) && !(u.jav && !u.spearHeld) && !u.weaponGone) dropItem(W, u, 'weapon', u.weapon, heldItem(u), how);   // v7.20 내구도 · 이름 · 주인째")
s = rep(s, "  if (u.shield){ dropItem(W, u, 'shield', '방패', null, how); u.shield = false; } }",
        "  if (u.shield){ dropItem(W, u, 'shield', '방패', { dur: u.sDur, label: u.sName || '', own: u.sOwn || ownKey(u) }, how); u.shield = false; } }")
s = rep(s, "  const wn = a.weapon, it = dropItem(W, a, 'weapon', wn, null, 'grab');", "  const wn = a.weapon, it = dropItem(W, a, 'weapon', wn, heldItem(a), 'grab');")
# ---------- 집어 들 수 있나: 원거리 금지 (카리우스) · 두 손 무기와 방패 ----------
s = rep(s, "  if (it.k === 'shield') return (!u.shield || u.armShield) && !(u.arms && u.arms.L) && !(isFar(u) && isRangedW((W.rules.weapons || {})[u.weapon] || {}));",
        "  if (it.k === 'shield') return (!u.shield || u.armShield) && !(u.arms && u.arms.L) && !(isFar(u) && isRangedW((W.rules.weapons || {})[u.weapon] || {})) && !(!u.weaponGone && ((W.rules.weapons || {})[u.weapon] || {}).two);   // v7.20 두 손 무기 (대검) 는 방패와 함께 못 듦")
s = rep(s, "  if (wp.req && !sizeOK(u, wp.req, (u.traits || []).some(x => /^괴력/.test(x)))) return false;",
        "  if (wp.req && !sizeOK(u, wp.req, (u.traits || []).some(x => /^괴력/.test(x)))) return false;\n  if (u.eqRule && u.eqRule.ranged === false && isRangedW(wp)) return false;   // v7.20 카리우스: 손이 기형이라 원거리 무기를 못 씀\n  if (wp.two && u.shield && !u.armShield) return false;")
# ---------- 줍기: 든 무기는 가방으로 · 주운 것의 이름 · 내구도 · 주인 ----------
s = rep(s, """    u.shield = true; u.armShield = false; u.shieldLost = false; u.canGuard = true;""",
        """    u.sDur = it.dur != null ? +it.dur : 100; u.sName = it.label || ''; u.sOwn = it.own || null;   // v7.20
    u.shield = true; u.armShield = false; u.shieldLost = false; u.canGuard = true;""")
s = rep(s, """    if (!unarmed(u) && u.weapon && !ITEM_NATURAL.includes(u.weapon)) dropItem(W, u, 'weapon', u.weapon, u.ammo != null ? { ammo: u.ammo, mag: u.mag } : null, 'swap');   // 들던 무기는 발밑에
    setWeapon(W, u, it.name, it);""",
        """    if (!unarmed(u) && u.weapon && !ITEM_NATURAL.includes(u.weapon)) stowOrDrop(W, u, heldItem(u));   // v7.20 들던 무기는 가방에 (자리가 없으면 발밑에)
    setWeapon(W, u, it.name, it); armWith(W, u, it);""")
s = rep(s, "  L(W, { k: 'pickItem', a: u.i, item: it.k, name: it.name, own: it.owner === u.i,", "  L(W, { k: 'pickItem', a: u.i, item: it.k, name: it.name, label: it.label || '', own: it.owner === u.i,")
# ---------- 손 · 바꿔 들기 · 가방 탄 ----------
s = rep(s, "  if (u.lie && lieHold(W, u)) return;   // v7.11", "  if (invAuto(W, u)) return;   // v7.20 소지품: 탄이 다 떨어졌거나 무기를 잃으면 가방에서 꺼냄\n  if (u.lie && lieHold(W, u)) return;   // v7.11")
s = rep(s, "  if (u.act.k === 'reload'){ u.mag = Math.min(u.magMax, u.ammo);", "  if (u.act.k === 'bagSwap'){ resolveSwap(W, u); return; }   // v7.20\n  if (u.act.k === 'bagAmmo'){ resolveBagAmmo(W, u); return; }\n  if (u.act.k === 'reload'){ u.mag = Math.min(u.magMax, u.ammo);")
s = rep(s, "function doOrder(W, u, dt){\n  const o = u.order, foes = W.units.filter(f => f.alive && f.side !== u.side);",
        "function doOrder(W, u, dt){\n  const o = u.order, foes = W.units.filter(f => f.alive && f.side !== u.side);\n  if (o.k === 'swap'){ invOrder(W, u, o); return; }   // v7.20 가방의 무기 · 방패를 꺼내 듦")
s = rep(s, "/* ---------- v7.19.1 고유 기술:", r"""/* ---------- v7.20 소지품 (가방) · 내구도 — 적 · 아군 같은 규칙 ---------- */
// 물건: { k: 'weapon' · 'shield' · 'armor' · 'helm' · 'ammo', name (무기표 이름 · 갑옷은 보이는 이름), label (보이는 이름), dur (0 ~ 100), own (원래 주인), ammo · mag (총 · 활), mat · tier · size (갑옷), at · n (탄) }
const INV = W => W.rules.inv || {};
const ownKey = u => u.ref || ('#' + String(u.name || '').replace(/\s*\d+$/, ''));
const lootName = (u, k, name) => { const nm = String(u.name || '').replace(/\s*\d+$/, ''); return k === 'shield' ? (u.sName || nm + '의 방패') : k === 'weapon' && u.wName && u.weapon === name ? u.wName : / ?의 /.test(name) ? name : nm + '의 ' + name; };
const heldItem = u => ({ k: 'weapon', name: u.weapon, label: u.wName || '', dur: u.wDur != null ? u.wDur : 100, own: u.wOwn || ownKey(u), ...(u.ammo != null ? { ammo: u.ammo, mag: u.mag } : {}) });
const bagCapOf = (W, u) => u.bagCap || (INV(W).cap || {})[sizeOf(u)] || 8;
const ammoTOf = (W, name) => { const wp = (W.rules.weapons || {})[name] || {}; return wp.kind === '활' ? '화살' : wp.kind === '총포류' ? ((INV(W).special || ['저격총', '샷건']).includes(name) ? '특수' : '일반') : null; };
const bagWpnN = u => (u.bag || []).filter(x => x.k === 'weapon').length + (u.weapon && !ITEM_NATURAL.includes(u.weapon) && !u.weaponGone ? 1 : 0);
// 가방에 넣기 (자리가 없거나 · 무기 칸 한도 (카리우스 4) 를 넘으면 발밑에)
function stowOrDrop(W, u, it){
  const full = !u.bag || u.bag.length >= bagCapOf(W, u) || (it.k === 'weapon' && u.eqRule && u.eqRule.wmax && bagWpnN(u) >= u.eqRule.wmax);
  if (full){ dropItem(W, u, it.k, it.name, it, 'swap'); return false; }
  u.bag.push({ ...it, uid: (W.bagN = (W.bagN || 10000) + 1) }); L(W, { k: 'stow', a: u.i, w: it.label || it.name, vis: u.side === 0 || !!u.seenBy }); return true;
}
// 든 무기에 그 물건의 이름 · 내구도 · 주인을 입힘 (남의 무기면 살짝 서툶)
function armWith(W, u, it){ u.wName = it.label || ''; u.wDur = it.dur != null ? +it.dur : 100; u.wOwn = it.own || null; u.wForeign = !!it.own && it.own !== ownKey(u); }
// 싸우는 중 들 수 있나: 집어 들 수 있는 무기 (팔 · 체급 · 원거리 금지 · 두 손) 이고 부러지지 않았음
function canHold(W, u, it){
  if (!it || !u.alive || u.noArms) return false;
  if (it.k === 'shield') return (it.dur == null || it.dur > 0) && canTake(W, u, { k: 'shield' });
  if (it.k !== 'weapon') return false;
  const wp = (W.rules.weapons || {})[it.name]; if (!wp || (it.dur != null && it.dur <= 0 && !isRangedW(wp))) return false;
  return canTake(W, u, { k: 'weapon', name: it.name });
}
// 가방에서 고를 무기: 근접 (내구도 높은 것) > 탄이 있는 원거리
function bagPick(W, u){
  let best = null, bs = -1;
  for (const it of u.bag || []){ if (it.k !== 'weapon' || !canHold(W, u, it)) continue; const wp = (W.rules.weapons || {})[it.name] || {}, far = isRangedW(wp);
    const am = far ? (it.ammo || 0) + (u.bag || []).filter(x => x.k === 'ammo' && x.at === ammoTOf(W, it.name)).reduce((a, x) => a + (x.n || 0), 0) : 1;
    if (far && am <= 0) continue; const sc = (far ? 1 : 2) + (it.dur != null ? it.dur : 100) / 1000; if (sc > bs){ bs = sc; best = it; } }
  return best;
}
function startSwap(W, u, it, why){
  const wq = (W.rules.weapons || {})[it.name] || {}, sh = it.k === 'weapon' && !u.shield && !wq.two && !isRangedW(wq) ? (u.bag || []).find(x => x.k === 'shield' && (x.dur == null || x.dur > 0) && !(u.arms && u.arms.L)) : null;   // 새로 들 무기가 한 손 근접이면 방패도
  u.act = { k: 'bagSwap', phase: 'wind', t0: W.t, end: W.t + (INV(W).swap || 0.8) + (sh ? INV(W).swapSh || 0.5 : 0), it, sh, why: why || '' };
  stop(u); setMood(W, u, (it.label || it.name) + ' 꺼냄'); return true;
}
function resolveSwap(W, u){
  const A = u.act, it = A.it; u.act = null; if (!u.alive || !u.bag) return;
  if (it.k === 'shield'){ if (!u.bag.includes(it) || !canHold(W, u, it)) return; u.bag.splice(u.bag.indexOf(it), 1); takeItem(W, u, { ...it, owner: u.i }); L(W, { k: 'bagSwap', a: u.i, w: it.label || '방패', why: A.why, vis: u.side === 0 || !!u.seenBy }); return; }
  if (!u.bag.includes(it) || !canHold(W, u, it)) return;
  u.bag.splice(u.bag.indexOf(it), 1);
  const old = !u.weaponGone && u.weapon && !ITEM_NATURAL.includes(u.weapon) && !(u.jav && !u.spearHeld) ? heldItem(u) : null;
  if (old){ if (u.bag.length < bagCapOf(W, u)) u.bag.push({ ...old, uid: (W.bagN = (W.bagN || 10000) + 1) }); else dropItem(W, u, 'weapon', old.name, old, 'swap'); }
  const far = isRangedW((W.rules.weapons || {})[it.name] || {});
  setWeapon(W, u, it.name, far ? { ammo: it.ammo || 0, mag: it.mag } : it); armWith(W, u, it);
  if (far && !u.ammo) pullAmmo(W, u);
  if (A.sh && u.bag.includes(A.sh) && canHold(W, u, A.sh)){ u.bag.splice(u.bag.indexOf(A.sh), 1); takeItem(W, u, { ...A.sh, owner: u.i }); }
  L(W, { k: 'bagSwap', a: u.i, w: it.label || it.name, from: old ? (old.label || old.name) : null, sh: A.sh ? (A.sh.label || '방패') : null, why: A.why, vis: u.side === 0 || !!u.seenBy });
}
// 가방의 같은 종류 탄을 든 무기에 채움 (든 무기의 기본 탄 수까지)
function pullAmmo(W, u){
  const at = ammoTOf(W, u.weapon); if (!at) return 0; const wp = (W.rules.weapons || {})[u.weapon] || {}, cap = Math.max(1, wp.ammo || (INV(W).stack || {})[at] || 20); let got = 0;
  for (const it of (u.bag || []).filter(x => x.k === 'ammo' && x.at === at)){ const n = Math.min(it.n || 0, cap - got); it.n -= n; got += n; if (got >= cap) break; }
  u.bag = u.bag.filter(x => !(x.k === 'ammo' && !(x.n > 0)));
  if (!got) return 0;
  setWeapon(W, u, u.weapon, { ammo: (u.ammo || 0) + got }); if (u.magMax) u.mag = Math.min(u.magMax, u.ammo);
  L(W, { k: 'bagAmmo', a: u.i, at, n: got, left: (u.bag || []).filter(x => x.k === 'ammo' && x.at === at).reduce((a, x) => a + x.n, 0), vis: u.side === 0 || !!u.seenBy });
  return got;
}
function resolveBagAmmo(W, u){ u.act = null; if (u.alive && !u.weaponGone) pullAmmo(W, u); }
// 자동 (적 · 아군): 탄이 다 떨어졌으면 가방 탄 → 없으면 가방 무기 / 무기를 잃었으면 (부러짐 · 뺏김) 가방 무기
function invAuto(W, u){
  if (!u.bag || !u.bag.length || u.act || u.noArms || u.down || u.crawl || u.kb) return false;
  const dry = u.ammoMax != null && u.ammo === 0 && !u.weaponGone;
  if (dry){ const at = ammoTOf(W, u.weapon); if (at && u.bag.some(x => x.k === 'ammo' && x.at === at && x.n > 0)){ u.act = { k: 'bagAmmo', phase: 'wind', t0: W.t, end: W.t + (INV(W).ammoT || 1.2), why: '가방에서 탄을 꺼냄' }; stop(u); setMood(W, u, '탄 꺼냄'); return true; } }
  if (dry || u.weaponGone){ const it = bagPick(W, u); if (it) return startSwap(W, u, it, dry ? '탄이 떨어짐' : '무기를 잃음'); }
  return false;
}
// 명령: { k: 'swap', uid } — 가방의 그 무기 · 방패를 꺼내 듦 (명령은 닿아야 함)
function invOrder(W, u, o){
  u.order = null; const it = (u.bag || []).find(x => x.uid === o.uid);
  if (!it || !canHold(W, u, it)){ L(W, { k: 'miss', a: u.i, why: it ? (it.label || it.name) + '을(를) 들 수 없음' : '가방에 없음', vis: u.side === 0 }); return; }
  if (u.act && u.act.phase === 'wind' && u.act.k !== 'charge') u.act = null;
  if (!u.act) startSwap(W, u, it, '명령');
}
// 근접 무기가 닳음 · 막힐 때 아주 낮은 확률로 부러짐 (낡을수록 · 둔기 · 센 기술에 더)
function wearW(W, u, amt, brk, why){
  const w = u.weaponNow || u.weapon, wp = (W.rules.weapons || {})[u.weapon] || {};
  if (!u.alive || u.weaponGone || !w || ITEM_NATURAL.includes(w) || w === '맨손' || isRangedW(wp) || wp.kind === '마법' || (u.jav && !u.spearHeld)) return;
  const D = W.rules.dur || {}; u.wDur = Math.max(0, (u.wDur != null ? u.wDur : 100) - amt);
  if (brk == null) return;
  const p = u.wDur <= 0 ? 1 : (D.breakP != null ? D.breakP : 0.0015) * (1 + (D.old != null ? D.old : 3) * (1 - u.wDur / 100)) * brk;
  if (W.rand() < p) breakWeapon(W, u, why);
}
function breakWeapon(W, u, why){
  const nm = u.wName || u.weapon; u.weaponGone = true; u.weaponNow = '맨손'; u.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng; u.longReach = false; u.parry = false; u.wDur = 0;
  if (!u.shield && !u.reflex) u.canGuard = false; if (u.jav) u.spearHeld = false; u.wBroken = u.weapon;
  L(W, { k: 'wBreak', a: u.i, w: nm, why: why || '', vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '무기가 부러짐!', c: 'd', t0: W.t });
}
function breakShield(W, t, by){
  const wp = (W.rules.weapons || {})[t.weapon] || {}; t.shield = false; t.shieldLost = true; t.sDur = 0; t.canBash = false; t.raised = false;
  t.parry = !t.weaponGone && !wp.guard && parryArcW(W.rules, t.weapon) > 0; t.canGuard = (!t.weaponGone && !!wp.guard) || !!t.reflex || t.parry;
  if (t.chargeName === '방패 돌진') t.chargeName = '돌진';
  L(W, { k: 'sBreak', a: t.i, b: by ? by.i : null, name: t.sName || '방패', vis: t.side === 0 || !!t.seenBy || (by && by.side === 0) }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '방패가 부서짐!', c: 'd', t0: W.t });
}
// 막았을 때: 방패는 막은 피해만큼 · 무기로 막았으면 막은 쪽 무기 · 막힌 쪽 무기가 닳고 (드물게) 부러짐
function wearBlock(W, u, t, o, base, extra){
  const D = W.rules.dur || {}; if (!D.clash) return;
  const heavy = extra && (extra.mul || 1) >= 1.5 ? (D.heavy || 3) : 1, blunt = !o.far && ((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).kind === '둔기' ? (D.blunt || 2) : 1;
  if (o.gn === '방패' && t.shield && !t.armShield){ t.sDur = Math.max(0, (t.sDur != null ? t.sDur : 100) - base * (D.shield || 0.12) * (o.far ? 0.5 : 1) * heavy); if (t.sDur <= 0) breakShield(W, t, u); }
  else if (!o.far && o.gn && o.gn !== '반사신경' && o.gn !== '팔') wearW(W, t, D.clash, blunt * heavy * (u.strMul || 1), u.name + '의 일격을 막다가');
  if (!o.far && !o.jav) wearW(W, u, D.clash, o.gn === '방패' ? 1.2 : 1, t.name + '에게 막혀');
}
// 맞혔을 때: 친 근접 무기가 조금 닳고, 갑옷 · 투구는 막아 낸 만큼 닳음 (0 이면 망가짐)
function wearHit(W, u, t, o, it, dmg, armMul){
  const D = W.rules.dur || {}; if (!D.clash) return;
  if (!o.far && !o.jav) wearW(W, u, D.hit || 0.25, null);
  if (it && !it.innate && armMul < 1 && it.dur != null && it.dur > 0){ const ab = Math.min(40, dmg / Math.max(0.15, armMul) - dmg); it.dur = Math.max(0, +(it.dur - ab * (D.armor || 0.1)).toFixed(2));
    if (it.dur <= 0) L(W, { k: 'aBreak', a: t.i, name: it.name, slot: it.mat === '투구' ? '머리' : '몸', vis: t.side === 0 || !!t.seenBy }); }
}
/* ---------- v7.19.1 고유 기술:""")
s = rep(s, "if (typeof module !== 'undefined') module.exports = { ", "if (typeof module !== 'undefined') module.exports = { wearWhy, bagCapP, eqRuleP, isMB, wpnSpd, invAuto, startSwap, resolveSwap, pullAmmo, bagPick, canHold, bagCapOf, ammoTOf, lootName, ownKey, heldItem, stowOrDrop, wearW, wearBlock, wearHit, breakWeapon, breakShield, gearWK, sizeP, ")
s = rep(s, "  applyDmg(W, u, t, dmg, o2);\n  if (o && /짓뭉개|짓눌|짓밟|내려찍/", "  applyDmg(W, u, t, dmg, o2);\n  wearHit(W, u, t, { far: true, jav: true }, AM.it, dmg, AM.m);   // v7.20 몸 충격도 갑옷이 받아 냄\n  if (o && /짓뭉개|짓눌|짓밟|내려찍/")
s = rep(s, "  L(W, { k: 'drop', a: u.i, item: k, name, how: how || '', x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });", "  L(W, { k: 'drop', a: u.i, item: k, name, label: it.label, how: how || '', x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });")
s = rep(s, "const orderTxt = (o, u) => o && o.k === 'flank'", "const orderTxt = (o, u) => o && o.k === 'swap' ? ['swap', o.uid] : o && o.k === 'flank'")   # v7.20 꺼내 듦 명령
wr('rt3_tail.js', s)
print('patch720 OK')
