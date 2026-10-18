h=open('rt3_head.js').read()
def rh(a,b):
    global h
    assert h.count(a)==1,(a[:80],h.count(a)); h=h.replace(a,b)
rh("""/* ===== 전투 엔진 v4.4 —""","""/* ===== 전투 엔진 v4.5 —""")
rh("""   v4.4: 인물 공격 배율""","""   v4.5: 탱커 (아군 · 방어 자세가 있는 자동): 붙어 싸우는 적이 없으면 아는 위협 (보이는 적 · 총성 · 냄새) 쪽 전선으로 나가 '뒤로!' — 다른 자동 동료는 그 뒤로.
         아군이 너무 노출되면 (사선이 열린 사수 · 노리는 근접, 체력이 낮을수록 더) 그 아군 앞을 막아섬 ('내 뒤로!'). 위협이 없으면 주인공 앞에서 걸음.
         어둠 속에서 맞으면 자동 동료들이 두리번거림 (총성을 들었으면 그쪽을 봄).
   v4.4: 인물 공격 배율""")
rh("""  quadMul: 1.4,""","""  exposeAt: 1.5,      // 탱커: 아군 노출 점수가 이 이상이면 그 아군을 막아섬 (사선이 열린 사수 1 · 준비 중 +0.5 · 노리는 근접 1, 체력이 낮으면 ×최대 2)
  quadMul: 1.4,""")
open('rt3_head.js','w').write(h)

