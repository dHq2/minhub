const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{ width:412, height:915 }, serviceWorkers:'block' }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2500);
  console.log('vers', await p.evaluate(() => JSON.stringify(BONUS.vers)), 'logs', await p.evaluate(() => DBG.lines.filter(l => /보너스/.test(l.m)).map(l => l.m).join(' | ')));
  await p.evaluate(() => settingsSheet()); await p.waitForTimeout(300); await p.locator('[data-sact="bonus"][data-k="C"][data-v="0"]').click(); await p.waitForTimeout(300);
  console.log('C off stored', await p.evaluate(() => localStorage.getItem('sehee.bonus.C')), 'B still', await p.evaluate(() => bonusOn('B')));
  await p.reload(); await p.waitForTimeout(2500); console.log('after reload vers', await p.evaluate(() => JSON.stringify(BONUS.vers)));
  console.log('errors', errs); await b.close(); })();
