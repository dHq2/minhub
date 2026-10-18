import sys
p='rt3_tail.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,cnt=1):
    global s
    n=s.count(old)
    if n!=cnt: print('MISMATCH',n,old[:90]); sys.exit(1)
    s=s.replace(old,new)

# 1) 오사 확률 · 각 잡기 helpers (shootTh 앞)
rep("// 쏠 만한가 (기다리기 · 노리기)", r"""/* ---------- v4.9 오사 확률 · 각 잡기 ---------- */
// 오사 확률: (x, y) 에서 t 를 쏘면 아군 몸에 먼저 걸릴 확률. launch 와 같은 갈래로 쏜 선 열 줄 (맞힘 4 · 빗나감 6, 명중률로 무게) 을
// 날아가는 끝 (사거리 + 2.5칸) · 바위까지 따라가 봄 — 대상 앞을 가로막은 아군도, 빗나가 대상 옆 · 뒤로 날아가는 선 위의 아군도.
// 아군 자리는 준비 시간 (+ lead) + 날아가는 시간 뒤의 자리 (움직이는 중이면 그 앞, 1.2초까지)
function ffOdds(W, u, t, x, y, lead){
  const wp = (W.rules.weapons && W.rules.weapons[u.weapon]) || {}, vel = wp.vel || 40;
  const d = Math.max(0.3, Math.hypot(t.x - x, t.y - y)), base = Math.atan2(t.y - y, t.x - x);
  const ox = u.x, oy = u.y; u.x = x; u.y = y; const p = aimP(W, u, t); u.x = ox; u.y = oy;
  const L0 = u.rng + u.r + 2.5, lw = (u.wind || 0.5) + (lead || 0), know = knows(W, u);
  const bodies = W.units.filter(b => b.alive && b !== u && (b === t || know(b)));
  let ff = 0, who = null, ww = 0;
  for (let i = 0; i < 10; i++){
    const off = i < 4 ? [-0.55, -0.2, 0.2, 0.55][i] * t.r : (i < 7 ? -1 : 1) * (t.r + 0.12 + [0.15, 0.45, 0.75][(i - 4) % 3] * 0.55);
    const w = i < 4 ? p / 4 : (1 - p) / 6;
    const a = base + Math.atan2(off, d), dx = Math.cos(a), dy = Math.sin(a);
    let lim = L0; for (let q = 0.3; q < L0; q += 0.3) if (rock(W.map, x + dx * q, y + dy * q)){ lim = q; break; }
    let hb = null, hk = 1e9;
    for (const b of bodies){
      let bx = b.x, by = b.y;
      if (b.side === u.side){ const ft = Math.min(1.2, lw + Math.max(0, (bx - x) * dx + (by - y) * dy) / vel); bx += (b.vx || 0) * ft; by += (b.vy || 0) * ft; }
      const k = (bx - x) * dx + (by - y) * dy; if (k <= u.r || k > lim || k >= hk) continue;
      if (Math.hypot(bx - (x + dx * k), by - (y + dy * k)) <= b.r + (b.side === u.side ? 0.05 : 0)){ hk = k; hb = b; }
    }
    if (hb && hb.side === u.side){ ff += w; if (w > ww){ ww = w; who = hb; } }
  }
  return { p: ff, who };
}
// 받아들일 오사 확률: 대담할수록 조금 더 (겁 많은 저격수 ≈ 4%, 보통 ≈ 6%)
const ffLim = u => 0.03 + 0.09 * u.bold;
// (x, y) 를 쏠 수 있는 아는 적 사수 수 (사거리 안 · 사선이 열림 · 우리 편 방어 자세가 막지 않음)
function exposedAt(W, u, x, y, guns){
  const P0 = { x, y, r: u.r, side: u.side, i: u.i };
  let n = 0;
  for (const e of guns){
    if (Math.hypot(e.x - x, e.y - y) - e.r - u.r > e.rng + 0.3 || !losClear(W.map, e.x, e.y, x, y)) continue;
    const f = firstOnLine(W, e, P0, e); if (f !== P0 && f.side === u.side && inGuard(W, f, e)) continue;
    n++;
  }
  return n;
}
// 선분 a→(x, y) 와 점 f 의 거리
function segD(a, x, y, f){ const vx = x - a.x, vy = y - a.y, L2 = vx * vx + vy * vy || 1, k = Math.max(0, Math.min(1, ((f.x - a.x) * vx + (f.y - a.y) * vy) / L2)); return Math.hypot(f.x - a.x - vx * k, f.y - a.y - vy * k); }
// 다른 표적: 지금 상대가 막혔을 때, 사선이 열리고 오사 걱정 없고 쏠 만한 (확률 ≥ 기준) 다른 보이는 상대
function altTarget(W, u, t){
  const know = knows(W, u);
  let best = null, bp = 0;
  for (const f of W.units){
    if (!f.alive || f === t || f.side === u.side || !canSee(W, u, f) || gap(u, f) > u.rng || !losClear(W.map, u.x, u.y, f.x, f.y)) continue;
    const first = firstOnLine(W, u, f, u, know); if (first !== f && (first.side === u.side || inGuard(W, first, u))) continue;
    if (first === f && inGuard(W, f, u)) continue;
    if (ffOdds(W, u, first, u.x, u.y).p > ffLim(u)) continue;
    const p = aimP(W, u, first); if (p < shootTh(W, u, first) || p <= bp) continue;
    bp = p; best = first;
  }
  return best;
}
// 쏠 만한가 (기다리기 · 노리기)""")

