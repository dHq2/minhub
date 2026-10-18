def load(p): return open(p).read()
def rep(s,a,b,n=1):
    c=s.count(a); assert c==n,(a[:80],c); return s.replace(a,b)
# ---------- head ----------
p='rt3_head.js'; s=load(p)
s=rep(s,"""  assn: { cls:""","""  supp: { n: 3, spread: 0.45, spreadD: 0.09, near: 0.6, pin: 0.6, wind: 0.8, over: 2, ffWait: 3, est: [0.7, 1.3], lat: 1, incT: 6, ai: 1, cd: 6 },   // v7.7 견제사격 (보이지 않는 상대는 겨누지 못함): 베테랑 사수만 · 명령으로 · 바닥 자리에 n 발 (자리 둘레 spread + 거리 × spreadD 칸 흩어짐 · 자리 너머 over 칸까지 날아감). 탄이 near 칸 안을 스치면 pin 초 움찔. 사선에 아군이 있으면 ffWait 초 기다리다 그만둠. 적 지휘관도 보이지 않는 사수에게 맞으면 날아온 방향 × (지나온 거리 × est) · 옆으로 ± lat 칸을 짐작해 시킴 (사수마다 cd 초에 한 번 · ai 0 이면 안 함). 날아온 방향 기록은 incT 초
  watch: { gap: [3, 6], vet: 0.6, layman: 1.5, sentry: 0.5, ring: 0.5, dur: 0.6, busy: 2 },   // v7.7 사주경계: 맞붙지 않은 몸은 gap 초마다 dur 초 뒤를 돌아봄 (그동안 시선은 뒤 — 숨은 몸 · 기습을 알아챔, 앞은 비움). 베테랑 × vet · 일반인 × layman · 초병 × sentry · 사주경계 명령 × ring. 보이는 상대가 (손 · 사거리 + busy 칸) 가까이 앞에 있으면 돌아보지 않음
  shadow: { min: 0.4, far: 14, score: 0.25, max: 25, cd: 8, shoot: 0.15, wait: 2.5, back: 2.5 },   // v7.7 적 암살조 (프로): 우리를 알고 있으면 지휘관이 암살 솜씨 min 이상 · 맞붙지 않은 · 안 보이는 근접 하나를 far 칸 안의 등이 비는 아군 (솜씨 × (1 − 경계) − 거리 × 0.015 + 사수 · 치유는 shoot) 이 score 넘으면 보냄 (지휘 전달 공식). 숨어서 등 뒤 back 칸으로 돌아 들어가 암살. 들키거나 · 맞붙거나 · max 초 · 틈이 wait 초 안 나면 그만둠. 하나씩, 끝나면 cd 초 뒤
  assn: { cls:""")
s=rep(s,"""어둠 속 우회 조는 숨어서 돎.""","""어둠 속 우회 조는 숨어서 돎.
   v7.7.0: 보이지 않으면 겨누지 못함 (그대로) — 대신 베테랑 사수의 견제사격 (명령 · 날아온 쪽 바닥에 · 스치면 움찔 · 쏘면 드러남). 날아온 방향을 앎. 횃불 빛 밖 어스름 = 실루엣 (야시 없이도 보이나 누구인지 모름 · 덜 맞음).
           사주경계: 맞붙지 않은 몸은 가끔 뒤를 돌아봄 (베테랑 · 초병은 자주, 일반인은 드물게) · 사주경계 명령. 적 암살조 (프로): 지휘관이 등이 비는 아군에게 숨은 근접 하나를 보냄.""")
