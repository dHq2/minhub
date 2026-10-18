# v7.9.3 엔진: 사용자 로그 4건 추적 수리 — ① 경량이 방패 정면으로 뛰어듦 (밀어붙임 · 접근) ② 점사 중 아군을 맞히고도 계속 쏨 ③ 재집결 기준이 옛 자리 · 본대가 아님 ④ 어둠 속 근접 (몸이 닿는 거리) + 헛침 까닭 기록
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
h=open(D+'rt3_head.js').read()
h=rep(h,"   v7.9.2: 지휘 전달망","""   v7.9.3: 로그 4건 추적 수리 (아군 · 적 같은 규칙) — ① 경량 (무게가 상대의 45% 아래 · 괴력 · 돌진 없음) 이 막고 선 방패 정면으로 스스로 밀어붙이지 않음 (자세가 무너졌거나 7초 넘게 대치해야) — 옆으로 돌아 틈을 기다림. 접근도 같음 (정면 가드가 이쪽을 보면 가까이 서서 기다림).
           ② 점사 도중 (또는 직전) 아군을 맞혔으면 남은 발을 접고 2초간 더 엄격하게 (오사 확률 4% 넘으면 쏘지 않음). ③ 재집결: 본대 = 가장 가까운 동료 · 주인공 · 지키는 자리 중 가까운 쪽 (옛 임무 기준점이 아님).
           ④ 어둠 속 근접 헛침: 몸이 닿는 거리 (0.45칸) 면 어둠에서도 최소 60% 명중, 로그에 까닭 (야시 없음 · 횃불 꺼짐) 을 남김. 자율 판단 이유를 상세정보에 (lastDec).
   v7.9.2: 지휘 전달망""")
open(D+'rt3_head.js','w').write(h)
t=open(D+'rt3_tail.js').read()
# ① pushOK
t=rep(t,"function melee(W, u, t, dt, ordered){","""// v7.9.3 막고 선 상대 (방어 자세가 이쪽을 향함) 를 정면으로 밀어붙일 만한가 — 가벼운 몸이 무거운 방패를 들이받는 건 충동이 아니라 판단 실수. 아군 · 적 같음
function pushOK(W, u, t){
  if (t.act || !t.canGuard || !inGuard(W, t, u)) return true;
  const light = u.mass < t.mass * 0.45 && !(u.strMul > 1) && !u.canCharge && !u.canSweep;
  if (!light) return true;
  return t.post <= 45 || u.waitT > 7 || u.hp / u.max < 0.25;
}
function melee(W, u, t, dt, ordered){""")
t=rep(t,"    if (W.rand() < dt * (u.bold * 0.6 + u.waitT * 0.12)){ startAct(W, u, t, '밀어붙임'); return; }",
        "    if (!ordered && !pushOK(W, u, t)){ u.lastDec = { t: W.t, s: `${t.name}의 방패가 막고 있어 정면으로 안 들어감 — 옆을 노림` }; if (W.t - (u.pushLogT || -9) > 6){ u.pushLogT = W.t; L(W, { k: 'pushNo', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); } }\n    else if (W.rand() < dt * (u.bold * 0.6 + u.waitT * 0.12)){ startAct(W, u, t, '밀어붙임'); return; }")
