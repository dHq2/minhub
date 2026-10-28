// v9.12.0 엔진 시험 — eng10030.js v1.0 (세자르 다시: 빠르게 몸을 돌림 · 큰 기술이 일찍 (중앙 3.5초 안) · 기술 갈래 다섯 넘게 · 탐색 중 불쑥 큰 기술 · 걸음 박자가 바뀜 · 탐색 중 일행 둘레를 돎 — 유저 판 그대로 12판)
const {E,R,INJ,NOR,REB,KAR,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const CZ={ref:'C-045',name:'세자르',tier:6,cls:'근접',role:'공격수',weapon:'노인의 검',height:2.1,weight:70,poise:6,ccRes:0.85,sizeCls:'중대형',nv:true,nvG:'S',bold:1,ov:{hp:500,atk:62,rng:1.0},traits:['보스','베테랑','회피S','속력S','갑피','망자','미라'],gear:{머리:{name:'노인의 왕관',mat:'투구',tier:1}},brain:'cesar',dcounter:0.5,frostP:0.25,severP:0.35,unique:['권위'],active:['원형 베기','어깨 박치기','하늘 가르기','관통 찌르기','냉기 참격','마구 베기']};
const BIG=['upcut','thrust','wave','ult','spin','shoulder']; const first=[], kinds=new Set(); let surp=0, tms=new Set(), turn=0, ang=0, pT=0;
for (let sd=1; sd<=12; sd++){ const W=W_([mk(INJ,0,14,4),mk(KAR,0,15,4),mk(REB,0,13,4),mk(NOR,0,14,3)],[mk(CZ,1,14,12)],sd,'free'); W.amb=1; E.computeLight(W);
  const c=W.units.find(u=>u.cz); let t0=null, la=null;
  while (W.t<25 && !W.over && c.alive){ const f0=c.face; E.stepWorld(W,1/30); if (c.cz.on && t0==null) t0=W.t; if (c.cz.tm) tms.add(c.cz.tm);
    if (f0!=null&&c.face!=null){ let d=Math.abs(c.face-f0)%(2*Math.PI); if(d>Math.PI) d=2*Math.PI-d; turn=Math.max(turn,d*30*180/Math.PI); }
    const P=W.units.filter(u=>u.side===0&&u.alive); if (P.length&&c.cz.on&&!c.cz.fury&&(!c.act||c.act.s==='step')){ const cx=P.reduce((s,u)=>s+u.x,0)/P.length, cy=P.reduce((s,u)=>s+u.y,0)/P.length, a=Math.atan2(c.y-cy,c.x-cx); if (la!=null){ let d=a-la; d=Math.atan2(Math.sin(d),Math.cos(d)); ang+=Math.abs(d); } la=a; pT+=1/30; } else la=null; }
  let f=99; for (const l of W.log){ if (l.a!==c.i) continue; if (l.k==='czStart'&&BIG.includes(l.s)){ kinds.add(l.s); if (f===99) f=l.t-(t0||0); } if (l.k==='czSurp') surp++; } first.push(f); }
const med=first.slice().sort((a,b)=>a-b)[6], degs=ang/Math.max(1,pT)*10*180/Math.PI;
console.log(`    첫 큰 기술 (중앙) ${med.toFixed(1)}초 · 기술 ${[...kinds].join(' ')} · 불쑥 ${surp} · 박자 ${[...tms].join(' ')} · 돌아서기 최대 ${Math.round(turn)}°/초 · 탐색 중 둘레 ${Math.round(degs)}°/10초`);
ok(med<=3.5,'큰 기술이 일찍 (첫 큰 기술 중앙 3.5초 안)'); ok(kinds.size>=5,'기술 갈래 다섯 넘게'); ok(surp>=1,'탐색 중에도 불쑥 큰 기술'); ok(tms.size>=4,'걸음 박자 넷 (아주 천천히 · 걷기 · 뜀 · 질주)'); ok(turn>=600,'빠르게 몸을 돌림 (초당 600° 넘게)'); ok(degs>=150,'탐색 중 일행 둘레를 돎 (10초에 150° 넘게)');
console.log(fails?'FAIL '+fails:'ALL OK');
