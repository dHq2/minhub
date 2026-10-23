# v8.8.2 엔진 — patch8820.py v1.0 (v1.0: 옐로 업데이트 — 민수 "옐로는 특수잡기 … 연속 도약 … 돌진 … 양동이 뿌리기 … 기존 시스템에서 가능하면 응용")
#   응용한 것: 잡아찢기 (tear — 붙잡기 · 맞으면 놓침) → 달라붙기 난도질 (yclaw) / 핏빛 장판 (pool) → 양동이 뿌리기 (ybucket · 저주:맥아 장판)
#   돌진 (charge · 도움닫기 · fling) → 옐로의 돌진 (사족보행 · 느리게 출발해 끝에서 폭발 · 5칸 넘게 달리면 확정 밀침) / 도약 (leapN 2) → 연속 도약 (스스로 자주 뜀)
#   날붙이 손 (bladeHands) → 절삭력 (sharp: 갑옷이 막는 몫을 줄임) · 단단한 손 (hardHands: 맨팔로 막아도 안 잘림)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8810.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 수치표 ----------
rep("pool: { rng: 7, r: 2, t: 6, wind: 0.6, rec: 0.4, cd: 12, tick: 0.5, stacks: 1, slow: 0.7 },",
    "pool: { rng: 7, r: 2, t: 6, wind: 0.6, rec: 0.4, cd: 12, tick: 0.5, stacks: 1, slow: 0.7 }, "
    "yclaw: { rng: 1.3, wind: 0.3, rec: 0.5, hold: 2, cd: 14, tick: 0.2, mul: 0.26, fin: 2.5, brk: 0.2 }, "
    "ybucket: { rng: 4, r: 1.6, wind: 0.5, rec: 0.4, cd: 10, tick: 0.5, cost: 120, min: 60, tMin: 3, tMax: 10, slow: 0.55, melt: 0.3, dot: 2.5, linger: 1.5 },   "
    "/* v8.8.2 옐로: 달라붙기 난도질 (rng 칸 안 · hold 초 동안 tick 초마다 mul × 날붙이 · 마지막 한 번 × fin · 맞은 피해가 최대 체력의 brk 를 넘으면 놓침) · 양동이 뿌리기 (rng 칸 안 · 반지름 r · 양동이 약 cost 만큼 쓰고 남은 약에 따라 tMin ~ tMax 초 · 걸음 × slow · 받는 피해 +melt · 초당 dot × 2) */")
rep("  fbuf: { on: 0, arc: 20,",
    "  claw: { sharp: 0.35, rush: { wind: 0.2, min: 1.5, max: 8, spd: 3.3, sp0: 0.75, pow: 2.2, full: 5.5, dmg: 0.9, long: 5, longMul: 1.4, kb0: 3.6, kb2: 3.4, kb3: 1, setK: 0.5, setShort: 0.7, react: 2, setP: 0.3, cd: 7 } },   /* v8.8.2 옐로의 손 (sharp = 갑옷이 막는 몫을 이만큼 무시) · 옐로의 돌진 (사족보행 — 처음엔 sp0 × 느리게, 달릴수록 pow 제곱으로 빨라져 full 칸에서 spd × · long 칸 넘게 달리면 중형 이하 kb0 · 중대형 kb2 · 대형 kb3 칸 확정 밀침, 태세로 받아도 setK 만큼 밀림 · 상대는 react 칸 안에 들어와서야 알아채고, 5칸 넘게 달려온 돌진은 setP 확률로만 태세가 제때 섬) */\n  fbuf: { on: 0, arc: 20,")

# ---------- 인물: 연속 도약 · 돌진 (사족보행) · 날붙이 손 ----------
rep("canLeap: tr.includes('도약') || acts.includes('도약'),", "canLeap: tr.includes('도약') || acts.includes('도약') || acts.includes('연속 도약'),")
rep("leapN: +p.leapN || 1,", "leapN: +p.leapN || (acts.includes('연속 도약') ? 2 : 1), rush: tr.includes('사족보행') && acts.includes('돌진'), sharp: p.bladeHands ? ((rules.claw || {}).sharp != null ? rules.claw.sharp : 0.35) : 0, hardHands: !!p.bladeHands,   /* v8.8.2 옐로 */")

