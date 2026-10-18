# v7.9.0 엔진: 교전 규칙 (자유 · 판단 · 교전 금지 · 사격 금지) · 충동 (성향 · 분노 · 약점으로 계산) · 치료는 위급할 때만 + 눈앞 위협이면 미룸 · 주무장이 근접이면 활을 안 줍음 · 후각 범위 넓힘
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D+f).read()
def wr(f,s): open(D+f,'w').write(s)
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
h=rd('rt3_head.js')
h=rep(h,"  smellFar: 9,        // 후각 A","  smellFar: 14,       // v7.9 (9 → 14) 후각 A")
h=rep(h,"  briefT: 3,          // 아군 후각 (포렌) 이 보이지 않는 적의 방향 · 거리를 알리는 간격 (초)","  briefT: 2,          // v7.9 (3 → 2) 아군 후각 (포렌) 이 보이지 않는 적의 방향 · 거리를 알리는 간격 (초) — 상시 척후")
h=rep(h,"  smellG: { S: [5, 999], A: [4, 9], B: [3, 7], C: [2, 5] },","  smellG: { S: [5, 999], A: [4, 14], B: [3, 12], C: [2, 8] },")
h=rep(h,"  healAt: 0.75,       // 체력 75% 아래부터 치유","""  healAt: 0.75,       // 체력 75% 아래부터 치유 (전담 치유사 cls '치유' 만 — 구급상자 든 동료는 아래 heal)
  roe: { def: 'smart', odds: 0.9, out: 0.7, outLim: 4.5, impulse: 0.62, hitT: 6, noticeD: 10, selfD: 0.35, logGap: 6 },   // v7.9 교전 규칙 — def 기본 태세 (free 자유 · smart 판단 · hold 교전 금지 · nofire 사격 금지) · odds 이 비율 이상 우세하면 들키기 전에도 먼저 침 · out 이 비율 아래 열세 (들킨 뒤) 면 outLim 칸 안에서만 막음 · impulse 성향 · 분노 · 약점이 이 점수를 넘으면 스스로 교전 (충동)
  heal: { pol: 'dying', dying: 0.22, bleed: 0.35, rescue: 0.12, lethal: 0.3 },   // v7.9 치료 — pol 기본 (dying 죽기 직전만 · free 옛 방식 · order 명령만) · dying 체력 비율 아래 · bleed 피 흘리며 이 아래 · rescue 이 아래면 위협을 무릅쓰고도 달려감 · lethal 나를 노리는 일격이 내 체력의 이 비율 넘으면 치명적""")
h=rep(h,"   v7.8.5: 횃불을 든 이가","""   v7.9.0: 교전 규칙 (태세) — 명령 없이 돌격하고 사격하는 것이 패착의 대부분. 아군마다 자유 교전 · 판단 교전 (기본) · 교전 금지 · 사격 금지. 판단 교전은 들켰거나 (적이 쫓음) · 전선이 열렸거나 (동료가 맞음) · 확실히 우세할 때만 먼저 싸움 — 열세인데 아직 안 들켰으면 지켜봄.
           충동 = 성향 (대담함) + 분노 (동료가 쓰러짐) + 상대의 약점 (등 · 사수 · 넘어짐) − 두려움 (상처 · 지침) 의 점수로 계산 (무작위 아님). 넘으면 규칙을 어기고 스스로 덤빔 — 로그에 까닭이 남음.
           치료는 명령이 없으면 죽기 직전 (체력 22% 아래 · 피 흘리며 35% 아래 · 기절 · 쓰러진 불사) 만. 나를 노린 치명적인 일격이 오는 걸 알아봤으면 치료를 시작하지 않고 (아주 위급한 동료는 무릅쓰고 감) — 명령은 그대로 따름.
           주무장이 근접 (맨손 포함) 이면 땅의 활 · 총을 줍지 않음 (사격 솜씨가 없으면). 후각: 상시 브리핑 2초 간격 · 범위 A 14 · B 12 · C 8칸 (청광묵 [후각B] 이 척후).
   v7.8.5: 횃불을 든 이가""")
wr('rt3_head.js',h)

