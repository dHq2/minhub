const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const sayThenTool = (t, name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },
  { type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },
  { type:'content_block_start', index:1, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2,6), name } },{ type:'content_block_delta', index:1, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:1 },
  { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
// v1.0 (2026-11-15, C) 세희 말을 나눠서 — 도구 전 한 말은 먼저 말풍선 하나(작업 줄은 그 아래), 끝 대답이 길고 문단이 나뉘면 2~3개, 짧으면 하나, 다시 답하기는 나눈 말까지 걷음, 지침에 말 나누기
(async () => { const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' }; let plan = [], bodies = [];
  await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
    bodies.push(JSON.parse(r.postData())); await new Promise(x => setTimeout(x, 250)); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('[생각] 네.') }); });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; await saveAi(); await loadModels(); refreshBrain(); O.log = []; renderLog(); });
  const wait = async () => { for (let i = 0; i < 120; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; } await p.waitForTimeout(300); };
  const tail = n => p.evaluate(n => O.log.slice(-n).map(m => `${m.who}${m.part ? '(먼저)' : ''}: ${String(m.text).slice(0, 28)}`).join(' | '), n);
  // 1) 큰 일 — 도구 전 한 줄 → 작업 줄 → 결과 두 문단
  const long1 = '보고서를 새 판으로 정리했어요. 날짜가 지난 일정 세 건을 지우고, 안 끝난 일 일곱 건은 그대로 이어 붙였습니다. 판단이 필요한 항목엔 한마디를 달아 뒀어요.';
  const long2 = '확인할 것 하나요. 다음 달 보강반이 수요일반인지 토요일반인지 원본으로 먼저 정하셔야 공지를 올릴 수 있을 것 같아요.';
  plan = [sayThenTool('[생각] 보고서 정리해 볼게요.', 'add_item', { sec:'today', text:'보강반 요일 확인' }), txt(`[미소] ${long1}\n\n${long2}`)];
  await p.locator('#sayText').fill('판 정리해줘'); await p.locator('#sayGo').click();
  let sawFirst = false; for (let i = 0; i < 40 && !sawFirst; i++){ await p.waitForTimeout(100); sawFirst = await p.evaluate(() => O.busy && O.log.some(m => m.part && /정리해 볼게요/.test(m.text))); }
  console.log('일하는 중에 먼저 한 말이 보임:', sawFirst);
  await wait();
  console.log('큰 일 순서:', await tail(6));
  console.log('말풍선 수(이번 차례 세희):', await p.evaluate(() => { const u = O.log.map(m => m.who).lastIndexOf('u'); return O.log.slice(u + 1).filter(m => m.who === 's').length; }), '| 작업 줄이 먼저 한 말 뒤:', await p.evaluate(() => { const i = O.log.findIndex(m => m.part && /정리해 볼게요/.test(m.text)), j = O.log.findIndex(m => m.who === 'a' && !m.read); return i >= 0 && j > i; }));
  await p.screenshot({ path:'/tmp/split-1.png' });
  // 세희가 다음 차례에 받는 기록 — 나눈 말이 한 덩어리로 합쳐져 간다
  plan = [txt('[미소] 네.')]; bodies = [];
  await p.locator('#sayText').fill('고마워'); await p.locator('#sayGo').click(); await wait();
  const hist = bodies[0].messages; console.log('기록 합침(세희 말 사이에 보스 말 없음 → 한 덩어리):', hist.filter(m => m.role === 'assistant').some(m => JSON.stringify(m.content).includes('정리해 볼게요') && JSON.stringify(m.content).includes('확인할 것 하나요')), '| 역할 번갈아:', hist.every((m, i) => i === 0 || m.role !== hist[i - 1].role));
  console.log('짧은 답은 하나:', await tail(2));
  console.log('지침에 말 나누기:', JSON.stringify(bodies[0].system).includes('말 나누기(사람처럼)'));
  // 2) 다시 답하기 — 나눈 말까지 걷고 새로
  await p.evaluate(() => { O.log.push({ who:'u', text:'판 다시 정리해', at:Date.now() }); }); plan = [sayThenTool('[생각] 다시 볼게요.', 'add_item', { sec:'today', text:'두 번째 항목' }), txt(`[미소] ${long1}\n\n${long2}`)];
  await p.evaluate(() => { O.busy = true; return replyNow().then(() => { O.busy = false; renderLog(); }); }); await wait();
  plan = [txt('[미소] 다시 정리했어요.')];
  await p.evaluate(() => regenLast('')); await wait();
  console.log('다시 답하기 뒤:', await tail(3), '| 먼저 한 말 남은 것:', await p.evaluate(() => O.log.filter(m => /다시 볼게요/.test(m.text)).length), '| 두 번째 항목 되돌림:', await p.evaluate(async () => !(await todayPanRef()).items.some(i => i.text === '두 번째 항목')));
  console.log('나누기 규칙:', await p.evaluate(() => [splitSay('짧은 말.').length, splitSay('가'.repeat(100) + '\n\n' + '나'.repeat(100)).length, splitSay(['가', '나', '다', '라', '마'].map(x => x.repeat(70)).join('\n\n')).length, splitSay('가'.repeat(300)).length].join(',')));
  console.log('errors', errs); await b.close(); })();
