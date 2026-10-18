import sys
H='rt3_head.js'; T='rt3_tail.js'
h=open(H).read(); t=open(T).read()
def rep(s, a, b, name):
    c=s.count(a)
    if c!=1: print('ANCHOR', name, c); sys.exit(1)
    return s.replace(a,b)
# 1 precedence fix
t=rep(t, "dist(f, u) < (W.rules.line || {}).fill || 2.6\n", "dist(f, u) < ((W.rules.line || {}).fill || 2.6)\n", 'prec')
# 2 rules
h=rep(h, "  guard: { raise: 0.25, reflex: 0.08, near: 1.2, walk: 0.75, wall: 25 },",
 "  guard: { raise: 0.25, reflex: 0.08, near: 1.2, walk: 0.75, wall: 25, bare: 0.3, bareDmg: 0.6, bareMaim: 0.5 },", 'guardrule')
h=rep(h, "  run: 1.3,", "  ward: { medic: 1.6, shooter: 1.25, cmd: 0.05, hero: 1.1, human: 1.15, at: 1.6, near: 3 },   // v5.7 지킬 사람: 약 (남은 것) · 사수 · 지휘 점수당 · 주인공 · 일반인 × — at 넘는 가장 큰 쪽이 그 편의 '지킬 사람'\n  run: 1.3,", 'wardrule')
# 3 head notes
h=rep(h, "   v5.7: 막기는 선택 — 방패 · 대검 · [반사신경] 은 '들어 올려야' 막음",
 "   v5.7: 맨몸으로 무기를 막지 않음 — 막는 역할은 방패 (· 대검). 방패도 대검도 없이 ([반사신경] 맨몸) 창 · 칼 · 망치 · 발톱을 막으면 guard.bare 확률로 팔이 받아 냄\n"
 "         (피해 bareDmg × · bareMaim 확률로 팔이 잘림 · 부러짐). 그래서 자동은 맨몸으로 무기를 막지 않음 (맨손 · 주먹만) — 막기 유지 명령이면 지휘관의 선택으로 막음.\n"
 "         지킬 사람: 약 (남은 응급처치) · 사수 · 지휘를 가진 이가 그 편의 '지킬 사람' (노먼). 탱커가 먼저 막아서고, 막기 자동은 지킬 사람을 노리는 상대도 위협으로 봄.\n"
 "         인주 (일반인 · 창 보병) 는 지킬 사람이 아니라 기동하는 보병 — 주인공이라고 더 감싸지 않음.\n"
 "   v5.7: 막기는 선택 — 방패 · 대검 · [반사신경] 은 '들어 올려야' 막음", 'notes')
# 4 helpers after guardOn line
a="const guardOn = (W, u) => u.alive && u.canGuard && u.raised"
i=t.index(a); j=t.index('\n', i)
t=t[:j+1]+"""// v5.7 맨몸 막기: 방패도 막는 무기 (대검) 도 없이 막음 ([반사신경] 맨몸) — 무기를 막으면 팔이 받아 낼 수 있음
const bareGuard = (W, u) => u.canGuard && !u.shield && !((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).guard;
const armedKind = (W, e) => e.bladeHands || ((W.rules.weapons || {})[e.weaponNow || e.weapon] || {}).kind !== '맨손';
// v5.7 지킬 사람: 남은 약 · 사수 · 지휘 · 주인공 · 일반인 ×
function wardMul(W, a){
  const R = W.rules.ward || {};
  return (a.skill && a.skill.left > 0 ? R.medic || 1.6 : 1) * (isFar(a) ? R.shooter || 1.25 : 1) * (1 + (R.cmd != null ? R.cmd : 0.05) * (a.cmd || 0)) * (a.hero ? R.hero || 1.1 : 1) * (a.human ? R.human || 1.15 : 1);
}
function pickWards(W){
  const R = W.rules.ward || {}; W.ward = W.ward || {};
  for (const side of [0, 1]){
    let best = null, bv = R.at || 1.6;
    for (const a of W.units) if (a.alive && a.side === side && !a.crawl){ const v = wardMul(W, a); if (v > bv){ bv = v; best = a; } }
    const nw = best ? best.i : null;
    if (nw !== W.ward[side] && nw != null && side === 0) L(W, { k: 'ward', a: nw, v: +bv.toFixed(2), vis: true });
    W.ward[side] = nw;
  }
}
"""+t[j+1:]
# 5 updateGuard: bare & auto → only vs unarmed threats
t=rep(t, "    else if (u.guardMode !== 'off') want = !!dangerOf(W, u) || W.units.some(e => e.alive && e.side !== u.side && !isFar(e) && gap(u, e) < e.rng + (G.near != null ? G.near : 1.2) && (u.side === 0 ? (e.seenBy || canSee(W, u, e)) : canSee(W, u, e)));",
 "    else if (u.guardMode !== 'off'){ const bare = bareGuard(W, u), dg = dangerOf(W, u);   // v5.7 맨몸이면 자동은 무기를 막지 않음 (맨손 · 주먹만)\n      want = (!!dg && !(bare && armedKind(W, dg))) || W.units.some(e => e.alive && e.side !== u.side && !isFar(e) && !(bare && armedKind(W, e)) && gap(u, e) < e.rng + (G.near != null ? G.near : 1.2) && (u.side === 0 ? (e.seenBy || canSee(W, u, e)) : canSee(W, u, e))); }", 'upd')
