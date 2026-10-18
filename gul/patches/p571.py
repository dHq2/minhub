import sys, re
H='rt3_head.js'; T='rt3_tail.js'
h=open(H).read(); t=open(T).read()
def rh(a,b,n):
    global h
    c=h.count(a)
    if c!=1: print('ANCHOR head',n,c); sys.exit(1)
    h=h.replace(a,b)
def rt(a,b,n,cnt=1):
    global t
    c=t.count(a)
    if c!=cnt: print('ANCHOR tail',n,c); sys.exit(1)
    t=t.replace(a,b)
# ---------- head: version + rules ----------
rh("/* ===== 전투 엔진 v5.7 —","/* ===== 전투 엔진 v5.7.1 —",'ver')
rh("   v5.7: 맨몸으로 무기를 막지 않음 —",
"""   v5.7.1: 무구로 막기 — 방패가 없어도 쥔 무기 (검 · 창 · 둔기 · 단검) 로 받아 냄 (parry): 근접만 (화살 · 총알 · 투창 · 돌진하는 몸은 못 막음), 막는 폭이 좁고
           (단검 15° · 둔기 20° · 검 · 창 30° · 장검 35°, × 방어 재능) 받는 피해 parry.mul (방패 0.2 보다 덜 막음) · 자세가 parry.post 배 더 깎임 · 무거운 상대일수록 더 깎임.
           칼이 곧 막는 도구라 치는 동안은 못 막음. 맨손 (무기가 없음) 일 때만 맨몸 막기 (팔 위험).
   v5.7.1: 방패 뒤에서 치기 — 방패를 든 채 찌름 (공격 guard.strikeMul ×, 치는 동안 막는 폭 guard.strikeArc ×). 막기 유지는 틈이 보일 때만 침.
           공격 위주 (방패를 내림) 는 온 힘으로 치고 걸음이 안 느려짐 — 그 대신 갑옷만.
   v5.7.1: [재생] (레베카 — ◆축복:불사 의 정체): 모든 신체가 재생 = 초당 최대 체력의 regen.hp 를 되찾음 (쓰러진 채로도) · 눈 · 팔 · 다리를 잃지 않고 피를 흘리지 않음.
   v5.7.1: 사수 명령 — 공격을 한 번 주면 먼저 사선을 열 자리를 잡고 쏨 (아군이 사선에 있으면 비켜서서). 연달아 주면 (급함) 그 자리에서 바로 쏨 (오사 감수).
           근접에게 연달아 준 공격 명령은 서두르기 (방패를 내리고 뜀).
   v5.7: 맨몸으로 무기를 막지 않음 —""",'notes')
rh("wall: 25, keep: 0.6, bare: 0.3, bareDmg: 0.6, bareMaim: 0.5 },",
   "wall: 25, keep: 0.6, bare: 0.3, bareDmg: 0.6, bareMaim: 0.5, strikeMul: 0.85, strikeArc: 0.6 },\n  parry: { blade: 30, long: 35, spear: 30, blunt: 20, dagger: 15, mul: 0.5, post: 1.3, raise: 0.12 },   // v5.7.1 무구로 막기: 막는 폭 (°) · 받는 피해 × · 자세 깎임 × · 드는 데 (초)\n  regen: { hp: 0.04 },   // v5.7.1 [재생]: 초당 최대 체력의 몫",'rules')
# ---------- tail ----------
# unit creation: parry, canGuard, gTal, regen
rt("canGuard: !!p.shield || !!wp.guard || (p.traits || []).includes('반사신경'), guardMode: 'auto',",
   "canGuard: !!p.shield || !!wp.guard || (p.traits || []).includes('반사신경') || parryArcW(rules, p.weapon) > 0, parry: !p.shield && !wp.guard && parryArcW(rules, p.weapon) > 0, regen: tr.includes('재생') ? ((rules.regen || {}).hp != null ? rules.regen.hp : 0.04) : 0, guardMode: 'auto',",'unit')
