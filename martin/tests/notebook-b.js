// 마틴 점검 — 수첩 의문이 답을 품는다 v1.0 (2026-11-18, B · 보스: 「의문을 해결했는데도 그대로 남아 있고 참조도 안 한다」). 가짜 사건·가짜 마틴, 폰
// 지키는 것: 답은 nbAnswer 한 길(solve sure true = 풀림 · false = 기운 답, over 가 의문을 가리켜도 같은 길, 누가 적은 줄이든) ·
//   판 의문 카드도 기운 답이면 수첩 짐작 칸으로 · 걸린 것에 「동료 말이 의문을 다룬다」「오래 답 없는 의문」 ·
//   맞춰 보기는 날짜를 줄 머리에서만(말 속 날짜·「날짜 구분선:」 이름표) · 시각 없는 「X: 말」은 아는 사람만 · 연혁 대조는 둘 다 아는 것끼리.
// 쓰는 법: bash martin/tests/run.sh notebook-b
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__ps = [];
  window.claude = { use: async n => { if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { if (p.includes('손질됐다')) return { say: ['판을 조금 손봤다.'] }; if (p.includes('자료 사진 한 장을 받아 적는다')) return { t: '' };
      window.__ps.push(p); const said = (p.split('[동료의 말/붙여넣기]\n')[1] || '').split('\n')[0];
      if (said.includes('가짜영수증')) return { say: ['같은 결제다.'],
        solve: [{ id: 'm2', a: '같은 결제(동료 확인)', sure: true }, { id: 'm1', a: '가짜B 쪽 공산', sure: false }, { id: 'n5', a: '가짜 공원일 공산', sure: false }],
        notes: [{ k: 'guess', by: 'me', over: 'm4', t: '친오빠가 아니라 아는 오빠(동료 판단)' }, { k: 'guess', by: 'you', over: 'm3', t: '가짜B가 범인일 공산' }] };
      if (said.includes('가짜확정')) return { say: ['그럼 풀렸다.'], solve: [{ id: 'm1', a: '가짜B 가 가져감(캡처)', sure: true }] };
      return { say: ['그래.'] }; };
    return f; } };
};
const SEED = { v: 3, id: '20261118-nb', at: 1, turn: 12, nid: 9, emax: 1, nmax: 4, memo: [],
  notes: [{ id: 'm1', k: 'q', t: '가짜 금고 열쇠를 가져간 사람은 누구인가', by: 'you', turn: 1 }, { id: 'm2', k: 'q', t: '가짜 영수증 두 장이 같은 결제인가', by: 'you', turn: 10 },
          { id: 'm3', k: 'guess', t: '가짜A가 범인일 공산', by: 'you', turn: 2 }, { id: 'm4', k: 'q', t: '가짜C의 오빠는 친오빠인가', by: 'you', turn: 11 }],
  log: [{ who: 'p', text: '가짜 의뢰', at: 1 }, { who: 'm', text: '그래.', at: 2 }],
  ev: [{ id: 'e1', kind: 'photo', card: 'n7', title: '가짜 단톡', read: '가짜방\n날짜 구분선: 2026년 11월 10일 화요일\n가짜A(오후 9:05): 공지 — 11/20(금) 회식 있어요\n가짜B(오후 9:10): 알겠어요\n참여 인원: 4\n가짜A: 시각 없는 말', at: 1, turn: 1 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사건', note: '', x: 1000, y: 900, r: 0 }, { id: 'n5', kind: 'question', title: '가짜 사진 속 장소는 어디인가', note: '', x: 1100, y: 900, r: 0 },
          { id: 'n7', kind: 'photo', title: '가짜 단톡', note: '', x: 900, y: 900, r: 0 }],
  links: [], moreAsked: 1, closed: true, tl: [{ id: 't1', d: '2026-11-10', t: '21:05', what: '가짜A 공지', who: '가짜A', src: ['e1'], sure: true }], tmax: 1,
  probs: [{ id: 'p1', root: 1, st: 'open', t: '가짜 진실', up: null, by: 'you', hy: [], log: [] }, { id: 'p2', st: 'open', t: '가짜 열쇠는 누가', up: 'p1', req: true, by: 'you', hy: [], log: [] }], pfocus: 'p1', pmax: 2, hmax: 0 };   /* 다른 걸린 것(형편·의뢰 난제·빈 연혁)은 채워 둔다 — 수첩 신호만 보이게 */
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 } });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(3000);
  const ask = async t => { await p.evaluate(x => turn({ text: x }), t); await p.waitForTimeout(1500); return p.evaluate(() => window.__ps[window.__ps.length - 1] || ''); };
  const due = pr => pr.slice(pr.indexOf('[이번 턴에 걸린 것 — 앱이'), pr.indexOf('[이번에 동료가 가져온 것]'));

  console.log('— 걸린 것');
  const pr = await ask('가짜영수증 두 장 보니까 같은 결제 맞는 것 같아'); 
  want(/· 무게 — 동료의 말이 수첩의 m2「가짜 영수증/.test(due(pr)), '동료의 말이 열린 의문(m2)을 다룬다 → 걸린 것');
  want(/· 변화 — 답 없이 오래 열린 의문 1개\(m1\)/.test(due(pr)), '오래 답 없는 의문(m1, 11턴) → 걸린 것 · 새 의문(m2·m4)은 아직');
  want(pr.includes('의문에 답이 나면 그 의문에 단다(solve)') && pr.includes('"sure":true}] — 의문·확인할 것에 답 달기'), '원칙 2 와 출력 형식에 「의문에 답을 단다」');
  want(pr.includes('확정(reveal·난제 solve)은 자료가 받칠 때만'), '원칙 3 의 확정은 난제·reveal 로 좁힘');

  console.log('— 답 달기 한 길');
  const st = await p.evaluate(() => { const g = id => S.notes.find(n => n.id === id) || {}; const c = S.notes.find(n => n.card === 'n5') || {};
    return { m1: [g('m1').done || 0, g('m1').lean || ''], m2: [g('m2').done || 0, g('m2').a || ''], m3: [g('m3').done || 0, g('m3').over || ''], m4: [g('m4').done || 0, g('m4').lean || ''],
      card: [!!nodeOf('n5'), c.k || '', c.lean || '', c.done || 0], n: S.notes.length, newGuess: S.notes.filter(n => n.t === '가짜B가 범인일 공산').length, oldOver: S.notes.filter(n => n.t.startsWith('친오빠가 아니라')).length,
      lean: [...document.querySelectorAll('#nbBody .nl-s')].find(s => s.textContent.startsWith('// 짐작'))?.querySelectorAll('li.lean').length || 0,
      qs: [...document.querySelectorAll('#nbBody .nl-s')][0].querySelectorAll('li[data-n]').length, cnt: nbOpenCount() }; });
  want(st.m2[0] === 1 && st.m2[1] === '같은 결제(동료 확인)', 'solve sure:true → 풀림 ' + st.m2.join(' '));
  want(st.m1[0] === 0 && st.m1[1] === '가짜B 쪽 공산', 'solve sure:false → 열린 채 기운 답 ' + st.m1.join(' '));
  want(st.m4[0] === 0 && st.m4[1].startsWith('친오빠가 아니라') && st.oldOver === 0, '동료 판단 줄(by:me)의 over 가 의문을 가리키면 새 줄 없이 그 의문의 기운 답 ' + st.m4.join(' '));
  want(st.m3[0] === 1 && st.newGuess === 1, '새 짐작이 옛 짐작을 over → 옛 것은 덮임 ' + st.m3.join(' '));
  want(!st.card[0] && st.card[1] === 'q' && st.card[2] === '가짜 공원일 공산' && !st.card[3], '판 의문 카드 + 기운 답 → 판에서 내려와 수첩 짐작 칸으로 ' + st.card.join(' '));
  want(st.lean === 3 && st.qs === 0 && st.cnt === 0, `수첩 화면: 기운 답 셋은 짐작 칸에, 의문 칸은 빔(열린 수 ${st.cnt})`);

  const pr2 = await ask('가짜확정 — 캡처 보니 가짜B 가 가져갔네');
  const nt = pr2.slice(pr2.indexOf('[수사 수첩'), pr2.indexOf('[수사 수첩') + 900);
  want(/짐작\(미확정 — 「의문 → 기운 답」 포함\): [^\n]*m4 가짜C의 오빠는 친오빠인가 → 친오빠가 아니라/.test(pr2), '다음 프롬프트: 짐작 칸에 「의문 → 기운 답」 ' + (nt.match(/짐작\([^\n]{0,80}/) || [''])[0]);
  want(!/· 변화 — 답 없이 오래 열린 의문/.test(due(pr2)), '기운 답이 달린 의문은 「오래 답 없음」에서 빠짐');
  const m1 = await p.evaluate(() => { const n = S.notes.find(x => x.id === 'm1'); return [n.done || 0, n.a || '', 'lean' in n]; });
  want(m1[0] === 1 && m1[1] === '가짜B 가 가져감(캡처)' && !m1[2], '기운 답 → 확인되면 sure:true 로 풀림 ' + m1.join(' '));

  console.log('— 맞춰 보기 · 연혁');
  const xr = await p.evaluate(() => xrItems().map(x => `${x.day}|${x.who}|${x.t}`));
  want(xr.includes('2026-11-10|가짜A|1265') && xr.includes('2026-11-10|가짜B|1270'), '말 속 날짜(11/20)는 줄의 날짜를 안 바꿈 — 구분선 날짜 그대로 ' + xr.join(' '));
  want(!xr.some(x => /날짜 구분선|참여 인원/.test(x)), '「날짜 구분선:」「참여 인원:」은 사람이 아님');
  want(xr.includes('2026-11-10|가짜A|null'), '시각 없는 「가짜A: 말」 — 도장 붙은 줄로 아는 사람이라 받음');
  const tb = await p.evaluate(() => [tlBefore({ d: '2026-11-10', t: '20:10' }, { d: '2026-11-10', t: '' }), tlBefore({ d: '2026-11-09' }, { d: '2026-11-10', t: '01:00' }), tlBefore({ d: '--11-09' }, { d: '2026-11-10' }), tlBefore({ d: '2026-11-10', t: '21:00' }, { d: '2026-11-10', t: '21:40', amb: true }), tlBefore({ d: '2026-11-10', t: '08:00' }, { d: '2026-11-10', t: '09:40', amb: true })]);
  want(tb.join() === 'false,true,true,false,true', '연혁 대조는 둘 다 아는 것끼리(시각 없는 줄·오전오후 모름) ' + tb.join());

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `\n실패 ${bad}` : '\n전부 통과'); process.exit(bad ? 1 : 0);
})();
