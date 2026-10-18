import re
h=open('rt3_head.js').read()
def rh(a,b):
    global h
    assert h.count(a)==1,(a[:80],h.count(a)); h=h.replace(a,b)
rh("""         맞은 쪽의 비명으로 둘레 동료가 친 자리를 정확히 앎 → 몰려감. 몸이 닿을 거리라도 등 뒤는 어둠 속에서 모름.""","""         맞은 쪽의 비명으로 둘레 동료가 친 자리를 정확히 앎 → 몰려감. 몸이 닿을 거리라도 등 뒤는 어둠 속에서 모름.
         방어 = '무엇으로' 보다 '어느 방향을 얼마나'. 막는 폭 (바라보는 방향 ±도): 방패 60 · 대검 40 · [반사신경] 맨몸 20 · [반사신경] + 대검 · 방패 55 (자세도 덜 깎임).
         돌아서는 데 시간이 걸림 (초당 turnRate 도). 적 (expert): 불리한 교전을 피하고 (상대 둘레에 상대 편이 더 많으면 손 닿는 거리 밖에서 위협 · 물러섬),
         유리한 자리를 찾고, 빈틈 (공격 중 · 등 · 막는 방향 밖 · 고립) 이 생기면 침. 지루해서 돌진하지 않음. 개는 틈이 없으면 거리를 유지.""")
rh("""  barkT: 2.5,         // 개가 짖는 간격 (초)""","""  barkT: 2.5,         // 개가 짖는 간격 (초)
  turnRate: 300,      // 돌아서는 빠르기 (초당 도). 180° 를 돌려면 0.6초
  guardArcW: 40,      // 대검 (guard 무기) 으로 막는 폭 (바라보는 방향 ±도). 방패는 frontArc
  guardArcR: 20,      // [반사신경] 맨몸으로 막는 폭 (±도, 좁지만 믿을 만함)
  guardArcRW: 55,     // [반사신경] + 대검 · 방패로 막는 폭 (±도)
  reflexCost: 0.6,    // [반사신경] 은 막을 때 자세가 덜 깎임 (×)""")
open('rt3_head.js','w').write(h)

s=open('rt3_tail.js').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:80],s.count(a)); s=s.replace(a,b)
# facing -> goal facing (turn over time)
lines=s.split('\n')
for i,l in enumerate(lines):
    if 'u.face = Math.atan2' in l: lines[i]=l.replace('u.face = Math.atan2','u.fg = Math.atan2')
s='\n'.join(lines)
rep("""function faceTo(u, t){ if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x); }""","""function faceTo(u, t){ if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x); }
// 돌아서기: 바라볼 방향 (fg) 쪽으로 초당 turnRate 도씩
function turnTo(W, u, dt){
  if (u.fg == null) return;
  let d = (u.fg - u.face) % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
  const m = (W.rules.turnRate || 300) * Math.PI / 180 * dt;
  u.face = Math.abs(d) <= m ? u.fg : u.face + Math.sign(d) * m;
}""")
rep("""face: p.side ? Math.PI / 2 : -Math.PI / 2, seenBy: false,""","""face: p.side ? Math.PI / 2 : -Math.PI / 2, fg: p.side ? Math.PI / 2 : -Math.PI / 2, seenBy: false,""")
rep("""  separate(W);
  for (const u of W.units){
    // 속도""","""  separate(W);
  for (const u of W.units) if (u.alive) turnTo(W, u, dt);
  for (const u of W.units){
    // 속도""")
# guard arcs
rep("""      canGuard: !!p.shield || !!wp.guard, post: 100,""","""      canGuard: !!p.shield || !!wp.guard || (p.traits || []).includes('반사신경'), post: 100,
      gArc: Math.max(p.shield ? rules.frontArc : 0, wp.guard ? rules.guardArcW || 40 : 0, (p.traits || []).includes('반사신경') ? (wp.guard || p.shield ? rules.guardArcRW || 55 : rules.guardArcR || 20) : 0),
      gCost: (p.traits || []).includes('반사신경') ? rules.reflexCost || 0.6 : 1,""")