rt("      gTal: (p.shield || wp.guard) ? Math.max(","      gTal: (p.shield || wp.guard || parryArcW(rules, p.weapon) > 0) ? Math.max(",'gtal')
# helpers after guardOn line
a="const guardOn = (W, u) => u.alive && u.canGuard && u.raised"
i=t.index(a); j=t.index('\n', i)
t=t[:j+1]+"""// v5.7.1 무구로 막기: 방패가 없으면 쥔 무기로 받아 냄 (근접만). 단검 · 둔기는 좁게, 검 · 창은 보통, 장검은 조금 넓게. 대검은 원래 막는 무기 (guard)
function parryArcW(R, name){
  const P = R.parry || {}, w = (R.weapons || {})[name];
  if (!w || isRangedW(w) || w.guard || w.kind === '맨손' || w.kind === '짐승') return 0;
  return name === '단검' ? P.dagger || 15 : /창$/.test(name) ? P.spear || 30 : w.kind === '둔기' ? P.blunt || 20 : name === '장검' ? P.long || 35 : P.blade || 30;
}
const parryArc = (W, u) => u.parry && !u.shield && !u.noArms && !unarmed(u) ? parryArcW(W.rules, u.weapon) : 0;
// 막는 폭 (°): 방패 · 대검 · [반사신경] 은 정해진 폭, 무구로 막기는 무기 폭 × 방어 재능 ([반사신경] 이면 넓게). 방패 뒤에서 치는 동안은 좁아짐
function guardArc(W, t){
  const pa = t.parry && !t.shield ? parryArc(W, t) : 0;
  let a = pa ? (t.reflex ? Math.max(pa, W.rules.guardArcRW || 55) : pa * (0.6 + 0.4 * (t.gTal != null ? t.gTal : 1))) : t.gArc;
  if (t.shield && t.act && t.act.k === 'atk') a *= (W.rules.guard || {}).strikeArc || 0.6;
  return a;
}
// v5.7.1 [재생] · [불사]: 몸이 다시 자라 상처 · 부위 · 출혈이 남지 않음
const wholeBody = t => !!t.undying || t.regen > 0;
"""+t[j+1:]
# bareGuard: unarmed only
rt("const bareGuard = (W, u) => u.canGuard && !u.shield && !((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).guard;",
   "const bareGuard = (W, u) => u.canGuard && !u.shield && !((W.rules.weapons || {})[u.weaponNow || u.weapon] || {}).guard && !parryArc(W, u);   // v5.7.1 무기가 있으면 무기로 막음",'bare')
# inGuard with body flag + guardArc
rt("const inGuard = (W, t, a) => guardOn(W, t) && angDiff(t.face, Math.atan2(a.y - t.y, a.x - t.x)) * 180 / Math.PI <= t.gArc + (shieldWall(W, t)",
   "const inGuard = (W, t, a, body) => guardOn(W, t) && !(body && t.parry && !t.shield && !t.reflex) && angDiff(t.face, Math.atan2(a.y - t.y, a.x - t.x)) * 180 / Math.PI <= guardArc(W, t) + (shieldWall(W, t)",'ing')
# body/missile call sites
rt("function shieldBlock(W, a, t){ const f = firstOnLine(W, a, t, a); return f !== t && inGuard(W, f, a) ? f : null; }",
   "function shieldBlock(W, a, t){ const f = firstOnLine(W, a, t, a); return f !== t && inGuard(W, f, a, true) ? f : null; }",'sb')
