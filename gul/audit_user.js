// 점검 — audit_user.js v1.0 (유저 판 그대로 재현: 개활지 · 아군 인주 · 카리우스 · 레베카 · 청광묵 · 옐로 · 트라카 · 노먼 / 적 똥개 4 · 검기사 · 궁수 · 관계 (청광묵 · 옐로 · 트라카 → 레베카 · 인주 · 노먼 → 카리우스 · 카리우스 ↔ 레베카 전우) · 횃불 끔 · 손 안 댐 · N판 통계)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto('file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const N = +(process.argv[3]||10);
 const out = await p.evaluate((N)=>{ const res=[]; setMode('train');
  for (let r=0;r<N;r++){ resetToEdit(); const H=S.H; const mkD=(k,s,x,y)=>{ const d=(s===1&&FOE8[k])?fromDesign(clone(FOE8[k]),1):fromDesign(designByKey(k),s); return { ...d, x, y, id: uid() }; };
   S.units=[ mkD('인주',0,17.5,H-1.5), mkD('카리우스',0,16.5,H-1.5), mkD('레베카',0,14.5,H-1.5), mkD('청광묵',0,15.5,H-0.8), mkD('옐로',0,15.5,H-2.2), mkD('트라카',0,14.5,H-0.8), mkD('노먼',0,16.5,H-2.5),
     mkD('똥개',1,16.5,H-6.5), mkD('똥개',1,15.5,H-7.5), mkD('똥개',1,14.5,H-7.5), mkD('똥개',1,13.5,H-7.5), mkD('검기사',1,11.5,H-8.5), mkD('궁수',1,10.5,H-8.5) ];
   const nm=n=>S.units.find(u=>u.side===0&&u.name===n); S.units.forEach(u=>{ if(u.side===0){ u.chiefNm=''; u.cg=''; } });
   ['청광묵','옐로','트라카'].forEach(n=>nm(n).chiefNm='레베카'); ['인주','노먼'].forEach(n=>nm(n).chiefNm='카리우스'); nm('카리우스').cg='m1'; nm('레베카').cg='m1';
   rebuildMap(); changed(); start(); const W=world; paused=true;
   const A=W.units.find(u=>u.side===1&&u.name==='궁수'); let seenT=0, tA=0, firstTgt=null, downT=null, firstSeen=null; const whyA={}, tgtBy={};
   for (let i=0;i<30*45 && !W.over;i++){ stepWorld(W,1/30); if (A.alive&&!A.down){ tA++; if (A.seenBy){ seenT++; if(firstSeen==null) firstSeen=+W.t.toFixed(1); } for (const u of W.units) if (u.side===0&&u.alive&&!u.down){ if (u.target===A){ if(firstTgt==null) firstTgt=+W.t.toFixed(1); tgtBy[u.name]=(tgtBy[u.name]||0)+1; } if (i%15===0){ const k=u.name+':'+(u.why||'-'); whyA[k]=(whyA[k]||0)+1; } } } else if (downT==null) downT=+W.t.toFixed(1); }
   const L=W.log, side0=i=>W.units[i]&&W.units[i].side===0, cnt=k=>L.filter(l=>l.k===k&&side0(l.a)).length;
   const AH=L.filter(l=>l.k==='hit'&&side0(l.b)&&l.a===A.i);
   res.push({ firstSeen, firstTgt, downT, tgtBy, whyA, r, over: W.result||'-', t:+W.t.toFixed(1), alive: W.units.filter(u=>u.side===0&&u.alive&&!u.down).length, archerDown: !A.alive||!!A.down, archerHits: AH.length, back: AH.filter(l=>l.dir==='back').length, blk: AH.filter(l=>l.block).length,
     archerDmg: L.filter(l=>l.k==='hit'&&l.b===A.i).reduce((s,l)=>s+(l.dmg||0),0), seen: tA?+(seenT/tA).toFixed(2):null, supp0: L.filter(l=>l.k==='supp'&&side0(l.a)).length, hc: cnt('hitCover'), peek: cnt('peek'), cbrace: cnt('cbrace'), pairGo: cnt('pairGo'), stayShot: cnt('stayShot'), regroup: cnt('regroup') }); }
  return res; }, N);
 const avg=k=>{ const v=out.map(o=>o[k]).filter(x=>x!=null&&typeof x==='number'); return v.length? +(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):null; };
 if (process.argv[4]) for (const o of out.slice(0,+process.argv[4])) console.log(JSON.stringify({ r:o.r, firstSeen:o.firstSeen, firstTgt:o.firstTgt, downT:o.downT, hits:o.archerHits, tgtBy:o.tgtBy, why:Object.entries(o.whyA).sort((a,b)=>b[1]-a[1]).slice(0,22).map(([k,v])=>k+'×'+v).join(' ') }));
 const dts=out.map(o=>o.downT).filter(x=>x!=null).sort((a,b)=>a-b); console.log('archer downT', JSON.stringify(dts)); console.log(JSON.stringify({ n: out.length, win: out.filter(o=>o.over==='win').length, lose: out.filter(o=>o.over==='lose').length, archerDown: out.filter(o=>o.archerDown).length, ...Object.fromEntries(['alive','archerHits','back','blk','archerDmg','seen','supp0','hc','peek','cbrace','pairGo','stayShot','regroup'].map(k=>[k,avg(k)])) }));
 console.log('errs', JSON.stringify(errs.slice(0,3))); await b.close(); })();
