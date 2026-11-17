// 프사 자동·그림 4장·없다 전 다시 보기·답 없으면 닫힘 점검 v1.2 (2026-11-18, A — v1.2 A: 얼굴 문구는 원칙 2·판 글에 얼굴 상태 · v1.1 B: 없다 전 원본·글자 그대로를 원칙 1 문장으로 확인) — 보스 버그 보고(사건 20261117-5723 첫 턴)를 가짜 사건으로
// 쓰는 법: bash martin/tests/run.sh face   (가짜 사건만)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__c = []; window.__face = 0;
  window.claude = { use: async n => {
    if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async (p, o) => { const k = (o && o.images || []).length; window.__c.push({ p, k }); await new Promise(r => setTimeout(r, 60));
      if (k > 4){ const e = new Error('at most 4 images per call'); e.code = 'image_rejected'; throw e; }
      if (p.includes('자료 사진 한 장을 받아 적는다')) return { t: '가짜 단톡방\n가짜민지(오후 9:01): 안녕하세요\n가짜민지(오후 9:02): 의뢰드려요' };
      if (p.includes('찾을 사람: 「가짜민지」')){ window.__face++; return k >= 2 ? { found: true, piece: 1, box: [0.07, 0.4389, 0.06, 0.0333], desc: '빨간 동그라미 그림' } : { found: false, why: '조각 하나' }; }
      if (p.includes('찾을 사람:')){ window.__face++; return { found: false, why: '없음' }; }
      const said = (p.split('[동료의 말/붙여넣기]\n')[1] || '').split('\n')[0];
      if (said.includes('사진시험')) return { say: ['넷이다.'], ops: [{ op: 'add', id: 'n6', kind: 'person', title: '가짜민지', note: '의뢰인', near: 'n1' }] };
      if (said.includes('닉시험')) return p.includes('[다시 보기 — 너는') ? { say: ['원본을 다시 보니 프사가 있다.'] } : { say: [{ t: '프로필 사진은 지금 가진 자료에선 안 보인다.', on: 'n2' }] };
      return { say: ['응.'] }; };
    return f; } };
};
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK); await p.addInitScript(() => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } });
  await p.goto(URL); await p.waitForTimeout(3000);
  const png = async (w, h, dot) => Buffer.from((await p.evaluate(([w, h, dot]) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#000'; x.font = '40px sans-serif'; for (let y = 60; y < h; y += 160) x.fillText('가짜 ' + y, 200, y);
    if (dot){ x.fillStyle = '#e00000'; x.beginPath(); x.arc(dot[0], dot[1], 30, 0, 7); x.fill(); } return c.toDataURL('image/png'); }, [w, h, dot])).split(',')[1], 'base64');
  const idle = () => p.waitForFunction(() => !busy, null, { timeout: 40000 });
  const send = async t => { await idle(); await p.fill('#msg', t); await p.click('#send'); };

  console.log('— 사진 4장(세로로 긴 캡처 둘 = 그림 8장)');
  await p.locator('#fileImg').setInputFiles([{ name: 'a.png', mimeType: 'image/png', buffer: await png(1000, 4000, [100, 2500]) }, { name: 'b.png', mimeType: 'image/png', buffer: await png(1000, 4000) },
    { name: 'c.png', mimeType: 'image/png', buffer: await png(1200, 800) }, { name: 'd.png', mimeType: 'image/png', buffer: await png(1200, 800) }]);
  await p.waitForTimeout(1500);
  await send('사진시험'); await p.waitForFunction(() => S.turn >= 1, null, { timeout: 40000 }); await idle();
  let st = await p.evaluate(() => ({ max: Math.max(...window.__c.map(c => c.k)), pre: window.__c.filter(c => c.p.includes('자료 사진 한 장을 받아 적는다')).length,
    main: window.__c.find(c => c.p.includes('사진시험') && c.p.includes('[그림은 한 번에')), reads: S.ev.filter(e => e.read).length, ok: S.log.some(l => l.who === 'm' && l.text.includes('넷이다')),
    act: JSON.parse(localStorage.getItem('drmartin.log') || '[]').some(e => e.act === '사진 먼저 판독') }));
  want(st.max <= 4, '어느 부름도 그림 4장을 넘지 않음 (가장 많이 ' + st.max + ')');
  want(st.pre === 4 && st.reads === 4 && st.act, '넘치면 사진마다 먼저 판독문을 받아 적음 (' + st.pre + '번)');
  want(!!st.main && st.main.k === 4 && st.ok, '본 답엔 사진을 한 장씩 줄여 4장 + 안내 한 줄, 답이 옴');

  console.log('— 프사 자동');
  await p.waitForFunction(() => { const n = nodeOf('n6'); return n && n.face; }, null, { timeout: 30000 }).catch(() => {});
  st = await p.evaluate(async () => { const n = nodeOf('n6'); if (!n || !n.face) return { face: false };
    const im = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = n.face; }); const c = document.createElement('canvas'); c.width = c.height = 160; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(80, 80, 1, 1).data;
    return { face: true, rgb: [...d.slice(0, 3)], ev: n.faceEv, read: S.ev.find(e => e.id === n.faceEv).read, card: !!document.querySelector('#nodes [data-id="n6"] .ph.real img'), act: JSON.parse(localStorage.getItem('drmartin.log') || '[]').some(e => e.act === '프사 자동') }; });
  want(st.face && st.card && st.act, '인물 카드를 세우자 캡처 속 프사를 찾아 얼굴로 붙임');
  want(st.face && st.rgb[0] > 180 && st.rgb[1] < 90, '조각 좌표를 원본으로 되돌려 정확한 자리를 자름 (가운데 색 ' + (st.rgb || []) + ')');
  want(st.face && /\[프사\] 가짜민지 — 빨간 동그라미/.test(st.read), '판독문 끝에 [프사] 줄');
  await p.evaluate(() => { S.nodes.push({ id: 'n7', kind: 'person', title: '없는사람', note: '', x: 900, y: 900, r: 0 }); renderNodes(); });
  const f0 = await p.evaluate(() => window.__face); await p.evaluate(() => faceAuto()); await p.waitForTimeout(800);
  want(await p.evaluate(f0 => window.__face === f0 && !nodeOf('n7').face, f0), '판독문에 이름이 안 나오는 사람은 묻지도 않음');
  await p.evaluate(() => { const bt = document.createElement('button'); bt.dataset.unface = 'n6'; document.body.appendChild(bt); bt.addEventListener('click', () => { delete nodeOf('n6').face; }); bt.click(); bt.remove(); nodeOf('n6').faceTried = []; });
  await p.evaluate(() => faceAuto()); await p.waitForTimeout(1500);
  want(await p.evaluate(() => !nodeOf('n6').face && nodeOf('n6').faceNo === 1), '「이 사진 빼기」 한 카드엔 다시 안 붙임');
  const pr = await p.evaluate(() => window.__c.filter(c => c.p.includes('사진시험'))[0].p);
  want(pr.includes('[프사] 이름 — 보이는 것') && pr.includes('앱이 그 캡처에서 찾아 붙이니') && pr.includes('사진을 따로 청하지 않고') && /\(얼굴 없음\)|\(얼굴: /.test(pr), '프롬프트: 판독에 [프사] 줄 · 얼굴은 앱이 붙이니 사진을 청하지 않음(원칙 2) · 판 글에 얼굴 상태');
  want(pr.includes('글자를 바꾸지 않는다') && pr.includes('look 으로 원본까지 본 뒤'), '프롬프트: 글자 그대로 · 없다 전 원본(원칙 1 근거 — 11-17 B 통일 규칙)');

  console.log('— 자료 형편 — 물었는데 답 없이 넘어가면');
  st = await p.evaluate(() => ({ asked: S.moreAsked, closed: S.closed }));
  await send('흠 그렇군'); await idle();
  st = await p.evaluate(() => ({ closed: S.closed, bar: !document.querySelector('#nbMode').hidden, pr: window.__c.filter(c => c.p.includes('흠 그렇군')).pop().p }));
  want(st.closed === true && st.bar && st.pr.includes('[자료 형편 — 닫힘'), '「더 구해 올 수 있나」에 답 없이 넘어가면 닫힘(있는 것부터)');

  console.log('— 「자료에 없다」 전에 원본');
  await send('프사 다시 봐 닉시험'); await idle();
  st = await p.evaluate(() => { const cs = window.__c.filter(c => c.p.includes('닉시험')); return { n: cs.length, k: cs[1] && cs[1].k, ids: (cs[1] && cs[1].p.match(/원본 (e\d[^ ]*) 을/) || [])[1], lines: [...document.querySelectorAll('#chat .msg.m')].map(e => e.textContent) }; });
  want(st.n === 2 && st.k > 0 && st.k <= 4, '「자료에선 안 보인다」면 앱이 원본을 붙여 한 번 더 물음 (그림 ' + st.k + '장, ' + st.ids + ')');
  want(st.ids && st.ids.startsWith('e1'), '그 말이 짚은 카드의 원본부터');
  want(st.lines.some(t => t.includes('원본을 다시 본다')) && st.lines.some(t => t.includes('다시 보니 프사가 있다')) && !st.lines.some(t => t.includes('자료에선 안 보인다')), '한마디 뒤 고친 답만 나옴');

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `\n실패 ${bad}` : '\n전부 통과'); process.exit(bad ? 1 : 0);
})();
