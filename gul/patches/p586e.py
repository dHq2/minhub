import sys
def patch(P, reps):
    s=open(P).read()
    for a,b,n in reps:
        c=s.count(a)
        if c!=1: print('ANCHOR',P,n,c); sys.exit(1)
        s=s.replace(a,b)
    open(P,'w').write(s)
patch('rt3_head.js',[
("spd: 2.6, sp0: 1.2, full: 3,", "spd: 2.6, sp0: 1.2, full: 3, shove: 1.0,",'rule'),
("   // v5.8.5 준비 0.2초 · 대기 4초 · 도움닫기: 달리기 시작은 ×sp0, 달린 거리가 full 칸이면 전력질주 ×spd (짧으면 덜 셈)",
 "   // v5.8.5 준비 0.2초 · 대기 4초 · 도움닫기: 달리기 시작은 ×sp0, 달린 거리가 full 칸이면 전력질주 ×spd (짧으면 덜 셈) · v5.8.6 shove 칸도 못 달리고 부딪히면 밀치기 수준 (휘청 없음), 휘청은 달린 거리만큼",'cmt'),
])
patch('rt3_tail.js',[
# 1) 부딪힌 힘: 달린 거리 (도움닫기)
("    const vA2 = vA - (1 + e) * mB / (mA + mB) * vr, vB2 = vB + (1 + e) * mA / (mA + mB) * vr, k = Math.max(0.5, Math.min(1.6, vr / 4.5));",
 "    const vA2 = vA - (1 + e) * mB / (mA + mB) * vr, vB2 = vB + (1 + e) * mA / (mA + mB) * vr, k = Math.max(0.25, Math.min(1.6, vr / 4.5));   // v5.8.6 짧은 돌격은 덜 셈 (바닥 0.5 → 0.25)\n    // v5.8.6 도움닫기 몫: shove 칸도 못 달렸으면 밀치기 수준 (휘청 없음 · 덜 눌림), 그 위로는 전력질주 (full 칸) 까지 휘청이 0.5 → 1배\n    const runN = A.run || 0, pushOnly = !hc && runN < (C.shove != null ? C.shove : 1), pw = pushOnly ? 0 : Math.max(0, Math.min(1, (runN - (C.shove != null ? C.shove : 1)) / Math.max(0.1, (C.full || 3) - (C.shove != null ? C.shove : 1))));",'k'),
("    if (hit.alive){ hit.pinT = W.t + (C.pin || 1.2) * (hit.modBody ? (W.rules.modBody || {}).pin || 0.5 : 1); interrupt(W, hit, '들이받혀 준비가 끊김'); }",
 "    if (hit.alive){ hit.pinT = W.t + (C.pin || 1.2) * (pushOnly ? 0.4 : 1) * (hit.modBody ? (W.rules.modBody || {}).pin || 0.5 : 1); interrupt(W, hit, pushOnly ? '밀려 준비가 끊김' : '들이받혀 준비가 끊김'); }",'pin'),
("    if (!blocked && hit.alive) stun(W, hit, (C.stun != null ? C.stun : 1) * Math.max(0.6, Math.min(1.5, u.mass / Math.max(1, hit.mass))) * (sh ? (C.shieldStun || 1.25) : 1), u.i);",
 "    if (!blocked && hit.alive && !pushOnly) stun(W, hit, (C.stun != null ? C.stun : 1) * Math.max(0.6, Math.min(1.5, u.mass / Math.max(1, hit.mass))) * (sh ? (C.shieldStun || 1.25) : 1) * (hc ? 1 : 0.5 + 0.5 * pw), u.i);   // v5.8.6 휘청은 달려온 만큼 (밀치기 수준이면 없음)",'stun'),
("shield: sh, run: +(A.run || 0).toFixed(1), full: (A.run || 0) >= (C.full || 3) - 0.05,",
 "shield: sh, run: +(A.run || 0).toFixed(1), full: (A.run || 0) >= (C.full || 3) - 0.05, push: pushOnly,",'log'),
# 2) 명령 돌진인데 너무 가까움 → 밀치기 (방패 = 방패 밀치기, 없으면 몸 밀치기) — 돌진 대기는 쓰지 않음
("      if (known && gap(u, t) < 0.5){ toAtk(''); return; }   // 이미 붙음 → 그냥 공격\n",
 """      if (known && gap(u, t) < 0.5){ toAtk(''); return; }   // 이미 붙음 → 그냥 공격
      // v5.8.6 돌격할 거리 (charge.min) 가 안 됨 → 돌진이 아니라 밀치기: 다가가 방패 (없으면 몸) 로 밀침. 돌진 대기는 쓰지 않음 (밀치기 대기만)
      if (known && gap(u, t) < (C.min || 1.5) && !o.near){ o.near = true; L(W, { k: 'tooClose', a: u.i, b: t.i, gap: +gap(u, t).toFixed(1), vis: u.side === 0 || !!u.seenBy }); }
      if (o.near){
        if (!known){ toAtk('보이지 않음'); return; }
        if (gap(u, t) > (C.min || 1.5) + 0.8){ o.near = false; }   // 다시 멀어지면 (상대가 물러남) 돌진으로
        else if (gap(u, t) <= 0.35){ if (W.t >= u.bashCd && !u.act){ startBash(W, u, t, '돌진하기엔 가까움', !u.canBash); u.order = { k: 'attack', b: t.i }; } else toAtk(''); return; }
        else { setMood(W, u, '밀치러', t.i); goTo(W, u, t.x, t.y, dt); return; }
      }
""",'near'),
# 3) 몸 밀치기
("function startBash(W, u, t, why){\n  const B = W.rules.bash || {};\n  u.act = { k: 'bash', b: t.i, phase: 'wind', t0: W.t, end: W.t + (B.wind || 0.25), why: why || '' };\n  u.bashCd = W.t + (B.cd || 4); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); u.waitT = 0;\n  setMood(W, u, '방패 밀치기', t.i);\n  L(W, { k: 'wind', a: u.i, b: t.i, bash: true, end: +(W.t + (B.wind || 0.25)).toFixed(2), why: why || '', hid: u.side === 1 && !u.seenBy });\n}",
 "function startBash(W, u, t, why, body){   // v5.8.6 body = 방패 없이 몸 (어깨) 으로 밀침 — 더 약함\n  const B = W.rules.bash || {};\n  u.act = { k: 'bash', b: t.i, phase: 'wind', t0: W.t, end: W.t + (B.wind || 0.25), why: why || '', body: !!body };\n  u.bashCd = W.t + (B.cd || 4); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); u.waitT = 0;\n  setMood(W, u, body ? '몸 밀치기' : '방패 밀치기', t.i);\n  L(W, { k: 'wind', a: u.i, b: t.i, bash: true, body: !!body, end: +(W.t + (B.wind || 0.25)).toFixed(2), why: why || '', hid: u.side === 1 && !u.seenBy });\n}",'startBash'),
("    strike(W, u, t, t, 1, false, { mul: B.dmg || 0.3, wk: '둔기', tag: '방패 밀치기', noWound: true });\n    if (t.alive && t.canGuard){ t.post -= B.post || 30; if (t.post <= 0 && W.t >= t.brokenT){ t.post = 0; t.brokenT = W.t + W.rules.breakTime; } }\n    if (t.alive) shove(W, u, t, B.p || 0.7, t.x - u.x, t.y - u.y, { how: 'bash' });",
 "    const bd = !!A.body;   // v5.8.6 몸 밀치기: 피해 · 자세 깎기 · 미는 힘 모두 약함 (bodyMul)\n    strike(W, u, t, t, 1, false, { mul: (B.dmg || 0.3) * (bd ? B.bodyMul || 0.5 : 1), wk: bd ? '맨손' : '둔기', tag: bd ? '몸 밀치기' : '방패 밀치기', noWound: true });\n    if (t.alive && t.canGuard){ t.post -= (B.post || 30) * (bd ? B.bodyMul || 0.5 : 1); if (t.post <= 0 && W.t >= t.brokenT){ t.post = 0; t.brokenT = W.t + W.rules.breakTime; } }\n    if (t.alive) shove(W, u, t, (B.p || 0.7) * (bd ? 0.75 : 1), t.x - u.x, t.y - u.y, { how: bd ? 'body' : 'bash' });",'resolveBash'),
("  else if (gap(u, t) > 0.35 + W.rules.reach) L(W, { k: 'miss', a: u.i, b: t.i, why: W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : '방패가 닿지 않음' });",
 "  else if (gap(u, t) > 0.35 + W.rules.reach) L(W, { k: 'miss', a: u.i, b: t.i, why: W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : A.body ? '어깨가 닿지 않음' : '방패가 닿지 않음' });",'miss'),
])
H=open('rt3_head.js').read()
a="  bash: { p: 0.7, dmg: 0.3, post: 30, wind: 0.25, rec: 0.35, cd: 4 },"
assert H.count(a)==1
H=H.replace(a,"  bash: { p: 0.7, dmg: 0.3, post: 30, wind: 0.25, rec: 0.35, cd: 4, bodyMul: 0.5 },   // v5.8.6 bodyMul = 방패 없이 몸으로 밀칠 때 (피해 · 자세 깎기 ×, 미는 힘 ×0.75)")
open('rt3_head.js','w').write(H)
print('ok')
