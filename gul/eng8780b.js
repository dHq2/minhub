// v8.7.8 엔진 시험 (2) — eng8780b.js v1.4 (v1.4: 명세 C5 베테랑 — 잘 넘어뜨림 · 버팀 · 투창 솜씨 · v1.3: ◆쥐들의 왕 (도감 이름) · 도감 특성 [지휘S] [군주] + [높은후각] [반사신경] · 쥐 기사는 싸움 끝에 경례하고 사라짐 · 흩어짐은 한 줄 · P. 쥐 베테랑 (구르기 앞 · 뒤 · 방어 보정 · 급소 보호 · 대형은 노리지 않음 · 투창 뒤 검 · 지휘의 열화 카피) · Q. 쥐의 무구는 전리품이 아님 · 포렌이 나가면 쥐도 · 같은 맵의 다음 싸움 · v1.2: 움직이면 안 되는 적은 휘청으로 묶음 (적에겐 명령이 없음) · 방진의 나눠 받기는 쥐 망토 뒤 몫으로 · 기억은 판의 포렌 것으로 · 방벽은 자리를 잡은 뒤 일격 · v1.1: 시험 판의 적은 보이는 거리 (7칸) · 기술 시험마다 다른 기술 (사다리 · 방패) 의 대기를 걸어 둠 (쥐를 먼저 가져가지 않게) · 2D 차례 (위기엔 쥐 방패가 먼저) · v1.0: 포렌 — 몸 · 충성 · 쥐 두뇌 · 쥐 표식 · 방벽 · 쥐 망토 · 쥐 방진 · 쥐 방패 · 쥐 사다리 · 쥐 포박 · 도발 · 대검 베기 · 기억하는 쥐 기사 · 흩어짐 · 적 · 아군 같음)
const {E,R,U,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const PR={ref:'C-006',name:'포렌',tier:2,cls:'지휘',role:'전선',weapon:'포렌의 대검',shield:false,sm:0.78,height:1.4,weight:140,nv:true,nvG:'B',noChg:true,ov:{hp:532,atk:46},traits:['지휘S','군주','높은후각','반사신경'],gear:{몸:{name:'포렌의 중갑',mat:'판금',tier:3}},unique:['쥐들의 왕'],active:['쥐 표식','쥐 방진','쥐 방패','쥐 사다리','쥐 포박']};
const dummy=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def=(o&&o.roe)||'hold'; R2.roe.autoLift=false; if(o&&o.rules) o.rules(R2); const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,(o&&o.seed)||1,{headless:true}); E.computeLight(W); if(!(o&&o.cd0)) for(const u of W.units) for(const x of u.spec||[]) x.cdT=-9; return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };
const rats=(W,u)=>W.units.filter(r=>r.alive&&!r.gone&&r.ratOf===u.i);
const noInit=R2=>{ R2.poren.init=0; };
const hold=(u,...ks)=>{ for(const k of ks){ const x=(u.spec||[]).find(s=>s.k===k); if(x) x.cdT=1e9; } };
const freeze=W=>{ for(const u of W.units){ u.state='idle'; u.target=null; u.goal=null; u.path=null; } };

console.log('A. 몸 — ◆쥐들의 왕 · 대검 · 기술 다섯');
{ const W=WF([mk(PR,0,10,10),dummy('과녁',20,10,1)]); const p=W.units[0];
  ok(p.porenKit&&p.taunt===3&&Math.abs(p.cleave-0.6)<1e-9,'◆쥐들의 왕 (2D 쥐들의 대왕): 도발 3칸 · 대검 베기 60%');
  ok((p.spec||[]).map(x=>x.k).join()==='pmark,pfort,pshield,pladder,pbind','기술: '+(p.spec||[]).map(x=>x.name).join(' · '));
  ok(p.weapon==='포렌의 대검'&&p.canGuard,'포렌의 대검 — 대검이 곧 방패 (막음)');
  ok(Array.isArray(p.ratMem),'동료 포렌은 쥐 기사를 기억함 (ratMem)');
  const W2=WF([dummy('과녁',10,10,0),mk(PR,1,20,10)]); ok(W2.units[1].ratMem===null,'적 포렌은 기억하지 않음 (3D 와 같음)'); }

