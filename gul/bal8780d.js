// 물레 · 콜라이더 · 테헤라 겨룸 재기 — bal8780d.js v1.0 (v1.0: 페이지 설계 그대로 (pdes) · 서포터는 혼자가 아니라 무리 속에서 — 바탕 무리 (나달 · 모닝스타) + 서포터 하나 vs 적 무리 ·
//   견줌: 서포터 없음 · 딸기 · 가윤 (같은 자리의 다른 치유) · 적 편에 서포터 (같은 규칙 — 적이 쓰면 얼마나 어려워지나) · 기술 쓴 횟수 · 동료 오사 (광역 손짓))
const {E,R,mk}=require('./scen_lib790.js'); const PD=require('./pdes.js');
const step=(W)=>{ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; };
const des=k=>{ const d=JSON.parse(JSON.stringify(PD[k])); delete d.key; return d; };
function fight(team, foes, seed, flip){ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false;
  const A=flip?1:0, us=[]; team.forEach((k,i)=>us.push(mk(des(k),A,9+(i%2)*1.6,7+i*2))); foes.forEach((k,i)=>us.push(mk(des(k),1-A,28+(i%2),7+i*1.8)));
  const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units:us,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed,{headless:true}); E.computeLight(W);
  const M=W.units.filter(u=>u.side===A), F=W.units.filter(u=>u.side!==A); for(const f of W.units) if(f.cz) f.cz.on=true; let k=3600*2;
  while(k-->0&&M.some(u=>u.alive&&!u.summon)&&F.some(f=>f.alive&&!f.summon)) step(W);
  const S=W.units.find(u=>u.supKit&&u.spiritOf==null&&u.side===A), si=S?S.i:-1, L=K=>W.log.filter(l=>l.k===K&&l.a===si).length;
  const heal=S?Math.round(S.healed||0):0, ff=W.log.filter(l=>l.k==='tsweep'&&l.a===si).reduce((s,l)=>s+(l.ff||0),0);
  return { win:!F.some(f=>f.alive&&!f.summon), lose:!M.some(u=>u.alive&&!u.summon), t:W.t, hp:M.filter(u=>!u.summon).reduce((s,u)=>s+Math.max(0,u.alive?u.hp:0)/u.max,0)/M.filter(u=>!u.summon).length, dead:M.filter(u=>!u.summon&&!u.alive).length,
    sk:{ heal, desc:L('mdesc'), wall:L('mwall'), spirit:L('mspirit'), vol:L('mvolley'), star:L('cstar'), gate:L('cgate'), veil:L('cveil'), lure:L('clure'), tail:W.log.filter(l=>l.k==='colTail'&&l.b===si).length, sweep:L('tsweep'), ff, fly:L('tflight'), wing:L('twing'), dream:L('tdream'), bless:L('fairyBless') } }; }
const base=['나달','모닝스타'];
const teams={ '없음': base, '물레': [...base,'물레'], '콜라이더': [...base,'콜라이더'], '테헤라': [...base,'테헤라'], '딸기': [...base,'딸기'], '가윤': [...base,'가윤'] };
const foeSets=(process.argv[2]?process.argv[2].split(';').map(s=>s.split('+')):[['검기사','창병','궁수'],['곤봉적','검기사'],['검기사','검방패기사','궁수','창병']]);
const only=process.env.TEAM?process.env.TEAM.split(','):Object.keys(teams), N=+(process.env.N||8);
console.log('— 우리 편에 서포터 (바탕: '+base.join(' · ')+') —');
for (const fs of foeSets) for (const h of only){ let w=0,l=0,T=0,H=0,Dd=0; const S={}; for(let s=1;s<=N;s++){ const r=fight(teams[h],fs,s*7+1,false); if(r.win) w++; if(r.lose) l++; T+=r.t; H+=r.hp; Dd+=r.dead; for(const k in r.sk) S[k]=(S[k]||0)+r.sk[k]; }
  const sk=Object.entries(S).filter(([k,v])=>v).map(([k,v])=>k+' '+(v/N).toFixed(1)).join(' · ');
  console.log(h.padEnd(6),(fs.join('+')).padEnd(22),w+'승',l+'패','· 평균',(T/N).toFixed(1)+'초','· 남은 체력',(H/N*100).toFixed(0)+'%','· 쓰러짐',(Dd/N).toFixed(1),sk?'· '+sk:''); }
console.log('— 적 편에 서포터 (같은 규칙 — 우리: 나달 · 모닝스타 · 트라카 / 적: 검기사 · 창병 + 서포터) —');
for (const h of ['없음','물레','콜라이더','테헤라']){ const foe=['검기사','창병',...(h==='없음'?[]:[h])]; let w=0,l=0,T=0,H=0; const S={}; for(let s=1;s<=N;s++){ const r=fight(foe,['나달','모닝스타','트라카'],s*11+3,true); if(r.win) w++; if(r.lose) l++; T+=r.t; H+=r.hp; for(const k in r.sk) S[k]=(S[k]||0)+r.sk[k]; }
  const sk=Object.entries(S).filter(([k,v])=>v).map(([k,v])=>k+' '+(v/N).toFixed(1)).join(' · ');
  console.log(('적+'+h).padEnd(10),'적 '+w+'승',l+'패','· 평균',(T/N).toFixed(1)+'초','· 적 남은 체력',(H/N*100).toFixed(0)+'%',sk?'· '+sk:''); }
