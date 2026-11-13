const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const errs = [];
  for (const [vp, mob, tag] of [[{ width:412, height:915 }, true, 'm'], [{ width:1366, height:860 }, false, 'd']]){
    const ctx = await b.newContext({ viewport:vp, isMobile:mob, hasTouch:mob, serviceWorkers:'block' }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2000);
    await p.evaluate(() => { O.log.push({ who:'u', text:'판다 볼펜 찾아줘', at:Date.now() - 60000 }, { who:'s', text:'모나미 153 볼펜을 말씀하신 것 같아요. 푸바오 153 볼펜 세트는 대나무 디자인과 푸바오 캐릭터가 들어간 5색 153 볼펜으로, 소비자 가격이 6천 원이었어요. 판다 볼펜이 이 푸바오 제품을 말씀하신 거라면 맞을 수도 있고, 아니라면 다른 모델일 수 있습니다. 어느 쪽인지 알려 주시면 더 좁혀 찾아보겠습니다.', face:3, at:Date.now() }); renderLog(); });
    await p.waitForTimeout(400); await p.screenshot({ path:`v139-${tag}.png` });
    await p.locator('#sayText').focus(); await p.waitForTimeout(400); await p.screenshot({ path:`v139-typing-${tag}.png` });
    await ctx.close(); }
  console.log('errors', errs); await b.close(); })();
