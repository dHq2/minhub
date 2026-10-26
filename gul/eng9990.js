// v9.9.9 엔진 시험 — eng9990.js v1.0 (대장 관계 두 종류: 따를이 (follow) 는 대장이 싸우면 적극 가담 · 보호받을이 (cover) 는 대장 등 뒤에 붙어 닿는 적만 그 자리에서 (창이면 어깨 너머) · 쫓아가지 않음 · 대장의 공격 지시도 받지 않음 · 정하지 않은 옛 관계는 장비로 · 대장 따라 움직임 · 돌격에 함께 버팀 · 양쪽 편)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.seenBy=1; u.noFid=true; }); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const link=(F,c,mode)=>F.forEach(s=>{ s.sqLead=c.i; s.chiefLk=true; s.sqFix=true; s.chiefMode=mode||null; });   /* 적 편도 같은 관계 (chiefSet 은 아군 단추용) */
for (const side of [0,1]){ console.log((side?'적':'우리')+' 편');
  // A. 대장이 앞의 적과 싸움 — 창 따를이 / 창 보호받을이
  const res={}; for (const mode of ['follow','cover']){ let behind=0, far=0, hit=0, n=0;
    for (let sd=1; sd<=4; sd++){ const W=WF([sw('대장',10,10,side,{shield:true}),sw('창',8.6,10,side,{weapon:'창'}),sw('적',11.3,10,1-side,{shield:true,ov:{hp:9e4,atk:1}})],sd); const [c,s,e]=W.units;
      link([s],c,mode); c.order={k:'hold'}; e.order={k:'hold'}; c.target=e; c.state='fight';
      for(let i=0;i<120;i++){ step(W); if(i>40){ n++; const ahead=((s.x-c.x)*(e.x-c.x)+(s.y-c.y)*(e.y-c.y))/(d(c,e)||1); if(ahead<0.1&&d(s,c)<c.r+s.r+0.5) behind++; if(d(s,c)>c.r+s.r+0.9) far++; } }
      hit+=W.log.filter(l=>l.k==='hit'&&l.a===s.i&&l.b===e.i).length; }
    res[mode]={behind:behind/n, far:far/n, hit}; }
  console.log('    '+JSON.stringify(res));
  ok(res.cover.behind>0.7,'보호받을이는 대장 등 뒤에 붙어 있음 ('+(res.cover.behind*100).toFixed(0)+'%)'); ok(res.cover.hit>0,'보호받을이 창은 등 뒤에서 닿는 적을 찌름 ('+res.cover.hit+')');
  ok(res.follow.far>res.cover.far+0.2||res.follow.behind<res.cover.behind-0.3,'따를이는 앞으로 나가 적극 가담 (대장 곁을 벗어남 '+(res.follow.far*100).toFixed(0)+'% · 보호받을이 '+(res.cover.far*100).toFixed(0)+'%)');
  // B. 대장이 움직이면 함께 · 보호받을이는 등 뒤
  { const W=WF([sw('대장',8,10,side),sw('뒤',6.5,10,side,{weapon:'창'}),sw('먼 적',36,3,1-side)]); const [c,s,e0]=W.units; e0.order={k:'hold'}; link([s],c,'cover'); c.order={k:'move',x:18,y:10}; step(W,300);
    ok(d(s,c)<c.r+s.r+0.6&&((s.x-c.x)*Math.cos(c.face||0)+(s.y-c.y)*Math.sin(c.face||0))<0,'대장 곁 · 등 뒤 (바라보는 반대쪽) 에 붙음 ('+d(s,c).toFixed(2)+' · 대장 x '+c.x.toFixed(1)+' · 뒤 x '+s.x.toFixed(1)+' · 대장 얼굴 '+(c.face||0).toFixed(2)+')'); }
  // C. 종류를 정하지 않은 옛 관계는 장비로
  { const W=WF([sw('대장',8,10,side),sw('맨손 치유',6.5,10,side,{cls:'치유',weapon:'맨손'}),sw('검',6.5,11,side)]); const [c,h,g]=W.units; link([h,g],c);
    ok(E.coverU(h)&&!E.coverU(g),'정하지 않으면 장비로 (맨손 치유 = 보호받을이 · 검 = 따를이)'); link([h],c,'follow'); ok(!E.coverU(h),'정하면 그대로 (치유도 따를이로)'); if (!side){ E.chiefSet(W,[h],c,'follow'); ok(!h.chiefLk,'같은 대장 · 같은 종류를 다시 누르면 풀림 (단추)'); } }
  // D. 돌격이 대장에게 오면 보호받을이도 등 뒤를 받침
  { let br=0; for (let sd=1; sd<=3; sd++){ const W=WF([sw('대장',10,10,side,{shield:true}),sw('뒤',8.4,10.6,side,{cls:'치유',weapon:'맨손'}),mk({...REB,name:'돌격자',shield:true,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},weight:140},1-side,16,10)],sd); const [c,h,e]=W.units;
      link([h],c,'cover'); c.order={k:'hold'}; e.order=null; E.startCharge(W,e,c,null); for(let i=0;i<60;i++){ step(W); if(h.why==='BRACE_CHARGE') { br++; break; } } }
    ok(br>=2,'돌격이 대장에게 오면 보호받을이도 등 뒤를 받침 ('+br+'/3)'); }
}
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
