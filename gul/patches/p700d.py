p='rt3_tail.js'; s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
# 옛 버그: 줄 중간 주석이 삼킨 코드 되살림
rep("tire(W, u, 'charge');   // v6.6 지침 u.fg = Math.atan2(ty - u.y, tx - u.x); u.face = u.fg;", "tire(W, u, 'charge'); u.fg = Math.atan2(ty - u.y, tx - u.x); u.face = u.fg;   // v6.6 지침   // v7.0 고침: 주석에 삼켜져 있던 '돌진 준비 때 상대 쪽으로 돎'")
rep("u.spearHeld = true;   // v6.7 던지는 단검 u.loud = far && !!wp.loud; u.aim = far && wp.aim != null ? wp.aim : null; u.burst = null;",
    "u.spearHeld = true; u.loud = far && !!wp.loud; u.aim = far && wp.aim != null ? wp.aim : null; u.burst = null;   // v6.7 던지는 단검   // v7.0 고침: 주석에 삼켜져 주운 총의 총성 · 조준이 안 바뀌던 것\n  u.alien = far && !wpnProf(W, u, wp);   // v7.0 낯선 무기")
# 낯선 무기: 숙련 = 처음 든 무기와 같은 종류이거나 [사격X] 특성 (총 · 활)
rep("// 무기를 바꿔 듦: 사거리 · 장창 · 투창 · 탄약 · 방어 자세 (대검) 를 그 무기에 맞춤",
    "// v7.0 낯선 무기: 주운 원거리 무기를 다룰 줄 아나 — 처음 든 무기와 같은 종류 (총포류 · 활) 거나 [사격X] 특성. 모르면 조준 × · 준비 × · 점사 못 함 · 재장전 ×\nconst wpnProf = (W, u, wp) => { const k0 = (((W.rules.weapons || {})[(u.kit0 && u.kit0.weapon) || ''] || {}).kind); return k0 === wp.kind || (u.mk0 || 0) > 0; };\n// 무기를 바꿔 듦: 사거리 · 장창 · 투창 · 탄약 · 방어 자세 (대검) 를 그 무기에 맞춤")
i=s.index("      marks: Math.max(marksOf(rules, p.traits),"); 
s=s[:i]+"      mk0: marksOf(rules, p.traits),   // v7.0 [사격X] 특성 (낯선 무기 판정)\n"+s[i:]
rep("  const mk = u.marks || 0; p += (1 - p) * mk;   // v5.5.2 사격 솜씨: 남은 빗나감을 mk 만큼 줄임",
    "  const mk = u.alien ? 0 : u.marks || 0; p += (1 - p) * mk;   // v5.5.2 사격 솜씨: 남은 빗나감을 mk 만큼 줄임\n  if (u.alien) p *= ((W.rules.alien || {}).aim || 0.6);   // v7.0 낯선 무기")
rep("      if (wp.burst){ n = W.rand()", "      if (wp.burst && !u.alien){ n = W.rand()")
rep("  u.act = { k: 'reload', phase: 'wind', t0: W.t, end: W.t + (wp.reload || 2), why: '재장전' };", "  u.act = { k: 'reload', phase: 'wind', t0: W.t, end: W.t + (wp.reload || 2) * (u.alien ? (W.rules.alien || {}).reload || 1.5 : 1), why: '재장전' };   // v7.0 낯선 무기는 더디게")
# 준비: 낯선 무기 × · 근접 상대가 붙은 사수 × (교전 구속)
rep("  const sm = !heal && t.side !== u.side && isFar(u) ? shotMode(W, u, t) : null, smW = sm ? ((W.rules.sshot || {})[sm] || {}).wind || 1 : 1;   // v7.0 사격S: 조준사격 · 속사",
    "  const sm = !heal && t.side !== u.side && isFar(u) ? shotMode(W, u, t) : null, tied = !heal && isFar(u) && !AI6.includes('eng') && W.units.some(f => f.alive && f.side !== u.side && !isFar(f) && !f.crawl && gap(u, f) < f.rng + 0.2), smW = (sm ? ((W.rules.sshot || {})[sm] || {}).wind || 1 : 1) * (u.alien && isFar(u) ? (W.rules.alien || {}).wind || 1.4 : 1) * (tied ? (W.rules.alien || {}).tied || 1.5 : 1);   // v7.0 사격S: 조준사격 · 속사 · 낯선 무기 · 근접에 붙들린 사수")
rep("  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, sm, mv:", "  L(W, { k: 'wind', a: u.i, b: t.i, heal, mode, sm, tied: tied || null, alien: !!(u.alien && isFar(u)) || null, mv:")
# 교전 구속: 누구든 (전열 마디만이 아니라) 근접 상대 손 닿는 곳에서 등을 보이고 빠지면 공짜 일격 — 도약 · 돌진은 뺌
rep("""function lineOpportunity(W){
  for (const ln of W.lines || []) for (const i of ln.ids){
    const u = W.units[i];
    if (!u.alive || u.act""", """function lineOpportunity(W){
  const inL = new Set(); for (const ln of W.lines || []) for (const i of ln.ids) inL.add(i);
  for (const u of W.units){
    if (!(inL.has(u.i) || (!AI6.includes('eng') && !isFar(u) && !u.crawl && !u.noArms))) continue;   // v7.0 교전 구속: 모든 근접
    if (!u.alive || u.act""")
