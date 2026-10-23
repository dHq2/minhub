// (v1.1: 밀침 조건에 "밀려나기 전에 쓰러짐" 더함 — v8.8.6 영거리) v8.8.5 엔진 시험 — eng8850.js v1.0 (샷건: 조준 거의 없음 · 빠른 연사 (발 사이 0.7초 안) · 코앞에서 세게 · 밀침 · 권총은 그대로 · 수치표)
const {E,R,U,DES,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const GD={ref:'C-195',name:'간두',tier:2,cls:'기동',role:'사수',weapon:'권총',ammo:100,alt:null,sm:0.95,height:1.9,weight:85,sizeCls:'중형',nv:true,nvG:'B',ov:{hp:110,atk:26},traits:['사격A','회피B','은신C','반사신경','전투센스']};
const SG=R.weapons['샷건'];
console.log('A. 수치표'); ok(SG.aimK<=0.3&&SG.recK<=0.65,'조준 ×'+SG.aimK+' · 거둠 ×'+SG.recK); ok(SG.near.mul>=3&&SG.near.r>=2&&SG.near.kb>=1.4,'코앞 ×'+SG.near.mul+' · '+SG.near.r+'칸 · 밀침 '+SG.near.kb);
const trial=(wpn,def,dist,N,sec)=>{ let kill=0,tk=[],gaps=[],first=[],push=[]; for(let s=1;s<=N;s++){ const W=W_([mk({...GD,weapon:wpn,ammo:wpn==='샷건'?50:100},0,8,8)],[mk({...def,ov:{hp:(def.ov&&def.ov.hp)||200,atk:0}},1,8+dist,8,{spdMul:0})],s,'hold'); W.amb=1; E.computeLight(W); const [g,d]=W.units; g.order={k:'attack',b:d.i}; let sn=0,v=[],last=-9; const x0=d.x; let mx=0; while(W.t<sec&&!W.over&&d.alive){ E.stepWorld(W,1/30); if((W.shotN||0)>sn){ if(W.t-last>0.2) v.push(W.t); last=W.t; sn=W.shotN; } mx=Math.max(mx,d.x-x0); } if(!d.alive){ kill++; tk.push(W.t); } if(v.length) first.push(v[0]); for(let i=1;i<v.length;i++) gaps.push(v[i]-v[i-1]); push.push(mx); } const av=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN; return { kill, N, tk:av(tk), first:av(first), gap:av(gaps), push:av(push) }; };
console.log('B. 코앞 (1.2칸) 샷건');
{ const a=trial('샷건',DES['창병'],1.2,16,6), b=trial('샷건',DES['검방패기사'],1.2,16,8), p=trial('권총',DES['창병'],1.2,16,6);
  console.log('    창병(150)  ',a.kill+'/'+a.N,'· 평균',a.tk.toFixed(1),'초 · 첫 발',a.first.toFixed(2),'· 발 사이',a.gap.toFixed(2),'· 밀림',a.push.toFixed(1)); console.log('    검방패기사(200)',b.kill+'/'+b.N,'· 평균',b.tk.toFixed(1),'초 · 발 사이',b.gap.toFixed(2)); console.log('    (권총 창병)',p.kill+'/'+p.N,'· 발 사이',p.gap.toFixed(2));
  ok(a.first<=0.25,'첫 발이 거의 바로 나감 ('+a.first.toFixed(2)+'초)'); ok(a.gap<=0.75&&b.gap<=0.7,'발 사이가 짧음 (0.7초 안팎 — 전엔 1.0 ~ 1.5초)'); ok(a.kill/a.N>=0.6,'창병을 6초 안에 열에 예닐곱은 쓰러뜨림 (크게 밀려난 쪽은 거리가 벌어짐) ('+a.kill+'/'+a.N+')'); ok(b.kill/b.N>=0.7,'방패 기사도 8초 안에 대부분 ('+b.kill+'/'+b.N+')'); ok(a.push>=2||a.tk<=1.0,'밀침이 큼 ('+a.push.toFixed(1)+'칸) — 또는 밀려나기 전에 쓰러짐 (v8.8.6 영거리로 산탄이 갑옷을 뚫어 평균 '+a.tk.toFixed(1)+'초)'); ok(p.gap>=0.9,'권총 박자는 그대로 ('+p.gap.toFixed(2)+'초)'); }
console.log('C. 멀리 (3칸 넘게) 에선 산탄이 약함 — 코앞이 히든카드');
{ const near=trial('샷건',DES['곤봉적'],1.2,12,5), far=trial('샷건',DES['곤봉적'],4.0,12,5); console.log('    곤봉적(400) 코앞',near.kill+'/'+near.N,' 4칸',far.kill+'/'+far.N); ok(near.kill>far.kill,'코앞이 더 잘 쓰러뜨림 ('+near.kill+' > '+far.kill+')'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
