const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage(); p.on('pageerror',e=>console.log('ERR',e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(600);
 const d = await p.evaluate(()=>{ const keys=Object.keys(FOE8); const out=[];
   for (const k of keys){ try{ const dsg=foe8(k,2); const e=JSON.parse(JSON.stringify(DESIGN_DEFAULTS[0])); e.side=1; e.x=30; e.y=10; e.id='bpe'; e.hero=false; const u=JSON.parse(JSON.stringify(dsg)); u.side=1; u.x=20; u.y=10; u.id='bpf'; const a=JSON.parse(JSON.stringify(DESIGN_DEFAULTS[0])); a.side=0; a.x=5; a.y=10; a.id='bpa';
     const Sx=JSON.parse(JSON.stringify(S)); Sx.units=[a,u]; Sx.camp=null; const W=createWorld(Sx, JSON.parse(JSON.stringify(rules)), 1, {headless:true}); const w=W.units[1];
     out.push({ name:k, ref:w.ref, tier:w.tier, cls:w.cls, role:w.role, weapon:w.weapon, hp:w.max, atk:w.atk, spd:+(w.spd||0).toFixed(2), wind:w.wind, rec:w.rec, rng:+(w.rng||0).toFixed(2), r:+(w.r||0).toFixed(2), mass:Math.round(w.mass||0), bold:w.bold, ammo:w.ammoMax, sh:w.shield?'방패':(w.armShield?'팔':''), traits:w.traits||[], active:w.active||[], unique:w.unique||[], spec:(w.spec||[]).map(x=>x.k), size:w.sizeCls||'', gear:Object.entries(w.gear||{}).map(([k,v])=>k+':'+v.name+'('+v.mat+v.tier+')').join(' ') }); }catch(e){ out.push({name:k,err:String(e.message).slice(0,60)}); } }
   return { n:keys.length, out }; });
 fs.writeFileSync('bp/dump4.json', JSON.stringify(d)); console.log(d.n, d.out.filter(x=>x.err).length, JSON.stringify(d.out[3]).slice(0,400));
 await b.close(); })();
