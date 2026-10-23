// v8.7.7 엔진 시험 — eng8770.js v1.1 (v1.1: 군기 시험 거리 — 지휘 거리 (8칸) 안에서 고름 · v1.0: 유물 고리 — 받는 피해 × · [가호:오딜] · 피 흘리는 상대 · 왕관 조각 · 횃불 · 화상 · 동상 · 뛰는 걸음 · 닳음 · 청염 · 명령 전달 + · 숨은 몸 찾기 · 일어날 때 중상 · 선봉장 [대방패])
const {E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()) break; } };
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:(o&&o.dark)?[]:[{x:20,y:10,r:60}],flips:[]},R2,o&&o.seed||1,{headless:true}); if(o&&o.dark) W.amb=0; E.computeLight(W); return W; };
const logK=(W,k)=>W.log.filter(l=>l.k===k);

console.log('A. 받는 피해 × (dmgK) · [가호:오딜] · 같은 편 오사는 그대로');
{ const W=WF([mk(INJ,0,10,10,{hero:true}),mk(GOB,1,12,10),mk(NOR,0,8,10),mk(INJ,0,6,10,{traits:[...INJ.traits,'가호:오딜'],name:'오딜 가호 시험'})]); const t=W.units[0], g=W.units[1], n=W.units[2], od=W.units[3];
  ok(t.dmgK===1&&od.dmgK===0.9,'[가호:오딜] 이 있으면 dmgK 0.9 (없으면 1)');
  t.dmgK=0.85; const h0=t.hp; E.applyDmg(W,g,t,20,{far:false,part:'몸통'}); ok(Math.abs((h0-t.hp)-17)<1e-6,'적에게 받는 피해 20 × 0.85 = '+(h0-t.hp).toFixed(1));
  const h1=t.hp; E.applyDmg(W,n,t,10,{ff:true,far:true,part:'몸통'}); ok(Math.abs((h1-t.hp)-10)<1e-6,'같은 편 오사는 그대로 10');
  const go=od.hp; E.applyDmg(W,g,od,30,{far:false,part:'몸통'}); ok(Math.abs((go-od.hp)-27)<1e-6,'[가호:오딜] 받는 피해 30 × 0.9 = '+(go-od.hp).toFixed(1)); }

console.log('B. 피 흘리는 상대에게 × (bleedK — 각혈의 핏방울)');
{ const W=WF([mk(INJ,0,10,10,{hero:true}),mk(GOB,1,12,10,{ov:{hp:999,atk:27}})]); const a=W.units[0], t=W.units[1]; a.bleedK=1.15;
  let h=t.hp; E.applyDmg(W,a,t,20,{far:false,part:'몸통'}); const d0=h-t.hp; t.bleed={dps:1,until:W.t+5,by:a.i}; h=t.hp; E.applyDmg(W,a,t,20,{far:false,part:'몸통'}); const d1=h-t.hp;
  ok(Math.abs(d0-20)<1e-6&&Math.abs(d1-23)<1e-6,'피를 흘리지 않으면 20 · 흘리면 23 ('+d0+' → '+d1.toFixed(1)+')'); }

console.log('C. 왕관 조각 (W.crown — 치명타를 체력 1 로 · 편마다 n 번 · 출혈 · 화상으론 안 버팀)');
{ const W=WF([mk(INJ,0,10,10,{hero:true}),mk(GOB,1,12,10),mk(NOR,0,8,10)]); const t=W.units[0], g=W.units[1], n=W.units[2]; W.crown={0:1};
  t.hp=30; E.applyDmg(W,g,t,50,{far:false,part:'몸통'}); ok(t.alive&&Math.round(t.hp)===1&&logK(W,'crownSave').length===1&&W.crown[0]===0,'처음 치명타 → 체력 1 로 버팀 · 기록 crownSave · 남은 0');
  E.applyDmg(W,g,t,50,{far:false,part:'몸통'}); ok(!t.alive||t.hp<=0,'두 번째 치명타는 못 버팀');
  W.crown={0:1}; n.hp=5; E.applyDmg(W,g,n,20,{far:false,part:null,tag:'출혈'}); ok(!n.alive||n.hp<=0,'출혈로 숨이 다할 땐 안 버팀');
  const W2=WF([mk(INJ,0,10,10,{hero:true}),mk(GOB,1,12,10)]); W2.crown={0:1}; const g2=W2.units[1]; g2.hp=10; E.applyDmg(W2,W2.units[0],g2,40,{far:false,part:'몸통'}); ok(!g2.alive||g2.hp<=0,'적 편엔 왕관이 없음 (편마다 따로)'); }

