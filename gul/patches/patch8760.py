# v8.7.6 엔진 — patch8760.py v1.3 (v1.3: 전리품 — 맵 위에서 챙겨 땅에서 사라진 것도 '챙긴 것' 으로 남김 (여정 기록 · 챙긴 줄) · v1.2: 갑피보다 단단한 장비는 판을 넘어가도 갑피 위 (벗거나 망가지면 갑피로 — 예전엔 다음 판에 벗으면 머리가 비었음) · 갑피 위에 입으면 갑피 아래 덮여 있던 장비는 가방으로 (정산에서 사라지지 않게) · 갑피 위의 장비가 망가지면 갑피가 드러남 · v1.1: 방패를 벗으면 u.sOff — 정산이 명단의 방패를 내려 둠 (가방에 들어간 방패와 겹치지 않게) · 시험용 orderTxt · v1.0: 인벤토리 v2 엔진 — 싸우는 중 장비 명령 하나 (inv: 입기 · 벗기 · 건네기 · 내려놓기 — 지휘망으로 · 걸리는 시간 · 휘청이면 끊김) · 두 손 무기는 무기 칸 둘 (카리우스 한 손 넷 · 두 손 둘 — J10) · 갑옷 무게만큼 걸음 다시 셈 (예전 equip 은 쓰이지 않았고 spd0 이 없어 NaN) · 전리품 (D1 · J11): 쓰러진 동료의 것도 · 진짜 시체만 (달아남 · 나감 · 항복은 빼고) · 줍거나 쓰러지면 다시 셈 (예전엔 처음 한 번만) · 갑옷 굴림은 한 번만 (다시 세도 그대로) · 항목마다 출처 열쇠 lk)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8750.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 수치표: 장비 갈아입기 시간 · 건네기 · 내려놓기 ----------
rep('swap: 0.8, swapSh: 0.5, ammoT: 1.2,',
    'swap: 0.8, swapSh: 0.5, ammoT: 1.2, gearT: { helm: 1.5, armor: 4 }, giveR: 1.2, giveT: 0.6, dropT: 0.3,')
rep('무기 4개 · 머리는 일반인', '무기 칸 4 — 한 손 무기 하나 = 1 · 두 손 무기 = 2 (한 손 넷 · 두 손 둘 · v8.7.6) · 머리는 일반인')

# ---------- J10 두 손 무기는 무기 칸 둘 ----------
rep("const bagWpnN = u => (u.bag || []).filter(x => x.k === 'weapon').length + (u.weapon && !ITEM_NATURAL.includes(u.weapon) && !u.weaponGone ? 1 : 0);",
    "const wTwo = (W, name) => (((W && W.rules.weapons) || {})[name] || {}).two ? 2 : 1;   /* v8.7.6 J10 두 손 무기 (대검 · 대장군의 도끼) 는 무기 칸 둘 */\n"
    "const bagWpnN = (u, W) => (u.bag || []).filter(x => x.k === 'weapon').reduce((s, x) => s + wTwo(W, x.name), 0) + (u.weapon && !ITEM_NATURAL.includes(u.weapon) && !u.weaponGone ? wTwo(W, u.weapon) : 0);")
rep("(it.k === 'weapon' && u.eqRule && u.eqRule.wmax && bagWpnN(u) >= u.eqRule.wmax)",
    "(it.k === 'weapon' && u.eqRule && u.eqRule.wmax && bagWpnN(u, W) + wTwo(W, it.name) > u.eqRule.wmax)")