rt("    const blocked = inGuard(W, hit, u), sh = !!u.shield,","    const blocked = inGuard(W, hit, u, true), sh = !!u.shield,",'chg')
rt("(first.side !== u.side && inGuard(W, first, P0)))) return 0;","(first.side !== u.side && inGuard(W, first, P0, true)))) return 0;",'jv1')
rt("  if (first === t && inGuard(W, t, P0) && !ordered) return 0;","  if (first === t && inGuard(W, t, P0, true) && !ordered) return 0;",'jv2')
rt("    if (first === f && inGuard(W, f, u)) continue;","    if (first === f && inGuard(W, f, u, true)) continue;",'alt')
rt("    if (inGuard(W, first, u)){   // 방어 자세가 이쪽을 막고 있음 → 쏘면 막힘","    if (inGuard(W, first, u, true)){   // 방어 자세가 이쪽을 막고 있음 → 쏘면 막힘",'sh')
rt("      const shut = inGuard(W, t, P0); if (shut && mood === '막힘') continue;","      const shut = inGuard(W, t, P0, true); if (shut && mood === '막힘') continue;",'rep')
rt("  if (u.role === '사수') return (f.canGuard && guardOn(W, f) && inGuard(W, f, u) ? -1 : 0)","  if (u.role === '사수') return (f.canGuard && guardOn(W, f) && inGuard(W, f, u, true) ? -1 : 0)",'sc')
rt("  if (a && guardOn(W, u) && inGuard(W, u, a)) p *= 0.6;","  if (a && guardOn(W, u) && inGuard(W, u, a, true)) p *= 0.6;",'down')
rt("const blocksFor = (W, f, e) => inGuard(W, f, e) ||","const blocksFor = (W, f, e) => inGuard(W, f, e, true) ||",'bf')
rt("  const trained = guardOn(W, t) && inGuard(W, t, u) && t.role === '전선';","  const trained = guardOn(W, t) && inGuard(W, t, u, true) && t.role === '전선';",'tr')
rt("  if (inGuard(W, t, u)) v -= 0.8;","  if (inGuard(W, t, u, true)) v -= 0.8;",'cv')
# strike: missile flag, parry reduction/post, shield strike
rt("  if (inGuard(W, t, u)){\n    o.jav = !!J;","  if (inGuard(W, t, u, o.far || !!J)){\n    o.jav = !!J; const pr = t.parry && !t.shield && !!parryArc(W, t), PR = R.parry || {}; o.parry = pr;   // v5.7.1 무구로 막음",'st1')
rt("/ (1 + ((W.rules.form || {}).postForm != null ? W.rules.form.postForm : 0.15) * formMates(W, t)); t.blockT = W.t; t.blocked++;",
   "/ (1 + ((W.rules.form || {}).postForm != null ? W.rules.form.postForm : 0.15) * formMates(W, t)) * (pr ? (PR.post || 1.3) * Math.min(3, Math.max(1, (u.mass || 62) / Math.max(30, t.mass || 62))) : 1); t.blockT = W.t; t.blocked++;",'st2')
rt("    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - R.blockMul) * (t.gTal != null ? t.gTal : 1)))), o);\n    return o;\n  }",
   "    applyDmg(W, u, t, Math.max(1, Math.round(base * (1 - (1 - (pr ? (PR.mul != null ? PR.mul : 0.5) : R.blockMul)) * (t.gTal != null ? t.gTal : 1)))), o);\n    return o;\n  }",'st3')
rt("v * (R.lethal || 1) * (J ? J.mul : 1) * (extra && extra.mul ? extra.mul : 1);",
   "v * (R.lethal || 1) * (J ? J.mul : 1) * (extra && extra.mul ? extra.mul : 1) * (u.shield && u.raised && W.t >= u.raiseAt && !isF && !J ? (R.guard || {}).strikeMul || 0.85 : 1);   // v5.7.1 방패 뒤에서 치기",'st4')
# wholeBody immunity
rt("      if (t.alive && !t.undying && W.rand() < (G.bareMaim","      if (t.alive && !wholeBody(t) && W.rand() < (G.bareMaim",'w1')
rt("  if (!t.undying && !(extra && extra.noWound) && dmg >= t.max * 0.1 && t.hp > dmg){   // [불사] 는 상처가 남지 않음","  if (!wholeBody(t) && !(extra && extra.noWound) && dmg >= t.max * 0.1 && t.hp > dmg){   // [불사] · [재생] 은 상처가 남지 않음",'w2')
rt("  if (o.vital && t.alive && !t.undying){ startBleed(","  if (o.vital && t.alive && !wholeBody(t)){ startBleed(",'w3')
rt("  if (t.alive && !t.undying && (part === '머리' || part === '팔') && !(extra && extra.noWound)){","  if (t.alive && !wholeBody(t) && (part === '머리' || part === '팔') && !(extra && extra.noWound)){",'w4')
rt("  if (!u.alive || u.crawl || u.undying) return;","  if (!u.alive || u.crawl || wholeBody(u)) return;",'w5')
rt("  if (!t.alive || t.undying) return;\n  const M = W.rules.maim || {};","  if (!t.alive || wholeBody(t)) return;\n  const M = W.rules.maim || {};",'w6')
# regen loop
rt("  for (const u of W.units){ if (!u.undying) continue; const rg = u.max * ((W.rules.undying || {}).regen || 0) * dt;",
   "  for (const u of W.units){ if (!u.undying && !(u.regen > 0)) continue; const rg = u.max * (u.regen > 0 ? u.regen : (W.rules.undying || {}).regen || 0) * dt;   // v5.7.1 [재생]",'rg')
