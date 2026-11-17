// 자료 예고 알아듣기 점검 v1.2 (2026-11-17, D · v1.1: 프롬프트 글 대신 S.cue 상태를 본다 · v1.2 B: 답 거르기는 resFilter(답 받기 단계 목록)) — 「다음 기록이다」면 받을 채비만 · 닫힘이었으면 열림 · 「지금 당장은 힘들어」로는 닫히지 않음
// 쓰는 법: bash martin/tests/run.sh cue   (가짜 사건 — 김지민)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const SEED = { v:3, id:'20261117-cue', at:1, nodes:[{ id:'n1', kind:'brief', title:'가짜 금고 사건', note:'', x:1000, y:1000, r:0 }, { id:'n3', kind:'person', title:'김지민', note:'', x:1200, y:1000, r:0 }],
  links:[], log:[{ who:'p', text:'시작하자', at:1 }, { who:'m', text:'좋다.', at:2 }], memo:[], turn:3, nid:4, suspect:null };
(async () => {
  const b = await chromium.launch(), errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await (await b.newContext({ viewport:{ width:412, height:915 } })).newPage();
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.claude = { use:async () => null }; });
  await p.addInitScript(s => { if (!sessionStorage.getItem('ck')){ localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('ck', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(2000);
  const say = (text, extra) => p.evaluate(([t, x]) => { S.log.push({ who:'p', text:t, at:Date.now() + Math.random(), photos:[], files:[], ...(x || {}) }); modeText(); return JSON.stringify(S.cue || null); }, [text, extra]);
  const filt = r => p.evaluate(r => { const o = resFilter(r); return { mode:o.mode, ask:o.ask, closed:S.closed }; }, r);
  /* ① 「지금 당장은 힘들어」 + 마틴이 closed → 닫지 않음 */
  await say('지금은 좀 힘들어. 있는 걸로 보자');
  let r = await filt({ say:['알겠다.'], mode:'closed' });
  want(r.closed !== true, `한때 사정엔 닫힘을 안 켬 (closed=${r.closed})`);
  /* 진짜 끝이면 그대로 닫힘 */
  await say('자료는 이게 전부야'); r = await filt({ say:['알겠다.'] });
  want(r.closed === true, `「이게 전부야」는 그대로 닫힘 (closed=${r.closed})`);
  /* ② 닫힌 채로 「좋아. 다음 기록이다.」 → 열리고 [자료 예고] */
  let t = await say('좋아, 다음 기록 간다');
  want(/"soon":true/.test(t) && (await p.evaluate(() => cueState())).startsWith('자료 예고'), '「다음 기록 간다」 → S.cue 예고 상태 · cueState()');
  want(await p.evaluate(() => S.closed) === false, '닫혀 있던 자료 형편이 열림');
  r = await filt({ say:['넘겨라.'], ask:'더 가져와라', mode:'closed' });
  want(!r.ask && r.closed === false, `예고한 턴엔 ask·closed 를 받지 않음 (closed=${r.closed})`);
  /* ③ 비슷하지만 예고가 아닌 말 */
  for (const s of ['그다음 장면은 어때?', '내가 정리해 줄게', '잠깐만, 그 말 이상한데 오빠가 왜 거기서 나와', '다음 거는 뭐가 걸리냐 너는 쭉 보면서 생각해 봤어?'])
    want(!/"soon":true/.test(await say(s)), `예고 아님: 「${s}」`);
  for (const s of ['보낼게', '다음 거', '잠깐만', '일기 하나 더 간다', '올릴게요'])
    want(/"soon":true/.test(await say(s)), `예고: 「${s}」`);
  /* ④ 사진을 같이 보냈으면 예고 칸 없음 */
  want(!/"soon":true/.test(await say('다음 기록이다', { photos:['n9'] })), '사진이 붙어 있으면 예고 칸 없음');
  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `실패 ${bad}` : '모두 통과'); process.exit(bad ? 1 : 0);
})();