# ---------- D2 싸우는 중 장비: inv 명령 ----------
INV_JS = r'''/* ---------- v8.7.6 싸우는 중 장비 (D2 · I24) — 가방의 갑옷 · 투구 입기 · 벗기 (방패도) · 건네기 · 내려놓기 ----------
   명령 { k: 'inv', op: 'wear' | 'off' | 'give' | 'drop', uid (가방 물건), slot ('몸' · '머리' · 'shield'), to (받을 동료) } — 지휘망으로 감 (늦게 · 못 들음).
   입고 벗는 동안 (투구 gearT.helm · 갑옷 gearT.armor · 방패 swapSh 초) 은 아무것도 못 하고, 휘청이면 끊김 (아무것도 바뀌지 않음). 건네기는 giveR 칸 안으로 다가가 giveT 초.
   싸우는 중에 땅에 내려놓는 건 무기 · 방패만 (D1 — 갑옷 · 투구는 가방에 둠). 무기 칸은 두 손 무기가 둘 (J10). */
const pOfU = u => ({ name: u.name, eq: u.eqRule || null, headSize: u.headSize || null, sizeCls: sizeOf(u), traits: u.traits || [], weapon: u.weaponGone ? '맨손' : u.weapon, shield: !!(u.shield && !u.armShield) });
const gSlotOf = it => it && it.k === 'armor' ? '몸' : it && it.k === 'helm' ? '머리' : null;
const bagRoomU = (W, u, it) => { if ((u.bag || []).length >= bagCapOf(W, u)) return '가방이 가득 (' + (u.bag || []).length + '/' + bagCapOf(W, u) + ')'; if (it && it.k === 'weapon' && u.eqRule && u.eqRule.wmax && bagWpnN(u, W) + wTwo(W, it.name) > u.eqRule.wmax) return '무기 칸이 참 (' + bagWpnN(u, W) + '/' + u.eqRule.wmax + ' — 두 손 무기는 둘)'; return ''; };
function wearWhyU(W, u, it){
  const sl = gSlotOf(it); if (!sl) return '입을 것이 아님';
  const g0 = (u.gear || {})[sl]; if (g0 && g0.innate && (+it.tier || 1) <= g0.tier) return '갑피 (' + g0.tier + '성) 가 더 단단함 — 입어도 소용없음';
  return wearWhy(W.rules, pOfU(u), it);
}
// 갑옷 · 투구를 바꿔 낌: 무게만큼 걸음을 다시 셈 (다른 배율 — 붉은암석 2페이즈 등 — 은 그대로)
function gearSet(W, u, slot, g){
  const bs = { size: sizeOf(u), ref: ownKey(u) }, w0 = gearW(u.gear, W.rules, bs); u.gear = u.gear || {};
  if (g) u.gear[slot] = g; else delete u.gear[slot];
  const w1 = gearW(u.gear, W.rules, bs); u.spd = +(u.spd * Math.max(0.05, 1 - w1) / Math.max(0.05, 1 - w0)).toFixed(3);
}
const gearItem = (g, sl, W) => ({ k: sl === '몸' ? 'armor' : 'helm', name: g.name, label: g.label || g.name, mat: g.mat, tier: g.tier, dur: g.dur != null ? +g.dur : 100, size: g.size || null, own: g.own || null, uid: (W.bagN = (W.bagN || 10000) + 1) });
function invOp(W, u, o, dt){
  const I = INV(W), T = I.gearT || {}, it = o.uid != null ? (u.bag || []).find(x => x.uid === o.uid) : null, nm = x => x.label || x.name || '';
  const miss = why => { u.order = null; L(W, { k: 'miss', a: u.i, why, inv: o.op, vis: u.side === 0 || !!u.seenBy }); };
  const free = () => { if (u.act && u.act.phase === 'wind' && u.act.k !== 'charge') u.act = null; return !u.act; };
  if (o.op === 'give'){ const r = W.units[o.to];
    if (!it) return miss('가방에 없음'); if (!r || !r.alive || r.gone || r.side !== u.side || r === u) return miss('건넬 동료가 없음');
    const why = bagRoomU(W, r, it); if (why) return miss(r.name + ': ' + why);
    if (gap(u, r) > (I.giveR || 1.2)){ setMood(W, u, r.name + '에게 건네러', r.i); setGoal(W, u, r.x, r.y); follow(W, u, dt); return; }
    u.order = null; if (!free()) return miss('하던 동작이 있음');
    u.act = { k: 'invAct', op: 'give', phase: 'wind', t0: W.t, end: W.t + (I.giveT || 0.6), it, b: r.i }; stop(u); u.fg = Math.atan2(r.y - u.y, r.x - u.x); setMood(W, u, nm(it) + ' 건넴', r.i); return; }
  u.order = null; if (!free()) return miss('하던 동작이 있음');
  if (o.op === 'wear'){ if (!it) return miss('가방에 없음'); const why = wearWhyU(W, u, it); if (why) return miss(nm(it) + ' — ' + why); const sl = gSlotOf(it);
    u.act = { k: 'invAct', op: 'wear', phase: 'wind', t0: W.t, end: W.t + (sl === '머리' ? T.helm || 1.5 : T.armor || 4), it, slot: sl }; stop(u); setMood(W, u, nm(it) + ' 입는 중'); return; }
  if (o.op === 'off'){ const sl = o.slot;
    if (sl === 'shield'){ if (!u.shield || u.armShield) return miss(u.armShield ? '팔 방패는 몸' : '벗을 방패가 없음'); }
    else { const g = (u.gear || {})[sl]; if (!g || g.innate) return miss(g && g.innate ? '갑피는 몸 — 벗을 수 없음' : '입은 것이 없음'); }
    if ((u.bag || []).length >= bagCapOf(W, u)) return miss('가방이 가득 — 벗어 둘 자리가 없음');
    u.act = { k: 'invAct', op: 'off', phase: 'wind', t0: W.t, end: W.t + (sl === 'shield' ? I.swapSh || 0.5 : sl === '머리' ? T.helm || 1.5 : T.armor || 4), slot: sl }; stop(u); setMood(W, u, (sl === 'shield' ? '방패' : sl === '머리' ? '투구' : '갑옷') + ' 벗는 중'); return; }
  if (o.op === 'drop'){ if (!it) return miss('가방에 없음'); if (it.k !== 'weapon' && it.k !== 'shield') return miss('싸우는 중엔 무기 · 방패만 내려놓음 (나머지는 가방에)');
    u.act = { k: 'invAct', op: 'drop', phase: 'wind', t0: W.t, end: W.t + (I.dropT || 0.3), it }; stop(u); setMood(W, u, nm(it) + ' 내려놓음'); return; }
  miss('알 수 없는 장비 명령');
}
function resolveInv(W, u){
  const A = u.act, it = A.it, vis = u.side === 0 || !!u.seenBy; u.act = null; if (!u.alive || !u.bag) return;
  if (A.op === 'give'){ const r = W.units[A.b]; if (!r || !r.alive || r.gone || !u.bag.includes(it) || gap(u, r) > (INV(W).giveR || 1.2) + 0.8) return;
    const why = bagRoomU(W, r, it); if (why){ L(W, { k: 'miss', a: u.i, why: r.name + ': ' + why, inv: 'give', vis }); return; }
    u.bag.splice(u.bag.indexOf(it), 1); (r.bag = r.bag || []).push({ ...it, uid: (W.bagN = (W.bagN || 10000) + 1) }); L(W, { k: 'give', a: u.i, b: r.i, w: it.label || it.name || '', item: it.k, vis }); return; }
  if (A.op === 'drop'){ if (!u.bag.includes(it)) return; u.bag.splice(u.bag.indexOf(it), 1); const { uid, ...o } = it; dropItem(W, u, it.k, it.name, o, 'put'); return; }
  if (A.op === 'wear'){ if (!u.bag.includes(it)) return; const why = wearWhyU(W, u, it); if (why){ L(W, { k: 'miss', a: u.i, why: (it.label || it.name) + ' — ' + why, inv: 'wear', vis }); return; }
    const sl = A.slot, cur = (u.gear || {})[sl]; u.bag.splice(u.bag.indexOf(it), 1);
    if (cur && !cur.innate) u.bag.push(gearItem(cur, sl, W));
    gearSet(W, u, sl, { name: it.label || it.name || it.mat, mat: it.mat, tier: Math.max(1, Math.min(5, Math.round(+it.tier || 1))), dur: it.dur != null ? +it.dur : 100, size: it.size || null, own: it.own || null, ...(cur && cur.innate ? { over: cur } : cur && cur.over ? { over: cur.over } : {}) });   // 갑피 위에 입으면 벗을 때 갑피로 돌아감
    L(W, { k: 'gearOn', a: u.i, slot: sl, w: it.label || it.name, tier: u.gear[sl].tier, from: cur && !cur.innate ? cur.name : null, spd: u.spd, vis }); return; }
  if (A.op === 'off'){ const sl = A.slot; if ((u.bag || []).length >= bagCapOf(W, u)) return;
    if (sl === 'shield'){ if (!u.shield || u.armShield) return; const wp = (W.rules.weapons || {})[u.weapon] || {};
      u.bag.push({ k: 'shield', name: '방패', label: u.sName || '', dur: u.sDur != null ? +u.sDur : 100, own: u.sOwn || ownKey(u), uid: (W.bagN = (W.bagN || 10000) + 1) });
      const nm0 = u.sName || '방패'; u.shield = false; u.sOff = true; u.canBash = false; u.raised = false; if (u.canCharge && u.chargeName === '방패 돌진') u.chargeName = '돌진';
      u.parry = !u.weaponGone && !wp.guard && parryArcW(W.rules, u.weapon) > 0; u.canGuard = (!u.weaponGone && !!wp.guard) || !!u.reflex || u.parry; evoRole(W, u);
      L(W, { k: 'gearOff', a: u.i, slot: 'shield', w: nm0, vis }); return; }
    const g = (u.gear || {})[sl]; if (!g || g.innate) return; u.bag.push(gearItem(g, sl, W)); gearSet(W, u, sl, g.over || null); L(W, { k: 'gearOff', a: u.i, slot: sl, w: g.name, spd: u.spd, vis }); }
}
'''
rep("// 근접 무기가 닳음 · 막힐 때 아주 낮은 확률로 부러짐", INV_JS + "// 근접 무기가 닳음 · 막힐 때 아주 낮은 확률로 부러짐")
rep("  if (o.k === 'swap'){ invOrder(W, u, o); return; }",
    "  if (o.k === 'swap'){ invOrder(W, u, o); return; }\n  if (o.k === 'inv'){ invOp(W, u, o, dt); return; }   /* v8.7.6 싸우는 중 장비 (입기 · 벗기 · 건네기 · 내려놓기) */")