rep("""const isFar = u => u.rng > 1;""","""const isFar = u => u.rng > 1;
// 막는 방향 안인가: 방어 자세가 서 있고, a 가 바라보는 방향 ±gArc 안
const inGuard = (W, t, a) => guardOn(W, t) && angDiff(t.face, Math.atan2(a.y - t.y, a.x - t.x)) * 180 / Math.PI <= t.gArc;""")
rep("""function shieldBlock(W, a, t){ const f = firstOnLine(W, a, t, a); return f !== t && guardOn(W, f) && sideOf(W, f, a) === 'front' ? f : null; }""","""function shieldBlock(W, a, t){ const f = firstOnLine(W, a, t, a); return f !== t && inGuard(W, f, a) ? f : null; }""")
rep("""  if (guardOn(W, t) && dir === 'front'){
    t.post -= R.postCost; t.blockT = W.t; t.blocked++;""","""  if (inGuard(W, t, u)){
    t.post -= R.postCost * (t.gCost || 1); t.blockT = W.t; t.blocked++;""")
rep("""    if (guardOn(W, first) && sideOf(W, first, u) === 'front'){   // 방어 자세가 앞을 막음""","""    if (inGuard(W, first, u)){   // 방어 자세가 이쪽을 막고 있음 → 쏘면 막힘""")
rep("""return Math.hypot(g.x - (e.x + vx * k), g.y - (e.y + vy * k)) <= g.r + 0.04 && sideOf(W, g, e) === 'front'; });""","""return Math.hypot(g.x - (e.x + vx * k), g.y - (e.y + vy * k)) <= g.r + 0.04 && inGuard(W, g, e); });""")
rep("""  if (t.act) return t.act.b === u.i && t.act.phase === 'wind' && guardOn(W, t) ? '' : '틈';
  if (sideOf(W, t, u) !== 'front') return '측면';
  if (!guardOn(W, t)) return t.canGuard ? '자세 무너짐' : '맞붙음';
  return '';""","""  if (t.act) return t.act.b === u.i && t.act.phase === 'wind' && inGuard(W, t, u) ? '' : '틈';
  if (sideOf(W, t, u) !== 'front') return '측면';
  if (!t.canGuard) return '맞붙음';
  if (!guardOn(W, t)) return '자세 무너짐';
  if (!inGuard(W, t, u)) return '빈 방향';   // 앞이지만 막는 폭 밖 (좁은 방어)
  return '';""")
# pack: no impatience; narrow guard opening
rep("""  const op = (t.act && t.act.b !== u.i) || sideOf(W, t, u) !== 'front' || W.t < t.pinT || (t.canGuard && !guardOn(W, t));
  if (op || u.waitT > 4 + (1 - u.bold) * 6){""","""  // 틈이 없으면 물지 않고 거리를 유지 (지루해서 달려들지 않음)
  const op = (t.act && t.act.b !== u.i) || sideOf(W, t, u) !== 'front' || W.t < t.pinT || (t.canGuard && !inGuard(W, t, u));
  if (op){""")