open(p,'w').write(s)
# ---------- mid ----------
p='rt3_mid.js'; s=load(p)
s=rep(s,"""  if (d <= (u.r || 0) + (t.r || 0) + 0.35 && (u.face == null || u.heads > 1 || sideOf(W, u, t) !== 'back')) return true;""","""  if (d <= (u.r || 0) + (t.r || 0) + 0.35 && (u.face == null || u.heads > 1 || sideV(W, u, t) !== 'back')) return true;""")
s=rep(s,"""  if (sk < 1 && (W.rules.stealth || {}).back && u.face != null && !(u.heads > 1) && sideOf(W, u, t) === 'back') return false;""","""  if (sk < 1 && (W.rules.stealth || {}).back && u.face != null && !(u.heads > 1) && sideV(W, u, t) === 'back') return false;   // v7.7 돌아보는 중이면 그쪽""")
open(p,'w').write(s)
# ---------- tail ----------
p='rt3_tail.js'; s=load(p)
# 시선 (돌아봄) 반영
s=rep(s,"""  if (canSee(W, t, a) && (t.heads > 1 || sideOf(W, t, a) !== 'back')) return true;""","""  if (canSee(W, t, a) && (t.heads > 1 || sideV(W, t, a) !== 'back')) return true;""")
s=rep(s,"""  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f) && (u.heads > 1 || sideOf(W, u, f) !== 'back')) u.sense[f.i] =""","""  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f) && (u.heads > 1 || sideV(W, u, f) !== 'back')) u.sense[f.i] =""")
s=rep(s,"""!canSee(W, u, c) && (u.heads > 1 || sideOf(W, u, c) !== 'back') && losClear(""","""!canSee(W, u, c) && (u.heads > 1 || sideV(W, u, c) !== 'back') && losClear(""")
s=rep(s,"""  const eye = W.units.find(o => o.alive && !o.down && o !== t && o.side === t.side && canSee(W, o, a) && ((o.heads || 1) > 1 || sideOf(W, o, a) !== 'back'));""","""  const eye = W.units.find(o => o.alive && !o.down && o !== t && o.side === t.side && canSee(W, o, a) && ((o.heads || 1) > 1 || sideV(W, o, a) !== 'back'));""")
s=rep(s,"""const assnEye = (W, o, t) => o.alive && !o.down && o !== t && o.side === t.side && canSee(W, o, t) && ((o.heads || 1) > 1 || sideOf(W, o, t) !== 'back');""","""const assnEye = (W, o, t) => o.alive && !o.down && o !== t && o.side === t.side && canSee(W, o, t) && ((o.heads || 1) > 1 || sideV(W, o, t) !== 'back');""")
s=rep(s,"""const assnSpotted = (W, u) => W.units.find(e => e.alive && !e.down && e.side !== u.side && canSee(W, e, u) && ((e.heads || 1) > 1 || sideOf(W, e, u) !== 'back'));""","""const assnSpotted = (W, u) => W.units.find(e => e.alive && !e.down && e.side !== u.side && canSee(W, e, u) && ((e.heads || 1) > 1 || sideV(W, e, u) !== 'back'));""")
# 새 함수 묶음 (암살 함수 앞)
s=rep(s,"""// v7.6 암살: 숨은 채 (은신 · 매복 · 어둠 속 우회)""","""// v7.7 사주경계: 맞붙지 않은 몸은 가끔 뒤를 돌아봄 — 그동안 시선 (알아챔 · 숨은 몸을 봄) 은 돌아본 쪽 (앞은 비움)
const WAT = W => W.rules.watch;
const lookOn = (W, u) => !!u.look && W.t < u.look.until;
function sideV(W, u, t){ if (!lookOn(W, u)) return sideOf(W, u, t); const deg = angDiff(u.look.a, Math.atan2(t.y - u.y, t.x - u.x)) * 180 / Math.PI, F = W.rules.frontArc; return deg <= F ? 'front' : deg <= 180 - F ? 'side' : 'back'; }
function watchTick(W){
  const R = WAT(W); if (!R || AI6.includes('watch')) return;
  for (const u of W.units){
    if (!u.alive || u.down || (u.koT && W.t < u.koT) || u.heads > 1 || lookOn(W, u)) continue;
    const g = R.gap || [3, 6];
    if (u.lookNext == null){ u.lookNext = W.t + g[0] + W.rand() * (g[1] - g[0]); continue; }
    if (W.t < u.lookNext) continue;
    if ((u.act && u.act.phase === 'wind') || W.units.some(f => f.alive && !f.down && f.side !== u.side && dist(f, u) < u.r + f.r + Math.max(u.rng, isFar(f) ? 0 : f.rng) + (R.busy || 2) && canSee(W, u, f) && sideOf(W, u, f) !== 'back')){ u.lookNext = W.t + 0.5; continue; }
    const m = (u.vet ? R.vet || 1 : 1) * ((u.traits || []).includes('일반인') ? R.layman || 1 : 1) * (u.sentry ? R.sentry || 1 : 1) * (u.order && u.order.k === 'watch' ? R.ring || 1 : 1);
    u.look = { a: (u.face || 0) + Math.PI + (W.rand() - 0.5) * 1.2, until: W.t + (R.dur || 0.6) };
    u.lookNext = W.t + (R.dur || 0.6) + (g[0] + W.rand() * (g[1] - g[0])) * m;
  }
}
// v7.7 견제사격: 보이지 않는 상대는 겨누지 못함 — 베테랑 사수만, 명령으로, 날아온 쪽 (바닥 자리) 에 n 발. 맞히기보다 움찔하게 (근처를 스치면 pin 초). 쏘면 드러남 (총은 총성)
const SUP = W => W.rules.supp;
const suppOK = u => isFar(u) && !!u.vet && u.ammo !== 0 && !u.crawl;
const segD = (p, ax, ay, bx, by) => { const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy || 1, k = Math.max(0, Math.min(1, ((p.x - ax) * vx + (p.y - ay) * vy) / L2)); return Math.hypot(p.x - ax - vx * k, p.y - ay - vy * k); };
function launchAt(W, u, x, y, so){
  const SU = SUP(W) || {}, wp = (W.rules.weapons || {})[u.weapon] || {}, d = Math.max(0.5, Math.hypot(x - u.x, y - u.y)), sp = (SU.spread || 0.45) + (SU.spreadD || 0.09) * d, a = W.rand() * 6.283, rr = Math.sqrt(W.rand()) * sp;
  const ang = Math.atan2(y + Math.sin(a) * rr - u.y, x + Math.cos(a) * rr - u.x), dx = Math.cos(ang), dy = Math.sin(ang);
  W.shots.push({ id: ++W.shotN, a: u.i, meant: null, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: wp.vel || 40, left: Math.min(u.rng + u.r + 2.5, d + (SU.over || 2)), p: 0, good: false, t0: W.t, side: u.side, mul: 1, pm: 1, gun: wp.kind === '총포류', supp: true, so });
}
function suppStep(W, u, dt, o, end){
  const SU = SUP(W) || {};
  if (!o.on){ o.on = true; o.left = o.n || SU.n || 3; o.fired = 0; o.hits = 0; o.t0 = W.t; L(W, { k: 'supp', a: u.i, x: +o.x.toFixed(1), y: +o.y.toFixed(1), n: o.left, ai: !!o.ai, vis: u.side === 0 || !!u.seenBy }); }
  const fin = why => { L(W, { k: 'suppEnd', a: u.i, n: o.fired, hit: o.hits, why: why || '', vis: u.side === 0 || !!u.seenBy }); end(); };
  if (!suppOK(u)){ fin(!isFar(u) ? '사수가 아님' : !u.vet ? '베테랑만 할 수 있음' : '탄이 없음'); return; }
  if (u.act) return;
  if (o.left <= 0){ fin(''); return; }
  if (needReload(u)){ startReload(W, u); return; }
  if (W.t - o.t0 > 20){ fin('시간이 너무 걸림'); return; }
  const ang = Math.atan2(o.y - u.y, o.x - u.x), d = Math.hypot(o.x - u.x, o.y - u.y); stop(u); u.fg = ang;
  const ff = W.units.find(f => f.alive && f !== u && f.side === u.side && segD(f, u.x, u.y, u.x + Math.cos(ang) * (d + (SU.over || 2)), u.y + Math.sin(ang) * (d + (SU.over || 2))) < f.r + 0.35);
  if (ff){ if (o.ffT == null) o.ffT = W.t; setMood(W, u, '사선에 아군', ff.i); if (W.t - o.ffT > (SU.ffWait || 3)) fin('사선에 아군 (' + ff.name + ')'); return; }
  o.ffT = null;
  if (angDiff(u.face, ang) > 0.35){ setMood(W, u, '견제사격 — 돌아섬'); return; }
  const wind = aimT(W, u) * (SU.wind || 0.8);
  u.act = { k: 'supp', b: null, phase: 'wind', t0: W.t, end: W.t + wind, px: o.x, py: o.y, so: o };
  setMood(W, u, '견제사격');
}
function resolveSupp(W, u){
  const A = u.act; if (A.phase !== 'wind'){ u.act = null; return; }
  fire(W, u); launchAt(W, u, A.px, A.py, A.so); A.so.left--; A.so.fired++;
  if (u.ammo === 0) outOfAmmo(W, u);
  A.phase = 'rec'; A.t1 = W.t; A.end = W.t + u.rec;
}
// 맞거나 스친 쪽: 쏜 자를 보는 동료가 없으면 날아온 방향만 앎 (incoming — 적 지휘관은 이것으로 견제사격을 시킴)
function incoming(W, b, s){
  const SU = SUP(W), sh = W.units[s.a]; if (!SU || !sh || b.side === s.side) return;
  if (W.units.some(o => o.alive && o.side === b.side && !(o.side === 0 && o.posUnk) && canSee(W, o, sh))) return;
  const I = W.inc || (W.inc = []), T = SU.incT || 6;
  I.push({ side: b.side, x: +b.x.toFixed(2), y: +b.y.toFixed(2), dx: -s.dx, dy: -s.dy, tr: +Math.hypot(s.x - s.x0, s.y - s.y0).toFixed(1), t: W.t, gun: !!s.gun, by: b.i });
  if (I.length > 30 || W.t - I[0].t > T) W.inc = I.filter(r => W.t - r.t < T);
  const k = 'incLogT' + b.side; if (W.t - (W[k] == null ? -9 : W[k]) >= 1.5){ W[k] = W.t; L(W, { k: 'incoming', side: b.side, b: b.i, dir: dirName(-s.dx, -s.dy), gun: !!s.gun, supp: !!s.supp, vis: b.side === 0 || !!b.seenBy }); }
}
// 적 지휘관: 보이지 않는 사수에게 맞으면 (날아온 방향) 보이는 상대가 없는 베테랑 사수에게 그쪽 견제사격을 시킴 (지휘 전달 공식)
function suppAI(W){
  const SU = SUP(W); if (!SU || !SU.ai || AI6.includes('supp')) return;
  const C = cmdBoss(W, 1); if (!C) return;
  const rec = (W.inc || []).filter(r => r.side === 1 && W.t - r.t < 3); if (!rec.length) return;
  const r = rec[rec.length - 1];
  for (const u of W.units){
    if (!u.alive || u.down || u.side !== 1 || !suppOK(u) || u.supp || u.suppPend || u.act || W.t < (u.suppCd || 0) || u.shadow || u.lurk) continue;
    if (W.units.some(f => f.alive && f.side === 0 && canSee(W, u, f) && gap(u, f) <= u.rng)) continue;
    const e = SU.est || [0.7, 1.3], dE = Math.max(2, Math.min(12, r.tr * (e[0] + W.rand() * (e[1] - e[0])))), lat = (W.rand() - 0.5) * 2 * (SU.lat || 1);
    const x = Math.max(0.5, Math.min(W.map.W - 0.5, r.x + r.dx * dE - r.dy * lat)), y = Math.max(0.5, Math.min(W.map.H - 0.5, r.y + r.dy * dE + r.dx * lat));
    if (Math.hypot(x - u.x, y - u.y) > u.rng + 2) continue;
    u.suppCd = W.t + (SU.cd || 6);
    const lk = u === C ? { p: 1, t: 0 } : cmdLink1(W, C, u);
    if (W.rand() < lk.p) u.suppPend = { x, y, at: W.t + lk.t };
    else if (W.t - (u.missLogT == null ? -9 : u.missLogT) > 3){ u.missLogT = W.t; L(W, { k: 'cmdMiss', side: 1, a: u.i, c: C.i, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['supp'], vis: !!u.seenBy }); }
  }
}
function suppAct(W, u, dt){   // 적 사수: 받은 견제사격 (보이는 상대가 생기면 그쪽을 겨눔)
  if (u.suppPend && W.t >= u.suppPend.at){ const P = u.suppPend; u.suppPend = null; u.supp = { x: P.x, y: P.y, n: (SUP(W) || {}).n || 3, ai: true }; }
  if (!u.supp) return false;
  if (W.units.some(f => f.alive && f.side !== u.side && canSee(W, u, f) && gap(u, f) <= u.rng)){ L(W, { k: 'suppEnd', a: u.i, n: u.supp.fired || 0, hit: u.supp.hits || 0, why: '상대가 보임', vis: !!u.seenBy }); u.supp = null; return false; }
  suppStep(W, u, dt, u.supp, () => { u.supp = null; }); return true;
}
// v7.7 적 암살조 (프로): 지휘관이 우리를 알고 있으면 숨는 솜씨가 되는 근접 하나를 등이 비는 아군에게 숨어서 보냄 (지휘 전달 공식) — 하나씩
const SHD = W => W.rules.shadow;
const opBusy = (W, u) => !!(W.wedge && (W.wedge.tip === u.i || (W.wedge.sh || []).includes(u.i) || (W.wedge.body || []).includes(u.i))) || !!(W.env && W.env.wp && W.env.wp[u.i]);
function planShadow(W){
  const H = SHD(W), A = ASN(W); if (!H || !A || AI6.includes('shadow') || AI6.includes('assn')) return;
  const C = cmdBoss(W, 1); if (!C || !W.alarm1 || W.t < (W.shadowNext || 0)) return;
  if (W.units.some(u => u.alive && u.side === 1 && (u.shadow || u.shadowPend))) return;
  W.shadowNext = W.t + 1.5;
  const known = W.units.filter(t => t.alive && !t.down && t.side === 0 && !(t.giant || t.modBody || t.bodyShield || t.max >= (A.big || 300)) && W.units.some(e => e.alive && e.side === 1 && (canSee(W, e, t) || fresh(W, e.sense[t.i], 3))));
  if (!known.length) return;
  let best = null, bs = H.score || 0.25;
  for (const u of W.units){
    if (!u.alive || u.down || u.side !== 1 || isFar(u) || !(u.assnE >= (H.min || 0.4)) || u.giant || u.role === '전선' || u.line || u.lretId != null || u.pact || u.crawl || u.kb || u.seenBy || u.supp || u.lurk || u.act || opBusy(W, u)) continue;
    if (W.units.some(f => f.alive && !f.down && f.side === 0 && dist(f, u) < 2.5)) continue;
    for (const t of known){ const d = dist(u, t); if (d > (H.far || 14)) continue; const V = assnVigil(W, t, u); if (V.no) continue;
      const sc = u.assnE * (1 - V.v) + (isFar(t) || t.cls === '치유' ? H.shoot || 0.15 : 0) - d * 0.015; if (sc > bs){ bs = sc; best = { u, t }; } }
  }
  if (!best) return;
  const { u, t } = best, lk = u === C ? { p: 1, t: 0 } : cmdLink1(W, C, u);
  if (W.rand() < lk.p) u.shadowPend = { b: t.i, at: W.t + lk.t, s: +bs.toFixed(2) };
  else if (W.t - (u.missLogT == null ? -9 : u.missLogT) > 3){ u.missLogT = W.t; L(W, { k: 'cmdMiss', side: 1, a: u.i, c: C.i, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['shadow', t.i], vis: !!u.seenBy }); }
}
function shadowStep(W, u, dt){
  const H = SHD(W) || {};
  if (u.shadowPend && W.t >= u.shadowPend.at){ const P = u.shadowPend; u.shadowPend = null; u.shadow = { b: P.b, t0: W.t, st0: !!u.stealth, last: null }; u.stealth = true; L(W, { k: 'shadow', a: u.i, b: P.b, s: P.s, hid: !u.seenBy }); }
  const S = u.shadow; if (!S) return false;
  const c = W.units[S.b];
  const end = why => { u.stealth = S.st0; u.shadow = null; W.shadowNext = W.t + (H.cd || 8); L(W, { k: 'shadowEnd', a: u.i, b: S.b, why, ok: !!(c && c.assnBy === u.i), hid: !u.seenBy }); };
  if (u.act) return true;
  if (!c || !c.alive || c.down){ end(c && c.assnBy === u.i ? '해냄' : '대상이 쓰러짐'); return false; }
  if (W.t - S.t0 > (H.max || 25)){ end('시간'); return false; }
  const sp = assnSpotted(W, u); if (sp){ end('들킴 (' + sp.name + ')'); return false; }
  if (W.units.some(f => f.alive && !f.down && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.3 && sideOf(W, f, u) !== 'back')){ end('맞붙음'); return false; }
  const kn = canSee(W, u, c) || W.units.some(e => e.alive && e.side === u.side && e !== u && canSee(W, e, c));
  if (kn) S.last = { x: c.x, y: c.y };
  if (!S.last){ end('놓침'); return false; }
  if (!kn){ if (Math.hypot(S.last.x - u.x, S.last.y - u.y) < 0.6){ end('놓침'); return false; } setMood(W, u, '숨어 찾음', c.i); goTo(W, u, S.last.x, S.last.y, dt); return true; }
  if (dist(u, c) > 3.2){
    let k = H.back || 2.5, bx = c.x - Math.cos(c.face) * k, by = c.y - Math.sin(c.face) * k;
    if (glowAt(W, bx, by)){ k += 1.2; bx = c.x - Math.cos(c.face) * k; by = c.y - Math.sin(c.face) * k; }
    bx = Math.max(0.6, Math.min(W.map.W - 0.6, bx)); by = Math.max(0.6, Math.min(W.map.H - 0.6, by));
    if (boxRock(W, bx, by, u.r)){ bx = c.x; by = c.y; }
    setMood(W, u, '숨어 돌아감', c.i); goTo(W, u, bx, by, dt); return true;
  }
  const r = assnStep(W, u, c, dt);
  if (r === 'go' || r === 'move'){ S.blockT = null; return true; }
  if (S.blockT == null) S.blockT = W.t;
  if (W.t - S.blockT > (H.wait || 2.5)){ end(r); return false; }
  stop(u); u.fg = Math.atan2(c.y - u.y, c.x - u.x); setMood(W, u, '숨어 틈을 봄', c.i); return true;
}
// v7.6 암살: 숨은 채 (은신 · 매복 · 어둠 속 우회)""")
# resolveAct
s=rep(s,"""  if (u.act.k === 'assn'){ resolveAssn(W, u); return; }   // v7.6""","""  if (u.act.k === 'assn'){ resolveAssn(W, u); return; }   // v7.6
  if (u.act.k === 'supp'){ resolveSupp(W, u); return; }   // v7.7 견제사격""")
