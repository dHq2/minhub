# v8.7.8 엔진 — patch8780.py v1.7 (v1.7: 딱 · 딱딱딱 천둥은 부위가 없음 — 늘 몸통 (strike 의 extra.part · 2D 엔 부위가 없는데 머리 ×2 · 치명이 겹쳐 세자르를 한 번에 지우던 것) · v1.6: 딱 · 딱딱딱 천둥은 급소 · 상처 · 부위 파괴가 없음 (noWound — 화살처럼 "머리에 박힘 — 즉사" 가 걸리던 것 · 2D 의 천둥은 피해 + 감전 + 경직만) · v1.5: 명령으로 쓰는 굿윌 기술도 굿윌 방식으로 (내려찍기는 뛰어오름 · 손바닥은 표식) · 천둥을 피한 기록 how 'zap' · v1.4: 싸움을 시작할 때 기술마다 대기 (2D g.cd 처음 값 그대로 — 손바닥 2 · 니킥 1.2 · 딱 3 · 딱딱딱 2 · 내려찍기 5 · 올려차기 1초) · v1.3: 감전으로 쓰러지면 감전도 바로 사라짐 · v1.2: 2D 판정 그대로 — 딱 · 딱딱딱은 원거리 번개 (피하고 · 방패로 막을 수 있음 · 갑옷만 무시 — 2D ranged) · 니킥 헤드샷은 막기도 무시 (2D forceCrit) · 내려찍기는 한 명씩 피할 수 있음 (2D eva) · 피하거나 막으면 감전 · 경직도 없음 · v1.1: 내려찍기로 떠 있는 동안 슈퍼아머 (saT — 휘청 · 넘어짐 · 밀림 없음, 2D 와 같이 아무것도 닿지 않음) · 돌격은 공중에 뜬 몸 밑으로 지나감 (부딪힘 판정 제외 — 공중제비 · 내려찍기 모두) · v1.0: 굿윌 (명세 C5 — 2D 미궁 프롤로그 goodwillBrain · gwAct · GW 표 그대로): 순간이동 도약 · 사각 (등 뒤 근접은 막지 못함) · 손바닥 · 니킥 (빈틈이면 헤드샷 60% — 확정 치명 · 갑옷 무시 · 넘어뜨림) · 딱 · 딱딱딱 · 내려찍기 (떠 있는 동안 무적) · 올려차기 · 피하며 반격 · 맨손일 때만 ·
#   감전 한 틀 (u.zap — 푸른 번개 · 적뢰 · 잔류: 1초마다 피해 × 중첩 · 최대 5 · 센 쪽이 덮음 — 예전엔 페이지의 적뢰만 jrSh 로 따로 셈))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8770.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 수치표: 굿윌 (GW) · 감전 ----------
rep("  dcounter: { delay: 0.12, reach: 0.8 },",
    "  dcounter: { delay: 0.12, reach: 0.8 },\n"
    "  gw: { lo: 3, hi: 5, dive: 2.6, evade: 0.55, circle: 1.7, hop: 2.8, hopT: 0.16, skillP: 3, diveD: 5.5, cd0: { gpalm: 2, knee: 1.2, snap: 3, snap3: 2, gslam: 5, rise: 1 } },   /* v8.7.8 굿윌 (2D GW.kite): cd0 = 싸움 시작 때 기술 대기 (2D g.cd 처음 값) · 평소 3 ~ 5칸 · 2.6초마다 등 뒤로 파고듦 · 치려 하면 0.55초마다 쓩 · 1.7초마다 사각으로 옮겨 다님 · 한 번 도약 2.8칸 (0.16초 — 그 사이 피함) · 기술은 초당 skillP 확률로 고름 */\n"
    "  zap: { blue: [6, 4, '감전: 푸른 번개'], red: [10, 5, '감전: 적뢰'], res: [5, 5, '잔류'], redHalf: [7, 5, '감전: 적뢰 (약)'], resHalf: [4, 5, '잔류 (약)'], max: 5 },   /* v8.7.8 감전 한 틀 (2D SHOCKS): [초당 피해 · 초 · 이름] · 겹치면 중첩 (max 까지 · 피해 × 중첩) · 센 쪽이 약한 쪽을 덮음 */")
