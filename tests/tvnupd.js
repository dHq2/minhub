/* tvnupd v1 (2026-11-15, B) — 업데이트를 게임 대화로: 새 버전이 있으면 띠 대신 장면(어둡게·세희 스탠딩·우리 대화창·타자),
   누르면 채우기 → 다음, 선택지 「예 / 구버전으로 계속」. 구버전 → 한마디 하고 닫힘(띠 없음). 예 → 적용 한마디 → 업데이트(skip 보냄).
   새로 켜진 뒤(updFrom 이 옛 버전) → 사무실에서 세희(가짜 AI)가 숨은 안내를 받아 설명 + ask_boss 선택지(물을 때만 설정이 아니어도). 숨은 말은 화면에 안 보임. 폰·컴퓨터 */
const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const head = [{ type:'message_start', message:{ usage:{ input_tokens:10 } } }];
const txt = t => sseOf([...head, { type:'content_block_start', index:0, content_block:{ type:'text', text:'' } }, { type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } }, { type:'content_block_stop', index:0 },
  { type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }, { type:'message_stop' }]);
const sayThenTool = (t, name, input) => sseOf([...head, { type:'content_block_start', index:0, content_block:{ type:'text', text:'' } }, { type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } }, { type:'content_block_stop', index:0 },
  { type:'content_block_start', index:1, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2, 6), name } }, { type:'content_block_delta', index:1, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } }, { type:'content_block_stop', index:1 },
  { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }, { type:'message_stop' }]);
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width:412, height:915, mob:true, tag:'m' }, { width:1366, height:860, tag:'d' }]){
    const ctx = await b.newContext({ viewport:{ width:vp.width, height:vp.height }, isMobile:!!vp.mob, hasTouch:!!vp.mob, locale:'ko-KR', serviceWorkers:'block' });
    const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' }; let plan = [], bodies = [];
    await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
      if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
      bodies.push(JSON.parse(r.postData())); await new Promise(x => setTimeout(x, 200)); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('[미소] 네.') }); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2200);
    await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; await saveAi(); await loadModels(); refreshBrain(); O.log = []; renderLog();
      window.applyUpdate = () => { window._applied = (window._applied || 0) + 1; }; });
    const tapBox = async () => { const r = await p.locator('.vn-box').boundingBox(); if (vp.mob) await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); else await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); await p.waitForTimeout(250); };
    const ask = () => p.evaluate(() => { waitingSW = { state:'installed', postMessage(m){ window._posted = m; } }; updAsked = false; updDeclined = false; askUpdate(); });
    const R = {};
    /* 1) 장면이 뜸 — 어둡게·세희·우리 대화창, 글이 찍히는 중 */
    await ask(); await p.waitForTimeout(700);
    R.open = await p.evaluate(() => { const v = document.querySelector('.vn'); if (!v) return null; const dim = getComputedStyle(v.querySelector('.vn-dim')), box = getComputedStyle(v.querySelector('.vn-box'));
      return { in:v.classList.contains('in'), dimBg:dim.backgroundColor, dimOp:dim.opacity, name:v.querySelector('.vn-name').textContent, typing:v.querySelector('.vn-text').textContent.length, spr:(v.querySelector('.vn-spr.on') || {}).getAttribute?.('src'), boxBorder:box.borderTopColor, band:$('upd').classList.contains('on') }; });
    await p.screenshot({ path:`/tmp/vnupd-${vp.tag}-1.png` });
    await tapBox();   // 채우기
    R.filled = await p.evaluate(() => document.querySelector('.vn-text').textContent);
    R.triOn = await p.evaluate(() => document.querySelector('.vn-tri').classList.contains('on'));
    await tapBox(); await p.waitForTimeout(1200);   // 다음 줄 — 다 찍히면 선택지
    R.choices = await p.evaluate(() => [...document.querySelectorAll('.vn-c')].map(b => b.textContent));
    R.spr2 = await p.evaluate(() => document.querySelector('.vn-spr.on').getAttribute('src'));
    await tapBox(); R.tapDoesNotPass = await p.evaluate(() => !!document.querySelector('.vn') && document.querySelectorAll('.vn-c').length === 2);
    await p.screenshot({ path:`/tmp/vnupd-${vp.tag}-2.png` });
    /* 2) 구버전으로 계속 → 한마디 → 닫힘, 띠 없음 */
    await p.locator('.vn-c', { hasText:'구버전' }).click(); await p.waitForTimeout(2600);
    R.noLine = await p.evaluate(() => document.querySelector('.vn-text') && document.querySelector('.vn-text').textContent);
    await tapBox(); await p.waitForTimeout(500);
    R.afterNo = await p.evaluate(() => ({ closed:!document.querySelector('.vn'), declined:updDeclined, band:$('upd').classList.contains('on') }));
    /* 3) 예 → 적용 한마디 → 업데이트(skip) */
    await ask(); await p.waitForTimeout(500); await tapBox(); await tapBox(); await p.waitForTimeout(1200);
    await p.locator('.vn-c', { hasText:'예' }).first().click(); await p.waitForTimeout(4600);
    R.afterYes = await p.evaluate(() => ({ line:document.querySelector('.vn-text') && document.querySelector('.vn-text').textContent, posted:window._posted || null, applied:window._applied || 0, from:!!localStorage.getItem('sehee.updFrom') }));
    await p.screenshot({ path:`/tmp/vnupd-${vp.tag}-3.png` });
    console.log(vp.tag, JSON.stringify(R));
    /* 4) 새로 켜진 뒤 — 세희 설명 + 선택지(폰만) */
    if (vp.mob){
      await p.evaluate(() => { sceneClose(); localStorage.setItem('sehee.updFrom', JSON.stringify({ A:'v1.5.24' })); goView('pan'); });
      plan = [sayThenTool('[미소] 새 규정, 적용 마쳤습니다. 인간관계 판 실 위 글씨가 짧아졌고, 기록부는 칸을 누르면 바로 고쳐져요.', 'ask_boss', { question:'관계 칸에 적힌 남의 관계를 실로 옮겨 둘까요?', options:['옮겨 줘', '그대로 둬'] }), txt('[미소] 알겠습니다. 그대로 둘게요.')];
      bodies = [];
      await p.evaluate(() => updAfterBoot());
      let asked = false; for (let i = 0; i < 60 && !asked; i++){ await p.waitForTimeout(250); asked = await p.evaluate(() => !!WORK.ask); }
      const B = bodies[0] || {}, sys = JSON.stringify(B.system || ''), msgs = JSON.stringify(B.messages || []), tools = (B.tools || []).map(t => t.name);
      const R2 = { view:await p.evaluate(() => curView()), asked, askBtns:await p.evaluate(() => [...document.querySelectorAll('#log [data-ask]')].map(b => b.textContent)),
        hiddenShown:await p.evaluate(() => $('log').textContent.includes('앱 안내')), hiddenSent:msgs.includes('앱 안내') && msgs.includes('v1.5.24'), notesSent:/## v1\.5\.2[5-9]/.test(msgs), askTool:tools.includes('ask_boss') };
      await p.screenshot({ path:`/tmp/vnupd-m-brief.png` });
      await p.locator('#log [data-ask="그대로 둬"]').click();
      for (let i = 0; i < 60; i++){ await p.waitForTimeout(250); if (!(await p.evaluate(() => O.busy))) break; }
      R2.after = await p.evaluate(() => ({ tour:!!O.updTour, last:O.log.filter(m => m.who === 's').slice(-1)[0].text.slice(0, 20), shownU:[...document.querySelectorAll('#log .msg.u')].length }));
      R2.askToolLater = await p.evaluate(() => (typeof O !== 'undefined' && !O.updTour && AI.cfg.ask !== 'need'));
      console.log('m brief', JSON.stringify(R2));
      await p.screenshot({ path:`/tmp/vnupd-m-brief2.png` });
    }
    console.log(vp.tag, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
