def load(p): return open(p).read()
def rep(s,a,b,n=1):
    c=s.count(a); assert c==n,(a[:90],c); return s.replace(a,b)
# ---------- tail ----------
p='rt3_tail.js'; s=load(p)
s=rep(s,"""const nvReach = (W, u) => !u.nv ? 0 : u.nvG === 'B' ? (W.rules.nvB || 5) : u.nvG === 'C' ? (W.rules.nvC || 2.5) : Infinity;   // v7.7 야시로 또렷이 보는 거리""","""const glareAt = (W, u) => !!W.rules.glare && !AI6.includes('glare') && W.light[(u.y | 0) * W.map.W + (u.x | 0)] > W.rules.glare.l;   // v7.8 밝은 빛 속에 선 눈
const nvReach = (W, u) => { if (!u.nv) return 0; const G = W.rules.glare || {}, gl = glareAt(W, u); return u.nvG === 'B' ? (W.rules.nvB || 5) * (gl ? G.k || 0.6 : 1) : u.nvG === 'C' ? (W.rules.nvC || 2.5) * (gl ? G.k || 0.6 : 1) : gl ? G.A || 5 : Infinity; };   // v7.7 야시로 또렷이 보는 거리   // v7.8 빛 속에 서면 줄어듦""")
# 잠든 몸: 암살은 어느 쪽에서든 · 곁의 잠든 동료는 결집이 아님
s=rep(s,"""    if ((t.heads || 1) > 1 || sideOf(W, t, a) !== 'back') return { ok: false, why: '등 뒤가 아님' };""","""    if (!t.sleep && ((t.heads || 1) > 1 || sideOf(W, t, a) !== 'back')) return { ok: false, why: '등 뒤가 아님' };   // v7.8 잠든 몸은 어느 쪽에서든""")
s=rep(s,"""  const n = W.units.filter(o => o.alive && !o.down && o !== t && o.side === t.side && dist(o, t) <= (A.near || 2.5)).length;""","""  const n = W.units.filter(o => o.alive && !o.down && !o.sleep && o !== t && o.side === t.side && dist(o, t) <= (A.near || 2.5)).length;""")
s=rep(s,"""  const A = ASN(W) || {}, sd = sideOf(W, t, u), rch = isFar(u) ? A.knife || 0.35 : u.rng + W.rules.reach * 0.5;""","""  const A = ASN(W) || {}, sd = t.sleep ? 'back' : sideOf(W, t, u), rch = isFar(u) ? A.knife || 0.35 : u.rng + W.rules.reach * 0.5;   // v7.8 잠든 몸은 곧장 다가감""")
s=rep(s,"""  const d0 = t.r + u.r + Math.min(rch, 0.5) * 0.5; let gx = t.x - Math.cos(t.face) * d0, gy = t.y - Math.sin(t.face) * d0;""","""  const d0 = t.r + u.r + Math.min(rch, 0.5) * 0.5; let gx = t.sleep ? t.x + (u.x - t.x) / (dist(u, t) || 1) * d0 : t.x - Math.cos(t.face) * d0, gy = t.sleep ? t.y + (u.y - t.y) / (dist(u, t) || 1) * d0 : t.y - Math.sin(t.face) * d0;""")
# 맞으면 깸
s=rep(s,"""  if (!o.ff && !o.far) t.sense[u.i] = { x: u.x, y: u.y, t: W.t, exact: true };   // 맞으면 친 쪽 자리를 앎""","""  if (!o.ff && !o.far) t.sense[u.i] = { x: u.x, y: u.y, t: W.t, exact: true };   // 맞으면 친 쪽 자리를 앎
  if (t.sleep && t.hp >= 0.5 && real > 0){ const C8 = W.rules.camp || {}; t.sleep = false; t.proneT = W.t + (C8.wakeHit || 0.5); t.wakeT = t.proneT; L(W, { k: 'wake', a: t.i, why: '맞음', sec: C8.wakeHit || 0.5, vis: t.side === 0 || !!t.seenBy }); }   // v7.8 맞으면 벌떡 깸""")
