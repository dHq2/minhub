// v5.9.3: 부채 ▬ 전열 = 바로 참여 · 후퇴 기록 · 뒷줄 그림
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  const cdp = await ctx.newCDPSession(p); const T = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const tapSel = async (sel) => { const r = await p.evaluate(s=>{ const e=document.querySelector(s); const q=e.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2}; }, sel); await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(150); };
  const pos = n => p.evaluate(n=>{ const u=world.units.find(u=>u.name===n); return {x:u.x,y:u.y}; }, n);
  await tapSel('#dPlay [data-dk="start"]'); await p.waitForTimeout(300);
  // 인주를 꾹 → 전열
  let q = await scr(...Object.values(await pos('인주'))); await T('touchStart', q.x, q.y); await p.waitForTimeout(550);
  const a = await p.evaluate(()=>focus.items.find(i=>i.k==='line').a); await T('touchMove', q.x + Math.cos(a*Math.PI/180)*80, q.y + Math.sin(a*Math.PI/180)*80); await p.waitForTimeout(80); await T('touchEnd'); await p.waitForTimeout(150);
  console.log('인주 부채 전열 →', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='인주').order)), '| 켜짐', await p.evaluate(()=>!!armed), '| toast', await p.evaluate(()=>document.getElementById('toast').textContent));
  // 진행: 2초 → 전열 · 뒷줄
  await p.evaluate(()=>{ cont=true; nextTurn(); for (let k=0;k<60;k++) stepWorld(world,1/30); draw(); });
  console.log('전열', await p.evaluate(()=>(world.lines||[]).filter(l=>l.side===0).map(l=>l.ids.map(i=>world.units[i].name).join('·')+' 뒷줄['+(l.rear||[]).map(r=>world.units[r.i].name).join(',')+']').join(' / ')));
  await p.screenshot({path:'m10-line.png'});
  // 레베카 뒤로 이동 (유저 지휘) → 후퇴 기록
  await p.evaluate(()=>{ const R=world.units.find(u=>u.name==='레베카'); sel=new Set([R.i]); groupMove([R], R.x, Math.min(S.H-0.5, R.y+2.5), 'move'); for (let k=0;k<30;k++) stepWorld(world,1/30); });
  console.log('후퇴 기록', await p.evaluate(()=>logLines(world,0).filter(l=>/전열에서 빠짐|후퇴|뒷줄/.test(l)).slice(-3).join(' / ')));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
