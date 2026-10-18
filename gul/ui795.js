const { chromium } = require('playwright'); const errs=[], fails=[]; const ok=(c,m)=>{ console.log((c?'  ok  ':'  FAIL ')+m); if(!c) fails.push(m); };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const ctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2, isMobile:true, hasTouch:true}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  // 옛 저장: 인주의 야시가 빠진 채 → 되돌림
  await p.evaluate(()=>{ const u=S.units.find(x=>x.name==='인주'); u.nv=false; u.nvG=''; S.v795nv=false; save(); }); await p.reload(); await p.waitForTimeout(1300);
  ok(await p.evaluate(()=>{ const u=S.units.find(x=>x.name==='인주'); return u.nv===true && u.nvG==='C'; }), '옛 저장의 인주 야시를 설계대로 되돌림');
  await p.evaluate(()=>start()); await p.waitForTimeout(300);
  const r = await p.evaluate(()=>{ const W=world, H=W.units[0], K=W.units[3]; K.x=H.x+1.4; K.y=H.y; for(let k=0;k<5;k++) stepWorld(W,1/30); K.order={k:'move',x:K.x+3,y:K.y}; noteOrders([K]); const P=K.ordPend; return P?{dt:+(P.at-W.t).toFixed(2),ok:P.ok,via:P.via}:{self:true}; });
  ok(r.self || (r.ok && r.dt<=0.2), '코앞 아군 명령은 바로 닿음 '+JSON.stringify(r));
  const r2 = await p.evaluate(()=>{ const W=world, H=W.units[0], N=W.units[1]; N.x=H.x+7.5; N.y=H.y; for(let k=0;k<5;k++) stepWorld(W,1/30); N.order={k:'move',x:N.x,y:N.y+2}; noteOrders([N]); const P=N.ordPend; return P?{dt:+(P.at-W.t).toFixed(2),p:+P.p.toFixed(2),via:P.via}:{}; });
  console.log('  먼 아군 (7.5칸)', JSON.stringify(r2));
  // 상세정보 시야 줄 · 지휘망 체크
  const det = await p.evaluate(()=>unitDetailHtml(world, world.units[0])); ok(/시야/.test(det)&&/야시 C/.test(det), '상세정보에 시야 줄 (야시 C · 횃불)');
  ok(await p.evaluate(()=>document.getElementById('netShow').checked), '지휘망 체크 기본 켬');
  // 횃불 켜면 은신 풀림
  const st = await p.evaluate(()=>{ const W=world, H=W.units[0]; H.stealth=true; torchSet(W,H,H.torchOff?true:false); H.torchOff=true; torchSet(W,H,true); for(let k=0;k<60;k++) stepWorld(W,1/30); return { stealth:H.stealth, torchOff:H.torchOff }; });
  ok(st.stealth===false, '횃불을 켜면 은신이 풀림 '+JSON.stringify(st));
  console.log('errors',JSON.stringify(errs)); console.log(fails.length?'FAILS '+fails.join(' | '):'ALL PASS'); await b.close(); })();