rep("  if (u.act.k === 'bagSwap'){ resolveSwap(W, u); return; }   // v7.20",
    "  if (u.act.k === 'bagSwap'){ resolveSwap(W, u); return; }   // v7.20\n  if (u.act.k === 'invAct'){ resolveInv(W, u); return; }   /* v8.7.6 */")
rep("  if (a && (a.phase === 'wind' || a.phase === 'run') && a.k !== 'reload'){",
    "  if (a && a.k === 'invAct' && a.phase === 'wind') L(W, { k: 'invBreak', a: u.i, op: a.op, slot: a.slot || null, w: a.it ? a.it.label || a.it.name : null, why, vis: u.side === 0 || !!u.seenBy });   /* v8.7.6 입던 · 건네던 것이 끊김 */\n"
    "  if (a && (a.phase === 'wind' || a.phase === 'run') && a.k !== 'reload'){")
rep("o && o.k === 'swap' ? ['swap', o.uid] :",
    "o && o.k === 'swap' ? ['swap', o.uid] : o && o.k === 'inv' ? ['inv', o.op, o.uid != null ? o.uid : null, o.slot || null, o.to != null ? o.to : null] :")

# 쓰이지 않던 equip (spd0 이 없어 NaN) 도 같은 셈으로
rep("""function equip(W, u, slot, item){
  u.gear = u.gear || {};
  const A = W.rules.armor || {};
  if (item && slot === '몸' && u.eqRule && u.eqRule.body === false) return;   // v7.20 카리우스: 몸 갑옷 못 입음
  if (item && A[item.mat]) u.gear[slot] = { name: item.name || item.mat, mat: item.mat, tier: Math.max(1, Math.min(5, Math.round(+item.tier || 1))), dur: item.dur != null ? +item.dur : 100, size: item.size || null, own: item.own || null }; else delete u.gear[slot];
  u.spd = +(u.spd0 * (1 - gearW(u.gear, W.rules, { size: sizeOf(u), ref: ownKey(u) }))).toFixed(2);""",
"""function equip(W, u, slot, item){   /* v8.7.6 걸음은 gearSet 처럼 바뀐 무게만큼 (예전엔 없는 spd0 을 써서 NaN) */
  const A = W.rules.armor || {};
  if (item && slot === '몸' && u.eqRule && u.eqRule.body === false) return;   // v7.20 카리우스: 몸 갑옷 못 입음
  gearSet(W, u, slot, item && A[item.mat] ? { name: item.name || item.mat, mat: item.mat, tier: Math.max(1, Math.min(5, Math.round(+item.tier || 1))), dur: item.dur != null ? +item.dur : 100, size: item.size || null, own: item.own || null } : null);""")

