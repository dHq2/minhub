// v9.9.5 엔진 시험 — eng9950.js v1.0 (뭉침 = 태세: 단단한 이가 가운데 먼저 · 다친 이는 뒤 · 선 길이만큼 앞줄 (몸 폭대로 · 큰 몸은 넓게) · 나머지는 휜 뒷줄 · 혼자 뭉침 = 태세 (버팀 × 1.25) · 양쪽 편)
const {E,R,REB,KAR,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:24,seed:7,units,torches:[{x:20,y:12,r:80}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const clump=(A,e,x,y,len)=>{ const f=Math.atan2(e.y-y,e.x-x); A.forEach((u,j)=>{ u.order={k:'clump',g:9,j,x,y,f,...(len?{len}:{})}; u.noFid=true; }); };
for (const side of [0,1]){ const sx=side?30:8, ex=side?8:30, dirx=side?-1:1;
  console.log((side?'적':'우리')+' 편');
  { // A. 단단한 이 (방패) 가 가운데 · 다친 이는 뒷줄
    const W=WF([sw('보통1',sx,8,side),sw('방패',sx,12,side,{shield:true}),sw('보통2',sx,16,side),sw('다침',sx-1,12,side),sw('적',ex,12,1-side)]); const [a,s,b,h,e]=W.units; e.order={k:'hold'}; h.hp=h.max*0.3;
    clump([a,s,b,h],e,sx,12); step(W,150); const fr=[a,s,b].map(u=>(u.x-sx)*dirx), hb=(h.x-sx)*dirx;
    console.log('    방패 ('+s.x.toFixed(2)+','+s.y.toFixed(2)+') · 앞줄 앞쪽 '+fr.map(v=>v.toFixed(2)).join(',')+' · 다친 이 '+hb.toFixed(2));
    ok(Math.abs(s.y-12)<0.35&&Math.abs(s.x-sx)<0.35,'방패 든 이가 명령 자리 (가운데) 에 섬'); ok(hb<Math.min(...fr)-0.3,'다친 이 (체력 30%) 는 뒷줄'); }
  { // B. 선 길이만큼 앞줄 (몸 폭) · 큰 몸은 넓게 · 나머지 뒷줄
    const units=[mk({...KAR,name:'카리우스'},side,sx,6),...[0,1,2,3,4].map(i=>sw('병'+i,sx,9+i*2,side)),sw('적',ex,12,1-side)]; const W=WF(units); const A=W.units.slice(0,6), e=W.units[6], K=A[0]; e.order={k:'hold'};
    const w=u=>u.r*2+0.03, len=w(K)+w(A[1])*2+0.05; clump(A,e,sx,12,len); step(W,210);
    const front=A.filter(u=>(u.x-sx)*dirx>-0.3), back=A.filter(u=>!front.includes(u));
    console.log('    선 '+len.toFixed(2)+'칸 · 카리우스 반지름 '+K.r.toFixed(2)+' · 병 '+A[1].r.toFixed(2)+' · 앞줄 '+front.map(u=>u.name).join(',')+' · 뒷줄 '+back.map(u=>u.name).join(','));
    ok(front.length===3&&front.includes(K),'선에 몸 폭이 들어가는 만큼만 앞줄 (카리우스 + 둘)'); ok(back.length===3,'나머지 셋은 뒷줄');
    const bx=back.map(u=>(u.x-sx)*dirx), by=back.map(u=>Math.abs(u.y-12)), mid=bx[by.indexOf(Math.min(...by))], edge=bx[by.indexOf(Math.max(...by))]; ok(edge<mid+0.02,'뒷줄은 끝이 살짝 뒤로 휨 ('+mid.toFixed(2)+' / '+edge.toFixed(2)+')'); }
  { // C. 혼자 뭉침 = 태세: 막기를 든 채 버팀 × 1.25
    const W=WF([sw('홀로',sx,12,side,{shield:true}),sw('적',sx+dirx*4,12,1-side)]); const [t,e]=W.units; e.order={k:'hold'}; const b0=E.braceOf(W,t,e,-dirx,0).mass;
    clump([t],e,sx,12); step(W,30); const b1=E.braceOf(W,t,e,-dirx,0); console.log('    버팀 '+b0.toFixed(0)+' → '+b1.mass.toFixed(0)+' · 막기 '+t.raised);
    ok(t.raised&&b1.set&&b1.mass>b0*1.2,'혼자 뭉침 = 제자리 태세 (막기 · 버팀 ×1.25)'); ok(Math.hypot(t.x-sx,t.y-12)<0.2,'제자리'); }
}
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
