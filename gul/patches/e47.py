h=open('rt3_head.js').read()
def rh(a,b):
    global h
    assert h.count(a)==1,(a[:80],h.count(a)); h=h.replace(a,b)
rh("""/* ===== 전투 엔진 v4.6 —""","""/* ===== 전투 엔진 v4.7 —""")
rh("""   v4.6: 등급 특성""","""   v4.7: [공통스킬:투창] (굴 3D 의 투창을 옮김): 창을 든 인물이 조준 (javelin.wind) → 던짐. 날아가는 동안 꺾이지 않고 (투사체), 명중 · 치명이 높음.
         던지면 맨손. 몸에 박히거나 (그 자리에 떨어짐) 방어에 막히거나 (앞으로 튕김) 바위에 튕기거나 빗나가면 (떨어진 자리) 땅에 남은 창을 주워야 다시 던짐.
         AI: 사선이 열리고 (아군 · 막는 방패 없음) 확률이 기준 이상이면 던짐. 던진 뒤엔 창 둘레가 안전할 때 주우러 감.
         적 탱커: 방어 자세가 있는 적 (방패병 등, 포위 · 우회 전술이 아닌) 도 아군 탱커처럼 무리 앞 전선 · 노출된 동료 막아서기 ('뒤로!'). 적 전선은 밀고 나가지 않고 버팀.
         적의 보통 근접 · 창병은 싸울 거리가 아니면 자기 편 방패 뒤에 섬 → 대치.
   v4.6: 등급 특성""")
rh("""  grades: {""","""  // [공통스킬:투창]: 조준 시간 · 탄속 (칸/초) · 사거리 · 명중률 (가까이 → 끝) · 피해 × · 치명 확률 · 치명 × · 막힐 때 상대 자세 ×
  javelin: { wind: 0.7, vel: 18, rng: 6, aimNear: 0.97, aimFar: 0.75, mul: 2.2, crit: 0.35, critMul: 1.8, post: 2 },
  grades: {""")
open('rt3_head.js','w').write(h)

s=open('rt3_tail.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a)); s=s.replace(a,b)
rep("""fx: [], log: [], noises: [], brief: null, shots: [], shotN: 0,""","""fx: [], log: [], noises: [], brief: null, shots: [], shotN: 0, items: [], covers: {},""")
rep("""      bladeHands: !!p.bladeHands,""","""      jav: (p.traits || []).includes('공통스킬:투창') && (wp.kind === '날붙이' || p.weapon === '창'), spearHeld: true,   // 투창: 창을 든 채인가
      bladeHands: !!p.bladeHands,""")
# javelin helpers after launch()
rep("""function stepShots(W, dt){""","""/* ---------- v4.7 [공통스킬:투창] ---------- */
const JV = W => W.rules.javelin || { wind: 0.7, vel: 18, rng: 6, aimNear: 0.97, aimFar: 0.75, mul: 2.2, crit: 0.35, critMul: 1.8, post: 2 };
function aimJ(W, u, t){
  const J = JV(W), f = Math.min(1, Math.max(0, gap(u, t)) / J.rng);
  let p = J.aimNear + (J.aimFar - J.aimNear) * f;
  if (Math.hypot(t.vx, t.vy) > 0.6) p *= 0.85;
  if (blindTo(W, u, t)) p *= W.rules.darkAimFar != null ? W.rules.darkAimFar : 0.1;
  return Math.max(0.02, Math.min(0.99, p));
}
function startThrow(W, u, t, why){
  const J = JV(W);
  u.act = { k: 'throw', b: t.i, phase: 'wind', t0: W.t, end: W.t + J.wind, why: why || '투창' };
  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  setMood(W, u, '투창', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, jav: true, end: +(W.t + J.wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: why || '' });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: J.wind });
}
function resolveThrow(W, u){
  const A = u.act, t = W.units[A.b], J = JV(W);
  if (A.phase !== 'wind'){ u.act = null; return; }
  let why = '';
  if (!t.alive) why = '대상이 이미 쓰러짐'; else if (gap(u, t) > J.rng + 0.5) why = '사거리 밖으로 벗어남'; else if (!canSee(W, u, t)) why = '보이지 않음';
  if (why) L(W, { k: 'miss', a: u.i, b: t.i, why: why + ' (창은 그대로)' });
  else {
    const d = Math.max(0.3, dist(u, t)), p = aimJ(W, u, t), base = Math.atan2(t.y - u.y, t.x - u.x);
    const off = W.rand() < p ? (W.rand() * 2 - 1) * t.r * 0.5 : (W.rand() < 0.5 ? -1 : 1) * (t.r + 0.12 + W.rand() * 0.5);
    const ang = base + Math.atan2(off, d), dx = Math.cos(ang), dy = Math.sin(ang);
    W.shots.push({ id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: J.vel, left: J.rng + u.r + 1.5, p: +p.toFixed(2), t0: W.t, side: u.side, jav: true, wpn: u.weapon });
    u.shots++; u.spearHeld = false; u.rngSpear = u.rng; u.rng = (W.rules.weapons['맨손'] || { rng: 0.3 }).rng; u.weaponNow = '맨손';
    L(W, { k: 'throw', a: u.i, b: t.i, p: +p.toFixed(2), vis: u.side === 0 || !!u.seenBy });
  }
  A.phase = 'rec'; A.end = W.t + u.rec; A.t1 = W.t;
}
// 땅에 떨어진 창: 바위 안이면 날아온 쪽으로 물려 놓음
function dropSpear(W, s, x, y, how){
  for (let k = 0; k < 8 && rock(W.map, x, y); k++){ x -= s.dx * 0.25; y -= s.dy * 0.25; }
  if (rock(W.map, x, y)){ x = s.x0; y = s.y0; }
  W.items.push({ k: 'spear', x: +x.toFixed(2), y: +y.toFixed(2), owner: s.a, name: s.wpn || '창', t: W.t });
  L(W, { k: 'spearDrop', a: s.a, x: +x.toFixed(2), y: +y.toFixed(2), how });
}
const mySpear = (W, u) => W.items.find(it => it.k === 'spear' && it.owner === u.i);
function pickSpear(W, u, it){
  W.items = W.items.filter(x => x !== it); u.spearHeld = true; u.rng = u.rngSpear || u.rng0; u.weaponNow = null;
  L(W, { k: 'spearPick', a: u.i, x: it.x, y: it.y, vis: u.side === 0 || !!u.seenBy });
}
// 던진 창 줍기: 창 둘레 (1.8칸) 에 보이는 상대가 없으면 (안전하면) 주우러 감. 둘레가 위험하면 false
function retrieveSpear(W, u, dt, force){
  if (!u.jav || u.spearHeld) return false;
  const it = mySpear(W, u); if (!it) return false;
  if (!force && W.units.some(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f)) && Math.hypot(f.x - it.x, f.y - it.y) - f.r < 1.8)) return false;
  if (Math.hypot(it.x - u.x, it.y - u.y) <= 0.6){ pickSpear(W, u, it); return true; }
  setMood(W, u, '창 주우러'); goTo(W, u, it.x, it.y, dt); return true;
}
// 던질 만한가: 창을 들었고, 손 닿는 거리 밖 · 사거리 안, 사선이 열림 (아군 · 이쪽을 막는 방어 자세 없음), 확률 ≥ 기준
function tryThrow(W, u, t, ordered){
  if (!u.jav || !u.spearHeld || u.act) return false;
  const J = JV(W), g = gap(u, t);
  if (g <= u.rng + 0.25 || g > J.rng || !canSee(W, u, t) || !losClear(W.map, u.x, u.y, t.x, t.y)) return false;
  const first = firstOnLine(W, u, t, u, knows(W, u));
  if (first !== t && (first.side === u.side || inGuard(W, first, u))) return false;
  if (first === t && inGuard(W, t, u) && !ordered) return false;   // 막는 방향으로는 안 던짐 (한 번뿐이니)
  if (!ordered && ffRisk(W, u, t, 0.12 + 0.3 * (1 - u.bold))) return false;
  const p = aimJ(W, u, t);
  let th = 0.85 - u.bold * 0.3 - u.waitT * 0.03 - (t.act ? 0.15 : 0) - (supportOf(W, t) === 0 ? 0.1 : 0);
  if (ordered) th = 0.15;
  if (p < th) return false;
  startThrow(W, u, t, ordered ? '투창' : t.act ? '틈을 노림' : supportOf(W, t) === 0 ? '고립된 상대' : '투창');
  return true;
}
function stepShots(W, dt){""")
rep("""        strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true);
        break;
      }
      if (rock(W.map, nx, ny)){ s.done = true; u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: '빗나가 바위에 맞음', fired: true, p: s.p }); break; }
      s.x = nx; s.y = ny; s.left -= st;
      if (s.left <= 1e-6){ s.done = true; u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: `빗나감 (명중률 ${Math.round(s.p * 100)}%)`, fired: true, p: s.p }); if (W.fxOn){ const m = W.units[s.meant]; W.fx.push({ k: 'num', x: m.x, y: m.y, s: '빗나감', c: 'm', t0: W.t }); } }""","""        const o2 = strike(W, u, hit, W.units[s.meant], hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, s.jav ? { jav: true } : null);
        // 창: 막히면 앞으로 튕겨 떨어짐, 몸에 박히면 그 자리에 떨어짐
        if (s.jav){ if (o2 && o2.block) dropSpear(W, s, s.x - s.dx * 0.6, s.y - s.dy * 0.6, 'block'); else dropSpear(W, s, hit.x + (W.rand() - 0.5) * 0.6, hit.y + (W.rand() - 0.5) * 0.6, 'stuck'); }
        break;
      }
      if (rock(W.map, nx, ny)){ s.done = true; u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: '빗나가 바위에 맞음', fired: true, p: s.p }); if (s.jav) dropSpear(W, s, s.x - s.dx * 0.4, s.y - s.dy * 0.4, 'bounce'); break; }
      s.x = nx; s.y = ny; s.left -= st;
      if (s.left <= 1e-6){ s.done = true; u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: `빗나감 (명중률 ${Math.round(s.p * 100)}%)`, fired: true, p: s.p }); if (W.fxOn){ const m = W.units[s.meant]; W.fx.push({ k: 'num', x: m.x, y: m.y, s: '빗나감', c: 'm', t0: W.t }); } if (s.jav) dropSpear(W, s, s.x, s.y, 'miss'); }""")
# strike: extra param jav (mul, crit, posture), return o
rep("""function strike(W, u, t, meant, p, far){
  const R = W.rules;""","""function strike(W, u, t, meant, p, far, extra){
  const R = W.rules, J = extra && extra.jav ? JV(W) : null;""")
rep("""  const dir = sideOf(W, t, u), base = u.atk * u.atkMul * (led ? 1 + R.aura : 1) * v * (R.lethal || 1);""","""  const dir = sideOf(W, t, u), base = u.atk * u.atkMul * (led ? 1 + R.aura : 1) * v * (R.lethal || 1) * (J ? J.mul : 1);""")
rep("""    t.post -= R.postCost * (t.gCost || 1) * (o.far ? 1 : u.strMul || 1); t.blockT = W.t; t.blocked++;""","""    o.jav = !!J;
    t.post -= R.postCost * (t.gCost || 1) * (J ? J.post * (u.strMul || 1) : o.far ? 1 : u.strMul || 1); t.blockT = W.t; t.blocked++;""")
rep("""    applyDmg(W, u, t, Math.max(1, Math.round(base * R.blockMul)), o);
    return;
  }""","""    applyDmg(W, u, t, Math.max(1, Math.round(base * R.blockMul)), o);
    return o;
  }""")
rep("""  const dmg = Math.max(1, Math.round(base * flank * (P[part] ? P[part].mul : 1) * (amb ? R.ambushMul || 1 : 1)));
  o.part = part; o.ambush = amb;""","""  const crit = !!J && W.rand() < J.crit;   // 투창: 치명
  const dmg = Math.max(1, Math.round(base * flank * (P[part] ? P[part].mul : 1) * (amb ? R.ambushMul || 1 : 1) * (crit ? J.critMul : 1)));
  o.part = part; o.ambush = amb; o.jav = !!J; o.crit = crit;""")
rep("""  t.pinT = W.t + R.pinTime;
  applyDmg(W, u, t, dmg, o);
}""","""  t.pinT = W.t + R.pinTime * (J ? 1.5 : 1);
  applyDmg(W, u, t, dmg, o);
  return o;
}""")
rep("""ambush: !!o.ambush, blade: !o.far && !!u.bladeHands });""","""ambush: !!o.ambush, blade: !o.far && !!u.bladeHands, jav: !!o.jav, crit: !!o.crit });""")
# resolveAct dispatch
rep("""function resolveAct(W, u){
  if (u.act.k === 'skill'){ resolveSkill(W, u); return; }""","""function resolveAct(W, u){
  if (u.act.k === 'skill'){ resolveSkill(W, u); return; }
  if (u.act.k === 'throw'){ resolveThrow(W, u); return; }""")
# covers per side
rep("""  W.cover = { g: u.i, ang, t: W.t, side: u.side };""","""  W.covers[u.side] = { g: u.i, ang, t: W.t, side: u.side };""")
rep("""  const C = W.cover; if (!C || C.side !== u.side || W.t - C.t > 0.6) return false;""","""  const C = W.covers[u.side]; if (!C || W.t - C.t > 0.6) return false;""")
rep("""  const others = W.units.filter(a => a.alive && a.side === u.side && a !== g && !a.order && !a.canGuard).sort((a, b) => a.i - b.i), k = Math.max(0, others.indexOf(u));""","""  const others = W.units.filter(a => a.alive && a.side === u.side && a !== g && !a.order && !a.canGuard && !a.pack && !a.stalk).sort((a, b) => a.i - b.i), k = Math.max(0, others.indexOf(u));""")
# tankAI side-aware visibility + enemy hold (no push)
rep("""  if (W.units.some(f => f.alive && f.side !== u.side && (f.seenBy || u.side === 1) && !isFar(f) && gap(u, f) <= 1.2)){ u.frontT = 0; return false; }
  const mates = W.units.filter(a => a.alive && a !== u && a.side === u.side);""","""  if (W.units.some(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f)) && !isFar(f) && gap(u, f) <= 1.2)){ u.frontT = 0; return false; }
  const mates = W.units.filter(a => a.alive && a !== u && a.side === u.side && (u.side === 0 || (!a.pack && !a.stalk && dist(a, u) < 6)));""")
rep("""  u.frontT = (u.frontT || 0) + dt;""","""  u.frontT = u.side === 0 ? (u.frontT || 0) + dt : 0;   // 적 전선은 밀고 나가지 않고 버팀 (대치)""")
rep("""    if (!f.alive || f.side === a.side || !(a.side === 0 ? f.seenBy : true)) continue;""","""    if (!f.alive || f.side === a.side || !(a.side === 0 ? f.seenBy : W.units.some(e => e.alive && e.side === a.side && canSee(W, e, f)))) continue;""")
# act2: enemy tank + spear retrieval for both sides
rep("""  if (u.side === 0 && u.canGuard && tankAI(W, u, dt)) return;
  const hero = W.units.find(h => h.hero && h.alive);""","""  if (u.side === 0 && u.canGuard && tankAI(W, u, dt)) return;
  if (u.side === 1 && u.canGuard && !u.pack && !u.stalk && (u.state === 'hunt' || u.state === 'search') && tankAI(W, u, dt)) return;   // 적 탱커 (방패병 등)
  if (!u.order && u.jav && !u.spearHeld && retrieveSpear(W, u, dt)) return;
  const hero = W.units.find(h => h.hero && h.alive);""")
# fight: throw first; enemy line fighters stay behind their shield
rep("""  if (!ordered && u.stalk && stalk(W, u, t, dt)) return;
  if (!ordered && u.pack && !isFar(u)){ packHunt(W, u, t, dt); return; }""","""  if (tryThrow(W, u, t, ordered)) return;
  if (!ordered && u.stalk && stalk(W, u, t, dt)) return;
  if (!ordered && u.pack && !isFar(u)){ packHunt(W, u, t, dt); return; }
  // 적의 보통 근접 · 창병: 손 닿는 거리가 아니면 자기 편 방패 뒤에 섬 (대치). 창이 땅에 있으면 안전할 때 줍기
  if (!ordered && u.side === 1 && !u.canGuard && !isFar(u) && gap(u, t) > u.rng + 0.6){
    if (retrieveSpear(W, u, dt)) return;
    if (behindCover(W, u, dt)) return;
  }""")
# ordered pick spear
rep("""  if (o.k === 'pick'){
    // 횃불 줍기: 떨어진 횃불 자리로 가서 주워 듦""","""  if (o.k === 'pick' && o.spear){   // 던진 창 줍기 (명령이면 둘레가 위험해도)
    if (!retrieveSpear(W, u, dt, true)){ u.order = null; } else if (u.spearHeld) u.order = null;
    return;
  }
  if (o.k === 'pick'){
    // 횃불 줍기: 떨어진 횃불 자리로 가서 주워 듦""")
s=s.replace("module.exports = { gradeMul,","module.exports = { tryThrow, mySpear, aimJ, gradeMul,")
open('rt3_tail.js','w').write(s)
print('ok')
