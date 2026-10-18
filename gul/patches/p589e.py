import sys
def patch(P, reps):
    s=open(P).read()
    for a,b,n in reps:
        c=s.count(a)
        if c!=1: print('ANCHOR',P,n,c); sys.exit(1)
        s=s.replace(a,b)
    open(P,'w').write(s)
patch('rt3_head.js',[
("  squad: { t: 0.5, flank: 3.2, spread: 1.15 },", "  squad: { t: 0.5, flank: 3.2, spread: 1.15, cmd: 2 },   // v5.8.9 cmd = 조를 나눠 우회시키려면 있어야 하는 지휘 등급 (가장 높은 지휘관: S 4 · A 3 · B 2 · C 1 — B 부터 둘 이상의 조)",'squad'),
("  breakTime: 2,       // 자세가 무너지면 이 시간 동안 못 막음", "  breakTime: 2,       // 자세가 무너지면 이 시간 동안 못 막음 · v5.8.9 몸을 실어야 하는 것 (막기 · 태세 · 방패 밀치기 · 돌진) 도 못 함. 걷기 · 보통 공격은 됨",'break'),
])
patch('rt3_tail.js',[
# 1) 플레이어 명령이 자동 치료보다 먼저
("  if (!v) return false;\n  if (v === u || gap(u, v) <= K.rng){ startSkill(W, u, v, true); return true; }\n  setMood(W, u, '응급', v.i); goTo(W, u, v.x, v.y, dt); return true;",
 "  if (!v) return false;\n  // v5.8.9 플레이어 명령이 먼저: 아군이 명령 (이동 · 공격 · 돌진 · 줍기 …) 을 받고 있으면 스스로 치료하러 가지 않음 ('제자리' 면 그 자리에서 닿을 때만 부음). 대신 '치료 보류' 를 그 명령마다 한 번 알림\n  const ord = u.side === 0 && u.order && u.order.k !== 'skill' ? u.order : null;\n  if (ord && !(ord.k === 'hold' && (v === u || gap(u, v) <= K.rng))){ if (ord.healNote !== v.i){ ord.healNote = v.i; L(W, { k: 'healHeld', a: u.i, b: v.i, o: ord.k, hp: Math.round(v.hp / v.max * 100), down: !!v.down, bleed: !!v.bleed, vis: true }); } return false; }\n  if (v === u || gap(u, v) <= K.rng){ startSkill(W, u, v, true); return true; }\n  setMood(W, u, '응급', v.i); goTo(W, u, v.x, v.y, dt); return true;",'heal'),
# 2) 자세 무너짐: 돌진 · 방패 밀치기도 못 함
("  if (!u.canCharge || u.crawl || u.act || u.kb || W.t < u.proneT || W.t < u.chargeCd ||",
 "  if (!u.canCharge || u.crawl || u.act || u.kb || W.t < u.proneT || W.t < u.chargeCd || W.t < u.brokenT ||",'tryCharge'),
("    if (W.t >= u.chargeCd && clear && !far && !u.kb && W.t >= u.proneT){",
 "    if (W.t >= u.chargeCd && clear && !far && !u.kb && W.t >= u.proneT && W.t >= u.brokenT){   // v5.8.9 자세가 무너지면 추스를 때까지 못 뜀",'ordCharge'),
("    stop(u); u.fg = Math.atan2(ty - u.y, tx - u.x); setMood(W, u, u.chargeName + ' 준비', t ? t.i : null); return;",
 "    stop(u); u.fg = Math.atan2(ty - u.y, tx - u.x);\n    if (W.t < u.brokenT){ setMood(W, u, '자세를 추스름', t ? t.i : null); if (!o.brokeNote){ o.brokeNote = true; L(W, { k: 'chargeWait', a: u.i, b: t ? t.i : null, why: '자세 무너짐', sec: +(u.brokenT - W.t).toFixed(2), vis: u.side === 0 || !!u.seenBy }); } return; }\n    setMood(W, u, u.chargeName + ' 준비', t ? t.i : null); return;",'ordWait'),
("        else if (W.t < u.bashCd || u.act){ toAtk(''); return; }",
 "        else if (W.t < u.bashCd || u.act || W.t < u.brokenT){ toAtk(''); return; }   // v5.8.9 자세가 무너졌으면 밀치지 못하고 그냥 침",'near'),
("function startBash(W, u, t, why, body){   // v5.8.6 body = 방패 없이 몸 (어깨) 으로 밀침 — 더 약함\n  const B = W.rules.bash || {};",
 "function startBash(W, u, t, why, body){   // v5.8.6 body = 방패 없이 몸 (어깨) 으로 밀침 — 더 약함\n  if (W.t < u.brokenT){ setMood(W, u, '자세를 추스름', t.i); return false; }   // v5.8.9 자세가 무너지면 밀치지 못함\n  const B = W.rules.bash || {};",'bash'),
# 3) 조 나누기 = 지휘 (B 부터). 지휘를 잃거나 낮으면 있던 우회 조도 흩어짐
("  for (const e of W.units) if (e.side === 1 && e.sq && (!e.alive || (e.sq.done && W.t - e.sq.t > 8))) e.sq = null;\n",
 "  for (const e of W.units) if (e.side === 1 && e.sq && (!e.alive || (e.sq.done && W.t - e.sq.t > 8))) e.sq = null;\n  { const best = Math.max(0, ...W.units.filter(e => e.alive && !e.crawl && e.side === 1).map(e => e.cmd || 0));   // v5.8.9 조를 나눠 우회시키는 것은 지휘 — 가장 높은 지휘관이 squad.cmd (B) 아래면 못 함\n    if (best < (Q.cmd != null ? Q.cmd : 2)){ const had = W.units.filter(e => e.alive && e.side === 1 && e.sq && !e.sq.done); if (had.length){ for (const e of had) e.sq = null; L(W, { k: 'squadEnd', a: had.map(e => e.i), why: best ? '지휘 등급이 낮음' : '지휘를 잃음', vis: had.some(e => !!e.seenBy) }); } return; } }\n",'squad'),
])
s=open('rt3_tail.js').read()
a="  if (!heal && u.guardMode === 'hold' && u.canGuard && !isFar(u) && t.side !== u.side){ if (u.canBash && W.t >= u.bashCd && gap(u, t) <= u.rng + 0.3){"
assert s.count(a)==1
s=s.replace(a,"  if (!heal && u.guardMode === 'hold' && u.canGuard && !isFar(u) && t.side !== u.side){ if (u.canBash && W.t >= u.bashCd && W.t >= u.brokenT && gap(u, t) <= u.rng + 0.3){")
open('rt3_tail.js','w').write(s)
print('ok')
