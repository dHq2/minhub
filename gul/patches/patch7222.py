# v7.22.2 엔진 — patch7222.py v1.5 (v1.5: [가호:바다] 는 얕은 물에서 오히려 빨라짐 (terrain.waterSea — 설정에 있던 효과) · v1.4: 무기를 주우러 뛴 도약 강타는 내려앉으며 바로 집어 듦 · v1.3: [보스] 출혈 · 내출혈도 vital.boss 로 셈 · v1.2: [보스] — 급소 일격은 최대 체력 대신 vital.boss 로 셈 · 급소 · 투구째 즉사 없음 · v1.1: 몸 크기 배수 rMul (설계) · 깔림은 몸 크기만큼 · 도약 강타 재사용 6초 · 셋 넘게 둘러싸이면 먼 상대 (사수 먼저) 에게 도약 강타로 빠져나감 · 무기를 주우러는 2칸 더 멀리 · 중간보스 대장군 호레이쇼의 기술 — 양쪽 같은 규칙: 도약 강타 (멀리 뛰어 내려앉으며 넓은 충격 · 바로 밑에 깔리면 중형까지 즉사 · 내려앉을 그림자를 본 쪽은 피함) · 회전 투척 (든 무기를 던져 직선으로 회전하며 베어 나감 · 끝에 떨어짐 → 맨손 · 주우러 도약) · 주변광 (밝은 맵) · 새 무기 대장군의 도끼)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  spec: { flip: {", "  spec: { quake: { d: 9, min: 3, time: 1.1, cd: 6, r: 2.4, under: 1, kill: '중형', mul: 2.2, kb: 1.6, down: 1.4, react: 0.3, flee: 0.85 }, spin: { rng: 9, v: 13, w: 0.55, wind: 0.75, rec: 0.5, cd: 11, mul: 1.8, kb: 0.6 },   /* v7.22.2 도약 강타 (d 칸까지 · time 초 날아감 · 내려앉은 r 칸 충격 · 몸 반지름 × under (+ 깔리는 몸 절반) 안에 깔린 kill 체급 이하는 즉사 · 그림자를 본 쪽은 react 쯤 flee 초 동안 피함) · 회전 투척 (rng 칸 · 초당 v 칸 · 폭 w) */\n    flip: {")
h = rep(h, "'대검':{rng:0.7, guard:true, two:true, kind:'날붙이'}", "'대검':{rng:0.7, guard:true, two:true, kind:'날붙이'}, '대장군의 도끼':{rng:1.0, guard:true, two:true, kind:'날붙이'}")
h = rep(h, "  vital: { head: 0.4,", "  vital: { boss: 400, head: 0.4,")   # v7.22.2 [보스]: 급소 일격은 최대 체력 대신 boss 로 셈
h = rep(h, "tripT: 0.8, water: 0.7 },", "tripT: 0.8, water: 0.7, waterSea: 1.15 },")   # v7.22.2 [가호:바다] 는 물속에서 × waterSea
wr('rt3_head.js', h)

m = rd('rt3_mid.js')
m = rep(m, "function computeLight(W){\n  const m = W.map, Lm = W.light; Lm.fill(0);", "function computeLight(W){\n  const m = W.map, Lm = W.light; Lm.fill(W.amb || 0);   // v7.22.2 주변광 (밝은 맵)")
wr('rt3_mid.js', m)

