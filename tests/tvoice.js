const { chromium } = require('playwright');
// v1.0 (2026-11-15, C) 보스 네 가지 중 ②③④ — 판 세희 말투 지침 · 세희 메모에 세희 얼굴(보스가 고치면 빠짐) · 한마디 필수(앱 임시 한마디 · 판 고친 차례에 안 쓰면 한 번 더 시킴) · 표정 도장 그림 · 긴 답 문단 나누기
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const tool = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },
  { type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2, 6), name } },{ type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:0 },
  { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
const LONG = '[미소] 보스 일정은 이래요. 오늘 안에 할 일은 거래처 단가 답변인데, 팀장님이 따로 하신다고 하니 보스는 안 하셔도 돼요. 화요일 11월 17일에는 인사팀에 서류 원본을 가져다 드려야 해요. 수요일 11월 18일 오전 10시에는 설비 업체가 B동 문 점검하러 와요. 전날 확인 전화를 한 번 더 하셔야 해요. 금요일 11월 20일 18시 반은 송별회예요. 회비는 2만 원이에요.';
(async () => { const b = await chromium.launch();
  for (const [name, opt] of [['폰', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['컴', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, locale:'ko-KR', serviceWorkers:'block' });
    const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' }; let plan = [], bodies = [];
    await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
      if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
      bodies.push(JSON.parse(r.postData())); await new Promise(x => setTimeout(x, 120)); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('[미소] 네.') }); });
    const p = await ctx.newPage();
    const tap = sel => name === '폰' ? p.locator(sel).first().tap() : p.locator(sel).first().click();
    await p.goto('http://localhost:8765/sehee/'); await p.waitForFunction(() => typeof S !== 'undefined' && S.pan && S.today);
    // 1) 앱이 연 판 — 한마디가 비지 않음 + 도장이 얼굴 그림
    console.log(name, '앱 판 한마디', JSON.stringify(await p.evaluate(() => ({ line:S.pan.line, auto:!!S.pan.lineAuto, box:$('line').value.slice(0, 20), stamp:($('stamp').querySelector('img') || {}).getAttribute ? $('stamp').querySelector('img').getAttribute('src') : '글자' }))));
    await tap('#stamp'); await p.waitForTimeout(150); console.log(name, '도장 누름', await p.evaluate(() => S.pan.face + ' → ' + $('stamp').querySelector('img').getAttribute('src')));
    // 2) 세희가 메모와 함께 적고 한마디를 빠뜨림 → 한 번 더(set_line 만) → 한마디 바뀜
    await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; await saveAi(); await loadModels(); refreshBrain(); goView('office'); });
    plan = [tool('add_item', { section:'today', text:'등본 원본을 인사팀에 드려야 합니다', note:'원본만 받는다고 했습니다. 사본은 안 됩니다.', due:'2026-11-17' }), txt('[미소] 17일에 등본 드리는 거 적어 뒀어요.'),
      tool('set_line', { line:'이번 주는 서류 하나만 챙기시면 돼요.\n17일 등본부터 잊지 마세요.', face:'^_^' })];
    bodies = [];
    await p.locator('#sayText').fill('17일에 등본 원본 인사팀에 줘야 해'); await tap('#sayGo');
    await p.waitForFunction(() => !O.busy && O.log.some(m => m.who === 's' && /등본 드리는 거/.test(m.text)), null, { timeout:15000 }); await p.waitForTimeout(500);
    const last = bodies[bodies.length - 1];
    console.log(name, '부른 횟수', bodies.length, '| 마지막 부름 = 한마디만', JSON.stringify({ tools:(last.tools || []).map(t => t.name), choice:last.tool_choice || null, note:/set_line 하나만/.test(JSON.stringify(last.messages.slice(-1))) }));
    console.log(name, '한마디 덧씀', JSON.stringify(await p.evaluate(() => ({ line:S.pan.line.slice(0, 22), auto:!!S.pan.lineAuto, face:S.pan.face }))), '| 대화에 안 섞임', await p.evaluate(() => !O.log.some(m => /set_line|앱 안내/.test(m.text || ''))));
    console.log(name, '지침 판 말투', JSON.stringify(bodies[0].system).includes("할 일은 '~해야 합니다'"), '| 문단 지침', JSON.stringify(bodies[0].system).includes('문단 나누기'), '| 한마디 필수 지침', JSON.stringify(bodies[0].system).includes('반드시 마지막에'));
    // 3) 한마디를 쓴 차례면 더 부르지 않음
    await p.evaluate(() => calPageClose()); await p.waitForTimeout(400);   // 날짜 있는 일이라 달력 쪽이 저절로 열림 — 닫고 이어감
    plan = [tool('update_item', { id:await p.evaluate(() => S.pan.items.find(i => /등본/.test(i.text)).id, null), comment:'원본을 미리 떼 두시면 좋겠습니다' }), tool('set_line', { line:'등본만 챙기시면 돼요.', face:'-_-' }), txt('[미소] 코멘트 달았어요.')]; bodies = [];
    await p.locator('#sayText').fill('코멘트 달아줘'); await tap('#sayGo'); await p.waitForFunction(() => !O.busy && O.log.some(m => /코멘트 달았어요/.test(m.text || '')), null, { timeout:15000 }); await p.waitForTimeout(300);
    console.log(name, '한마디 쓴 차례 → 부른 횟수', bodies.length, '(3이면 정상)');
    // 4) 판 — 세희 메모에 세희 얼굴, 보스가 고치면 빠짐
    await p.evaluate(() => calPageClose()); await p.waitForTimeout(400);
    await p.evaluate(() => goView('pan')); await p.waitForTimeout(600);
    const id = await p.evaluate(() => S.pan.items.find(i => /등본/.test(i.text)).id);
    const row = () => p.evaluate(id => { const r = document.querySelector(`.it[data-id="${id}"]`); return { by:!!r.querySelector('.memo-by .sh-ico'), sh:r.querySelector('.memo-w').classList.contains('sh'), cm:!!r.querySelector('.icm .sh-ico'), mark:!!r.querySelector('.sh-by .sh-ico'), noteBy:findItem(id).noteBy || '' }; }, id);
    console.log(name, '세희 메모', JSON.stringify(await row()));
    await p.evaluate(id => document.querySelector(`.it[data-id="${id}"]`).scrollIntoView({ block:'center' }), id); await p.waitForTimeout(200);
    await p.screenshot({ path:`/tmp/voice-${name}-1.png` });
    await p.locator(`textarea[data-memo="${id}"]`).click(); await p.keyboard.press('End'); await p.keyboard.type(' 보스 확인'); await p.waitForTimeout(200);
    console.log(name, '보스가 고친 뒤', JSON.stringify(await row()));
    await p.evaluate(() => document.activeElement.blur()); await p.reload(); await p.waitForFunction(() => typeof S !== 'undefined' && S.pan);
    console.log(name, '다시 켬', await p.evaluate(id => findItem(id).noteBy || '보스 메모', id));
    // 5) 긴 답 문단 나누기
    await p.evaluate(async () => { AI.cfg.work = false; goView('office'); }); plan = [txt(LONG)];
    await p.locator('#sayText').fill('이번 주 일정 정리해줘'); await tap('#sayGo'); await p.waitForFunction(() => !O.busy && O.log.some(m => /송별회/.test(m.text || '')), null, { timeout:15000 });
    console.log(name, '문단', JSON.stringify(await p.evaluate(() => { const t = O.log.filter(m => m.who === 's' && /송별회|일정은 이래요|화요일|수요일/.test(m.text || '')).map(m => m.text).join('\n\n'); return t.split(/\n\s*\n/).map(x => x.slice(0, 14)); })));
    await p.waitForTimeout(300); await p.screenshot({ path:`/tmp/voice-${name}-2.png` });
    await ctx.close();
  }
  await b.close(); })();
