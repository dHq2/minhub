const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const thinkOnly = sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'thinking', thinking:'' } },{ type:'content_block_delta', index:0, delta:{ type:'thinking_delta', thinking:'음…' } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'max_tokens' }, usage:{ output_tokens:2500 } }]);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = [], bodies = [];
  await ctx.route('https://api.anthropic.com/**', async route => {
    const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }, { id:'claude-sonnet-5-5' }] }) });
    const bd = JSON.parse(r.postData()); bodies.push({ model:bd.model, max:bd.max_tokens, th:bd.thinking && bd.thinking.type, eff:bd.output_config && bd.output_config.effort });
    const step = plan.shift() || 'ok';
    if (step === 'rejthink' && bd.thinking) return route.fulfill({ status:400, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ error:{ type:'invalid_request_error', message:'thinking.type: disabled is not supported for this model' } }) });
    if (step === 'rejthink' || step === 'empty') return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:thinkOnly });
    if (step === '503') return route.fulfill({ status:503, headers:{ ...cors, 'content-type':'application/json' }, body:'{"error":{"message":"overloaded"}}' });
    return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:txt('[미소] 정리했어요.') });
  });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.bigModel = 'claude-sonnet-5-5'; await saveAi(); await loadModels(); refreshBrain(); });
  const say = async t => { await p.locator('#sayText').fill(t); await p.locator('#sayGo').click(); for (let i = 0; i < 80; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; } await p.waitForTimeout(500); };
  const last = () => p.evaluate(() => O.log.filter(m => m.who === 's').slice(-1)[0].text);
  // A: long text → sonnet rejects disabled, then empty once (thinking ate budget) → auto retry → ok
  plan = ['rejthink', 'empty', 'ok']; bodies = [];
  await say('카톡 정리해줘\n' + '가나다 라마바\n'.repeat(40));
  console.log('A last:', await last()); console.log('A bodies', JSON.stringify(bodies));
  // B: short msg → 503 x3 → error bubble with retry button
  plan = ['503', '503', '503']; bodies = [];
  await say('안녕');
  console.log('B last:', await last(), '| retry btn:', await p.locator('#log [data-retry]').count(), '| calls', bodies.length);
  await p.screenshot({ path:'v122-retry.png' });
  plan = ['ok']; await p.locator('#log [data-retry]').click();
  for (let i = 0; i < 40; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; }
  await p.waitForTimeout(400);
  console.log('B after retry:', await last(), '| err left:', await p.evaluate(() => O.log.filter(m => m.err).length), '| user msgs:', await p.evaluate(() => O.log.filter(m => m.who === 'u').length));
  console.log('errors', errs); await b.close();
})();
