// v7.24.0 UI 시험 — ui7240.js v1.2 (v1.2: 15초 동안 세자르가 쓰러지지 않게 (피 500 은 처음에 봄) — 스텝 빈도만 잼 · 일찍 쓰러진 판은 스텝이 적게 나왔음 · v1.1: 5S 싸움은 15초 (10초엔 무작위로 스텝 4번에 그칠 때가 있음 — 초당 한 번쯤) · 세자르 피 500 · 5S 싸움에서 스텝을 밟음 (그림자 자국 그리기 오류 없음) · 비켜 섬 로그 글 · 도약 강타 로그 · 나레이션 (찌부러짐 · 공중) · PC · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
 const f = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=5; campBuild(5,'down',party); while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   czRise(world,C.stages[5].cz); while (TK){ if (TK.timer) talkDone(); talkAdv(); } const k=world.units.find(u=>u.brain==='cesar'), max0=k.max; for (const u of world.units.filter(u=>u.side===0&&u.alive)) u.max=u.hp=4000;
   mode='run'; paused=false; let err=null; for (let i=0;i<450&&!world.over&&k.alive;i++){ k.hp=Math.max(k.hp, k.max*0.6); stepWorld(world,1/30); czEvTick(world); czCutTick(world); while (TK){ if (TK.timer) talkDone(); talkAdv(); } if (i%10===0){ try { draw(); } catch(e){ err=e.message; break; } } } paused=true; mode='plan';
   const L=logLines(world).join('\n'); return { max: max0, step: k.cz.nStep, kinds: k.cz.stepK, err, side: world.log.filter(l=>l.k==='czSide').length, sideTxt: /비켜 섬/.test(L), ghost: world.fx.filter(x=>x.k==='ghost').length }; });
 console.log('    세자르 ('+vw.nm+')', JSON.stringify(f)); ok(f.max===500,'세자르 피 500'); ok(f.step>=5&&!f.err,'5S 싸움 15초 — 스텝 '+f.step+'번 · 그리기 오류 없음'); ok(!f.side||f.sideTxt,'비켜 섬 로그 글 ('+f.side+')');
 const q = await p.evaluate(()=>{ const W=world, a=W.units.find(u=>u.side===0&&u.alive), k=W.units.find(u=>u.brain==='cesar'); const ev=[{k:'quakeHit',a:k.i,n:3,kills:1,push:1,air:1,x:5,y:5,t:W.t},{k:'quakeAir',a:k.i,b:a.i,t:W.t}]; W.log.push(...ev); const L=logLines(W).slice(-2).join(' / '); const N=narrOf(W,ev[0]); return { L, N: N&&N.s }; });
 console.log('    도약 강타 글', JSON.stringify(q)); ok(/찌부러짐 1/.test(q.L)&&/몸 밖으로 밀려남 1/.test(q.L)&&/공중 — 도약 강타의 충격을 받지 않음/.test(q.L)&&/찌부러졌다/.test(q.N||''),'도약 강타 로그 · 나레이션 (찌부러짐 · 밀려남 · 공중)');
 const ds = await p.evaluate(()=>{ const d=designList().find(x=>x.key==='세자르'), h=designList().find(x=>x.key==='호레이쇼'); return { cz: d.ov.hp, note: /스텝을 마구/.test(d.note), q: /찌부러짐/.test(ACTIVE['도약 강타']||''), hn: /찌부러짐/.test(h.note) }; });
 ok(ds.cz===500&&ds.note&&ds.q&&ds.hn,'설명 글 — 세자르 (피 500 · 스텝) · 도약 강타 · 호레이쇼 (찌부러짐)');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7240 OK'); await b.close(); })();
