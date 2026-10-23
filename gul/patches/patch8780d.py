# v8.7.8 엔진 (4) — patch8780d.py v1.1 (v1.1: 광역 손짓 스스로 — 동료가 들어도 적이 충분히 많으면 감수 (넘어질 동료 1.5 · 대형 0.5 로 셈 · 전엔 동료가 하나라도 들면 안 써 거의 못 씀) · 마력 치유 (줄지 않음 — 딸기 · 물레 · 테헤라 · 튤린) 는 치료 방침의 기본이 '알아서' (healPolOf — 구급상자 · 약은 그대로 '위급할 때만' · 고른 방침이 늘 먼저) · v1.0: 물레 · 콜라이더 · 테헤라 (명세 C8 · B10 · 도감 C-174 · C-175 · C-016 · 3D 기술표 h2_roster · 3D 구현 h2.js) — 적 · 아군 같은 규칙:
#   물레 (정령계 앰버서더 · 물계열 대정령 · 힐 서폿): 정령 지시 (12칸 물 정령 탄 · 맞으면 1초 이동 −20%) · 정령의 손길 (마력 치유 10칸 — 25% + 이어서 4초 초당 2%) · 정령 강림 (반지름 8 · 6초 — 동료 초당 3% · 이동 +15% / 적 이동 −30%) ·
#         정령 방벽 (앞 3칸 · 너비 4 · 4초 — 적 탄을 막고 닿은 근접 적을 2칸 밀어냄) · 땅의 정령 (20초 — 체력이 가장 낮은 동료를 따라 3초마다 5%) · 물 정령 탄 (세 발 × 0.6) · ◆정령 계약 (편 모두 최대 체력 +8% · 곁 5칸 초당 0.6% · 쓰러진 동료가 두 배 빨리 일어남)
#   콜라이더 (마계 대사 대귀족 · 심연계 마족 · 딜 서폿): 갈퀴 꼬리 (몸 가운데부터 3칸 · 부채꼴 100° · 두 번 — 둘째는 검은 파편 0.5초 휘청) · 별빛 지목 (15칸 탄 — 6초 받는 피해 +20% · 처음 맞을 때 0.8초 묶임) ·
#         차원 문 (앞 4칸 · 8초 · 반지름 4 — 1초마다 1.5칸 끌어옴 · 닿은 적 탄은 사라짐 · 다시 쓰면 15칸 안 동료 하나를 문 앞으로) · 마계 장막 (반지름 6 · 5초 — 안의 동료 원거리 피해 −50% · 넘어 들어오는 적 0.5초 휘청) ·
#         유혹의 손짓 (앞 8칸 60° — 적 하나 2초 매혹 · 마계 적 3초 · 보스는 절반) · ◆마계 대사 (같은 편 마법 피해 +10% · 숨이 끊길 일격을 꼬리 그림자가 한 번 대신 막음 — 체력 1)
#   테헤라 (7성 서포터 · 명세 B10): 기본 손짓 (12칸 탄 · 곡사 없음 · 1초 둔화 20%) · 요정의 축복 (마력 힐 — 곁 5칸 동료 모두 25% + 4초 받는 피해 −15%) · 광역 손짓 (방사형 8칸 90° — 동료도 맞음 · 둔기 · 중대형까지 넘어짐) ·
#         은빛 비행 (8칸 날아감 — 바위를 넘음 · 지나간 줄의 적 × 0.4 · 0.8초 둔화) · 날개 방패 (2초 받는 피해 −80% · 끝날 때 둘레 3칸 눈멂 1초) · 나른한 꿈 (앉아서 반지름 6 · 5초 — 적 공격 속도 −40% · 동료 초당 1%) ·
#         [축복:테헤라] (곁 5칸 동료 재생D (초당 1.5) + 받는 피해 × 0.9) · ◆요정 날개 (늘 떠 있음 — 장판 · 얕은 물을 밟지 않음 · 원거리 15% 흘림)
#   함께 고친 것: 마법 탄은 쏜 무기의 성질로 맞음 (꼬리를 든 콜라이더의 별빛 탄 = 마법) · 긴 꼬리 (3칸) 는 사수로 보지 않음 (longReach))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8780c.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 수치표 ----------
rep("  karius: { grit:", """  sup8: { pact: { hp: 0.08, r: 5, regen: 0.006, revive: 2 }, envoy: { magic: 1.1 }, bless: { r: 5, regen: 1.5, dmg: 0.9 }, wings: { evade: 0.15 }, spirit: { hp: 40, spd: 3.2 },   /* v8.7.8 서포터 셋 — ◆정령 계약 (물레: 편 모두 최대 체력 +hp · 곁 r 칸 초당 regen (3D h2.js) · 쓰러진 [불사] 동료가 revive 배 빨리 일어남 (3D 기술표: 살리는 시간 −50%)) · ◆마계 대사 (콜라이더: 같은 편 마법 피해 × magic · 꼬리 그림자 한 번) · [축복:테헤라] (명세 B10: 곁 r 칸 동료 재생D (초당 regen — 성해포와 같은 등급) + 받는 피해 × dmg) · ◆요정 날개 (원거리 evade 만큼 흘림) · 땅의 정령 (몸) */
    whip: { r: 3, arc: 100, wind: 0.3, gap: 0.2, mul: 0.5, stun: 0.5, rec: 0.6 } },   /* 갈퀴 꼬리 채찍 (콜라이더 기본 일격 — 3D 구현: 몸 가운데부터 3 · 1.8 rad · 준비 0.3 · 대기 0.9 · × 1.0 / 기술표: 2타 · 둘째는 검은 파편 0.5초 경직 → × 0.5 두 번) */
  karius: { grit:""")
rep("    pmark: { cd: 12, rng: 9 },",
    "    mdesc: { rng: 9, r: 8, t: 6, heal: 0.03, fast: 1.15, slow: 0.7, wind: 0.6, rec: 0.4, cd: 14 }, mwall: { ahead: 3, len: 4, t: 4, push: 2, wind: 0.35, rec: 0.3, cd: 10 }, mspirit: { t: 20, gap: 3, pct: 0.05, rng: 6, wind: 0.6, rec: 0.4, cd: 25 }, mvolley: { rng: 12, n: 3, gap: 0.2, mul: 0.6, vel: 22, wind: 0.35, rec: 0.3, cd: 6 },   /* v8.7.8 물레 (3D 기술표 수치 · 대기 · 쓸 거리는 3D 구현 — 땅의 정령 대기는 원본에 없어 부름 20초 + 5) */\n"
    "    cgate: { ahead: 4, t: 8, r: 4, gap: 1, pull: 1.5, eat: 0.9, tp: 15, wind: 0.5, rec: 0.4, cd: 12 }, cstar: { rng: 15, mul: 1.0, vel: 26, vine: 0.8, t: 6, k: 1.2, wind: 0.4, rec: 0.3, cd: 8 }, cveil: { r: 6, t: 5, far: 0.5, stun: 0.5, wind: 0.5, rec: 0.3, cd: 16 }, clure: { rng: 8, arc: 60, t: 2, demon: 3, boss: 0.5, wind: 0.7, rec: 0.4, cd: 12 },   /* v8.7.8 콜라이더 */\n"
    "    tsweep: { rng: 8, arc: 90, mul: 1.2, down: 1.2, kd: '중대형', kb: 0.8, wind: 0.6, rec: 0.5, cd: 10 }, tflight: { len: 8, v: 16, w: 1, mul: 0.4, slow: 0.2, slowT: 0.8, wind: 0.15, rec: 0.2, cd: 7 }, twing: { t: 2, k: 0.2, r: 3, blind: 1, wind: 0.1, cd: 10 }, tdream: { r: 6, t: 5, atk: 0.6, heal: 0.01, wind: 0.5, cd: 14 },   /* v8.7.8 테헤라 (광역 손짓은 명세 B10 · 나머지는 3D 기술표 수치 + 3D 구현 대기) */\n"
    "    pmark: { cd: 12, rng: 9 },")
rep("'어퐁의 철퇴':{rng:0.6, kind:'둔기'}", "'어퐁의 철퇴':{rng:0.6, kind:'둔기'}, '정령 지시':{rng:12, aim:0.6, vel:22, P:999, kind:'마법', slow:{k:0.2, t:1}}, '손짓':{rng:12, aim:0.6, vel:18, P:999, kind:'마법', slow:{k:0.2, t:1}}, '갈퀴 꼬리':{rng:2.4, kind:'짐승', tail:true}")   # v8.7.8 물레 정령 지시 (3D 12 · 탄속 22) · 테헤라 기본 손짓 (명세: 긴 사거리 · 투사체 · 곡사 없음 / 3D 빛가루 12 · 탄속 18 · 1초 둔화 20%) · 콜라이더 꼬리 (몸 가운데부터 3 — 몸끼리 2.4)
rep("'혈영보': 'blink', '초돌진': 'asup',", "'혈영보': 'blink', '정령 강림': 'mdesc', '정령 방벽': 'mwall', '땅의 정령': 'mspirit', '물 정령 탄': 'mvolley', '차원 문': 'cgate', '별빛 지목': 'cstar', '마계 장막': 'cveil', '유혹의 손짓': 'clure', '광역 손짓': 'tsweep', '은빛 비행': 'tflight', '날개 방패': 'twing', '나른한 꿈': 'tdream', '초돌진': 'asup',")
rep("const ITEM_NATURAL = ['맨손', '이빨·발톱', '발'];", "const ITEM_NATURAL = ['맨손', '이빨·발톱', '발', '갈퀴 꼬리'];   /* v8.7.8 콜라이더의 꼬리는 몸 */")

