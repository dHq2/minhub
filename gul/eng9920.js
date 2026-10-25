// v9.9.2 엔진 시험 — eng9920.js v1.0 (빼꼼 사격: 맞닿은 탱커 뒤 사수는 어깨 너머로 쏨 · 탱커를 맞히지 않음 · 쏜 뒤 제자리 · 두 줄이면 못 쏨 · 떨어져 있으면 예전처럼 · 양쪽 편)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const tank=(name,x,y,side)=>mk({...REB,name,shield:true,weapon:'장검',ov:{hp:9e4,atk:1},traits:[],gear:{}},side,x,y);
const gun=(x,y,side)=>mk({...REB,name:'사수',weapon:'소총',shield:false,ov:{hp:9e4,atk:10},traits:['사격B'],gear:{}},side,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>u.seenBy=1); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
for (const side of [0,1]){ const R0={peek:0,shots:0,ff:0,back:0,two:0,twoShots:0};
  for (let sd=1; sd<=4; sd++){
    { const W=WF([gun(9.3,10,side),tank('탱커',10,10,side),mk({...REB,name:'적',shield:false,weapon:'장검',ov:{hp:9e4,atk:1},traits:[],gear:{}},1-side,14.5,10)],sd); const [g,k,e]=W.units; g.r=g.r||0.33; g.x=k.x-k.r-g.r-0.05; for(const x of [g,k,e]){ x.order={k:'hold'}; x.spd=0.001; } g.target=e; g.state='fight';
      const gx=g.x; step(W,150); R0.peek+=W.log.filter(l=>l.k==='peek'&&l.a===g.i).length?1:0; R0.shots+=W.log.filter(l=>(l.k==='hit'||l.k==='miss')&&l.a===g.i).length; R0.ff+=W.log.filter(l=>l.k==='hit'&&l.a===g.i&&l.b===k.i).length; step(W,30); if(Math.abs(g.x-gx)<0.3) R0.back++; }
    { const W=WF([gun(8.6,10,side),tank('앞1',10,10,side),tank('앞2',9.3,10,side),mk({...REB,name:'적',shield:false,weapon:'장검',ov:{hp:9e4,atk:1},traits:[],gear:{}},1-side,14.5,10)],sd); const [g,k1,k2,e]=W.units; k2.x=k1.x-k1.r-k2.r-0.03; g.x=k2.x-k2.r-g.r-0.05; for(const x of [g,k1,k2,e]){ x.order={k:'hold'}; x.spd=0.001; } g.target=e; g.state='fight';
      step(W,150); R0.twoShots+=W.log.filter(l=>l.k==='hit'&&l.a===g.i&&l.b===e.i).length; R0.two+=W.log.filter(l=>l.k==='hit'&&l.a===g.i&&(l.b===k1.i||l.b===k2.i)).length; } }
  console.log(`    ${side?'적':'우리'}: 빼꼼 ${R0.peek}/4판 · 쏜 ${R0.shots} · 탱커 맞음 ${R0.ff} · 제자리로 ${R0.back}/4 · 두 줄: 적 맞힘 ${R0.twoShots} · 아군 맞힘 ${R0.two}`);
  ok(R0.peek>=3&&R0.shots>=4,(side?'적':'우리')+' — 맞닿은 탱커 뒤에서 어깨 너머로 쏨'); ok(R0.ff===0,'탱커를 맞히지 않음'); ok(R0.back>=3,'쏜 뒤 제자리로'); ok(R0.two===0,'두 줄 뒤에선 아군을 맞히지 않음 (쏘지 않거나 막힘)'); }
console.log('C. 두 사람 사이 (틈)');
for (const side of [0,1]){ let sh=0, ff=0, pk=0; for (let sd=1; sd<=4; sd++){ const W=WF([gun(9.2,10,side),tank('왼',10,9.6,side),tank('오른',10,10.4,side),mk({...REB,name:'적',shield:false,weapon:'장검',ov:{hp:9e4,atk:1},traits:[],gear:{}},1-side,14.5,10)],sd); const [g,a,b,e]=W.units; a.y=10-a.r-0.01; b.y=10+b.r+0.01; g.x=a.x-a.r-g.r-0.05; for(const x of [g,a,b,e]){ x.order={k:'hold'}; x.spd=0.001; }
    g.target=e; g.state='fight'; step(W,150); sh+=W.log.filter(l=>l.k==='hit'&&l.a===g.i&&l.b===e.i).length; ff+=W.log.filter(l=>l.k==='hit'&&l.a===g.i&&(l.b===a.i||l.b===b.i)).length; pk+=W.log.some(l=>l.k==='peek'&&l.a===g.i)?1:0; }
  console.log('    '+(side?'적':'우리')+': 적 맞힘 '+sh+' · 앞줄 맞힘 '+ff+' · 빼꼼 '+pk+'/4'); ok(sh>0&&ff===0,(side?'적':'우리')+' — 맞닿은 둘 사이로 쏨 (앞줄은 안 맞음)'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