s = rd('rt3_tail.js')
s = rep(s, "  setup.units.forEach((p, i) => unitInit(W, p, i));", "  W.amb = Math.max(0, Math.min(1, +setup.amb || 0));   // v7.22.2 주변광 (밝은 맵 — 대장군의 무대 · 알현실)\n  setup.units.forEach((p, i) => unitInit(W, p, i));")
s = rep(s, "r: bodyR(p.tier) * ((p.traits || []).includes('거구') ? 1.3 : 1) * (hh < 1.55 ? Math.max(0.8, hh / 1.6) : 1),", "r: bodyR(p.tier) * ((p.traits || []).includes('거구') ? 1.3 : 1) * (hh < 1.55 ? Math.max(0.8, hh / 1.6) : 1) * (+p.rMul > 0 ? +p.rMul : 1),")   # v7.22.2 몸 크기 배수 (설계 rMul — 키 5M 대장군)
s = rep(s, "        o.headLost = true; dmg = Math.max(dmg, Math.round(t.max * (V.headLoss != null ? V.headLoss : 0.2)));", "        o.headLost = true; dmg = Math.max(dmg, Math.round(vMax * (V.headLoss != null ? V.headLoss : 0.2)));")
s = rep(s, "        dmg = Math.max(dmg, Math.round(t.max * (meleeV ? (V.melee != null ? V.melee : 0.35) : vp === '머리' ? (V.head != null ? V.head : 0.4) : (V.heart != null ? V.heart : 0.3))));\n        const kp = vp === '머리' && rangedV ?", "        dmg = Math.max(dmg, Math.round(vMax * (meleeV ? (V.melee != null ? V.melee : 0.35) : vp === '머리' ? (V.head != null ? V.head : 0.4) : (V.heart != null ? V.heart : 0.3))));\n        const kp = boss ? 0 : vp === '머리' && rangedV ?")
s = rep(s, "      o.vital = vp;\n      if (vp === '머리' && (t.heads || 1) > 1){", "      o.vital = vp; const boss = (t.traits || []).includes('보스'), vMax = boss ? Math.min(t.max, V.boss != null ? V.boss : 400) : t.max;   // v7.22.2 [보스]\n      if (vp === '머리' && (t.heads || 1) > 1){")
s = rep(s, "  if (pen && part === '머리' && pw.kind !== '총포류' && (u.strMul || 1) >= (PC.str || 1.3) && W.rand()", "  if (pen && part === '머리' && pw.kind !== '총포류' && !(t.traits || []).includes('보스') && (u.strMul || 1) >= (PC.str || 1.3) && W.rand()")   # v7.22.2 [보스] 는 투구째 즉사 없음
s = rep(s, "  t.bleed = { dps: (b ? b.dps : 0) + t.max * (M.bleed != null ? M.bleed : 0.02) * (mul || 1), until: W.t + (M.bleedT || 10), by };", "  t.bleed = { dps: (b ? b.dps : 0) + bossRef(W, t) * (M.bleed != null ? M.bleed : 0.02) * (mul || 1), until: W.t + (M.bleedT || 10), by };   // v7.22.2 [보스] 는 vital.boss 기준")
s = rep(s, "function ibleed(W, t, a, mul){ const R = WR(W), b = t.ibleed; t.ibleed = { dps: (b ? b.dps : 0) + t.max * (R.ibleed || 0.01) * (mul || 1),", "function ibleed(W, t, a, mul){ const R = WR(W), b = t.ibleed; t.ibleed = { dps: (b ? b.dps : 0) + bossRef(W, t) * (R.ibleed || 0.01) * (mul || 1),")
s = rep(s, "function stepBleed(W, u, dt){", "// v7.22.2 [보스]: 최대 체력에 비례하는 몫 (급소 · 출혈 · 내출혈) 은 vital.boss 를 넘지 않는 기준으로 셈\nconst bossRef = (W, t) => (t.traits || []).includes('보스') ? Math.min(t.max, ((W.rules.vital || {}).boss) || 400) : t.max;\nfunction stepBleed(W, u, dt){")
s = rep(s, "* (W.map.water && wetAt(W.map, u.x, u.y) ? (TER(W).water != null ? TER(W).water : 0.7) : 1);   // v7.22 얕은 물", "* (W.map.water && wetAt(W.map, u.x, u.y) ? ((u.traits || []).includes('가호:바다') ? (TER(W).waterSea || 1.15) : (TER(W).water != null ? TER(W).water : 0.7)) : 1);   // v7.22 얕은 물 (v7.22.2 [가호:바다] 는 빨라짐)")
s = rep(s, "const SPEC_K = { '공중제비': 'flip',", "const SPEC_K = { '도약 강타': 'quake', '회전 투척': 'spin', '공중제비': 'flip',")
s = rep(s, "if ((k === 'sweep' || k === 'hurl') && u.weaponGone) return false;", "if ((k === 'sweep' || k === 'hurl' || k === 'spin') && u.weaponGone) return false;")
# 날아가는 동안: 도약 강타는 몸으로 막히지 않음 (위로 넘어감) · 그림자를 본 쪽이 피함 · 내려앉으면 충격
s = rep(s, "  tryMove(W, u, A.fx + (A.tx - A.fx) * q, A.fy + (A.ty - A.fy) * q);\n  if (A.k === 'leap' && !A.shot",
    "  if (A.air){ u.x = A.fx + (A.tx - A.fx) * q; u.y = A.fy + (A.ty - A.fy) * q; } else tryMove(W, u, A.fx + (A.tx - A.fx) * q, A.fy + (A.ty - A.fy) * q);   // v7.22.2 도약 강타는 머리 위로 넘어감\n  if (A.quake && !A.warned && q >= (SPR(W, 'quake').react || 0.3)){ A.warned = true; quakeWarn(W, u, A); }\n  if (A.k === 'leap' && !A.shot")
