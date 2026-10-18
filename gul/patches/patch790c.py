# v7.9.1 엔진: 정찰 방침 (파악만 · 암살 · 생존 우선) · 희생 돌격 명령
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
h=open(D+'rt3_head.js').read()
h=rep(h,"  scout: { look: 1.5, max: 16, near: 4.5,","  scout: { nearSv: 7.5, lookSv: 0.8, fleeSv: 6.5, killD: 12, look: 1.5, max: 16, near: 4.5,")
h=rep(h,"   v7.9.0: 교전 규칙","""   v7.9.1: 정찰은 방침을 정함 — 파악만 (look, 기본: 가서 보고 돌아와 보고) · 암살 (kill: 닿은 곳에서 홀로 있는 (곁 동료 1 이하) 모르는 상대를 골라 숨어 등 뒤로) · 생존 우선 (survive: 더 멀리서 (7.5칸) 짧게 보고, 가까이 오거나 나를 보는 적이 6.5칸 안이면 곧 조용히 빠짐 —
           들켰는데 혼자고 쫓는 상대가 둘 이상이면 온 힘으로 지휘관 쪽으로 뜀 (로그 scoutSprint). 숨은 채 걷다가 들키지 않았으면 달리지 않음). 희생 돌격 (sac): 지정한 한 명이 아는 적 중 가장 값진 쪽 (지휘 · 사수 · 약한 고리 · 가까움) 으로 스스로 돌격해 죽을 때까지 싸움 — 치료 · 후퇴 없음, 1.5초마다 표적을 다시 고름.
   v7.9.0: 교전 규칙""")
open(D+'rt3_head.js','w').write(h)
t=open(D+'rt3_tail.js').read()
# 정찰: 방침
t=rep(t,"""  const S = u.sc; if (u.posUnk) S.wentOut = true;
  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f)) S.seen[f.i] = { x: f.x, y: f.y, t: W.t, look: looks(f) };
  if (S.ph !== 'flee' && W.units.some(e => e.alive && e.side !== u.side && canSee(W, e, u) && (e.target === u || focusOf(W, e) === u || dist(e, u) < 2.2))){ S.ph = 'flee'; L(W, { k: 'scoutFlee', a: u.i, vis: true }); }
  if (S.ph === 'out'){
    const near = W.units.filter(f => f.alive && f.side !== u.side && canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
    if (Math.hypot(S.x - u.x, S.y - u.y) < 0.8 || (near && dist(u, near) <= (SC.near || 4.5)) || W.t - S.t0 > (SC.max || 16) * 0.6){ S.ph = 'look'; S.lookT = W.t; stop(u); }""",
"""  const S = u.sc; if (u.posUnk) S.wentOut = true;
  const pol = o.pol || 'look', sv = pol === 'survive';   // v7.9.1 정찰 방침
  for (const f of W.units) if (f.alive && f.side !== u.side && canSee(W, u, f)) S.seen[f.i] = { x: f.x, y: f.y, t: W.t, look: looks(f) };
  const seers = W.units.filter(e => e.alive && e.side !== u.side && canSee(W, e, u) && (e.target === u || focusOf(W, e) === u || dist(e, u) < 2.2 || (sv && dist(e, u) < (SC.fleeSv || 6.5))));
  if (S.ph !== 'flee' && seers.length){ S.ph = 'flee'; L(W, { k: 'scoutFlee', a: u.i, pol, vis: true }); }
  if (sv && S.ph === 'flee' && !S.sprint && seers.length >= 2 && !W.units.some(a => a.alive && a.side === u.side && a !== u && dist(a, u) < 6)){ S.sprint = true; L(W, { k: 'scoutSprint', a: u.i, n: seers.length, vis: true }); }   // 홀로 들켰고 쫓는 상대가 여럿 → 온 힘으로 본진으로
  if (sv && S.ph !== 'flee' && S.ph !== 'back' && W.units.some(e => e.alive && e.side !== u.side && !isFar(e) && dist(e, u) < 3 && !canSee(W, e, u))) S.ph = 'back';   // 모르는 적이 코앞 — 조용히 빠짐
  if (S.ph === 'out'){
    const near = W.units.filter(f => f.alive && f.side !== u.side && canSee(W, u, f)).sort((a, b) => dist(u, a) - dist(u, b))[0];
    if (Math.hypot(S.x - u.x, S.y - u.y) < 0.8 || (near && dist(u, near) <= (sv ? SC.nearSv || 7.5 : SC.near || 4.5)) || W.t - S.t0 > (SC.max || 16) * 0.6){ S.ph = 'look'; S.lookT = W.t; stop(u);
      if (pol === 'kill'){ const k = scoutKillPick(W, u); if (k){ L(W, { k: 'scoutKill', a: u.i, b: k.i, vis: true }); u.order = { k: 'assn', b: k.i, fromScout: true }; u.sc = null; return; } } }""")
