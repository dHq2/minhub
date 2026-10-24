const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const p=await (await b.newContext()).newPage(); p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(900);
 const r = await p.evaluate(()=>{ const T=typeof TRAITS!=='undefined'?TRAITS:{}, A=typeof ACTIVE!=='undefined'?ACTIVE:{}, U=typeof UNIQUE!=='undefined'?UNIQUE:{}; const o={ nT:Object.keys(T).length, nA:Object.keys(A).length, nU:Object.keys(U).length };
   const names=[['T',T],['A',A],['U',U]]; const seen={}; for (const [n,t] of names) for (const k of Object.keys(t)){ (seen[k]=seen[k]||[]).push(n); }
   o.dup=Object.entries(seen).filter(([k,v])=>v.length>1).map(([k,v])=>k+':'+v.join('+'));
   // 설계 · 도감 이름표 속 특성 중 정의 없는 것
   const all=new Set([...Object.keys(T),...Object.keys(A),...Object.keys(U)]); const grade=k=>k.replace(/[SABCDE]$/,''); const undefd={};
   const lists=[]; if (typeof FOE8!=='undefined') for (const [k,d] of Object.entries(FOE8)) lists.push([k,d.traits||[],d.active||[]]);
   if (typeof DESIGNS!=='undefined') for (const d of DESIGNS) lists.push([d.key||d.name,d.traits||[],d.active||[]]);
   for (const [who,tr,ac] of lists){ for (const t of tr){ if (!(t in T) && !(grade(t) in T) && !(t in U)) (undefd[t]=undefd[t]||[]).push(who); } for (const a of ac){ if (!(a in A) && !(a in U)) (undefd['기술:'+a]=undefd['기술:'+a]||[]).push(who); } }
   o.undef=Object.entries(undefd).map(([k,v])=>k+' ← '+v.slice(0,3).join(',')+(v.length>3?' …'+v.length:''));
   o.lists=lists.length; return o; });
 console.log(JSON.stringify(r,null,1)); await b.close(); })();
