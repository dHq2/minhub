const { chromium } = require('playwright');
const XLSX = require('/tmp/libs/node_modules/xlsx');
// tfiles v1.0 (2026-11-16, A) 양식 없는 문서(마크다운)·시트(탭·수식) 카드 → 보기 · Word(.docx)·엑셀(.xlsx) 파일로 받기 · 일부만 고치기(md_replace) · 대화창 「열기·파일로 받기」
(async () => { const b = await chromium.launch(); let bad = 0;
  const check = (n, ok, info) => { console.log((ok ? 'OK   ' : 'FAIL ') + n + (info ? ' · ' + info : '')); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block', acceptDownloads:true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded);
  const md = `# 가상 홀리데이 세트 — 4시 보고\n\n**결론:** 수량 3만 세트로 확정해 주시면 오늘 지류 발주를 넣겠습니다.\n\n## 지금 상황\n\n시안은 내일 확정 예정입니다.\n\n| 항목 | 상태 | 담당 | 기한 |\n|---|---|---|---|\n| 수량 | 결정 필요 | 이사님 | 오늘 |\n| 지류 입고 | 확인 중 | 가상 반장님 | 11/17 |\n\n## 오늘 할 일\n\n- [ ] 입고일 받기\n- [x] 견적 메일 확인\n\n1. 첫째\n2. 둘째\n\n> 지류가 늦으면 19일 인쇄 시작이 밀립니다.`;
  const id = await p.evaluate(async md => (await runTool({ name:'make_card', args:{ kind:'doc', title:'가상 4시 보고', md } })).id, md);
  await p.evaluate(id => rvOpen(id), id); await p.waitForTimeout(600);
  const r = await p.evaluate(() => { const q = s => [...document.querySelectorAll('#rv ' + s)];
    return { h1:(q('.md-h1')[0] || {}).textContent, h2:q('.md-h2').length, table:q('.md-t tbody tr').length, ck:q('.md-li.md-ck').length, ol:q('.md-li.ol').length, q:q('.md-q').length, bold:q('.md-p b').length, head:q('.pg-head')[0].textContent.trim(), noTpl:!q('.rb-kind').length }; });
  check('문서: 마크다운 그대로(제목·소제목·표·체크·번호·인용·굵게)', r.h1 === '가상 홀리데이 세트 — 4시 보고' && r.h2 === 2 && r.table === 2 && r.ck === 2 && r.ol === 2 && r.q === 1 && r.bold === 1, JSON.stringify(r));
  check('문서: 틀 없음(업무 보고 띠·결재 칸·내부 문서 머리 없음)', r.noTpl && r.head === '', r.head);
  await p.screenshot({ path:'/tmp/tfiles-doc.png' });
  /* Word 로 받기 */
  await p.locator('[data-rv="file"]').click(); await p.waitForTimeout(300);
  check('파일 차림: Word·PDF·엑셀(표 있음)', await p.locator('[data-fx="docx"]').count() === 1 && await p.locator('[data-fx="xlsx"]').count() === 1 && await p.locator('[data-fx="pdf"]').count() === 1);
  await p.screenshot({ path:'/tmp/tfiles-menu.png' });
  let [dl] = await Promise.all([p.waitForEvent('download', { timeout:20000 }), p.locator('[data-fx="docx"]').click()]);
  const dpath = '/tmp/tfiles.docx'; await dl.saveAs(dpath);
  const { execSync } = require('child_process'); const xml = execSync(`unzip -p ${dpath} word/document.xml`).toString();
  check('Word 파일: 내용·표', xml.includes('가상 홀리데이 세트') && xml.includes('<w:tbl>') && xml.includes('가상 반장님') && xml.includes('Heading1'), dl.suggestedFilename());
  [dl] = await Promise.all([p.waitForEvent('download', { timeout:20000 }), p.locator('[data-fx="xlsx"]').click()]);
  await dl.saveAs('/tmp/tfiles-doc.xlsx'); const wb0 = XLSX.readFile('/tmp/tfiles-doc.xlsx');
  check('문서 속 표 → 엑셀', XLSX.utils.sheet_to_json(wb0.Sheets[wb0.SheetNames[0]], { header:1 })[2][2] === '가상 반장님');
  await p.evaluate(() => { closeSheet(); rvClose(); });
  /* 일부만 고치기 */
  const up = await p.evaluate(async id => { const r = await runTool({ name:'update_card', args:{ id, md_replace:[{ find:'시안은 내일 확정 예정입니다.', replace:'시안은 11/17(화)에 확정합니다.' }, { find:'없는 글', replace:'x' }] } }); return { r, md:BOARD.cards.find(c => c.id === id).md }; }, id);
  check('일부만 고치기(md_replace) + 못 찾은 곳 알려 줌', up.md.includes('11/17(화)에 확정합니다.') && !up.md.includes('내일 확정 예정') && JSON.stringify(up.r.not_found) === '["없는 글"]', JSON.stringify(up.r));
  /* 시트 카드 — 탭 둘, 수식 */
  const sid = await p.evaluate(async () => (await runTool({ name:'make_card', args:{ kind:'sheet', title:'가상 견적 정리', sheets:[
    { name:'견적', rows:[['품목', '수량', '단가', '금액'], ['겉박스', '30000', '312', '9,360,000'], ['검산표', '30000', '212', '6,360,000'], ['합계', '', '', '15,720,000']], formulas:[{ cell:'D2', f:'B2*C2' }, { cell:'D3', f:'B3*C3' }, { cell:'D4', f:'SUM(D2:D3)' }] },
    { name:'일정', rows:[['날짜', '일'], ['11/17', '시안 확정'], ['11/19', '인쇄 시작']] }] } })).id);
  await p.evaluate(() => { goView && 0; }); await p.evaluate(sid => cardSheet(sid), sid); await p.waitForTimeout(300);
  const sv = await p.evaluate(() => ({ tabs:document.querySelectorAll('#sheet .sh-tab').length, f:document.querySelectorAll('#sheet td.f').length, n:document.querySelectorAll('#sheet td.n').length }));
  check('시트 보기: 탭 2개 · 수식 칸 3 · 숫자 오른쪽', sv.tabs === 2 && sv.f === 3 && sv.n >= 6, JSON.stringify(sv));
  await p.screenshot({ path:'/tmp/tfiles-sheet.png' });
  await p.locator('[data-bact="file"]').click(); await p.waitForTimeout(300);
  check('시트는 엑셀만(Word 없음)', await p.locator('[data-fx="xlsx"]').count() === 1 && await p.locator('[data-fx="docx"]').count() === 0);
  [dl] = await Promise.all([p.waitForEvent('download', { timeout:20000 }), p.locator('[data-fx="xlsx"]').click()]);
  await dl.saveAs('/tmp/tfiles.xlsx'); const wb = XLSX.readFile('/tmp/tfiles.xlsx', { cellFormula:true }), ws = wb.Sheets['견적'];
  check('엑셀 파일: 탭 이름 · 숫자는 숫자 · 수식 살아 있음', wb.SheetNames.join(',') === '견적,일정' && ws.B2.t === 'n' && ws.D4.f === 'SUM(D2:D3)' && ws.D2.f === 'B2*C2' && ws.D4.v === 15720000, JSON.stringify({ n:wb.SheetNames, B2:ws.B2, D4:ws.D4 }));
  await p.evaluate(() => closeSheet());
  /* 대화창 알림의 단추 */
  await p.evaluate(() => renderLog()); await p.waitForTimeout(200);
  check('대화창: 「열기 · 파일로 받기」 단추', await p.locator('#log [data-opencard]').count() >= 2 && await p.locator('#log [data-filecard]').count() >= 2);
  await p.locator(`#log [data-filecard="${sid}"]`).first().click(); await p.waitForTimeout(400);
  check('대화창 「파일로 받기」 → 차림', await p.locator('[data-fx="xlsx"]').count() === 1);
  await p.evaluate(() => closeSheet());
  await p.locator(`#log [data-opencard="${id}"]`).first().click(); await p.waitForTimeout(400);
  check('대화창 「열기」 → 문서 보기', await p.evaluate(() => document.getElementById('rv').classList.contains('on')));
  const ctxt = await p.evaluate(() => boardContext());
  check('맥락: 문서 글자 수 · 시트 탭', /문서 '가상 4시 보고' \([\d,]+자\)/.test(ctxt) && /시트 '가상 견적 정리' \(탭 견적 3행, 일정 2행\)/.test(ctxt), ctxt.split('\n').slice(1, 3).join(' / '));
  const sp = await p.evaluate(() => systemPrompt('claude-haiku-5-5'));
  check('지침: 양식 없이 md 로 자유롭게 · sheet · 파일로 받기', /md\(마크다운\)로 자유롭게 쓴다\. 정해진 틀·순서는 없다/.test(sp) && /kind='sheet'/.test(sp) && /「파일로 받기」/.test(sp));
  check('페이지 오류 없음', !errs.length, errs.join(' | '));
  console.log('FILES bad', bad); await b.close(); if (bad) process.exit(1);
})();
