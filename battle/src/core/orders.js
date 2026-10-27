/* 명령: 엔진에 명령을 넣는 얇은 층 — 원본 화면(page10)의 give* · noteOrders 를 화면 의존 없이 옮긴 것.
 *
 *  - 명령은 `u.order = {k, ...}` 로 만든 뒤 noteOrders 로 "지휘관을 거쳐 닿게" 한다 (거리 · 소음 · 확률 · 동료 중계는 엔진 cmdWave 가 정한다).
 *    싸움 전 (0초) 명령 · 지휘관 자신은 바로 걸린다.
 *  - 모든 함수는 {ok, msg} 를 돌려준다 (화면이 안내 문구로 씀). 던진 명령은 B.cmdLog 에 남는다 (판 기록 · 재현용).
 *  - 원본 대응: noteOrders=페이지 noteOrders · move=groupMove · attack=giveAttack · charge=giveCharge(Pt) · throwAt=giveThrow ·
 *    pick=givePick · line=giveLine · posture=postureKey(sendPosture) · mate/chief=relKey(cgJoin/chiefSet) */
GB.Orders = (function () {
  const rock = (B, x, y) => E.rock(B.W.map, x, y);
  const alive = (B, ids) => ids.map(i => B.W.units[i]).filter(u => u && u.alive && u.side === 0 && !u.gone && !u.summon);
  const log = (B, k, units, extra) => { B.cmdLog.push(Object.assign({ t: +B.W.t.toFixed(2), k: k, ids: units.map(u => u.i) }, extra || {})); };

  // 지휘관을 거쳐 닿게 (원본 noteOrders). raw=true 면 바로.
  function noteOrders(B, list, raw) {
    const W = B.W, C = E.cmdBoss(W, 0), pre = W.t <= 1e-6;
    const wv = raw || pre ? null : E.cmdWave(W, C, list);
    const lks = list.map((u, k) => wv ? wv[k] : { p: 1, t: 0, via: 'self' });
    list.forEach((u, k) => {
      const lk = lks[k];
      if (raw) { if (!u.lretId || (u.order && u.order.k === 'lret')) E.preempt(W, u); u.ordPend = null; u.ordQ = null; u.ordT0 = W.t; u.ordLive = u.order; return; }
      if (lk.via === 'self') { E.preempt(W, u); u.ordLive = u.order; u.ordPend = null; u.ordQ = null; u.ordT0 = W.t; if (!u.order) E.lieFree(W, u); return; }
      const nu = u.order; u.order = u.ordLive !== undefined ? u.ordLive : null;
      E.ordPush(W, u, { o: nu, m2: lk.m2, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: lk.c, m: lk.m, t0: W.t, legs: !!(lk.legs && lk.ok) });
      if (C) E.ordFxAdd(W, u, lk, C.i, false);
    });
    return lks;
  }

  // 우회: 아는 적이 적은 쪽으로 크게 돌아가는 경유점 (원본 applyDetour)
  function applyDetour(B, L, tx, ty) {
    const M = L.filter(u => u.order && ['move', 'amove', 'attack', 'palm', 'charge'].includes(u.order.k));
    if (!M.length) return false;
    const v = E.detourVia(B.W, M, tx, ty);
    if (!v) return false;
    const cx = M.reduce((a, u) => a + u.x, 0) / M.length, cy = M.reduce((a, u) => a + u.y, 0) / M.length;
    const fast = M.some(u => u.order.hurry || u.order.now);
    for (const u of M) {
      let ox = u.x - cx, oy = u.y - cy; const d = Math.hypot(ox, oy); if (d > 1.2) { ox *= 1.2 / d; oy *= 1.2 / d; }
      let x = v.x + ox, y = v.y + oy; if (rock(B, x, y)) { x = v.x; y = v.y; }
      u.order.via = { x: +x.toFixed(2), y: +y.toFixed(2) }; if (fast) u.order.hurry = true;
    }
    return true;
  }

  // 여럿 이동: 고른 무리의 가운데를 누른 칸에 맞추고, 각자 원래 자리 차이(1.6칸까지)를 유지 (원본 groupMove)
  function move(B, ids, wx, wy, opt) {
    opt = opt || {};
    const L = alive(B, ids), kind = opt.kind || 'move', W = B.W, map = W.map;
    if (!L.length) return { ok: false, msg: '먼저 명령할 아군을 고르세요' };
    if (rock(B, wx, wy)) return { ok: false, msg: '바위 칸으로는 못 가요' };
    const tx = Math.floor(wx) + 0.5, ty = Math.floor(wy) + 0.5;
    const hurry = !!opt.hurry;
    if (L.length === 1) {
      L[0].order = { k: kind, x: tx, y: ty, ...(hurry ? { hurry: true } : {}) };
    } else {
      const cx = L.reduce((a, u) => a + u.x, 0) / L.length, cy = L.reduce((a, u) => a + u.y, 0) / L.length, taken = new Set();
      for (const u of [...L].sort((a, b) => Math.hypot(a.x - tx, a.y - ty) - Math.hypot(b.x - tx, b.y - ty))) {
        let dx = u.x - cx, dy = u.y - cy; const d = Math.hypot(dx, dy); if (d > 1.6) { dx *= 1.6 / d; dy *= 1.6 / d; }
        let gx = Math.min(map.W - 1, Math.max(0, Math.floor(tx + dx))), gy = Math.min(map.H - 1, Math.max(0, Math.floor(ty + dy)));
        if (rock(B, gx, gy) || taken.has(gx + ',' + gy)) {
          let best = null, bd = 1e9;
          for (let y = Math.max(0, gy - 4); y <= Math.min(map.H - 1, gy + 4); y++) for (let x = Math.max(0, gx - 4); x <= Math.min(map.W - 1, gx + 4); x++) {
            if (rock(B, x, y) || taken.has(x + ',' + y)) continue;
            const dd = Math.hypot(x - gx, y - gy); if (dd < bd) { bd = dd; best = [x, y]; }
          }
          if (!best) continue; [gx, gy] = best;
        }
        taken.add(gx + ',' + gy); u.order = { k: kind, x: gx + 0.5, y: gy + 0.5, ...(hurry ? { hurry: true } : {}) };
      }
    }
    if (opt.detour) applyDetour(B, L, tx, ty);
    noteOrders(B, L); log(B, kind, L, { x: tx, y: ty, hurry: hurry, detour: !!opt.detour });
    return { ok: true, msg: (kind === 'amove' ? '공격 이동' : '이동') + ' ' + L.map(u => u.name).join(' · ') };
  }

  // 철수: 모두 자기 진영 쪽 가장자리로 서둘러 달려, 가장자리에 닿으면 판을 떠남 (Battle._retreatTick).
  // 지휘망을 거치지 않고 바로 걸린다 — 도망치라는 외침은 모두에게 들리는 걸로. 쓰러져 기는 몸은 못 나감(남음).
  function retreat(B) {
    const W = B.W, L = W.units.filter(u => u.alive && u.side === 0 && !u.gone && !u.summon);
    if (!L.length) return { ok: false, msg: '철수할 아군이 없어요' };
    for (const u of L) { u.order = { k: 'move', x: 0.9, y: Math.min(W.map.H - 1, Math.max(1, u.y)), hurry: true }; }
    noteOrders(B, L, true); B.retreating = true; B.retreatAt = W.t; log(B, 'retreat', L, {});
    return { ok: true, msg: '철수! 가장자리에 닿으면 판을 떠나요' };
  }

  function attack(B, ids, t, opt) {
    opt = opt || {};
    const L = alive(B, ids);
    if (!L.length) return { ok: false, msg: '먼저 명령할 아군을 고르세요' };
    if (!t || !t.alive || t.side === 0) return { ok: false, msg: '공격할 적이 아니에요' };
    if (!t.seenBy) return { ok: false, msg: '안 보이는 적은 노릴 수 없어요' };
    // 같은 적을 다시 누르면 급함: 사수는 바로 쏨(오사 감수), 근접은 서둘러 뜀
    L.forEach(u => { u.order = { k: 'attack', b: t.i, ...(opt.rush ? { now: true, ...(E.isFar(u) ? {} : { hurry: true }) } : {}) }; u.last = { x: t.x, y: t.y }; });
    if (opt.detour) applyDetour(B, L, t.x, t.y);
    noteOrders(B, L); log(B, 'attack', L, { b: t.i, rush: !!opt.rush });
    return { ok: true, msg: L.map(u => u.name).join(' · ') + ' → ' + t.name + ' 공격' };
  }

  function charge(B, ids, target, pt, opt) {
    opt = opt || {};
    const C = alive(B, ids).filter(u => u.canCharge && !u.crawl);
    if (!C.length) return { ok: false, msg: '돌격할 수 있는 아군이 없어요 (사수 · 기어다니는 몸은 못 함)' };
    if (target) {
      if (!target.seenBy) return { ok: false, msg: '안 보이는 적에게는 돌격할 수 없어요' };
      C.forEach(u => { u.order = { k: 'charge', b: target.i }; u.last = { x: target.x, y: target.y }; });
      if (opt.detour) applyDetour(B, C, target.x, target.y);
    } else {
      if (rock(B, pt.x, pt.y)) return { ok: false, msg: '바위로는 돌격할 수 없어요' };
      C.forEach((u, k) => { const a = k * 2.4, rr = k ? 0.7 : 0; u.order = { k: 'charge', x: pt.x + Math.cos(a) * rr, y: pt.y + Math.sin(a) * rr }; });
      if (opt.detour) applyDetour(B, C, pt.x, pt.y);
    }
    noteOrders(B, C); log(B, 'charge', C, target ? { b: target.i } : { x: pt.x, y: pt.y });
    return { ok: true, msg: C.map(u => u.name).join(' · ') + ' 돌격!' };
  }

  function throwAt(B, ids, t) {
    const C = alive(B, ids).filter(u => u.jav && u.spearHeld);
    if (!C.length) return { ok: false, msg: '던질 수 있는 아군이 없어요 (창 · 단검을 든 이만 — 이미 던졌으면 줍기)' };
    if (!t || !t.alive || t.side === 0) return { ok: false, msg: '던질 적을 고르세요' };
    if (!t.seenBy) return { ok: false, msg: '안 보이는 적에게는 못 던져요' };
    C.forEach(u => { u.order = { k: 'throw', b: t.i }; });
    noteOrders(B, C); log(B, 'throw', C, { b: t.i });
    return { ok: true, msg: C.map(u => u.name).join(' · ') + ' 투창' };
  }

  // 줍기: 고른 아군 중 집어 들 수 있는 가장 가까운 쪽이 그 물건을 주우러 감 (같은 물건을 다시 누르면 서둘러)
  function pick(B, ids, item, hurry) {
    const L = alive(B, ids), W = B.W;
    const C = L.filter(u => E.canTake(W, u, item)).sort((a, b) => Math.hypot(a.x - item.x, a.y - item.y) - Math.hypot(b.x - item.x, b.y - item.y));
    if (!C.length) return { ok: false, msg: item.k === 'shield' ? '고른 아군은 방패를 들 수 없어요 (왼팔 · 두 손 무기 · 이미 방패)' : '고른 아군은 이걸 집어 들 수 없어요 (몸에 맞는 크기여야 해요)' };
    const u = C[0]; u.order = { k: 'pick', id: item.id, ...(hurry ? { hurry: true } : {}) };
    noteOrders(B, [u]); log(B, 'pick', [u], { item: item.id });
    return { ok: true, msg: u.name + ' → ' + item.name + ' 줍기' };
  }
  function pickSpear(B, ids) {
    const C = alive(B, ids).filter(u => u.jav && !u.spearHeld && E.mySpear(B.W, u));
    if (!C.length) return { ok: false, msg: '주울 던진 창이 없어요' };
    C.forEach(u => { u.order = { k: 'pick', spear: true }; });
    noteOrders(B, C); log(B, 'pickSpear', C);
    return { ok: true, msg: '던진 창을 주우러 가요' };
  }

  const simple = (k, extra) => function (B, ids) {
    const L = alive(B, ids);
    if (!L.length) return { ok: false, msg: '먼저 명령할 아군을 고르세요' };
    if (k === 'hold') L.forEach(u => { u.order = { k: 'hold' }; E.stop && E.stop(u); });
    else if (k === 'auto') L.forEach(u => { u.order = null; u.stay = null; });
    else if (k === 'cancel') L.forEach(u => { if (u.order) u.order = null; else u.stay = null; });
    else if (k === 'line') L.filter(u => !u.crawl).forEach(u => { u.order = { k: 'line', join: true }; });
    noteOrders(B, L); log(B, k, L);
    return { ok: true, msg: ({ hold: '제자리 지키기', auto: '자동 (스스로 판단)', cancel: '명령 취소', line: '전열 참여' })[k] + ' — ' + L.map(u => u.name).join(' · ') };
  };

  // 태세: 교전 규칙 (roe: free/smart/hold/nofire) · 치료 방침 (heal: dying/free/order) — 명령처럼 지휘관을 거쳐 닿음
  function posture(B, ids, key, val) {
    const L = alive(B, ids);
    if (!L.length) return { ok: false, msg: '먼저 명령할 아군을 고르세요' };
    E.sendPosture(B.W, L, key, val, {});
    log(B, key, L, { v: val });
    return { ok: true, msg: (key === 'roe' ? '교전 규칙 ' : '치료 방침 ') + val };
  }
  // 막기: 자동 ↔ 풀기(온 힘으로 침)
  function guardToggle(B, ids) {
    const C = alive(B, ids).filter(u => u.canGuard);
    if (!C.length) return { ok: false, msg: '막을 방패 · 무기가 없어요' };
    const off = !C[0].guardOff;
    C.forEach(u => { u.guardOff = off; u.guardMode = off ? 'off' : 'auto'; });
    log(B, 'guard', C, { off: off });
    return { ok: true, msg: off ? '막기를 풀어 둠 (온 힘으로 침)' : '막기 자동' };
  }
  function chargePolicy(B, ids) {   // 스스로 돌격 안 함 ↔ 판단
    const C = alive(B, ids).filter(u => u.canCharge);
    if (!C.length) return { ok: false, msg: '돌격할 수 있는 아군을 고르세요' };
    const on = !C.every(u => u.noChg);
    C.forEach(u => { u.noChg = on; u.noChgUser = on; });
    log(B, 'noChg', C, { on: on });
    return { ok: true, msg: on ? '스스로 돌격하지 않음 (돌격 명령은 따름)' : '돌격을 스스로 판단' };
  }

  // 관계: 전우조 (서로 붙어 다니고 · 구하고 · 옆구리를 침) · 대장-부하 (따를이 / 보호받을이). 지휘망을 거치지 않고 바로.
  function mate(B, ids) {
    const o = E.cgJoin(B.W, alive(B, ids));
    if (o.ok) E.relSync(B.W, B.setup);
    return o.ok ? { ok: true, msg: o.on ? '전우조 — 서로 붙어 다니고, 위급하면 구하고, 옆구리를 침' : '전우조를 풀었어요' } : { ok: false, msg: o.why };
  }
  function chief(B, followerIds, chiefId, mode) {
    const o = E.chiefSet(B.W, alive(B, followerIds), B.W.units[chiefId], mode || 'follow');
    if (o.ok) E.relSync(B.W, B.setup);
    return o.ok ? { ok: true, msg: o.on ? (mode === 'cover' ? '⛨ 보호받을이 — 대장 등 뒤에서 지원' : '♛ 따를이 — 대장을 따르고 싸우면 적극 가담') : '관계를 풀었어요' } : { ok: false, msg: o.why };
  }
  function relCut(B, ids) {
    const L = alive(B, ids), n = E.cgLeave(B.W, L) + E.chiefClear(B.W, L);
    E.relSync(B.W, B.setup);
    return { ok: !!n, msg: n ? '관계를 풀었어요' : '풀 관계가 없어요' };
  }

  return { noteOrders: noteOrders, retreat: retreat, move: move, attack: attack, charge: charge, throwAt: throwAt, pick: pick, pickSpear: pickSpear,
    hold: simple('hold'), auto: simple('auto'), cancel: simple('cancel'), line: simple('line'), posture: posture, guardToggle: guardToggle,
    chargePolicy: chargePolicy, mate: mate, chief: chief, relCut: relCut, applyDetour: applyDetour };
})();