# 새 함수 (암살 묶음 앞)
s=rep(s,"""// v7.7 사주경계: 맞붙지 않은 몸은 가끔 뒤를 돌아봄""","""// v7.8 야영지: 잠든 몸이 깨는 조건 (맞음은 applyDmg) — 경보 · 외침 · 총성 · 비명 · 둘레 싸움 소리 · 숨지 않은 상대의 발소리
function wakeTick(W, dt){
  const C = W.rules.camp; if (!C) return;
  for (const u of W.units){ if (!u.alive || !u.sleep) continue;
    let why = '';
    if (u.side === 1 && W.alarm1 && W.alarm1.spread) why = '경보';
    else if (u.state === 'hunt' || u.state === 'search') why = '외침';
    else if (W.noises.some(n => W.t - n.t0 < 0.15 && n.kind !== 'bark' && Math.hypot(n.x - u.x, n.y - u.y) <= W.rules.hear * (n.kind === 'scream' ? 1 : C.hear || 0.8))) why = W.noises.some(n => n.kind === 'scream' && W.t - n.t0 < 0.15) ? '비명' : '총성';
    else if (W.rules.din && dinAt(W, u.x, u.y) > (C.din || 2.5)) why = '싸움 소리';
    else if (W.units.some(e => e.alive && e.side !== u.side && dist(e, u) < (C.near || 1.2) && stealthK(W, e) >= 1) && W.rand() < (C.step || 0.5) * dt) why = '발소리';
    if (!why) continue;
    const g = C.wake || [1.2, 2.6], sec = (g[0] + W.rand() * (g[1] - g[0])) * (u.vet ? 0.7 : 1);
    u.sleep = false; u.proneT = W.t + sec; u.wakeT = u.proneT; u.rest = false;
    L(W, { k: 'wake', a: u.i, why, sec: +sec.toFixed(1), vis: u.side === 0 || !!u.seenBy });
  }
}
// v7.8 횃불 · 장작 던지기: 저 어둠 속으로 빛을 — 떨어진 자리 둘레가 밝아짐 (양쪽 모두에게)
const FLR = W => W.rules.flare;
function flareStep(W, u, dt, o, end){
  const F = FLR(W) || {};
  if (!u.torch && !o.brand){ L(W, { k: 'flareFail', a: u.i, why: '든 횃불이 없음', vis: u.side === 0 || !!u.seenBy }); end(); return; }
  if (u.act) return;
  const d = Math.hypot(o.x - u.x, o.y - u.y);
  if (o.t0 == null) o.t0 = W.t;
  if (W.t - o.t0 > 15){ L(W, { k: 'flareFail', a: u.i, why: '던질 자리에 닿지 못함', vis: u.side === 0 || !!u.seenBy }); end(); return; }
  if (d > (F.rng || 7)){ setMood(W, u, '던질 거리로'); goTo(W, u, o.x, o.y, dt); return; }
  const ang = Math.atan2(o.y - u.y, o.x - u.x); stop(u); u.fg = ang;
  if (angDiff(u.face, ang) > 0.5){ setMood(W, u, o.brand ? '장작을 들고 돌아섬' : '던지려 돌아섬'); return; }
  u.act = { k: 'flare', b: null, phase: 'wind', t0: W.t, end: W.t + (F.wind || 0.6) * (o.brand ? 1.3 : 1), px: o.x, py: o.y, brand: !!o.brand, done: end };
  setMood(W, u, o.brand ? '불붙은 장작을 던짐' : '횃불을 던짐');
}
function resolveFlare(W, u){
  const A = u.act, F = FLR(W) || {}; if (A.phase !== 'wind'){ u.act = null; return; }
  const d = Math.hypot(A.px - u.x, A.py - u.y), sc = (F.scat || 0.3) + (F.scatD || 0.05) * d, a = W.rand() * 6.283, rr = Math.sqrt(W.rand()) * sc;
  let x = Math.max(0.5, Math.min(W.map.W - 0.5, A.px + Math.cos(a) * rr)), y = Math.max(0.5, Math.min(W.map.H - 0.5, A.py + Math.sin(a) * rr));
  for (let k = 0; k < 20 && (rock(W.map, x, y) || !losClear(W.map, u.x, u.y, x, y)); k++){ x = u.x + (x - u.x) * 0.85; y = u.y + (y - u.y) * 0.85; }   // 바위에 막히면 그 앞에 떨어짐
  let own = false;
  if (A.brand){ W.torches.push({ x, y, brand: true, r: F.brandR || 3, until: W.t + (F.brandT || 40) }); W.brandN = (W.brandN || 0) + 1; }
  else if (u.side === 0 && W.spare > 0){ W.spare--; W.torches.push({ x, y, dropped: true, thrown: true }); }   // 여분에 불을 붙여 던짐 — 든 횃불은 그대로
  else { own = true; u.torch = false; u.torchOff = false; W.torches.push({ x, y, dropped: true, thrown: true }); }
  computeLight(W);
  L(W, { k: 'flare', a: u.i, x: +x.toFixed(1), y: +y.toFixed(1), own, brand: !!A.brand, spare: W.spare, vis: u.side === 0 || !!u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'flare', x0: u.x, y0: u.y, x1: x, y1: y, t0: W.t, dur: 0.45 });
  A.phase = 'rec'; A.t1 = W.t; A.end = W.t + 0.3;
  if (A.done){ const f = A.done; A.done = null; f(); }
}
// 적: 모닥불 곁의 몸이 보이지 않는 위협 (냄새 · 소리 · 날아온 방향으로 아는데 아무도 못 보는 상대) 쪽 어둠으로 불붙은 장작을 던짐 — 스스로 (프로)
function brandAI(W){
  const F = FLR(W), CF = W.campFire; if (!F || !CF || AI6.includes('brand') || !W.alarm1 || W.t < (W.brandNext || 0) || (W.brandN || 0) >= (F.brandN || 3)) return;
  if (W.units.some(e => e.brandO)) return;
  let tgt = null;
  for (const f of W.units){ if (!f.alive || f.side === 1 || W.units.some(e => e.alive && e.side === 1 && canSee(W, e, f))) continue;
    const sn = W.units.filter(e => e.alive && e.side === 1).map(e => e.sense[f.i]).find(x => fresh(W, x, 4)); if (!sn) continue;
    if (Math.hypot(sn.x - CF.x, sn.y - CF.y) > (F.rng || 7) + (F.grab || 2.2) || glowAt(W, sn.x, sn.y)) continue; tgt = { x: sn.x, y: sn.y }; break; }
  if (!tgt){ const r = (W.inc || []).filter(q => q.side === 1 && W.t - q.t < 3).pop(); if (r){ const dE = Math.min(7, Math.max(2, r.tr)); tgt = { x: r.x + r.dx * dE, y: r.y + r.dy * dE }; } }
  if (!tgt || glowAt(W, tgt.x, tgt.y)) return;
  const u = W.units.filter(e => e.alive && !e.down && e.side === 1 && !e.sleep && W.t >= e.proneT && !e.act && !e.shadow && !e.supp && !e.lurk && dist(e, CF) <= (F.grab || 2.2) && Math.hypot(tgt.x - e.x, tgt.y - e.y) <= (F.rng || 7) && !W.units.some(f => f.alive && f.side !== 1 && gap(e, f) < 1.5)).sort((a, b) => dist(a, CF) - dist(b, CF))[0];
  if (!u) return;
  W.brandNext = W.t + (F.gap || 4); u.brandO = { x: tgt.x, y: tgt.y, brand: true };
}
// 장작은 타다 꺼짐
function emberTick(W){ let ch = false; for (const t of W.torches) if (t.until && !t.off && W.t > t.until){ t.off = true; ch = true; } if (ch){ computeLight(W); L(W, { k: 'brandOut', vis: true }); } }
// v7.7 사주경계: 맞붙지 않은 몸은 가끔 뒤를 돌아봄""")
# resolveAct
s=rep(s,"""  if (u.act.k === 'supp'){ resolveSupp(W, u); return; }   // v7.7 견제사격""","""  if (u.act.k === 'supp'){ resolveSupp(W, u); return; }   // v7.7 견제사격
  if (u.act.k === 'flare'){ resolveFlare(W, u); return; }   // v7.8 횃불 · 장작 던지기""")
