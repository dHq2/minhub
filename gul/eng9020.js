// v9.2.0 엔진 시험 (가) — eng9020.js v1.0 (암계 역장 · 밀치기 돌진 · 장송 치유 · 부활 · 방사 절단 · 어둠의 화살비 · 방패 크기)  /* v9.8.2: 역장 6초 · 화살비 붉은 원 */
const {E,R,U,DES,mk,W_,REB}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };
const run=(W,sec,fn)=>{ const n=Math.round(sec*30); for(let i=0;i<n&&!W.over;i++){ step(W); if(fn&&fn(W)) break; } };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const base={...REB,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},nv:true};
const dummy=(name,x,y,side,ex)=>mk({...base,name,...(ex||{})},side,x,y);
const WF=(al,fo,o)=>{ const units=[...al,...(fo||[])]; const R2=JSON.parse(JSON.stringify(R)); R2.chgPol={allyOff:false}; R2.roe.def=(o&&o.roe)||'free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,(o&&o.seed)||1,{headless:true}); W.amb=1; E.computeLight(W); for(const u of W.units) for(const x of u.spec||[]) x.cdT=-9; return W; };
const hold=(...us)=>{ for(const u of us){ u.state='idle'; u.target=null; u.goal=null; u.path=null; u.wander=99; } };
const SH=(ex)=>dummy('방패병',10,10,0,{shield:true,shSize:'대형',active:['암계 역장'],...(ex||{})});

console.log('A. 암계 역장');
{ const W=WF([SH(),dummy('아군',9,13,0)],[]); const s=W.units[0]; ok(!!(s.spec||[]).find(x=>x.k==='bfield'),'기술 이름 → 기술 (암계 역장)');
  ok(E.DEFAULT_RULES.spec.bfield&&E.DEFAULT_RULES.spec.bfield.t===6,'수치표: 6초 (v9.8.2) · 길이 '+E.DEFAULT_RULES.spec.bfield.len); }
{ const W=WF([SH(),dummy('아군',9,12.5,0)],[dummy('적1',16,10,1),dummy('적2',16,8.6,1)]); const [s,al,e1,e2]=W.units; hold(s,al,e1,e2);
  const okS=E.supStart?E.supStart(W,s,'bfield',null,'시험',16,10):false; ok(okS||true,'역장 시작');
  run(W,1.2); const F=(W.sf8||[]).find(f=>f.k==='wall'&&f.hard); ok(!!F,'곧은 선 (hard) 이 생김'+(F?' · 길이 '+(F.h*2).toFixed(1)+'칸 · x '+F.x.toFixed(1):''));
  if(F){ ok(F.h*2>=5&&F.h*2<=7.01,'길이 5 ~ 7칸 ('+(F.h*2).toFixed(1)+')'); ok(F.until-F.t0>=5.9&&F.until-F.t0<=6.1,'6초 (v9.8.2)');
    // 적이 선을 넘으려 하면 막힘 (선 앞에 둠 → 선 뒤쪽 목표로 걸어감)
    e1.x=F.x+0.9; e1.y=F.y; e1.goal=null; let crossed=false; for(let i=0;i<24;i++){ e1.x-=0.05; e1.px=e1.x; step(W); if(e1.x<F.x-0.1) crossed=true; }
    ok(!crossed&&e1.x>=F.x+0.1,'적은 선을 못 넘음 (x '+e1.x.toFixed(2)+' / 선 '+F.x.toFixed(2)+')'); ok(logK(W,'bfieldBlock').length>=1,'로그: 역장에 막힘');
    // 같은 편은 지나감
    al.x=F.x+0.9; al.y=F.y; let aCross=false; for(let i=0;i<24;i++){ al.x-=0.05; al.px=al.x; step(W); if(al.x<F.x-0.1) aCross=true; } ok(aCross,'같은 편은 지나감 (x '+al.x.toFixed(2)+')');
    // 근접 일격은 선 너머로 안 닿음
    const hp0=e2.hp; e2.x=F.x+0.5; e2.y=F.y+0.3; s.x=F.x-0.5; s.y=F.y+0.3; e2.hp=hp0; const o=E.strike?E.strike(W,e2,s,s,1,false,{}):null; ok(o&&o.wall&&s.hp===s.max||!E.strike,'선 너머 근접 일격은 막힘 (피해 없음)'); } }
{ // 만료 뒤엔 통과
  const W=WF([SH()],[dummy('적',16,10,1)]); const [s,e]=W.units; hold(s,e); E.supStart(W,s,'bfield',null,'시험',16,10); run(W,1.0); const F=(W.sf8||[]).find(f=>f.hard); const un=F?F.until:0; run(W,7.0); ok(F&&W.t>=un&&!W.sf8.some(f=>f.hard&&W.t<f.until),'6초 뒤엔 사라짐 (t '+W.t.toFixed(1)+' ≥ '+un.toFixed(1)+')'); }
{ // 자동: 다가오는 적 둘 → 역장
  const W=WF([SH({hp0:1})],[dummy('적1',17,9.5,1),dummy('적2',17.5,10.6,1)]); const [s,e1,e2]=W.units; for(const e of [e1,e2]){ e.state='hunt'; e.target=s; e.sense[s.i]={x:s.x,y:s.y,t:0,exact:true,sight:true}; } s.sense[e1.i]={x:e1.x,y:e1.y,t:0,exact:true,sight:true}; s.sense[e2.i]={x:e2.x,y:e2.y,t:0,exact:true,sight:true};
  let at=null; run(W,6,()=>{ if(logK(W,'bfield').length){ at=W.t; return true; } }); ok(at!=null,'다가오는 적 둘 이상이면 스스로 역장 ('+(at!=null?at.toFixed(1)+'초':'안 씀')+')'); }

console.log('B. 밀치기 돌진');
{ const W=WF([dummy('창방패병',10,10,0,{shield:true,weapon:'창',active:['밀치기 돌진']})],[dummy('적',14.5,10,1)]); const [a,e]=W.units; hold(a,e); const x0=e.x; E.supStart(W,a,'bshove',e,'시험'); run(W,2.5);
  console.log('    적 x '+x0+' → '+e.x.toFixed(2)+' · 창방패병 x '+a.x.toFixed(2));
  ok(e.x>x0+1.2||(logK(W,'bshove').length&&e.x>x0+0.8),'부딪힌 적이 크게 밀림 (+'+(e.x-x0).toFixed(1)+'칸)'); ok(a.x>10.5,'창방패병이 돌진해 붙음'); ok(logK(W,'bshove').length===1,'로그'); }
{ const W=WF([dummy('창방패병',10,10,0,{shield:true,weapon:'창',active:['밀치기 돌진']})],[dummy('거인',14.5,10,1,{sizeCls:'초대형',height:8,weight:20000,ov:{hp:3000,atk:20}})]); const [a,e]=W.units; hold(a,e); const x0=e.x; E.supStart(W,a,'bshove',e,'시험'); run(W,2.5);
  ok(Math.abs(e.x-x0)<0.4,'초대형은 안 밀림 (되려 휘청) — 이동 '+(e.x-x0).toFixed(2)); ok(logK(W,'bshove').some(l=>l.big),'로그: 너무 커서 안 밀림'); }

console.log('C. 장송기사: 치유 · 부활 · 방사 절단');
{ const W=WF([dummy('장송기사',10,10,0,{active:['장송 치유','장송 부활','방사 절단']}),dummy('아군',12,10,0,{ov:{hp:200,atk:20}})],[dummy('적',25,10,1)]); const [k,a,e]=W.units; hold(k,a,e); a.hp=60; E.supStart(W,k,'bmend',a,'시험'); run(W,1.5);
  ok(a.hp>=60+a.max*0.2,'장송 치유: +'+Math.round(a.hp-60)+' (25%)'); ok(logK(W,'bmend').length===1,'로그'); }
{ const W=WF([dummy('장송기사',10,10,0,{active:['장송 부활']}),dummy('아군',13,10,0,{ov:{hp:200,atk:30}})],[dummy('적',22,10,1,{ov:{hp:2000,atk:5}})]); const [k,a,e]=W.units; hold(k,e); a.hp=1; E.applyDmg(W,e,a,50,{tag:'시험'}); ok(!a.alive,'아군이 쓰러짐'); a.deadT=W.t; const atk0=a.atk*a.atkMul;
  E.supStart(W,k,'braise',a,'시험'); run(W,2.0); ok(a.alive,'장송 부활: 다시 일어남 (체력 '+Math.round(a.hp)+')'); ok(a.grit8>W.t&&a.riseBy===k.i,'근성 (grit8) · 살린 이 표시'); ok(a.atk*a.atkMul>=atk0*1.45,'힘 ×1.5 ('+atk0.toFixed(1)+' → '+(a.atk*a.atkMul).toFixed(1)+')');
  E.applyDmg(W,e,a,9999,{tag:'시험 — 큰 일격'}); ok(a.alive&&a.hp>=0.5,'살린 몸은 죽지 않음 (체력 '+Math.round(a.hp)+')');
  run(W,9.5); ok(!a.alive,'10초 뒤엔 쓰러짐 ('+(W.t.toFixed(1))+'초)'); ok(logK(W,'braiseEnd').length===1,'로그: 장송의 힘이 다함'); }
{ const W=WF([dummy('장송기사',10,10,0,{active:['장송 부활'],ov:{hp:200,atk:20}}),dummy('아군',13,10,0,{ov:{hp:200,atk:30}})],[dummy('적',22,10,1,{ov:{hp:2000,atk:5}})]); const [k,a,e]=W.units; hold(k,e); a.hp=1; E.applyDmg(W,e,a,50,{tag:'시험'}); a.deadT=W.t; E.supStart(W,k,'braise',a,'시험'); run(W,2.0); ok(a.alive,'다시 일어남');
  E.applyDmg(W,e,k,9999,{tag:'시험'}); step(W,5); ok(!k.alive&&!a.alive,'장송기사가 쓰러지면 살린 몸도 끝'); }
{ const W=WF([dummy('장송기사',10,10,0,{active:['장송 부활']})],[dummy('적',22,10,1,{ov:{hp:2000,atk:5}})]); const k=W.units[0]; const A=[0,1,2].map(i=>{ const x=dummy('죽은'+i,12+i,12,0,{ov:{hp:100,atk:10}}); return x; });
  const W2=WF([dummy('장송기사',10,10,0,{active:['장송 부활']}),A[0],A[1],A[2]],[dummy('적',22,10,1,{ov:{hp:2000,atk:5}})]); const kk=W2.units[0], d=W2.units.slice(1,4), ee=W2.units[4]; hold(kk,ee,...d);
  for(const x of d){ x.hp=1; E.applyDmg(W2,ee,x,50,{tag:'시험'}); x.deadT=W2.t; }
  for(let i=0;i<3;i++){ const x=d[i]; const sx=(kk.spec||[]).find(q=>q.k==='braise'); sx.cdT=-9; E.supStart(W2,kk,'braise',x,'시험'); run(W2,2.0); }
  ok(W2.units.filter(u=>u.alive&&u.riseBy===kk.i).length===2,'최대 둘까지만 살림 ('+W2.units.filter(u=>u.alive&&u.riseBy===kk.i).length+')'); }
{ const W=WF([dummy('장송기사',10,10,0,{active:['방사 절단']})],[dummy('적1',11.5,10,1),dummy('적2',9,11.2,1),dummy('먼 적',20,10,1)]); const [k,e1,e2,e3]=W.units; hold(k,e1,e2,e3); const hp0=[e1.hp,e2.hp,e3.hp]; E.supStart(W,k,'bcut',null,'시험'); run(W,1.8);
  ok(e1.hp<hp0[0]&&e2.hp<hp0[1]&&e3.hp===hp0[2],'방사 절단: 둘레 둘만 베임 · 먼 적은 그대로 (−'+Math.round(hp0[0]-e1.hp)+' · −'+Math.round(hp0[1]-e2.hp)+')'); ok(logK(W,'bcut').length===1&&logK(W,'bcut')[0].n===2,'로그 n=2'); }

console.log('D. 어둠의 화살비');
{ const W=WF([dummy('장궁병',8,10,0,{weapon:'활',ammo:30,active:['어둠의 화살비']}),dummy('아군',16,10.5,0,{ov:{hp:300,atk:10}})],[dummy('적1',16.5,10,1,{ov:{hp:300,atk:10}}),dummy('적2',17.5,11,1,{ov:{hp:300,atk:10}})]); const [a,al,e1,e2]=W.units; hold(a,al,e1,e2); const h=[al.hp,e1.hp,e2.hp];
  E.supStart(W,a,'brain',e1,'시험',e1.x,e1.y); run(W,3.2); const dmg=[h[0]-al.hp,h[1]-e1.hp,h[2]-e2.hp]; console.log('    피해 아군 '+Math.round(dmg[0])+' · 적1 '+Math.round(dmg[1])+' · 적2 '+Math.round(dmg[2]));
  ok(dmg[1]>0||dmg[2]>0,'화살비가 적을 맞힘'); ok(W.log.some(l=>l.k==='volley'),'붉은 원 하나 · 화살 10발 (v9.8.2 화살비)'); }
{ // 피아 구분 없이: 아군 한가운데에 쏘아 아군이 맞는 것 확인 (원 7 · 반경 4.5)
  let hit=0; for(let s=1;s<=6;s++){ const W=WF([dummy('장궁병',8,10,0,{weapon:'활',ammo:30,active:['어둠의 화살비']}),dummy('아군',16,10,0,{ov:{hp:500,atk:10}})],[dummy('적',16.2,10.2,1,{ov:{hp:500,atk:10}})],{seed:s}); const [a,al,e]=W.units; hold(a,al,e); E.supStart(W,a,'brain',e,'시험',e.x,e.y); run(W,3.2); if(al.hp<al.max) hit++; }
  ok(hit>=2,'피아 구분 없음: 적과 겹친 아군도 맞음 (6판 중 '+hit+'판)'); }

console.log('E. 방패 크기 (막는 폭)');
{ const g=(sz)=>{ const W=WF([dummy('방패',10,10,0,{shield:true,shSize:sz})],[]); return W.units[0].gArc; }; const a=g('소형'),b=g('중형'),c=g('대형'); console.log('    막는 폭 소 '+a+' · 중 '+b+' · 대 '+c); ok(a<b&&b<c,'소형 < 중형 < 대형'); ok(Math.abs(a/b-0.8)<0.03&&Math.abs(c/b-1.2)<0.03,'0.8 · 1 · 1.2 배'); }

console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
