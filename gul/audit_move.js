// 점검 — audit_move.js v1.0 (움직임: 유저 판 관계 그대로 · 대장에게 4초마다 이동 명령 · 순간이동 (한 틱 큰 이동) · 떨림 (걸은 길 ÷ 실제 옮긴 거리) · 비집기 · 대장 길 막힘)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto('file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const N=+(process.argv[3]||4), withFoe=process.argv[4]!=='nofoe';
 const out = await p.evaluate(([N,withFoe])=>{ const res=[]; setMode('train');
  for (let r=0;r<N;r++){ resetToEdit(); const H=S.H; const mkD=(k,s,x,y)=>{ const d=(s===1&&FOE8[k])?fromDesign(clone(FOE8[k]),1):fromDesign(designByKey(k),s); return { ...d, x, y, id: uid() }; };
   S.units=[ mkD('인주',0,15.5,H-1.5), mkD('카리우스',0,16.5,H-2), mkD('레베카',0,14.5,H-2), mkD('청광묵',0,15.5,H-0.8), mkD('모닝스타',0,14.5,H-1), mkD('노먼',0,16.5,H-0.8), mkD('가윤',0,17.5,H-1.2), mkD('검방패기사',1,withFoe?3.5:0.8,withFoe?1.5:0.8) ];
   const nm=n=>S.units.find(u=>u.side===0&&u.name===n); S.units.forEach(u=>{ if(u.side===0){ u.chiefNm=''; u.cg=''; } });
   nm('인주').chiefNm='카리우스'; nm('가윤').chiefNm='카리우스'; nm('가윤').chiefMode='cover'; ['청광묵','모닝스타','노먼'].forEach(n=>nm(n).chiefNm='레베카'); nm('노먼').chiefMode='cover'; nm('카리우스').cg='m1'; nm('레베카').cg='m1'; nm('청광묵').cg='m2'; nm('모닝스타').cg='m2';
   rebuildMap(); changed(); start(); const W=world; paused=true; if(!withFoe) W.units.filter(u=>u.side===1).forEach(u=>{ u.order={k:'hold'}; u.spdMul=0; u.alive=true; u.hidden=true; u.x=0.8; u.y=0.8; }); const A=W.units.filter(u=>u.side===0); const C=A.find(u=>u.name==='카리우스'), Rb=A.find(u=>u.name==='레베카');
   const st={}; A.forEach(u=>st[u.i]={ path:0, maxStep:0, maxAt:null, x0:u.x, y0:u.y, rev:0, lastDir:null }); let blocked=0, chT=0, stillT=0, idleMove=0; const cpre={x:0,y:0};
   const tgts=[[12,H-6],[20,H-8],[14,H-11],[22,H-4],[10,H-9],[18,H-12]]; let ti=0;
   for (let i=0;i<30*24 && !W.over;i++){ if (i%180===0){ const [x,y]=tgts[ti++%tgts.length]; C.order={k:'move',x,y}; C.path=null; }
     const pre=A.map(u=>[u.x,u.y]); stepWorld(W,1/30); const cStill = !(C.order&&C.order.k==='move') && Math.hypot(C.x-pre[A.indexOf(C)][0],C.y-pre[A.indexOf(C)][1])<0.005; if (cStill){ stillT++; if (stillT>30) A.forEach((u,k)=>{ if(u!==C&&u!==Rb) idleMove+=Math.hypot(u.x-pre[k][0],u.y-pre[k][1]); }); } else stillT=0;
     A.forEach((u,k)=>{ const dx=u.x-pre[k][0], dy=u.y-pre[k][1], d=Math.hypot(dx,dy), s=st[u.i]; s.path+=d; if(d>s.maxStep){ s.maxStep=d; s.maxAt=+W.t.toFixed(2)+' '+(u.why||'')+' '+(u.act&&u.act.k||''); } if (d>0.01){ const dir=Math.atan2(dy,dx); if (s.lastDir!=null && Math.cos(dir-s.lastDir)<-0.5) s.rev++; s.lastDir=dir; } });
     if (C.order&&C.order.k==='move'){ chT++; const hx=C.path&&C.path[0]?C.path[0].x-C.x:0, hy=C.path&&C.path[0]?C.path[0].y-C.y:0, hl=Math.hypot(hx,hy); if (hl>0.05 && A.some(o=>o!==C&&o.chiefLk&&o.sqLead===C.i&&((o.x-C.x)*hx+(o.y-C.y)*hy)/hl>0&&((o.x-C.x)*hx+(o.y-C.y)*hy)/hl<C.r+o.r+1.2&&Math.abs((o.x-C.x)*hy-(o.y-C.y)*hx)/hl<C.r+o.r)) blocked++; } }
   const L=W.log; res.push({ idleMove:+idleMove.toFixed(2), rev: A.reduce((a,u)=>a+st[u.i].rev,0), maxStep: Math.max(...A.map(u=>st[u.i].maxStep)), r, sq: L.filter(l=>l.k==='squeeze').length, blockedFrac: chT?+(blocked/chT).toFixed(2):0, units: A.map(u=>{ const s=st[u.i]; return u.name+': 길 '+s.path.toFixed(0)+' · 되돌기 '+s.rev+' · 최대 한 틱 '+s.maxStep.toFixed(2)+' @'+s.maxAt; }) }); }
  return res; }, [N,withFoe]);
 const av=k=>+(out.reduce((a,o)=>a+o[k],0)/out.length).toFixed(2); console.log('AVG idleMove', av('idleMove'), 'rev', av('rev'), 'blocked', av('blockedFrac'), 'maxStep', Math.max(...out.map(o=>o.maxStep)).toFixed(2)); if (process.env.V) for (const o of out){ console.log('run', o.r, 'squeeze', o.sq, '대장 길 막힘', o.blockedFrac); for (const s of o.units) console.log('   ', s); }
 console.log('errs', JSON.stringify(errs.slice(0,3))); await b.close(); })();
