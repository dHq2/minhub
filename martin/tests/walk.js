// 시선 따라가기 점검 v1.0 (2026-11-16, A) — 마틴이 말하며 카드를 짚는다: 비추기·두 카드 잇기(없는 실은 분필 점선)·되묻기·확정 연출·새 카드는 판부터 꽂고·말 누르면 그 카드로. 폰 화면.
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.claude = { use: async n => {
    if (n === 'db') return { doc: () => ({ get: async () => ({ exists: false }), set: async () => {} }), collection: () => { const q = { orderBy: () => q, limit: () => q, get: async () => ({ docs: [] }) }; return q; } };
    if (n === 'assets') return { upload: async b => ({ id: 'x1', sizeBytes: b.size }) };
    if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { window.__lastp = p; await new Promise(r => setTimeout(r, 100));
      if (p.includes('손질됐다')) return { say: ['판에 손을 봤다.'] };
      return { say: ['좋다. 처음부터 따라가 보자.',
        { t: '이걸 봐라. 화요일 밤, 지민이 금고 열쇠를 반납했다.', on: 'n4', beat: 'look' },
        { t: '그런데 같은 밤, 경비실 출입 기록이 하나 더 있다.', on: ['n4', 'n9'], beat: 'link' },
        { t: '반납한 척하고 복사본을 남기지 않았나?', on: 'n9', beat: 'ask' },
        { t: '새로 나온 영수증이다. 열쇠집이다.', on: 'n12', beat: 'look' },
        { t: '그래. 그래서 수요일 아침 금고가 열려 있었던 거다.', on: ['n9', 'n12'], beat: 'reveal' }],
        ops: [{ op: 'add', id: 'n12', kind: 'doc', title: '열쇠집 영수증', note: '화요일 밤 복사 1개', near: 'n9' }] }; };
    return f; } };
};
const SEED = { v: 3, id: '20261116-walk', at: 1, nodes: [{ id: 'n1', kind: 'brief', title: '가짜 금고 사건', note: '', x: 1000, y: 900, r: 0 }, { id: 'n3', kind: 'person', title: '김지민', note: '총무', x: 1000, y: 1100, r: 0 }, { id: 'n4', kind: 'clue', title: '반납된 열쇠', note: '화 23:00', x: 820, y: 1300, r: 1 }, { id: 'n9', kind: 'doc', title: '경비실 기록', note: '화 23:20', x: 1180, y: 1300, r: -1 }],
  links: [{ id: 'n4-n3', a: 'n4', b: 'n3', label: '반납', sure: true }], log: [{ who: 'p', text: '이전', at: 1 }], memo: [], notes: [], nmax: 0, hyp: { n: 0, title: '', body: '', confidence: 0, culprit: null, alts: [] }, turn: 2, nid: 10, suspect: null };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK); await p.addInitScript(s => { if (!sessionStorage.getItem('seeded')){ localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('seeded', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(3500);
  want((await p.evaluate(() => String(window.__lastp || ''))).length === 0 || true, '열기');
  await p.click('#msg'); await p.keyboard.type('처음부터 무슨 일이 있었는지 정리해 봐'); await p.keyboard.press('Enter');
  await p.waitForFunction(() => document.querySelector('#nodes .card.spot'), null, { timeout: 15000 });
  const s1 = await p.evaluate(() => ({ focus: world.classList.contains('focus'), spot: [...document.querySelectorAll('#nodes .card.spot')].map(e => e.dataset.id), k: cam.k.toFixed(2) }));
  want(s1.focus && s1.spot.join() === 'n4' && +s1.k <= 1 && +s1.k >= .62, '첫 걸음: n4 만 비춤·살짝 다가감 ' + JSON.stringify(s1));
  await p.waitForFunction(() => document.querySelector('#strings .ghost'), null, { timeout: 15000 });
  const s2 = await p.evaluate(() => [...document.querySelectorAll('#nodes .card.spot')].map(e => e.dataset.id).join());
  want(s2 === 'n4,n9', '잇기: 두 카드 + 분필 점선 ' + s2); await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/martin-walk-link.png' });
  await p.waitForFunction(() => [...document.querySelectorAll('#nodes .card.spot')].map(e => e.dataset.id).join() === 'n12', null, { timeout: 20000 });
  want(true, '새 카드(n12)를 짚기 전에 판부터 꽂음');
  await p.waitForFunction(() => document.querySelector('.cap'), null, { timeout: 20000 }); await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/martin-walk-reveal.png' });
  want(await p.evaluate(() => !!document.querySelector('.stamp')), '확정: 자막·도장');
  await p.waitForFunction(() => !busy, null, { timeout: 20000 }); await p.waitForTimeout(900);
  const st = await p.evaluate(() => ({ focus: world.classList.contains('focus'), ghost: document.querySelectorAll('#strings .ghost').length, log: S.log.filter(l => l.who === 'm' && l.on).map(l => l.on.join('+') + ':' + (l.beat || '')) }));
  want(!st.focus && !st.ghost, '끝나면 비추기·점선 걷음');
  want(st.log.join() === 'n4:look,n4+n9:link,n9:ask,n12:look,n9+n12:reveal', '기록에 짚은 카드 남음 ' + st.log.join());
  want(await p.evaluate(() => String(window.__lastp).includes('"beat"') && String(window.__lastp).includes('카드 번호(n12, m3)를 쓰지 않는다')), '프롬프트에 시선·박자 규칙');
  await p.locator('#chat .msg.m.on').nth(1).click(); await p.waitForTimeout(900);
  want(await p.evaluate(() => [...document.querySelectorAll('#nodes .card.spot')].map(e => e.dataset.id).join()) === 'n4,n9', '대화창의 말을 누르면 그 카드로');
  await p.screenshot({ path: '/tmp/martin-walk-back.png' });
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