# preempt lists
s=rep(s,"""  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload', 'palm', 'assn', 'supp'].includes(a.k)""","""  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload', 'palm', 'assn', 'supp', 'flare'].includes(a.k)""")
s=rep(s,"""  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal', 'palm', 'assn', 'supp'].includes(a.k)""","""  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal', 'palm', 'assn', 'supp', 'flare'].includes(a.k)""")
s=rep(s,"""|| (o.k === 'supp' && a.k === 'supp')""","""|| (o.k === 'supp' && a.k === 'supp') || (o.k === 'flare' && a.k === 'flare')""")
# doOrder
s=rep(s,"""  if (o.k === 'supp'){ suppStep(W, u, dt, o, () => { u.order = null; u.stay = { x: u.x, y: u.y }; }); return; }   // v7.7 견제사격""","""  if (o.k === 'supp'){ suppStep(W, u, dt, o, () => { u.order = null; u.stay = { x: u.x, y: u.y }; }); return; }   // v7.7 견제사격
  if (o.k === 'flare'){ flareStep(W, u, dt, o, () => { u.order = null; u.stay = { x: u.x, y: u.y }; }); return; }   // v7.8 횃불 던지기""")
s=rep(s,"""const orderTxt = (o, u) => o && o.k === 'supp' ?""","""const orderTxt = (o, u) => o && o.k === 'flare' ? ['flare', +o.x.toFixed(2), +o.y.toFixed(2)] : o && o.k === 'supp' ?""")
s=rep(s,"""['move', 'amove', 'line', 'lret', 'scout', 'assn', 'pick',""","""['move', 'amove', 'line', 'lret', 'scout', 'assn', 'flare', 'pick',""")
# act2: 적 장작 · 불가에서 쉼
s=rep(s,"""  if (u.side === 1 && (u.supp || u.suppPend) && suppAct(W, u, dt)) return;   // v7.7 적 사수의 견제사격 (지휘관이 시킴)
""","""  if (u.side === 1 && (u.supp || u.suppPend) && suppAct(W, u, dt)) return;   // v7.7 적 사수의 견제사격 (지휘관이 시킴)
  if (u.side === 1 && u.brandO){ flareStep(W, u, dt, u.brandO, () => { u.brandO = null; }); return; }   // v7.8 불붙은 장작
""")
s=rep(s,"""    u.wander -= dt;""","""    if (u.rest && W.campFire && u.state === 'idle'){ stop(u); u.fg = Math.atan2(W.campFire.y - u.y, W.campFire.x - u.x); setMood(W, u, '불가에서 쉼'); return; }   // v7.8 불을 보고 쉼 (등은 어둠 쪽)
    u.wander -= dt;""")
