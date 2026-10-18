// v4.0 headless test (t4.js v1.1 — v1.1: RT3 환경 변수로 엔진 파일 고름): gridC 14x10 example + 사선 scenario
const E=require(process.env.RT3?require('path').resolve(process.env.RT3):'./rt3.js');   /* v7.19.1 RT3=다른 엔진 파일로도 (회귀가 도는 동안 시험) */
const R=JSON.parse(JSON.stringify(E.DEFAULT_RULES));
const ROS=require('./roster4.json');const RB=Object.fromEntries(ROS.map(r=>[r[0],r]));
let gid=0;const U=(ref,side,ex)=>{const r=RB[ref];return {id:ref+(gid++),ref,name:r[1],tier:r[3]||1,cls:r[4],sm:r[9]||1,shield:!!r[10],weapon:r[11]||'',side,x:0,y:0,nv:side===1,hero:false,ov:{},grp:'g'+(gid++),...(ref==='C-006'?{role:'전선'}:{}),traits:ref==='C-006'?['높은후각','반사신경']:ref==='C-076'?['높은후각']:[],...(side===1?{nv:true,nvG:ref==='C-052'?'A':'B'}:{}),...(ref==='C-076'&&side===1?{tac:'pack'}:{}),...(['C-053','C-162','C-164'].includes(ref)?{traits:['공통스킬:투창']}:{}),...((ref==='C-159'||ref==='C-052')&&side===1?{tac:'stalk'}:{}),...(ref==='C-008'?{cls:'기동',bladeHands:true,unique:['저주:맥아'],traits:['사족보행','속력A','근력B','괴력B','제약:총포류','제약:활'],skill:{name:'양동이 약',pool:500,per:120,wind:0.8,rec:0.4,rng:0.8}}:{}),...(ref==='C-008'?{bold:0.8}:{}),...ex};};
function ex(party,groups){
  const S={type:'gridC',W:14,H:10,seed:1618,units:[],torches:[],flips:[]};
  S.units.push(U('C-001',0,{hero:true,nv:false}),...party.map(r=>U(r,0,{nv:false})));
  groups.forEach(g=>{const id='G'+(gid++);g.forEach(ref=>S.units.push(U(ref,1,{grp:id})));});
  const m=E.buildMap(S),taken=new Set();
  for(const u of S.units.filter(u=>u.side===0).sort((a,b)=>b.hero-a.hero)){const p=E.freeNear(m,m.start.x,m.start.y,taken);u.x=p.x;u.y=p.y;}
  const gs=[],by={};for(const u of S.units.filter(u=>u.side===1)){if(!by[u.grp]){by[u.grp]=[];gs.push(by[u.grp]);}by[u.grp].push(u);}
  gs.forEach((g,i)=>{const ax=2+(i+0.5)*10/gs.length,ay=1.5;g.forEach(u=>{const p=E.freeNear(m,ax,ay,taken);u.x=p.x;u.y=p.y;});});
  S.torches=E.autoTorches(m,S.seed,Math.round(14*10/420));
  return S;
}
function batch(S,n){let r={win:0,lose:0,time:0},T=0,k={};for(let j=0;j<n;j++){const w=E.runAuto(S,R,j*13+5);r[w.result]++;T+=w.t;for(const l of w.log){k[l.k]=(k[l.k]||0)+1; if(l.k==='mood') k['m:'+l.m]=(k['m:'+l.m]||0)+1; if(l.k==='hit'&&l.ff) k.FF=(k.FF||0)+1; if(l.k==='hit'&&l.block) k.BLOCK=(k.BLOCK||0)+1; if(l.k==='hit'&&l.meant!=null) k.INTERCEPT=(k.INTERCEPT||0)+1;}}
  return {r,T:(T/n).toFixed(1),k};}
module.exports={E,R,U,ex,batch,RB};
if (require.main===module){
  const cases=[[['C-002','C-004'],[['C-076','C-076'],['C-159'],['C-052']]],[['C-006','C-008'],[['C-076','C-076'],['C-159'],['C-052']]],[['C-002','C-004'],[['C-150'],['C-159'],['C-076']]]];
  for(const [p,g] of cases){const S=ex(p,g);const b=batch(S,60);console.log(p.map(c=>RB[c][1]).join('+'),'vs',g.flat().map(c=>RB[c][1]).join('+'),JSON.stringify(b.r),b.T+'s');console.log('  ',JSON.stringify(b.k));}
}