rep("  spec: { blink: { d: 9, min: 2.5, wind: 0.35, rec: 0.25, cd: 5, behind: 0.4 },",
    "  spec: { gpalm: { rng: 4.5, min: 0.8, wind: 0.45, slip: 0.9, mul: 2.6, miss: 0.9, kb: 1.2, rec: 0.35, cd: 7 }, knee: { rng: 6, min: 1.3, wind: 0.35, mul: 3, head: 1.67, headP: 0.6, stun: 1, down: 2.2, downW: 600, rec: 0.3, cd: 6 }, snap: { rng: 7, min: 2.2, wind: 0.3, mul: 2.4, stun: 0.5, rec: 0.25, cd: 6 }, snap3: { rng: 7, min: 1.8, wind: 0.25, mul: 0.75, stun: 0.25, n: 3, gap: 0.22, rec: 0.25, cd: 4 }, gslam: { rng: 5, min: 0, wind: 0.2, time: 0.55, r: 2.5, mul: 1.6, stun: 1.4, rec: 0.35, cd: 7 }, rise: { rng: 1.5, min: 0, wind: 0.25, mul: 1.5, downP: 0.35, down: 0.9, downW: 600, rec: 0.3, cd: 4.5 },   /* v8.7.8 굿윌 (2D GW 표 그대로 — 거리는 몸 가운데끼리) */\n"
    "    blink: { d: 9, min: 2.5, wind: 0.35, rec: 0.25, cd: 5, behind: 0.4 },")
rep("'방어모드': 'stone', '바위던지기': 'boulder' };",
    "'방어모드': 'stone', '바위던지기': 'boulder', '손바닥': 'gpalm', '니킥': 'knee', '딱': 'snap', '딱딱딱': 'snap3', '내려찍기': 'gslam', '올려차기': 'rise' };   /* v8.7.8 굿윌 */")

# ---------- 몸: 굿윌 표식 ----------
rep("U.dcounter = Math.max(0, Math.min(1, +p.dcounter || 0));",
    "U.dcounter = Math.max(0, Math.min(1, +p.dcounter || 0)); U.gwKit = (p.unique || []).includes('푸른 번개'); if (U.gwKit){ U.flanker = true; U.gw = null; const C0 = (rules.gw || {}).cd0 || {}; for (const x of U.spec || []) if (C0[x.k] != null) x.cdT = (W.t || 0) + C0[x.k]; }   /* v8.7.8 굿윌 — 사각 (등 뒤 근접은 막지 못함) · 싸움을 시작할 때 기술마다 대기 (2D) */")

# ---------- 기술: 맨손일 때만 · 고르기 · 풀기 ----------
rep("if (x.n != null && x.n <= 0) return false;",
    "if (x.n != null && x.n <= 0) return false; if (GW_K.includes(k) && !gwOn(u)) return false;   /* v8.7.8 굿윌의 기술은 맨손일 때만 */")
rep("function resolveSpec(W, u){\n  const A = u.act, k = A.s, S = SPR(W, k), t = A.b != null ? W.units[A.b] : null;",
    "function resolveSpec(W, u){\n  const A = u.act, k = A.s, S = SPR(W, k), t = A.b != null ? W.units[A.b] : null;\n  if (GW_K.includes(k)){ gwResolve(W, u, A, S, t); return; }   /* v8.7.8 굿윌 */")
rep("  if (u.h2 && !u.order && h2Brain(W, u, dt)) return;   /* v8.7.4 3D 보스 기술표 */",
    "  if (u.h2 && !u.order && h2Brain(W, u, dt)) return;   /* v8.7.4 3D 보스 기술표 */\n"
    "  if (u.gwKit && !u.order && gwBrain(W, u, dt)) return;   /* v8.7.8 굿윌 (2D goodwillBrain) */")
rep("  if (u.act && (u.act.k === 'leap' || u.act.k === 'dodge')){ stepLeap(W, u, dt); return; }",
    "  if (u.act && u.act.k === 'gwHop'){ gwHopStep(W, u); return; }   /* v8.7.8 굿윌 순간이동 도약 */\n"
    "  if (u.act && (u.act.k === 'leap' || u.act.k === 'dodge')){ stepLeap(W, u, dt); return; }")
rep("  if (q >= 1){ if (A.slam) slamHit(W, u, A); u.act = null;",
    "  if (q >= 1){ if (A.slam) slamHit(W, u, A); if (A.gslam) gslamHit(W, u, A); u.act = null;")
rep("  if (u.act && ['leap', 'dodge', 'palm'].includes(u.act.k)) return 0;",
    "  if (u.act && u.act.k === 'gwHop') return 1;   /* v8.7.8 굿윌: 도약하는 동안엔 피함 (2D — 이동 = 회피) */\n"
    "  if (u.act && ['leap', 'dodge', 'palm'].includes(u.act.k)) return 0;")
rep("  if (!unarmed(u) || u.noArms || u.crawl) return false;",
    "  if (!unarmed(u) || u.noArms || u.crawl || u.gwKit) return false;   /* v8.7.8 굿윌은 맨손일 때 가장 셈 — 스스로 무기를 줍지 않음 */")