# ---------- 날붙이 손: 절삭력 (갑옷이 막는 몫 줄임) · 단단한 손 (맨팔로 막아도 안 잘림) ----------
rep("armMul = extra && extra.noArmor ? 1 : (gapHit && !PNR ? 1 - (1 - AM.m) * 0.5 : AM.m) *",
    "armMul = extra && extra.noArmor ? 1 : shp(u, o, (gapHit && !PNR ? 1 - (1 - AM.m) * 0.5 : AM.m)) *")
rep("const heavyKind = (W, u) =>", "const shp = (u, o, m) => u.sharp > 0 && !o.far ? 1 - (1 - m) * (1 - u.sharp) : m;   /* v8.8.2 절삭력 (옐로의 손) */\nconst heavyKind = (W, u) =>")
rep("applyDmg(W, u, t, Math.max(1, Math.round(base * (G.bareDmg != null ? G.bareDmg : 0.6))), o);",
    "applyDmg(W, u, t, Math.max(1, Math.round(base * (G.bareDmg != null ? G.bareDmg : 0.6) * (t.hardHands ? 0.4 : 1))), o);   /* v8.8.2 단단한 손 */")
rep("if (t.alive && !wholeBody(t) && W.rand() < (G.bareMaim != null ? G.bareMaim : 0.5) * maimRes(W, t)) maimArm(",
    "if (t.alive && !wholeBody(t) && !t.hardHands && W.rand() < (G.bareMaim != null ? G.bareMaim : 0.5) * maimRes(W, t)) maimArm(")

# ---------- 저주:맥아 — 살이 무름 (받는 피해 +) · 이동 방해 ----------
rep("    if (u.bleedK > 0 && (t.bleed || t.ibleed)) dmg *= u.bleedK;",
    "    if (u.bleedK > 0 && (t.bleed || t.ibleed)) dmg *= u.bleedK;\n    if (t.maltT != null && W.t < t.maltT) dmg *= 1 + (SPY(W, 'ybucket').melt || 0);   /* v8.8.2 <저주:맥아> 살이 무름 */")
rep("const spdNow = (W, u) => spdNow0(W, u) * ", "const spdNow = (W, u) => spdNow0(W, u) * (u.maltT != null && W.t < u.maltT ? SPY(W, 'ybucket').slow || 0.55 : 1) * ")

# ---------- 돌진: 옐로의 돌진 ----------
rep("const chargeSp = (C, v0, run) => { const top = C.spd || 2.2, s0 = C.sp0 != null ? C.sp0 : top; return v0 * (s0 + (top - s0) * Math.min(1, run / Math.max(0.1, C.full || 3))); };",
    "const chargeSp = (C, v0, run) => { const top = C.spd || 2.2, s0 = C.sp0 != null ? C.sp0 : top; return v0 * (s0 + (top - s0) * Math.pow(Math.min(1, run / Math.max(0.1, C.full || 3)), C.pow || 1)); };   /* v8.8.2 pow: 옐로는 끝에서 폭발 */\n"
    "const chgC = (W, u) => u.rush ? { ...(W.rules.charge || {}), ...((W.rules.claw || {}).rush || {}) } : (W.rules.charge || {});   /* v8.8.2 사족보행 돌진 */")
rep("  const C = W.rules.charge || {}, g = gap(u, t);", "  const C = chgC(W, u), g = gap(u, t);")
rep("  const C = W.rules.charge || {}, tx = t ? t.x : pt.x, ty = t ? t.y : pt.y;", "  const C = chgC(W, u), tx = t ? t.x : pt.x, ty = t ? t.y : pt.y;")
rep("  const A = u.act, C = W.rules.charge || {}, x0 = u.x, y0 = u.y;", "  const A = u.act, C = chgC(W, u), x0 = u.x, y0 = u.y;")
rep("    const C = W.rules.charge || {}, t = u.act.b != null ? W.units[u.act.b] : null, pt = u.act.px != null", "    const C = chgC(W, u), t = u.act.b != null ? W.units[u.act.b] : null, pt = u.act.px != null")
rep("if (hit.post > cost){ hit.post -= cost; hit.blockT = W.t; hit.blocked++; setHold(W, u, hit, k, vr); return; }",
    "if (hit.post > cost){ hit.post -= cost; hit.blockT = W.t; hit.blocked++; if (u.rush) rushPush(W, u, hit, A, nx, ny, true); setHold(W, u, hit, k, vr); return; }   /* v8.8.2 태세로 받아도 밀림 */")