# expert enemy melee: favourable check
rep("""  // 아직 손이 안 닿음: 다가갈 이유가 있을 때만 다가감
  const f = focusOf(W, t), busyOther = !!(f && f !== u && f.side === u.side);
  const alone = !W.units.some(o => o.alive && o !== u && o.side === u.side);
  const go = ordered || u.bold >= 0.65 || busyOther || !!t.act || isFar(t) || u.waitT > 3 || !canSee(W, t, u) || alone;""","""  // 아직 손이 안 닿음: 다가갈 이유가 있을 때만 다가감
  const f = focusOf(W, t), busyOther = !!(f && f !== u && f.side === u.side);
  const alone = !W.units.some(o => o.alive && o !== u && o.side === u.side);
  let go = ordered || u.bold >= 0.65 || busyOther || !!t.act || isFar(t) || u.waitT > 3 || !canSee(W, t, u) || alone;
  if (u.side === 1 && !ordered){
    // 적 (expert): 유리할 때만 들어감 — 상대가 고립 · 우리 편이 그 둘레에 더 많음 · 다른 이와 맞붙어 옆을 보임 · 다른 이를 치는 중
    const sup = supportOf(W, t), mine = W.units.filter(o => o.alive && o !== u && o.side === u.side && dist(o, t) <= 2.5).length;
    go = sup === 0 || mine >= sup + 1 || (busyOther && sideOf(W, t, u) !== 'front') || (!!t.act && t.act.b !== u.i) || (!canSee(W, t, u) && sideOf(W, t, u) !== 'front');
    if (!go){
      // 불리함: 손 닿는 거리 밖에서 위협하며 방향을 붙들고, 다가오면 물러섬
      const want = t.rng + R.reach + 0.5, g = gap(u, t);
      u.waitT += dt;
      if (g < want - 0.25){ const d = dist(u, t) || 1, gx = u.x + (u.x - t.x) / d, gy = u.y + (u.y - t.y) / d; if (!rock(W.map, gx, gy)) goTo(W, u, gx, gy, dt); else moveDir(W, u, (u.x - t.x) / d, (u.y - t.y) / d, dt); setMood(W, u, '물러섬', t.i); }
      else if (g > want + 0.8){ setMood(W, u, '다가감', t.i); goTo(W, u, t.x, t.y, dt); }
      else { stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '위협', t.i); }
      return;
    }
  }""")
rep("""/* ---------- v4.1 감각: 냄새 · 브리핑 · 짖는 소리 · 알아차림 ---------- */""","""// 상대 t 둘레 2.5칸 안의 t 편 (t 를 도울 수 있는 몸)
const supportOf = (W, t) => W.units.filter(o => o.alive && o !== t && o.side === t.side && dist(o, t) <= 2.5).length;
/* ---------- v4.1 감각: 냄새 · 브리핑 · 짖는 소리 · 알아차림 ---------- */""")
# stalk: avoid unfavourable (target supported by 2+)
rep("""  const sd = sideOf(W, t, u), f = focusOf(W, t), busy = !!t.act || (f && f !== u);
  if (inReach(u, t)){ if (sd !== 'front' || busy){ startAct(W, u, t, '암살'); return true; } return false; }
  if (sd === 'back' && gap(u, t) < 1.8){ setMood(W, u, '파고듦', t.i); goTo(W, u, t.x, t.y, dt); return true; }""","""  const sd = sideOf(W, t, u), f = focusOf(W, t), busy = !!t.act || (f && f !== u);
  if (inReach(u, t)){ if (sd !== 'front' || busy){ startAct(W, u, t, '암살'); return true; } return false; }
  // 친 뒤 살아 나갈 길: 상대 둘레에 상대 편이 둘 이상이면 들어가지 않고 어둠에서 기다림 (갈라지는 순간을 노림)
  if (supportOf(W, t) >= 2 && !busy){ u.waitT += dt; if (u.waitT > 12) return false; stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '숨어 지켜봄', t.i); return true; }
  if (sd === 'back' && gap(u, t) < 1.8){ setMood(W, u, '파고듦', t.i); goTo(W, u, t.x, t.y, dt); return true; }""")
# dangerOf: also threatening melee foes nearby
rep("""  if (sh) return sh;
  return W.units.filter(e => e.alive && e.side !== u.side && know(e) && e.act && e.act.b === u.i).sort((a, b) => dist(u, a) - dist(u, b))[0] || null;""","""  if (sh) return sh;
  const m = W.units.filter(e => e.alive && e.side !== u.side && know(e) && e.act && e.act.b === u.i).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (m) return m;
  // 위협: 2.5칸 안에서 나나 곁의 동료를 노리는 근접 상대 (가장 가까운 쪽을 막음 — 둘이면 한쪽을 골라야 함)
  return W.units.filter(e => e.alive && e.side !== u.side && know(e) && !isFar(e) && dist(e, u) < 2.5 && (() => { const f = focusOf(W, e); return f && (f === u || (f.side === u.side && dist(f, u) < 1.6)); })()).sort((a, b) => dist(u, a) - dist(u, b))[0] || null;""")
s=s.replace("""module.exports = { aware, brief,""","""module.exports = { inGuard, supportOf, aware, brief,""")
open('rt3_tail.js','w').write(s)
print('ok')