console.log('B. 충성 — 게이지 · 다음 쥐 · 뒤쪽에서 달려옴 · 최대 24');
{ const W=WF([mk(PR,0,10,10),dummy('과녁',17,10,1)]); const p=W.units[0], e=W.units[1]; e.order={k:'hold'}; hold(p,'pladder','pmark','pbind','pshield');
  step(W,1); const r0=rats(W,p); ok(r0.length===4&&r0.every(r=>dist2(r,p)<2.2),'싸움을 시작하면 곁에 넷 (3D) — '+r0.map(r=>r.name).join(' · '));
  ok(r0.every(r=>r.summon==='rat'&&r.ratOf===p.i),'쥐는 포렌의 소환 (summon rat · ratOf)');
  const N={ratS:0,ratM:0,ratL:0,ratKnight:0}; for(let i=0;i<20000;i++) N[E.prnRoll(W)]++; const pc=k=>N[k]/20000;
  ok(Math.abs(pc('ratS')-0.58)<0.02&&Math.abs(pc('ratM')-0.27)<0.02&&Math.abs(pc('ratL')-0.13)<0.015&&Math.abs(pc('ratKnight')-0.02)<0.006,'다음 쥐 굴림: 작은 쥐 '+pc('ratS').toFixed(2)+' · 쥐 '+pc('ratM').toFixed(2)+' · 큰 쥐 '+pc('ratL').toFixed(2)+' · 쥐 기사 '+pc('ratKnight').toFixed(3));
  e.stunT=1e9; p.prn.loyal={t:0,next:'ratM',dur:3}; const n0=rats(W,p).length; e.seenBy=1; step(W,36); const n1=rats(W,p).length;   // 쥐가 넷 → 1배 · 3초 게이지 → 1.2초엔 아직
  ok(n1===n0,'쥐 게이지 3초: 1.2초엔 아직 ('+n0+' → '+n1+')'); let g2=0; while(g2++<90&&rats(W,p).length===n0) step(W,1); ok(rats(W,p).length===n0+1&&g2>=45&&g2<=70,'3초 무렵 쥐 하나 ('+((36+g2)/30).toFixed(1)+'초)');
  const nw=rats(W,p).slice(-1)[0], de=dist2(nw,e), dp=dist2(nw,p); ok(de>dist2(p,e)&&dp>2.5,'새 쥐는 포렌 뒤쪽 (적 반대편 · '+dp.toFixed(1)+'칸) 에서 달려옴'); }
{ const W=WF([mk(PR,0,10,10),dummy('과녁',17,10,1)],{rules:noInit}); const p=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.seenBy=1; step(W,1);
  p.prn.loyal={t:0,next:'ratS',dur:0.8}; step(W,12); ok(rats(W,p).length===1,'쥐가 넷보다 적으면 2.5배 빨리 (0.8초 게이지 → 0.4초 만에 · '+rats(W,p).length+')'); }
{ const W=WF([mk(PR,0,10,10),dummy('과녁',35,10,1)],{rules:noInit}); const p=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.alive=true; step(W,1);
  for(let i=0;i<40;i++){ p.prn.loyal={t:0,next:'ratS',dur:0.002}; step(W,1); }
  ok(rats(W,p).length===4,'싸움이 없으면 넷까지만 ('+rats(W,p).length+')'); }
{ const W=WF([mk(PR,0,10,10),dummy('과녁',17,10,1)],{rules:noInit}); const p=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.seenBy=1; e.stunT=1e9; hold(p,'pladder','pmark','pbind','pshield','pfort'); step(W,1);
  for(let i=0;i<60;i++){ p.prn.loyal={t:0,next:'ratS',dur:0.002}; step(W,1); }
  ok(rats(W,p).length===24&&p.prn.full,'최대 24 ('+rats(W,p).length+' · 가득)'); }

console.log('C. 쥐 두뇌 — 따르는 쥐 · 떠돌이 · 명령을 받지 않음');
{ const W=WF([mk(PR,0,10,10),dummy('과녁',34,10,1)],{rules:noInit}); const p=W.units[0], e=W.units[1]; e.order={k:'hold'}; step(W,1);
  const A=E.prnRat(W,p,'ratS',{near:true}), B=E.prnRat(W,p,'ratS',{near:true}); A.ratWild=false; B.ratWild=true; A.x=16; A.y=10; B.x=10; B.y=11;
  A.order={k:'move',x:3,y:3}; step(W,60);
  ok(!A.order&&dist2(A,p)<2.6,'따르는 쥐: 명령을 받지 않고 포렌 곁으로 ('+dist2(A,p).toFixed(1)+'칸)');
  ok(B.rs&&B.rs.wp,'떠돌이 쥐: 둘레를 싸돌아다님');
  p.target=e; e.x=14; e.y=10; e.seenBy=1; A.rs.tgT=0; step(W,30); ok(A.target===e,'포렌이 노린 적을 따르는 쥐도 노림'); }

