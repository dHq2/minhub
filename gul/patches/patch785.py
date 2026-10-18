# v7.8.5 엔진: 여분 횃불 꾸러미 (지닌 사람 · 쓰러지면 몸 곁) · 횃불 가져오기 명령 · 새 횃불 붙이기 · 내려놓기 로그 이름
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D+f).read()
def wr(f,s): open(D+f,'w').write(s)
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
h=rd('rt3_head.js')
h=rep(h,"  torchOn: 0.8, torchOff: 0.2,","  torchOn: 0.8, torchOff: 0.2, torchNew: 1.5,   // v7.8.5 torchNew: 여분 꾸러미에서 새 횃불을 꺼내 불을 붙이는 데 걸리는 시간 (초)\n ")
h=rep(h,"  spareTorches: 3,    // 주인공이 내려놓을 수 있는 횃불 수","  spareTorches: 3,    // 여분 횃불 수 — v7.8.5 꾸러미는 주인공이 지님 (쓰러지면 몸 곁에 떨어지고 동료가 챙김)")
h=rep(h,"   v7.8.4: 사수가","   v7.8.5: 횃불을 든 이가 쓰러져도 다시 빛을 — 여분 횃불 꾸러미는 지닌 사람 (처음엔 주인공) 이 있고, 쓰러지면 몸 곁에 떨어짐 · '횃불 가져오기' 명령: 가까운 떨어진 횃불을 줍거나 꾸러미에서 하나 꺼내 불을 붙임 (1.5초) · 여분 던지기 · 내려놓기는 꾸러미를 지닌 이만.\n   v7.8.4: 사수가")
wr('rt3_head.js',h)
t=rd('rt3_tail.js')
# 처음: 꾸러미는 주인공 (없으면 첫 아군)
t=rep(t,"  for (const u of W.units){ u.stealthE = stealthOf(W, u); u.assnE = assnSkill(W, u); }   // v7.5 숨는 솜씨   // v7.6 암살 솜씨\n",
      "  for (const u of W.units){ u.stealthE = stealthOf(W, u); u.assnE = assnSkill(W, u); }   // v7.5 숨는 솜씨   // v7.6 암살 솜씨\n  { const h = W.units.find(u => u.side === 0 && u.hero) || W.units.find(u => u.side === 0); W.spareBy = h && W.spare > 0 ? h.i : null; W.spareAt = null; }   // v7.8.5 여분 횃불 꾸러미를 지닌 이\n")
# 쓰러지면: 든 횃불 + 꾸러미가 떨어짐
t=rep(t,"    if (t.torch){ t.torch = false; W.torches.push({ x: +t.x.toFixed(2), y: +t.y.toFixed(2), dropped: true, fell: true, off: !!t.torchOff }); t.torchOff = false; computeLight(W); L(W, { k: 'torchDrop', a: t.i, x: +t.x.toFixed(2), y: +t.y.toFixed(2) }); }\n",
      "    if (t.torch){ t.torch = false; W.torches.push({ x: +t.x.toFixed(2), y: +t.y.toFixed(2), dropped: true, fell: true, off: !!t.torchOff }); t.torchOff = false; computeLight(W); L(W, { k: 'torchDrop', a: t.i, x: +t.x.toFixed(2), y: +t.y.toFixed(2) }); }\n    if (W.spareBy === t.i){ W.spareBy = null; if (W.spare > 0){ W.spareAt = { x: +t.x.toFixed(2), y: +t.y.toFixed(2), by: t.i }; L(W, { k: 'spareDrop', a: t.i, n: W.spare, x: W.spareAt.x, y: W.spareAt.y }); } }   // v7.8.5 여분 꾸러미도 몸 곁에\n")
# 던지기: 여분은 꾸러미를 지닌 이만
t=rep(t,"  if (u.side === 0 && W.spare > 0){ W.spare--; W.torches.push({ x, y, dropped: true, thrown: true }); }   // 여분에 불을 붙여 던짐 — 든 횃불은 그대로",
      "  if (u.side === 0 && W.spare > 0 && W.spareBy === u.i){ W.spare--; W.torches.push({ x, y, dropped: true, thrown: true }); }   // 여분에 불을 붙여 던짐 — 든 횃불은 그대로 (v7.8.5 꾸러미를 지닌 이만)")
# 새 횃불: torchTick 이 꾸러미에서 꺼낸 것을 손에
t=rep(t,"function torchTick(W){ for (const u of W.units){ const T = u.torchSw; if (!T || W.t < T.at) continue; u.torchSw = null; if (!u.alive || !u.torch) continue;",
      "function torchTick(W){ for (const u of W.units){ const T = u.torchSw; if (!T || W.t < T.at) continue; u.torchSw = null; if (T.spare && u.alive && !u.torch){ u.torch = true; u.torchOff = true; }   // v7.8.5 꾸러미에서 꺼낸 새 횃불\n    if (!u.alive || !u.torch) continue;")
