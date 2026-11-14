/* tpdlive v1.1 (2026-11-15, B) — v1.1: 관계 서술이 판의 다른 사람을 가리키면(○○의 친구) 둘 사이 실 가운데로·나와의 실엔 안 붙임(k2 는 실 글씨 빈 채 — 보스 판과 같은 꼴)
   v1 — 인물 기록부 그 자리에서 고치기(「고치기」 단추 없음, 치면 저절로 저장) + 판 실 위 글씨는 한두 단어(나와의 실: 판 이름/관계 끝 낱말, 사람끼리: 가운데 하나). 폰·컴퓨터. 가짜 이름만 */
const { chromium } = require('playwright');
const PEOPLE = { list:[
  { id:'q1', name:'한별 조교', rel:'같이 일하는 조교, 대학생', group:'직장', note:'', info:[], extra:[], notes:[], links:[], at:1 },
  { id:'q2', name:'아빠', rel:'보스의 아버지', group:'가족', note:'', info:[], extra:[], notes:[], links:[], at:2, kin:true },
  { id:'q3', name:'다온', rel:'한별 조교의 친구, 고등학교 때부터', group:'친구', note:'', info:[], extra:[], notes:[], links:[], at:3 },
  { id:'q4', name:'다온 엄마', rel:'다온의 어머니', group:'기타', note:'', info:[], extra:[], notes:[], links:[], at:4 } ],
  ties:[{ id:'k1', a:'q1', b:'q3', aIs:'친구', bIs:'친구', kin:false, sure:'yes', close:null }, { id:'k2', a:'q4', b:'q3', aIs:'', bIs:'', kin:true, sure:'yes', close:null }], theme:'cork' };
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width:412, height:915, mob:true, tag:'m' }, { width:1366, height:860, tag:'d' }]){
    const ctx = await b.newContext({ viewport:{ width:vp.width, height:vp.height }, isMobile:!!vp.mob, hasTouch:!!vp.mob, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(1500);
    await p.evaluate(async P => { await SEHEE.kvSet('people', P); await SEHEE.kvSet('b_ppPos', {}); }, PEOPLE);
    await p.reload(); await p.waitForTimeout(2000); await p.evaluate(async () => { PPL.list = null; await pplLoad(); goView('people'); }); await p.waitForTimeout(1000);
    const tags = () => p.evaluate(() => ({ me:[...document.querySelectorAll('#ppMap .pp-tl:not(.lk)')].map(t => t.textContent).sort().join(','), lk:[...document.querySelectorAll('#ppMap .pp-tl.lk')].map(t => t.textContent).sort().join(',') }));
    const R = {}; R.boardTags = await tags();
    await p.screenshot({ path:`/tmp/vpdlive-${vp.tag}-board.png` });
    await p.evaluate(() => pdOpen('q1')); await p.waitForTimeout(600);
    R.noEditBtn = await p.locator('#pdEdit').count() === 0;
    R.fields = await p.evaluate(() => ['pdName', 'pdTag', 'pdRel', 'pdGrp', 'pdSex', 'pdNote'].filter(id => document.querySelector('#pdBody #' + id)).length);
    R.tagPlaceholder = await p.getAttribute('#pdTag', 'placeholder');
    const typeIn = async (sel, txt) => { await p.locator(sel).click(); await p.keyboard.press('Control+A'); await p.keyboard.type(txt, { delay:5 }); };
    await typeIn('#pdTag', '동료'); await typeIn('#pdName', '한별 선생'); await typeIn('#pdNote', '말이 빠르고 꼼꼼함');
    R.headerLive = await p.evaluate(() => [document.querySelector('#pdBody .pd-id h1').textContent, $('pdT').textContent].join(' / '));
    await p.waitForTimeout(800);
    R.saved = await p.evaluate(async () => { const x = (await SEHEE.kvGet('people')).list.find(y => y.id === 'q1'); return [x.name, x.tag, x.note].join(' | '); });
    R.boardAfterTag = (await tags()).me;
    /* 항목 더하기 → 바로 그 칸에 글자 */
    await p.locator('#pdBody [data-addk="생일"]').click(); await p.waitForTimeout(300);
    R.focusAfterAdd = await p.evaluate(() => document.activeElement && document.activeElement.dataset.iv);
    await p.keyboard.type('3월 5일', { delay:5 });
    await p.locator('#pdBody [data-add="extra"]').click(); await p.waitForTimeout(300); await p.keyboard.type('커피는 라떼', { delay:5 });
    await p.locator('#pdBody [data-lock="0"]').click(); await p.waitForTimeout(400);
    await p.locator('#pdBody [data-add="extra"]').click(); await p.waitForTimeout(300);   // 빈 줄 — 닫으면 치움
    /* 사람끼리 실 '둘 사이' */
    await typeIn('#pdBody [data-tlb="k1"]', '동창'); await p.waitForTimeout(800);
    R.tieLabel = await p.evaluate(() => tieLabel(PPL.ties.find(t => t.id === 'k1')));
    await p.evaluate(() => { const s = document.querySelector('#pdBody .tie-ul'); if (s) s.scrollIntoView({ block:'center' }); }); await p.screenshot({ path:`/tmp/vpdlive-${vp.tag}-ties.png` });
    await p.evaluate(() => $('pdBody').scrollTop = 0); await p.waitForTimeout(200); await p.screenshot({ path:`/tmp/vpdlive-${vp.tag}-record.png` });
    /* 세희가 고쳐 다시 그려도 치던 칸 그대로 */
    await p.locator('#pdNote').click(); await p.keyboard.press('End');
    await p.evaluate(async () => { await runPeopleTool({ name:'update_person', args:{ person:'q1', add_note:'세희 메모 하나', tag:'후배' } }); });
    await p.waitForTimeout(400);
    R.focusKept = await p.evaluate(() => document.activeElement && document.activeElement.id);
    R.toolTag = await p.evaluate(() => pplFind('q1').tag);
    await p.locator('[data-pd="close"]').click(); await p.waitForTimeout(700);
    R.afterClose = await p.evaluate(async () => { const x = (await SEHEE.kvGet('people')).list.find(y => y.id === 'q1'); return { info:x.info, extra:x.extra.map(e => e.text + (e.lock ? '🔒' : '')), ties:(await SEHEE.kvGet('people')).ties.map(t => t.label ?? '').join(',') }; });
    R.boardEnd = await tags();
    await p.screenshot({ path:`/tmp/vpdlive-${vp.tag}-board2.png` });
    console.log(vp.tag, JSON.stringify(R)); console.log(vp.tag, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
