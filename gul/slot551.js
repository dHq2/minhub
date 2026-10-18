const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(400);
  await p.evaluate(()=>showTab('fight')); await p.click('#stepBtn'); await p.waitForTimeout(300);
  // 노먼이 궁수를 쏘는 중 (점사) · 레베카 피 4 · 노먼 피 40 · 레베카는 4칸 넘게 떨어짐
  console.log(await p.evaluate(()=>{ const W=world, N=W.units.find(u=>u.name==='노먼'), Rb=W.units.find(u=>u.name==='레베카'), T=W.units.find(u=>u.name==='궁수');
    N.skill.cdT=-9; N.order={k:'attack',b:T.i}; let k=0; while(!(N.act&&N.act.k==='atk'&&N.act.phase==='wind')&&k++<300) stepWorld(W,1/30);
    Rb.hp=4; N.hp=40; return 'N act '+(N.act&&N.act.k+'/'+N.act.phase)+' dist '+Math.hypot(N.x-Rb.x,N.y-Rb.y).toFixed(1)+' t '+W.t.toFixed(2); }));
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='노먼').i]); hud(); });
  await p.keyboard.press('4'); await p.waitForTimeout(50);
  const R = await p.evaluate(()=>{ const e=world.units.find(u=>u.name==='레베카'); const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(e.x-cam.x)*ts+r.width/2, y:r.top+(e.y-cam.y)*ts+r.height/2}; });
  await p.mouse.click(R.x, R.y); await p.waitForTimeout(150);
  console.log('after order', await p.evaluate(()=>{ const N=world.units.find(u=>u.name==='노먼'); return JSON.stringify({order:N.order, act:N.act&&N.act.k, ack: world.fx.filter(f=>f.k==='ack').map(f=>f.s), toast: (document.querySelector('.toast')||{}).textContent, slot4: [...document.querySelectorAll('#orders [data-slot]')].map(x=>x.textContent.trim())[3] }); }));
  await p.screenshot({path:'s551-order.png'});
  console.log(await p.evaluate(()=>{ const W=world, N=W.units.find(u=>u.name==='노먼'), Rb=W.units.find(u=>u.name==='레베카'); const out=[]; let shot=false;
    for (let k=0;k<120;k++){ stepWorld(W,1/30); if (!shot && N.act && N.act.k==='skill'){ shot=true; out.push('skill wind at '+W.t.toFixed(2)); } }
    out.push(W.log.filter(l=>l.a===N.i&&['cancel','skill','wind','order'].includes(l.k)).slice(-5).map(l=>l.t+':'+l.k+(l.b!=null?'>'+W.units[l.b].name:'')+(l.was?'('+l.was+')':'')).join(' '));
    out.push('Rb hp '+Math.round(Rb.hp)); return out.join('\n'); }));
  // 준비 띠 화면
  await p.evaluate(()=>{ const W=world, N=W.units.find(u=>u.name==='노먼'), T=W.units.find(u=>u.name==='궁수'); N.order={k:'attack',b:T.i}; let k=0; while(!(N.act&&N.act.phase==='wind')&&k++<200) stepWorld(W,1/30); stepWorld(W,0.1); });
  await p.waitForTimeout(200);
  const cv = await p.$('#cv'); await cv.screenshot({path:'s551-bar.png'});
  // 쓰러진 레베카 표시
  console.log(await p.evaluate(()=>{ const W=world, Rb=W.units.find(u=>u.name==='레베카'), e=W.units.find(u=>u.side===1&&u.alive); applyDmg(W,e,Rb,Rb.hp+3,{ff:false,far:false,part:'몸통'}); stepWorld(W,1); hud(); return 'down '+Rb.down+' hp '+Rb.hp.toFixed(1)+' card '+([...document.querySelectorAll('.at')].map(x=>x.textContent).find(t=>/불사/.test(t))||''); }));
  await p.waitForTimeout(200); await cv.screenshot({path:'s551-down.png'});
  console.log('errors', errs); await b.close(); })();
