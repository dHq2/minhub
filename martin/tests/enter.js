// 엔터 점검 v1.1 (2026-11-17, A) — 폰에선 엔터 = 줄 바꿈(건네기는 단추로만), 마우스 화면은 엔터 = 건네기 그대로
// v1.0 → v1.1: 사진 위 대화(C pvtalk)에서 여러 줄을 써도 사진 끝자리가 입력줄을 따라 올라감
// 쓰는 법: bash martin/tests/run.sh enter
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const PIC = 'data:image/webp;base64,' + fs.readFileSync(path.join(__dirname, '..', 'img', 'martin.webp')).toString('base64');   /* 가짜 자료 */
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__n = 0; const store = {};
  const snap = path => ({ exists: path in store, data: () => JSON.parse(store[path]) });
  window.claude = { use: async n => {
    if (n === 'db') return { doc: path => ({ get: async () => snap(path), set: async d => { store[path] = JSON.stringify(d); } }),
      collection: name => { const q = { orderBy: () => q, limit: () => q, get: async () => ({ docs: [] }) }; return q; } };
    if (n === 'assets') return { upload: async b => ({ id: 'x1', sizeBytes: b.size }) };
    if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { if (p.includes('가짜엔터')) window.__n++; await new Promise(r => setTimeout(r, 100)); return { say: ['알겠다.'] }; };
    return f; } };
};
(async () => {
  const b = await chromium.launch(); let bad = 0; const errs = [];
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const open = async opt => { const c = await b.newContext(opt); const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(MOCK); await p.goto(URL); await p.waitForTimeout(3500);
    const sk = await p.$('#upGo, #upLater'); if (sk && await sk.isVisible()) { await p.click('#upLater').catch(() => {}); await p.waitForTimeout(800); }
    await p.waitForFunction(() => !document.querySelector('#send').disabled, null, { timeout: 15000 }).catch(() => {});
    return p; };

  console.log('— 폰');
  const p = await open({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  want(await p.evaluate(() => matchMedia('(hover: none) and (pointer: coarse)').matches), '폰으로 알아봄');
  want(await p.$eval('#msg', m => m.getAttribute('enterkeyhint')) === 'enter', '자판 엔터 키가 줄 바꿈 모양(enterkeyhint=enter)');
  await p.tap('#msg'); await p.keyboard.type('가짜엔터 첫 줄'); await p.keyboard.press('Enter'); await p.keyboard.type('둘째 줄');
  await p.waitForTimeout(600);
  const v = await p.$eval('#msg', m => m.value);
  want(v === '가짜엔터 첫 줄\n둘째 줄', '엔터를 눌러도 안 건네지고 줄이 바뀜: ' + JSON.stringify(v));
  want(await p.evaluate(() => window.__n) === 0, '마틴에게 안 감');
  want(await p.$eval('#msg', m => m.offsetHeight) > 50, '두 줄만큼 입력칸이 늘어남');
  await p.tap('#send'); await p.waitForTimeout(1500);
  want(await p.evaluate(() => window.__n) === 1, '건네기 단추로는 건네짐');
  want(await p.$eval('#msg', m => m.value) === '', '건넨 뒤 입력칸 비움');
  const last = await p.evaluate(() => [...document.querySelectorAll('#chat .msg.p')].map(e => e.textContent).filter(t => t.includes('가짜엔터')).pop() || '');
  want(last.includes('둘째 줄'), '두 줄 모두 대화창에 들어감');

  console.log('— 폰, 사진 위 대화에서 여러 줄');
  await p.evaluate(pic => { S.nodes.push({ id: 'n77', kind: 'photo', title: '가짜 캡처', note: '', x: 1100, y: 1100, r: 0, thumb: pic }); renderAll(); openPv('n77'); }, PIC);
  await p.waitForTimeout(700);
  const R = sel => p.$eval(sel, e => { const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom) }; });
  const f0 = await R('#form'), v0 = await R('#pv');
  want(Math.abs(v0.b - f0.t) <= 2, `처음엔 사진이 입력줄 바로 위까지 (사진 끝 ${v0.b}, 입력줄 ${f0.t})`);
  await p.tap('#msg'); await p.keyboard.type('가짜엔터 하나'); await p.keyboard.press('Enter'); await p.keyboard.type('둘'); await p.keyboard.press('Enter'); await p.keyboard.type('셋');
  await p.waitForTimeout(400);
  const f1 = await R('#form'), v1 = await R('#pv'), tk = await R('#pvTalk');
  want(f1.t < f0.t - 30, `세 줄 쓰면 입력줄이 위로 커짐 (${f0.t} → ${f1.t})`);
  want(Math.abs(v1.b - f1.t) <= 2 && tk.b <= f1.t, `사진·떠 있는 대화도 따라 올라가 안 덮임 (사진 끝 ${v1.b}, 대화 끝 ${tk.b}, 입력줄 ${f1.t})`);
  await p.screenshot({ path: '/tmp/martin-엔터-사진대화.png' });
  await p.tap('#send'); await p.waitForTimeout(1500);
  const f2 = await R('#form'), v2 = await R('#pv');
  want(Math.abs(v2.b - f2.t) <= 2 && f2.t > f1.t, `건넨 뒤 입력줄이 줄어들면 사진도 다시 내려옴 (사진 끝 ${v2.b}, 입력줄 ${f2.t})`);

  console.log('— 마우스 화면');
  const d = await open({ viewport: { width: 1280, height: 800 } });
  want(!(await d.evaluate(() => matchMedia('(hover: none) and (pointer: coarse)').matches)), '폰 아님으로 알아봄');
  await d.click('#msg'); await d.keyboard.type('가짜엔터 한 줄'); await d.keyboard.press('Shift+Enter'); await d.keyboard.type('둘');
  want(await d.$eval('#msg', m => m.value) === '가짜엔터 한 줄\n둘', 'Shift+엔터 = 줄 바꿈 그대로');
  await d.keyboard.press('Enter'); await d.waitForTimeout(1500);
  want(await d.evaluate(() => window.__n) === 1, '엔터 = 건네기 그대로');

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `\n실패 ${bad}` : '\n모두 통과'); process.exit(bad ? 1 : 0);
})();
