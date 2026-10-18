// v6.6.1 궁수 속력: 기본 판 · 옛 저장 (sm 1.25) 옮겨 적기
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const a = await p.evaluate(()=>{ start(); return world.units.filter(u => u.name === '궁수' || u.name === '노먼').map(u => u.name + ' ' + u.spd).join(' · '); });
  await p.evaluate(()=>{ for (const u of S.units) if (u.ref === 'C-056') u.sm = 1.25; delete S.v661a; save(); });
  await p.reload(); await p.waitForTimeout(800);
  const b2 = await p.evaluate(()=>{ start(); return { sm: S.units.filter(u => u.ref === 'C-056').map(u => u.sm).join(','), spd: world.units.filter(u => u.name === '궁수').map(u => u.spd).join(','), flag: S.v661a }; });
  console.log('기본 판:', a); console.log('옛 저장 → ', JSON.stringify(b2)); console.log('errors', errs); await b.close(); })();
