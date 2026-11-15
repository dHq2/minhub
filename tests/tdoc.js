const { chromium } = require('playwright');
// tdoc v1.0 (2026-11-16, A) 문서 모양을 매번 고른다 — 띠 글자·받는 분·결재 칸(바꾸기·없애기)·강조 상자 이름·번호 끄기·강조 섹션·체크 목록·제목 없는 문단, 고치기(update_card)로 모양까지, 문서 양식 기억(save/remove_doc_style)
(async () => { const b = await chromium.launch(); let bad = 0;
  const check = (n, ok, info) => { console.log((ok ? 'OK   ' : 'FAIL ') + n + (info ? ' · ' + info : '')); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded);
  const id = await p.evaluate(async () => (await runTool({ name:'make_card', args:{ kind:'report', title:'가상 홀리데이 세트 — 4시 보고', doc_kind:'이사님 보고', to:'가상 이사님', signs:['작성', '검토', '승인'],
    summary_label:'결정 요청', summary:'수량 3만 세트로 확정해 주시면 오늘 지류 발주를 넣겠습니다.', highlights:[{ label:'견적 합계', value:'1,824만 원' }, { label:'수량', value:'3만 세트' }],
    sections:[{ heading:'지금 상황', text:'시안은 내일 확정 예정입니다.' }, { heading:'위험', text:'지류 입고가 늦으면 인쇄 시작이 밀립니다.', style:'box' },
      { heading:'오늘 할 일', points:['반장님께 입고일 받기', '견적 메일 첨부 확인'], style:'check' }, { text:'제목 없는 맺음 문단입니다.' }] } })).id);
  await p.evaluate(id => rvOpen(id), id); await p.waitForTimeout(600);
  const r = await p.evaluate(() => { const q = s => [...document.querySelectorAll('#rv ' + s)];
    return { kind:q('.rb-kind').map(e => e.textContent)[0], to:(q('.rb-to')[0] || {}).textContent, signs:q('.rb-sign th').map(e => e.textContent).join(','), sumLabel:(q('.rb-sum b')[0] || {}).textContent,
      nums:q('.rb-h i').map(e => e.textContent).join(','), box:q('.rb-p.rb-box').length, ck:q('.rb-ul.rb-ck li').length, heads:q('.rb-h').length, paras:q('.rb-p').map(e => e.textContent) }; });
  check('띠 글자는 고른 대로(이사님 보고)', r.kind === '이사님 보고', r.kind);
  check('받는 분 줄', /가상 이사님/.test(r.to || ''), r.to);
  check('결재 칸 세 개', r.signs === '작성,검토,승인', r.signs);
  check('강조 상자 이름(결정 요청)', r.sumLabel === '결정 요청', r.sumLabel);
  check('강조 섹션 · 체크 목록', r.box === 1 && r.ck === 2, JSON.stringify(r));
  check('제목 없는 문단도 나옴(제목 3개, 번호 1,2,3)', r.heads === 3 && r.nums === '1,2,3' && r.paras.includes('제목 없는 맺음 문단입니다.'), r.nums);
  await p.screenshot({ path:'/tmp/tdoc-1.png' });
  /* 고치기 — 메일처럼: 띠 바꾸고 결재 칸 없애고 번호 끄기 */
  await p.evaluate(async id => { await runTool({ name:'update_card', args:{ id, doc_kind:'메일 초안', signs:[], numbered:false, summary:'', sections:[{ heading:'인사', text:'이사님, 4시 보고 전에 미리 드립니다.' }] } }); rvRender(); }, id); await p.waitForTimeout(500);
  const r2 = await p.evaluate(() => ({ kind:document.querySelector('#rv .rb-kind').textContent, sign:document.querySelectorAll('#rv .rb-sign').length, nums:document.querySelectorAll('#rv .rb-h i').length, sum:document.querySelectorAll('#rv .rb-sum').length, cards:BOARD.cards.length }));
  check('고치기로 모양까지: 띠 바뀜 · 결재 칸 없음 · 번호 없음 · 강조 상자 비움 · 카드 하나 그대로', r2.kind === '메일 초안' && r2.sign === 0 && r2.nums === 0 && r2.sum === 0 && r2.cards === 1, JSON.stringify(r2));
  await p.screenshot({ path:'/tmp/tdoc-2.png' });
  /* 문서 양식 기억 */
  const ctx1 = await p.evaluate(async () => { await runTool({ name:'save_doc_style', args:{ name:'이사님 보고', rule:'결정 요청 먼저, 표는 항목|상태|담당|기한, 한 장 안' } }); return boardContext(); });
  check('양식 기억 → 맥락에 나옴', /보스 문서 양식[\s\S]*- 이사님 보고: 결정 요청 먼저/.test(ctx1));
  const ctx2 = await p.evaluate(async () => { await runTool({ name:'save_doc_style', args:{ name:'이사님 보고', rule:'한 장 안, 결론 먼저' } }); return boardContext(); });
  check('같은 이름은 덮어씀', /- 이사님 보고: 한 장 안, 결론 먼저/.test(ctx2) && !/결정 요청 먼저/.test(ctx2));
  const ctx3 = await p.evaluate(async () => { await runTool({ name:'remove_doc_style', args:{ name:'이사님 보고' } }); return boardContext(); });
  check('지우면 사라짐', !/보스 문서 양식/.test(ctx3));
  const sp = await p.evaluate(() => systemPrompt('claude-haiku-5-5'));
  check('지침: 정해진 틀 없음 · 고칠 땐 update_card', /문서 모양은 정해진 틀이 없다/.test(sp) && /update_card 로 같은 카드를 고친다/.test(sp) && !/섹션은 보통 개요 → 주요 내용/.test(sp));
  console.log('DOC bad', bad); await b.close(); if (bad) process.exit(1);
})();
