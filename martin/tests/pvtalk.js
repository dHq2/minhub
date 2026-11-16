// 마틴 점검 — 사진 위에 뜨는 대화 v1.0 (2026-11-17, C)
// 확인: 사진 크게 보기의 기본이 「대화 보기」(오버레이) · 사진은 입력줄 바로 위까지 화면 가득 · 입력줄을 그대로 씀 ·
//       최근 대화가 사진 위에 뜨고 마틴의 … 과 답이 실시간으로 뜸 · 떠 있는 대화 위로도 사진을 끌 수 있음 ·
//       첨부 칩이 생기면 사진 끝자리도 올라감 · 판독문을 펴면 숨음 · 「대화 숨기기」 = 사진만 가득 · 닫으면 원래대로
// 쓰는 법: bash martin/tests/run.sh pvtalk   (스크린샷 /tmp/martin-사진대화.png · /tmp/martin-사진대화-답.png — 직접 연다)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const PIC = 'data:image/webp;base64,' + fs.readFileSync(path.join(__dirname, '..', 'img', 'martin.webp')).toString('base64');   /* 가짜 자료 */
const MOCK = () => { window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
  f.json = async () => { await new Promise(r => setTimeout(r, 1500)); return { say: ['11:42 에 보낸 말이 마지막이다.', '그 뒤로 읽지 않았다.'] }; }; return f; } }; };
