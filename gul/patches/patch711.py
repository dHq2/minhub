# v7.11.0 포복 v1 (엔진) — patch711.py v1
import re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:90])
    return s.replace(a, b)

# ---------- head: 수치 ----------
h = rd('rt3_head.js')
i = h.index('\n  watch: { gap: [4, 8]'); j = h.index('\n', i + 1)
h = h[:j] + "\n  lie: { down: 0.6, up: 0.9, upFast: 0.55, spd: 0.25, aim: 0.35, hitFar: 0.55, hitArc: 0.85, hitR: 0.6, near: 1.8, lit: 0.9, dim: 0.55, dark: 0.35, mem: 4, spot: 0.05, spotLit: 5, spotDim: 2, spotSus: 3, spotSmell: 3, spotVet: 1.5, spotMove: 3, spotBig: 3, rescan: 6, lose: [0.3, 0.5], loseD: 5, flash: 1.6, rise: 3, trample: { mass: 180, v: 0.8, cd: 1.5, k: 0.12 } },   // v7.11 포복 (엎드림): 엎드림 down 초 · 일어남 up 초 (기동 upFast) · 기는 속력 × spd · 엎드려 쏘는 총은 남은 빗나감을 aim 만큼 줄임 · 엎드린 몸은 near 칸 밖에서 덜 맞음 (직사 × hitFar · 곡사 × hitArc · 스치는 탄의 몸 폭 × hitR) · 아직 모르는 눈에는 보는 거리 × (빛 lit · 어스름 dim · 어둠 dark — 야시는 등급 거리에서) 안만 보임, 그 밖 (본래 보이는 거리 안) 은 관측 기회마다 spot × 빛 spotLit · 어스름 spotDim · 수상함 spotSus · 후각 spotSmell · 베테랑 spotVet · 기는 중 spotMove · 큰 몸 spotBig (처음 · 보는 쪽 1.5칸 · 엎드린 몸 0.8칸 움직임 · rescan 초 · 새로 수상함) · 보던 눈은 시선이 mem 초 끊기면 놓침 · 보던 눈이 loseD 칸 넘게 · 빛 밖이면 엎드릴 때 lose (멀수록 큼) 로 놓침 · 총구 화염: 시야 × flash 안 · 트인 눈은 자리를 앎 · 근접이 나를 노리고 rise 칸 안이면 스스로 일어남 · 모르고 지나가는 큰 몸 (거구 · mass kg) 이 v 칸/초 넘게 밟으면 피해 k × 무게 × 빠르기" + h[j:]
assert h.count("\n  lie: { down:") == 1
wr('rt3_head.js', h)

# ---------- mid: 시야 문 ----------
m = rd('rt3_mid.js')
i = m.index("  if (u.smell && d <= u.smell) return true;   // 높은후각"); j = m.index('\n', i)
m = m[:j] + "\n  if (t.lie && !t.lieSw && !W.lieOff && t.side !== u.side && lieHid(W, u, t, d)) return false;   // v7.11 엎드린 몸: 아직 모르는 눈에는 가까이서만 (후각은 위에서 먼저 맡음 · 몸이 닿아도 모름 — 밟을 수 있음)" + m[j:]
wr('rt3_mid.js', m)

# ---------- tail ----------
s = rd('rt3_tail.js')

# 넘어짐 판정에 엎드림 포함 (근접에 약함 · 막기 · 피하기 · 전열 없음)
s = rep(s, "const prone = (W, u) => !!u.crawl || W.t < u.proneT;",
        "const prone = (W, u) => !!u.crawl || W.t < u.proneT || !!u.lie;   // v7.11 엎드림 (포복) 도 낮은 자세 — 근접에 약함 · 못 막음 · 못 피함")

# 속력
s = rep(s, "const spdNow = (W, u) => ", "const spdNow0 = (W, u) => ")
i = s.index("const spdNow0 = (W, u) => "); j = s.index('\n', i)
s = s[:j] + "\nconst spdNow = (W, u) => spdNow0(W, u) * (u.lie && !u.lieSw ? (W.rules.lie || {}).spd || 0.25 : 1);   // v7.11 엎드려 김 (포복)" + s[j:]

# 막기
s = rep(s, "const guardOn = (W, u) => u.alive && u.canGuard && u.raised && ", "const guardOn = (W, u) => u.alive && u.canGuard && u.raised && !u.lie && ")