# ---------- 몸: 서포터 표시 · 꼬리 · 땅의 정령 · 치유 틀의 덧붙임 ----------
rep("U.karKit = U.grit || U.heretic0 || (U.spec || []).some(x => ['kgrab', 'ksw', 'khook', 'kstomp'].includes(x.k));",
    "U.karKit = U.grit || U.heretic0 || (U.spec || []).some(x => ['kgrab', 'ksw', 'khook', 'kstomp'].includes(x.k)); U.mulKit = (p.unique || []).includes('정령 계약'); U.colKit = (p.unique || []).includes('마계 대사'); U.fairyW = (p.unique || []).includes('요정 날개'); U.tBless = (p.traits || []).includes('축복:테헤라'); if (((rules.weapons || {})[p.weapon] || {}).tail) U.longReach = true; if (p.spiritOf != null){ U.spiritOf = p.spiritOf; U.summon = 'spirit'; } U.supKit = U.mulKit || U.colKit || U.fairyW || U.tBless || U.spiritOf != null || (U.spec || []).some(x => SUP_K.includes(x.k)); if (U.supKit) W.sup8 = true;   /* v8.7.8 물레 · 콜라이더 · 테헤라 (긴 꼬리는 사수가 아님 — longReach) */")
rep("inf: !!p.skill.inf, regen: +(p.skill.regen || 0) } : null,",
    "inf: !!p.skill.inf, regen: +(p.skill.regen || 0), hotB: +(p.skill.hotB || 0), hotT: +(p.skill.hotT || 0), aoe: +(p.skill.aoe || 0), gK: +(p.skill.gK || 0), gT: +(p.skill.gT || 0) } : null,   /* v8.7.8 정령의 손길 (이어서 초당 hotB · hotT 초) · 요정의 축복 (곁 aoe 칸 모두 · 받는 피해 × gK · gT 초) */")

# ---------- 기본 일격: 갈퀴 꼬리 ----------
rep("if (u.h2){ const K = h2Kit(u); if (K && !u.act",
    "if (u.colKit && t && t.side !== u.side && !isFar(u) && u.weapon === '갈퀴 꼬리' && !u.weaponGone && !(u.weaponNow && u.weaponNow !== u.weapon)){ cwhipStart(W, u, t, why); return; }   /* v8.7.8 콜라이더 — 갈퀴 꼬리 채찍 (부채꼴 두 번) */\n  if (u.h2){ const K = h2Kit(u); if (K && !u.act")
rep("  if (u.act.k === 'skill'){ resolveSkill(W, u); return; }",
    "  if (u.act.k === 'cwhip'){ cwhipResolve(W, u); return; }   /* v8.7.8 갈퀴 꼬리 */\n  if (u.act.k === 'skill'){ resolveSkill(W, u); return; }")
rep("  if (KAR_K.includes(k)){ karResolve(W, u, A, S, t); return; }   /* v8.7.8 카리우스 */",
    "  if (KAR_K.includes(k)){ karResolve(W, u, A, S, t); return; }   /* v8.7.8 카리우스 */\n  if (SUP_K.includes(k)){ supResolve(W, u, A, S, t); return; }   /* v8.7.8 물레 · 콜라이더 · 테헤라 */")
rep("kit: true, revive, stanch, stab });",
    "kit: true, revive, stanch, stab }); if (K.hotB || K.aoe) supKitHeal(W, u, t, K);   /* v8.7.8 정령의 손길 · 요정의 축복 */")
# 공격 속도 (나른한 꿈 안의 적): 준비 · 거둠 × 1 / atk
rep("(heal ? 1 : fatMul(W, u, 'wind') * (u.injWind || 1))", "(heal ? 1 : fatMul(W, u, 'wind') * (u.injWind || 1) * supAtkK(W, u))")
rep("A.end = W.t + u.rec * (far ?", "A.end = W.t + u.rec * supAtkK(W, u) * (far ?")

# ---------- 동작 ----------
rep("  if ((u.karKit || u.modBody) && karTick(W, u, dt)) return;   /* v8.7.8 근성",
    "  if (u.act && u.act.k === 'tfly'){ tflyStep(W, u, dt); return; }   /* v8.7.8 은빛 비행 (날아가는 동안은 끊기지 않음) */\n  if ((u.karKit || u.modBody) && karTick(W, u, dt)) return;   /* v8.7.8 근성")
rep("if (u.kb || W.t < u.proneT || W.t < (u.stunT || -9)) return;",
    "if (u.kb || W.t < u.proneT || W.t < (u.stunT || -9)) return; if ((u.supKit || u.charm) && supAct(W, u, dt)) return;   /* v8.7.8 매혹 · 앉아 졸음 · 날개 방패 · 땅의 정령 · 서포터 기술 (스스로) */")
rep("  karWorld(W);   /* v8.7.8", "  supWorld(W, dt);   /* v8.7.8 물레 · 콜라이더 · 테헤라: 장판 · 문 · 방벽 · 장막 · 축복 · 계약 */\n  karWorld(W);   /* v8.7.8")
rep("    if (!sp){ u.order = null; return; }", "    if (!sp){ u.order = null; return; }\n    if (SUP_K.includes(o.s) && supOrder(W, u, o, sp, dt)) return;   /* v8.7.8 서포터 기술 명령 (바닥 · 동료 · 적 · 제자리) */")

# ---------- 받는 피해 · 탄 ----------
rep("dmg = porenTake(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.7.8 포렌 · 쥐 방패 · 구르기 */",
    "dmg = porenTake(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.7.8 포렌 · 쥐 방패 · 구르기 */\n    if (W.sup8) dmg = supTake(W, u, t, dmg, o);   /* v8.7.8 별빛 지목 · 마계 장막 · 축복 · 날개 방패 · 마계 대사 */")
rep("  if (t.grit && !t.lsEnd && t.alive){ dmg = karGritHit(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.7.8 근성 */",
    "  if (t.grit && !t.lsEnd && t.alive){ dmg = karGritHit(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.7.8 근성 */\n"
    "  if (t.colKit && !t.tailUsed && t.alive && u !== t && dmg >= t.hp && t.hp >= 1 && !/출혈|화상|근성/.test((o && o.tag) || '')){ t.tailUsed = true; dmg = Math.max(0, t.hp - 1); t.deathKind = null; t.headAt = null; o = { ...(o || {}), tag: ((o && o.tag) ? o.tag + ' — ' : '') + '꼬리 그림자가 대신 막음' }; L(W, { k: 'colTail', a: u.i, b: t.i, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y, s: '꼬리 그림자 — 버팀!', c: 'b', t0: W.t }); if (!(dmg > 0)) return; }   /* v8.7.8 ◆마계 대사: 숨이 끊길 일격을 꼬리 그림자가 한 번 (체력 1 — 3D last) */")
rep("if (s.side === b.side || (s.ev && s.ev.includes(b.i))) return false;",
    "if (s.side === b.side || (s.ev && s.ev.includes(b.i))) return false;\n  if (b.fairyW && wingsDodge(W, b, s)) return true;   /* v8.7.8 ◆요정 날개: 원거리 15% 를 날개로 흘림 */")
rep("if (W.wards && W.wards.length && wardStop(W, s, s.x, s.y, nx, ny)) break;",
    "if (W.wards && W.wards.length && wardStop(W, s, s.x, s.y, nx, ny)) break; if (W.sf8 && W.sf8.length && supShotStop(W, s, s.x, s.y, nx, ny)) break;   /* v8.7.8 정령 방벽 · 차원 문 */")
rep("if (!(W.wards && W.wards.length && wardStop(W, s, s.x0, s.y0, s.lx, s.ly, true))) landArc(W, s);",
    "if (!(W.wards && W.wards.length && wardStop(W, s, s.x0, s.y0, s.lx, s.ly, true)) && !(W.sf8 && W.sf8.length && supShotStop(W, s, s.x0, s.y0, s.lx, s.ly, true))) landArc(W, s);")
rep("const o2 = strike(W, u, hit, s.meant != null ? W.units[s.meant] : hit,",
    "const swn = !!s.sup && s.wn !== (u.weaponNow || u.weapon), wn0 = u.weaponNow; if (swn) u.weaponNow = s.wn;   /* v8.7.8 마법 탄은 쏜 무기 (마법) 의 성질로 맞음 */\n        const o2 = strike(W, u, hit, s.meant != null ? W.units[s.meant] : hit,")
rep("        if (near && o2 && hit.alive && !hit.kb && !o2.block) shove(W, u, hit, NW.kb || 1, s.dx, s.dy, { tag: '샷건에 날아감', mass: (W.rules.shove || {}).proj || 80, fix: true });",
    "        if (swn) u.weaponNow = wn0; if (W.sup8 || s.slow8 || s.star || ((W.rules.weapons || {})[s.wn] || {}).slow) supShotHit(W, u, s, hit, o2);   /* v8.7.8 별빛 표식 · 덩굴 · 물 정령 탄 · 손짓 둔화 */\n"
    "        if (near && o2 && hit.alive && !hit.kb && !o2.block) shove(W, u, hit, NW.kb || 1, s.dx, s.dy, { tag: '샷건에 날아감', mass: (W.rules.shove || {}).proj || 80, fix: true });")

# ---------- 걸음 · 날개 ----------
rep("(u.sqzSlow && W.t < u.sqzSlow ? 0.6 : 1);", "(u.sqzSlow && W.t < u.sqzSlow ? 0.6 : 1) * (W.sup8 ? supSpd(W, u) : 1);")
rep("(W.map.water && wetAt(W.map, u.x, u.y) ?", "(W.map.water && !u.fairyW && wetAt(W.map, u.x, u.y) ?")   # 요정 날개: 얕은 물을 밟지 않음
rep("for (const e of W.units){ if (!e.alive || e.i === P.by) continue; const d = Math.hypot(e.x - P.x, e.y - P.y);",
    "for (const e of W.units){ if (!e.alive || e.i === P.by || e.fairyW) continue; const d = Math.hypot(e.x - P.x, e.y - P.y);")   # 장판을 밟지 않음
rep("for (const e of W.units){ if (!e.alive || e.i === P.by || Math.hypot(e.x - P.x, e.y - P.y) > P.r + e.r * 0.5) continue; burnOn(",
    "for (const e of W.units){ if (!e.alive || e.i === P.by || e.fairyW || Math.hypot(e.x - P.x, e.y - P.y) > P.r + e.r * 0.5) continue; burnOn(")
