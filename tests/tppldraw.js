// v1.0 (2026-11-14) 공식 능력치 2단계 — 판에 그리기: 나와의 실(친밀도 색·굵기, 가족 이중선, 추측 ? 점선, 모름 = 없음), 관계 이름, 사람끼리 실 양끝 이름, 카드 바탕(감정 온도)·善惡 도장 / 새 판은 안 끝난 일만
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  const p = await ctx.newPage(); await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1600);
  await p.evaluate(async () => { await kvSet('people', { theme:'cork', list:[
      { id:'a1', name:'김지민 팀장', rel:'팀장', group:'직장', notes:[], links:[], stat:{ close:{ v:'S', by:'boss', at:1 }, temp:{ v:5, by:'boss', at:1 }, moral:{ v:2, by:'boss', at:1 } } },
      { id:'a2', name:'수진이', rel:'친구', group:'친구', notes:[], links:[], stat:{ close:{ v:'D-', by:'sehee', at:1 }, temp:{ v:1, by:'sehee', at:1 }, moral:{ v:-1, by:'sehee', at:1 } } },
      { id:'a3', name:'엄마', rel:'엄마', group:'가족', notes:[], links:[], stat:{ close:{ v:'A+', by:'boss', at:1 } } },
      { id:'a4', name:'거래처 박씨', rel:'아마 거래처', relSure:'guess', group:'손님·거래처', notes:[], links:[] },
      { id:'a5', name:'모르는 분', rel:'', group:'기타', notes:[], links:[] } ],
    ties:[{ id:'t1', a:'a3', b:'a2', aIs:'엄마', bIs:'딸', kin:true, sure:'yes', close:{ v:'B', by:'boss', at:1 } }, { id:'t2', a:'a1', b:'a4', aIs:'', bIs:'', kin:false, sure:'guess', close:null }] });
    PPL.list = null; await pplLoad(); await dwOpen('people'); });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => { const svg = document.querySelector('#ppMap svg.pp-svg'); const strs = [...svg.querySelectorAll('.pp-str')].map(e => e.getAttribute('style'));
    return { meLines:strs.length, kinLines:svg.querySelectorAll('.pp-str.kin').length, thickest:strs.map(s => +(/stroke-width:([\d.]+)/.exec(s) || [])[1]).sort((a, b) => b - a)[0], dashedGuess:strs.filter(s => /dasharray:4 4/.test(s)).length,
      qMarks:svg.querySelectorAll('.pp-q').length, tags:[...svg.querySelectorAll('.pp-tl')].map(t => t.textContent).join(','), lkKin:svg.querySelectorAll('.pp-lk.kin').length,
      tinted:document.querySelectorAll('#ppMap .pp-node.tinted').length, good:document.querySelectorAll('#ppMap .pp-seal.good.strong').length, bad:document.querySelectorAll('#ppMap .pp-seal.bad').length }; });
  console.log('board:', JSON.stringify(r));
  await p.screenshot({ path:'/tmp/ppl-draw.png' });
  await p.evaluate(() => { PPL.theme = 'white'; pplRender(true); }); await p.waitForTimeout(400); await p.screenshot({ path:'/tmp/ppl-draw-white.png' });
  console.log('white tags:', await p.evaluate(() => document.querySelectorAll('#ppMap .pp-tl').length));
  // 새 판은 안 끝난 일만
  const nr = await p.evaluate(async () => { const pr = await todayPanRef(); pr.items = [{ id:'o1', sec:secs()[0].id, text:'열린 일', since:pr.date }, { id:'d1', sec:secs()[0].id, text:'끝낸 일', since:pr.date, done:true, doneAt:Date.now() }]; await commitToday(pr);
    const res = await runToolCore({ name:'new_report', args:{ why:'정리' } }); const x = await todayPanRef(); return { res:{ carried:res.carried_open, left:res.done_left_in_old }, live:x.items.map(i => i.id).join(','), old:x.vers[x.vers.length - 1].items.map(i => i.id).join(',') }; });
  console.log('new report:', JSON.stringify(nr));
  console.log('errors []'); await b.close(); })();
