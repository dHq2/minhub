const { chromium } = require('playwright'); const path = require('path');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
const tool = (name, input) => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2,6), name } },{ type:'content_block_delta', index:0, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
// v1.1 (2026-11-14, C) 액자 모양·비율 셋(가로 두 칸·세로·정사각) · v1.0 인간관계 사진 단서 — 기록부 ＋ 여러 장, 크게 보기(설명·날짜·사람·🔒·‹ ›·지우기), Ctrl+V 붙여넣기, 세희 clue_to_person·읽기, 동기화 키, 사람 떼면 정리, 다시 켜도 남음
const FACE = path.join(__dirname, 'img', 'face.jpg'), SHORT = path.join(__dirname, 'img', 'short.png'), WIDE = path.join(__dirname, 'img', 'wide.jpg'), SQ = path.join(__dirname, 'img', 'square.jpg');
(async () => { const b = await chromium.launch(); const errs = [];
  for (const [name, opt] of [['폰', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['컴', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, serviceWorkers:'block' }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(name + ': ' + e.message));
    const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' }; let plan = [], bodies = [];
    await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
      if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
      bodies.push(JSON.parse(r.postData())); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('[생각] 네.') }); });
    const tap = sel => name === '폰' ? p.locator(sel).first().tap() : p.locator(sel).first().click();
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
    await p.evaluate(async () => { await pplLoad(); PPL.list.push({ id:'ka', name:'김지민 팀장', rel:'같은 팀 선배', group:'직장', note:'', notes:[], links:[], at:Date.now() }, { id:'kb', name:'수진이', rel:'대학 동기', group:'친구', note:'', notes:[], links:[], at:Date.now() }); await pplSave();
      AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; await saveAi(); await loadModels(); refreshBrain(); await dwOpen('people'); await pdOpen('ka'); });
    await p.waitForTimeout(600);
    await p.evaluate(() => document.querySelector('#pdBody .cl-grid').scrollIntoView({ block:'center' })); await p.waitForTimeout(200);
    console.log(name, '빈 갤러리', await p.evaluate(() => [document.querySelectorAll('#pdBody .cl-th').length, !!document.querySelector('#pdBody [data-cladd]'), document.querySelector('#pdBody .cl-hint').textContent.slice(0, 20)].join(' · ')));
    // ＋ 두 장
    const [fc] = await Promise.all([p.waitForEvent('filechooser'), tap('#pdBody [data-cladd]')]); await fc.setFiles([FACE, SHORT]); await p.waitForTimeout(1500);
    const g1 = await p.evaluate(() => ({ 장:document.querySelectorAll('#pdBody .cl-th').length, 섬네일:[...document.querySelectorAll('#pdBody .cl-img')].every(x => /data:image\/jpeg/.test(x.style.backgroundImage)), 목록:CLU.list.length, 키:CLU.list.map(c => 'clue_' + c.id).every(k => syncKey(k)), 글키:syncKey('pplclues') }));
    console.log(name, '두 장 넣음', JSON.stringify(g1), '|', await p.evaluate(() => $('toastMsg').textContent));
    await p.evaluate(() => document.querySelector('#pdBody .cl-grid').scrollIntoView({ block:'center' })); await p.waitForTimeout(200); await p.screenshot({ path:`/tmp/clue-${name}-1.png` });
    // 비율 셋 — 가로·정사각 더 넣고 모양 확인
    const [fc2] = await Promise.all([p.waitForEvent('filechooser'), tap('#pdBody [data-cladd]')]); await fc2.setFiles([WIDE, SQ]); await p.waitForTimeout(1500);
    const shp = await p.evaluate(() => [...document.querySelectorAll('#pdBody .cl-th')].map(b => { const ph = b.querySelector('.cl-ph').getBoundingClientRect(), im = b.querySelector('.cl-img').getBoundingClientRect(), sh = [...b.classList].find(c => /^sh-/.test(c));
      return `${sh}:${(im.width / im.height).toFixed(2)}:${Math.round(ph.width)}px:테두리${Math.round(ph.width - im.width) / 2}`; }).join(' '));
    console.log(name, '비율 셋', shp, '| 테이프', await p.locator('#pdBody .cl-tape').count(), '| 기울기 다름', await p.evaluate(() => new Set([...document.querySelectorAll('#pdBody .cl-th')].map(b => b.style.getPropertyValue('--tilt'))).size > 1));
    await p.evaluate(() => document.querySelector('#pdBody .cl-grid').scrollIntoView({ block:'center' })); await p.waitForTimeout(200); await p.screenshot({ path:`/tmp/clue-${name}-frames.png` });
    await p.evaluate(async () => { for (const c of CLU.list.filter(x => x.shape === 'w' || (x.shape === 's' && x.people.length === 1 && x !== CLU.list[1]))) if (c.shape === 'w' || c.id === CLU.list[CLU.list.length - 1].id) await clueDel(c.id); await pdRender(); });
    // 크게 보기 — 설명·날짜·사람·🔒
    await tap('#pdBody .cl-th'); await p.waitForTimeout(600);
    await p.fill('#clvText', '첫 프로젝트 끝나고 같이 찍은 사진'); await p.locator('#clvText').dispatchEvent('change');
    await p.fill('#clvWhen', '2026-10-30'); await p.locator('#clvWhen').dispatchEvent('change');
    await p.selectOption('#clvAddP', 'kb'); await p.waitForTimeout(300); await tap('[data-clv="lock"]'); await p.waitForTimeout(300);
    const v1 = await p.evaluate(() => { const c = CLU.list[0]; return { 설명:c.text, 언제:c.when, 사람:c.people.join(','), 잠금:!!c.lock, 큰사진:($('clvImg').naturalWidth || 0) > 300, 쪽:document.querySelector('.clv-top span').textContent }; });
    console.log(name, '크게 보기', JSON.stringify(v1)); await p.screenshot({ path:`/tmp/clue-${name}-2.png` });
    await tap('[data-clv="next"]'); await p.waitForTimeout(400); console.log(name, '다음 장', await p.evaluate(() => document.querySelector('.clv-top span').textContent));
    await tap('[data-clv="close"]'); await p.waitForTimeout(500);
    console.log(name, '갤러리 글', await p.evaluate(() => [...document.querySelectorAll('#pdBody .cl-th em')].map(x => x.textContent).join(' / ')), '| 수진이 기록부에도', await p.evaluate(async () => { await pdOpen('kb'); return document.querySelectorAll('#pdBody .cl-th').length; }));
    // 붙여넣기(컴퓨터)
    await p.evaluate(() => pdOpen('ka')); await p.waitForTimeout(300);
    const pasted = await p.evaluate(async () => { const blob = await (await fetch('/tests/img/face.jpg')).blob(), dt = new DataTransfer(); dt.items.add(new File([blob], 'p.jpg', { type:'image/jpeg' }));
      document.dispatchEvent(new ClipboardEvent('paste', { clipboardData:dt, bubbles:true })); await new Promise(r => setTimeout(r, 1500)); return cluesOf('ka').length; });
    console.log(name, '붙여넣기 뒤', pasted, '장 | 크게 보기 바로 열림', await p.evaluate(() => $('clv').classList.contains('on')));
    await p.evaluate(() => clueClose()); await p.waitForTimeout(300);
    // 지우기(두 번)
    await p.evaluate(() => clueOpen(cluesOf('ka')[cluesOf('ka').length - 1].id, 'ka')); await p.waitForTimeout(300);
    await tap('[data-clv="del"]'); await p.waitForTimeout(150); const still = await p.evaluate(() => cluesOf('ka').length); await tap('[data-clv="del"]'); await p.waitForTimeout(400);
    console.log(name, '지우기 한 번엔', still, '| 두 번 뒤', await p.evaluate(() => cluesOf('ka').length), '| 키도 지움', await p.evaluate(async () => (await kvKeys()).filter(k => /^clue_/.test(k)).length));
    await p.evaluate(() => clueClose()); await p.evaluate(() => pdClose());
    // 세희 — 채팅 사진으로
    await p.evaluate(async () => { const blob = await (await fetch('/tests/img/face.jpg')).blob(), at = Date.now(); O.log.push({ who:'u', text:'이 사진 수진이 단서에 붙여줘, 졸업식 날', at, pics:1 }); O.thumbs[at] = [URL.createObjectURL(blob)]; await saveLog(); goView('office'); });
    plan = [tool('clue_to_person', { people:['수진이'], photo:1, text:'졸업식 날 같이 찍음', when:'2026-02-20' }), txt('[미소] 수진이 단서에 붙였어요.')];
    await p.locator('#sayText').fill('붙였어?'); await p.locator('#sayGo').click();
    for (let i = 0; i < 80; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; }
    console.log(name, '세희 붙임', await p.evaluate(() => cluesOf('kb').map(c => `${c.when} ${c.text} ${c.by}`).join(' / ')), '| 대화 줄', await p.evaluate(() => O.log.filter(m => m.board).pop().text));
    const sys = JSON.stringify(bodies[0].tools || []); console.log(name, '도구에 clue_to_person', sys.includes('clue_to_person'));
    const ctxPpl = await p.evaluate(async () => (await runPeopleTool({ name:'read_person', args:{ person:'수진이' } })).person);
    console.log(name, '세희가 읽는 기록', ctxPpl.includes('사진 단서(모두 2장') && ctxPpl.includes('2026-02-20 졸업식 날 같이 찍음') && ctxPpl.includes('[비공개] 첫 프로젝트'));
    // 다시 켜도 + 떼기 정리
    await p.reload(); await p.waitForTimeout(1800);
    console.log(name, '다시 켬', await p.evaluate(async () => { CLU.list = null; await clueLoad(); return CLU.list.length + '장'; }));
    console.log(name, '김지민 떼기', await p.evaluate(async () => { await runPeopleTool({ name:'remove_person', args:{ person:'김지민 팀장' } }); return CLU.list.map(c => c.people.join('+')).join(' / ') + ' | 키 ' + (await kvKeys()).filter(k => /^clue_/.test(k)).length; }));
    await ctx.close();
  }
  console.log('errors', errs); await b.close(); })();
