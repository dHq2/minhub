const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const tools = list => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } }, ...list.flatMap(([name, input], i) => [
  { type:'content_block_start', index:i, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2, 7), name } },
  { type:'content_block_delta', index:i, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } }, { type:'content_block_stop', index:i }]),
  { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
/* tsee v1 (2026-11-15, B) — 세희가 다른 화면에 적어도 화면을 안 옮김: 사무실에 그대로, 일간보고서 탭·견출지에 「볼 거 N」, 날짜 있는 일은 달력 견출지에도, 새 사람은 사람 견출지에.
   라벨은 잠시 뒤(9초) 들어감. 일간보고서를 열면 바뀐 줄이 반짝하고 라벨 정리. 보스가 콕 집은 일(show:true)만 그 화면으로 가서 보여 줌. 가짜 이름만 */
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = [];
  await ctx.route('https://api.anthropic.com/**', async route => {
    const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
    const step = plan.shift() || txt('네.'); await new Promise(r => setTimeout(r, 300));
    return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:step });
  });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded && S.today);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); await saveAi(); await loadModels(); refreshBrain(); });
  const due = await p.evaluate(() => { const t = parseYmd(S.today); return ymd(new Date(t.getFullYear(), t.getMonth(), t.getDate() + 2)); });
  const sec = await p.evaluate(() => secById('sched') ? 'sched' : secs()[0].id), tsec = await p.evaluate(() => secById('today') ? 'today' : secs()[0].id);
  const idle = async () => { for (let i = 0; i < 80; i++){ await p.waitForTimeout(200); if (!(await p.evaluate(() => O.busy))) return; } };
  const R = {};
  plan = [ tools([['add_item', { section:tsec, text:'가상 서류 다섯 가지를 내야 합니다' }], ['add_item', { section:sec, text:'가상 거래처 미팅이 있습니다', memo:'거래처 미팅', due, time:'15:00' }], ['add_person', { name:'가상 총무', relation:'회사 총무', group:'기타' }]]),
    txt('[미소] 할 일 하나, 일정 하나 적어 뒀어요.') ];
  await p.locator('#sayText').fill('이거 올려도 되는 거야?'); await p.locator('#sayGo').click();
  await p.waitForTimeout(900); R.during = await p.evaluate(() => curView()); await idle(); await p.waitForTimeout(300);
  R.after = await p.evaluate(() => { const lab = s => { const e = document.querySelector(s); return e && e.classList.contains('see') ? e.dataset.see : null; };
    return { view:curView(), drawer:DW.open || null, calOn:CAL.on, pan:lab('#panTab') || lab('#tabPan'), cal:lab('#dwTabs [data-dw="cal"]'), people:lab('#dwTabs [data-dw="people"]'), seePan:SEE.pan.size, items:S.pan.items.length }; });
  await p.screenshot({ path:'/tmp/vsee-1.png' });
  await p.waitForTimeout(9300); R.fades = await p.evaluate(() => document.querySelectorAll('.see').length);
  await p.evaluate(() => goView('pan')); await p.waitForTimeout(450);
  R.openPan = await p.evaluate(() => ({ view:curView(), flashed:document.querySelectorAll('#main .it.w-hl').length, left:SEE.pan.size }));
  await p.screenshot({ path:'/tmp/vsee-2.png' });
  await p.evaluate(() => goView('office')); await p.waitForTimeout(400);
  plan = [ tools([['add_item', { section:tsec, text:'가상 우편물을 부쳐야 합니다', show:true }]]), txt('[미소] 적어 뒀어요.') ];
  await p.locator('#sayText').fill('우편물 부치는 거 적어'); await p.locator('#sayGo').click();
  let went = false; for (let i = 0; i < 30; i++){ await p.waitForTimeout(150); if (await p.evaluate(() => curView() === 'pan')){ went = true; break; } }
  await idle(); R.show = { went };
  console.log(JSON.stringify(R)); console.log('errors', errs); await b.close();
})();
