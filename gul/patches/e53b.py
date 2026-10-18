import sys
def patch(p, pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        c=s.count(o)
        if c!=1: print('MISMATCH',p,c,o[:120]); sys.exit(1)
        s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)


blk = r"""/* ---------- v5.3 돌격 (보병 · 탱커 공통) · 운동량 충돌 · 방진 버팀 ---------- */
// 버팀: 돌격 방향 (dx, dy) 쪽 뒤 · 옆 1.3칸 안 동료의 무게 × brace 가 받쳐 줌. 이쪽을 막고 선 전선 (훈련된 방진) 은 × trained
function braceOf(W, t, u, dx, dy){
  const C = W.rules.charge || {};
  let m = 0;
  for (const o of W.units){
    if (!o.alive || o === t || o.side !== t.side || o.kb || prone(W, o)) continue;
    const ox = o.x - t.x, oy = o.y - t.y, d = Math.hypot(ox, oy); if (d > 1.3) continue;
    if ((ox * dx + oy * dy) / (d || 1) < -0.2) continue;
    m += o.mass * (C.brace != null ? C.brace : 0.6);
  }
  const trained = guardOn(W, t) && inGuard(W, t, u) && t.role === '전선';
  return { mass: (t.mass + m) * (trained ? C.trained || 1.6 : 1), trained, mates: m > 0 };
}
// 돌격할 만한 값: 부딪힌 뒤 상대가 날아갈 속력 (버팀 포함) + 빈틈 (옆 · 뒤) · 사수 · 준비 · 재장전 중 · 벽 쪽 − 막고 선 방패 정면 · 뛰어들면 둘러싸임 · 다침
function chargeValue(W, u, t){
  const C = W.rules.charge || {}, d = dist(u, t) || 1, dx = (t.x - u.x) / d, dy = (t.y - u.y) / d;
  const vA = spdNow(W, u) * (C.spd || 2.2), br = braceOf(W, t, u, dx, dy);
  let v = (1 + (C.e != null ? C.e : 0.3)) * u.mass / (u.mass + br.mass) * vA / 2;
  if (sideOf(W, t, u) !== 'front') v += 1.5;
  if (isFar(t)) v += 1.5;
  if (t.act && t.act.phase === 'wind') v += 0.7;
  if (t.act && t.act.k === 'reload') v += 1;
  if (inGuard(W, t, u)) v -= 0.8;
  if (wallBehind(W, t, dx, dy, t.r + 1.2)) v += 1.2;
  const crowd = W.units.filter(o => o.alive && o !== t && o.side === t.side && !isFar(o) && dist(o, t) < 1.6).length, mates = W.units.filter(o => o.alive && o !== u && o.side === u.side && dist(o, t) < 2.2).length;
  if (crowd > mates + 1) v -= 1.5 * (crowd - mates - 1);
  if (u.hp / u.max < 0.35) v -= 1;
  return v;
}
const chargeOk = (W, u, t) => chargeValue(W, u, t) >= ((W.rules.charge || {}).worth != null ? W.rules.charge.worth : 1.8) - u.bold * 0.8;
// 돌격할 상대 고르기 (빈틈을 노림): 돌격 거리 안 · 보이는 상대 중 값이 가장 큰 쪽
function bestCharge(W, u){
  const C = W.rules.charge || {};
  let best = null, bv = -1e9;
  for (const f of W.units){
    if (!f.alive || f.side === u.side || !canSee(W, u, f)) continue;
    const g = gap(u, f); if (g < (C.min || 1.5) || g > (C.max || 5)) continue;
    const v = chargeValue(W, u, f); if (v > bv){ bv = v; best = f; }
  }
  return best && bv >= (C.worth != null ? C.worth : 1.8) - u.bold * 0.8 ? best : null;
}
// 외침: 말하는 쪽은 말 (카리우스 "크아아!" · 보통 "이야아아!"), 말 없는 쪽은 무기 이모지 + 달리기
const CHARGE_EMO = { '창': '🔱', '어부의 창': '🔱', '둔기': '🔨', '이빨·발톱': '🐾' };
const SHOUT_EMO = { '뒤로!': '🛡️', '내 뒤로!': '🛡️', '비켜!': '⚠️' };
function chargeCry(W, u){
  if (u.cry) return u.cry;
  if (!u.mute) return u.giant ? '크아아!' : '이야아아!';
  const k = ((W.rules.weapons || {})[u.weapon] || {}).kind;
  return (CHARGE_EMO[u.weapon] || (k === '날붙이' ? '⚔️' : k === '둔기' ? '🔨' : '🏃')) + '💨';
}
// 날려 보냄 (len 칸, dx · dy 쪽): 처음부터 벽에 붙어 있으면 짓눌림, 아니면 날아감 (stepKb). o.down = 넘어짐 여부 (없으면 거리로)
function fling(W, a, t, len, dx, dy, o){
  if (!t.alive || t.kb || !(len > 0)) return null;
  const S = W.rules.shove || {}, l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
  if (len >= 0.25 && wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, S.wall || 1.2, o, true); return 'pinned'; }
  if (len < 0.12){ tryMove(W, t, t.x + dx * len, t.y + dy * len); return 'nudge'; }
  interrupt(W, t, '밀려나 준비가 끊김');
  t.kb = { dx, dy, left: len, len, by: a.i, o: o || {}, hit: [a.i, t.i], p: (o && o.p) || len };
  stop(t);
  L(W, { k: 'shove', a: a.i, b: t.i, len: +len.toFixed(2), how: (o && o.how) || '', vis: a.side === 0 || t.side === 0 || !!a.seenBy || !!t.seenBy });
  return 'fly';
}
// v5.3 창 2열: 창 (사거리 0.9 넘는 근접) 은 동료가 이미 맞붙은 상대를 그 동료 옆 · 뒤에서 찌름 — 상대 손은 안 닿고 내 창은 닿는 자리
function pikeStep(W, u, t, dt){
  if (isFar(u) || u.rng < 0.9 || u.crawl) return false;
  const f = W.units.filter(o => o.alive && o !== u && o.side === u.side && !isFar(o) && gap(o, t) < 0.5).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (!f) return false;
  if (W.units.some(e => e.alive && e.side !== u.side && e !== t && !isFar(e) && gap(u, e) < e.rng + 0.2)) return false;
  const g = gap(u, t);
  if (g <= u.rng && g > t.rng + 0.1){ startAct(W, u, t, '2열 찌르기'); return true; }
  const base = Math.atan2(f.y - t.y, f.x - t.x);
  let best = null, bs = -1e9;
  for (const da of [0.5, -0.5, 0.9, -0.9, 0.25, -0.25]) for (const dr of [0.1, 0.3]){
    const rr = u.rng + t.r + u.r - dr, a = base + da, x = t.x + Math.cos(a) * rr, y = t.y + Math.sin(a) * rr;
    if (boxRock(W, x, y, u.r * 0.9)) continue;
    if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.95)) continue;
    const gg = rr - t.r - u.r; if (gg < t.rng + 0.12) continue;
    if (W.units.some(e => e.alive && e.side !== u.side && e !== t && !isFar(e) && Math.hypot(e.x - x, e.y - y) - e.r - u.r < e.rng + 0.3)) continue;
    const s = -Math.hypot(x - u.x, y - u.y) - Math.abs(da) * 0.5;
    if (s > bs){ bs = s; best = { x, y }; }
  }
  if (!best) return false;
  setMood(W, u, '2열', t.i); goTo(W, u, best.x, best.y, dt);
  return true;
}
// 돌아서는 빠르기 배율 (무거울수록 느림)
const turnMul = (W, u) => Math.max(0.35, Math.min(1.3, Math.sqrt((W.rules.turnMass || 70) / Math.max(20, u.mass || 70))));

"""

