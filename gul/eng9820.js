// v9.8.2 엔진 시험 — eng9820.js v1.0 (역장: 방패 앞 직사각형 · 6초 · 내구 160 · 몸 · 직사 막음 · 곡사 넘어감 · 깎이면 깨짐 / 화살비: 1초 예고 · 10발 · 원 안 · 곡사 판정 · 원을 본 몸은 달아남 · 양쪽 편)  /* v9.9.0: 판마다 다른 씨앗 */
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:true,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>u.seenBy=1); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
console.log('A. 역장');
{ const W=WF([sw('방패병',10,10,1,{active:['암계 역장']}),sw('적',16,10,0)]); const u=W.units[0], e=W.units[1]; u.face=0; W.sup8=true; W.sf8=W.sf8||[];
  E.supStart(W,u,'bfield',null,'시험',e.x,e.y); for(let i=0;i<40&&!(W.sf8||[]).some(F=>F.hard);i++) step(W);
  const F=(W.sf8||[]).find(F=>F.hard); console.log('    ',F&&JSON.stringify({x:+F.x.toFixed(2),y:+F.y.toFixed(2),h:F.h,th:F.th,hp:F.hp,t:+(F.until-F.t0).toFixed(1)}));
  ok(F&&Math.abs(F.x-(u.x+u.r+0.9))<0.6&&F.h===2.5&&F.hp===160,'방패 앞 · 길이 5 · 내구 160');
  e.x=F.x+0.9; e.y=10; e.order={k:'move',x:5,y:10}; step(W,60); ok(e.x>F.x+F.th/2,'적의 몸이 못 넘어옴 (x '+e.x.toFixed(2)+')');
  const hp0=F.hp; step(W,60); console.log('    밀어붙인 2초 뒤 내구 '+F.hp.toFixed(0)+' (처음 '+hp0.toFixed(0)+')'); ok(F.hp<hp0,'밀어붙이면 깎임');
  E.wallHurt(W,F,999,'시험'); ok(W.t>=F.until&&W.log.some(l=>l.k==='bfieldBreak'),'내구 0 → 깨짐'); }
console.log('B. 화살비 (양쪽 편)');
for (const side of [0,1]){ let vsT=0; for (let sd=1; sd<=4; sd++){ const W=WF([mk({...REB,name:'궁수',weapon:'단궁',shield:false,ov:{hp:900,atk:20},traits:[],gear:{}},side,5,10),sw('갑',15,10,1-side,{ev:0.0001}),sw('을',15.6,10.6,1-side),sw('밖',25,10,1-side)],sd); const u=W.units[0]; W.units.slice(1).forEach(x=>{ x.order={k:'hold'}; x.spd=0.001; x.ev=0.0001; });
  E.volStart(W,u,15.2,10.2,{n:10,R:1.5,mul:0.7,delay:1}); const V=W.vol8[0]; let shots=0, pre=true;
  for(let i=0;i<90;i++){ step(W); if(W.t<V.at-0.05) pre=pre&&!W.shots.some(s=>s.vol); }
  const vs=W.log.filter(l=>l.k==='hit'&&l.a===u.i).length, far=W.units[3].hp===W.units[3].max; vsT+=vs;
  if (sd===1){ ok(pre,'예고 1초 동안은 안 떨어짐'); ok(far,'원 밖은 안 맞음'); } }
  console.log('    '+(side?'적':'우리')+' 궁수: 4번에 맞음 '+vsT+' (원 안 둘)'); ok(vsT>=3,'원 안의 몸이 맞음'); }
{ const W=WF([mk({...REB,name:'궁수',weapon:'단궁',shield:false,ov:{hp:900,atk:20},traits:[],gear:{}},1,5,10),sw('피하는 이',15,10,0,{ev:3})]); W.units[1].order=null; E.volStart(W,W.units[0],15,10,{}); step(W,30);
  ok(W.log.some(l=>l.k==='tgDodge'&&l.a===1),'원을 본 몸은 달아남'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
