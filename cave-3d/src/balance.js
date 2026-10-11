/* balance.js v1.1 — (v1.1, v0.91: 민수 — '1층의 난이도는 그대로 괜찮아. 어렵고 잘 죽어야해' → 난이도를 낮추던 것 (머릿수에 맞춘 적 수 · 혼자 적 공격 −15% · 1 · 2층 궁수 느리게 · 1층 진지 덜어냄 · 1층 확인사살 없음) 을 모두 뺌. 끼니 · 낙하 쪽만 남김)
   (v1.0, v0.90) 초반 균형 (자동 플레이 점검 2026-10-11 · PLAYTEST_2026-10-11.md)
   ■ 전투식량: 쓰러뜨린 적이 12% (강적 40%) 로 빵 · 사과 · 고기 — 원정이 끼니를 벌어 오는 곳이 되게
   ■ 떠난 사이의 낙하: 그날 낙하 전에 원정을 떠나도, 돌아오면 떨어져 있던 것 (식량 · 보급 · 장비 · 가구 · 땔감) 이 창고에 */
'use strict';
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
