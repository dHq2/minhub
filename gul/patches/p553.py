import sys
def check(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        if s.count(o)!=1: print('MISMATCH',p,s.count(o),o[:140]); sys.exit(1)
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs: s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)
T=open('rt3_tail.js',encoding='utf-8').read()
i=T.index("  if (o.k === 'charge'){\n    // v5.2 돌진 명령 (액티브 스킬)"); j=T.index("  if (o.k === 'leap'){", i)
OLD_ORDER=T[i:j]
NEW_ORDER="""  if (o.k === 'charge'){
    // v5.5.3 돌진 명령 = "정한 곳으로 돌격!!": 찍은 적 (또는 바닥 자리) 쪽으로 곧장 — 예고 (charge.wind) 뒤 바로 달림. 길을 찾아 돌지 않고 아군 사이는 비집고 나감.
    // 바위가 길을 막거나 너무 멀면 (charge.maxOrd 칸 넘게) 트이는 · 닿는 데까지 걸어감. 다시 쓰기 전이면 그 자리에서 노려보며 기다림.
    // 지휘관을 믿고 뜀 (v5.5.2): 내가 못 봐도 동료가 보면 그대로, 아무도 못 보면 마지막으로 본 자리로 뜀. 이미 붙어 있으면 그냥 공격. 12초가 지나도 못 뛰면 그냥 공격
    const C = W.rules.charge || {}, pt = o.b == null, t = pt ? null : W.units[o.b];
    if (!u.canCharge || u.crawl || (!pt && (!t || !t.alive))){ u.order = null; return; }
    if (o.t0 == null) o.t0 = W.t;
    const toAtk = why => { if (pt){ u.order = null; u.stay = { x: u.x, y: u.y }; return; } if (why) L(W, { k: 'lost', a: u.i, b: t.i, why }); u.order = { k: 'attack', b: t.i }; u.last = { x: t.x, y: t.y }; };
    let tx = pt ? o.x : 0, ty = pt ? o.y : 0, known = pt;
    if (!pt){
      known = canSee(W, u, t) || (u.side === 0 ? !!t.seenBy : fresh(W, u.sense[t.i], 1));
      if (known) u.last = { x: t.x, y: t.y };
      const lp = known ? t : (u.last || t); tx = lp.x; ty = lp.y;
      if (known && gap(u, t) < 0.5){ toAtk(''); return; }   // 이미 붙음 → 그냥 공격
    }
    const d = Math.hypot(tx - u.x, ty - u.y);
    if (d < 0.4){ toAtk(''); return; }
    if (W.t - o.t0 > 12){ toAtk('돌진 길이 안 열림'); return; }
    const clear = fatClear(W.map, u.x, u.y, tx, ty, u.r * 0.9), far = d > (C.maxOrd || 8);
    if (W.t >= u.chargeCd && clear && !far && !u.kb && W.t >= u.proneT){
      if (!pt && known) startCharge(W, u, t, null); else startCharge(W, u, null, { x: tx, y: ty });   // 아무도 못 보면 마지막으로 본 자리로
      if (pt){ u.order = null; u.stay = { x: tx, y: ty }; } else u.order = { k: 'attack', b: t.i };
      return;
    }
    if (!clear || far){ setMood(W, u, clear ? '돌진 거리로' : '돌진 길 트기', t ? t.i : null); goTo(W, u, tx, ty, dt); return; }
    stop(u); u.fg = Math.atan2(ty - u.y, tx - u.x); setMood(W, u, u.chargeName + ' 준비', t ? t.i : null); return;   // 다시 쓸 때를 기다림
  }
"""
H=[
("/* ===== 전투 엔진 v5.5.2 —", "/* ===== 전투 엔진 v5.5.3 —"),
("""   v5.5.2: 사격 솜씨 [사격X]""", """   v5.5.3: 돌진 명령 = "정한 곳으로 돌격!!" — 찍은 적이나 바닥 자리로 예고 뒤 곧장 달림 (길을 찾아 돌지 않음, 아군 사이는 비집고 나감 — 앞을 막은 동료는 옆으로 비켜섬).
           막지 않은 상대는 들이받히면 반드시 잠깐 휘청 (스턴: charge.stun 초 × 무게 비 — 못 움직이고 못 치고 못 막음). 막으면 자세가 깎임.
           방패를 든 쪽은 방패 돌진: 달리는 동안에도 앞을 막고, 더 세게 밀치고 더 오래 휘청이게 함 (방패가 받아 덜 튕김). 방패가 없으면 달리는 동안 못 막음 (공격에 노출).
   v5.5.2: 사격 솜씨 [사격X]"""),
("""  charge: { wind: 0.35, min: 1.5, max: 5,""", """  // v5.5.3 stun = 막지 않은 상대가 휘청이는 초 (× 무게 비 0.4 ~ 1.5) · maxOrd = 명령 돌진이 곧장 뛰는 거리 (칸) · shieldKb · shieldStun = 방패 돌진의 밀침 · 휘청 ×
  charge: { stun: 0.8, maxOrd: 8, shieldKb: 1.3, shieldStun: 1.25, wind: 0.35, min: 1.5, max: 5,"""),
]
TP=[
(OLD_ORDER, NEW_ORDER),
("""chargeName: '돌진', chargeCd: -9,""", """chargeName: p.shield ? '방패 돌진' : '돌진', chargeCd: -9,"""),
("""proneT: -9, crawl: false,""", """proneT: -9, stunT: -9, crawl: false,"""),
("""  const exposed = dir !== 'front' || !!t.act || prone(W, t)""", """  const exposed = dir !== 'front' || !!t.act || prone(W, t) || W.t < (t.stunT || -9)"""),
("""  if (u.kb || W.t < u.proneT) return;   // v5.2 날아가는 중 · 넘어짐: 아무것도 못 함""", """  if (u.kb || W.t < u.proneT || W.t < (u.stunT || -9)) return;   // v5.2 날아가는 중 · 넘어짐 · v5.5.3 휘청: 아무것도 못 함"""),
("""const guardOn = (W, u) => u.alive && u.canGuard && W.t >= u.brokenT && !(u.act && !u.shield) && !u.crawl && W.t >= u.proneT && !u.kb;""",
 """const guardOn = (W, u) => u.alive && u.canGuard && W.t >= u.brokenT && !(u.act && !u.shield) && !u.crawl && W.t >= u.proneT && !u.kb && W.t >= (u.stunT || -9);   // v5.5.3 휘청이면 못 막음 · 방패는 돌진 중에도 막음"""),
# tryCharge → startCharge
("""  // v5.4 돌격 예고: wind 초 동안 자세를 낮추고 노려봄 (예고선) → 달림
  u.act = { k: 'charge', phase: 'wind', b: t.i, t0: W.t, end: W.t + (C.wind != null ? C.wind : 0.35) };
  u.chargeCd = W.t + (C.cd || 8); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); u.face = u.fg;
  const cry = chargeCry(W, u);
  L(W, { k: 'charge', a: u.i, b: t.i, name: u.chargeName, cry, mute: u.mute, vis: u.side === 0 || !!u.seenBy }); setMood(W, u, u.chargeName, t.i);
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: cry, t0: W.t });
  return true;
}""", """  startCharge(W, u, t, null);
  return true;
}
// v5.4 돌격 예고: wind 초 동안 자세를 낮추고 노려봄 (예고선) → 달림. v5.5.3 t = 노리는 상대 (없으면 바닥 자리 pt 로 곧장)
function startCharge(W, u, t, pt){
  const C = W.rules.charge || {}, tx = t ? t.x : pt.x, ty = t ? t.y : pt.y;
  u.act = { k: 'charge', phase: 'wind', b: t ? t.i : null, px: pt ? pt.x : null, py: pt ? pt.y : null, t0: W.t, end: W.t + (C.wind != null ? C.wind : 0.35) };
  u.chargeCd = W.t + (C.cd || 8); stop(u); u.burst = null; u.fg = Math.atan2(ty - u.y, tx - u.x); u.face = u.fg;
  const cry = chargeCry(W, u);
  L(W, { k: 'charge', a: u.i, b: t ? t.i : null, x: pt ? +pt.x.toFixed(2) : null, y: pt ? +pt.y.toFixed(2) : null, name: u.chargeName, cry, mute: u.mute, shield: !!u.shield, vis: u.side === 0 || !!u.seenBy });
  setMood(W, u, u.chargeName, t ? t.i : null);
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: cry, t0: W.t });
}
// v5.5.3 휘청 (스턴): sec 초 동안 못 움직이고 못 치고 못 막음 (넘어지진 않음)
function stun(W, u, sec, by){
  if (!u.alive || !(sec > 0)) return 0;
  u.stunT = Math.max(u.stunT || -9, W.t + sec); interrupt(W, u, '휘청여 준비가 끊김'); stop(u);
  L(W, { k: 'stun', a: by, b: u.i, sec: +sec.toFixed(2), vis: u.side === 0 || !!u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '휘청!', c: 'd', t0: W.t });
  return sec;
}"""),
# 예고 → 달림 (자리도)
("""  if (u.act.k === 'charge' && u.act.phase === 'wind'){   // v5.4 예고 끝 → 그때 상대 쪽으로 달림
    const C = W.rules.charge || {}, t = W.units[u.act.b];
    if (!t || !t.alive){ u.act = null; return; }
    const d = dist(u, t) || 1, sp = spdNow(W, u) * (C.spd || 2.2);
    u.act = { k: 'charge', phase: 'run', b: t.i, t0: W.t, end: W.t + (d + 0.6) / sp, dx: (t.x - u.x) / d, dy: (t.y - u.y) / d, sp };
    u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x); return;
  }""", """  if (u.act.k === 'charge' && u.act.phase === 'wind'){   // v5.4 예고 끝 → 그때 상대 (v5.5.3 또는 정한 자리) 쪽으로 달림
    const C = W.rules.charge || {}, t = u.act.b != null ? W.units[u.act.b] : null, pt = u.act.px != null ? { x: u.act.px, y: u.act.py } : null;
    if (!pt && (!t || !t.alive)){ u.act = null; return; }
    const tx = t && t.alive ? t.x : pt.x, ty = t && t.alive ? t.y : pt.y, d = Math.hypot(tx - u.x, ty - u.y) || 1, sp = spdNow(W, u) * (C.spd || 2.2);
    u.act = { k: 'charge', phase: 'run', b: t ? t.i : null, px: pt ? pt.x : null, py: pt ? pt.y : null, t0: W.t, end: W.t + (d + (t ? 0.6 : 0.15)) / sp, dx: (tx - u.x) / d, dy: (ty - u.y) / d, sp };
    u.fg = u.face = Math.atan2(ty - u.y, tx - u.x); return;
  }"""),
# 달리기: 자리 · 비집기 · 휘청 · 방패
("""  const tg0 = W.units[A.b];
  if (tg0 && tg0.alive){ const want = Math.atan2(tg0.y - u.y, tg0.x - u.x),""", """  const tg0 = A.b != null ? W.units[A.b] : null, aim0 = tg0 && tg0.alive ? tg0 : A.px != null ? { x: A.px, y: A.py } : null;   // v5.5.3 정한 자리로도
  if (aim0){ const want = Math.atan2(aim0.y - u.y, aim0.x - u.x),"""),
("""  tryMove(W, u, u.x + A.dx * A.sp * dt, u.y + A.dy * A.sp * dt);
  const hit = W.units.filter(f => f.alive && f.side !== u.side""", """  tryMove(W, u, u.x + A.dx * A.sp * dt, u.y + A.dy * A.sp * dt);
  // v5.5.3 아군 사이를 비집고 나감: 앞을 막은 동료는 옆으로 밀려 비켜섬 (다치지 않음)
  { const qx = -A.dy, qy = A.dx;
    for (const o of W.units){ if (!o.alive || o === u || o.side !== u.side || o.kb) continue; const ox = o.x - u.x, oy = o.y - u.y, need = o.r + u.r + 0.04; if (Math.hypot(ox, oy) >= need || ox * A.dx + oy * A.dy < -0.1) continue;
      const s = ox * qx + oy * qy, sg = s >= 0 ? 1 : -1, mv = Math.min(0.14, need - Math.abs(s) + 0.02); const om = o.moved; tryMove(W, o, o.x + qx * sg * mv, o.y + qy * sg * mv); o.moved = om;
      if (!A.sq){ A.sq = true; L(W, { k: 'squeeze', a: u.i, b: o.i, vis: u.side === 0 || !!u.seenBy }); } } }
  const hit = W.units.filter(f => f.alive && f.side !== u.side"""),
("""  const tg = W.units[A.b];
  if (!hit && tg && tg.alive && dist(u, tg) < 1.6""", """  const tg = A.b != null ? W.units[A.b] : null;
  if (!hit && A.px != null && !(tg && tg.alive) && Math.hypot(A.px - u.x, A.py - u.y) < 0.25){ u.act = null; return; }   // v5.5.3 정한 자리에 닿음
  if (!hit && tg && tg.alive && dist(u, tg) < 1.6"""),
("""    const blocked = inGuard(W, hit, u);
    strike(W, u, hit, hit, 1, false, { mul: (C.dmg || 0.6) * k, wk: heavyKind(W, u), tag: u.chargeName });""",
 """    const blocked = inGuard(W, hit, u), sh = !!u.shield, shK = sh ? (C.shieldKb || 1.3) : 1;   // v5.5.3 방패 돌진: 더 세게 밀침 · 둔기 (방패로 받아침)
    strike(W, u, hit, hit, 1, false, { mul: (C.dmg || 0.6) * k, wk: sh ? '둔기' : heavyKind(W, u), tag: u.chargeName });"""),
("""    if (blocked && hit.alive){ hit.post -= (C.post || 60) * k; if (hit.post <= 0){ hit.post = 0; hit.brokenT = W.t + W.rules.breakTime; } }
    if (hit.alive){ hit.pinT = W.t + (C.pin || 1.2) * (hit.modBody ? (W.rules.modBody || {}).pin || 0.5 : 1); interrupt(W, hit, '들이받혀 준비가 끊김'); }
    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, clash: !!hc, braced: !!(br.trained || br.mates), trained: !!br.trained, vr: +vr.toFixed(1), vis: u.side === 0 || !!u.seenBy || !!hit.seenBy });""",
 """    if (blocked && hit.alive){ hit.post -= (C.post || 60) * k * shK; if (hit.post <= 0){ hit.post = 0; hit.brokenT = W.t + W.rules.breakTime; } }
    if (hit.alive){ hit.pinT = W.t + (C.pin || 1.2) * (hit.modBody ? (W.rules.modBody || {}).pin || 0.5 : 1); interrupt(W, hit, '들이받혀 준비가 끊김'); }
    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, clash: !!hc, braced: !!(br.trained || br.mates), trained: !!br.trained, vr: +vr.toFixed(1), shield: sh, vis: u.side === 0 || !!u.seenBy || !!hit.seenBy });
    // v5.5.3 막지 않았으면 반드시 잠깐 휘청 (스턴) — 무게 비 만큼 (0.4 ~ 1.5배), 방패 돌진은 더 길게
    if (!blocked && hit.alive) stun(W, hit, (C.stun != null ? C.stun : 0.8) * Math.max(0.4, Math.min(1.5, u.mass / Math.max(1, hit.mass))) * (sh ? (C.shieldStun || 1.25) : 1), u.i);"""),
("""    if (hit.alive && vB2 > 0.2) fling(W, u, hit, vB2 * KB, nx, ny, { how: hc ? 'clash' : 'charge', down: vB2 > dv });
    if (u.alive && vA2 < -0.2) fling(W, hit, u, -vA2 * KB, -nx, -ny, { how: 'recoil', down: -vA2 > dv });""",
 """    if (hit.alive && vB2 > 0.2) fling(W, u, hit, vB2 * KB * shK, nx, ny, { how: hc ? 'clash' : 'charge', down: vB2 > dv });
    if (u.alive && vA2 < -0.2) fling(W, hit, u, -vA2 * KB * (sh ? 0.6 : 1), -nx, -ny, { how: 'recoil', down: -vA2 * (sh ? 0.6 : 1) > dv });   // 방패가 받아 덜 튕김"""),
("""o && o.k === 'charge' ? ['charge', o.b] :""", """o && o.k === 'charge' ? (o.b == null ? ['chargePt', +o.x.toFixed(2), +o.y.toFixed(2)] : ['charge', o.b]) :"""),
("""if (typeof module !== 'undefined') module.exports = { marksOf,""", """if (typeof module !== 'undefined') module.exports = { startCharge, stun, marksOf,"""),
]
check('rt3_head.js',H); check('rt3_tail.js',TP)
patch('rt3_head.js',H); patch('rt3_tail.js',TP)
print('ok')
