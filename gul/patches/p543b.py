import sys
def check(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        if s.count(o)!=1: print('MISMATCH',p,s.count(o),o[:100]); sys.exit(1)
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs: s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)
T=[
("""  if (!u.jspot || W.t - u.jspot.t > 0.6){
    let sp = null, sb = 0;
    for (const r of [0.7, 1.2]) for (let k = 0; k < 8; k++){
      const a = k * Math.PI / 4, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
      if (rock(W.map, x - u.r, y - u.r) || rock(W.map, x + u.r, y + u.r) || W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r)) continue;
      if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && Math.hypot(f.x - x, f.y - y) - f.r - u.r < f.rng + 0.5)) continue;   // 상대 손 닿는 곳은 피함
      const p = javOdds(W, u, t, x, y, ordered) - r * 0.05; if (p > sb){ sb = p; sp = { x, y }; }
    }
    u.jspot = { t: W.t, p: sp };
  }
  const sp = u.jspot.p; if (!sp) return false;""",
"""  // v5.4.3 명령이면 내 둘레뿐 아니라 상대 둘레 (2.5 · 3.5 · 4.5칸 고리) 까지 돌아 들어가 사선을 찾음
  const sp = laneSpot(W, u, t, 'jav', ordered ? [2.5, 3.5, 4.5] : [], (x, y) => javOdds(W, u, t, x, y, ordered)); if (!sp) return false;"""),
("""function stepShots(W, dt){""",
"""// v5.4.3 명령을 받으면 길을 찾아 움직임: 내 둘레 (0.7 · 1.2 · 1.8칸) 와 상대 둘레 고리 (상대에서 ring 칸, 지금 방향 ±120°) 중
// ok(x, y) 값이 가장 높은 자리 (가까울수록 좋음). 바위 · 다른 인물 자리 · 상대 손 닿는 곳은 뺌. 0.6초마다 다시 찾음 (key 마다)
function laneSpot(W, u, t, key, ring, ok){
  const c = u.lane && u.lane.key === key && u.lane.b === t.i && W.t - u.lane.t < 0.6 ? u.lane : null; if (c) return c.p;
  const cand = [], b0 = Math.atan2(u.y - t.y, u.x - t.x);
  for (const r of [0.7, 1.2, 1.8]) for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4; cand.push({ x: u.x + Math.cos(a) * r, y: u.y + Math.sin(a) * r }); }
  for (const d of ring) for (let k = -4; k <= 4; k++){ const a = b0 + k * Math.PI / 6, rr = t.r + u.r + d; cand.push({ x: t.x + Math.cos(a) * rr, y: t.y + Math.sin(a) * rr }); }
  let best = null, bs = 0;
  for (const q of cand){
    if (boxRock(W, q.x, q.y, u.r * 0.9) || W.units.some(o => o.alive && o !== u && Math.hypot(o.x - q.x, o.y - q.y) < o.r + u.r)) continue;
    if (W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && Math.hypot(f.x - q.x, f.y - q.y) - f.r - u.r < f.rng + 0.5)) continue;   // 상대 손 닿는 곳은 피함
    const v = ok(q.x, q.y); if (!v) continue;
    const s = v - Math.hypot(q.x - u.x, q.y - u.y) * 0.05; if (s > bs){ bs = s; best = q; }
  }
  u.lane = { key, b: t.i, t: W.t, p: best };
  return best;
}
// v5.4.3 그 자리에서 돌진할 수 있는가: 상대까지 돌진 거리 (min + 0.2 ~ max − 0.3) · 바위가 안 막음 · 길에 동료 없음. 3칸 언저리일수록 좋음
function chargeLaneOk(W, u, t, x, y){
  const C = W.rules.charge || {}, g = Math.hypot(t.x - x, t.y - y) - u.r - t.r;
  if (g < (C.min || 1.5) + 0.2 || g > (C.max || 5) - 0.3 || !fatClear(W.map, x, y, t.x, t.y, u.r * 0.9)) return 0;
  const P = { x, y }; if (W.units.some(o => o.alive && o !== u && o !== t && o.side === u.side && segD(P, t.x, t.y, o) < o.r + u.r)) return 0;
  return 1 - Math.abs(g - 3) * 0.1;
}
function stepShots(W, dt){"""),
("""    // v5.2 돌진 명령 (액티브 스킬): 돌진 거리 (min ~ max) 안 · 길이 트이면 들이받음 → 그 상대 공격. 다시 쓰기 전 · 너무 가까우면 그냥 공격
    const t = W.units[o.b], C = W.rules.charge || {};
    if (!t || !t.alive || !u.canCharge){ u.order = null; return; }
    if (!canSee(W, u, t) || W.t < u.chargeCd || gap(u, t) < (C.min || 1.5)){ u.order = { k: 'attack', b: t.i }; u.last = { x: t.x, y: t.y }; return; }
    if (tryCharge(W, u, t, true)){ u.order = { k: 'attack', b: t.i }; return; }
    setMood(W, u, '돌진 거리로', t.i); goTo(W, u, t.x, t.y, dt); return;""",
"""    // v5.2 돌진 명령 (액티브 스킬): 돌진 거리 (min ~ max) 안 · 길이 트이면 들이받음 → 그 상대 공격.
    // v5.4.3 명령은 길을 찾아 끝까지: 내가 못 봐도 동료가 보면 다가감, 너무 가깝거나 길에 동료 · 바위가 있으면 길이 트인 자리 (돌진 거리) 로 돌아 들어감,
    // 다시 쓰기 전이면 그 자리에서 노려보며 기다림. 맞붙으면 · 아무도 못 보면 · 10초가 지나도 길이 안 열리면 그냥 공격
    const t = W.units[o.b], C = W.rules.charge || {};
    if (!t || !t.alive || !u.canCharge || u.crawl){ u.order = null; return; }
    if (o.t0 == null) o.t0 = W.t;
    const see = canSee(W, u, t), toAtk = why => { if (why) L(W, { k: 'lost', a: u.i, b: t.i, why }); u.order = { k: 'attack', b: t.i }; u.last = { x: t.x, y: t.y }; };
    if (W.units.some(f => f.alive && f.side !== u.side && gap(u, f) <= Math.max(u.rng, isFar(f) ? 0 : f.rng) + 0.2)){ toAtk(''); return; }   // 맞붙음 → 그냥 싸움
    if (W.t - o.t0 > 10){ toAtk('돌진 길이 안 열림'); return; }
    if (!see && !(u.side === 0 ? t.seenBy : fresh(W, u.sense[t.i], 1))){ toAtk(''); return; }   // 아무도 못 봄 → 공격 명령이 찾아감
    if (see && tryCharge(W, u, t, true)){ u.order = { k: 'attack', b: t.i }; return; }
    const ready = W.t >= u.chargeCd;
    if (see || gap(u, t) < (C.max || 5) + 1.5){
      const sp = laneSpot(W, u, t, 'charge', [2.4, 3.2, 4], (x, y) => chargeLaneOk(W, u, t, x, y));
      if (sp && Math.hypot(sp.x - u.x, sp.y - u.y) > 0.15){ setMood(W, u, ready ? '돌진 길 찾기' : '돌진 준비', t.i); goTo(W, u, sp.x, sp.y, dt); return; }
      if (sp || !ready){ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '돌진 준비', t.i); return; }   // 그 자리에서 노려봄 · 다시 쓸 때를 기다림
    }
    setMood(W, u, '돌진 거리로', t.i); goTo(W, u, t.x, t.y, dt); return;"""),
("""if (typeof module !== 'undefined') module.exports = { isRangedW,""", """if (typeof module !== 'undefined') module.exports = { laneSpot, chargeLaneOk, isRangedW,"""),
]
P=[
("""      case 'lost': out.push(`${T(e)}${ga(n(e.a))} ${reul(n(e.b))} ${e.why ? '못 던짐 (' + e.why + ')' : '놓침'} → 자동`); break;""",
 """      case 'lost': out.push(`${T(e)}${ga(n(e.a))} ${reul(n(e.b))} ${e.why ? (e.why.startsWith('돌진') ? '못 들이받음' : '못 던짐') + ' (' + e.why + ')' : '놓침'} → ${e.why && e.why.startsWith('돌진') ? '공격' : '자동'}`); break;"""),
("""    case 'lost': return { c: 'dim', s: e.why ? `${ga(n(e.a))} 끝내 ${n(e.b)} 쪽으로 사선이 열리지 않아 창을 거뒀다.` : `${ga(n(e.a))} ${reul(n(e.b))} 놓쳤다.` };""",
 """    case 'lost': return { c: 'dim', s: e.why && e.why.startsWith('돌진') ? `${ga(n(e.a))} 끝내 ${n(e.b)}에게 내달릴 길을 찾지 못해 그냥 맞붙으러 갔다.` : e.why ? `${ga(n(e.a))} 끝내 ${n(e.b)} 쪽으로 사선이 열리지 않아 창을 거뒀다.` : `${ga(n(e.a))} ${reul(n(e.b))} 놓쳤다.` };"""),
("""toast(C.some(u => world.t < u.chargeCd) ? `돌진은 ${f2(Math.max(...C.map(u => u.chargeCd - world.t)))}초 뒤에 다시 쓸 수 있어요 — 누른 적에게 다가가 기다려요` : '들이받을 적을 누르세요 (Esc 취소)');""",
 """toast(C.some(u => world.t < u.chargeCd) ? `돌진은 ${f2(Math.max(...C.map(u => u.chargeCd - world.t)))}초 뒤에 다시 쓸 수 있어요 — 누른 적 앞 돌진 자리에서 기다려요` : '들이받을 적을 누르세요 (Esc 취소)');"""),
]
check('rt3_tail.js',T); check('page10.tpl.html',P)
patch('rt3_tail.js',T); patch('page10.tpl.html',P)
print('ok')