console.log('D. 쥐 표식 — 포렌이 치려 하면 · 쥐 셋이 더 · 모두 몰려듦');
{ const W=WF([mk(PR,0,10,10),dummy('과녁',11.2,10,1)],{rules:noInit}); const p=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.seenBy=1; step(W,1);
  for(let i=0;i<3;i++){ const r=E.prnRat(W,p,'ratS',{near:true}); r.ratWild=true; }
  const n0=rats(W,p).length; E.startAct(W,p,e,'시험'); step(W,1);
  const M=logK(W,'prMark'); ok(M.length===1&&M[0].b===e.i,'포렌이 치려 하자 쥐 표식 ("물어라!")');
  ok(rats(W,p).length===n0+3,'어디선가 쥐 셋이 더 ('+n0+' → '+rats(W,p).length+')');
  ok(rats(W,p).every(r=>r.rs.k==='assault'&&r.rs.b===e.i),'쉬던 쥐 (떠돌이까지) 모두 그 적에게');
  const x=p.spec.find(s=>s.k==='pmark'); ok(x.cdT>W.t+11,'쥐 표식 대기 12초');
  step(W,90); ok(rats(W,p).filter(r=>dist2(r,e)<1.4).length>=3,'둘러싸고 물어뜯음 ('+rats(W,p).filter(r=>dist2(r,e)<1.4).length+'마리 곁)'); }

console.log('E. 방벽 — 동료에게 강공이 오면 쥐가 앞을 막고 대신 맞음');
{ const W=WF([mk(PR,0,8,10),dummy('동료',12,10,0),dummy('곤봉',13.3,10,1,{ov:{hp:900,atk:45}})],{rules:noInit}); const p=W.units[0], g=W.units[1], e=W.units[2]; freeze(W); g.order={k:'hold'}; e.order=null; e.seenBy=1; hold(p,'pladder','pmark','pbind','pshield'); step(W,1);
  for(let i=0;i<3;i++) E.prnRat(W,p,'ratM',{at:{x:11+i*0.3,y:9}});
  E.startAct(W,e,g,'시험'); step(W,1);
  const Wl=logK(W,'ratWall'); ok(Wl.length===1&&Wl[0].n>=2,'공격 45 → 쥐 '+(Wl[0]?Wl[0].n:0)+'마리가 방벽');
  e.act=null; e.stunT=W.t+1; step(W,24); const wr=E.ratWallHit(W,e,g); ok(wr&&wr.rs.k==='wall'&&dist2(wr,e)<dist2(g,e),'쥐가 동료와 적 사이에 섬 ('+(wr?wr.name:'없음')+')');
  e.stunT=-9; e.ev=0.0001; const h0=g.hp; E.startAct(W,e,g,'시험'); if(e.act) e.act.end=W.t+0.05; let k=30; while(k-->0&&e.act&&e.act.phase==='wind') step(W);
  const hitR=W.log.filter(l=>l.k==='hit'&&l.a===e.i).map(l=>W.units[l.b]); ok(hitR.length>=1&&hitR.every(u=>u.ratOf===p.i)&&g.hp===h0,'일격은 사이에 선 쥐가 대신 맞음 ('+hitR.map(u=>u.name).join(',')+')'); }

console.log('F. 쥐 망토 — 곁의 쥐마다 받는 피해 -3.5% (최대 -16%)');
{ const take=n=>{ const W=WF([mk(PR,0,10,10),dummy('과녁',30,10,1)],{rules:noInit}); const p=W.units[0], e=W.units[1]; step(W,1); for(let i=0;i<n;i++) E.prnRat(W,p,'ratS',{at:{x:10+Math.cos(i)*0.9,y:10+Math.sin(i)*0.9}}); step(W,1); const h=p.hp; E.applyDmg(W,e,p,100,{tag:'시험'}); return { d: h-p.hp, n: p.cloakN }; };
  const a=take(0), b=take(2), c=take(8); ok(Math.abs(a.d-100)<0.6&&Math.abs(b.d-93)<0.6&&Math.abs(c.d-84)<0.6,'받는 피해 100 → 쥐 0: '+a.d.toFixed(1)+' · 둘: '+b.d.toFixed(1)+' · 여덟 (넷까지 셈 → 최대): '+c.d.toFixed(1)+' (곁 '+c.n+')'); }

