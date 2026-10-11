/* balance.js v1.0 — (v0.90) 초반 균형 (민수: 첫 전투에서 거의 병신이 되어 막힘 · 자동 플레이 점검 2026-10-11)
   점검 (봇 4판, v0.89 그대로): 1일째 인주 혼자 → 1층 첫 방 (적 3~4) 에서 뇌 치명상 · 전멸. 받은 피해의 8할이 붉은 망토 궁수.
   ■ 원정대 머릿수에 맞춰 적 수: 혼자 ×0.55 · 둘 ×0.8 · 셋 이상 그대로 (1 · 2층). 3층부터는 혼자 ×0.75 · 둘 ×0.9
   ■ 혼자면 적 공격 −15% (1 · 2층)
   ■ 1 · 2층 궁수: 쏘는 사이 1.6 → 2.4초 · 예고 0.5 → 0.75초 (비킬 틈)
   ■ 1층 회색 대지 (손으로 짠 층): 혼자면 순찰 검사 · 진지 방패병 · 궁수를 하나씩, 둘이면 진지 궁수 하나를 덜어냄
   ■ 전투식량: 쓰러뜨린 적이 12% (강적 40%) 로 빵 · 사과 · 고기 — 원정이 끼니를 벌어 오는 곳이 되게
   ■ 떠난 사이의 낙하: 그날 낙하 전에 원정을 떠나도, 돌아오면 떨어져 있던 것 (식량 · 보급 · 장비 · 가구 · 땔감) 이 창고에
   ■ 1층 = 시험하는 전사들 (CORE_LORE '1층 — 거대한 무덤'): 확인사살을 하지 않음 · 치명상은 덜 (maim.js · wounds.js 에서 EXP.F 를 봄) */
'use strict';
const BAL = { partyK: (n, F) => n <= 1 ? (F <= 2 ? 0.55 : 0.75) : n === 2 ? (F <= 2 ? 0.8 : 0.9) : 1 };
const balParty = () => (typeof RPG !== 'undefined' && RPG.party ? RPG.party.length : 1) + ((typeof EXP !== 'undefined' && EXP && EXP.captives) ? EXP.captives.filter(c => c.kind !== '포로').length : 0);
{ const _sg = spawnGroup; spawnGroup = function(r, gen, tiles, n, band){ const k = BAL.partyK(balParty(), gen.F || 1); return _sg.call(this, r, gen, tiles, Math.max(1, Math.round(n * k)), band); }; }
{ const _sf = spawnFoe; spawnFoe = function(kind, x, z, F, band, elite){
    const e = _sf.apply(this, arguments);
    if (F <= 2 && balParty() <= 1) e.atk = Math.round(e.atk * 0.85);
    if (F <= 2 && e.D.bow) e.D = { ...e.D, bow: { ...e.D.bow, cd: Math.max(e.D.bow.cd, 2.4), windup: Math.max(e.D.bow.windup, 0.75) } };
    return e;
  }; }
// 1층 회색 대지 (손으로 짠 층 — spawnGroup 을 안 거침): 적은 원정대면 무리를 덜어냄. 혼자: 순찰 검사 하나 · 진지의 방패병 하나 · 궁수 하나 뺌 / 둘: 진지 궁수 하나 뺌
{ const _elfB = expLoadFloor; expLoadFloor = async function(F){
    const r = await _elfB.apply(this, arguments);
    try {
      if (EXP && EXP.F === 1 && !EXP.balTrim){
        const n = balParty(), drop = (band, kind) => { const e = G.units.filter(u => u.side === 'enemy' && !u.dead && u.band === band && u.kind === kind).pop(); if (e) removeUnit(e); };
        if (n <= 1){ drop('g1', 'swordsman'); drop('g2', 'shieldman'); drop('g2', 'archer'); }
        else if (n === 2) drop('g2', 'archer');
      }
    } catch (e) {}
    return r;
  }; }
// 전투식량: 원정에서 쓰러뜨린 적이 가끔 먹을 것을 떨어뜨림 (12%, 강적 40%) — 끼니가 원정의 입장권인데 원정에서 식량이 거의 안 나왔음 (전리품의 3%)
{ const _kB = kill; kill = function(u, by){
    const was = u && (u.dead || u.downed); const r = _kB.apply(this, arguments);
    try { if (!was && u && u.side === 'enemy' && G.mode === 'exp' && !u.D.summon && !u.D.dummy && !u.D.boss && Math.random() < (u.elite ? 0.4 : 0.12)) dropLootAt(u.x, u.z, ['I-050', 'I-050', 'I-053', 'I-043'][Math.floor(Math.random() * 4)]); } catch (e) {}
    return r; }; }
// 떠난 사이의 낙하: 그날 낙하 (굴에 30초 있으면 떨어짐) 전에 원정을 떠나면 낙하가 아예 없었음 → 돌아오면 떨어져 있던 것 중 식량 · 보급 · 장비 · 가구는 창고에, 땔감은 장작에 (가축 · 쓰레기는 사라짐)
{ const _e2cB = expToCave; expToCave = function(sum){
    try {
      if (typeof PRO !== 'undefined' && PRO.dropDay !== PRO.day && typeof rollDrops === 'function'){
        const picks = rollDrops(); let n = 0;
        for (const d of picks){ if (d.type === 'live' || d.toilet || (d.type === 'junk' && !d.wood)) continue; if (d.wood){ PRO.wood = Math.min(WOOD_MAX, (PRO.wood || 0) + d.wood); continue; } PRO.store.push({ ...d }); n++; }
        PRO.dropDay = PRO.day; if (n) setTimeout(() => G.mode === 'cave' && caption('떠난 사이 낙하가 있었다', `창고에 ${n}개`), 3600);
      }
    } catch (e) {}
    return _e2cB.apply(this, arguments);
  }; }
