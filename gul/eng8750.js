// v8.7.5 시험 — eng8750.js v1.4 (v1.4: 대장 (주인공 · 지휘관) 은 대형의 기준과 따로 — 대장이 나가면 남은 동료가 따라 나섬 · 대형의 기준이 나가면 다음 기준이 이어받음 · v1.3: 방패를 든 근접도 주 방어대장 (레베카) · 사수 기준이면 칼이 앞에 · 기준의 진형 버프 줄 · v1.2: 좁은 길 비켜서기 (J12 — 몸을 붙여 지나감 · 싸우는 중이면 그대로 · 적도 같은 규칙) · 좁은 골목 철퇴 (A6 — 던지기만 · 후리기 없음 · 명령도 거절) · v1.1: 진형 버프 (방패벽 · 쐐기 돌파 · 삼각 엄호 · 사방 경계 · 흩어짐 · 적의 대치 진형 · 적의 쐐기 같은 셈 · 무너지면 없음) · 조합 버프 (고블린즈 · 갱스터 파라다이스 · 굴에 떨어진 이들 · 노먼의 2편대 · 적도 같은 셈 · 멀면 없음) · v1.0: 대형 — 편대장 고르기 · 모양 다섯 자리 · 함께 걸음 (가장 느린 편대원) · 대형 70% 아래면 편대장이 기다림 (3초까지) · 맞붙은 편대원은 싸우고 끝나면 제 자리 · 떼어 맡김 · 모여 · 편대장 교대 · 기준 = 편대장 · 끈 대형 · setup.form 없는 판은 예전 그대로)
const {E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const BER={ref:'C-218',name:'딸기',tier:2,cls:'치유',role:'지원',weapon:'대지 마법',height:1.7,weight:58,ov:{hp:200,atk:22},traits:['열매 맺기'],skill:{name:'딸기 정령술',kit:true,inf:true,pool:99,pct:0.12,min:8,cap:20,hot:3,hotN:6,hotGap:0.5,cd:2.4,wind:0.45,rec:0.3,rng:3.5,auto:0.55}};
const party=(x,y)=>[mk(KAR,0,x,y),mk(REB,0,x-1,y-1),mk(INJ,0,x-1,y+1,{hero:true}),mk(GOB,0,x-2,y),mk(NOR,0,x-3,y-1),mk(BER,0,x-3,y+1)];
const FAR=()=>mk({...DES['창병'],ov:{hp:9999}},1,58.5,1.5,{spdMul:0});   // 판이 끝나지 않게 멀리 묶어 둔 적
const WF=(units,form,o)=>{ const R2=JSON.parse(JSON.stringify(R)); if(o&&o.roe){ R2.roe.def=o.roe; if(o.roe==='hold') R2.roe.autoLift=false; } const W=E.createWorld({type:'grid',W:o&&o.W||60,H:o&&o.H||20,seed:7,units:[...units,FAR()],torches:[{x:20,y:10,r:60}],flips:[],...(form?{form}:{})},R2,o&&o.seed||1,{headless:true}); E.computeLight(W); const f=W.units[W.units.length-1]; f.order={k:'hold'}; return W; };
const slotD=(W,F,u)=>{ const s=F.slots[u.i]; if(!s) return 99; const p=E.formPt(W,F,s); return Math.hypot(u.x-p.x,u.y-p.y); };

console.log('A. 편대장 · 모양 다섯');
{ const W=WF(party(10,10),{A:{shape:'삼각'}}); E.stepWorld(W,1/30); const F=W.form.A, U0=W.units;
  ok(F.lead===0&&F.act,'편대장 = 주 방어대장 (가장 단단한 전선 — 카리우스)');
  const s=F.slots; console.log('    삼각', U0.map(u=>u.name+':'+(s[u.i]?s[u.i].f.toFixed(1)+','+s[u.i].l.toFixed(1)+','+s[u.i].k:'-')).join(' '));
  ok(s[1].k==='front'&&s[2].k==='spear'&&s[3].k==='front'&&s[4].k==='back'&&s[5].k==='back','갈래: 레베카 · 청광묵 앞 (칼) · 인주 2열 (창) · 노먼 · 딸기 뒤');
  ok(Object.values(s).every(q=>q.f<=0)&&s[1].f===-1.1&&s[3].f===-1.1,'삼각: 편대장이 꼭짓점 · 칼 둘이 첫 줄');
  ok(Math.abs(s[4].l)<Math.abs(s[2].l)||Math.abs(s[5].l)<Math.abs(s[2].l),'삼각: 사수 · 치유는 안쪽 (창은 바깥)');
  const shapes={}; for (const sh of E.FORM_SHAPES){ E.formSet(W,'A',{shape:sh}); E.formTick(W,1/30); shapes[sh]=JSON.parse(JSON.stringify(F.slots)); }
  const lineFront=[1,3].every(i=>shapes['일자'][i].f===0), lineSpear=shapes['일자'][2].f<0, lineBack=[4,5].every(i=>shapes['일자'][i].f<=-2.2);
  ok(lineFront&&lineSpear&&lineBack,'일자: 칼은 편대장 옆 · 창은 2열 · 사수 · 치유는 뒷줄 (2.2칸 뒤)');
  const wide=Math.max(...[1,3].map(i=>Math.abs(shapes['산개'][i].l))) > Math.max(...[1,3].map(i=>Math.abs(shapes['일자'][i].l)))+0.8;
  ok(wide,'산개: 일자보다 넓게 (칸 간격 2.2)');
  const wedge=[1,3].every(i=>shapes['쐐기'][i].f<0&&Math.abs(Math.abs(shapes['쐐기'][i].f)-Math.abs(shapes['쐐기'][i].l))<0.01);
  ok(wedge&&shapes['쐐기'][1].l*shapes['쐐기'][3].l<0,'쐐기: 날개가 양쪽으로 비스듬히');
  const ring=[1,2,3].map(i=>shapes['방진'][i]), R0=Math.hypot(ring[0].f-(-Math.max(1.15,4*1.05/(2*Math.PI))),ring[0].l);
  ok(ring.every(q=>q.fo!=null)&&[4,5].every(i=>Math.abs(shapes['방진'][i].l)<0.6),'방진: 근접은 둥글게 (밖을 봄) · 사수 · 치유는 가운데');
  const keys=E.FORM_SHAPES.map(sh=>JSON.stringify(Object.values(shapes[sh]).map(q=>[q.f.toFixed(2),q.l.toFixed(2)])));
  ok(new Set(keys).size===5,'모양 다섯이 모두 다른 자리'); }

console.log('A2. 방패 든 방어대장 · 사수 기준 (v1.3)');
{ const W=WF([mk(REB,0,10,10),mk(INJ,0,9,11,{hero:true}),mk(GOB,0,9,9),mk(NOR,0,8,10),mk(BER,0,8,11)],{A:{shape:'일자'}}); E.stepWorld(W,1/30); const F=W.form.A;
  ok(W.units[F.lead].name==='레베카','방패를 든 근접 (레베카 — 공격수) 이 주 방어대장 (주인공보다 먼저)');
  const nor=W.units[3]; E.formSet(W,'A',{lead:nor.i}); E.formTick(W,1/30); const s=F.slots;
  console.log('    사수 기준 일자', W.units.filter(u=>u.side===0).map(u=>u.name+':'+(s[u.i]?s[u.i].f.toFixed(2)+','+s[u.i].l.toFixed(2)+','+s[u.i].k:'-')).join(' '));
  const mel=W.units.filter(u=>u.side===0&&u!==nor&&s[u.i]&&s[u.i].k==='front'), back=W.units.filter(u=>u.side===0&&u!==nor&&s[u.i]&&s[u.i].k==='back');
  ok(F.ldk==='back'&&mel.length&&mel.every(u=>s[u.i].f>=2),'사수 (노먼) 가 기준이면 칼은 기준 앞 (뒷줄 깊이만큼 앞으로)');
  ok(back.every(u=>Math.abs(s[u.i].f)<0.3),'다른 뒷줄 (딸기) 은 기준 옆');
  F.integ=1; W.units.forEach(u=>{ if(u.side===0&&s[u.i]){ const q=E.formPt(W,F,s[u.i]); u.x=q.x; u.y=q.y; } }); E.formTick(W,1/30); E.fbTick(W);
  ok(nor.fb&&nor.fb.row==='rear'&&!nor.fb.tip&&mel.every(u=>u.fb&&u.fb.row==='front'),'진형 버프 줄: 사수 기준은 뒷줄 (방패벽 · 끝 버팀 없음) · 칼은 앞줄 (방패벽)'); }

console.log('B. 함께 걸음 (명령은 편대장에게)');
{ const W=WF(party(6,10),{A:{shape:'삼각'}}); const F=W.form.A, K=W.units[0]; run(W,2.5);
  const AL=W.units.filter(u=>u.side===0&&u!==K), d0=Math.max(...AL.map(u=>slotD(W,F,u)));
  K.order={k:'move',x:30.5,y:10.5,form:true}; let minI=1, sumI=0, n=0, maxV=0; const arr={};
  run(W,16,()=>{ if(W.t>3.5){ minI=Math.min(minI,F.integ); sumI+=F.integ; n++; } maxV=Math.max(maxV,Math.hypot(K.vx||0,K.vy||0)); for(const u of W.units) if(u.side===0&&arr[u.i]==null&&u.x>28.5) arr[u.i]=+W.t.toFixed(1); });
  const avgI=sumI/n, dEnd=Math.max(...AL.map(u=>slotD(W,F,u)));
  console.log(`    시작 자리 오차 ${d0.toFixed(2)} · 가는 동안 대형 평균 ${avgI.toFixed(2)} · 최저 ${minI.toFixed(2)} · 카리우스 걸음 최고 ${maxV.toFixed(2)} · 도착 자리 오차 ${dEnd.toFixed(2)} · 도착 ${JSON.stringify(arr)}`);
  ok(d0<0.9,'시작 2.5초 안에 모두 제 자리');
  ok(avgI>=0.85,'가는 동안 대형 유지 (평균 85% 넘게)');
  ok(dEnd<0.9&&Math.hypot(K.x-30.5,K.y-10.5)<0.3,'도착하면 다시 제 자리 (편대장은 정한 곳)');
  ok(AL.every(u=>!u.fdet&&!u.order),'편대원은 명령 없이 따라감 (떼어 맡기지 않음)'); }

console.log('C. 가장 느린 편대원에 맞춤 · 대형 70% 아래면 편대장이 기다림');
{ const W=WF(party(6,10),{A:{shape:'일자'}}); const F=W.form.A, K=W.units[0], Ru=W.units[1]; run(W,2.5); Ru.spdMul=0.45;   // 레베카 다리를 다침 (걸음 ×0.45)
  K.order={k:'move',x:30.5,y:10.5,form:true}; let fpk=null, vK=[];
  run(W,6,()=>{ if(K.fpK) fpk=K.fpK; if(W.t>4) vK.push(Math.hypot(K.vx||0,K.vy||0)); });
  const vAvg=vK.reduce((a,b)=>a+b,0)/vK.length, slow=E.DEFAULT_RULES?null:null;
  console.log(`    편대장 걸음 배율 ${fpk&&fpk.toFixed(2)} · 카리우스 평균 ${vAvg.toFixed(2)} (레베카 걷기 ${(Ru.spd*Ru.spdMul).toFixed(2)}) · 레베카 자리 오차 ${slotD(W,F,Ru).toFixed(2)}`);
  ok(fpk&&fpk<0.7,'편대장 걸음이 가장 느린 편대원에 맞춰짐');
  ok(vAvg<=Ru.spd*Ru.spdMul*1.15,'카리우스가 레베카보다 빨리 가지 않음');
  // 막힌 편대원: 노먼을 바위로 가둠 → 3초 기다린 뒤 그냥 감
  const W2=WF(party(6,10),{A:{shape:'일자'}}); const F2=W2.form.A, K2=W2.units[0], N2=W2.units[4]; run(W2,2.5); N2.spdMul=0; W2.units[5].spdMul=0;   // 노먼 · 딸기가 못 움직임 (6명 중 둘)
  K2.order={k:'move',x:30.5,y:10.5,form:true}; let waitT=null, goT=null;
  run(W2,8,()=>{ if(K2.mood==='대형을 기다림'&&waitT==null) waitT=W2.t; if(waitT!=null&&goT==null&&K2.mood==='이동'&&W2.t>waitT+0.5) goT=W2.t; });
  const wl=W2.log.filter(l=>l.k==='formWait');
  console.log(`    기다림 시작 ${waitT&&waitT.toFixed(1)} · 다시 감 ${goT&&goT.toFixed(1)} · 기록 ${wl.length} · 대형 ${F2.integ.toFixed(2)}`);
  ok(waitT!=null&&wl.length>=1,'대형이 70% 아래로 떨어지면 편대장이 기다림 (기록)');
  ok(goT!=null&&goT-waitT>=2.5&&goT-waitT<=4.5,'3초 넘게 기다리면 그냥 감 (막힌 편대원 때문에 서지 않음)'); }

console.log('D. 맞붙으면 그 자리에서 싸우고 끝나면 제 자리');
{ const foe=mk({...DES['검기사'],ov:{hp:60,atk:8}},1,15,9.6); const W=WF([...party(6,10),foe],{A:{shape:'일자'}},{roe:'hold'}); const F=W.form.A;
  run(W,2.2); for (const u of W.units) if(u.side===0) u.order=null;
  const K=W.units[0]; K.order={k:'hold'};   // 편대장은 제자리 — 적이 다가옴
  foe.order=null; let engN=0, maxOut=0;
  run(W,25,()=>{ const e=W.units.filter(u=>u.side===0&&u.fEng).length; engN=Math.max(engN,e); });
  const dead=!W.units[6].alive, back=W.units.slice(1,6).every(u=>!u.alive||slotD(W,F,u)<1.3);
  console.log(`    맞붙은 편대원 최대 ${engN} · 적 쓰러짐 ${dead} · 끝난 뒤 자리 오차 ${W.units.slice(1,6).map(u=>u.name+':'+slotD(W,F,u).toFixed(2)).join(' ')} · 대형 ${F.integ.toFixed(2)}`);
  ok(engN>=1,'다가온 적과 편대원이 맞붙음 (보통 판단으로 싸움)');
  ok(dead,'적을 쓰러뜨림');
  ok(back&&F.integ>=0.7,'끝나면 모두 제 자리 (대형 다시 갖춤)'); }

console.log('E. 떼어 맡김 · 모여');
{ const W=WF(party(6,10),{A:{shape:'삼각'}}); const F=W.form.A; run(W,2.5); const G=W.units[3];
  G.order={k:'move',x:12.5,y:4.5}; run(W,0.2);
  ok(G.fdet===true,'따로 자리 명령을 받은 편대원은 떼어 맡김');
  run(W,5); ok(Math.hypot(G.x-12.5,G.y-4.5)<0.5&&!G.order,'떼어 맡긴 이는 그 자리를 지킴');
  ok(F.integ>=0.99,'떼어 맡긴 이는 대형 셈에서 빠짐 (나머지로 100%)');
  G.order={k:'attack',b:0}; G.order=null;   // 공격 명령은 떼어 맡기지 않음 (끝나면 제 자리)
  E.formRally(W,'A'); G.order={k:'frally'}; run(W,0.2);
  ok(!G.fdet&&!G.stay,'모여: 떼어 맡김 · 지키던 자리를 풂');
  run(W,4); ok(slotD(W,F,G)<0.9,'모여 뒤엔 제 자리로 돌아옴');
  ok(W.log.some(l=>l.k==='formRally')&&W.log.some(l=>l.k==='frallyOk'),'모여 기록'); }

console.log('F. 편대장 교대 · 기준 · 끈 대형 · 대형 없는 판');
{ const W=WF(party(6,10),{A:{shape:'삼각'}}); const F=W.form.A; run(W,2);
  ok(E.ancOf(W)===W.units[0],'본대 대형이 켜져 있으면 기준 (따라감 · 탐험) = 편대장');
  const K=W.units[0]; K.alive=false; K.hp=0; run(W,0.5);
  const nl=W.units[F.lead];
  console.log(`    새 편대장 ${nl&&nl.name} · 기록 ${JSON.stringify(W.log.find(l=>l.k==='formLead')||null)}`);
  ok(nl&&nl.alive&&nl!==K&&W.log.some(l=>l.k==='formLead'),'편대장이 쓰러지면 다음 (기록)');
  run(W,3); ok(F.integ>=0.7,'새 편대장 기준으로 다시 갖춤');
  E.formSet(W,'A',{on:false}); run(W,0.3); ok(!F.act&&E.ancOf(W)===W.units.find(u=>u.hero),'대형을 끄면 기준은 다시 주인공');
  const W0=WF(party(6,10),null); run(W0,2); ok(!W0.form&&W0.units.every(u=>u.fsq==null),'setup.form 없는 판은 대형 없음 (예전 그대로)'); }

console.log('G. 진형 버프 (양쪽 같은 규칙)');
{ const foe=()=>mk({...DES['검기사'],ov:{hp:9999,atk:20}},1,30,10,{spdMul:0});
  const mkW=(sh)=>{ const W=WF([...party(10,10),foe()],{A:{shape:sh}},{roe:'hold'}); const e=W.units[6]; e.order={k:'hold'}; run(W,3); return W; };
  // 일자 — 방패벽: 앞줄 막는 폭 · 밀려남 버팀
  { const W=mkW('일자'), K=W.units[0], Rb=W.units[1], N=W.units[4], e=W.units[6];
    const fb=W.units.filter(u=>u.side===0).map(u=>u.name+':'+(u.fb?u.fb.nm+'/'+u.fb.row:'-')).join(' ');
    console.log('    일자', fb, '대형', W.form.A.integ.toFixed(2));
    ok(Rb.fb&&Rb.fb.nm==='방패벽'&&Rb.fb.row==='front'&&N.fb&&N.fb.row==='rear','방패벽: 앞줄 (레베카) · 뒷줄 (노먼) 구분');
    const a1=E.guardArc(W,Rb); const b0=Rb.fb; Rb.fb=null; const a0=E.guardArc(W,Rb); Rb.fb=b0;
    ok(Math.abs(a1-a0-20)<0.01,'방패벽: 앞줄 막는 폭 +20° ('+a0.toFixed(0)+' → '+a1.toFixed(0)+')');
    const k1=E.kbLen(W,e,Rb,1.5); Rb.fb=null; const k0=E.kbLen(W,e,Rb,1.5); Rb.fb=b0;
    ok(k1<k0*0.95,'방패벽: 앞줄은 덜 밀려남 ('+k0.toFixed(2)+' → '+k1.toFixed(2)+'칸)');
    // 무너지면 없음: 편대원 셋을 멀리 떼어 놓음
    for (const i of [1,3,5]){ const u=W.units[i]; u.x=2; u.y=2+i; u.spdMul=0; } run(W,0.5);
    console.log('    흐트러진 대형', W.form.A.integ.toFixed(2), W.units.filter(u=>u.side===0).map(u=>u.name+':'+(u.fb?u.fb.nm:'-')).join(' '));
    ok(W.form.A.integ<0.7&&W.units.every(u=>u.side!==0||!u.fb)&&W.log.some(l=>l.k==='fbOn')&&W.log.some(l=>l.k==='fbOff'),'대형이 70% 아래면 진형 버프 없음 (켜짐 · 꺼짐 기록)'); }
  // 쐐기 — 밀치는 힘 · 꼭짓점 버팀
  { const W=mkW('쐐기'), K=W.units[0], Rb=W.units[1], e=W.units[6]; const k1=E.kbLen(W,Rb,e,1.5), f0=Rb.fb; Rb.fb=null; const k0=E.kbLen(W,Rb,e,1.5); Rb.fb=f0;
    ok(K.fb&&K.fb.nm==='쐐기 돌파'&&K.fb.tip&&k1>k0*1.15,'쐐기 돌파: 꼭짓점 · 날개 — 밀치는 힘 ×1.2 ('+k0.toFixed(2)+' → '+k1.toFixed(2)+')'); }
  // 삼각 — 안쪽 사수 명중
  { const W=mkW('삼각'), N=W.units[4], e=W.units[6]; N.x=e.x-6; N.y=e.y; const p1=E.aimP(W,N,e,false), f0=N.fb; N.fb=null; const p0=E.aimP(W,N,e,false); N.fb=f0;
    ok(f0&&f0.nm==='삼각 엄호'&&f0.back&&Math.abs(p1/p0-1.1)<0.02,'삼각 엄호: 안쪽 (노먼) 사격 명중 ×1.1 ('+p0.toFixed(2)+' → '+p1.toFixed(2)+')'); }
  // 방진 — 뒤에서 쳐도 정면 · 걸음 ×0.9
  { const W=mkW('방진'), Rb=W.units[1], e=W.units[6]; e.x=Rb.x-Math.cos(Rb.face)*0.9; e.y=Rb.y-Math.sin(Rb.face)*0.9;
    const s1=E.spdNow(W,Rb), f0=Rb.fb; Rb.fb=null; const s0=E.spdNow(W,Rb); Rb.fb=f0;
    const o=E.strike(W,e,Rb,Rb,1,false,{});
    console.log('    방진 뒤치기', JSON.stringify({dir:o&&o.dir, fb:f0&&f0.nm}));
    ok(f0&&f0.nm==='사방 경계'&&o&&o.dir==='front','사방 경계: 뒤에서 쳐도 정면처럼 (뒤치기 · 기습 배율 없음)');
    ok(Math.abs(s1/s0-0.9)<0.01,'사방 경계: 걸음 ×0.9'); }
  // 산개 — 날아오는 탄 명중 ×0.85
  { const W=mkW('산개'), Rb=W.units[1], e=W.units[6]; const sh=mk({...DES['궁수'],ov:{hp:50}},1,Rb.x+6,Rb.y); W.units.push(sh); sh.i=W.units.length-1;
    const p1=E.aimP(W,W.units[6],Rb,false), f0=Rb.fb; Rb.fb=null; const p0=E.aimP(W,W.units[6],Rb,false); Rb.fb=f0;
    ok(f0&&f0.nm==='흩어짐'&&Math.abs(p1/p0-0.85)<0.02,'흩어짐: 날아오는 탄 · 화살에 덜 맞음 ×0.85'); }
  // 적의 대치 진형 (일자) — 같은 규칙
  { const T=()=>mk({...DES['검방패기사'],ov:{hp:200}},1,0,0); const en=[T(),T(),T(),mk(DES['궁수'],1,0,0)]; const W=WF([mk(REB,0,5,10)],null,{}); for(const p of en){ W.units.push(null); }
    const W2=E.createWorld({type:'grid',W:40,H:20,seed:7,units:[mk(REB,0,5,10),...en.map((p,k)=>({...p,x:20,y:8+k*1.1}))],torches:[{x:20,y:10,r:60}],flips:[]},JSON.parse(JSON.stringify(R)),1,{headless:true});
    const ids=[1,2,3,4]; W2.stance=W2.stance||[]; W2.stance[1]={k:'hold',slots:Object.fromEntries(ids.map(i=>[i,{x:W2.units[i].x,y:W2.units[i].y}]))}; E.fbTick(W2);
    const fr=ids.map(i=>W2.units[i]).filter(u=>u.role==='전선');
    console.log('    적 대치', ids.map(i=>W2.units[i].name+':'+W2.units[i].role+':'+(W2.units[i].fb?W2.units[i].fb.nm+'/'+W2.units[i].fb.row:'-')).join(' '));
    ok(fr.length&&fr.every(u=>u.fb&&u.fb.nm==='방패벽'&&u.fb.row==='front'),'적의 대치 진형도 방패벽 (전선 = 앞줄 · 같은 규칙)'); }
  // 적의 쐐기 돌파 — 같은 규칙
  { const en=[0,1,2,3].map(k=>mk({...DES['검기사'],ov:{hp:200}},1,20-k*0.95,10+(k%2?0.9:-0.9)*(k?1:0)));
    const W2=E.createWorld({type:'grid',W:40,H:20,seed:7,units:[mk(REB,0,5,10),...en],torches:[{x:20,y:10,r:60}],flips:[]},JSON.parse(JSON.stringify(R)),1,{headless:true});
    const tip=W2.units[1]; W2.wedge={tip:1,sh:[2,3],body:[4],aim:{x:5,y:10},phase:'form'}; const ax=-1, px=0, py=-1;
    W2.units[2].x=tip.x+0.95; W2.units[2].y=tip.y-0.9*-1; W2.units[3].x=tip.x+0.95; W2.units[3].y=tip.y+0.9*-1; W2.units[4].x=tip.x+1.9; W2.units[4].y=tip.y-0.6*-1;
    W2.units[2].y=tip.y-0.9; W2.units[3].y=tip.y+0.9; W2.units[4].y=tip.y-0.6; E.fbTick(W2);   // 쐐기 자리: 어깨 0.95칸 뒤 ±0.9 · 몸통 1.9칸 뒤 (aim 쪽이 앞)
    console.log('    적 쐐기', [1,2,3,4].map(i=>W2.units[i].name+':'+(W2.units[i].fb?W2.units[i].fb.nm+(W2.units[i].fb.tip?'(끝)':''):'-')).join(' '));
    ok(tip.fb&&tip.fb.nm==='쐐기 돌파'&&tip.fb.tip&&W2.units[2].fb,'적의 쐐기 돌파도 쐐기 버프 (같은 규칙)'); } }

console.log('H. 조합 버프 (도감 근거 · 같은 편 · 5칸 안)');
{ const TRK={ref:'C-107',name:'트라카',tier:2,cls:'원거리',role:'사수',weapon:'단궁',ammo:60,height:1.25,weight:34,nv:true,nvG:'B',ov:{hp:80,atk:13},traits:['사격B','회피A','은신B'],active:['도약'],race:'고블린'};
  const GAN={ref:'C-195',name:'간두',tier:2,cls:'기동',role:'사수',weapon:'권총',ammo:100,height:1.88,ov:{hp:110,atk:20},traits:['회피B']};
  const JAN={ref:'C-262',name:'쟝',tier:2,cls:'기동',role:'미드필더',weapon:'장도리',height:1.8,weight:72,ov:{hp:95,atk:30},traits:[]};
  const e0=()=>mk({...DES['검기사'],ov:{hp:9999,atk:5}},1,30,10,{spdMul:0});
  const W=WF([mk({...GOB,race:'고블린'},0,6,10),mk(TRK,0,7,11),mk(GAN,0,6,13),mk(JAN,0,7,13),mk(INJ,0,8,9,{hero:true}),mk(REB,0,8,10),mk(KAR,0,9,10),mk(NOR,0,8,12),e0()],null,{roe:'hold'});
  const g=W.units[0], t=W.units[1], ga=W.units[2], j=W.units[3], N=W.units[7], e=W.units[8]; run(W,0.3);
  console.log('    조합', JSON.stringify(W.combos.filter(c=>c.side===0).map(c=>c.nm+':'+c.ids.map(i=>W.units[i].name).join('+'))));
  ok(E.cbHas(g,'gob')&&E.cbHas(t,'gob'),'고블린즈: 청광묵 + 트라카 ([종족:고블린])');
  ok(E.cbHas(ga,'gang')&&E.cbHas(j,'gang'),'갱스터 파라다이스: 간두 + 쟝');
  ok(['C-001','C-002','C-003'].every(r=>E.cbHas(W.units.find(u=>u.ref===r),'fell')),'굴에 떨어진 이들: 인주 · 레베카 · 카리우스 (셋 넘게)');
  ok(E.cbHas(N,'sq2')&&E.cbHas(g,'sq2'),'노먼의 2편대: 노먼 + 청광묵');
  ok(W.log.filter(l=>l.k==='combo'&&l.side===0).length===4,'조합마다 한 번 기록');
  // 고블린즈: 냄새를 나눔
  g.sense[e.i]={x:e.x,y:e.y,t:W.t,exact:true,smell:true}; E.comboTick(W);
  ok(t.sense[e.i]&&t.sense[e.i].shared===g.i,'고블린즈: 청광묵이 맡은 냄새를 트라카도 앎');
  // 갱스터: 의리
  E.applyDmg(W,e,ga,10,{}); ok(j.gangMark&&j.gangMark.b===e.i&&Math.abs(E.cbDmg(W,j,e)-1.15)<1e-9,'갱스터 파라다이스: 간두를 친 상대에게 쟝의 피해 ×1.15');
  // 2편대: 노먼이 외친 표적
  N.sqFocus={b:e.i,t:W.t}; g.x=e.x-3; g.y=e.y; const p1=E.aimP(W,g,e,false); const c1=E.cbDmg(W,g,e); N.sqFocus=null; const p0=E.aimP(W,g,e,false);
  ok(Math.abs(c1-1.1)<1e-9&&p1>p0,'노먼의 2편대: 노먼이 외친 표적에 피해 · 명중 ×1.1');
  // 멀면 없음
  t.x=25; t.y=3; E.comboTick(W); ok(!E.cbHas(t,'gob')&&!E.cbHas(g,'gob'),'5칸 넘게 떨어지면 조합 없음');
  // 적도 같은 규칙: 적 고블린 둘
  const W2=WF([mk(INJ,0,5,10,{hero:true}),mk({...GOB,race:'고블린'},1,20,10),mk({...TRK,race:'고블린'},1,21,11)],null,{}); run(W2,0.3);
  ok(E.cbHas(W2.units[1],'gob')&&E.cbHas(W2.units[2],'gob'),'적 고블린 둘도 고블린즈 (같은 규칙)'); }

console.log('I. 좁은 길 비켜서기 (J12)');
{ const flips=[]; for(let x=3;x<=26;x++){ flips.push(x+',4'); flips.push(x+',6'); }   // y=5 한 칸 통로
  const WC=(units,seed)=>{ const W=E.createWorld({type:'grid',W:30,H:12,seed:7,units:[...units,FAR()],torches:[{x:15,y:5,r:60}],flips},JSON.parse(JSON.stringify(R)),seed||1,{headless:true}); E.computeLight(W); W.units[W.units.length-1].order={k:'hold'}; W.units[W.units.length-1].x=28.5; W.units[W.units.length-1].y=10.5; return W; };
  const W=WC([mk(REB,0,12.5,5.5),mk(INJ,0,6.5,5.5,{hero:true})]); const S=W.units[0], M=W.units[1];
  ok(E.tightAt(W,S),'통로 칸은 좁은 칸');
  S.stay={x:12.5,y:5.5}; M.order={k:'move',x:22.5,y:5.5}; let tPass=null, sAt=null; run(W,14,()=>{ if(tPass==null&&M.x>S.x+0.9) tPass=W.t; if(tPass!=null&&sAt==null&&W.t>tPass+0.3) sAt={x:S.x,y:S.y}; });   // 레베카는 자리를 지키던 동료 (명령은 없음)
  const sq=W.log.find(l=>l.k==='squeeze');
  console.log(`    지나간 때 ${tPass&&tPass.toFixed(1)} · 인주 ${M.x.toFixed(1)},${M.y.toFixed(1)} · 레베카 ${S.x.toFixed(1)},${S.y.toFixed(1)} · 기록 ${JSON.stringify(sq||null)}`);
  ok(sq&&sq.a===M.i&&sq.b===S.i,'옆으로 비킬 곳이 없으면 서 있는 동료 곁을 몸을 붙여 지나감 (기록)');
  ok(Math.hypot(M.x-22.5,M.y-5.5)<0.5,'좁은 길 끝까지 감 (막혀 비비지 않음)');
  ok(sAt&&Math.hypot(sAt.x-12.5,sAt.y-5.5)<1.0,'지나간 뒤 서 있던 동료는 제자리 근처 그대로 ('+(sAt?sAt.x.toFixed(1):'-')+')');
  // 싸우는 중이면 그대로 · 적도 같은 규칙 (giveWay 를 직접)
  const W2=WC([mk(REB,0,12.5,5.5),mk(INJ,0,12.0,5.5,{hero:true}),mk({...DES['검기사'],ov:{hp:999}},1,13.3,5.5)]); const S2=W2.units[0], M2=W2.units[1]; M2.path=[{x:20.5,y:5.5}];
  E.giveWay(W2,M2,S2,0.3); ok(M2.sqzP==null,'서 있는 동료가 싸우는 중이면 몸을 붙여 지나가지 않음 (좁은 길의 1대1)');
  const W3=WC([mk(INJ,0,2.5,10.5,{hero:true}),mk({...DES['검기사'],ov:{hp:999}},1,12.5,5.5),mk({...DES['창병'],ov:{hp:999}},1,12.0,5.5)]); const S3=W3.units[1], M3=W3.units[2]; M3.path=[{x:20.5,y:5.5}];
  E.giveWay(W3,M3,S3,0.3); ok(M3.sqzP===S3.i&&S3.sqzP===M3.i,'적도 같은 규칙 (좁은 길에서 몸을 붙여 지나감)'); }

console.log('J. 좁은 골목 철퇴 (A6)');
{ const MS={ref:'C-005',name:'모닝스타',tier:2,cls:'근접',weapon:'모닝스타',height:1.9,ov:{hp:200,atk:20},traits:[],active:['철퇴 후리기']};
  const flips=[]; for(let x=3;x<=26;x++){ flips.push(x+',4'); flips.push(x+',6'); }
  const mkW=(fl)=>{ const W=E.createWorld({type:'grid',W:30,H:12,seed:7,units:[mk(MS,0,10.5,5.5,{hero:true}),mk({...DES['검기사'],ov:{hp:999,atk:1}},1,11.55,5.5),mk({...DES['검기사'],ov:{hp:999,atk:1}},1,9.45,5.5)],torches:[{x:15,y:5,r:60}],flips:fl?flips:[]},JSON.parse(JSON.stringify(R)),3,{headless:true}); E.computeLight(W); return W; };
  let alleyFl=0, openSw=0, n=0;
  for (let k=0;k<20;k++){ const W=mkW(true), u=W.units[0]; u.act=null; E.startAct(W,u,W.units[1],'시험'); n++; if(u.act&&u.act.fl&&u.act.alley) alleyFl++; const W2=mkW(false), u2=W2.units[0]; u2.act=null; E.startAct(W2,u2,W2.units[1],'시험'); if(u2.act&&!u2.act.fl) openSw++; }
  console.log(`    골목 던지기 ${alleyFl}/${n} · 트인 곳 붙어 휘두르기 ${openSw}/${n}`);
  ok(alleyFl===n,'좁은 골목: 붙어 있어도 돌려 휘두르지 않고 앞뒤로 던짐');
  ok(openSw>=n*0.5,'트인 곳: 붙으면 휘두름 (예전 그대로)');
  const W=mkW(true), u=W.units[0]; const sp=(u.spec||[]).find(x=>x.k==='sweep'); ok(!!sp,'모닝스타에게 철퇴 후리기');
  if(sp){ sp.cdT=-9; u.act=null; E.specAuto(W,u,W.units[1],true); ok(!(u.act&&u.act.k==='spec'&&u.act.s==='sweep'),'좁은 골목: 둘러싸여도 후리기 (돌리기) 를 스스로 쓰지 않음');
    u.act=null; u.order={k:'spec',s:'sweep'}; E.stepWorld(W,1/30); ok(W.log.some(l=>l.k==='alleyNo')&&!u.order,'좁은 골목: 후리기 명령은 "철퇴를 돌릴 수 없음" 으로 거절 (기록)');
    const W2=mkW(false), u2=W2.units[0], sp2=u2.spec.find(x=>x.k==='sweep'); sp2.cdT=-9; u2.act=null; E.specAuto(W2,u2,W2.units[1],true); ok(u2.act&&u2.act.k==='spec'&&u2.act.s==='sweep','트인 곳: 둘러싸이면 후리기 (예전 그대로)'); } }

console.log('K. 대장과 기준 (v1.4)');
{ const W=WF(party(10,10),{A:{shape:'삼각'}}); W.camp=true; E.stepWorld(W,1/30); const F=W.form.A, K=W.units[F.lead], I=W.units.find(u=>u.hero);
  ok(E.ancOf(W)===K&&E.chiefOf(W)===I,'움직임의 기준 = 대형의 기준 ('+K.name+') · 대장 = 주인공 ('+I.name+')');
  E.leaveMap(W,I,'up'); const fol=W.units.filter(u=>u.side===0&&u.alive&&u.order&&u.order.k==='exit');
  ok(fol.length===W.units.filter(u=>u.side===0&&u.alive).length&&W.ancLeft&&W.ancLeft.i===I.i,'대장이 나가면 남은 동료 모두 따라 나섬 ('+fol.length+') · 나간 대장 기록'); }
{ const W=WF(party(10,10),{A:{shape:'삼각'}}); W.camp=true; E.stepWorld(W,1/30); const F=W.form.A, K=W.units[F.lead];
  E.leaveMap(W,K,'up'); E.stepWorld(W,1/30); const fol=W.units.filter(u=>u.side===0&&u.alive&&u.order&&u.order.k==='exit');
  ok(!fol.length&&F.lead!==K.i&&W.units[F.lead].alive,'대형의 기준 (대장 아님) 이 먼저 나가면 따라 나서지 않고 다음 기준 ('+W.units[F.lead].name+') 이 이어받음'); }

console.log(fails?fails+' FAIL':'ALL ENG8750 OK');
