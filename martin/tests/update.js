// 업데이트 묻기·적용 과정 점검 v1.1 (2026-11-16, D · 11-17 D: 사건 중 한 줄 묻기·한 줄 안내·「바뀐 것」 서랍) — 본 버전이 옛것인 판을 열면 마틴이 묻는지, 적용/미룸 두 갈래, 처음 쓰는 사람은 안 묻는지. 폰 화면.
// 쓰는 법: bash martin/tests/run.sh update   (스크린샷 /tmp/martin-업데이트-묻기.png · /tmp/martin-업데이트-끝.png — 꼭 직접 열어 본다)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  const store = {};
  const snap = path => ({ exists: path in store, data: () => JSON.parse(store[path]) });
  window.claude = { use: async n => {
    if (n === 'db') return { doc: path => ({ get: async () => snap(path), set: async d => { store[path] = JSON.stringify(d); } }),
      collection: name => { const q = { orderBy: () => q, limit: () => q, get: async () => ({ docs: [] }) }; return q; } };
    if (n === 'assets') return { upload: async b => ({ id: 'x1', sizeBytes: b.size }) };
    if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { await new Promise(r => setTimeout(r, 100)); if (p.includes('손질됐다')) return { say: ['하! 판에 손을 좀 봤다, 동료.'] }; return { say: ['이어졌군.'] }; };
    return f; } };
};
const SEED = { v: 3, id: '20261116-upd', at: 1, nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 1000, r: 0 }, { id: 'n3', kind: 'person', title: '김지민', note: '', x: 1200, y: 1000, r: 0 }], links: [],
  log: [{ who: 'p', text: '이전 대화', at: 1 }, { who: 'm', text: '하! 좋은 질문이다.', at: 2 }], memo: [], hyp: { n: 1, title: '가설', body: '', confidence: 40, culprit: null, alts: [] }, turn: 3, nid: 4, suspect: null };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const open = async seen => {
    const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
    p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(MOCK);
    await p.addInitScript(([s, v]) => { if (!sessionStorage.getItem('seeded')){ localStorage.setItem('drmartin.v2', s); if (v) localStorage.setItem('drmartin.seen', v); sessionStorage.setItem('seeded', 1); } }, [JSON.stringify(SEED), seen]);
    await p.goto(URL); return p;
  };
  const chatHas = (p, t) => p.evaluate(t => document.getElementById('chat').textContent.includes(t), t);
  // 1) 적용한다
  let p = await open('v0.4.0');
  const asked = await p.waitForSelector('#updAsk', { timeout: 20000 }).then(() => true).catch(() => false);
  want(asked && await chatHas(p, '판에 손이 갔다. 적용하겠나?'), '옛 버전 본 판 → 마틴이 한 줄로 묻는다');
  want(await p.evaluate(() => document.getElementById('send').disabled), '묻는 동안 건네기 잠김');
  await p.screenshot({ path: '/tmp/martin-업데이트-묻기.png' });
  if (asked){
    await p.click('#updAsk [data-u="yes"]');
    const done = await p.waitForSelector('#updProg.done', { timeout: 15000 }).then(() => true).catch(() => false);
    want(done, '적용 과정 (1/3)~(3/3) 끝까지');
    want(await p.evaluate(() => !document.querySelector('#updProg .upd-list')), '사건 중엔 막대만(목록은 서랍)');
    await p.waitForTimeout(4000);
    want(await chatHas(p, '가지가 들어왔다. 자세한 건 서랍에 적어 뒀다.') && !(await chatHas(p, '판에 손을 좀 봤다')), '적용 뒤 안내는 고정 한 줄(머리 안 씀)');
    const ml = await p.evaluate(() => S.log.filter(l => l.who === 'm').length);
    want(ml <= 2, `사건 중 업데이트로 늘어난 마틴 말 ${ml}줄(묻기는 기록 안 됨 + 안내 1줄)`);
    await p.click('[data-umore]'); await p.waitForTimeout(400);
    want(await p.evaluate(() => /바뀐 것/.test(document.getElementById('sheet').textContent) && document.getElementById('app').classList.contains('open')), '「바뀐 것 자세히」 → 서랍');
    await p.evaluate(() => closeSheet());
    const st = await p.evaluate(() => [localStorage.getItem('drmartin.seen'), VER, !!localStorage.getItem('drmartin.bak'), document.getElementById('send').disabled]);
    want(st[0] === st[1], `본 버전 표시 ${st[0]} = ${st[1]}`);
    want(st[2], '적용 직전 판 사본(drmartin.bak)');
    want(!st[3], '끝나면 건네기 풀림');
    await p.screenshot({ path: '/tmp/martin-업데이트-끝.png' });
  }
  await p.close();
  // 2) 지금 판으로 계속
  p = await open('v0.4.0');
  if (await p.waitForSelector('#updAsk', { timeout: 20000 }).then(() => true).catch(() => false)){
    await p.click('#updAsk [data-u="no"]'); await p.waitForTimeout(3500);
    const st = await p.evaluate(() => [localStorage.getItem('drmartin.seen'), document.getElementById('send').disabled, document.getElementById('chat').textContent.includes('판에 손을 좀 봤다')]);
    want(st[0] === 'v0.4.0' && !st[1] && !st[2], `미룸 → 본 버전 그대로·설명 없음·건네기 풀림 ${JSON.stringify(st)}`);
  } else want(false, '미룸 갈래: 묻지 않음');
  await p.close();
  // 3) 처음 쓰는 사람(본 기록 없음) → 안 묻는다
  p = await open(null); await p.waitForTimeout(9000);
  want(!(await p.$('#updAsk')), '본 기록 없으면 묻지 않음');
  await p.close();
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
