const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2500);
  console.log('bonus', await p.evaluate(() => BONUS.ver));
  await p.evaluate(async () => { await pplLoad(); PPL.list = [{ id:'p1', name:'실장님', rel:'상사', group:'직장', notes:[], links:[], at:Date.now() }, { id:'p2', name:'김조교', rel:'조교', group:'직장', notes:[], links:['p1'], at:Date.now() }]; await pplSave();
    window.__ev = []; SEHEE.on('people', () => __ev.push('people')); SEHEE.on('talk', t => __ev.push('talk')); SEHEE.pplPos('p1', { x:0.15, y:0.15 }); await dwOpen('people'); });
  await p.waitForTimeout(800);
  console.log('events', await p.evaluate(() => [...new Set(__ev)].join(',')), 'p1 pos', await p.evaluate(() => document.querySelector('[data-pp="p1"]').style.left), 'talk()', await p.evaluate(() => typeof SEHEE.talk('x').html));
  // b_ key sync mark
  await p.evaluate(() => { SYNC.dirty.clear(); return kvSet('b_test', { a:1 }); }); console.log('b_ marked', await p.evaluate(() => SYNC.dirty.has('kv:b_test')));
  await p.screenshot({ path:'v135-people-bonus.png' });
  // tap a node → dossier (not broken by bonus drag)
  await p.locator('[data-pp="p2"]').tap(); await p.waitForTimeout(600); console.log('tap opens pd', await p.evaluate(() => PD.id));
  console.log('errors', errs); await b.close(); })();
