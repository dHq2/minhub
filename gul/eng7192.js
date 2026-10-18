// v7.19.2 시험 — eng7192.js v1.1 (v1.1: 무기 잡기는 철퇴 든 적 (창은 먼저 던짐) · 뿌리 피해는 로그로 · 딸기 역장 · 뿌리 벽 · 열매 맺기 · 공통 무기 잡기)
const {E,R,U,DES,INJ,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const WT=(units,seed,roe)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def=roe||'hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:30,H:16,seed:7,units,torches:[{x:10,y:8,r:40}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); return W; };
const FAR=()=>mk(DES['창병'],1,28.5,1.5);
const BER={ref:'C-218',name:'딸기',tier:2,cls:'치유',role:'지원',weapon:'대지 마법',height:1.7,weight:58,ov:{hp:9999,atk:22},regenK:0.012,traits:['은신C','열매 맺기'],active:['역장','뿌리 벽'],skill:{name:'딸기 정령술',kit:true,inf:true,pool:99,pct:0.12,min:8,cap:20,hot:3,hotN:6,hotGap:0.5,cd:2.4,wind:0.45,rec:0.3,rng:3.5,auto:0.55}};

console.log('A. 역장');
{ const W=WT([mk(BER,0,6,8,{hero:true}),mk({...DES['궁수'],weapon:'궁수의 활',ov:{hp:9999,atk:30}},1,15,8)],1,'hold'); const b=W.units[0], a=W.units[1]; a.order={k:'attack',b:b.i};
  E.startSpec(W,b,null,'ward','시험'); run(W,0.5); const w0=(W.wards||[]).length; run(W,6); const bl=W.log.filter(x=>x.k==='miss'&&x.ward!=null).length, pi=W.log.filter(x=>x.k==='wardPierce').length;
  console.log(`    역장 ${w0} · 막음 ${bl} · 뚫림 ${pi} · 남은 역장 ${(W.wards||[]).length}`); ok(w0===1&&bl>=1,'역장이 화살을 막음'); ok((W.wards||[]).length===0,'세 발 · 6초 뒤 사라짐'); }

console.log('B. 뿌리 벽');
{ const W=WT([mk(BER,0,6,8,{hero:true}),mk({...DES['검기사'],weapon:'장검',ov:{hp:9999,atk:30}},1,8.6,8.5),FAR()],1,'hold'); const b=W.units[0], k=W.units[1]; k.order={k:'hold'};
  E.startSpec(W,b,null,'root','시험'); b.act.px=8.5; b.act.py=8.5; const hp0=k.hp; run(W,0.7); const r=(W.roots||[])[0];
  console.log(`    뿌리 ${r?r.cells.map(c=>c.join(',')).join(' '):'-'} · 솟을 때 맞음 ${Math.round(hp0-k.hp)} · 밀림 ${W.log.some(x=>x.k==='shove'&&x.a===b.i)}`);
  ok(r&&r.cells.length>=2&&r.cells.every(c=>E.rock(W.map,c[0]+0.5,c[1]+0.5)&&E.solid(W.map,c[0]+0.5,c[1]+0.5)),'2칸 벽 — 못 지나감 · 탄 · 시야도 막음'); ok(hp0-k.hp>0||W.log.some(x=>x.k==='hit'&&x.a===b.i&&/솟는 뿌리/.test(x.tag||''))||!W.units.some(e=>e.side===1&&r.cells.some(c=>Math.floor(e.x)===c[0]&&Math.floor(e.y)===c[1])),'솟는 칸 위의 적은 맞음 (비켜 있었으면 통과)');
  k.order=null; k.x=r.cells[0][0]+1.6; k.y=r.cells[0][1]+0.5; run(W,30); console.log(`    뜯김 로그 ${W.log.filter(x=>x.k==='rootChew').length} · 부서짐 ${W.log.some(x=>x.k==='rootBreak')} · 남은 뿌리 ${(W.roots||[]).length}`); ok(W.log.some(x=>x.k==='rootBreak')||W.log.some(x=>x.k==='rootChew'),'붙은 적이 뜯어냄'); }

console.log('C. 열매 맺기');
{ const W=WT([mk(BER,0,6,8,{hero:true}),mk({...INJ,ov:{hp:200}},0,9,8),FAR()],1,'hold'); const b=W.units[0], h=W.units[1]; h.hp=100; run(W,9); const be=(W.items||[]).filter(i=>i.k==='berry');
  console.log(`    9초: 열매 ${be.length}개 ${be.map(i=>i.x+','+i.y+' +'+i.heal).join(' ')}`); ok(be.length===1,'8초에 하나 맺힘');
  if(be[0]){ h.order={k:'move',x:be[0].x,y:be[0].y}; run(W,4); const l=W.log.find(x=>x.k==='berry'); console.log(`    먹음 ${l?l.amt:0} · 인주 ${Math.round(h.hp)}`); ok(l&&l.amt>=5&&l.amt<=10&&!(W.items||[]).some(i=>i.k==='berry'&&i.id===be[0].id),'지나가며 먹음 (5 ~ 10)'); } }

console.log('D. 무기 잡기');
{ let g=0, n=0; for(let sd=1;sd<=25;sd++){ const W=WT([mk({...REB,traits:['불사','재생','베테랑','회피A'],ov:{hp:9999,atk:5}},0,10,8,{hero:true}),mk({ref:'C-005',name:'철퇴병',tier:2,cls:'근접',weapon:'모닝스타',height:1.9,ov:{hp:9999,atk:20},traits:[]},1,11.6,8),FAR()],sd,'hold'); const r=W.units[0], s=W.units[1]; s.order={k:'attack',b:r.i}; r.order={k:'hold'}; run(W,8);
    const l=W.log.find(x=>x.k==='grab'); n++; if(l){ g++; if(g===1) console.log('    예', JSON.stringify(l), '창병 무기', s.weaponNow, (W.items||[]).filter(i=>i.how==='grab').map(i=>i.name+'@'+i.x+','+i.y).join(' ')); } }
  console.log(`    25판 중 무기 잡기 ${g}`); ok(g>=2,'막거나 피하면 가끔 창을 뺏음'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 7192 OK');
