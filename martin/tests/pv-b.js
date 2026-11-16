// 사진 크게 보기 위아래 정리 점검 v1.0 (2026-11-17, B). 폰 화면(412×915).
// 위 = 이름 한 줄 + × · 단추 줄(다시 읽혀·판독문·대화 숨기기) · 메모·판독문은 평소 숨김 → 「판독문」 누르면 사진 위에 펼침 · 펼친 칸을 눌러도 안 닫힘 · × 하면 접힘.
// 스크린샷 /tmp/martin-사진-b.png · /tmp/martin-사진-b-판독.png
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const SEED = { v: 3, id: '20261117-pvb', at: 1, nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 1000, r: 0 }], links: [], log: [], memo: [], turn: 2, nid: 10, suspect: null,
  ev: [{ id: 'e1', kind: 'photo', card: 'n9', title: '가짜 캡처', name: 'kakao.jpg', at: 1, turn: 1, read: '판독 — 방: 김지민 1:1 (가짜 카톡 캡처)\n2026년 11월 12일 목요일\n김지민: 그 서류 어디 있어?\n나: 몰라요\n'.repeat(4) }], evmax: 1 };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.claude = { use: async () => null }; });
  await p.addInitScript(s => { localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); localStorage.removeItem('drmartin.pvfull'); }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(2500);
  await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 300; c.height = 600; const g = c.getContext('2d'); g.fillStyle = '#9fb3c8'; g.fillRect(0, 0, 300, 600);
    S.nodes.push({ id: 'n9', kind: 'photo', title: '대표 카톡 11/12 밤 — 서류와 이름', note: '밤 「제 이름 쓰지 마세요」. 11/15 「카드는 덮겠다, 서류만」', x: 1100, y: 1100, r: 0, mid: c.toDataURL() }); renderAll(); openPv('n9'); });
  await p.waitForTimeout(700);
  const g = await p.evaluate(() => { const t = $('#pvT').getBoundingClientRect(), x = $('#pvX').getBoundingClientRect(), r = $('#pvR').getBoundingClientRect(), s = $('#pvS').getBoundingClientRect();
    return { tTop: Math.round(t.top), xTop: Math.round(x.top), rTop: Math.round(r.top), tw: Math.round(t.width), lines: Math.round(t.height / parseFloat(getComputedStyle($('#pvT')).lineHeight || 20)), note: getComputedStyle($('#pvN')).display, sh: Math.round(s.height), title: $('#pvT').textContent }; });
  want(g.title.startsWith('대표 카톡') && g.tw > 300, `위 줄은 이름만 — 넓게 ${g.tw}px 「${g.title}」`);
  want(Math.abs(g.tTop - g.xTop) < 14 && g.rTop > g.tTop + 20, `× 는 이름 옆, 단추는 그 아래 줄 (이름 ${g.tTop} · × ${g.xTop} · 단추 ${g.rTop})`);
  want(g.note === 'none', `메모·판독문은 평소 안 보임 (${g.note})`);
  await p.screenshot({ path: '/tmp/martin-사진-b.png' });
  await p.click('#pvD'); await p.waitForTimeout(250);
  const d = await p.evaluate(() => { const n = $('#pvN'), r = n.getBoundingClientRect(), s = $('#pvS').getBoundingClientRect(); return { show: getComputedStyle(n).display, txt: n.textContent, h: Math.round(r.height), sh: Math.round(s.height), btn: $('#pvD').textContent, top: Math.round(r.top), topBar: Math.round($('#pv .pv-top').getBoundingClientRect().bottom) }; });
  want(d.show === 'block' && d.txt.includes('마틴의 판독') && d.txt.includes('카드 메모'), '「판독문」 누르면 전사본·메모가 펼쳐짐');
  want(d.h > d.sh * .7 && d.top >= d.topBar, `사진 위를 넓게 덮음 (칸 ${d.h} / 사진 자리 ${d.sh}) · 위 줄은 안 가림`);
  want(d.btn === '판독문 닫기', `단추 글이 바뀜 「${d.btn}」`);
  await p.screenshot({ path: '/tmp/martin-사진-b-판독.png' });
  await p.mouse.click(206, d.top + 60); await p.waitForTimeout(400);
  want(await p.evaluate(() => $('#pv').classList.contains('on') && $('#pv').classList.contains('doc')), '펼친 판독문을 눌러도 사진 보기는 그대로');
  await p.click('#pvD'); await p.waitForTimeout(200);
  want(await p.evaluate(() => getComputedStyle($('#pvN')).display === 'none'), '다시 누르면 접힘');
  await p.click('#pvD'); await p.click('#pvX'); await p.waitForTimeout(200);
  want(await p.evaluate(() => !$('#pv').classList.contains('doc') && $('#pvD').textContent === '판독문'), '× 로 닫으면 판독문도 접힘');
  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); if (bad){ console.log(`실패 ${bad}`); process.exit(1); } console.log('전부 통과');
})();
