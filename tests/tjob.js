// v0.7.2: resume after kill, freeze retry, notifications
const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = (t, stop='end_turn') => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:100 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },
  { type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:stop }, usage:{ output_tokens:5 } }]);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:860 }, isMobile:true, hasTouch:true, locale:'ko-KR' });
  await ctx.grantPermissions(['notifications'], { origin:'http://localhost:8765' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  const ocr = []; let mode = 'slow', chat = 0, abortNext = false;
  await ctx.route('https://api.anthropic.com/**', async route => {
    const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5', display_name:'H' },{ id:'claude-sonnet-5-5', display_name:'S' }] }) });
    const body = JSON.parse(r.postData()); const c = body.messages[0].content;
    const labels = Array.isArray(c) ? c.filter(x => x.type === 'text' && /^사진/.test(x.text)).map(x => x.text.match(/사진 (\d+) · 조각 (\d+)/).slice(1).join('-')) : [];
    if (labels.length){
      if (abortNext){ abortNext = false; ocr.push('ABORT ' + labels.join(',')); return route.abort('connectionreset'); }
      ocr.push(labels.join(','));
      if (mode === 'slow' && ocr.length > 1) await new Promise(r => setTimeout(r, 6000));
      return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:txt(labels.map(l => `[오후 1:00] 엄마: 조각 ${l}`).join('\n')) });
    }
    chat++;
    return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:txt('[미소] 정리 끝났어요.') });
  });
  let p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1500);
  await p.evaluate(() => navigator.serviceWorker.ready); await p.reload(); await p.waitForTimeout(1500);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); await saveAi(); await loadModels(); AI.cfg.big.anthropic = 'claude-sonnet-5-5'; await saveAi(); refreshBrain(); });
  // ---- 1) kill mid-job and resume ----
  await p.locator('#sayFile').setInputFiles([__dirname + '/img/giant.jpg']);   // 18 tiles → 5 batches
  await p.locator('#sayGo').click();
  for (let i = 0; i < 80; i++){ const ok = await p.evaluate(async () => { const j = await kvGet('job'); return !!(j && j.out && j.out.filter(x => x != null).length >= 1); }); if (ok) break; await p.waitForTimeout(250); }
  const saved = await p.evaluate(async () => { const j = await kvGet('job'); return { stage:j.stage, done:j.out.filter(x => x != null).length, tiles:j.tiles.length }; });
  console.log('saved before kill:', JSON.stringify(saved), '| ocr calls so far:', ocr.join(' | '));
  await p.close();   // app killed
  mode = 'fast'; const before = ocr.length;
  p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/'); 
  await p.waitForFunction(() => typeof O !== 'undefined' && O.log.some(m => m.hint && /이어서/.test(m.text)), null, { timeout:15000 });
  await p.waitForFunction(() => !O.busy && O.log.some(m => m.text === '정리 끝났어요.'), null, { timeout:30000 });
  const um = await p.evaluate(() => O.log.find(m => m.ocr !== undefined));
  console.log('after resume: new ocr calls:', ocr.slice(before).join(' | '));
  console.log('transcript lines:', um.ocrMeta.lines, '| view:', await p.evaluate(() => document.body.classList.contains('office') ? 'office' : 'pan'), '| job left:', await p.evaluate(async () => !!(await kvGet('job'))));
  // ---- 2) freeze: hidden + connection reset → not counted, retried when visible; final notification ----
  ocr.length = 0; abortNext = true;
  await p.locator('#sayFile').setInputFiles([__dirname + '/img/short.png']);
  await p.evaluate(() => { window.__hid = true; Object.defineProperty(document, 'hidden', { configurable:true, get:() => window.__hid }); document.dispatchEvent(new Event('visibilitychange')); });
  await p.evaluate(() => { sendSay(); });
  await p.waitForTimeout(1500);
  const notes = await p.evaluate(async () => (await (await navigator.serviceWorker.ready).getNotifications()).map(n => n.title + ' | ' + n.body));
  console.log('while hidden — ocr:', ocr.join(' | '), '| busy:', await p.evaluate(() => O.busy), '| notes:', JSON.stringify(notes));
  await p.evaluate(() => { window.__hid = false; document.dispatchEvent(new Event('visibilitychange')); });
  await p.waitForFunction(() => !O.busy, null, { timeout:20000 });
  console.log('after visible — ocr:', ocr.join(' | '), '| last:', await p.evaluate(() => O.log.slice(-1)[0].text));
  // finishing while hidden → final notification
  await p.evaluate(() => { window.__hid = true; document.dispatchEvent(new Event('visibilitychange')); });
  await p.locator('#sayText').fill('가'.repeat(400)); await p.evaluate(() => { sendSay(); });
  await p.waitForFunction(() => !O.busy, null, { timeout:20000 }); await p.waitForTimeout(500);
  console.log('final note:', JSON.stringify(await p.evaluate(async () => (await (await navigator.serviceWorker.ready).getNotifications()).map(n => n.title + ' | ' + n.body))));
  console.log('errors', errs); await b.close();
})();
