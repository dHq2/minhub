// 연혁(세로 타임라인) 점검 v1.0 (2026-11-17, A) — 비었으면 세우라 · 마틴 tl 적용 · 시간순·날짜 머리 · 앱 대조(순서·출처 시각·마틴이 짚은 어긋남) · 고침·지움·풀림 · 매 턴 프롬프트 · 동료 × 와 되돌리기 · 줄 → 카드
// 쓰는 법: bash martin/tests/run.sh timeline   (가짜 사건만)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const PIC = 'data:image/webp;base64,' + fs.readFileSync(path.join(__dirname, '..', 'img', 'martin.webp')).toString('base64');
const MOCK = () => {
  window.__p = [];
  window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { window.__p.push(p); await new Promise(r => setTimeout(r, 80));
      const said = (p.split('[동료의 말/붙여넣기]\n')[1] || '').split('\n')[0];
      if (said.includes('연혁시험1')) return { say: ['연혁을 세웠다.'], tl: [
        { op: 'add', id: 't1', d: '2026-11-10', t: '21:05', what: '가짜A 귀가', who: '가짜A', src: ['e1'], sure: true },
        { op: 'add', id: 't2', d: '2026.11.10', t: '오후 10:30', what: '가짜A 문 잠금', who: '가짜A', src: ['e1'], after: 't1' },
        { op: 'add', id: 't3', d: '2026-11-10', t: '21:40', amb: true, what: '가짜B 아직 밖', who: '가짜B', src: ['e2'], sure: false },
        { op: 'add', id: 't4', d: '2026-11-10', t: '23:15', what: '가짜A 다시 외출', who: '가짜A', src: ['e1'] },
        { op: 'add', id: 't5', d: '2026-11-10', t: '21:00', what: '가짜B 귀가', who: '가짜B', src: ['e2'], after: 't3' },
        { op: 'add', id: 't6', when: '어느 날 밤', what: '가짜C 전화', who: '가짜C', src: ['e2'] },
        { op: 'clash', a: 't1', b: 't3', why: '둘이 같이 있었다는 말과 어긋남' }] };
      if (said.includes('연혁시험2')) return { say: ['고쳤다.'], tl: [{ op: 'edit', id: 't4', t: '22:30', what: '가짜A 다시 문 확인' }, { op: 'drop', id: 't6', why: '다른 사건 이야기' }, { op: 'clash', a: 't1', b: 't3', ok: true, why: '다른 날 이야기였다' }] };
      return { say: ['응.'] }; };
    return f; } };
};
const SEED = { v: 3, id: '20261117-tl', at: 1, turn: 2, nid: 9, emax: 2, notes: [], nmax: 0, memo: [], links: [], log: [{ who: 'p', text: '가짜 의뢰', at: 1000 }, { who: 'm', text: '본다.', at: 2000 }], moreAsked: 1, closed: true,
  ev: [{ id: 'e1', kind: 'photo', card: 'n7', title: '가짜 단톡', thumb: PIC, read: '가짜 단톡방\n오후 9:05 가짜A: 집에 도착\n오후 10:30 가짜A: 문 잠갔음', at: 1, turn: 1 },
       { id: 'e2', kind: 'photo', card: 'n8', title: '가짜 골목', thumb: PIC, read: '가짜 골목방\n9:40 가짜B: 아직 밖이야', at: 2, turn: 1 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사건', note: '', x: 1000, y: 900, r: 0 }, { id: 'n7', kind: 'photo', title: '가짜 단톡', note: '', x: 1150, y: 1000, r: 0, thumb: PIC }, { id: 'n8', kind: 'photo', title: '가짜 골목', note: '', x: 850, y: 1000, r: 0, thumb: PIC }] };
(async () => {
  const b = await chromium.launch(); let bad = 0; const errs = [];
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(4000);
  const idle = () => p.waitForFunction(() => !busy, null, { timeout: 30000 });
  const send = async t => { await idle(); await p.fill('#msg', t); await p.click('#send'); await p.waitForTimeout(300); await idle(); };
  const last = () => p.evaluate(() => window.__p[window.__p.length - 1]);

  console.log('— 단추·빈 연혁');
  const top = await p.evaluate(() => { const r = $('#btnTl').getBoundingClientRect(), m = $('#btnMenu').getBoundingClientRect(); return { ok: r.width > 20 && m.right <= innerWidth + 1 && r.top < 46 }; });
  want(top.ok, '위 띠에 「연혁」 단추 — 폰 폭에 다 들어감');
  await send('연혁시험1');
  want((await p.evaluate(() => window.__p[0])).includes('[연혁 — 아직 비었다]'), '연혁이 비었고 판독문이 있으면 「세워라」');

  console.log('— 마틴이 세운 연혁');
  let st = await p.evaluate(() => ({ ids: tlSorted().map(x => x.id).join(','), t2: S.tl.find(x => x.id === 't2'), n: $('#tlN').textContent, warn: $('#btnTl').classList.contains('warn'), bad: tlCheck().map(b => b.kind + ':' + b.ids.join('-')) }));
  want(st.ids === 't5,t1,t3,t2,t4,t6', '시간순(날짜 모름은 맨 아래) ' + st.ids);
  want(st.t2.d === '2026-11-10' && st.t2.t === '22:30', '「2026.11.10」「오후 10:30」도 받아 고침');
  want(st.n === '6' && st.warn, '단추에 줄 수 6 · 어긋남 빨간 점');
  want(st.bad.includes('order:t5-t3') && st.bad.includes('src:t4') && st.bad.includes('clash:t1-t3') && st.bad.includes('src:t5') && st.bad.length === 4, '앱 대조: 순서 뒤집힘·출처에 없는 시각(t4·t5)·마틴이 짚은 어긋남 ' + st.bad.join(' '));
  await p.click('#btnTl'); await p.waitForTimeout(500);
  st = await p.evaluate(() => ({ on: document.body.classList.contains('tlopen'), day: [...document.querySelectorAll('#tlm .tld')].map(e => e.textContent), rows: [...document.querySelectorAll('#tlm .tlr:not(.gone)')].map(e => e.dataset.tl), badRows: [...document.querySelectorAll('#tlm .tlr.bad')].map(e => e.dataset.tl), guess: !!document.querySelector('#tlm .tlr.guess[data-tl="t3"]'), warn: document.querySelectorAll('#tlm .tlw').length, fs: getComputedStyle(document.querySelector('#tlmBody')).fontSize, nw: document.querySelectorAll('#tlm .tlr.new').length }));
  want(st.on && st.day.join('|') === '2026-11-10(화)|날짜 모름', '서랍: 날짜 머리(요일) 아래로 ' + st.day.join('|'));
  want(st.rows.join(',') === 't5,t1,t3,t2,t4,t6', '위에서 아래로 시간순 줄');
  want(st.badRows.sort().join(',') === 't1,t3,t4,t5' && st.warn === 4, '어긋난 줄은 빨갛게 + ⚠ 이유는 앞 줄에 한 번씩');
  want(st.guess && st.fs === '11px' && st.nw === 6, '추정은 기울임 · 글씨 11px · 새 줄 금빛');
  await p.screenshot({ path: '/tmp/martin-연혁.png' });
  await p.click('#tlmX'); await p.waitForTimeout(300);

  console.log('— 다음 턴 프롬프트');
  await send('연혁시험2');
  let pr = (await p.evaluate(() => window.__p.find(x => x.includes('연혁시험2'))));
  want(pr.includes('[연혁 — 이 사건에서 일어난 일') && pr.includes('t1 21:05 가짜A 귀가 — 가짜A [e1]') && pr.includes('9:40? 가짜B 아직 밖') && pr.includes('(추정)'), '매 턴 [연혁] — 날짜 머리 아래 줄마다 id·시각·누가·출처·추정');
  want(pr.includes('! t5는 t3 뒤라 했는데 더 이르다(21:00 < 21:40)') && pr.includes('! t4의 시각 23:15 이 출처 e1 판독문에 안 보인다') && pr.includes('어긋남(앱 대조'), '어긋남을 마틴에게 — 고치거나 풀라고');
  want(pr.includes('- tl: 연혁') && pr.includes('"tl":[{"op":"add","id":"t7"'), 'tl 규칙과 다음 id(t7)');
  want(pr.indexOf('[맞춰 보기') < pr.indexOf('[연혁 —') && pr.indexOf('[연혁 —') < pr.indexOf('[사건 시계]'), '칸 자리: 맞춰 보기 아래, 사건 시계 위');

  console.log('— 고침·지움·풀림');
  st = await p.evaluate(() => ({ t4: S.tl.find(x => x.id === 't4'), t6: S.tl.find(x => x.id === 't6').gone, bad: tlCheck().map(b => b.kind + ':' + b.ids.join('-')) }));
  want(st.t4.t === '22:30' && st.t4.what === '가짜A 다시 문 확인', 'edit — 시각·내용 고침');
  want(st.t6 && st.t6.why === '다른 사건 이야기', 'drop — 이유와 함께 지운 줄로');
  want(st.bad.sort().join(' ') === 'order:t5-t3 src:t5', '고치고 풀면 남은 어긋남만 ' + st.bad.join(' '));
  await p.click('#btnTl'); await p.waitForTimeout(400);
  want(await p.evaluate(() => document.querySelector('#tlm .tlg summary').textContent.includes('지운 줄 1')), '서랍 맨 아래 「지운 줄 1」');

  console.log('— 동료 × · 되돌리기 · 줄 → 카드');
  await p.click('#tlm [data-tldel="t2"]'); await p.waitForTimeout(900);
  want(await p.evaluate(() => !!S.tl.find(x => x.id === 't2').gone && !document.querySelector('#tlm .tlr[data-tl="t2"]:not(.gone)')), '× 로 동료가 지움');
  await p.click('#tlmX'); await p.waitForTimeout(300); await p.click('#btnUndo').catch(() => {}); await p.waitForTimeout(600);
  want(await p.evaluate(() => !S.tl.find(x => x.id === 't2').gone), '되돌리기로 살아남');
  await p.click('#btnTl'); await p.waitForTimeout(400);
  await p.click('#tlm .tlr[data-tl="t1"] b'); await p.waitForTimeout(900);
  st = await p.evaluate(() => ({ open: document.body.classList.contains('tlopen'), act: JSON.parse(localStorage.getItem('drmartin.log') || '[]').filter(e => e.act === '연혁에서 카드로').pop() }));
  want(!st.open && st.act && st.act.id === 'n7', '줄을 누르면 출처 카드(가짜 단톡)로 날아감');
  await p.reload(); await p.waitForTimeout(3000);
  want(await p.evaluate(() => S.tl.length === 6 && $('#tlN').textContent === '5'), '다시 열어도 연혁 그대로(살아 있는 줄 5)');

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `\n실패 ${bad}` : '\n전부 통과'); process.exit(bad ? 1 : 0);
})();
