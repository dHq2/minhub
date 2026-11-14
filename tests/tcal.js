const { chromium } = require('playwright');
// v2.0 (2026-11-15, C) 달력 쪽 — 서랍·연간 폐기. 월간 화이트보드 칠판 + 왼쪽 아래 세희 + 오른쪽 아래 대사창(사무실 대화 그대로·입력)
//   견출지·판 견출지·#cal 로 열림 · ‹ › 와 밀기로 달 바꿈 · 오늘 자석 · 날짜 쪽지에서 넣기 · 세희가 날짜 있는 일을 적으면 저절로 켜지고 메모 그림 + 칸에 써짐
//   v1.0 (옛 서랍 달력 시트) 은 폐기
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const tool = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },
  { type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2, 6), name } },{ type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:0 },
  { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
(async () => { const b = await chromium.launch();
  for (const [name, opt] of [['폰', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['컴', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, locale:'ko-KR', serviceWorkers:'block' });
    const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' }; let plan = [];
    await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
      if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
      await new Promise(x => setTimeout(x, 200)); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('[미소] 네.') }); });
    const p = await ctx.newPage();
    const tap = sel => name === '폰' ? p.locator(sel).first().tap() : p.locator(sel).first().click();
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded && S.today);
    const mon = await p.evaluate(async () => { const pr = await todayPanRef(), t = parseYmd(S.today), y = t.getFullYear(), m = pad(t.getMonth() + 1), sc = secById('sched') ? 'sched' : secs()[0].id;
      pr.items.push({ id:'c1', sec:sc, text:'분기 회의', due:`${y}-${m}-03`, time:'10:00', since:pr.date }, { id:'c2', sec:sc, text:'치과 예약', due:`${y}-${m}-18`, time:'15:30', since:pr.date },
        { id:'c3', sec:'today', text:'보고서 마감', due:`${y}-${m}-18`, since:pr.date }, { id:'c4', sec:sc, text:'친구 생일', due:`${y}-${m}-25`, since:pr.date, done:true });
      await putPan(pr); await goDate(S.today); O.log.push({ who:'s', text:'이번 달은 18일이 제일 바빠요.', face:3, at:Date.now() }); return `${y}-${m}`; });
    // 1) 사무실 견출지로 열기
    await tap('#dwTabs button[data-dw="cal"]'); await p.waitForSelector('#calPage.in'); await p.waitForTimeout(650);
    const st = () => p.evaluate(() => ({ on:CAL.on, drawer:DW.open, title:$('cpTitle').textContent, chips:document.querySelectorAll('#calSheet .cb-it').length, today:!!document.querySelector('#calSheet .cb-c.today'),
      bub:$('cpBub').textContent.slice(0, 40), spr:$('cpSpr').getAttribute('src'), hidden:$('calPage').hidden }));
    console.log(name, '견출지로 열림', JSON.stringify(await st()));
    const geo = await p.evaluate(() => { const r = s => { const b = document.querySelector(s).getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; };
      return { page:r('#calPage'), board:r('.cp-frame'), who:r('.cp-who'), box:r('.cp-box'), magnet:r('.cp-today'), rows:document.querySelectorAll('#calSheet .cb-c').length / 7 }; });
    console.log(name, '자리', JSON.stringify(geo), '| 세희는 왼쪽 아래:', geo.who[0] <= geo.page[0] + 10 && geo.who[3] >= geo.page[3] - 2, '| 대사창은 오른쪽 아래:', geo.box[0] > geo.page[0] + (geo.page[2] - geo.page[0]) * 0.3 && geo.box[3] > geo.page[3] - 40, '| 세희 머리가 칠판을 조금만 가림(60px 안):', geo.board[3] - geo.who[1] < 60);
    await p.screenshot({ path:`/tmp/calp-${name}-1.png` });
    // 2) 날짜 쪽지 + 넣기
    await tap(`#calSheet [data-d="${mon}-18"]`); await p.waitForSelector('#calDay.on');
    console.log(name, '18일 쪽지', await p.evaluate(() => [...document.querySelectorAll('#calDay .cn-it .x')].map(x => x.textContent).join(',')));
    await p.waitForTimeout(260); await p.screenshot({ path:`/tmp/calp-${name}-2.png` });
    await p.locator('#calAdd').fill('16:00 팀 점검'); await tap('#calDay [data-cal="add"]'); await p.waitForTimeout(400);
    console.log(name, '쪽지에서 넣음 → 판에도', await p.evaluate(mon => { const it = S.pan.items.find(i => i.text === '팀 점검'); return it ? it.due + ' ' + it.time : '없음'; }, mon), '| 칸 글 수', await p.evaluate(mon => document.querySelectorAll(`#calSheet [data-d="${mon}-18"] .cb-it`).length + ' +' + ((document.querySelector(`#calSheet [data-d="${mon}-18"] .more`) || {}).textContent || '0'), mon));
    await tap('#calDay [data-cal="dclose"]'); await p.waitForTimeout(250);
    // 3) 달 바꾸기 — › · 밀기 · 오늘 자석
    await tap('[data-cal="nm"]'); await p.waitForTimeout(300); const t1 = await p.evaluate(() => $('cpTitle').textContent);
    const sh = await p.locator('#calSheet').boundingBox();
    await p.mouse.move(sh.x + sh.width * 0.25, sh.y + sh.height * 0.5); await p.mouse.down(); await p.mouse.move(sh.x + sh.width * 0.8, sh.y + sh.height * 0.5, { steps:6 }); await p.mouse.up(); await p.waitForTimeout(300);
    const t2 = await p.evaluate(() => $('cpTitle').textContent + ' 쪽지:' + $('calDay').classList.contains('on'));
    await tap('[data-cal="nm"]'); await tap('[data-cal="nm"]'); await p.waitForTimeout(200); const t3 = await p.evaluate(() => $('cpTitle').textContent);
    await tap('.cp-today'); await p.waitForTimeout(300); const t4 = await p.evaluate(() => $('cpTitle').textContent);
    console.log(name, '달 바꾸기 › / 밀기 / ››(해 넘김) / 오늘 자석:', t1, '/', t2, '/', t3, '/', t4);
    // 4) 대사창에서 말하기 → 사무실 대화와 같은 기록
    await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = true; await saveAi(); await loadModels(); refreshBrain(); });
    plan = [txt('[생각] 18일은 오후가 비어요.')];
    await p.locator('#cpText').fill('18일 언제 비어?'); await tap('#cpGo');
    await p.waitForFunction(() => !O.busy && O.log.some(m => m.who === 's' && /오후가 비어요/.test(m.text)), null, { timeout:15000 }); await p.waitForTimeout(300);
    console.log(name, '대사창 말하기 → 기록', await p.evaluate(() => O.log.slice(-2).map(m => m.who + ':' + m.text.slice(0, 16)).join(' | ')), '| 대사창에 보임', await p.evaluate(() => $('cpBub').textContent.includes('오후가 비어요')), '| 그림', await p.evaluate(() => $('cpSpr').getAttribute('src')));
    // 5) 닫고 사무실로 → 세희가 날짜 있는 일을 적으면 저절로 켜지고 칸에 써짐
    await tap('#cpX'); await p.waitForFunction(() => $('calPage').hidden);
    console.log(name, '닫음', await p.evaluate(() => [CAL.on, curView(), DW.open]));
    plan = [tool('add_item', { section:'sched', text:'거래처 미팅', due:mon + '-21', time:'14:00' }), txt('[미소] 21일 2시에 거래처 미팅 붙여 뒀어요.')];
    await p.locator('#sayText').fill('21일 2시 거래처 미팅'); await tap('#sayGo');
    let sawMemo = false, sawFresh = false, opened = false;
    for (let i = 0; i < 80; i++){ await p.waitForTimeout(100); const s = await p.evaluate(() => ({ on:CAL.on, memo:($('cpSpr').getAttribute('src') || '').includes('vn-memo'), fresh:!!document.querySelector('#calSheet .cb-it.fresh'), busy:O.busy }));
      opened = opened || s.on; sawMemo = sawMemo || s.memo; if (s.fresh && !sawFresh){ sawFresh = true; await p.screenshot({ path:`/tmp/calp-${name}-3.png` }); } if (!s.busy && i > 10) break; }
    await p.waitForFunction(() => !O.busy); await p.waitForTimeout(1200);
    console.log(name, '세희가 적음 → 저절로 켜짐', opened, '| 메모 그림', sawMemo, '| 칸에 써짐(fresh)', sawFresh, '| 21일 칸', await p.evaluate(mon => [...document.querySelectorAll(`#calSheet [data-d="${mon}-21"] .cb-it`)].map(x => x.textContent).join(','), mon),
      '| 끝 그림', await p.evaluate(() => $('cpSpr').getAttribute('src')), '| 대사창', await p.evaluate(() => $('cpBub').textContent.includes('거래처 미팅 붙여')));
    await p.screenshot({ path:`/tmp/calp-${name}-4.png` });
    // 6) 판 쪽 견출지로도, #cal 로도
    await p.evaluate(() => calPageClose()); await p.waitForTimeout(400); await p.evaluate(() => goView('pan')); await p.waitForTimeout(400);
    await tap('#panDw [data-pdw="cal"]'); await p.waitForSelector('#calPage.in'); console.log(name, '판 견출지로 열림', await p.evaluate(() => [CAL.on, curView()]));
    await p.evaluate(() => calPageClose()); await p.goto('http://localhost:8765/sehee/#cal'); await p.waitForFunction(() => typeof CAL !== 'undefined' && CAL.on, null, { timeout:8000 }); console.log(name, '#cal 로 열림', await p.evaluate(() => CAL.on));
    // 7) 다른 서랍을 열면 달력 쪽은 닫힘
    await p.evaluate(() => dwOpen('board')); await p.waitForTimeout(500); console.log(name, '보드 열면 달력 닫힘', await p.evaluate(() => [CAL.on, DW.open]));
    await ctx.close();
  }
  await b.close(); })();