t=rd('rt3_tail.js')
# 1) 유닛 필드
t=rep(t,"      sense: {}, briefAt: 0, briefPrev: {}, pack: p.tac === 'pack', stalk: p.tac === 'stalk', barkAt: -9, ambushes: 0,",
        "      sense: {}, briefAt: 0, briefPrev: {}, pack: p.tac === 'pack', stalk: p.tac === 'stalk', barkAt: -9, ambushes: 0, roe: null, healPol: null, quiet: -9, impT: -9, roeLogT: -9,   // v7.9 교전 규칙 · 치료 방침 · 교전 보류 때 · 충동 때")
# 2) 교전 규칙 블록 (cmdTick 앞)
BLOCK = r"""/* ---------- v7.9 교전 규칙 (태세) ----------
   "명령 없이 돌격하고 사격하는 것이 패착의 90%" — 아군마다 교전 규칙을 가짐 (유저가 바꿈, 명령처럼 지휘관을 거쳐 닿음).
   자유 교전 free = 보이면 싸움 (옛 방식) · 판단 교전 smart (기본) = 들켰거나 · 전선이 열렸거나 · 확실히 우세할 때만 먼저 싸움 · 교전 금지 hold = 나를 노리는 상대를 막는 것 외엔 쏘지도 쫓지도 않음 · 사격 금지 nofire = 명령이 있을 때까지 쏘지 (던지지) 않음 (근접은 그대로).
   충동 impulse: 규칙을 어기고 스스로 덤빌지는 무작위가 아니라 점수 — 대담함 + 분노 (동료가 쓰러짐) + 상대의 약점 (등 · 사수 · 넘어짐 · 다침) − 두려움 (상처 · 지침). 넘으면 덤비고 그 까닭을 로그에 남김 (큰 이득 또는 고립 · 죽음). */
const ROE_TXT = { free: '자유 교전', smart: '판단 교전', hold: '교전 금지', nofire: '사격 금지' };
const roeOf = (W, u) => u.side !== 0 ? 'free' : (u.roe || (W.rules.roe || {}).def || 'smart');
const powOf = u => u.down || !u.alive ? 0 : Math.max(1, u.hp) * Math.max(8, u.atk || 20) * (u.crawl ? 0.3 : 1);
// 지금 전황 (0.5초마다): 들켰나 · 전선이 열렸나 · 아군/적 힘의 비
function engTick(W){
  const R = W.rules.roe || {}, al = W.units.filter(u => u.alive && u.side === 0 && !u.down);
  if (!al.length){ W.eng = null; return; }
  const kn = f => f.alive && f.side === 1 && (f.seenBy || al.some(a => fresh(W, a.sense[f.i], 3))), foes = W.units.filter(kn);
  const hit = al.some(a => W.t - (a.hitT || -99) < (R.hitT || 6)) || foes.some(f => f.act && f.act.b != null && W.units[f.act.b] && W.units[f.act.b].side === 0 && f.act.phase === 'wind');
  const noticed = W.units.some(f => f.alive && f.side === 1 && f.state === 'hunt' && f.target && f.target.side === 0 && f.target.alive && dist(f, f.target) < (R.noticeD || 10));
  let odds = Infinity, nA = 0;
  if (foes.length){
    const cx = foes.reduce((s, f) => s + f.x, 0) / foes.length, cy = foes.reduce((s, f) => s + f.y, 0) / foes.length;
    const A = al.filter(a => Math.hypot(a.x - cx, a.y - cy) < 16).reduce((s, a) => { nA++; return s + powOf(a); }, 0), B = foes.reduce((s, f) => s + powOf(f), 0);
    odds = B > 0 ? A / B : Infinity;
  }
  const open = hit || noticed, was = W.eng && W.eng.open;
  W.eng = { t: W.t, open, hit, noticed, odds, nF: foes.length, nA, out: open && odds < (R.out != null ? R.out : 0.7) };
  if (open && !was) L(W, { k: 'engOpen', why: hit ? '동료가 맞음' : '적이 우리를 쫓음', odds: odds === Infinity ? null : +odds.toFixed(2), nF: foes.length, vis: true });
}
// 나를 지키는 싸움 (교전 금지에서도 허용): 나를 노려 준비 중 · 방금 맞았고 가까이 있음 · 손 닿는 곳에서 나를 쫓음
function selfDef(W, u, f){
  const R = W.rules.roe || {};
  if (f.act && f.act.b === u.i) return true;
  if (W.t - (u.hitT || -99) < 2.5 && gap(u, f) < Math.max(f.rng, 0.6) + 1.2) return true;
  return gap(u, f) < Math.max(f.rng, 0.5) + (R.selfD != null ? R.selfD : 0.35) && (f.target === u || f.state === 'hunt');
}
// 충동 점수: 대담함 · 분노 · 약점 · 두려움 (+ 지휘와 끊김). 무작위 아님
function impulseOf(W, u, f){
  const hpF = u.hp / u.max, dead = W.units.filter(a => a.side === u.side && a !== u && (!a.alive || a.down) && W.t - (a.deadT != null ? a.deadT : a.downT != null ? a.downT : -99) < 25).length;
  const anger = Math.min(1, dead * 0.45), vuln = Math.min(1, (isFar(f) && !f.act ? 0.45 : 0) + (sideOf(W, f, u) !== 'front' ? 0.4 : 0) + (prone(W, f) ? 0.4 : 0) + (f.hp / f.max < 0.35 ? 0.3 : 0) + (f.state !== 'hunt' ? 0.2 : 0));
  const fear = Math.min(1, (1 - hpF) * 0.6 + (u.exhausted ? 0.3 : u.tired ? 0.15 : 0)), cut = u.posUnk ? 0.1 : 0;
  const s = 0.45 * (u.bold || 0) + 0.3 * anger + 0.35 * vuln - 0.5 * fear + cut;
  return { s, bold: u.bold || 0, anger, vuln, fear, cut };
}
function impulseOK(W, u, f, m){
  const R = W.rules.roe || {}, I = impulseOf(W, u, f), thr = (R.impulse != null ? R.impulse : 0.62) + (m === 'hold' ? 0.18 : 0);
  if (I.s < thr) return false;
  if (W.t - u.impT > 8){ u.impT = W.t;
    L(W, { k: 'impulse', a: u.i, b: f.i, m, s: +I.s.toFixed(2), thr: +thr.toFixed(2), bold: +I.bold.toFixed(2), anger: +I.anger.toFixed(2), vuln: +I.vuln.toFixed(2), fear: +I.fear.toFixed(2), vis: true }); }
  return true;
}
// 교전 규칙이 막는가: '' (허용) · 'nofire' · 'hold' · 'quiet'. kind 'fire' = 쏨 · 던짐
function roeBlock(W, u, f, kind){
  if (u.side !== 0) return '';
  const m = roeOf(W, u); if (m === 'free') return '';
  if (m === 'nofire') return kind === 'fire' || (kind == null && isFar(u)) ? 'nofire' : '';
  if (selfDef(W, u, f)) return '';
  const E = W.eng, R = W.rules.roe || {};
  if (m === 'smart' && (!E || E.open || E.odds >= (R.odds != null ? R.odds : 0.9))) return '';
  if (impulseOK(W, u, f, m)) return '';
  return m === 'hold' ? 'hold' : 'quiet';
}
function roeNote(W, u, f, why){
  u.quiet = W.t; const R = W.rules.roe || {};
  if (W.t - u.roeLogT < (R.logGap || 6)) return; u.roeLogT = W.t;
  const E = W.eng;
  L(W, { k: 'roeHold', a: u.i, b: f.i, why, m: roeOf(W, u), odds: E && E.odds !== Infinity ? +E.odds.toFixed(2) : null, vis: true });
  setMood(W, u, why === 'nofire' ? '사격 금지' : why === 'hold' ? '교전 금지' : '지켜봄 — 교전 보류', f.i);
}
// 태세 바꾸기 (교전 규칙 · 치료 방침): 명령처럼 지휘관을 거쳐 닿음. 같은 종류를 다시 보내면 앞의 것을 대신함 (늦게 닿은 옛 것이 새것을 덮지 않음)
const POSTURES = { roe: ['free', 'smart', 'hold', 'nofire'], heal: ['dying', 'free', 'order'] };
function applyPosture(W, u, key, val, c){
  const prev = key === 'roe' ? roeOf(W, u) : (u.healPol || (W.rules.heal || {}).pol || 'dying');
  if (key === 'roe') u.roe = val; else u.healPol = val;
  if (prev !== val) L(W, { k: 'posture', a: u.i, key, val, prev, c: c != null ? c : null, vis: true });
}
function sendPosture(W, list, key, val, opt){
  if (!POSTURES[key] || !POSTURES[key].includes(val)) return;
  const C = cmdBoss(W, 0), pre = W.t <= 1e-6, raw = opt && opt.raw;
  for (const u of list){ if (!u.alive || u.side !== 0) continue;
    const lk = raw || pre ? { p: 1, t: 0, via: 'self' } : cmdLink(W, C, u);
    u.posPend = (u.posPend || []).filter(q => q.key !== key);
    if (lk.via === 'self'){ applyPosture(W, u, key, val, C ? C.i : null); continue; }
    u.posPend.push({ key, val, at: W.t + lk.t, ok: W.rand() < lk.p, p: lk.p, via: lk.via, why: lk.why, c: lk.c, t0: W.t });
  }
}
function postureTick(W){
  for (const u of W.units){ if (u.side !== 0 || !u.posPend || !u.posPend.length) continue;
    const keep = [];
    for (const P of u.posPend){ if (W.t < P.at){ keep.push(P); continue; } if (!u.alive) continue;
      if (P.ok){ applyPosture(W, u, P.key, P.val, P.c); }
      else { L(W, { k: 'cmdMiss', side: 0, a: u.i, c: P.c, via: P.via, why: P.why, p: +P.p.toFixed(2), o: (P.key === 'roe' ? ROE_TXT[P.val] : '치료 방침') + ' 태세', vis: true }); } }
    u.posPend = keep; }
}
// 치료: 이 동료를 지금 치료할 만한가 — 0 아님 · 1 치료할 만함 (옛 기준) · 2 죽기 직전
function healTier(W, u, a, thr){
  const H = W.rules.heal || {}, K = u.skill, f = a.hp / a.max;
  if (K && K.kit && a.down) return 2;
  if (!a.alive) return 0;
  if (f < (H.dying != null ? H.dying : 0.22) || (a.bleed && f < (H.bleed != null ? H.bleed : 0.35)) || injUrgent(W, a)) return 2;
  return f < thr || a.bleed ? 1 : 0;
}
// 나를 노린 치명적인 일격이 오고 있고 내가 그걸 알아봤나 (보이거나 아주 가까움): 그 상대를 돌려줌
function perilOn(W, u){
  const H = W.rules.heal || {}; let best = null;
  for (const e of W.units){
    if (!e.alive || e.side === u.side || !e.act || e.act.b !== u.i || e.act.phase !== 'wind') continue;
    if (!(canSee(W, u, e) || gap(u, e) < 2.2)) continue;
    if (!isFar(e) && gap(u, e) > e.rng + W.rules.reach + 0.6) continue;
    if ((e.atk || 20) < u.hp * (H.lethal != null ? H.lethal : 0.3)) continue;
    const eta = Math.max(0, (e.act.end || W.t) - W.t); if (!best || eta < best.eta) best = { e, eta };
  }
  return best;
}
// v7.9 주무장이 근접 (맨손 포함) 이면 땅의 활 · 총을 쓰지 않음 — 사격 솜씨가 없는데 주워서 쏘는 건 말이 안 됨
function mayWield(W, u, it){
  const wp = (W.rules.weapons || {})[it.name]; if (!wp || !isRangedW(wp)) return true;
  const k0 = (W.rules.weapons || {})[(u.kit0 && u.kit0.weapon) || ''];
  return (k0 && isRangedW(k0)) || (u.mk0 || 0) >= 0.24 || u.role === '사수';
}
"""
t=rep(t,"// 아군 명령 전달: 유저가 준 명령 (ordPend) 은 닿는 때 받음", BLOCK+"// 아군 명령 전달: 유저가 준 명령 (ordPend) 은 닿는 때 받음")
t=rep(t,"function cmdTick(W){\n","function cmdTick(W){\n  postureTick(W);   // v7.9 태세가 닿음\n")
t=rep(t,"posKnownTick(W); planShadow(W);","posKnownTick(W); engTick(W); planShadow(W);")
# 3) think: 아군 자동 전투 거름
t=rep(t,"""  const anchor = u.stay || (hero && !u.hero ? hero : u), lim = u.stay ? R.stayLeash || 4 : R.leash;
  const seen = foes.filter(f => canSee(W, u, f) && ((u.hero && !u.stay) || dist(f, anchor) <= lim)).sort((a, b) => dist(u, a) - dist(u, b));
""","""  const anchor = u.stay || (hero && !u.hero ? hero : u); let lim = u.stay ? R.stayLeash || 4 : R.leash;
  const rm = roeOf(W, u);
  if (rm === 'smart' && W.eng && W.eng.out) lim = Math.min(lim, (R.roe || {}).outLim || 4.5);   // v7.9 열세로 싸움이 열렸으면 제 자리 둘레에서만 막음 (쫓아 나가지 않음)
  const seen = foes.filter(f => canSee(W, u, f) && ((u.hero && !u.stay) || dist(f, anchor) <= lim)).sort((a, b) => dist(u, a) - dist(u, b));
  if (rm !== 'free'){   // v7.9 교전 규칙이 막는 상대는 거름
    const blocked = []; for (let k = seen.length - 1; k >= 0; k--){ const why = roeBlock(W, u, seen[k]); if (why){ blocked.push([seen[k], why]); seen.splice(k, 1); } }
    if (!seen.length && blocked.length){ roeNote(W, u, blocked[blocked.length - 1][0], blocked[blocked.length - 1][1]); u.target = null; u.state = u.stay ? 'stay' : u.hero || !hero ? 'explore' : 'follow'; return; }
  }
""")
t=rep(t,"""  const sx = foes.map(f => [f, u.sense[f.i]]).filter(([f, s]) => s && s.exact && W.t - s.t < 2.5 && dist(u, f) <= 8).sort(""",
        """  const sx = foes.map(f => [f, u.sense[f.i]]).filter(([f, s]) => s && s.exact && W.t - s.t < 2.5 && dist(u, f) <= 8 && !(rm !== 'free' && roeBlock(W, u, f))).sort(""")
