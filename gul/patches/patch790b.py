# v7.9.0b: 치료를 붓는 도중 나를 노린 치명적 일격이 오면 (아주 위급한 동료가 아니면) 치료를 끊고 비킴
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
t=open(D+'rt3_tail.js').read()
t=rep(t,"""  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }   // v7.3 돌봄""",
"""  if (u.act && u.act.k === 'skill' && u.act.phase === 'wind' && u.act.auto && u.side === 0){   // v7.9 붓는 도중 치명적 일격이 나를 노리면 (아주 위급한 동료가 아니면) 끊고 비킴 — 눈앞의 위협을 보고도 끝까지 붓지 않음
    const pr = perilOn(W, u), v = W.units[u.act.b], H = W.rules.heal || {};
    if (pr && v && v !== u && !(v.down || v.hp / v.max < (H.rescue != null ? H.rescue : 0.12))){ L(W, { k: 'healAbort', a: u.i, b: v.i, by: pr.e.i, eta: +pr.eta.toFixed(2), vis: true }); u.act = null; u.healDeferT = W.t; } }
  if (u.act){ if (u.act.k === 'skill' && u.act.phase === 'tend'){ tendStep(W, u); if (!u.act) return; }   // v7.3 돌봄""")
open(D+'rt3_tail.js','w').write(t); print('ok')
