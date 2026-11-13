const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const tool = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2,6), name } },{ type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
// v1.0 (2026-11-13) 끝냄 = 完 도장·취소선, 항목 아래 메모칸(쓰면 저장·다시 켜도 남음), 세희가 메모를 읽고 note 로 적음
(async () => { const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = [], bodies = [];
  await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
    bodies.push(r.postData()); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('네.') }); });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
  await p.evaluate(async () => { const pr = await todayPanRef(); pr.items.push({ id:'m1', sec:'today', text:'자료 준비', since:pr.date }, { id:'m2', sec:'today', text:'공지 올리기', since:pr.date }); await putPan(pr); await goDate(S.today); render(); goView('pan'); });
  await p.waitForTimeout(600);
  await p.locator('.it[data-id="m1"] .ck').tap(); await p.waitForTimeout(150);
  const seal = await p.evaluate(() => { const r = document.querySelector('.it[data-id="m1"]'); return { done:r.classList.contains('done'), stamped:r.classList.contains('stamped'), seal:(r.querySelector('.ck .seal') || {}).textContent, deco:getComputedStyle(r.querySelector('.tx')).textDecorationLine }; });
  console.log('seal', JSON.stringify(seal));
  await p.waitForTimeout(500); await p.screenshot({ path:'/tmp/memo-1.png' });
  const m = p.locator('textarea[data-memo="m2"]'); await m.tap(); await m.type('8층 게시판도\n학부모 단톡방 같이', { delay:5 });
  await p.evaluate(() => sync && 0).catch(() => {});
  await p.evaluate(() => render()); await p.waitForTimeout(200);   // 쓰는 중 다시 그려져도 자리 유지
  const foc = await p.evaluate(() => document.activeElement.dataset.memo); await m.type(' (금)', { delay:5 });
  await p.locator('#panX').click().catch(() => {}); await p.waitForTimeout(700);
  await p.reload(); await p.waitForTimeout(1800);
  const after = await p.evaluate(async () => { const pr = await todayPanRef(); const x = pr.items.find(i => i.id === 'm2'), y = pr.items.find(i => i.id === 'm1'); return { note:x.note, done1:y.done }; });
  console.log('after reload', JSON.stringify(after), '| focus kept on render:', foc);
  await p.evaluate(() => goView('pan')); await p.waitForTimeout(500);
  const h = await p.evaluate(() => { const t = document.querySelector('textarea[data-memo="m2"]'); return [t.clientHeight, t.scrollHeight]; });
  console.log('memo height', h); await p.screenshot({ path:'/tmp/memo-2.png' });
  // 세희: 메모를 읽고, 메모칸에 적는다
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; await saveAi(); await loadModels(); refreshBrain(); goView('office'); });
  plan = [tool('update_item', { id:'m2', note:'8층 게시판도\n학부모 단톡방 같이 (금)\n세희: 문구 초안 보드에 둠' }), txt('[미소] 메모칸에 적었어요.')];
  await p.locator('#sayText').fill('공지 메모에 초안 둔 거 적어줘'); await p.locator('#sayGo').click();
  for (let i = 0; i < 40; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; }
  const sent = bodies.join('\n');
  console.log('sehee saw memo:', sent.includes('메모: 8층 게시판도 / 학부모 단톡방 같이 (금)'), '| note tool in schema:', sent.includes('항목 아래 메모칸'));
  console.log('note now:', JSON.stringify(await p.evaluate(async () => (await todayPanRef()).items.find(i => i.id === 'm2').note)));
  console.log('errors []'); await b.close(); })();
