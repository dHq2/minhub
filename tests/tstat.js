// v1.0 (2026-11-14) 인간관계 공식 능력치 1단계 — 친밀도·감정 온도·선악(보스 확정/세희 판단), 나와의 관계 확실·추측·모름, 사람끼리 실(양쪽 이름·가족·추측·친밀도), 옛 links 이어받기
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  const p = await ctx.newPage(); await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1600);
  const T = (n, a) => p.evaluate(([n, a]) => runPeopleTool({ name:n, args:a }), [n, a]);
  // 옛 데이터: links 만 있음
  console.log('legacy:', await p.evaluate(async () => { await kvSet('people', { list:[{ id:'m1', name:'박지영', rel:'친구 어머니', group:'지인', notes:[], links:['d1'] }, { id:'d1', name:'수진이', rel:'대학 동기', group:'친구', notes:[], links:['m1'] }, { id:'x1', name:'모르는사람', rel:'', group:'기타', notes:[], links:[] }], theme:'cork' });
    PPL.list = null; await pplLoad(); await pplSave(); return PPL.ties.length + ' tie · links ' + pplFind('m1').links.join(',') + ' · x1 relSure ' + relSure(pplFind('x1')) + ' · d1 ' + relSure(pplFind('d1')); }));
  // 세희: 사람끼리 실(엄마·딸, 가족), 능력치(세희 판단)
  console.log('tie:', JSON.stringify(await T('tie_person', { person:'박지영', other:'수진이', person_is:'엄마', other_is:'딸', family:true, closeness:'B+', why:'통화를 자주 한대요' })));
  console.log('stat sehee:', JSON.stringify(await T('update_person', { person:'수진이', closeness:'A', emotion:4, morality:1, stat_why:'힘들 때 먼저 연락해 줌' })));
  // 보스 확정 → 세희가 못 바꿈, boss_said 면 바뀜
  await p.evaluate(async () => { const x = pplFind('d1'); statSet(x, 'close', 'S-', 'boss', '', true); await pplSave(); });
  console.log('sehee blocked:', JSON.stringify(await T('update_person', { person:'수진이', closeness:'B', stat_why:'요즘 뜸함' })).slice(0, 120));
  console.log('still:', await p.evaluate(() => pplFind('d1').stat.close.v + ' by ' + pplFind('d1').stat.close.by));
  await T('update_person', { person:'수진이', closeness:'A+', boss_said:true });
  console.log('boss said:', await p.evaluate(() => pplFind('d1').stat.close.v + ' by ' + pplFind('d1').stat.close.by + ' · log ' + pplFind('d1').statLog.length));
  await T('update_person', { person:'모르는사람', relation_sure:'추측', relation:'아마 거래처 사람' });
  console.log('looks:', await p.evaluate(() => JSON.stringify({ none:lineLook(null, false, 'none'), guess:lineLook(null, false, relSure(pplFind('x1'))).mark, kinA:lineLook(pplFind('d1').stat.close, true, 'yes'), card:cardTint(pplFind('d1')), stamp:moralStamp(pplFind('d1')) })));
  // 맥락
  const ctxt = await p.evaluate(async () => { O.log.push({ who:'u', text:'수진이 얘기 좀', at:Date.now() }); return pplContext(); });
  console.log('context:', ctxt.split('\n').filter(l => /수진이|사람끼리|모르는사람|능력치 바뀐/.test(l)).map(l => l.trim().slice(0, 150)).join(' || '));
  // 기록부 화면 — 보스가 눌러서 매기기
  await p.evaluate(async () => { await dwOpen('people'); await pdOpen('m1'); }); await p.waitForTimeout(500);
  await p.locator('#pdBody [data-st="close"][data-v="C"]').click(); await p.waitForTimeout(200);
  await p.locator('#pdBody [data-gm="-"]').click(); await p.waitForTimeout(200);
  await p.locator('#pdBody [data-st="temp"][data-v="1"]').click(); await p.waitForTimeout(200);
  await p.locator('#pdBody [data-st="moral"][data-v="-1"]').click(); await p.waitForTimeout(200);
  await p.locator('#pdBody [data-rs="guess"]').click(); await p.waitForTimeout(200);
  console.log('boss taps:', await p.evaluate(() => { const x = pplFind('m1'); return [x.stat.close.v, x.stat.temp.v, x.stat.moral.v, x.relSure, x.stat.close.by].join(' '); }));
  await p.locator('#pdBody [data-st="moral"][data-v="-1"]').click(); await p.waitForTimeout(200);
  console.log('tap again clears moral:', await p.evaluate(() => !pplFind('m1').stat.moral));
  console.log('tie row:', (await p.locator('#pdBody .tie-ul li').first().textContent()).replace(/\s+/g, ' '));
  await p.evaluate(() => { const s = document.querySelector('#pdBody .sb'); if (s) s.scrollIntoView(); }); await p.screenshot({ path:'/tmp/stat-view.png' });
  // 고치기에서 실 이름 바꾸기 · 새 실
  await p.locator('#pdEdit').click(); await p.waitForTimeout(300);
  const tid = await p.evaluate(() => PPL.ties[0].id);
  await p.locator(`#pdBody [data-tme="${tid}"]`).fill('어머니'); await p.selectOption('#pdTieAdd', 'x1'); await p.waitForTimeout(300);
  await p.evaluate(() => { const s = document.querySelector('#pdBody .tie-row'); if (s) s.scrollIntoView(); }); await p.screenshot({ path:'/tmp/stat-edit.png' });
  await p.locator('#pdEdit').click(); await p.waitForTimeout(300);
  console.log('after edit:', await p.evaluate(() => PPL.ties.map(t => `${pplFind(t.a).name}(${t.aIs})-${pplFind(t.b).name}(${t.bIs})`).join(' / ')));
  await T('untie_person', { person:'박지영', other:'모르는사람' });
  await p.reload(); await p.waitForTimeout(1500);
  console.log('after reload:', await p.evaluate(async () => { await pplLoad(); return PPL.ties.length + ' tie · m1 links ' + pplFind('m1').links.join(',') + ' · d1 ' + pplFind('d1').stat.close.v; }));
  console.log('errors []'); await b.close(); })();
