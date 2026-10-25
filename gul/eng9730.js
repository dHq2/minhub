// v9.9.0 엔진 시험 — eng9730.js v2.0 (v2.0: 돌격은 한 가지 — 방패 · 맨손 · 거구는 몸으로 들이받음 (밀침) · 그 밖은 무기가 먼저 닿으면 무기로 치고 넉백 · 양쪽 편 같음 / v1.x: 공격 · 방어 돌격 시험판 (폐기))
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const WF=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.seenBy=1; }); return W; };
const S={};
for (const side of [0,1]) for (const [nm,ex] of [['창',{weapon:'창'}],['장검',{weapon:'장검'}],['방패',{weapon:'장검',shield:true}]]){ const R0={dmg:0,mv:0,impact:0,stab:0};
  for (let sd=1; sd<=12; sd++){ const W=WF([mk({...REB,name:'돌격자',shield:false,ov:{hp:9e4,atk:20},traits:[],gear:{},...ex},side,10,10),mk({...REB,name:'받는 이',shield:true,weapon:'장검',ov:{hp:9e4,atk:1},traits:[],gear:{}},1-side,16,10)],sd);
    const [a,t]=W.units; t.order={k:'hold'}; t.guardOff=true; t.spd=0.001; t.ev=0.0001; t.noChg=true; t.face=t.fg=Math.PI; a.face=a.fg=0; const x0=t.x; E.startCharge(W,a,t,null); for(let i=0;i<45;i++) E.stepWorld(W,1/30);
    R0.dmg+=Math.min(150,(W.log.find(l=>l.k==='hit'&&l.a===a.i)||{dmg:0}).dmg); R0.mv+=Math.abs(t.x-x0); R0.impact+=W.log.some(l=>l.k==='impact'&&l.a===a.i)?1:0; R0.stab+=W.log.some(l=>l.k==='chgStab'&&l.a===a.i)?1:0; }
  S[side+nm]=R0; console.log(`  ${side?'적':'우리'} ${nm}: 피해 ${(R0.dmg/12).toFixed(0)} · 밀린 거리 ${(R0.mv/12).toFixed(2)} · 몸 충돌 ${R0.impact}/12 · 무기로 침 ${R0.stab}/12`); }
for (const side of [0,1]){ const s=x=>S[side+x];
  ok(s('창').stab>=11&&s('창').impact===0&&s('장검').stab>=11,(side?'적':'우리')+' — 창 · 장검은 무기가 먼저 닿음 (몸 충돌 없음)');
  ok(s('창').mv>0.3&&s('장검').mv>0.3,'무기로 쳐도 넉백');
  ok(s('방패').impact>=11&&s('방패').stab===0,'방패는 몸으로 들이받음 (밀침)'); }
ok(Math.abs(S['0장검'].dmg-S['1장검'].dmg)<=Math.max(S['0장검'].dmg,S['1장검'].dmg)*0.35+2,'양쪽 편 비슷');
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