t=rep(t,"""!(u.blind && (isFar(u) || Math.hypot(s.x - u.x, s.y - u.y) > 2.5))).sort(""","""!(u.blind && (isFar(u) || Math.hypot(s.x - u.x, s.y - u.y) > 2.5)) && !(rm !== 'free' && roeBlock(W, u, f))).sort(""")
# 치유사 (cls 치유) 도 방침을 따름
t=rep(t,"""    const hurt = W.units.filter(a => a.alive && a.side === u.side && (a.hp < a.max * R.healAt || a.bleed || injUrgent(W, a))).sort(""",
        """    const need = u.side === 0 ? ((u.healPol || (R.heal || {}).pol || 'dying') === 'free' ? 1 : (u.healPol || (R.heal || {}).pol || 'dying') === 'order' ? 9 : 2) : 1;   // v7.9
    const hurt = W.units.filter(a => a.alive && a.side === u.side && healTier(W, u, a, R.healAt) >= need && !(u.side === 0 && perilOn(W, u) && healTier(W, u, a, R.healAt) < 2)).sort(""")
# 4) 탐험: 교전 보류 중엔 적 쪽으로 더듬어 가지 않음
t=rep(t,"      const f = u.hero ? frontier(W, u) || nearestFoe(W, u) : nearestFoe(W, u);   // 횃불 없는 동료는 남은 적 쪽으로 더듬어 감",
        "      const qt = W.t - u.quiet < 3;   // v7.9 교전 보류 중이면 적 쪽으로 가지 않음 (안 가본 곳만 살핌)\n      const f = u.hero ? frontier(W, u) || (qt ? null : nearestFoe(W, u)) : (qt ? null : nearestFoe(W, u));   // 횃불 없는 동료는 남은 적 쪽으로 더듬어 감")