console.log('D. 여신의 눈물 — 횃불 × (torchK)');
{ const sum=k=>{ const W=WF([mk(INJ,0,20,10,{hero:true})],{dark:true}); if(k) W.torchK=k; E.computeLight(W); let s=0,n=0; for(const v of W.light){ s+=v; if(v>0.2) n++; } return {s,n}; };
  const a=sum(0), b=sum(1.3); ok(b.n>a.n*1.4&&b.s>a.s*1.3,'횃불이 더 밝음: 밝은 칸 '+a.n+' → '+b.n+' (×1.3 반경)');
  const W=WF([mk(INJ,0,20,10,{hero:true}),mk(GOB,1,30,10)],{dark:true}); W.units[1].torch=true; W.torchK=1.3; const L=E.lightSources?E.lightSources(W):null; ok(!L||L.every(s=>s.r===W.rules.heroLight*(s.x===20?1.3:1)),'적의 횃불은 그대로 (아군만)'); }

console.log('E. 비늘조각 — 화상 · 동상 반으로 (fireRes · frostRes)');
{ const W=WF([mk(INJ,0,10,10,{hero:true}),mk(GOB,1,12,10),mk(NOR,0,8,10)]); const t=W.units[0], g=W.units[1], n=W.units[2]; t.fireRes=0.5; t.frostRes=0.5;
  E.burnOn(W,t,{i:g.i,fire:2},1,false); E.burnOn(W,n,{i:g.i,fire:2},1,false); ok(Math.abs(t.burn.dps-n.burn.dps*0.5)<1e-6,'화상 초당 '+n.burn.dps+' → '+t.burn.dps);
  E.frostOn(W,t,4,g.i); E.frostOn(W,n,4,g.i); ok(Math.abs((t.frostT-W.t)-2)<1e-6&&Math.abs((n.frostT-W.t)-4)<1e-6,'동상 4초 → 2초'); }

console.log('F. 로지나의 리본 — 뛸 때만 걸음 × (runK)');
{ const W=WF([mk(INJ,0,10,10,{hero:true}),mk(GOB,1,30,10)]); const u=W.units[0]; const w0=E.spdNow0(W,u); u.runK=1.15; const w1=E.spdNow0(W,u);
  u.order={k:'move',x:20,y:10,hurry:true}; u.runK=1; const r0=E.spdNow0(W,u); u.runK=1.15; const r1=E.spdNow0(W,u);
  ok(Math.abs(w0-w1)<1e-9&&Math.abs(r1-r0*1.15)<1e-6&&r0>w0,'걷기는 그대로 '+w0.toFixed(2)+' · 뛰기 '+r0.toFixed(2)+' → '+r1.toFixed(2)); }

console.log('G. 탄탄만의 숫돌 — 덜 닳음 (durK: 무기 · 갑옷 · 방패)');
{ const W=WF([mk(INJ,0,10,10,{hero:true,weapon:'장검',gear:{몸:{name:'사슬',mat:'사슬',tier:2}}}),mk(GOB,1,12,10),mk(REB,0,8,10)]); const u=W.units[0], g=W.units[1], rb=W.units[2];
  u.wDur=100; E.wearW(W,u,10,null); const a0=u.wDur; u.wDur=100; u.durK=0.6; E.wearW(W,u,10,null); ok(Math.abs(a0-90)<1e-6&&Math.abs(u.wDur-94)<1e-6,'무기 10 닳음 → 6 ('+a0+' · '+u.wDur+')');
  const it=u.gear['몸']; it.dur=100; u.durK=1; E.wearHit(W,g,u,{far:false},it,20,0.5); const b0=100-it.dur; it.dur=100; u.durK=0.6; E.wearHit(W,g,u,{far:false},it,20,0.5); const b1=100-it.dur; ok(b0>0&&Math.abs(b1-b0*0.6)<0.02,'갑옷 '+b0.toFixed(2)+' → '+b1.toFixed(2));
  if (E.wearBlock){ rb.sDur=100; rb.durK=1; E.wearBlock(W,g,rb,{gn:'방패',far:false},20,null); const s0=100-rb.sDur; rb.sDur=100; rb.durK=0.6; E.wearBlock(W,g,rb,{gn:'방패',far:false},20,null); const s1=100-rb.sDur; ok(s0>0&&Math.abs(s1-s0*0.6)<0.02,'방패 '+s0.toFixed(2)+' → '+s1.toFixed(2)); } }

