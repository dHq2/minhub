// v9.10.1 엔진 시험 — eng10010.js v1.1 (v1.1: v9.11.0 빼꼼은 맞닿은 전열 뒤에서만 — 적 편 앞줄은 제자리 명령을 따르지 않아 걸음을 묶어 둠 · v1.0: 움직임: 빼꼼은 순간이동 없이 걸어감 · 대장이 걸으면 앞길의 따를이가 비켜 등 뒤로 · 전우이면서 같은 대장의 따를이는 대장 등 뒤에서 자리를 찾아 멈춤 (끝없이 오가지 않음) · 양쪽 편)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const gun=(name,x,y,side,ex)=>mk({...REB,name,weapon:'소총',shield:false,ammo:60,ov:{hp:9e4,atk:3},traits:['사격A'],gear:{},...(ex||{})},side,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.noFid=true; u.seenBy=1; }); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const link=(F,c,mode)=>F.forEach(s=>{ s.sqLead=c.i; s.chiefLk=true; s.sqFix=true; s.chiefMode=mode||null; });
for (const side of [0,1]){ console.log((side?'적':'우리')+' 편');
  // A. 빼꼼: 맞닿은 동료 뒤의 사수 — 한 틱에 0.25칸 넘게 옮기지 않음 · 그래도 쏨
  { let maxS=0, peek=0, shots=0; for (let sd=1; sd<=3; sd++){ const W=WF([sw('앞',12,10,side,{shield:true}),gun('사수',11.25,10,side),sw('표적',18,10,1-side,{ov:{hp:9e4,atk:1}})],sd); const [f,s,t]=W.units; f.order={k:'hold'}; f.spdMul=0; s.order=null; t.order={k:'hold'}; s.target=t; s.state='fight';
      for(let i=0;i<150;i++){ const x0=s.x,y0=s.y, n0=W.log.length; step(W); if (!s.kb && !W.log.slice(n0).some(l=>(l.k==='shove'||l.k==='bowl'||l.k==='kb')&&(l.b===s.i||l.c===s.i))) maxS=Math.max(maxS,Math.hypot(s.x-x0,s.y-y0)); }   /* 넉백 · 부딪혀 밀림은 빼고 */ peek+=W.log.filter(l=>l.k==='peek'&&l.a===s.i).length; shots+=W.log.filter(l=>(l.k==='hit'||l.k==='miss')&&l.a===s.i).length; }
    ok(peek>0&&shots>0,'빼꼼 사격 (빼꼼 '+peek+' · 쏨 '+shots+')'); ok(maxS<0.25,'순간이동 없음 (한 틱 최대 '+maxS.toFixed(2)+'칸)'); }
  // B. 대장이 걸으면 앞길의 따를이가 비켜 섬 (대장이 막히지 않음)
  if (!side){ const W=WF([sw('대장',10,10,side),sw('앞 따를이',11.2,10,side),sw('먼 적',38,2,1-side)]); const [c,f,e]=W.units; link([f],c,'follow'); e.order={k:'hold'}; c.order={k:'move',x:16,y:10};
    let inPath=0; for(let i=0;i<90;i++){ step(W); const ax=f.x-c.x, lat=Math.abs(f.y-c.y); if (ax>0&&ax<c.r+f.r+0.6&&lat<c.r+f.r-0.1) inPath++; }
    ok(c.x>14.5,'대장이 길을 막히지 않고 감 (x '+c.x.toFixed(1)+')'); ok(inPath<20,'따를이가 대장 앞길에 오래 서 있지 않음 ('+inPath+'틱)'); }   /* 적 편은 이동 명령을 받지 않아 우리 편만 */
  // C. 전우이면서 같은 대장의 따를이 둘 — 대장이 서 있으면 자리를 찾아 멈춤
  { const W=WF([sw('대장',10,10,side),sw('갑',8.5,9,side),sw('을',8.5,11,side),sw('병',9,12,side),sw('먼 적',38,2,1-side)]); const [c,a,b2,d]=W.units; link([a,b2,d],c,'follow'); a.cg=b2.cg='mx'; c.order={k:'hold'}; c.spdMul=0; W.units[4].order={k:'hold'};
    step(W,90); let mv=0; for(let i=0;i<90;i++){ const p=[a,b2,d].map(u=>[u.x,u.y]); step(W); [a,b2,d].forEach((u,k)=>mv+=Math.hypot(u.x-p[k][0],u.y-p[k][1])); }
    ok(mv<0.8,'자리를 찾아 멈춤 (3초 동안 셋이 움직인 길 '+mv.toFixed(2)+'칸)'); ok(Math.hypot(a.x-b2.x,a.y-b2.y)<a.r+b2.r+0.6,'전우끼리 이웃 자리'); }
}
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