rep("strike(W, u, hit, hit, 1, false, { mul: (C.dmg || 0.6) * k, wk: sh ? '둔기' : heavyKind(W, u), tag: u.chargeName });",
    "strike(W, u, hit, hit, 1, false, { mul: (C.dmg || 0.6) * k * (u.rush && (A.run || 0) >= (C.long || 5) - 0.05 ? C.longMul || 1.4 : 1), wk: sh ? '둔기' : u.sharp ? '날붙이' : heavyKind(W, u), tag: u.chargeName });   /* v8.8.2 */")
rep("    if (hit.alive && vB2 > 0.2) fling(W, u, hit, vB2 * KB * shK,",
    "    if (hit.alive && u.rush && !hc && rushPush(W, u, hit, A, nx, ny, false)){ /* v8.8.2 5칸 넘게 달린 옐로의 돌진 — 확정 밀침 */ } else if (hit.alive && vB2 > 0.2) fling(W, u, hit, vB2 * KB * shK,")
rep("    if (u.alive && vA2 < -0.2) fling(W, hit, u,", "    if (u.alive && vA2 < -0.2 && !u.rush) fling(W, hit, u,")

# 옐로의 돌진은 태세를 갖출 틈을 안 줌: react 칸 안에 들어와서야 알아채고 태세 (그 전엔 몸으로 받음)
rep("&& e.act.b === u.i && aware(W, u, e)) : null;", "&& e.act.b === u.i && aware(W, u, e) && !rushLate(W, e, u)) : null;")
rep("&& u.guardMode !== 'off' && aware(W, u, t)){   /* v8.7.3 공중제비 내려찍기도 */ stop(u);", "&& u.guardMode !== 'off' && aware(W, u, t) && !rushLate(W, t, u)){   /* v8.7.3 공중제비 내려찍기도 */ stop(u);")

rep("function setFor(W, t, u){\n  if (!guardOn(W, t) || isFar(t) || t.act || t.kb) return false;",
    "function setFor(W, t, u){\n  if (u.rush && u.act && u.act.k === 'charge' && (u.act.run || 0) >= (((W.rules.claw || {}).rush || {}).long || 5) - 0.05 && W.rand() >= (((W.rules.claw || {}).rush || {}).setP != null ? W.rules.claw.rush.setP : 0.3)) return false;   /* v8.8.2 태세를 키기도 전에 달려드는 돌진 */\n  if (!guardOn(W, t) || isFar(t) || t.act || t.kb) return false;")

# 양동이 뿌리기 명령: 바닥도 됨 (닿는 곳이면 바로, 아니면 그 자리로 다가감)
rep("    if (o.s === 'root'){ const px = o.x != null ? o.x",
    "    if (o.s === 'ybucket' && o.x != null){ const B = SPY(W, 'ybucket'), d = Math.hypot(o.x - u.x, o.y - u.y);   /* v8.8.2 */\n"
    "      if (!(u.skill && u.skill.left >= (B.min || 60))){ L(W, { k: 'specFail', a: u.i, s: 'ybucket', why: '양동이에 약이 모자람', vis: true }); u.order = null; return; }\n"
    "      if (specReady(W, u, 'ybucket') && d <= B.rng + 0.3){ startSpec(W, u, null, 'ybucket', '명령'); u.act.px = o.x; u.act.py = o.y; u.order = null; return; }\n"
    "      if (d <= B.rng + 0.3){ setMood(W, u, '양동이 뿌리기 대기' + (sp.cdT > W.t ? ' (' + (sp.cdT - W.t).toFixed(1) + '초)' : '')); stop(u); return; }\n"
    "      setMood(W, u, '양동이 뿌릴 자리로'); goTo(W, u, o.x, o.y, dt); return; }\n"
    "    if (o.s === 'root'){ const px = o.x != null ? o.x")