# 야영지: 모닥불 · 잠 · 불빛 밖 초병
s=rep(s,"""  main.forEach((u, j) => { const a = j / Math.max(1, main.length) * 6.283; put(u, camp.x + Math.cos(a) * (j ? 1.3 : 0), camp.y + Math.sin(a) * (j ? 1.3 : 0)); });""","""  const CP = W.rules.camp, ring = CP ? CP.ring || 1.5 : 1.3, a00 = W.rand() * 6.283;
  main.forEach((u, j) => { const a = a00 + j / Math.max(1, main.length) * 6.283; put(u, camp.x + Math.cos(a) * (CP || j ? ring : 0), camp.y + Math.sin(a) * (CP || j ? ring : 0), CP ? a + Math.PI : null); });
  let sleepers = [];
  if (CP){   // v7.8 모닥불 · 불가에서 쉼 · 일부는 잠듦 (지휘관은 깨어 있음)
    W.campFire = { x: camp.x, y: camp.y }; W.torches.push({ x: camp.x, y: camp.y, fire: true, r: CP.fire || 4.5 });
    const cand = main.filter(u => !u.cmd); sleepers = cand.slice(0, Math.floor(cand.length * (CP.sleep != null ? CP.sleep : 0.5) + 0.5));
    for (const u of main){ u.rest = true; if (sleepers.includes(u)){ u.sleep = true; u.proneT = 1e9; } }
  }""")
s=rep(s,"""  if (sentry){ let p = null; for (const d of [3.5, 3, 2.5, 2, 1.5]) for""","""  if (sentry){ let p = null; const fo = CP ? (CP.fire || 4.5) + (CP.sentryOut || 1.2) : 0; for (const d of [...(CP ? [fo, fo - 0.6, fo - 1.2] : []), 3.5, 3, 2.5, 2, 1.5]) for""")
s=rep(s,"""  W.start = { k: 'patrol', camp, desc: `적 진은 ${dirName(ex, ey)}쪽 ${Math.round(Math.hypot(ex, ey))}칸 — 본대 ${main.map(u => u.name).join(' · ') || '없음'}""","""  W.start = { k: 'patrol', camp, sleep: sleepers.map(u => u.i), desc: `적 진은 ${dirName(ex, ey)}쪽 ${Math.round(Math.hypot(ex, ey))}칸${CP ? ' · 모닥불' : ''} — 본대 ${main.map(u => u.name + (u.sleep ? ' (잠)' : '')).join(' · ') || '없음'}""")
# 틱
s=rep(s,"""  watchTick(W);   // v7.7 사주경계 (뒤돌아봄)""","""  watchTick(W);   // v7.7 사주경계 (뒤돌아봄)
  wakeTick(W, dt); emberTick(W);   // v7.8 잠에서 깸 · 장작이 꺼짐""")
s=rep(s,"""dinTick(W); posKnownTick(W); planShadow(W); suppAI(W); }""","""dinTick(W); posKnownTick(W); planShadow(W); suppAI(W); brandAI(W); }""")
# 아군 야시 사수: 빛 밖 (화광 없는) 자리를 고름
s=rep(s,"""      if (u.side === 1 && !glowAt(W, x, y)) s += u.stalk ? 3 : 1.2;""","""      if (u.side === 1 && !glowAt(W, x, y)) s += u.stalk ? 3 : 1.2;
      else if (u.side === 0 && u.nv && W.rules.glare && W.light[(y | 0) * W.map.W + (x | 0)] <= W.rules.glare.l) s += 0.8;   // v7.8 야시 사수는 빛 밖 (어둠에 눈이 익은 채) 에서 쏨""")
# 잠든 · 쉬는 몸은 다른 일에 끌려가지 않음
s=rep(s,"""const pactFree = (W, u) => u.alive && !u.crawl && !u.pact && !u.shadow && !u.supp &&""","""const pactFree = (W, u) => u.alive && !u.crawl && !u.pact && !u.shadow && !u.supp && !u.sleep &&""")
s=rep(s,"""module.exports = { sideV,""","""module.exports = { wakeTick, flareStep, brandAI, glareAt, sideV,""")
open(p,'w').write(s)
print('ok')
