const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width:412, height:915, mob:true, tag:'m' }, { width:1366, height:860, tag:'d' }]){
    const ctx = await b.newContext({ viewport:{ width:vp.width, height:vp.height }, isMobile:!!vp.mob, hasTouch:!!vp.mob, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
    await p.evaluate(async () => {
      await boardAdd(cardFrom({ kind:'table', title:'이번 주 할 일', columns:['일','담당'], rows:[['수신기 연결','민수'],['이그잼 자료','조교']] }, 'sehee'), false);
      O.log.push({ who:'u', text:'오늘 톡 정리해줘', at:Date.now() - 5000 });
      O.log.push({ who:'s', text:'오늘 흐름은 수신기 문제부터 시작했어요. 결국 호스트에서 수신기를 노트북에 직접 연결하는 방식으로 정리된 것입니다. 남은 일로는 천재 이 2학년 이그잼 자료가 내일까지, 유은찬 요일 변경 대응이 있습니다.\n\n참고로 개인 대화는 업무와 무관해서 뺐습니다. https://example.com/a/very/long/url/that/should/not/cause/horizontal/scrolling/at/all/ever', face:3, at:Date.now() });
      await dwOpen('board');
    });
    await p.waitForTimeout(700);
    await p.screenshot({ path:`v123-${vp.tag}.png` });
    const sc = await p.evaluate(() => { const e = $('btBub'); return [e.scrollWidth, e.clientWidth]; });
    console.log(vp.tag, 'bub scrollW/clientW', sc, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
