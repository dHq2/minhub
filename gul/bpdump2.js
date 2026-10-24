const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage(); p.on('pageerror',e=>console.log('ERR',e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(600);
 const d = await p.evaluate(()=>{ const o={}; o.DESIGN=JSON.parse(JSON.stringify(DESIGN_DEFAULTS)); o.PROFILE=JSON.parse(JSON.stringify(PROFILE));
   // 파생 수치: 설계를 판에 올려 엔진이 계산한 값
   const list=[...DESIGN_DEFAULTS.map(x=>({...x,_k:'아군설계'})), ...FOE9.map(f=>({...foe8(f[0],2),_k:'2층 적',_nm:f[0]}))];
   const out=[];
   for (const dsg of list){ try{ const u=JSON.parse(JSON.stringify(dsg)); u.side=0; u.x=20; u.y=10; u.id='bp'+out.length; const e=JSON.parse(JSON.stringify(DESIGN_DEFAULTS[0])); e.side=1; e.x=30; e.y=10; e.id='bpe'; e.hero=false;
     const Sx=JSON.parse(JSON.stringify(S)); Sx.units=[u,e]; Sx.camp=null; const W=createWorld(Sx, JSON.parse(JSON.stringify(rules)), 1, { headless:true }); const w=W.units[0];
     out.push({ k:dsg._k, name:w.name, ref:w.ref, tier:w.tier, cls:w.cls, role:w.role, weapon:w.weapon, hp:w.max, atk:w.atk, spd:+(w.spd||0).toFixed(2), wind:w.wind, rec:w.rec, rng:+(w.rng||0).toFixed(2), r:+(w.r||0).toFixed(2), mass:Math.round(w.mass||0), bold:w.bold, ammo:w.ammoMax, sh:w.shield?(w.shSize||'보통'):(w.armShield?'팔':''), nv:w.nv?(w.nvG||'B'):'', traits:(w.traits||[]), active:(w.active||[]), unique:(w.unique||[]), spec:(w.spec||[]).map(x=>x.k), skill:w.skill?w.skill.name:'', gear:Object.entries(w.gear||{}).map(([k,v])=>k+':'+v.name+'('+v.mat+v.tier+')').join(' '), size:w.sizeCls||'', canCharge:!!w.canCharge, canLeap:!!w.canLeap, giant:!!w.giant, bless:w.kit0?undefined:undefined }); }
     catch(e){ out.push({name:dsg.name||dsg._nm, err:String(e.message).slice(0,80)}); } }
   o.UNITS=out; return o; });
 fs.writeFileSync('bp/dump2.json', JSON.stringify(d)); console.log(d.UNITS.length, d.UNITS.filter(x=>x.err).map(x=>x.name+':'+x.err).join(' | ').slice(0,300)); console.log(JSON.stringify(d.UNITS[2]).slice(0,700));
 await b.close(); })();
