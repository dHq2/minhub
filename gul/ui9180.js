// v9.7.3 UI 시험 — ui9180.js v1.0 (돌격 방식 단추: 기본 → 공격 → 방어 → 기본 · 상태 줄 표시 · 공격돌격 로그 글 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const r = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; paused=true; const u=W.units.find(x=>x.side===0&&x.alive&&x.canCharge); if(!u) return {none:true}; sel=new Set([u.i]); hud();
   const seq=[]; for(let i=0;i<3;i++){ document.querySelector('#orders [data-ord="chgmode"]').click(); seq.push(u.chgMode||''); }
   document.querySelector('#orders [data-ord="chgmode"]').click(); hud(); const sst=(document.querySelector('#orders .row.sst')||{}).textContent||'';
   L(W,{k:'chgStab',a:u.i,b:W.units.find(x=>x.side===1).i,block:false,run:3.2,vis:true}); const ln=logLines(W,0).filter(l=>/공격돌격 — 달려와/.test(l));
   return { seq, sst, ln }; });
 console.log('    ', JSON.stringify(r).slice(0,400));
 ok(!r.none,'돌격할 수 있는 아군'); ok(r.seq&&r.seq.join(',')==='atk,def,','기본 → 공격 → 방어 → 기본'); ok(/돌격: 공격/.test(r.sst),'상태 줄에 돌격 방식'); ok(r.ln&&r.ln.length===1&&!/undefined/.test(r.ln[0]),'공격돌격 로그 글');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