console.log('H. 페흐토의 청염 조각 — 근접에 불 (wFire)');
{ const tryHit=(wf,seed)=>{ const W=WF([mk(INJ,0,10,10,{hero:true,weapon:'장검'}),mk(GOB,1,10.9,10,{ov:{hp:999,atk:5}})],{seed}); const u=W.units[0], t=W.units[1]; u.wFire=wf; t.canGuard=false; t.raised=false; t.ev=0.0001; u.face=0; t.face=Math.PI;
    for(let k=0;k<12&&!t.burn;k++){ E.strike(W,u,t,t,1,false,{}); } return !!t.burn; };
  ok(tryHit(2,1)&&tryHit(2,2),'청염을 지니면 근접으로 맞힌 상대에게 불이 붙음');
  ok(!tryHit(0,1)&&!tryHit(0,2),'없으면 불이 붙지 않음');
  const W=WF([mk(NOR,0,10,10),mk(GOB,1,14,10,{ov:{hp:999,atk:5}})]); const u=W.units[0], t=W.units[1]; u.wFire=2; t.canGuard=false; let k=0; while(k++<20&&!t.burn) E.strike(W,u,t,t,1,true,{}); ok(!t.burn,'사수의 사격엔 불이 없음 (근접만)'); }

console.log('I. 호레이쇼의 군기 — 명령이 닿을 확률 + (닿는 길이 있을 때만)');
{ let found=null; for (const d of [8,8.5,9,9.5,7.5,7]){ const W=WF([mk(INJ,0,4,10,{hero:true}),mk(NOR,0,4+d,10),mk(GOB,1,36,10),mk(GOB,1,36,12)]); W.noise=W.noise||0; const C=W.units[0], u=W.units[1]; const p0=E.cmdLink1(W,C,u).p; if(p0>0.02&&p0<0.85){ W.cmdBonus={0:0.15}; const p1=E.cmdLink1(W,C,u).p; W.cmdBonus={1:0.15}; const p2=E.cmdLink1(W,C,u).p; found={d,p0,p1,p2}; break; } }
  console.log('    ', JSON.stringify(found)); ok(found&&Math.abs(found.p1-found.p0-0.15)<1e-6&&Math.abs(found.p2-found.p0)<1e-9,'닿을 확률 '+(found?found.p0.toFixed(2)+' → '+found.p1.toFixed(2)+' (적 편 군기는 아군에 안 걸림)':'(알맞은 거리를 못 찾음)'));
  const W=WF([mk(INJ,0,4,10,{hero:true}),mk(NOR,0,4.8,10),mk(GOB,1,36,10)]); W.cmdBonus={0:0.15}; ok(E.cmdLink1(W,W.units[0],W.units[1]).p<=1,'1 을 넘지 않음'); }

console.log('J. 망각의 데이터 조각 — 숨은 상대가 더 멀리서 보임 (spotK)');
{ const W=WF([mk(INJ,0,4,10,{hero:true}),mk(GOB,1,10,10)]); W.amb=1; E.computeLight(W); const u=W.units[0], t=W.units[1]; const sg=W.rules.sight;
  t.stealth=true; t.stealthE=1; t.torch=false; t.revealT=-99; t.order=null; t.mv=null; const sk=E.stealthK(W,t); const d=sg*Math.min(0.97,sk*1.15); t.x=u.x+d; t.y=u.y; t.vx=0; t.vy=0; u.face=0; t.face=Math.PI;
  const c0=E.canSee(W,u,t); u.spotK=1.3; const c1=E.canSee(W,u,t);
  ok(sk<1&&!c0&&c1,'은신 × '+sk.toFixed(2)+' · 거리 '+d.toFixed(1)+' (보는 거리 '+sg+') — 없으면 못 봄 · 있으면 봄'); }

