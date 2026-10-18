// v7.15 UI 시험 — ui715.js v1.1 (v1.1: 가는 중인 명령은 ordPend 에서 봄 · 편대 상자 · 0초에 편대 바꾸기 · 지시 점 · 팜 우회 · 돌진 화살표 · 도착해서 쓸 것 · 모바일)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+process.cwd()+'/build/wrapped.html';
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 // 배치 탭 편대 상자
 await p.evaluate(()=>showTab('place')); await p.waitForTimeout(200);
 const rows = await p.evaluate(()=>[...document.querySelectorAll('#sqBoxP .sqrow')].map(r=>r.innerText.replace(/\s+/g,' '))); console.log('    편대 상자', JSON.stringify(rows));
 ok(rows.length===6 && rows.some(r=>/노먼.*★ 편대장/.test(r)),'배치 탭 편대 상자 (아군 여섯 · 노먼 ★)');
 const ki = await p.evaluate(()=>S.units.findIndex(u=>u.name==='친칠라')); await p.click(`#sqBoxP [data-sqk="${ki}"][data-sqv="A"]`); await p.waitForTimeout(150);
 const c1 = await p.evaluate(()=>S.units.find(u=>u.name==='친칠라').sq); await p.click(`#sqBoxP [data-sqk="${ki}"][data-sqv="B"]`); await p.waitForTimeout(150);
 const c2 = await p.evaluate(()=>S.units.find(u=>u.name==='친칠라').sq); ok(c1==='A'&&c2==='B','본대 ↔ 2편대 바꾸기');
 // 싸움 전 (0초) 전투 탭에서 바꾸기
 await p.evaluate(()=>start()); await p.waitForTimeout(400);
 const vis0 = await p.evaluate(()=>!document.getElementById('sqBoxF').hidden); ok(vis0,'싸움 전 (0초) 전투 탭에 편대 상자');
 const ri = await p.evaluate(()=>S.units.findIndex(u=>u.name==='레베카')); await p.click(`#sqBoxF [data-sqk="${ri}"][data-sqv="B"]`); await p.waitForTimeout(150); await p.click(`#sqBoxF [data-sqlead="${ri}"]`); await p.waitForTimeout(200);
 const w0 = await p.evaluate(()=>{ const r=world.units.find(u=>u.name==='레베카'), n=world.units.find(u=>u.name==='노먼'), g=world.units.find(u=>u.name==='청광묵'); return { r: r.rank, n: n.rank, gL: g.sqLead===r.i, nL: n.sqLead===r.i }; });
 console.log('    0초 편대', JSON.stringify(w0)); ok(w0.r==='부대장'&&w0.n===''&&w0.gL&&w0.nL,'0초에 바꾸면 판에도 바로 (레베카 편대장 · 노먼 · 청광묵이 그 편대)');
 await p.evaluate(()=>{ for(const u of S.units){ if(u.name==='레베카'){ u.rank=''; u.sq='A'; } if(u.name==='노먼') u.rank='부대장'; } sqApply(); });
 // 판 진행 → 상자 숨음 · 지시 점
 await p.evaluate(()=>{ togglePlay(); }); await p.waitForTimeout(300);
 await p.waitForFunction(()=>world.t>0.5,{timeout:20000}).catch(()=>{});
 const hid1 = await p.evaluate(()=>document.getElementById('sqBoxF').hidden); ok(hid1,'판이 시작되면 편대 상자 숨김');
 const fx = await p.evaluate(()=>{ const W=world, g=W.units.find(u=>u.name==='청광묵'), e=W.units.find(u=>u.side===1); e.seenBy=1; g.order={k:'attack',b:e.i}; noteOrders([g]); return (W.ordFx||[]).slice(-1)[0]||null; });
 console.log('    지시 점', JSON.stringify(fx)); ok(fx && fx.legs.length>=1 && !fx.dep,'대장의 명령이 거쳐 간 길 (금색 점)');
 await p.waitForTimeout(250); await p.screenshot({path:'ui715_dots.png'});
 // 편대장의 지시 (하늘색) — 엔진 지시 길
 const fx2 = await p.evaluate(()=>{ const W=world, n=W.units.find(u=>u.name==='노먼'), c=W.units.find(u=>u.name==='친칠라'), e=W.units.find(u=>u.side===1); const lk=cmdWave(W,n,[c])[0]; ordFxAdd(W,c,lk,n.i,true); return (W.ordFx||[]).slice(-1)[0]; });
 ok(fx2 && fx2.dep,'편대장의 지시는 하늘색 (dep)');
 // 팜 버스트 우회 (Shift)
 const pv = await p.evaluate(()=>{ const W=world, g=W.units.find(u=>u.name==='청광묵'), e=W.units.filter(u=>u.side===1).sort((a,b)=>Math.hypot(b.x-g.x,b.y-g.y)-Math.hypot(a.x-g.x,a.y-g.y))[0]; e.seenBy=1; palmPick=[g.i]; playClick({x:e.x,y:e.y}, true, e); const o=g.order||(g.ordPend&&g.ordPend.o); return { k: o&&o.k, via: !!(o&&o.via), it: intentOf(W,g,true) }; });
 console.log('    팜 우회', JSON.stringify(pv)); ok(pv.k==='palm','팜 버스트 명령'); ok(pv.it && pv.it.ic==='💥','도착해서 쓸 것 = 💥');
 // 돌진 화살표 (그리기 오류 없음)
 await p.evaluate(()=>{ const W=world, k=W.units.find(u=>u.name==='카리우스'), e=W.units.find(u=>u.side===1); k.act={k:'charge',phase:'run',b:e.i,t0:W.t,end:W.t+1,dx:1,dy:0,sp:3,v0:1,run:0}; }); await p.waitForTimeout(300); await p.screenshot({path:'ui715_charge.png'});
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 // 모바일
 const m=await (await b.newContext({viewport:{width:412,height:883},isMobile:true,hasTouch:true,deviceScaleFactor:2.6})).newPage(); const e2=[]; m.on('pageerror',e=>e2.push(e.message));
 await m.goto(url); await m.waitForTimeout(400); await m.evaluate(()=>localStorage.clear()); await m.reload(); await m.waitForTimeout(900);
 await m.evaluate(()=>{ start(); showTab('fight'); }); await m.waitForTimeout(400); const mv = await m.evaluate(()=>({ sw: document.documentElement.scrollWidth, iw: innerWidth, f: !document.getElementById('sqBoxF').hidden }));
 console.log('    모바일', JSON.stringify(mv)); ok(mv.sw<=mv.iw+1 && mv.f,'모바일: 편대 상자 · 가로 넘침 없음'); await m.screenshot({path:'ui715_mob.png', fullPage:true});
 ok(e2.length===0,'모바일 오류 없음 '+JSON.stringify(e2));
 console.log(fails?`${fails} FAIL`:'ALL UI715 OK'); await b.close(); })();
