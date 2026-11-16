// 마틴 점검 — 맞춰 보기·수첩 정돈 v1.0 (2026-11-17, C)
// 확인: 판독문 여러 모양(「이름(오후 7:40): 말」·날짜 줄·카톡 PC/폰 내보내기·「밤 11시 42분」·「11/13 01:05」·「7:40 PM」)에서 날짜·시각을 뽑아
//       방을 가로지른 「전체 시계」가 시간순 · 출처 자료 id · 오전/오후 없는 시각은 (오전·오후?) · 인물별 발언 · 판독문 없는 자료 ·
//       판 빚(카드 없는 사람·옛 카드 메모·오전/오후 빠짐) · 결론 요청/새 가설에 「모순 쓸기」 · 수첩 합치기/덮기/망설임 보존 · 수첩 「전체 시계」 칸
// 사건은 가짜(이름·말 전부 지어냄). 쓰는 법: bash martin/tests/run.sh xref   (스크린샷 /tmp/martin-전체시계.png)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => { window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true }); f.json = async () => ({ say: ['봤다.'] }); return f; } }; };
const READ1 = `가짜 단톡방 「나무반」 캡처
2026년 3월 4일 수요일
도윤(오후 7:40): 오늘 늦을 것 같아
서아(오후 7:42): 몇 시쯤?
도윤(오후 9:05): 거의 다 왔어
2026년 3월 5일 목요일
서아(오전 8:10): 어제 결국 안 왔네
회색 말풍선(상대 쪽으로 보임)(오전 8:12): 미안 폰 꺼졌어`;
const READ2 = `[도윤] [오후 8:30] 편의점 들렀다 감
[하람] [오후 8:31] 거기 문 닫았던데
2026. 3. 4. 오후 10:15, 하람 : 나 먼저 잔다`;
const READ3 = `장소: 공원 입구 / 날짜: 3월 4일
밤 11시 42분 — 가로등 아래 두 사람
3/5 01:05 하람: 아직 안 자?
메모: 7시 50분 도윤 문자(오전·오후 표시 없음)
결제 7:55 PM 편의점 3,200원`;
const SEED = { v: 3, id: '20260306-xref', at: 1, turn: 3, nid: 9, emax: 4, nmax: 3, links: [], memo: [], log: [{ who: 'm', text: '가짜 사건이다.', at: 1 }],
  notes: [{ id: 'm1', k: 'guess', t: '도윤은 3월 4일 밤 편의점에 들렀을 것이다', by: 'you', at: 1, turn: 1 }, { id: 'm2', k: 'q', t: '도윤은 왜 늦었나?', by: 'you', at: 1, turn: 1 }, { id: 'm3', k: 'fact', t: '서아는 3월 5일 아침 8시 10분에 연락했다', by: 'you', at: 1, turn: 1 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 늦은 귀가 사건', note: '', x: 1000, y: 900, r: 0 },
    { id: 'n2', kind: 'person', title: '도윤', note: '귀가 시각 미확정', x: 1200, y: 900, r: 0 },
    { id: 'n3', kind: 'person', title: '서아', note: '', x: 1300, y: 1000, r: 0 },
    { id: 'n4', kind: 'photo', title: '가짜 단톡 캡처', note: '', x: 900, y: 1100, r: 0 }],
  ev: [
    { id: 'e1', kind: 'photo', card: 'n4', title: '가짜 단톡 캡처', at: 1, turn: 1, read: READ1 },
    { id: 'e2', kind: 'text', title: '내보낸 대화.txt', name: '내보낸 대화.txt', at: 1, turn: 1, read: '', head: '' },
    { id: 'e3', kind: 'text', title: '현장 메모', at: 1, turn: 2, read: READ3 },
    { id: 'e4', kind: 'photo', title: '읽지 않은 사진', at: 1, turn: 2, read: '' }] };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(([s, r2]) => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.ev.20260306-xref.e2', r2); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, [JSON.stringify(SEED), READ2]);
  await p.goto(URL); await p.waitForTimeout(2400);

  /* 낱개 모양 */
  const T = await p.evaluate(() => {
    const t = s => { const r = xrTime(s); return r ? (r.amb ? '?' : '') + r.t : null; };
    const d = s => { const r = xrDate(s, 2026); return r ? `${r.y}-${r.mo}-${r.d}` : null; };
    return { a: t('오후 7:40'), b: t('오전 12:05'), c: t('밤 11시 42분'), d: t('7:55 PM'), e: t('7시 50분'), f: t('23:42'), g: t('오후 3시 반'), h: t('새벽 2:10'), i: t('3,200원'),
      da: d('2026년 3월 4일 수요일'), db: d('3월 5일'), dc: d('11/5 01:05'), dd: d('2026. 3. 4. 오후 10:15'), de: d('2026-03-07'), df: d('1/2 쯤 남음') };
  });
  want(T.a === '1180' && T.b === '5' && T.c === '1422' && T.d === '1195' && T.g === '930' && T.h === '130', `오전·오후·밤·새벽·PM·「시 반」 정규화 ${JSON.stringify(T)}`);
  want(T.e === '?470' && T.f === '1422' && T.i === null, '「7시 50분」은 오전·오후 모름, 23:42 는 그대로, 「3,200원」은 시각 아님');
  want(T.da === '2026-3-4' && T.db === '2026-3-5' && T.dc === '2026-11-5' && T.dd === '2026-3-4' && T.de === '2026-3-7', `날짜 여러 모양 ${JSON.stringify([T.da, T.db, T.dc, T.dd, T.de, T.df])}`);

  /* 전체 시계 */
  const C = await p.evaluate(() => xrClockLines());
  const row = (who, say) => C.find(r => r.who === who && r.say.includes(say));
  want(C.length >= 12, `시계 줄 ${C.length}개 ${JSON.stringify(C.map(r => r.time + ' ' + r.say.slice(0, 8)))}`);
  const order = ['오늘 늦을', '몇 시쯤', '거의 다 왔어', '나 먼저 잔다', '가로등 아래', '어제 결국'].map(s => C.findIndex(r => r.say.includes(s)));
  want(order.every((x, i) => x >= 0 && (i === 0 || x > order[i - 1])), `방(자료)을 가로질러 시간순 ${JSON.stringify(order)}`);
  want(row('도윤', '편의점 들렀다') && row('도윤', '편의점 들렀다').evs.join() === 'e2' && row('도윤', '편의점 들렀다').day === '날짜 모름', '판독문 없는 글 자료는 원문에서 읽음(출처 e2), 날짜 없으면 「날짜 모름」');
  want(row('하람', '나 먼저 잔다') && row('하람', '나 먼저 잔다').day === '3/4(수)' && row('하람', '나 먼저 잔다').time === '오후 10:15', '카톡 폰 내보내기 「날짜 오후 h:mm, 이름 : 말」');
  want(row('서아', '어제 결국') && row('서아', '어제 결국').day === '3/5(목)' && row('서아', '어제 결국').time === '오전 8:10', '날짜 줄이 아래 줄들의 날짜가 됨(요일까지)');
  const g = C.find(r => r.say.includes('가로등')); want(g && g.day === '3/4(수)' && g.time === '오후 11:42' && g.evs.join() === 'e3', '「장소: … / 날짜: 3월 4일」 같은 줄 안 날짜도 문맥이 됨');
  const amb = C.find(r => r.say.includes('7시 50분') || r.say.includes('도윤 문자')); want(amb && amb.amb && /오전·오후\?/.test(amb.time), `오전/오후 없는 시각은 (오전·오후?) ${amb && amb.time}`);
  const bub = row('회색 말풍선', '폰 꺼졌어'); want(bub && bub.time === '오전 8:12' && bub.day === '3/5(목)', '이름표 없는 말풍선 「색 말풍선(설명)(시각): 말」(READ_RULE 모양)');
  want(!C.some(r => r.who === '메모' || r.who === '장소' || r.who === '결제'), '「메모:·장소:·결제」 같은 이름표는 사람으로 안 봄');

  /* xrefText — 프롬프트 */
  const X = await p.evaluate(() => xrefText());
  want(/전체 시계/.test(X) && /\[e1\]/.test(X) && /\[e3\]/.test(X), '프롬프트에 전체 시계와 출처');
  want(/인물별 발언/.test(X) && /· 도윤 \(\d+줄/.test(X) && /· 하람/.test(X), '인물별 발언 모음');
  want(/판독문 없는 자료[^\n]*e2[^\n]*e4/.test(X), '판독문 없는 자료 목록(e2·e4)');
  want(/「하람」 — \d+번 말함[^\n]*인물 카드가 없다/.test(X) && !/「도윤」 — /.test(X) && !/「서아」 — /.test(X), '판 빚: 여러 번 말했는데 카드 없는 사람만');
  want(/e3 판독문에 오전·오후 없는 시각/.test(X), '판 빚: 오전·오후 빠진 판독');
  want(!/모순 쓸기/.test(X), '평소엔 모순 쓸기 지시 없음');
  want(await p.evaluate(() => buildPrompt('그냥 보는 중').includes('맞춰 보기')), 'A의 고리로 buildPrompt 에 실림');
  const X2 = await p.evaluate(() => { S.log.push({ who: 'p', text: '이제 결론 내 봐. 누가 거짓말했어?', at: 9 }); return xrefText(); });
  want(/모순 쓸기[^\n]*결론·전체 검토/.test(X2) && /한 사람의 말끼리/.test(X2) && /시각끼리/.test(X2) && /수첩 의문/.test(X2), '결론 요청 → 모순 쓸기(한 사람·다른 사람·시각, 어긋남은 수첩 의문)');
  const X3 = await p.evaluate(() => { window._pz = S.probs; S.log.push({ who: 'p', text: '응', at: 10 }); S.probs = [{ id: 'p1', t: '가짜 퍼즐', hy: [{ id: 'h1', t: '도윤이 편의점에서 누굴 만났다', st: 'live', turn: S.turn }] }]; return xrefText(); });
  want(/모순 쓸기[^\n]*새 가설 h1/.test(X3), '새 가설 → 모순 쓸기');
  const X4 = await p.evaluate(() => { S.probs[0].hy[0].turn = S.turn - 1; const x = xrefText(); S.probs = window._pz; return x; });
  want(!/모순 쓸기/.test(X4), '지난 가설만 있으면 지시 없음');
  /* 판 빚: 뒤에 풀렸는데 옛 카드 메모 그대로 */
  const X5 = await p.evaluate(() => { S.notes.push({ id: 'm9', k: 'fact', t: '도윤 귀가 시각은 3월 4일 오후 9시 20분으로 확인', by: 'you', at: 2, turn: 3 }); return xrefText(); });
  want(/n2「도윤」 메모가 「귀가 시각 미확정」[^\n]*m9/.test(X5), '판 빚: 옛 카드 메모(미확정)와 새 사실이 겹치면 고치라고');
  /* 많은 줄 — 길이 예산 */
  const L = await p.evaluate(() => { const lines = ['2026년 3월 6일 금요일']; for (let i = 0; i < 400; i++) lines.push(`가짜${i % 7}(오후 ${1 + (i % 11)}:${String(i % 60).padStart(2, '0')}): 아무 말 ${i}번째 줄이고 꽤 길게 늘여 쓴 문장`); S.ev.push({ id: 'e5', kind: 'photo', title: '긴 판독', at: 1, turn: 3, read: lines.join('\n') }); const x = xrefText(); S.ev.pop(); return x.length; });
  want(L < 8000, `줄이 많아도 프롬프트 몫은 줄여 담음 (${L}자)`);

  /* 수첩 정돈 */
  const N = await p.evaluate(async () => {
    S.log.pop(); S.log.pop(); const before = S.notes.length;
    const r1 = await applyNotes({ notes: [{ k: 'guess', t: '도윤은 3월 4일 밤 편의점에 들렀을 것이다.' }, { k: 'q', t: '도윤은 왜 늦었나 ?' }] });
    const merged = S.notes.length === before;
    const r2 = await applyNotes({ notes: [{ k: 'fact', t: '도윤은 3월 4일 밤 편의점에 들렀다' }] });
    const m1 = S.notes.find(x => x.id === 'm1');
    const r3 = await applyNotes({ notes: [{ k: 'fact', t: '하람이 거짓말했을 수 있다' }] });
    const hedge = S.notes.find(x => x.id === r3.made[0]);
    const r4 = await applyNotes({ notes: [{ k: 'guess', t: '서아가 먼저 연락을 끊었다' }] });
    const r5 = await applyNotes({ notes: [{ k: 'fact', t: '연락은 하람 쪽이 먼저 끊었다', over: 'm' + r4.made[0].slice(1) }] });
    const g4 = S.notes.find(x => x.id === r4.made[0]);
    /* 이미 쌓인 겹친 줄 */
    S.notes.push({ id: 'm40', k: 'todo', t: '편의점 영수증 시각 확인', by: 'you', at: 1, turn: 1 }, { id: 'm41', k: 'todo', t: '편의점 영수증 시각 확인할 것', by: 'you', at: 1, turn: 1 }, { id: 'm42', k: 'me', t: '편의점 영수증 시각 확인', by: 'me', at: 1, turn: 1 });
    const r6 = await applyNotes({ notes: [{ k: 'q', t: '가로등 아래 두 사람은 누구?' }] });
    const tod = S.notes.filter(x => /영수증/.test(x.t));
    const many = []; for (let i = 0; i < 26; i++) many.push({ id: 'g' + i, k: 'guess', t: `가짜 짐작 ${i} ${'가나다라마바사아자차카타파하'[i % 14]}${i * 37}`, by: 'you', at: 1, turn: 1 });
    S.notes.push(...many); const nt = noteText(); S.notes = S.notes.filter(x => !/^g\d+$/.test(x.id));
    return { r1, merged, r2, m1, hedge, g4, r5, tod: tod.map(x => x.id + ':' + x.t), r6, guessLine: (nt.match(/짐작\(미확정[^)]*\)/) || [''])[0], nt20: !/가짜 짐작 0 /.test(nt) && /가짜 짐작 25 /.test(nt) };
  });
  want(N.merged && N.r1.made.length === 0, `같은·거의 같은 문장은 새 줄을 안 만듦 ${JSON.stringify(N.r1)}`);
  want(N.m1.done && /새 사실 m\d+ 에 덮임/.test(N.m1.a), `새 사실이 옛 짐작을 덮으면 옛 짐작은 풀린 칸으로 (${N.m1.a})`);
  want(N.hedge && N.hedge.k === 'guess' && N.hedge.t === '하람이 거짓말했을 수 있다', '「~일 수 있다」를 사실로 적어도 짐작으로, 글은 그대로');
  want(N.g4.done && N.g4.a === `${N.r5.made[0]} 에 덮임`, `over 로 덮을 짐작을 지목 (${N.g4.a})`);
  want(N.tod.length === 2 && N.tod.includes('m40:편의점 영수증 시각 확인할 것') && N.tod.includes('m42:편의점 영수증 시각 확인'), `이미 쌓인 겹친 줄도 합침, 동료 메모는 그대로 ${JSON.stringify(N.tod)}`);
  want(/최근 20 \/ 모두 2\d/.test(N.guessLine) && N.nt20, `짐작은 프롬프트에 최근 20줄 + 개수 (${N.guessLine})`);

  /* 수첩 「전체 시계」 칸 */
  await p.evaluate(() => { localStorage.setItem('drmartin.nbclock', '1'); nbOpen(true); }); await p.waitForTimeout(500);
  const V = await p.evaluate(() => { const d = document.getElementById('nbClock'); return d && { open: d.open, rows: d.querySelectorAll('.xr-r').length, days: [...d.querySelectorAll('.xr-day')].map(x => x.textContent), amb: d.querySelectorAll('.xr-r.amb').length }; });
  want(V && V.open && V.rows >= 12 && V.days[0] === '3/4(수)' && V.days[V.days.length - 1] === '날짜 모름' && V.amb >= 1, `수첩에 전체 시계 칸 ${JSON.stringify(V)}`);
  await p.evaluate(() => document.getElementById('nbClock').scrollIntoView()); await p.waitForTimeout(200);
  await p.screenshot({ path: '/tmp/martin-전체시계.png' });
  await p.evaluate(() => { document.getElementById('nbClock').open = false; }); await p.waitForTimeout(200);
  want(await p.evaluate(() => localStorage.getItem('drmartin.nbclock')) === '0', '접음/펼침을 기억');

  want(!errs.length, `페이지 오류 없음 ${JSON.stringify(errs)}`);
  await b.close(); console.log(bad ? `xref: ${bad}개 실패` : 'xref: 전부 통과'); process.exit(bad ? 1 : 0);
})();