# 내려놓기: 꾸러미를 지닌 이 · 로그 이름 torchPlace
t=rep(t,"""function dropTorch(W){
  const h = W.units.find(u => u.hero && u.alive); if (!h || W.spare <= 0) return false;
  W.torches.push({ x: h.x, y: h.y, dropped: true }); W.spare--; L(W, { k: 'torch', a: h.i, x: h.x, y: h.y });""",
"""function dropTorch(W){
  const h = W.spareBy != null ? W.units[W.spareBy] : null; if (!h || !h.alive || W.spare <= 0) return false;   // v7.8.5 꾸러미를 지닌 이가 내려놓음
  W.torches.push({ x: h.x, y: h.y, dropped: true }); W.spare--; L(W, { k: 'torchPlace', a: h.i, x: h.x, y: h.y, n: W.spare });""")
# 횃불 가져오기 명령
GET = r"""// v7.8.5 횃불 가져오기 (명령): 든 횃불이 있으면 켬. 없으면 가장 가까운 쪽으로 — 떨어진 횃불을 줍거나 · 여분 꾸러미 (지닌 동료 곁 · 쓰러진 몸 곁) 에서 하나 꺼내 불을 붙임 (torchNew 초). 쓰러진 몸 곁의 꾸러미는 챙겨 지님
function torchGetStep(W, u, dt){
  const o = u.order, end = why => { if (why) L(W, { k: 'torchGetFail', a: u.i, why, vis: true }); u.order = null; u.stay = { x: u.x, y: u.y }; };
  if (o.t0 == null) o.t0 = W.t;
  if (u.torchSw){ stop(u); setMood(W, u, u.torchSw.spare ? '새 횃불에 불을 붙임' : '횃불을 켬'); return; }
  if (u.torch){ if (u.torchOff) torchSet(W, u, true); else end(); return; }
  if (W.t - o.t0 > 25){ end('너무 오래 걸림'); return; }
  const tc = nearTorch(W, u, 1e9), C = W.spareBy != null ? W.units[W.spareBy] : null;
  const sp = W.spare > 0 ? (C && C.alive ? { x: C.x, y: C.y, by: C } : W.spareAt ? { x: W.spareAt.x, y: W.spareAt.y, by: null } : null) : null;
  const dT = tc ? Math.hypot(tc.x - u.x, tc.y - u.y) : 1e9, dS = sp ? (sp.by === u ? 0 : Math.hypot(sp.x - u.x, sp.y - u.y)) : 1e9;
  if (!tc && !sp){ end('떨어진 횃불도 여분도 없음'); return; }
  if (dT <= dS){ if (dT <= 0.7){ pickTorch(W, u, tc); return; } setMood(W, u, '횃불 주우러'); goTo(W, u, tc.x, tc.y, dt); return; }
  if (dS <= (sp.by ? 1.4 : 0.8)){ stop(u);
    if (!sp.by){ W.spareBy = u.i; W.spareAt = null; L(W, { k: 'spareTake', a: u.i, n: W.spare, vis: true }); }
    W.spare--; u.torchSw = { on: true, spare: true, at: W.t + (W.rules.torchNew != null ? W.rules.torchNew : 1.5) }; L(W, { k: 'torchLight', a: u.i, by: sp.by && sp.by !== u ? sp.by.i : null, n: W.spare, vis: true }); return; }
  setMood(W, u, '여분 횃불 꾸러미로'); goTo(W, u, sp.x, sp.y, dt);
}
"""
t=rep(t,"// v7.5 횃불 켜고 끄기: 켜는 데 torchOn · 끄는 데 torchOff 초 (든 이가 하는 일)",GET+"// v7.5 횃불 켜고 끄기: 켜는 데 torchOn · 끄는 데 torchOff 초 (든 이가 하는 일)")
t=rep(t,"  if (o.k === 'scout'){ scoutStep(W, u, dt); return; }   // v7.5 정찰","  if (o.k === 'scout'){ scoutStep(W, u, dt); return; }   // v7.5 정찰\n  if (o.k === 'torchGet'){ torchGetStep(W, u, dt); return; }   // v7.8.5 횃불 가져오기")
t=rep(t,"o.k === 'lret' || o.k === 'scout');   // v7.2 전열 후퇴도 바로 물러섬","o.k === 'lret' || o.k === 'scout' || o.k === 'torchGet');   // v7.2 전열 후퇴도 바로 물러섬")
t=rep(t,"const orderTxt = (o, u) => o && o.k === 'flare' ?","const orderTxt = (o, u) => o && o.k === 'torchGet' ? ['torchGet'] : o && o.k === 'flare' ?")
t=rep(t,"module.exports = { stealthFeel,","module.exports = { torchGetStep, stealthFeel,")
wr('rt3_tail.js',t); print('ok')
