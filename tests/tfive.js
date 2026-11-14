/* tfive v1 (2026-11-15, B) — 보스 써 보고 다섯 가지(11-15 04:36)
   ⑤ 위 대화: 판 적기 기록 11줄·나눠진 말풍선이 있어도 열 마디 위 붙여 넣은 글이 기록 창에 남음 · 붙여 넣은 글도 자료 · read_chat 도구
   ① 자료 지침: 묻지 않고 판에 적고 말로 정리(보고서 고르기 없음) ③ 쓰는 중에 차례대로 말풍선(뒤에서 쪼개기 없음)
   ② 제목 '몇 시 보고서'까지 한 줄 · 누르면 바로 아래 펼침 목록(아래 창 없음) ④ 꺼 둔 사이 올라간 업데이트도 세희가 한마디. 폰·컴퓨터. 가짜 이름만 */
const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const head = [{ type:'message_start', message:{ usage:{ input_tokens:10 } } }];
const txtChunks = parts => sseOf([...head, { type:'content_block_start', index:0, content_block:{ type:'text', text:'' } }, ...parts.map(t => ({ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } })), { type:'content_block_stop', index:0 },
  { type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }, { type:'message_stop' }]);
const txt = t => txtChunks([t]);
const P1 = '오늘 운영방에서는 아침에 새 과장님 인사가 있었고, 오전에 B동 3번 문 고장 이야기가 나왔어요.', P2 = '점심 무렵에는 설비 업체가 바뀌었다는 말이 있었고, 수요일 오전 열 시에 오기로 했어요. 전날 확인 전화가 필요해요.', P3 = '오후에는 연차 계획 공지를 올렸다가 받는 사람을 고쳐 다시 올렸어요.';
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width:412, height:915, mob:true, tag:'m' }, { width:1366, height:860, tag:'d' }]){
    const ctx = await b.newContext({ viewport:{ width:vp.width, height:vp.height }, isMobile:!!vp.mob, hasTouch:!!vp.mob, locale:'ko-KR', serviceWorkers:'block' });
    const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' }; let plan = [], bodies = [];
    await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
      if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
      bodies.push(JSON.parse(r.postData())); await new Promise(x => setTimeout(x, 150)); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:plan.shift() || txt('[0] 네.') }); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2000);
    await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; await saveAi(); await loadModels(); refreshBrain(); });
    const R = {};
    /* ⑤ 기록: 붙여 넣은 글(1번째 보스 말) → 세희 말풍선 3개 → 판 적기 11줄 → 보스·세희 9마디 더 */
    await p.evaluate(() => { const t0 = Date.now() - 3600e3; let k = 0; const at = () => t0 + (k++) * 1000;
      const paste = '`가상물류 운영방\n\n2026년 11월 16일 월요일\n' + Array.from({ length:60 }, (_, i) => `[반장${i % 5}] [오전 ${8 + (i % 9)}:${String(i % 60).padStart(2, '0')}] ${i === 7 ? '한빛설비 대신 대원설비로 바뀜, 수요일 10시 방문' : '평범한 운영 이야기 ' + i}`).join('\n');
      O.log = [{ who:'u', text:'오늘 있던 일 좀 봐 줘\n\n' + paste, at:at() }, { who:'s', text:'자료 받았어요.', at:at(), part:true }, { who:'s', text:'날짜가 하나 걸려요.', at:at(), part:true }, { who:'s', text:'말로 할까요?', at:at() }];
      O.log.push({ who:'u', text:'판에 적어 줘', at:at() }); for (let i = 0; i < 11; i++) O.log.push({ who:'a', text:'판에 적음 ' + i, at:at() }); O.log.push({ who:'s', text:'적었어요.', at:at() });
      for (let i = 0; i < 8; i++){ O.log.push({ who:'u', text:'짧은 말 ' + i, at:at() }); O.log.push({ who:'s', text:'네 ' + i, at:at(), part:true }); O.log.push({ who:'s', text:'그렇군요 ' + i, at:at() }); }
      renderLog(); });
    R.ctx = await p.evaluate(() => { const ms = toMessages(O.log), all = JSON.stringify(ms); return { n:ms.length, hasPaste:all.includes('가상물류 운영방'), cutNote:all.includes('read_material'), oldLen:O.log.slice(-24).some(m => (m.text || '').includes('가상물류')) }; });
    R.material = await p.evaluate(() => { const r = readMaterial({}); return (r.materials || []).map(x => x.kind); });
    R.matFind = await p.evaluate(() => { const r = readMaterial({ id:'latest', find:'대원설비' }); return r.hits; });
    R.chatFind = await p.evaluate(() => { const r = readChat({ find:'대원설비' }); return r.hits; });
    R.chatBack = await p.evaluate(() => { const r = readChat({ back:8, count:3 }); return { more:r.more_before, first:(r.shown || '').split('\n')[0].slice(-12) }; });
    /* ③ + ① — 문단 셋이 조각조각 흘러옴 */
    plan = [txtChunks([P1.slice(0, 30), P1.slice(30) + '\n\n' + P2.slice(0, 20), P2.slice(20) + '\n\n', P3.slice(0, 15), P3.slice(15)])];
    bodies = []; const n0 = await p.evaluate(() => O.log.length);
    await p.fill('#sayText', '오늘 무슨 일 있었어?'); await p.click('#sayGo').catch(async () => { await p.keyboard.press('Enter'); });
    for (let i = 0; i < 40; i++){ await p.waitForTimeout(150); if (!(await p.evaluate(() => O.busy))) break; }
    const B0 = bodies[0] || {}, sys = JSON.stringify(B0.system || ''), tools = (B0.tools || []).map(t => t.name);
    R.prompt = { noAskReport:!sys.includes('보고서로 만들어 보드에 올릴까요'), boardAndTalk:sys.includes('묻지 않고 두 가지'), readChatRule:sys.includes('read_chat'), toolReadChat:tools.includes('read_chat'), sentPaste:JSON.stringify(B0.messages || []).includes('가상물류 운영방') };
    R.bubbles = await p.evaluate(n0 => O.log.slice(n0).filter(m => m.who === 's').map(m => m.text.slice(0, 12)), n0);
    R.noDup = await p.evaluate(n0 => { const t = O.log.slice(n0).filter(m => m.who === 's').map(m => m.text); return t.every((x, i) => t.every((y, j) => i === j || !y.includes(x))); }, n0);
    R.liveLog = await p.evaluate(() => (typeof DEV !== 'undefined' && DEV.log ? DEV.log : []).filter ? 0 : 0);
    await p.screenshot({ path:`/tmp/vfive-${vp.tag}-talk.png` });
    /* ② 제목·목록 */
    await p.evaluate(() => goView('pan')); await p.waitForTimeout(700);
    R.title = await p.evaluate(() => { const d = $('day'); return { text:d.textContent, fits:d.scrollWidth <= d.clientWidth + 1 }; });
    await p.click('#day'); await p.waitForTimeout(400);
    R.drop = await p.evaluate(() => { const d = $('rlDrop'), nav = document.querySelector('.hrow.nav'); if (!d) return null; const r = d.getBoundingClientRect(), n = nav.getBoundingClientRect();
      return { on:d.classList.contains('on'), below:r.top >= n.bottom - 2, rows:d.querySelectorAll('.rl-row').length, sheet:$('sheet').classList.contains('on'), arrow:$('day').textContent.includes('▴') }; });
    await p.screenshot({ path:`/tmp/vfive-${vp.tag}-drop.png` });
    await p.click('#day'); await p.waitForTimeout(300); R.toggleOff = await p.evaluate(() => !$('rlDrop').classList.contains('on'));
    await p.click('#day'); await p.waitForTimeout(300); await p.mouse.click(vp.width / 2, vp.height - 120); await p.waitForTimeout(300);
    R.outsideOff = await p.evaluate(() => !$('rlDrop').classList.contains('on'));
    /* ④ 꺼 둔 사이 업데이트(누르지 않음) → 세희 한마디 — 머리 있음/없음 */
    await p.evaluate(() => goView('office'));
    plan = [txt('새 규정, 적용 마쳤습니다. 판 제목에 몇 시 보고서인지 보이고, 위 대화도 잘 찾아요.')]; bodies = [];
    await p.evaluate(() => { localStorage.removeItem('sehee.updFrom'); localStorage.setItem('sehee.seen', JSON.stringify({ ...updSeen(), A:'v1.5.27' })); updAfterBoot(); });
    for (let i = 0; i < 40; i++){ await p.waitForTimeout(200); if (bodies.length && !(await p.evaluate(() => O.busy))) break; }
    R.updAuto = await p.evaluate(() => ({ band:$('upd').classList.contains('on'), hidden:O.log.some(m => m.hide && m.upd && m.upd.from === 'v1.5.27'), said:(O.log.filter(m => m.who === 's').slice(-1)[0] || {}).text }));
    R.updNotes = JSON.stringify((bodies[0] || {}).messages || []).includes('## v1.5.3');
    await p.evaluate(async () => { AI.cfg.keys.anthropic = ''; await saveAi(); refreshBrain(); localStorage.setItem('sehee.seen', JSON.stringify({ ...updSeen(), A:'v1.5.30' })); updAfterBoot(); });
    await p.waitForTimeout(1500);
    R.updNoAI = await p.evaluate(() => (O.log.filter(m => m.who === 's').slice(-1)[0] || {}).text.slice(0, 60));
    console.log(vp.tag, JSON.stringify(R));
    console.log(vp.tag, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
