// v5.9.1 빠르게 두 번: 적 = 빠르게 공격 (사수 바로 쏨 · 근접 서둘러) · 바닥 = 서둘러 이동
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700); await p.evaluate(()=>{ S.randStart = false; placeFloor('1층'); });
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const tapSel = async (sel) => { const r = await p.evaluate(s=>{ const e=document.querySelector(s); const q=e.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2}; }, sel); await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(150); };
  await tapSel('#dPlay [data-dk="start"]'); await p.waitForTimeout(300);   // 0초 (멈춘 채)
  for (const who of ['노먼', '레베카']){
    const A = await p.evaluate(n=>{ const u=world.units.find(u=>u.name===n); return {x:u.x,y:u.y}; }, who); let q = await scr(A.x, A.y); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(120);
    const E = await p.evaluate(()=>{ const e=world.units.filter(u=>u.side===1&&u.alive&&u.seenBy).sort((a,b)=>a.y-b.y).pop(); return {x:e.x,y:e.y,n:e.name}; });
    q = await scr(E.x, E.y); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(90); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(150);
    console.log(who, '적 두 번 탭 →', E.n, await p.evaluate(n=>JSON.stringify(world.units.find(u=>u.name===n).order), who));
    q = await scr(E.x, E.y); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(800);
    const E2 = await p.evaluate(()=>{ const e=world.units.filter(u=>u.side===1&&u.alive&&u.seenBy).sort((a,b)=>a.y-b.y).pop(); return {x:e.x,y:e.y}; }); q = await scr(E2.x, E2.y); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(150);
    console.log(who, '적 한 번 탭 (0.8초 뒤 다시 한 번) →', await p.evaluate(n=>JSON.stringify(world.units.find(u=>u.name===n).order), who));
  }
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