console.log('G. 쥐 방진 — 대검을 꽂고 버팀 · 쥐가 70% 를 나눠 받음 · 끝에 회전 반격');
{ const W=WF([mk(PR,0,10,10),dummy('과녁',11.3,10,1,{ov:{hp:2000,atk:20}})],{rules:noInit}); const p=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.seenBy=1; freeze(W); hold(p,'pladder','pmark','pbind','pshield'); step(W,1);
  for(let i=0;i<4;i++) E.prnRat(W,p,'ratL',{at:{x:10+Math.cos(i*1.6)*1.0,y:10+Math.sin(i*1.6)*1.0}});
  p.hp=p.max*0.35; step(W,8); const F=logK(W,'prFort'); ok(F.length===1&&p.act&&p.act.s==='fort','체력 40% 아래 (쥐 방패가 대기 중일 때 — 2D 차례) → 쥐 방진 (쥐 '+(F[0]?F[0].n:0)+')');
  const x0=p.x, y0=p.y; E.stun(W,p,2,e.i); ok(!(p.stunT>W.t),'방진 동안 휘청이지 않음 (굳건히)');
  const h=p.hp, rh=rats(W,p).reduce((s,r)=>s+r.hp,0); E.applyDmg(W,e,p,100,{tag:'시험'}); const dP=h-p.hp, dR=rh-rats(W,p).reduce((s,r)=>s+r.hp,0);
  const dd=100*(1-Math.min(0.16,0.035*p.cloakN)); ok(Math.abs(dP-dd*0.3)<2&&Math.abs(dR-dd*0.7)<3,'받는 피해 100 (쥐 망토 뒤 '+dd.toFixed(0)+') → 포렌 '+dP.toFixed(1)+' (30%) · 둘레 쥐 '+dR.toFixed(0)+' (70%)');
  step(W,80); ok(Math.hypot(p.x-x0,p.y-y0)<0.05||logK(W,'prSpin').length,'방진 동안 움직이지 않음');
  const S=logK(W,'prSpin'); ok(S.length===1&&S[0].n===1&&S[0].mul>3,'끝에 대검 회전 반격 — 무게 · 대신 맞은 만큼 (배수 ×'+(S[0]?S[0].mul:0)+')'); }
{ const W=WF([mk(PR,0,10,10),dummy('먼 적',16,10,1,{ov:{hp:2000,atk:20}})],{rules:noInit}); const p=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.seenBy=1; e.stunT=1e9; freeze(W); hold(p,'pladder','pmark','pbind','pshield'); step(W,1);
  for(let i=0;i<4;i++) E.prnRat(W,p,'ratM',{at:{x:10+Math.cos(i*1.6)*1.0,y:10+Math.sin(i*1.6)*1.0}});
  E.prFort(W,p,'시험'); step(W,80); const Ld=logK(W,'prLadder');
  ok(Ld.length===1&&Ld[0].counter,'곁에 적이 없으면 방진 쥐 셋을 타고 날아감'); step(W,60); const Sp=logK(W,'prSpin'); ok(Sp.length===1&&Sp[0].n===1,'날아간 자리에서 회전 — 그 적이 맞음 ('+(Sp[0]?Sp[0].n:0)+'명)'); }

console.log('H. 쥐 방패 — 위험한 동료 앞을 쥐들이 온몸으로 막음 · 포렌은 뒤로 빠져 지휘');
{ const W=WF([mk(PR,0,10,10),dummy('다친 동료',12,10,0),dummy('적',14.2,10,1,{ov:{hp:2000,atk:20}})],{rules:noInit}); const p=W.units[0], g=W.units[1], e=W.units[2]; freeze(W); e.order={k:'hold'}; e.seenBy=1; e.stunT=1e9; hold(p,'pladder','pmark','pbind'); step(W,1);
  for(let i=0;i<8;i++) E.prnRat(W,p,'ratS',{at:{x:9+(i%4)*0.4,y:9+Math.floor(i/4)*2}}); g.hp=g.max*0.3; g.order={k:'hold'};
  const x0=p.x; ok(E.prShield(W,p),'동료 체력 30% · 3칸 안에 적 → 쥐 방패');
  step(W,90); const A=p.act, wall=rats(W,p).filter(r=>r.rs.k==='shieldWall');
  ok(p.x<x0-1.5&&A&&A.s==='cmd'&&A.phase==='hold','포렌은 뒤로 뛰어 빠져 지휘 ('+(x0-p.x).toFixed(1)+'칸)');
  ok(wall.length===8&&wall.filter(r=>r.x>g.x&&r.x<e.x).length>=6,'쥐 여덟이 동료와 적 사이에 두 줄 ('+wall.filter(r=>r.x>g.x&&r.x<e.x).length+'마리 사이)');
  const t1=wall[0], hs=wall.map(r=>r.hp); E.applyDmg(W,e,t1,80,{tag:'시험'}); const lost=wall.map((r,i)=>hs[i]-r.hp).filter(x=>x>0).length; ok(lost>=3,'맞은 충격을 곁의 구성원이 나눠 받음 ('+lost+'마리)');
  E.stun(W,p,0.8,e.i); step(W,2); ok(!p.act&&logK(W,'prShieldEnd').some(l=>/끊김/.test(l.why)),'큰 휘청 (0.8초) 이면 지휘가 끊김'); }

