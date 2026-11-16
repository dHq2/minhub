// 마틴 점검 — v0.14 B 판단 규칙 v1.1 (2026-11-17, B — v1.1 A: 물었는데 답 없이 넘어가면 닫힘(보스 버그 보고) — 2번 확인 줄을 새 동작으로, 4번을 위해 「모름」으로 되돌림). 가짜 사건·가짜 마틴, 폰 화면(412×915).
// 자료 형편(모름 → 첫머리에 한 번 묻기 → 동료 말로 닫힘 → ask·「가져와라」·캐 올 할 일 걸러냄 → 수첩 맨 위 한 줄 → 다시 열기)
// 난제(의뢰 난제 req · 새 근거 없는 확신 변화 무시 · 새 근거면 움직임 · 멈춘 가설 표시) · 말 8줄 넘으면 줄임 · 프롬프트 규칙 문장·처지 질문
// 쓰는 법: bash martin/tests/run.sh mode-b   (스크린샷 /tmp/martin-자료닫힘.png)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__q = []; window.__ps = [];
  window.claude = { use: async n => { if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { if (p.includes('손질됐다')) return { say: ['판을 조금 손봤다.'] }; window.__ps.push(p); return window.__q.shift() || { say: ['그래.'] }; };
    return f; } };
};
const SEED = { v: 3, id: '20261117-modeb', at: 1, turn: 0, nid: 5, nmax: 0, suspect: null, notes: [], memo: [], log: [],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사건', note: '', x: 1000, y: 820, r: 0 },
    { id: 'n3', kind: 'person', title: '김지민', note: '가짜 실종자', x: 900, y: 1000, r: 0 },
    { id: 'n4', kind: 'clue', title: '가짜 영수증', note: '22:41 결제', x: 1100, y: 1000, r: 0 }], links: [] };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(2600);
  const say = async (text, res) => { await p.evaluate(([t, r]) => { window.__q.push(r); return turn({ text: t }); }, [text, res]); await p.waitForTimeout(300); };
  const lastP = () => p.evaluate(() => window.__ps[window.__ps.length - 1] || '');

  /* 1 — 첫머리: 형편 모름 → 한 번 묻게, 의뢰 난제 */
  await say('가짜 의뢰다. 사라진 김지민을 찾아 줘.', { say: ['찾는 건 김지민이다.', '자료는 더 구해 올 수 있나?'], pz: [{ op: 'new', id: 'p2', t: '김지민은 어디로 갔나?', up: 'p1', req: true }, { op: 'hyp', p: 'p2', id: 'h1', t: '편의점 쪽으로 갔다', c: 40, b: ['n4'] }] });
  let pr = await lastP();
  want(pr.includes('[자료 형편 — 아직 모름] 이번 답에서 한 번만'), '첫머리: 자료를 더 구할 수 있는지 한 번 묻게 함');
  want(pr.includes('의뢰의 본래 질문') && pr.includes('"req":true'), '첫머리: 의뢰 난제를 세우라는 규칙·짚음');
  for (const k of ['답부터', '되묻기는 골라서', '말은 짧게', '이름 없는 발신자', '「없다」 말하기 전에', '처지를 묻는 질문']) want(pr.includes(k), `프롬프트 규칙 문장 — ${k}`);
  want(!pr.includes('근거가 늘면 확신도 움직여라') && pr.includes('새 근거 없는 확신 변화는 앱이 받지 않는다'), '프롬프트: 확신은 새 근거가 올 때만');
  let st = await p.evaluate(() => ({ req: (S.probs.find(x => x.req) || {}).id, asked: S.moreAsked, closed: S.closed }));
  want(st.req === 'p2', `의뢰 난제 p2 (${st.req})`);
  want(st.asked && st.closed === undefined, `한 번 물었다고 기록 (moreAsked ${st.asked}), 형편은 아직 모름`);

  /* 2 — 다음 턴엔 다시 묻게 하지 않음 */
  await say('편의점 쪽은 아직 몰라.', { say: ['그럼 영수증부터 본다.'] });
  pr = await lastP();
  want(pr.includes('[자료 형편 — 닫힘') && !pr.includes('이번 답에서 한 번만'), '두 번째부터는 묻게 하지 않음 · 답 없이 넘어가면 닫힘(있는 것부터 — 11-17 A)');
  await p.evaluate(() => modeSet(undefined, '점검 — 모름으로 되돌림'));   /* 11-17 A: 아래 4번이 「동료 말로 닫힘」을 보게 */

  /* 3 — 확신: 새 근거 없으면 그대로, 새 근거면 움직임 */
  await say('그 가설 어때?', { say: ['아직은 반반이다.'], pz: [{ op: 'hyp', id: 'h1', c: 44, b: ['n4'] }] });
  st = await p.evaluate(() => { const h = S.probs.find(x => x.id === 'p2').hy[0]; return { c: h.c, hist: h.hist.map(x => x[1]).join() }; });
  want(st.c === 40 && st.hist === '40', `새 근거 없는 확신 변화(40→44)는 무시 (지금 ${st.c})`);
  await say('지민 사진을 하나 더 찾았어.', { say: ['이걸로 굳는다.'], pz: [{ op: 'hyp', id: 'h1', c: 75, b: ['n4', 'n3'] }] });
  st = await p.evaluate(() => { const h = S.probs.find(x => x.id === 'p2').hy[0]; return { c: h.c, b: h.b.join() }; });
  want(st.c === 75 && st.b === 'n4,n3', `새 근거(n3)가 오면 크게 움직임 40→${st.c}`);

  /* 4 — 자료 닫힘: 동료 말로 켜짐, 요구 걸러냄, 수첩 맨 위 한 줄 */
  await say('자료는 이게 전부야. 더 캘 수 없어.', { say: ['알았다. 있는 걸로 간다.', '그 영수증 원본을 가져와라.', '영수증 시각과 마지막 답장 사이가 비어 있다.'], ask: '편의점 기록을 캐 와라.',
    notes: [{ k: 'todo', t: '편의점 기록 캐 오기' }, { k: 'q', t: '마지막 답장 뒤 20분은 어디서?' }] });
  pr = await lastP();
  want(pr.includes('[자료 형편 — 닫힘'), '동료의 「이게 전부야」 → 이번 프롬프트부터 닫힘');
  st = await p.evaluate(() => ({ closed: S.closed, ask: S.log.some(l => l.who === 'm' && /캐 와라/.test(l.text)), fetch: S.log.some(l => l.who === 'm' && /가져와라/.test(l.text)), kept: S.log.some(l => l.who === 'm' && /비어 있다/.test(l.text)), todo: (S.notes || []).some(n => n.k === 'todo' && /캐/.test(n.t)), q: (S.notes || []).some(n => n.k === 'q' && /20분/.test(n.t)) }));
  want(st.closed === true, '자료 닫힘 켜짐');
  want(!st.ask && !st.fetch && st.kept, `ask·「가져와라」 줄은 걸러지고 추리 줄은 남음 (ask ${st.ask} · 가져와라 ${st.fetch} · 남은 줄 ${st.kept})`);
  want(!st.todo && st.q, `수첩: 캐 올 할 일은 빠지고 의문은 남음`);
  await p.click('#btnNb').catch(() => {}); await p.waitForTimeout(450);
  const bar = await p.evaluate(() => { const e = document.getElementById('nbMode'); return e && !e.hidden ? e.textContent : ''; });
  want(bar.includes('자료 닫힘'), `수첩 맨 위 한 줄 「${bar.slice(0, 30)}」`);
  await p.screenshot({ path: '/tmp/martin-자료닫힘.png' });

  /* 5 — 닫힌 채 다음 턴: 프롬프트 계속 닫힘, 말 8줄 넘으면 줄임 */
  await p.evaluate(() => nbOpen && nbOpen(false)).catch(() => {});
  const many = Array.from({ length: 11 }, (_, i) => `가짜 추리 ${i + 1}번째 줄이다.`);
  await say('정리해 줘.', { say: many });
  pr = await lastP();
  st = await p.evaluate(() => S.log.filter(l => l.who === 'm' && /가짜 추리/.test(l.text)).map(l => l.text));
  want(pr.includes('[자료 형편 — 닫힘'), '닫힘은 다음 턴에도 그대로');
  want(st.length === 8 && st[7].includes('11번째'), `말 11줄 → 8줄(마지막 줄은 남김) — ${st.length}줄`);

  /* 6 — 멈춘 가설 표시 */
  const idle = await p.evaluate(() => { S.turn += 9; const t = pzText(); S.turn -= 9; return t; });
  want(/근거 없이 \d+턴째 그대로/.test(idle), '오래 멈춘 가설엔 「근거 없이 n턴째 그대로」');

  /* 7 — 다시 열기 단추 / 마틴의 mode:"open" */
  await p.click('#btnNb').catch(() => {}); await p.waitForTimeout(400);
  await p.click('#nbMode [data-mopen]'); await p.waitForTimeout(200);
  st = await p.evaluate(() => ({ closed: S.closed, hidden: document.getElementById('nbMode').hidden }));
  want(st.closed === false && st.hidden, '수첩의 「다시 열기」 → 열림, 표시 사라짐');
  await p.evaluate(() => nbOpen && nbOpen(false)).catch(() => {});
  await say('그럼 이건 어때?', { say: ['그건 아니다.'], mode: 'closed' });
  want(await p.evaluate(() => S.closed === true), '마틴이 mode:"closed" 로 닫을 수도 있음');

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); if (bad){ console.log(`실패 ${bad}`); process.exit(1); } console.log('전부 통과');
})();