# ---------- D1 · J11 전리품: 쓰러진 동료의 것 · 진짜 시체만 · 다시 셈 · 출처 열쇠 ----------
LOOT_JS = r'''function lootOf(W){   /* v8.7.6 줍거나 쓰러지면 다시 셈 (예전엔 처음 한 번만 — 주운 것이 남아 보이던 것) · 출처 열쇠 lk 로 챙긴 표시 · 남은 탄을 이어 받음 · 갑옷 굴림은 한 번 */
  const dead = W.units.filter(u => !u.alive && !u.gone && !u.summon), sig = (W.items || []).filter(it => it.k === 'weapon' || it.k === 'shield').map(it => it.id).join(',') + '|' + dead.map(u => u.i).join(',');
  if (W.loot && W.lootSig === sig) return W.loot;
  const prev = new Map((W.loot || []).map(x => [x.lk, x])), roll = W.lootRoll || (W.lootRoll = {});
  const out = [], mine = new Set(W.units.filter(u => u.side === 0 && (u.alive || u.gone)).map(ownKey));   // 살아 있거나 맵을 나간 동료의 제 것은 그 동료에게 (정산에서 돌아감) — 쓰러진 동료의 것은 전리품
  const put = (lk, o) => { const p = prev.get(lk); out.push({ ...o, lk, ...(p && p.taken ? { taken: p.taken } : {}), ...(p && p.auto ? { auto: p.auto } : {}), ...(p && p.n0 != null ? { n0: p.n0 } : {}), ...(p && o.k === 'ammo' && p.n != null ? { n: p.n } : {}) }); };   // 챙긴 표시 · 나눠 담고 남은 탄은 이어 받음
  for (const it of W.items || []){ if (it.k !== 'weapon' && it.k !== 'shield') continue; if (it.own && mine.has(it.own)) continue;
    const at = it.k === 'weapon' ? ammoTOf(W, it.name) : null, dw = W.units.find(u => !u.alive && !u.gone && u.side === 0 && ownKey(u) === it.own);
    if (at && it.ammo > 0) put('ga' + it.id, { k: 'ammo', at, n: it.ammo, label: (it.label || it.name) + '에 남은 ' + (at === '화살' ? '화살' : at + ' 탄') });
    put('g' + it.id, { k: it.k, name: it.name, label: it.label || '', dur: it.dur != null ? +it.dur : 100, own: it.own || null, ground: it.id, ...(dw ? { fall: dw.name } : {}), ...(at ? { ammo: 0 } : {}) }); }
  const LR = W.rules.loot || {}, wr = LR.worn || [15, 60];
  for (const u of dead){ const ally = u.side === 0, nm = String(u.name || '').replace(/\s*\d+$/, ''), sz = sizeOf(u), fall = ally ? { fall: nm } : {};   // 쓰러진 동료의 것: 가방 · 두 번째 총 · 갑옷 · 투구 모두 (굴림 없이 · 낡은 그대로)
    for (const x of u.bag || []){ const { uid, ...o } = x; if (x.k === 'weapon' || x.k === 'shield') put('b' + u.i + ':' + uid, { ...o, label: o.label || (x.k === 'weapon' ? nm + '의 ' + o.name : nm + '의 방패'), dur: o.dur != null ? +o.dur : 100, own: o.own || ownKey(u), ...fall });   /* v7.25.2 무구는 모두: 가방의 무기 · 방패 */
      else if (ally && x.k !== 'ammo') put('b' + u.i + ':' + uid, { ...o, ...fall });
      else if (ally && x.k === 'ammo' && x.n > 0) put('b' + u.i + ':' + uid, { k: 'ammo', at: x.at, n: x.n, label: nm + '의 가방에 남은 ' + (x.at === '화살' ? '화살' : x.at + ' 탄'), ...fall }); }
    if (u.alt && u.alt.name){ const at = ammoTOf(W, u.alt.name); if (at && u.alt.ammo > 0) put('aa' + u.i, { k: 'ammo', at, n: u.alt.ammo, label: nm + '의 ' + u.alt.name + '에 남은 ' + at + ' 탄' }); put('alt' + u.i, { k: 'weapon', name: u.alt.name, label: nm + '의 ' + u.alt.name, dur: 100, own: ownKey(u), ...fall, ...(at ? { ammo: 0 } : {}) }); }   /* 두 번째 총 */
    for (const sl of GEAR_SLOTS){ const g0 = (u.gear || {})[sl], g = g0 && g0.innate ? g0.under : g0 && g0.over ? g0 : g0; if (!g || g.innate || (g.dur != null && g.dur <= 0)) continue;   /* v7.23.3 갑피 아래의 장비도 */
      const uq = ally || / ?의 /.test(g.name || '') || (u.traits || []).includes('보스'), rk = 'a' + u.i + sl;   /* v7.25.2 이름 붙은 고유 장비 · [보스] 의 것 · v8.7.6 쓰러진 동료의 것은 늘 */
      if (roll[rk] == null) roll[rk] = W.rand();
      if (!uq && roll[rk] >= (sl === '몸' ? (LR.armorP != null ? LR.armorP : 0.25) : (LR.helmP != null ? LR.helmP : 0.3))) continue;   /* v7.25.2 방어구는 낮은 확률 (망가지고 벗기기 힘듦) — 굴림은 한 번 */
      const d0 = g.dur != null ? +g.dur : 100, dw = uq ? d0 : Math.min(d0, Math.round(wr[0] + roll[rk] * 1000 % 1 * (wr[1] - wr[0])));
      put(rk, { k: sl === '몸' ? 'armor' : 'helm', name: g.name, label: / ?의 /.test(g.name || '') ? g.name : nm + '의 ' + (sl === '몸' ? '갑옷' : g.mat === '두건' ? '두건' : '투구'), mat: g.mat, tier: g.tier, dur: dw, ...(uq ? {} : { worn: true }), size: g.size || sz, own: g.own || ownKey(u), ...fall }); } }
  { const have = new Set(out.map(o => o.lk)); for (const [lk, x] of prev) if (x.taken && !have.has(lk)) out.push(x); }   // 맵 위에서 챙겨 땅에서 사라진 것도 '챙긴 것' 으로 남김 (여정 기록 · 챙긴 줄)
  W.lootSig = sig; return (W.loot = out);
}'''
import re
src = P['tail']; a = src.index('function lootOf(W){'); b = src.index('\n}\n', a) + 2
old_loot = src[a:b]
assert old_loot.count('return (W.loot = out);') == 1, 'lootOf shape'
P['tail'] = src[:a] + LOOT_JS + '\n' + src[b:]

