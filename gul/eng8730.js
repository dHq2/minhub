// v8.7.3 시험 — eng8730.js v1.8 (v1.8: 사수는 동료에게 둘러싸인 표적만 노리다 한 발도 못 쏘지 않음 — 다른 표적의 각을 잡아 쏨 · v1.7: 이어진 휘청 · 넘어짐은 짧아짐 (1 → 0.6 → 0.2 → 버팀) · 사이가 벌어지면 다시 그대로 · v1.6: 하나뿐인 창은 코앞의 상대에게도 아낌 (끝낼 수 있을 때만 던짐) · v1.5: 기습 ×3 은 그 공격자를 몰랐을 때만 — 묶여 있어도 10초 안에 보았으면 뒤치기만 · 몰래 다가온 이는 그대로 기습 · v1.4: 미리 비켜서기는 그 일격 밖으로 나갈 수 있을 때만 — '피함' 뒤 같은 휘두르기에 맞는 일 없음 (여러 판) · 비킬 자리가 있으면 그대로 피함 · v1.3: 버팀이 하나로 — 세자르 버팀 (poise · ccRes) 은 돌격에도 (조금만 밀림) · 괴력으로 버티면 휘청 · 넘어짐 없이 '버텨 밀려남' · 돌격한 쪽 괴력은 되튕김을 막을 수 있을 때만 · v1.2: 돌격을 받쳐 준 동료는 날아온 몸을 받아 줌 (부딪힘 · 넘어짐 · 연쇄 없음) — 받쳐 주지 않은 몸과는 그대로 부딪힘 · v1.1: 공중제비 내려찍기 — 태세면 막힘 · 손이 묶였으면 (다른 적과 맞붙음) 무구로 받아 내지 못하고 맞음 ('막아도 즉사' 없음) · v1.0: 넉백 무게 — 한도도 받는 몸무게로 (140kg 과 40kg 이 같은 휘두르기에 다르게) · 던진 도끼는 도끼 무게 (던진 이 1100kg 이 아님) · 날아와 부딪힌 몸은 그 몸 무게 · 산탄 · 흙덩이 · 뿌리는 쏜 이의 몸무게와 상관없음 · 보통 몸 (80kg) 은 예전 그대로)
const {E,R,DES,KAR,GOB,REB,NOR,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const lit=W=>{ W.amb=1; E.computeLight(W); };
const old=(a,t,p)=>Math.min(p*1.6,p*Math.max(0.12,Math.pow(a/Math.max(30,t),0.6)));   // v8.7.2 식 (한도 1.6 고정)
const dummy=(name,mass,x,y,side)=>{ const u=mk({...REB,name,ov:{hp:9000,atk:20}},side,x,y); return u; };
// 1) 같은 휘두르기 (카리우스 300kg · 힘 0.8) — 40kg 은 멀리 · 140kg 은 덜 · 80kg 은 예전 그대로
{ const W=W_([mk(KAR,0,5,8)],[dummy('가벼운 몸',40,10,4,1),dummy('무거운 몸',140,10,8,1),dummy('보통 몸',80,10,12,1)],1,'hold'); lit(W); const [k,a,b,c]=W.units; a.mass=40; b.mass=140; c.mass=80; for (const u of [a,b,c]){ u.poise=1; u.line=null; }
  const la=E.kbLen(W,k,a,0.8), lb=E.kbLen(W,k,b,0.8), lc=E.kbLen(W,k,c,0.8);
  console.log('      300kg 휘두르기 → 40kg',la.toFixed(2),'· 140kg',lb.toFixed(2),'· 80kg',lc.toFixed(2),'(예전',old(300,40,0.8).toFixed(2),old(300,140,0.8).toFixed(2),old(300,80,0.8).toFixed(2)+')');
  ok(la>lb*1.4,'가벼운 몸 (40kg) 이 무거운 몸 (140kg) 보다 1.4배 넘게 멀리 ('+la.toFixed(2)+' · '+lb.toFixed(2)+')');
  ok(Math.abs(lc-old(300,80,0.8))<0.01,'보통 몸 (80kg) 은 예전 그대로 ('+lc.toFixed(2)+')');
  const lh=E.kbLen(W,{mass:62},b,0.8); ok(Math.abs(lh-old(62,140,0.8))<0.01,'가벼운 쪽이 무거운 몸을 칠 땐 (한도에 닿지 않음) 예전 그대로 ('+lh.toFixed(2)+')');
  // 실제 휘두르기 (넓게 휘두르기 shove) — 기록의 길이도 같은 차이
  E.shove(W,k,a,0.8,1,0,{how:'sweep'}); E.shove(W,k,b,0.8,1,0,{how:'sweep'}); const L=W.log.filter(l=>l.k==='shove');
  console.log('      기록',JSON.stringify(L.map(l=>[W.units[l.b].mass,l.len])));
  ok(L.length===2&&L[0].len>L[1].len*1.4,'휘둘러 날려 보냄 기록도 40kg 이 멀리'); }
// 2) 던진 도끼: 던진 이 (1100kg) 가 아니라 도끼 무게 · 기록에 도끼 이름 · 무엇에 밀렸나
{ const H={ref:'C-158',name:'호레이쇼',tier:4,cls:'근접',weapon:'대장군의 도끼',height:5,weight:1100,ov:{hp:9000,atk:30},traits:['거구']};
  const W=W_([dummy('탕아',82,10,8,0)],[mk(H,1,4,8)],1,'hold'); lit(W); const [t,h]=W.units; t.mass=82; t.poise=1; t.stunT=1e9; t.guardMode='off'; t.raised=false; h.mass=1100;
  W.spins=[{ by:h.i, side:1, x:h.x+1.5, y:8, dx:1, dy:0, v:13, left:9, w:0.55, mul:1.8, kb:0.6, hit:[], it:{ name:'대장군의 도끼', label:'대장군의 도끼' }, t0:W.t }];
  for (let i=0;i<30&&W.spins.length;i++) E.stepSpins(W,1/30);
  const s=W.log.find(l=>l.k==='shove'&&l.b===t.i); console.log('      도끼',JSON.stringify(s));
  ok(s&&s.am>=100&&s.am<=150&&s.wn==='대장군의 도끼'&&s.tag==='도끼에 쓸려 나감','던진 도끼의 무게 = 도끼 ('+(s&&s.am)+'kg · '+(s&&s.wn)+') — 던진 이 1100kg 이 아님');
  ok(s&&s.len<old(1100,82,0.6)-0.1,'밀린 거리도 도끼 무게로 ('+(s&&s.len)+' < 예전 '+old(1100,82,0.6).toFixed(2)+')'); }
// 3) 날아와 부딪힌 몸: 처음 친 이 (딱정벌레 40kg) 가 아니라 날아온 몸 (간두 85kg) 의 무게
{ const W=W_([dummy('간두',85,10,8,0),dummy('청광묵',38,11.2,8,0)],[mk(GOB,1,9,8)],1,'hold'); lit(W); const [g,q,b]=W.units; g.mass=85; q.mass=38; b.mass=40; for (const u of [g,q]){ u.poise=1; u.line=null; }
  E.fling(W,b,g,1.6,1,0,{how:'charge',p:1.2}); for (let i=0;i<20&&g.kb;i++) E.stepWorld(W,1/30);
  const s=W.log.find(l=>l.k==='shove'&&l.how==='bowl'&&l.b===q.i); console.log('      볼링',JSON.stringify(s));
  ok(s&&s.am===85&&s.via===g.i&&s.a===b.i,'부딪혀 밀려남: 날아온 간두 85kg (기록 via · am) — 공은 처음 친 딱정벌레에게'); }
// 4) 산탄 · 흙덩이 · 뿌리: 쏜 이의 몸무게와 상관없음 (정한 무게 · 받은 몸만)
{ const W=W_([dummy('가벼운 사수',40,5,8,0),dummy('무거운 사수',300,5,4,0)],[dummy('과녁',60,9,8,1),dummy('과녁2',60,9,4,1)],1,'hold'); lit(W); const [s1,s2,t1,t2]=W.units; s1.mass=40; s2.mass=300; t1.mass=t2.mass=60; t1.poise=t2.poise=1;
  const r1=E.shove(W,s1,t1,1,1,0,{tag:'샷건에 날아감',mass:80,fix:true}), r2=E.shove(W,s2,t2,1,1,0,{tag:'샷건에 날아감',mass:80,fix:true}); const L=W.log.filter(l=>l.k==='shove');
  console.log('      산탄',JSON.stringify(L.map(l=>[W.units[l.a].mass,l.len,l.fix])));
  ok(L.length===2&&L[0].len===L[1].len&&L.every(l=>l.fix&&l.tag==='샷건에 날아감'),'샷건에 날아감: 40kg 사수 · 300kg 사수가 같은 거리 (쏜 이의 몸무게가 아님)');
  const src=require('fs').readFileSync(process.env.RT3||'./rt3.js','utf8'); ok(src.includes("{ tag: '흙덩이에 밀림', mass: (W.rules.shove || {}).proj || 80, fix: true }")&&src.includes("{ tag: '뿌리에 밀려남', mass: (W.rules.shove || {}).proj || 80, fix: true }"),'흙덩이 · 뿌리도 정한 무게 (쏜 이 · 부른 이의 몸무게가 아님)'); }
// 5) 버팀 (poise) 은 한도에도 걸림 — 세자르 (70kg × 6) 는 무거운 몸처럼
{ const W=W_([mk(KAR,0,5,8)],[dummy('세자르',70,10,8,1)],1,'hold'); lit(W); const [k,c]=W.units; c.mass=70; c.poise=6; c.line=null;
  const l=E.kbLen(W,k,c,1.6); console.log('      세자르',l.toFixed(2)); ok(l<1.6*1.6*0.75,'버팀 ×6 은 무거운 몸처럼 덜 밀림 ('+l.toFixed(2)+')'); }
// 6) 공중제비 내려찍기: 태세 (마주 보고 손이 비었음) 면 막힘 (피해 0) · 다른 적과 맞붙어 손이 묶였으면 받아 내지 못하고 맞음 (×0.5 '막힘' 으로 죽지 않음)
{ const DAG={...REB,name:'단검병',shield:false,weapon:'단검',traits:[],gear:{},ov:{hp:9000,atk:10}}, TG={...REB,name:'탕아',shield:false,weapon:'장검',traits:[],gear:{},ov:{hp:9000,atk:40}};
  const res={}; for (const busy of [false,true]){ const W=W_([mk(TG,0,8,10),mk({...REB,name:'동료',ov:{hp:9000}},0,9,11.2)],[mk(DAG,1,9.1,10)],1,'hold'); lit(W); const [u,m,e]=W.units; e.face=Math.PI; e.raised=true; e.raiseAt=-9; e.canGuard=true; e.act=null; e.target=busy?m:null;
    const hp0=e.hp; W.log.length=0; E.slamHit(W,u,{fx:5,fy:10,tx:8,ty:10}); const h=W.log.find(l=>l.k==='hit'&&l.b===e.i);
    res[busy?'busy':'set']={ held: W.log.some(l=>l.k==='slamHeld'), dmg: Math.round(hp0-e.hp), block: !!(h&&h.block), parry: !!(h&&h.parry) }; }
  console.log('      내려찍기',JSON.stringify(res));
  ok(res.set.held&&res.set.dmg===0,'태세 (단검 · 마주 봄 · 손이 빔) 면 막힘 — 피해 0');
  ok(!res.busy.held&&res.busy.dmg>0&&!res.busy.block,'다른 적과 맞붙어 손이 묶였으면 받아 내지 못하고 맞음 (막힘 ×0.5 아님)'); }
// 7) 돌격 버팀: 바로 뒤 동료가 받쳐 주면 (무게를 더해 덜 밀림) 날아온 몸을 받아 줌 — 둘 다 다치는 부딪힘 · 넘어짐 · 연쇄가 없음
{ const BEAST={ref:'C-076',name:'바위껍질 짐승',tier:2,cls:'근접',weapon:'맨손',weight:140,height:1.9,ov:{hp:9000,atk:40},traits:[]}, MAN=(nm)=>({...REB,name:nm,shield:false,weapon:'장검',traits:[],gear:{},ov:{hp:9000,atk:20}});
  const out={}; for (const backed of [true,false]){ const W=W_([mk(MAN('탕아'),0,10,8),mk(MAN('트라카'),0,backed?11.0:13.5,8)],[mk(BEAST,1,6,8)],1,'hold'); lit(W); const [t,b,k]=W.units; for (const u of [t,b]){ u.guardMode='off'; u.raised=false; u.canGuard=false; u.order={k:'hold'}; u.mass=82; u.poise=1; } k.mass=140; t.face=Math.PI; b.face=Math.PI;
    const hb=b.hp, ht=t.hp; W.log.length=0; E.startCharge(W,k,t); for (let i=0;i<60;i++){ E.stepWorld(W,1/30); if (W.log.some(l=>l.k==='impact')&&!t.kb&&i>10) break; }
    const im=W.log.find(l=>l.k==='impact'), sh=W.log.find(l=>l.k==='shove'&&l.b===t.i);
    out[backed?'backed':'open']={ braced: !!(im&&im.braced), caught: W.log.some(l=>l.k==='caught'&&l.a===b.i&&l.b===t.i), bowl: W.log.some(l=>l.k==='bowl'&&l.b===t.i&&l.c===b.i), bHurt: Math.round(hb-b.hp), down: W.t<(t.proneT||-9), len: sh&&sh.len }; }
  console.log('      받쳐 줌',JSON.stringify(out));
  ok(out.backed.braced&&out.backed.caught&&!out.backed.bowl&&out.backed.bHurt===0&&!out.backed.down,'뒤 동료가 받쳐 주면 날아온 몸을 받아 줌 — 부딪힘 피해 없음 · 넘어지지 않음');
  ok(!out.open.braced&&!out.open.caught,'받쳐 주지 않은 (멀리 선) 동료는 받아 주지 않음 (예전 규칙 그대로)'); }
// 8) 버팀이 하나로
{ const MAN=(nm,w,ex)=>({...REB,name:nm,shield:false,weapon:'장검',traits:[],gear:{},weight:w,ov:{hp:9000,atk:30},...(ex||{})});
  const charge=(att,tgt,setup)=>{ const W=W_([mk(tgt,0,10,8)],[mk(att,1,5.5,8)],1,'hold'); lit(W); const [t,k]=W.units; t.guardMode='off'; t.raised=false; t.canGuard=false; t.order={k:'hold'}; t.face=Math.PI; if (setup) setup(W,t,k);
    W.log.length=0; E.startCharge(W,k,t); let imp=-1; for (let i=0;i<90;i++){ E.stepWorld(W,1/30); if (imp<0&&W.log.some(l=>l.k==='impact')) imp=i; if (imp>=0&&i>imp+25) break; } return { W, t, k }; };
  // (a) 세자르: 무게 70 · 버팀 ×6 · [버팀] 0.85 — 82kg 이 전력으로 들이받아도 조금만 밀림 (휘청을 버틴 그 순간 1.65칸 날아가던 것)
  { const { W, t } = charge(MAN('탕아',82), MAN('세자르',70), (W,t)=>{ t.mass=70; t.poise=6; t.ccRes=0.85; });
    const sh=W.log.find(l=>l.k==='shove'&&l.b===t.i), im=W.log.find(l=>l.k==='impact'); console.log('      세자르',JSON.stringify({vr:im&&im.vr,len:sh&&sh.len,shrug:W.log.some(l=>l.k==='ccRes'&&l.b===t.i)}));
    ok(im&&(!sh||sh.len<0.5),'세자르 (버팀 ×6 · [버팀]) 는 돌격에 조금만 밀림 ('+(sh?sh.len:0)+'칸)'); }
  // (b) 괴력으로 버팀 (카리우스) — 휘청 · 넘어짐 없음 · 기록 '버텨 밀려남'
  { const { W, t } = charge(MAN('검방패기사',140,{shield:true}), MAN('카리우스',300), (W,t,k)=>{ t.mass=300; t.might=1.7; t.mightCd=-9; k.mass=140; });
    const mg=W.log.find(l=>l.k==='might'&&l.a===t.i), st=W.log.find(l=>l.k==='stun'&&l.b===t.i), sh=W.log.find(l=>l.k==='shove'&&l.b===t.i), im=W.log.find(l=>l.k==='impact');
    console.log('      괴력 버팀',JSON.stringify({how:mg&&mg.how,stun:!!st,len:sh&&sh.len,mt:sh&&sh.mt,imMt:im&&im.mt,down:W.t<(t.proneT||-9)}));
    ok(mg&&!st&&(!sh||sh.mt)&&!(W.t<(t.proneT||-9))&&im&&im.mt,'괴력으로 버티면 그 일격에 휘청 · 넘어짐 없음 (밀림은 \'버텨 밀려남\')'); }
  // (c) 돌격한 쪽 괴력: 막을 수 있으면 씀 (되튕김 없음) · 1100kg 앞에선 쓰지 않음 (튕겨 나감만)
  for (const [w,exp] of [[250,true],[1100,false]]){ const { W, k } = charge(MAN('호레이쇼',w), MAN('모닝스타',62), (W,t,k)=>{ t.mass=w; t.might=1; k.mass=62; k.might=1.7; k.mightCd=-9; });
    const mg=W.log.find(l=>l.k==='might'&&l.a===k.i&&l.how==='ram'), rc=W.log.find(l=>l.k==='shove'&&l.b===k.i&&l.how==='recoil');
    console.log('      괴력 밀어붙임 '+w+'kg',JSON.stringify({ram:!!mg,recoil:rc&&rc.len}));
    ok(exp?(mg&&!rc):(!mg&&rc),w+'kg: '+(exp?'괴력으로 밀어붙여 되튕기지 않음':'괴력을 쓰지 않고 그대로 튕겨 나감 (\'되튕기지 않고\' 뒤에 튕기지 않음)')); } }
// 9) 미리 비켜서기 (넓게 휘두르기): '피함' 이라 적고 0.2초 뒤 같은 휘두르기에 맞는 일이 없음 · 닿는 거리 밖으로 나갈 수 있으면 피함
{ const BIG={...KAR,name:'거한',ov:{hp:9000,atk:40,rng:1.4}}, JEL=(nm)=>({...REB,name:nm,shield:false,weapon:'맨손',traits:[],gear:{},ov:{hp:9000,atk:5}});
  let bad=0, dodged=0, clean=0; for (let seed=1; seed<=40; seed++){ const near=seed%2===0;
    const W=W_([mk(BIG,0,8,8)],[mk(JEL('젤리1'),1,near?9.9:10.6,8),mk(JEL('젤리2'),1,near?9.6:10.3,9.2)],seed,'hold'); lit(W); W.rules.dodge={...(W.rules.dodge||{}),p:5,cd:0};
    const [k,a,b]=W.units; for (const u of [a,b]){ u.guardMode='off'; u.canGuard=false; u.raised=false; u.order={k:'hold'}; u.face=Math.PI; u.dodgeCd=-9; } k.face=0; k.order={k:'hold'};
    if (near){ a.x=k.x+k.r+a.r+0.15; a.y=8; b.x=k.x+(k.r+b.r+0.3)*Math.cos(0.5); b.y=8+(k.r+b.r+0.3)*Math.sin(0.5); }   // 0.6칸 비켜서도 휘두름 안 (가까움) · 멀면 밖으로 나감
    k.act={ k:'atk', phase:'wind', b:a.i, t0:W.t, end:W.t+0.45, mode:'sweep' }; W.log.length=0;
    for (let i=0;i<24;i++) E.stepWorld(W,1/30);
    for (const x of [a,b]){ const dg=W.log.find(l=>l.k==='dodge'&&l.a===x.i&&l.b===k.i), hit=W.log.find(l=>l.k==='hit'&&l.a===k.i&&l.b===x.i); if (dg){ dodged++; if (hit) bad++; else clean++; } } }
  console.log('      미리 비켜섬',JSON.stringify({dodged,clean,bad}));
  ok(bad===0,'\'피함\' 뒤 같은 휘두르기에 맞는 일 없음 ('+bad+'번)'); ok(clean>0,'닿는 거리 밖으로 나갈 수 있으면 그대로 피함 ('+clean+'번)'); }
// 10) 기습 (알아차리지 못함 ×3): 앞의 적과 맞붙어 등 뒤를 못 봐도, 그 공격자를 10초 안에 보았으면 기습이 아님 (뒤치기 ×1.5) · 몰래 다가온 이는 그대로 기습
{ const BOSS={...REB,name:'호레이쇼',shield:false,weapon:'장검',traits:[],gear:{},ov:{hp:9000,atk:30}}, KN2={...REB,name:'카리우스',shield:false,weapon:'장검',traits:[],gear:{},ov:{hp:9000,atk:30}};
  const res={}; for (const knew of [true,false]){ const W=W_([mk(KN2,0,8,8),mk({...KN2,name:'모닝스타'},0,11.2,8)],[mk(BOSS,1,10,8)],1,'hold'); lit(W); const [k,m,h]=W.units; h.face=0; h.act={k:'atk',phase:'wind',b:m.i,t0:W.t,end:W.t+0.4}; h.guardMode='off'; h.raised=false;
    h.sense[k.i]=knew?{x:k.x,y:k.y,t:W.t-2,exact:true,sight:true}:undefined; const o=E.strike(W,k,h,h,1,false,{}); res[knew?'knew':'sneak']=!!(o&&o.ambush); }
  console.log('      기습',JSON.stringify(res));
  ok(!res.knew,'맞붙은 보스가 2초 전에 본 상대의 뒤치기는 기습 (×3) 이 아님');
  ok(res.sneak,'한 번도 못 본 상대가 등 뒤로 들어오면 그대로 기습'); }
// 11) 하나뿐인 창: 코앞의 상대 (나를 칠 수 있는 거리) 에게 던지고 맨손이 되지 않음 — 다 죽어 가 끝낼 수 있으면 던짐
{ const SP={...DES['창병'],ov:{hp:9000,atk:34}}, FOE=(hp)=>({...REB,name:'모닝스타',shield:false,weapon:'모닝스타',traits:[],gear:{},ov:{hp,atk:20}});
  const res={}; for (const fin of [false,true]){ const W=W_([mk(FOE(fin?20:9000),0,fin?11.0:11.6,8)],[mk(SP,1,8,8)],1,'hold');   /* 코앞 = 철퇴가 닿는 거리 (사거리 + 1.2) 안 · 맞붙음 (압박) 거리 밖 — 기록의 그 자리 */ lit(W); const [m,s]=W.units; s.javAuto=true; s.spearHeld=true; s.act=null; s.face=0; s.seenBy=1; m.canGuard=false; m.raised=false; m.guardMode='off'; m.act={k:'atk',phase:'wind',b:s.i,t0:W.t,end:W.t+0.6}; if (fin){ m.hp=20; (W.intel||(W.intel=[{},{}]))[1][m.i]={ seenT:W.t, last:W.t, tags:[], dmg:95, dealt:0, kills:0, heals:0, shouts:0, shots:0, guess:100 }; }   // 철퇴 (사거리 2.3) — 나를 칠 수 있는 거리 · fin 은 다 죽어 가는 걸 앎
    W.log.length=0; const thrown=E.tryThrow(W,s,null,false,0); const hold=W.log.find(l=>l.k==='javHold'); res[fin?'fin':'near']={ thrown: !!thrown, hold: hold&&hold.why }; }
  console.log('      창',JSON.stringify(res));
  ok(!res.near.thrown&&/코앞/.test(res.near.hold||''),'코앞의 상대에게 하나뿐인 창을 던지지 않음 ("'+(res.near.hold||'')+'")');
  ok(res.fin.thrown,'끝낼 수 있으면 (다 죽어 감) 던짐'); }
// 12) 이어진 휘청 · 넘어짐: 풀린 지 0.8초 안에 또 걸리면 짧아짐 — 여럿이 번갈아 묶어 한 번도 못 치게 하지 않음 (양쪽 같음)
{ const MAN=(nm)=>({...REB,name:nm,shield:false,weapon:'장검',traits:[],gear:{},ov:{hp:9000,atk:20}});
  const W=W_([mk(MAN('모닝스타'),0,6,8),mk(MAN('카리우스'),0,6,10)],[mk(MAN('곤봉적'),1,9,8)],1,'hold'); lit(W); const [m,k,g]=W.units; g.vet=false;
  const adv=sec=>{ const end=W.t+sec; while(W.t<end) E.stepWorld(W,1/30); };
  const s1=E.stun(W,g,0.5,m.i); adv(0.6); const s2=E.stun(W,g,1.0,k.i); adv(0.3); E.knockDown(W,g,1.0,m.i,'시험'); const p3=W.log.filter(l=>l.k==='prone'&&l.b===g.i).pop(); adv((p3?p3.sec:0)+0.2); const s4=E.stun(W,g,0.5,k.i), shrug=W.log.some(l=>l.k==='ccRes'&&l.b===g.i&&l.what==='chain');
  adv(2.0); const s5=E.stun(W,g,0.5,m.i);
  console.log('      이어진 휘청',JSON.stringify({s1,s2:+s2.toFixed(2),p3:p3&&p3.sec,s4,shrug,s5}));
  ok(s1===0.5&&Math.abs(s2-0.6)<0.01&&p3&&Math.abs(p3.sec-0.2)<0.06,'이어진 휘청 · 넘어짐은 짧아짐 (0.5 → 1.0×0.6 → 넘어짐 1.0×0.2)');
  ok(s4===0&&shrug,'그다음은 버팀 — \'연달아 묶이지 않음\'');
  ok(s5===0.5,'사이가 벌어지면 (2초 쉼) 다시 그대로 ('+s5+'초)'); }
// 13) 사수: 표적이 동료 넷에게 둘러싸여 어디서도 사선이 막히면, 가까운 다른 표적의 각을 잡아 쏨 (노먼이 맵 6 내내 한 발도 못 쏘던 것)
{ const MAN=(nm)=>({...REB,name:nm,shield:false,weapon:'장검',traits:[],gear:{},ov:{hp:9000,atk:3}}), BEAST=(nm)=>({ref:'C-076',name:nm,tier:2,cls:'근접',weapon:'맨손',weight:140,height:1.9,ov:{hp:9000,atk:3},traits:[]});
  const res={}; for (const seed of [1,2,3]){ const W=W_([mk({...NOR,ov:{hp:9000}},0,8,8),mk(MAN('탕아'),0,13.1,8),mk(MAN('가윤'),0,14,7.1),mk(MAN('모닝스타'),0,14,8.9),mk(MAN('카리우스'),0,14.9,8)],[mk(BEAST('바위껍질 짐승'),1,14,8),mk(BEAST('젤리 괴물'),1,13,13.5)],seed); lit(W);
    for (let cy=10; cy<=15; cy++) W.map.t[cy*W.map.W+11]=1; lit(W);   // 바위벽: 지금 자리에선 다른 표적 (젤리) 이 안 보임 — 움직여야 각이 남
    const [n,a,b,c,d,x,y]=W.units; for (const m of [a,b,c,d]){ m.order={k:'attack',b:x.i}; } x.order={k:'hold'}; y.order={k:'hold'}; n.order=null; for (const u of W.units) u.seenBy=1;
    for (let i=0;i<30*8;i++){ y.stunT=W.t+1; y.x=13; y.y=13.5; E.stepWorld(W,1/30); }   // 젤리는 바위 너머 그 자리 (움직여 보이게 되지 않음)
    const shots=W.log.filter(l=>(l.k==='wind'||l.k==='shot'||l.k==='fire')&&l.a===n.i).length, hits=W.log.filter(l=>l.k==='hit'&&l.a===n.i&&l.b===y.i).length, alt=W.log.filter(l=>l.k==='altAim'&&l.a===n.i).length, ff=W.log.filter(l=>l.k==='hit'&&l.a===n.i&&l.ff).length;
    res[seed]={shots,hits,alt,ff}; }
  console.log('      사수',JSON.stringify(res));
  ok(Object.values(res).filter(r=>r.hits>0&&r.alt>0).length>=2,'둘러싸인 표적의 사선이 막히면 바위 너머 다른 표적의 각을 잡아 맞힘 (세 판 중 둘 넘게 — 옛 엔진은 0)'); }
console.log(fails?'FAILS '+fails:'ALL ENG8730 OK'); process.exit(fails?1:0);
