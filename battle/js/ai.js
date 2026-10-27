/* 굴 전투판 v1 · ai: 지휘관 AI. 플레이어와 같은 명령 API·지휘망(별·분대장·전달 실패)을 그대로 쓴다.
 * 전술: 전열 진형 전진 → 접촉 시 집중 사격·집중 타격, 기동대 측면 우회 후 사수/지휘관 노리기,
 *       사수 사선 확보·거리 유지, 돌격 방어 태세, 부상자·탈진자 이탈.
 */
(function (root) {
  'use strict';
  const BG = root.BG, U = BG.U, C = BG.C, cmd = BG.cmd, H = BG.sim.helpers;
  const AI = BG.AI = {};

  const other = s => s === 'ally' ? 'enemy' : 'ally';
  const cen = list => {
    let x = 0, y = 0;
    list.forEach(u => { x += u.x; y += u.y; });
    return { x: x / list.length, y: y / list.length };
  };
  const hpf = u => u.hp / u.s.hp;
  const rangedU = u => u.weapon === 'cannon';
  const roleOf = u => rangedU(u) ? 'fire' : (u.shape === 'triangle' ? 'strike' : 'line');

  AI.create = function (opts) {
    opts = opts || {};
    const mem = { last: {}, sq: {}, flank: 0, ready: false };
    const ctl = { mem: mem };

    function sameOrder(o, d) {
      if (o.type !== d.type) return false;
      if (d.type === 'attack' || d.type === 'charge') return o.target === d.target;
      if (d.type === 'move' || d.type === 'retreat') {
        const p = o.pts && o.pts[o.pts.length - 1], q = d.pts[d.pts.length - 1];
        return !!p && !!q && Math.hypot(p.x - q.x, p.y - q.y) < 1.5;
      }
      return false;
    }
    function give(W, side, u, order, key, minGap) {
      if (!u.alive || sameOrder(u.order, order)) return;
      const l = mem.last[u.id];
      if (l && W.t - l.t < (l.key === key ? 2.5 : (minGap || 0.8))) return;
      mem.last[u.id] = { t: W.t, key: key };
      cmd.issue(W, side, [u.id], order);
    }
    function bonus(W, e) {
      let b = 0;
      if (H.isDown(e)) b += 3;
      if (rangedU(e)) b += 2.5;
      b += (1 - hpf(e)) * 2.5;
      if (cmd.isMain(W, e)) b += 2;
      return b;
    }
    function pickFoe(W, u, foes, maxD) {
      let best = null, bs = 1e9;
      for (const e of foes) {
        const d = U.dist(u, e);
        if (d > maxD) continue;
        const sc = d - bonus(W, e);
        if (sc < bs) { bs = sc; best = e; }
      }
      return best;
    }

    ctl.setup = function (W, side) {
      const me = W.units.filter(u => u.side === side && u.alive);
      // 총지휘관: 지휘 스탯 최상. 단 최전열 방어병은 가급적 피한다.
      const cand = me.filter(u => u.shape !== 'square');
      const M = cmd.bestByCmd(cand.length ? cand : me);
      if (M) cmd.setMain(W, side, M.id, 'AI 임명');
      const groups = { line: [], strike: [], fire: [] };
      me.forEach(u => groups[roleOf(u)].push(u));
      ['line', 'strike', 'fire'].forEach(g => {
        if (groups[g].length >= 2) {
          let leader = null;
          if (g === 'line') leader = groups.line.slice().sort((a, b) => (b.hp * (1 + b.s.def / 10)) - (a.hp * (1 + a.s.def / 10)))[0];
          const sq = cmd.makeSquad(W, side, groups[g].map(u => u.id), leader ? leader.id : null);
          if (sq) mem.sq[g] = sq.id;
        }
      });
      mem.ready = true;
    };

    ctl.tick = function (W, side) {
      if (W.phase !== 'run') return;
      const me = BG.sim.alive(W, side), foes = BG.sim.alive(W, other(side));
      if (!me.length || !foes.length) return;
      const net = W.net[side];
      if (!net.main) return;
      const f = side === 'ally' ? 1 : -1;
      const foeC = cen(foes), myC = cen(me);
      const nrm = { x: 0, y: 1 };
      const line = me.filter(u => roleOf(u) === 'line');
      const strike = me.filter(u => roleOf(u) === 'strike');
      const fire = me.filter(u => roleOf(u) === 'fire');
      const lineC = line.length ? cen(line) : myC;
      const foeMelee = foes.filter(e => !rangedU(e));
      let contact = 99;
      (line.length ? line : me).forEach(u => foes.forEach(e => { contact = Math.min(contact, H.gapOf(u, e)); }));
      const engaged = contact < 6;
      if (!mem.flank) mem.flank = foeC.y < C.MAP_H / 2 ? 1 : -1;
      const mapX = x => U.clamp(x, 1.5, C.MAP_W - 1.5), mapY = y => U.clamp(y, 1.5, C.MAP_H - 1.5);

      // 교착 방지: 25초 동안 아무도 피해를 주지 못하면 전원이 가장 가까운 적을 쫓는다
      let dsum = 0;
      W.units.forEach(u => { dsum += u.dealt; });
      if (Math.abs(dsum - (mem.dsum || 0)) > 0.01) { mem.dsum = dsum; mem.dT = W.t; }
      if (W.t - (mem.dT || 0) > 25) {
        me.forEach(u => {
          const t = foes.slice().sort((a, b) => U.dist(a, u) - U.dist(b, u))[0];
          give(W, side, u, cmd.O.attack(t.id), 'rush' + t.id, 1.5);
        });
        return;
      }

      // 집중 목표(사수 우선·부상·쓰러짐)
      const focus = foes.slice().sort((a, b) => (bonus(W, b) - U.dist(b, myC) * 0.12) - (bonus(W, a) - U.dist(a, myC) * 0.12))[0];

      // ----- 전열 -----
      if (line.length) {
        if (!engaged && contact > 11) {
          // 진형 전진: 분대가 있으면 진형 이동, 없으면 각자 전진
          const dirx = foeC.x - lineC.x, diry = foeC.y - lineC.y, dl = Math.hypot(dirx, diry) || 1;
          const step = Math.min(9, Math.max(3, contact - 9));
          const P = { x: mapX(lineC.x + dirx / dl * step), y: mapY(lineC.y + diry / dl * step * 0.6) };
          const sid = mem.sq.line, sq = sid && net.squads.find(s => s.id === sid);
          if (sq && sq.members.length >= 2) {
            const key = Math.round(P.x / 3) + ',' + Math.round(P.y / 3);
            const lm = mem.last['sq' + sid];
            if (!lm || (lm.key !== key && W.t - lm.t > 1.5) || W.t - lm.t > 4) {
              mem.last['sq' + sid] = { t: W.t, key: key };
              cmd.formMove(W, side, sid, P, {});
            }
          } else {
            line.forEach(u => give(W, side, u, cmd.O.move([P]), 'adv', 1.5));
          }
        } else {
          line.forEach(u => {
            // 부상·탈진 → 이탈
            const exhausted = u.stam < u.s.stam * 0.1;
            if ((hpf(u) < 0.25 || exhausted) && me.length > 1 && contact < 3.5) {
              const P = { x: mapX(u.x - f * 7), y: mapY(u.y + (u.y < C.MAP_H / 2 ? 3 : -3)) };
              give(W, side, u, cmd.O.retreat(P), 'ret', 2.5);
              return;
            }
            // 돌격 방어 태세
            const threat = foes.some(e => e.order && e.order.type === 'charge' && U.dist(e, u) < 11);
            const wantDef = u.shield && threat;
            if (wantDef !== (u.stance === 'defend')) {
              if (!mem.last['st' + u.id] || W.t - mem.last['st' + u.id] > 1.2) {
                mem.last['st' + u.id] = W.t;
                cmd.issue(W, side, [u.id], cmd.O.stance(wantDef ? 'defend' : 'normal'));
              }
            }
            const reserve = hpf(u) < 0.25 && me.length > 2;
            const t = pickFoe(W, u, foes, reserve ? 5 : 16);
            if (!t) return;
            // 창·돌진: 방비 안 된 연약한 상대에게 돌격
            if (u.weapon === 'spear' && u.chargeCd <= 0 && u.stam > u.s.stam * 0.65 && !wantDef) {
              const d = U.dist(u, t);
              const braced = t.stance === 'defend' || (t.shape === 'square' && t.shield);
              if (d > 4 && d < 11 && !braced) { give(W, side, u, cmd.O.charge(t.id), 'ch', 3); return; }
            }
            give(W, side, u, cmd.O.attack(t.id), 'a' + t.id, 1.2);
          });
        }
      }

      // ----- 기동대: 측면 우회 후 타격 -----
      strike.forEach(u => {
        const exhausted = u.stam < u.s.stam * 0.1;
        if ((hpf(u) < 0.22 || exhausted) && contact < 4) {
          give(W, side, u, cmd.O.retreat({ x: mapX(u.x - f * 8), y: mapY(u.y) }), 'ret', 2.5);
          return;
        }
        const prey = foes.slice().sort((a, b) => (bonus(W, b) * 1.4 - U.dist(b, u) * 0.2) - (bonus(W, a) * 1.4 - U.dist(a, u) * 0.2))[0];
        const hasFront = line.length > 0;
        if (hasFront && !engaged && contact > 11) {
          // 전열이 접촉하기 전까지 측면에서 대기
          const P = { x: mapX(lineC.x - f * 1 + 0), y: mapY(lineC.y + mem.flank * 9) };
          give(W, side, u, cmd.O.move([P]), 'stage', 1.5);
          return;
        }
        const dprey = U.dist(u, prey);
        const aroundY = mapY(foeC.y + mem.flank * (6 + foes.length * 0.9 + 6));
        const behindX = mapX(foeC.x + f * 5);
        const near = dprey < 11;
        if (near && u.chargeCd <= 0 && u.stam > u.s.stam * 0.5 && !(prey.stance === 'defend' && prey.shield)) {
          give(W, side, u, cmd.O.charge(prey.id), 'ch', 2.5);
        } else if (dprey < 4.5) {
          give(W, side, u, cmd.O.attack(prey.id), 'a' + prey.id, 1.2);
        } else {
          // 우회: 전열 밖 → 적 후방
          const viaSide = Math.abs(u.y - foeC.y) < 9 && (u.x - foeC.x) * f < 3;
          const pts = viaSide ? [{ x: mapX(foeC.x - f * 2), y: aroundY }, { x: behindX, y: mapY(prey.y) }] : [{ x: behindX, y: mapY(prey.y) }];
          const key = 'fl' + prey.id + Math.round(u.y / 6);
          give(W, side, u, cmd.O.move(pts), key, 1.5);
        }
      });

      // ----- 사수: 사선 확보, 거리 유지 -----
      fire.forEach(u => {
        const w = BG.WEAPONS[u.weapon];
        const nearFoe = foes.reduce((m, e) => Math.min(m, U.dist(u, e)), 99);
        if (nearFoe < 4.2) {
          // 맞붙기 전에 물러난다 (뒤가 막히면 옆으로)
          const near = foes.slice().sort((a, b) => U.dist(a, u) - U.dist(b, u))[0];
          let dx = u.x - near.x, dy = u.y - near.y;
          const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
          let P = { x: u.x + dx * 6, y: u.y + dy * 6 };
          if (P.x < 3 || P.x > C.MAP_W - 3) P = { x: u.x, y: u.y + (u.y < C.MAP_H / 2 ? 6 : -6) * (dy >= 0 ? 1 : -1) };
          P.x = mapX(P.x); P.y = mapY(P.y);
          // 이미 궁지면 맞싸운다
          if (U.dist(u, P) < 2.5) { give(W, side, u, cmd.O.attack(near.id), 'a' + near.id, 1); return; }
          give(W, side, u, cmd.O.retreat(P), 'kite', 1.2);
          return;
        }
        // 목표: 집중 목표 우선, 사거리·오사 위험 점검
        let best = null, bs = -1e9;
        for (const e of foes) {
          const d = U.dist(u, e);
          if (d > w.reach * 0.95) continue;
          let sc = bonus(W, e) - d * 0.1;
          if (e === focus) sc += 1.5;
          for (const a of me) if (a !== u && Math.hypot(a.x - e.x, a.y - e.y) < (w.aoe || 0) + a.s.r + 0.4) sc -= 8;
          if (sc > bs) { bs = sc; best = e; }
        }
        if (best && bs > -5) {
          give(W, side, u, cmd.O.attack(best.id), 'a' + best.id, 1);
        } else {
          let P;
          if (line.length) P = { x: mapX(lineC.x - f * 3.5), y: mapY(u.y * 0.5 + lineC.y * 0.5) };
          else {
            const nf = foes.slice().sort((a, b) => U.dist(a, u) - U.dist(b, u))[0];
            const dd = U.dist(u, nf) || 1, st = Math.min(8, Math.max(2, dd - w.reach * 0.8));
            P = { x: mapX(u.x + (nf.x - u.x) / dd * st), y: mapY(u.y + (nf.y - u.y) / dd * st) };
          }
          give(W, side, u, cmd.O.move([P]), 'fstage', 1.5);
        }
      });
    };
    return ctl;
  };

  // 비교용 기준 AI: 아무 명령 없이 제자리 사수 / 전원 자율 돌진
  AI.createPassive = () => ({ setup: function () { }, tick: function () { } });
  AI.createRush = () => ({
    setup: function () { },
    tick: function (W, side) {
      BG.sim.alive(W, side).forEach(u => {
        if (u.order.type !== 'auto') { u.order = { type: 'auto' }; }
      });
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
