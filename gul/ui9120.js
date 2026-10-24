// v9.6.3 UI 시험 — ui9120.js v1.0 (판 분석 고침: 로그에 undefined · 이름 반복 · 정령 계약 섞임이 없음 · 로그 머리에 전우조 · 대장 · 찍기 예고 그림 · 카리우스 기술 예고 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 console.log('A. 자동으로 여러 판 — 로그 글');
 const r = await p.evaluate(()=>{ const out=[]; for (let sd=1; sd<=6; sd++){ resetToEdit(); start(); const W=world; const A=W.units.filter(u=>u.side===0&&u.alive&&!u.hero); cgJoin(W,[A[0],A[1]]); if (A[3]) chiefSet(W,[A[3]],A[2]);
     for (let i=0;i<30*40&&!W.over;i++) stepWorld(W,1/30); draw(); const L=logLines(W,0), txt=L.join('\n');
     const rep = L.filter(l=>{ const m=l.split(' · '); if (m.length<8) return false; const c={}; for(const x of m){ c[x]=(c[x]||0)+1; } return Object.values(c).some(v=>v>=6); });
     out.push({ sd, n: L.length, und: (txt.match(/undefined/g)||[]).length, rep: rep.length, pact8: /정령 계약/.test(txt) && !W.units.some(u=>u.mulKit), head: /🤝 전우조/.test(txt) && /🎖 대장/.test(txt), pacts: L.filter(l=>/🤝 약속/.test(l)).length, dodge: L.filter(l=>/서둘러 빠짐/.test(l)).length }); }
   return out; });
 for (const x of r) console.log('    ', JSON.stringify(x));
 ok(r.every(x=>!x.und),'로그에 undefined 없음'); ok(r.every(x=>!x.rep),'이름이 줄줄이 반복되는 줄 없음'); ok(r.every(x=>!x.pact8),'물레가 없는데 정령 계약 줄이 없음 (협공 약속은 🤝 약속으로)'); ok(r.every(x=>x.head),'로그 머리에 🤝 전우조 · 🎖 대장');
 console.log('B. 찍기 · 카리우스 기술 예고 그림');
 const g = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; const K=W.units.find(u=>u.name==='카리우스'), e=W.units.find(u=>u.side===1&&u.alive); if(!K||!e) return { skip:true };
   e.x=K.x+1.4; e.y=K.y; K.swing='찍기'; let err=null; try { startAct(W,K,e,'시험'); draw(); } catch(x){ err=x.message; } const m1=K.act&&K.act.mode;
   K.act=null; try { startSpec(W,K,e,'ksw','시험'); draw(); } catch(x){ err=err||x.message; } return { m1, sp: K.act&&K.act.s, err }; });
 console.log('    ', JSON.stringify(g)); ok(g.skip||(g.m1==='smash'&&g.sp==='ksw'&&!g.err),'찍기 · 노인의 팔 예고를 그려도 오류 없음');
 await p.screenshot({path:'ui9120_a.png'}).catch(()=>{});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
