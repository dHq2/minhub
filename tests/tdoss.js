const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const tool = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu1', name } },{ type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
(async () => { const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = [], lastSys = '';
  await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
    const bd = JSON.parse(r.postData()); lastSys = JSON.stringify(bd.system);
    return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('네.') }); });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2000);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); await saveAi(); await loadModels(); refreshBrain();
    await pplLoad(); PPL.list = [{ id:uid(), name:'실장님', rel:'상사', group:'직장', note:'', notes:[], links:[], at:Date.now(), by:'boss' }, { id:uid(), name:'김조교', rel:'2층 조교', group:'직장', note:'오후 근무', notes:[], links:[], at:Date.now(), by:'sehee' }]; pplLink(PPL.list[0], PPL.list[1]); await pplSave(); });
  plan = [tool('update_person', { person:'나', info:[{ key:'생일', value:'(테스트) 3월 1일' }, { key:'나이', value:'23' }, { key:'키', value:'175cm' }, { key:'좌우명', value:'급한 말은 없다' }],
    add_extra:[{ text:'근무: 예시 시간 (테스트)', lock:false }, { text:'다른 일 예시 (테스트)', lock:false }, { text:'처우 관련 메모 (테스트)', lock:true }, { text:'실장님과의 관계 메모 (테스트)', lock:true }] }), txt('[미소] 기록부 채웠어요.')];
  await p.locator('#sayText').fill('내 정보 기록부에 넣어줘 (테스트)'); await p.locator('#sayGo').click();
  for (let i = 0; i < 60; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; }
  await p.waitForTimeout(800);
  console.log('pd open', await p.evaluate(() => $('pd').classList.contains('on') && PD.id));
  await p.waitForTimeout(3500);
  await p.screenshot({ path:'v134-me.png' });
  await p.evaluate(() => $('pdBody').scrollTop = 600); await p.waitForTimeout(200); await p.screenshot({ path:'v134-me2.png' });
  await p.locator('#pdEdit').click(); await p.waitForTimeout(300); await p.screenshot({ path:'v134-me-edit.png' });
  await p.locator('#pdEdit').click(); await p.waitForTimeout(300);
  await p.locator('[data-pd="close"]').click();
  // person
  await p.evaluate(() => dwOpen('people')); await p.waitForTimeout(600);
  await p.locator('#ppMap [data-pp]').first().click(); await p.waitForTimeout(500); await p.screenshot({ path:'v134-person.png' });
  // prompt context check
  plan = [txt('네.')]; await p.evaluate(() => $('pd').classList.remove('on'));
  await p.evaluate(() => dwClose()); await p.waitForTimeout(400);
  await p.locator('#sayText').fill('안녕'); await p.locator('#sayGo').click(); await p.waitForTimeout(1500);
  console.log('prompt has me:', lastSys.includes('나(보스 본인)'), lastSys.includes('[비공개]'));
  await p.evaluate(() => goView('pan')); await p.waitForTimeout(500); await p.screenshot({ path:'v134-pantabs.png' });
  await p.locator('#panDw [data-pdw="board"]').click(); await p.waitForTimeout(700); console.log('pan tab → ', await p.evaluate(() => [curView(), DW.open]));
  console.log('errors', errs); await b.close(); })();