# ---------- 기술 이름 · 준비 ----------
rep("const SPEC_K = { ", "const SPEC_K = { '달라붙기 난도질': 'yclaw', '양동이 뿌리기': 'ybucket', ")
rep("if (x.n != null && x.n <= 0) return false;", "if (x.n != null && x.n <= 0) return false; if (k === 'ybucket' && !(u.skill && u.skill.left >= (SPY(W, 'ybucket').min || 60))) return false;   /* v8.8.2 양동이에 약이 남아야 */")

# ---------- 새 기술 몸 ----------
NEW = r'''/* ---------- v8.8.2 옐로: 달라붙기 난도질 · 양동이 뿌리기 (저주:맥아 장판) · 연속 도약 · 돌진 (키하핫) ---------- */
const YD = { yclaw: { rng: 1.3, wind: 0.3, rec: 0.5, hold: 2, cd: 14, tick: 0.2, mul: 0.26, fin: 2.5, brk: 0.2 }, ybucket: { rng: 4, r: 1.6, wind: 0.5, rec: 0.4, cd: 10, tick: 0.5, cost: 120, min: 60, tMin: 3, tMax: 10, slow: 0.55, melt: 0.3, dot: 2.5, linger: 1.5 } };
const SPY = (W, k) => ({ ...YD[k], ...SPR(W, k) });
// 달라붙기 난도질: 붙잡기 (잡아찢기와 같은 틀 — 맞으면 놓침) 동안 tick 초마다 날붙이로 마구 할큄 (막을 수 없음)
function clawStep(W, u, dt){
  const A = u.act, S = SPY(W, 'yclaw'), t = W.units[A.held];
  if (!t || !t.alive){ if (t) t.heldBy = null; u.act = { k: 'spec', s: 'yclaw', b: A.b, phase: 'rec', t0: W.t, end: W.t + (S.rec || 0.5) }; return; }
  let n = 0;
  while (W.t >= A.tick && n < 3){ A.tick += S.tick || 0.2; n++;
    if (t.side === u.side) continue;
    strike(W, u, t, t, 1, false, { mul: (S.mul || 0.26) * (0.85 + 0.3 * W.rand()), tag: '달라붙어 할큄', wk: '날붙이', grab: true }); A.hits = (A.hits || 0) + 1;
    if (W.fxOn) W.fx.push({ k: 'claw', x: t.x, y: t.y, ang: W.rand() * 6.283, t0: W.t });
    if (!t.alive) break; }
}
function clawDone(W, u, A){
  const S = SPY(W, 'yclaw'), t = W.units[A.held]; u.act = { k: 'spec', s: 'yclaw', b: A.b, phase: 'rec', t0: W.t, end: W.t + (S.rec || 0.5) }; u.atkT = W.t;
  if (!t) return; t.heldBy = null; if (!t.alive) return;
  strike(W, u, t, t, 1, false, { mul: (S.mul || 0.26) * (S.fin || 2.5), tag: '달라붙어 할큄 — 마무리', wk: '날붙이', grab: true });
  if (t.alive && t.side !== u.side){ const d = dist(u, t) || 1; fling(W, u, t, 1.2, (t.x - u.x) / d, (t.y - u.y) / d, { how: '옐로가 박차고 떨어짐' }); }
  L(W, { k: 'clawEnd', a: u.i, b: t.i, n: A.hits || 0, vis: u.side === 0 || t.side === 0 || !!u.seenBy || !!t.seenBy });
}
// 저주:맥아 장판 (양동이 뿌리기): 안의 상대에게 <저주:맥아> — 걸음 느려짐 · 받는 피해 + · 살이 녹음 (tick 초마다). 동료는 상관없음
function stepMalt(W, P){
  const Sy = SPY(W, 'ybucket'), by = W.units[P.by];
  for (const e of W.units){ if (!e.alive || e.side === P.side || e.fairyW) continue;
    if (Math.hypot(e.x - P.x, e.y - P.y) > P.r + e.r * 0.5) continue;
    if (!(e.maltT != null && W.t < e.maltT)){ L(W, { k: 'maltOn', a: P.by, b: e.i, vis: e.side === 0 || P.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.3, s: '저주:맥아', c: 'g', t0: W.t }); }
    e.maltT = W.t + (Sy.linger || 1.5); }
  if (W.t >= P.tickT){ P.tickT = W.t + (Sy.tick || 0.5);
    for (const e of W.units){ if (!e.alive || e.side === P.side || e.fairyW || Math.hypot(e.x - P.x, e.y - P.y) > P.r + e.r * 0.5) continue;
      hurtRaw(W, by || { i: P.by, side: P.side }, e, Sy.dot || 2.5, { tag: '맥아가 살을 녹임' }); } }
}
// 옐로의 돌진 맞음: 5칸 넘게 달렸으면 몸집만큼 확정 밀침 (중형 이하 kb0 · 중대형 kb2 · 대형 kb3 · 그 위 조금) + 키하핫!! — held (상대가 태세로 받았을 때) 는 그래도 밀림 (넘어지진 않음)
const rushLate = (W, e, u) => e.rush && e.act && e.act.k === 'charge' && gap(e, u) > (((W.rules.claw || {}).rush || {}).react || 2);   /* v8.8.2 옐로의 돌진은 react 칸 안에서야 알아챔 */
function rushPush(W, u, hit, A, nx, ny, held){
  const C = chgC(W, u), run = A.run || 0, long = run >= (C.long || 5) - 0.05, rk = SIZE_RANK[sizeOf(hit)] != null ? SIZE_RANK[sizeOf(hit)] : 1;
  let len = long ? (rk <= 1 ? C.kb0 || 3.6 : rk === 2 ? C.kb2 || 3.2 : rk === 3 ? C.kb3 || 1 : 0.4) : 0;
  if (held) len = long ? Math.max(1.2, len * (C.setK || 0.5)) : (run >= 2 ? C.setShort || 0.7 : 0);
  if (!(len > 0) || !hit.alive) return false;
  if (long){ L(W, { k: 'rushHit', a: u.i, b: hit.i, run: +run.toFixed(1), len: +len.toFixed(1), held: !!held, vis: u.side === 0 || hit.side === 0 || !!u.seenBy || !!hit.seenBy }); if (W.fxOn) W.fx.push({ k: 'say', a: u.i, s: '키하핫!!', t0: W.t }); }
  fling(W, u, hit, len, nx, ny, { how: 'rush', v: 9, fix: true, ...(held ? { down: false } : {}) });
  return true;
}
// 연속 도약을 스스로 자주: 붙지 못한 상대에게 뛰어듦 (한 번 뛰면 이어서 또) — 멀리서 돌진이 준비돼 있으면 돌진 먼저
function yHop(W, u, t, g){
  if (!(u.leapN >= 2) || !u.canLeap || isFar(u) || u.crawl || u.lie || u.kb || u.act || W.t < u.leapCd || W.t < (u.hobbleT || -9) || W.t < (u.yhopChk || -9)) return false;
  u.yhopChk = W.t + 0.15;
  const LP = W.rules.leap || {}, D = LP.dist || 1.7, mid = u.leapQ != null && u.leapQ > 0 && u.leapQ < u.leapN;
  if (g <= u.rng + 0.25 || g > D * 2 + 1.2) return false;
  if (!mid && g > 3.4 && u.canCharge && W.t >= u.chargeCd) return false;
  if (u.line || cmdHold(W, u)) return false;
  const p = leapIn(u, t); return leapTo(W, u, p.x, p.y, 'fwd', t, '연속 도약 — 뛰어들어 붙음');
}
function startSpec(W, u, t, k, why){'''
rep("function startSpec(W, u, t, k, why){", NEW)

