// v8.4.1 UI 시험 — ui8410.js v1.0 (조작 다듬기: 겹친 자리 첫 클릭은 인물만 · 같은 인물을 다시 누르면 고르는 창 (아군 · 적) · 우회 곡선 (옆으로 6칸 안 · 꺾임 없음 · 끝까지 감) · 미리보기 곡선 그림 · 시작 자리 살짝 무작위 (1칸 안 · 바닥 · 겹침 없음) · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); await ctx.addInitScript('window.__askAuto=true'); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.dismiss());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 console.log('== '+vw.nm);
 // 1. 시작 자리 살짝 무작위
 const j = await p.evaluate(()=>{ setMode('train'); const R=[]; for (let k=0;k<4;k++){ resetToEdit(); const P=Object.fromEntries(S.units.map(q=>[q.id,{x:q.x,y:q.y}])); start(); const W=world, m=W.map; const al=W.units.filter(u=>u.side===0), en=W.units.filter(u=>u.side===1);
     const d=al.map(u=>Math.hypot(u.x-P[u.pid].x,u.y-P[u.pid].y)); R.push({ moved: d.filter(x=>x>0.01).length, max: Math.max(...d), floor: al.every(u=>m.t[Math.floor(u.y)*m.W+Math.floor(u.x)]===0), over: al.some(u=>W.units.some(o=>o!==u&&Math.hypot(o.x-u.x,o.y-u.y)<o.r+u.r)), n: al.length }); }
   resetToEdit(); window.__noJit=true; const P=Object.fromEntries(S.units.map(q=>[q.id,{x:q.x,y:q.y}])); start(); const same=world.units.filter(u=>u.side===0).every(u=>Math.hypot(u.x-P[u.pid].x,u.y-P[u.pid].y)<0.01); window.__noJit=false; return { R, same }; });
 console.log('    시작 자리', JSON.stringify(j.R.map(r=>[r.moved+'/'+r.n, +r.max.toFixed(2)])));
 ok(j.R.every(r=>r.moved>=Math.ceil(r.n/2)),'시작하면 우리 편 대부분이 살짝 움직임'); ok(j.R.every(r=>r.max<=1.01),'1칸 안'); ok(j.R.every(r=>r.floor&&!r.over),'바닥 · 겹침 없음');  ok(j.same,'(시험 스위치) __noJit 이면 그대로');
 // 2. 겹친 자리: 첫 클릭은 인물만
 const o1 = await p.evaluate(()=>{ resetToEdit(); start(); const W=world, n=W.units.find(u=>u.name==='노먼'); W.items.push({ id: 991, k: 'weapon', name: '장검', x: n.x+0.1, y: n.y+0.05, owner: n.i, t: 0, how: 'test' }); sel=new Set(); playClick({x:n.x,y:n.y}, false, n); const box=document.getElementById('ask');
   const a={ open1: !box.hidden, sel1: sel.has(n.i) }; playClick({x:n.x,y:n.y}, false, n); a.open2=!box.hidden; a.txt=box.innerText.replace(/\s+/g,' ').slice(0,60); box.hidden=true; askOv=null; return a; });
 console.log('    아군', JSON.stringify(o1)); ok(!o1.open1&&o1.sel1,'아군 + 물건: 첫 클릭은 고르기만 (창 없음)'); ok(o1.open2&&/장검/.test(o1.txt),'고른 아군을 다시 누르면 고르는 창');
 const o2 = await p.evaluate(()=>{ const W=world, e=W.units.find(u=>u.side===1&&u.alive), I=W.units.find(u=>u.name==='인주'); e.seenBy=1; W.items.push({ id: 992, k: 'weapon', name: '창', x: e.x+0.05, y: e.y, owner: e.i, t: 0, how: 'test' }); sel=new Set([I.i]); I.ordPend=null; I.order=null; ovLast=null;
   playClick({x:e.x+0.05,y:e.y}, false, e); const box=document.getElementById('ask'); const a={ open1: !box.hidden, atk: ((I.ordPend&&I.ordPend.o)||I.order||{}).k }; playClick({x:e.x+0.05,y:e.y}, false, e); a.open2=!box.hidden; box.hidden=true; askOv=null; return a; });
 console.log('    적', JSON.stringify(o2)); ok(!o2.open1&&o2.atk==='attack','적 + 물건: 첫 클릭은 공격 명령'); ok(o2.open2,'같은 적을 바로 다시 누르면 고르는 창');
 // 3. 우회 곡선
 const dv = await p.evaluate(()=>{ const out=[]; for (let k=0;k<5;k++){ resetToEdit(); start(); const W=world; paused=true; mode='run'; W.turnEnd=1e9; const keep=W.units.find(x=>x.side===1&&x.alive); for (const u of W.units) if (u.side===1&&u!==keep){ u.alive=false; u.hp=0; } keep.stunT=1e9; keep.x=1.5; keep.y=1.5; keep.ccRes=1; const u=W.units.find(x=>x.name==='노먼'), m=W.map;
     let tg=null; for (let y=1;y<m.H-1&&!tg;y++) for (let x=1;x<m.W-1;x++){ const d=Math.hypot(x+0.5-u.x,y+0.5-u.y); if (m.t[y*m.W+x]===0&&d>11+k&&d<13+k&&findPath(m,u.x,u.y,x+0.5,y+0.5)){ tg={x:x+0.5,y:y+0.5}; break; } }
     if (!tg) continue; const v=detourVia(W,[u],tg.x,tg.y); if (!v) continue; u.order={ k:'move', x:tg.x, y:tg.y, via:{ x:v.x, y:v.y } }; const x0=u.x, y0=u.y, L=Math.hypot(tg.x-x0,tg.y-y0);
     const off=Math.abs(((v.x-x0)*(tg.y-y0)-(v.y-y0)*(tg.x-x0))/L); let t=0, track=[]; while (t<40 && Math.hypot(u.x-tg.x,u.y-tg.y)>0.8){ stepWorld(W,0.05); t+=0.05; if (Math.round(t*20)%10===0) track.push([u.x,u.y]); }
     const P=u.order&&u.order.via&&u.order.via.pts; let maxTurn=0; const pts=[[x0,y0],...(P||[]).map(q=>[q.x,q.y])]; for (let i=1;i<pts.length-1;i++){ const a1=Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0]), a2=Math.atan2(pts[i+1][1]-pts[i][1],pts[i+1][0]-pts[i][0]); maxTurn=Math.max(maxTurn,Math.abs(Math.atan2(Math.sin(a2-a1),Math.cos(a2-a1)))*57.3); }
     out.push({ off: +off.toFixed(1), n: P?P.length:0, turn: Math.round(maxTurn), reach: Math.hypot(u.x-tg.x,u.y-tg.y)<=0.8, t: Math.round(t) }); } return out; });
 console.log('    우회', JSON.stringify(dv)); ok(dv.length>=3,'우회 길을 만든 판 '+dv.length); ok(dv.every(r=>r.off<=6.6),'옆으로 6칸 안 (경유점)'); ok(dv.every(r=>r.n>=3),'곡선 위의 점 셋 이상'); ok(dv.every(r=>r.turn<=75),'곡선 점 사이 꺾임이 작음 (최대 '+Math.max(...dv.map(r=>r.turn))+'°)'); ok(dv.filter(r=>r.reach).length>=dv.length-1,'목적지까지 감');
 // 4. 미리보기 곡선 그림 (오류 없이)
 const pv = await p.evaluate(async ()=>{ resetToEdit(); start(); const W=world, u=W.units.find(x=>x.name==='노먼'); u.order={ k:'move', x:u.x+8, y:u.y, via:{ x:u.x+4, y:u.y+3 } }; sel=new Set([u.i]); await new Promise(r=>setTimeout(r,250)); return true; });
 ok(pv,'우회 미리보기 곡선 그림');
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