console.log('I. 쥐 사다리 — 쥐 셋을 타고 미끄러져 내려찍음 (×1.5 · 휘청)');
{ const W=WF([mk(PR,0,10,10),dummy('적',16,10,1,{ov:{hp:2000,atk:20}})],{rules:noInit}); const p=W.units[0], e=W.units[1]; freeze(W); e.order={k:'hold'}; e.seenBy=1; e.canGuard=false; step(W,1);
  for(let i=0;i<3;i++) E.prnRat(W,p,'ratS',{at:{x:9.4,y:9.4+i*0.6}}); p.target=e;
  ok(E.porenBrain(W,p,1/30)&&p.act&&p.act.s==='ladder','노린 적이 6칸 → 쥐 사다리');
  const h=e.hp; let k=120; while(k-->0&&p.act) step(W);
  ok(dist2(p,e)<2.3&&h-e.hp>0&&logK(W,'prSlam').length===1,'미끄러져 들어가 내려찍음 (피해 '+Math.round(h-e.hp)+' · '+dist2(p,e).toFixed(1)+'칸)'); }

console.log('J. 쥐 포박 — 쥐 다섯이 매달림 · 게이지가 남은 동안 못 움직이고 못 침 · 최대 3초');
{ const W=WF([mk(PR,0,10,10),dummy('적',13,10,1,{ov:{hp:2000,atk:40}})],{rules:noInit}); const p=W.units[0], e=W.units[1]; freeze(W); e.seenBy=1; step(W,1);
  for(let i=0;i<5;i++) E.prnRat(W,p,'ratS',{at:{x:11.5,y:9+i*0.5}});
  ok(E.prBind(W,p,e),'쥐 포박'); let held=0, act=0, mv=0; const x0=e.x; for(let i=0;i<150;i++){ step(W,1); if(e.bound){ held++; if(e.act&&e.act.k==='atk') act++; } }
  ok(held>15&&act===0,'매달린 동안 치지 못함 ('+(held/30).toFixed(1)+'초)'); ok(held/30<=3.05,'최대 3초 ('+(held/30).toFixed(1)+')');
  ok(!e.bind&&logK(W,'prUnbind').length<=1,'뿌리침 — 포박 끝'); }
{ const W=WF([mk(PR,0,10,10),dummy('보스',13,10,1,{ov:{hp:2000,atk:40},traits:['보스']})],{rules:noInit}); const p=W.units[0], e=W.units[1]; freeze(W); e.seenBy=1; step(W,1);
  for(let i=0;i<5;i++) E.prnRat(W,p,'ratS',{at:{x:11.5,y:9+i*0.5}}); E.prBind(W,p,e); let held=0; for(let i=0;i<150;i++){ step(W,1); if(e.bound) held++; }
  ok(held/30<1.6,'보스는 2.5배 빨리 뿌리침 ('+(held/30).toFixed(1)+'초)'); }

console.log('K. 도발 — 3칸 안의 적은 포렌을 먼저 노림 (보스 빼고)');
{ const W=WF([mk(PR,0,10,10),dummy('동료',11,12.3,0),dummy('적',12.2,11,1)],{rules:noInit,roe:'free'}); const p=W.units[0], g=W.units[1], e=W.units[2]; e.threat[g.i]=500;
  E.think(W,e); ok(e.target===p,'적이 동료를 노리던 참에도 포렌을 노림 ('+(e.target&&e.target.name)+')');
  const W2=WF([mk(PR,0,10,10),dummy('동료',11,12.3,0),dummy('보스',12.2,11,1,{traits:['보스']})],{rules:noInit,roe:'free'}); const e2=W2.units[2]; e2.threat[W2.units[1].i]=500; E.think(W2,e2); ok(e2.target!==W2.units[0],'보스는 도발을 따르지 않음 ('+(e2.target&&e2.target.name)+')'); }

console.log('L. 대검 베기 — 앞의 다른 적 하나까지 60%');
{ const W=WF([mk(PR,0,10,10),dummy('적1',11.1,10,1),dummy('적2',11.0,10.7,1)],{rules:noInit}); const p=W.units[0], a=W.units[1], b=W.units[2]; freeze(W); a.canGuard=false; b.canGuard=false; a.ev=0.0001; b.ev=0.0001; p.face=p.fg=0;
  const hb=b.hp; E.prnCleave(W,p,a); const H=W.log.filter(l=>l.k==='hit'&&l.a===p.i&&l.b===b.i); ok(H.length===1&&/베어 넘김/.test(H[0].tag)&&hb>b.hp,'옆의 적까지 베어 넘김 ('+Math.round(hb-b.hp)+')'); }