# 2) shoot: 막혔을 때 — 다른 표적 · 곧 비킬 아군 기다림 · 천천히 돌며 각 잡기 (전황이 허락할 때)
rep("""  let tgt = t, why = '';
  const first = firstOnLine(W, u, t, u, know);
  if (first !== t){
    if (first.side === u.side){   // 사선에 아군 → 쏘지 않음
      if (!ordered) reposition(W, u, t, dt, '사선에 아군', first.i); else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); }
      setMood(W, u, '사선에 아군', first.i);
      return;
    }
    if (inGuard(W, first, u)){   // 방어 자세가 이쪽을 막고 있음 → 쏘면 막힘
      if (ordered || (u.bold >= 0.55 && first.post <= 70)){ startAct(W, u, first, '방어 무너뜨리기'); return; }
      reposition(W, u, t, dt, '막힘', first.i); return;
    }
    tgt = first; why = '앞을 가로막은 상대';
  }
  if (ordered){ startAct(W, u, tgt, why || '공격'); return; }
  const near = ffRisk(W, u, tgt, 0.12 + 0.4 * (1 - u.bold));
  if (near){ reposition(W, u, t, dt, '사선에 아군', near.i); return; }
  const p = aimP(W, u, tgt);""",
"""  let tgt = t, why = '';
  const first = firstOnLine(W, u, t, u, know);
  if (first !== t){
    if (first.side === u.side){ blockedShot(W, u, t, dt, ordered, first); return; }   // 사선에 아군 → 쏘지 않음
    if (inGuard(W, first, u)){   // 방어 자세가 이쪽을 막고 있음 → 쏘면 막힘
      if (ordered || (u.bold >= 0.55 && first.post <= 70)){ startAct(W, u, first, '방어 무너뜨리기'); return; }
      const alt = !ordered && altTarget(W, u, t); if (alt){ startAct(W, u, alt, '다른 표적'); return; }
      reposition(W, u, t, dt, '막힘', first.i); return;
    }
    tgt = first; why = '앞을 가로막은 상대';
  }
  if (ordered){ u.ffWait = 0; startAct(W, u, tgt, why || '공격'); return; }
  const ff = ffOdds(W, u, tgt, u.x, u.y);
  if (ff.p > ffLim(u)){ blockedShot(W, u, t, dt, false, ff.who); return; }
  u.ffWait = 0;
  const p = aimP(W, u, tgt);""")

