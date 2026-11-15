const { chromium } = require('playwright');
// tenter v1.0 (2026-11-16, A) 폰(손가락)은 엔터 = 줄 바꿈(보내기는 ↑만) · 컴퓨터는 엔터 = 보내기
(async () => { const b = await chromium.launch(); let bad = 0;
  const check = (n, ok, info) => { console.log((ok ? 'OK   ' : 'FAIL ') + n + (info ? ' · ' + info : '')); if (!ok) bad++; };
  for (const [name, opt] of [['폰', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['컴', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage();
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded);
    const n0 = await p.evaluate(() => O.log.length);
    await p.locator('#sayText').fill('[가상 이사] [오후 12:53] 첫 줄'); await p.locator('#sayText').press('Enter'); await p.waitForTimeout(400);
    const v = await p.inputValue('#sayText'), n1 = await p.evaluate(() => O.log.length);
    if (name === '폰'){
      check('폰: 엔터는 줄 바꿈, 안 보냄', v.includes('\n') && n1 === n0, JSON.stringify(v));
      check('폰: 자판 엔터 표시는 「줄 바꿈」', (await p.getAttribute('#sayText', 'enterkeyhint')) === 'enter');
      await p.locator('#sayGo').tap(); await p.waitForTimeout(400);
      check('폰: ↑ 로는 보냄', (await p.evaluate(() => O.log.length)) > n0 && !(await p.inputValue('#sayText')));
    } else {
      check('컴: 엔터는 보내기', n1 > n0 && !v, JSON.stringify(v));
      check('컴: 자판 표시는 그대로 「보내기」', (await p.getAttribute('#sayText', 'enterkeyhint')) === 'send');
    }
    await ctx.close();
  }
  console.log('ENTER bad', bad); await b.close(); if (bad) process.exit(1);
})();