# 조준
s = rep(s, "function aimP(W, u, t){", "function aimP(W, u, t, arc){")
s = rep(s, "  if (W.t < u.pinT) p *= 1 - 0.2 * (1 - mk * 0.5);   // 움찔\n",
        "  if (W.t < u.pinT) p *= 1 - 0.2 * (1 - mk * 0.5);   // 움찔\n  { const LL = W.rules.lie; if (LL){ if (u.lie && !u.lieSw && gunOf(W, u)) p += (1 - p) * (LL.aim || 0); if (t.lie && !t.lieSw && dist(u, t) > (LL.near || 1.8)) p *= arc ? LL.hitArc || 0.85 : LL.hitFar || 0.55; } }   // v7.11 엎드려 쏘는 총은 덜 흔들림 · 엎드린 몸은 멀리서 덜 맞음 (곡사는 덜 줄음)\n")
s = rep(s, "const arcAim = (W, u, t) => aimP(W, u, t) * ", "const arcAim = (W, u, t) => aimP(W, u, t, true) * ")
# 투창 · 투척
s = rep(s, "  if (blindTo(W, u, t)) p *= W.rules.darkAimFar != null ? W.rules.darkAimFar : 0.1;\n  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음",
        "  if (blindTo(W, u, t)) p *= W.rules.darkAimFar != null ? W.rules.darkAimFar : 0.1;\n  if (t.lie && !t.lieSw && W.rules.lie && dist(u, t) > (W.rules.lie.near || 1.8)) p *= W.rules.lie.hitArc || 0.85;   // v7.11 엎드린 몸 (던진 것은 떨어지며 맞음)\n  p *= u.aimMaim || 1;   // v5.5 눈 · 팔을 잃음")

# 날아가는 탄: 엎드린 몸은 멀리서 폭이 좁음
s = rep(s, "        if (dd <= b.r && k < hk){ hk = k; hit = b; }",
        "        const br = b.lie && !b.lieSw && W.rules.lie && Math.hypot(b.x - s.x0, b.y - s.y0) > (W.rules.lie.near || 1.8) ? b.r * (W.rules.lie.hitR || 0.6) : b.r;   // v7.11 엎드린 몸 위로 지나감\n        if (dd <= br && k < hk){ hk = k; hit = b; }")

# 총구 화염
s = rep(s, "  if (!u.loud) return;\n  if (W.rules.din) dinAdd(W, u.x, u.y, W.rules.din.gun);",
        "  if (u.lie) lieFlash(W, u);   // v7.11 엎드려 쏜 총의 화염\n  if (!u.loud) return;\n  if (W.rules.din) dinAdd(W, u.x, u.y, W.rules.din.gun);")

# 맞은 것이 원거리인지 (엎드린 몸이 일어날지 판단)
s = rep(s, "  t.hp -= real; t.hitT = W.t; u.dealt += real; t.taken += real;",
        "  t.hp -= real; t.hitT = W.t; t.hitFar = !!(o && o.far); u.dealt += real; t.taken += real;   // v7.11 hitFar")

# 매 순간
s = rep(s, "  stealthFeel(W);   // v7.8.3 들킴을 느낌\n", "  stealthFeel(W);   // v7.8.3 들킴을 느낌\n  lieTick(W, dt);   // v7.11 포복: 자세 바꿈 · 관측 기회 · 놓침 · 스스로 일어남\n")

# 겹침 → 밟힘
s = rep(s, "    if (d >= need) continue;\n    const push = (need - d) / 2",
        "    if (d >= need) continue;\n    if (P.lie || Q.lie) lieTrample(W, P, Q);   // v7.11 모르고 밟음\n    const push = (need - d) / 2")

# act: 맞지 않는 명령이면 일어남 · 엎드린 채 그 자리
s = rep(s, "  if (u.canLeap && !u.crawl && W.t >= u.leapCd && !AI6.includes('sidel') && leapAside(W, u)) return;",
        "  if (u.lie && lieHold(W, u)) return;   // v7.11 엎드려서 못 하는 명령이면 일어남 (그동안 아무것도 못 함)\n  if (u.canLeap && !u.crawl && !u.lie && W.t >= u.leapCd && !AI6.includes('sidel') && leapAside(W, u)) return;")
