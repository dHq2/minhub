// 판 다시 짓기 점검 v1.0 (2026-11-16, A) — 「판 정리」: 마틴이 묶음을 짜고(가짜 답) 앱이 사람 기둥으로 다시 놓음 · 묶음끼리 안 겹침 · 기둥 실·묶음 사이 빨간 실 · 실 솎기/잇기 · 머리 없을 때 실 따라 묶기 · 새 카드 of. 폰 화면.
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__fail = false; window.__p = [];
  window.claude = { use: async n => {
    if (n === 'db') return { doc: () => ({ get: async () => ({ exists: false }), set: async () => {} }), collection: () => { const q = { orderBy: () => q, limit: () => q, get: async () => ({ docs: [] }) }; return q; } };
    if (n === 'assets') return { upload: async b => ({ id: 'x', sizeBytes: b.size }) };
    if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { window.__p.push(p.slice(0, 60)); await new Promise(r => setTimeout(r, 80));
      if (p.includes('손질됐다')) return { say: ['판을 손봤다.'] };
      if (p.includes('「판 정리」를 눌렀다')){ if (window.__fail) throw Object.assign(new Error('x'), { code: 'rate_limited' });
        return { say: ['판을 다시 짠다.', { t: '지민의 이야기가 가장 길다.', on: ['n3'] }],
          groups: [{ a: 'n3', name: '김지민', cards: ['n4', 'n10', 'n11', 'n12'] }, { a: 'n5', name: '박팀장', cards: ['n13', 'n14'] }, { a: 'n6', name: '금고', cards: ['n7', 'n8', 'n9'] }],
          cut: ['n9-n4'], link: [{ a: 'n12', b: 'n3', label: '보낸 이', sure: true }, { a: 'n5', b: 'n3', label: '상사', sure: true }], relabel: [{ id: 'n4-n3', label: '열쇠' }], merge: [] }; }
      return { say: ['새 쪽지다.'], ops: [{ op: 'add', id: 'n15', kind: 'doc', title: '경비 일지', note: '23:20 출입', near: 'n7', of: 'n6' }] }; };
    return f; } };
};
const P = (id, kind, title, x, y) => ({ id, kind, title, note: '', x, y, r: 0 });
const SEED = { v: 3, id: '20261116-tidy', at: 1, nodes: [P('n1', 'brief', '가짜 금고 사건', 1000, 900), P('n3', 'person', '김지민', 700, 1300), P('n4', 'clue', '반납된 열쇠', 1500, 700), P('n5', 'person', '박팀장', 1300, 1500),
    P('n6', 'clue', '빈 금고', 600, 600), P('n7', 'doc', '출입 기록', 1100, 1200), P('n8', 'question', '복사본은?', 900, 1700), P('n9', 'clue', '열쇠집 영수증', 1700, 1500),
    P('n10', 'photo', '지민 카톡', 500, 1000), P('n11', 'doc', '지민 진술', 1450, 1100), P('n12', 'photo', '단톡 캡처', 800, 1500), P('n13', 'doc', '팀장 메일', 1200, 800), P('n14', 'photo', '팀장 문자', 1600, 1200)],
  links: [{ id: 'n4-n3', a: 'n4', b: 'n3', label: '반납', sure: true }, { id: 'n9-n4', a: 'n9', b: 'n4', label: '복사?', sure: false }, { id: 'n7-n6', a: 'n7', b: 'n6', label: '기록', sure: true }, { id: 'n13-n5', a: 'n13', b: 'n5', label: '보냄', sure: true }, { id: 'n8-n9', a: 'n8', b: 'n9', label: '', sure: false }],
  log: [{ who: 'p', text: '이전', at: 1 }], memo: [], notes: [], nmax: 0, turn: 2, nid: 15, suspect: null };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK); await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(3500);
  await p.screenshot({ path: '/tmp/martin-tidy-0.png' });
  await p.click('#btnTidy'); await p.waitForFunction(() => !busy && (S.groups || []).length, null, { timeout: 30000 }); await p.waitForTimeout(800);
  const st = await p.evaluate(() => {
    const box = g => { const ns = [g.a, ...g.cards].filter(Boolean).map(nodeOf); return [Math.min(...ns.map(n => n.x - n.w / 2)), Math.min(...ns.map(n => n.y - n.h / 2)), Math.max(...ns.map(n => n.x + n.w / 2)), Math.max(...ns.map(n => n.y + n.h / 2))]; };
    const bx = S.groups.map(box), over = []; for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++){ const A = bx[i], B = bx[j]; if (A[0] < B[2] + 60 && B[0] < A[2] + 60 && A[1] < B[3] + 60 && B[1] < A[3] + 60) over.push(i + '-' + j); }
    const cardsOver = []; const ns = S.nodes; for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++){ const A = ns[i], B = ns[j]; if (Math.abs(A.x - B.x) < (A.w + B.w) / 2 && Math.abs(A.y - B.y) < (A.h + B.h) / 2) cardsOver.push(A.id + '/' + B.id); }
    return { groups: S.groups.map(g => (g.a || '-') + ':' + g.cards.join('+')), over, cardsOver, spines: document.querySelectorAll('#zones .spine').length, zones: document.querySelectorAll('#zones .zone').length, zt: [...document.querySelectorAll('.zt')].map(e => e.textContent), xl: [...document.querySelectorAll('#xl .str')].map(e => e.dataset.id), links: S.links.map(L => L.id + ':' + L.label), anchorAbove: S.groups.every(g => !g.a || g.cards.every(id => nodeOf(id).y > nodeOf(g.a).y)) };
  });
  want(st.groups.join('|') === 'n3:n4+n10+n11+n12|n5:n13+n14|n6:n7+n8+n9', '마틴이 짠 묶음 그대로 ' + st.groups.join('|'));
  want(!st.over.length, '묶음끼리 60px 넘게 떨어짐 ' + JSON.stringify(st.over));
  want(!st.cardsOver.length, '카드끼리 안 겹침 ' + JSON.stringify(st.cardsOver));
  want(st.anchorAbove, '사람(중심)이 묶음 맨 위');
  want(st.zones === 3 && st.zt.length === 3, '묶음 바탕·이름표 3 ' + st.zt.join(','));
  want(st.spines === 9, '기둥 실 = 구성원 수 9 → ' + st.spines);
  want(st.xl.includes('n5-n3') && !st.links.some(l => l.startsWith('n9-n4')), '묶음 사이 실은 위(빨강), 솎은 실 없음 ' + st.xl.join(','));
  want(st.links.includes('n4-n3:열쇠') && st.links.includes('n12-n3:보낸 이'), '꼬리표 고침·새 실');
  await p.screenshot({ path: '/tmp/martin-tidy-1.png' });
  await p.locator('.zt').nth(2).click(); await p.waitForTimeout(900);
  want(await p.evaluate(() => [...document.querySelectorAll('#nodes .card.spot')].map(e => e.dataset.id).sort().join()) === 'n6,n7,n8,n9', '이름표 누르면 그 묶음 비춤');
  await p.screenshot({ path: '/tmp/martin-tidy-2.png' }); await p.waitForTimeout(2800);
  await p.click('#msg'); await p.keyboard.type('경비 일지도 있어'); await p.keyboard.press('Enter');
  await p.waitForFunction(() => !busy && S.turn >= 3, null, { timeout: 30000 }); await p.waitForTimeout(1200);
  const st2 = await p.evaluate(() => ({ g: S.groups.find(g => g.a === 'n6').cards.join('+'), near: Math.abs(nodeOf('n15').x - nodeOf('n6').x) < 300 && nodeOf('n15').y > nodeOf('n6').y }));
  want(st2.g.includes('n15') && st2.near, '새 카드 of → 그 묶음 안에 자리 ' + st2.g);
  await p.evaluate(() => { window.__fail = true; S.groups = []; }); await p.click('#btnTidy'); await p.waitForFunction(() => !busy && (S.groups || []).length, null, { timeout: 30000 }); await p.waitForTimeout(500);
  const st3 = await p.evaluate(() => S.groups.map(g => (g.a || '-') + ':' + g.cards.join('+')));
  want(st3.length >= 2 && st3.some(g => g.startsWith('n3:')) && st3.some(g => g.startsWith('n5:') && g.includes('n13')), '머리 없을 때 실 따라 묶기 ' + st3.join('|'));
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
