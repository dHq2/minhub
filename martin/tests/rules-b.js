// 마틴 점검 — 통일 규칙 v1.0 (2026-11-17, B · 보스: 특별·예외가 넘치지 않게). 가짜 사건·가짜 마틴, 폰 화면.
// 프롬프트 구조를 지킨다: 상태 칸엔 명령문이 없고, 규칙은 원칙 다섯 + 출력 형식 한 곳에, 같은 규칙은 한 번만, 개발 메모 없음, 걸린 것은 많아야 셋.
// 새 규칙이 필요해 이 점검이 깨지면 — 점검을 느슨하게 하지 말고 그 규칙이 다섯 원칙 중 어디에 녹아야 하는지부터 본다.
// 쓰는 법: bash martin/tests/run.sh rules-b
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__ps = [];
  window.claude = { use: async n => { if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { if (p.includes('손질됐다')) return { say: ['판을 조금 손봤다.'] }; if (p.includes('자료 사진 한 장을 받아 적는다')) return { t: '' }; window.__ps.push(p); return { say: ['그래.'] }; };
    return f; } };
};
const SEED = { v: 3, id: '20261117-rules', at: 1, turn: 12, nid: 9, emax: 2, notes: [{ id: 'm1', k: 'q', t: '가짜 의문' }], memo: [], log: [{ who: 'p', text: '가짜 말', at: 1 }, { who: 'm', text: '그래.', at: 2 }],
  ev: [{ id: 'e1', kind: 'photo', card: 'n7', title: '가짜 단톡', read: '가짜방\n오후 9:05 가짜A: 집 도착\n10:30 가짜B: 문 잠갔음\n10:40 하람: 나 왔어\n10:50 하람: 문 열어', at: 1, turn: 1 },
       { id: 'e2', kind: 'photo', card: 'n8', title: '가짜 골목', read: '', at: 2, turn: 2 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사건', note: '', x: 1000, y: 900, r: 0 }, { id: 'n3', kind: 'person', title: '가짜A', note: '귀가 시각 미확정', x: 1100, y: 900, r: 0 },
          { id: 'n7', kind: 'photo', title: '가짜 단톡', note: '', x: 900, y: 900, r: 0 }, { id: 'n8', kind: 'photo', title: '가짜 골목', note: '', x: 800, y: 900, r: 0 }],
  links: [{ id: 'n3-n7', a: 'n3', b: 'n7', label: '발신', sure: false, why: '가짜 이유' }], cuts: [{ a: 'n1', b: 'n3', why: '가짜', turn: 3 }] };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 } });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(3000);
  const ask = async t => { await p.evaluate(x => turn({ text: x }), t); await p.waitForTimeout(400); return p.evaluate(() => window.__ps[window.__ps.length - 1] || ''); };

  const pr = await ask('그래서 범인은 누구야?');
  console.log(`        (프롬프트 ${pr.length}자)`);
  const at = k => pr.indexOf(k);
  const state = pr.slice(at('[수사 수첩'), at('[이번 턴에 걸린 것 — 앱이')), given = pr.slice(at('[이번에 동료가 가져온 것]'), at('원칙 — 언제나'));
  const ORDER = /(해라|하라|어라|아라|여라|써라|세워라|물어라|꽂아라|붙여라|비워라|빼라)(?=[\s\].)」,]|$)|이번 답에서 꼭/;
  want(!ORDER.test(state), '상태 칸(수첩~자료 형편)엔 명령문이 없다 ' + ((state.match(ORDER) || [])[0] || ''));
  want(!ORDER.test(given), '「이번에 동료가 가져온 것」에도 명령문이 없다 ' + ((given.match(ORDER) || [])[0] || ''));
  for (const k of ['1. 근거 —', '2. 무게 —', '3. 변화 —', '4. 말 —', '5. 의심 —', '출력 — JSON 하나만', '[이번 턴에 걸린 것 — 앱이']) want(pr.split(k).length === 2, `한 번만 — ${k}`);
  for (const [k, w] of [['원본까지 봤는데 없다', '「없다」 규칙'], ['1~3줄', '말 길이'], ['over 에 그 m id', '덮인 짐작 지목'], ['[의뢰와 시간]대로', '처지 질문'], ['새 근거가 올 때만 움직인다', '확신 변화']]) want(pr.split(k).length === 2, `같은 규칙은 한 곳 — ${w}`);
  want(!/\b1[01]-1[67] [ABCD]\b|11-1\d [ABCD]:/.test(pr), '개발 메모(날짜·방)가 프롬프트에 없다');
  const due = (pr.slice(at('[이번 턴에 걸린 것 — 앱이'), at('[이번에 동료가 가져온 것]')).match(/^· /gm) || []).length;
  want(due >= 1 && due <= 3, `걸린 것은 1~3개 (${due})`);
  want(/· (근거|무게|변화|말|의심) — /.test(pr) && !/· (?!근거|무게|변화|말|의심)[^\n—]{1,6} — /.test(pr.slice(at('[이번 턴에 걸린 것 — 앱이'), at('[이번에 동료가 가져온 것]'))), '걸린 것은 원칙 이름으로만 가리킨다');
  want(pr.includes('· 의심 — 동료가 결론'), '결론 물음 → 의심이 맨 위');
  const all = await p.evaluate(() => dueList().length + ' / ' + (DUE_SRC.map(f => { try{ return f() ? 1 : 0; }catch(e){ return 0; } }).reduce((a, x) => a + x, 0)));
  console.log(`        (걸린 것 실림 / 신호 ${all})`);

  /* 자료 예고(cue) — 걸린 것은 다음 답으로, 상태는 [자료 형편] 칸에 */
  const pc = await ask('좋아. 다음 기록이다.');
  want(pc.includes('(동료가 곧 자료를 건넨다 — 다음 답으로)') && /\[자료 형편[^\n]*자료 예고 — 「좋아\. 다음 기록이다\.」/.test(pc), '자료 예고 → 걸린 것은 미루고, 형편 칸에 상태로');
  want(pc.includes('말의 크기만큼'), '짧은 말엔 짧게 — 원칙 4');

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); if (bad){ console.log(`실패 ${bad}`); process.exit(1); } console.log('전부 통과');
})();