rt("const undEta = (W, t) => Math.max(0, (t.max * undMove(W) - t.hp) / Math.max(1e-6, t.max * ((W.rules.undying || {}).regen || 0.025)));",
   "const undEta = (W, t) => Math.max(0, (t.max * undMove(W) - t.hp) / Math.max(1e-6, t.max * (t.regen > 0 ? t.regen : (W.rules.undying || {}).regen || 0.025)));",'eta')
# updateGuard: shield strike keeps raised, parry raise time
rt("  const G = W.rules.guard || {}, a = u.act, shieldAct = a && (a.k === 'bash' || (a.k === 'charge' && u.shield));",
   "  const G = W.rules.guard || {}, a = u.act, shieldAct = a && (a.k === 'bash' || (a.k === 'charge' && u.shield) || (a.k === 'atk' && u.shield && !isFar(u) && u.guardMode !== 'off'));   // v5.7.1 방패 뒤에서 치기",'ug1')
rt("u.raiseAt = shieldAct ? W.t : W.t + (u.reflex ? (G.reflex != null ? G.reflex : 0.08) : (G.raise != null ? G.raise : 0.25)); }",
   "u.raiseAt = shieldAct ? W.t : W.t + (u.reflex ? (G.reflex != null ? G.reflex : 0.08) : u.parry && !u.shield ? ((W.rules.parry || {}).raise != null ? W.rules.parry.raise : 0.12) : (G.raise != null ? G.raise : 0.25)); }",'ug2')
rt("  const hurry = u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove');",
   "  const hurry = u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack');",'ug3')
# spdNow: shield only slows, hurry for attack too
rt("(u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove') ? (W.rules.run || 1.3) : 1) * (u.raised && !(u.act && u.act.k === 'charge')",
   "(u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack') ? (W.rules.run || 1.3) : 1) * (u.raised && u.shield && !(u.act && u.act.k === 'charge')",'spd')
# hold mode strikes on openings
rt("  if (!heal && u.guardMode === 'hold' && u.canGuard && !isFar(u)){ if (u.canBash && W.t >= u.bashCd && gap(u, t) <= u.rng + 0.3 && t.side !== u.side) startBash(W, u, t, '막기 유지'); else setMood(W, u, '막기 유지', t.i); return; }",
   "  if (!heal && u.guardMode === 'hold' && u.canGuard && !isFar(u) && t.side !== u.side){ if (u.canBash && W.t >= u.bashCd && gap(u, t) <= u.rng + 0.3){ startBash(W, u, t, '막기 유지'); return; } if (!openingOf(W, u, t)){ setMood(W, u, '막기 유지', t.i); return; } }   // v5.7.1 막기 유지는 틈이 보일 때만 침",'hold')
# ordered fire: calm vs now
rt("const ordFire = (u, t) => u.side === 0 && !!u.order && (u.order.k === 'attack' || u.order.k === 'throw') && !!t && u.order.b === t.i;",
   "const ordFire = (u, t) => u.side === 0 && !!u.order && !!u.order.now && (u.order.k === 'attack' || u.order.k === 'throw') && !!t && u.order.b === t.i;   // v5.7.1 연달아 준 (급한) 명령만 오사를 감수",'of')
rt("  else if (!A.ord && holdFire(W, u, t, true)){","  else if (!(A.ord && ordFire(u, t)) && holdFire(W, u, t, true)){",'jvrel')
rt("  if (first !== t && first.side === u.side && ordered) why = '오사 감수';   // v5.5.1 명령: 사선에 아군이 있어도 쏨 (맞힐지는 탄이 정함)",
   "  const now = ordered && u.order && u.order.now;   // v5.7.1 연달아 준 공격 = 바로 쏨 (오사 감수) · 한 번 = 사선을 열 자리를 먼저 잡음\n  if (first !== t && first.side === u.side && now) why = '오사 감수';",'s1')
rt("  if (ordered){ u.ffWait = 0; startAct(W, u, tgt, why || '공격'); return; }",
   "  if (now){ u.ffWait = 0; startAct(W, u, tgt, why || '공격'); return; }\n  if (ordered){ const ff0 = ffOdds(W, u, tgt, u.x, u.y); if (ff0.p > ffLim(u, W)){ blockedShot(W, u, t, dt, true, ff0.who); return; } u.ffWait = 0; startAct(W, u, tgt, why || '공격'); return; }",'s2')
rt("module.exports = { lineFaceOf,","module.exports = { parryArcW, parryArc, guardArc, wholeBody, lineFaceOf,",'exp')
open(H,'w').write(h); open(T,'w').write(t); print('ok')
