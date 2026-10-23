// v8.8.1 엔진 시험 — eng8810.js v1.0 (진형 폐기: 수치표 fbuf.on 기본 0 → 진형 버프 없음 · 켜면 되살아남 · 대형은 페이지가 넘길 때만 → 안 넘기면 아군은 각자)
const {E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec)=>{ const end=W.t+sec; while(W.t<end&&!W.over) E.stepWorld(W,1/30); };
const FAR=()=>mk({...DES['창병'],ov:{hp:9999}},1,58.5,1.5,{spdMul:0});
const party=(x,y)=>[mk(KAR,0,x,y),mk(REB,0,x-1,y-1),mk(INJ,0,x-1,y+1,{hero:true}),mk(GOB,0,x-2,y),mk(NOR,0,x-3,y-1)];
const WF=(form,on)=>{ const R2=JSON.parse(JSON.stringify(R)); if(on!=null) R2.fbuf.on=on; const W=E.createWorld({type:'grid',W:60,H:20,seed:7,units:[...party(10,10),FAR()],torches:[{x:20,y:10,r:60}],flips:[],...(form?{form}:{})},R2,1,{headless:true}); E.computeLight(W); W.units[W.units.length-1].order={k:'hold'}; return W; };
console.log('A. 수치표');
ok(R.fbuf&&R.fbuf.on===0,'기본 수치표: fbuf.on = 0 (진형 버프 꺼짐)');
console.log('B. 대형을 안 넘기면 — 각자');
{ const W=WF(null); for (const u of W.units) if (u.side===0) u.order={k:'move',x:30,y:10}; run(W,6); ok(W.form===undefined,'W.form 없음 (대형 꺼짐)');
  ok(W.units.filter(u=>u.side===0).every(u=>!u.fb),'진형 버프 없음'); ok(!W.log.some(l=>l.k==='formForm'||l.k==='formWait'||l.k==='fbOn'),'대형 기록 없음 (갖춤 · 기다림 · 진형)'); }
console.log('C. 대형을 넘겨도 fbuf.on = 0 이면 진형 버프만 없음 / 1 이면 되살아남 (엔진 코드는 남김)');
{ const W0=WF({A:{shape:'일자'}},0); W0.units.filter(u=>u.side===0).forEach(u=>u.order={k:'move',x:14,y:10}); run(W0,10);
  const W1=WF({A:{shape:'일자'}},1); W1.units.filter(u=>u.side===0).forEach(u=>u.order={k:'move',x:14,y:10}); run(W1,10);
  const n0=W0.units.filter(u=>u.side===0&&u.fb).length, n1=W1.units.filter(u=>u.side===0&&u.fb).length; console.log('    진형 버프 받은 수', 'on=0:',n0,'on=1:',n1);
  ok(n0===0,'fbuf.on = 0 → 진형 버프 0'); ok(n1>0,'fbuf.on = 1 → 일자 진형 버프 되살아남'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
