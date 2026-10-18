const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(500);
  console.log('edit mode bar hidden', await p.evaluate(()=>document.getElementById('skbar').hidden));
  await p.evaluate(()=>showTab('fight')); await p.waitForTimeout(300); await p.click('#stepBtn'); await p.waitForTimeout(2600);
  const txt = () => p.evaluate(()=>{ const el=document.getElementById('skbar'); return (el.hidden?'[hidden] ':'')+[...el.querySelectorAll('.who,.sk')].map(x=>x.innerText.replace(/\n/g,' ')+(x.classList.contains('on')?'(on)':'')+(x.classList.contains('ord')?'(ord)':'')).join(' | '); });
  console.log('no sel:', await txt());
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='노먼').i]); hud(); }); console.log('norman:', await txt());
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='인주').i]); hud(); }); console.log('injoo:', await txt());
  // 막대의 1 칸 누르기 → 돌진 고르는 중
  await p.click('#skbar [data-sk="1"]'); await p.waitForTimeout(80); console.log('after click 1:', await txt(), 'chargePick', await p.evaluate(()=>JSON.stringify(chargePick)));
  // 적 찍기
  const E2 = await p.evaluate(()=>{ const e=world.units.find(u=>u.side===1&&u.seenBy); const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return e?{x:r.left+(e.x-cam.x)*ts+r.width/2, y:r.top+(e.y-cam.y)*ts+r.height/2}:null; });
  if (E2){ await p.mouse.click(E2.x,E2.y); await p.waitForTimeout(100); console.log('after enemy click:', await txt()); }
  await p.click('#stepBtn'); await p.waitForTimeout(700); console.log('running:', await txt());
  await p.waitForTimeout(1800);
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='인주').i, world.units.find(u=>u.name==='레베카').i]); hud(); }); console.log('two:', await txt());
  await p.mouse.move(1430,890); await p.waitForTimeout(150);
  await p.screenshot({path:'s554.png'});
  await p.setViewportSize({width:400,height:860}); await p.waitForTimeout(400); await p.screenshot({path:'s554-phone.png'});
  console.log('errors', errs); await b.close(); })();
