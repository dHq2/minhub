const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx = await b.newContext({viewport:{width:915,height:412}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  await p.evaluate(()=>{ start(); }); await p.waitForTimeout(400);
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const R = await p.evaluate(()=>{ const u=world.units.find(u=>u.name==='레베카'); return {x:u.x,y:u.y}; }); const pr = await scr(R.x,R.y); await p.touchscreen.tap(pr.x,pr.y); await p.waitForTimeout(150);
  console.log('land', JSON.stringify(await p.evaluate(()=>({land:document.body.classList.contains('land'), view:document.getElementById('view').getBoundingClientRect().toJSON(), dock:document.getElementById('dock').getBoundingClientRect().toJSON(), narrBot: Math.round(document.getElementById('narr').getBoundingClientRect().bottom), z:+cam.z.toFixed(2), sel:[...sel].length, over: document.documentElement.scrollWidth>innerWidth+1, docH: document.documentElement.scrollHeight}))));
  await p.screenshot({path:'m4-land.png'});
  // 세로로 돌림
  await p.setViewportSize({width:412,height:915}); await p.waitForTimeout(400);
  console.log('portrait', JSON.stringify(await p.evaluate(()=>({land:document.body.classList.contains('land'), viewH:Math.round(document.getElementById('view').getBoundingClientRect().height), dockTop:Math.round(document.getElementById('dock').getBoundingClientRect().top), z:+cam.z.toFixed(2)}))));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
