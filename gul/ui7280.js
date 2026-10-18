// v7.28.0 UI 시험 — ui7280.js v1.2 (v1.2: 재생은 턴을 열고 (beginTurn) · v1.1: 5S 에 들어선 뒤 늦게 뜨는 나레이션을 닫고 잼 · v1.0: 연출: 켜고 끄기 (PC 줄 · 휴대폰 더 보기 · 저장) / 도약 강타 착지 = 흔들림 · 먼지 고리 · 다가감 / 보스 치명타 = 빛살 · '치명타!' · 멈칫 · 붉은 테두리 (보스가 아군을) ·
//   잇단 치명은 0.35초에 한 번만 크게 / 보스가 쓰러짐 = 느린 순간 · 흰 번쩍임 / 거구가 내려치면 살짝 / 흔들림을 끄면 안 흔들림 / 다가갔다가 바탕 확대로 돌아옴 · 손으로 확대하면 4초 쉼 /
//   싸움 쪽으로 살짝 당김 / 대화 중의 큰 사건은 닫힌 뒤 / 실제 재생 6초 · 그리기 오류 없음 · PC · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 // 켜고 끄기
 const t = await p.evaluate(()=>{ const r={ cam: fxOn('cam'), shake: fxOn('shake'), buzz: fxOn('buzz'), pc: !!document.getElementById('fxCam') && document.getElementById('fxCam').checked && document.getElementById('fxShake').checked };
   if (MOB){ toggleMenu(true); renderMenu(); r.menu = ['fxcam','fxshake','fxbuzz'].every(k=>!!document.querySelector(`[data-dm="${k}"]`)); toggleMenu(false); }
   setFx('shake', false); r.off = !fxOn('shake') && S.fx.shake===false; r.saved = JSON.parse(localStorage.getItem(LS)).fx.shake===false; setFx('shake', true); return r; });
 console.log('    켜고 끄기 ('+vw.nm+')', JSON.stringify(t)); ok(t.cam&&t.shake&&t.buzz&&t.pc&&t.off&&t.saved&&(!vw.mob||t.menu),'연출 · 흔들림 · 진동 — 처음엔 켜짐 · 끄면 저장 ('+(vw.mob?'더 보기 메뉴':'PC 줄')+')');
 // 5S 로 (세자르 · 보스)
 await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
 await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=5; campBuild(5,'down',party); });
 await p.waitForTimeout(900); await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } cam.follow=true; czRise(world,S.camp.stages[5].cz); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(100);
 // 대화가 닫힌 뒤 세자르 기상에 다가감 (대화 중에 난 큰 사건)
 const r0 = await p.evaluate(()=>new Promise(res=>{ const k=world.units.find(u=>u.brain==='cesar'); cam.follow=true; setTimeout(()=>res({ shot: !!CD.shot, unit: CD.shot && CD.shot.unit===k.i, z: CD.shot && CD.shot.z }), 250); }));
 console.log('    세자르 기상', JSON.stringify(r0)); ok(r0.shot&&r0.unit,'세자르가 일어나면 (대화가 닫힌 뒤) 카메라가 다가감');
 // 도약 강타 착지
 const q = await p.evaluate(()=>{ CD.shot=null; CD.lastShot=-1e9; CD.quietUntil=0; SHK.a=0; FXV.length=0; const k=world.units.find(u=>u.brain==='cesar'); cam.x=k.x; cam.y=k.y; cam.follow=true;
   world.log.push({ k:'quakeHit', a:k.i, n:2, kills:0, air:0, push:0, x:k.x, y:k.y, vis:true, t:world.t }); fxTick(world);
   const o=fxShakeOff(); return { a: SHK.a, off: Math.hypot(o.x,o.y)>0, ring: FXV.some(f=>f.k==='ring'), shot: !!CD.shot && CD.shot.z }; });
 console.log('    착지', JSON.stringify(q)); ok(q.a>=7&&q.off&&q.ring&&q.shot>1,'도약 강타 착지 — 흔들림 '+q.a+'px · 먼지 고리 · 다가감 ×'+q.shot);
 await p.evaluate(()=>draw()); await p.screenshot({path:`_s7280_quake_${vw.nm}.png`});
 // 흔들림을 끄면 안 흔들림
 const q2 = await p.evaluate(()=>{ setFx('shake', false); SHK.a=0; const k=world.units.find(u=>u.brain==='cesar'); world.log.push({ k:'quakeHit', a:k.i, n:1, kills:0, air:0, push:0, x:k.x, y:k.y, vis:true, t:world.t }); fxTick(world); const r=SHK.a; setFx('shake', true); return r; });
 ok(q2===0,'흔들림을 끄면 착지에도 안 흔들림');
 // 보스 치명타 (세자르가 아군을)
 const c = await p.evaluate(()=>{ FXV.length=0; FXL.crit=-9; FXL.txt=-9; FXT.until=0; SHK.a=0; const k=world.units.find(u=>u.brain==='cesar'), h=world.units.find(u=>u.side===0&&u.alive); cam.x=h.x; cam.y=h.y;
   world.log.push({ k:'hit', a:k.i, b:h.i, dmg:60, crit:true, t:world.t }); fxTick(world);
   const r={ burst: FXV.filter(f=>f.k==='burst').length, txt: FXV.filter(f=>f.k==='txt').map(f=>f.s), vig: FXV.some(f=>f.k==='vig'), stop: fxTimeK(), shake: SHK.a };
   world.log.push({ k:'hit', a:k.i, b:h.i, dmg:40, crit:true, t:world.t }); fxTick(world); r.txt2 = FXV.filter(f=>f.k==='txt').length; r.burst2 = FXV.filter(f=>f.k==='burst').length; return r; });
 console.log('    보스 치명타', JSON.stringify(c)); ok(c.burst===1&&c.txt.join()==='치명타!'&&c.vig&&c.stop<0.2&&c.shake>=4,"보스가 아군을 치명 — 빛살 · '치명타!' · 붉은 테두리 · 멈칫 (×"+c.stop+') · 흔들림');
 ok(c.txt2===1&&c.burst2===2,'잇단 치명 (마구 베기) — 빛살만 더하고 글 · 멈칫은 한 번');
 await p.waitForTimeout(60); await p.evaluate(()=>draw()); await p.screenshot({path:`_s7280_crit_${vw.nm}.png`});
 // 아군이 보스를 치명 · 거구 아닌 이의 평타는 안 흔들림 · 보스 쓰러짐
 const d = await p.evaluate(()=>{ FXV.length=0; FXL.crit=-9; FXL.txt=-9; FXT.until=0; SHK.a=0; const k=world.units.find(u=>u.brain==='cesar'), h=world.units.find(u=>u.side===0&&u.alive);
   world.t += 1; world.log.push({ k:'hit', a:h.i, b:k.i, dmg:30, crit:true, t:world.t }); fxTick(world); const gold = FXV.find(f=>f.k==='txt'); const r={ gold: gold && gold.col, vig: FXV.some(f=>f.k==='vig') };
   SHK.a=0; world.t += 1; world.log.push({ k:'hit', a:h.i, b:k.i, dmg:30, crit:false, t:world.t }); fxTick(world); r.plain = SHK.a;
   FXT.until=0; CD.shot=null; CD.lastShot=-1e9; CD.quietUntil=0; world.log.push({ k:'die', a:h.i, b:k.i, t:world.t }); fxTick(world); r.slow = fxTimeK(); r.flash = FXV.some(f=>f.k==='flash'); r.shot = CD.shot && CD.shot.z; return r; });
 console.log('    아군이 보스를 · 쓰러짐', JSON.stringify(d)); ok(d.gold==='#ffd34d'&&!d.vig,'아군이 보스를 치명 — 금빛 글 · 붉은 테두리 없음'); ok(d.plain===0,'거구 아닌 이의 평타는 안 흔들림');
 ok(Math.abs(d.slow-0.3)<1e-9&&d.flash&&d.shot>=1.2,'보스가 쓰러짐 — 느린 순간 ×0.3 · 흰 번쩍임 · 다가감 ×'+d.shot);
 // 거구 (호레이쇼) 가 내려치면 살짝
 const g = await p.evaluate(()=>{ const p0={ ...foeOf('호레이쇼'), id: uid(), x: world.units[0].x+3, y: world.units[0].y }; lockIdentity(p0); const u=addUnit(world,p0); SHK.a=0; FXL.giant=-9; const h=world.units.find(x=>x.side===0&&x.alive);
   world.log.push({ k:'hit', a:u.i, b:h.i, dmg:20, crit:false, t:world.t }); fxTick(world); const r={ giant: fxGiant(u), boss: fxBoss(u), a: SHK.a }; u.alive=false; return r; });
 console.log('    거구', JSON.stringify(g)); ok(g.giant&&g.a>0&&g.a<=3,'거구 (호레이쇼) 가 내려치면 살짝 흔들림 ('+g.a+'px)');
 // 다가갔다가 바탕 확대로 돌아옴 · 손으로 확대하면 4초 쉼
 const z = await p.evaluate(()=>new Promise(res=>{ CD.shot=null; CD.lastShot=-1e9; CD.quietUntil=0; CD.zk=1; CD.zSet=null; const k=world.units.find(u=>u.alive&&u.side===0); cam.follow=true; cam.x=k.x; cam.y=k.y; const z0=cam.z; camShot(world,{ x:k.x, y:k.y, z:1.2, dur:600, pri:2 });
   let zMax=z0; const t0=performance.now(); (function tick(){ zMax=Math.max(zMax,cam.z); if (performance.now()-t0<1300) requestAnimationFrame(tick); else { const back=Math.abs(cam.z-z0)<1e-6;
     camShot(world,{ x:k.x, y:k.y, z:1.2, dur:900, pri:2 }); setTimeout(()=>{ const zIn=cam.z; zoom(1.2); const after=cam.z; camShot(world,{ x:k.x, y:k.y, z:1.2, dur:600, pri:2 }); res({ z0, zMax, back, zIn, after, quiet: !CD.shot, exp: +(z0*1.2).toFixed(4) }); }, 300); } })(); }));
 console.log('    다가감', JSON.stringify(z)); ok(z.zMax>z.z0*1.12&&z.back,'다가감 — 확대 ×'+(z.zMax/z.z0).toFixed(2)+' 뒤 바탕으로 돌아옴');
 ok(Math.abs(z.after-z.exp)<1e-3&&z.quiet,'손으로 확대하면 — 다가감을 풀고 바탕 × 1.2 · 4초 동안 다가가지 않음');
 // 싸움 쪽으로 살짝 당김
 const a = await p.evaluate(()=>{ const k=world.units.find(u=>u.alive&&u.side===1)||null; CD.shot=null; if (!k) return null; const h=world.units.find(u=>u.side===0&&u.alive); k.seenBy=true; const bx=k.x-4, by=k.y; const r=camAim(world,bx,by); return { dx: +(r.x-bx).toFixed(2), dy: +(r.y-by).toFixed(2) }; });
 console.log('    당김', JSON.stringify(a)); ok(a&&a.dx>0.5&&a.dx<=4,'가까운 적 쪽으로 살짝 당겨 담음 ('+(a&&a.dx)+'칸)');
 // 실제 재생 6초 (requestAnimationFrame) — 오류 없음
 const run = await p.evaluate(()=>new Promise(res=>{ setFx('cam', true); world.units.filter(u=>u.side===0&&u.alive).forEach(u=>{ u.max=u.hp=4000; }); beginTurn(world); mode='run'; paused=false; cont=true; const t0=world.t; setTimeout(()=>{ paused=true; mode='plan'; res({ dt: +(world.t-t0).toFixed(1), fx: FXV.length }); }, 6000); }));
 console.log('    재생', JSON.stringify(run)); ok(run.dt>0.5,'실제 재생 '+run.dt+'초 (멈칫 · 느린 순간이 섞여도 흐름)');
 await p.evaluate(()=>{ FXV.push({ k:'ring', x: cam.x, y: cam.y, r: 2.4, t0: performance.now(), dur: 650 }); draw(); }); await p.waitForTimeout(120); await p.screenshot({path:`_s7280_run_${vw.nm}.png`});
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7280 OK'); await b.close(); })();
