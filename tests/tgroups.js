const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const tool = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2,6), name } },{ type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
// v1.0 (2026-11-14) 인간관계 판 보편화 — 처음 쓰는 사람 기본 무리, 쓰던 무리 그대로 이어받기, 무리 고치기(이름·색·순서·더하기·빼기), 세희 edit_groups
(async () => { const b = await chromium.launch();
  const mk = async () => { const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' }); const p = await ctx.newPage(); await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1600); return p; };
  // 1) 처음 쓰는 사람
  let p = await mk();
  console.log('fresh groups:', await p.evaluate(async () => { await pplLoad(); return GROUPS.join('·'); }));
  // 2) 예전 무리(학생·학부모)를 쓰던 사람 — 그대로 이어받기
  p = await mk();
  console.log('legacy groups:', await p.evaluate(async () => { await kvSet('people', { list:[{ id:'a1', name:'김지민 팀장', rel:'팀장', group:'직장', notes:[], links:[] }, { id:'a2', name:'수빈 어머니', rel:'상담', group:'학생·학부모', notes:[], links:[] }, { id:'a3', name:'옛무리사람', group:'없는무리', notes:[], links:[] }], theme:'cork' });
    PPL.list = null; await pplLoad(); await new Promise(r => setTimeout(r, 50)); const d = await kvGet('people'); return GROUPS.join('·') + ' | saved:' + (d.groups || []).map(g => g.name).join('·') + ' | a2:' + pplFind('a2').group + ' | a3:' + pplFind('a3').group; }));
  // 3) 무리 고치기 화면
  await p.evaluate(async () => { await dwOpen('people'); }); await p.waitForTimeout(500);
  await p.locator('#ppGroups').click(); await p.waitForTimeout(300);
  console.log('rows:', await p.locator('#sheet .gq-row').count(), '| etc disabled:', await p.locator('#sheet [data-gname]').last().isDisabled());
  await p.locator('#sheet [data-gname="0"]').fill('회사');                        // 직장 → 회사
  await p.locator('#sheet [data-gact="color"][data-i="0"]').click();
  await p.locator('#sheet [data-gact="add"]').click(); await p.waitForTimeout(100);
  const n = await p.locator('#sheet [data-gname]').count(); await p.locator(`#sheet [data-gname="${n - 2}"]`).fill('동호회');
  const ix = await p.evaluate(() => PPL.gEdit.findIndex(g => g.name === '학생·학부모'));
  await p.locator(`#sheet [data-gact="del"][data-i="${ix}"]`).click(); await p.waitForTimeout(100);
  console.log('del armed label:', await p.locator(`#sheet [data-gact="del"][data-i="${ix}"]`).textContent());
  await p.locator(`#sheet [data-gact="del"][data-i="${ix}"]`).click(); await p.waitForTimeout(100);
  await p.screenshot({ path:'/tmp/groups-sheet.png' });
  await p.locator('#sheet [data-gact="save"]').click(); await p.waitForTimeout(400);
  console.log('after save:', await p.evaluate(() => GROUPS.join('·') + ' | a1:' + pplFind('a1').group + ' | a2:' + pplFind('a2').group + ' | color changed:' + (GROUP_COLOR['회사'] !== '#3a6b64')));
  await p.screenshot({ path:'/tmp/groups-board.png' });
  // 4) 빈 이름 막기
  await p.locator('#ppGroups').click(); await p.waitForTimeout(200); await p.locator('#sheet [data-gname="0"]').fill(''); await p.locator('#sheet [data-gact="save"]').click(); await p.waitForTimeout(150);
  console.log('empty name msg:', await p.locator('#gqMsg').textContent()); await p.evaluate(() => closeSheet());
  // 5) 세희 edit_groups + 맥락에 무리 목록
  const r = await p.evaluate(async () => { const x = await runPeopleTool({ name:'edit_groups', args:{ add:['교회'], rename:[{ from:'동호회', to:'운동 모임' }], remove:['기타'] } }); return JSON.stringify(x.groups); });
  console.log('edit_groups:', r);
  console.log('context has 무리:', await p.evaluate(async () => (await pplContext()).split('\n')[0]));
  console.log('tool enum:', await p.evaluate(() => PEOPLE_TOOLS().find(t => t.name === 'add_person').schema.properties.group.enum.join('·')));
  // 6) 다시 켜도 남음
  await p.reload(); await p.waitForTimeout(1500);
  console.log('after reload:', await p.evaluate(async () => { await pplLoad(); return GROUPS.join('·'); }));
  console.log('errors []'); await b.close(); })();