rep("const blindTo = (W, u, t) => !u.nv", "const blindTo = (W, u, t) => (u.blindT8 != null && W.t < u.blindT8) || !u.nv")   # 날개 방패의 빛가루 — 1초 눈멂
rep("u.hp = Math.min(u.max, u.hp + rg); if (u.hp >= u.max * undMove(W)) rise(W, u);",
    "u.hp = Math.min(u.max, u.hp + rg * (W.pact8 && W.pact8[u.side] ? (SUPR(W).pact || {}).revive || 2 : 1)); if (u.hp >= u.max * undMove(W)) rise(W, u);")   # ◆정령 계약: 쓰러진 [불사] 동료가 두 배 빨리 일어남

SUP = r"""
/* ---------- v8.7.8 물레 · 콜라이더 · 테헤라 (명세 C8 · B10 · 도감 · 3D 기술표 h2_roster + 3D 구현 h2.js) — 적 · 아군 같은 규칙 ----------
   수치는 기술표 그대로 (칸 = 3D 의 m — 카리우스와 같음) · 대기 · 준비 · 쓸 거리는 3D 구현 · 체력 · 공격은 3D 비 (200 : 175 : 125) 를 명세의 테헤라 체력 200 에 맞춤 (× 1.6).
   장판 · 문 · 방벽 · 장막은 W.sf8 (k: desc · dream · veil · gate · wall) — 그린 그대로 판정 (모양 · 자리 · 남은 때). 피해 보정은 받는 쪽에서 (supTake). */
const SUP_K = ['mdesc', 'mwall', 'mspirit', 'mvolley', 'cgate', 'cstar', 'cveil', 'clure', 'tsweep', 'tflight', 'twing', 'tdream'];
const SUP_SELF = ['mspirit', 'cveil', 'twing', 'tdream'];   // 제자리에서 바로
const SUP_FOE = ['mvolley', 'cstar', 'clure'];   // 적을 노림
const SUPR = W => W.rules.sup8 || {};
const isDemon = u => /마족|악마|마계/.test((u.race || '') + ' ' + (u.origin || ''));
const supVis = (W, u) => u.side === 0 || !!u.seenBy;
const sfOf = (W, k, by) => (W.sf8 || []).find(F => F.k === k && (by == null || F.by === by) && W.t < F.until);
const supFoes = (W, u, R) => W.units.filter(e => e.alive && !e.gone && e.side !== u.side && !e.down && (R == null || dist(u, e) <= R));
const supMates = (W, u, R) => W.units.filter(a => a.alive && !a.gone && a.side === u.side && (R == null || dist(u, a) <= R));
const supKnown = (W, u, e) => canSee(W, u, e) || (u.side === 0 ? !!e.seenBy : fresh(W, u.sense[e.i], 2));
const supAtkK = (W, u) => W.sup8 && W.t < (u.dreamT || -9) ? 1 / (SPR(W, 'tdream').atk || 0.6) : 1;   // 나른한 꿈 안의 적: 공격 속도 −40%
const supSpd = (W, u) => (W.t < (u.vineT || -9) ? 0.02 : 1) * (W.t < (u.descT || -9) ? SPR(W, 'mdesc').fast || 1.15 : 1) * (W.t < (u.descSlowT || -9) ? SPR(W, 'mdesc').slow || 0.7 : 1) * (u.slow8 && W.t < u.slow8.until ? 1 - u.slow8.k : 1);
function sfAdd(W, F){ (W.sf8 || (W.sf8 = [])).push(F); W.sup8 = true; return F; }
// 선분 (벽) 까지의 거리 · 어느 쪽인가
function wallQ(F, x, y){ const dx = x - F.x, dy = y - F.y, al = Math.max(-F.h, Math.min(F.h, dx * F.ux + dy * F.uy)), px = F.x + F.ux * al, py = F.y + F.uy * al, s = dx * F.nx + dy * F.ny >= 0 ? 1 : -1; return { d: Math.hypot(x - px, y - py), s }; }
// 두 선분이 만나는가 (탄의 길 · 방벽)
function segX(ax, ay, bx, by, cx, cy, dx, dy){ const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx); if (Math.abs(d) < 1e-9) return null; const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d, u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d; return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? t : null; }
// 선분 (탄의 길) 이 점에 r 안으로 지나가나
function segNear(ax, ay, bx, by, x, y, r){ const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1e-9, k = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)); return Math.hypot(ax + dx * k - x, ay + dy * k - y) <= r ? k : null; }

/* ---- 마법 탄 하나 (물 정령 탄 · 별빛 지목): 이 판의 탄 그대로 — 피할 수 있음 · 막힐 수 있음 · 길에 먼저 닿는 몸이 맞음 ---- */
function supBolt(W, u, t, o){
  const d = Math.max(0.3, dist(u, t)), p = Math.min(0.99, aimP(W, u, t) * (o.pm || 1)), v = o.vel || 22, ld = Math.min(1, 0.6 + (u.marks || 0)) * d / v, base = Math.atan2(t.y + (t.vy || 0) * ld - u.y, t.x + (t.vx || 0) * ld - u.x);
  const good = W.rand() < p, off = good ? (W.rand() * 2 - 1) * t.r * 0.55 : (W.rand() < 0.5 ? -1 : 1) * (t.r + 0.12 + W.rand() * 0.55), ang = base + Math.atan2(off, d), dx = Math.cos(ang), dy = Math.sin(ang);
  const s = { id: ++W.shotN, a: u.i, meant: t.i, x: u.x + dx * (u.r + 0.02), y: u.y + dy * (u.r + 0.02), x0: u.x, y0: u.y, dx, dy, sp: v, left: (o.rng || 12) + u.r + 2.5, p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: o.mul || 1, pm: 1, gun: false, cov: null, wn: o.wn || '마법', sup: o.n || '마법', ...(o.star ? { star: 1 } : {}) };
  W.shots.push(s); return s;
}
// 탄이 맞음: 별빛 표식 (6초 받는 피해 +20% — 처음이면 덩굴 0.8초) · 마법 탄의 둔화 (정령 지시 · 손짓 — 1초 이동 −20%)
function supShotHit(W, u, s, hit, o2){
  if (!hit || !hit.alive || hit.side === s.side) return;
  const blk = !!(o2 && o2.block), wp = (W.rules.weapons || {})[s.wn] || {};
  if (s.star && !blk){ const S = SPR(W, 'cstar'), first = !(hit.star8 && W.t < hit.star8.until); hit.star8 = { side: s.side, by: s.a, until: W.t + (S.t || 6), k: S.k || 1.2 }; W.sup8 = true; if (first){ hit.vineT = W.t + (S.vine || 0.8); stop(hit); }
    L(W, { k: 'starMark', a: s.a, b: hit.i, vine: first, vis: s.side === 0 || hit.side === 0 || !!hit.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: hit.x, y: hit.y, s: first ? '★ 표식 · 덩굴!' : '★ 표식', c: 'd', t0: W.t }); }
  if (wp.slow && !blk){ hit.slow8 = { k: wp.slow.k || 0.2, until: W.t + (wp.slow.t || 1) }; W.sup8 = true; }
}
// 탄의 길: 정령 방벽 (선분) 을 넘으면 막힘 · 차원 문 (가운데 eat 칸) 에 닿으면 사라짐 — 상대 편의 탄만
function supShotStop(W, s, x0, y0, x1, y1, arc){
  for (const F of W.sf8){ if (W.t >= F.until || F.side === s.side) continue;
    let k = null, how = '';
    if (F.k === 'wall'){ k = segX(x0, y0, x1, y1, F.x - F.ux * F.h, F.y - F.uy * F.h, F.x + F.ux * F.h, F.y + F.uy * F.h); how = 'wall'; }
    else if (F.k === 'gate'){ k = segNear(x0, y0, x1, y1, F.x, F.y, F.eat || 0.9); how = 'gate'; }
    if (k == null) continue;
    s.done = true; s.x = x0 + (x1 - x0) * k; s.y = y0 + (y1 - y0) * k; if (arc){ s.lx = s.x; s.ly = s.y; }
    const u = W.units[s.a]; if (u && !s.supp) u.miss++;
    if (W.t - (F.blkT || -9) > 0.6){ F.blkT = W.t; L(W, { k: how === 'wall' ? 'wallBlock' : 'gateEat', a: F.by, b: s.a, jav: !!s.jav, arc: !!arc, vis: true }); }
    if (W.fxOn) W.fx.push({ k: 'num', x: s.x, y: s.y, s: how === 'wall' ? '방벽에 막힘' : '문에 삼켜짐', c: 'b', t0: W.t });
    if (s.jav) dropSpear(W, s, s.x - s.dx * 0.4, s.y - s.dy * 0.4, 'bounce');
    return true; }
  return false;
}
// ◆요정 날개: 원거리 15% 를 날개로 흘림 (탄은 그대로 지나감)
function wingsDodge(W, b, s){
  if (W.rand() >= ((SUPR(W).wings || {}).evade || 0.15)) return false;
  (s.ev = s.ev || []).push(b.i); L(W, { k: 'wingDodge', a: b.i, b: s.a, vis: supVis(W, b) });
  if (W.fxOn) W.fx.push({ k: 'num', x: b.x, y: b.y, s: '날개로 흘림', c: 'm', t0: W.t }); return true;
}
// 받는 피해: 별빛 표식 (+20%) · 마계 장막 안의 원거리 (−50%) · [축복:테헤라] (× 0.9) · 요정의 축복 (× 0.85) · 날개 방패 (× 0.2) · ◆마계 대사 (같은 편 마법 × 1.1)
function supTake(W, u, t, dmg, o){
  if (t.star8 && W.t < t.star8.until && u.side === t.star8.side) dmg *= t.star8.k || 1.2;
  if (o && o.far && W.t < (t.veilT || -9)) dmg *= SPR(W, 'cveil').far || 0.5;
  if (W.t < (t.blessT || -9)) dmg *= (SUPR(W).bless || {}).dmg || 0.9;
  if (W.t < (t.fairyGT || -9)) dmg *= t.fairyGK || 0.85;
  if (t.act && t.act.k === 'twing') dmg *= SPR(W, 'twing').k || 0.2;
  if (o && o.wk === '마법' && W.envoy && W.envoy[u.side]) dmg *= (SUPR(W).envoy || {}).magic || 1.1;
  return dmg;
}
// 치유 틀의 덧붙임: 정령의 손길 (이어서 초당 2% · 4초) · 요정의 축복 (곁 5칸 동료 모두 25% · 4초 받는 피해 × 0.85)
function supKitHeal(W, u, t, K){
  if (K.hotB && t.alive) t.hotB8 = { k: K.hotB, until: W.t + (K.hotT || 4), by: u.i };
  if (K.aoe){ const got = [t];
    for (const a of W.units){ if (!a.alive || a.gone || a === t || a.side !== u.side || dist(a, u) > K.aoe) continue;
      const add = Math.max(0, Math.min(Math.round(a.max * K.pct), Math.round(a.max - a.hp))); if (add > 0){ a.hp += add; u.healed += add; if (W.fxOn) W.fx.push({ k: 'num', x: a.x, y: a.y, s: '+' + add, c: 'h', t0: W.t }); } got.push(a); }
    for (const a of got) if (a.alive){ a.fairyGT = W.t + (K.gT || 4); a.fairyGK = K.gK || 0.85; }
    L(W, { k: 'fairyBless', a: u.i, n: got.length, vis: supVis(W, u) }); }
}

/* ---- 매 순간 (판 전체): ◆정령 계약 · [축복:테헤라] · 정령의 손길 이어서 · 끌림 · 밀림 · 장판 · 문 · 방벽 · 장막 ---- */
function supInit(W){
  const P = SUPR(W).pact || {};
  for (const s of [0, 1, 2]){ if (!W.units.some(u => u.alive && u.mulKit && u.side === s)) continue;
    let n = 0; for (const a of W.units) if (a.alive && a.side === s && !a.summon && !a.pactUp){ const add = Math.round(a.max * (P.hp || 0.08)); a.max += add; a.hp = Math.min(a.max, a.hp + add); a.pactUp = add; n++; }
    L(W, { k: 'pact', side: s, n, vis: s === 0 }); }
}
function supWorld(W, dt){
  if (!W.sup8) return;
  const S = SUPR(W);
  if (!W.sup8Init){ W.sup8Init = true; supInit(W); }
  W.envoy = [0, 1, 2].map(s => W.units.some(u => u.alive && !u.gone && u.colKit && u.side === s));
  W.pact8 = [0, 1, 2].map(s => W.units.some(u => u.alive && !u.gone && u.mulKit && u.side === s));
  for (const m of W.units){ if (!m.alive || m.gone) continue;
    if (m.mulKit){ const P = S.pact || {}; for (const a of W.units) if (a.alive && !a.gone && !a.down && a.side === m.side && a.hp < a.max && dist(a, m) <= (P.r || 5)) a.hp = Math.min(a.max, a.hp + a.max * (P.regen || 0.006) * dt); }   // 3D h2.js 정령 계약
    if (m.tBless){ const B = S.bless || {}; for (const a of W.units) if (a.alive && !a.gone && a.side === m.side && dist(a, m) <= (B.r || 5)){ a.blessT = W.t + 0.25; if (!a.down && a.hp < a.max) a.hp = Math.min(a.max, a.hp + (B.regen || 1.5) * dt); } }   // 명세 B10 [축복:테헤라]
    if (m.hotB8 && W.t < m.hotB8.until && !m.down && m.hp < m.max) m.hp = Math.min(m.max, m.hp + m.max * m.hotB8.k * dt);
    const M = m.pull8 || m.push8; if (M){ const st = Math.min(M.left, M.v * dt); if (st > 1e-4 && !m.kb){ const x0 = m.x, y0 = m.y; tryMove(W, m, m.x + M.dx * st, m.y + M.dy * st); M.left -= st; if (Math.hypot(m.x - x0, m.y - y0) < st * 0.3) M.left = 0; } else M.left = 0; if (M.left <= 1e-3){ m.pull8 = null; m.push8 = null; } }
  }
  if (!W.sf8 || !W.sf8.length) return;
  for (const F of W.sf8){ if (W.t < F.until) sfStep(W, F, dt); else if (!F.ended){ F.ended = true; sfEnd(W, F); } }
  W.sf8 = W.sf8.filter(F => W.t < F.until);
}
function sfStep(W, F, dt){
  const by = W.units[F.by];
  if (F.k === 'desc' || F.k === 'dream'){ for (const a of W.units){ if (!a.alive || a.gone || Math.hypot(a.x - F.x, a.y - F.y) > F.r) continue;
      if (a.side === F.side){ if (F.k === 'desc') a.descT = W.t + 0.25; if (!a.down && a.hp < a.max) a.hp = Math.min(a.max, a.hp + a.max * F.heal * dt); }
      else if (F.k === 'desc'){ if (!a.fairyW) a.descSlowT = W.t + 0.25; } else a.dreamT = W.t + 0.25; } return; }
  if (F.k === 'veil'){ for (const a of W.units){ if (!a.alive || a.gone) continue; const inn = Math.hypot(a.x - F.x, a.y - F.y) <= F.r;
      if (a.side === F.side){ if (inn) a.veilT = W.t + 0.25; continue; }
      const was = !!F.in[a.i]; F.in[a.i] = inn ? 1 : 0;
      if (inn && !was && !F.hit[a.i] && !a.down){ F.hit[a.i] = 1; stun(W, a, F.stun || 0.5, F.by); L(W, { k: 'veilStun', a: F.by, b: a.i, vis: F.side === 0 || a.side === 0 || !!a.seenBy }); } } return; }
  if (F.k === 'gate'){ if (W.t < F.tick) return; F.tick += F.gap || 1; let n = 0, heavy = 0;
    for (const e of W.units){ if (!e.alive || e.gone || e.side === F.side || e.down || airOf(e) || e.jrFly || (e.act && e.act.k === 'tfly')) continue; const d = Math.hypot(e.x - F.x, e.y - F.y); if (d > F.r || d < 0.7) continue;
      if (isBoss(e) || e.giant || (SIZE_RANK[sizeOf(e)] || 0) >= (SIZE_RANK['대형'] || 3)){ heavy++; continue; }   // 보스 · 큰 몸은 끌려가지 않음
      e.pull8 = { dx: (F.x - e.x) / d, dy: (F.y - e.y) / d, left: Math.min(F.pull || 1.5, d - 0.6), v: 6 }; n++; }
    if (n || heavy) L(W, { k: 'gatePull', a: F.by, n, heavy, vis: F.side === 0 || W.units.some(e => e.pull8 && e.side === 0) }); return; }
  if (F.k === 'wall'){ for (const e of W.units){ if (!e.alive || e.gone || e.side === F.side || F.pushed[e.i] || e.down || airOf(e) || (e.act && e.act.k === 'tfly')) continue;
      const q = wallQ(F, e.x, e.y); if (q.d > e.r + 0.15) continue; F.pushed[e.i] = 1;
      interrupt(W, e, '방벽에 밀려 준비가 끊김'); e.push8 = { dx: F.nx * q.s, dy: F.ny * q.s, left: F.push || 2, v: 8 };
      L(W, { k: 'wallPush', a: F.by, b: e.i, vis: F.side === 0 || e.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y, s: '방벽에 밀려남', c: 'b', t0: W.t }); } return; }
}
function sfEnd(W, F){
  const by = W.units[F.by];
  if (F.k === 'gate' && by){ const x = specOf(by, 'cgate'); if (x) x.cdT = Math.max(x.cdT, F.cd0 || 0); L(W, { k: 'gateClose', a: F.by, tp: !!F.tpd, vis: F.side === 0 || !!by.seenBy }); }
}

/* ---- 기술 하나 (명령 · 스스로 같은 길): 준비 (예고 — 모양이 보임) → 끝나는 순간 ---- */
function supStart(W, u, k, t, why, px, py){
  const x = specOf(u, k); if (!x || !specReady(W, u, k)) return false;
  if (k === 'cgate' && t && t.side === u.side){ const G = sfOf(W, 'gate', u.i); if (!G || G.tpd) return false; startSpec(W, u, null, k, why); if (!u.act) return false; x.cdT = Math.max(W.t + 1, G.cd0 || 0); u.act.tp = t.i; u.act.px = G.x; u.act.py = G.y; u.act.ang = Math.atan2(G.y - u.y, G.x - u.x); u.fg = u.act.ang; return true; }
  if (k === 'cgate' && sfOf(W, 'gate', u.i)) return false;   // 문은 하나
  const foe = t && t.side !== u.side ? t : null, tx = px != null ? px : t ? t.x : u.x + Math.cos(u.face || 0), ty = py != null ? py : t ? t.y : u.y + Math.sin(u.face || 0);
  startSpec(W, u, foe, k, why); if (!u.act) return false;
  u.act.px = tx; u.act.py = ty; u.act.ang = Math.atan2(ty - u.y, tx - u.x); if (Math.hypot(tx - u.x, ty - u.y) > 0.05) u.fg = u.act.ang;
  if (k === 'mdesc'){ const S = SPR(W, k), R = S.rng || 9, d = Math.hypot(tx - u.x, ty - u.y); if (d > R){ u.act.px = u.x + (tx - u.x) / d * R; u.act.py = u.y + (ty - u.y) / d * R; } }
  return true;
}
function supResolve(W, u, A, S, t){
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + (S.rec || 0.4); A.t1 = W.t; u.atkT = W.t;
  const k = A.s, vis = supVis(W, u);
  if (k === 'mdesc'){ const F = sfAdd(W, { k: 'desc', by: u.i, side: u.side, x: A.px, y: A.py, r: S.r || 8, t0: W.t, until: W.t + (S.t || 6), heal: S.heal || 0.03 });
    L(W, { k: 'mdesc', a: u.i, n: W.units.filter(a => a.alive && a.side === u.side && Math.hypot(a.x - F.x, a.y - F.y) <= F.r).length, m: W.units.filter(e => e.alive && e.side !== u.side && Math.hypot(e.x - F.x, e.y - F.y) <= F.r).length, vis: true }); return; }
  if (k === 'mwall'){ const c = Math.cos(A.ang), s = Math.sin(A.ang); let d = S.ahead || 3; while (d > 1 && solid(W.map, u.x + c * d, u.y + s * d)) d -= 0.5;
    sfAdd(W, { k: 'wall', by: u.i, side: u.side, x: u.x + c * d, y: u.y + s * d, ux: -s, uy: c, nx: c, ny: s, h: (S.len || 4) / 2, push: S.push || 2, t0: W.t, until: W.t + (S.t || 4), pushed: {}, blkT: -9 });
    L(W, { k: 'mwall', a: u.i, vis: true }); return; }
  if (k === 'mspirit'){ spiritCall(W, u); return; }
  if (k === 'mvolley'){ if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    const wn = ((W.rules.weapons || {})[u.weapon] || {}).kind === '마법' ? u.weapon : '마법', o = { wn, mul: S.mul || 0.6, vel: S.vel || 22, rng: S.rng || 12, n: '물 정령 탄' };
    fire(W, u); supBolt(W, u, t, o); A.vol = { b: t.i, left: (S.n || 3) - 1, next: W.t + (S.gap || 0.2), gap: S.gap || 0.2, o }; A.end = Math.max(A.end, W.t + (S.gap || 0.2) * ((S.n || 3) - 1) + 0.05);
    L(W, { k: 'mvolley', a: u.i, b: t.i, n: S.n || 3, vis }); return; }
  if (k === 'cgate'){
    if (A.tp != null){ gateTp(W, u, sfOf(W, 'gate', u.i), W.units[A.tp]); return; }
    const c = Math.cos(A.ang), s = Math.sin(A.ang); let d = S.ahead || 4; while (d > 1 && solid(W.map, u.x + c * d, u.y + s * d)) d -= 0.5;
    const F = sfAdd(W, { k: 'gate', by: u.i, side: u.side, x: u.x + c * d, y: u.y + s * d, r: S.r || 4, t0: W.t, until: W.t + (S.t || 8), tick: W.t + (S.gap || 1), gap: S.gap || 1, pull: S.pull || 1.5, eat: S.eat || 0.9, tpd: false, blkT: -9, cd0: W.t + (S.cd || 12) });
    const x = specOf(u, 'cgate'); if (x) x.cdT = W.t + 1;   // 열려 있는 동안 다시 쓸 수 있음 (동료를 문 앞으로) — 대기 12초는 연 때부터 (닫힐 때 맞춤)
    L(W, { k: 'cgate', a: u.i, n: W.units.filter(e => e.alive && e.side !== u.side && Math.hypot(e.x - F.x, e.y - F.y) <= F.r).length, vis: true }); return; }
  if (k === 'cstar'){ if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    fire(W, u); supBolt(W, u, t, { wn: '마법', mul: S.mul || 1, vel: S.vel || 26, rng: S.rng || 15, star: 1, n: '별빛 지목' }); L(W, { k: 'cstar', a: u.i, b: t.i, vis }); return; }
  if (k === 'cveil'){ const F = sfAdd(W, { k: 'veil', by: u.i, side: u.side, x: u.x, y: u.y, r: S.r || 6, t0: W.t, until: W.t + (S.t || 5), stun: S.stun || 0.5, in: {}, hit: {} });
    for (const e of W.units) if (e.alive && e.side !== u.side && Math.hypot(e.x - F.x, e.y - F.y) <= F.r) F.in[e.i] = 1;   // 처음부터 안에 있던 적은 넘어 들어온 것이 아님
    L(W, { k: 'cveil', a: u.i, n: W.units.filter(a => a.alive && a.side === u.side && Math.hypot(a.x - F.x, a.y - F.y) <= F.r).length, vis: true }); return; }
  if (k === 'clure'){ const tt = lureTarget(W, u, A, S); if (!tt){ L(W, { k: 'miss', a: u.i, b: A.b, why: '앞 ' + (S.rng || 8) + '칸 ' + (S.arc || 60) + '° 안에 적이 없음', spec: k }); return; }
    const dem = isDemon(tt), dur = (dem ? S.demon || 3 : S.t || 2) * (isBoss(tt) ? S.boss || 0.5 : 1);
    interrupt(W, tt, '매혹되어 준비가 끊김'); tt.burst = null; tt.charm = { by: u.i, until: W.t + dur }; W.sup8 = true;
    L(W, { k: 'clure', a: u.i, b: tt.i, dur: +dur.toFixed(1), demon: dem, vis: vis || tt.side === 0 }); if (W.fxOn) W.fx.push({ k: 'num', x: tt.x, y: tt.y, s: '♥ 매혹', c: 'd', t0: W.t }); return; }
  if (k === 'tsweep'){ tsweepHit(W, u, A, S); return; }
  if (k === 'tflight'){ tflyStart(W, u, A, S); return; }
  if (k === 'twing'){ u.act = { k: 'twing', t0: W.t, end: W.t + (S.t || 2) }; L(W, { k: 'twing', a: u.i, vis }); return; }
  if (k === 'tdream'){ sfAdd(W, { k: 'dream', by: u.i, side: u.side, x: u.x, y: u.y, r: S.r || 6, t0: W.t, until: W.t + (S.t || 5), heal: S.heal || 0.01 }); u.act = { k: 'tdream', t0: W.t, end: W.t + (S.t || 5) };
    L(W, { k: 'tdream', a: u.i, m: W.units.filter(e => e.alive && e.side !== u.side && dist(e, u) <= (S.r || 6)).length, vis: true }); return; }
}
// 유혹의 손짓: 처음 겨눈 부채꼴 (앞 8칸 60°) 안의 적 하나 — 노린 적이 그대로 있으면 그 적, 아니면 가운데 줄에 가장 가까운 적
function lureTarget(W, u, A, S){
  const arc = (S.arc || 60) * Math.PI / 180, R = S.rng || 8;
  const inF = e => e.alive && !e.gone && e.side !== u.side && !e.down && !e.charm && dist(u, e) <= R + e.r * 0.6 && angDiff(Math.atan2(e.y - u.y, e.x - u.x), A.ang) <= arc / 2 + 0.08 && losClear(W.map, u.x, u.y, e.x, e.y);
  const t0 = A.b != null ? W.units[A.b] : null; if (t0 && inF(t0)) return t0;
  return W.units.filter(inF).sort((a, b) => angDiff(Math.atan2(a.y - u.y, a.x - u.x), A.ang) - angDiff(Math.atan2(b.y - u.y, b.x - u.x), A.ang))[0] || null;
}
// 차원 문 (다시 씀): 동료 하나를 문 앞 (문에서 콜라이더 쪽 1.2칸 · 빈 자리) 으로
function gateTp(W, u, G, a){
  const S = SPR(W, 'cgate');
  if (!G || !a || !a.alive || a.gone || G.tpd){ L(W, { k: 'miss', a: u.i, b: a ? a.i : null, why: '문이 닫힘', spec: 'cgate' }); return; }
  if (dist(a, G) > (S.tp || 15)){ L(W, { k: 'miss', a: u.i, b: a.i, why: '문에서 ' + (S.tp || 15) + '칸 밖', spec: 'cgate' }); return; }
  const ang = Math.atan2(u.y - G.y, u.x - G.x); let spot = null;
  for (const [k, da] of [[1.2, 0], [1.2, 0.6], [1.2, -0.6], [1.8, 0], [1.0, 1.2], [1.0, -1.2], [2.2, 0.4], [2.2, -0.4]]){ const x = G.x + Math.cos(ang + da) * k, y = G.y + Math.sin(ang + da) * k;
    if (!boxRock(W, x, y, a.r * 0.9) && !W.units.some(o => o.alive && o !== a && Math.hypot(o.x - x, o.y - y) < o.r + a.r * 0.9)){ spot = { x, y }; break; } }
  if (!spot){ L(W, { k: 'miss', a: u.i, b: a.i, why: '문 앞이 막힘', spec: 'cgate' }); return; }
  const fx = a.x, fy = a.y; a.x = spot.x; a.y = spot.y; stop(a); if (a.act && a.act.phase !== 'rec') a.act = null; a.burst = null; G.tpd = true;
  const x = specOf(u, 'cgate'); if (x) x.cdT = Math.max(x.cdT, G.cd0 || 0);
  L(W, { k: 'gateTp', a: u.i, b: a.i, d: +Math.hypot(spot.x - fx, spot.y - fy).toFixed(1), vis: true }); if (W.fxOn) W.fx.push({ k: 'ghost', a: a.i, x: fx, y: fy, t0: W.t });
}
// 땅의 정령: 작은 정령 하나 (20초) — 체력이 가장 낮은 동료를 따라다니며 3초마다 회복탄 (5%)
function spiritCall(W, u){
  const S = SPR(W, 'mspirit'), SP = SUPR(W).spirit || {}; let q = null;
  for (let k = 0; k < 8 && !q; k++){ const a = (u.face || 0) + Math.PI + k * 0.8, x = u.x + Math.cos(a) * (u.r + 0.45), y = u.y + Math.sin(a) * (u.r + 0.45); if (!boxRock(W, x, y, 0.2) && !W.units.some(o => o.alive && Math.hypot(o.x - x, o.y - y) < o.r + 0.2)) q = { x, y }; }
  if (!q) q = { x: u.x + 0.3, y: u.y + 0.3 };
  W.spSeq = (W.spSeq || 0) + 1;
  const p = { id: 'spirit-' + u.i + '-' + W.spSeq, name: '땅의 정령', tier: 1, cls: '치유', role: '지원', side: u.side, weapon: '맨손', height: 0.5, weight: 6, sizeCls: '소형', noChg: true, nv: true, nvG: 'B', ov: { hp: SP.hp || 40, atk: 1, spd: SP.spd || 3.2 }, traits: ['회피B'], active: [], gear: {}, x: q.x, y: q.y, spiritOf: u.i, summon: 'spirit' };
  const r = (typeof engineSpawn === 'function' ? engineSpawn : addUnit)(W, p); if (!r) return null;
  r.summon = 'spirit'; r.spiritOf = u.i; r.supKit = true; r.spiritUntil = W.t + (S.t || 20); r.spiritNext = W.t + 1; r.state = u.side ? 'hunt' : 'fight'; W.sup8 = true;
  L(W, { k: 'mspirit', a: u.i, b: r.i, vis: supVis(W, u) });
  return r;
}
function spiritAct(W, u, dt){
  const S = SPR(W, 'mspirit'), m = W.units[u.spiritOf];
  const mates = W.units.filter(a => a.alive && !a.gone && a.side === u.side && !a.summon);
  if (W.t >= u.spiritUntil || !mates.length || !W.units.some(e => e.alive && !e.gone && e.side !== u.side && !e.summon)){ u.alive = false; u.gone = 'left'; u.act = null; stop(u); L(W, { k: 'spiritGone', a: u.i, why: W.t >= u.spiritUntil ? '시간이 다함' : '싸움이 끝남', vis: supVis(W, u) }); return true; }
  const t = mates.filter(a => a.hp < a.max - 0.5).sort((a, b) => a.hp / a.max - b.hp / b.max)[0] || (m && m.alive && !m.gone ? m : mates[0]);
  u.spiritFol = t.i;
  if (dist(u, t) > t.r + u.r + 0.9) goTo(W, u, t.x, t.y, dt); else stop(u);
  if (W.t >= u.spiritNext && t.hp < t.max - 0.5 && dist(u, t) <= (S.rng || 6) && losClear(W.map, u.x, u.y, t.x, t.y)){ u.spiritNext = W.t + (S.gap || 3);
    const add = Math.max(0, Math.min(Math.round(t.max * (S.pct || 0.05)), Math.round(t.max - t.hp))); t.hp += add; u.healed += add; if (m) m.healed += add;
    L(W, { k: 'spiritHeal', a: u.i, b: t.i, amt: add, vis: supVis(W, u) }); if (W.fxOn){ W.fx.push({ k: 'shot', a: u.i, b: t.i, t0: W.t, dur: 0.25, heal: true }); W.fx.push({ k: 'num', x: t.x, y: t.y, s: '+' + add, c: 'h', t0: W.t }); } }
  setMood(W, u, t.hp < t.max - 0.5 ? t.name + ' 곁 — 회복탄' : t.name + ' 곁', t.i); return true;
}
// 광역 손짓 (명세 B10): 방사형 — 처음 겨눈 부채꼴 (8칸 90°) 안의 모두 (동료도) · 둔기 · 중대형까지 넘어짐 (막으면 밀리기만)
function tsweepHit(W, u, A, S){
  const R = S.rng || 8, arc = (S.arc || 90) * Math.PI / 180, kd = SIZE_RANK[S.kd || '중대형'] != null ? SIZE_RANK[S.kd || '중대형'] : 2;
  const hit = W.units.filter(e => e.alive && !e.gone && e !== u && !e.down && !airOf(e) && !(e.act && e.act.k === 'tfly') && Math.hypot(e.x - u.x, e.y - u.y) <= R + e.r * 0.6 && angDiff(Math.atan2(e.y - u.y, e.x - u.x), A.ang) <= arc / 2 + 0.12 && losClear(W.map, u.x, u.y, e.x, e.y));
  let down = 0, ff = 0;
  for (const e of hit){ const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.2, wk: '둔기', tag: '광역 손짓' }); if (e.side === u.side) ff++;
    if (!e.alive) continue;
    if (o && !o.block && (SIZE_RANK[sizeOf(e)] || 0) <= kd && !e.giant){ knockDown(W, e, S.down || 1.2, u.i, '광역 손짓에 쓸려 넘어짐'); down++; }
    else if (!e.kb) shove(W, u, e, S.kb || 0.8, e.x - u.x, e.y - u.y, { tag: '광역 손짓에 밀려남', noDown: true }); }
  L(W, { k: 'tsweep', a: u.i, hit: hit.map(e => e.i), down, ff, vis: true }); if (W.fxOn) W.fx.push({ k: 'tsweep', a: u.i, x: u.x, y: u.y, ang: A.ang, r: R, arc, t0: W.t });
}
// 은빛 비행: 찍은 쪽으로 8칸 날아감 (바위를 넘음 · 내려앉을 자리는 비어야) — 지나간 줄 (폭 1) 의 적 × 0.4 · 0.8초 둔화. 날아가는 동안은 끊기지 않음
function tflyStart(W, u, A, S){
  const len = Math.min(S.len || 8, Math.max(1.2, Math.hypot(A.px - u.x, A.py - u.y))), c = Math.cos(A.ang), s = Math.sin(A.ang), m = W.map; let tx = null, ty = null;
  for (let d = len; d >= 1; d -= 0.4){ const x = Math.max(0.6, Math.min(m.W - 0.6, u.x + c * d)), y = Math.max(0.6, Math.min(m.H - 0.6, u.y + s * d)); if (!boxRock(W, x, y, u.r * 0.9) && !W.units.some(o => o.alive && o !== u && Math.hypot(o.x - x, o.y - y) < o.r + u.r)){ tx = x; ty = y; break; } }
  if (tx == null){ L(W, { k: 'specFail', a: u.i, s: 'tflight', why: '내려앉을 자리가 없음', vis: supVis(W, u) }); u.act = null; return; }
  const d = Math.hypot(tx - u.x, ty - u.y), T = Math.max(0.2, d / (S.v || 16));
  u.act = { k: 'tfly', phase: 'fly', t0: W.t, end: W.t + T, fx: u.x, fy: u.y, tx, ty, hit: [] }; u.saT = Math.max(u.saT || -9, W.t + T); stop(u); u.fg = u.face = A.ang;
  L(W, { k: 'tflight', a: u.i, d: +d.toFixed(1), vis: supVis(W, u) });
}
function tflyStep(W, u, dt){
  const A = u.act, S = SPR(W, 'tflight'), q = Math.min(1, (W.t - A.t0) / Math.max(0.01, A.end - A.t0)), x0 = u.x, y0 = u.y;
  u.x = A.fx + (A.tx - A.fx) * q; u.y = A.fy + (A.ty - A.fy) * q; stop(u);
  for (const e of W.units){ if (!e.alive || e.gone || e.side === u.side || e.down || A.hit.includes(e.i)) continue;
    if (segNear(x0, y0, u.x, u.y, e.x, e.y, (S.w || 1) / 2 + e.r) == null) continue; A.hit.push(e.i);
    strike(W, u, e, e, 1, false, { mul: S.mul || 0.4, wk: '마법', tag: '은빛 비행' }); if (e.alive){ e.slow8 = { k: S.slow || 0.2, until: W.t + (S.slowT || 0.8) }; W.sup8 = true; } }
  if (q >= 1){ u.act = { k: 'spec', s: 'tflight', phase: 'rec', t0: W.t, end: W.t + (S.rec || 0.2) }; L(W, { k: 'tland', a: u.i, n: A.hit.length, vis: supVis(W, u) }); }
}
// 날개 방패 끝: 둘레 3칸 빛가루 — 적 1초 눈멂
function twingEnd(W, u){
  const S = SPR(W, 'twing'), E = W.units.filter(e => e.alive && !e.gone && e.side !== u.side && dist(u, e) <= (S.r || 3));
  for (const e of E) e.blindT8 = W.t + (S.blind || 1);
  u.act = null; L(W, { k: 'twingEnd', a: u.i, n: E.length, vis: supVis(W, u) || E.some(e => e.side === 0) }); if (W.fxOn) W.fx.push({ k: 'dust8', x: u.x, y: u.y, r: S.r || 3, t0: W.t });
}
// 갈퀴 꼬리 채찍 (콜라이더 기본 일격): 준비 0.3초 (겨눈 쪽은 처음에 정함) → 부채꼴 안의 적 모두 × 0.5 → 0.2초 뒤 검은 파편 × 0.5 + 0.5초 휘청
function cwhipStart(W, u, t, why){
  const S = SUPR(W).whip || {}, wind = (S.wind || 0.3) * fatMul(W, u, 'wind') * supAtkK(W, u);
  u.act = { k: 'cwhip', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, ang: Math.atan2(t.y - u.y, t.x - u.x), n: 0, why: why || '' };
  u.fg = u.act.ang; stop(u); u.waitT = 0; tire(W, u, 'swing'); setMood(W, u, why && why !== '공격' ? '갈퀴 꼬리 · ' + why : '갈퀴 꼬리', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, w: '갈퀴 꼬리', whip: true, end: +(W.t + wind).toFixed(2), why: why || '', hid: u.side === 1 && !u.seenBy });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind });
}
function cwhipResolve(W, u){
  const A = u.act, S = SUPR(W).whip || {};
  if (A.phase === 'rec'){ u.act = null; return; }
  const n = ++A.n, R = S.r || 3, arc = (S.arc || 100) * Math.PI / 180;
  const hit = W.units.filter(e => e.alive && !e.gone && e !== u && e.side !== u.side && !e.down && !airOf(e) && !(e.act && e.act.k === 'tfly') && Math.hypot(e.x - u.x, e.y - u.y) <= R + e.r * 0.6 && angDiff(Math.atan2(e.y - u.y, e.x - u.x), A.ang) <= arc / 2 + 0.15 && losClear(W.map, u.x, u.y, e.x, e.y));
  const got = [];
  for (const e of hit){ if (n === 1 && evadeMelee(W, e, u)) continue; const o = strike(W, u, e, e, 1, false, { mul: S.mul || 0.5, tag: n === 2 ? '갈퀴 꼬리 — 검은 파편' : '갈퀴 꼬리' }); got.push(e.i); if (n === 2 && e.alive && o && !o.block) stun(W, e, S.stun || 0.5, u.i); }
  if (n === 1 && !got.length && A.b != null) L(W, { k: 'miss', a: u.i, b: A.b, why: '꼬리가 닿지 않음 (부채꼴 밖)' });
  L(W, { k: 'cwhip', a: u.i, n, hit: got, vis: supVis(W, u) || got.some(i => W.units[i].side === 0) });
  if (W.fxOn) W.fx.push({ k: 'cwhip', a: u.i, x: u.x, y: u.y, ang: A.ang, r: R, arc, n, t0: W.t });
  u.atkT = W.t;
  if (n === 1){ A.phase = 'hit2'; A.end = W.t + (S.gap || 0.2); return; }
  A.phase = 'rec'; A.end = W.t + (S.rec || 0.6) * supAtkK(W, u); A.t1 = W.t;
}

/* ---- 몸마다 (동작): 매혹 · 앉아 졸음 · 날개 방패 · 땅의 정령 · 물 정령 탄 이어서 · 스스로 쓰는 서포터 기술 ---- */
function supAct(W, u, dt){
  if (u.spiritOf != null) return spiritAct(W, u, dt);
  if (u.charm){ const C = u.charm, by = W.units[C.by];
    if (W.t >= C.until || !by || !by.alive || by.gone){ u.charm = null; L(W, { k: 'charmEnd', a: u.i, vis: supVis(W, u) }); }
    else { u.act = null; u.burst = null;   // 공격을 멈추고 콜라이더 쪽으로 걸어옴
      if (gap(u, by) > 0.6) goTo(W, u, by.x, by.y, dt); else stop(u); u.fg = Math.atan2(by.y - u.y, by.x - u.x); setMood(W, u, '♥ 매혹 — ' + by.name + '에게 이끌림', by.i); return true; } }
  const A = u.act;
  if (A && A.k === 'tdream'){ stop(u); if (W.t >= A.end) u.act = null; return true; }   // 앉아 졸음 — 움직이지 못함 (장판은 따로 5초)
  if (A && A.k === 'twing'){ stop(u); if (W.t >= A.end) twingEnd(W, u); return true; }   // 날개로 몸을 감쌈 — 끝날 때 빛가루
  if (A && A.k === 'spec' && A.s === 'mvolley' && A.vol){ const V = A.vol; while (V.left > 0 && W.t >= V.next){ const t = W.units[V.b]; if (!t || !t.alive || !losClear(W.map, u.x, u.y, t.x, t.y)){ V.left = 0; break; } fire(W, u); supBolt(W, u, t, V.o); V.left--; V.next += V.gap; } return false; }
  if (!A && (!u.order || u.order.k === 'hold') && W.t >= (u.supT || 0) && (u.spec || []).some(x => SUP_K.includes(x.k))){ u.supT = W.t + 0.2; if (supAuto(W, u)) return true; }
  return false;
}
// 명령 (기술 칸): 제자리 기술은 바로 · 바닥 · 동료 · 적을 찍은 기술은 쓸 거리까지 다가감 (대기 중이면 기다림)
function supOrder(W, u, o, sp, dt){
  const k = o.s, S = SPR(W, k), wait = () => { stop(u); setMood(W, u, sp.name + ' 대기 (' + Math.max(0, sp.cdT - W.t).toFixed(1) + '초)'); };
  if (SUP_SELF.includes(k)){ if (specReady(W, u, k)){ supStart(W, u, k, null, '명령'); u.order = null; } else wait(); return true; }
  const t = o.b != null ? W.units[o.b] : null;
  if (k === 'cgate' && t && t.side === u.side && t !== u){ const G = sfOf(W, 'gate', u.i);
    if (G && !G.tpd){ if (dist(t, G) > (S.tp || 15)){ L(W, { k: 'specFail', a: u.i, s: k, why: '그 동료는 문에서 ' + (S.tp || 15) + '칸 밖', vis: true }); u.order = null; return true; } if (supStart(W, u, k, t, '명령')) u.order = null; else wait(); return true; } }
  if (SUP_FOE.includes(k) && !(t && t.alive && t.side !== u.side)){ u.order = null; return true; }
  if (t && !t.alive){ u.order = null; return true; }
  let px = o.x, py = o.y; if (px == null && t){ px = t.x; py = t.y; } if (px == null){ u.order = null; return true; }
  const d = t && t.side !== u.side ? dist(u, t) : Math.hypot(px - u.x, py - u.y), R = k === 'mdesc' ? (S.rng || 9) + (S.r || 8) * 0.5 : k === 'tflight' || k === 'mwall' || k === 'cgate' ? 99 : S.rng || 9;
  if (SUP_FOE.includes(k) && t){ const see = canSee(W, u, t); if (!see && !(u.side === 0 ? t.seenBy : false)){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return true; }
    if (d > R || !see || !losClear(W.map, u.x, u.y, t.x, t.y)){ setMood(W, u, sp.name + '하러', t.i); goTo(W, u, t.x, t.y, dt); return true; } }
  else if (d > R){ setMood(W, u, sp.name + ' 자리로', t ? t.i : null); goTo(W, u, px, py, dt); return true; }
  if (!specReady(W, u, k)){ wait(); return true; }
  if (supStart(W, u, k, t, '명령', SUP_FOE.includes(k) ? null : px, SUP_FOE.includes(k) ? null : py)) u.order = null; else { L(W, { k: 'specFail', a: u.i, s: k, why: k === 'cgate' ? '문은 하나 — 열린 문이 닫혀야' : '쓸 수 없음', vis: true }); u.order = null; }
  return true;
}
/* ---- 스스로 쓰기 (적 · 아군 같은 두뇌) — 설계의 기술 차례대로 첫 번째로 맞는 것 ---- */
const SUP_AUTO = {
  // 정령 강림: 싸우는 동료 (곁 3칸에 적) 둘 이상의 가운데 — 다친 동료가 있거나 적이 둘 넘게 들어올 때
  mdesc(W, u, S){ if (sfOf(W, 'desc', u.i)) return false; const R = S.r || 8, M = supMates(W, u, (S.rng || 9) + R).filter(a => !a.summon && !a.down), F = M.filter(a => supFoes(W, a, 3).some(e => supKnown(W, u, e)));
    if (!F.length) return false; let cx = F.reduce((s, a) => s + a.x, 0) / F.length, cy = F.reduce((s, a) => s + a.y, 0) / F.length; const d = Math.hypot(cx - u.x, cy - u.y); if (d > (S.rng || 9)){ cx = u.x + (cx - u.x) / d * (S.rng || 9); cy = u.y + (cy - u.y) / d * (S.rng || 9); }
    const inA = M.filter(a => Math.hypot(a.x - cx, a.y - cy) <= R), hurt = inA.filter(a => a.hp < a.max * 0.8).length, foes = supFoes(W, u).filter(e => Math.hypot(e.x - cx, e.y - cy) <= R).length;
    if (inA.length < 2 || (!hurt && foes < 2)) return false; return supStart(W, u, 'mdesc', null, '동료 ' + inA.length + ' · 적 ' + foes, cx, cy); },
  // 정령 방벽: 나 · 곁 동료를 노려 쏘려는 적 사수 쪽 · 아니면 다가오는 근접 적 (방벽에 닿으면 밀려남)
  mwall(W, u, S){ const sh = supFoes(W, u, 14).filter(e => isFar(e) && e.act && (e.act.k === 'atk' || e.act.k === 'throw') && e.act.phase === 'wind' && W.units[e.act.b] && W.units[e.act.b].side === u.side && dist(W.units[e.act.b], u) <= 2.5 && supKnown(W, u, e))[0];
    const ml = sh ? null : supFoes(W, u, 6).filter(e => !isFar(e) && dist(u, e) >= (S.ahead || 3) + 0.4 && supKnown(W, u, e) && ((e.vx || 0) * (u.x - e.x) + (e.vy || 0) * (u.y - e.y) > 0.3 || e.target === u))[0];
    const e = sh || ml; if (!e) return false; return supStart(W, u, 'mwall', null, sh ? sh.name + '의 사격을 막음' : ml.name + '을 밀어냄', e.x, e.y); },
  // 땅의 정령: 싸움 중 · 다친 동료 (75% 아래) · 내 정령이 없을 때
  mspirit(W, u, S){ if (W.units.some(s => s.alive && !s.gone && s.spiritOf === u.i)) return false; if (!supFoes(W, u, 12).some(e => supKnown(W, u, e))) return false; if (!supMates(W, u, 10).some(a => !a.summon && a.hp < a.max * 0.75)) return false; return supStart(W, u, 'mspirit', null, '다친 동료'); },
  // 물 정령 탄: 위급한 동료 (30% 아래 · 쓰러짐) 가 없을 때 — 보이는 적 (사선이 트인)
  mvolley(W, u, S){ if (supMates(W, u, 10).some(a => !a.summon && (a.down || a.hp < a.max * 0.3))) return false; const R = S.rng || 12;
    const L0 = (u.target && u.target.alive && u.target.side !== u.side ? [u.target] : []).concat(supFoes(W, u, R).sort((a, b) => dist(u, a) - dist(u, b)));
    const t = L0.find(e => canSee(W, u, e) && dist(u, e) <= R && losClear(W.map, u.x, u.y, e.x, e.y) && firstOnLine(W, u, e, u, knows(W, u)) === e); if (!t) return false; return supStart(W, u, 'mvolley', t, '물 정령 탄'); },
  // 차원 문: 열려 있으면 동료 (근접 · 체력 40% 넘음 · 문에서 4칸 넘게) 를 문 앞으로 · 닫혀 있으면 앞 4칸 둘레 (반지름 4) 에 적 둘 이상 (또는 사수) 이 있을 때
  cgate(W, u, S){ const G = sfOf(W, 'gate', u.i);
    if (G){ if (G.tpd || !W.units.some(e => e.alive && e.side !== u.side && Math.hypot(e.x - G.x, e.y - G.y) <= G.r)) return false;
      const a = supMates(W, u).filter(a => a !== u && !a.summon && !a.down && !isFar(a) && a.cls !== '치유' && a.hp > a.max * 0.4 && dist(a, G) > 4 && dist(a, G) <= (S.tp || 15) && !supFoes(W, a, 1.5).length && !(a.order && a.order.k !== 'hold')).sort((p, q) => dist(p, G) - dist(q, G))[0];
      if (!a) return false; return supStart(W, u, 'cgate', a, a.name + '을 문 앞으로'); }
    const tg = u.target && u.target.alive && u.target.side !== u.side && canSee(W, u, u.target) ? u.target : supFoes(W, u, 10).filter(e => canSee(W, u, e)).sort((a, b) => dist(u, a) - dist(u, b))[0]; if (!tg) return false;
    const a = Math.atan2(tg.y - u.y, tg.x - u.x), gx = u.x + Math.cos(a) * (S.ahead || 4), gy = u.y + Math.sin(a) * (S.ahead || 4), R = S.r || 4;
    const n = supFoes(W, u).filter(e => Math.hypot(e.x - gx, e.y - gy) <= R).length, sh = supFoes(W, u).filter(e => isFar(e) && Math.hypot(e.x - gx, e.y - gy) <= R + 2).length;
    if (n < 2 && !sh) return false; return supStart(W, u, 'cgate', null, '적 ' + n + (sh ? ' · 사수 ' + sh : ''), gx, gy); },
  // 별빛 지목: 보이는 적 (15칸) — 보스 > 동료가 많이 노리는 적 > 센 적 (표식이 남은 적은 빼고)
  cstar(W, u, S){ const L0 = supFoes(W, u, S.rng || 15).filter(e => canSee(W, u, e) && losClear(W.map, u.x, u.y, e.x, e.y) && !(e.star8 && W.t < e.star8.until - 1)); if (!L0.length) return false;
    const sc = e => (isBoss(e) ? 100 : 0) + W.units.filter(a => a.alive && a.side === u.side && a.target === e).length * 10 + (e.atk || 0) * 0.3 - dist(u, e);
    const t = L0.reduce((a, b) => sc(b) > sc(a) ? b : a); if (firstOnLine(W, u, t, u, knows(W, u)) !== t) return false; return supStart(W, u, 'cstar', t, '표식'); },
  // 마계 장막: 곁 6칸 동료 둘 이상이 사격을 받거나 · 적이 둘 넘게 다가올 때
  cveil(W, u, S){ const R = S.r || 6, M = supMates(W, u, R).filter(a => !a.summon && !a.down); if (M.length < 2) return false;
    const shot = supFoes(W, u, 15).filter(e => isFar(e) && supKnown(W, u, e) && ((e.act && e.act.phase === 'wind' && W.units[e.act.b] && W.units[e.act.b].side === u.side && dist(W.units[e.act.b], u) <= R))).length + (M.some(a => W.t - (a.farHitT == null ? -9 : a.farHitT) < 1.5) ? 1 : 0);
    const rush = supFoes(W, u, R + 3).filter(e => !isFar(e) && dist(u, e) > R && supKnown(W, u, e)).length;
    if (!shot && rush < 2) return false; return supStart(W, u, 'cveil', null, shot ? '사격 받는 동료 ' + M.length : '다가오는 적 ' + rush); },
  // 유혹의 손짓: 위급한 동료를 치려는 적 · 나를 치려는 근접 (앞 8칸)
  clure(W, u, S){ const C = supFoes(W, u, S.rng || 8).filter(e => !e.charm && canSee(W, u, e) && losClear(W.map, u.x, u.y, e.x, e.y));
    const sc = e => { const tg = e.act && e.act.phase === 'wind' && e.act.b != null ? W.units[e.act.b] : e.target; return (tg && tg.side === u.side && tg.hp < tg.max * 0.5 ? 50 : 0) + (tg === u && !isFar(e) ? 30 : 0) + (isBoss(e) ? 10 : 0) + (e.atk || 0) * 0.2; };
    const t = C.filter(e => sc(e) >= 30).sort((a, b) => sc(b) - sc(a))[0]; if (!t) return false; return supStart(W, u, 'clure', t, '유혹'); },
  // 광역 손짓: 부채꼴 (8칸 90°) 안에 적 둘 이상 — 같은 편이 들면 손해로 셈 (넘어질 몸 1.5 · 대형 이상 0.5) · 적 − 손해 ≥ 1 일 때만 (명령이면 그대로)   (v1.1: 전엔 동료가 하나라도 들면 안 씀 — 붙어 싸우는 동료 탓에 거의 못 씀)
  tsweep(W, u, S){ const R = S.rng || 8, arc = (S.arc || 90) * Math.PI / 180, kd = SIZE_RANK[S.kd || '중대형'] != null ? SIZE_RANK[S.kd || '중대형'] : 2, F = supFoes(W, u, R + 0.5).filter(e => supKnown(W, u, e)); if (F.length < 2) return false; let best = null;
    for (const e of F){ const a = Math.atan2(e.y - u.y, e.x - u.x), inn = x => x !== u && x.alive && !x.gone && !x.down && Math.hypot(x.x - u.x, x.y - u.y) <= R + x.r * 0.6 && angDiff(Math.atan2(x.y - u.y, x.x - u.x), a) <= arc / 2 + 0.12;
      const n = F.filter(inn).length, M = W.units.filter(x => x.side === u.side && !x.summon && inn(x)), cost = M.reduce((c, x) => c + ((SIZE_RANK[sizeOf(x)] || 0) <= kd && !x.giant ? 1.5 : 0.5), 0), sc = n - cost;
      if (n < 2 || sc < 1) continue; if (!best || sc > best.sc) best = { e, n, sc, m: M.length }; }
    if (!best) return false; return supStart(W, u, 'tsweep', best.e, '적 ' + best.n + (best.m ? ' · 동료 ' + best.m + ' 감수' : ' (동료 없음)')); },
  // 은빛 비행: 붙은 근접 적 (다쳤거나 둘 이상 · 나를 치려 함) — 반대쪽 · 동료 쪽으로
  tflight(W, u, S){ const th = supFoes(W, u, 3).filter(e => !isFar(e) && supKnown(W, u, e) && (gap(u, e) < 1.0 || (e.act && e.act.b === u.i && e.act.phase === 'wind')));
    if (!th.length || (u.hp > u.max * 0.75 && th.length < 2 && !th.some(e => e.act && e.act.b === u.i))) return false;
    let dx = th.reduce((s, e) => s + (u.x - e.x) / (dist(u, e) || 1), 0), dy = th.reduce((s, e) => s + (u.y - e.y) / (dist(u, e) || 1), 0); const M = supMates(W, u, 12).filter(a => a !== u && !a.summon && !a.down);
    if (M.length){ const cx = M.reduce((s, a) => s + a.x, 0) / M.length - u.x, cy = M.reduce((s, a) => s + a.y, 0) / M.length - u.y, l = Math.hypot(cx, cy) || 1; dx += cx / l * 0.6; dy += cy / l * 0.6; }
    const l = Math.hypot(dx, dy) || 1, len = S.len || 8; return supStart(W, u, 'tflight', null, '근접을 피해 날아감', u.x + dx / l * len, u.y + dy / l * len); },
  // 날개 방패: 나를 노린 치명적 일격 · 다친 채 붙은 적에게 맞으려 할 때 (날 수 있으면 날아감이 먼저)
  twing(W, u, S){ const pr = perilOn(W, u), atk = supFoes(W, u, 3).filter(e => e.act && e.act.b === u.i && e.act.phase === 'wind' && !isFar(e)).length;
    if (!pr && !(atk && u.hp < u.max * 0.5)) return false; if (specReady(W, u, 'tflight') && supFoes(W, u, 3).length) return false; return supStart(W, u, 'twing', null, pr ? pr.e.name + '의 일격' : '둘러싸임'); },
  // 나른한 꿈: 곁 6칸에 동료와 맞붙은 적 둘 이상 · 동료 둘 이상 · 나에게 붙은 적 없음
  tdream(W, u, S){ const R = S.r || 6; if (supFoes(W, u, 2.2).length) return false;
    const foes = supFoes(W, u, R).filter(e => supKnown(W, u, e) && W.units.some(a => a.side === u.side && a.alive && !a.summon && dist(a, e) <= 2)).length, mates = supMates(W, u, R).filter(a => !a.summon && !a.down).length;
    if (foes < 2 || mates < 2) return false; return supStart(W, u, 'tdream', null, '적 ' + foes + ' · 동료 ' + mates); }
};
function supAuto(W, u){
  if (u.lie || u.crawl || u.noArms || u.charm) return false;
  for (const x of u.spec || []){ if (!SUP_K.includes(x.k) || !specReady(W, u, x.k)) continue; const f = SUP_AUTO[x.k]; if (f && f(W, u, SPR(W, x.k))) return true; }
  return false;
}
"""
rep("if (typeof module !== 'undefined') module.exports = { cmdHold, apSup,", SUP + "\nif (typeof module !== 'undefined') module.exports = { SUP_K, startSkill, supBolt, supShotHit, supShotStop, wingsDodge, supTake, supKitHeal, supInit, supWorld, sfStep, sfEnd, supStart, supResolve, lureTarget, gateTp, spiritCall, spiritAct, tsweepHit, tflyStart, tflyStep, twingEnd, cwhipStart, cwhipResolve, supAct, supOrder, SUP_AUTO, supAuto, supSpd, supAtkK, isDemon, sfOf, cmdHold, apSup,")

# ---------- v1.1 치료 방침의 기본: 마력 치유는 '알아서' (3D 처럼 곁의 동료가 55% 아래면 — 아끼는 약이 아님) ----------
for a in ["(u.healPol || (R.heal || {}).pol || 'dying')", "(u.healPol || (W.rules.heal || {}).pol || 'dying')"]:
    n = sum(v.count(a) for v in P.values()); assert n == 3, (n, a)
    for k in P: P[k] = P[k].replace(a, 'healPolOf(W, u)')
rep("const SUP_K = ['mdesc',", "const healPolOf = (W, u) => u.healPol || (u.skill && u.skill.inf ? 'free' : ((W.rules.heal || {}).pol || 'dying'));   /* v8.7.8 치료 방침 (고른 것 · 없으면 마력 치유는 알아서 · 약은 위급할 때만) */\nconst SUP_K = ['mdesc',")
rep("module.exports = { SUP_K, startSkill,", "module.exports = { healPolOf, SUP_K, startSkill,")

for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch8780d OK')