s = rep(s, "  const x0 = u.x, y0 = u.y;\n  act2(W, u, dt);\n",
        "  const x0 = u.x, y0 = u.y;\n  act2(W, u, dt);\n  if (u.lie && !lieMoves(u) && (u.x !== x0 || u.y !== y0)){ u.x = x0; u.y = y0; stop(u); }   // v7.11 엎드린 채 그 자리 (기는 것은 이동 · 공격 · 견제 명령일 때만)\n")

# 시작 함수들: 엎드려서는 총만 쏨 — 그 밖은 일어나는 것으로
s = rep(s, "function startAct(W, u, t, why){\n  const heal = u.cls === '치유' && t.side === u.side;\n",
        "function startAct(W, u, t, why){\n  const heal = u.cls === '치유' && t.side === u.side;\n  if (u.lie && (heal || t.side === u.side || !gunOf(W, u)) && lieGate(W, u, heal ? '돌보려 일어남' : isFar(u) ? '쏘려 일어남 (엎드려서는 총만)' : '치려 일어남')) return;   // v7.11\n")
s = rep(s, "function startSkill(W, u, t, auto){\n", "function startSkill(W, u, t, auto){\n  if (u.lie && lieGate(W, u, '돌보려 일어남')) return;   // v7.11\n")
s = rep(s, "function startLeap(W, u, t){\n", "function startLeap(W, u, t){\n  if (u.lie) return false;   // v7.11 엎드린 채 스스로 뛰지 않음 (명령이면 먼저 일어남)\n")
s = rep(s, "function leapTo(W, u, x, y, dir, t, why){\n", "function leapTo(W, u, x, y, dir, t, why){\n  if (u.lie) return false;   // v7.11 엎드린 채 스스로 뛰지 않음 (명령이면 먼저 일어남)\n")
s = rep(s, "function startCharge(W, u, t, pt){\n", "function startCharge(W, u, t, pt){\n  if (u.lie) return false;   // v7.11 엎드린 채 스스로 돌진하지 않음 (명령이면 먼저 일어남)\n")
s = rep(s, "function startThrow(W, u, t, why, ord){\n", "function startThrow(W, u, t, why, ord){\n  if (u.lie) return false;   // v7.11 엎드린 채 스스로 던지지 않음 (명령이면 먼저 일어남)\n")
s = rep(s, "function startBash(W, u, t, why, body){   // v5.8.6 body = 방패 없이 몸 (어깨) 으로 밀침 — 더 약함\n",
        "function startBash(W, u, t, why, body){   // v5.8.6 body = 방패 없이 몸 (어깨) 으로 밀침 — 더 약함\n  if (u.lie) return false;   // v7.11 엎드린 채 밀치지 않음\n")
s = rep(s, "function startPalm(W, u, t, why){\n", "function startPalm(W, u, t, why){\n  if (u.lie) return false;   // v7.11 엎드린 채 팜 버스트를 쓰지 않음 (명령이면 먼저 일어남)\n")

# 판 기록 (상태 스냅숏)
s = rep(s, "prone: W.t < u.proneT, crawl: !!u.crawl,", "prone: W.t < u.proneT, lie: u.lie ? (u.lieSw ? (u.lieSw.to ? 'down' : 'up') : 'on') : null, crawl: !!u.crawl,")

