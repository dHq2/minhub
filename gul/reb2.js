// v5.8.1: 옛 판의 레베카 (v5.2 전 도감 기본값) → 정체성 되돌림
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  // 사용자의 옛 저장을 흉내: 레베카를 도감 원본 그대로 (프로필 없이) 넣고 저장 → 새로 읽기
  await p.evaluate(()=>{ const i = S.units.findIndex(u=>u.ref==='C-002'); const raw = unitFromRef0('C-002', 0, { nv:false }); raw.traits = []; raw.role = '전선'; raw.x = S.units[i] ? S.units[i].x : 5.5; raw.y = S.units[i] ? S.units[i].y : 6.5; if (i>=0) S.units[i] = raw; else S.units.push(raw); save(); });
  console.log('saved raw', await p.evaluate(()=>{ const u=S.units.find(u=>u.ref==='C-002'); return JSON.stringify({shield:u.shield, role:u.role, traits:u.traits, tactic:u.tactic||null}); }));
  await p.reload(); await p.waitForTimeout(900);
  console.log('after load', await p.evaluate(()=>{ const u=S.units.find(u=>u.ref==='C-002'); return JSON.stringify({shield:u.shield, role:u.role, weapon:u.weapon, traits:u.traits, nv:u.nv, nvG:u.nvG, gear:Object.keys(u.gear||{})}); }), '| toast', await p.evaluate(()=>document.getElementById('toast').textContent));
  await p.evaluate(()=>start()); await p.waitForTimeout(200);
  console.log('in battle', await p.evaluate(()=>{ const u=world.units.find(u=>u.ref==='C-002'); return JSON.stringify({undying:u.undying, regen:u.regen, max:u.max, shield:u.shield, role:u.role}); }));
  // 편집기에서 [불사] 빼기 시도
  await p.evaluate(()=>{ resetToEdit(); const u=S.units.find(u=>u.ref==='C-002'); selId=u.id; renderSel(); });
  await p.waitForTimeout(100);
  console.log('editor', await p.evaluate(()=>{ const c=document.getElementById('tr-불사'), r=document.getElementById('tr-재생'); return c ? 'disabled '+c.disabled+' checked '+c.checked+' / 재생 '+(r&&r.disabled) : 'no checkbox'; }));
  // 도감에서 새로 뽑은 레베카
  console.log('fresh', await p.evaluate(()=>JSON.stringify(unitFromRef('C-002', 0, { nv:false }).traits)), 'design', await p.evaluate(()=>JSON.stringify(fromDesign(designByKey('레베카'), 0).traits)));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
