// v9.7.2 UI 시험 — ui9170.js v1.0 (🧱 뭉침 단추 → 고른 무리에 clump 명령 · 명령 이름 · 상태 줄 이유 · 돌격 방어 로그 글 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const r = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; paused=true; const A=W.units.filter(x=>x.side===0&&x.alive&&!x.hero).slice(0,3); sel=new Set(A.map(u=>u.i)); hud();
   const btn=document.querySelector('#orders [data-ord="clump"]'); const has=!!btn; btn&&btn.click(); const ords=A.map(u=>u.order&&u.order.k); const lab=orderLabel(W, ordOf(A[0]));
   paused=false; for(let i=0;i<30;i++) stepWorld(W,1/30); paused=true; sel=new Set([A[0].i]); hud(); const sst=(document.querySelector('#orders .row.sst')||{}).textContent||'';
   L(W,{k:'cbrace',a:A[0].i,b:A[1].i,c:W.units.find(x=>x.side===1).i,vis:true}); const ln=logLines(W,0).filter(l=>/뒤에 몸을 붙여 받침/.test(l));
   return { has, ords, lab, sst, ln }; });
 console.log('    ', JSON.stringify(r).slice(0,500));
 ok(r.has,'🧱 뭉침 단추'); ok(r.ords.every(k=>k==='clump'),'고른 무리에 뭉침 명령'); ok(/뭉침/.test(r.lab),'명령 이름'); ok(/뭉침/.test(r.sst),'상태 줄 — 지금 하는 일: 뭉침'); ok(r.ln.length===1&&!/undefined/.test(r.ln[0]),'돌격 방어 로그 글');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
