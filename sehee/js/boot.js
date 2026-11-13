/* ── 시작 ── */
(async function boot(){
  try{
    await syncStart();
    spStep('저장소 여는 중');
    const st = await kvGet('settings');
    S.settings = Object.assign({ sections:DEFAULT_SECTIONS.map(s => ({ ...s })), fs:1, openOnly:false }, st || {});
    if (!st) await saveSettings();
    applyFs();
    spStep('세희 머리 설정 읽는 중');
    await loadAi(); AI.usage = (await kvGet('usage')) || {}; refreshBrain();
    spStep('판 불러오는 중');
    S.dates = (await allDates()).sort();
    await goDate(S.today);
    spStep(`판 ${S.dates.length}개 · 사무실 그림 거는 중`);
    await Promise.race([preloadArt((n, t) => spStep(`판 ${S.dates.length}개 · 사무실 그림 거는 중 ${n}/${t}`)), tickMs(4000)]);
    spStep('세희 머리 확인 중');
    const brain = await pingBrain();
    spStep(brain);

    /* 공유하기로 들어온 것 — 예전 방식(주소에 글이 붙어 옴)과 새 방식(일꾼이 받아 둠) 둘 다 */
    const q = new URLSearchParams(location.search);
    const title = (q.get('title') || '').trim(), text = (q.get('text') || '').trim(), url = (q.get('url') || '').trim();
    let got = text;
    if (title && !text.includes(title)) got = title + (got ? '\n' + got : '');
    if (url && !got.includes(url)) got = got ? got + '\n' + url : url;
    if (q.has('share') || q.has('shared') || got){
      history.replaceState(null, '', location.pathname + location.hash);
      if (got) await receive([got]);
      if (q.has('shared')){ spStep('공유받은 것 꺼내는 중'); await takeShared(); }
    }
    showView(hashView());
    loadBonus();
    spStep('준비 끝 · ' + brain);
    setTimeout(() => resumeJob().catch(() => {}), 1200);
  }catch(e){
    SP.hold = 1500; spStep('여는 중 문제가 생겼어요: ' + (e && e.message || e));
  }finally{ spDone(); }
})();