s = rep(s, "  if (q >= 1){ if (A.slam) slamHit(W, u, A); u.act = null; }   // v7.19.1 공중제비 내려찍기",
    "  if (q >= 1){ if (A.slam) slamHit(W, u, A); u.act = null; if (A.quake){ quakeHit(W, u, A); const it = A.grab != null ? W.items.find(i => i.id === A.grab) : null; if (it && u.alive && Math.hypot(it.x - u.x, it.y - u.y) <= u.r + 0.8 && canTake(W, u, it)) takeItem(W, u, it); } }   // v7.19.1 공중제비 내려찍기   // v7.22.2 도약 강타 (무기를 주우러 뛰었으면 내려앉으며 집어 듦)")
# 피함: 내려앉을 자리에서 달아남 (뜀)
s = rep(s, "  if (invAuto(W, u)) return;   // v7.20 소지품: 탄이 다 떨어졌거나 무기를 잃으면 가방에서 꺼냄",
    "  if (invAuto(W, u)) return;   // v7.20 소지품: 탄이 다 떨어졌거나 무기를 잃으면 가방에서 꺼냄\n  if (u.flee){ if (W.t < u.flee.until && !u.lie){ goTo(W, u, u.flee.x, u.flee.y, dt); setMood(W, u, '내려앉을 자리에서 피함'); return; } u.flee = null; }   // v7.22.2 도약 강타의 그림자")
s = rep(s, "((u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack')) || (u.mv && u.mv.run && W.t < u.mv.until) ||",
    "((u.order && u.order.hurry && (u.order.k === 'move' || u.order.k === 'amove' || u.order.k === 'attack')) || (u.mv && u.mv.run && W.t < u.mv.until) || (u.flee && W.t < u.flee.until) ||")
