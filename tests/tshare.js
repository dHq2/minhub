// v0.7 share target: real service worker, multipart POST navigation → stash → ?shared=1#office → tray filled
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:860 }, isMobile:true, hasTouch:true, locale:'ko-KR' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(1500);
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload(); await p.waitForTimeout(1500);
  console.log('controlled:', await p.evaluate(() => !!navigator.serviceWorker.controller));
  await p.evaluate(() => {
    const f = document.createElement('form'); f.method = 'post'; f.enctype = 'multipart/form-data'; f.action = './share-target'; f.id = 'sf';
    f.innerHTML = '<input type="file" name="files" multiple><input name="text" value="동료 단톡 캡처"><input name="title" value="">';
    document.body.appendChild(f);
  });
  await p.locator('#sf input[type=file]').setInputFiles([__dirname + '/img/short.png']);
  await Promise.all([p.waitForNavigation(), p.evaluate(() => document.getElementById('sf').submit())]);
  await p.waitForTimeout(2500);
  console.log('url after share:', p.url().replace('http://localhost:8765', ''));
  console.log('view:', await p.evaluate(() => document.body.classList.contains('office') ? 'office' : 'pan'));
  console.log('tray:', await p.evaluate(() => ATT.map(a => a.kind + ':' + a.name + ':' + (a.file ? a.file.size : a.text.length))), '| text:', await p.locator('#sayText').inputValue());
  console.log('inbox left:', await p.evaluate(async () => (await (await caches.open('share-inbox')).keys()).length));
  // text-only share (old GET style still works)
  await p.goto('http://localhost:8765/sehee/?text=' + encodeURIComponent('내일 3시 상담')); await p.waitForTimeout(2500);
  console.log('GET share → inbox:', await p.evaluate(() => S.pan.inbox.map(x => x.text).slice(-1)[0]));
  await p.screenshot({ path:'v07-share.png' });
  console.log('errors', errs);
  await b.close();
})();
