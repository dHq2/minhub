// 마틴 점검 — 수사 버릇·실의 이유와 끊기·꼬리표 자리·손글씨 카드 v1.0 (2026-11-17, B). 가짜 사건·가짜 마틴, 폰 화면(412×915).
// 쓰는 법: bash martin/tests/run.sh habits-b   (스크린샷 /tmp/martin-버릇-판.png)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__q = []; window.__ps = [];
  window.claude = { use: async n => { if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { if (p.includes('손질됐다')) return { say: ['판을 조금 손봤다.'] }; window.__ps.push(p); return window.__q.shift() || { say: ['그래.'] }; };
    return f; } };
};
const SEED = { v: 3, id: '20261117-habit', at: 1, turn: 0, nid: 9, nmax: 0, suspect: 'n3', notes: [], memo: [], log: [],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사건', note: '', x: 1000, y: 800, r: 0 },
    { id: 'n2', kind: 'question', title: '목요일 밤 마지막 대화는 누구와?', note: '가장 늦게 확인된 건 가짜 대표와의 대화. 그 뒤 연락은 확인 필요.', x: 900, y: 1050, r: 2 },
    { id: 'n3', kind: 'person', title: '김대표', note: '가짜 출판사 대표', x: 1200, y: 1050, r: 0 },
    { id: 'n4', kind: 'clue', title: '가짜 카드 승인', note: '11/13 새벽 승인', x: 1060, y: 1050, r: -2 },
    { id: 'n5', kind: 'person', title: '김지민', note: '가짜 실종자', x: 960, y: 1420, r: 0 },
    { id: 'n7', kind: 'clue', title: '가짜 영수증', note: '11/14 같은 상호', x: 1250, y: 1400, r: 1 }],
  links: [{ id: 'n5-n3', a: 'n5', b: 'n3', label: '서류 압박', sure: true }, { id: 'n5-n2', a: 'n5', b: 'n2', label: '자취방', sure: true }, { id: 'n4-n7', a: 'n4', b: 'n7', label: '결제처', sure: false }] };
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

  /* 1 — 버릇은 늘, 뒤집어 보기는 결론 쪽 말일 때만 */
  await say('영수증 얘기 좀 해 봐.', { say: ['영수증은 날짜만 같다.'] });
  let pr = await lastP();
  for (const k of ['빈 주어 채우기', '그때 알 수 있었나', '사이의 일', '없음 가르기', '한 출처', '조각끼리 잇기', '확률은 말로']) want(pr.includes(k), `버릇 — ${k}`);
  want(!pr.includes('[이번엔 뒤집어 보기]'), '평소 말엔 뒤집어 보기 없음');
  want(!/\(\d+%\)/.test(pr.split('[보드 지금]')[0]) && pr.includes('말로 확률을 붙여(숫자 말고)'), '이름 없는 발신자 확률은 말로(숫자 % 없음)');
  want(pr.includes('"over":"m…"'), '덮인 짐작 지목(over) 규칙');
  want(pr.includes('8. cut:') && pr.includes('why 에 왜 이었는지'), 'link 의 why · cut 규칙');
  const words = pr.length; console.log(`        (프롬프트 ${words}자)`);
  await say('그래서 범인은 누구야?', { say: ['대표 쪽이 공산이 크다. 다만 뒤집어 보면 —'] });
  pr = await lastP();
  want(pr.includes('[이번엔 뒤집어 보기]'), '「범인은 누구야?」 → 뒤집어 보기 켜짐');

  /* 2 — 실: why 저장·프롬프트에 「왜」, cut 으로 끊고 기록, 다시 이으면 기록에서 빠짐 */
  await say('그 둘 이어 봐.', { say: ['잇는다.'], ops: [{ op: 'link', a: 'n2', b: 'n4', label: '같은 밤', sure: false, why: '대화 끊긴 밤과 승인 새벽이 붙어 있음' }] });
  let st = await p.evaluate(() => (S.links.find(L => L.a === 'n2' && L.b === 'n4') || {}).why);
  want(st && st.includes('승인 새벽'), `실에 why 저장 「${st}」`);
  await say('영수증 실은?', { say: ['날짜만 같다. 끊는다.'], ops: [{ op: 'cut', a: 'n4', b: 'n7', why: '날짜만 같고 같은 결제라는 근거 없음' }] });
  st = await p.evaluate(() => ({ has: S.links.some(L => L.id === 'n4-n7'), cuts: (S.cuts || []).map(c => c.a + c.b + ':' + c.why) }));
  want(!st.has && st.cuts.length === 1 && st.cuts[0].includes('근거 없음'), `cut → 실 사라지고 끊은 기록 남음 ${st.cuts}`);
  await say('다음은?', { say: ['다음으로.'] });
  pr = await lastP();
  want(pr.includes('끊은 실') && pr.includes('n4↔n7') && pr.includes('— 왜: 대화 끊긴 밤'), '프롬프트: 끊은 실 · 실마다 「왜」');
  await say('영수증 다시 보니 카드 번호가 같아.', { say: ['그럼 다시 잇는다.'], ops: [{ op: 'link', a: 'n4', b: 'n7', label: '같은 결제', sure: true, why: '영수증 카드 끝자리 같음' }] });
  st = await p.evaluate(() => ({ has: S.links.some(L => (L.a === 'n4' && L.b === 'n7')), cuts: (S.cuts || []).length }));
  want(st.has && st.cuts === 0, '새 근거로 다시 이으면 끊은 기록에서 빠짐');

  /* 3 — 전제 의심: 판이 6턴 넘게 제자리면 한 번, 그 뒤 6턴은 안 함 */
  await p.evaluate(() => { S.turn = 20; });
  await say('음.', { say: ['잠깐. 전제를 의심해 본다.'] });
  pr = await lastP();
  want(pr.includes('[전제 의심]'), '판이 오래 제자리 → 전제 의심');
  await say('응.', { say: ['그래.'] });
  pr = await lastP();
  want(!pr.includes('[전제 의심]'), '바로 다음 턴엔 다시 시키지 않음');

  /* 4 — 판: 꼬리표가 카드 위에 안 앉음 · 손글씨 카드 제목·본문 안 겹침 */
  await p.evaluate(() => { renderAll(); const n = nodeOf('n2'); cam.x = 1080; cam.y = 1200; cam.k = .8; applyCam(0); });
  await p.waitForTimeout(400);
  const ov = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('#nodes .card')].map(e => e.getBoundingClientRect());
    const tags = [...document.querySelectorAll('#tags .tag')].map(e => ({ t: e.textContent, r: e.getBoundingClientRect() }));
    const onCard = tags.filter(({ r }) => cards.some(c => { const cx = r.left + r.width / 2, cy = r.top + r.height / 2; return cx > c.left && cx < c.right && cy > c.top && cy < c.bottom; })).map(x => x.t);
    const q = document.querySelector('#nodes .k-question'), h = q.querySelector('h4').getBoundingClientRect(), pp = q.querySelector('p').getBoundingClientRect();
    return { onCard, gap: Math.round(pp.top - h.bottom), n: tags.length };
  });
  want(ov.onCard.length === 0, `꼬리표 ${ov.n}개 중 카드 위에 앉은 것 없음 ${ov.onCard.join(',')}`);
  want(ov.gap >= 0, `의문 카드 제목·본문 안 겹침 (틈 ${ov.gap}px)`);
  const r = await p.evaluate(() => document.getElementById('board').getBoundingClientRect());
  await p.screenshot({ path: '/tmp/martin-버릇-판.png', clip: { x: r.x, y: r.y, width: r.width, height: r.height } });

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); if (bad){ console.log(`실패 ${bad}`); process.exit(1); } console.log('전부 통과');
})();
