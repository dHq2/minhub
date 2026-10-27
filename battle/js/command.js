/* 굴 전투판 v1 · command: 지휘망(별), 분대, 명령 전달(지연·실패·분대장 경유), 지휘관 승계
 *
 * 규칙 요약
 *  - 총지휘관(M)의 명령은 목표 유닛에게 직접 가는 동시에, 목표가 분대원이면 분대장(L)에게도 간다.
 *  - 직접 경로: 거리 비례 지연 + 거리/소음에 따른 전달 실패. 실패하면 1.5초 뒤 2차 전송(실패율 절반).
 *  - 분대장 경유: M→L, L→부하. 분대장 근처(지휘 범위의 35% 이내)에서는 사실상 실패하지 않는다.
 *  - 먼저 도착하는 쪽이 적용되고, 뒤늦게 도착하는 중복 명령은 무시된다.
 *  - 지휘 스탯(cmd)은 전달 속도·정확도·범위를 함께 결정한다.
 */
(function (root) {
  'use strict';
  const BG = root.BG;
  const U = BG.U;
  const cmd = BG.cmd = {};

  cmd.newNet = () => ({ main: null, squads: [], nextSq: 1, confusionUntil: 0 });

  cmd.O = {
    move: (pts, o) => Object.assign({ type: 'move', pts: pts.map(p => ({ x: p.x, y: p.y })) }, o),
    hold: pos => ({ type: 'hold', pos: pos ? { x: pos.x, y: pos.y } : null }),
    attack: tid => ({ type: 'attack', target: tid }),
    charge: (tid, pt) => ({ type: 'charge', target: tid || 0, pts: pt ? [{ x: pt.x, y: pt.y }] : [] }),
    retreat: pt => ({ type: 'retreat', pts: [{ x: pt.x, y: pt.y }] }),
    stance: v => ({ type: 'stance', value: v }),
    clear: () => ({ type: 'clear' })
  };

  const fwdAng = side => side === 'ally' ? 0 : Math.PI;
  const alive = (W, side) => W.units.filter(u => u.alive && u.side === side);

  // 선임 우선: 계급 -> 지휘 스탯 -> 체력
  cmd.best = function (list) {
    return list.slice().sort((a, b) => (b.rank - a.rank) || (b.s.cmd - a.s.cmd) || (b.hp - a.hp))[0] || null;
  };
  cmd.bestByCmd = function (list) {
    return list.slice().sort((a, b) => (b.s.cmd - a.s.cmd) || (b.rank - a.rank) || (b.hp - a.hp))[0] || null;
  };

  cmd.squadOf = function (W, u) {
    const net = W.net[u.side];
    for (const sq of net.squads) if (sq.members.indexOf(u.id) >= 0) return sq;
    return null;
  };
  cmd.isMain = (W, u) => W.net[u.side].main === u.id;
  cmd.isLeader = function (W, u) {
    const sq = cmd.squadOf(W, u);
    return !!sq && sq.leader === u.id;
  };
  cmd.stars = function (W, u) {
    const net = W.net[u.side];
    if (net.main === u.id) return net.squads.length ? 2 : 1;
    return cmd.isLeader(W, u) ? 1 : 0;
  };
  cmd.main = (W, side) => { const id = W.net[side].main; return id ? W.units[id - 1] : null; };

  cmd.setMain = function (W, side, id, why) {
    const net = W.net[side];
    net.main = id;
    BG.Log.add(W, 'main', { side: side, u: id, why: why || '' });
  };
  cmd.autoMain = function (W, side) {
    const u = cmd.bestByCmd(alive(W, side));
    if (u) cmd.setMain(W, side, u.id, '지휘 스탯 최상');
  };

  // 분대(진형 그룹) 편성. 같은 진영의 생존 유닛만. 다른 분대에서 빠져나온다.
  cmd.makeSquad = function (W, side, ids, leaderId) {
    const net = W.net[side];
    const members = ids.map(id => W.units[id - 1]).filter(u => u && u.alive && u.side === side);
    if (members.length < 2) return null;
    const mids = members.map(u => u.id);
    net.squads.forEach(sq => { sq.members = sq.members.filter(id => mids.indexOf(id) < 0); });
    cmd.pruneSquads(W, side);
    let leader = leaderId ? W.units[leaderId - 1] : null;
    if (!leader || mids.indexOf(leader.id) < 0) leader = cmd.best(members);
    const f = fwdAng(side), off = {};
    members.forEach(u => {
      const r = U.rot(u.x - leader.x, u.y - leader.y, -f);
      off[u.id] = { x: r.x, y: r.y };
    });
    const sq = { id: net.nextSq++, leader: leader.id, members: mids, off: off };
    net.squads.push(sq);
    BG.Log.add(W, 'squad', { side: side, leader: leader.id, n: mids.length });
    return sq;
  };
  cmd.pruneSquads = function (W, side) {
    const net = W.net[side];
    net.squads = net.squads.filter(sq => {
      sq.members = sq.members.filter(id => W.units[id - 1].alive);
      if (sq.members.length < 2) { BG.Log.add(W, 'squad_end', { side: side }); return false; }
      if (sq.members.indexOf(sq.leader) < 0) {
        const nl = cmd.best(sq.members.map(id => W.units[id - 1]));
        sq.leader = nl.id;
        BG.Log.add(W, 'leader', { side: side, u: nl.id, why: '승계' });
      }
      return true;
    });
  };
  cmd.disband = function (W, side, sqId) {
    const net = W.net[side];
    const n = net.squads.length;
    net.squads = net.squads.filter(sq => sq.id !== sqId);
    if (net.squads.length < n) BG.Log.add(W, 'squad_end', { side: side });
  };
  cmd.setLeader = function (W, side, sqId, id) {
    const sq = W.net[side].squads.find(s => s.id === sqId);
    if (!sq || sq.members.indexOf(id) < 0) return;
    sq.leader = id;
    BG.Log.add(W, 'leader', { side: side, u: id, why: '임명' });
  };

  cmd.onDeath = function (W, u) {
    const side = u.side, net = W.net[side];
    cmd.pruneSquads(W, side);
    if (net.main === u.id) {
      const list = alive(W, side);
      if (!list.length) { net.main = null; return; }
      let succ = null, bd = 1e9;
      net.squads.forEach(sq => {
        const l = W.units[sq.leader - 1];
        const d = U.dist(l, u);
        if (l.alive && d < bd) { bd = d; succ = l; }
      });
      if (!succ) succ = cmd.best(list);
      cmd.setMain(W, side, succ.id, '승계');
      net.confusionUntil = W.t + 2.0;
    }
  };

  // ---- 전달 모델 ----
  const sf = a => 0.7 + a.s.cmd / 100 * 0.8;            // 전달 속도 계수
  const cmdRange = a => 6 + a.s.cmd * 0.12;            // 유효 지휘 범위(m)
  function linkDelay(W, a, b) {
    const net = W.net[a.side];
    let d = (0.15 + U.dist(a, b) / 16) / sf(a);
    if (W.t < net.confusionUntil) d *= 1.6;
    return d;
  }
  function pFail(W, a, b, scale) {
    const R = cmdRange(a), d = U.dist(a, b), near = d <= 0.35 * R;
    let p = 0.01;
    if (!near) p += U.clamp((d - 0.35 * R) / (R * 1.6), 0, 0.7) * 0.9;
    let noise = 0;
    W.units.forEach(e => {
      if (!e.alive || e.side === a.side) return;
      if (Math.hypot(e.x - b.x, e.y - b.y) < 4) noise += 0.05;
      if (Math.hypot(e.x - a.x, e.y - a.y) < 4) noise += 0.03;
    });
    p += Math.min(0.3, noise) * (near ? 0.05 : 1);
    p *= 1.15 - a.s.cmd / 160;
    return U.clamp(p * (scale || 1), 0.005, 0.92);
  }
  function tryLink(W, a, b, startT, scale) {
    return { ok: W.rng.next() >= pFail(W, a, b, scale), t: startT + linkDelay(W, a, b) };
  }
  cmd.pFail = pFail; cmd.linkDelay = linkDelay; cmd.cmdRange = cmdRange;

  const canRelay = u => u.alive && !(u.act && (u.act.k === 'stun' || u.act.k === 'down'));

  function dispatchOne(W, side, M, u, order, mid, opt) {
    const ev = { side: side, to: u.id, type: order.type, prio: !!opt.prio };
    if (u === M || opt.instant || W.phase === 'prep') {
      BG.sim.applyOrder(W, u, order, !!opt.prio);
      ev.route = 'instant';
      BG.Log.add(W, 'cmd', ev);
      return;
    }
    const net = W.net[side];
    let best = null; // {t, route}
    // 직접 경로 (+ 2차 전송)
    let a1 = tryLink(W, M, u, W.t, 1);
    W.pulses.push({ from: M.id, to: u.id, t0: W.t, t1: a1.t, ok: a1.ok, kind: 'direct' });
    if (a1.ok) best = { t: a1.t, route: 'direct' };
    else {
      const a2 = tryLink(W, M, u, W.t + 1.5, 0.5);
      W.pulses.push({ from: M.id, to: u.id, t0: W.t + 1.5, t1: a2.t, ok: a2.ok, kind: 'retry' });
      if (a2.ok) best = { t: a2.t, route: 'direct' };
    }
    // 분대장 경유
    const sq = cmd.squadOf(W, u);
    if (sq && sq.leader !== u.id && sq.leader !== M.id) {
      const L = W.units[sq.leader - 1];
      if (canRelay(L)) {
        const m1 = tryLink(W, M, L, W.t, 1);
        W.pulses.push({ from: M.id, to: L.id, t0: W.t, t1: m1.t, ok: m1.ok, kind: 'relay' });
        if (m1.ok) {
          const m2 = tryLink(W, L, u, m1.t, 1);
          W.pulses.push({ from: L.id, to: u.id, t0: m1.t, t1: m2.t, ok: m2.ok, kind: 'relay' });
          if (m2.ok && (!best || m2.t < best.t)) best = { t: m2.t, route: 'relay' };
        }
      }
    }
    if (!best) {
      ev.route = 'lost';
      u.lostMark = W.t;
      BG.Log.add(W, 'cmd', ev);
      return;
    }
    ev.route = best.route; ev.delay = U.r2(best.t - W.t);
    BG.Log.add(W, 'cmd', ev);
    W.msgs.push({ t: best.t, to: u.id, order: order, prio: !!opt.prio, mid: mid });
    u.pendingMark = W.t;
  }

  // items: [{id, order}]  opt: {prio, instant}
  cmd.issueMany = function (W, side, items, opt) {
    opt = opt || {};
    if (W.phase === 'end') return 0;
    const M = cmd.main(W, side);
    if (!M || !M.alive) {
      if (W.phase !== 'prep') return 0;
    }
    let n = 0;
    const mid = W.nextMsg++;
    items.forEach(it => {
      const u = W.units[it.id - 1];
      if (!u || !u.alive || u.side !== side) return;
      dispatchOne(W, side, M || u, u, it.order, mid, opt);
      n++;
    });
    return n;
  };
  cmd.issue = function (W, side, ids, order, opt) {
    return cmd.issueMany(W, side, ids.map(id => ({ id: id, order: order })), opt);
  };

  // 분대 진형 이동: 분대원마다 오프셋을 반영한 목적지를 준다.
  cmd.formMove = function (W, side, sqId, P, opt) {
    const sq = W.net[side].squads.find(s => s.id === sqId);
    if (!sq) return 0;
    const L = W.units[sq.leader - 1];
    const h = Math.atan2(P.y - L.y, P.x - L.x);
    const mem = sq.members.map(id => W.units[id - 1]).filter(u => u.alive);
    const cap = Math.min.apply(null, mem.map(u => u.s.spd)) * 0.95;
    const items = mem.map(u => {
      const o = sq.off[u.id] || { x: 0, y: 0 };
      const rr = U.rot(o.x, o.y, h); // 오프셋은 진영 정면(+x) 기준 저장 → 이동 방향(h)으로 회전
      const dest = { x: U.clamp(P.x + rr.x, 1, BG.C.MAP_W - 1), y: U.clamp(P.y + rr.y, 1, BG.C.MAP_H - 1) };
      return { id: u.id, order: cmd.O.move([dest], { cap: cap }) };
    });
    return cmd.issueMany(W, side, items, opt);
  };

  // 메시지 도착 처리
  cmd.process = function (W) {
    if (!W.msgs.length) return;
    const rest = [];
    for (const m of W.msgs) {
      if (m.t > W.t) { rest.push(m); continue; }
      const u = W.units[m.to - 1];
      if (!u || !u.alive) continue;
      if (u.seenMsg && u.seenMsg[m.mid]) continue; // 중복(뒤늦게 도착한 쪽)
      u.seenMsg = u.seenMsg || {};
      u.seenMsg[m.mid] = 1;
      BG.sim.applyOrder(W, u, m.order, m.prio);
    }
    W.msgs = rest;
    if (W.pulses.length > 60) W.pulses = W.pulses.filter(p => p.t1 + 1 > W.t);
  };
})(typeof window !== 'undefined' ? window : globalThis);
