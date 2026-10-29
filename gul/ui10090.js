// v9.14.2 UI 시험 — ui10090.js v1.0 (v1.0: 층마다 동료 하나는 꼭 — 2층 · 3층 들어설 때 뽑기 세 장에 동료가 꼭 한 장 이상 (20번) · 뒤집어 받으면 일행에 합류 · 뽑기 글)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 // 1. 입구
 const a = await p.evaluate(async ()=>{ const R=R8S(); const o={ f:[], allyMin:9, e:[] }; const n0=R.party.length;
  for (let k=0;k<20;k++){ const f=2+(k%2); try { r8FloorEnter(f); } catch(e){ o.e.push(e.message); } await new Promise(r=>setTimeout(r,40)); const C=R.drawCards||[]; const na=C.filter(c=>c.k==='ally').length; o.allyMin=Math.min(o.allyMin,na); o.f.push(f+':'+C.map(c=>c.k[0]).join('')); }
  o.txt=/한 장은 꼭 동료/.test((document.getElementById('run8')||{}).textContent||''); const C=R.drawCards; const nm=C.find(c=>c.k==='ally').name; r8DrawTake(C); o.joined=R.party.some(p=>p.name===nm); o.n=[n0,R.party.length]; return o; });
 console.log('    ', JSON.stringify(a).slice(0,400));
 ok(a.allyMin>=1,'층에 들어설 때마다 뽑기에 동료가 꼭 한 장 이상 (20번 중 가장 적을 때 '+a.allyMin+')');
 ok(a.txt,'뽑기 글: 한 장은 꼭 동료'); ok(a.joined&&a.n[1]>a.n[0],'받으면 일행에 합류 ('+a.n.join(' → ')+'명)');
 ok(!a.e.length&&!errs.length,'페이지 오류 없음 '+JSON.stringify([a.e,errs].flat().slice(0,2)));
 await b.close(); console.log(fails?'FAIL '+fails:'ALL OK'); })();
