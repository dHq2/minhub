// v6.6.2 궁수 [사격S]: 기본 판 · 옛 저장 옮겨 적기 · 상세정보 특성
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const a = await p.evaluate(()=>{ start(); return world.units.filter(u => u.name === '궁수' || u.name === '노먼').map(u => u.name + ' 솜씨 ' + u.marks).join(' · '); });
  await p.evaluate(()=>{ for (const u of S.units) if (u.ref === 'C-056') u.traits = (u.traits || []).filter(t => t !== '사격S'); delete S.v662a; save(); });
  await p.reload(); await p.waitForTimeout(800);
  const b2 = await p.evaluate(()=>{ start(); const A = world.units.find(u => u.name === '궁수'); A.seenBy = 1; hoverPid = A.pid; renderDetail(); return { traits: S.units.filter(u => u.ref === 'C-056').map(u => (u.traits || []).join('+')).join(','), marks: world.units.filter(u => u.name === '궁수').map(u => u.marks).join(','), det: (document.getElementById('det').textContent.match(/사격S[^·]{0,60}/) || ['(없음)'])[0] }; });
  console.log('기본 판:', a); console.log('옛 저장 →', JSON.stringify(b2)); console.log('errors', errs); await b.close(); })();
