// v9.7.0 UI 시험 — ui9150.js v1.0 (무기 그림 · 명령 칸 핵심/전술/고급 · 접기 · 횃불 단추 숨김 · 상태 줄 · 일행 상한 없음 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 for (const [w,h] of [[1440,900],[1565,885]]){
 const p=await (await b.newContext({viewport:{width:w,height:h}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const r = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; paused=true; const u=W.units.find(x=>x.side===0&&x.canGuard)||W.units.find(x=>x.side===0&&!x.hero); sel=new Set([u.i]); hud(); draw();
   const o=document.getElementById('orders'); const has=k=>!!o.querySelector(`[data-ord="${k}"]`);
   const a={ core: !!o.querySelector('.row.core'), sst: (o.querySelector('.row.sst')||{}).textContent||'', torchT: has('torchT'), flare: has('flare'), torch: has('torch'), scout0: has('scout'), amove: has('amove'), guard: has('guard') };
   o.querySelector('[data-ord="grp:tac"]').click(); a.scout1=!!document.getElementById('orders').querySelector('[data-ord="scout"]');
   a.ic=W.units.filter(x=>x.alive).map(x=>x.name+':'+(wpIcon(W,x)||'-')).slice(0,10).join(' '); a.cap=R8.cap; return a; });
 console.log('    ', JSON.stringify(r).slice(0,600));
 ok(r.core&&r.amove&&r.guard,'핵심 줄 (공격 이동 · 막기)'); ok(/❤/.test(r.sst)&&/교전|싸움|판단|보면|/.test(r.sst),'상태 줄'); ok(!r.torchT&&!r.flare&&!r.torch,'횃불 단추 숨김');
 ok(!r.scout0&&r.scout1,'전술 접기 → 펼치면 정찰'); ok(/[🗡🔱🏹🔫🔨🪓🔪🪄]/u.test(r.ic),'무기 그림'); ok(r.cap===Infinity,'일행 상한 없음');
 await p.waitForTimeout(300); await p.screenshot({path:`shot9150_${w}.png`});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3))); await p.close(); }
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
