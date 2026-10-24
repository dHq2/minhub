// v8.7.8 엔진 시험 (3) — eng8780c.js v1.4 (v1.4: v9.0.0 — 혼자서도 돌진은 돌격을 허용한 몸으로 (아군 기본은 돌격 금지) · v1.3: 초돌진은 진형 뒤의 사수 먼저 · 맞붙어 있으면 빠지지 않음 · 혼자인 편은 기다리지 않음 · v1.2: 근성 과녁은 체력 99999 (혼자인 카리우스도 이제 돌진 — 마지막 7초 안에 과녁을 쓰러뜨려 싸움이 끝나던 것) · v1.1: 꿰뚫기는 기록에도 갑옷 없음 · 뒤의 적은 노인의 팔에 안 맞음 (그 뒤 딥 킥은 따로) · 딥 킥 과녁은 물러서지 못하게 · 불경자 기술은 대기가 풀린 뒤 · 철퇴 피해는 기록으로 · 치명은 막지 못하는 적에게 · v1.0: 어퐁 (명세 C6 · 도감 C-103 — 초돌진 · 앞차기 · 버클러) · 카리우스 (명세 C7 — 3D karius.js v1.3 · 2D 불경자 · 근성: 잡아뚫기 · 노인의 팔 · 라이트 훅 · 딥 킥 · 짓밟기 · 불경자 · 근성 · 벼락))
const {E,R,U,KAR,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const AP={ref:'C-103',name:'어퐁',tier:2,cls:'지휘',role:'전선',weapon:'어퐁의 철퇴',shield:true,sName:'버클러',sm:0.79,height:2.4,weight:210,sizeCls:'대형',rMul:1.15,nv:true,nvG:'B',ov:{hp:360,atk:50,spd:2.6},traits:['지휘B','갑피','베테랑','근력A','사격A','전투센스'],active:['초돌진','앞차기','돌진'],gear:{}};
const KA={...KAR,traits:['거구','갑피','근력A','괴력A','머리 넷','은신E','근성','불경자'],active:['돌진','잡아뚫기','노인의 팔','라이트 훅','딥 킥','짓밟기']};
const dummy=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def=(o&&o.roe)||'hold'; R2.roe.autoLift=false; if(o&&o.rules) o.rules(R2); const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,(o&&o.seed)||1,{headless:true}); E.computeLight(W); for(const u of W.units) for(const x of u.spec||[]) x.cdT=-9; return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };
const hold=(u,...ks)=>{ for(const k of ks){ const x=(u.spec||[]).find(s=>s.k===k); if(x) x.cdT=1e9; } };
const freeze=W=>{ for(const u of W.units){ u.state='idle'; u.target=null; u.goal=null; u.path=null; } };
const still=(...us)=>{ for(const u of us){ u.order={k:'hold'}; u.ev=0.0001; } };
const runAct=(W,u,n)=>{ let k=n||200; while(k-->0&&u.act) step(W); return k>0; };
const KAR_ALL=['kgrab','ksw','khook','kick','kstomp'];

console.log('A. 어퐁 몸 — 초돌진 · 앞차기 · 돌진 · 버클러 · 대형');
{ const W=WF([mk(AP,0,10,10),mk({...REB,name:'방패병'},0,10,14)]); const a=W.units[0], b=W.units[1];
  ok((a.spec||[]).map(x=>x.k).join()==='asup,akick'&&a.canCharge,'기술: '+(a.spec||[]).map(x=>x.name).join(' · ')+' + 돌진');
  ok(a.buckler&&a.shield&&!b.buckler,'버클러 (작은 방패) — 방패를 들었고 이름이 버클러');
  ok(a.gArc<b.gArc*0.8&&a.gArc>=24,'막는 폭이 좁음: 버클러 ±'+a.gArc+'° · 보통 방패 ±'+b.gArc+'°');
  ok(a.weapon==='어퐁의 철퇴'&&E.DEFAULT_RULES.weapons['어퐁의 철퇴'].kind==='둔기','어퐁의 철퇴 (둔기)');
  ok(a.sizeCls==='대형'&&a.mass>=200&&a.spd>=2.5,'대형 (2.4M · 옆으로도 근육) · 무게 '+Math.round(a.mass)+' · 걸음 '+a.spd+' (기동 좋음)'); }