T='rt3_tail.js'
patch(T,[
# 유닛
("""    const s = statsOf(p, rules), wp = (p.weapon && rules.weapons && rules.weapons[p.weapon]) || {}, far = s.rng > 1, tr = p.traits || [], acts = Array.isArray(p.active) ? p.active : p.active ? [p.active] : [], hh = heightOf(p);""",
 """    const s = statsOf(p, rules), wp = (p.weapon && rules.weapons && rules.weapons[p.weapon]) || {}, far = s.rng > 1, tr = p.traits || [], acts = Array.isArray(p.active) ? p.active : p.active ? [p.active] : [], hh = heightOf(p), role0 = roleOf(p, rules);
    // v5.3 돌격: 보병 (공격수) · 탱커 (전선) 의 공통 기술 (개 · 사족보행 빼고). [돌진] 은 카리우스의 돌격
    const commonCharge = (rules.charge || {}).common !== false && !far && (role0 === '공격수' || role0 === '전선') && p.tac !== 'pack' && !tr.includes('사족보행');"""),
("""      canCharge: tr.includes('돌진') || acts.includes('돌진'), chargeCd: -9,""",
 """      canCharge: tr.includes('돌진') || acts.includes('돌진') || acts.includes('돌격') || commonCharge, chargeName: tr.includes('돌진') || acts.includes('돌진') ? '돌진' : '돌격', chargeCd: -9,
      heads: tr.includes('머리 넷') ? 4 : 1, cry: p.cry || '', mute: p.mute != null ? !!p.mute : p.side === 1,   // v5.3 [머리 넷] · 외침 (말 없는 쪽은 이모지 — 적 기본)"""),
# 공격 시작: '비켜!' 외침 (말 없는 쪽은 이모지)
("""  if (mode === 'sweep' && swingArc(W, u, Math.atan2(t.y - u.y, t.x - u.x)).M.length){ L(W, { k: 'shout', a: u.i, s: '비켜!' }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '비켜!', t0: W.t }); }""",
 """  if (mode === 'sweep' && swingArc(W, u, Math.atan2(t.y - u.y, t.x - u.x)).M.length){ L(W, { k: 'shout', a: u.i, s: '비켜!', mute: u.mute }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: u.mute ? SHOUT_EMO['비켜!'] : '비켜!', t0: W.t }); }"""),
# 돌격 시작
("""function tryCharge(W, u, t){
  const C = W.rules.charge || {}, g = gap(u, t);
  if (!u.canCharge || u.crawl || u.act || W.t < u.chargeCd""",
 """function tryCharge(W, u, t, forced){
  const C = W.rules.charge || {}, g = gap(u, t);
  if (!u.canCharge || u.crawl || u.act || u.kb || W.t < u.proneT || W.t < u.chargeCd"""),
("""  if (W.units.some(o => o.alive && o !== u && o !== t && o.side === u.side && segD(u, t.x, t.y, o) < o.r + u.r)) return false;   // 길에 동료가 있으면 안 함
  const d = dist(u, t) || 1, sp = spdNow(W, u) * (C.spd || 2.6);""",
 """  if (W.units.some(o => o.alive && o !== u && o !== t && o.side === u.side && segD(u, t.x, t.y, o) < o.r + u.r)) return false;   // 길에 동료가 있으면 안 함
  if (!forced && !chargeOk(W, u, t)) return false;   // v5.3 돌격할 만한가 (빈틈 · 버팀)
  const d = dist(u, t) || 1, sp = spdNow(W, u) * (C.spd || 2.2);"""),
("""  L(W, { k: 'charge', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); setMood(W, u, '돌진', t.i);
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '돌진!', t0: W.t });""",
 """  const cry = chargeCry(W, u);
  L(W, { k: 'charge', a: u.i, b: t.i, name: u.chargeName, cry, mute: u.mute, vis: u.side === 0 || !!u.seenBy }); setMood(W, u, u.chargeName, t.i);
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: cry, t0: W.t });"""),
# 부딪힘: 운동량 충돌
("""  if (hit){
    const blocked = inGuard(W, hit, u);
    strike(W, u, hit, hit, 1, false, { mul: C.dmg || 0.6, wk: '둔기' });   // 몸으로 들이받음 = 둔기
    if (blocked && hit.alive){ hit.post -= C.post || 60; if (hit.post <= 0){ hit.post = 0; hit.brokenT = W.t + W.rules.breakTime; } }
    if (hit.alive){ hit.pinT = W.t + (C.pin || 1.2) * (hit.modBody ? (W.rules.modBody || {}).pin || 0.5 : 1); interrupt(W, hit, '들이받혀 준비가 끊김'); }
    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, vis: u.side === 0 || !!u.seenBy || !!hit.seenBy });
    if (hit.alive) shove(W, u, hit, (C.push || 1.2) * (blocked ? 0.8 : 1), A.dx, A.dy, { how: 'charge' });   // v5.2 무게 비만큼 날아감 — 벽이면 짓뭉개짐
    u.act = { k: 'atk', phase: 'rec', b: hit.i, t0: W.t, end: W.t + 0.5, t1: W.t };
    return;
  }""",
 """  if (hit){
    // v5.3 운동량 충돌 (부딪히는 선 n 위 1차원): 상대도 돌격 중이면 속력이 합쳐짐 (마주 돌격), 서 있는 상대는 방진 버팀만큼 무거워짐.
    // 부딪힌 뒤 속력 vA2 = vA − (1+e)·mB/(mA+mB)·vr, vB2 = vB + (1+e)·mA/(mA+mB)·vr → 그 속력 × kb 초 만큼 날아감 (가벼운 쪽이 튕겨 나감, downV 넘으면 넘어짐)
    const nl = dist(u, hit) || 1, nx = (hit.x - u.x) / nl, ny = (hit.y - u.y) / nl, hc = hit.act && hit.act.k === 'charge' && hit.act.phase === 'run' ? hit.act : null;
    const vA = (A.dx * nx + A.dy * ny) * A.sp, vB = hc ? (hc.dx * nx + hc.dy * ny) * hc.sp : 0, vr = Math.max(0.5, vA - vB);
    const br = hc ? { mass: hit.mass, trained: false, mates: false } : braceOf(W, hit, u, nx, ny), mA = u.mass, mB = br.mass, e = C.e != null ? C.e : 0.3;
    const vA2 = vA - (1 + e) * mB / (mA + mB) * vr, vB2 = vB + (1 + e) * mA / (mA + mB) * vr, k = Math.max(0.5, Math.min(1.6, vr / 4.5));
    const blocked = inGuard(W, hit, u);
    strike(W, u, hit, hit, 1, false, { mul: (C.dmg || 0.6) * k, wk: heavyKind(W, u), tag: u.chargeName });
    if (hc && hit.alive && u.alive) strike(W, hit, u, u, 1, false, { mul: (C.dmg || 0.6) * k, wk: heavyKind(W, hit), tag: hit.chargeName });   // 마주 돌격: 둘 다 침
    if (blocked && hit.alive){ hit.post -= (C.post || 60) * k; if (hit.post <= 0){ hit.post = 0; hit.brokenT = W.t + W.rules.breakTime; } }
    if (hit.alive){ hit.pinT = W.t + (C.pin || 1.2) * (hit.modBody ? (W.rules.modBody || {}).pin || 0.5 : 1); interrupt(W, hit, '들이받혀 준비가 끊김'); }
    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, clash: !!hc, braced: !!(br.trained || br.mates), trained: !!br.trained, vr: +vr.toFixed(1), vis: u.side === 0 || !!u.seenBy || !!hit.seenBy });
    u.act = { k: 'atk', phase: 'rec', b: hit.i, t0: W.t, end: W.t + 0.5, t1: W.t };
    if (hc && hit.alive) hit.act = { k: 'atk', phase: 'rec', b: u.i, t0: W.t, end: W.t + 0.5, t1: W.t };
    const KB = C.kb != null ? C.kb : 0.3, dv = C.downV != null ? C.downV : 4;
    if (hit.alive && vB2 > 0.2) fling(W, u, hit, vB2 * KB, nx, ny, { how: hc ? 'clash' : 'charge', down: vB2 > dv });
    if (u.alive && vA2 < -0.2) fling(W, hit, u, -vA2 * KB, -nx, -ny, { how: 'recoil', down: -vA2 > dv });
    return;
  }"""),
# 날아가다 멈춤: 넘어짐 여부 (돌격은 속력으로)
("""  if (K.left <= 0.01){ u.kb = null; if (K.len >= (S.downLen || 0.9)) knockDown(W, u, S.prone || 0.9, K.by, '나가떨어짐'); }""",
 """  if (K.left <= 0.01){ u.kb = null; if (K.o.down != null ? K.o.down : K.len >= (S.downLen || 0.9)) knockDown(W, u, S.prone || 0.9, K.by, '나가떨어짐'); }"""),
# 밀침 = 무게 비로 거리 → fling
("""function shove(W, a, t, power, dx, dy, o){
  if (!t.alive || power <= 0 || t.kb) return null;
  const S = W.rules.shove || {}, l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
  const len = kbLen(W, a, t, power) * (t.crawl ? 0.5 : 1);
  if (wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, S.wall || 1.2, o, true); return 'pinned'; }
  if (len < 0.12){ tryMove(W, t, t.x + dx * len, t.y + dy * len); return 'nudge'; }
  interrupt(W, t, '밀려나 준비가 끊김');
  t.kb = { dx, dy, left: len, len, by: a.i, o: o || {}, hit: [a.i, t.i], p: power };
  stop(t);
  L(W, { k: 'shove', a: a.i, b: t.i, len: +len.toFixed(2), how: (o && o.how) || '', vis: a.side === 0 || t.side === 0 || !!a.seenBy || !!t.seenBy });
  return 'fly';
}""",
 """function shove(W, a, t, power, dx, dy, o){
  if (!t.alive || power <= 0 || t.kb) return null;
  const S = W.rules.shove || {}, l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
  const len = kbLen(W, a, t, power) * (t.crawl ? 0.5 : 1);
  if (wallBehind(W, t, dx, dy, t.r + 0.3)){ crushWall(W, a, t, S.wall || 1.2, o, true); return 'pinned'; }
  return fling(W, a, t, len, dx, dy, { ...(o || {}), p: power });
}"""),
# 넓게 휘두르기: 몸이 보는 쪽으로
("""    const ang = Math.atan2(t.y - u.y, t.x - u.x), { F, M } = swingArc(W, u, ang), all""", """    const ang = u.face, { F, M } = swingArc(W, u, ang), all"""),
# 근접: 몸이 상대 쪽을 봐야 (못 돌면 기다림)
("""  if (A.phase === 'wind'){
    // v5.2 넓게 휘두르기""", """  if (A.phase === 'wind'){
    // v5.3 근접은 몸이 상대 쪽 (±faceArc) 을 봐야 들어감 — 못 돌았으면 0.6초까지 기다림 (무거운 몸은 늦게 돎)
    if (A.k === 'atk' && !isFar(u) && t.alive && angDiff(u.face, Math.atan2(t.y - u.y, t.x - u.x)) > rv(W, 'faceArc', 70) * Math.PI / 180){ if (A.lateT == null) A.lateT = W.t; if (W.t - A.lateT < 0.6){ A.end = W.t + 0.03; return; } }
    // v5.2 넓게 휘두르기"""),
("""    else if (A.k === 'atk' && !canSee(W, u, t)) why = '보이지 않음';""", """    else if (A.k === 'atk' && !canSee(W, u, t)) why = '보이지 않음';
    else if (A.k === 'atk' && !far && angDiff(u.face, Math.atan2(t.y - u.y, t.x - u.x)) > rv(W, 'faceArc', 70) * Math.PI / 180) why = '몸을 돌리지 못함';"""),
# 준비하는 동안 상대 쪽으로 몸을 돌림
("""  if (u.act){ if (u.burst) tickBurst(W, u);""", """  if (u.act && u.act.k === 'atk' && u.act.phase === 'wind' && !isFar(u)){ const tt = W.units[u.act.b]; if (tt && tt.alive) u.fg = Math.atan2(tt.y - u.y, tt.x - u.x); }   // v5.3 준비하는 동안 상대 쪽으로 몸을 돌림
  if (u.act){ if (u.burst) tickBurst(W, u);"""),
# 돌아서기: 무게
("""  const m = (W.rules.turnRate || 300) * Math.PI / 180 * dt;
  u.face = Math.abs(d) <= m ? u.fg : u.face + Math.sign(d) * m;""", """  const m = (W.rules.turnRate || 300) * Math.PI / 180 * dt * turnMul(W, u);   // v5.3 무거울수록 천천히
  u.face = Math.abs(d) <= m ? u.fg : u.face + Math.sign(d) * m;"""),
# [머리 넷]: 등 뒤도 앎
("""  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f) && sideOf(W, u, f) !== 'back')""", """  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f) && (u.heads > 1 || sideOf(W, u, f) !== 'back'))"""),
("""  if (canSee(W, t, a) && sideOf(W, t, a) !== 'back') return true;""", """  if (canSee(W, t, a) && (t.heads > 1 || sideOf(W, t, a) !== 'back')) return true;   // v5.3 [머리 넷] 은 등 뒤도 봄"""),
# 외침 (말 없는 쪽은 이모지)
("""  u.shoutT = W.t; L(W, { k: 'shout', a: u.i, s });
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s, t0: W.t });""", """  u.shoutT = W.t; L(W, { k: 'shout', a: u.i, s, mute: u.mute });
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: u.mute ? SHOUT_EMO[s] || '❗' : s, t0: W.t });   // v5.3 말 없는 쪽은 이모지"""),
# 싸움: 창 2열 · 돌격 (값으로)
("""  if (u.canCharge && !isFar(u) && (ordered || u.side === 1 || pushing(W, u, t) || u.role !== '전선' || t.canGuard || t.bodyShield) && tryCharge(W, u, t)) return;""",
 """  if (!ordered && pikeStep(W, u, t, dt)) return;   // v5.3 창 2열
  if (u.canCharge && !isFar(u) && tryCharge(W, u, t, false)) return;   // v5.3 돌격 (빈틈 · 버팀을 따져)"""),
# 탱커: 빈틈을 노려 돌격
("""  if (u.canCharge && f0 && W.t >= u.chargeCd && (f0.canGuard || f0.bodyShield || (focusOf(W, f0) && focusOf(W, f0).side === u.side)) && tryCharge(W, u, f0)) return true;""",
 """  if (u.canCharge && W.t >= u.chargeCd){ const bc = bestCharge(W, u); if (bc && tryCharge(W, u, bc, false)) return true; }   // v5.3 빈틈을 노려 돌격 (훈련된 방진은 잘 안 밀림)"""),
("""    if (tryCharge(W, u, t)){ u.order = { k: 'attack', b: t.i }; return; }""", """    if (tryCharge(W, u, t, true)){ u.order = { k: 'attack', b: t.i }; return; }"""),
("""if (typeof module !== 'undefined') module.exports = { pinDown,""", """if (typeof module !== 'undefined') module.exports = { braceOf, chargeValue, bestCharge, chargeCry, fling, pikeStep, turnMul, pinDown,"""),
("""/* ---------- v5.2 적의 조 나누기 · 산개 ---------- */""", blk + """/* ---------- v5.2 적의 조 나누기 · 산개 ---------- */"""),
])
# mid: 몸이 닿는 거리 — [머리 넷] 은 등 뒤도
patch('rt3_mid.js',[
("""if (d <= (u.r || 0) + (t.r || 0) + 0.35 && (u.face == null || sideOf(W, u, t) !== 'back')) return true;""",
 """if (d <= (u.r || 0) + (t.r || 0) + 0.35 && (u.face == null || u.heads > 1 || sideOf(W, u, t) !== 'back')) return true;"""),
])
print('ok')
