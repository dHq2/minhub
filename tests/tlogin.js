// v1.0 (2026-11-15, A) — 로그인 화면 v4: 앱 안 가입(아이디 + 숫자 4자리), 아이디 로그인, 겹치는 아이디, 암호 확인, 암호 바꾸기, 예전 숫자만 로그인
const { chromium } = require('playwright');
const APP = 'http://localhost:8765/sehee/', SRV = 'http://localhost:8787';
(async () => {
  const b = await chromium.launch(); let bad = 0;
  const check = (n, c, x) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (x !== undefined ? ' · ' + x : '')); if (!c) bad++; };
  const p = await (await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' })).newPage();
  const keys = async code => { for (const d of code) await p.locator(`#pinVeil [data-k="${d}"]`).click(); await p.waitForTimeout(150); };
  const m = () => p.locator('#pinM').textContent();
  await p.goto(APP + '?sync=' + SRV); await p.waitForSelector('#pinVeil');
  await p.screenshot({ path:'/tmp/tlogin-1.png' });
  // 가입 — 겹치는 아이디
  await p.locator('[data-mode="up"]').click(); await p.locator('#pinId').fill('test'); await keys('1111'); await keys('1111'); await p.waitForTimeout(500);
  check('겹치는 아이디는 막힘', /이미 있어요/.test(await m()), await m());
  // 가입 — 확인이 다름
  await p.locator('#pinId').fill('손님1'); await keys('4321'); check('한 번 더 물음', /한 번 더/.test(await m())); await keys('4320'); await p.waitForTimeout(300);
  check('두 번이 다르면 처음부터', /달라요/.test(await m()), await m());
  // 가입 — 됨
  await keys('4321'); await keys('4321'); await p.waitForSelector('#pinVeil', { state:'detached' }); await p.waitForTimeout(1500);
  check('새 계정으로 열림', (await p.evaluate(() => [SYNC.user, SYNC.on].join())) === '손님1,true');
  // 암호 바꾸기
  await p.evaluate(() => settingsSheet()); await p.waitForTimeout(300);
  await p.locator('[data-sact="pinchg"]').click(); await p.locator('#pinOld').fill('0000'); await p.locator('#pinNew').fill('2468'); await p.locator('[data-sact="pinset"]').click(); await p.waitForTimeout(600);
  check('틀린 지금 암호면 못 바꿈', /틀렸어요/.test(await p.locator('#toastMsg').textContent()), await p.locator('#toastMsg').textContent());
  await p.locator('#pinOld').fill('4321'); await p.locator('#pinNew').fill('2468'); await p.locator('[data-sact="pinset"]').click(); await p.waitForTimeout(800);
  // 로그아웃 → 옛 암호 안 됨, 새 암호 됨
  await p.evaluate(() => syncLogout()); await p.waitForSelector('#pinVeil');
  check('아이디가 미리 채워짐', (await p.locator('#pinId').inputValue()) === '손님1');
  await keys('4321'); await p.waitForTimeout(500); check('옛 암호는 안 됨', /틀렸어요/.test(await m()), await m());
  await keys('2468'); await p.waitForSelector('#pinVeil', { state:'detached' }); await p.waitForTimeout(1200);
  check('새 암호로 열림', (await p.evaluate(() => SYNC.user)) === '손님1');
  // 예전 숫자만(아이디 비움) — PINS 계정
  await p.evaluate(() => syncLogout()); await p.waitForSelector('#pinVeil'); await p.locator('#pinId').fill(''); await keys('2580');
  await p.waitForSelector('#pinVeil', { state:'detached' }); await p.waitForTimeout(1200);
  check('아이디 없이 숫자만 — 예전 계정', (await p.evaluate(() => SYNC.user)) === 'test');
  // 서버: 이름 규칙
  const bad1 = await fetch(SRV + '/signup', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ user:'a', pin:'1234' }) });
  check('너무 짧은 아이디는 400', bad1.status === 400);
  const root = await (await fetch(SRV + '/')).json(); check('서버 v4 · 가입 열림', root.v === 4 && root.signup === true);
  console.log('LOGIN bad', bad); await b.close(); if (bad) process.exit(1);
})();