s=open('rt3_tail.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a)); s=s.replace(a,b)
rep("""  if (dark){ t.unseenHitT = W.t; t.takenDark += real; }""","""  if (dark){ t.unseenHitT = W.t; t.takenDark += real; W.darkHitT = W.t; }""")
# tank AI functions before act2
rep("""function act2(W, u, dt){""","""/* ---------- v4.5 탱커: 전선 · 보호 ---------- */
// 아는 위협 쪽: 보이는 적 (가까운 것) > 들은 총성 (동료 누구든, 5초 안) > 냄새 · 브리핑 · 짖는 소리
function threatPt(W, u){
  const vis = W.units.filter(f => f.alive && f.side !== u.side && (u.side === 0 ? f.seenBy : canSee(W, u, f))).sort((a, b) => dist(u, a) - dist(u, b));
  if (vis.length) return { x: vis[0].x, y: vis[0].y };
  let best = null, bt = -1;
  for (const a of W.units) if (a.alive && a.side === u.side && a.heard && W.t - a.heard.t < 5 && a.heard.t > bt){ bt = a.heard.t; best = { x: a.heard.x, y: a.heard.y }; }
  if (best) return best;
  for (const f of W.units){ if (!f.alive || f.side === u.side) continue; const s = u.sense[f.i]; if (fresh(W, s) && s.t > bt){ bt = s.t; best = { x: s.x, y: s.y }; } }
  return best;
}
// 아군 a 가 얼마나 노출됐나 (보이는 상대만): 사선이 열린 사거리 안 사수 1 (a 를 겨누는 중 +0.5), a 를 노리는 2칸 안 근접 1. 체력이 낮을수록 ×(1 ~ 2)
function exposure(W, a){
  let e = 0, main = null, mw = 0;
  for (const f of W.units){
    if (!f.alive || f.side === a.side || !(a.side === 0 ? f.seenBy : true)) continue;
    let w = 0;
    if (isFar(f)){ if (gap(f, a) <= f.rng + 0.3 && losClear(W.map, f.x, f.y, a.x, a.y)){ const fl = firstOnLine(W, f, a, f); if (fl === a || !inGuard(W, fl, f)) w = 1 + (f.act && f.act.b === a.i ? 0.5 : 0); } }
    else if (gap(f, a) <= 2 && focusOf(W, f) === a) w = 1;
    e += w; if (w > mw){ mw = w; main = f; }
  }
  return { e: e * (1 + Math.max(0, 1 - a.hp / a.max)), main };
}
function shout(W, u, s, ang){
  W.cover = { g: u.i, ang, t: W.t, side: u.side };
  if (W.t - (u.shoutT || -9) < 8) return;
  u.shoutT = W.t; L(W, { k: 'shout', a: u.i, s });
  if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s, t0: W.t });
}
// 탱커가 맡을 일: 붙어 싸우는 적이 있으면 보통 싸움 (false). 너무 노출된 아군 → 그 앞을 막아섬. 아는 위협 → 무리 앞 전선. 없으면 false (주인공 앞에서 걸음)
function tankAI(W, u, dt){
  if (W.units.some(f => f.alive && f.side !== u.side && (f.seenBy || u.side === 1) && !isFar(f) && gap(u, f) <= 1.2)) return false;
  const mates = W.units.filter(a => a.alive && a !== u && a.side === u.side);
  if (!mates.length) return false;
  // 보호: 가장 노출된 아군 (지키는 자리가 있으면 그 둘레 3칸 안만)
  let pick = null, pe = 0;
  for (const a of mates){ if (u.stay && Math.hypot(a.x - u.stay.x, a.y - u.stay.y) > 3) continue; const x = exposure(W, a); if (x.e > pe){ pe = x.e; pick = { a, f: x.main }; } }
  if (pick && pe >= (W.rules.exposeAt || 1.5) && pick.f){
    const a = pick.a, f = pick.f;
    if (!isFar(f)){ u.target = f; u.state = 'fight'; setMood(W, u, '보호', a.i); fight(W, u, f, dt, true, false); return true; }   // 근접이 노리면 그 적을 맡음
    const d = dist(f, a) || 1, k = a.r + u.r + 0.15, px = a.x + (f.x - a.x) / d * k, py = a.y + (f.y - a.y) / d * k;
    if (!rock(W.map, px, py)){
      shout(W, u, '내 뒤로!', Math.atan2(f.y - a.y, f.x - a.x)); setMood(W, u, '보호', a.i);
      if (Math.hypot(px - u.x, py - u.y) > 0.12) goTo(W, u, px, py, dt); else stop(u);
      u.fg = Math.atan2(f.y - u.y, f.x - u.x); return true;
    }
  }
  if (u.stay) return false;
  // 전선: 무리 가운데에서 위협 쪽으로 1~1.6칸
  const th = threatPt(W, u); if (!th) return false;
  const cx = mates.reduce((s, a) => s + a.x, 0) / mates.length, cy = mates.reduce((s, a) => s + a.y, 0) / mates.length;
  const ang = Math.atan2(th.y - cy, th.x - cx);
  let px = cx, py = cy;
  for (const d of [1.6, 1.2, 0.8]){ const x = cx + Math.cos(ang) * d, y = cy + Math.sin(ang) * d; if (!rock(W.map, x, y)){ px = x; py = y; break; } }
  shout(W, u, '뒤로!', ang); setMood(W, u, '전선');
  if (Math.hypot(px - u.x, py - u.y) > 0.2) goTo(W, u, px, py, dt); else stop(u);
  u.fg = Math.atan2(th.y - u.y, th.x - u.x);
  return true;
}
// '뒤로!' 를 들은 자동 동료 (싸우는 중이 아니면): 탱커 뒤 (위협 반대쪽) 로
function behindCover(W, u, dt){
  const C = W.cover; if (!C || C.side !== u.side || W.t - C.t > 0.6) return false;
  const g = W.units[C.g]; if (!g || !g.alive || g === u || dist(u, g) > 6) return false;
  const others = W.units.filter(a => a.alive && a.side === u.side && a !== g && !a.order && !a.canGuard).sort((a, b) => a.i - b.i), k = Math.max(0, others.indexOf(u));
  const bx = -Math.cos(C.ang), by = -Math.sin(C.ang), lx = -by, ly = bx, back = g.r + u.r + 0.3 + Math.floor(k / 3) * 0.6, side = [0, 0.6, -0.6][k % 3];
  let px = g.x + bx * back + lx * side, py = g.y + by * back + ly * side;
  if (rock(W.map, px, py)){ px = g.x + bx * back; py = g.y + by * back; }
  if (rock(W.map, px, py)) return false;
  setMood(W, u, '탱커 뒤', g.i);
  if (Math.hypot(px - u.x, py - u.y) > 0.15) goTo(W, u, px, py, dt); else { stop(u); u.fg = C.ang; }
  return true;
}
function act2(W, u, dt){""")
# dispatch in act2: after doOrder dispatch
rep("""  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }
  const hero = W.units.find(h => h.hero && h.alive);""","""  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }
  if (u.side === 0 && u.canGuard && tankAI(W, u, dt)) return;
  const hero = W.units.find(h => h.hero && h.alive);""")
# behind cover for non-fighting auto allies (follow/explore/stay-less)
rep("""  if (u.state === 'stay' && u.stay){   // 지키는 자리로 돌아와 섬 (살핌은 act 에서)""","""  if (u.side === 0 && !u.canGuard && !u.stay && behindCover(W, u, dt)) return;
  if (u.state === 'stay' && u.stay){   // 지키는 자리로 돌아와 섬 (살핌은 act 에서)""")
# tank walks ahead of hero when following
rep("""  if (u.state === 'follow' && hero){
    const ang = (u.slot % 2 ? 1 : -1) * (0.6 + 0.5 * Math.floor(u.slot / 2)) + Math.PI + (hero.face || 0);
    const gx = hero.x + Math.cos(ang) * 1.4, gy = hero.y + Math.sin(ang) * 1.4;""","""  if (u.state === 'follow' && hero){
    // 탱커는 주인공 앞에서, 나머지는 뒤에서
    const ang = u.canGuard ? (hero.face || 0) + (u.slot % 2 ? 0.35 : -0.35) * Math.floor(u.slot / 2) : (u.slot % 2 ? 1 : -1) * (0.6 + 0.5 * Math.floor(u.slot / 2)) + Math.PI + (hero.face || 0);
    const gx = hero.x + Math.cos(ang) * (u.canGuard ? 1.5 : 1.4), gy = hero.y + Math.sin(ang) * (u.canGuard ? 1.5 : 1.4);""")
# looking around after dark hits
rep("""        if (S.length){ const s = S[Math.floor(W.t / 1.5) % S.length]; u.fg = Math.atan2(s.y - u.y, s.x - u.x); if (!u.order) setMood(W, u, '살핌'); }""","""        if (S.length){ const s = S[Math.floor(W.t / 1.5) % S.length]; u.fg = Math.atan2(s.y - u.y, s.x - u.x); if (!u.order) setMood(W, u, '살핌'); }
        // 어둠 속에서 누가 맞았다 → 두리번 (총성을 들었으면 그쪽, 아니면 이리저리)
        else if (W.t - (W.darkHitT || -9) < 2.5){
          const hd = W.units.filter(a => a.alive && a.side === u.side && a.heard && W.t - a.heard.t < 3).map(a => a.heard)[0];
          if (hd) u.fg = Math.atan2(hd.y - u.y, hd.x - u.x);
          else if (W.t - (u.glanceT || -9) > 0.35){ u.glanceT = W.t; u.fg = u.face + (W.rand() - 0.5) * 3; }
          if (!u.order) setMood(W, u, '두리번');
        }""")
s=s.replace("module.exports = { launch,","module.exports = { tankAI, exposure, threatPt, launch,")
open('rt3_tail.js','w').write(s)
print('ok')
