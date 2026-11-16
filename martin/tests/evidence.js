// 자료함 점검 v1.0 (2026-11-16, A) — 원본 보관(올린 파일 그대로)·세로로 긴 캡처는 조각내 보내기·판독문 저장·[자료함] 프롬프트·look 다시 보기·합쳐도 원본 남음·갤러리 화면. 폰 화면.
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => {
  window.__calls = []; window.__up = [];
  const store = {};
  window.claude = { use: async n => {
    if (n === 'db') return { doc: p => ({ get: async () => ({ exists: p in store, data: () => JSON.parse(store[p]) }), set: async d => { store[p] = JSON.stringify(d); } }), collection: () => { const q = { orderBy: () => q, limit: () => q, get: async () => ({ docs: [] }) }; return q; } };
    if (n === 'assets') return { upload: async (b, o) => { window.__up.push([b.type, b.size, o && o.type]); return { id: 'a' + window.__up.length, sizeBytes: b.size }; } };
    if (n !== 'sample') return null;
    const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async (p, o) => { window.__calls.push({ p, n: (o.images || []).length }); await new Promise(r => setTimeout(r, 80));
      if (p.includes('손질됐다')) return { say: ['판을 손봤다.'] };
      const k = window.__calls.filter(c => !c.p.includes('손질됐다')).length;
      if (k === 1) return { say: ['자료 셋이다.'], ops: [{ op: 'edit', id: 'n2', title: '긴 캡처' }, { op: 'edit', id: 'n3', title: '넓은 사진' }],
        read: [{ id: 'e1', t: '방: 가짜상사 전체 4\n김지민(23:02): 열쇠 반납' }, { id: 'e2', t: '사무실 책상 사진. 둘째 서랍이 열려 있다.' }, { id: 'e3', t: '붙여 넣은 대화 — 박팀장과 지민' }] };
      if (k === 2) return { say: ['기억이 흐릿하다.'], look: ['e1'], lookLine: '잠깐. 그 긴 캡처를 다시 본다.' };
      return { say: [{ t: '그래. 23:20에 한 줄이 더 있었다.', on: 'n2', beat: 'look' }], read: [{ id: 'e1', t: '방: 가짜상사 전체 4\n김지민(23:02): 열쇠 반납\n김지민(23:20): 복사본은 제가' }], ops: [{ op: 'merge', from: 'n3', into: 'n2' }] }; };
    return f; } };
};
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK); await p.addInitScript(() => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } });
  await p.goto(URL); await p.waitForTimeout(3000);
  const png = async (w, h, label) => Buffer.from((await p.evaluate(([w, h, label]) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#000'; x.font = '40px sans-serif'; for (let y = 60; y < h; y += 120) x.fillText(label + ' ' + y, 40, y); return c.toDataURL('image/png'); }, [w, h, label])).split(',')[1], 'base64');
  await p.locator('#fileImg').setInputFiles([{ name: 'long.png', mimeType: 'image/png', buffer: await png(1000, 4000, '긴') }, { name: 'wide.png', mimeType: 'image/png', buffer: await png(1200, 800, '넓') }]);
  await p.waitForTimeout(1500);
  await p.click('#msg'); await p.keyboard.type('[김지민] [오후 11:02] 열쇠 반납했어요\n'.repeat(1) + '그날 대화도 붙인다. '.repeat(20)); await p.keyboard.press('Enter');
  await p.waitForFunction(() => !busy && S.turn >= 1, null, { timeout: 30000 }); await p.waitForTimeout(500);
  let st = await p.evaluate(() => ({ ev: S.ev.map(e => [e.id, e.kind, e.card, !!e.read, e.asset || '', e.len || 0]), n: window.__calls.filter(c => !c.p.includes('손질됐다'))[0].n, up: window.__up, raw: localStorage.getItem('drmartin.ev.' + S.id + '.e3') || '' }));
  want(st.ev.length === 3 && st.ev[2][1] === 'text', '자료함 3건(사진 2·글 1) ' + JSON.stringify(st.ev));
  want(st.n === 4, '긴 캡처는 3조각 + 넓은 사진 1장 = 마틴에게 4장 → ' + st.n);
  want(st.up.length === 2 && st.up.every(u => u[0] === 'image/png'), '보관함엔 올린 파일 그대로(png) ' + JSON.stringify(st.up));
  want(st.ev.every(e => e[3]), '판독문 3건 저장');
  want(st.raw.includes('열쇠 반납'), '붙여 넣은 글 원문 보관');
  await p.click('#msg'); await p.keyboard.type('그 캡처 끝에 뭐가 있었지?'); await p.keyboard.press('Enter');
  await p.waitForFunction(() => !busy && S.turn >= 2, null, { timeout: 30000 }); await p.waitForTimeout(600);
  st = await p.evaluate(() => { const cs = window.__calls.filter(c => !c.p.includes('손질됐다')); return { second: cs[1].p.includes('[자료함') && cs[1].p.includes('e1 사진') && cs[1].p.includes('열쇠 반납'), third: cs[2] && cs[2].p.includes('[다시 보기'), n3: cs[2] && cs[2].n, read: S.ev[0].read, ev: S.ev.map(e => e.card), nodes: S.nodes.map(n => n.id), lines: S.log.filter(l => l.who === 'm').slice(-2).map(l => l.text) }; });
  want(st.second, '다음 턴 프롬프트에 [자료함]과 판독문');
  want(st.third && st.n3 === 3, 'look → 원본(3조각) 붙여 다시 묻기 ' + st.n3);
  want(st.read.includes('복사본은 제가'), '판독문 고쳐 씀');
  want(!st.nodes.includes('n3') && st.ev[0] === 'n2' && st.ev[1] === 'n2', '카드를 합쳐도 원본 둘 다 자료함에 ' + JSON.stringify(st.ev));
  want(st.lines.join('|').includes('다시 본다'), '다시 보기 한마디 ' + st.lines.join('|'));
  await p.click('#btnEv'); await p.waitForTimeout(500);
  want(await p.evaluate(() => [document.querySelectorAll('.evg .evc').length, document.querySelectorAll('.evt').length].join()) === '2,1', '갤러리: 사진 2 · 글 1');
  await p.screenshot({ path: '/tmp/martin-evidence.png' });
  await p.locator('.evg .evc').last().click(); await p.waitForTimeout(700);
  want(await p.evaluate(() => $('#pv').classList.contains('on') && $('#pvN').textContent.includes('판독')), '누르면 원본 + 판독문');
  await p.screenshot({ path: '/tmp/martin-evidence-pv.png' });
  await p.click('#pvX'); await p.click('#btnEv'); await p.waitForTimeout(300); await p.locator('.evt').first().click(); await p.waitForTimeout(500);
  want((await p.evaluate(() => $('#evRaw').textContent)).includes('열쇠 반납'), '글 자료 원문 보기');
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