# ---------- 해결: 붙잡기 틀 응용 (tear → tear · yclaw) ----------
rep("  if (k === 'tear' && A.phase === 'run'){ tearDone(W, u, A); return; }", "  if ((k === 'tear' || k === 'yclaw') && A.phase === 'run'){ if (k === 'tear') tearDone(W, u, A); else clawDone(W, u, A); return; }")
rep("  if (k === 'tear'){   // v8.7.4 잡아찢기 (J22)", "  if (k === 'tear' || k === 'yclaw'){   // v8.7.4 잡아찢기 (J22) · v8.8.2 달라붙기 난도질 (같은 틀)")
rep("A.phase = 'run'; A.end = W.t + (S.hold || 2.2); A.held = t.i; A.dmg = 0;", "A.phase = 'run'; A.end = W.t + (S.hold || 2.2); A.held = t.i; A.dmg = 0; A.tick = W.t + (S.tick || 0.2);")
rep("L(W, { k: 'tearGrab', a: u.i, b: t.i, sec: S.hold || 2.2,", "L(W, { k: 'tearGrab', s: k, a: u.i, b: t.i, sec: S.hold || 2.2,")
rep("  if (k === 'akick'){   // v8.7.8 앞차기",
    r'''  if (k === 'ybucket'){   // v8.8.2 양동이 뿌리기: 닿는 곳에 장판 — 지속은 양동이에 남은 약에 따라
    const Sy = SPY(W, 'ybucket'); let px = A.px != null ? A.px : t ? t.x : u.x + Math.cos(u.face || 0) * 2, py = A.py != null ? A.py : t ? t.y : u.y + Math.sin(u.face || 0) * 2;
    const d0 = Math.hypot(px - u.x, py - u.y) || 1, rg = Sy.rng + 0.3; if (d0 > rg){ px = u.x + (px - u.x) / d0 * rg; py = u.y + (py - u.y) / d0 * rg; }
    const left0 = u.skill ? u.skill.left : 0;
    if (!u.skill || left0 < (Sy.min || 60)){ L(W, { k: 'specFail', a: u.i, s: 'ybucket', why: '양동이에 약이 모자람', vis: true }); return; }
    const cost = Math.min(left0, Sy.cost || 120), dur = (Sy.tMin || 3) + ((Sy.tMax || 10) - (Sy.tMin || 3)) * Math.min(1, left0 / Math.max(1, u.skill.pool || 500));
    u.skill.left = left0 - cost;
    (W.pools || (W.pools = [])).push({ kind: 'malt', by: u.i, side: u.side, x: px, y: py, r: Sy.r || 1.6, until: W.t + dur, tickT: W.t, t0: W.t });
    L(W, { k: 'bucket', a: u.i, b: t ? t.i : null, x: +px.toFixed(2), y: +py.toFixed(2), r: Sy.r || 1.6, sec: +dur.toFixed(1), cost, left: Math.round(u.skill.left), vis: true });
    if (W.fxOn) W.fx.push({ k: 'pour', a: u.i, x: px, y: py, r: Sy.r || 1.6, t0: W.t });
    return;
  }
  if (k === 'akick'){   // v8.7.8 앞차기''')
