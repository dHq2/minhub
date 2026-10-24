// v9.6.4 UI 시험 — ui9130.js v1.0 (떨어진 물건을 한 번 누르면 줍기 · 두 번 누르면 서둘러 줍기 · 전우 돌격 로그 글 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const r = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; paused=true; const u=W.units.find(x=>x.side===0&&!x.hero&&x.name==='레베카')||W.units.find(x=>x.side===0&&!x.hero);
   const it={ id: 777, k:'weapon', name:'장검', label:'시험 장검', x: u.x+4, y: u.y, owner:null, t:0 }; W.items.push(it); u.weapon='맨손'; u.weaponNow='맨손'; sel=new Set([u.i]);
   playClick({x: it.x, y: it.y}, false); const o1=u.order&&{...u.order};
   playClick({x: it.x, y: it.y}, false); const o2=u.order&&{...u.order};
   pickTap=null; u.order=null; playClick({x: it.x, y: it.y}, false); const o3=u.order&&{...u.order};
   cgJoin(W,[u, W.units.find(x=>x.side===0&&!x.hero&&x!==u)]); L(W,{k:'pairGo',a:u.i,b:W.units.find(x=>x.cg===u.cg&&x!==u).i,tg:W.units.find(x=>x.side===1).i,how:'flank',run:true,chief:false,vis:true});
   const ln=logLines(W,0).filter(l=>/옆구리로 질주/.test(l)); draw(); return { o1, o2, o3, ln }; });
 console.log('    ', JSON.stringify(r).slice(0,400));
 ok(r.o1&&r.o1.k==='pick'&&!r.o1.hurry,'한 번 누름 → 줍기'); ok(r.o2&&r.o2.k==='pick'&&r.o2.hurry,'두 번 누름 → 서둘러 줍기'); ok(r.o3&&!r.o3.hurry,'다시 한 번만 누르면 보통 줍기');
 ok(r.ln.length===1&&!/undefined/.test(r.ln[0]),'로그: 전우의 돌격 → 옆구리로 질주');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
