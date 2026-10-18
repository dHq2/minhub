// 옛 판 카리우스 (사용자 판과 같은 꼴: 도감 원본 · 5등급 · 방패 · 검 · 특성 빈 칸) → 정체성만 되돌리고 장비 · 등급은 그대로
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  await p.evaluate(()=>{ for (const ref of ['C-003','C-002']){ const i = S.units.findIndex(u=>u.ref===ref); const raw = unitFromRef0(ref, 0, { nv:false }); raw.traits = []; if (ref==='C-003'){ raw.tier = 5; raw.role = '전선'; } else raw.role = '전선'; raw.x = S.units[i].x; raw.y = S.units[i].y; S.units[i] = raw; } save(); });
  await p.reload(); const seen = []; for (let k=0;k<15;k++){ await p.waitForTimeout(100); const t = await p.evaluate(()=>document.getElementById('toast').textContent); if (t && !seen.includes(t)) seen.push(t); }
  console.log('toast', JSON.stringify(seen));
  console.log(await p.evaluate(()=>S.units.filter(u=>['C-002','C-003'].includes(u.ref)).map(u=>`${u.name}: ${u.tier}등급 · ${u.weapon}${u.shield?'+방패':''} · 특성[${(u.traits||[]).join(',')}] · 고유[${(u.unique||[]).join(',')}] · 액티브[${(u.active||[]).join(',')}]`).join('\n')));
  await p.evaluate(()=>start()); await p.waitForTimeout(200);
  console.log(await p.evaluate(()=>world.units.filter(u=>['C-002','C-003'].includes(u.ref)).map(u=>`${u.name} 엔진: hp${u.max} 불사${u.undying?1:0} 재생${u.regen} 거구${u.giant?1:0} 머리${u.heads} 개조${u.modBody?1:0} 돌진${u.canCharge?1:0} 방패${u.shield?1:0}`).join('\n')));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
