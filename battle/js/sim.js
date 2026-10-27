/* 굴 전투판 v1 · sim: 전투 시뮬레이션 (이동·공격·막기·스태미나·돌격·전열 버팀·넘어짐·사격/오사)
 * 고정 틱(0.05s)·시드 난수·명령 큐만으로 진행되는 결정론적 구조. 양 진영 모두 같은 규칙과 같은 명령 API를 쓴다.
 */
(function (root) {
  'use strict';
  const BG = root.BG, U = BG.U, C = BG.C;
  const SHD = BG.SHIELD;
  const sim = BG.sim = {};
  const fwd = side => side === 'ally' ? 0 : Math.PI;

  // ---------- 생성 ----------
  function newUnit(W, side, d) {
    const s = BG.calcStats(d);
    const u = {
      id: W.nextId++, side: side, uid: d.uid, name: d.name, shape: d.shape, weapon: d.weapon, shield: !!d.shield,
      wins: d.wins || 0, rank: BG.rankIdx(d.wins || 0), s: s,
      x: 0, y: 0, vx: 0, vy: 0, kx: 0, ky: 0, f: fwd(side), fw: fwd(side), wx: 0, wy: 0,
      hp: s.hp, stam: s.stam, poise: 0, poiseMax: 30 + 20 * s.mass + s.hp * 0.1,
      act: null, order: { type: 'hold', pos: null }, stack: [], stance: 'normal', charge: null,
      alive: true, kills: 0, dealt: 0, taken: 0, chargeCd: 0, stunImm: 0, lastHit: -9, rep: null, repCd: 0,
      seenMsg: null, lostMark: -9, pendingMark: -9
    };
    u.poise = u.poiseMax;
    W.units.push(u);
    BG.Log.registerUnit(W, u);
    return u;
  }

  sim.create = function (opt) {
    const W = {
      v: BG.VERSION, seed: (opt.seed >>> 0) || 1, stage: opt.stage || 1, rng: new BG.Rng(opt.seed),
      t: 0, phase: 'prep', units: [], projs: [], msgs: [], pulses: [], nextId: 1, nextMsg: 1, nextProj: 1,
      result: null, ctrl: { ally: null, enemy: null }, aiAcc: { ally: 0, enemy: 0 }, stats: { ff: 0, shots: 0, hits: 0 }
    };
    W.net = { ally: BG.cmd.newNet(), enemy: BG.cmd.newNet() };
    BG.Log.init(W);
    ['ally', 'enemy'].forEach(side => {
      (opt[side] || []).forEach(d => newUnit(W, side, d));
      sim.autoDeploy(W, side);
      BG.cmd.autoMain(W, side);
    });
    return W;
  };

  sim.zone = function (side) {
    return side === 'ally' ? { x0: 3, x1: 21, y0: 2, y1: C.MAP_H - 2 } : { x0: C.MAP_W - 21, x1: C.MAP_W - 3, y0: 2, y1: C.MAP_H - 2 };
  };

  sim.autoDeploy = function (W, side) {
    const us = W.units.filter(u => u.side === side);
    const isRanged = u => u.weapon === 'cannon';
    const front = us.filter(u => (u.shape === 'square' || u.shape === 'circle') && !isRanged(u));
    const wing = us.filter(u => u.shape === 'triangle' && !isRanged(u));
    const rear = us.filter(u => front.indexOf(u) < 0 && wing.indexOf(u) < 0);
    const dir = side === 'ally' ? 1 : -1;
    const baseX = side === 'ally' ? 18 : C.MAP_W - 18;
    const cy = C.MAP_H / 2;
    const place = (list, x, sp) => {
      const per = Math.max(1, Math.floor((C.MAP_H - 6) / sp));
      list.forEach((u, i) => {
        const col = Math.floor(i / per), k = i % per;
        const idx = (k % 2 === 0 ? 1 : -1) * Math.ceil(k / 2);
        u.x = x - dir * col * 2.2; u.y = cy + idx * sp;
        u.f = u.fw = fwd(side); u.order = { type: 'hold', pos: { x: u.x, y: u.y } };
      });
    };
    front.sort((a, b) => b.hp - a.hp);
    place(front, baseX, 2.4);
    place(wing, baseX - dir * 4.5, 3.6);
    place(rear, baseX - dir * 7, 2.8);
  };

  sim.setController = function (W, side, ctrl) {
    W.ctrl[side] = ctrl;
    if (ctrl && ctrl.setup) ctrl.setup(W, side);
  };

  sim.startBattle = function (W) {
    if (W.phase !== 'prep') return;
    W.phase = 'run';
    BG.Log.add(W, 'start');
  };

  // ---------- 명령 적용 ----------
  sim.applyOrder = function (W, u, order, prio) {
    if (!u.alive) return;
    if (order.type === 'stance') {
      if (u.stance !== order.value) { u.stance = order.value; BG.Log.add(W, 'stance', { u: u.id, v: u.stance }); }
      return;
    }
    if (order.type === 'clear') { u.order = { type: 'hold', pos: { x: u.x, y: u.y } }; u.stack = []; u.charge = null; return; }
    const o = JSON.parse(JSON.stringify(order));
    if (o.type === 'hold' && !o.pos) o.pos = { x: u.x, y: u.y };
    if (prio) {
      if (u.stack.length < 3) u.stack.push(u.order); // 우선 명령: 기존 명령을 보류했다가 끝나면 재개
    } else {
      u.stack = [];
    }
    u.order = o;
    u.charge = o.type === 'charge' ? { t: 0 } : null;
  };
  function finishOrder(u) {
    u.charge = null;
    u.order = u.stack.pop() || { type: 'hold', pos: { x: u.x, y: u.y } };
    if (u.order.type === 'charge') u.charge = { t: 0 };
  }
  sim.finishOrder = finishOrder;

  // ---------- 조회 유틸 ----------
  const atkFat = u => 0.7 + 0.3 * Math.min(1, (u.stam / u.s.stam) / 0.4);
  const spdFat = u => { const f = u.stam / u.s.stam; return f > 0.35 ? 1 : 0.6 + 0.4 * f / 0.35; };
  const isRanged = u => !!BG.WEAPONS[u.weapon].ranged;
  const isDown = u => !!(u.act && u.act.k === 'down');
  sim.isDown = isDown;
  const unitOf = (W, id) => id ? W.units[id - 1] : null;

  function foesOf(W, u) { return W.units.filter(e => e.alive && e.side !== u.side); }

  function pickTarget(W, u, maxD) {
    let best = null, bs = 1e9;
    for (const e of W.units) {
      if (!e.alive || e.side === u.side) continue;
      const d = U.dist(u, e);
      if (d > maxD) continue;
      let sc = d;
      if (isDown(e)) sc -= 2.5;
      sc -= (1 - e.hp / e.s.hp) * 2;
      if (isRanged(e)) sc -= 1.5;
      if (sc < bs) { bs = sc; best = e; }
    }
    return best;
  }
  const gapOf = (a, b) => U.dist(a, b) - a.s.r - b.s.r;

  // 사선 점검: 같은 편이 사선에 끼어 있으면 그 유닛을 돌려준다
  function lineBlocker(W, u, tx, ty, ignoreId, fromX, fromY) {
    const x0 = fromX == null ? u.x : fromX, y0 = fromY == null ? u.y : fromY;
    const dx = tx - x0, dy = ty - y0, L2 = dx * dx + dy * dy;
    if (L2 < 1e-6) return null;
    const L = Math.sqrt(L2);
    for (const o of W.units) {
      if (!o.alive || o === u || o.id === ignoreId || o.side !== u.side) continue;
      const t = ((o.x - x0) * dx + (o.y - y0) * dy) / L2;
      if (t * L < 0.4 || t * L > L - 0.3) continue;
      const cx = x0 + dx * t, cy = y0 + dy * t;
      if (Math.hypot(o.x - cx, o.y - cy) < o.s.r + 0.3) return o;
    }
    return null;
  }
  sim.lineBlocker = lineBlocker;

  // 전열 버팀: 맞는 방향 뒤쪽에 붙은 아군이 질량을 보태 준다
  function backup(W, u, hx, hy) {
    let n = 0;
    for (const a of W.units) {
      if (!a.alive || a === u || a.side !== u.side || isDown(a)) continue;
      const dx = a.x - u.x, dy = a.y - u.y, d = Math.hypot(dx, dy);
      if (d > u.s.r + a.s.r + 0.7 || d < 1e-4) continue;
      if ((dx * hx + dy * hy) / d > 0.3) n++; // 충격이 향하는 쪽 뒤에 있는 아군
    }
    return Math.min(n, 3);
  }

  // ---------- 피격 판정 ----------
  function die(W, tgt, att) {
    tgt.alive = false; tgt.hp = 0; tgt.act = null; tgt.charge = null;
    if (att && att !== tgt) att.kills++;
    BG.Log.add(W, 'dead', { d: tgt.id, a: att ? att.id : 0 });
    BG.cmd.onDeath(W, tgt);
  }

  // spec: {kind, dmg, poise, stun, kb, pierce, from(각도: 피격자→공격자), dx, dy}
  function resolveHit(W, att, tgt, spec) {
    if (!tgt.alive) return 0;
    const w = BG.WEAPONS[tgt.weapon];
    const diff = U.angDiff(spec.from, tgt.f);
    const back = Math.abs(diff) > 2.0;
    const canBlock = !tgt.act || tgt.act.k === 'rec';
    let blocked = false, shieldBlock = false;
    if (canBlock && !back && !spec.noBlock) {
      const arc = Math.max(w.arc, tgt.shield ? SHD.arc : 0) * Math.PI / 180;
      if (Math.abs(diff) <= arc / 2) {
        let ch = 0.08 + w.blk + (tgt.shield ? SHD.blk : 0) + tgt.s.blk / 300 - (spec.pierce || 0) * 0.3;
        if (tgt.stance === 'defend') ch += 0.15 + (spec.kind === 'proj' ? 0.1 : 0);
        ch = U.clamp(ch, 0.03, 0.88);
        if (W.rng.next() < ch) { blocked = true; shieldBlock = tgt.shield && Math.abs(diff) <= SHD.arc * Math.PI / 360; }
      }
    }
    let dmg = spec.dmg;
    if (back) dmg *= 1.35;
    if (isDown(tgt)) dmg *= 1.25;
    const armor = tgt.s.def * (1 - (spec.pierce || 0));
    dmg = Math.max(dmg * 0.25, dmg - armor);
    let guardBroke = false;
    if (blocked) {
      const cost = (spec.dmg * 0.45 + 2) * (tgt.shield ? SHD.stCost : 1);
      if (tgt.stam < cost) {
        guardBroke = true; blocked = false; tgt.stam = 0;
        BG.Log.add(W, 'guardbreak', { d: tgt.id });
      } else {
        tgt.stam -= cost;
        dmg *= 1 - (shieldBlock ? SHD.absorb : BG.BLOCK_ABSORB);
      }
    }
    // 균형(넘어짐)
    const nb = backup(W, tgt, -Math.cos(spec.from), -Math.sin(spec.from));
    const resist = (1 + 0.28 * nb) * (tgt.stance === 'defend' ? 1.6 : 1) * (0.85 + 0.15 * tgt.s.mass);
    let pd = (spec.poise || 0) * (blocked ? 0.4 : 1) * (back ? 1.2 : 1) * (guardBroke ? 2 : 1) / resist;
    tgt.poise -= pd; tgt.lastHit = W.t;
    // 밀림
    const effMass = tgt.s.mass * (tgt.stance === 'defend' ? 1.5 : 1) * (1 + 0.45 * nb);
    const kbv = (spec.kb || 0) * (blocked ? 0.5 : 1) / effMass;
    const kdx = -Math.cos(spec.from), kdy = -Math.sin(spec.from);
    tgt.kx += kdx * kbv; tgt.ky += kdy * kbv;

    tgt.hp -= dmg; tgt.taken += dmg;
    if (att) att.dealt += dmg;
    const ff = !!att && att.side === tgt.side;
    if (spec.kind === 'proj') W.stats.hits++;
    if (ff) W.stats.ff++;
    BG.Log.add(W, 'hit', {
      a: att ? att.id : 0, d: tgt.id, kind: spec.kind, dmg: Math.round(dmg * 10) / 10, blk: blocked, back: back,
      ff: ff, hp: Math.max(0, Math.round(tgt.hp))
    });
    if (tgt.hp <= 0) { die(W, tgt, att); return dmg; }

    if (tgt.poise <= 0 && !isDown(tgt)) {
      tgt.act = { k: 'down', t: 1.6 }; tgt.charge = null;
      if (tgt.order.type === 'charge') finishOrder(tgt);
      BG.Log.add(W, 'down', { d: tgt.id });
    } else if (!blocked && !isDown(tgt) && tgt.stunImm <= 0 &&
      (spec.poise >= 10 || !tgt.act || tgt.poise < tgt.poiseMax * 0.35 || guardBroke)) {
      const st = (guardBroke ? 0.5 : (spec.stun || 0)) * (0.6 + 0.4 * (1 - tgt.poise / tgt.poiseMax));
      if (st > 0.05) {
        tgt.act = { k: 'stun', t: st }; tgt.stunImm = st + 0.5;
        if (tgt.charge) { tgt.charge = null; if (tgt.order.type === 'charge') finishOrder(tgt); }
      }
    }
    return dmg;
  }

  // ---------- 공격 ----------
  function startAttack(W, u, t, wname) {
    const w = BG.WEAPONS[wname];
    if (u.stam < w.st * 0.4) return false;
    u.stam = Math.max(0, u.stam - w.st);
    const wm = u.stance === 'defend' ? 1.25 : 1;
    u.act = { k: 'wind', t: w.wind * wm, tot: w.wind * wm, target: t.id, w: wname };
    return true;
  }

  function fire(W, u, t, w) {
    if (!t || !t.alive) { u.stam = Math.min(u.s.stam, u.stam + w.st * 0.7); return; }
    const d = U.dist(u, t);
    const ft = d / w.proj;
    const tvx = t.vx + t.kx * 0.4, tvy = t.vy + t.ky * 0.4;
    const lead = 0.5 + 0.5 * (u.s.shoot / 100);
    let ang = Math.atan2(t.y + tvy * ft * lead - u.y, t.x + tvx * ft * lead - u.x);
    const acc = U.clamp(0.4 + u.s.shoot / 100 * 0.55 - d / 70 * 0.25 - Math.hypot(tvx, tvy) * 0.02, 0.1, 0.97);
    ang += W.rng.gauss() * ((1 - acc) * 0.16 + 0.008);
    const c = Math.cos(ang), s = Math.sin(ang);
    W.projs.push({
      id: W.nextProj++, owner: u.id, side: u.side, x: u.x + c * u.s.r, y: u.y + s * u.s.r, vx: c * w.proj, vy: s * w.proj,
      dist: 0, max: w.reach + 6, dmg: w.dmg * u.s.atk / 100 * atkFat(u), w: w, ang: ang
    });
    W.stats.shots++;
    BG.Log.add(W, 'shot', { a: u.id, acc: Math.round(acc * 100) / 100 });
    u.fire = W.t;
  }

  function release(W, u) {
    const a = u.act, t = unitOf(W, a.target), w = BG.WEAPONS[a.w];
    const next = { k: 'rec', t: w.rec * (u.stance === 'defend' ? 1.3 : 1) };
    if (w.ranged) {
      // 발사 순간 사선에 아군이 끼어들었으면 쏘지 않는다
      if (t && t.alive && lineBlocker(W, u, t.x, t.y, t.id)) {
        u.stam = Math.min(u.s.stam, u.stam + w.st * 0.7);
        u.act = { k: 'rec', t: 0.3 };
        return;
      }
      fire(W, u, t, w);
    } else if (t && t.alive) {
      const g = gapOf(u, t);
      if (g <= w.reach * 1.2 + 0.2) {
        let dmg = w.dmg * u.s.atk / 100 * atkFat(u);
        if (w.minRange && g < w.minRange) dmg *= 0.6;
        const d = U.dist(u, t) || 1;
        u.act = next;
        resolveHit(W, u, t, {
          kind: 'melee', dmg: dmg, poise: w.poise, stun: w.stun, kb: w.kb, pierce: w.pierce,
          from: U.ang(u.x - t.x, u.y - t.y), dx: (t.x - u.x) / d, dy: (t.y - u.y) / d
        });
        return;
      }
      BG.Log.add(W, 'miss', { a: u.id });
    }
    u.act = next;
  }

  // ---------- 이동 ----------
  function steer(u, tx, ty, mul, cap) {
    const dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy);
    if (d < 1e-4) return;
    let sp = u.s.spd * mul * spdFat(u) * (u.stance === 'defend' ? 0.35 : 1);
    if (cap) sp = Math.min(sp, cap);
    const ease = Math.min(1, d / 0.7);
    u.wx = dx / d * sp * ease; u.wy = dy / d * sp * ease;
    u.fw = Math.atan2(dy, dx);
  }

  // 교전 행동. 행동을 했으면 true.
  function engage(W, u, t, chase) {
    const wn = u.weapon, w = BG.WEAPONS[wn];
    const d = U.dist(u, t);
    if (w.ranged) {
      // 맞붙은 적에게는 맨손
      const adj = pickTarget(W, u, u.s.r + 1.4);
      if (adj && gapOf(u, adj) < 0.9) {
        u.fw = U.ang(adj.x - u.x, adj.y - u.y);
        startAttack(W, u, adj, 'fist');
        return true;
      }
      if (d <= w.reach * 0.97) {
        const blk = lineBlocker(W, u, t.x, t.y, t.id);
        if (!blk) {
          u.fw = U.ang(t.x - u.x, t.y - u.y);
          return startAttack(W, u, t, wn);
        }
        u.fw = U.ang(t.x - u.x, t.y - u.y);
        if (u.repCd <= 0) {
          const nx = -(t.y - u.y) / d, ny = (t.x - u.x) / d;
          for (const k of [1.6, -1.6, 2.8, -2.8, 4, -4]) {
            const px = U.clamp(u.x + nx * k, 1, C.MAP_W - 1), py = U.clamp(u.y + ny * k, 1, C.MAP_H - 1);
            if (!lineBlocker(W, u, t.x, t.y, t.id, px, py)) { u.rep = { x: px, y: py, t: 1.4 }; break; }
          }
          u.repCd = 1.0;
        }
        return true;
      }
      if (chase) { steer(u, t.x, t.y, 1); return true; }
      return false;
    }
    const g = gapOf(u, t);
    if (g <= w.reach * 0.95 + 0.1) {
      u.fw = U.ang(t.x - u.x, t.y - u.y);
      return startAttack(W, u, t, wn) || true;
    }
    if (chase) {
      if (g > w.reach * 0.8) steer(u, t.x, t.y, 1);
      else u.fw = U.ang(t.x - u.x, t.y - u.y);
      return true;
    }
    return false;
  }

  // ---------- 돌격 ----------
  function impact(W, u, t, ch) {
    const w = BG.WEAPONS[u.weapon];
    const mom = U.clamp(ch.t / 0.8, 0.25, 1);
    const fm = atkFat(u);
    const diff = Math.abs(U.angDiff(U.ang(u.x - t.x, u.y - t.y), t.f));
    const braced = t.stance === 'defend' && diff < 1.3 && !isDown(t);
    let spec;
    if (u.weapon === 'spear') {
      spec = { dmg: w.dmg * w.chargeMul * (0.6 + 0.6 * mom) * u.s.atk / 100 * fm, poise: 22 * mom, stun: 0.5, kb: (u.shield ? 6.5 : 5.5) * mom, pierce: 0.2 };
    } else if (u.weapon === 'mace' || u.weapon === 'sword') {
      spec = { dmg: w.dmg * 1.5 * (0.6 + 0.6 * mom) * u.s.atk / 100 * fm, poise: w.poise * 1.4 * (0.5 + mom), stun: 0.5, kb: 4 * mom, pierce: w.pierce };
    } else {
      const bash = u.shield ? 1.0 : 0.6;
      spec = { dmg: (3 + u.s.mass * u.s.spd * mom * 1.1) * bash * u.s.atk / 100 * fm, poise: 28 * mom * u.s.mass * bash + 6, stun: 0.5, kb: 6.5 * mom * u.s.mass * bash, pierce: 0 };
    }
    spec.kind = 'charge';
    spec.from = U.ang(u.x - t.x, u.y - t.y);
    if (braced) { spec.dmg *= 0.55; spec.poise *= 0.5; spec.kb *= 0.4; }
    BG.Log.add(W, 'charge', { a: u.id, d: t.id, brace: braced && t.weapon === 'spear' });
    resolveHit(W, u, t, spec);
    // 반동
    const rv = (u.weapon === 'spear' || u.weapon === 'sword' || u.weapon === 'mace') ? 0.8 : 2.2 * t.s.mass / u.s.mass;
    u.kx += Math.cos(spec.from) * rv; u.ky += Math.sin(spec.from) * rv;
    if (braced && t.weapon === 'spear' && u.alive) {
      const bw = BG.WEAPONS.spear;
      resolveHit(W, t, u, { kind: 'charge', dmg: bw.dmg * 1.3 * mom * t.s.atk / 100, poise: 14 * mom, stun: 0.3, kb: 1.5, pierce: 0.1, from: U.ang(t.x - u.x, t.y - u.y), noBlock: true });
    }
    u.chargeCd = 3.5; u.stam = Math.max(0, u.stam - 6);
    u.charge = null;
    if (u.alive) {
      u.order = t.alive ? { type: 'attack', target: t.id } : { type: 'hold', pos: { x: u.x, y: u.y } };
    }
  }

  function doCharge(W, u, o, dt) {
    if (!u.charge) u.charge = { t: 0 };
    const ch = u.charge;
    let t = unitOf(W, o.target);
    if (t && !t.alive) t = null;
    const dest = t || (o.pts && o.pts[0]);
    if (!dest || u.stam < 5 || ch.t > 7) { finishOrder(u); return; }
    ch.t += dt; u.stam -= 12 * dt;
    steer(u, dest.x, dest.y, 1.55 * Math.min(1, 0.35 + ch.t / 0.8));
    // 충돌 후보: 정면 부채꼴의 적 (대상이 있으면 그 대상 우선)
    const w = BG.WEAPONS[u.weapon];
    const trig = u.weapon === 'spear' ? w.reach + 0.15 : (u.weapon === 'sword' || u.weapon === 'mace') ? w.reach * 0.85 : 0.2;
    let hitT = null;
    const cand = t ? [t] : foesOf(W, u);
    for (const e of cand) {
      if (gapOf(u, e) > trig) continue;
      if (Math.abs(U.angDiff(U.ang(e.x - u.x, e.y - u.y), u.fw)) > 0.8) continue;
      hitT = e; break;
    }
    if (hitT) { impact(W, u, hitT, ch); return; }
    if (!t && U.dist(u, dest) < 0.6) finishOrder(u);
  }

  // ---------- 판단 ----------
  function threatFace(W, u) {
    const e = pickTarget(W, u, 14) || null;
    if (e) { u.fw = U.ang(e.x - u.x, e.y - u.y); return; }
    let bs = null, bd = 1e9;
    for (const f of foesOf(W, u)) {
      if (!isRanged(f)) continue;
      const d = U.dist(u, f);
      if (d < bd && d < 26) { bd = d; bs = f; }
    }
    if (bs) u.fw = U.ang(bs.x - u.x, bs.y - u.y);
  }

  function think(W, u, dt) {
    u.wx = 0; u.wy = 0;
    if (u.chargeCd > 0) u.chargeCd -= dt;
    if (u.stunImm > 0) u.stunImm -= dt;
    if (u.repCd > 0) u.repCd -= dt;
    const sp = Math.hypot(u.vx, u.vy);
    const defend = u.stance === 'defend';
    let rg = isDown(u) ? 14 : (defend ? 5 : (sp > 0.3 ? 6 : 12));
    if (u.charge) rg = 0;
    u.stam = Math.min(u.s.stam, u.stam + rg * dt);
    if (W.t - u.lastHit > 1.0) u.poise = Math.min(u.poiseMax, u.poise + 8 * dt);

    const a = u.act;
    if (a) {
      a.t -= dt;
      if (a.k === 'stun' || a.k === 'down') {
        if (a.t <= 0) { if (a.k === 'down') { u.poise = u.poiseMax * 0.6; u.stunImm = 0.8; } u.act = null; }
        return;
      }
      if (a.k === 'wind') {
        const t = unitOf(W, a.target);
        if (t && t.alive) u.fw = U.ang(t.x - u.x, t.y - u.y);
        if (a.t <= 0) release(W, u);
        return;
      }
      if (a.k === 'rec') { if (a.t <= 0) u.act = null; return; }
    }
    if (u.rep) {
      u.rep.t -= dt;
      steer(u, u.rep.x, u.rep.y, 0.8);
      if (u.rep.t <= 0 || U.dist(u, u.rep) < 0.25) u.rep = null;
      else return;
    }
    const o = u.order;
    const w = BG.WEAPONS[u.weapon];

    if (o.type === 'charge') { doCharge(W, u, o, dt); return; }

    if (defend) {
      if (o.type === 'move' || o.type === 'retreat') {
        const p = o.pts[0];
        if (!p) { finishOrder(u); return; }
        if (U.dist(u, p) < 0.35) { o.pts.shift(); if (!o.pts.length) finishOrder(u); return; }
        steer(u, p.x, p.y, 1, o.cap);
        return;
      }
      const t = o.type === 'attack' ? unitOf(W, o.target) : null;
      const near = (t && t.alive) ? t : pickTarget(W, u, w.ranged ? w.reach * 0.97 : w.reach + u.s.r + 0.6);
      if (near && engage(W, u, near, false)) return;
      threatFace(W, u);
      return;
    }

    switch (o.type) {
      case 'move': {
        if (!o.ignore) {
          const e = pickTarget(W, u, (w.ranged ? 1.2 : w.reach) + u.s.r + 0.8);
          if (e && !w.ranged && gapOf(u, e) <= w.reach * 0.95 + 0.1 && engage(W, u, e, false)) return;
        }
        const p = o.pts[0];
        if (!p) { finishOrder(u); return; }
        if (U.dist(u, p) < 0.35) { o.pts.shift(); if (!o.pts.length) finishOrder(u); return; }
        steer(u, p.x, p.y, 1, o.cap);
        return;
      }
      case 'retreat': {
        const p = o.pts[0];
        if (!p || U.dist(u, p) < 0.5) { finishOrder(u); return; }
        steer(u, p.x, p.y, 1.1);
        return;
      }
      case 'attack': {
        const t = unitOf(W, o.target);
        if (!t || !t.alive) { finishOrder(u); return; }
        engage(W, u, t, true);
        return;
      }
      case 'hold': {
        if (!o.pos) o.pos = { x: u.x, y: u.y };
        const e = pickTarget(W, u, w.ranged ? w.reach * 0.97 : w.reach + u.s.r + 0.5);
        if (e && engage(W, u, e, false)) return;
        if (U.dist(u, o.pos) > 0.5) { steer(u, o.pos.x, o.pos.y, 0.8); return; }
        const near = pickTarget(W, u, 12);
        if (near) u.fw = U.ang(near.x - u.x, near.y - u.y);
        return;
      }
      default: { // auto
        const e = pickTarget(W, u, 9);
        if (e && engage(W, u, e, true)) return;
      }
    }
  }

  // ---------- 투사체 ----------
  function stepProj(W, dt) {
    const keep = [];
    for (const p of W.projs) {
      const sx = p.x, sy = p.y;
      p.x += p.vx * dt; p.y += p.vy * dt; p.dist += Math.hypot(p.vx, p.vy) * dt;
      const dx = p.x - sx, dy = p.y - sy, L2 = dx * dx + dy * dy;
      let hit = null, ht = 2;
      for (const e of W.units) {
        if (!e.alive) continue;
        if (e.id === p.owner && p.dist < 1.5) continue;
        const t = U.clamp(((e.x - sx) * dx + (e.y - sy) * dy) / L2, 0, 1);
        const r = (isDown(e) ? e.s.r * 0.75 : e.s.r) + 0.15;
        if (Math.hypot(e.x - (sx + dx * t), e.y - (sy + dy * t)) <= r && t < ht) { ht = t; hit = e; }
      }
      if (hit) {
        const att = W.units[p.owner - 1];
        const ix = sx + dx * ht, iy = sy + dy * ht;
        resolveHit(W, att, hit, {
          kind: 'proj', dmg: p.dmg, poise: p.w.poise, stun: p.w.stun, kb: p.w.kb, pierce: p.w.pierce,
          from: Math.atan2(-p.vy, -p.vx)
        });
        if (p.w.aoe) {
          for (const e of W.units) {
            if (!e.alive || e === hit) continue;
            const d = Math.hypot(e.x - ix, e.y - iy);
            if (d <= p.w.aoe + e.s.r) {
              resolveHit(W, att, e, {
                kind: 'splash', dmg: p.dmg * 0.4, poise: 6, stun: 0, kb: 1.2, pierce: 0.5, noBlock: true,
                from: Math.atan2(iy - e.y, ix - e.x)
              });
            }
          }
        }
        continue;
      }
      if (p.dist <= p.max && p.x > -2 && p.x < C.MAP_W + 2 && p.y > -2 && p.y < C.MAP_H + 2) keep.push(p);
    }
    W.projs = keep;
  }

  // ---------- 이동 적분·충돌 ----------
  function integrate(W, dt) {
    const us = W.units;
    for (const u of us) {
      if (!u.alive) continue;
      const rate = 8 / Math.sqrt(u.s.mass);
      const df = U.angDiff(u.fw, u.f);
      u.f = U.angNorm(u.f + U.clamp(df, -rate * dt, rate * dt));
      const ax = u.wx - u.vx, ay = u.wy - u.vy, am = Math.hypot(ax, ay);
      const acc = 18 / Math.sqrt(u.s.mass) * dt;
      if (am > acc) { u.vx += ax / am * acc; u.vy += ay / am * acc; } else { u.vx = u.wx; u.vy = u.wy; }
      const kd = Math.exp(-5 * dt);
      u.kx *= kd; u.ky *= kd;
      if (Math.abs(u.kx) < 0.02) u.kx = 0;
      if (Math.abs(u.ky) < 0.02) u.ky = 0;
      u.x += (u.vx + u.kx) * dt; u.y += (u.vy + u.ky) * dt;
    }
    for (let it = 0; it < 3; it++) {
      for (let i = 0; i < us.length; i++) {
        const a = us[i];
        if (!a.alive) continue;
        for (let j = i + 1; j < us.length; j++) {
          const b = us[j];
          if (!b.alive) continue;
          const dx = b.x - a.x, dy = b.y - a.y, min = a.s.r + b.s.r;
          if (Math.abs(dx) > min || Math.abs(dy) > min) continue;
          const d = Math.hypot(dx, dy);
          if (d >= min) continue;
          const nx = d > 1e-4 ? dx / d : 1, ny = d > 1e-4 ? dy / d : 0;
          const ov = min - d;
          const ma = a.s.mass * (a.stance === 'defend' ? 1.8 : 1) * (isDown(a) ? 0.5 : 1) * (Math.hypot(a.wx, a.wy) < 0.1 ? 1.3 : 1);
          const mb = b.s.mass * (b.stance === 'defend' ? 1.8 : 1) * (isDown(b) ? 0.5 : 1) * (Math.hypot(b.wx, b.wy) < 0.1 ? 1.3 : 1);
          const fa = mb / (ma + mb), fb = ma / (ma + mb);
          a.x -= nx * ov * fa; a.y -= ny * ov * fa;
          b.x += nx * ov * fb; b.y += ny * ov * fb;
        }
      }
    }
    for (const u of us) {
      if (!u.alive) continue;
      u.x = U.clamp(u.x, u.s.r, C.MAP_W - u.s.r);
      u.y = U.clamp(u.y, u.s.r, C.MAP_H - u.s.r);
    }
  }

  // ---------- 한 틱 ----------
  sim.step = function (W) {
    if (W.phase !== 'run') return;
    const dt = C.DT;
    W.t += dt;
    W.tick = (W.tick || 0) + 1;
    // 처리 순서가 한쪽에 유리하지 않도록 매 틱 AI 순서를 번갈아 하고, 유닛 판단 순서는 시드 난수로 섞는다
    for (const side of (W.tick % 2 ? ['ally', 'enemy'] : ['enemy', 'ally'])) {
      const c = W.ctrl[side];
      if (!c) continue;
      W.aiAcc[side] += dt;
      if (W.aiAcc[side] >= C.AI_EVERY) { W.aiAcc[side] = 0; c.tick(W, side); }
    }
    BG.cmd.process(W);
    const order = W.units.filter(u => u.alive);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(W.rng.next() * (i + 1));
      const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    for (const u of order) if (u.alive) think(W, u, dt);
    stepProj(W, dt);
    integrate(W, dt);
    let na = 0, ne = 0;
    for (const u of W.units) if (u.alive) { if (u.side === 'ally') na++; else ne++; }
    if (!na || !ne || W.t >= C.MAX_T) {
      W.phase = 'end';
      W.result = { winner: !na && !ne ? 'draw' : (!na ? 'enemy' : (!ne ? 'ally' : 'draw')), t: U.r1(W.t) };
      BG.Log.add(W, 'end', { winner: W.result.winner });
    }
  };

  sim.alive = (W, side) => W.units.filter(u => u.alive && u.side === side);
  sim.helpers = { isRanged: isRanged, isDown: isDown, gapOf: gapOf, pickTarget: pickTarget, lineBlocker: lineBlocker };
})(typeof window !== 'undefined' ? window : globalThis);