console.log('M. 기억하는 쥐 기사 (3D) — 이름 · 살아 돌아오면 단계 +1 · 세 번이면 베테랑 · 죽으면 잊힘');
{ const pd={...PR,ratMem:[]}; const W=WF([mk(pd,0,10,10),dummy('적',30,10,1)],{rules:noInit}); W.camp=true; const p=W.units[0], e=W.units[1]; step(W,1);   // 여정 맵 (적이 다 쓰러져도 판이 이어짐)
  const k1=E.prnRat(W,p,'ratKnight',{near:true}); ok(k1&&k1.name==='쥐 기사 A'&&k1.ratRec&&k1.ratRec.lv===1,'첫 쥐 기사 — 이름 A');
  e.alive=false; e.hp=0; let k=200; while(k-->0&&!p.prn.settled) step(W);
  ok(k1.ratRec.ret===1&&k1.ratRec.lv===2&&logK(W,'ratSalute').length===1,'싸움이 끝나고 살아 있음 → 돌아온 횟수 1 · 단계 2 · 경례');
  ok(k1.leaveT!=null&&k1.alive,'경례하는 동안은 그 자리'); step(W,50); ok(!k1.alive&&k1.gone==='left'&&p.ratMem.length===1,'경례하고 사라짐 (도감) — 기억은 그대로');
  const mem=p.ratMem; ok(mem===pd.ratMem||mem.length===1,'기억은 설계에 남음 (다음 판으로)');
  mem[0].ret=2; mem[0].lv=3;
  const W2=WF([mk({...PR,ratMem:mem},0,10,10),dummy('적',30,10,1)],{rules:noInit}); const p2=W2.units[0], e2=W2.units[1]; step(W2,1);
  const k2=E.prnRat(W2,p2,'ratKnight',{near:true}); ok(k2.name==='쥐 기사 A'&&k2.max>Math.round(108*1.2),'다음 판: 기억하는 쥐 기사 A 가 먼저 — 3단계 체력 '+k2.max);
  e2.alive=false; e2.hp=0; k=200; while(k-->0&&!p2.prn.settled) step(W2); const mem2=p2.ratMem;
  ok(mem2[0].vet&&logK(W2,'ratVet').length===1,'세 번 돌아옴 → 쥐 베테랑');
  const W3=WF([mk({...PR,ratMem:mem2},0,10,10),dummy('적',13,10,1)],{rules:noInit}); const p3=W3.units[0], mem3=p3.ratMem; step(W3,1);
  const v=E.prnRat(W3,p3,'ratKnight',{near:true}); ok(v.name==='쥐 베테랑 A'&&v.ratKind==='ratVet'&&v.max===300&&v.shield&&v.pavise&&v.jav&&v.javSide==='검'&&v.vet,'다음엔 쥐 베테랑 A — 체력 300 · 대방패 · 투창 (뒤엔 검) · 베테랑');
  v.hp=1; E.applyDmg(W3,W3.units[1],v,50,{tag:'시험'}); step(W3,1); ok(!mem3.length&&logK(W3,'ratLost').length===1,'쓰러지면 기억에서 빠짐'); }

console.log('N. 흩어짐 — 편에 쥐만 남으면 떠남 · 포렌이 쓰러져도 쥐는 싸움');
{ const W=WF([mk(PR,0,10,10),dummy('동료',9,12,0),dummy('적',20,10,1)],{rules:noInit}); const p=W.units[0], g=W.units[1]; step(W,1);
  for(let i=0;i<3;i++) E.prnRat(W,p,'ratS',{near:true}); p.alive=false; p.hp=0; step(W,2);
  ok(rats(W,p).length===3,'포렌이 쓰러져도 동료가 있으면 쥐는 남아 싸움'); g.alive=false; g.hp=0; step(W,2); const Sc=logK(W,'ratScatter'); ok(rats(W,p).length===0&&Sc.length===1&&Sc[0].n===3,'편에 쥐만 남으면 흩어짐 (한 줄 · '+(Sc[0]?Sc[0].n:0)+'마리)'); }

