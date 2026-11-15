/* tday1 v1.1 (2026-11-15, A — 읽기 쉽게 지침) · v1.0 — 하루 생성기 1일차 고칠 거리: 프롬프트 캐시 · 자료 전체 찾기 · 일정 겹침 · 큰 머리 기준 · 업데이트 설명(내부 걸러냄·다음 맥락에서 뺌) · 지침 · 로그 길이. 가짜 이름만 */
const { chromium } = require('playwright');
const sseOf = evs => evs.map(d => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const txt = t => sseOf([{ type:'message_start', message:{ usage:{ input_tokens:10, cache_read_input_tokens:900 } } }, { type:'content_block_start', index:0, content_block:{ type:'text', text:'' } }, { type:'content_block_delta', index:0, delta:{ type:'text_delta', text:t } }, { type:'content_block_stop', index:0 }, { type:'message_delta', delta:{ stop_reason:'end_turn' }, usage:{ output_tokens:5 } }, { type:'message_stop' }]);
(async () => {
  const b = await chromium.launch(); let bad = 0;
  const check = (n, c, x) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (x !== undefined ? ' · ' + x : '')); if (!c) bad++; };
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const cors = { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,OPTIONS' }; let bodies = [];
  await ctx.route('https://api.anthropic.com/**', async route => { const r = route.request(); if (r.method() === 'OPTIONS') return route.fulfill({ status:204, headers:cors });
    if (r.url().includes('/v1/models')) return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'application/json' }, body:JSON.stringify({ data:[{ id:'claude-haiku-5-5' }, { id:'claude-sonnet-5-5' }] }) });
    bodies.push(JSON.parse(r.postData())); return route.fulfill({ status:200, headers:{ ...cors, 'content-type':'text/event-stream' }, body:txt('[0] 네, 정리했어요.') }); });
  const p = await ctx.newPage(); await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2000);
  await p.evaluate(async () => { AI.cfg.keys.anthropic = 'sk-ant-api03-' + 'K'.repeat(95); AI.cfg.work = false; AI.cfg.big = AI.cfg.big || {}; AI.cfg.big.anthropic = 'claude-sonnet-5-5'; await saveAi(); await loadModels(); refreshBrain(); });
  const say = async t => { bodies = []; await p.fill('#sayText', t); await p.click('#sayGo'); for (let i = 0; i < 60; i++){ await p.waitForTimeout(150); if (!(await p.evaluate(() => O.busy))) break; } return bodies[0]; };
  // 캐시
  const b1 = await say('안녕하세요');
  check('지침 앞부분에 캐시 표시', Array.isArray(b1.system) && b1.system[0].cache_control && b1.system[0].cache_control.type === 'ephemeral' && b1.system.length === 1);   /* 11-15 B: 지침(고정)만 system — 바뀌는 글은 이번 보스 말 앞(tsehee2 S6) */
  check('지금 시각은 뒷부분(매번 바뀌는 곳)', !b1.system[0].text.includes('지금: ') && JSON.stringify(b1.messages[b1.messages.length - 1]).includes('지금: '));
  const lm = b1.messages[b1.messages.length - 1]; check('마지막 메시지에도 캐시 표시', Array.isArray(lm.content) && !!lm.content[lm.content.length - 1].cache_control);
  check('평소 말은 작은 머리', b1.model === 'claude-haiku-5-5', b1.model);
  check('지침 — 일하는 원칙·판 대신 일간보고서·읽기 쉽게', b1.system[0].text.includes('묻기보다 먼저 한다') && b1.system[0].text.includes("'판'이라는 말은 쓰지 않는다") && b1.system[0].text.includes('한 줄에 하나씩'));
  const lastAi = await p.evaluate(async () => ((await kvGet('ailog')) || []).pop());
  check('캐시 읽은 양을 기록', lastAi.cRead === 900, JSON.stringify({ cRead:lastAi.cRead }));
  // 큰 머리 기준
  const b2 = await say('오늘 무슨 일 있었어요?'); check('따져야 하는 짧은 질문은 큰 머리', b2.model === 'claude-sonnet-5-5', b2.model);
  const b3 = await say('뭐라고 말씀드려야 하죠?'); check('답장 초안 질문도 큰 머리', b3.model === 'claude-sonnet-5-5', b3.model);
  // 자료 전체 찾기
  const mf = await p.evaluate(() => { const t0 = Date.now() - 600e3;
    O.log.push({ who:'u', at:t0, text:'오늘 받은 거\n' + Array.from({ length:12 }, (_, i) => `[가상팀장] [오후 ${i + 1}:00] 메모 ${i}`).join('\n') + '\n[가상팀장] [오후 2:10] 안전교육 수요일 14시 → 목요일 14시로 변경' });
    O.log.push({ who:'u', at:t0 + 1000, text:'사진', ocr:'안전교육 안내\n일시: 11월 18일(수) 14:00', pics:1 });
    return readMaterial({ find:'안전교육' }); });
  check('번호 없이 찾아도 모든 자료를 뒤짐', mf.ok && mf.matches && mf.matches.length === 2 && JSON.stringify(mf.matches).includes('목요일 14시로 변경'), JSON.stringify(mf).slice(0, 160));
  // 일정 겹침
  const ov = await p.evaluate(async () => { const r1 = await runTool({ name:'add_item', args:{ section:'sched', text:'가상 실사', due:'2026-11-19', time:'14:00' } });
    const r2 = await runTool({ name:'add_item', args:{ section:'sched', text:'가상 교육', due:'2026-11-19', time:'14:30' } });
    const r3 = await runTool({ name:'add_item', args:{ section:'sched', text:'가상 저녁', due:'2026-11-19', time:'19:00' } }); return { r1, r2, r3 }; });
  check('겹치는 일정은 도구 결과에', ov.r2.overlaps && ov.r2.overlaps[0].text === '가상 실사' && ov.r2.overlaps[0].gap_min === 30, JSON.stringify(ov.r2.overlaps));
  check('안 겹치면 조용히', !ov.r1.overlaps && !ov.r3.overlaps);
  // 업데이트 설명 — 내부 걸러냄
  const un = await p.evaluate(() => updUserNotes('## v9.0.2 · A · (내부) 작업 방식 바꿈\n- 검사 6분\n\n## v9.0.1 · B · 달력 큼직하게\n- 글씨가 안 잘림\n- (내부) tests/tcal 고침'));
  check('내부 일은 업데이트 설명에서 빠짐', !un.includes('작업 방식') && !un.includes('tests/') && un.includes('달력 큼직하게') && un.includes('안 잘림'), un.replace(/\n/g, ' | '));
  // 업데이트 설명 — 다음 차례 맥락에서 빠짐
  await p.evaluate(() => { const at = Date.now(); O.log.push({ who:'u', hide:true, upd:{ from:'v9.0.0', to:'v9.0.1' }, at, text:'(앱 안내) 업데이트 기록 비밀단어XYZ' }); O.log.push({ who:'s', at:at + 1, text:'새 규정 적용 마쳤습니다 비밀단어XYZ' }); briefMark(O.log.length - 2); });
  const b4 = await say('왜 이렇게 어렵게 설명해요!');
  check('업데이트 설명은 다음 대답 맥락에 없음', !JSON.stringify(b4.messages).includes('비밀단어XYZ'));
  // 로그 길이
  const dl = await p.evaluate(() => { dlog('대화', '긴 글', 'ㄱ'.repeat(9000)); return DBG.lines[DBG.lines.length - 1].d.length; });
  check('블랙박스 긴 글 안 자름(2만 자까지)', dl === 9000, dl);
  const ml = await p.evaluate(() => DBG.lines.filter(l => l.c === '대화' && l.m.startsWith('보스 →')).pop().m);
  check('요약 줄엔 줄바꿈 없음', !ml.includes('\n'));
  console.log('DAY1 bad', bad); await b.close(); if (bad) process.exit(1);
})();
