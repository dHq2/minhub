// v9.9.9 점검 — audit999.js v1.0 (유저 판 재현: 기본 훈련장 · 관계 (청광묵 · 옐로 · 트라카 → 레베카 / 인주 · 노먼 → 카리우스 / 카리우스 ↔ 레베카 전우) · 손 안 댐 · 여러 판 통계)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto('file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const N = +(process.argv[3]||6), torch = process.argv[4]||'off';
 const out = await p.evaluate(([N,torch])=>{ const res=[];
  for (let r=0;r<N;r++){ resetToEdit(); const nm=n=>S.units.find(u=>u.side===0&&u.name===n);
   for (const u of S.units) if (u.side===0){ u.chiefNm=''; u.cg=''; }
   ['청광묵','옐로','트라카'].forEach(n=>{ const p=nm(n); if(p) p.chiefNm='레베카'; }); ['노먼'].forEach(n=>{ const p=nm(n); if(p) p.chiefNm='카리우스'; }); const hp=S.units.find(u=>u.hero); if(hp) hp.chiefNm='카리우스';
   if (nm('카리우스')&&nm('레베카')){ nm('카리우스').cg='m1'; nm('레베카').cg='m1'; }
   start(); const W=world; if (torch==='on') for (const u of W.units) if (u.torch) u.torchOff=false; computeLight(W); paused=true;
   const A=W.units.find(u=>u.side===1&&/궁수/.test(u.name)); const st={ seenT:0, t:0, firstSeen:null }; const hitBy={}; 
   for (let i=0;i<30*40 && !W.over;i++){ stepWorld(W,1/30); if (A&&A.alive){ st.t++; if (A.seenBy) { st.seenT++; if(st.firstSeen==null) st.firstSeen=+W.t.toFixed(1); } } }
   const L=W.log, al=W.units.filter(u=>u.side===0), name=i=>(W.units[i]||{}).name;
   const shots={}; for (const l of L) if (l.k==='wind'&&W.units[l.a]&&W.units[l.a].side===0&&isFar(W.units[l.a])) { const k=name(l.a)+'→'+name(l.b); shots[k]=(shots[k]||0)+1; }
   const holds={}; for (const l of L) if (l.k==='hold'&&W.units[l.a]&&W.units[l.a].side===0){ holds[name(l.a)]=(holds[name(l.a)]||0)+1; }
   const cnt=k=>L.filter(l=>l.k===k&&W.units[l.a]&&W.units[l.a].side===0).length;
   const darkHits=L.filter(l=>l.k==='hit'&&W.units[l.b]&&W.units[l.b].side===0&&A&&l.a===A.i).length;
   const AH=L.filter(l=>l.k==='hit'&&W.units[l.b]&&W.units[l.b].side===0&&A&&l.a===A.i); const back=AH.filter(l=>l.dir==='back').length, blk=AH.filter(l=>l.block).length; const supp0=L.filter(l=>(l.k==='supp'||l.k==='suppFire'||l.k==='suppOrd')&&W.units[l.a]&&W.units[l.a].side===0).length; const archerDmg=L.filter(l=>l.k==='hit'&&A&&l.b===A.i).reduce((s,l)=>s+(l.dmg||0),0);
   res.push({ r, back, blk, supp0, hc: cnt('hitCover'), archerDmg, over: W.result||null, t:+W.t.toFixed(1), aliveA: al.filter(u=>u.alive&&!u.down).map(u=>u.name).join(','), archerHp: A?Math.round(A.hp):null, archerSeen: st.t?+(st.seenT/st.t).toFixed(2):null, firstSeen: st.firstSeen, shots, holds, peek: cnt('peek'), cbrace: cnt('cbrace'), pairGo: cnt('pairGo'), archerHits: darkHits }); }
  return res; }, [N,torch]);
 for (const o of out) console.log(JSON.stringify(o)); console.log('errs', JSON.stringify(errs.slice(0,3))); await b.close(); })();
