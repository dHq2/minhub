// v9.9.3 엔진 시험 — eng9930.js v1.0 (지원 추종: 치유 · 사수 부하는 대장 등 뒤 · 겨눠지면 대장을 방패로 · 창 방패를 쥔 치유는 보병 / 돌격이 대장에게 오면 부하 (사수도) 가 달려와 등 뒤를 받침 · 양쪽 편)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>u.seenBy=1); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
for (const side of [0,1]){ console.log((side?'적':'우리')+' 편');
  { const W=WF([sw('대장',10,10,side,{shield:true}),sw('치유',8,10,side,{cls:'치유',weapon:'맨손'}),mk({...REB,name:'궁수',weapon:'단궁',shield:false,ov:{hp:9e4,atk:1},traits:['사격B'],gear:{}},1-side,13,15)]); const [c,h,a]=W.units; h.sqLead=c.i; h.chiefLk=true; c.order={k:'hold'}; c.spd=0.001; a.order={k:'hold'}; a.spd=0.001; a.target=h; a.state='fight';
    let cover=0, n=0; for(let i=0;i<150;i++){ step(W); if(i>60){ n++; const u1=Math.atan2(h.y-c.y,h.x-c.x), u2=Math.atan2(c.y-a.y,c.x-a.x); if(Math.abs(Math.atan2(Math.sin(u1-u2),Math.cos(u1-u2)))<0.8&&d(h,c)<1.4) cover++; } }
    ok(cover>n*0.5,'치유 부하는 대장을 방패 삼아 사수 반대편에 붙음 ('+cover+'/'+n+')'); }
  { const W=WF([sw('대장',10,10,side),sw('창 치유',8,10,side,{cls:'치유',weapon:'창',shield:true})]); ok(!E.isSupport(W.units[1])&&E.isSupport(sw('맨손 치유',1,1,side,{cls:'치유',weapon:'맨손'})),'창 · 방패를 쥔 치유는 보병 (맨손 치유는 지원)'); }
  { const W=WF([sw('대장',10,10,side,{shield:true}),mk({...REB,name:'사수 부하',weapon:'단궁',shield:false,ov:{hp:9e4,atk:1},traits:[],gear:{}},side,7,12),mk({...REB,name:'돌격자',shield:true,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{}},1-side,16,10)]); const [c,s,e]=W.units; s.sqLead=c.i; s.chiefLk=true; c.order={k:'hold'};
    E.startCharge(W,e,c,null); let br=0, mn=9; for(let i=0;i<50;i++){ step(W); if(s.why==='BRACE_CHARGE'){ br++; mn=Math.min(mn,d(s,c)); } } ok(br>5&&mn<1.3,'돌격이 대장에게 오면 사수 부하도 달려와 등 뒤를 받침 ('+br+'틱 · 가장 가까이 '+mn.toFixed(2)+'칸)'); } }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
