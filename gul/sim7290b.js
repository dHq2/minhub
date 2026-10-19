// v7.29.0 세자르 피해 내역 — sim7290b.js v1.2 (v1.2: 큰 일격 하나하나 (누가 · 무엇 · 치명 · 세자르 상태 · 스텝 반응 여부) · v1.1: v1.1: 프레임마다 피가 준 만큼과 로그 피해의 차 (기록 안 된 피해) · 끝 피 · v1.0: 누가 · 무엇으로 · 세자르가 무얼 하던 중에 · 막았나 · 피했나)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const N=+(process.env.N||3), agg={};
 for (let s=0;s<N;s++){ const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); p.on('dialog',d=>d.accept());
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(300); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
  const r = await p.evaluate((s)=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=5; campBuild(5,'down',party); while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   czRise(world,C.stages[5].cz); while (TK){ if (TK.timer) talkDone(); talkAdv(); } const W=world, k=W.units.find(u=>u.brain==='cesar'); let x=12345+s*7919; W.rand=()=>{ x=(x*1103515245+12345)%2147483648; return x/2147483648; };
   const D={}, add=(key,v)=>{ D[key]=(D[key]||0)+v; }; let k0=W.log.length; mode='run'; paused=false;
   for (let i=0;i<3600&&!W.over&&k.alive;i++){ const st=k.act?(k.act.k==='cz'?'cz:'+k.act.s:k.act.k+':'+(k.act.phase||'')):k.cz.fury?'idle-fury':'idle-probe'; const hp0=k.hp, kk=W.log.length; stepWorld(W,1/30); { let h=0; for (const l of W.log.slice(kk)) if (l.k==='hit'&&l.b===k.i) h+=l.dmg; const dd=hp0-k.hp-h; if (dd>0.5) add('unlogged '+st,dd); } try{ czEvTick(W); czCutTick(W); }catch(e){}
     while (TK){ if (TK.timer) talkDone(); talkAdv(); }
     for (const l of W.log.slice(k0)){ if (l.k==='hit'&&l.b===k.i){ add('by '+W.units[l.a].name,l.dmg); add('tag '+(l.tag||'(평타)'),l.dmg); add('st '+st,l.dmg); add('blk '+l.block,l.dmg); add('n hits',1); (D.L=D.L||[]).push([+W.t.toFixed(1),W.units[l.a].name,l.tag||'',l.dmg,l.crit?'치명':'',st,W.units[l.a].act?(W.units[l.a].act.mode||W.units[l.a].act.k):'']); }
       if (l.k==='hit'&&l.a===k.i) add('cz dealt',l.dmg); if (l.b===k.i&&l.k!=='hit'&&(l.dmg||l.c)) add('other '+l.k+' '+(l.tag||l.why||''),l.dmg||l.c||0); if (l.b===k.i) add('kind '+l.k,1); if (l.k==='evade'&&l.b===k.i) add('cz evaded',1); if (l.k==='block'&&l.b===k.i) add('cz blocked',1); if (l.k==='czStep') add('steps',1); } k0=W.log.length; }
   paused=true; D.T=W.t; D.endHp=k.hp; D.max=k.max; return D; }, s); console.log(JSON.stringify(r)); for (const k in r) agg[k]=(agg[k]||0)+r[k]; await ctx.close(); }
 console.log('== 합 '+N+'판'); for (const k of Object.keys(agg).sort()) console.log('  '+k+': '+Math.round(agg[k]/N));
 await b.close(); })();
