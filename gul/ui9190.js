// v9.7.4 UI 시험 — ui9190.js v1.0 (겹쳐 보기 단추 4개 · 켜고 끔 · 기억 · 그리는 중 오류 없음 (전열 · 사선 · 돌격 · 감각) · 화면 그림)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const n = await p.evaluate(()=>document.querySelectorAll('#ovTog [data-ovl]').length); ok(n===4,'겹쳐 보기 단추 4개');
 for (const k of ['line','lane','chg','sense']) await p.click(`#ovTog [data-ovl="${k}"]`);
 const r = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; paused=true; const A=W.units.filter(u=>u.side===0&&u.alive), F=W.units.filter(u=>u.side===1);
   A[1].x=A[0].x+A[0].r+A[1].r; A[1].y=A[0].y; F[0].x=A[0].x+3; F[0].y=A[0].y; F[0].seenBy=1; F.forEach(f=>f.seenBy=1);
   const g=F.find(f=>f!==F[0]); if (g){ g.seenBy=0; A[0].sense=A[0].sense||{}; A[0].sense[g.i]={x:g.x,y:g.y,t:W.t-4,exact:true,sight:true}; }
   F[0].act={k:'charge',phase:'run',b:A[0].i,dx:-1,dy:0,sp:6,t0:W.t,end:W.t+2}; F[0].chgMode='atk'; draw(); draw();
   return { on: [...document.querySelectorAll('#ovTog .on')].map(b=>b.dataset.ovl), saved: localStorage.getItem('gulOvl') }; });
 console.log('    ', JSON.stringify(r));
 ok(r.on.length===4,'네 개 다 켜짐'); ok(/"sense":true/.test(r.saved||''),'이 브라우저에 기억');
 await p.mouse.move(500,480); for(let i=0;i<5;i++){ await p.mouse.wheel(0,-300); await p.waitForTimeout(60); } await p.waitForTimeout(300);
 await p.screenshot({path:'shot9190.png', clip:{x:180,y:250,width:640,height:440}});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