# 장판 · 놓침 · 끊김 · 붙잡힌 몸이 같은 틀을 씀
rep("W.pools = W.pools.filter(P => W.t < P.until);\n}", "W.pools = W.pools.filter(P => W.t < P.until);\n}")  # 앵커 확인
rep("  for (const P of W.pools){ if (W.t >= P.until) continue; const by = W.units[P.by];", "  for (const P of W.pools){ if (W.t >= P.until) continue; if (P.kind === 'malt'){ stepMalt(W, P); continue; } const by = W.units[P.by];   /* v8.8.2 저주:맥아 장판 */")
rep("if (G && G.k === 'spec' && G.s === 'tear' && G.phase === 'run' && u.side !== t.side){ G.dmg = (G.dmg || 0) + Math.min(dmg, t.hp); if (G.dmg >= t.max * (SPR(W, 'tear').brk || 0.06)) tearLet(",
    "if (G && G.k === 'spec' && (G.s === 'tear' || G.s === 'yclaw') && G.phase === 'run' && u.side !== t.side){ G.dmg = (G.dmg || 0) + Math.min(dmg, t.hp); if (G.dmg >= t.max * (SPY(W, G.s === 'tear' ? 'tear' : 'yclaw').brk || 0.06)) tearLet(")
rep("  if (a && a.k === 'spec' && a.s === 'tear' && a.phase === 'run'){ const v = W.units[a.held]; if (v) v.heldBy = null; L(W, { k: 'tearLet',",
    "  if (a && a.k === 'spec' && (a.s === 'tear' || a.s === 'yclaw') && a.phase === 'run'){ const v = W.units[a.held]; if (v) v.heldBy = null; L(W, { k: 'tearLet',")