rep("""// 자리 잡기: 가까운 몇 자리 중 사선이 열리고 사거리 안인 곳.""",
"""// 사선에 아군 (가로막음 · 오사 확률이 높음): 영리하게 — ① 쏠 만한 다른 표적 ② 그 아군이 곧 비킬 것 같으면 겨눈 채 잠깐 기다림
// ③ 아니면 천천히 옆으로 돌며 각을 잡음 (상대를 겨눈 채 ×0.55, 가는 곳 · 길이 안전할 때만). 마땅한 자리가 없으면 겨눈 채 기다림
function blockedShot(W, u, t, dt, ordered, b){
  if (!ordered){ const alt = altTarget(W, u, t); if (alt){ u.ffWait = 0; startAct(W, u, alt, '다른 표적'); return; } }
  u.ffWait = (u.ffWait || 0) + dt;
  if (u.ffWait < 1.2 && b && Math.hypot(b.vx || 0, b.vy || 0) > 0.4 && ffOdds(W, u, t, u.x, u.y, 0.8).p <= ffLim(u)){
    stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '사선 기다림', b.i); return;
  }
  reposition(W, u, t, dt, '각 잡기', b ? b.i : t.i);
}
// 자리 잡기: 가까운 몇 자리 중 사선이 열리고 사거리 안인 곳.""")

