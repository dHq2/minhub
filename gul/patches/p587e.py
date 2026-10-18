import sys
def patch(P, reps):
    s=open(P).read()
    for a,b,n in reps:
        c=s.count(a)
        if c!=1: print('ANCHOR',P,n,c); sys.exit(1)
        s=s.replace(a,b)
    open(P,'w').write(s)
H=open('rt3_head.js').read()
i=H.index("  charge: { stun:"); j=H.index("\n",i)+1
H=H[:j]+"  chargeSet: { counter: 0.8, spear: 1.6, spearPost: 0.6, parryPost: 1.2, stun: 1.0, bounce: 0.4, after: 0.5, afterShield: 0.3, ai: 3 },   // v5.8.7 돌격 받기 (태세): 막는 자세로 마주 보고 기다리던 쪽이 버티면 받아치기 × (창은 꿰뚫기 × 달려온 속력) · 자세 깎임 × (창 · 무구) · 돌격한 쪽 휘청 (초) · 튕겨 나옴 (칸) · 들이받은 뒤 빈틈 (초, 방패) · AI 가 버틸 상대를 피하는 정도\n"+H[j:]
open('rt3_head.js','w').write(H)
patch('rt3_tail.js',[
# guardOn: 돌격 직후 빈틈
("const guardOn = (W, u) => u.alive && u.canGuard && u.raised && W.t >= u.raiseAt && W.t >= u.brokenT &&",
 "const guardOn = (W, u) => u.alive && u.canGuard && u.raised && W.t >= u.raiseAt && W.t >= u.brokenT && W.t >= (u.offBal || -9) &&",'guardOn'),
# updateGuard: 나를 노린 돌격을 보면 (손이 비었으면) 막는 자세를 세우고 그쪽을 봄
("    if (u.guardMode === 'hold') want = true;\n",
 "    if (u.guardMode === 'hold') want = true;\n    if (u.guardMode !== 'off' && !isFar(u)){ const ce = W.units.find(e => e.alive && e.side !== u.side && e.act && e.act.k === 'charge' && e.act.b === u.i && aware(W, u, e)); if (ce){ want = true; u.fg = Math.atan2(ce.y - u.y, ce.x - u.x); setMood(W, u, '태세', ce.i); } }   // v5.8.7 돌격 받을 태세\n",'want'),
# 돌격 받기 함수들
("// v5.8.5 도움닫기: 달린 거리만큼 빨라짐",
 """// v5.8.7 돌격 받기 (태세): 막는 자세 (방패 · 무구 · 반사신경) 를 세우고, 돌격해 오는 쪽을 막는 방향 안에 두고, 알아챘고, 손이 비었음 (제 공격 중 · 다른 상대와 맞붙음 · 휘청 · 무너짐이 아님).
// 싸우는 전선에 옆 · 뒤에서, 또는 치고 있는 놈에게 들어가는 돌격은 그래서 대개 통함
const isSpear = u => !isFar(u) && u.spearHeld !== false && /창$/.test(u.weaponNow || u.weapon || '');
function setFor(W, t, u){
  if (!guardOn(W, t) || isFar(t) || t.act || t.kb) return false;
  if (angDiff(t.face, Math.atan2(u.y - t.y, u.x - t.x)) * 180 / Math.PI > guardArc(W, t) + (shieldWall(W, t) ? ((W.rules.guard || {}).wall != null ? W.rules.guard.wall : 25) : 0)) return false;
  if (!aware(W, t, u)) return false;
  const f = focusOf(W, t); if (f && f !== u && f.alive && f.side !== t.side && gap(t, f) < (t.rng || 0.5) + 0.4) return false;   // 다른 상대와 맞붙어 손이 묶임
  return true;
}
// 버틸 때 깎이는 자세: 돌격 자세 깎기 × 부딪힌 힘 k × (방패 돌진이면 더) × 무게 비 (창은 땅에 박아 받으니 √) × 방어 재능 (전선 1 · 공격수 1.5배)
function setCost(W, u, t, k, bMass){
  const C = W.rules.charge || {}, SR = W.rules.chargeSet || {}, sp = !t.shield && isSpear(t), r = Math.max(0.5, Math.min(2, u.mass / Math.max(30, bMass || t.mass)));
  return (C.post || 60) * k * (u.shield ? (C.shieldKb || 1.3) : 1) * (t.shield ? 1 : sp ? (SR.spearPost != null ? SR.spearPost : 0.6) : (SR.parryPost != null ? SR.parryPost : 1.2)) * (sp ? Math.sqrt(r) : r) * (2 - (t.gTal != null ? t.gTal : 1));
}
// 버팀: 돌격한 쪽이 멈춰 휘청 · 튕겨 나오고, 받은 쪽이 받아침 (창은 달려온 속력만큼 꿰뚫음 — 방패 돌진이면 방패가 받아 냄)
function setHold(W, u, t, k, vr){
  const SR = W.rules.chargeSet || {}, C = W.rules.charge || {}, sp = !t.shield && isSpear(t), A = u.act || {};
  u.act = null;
  L(W, { k: 'impact', a: u.i, b: t.i, held: true, how: t.shield ? '방패' : sp ? '창' : '무구', vr: +vr.toFixed(1), run: +(A.run || 0).toFixed(1), full: (A.run || 0) >= (C.full || 3) - 0.05, shield: !!u.shield, post: Math.round(t.post), vis: u.side === 0 || t.side === 0 || !!u.seenBy || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '버팀!', c: 'b', t0: W.t });
  strike(W, t, u, u, 1, false, { mul: sp ? (SR.spear != null ? SR.spear : 1.6) * Math.max(0.5, k) : (SR.counter != null ? SR.counter : 0.8), tag: sp ? '창에 꿰뚫림' : t.shield ? '방패로 받아침' : '받아치기' });
  if (!u.alive) return;
  const q = Math.max(0.3, Math.min(1.3, k)), nl = dist(u, t) || 1;
  fling(W, t, u, (SR.bounce != null ? SR.bounce : 0.4) * q, (u.x - t.x) / nl, (u.y - t.y) / nl, { how: 'bounce' });
  stun(W, u, (SR.stun != null ? SR.stun : 1) * q * (u.shield ? 0.7 : 1), t.i);
}
// v5.8.5 도움닫기: 달린 거리만큼 빨라짐""",'fns'),
# stepCharge: 부딪힐 때 태세 판정
("    const blocked = inGuard(W, hit, u, true), sh = !!u.shield,",
 """    // v5.8.7 태세를 갖춘 상대: 자세가 버티면 돌격한 쪽이 당함 (setHold), 못 버티면 방어가 무너지고 그대로 들이받힘
    let setBroke = false;
    if (!hc && setFor(W, hit, u)){ const cost = setCost(W, u, hit, k, br.mass);
      if (hit.post > cost){ hit.post -= cost; hit.blockT = W.t; hit.blocked++; setHold(W, u, hit, k, vr); return; }
      hit.post = 0; hit.brokenT = W.t + W.rules.breakTime; setBroke = true; }
    const blocked = !setBroke && inGuard(W, hit, u, true), sh = !!u.shield,""",'step'),
("shield: sh, run: +(A.run || 0).toFixed(1), full: (A.run || 0) >= (C.full || 3) - 0.05, push: pushOnly,",
 "shield: sh, run: +(A.run || 0).toFixed(1), full: (A.run || 0) >= (C.full || 3) - 0.05, push: pushOnly, setBroke,",'log'),
("    u.act = { k: 'atk', phase: 'rec', b: hit.i, t0: W.t, end: W.t + 0.5, t1: W.t };\n    if (hc && hit.alive)",
 "    u.act = { k: 'atk', phase: 'rec', b: hit.i, t0: W.t, end: W.t + 0.5, t1: W.t };\n    { const SR = W.rules.chargeSet || {}; u.offBal = W.t + (sh ? (SR.afterShield != null ? SR.afterShield : 0.3) : (SR.after != null ? SR.after : 0.5)); }   // v5.8.7 들이받은 뒤 빈틈: 잠깐 막지 못함 (방패는 덜)\n    if (hc && hit.alive)",'offBal'),
# AI: 버틸 상대는 피하고, 무너뜨릴 수 있으면 노림
("  if (inGuard(W, t, u, true)) v -= 0.8;\n",
 "  if (inGuard(W, t, u, true)) v -= 0.8;\n  // v5.8.7 태세: 손이 빈 채 이쪽을 보고 막을 수 있는 상대 — 버틸 것 같으면 크게 깎고 (돌격한 쪽이 당함), 무너뜨릴 수 있으면 더함\n  if (t.canGuard && !isFar(t) && t.guardMode !== 'off' && !t.act && W.t >= t.brokenT && aware(W, t, u) && angDiff(t.face, Math.atan2(u.y - t.y, u.x - t.x)) * 180 / Math.PI <= guardArc(W, t) + 10){ const f = focusOf(W, t);\n    if (!(f && f !== u && f.alive && gap(t, f) < (t.rng || 0.5) + 0.4)) v += setCost(W, u, t, Math.max(0.25, Math.min(1.6, vA / 4.5)), br.mass) >= t.post ? 1 : -((W.rules.chargeSet || {}).ai != null ? W.rules.chargeSet.ai : 3); }\n",'ai'),
])
print('ok')
