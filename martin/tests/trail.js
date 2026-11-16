// 행동 기록 자세히 점검 v1.0 (2026-11-17, A) — 무엇을 눌렀나(이름표·자료·파일·어디서) · 사진 확대 배율과 보이는 부분 · 판 확대·굴림과 그때 보이던 카드 · 기록 「행동」 탭 · 마틴 프롬프트
// 쓰는 법: bash martin/tests/run.sh trail   (스크린샷 /tmp/martin-행동기록.png)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const PIC = 'data:image/webp;base64,' + fs.readFileSync(path.join(__dirname, '..', 'img', 'martin.webp')).toString('base64');   /* 가짜 자료 */
const MOCK = () => { window.__p = []; window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
  f.json = async p => { window.__p.push(p); await new Promise(r => setTimeout(r, 150)); return { say: ['알겠다.'] }; }; return f; } }; };
const SEED = { v: 3, id: '20261117-trail', at: 1, turn: 1, nid: 8, emax: 1, notes: [], memo: [], links: [{ id: 'n7-n3', a: 'n7', b: 'n3', label: '보냄', sure: true }],
  log: [{ who: 'p', text: '이거 봐', photos: ['n7'], files: [], at: 1 }, { who: 'm', text: '가짜 캡처다.', at: 2 }],
  ev: [{ id: 'e1', kind: 'photo', card: 'n7', title: '가짜 카톡 캡처', name: '가짜캡처.png', turn: 1, read: '11:42 마지막 말', at: 1 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 820, r: 0 }, { id: 'n3', kind: 'person', title: '김지민', note: '', x: 880, y: 1040, r: 0 },
    { id: 'n7', kind: 'photo', title: '가짜 카톡 캡처', note: '11/12 밤', x: 1120, y: 1040, r: 0, thumb: PIC }] };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(3500);
  const cdp = await ctx.newCDPSession(p);
  const touch = async (frames) => {   /* 진짜 손가락 — frames = [[{x,y},…], …] 마지막 뒤에 손 뗌 */
    for (let i = 0; i < frames.length; i++) await cdp.send('Input.dispatchTouchEvent', { type: i ? 'touchMove' : 'touchStart', touchPoints: frames[i].map((q, j) => ({ x: q.x, y: q.y, id: j })) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
  const last = (what) => p.evaluate(w => JSON.parse(localStorage.getItem('drmartin.log') || '[]').filter(e => e.type === 'action' && (!w || e.act === w)).pop() || null, what);
  const ctr = id => p.evaluate(id => { const r = document.querySelector(`#nodes [data-id="${id}"]`).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  await p.evaluate(() => { cam.k = 1; cam.x = 1000; cam.y = 960; applyCam(0); }); await p.waitForTimeout(300);

  console.log('— 무엇을 눌렀나');
  let c = await ctr('n7'); await p.touchscreen.tap(c.x, c.y); await p.waitForTimeout(300);
  let e = await last('카드 고름'); const r0 = e && e.refs && e.refs[0];
  want(r0 && r0.title === '가짜 카톡 캡처' && r0.kind === '사진' && r0.ev === 'e1' && r0.file === '가짜캡처.png' && r0.read === 1, '카드 고름에 카드 이름·종류·자료 id·파일 이름·판독문 여부 ' + JSON.stringify(r0));
  want(e && e.where === '판', '어디서 눌렀나 = 판 (' + (e && e.where) + ')');
  await p.touchscreen.tap(c.x, c.y); await p.waitForTimeout(900);
  e = await last('사진 크게');
  want(e && e.refs && e.refs[0].ev === 'e1' && e.where === '판', '사진 크게에도 자료 정보·판에서 ' + JSON.stringify(e && e.refs));

  console.log('— 사진 확대·옮겨 보기');
  const s = await p.evaluate(() => { const r = document.getElementById('pvI').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * .15 }; });
  await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(120); await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(800);
  e = await last('사진 확대');
  want(e && e.zoom >= 2 && e.area && (e.area.y[0] + e.area.y[1]) / 2 < 50 && e.area.y[1] - e.area.y[0] < 80 && e.part && e.refs[0].ev === 'e1', `두 번 눌러 확대 → 배율·보이는 부분 (×${e && e.zoom}, ${e && e.part}, 가로 ${e && e.area.x} 세로 ${e && e.area.y})`);
  const before = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.log')).length);
  await touch([...Array(9)].map((_, i) => [{ x: 200, y: 600 - i * 30 }])); await p.waitForTimeout(800);
  e = await last('사진 옮겨 봄');
  want(e && e.area.y[0] > 10 && e.zoom >= 2, `끌어서 다른 곳을 보면 「사진 옮겨 봄」 (${e && e.part}, 세로 ${e && e.area.y})`);
  const s2 = await p.evaluate(() => { const r = document.getElementById('pvS').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await p.touchscreen.tap(s2.x, s2.y); await p.waitForTimeout(120); await p.touchscreen.tap(s2.x, s2.y); await p.waitForTimeout(800);
  e = await last(); want(e && e.act === '사진 원래 크기로', '한 번 더 두 번 누르면 「사진 원래 크기로」 (' + (e && e.act) + ')');
  await p.touchscreen.tap(s2.x, s2.y); await p.waitForTimeout(800);
  e = await last(); want(e && e.act === '사진 원래 크기로', '그냥 한 번 누름은 안 남김');
  await p.click('#pvX'); await p.waitForTimeout(400);

  console.log('— 판 확대·굴림');
  const bd = await p.evaluate(() => { const r = board.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await touch([...Array(8)].map((_, i) => [{ x: bd.x - 30 - i * 12, y: bd.y }, { x: bd.x + 30 + i * 12, y: bd.y }])); await p.waitForTimeout(800);
  e = await last('판 확대');
  want(e && e.k && e.k[1] > e.k[0] && (e.refs || []).length >= 1, `두 손가락 = 「판 확대」 ×${e && e.k} · 보이던 것 ${e && (e.refs || []).map(r => r.title).join(', ')}`);
  await touch([...Array(8)].map((_, i) => [{ x: bd.x + 20 - i * 15, y: bd.y + 100 }])); await p.waitForTimeout(800);
  e = await last('판 굴림'); want(e && e.px > 40, `빈 곳 끌기 = 「판 굴림」 ${e && e.px}px`);
  const n = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.log')).filter(e => e.type === 'action' && /^판 (확대|축소|굴림)$/.test(e.act)).length);
  want(n === 2, '손짓 하나에 한 줄씩 (' + n + ')');

  console.log('— 대화창 사진');
  await p.click('#chat [data-pv="n7"]'); await p.waitForTimeout(700);
  e = await last('사진 크게'); want(e && e.where === '대화창', '대화창 사진을 누르면 어디서 = 대화창 (' + (e && e.where) + ')');
  await p.click('#pvX'); await p.waitForTimeout(300);

  console.log('— 기록 「행동」 탭');
  await p.click('#btnLog'); await p.waitForTimeout(400); await p.click('#sheet [data-tab="act"]'); await p.waitForTimeout(400);
  const txt = await p.$eval('#sheet .log', el => el.innerText);
  want(txt.includes('「가짜 카톡 캡처」(사진 · n7 · 자료 e1 · 가짜캡처.png') && txt.includes('맞춤의 ×') && txt.includes('세로 ') && txt.includes('판에서') && txt.includes('보이던 것'), '행동 탭에 이름표·배율·보이는 부분·어디서');
  await p.screenshot({ path: '/tmp/martin-행동기록.png' });
  await p.evaluate(() => closeSheet && closeSheet()); await p.waitForTimeout(300);

  console.log('— 마틴에게');
  await p.fill('#msg', '이 위쪽 말 좀 봐'); await p.click('#send'); await p.waitForTimeout(2500);
  const pr = await p.evaluate(() => window.__p.filter(x => x.includes('이 위쪽 말 좀 봐')).pop() || '');
  const blk = (pr.split('[지난 네 말 뒤 동료가 판에서 한 일')[1] || '').split('\n\n')[0];
  want(blk.includes('사진 확대 「가짜 카톡 캡처」(n7·e1) — 맞춤의 ×') && blk.includes('세로 ') && /판 확대 보이던 것 「/.test(blk), '프롬프트에 「지난 네 말 뒤 동료가 판에서 한 일」');
  console.log(blk.split('\n').slice(0, 12).map(l => '      ' + l).join('\n'));
  await p.fill('#msg', '다음 말'); await p.click('#send'); await p.waitForTimeout(2500);
  const pr2 = await p.evaluate(() => window.__p.filter(x => x.includes('다음 말')).pop() || '');
  want(pr2 && !pr2.includes('[지난 네 말 뒤 동료가 판에서 한 일'), '마틴이 답한 뒤엔 새로 한 일만 (아무것도 안 했으면 칸 없음)');

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `\n실패 ${bad}` : '\n전부 통과'); process.exit(bad ? 1 : 0);
})();