t=rep(t,"if (W.t - S.lookT >= (SC.look || 1.5)) S.ph = 'back'; return; }","if (W.t - S.lookT >= (sv ? SC.lookSv || 0.8 : SC.look || 1.5)) S.ph = 'back'; return; }")
t=rep(t,"  if (S.ph === 'flee') u.mv = { k: 'scoutRun', run: true, until: W.t + 0.3, x: S.hx, y: S.hy };","  if (S.ph === 'flee' && (!sv || S.sprint || seers.some(e => e.target === u || dist(e, u) < 3.5))) u.mv = { k: 'scoutRun', run: true, until: W.t + 0.3, x: S.hx, y: S.hy };   // v7.9.1 생존 우선은 들켰어도 쫓기는 게 아니면 조용히 걸음")
t=rep(t,"function scoutReport(W, u){","""// v7.9.1 암살 방침: 닿은 곳에서 홀로 (곁 동료 1 이하) 모르는 상대 중 값진 쪽
function scoutKillPick(W, u){
  const A = ASN(W), SC = W.rules.scout || {}; if (!A || !(u.assnE > 0)) return null;
  let best = null, bs = -1e9;
  for (const f of W.units){ if (!f.alive || f.down || f.side === u.side || !canSee(W, u, f) || dist(u, f) > (SC.killD || 12) || supportOf(W, f) > 1 || aware(W, f, u)) continue;
    const s = -dist(u, f) * 0.5 + (f.cmd ? 4 : 0) + (isFar(f) ? 3 : 0) + (f.hp / f.max < 0.5 ? 1 : 0) - (f.giant || f.modBody || f.bodyShield ? 5 : 0); if (s > bs){ bs = s; best = f; } }
  return best;
}
// v7.9.1 희생 돌격: 지정한 한 명이 아는 적 중 가장 값진 쪽으로 스스로 돌격해 쓰러질 때까지 (치료 · 후퇴 없음)
function sacStep(W, u, dt){
  const o = u.order; if (o.t0 == null){ o.t0 = W.t; u.stealth = false; L(W, { k: 'sac', a: u.i, vis: true }); }
  const knownF = f => f.alive && !f.down && f.side !== u.side && (f.seenBy || fresh(W, u.sense[f.i], 5));
  let t = o.b != null && W.units[o.b] && knownF(W.units[o.b]) ? W.units[o.b] : null;
  if (!t || W.t >= (o.reT || 0)){ o.reT = W.t + 1.5;
    const sc = f => -dist(u, f) * 0.6 + (f.cmd ? 4 : 0) + (isFar(f) ? 3 : 0) + (prone(W, f) ? 2 : 0) + (f.hp / f.max < 0.4 ? 1.5 : 0) + (t === f ? 1.5 : 0) - (f.giant || f.bodyShield ? 2 : 0);
    const c = W.units.filter(knownF).sort((a, b) => sc(b) - sc(a))[0]; t = c || null; o.b = t ? t.i : null; }
  if (!t){
    const s = W.units.filter(f => f.alive && f.side !== u.side).map(f => u.sense[f.i]).filter(x => fresh(W, x, 8)).sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0];
    if (s && Math.hypot(s.x - u.x, s.y - u.y) > 0.8){ setMood(W, u, '희생 돌격 — 적을 찾아 감'); goTo(W, u, s.x, s.y, dt); return; }
    if (W.t - o.t0 > 25){ u.order = null; u.stay = { x: u.x, y: u.y }; return; }
    stop(u); setMood(W, u, '희생 돌격 — 적을 기다림'); return; }
  const see = canSee(W, u, t);
  if (see) u.last = { x: t.x, y: t.y };
  setMood(W, u, '희생 돌격', t.i); u.target = t; u.state = 'fight';
  fight(W, u, t, dt, see || (u.last && Math.hypot(u.x - u.last.x, u.y - u.last.y) > 0.4), true);
}
function scoutReport(W, u){""")
t=rep(t,"  if (o.k === 'scout'){ scoutStep(W, u, dt); return; }   // v7.5 정찰","  if (o.k === 'scout'){ scoutStep(W, u, dt); return; }   // v7.5 정찰\n  if (o.k === 'sac'){ sacStep(W, u, dt); return; }   // v7.9.1 희생 돌격")
t=rep(t,"module.exports = { sendPosture,","module.exports = { scoutKillPick, sacStep, sendPosture,")
open(D+'rt3_tail.js','w').write(t); print('ok')
