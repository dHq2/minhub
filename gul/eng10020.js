// v9.11.0 엔진 시험 — eng10020.js v1.1 (v1.1: v9.13.0 총안 — 대장 0.45칸 안이면 바로 쏘므로 '붙어 지냄' 은 몸 사이 0.7칸 안으로 (적 편 대장이 싸우며 움직여 사이 중앙 0.48 → 0.6칸) · v1.0: 빼꼼은 맞닿은 전열 등 뒤에서만 · 몸 사이 좁은 틈은 막힘 · 보호받을이 사수는 서둘러 대장 등 뒤 (총안) · 사수는 망치 대상이 아님 · 지휘관 임명 · 전리품에 제 것 (던진 창) · 양쪽 편)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const gun=(name,x,y,side,ex)=>mk({...REB,name,weapon:'소총',shield:false,ammo:60,ov:{hp:9e4,atk:3},traits:['사격A'],gear:{},...(ex||{})},side,x,y);
const med=(name,x,y,side)=>mk({...REB,name,cls:'치유',role:'치유',weapon:'맨손',shield:false,ov:{hp:9e4,atk:1},traits:[],gear:{}},side,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.noFid=true; u.seenBy=1; }); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
for (const side of [0,1]){ console.log((side?'적':'우리')+' 편');
  // A. 맞닿은 전열 뒤: 빼꼼 됨 / 맞닿은 치유사 뒤: 빼꼼 안 됨 / 2칸 떨어진 전열 뒤: 안 됨
  { const W=WF([sw('앞',12,10,side,{shield:true}),gun('사수',11.2,10,side),sw('표적',18,10,1-side)]); const [f,s,t]=W.units; s.x=f.x-f.r-s.r-0.05; const pk=E.peekSpot(W,s,t,false); ok(!!pk&&!!E.peekState(W,s)||!!pk,'맞닿은 전열 뒤 → 빼꼼 자리 있음');
    s.target=t; ok(E.peekState(W,s)===f,'총안 상태 = 그 전열'); }
  { const W=WF([med('치유',12,10,side),gun('사수',11.2,10,side),sw('표적',18,10,1-side)]); const [f,s,t]=W.units; s.x=f.x-f.r-s.r-0.05; ok(!E.peekSpot(W,s,t,false),'맞닿은 치유사 뒤 → 빼꼼 없음 (오사 규칙)'); }
  { const W=WF([sw('앞',12,10,side,{shield:true}),gun('사수',9.6,10,side),sw('표적',18,10,1-side)]); const [f,s,t]=W.units; ok(!E.peekSpot(W,s,t,false),'2칸 떨어진 전열 뒤 → 빼꼼 없음'); }
  // B. 몸 사이 좁은 틈 (몸과 몸 사이 0.2칸): 사선에 몸이 걸림
  { const W=WF([gun('사수',8,10,side),sw('벽1',14,9.45,1-side),sw('벽2',14,10.55,1-side),sw('표적',18,10,1-side)]); const [s,a,b,t]=W.units; const r=a.r; a.y=10-r-0.1; b.y=10+r+0.1; const B=E.lineBodies(W,s,t,s,null); ok(B.length>0,'몸 사이 0.2칸 틈으로는 사선이 막힘 ('+B.map(x=>x.name).join(',')+')'); }
  // C. 보호받을이 사수: 멀리서 쏘지 않고 서둘러 대장 등 뒤로 → 총안
  { let near=0, peek=0; for (let sd=1; sd<=3; sd++){ const W=WF([sw('대장',12,10,side,{shield:true}),gun('사수',8,14,side),sw('표적',17,10,1-side)],sd); const [c,s,t]=W.units; c.order={k:'hold'}; t.order={k:'hold'}; t.spd=0.001; s.sqLead=c.i; s.chiefLk=true; s.sqFix=true; s.chiefMode='cover';
      let pk=0, tc=0; for(let i=0;i<150;i++){ step(W); if (E.peekState(W,s)===c) pk++; if (i>=60 && Math.hypot(s.x-c.x,s.y-c.y)-s.r-c.r<0.7) tc++; } if (tc>=45) near++; if (pk>10) peek++; }
    ok(near>=3,'보호받을이 사수가 대장 등 뒤에 붙어 지냄 (2 ~ 5초의 절반 넘게) ('+near+'/3)'); ok(peek>=2,'붙은 뒤 총안 (빼꼼) 상태 ('+peek+'/3)'); }
  // D. 지휘관 임명
  { const W=WF([sw('갑',10,10,side),sw('을',11,11,side),sw('표적',30,10,1-side)]); const [a,b]=W.units; a.cmd=2; b.cmd=0; E.appointCmdr(W,b); const top=W.units.filter(u=>u.side===side&&u.cmd).sort(E.cmdSort)[0]; ok(top===b&&b.cmd>=1,'임명된 이 (재능 없음) 가 지휘 · 기본 지휘 C'); E.appointCmdr(W,a); ok(!b.cmdHat&&b.cmd===0&&W.units.filter(u=>u.side===side&&u.cmd).sort(E.cmdSort)[0]===a,'다시 임명하면 앞사람은 내려옴'); }
}
// E. 망치: 사수는 돌아 들어가지 않음
{ const W=WF([sw('붙듦',12,10,0),sw('망치',10,12,0,{role:'공격수'}),gun('적사수',13,10,1)]); const [a,h,g]=W.units; W.hm={pins:new Map([[g.i,[a.i]]])}; h.order=null; const r=E.hammerStep(W,h,1/30); ok(!r,'붙들린 상대가 사수면 옆으로 돌지 않고 바로 쫓음'); }
// F. 던진 창: 전리품 목록에 '제 것 — 저절로 돌아감'
{ const W=WF([sw('창병',10,10,0,{weapon:'창'}),sw('적',20,10,1)]); const [u,e]=W.units; W.items=[{id:1,k:'spear',x:15,y:10,owner:u.i,name:'창',t:1,how:'thrown:'}]; e.alive=false; const L=E.lootOf(W); const it=L.find(x=>x.mineBack); ok(!!it&&/저절로/.test(it.taken||''),'던진 창이 전리품 목록에 제 것으로 보임 ('+(it&&it.taken)+')'); }
console.log(fails?'FAIL '+fails:'ALL OK');
