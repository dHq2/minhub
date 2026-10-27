/* 굴 전투판 v1 · run: 런(캠페인) 진행 — 보유 유닛, 단계, 승리 보상(랜덤 유닛), 영구 손실, 계급·승급 강화 */
(function (root) {
  'use strict';
  const BG = root.BG, U = BG.U;
  const Run = BG.Run = {};
  const MAX_ROSTER = 12;

  Run.create = function (seed) {
    seed = (seed >>> 0) || (Date.now() >>> 0);
    BG.setUidCounter(1);
    const rng = new BG.Rng(seed);
    const run = {
      v: BG.VERSION, id: 'r' + seed.toString(36), seed: seed, stage: 1, battleNo: 0, totalWins: 0,
      roster: BG.startRoster(rng), pending: [], over: false, best: 1, nextUid: 0, history: []
    };
    run.nextUid = BG._uid;
    return run;
  };

  Run.enemyCount = run => run.roster.length + (run.stage >= 5 ? 1 : 0) + (run.stage >= 10 ? 1 : 0);

  Run.world = function (run) {
    BG.setUidCounter(run.nextUid);
    const seed = (run.seed ^ Math.imul(run.stage, 2654435761) ^ Math.imul(run.battleNo + 1, 40503)) >>> 0;
    const rng = new BG.Rng(seed ^ 0x9e3779b9);
    const enemy = BG.genEnemies(rng, Run.enemyCount(run), run.stage);
    run.nextUid = BG._uid;
    const ally = JSON.parse(JSON.stringify(run.roster));
    const W = BG.sim.create({ seed: seed, stage: run.stage, ally: ally, enemy: enemy });
    W.runId = run.id;
    return W;
  };

  const STAT_OPTS = [
    { stat: 'hp', v: 14, label: '체력 +14' }, { stat: 'atk', v: 6, label: '공격력 +6%' }, { stat: 'def', v: 1, label: '방어 +1' },
    { stat: 'spd', v: 0.3, label: '기동 +0.3' }, { stat: 'blk', v: 10, label: '막기 +10' }, { stat: 'stam', v: 12, label: '스태미나 +12' },
    { stat: 'shoot', v: 10, label: '사격 +10' }, { stat: 'cmd', v: 8, label: '지휘 +8' }
  ];
  const WEAPON_KEYS = ['fist', 'mace', 'sword', 'spear', 'cannon'];

  function makeOptions(run, unit) {
    const rng = new BG.Rng((run.seed ^ (unit.wins * 7919) ^ parseInt(unit.uid.slice(1), 10) * 104729) >>> 0);
    const opts = [];
    const pool = [];
    STAT_OPTS.forEach(o => { pool.push({ k: 'stat', stat: o.stat, v: o.v, label: o.label }, { k: 'stat', stat: o.stat, v: o.v, label: o.label }); });
    const shapes = Object.keys(BG.SHAPES).filter(s => s !== unit.shape);
    const ns = rng.pick(shapes);
    pool.push({ k: 'class', shape: ns, label: '전직: ' + BG.SHAPES[ns].icon + BG.SHAPES[ns].name + ' (스탯 보정 유지)' });
    const nw = rng.pick(WEAPON_KEYS.filter(w => w !== unit.weapon));
    const sh = nw !== 'cannon' && rng.chance(0.5);
    pool.push({ k: 'arms', weapon: nw, shield: sh, label: '재무장: ' + BG.WEAPONS[nw].name + (sh ? ' + 방패' : '') });
    while (opts.length < 3 && pool.length) {
      const o = pool.splice(Math.floor(rng.next() * pool.length), 1)[0];
      if (!opts.some(x => x.label === o.label)) opts.push(o);
    }
    return opts;
  }

  Run.applyUpgrade = function (run, uid, opt) {
    const u = run.roster.find(r => r.uid === uid);
    if (u) {
      if (opt.k === 'stat') u.dev[opt.stat] = U.r2((u.dev[opt.stat] || 0) + opt.v);
      else if (opt.k === 'class') u.shape = opt.shape;
      else if (opt.k === 'arms') { u.weapon = opt.weapon; u.shield = opt.shield; }
    }
    run.pending = run.pending.filter(p => p.uid !== uid);
  };

  function uniqueName(run, rng) {
    const used = {};
    run.roster.forEach(u => { used[u.name] = 1; });
    for (let i = 0; i < 20; i++) {
      const u = BG.genUnit(rng, 0);
      if (!used[u.name]) return u.name;
    }
    return '신병' + (run.roster.length + 1);
  }

  // 전투 종료 처리. 반환: {outcome, lost, promoted, reward, over}
  Run.finish = function (run, W) {
    const res = { outcome: W.result.winner === 'ally' ? 'win' : (W.result.winner === 'enemy' ? 'lose' : 'draw'), lost: [], promoted: [], reward: null, over: false, kills: 0 };
    run.battleNo++;
    const survivors = [];
    const killsByUid = {};
    W.units.forEach(u => { if (u.side === 'ally') killsByUid[u.uid] = u.kills; });
    run.roster = run.roster.filter(d => {
      const u = W.units.find(x => x.side === 'ally' && x.uid === d.uid);
      if (u && !u.alive) { res.lost.push({ uid: d.uid, name: d.name }); return false; }
      return true;
    });
    run.roster.forEach(d => { d.battles = (d.battles || 0) + 1; d.kills = (d.kills || 0) + (killsByUid[d.uid] || 0); res.kills += killsByUid[d.uid] || 0; });
    if (res.outcome === 'win') {
      run.totalWins++;
      run.roster.forEach(d => {
        const before = BG.rankIdx(d.wins || 0);
        d.wins = (d.wins || 0) + 1;
        const after = BG.rankIdx(d.wins);
        if (after > before) {
          const opts = makeOptions(run, d);
          run.pending.push({ uid: d.uid, from: BG.RANKS[before].name, to: BG.RANKS[after].name, options: opts });
          res.promoted.push({ uid: d.uid, name: d.name, to: BG.RANKS[after].name });
        }
      });
      // 보상: 랜덤 유닛 1명
      const rng = new BG.Rng((run.seed ^ Math.imul(run.stage + 11, 1597334677) ^ Math.imul(run.battleNo, 3266489917)) >>> 0);
      BG.setUidCounter(run.nextUid);
      if (run.roster.length < MAX_ROSTER) {
        const nu = BG.genUnit(rng, run.stage * 0.7);
        nu.name = uniqueName(run, rng);
        run.roster.push(nu);
        res.reward = nu;
      }
      run.nextUid = BG._uid;
      run.stage++;
      run.best = Math.max(run.best, run.stage);
    } else if (res.outcome === 'lose' || !run.roster.length) {
      run.over = true;
      res.over = true;
    }
    if (!run.roster.length) { run.over = true; res.over = true; }
    run.history.push({ stage: W.stage, outcome: res.outcome, t: W.result.t, lost: res.lost.length, logId: W.log.id });
    if (run.history.length > 60) run.history.shift();
    return res;
  };
})(typeof window !== 'undefined' ? window : globalThis);
