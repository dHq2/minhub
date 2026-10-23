# v8.7.7 엔진 — patch8770.py v1.0 (v1.0: 유물이 쓰는 고리 — 받는 피해 × (t.dmgK · [가호:오딜] 0.9) · 피 흘리는 상대에게 × (u.bleedK) · 왕관 조각 (W.crown — 치명타를 한 번 버팀) · 횃불 × (W.torchK) · 화상 · 동상 견딤 (t.fireRes · t.frostRes) · 뛰는 걸음 × (u.runK) · 닳음 × (u.durK — 무기 · 방패 · 갑옷) · 근접 청염 (u.wFire) · 명령 전달 + (W.cmdBonus[편]) · 숨은 몸 찾기 × (u.spotK) · 일어날 때 중상이 나음 (rise 넷째 인자) /
#   선봉장 (대방패 사수 — [대방패]): 방패를 든 채 총 · 활을 듦 · 쏘는 동안에도 방패를 듦 (예전엔 원거리 무기와 방패를 함께 못 들었음))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8760.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 받는 피해 × · 피 흘리는 상대 · 왕관 조각 ----------
rep("  if (t.stoneT != null && W.t < t.stoneT && dmg > 1){ dmg = 1; o = { ...(o || {}), stone: true, tag: '방어모드 — 피해 1' }; }   /* v8.7.4 방어모드 (붉은암석): 무엇이든 피해 1 */",
    "  if (t.stoneT != null && W.t < t.stoneT && dmg > 1){ dmg = 1; o = { ...(o || {}), stone: true, tag: '방어모드 — 피해 1' }; }   /* v8.7.4 방어모드 (붉은암석): 무엇이든 피해 1 */\n"
    "  if (u && u !== t && u.side !== t.side && dmg > 0 && !(o && o.ff)){   /* v8.7.7 받는 피해 × (가호 · 유물) · 피 흘리는 상대에게 × · 왕관 조각 (편마다 n 번 — 치명타를 체력 1 로 버팀 · 출혈 · 화상으로 숨이 다할 땐 안 버팀) */\n"
    "    if (t.dmgK > 0 && t.dmgK !== 1) dmg *= t.dmgK;\n"
    "    if (u.bleedK > 0 && (t.bleed || t.ibleed)) dmg *= u.bleedK;\n"
    "    const cw = W.crown ? W.crown[t.side] || 0 : 0; if (cw > 0 && t.alive && !t.summon && dmg >= t.hp && t.hp > 1 && !/출혈|화상/.test((o && o.tag) || '')){ W.crown[t.side] = cw - 1; dmg = t.hp - 1; t.deathKind = null; t.headAt = null; o = { ...(o || {}), tag: ((o && o.tag) ? o.tag + ' — ' : '') + '왕관 조각이 버팀' }; L(W, { k: 'crownSave', a: u.i, b: t.i, vis: t.side === 0 || !!t.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.3, s: '👑 버팀!', c: 'h', t0: W.t }); }\n"
    "  }")
rep("U.poise = +p.poise > 0 ? +p.poise : 1;",
    "U.poise = +p.poise > 0 ? +p.poise : 1; U.dmgK = (p.traits || []).includes('가호:오딜') ? 0.9 : 1; U.pavise = (p.traits || []).includes('대방패');   /* v8.7.7 [가호:오딜] 받는 피해 × 0.9 · [대방패] 방패를 든 채 쏨 */")

# ---------- 횃불 · 화상 · 동상 ----------
rep("L.push({ x: h.x, y: h.y, r: W.rules.heroLight, f: 0 });",
    "L.push({ x: h.x, y: h.y, r: W.rules.heroLight * (W.torchK && h.side === 0 ? W.torchK : 1), f: 0 });   /* v8.7.7 여신의 눈물 — 횃불이 더 밝음 (torchK) */")
rep("add = (B.dps || 3) * by.fire * stacks * (armored ? (B.armor != null ? B.armor : 0.6) : 1);",
    "add = (B.dps || 3) * by.fire * stacks * (armored ? (B.armor != null ? B.armor : 0.6) : 1) * (t.fireRes > 0 ? t.fireRes : 1);   /* v8.7.7 불에 강함 (fireRes) */")
rep("t.burn = { dps: Math.min((B.max || 9) * by.fire, (was ? was.dps : 0) + add), until: W.t + (B.t || 3), by: by.i };",
    "t.burn = { dps: Math.min((B.max || 9) * by.fire * (t.fireRes > 0 ? t.fireRes : 1), (was ? was.dps : 0) + add), until: W.t + (B.t || 3), by: by.i };")
rep("const was = W.t < (t.frostT || -9); t.frostT = Math.max(t.frostT || -9, W.t + sec);",
    "const was = W.t < (t.frostT || -9); t.frostT = Math.max(t.frostT || -9, W.t + sec * (t.frostRes > 0 ? t.frostRes : 1));   /* v8.7.7 냉기에 강함 (frostRes) */")

# ---------- 뛰는 걸음 · 닳음 ----------
rep("? (W.rules.run || 1.3) : 1)", "? (W.rules.run || 1.3) * (u.runK || 1) : 1)")   # v8.7.7 로지나의 리본 (뛸 때)
rep("u.wDur = Math.max(0, (u.wDur != null ? u.wDur : 100) - amt);",
    "u.wDur = Math.max(0, (u.wDur != null ? u.wDur : 100) - amt * (u.durK || 1));   /* v8.7.7 덜 닳음 (durK) */")