s = rep(s, "  for (const u of W.units) if (u.alive && u.kb) stepKb(W, u, dt);   // v5.2 밀려나 날아가는 몸", "  if (W.spins && W.spins.length) stepSpins(W, dt);   // v7.22.2 회전 투척\n  for (const u of W.units) if (u.alive && u.kb) stepKb(W, u, dt);   // v5.2 밀려나 날아가는 몸")
# 회전 투척: 예고가 끝나면 던짐 (든 무기를 놓음 → 맨손)
s = rep(s, "  if (k === 'hurl'){   // 휘둘러 치기:", r"""  if (k === 'spin'){   // v7.22.2 회전 투척: 든 무기를 상대 쪽으로 던짐 — 직선으로 회전하며 베어 나감 (닿는 모두 · 동료도) · 끝에 떨어짐 · 던진 쪽은 맨손
    if (u.weaponGone || !u.weapon || ITEM_NATURAL.includes(u.weapon)){ L(W, { k: 'miss', a: u.i, why: '던질 무기가 없음', spec: k }); return; }
    const tx = t && t.alive ? t.x : u.x + Math.cos(u.face || 0), ty = t && t.alive ? t.y : u.y + Math.sin(u.face || 0), d = Math.hypot(tx - u.x, ty - u.y) || 1, dx = (tx - u.x) / d, dy = (ty - u.y) / d, H = heldItem(u);
    (W.spins || (W.spins = [])).push({ by: u.i, side: u.side, x: u.x + dx * (u.r + 0.2), y: u.y + dy * (u.r + 0.2), dx, dy, v: S.v || 13, left: S.rng || 9, w: S.w || 0.55, mul: S.mul || 1.8, kb: S.kb || 0.6, hit: [], it: { ...H, label: H.label || lootName(u, 'weapon', H.name) }, t0: W.t });
    u.weaponGone = true; u.weaponNow = '맨손'; u.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng; u.longReach = false; u.parry = false; if (!u.shield && !u.reflex) u.canGuard = false;
    L(W, { k: 'spin', a: u.i, b: t ? t.i : null, w: H.label || H.name, vis: true }); return;
  }
  if (k === 'hurl'){   // 휘둘러 치기:""")
# 스스로 쓰기
s = rep(s, "  if (specReady(W, u, 'flip')){ const F = SPR(W, 'flip');", r"""  if (specReady(W, u, 'quake')){ const Q = SPR(W, 'quake'), mn = Q.min || 3, mx = Q.d || 9;   // v7.22.2 도약 강타: 무기를 잃었으면 그 자리로 · 아니면 먼 상대 (무리면 한가운데) 에게
    if (u.weaponGone){ const it = (W.items || []).find(i => i.k === 'weapon' && i.own === ownKey(u)), di = it ? Math.hypot(it.x - u.x, it.y - u.y) : 0; if (it && di >= mn && di <= mx + 2 && startQuake(W, u, it.x, it.y, '무기를 주우러 도약')){ u.act.grab = it.id; return true; } }   // 무기를 주우러는 2칸 더
    if (W.units.filter(e => e.alive && e.side !== u.side && gap(u, e) <= 1.2).length >= 3){ const far = W.units.filter(e => e.alive && e.side !== u.side && canSee(W, u, e)).map(e => ({ e, d: dist(u, e) })).filter(o => o.d >= mn && o.d <= mx).sort((a, b) => (isFar(b.e) - isFar(a.e)) || (b.d - a.d))[0];   // 셋 넘게 둘러싸이면 먼 상대 (사수 먼저) 에게 박차고 나감
      if (far && startQuake(W, u, far.e.x, far.e.y, '둘러싼 무리를 박차고 먼 상대에게')) return true; }
    if (g >= mn && g <= mx){ const grp = W.units.filter(e => e.alive && e.side !== u.side && dist(e, t) <= 2.2 && canSee(W, u, e)), cx = grp.reduce((a, e) => a + e.x, 0) / (grp.length || 1), cy = grp.reduce((a, e) => a + e.y, 0) / (grp.length || 1), lead = 0.5;
      const px = grp.length >= 2 ? cx : t.x + (t.vx || 0) * lead, py = grp.length >= 2 ? cy : t.y + (t.vy || 0) * lead;
      if (Math.hypot(px - u.x, py - u.y) <= mx && startQuake(W, u, px, py, grp.length >= 2 ? '무리 한가운데로 도약 강타' : '먼 상대에게 도약 강타')) return true; } }
  if (specReady(W, u, 'spin') && !u.weaponGone){ const P2 = SPR(W, 'spin'), R2 = P2.rng || 9;   // v7.22.2 회전 투척: 줄지은 상대 (둘 넘게) · 또는 도약 강타를 못 쓸 때 먼 상대 — 동료가 길에 있으면 안 함
    if (g > u.rng + 1 && g <= R2 - 1){ const d0 = dist(u, t) || 1, ex = u.x + (t.x - u.x) / d0 * R2, ey = u.y + (t.y - u.y) / d0 * R2, on = W.units.filter(e => e.alive && e !== u && segD(u, ex, ey, e) < (P2.w || 0.55) + e.r);
      const nf = on.filter(e => e.side !== u.side).length, na = on.filter(e => e.side === u.side).length;
      if (!na && (nf >= 2 || (nf >= 1 && !specReady(W, u, 'quake')))) return startSpec(W, u, t, 'spin', nf >= 2 ? '줄지은 상대에게 도끼를 던짐' : '먼 상대에게 도끼를 던짐'); } }
  if (specReady(W, u, 'flip')){ const F = SPR(W, 'flip');""")