# 3) reposition 다시 씀
a=s.index("function reposition(W, u, t, dt, mood, mb){"); b=s.index("\n}\n",a)+3
s=s[:a]+r"""// v4.9 각 잡기: 상대 둘레 원 (지금 거리 ±0.7) 을 따라 ±120° 의 자리 + 가까운 옆걸음 자리. 사선이 열리고 오사 확률이 기준 아래인 곳만.
// 점수 = 덜 걷고 · 사거리 알맞고 · 상대 옆 · 뒤가 보이고 · 적 사수에게 덜 드러나고 · 다른 사수의 사선을 막지 않고 · (적이면) 어둠.
// 전황: 근접 상대 손 닿는 곳 · 그 곁을 지나는 길은 빼고, 지금보다 더 드러나는 자리는 대담하거나 오래 기다렸을 때만. 고른 자리는 쓸 만하면 그대로 (지그재그 없음)
function reposition(W, u, t, dt, mood, mb){
  if (mb == null) mb = t.i;
  const careful = mood === '각 잡기' || mood === '막힘';
  if (!u.spot || u.spot.dark || W.t - u.spot.t > 0.5 || u.spot.b !== t.i){
    const know = knows(W, u), lim = ffLim(u), foes = W.units.filter(f => f.alive && f.side !== u.side && know(f));
    const melee = foes.filter(f => !isFar(f)), guns = foes.filter(f => isFar(f));
    const exNow = exposedAt(W, u, u.x, u.y, guns), old = u.spot && !u.spot.dark && u.spot.b === t.i && u.spot.p;
    const cands = [];
    for (const r of [0.6, 1.2, 1.9, 2.7]) for (let k = 0; k < 12; k++){ const a = k * Math.PI / 6 + r; cands.push([u.x + Math.cos(a) * r, u.y + Math.sin(a) * r, r]); }
    const d0 = dist(u, t), a0 = Math.atan2(u.y - t.y, u.x - t.x), rMax = u.rng + u.r + t.r - 0.2;
    if (d0 <= rMax + 0.5) for (const dr of [0, -0.7, 0.7]){ const r = Math.min(rMax, d0) + dr; if (r < t.r + u.r + 0.5) continue; for (let k = -8; k <= 8; k++){ if (!k && !dr) continue; const a = a0 + k * Math.PI / 12; cands.push([t.x + Math.cos(a) * r, t.y + Math.sin(a) * r, Math.abs(k) * Math.PI / 12 * r + Math.abs(dr)]); } }
    if (old) cands.push([old.x, old.y, Math.hypot(old.x - u.x, old.y - u.y), true]);
    let best = null, bs = -1e9;
    for (const [x, y, walk, keep] of cands){
      if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y - u.r) || rock(W.map, x - u.r, y + u.r) || rock(W.map, x + u.r, y + u.r)) continue;
      const g = Math.hypot(x - t.x, y - t.y) - u.r - t.r;
      if (g > u.rng - 0.15 || g < 0.4 || !losClear(W.map, x, y, t.x, t.y)) continue;
      if (W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r)) continue;
      const P0 = { x, y, r: u.r, side: u.side, i: u.i };
      if (firstOnLine(W, P0, t, u, know) !== t) continue;
      const shut = inGuard(W, t, P0); if (shut && mood === '막힘') continue;
      const ff = ffOdds(W, u, t, x, y).p; if (ff > lim) continue;
      // 전황: 근접 상대의 손 닿는 곳 (+0.6) · 그 곁을 지나는 길은 안 됨
      if (melee.some(f => Math.hypot(f.x - x, f.y - y) - f.r - u.r < f.rng + 0.6 || segD(u, x, y, f) - f.r - u.r < f.rng + 0.3)) continue;
      const ex = exposedAt(W, u, x, y, guns);
      if (ex > exNow && u.bold < 0.6 && u.waitT < 2.5) continue;   // 지금보다 더 드러나는 자리 (방패 뒤를 벗어남 등) 는 아직
      let s = -walk * 0.6 - Math.abs(g - u.rng * 0.55) * 0.25 - (ex - exNow) * 1.2 - ff * 8 - (shut ? 1.5 : 0);
      if (!fatClear(W.map, u.x, u.y, x, y, u.r * 0.9)) s -= 1;
      if (sideOf(W, t, P0) !== 'front') s += 0.5;
      if (u.side === 1 && !litAt(W, x, y)) s += u.stalk ? 3 : 1.2;
      if (W.units.some(o => o.alive && o !== u && o.side === u.side && isFar(o) && o.target && o.target.alive && o.target.side !== u.side && segD(o, o.target.x, o.target.y, P0) < u.r + 0.15)) s -= 1.5;   // 다른 사수의 사선
      if (keep) s += 0.8;   // 고른 자리는 쓸 만하면 그대로
      if (s > bs){ bs = s; best = { x, y }; }
    }
    u.spot = { t: W.t, b: t.i, p: best };
  }
  const p = u.spot.p;
  if (p && Math.hypot(p.x - u.x, p.y - u.y) > 0.1){
    setMood(W, u, mood, mb);
    if (!careful){ goTo(W, u, p.x, p.y, dt); return; }
    // 천천히 우회: 상대 둘레를 따라 (한 번에 40° 씩, 줄을 가로질러 상대 쪽으로 다가가지 않게), 상대를 겨눈 채
    let wx = p.x, wy = p.y;
    const au = Math.atan2(u.y - t.y, u.x - t.x), ap = Math.atan2(p.y - t.y, p.x - t.x);
    let da = ap - au; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    if (Math.abs(da) > 0.7){ const r = Math.hypot(p.x - t.x, p.y - t.y), a = au + Math.sign(da) * 0.7, x = t.x + Math.cos(a) * r, y = t.y + Math.sin(a) * r; if (!rock(W.map, x, y) && fatClear(W.map, u.x, u.y, x, y, u.r * 0.9)){ wx = x; wy = y; } }
    setGoal(W, u, wx, wy); follow(W, u, dt, 0.55); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
    return;
  }
  if (!p && (gap(u, t) > u.rng || !losClear(W.map, u.x, u.y, t.x, t.y))){ setMood(W, u, '다가감', t.i); goTo(W, u, t.x, t.y, dt); return; }
  // 마땅한 자리가 없음 (또는 다 옴): 겨눈 채 기다림
  stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  setMood(W, u, careful && !p ? '사선에 아군' : mood, mb);
}
"""+s[b:]

# 4) 제자리 (hold): 오사 확률로
rep("""      const near = ffRisk(W, u, t, 0.12 + 0.4 * (1 - u.bold)); if (near){ ffBlock = near; continue; }""",
"""      const ff = ffOdds(W, u, t, u.x, u.y); if (ff.p > ffLim(u)){ ffBlock = ff.who || t; continue; }""")
open(p,'w',encoding='utf-8').write(s)
print('ok')
