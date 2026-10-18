import re,sys
p='rt3_tail.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    n=s.count(old)
    if n!=cnt: print('MISMATCH',n,old[:80]); sys.exit(1)
    s=s.replace(old,new)

# 1) 물러설 자리 helpers (survive 앞)
rep("// 살아남기: 체력이 바닥 (30%)",
"""/* ---------- v4.8 물러서기: 곧장 뒤가 아니라 트인 곳 · 동료 쪽으로 (구석 · 벽으로 몰리지 않게) ---------- */
// 둘레 여유: 8방향으로 바위 (판 끝 포함) 까지 거리 (최대 1.5칸) 의 평균 · 끝까지 트인 방향 수. 구석 · 벽에 붙은 자리일수록 작음
function roomAt(W, x, y){
  let s = 0, open = 0;
  for (let k = 0; k < 8; k++){
    const c = Math.cos(k * Math.PI / 4), d = Math.sin(k * Math.PI / 4); let r = 0.25;
    while (r < 1.5 && !rock(W.map, x + c * r, y + d * r)) r += 0.25;
    s += r; if (r >= 1.5) open++;
  }
  return { avg: s / 8, open };
}
// 모여 있는 동료 (합류할 쪽): 포위 사냥 · 우회하는 쪽은 빼고
const groupMates = (W, u) => W.units.filter(a => a.alive && a !== u && a.side === u.side && !a.pack && !a.stalk);
// 물러설 자리 (d 칸쯤): 상대 반대쪽 ±80° 안에서 — 아는 상대 모두에게서 멀어지고, 트인 곳 (구석 · 벽 가 감점), 동료 쪽, 적이면 어둠.
// 멀어지는 자리가 없으면 null (= 궁지)
function fallbackPt(W, u, t, d){
  const know = knows(W, u), foes = W.units.filter(f => f.alive && f.side !== u.side && (f === t || know(f)) && dist(f, u) < 6);
  const mates = groupMates(W, u), base = Math.atan2(u.y - t.y, u.x - t.x);
  const near = (x, y) => Math.min(...foes.map(f => Math.hypot(f.x - x, f.y - y) - f.r - u.r));
  const near0 = near(u.x, u.y);
  let best = null, bs = -1e9;
  for (const r of [d, d * 0.6]) for (let k = -4; k <= 4; k++){
    const a = base + k * 0.35, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
    if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;
    if (!fatClear(W.map, u.x, u.y, x, y, u.r * 0.8)) continue;
    const gain = near(x, y) - near0; if (gain < 0.15) continue;   // 멀어지지 않으면 물러섬이 아님
    const rm = roomAt(W, x, y);
    let sc = gain * 1.2 + rm.avg * 1.5 - (rm.open <= 3 ? 2.5 : 0) - Math.abs(k) * 0.12;
    if (mates.length) sc -= Math.min(6, Math.min(...mates.map(a => Math.hypot(a.x - x, a.y - y)))) * 0.3;
    if (u.side === 1 && !litAt(W, x, y)) sc += 0.6;
    if (sc > bs){ bs = sc; best = { x, y, gain, room: rm }; }
  }
  return best;
}
// 궁지 (물러설 곳 없음 · 혼자 쫓기다 결단): 2초 동안 맞서 싸움
const cornered = (W, u) => u.cornerT != null && W.t - u.cornerT < 2;
function corner(W, u, t, k){ if (!cornered(W, u)) setMood(W, u, k, t.i); u.cornerT = W.t; u.cornerK = k; u.backT = 0; u.backing = false; }
// 살아남기: 체력이 바닥 (30%)""")

# 2) melee: 궁지면 손 닿을 때 바로 침
rep("""    if (ordered || op){ startAct(W, u, t, op === '틈' ? '틈을 노림' : op === '측면' ? '측면 공격' : op === '자세 무너짐' ? '자세 무너짐' : '공격'); return; }""",
"""    if (ordered || op || cornered(W, u)){ startAct(W, u, t, op === '틈' ? '틈을 노림' : op === '측면' ? '측면 공격' : op === '자세 무너짐' ? '자세 무너짐' : cornered(W, u) ? '반격' : '공격'); return; }""")

