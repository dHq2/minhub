// 판 사진 점검 v1.1 (2026-11-17, C — v1.1: 저장 단추가 아티팩트에선 downloads 저장 창으로) · v1.0 (2026-11-16, A) — 「판 사진」: 판 전체를 화면 배율과 상관없이 고화질 PNG 로 · 카드·실·코르크가 그림에 들어감 · 고른 카드 테두리는 안 찍힘 · 저장 링크 · 복사. 폰 화면.
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const SEED = { v: 3, id: '20261116-shot', at: 1, nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사진 사건', note: '', x: 1000, y: 820, r: 0 }, { id: 'n3', kind: 'person', title: '김지민', note: '총무', x: 700, y: 1050, r: 2 }, { id: 'n4', kind: 'clue', title: '열쇠', note: '반납', x: 1500, y: 1100, r: -3 }, { id: 'n5', kind: 'doc', title: '경비 일지', note: '23:20 출입', x: 1200, y: 1300, r: 4 }],
  links: [{ id: 'n4-n3', a: 'n4', b: 'n3', label: '반납', sure: true }, { id: 'n5-n4', a: 'n5', b: 'n4', label: '23:20', sure: false }], log: [{ who: 'p', text: '이전', at: 1 }], memo: [], notes: [], nmax: 0, turn: 2, nid: 6, suspect: null };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:8790' });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.claude = { use: async () => null }; });
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(3000);
  await p.evaluate(() => { selectCard('n3'); cam.k = 1.6; applyCam(0); });   // 확대해 둔 채로 찍어도 판 전체가 나와야
  const t0 = Date.now(); await p.click('#btnShot');
  await p.waitForSelector('.shotimg img', { timeout: 60000 }); await p.waitForFunction(() => document.querySelector('.shotimg img').naturalWidth > 0);
  const st = await p.evaluate(async () => { const im = document.querySelector('.shotimg img'); const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const B = shotBounds(), k = im.naturalWidth / B.w, px = (x, y) => [...g.getImageData(Math.round((x - B.l) * k), Math.round((y - B.t) * k), 1, 1).data];
    const n1 = nodeOf('n1'), n3 = nodeOf('n3'), L = document.querySelector('#xl .str').getPointAtLength(document.querySelector('#xl .str').getTotalLength() * .3);
    return { w: im.naturalWidth, h: im.naturalHeight, k: +k.toFixed(2), corner: px(B.l + 30, B.t + 40), brief: px(n1.x - 40, n1.y + 10), person: px(n3.x, n3.y + (n3.h || 150) / 2 - 12), head: px(n3.x, n3.y - (n3.h || 150) / 2 + 52), str: px(L.x, L.y), sel: document.querySelector('#nodes [data-id="n3"]').classList.contains('sel'), save: document.querySelector('#shotSave').getAttribute('download'), wraps: document.querySelectorAll('.shotwrap').length }; });
  console.log('      ', Math.round((Date.now() - t0) / 1000) + '초', JSON.stringify(st));
  want(st.k >= 2.5 && st.w > 2000, '고화질 — 판 1px 이 ' + st.k + 'px, ' + st.w + '×' + st.h);
  want(st.corner[3] === 255 && st.corner[0] > 40 && st.corner[0] < 200 && st.corner[0] > st.corner[1] && st.corner[1] > st.corner[2], '코르크(갈색) 바탕이 찍힘 ' + st.corner);
  want(st.brief[0] > 180 && st.brief[1] > 170, '사건 파일 카드(종이)가 찍힘 ' + st.brief);
  want(st.person[0] > 180, '인물 카드가 찍힘 ' + st.person);
  want(Math.abs(st.head[0] - st.head[1]) < 30, '인물 얼굴 그림은 원래 색(회색) ' + st.head);
  want(st.str[0] > 150 && st.str[1] < 80, '빨간 실이 빨갛게 찍힘 ' + st.str);
  want(st.sel && !st.wraps, '찍고 나면 화면은 그대로(고름 유지, 임시 틀 지움)');
  want(/^마틴-판-.*\.png$/.test(st.save), '저장 이름 ' + st.save);
  await p.screenshot({ path: '/tmp/martin-shot-sheet.png' });
  await p.click('#shotCopy'); await p.waitForTimeout(800);
  const msg = await p.evaluate(() => $('#shotMsg').textContent); want(/복사했다|막혀/.test(msg), '복사 단추 ' + msg);
  /* 11-17 C: 저장 — 아티팩트(가짜 downloads)에선 링크 대신 저장 창으로, 이름·PNG 그대로 */
  await p.evaluate(() => { window.__saved = null; const u = window.claude.use; window.claude.use = async n => n === 'downloads' ? { save: async o => { window.__saved = { name: o.filename, type: o.data.type, size: o.data.size }; } } : u(n); });
  await p.click('#shotSave'); await p.waitForTimeout(600);
  const sv = await p.evaluate(() => ({ s: window.__saved, msg: $('#shotMsg').textContent }));
  want(sv.s && /^마틴-판-.*\.png$/.test(sv.s.name) && sv.s.type === 'image/png' && sv.s.size > 50000 && /저장했다/.test(sv.msg), '저장 단추 → 아티팩트 저장 창(downloads) ' + JSON.stringify(sv));
  await p.evaluate(() => { window.claude.use = async n => n === 'downloads' ? { save: async () => { const e = new Error('no'); e.code = 'declined'; throw e; } } : null; });
  await p.click('#shotSave'); await p.waitForTimeout(400);
  want(/그만뒀다/.test(await p.evaluate(() => $('#shotMsg').textContent)), '저장 창에서 그만두면 그렇다고 알림');
  const img = await p.evaluate(async () => { const im = document.querySelector('.shotimg img'); const r = await fetch(im.src); const b = await r.blob(); return [...new Uint8Array(await b.arrayBuffer())].slice(0, 0).length || b.size; });
  require('fs').writeFileSync('/tmp/martin-shot.png', Buffer.from(await p.evaluate(async () => { const r = await fetch(document.querySelector('.shotimg img').src); const a = new Uint8Array(await r.arrayBuffer()); let s = ''; for (let i = 0; i < a.length; i += 8192) s += String.fromCharCode(...a.subarray(i, i + 8192)); return btoa(s); }), 'base64'));
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
