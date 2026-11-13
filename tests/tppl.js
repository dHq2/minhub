const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const toolStream = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },
  { type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2, 6), name } },
  { type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },
  { type:'content_block_stop', index:0 }, { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width:412, height:915, mob:true, tag:'m' }, { width:1366, height:860, tag:'d' }]){
    const ctx = await b.newContext({ viewport:{ width:vp.width, height:vp.height }, isMobile:!!vp.mob, hasTouch:!!vp.mob, locale:'ko-KR', serviceWorkers:'block' });
    const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
    let n = 0;
    const script = [
      toolStream('add_person', { name:'김실장', relation:'실장님, 내 상사', group:'직장', note:'월요일 회의 주재' }), txt('[미소] 김실장님 붙여뒀어요.'),
      toolStream('add_person', { name:'이강사', relation:'영어 강사', group:'직장', link_to:'김실장' }), txt('붙였어요.'),
      toolStream('add_person', { name:'준호', relation:'대학 친구', group:'친구' }), txt('네.'),
      toolStream('add_person', { name:'엄마', relation:'어머니', group:'가족' }), txt('네.'),
      txt('[미소] 마이크 충전 적어뒀어요.'),
    ];
    await ctx.route('https://api.anthropic.com/**', async route => {
      const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
      if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5', display_name:'H' }] }) });
      const body = script[n++] || txt('네.');
      return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body });
    });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
    await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); await saveAi(); await loadModels(); refreshBrain(); });
    const say = async t => { await p.locator('#sayText').fill(t); await p.locator('#sayGo').click(); for (let i = 0; i < 60; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; } await p.waitForTimeout(700); };
    // typing mode: tabs visible?
    await p.locator('#sayText').focus(); await p.waitForTimeout(300);
    const tabsVis = await p.evaluate(() => { const r = document.getElementById('dwTabs').getBoundingClientRect(); const pt = document.getElementById('panTab').getBoundingClientRect(); return { tabs: r.width > 0 && getComputedStyle(document.getElementById('dwTabs')).display !== 'none', pan: pt.width > 0, typing: document.body.classList.contains('typing') }; });
    console.log(vp.tag, 'typing tabs', JSON.stringify(tabsVis));
    await p.screenshot({ path:`v12-${vp.tag}-typing.png` });
    await say('김실장님 인간관계판에 넣어줘');
    console.log(vp.tag, 'after 1:', await p.evaluate(() => [DW.open, PPL.list.length, document.querySelectorAll('#ppMap .pp-node').length]));
    await say('이강사도. 실장님이랑 아는 사이'); await say('친구 준호'); await say('엄마도');
    console.log(vp.tag, 'after 4:', await p.evaluate(() => [DW.open, PPL.list.map(x => x.name + '/' + x.group).join(','), document.querySelectorAll('#ppMap .pp-node').length, document.querySelectorAll('#ppMap .pp-str').length, document.querySelectorAll('#ppMap .pp-lk').length]));
    await p.screenshot({ path:`v12-${vp.tag}-board.png` });
    // manual add
    await p.locator('#ppAdd').click(); await p.waitForTimeout(400);
    await p.screenshot({ path:`v12-${vp.tag}-addsheet.png` });
    const inputs = await p.evaluate(() => [...document.querySelectorAll('.sheet input, .sheet select, .sheet textarea')].map(e => e.id || e.name || e.tagName).join(','));
    console.log(vp.tag, 'add sheet fields:', inputs);
    await p.locator('#ppNewName').fill('박조교'); await p.locator('#ppNewRel').fill('2층 조교');
    await p.locator('[data-pact="add"]').click(); await p.waitForTimeout(600);
    console.log(vp.tag, 'manual add:', await p.evaluate(() => PPL.list.map(x => x.name).join(',')));
    await p.screenshot({ path:`v12-${vp.tag}-board2.png` });
    await p.locator('[data-pp]').first().click(); await p.waitForTimeout(500);
    await p.screenshot({ path:`v12-${vp.tag}-sheet.png` });
    await p.evaluate(() => { closeSheet(); pdClose(); }); await p.waitForTimeout(300);
    await p.locator('#ppCenter').click(); await p.waitForTimeout(300); await p.screenshot({ path:`v12-${vp.tag}-big.png` });
    await p.evaluate(() => dwClose()); await p.waitForTimeout(500);
    // fake write warning
    await say('마이크 충전 적어줘');
    console.log(vp.tag, 'warn:', await p.evaluate(() => O.log.slice(-2).map(m => m.who + ':' + m.text.slice(0, 40)).join(' | ')));
    // pan tab drag (typing)
    await p.locator('#sayText').focus(); await p.waitForTimeout(200);
    const pt = await p.locator('#panTab').boundingBox();
    await p.mouse.move(pt.x + pt.width / 2, pt.y + pt.height / 2); await p.mouse.down(); await p.mouse.move(pt.x + 60, pt.y + 10, { steps:5 });
    const mid = await p.evaluate(() => document.getElementById('office').style.transform);
    await p.mouse.move(pt.x + 200, pt.y + 10, { steps:5 }); await p.mouse.up(); await p.waitForTimeout(600);
    console.log(vp.tag, 'pantab mid', mid, '→ view', await p.evaluate(() => curView()));
    console.log(vp.tag, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
