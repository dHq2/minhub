// v7.24.4 UI 시험 — ui7244.js v1.1 (v1.1: 전달 중인 명령도 셈 · 모닝스타 철퇴: 철퇴 후리기 단추 → 거리를 탭 (PC 미리 보기 원) → 그 거리로 한 바퀴 · 한 번 더 누르면 바로 · 그림 (모음 예고 · 스미어 · 한 바퀴 · 들고 있는 공의 관성) 오류 없음 · 로그 · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const h=S.units.find(u=>u.hero); const m=fromDesign(designByKey('모닝스타'),0); m.x=h.x+1.2; m.y=h.y; S.units.push(m); rebuildMap(); changed(); start(); paused=true; $('seeAll').checked=true; });
 const a = await p.evaluate(()=>{ const m=world.units.find(u=>u.name==='모닝스타'), E=world.units.filter(u=>u.side===1&&u.alive).slice(0,3); E.forEach((e,j)=>{ e.x=m.x+Math.cos(j*2.1)*1.6; e.y=m.y+Math.sin(j*2.1)*1.6; e.seenBy=true; e.stunT=world.t+99; e.max=e.hp=9000; });
   sel=new Set([m.i]); hud(); const sl=SLOTS.findIndex(s=>s.k==='spec1')+1; useSlot(sl); const arm=armed&&armed.k==='spec'&&armed.s==='sweep'; const lab=slotLabel(world,[m],sl);
   sweepAim={x:m.x+2.0,y:m.y}; let err=null; try { draw(); } catch(x){ err=x.message; }
   armedTap({x:m.x+2.0,y:m.y+0.01}); const o=m.order; return { arm, lab, err, o, sl }; });
 console.log('    단추 ('+vw.nm+')', JSON.stringify(a)); ok(a.arm&&/거리를 탭/.test(a.lab||''),'철퇴 후리기 단추 → 거리를 고르는 상태 (안내 글)'); ok(!a.err,'미리 보기 원 그리기 오류 없음'); ok(a.o&&a.o.k==='spec'&&a.o.s==='sweep'&&Math.abs(a.o.R-2.0)<0.05,'바닥을 탭 → 그 거리 (2.0M) 로 명령');
 const r = await p.evaluate(()=>{ const m=world.units.find(u=>u.name==='모닝스타'); mode='run'; paused=false; let err=null, wind=false, swing=false; const shots=[];
   for (let i=0;i<60;i++){ stepWorld(world,1/30); if (m.act&&m.act.s==='sweep'&&m.act.phase==='wind') wind=true; if (m.act&&m.act.s==='sweep'&&m.act.phase==='swing') swing=true; if (i%3===0){ try { draw(); } catch(x){ err=x.message; break; } } }
   paused=true; mode='plan'; const S=world.log.find(l=>l.k==='flailSpin'&&l.a===m.i), W2=world.log.find(l=>l.k==='flailSweep'&&l.a===m.i); return { err, wind, swing, R: S&&S.R, n: W2&&W2.n, L: logLines(world).filter(s=>/철퇴 후리기|사슬을/.test(s)).slice(-2) }; });
 console.log('    한 바퀴', JSON.stringify(r)); ok(!r.err&&r.wind&&r.swing,'모음 (예고 · 스미어) → 한 바퀴 — 그리기 오류 없음'); ok(r.R===2&&r.n>=1,'정한 거리 2.0M 로 한 바퀴 · 맞음 '+r.n); ok(r.L.some(s=>/2M 풀어 한 바퀴|\(2M\)/.test(s)),'로그 — 거리');
 const q = await p.evaluate(()=>{ const m=world.units.find(u=>u.name==='모닝스타'); (m.spec.find(x=>x.k==='sweep')||{}).cdT=-9; m.act=null; m.order=null; sel=new Set([m.i]); hud(); const sl=SLOTS.findIndex(s=>s.k==='spec1')+1; useSlot(sl); useSlot(sl); return { o: m.order||(m.ordPend&&m.ordPend.o), armed: !!armed }; });   /* 전달 중인 명령도 */
 ok(q.o&&q.o.s==='sweep'&&q.o.R==null&&!q.armed,'단추를 한 번 더 → 바로 (기본 거리)');
 const h = await p.evaluate(()=>{ const m=world.units.find(u=>u.name==='모닝스타'); m.act=null; m.order=null; world.flails=[]; draw(); const H0=flailHang.get(m.i); const x0=H0&&H0.x; m.x+=1.5; draw(); const H1=flailHang.get(m.i); return { has: !!H0, lag: H1 ? Math.abs(H1.x-(m.x+Math.cos((m.face||0)+0.9)*(m.r+0.22)))>0.3 : false }; });
 ok(h.has&&h.lag,'들고 있는 공은 관성으로 늦게 따라옴');
 if (!vw.mob){ await p.evaluate(()=>{ const m=world.units.find(u=>u.name==='모닝스타'); (m.spec.find(x=>x.k==='sweep')||{}).cdT=-9; m.act=null; startSpec(world,m,null,'sweep','시험'); m.act.R=2.2; mode='run'; for (let i=0;i<18;i++) stepWorld(world,1/30); mode='plan'; cam.x=m.x; cam.y=m.y; cam.z=2.4; draw(); }); await p.screenshot({path:'_s7244_wind.png',clip:{x:200,y:200,width:430,height:420}});
   await p.evaluate(()=>{ const m=world.units.find(u=>u.name==='모닝스타'); mode='run'; for (let i=0;i<20&&!(m.act&&m.act.phase==='swing'&&m.act.el>0.2);i++) stepWorld(world,1/30); mode='plan'; cam.x=m.x; cam.y=m.y; draw(); }); await p.screenshot({path:'_s7244_swing.png',clip:{x:200,y:200,width:430,height:420}}); }
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7244 OK'); await b.close(); })();
