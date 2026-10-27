/* 캠페인(런): 보유 동료 · 단계 · 승리 보상(랜덤 동료) · 영구 손실 · 성장 · 전리품 창고.
 *  - 시작: 보병1 · 보병2 · 탱커1 · 사수1.  승리하면 병종 · 체급 · 무기 · 특성 · 의무 여부가 모두 랜덤인 동료가 1명 합류 (최대 20).
 *  - 쓰러진 동료는 영구 손실. 아군이 전멸하면 런 종료 → 새 런.
 *  - 적도 같은 설계 규칙으로 만든다 (인원은 보유 인원에 비례, 단계가 오를수록 강해짐). 판 안의 모든 싸움 규칙은 원본 엔진이 정한다. */
GB.Campaign = (function () {
  const MAX_ROSTER = 20, MAX_ENEMY = 20;

  function create(seed) {
    seed = (seed >>> 0) || (Date.now() >>> 0);
    return {
      v: GB.VERSION, id: 'r' + seed.toString(36), seed: seed, stage: 1, battleNo: 0, totalWins: 0, best: 1, over: false,
      roster: GB.startRoster(seed), stash: [], history: [], nextUid: 1
    };
  }
  const enemyRatio = run => GB.clamp(GB.TUNE.enemyRatio0 + GB.TUNE.enemyRatioUp * (run.stage - 1), 0.2, GB.TUNE.enemyRatioMax);
  const enemyCount = run => GB.clamp(Math.round(run.roster.length * enemyRatio(run)), Math.min(3, run.roster.length), MAX_ENEMY);
  const battleSeed = run => ((run.seed ^ Math.imul(run.stage, 2654435761) ^ Math.imul(run.battleNo + 1, 40503)) >>> 0) || 1;

  // 적 편성: 아군 보상과 같은 무작위 설계(genDesign) — 병종 · 체급 · 무기 · 방패 · 갑옷 · 특성 · 의무가 모두 랜덤이고,
  // 능력 배율 같은 특혜는 없다. 단계가 오르면 아군 신규 동료와 같은 식(power)으로 강해지고, 수만 아군보다 늘어난다.
  function enemyDesigns(run) {
    const rng = GB.rng(battleSeed(run) ^ 0x9e3779b9), n = enemyCount(run), power = GB.TUNE.powerAt(run.stage);
    const list = [];
    for (let i = 0; i < n; i++) {
      const p = GB.genDesign(rng, { power: power, medicChance: 0.12, uid: 'e' + run.stage + '_' + i });
      p.name = '적' + (i + 1);
      list.push(p);
    }
    return list;
  }

  function makeBattle(run) {
    const allies = GB.clone(run.roster), enemies = enemyDesigns(run);
    const map = GB.mapFor(Math.max(allies.length, enemies.length));
    GB.deploy(allies, 0, map); GB.deploy(enemies, 1, map);
    const B = new GB.Battle({ allies: allies, enemies: enemies, seed: battleSeed(run), name: '단계 ' + run.stage });
    B.run = run; B.stage = run.stage;
    return B;
  }

  function uniqueName(run, rng) {
    const used = {}; run.roster.forEach(p => { used[p.name] = 1; });
    for (let i = 0; i < 40; i++) { const n = rng.pick(GB.NAME_POOL); if (!used[n]) return n; }
    return '신병' + (run.roster.length + 1);
  }

  // 판이 끝났을 때: 보유 동료 · 창고 · 단계를 갱신하고 요약을 돌려줌
  function finish(run, B) {
    const W = B.W, rules = B.rules, res = B.result;
    const out = { outcome: res === 'win' ? 'win' : res === 'lose' ? 'lose' : res === 'retreat' ? 'retreat' : 'draw', lost: [], grown: [], reward: null, rewards: [], loot: 0, over: false, kills: 0 };
    run.battleNo++;
    const stats = GB.Growth.stats(W), byPid = {};
    W.units.forEach(u => { if (u.side === 0) byPid[u.pid] = u; });
    const setupBy = {}; B.setup.units.forEach(q => { if (q.side === 0) setupBy[q.id] = q; });
    run.roster = run.roster.filter(p => {
      const u = byPid[p.uid];
      if (u && !u.alive && !u.gone) { out.lost.push({ uid: p.uid, name: p.name }); return false; }
      return true;
    });
    for (const p of run.roster) {
      const u = byPid[p.uid], st = stats[p.uid]; p.battles = (p.battles || 0) + 1;
      if (!u) continue;
      p.kills = (p.kills || 0) + (u.kills || 0); out.kills += u.kills || 0;
      const q = setupBy[p.uid]; if (q) { p.cg = q.cg || ''; p.chiefNm = q.chiefNm || ''; p.chiefMode = q.chiefMode || ''; }
      if (st && out.outcome === 'win') { p.wins = (p.wins || 0) + 1; const g = GB.Growth.apply(p, st, rules); if (g.length) out.grown.push({ uid: p.uid, name: p.name, what: g }); }
    }
    if (out.outcome === 'win' || out.outcome === 'draw') { const items = GB.Loot.collect(W); out.loot = items.length; run.stash = run.stash.concat(items).slice(-120); }
    if (out.outcome === 'win') {
      run.totalWins++;
      // 보상: 승리하면 1명, 한 명도 잃지 않았으면(완승) 보너스 인원. 병종 · 체급 · 무기 · 특성 · 의무 여부는 모두 랜덤
      const n = 1 + (!out.lost.length ? GB.TUNE.flawlessBonus : 0);
      for (let k = 0; k < n && run.roster.length < MAX_ROSTER; k++) {
        const rng = GB.rng((run.seed ^ Math.imul(run.stage + 11, 1597334677) ^ Math.imul(run.battleNo * 7 + k, 3266489917)) >>> 0);
        const p = GB.genDesign(rng, { power: GB.TUNE.powerAt(run.stage), uid: 'u' + run.seed.toString(36) + '_' + run.battleNo + (k ? 'b' + k : '') });
        p.name = uniqueName(run, rng); run.roster.push(p); out.rewards.push(p);
      }
      out.reward = out.rewards[0] || null;
      run.stage++; run.best = Math.max(run.best, run.stage);
    }
    if (out.outcome === 'lose' || !run.roster.length) { run.over = true; out.over = true; }
    run.history.push({ stage: B.stage, outcome: out.outcome, t: +W.t.toFixed(1), lost: out.lost.length });
    if (run.history.length > 60) run.history.shift();
    return out;
  }
  return { create: create, makeBattle: makeBattle, finish: finish, enemyDesigns: enemyDesigns, MAX_ROSTER: MAX_ROSTER };
})();
