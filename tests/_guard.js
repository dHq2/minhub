// 테스트 공통 감시 — v1.1 (2026-11-15 A: 처음 인사 프롤로그는 끔 — sehee.nointro, tintro 만 다시 켬). v1.0. run.sh 가 node --require 로 먼저 불러온다.
// 모든 브라우저 탭의 페이지 오류(pageerror)를 모아서, 끝날 때 'GUARD errors [...]' 한 줄로 찍는다. run.sh 는 이 줄로 통과를 판정.
const pw = require('playwright'); const errs = [];
const watch = p => p.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
const orig = pw.chromium.launch.bind(pw.chromium);
pw.chromium.launch = async (...a) => { const b = await orig(...a);
  const nc = b.newContext.bind(b); b.newContext = async (...x) => { const c = await nc(...x); c.on('page', watch); await c.addInitScript(() => { try{ if (!sessionStorage.getItem('intro.on')) localStorage.setItem('sehee.nointro', '1'); }catch(e){} }); return c; };
  const np = b.newPage.bind(b); b.newPage = async (...x) => { const p = await np(...x); watch(p); await p.addInitScript(() => { try{ localStorage.setItem('sehee.nointro', '1'); }catch(e){} }); return p; };
  return b; };
process.on('exit', () => console.log('GUARD errors ' + JSON.stringify(errs)));