s = rep(s, "function startSpec(W, u, t, k, why){", r"""// v7.22.2 도약 강타: (tx, ty) 로 time 초 날아감 (몸 위로 넘어감) — 내려앉을 그림자는 누구나 봄
function startQuake(W, u, tx, ty, why){
  const Q = SPR(W, 'quake'), x = specOf(u, 'quake'); if (!x) return false; const m = W.map, pad = u.r + 0.2;
  tx = Math.max(pad, Math.min(m.W - pad, tx)); ty = Math.max(pad, Math.min(m.H - pad, ty));
  for (let k = 0; k < 6 && boxRock(W, tx, ty, u.r * 0.9); k++){ tx = u.x + (tx - u.x) * 0.8; ty = u.y + (ty - u.y) * 0.8; }
  const len = Math.hypot(tx - u.x, ty - u.y); if (len < 1 || boxRock(W, tx, ty, u.r * 0.9)) return false;
  u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (Q.time || 1.1), fx: u.x, fy: u.y, tx, ty, dir: 'fwd', quake: true, air: true, r: Q.r || 2.4 };
  x.cdT = W.t + (Q.cd || 9); stop(u); u.fg = u.face = Math.atan2(ty - u.y, tx - u.x);
  L(W, { k: 'quake', a: u.i, x: +tx.toFixed(2), y: +ty.toFixed(2), len: +len.toFixed(1), why: why || '', vis: u.side === 0 || !!u.seenBy || litAt(W, tx, ty) }); setMood(W, u, why || '도약 강타');
  return true;
}
// 그림자를 본 쪽 (뛰는 몸이 보이거나 · 내려앉을 자리가 밝고 보이는 거리) 은 충격 밖으로 달아남 — 하던 예고는 끊음
function quakeWarn(W, u, A){
  const R = A.r || 2.4, Q = SPR(W, 'quake');
  for (const e of W.units){ if (!e.alive || e === u || e.down || e.kb || W.t < (e.proneT || -9)) continue; const d = Math.hypot(e.x - A.tx, e.y - A.ty); if (d > R + e.r + 0.3) continue;
    if (!(canSee(W, e, u) || (litAt(W, A.tx, A.ty) && d <= W.rules.sight))) continue;
    const a = d > 0.05 ? Math.atan2(e.y - A.ty, e.x - A.tx) : W.rand() * 6.283, D = R + e.r + 0.5, fx = Math.max(0.6, Math.min(W.map.W - 0.6, A.tx + Math.cos(a) * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, A.ty + Math.sin(a) * D));
    if (e.act && e.act.phase === 'wind' && e.act.k !== 'charge') e.act = null;
    if (!e.act){ e.flee = { x: fx, y: fy, until: W.t + (Q.flee || 0.85) }; L(W, { k: 'quakeFlee', a: e.i, b: u.i, vis: e.side === 0 || !!e.seenBy }); } }
}
// 내려앉음: 바로 밑 (몸 반지름 × under + 깔리는 몸 절반) 의 kill 체급 이하는 깔려 즉사 · r 칸 안은 가까울수록 센 충격 (둔기 · 막을 수 있음) · 날아감 · 넘어짐 — 동료도 맞음
function quakeHit(W, u, A){
  const Q = SPR(W, 'quake'), R = A.r || Q.r || 2.4, kr = SIZE_RANK[Q.kill || '중형'] != null ? SIZE_RANK[Q.kill || '중형'] : 1; let n = 0, kills = 0;
  for (const e of W.units){ if (!e.alive || e === u) continue; const d = Math.hypot(e.x - u.x, e.y - u.y); if (d > R + e.r) continue; n++;
    const ax = d > 0.05 ? (e.x - u.x) / d : Math.cos(W.rand() * 6.283), ay = d > 0.05 ? (e.y - u.y) / d : Math.sin(W.rand() * 6.283);
    if (d < u.r * (Q.under || 1) + e.r * 0.5 && (SIZE_RANK[sizeOf(e)] != null ? SIZE_RANK[sizeOf(e)] : 1) <= kr){ applyDmg(W, u, e, Math.ceil(e.hp) + 999, { tag: '깔림', death: 'crush', ff: e.side === u.side }); kills++; continue; }
    const f = 1 - Math.min(1, Math.max(0, d - e.r) / R) * 0.6, o = strike(W, u, e, e, 1, false, { mul: (Q.mul || 2.2) * f, tag: '도약 강타 충격', wk: '둔기' });
    if (e.alive && !e.kb) shove(W, u, e, (Q.kb || 1.6) * f * (o && o.block ? 0.6 : 1), ax, ay, { tag: '충격에 날아감' });
    if (e.alive && !e.kb && e.mass <= u.mass * 0.8 && W.rand() < 0.6 * f) knockDown(W, e, Q.down || 1.4, u.i, '도약 강타'); }
  L(W, { k: 'quakeHit', a: u.i, n, kills, x: +u.x.toFixed(2), y: +u.y.toFixed(2), vis: true }); W.lightT = 0;
  if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '쿵!', c: 'd', t0: W.t });
}
// 회전 투척이 날아감: 길에 닿는 모두를 한 번씩 (동료도 · 던진 이는 빼고) · 바위에 막히거나 rng 칸을 가면 그 자리에 떨어짐 (주인은 그대로 — 주우러 옴)
function stepSpins(W, dt){
  for (const S of W.spins){ if (S.done) continue; let mv = S.v * dt;
    while (mv > 1e-6 && !S.done){ const st = Math.min(0.25, mv, S.left); mv -= st; const nx = S.x + S.dx * st, ny = S.y + S.dy * st;
      if (rock(W.map, nx, ny) || nx < 0.3 || ny < 0.3 || nx > W.map.W - 0.3 || ny > W.map.H - 0.3){ S.done = true; break; }
      S.x = nx; S.y = ny; S.left -= st; if (S.left <= 1e-6) S.done = true;
      const by = W.units[S.by];
      for (const e of W.units){ if (!e.alive || e.i === S.by || S.hit.includes(e.i) || Math.hypot(e.x - S.x, e.y - S.y) > S.w + e.r) continue; S.hit.push(e.i);
        const o = strike(W, by, e, e, 1, true, { mul: S.mul, tag: '회전하는 도끼', wk: '날붙이' });
        if (e.alive && !e.kb && !(o && o.block)) shove(W, by, e, S.kb, S.dx, S.dy, { tag: '도끼에 쓸려 나감' }); } }
    if (S.done){ const p = freeSpot(W, S.x, S.y, 0.15) || { x: S.x, y: S.y }, it = { id: (W.itemN = (W.itemN || 0) + 1), ...S.it, k: 'weapon', x: +p.x.toFixed(2), y: +p.y.toFixed(2), owner: S.by, t: W.t, how: 'spin' };
      W.items.push(it); L(W, { k: 'spinDrop', a: S.by, n: S.hit.length, name: it.name, label: it.label, x: it.x, y: it.y, vis: true }); } }
  W.spins = W.spins.filter(S => !S.done);
}
function startSpec(W, u, t, k, why){""")
s = rep(s, "module.exports = { resolveDrink,", "module.exports = { startQuake, quakeHit, quakeWarn, stepSpins, resolveDrink,")
wr('rt3_tail.js', s)
print('patch7222 OK')
