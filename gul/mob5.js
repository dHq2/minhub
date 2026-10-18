// v5.8.2 기술 고리 (노트 20)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700); await p.evaluate(()=>{ S.randStart = false; placeFloor('1층'); });
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const tapU = async n => { const R = await p.evaluate(n=>{ const u=world.units.find(u=>u.name===n); return {x:u.x,y:u.y}; }, n); const q = await scr(R.x,R.y); await p.touchscreen.tap(q.x,q.y); await p.waitForTimeout(150); };
  const tapSel = async (sel) => { const r = await p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const q=e.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2}; }, sel); if(!r){ console.log('  !! no', sel); return; } await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(150); };
  const ring = () => p.evaluate(()=>{ const r=document.getElementById('ring'); return r.hidden ? 'closed' : [...r.querySelectorAll('.rb')].map(b=>b.dataset.rs+':'+b.textContent.trim()).join(' | '); });
  await tapSel('#dPlay [data-dk="start"]'); await p.waitForTimeout(400);
  for (const n of ['인주','노먼','레베카','카리우스']){ await tapU(n); console.log(n, '→ ring', await ring()); }
  // 인주: 투창 → 적 탭
  await tapU('인주'); console.log('인주 ring', await ring()); await p.screenshot({path:'m5-ring.png'});
  await tapSel('#ring [data-rs="2"]'); console.log('throwPick', await p.evaluate(()=>JSON.stringify(throwPick)), 'ring', await ring(), 'dock hint', await p.evaluate(()=>document.getElementById('dActs').innerText.slice(0,30)));
  const E = await p.evaluate(()=>{ const e=world.units.find(u=>u.side===1&&u.alive&&u.seenBy); return {x:e.x,y:e.y}; }); const q = await scr(E.x,E.y); await p.touchscreen.tap(q.x,q.y); await p.waitForTimeout(150);
  console.log('인주 order', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='인주').order)));
  // 노먼: 약 → 레베카 탭
  await tapU('노먼'); await tapSel('#ring [data-rs="4"]'); console.log('skillPick', await p.evaluate(()=>JSON.stringify(skillPick))); await tapU('레베카');
  console.log('노먼 order', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='노먼').order)), 'ring', await ring());
  // 같은 아군 다시 탭 = 닫힘 · 바닥 탭 = 이동하며 닫힘
  await tapU('카리우스'); const r1 = await ring(); await tapU('카리우스'); const r2 = await ring(); console.log('toggle', r1 !== 'closed', '→', r2);
  await tapU('카리우스'); const R = await p.evaluate(()=>{ const u=world.units.find(u=>u.name==='카리우스'); return {x:u.x,y:u.y}; }); const g = await scr(R.x+1.5, R.y-1); await p.touchscreen.tap(g.x,g.y); await p.waitForTimeout(150);
  console.log('ground', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='카리우스').order)), 'ring', await ring());
  // 재생 중 고리가 인물을 따라감
  await tapU('레베카'); await tapSel('#dPlay [data-dk="play"]'); await p.waitForTimeout(900);
  console.log('follow', await p.evaluate(()=>{ const r=document.getElementById('ring'), u=world.units.find(u=>u.name==='레베카'), ts=TS*cam.z; const m=r.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/); const ex=(u.x-cam.x)*ts+cv.clientWidth/2, ey=(u.y-cam.y)*ts+cv.clientHeight/2; return r.hidden ? 'closed' : 'dx '+(+m[1]-ex).toFixed(1)+' dy '+(+m[2]-ey).toFixed(1); }));
  await p.screenshot({path:'m5-run.png'});
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
