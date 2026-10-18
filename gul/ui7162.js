// v7.16.2 UI 시험 — ui7162.js v1 (카리우스 체력 700: 옛 저장 (빈 칸 · 5성 · 1265) · 내 설계 · 내 층 → 한 번 700 · 체력 칸이 빈 설계도 700 · 판 시작 · 그 뒤 손으로 바꾼 값은 그대로)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+process.cwd()+'/build/wrapped.html';
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 // 옛 저장을 흉내: 판의 카리우스 = 체력 칸 없음 · 5성, 내 설계 = 1265, 내 층 = 450 없이 빈 칸
 await p.evaluate(()=>{ const k=S.units.find(u=>u.ref==='C-003'); k.ov={atk:40,rng:0.6}; k.tier=5; delete S.v7162k; save();
   const d=JSON.parse(JSON.stringify(DESIGN_DEFAULTS.find(x=>x.key==='카리우스'))); d.ov={hp:1265,atk:40,rng:0.6}; saveMyDesigns([d]);
   const snap={units:[{...JSON.parse(JSON.stringify(k)),ov:{atk:40}}]}; saveMyFloors([{name:'옛 층',snap}]); });
 await p.reload(); await p.waitForTimeout(1600);
 const r = await p.evaluate(()=>{ const k=S.units.find(u=>u.ref==='C-003'), d=myDesigns().find(x=>x.ref==='C-003'), f=myFloors()[0].snap.units[0];
   const t=document.getElementById('toast').innerText; start(); const w=world.units.find(u=>u.ref==='C-003');
   const nd=fromDesign({key:'시험',ref:'C-003',side:0,name:'카리우스'},0), nr=unitFromRef('C-003',0,{});
   return { saved: k.ov.hp+' 등급 '+k.tier, design: d&&d.ov.hp, floor: f.ov.hp, max: w.max+'/'+w.hp, toast: t, blank: nd.ov.hp, ref: nr.ov.hp, flag: !!S.v7162k }; });
 console.log('    ', JSON.stringify(r));
 ok(r.saved==='700 등급 2','저장된 판의 카리우스 (빈 칸 · 5성) → 700 · 등급 2'); ok(r.design===700,'내 설계의 1265 → 700'); ok(r.floor===700,'내 층의 빈 칸 → 700');
 ok(r.max==='700/700','판을 시작하면 700/700'); ok(/카리우스 체력을 700/.test(r.toast),'알림 '+r.toast); ok(r.blank===700&&r.ref===700,'체력 칸이 빈 설계 · 도감에서 놓아도 700');
 // 한 번만: 그 뒤 손으로 바꾼 값은 그대로
 await p.evaluate(()=>{ editMode && editMode(); }).catch(()=>{});
 await p.evaluate(()=>{ const k=S.units.find(u=>u.ref==='C-003'); k.ov.hp=650; save(); }); await p.reload(); await p.waitForTimeout(1200);
 const h2 = await p.evaluate(()=>S.units.find(u=>u.ref==='C-003').ov.hp); ok(h2===650,'그 뒤 손으로 바꾼 값 (650) 은 그대로 '+h2);
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 console.log(fails?`${fails} FAIL`:'ALL UI7162 OK'); await b.close(); })();