# stepShots: 견제 탄 (노린 상대 없음) · 스침 · 날아온 방향
s=rep(s,"""      let hit = null, hk = 2;
      for (const b of W.units){
        if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue;   // v6.7 이미 피한 몸은 지나감
        const k = Math.max(0, Math.min(1, ((b.x - s.x) * s.dx + (b.y - s.y) * s.dy) / st));
        if (Math.hypot(b.x - (s.x + s.dx * st * k), b.y - (s.y + s.dy * st * k)) <= b.r && k < hk){ hk = k; hit = b; }
      }""","""      let hit = null, hk = 2, nearL = null; const NM = (SUP(W) || {}).near || 0.6;
      for (const b of W.units){
        if (!b.alive || b.i === s.a || (s.ev && s.ev.includes(b.i))) continue;   // v6.7 이미 피한 몸은 지나감
        const k = Math.max(0, Math.min(1, ((b.x - s.x) * s.dx + (b.y - s.y) * s.dy) / st)), dd = Math.hypot(b.x - (s.x + s.dx * st * k), b.y - (s.y + s.dy * st * k));
        if (dd <= b.r && k < hk){ hk = k; hit = b; }
        else if (dd <= b.r + NM && b.side !== s.side && !(s.nm && s.nm.includes(b.i))) (nearL || (nearL = [])).push(b);   // v7.7 스침
      }
      if (nearL && !hit && SUP(W)) for (const b of nearL){ (s.nm || (s.nm = [])).push(b.i); if (s.supp) b.pinT = Math.max(b.pinT || 0, W.t + (SUP(W).pin || 0.6)); incoming(W, b, s); }""")
