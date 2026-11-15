const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const tools = list => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } }, ...list.flatMap(([name, input], i) => [
  { type:'content_block_start', index:i, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2, 7), name } },
  { type:'content_block_delta', index:i, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } }, { type:'content_block_stop', index:i }]),
  { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
/* tsehee2 v1 (2026-11-15, B) — 세희 쪽 개선 요청 v1.1(복기 S1~S7) 묶음 시험. 가짜 이름·가짜 대답만
   S1 "뺄게요" 해 놓고 도구 0개 → 한 번 더 시켜 실제로 지움 · S2 기준 시각(개발 설정)으로 오늘·지금이 바뀜 · S3 지침에 「확인할 것」 묶음 없음, 목적 지침·최근 대답 틀 보임
   S4 연달아 붙여넣기 알림 · S5 9:30·10:30 은 안 겹침, 14:00·14:30 은 겹침 · S6 지침만 system(캐시), 지금 상황은 이번 보스 말 앞, 다음 차례엔 지난 대답 끝까지 캐시 표시
   S7 판 글을 고치는 중에 세희가 판에 써도 입력칸이 안 닫힘 · '…'만 있는 앞말 말풍선 안 띄움 */
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = []; const bodies = [];
  await ctx.route('https://api.anthropic.com/**', async route => {
    const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
    try{ bodies.push(JSON.parse(r.postData() || '{}')); }catch(e){}
    const step = plan.shift() || txt('네.'); await new Promise(r => setTimeout(r, 150));
    return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:step });
  });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded && S.today);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); await saveAi(); await loadModels(); refreshBrain(); });
  const idle = async () => { for (let i = 0; i < 100; i++){ await p.waitForTimeout(150); if (!(await p.evaluate(() => O.busy))) return; } };
  const say = async t => { await p.locator('#sayText').fill(t); await p.locator('#sayGo').click(); await p.waitForTimeout(300); await idle(); await p.waitForTimeout(200); };
  const R = {};
  const tsec = await p.evaluate(() => secById('today') ? 'today' : secs()[0].id);
  /* S1 — 말만 하고 안 함 */
  const id1 = await p.evaluate(async sec => { const r = await runTool({ name:'add_item', args:{ section:sec, text:'가상 급하지 않은 일을 해야 합니다' } }); return r.item.id; }, tsec);
  plan = [ txt('[미소] 알겠어요, 지금 할 일만 남기고 나머지는 뺄게요.'), tools([['delete_item', { id:id1 }]]), txt(''), tools([['set_line', { line:'급한 것만 남겼어요.', face:'^_^' }]]) ];
  const n0 = bodies.length; await say('급한 거 말고 퍼뜩퍼뜩 일정에서 빼!');
  R.s1 = await p.evaluate(id => ({ gone:!S.pan.items.some(x => x.id === id), line:S.pan.line || null, follow:JSON.stringify(DBG.lines).includes('말만 하고 안 해서 한 번 더') }), id1);
  R.s1.calls = bodies.length - n0;
  /* S6 — 캐시 모양(두 번째 차례) */
  plan = [ txt('[생각] 네, 알겠어요.') ]; await say('고마워');
  const B = bodies[bodies.length - 1], ms = B.messages, cc = JSON.stringify(B).split('"cache_control"').length - 1;
  const lastU = ms[ms.length - 1], prevA = ms[ms.length - 2];
  const hasDyn = m => Array.isArray(m.content) && m.content.some(c => c.type === 'text' && /앱이 붙인 지금 상황/.test(c.text || ''));
  R.s6 = { sysBlocks:Array.isArray(B.system) ? B.system.length : 'str', sysCached:!!(B.system[0] && B.system[0].cache_control), sysHasNow:/지금: \d{4}-\d\d/.test(JSON.stringify(B.system)),
    dynInLast:hasDyn(lastU), dynElsewhere:ms.slice(0, -1).some(hasDyn), prevAssistantCached:/cache_control/.test(JSON.stringify(prevA)), prevRole:prevA.role, cacheMarks:cc };
  /* S3 — 지침 */
  const sysText = JSON.stringify(B.system) + JSON.stringify(lastU);
  R.s3 = { noConfirmBundle:!/'확인할 것' 하나로 묶어/.test(sysText), purpose:/모양이 아니라 목적/.test(sysText), frames:/최근 대답의 시작·끝/.test(sysText), noTemplate:!/정리해 볼게요"\)/.test(sysText) };
  /* S4 — 연달아 붙여넣기 */
  plan = [ txt('[생각] 받았어요.'), txt('[생각] 받았어요.') ];
  const paste = '가상 거래처 메모\n' + '수량 30,000세트 기준 일정표\n'.repeat(8);
  await say(paste); await say(paste);
  R.s4 = /연달아 보내는 중/.test(JSON.stringify(bodies[bodies.length - 1]));
  /* S5 — 겹침 */
  R.s5 = await p.evaluate(async sec => { const d = ymd(new Date(parseYmd(S.today).getTime() + 3 * 864e5));
    await runTool({ name:'add_item', args:{ section:sec, text:'가상 면담', due:d, time:'09:30' } });
    const a = await runTool({ name:'add_item', args:{ section:sec, text:'가상 회의', due:d, time:'10:30' } });
    await runTool({ name:'add_item', args:{ section:sec, text:'가상 교육', due:d, time:'14:00' } });
    const c = await runTool({ name:'add_item', args:{ section:sec, text:'가상 화상회의', due:d, time:'14:30' } });
    return { nineThirtyTenThirty:!!(a.overlaps && a.overlaps.length), twoTwoThirty:!!(c.overlaps && c.overlaps.length) }; }, await p.evaluate(() => secById('sched') ? 'sched' : secs()[0].id));
  /* S2 — 기준 시각 */
  R.s2 = await p.evaluate(async () => { const real = todayStr(); localStorage.setItem('sehee.clock', JSON.stringify({ base:Date.parse('2026-11-16T07:00:00'), at:Date.now() }));
    const sp = await systemPrompt('claude-haiku-5-5'); const out = { real, now:todayStr(), inPrompt:/지금: 2026-11-16 \(월\) 07:0/.test(sp), marked:/기준 시각/.test(sp) };
    localStorage.removeItem('sehee.clock'); out.back = todayStr() === real; return out; });
  /* '…' 앞말 */
  R.dots = await p.evaluate(() => { const n = O.log.length; seheePart('[생각]'); return O.log.length === n; });
  /* S7 — 고치는 중 다시 그리기 */
  await p.evaluate(() => goView('pan')); await p.waitForTimeout(500);
  await p.waitForFunction(() => { const s = document.getElementById('splash'); return !s || s.hidden || getComputedStyle(s).display === 'none'; }, null, { timeout:15000 }).catch(() => {});
  const tx = p.locator('#main .it .tx').first(), r = await tx.boundingBox(); await p.touchscreen.tap(r.x + 30, r.y + r.height / 2); await p.waitForTimeout(200);
  await p.keyboard.type(' 고침');
  R.s7 = { open:await p.evaluate(() => !!document.querySelector('#main textarea.ed')) };
  await p.evaluate(async sec => { await runTool({ name:'add_item', args:{ section:sec, text:'가상 세희가 그사이 적은 일' } }); render(); }, tsec); await p.waitForTimeout(250);
  R.s7.stillOpen = await p.evaluate(() => !!document.querySelector('#main textarea.ed') && document.activeElement.classList.contains('ed'));
  await p.evaluate(() => document.activeElement.blur()); await p.waitForTimeout(250);
  R.s7.after = await p.evaluate(() => ({ closed:!document.querySelector('#main textarea.ed'), saved:S.pan.items.some(x => / 고침$/.test(x.text)), newShown:[...document.querySelectorAll('#main .it .tx')].some(e => /세희가 그사이/.test(e.textContent)) }));
  console.log(JSON.stringify(R)); console.log('errors', errs); await b.close();
})();