console.log('B. 초돌진 — 5칸 넘게만 · 빠름 · 길 둘레를 휩쓺 · 노린 적엔 충돌');
{ const W=WF([mk(AP,0,6,10),dummy('길목',10,10.6,1),dummy('노린 적',15.5,10,1)]); const a=W.units[0], m=W.units[1], t=W.units[2]; freeze(W); still(m,t); t.seenBy=1; m.seenBy=1;
  const okS=E.apSup(W,a,t,'시험'); ok(okS&&a.act&&a.act.k==='charge'&&a.act.sup,'노린 적 '+(Math.hypot(t.x-a.x,t.y-a.y)).toFixed(1)+'칸 → 초돌진 (예고 0.35초)');
  ok(logK(W,'charge').slice(-1)[0].name==='초돌진','돌진 기록의 이름 = 초돌진');
  const x=a.spec.find(s=>s.k==='asup'); ok(x.cdT>W.t+9.5,'대기 10초');
  let mx=0; for(let i=0;i<60&&a.act;i++){ step(W); if(a.act&&a.act.k==='charge'&&a.act.phase==='run') mx=Math.max(mx,a.act.sp); }
  const C=E.DEFAULT_RULES.charge, norm=a.spd*(C.spd||2.2); ok(mx>norm*1.6,'달리는 걸음 '+mx.toFixed(1)+' (보통 돌진의 '+(mx/norm).toFixed(2)+'배)');
  const sw=logK(W,'apSweep'); ok(sw.length===1&&sw[0].b===m.i&&sw[0].down,'길목의 적을 휩쓸어 넘어뜨림');
  ok(m.proneT>W.t-0.5||logK(W,'prone').some(l=>l.b===m.i),'휩쓸린 적은 넘어짐');
  const im=logK(W,'impact'); ok(im.length===1&&im[0].b===t.i,'노린 적엔 돌진 충돌 그대로 ('+(im[0]?'vr '+im[0].vr:'없음')+')');
  const hm=W.log.filter(l=>l.k==='hit'&&l.b===m.i); ok(hm.length&&hm.every(l=>!l.block),'휩쓸린 적은 막지 못함'); }
{ const W=WF([mk(AP,0,6,10),dummy('가까운 적',9.5,10,1)]); const a=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1;
  ok(!E.apSup(W,a,t,'시험')&&!a.act,'5칸 안 → 초돌진 못 함 ('+(Math.hypot(t.x-a.x,t.y-a.y)-a.r-t.r).toFixed(1)+'칸)');
  a.order={k:'spec',s:'asup',b:t.i}; step(W,2); ok(logK(W,'specFail').some(l=>l.s==='asup')&&a.order&&a.order.k==='attack','명령이면 알리고 그 적을 침 (5칸 안)'); }
{ const big=dummy('거구',10,10.5,1,{traits:['거구'],weight:420,height:2.6}); const W=WF([mk(AP,0,6,10),big,dummy('노린 적',15.5,10,1)]); const a=W.units[0], g=W.units[1], t=W.units[2]; freeze(W); still(g,t); t.seenBy=1;
  E.apSup(W,a,t,'시험'); runAct(W,a,90); const sw=logK(W,'apSweep').find(l=>l.b===g.i); ok(sw&&!sw.down,'무거운 몸 (무게 '+Math.round(g.mass)+' ≥ 어퐁 × 1.3) 은 넘어지지 않고 밀리기만'); }
{ const W=WF([mk(AP,0,6,10),dummy('노린 적',15,10,1)],{roe:'free'}); const a=W.units[0], t=W.units[1]; still(t); t.seenBy=1; W.stance[0]={k:'engage',t0:0};
  const r=E.specAuto(W,a,t,true); ok(r&&a.act&&a.act.sup,'스스로: 8칸 떨어진 적에게 초돌진'); }

