// 마틴 점검 — 자료 사진 원래 색 v1.0 (2026-11-16, C)
// 확인: 판의 사진 카드 · 인물 프사 · 대화 썸네일 · 첨부 칩 · 인물 서랍 프사에 흑백·세피아 보정이 없다(filter none)
// 쓰는 법: bash martin/tests/run.sh color   (스크린샷 /tmp/martin-색.png — 사진이 원래 색으로 보이는지 직접 연다)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const PIC = 'data:image/webp;base64,' + fs.readFileSync(path.join(__dirname, '..', 'img', 'martin.webp')).toString('base64');   /* 색이 있는 그림이면 무엇이든 — 가짜 자료 */
const MOCK = () => { window.claude = { use: async n => {
  if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
  f.json = async () => ({ say: ['봐라.'] }); return f; } }; };
const SEED = { v: 3, id: '20261116-color', at: 1, turn: 2, nid: 8, nmax: 0, suspect: null, notes: [], memo: [], links: [{ a: 'n3', b: 'n7', id: 'n3-n7', label: '사진', sure: true }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 900, r: 0 },
    { id: 'n3', kind: 'person', title: '김지민', note: '실종자', x: 900, y: 1150, r: 1, face: PIC, faceFrom: 'n7' },
    { id: 'n7', kind: 'photo', title: '편의점 캡처', note: '22:41', x: 1120, y: 1150, r: -1, thumb: PIC }],
  log: [{ who: 'p', text: '이거 봐', photos: ['n7'], files: [], at: 1 }, { who: 'm', text: '하! 사진이군.', at: 2 }] };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('seeded')){ localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('seeded', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(2500);
  const f = sel => p.evaluate(s => { const e = document.querySelector(s); return e ? getComputedStyle(e).filter : '(없음)'; }, sel);
  for (const [sel, what] of [['.k-photo img', '판의 사진 카드'], ['.k-person .ph img', '인물 프사'], ['.k-person .ph', '인물 프사 틀'], ['#chat .msg .ph img', '대화 썸네일']]){
    const v = await f(sel); want(v === 'none', `${what} 보정 없음 (${v})`); }
  await p.setInputFiles('#fileAny', { name: '자료.webp', mimeType: 'image/webp', buffer: fs.readFileSync(path.join(__dirname, '..', 'img', 'martin.webp')) }); await p.waitForTimeout(1500);
  const cv = await f('.chip img'); want(cv === 'none', `첨부 칩 보정 없음 (${cv})`);
  await p.screenshot({ path: '/tmp/martin-색.png' });
  await p.evaluate(() => cardSheet('n3')); await p.waitForTimeout(700);
  const sv = await p.evaluate(() => { const i = [...document.querySelectorAll('img')].find(x => x.src.startsWith('data:image/webp') && x.style.width === '120px'); return i ? getComputedStyle(i).filter : '(서랍 프사 못 찾음)'; });
  want(sv === 'none', `인물 서랍 프사 보정 없음 (${sv})`);
  await p.screenshot({ path: '/tmp/martin-색-서랍.png' });
  want(!errs.length, '페이지 오류 없음 ' + errs.join(' / '));
  await b.close(); process.exit(bad ? 1 : 0);
})();
