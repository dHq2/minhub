// v1.0 (2026-11-15, A) — 판 오른쪽 견출지: 마우스 올림은 강조만, 누르면 열림 (B0.12.1)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport:{ width:1920, height:911 }, locale:'ko-KR', serviceWorkers:'block' })).newPage();
  await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(3000);
  await p.evaluate(() => goView('pan')); await p.waitForTimeout(500);
  const btn = p.locator('#panDw button[data-pdw="board"]');
  await p.mouse.move(10, 10); await btn.hover(); await p.waitForTimeout(700);
  const after = await p.evaluate(() => ({ view:curView(), peek:!!document.querySelector('#panDw button.b-peek') }));
  console.log('hover:', JSON.stringify(after));
  await btn.click(); await p.waitForTimeout(700);
  const clicked = await p.evaluate(() => ({ view:curView(), drawer:DW.open }));
  console.log('click:', JSON.stringify(clicked));
  const ok = after.view === 'pan' && after.peek && clicked.view === 'office' && clicked.drawer === 'board';
  console.log(ok ? 'HOVER ok' : 'HOVER FAIL');
  await b.close(); if (!ok) process.exit(1);
})();