rep("function tearLet(W, u, why, by){ const A = u.act; if (!A || A.k !== 'spec' || A.s !== 'tear' || A.phase !== 'run') return; const v = W.units[A.held]; if (v) v.heldBy = null; u.act = { k: 'spec', s: 'tear',",
    "function tearLet(W, u, why, by){ const A = u.act; if (!A || A.k !== 'spec' || (A.s !== 'tear' && A.s !== 'yclaw') || A.phase !== 'run') return; const v = W.units[A.held]; if (v) v.heldBy = null; u.act = { k: 'spec', s: A.s,")
rep("if (g && g.alive && A && A.k === 'spec' && A.s === 'tear' && A.phase === 'run' && A.held === u.i){", "if (g && g.alive && A && A.k === 'spec' && (A.s === 'tear' || A.s === 'yclaw') && A.phase === 'run' && A.held === u.i){")
# 매 순간: 할큄
rep("  if (u.act && u.act.k === 'gwHop'){ gwHopStep(W, u); return; }", "  if (u.act && u.act.k === 'spec' && u.act.s === 'yclaw' && u.act.phase === 'run') clawStep(W, u, dt);   /* v8.8.2 달라붙어 할큄 */\n  if (u.act && u.act.k === 'gwHop'){ gwHopStep(W, u); return; }")

# ---------- 스스로 쓰기 ----------
rep("  if (apAuto(W, u, t)) return true;   /* v8.7.8 어퐁: 초돌진 · 앞차기 */",
    r'''  if (apAuto(W, u, t)) return true;   /* v8.7.8 어퐁: 초돌진 · 앞차기 */
  if (u.leapN >= 2 && yHop(W, u, t, gap(u, t))) return true;   /* v8.8.2 옐로: 연속 도약으로 뛰어듦 */
  if (specReady(W, u, 'yclaw') && gap(u, t) <= (SPY(W, 'yclaw').rng || 1.3) && !t.down && !t.heldBy && (SIZE_RANK[sizeOf(t)] || 0) < SIZE_RANK['초대형'] && !(t.act && t.act.k === 'leap') && W.units.filter(e => e.alive && e.side !== u.side && gap(u, e) <= 1.2).length < 3 && W.rand() < 0.35) return startSpec(W, u, t, 'yclaw', '달라붙어 마구 할큄');   /* v8.8.2 */
  if (specReady(W, u, 'ybucket')){ const B = SPY(W, 'ybucket'), gg = gap(u, t);   /* v8.8.2 양동이 뿌리기: 무리 · 먼 사수 · 큰 몸에게 — 동료가 위급하면 약은 치료에 */
    if (gg >= 1.6 && gg <= B.rng && u.skill.left >= (B.min || 60) + 60 && !(t.maltT != null && W.t < t.maltT) && !W.units.some(a => a.alive && a.side === u.side && a !== u && a.hp / a.max < 0.4)){
      const grp = W.units.filter(e => e.alive && e.side !== u.side && dist(e, t) <= (B.r || 1.6) + 0.6).length;
      if (grp >= 2 || isFar(t) || (t.mass || 60) >= 120){ startSpec(W, u, t, 'ybucket', '양동이를 뿌림'); u.act.px = t.x + (t.vx || 0) * 0.4; u.act.py = t.y + (t.vy || 0) * 0.4; return true; } } }''')

for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch8820 OK')
