// v1.1 (2026-11-14, C) 판 위 띠 없앰 — 제목을 눌러 보고서 목록(다섯 줄만 보이고 굴림)·'오늘'로 지금 판 · v1.0 (2026-11-14) 일간보고서 판 — 시각 이름(5시 → 5시-1·5시-2), 큰 갱신만 새 판, 지난 판 얼림·보기 전용, 새 판 단추, 한마디·코멘트, read_pan version, 날 바뀜
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1600);
  const at = (h, m) => p.evaluate(([h, m]) => { const d = new Date(); d.setHours(h, m, 0, 0); const T = d.getTime(); Date.now = () => T; }, [h, m]);
  const T = (n, a) => p.evaluate(([n, a]) => runToolCore({ name:n, args:a }), [n, a]);
  await at(5, 2);
  await p.evaluate(async () => { const pr = await todayPanRef(); pr.items = [{ id:'r1', sec:secs()[0].id, text:'공지 올리기', since:pr.date }, { id:'r2', sec:secs()[0].id, text:'자료 준비', since:pr.date }];
    pr.ver = { label:'5시', at:Date.now(), by:'app', why:'첫 판' }; pr.vers = []; await commitToday(pr); render(); });
  // 작은 수정 → 판 그대로
  await T('update_item', { id:'r1', time:'14:00' });
  console.log('small edit keeps:', await p.evaluate(async () => { const x = await todayPanRef(); return x.ver.label + ' · vers ' + x.vers.length; }));
  // 큰 갱신 → 같은 5시 → 5시-1 / 5시-2
  await at(5, 30); console.log('new1:', JSON.stringify(await T('new_report', { why:'보스가 정리하자고 함' })));
  await T('add_item', { section:'today', text:'새로 들어온 일', comment:'오늘 안에 끝내시는 게 좋겠어요' });
  await at(5, 31); console.log('again in 2min:', JSON.stringify(await T('new_report', { why:'또' })).slice(0, 60));
  await at(5, 50); console.log('new2:', (await T('new_report', { why:'캡처 3장' })).report);
  await at(17, 10); console.log('new3:', (await T('new_report', { why:'저녁 정리' })).report);
  const st = await p.evaluate(async () => { const x = await todayPanRef(); return { now:x.ver.label, vers:x.vers.map(v => v.label + ':' + v.items.length) }; });
  console.log('state:', JSON.stringify(st));
  // 한마디·코멘트
  await T('set_line', { line:'오늘은 공지 하나만 남았어요.\n저녁엔 자료만 보시면 될 것 같아요.', face:'^_^' });
  await T('update_item', { id:'r2', comment:'자료는 내일로 넘겨도 될 것 같아요' });
  await p.evaluate(() => goView('pan')); await p.waitForTimeout(500);
  console.log('band gone:', await p.locator('#main .verbar').count() === 0, '| title:', (await p.locator('#day').textContent()).replace(/\s+/g, ' ').trim());
  console.log('comments shown:', await p.locator('#main .icm').count(), '| line:', await p.evaluate(() => S.pan.line.slice(0, 12)), '| face:', await p.evaluate(() => S.pan.face));
  await p.screenshot({ path:'/tmp/rpt-now.png' });
  // 지난 판 목록 → 5시-1 보기
  await p.evaluate(async () => { for (let i = 1; i <= 4; i++){ const d = new Date(); d.setDate(d.getDate() - i); const ds = ymd(d); await putPan({ ...emptyPan(ds), items:[{ id:'old' + i, sec:secs()[0].id, text:'지난 일 ' + i, since:ds }] }); } });
  await p.locator('#day').click(); await p.waitForTimeout(400);
  const lst = await p.evaluate(() => { const l = $('rlList'), r = [...l.querySelectorAll('.rl-row')], lb = l.getBoundingClientRect(); return { rows:r.length, seen:r.filter(x => { const b = x.getBoundingClientRect(); return b.top >= lb.top - 1 && b.bottom <= lb.bottom + 1; }).length, scrolls:l.scrollHeight > l.clientHeight, first:r[0].querySelector('b').textContent, now:(l.querySelector('.now b') || {}).textContent }; });
  console.log('list:', JSON.stringify(lst)); await p.screenshot({ path:'/tmp/rpt-list.png' });
  await p.locator('#sheet .rl-row[data-rlv="5시-1"]').click(); await p.waitForTimeout(400);
  console.log('viewing:', (await p.locator('#day').textContent()).replace(/\s+/g, ' ').trim(), '| nav fits:', await p.evaluate(() => [...document.querySelectorAll('.hrow.nav .ib')].every(b => b.scrollHeight <= b.clientHeight + 2 && b.getBoundingClientRect().height < 50)), '| ro:', await p.evaluate(() => $('main').classList.contains('ro')), '| items:', await p.locator('#main .it').count());
  await p.locator('#main .it[data-id="r2"] .ck').click({ force:true }); await p.waitForTimeout(200);
  console.log('blocked toggle (r2 not done):', await p.evaluate(async () => !(await todayPanRef()).items.find(i => i.id === 'r2').done));
  await p.screenshot({ path:'/tmp/rpt-old.png' });
  await p.locator('#today').click(); await p.waitForTimeout(400);
  console.log('back to now:', await p.evaluate(() => !$('main').classList.contains('ro')), await p.locator('#main .it').count());
  // 보스 새 판(두 번)
  await at(17, 40); await p.locator('#day').click(); await p.waitForTimeout(300); await p.locator('#sheet [data-rlnew]').click(); await p.waitForTimeout(150);
  console.log('arm label:', await p.locator('#sheet [data-rlnew]').textContent()); await p.locator('#sheet [data-rlnew]').click(); await p.waitForTimeout(400);
  console.log('boss new:', await p.evaluate(async () => { const x = await todayPanRef(); return x.ver.label + ' by ' + x.ver.by; }));
  // 맥락·read_pan
  console.log('context head:', (await p.evaluate(() => panContext())).split('\n')[0]);
  const rp = await T('read_pan', { date:await p.evaluate(() => S.today), version:'5시-1 보고서' });
  console.log('read_pan old:', rp.report, '| items', rp.items.length, '| versions', rp.versions.join(','));
  // 다시 켜도 남음
  await p.reload(); await p.waitForTimeout(1500);
  console.log('after reload:', await p.evaluate(async () => { const x = await todayPanRef(); return x.ver.label + ' · ' + x.vers.map(v => v.label).join(','); }));
  // 날이 바뀜 → 새 판 · 지난 판 없음
  console.log('next day:', await p.evaluate(async () => { const d = new Date(); d.setDate(d.getDate() + 1); const ds = ymd(d); S.dates = (await allDates()).sort(); const n = await makeToday(ds); return n.ver.label + ' · ' + n.ver.why + ' · vers ' + n.vers.length + ' · carried ' + n.items.length; }));
  console.log('errors []'); await b.close(); })();
