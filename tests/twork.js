const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const tools = list => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } }, ...list.flatMap(([name, input], i) => [
  { type:'content_block_start', index:i, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2, 7), name } },
  { type:'content_block_delta', index:i, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } }, { type:'content_block_stop', index:i }]),
  { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = [], seen = [];
  await ctx.route('https://api.anthropic.com/**', async route => {
    const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
    const bd = JSON.parse(r.postData()); seen.push(bd.tools ? bd.tools.map(t => t.name).includes('ask_boss') : null);
    let step = plan.shift() || txt('네.'); if (typeof step === 'function') step = step(bd);
    await new Promise(r => setTimeout(r, 600));
    return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:step });
  });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2000);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); await saveAi(); await loadModels(); refreshBrain();
    const pr = await todayPanRef(); pr.items.push({ id:'aaa111', sec:'today', text:'수신기 연결 확인', by:'sehee', at:Date.now() }); await putPan(pr); });
  plan = [ tools([['add_item', { section:'today', text:'이그잼 자료 내일까지 준비' }], ['add_item', { section:'today', text:'유은찬 요일 변경 대응' }], ['update_item', { id:'aaa111', text:'수신기 노트북 직접 연결로 정리' }]]),
    tools([['make_card', { kind:'report', title:'11/13 업무 정리', summary:'수신기는 노트북 직접 연결로 정리. 남은 일 2건.', sections:[{ heading:'개요', text:'오늘 오전 수신기 문제를 정리했다.' }, { heading:'남은 일', points:['이그잼 자료', '유은찬 요일 변경'] }, { heading:'확인 필요', text:'계정 처리 방식' }] }]]),
    txt('[미소] 판 고치고 보고서 올렸어요. 확인할 것: 계정 처리 방식은 누가 정하나요?') ];
  await p.locator('#sayText').fill('오늘 거 정리해서 판 고치고 보고서도 써줘'); await p.locator('#sayGo').click();
  const shots = [[700, 'w1-think'], [1500, 'w2-pan'], [2600, 'w3-type'], [5200, 'w4-report'], [7200, 'w5-report'], [8600, 'w6-report']]; let t = 0;
  for (const [at, name] of shots){ await p.waitForTimeout(at - t); t = at; await p.screenshot({ path:`v130-${name}.png` }); console.log(name, 'view', await p.evaluate(() => curView()), 'rv', await p.evaluate(() => !!RV.id)); }
  for (let i = 0; i < 60; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; }
  console.log('warns:', await p.evaluate(() => DBG.lines.filter(l => l.c === '경고' || l.c === '오류').map(l => l.m).join(' || ')));
  console.log('done items:', await p.evaluate(() => S.pan.items.map(x => x.text).join(' / ')));
  await p.evaluate(() => rvClose());
  // ask mode
  await p.evaluate(async () => { AI.cfg.ask = 'need'; await saveAi(); });
  plan = [ tools([['ask_boss', { question:'보고서 받는 사람은 실장님인가요, 팀장님인가요?', options:['실장님', '팀장님'] }]]), bd => txt('[미소] 실장님 기준으로 할게요.') ];
  await p.locator('#sayText').fill('보고서 한 번 더 손봐줘'); await p.locator('#sayGo').click();
  await p.waitForTimeout(2200); await p.screenshot({ path:'v130-ask.png' });
  console.log('ask open:', await p.evaluate(() => !!WORK.ask), 'buttons:', await p.locator('#ptBub [data-ask]').count(), 'ask tool offered:', seen[seen.length - 1]);
  await p.locator('#ptBub [data-ask="실장님"]').click();
  for (let i = 0; i < 40; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; }
  console.log('after answer:', await p.evaluate(() => O.log.slice(-3).map(m => m.who + ':' + (m.text || '').slice(0, 30)).join(' | ')));
  console.log('fab visible:', await p.evaluate(() => getComputedStyle($('fab')).display));
  console.log('errors', errs); await b.close();
})();