console.log('O. 적 · 아군 같음 — 적 포렌도 같은 쥐 군단');
{ const W=WF([dummy('과녁',10,10,0),mk(PR,1,22,10)]); const p=W.units[1]; step(W,1);
  ok(rats(W,p).length===4&&rats(W,p).every(r=>r.side===1),'적 포렌도 곁에 넷 (적 편)');
  W.units[0].seenBy=0; p.target=W.units[0]; for(let i=0;i<10;i++){ p.prn.loyal={t:0,next:'ratS',dur:0.01}; step(W,1); } ok(rats(W,p).length>=6,'적 포렌의 충성도 같은 규칙 ('+rats(W,p).length+')'); }

console.log('P. 쥐 베테랑 (위키 민수 메모 · 도감) — 구르기 · 투창 뒤 검 · 지휘의 열화 카피');
const VMEM=()=>[{n:'A',lv:4,ret:3,vet:true}];
{ const W=WF([mk({...PR,ratMem:VMEM()},0,8,10),dummy('적',14.6,10,1)],{rules:noInit}); const p=W.units[0], e=W.units[1]; freeze(W); e.order={k:'hold'}; e.seenBy=1; hold(p,'pladder','pmark','pbind','pshield','pfort'); step(W,1);
  const v=E.prnRat(W,p,'ratKnight',{at:{x:11.6,y:10}}); ok(v.ratKind==='ratVet','베테랑 A 부름');
  ok(E.vetRoll(W,v,e)&&v.act&&v.act.k==='roll'&&v.act.dir==='fwd','3칸 앞의 적 → 앞구르기'); let k=40; while(k-->0&&v.act&&v.act.k==='roll') step(W);
  ok(W.t<e.proneT&&logK(W,'ratRollHit').length===1,'굴러 들어가 넘어뜨림 (중형) — 진형을 무너뜨림');
  ok(v.rollCd>W.t+4,'구르기 대기 6초'); ok(W.t<e.proneT&&e.proneT-W.t>0.6,'잘 넘어뜨림 (명세 — '+(e.proneT-W.t).toFixed(1)+'초 남음)'); ok(v.poise===1.4&&v.javK===1.25,'방어 자세 좋음 (버팀 × 1.4) · 투창 좋음 (겨눔 × 1.25) — 명세 C5');
  const big=dummy('거인',15,13,1,{sizeCls:'대형',height:2.6,weight:300}); const B=E.addUnit(W,big); B.seenBy=1; v.rollCd=-9; v.x=11.6; v.y=13; ok(!E.vetRoll(W,v,B),'대형은 굴러 넘어뜨리지 못함 — 노리지 않음 ('+E.sizeOf(B)+')'); }
{ const W=WF([mk({...PR,ratMem:VMEM()},0,8,10),dummy('적',13,10,1,{ov:{hp:900,atk:40}})],{rules:noInit}); const p=W.units[0], e=W.units[1]; freeze(W); e.seenBy=1; hold(p,'pladder','pmark','pbind','pshield','pfort'); step(W,1);
  const v=E.prnRat(W,p,'ratKnight',{at:{x:12,y:10}}); v.state='idle'; v.target=null; e.target=v; E.startAct(W,e,v,'시험'); ok(e.act&&e.act.b===v.i,'적이 베테랑을 치려 함');
  const r0=W.rand; W.rand=()=>0.1; const did=E.vetRoll(W,v,null); W.rand=r0; ok(did&&v.act.dir==='back','노린 일격 → 뒷구르기 (60%)');
  const x0=v.x; const h=v.hp; E.applyDmg(W,e,v,100,{tag:'시험'}); ok(Math.abs((h-v.hp)-60)<1,'구르는 동안 받는 피해 × 0.6 ('+(h-v.hp).toFixed(0)+')');
  let o=E.strike(W,e,v,v,1,false,{part:'머리',crit:true,mul:0.01,tag:'시험'}); ok(o&&!o.vital,'구르는 동안 급소 보호 (머리 치명에도 급소 없음)');
  let k=30; while(k-->0&&v.act&&v.act.k==='roll') step(W); ok(x0-v.x>1.8,'뒤로 굴러 빠짐 ('+(x0-v.x).toFixed(1)+'칸)');
  v.act=null; const o2=E.strike(W,e,v,v,1,false,{part:'머리',crit:true,mul:0.01,tag:'시험'}); ok(o2&&o2.vital==='머리','구르지 않을 때는 급소가 그대로 (비교)'); }
{ const W=WF([mk({...PR,ratMem:VMEM()},0,8,10),dummy('적',16,10,1)],{rules:noInit}); const p=W.units[0]; step(W,1);
  const v=E.prnRat(W,p,'ratKnight',{at:{x:11,y:10}}); v.spearHeld=false; E.javAfter(W,v); ok(v.weaponNow==='검'&&!E.unarmed(v)&&Math.abs(v.rng-(0.45+(v.reachX||0)))<1e-6,'투창 뒤 검으로 근접전 (맨손 아님 · 거리 '+v.rng.toFixed(2)+')');
  const W2=WF([mk(REB,0,8,10,{traits:['공통스킬:투창']}),dummy('적',16,10,1)]); const s=W2.units[0]; s.jav=true; s.spearHeld=false; E.javAfter(W2,s); ok(s.weaponNow==='맨손'&&E.unarmed(s),'다른 이는 그대로 맨손 (검이 없음)'); }
{ const W=WF([mk({...PR,ratMem:VMEM()},0,8,10),dummy('동료',7,12,0),dummy('적',13,10,1,{ov:{hp:900,atk:20}})],{rules:noInit}); const p=W.units[0], e=W.units[2]; freeze(W); e.order={k:'hold'}; e.seenBy=1; e.stunT=1e9; step(W,1);
  const v=E.prnRat(W,p,'ratKnight',{at:{x:11.9,y:10}}); const S3=[0,1,2].map(i=>E.prnRat(W,p,'ratS',{at:{x:6+i*0.5,y:8}})); S3.forEach(r=>{ r.ratWild=false; });
  p.alive=false; p.hp=0; v.rollCd=1e9; E.startAct(W,v,e,'시험'); step(W,1);
  const C=logK(W,'ratVetCmd'); ok(C.length===1&&C[0].b===e.i,'포렌이 쓰러지자 베테랑이 표식 (지휘의 열화 카피)');
  ok(S3.every(r=>r.rs.k==='assault'&&r.rs.b===e.i),'쥐들이 베테랑의 표식을 따름'); ok(v.vcmdCd>W.t+17,'베테랑 표식 대기 18초');
  step(W,120); ok(S3.filter(r=>r.alive).every(r=>r.rs.k!=='assault'||W.t<v.ratMark.until),'3초 뒤 풀림 (덤 쥐 없음)');
  const r=S3.find(x=>x.alive); r.rs={k:'idle'}; r.x=3; r.y=3; e.x=38; e.y=18; e.seenBy=0; v.stunT=W.t+100; step(W,150); ok(dist2(r,v)<3&&/베테랑/.test(r.mood||''),'포렌이 없으면 따르는 쥐는 베테랑 곁으로 ('+dist2(r,v).toFixed(1)+'칸 · '+r.mood+')'); }