# 5) 사격 금지
t=rep(t,"""function shoot(W, u, t, dt, ordered){
  if (needReload(u)){ startReload(W, u); return; }
""","""function shoot(W, u, t, dt, ordered){
  if (needReload(u)){ startReload(W, u); return; }
  if (!ordered && u.side === 0 && roeOf(W, u) === 'nofire'){ stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); roeNote(W, u, t, 'nofire'); return; }   // v7.9 사격 금지: 명령이 있을 때까지 쏘지 않음
""")
t=rep(t,"  const cands = ordered ? [t] : W.units.filter(f => f.alive && f.side !== u.side && know(f) && canSee(W, u, f));",
        "  const cands = ordered ? [t] : W.units.filter(f => f.alive && f.side !== u.side && know(f) && canSee(W, u, f) && !(u.side === 0 && roeBlock(W, u, f, 'fire')));   // v7.9 사격 금지 · 교전 금지면 던지지 않음")
# 6) 제자리 명령도 교전 규칙
t=rep(t,"""    if (u.cls === '치유'){
      const h = W.units.filter(a => a.alive && a.side === u.side && a.hp < a.max * W.rules.healAt && gap(u, a) <= u.rng).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
      if (h){ startAct(W, u, h); return; }
    }
    const seen = foes.filter(f => canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b));""","""    if (u.cls === '치유'){
      const need = (u.healPol || (W.rules.heal || {}).pol || 'dying') === 'free' ? 1 : (u.healPol || (W.rules.heal || {}).pol || 'dying') === 'order' ? 9 : 2;   // v7.9
      const h = W.units.filter(a => a.alive && a.side === u.side && healTier(W, u, a, W.rules.healAt) >= need && gap(u, a) <= u.rng).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
      if (h){ startAct(W, u, h); return; }
    }
    const seen = foes.filter(f => canSee(W, u, f) && !roeBlock(W, u, f, isFar(u) ? 'fire' : 'melee')).sort((a, b) => dist(u, a) - dist(u, b));   // v7.9""")
