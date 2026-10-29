// v9.14.0 엔진 시험 — eng10050.js v1.0 (역장이 방패병과 함께 돎 · 펼친 동안 천천히 돎 · 방패병이 쓰러지면 꺼짐 · 역장 치기 명령으로 깎임 · 방패 파동이 앞을 밀어냄 · 밀치기 돌진 · 암습은 순간이동 없음 · 암습은 등 · 옆으로 · 다른 적과 싸우느라 못 본 암습은 즉사 확률 · 돌격: 무기 먼저 · 관성으로 몸도 · 양쪽 편)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const SH=(side,x,y)=>mk({...REB,name:'암계 방패병',weapon:'장검',shield:true,shSize:'대형',height:2.1,weight:170,sizeCls:'중대형',ov:{hp:9e4,atk:38},traits:['베테랑'],active:['암계 역장','방패 파동'],gear:{}},side,x,y);
const SP=(side,x,y)=>mk({...REB,name:'창방패병',weapon:'창',shield:true,height:2.0,weight:150,sizeCls:'중대형',ov:{hp:9e4,atk:30},traits:['베테랑'],active:['밀치기 돌진'],gear:{}},side,x,y);
const HK=(side,x,y)=>mk({...REB,name:'헌팅나이프',cls:'기동',role:'미드필더',weapon:'단검',shield:false,height:2.0,weight:85,ov:{hp:9e4,atk:44,spd:3.6},traits:['베테랑','은신B'],active:['암습'],gear:{}},side,x,y);
const sw=(n,side,x,y,ex)=>mk({...REB,name:n,shield:false,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.noFid=true; u.seenBy=1; }); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
for (const side of [0,1]){ console.log((side?'적':'우리')+' 편');
  // A 역장: 따라 돎 · 천천히 돎 · 깎임 · 쓰러지면 꺼짐
  { const W=WF([SH(side,10,10),sw('적',1-side,14,10,{ov:{hp:9e4,atk:20}}),sw('친구',side,6,10)],1); const [s,e,m]=W.units; e.spdMul=0; s.spdMul=0; s.face=s.fg=0; E.supStart(W,s,'bfield',null,'시험',14,10); step(W,20);
    const F=(W.sf8||[]).find(f=>f.hard); ok(!!F&&F.follow,'역장이 섬 (방패병을 따르는 몸)');
    if (F){ const x0=F.x; s.fg=Math.PI/2; step(W,15); const turned=s.face; ok(Math.abs(F.x-(s.x+Math.cos(s.face)*(s.r+F.ahead)))<0.25,'역장이 방패병 앞에 붙어 따라 돎'); ok(turned<0.8,'펼친 동안 천천히 돎 (0.5초에 '+(turned*180/Math.PI).toFixed(0)+'° · 보통이면 90°)');
      const hp0=F.hp; e.spdMul=1; e.order={k:'fatk',f:F.id}; step(W,150); ok(F.hp<hp0-30,'역장 치기 명령 — 역장이 깎임 ('+hp0+' → '+Math.round(F.hp)+')'); ok(W.log.some(l=>l.k==='fieldHit'&&l.a===e.i),'기록: 역장을 침');
      if (W.t<F.until){ s.hp=0; s.alive=false; s.down=true; step(W,2); ok(W.t>=F.until,'방패병이 쓰러지면 역장도 꺼짐'); } else ok(true,'(이미 깨짐)'); } }
  // B 방패 파동
  { const W=WF([SH(side,10,10),sw('적1',1-side,11.0,9.7),sw('적2',1-side,11.0,10.4)],1); const [s,a,b]=W.units; [s,a,b].forEach(u=>u.spdMul=0); s.face=s.fg=0; const p0=[a.x,b.x]; E.supStart(W,s,'bwave',null,'시험'); step(W,40);
    ok(W.log.some(l=>l.k==='bwave'&&l.n===2),'방패 파동 — 앞의 둘에게 닿음'); ok(a.x-p0[0]>0.6&&b.x-p0[1]>0.6,'둘 다 밀려남 ('+(a.x-p0[0]).toFixed(1)+' · '+(b.x-p0[1]).toFixed(1)+'칸)'); ok(a.hp>a.max*0.9,'피해는 작음'); }
  // C 밀치기 돌진: 순간이동 없음
  { const W=WF([SP(side,10,10),sw('적',1-side,13.5,10)],1); const [s,e]=W.units; e.spdMul=0; s.face=s.fg=0; E.supStart(W,s,'bshove',e,'시험'); let mx=0; for(let i=0;i<60;i++){ const x0=s.x,y0=s.y; step(W); mx=Math.max(mx,Math.hypot(s.x-x0,s.y-y0)); }
    ok(W.log.some(l=>l.k==='bshove'&&l.a===s.i),'밀치기 돌진이 닿음'); ok(mx<0.4,'순간이동 없음 (한 틱 최대 '+mx.toFixed(2)+'칸)'); }
  // D 암습: 순간이동 없음 · 옆 · 뒤 · 안 들키면 즉사 확률
  { let back=0, kill=0, mxA=0, n=0; for (let sd=1; sd<=16; sd++){ const aw=sd%4===0; const W=WF([HK(side,8,10),sw('표적',1-side,13,10,{ov:{hp:9e4,atk:1}}),...(aw?[]:[sw('미끼',side,13.75,10,{ov:{hp:9e4,atk:1}})])],sd); const [h,t]=W.units; t.spdMul=0; t.face=t.fg=aw?Math.PI:0; if (!aw){ const d=W.units[2]; d.spdMul=0; t.target=d; t.state='fight'; } E.supStart(W,h,'hamb',t,'시험');
      for(let i=0;i<90;i++){ const x0=h.x,y0=h.y; step(W); mxA=Math.max(mxA,Math.hypot(h.x-x0,h.y-y0)); } const L0=W.log.find(l=>l.k==='hamb'&&l.a===h.i); if (L0){ n++; if (L0.back) back++; } if (W.log.some(l=>l.k==='hambKill')) kill++; }
    console.log(`    암습 ${n}/16 · 옆뒤 ${back} · 즉사 ${kill} (안 들킨 판 12) · 한 틱 최대 ${mxA.toFixed(2)}칸`); ok(n>=13,'암습이 닿음'); ok(mxA<0.45,'순간이동 없음'); ok(back>=10,'대부분 옆 · 뒤에서 (앞을 보고 있어도 돌아 들어감)'); ok(kill>=1&&kill<=9,'다른 적과 싸우느라 못 본 암습은 가끔 즉사'); }
  // E 돌격: 무기 먼저 · 관성으로 몸도
  { let stab=0, fol=0, body=0; for (let sd=1; sd<=12; sd++){ const W=WF([sw('돌격',side,8,10,{weapon:'창',ov:{hp:9e4,atk:20}}),sw('표적',1-side,14,10,{ov:{hp:9e4,atk:1}})],sd); const [c,t]=W.units; t.spdMul=0; E.startCharge(W,c,t); if (c.act) c.act.mode='atk'; step(W,90);
      if (W.log.some(l=>l.k==='chgStab'&&l.a===c.i)) stab++; if (W.log.some(l=>l.k==='chgFollow'&&l.a===c.i)) fol++; if (W.log.some(l=>(l.k==='charge'||l.k==='chgHit'||l.k==='ram')&&l.a===c.i)) body++; }
    console.log(`    돌격 12판: 무기 닿음 ${stab} · 관성 이어짐 ${fol}`); ok(stab>=9,'무기가 먼저 닿음'); ok(fol>=2&&fol<stab,'관성이 남으면 몸도 (늘은 아님) — '+fol+'/'+stab); }
}
console.log(fails?'FAIL '+fails:'ALL OK');
