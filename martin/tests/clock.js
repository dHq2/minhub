// 사건 시계 점검 v1.1 (2026-11-17, D · A: clockText 에 현실 시각) — 방에 있을 때만 흐름 · 10:50 시작 · 누르면 0.01초 · 기록마다 clk · clockText · 저장·다시 열기 · 복기본 11칸. 가짜 사건. 폰 화면.
// 쓰는 법: bash martin/tests/run.sh clock   (스크린샷 /tmp/martin-시계-띠.png · 복기본 /tmp/martin-시계-복기본.txt)
const { chromium } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const SEED = { v:3, id:'20261117-clk', at:1, nodes:[{ id:'n1', kind:'brief', title:'가짜 금고 사건', note:'', x:1000, y:1000, r:0 }, { id:'n3', kind:'person', title:'김지민', note:'', x:1200, y:1000, r:0 }], links:[],
  log:[{ who:'p', text:'시작하자', at:1 }, { who:'m', text:'좋다.', at:2 }], memo:[], turn:1, nid:4, suspect:null };
(async () => {
  const b = await chromium.launch(), errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, deviceScaleFactor:2 }), p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.claude = { use:async () => null }; });
  await p.addInitScript(s => { if (!sessionStorage.getItem('ck')){ localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('ck', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(2500);
  const ms = () => p.evaluate(() => S.clock.ms), txt = () => p.textContent('#clk b'), lab = () => p.textContent('#clk small');
  let a = await ms();
  want(await p.evaluate(() => S.clock && S.clock.start === '10:50'), '사건마다 시계 S.clock, 시작 10:50');
  want(/^10:5\d:\d\d$/.test(await txt()) && (await lab()) === '사건 시각', `위 띠에 사건 시각 ${await txt()}`);
  await p.waitForTimeout(1500); let b1 = await ms();
  want(b1 - a > 1200 && b1 - a < 1900, `방에 있으면 흐름 +${Math.round(b1 - a)}ms`);
  await p.screenshot({ path:'/tmp/martin-시계-띠.png', clip:{ x:0, y:0, width:412, height:70 } });
  /* 나감 — 초점을 잃음(다른 창), 화면이 가려짐(다른 앱·탭) */
  await p.evaluate(() => { window.__hf = document.hasFocus; document.hasFocus = () => false; dispatchEvent(new Event('blur')); });
  a = await ms(); await p.waitForTimeout(1500); b1 = await ms();
  want(b1 - a < 60 && (await lab()) === '멈춤', `초점을 잃으면 멈춤(+${Math.round(b1 - a)}ms, ${await lab()})`);
  await p.evaluate(() => { document.hasFocus = window.__hf; Object.defineProperty(document, 'visibilityState', { configurable:true, get:() => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  a = await ms(); await p.waitForTimeout(1200); b1 = await ms();
  want(b1 - a < 60, `화면이 가려지면 멈춤(+${Math.round(b1 - a)}ms)`);
  await p.evaluate(() => { delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); dispatchEvent(new Event('focus')); });
  a = await ms(); await p.waitForTimeout(1000); b1 = await ms();
  want(b1 - a > 800, `돌아오면 다시 흐름(+${Math.round(b1 - a)}ms)`);
  /* 누르면 실제로 든 시간 0.01초 */
  await p.click('#clk'); await p.waitForTimeout(300);
  const r1 = await txt(); await p.waitForTimeout(150); const r2 = await txt();
  want(/^\d+:\d\d\.\d\d$/.test(r1) && (await lab()) === '들인 시간' && r1 !== r2, `누르면 들인 시간 0.01초 ${r1} → ${r2}`);
  const w = await p.evaluate(() => [document.querySelector('.brand').getBoundingClientRect().width, document.querySelector('#clk').getBoundingClientRect().width]);
  await p.click('#clk'); await p.waitForTimeout(300);
  const w2 = await p.evaluate(() => [document.querySelector('.brand').getBoundingClientRect().width, document.querySelector('#clk').getBoundingClientRect().width]);
  want(/^10:5\d:\d\d$/.test(await txt()) && w[0] === w2[0] && w[1] === w2[1], `다시 누르면 사건 시각 · 띠 폭 그대로 ${JSON.stringify([w, w2])}`);
  want(await p.evaluate(() => clockSim(86400000 + 3723000, '10:50') === '+1일 11:52:03' && clockReal(3723456) === '1:02:03.45' && clockHuman(3723456) === '1시간 2분 3.45초'), '시각 꼴(하루 넘김·0.01초·사람 말)');
  /* 기록마다 그때 시계 */
  await p.evaluate(() => act('시계 점검 행동')); await p.waitForTimeout(100);
  const lg = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.log')).filter(e => e.act === '시계 점검 행동').pop());
  want(lg && typeof lg.clk === 'number' && lg.clk % 10 === 0 && lg.clk > 0, `행동 기록에 clk ${lg && lg.clk}`);
  await p.evaluate(() => log('turn', { n:2, ok:true, model:'가짜', effort:'low', ms:3210, response:{ say:['이어졌군.'] } })); await p.waitForTimeout(100);
  const tl = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.log')).filter(e => e.type === 'turn').pop());
  want(tl && typeof tl.clk === 'number', `턴 기록에 clk ${tl && tl.clk}`);
  /* 프롬프트 한 줄 */
  const ct = await p.evaluate(() => clockText());
  want(/^\[사건 시계\] 지금 10:5\d:\d\d · 이 사건에 들인 시간 [\d.]+초 — 동료가 이 방에 있을 때만 흐르고, 나가면 멈춘다 · 동료 쪽 현실 시각 \d{4}-\d\d-\d\d\([일월화수목금토]\) \d\d:\d\d\n$/.test(ct), 'clockText ' + ct.trim());
  /* 되돌리기에 안 잡힘 */
  await p.waitForTimeout(1200);
  want(await p.evaluate(() => document.getElementById('btnUndo').disabled), '흐르는 시계가 되돌리기 칸을 안 쌓음');
  /* 저장·다시 열기 — 이어서 흐름 */
  await p.evaluate(() => clockSave(false)); const before = await ms();
  await p.reload(); await p.waitForTimeout(2200);
  const after = await ms();
  want(after >= before - 50 && after < before + 5000, `다시 열면 이어서 ${Math.round(before)} → ${Math.round(after)}`);
  want(await p.evaluate(() => Object.keys(S.clock.sess).length === 2), '세션(접속)마다 따로 셈');
  /* 복기본 */
  const rc = await p.evaluate(async () => recapText(await recapGather())); fs.writeFileSync('/tmp/martin-시계-복기본.txt', rc);
  want(/- 사건 시계: 사건 시각 10:50 → 10:5\d:\d\d · 총 추리 시간 [\d.]+초/.test(rc), '복기본 머리말에 총 추리 시간');
  want(rc.includes('## 11. 사건 시계') && /세션별/.test(rc) && (rc.match(/  · [a-z0-9]{6} /g) || []).length === 2, '복기본 11칸 세션별 2줄');
  want(/턴별[^\n]*\n  · 턴 2 · ⏱10:5\d:\d\d · [\d.]+초 \(마틴 답 3\.21초\)/.test(rc), '복기본 턴별');
  want(/\[[^\]]* ⏱10:5\d:\d\d\] 시계 점검 행동/.test(rc), '행동 줄에 그때 사건 시각');
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