# 본체
LIE = r'''
/* ---------- v7.11 포복 (엎드림) ----------
   자세: 엎드림 (down 초) · 일어남 (up 초, 기동 upFast) — 바꾸는 동안 아무것도 못 함 (넘어짐과 같음). 엎드리면 기어서만 감 (× spd), 막기 · 피하기 · 전열 없음, 근접에 약함 (넘어진 몸과 같음).
   쏘기: 엎드려서는 총 (총포류) 만 — 남은 빗나감 × (1 − aim). 활 · 근접 · 기술은 일어난 뒤에. 엎드린 몸은 near 칸 밖에서 덜 맞음 (직사 × hitFar · 곡사 × hitArc).
   보이기: 이미 안 눈 (lieSeen) 은 그대로 봄. 모르는 눈은 빛 · 어스름 · 어둠 (야시 등급 거리) × lit · dim · dark 안만 — 그 밖 (본래 보이는 거리 안) 은 관측 기회에만 굴림.
   놓침: 엎드릴 때 멀리 (loseD 칸 넘게 · 빛 밖) 서 보던 눈은 lose 로 놓침 (마지막 자리 기억은 남아 그쪽을 뒤짐) · 아는 눈도 시선이 mem 초 끊기면 놓침.
   스스로 판단: 근접에 맞거나 · 근접이 나를 노려 rise 칸 안이면 일어남. 원거리가 노리면 엎드린 채 버팀 (들킨 듯 — 기록). 모르는 큰 몸이 밟고 지나가면 다침 (lieTrample). */
const LIE = W => W.rules.lie || {};
const gunOf = (W, u) => isFar(u) && (((W.rules.weapons || {})[u.weapon] || {}).kind === '총포류');
const LIE_ORD = ['move', 'amove', 'hold', 'watch'];
const lieOrdOK = (W, u) => !u.order || LIE_ORD.includes(u.order.k) || ((u.order.k === 'attack' || u.order.k === 'supp') && gunOf(W, u));
const lieMoves = u => !!u.order && ['move', 'amove', 'attack', 'supp'].includes(u.order.k);
function lieHid(W, u, t, d){
  const LL = LIE(W); if (d <= (LL.near || 1.8) || (t.lieSeen && t.lieSeen[u.i] != null)) return false;
  const R = W.rules, lit = litAt(W, t.x, t.y), glow = glowAt(W, t.x, t.y), reach = lit || glow ? R.sight : !u.nv ? 0 : u.nvG === 'B' ? R.nvB || 5 : u.nvG === 'C' ? R.nvC || 3.75 : u.nvG === 'D' ? R.nvD || 2.5 : R.sight;
  let k = lit ? LL.lit || 0.9 : glow ? LL.dim || 0.55 : LL.dark || 0.35; if ((t.h || 1.7) >= 2.2) k = Math.min(1, k * 2);   // 큰 몸은 엎드려도 큼
  return d > reach * k * stealthK(W, t);
}
function lieSet(W, u, on, why){
  const LL = LIE(W); if (!LL.down || !u.alive || u.down) return false;
  if (on){
    if ((u.lie && !(u.lieSw && !u.lieSw.to)) || u.crawl || u.kb || (u.act && u.act.k === 'charge' && u.act.phase === 'run')) return false;
    interrupt(W, u, '엎드려 준비가 끊김'); stop(u); u.raised = false;
    u.lie = true; u.lieSw = { to: true, at: W.t + LL.down }; u.proneT = Math.max(u.proneT, u.lieSw.at);
    L(W, { k: 'lieDown', a: u.i, why: why || '', sec: LL.down, vis: u.side === 0 || !!u.seenBy });
  } else {
    if (!u.lie || (u.lieSw && !u.lieSw.to)) return false;
    const sec = (u.cls === '기동' ? LL.upFast : LL.up) || 0.9;
    interrupt(W, u, '일어나려 준비가 끊김'); stop(u);
    u.lieSw = { to: false, at: W.t + sec }; u.proneT = Math.max(u.proneT, u.lieSw.at);
    L(W, { k: 'lieUp', a: u.i, why: why || '', sec, vis: u.side === 0 || !!u.seenBy });
  }
  return true;
}
function lieGate(W, u, why){ if (!u.lie) return false; if (!u.lieSw || u.lieSw.to) lieSet(W, u, false, why); return true; }
function lieHold(W, u){ if (u.lieSw) return true; if (lieOrdOK(W, u)) return false; lieSet(W, u, false, '명령 (' + u.order.k + ')'); return true; }
// 보는 눈 (뒤를 보고 있으면 못 봄)
const lieEye = (W, o, t) => { W.lieOff = true; const v = canSee(W, o, t) && (o.heads > 1 || sideV(W, o, t) !== 'back'); W.lieOff = false; return v; };
function lieDone(W, t){   // 다 엎드림: 지금 보던 눈 중 멀리 · 어둠 속이면 놓칠 수 있음
  const LL = LIE(W), R = W.rules, lit = litAt(W, t.x, t.y), L0 = LL.lose || [0.3, 0.5], D0 = LL.loseD || 5, lost = [], seen = [];
  t.lieSeen = {}; t.lieRoll = {};
  for (const o of W.units){
    if (!o.alive || o.down || o.side === t.side || (o.koT && W.t < o.koT) || !lieEye(W, o, t)) continue;
    const d = dist(o, t);
    if (d >= D0 && !lit && !(o.smell && d <= o.smell)){ const p = L0[0] + (L0[1] - L0[0]) * Math.min(1, (d - D0) / Math.max(1, R.sight - D0)); if (W.rand() < p){ lost.push(o.i); continue; } }
    t.lieSeen[o.i] = W.t; seen.push(o.i);
  }
  L(W, { k: 'lieDone', a: t.i, seen, lost, vis: t.side === 0 || !!t.seenBy });
}
function lieTick(W, dt){
  const LL = LIE(W); if (!LL.down) return;
  W.lieT = (W.lieT || 0) - dt; const roll = W.lieT <= 0; if (roll) W.lieT = 0.2;
  for (const t of W.units){
    if (!t.lie) continue;
    if (!t.alive || t.down || t.crawl){ t.lie = false; t.lieSw = null; t.lieSeen = null; t.lieRoll = null; continue; }
    if (t.lieSw && W.t >= t.lieSw.at){
      if (t.lieSw.to){ t.lieSw = null; lieDone(W, t); }
      else { t.lie = false; t.lieSw = null; t.lieSeen = null; t.lieRoll = null; continue; }
    }
    if (t.lieSw || !roll) continue;
    lieWatch(W, t, LL); if (t.lie && !t.lieSw) lieFeel(W, t, LL);
  }
}
// 관측 기회 (매 순간 굴리지 않음): 처음 · 보는 쪽이 1.5칸 · 엎드린 몸이 0.8칸 움직임 · rescan 초 · 새로 수상함
function lieWatch(W, t, LL){
  const S = t.lieSeen || (t.lieSeen = {}), Rr = t.lieRoll || (t.lieRoll = {}), lit = litAt(W, t.x, t.y), glow = glowAt(W, t.x, t.y), mv = Math.hypot(t.vx || 0, t.vy || 0) > 0.15;
  for (const o of W.units){
    if (!o.alive || o.down || o.side === t.side || (o.koT && W.t < o.koT)) continue;
    const base = lieEye(W, o, t);
    if (S[o.i] != null){ if (base) S[o.i] = W.t; else if (W.t - S[o.i] > (LL.mem || 4)) delete S[o.i]; continue; }
    if (!base){ delete Rr[o.i]; continue; }
    if (canSee(W, o, t)){ S[o.i] = W.t; continue; }   // 가까움 · 빛 — 그냥 보임
    const r = Rr[o.i], sus = fresh(W, o.sense[t.i], 6) || (!!o.heard && W.t - o.heard.t < 6 && Math.hypot(o.heard.x - t.x, o.heard.y - t.y) < 3);
    if (r && Math.hypot(o.x - r.ox, o.y - r.oy) < 1.5 && Math.hypot(t.x - r.tx, t.y - r.ty) < 0.8 && W.t - r.t < (LL.rescan || 6) && !(sus && !r.sus)) continue;
    Rr[o.i] = { ox: o.x, oy: o.y, tx: t.x, ty: t.y, t: W.t, sus: !!sus };
    const why = [lit ? '빛' : glow ? '어스름' : '어둠']; if (sus) why.push('수상함'); if (o.smellG) why.push('후각'); if (o.vet) why.push('베테랑'); if (mv) why.push('기는 중'); if ((t.h || 1.7) >= 2.2) why.push('큰 몸');
    const p = Math.min(0.9, (LL.spot || 0.05) * (lit ? LL.spotLit || 5 : glow ? LL.spotDim || 2 : 1) * (sus ? LL.spotSus || 3 : 1) * (o.smellG ? LL.spotSmell || 3 : 1) * (o.vet ? LL.spotVet || 1.5 : 1) * (mv ? LL.spotMove || 3 : 1) * ((t.h || 1.7) >= 2.2 ? LL.spotBig || 3 : 1) * stealthK(W, t));
    const ok = W.rand() < p;
    if (ok) S[o.i] = W.t;
    L(W, { k: 'lieRoll', a: o.i, b: t.i, p: +p.toFixed(3), ok, d: +dist(o, t).toFixed(1), why: why.join(' · '), vis: false });
  }
}
// 엎드린 쪽이 느끼는 것 (보이는 모습으로): 근접에 맞음 · 근접이 나를 노리고 다가옴 (rise 칸 안) → 일어남. 원거리가 노림 · 원거리에 맞음 → 엎드린 채 (들킨 듯)
function lieFeel(W, t, LL){
  const hit = W.t - (t.hitT == null ? -9 : t.hitT) < 0.3;
  let by = null, close = null;
  for (const o of W.units){
    if (!o.alive || o.down || o.side === t.side || !canSee(W, t, o)) continue;
    const d = dist(o, t), aim = (o.act && o.act.b === t.i) || focusOf(W, o) === t, ap = ((o.vx || 0) * (t.x - o.x) + (o.vy || 0) * (t.y - o.y)) / Math.max(0.1, d) > 0.4 && angDiff(o.face || 0, Math.atan2(t.y - o.y, t.x - o.x)) < 0.6;
    if (!isFar(o) && d < (LL.rise || 3) && (aim || ap)){ close = o; break; }
    if (aim && !by) by = o;
  }
  if ((hit && !t.hitFar) || close){ lieSet(W, t, false, hit && !t.hitFar ? '근접에 맞음' : '다가오는 ' + close.name); return; }
  if ((by || hit) && W.t - (t.lieFeelT == null ? -9 : t.lieFeelT) > 6){ t.lieFeelT = W.t; L(W, { k: 'lieBlown', a: t.i, b: by ? by.i : null, why: hit ? '맞음' : '겨눔', vis: t.side === 0 || !!t.seenBy }); }
}
// 총구 화염: 엎드려 쏜 자리 — 시야 × flash 안에서 트인 눈은 자리를 앎
function lieFlash(W, u){
  if (!u.lie || u.lieSw || !gunOf(W, u)) return;
  const LL = LIE(W), S = u.lieSeen || (u.lieSeen = {}); let n = 0;
  for (const o of W.units){
    if (!o.alive || o.down || o.side === u.side || S[o.i] != null) continue;
    if (dist(o, u) > W.rules.sight * (LL.flash || 1.6) || !losClear(W.map, o.x, o.y, u.x, u.y) || (!(o.heads > 1) && sideV(W, o, u) === 'back')) continue;
    S[o.i] = W.t; o.sense[u.i] = { x: u.x, y: u.y, t: W.t, exact: true, light: true }; n++;
  }
  if (W.t - (u.flashLogT == null ? -9 : u.flashLogT) > 4){ u.flashLogT = W.t; L(W, { k: 'lieFlash', a: u.i, n, vis: u.side === 0 || !!u.seenBy }); }
}
// 모르고 밟음: 큰 몸 (거구 · 무거움) 이 빠르게 지나가다 모르는 엎드린 몸과 겹침 — 아는 몸은 (치거나) 비켜 감
function lieTrample(W, a, b){
  const fa = !!a.lie && !a.lieSw, fb = !!b.lie && !b.lieSw; if (fa === fb) return;
  const t = fa ? a : b, g = fa ? b : a, T = LIE(W).trample || {};
  if (g.side === t.side || g.kb || g.down || !(g.giant || g.mass >= (T.mass || 180))) return;
  const sp = Math.hypot(g.vx || 0, g.vy || 0); if (sp < (T.v || 0.8)) return;
  if ((t.lieSeen && t.lieSeen[g.i] != null) || g.target === t || (g.act && g.act.b === t.i)) return;
  const C = t.trT || (t.trT = {}); if (W.t - (C[g.i] == null ? -9 : C[g.i]) < (T.cd || 1.5)) return; C[g.i] = W.t;
  (t.lieSeen || (t.lieSeen = {}))[g.i] = W.t; g.sense[t.i] = { x: t.x, y: t.y, t: W.t, exact: true };
  L(W, { k: 'trample', a: g.i, b: t.i, sp: +sp.toFixed(1), vis: t.side === 0 || !!g.seenBy });
  hurtRaw(W, g, t, (T.k || 0.12) * g.mass * Math.min(1.5, sp / 2), { tag: '짓밟힘 — 모르고 밟음' });
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '밟힘!', c: 'd', t0: W.t });
}
'''
s = rep(s, "\nfunction stealthK(W, t){", LIE + "\nfunction stealthK(W, t){")

s = rep(s, "statsOf, mulberry32, canSee, rock, dropTorch };", "statsOf, mulberry32, canSee, rock, dropTorch, lieSet, lieHid, lieTick, lieTrample, lieFlash, prone };")
wr('rt3_tail.js', s)
print('patch711 engine OK')
