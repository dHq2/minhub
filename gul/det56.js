const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(500); await p.evaluate(()=>{ S.randStart = false; placeFloor('1층'); });
  await p.evaluate(()=>showTab('fight')); await p.waitForTimeout(200); await p.click('#stepBtn'); await p.waitForTimeout(2600);
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const det = () => p.evaluate(()=>document.getElementById('det').innerText.split('\n').slice(0,4).join(' / '));
  console.log('layout', await p.evaluate(()=>['view','detail','side'].map(id=>{ const r=document.getElementById(id).getBoundingClientRect(); return id+':'+Math.round(r.left)+'+'+Math.round(r.width); }).join(' ')));
  console.log('empty:', await det());
  // 적 위에 커서
  const E = await p.evaluate(()=>{ const e=world.units.find(u=>u.side===1&&u.alive&&u.seenBy); return {x:e.x,y:e.y}; }); const pe = await scr(E.x,E.y);
  await p.mouse.move(pe.x,pe.y); await p.waitForTimeout(150); console.log('hover enemy:', await det(), '| floating tip hidden', await p.evaluate(()=>document.getElementById('tip').hidden));
  await p.mouse.move(5,5); await p.waitForTimeout(100);
  // 검방패기사를 쓰러뜨려 물건을 떨어뜨림 → 인주 고르고 방패 누르기
  await p.evaluate(()=>{ const W=world, S=W.units.find(u=>u.name==='검방패기사'), I=W.units.find(u=>u.name==='인주'); applyDmg(W,I,S,S.hp+1,{ff:false,far:false,part:'몸통'}); sel=new Set([I.i]); hud(); });
  console.log('items', await p.evaluate(()=>JSON.stringify(world.items.map(it=>it.k+':'+it.name+'@'+it.x+','+it.y))));
  console.log('selected injoo:', await det());
  const SH = await p.evaluate(()=>{ const it=world.items.find(x=>x.k==='shield'); return {x:it.x,y:it.y}; }); const ps = await scr(SH.x, SH.y);
  await p.mouse.move(ps.x, ps.y); await p.waitForTimeout(150); console.log('hover shield:', await det());
  await p.mouse.click(ps.x, ps.y); await p.waitForTimeout(100);
  console.log('order', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='인주').order)), 'ack', await p.evaluate(()=>world.fx.filter(f=>f.k==='ack').map(f=>f.s).join(',')), 'btn', await p.evaluate(()=>[...document.querySelectorAll('#orders [data-ord="pick"]')].map(x=>x.textContent).join(',')));
  await p.mouse.move(5,5); for (let k=0;k<4;k++){ await p.click('#stepBtn'); await p.waitForTimeout(2300); }
  console.log('dbg', await p.evaluate(()=>{ const I=world.units.find(u=>u.name==='인주'); return 'alive '+I.alive+' order '+JSON.stringify(I.order)+' t '+world.t.toFixed(1)+' items '+JSON.stringify(world.items.map(x=>x.id+x.k))+' logs '+world.log.filter(l=>(l.a===I.i)&&['order','pickItem','pickFail','cancel','charge','die'].includes(l.k)).map(l=>l.t+':'+l.k+(l.o?JSON.stringify(l.o):'')).join(' '); }));
  console.log('after turn: injoo shield', await p.evaluate(()=>{ const I=world.units.find(u=>u.name==='인주'); return I.shield+' '+I.chargeName+' | '+world.log.filter(l=>l.k==='pickItem').map(l=>world.units[l.a].name+':'+l.name).join(','); }));
  await p.evaluate(()=>{ document.querySelectorAll('.legend2').forEach(x=>x.hidden=true); });
  await p.screenshot({path:'s56.png'});
  await p.setViewportSize({width:1100,height:900}); await p.waitForTimeout(300);
  console.log('layout 1100', await p.evaluate(()=>['view','detail','side'].map(id=>{ const r=document.getElementById(id).getBoundingClientRect(); return id+':'+Math.round(r.left)+','+Math.round(r.top)+'+'+Math.round(r.width); }).join(' ')));
  await p.setViewportSize({width:400,height:860}); await p.waitForTimeout(300);
  console.log('layout 400', await p.evaluate(()=>['view','detail','side'].map(id=>{ const r=document.getElementById(id).getBoundingClientRect(); return id+':'+Math.round(r.left)+','+Math.round(r.top)+'+'+Math.round(r.width); }).join(' ')));
  console.log('errors', errs); await b.close(); })();
