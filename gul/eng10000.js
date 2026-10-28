// v9.10.0 엔진 시험 — eng10000.js v1.0 (점검 바로잡기: 보이지 않는 사수에게 맞으면 날아온 쪽으로 돌아섬 · 따를이는 나를 쏘는 사수 · 대장이 노리는 사수에게 · 가벼운 덮침엔 받치러 뛰지 않음 · 견제사격은 양쪽 편 · 재집결 거리 바로잡기 · 양쪽 편)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const bow=(name,x,y,side,ex)=>mk({...REB,name,weapon:'단궁',shield:false,ov:{hp:9e4,atk:3},traits:['사격S','베테랑'],gear:{},...(ex||{})},side,x,y);
const WF=(units,sd,lit)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:lit===false?[]:lit==='tgt'?[{x:10,y:10,r:2.5}]:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>u.noFid=true); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const link=(F,c,mode)=>F.forEach(s=>{ s.sqLead=c.i; s.chiefLk=true; s.sqFix=true; s.chiefMode=mode||null; });
const ad=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
for (const side of [0,1]){ console.log((side?'적':'우리')+' 편');
  // A. 보이지 않는 사수에게 맞으면 날아온 쪽으로 돌아섬 (방패가 그쪽)
  { let turned=0, n=0; for (let sd=1; sd<=4; sd++){ const W=WF([sw('방패',10,10,side,{shield:true}),bow('숨은 궁수',10,19,1-side,{weapon:'궁수의 활'})],sd,'tgt'); const [u,a]=W.units; u.order={k:'hold'}; u.face=-Math.PI/2; a.order={k:'hold'}; a.target=u; a.state='fight';
      let hit=false; for(let i=0;i<240;i++){ step(W); if(!hit&&W.log.some(l=>l.k==='hit'&&l.b===u.i&&l.a===a.i)){ hit=true; } if(hit&&!E.canSee(W,u,a)){ n++; if(ad(u.face,Math.atan2(a.y-u.y,a.x-u.x))<0.9) turned++; } } }
    ok(n>0&&turned>n*0.5,'보이지 않는 사수에게 맞으면 날아온 쪽으로 돌아섬 ('+turned+'/'+n+')'); }
  // B. 따를이 (검 · 발 빠름) 는 대장이 노리는 사수에게 달려감
  { let went=0; for (let sd=1; sd<=3; sd++){ const W=WF([sw('대장',10,10,side,{shield:true}),sw('빠른 검',9,10,side,{ov:{hp:9e4,atk:5,spd:3.6},role:'공격수'}),bow('궁수',17,10,1-side)],sd); const [c,f,a]=W.units; link([f],c,'follow'); c.order={k:'hold'}; c.target=a; c.state='hunt'; a.order={k:'hold'};
      const d0=Math.hypot(f.x-a.x,f.y-a.y); step(W,90); if (Math.hypot(f.x-a.x,f.y-a.y)<d0-2.5||W.log.some(l=>l.k==='pairGo'&&l.a===f.i&&l.how==='shooter')) went++; }
    ok(went>=2,'발 빠른 따를이는 대장이 노리는 사수에게 달려감 ('+went+'/3)'); }
  // C. 가벼운 덮침 (개) 엔 받치러 뛰지 않음 · 무거운 돌격엔 받침
  { const tr=(w)=>{ const W=WF([sw('대장',10,10,side,{shield:true,weight:70}),sw('따를이',8,11.5,side),mk({...REB,name:'돌격',shield:true,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},weight:w},1-side,16,10)]); const [c,f,e]=W.units; link([f],c,'follow'); c.order={k:'hold'}; e.mass=w; E.startCharge(W,e,c,null); let br=false; for(let i=0;i<50;i++){ step(W); if(f.why==='BRACE_CHARGE') br=true; } return br; };
    ok(!tr(25)&&tr(140),'가벼운 덮침 (25kg) 엔 뛰지 않고 · 무거운 돌격 (140kg) 엔 받침'); }
}
// D. 견제사격은 양쪽 편 (우리 편도 보이지 않는 사수에게 맞으면 지휘관이 시킴)
{ const W=WF([sw('지휘관',10,10,0,{traits:['지휘B']}),bow('우리 사수',11,10.5,0,{weapon:'소총',ammo:30}),bow('숨은 궁수',10,16.5,1,{weapon:'궁수의 활'})],1,'tgt'); const [c,s,a]=W.units; c.order={k:'hold'}; s.order=null; a.order={k:'hold'}; a.target=c; a.state='fight';
  let sp=false; for(let i=0;i<300&&!sp;i++){ step(W); if(W.log.some(l=>l.k==='supp'&&l.a===s.i)) sp=true; } ok(sp,'우리 편 사수도 지휘관의 견제사격 (날아온 쪽으로)'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