rep("      if (!e.alive || e.side === u.side || e.kb || (e.act && e.act.k === 'charge')) continue;",
    "      if (!e.alive || e.side === u.side || e.kb || (e.act && (e.act.k === 'charge' || e.act.k === 'leap' || e.act.k === 'dodge'))) continue;   // 도약 · 피하기로 빠지면 구속이 풀림")
rep("        u.oppT = W.t; L(W, { k: 'opportunity', a: u.i, b: e.i, vis: u.side === 0 || e.side === 0 || !!u.seenBy || !!e.seenBy });\n        strike(W, u, e, e, 1, false, { mul: (W.rules.line || {}).opp || 0.6, tag: '빠지는 틈에 일격' }); break;",
    "        u.oppT = W.t; L(W, { k: 'opportunity', a: u.i, b: e.i, line: inL.has(u.i), vis: u.side === 0 || e.side === 0 || !!u.seenBy || !!e.seenBy });\n        strike(W, u, e, e, 1, false, { mul: (W.rules.line || {}).opp || 0.6, tag: inL.has(u.i) ? '빠지는 틈에 일격' : '등을 보인 틈에 일격' }); break;")
# 방패 전진: 총 · 활 · 투창이 나를 겨누거나 방금 쐈으면 그쪽으로 방패를 듦 (걸음 × guard.walk)
rep("    else if (u.guardMode !== 'off'){ const bare = bareGuard(W, u), dg = dangerOf(W, u);",
    "    else if (u.guardMode !== 'off' && (u.shield || u.armShield) && !AI6.includes('sadv') && shooterOn(W, u)){ const g = shooterOn(W, u); want = true; if (!u.path || !u.path.length) u.fg = Math.atan2(g.y - u.y, g.x - u.x); if (u.side === 1 || !u.order) setMood(W, u, '방패 전진', g.i); }   // v7.0 방패 전진\n    else if (u.guardMode !== 'off'){ const bare = bareGuard(W, u), dg = dangerOf(W, u);")
rep("const isFar = u => u.rng > 1 && !u.longReach;", "const isFar = u => u.rng > 1 && !u.longReach;\n// v7.0 나를 겨누는 (준비 중) · 방금 (1.5초) 나를 쏜 상대 사수 — 보이거나 쏜 걸 앎\nconst shooterOn = (W, u) => W.units.find(g => g.alive && g.side !== u.side && (isFar(g) || (g.jav && g.spearHeld)) && dist(u, g) <= g.rng + g.r + u.r + 1 && ((g.act && g.act.k === 'atk' && g.act.b === u.i && (canSee(W, u, g) || u.side === 0)) || (u.farBy === g.i && W.t - (u.farHitT == null ? -9 : u.farHitT) < 1.5))) || null;")
# 작전 최소 유지 3초 (새로 안 것에 맞춘 바꿈) — 큰 일 (실패 판정 · 크게 밀림) 은 그대로
rep("  if ((P.k === 'hold' || P.k === 'bait') && !outgun){", "  if ((P.k === 'hold' || P.k === 'bait') && !outgun && W.t - P.t0 >= 3){   // v7.0 작전은 적어도 3초")
# 기습 짐작: 적이 아는 것으로만
rep("surprise: !W.units.some(e => e.side === 1 && e.alive && e.seenBy), light: true }", "surprise: surpriseEst(W), light: true }")
rep("surprise: !W.units.some(e => e.side === 1 && e.alive && e.seenBy) };", "surprise: surpriseEst(W) };")
rep("const DIR8K = ['동',", "// v7.0 기습할 수 있나 — 적이 아는 것으로만 짐작 (상대의 실제 시야는 모름): 우리 (적) 가 맞거나 사격받은 적 없고, 상대 가까이 불빛 속에 선 동료가 없음\nconst surpriseEst = W => !W.units.some(e => e.side === 1 && e.alive && (e.taken > 0 || e.farHitT != null || (litAt(W, e.x, e.y) && W.units.some(a => a.side === 0 && a.alive && dist(a, e) < W.rules.sight))));\nconst DIR8K = ['동',")
rep("${A1 ? (A1.surprise ? ' · 상대는 아직 우리를 못 봄' : ' · 서로 봄') : ''}", "${A1 ? (A1.surprise ? ' · 상대는 아직 우리를 못 본 듯 (짐작)' : ' · 서로 본 듯') : ''}")
# 음수 시간 → 0
rep("left: +(u.act.end - W.t).toFixed(2), why: u.act.why || '' }", "left: Math.max(0, +(u.act.end - W.t).toFixed(2)), why: u.act.why || '' }")
open(p,'w').write(s)
p='rt3_head.js'; s=open(p).read()
a="  weave: { amp: 0.55,"
assert s.count(a)==1
s=s.replace(a,"  alien: { aim: 0.6, wind: 1.4, reload: 1.5, tied: 1.5 },   // v7.0 낯선 무기 (주운 원거리 무기를 다룰 줄 모름): 조준 × · 준비 × · 재장전 × · 점사 못 함. tied = 근접 상대가 붙은 사수의 준비 ×\n"+a)
open(p,'w').write(s)
print('ok')
