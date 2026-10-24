// v9.5.0 UI 시험 — ui9070.js v1.0 (2층 연기 시험: 열한 칸 + 만남을 하나씩 들어가 아군이 가까운 적에게 공격 이동 (amove) 하며 40초 돌림 · 오류 · NaN · 멈춤이 없는지 · 몇 판이나 이겼는지 (참고))
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join('|'))); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(400);
 const SEQ=['ruin2a','ruin2b','?','gfight1','fmap2','?','gstair1','gstair2','fmap3','?','gboss1'];
 const res=[];
 for (let i=0;i<SEQ.length;i++){ if (SEQ[i]==='?') continue;
   const r = await p.evaluate((i)=>{ const R=R8S(); const nd=R.fm.rows[i][0]; const o={ i, e:[], base:nd.src8 }; world=null; try { r8Enter(nd); } catch(e){ o.e.push('enter '+e.message+' '+(e.stack||'').split('\n')[1]); return o; } const W=world; paused=true; if (TK) talkClose();
     const n0=W.units.filter(u=>u.side!==0&&u.alive&&!u.summon).length; o.foes=n0; o.allies=W.units.filter(u=>u.side===0&&u.alive&&!u.summon).length;
     try { for (let k=0;k<1200&&!W.over;k++){ if (k%60===0){ const F=W.units.filter(u=>u.side===1&&u.alive); for (const a of W.units) if (a.side===0&&a.alive&&!a.summon&&F.length){ const f=F.slice().sort((p,q)=>Math.hypot(p.x-a.x,p.y-a.y)-Math.hypot(q.x-a.x,q.y-a.y))[0]; a.order={k:'amove',x:f.x,y:f.y}; } } stepWorld(W,1/30); if (k%200===0) for (const u of W.units) if (!isFinite(u.x)||!isFinite(u.y)||!isFinite(u.hp)) throw new Error('NaN '+u.name); }
     } catch(e){ o.e.push('sim '+e.message+' '+(e.stack||'').split('\n')[1]); }
     o.t=+W.t.toFixed(1); o.left=W.units.filter(u=>u.side===1&&u.alive).length; o.alive=W.units.filter(u=>u.side===0&&u.alive&&!u.summon).length; o.over=!!W.over; o.res=W.result; try { draw(); } catch(e){ o.e.push('draw '+e.message); } world=null; try { r8NodeDone(); } catch(e){} return o; }, i);
   res.push(r); console.log('    '+SEQ[i]+' '+JSON.stringify({foes:r.foes,allies:r.allies,t:r.t,left:r.left,alive:r.alive,over:r.over,res:r.res,e:r.e}));
 }
 ok(res.every(r=>!r.e.length),'열한 칸 중 싸움 여덟을 40초씩 돌려도 오류 · NaN 없음');
 ok(res.every(r=>r.t>=1||r.over),'판이 멈추지 않고 돎');
 const w=res.filter(r=>r.res==='win'||(r.left===0)).length; console.log('    (참고) 40초 안에 적을 모두 쓰러뜨린 판 '+w+' / '+res.length+' — 공격 이동만 하는 단순한 지휘');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
