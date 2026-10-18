def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
# 1) 쐐기: 모일 수 있는 만큼만 · 싸우는 동료를 두고 기다리지 않음
rep(T,"""    else if (V.phase === 'drive'){ const hit = known.find(""","""    else if (V.phase === 'drive'){ wedgeFix(W, V, tip, mine); if (!W.wedge) return; const hit = known.find(""")
rep(T,"""  const tip = heavy[0], sh = heavy.slice(1, 3), body = melee.filter(u => u !== tip && !sh.includes(u)), F = W.focus && W.units[W.focus.b];""","""  // v6.3.4 모일 수 있는 만큼만: 이미 싸우는 동료 · 7칸 넘게 떨어진 동료는 넣지 않음. 모일 동료가 모자라면 2초 기다려 보고 밀어붙임으로
  const tip = heavy[0], free = melee.filter(u => u !== tip && !busyW(W, u) && dist(u, tip) <= 7), sh = heavy.filter(u => free.includes(u)).slice(0, 2), body = free.filter(u => !sh.includes(u)), F = W.focus && W.units[W.focus.b];
  if (busyW(W, tip) || sh.length + body.length < 2){ P.wedgeTry = P.wedgeTry || W.t; if (W.t - P.wedgeTry > 2){ P.wedgeDone = true; const bz = melee.filter(u => u !== tip && busyW(W, u));
      planSwitch(W, 'assault', `쐐기로 모일 동료가 모자람 — ${bz.length ? bz.map(u => u.name).join(' · ') + ' 이미 싸우는 중' : '흩어져 있음'} → 각자 밀어붙임`); } return; }""")
rep(T,"""function wedgeStep(W, u, dt){""","""const busyW = (W, u) => W.units.some(f => f.alive && f.side !== u.side && gap(u, f) < Math.max(u.rng, f.rng) + 0.6);   // 맞붙어 싸우는 중
const planSwitch = (W, k, why) => { if (!W.plan || W.plan.k === k) return; const was = W.plan.k; W.plan.k = k; W.plan.t0 = W.t; W.plan.why = why; L(W, { k: 'plan', side: 1, p: k, was, why, vis: true }); };
// v6.3.4 쐐기를 고치며 감: 싸우게 된 · 너무 먼 마디는 빼고, 가까이서 동료가 싸우면 기다리지 않고 그쪽으로 틀어 들이받음, 3.5초면 모인 만큼으로 감, 남은 마디가 없으면 밀어붙임으로
function wedgeFix(W, V, tip, mine){
  const out = [];
  for (const arr of [V.sh, V.body]) for (let k = arr.length - 1; k >= 0; k--){ const o = W.units[arr[k]]; const why = !o.alive || o.crawl ? '쓰러짐' : busyW(W, o) ? '싸우는 중' : dist(o, tip) > 8 ? '멂' : null; if (why){ arr.splice(k, 1); if (o.alive) out.push(o.name + ' (' + why + ')'); } }
  if (out.length) L(W, { k: 'wedge', side: 1, s: 'drop', tip: V.tip, who: out.join(' · '), vis: true });
  const inW = j => j === V.tip || V.sh.includes(j) || V.body.includes(j);
  const m = mine.filter(x => !inW(x.i) && busyW(W, x) && dist(x, tip) < 11).sort((a, b) => dist(a, tip) - dist(b, tip))[0];
  if (m && V.help !== m.i){ const f = W.units.filter(x => x.alive && x.side !== 1 && gap(m, x) < Math.max(m.rng, x.rng) + 0.6).sort((a, b) => gap(m, a) - gap(m, b))[0];
    if (f){ V.help = m.i; V.aimB = f.i; V.go = true; L(W, { k: 'wedge', side: 1, s: 'turn', tip: V.tip, a: m.i, b: f.i, obs: !!tip.seenBy, vis: true }); } }
  if (V.aimB != null){ const f = W.units[V.aimB]; if (f.alive) V.aim = { x: f.x, y: f.y }; }   // 튼 쪽 상대를 따라감
  if (!V.go && W.t - V.t0 > 3.5){ V.go = true; L(W, { k: 'wedge', side: 1, s: 'go', tip: V.tip, n: 1 + V.sh.length + V.body.length, vis: true }); }
  if (!V.sh.length && !V.body.length){ L(W, { k: 'wedge', side: 1, s: 'end', tip: V.tip, why: '모인 마디가 없음', vis: true }); W.wedge = null; planSwitch(W, 'assault', '쐐기가 흩어짐 — 각자 밀어붙임'); }
}
function wedgeStep(W, u, dt){""")
rep(T,"""    const lag = [...V.sh, ...V.body].some(j => { const o = W.units[j]; if (!o.alive || o.crawl) return false;""","""    const lag = !V.go && [...V.sh, ...V.body].some(j => { const o = W.units[j]; if (!o.alive || o.crawl || busyW(W, o)) return false;""")
# 2) 매복: 곁에서 동료가 싸우기 시작하면 터짐
rep(T,"""  const near = W.units.find(a => a.alive && a.side !== u.side && dist(a, u) < 4.5);
  if (W.t - (u.lurkT0 || 0) > 10 || u.taken > 0 || near){ const lk = W.units.filter(e => e.side === u.side && e.lurk); for (const e of lk) e.lurk = false; L(W, { k: 'ambush', side: 1, a: u.i, why: u.taken > 0 ? 'hit' : near ? 'near' : 'time', b: near ? near.i : null,""","""  const near = W.units.find(a => a.alive && a.side !== u.side && dist(a, u) < 4.5), mate = !near && W.units.find(m => m.alive && m.side === u.side && !m.lurk && dist(m, u) < 9 && busyW(W, m));   // v6.3.4 곁에서 동료가 싸우면 기다리지 않음
  if (W.t - (u.lurkT0 || 0) > 10 || u.taken > 0 || near || mate){ const lk = W.units.filter(e => e.side === u.side && e.lurk); for (const e of lk) e.lurk = false; L(W, { k: 'ambush', side: 1, a: u.i, why: u.taken > 0 ? 'hit' : near ? 'near' : mate ? 'mate' : 'time', b: near ? near.i : mate ? mate.i : null,""")
