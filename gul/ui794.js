// v7.9.4 UI: 측면 기동 (단추 → 적 탭) · 집결 깃발 그림 · 칩 표시 · 복기 · 로그  /* v9.7.0: 명령 칸 접기 — 시험 전에 펼침 */
const { chromium } = require('playwright'); const errs=[], fails=[]; const ok=(c,m)=>{ console.log((c?'  ok  ':'  FAIL ')+m); if(!c) fails.push(m); };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 for (const [name,vp,mob] of [['모바일',{width:412,height:915},true],['데스크톱',{width:1280,height:800},false]]){
  console.log('==',name); const ctx = await b.newContext({viewport:vp, deviceScaleFactor:mob?2.625:1, isMobile:mob, hasTouch:mob});
  const p=await ctx.newPage(); await p.addInitScript(()=>{ try{ localStorage.setItem('gulOrdGrp','{"tac":true,"adv":true}'); }catch(e){} });   /* v9.7.0 명령 칸 전술 · 고급 펼침 */ p.on('pageerror',e=>errs.push(name+': '+String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  const tap = async sel => { const r = await p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const q=e.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2}; }, sel); if(!r){ console.log('  !! no',sel); return null; } if (mob) await p.touchscreen.tap(r.x,r.y); else await p.click(sel); await p.waitForTimeout(220); return r; };
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  await p.evaluate(()=>start()); await p.waitForTimeout(400);
  const idx = await p.evaluate(()=>Object.fromEntries(world.units.map(u=>[u.name,u.i])));
  await p.evaluate(i=>{ sel=new Set([i]); hud(); }, idx['레베카']); await p.waitForTimeout(200);
  ok(!!(await p.$(mob?'[data-dk="flank"]':'[data-ord="flank"]')), '측면 기동 단추');
  await tap(mob?'[data-dk="flank"]':'[data-ord="flank"]'); ok(await p.evaluate(()=>armed&&armed.k==='flank'), '측면 기동 켜짐');
  const f = await p.evaluate(()=>{ const e=world.units.find(u=>u.side===1); return { i:e.i, x:e.x, y:e.y }; });
  await p.evaluate(i=>{ const e=world.units[i]; e.seenBy=true; }, f.i);
  await p.evaluate(([x,y])=>armedTap({x,y}), [f.x,f.y]); await p.waitForTimeout(300);
  const od = await p.evaluate(i=>world.units[i].order, idx['레베카']); ok(od&&od.k==='flank'&&od.b===f.i, '적을 탭하면 측면 기동 명령 '+JSON.stringify(od));
  ok(await p.evaluate(i=>orderLabel(world, ordOf(world.units[i])), idx['레베카']).then(t=>/측면 기동/.test(t)), '명령 이름 표시');
  // 집결 깃발 + 칩 표시
  await p.evaluate(()=>{ world.rally={x:world.units[0].x,y:world.units[0].y,t0:0,until:99,by:0}; world.units[1].rally={x:world.units[0].x,y:world.units[0].y,t0:0,until:99,by:0}; world.units[2].offFrom=-20; world.units[2].hm={k:'hammer',b:world.units.find(u=>u.side===1).i}; world.units[3].hm={k:'anvil',b:world.units.find(u=>u.side===1).i}; hud(); });
  await p.waitForTimeout(300);
  const chips = await p.evaluate(()=>document.body.innerText.includes('📵')||document.getElementById('party').innerText.includes('📵')); ok(chips, '연락 두절 표시 (📵)');
  await p.evaluate(()=>{ detOpen=true; }); 
  const det = await p.evaluate(i=>unitDetailHtml(world, world.units[i]), idx['레베카']); ok(/연락 두절/.test(det)&&/망치/.test(det), '상세정보에 상황 (망치 · 연락 두절)');
  const lg = await p.evaluate(()=>{ world.log.push({t:1,k:'rally',a:0,x:5,y:5,why:'시험',got:[1],miss:[2],vis:true},{t:2,k:'offAct',a:2,kind:'post',m:['hold'],vis:true},{t:3,k:'hm',a:2,r:'hammer',b:5,vis:true},{t:4,k:'flankGo',a:2,b:5,early:true,vis:true}); return logLines(world).join('\n'); }); ok(/임시 집결/.test(lg)&&/연락|마지막 임무/.test(lg)&&/망치/.test(lg)&&/이른 기동/.test(lg), '로그 줄');
  await p.screenshot({path:'ui794_'+(mob?'m':'d')+'.png'}); await ctx.close(); }
 console.log('errors', JSON.stringify(errs)); console.log(fails.length?'FAILS '+fails.join(' | '):'ALL PASS'); await b.close(); })();
