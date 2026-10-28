// 세자르 점검 v1.0 — 유저 판 그대로 (인주 · 카리우스 · 레베카 · 노먼 vs 세자르) · 12판 · RT3=옛 엔진 · NEW=사거리 (1 이면 1.25 · 예: NEW=0.95)
const {E,R,INJ,NOR,REB,KAR,mk,W_}=require('./scen_lib790.js');
const CZ={ref:'C-045',name:'세자르',tier:6,cls:'근접',role:'공격수',weapon:'노인의 검',height:2.1,weight:70,poise:6,ccRes:0.85,sizeCls:'중대형',nv:true,nvG:'S',bold:1,ov:{hp:500,atk:62,...(process.env.NEW?{rng:+process.env.NEW>1?1.25:+process.env.NEW||1.25}:{})},traits:['보스','베테랑','회피S','속력S','갑피','망자','미라'],gear:{머리:{name:'노인의 왕관',mat:'투구',tier:1}},brain:'cesar',dcounter:0.5,frostP:0.25,severP:0.35,unique:['권위'],active:['원형 베기','어깨 박치기','하늘 가르기','관통 찌르기','냉기 참격','마구 베기']};
const N=+process.env.N||12, BIG=['upcut','thrust','wave','ult','spin','shoulder'];
const S={dur:0,dead:0,pdead:0,first:[],sk:{},surp:0,step:0,spdCh:0,ang:0,probeT:0,turn:[],dmg:0,auth:0};
for (let sd=1; sd<=N; sd++){
  const W=W_([mk(INJ,0,14,4),mk(KAR,0,15,4),mk(REB,0,13,4),mk(NOR,0,14,3)],[mk(CZ,1,14,12)],sd,'free'); W.amb=1; E.computeLight(W);
  const c=W.units.find(u=>u.cz); let first=null, lastSpd=null, lastA=null, mx=0, t0=null;
  while (W.t<40 && !W.over && c.alive){ const f0=c.face; E.stepWorld(W,1/30); if (c.cz.on && t0==null) t0=W.t;
    if (c.face!=null&&f0!=null){ let d=Math.abs(c.face-f0)%(2*Math.PI); if(d>Math.PI) d=2*Math.PI-d; mx=Math.max(mx,d*30); }
    if (c.czSpd!==lastSpd){ S.spdCh++; lastSpd=c.czSpd; }
    const P=W.units.filter(u=>u.side===0&&u.alive); if (P.length && c.cz.on && !c.cz.fury){ const cx=P.reduce((s,u)=>s+u.x,0)/P.length, cy=P.reduce((s,u)=>s+u.y,0)/P.length, a=Math.atan2(c.y-cy,c.x-cx); if (lastA!=null){ let d=a-lastA; d=Math.atan2(Math.sin(d),Math.cos(d)); S.ang+=Math.abs(d); } lastA=a; S.probeT+=1/30; } else lastA=null; }
  for (const l of W.log){ if (l.a!==c.i) continue; if (l.k==='czStart'){ S.sk[l.s]=(S.sk[l.s]||0)+1; if (first==null && BIG.includes(l.s)) first=l.t-(t0||0); if (l.s==='auth') S.auth++; } if (l.k==='czSurp') S.surp++; }
  S.step+=c.cz.nStep||0; S.dur+=W.t-(t0||0); S.dead+=c.alive?0:1; S.pdead+=W.units.filter(u=>u.side===0&&!u.alive).length; S.first.push(first==null?99:+first.toFixed(1)); S.turn.push(Math.round(mx*180/Math.PI)); S.dmg+=W.units.filter(u=>u.side===0).reduce((s,u)=>s+(u.max-Math.max(0,u.hp)),0);
}
const med=a=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length/2)];
console.log(JSON.stringify({ 판:N, 평균싸움초:+(S.dur/N).toFixed(1), 세자르쓰러짐:S.dead, 아군쓰러짐:S.pdead, 아군받은피해:Math.round(S.dmg/N), 첫큰기술초_중앙:med(S.first), 기술:S.sk, 불쑥:S.surp, 스텝:+(S.step/N).toFixed(1), 걸음박자바뀜_10초당:+(S.spdCh/S.dur*10).toFixed(1), 둘레돈각도_탐색10초당:+(S.ang/Math.max(1,S.probeT)*10*180/Math.PI).toFixed(0), 돌아서기_최대도초_중앙:med(S.turn) }));
