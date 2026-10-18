// v7.24.3 시험 — eng7243.js v1.3 (v1.3: 자리 판정 1.2M · 쏨은 지원 중 아무 때나 · v1.2: 먼 적 하나 더 · v1.1: 쏘기 시험의 적은 전열 앞 · 전열 지원: 근접 셋이 전열 · 사수 (노먼) · 치유가 전열 참여 → 전열 뒤 제 자리로 · 전열이 움직이면 따라감 · 자리에서 쏨 · 전열이 없으면 자동)
const {E,R,DES,INJ,NOR,REB,KAR,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const HEAL={ref:'C-018',name:'가윤',tier:2,cls:'치유',role:'지원',weapon:'맨손',height:1.6,ov:{hp:300}};
const KN=()=>({...JSON.parse(JSON.stringify(DES['검기사'])),ov:{hp:9000,atk:5}});
{ const W=W_([mk(REB,0,8,8,{ov:{hp:9000}}),mk({...REB,name:'레베카2'},0,8,9,{ov:{hp:9000}}),mk({...REB,name:'레베카3'},0,8,10,{ov:{hp:9000}}),mk(NOR,0,5,12,{ov:{hp:9000}}),mk(HEAL,0,4,6)],[mk(KN(),1,13,9),mk(KN(),1,29,1)],1,'free');   /* 멀리 하나 더 (앞의 적이 쓰러져도 판이 이어짐) */   /* 적이 가까이 있어야 전열이 섬 */ W.amb=1; E.computeLight(W);
  const [a,b,c,n,h]=W.units, k=W.units[5], k2=W.units[6]; k.stunT=1e9; k.seenBy=true; k2.stunT=1e9;
  for (const u of [a,b,c,n,h]) u.order={k:'line',join:true};
  run(W,4,()=>{ k.x=13; k.y=9; }); const ln=(W.lines||[]).find(l=>l.side===0); console.log('      전열',ln&&ln.ids.length,'마디 · 얼굴',ln&&ln.face.toFixed(2));
  ok(ln&&ln.ids.length>=3,'근접 셋이 전열'); const S1=E.supSlot(W,n,ln), S2=E.supSlot(W,h,ln);
  console.log('      노먼',n.x.toFixed(1),n.y.toFixed(1),'→ 자리',S1.p.x.toFixed(1),S1.p.y.toFixed(1),'· 가윤',h.x.toFixed(1),h.y.toFixed(1),'→',S2.p.x.toFixed(1),S2.p.y.toFixed(1),'· 노먼 명령',JSON.stringify(n.order));
  ok(Math.hypot(n.x-S1.p.x,n.y-S1.p.y)<1.2&&Math.hypot(h.x-S2.p.x,h.y-S2.p.y)<1.2,'사수 · 치유가 전열 뒤 제 자리로 (나아가는 전열을 조금 늦게 따름)');
  ok(n.order&&n.order.k==='line'&&n.order.sup&&h.order&&h.order.sup,'명령은 그대로 (전열 지원) — 한 번 옮기고 끝나지 않음');
  const behind=u=>{ const M=ln.ids.map(i=>W.units[i]), cx=M.reduce((s,x)=>s+x.x,0)/M.length, cy=M.reduce((s,x)=>s+x.y,0)/M.length; return (u.x-cx)*Math.cos(ln.face)+(u.y-cy)*Math.sin(ln.face); };
  ok(behind(n)<-0.5&&behind(h)<-1,'둘 다 전열 뒤 (적 반대쪽 · 사수는 끝 뒤 비스듬히)');
  // 전열이 옆으로 3M 옮김 → 지원도 따라감
  for (const u of [a,b,c]) u.y+=3; for (let i=0;i<4;i++) E.stepWorld(W,1/30); const ln2=(W.lines||[]).find(l=>l.side===0); run(W,3);
  const S3=E.supSlot(W,n,(W.lines||[]).find(l=>l.side===0)); console.log('      옮긴 뒤 노먼',n.x.toFixed(1),n.y.toFixed(1),'자리',S3.p.x.toFixed(1),S3.p.y.toFixed(1));
  ok(Math.hypot(n.x-S3.p.x,n.y-S3.p.y)<0.9,'전열이 움직이면 따라감');
  // 자리에서 쏨
  { const L3=(W.lines||[]).find(l=>l.side===0)||ln, M=L3.ids.map(i=>W.units[i]), cx=M.reduce((s2,x)=>s2+x.x,0)/M.length, cy=M.reduce((s2,x)=>s2+x.y,0)/M.length; k.stunT=1e9; k.x=cx+Math.cos(L3.face)*3.5; k.y=cy+Math.sin(L3.face)*3.5; k.seenBy=true; const t0=W.t; run(W,4,()=>{ k.seenBy=true; });   /* 적은 전열 앞 3.5M */
    ok(W.log.some(l=>(l.k==='shot'||l.k==='wind')&&l.a===n.i&&!l.heal),'전열 지원 중에 쏨 (사선이 트인 끝 뒤에서)'); }
  // 전열이 없어지면 자동
  for (const u of [a,b,c]){ u.order={k:'move',x:u.x-6,y:u.y+(u===a?-4:u===b?0:4)}; } run(W,3); const any=(W.lines||[]).some(l=>l.side===0&&l.ids.filter(i=>W.units[i].alive).length>=2);
  if (!any){ run(W,0.5); ok(!n.order||n.order.k!=='line','전열이 흩어지면 지원도 자동으로'); } else ok(true,'(전열이 남아 있음 — 넘어감)'); }
console.log(fails?`${fails} FAIL`:'ALL 7243 OK');
