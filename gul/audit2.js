// 이상한 행동 찾기 (기본 판 N판)
const {E,R}=require('./t4.js'); const {base}=require('./t52.js');
const N=+process.argv[2]||30; const A={}; const add=(k,v=1)=>A[k]=(A[k]||0)+v;
const origLaunch=null;
for(let j=0;j<N;j++){
  const W=E.createWorld(base(),R,j*7+11,{headless:true}); const n=i=>W.units[i].name;
  const still={}, last={};
  while(!W.over){ E.stepWorld(W,1/30);
    for(const s of W.shots){ const u=W.units[s.a]; if(!E.isRangedW((R.weapons||{})[u.weapon]) && !s.jav) add('비원거리 탄:'+u.name); }
    for(const u of W.units){ if(!u.alive||u.kb||W.t<u.proneT) { still[u.i]=0; continue; }
      const mv=Math.hypot(u.x-(last[u.i]||{x:u.x}).x,u.y-(last[u.i]||{y:u.y}).y); last[u.i]={x:u.x,y:u.y};
      const foeNear=W.units.some(f=>f.alive&&f.side!==u.side&&Math.hypot(f.x-u.x,f.y-u.y)<4&&(u.side===1||f.seenBy));
      if(mv<0.002&&!u.act&&foeNear) still[u.i]=(still[u.i]||0)+1/30; else { if((still[u.i]||0)>3) add('3초넘게 멈춤:'+u.name); still[u.i]=0; }
    }
    if(W.t>120) break;
  }
  for(const l of W.log){
    if(l.k==='hit'&&l.ff) add('오사:'+n(l.a)+'→'+n(l.b));
    if(l.k==='stance') add('stance:'+l.side+':'+l.s);
    if(l.k==='miss'&&/돌리지/.test(l.why)) add('몸못돌림:'+n(l.a));
    if(l.k==='mood') add('mood:'+n(l.a));
    if(l.k==='charge') add('charge:'+n(l.a));
    if(l.k==='chargeMiss') add('chargeMiss:'+n(l.a));
    if(l.k==='hold') add('사격멈춤:'+n(l.a));
  }
}
const out=Object.entries(A).map(([k,v])=>[k,+(v/N).toFixed(2)]).sort((a,b)=>a[0].localeCompare(b[0]));
console.log(out.filter(([k])=>!k.startsWith('mood:')).map(x=>x.join(' ')).join('\n'));
console.log('mood changes/game:', out.filter(([k])=>k.startsWith('mood:')).map(x=>x.join(' ')).join(' · '));
