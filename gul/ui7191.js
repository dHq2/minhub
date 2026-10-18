// v7.19.1 UI 시험 — ui7191.js v1.6 (v1.6: 간두는 v7.25.1부터 기술 대신 두 번째 총 — 상세의 [두 번째 총] 샷건 · 특수탄 · v1.5: 철퇴 후리기는 v7.24.4부터 한 번 누르면 겨눔 · 두 번 누르면 바로 명령 · v1.4: 머리 찍기는 새 판에서 (앞 시험이 남긴 판 상태와 섞이지 않게) · 영거리 사격 상세는 남은 특수탄 수와 상관없이 · v1.3: 머리 찍기 시험은 명령이 닿을 때까지 5초 · 전달 중도 셈 · 실패하면 상태를 찍음 · v1.2: 머리 찍기 시험은 쟝을 지휘관 곁에 두고 (명령 전달이 닿게) · v1.1: 명령은 전달 중 (ordPend) 도 셈 · 칸은 useSlot 으로 · 적은 멀리 두고 시작 · 고유 기술 칸 6 · 7: 공중제비 (적 → 내려찍기 · 바닥 → 빠짐) · 철퇴 후리기 (바로) · 머리 찍기 (노림) · 숫자키 · 상세 · 로그 · 모바일 조작판 · 부채 · 옛 저장)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const setup = async p => { await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
   await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); for (const [k,x,y] of [['탕아',10.5,15.5],['모닝스타',12.5,15.5],['쟝',14.5,15.5],['간두',16.5,15.5]]){ const u=fromDesign(designByKey(k),0); u.x=x; u.y=y; S.units.push(u); } rebuildMap(); changed(); start(); }); await p.waitForTimeout(300); };
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   await p.evaluate(()=>{ const c=document.getElementById('contBtn'); if(c) c.click(); paused=true; });
   const sk = await p.evaluate(()=>{ const t=world.units.find(u=>u.name==='탕아'); sel=new Set([t.i]); hud(); return [...document.querySelectorAll('#skbar .sk:not(.off)')].map(b=>[b.dataset.sk,b.querySelector('.nm').innerText,!!b.querySelector('.ic .tico')]); });
   console.log('    탕아 기술 막대', JSON.stringify(sk)); ok(sk.some(x=>x[0]==='6'&&x[1]==='공중제비'&&x[2]),'칸 6 공중제비 (아이콘)');
   const fl = await p.evaluate(()=>{ const t=world.units.find(u=>u.name==='탕아'), e=world.units.filter(u=>u.side===1).sort((a,b)=>Math.hypot(a.x-t.x,a.y-t.y)-Math.hypot(b.x-t.x,b.y-t.y))[0];
     useSlot(6); const arm=!!(armed&&armed.k==='spec'&&armed.s==='flip'); e.seenBy=true; e.x=t.x; e.y=t.y-2.6; armedTap({x:e.x,y:e.y}); const o=t.order||(t.ordPend&&t.ordPend.o);
     paused=false; for(let i=0;i<90;i++) stepWorld(world,1/30); hud(); return { arm, o: o&&o.k+':'+o.s, log: logLines(world).filter(s=>/공중제비|내려찍기/.test(s)).slice(0,3) }; });
   console.log('    공중제비', JSON.stringify(fl)); ok(fl.arm&&fl.o==='spec:flip'&&fl.log.length>=1,'숫자키 6 → 적 탭 → 뛰어올라 내려찍기 (로그)');
   const sw = await p.evaluate(()=>{ const m=world.units.find(u=>u.name==='모닝스타'); sel=new Set([m.i]); hud(); const L=[...document.querySelectorAll('#skbar .sk:not(.off)')].map(b=>b.querySelector('.nm').innerText); useSlot(6); const arm=!!(armed&&armed.k==='spec'&&armed.s==='sweep'); useSlot(6); const o=m.order||(m.ordPend&&m.ordPend.o); return { L, arm, o: o&&o.k+':'+o.s }; });
   console.log('    모닝스타', JSON.stringify(sw)); ok(sw.L.includes('철퇴 후리기')&&sw.L.includes('휘둘러 치기')&&sw.arm&&sw.o==='spec:sweep','칸 6 · 7 · 철퇴 후리기는 한 번 겨눔 · 두 번 바로 명령');
   const dt = await p.evaluate(()=>{ const g=world.units.find(u=>u.name==='간두'); const d=document.createElement('div'); d.innerHTML=unitDetailHtml(world,g); return d.innerText.match(/\[두 번째 총\][^\n]*/)?.[0]||''; }); console.log('    상세', dt); ok(/샷건/.test(dt)&&/특수탄 \d+/.test(dt),'상세에 두 번째 총 샷건 · 특수탄');
   ok(errs.length===0,'오류 없음 (데스크톱) '+JSON.stringify(errs)); }
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   await p.evaluate(()=>{ const c=document.getElementById('contBtn'); if(c) c.click(); paused=true; });
   const hd = await p.evaluate(()=>{ const j=world.units.find(u=>u.name==='쟝'), e=world.units.find(u=>u.side===1&&u.alive), h=world.units.find(u=>u.hero); j.x=h.x+0.9; j.y=h.y; j.ordPend=null; e.x=j.x+1.4; e.y=j.y;  e.seenBy=true; sel=new Set([j.i]); hud(); useSlot(6); armedTap({x:e.x,y:e.y}); for(let i=0;i<150&&!(j.order&&j.order.k==='attack');i++){ e.seenBy=true; stepWorld(world,1/30); } const oo=j.order||(j.ordPend&&j.ordPend.o); return { o: oo&&oo.k, mark: !!j.headMark, pend: !!j.ordPend, d: +Math.hypot(j.x-e.x,j.y-e.y).toFixed(2), ea: e.alive, act: j.act&&j.act.k, line: logLines(world).filter(s=>/머리를 노림/.test(s)).length }; });
   console.log('    머리 찍기', JSON.stringify(hd)); ok(hd.o==='attack'&&hd.mark&&hd.line>=1,'머리 찍기 → 노림 + 공격 명령');
   ok(errs.length===0,'오류 없음 (머리 찍기) '+JSON.stringify(errs)); }
 { const ctx=await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   const d = await p.evaluate(()=>{ paused=true; const m=world.units.find(u=>u.name==='모닝스타'); sel=new Set([m.i]); hud(); const bs=[...document.querySelectorAll('#dActs [data-dk^="sk"]')]; const off=bs.filter(b=>{ const q=b.getBoundingClientRect(); return q.right>innerWidth+1||q.left<-1; }).length; return { keys: bs.map(b=>b.dataset.dk+':'+b.innerText.replace(/\s+/g,' ').trim()), off, fan: fanItems(world,[m.i],null).map(x=>x.k) }; });
   console.log('    모바일 조작판', JSON.stringify(d)); ok(d.keys.some(x=>/sk6:.*철퇴 후리기/.test(x))&&d.keys.some(x=>/sk7:.*휘둘러/.test(x))&&d.off===0,'모바일 기술 단추 6 · 7 (화면 안)'); ok(d.fan.includes('spec1')&&d.fan.includes('spec2'),'꾹 누름 부채에도');
   ok(errs.length===0,'오류 없음 (모바일) '+JSON.stringify(errs)); }
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   await p.evaluate(()=>{ const u=fromDesign(designByKey('탕아'),0); u.active=[]; u.x=5.5; u.y=15.5; S.units.push(u); delete S.v7191k; save(); }); await p.reload(); await p.waitForTimeout(2400);
   const mg = await p.evaluate(()=>{ const u=S.units.find(x=>x.ref==='C-221'); return u?u.active:null; }); ok(JSON.stringify(mg)==='["공중제비"]','옛 저장의 탕아에 공중제비 '+JSON.stringify(mg)); ok(errs.length===0,'오류 없음 (옛 저장)'); }
 console.log(fails?`${fails} FAIL`:'ALL UI7191 OK'); await b.close(); })();