# 3) melee: 적 expert 블록
old_block = s[s.index("  let go = ordered || u.bold >= 0.65"):s.index("  if (go){\n    // 다른 아군과 맞붙은 상대")]
new_block = """  let go = ordered || u.bold >= 0.65 || busyOther || !!t.act || isFar(t) || u.waitT > 3 || !canSee(W, t, u) || alone || cornered(W, u);
  if (u.side === 1 && !ordered){
    // 적 (expert): 유리할 때만 들어감 — 상대가 고립 · 우리 편이 그 둘레에 더 많음 · 다른 이와 맞붙어 옆을 보임 · 다른 이를 치는 중
    const sup = supportOf(W, t), mine = W.units.filter(o => o.alive && o !== u && o.side === u.side && dist(o, t) <= 2.5).length;
    go = sup === 0 || mine >= sup + 1 || (busyOther && sideOf(W, t, u) !== 'front') || (!!t.act && t.act.b !== u.i) || (!canSee(W, t, u) && sideOf(W, t, u) !== 'front');
    // v4.8 한 번 들어가기로 했으면 1초는 그대로 (들어갔다 물러났다 와리가리 하지 않음). 궁지면 맞섬
    if (go) u.goT = W.t; else if (W.t - (u.goT == null ? -9 : u.goT) < 1 || cornered(W, u)) go = true;
    if (!go){
      // 불리함: 손 닿는 거리 밖에서 위협하며 방향을 붙듦. 다가오면 물러서되 트인 곳 · 동료 쪽으로 (구석 · 벽 피함).
      // 물러설 곳이 없거나, 동료 없이 혼자 3초 넘게 쫓기면 맞섬 (궁지 · 결단). 동료와 떨어져 혼자 노려보고 있으면 동료 쪽으로 합류
      const want = t.rng + R.reach + 0.5, g = gap(u, t), mates = groupMates(W, u);
      u.waitT += dt;
      if (g < want - (u.backing ? 0.05 : 0.4)){
        const p = fallbackPt(W, u, t, 1.4);
        u.backT = (u.backT || 0) + dt;
        if (!p || (p.room.open <= 2 && p.gain < 0.5)) corner(W, u, t, '궁지');
        else if (!mates.length && u.backT > 3) corner(W, u, t, '결단');
        else { u.backing = true; setMood(W, u, '물러섬', t.i); goTo(W, u, p.x, p.y, dt); return; }
      } else {
        u.backing = false; u.backT = Math.max(0, (u.backT || 0) - dt * 0.5);
        const m = mates.length && !mates.some(o => dist(o, u) < 5) ? mates.sort((a, b) => dist(u, a) - dist(u, b))[0] : null;
        // 동료가 상대 너머 (같은 쪽 60° 안 · 상대보다 멂) 에 있으면 합류하러 상대 곁을 지나가지 않음
        const beyond = m && dist(u, t) < dist(u, m) && ((m.x - u.x) * (t.x - u.x) + (m.y - u.y) * (t.y - u.y)) > 0.5 * dist(u, m) * dist(u, t);
        if (m && !beyond){ setMood(W, u, '합류', m.i); goTo(W, u, m.x, m.y, dt); return; }
        if (g > want + 0.8){ setMood(W, u, '다가감', t.i); goTo(W, u, t.x, t.y, dt); return; }
        stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '위협', t.i); return;
      }
      go = true;
    }
  }
"""
s = s.replace(old_block, new_block)

# 4) go 갈래 기분: 궁지 · 결단
rep("""    setMood(W, u, ordered ? '공격' : u.bold >= 0.65 ? '뛰어듦' : '다가감', t.i); goTo(W, u, t.x, t.y, dt); return;""",
"""    setMood(W, u, ordered ? '공격' : cornered(W, u) ? u.cornerK : u.bold >= 0.65 ? '뛰어듦' : '다가감', t.i); goTo(W, u, t.x, t.y, dt); return;""")

# 5) survive: 물러남도 트인 곳 · 동료 쪽. 없으면 궁지 → 맞서 싸움
rep("""    const d = dist(u, t) || 1, gx = u.x + (u.x - t.x) / d * 1.5, gy = u.y + (u.y - t.y) / d * 1.5;
    setMood(W, u, '물러남', t.i);
    if (!rock(W.map, gx, gy)) goTo(W, u, gx, gy, dt); else moveDir(W, u, (u.x - t.x) / d, (u.y - t.y) / d, dt);""",
"""    const p = fallbackPt(W, u, t, 1.5);
    if (!p || (p.room.open <= 2 && p.gain < 0.5)){ corner(W, u, t, '궁지'); return false; }   // 물러설 곳이 없음 → 맞서 싸움
    setMood(W, u, '물러남', t.i); goTo(W, u, p.x, p.y, dt);""")
rep("""  if (!(low || dry) || u.bold >= 0.5){ u.stuckT = 0; return false; }""",
"""  if (!(low || dry) || u.bold >= 0.5 || cornered(W, u)){ u.stuckT = 0; return false; }""")

# 6) shoot: 거리 벌리기도 트인 곳으로. 물러설 곳이 없으면 그 자리에서 쏨
rep("""  if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) && u.bold < 0.6){ const d = dist(u, t) || 1; moveDir(W, u, (u.x - t.x) / d, (u.y - t.y) / d, dt); setMood(W, u, '거리 벌리기', t.i); return; }""",
"""  if (!ordered && !isFar(t) && g < Math.min(1.2, u.rng * 0.3) && u.bold < 0.6 && !cornered(W, u)){
    const p = fallbackPt(W, u, t, 1.2);
    if (p && !(p.room.open <= 2 && p.gain < 0.5)){ setMood(W, u, '거리 벌리기', t.i); goTo(W, u, p.x, p.y, dt); return; }
    corner(W, u, t, '궁지');   // 물러설 곳이 없음 → 그 자리에서 쏨
  }""")

