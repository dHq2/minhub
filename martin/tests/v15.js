// v0.15 한 판 점검 v1.3 (2026-11-17, A — v1.1: B 수사 버릇·뒤집어 보기 칸 · v1.2: 연혁 칸 · v1.3 B: 통일 규칙 — 걸린 것·원칙·출력 형식 칸과 순서) — 네 방의 v0.14 몫(A 기억·B 자료 형편·C 맞춰 보기·D 사건 시계 + 벽시계·행동 기록)이 한 사건에서 같이 맞물려 도는지 처음부터 끝까지
// 쓰는 법: bash martin/tests/run.sh v15   (가짜 사건만 — 실제 사건 이름·대사·답은 넣지 않는다)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const PIC = 'data:image/webp;base64,' + fs.readFileSync(path.join(__dirname, '..', 'img', 'martin.webp')).toString('base64');
const MOCK = () => {
  window.__p = []; window.__bf = 0;
  window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { window.__p.push(p); await new Promise(r => setTimeout(r, 120));
      if (p.includes('자료 사진 한 장을 받아 적는다')){ window.__bf++; return { t: '가짜 골목방\n9:40 가짜B: 아직 밖이야' }; }
      const said = (p.split('[동료의 말/붙여넣기]\n')[1] || '').split('\n')[0];
      if (said.includes('닫힘시험')) return { say: ['알겠다. 있는 것으로 간다.', '그래도 경비실 기록을 가져와라.'], ask: '경비실 출입 기록', notes: [{ k: 'todo', t: '경비실 기록 캐 오기' }, { k: 'q', t: '가짜B는 9:40에 어디 있었나' }] };
      if (said.includes('결론시험')) return p.includes('[대화 다시 보기')
        ? { say: ['결론: 문은 가짜B가 열었다(70%).', '경비 기록을 가져와 줘.', '가짜열쇠가 ' + (p.includes('가짜열쇠는 경비실') ? '경비실에 있었다는 말과 맞는다.' : '어디 있었는지 모르겠다.')], ask: '경비 기록' }
        : { say: ['…'], recall: ['가짜열쇠'], recallLine: '잠깐. 앞에서 한 말을 다시 본다.' };
      if (said.includes('길게시험')) return { say: ['길게1', '길게2', '길게3', '길게4', '길게5', '길게6'], notes: [{ k: 'guess', t: '가짜 짐작 하나' }] };
      return { say: ['응'] }; };
    return f; } };
};
const LOG = [{ who: 'p', text: '가짜열쇠는 경비실에 있었다', at: 1000 }, { who: 'm', text: '적어 둔다.', at: 2000 }];
for (let i = 0; i < 30; i++) LOG.push({ who: i % 3 ? 'm' : 'p', text: '채움 ' + i, at: 3000 + i });
const SEED = { v: 3, id: '20261117-v15', at: 1, turn: 3, nid: 9, emax: 3, notes: [], memo: [], links: [], log: LOG,
  ev: [{ id: 'e1', kind: 'photo', card: 'n7', title: '가짜 단톡 캡처', thumb: PIC, read: '가짜 단톡방\n오후 9:05 가짜A: 집에 도착\n오후 10:30 가짜A: 문 잠갔음', at: 1, turn: 1 },
       { id: 'e2', kind: 'photo', card: 'n8', title: '가짜 골목 캡처', thumb: PIC, read: '', at: 2, turn: 2 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 우편함 사건', note: '', x: 1000, y: 900, r: 0 },
          { id: 'n7', kind: 'photo', title: '가짜 단톡 캡처', note: '', x: 1150, y: 1000, r: 0, thumb: PIC },
          { id: 'n8', kind: 'photo', title: '가짜 골목 캡처', note: '', x: 850, y: 1000, r: 0, thumb: PIC }] };
(async () => {
  const b = await chromium.launch(); let bad = 0; const errs = [];
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.bringToFront(); await p.goto(URL); await p.waitForTimeout(6000);
  const chat = () => p.evaluate(() => [...document.querySelectorAll('#chat .msg.m')].map(e => e.textContent));
  const idle = () => p.waitForFunction(() => !busy, null, { timeout: 30000 });
  const send = async t => { await idle(); await p.fill('#msg', t); await p.click('#send'); };
  const lastP = () => p.evaluate(() => window.__p[window.__p.length - 1]);

  console.log('— 열자마자: 판독문 채우기(A) → 맞춰 보기(C)');
  want(await p.evaluate(() => S.ev[1].read.includes('9:40 가짜B') && window.__bf === 1), '판독문 없던 사진(e2)을 한가할 때 채움');
  const xr = await p.evaluate(() => xrefText());
  const i905 = xr.indexOf('오후 9:05 가짜A'), i1030 = xr.indexOf('오후 10:30 가짜A'), i940 = xr.indexOf('9:40(오전·오후?) 가짜B');
  want(i905 > 0 && i1030 > i905 && i940 > 0, '채운 판독문이 곧바로 전체 시계에 — 시간순, 오전·오후 빠진 건 (오전·오후?)');
  want(/가짜A \(2줄 · e1\)/.test(xr) && /가짜B \(1줄 · e2\)/.test(xr), '인물별 발언에 두 사람이 자료 출처와 같이');
  want(!xr.includes('판독문 없는 자료'), '판독문 빚 없음(채웠으니)');

  console.log('— 시계(D)·벽시계(A)');
  const ck0 = await p.evaluate(() => clockMs()); await p.waitForTimeout(2000); const ck1 = await p.evaluate(() => clockMs());
  want(ck1 - ck0 >= 1500 && ck1 - ck0 <= 2600, `방에 있으면 사건 시계가 흐름 (${ck0}→${ck1}ms)`);
  const wc = await p.evaluate(() => ({ w: typeof wcMs === 'function' ? wcMs() : -1, c: clockMs(), on: !!document.querySelector('#wallclock') }));
  want(wc.on && Math.abs(wc.w - wc.c) < 400, `벽시계 바늘이 사건 시계와 같은 값 (${wc.w} / ${wc.c})`);

  console.log('— 판에서 한 일(A 행동 기록)');
  await p.evaluate(() => { cam.k = 1; cam.x = 1000; cam.y = 960; applyCam(0); }); await p.waitForTimeout(300);
  const c7 = await p.evaluate(() => { const r = document.querySelector('#nodes [data-id="n7"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await p.touchscreen.tap(c7.x, c7.y); await p.waitForTimeout(400);
  const act1 = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.log') || '[]').filter(e => e.type === 'action' && e.act === '카드 고름').pop());
  want(act1 && act1.refs && act1.refs[0].title === '가짜 단톡 캡처' && act1.clk != null, '카드 고름 기록에 카드 이름과 그때 사건 시계(clk)가 같이');

  console.log('— 「더 없다」(B 자료 형편)');
  await send('이제 더 캘 수 없다. 이게 전부야 닫힘시험'); await idle();
  let c = await chat(); let st = await p.evaluate(() => ({ closed: S.closed, notes: S.notes.map(n => n.k + ':' + n.t), bar: !document.querySelector('#nbMode').hidden }));
  want(st.closed === true && st.bar, '동료의 말에서 닫힘을 읽고 수첩 위에 「자료 닫힘」');
  want(c.some(t => t.includes('있는 것으로 간다')) && !c.some(t => t.includes('가져와라')), '같은 턴의 「가져와라」 말은 걸러짐');
  want(!st.notes.some(n => n.startsWith('todo:')) && st.notes.some(n => n.includes('9:40에 어디')), '캐 오라는 할 일은 빠지고 의문은 남음');
  want(await p.evaluate(() => S.notes.every(n => /^m\d+$/.test(n.id)) && new Set(S.notes.map(n => n.id)).size === S.notes.length), '수첩 번호가 m1·m2… 로 겹치지 않음 (번호 세기 없는 옛 사건도)');
  const pr1 = await lastP();
  want(pr1.includes('[지난 네 말 뒤 동료가 판에서 한 일') && pr1.includes('카드 고름') && pr1.includes('가짜 단톡 캡처'), '그 턴 프롬프트에 방금 누른 카드가 들어감');

  console.log('— 결론을 청하면: 모든 칸이 한 프롬프트에');
  await send('그럼 결론 정리해줘 결론시험'); await idle();
  const all = await p.evaluate(() => window.__p.filter(x => (x.split('[동료의 말/붙여넣기]\n')[1] || '').startsWith('그럼 결론')));
  const pr = all[0] || '', re = all[1] || '';
  const once = (s, k) => s.split(k).length - 1 === 1;
  const KEYS = [['[동료가 이 사건에서 앞서 한 말', 'A 옛 동료 말'], ['[최근 대화]', 'A 최근 대화'], ['recall:', 'A recall 규칙'], ['흔히 달리 부르는 이름', 'A 판독 규칙'],
    ['[자료 형편 — 닫힘', 'B 자료 닫힘'], ['[이번 턴에 걸린 것 — 앱이', 'B 걸린 것'], ['원칙 — 언제나', 'B 원칙'], ['[의뢰와 시간 — v2.3]', 'B·A 인물 설정'],
    ['[맞춰 보기 — 앱이', 'C 맞춰 보기'], ['· 의심 — 동료가 결론', 'C·B 의심(모순 쓸기·뒤집어 보기)'], ['[사건 시계]', 'D 사건 시계'], ['동료 쪽 현실 시각', 'A 현실 시각'],
    ['출력 — JSON 하나만', 'B 출력 형식'], ['[연혁 —', 'A 연혁']];
  const miss = KEYS.filter(([k]) => !once(pr, k)).map(([, n]) => n);
  want(!miss.length, `${KEYS.length}칸이 한 번씩 다 있음` + (miss.length ? ' — 빠지거나 겹침: ' + miss.join(', ') : ''));
  want(pr.includes('가짜열쇠는 경비실에 있었다'), '24줄보다 앞선 동료의 말이 기억 칸에 남음');
  want(pr.indexOf('[맞춰 보기') < pr.indexOf('[사건 시계]') && pr.indexOf('[사건 시계]') < pr.indexOf('[최근 대화]') && pr.indexOf('[자료 형편') < pr.indexOf('[이번 턴에 걸린 것') && pr.indexOf('[이번 턴에 걸린 것') < pr.indexOf('[이번에 동료가 가져온 것]') && pr.indexOf('[이번에 동료가 가져온 것]') < pr.indexOf('원칙 — 언제나') && pr.indexOf('원칙 — 언제나') < pr.indexOf('출력 — JSON 하나만'), '칸 순서 — 상태(자료함·맞춰 보기·사건 시계·판·대화·자료 형편) → 걸린 것 → 가져온 것 → 원칙 → 출력 형식');
  console.log(`      (프롬프트 ${pr.length}자)`);
  want(pr.length < 30000, '프롬프트가 3만 자 안쪽');
  want(re.includes('[대화 다시 보기') && re.includes('[자료 형편 — 닫힘') && re.includes('[맞춰 보기'), 'recall 로 다시 물을 때도 닫힘·맞춰 보기 칸이 그대로');
  c = await chat();
  want(c.some(t => t.includes('앞에서 한 말을 다시 본다')) && c.some(t => t.includes('경비실에 있었다는 말과 맞는다')), 'recall 결과로 답함');
  want(c.some(t => t.includes('결론: 문은 가짜B')) && !c.some(t => t.includes('경비 기록을 가져와')), '다시 물은 답에도 닫힘 거름이 걸림');
  const turns = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.log') || '[]').filter(e => e.type === 'turn' && e.cid === S.id));
  want(turns.length >= 3 && turns.every(t => t.clk != null), '턴 기록마다 사건 시계(clk)');

  console.log('— 연출 중 다시 열기(A) + 시계·닫힘이 살아 있나');
  await send('길게시험');
  await p.waitForFunction(() => [...document.querySelectorAll('#chat .msg.m')].some(e => e.textContent.includes('길게2')), null, { timeout: 20000 });
  await p.evaluate(() => { clockTick(); save(); });
  const before = await p.evaluate(() => clockMs());
  await p.reload(); await p.waitForTimeout(1500);
  await p.waitForFunction(() => [...document.querySelectorAll('#chat .msg.m')].some(e => e.textContent.includes('길게6')), null, { timeout: 30000 }).catch(() => {});
  await idle();
  st = await p.evaluate(() => ({ ms: clockMs(), closed: S.closed, bar: !document.querySelector('#nbMode').hidden, g: S.notes.filter(n => n.t === '가짜 짐작 하나').length, lines: [...document.querySelectorAll('#chat .msg.m')].map(e => e.textContent) }));
  want(st.lines.some(t => t.includes('아까 하던 말을 마저 한다')) && st.lines.some(t => t.includes('길게6')), '끊긴 말을 마저 함');
  want(st.ms >= before, `사건 시계가 다시 열어도 이어짐 (${before}→${st.ms}ms)`);
  want(st.closed === true && st.bar, '자료 닫힘도 그대로');
  want(st.g === 1, '수첩은 한 번만');

  console.log('— 복기본(D)');
  const rc = await p.evaluate(async () => { const g = await Promise.race([recapGather(), new Promise(r => setTimeout(() => r(null), 15000))]); return g ? recapText(g) : ''; });
  want(rc.includes('총 추리 시간') && rc.includes('⏱'), '복기본에 총 추리 시간·턴마다 사건 시각');
  want(rc.includes('자료 닫힘') && rc.includes('카드 고름'), '복기본 행동 줄에 자료 닫힘·카드 고름');
  want(!/data:image/.test(rc), '복기본에 그림 데이터 없음');

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `\n실패 ${bad}` : '\n전부 통과'); process.exit(bad ? 1 : 0);
})();