# ---------- 시험용 내보내기 ----------
# v1.2 갑피 위의 장비 — 판을 넘어가도 · 망가져도 갑피로
rep("""    if (A['투구'] && (!out['머리'] || out['머리'].tier < tg)) out['머리'] = { name: '갑피', mat: '투구', tier: tg, innate: true, ...(out['머리'] ? { under: out['머리'] } : {}) };   /* v7.23.3 덮인 장비는 under 로 남음 (쓰러지면 전리품) */""",
"""    if (A['투구'] && (!out['머리'] || out['머리'].tier < tg)) out['머리'] = { name: '갑피', mat: '투구', tier: tg, innate: true, ...(out['머리'] ? { under: out['머리'] } : {}) };   /* v7.23.3 덮인 장비는 under 로 남음 (쓰러지면 전리품) */
    for (const [sl, mt] of [['몸', '판금'], ['머리', '투구']]) if (A[mt] && out[sl] && !out[sl].innate) out[sl].over = { name: '갑피', mat: mt, tier: tg, innate: true };   /* v8.7.6 갑피보다 단단한 장비는 갑피 위에 — 벗거나 망가지면 갑피로 */""")
rep("""    if (cur && !cur.innate) u.bag.push(gearItem(cur, sl, W));
    gearSet(W, u, sl, { name: it.label || it.name || it.mat, mat: it.mat, tier: Math.max(1, Math.min(5, Math.round(+it.tier || 1))), dur: it.dur != null ? +it.dur : 100, size: it.size || null, own: it.own || null, ...(cur && cur.innate ? { over: cur } : cur && cur.over ? { over: cur.over } : {}) });   // 갑피 위에 입으면 벗을 때 갑피로 돌아감
    L(W, { k: 'gearOn', a: u.i, slot: sl, w: it.label || it.name, tier: u.gear[sl].tier, from: cur && !cur.innate ? cur.name : null, spd: u.spd, vis }); return; }""",
"""    if (cur && !cur.innate) u.bag.push(gearItem(cur, sl, W));
    let inn = cur && cur.innate ? cur : cur && cur.over ? cur.over : null, und = null; if (inn && inn.under && u.bag.length < bagCapOf(W, u)){ und = inn.under; u.bag.push(gearItem(und, sl, W)); inn = { ...inn }; delete inn.under; }   // 갑피 아래 덮여 있던 장비는 가방으로 (한 칸엔 하나 — 정산에서 사라지지 않게)
    gearSet(W, u, sl, { name: it.label || it.name || it.mat, mat: it.mat, tier: Math.max(1, Math.min(5, Math.round(+it.tier || 1))), dur: it.dur != null ? +it.dur : 100, size: it.size || null, own: it.own || null, ...(inn ? { over: inn } : {}) });   // 갑피 위에 입으면 벗을 때 갑피로 돌아감
    L(W, { k: 'gearOn', a: u.i, slot: sl, w: it.label || it.name, tier: u.gear[sl].tier, from: cur && !cur.innate ? cur.name : und ? und.name : null, spd: u.spd, vis }); return; }""")
rep("""    if (it.dur <= 0) L(W, { k: 'aBreak', a: t.i, name: it.name, slot: it.mat === '투구' ? '머리' : '몸', vis: t.side === 0 || !!t.seenBy }); }""",
"""    if (it.dur <= 0){ const sl = GEAR_SLOTS.find(k => t.gear && t.gear[k] === it) || (it.mat === '투구' ? '머리' : '몸'); L(W, { k: 'aBreak', a: t.i, name: it.name, slot: sl, ...(it.over ? { bare: true } : {}), vis: t.side === 0 || !!t.seenBy }); if (it.over && t.gear && t.gear[sl] === it) gearSet(W, t, sl, it.over); } }   /* v8.7.6 갑피 위의 장비가 망가지면 갑피가 드러남 */""")
rep("lungeChk, stepOK, mvAim, strafeWant, running, ancOf, chiefOf,", "lungeChk, stepOK, mvAim, strafeWant, running, ancOf, chiefOf, invOp, resolveInv, bagRoomU, wearWhyU, gearSet, wTwo, bagWpnN, pOfU, lootOf, orderTxt,")

for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8760 OK')