# 7) 응급: 죽기 직전만 + 눈앞 치명적 위협이면 미룸
OLD="""  const R = W.rules, far = u.side === 0 && u.order ? R.skillReach : R.leash, thr = K.auto != null ? K.auto : R.bucketAuto;
  // 구급상자: 쓰러진 [불사] 동료가 먼저
  const v = W.units.filter(a => a.side === u.side && ((a.alive && (a.hp < a.max * thr || a.bleed || injUrgent(W, a))) || (K.kit && a.down)) && dist(a, u) <= far).sort("""
NEW="""  const R = W.rules, far = u.side === 0 && u.order ? R.skillReach : R.leash, thr = K.auto != null ? K.auto : R.bucketAuto;
  const pol = u.side === 0 ? (u.healPol || (R.heal || {}).pol || 'dying') : 'free', need = pol === 'free' ? 1 : pol === 'order' ? 9 : 2;   // v7.9 명령이 없으면 죽기 직전만
  // 구급상자: 쓰러진 [불사] 동료가 먼저
  const v = W.units.filter(a => a.side === u.side && healTier(W, u, a, thr) >= need && dist(a, u) <= far).sort("""
t=rep(t,OLD,NEW)
t=rep(t,"""  if (v === u || gap(u, v) <= K.rng){ startSkill(W, u, v, true); return true; }
  setMood(W, u, '응급', v.i); goTo(W, u, v.x, v.y, dt); return true;""","""  // v7.9 나를 노린 치명적인 일격이 오는 걸 알아봤으면 치료를 시작하지 않음 — 곁의 동료가 아주 위급 (rescue) 하면 무릅쓰고 감
  const pr = u.side === 0 ? perilOn(W, u) : null;
  if (pr){
    const H = R.heal || {}, desp = v.down || v.hp / v.max < (H.rescue != null ? H.rescue : 0.12);
    if (!desp){ if (W.t - (u.healDeferT || -9) > 3){ u.healDeferT = W.t; L(W, { k: 'healDefer', a: u.i, b: v.i, by: pr.e.i, eta: +pr.eta.toFixed(2), hp: Math.round(v.hp / v.max * 100), vis: true }); } return false; }
    if (W.t - (u.healRiskT || -9) > 3){ u.healRiskT = W.t; L(W, { k: 'healRisk', a: u.i, b: v.i, by: pr.e.i, eta: +pr.eta.toFixed(2), hp: Math.round(v.hp / v.max * 100), vis: true }); }
  }
  if (v === u || gap(u, v) <= K.rng){ startSkill(W, u, v, true); return true; }
  setMood(W, u, '응급', v.i); goTo(W, u, v.x, v.y, dt); return true;""")
# 8) 줍기
t=rep(t,"  const it = W.items.filter(x => (x.k === 'weapon' || x.k === 'spear') && canTake(W, u, x) && Math.hypot(x.x - u.x, x.y - u.y) < 5 && safeItem(W, u, x))",
        "  const it = W.items.filter(x => (x.k === 'weapon' || x.k === 'spear') && canTake(W, u, x) && mayWield(W, u, x) && Math.hypot(x.x - u.x, x.y - u.y) < 5 && safeItem(W, u, x))")
# 내보내기
t=rep(t,"if (typeof module !== 'undefined') module.exports = { torchGetStep,","if (typeof module !== 'undefined') module.exports = { sendPosture, roeOf, engTick, roeBlock, healTier, perilOn, impulseOf, mayWield, ROE_TXT, torchGetStep,")
wr('rt3_tail.js',t)
print('ok')