console.log('K. 왐의 머리촛대 — 일어날 때 중상이 나음 (rise 넷째 인자)');
{ const mkW=()=>{ const W=WF([mk(INJ,0,10,10,{hero:true}),mk(GOB,1,14,10)]); const u=W.units[0]; u.alive=false; u.hp=0; u.inj=[{k:'rib',txt:'갈비뼈 골절',t:0}]; u.shock=2; u.bleed={dps:2,until:W.t+9,by:1}; u.ibleed={dps:1,until:W.t+20,by:1}; u.burn={dps:3,until:W.t+3,by:1}; u.deathKind='brain'; return {W,u}; };
  { const {W,u}=mkW(); E.rise(W,u,0.1,true); ok(u.alive&&Math.round(u.hp)===Math.round(u.max*0.1)&&!u.inj.length&&!u.shock&&!u.bleed&&!u.ibleed&&!u.burn&&!u.deathKind&&logK(W,'rise').some(l=>l.cure),'cure: 체력 10% · 부상 · 쇼크 · 출혈 · 내출혈 · 화상이 나음'); }
  { const {W,u}=mkW(); E.rise(W,u,0.1); ok(u.alive&&!!u.bleed&&u.shock===2,'cure 없이 일어나면 (재생 · 구급상자) 예전대로 — 출혈 · 쇼크 그대로'); } }

console.log('L. 선봉장 [대방패] — 방패를 든 채 소총 · 쏘는 동안에도 방패 · 방호 160 · 같은 규칙');
{ const W=WF([mk(NOR,0,8,8,{shield:true,traits:[...NOR.traits,'대방패']}),mk(NOR,1,30,8,{shield:true,traits:[...NOR.traits,'대방패']}),mk(NOR,0,8,12)]); const v=W.units[0], e=W.units[1], n=W.units[2];
  ok(v.pavise&&e.pavise&&!n.pavise,'[대방패] 가 있으면 pavise (적도 같음)');
  const why=E.wearWhy(W.rules,E.pOfU(v),{k:'shield',name:'방패'}), why2=E.wearWhy(W.rules,{...E.pOfU(n),shield:false},{k:'shield',name:'방패'}), why3=E.wearWhy(W.rules,{...E.pOfU(v)},{k:'weapon',name:'소총'});
  ok(/이미 방패/.test(why)&&/원거리 무기/.test(why2)&&why3==='','대방패 사수는 방패와 총을 함께 ('+why+' / '+why2+' / 소총: "'+why3+'")');
  ok(W.rules.pen&&W.rules.pen.pavise===160,'수치표 pen.pavise 160'); }
{ let S={shots:0,raisedShot:0,blk:0,pen:0}; for (const seed of [1,2,3,4,5]){ const W=WF([mk(NOR,0,8,8,{shield:true,traits:[...NOR.traits,'대방패']}),mk(REB,0,9,6),mk(INJ,0,7,9,{hero:true}),mk(DES['궁수'],1,26,6),mk(DES['궁수'],1,26,10)],{seed}); W.rules.roe.def='smart'; for(const u of W.units) u.roe='smart'; const n=W.units[0];
    run(W,25,()=>{ if(n.act&&n.act.k==='atk'&&n.raised) S.raisedShot++; return false; }); S.shots+=W.log.filter(l=>(l.k==='hit'||l.k==='miss')&&l.a===0).length; S.blk+=W.log.filter(l=>l.k==='hit'&&l.b===0&&l.block).length; S.pen+=W.log.filter(l=>l.k==='hit'&&l.b===0&&/방패를 뚫음/.test(l.tag||'')).length; }
  console.log('    ', JSON.stringify(S)); ok(S.shots>10&&S.raisedShot>50&&S.blk>5,'쏘면서 방패를 듦 · 화살을 막음 (쏨 '+S.shots+' · 막음 '+S.blk+' · 뚫림 '+S.pen+')'); }

console.log(fails?`FAIL ${fails}`:'ALL OK — eng8770');