# 6 strike bare arm
t=rep(t, "    o.block = true; o.tag = (extra && extra.tag) || null;\n    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - R.blockMul) * (t.gTal != null ? t.gTal : 1)))), o);\n    return o;",
"""    o.block = true; o.tag = (extra && extra.tag) || null;
    // v5.7 맨몸으로 무기를 막음: guard.bare 확률로 팔이 받아 냄 → 피해 bareDmg × · bareMaim 확률로 팔이 잘림 (날붙이 · 짐승) · 부러짐 (둔기 · 투창은 꿰뚫음)
    const G = R.guard || {}, wk0 = J ? '날붙이' : (u.bladeHands && !o.far) ? '날붙이' : (((R.weapons || {})[u.weaponNow || u.weapon] || {}).kind || '맨손');
    if (bareGuard(W, t) && ['날붙이', '둔기', '짐승'].includes(wk0) && (!o.far || J) && W.rand() < (G.bare != null ? G.bare : 0.3)){
      o.block = false; o.bareArm = true; o.part = '팔'; o.wk = wk0; o.tag = '맨팔로 받아 냄';
      applyDmg(W, u, t, Math.max(1, Math.round(base * (G.bareDmg != null ? G.bareDmg : 0.6))), o);
      if (t.alive && !t.undying && W.rand() < (G.bareMaim != null ? G.bareMaim : 0.5) * maimRes(W, t)) maimArm(W, t, u.i, J ? '찌름' : wk0 === '짐승' ? '날붙이' : wk0);
      return o;
    }
    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - R.blockMul) * (t.gTal != null ? t.gTal : 1)))), o);
    return o;""", 'strike')
# 7 exposure uses wardMul
t=rep(t, "* (a.hero ? 1.5 : 1) * (a.human ? 1.3 : 1), main };   // v5.2 넘어진 동료는 더 지켜야 함 · v5.3 주인공 · 일반인도", "* wardMul(W, a), main };   // v5.2 넘어진 동료는 더 지켜야 함 · v5.7 지킬 사람 (약 · 사수 · 지휘) — 인주는 보병", 'expo')
# 8 dangerOf: ward
t=rep(t, "  return W.units.filter(e => e.alive && e.side !== u.side && know(e) && !isFar(e) && dist(e, u) < 2.5 && (() => { const f = focusOf(W, e); return f && (f === u || (f.side === u.side && dist(f, u) < 1.6)); })()).sort((a, b) => dist(u, a) - dist(u, b))[0] || null;",
 "  const wd = W.ward && W.ward[u.side] != null ? W.units[W.ward[u.side]] : null, wn = (W.rules.ward || {}).near || 3;   // v5.7 지킬 사람을 노리는 상대도 위협\n  return W.units.filter(e => e.alive && e.side !== u.side && know(e) && !isFar(e) && dist(e, u) < 2.5 && (() => { const f = focusOf(W, e); return f && (f === u || (f.side === u.side && dist(f, u) < (f === wd ? wn : 1.6))); })()).sort((a, b) => dist(u, a) - dist(u, b))[0] || null;", 'danger')
# 9 stepWorld
t=rep(t, "if (W.lnT <= 0){ W.lnT = 0.25; planLines(W); }", "if (W.lnT <= 0){ W.lnT = 0.25; planLines(W); pickWards(W); }", 'step')
# 10 exports
t=rep(t, "module.exports = { planLines,", "module.exports = { bareGuard, armedKind, wardMul, pickWards, planLines,", 'exp')
open(H,'w').write(h); open(T,'w').write(t); print('ok')