# ---------- 타격: 사각 · 갑옷 무시 ----------
rep("!exFail && !(extra && extra.grab) && inGuard(W, t, u, o.far || !!J)",
    "!exFail && !(extra && extra.grab) && !(u.flanker && dir === 'back' && !o.far && !J) && inGuard(W, t, u, o.far || !!J)")   # v8.7.8 사각: 등 뒤에서 친 근접은 막지 못함 (굿윌)
rep("armMul = (gapHit && !PNR ? 1 - (1 - AM.m) * 0.5 : AM.m) * (wk === '총포류' && !t.human ? (R.gunTough != null ? R.gunTough : 1) : 1);",
    "armMul = extra && extra.noArmor ? 1 : (gapHit && !PNR ? 1 - (1 - AM.m) * 0.5 : AM.m) * (wk === '총포류' && !t.human ? (R.gunTough != null ? R.gunTough : 1) : 1);   /* v8.7.8 갑옷 무시 (굿윌 니킥 헤드샷) */")
rep("if (HM || HP) part = '머리';", "if (HM || HP) part = '머리'; if (extra && extra.part) part = extra.part;   /* v8.7.8 부위를 정한 피해 (천둥 — 부위가 없음) */")

# ---------- 돌격은 공중에 뜬 몸 밑으로 지나감 ----------
rep("  const hit = W.units.filter(f => f.alive && f.side !== u.side && !(A.ev && A.ev.includes(f.i)) && dist(f, u) <= f.r + u.r + (u.giant ? 0.2 : 0.06)).sort((a, b) => dist(a, u) - dist(b, u))[0];",
    "  const hit = W.units.filter(f => f.alive && f.side !== u.side && !(A.ev && A.ev.includes(f.i)) && !(f.act && f.act.k === 'leap' && f.act.air) && dist(f, u) <= f.r + u.r + (u.giant ? 0.2 : 0.06)).sort((a, b) => dist(a, u) - dist(b, u))[0];   /* v8.7.8 공중에 뜬 몸 (공중제비 · 내려찍기) 밑으로는 지나감 */")

# ---------- 명령으로 쓰는 굿윌 기술 ----------
rep("    if (specReady(W, u, o.s) && gap(u, t) <= reach && (o.s === 'flip' ? startFlip(W, u, t, false) : startSpec(W, u, t, o.s, '명령'))){ u.order = null; return; }",
    "    if (specReady(W, u, o.s) && gap(u, t) <= reach && (o.s === 'flip' ? startFlip(W, u, t, false) : GW_K.includes(o.s) ? gwStart(W, u, t, o.s, '명령') : startSpec(W, u, t, o.s, '명령'))){ u.order = null; return; }   /* v8.7.8 굿윌 기술은 굿윌 방식으로 (내려찍기 = 뛰어오름 · 손바닥 = 표식 · 니킥 = 반동) */")

# ---------- 감전 한 틀 ----------
rep("  for (const u of W.units) if (u.alive && u.burn) stepBurn(W, u, dt);   // v6.7 화상",
    "  for (const u of W.units) if (u.alive && u.burn) stepBurn(W, u, dt);   // v6.7 화상\n"
    "  zapTick(W);   /* v8.7.8 감전 (푸른 번개 · 적뢰 · 잔류) */")

