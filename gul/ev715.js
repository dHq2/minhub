// v7.15 시험 — ev715.js v1 (회피기동: 사수 쏘고 물러남 · 친칠라 뒤로 도약 · 청광묵 흘려 빠지기 · 포위 빠지기 — 켬 / 끔 비교)
const {E,DES,NOR,INJ,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const lit=W=>{ W.torches=[{x:10,y:8,r:30}]; E.computeLight(W); };
const CHI={ref:'C-106',name:'친칠라',tier:2,cls:'원거리',role:'사수',weapon:'하얀 나무',ammo:30,sm:1.34,height:1.65,nv:true,nvG:'S',ov:{hp:100,atk:24},traits:['사격A','은신S'],active:['도약']};
const off=W=>{ W.rules.evadeMv.on=false; };

console.log('A. 노먼: 근접이 다가오면 쏘고 물러남 (검기사 1 · 20판 · 8초)');
{ const R={}; for (const on of [true,false]){ let tk=0,kite=0,dmg=0,shots=0; for(let sd=1;sd<=20;sd++){ const W=W_([mk(NOR,0,6,8),mk(INJ,0,2,15,{hero:true})],[mk(DES['검기사'],1,11,8)],sd,'free'); lit(W); if(!on) off(W);
      const n=W.units[0], k=W.units[2]; k.target=n; k.state='hunt'; run(W,8,()=>{ if(!n.alive) W.over=true; });
      kite+=W.log.filter(x=>x.k==='evade'&&x.a===n.i).length; tk+=W.log.filter(x=>x.k==='hit'&&x.a===k.i&&x.b===n.i).length; dmg+=W.log.filter(x=>x.k==='hit'&&x.a===k.i&&x.b===n.i).reduce((s,x)=>s+(x.dmg||0),0); shots+=n.shots||0; }
    R[on?'켬':'끔']={회피기록:kite,맞음:tk,피해:dmg,쏜수:shots}; }
  console.log('    ', JSON.stringify(R)); ok(R['켬'].회피기록>0,'회피기동 기록이 남음'); ok(R['켬'].피해<R['끔'].피해,'켜면 근접에게 덜 맞음'); ok(R['켬'].쏜수>=R['끔'].쏜수*0.7,'물러나도 쏘기는 계속'); }

console.log('B. 친칠라: 다가오면 뒤로 도약하며 쏨');
{ let lp=0,ls=0; for(let sd=1;sd<=10;sd++){ const W=W_([mk(CHI,0,6,8),mk(INJ,0,2,15,{hero:true})],[mk(DES['검기사'],1,10,8)],sd,'free'); lit(W); const c=W.units[0], k=W.units[2]; k.target=c; k.state='hunt';
    run(W,6,()=>{ if(!c.alive) W.over=true; }); lp+=W.log.filter(x=>x.k==='leap'&&x.a===c.i).length; ls+=W.log.filter(x=>x.k==='leapShot'&&x.a===c.i).length; }
  console.log(`    도약 ${lp} · 도약 사격 ${ls} (10판)`); ok(lp>=10,'친칠라가 뒤로 도약해 거리를 벌림'); }

console.log('C. 청광묵: 곤봉적의 일격을 흘려 빠짐 (공격 명령 · 20판 · 8초)');
{ const R={}; for (const on of [true,false]){ let sl=0,tk=0,dmg=0,dealt=0; for(let sd=1;sd<=20;sd++){ const W=W_([mk(GOB,0,8,8),mk(INJ,0,2,15,{hero:true})],[mk(DES['곤봉적'],1,9.6,8)],sd,'free'); lit(W); if(!on) off(W);
      const g=W.units[0], b=W.units[2]; g.face=0; g.fg=0; g.order={k:'attack',b:b.i}; b.target=g; b.state='hunt'; run(W,8,()=>{ if(!g.alive||g.down) W.over=true; });
      sl+=W.log.filter(x=>x.k==='evade'&&x.a===g.i&&x.m==='slip').length; const H=W.log.filter(x=>x.k==='hit'&&x.a===b.i&&x.b===g.i); tk+=H.length; dmg+=H.reduce((s,x)=>s+(x.dmg||0),0); dealt+=W.log.filter(x=>x.k==='hit'&&x.a===g.i&&x.b===b.i).reduce((s,x)=>s+(x.dmg||0),0); }
    R[on?'켬':'끔']={흘려빠짐:sl,맞음:tk,받은피해:dmg,준피해:dealt}; }
  console.log('    ', JSON.stringify(R)); ok(R['켬'].흘려빠짐>0,'흘려 빠지기가 일어남'); ok(R['켬'].받은피해<R['끔'].받은피해,'켜면 덜 맞음'); ok(R['켬'].준피해>=R['끔'].준피해*0.6,'빠졌다가 다시 침'); }

console.log('D. 청광묵: 둘에게 몰리면 빈 쪽으로 빠짐');
{ let out=0; for(let sd=1;sd<=10;sd++){ const W=W_([mk(GOB,0,8,8),mk(INJ,0,2,15,{hero:true})],[mk(DES['검기사'],1,9.4,7.2),mk(DES['검기사'],1,9.4,8.8)],sd,'free'); lit(W); const g=W.units[0]; g.face=0; g.fg=0;
    for (const k of [W.units[2],W.units[3]]){ k.target=g; k.state='hunt'; } run(W,3); out+=W.log.filter(x=>x.k==='evade'&&x.a===g.i&&x.m==='out').length; }
  console.log(`    포위 빠지기 ${out} (10판)`); ok(out>=5,'몰리면 빠져나감'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 715A OK');
