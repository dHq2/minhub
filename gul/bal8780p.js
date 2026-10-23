// 포렌 겨룸 재기 — bal8780p.js v1.0 (v1.0: 포렌 (쥐 군단) 1대1 · 1대 무리 · 적 · 아군 바꿔서 · 걸린 시간 (쥐 24 성능))
const {E,R,mk}=require('./scen_lib790.js'); const PD=require('./pdes.js');
const PR={ref:'C-006',name:'포렌',tier:2,cls:'지휘',role:'전선',weapon:'포렌의 대검',shield:false,sm:0.78,height:1.4,weight:140,nv:true,nvG:'B',noChg:true,ov:{hp:+(process.env.PHP||532),atk:46},traits:['지휘S','군주','높은후각','반사신경'],gear:{몸:{name:'포렌의 중갑',mat:'판금',tier:3}},unique:['쥐들의 왕'],active:['쥐 표식','쥐 방진','쥐 방패','쥐 사다리','쥐 포박']};
const step=(W)=>{ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; };
const des=k=>{ const d=JSON.parse(JSON.stringify(PD[k])); delete d.key; return d; };
function fight(side, foes, seed){ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false;
  const us=[mk(PR,side,10,10)]; foes.forEach((k,i)=>us.push(mk(des(k),1-side,25+(i%2),8+i*1.5)));
  const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units:us,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed,{headless:true}); E.computeLight(W);
  const p=W.units[0], F=W.units.filter(u=>u.side!==p.side); for(const f of F) if(f.cz) f.cz.on=true; let k=3600, maxR=0; const T0=Date.now();
  while(k-->0&&p.alive&&F.some(f=>f.alive)){ step(W); maxR=Math.max(maxR,W.units.filter(r=>r.alive&&r.ratOf===p.i).length); }
  return {win:!F.some(f=>f.alive), lose:!p.alive, t:W.t, hp:Math.max(0,p.hp)/p.max, ms:(Date.now()-T0)/Math.max(1,W.t*30), maxR}; }
const cases=(process.argv[2]?process.argv[2].split(';').map(s=>s.split('+')):[['세자르'],['각혈'],['호레이쇼'],['카리우스'],['굿윌'],['검기사','창병','궁수','검방패기사'],['곤봉적']]);
for (const c of cases){ let w=0,l=0,T=0,H=0,ms=0,mr=0; const N=+(process.env.N||8); for(let s=1;s<=N;s++){ const r=fight(s%2,c,s*7+1); if(r.win) w++; if(r.lose) l++; T+=r.t; H+=r.hp; ms+=r.ms; mr=Math.max(mr,r.maxR); }
  console.log((c.join('+')).padEnd(22),'포렌',w+'승',l+'패','· 평균',(T/N).toFixed(1)+'초','· 남은 체력',(H/N*100).toFixed(0)+'%','· 쥐 최다',mr,'· 한 걸음',(ms/N).toFixed(2)+'ms'); }