rep("(1 + (D.old != null ? D.old : 3) * (1 - u.wDur / 100)) * brk;", "(1 + (D.old != null ? D.old : 3) * (1 - u.wDur / 100)) * brk * (u.durK || 1);")
rep("base * (D.shield || 0.12) * (o.far ? 0.5 : 1) * heavy);", "base * (D.shield || 0.12) * (o.far ? 0.5 : 1) * heavy * (t.durK || 1));")
rep("it.dur = Math.max(0, +(it.dur - ab * (D.armor || 0.1)).toFixed(2));", "it.dur = Math.max(0, +(it.dur - ab * (D.armor || 0.1) * (t.durK || 1)).toFixed(2));")

# ---------- 근접 청염 ----------
rep("const fw = !u.weaponGone && ((R.weapons || {})[u.weaponNow || u.weapon] || {}).fire;",
    "const fw = !u.weaponGone && (((R.weapons || {})[u.weaponNow || u.weapon] || {}).fire || (u.wFire > 0 && !isFar(u) ? u.wFire : 0));   /* v8.7.7 청염 (u.wFire — 근접에 불) */")

# ---------- 명령 전달 + · 숨은 몸 찾기 ----------
rep("const p = 1 - (1 - pv) * (1 - ps), via = pv <= 0 && ps <= 0 ? 'none' : pv >= ps ? 'voice' : 'sign';",
    "const cb7 = W.cmdBonus ? W.cmdBonus[C.side] || 0 : 0, p = Math.min(1, 1 - (1 - pv) * (1 - ps) + (cb7 > 0 && (pv > 0 || ps > 0) ? cb7 : 0)), via = pv <= 0 && ps <= 0 ? 'none' : pv >= ps ? 'voice' : 'sign';   /* v8.7.7 군기 — 닿는 길이 있으면 + (cmdBonus) */")
rep("const sk0 = t.side !== u.side ? stealthK(W, t) : 1,", "const sk0 = t.side !== u.side ? Math.min(1, stealthK(W, t) * (u.spotK || 1)) : 1,")   # v8.7.7 데이터 조각 — 숨은 몸이 더 멀리서 보임

# ---------- 일어날 때 중상이 나음 (왐의 머리촛대) ----------
rep("function rise(W, t, pct){", "function rise(W, t, pct, cure){   /* v8.7.7 cure: 중상 (부상 · 쇼크 · 출혈 · 내출혈 · 화상 · 기절) 도 나음 — 잃은 눈 · 팔은 그대로 */")
rep("  L(W, { k: 'rise', a: t.i, hp: Math.round(t.hp), vis: t.side === 0 || !!t.seenBy });",
    "  if (cure){ t.inj = []; t.shock = 0; t.ibleed = null; t.bleed = null; t.burn = null; t.koT = null; t.deathKind = null; t.headAt = null; try { injRecalc(W, t); } catch (e) {} }\n"
    "  L(W, { k: 'rise', a: t.i, hp: Math.round(t.hp), ...(cure ? { cure: true } : {}), vis: t.side === 0 || !!t.seenBy });")

# ---------- 선봉장 (대방패 사수) ----------
rep("(a.k === 'atk' && u.shield && !isFar(u) && u.guardMode !== 'off'));   // v5.7.1 방패 뒤에서 치기",
    "(a.k === 'atk' && u.shield && (!isFar(u) || u.pavise) && u.guardMode !== 'off'));   // v5.7.1 방패 뒤에서 치기   /* v8.7.7 [대방패] 는 쏘는 동안에도 방패를 듦 */")
rep("!(isFar(u) && isRangedW((W.rules.weapons || {})[u.weapon] || {}))", "!(isFar(u) && isRangedW((W.rules.weapons || {})[u.weapon] || {}) && !u.pavise)")
rep("shield: 110, armShield: 140,", "shield: 110, armShield: 140, pavise: 160,")   # v8.7.7 대방패의 방호 (보통 방패 110 · 팔 갑피 140)
rep("A = Math.max(A, t.armShield && !t.shield ? PN.armShield : PN.shield);", "A = Math.max(A, t.armShield && !t.shield ? PN.armShield : t.pavise ? PN.pavise || 160 : PN.shield);")
rep("A = (t.armShield && !t.shield ? PN.armShield : PN.shield) * (arcX ? 0.9 : 1),", "A = (t.armShield && !t.shield ? PN.armShield : t.pavise ? PN.pavise || 160 : PN.shield) * (arcX ? 0.9 : 1),")
rep("if (isRangedW(wp)) return '원거리 무기 (' + p.weapon + ') 를 든 채로는 방패를 못 듦';",
    "if (isRangedW(wp) && !(p.traits || []).includes('대방패')) return '원거리 무기 (' + p.weapon + ') 를 든 채로는 방패를 못 듦';")
rep("if (p.shield && (wp.two || isRangedW(wp))) return '방패를 든 채로는 못 듦 (' + (wp.two ? '두 손 무기' : '원거리') + ')';",
    "if (p.shield && (wp.two || (isRangedW(wp) && !(p.traits || []).includes('대방패')))) return '방패를 든 채로는 못 듦 (' + (wp.two ? '두 손 무기' : '원거리') + ')';")

# ---------- 시험용 내보내기 ----------
rep("lungeChk, stepOK, mvAim, strafeWant, running, ancOf, chiefOf, invOp,", "lungeChk, stepOK, mvAim, strafeWant, running, ancOf, chiefOf, injRecalc, woundAdd, invOp,")   # rise · frostOn · burnOn · applyDmg 는 이미 내보냄

for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8770 OK')
