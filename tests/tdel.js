const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const tool = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2,6), name } },{ type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
// v1.0 (2026-11-13) 말 지우기 — 🗑 두 번 누르기, 보스 말 = 그 차례 통째, 세희 답 = 그 말만, 세희에게 다시 안 감, 개발자 로그·presync·긴 일에서도 지움, turnRemoved
(async () => { const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = [], bodies = [];
  await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
    bodies.push(r.postData()); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('네.') }); });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
  await p.evaluate(async () => { localStorage.setItem('sehee.dev', '1'); AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; await saveAi(); await loadModels(); refreshBrain();
    SEHEE.on('turnRemoved', d => { window.__rm = d.ats.length; }); });
  const wait = async () => { for (let i = 0; i < 60; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; } await p.waitForTimeout(300); };
  const say = async (t, r) => { plan = [txt(r)]; await p.locator('#sayText').fill(t); await p.locator('#sayGo').click(); await wait(); };
  await say('첫 번째 말 사과박스 알파', '[미소] 첫 답 브라보입니다.');
  await say('두 번째 말 비밀코드 찰리델타', '[미소] 둘째 답 에코폭스트롯.');
  await say('세 번째 말 골프호텔', '[미소] 셋째 답 인디아줄리엣.');
  await p.evaluate(async () => { await kvSet('presync', { at:1, user:'t', pans:[], kv:{ chat:O.log.slice() } }); const u2 = O.log.find(m => /찰리델타/.test(m.text || '')); await kvSet('job', { at:Date.now(), msgAt:u2.at, stage:'organize' }); });
  console.log('icons: bins', await p.locator('#log [data-delmsg]').count(), '| re on last only', await p.locator('#log [data-regenmenu]').count());
  await p.screenshot({ path:'/tmp/del-0.png' });
  // 보스의 두 번째 말 지우기 → 둘째 답도 같이
  const bin = p.locator('#log .msg.u').nth(1).locator('[data-delmsg]');
  await bin.click(); await p.waitForTimeout(150);
  console.log('armed label:', await p.locator('#log .mt.armed span').textContent());
  await p.screenshot({ path:'/tmp/del-1.png' });
  await p.locator('#log .mt.armed').click(); await p.waitForTimeout(400);
  const left = await p.evaluate(() => O.log.filter(m => m.who !== 'a').map(m => m.text).join(' | '));
  console.log('left:', left);
  const tr = await p.evaluate(async () => ({ saved:JSON.stringify(await kvGet('chat')).includes('찰리델타') || JSON.stringify(await kvGet('chat')).includes('에코폭스트롯'),
    dbg:DBG.lines.some(l => /찰리델타|에코폭스트롯/.test(l.m)), dbgOther:DBG.lines.some(l => /사과박스/.test(l.m)), presync:JSON.stringify(await kvGet('presync')).includes('찰리델타'), job:await kvGet('job'), rm:window.__rm }));
  console.log('traces', JSON.stringify(tr));
  // 세희 답 하나 지우기(첫 답) → 보스 첫 말은 남음
  const sb = p.locator('#log .msg.s', { hasText:'브라보' }).locator('[data-delmsg]'); await sb.click(); await p.waitForTimeout(100); await p.locator('#log .mt.armed').click(); await p.waitForTimeout(300);
  console.log('after s delete:', await p.evaluate(() => O.log.filter(m => m.who !== 'a').map(m => m.who + ':' + (m.text || '').slice(0, 6)).join(' | ')));
  // 다음 대화에 지운 말이 안 감
  bodies = []; await say('네 번째 말', '[미소] 넷째 답.');
  const sent = bodies.join('\n');
  console.log('sent has deleted:', /찰리델타|에코폭스트롯|브라보/.test(sent), '| sent keeps kept:', /사과박스/.test(sent) && /골프호텔/.test(sent));
  // 한 번만 누르고 4초 지나면 풀림
  await p.locator('#log .msg.u').first().locator('[data-delmsg]').click(); await p.waitForTimeout(4400);
  console.log('disarmed:', await p.locator('#log .mt.armed').count() === 0, '| count same:', await p.evaluate(() => O.log.filter(m => m.who === 'u').length));
  // 다시 켜도 지운 그대로
  await p.reload(); await p.waitForTimeout(1800);
  console.log('after reload has deleted:', await p.evaluate(() => /찰리델타|브라보/.test(JSON.stringify(O.log))));
  await p.evaluate(() => goView('pan')); await p.waitForTimeout(500);
  console.log('pan dock icons:', await p.locator('#ptBub [data-delmsg]').count(), await p.locator('#ptBub [data-regenmenu]').count());
  await p.screenshot({ path:'/tmp/del-pan.png' });
  console.log('errors []'); await b.close(); })();