s=rep(s,"""        const o2 = strike(W, u, hit, W.units[s.meant], hit.i === s.meant""","""        if (hit.side !== s.side){ incoming(W, hit, s); if (s.supp && s.so) s.so.hits = (s.so.hits || 0) + 1; }   // v7.7
        const o2 = strike(W, u, hit, s.meant != null ? W.units[s.meant] : hit, hit.i === s.meant""")
s=rep(s,"""      if (rock(W.map, nx, ny)){ s.done = true; u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: '빗나가 바위에 맞음', fired: true, p: s.p });""","""      if (rock(W.map, nx, ny)){ s.done = true; if (!s.supp){ u.miss++; L(W, { k: 'miss', a: s.a, b: s.meant, why: '빗나가 바위에 맞음', fired: true, p: s.p }); }""")
s=rep(s,"""      if (s.left <= 1e-6){ s.done = true; u.miss++; const m = W.units[s.meant],""","""      if (s.left <= 1e-6 && s.supp){ s.done = true; break; }   // v7.7 견제 탄은 자리 너머에서 끝
      if (s.left <= 1e-6){ s.done = true; u.miss++; const m = W.units[s.meant],""")
# preempt · interrupt
s=rep(s,"""  const mv = o && (o.k === 'move' || o.k === 'amove' || o.k === 'hold' || o.k === 'lret' || o.k === 'scout');""","""  const mv = o && (o.k === 'move' || o.k === 'amove' || o.k === 'hold' || o.k === 'watch' || o.k === 'lret' || o.k === 'scout');""")
s=rep(s,"""  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload', 'palm', 'assn'].includes(a.k)""","""  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload', 'palm', 'assn', 'supp'].includes(a.k)""")
s=rep(s,"""  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal', 'palm', 'assn'].includes(a.k)""","""  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal', 'palm', 'assn', 'supp'].includes(a.k)""")
s=rep(s,"""|| (o.k === 'assn' && a.k === 'assn')""","""|| (o.k === 'assn' && a.k === 'assn') || (o.k === 'supp' && a.k === 'supp')""")
# doOrder: 견제사격 · 사주경계
s=rep(s,"""  if (o.k === 'assn'){ assnOrder(W, u, dt); return; }   // v7.6 암살""","""  if (o.k === 'assn'){ assnOrder(W, u, dt); return; }   // v7.6 암살
  if (o.k === 'supp'){ suppStep(W, u, dt, o, () => { u.order = null; u.stay = { x: u.x, y: u.y }; }); return; }   // v7.7 견제사격""")