# 7) packHunt: 문 뒤 물러날 자리가 바위면 트인 곳으로
rep("""    setMood(W, u, '거리 벌리기', t.i);
    if (!rock(W.map, gx, gy)) goTo(W, u, gx, gy, dt); else moveDir(W, u, (u.x - t.x) / d, (u.y - t.y) / d, dt);
    return;""",
"""    setMood(W, u, '거리 벌리기', t.i);
    if (!rock(W.map, gx, gy) && roomAt(W, gx, gy).open > 2) goTo(W, u, gx, gy, dt);
    else { const p = fallbackPt(W, u, t, 1.2); if (p) goTo(W, u, p.x, p.y, dt); else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); } }
    return;""")

# 8) stalk: 근접이 불빛 안 → 가까운 어둠으로 (0.8초는 그 자리로). 손 닿거나 상대가 동료와 맞붙었으면 보통 싸움
rep("""  if (!covert(W, u, u.x, u.y) && !(u.spot && u.spot.dark && W.t - u.spot.t < 0.6)){
    // 불빛 안에 섰다 → 들켰다고 보고 가까운 어둠으로 (원거리), 근접은 보통 싸움
    if (!isFar(u)) return false;
  }""",
"""  if (!isFar(u)){
    // 근접이 불빛 안에 섰다 → 들켰다고 봄. 손이 닿거나 상대가 동료와 맞붙었으면 보통 싸움, 아니면 가까운 어둠으로 빠짐.
    // 고른 어둠 자리는 0.8초 동안 그대로 (불빛 가장자리에서 '우회' · '물러섬' 을 번갈아 하는 와리가리 없음). 6초 넘게 피하기만 하면 보통 싸움
    const sp = u.spot && u.spot.dark && u.spot.p && u.spot.b === t.i && W.t - u.spot.t < 0.8 && Math.hypot(u.spot.p.x - u.x, u.spot.p.y - u.y) > 0.2 ? u.spot.p : null;
    if (sp || !covert(W, u, u.x, u.y)){
      const f0 = focusOf(W, t);
      if (inReach(u, t) || (f0 && f0 !== u && f0.side === u.side) || (u.duckT || 0) > 6) return false;
      let p = sp;
      if (!p){
        const cands = []; for (const r of [0.8, 1.5, 2.3]) for (let k = 0; k < 12; k++){ const a = k * Math.PI / 6, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r; cands.push([x, y, Math.min(1.5, Math.hypot(x - t.x, y - t.y) - dist(u, t))]); }
        p = darkSpot(W, u, cands); if (!p) return false;
        u.spot = { t: W.t, b: t.i, p, dark: true };
      }
      u.duckT = (u.duckT || 0) + dt;
      setMood(W, u, '어둠으로', t.i); goTo(W, u, p.x, p.y, dt); return true;
    }
    u.duckT = Math.max(0, (u.duckT || 0) - dt * 0.5);
  }""")

# 9) darkSpot: 구석 감점
rep("""    const s = s0 - Math.hypot(x - u.x, y - u.y) * 0.5 - lit * 1.5;""",
"""    const s = s0 - Math.hypot(x - u.x, y - u.y) * 0.5 - lit * 1.5 - (roomAt(W, x, y).open <= 3 ? 1.5 : 0);""")

# 10) retrieveSpear: 아는 상대 (보임 · 2초 안에 본 · 2.5칸 안) 가 창 곁이거나 가는 길이 상대 손 닿는 곳을 지나면 안 감
rep("""  if (!force && W.units.some(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f)) && Math.hypot(f.x - it.x, f.y - it.y) - f.r < 1.8)) return false;""",
"""  if (!force){
    const aw = f => (u.side === 0 ? f.seenBy : canSee(W, u, f)) || fresh(W, u.sense[f.i], 2) || dist(f, u) < 2.5;
    const vx = it.x - u.x, vy = it.y - u.y, L2 = vx * vx + vy * vy || 1;
    const seg = f => { const k = Math.max(0, Math.min(1, ((f.x - u.x) * vx + (f.y - u.y) * vy) / L2)); return Math.hypot(f.x - u.x - vx * k, f.y - u.y - vy * k); };
    if (W.units.some(f => f.alive && f.side !== u.side && aw(f) && (Math.hypot(f.x - it.x, f.y - it.y) - f.r < 1.8 || seg(f) - f.r - u.r < Math.max(f.rng, 0.3) + 0.6))) return false;
  }""")

open(p,'w',encoding='utf-8').write(s)
print('ok')