# 접근: 정면 가드가 이쪽을 보고 못 밀어붙이면 손 닿는 밖에서 기다림 (대담해도)
t=rep(t,"  let go = ordered || stale || u.bold >= 0.65 || busyOther","  const frontGuard = !ordered && u.side === 0 && !t.act && t.canGuard && inGuard(W, t, u) && !pushOK(W, u, t);   // v7.9.3\n  let go = ordered || stale || (u.bold >= 0.65 && !frontGuard) || busyOther")
t=rep(t,"  const push = u.side === 0 && !ordered && !go && pushing(W, u, t);","  const push = u.side === 0 && !ordered && !go && !frontGuard && pushing(W, u, t);")
# ② 아군을 맞힘
t=rep(t,"  t.hp -= real; t.hitT = W.t;","  if (o && o.ff && u !== t && u.side === t.side){ u.burst = null; u.ffHitT = W.t; u.lastDec = { t: W.t, s: `${t.name}을(를) 맞힘 — 점사를 접고 사선을 다시 봄` }; }   // v7.9.3 아군을 맞히면 남은 발을 접음\n  t.hp -= real; t.hitT = W.t;")
t=rep(t,"const ffLim = (u, W) => ffBase(u, W) + Math.min(0.04, (u.ffWait || 0) * 0.015);","const ffLim = (u, W) => W.t - (u.ffHitT || -9) < 2 ? 0.04 : ffBase(u, W) + Math.min(0.04, (u.ffWait || 0) * 0.015);   // v7.9.3 방금 아군을 맞혔으면 더 엄격하게")
# ③ 재집결: 본대 = 가장 가까운 동료 · 주인공 · 지키는 자리
t=rep(t,"""      const hero0 = W.units.find(h => h.hero && h.alive), anc = u.stay || (hero0 && !u.hero ? hero0 : null), tet = (W.rules.roe || {}).chase || 6.5;
      if (anc && dist(u, anc) > tet && !impulseOK(W, u, t, 'smart')){""","""      const hero0 = W.units.find(h => h.hero && h.alive), mates0 = W.units.filter(a => a.alive && !a.down && a.side === 0 && a !== u), tet = (W.rules.roe || {}).chase || 6.5;
      const dMain = Math.min(...[...mates0.map(a => dist(u, a)), u.stay ? dist(u, u.stay) : 1e9, hero0 && !u.hero ? dist(u, hero0) : 1e9]), anc = mates0.length || u.stay || hero0 ? { d: dMain } : null;   // v7.9.3 가장 가까운 동료 · 주인공 · 지키는 자리 중 가까운 쪽까지
      if (anc && anc.d > tet && !impulseOK(W, u, t, 'smart')){""")
t=rep(t,"L(W, { k: 'regroup', a: u.i, b: t.i, d: +dist(u, anc).toFixed(1), vis: true }); }","L(W, { k: 'regroup', a: u.i, b: t.i, d: +anc.d.toFixed(1), vis: true }); u.lastDec = { t: W.t, s: `본대에서 ${anc.d.toFixed(1)}칸 — 놓친 ${t.name} 추격을 그만두고 돌아감` }; }")
# ④ 어둠 속 근접
t=rep(t,"      const dp = blindTo(W, u, t) ? (R.darkAim != null ? R.darkAim : 0.25) :","      const blind0 = blindTo(W, u, t), dp = blind0 ? Math.max(R.darkAim != null ? R.darkAim : 0.25, gap(u, t) < 0.45 ? 0.6 : 0) :   // v7.9.3 몸이 닿는 거리면 어둠에서도 어느 정도 맞춤")
t=rep(t,"why: `어둠 속에서 헛침 (명중률 ${Math.round(dp * 100)}%)`, dark: true });","why: `어둠 속에서 헛침 (명중률 ${Math.round(dp * 100)}%)`, dark: true, nv: !!u.nv, torch: !!u.torch && !u.torchOff, lit: !!litAt(W, t.x, t.y), d: +gap(u, t).toFixed(2) });")
# lastDec: 충동 · 교전 보류 · 치료 미룸
t=rep(t,"  if (W.t - u.impT > 8){ u.impT = W.t; u.deviT = W.t;","  if (W.t - u.impT > 8){ u.impT = W.t; u.deviT = W.t; u.lastDec = { t: W.t, s: `충동 — ${f.name}에게 스스로 (점수 ${I.s.toFixed(2)} ≥ ${thr.toFixed(2)})` };")
t=rep(t,"  L(W, { k: 'roeHold', a: u.i, b: f.i, why, m: roeOf(W, u),","  u.lastDec = { t: W.t, s: `${f.name} 보임 — ${why === 'nofire' ? '사격 금지' : why === 'hold' ? '교전 금지' : '열세에 안 들켰으니 교전 보류'}` };\n  L(W, { k: 'roeHold', a: u.i, b: f.i, why, m: roeOf(W, u),")
t=rep(t,"u.healDeferT = W.t; L(W, { k: 'healDefer',","u.healDeferT = W.t; u.lastDec = { t: W.t, s: `${pr.e.name}의 일격이 ${pr.eta.toFixed(1)}초 뒤 — 치료를 미룸` }; L(W, { k: 'healDefer',")
open(D+'rt3_tail.js','w').write(t); print('ok')
