# v7.8.3 들킴을 느낌 (아군 · 적 같음) — 은신이 헛짓하지 않게
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D+f).read()
def wr(f,s): open(D+f,'w').write(s)
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
h=rd('rt3_head.js')
h=rep(h,"small: 1.1, heavy: 0.65, giant: 0.1, back: 1, dim: 0.5, min: 0.2 },","small: 1.1, heavy: 0.65, giant: 0.1, back: 1, dim: 0.5, min: 0.2, feel: 0.3 },   // v7.8.3 feel: 상대가 나를 이만큼 (초) 넘게 앞 · 옆으로 보면 들킨 걸 느낌 (맞으면 곧바로) — 은신을 풂 · 정찰은 도망 · 매복은 터짐")
h=rep(h,"   v7.8.1: 야영지 없앰","   v7.8.3: 들킴을 느낌 (아군 · 적 같음) — 숨은 몸은 상대가 나를 0.3초 넘게 보거나 맞으면 들킨 걸 앎: 그냥 숨어 걷던 몸은 은신을 풀고 제 걸음 · 정찰은 곧바로 도망 · 매복은 터짐 · 우회조는 숨기를 풂 (헛짓 안 함).\n   v7.8.1: 야영지 없앰")
wr('rt3_head.js',h)
t=rd('rt3_tail.js')
FEEL = r"""// v7.8.3 들킴을 느낌 (아군 · 적 같음): 숨은 몸은 상대가 나를 알아챈 걸 느낌 — 상대가 앞 · 옆으로 나를 stealth.feel 초 넘게 봄 (스치는 눈길은 아님) · 맞음 (곧바로)
//   그냥 숨어 걷던 몸 (은신 켬) 은 은신을 풀고 제 걸음 · 정찰은 곧바로 도망 · 매복은 터짐 · 우회조는 숨기를 풂. 암살 명령 · 적 암살조 · 자동 암살은 저마다 그만둠 (들킴)
function stealthFeel(W){
  const fe = STL(W).feel != null ? STL(W).feel : 0.3;
  for (const u of W.units){
    if (!u.alive || u.down || !(u.stealth || u.lurk)){ u.feelT = null; continue; }
    if (u.shadow || u.asAI || (u.order && u.order.k === 'assn')) continue;   // 저마다 들킴을 봄
    const sp = assnSpotted(W, u), hit = W.t - (u.hitT == null ? -9 : u.hitT) < 0.25;
    if (!sp && !hit){ u.feelT = null; continue; }
    if (u.feelT == null) u.feelT = W.t;
    if (!hit && W.t - u.feelT < fe) continue;
    const by = sp ? sp.i : null, why = hit && !sp ? '맞음' : '봄'; u.feelT = null; u.blown = { t: W.t, by, why };
    if (u.lurk){ u.lurkSeen = by != null ? by : -1; continue; }   // 매복: lurkStep 이 터뜨림
    if (u.sc && u.order && u.order.k === 'scout'){ if (u.sc.ph !== 'flee'){ u.sc.ph = 'flee'; L(W, { k: 'scoutFlee', a: u.i, b: by, why, vis: true }); } u.stealth = false; continue; }   // 정찰: 곧바로 도망 (뛰면 숨지 못함)
    if (u.sqStl) u.sqStl = false;
    u.stealth = false; L(W, { k: 'stealthBlown', a: u.i, b: by, why, vis: u.side === 0 || !!u.seenBy });
  }
}
"""
t=rep(t,"// v7.7 사주경계: 맞붙지 않은 몸은 가끔 뒤를 돌아봄",FEEL+"// v7.7 사주경계: 맞붙지 않은 몸은 가끔 뒤를 돌아봄")
t=rep(t,"  assnFoundTick(W);   // v7.6 암살당한 시신을 동료가 봄","  assnFoundTick(W);   // v7.6 암살당한 시신을 동료가 봄\n  stealthFeel(W);   // v7.8.3 들킴을 느낌")
# 정찰: 도망 중엔 숨지 않음 (stealthFeel 이 처리) — 옛 조건은 그대로 (나를 노림 · 2.2칸)
t=rep(t,"if (S.ph !== 'flee' && W.units.some(e => e.alive && e.side !== u.side && canSee(W, e, u) && (e.target === u ||","if (S.ph !== 'flee' && W.units.some(e => e.alive && e.side !== u.side && canSee(W, e, u) && (e.target === u ||")
# 정찰 보고: 원래 은신 상태로 되돌리되, 들켜서 풀렸으면 그대로 풀린 채
t=rep(t,"  u.order = null; u.stay = { x: u.x, y: u.y }; u.stealth = S.st0; u.sc = null; u.mv = null;","  u.order = null; u.stay = { x: u.x, y: u.y }; u.stealth = S.st0 && !(u.blown && u.blown.t >= S.t0); u.sc = null; u.mv = null;   // v7.8.3 나가서 들켰으면 숨기를 되살리지 않음")
# 매복: 들킨 걸 느끼면 터짐
t=rep(t,"  if (W.t - (u.lurkT0 || 0) > 10 || u.taken > 0 || near || mate){ const lk = W.units.filter(e => e.side === u.side && e.lurk); for (const e of lk) e.lurk = false; L(W, { k: 'ambush', side: 1, a: u.i, why: u.taken > 0 ? 'hit' : near ? 'near' : mate ? 'mate' : 'time', b: near ? near.i : mate ? mate.i : null,",
      "  const seen = u.lurkSeen != null;   // v7.8.3 들킨 걸 느낌\n  if (W.t - (u.lurkT0 || 0) > 10 || u.taken > 0 || near || mate || seen){ const lk = W.units.filter(e => e.side === u.side && e.lurk); for (const e of lk){ e.lurk = false; e.lurkSeen = null; } L(W, { k: 'ambush', side: 1, a: u.i, why: u.taken > 0 ? 'hit' : near ? 'near' : mate ? 'mate' : seen ? 'seen' : 'time', b: near ? near.i : mate ? mate.i : seen && u.lurkSeen >= 0 ? u.lurkSeen : null,")
t=rep(t,"module.exports = { glareReach, flareStep,","module.exports = { stealthFeel, glareReach, flareStep,")
wr('rt3_tail.js',t); print('ok')
