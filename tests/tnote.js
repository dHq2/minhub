const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:860 } });
  await ctx.grantPermissions(['notifications'], { origin:'http://localhost:8765' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(1500);
  await p.evaluate(() => navigator.serviceWorker.ready); await p.reload(); await p.waitForTimeout(1500);
  console.log(await p.evaluate(async () => {
    Object.defineProperty(Notification, 'permission', { get:() => 'granted' });
    const reg0 = await navigator.serviceWorker.ready; const shown = []; reg0.showNotification = async (t, o) => { shown.push(t + ' | ' + o.body + ' | silent:' + o.silent); }; reg0.getNotifications = async () => [];
    window.__shown = shown;
    const out = { perm:Notification.permission, ok:notifyOk() };
    try{ const reg = await navigator.serviceWorker.ready; await reg.showNotification('t', { body:'b', tag:'x' }); out.shown = true; out.list = (await reg.getNotifications()).length; }catch(e){ out.err = e.message; }
    O.live = { ocr:{ step:'읽는 중', done:3, total:18 } }; JOB.cur = {}; await jobNotify(false);
    await jobNotify(true, '판에 3개 적었어요. 정리 끝났어요.'); out.after = shown;
    return out;
  }));
  await b.close();
})();