console.log('C. 앞차기 — 붙은 적을 차 밀어냄 · 휘청 · 막으면 자세가 깎임');
{ const W=WF([mk(AP,0,10,10),dummy('붙은 적',11,10,1)]); const a=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.canGuard=false;
  const x0=t.x, h0=t.hp; E.startSpec(W,a,t,'akick','시험'); runAct(W,a,60); step(W,30);
  ok(logK(W,'akick').length===1&&t.hp<h0,'앞차기 맞음 (피해 '+(h0-t.hp).toFixed(0)+')'); ok(t.x-x0>0.7,'밀려남 '+(t.x-x0).toFixed(2)+'칸'); ok(logK(W,'stun').some(l=>l.b===t.i),'휘청'); }
{ const W=WF([mk(AP,0,10,10),mk({...REB,name:'방패병',ov:{hp:900,atk:20}},1,11.1,10)]); const a=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.face=Math.PI; t.fg=Math.PI; t.raised=true; t.raiseAt=0; t.guardMode='hold';
  const p0=t.post; E.startSpec(W,a,t,'akick','시험'); runAct(W,a,60); const L0=logK(W,'akick')[0]; ok(L0&&L0.block&&t.post<p0-20,'방패로 막으면 자세가 깎임 ('+Math.round(p0)+' → '+Math.round(t.post)+')'); }
{ const W=WF([mk(AP,0,10,10),dummy('하나',11,10,1),dummy('둘',10,11,1)],{roe:'free'}); const a=W.units[0], t=W.units[1]; still(t,W.units[2]); t.seenBy=1; W.units[2].seenBy=1; hold(a,'asup');
  const r=E.specAuto(W,a,t,true); ok(r&&a.act&&a.act.s==='akick','스스로: 둘러싸이면 차서 떼어 냄'); }

console.log('D. 카리우스 몸 — 기술 · 근성 · 불경자');
{ const W=WF([mk(KA,0,10,10)]); const k=W.units[0];
  ok(KAR_ALL.every(s=>(k.spec||[]).some(x=>x.k===s))&&k.karKit,'기술: '+(k.spec||[]).map(x=>x.name).join(' · '));
  ok(k.grit&&k.heretic0&&!k.heretic,'[근성] [불경자] (불경자는 체력 15% 아래에서)'); }

