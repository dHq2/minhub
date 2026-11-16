// 마틴 기본 점검 v1.3 (2026-11-16, A·D·B) — 가짜 마틴(window.claude 대역)으로 열기·옛 수첩 옮기기·한 턴·수첩 적기·저장까지. 폰 화면만(보스: 모바일 기준).
// v1.0 → v1.1: 컴 화면 빼고 폰만
// v1.1 → v1.2 (D): 수첩 목록형 확인 줄
// v1.2 → v1.3 (11-16 B): 난제 지도 — 옛 가설 띠 옮기기·pz 적용(새 난제·가설·이력·풀림·합침·없어짐)·서랍·난제 지정·붙잡기
// 쓰는 법: bash martin/tests/run.sh   (스크린샷은 /tmp/martin-*.png — 꼭 직접 열어 본다)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__p = [];
  const store = {};
  const snap = (path) => ({ exists: path in store, data: () => JSON.parse(store[path]) });
  window.claude = { use: async n => {
    if (n === 'db') return { doc: path => ({ get: async () => snap(path), set: async d => { store[path] = JSON.stringify(d); } }),
      collection: name => { const q = { orderBy: () => q, limit: () => q, get: async () => ({ docs: Object.keys(store).filter(k => k.startsWith(name + '/')).map(k => ({ id: k, data: () => JSON.parse(store[k]) })) }) }; return q; } };
    if (n === 'assets') return { upload: async b => ({ id: 'x' + Math.random().toString(36).slice(2), sizeBytes: b.size }) };
    if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async (p, o) => { if (!p.includes('손질됐다')) window.__lastp = p; window.__p.push(p.slice(0, 40)); await new Promise(r => setTimeout(r, 150));
      if (p.includes('손질됐다')) return { say: ['하! 판에 손을 좀 봤다, 동료.'] };
      return { say: ['이어졌군.'], ops: [{ op: 'add', id: 'n6', kind: 'clue', title: '편의점 영수증', note: '22:41 결제', near: 'n3' }],
        notes: [{ k: 'q', t: '왜 22:40에 답장이 끊겼나?' }, { k: 'guess', t: '동료는 언니가 숨긴다고 본다', by: 'me' }],
        solve: [{ id: 'n5', a: '사진의 시계가 11:02' }, { id: 'm1', a: '고화질본에서 확인' }], drop: ['m3'],
        pz: [{ op: 'new', id: 'p2', t: '22:40에 지민은 어디 있었나?', up: 'p1' }, { op: 'hyp', p: 'p2', id: 'h2', t: '편의점에 있었다', c: 60, b: ['n6', 'zz9'], why: '영수증 22:41' },
          { op: 'hyp', p: 'p2', id: 'h3', t: '집에 있었다', c: 20, b: ['n3'] }, { op: 'kill', h: 'h3', why: '영수증과 어긋남' },
          { op: 'hyp', id: 'h1', c: 55, b: ['p2'] }, { op: 'new', id: 'p3', t: '영수증은 진짜인가?', up: 'p1' }, { op: 'hyp', p: 'p3', id: 'h4', t: '진짜 영수증', c: 70, b: ['n6'] },
          { op: 'merge', from: 'p3', into: 'p2', why: '같은 물음' }, { op: 'new', id: 'p4', t: '언니는 왜 침묵했나?', up: 'p1' }, { op: 'drop', p: 'p4', why: '전제가 틀렸다' }, { op: 'solve', p: 'p2', h: 'h2', a: '편의점 — 영수증 22:41', b: ['n6'] }] }; };
    return f; } };
};
const SEED = { v: 3, id: '20261116-test', at: 1, nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 1000, r: 0 }, { id: 'n3', kind: 'person', title: '김지민', note: '', x: 1200, y: 1000, r: 0 }, { id: 'n5', kind: 'question', title: '22:40의 공백', note: '20분 동안 어디에?', x: 900, y: 1200, r: 0 }], links: [],
  log: [{ who: 'p', text: '이전 대화', at: 1 }, { who: 'm', text: '하! 좋은 질문이다.', at: 2 }], memo: ['언니의 프사 날짜 확인할 것', '의문 카드 4장 상한 지켜라', '지민은 이모티콘을 안 쓴다', '영수증은 위조 같다'],
  hyp: { n: 1, title: '가설', body: '', confidence: 40, culprit: null, alts: [] }, turn: 3, nid: 6, suspect: null };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  for (const [name, vp] of [['폰', { width: 412, height: 915 }]]){
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: name === '폰' ? 2 : 1 });
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.addInitScript(MOCK); await p.addInitScript(s => { if (!sessionStorage.getItem('seeded')){ localStorage.setItem('drmartin.v2', s); sessionStorage.setItem('seeded', 1); } }, JSON.stringify(SEED));
    await p.goto(URL); await p.waitForTimeout(4000);
    const v = await p.evaluate(() => [VER, document.getElementById('ver').textContent]);
    want(v[0] === v[1] && /^v\d+\.\d+\.\d+$/.test(v[0]), `${name} 버전 표시 ${v[1]}`);
    const mig = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.v2')).notes.map(n => n.k));
    want(mig.join() === 'todo,fact,guess', `${name} 옛 수첩 옮기기 ${mig}`);
    await p.click('#msg'); await p.keyboard.type('22시 40분 사진 봐봐'); await p.keyboard.press('Enter'); await p.waitForTimeout(6000);
    const st = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.v2')));
    want(st.nodes.some(n => n.id === 'n6') && !st.nodes.some(n => n.id === 'n5'), `${name} 판: 카드 추가·의문 카드 풀려 떼짐 ${st.nodes.map(n => n.id)}`);
    const solved = st.notes.filter(n => n.done).map(n => n.t.slice(0, 8) + '→' + n.a);
    want(solved.length === 2, `${name} 풀린 의문 ${JSON.stringify(solved)}`);
    want(await p.evaluate(() => String(window.__lastp).includes('[수사 수첩')), `${name} 프롬프트에 수첩`);
    if (name === '폰'){ await p.click('#btnNb'); await p.waitForTimeout(400); }
    await p.fill('#nbIn', '김지민 인스타 확인'); await p.press('#nbIn', 'Enter'); await p.waitForTimeout(300);
    want((await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.v2')).notes.filter(n => n.k === 'me').length)) === 1, `${name} 내 메모 적기`);
    /* 11-16 D: 수첩 목록형 — 한 줄 목록, 고정폭 작은 글씨, 손글씨체 없음, 꼬리표 없음 */
    const nl = await p.evaluate(() => { const li = [...document.querySelectorAll('#nbBody .nl[data-n], #nbBody .nl[data-card]')]; const f = li.length ? getComputedStyle(li[0]).fontFamily + '|' + getComputedStyle(li[0]).fontSize : ''; return { n: li.length, f, pen: [...document.querySelectorAll('#nbBody *')].some(e => /Pen Script/.test(getComputedStyle(e).fontFamily)), meta: document.querySelectorAll('#nbBody .mt').length }; });
    want(nl.n >= 4 && /Coding/.test(nl.f) && parseFloat(nl.f.split('|')[1]) <= 13 && !nl.pen && !nl.meta, `${name} 수첩 목록형 ${JSON.stringify(nl)}`);
    await p.screenshot({ path: `/tmp/martin-${name}.png` });
    /* 11-16 B: 난제 지도 */
    const pz = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('drmartin.v2')); return s.probs; });
    want(pz && pz[0].root && pz[0].hy[0].t === '가설' && pz[0].hy[0].id === 'h1', `${name} 옛 가설 띠 → 뿌리 난제 가설 ${pz && pz[0].hy.map(h => h.id + ':' + h.t)}`);
    want(await p.evaluate(() => String(window.__lastp).includes('[난제 지도') && String(window.__lastp).includes('p1 [열림·뿌리·붙잡음]')), `${name} 프롬프트에 난제 지도`);
    const p2 = pz.find(x => x.id === 'p2'), h1 = pz[0].hy.find(h => h.id === 'h1');
    want(p2 && p2.up === 'p1' && p2.st === 'solved' && p2.hy.find(h => h.id === 'h2').st === 'win' && p2.hy.find(h => h.id === 'h2').b.join() === 'n6', `${name} 작은 난제 풀림·맞힌 가설·근거 거름 ${p2 && p2.st} ${p2 && p2.a}`);
    want(p2 && p2.hy.find(h => h.id === 'h3').st === 'dead', `${name} 버린 가설 남음`);
    const sg = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.v2')));
    want(!sg.probs.some(x => x.id === 'p3' || x.id === 'p4') && sg.pgone.map(g => g.id + (g.into ? '>' + g.into : '')).join() === 'p3>p2,p4' && sg.probs.find(x => x.id === 'p2').hy.some(h => h.id === 'h4'), `${name} 난제 합침·없어짐 ${sg.pgone && sg.pgone.map(g => g.id + ':' + (g.into || '') + ':' + g.why)}`);
    want(h1 && h1.hist.map(x => x[1]).join() === '40,55' && h1.b.join() === 'p2', `${name} 가설 이력 ${h1 && h1.hist.map(x => x[1])} 근거 ${h1 && h1.b}`);
    if (name === '폰'){ await p.click('#nbX'); await p.waitForTimeout(400); }
    await p.click('#btnPz'); await p.waitForTimeout(450);
    want(await p.evaluate(() => document.body.classList.contains('pzmopen') && !document.body.classList.contains('nbopen')), `${name} 난제 서랍 열림`);
    await p.fill('#pzmIn', '김지민 프사는 언제 바뀌었나?'); await p.press('#pzmIn', 'Enter'); await p.waitForTimeout(300);
    const p3 = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.v2')).probs.find(x => x.id === 'p5'));
    want(p3 && p3.by === 'me' && p3.up === 'p1', `${name} 난제 지정 ${p3 && p3.id + ' ' + p3.up + ' ' + p3.by}`);
    await p.click('[data-ptog="p5"]'); await p.waitForTimeout(200); await p.click('[data-pfocus="p5"]'); await p.waitForTimeout(300);
    want(await p.evaluate(() => S.pfocus === 'p5' && document.getElementById('hypN').textContent === 'p5 붙잡음'), `${name} 붙잡기 → 띠`);
    await p.click('[data-ptog="p2"]'); await p.waitForTimeout(300);
    await p.click('.pgone summary'); await p.waitForTimeout(200);
    await p.screenshot({ path: `/tmp/martin-${name}-난제.png` });
    await p.click('#pzmX'); await p.waitForTimeout(400);
    await p.screenshot({ path: `/tmp/martin-${name}-띠.png` });
    await p.close();
  }
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