const SEED = { v: 3, id: '20261117-pvtalk', at: 1, turn: 1, nid: 8, notes: [], memo: [], links: [],
  log: [{ who: 'p', text: '이거 봐', photos: ['n7'], files: [], at: 1 }, { who: 'm', text: '가짜 캡처다.', at: 2 }, { who: 'm', text: '목요일 밤 대화가 담겼다.', at: 3 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 900, r: 0 }, { id: 'n7', kind: 'photo', title: '가짜 카톡 캡처', note: '11/12 밤', x: 1100, y: 1100, r: 0, thumb: PIC }] };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); localStorage.setItem('drmartin.pvfull', '1'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(2600);
  const R = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right), h: Math.round(r.height) }; }, sel);
  const talk = () => p.evaluate(() => [...document.querySelectorAll('#pvTalk .msg')].map(m => m.textContent.trim()));

  await p.evaluate(() => openPv('n7')); await p.waitForTimeout(700);
  const pv = await R('#pv'), form = await R('#form'), tk = await R('#pvTalk');
  want(await p.evaluate(() => !pvFull && document.getElementById('pvC').textContent === '대화 숨기기'), '예전에 「대화 숨기기」로 둔 판도 이번엔 대화 보기(오버레이)로 열림');
  want(pv.t === 0 && Math.abs(pv.b - form.t) <= 2, `사진은 맨 위부터 입력줄 바로 위까지 (사진 ${pv.t}~${pv.b}, 입력줄 ${form.t})`);
  want(pv.h > 700, `사진 칸이 화면 대부분 (${pv.h}px / 915)`);
  let t = await talk();
  want(t.length >= 3 && t.some(x => x.includes('목요일 밤 대화')) && t[t.length - 1].includes('돌아왔군'), `최근 대화(첫 인사까지)가 사진 위에 뜸 ${JSON.stringify(t)}`);
  want(tk && tk.b <= pv.b && tk.t > pv.t + pv.h * .45, `떠 있는 대화는 사진 아래쪽에 (${tk && tk.t}~${tk && tk.b})`);
  const hit = await p.evaluate(() => { const r = document.getElementById('pvTalk').getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.bottom - 20); return e && (e.id || e.className); });
  want(hit === 'pvI' || hit === 'pv-stage' || hit === 'pvS', `떠 있는 대화는 손가락을 통과시킴 (그 자리 = ${hit})`);
  const inp = await p.evaluate(() => { const r = document.getElementById('msg').getBoundingClientRect(); const e = document.elementFromPoint(r.left + 30, r.top + r.height / 2); return e && e.id; });
  want(inp === 'msg', `입력줄이 사진 위로 올라와 그대로 눌림 (${inp})`);
  await p.screenshot({ path: '/tmp/martin-사진대화.png' });

  /* 떠 있는 대화 자리에서 사진 끌기 */
  const x0 = await p.evaluate(() => PV.y); const z = await R('#pvTalk');
  const cdp = await p.context().newCDPSession(p); const tp = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await tp('touchStart', 200, z.b - 30); for (let i = 1; i <= 6; i++){ await tp('touchMove', 200, z.b - 30 - i * 20); await p.waitForTimeout(16); } await tp('touchEnd'); await p.waitForTimeout(300);
  const x1 = await p.evaluate(() => PV.y);
  want(x1 !== x0 && await p.evaluate(() => document.getElementById('pv').classList.contains('on')), `떠 있는 대화 위에서 끌어도 사진이 움직임 (y ${Math.round(x0)} → ${Math.round(x1)}), 안 닫힘`);

  /* 사진 띄운 채 말 걸기 — … 과 답이 사진 위에 실시간으로 */
  await p.tap('#msg'); await p.keyboard.type('마지막 메시지 언제야?'); await p.tap('#form button[type=submit], #send').catch(async () => { await p.keyboard.press('Enter'); });
  await p.waitForTimeout(700);
  t = await talk(); const waiting = await p.evaluate(() => !!document.querySelector('#pvTalk .msg.wait'));
  want(t.some(x => x.includes('마지막 메시지 언제야')) && waiting, `건넨 말과 마틴의 … 가 사진 위에 바로 뜸 ${JSON.stringify(t.slice(-2))}`);
  await p.waitForTimeout(4500); t = await talk();
  want(t.some(x => x.includes('그 뒤로 읽지 않았다')) && !(await p.evaluate(() => !!document.querySelector('#pvTalk .msg.wait'))), `마틴의 답이 사진 위에 뜸 ${JSON.stringify(t.slice(-2))}`);
  want(await p.evaluate(() => document.getElementById('pv').classList.contains('on')), '답하는 동안 사진은 그대로 떠 있음');
  want(t.length <= 6, `떠 있는 건 최근 6줄까지 (${t.length})`);
  await p.screenshot({ path: '/tmp/martin-사진대화-답.png' });

  /* 첨부 칩이 생기면 사진 끝자리도 올라감 */
  await p.setInputFiles('#fileAny', { name: '메모.txt', mimeType: 'text/plain', buffer: Buffer.from('가짜 메모') }); await p.waitForTimeout(700);
  const pv2 = await R('#pv'), ch = await R('#chips');
  want(ch.h > 0 && Math.abs(pv2.b - ch.t) <= 2, `첨부 칩 위까지만 사진 (사진 끝 ${pv2.b}, 칩 ${ch.t})`);
  await p.evaluate(() => { att.length = 0; renderChips(); }); await p.waitForTimeout(400);

  /* 판독문을 펴면 떠 있는 대화는 숨음 */
  await p.tap('#pvD'); await p.waitForTimeout(300);
  want(await p.evaluate(() => getComputedStyle(document.getElementById('pvTalk')).display === 'none'), '판독문 펼치면 떠 있는 대화 숨음');
  await p.tap('#pvD'); await p.waitForTimeout(300);

  /* 대화 숨기기 = 사진만 가득 */
  await p.tap('#pvC'); await p.waitForTimeout(500);
  const pv3 = await R('#pv');
  want(pv3.b >= 913 && await p.evaluate(() => getComputedStyle(document.getElementById('pvTalk')).display === 'none' && !document.getElementById('app').classList.contains('pvtalk')), `대화 숨기기 → 사진만 화면 가득 (${pv3.t}~${pv3.b})`);
  want(await p.evaluate(() => localStorage.getItem('drmartin.pvfull2') === '1'), '고른 모드는 기억');
  await p.tap('#pvC'); await p.waitForTimeout(400);

  /* 닫으면 원래대로 */
  await p.tap('#pvX'); await p.waitForTimeout(400);
  want(await p.evaluate(() => !document.getElementById('app').classList.contains('pvtalk') && getComputedStyle(document.getElementById('form')).zIndex === 'auto'), '닫으면 입력줄 원래대로');
  want(!errs.length, '페이지 오류 없음 ' + errs.join(' / '));
  await b.close(); process.exit(bad ? 1 : 0);
})();
