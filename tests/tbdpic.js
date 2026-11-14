const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const tools = list => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } }, ...list.flatMap(([name, input], i) => [
  { type:'content_block_start', index:i, content_block:{ type:'tool_use', id:'tu' + Math.random().toString(36).slice(2, 7), name } },
  { type:'content_block_delta', index:i, delta:{ type:'input_json_delta', partial_json:JSON.stringify(input) } }, { type:'content_block_stop', index:i }]),
  { type:'message_delta', delta:{ stop_reason:'tool_use' }, usage:{ output_tokens:5 } }]);
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10 } } },{ type:'content_block_start', index:0, content_block:{ type:'text', text:'' } },{ type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } },{ type:'content_block_stop', index:0 },{ type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }]);
/* tbdpic v1 (2026-11-15, B) — 보드 사진첩: 세희가 서류 사진을 keep_photo 로 넣으면 한 줄 보고 + 보드 견출지 「볼 거」(화면 안 옮김),
   이 기기 원본(bdpic_, 동기화 안 함)과 서버 사본(bdp_, 1024px, 동기화) 따로, 보드 「사진첩」 칸에 날짜별 액자, 누르면 크게, ✕ 로 빼기 + 되돌리기,
   서버 몫을 넘으면 오래된 서버 사본만 내림(이 기기 원본은 남음), 원본·사본 다 없으면 「이 기기에 없음」. 가짜 서류 그림만 */
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' };
  let plan = [];
  await ctx.route('https://api.anthropic.com/**', async route => {
    const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }] }) });
    const step = plan.shift() || txt('네.'); await new Promise(r => setTimeout(r, 300));
    return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:step });
  });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded && S.today);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); await saveAi(); await loadModels(); refreshBrain();
    const doc = (title, lines, w, h) => new Promise(ok => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#fdfdf8'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#222'; g.font = 'bold 54px sans-serif'; g.fillText(title, 60, 110); g.font = '38px sans-serif'; lines.forEach((t, i) => g.fillText(t, 70, 210 + i * 70));
      for (let i = 0; i < 2000; i++){ g.fillStyle = `rgba(0,0,0,${Math.random() * .05})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); } c.toBlob(ok, 'image/jpeg', .9); });
    const b1 = await doc('신규입사자 제출서류', ['1. 통장사본', '2. 주민등록등본 1부', '3. 졸업증명서', '4. 경력증명서', '5. 반명함 사진', '※ 11/20(금)까지 총무 제출'], 1280, 1700);
    const b2 = await doc('가상 점심 사진', ['(음식)'], 1280, 960);
    const at = Date.now() - 5000; O.log.push({ who:'u', text:'이거 원래 단체방에 올려도 되는거야?', at, pics:2 }); O.thumbs[at] = [URL.createObjectURL(b1), URL.createObjectURL(b2)]; saveLog(); renderLog(); });
  const idle = async () => { for (let i = 0; i < 80; i++){ await p.waitForTimeout(200); if (!(await p.evaluate(() => O.busy))) return; } };
  const R = {};
  plan = [ tools([['keep_photo', { photo:1, title:'신규입사자 제출서류 안내' }]]), txt('[미소] 개인정보가 있어서 단체방보단 직접 내는 게 좋아요. 서류 안내는 사진첩에 넣어 뒀어요.') ];
  await p.locator('#sayText').fill('세희야 이거 원래 단체방에 올려도 되는거야?'); await p.locator('#sayGo').click(); await idle(); await p.waitForTimeout(300);
  R.turn = await p.evaluate(async () => { const l = await bpLoad(), x = l[0] || {}, loc = x.id && await kvGet('bdpic_' + x.id), srv = x.id && await kvGet('bdp_' + x.id);
    const mi = srv && await new Promise(ok => { const i = new Image(); i.onload = () => ok([i.naturalWidth, i.naturalHeight]); i.src = srv.mid; });
    return { n:l.length, title:x.title, by:x.by, view:curView(), drawer:DW.open || null, label:(document.querySelector('#dwTabs [data-dw="board"]').classList.contains('see') ? document.querySelector('#dwTabs [data-dw="board"]').dataset.see : null),
      note:O.log.some(m => /보드 사진첩에 넣었어요 — 신규입사자/.test(m.text || '')), local:!!(loc && loc.full instanceof Blob), localKB:loc && Math.round(loc.full.size / 1024), srvPx:mi, srvKB:srv && Math.round(srv.mid.length * .75 / 1024),
      syncBdp:syncKey('bdp_' + x.id), syncLocal:syncKey('bdpic_' + x.id), syncList:syncKey('bdpics') }; });
  await p.screenshot({ path:'/tmp/vbdpic-1.png' });
  await p.evaluate(async () => { await dwOpen('board'); }); await p.waitForTimeout(500);
  await p.locator('#wbSeg [data-mode="pics"]').click(); await p.waitForTimeout(500);
  R.gallery = await p.evaluate(() => ({ tiles:document.querySelectorAll('#wbGrid [data-bp]').length, img:!!document.querySelector('#wbGrid [data-bp] img'), day:(document.querySelector('#wbGrid .bp-day h4') || {}).textContent, pic:!$('wbPic').hidden, memo:$('wbMemo').hidden, count:$('wbCount').textContent, labelGone:!document.querySelector('#dwTabs .see') }));
  await p.screenshot({ path:'/tmp/vbdpic-2.png' });
  await p.locator('#wbGrid [data-bp]').first().click(); await p.waitForTimeout(400);
  R.viewer = await p.evaluate(() => ({ open:!$('pv').hidden, src:($('pvImg').getAttribute('src') || '').slice(0, 5) }));
  await p.screenshot({ path:'/tmp/vbdpic-3.png' }); await p.evaluate(() => pvClose());
  /* 서버 몫 — 작게 잡고 두 장 더 */
  R.trim = await p.evaluate(async () => { const one = BP.list[0].ss; BP.max = one * 2 + 10;
    const c = document.createElement('canvas'); c.width = 900; c.height = 1200; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 900, 1200); g.fillStyle = '#000'; g.font = '40px sans-serif'; g.fillText('가상 근무표', 50, 80);
    for (let i = 0; i < 3000; i++){ g.fillStyle = `rgba(0,0,0,${Math.random() * .06})`; g.fillRect(Math.random() * 900, Math.random() * 1200, 3, 3); }
    const bl = await new Promise(ok => c.toBlob(ok, 'image/jpeg', .9)); await bpAdd(bl, { title:'가상 근무표', by:'boss' }); await bpAdd(bl, { title:'가상 명함', by:'boss' });
    const first = BP.list[0]; return { n:BP.list.length, firstSrv:first.srv, firstSrvKey:!!(await kvGet('bdp_' + first.id)), firstLocal:!!(await kvGet('bdpic_' + first.id)), srvOn:BP.list.filter(x => x.srv).length }; });
  R.otherDevice = await p.evaluate(async () => { const first = BP.list[0]; await kvDel('bdpic_' + first.id); BP.urls.clear(); await bpRender();
    return (document.querySelector(`[data-bp="${first.id}"]`) || {}).textContent.includes('이 기기에 없음'); });
  await p.locator('#wbGrid [data-bpx]').first().click(); await p.waitForTimeout(250);
  R.del = await p.evaluate(() => ({ n:BP.list.length, tiles:document.querySelectorAll('#wbGrid [data-bp]').length, undo:$('toast').classList.contains('on') }));
  await p.locator('#toastUndo').click(); await p.waitForTimeout(300);
  R.undo = await p.evaluate(() => ({ n:BP.list.length, tiles:document.querySelectorAll('#wbGrid [data-bp]').length }));
  await p.screenshot({ path:'/tmp/vbdpic-4.png' });
  console.log(JSON.stringify(R)); console.log('errors', errs); await b.close();
})();