GW = r'''
/* ---------- v8.7.8 감전 한 틀 (2D SHOCKS · applyShock 그대로): 1초마다 피해 × 중첩 (최대 max) · 새로 걸리면 중첩 +1 · 남은 초는 긴 쪽 · 센 쪽 이름으로 ----------
   예전엔 페이지의 적뢰 (run8_e jrShock) 만 따로 셈 — 이제 적뢰 (red · res …) 와 굿윌의 푸른 번개 (blue) 가 같은 틀 */
function zapOn(W, o, kind, src){
  const Z = W.rules.zap || {}, K = Z[kind]; if (!K || !o || !o.alive) return null; const s = o.zap;
  if (s && s.n > 0){ if (K[0] > ((Z[s.kind] || [0])[0])) s.kind = kind; s.st = Math.min(Z.max || 5, s.st + 1); s.n = Math.max(s.n, K[1]); }
  else o.zap = { kind, n: K[1], st: 1, next: W.t + 1, src: src ? src.i : o.i };
  const z = o.zap; if (z.st >= 3 || !s) L(W, { k: 'zap', a: src ? src.i : null, b: o.i, kind: z.kind, st: z.st, n: z.n, dps: K[0] * z.st, vis: o.side === 0 || !!o.seenBy || (src && src.side === 0) });
  return z;
}
function zapTick(W){
  const Z = W.rules.zap || {};
  for (const o of W.units){ const s = o.zap; if (!s) continue; if (!o.alive){ o.zap = null; continue; } if (W.t < s.next) continue;
    s.next = W.t + 1; s.n--; const K = Z[s.kind] || [5, 1], src = W.units[s.src] || o;
    applyDmg(W, src, o, Math.max(1, K[0] * s.st), { tag: '감전', dot: true, jrOwn: /red|res/.test(s.kind), ff: src.side === o.side });
    if (s.n <= 0 || !o.alive) o.zap = null; }
}
/* ---------- v8.7.8 굿윌 (명세 C5 — 2D 미궁 프롤로그 goodwillBrain · gwAct · GW 표 그대로) ----------
   맨손일 때만 (가장 셈) — 무기를 들면 보통 근접처럼 싸움 (기술 · 도약 없음). 평소 3 ~ 5칸에서 전기로 괴롭히며 상대의 옆 · 뒤 (사각) 로 팟팟 옮겨 다님 ·
   상대가 치려 하면 이미 뒤로 쓩 · 2.6초마다 등 뒤로 파고들어 한두 대 치고 빠짐 (상대가 휘청이면 한 대 더) · 기술은 대기 · 거리가 맞으면 무작위 (틈이면 거의 니킥 · 멀거나 뭉쳤으면 내려찍기 · 떨어져 있으면 딱).
   이 판에 맞춘 것: 도약은 0.16초 안에 몸이 옮겨 가는 짧은 순간이동 (그 사이 근접 · 탄을 피함) · 벽 너머로는 못 감 · 모양 · 막기 · 갑옷 · 급소는 이 판의 규칙 (strike) — 양쪽 같음 */
const GW_K = ['gpalm', 'knee', 'snap', 'snap3', 'gslam', 'rise'];
const gwOn = u => !!u.gwKit && !u.noArms && (unarmed(u) || u.weaponGone);
const gwKnown = (W, u) => W.units.filter(f => f.alive && !f.gone && !f.down && f.side !== u.side && (canSee(W, u, f) || (u.sense[f.i] && W.t - u.sense[f.i].t < 3)));
function gwFree(W, u, x, y){
  return x > u.r && y > u.r && x < W.map.W - u.r && y < W.map.H - u.r && !boxRock(W, x, y, u.r * 0.9) && fatClear(W.map, u.x, u.y, x, y, u.r * 0.6) && !W.units.some(o => o.alive && o !== u && !o.gone && Math.hypot(o.x - x, o.y - y) < o.r + u.r * 0.85);
}
// 노린 자 반대쪽 (조금 옆으로) L칸
function gwAway(W, u, o, L){
  const d = dist(u, o) || 1, nx = (u.x - o.x) / d, ny = (u.y - o.y) / d;
  for (const sd of [0, 0.6, -0.6, 1.2, -1.2]){ const c = Math.cos(sd), s = Math.sin(sd), dx = nx * c - ny * s, dy = nx * s + ny * c, x = u.x + dx * L, y = u.y + dy * L; if (gwFree(W, u, x, y)) return { x, y }; }
  return null;
}
// 사각: 노린 자의 옆 · 뒤 L칸 (back = 등 뒤 먼저 · 아니면 옆 뒤부터)
function gwBlind(W, u, t, L, back){
  const f = t.face || 0, side = Math.sign(Math.sin(Math.atan2(u.y - t.y, u.x - t.x) - f)) || (W.rand() < 0.5 ? 1 : -1);
  const angs = back ? [Math.PI, Math.PI * 0.75 * side, -Math.PI * 0.75 * side, Math.PI * 0.5 * side, -Math.PI * 0.5 * side] : [Math.PI * 0.75 * side, Math.PI * 0.5 * side, Math.PI, -Math.PI * 0.75 * side, -Math.PI * 0.5 * side];
  for (const a of angs){ const D0 = L + t.r + u.r, x = t.x + Math.cos(f + a) * D0, y = t.y + Math.sin(f + a) * D0; if (Math.hypot(x - u.x, y - u.y) > 0.6 && gwFree(W, u, x, y)) return { x, y }; }
  return null;
}
// 순간이동 도약 (0.16초): 그 사이 근접 · 탄을 피함 (evadeP)
function gwHop(W, u, p, why, t, then){
  if (!p || u.kb || prone(W, u) || W.t < (u.stunT || -9)) return false; const G = W.rules.gw || {};
  u.act = { k: 'gwHop', phase: 'run', t0: W.t, end: W.t + (G.hopT || 0.16), fx: u.x, fy: u.y, tx: p.x, ty: p.y, b: t ? t.i : null, then: then || null }; stop(u); u.waitT = 0;
  if (t) u.fg = Math.atan2(t.y - p.y, t.x - p.x);
  L(W, { k: 'gwHop', a: u.i, b: t ? t.i : null, d: +Math.hypot(p.x - u.x, p.y - u.y).toFixed(1), why: why || '', vis: u.side === 0 || !!u.seenBy });
  if (why) setMood(W, u, why, t ? t.i : null); if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t, gw: true });
  return true;
}
function gwHopStep(W, u){
  const A = u.act, q = Math.min(1, (W.t - A.t0) / Math.max(0.01, A.end - A.t0)); u.x = A.fx + (A.tx - A.fx) * q; u.y = A.fy + (A.ty - A.fy) * q;
  if (q < 1) return; u.act = null; const t = A.b != null ? W.units[A.b] : null; if (t && t.alive) u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x);
  if (A.then === 'atk' && t && t.alive && inReach(u, t)){ u.target = t; startAct(W, u, t, '등 뒤로 파고들어 침'); }
}
// 기술 고르기 (2D 무게 그대로): 내려찍기 (멀거나 뭉쳤으면 둘) · 손바닥 · 니킥 (틈이면 넷 · 멀면 둘) · 올려차기 · 딱 (멀면 둘) · 딱딱딱 (멀면 셋)
function gwSkill(W, u, t, d){
  const can = k => { const S = SPR(W, k); return specReady(W, u, k) && d <= (S.rng || 1.5) + 1e-6 && d >= (S.min || 0); };
  const near = W.units.filter(o => o.alive && o.side !== u.side && Math.hypot(o.x - t.x, o.y - t.y) < (SPR(W, 'gslam').r || 2.5)).length, open = gwOpen(W, t), O = [];
  if (can('gslam')) O.push('gslam', ...(near >= 2 || d >= 2.5 ? ['gslam'] : []));
  if (can('gpalm')) O.push('gpalm');
  if (can('knee')) O.push(...(open ? ['knee', 'knee', 'knee', 'knee'] : d >= 2.2 ? ['knee', 'knee'] : ['knee']));
  if (can('rise')) O.push('rise');
  if (can('snap') && canSee(W, u, t)) O.push('snap', ...(d >= 3 ? ['snap'] : []));
  if (can('snap3') && canSee(W, u, t)) O.push('snap3', ...(d >= 3 ? ['snap3', 'snap3'] : []));
  if (!O.length) return false;
  return gwStart(W, u, t, O[Math.floor(W.rand() * O.length)]);
}
const gwOpen = (W, t) => !!(t.act && t.act.phase === 'wind') || W.t < (t.stunT || -9) - 0.1 || prone(W, t);   // 틈 (공격 준비 중 · 휘청 · 넘어짐)
function gwStart(W, u, t, k, why){
  const S = SPR(W, k);
  if (k === 'gslam'){   // 뛰어올라 노린 자리로 날아가 내리꽂음 — 떠 있는 동안 무적
    const x = specOf(u, k); if (!x) return false; const pad = u.r + 0.2, m = W.map; let tx = Math.max(pad, Math.min(m.W - pad, t.x)), ty = Math.max(pad, Math.min(m.H - pad, t.y));
    const d0 = Math.hypot(tx - u.x, ty - u.y) || 1, back = Math.min(d0 - 0.01, t.r + u.r + 0.1); tx -= (tx - u.x) / d0 * back; ty -= (ty - u.y) / d0 * back;
    for (let i = 0; i < 6 && boxRock(W, tx, ty, u.r * 0.9); i++){ tx = u.x + (tx - u.x) * 0.8; ty = u.y + (ty - u.y) * 0.8; }
    if (boxRock(W, tx, ty, u.r * 0.9)) return false;
    u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (S.time || 0.55), fx: u.x, fy: u.y, tx, ty, dir: 'fwd', air: true, gslam: true, b: t.i, r: S.r || 2.5 };
    u.jrInv = W.t + (S.time || 0.55); u.saT = Math.max(u.saT || -9, u.jrInv); x.cdT = W.t + (S.cd || 7); stop(u); u.fg = u.face = Math.atan2(ty - u.y, tx - u.x);   // 떠 있는 동안 무적 · 슈퍼아머 (2D 그대로)
    L(W, { k: 'gslam', a: u.i, b: t.i, x: +tx.toFixed(2), y: +ty.toFixed(2), vis: u.side === 0 || !!u.seenBy || !!t.seenBy }); setMood(W, u, why || '내려찍기 — 뛰어오름', t.i);
    return true;
  }
  startSpec(W, u, t, k, why || SPEC_NM(k)); const A = u.act;
  if (k === 'gpalm'){ A.mx = t.x; A.my = t.y; if (W.fxOn) W.fx.push({ k: 'gwMark', x: t.x, y: t.y, t0: W.t, dur: S.wind || 0.45 }); }   // 노린 자리에 푸른 표식 — 그 사이 0.9칸 넘게 벗어나면 빗나감
  if (k === 'knee'){ const op = gwOpen(W, t); A.crit = W.rand() < (op ? (S.headP || 0.6) : 0.25); A.op = op;   // 빈틈이면 헤드샷 60%
    if (dist(u, t) < 4.2){ const p = gwAway(W, u, t, 1.4); if (p){ u.x = p.x; u.y = p.y; } }   // 반동을 위한 뒷걸음 (팟)
    if (op) L(W, { k: 'gwOpen', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); }
  return true;
}
// 맞힘 (이 판의 strike — 막기 · 갑옷 · 급소 그대로)
function gwHit(W, u, t, mul, ex){ if (!t || !t.alive) return null; return strike(W, u, t, t, 1, !!(ex && ex.far), { mul, wk: '마법', noFire: true, ...(ex || {}) }); }
function gwResolve(W, u, A, S, t){
  const k = A.s, vis = u.side === 0 || !!u.seenBy || !!(t && t.seenBy);
  if (k === 'snap3' && A.phase === 'run'){   // 딱딱딱: 약한 천둥 세 번 (gap 초 간격)
    if (t && t.alive && canSee(W, u, t)){ gwZap(W, u, t, false); if (!gwDodge(W, t, u)){ const o = gwHit(W, u, t, S.mul || 0.75, { far: true, noArmor: true, noWound: true, part: '몸통', tag: '딱딱딱 — 천둥' }); if (t.alive && !(o && o.block)){ zapOn(W, t, 'blue', u); stun(W, t, S.stun || 0.25, u.i); } } }
    A.left--; if (A.left > 0 && t && t.alive){ A.end = W.t + (S.gap || 0.22); return; }
    A.phase = 'rec'; A.end = W.t + (S.rec || 0.25); return;
  }
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + (S.rec || 0.3); A.t1 = W.t; u.atkT = W.t;
  if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
  const d = dist(u, t);
  if (k === 'gpalm'){   // 손바닥: 표식이 뜬 사이 벗어났으면 허공 — 굿윌이 빈틈 / 아니면 순간이동하듯 붙어 터트림 (붙잡힌 동안 경직 · 회피 · 막기 무시)
    const slip = Math.hypot(t.x - A.mx, t.y - A.my) > (S.slip || 0.9), tx = slip ? A.mx : t.x, ty = slip ? A.my : t.y, dd = Math.hypot(tx - u.x, ty - u.y) || 1, nx = (tx - u.x) / dd, ny = (ty - u.y) / dd;
    const p = { x: tx - nx * (t.r + u.r + 0.05), y: ty - ny * (t.r + u.r + 0.05) }; if (gwFree(W, u, p.x, p.y)){ if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t, gw: true }); u.x = p.x; u.y = p.y; }
    u.fg = u.face = Math.atan2(ty - u.y, tx - u.x);
    if (slip || gap(u, t) > 0.6){ L(W, { k: 'gwMiss', a: u.i, b: t.i, s: k, vis }); u.stunT = Math.max(u.stunT || -9, W.t + (S.miss || 0.9)); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '빗나감 — 빈틈!', c: 'v', t0: W.t }); return; }
    stun(W, t, 0.35, u.i); const o = gwHit(W, u, t, S.mul || 2.6, { grab: true, tag: '손바닥 — 붙잡아 터트림' });
    if (t.alive){ zapOn(W, t, 'blue', u); if (!t.kb) shove(W, u, t, S.kb || 1.2, t.x - u.x, t.y - u.y, { tag: '손바닥에 튕겨 나감' }); }
    L(W, { k: 'gwPalm', a: u.i, b: t.i, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '파직!', c: 'b', t0: W.t }); return;
  }
  if (k === 'knee'){   // 니킥: 보이지 않는 속도로 옆 · 뒤 (사각) 에 꽂힘 — 헤드샷 = 확정 치명 · 갑옷 무시 · 무게 600 아래는 넘어짐
    const f = t.face || 0, sd = Math.sign(Math.sin(Math.atan2(u.y - t.y, u.x - t.x) - f)) || 1, D0 = t.r + u.r + 0.05;
    let q = null; for (const a of [Math.PI * 0.6 * sd, Math.PI * 0.5 * sd, Math.PI, 0]){ const x = t.x + Math.cos(f + a) * D0, y = t.y + Math.sin(f + a) * D0; if (gwFree(W, u, x, y) || Math.hypot(x - u.x, y - u.y) < 0.3){ q = { x, y }; break; } }
    if (q && Math.hypot(q.x - u.x, q.y - u.y) <= (S.rng || 6) + 1){ if (W.fxOn) W.fx.push({ k: 'ghost', a: u.i, x: u.x, y: u.y, t0: W.t, gw: true }); u.x = q.x; u.y = q.y; }
    u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x);
    if (gap(u, t) > 0.7){ L(W, { k: 'miss', a: u.i, b: t.i, why: '니킥 — 닿지 않음', spec: k }); return; }
    if (t.side !== u.side && !A.crit && evadeMelee(W, t, u)) return;
    const o = gwHit(W, u, t, A.crit ? (S.head || 1.67) : (S.mul || 3), A.crit ? { crit: true, noArmor: true, headP: 1, grab: true, tag: '니킥 — 헤드샷' } : { tag: '니킥' });
    if (t.alive && !(o && o.block)){ stun(W, t, S.stun || 1, u.i); if (A.crit && (t.mass || 70) <= (S.downW || 600)) knockDown(W, t, S.down || 2.2, u.i, '니킥 헤드샷'); }
    L(W, { k: 'gwKnee', a: u.i, b: t.i, head: !!A.crit, op: !!A.op, vis }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: A.crit ? '빠아악!!' : '빠악!', c: 'd', t0: W.t }); return;
  }
  if (k === 'snap' || k === 'snap3'){   // 딱 · 딱딱딱: 손가락을 튕기면 Z자 천둥이 노린 자에게 곧장 (막을 수 없음 · 보이는 상대만)
    if (!canSee(W, u, t) || d > (S.rng || 7) + 1){ L(W, { k: 'miss', a: u.i, b: t.i, why: '천둥이 닿지 않음 (안 보임)', spec: k }); return; }
    if (k === 'snap3'){ A.phase = 'run'; A.left = S.n || 3; A.end = W.t; return; }
    gwZap(W, u, t, true); if (gwDodge(W, t, u)) return; const o = gwHit(W, u, t, S.mul || 2.4, { far: true, noArmor: true, noWound: true, part: '몸통', tag: '딱 — 천둥' });
    if (t.alive && !(o && o.block)){ zapOn(W, t, 'blue', u); stun(W, t, S.stun || 0.5, u.i); } return;
  }
  if (k === 'rise'){   // 올려차기: 붙은 상대를 차올림 — 35% 잠깐 넘어짐
    if (gap(u, t) > (S.rng || 1.5) - t.r - u.r + 0.4){ L(W, { k: 'miss', a: u.i, b: t.i, why: '올려차기 — 닿지 않음', spec: k }); return; }
    if (t.side !== u.side && evadeMelee(W, t, u)) return;
    const o = gwHit(W, u, t, S.mul || 1.5, { tag: '올려차기' });
    if (t.alive && !(o && o.block) && W.rand() < (S.downP || 0.35) && (t.mass || 70) <= (S.downW || 600)) knockDown(W, t, S.down || 0.9, u.i, '올려차기');
    L(W, { k: 'gwRise', a: u.i, b: t.i, vis }); return;
  }
}
// 번개를 피함 (2D: 천둥은 원거리 공격 — 피할 수 있음 · 이 판에선 빠른 탄처럼 (빠를수록 덜 피함) · 세자르는 탄처럼 거의 다 피함) — 피하면 감전 · 경직 없음
function gwDodge(W, t, u){ if (!t || !t.alive || t.side === u.side) return false; const p = evadeP(W, t, u, 'shot', { sp: 28 }); if (!p || W.rand() >= p) return false; L(W, { k: 'evade', a: u.i, b: t.i, how: 'zap', why: '천둥을 피함', p: +p.toFixed(2), vis: t.side === 0 || !!t.seenBy || u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '회피!', c: 'w', t0: W.t }); return true; }
function gwZap(W, u, t, big){ if (W.fxOn) W.fx.push({ k: 'zbolt', x: t.x, y: t.y, t0: W.t, big: !!big, a: u.i }); L(W, { k: 'gwZap', a: u.i, b: t.i, big: !!big, vis: u.side === 0 || !!u.seenBy || !!t.seenBy }); }
// 내려꽂음: 둘레 r 칸의 적 모두 감전 + 경직 (막으면 경직은 없음) · 내리꽂는 순간 번개 한 줄기
function gslamHit(W, u, A){
  const S = SPR(W, 'gslam'), R = A.r || S.r || 2.5; let n = 0; u.jrInv = null;
  if (W.fxOn){ W.fx.push({ k: 'zbolt', x: u.x, y: u.y, t0: W.t, big: true, a: u.i }); W.fx.push({ k: 'quake', x: u.x, y: u.y, r: R, t0: W.t }); }
  for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || Math.hypot(e.x - u.x, e.y - u.y) > R + e.r * 0.5 || (e.act && e.act.k === 'leap')) continue;
    if (!losClear(W.map, u.x, u.y, e.x, e.y)) continue; n++; if (evadeMelee(W, e, u)) continue;   // 2D: 한 명씩 피할 수 있음
    const o = gwHit(W, u, e, S.mul || 1.6, { tag: '내려찍기' }); if (e.alive){ zapOn(W, e, 'blue', u); if (!(o && o.block)) stun(W, e, S.stun || 1.4, u.i); } }
  L(W, { k: 'gslamHit', a: u.i, n, r: R, vis: true });
}
// 두뇌 (2D goodwillBrain): 치고 빠지기 · 사각으로 옮겨 다님 · 틈이면 니킥 — 맨손일 때만 (무기를 들면 보통 근접)
function gwBrain(W, u, dt){
  if (!gwOn(u) || u.act || u.kb || prone(W, u) || W.t < (u.stunT || -9) || u.crawl || u.lie) return false;
  const G = W.rules.gw || {}, g = u.gw || (u.gw = { evadeT: -9, diveT: W.t + 1.5, circleT: W.t + (G.circle || 1.7), hits: 0, dive: false, atk0: u.atkT || -9 });
  const F = gwKnown(W, u); if (!F.length){ g.dive = false; return false; }
  let t = u.target && u.target.alive && F.includes(u.target) ? u.target : F.slice().sort((a, b) => dist(u, a) - dist(u, b))[0]; u.target = t; u.state = u.side ? 'hunt' : 'fight';
  const d = dist(u, t);
  // 상대가 칠 땐 이미 뒤에 (나를 노리고 준비 중인 근접 · 그 손 + 1.2칸 안)
  const thr = W.units.find(o => o.alive && o.side !== u.side && o.act && o.act.phase === 'wind' && o.act.b === u.i && !isFar(o) && gap(o, u) < (o.rng || 0.5) + 1.2);
  if (thr && W.t >= g.evadeT){ const p = gwAway(W, u, thr, G.hop || 2.8); if (p && gwHop(W, u, p, '치려는 상대에게서 쓩', t)){ g.evadeT = W.t + (G.evade || 0.55); g.dive = false; return true; } }
  // 한 대 쳤다: 육탄전도 마다하지 않음 (상대가 휘청이면 한 대 더) — 아니면 바로 사각으로 빠짐
  if ((u.atkT || -9) > g.atk0){ g.atk0 = u.atkT; g.hits++;
    if (W.t >= g.evadeT && (g.hits >= 2 || (!gwOpen(W, t) && W.rand() < 0.6))){ g.dive = false; g.hits = 0; g.diveT = W.t + (G.dive || 2.6); g.evadeT = W.t + 0.3;
      const p = gwBlind(W, u, t, 3.4, false) || gwAway(W, u, t, 3); if (p && gwHop(W, u, p, '치고 빠짐', t)) return true; } }
  if (W.rand() < dt * (G.skillP || 3) && gwSkill(W, u, t, d)) return true;   // 기술 (대기 · 거리)
  if (g.dive) return false;   // 파고드는 중: 기본 공격에 맡김
  if (W.t >= g.diveT && d < (G.diveD || 5.5) && canSee(W, u, t)){ g.dive = true; g.hits = 0; const p = gwBlind(W, u, t, 0.05, true); if (p && gwHop(W, u, p, '등 뒤로 파고듦', t, 'atk')) return true; return false; }
  if (d < (G.lo || 3) && W.t >= g.evadeT){ const p = gwAway(W, u, t, 2.6); if (p && gwHop(W, u, p, '거리를 벌림', t)){ g.evadeT = W.t + (G.evade || 0.55); return true; } }
  if (W.t >= g.circleT && d <= (G.hi || 5) + 1){ g.circleT = W.t + (G.circle || 1.7) * (0.7 + W.rand() * 0.6); const p = gwBlind(W, u, t, 2.4 + W.rand() * 1.2, false); if (p && gwHop(W, u, p, '사각으로 옮겨 다님', t)) return true; }
  if (d <= (G.hi || 5) + 0.5 && canSee(W, u, t)){ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '중거리 — 간 보기', t.i); return true; }   // 3 ~ 5칸에서 기다리며 기술을 노림
  return false;   // 멀면 다가감 (보통 걸음)
}
'''
rep("// 스스로 쓰기 (적 · 아군 같은 판단 — 그 상황일 때만)\nfunction specAuto(W, u, t, see){",
    GW.strip('\n') + "\n// 스스로 쓰기 (적 · 아군 같은 판단 — 그 상황일 때만)\nfunction specAuto(W, u, t, see){")

# ---------- 내보내기 (시험) ----------
rep("if (typeof module !== 'undefined') module.exports = { startAlt,",
    "if (typeof module !== 'undefined') module.exports = { zapOn, zapTick, gwOn, gwHop, gwStart, gwBrain, gwAway, gwBlind, gslamHit, startAlt,")

for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8780 OK')
