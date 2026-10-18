def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:70], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
T = 'rt3_tail.js'
# 생성: 팔 방패
rep(T, "hh = heightOf(p), role0 = roleOf(p, rules);\n", "hh = heightOf(p), role0 = roleOf(p, rules);\n    // v5.9.8 팔 방패 (◆개조된 신체 · 카리우스): 팔을 들어 방패처럼 막음 — 로직은 방패와 같음 (막기 · 밀치기 · 돌격 버팀 · 방패벽). 몸이라 떨어뜨리지 않음. 진짜 방패를 들면 그걸 씀\n    const armCan = !!p.modBody || (p.unique || []).includes('개조된 신체') || tr.includes('개조된 신체'), armSh = armCan && !p.shield, sh = !!p.shield || armSh;\n")
rep(T, "shield: !!p.shield, kit0: { weapon: p.weapon || '', shield: !!p.shield }, smellG", "shield: sh, armCan, armShield: armSh, kit0: { weapon: p.weapon || '', shield: !!p.shield, arm: armSh }, smellG")
rep(T, "canSweep: tr.includes('거구'), canBash: !!p.shield, bashCd", "canSweep: tr.includes('거구'), canBash: sh, bashCd")
rep(T, "      canGuard: !!p.shield || !!wp.guard || (p.traits || []).includes('반사신경') || parryArcW(rules, p.weapon) > 0, parry: !p.shield && !wp.guard", "      canGuard: sh || !!wp.guard || (p.traits || []).includes('반사신경') || parryArcW(rules, p.weapon) > 0, parry: !sh && !wp.guard")
rep(T, "      gTal: (p.shield || wp.guard || parryArcW", "      gTal: (sh || wp.guard || parryArcW")
rep(T, "      gArc: Math.round(Math.max(p.shield ? rules.frontArc : 0, wp.guard ? rules.guardArcW || 40 : 0, (p.traits || []).includes('반사신경') ? (wp.guard || p.shield ? rules.guardArcRW || 55 : rules.guardArcR || 20) : 0) * ((p.shield || wp.guard) ?", "      gArc: Math.round(Math.max(sh ? rules.frontArc : 0, wp.guard ? rules.guardArcW || 40 : 0, (p.traits || []).includes('반사신경') ? (wp.guard || sh ? rules.guardArcRW || 55 : rules.guardArcR || 20) : 0) * ((sh || wp.guard) ?")
# 돌격 태세로 버팀 · 받아치기
rep(T, "how: t.shield ? '방패' : sp ? '창' : '무구'", "how: t.armShield ? '팔' : t.shield ? '방패' : sp ? '창' : '무구'")
rep(T, "tag: pierce ? '창에 꿰뚫림' : t.shield ? '방패로 받아침'", "tag: pierce ? '창에 꿰뚫림' : t.shield ? (t.armShield ? '팔로 받아침' : '방패로 받아침')")
# 돌진 로그
rep(T, "name: u.chargeName, cry, mute: u.mute, shield: !!u.shield, vis", "name: u.chargeName, cry, mute: u.mute, shield: !!u.shield, arm: !!u.armShield, vis")
# 떨어뜨림: 팔은 몸 — 팔을 잃을 때만 못 씀
rep(T, "function dropShield(W, u, how){ if (u.shield){ dropItem(W, u, 'shield', '방패', null, how); u.shield = false; } }",
       "function dropShield(W, u, how){ if (u.armShield){ if (how === 'arm' || how === 'arms'){ u.shield = false; u.armShield = false; } return; }   // v5.9.8 팔 방패는 몸 — 쓰러져도 떨어지지 않고, 그 팔을 잃을 때만 못 씀\n  if (u.shield){ dropItem(W, u, 'shield', '방패', null, how); u.shield = false; } }")
# 줍기: 팔로 막던 카리우스도 진짜 방패를 들 수 있음
rep(T, "if (it.k === 'shield') return !u.shield && !(u.arms && u.arms.L)", "if (it.k === 'shield') return (!u.shield || u.armShield) && !(u.arms && u.arms.L)")
rep(T, "    u.shield = true; u.shieldLost = false; u.canGuard = true;", "    u.shield = true; u.armShield = false; u.shieldLost = false; u.canGuard = true;")
# 막은 것 이름
rep(T, "o.gn = t.shield ? '방패' :", "o.gn = t.armShield ? '팔' : t.shield ? '방패' :")
# 왼팔을 잃음
rep(T, "  } else if (k === 'L' && t.shield){\n    dropShield(W, t, 'arm'); t.shieldLost = true; t.canGuard = !!wp.guard; t.canBash = false; eff.push('방패를 놓침');",
       "  } else if (k === 'L' && t.shield){\n    const arm = t.armShield; dropShield(W, t, 'arm'); t.shieldLost = true; t.canGuard = !!wp.guard; t.canBash = false; eff.push(arm ? '막던 팔을 못 씀' : '방패를 놓침');   // v5.9.8 팔 방패")
# 밀치기
rep(T, "  L(W, { k: 'wind', a: u.i, b: t.i, bash: true, body: !!body,", "  L(W, { k: 'wind', a: u.i, b: t.i, bash: true, body: !!body, arm: !body && !!u.armShield,")
rep(T, "tag: bd ? '몸 밀치기' : '방패 밀치기'", "tag: bd ? '몸 밀치기' : u.armShield ? '팔 밀치기' : '방패 밀치기'")
rep(T, "  L(W, { k: 'shove', a: a.i, b: t.i, len: +len.toFixed(2), how: (o && o.how) || '',", "  L(W, { k: 'shove', a: a.i, b: t.i, len: +len.toFixed(2), how: (o && o.how) || '', arm: !!a.armShield,")
rep(T, "L(W, { k: 'guardBreak', a: u.i, b: t.i, vis: true })", "L(W, { k: 'guardBreak', a: u.i, b: t.i, arm: !!t.armShield, vis: true })")
print('engine ok')
