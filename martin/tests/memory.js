// 기억의 바닥 점검 v1.0 (2026-11-17, A) — v0.14 A: 판독문 채우기 · 대화 기억 · JSON 다시 묻기 · 대화 다시 보기(recall) · 찌꺼기 줄 거르기 · 메모 전문 · 판 고침 한 줄은 자막으로 · 연출 중 화면이 다시 열려도 이어 하기 · 답 못 받은 말 저절로 다시 묻기
// 쓰는 법: bash martin/tests/run.sh memory   (가짜 사건만)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const PIC = 'data:image/webp;base64,' + fs.readFileSync(path.join(__dirname, '..', 'img', 'martin.webp')).toString('base64');
const MOCK = () => {
  window.__p = []; window.__bf = 0; window.__jf = 0;
  window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async p => { window.__p.push(p); await new Promise(r => setTimeout(r, 120));
      if (p.includes('자료 사진 한 장을 받아 적는다')){ window.__bf++; return { t: '가짜 판독: 방 이름 가짜방. 오후 9:05 가짜 말' }; }
      const said = (p.split('[동료의 말/붙여넣기]\n')[1] || '').split('\n')[0];
      if (said.includes('재시도시험')){ if (!window.__jf){ window.__jf = 1; const e = new Error('the reply held no JSON value'); e.code = 'invalid_json'; throw e; } return { say: ['재시도 성공'] }; }
      if (said.includes('기억시험')) return p.includes('[대화 다시 보기') ? { say: ['기억 찾음 — ' + (p.includes('가짜열쇠는 경비실') ? '열쇠 줄 있음' : '없음')] } : { say: ['…'], recall: ['가짜열쇠'], recallLine: '잠깐. 앞에서 한 말을 다시 본다.' };
      if (said.includes('찌꺼기시험')) return { say: ['정상 줄', '{"placeholder":""}', { t: '' }], ops: [{ op: 'add', id: 'n9', kind: 'clue', title: '긴 메모', note: '가'.repeat(70) + ' 끝에가짜가게이름', line: '카드 자막', near: 'n1' }] };
      if (said.includes('끊김시험')) return { say: ['끊김1', '끊김2', '끊김3', '끊김4', '끊김5', '끊김6'], notes: [{ k: 'q', t: '가짜 의문 하나' }], read: [{ id: 'e1', t: '새 판독 오후 11:42' }] };
      if (said.includes('대기시험')) return { say: ['대기 답'] };
      return { say: ['응'] }; };
    return f; } };
};
const LOG = [{ who: 'p', text: '가짜조건: 이제 더 캘 수 없다. 이게 전부다', at: 1000 }, { who: 'm', text: '알겠다.', at: 2000 }, { who: 'p', text: '가짜열쇠는 경비실에 있었다', at: 3000 }];
for (let i = 0; i < 30; i++) LOG.push({ who: i % 3 ? 'm' : 'p', text: '채움 ' + i, at: 4000 + i });
const SEED = { v: 3, id: '20261117-mem', at: 1, turn: 3, nid: 9, emax: 1, notes: [], memo: [], links: [], log: LOG,
  ev: [{ id: 'e1', kind: 'photo', card: 'n7', title: '가짜 캡처', thumb: PIC, read: '', at: 1, turn: 1 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사건', note: '', x: 1000, y: 900, r: 0 }, { id: 'n7', kind: 'photo', title: '가짜 캡처', note: '', x: 1150, y: 1000, r: 0, thumb: PIC }] };
(async () => {
  const b = await chromium.launch(); let bad = 0; const errs = [];
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(6000);
  const chat = () => p.evaluate(() => [...document.querySelectorAll('#chat .msg.m')].map(e => e.textContent));
  const send = async t => { await p.waitForFunction(() => !busy, null, { timeout: 20000 }); await p.fill('#msg', t); await p.click('#send'); };
  const idle = () => p.waitForFunction(() => !busy, null, { timeout: 30000 });

  console.log('— 판독문 채우기');
  want(await p.evaluate(() => S.ev[0].read.startsWith('가짜 판독')) && await p.evaluate(() => window.__bf) === 1, '판독문 없던 사진을 열자마자 한가할 때 채움 (한 번만)');

  console.log('— 대화 기억');
  await send('그냥 묻는다'); await idle();
  let pr = await p.evaluate(() => window.__p[window.__p.length - 1]);
  want(pr.includes('[동료가 이 사건에서 앞서 한 말') && pr.includes('가짜조건: 이제 더 캘 수 없다'), '24줄보다 앞선 동료의 말(못 박은 조건)이 프롬프트에 남음');
  want(pr.includes('[최근 대화]') && pr.includes('recall:'), '최근 대화 칸과 recall 규칙');
  want(pr.includes('오전/오후') && pr.includes('흔히 달리 부르는 이름'), '판독 규칙(오전·오후, 다른 이름 같이)');

  console.log('— JSON 다시 묻기');
  await send('재시도시험'); await idle();
  let c = await chat();
  want(c.some(t => t.includes('재시도 성공')) && !c.some(t => t.includes('실이 끊겼다')), 'JSON 실패는 조용히 한 번 더 물어 답함');

  console.log('— 대화 다시 보기');
  await send('기억시험'); await idle(); c = await chat();
  want(c.some(t => t.includes('앞에서 한 말을 다시 본다')) && c.some(t => t.includes('기억 찾음 — 열쇠 줄 있음')), 'recall → 옛 대화에서 찾아 붙여 한 번 더 물음');

  console.log('— 찌꺼기 줄·메모 전문·자막');
  await send('찌꺼기시험'); await p.waitForTimeout(400);
  const cap = await p.waitForSelector('.opcap', { timeout: 15000 }).then(() => true).catch(() => false);
  await idle(); c = await chat();
  want(!c.some(t => t.includes('placeholder')), '{"placeholder":""} 같은 찌꺼기는 대화에 안 나옴');
  want(!c.some(t => t.includes('카드 자막')) && cap, '판 고침 한 줄은 대화가 아니라 카드 곁 자막');
  const note = await p.evaluate(() => nodeOf('n9') && nodeOf('n9').note);
  want(note && note.endsWith('끝에가짜가게이름'), '카드 메모는 60자에서 안 잘리고 전문 저장 (' + (note || '').length + '자)');

  console.log('— 연출 중 화면이 다시 열려도');
  await send('끊김시험');
  await p.waitForFunction(() => [...document.querySelectorAll('#chat .msg.m')].some(e => e.textContent.includes('끊김2')), null, { timeout: 20000 });
  const mid = await p.evaluate(() => ({ read: S.ev[0].read, up: !!localStorage.getItem('drmartin.unplayed') }));
  want(mid.read === '새 판독 오후 11:42' && mid.up, '말하는 중에도 판독문은 이미 저장, 남은 일은 기기에 적혀 있음');
  await p.reload(); await p.waitForTimeout(1500);
  await p.waitForFunction(() => [...document.querySelectorAll('#chat .msg.m')].some(e => e.textContent.includes('끊김6')), null, { timeout: 30000 }).catch(() => {});
  await idle();
  const after = await p.evaluate(() => ({ notes: S.notes.map(n => n.t), read: S.ev[0].read, up: localStorage.getItem('drmartin.unplayed'), lines: [...document.querySelectorAll('#chat .msg.m')].map(e => e.textContent) }));
  want(after.lines.some(t => t.includes('아까 하던 말을 마저 한다')) && after.lines.some(t => t.includes('끊김6')), '다시 열면 끊긴 말을 마저 함');
  want(after.notes.includes('가짜 의문 하나') && after.read === '새 판독 오후 11:42', '수첩·판독문도 살아 있음');
  want(!after.up, '다 하고 나면 기기 메모 지움');
  want(after.notes.filter(t => t === '가짜 의문 하나').length === 1, '수첩은 두 번 적지 않음');

  console.log('— 답 못 받은 말');
  await p.close(); const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push(e.message)); await p2.addInitScript(MOCK);
  await p2.goto(URL); await p2.waitForTimeout(5000); await p2.waitForFunction(() => !busy, null, { timeout: 20000 });
  await p2.evaluate(() => { S.pending = { given: '[동료의 말/붙여넣기]\n대기시험\n', photos: [], at: Date.now() }; save(); });
  await p2.reload(); await p2.waitForTimeout(9000);
  const c2 = await p2.evaluate(() => [...document.querySelectorAll('#chat .msg.m')].map(e => e.textContent));
  want(c2.some(t => t.includes('다시 생각해 본다')) && c2.some(t => t.includes('대기 답')), '답을 못 받은 말은 다시 열면 저절로 다시 물어 답함');

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `\n실패 ${bad}` : '\n전부 통과'); process.exit(bad ? 1 : 0);
})();
