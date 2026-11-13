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
    await ctx.route('https://api.anthropic.com/**', async route => {
      const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
      if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5', display_name:'H' }] }) });
      n++;
      if (n === 1) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:toolStream('add_item', { section:'sched', text:'학부모 상담', due:'2026-11-18', time:'15:00' }) });
      if (n === 3) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:toolStream('make_card', { kind:'table', title:'이번 주 상담', columns:['날짜', '학생'], rows:[['11/18', '김민준']] }) });
      return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:txt('[미소] 적어뒀어요.') });
    });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1700);
    await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); await saveAi(); await loadModels(); refreshBrain(); });
    await p.screenshot({ path:`v092-${vp.tag}-office.png` });
    // drag the board tab leftwards halfway and hold
    const tb = await p.locator('#dwTabs button[data-dw="board"]').boundingBox();
    await p.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2); await p.mouse.down();
    await p.mouse.move(tb.x - 120, tb.y + tb.height / 2, { steps:6 }); await p.waitForTimeout(100);
    await p.screenshot({ path:`v092-${vp.tag}-dragging.png` });
    const mid = await p.evaluate(() => document.getElementById('dw-board').style.transform);
    await p.mouse.move(tb.x - 260, tb.y + tb.height / 2, { steps:4 }); await p.mouse.up(); await p.waitForTimeout(450);
    console.log(vp.tag, 'mid transform:', mid, '| after release open:', await p.evaluate(() => DW.open));
    // drag head right to close
    const hd = await p.locator('#dw-board .dw-head').boundingBox();
    await p.mouse.move(hd.x + 60, hd.y + hd.height / 2); await p.mouse.down(); await p.mouse.move(hd.x + 300, hd.y + hd.height / 2, { steps:6 }); await p.mouse.up(); await p.waitForTimeout(450);
    console.log(vp.tag, 'after head drag:', await p.evaluate(() => DW.open));
    // tap calendar tab
    await p.locator('#dwTabs button[data-dw="cal"]').click(); await p.waitForTimeout(450);
    console.log(vp.tag, 'tap cal:', await p.evaluate(() => DW.open)); await p.screenshot({ path:`v092-${vp.tag}-cal.png` });
    await p.locator('#dw-cal .dw-x').click(); await p.waitForTimeout(400);
    // Sehee adds dated item → calendar auto-opens
    await p.locator('#sayText').fill('18일 3시 학부모 상담 잡혔어'); await p.locator('#sayGo').click();
    await p.waitForFunction(() => !O.busy, null, { timeout:15000 }); await p.waitForTimeout(800);
    console.log(vp.tag, 'auto after item:', await p.evaluate(() => DW.open), await p.evaluate(() => CAL.month));
    await p.screenshot({ path:`v092-${vp.tag}-autocal.png` });
    await p.locator('#sayText').fill('표로 만들어줘'); await p.locator('#sayGo').click();
    await p.waitForFunction(() => !O.busy, null, { timeout:15000 }); await p.waitForTimeout(900);
    console.log(vp.tag, 'auto after card:', await p.evaluate(() => DW.open)); await p.screenshot({ path:`v092-${vp.tag}-autoboard.png` });
    await p.evaluate(() => document.activeElement.blur()); await p.waitForTimeout(200);
    await p.locator('#tabPan').click(); await p.waitForTimeout(300); await p.screenshot({ path:`v092-${vp.tag}-pan.png` });
    console.log(vp.tag, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
