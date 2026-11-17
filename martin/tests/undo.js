// 마틴 점검 — 되돌리기 · 수첩 × · 첫 인사 v1.1 (2026-11-16, C — v1.1 11-18 A: 마틴의 답도 한 칸, 앱의 뒤따름 손질은 그 칸에)
// 확인: 예전 '동료가 풀림 표시' 줄 되살림 · 수첩 줄 눌러도 그대로 · × 로만 지움 · 되돌리기/다시 하기 · 마틴 답 하나를 통째로 되돌림(대화는 그대로) ·
//       다음 프롬프트에 '동료가 되돌린 것' · 첫 인사(… → 「판은 그대로다」 / 업데이트가 있으면 브리핑이 곧 인사)
// 쓰는 법: bash martin/tests/run.sh undo   (스크린샷 /tmp/martin-되돌리기.png — 꼭 직접 연다)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__p = []; const store = {};
  const snap = path => ({ exists: path in store, data: () => JSON.parse(store[path]) });
  window.claude = { use: async n => {
    if (n === 'db') return { doc: path => ({ get: async () => snap(path), set: async d => { store[path] = JSON.stringify(d); } }),
      collection: name => { const q = { orderBy: () => q, limit: () => q, get: async () => ({ docs: Object.keys(store).filter(k => k.startsWith(name + '/')).map(k => ({ id: k, data: () => JSON.parse(store[k]) })) }) }; return q; } };
    if (n === 'assets') return { upload: async b => ({ id: 'x' + Math.random().toString(36).slice(2), sizeBytes: b.size }) };
    if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { if (!p.includes('손질됐다')) window.__lastp = p; window.__p.push(p.slice(0, 40)); await new Promise(r => setTimeout(r, 200));
      if (p.includes('손질됐다')) return { say: [p.includes('첫 줄은 돌아온') ? '돌아왔군. 그사이 판에 손을 좀 봤다.' : '판에 손을 좀 봤다.', '수첩 줄은 이제 × 로만 지운다.'] };
      return { say: ['이어졌군.'], ops: [{ op: 'add', id: 'n6', kind: 'clue', title: '편의점 영수증', note: '22:41 결제', near: 'n3' }], notes: [{ k: 'fact', t: '영수증은 22:41' }] }; };
    return f; } };
};
const note = (id, k, t, x) => ({ id, k, t, by: 'you', at: 1, turn: null, ...(x || {}) });
const SEED = { v: 3, id: '20261116-undo', at: 1, turn: 3, nid: 6, nmax: 5, suspect: null,
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 1000, r: 0 }, { id: 'n3', kind: 'person', title: '김지민', note: '실종자', x: 1000, y: 1250, r: 1 }],
  links: [], memo: [], log: [{ who: 'p', text: '이전 대화', at: 1 }, { who: 'm', text: '하! 좋은 질문이다.', at: 2 }],
  notes: [note('m1', 'todo', '김지민 프사 날짜 확인할 것'), note('m2', 'fact', '김지민은 편의점 야간 근무'),
    note('m3', 'todo', '편의점 출입 기록 대조할 것', { done: 1, a: '동료가 풀림 표시', doneAt: 5, doneTurn: 3 }),
    note('m4', 'guess', '지민은 스스로 떠났다는 짐작', { done: 1, a: '동료가 풀림 표시', doneAt: 6, doneTurn: 3 }),
    note('m5', 'q', '왜 22:40에 끊겼나', { done: 1, a: '사진의 시계가 11:02', doneAt: 7, doneTurn: 2 })],
  hyp: { n: 1, title: '가설', body: '', confidence: 40, culprit: null, alts: [] } };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const open = async (seen, seed) => {
    const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
    p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(MOCK);
    await p.addInitScript(([s, v]) => { if (!sessionStorage.getItem('seeded')){ localStorage.setItem('drmartin.v2', s); if (v) localStorage.setItem('drmartin.seen', v); sessionStorage.setItem('seeded', 1); } }, [JSON.stringify(seed), seen]);
    await p.goto(URL); return p; };
  const st = p => p.evaluate(() => S);
  const chat = p => p.evaluate(() => [...document.querySelectorAll('#chat .msg.m')].map(e => e.textContent.replace(/\d\d:\d\d$/, '')).slice(1));   /* 0번은 심어 둔 옛 대화 */

  /* 1) 업데이트 없음 — … 먼저, 그다음 「판은 그대로다」 */
  let p = await open('v9.9.9', SEED);
  await p.waitForTimeout(350);
  want(await p.evaluate(() => !!document.querySelector('#chat .wait')), '첫 인사 전 … (생각 중) 보임');
  await p.waitForTimeout(3500);
  let c = await chat(p);
  want(c.some(t => t.includes('판은 그대로다')) && !c.some(t => t.includes('손을 좀 봤다')), `업데이트 없을 때 인사 ${JSON.stringify(c.slice(-1))}`);
  await p.close();

  /* 2) 업데이트 있음 — 업데이트 묻기(D)가 첫 인사를 겸함: 「돌아왔군, 동료.」로 시작, 「잠깐」·「판은 그대로다」 없음 */
  p = await open('v0.1.0', SEED);
  await p.waitForSelector('#updAsk [data-u="no"]', { timeout: 8000 }).catch(() => {});
  await p.click('#updAsk [data-u="no"]').catch(() => {}); await p.waitForTimeout(2500);
  c = await chat(p);
  want(/^돌아왔군/.test(c[0] || '') && (c[0] || '').includes('적용하겠나') && !c.some(t => t.includes('잠깐') || t.includes('판은 그대로다')), `업데이트 미룸 — 인사로 시작(11-17 D: 인사·묻기 한 줄), 「판은 그대로다」 없음 ${JSON.stringify(c)}`);
  await p.close();
  p = await open('v0.1.0', SEED);
  await p.waitForSelector('#updAsk [data-u="yes"]', { timeout: 8000 }).catch(() => {});
  await p.click('#updAsk [data-u="yes"]').catch(() => {}); await p.waitForTimeout(6000);
  c = await chat(p);
  want(/^돌아왔군/.test(c[0] || '') && c.some(t => t.includes('가지가 들어왔다')) && c.filter(t => t.includes('돌아왔군')).length === 1 && !c.some(t => t.includes('판은 그대로다')), `업데이트 적용 — 인사 → 묻기 → 브리핑 ${JSON.stringify(c.slice(-2))}`);

  /* 3) 예전에 눌러서 풀린 칸으로 간 줄 되살림(마틴이 푼 줄은 그대로) */
  let s = await st(p);
  const by = id => s.notes.find(n => n.id === id);
  want(!by('m3').done && !by('m4').done && !by('m3').a && by('m5').done, `실수 풀림 되살림 m3·m4 열림, m5(마틴이 푼 것) 그대로`);

  /* 4) 수첩 줄을 눌러도 그대로, × 로만 지움 */
  await p.click('#btnNb'); await p.waitForTimeout(400);
  await p.click('#nbBody .nl[data-n="m1"] .nl-t'); await p.waitForTimeout(300);
  s = await st(p);
  want(by('m1') && !by('m1').done, '수첩 줄을 눌러도 안 풀리고 안 지워짐');
  const xop = await p.evaluate(() => getComputedStyle(document.querySelector('#nbBody .nl[data-n="m1"] .nl-x')).opacity);
  want(+xop >= .5, `× 가 늘 보임(흐리게) opacity ${xop}`);
  await p.screenshot({ path: '/tmp/martin-수첩-x.png' });
  await p.click('#nbBody .nl[data-n="m1"] .nl-x'); await p.waitForTimeout(900);
  s = await st(p);
  want(!s.notes.some(n => n.id === 'm1'), '× 로 지움');
  await p.click('#nbX'); await p.waitForTimeout(400);

  /* 5) 되돌리기 / 다시 하기 */
  want(await p.evaluate(() => !document.getElementById('btnUndo').disabled), '되돌리기 단추 켜짐');
  await p.click('#btnUndo'); await p.waitForTimeout(500);
  s = await st(p);
  want(s.notes.some(n => n.id === 'm1'), '되돌리기 → 지운 수첩 줄 돌아옴');
  want((s.undone || []).length === 1 && /수첩/.test(s.undone[0].what), `되돌린 기록 ${JSON.stringify(s.undone)}`);
  want(await p.evaluate(() => !document.getElementById('btnRedo').hidden), '다시 하기 단추 나타남');
  await p.click('#btnRedo'); await p.waitForTimeout(500);
  s = await st(p);
  want(!s.notes.some(n => n.id === 'm1'), '다시 하기 → 다시 지워짐');
  await p.click('#btnUndo'); await p.waitForTimeout(500);

  /* 6) 11-18 A: 마틴의 답 하나 = 한 칸 — 그 답이 판에 한 것(카드·수첩)을 통째로, 앱의 뒤따름 손질(프사)도 그 칸에. 대화는 그대로 */
  await p.click('#btnNb'); await p.waitForTimeout(400);
  await p.click('#nbBody .nl[data-n="m2"] .nl-x'); await p.waitForTimeout(900);
  await p.click('#nbX'); await p.waitForTimeout(400);
  const logN = (await st(p)).log.length;
  await p.click('#msg'); await p.keyboard.type('영수증 봐'); await p.keyboard.press('Enter'); await p.waitForTimeout(6000);
  s = await st(p);
  want(s.nodes.some(n => n.id === 'n6') && s.notes.some(n => n.t === '영수증은 22:41') && !s.notes.some(n => n.id === 'm2'), '마틴이 카드·수첩 추가, m2 는 지워진 채');
  const nBack = await p.evaluate(() => UN.back.length);
  await p.evaluate(() => { undoApp(); const n = S.nodes.find(x => x.id === 'n6'); n.face = 'data:image/png;base64,iVBORw0KGgo='; n.faceTried = ['e1']; save(); });   /* 앱이 뒤따라 붙인 얼굴 */
  await p.waitForTimeout(900);
  want(await p.evaluate(n => UN.back.length === n && UN.back[UN.back.length - 1].mart > 0 && /^마틴의 답 — /.test(UN.back[UN.back.length - 1].why), nBack), '앱의 뒤따름 손질은 새 칸이 아니라 마틴의 칸에 합쳐짐');
  await p.click('#btnUndo'); await p.waitForTimeout(700);
  s = await st(p);
  want(!s.nodes.some(n => n.id === 'n6') && !s.notes.some(n => n.t === '영수증은 22:41') && !s.notes.some(n => n.id === 'm2'), `되돌리기 한 번 → 마틴 답의 카드·수첩 통째로 빠짐, 그 앞 동료 손질(m2 지움)은 그대로 (${s.nodes.map(n => n.id)})`);
  want(s.log.length >= logN + 2 && s.log.some(l => l.text === '이어졌군.'), `대화는 그대로 ${s.log.length}줄`);
  want((s.undone || []).some(x => x.mart > 0), '되돌린 기록에 마틴의 답 표시');
  await p.click('#btnRedo'); await p.waitForTimeout(600);
  s = await st(p);
  want(s.nodes.some(n => n.id === 'n6' && n.face) && s.notes.some(n => n.t === '영수증은 22:41'), '다시 하기 → 마틴 답 통째로 돌아옴(얼굴까지)');
  await p.click('#btnUndo'); await p.waitForTimeout(600);
  await p.click('#btnUndo'); await p.waitForTimeout(600);
  s = await st(p);
  want(s.notes.some(n => n.id === 'm2') && !s.nodes.some(n => n.id === 'n6'), '한 번 더 → 마틴 답 앞에 동료가 지운 m2 돌아옴');
  await p.screenshot({ path: '/tmp/martin-되돌리기.png' });
  /* 첨부 칩 빼기도 동료의 일 */
  await p.setInputFiles('#fileAny', { name: '메모.txt', mimeType: 'text/plain', buffer: Buffer.from('가짜 메모') }); await p.waitForTimeout(600);
  await p.click('#chips [data-x="0"]'); await p.waitForTimeout(300);
  want(await p.evaluate(() => att.length === 0), '첨부 뺌');
  await p.click('#btnUndo'); await p.waitForTimeout(300);
  want(await p.evaluate(() => att.length === 1 && att[0].name === '메모.txt'), '되돌리기 → 뺀 첨부 돌아옴');
  await p.click('#chips [data-x="0"]'); await p.waitForTimeout(300);
  /* 끝까지 눌러도 오류 없이 */
  for (let i = 0; i < 6; i++){ await p.click('#btnUndo').catch(() => {}); await p.waitForTimeout(250); }
  s = await st(p);
  want(!s.nodes.some(n => n.id === 'n6'), '끝까지 되돌린 뒤에도 마틴 답의 카드는 빠진 채');
  await p.click('#msg'); await p.keyboard.type('아까 그건 실수야'); await p.keyboard.press('Enter'); await p.waitForTimeout(6000);
  const lp = await p.evaluate(() => String(window.__lastp));
  want(lp.includes('[동료가 되돌렸다') && lp.includes('수첩') && lp.includes('네 답이 판에 한 것 통째로'), '다음 프롬프트에 「동료가 되돌린 것」(마틴의 답 통째로 포함)');
  /* 입력칸에선 Ctrl+Z 가 글자 되돌리기(판 되돌리기가 끼어들지 않음) */
  const before = (await st(p)).notes.length;
  await p.click('#msg'); await p.keyboard.type('지우다 만 글'); await p.keyboard.press('Control+z'); await p.waitForTimeout(400);
  want((await st(p)).notes.length === before, '입력칸 Ctrl+Z 는 판을 건드리지 않음');
  await p.close();

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' / '));
  await b.close(); process.exit(bad ? 1 : 0);
})();
