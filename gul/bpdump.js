const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage(); p.on('pageerror',e=>console.log('ERR',e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(600);
 const d = await p.evaluate(()=>{ const safe=n=>{ try{ return JSON.parse(JSON.stringify(eval(n), (k,v)=>typeof v==='function'?'[fn]':v)); }catch(e){ return null; } };
   const o={}; for (const n of ['DEFAULT_RULES','TRAITS','ACTIVE','UNIQUE','ROSTER','FIX8','FOE9','ENC8','MNPC8','COMP8','LAY8','PAIR8','GROW','RELIC8','F8','SLOTS','H2K','EQART9','ABYSS_ART','R8_TH','ENC8T']) o[n]=safe(n);
   o.S0=JSON.parse(JSON.stringify(S.units)); o.globals=Object.keys(window).filter(k=>/^[A-Z][A-Z0-9_]{2,}$/.test(k)).join(' '); return o; });
 fs.writeFileSync('bp/dump.json', JSON.stringify(d)); console.log(Object.keys(d).map(k=>k+':'+(d[k]?JSON.stringify(d[k]).length:0)).join(' ')); console.log(d.globals);
 await b.close(); })();
