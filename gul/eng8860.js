// v8.8.6 영거리 사격 시험 — eng8860.js v1.0 (수치표 · 거리별 관통력 (첫 일제 사격) · 샷건 판금 관통 · 총 · 활 · 적 사수도 같은 규칙 · 곡사 제외)
const {E,R,U,DES,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const GD={ref:'C-195',name:'간두',tier:2,cls:'기동',role:'사수',weapon:'권총',ammo:100,alt:null,sm:0.95,height:1.9,weight:85,sizeCls:'중형',nv:true,nvG:'B',ov:{hp:110,atk:26},traits:['사격A','회피B','은신C','반사신경','전투센스']};
const tgt={...DES['곤봉적'],ov:{hp:9999,atk:0}};
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN;
const W0=W_([mk(GD,0,8,8)],[mk(tgt,1,12,8)],1,'hold'); const PB=W0.rules.pen.pb;
ok(PB&&PB['총포류']&&PB['활']&&PB['총포류'].k>0&&PB['활'].k>0,'수치표 pen.pb (총포류 · 활) '+JSON.stringify(PB));
ok(W0.rules.weapons['샷건'].pb&&W0.rules.weapons['샷건'].pb.k>PB['총포류'].k,'샷건은 따로 더 큼 '+JSON.stringify(W0.rules.weapons['샷건'].pb));
// 첫 일제 사격 하나만 (밀침 · 물러남 전). 가까운 쪽(shooterSide) 도 바꿔서
function volley(wpn, gap, N, shooterSide){ const Ps=[],pen=[]; for (let s=1;s<=N;s++){
  const sh=mk({...GD,weapon:wpn,ammo:wpn==='샷건'?50:100},shooterSide,8,8), tg=mk(tgt,1-shooterSide,8+gap+0.31+0.4355,8,{spdMul:0});
  const W=shooterSide===0?W_([sh],[tg],s,'hold'):W_([tg],[sh],s,'hold'); W.amb=1; E.computeLight(W); const g=W.units.find(u=>u.side===shooterSide), d=W.units.find(u=>u.side!==shooterSide); g.order={k:'attack',b:d.i};
  let t1=null; while(W.t<5&&!W.over){ E.stepWorld(W,1/30); const h=W.log.find(l=>l.k==='hit'&&l.a===g.i); if(h){ t1=h.t; break; } }
  if(t1==null) continue; E.stepWorld(W,1/30); for(const l of W.log) if(l.k==='hit'&&l.a===g.i&&l.t<t1+0.12&&l.part==='몸통'&&l.A>0&&!l.crit){ Ps.push(l.P); pen.push(l.pen?1:0); } }
  return { P: avg(Ps), pen: avg(pen), n: Ps.length }; }
const N=+process.env.N||24;
for (const [wpn,kind] of [['샷건','총포류'],['권총','총포류'],['소총','총포류'],['단궁','활']]){
  const a=volley(wpn,0.3,N,0), b=volley(wpn,1.2,N,0), c=volley(wpn,2.6,N,0), d=volley(wpn,4.5,N,0);
  console.log(`    ${wpn}: 관통력 0.3칸 ${a.P.toFixed(0)} · 1.2칸 ${b.P.toFixed(0)} · 2.6칸 ${c.P.toFixed(0)} · 4.5칸 ${d.P.toFixed(0)} | 뚫음 ${(a.pen*100).toFixed(0)}% · ${(b.pen*100).toFixed(0)}% · ${(c.pen*100).toFixed(0)}% · ${(d.pen*100).toFixed(0)}% (맞은 ${a.n}/${b.n}/${c.n}/${d.n})`);
  ok(a.n>5&&c.n>5&&d.n>5,wpn+' 표본');
  const far=wpn==='샷건'?c:d;   // 샷건은 사거리 2.5 라 4.5칸에선 걸어 들어와서 쏨 — 2.6칸을 먼 곳으로
  ok(a.P>b.P&&b.P>c.P*0.98&&(wpn==='샷건'||c.P>=d.P*0.95),wpn+' 가까울수록 관통력 ↑ (0.3 > 1.2 > 2.6'+(wpn==='샷건'?'':' ≥ 4.5')+')');
  const fk=(wpn==='샷건'?R.weapons['샷건'].pb.k:PB[kind].k); ok(a.P/far.P>1+fk*0.6,wpn+' 코앞/먼 곳 비 '+(a.P/far.P).toFixed(2)+' (기대 ≥ '+(1+fk*0.6).toFixed(2)+')');
  if (wpn==='샷건'){ ok(a.pen>=0.7,'샷건 코앞 판금 관통 '+(a.pen*100).toFixed(0)+'% (≥ 70%)'); ok(c.pen<=0.2,'샷건 2.6칸 판금 관통 '+(c.pen*100).toFixed(0)+'% (≤ 20%)'); }
  // 적 사수도 같은 규칙 (편을 바꿔서)
  if (wpn==='권총'||wpn==='단궁'){ const e=volley(wpn,0.3,N,1), f=volley(wpn,4.5,N,1); ok(e.P/f.P>1.1,wpn+' 적 사수도 가까울수록 ↑ '+(e.P/f.P).toFixed(2)); } }
// 곡사 · 투창은 영향 없음 — pbMul 은 엔진 안이라 규칙만 확인: 투창 · 마법 칸에는 pb 없음
ok(!R.weapons['마법'].pb&&!(R.javelin&&R.javelin.pb),'마법 · 투창에는 영거리 없음');
console.log(fails?'FAILS '+fails:'ALL ENG8860 OK'); process.exit(fails?1:0);
