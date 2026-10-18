// v7.25.1 시험 — eng7251.js v1.3 (v1.3: 산탄은 판정 (코앞만) · 밀려남으로 봄 (급소 피해가 섞여 피해 비교는 뺌) · v1.1: 붙은 근접으로 시작 · 멀리 다른 적을 두어 판이 끝나지 않게 · 간두 두 번째 총: 근접이 붙으면 샷건으로 바꿔 듦 · 코앞 산탄 (× 2.2 · 밀어냄) · 특수탄이 줄어듦 · 멀어지면 다시 권총 (탄은 각자) · 명령으로 바꿔 듦 /
//   [전투센스]: 못 본 쪽 공격도 잘 피함 · 고립돼 맞아도 엎드리지 않음)
const {E,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const GD={ref:'C-195',name:'간두',tier:2,cls:'기동',role:'사수',weapon:'권총',ammo:100,alt:{name:'샷건',ammo:100},sm:0.95,height:1.9,weight:85,sizeCls:'중형',nv:true,nvG:'B',ov:{hp:400,atk:26},traits:['사격A','회피B','은신C','반사신경','전투센스']};
const DOG=(x,y,ex)=>mk({ref:'C-076',name:'똥개',tier:1,cls:'기동',height:0.8,ov:{hp:400,atk:6},traits:['망자']},1,x,y,ex);
const lit=W=>{ W.amb=1; E.computeLight(W); };
// 1) 근접이 붙으면 샷건 · 코앞 산탄
{ const W=W_([mk(GD,0,8,8)],[DOG(10,8)],1); lit(W); const [g,d]=W.units; const a0=g.ammo;
  run(W,6,()=>g.weapon==='샷건'&&W.log.some(l=>l.k==='hit'&&l.a===g.i&&l.tag&&/샷건 산탄/.test(l.tag)));
  const S=W.log.find(l=>l.k==='altSwap'), H=W.log.filter(l=>l.k==='hit'&&l.a===g.i&&/샷건 산탄/.test(l.tag||'')), K=W.log.find(l=>l.k==='shove'&&l.a===g.i||(l.k==='kb'&&l.a===g.i));
  console.log('      ',JSON.stringify(S),'산탄',H.length,'샷건 탄',g.ammo,'권총은',JSON.stringify(g.alt));
  ok(S&&S.w==='샷건'&&g.weapon==='샷건'&&g.alt&&g.alt.name==='권총','근접이 붙으면 샷건으로 바꿔 듦 (권총은 두 번째로)');
  ok(H.length>=1&&g.ammo<100,'코앞 산탄이 들어감 · 특수탄이 줄어듦 ('+g.ammo+')');
  ok(g.alt.ammo<=a0,'권총 탄은 권총 몫으로 남음 ('+g.alt.ammo+')'); }
// 2) 멀어지면 다시 권총
{ const W=W_([mk(GD,0,8,8)],[DOG(9.8,8),DOG(28,14,{ov:{hp:400,atk:1}})],2); lit(W); const [g,d,d2]=W.units; d2.stunT=1e9;
  run(W,4,()=>g.weapon==='샷건'); const ok1=g.weapon==='샷건'; d.hp=0; d.alive=false; run(W,3);
  console.log('       ',ok1,g.weapon,JSON.stringify(W.log.filter(l=>l.k==='altSwap').map(l=>l.w+':'+l.why)));
  ok(ok1&&g.weapon==='권총'&&g.alt.name==='샷건','근접이 사라지면 1.5초 뒤 다시 권총'); }
// 3) 명령으로 바꿔 듦 · 산탄은 코앞에서 크게
{ const W=W_([mk(GD,0,8,8)],[DOG(20,8,{ov:{hp:400,atk:1}})],3,'hold'); lit(W); const [g]=W.units; g.order={k:'alt'}; run(W,0.6);
  ok(g.weapon==='샷건'&&W.log.some(l=>l.k==='altSwap'&&l.why==='명령'),'명령 (M) 으로 바꿔 듦 (0.35초)'); }
{ let nearT=0, farT=0, push=0; for (let s=1;s<=8;s++){ for (const dx of [1.3,3.1]){ const W=W_([mk({...GD,weapon:'샷건',ammo:50,alt:null},0,8,8)],[DOG(8+dx,8,{ov:{hp:300,atk:1}})],s,'hold'); lit(W); const [g,d]=W.units; d.stunT=1e9; g.order={k:'attack',b:d.i}; const x0=d.x;
      run(W,1.6,()=>W.log.some(l=>l.k==='hit'&&l.a===g.i)); const h=W.log.find(l=>l.k==='hit'&&l.a===g.i); if (h&&/샷건 산탄/.test(h.tag||'')){ if (dx<2){ nearT++; run(W,0.5); if (d.x-x0>0.3) push++; } else farT++; } } }
  console.log('       코앞 산탄',nearT,'/ 8 · 조금 멀리',farT,'/ 8 · 밀려남',push); ok(nearT>=5&&farT===0&&push>=Math.min(3,nearT),'샷건: 코앞 (1.8칸 안) 만 산탄 × 2.2 · 밀려남'); }
// 4) [전투센스]
{ const W=W_([mk(GD,0,8,8),mk({...GD,name:'보통',traits:['사격A','회피B']},0,8,12)],[DOG(6,8),DOG(6,12)],4,'hold'); lit(W); const [g,n,d1,d2]=W.units;
  g.face=0; n.face=0; const pg=E.evadeP(W,g,d1,'melee'), pn=E.evadeP(W,n,d2,'melee'); console.log('       등 뒤 회피',pg.toFixed(3),pn.toFixed(3));
  ok(g.csense&&pg>pn*1.8,'[전투센스] 등 뒤 (못 본) 공격도 잘 피함'); }
console.log(fails?`${fails} FAIL`:'ALL 7251 OK');