s=rep(s,"""  if (o.k === 'hold'){
    // 제자리 = 지키는 자세""","""  if (o.k === 'hold' || o.k === 'watch'){   // v7.7 사주경계 = 제자리 + 정한 바깥쪽을 봄 (자주 돌아봄)
    // 제자리 = 지키는 자세""")
s=rep(s,"""      if (t){ const op = openingOf(W, u, t); if (op || W.rand() < dt * u.bold * 0.6){ startAct(W, u, t, op === '틈' ? '틈을 노림' : op === '측면' ? '측면 공격' : '공격'); return; } u.waitT += dt; }
      setMood(W, u, seen.length ? '지킴' : '', seen[0] ? seen[0].i : null);""","""      if (t){ const op = openingOf(W, u, t); if (op || W.rand() < dt * u.bold * 0.6){ startAct(W, u, t, op === '틈' ? '틈을 노림' : op === '측면' ? '측면 공격' : '공격'); return; } u.waitT += dt; }
      if (o.k === 'watch' && !t){ u.fg = o.f; setMood(W, u, '사주경계'); return; }
      setMood(W, u, seen.length ? '지킴' : '', seen[0] ? seen[0].i : null);""")
s=rep(s,"""    if (seen.length){ u.waitT += dt; if (ffBlock) setMood(W, u, '사선에 아군', ffBlock.i); else setMood(W, u, '지킴', seen[0].i); } else setMood(W, u, '');""","""    if (seen.length){ u.waitT += dt; if (ffBlock) setMood(W, u, '사선에 아군', ffBlock.i); else setMood(W, u, '지킴', seen[0].i); } else if (o.k === 'watch'){ u.fg = o.f; setMood(W, u, '사주경계'); } else setMood(W, u, '');""")
s=rep(s,"""const orderTxt = (o, u) => o && o.k === 'assn' ? ['assn', o.b] :""","""const orderTxt = (o, u) => o && o.k === 'supp' ? ['supp', +o.x.toFixed(2), +o.y.toFixed(2)] : o && o.k === 'watch' ? ['watch', +o.f.toFixed(2)] : o && o.k === 'assn' ? ['assn', o.b] :""")
# act2: 적 사수의 견제사격 · 적 암살조
s=rep(s,"""  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠
""","""  if (pinDown(W, u, dt)) return;   // v5.2 쓰러진 [불사] 를 눌러 둠
  if (u.side === 1 && (u.shadow || u.shadowPend) && shadowStep(W, u, dt)) return;   // v7.7 적 암살조
  if (u.side === 1 && (u.supp || u.suppPend) && suppAct(W, u, dt)) return;   // v7.7 적 사수의 견제사격 (지휘관이 시킴)
""")
# 암살조 · 견제 중인 몸은 다른 일에 끌려가지 않음
s=rep(s,"""const pactFree = (W, u) => u.alive && !u.crawl && !u.pact &&""","""const pactFree = (W, u) => u.alive && !u.crawl && !u.pact && !u.shadow && !u.supp &&""")
s=rep(s,"""const mvFree = (W, u) => u.alive && u.side === 1 && !u.crawl &&""","""const mvFree = (W, u) => u.alive && u.side === 1 && !u.shadow && !u.supp && !u.crawl &&""")
s=rep(s,"""const lineAuto = (W, u) => !u.order && !isFar(u) && !u.pack && !u.stalk &&""","""const lineAuto = (W, u) => !u.order && !u.shadow && !isFar(u) && !u.pack && !u.stalk &&""")
s=rep(s,"""  const cand = E.filter(e => !isFar(e) && e.role !== '전선' && !e.pack && !e.stalk &&""","""  const cand = E.filter(e => !isFar(e) && !e.shadow && e.role !== '전선' && !e.pack && !e.stalk &&""")
# 틱
s=rep(s,"""dinTick(W); posKnownTick(W); }""","""dinTick(W); posKnownTick(W); planShadow(W); suppAI(W); }""")
s=rep(s,"""  assnFoundTick(W);   // v7.6 암살당한 시신을 동료가 봄""","""  assnFoundTick(W);   // v7.6 암살당한 시신을 동료가 봄
  watchTick(W);   // v7.7 사주경계 (뒤돌아봄)""")
s=rep(s,"""module.exports = { clearSee,""","""module.exports = { sideV, watchTick, suppStep, suppAI, suppAct, incoming, launchAt, planShadow, shadowStep, clearSee,""")
open(p,'w').write(s)
print('ok')