console.log('Q. 쥐의 무구는 전리품이 아님 · 포렌이 나가면 쥐도 · 같은 맵의 다음 싸움');
{ const W=WF([mk(PR,0,8,10),dummy('적',16,10,1)],{rules:noInit}); const p=W.units[0], e=W.units[1]; step(W,1);
  const kn=E.prnRat(W,p,'ratKnight',{at:{x:12,y:10}}); E.applyDmg(W,e,kn,9999,{tag:'시험'}); step(W,1);
  ok(!kn.alive&&!W.items.some(it=>it.owner===kn.i),'쓰러진 쥐 기사의 창 · 방패가 땅에 남지 않음');
  e.alive=false; e.hp=0; step(W,1); const L0=E.lootOf(W); ok(!L0.some(x=>/쥐/.test(x.label||x.name||'')),'전리품에 쥐의 무구 없음 ('+L0.length+')'); }
{ const W=WF([mk(PR,0,8,10),dummy('동료',7,12,0),dummy('적',30,10,1)],{rules:noInit}); const p=W.units[0]; step(W,1);
  for(let i=0;i<5;i++) E.prnRat(W,p,'ratS',{near:true}); p.alive=false; p.gone='up'; step(W,2);
  const Sc=logK(W,'ratScatter'); ok(rats(W,p).length===0&&Sc.length===1&&Sc[0].n===5&&/따라/.test(Sc[0].why),'포렌이 맵을 나가면 쥐도 함께 ('+(Sc[0]?Sc[0].why:'')+')'); }
{ const W=WF([mk(PR,0,8,10),dummy('적',30,10,1)],{rules:noInit}); W.camp=true; const p=W.units[0], e=W.units[1]; step(W,1);
  e.alive=false; e.hp=0; let k=60; while(k-->0&&!p.prn.settled) step(W); ok(p.prn.settled,'적이 모두 쓰러짐 → 싸움 끝 정리');
  const n=E.addUnit(W,dummy('새 적',30,12,1)); step(W,2); ok(!p.prn.settled,'같은 맵에 새 적 → 다음 싸움 끝에 다시 정리'); }

console.log(fails?'FAIL '+fails:'ALL eng8780b OK'); process.exit(fails?1:0);
function dist2(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }
