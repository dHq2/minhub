h=open('rt3_head.js').read()
def rh(a,b):
    global h
    assert h.count(a)==1,(a[:80],h.count(a)); h=h.replace(a,b)
rh("""/* ===== 전투 엔진 v4.0 —""","""/* ===== 전투 엔진 v4.1 —""")
rh("""   v3.4: 맵 종류 gridC""","""   v4.1: 감각 · 정보. 후각 A (가까이 4칸은 정확히, 9칸까지는 대략적인 방향과 거리) · S (맵 전체를 대략). 아군 후각 (포렌) 은 3초마다 브리핑:
         '오른쪽 뒤, 둘 — 가까이. 가까워진다' (보이지 않는 적만). 브리핑 · 짖는 소리 · 총성으로 안 방향은 '감지' 일 뿐 공격을 막아 주지는 않음.
         개 (포위 사냥): 앞의 개가 짖으며 붙잡아 두고, 다른 개는 빈 옆 · 뒤로. 등을 보이거나 공격 중 · 움찔 · 자세가 무너지면 물고 곧바로 거리를 벌려 계속 괴롭힘.
         검사 · 저격총수 (어둠 속 우회): 야시 없음, 불빛으로 아군 위치를 앎. 자기 자리가 어두우면 '안 보일 것' 이라 믿고 (틀릴 수 있음) 뒤쪽 어둠으로 돔.
         암살: 옆 · 뒤에서, 상대가 알아차리지 못했고 (못 봄 · 감지 없음 · 공격 동작에 묶임 · 앞의 상대와 맞붙음) 대응할 수 없을 때 근접 무기가 들어가면 치명상 (피해 ×ambushMul).
         맞은 쪽의 비명으로 둘레 동료가 친 자리를 정확히 앎 → 몰려감. 몸이 닿을 거리라도 등 뒤는 어둠 속에서 모름.
   v3.4: 맵 종류 gridC""")
rh("""  smell: 4,           // [높은후각] 특성: 이 거리 안의 상대는 빛이 없어도 냄새로 찾음 (바위 너머도)""","""  smell: 4,           // [높은후각] 특성: 이 거리 안의 상대는 빛이 없어도 냄새로 찾음 (바위 너머도)
  smellFar: 9,        // 후각 A: 이 거리까지는 대략적인 방향과 거리 (S 는 맵 전체)
  briefT: 3,          // 아군 후각 (포렌) 이 보이지 않는 적의 방향 · 거리를 알리는 간격 (초)
  senseT: 3.5,        // 냄새 · 브리핑 · 짖는 소리로 안 것이 '감지' 로 남는 시간 (초)
  ambushMul: 3,       // 암살 (알아차리지 못한 옆 · 뒤에 들어간 근접 공격) 피해 ×
  barkT: 2.5,         // 개가 짖는 간격 (초)""")
open('rt3_head.js','w').write(h)

m=open('rt3_mid.js').read()
a="""  if (d <= (u.r || 0) + (t.r || 0) + 0.35) return true;   // v4.0: 몸이 닿을 만큼 붙으면 어둠 속에서도 앎"""
b="""  if (d <= (u.r || 0) + (t.r || 0) + 0.35 && (u.face == null || sideOf(W, u, t) !== 'back')) return true;   // v4.0: 몸이 닿을 만큼 붙으면 어둠 속에서도 앎 (v4.1: 등 뒤는 모름)"""
assert m.count(a)==1; m=m.replace(a,b); open('rt3_mid.js','w').write(m)

s=open('rt3_tail.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a)); s=s.replace(a,b)
# unit fields
rep("""shield: !!p.shield, smell: (p.traits || []).includes('높은후각') ? rules.smell : 0, traits:""","""shield: !!p.shield, smellG: (p.traits || []).includes('높은후각') ? (p.smellG === 'S' ? 'S' : 'A') : '', smell: (p.traits || []).includes('높은후각') ? rules.smell : 0, traits:""")
rep("""      mood: '', moodB: null, moodT: 0, moodLogT: -9, waitT: 0, vx: 0, vy: 0, heard: null, spot: null,""","""      mood: '', moodB: null, moodT: 0, moodLogT: -9, waitT: 0, vx: 0, vy: 0, heard: null, spot: null,
      // v4.1: 감각 (sense[적 번호] = 대략 / 정확한 자리 · 때) · 전술 (pack = 포위 사냥, stalk = 어둠 속 우회)
      sense: {}, briefAt: 0, briefPrev: {}, pack: p.tac === 'pack', stalk: p.tac === 'stalk', barkAt: -9, ambushes: 0,""")
rep("""  const W = { map, rules, t: 0, rand: mulberry32(seed), units: [], torches: setup.torches.map(t => ({ ...t })), fx: [], log: [], noises: [],""","""  const W = { map, rules, t: 0, rand: mulberry32(seed), units: [], torches: setup.torches.map(t => ({ ...t })), fx: [], log: [], noises: [], brief: null,""")

# senses, awareness, brief, bark helpers: insert before setMood
rep("""function setMood(W, u, m, b){""","""/* ---------- v4.1 감각: 냄새 · 브리핑 · 짖는 소리 · 알아차림 ---------- */
const NO_AMBUSH = ['맨손', '이빨·발톱'];   // 물기 · 주먹은 암살 치명상이 없음
const fresh = (W, s, k) => s && W.t - s.t <= (k || W.rules.senseT);
// 후각: 가까이 (smell) 는 정확히, 그 밖 smellFar (S = 맵 전체) 까지는 대략 (멀수록 크게 틀림). 1초마다 새로 맡음
function smellTick(W, u){
  if (!u.smellG) return;
  const R = W.rules, far = u.smellG === 'S' ? 1e9 : R.smellFar;
  for (const f of W.units){
    if (!f.alive || f.side === u.side) continue;
    const d = dist(u, f); if (d > far) continue;
    const s = u.sense[f.i]; if (s && s.smell && W.t - s.t < 1) continue;
    const ex = d <= u.smell, e = ex ? 0 : Math.min(2, 0.6 + d * 0.15);
    u.sense[f.i] = { x: f.x + (W.rand() * 2 - 1) * e, y: f.y + (W.rand() * 2 - 1) * e, t: W.t, exact: ex, smell: true };
  }
}
const REL = ['앞', '오른쪽 앞', '오른쪽', '오른쪽 뒤', '뒤', '왼쪽 뒤', '왼쪽', '왼쪽 앞'];
const BAND = ['가까이', '조금 떨어져', '멀리'];
// 브리핑 (아군 후각): 보이지 않는 적을 바라보는 방향 기준 8방향 · 거리 세 단계로 묶어 동료 모두에게 알림
function brief(W, u){
  u.briefAt = W.t;
  const far = u.smellG === 'S' ? 1e9 : W.rules.smellFar;
  const hid = W.units.filter(f => f.alive && f.side !== u.side && !f.seenBy && dist(u, f) <= far);
  if (!hid.length){ u.briefPrev = {}; return; }
  const G = new Map(), prev = u.briefPrev; u.briefPrev = {};
  for (const f of hid){
    const ang = Math.atan2(f.y - u.y, f.x - u.x); let rel = (ang - u.face) % (2 * Math.PI); if (rel > Math.PI) rel -= 2 * Math.PI; if (rel < -Math.PI) rel += 2 * Math.PI;
    const sec = ((Math.round(rel / (Math.PI / 4)) % 8) + 8) % 8, d = dist(u, f), band = d <= 3 ? 0 : d <= 6 ? 1 : 2, key = sec + ':' + band;
    u.briefPrev[f.i] = d;
    const g = G.get(key) || { sec, band, n: 0, closer: false, foes: [], ang: u.face + sec * Math.PI / 4, d: [2, 4.5, 7.5][band] };
    g.n++; g.foes.push(f.i); if (prev[f.i] != null && d < prev[f.i] - 0.7) g.closer = true;
    G.set(key, g);
  }
  const groups = [...G.values()].sort((a, b) => a.band - b.band);
  W.brief = { a: u.i, t: W.t, x: u.x, y: u.y, groups };
  L(W, { k: 'brief', a: u.i, groups: groups.map(g => ({ rel: REL[g.sec], band: g.band, n: g.n, closer: g.closer, foes: g.foes, ang: +g.ang.toFixed(2) })) });
  for (const a of W.units) if (a.alive && a.side === u.side) for (const g of groups) for (const fi of g.foes)
    if (!(a.sense[fi] && a.sense[fi].exact && W.t - a.sense[fi].t < 1)) a.sense[fi] = { x: u.x + Math.cos(g.ang) * g.d, y: u.y + Math.sin(g.ang) * g.d, t: W.t, exact: false, brief: true };
}
// 짖기: 상대 편이 짖은 개의 방향을 앎 (소리). 짖는 쪽도 자리를 드러내는 대가
function bark(W, u){
  u.barkAt = W.t;
  W.noises.push({ x: +u.x.toFixed(2), y: +u.y.toFixed(2), t0: W.t, side: u.side, a: u.i, kind: 'bark' });
  for (const o of W.units) if (o.alive && o.side !== u.side && dist(o, u) <= W.rules.hear) o.sense[u.i] = { x: u.x + (W.rand() - 0.5), y: u.y + (W.rand() - 0.5), t: W.t, exact: false, bark: true };
  L(W, { k: 'bark', a: u.i, x: +u.x.toFixed(2), y: +u.y.toFixed(2), vis: !!u.seenBy });
}
// 알아차림: 보이거나, 감지 (냄새 · 브리핑 · 짖는 소리 · 비명) 했고 대응할 수 있음 (공격 동작에 묶이지 않음 · 앞의 다른 상대와 맞붙지 않음)
function aware(W, t, a){
  if (canSee(W, t, a)) return true;
  if (!fresh(W, t.sense[a.i]) || t.act) return false;
  return !W.units.some(f => f.alive && f !== a && f.side !== t.side && !isFar(f) && canSee(W, t, f) && gap(t, f) <= Math.max(t.rng, f.rng) + 0.3);
}
function setMood(W, u, m, b){""")

# ambush in strike (after guard block return)
rep("""  // 부위: 노출 (측면 · 뒤 · 공격 준비 · 회복 중) 이면 머리가 두 배로 잘 뽑힘
  const exposed = dir !== 'front' || !!t.act, P = R.parts || { '몸통': { w: 1, mul: 1 } };""","""  // 암살: 옆 · 뒤에서, 알아차리지 못한 상대에게 근접 무기가 들어감 → 치명상
  const amb = !o.far && dir !== 'front' && !NO_AMBUSH.includes(u.weaponNow || u.weapon) && !aware(W, t, u);
  // 부위: 노출 (측면 · 뒤 · 공격 준비 · 회복 중) 이면 머리가 두 배로 잘 뽑힘
  const exposed = dir !== 'front' || !!t.act, P = R.parts || { '몸통': { w: 1, mul: 1 } };""")
rep("""  const dmg = Math.max(1, Math.round(base * flank * (P[part] ? P[part].mul : 1)));
  o.part = part;""","""  const dmg = Math.max(1, Math.round(base * flank * (P[part] ? P[part].mul : 1) * (amb ? R.ambushMul || 1 : 1)));
  o.part = part; o.ambush = amb;
  if (amb){ u.ambushes++;
    // 비명: 둘레 동료가 친 자리를 정확히 앎 (곧바로 몰려옴)
    W.noises.push({ x: +t.x.toFixed(2), y: +t.y.toFixed(2), t0: W.t, side: t.side, a: t.i, kind: 'scream' });
    for (const o2 of W.units) if (o2.alive && o2 !== t && o2.side === t.side && dist(o2, t) <= R.hear) o2.sense[u.i] = { x: u.x, y: u.y, t: W.t, exact: true, scream: true };
  }""")
rep("""ff: !!o.ff, meant: o.meant, p: o.p, far: o.far });""","""ff: !!o.ff, meant: o.meant, p: o.p, far: o.far, ambush: !!o.ambush });""")
rep("""  if (t.side === 1 && !o.ff && t.state !== 'hunt'){ t.state = 'hunt'; t.target = u; t.last = { x: u.x, y: u.y }; t.searchT = 6; alertNear(W, t, u); }""",
"""  if (t.side === 1 && !o.ff && t.state !== 'hunt'){ t.state = 'hunt'; t.target = u; t.last = { x: u.x, y: u.y }; t.searchT = 6; alertNear(W, t, u); }
  if (!o.ff && !o.far) t.sense[u.i] = { x: u.x, y: u.y, t: W.t, exact: true };   // 맞으면 친 쪽 자리를 앎""")

# think: senses
rep("""  if (u.side === 0 && u.order) return;   // 명령을 받은 아군은 명령대로
  const hero = W.units.find(h => h.hero && h.alive);""","""  smellTick(W, u);
  if (u.side === 0 && u.smellG && W.t - u.briefAt >= R.briefT) brief(W, u);
  // 야시 없는 적: 주인공의 횃불은 멀리서도 보임 (보는 거리 × 1.6, 바위가 가리면 안 보임) → 대략 자리를 앎
  const hero = W.units.find(h => h.hero && h.alive);
  if (u.side === 1 && !u.nv && hero && dist(u, hero) <= R.sight * 1.6 && losClear(W.map, u.x, u.y, hero.x, hero.y) && !fresh(W, u.sense[hero.i], 0.9)) u.sense[hero.i] = { x: hero.x + (W.rand() - 0.5), y: hero.y + (W.rand() - 0.5), t: W.t, exact: false, light: true };
  if (u.side === 0 && u.order) return;   // 명령을 받은 아군은 명령대로""")
rep("""    } else if (u.state === 'hunt'){ u.state = 'search'; }
    return;
  }""","""    } else {
      if (u.state === 'hunt') u.state = 'search';
      // 보이진 않지만 감지한 상대 (냄새 · 불빛 · 소리) → 그 대략적인 자리 쪽으로
      if (u.state !== 'search' || !u.last){
        const s = foes.map(f => [f, u.sense[f.i]]).filter(([f, x]) => fresh(W, x, 2)).sort((a, b) => Math.hypot(a[1].x - u.x, a[1].y - u.y) - Math.hypot(b[1].x - u.x, b[1].y - u.y))[0];
        if (s){ u.state = 'search'; u.last = { x: s[1].x, y: s[1].y }; u.searchT = 5; }
      }
    }
    return;
  }""")
rep("""  if (seen.length){ if (u.target !== seen[0]) u.waitT = 0; u.state = 'fight'; u.target = seen[0]; return; }
  u.target = null;""","""  if (seen.length){ if (u.target !== seen[0]) u.waitT = 0; u.state = 'fight'; u.target = seen[0]; return; }
  // 비명으로 정확히 안 자리 (2.5초 안, 8칸 안) → 몰려감
  const sx = foes.map(f => [f, u.sense[f.i]]).filter(([f, s]) => s && s.exact && W.t - s.t < 2.5 && dist(u, f) <= 8).sort((a, b) => dist(u, a[0]) - dist(u, b[0]))[0];
  if (sx){ u.state = 'fight'; u.target = sx[0]; u.last = { x: sx[1].x, y: sx[1].y }; return; }
  u.target = null;""")

# fight: stalk / pack dispatch
rep("""  if (!ordered && cover(W, u, t, dt)) return;
  if (isFar(u)) shoot(W, u, t, dt, ordered); else melee(W, u, t, dt, ordered);
}""","""  if (!ordered && cover(W, u, t, dt)) return;
  if (!ordered && u.stalk && stalk(W, u, t, dt)) return;
  if (!ordered && u.pack && !isFar(u)){ packHunt(W, u, t, dt); return; }
  if (isFar(u)) shoot(W, u, t, dt, ordered); else melee(W, u, t, dt, ordered);
}
// 개 (포위 사냥): 앞의 개가 짖으며 붙잡아 두고, 나머지는 비어 있는 옆 · 뒤로. 틈이 나면 물고 곧바로 거리를 벌림 (계속 괴롭힘)
function packHunt(W, u, t, dt){
  const R = W.rules, g = gap(u, t);
  const pack = W.units.filter(o => o.alive && o.pack && o.side === u.side && o.target === t);
  const lead = (pack.length ? pack : [u]).reduce((a, b) => dist(b, t) < dist(a, t) ? b : a) === u;
  const ring = t.r + u.r + Math.max(t.rng, 0.35) + 0.8;
  if (lead && W.t - u.barkAt >= R.barkT && g < 4.5) bark(W, u);
  // 문 뒤 1.2초: 물러나 거리를 벌림
  if (u.atkT > 0 && W.t - u.atkT < 1.2){
    const d = dist(u, t) || 1, gx = t.x + (u.x - t.x) / d * ring, gy = t.y + (u.y - t.y) / d * ring;
    setMood(W, u, '거리 벌리기', t.i);
    if (!rock(W.map, gx, gy)) goTo(W, u, gx, gy, dt); else moveDir(W, u, (u.x - t.x) / d, (u.y - t.y) / d, dt);
    return;
  }
  const op = (t.act && t.act.b !== u.i) || sideOf(W, t, u) !== 'front' || W.t < t.pinT || (t.canGuard && !guardOn(W, t));
  if (op || u.waitT > 4 + (1 - u.bold) * 6){
    if (inReach(u, t)){ startAct(W, u, t, op ? '물기' : '밀어붙임'); return; }
    if (g < 2.8){ setMood(W, u, '달려듦', t.i); goTo(W, u, t.x, t.y, dt); return; }
  }
  u.waitT += dt;
  // 자리: 앞의 개는 상대가 바라보는 쪽에서, 나머지는 다른 개 · 상대 편과 가장 먼 방향 (빈 옆 · 뒤)
  let ang;
  if (lead) ang = t.face;
  else {
    const taken = [...pack.filter(o => o !== u), ...W.units.filter(o => o.alive && o.side === t.side && o !== t && dist(o, t) < 2.5)].map(o => Math.atan2(o.y - t.y, o.x - t.x));
    const cur = Math.atan2(u.y - t.y, u.x - t.x);
    let bs = -1e9;
    for (let k = 0; k < 12; k++){
      const a = k * Math.PI / 6, px = t.x + Math.cos(a) * ring, py = t.y + Math.sin(a) * ring;
      if (rock(W.map, px, py)) continue;
      const sp = taken.length ? Math.min(...taken.map(b => angDiff(a, b))) : Math.PI;
      const sc = sp + 0.5 * angDiff(a, t.face) - 0.25 * angDiff(a, cur);
      if (sc > bs){ bs = sc; ang = a; }
    }
    if (ang == null) ang = cur;
  }
  const px = t.x + Math.cos(ang) * ring, py = t.y + Math.sin(ang) * ring;
  setMood(W, u, lead ? '짖으며 위협' : '포위', t.i);
  if (!rock(W.map, px, py) && Math.hypot(px - u.x, py - u.y) > 0.25) goTo(W, u, px, py, dt);
  else { stop(u); u.face = Math.atan2(t.y - u.y, t.x - u.x); }
}
// 어둠 속 우회 (검사 · 저격총수): 자기 자리가 어두우면 '안 보일 것' 이라 믿음 (틀릴 수 있음 — 냄새 · 새 횃불 · 몸이 닿는 거리).
// 근접은 상대 뒤쪽 어둠으로 돌아 들어가 등을 노림, 원거리는 어두운 자리에서만 쏨. 친 뒤 둘레에 상대가 여럿이면 어둠으로 물러남
function darkSpot(W, u, cands){
  let best = null, bs = -1e9;
  for (const [x, y, s0] of cands){
    if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r) || litAt(W, x, y)) continue;
    let lit = 0; for (let k = 1; k < 5; k++){ const q = k / 5; if (litAt(W, u.x + (x - u.x) * q, u.y + (y - u.y) * q)) lit++; }
    const s = s0 - Math.hypot(x - u.x, y - u.y) * 0.5 - lit * 1.5;
    if (s > bs){ bs = s; best = { x, y }; }
  }
  return best;
}
function stalk(W, u, t, dt){
  if (litAt(W, u.x, u.y) && !(u.spot && u.spot.dark && W.t - u.spot.t < 0.6)){
    // 불빛 안에 섰다 → 들켰다고 보고 가까운 어둠으로 (원거리), 근접은 보통 싸움
    if (!isFar(u)) return false;
  }
  const near = W.units.filter(f => f.alive && f.side !== u.side && dist(f, u) < 2.6).length;
  if (u.atkT > 0 && W.t - u.atkT < 2.2 && near >= 2){   // 친 뒤 몰려들면 어둠으로 빠짐
    const d = dist(u, t) || 1, cands = [];
    for (let k = -3; k <= 3; k++){ const a = Math.atan2(u.y - t.y, u.x - t.x) + k * 0.4; for (const r of [1.5, 2.5]) cands.push([u.x + Math.cos(a) * r, u.y + Math.sin(a) * r, 0]); }
    const p = darkSpot(W, u, cands); if (!p) return false;
    setMood(W, u, '어둠으로 물러남', t.i); goTo(W, u, p.x, p.y, dt); return true;
  }
  if (isFar(u)){
    if (!litAt(W, u.x, u.y)) return false;   // 어두운 자리면 보통 사격 판단 (사선 · 확률)
    const cands = []; for (const r of [0.8, 1.5, 2.3]) for (let k = 0; k < 12; k++){ const a = k * Math.PI / 6; const x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r; cands.push([x, y, Math.hypot(x - t.x, y - t.y) - u.r - t.r <= u.rng - 0.2 && losClear(W.map, x, y, t.x, t.y) ? 2 : 0]); }
    const p = darkSpot(W, u, cands); if (!p) return false;
    u.spot = { t: W.t, b: t.i, p, dark: true };
    setMood(W, u, '어둠으로', t.i); goTo(W, u, p.x, p.y, dt); return true;
  }
  const sd = sideOf(W, t, u), f = focusOf(W, t), busy = !!t.act || (f && f !== u);
  if (inReach(u, t)){ if (sd !== 'front' || busy){ startAct(W, u, t, '암살'); return true; } return false; }
  if (sd === 'back' && gap(u, t) < 1.8){ setMood(W, u, '파고듦', t.i); goTo(W, u, t.x, t.y, dt); return true; }
  // 상대 등 뒤 반원 (바라보는 반대 ±60°) 의 어두운 자리로
  const cands = [];
  for (const r of [1.1, 1.7, 2.5]) for (let k = -3; k <= 3; k++){ const a = t.face + Math.PI + k * 0.35; cands.push([t.x + Math.cos(a) * r, t.y + Math.sin(a) * r, -Math.abs(k) * 0.3 - r * 0.4]); }
  const p = darkSpot(W, u, cands);
  u.waitT += dt;
  if (!p){ if (u.waitT > 8) return false; stop(u); u.face = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '숨어 지켜봄', t.i); return true; }
  setMood(W, u, '우회', t.i);
  if (Math.hypot(p.x - u.x, p.y - u.y) > 0.2) goTo(W, u, p.x, p.y, dt); else { stop(u); u.face = Math.atan2(t.y - u.y, t.x - u.x); }
  return true;
}""")
# reposition: stalkers strongly avoid lit spots
rep("""      if (u.side === 1 && !litAt(W, x, y)) s += 1.2;""","""      if (u.side === 1 && !litAt(W, x, y)) s += u.stalk ? 3 : 1.2;""")
# search for stalkers: stop at dark edge
rep("""      if (u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) > 0.8 && u.searchT > 0){ setMood(W, u, '수색'); goTo(W, u, u.last.x, u.last.y, dt); }""","""      if (u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) > 0.8 && u.searchT > 0){
        // 우회하는 적은 불빛 가장자리 (어둠의 끝) 까지만
        let gx = u.last.x, gy = u.last.y;
        if (u.stalk){ const n = 12; for (let k = 1; k <= n; k++){ const q = k / n, x = u.x + (u.last.x - u.x) * q, y = u.y + (u.last.y - u.y) * q; if (litAt(W, x, y)){ const q0 = (k - 1) / n; gx = u.x + (u.last.x - u.x) * q0; gy = u.y + (u.last.y - u.y) * q0; break; } } }
        if (Math.hypot(gx - u.x, gy - u.y) > 0.3){ setMood(W, u, u.stalk ? '어둠 속 접근' : '수색'); goTo(W, u, gx, gy, dt); } else { stop(u); setMood(W, u, '숨어 지켜봄'); }
      }""")
# allies idle: scan sensed threats (face)
rep("""    if (t && t.alive) faceTo(u, t);
    else { const n = W.units.filter(f => f.alive && f.side !== u.side && dist(u, f) < 3 && (u.side === 1 || canSee(W, u, f))).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (n) faceTo(u, n); }""","""    if (t && t.alive) faceTo(u, t);
    else { const n = W.units.filter(f => f.alive && f.side !== u.side && dist(u, f) < 3 && (u.side === 1 || canSee(W, u, f))).sort((a, b) => dist(u, a) - dist(u, b))[0];
      if (n) faceTo(u, n);
      else if (u.side === 0 && (!u.order || u.order.k === 'hold')){
        // 살핌: 감지한 (냄새 · 브리핑 · 짖는 소리) 방향들을 1.5초씩 번갈아 봄. 감지는 공격을 막아 주지 않음
        const S = W.units.filter(f => f.alive && f.side !== u.side && fresh(W, u.sense[f.i])).map(f => u.sense[f.i]);
        if (S.length){ const s = S[Math.floor(W.t / 1.5) % S.length]; u.face = Math.atan2(s.y - u.y, s.x - u.x); if (!u.order) setMood(W, u, '살핌'); }
      } }""")
s=s.replace("""module.exports = { sideOf, shieldBlock,""","""module.exports = { aware, brief, sideOf, shieldBlock,""")
open('rt3_tail.js','w').write(s)
print('ok')