# 3) 약을 다 부은 뒤 회복 동작만 끊긴 건 '멈춤' 이 아님
rep(T,"  if (did) L(W, { k: 'cancel', a: u.i, was: a ? a.k : 'burst', vis: true });","  if (did) L(W, { k: 'cancel', a: u.i, was: a ? a.k : 'burst', done: !!(a && a.phase && a.phase !== 'wind' && ['skill', 'heal', 'atk', 'throw', 'bash'].includes(a.k)), vis: true });   // v6.3.4 done = 이미 들어간 뒤 (회복 동작만 끊음)")
rep(T,"module.exports = { cmdSit,","module.exports = { wedgeFix, busyW, planSwitch, cmdSit,")
# page
rep(P,"""      case 'cancel': out.push(`${T(e)}${n(e.a)} 하던 ${{ atk: '공격 준비', throw: '투창 조준', skill: '약 붓기', heal: '치유', bash: '방패 밀치기', reload: '재장전', burst: '점사', charge: '돌진' }[e.was] || '동작'} 멈추고 새 명령을 따름`); break;""","""      case 'cancel': out.push(e.done ? `${T(e)}${n(e.a)} ${{ atk: '공격', throw: '투창', skill: '약 붓기', heal: '치유', bash: '방패 밀치기' }[e.was] || '동작'}는 이미 끝남 — 뒤의 회복 동작만 끊고 새 명령을 따름` : `${T(e)}${n(e.a)} 하던 ${{ atk: '공격 준비', throw: '투창 조준', skill: '약 붓기', heal: '치유', bash: '방패 밀치기', reload: '재장전', burst: '점사', charge: '돌진' }[e.was] || '동작'} 멈추고 새 명령을 따름`); break;   // v6.3.4 끝난 뒤면 멈춤이 아님""")
s=open(P,encoding='utf-8').read()
i=s.index("      case 'wedge': out.push(`${T(e)}📋 쐐기 돌파: ${e.s === 'form' ?")
j=s.index("'끝 — ' + e.why}`); break;", i)
seg=s[i:j]
s=s[:j]+"(e.s === 'drop' ? '마디를 뺌 — ' + e.who + ' (싸우는 동료 · 먼 동료를 기다리지 않음)' : e.s === 'turn' ? `${ga(n(e.a))} 싸우는 중 — 기다리지 않고 그쪽 (${n(e.b)}) 으로 방향을 틂` : e.s === 'go' ? `더 기다리지 않고 모인 ${e.n}명으로 돌파` : '끝 — ' + e.why)}`); break;   // v6.3.4"+s[j+len("'끝 — ' + e.why}`); break;"):]
open(P,'w',encoding='utf-8').write(s)
rep(P,"e.s === 'breach' ? { c: 'bad', s: `쐐기가 박혔다 — ${n(e.b)} 쪽이 뚫리며 적이 뒤로 쏟아져 들어온다!` } : null;","e.s === 'breach' ? { c: 'bad', s: `쐐기가 박혔다 — ${n(e.b)} 쪽이 뚫리며 적이 뒤로 쏟아져 들어온다!` } : e.s === 'turn' ? { c: 'bad', s: `쐐기가 방향을 튼다 — ${n(e.b)} 쪽으로 몰려온다!` } : null;   // v6.3.4")
rep(P,"else if (e.k === 'wedge') s = `◆ 쐐기 ${e.s === 'form' ? '모임 — 끝 ' + n(e.tip) : e.s === 'breach' ? '박힘 — ' + n(e.b) + ' 쪽' : '끝 (' + e.why + ')'}`;","else if (e.k === 'wedge') s = `◆ 쐐기 ${e.s === 'form' ? '모임 — 끝 ' + n(e.tip) : e.s === 'breach' ? '박힘 — ' + n(e.b) + ' 쪽' : e.s === 'drop' ? '마디를 뺌 — ' + e.who : e.s === 'turn' ? '방향을 틂 — ' + n(e.a) + '가 싸우는 ' + n(e.b) + ' 쪽' : e.s === 'go' ? '모인 ' + e.n + '명으로 돌파' : '끝 (' + e.why + ')'}`;")
