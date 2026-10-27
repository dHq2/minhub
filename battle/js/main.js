/* 굴 전투판 v1 · main: 부팅 (저장된 런을 불러오거나 새로 시작) */
(function (root) {
  'use strict';
  const BG = root.BG;
  let run = BG.Log.loadRun();
  if (!run) { run = BG.Run.create(); BG.Log.saveRun(run); }
  BG.setUidCounter(run.nextUid || 1);
  BG.UI.init(run);
  if (!root.localStorage || !root.localStorage.getItem('minhub.battle.v1.seenHelp')) {
    try { root.localStorage.setItem('minhub.battle.v1.seenHelp', '1'); } catch (e) { /* noop */ }
    BG.UI.showHelp();
  }
})(window);
