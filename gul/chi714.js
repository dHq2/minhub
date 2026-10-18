// v7.14 시험 — chi714.js v1.2 (v1.2: v7.16 하얀 나무 관통력 70 · v1.1: leapTo 인자 순서) (친칠라 수치 · 1대1 · 은신 등급 · E 조건 · 숨지 않을 때 · 도약 사격 · 엎드려 활 못 쏨 · 야시 S)
const {E,DES,NOR,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const CHI={ref:'C-106',name:'친칠라',tier:2,sq:'B',cls:'원거리',role:'사수',weapon:'하얀 나무',ammo:30,sm:1.34,height:1.65,nv:true,nvG:'S',ov:{hp:100,atk:24},traits:['사격A','은신S','가호:바다','축복:바다'],active:['도약'],race:'정령 (물) · 심해 종족'};
const ARC={...DES['궁수'],traits:[...DES['궁수'].traits,'은신S']};
const dark=W=>{ for(const u of W.units){ u.torch=false; u.torchOff=false; } W.torches=[]; E.computeLight(W); };
const lit=W=>{ W.torches=[{x:8,y:8,r:30}]; E.computeLight(W); };

console.log('A. 친칠라 수치');
{ const W=W_([mk(NOR,0,3,3),mk(CHI,0,3,5)],[mk(ARC,1,20,3)],1,'hold'); const [n,c,a]=W.units; const wp=W.rules.weapons;
  console.log(`    속력 노먼 ${n.spd.toFixed(2)} · 친칠라 ${c.spd.toFixed(2)} · 궁수 ${a.spd.toFixed(2)} | 공격 ${c.atk} vs 궁수 ${a.atk} | 사거리 ${c.rng} vs ${a.rng} | 화살 ${wp['하얀 나무'].vel}/${wp['하얀 나무'].P} vs ${wp['활'].vel}/${wp['활'].P} | 은신 ${c.stealthG} ${c.stealthE} · 야시 ${c.nvG} · 도약 ${c.canLeap}`);
  ok(c.spd<n.spd&&c.spd>n.spd*0.85,'속력은 노먼보다 조금 느림'); ok(c.atk<a.atk,'근력은 궁수보다 약함'); ok(c.rng===10&&a.rng===6,'사거리 10칸 (궁수 6칸)');
  ok(wp['하얀 나무'].vel<wp['활'].vel&&wp['하얀 나무'].P*1.1<wp['활'].P*1.25,'화살이 궁수보다 느리고 실제 관통 (사격 A ×1.1 vs 궁수 S ×1.25) 은 약함');   /* v1.2 v7.16 관통력 70 = 활과 같음 — 차이는 사격 솜씨 */ ok(c.stealthG==='S'&&c.stealthE===1&&c.nvG==='S'&&c.canLeap,'은신 S · 야시 S · 도약'); }

console.log('B. 친칠라 vs 궁수 1대1 (빛 · 9칸에서 맞쏨)');
{ let cw=0,aw=0,N=20; for(let sd=1;sd<=N;sd++){ const W=W_([mk(CHI,0,4,8),mk(NOR,0,1,1,{hero:true})],[mk(ARC,1,13,8)],sd,'free'); lit(W); const c=W.units[0],n=W.units[1],a=W.units[2]; n.order={k:'hold'}; n.roe='hold';
    c.order={k:'attack',b:a.i}; run(W,40,()=>{ if(!c.alive||!a.alive||c.down||a.down) W.over=true; }); if(a.down||!a.alive) cw++; else if(c.down||!c.alive) aw++; }
  console.log(`    친칠라 이김 ${cw} · 궁수 이김 ${aw} · 결판 안 남 ${N-cw-aw} (${N}판)`); ok(aw>=cw,'1대1 이면 궁수 쪽이 우세 (질 수 있음)'); }

console.log('C. 은신 등급 · E 조건');
{ const g=['S','A','B','C','D','E'].map(x=>{ const W=W_([mk({...NOR,traits:['은신'+x]},0,4,8)],[mk(DES['창병'],1,20,8)],1,'hold'); return [x,W.units[0].stealthE]; }); console.log('    솜씨', JSON.stringify(g));
  ok(g.every((x,i)=>i===0||x[1]<g[i-1][1]),'S > A > B > C > D > E');
  const W=W_([mk({...NOR,traits:['은신E']},0,4,8)],[mk(DES['창병'],1,20,8)],1,'hold'); dark(W); const k=W.units[0]; k.stealth=true; k.vx=0; k.vy=0;
  const kd=E.stealthK(W,k); k.vx=1; const km=E.stealthK(W,k); k.vx=0; W.torches=[{x:4,y:8,r:6}]; E.computeLight(W); const kl=E.stealthK(W,k);
  console.log(`    E 어둠 가만히 ${kd.toFixed(2)} · 움직임 ${km} · 빛 ${kl}`); ok(kd<1&&km===1&&kl===1,'E 는 어둠 속에 가만히 있을 때만 숨음'); }

console.log('D. 숨지 않을 때의 은신 등급 (어둠 · 야시 B 눈 · 4.7칸)');
{ const see=tr=>{ const W=W_([mk({...NOR,traits:tr},0,4,8)],[mk(DES['창병'],1,8.7,8)],1,'hold'); dark(W); const u=W.units[0], e=W.units[1]; e.face=Math.PI; e.nvG='B'; return E.canSee(W,e,u); };
  const a=see([]), b=see(['은신S']), c=see(['은신C']); console.log(`    등급 없음 ${a} · S ${b} · C ${c}`); ok(a&&!b&&c,'S 는 숨지 않아도 어둠 속에서 조금 덜 멀리 보임 (C 는 그대로)'); }

console.log('E. 도약 사격 (활)');
{ let shot=0,N=12,ex=null; for(let sd=1;sd<=N;sd++){ const W=W_([mk(DES['창병'],0,8,8),mk(NOR,0,1,1,{hero:true})],[mk(ARC,1,10,8)],sd,'free'); lit(W); const a=W.units[2], t=W.units[0]; a.ammo=40; a.act=null; a.leapCd=-9;
    E.leapTo(W,a,a.x+1.7,a.y,'back',t,'시험'); run(W,0.6); const l=W.log.find(x=>x.k==='leapShot'&&x.a===a.i); if(l){ shot++; if(!ex) ex=l; } }
  console.log(`    도약 사격 ${shot}/${N} · 예 ${JSON.stringify(ex)}`); ok(shot>=N*0.7,'궁수는 도약하는 중에 쏨');
  const W=W_([mk(CHI,0,4,8),mk(NOR,0,1,1,{hero:true})],[mk(ARC,1,12,8)],1,'free'); lit(W); const c=W.units[0], a=W.units[2]; E.leapTo(W,c,c.x-1.7,c.y,'back',a,'시험'); run(W,0.6);
  ok(W.log.some(x=>x.k==='leapShot'&&x.a===c.i),'친칠라도 도약하며 쏨'); }

console.log('F. 엎드려서는 활을 못 쏨');
{ const W=W_([mk(CHI,0,4,8),mk(NOR,0,1,1,{hero:true})],[mk(ARC,1,11,8)],1,'smart'); lit(W); const c=W.units[0];
  E.lieSet(W,c,true,'명령'); run(W,0.7); c.order={k:'attack',b:W.units[2].i,now:true}; let lieWind=false; run(W,1.5,()=>{ if(c.lie&&c.act&&c.act.k==='attack') lieWind=true; }); ok(!lieWind,'엎드린 채로는 활을 당기지 않음 (일어난 뒤에)'); }

console.log('G. 야시 S');
{ const W=W_([mk(CHI,0,4,8),mk({...NOR,nvG:'A'},0,4,9)],[mk(DES['창병'],1,20,8)],1,'hold'); W.torches=[{x:4,y:8.5,r:3}]; E.computeLight(W); const c=W.units[0], n=W.units[1];
  console.log(`    밝은 빛 속 눈부심: 친칠라 ${E.glareAt(W,c)} · 노먼 ${E.glareAt(W,n)} | 어둠 명중 S ${W.rules.darkHit.S}`); ok(!E.glareAt(W,c),'야시 S 는 밝은 빛에도 눈부시지 않음'); ok(W.rules.darkHit.S===1,'어둠 속 명중 그대로'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 714 OK');