console.log('E. 잡아뚫기 — 광대의 팔: 끌어와 꿰뚫기 · 치명 50% · 갑옷 무시 · 뛰어오른 적은 끌어내림');
{ const W=WF([mk(KA,0,10,10),dummy('잡힐 적',11.6,10,1,{gear:{몸:{name:'판금',mat:'판금',tier:3}}})]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; hold(k,'ksw','khook','kick','kstomp');
  const d0=Math.hypot(t.x-k.x,t.y-k.y); E.startSpec(W,k,t,'kgrab','시험'); let k2=40; while(k2-->0&&k.act&&k.act.phase!=='pull') step(W);
  ok(k.act&&k.act.phase==='pull'&&t.heldBy===k.i,'붙잡음 ('+d0.toFixed(1)+'칸) — 아무것도 못 함');
  step(W,12); const d1=Math.hypot(t.x-k.x,t.y-k.y); ok(d1<d0-0.3&&d1<=k.r+t.r+0.2,'끌려옴: '+d0.toFixed(2)+' → '+d1.toFixed(2)+'칸 (몸 바로 앞)');
  runAct(W,k,60); const P=logK(W,'karPierce')[0], H=W.log.filter(l=>l.k==='hit'&&l.a===k.i&&l.b===t.i&&/잡아뚫기/.test(l.tag||''));
  ok(P&&H.length===1&&!H[0].block&&!H[0].armor,'레프트 꿰뚫기 — 막지 못함 · 갑옷 무시 (피해 '+(H[0]?H[0].dmg:0)+')'); ok(t.heldBy==null,'꿰뚫은 뒤 놓음'); }
{ let cr=0, n=0; for(let s=1;s<=40;s++){ const W=WF([mk(KA,0,10,10),dummy('적',11.5,10,1)],{seed:s}); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; E.startSpec(W,k,t,'kgrab','시험'); runAct(W,k,80); const P=logK(W,'karPierce')[0]; if(P){ n++; if(P.crit) cr++; } }
  ok(n>=36&&cr/n>0.35&&cr/n<0.75,'치명 '+cr+'/'+n+' (50% 언저리)'); }
{ const W=WF([mk(KA,0,10,10),dummy('뛰어오른 적',13,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1;
  t.act={k:'leap',phase:'run',air:true,t0:W.t,end:W.t+2,fx:t.x,fy:t.y,tx:t.x+2,ty:t.y,dir:'fwd'}; E.startSpec(W,k,t,'kgrab','시험'); t.act.air=true; t.act.end=W.t+2; let k2=40; while(k2-->0&&k.act&&k.act.phase==='wind'){ if(t.act){ t.act.air=true; t.act.end=W.t+2; } step(W); }
  const G=logK(W,'karGrab')[0]; ok(G&&G.air&&!(t.act&&t.act.k==='leap'),'3칸 떨어져 뛰어오른 적 → 끌어내림 (3D v1.2)'); }
{ const W=WF([mk(KA,0,10,10),dummy('보스',11.5,10,1,{traits:['보스']})]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; hold(k,'ksw','khook','kick','kstomp');
  ok(!E.karAuto(W,k,t)||k.act.s!=='kgrab','보스는 스스로 붙잡으려 하지 않음'); E.startSpec(W,k,t,'kgrab','시험'); runAct(W,k,60); ok(!logK(W,'karGrab').length&&W.log.some(l=>l.k==='miss'&&/보스/.test(l.why||'')),'명령이어도 보스는 끌어오지 못함 (뛰어오른 때만)'); }

console.log('F. 노인의 팔 후려치기 — 앞 부채꼴 2.7칸 · 밀침 · 휘청 · 뒤는 안 맞음');
{ const W=WF([mk(KA,0,10,10),dummy('앞1',11.4,9.4,1),dummy('앞2',11.6,10.8,1),dummy('뒤',8.6,10,1)]); const k=W.units[0], f1=W.units[1], f2=W.units[2], bk=W.units[3]; freeze(W); still(f1,f2,bk); for(const u of [f1,f2,bk]){ u.seenBy=1; u.canGuard=false; }
  const h=[f1.hp,f2.hp,bk.hp]; E.startSpec(W,k,f1,'ksw','시험'); runAct(W,k,60); step(W,20);
  const S=logK(W,'karSwat')[0], oldB=W.log.filter(l=>l.k==='hit'&&l.b===bk.i&&/노인의 팔/.test(l.tag||'')).length; ok(S&&S.n===2&&f1.hp<h[0]&&f2.hp<h[1]&&!oldB,'앞의 둘만 맞음 (뒤는 노인의 팔에 안 맞음)');
  ok(logK(W,'stun').filter(l=>l.b===f1.i||l.b===f2.i).length===2,'둘 다 휘청'); ok(Math.hypot(f1.x-10,f1.y-10)>1.9,'밀려남'); }

console.log('G. 라이트 훅 — 세 번 (마지막은 밀침)');
{ const W=WF([mk(KA,0,10,10),dummy('맞는 적',11.2,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.canGuard=false;
  E.startSpec(W,k,t,'khook','시험'); runAct(W,k,80); const Hk=logK(W,'karHook'); ok(Hk.map(l=>l.n).join()==='1,2,3'&&Hk.every(l=>l.hit===1),'세 번 맞음 ('+Hk.map(l=>l.n+'타').join(' · ')+')');
  ok(W.log.filter(l=>l.k==='hit'&&l.a===k.i&&/라이트 훅/.test(l.tag||'')).length===3,'피해 기록 셋'); }

console.log('H. 짓밟기 — 누운 적 확인사살 (보스 빼고) · 선 적은 넘어뜨림');
{ const W=WF([mk(KA,0,10,10),dummy('누운 적',11.1,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.proneT=W.t+5;
  E.startSpec(W,k,t,'kstomp','시험'); runAct(W,k,60); ok(!t.alive&&logK(W,'stomp').some(l=>l.b===t.i&&l.kill),'누운 적 — 확인사살');
  ok(k.spec.find(s=>s.k==='kstomp').cdT<W.t+4,'누운 적이면 대기 4초'); }
{ const W=WF([mk(KA,0,10,10),dummy('누운 보스',11.1,10,1,{traits:['보스'],ov:{hp:900,atk:20}})]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.proneT=W.t+5;
  const h=t.hp; E.startSpec(W,k,t,'kstomp','시험'); runAct(W,k,60); ok(t.alive&&t.hp<h,'누운 보스 — 크게 다치지만 죽지 않음 (피해 '+(h-t.hp).toFixed(0)+')'); }
{ const W=WF([mk(KA,0,10,10),dummy('선 적',11.1,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.canGuard=false;
  E.startSpec(W,k,t,'kstomp','시험'); runAct(W,k,60); ok(t.alive&&t.proneT>W.t-0.2,'선 적 — 넘어뜨림'); ok(k.spec.find(s=>s.k==='kstomp').cdT>W.t+6,'선 적이면 대기 8초'); }
{ const W=WF([mk(KA,0,10,10),dummy('비킨 적',11.1,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); t.seenBy=1; t.proneT=W.t+5;
  E.startSpec(W,k,t,'kstomp','시험'); step(W,3); t.proneT=-9; t.x=13; runAct(W,k,60); ok(t.alive&&W.log.some(l=>l.k==='miss'&&l.spec==='kstomp'),'발을 든 사이 비켜나면 빗나감 (자리는 처음에 정함)'); }

console.log('I. 딥 킥 — 벽을 등진 적을 먼저 · 벽에 박으면 짓뭉개짐');
{ const W=WF([mk(KA,0,35.5,10),dummy('벽 앞 적',36.8,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.canGuard=false; t.spd=0.001; hold(k,'kgrab','ksw','khook','kstomp');
  const r=E.karAuto(W,k,t); ok(r&&k.act&&k.act.s==='kick'&&/벽/.test(k.act.why||''),'스스로: 벽을 등진 적을 걷어참'); runAct(W,k,60); step(W,30);
  ok(logK(W,'crush').length>=1||W.log.some(l=>l.k==='hit'&&l.b===t.i&&/짓뭉개|짓눌/.test(l.tag||'')),'벽에 짓뭉개짐'); }

console.log('J. 불경자 — 체력 15% 아래: 공격 × 2.5 · 받는 피해 × 0.33 · 걸음 × 1.4 · 공격 간격 × 0.8 · 막지 않음 · 철퇴 · 몸박');
{ const W=WF([mk(KA,0,10,10),dummy('과녁',30,10,1)]); const k=W.units[0]; freeze(W); step(W,1);
  const a0=k.atk, s0=k.spd, w0=k.wind, r0=k.rec, d0=k.dmgK||1; ok(!E.specReady(W,k,'kslam'),'불경자가 아니면 철퇴 · 몸박 없음');
  k.hp=k.max*0.14; step(W,1); ok(k.heretic&&logK(W,'karHeretic').some(l=>l.on),'체력 14% → 불경자');
  ok(Math.abs(k.atk/a0-2.5)<0.01&&Math.abs(k.spd/s0-1.4)<0.01&&Math.abs(k.wind/w0-0.8)<0.02&&Math.abs(k.rec/r0-0.8)<0.02&&Math.abs(k.dmgK/d0-0.33)<0.01,'공격 '+a0+' → '+k.atk+' · 걸음 × '+(k.spd/s0).toFixed(2)+' · 간격 × '+(k.wind/w0).toFixed(2)+' · 받는 피해 × '+(k.dmgK/d0).toFixed(2));
  ok(!k.canGuard,'막지 않음'); ok(k.act&&k.act.k==='karRoar','울부짖음 (0.6초)'); step(W,30); ok(E.specReady(W,k,'kslam')&&E.specReady(W,k,'krush'),'노인의 팔 철퇴 · 돌진 몸박이 생김');
  k.hp=k.max*0.6; step(W,1); ok(!k.heretic&&Math.abs(k.atk-a0)<0.01&&Math.abs(k.spd-s0)<0.01&&Math.abs(k.wind-w0)<0.01&&Math.abs((k.dmgK||1)-d0)<1e-6&&k.canGuard,'체력 60% → 풀림 (처음 수치로)'); }
{ const W=WF([mk(KA,0,10,10),dummy('철퇴 과녁',11.6,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.canGuard=false; hold(k,'kgrab','ksw','khook','kick','kstomp');
  k.hp=k.max*0.1; step(W,1); ok(k.heretic,'불경자'); step(W,26); k.act=null; const r=E.karAuto(W,k,t); ok(r&&k.act.s==='kslam','스스로: 붙은 적에게 노인의 팔 철퇴'); runAct(W,k,80);
  const SH=W.log.filter(l=>l.k==='hit'&&l.b===t.i&&/철퇴/.test(l.tag||'')); ok(logK(W,'karSlam').length===1&&SH.length===1&&SH[0].dmg>=120,'철퇴 피해 '+(SH[0]?SH[0].dmg:0)+' (공격 100 × 1.67)'); ok(logK(W,'stun').some(l=>l.b===t.i),'휘청'); }
{ const W=WF([mk(KA,0,10,10),dummy('몸박 과녁',15,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1; t.canGuard=false; hold(k,'kgrab','ksw','khook','kick','kstomp','kslam');
  t.spd=0.001; const x0=t.x; k.hp=k.max*0.1; let n=0; while(n++<90&&!logK(W,'karRush').length) step(W); ok(logK(W,'karRush').length===1&&W.log.some(l=>l.k==='wind'&&l.a===k.i&&l.spec==='krush'),'스스로: 3 ~ 7칸 적에게 돌진 몸박 ('+(n/30).toFixed(1)+'초)'); runAct(W,k,90); step(W,30);
  ok(logK(W,'karRush').length===1&&W.log.some(l=>l.k==='hit'&&l.b===t.i&&/몸박/.test(l.tag||''))&&t.x-x0>2,'몸박 — 밀려 날아감 ('+(t.x-x0).toFixed(1)+'칸)'); }

console.log('K. 근성 — 체력 0 → 3초 무적 발버둥 → 포효 → 7초 쓰러지지 않음 → 실이 끊긴 듯 쓰러짐');
{ const W=WF([mk(KA,0,10,10),dummy('친 적',11.3,10,1,{ov:{hp:99999,atk:20}})]); const k=W.units[0], e=W.units[1]; freeze(W); still(e); e.seenBy=1; e.canGuard=false; step(W,1);
  E.applyDmg(W,e,k,k.hp+500,{tag:'시험'}); ok(k.alive&&k.hp===1&&k.ls&&k.ls.ph==='agony','숨이 끊길 피해 → 체력 1 · 발버둥'); ok(k.heretic,'근성이 켜지면 불경자도 (3D)');
  const h=k.hp; E.applyDmg(W,e,k,300,{tag:'시험'}); ok(k.hp===h&&k.alive,'발버둥 3초는 무적');
  step(W,30); ok(!k.act&&k.ls.ph==='agony','발버둥 동안 아무것도 못 함'); step(W,62); ok(k.ls&&k.ls.ph==='roar','3초 뒤 포효 ("우어어어어!")'); step(W,26); ok(k.ls&&k.ls.ph==='last','포효 뒤 마지막 7초');
  ok(k.saT>W.t+6.5,'슈퍼아머'); E.stun(W,k,2,e.i); ok(!(k.stunT>W.t),'휘청하지 않음'); E.applyDmg(W,e,k,999,{tag:'시험'}); ok(k.alive&&k.hp>=1,'쓰러지지 않음 (체력 1 은 남음)');
  const o=E.strike(W,k,e,e,1,false,{tag:'시험'}); ok(o&&o.crit,'모든 공격이 치명');
  let n=0; while(n++<240&&k.alive) step(W); ok(!k.alive&&k.deathKind==='grit','7초 뒤 실이 끊긴 듯 쓰러짐 ('+(n/30).toFixed(1)+'초)');
  const D=logK(W,'die').slice(-1)[0]; ok(D&&D.b===k.i&&D.a===e.i&&!D.ff,'숨을 끊은 이 = 마지막으로 친 적'); }
{ const W=WF([mk(KA,0,10,10),dummy('마지막 적',11.3,10,1,{ov:{hp:5000,atk:20}})]); const k=W.units[0], e=W.units[1]; freeze(W); still(e); e.seenBy=1; step(W,1);
  E.applyDmg(W,e,k,k.hp+10,{tag:'시험'}); step(W,40); e.alive=false; e.hp=0; step(W,2);
  ok(k.alive&&!k.ls&&Math.abs(k.hp-Math.round(k.max*0.05))<1&&logK(W,'karGrit').some(l=>l.ph==='over'),'근성 중 싸움이 끝남 → 쓰러지지만 살아남음 (체력 '+k.hp+' = 5%)'); }
{ const W=WF([mk(KA,0,10,10),dummy('적',11.3,10,1,{ov:{hp:5000,atk:20}})]); const k=W.units[0], e=W.units[1]; freeze(W); still(e); step(W,1); W.crown=[1,0];
  E.applyDmg(W,e,k,k.hp+10,{tag:'시험'}); ok(W.crown[0]===0&&!k.ls,'왕관 조각이 먼저 버팀 (근성은 그다음)'); }

console.log('L. 벼락 (◆개조된 신체) — 연기를 토하며 차갑게 미쳐 감: 6초 공격 × 1.3');
{ const W=WF([mk(KA,0,10,10),dummy('번개',14,10,1)]); const k=W.units[0], e=W.units[1]; freeze(W); still(e); step(W,1); const a0=k.atk;
  E.zapOn(W,k,'blue',e); step(W,1); ok(k.rageOn&&Math.abs(k.atk/a0-1.3)<0.01&&logK(W,'karRage').length===1,'감전 → 공격 '+a0+' → '+k.atk);
  step(W,186); ok(!k.rageOn&&Math.abs(k.atk-a0)<0.01,'6초 뒤 처음으로'); }

console.log('M. 예고를 보고 피함 — 노인의 팔 부채꼴 · 몸박 줄 · 잡아뚫기 한 몸');
{ const W=WF([mk(KA,0,10,10),dummy('앞',11.4,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W);
  E.startSpec(W,k,t,'ksw','시험'); const Z=E.karTg(W,k,k.act,t); ok(Z.k==='fan'&&Z.R>2.9&&Math.abs(Z.arc-(137*Math.PI/360+0.15))<1e-6,'노인의 팔: 부채꼴 '+Z.R.toFixed(1)+'칸');
  k.act=null; E.startSpec(W,k,t,'kgrab','시험'); ok(E.karTg(W,k,k.act,t).k==='one','잡아뚫기: 노린 몸'); }
{ let dodged=0; for(let s=1;s<=20;s++){ const W=WF([mk(KA,0,10,10),dummy('보는 적',11.5,10,1)],{seed:s}); const k=W.units[0], t=W.units[1]; freeze(W); t.seenBy=1; t.ev=1; hold(k,'kgrab','khook','kick','kstomp');
    E.startSpec(W,k,t,'ksw','시험'); runAct(W,k,60); if(logK(W,'tgDodge').some(l=>l.a===t.i)) dodged++; }
  ok(dodged>=4,'예고를 본 적이 비킴 '+dodged+'/20'); }

console.log('N. 명령 — 기술 칸으로 잡아뚫기 · 짓밟기 (다가가서)');
{ const W=WF([mk(KA,0,10,10),dummy('먼 적',15,10,1)]); const k=W.units[0], t=W.units[1]; freeze(W); still(t); t.seenBy=1;
  k.order={k:'spec',s:'kgrab',b:t.i}; let n=0; while(n++<200&&!logK(W,'karGrab').length) step(W); ok(logK(W,'karGrab').length===1,'잡아뚫기 명령 → 다가가 붙잡음 ('+(n/30).toFixed(1)+'초)'); }

console.log('O. 초돌진 — 맞붙어 있지 않을 때 진형 뒤의 사수 먼저 · 혼자인 편은 \'들어가!\' 를 기다리지 않음');
{ const W=WF([mk(AP,0,6,10),dummy('앞줄',11.4,10.8,1),mk({...REB,name:'궁수',shield:false,weapon:'활',ammo:30,ov:{hp:900,atk:20},traits:[],gear:{}},1,15.5,12.4)],{roe:'free'}); const a=W.units[0], m=W.units[1], ar=W.units[2]; still(m,ar); m.seenBy=1; ar.seenBy=1; hold(a,'akick'); a.face=a.fg=0;   // 적 쪽을 바라봄
  const r=E.specAuto(W,a,m,true); ok(r&&a.act&&a.act.sup&&a.act.b===ar.i,'노린 적은 앞줄이지만 진형 뒤의 궁수에게 초돌진 ('+(a.act&&a.act.b!=null?W.units[a.act.b].name:'없음')+')');
  runAct(W,a,120); ok(logK(W,'apSweep').some(l=>l.b===m.i)||logK(W,'impact').some(l=>l.b===ar.i),'앞줄을 휩쓸고 궁수에게 닿음'); }
{ const W=WF([mk(AP,0,6,10),dummy('붙은 적',7.1,10,1),dummy('먼 적',15,10,1)],{roe:'free'}); const a=W.units[0], n=W.units[1], f=W.units[2]; still(n,f); n.seenBy=1; f.seenBy=1; hold(a,'akick');
  const r=E.specAuto(W,a,n,true); ok(!(a.act&&a.act.sup),'맞붙어 있으면 초돌진으로 빠지지 않음'); }
{ const W=WF([mk(AP,0,6,10),dummy('적',9.6,10,1)],{roe:'free'}); const a=W.units[0], e=W.units[1]; a.noChg=a.noChg0=false; still(e); e.seenBy=1; hold(a,'asup','akick');
  ok(!E.cmdHold(W,a),'혼자인 편 (지휘 · 방패): 들어가라는 말을 기다리지 않음'); let n=0; while(n++<60&&!logK(W,'charge').length) step(W); ok(logK(W,'charge').length>=1,'혼자서도 돌진 ('+(n/30).toFixed(1)+'초)');
  const W2=WF([mk(AP,0,6,10),mk({...REB,name:'동료'},0,6,12),dummy('적',9.6,10,1)],{roe:'free'}); W2.stance[0]={k:'hold',t0:0}; ok(E.cmdHold(W2,W2.units[0]),'둘 이상이면 지휘의 "들어가!" 를 기다림 (그대로)'); }

console.log(fails?'FAIL '+fails:'ALL eng8780c OK'); process.exit(fails?1:0);
