// 굿윌 겨룸 재기 — bal8780.js v1.1 (v1.1: 세자르는 깨어 있는 채로 (cz.on) · v1.0: 페이지 설계 그대로 (pdes) · 1대1 · 1대 무리 · 적 · 아군 바꿔서)
const {E,R,U,mk}=require('./scen_lib790.js'); const PD=require('./pdes.js');
const ATK=+(process.env.GWATK||56), HP=+(process.env.GWHP||360);
const GW={ref:'C-010',name:'굿윌',tier:5,cls:'기동',role:'공격수',weapon:'맨손',shield:false,height:1.85,weight:70,sm:1.1,dcounter:0.45,nv:true,nvG:'A',ov:{hp:HP,atk:ATK},traits:['속력A','회피A','급소B','반사신경','전투센스'],unique:['푸른 번개'],active:['손바닥','니킥','딱','딱딱딱','내려찍기','올려차기']};
const step=(W)=>{ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; };
const des=k=>{ const d=JSON.parse(JSON.stringify(PD[k])); delete d.key; return d; };
function fight(gwSide, foes, seed){ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false;
  const us=[mk(GW,gwSide,12,10)]; foes.forEach((k,i)=>us.push(mk(des(k),1-gwSide,25+(i%2),8+i*1.5)));
  const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units:us,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed,{headless:true}); E.computeLight(W);
  const g=W.units[0], F=W.units.slice(1); for(const f of F) if(f.cz) f.cz.on=true; let k=3600; while(k-->0&&g.alive&&F.some(f=>f.alive)) step(W);
  return {win:g.alive&&!F.some(f=>f.alive), lose:!g.alive, t:W.t, hp:Math.max(0,g.hp)/g.maxHp||Math.max(0,g.hp)/HP, foeHp:F.reduce((a,f)=>a+Math.max(0,f.hp),0)}; }
const cases=[['세자르'],['각혈'],['호레이쇼'],['카리우스'],['레베카'],['탕아'],['검기사','창병','궁수','검방패기사'],['곤봉적']];
for (const c of cases){ let w=0,l=0,T=0,H=0; const N=8; for(let s=1;s<=N;s++){ const r=fight(s%2,c,s*7+1); if(r.win) w++; if(r.lose) l++; T+=r.t; H+=r.hp; }
  console.log((c.join('+')).padEnd(22),'굿윌',w+'승',l+'패','· 평균',(T/N).toFixed(1)+'초','· 남은 체력',(H/N*100).toFixed(0)+'%'); }
