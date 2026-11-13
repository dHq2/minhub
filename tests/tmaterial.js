const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const tool = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2,6), name } },{ type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
// v1.0 (2026-11-13, C) 세희 기억 — 오래된 해독본은 잘려 가되 자료 번호·안내가 붙고, read_material 로 목록·찾기·전문을 다시 읽는다. 세희가 자기 머리를 알고, "소넷으로" 하면 그 차례만 큰 머리
(async () => { const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = [], bodies = [];
  await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }, { id:'claude-sonnet-5-5' }] }) });
    bodies.push(JSON.parse(r.postData())); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('[생각] 네.') }); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
  // 가짜 회식 해독본(실명 아님) — 앞 400자 뒤에 '끝까지 나온 말'이 있다
  const lines = ['[회식 대화 해독본 · 가짜]', ...Array.from({ length:40 }, (_, i) => `${i % 2 ? '김가람 조교' : '보스'}: 이야기 ${i + 1}번째 줄, 학원 일과 학교 생활 얘기`), '김가람 조교: 다음 달엔 교생 실습이 있어서 수요일은 못 나와요', '보스: 그럼 수요일은 다른 조교로 바꿔 둘게요', '김가람 조교: 마지막으로, 회식 고마웠어요'];
  const OCR = lines.join('\n');
  await p.evaluate(async ocr => { const t0 = Date.now() - 600000;
    O.log.push({ who:'u', text:'어제 회식 녹음 캡처야, 정리해줘', at:t0, pics:3, ocr, ocrMeta:{ lines:43 } }, { who:'s', text:'[미소] 판에 정리해 뒀어요.', face:2, at:t0 + 1000 },
      { who:'u', text:'고마워', at:t0 + 2000 }, { who:'s', text:'[미소] 네.', face:2, at:t0 + 3000 }, { who:'u', text:'오늘 날씨 어때', at:t0 + 4000 }, { who:'s', text:'[생각] 맑아요.', face:1, at:t0 + 5000 });
    await saveLog(); AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; await saveAi(); await loadModels(); refreshBrain(); }, OCR);
  const wait = async () => { for (let i = 0; i < 80; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; } await p.waitForTimeout(300); };
  const id = await p.evaluate(() => matId(O.log[O.log.length - 6]));
  plan = [tool('read_material', { id, find:'수요일' }), tool('read_material', { id }), txt('[생각] 마지막은 김가람 조교가 "회식 고마웠어요"라고 한 데서 끝나요.')];
  await p.locator('#sayText').fill('김가람 조교랑 회식 대화 어디까지 나와 있어? 정확하게'); await p.locator('#sayGo').click(); await wait();
  const b0 = bodies[0], sys0 = JSON.stringify(b0.system), msgs0 = JSON.stringify(b0.messages);
  console.log('모델(평소):', b0.model, '| 머리 줄:', sys0.includes('너의 머리(모델): 지금 Haiku 5.5'), sys0.includes('긴 글·사진이 오면 그 차례는 Sonnet 5.5'), sys0.includes('소넷으로'));
  console.log('잘린 안내:', msgs0.includes('앞부분만 보임') && msgs0.includes('자료 번호 ' + id), '| 끝부분은 안 감:', !msgs0.includes('회식 고마웠어요'), '| 도구 목록에 read_material:', JSON.stringify(b0.tools).includes('read_material'));
  const r1 = JSON.stringify(bodies[1].messages), r2 = JSON.stringify(bodies[2].messages);
  console.log('찾기 결과에 수요일 두 줄:', r1.includes('수요일은 못 나와요') && r1.includes('수요일은 다른 조교로'), '| 줄번호:', /4[23]: /.test(r1));
  console.log('전문 결과에 끝줄:', r2.includes('회식 고마웠어요'), '| 대화에 보인 줄:', await p.evaluate(() => O.log.filter(m => m.who === 'a' && m.read).slice(-2).map(m => m.text).join(' / ')));
  // 목록 · 없는 번호 · latest
  console.log('목록·latest·없는 번호:', await p.evaluate(() => { const l = readMaterial({}), x = readMaterial({ id:'latest' }), n = readMaterial({ id:'mzzzz' });
    return [l.materials.length, l.materials[0].kind, x.chars, n.ok, n.materials.length].join(' · '); }));
  // 긴 자료 나눠 읽기
  console.log('나눠 읽기:', await p.evaluate(() => { const at = Date.now(); O.log.push({ who:'u', text:'문서', at, docs:['가짜 긴 문서.txt'], doc:'가'.repeat(45000) });
    const a = readMaterial({ id:matId(O.log[O.log.length - 1]) }), c = readMaterial({ id:matId(O.log[O.log.length - 1]), from:a.next_from });
    O.log.pop(); return [a.text.length, a.next_from, c.from, c.text.length, !!c.next_from].join(' · '); }));
  // 소넷으로 — 그 차례만 큰 머리
  bodies = []; plan = [txt('[미소] 소넷으로 다시 볼게요.')];
  await p.locator('#sayText').fill('소넷으로 다시 생각해봐'); await p.locator('#sayGo').click(); await wait();
  console.log('소넷 차례 모델:', bodies[0].model, '| 머리 줄:', JSON.stringify(bodies[0].system).includes('지금 Sonnet 5.5'));
  bodies = []; plan = [txt('[미소] 네.')];
  await p.locator('#sayText').fill('고마워'); await p.locator('#sayGo').click(); await wait();
  console.log('다음 차례 모델:', bodies[0].model);
  await p.screenshot({ path:'/tmp/material.png' });
  console.log('errors', errs); await b.close(); })();
