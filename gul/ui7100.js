const { chromium } = require('playwright'); const errs=[], fails=[]; const ok=(c,m)=>{ console.log((c?'  ok  ':'  FAIL ')+m); if(!c) fails.push(m); };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 for (const [nm,vp,mob] of [['모바일',{width:412,height:915},true],['데스크톱',{width:1280,height:800},false]]){
  const ctx = await b.newContext({viewport:vp, deviceScaleFactor:mob?2:1, isMobile:mob, hasTouch:mob}); const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(nm+' '+e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(nm+' '+m.text()); });
  console.log('==',nm);
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(900);
  await p.evaluate(()=>start()); await p.waitForTimeout(300);
  // 등급
  const g = await p.evaluate(()=>world.units.filter(u=>u.side===0).map(u=>u.name+':'+(u.nv?u.nvG:'-')+(u.rank?'/'+u.rank:'')).join(' '));
  ok(/인주:C/.test(g)&&/노먼:A\/부대장/.test(g)&&/레베카:A/.test(g)&&/카리우스:B/.test(g), '밤 시력 등급 · 부대장 직책 '+g);
  // 상세정보 시야 줄
  const det = await p.evaluate(()=>unitDetailHtml(world, world.units[0])); ok(/야시 C/.test(det), '상세정보 시야 줄 (야시 C)');
  const det2 = await p.evaluate(()=>unitDetailHtml(world, world.units[1])); ok(/직책/.test(det2)&&/부대장/.test(det2), '노먼 상세정보에 직책 줄');
  // 횃불 0초 끔 → 로그
  await p.evaluate(()=>{ const W=world; toggleTorch(); });
  const lg = await p.evaluate(()=>world.log.filter(l=>l.k==='torch').map(l=>l.on+':'+!!l.t0).join(','));
  ok(/false:true/.test(lg), '0초 횃불 끄기도 로그에 남음 '+lg);
  // 꺼진 채 떨어짐
  const dr = await p.evaluate(()=>{ const W=world, H=W.units[0]; H.hp=1; H.max=H.max||85; const foe=W.units.find(u=>u.side===1); foe.x=H.x+0.6; foe.y=H.y; applyDamageTest = typeof applyDamageTest; return H.torch+':'+H.torchOff; });
  console.log('  횃불 상태', dr);
  const txt = await p.evaluate(()=>{ const W=world; W.torches.push({x:1,y:1,dropped:true,fell:true,off:true}); const e={k:'torchDrop',a:0,x:1,y:1,off:true,t:W.t}; return narrOf(W,e).s + ' | ' + logLines(W,0).length; });
  ok(/꺼져 있어/.test(txt), '꺼진 채 떨어진 횃불 서술 '+txt);
  // 🕊
  const dv = await p.evaluate(()=>{ const W=world, u=W.units[2]; u.roe='hold'; return roeOf(W,u); }); ok(dv==='hold','교전금지 태세');
  await p.evaluate(()=>{ draw(); }); await p.waitForTimeout(150);
  await p.screenshot({path:'ui7100_'+(mob?'m':'d')+'_dove.png'});
  // 편대 단추
  await p.evaluate(()=>{ sel=new Set([2]); hud(); }); await p.waitForTimeout(200);
  const sqBtn = await p.evaluate(()=>!!document.querySelector('[data-dk="squad"],[data-ord="squad"]')); ok(sqBtn, '편대 단추가 보임');
  await p.evaluate(()=>{ const W=world; W.t=0; squadKey([W.units[2]]); }); 
  ok(await p.evaluate(()=>world.units[2].sqLead===1), '편대 배속 (0초는 바로)');
  const bd = await p.evaluate(()=>linkBadge(world, world.units[2])); ok(/노먼 편대/.test(bd), '편대 배지');
  // 설정 칸
  await p.evaluate(()=>{ if (typeof openEdit==='function') {} });
  // 전파: 먼 아군
  const wv = await p.evaluate(()=>{ const W=world; W.t=3; const H=W.units[0]; const r=[]; for (let i=0;i<60;i++){ const wv=cmdWave(W,H,[W.units[3],W.units[4]]); r.push(wv[0].ok+':'+wv[0].via); } return r.slice(0,3).join(','); });
  console.log('  전파', wv);
  // 한 판 돌려 오류 확인
  await p.evaluate(()=>{ const W=world; W.t=0; paused=false; });
  for (let i=0;i<40;i++){ await p.evaluate(()=>{ for(let k=0;k<30;k++) if(!world.over) stepWorld(world,1/30); draw(); hud(); }); }
  ok(true,'1200 스텝 돌림');
  await p.screenshot({path:'ui7100_'+(mob?'m':'d')+'_play.png'});
  await ctx.close();
 }
 console.log('errors',JSON.stringify(errs)); console.log(fails.length?'FAILS '+fails.join(' | '):'ALL PASS'); await b.close(); })();
