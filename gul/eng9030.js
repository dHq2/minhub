// v9.2.1 엔진 시험 (나) — eng9030.js v1.0 (밀치는 주먹 · 점점 빨라짐 · 초대형 지속 돌격 · 반 · 테리 · 흑익 · 하류 · 헌팅나이프 암습 · 무기뺏기 · 카밀라 레이더)
const {E,R,U,DES,mk,W_,REB}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };
const run=(W,sec,fn)=>{ const n=Math.round(sec*30); for(let i=0;i<n&&!W.over;i++){ step(W); if(fn&&fn(W)) break; } };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const base={...REB,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},nv:true};
const dummy=(name,x,y,side,ex)=>mk({...base,name,...(ex||{})},side,x,y);
const WF=(al,fo,o)=>{ const units=[...al,...(fo||[])]; const R2=JSON.parse(JSON.stringify(R)); R2.chgPol={allyOff:false}; R2.roe.def=(o&&o.roe)||'free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:(o&&o.W)||44,H:(o&&o.H)||24,seed:7,units,torches:[{x:22,y:12,r:90}],flips:[]},R2,(o&&o.seed)||1,{headless:true}); W.amb=1; E.computeLight(W); for(const u of W.units) for(const x of u.spec||[]) x.cdT=-9; return W; };
const hold=(...us)=>{ for(const u of us){ u.state='idle'; u.target=null; u.goal=null; u.path=null; u.wander=99; } };
const BAN=(x,y,side,ex)=>dummy('반',x,y,side,{weapon:'대검',height:8,weight:20000,sizeCls:'초대형',rMul:3,h2:'ban',ov:{hp:1200,atk:60,spd:2.2},traits:['거구','갑피','베테랑'],...(ex||{})});
const TERI=(x,y,side,ex)=>dummy('테리',x,y,side,{weapon:'둔기',height:8,weight:24000,sizeCls:'초대형',rMul:3,h2:'teri',ov:{hp:1500,atk:55,spd:2.0},traits:['거구','갑피','베테랑'],...(ex||{})});

console.log('A. 거인의 몸');
{ const W=WF([],[BAN(30,12,1),dummy('작은',10,12,0)]); const b=W.units[0]; console.log('    반 r '+b.r.toFixed(2)+' · 키 '+b.h+' · 초대형 '+(b.sizeCls)+' · h2 '+(b.h2&&b.h2.k)); ok(b.sizeCls==='초대형'&&b.h2&&b.h2.k==='ban','반: 초대형 · 기술표 ban'); ok(b.r>=1.2&&b.r<=3.2,'몸 반지름이 거인답게 (r '+b.r.toFixed(2)+')'); }

console.log('B. 반 — 기술을 골고루');
{ const used={}, died=[]; let grabs=0, stomps=0; for(let s=1;s<=4;s++){ const al=[0,1,2,3,4,5].map(i=>dummy('병'+i,8+i*1.2,10+i*0.8,0,{ov:{hp:140+i*20,atk:12},sizeCls:i<2?'소형':i<4?'중형':'중대형',height:i<2?1.3:i<4?1.7:2.1})); const W=WF(al,[BAN(24,12,1)],{seed:s}); const b=W.units[al.length];
    for(const a of al){ a.state='hunt'; } run(W,45,()=>false); for(const l of logK(W,'h2')) if(l.a===b.i) used[l.n]=(used[l.n]||0)+1; grabs+=logK(W,'h2Grab').length; for(const l of logK(W,'die')) if(l.how==='crush') stomps++; died.push(al.filter(a=>!a.alive).length); }
  console.log('    쓴 기술', JSON.stringify(used),' · 잡아던짐 '+grabs+' · 짓밟/으깸 사망 '+stomps+' · 쓰러진 병사 '+died.join('/'));
  ok(Object.keys(used).length>=3,'기술 3가지 이상 씀 ('+Object.keys(used).length+')'); ok(died.some(n=>n>=3),'작은 병사들은 거인 앞에서 많이 쓰러짐'); }

console.log('C. 반 — 지속 돌격에 넘어짐 (일어나는 데 오래)');
{ const W=WF([dummy('돌격병',10,12,0)],[BAN(24,12,1)]); const [c,b]=W.units; hold(b); b.h2=null; const g0=W.log.length; for(let i=0;i<3;i++) E.giantChg(W,c,b); ok(!(b.proneT>W.t),'세 번 들이받아도 아직 서 있음'); E.giantChg(W,c,b); ok(b.proneT>W.t+6,'네 번째에 넘어짐 (일어나기까지 '+(b.proneT-W.t).toFixed(1)+'초)'); ok(logK(W,'giantFall').length===1,'로그: 거인이 넘어짐'); }
{ // 실제 돌진으로: 때리지 않는 거인 (공격 0) 에게 돌격병이 거듭 부딪힘
  const W=WF([dummy('돌격병',10,12,0,{canCharge:true})],[BAN(24,12,1,{ov:{hp:9000,atk:1,spd:2.2},h2:null,spdMul:0})]); const [c,b]=W.units; let falls=0, r=0; for(;r<8&&!falls;r++){ b.x=24; b.y=12; c.x=b.x-b.r-4.5; c.y=b.y; c.act=null; c.chargeCd=-9; c.proneT=-9; c.stunT=-9; c.kb=null; c.hp=c.max; c.brokenT=-9; b.act=null; b.state='idle'; b.target=null; E.tryCharge(W,c,b,true); run(W,2.2); falls=logK(W,'giantFall').length; }
  console.log('    실제 돌진 '+logK(W,'impact').filter(l=>l.b===b.i).length+'번 ('+r+'판) → 넘어짐 '+falls); ok(falls>=1||(b.cgHits||[]).length>=1,'실제 돌진도 세어짐 (센 돌격 '+((b.cgHits||[]).length)+' · 넘어짐 '+falls+')'); }

console.log('D. 테리 — 망치');
{ const used={}; let quakes=0, crush=0; for(let s=1;s<=4;s++){ const al=[0,1,2,3,4,5].map(i=>dummy('병'+i,8+i*1.2,10+i*0.8,0,{ov:{hp:200,atk:12},sizeCls:i<2?'소형':i<4?'중형':'중대형',height:i<2?1.3:i<4?1.7:2.1})); const W=WF(al,[TERI(26,12,1)],{seed:s}); const b=W.units[al.length]; for(const a of al) a.state='hunt'; run(W,50,()=>false);
    for(const l of logK(W,'h2')) if(l.a===b.i) used[l.n]=(used[l.n]||0)+1; quakes+=logK(W,'quake').length; for(const l of logK(W,'die')) if(l.how==='crush') crush++; }
  console.log('    쓴 기술', JSON.stringify(used),' · 지축 울림 '+quakes+' · 으깸 사망 '+crush); ok(Object.keys(used).length>=3,'기술 3가지 이상'); ok(quakes>=1,'내려찍기 지축 울림 (그 판에 닿은 몸에게)'); ok(crush>=1,'찌부러짐 · 짓밟힘 즉사가 나옴'); }

console.log('E. 흑익 · 하류');
{ const HE=(x,y,side,ex)=>dummy('흑익',x,y,side,{weapon:'장검',h2:'heugik',ov:{hp:600,atk:40,spd:3.2},traits:['베테랑','장군','갑피'],active:['암계 역장'],...(ex||{})}); const HR=(x,y,side,ex)=>dummy('하류',x,y,side,{weapon:'대검',h2:'hareu',ov:{hp:400,atk:48,spd:3.5},traits:['베테랑','장군','갑피'],...(ex||{})});
  const u1={}, u2={}; let fields=0; for(let s=1;s<=3;s++){ const al=[0,1,2,3].map(i=>dummy('병'+i,8,8+i*2,0,{ov:{hp:2400,atk:6}})); const W=WF(al,[HE(26,10,1),HR(26,14,1)],{seed:s}); const [h,r]=W.units.slice(4); for(const a of al) a.state='hunt'; run(W,50,()=>false);
    for(const l of logK(W,'h2')){ if(l.a===h.i) u1[l.n]=(u1[l.n]||0)+1; if(l.a===r.i) u2[l.n]=(u2[l.n]||0)+1; } fields+=logK(W,'bfield').length; }
  console.log('    흑익 '+JSON.stringify(u1)+' · 하류 '+JSON.stringify(u2)+' · 역장 '+fields); ok(Object.keys(u1).length>=3,'흑익 기술 3가지 이상'); ok(Object.keys(u2).length>=3,'하류 기술 3가지 이상'); ok(fields>=1,'흑익이 역장을 펼침 (하류 보조)'); }

console.log('F. 헌팅나이프 · 카밀라');
{ const W=WF([dummy('헌팅나이프',10,12,0,{weapon:'단검',active:['암습','무기뺏기'],traits:['베테랑','장군']})],[dummy('사수',20,12,1,{weapon:'활',ammo:30,ov:{hp:400,atk:10}}),dummy('검사',17,15,1,{weapon:'장검'})]); const [h,a,b]=W.units; hold(a,b); const sx=(h.spec||[]).find(x=>x.k==='hamb'); ok(!!sx,'기술 이름 → 암습'); E.supStart(W,h,'hamb',a,'시험'); run(W,2.0); const back=Math.atan2(a.y-h.y,a.x-h.x); console.log('    암습 → 사수 체력 '+Math.round(a.hp)+'/'+a.max+' · 거리 '+dist(h,a).toFixed(1)); ok(a.hp<a.max*0.6&&dist(h,a)<2.7,'등 뒤로 붙어 큰 피해'); ok(logK(W,'hamb').length===1,'로그'); }
{ let got=0; for(let s=1;s<=8;s++){ const W=WF([dummy('헌팅나이프',10,12,0,{weapon:'단검',active:['무기뺏기']})],[dummy('검사',11.2,12,1,{weapon:'장검'})],{seed:s}); const [h,e]=W.units; hold(h,e); E.supStart(W,h,'hdisarm',e,'시험'); run(W,1.5); if(e.weaponGone) got++; }
  ok(got>=3&&got<=8,'무기뺏기: 8번 중 '+got+'번 성공 (확률)'); }
{ const W=WF([dummy('카밀라',6,12,0,{weapon:'샷건',traits:['베테랑','레이더','생존자'],gear:{몸:{name:'방탄복',mat:'방탄복',tier:3}}})],[dummy('먼 적',38,12,1,{ov:{hp:300,atk:10}})]); const [k,e]=W.units; hold(e); run(W,2); const s=k.sense[e.i]; ok(k.radar&&s&&W.t-s.t<1,'레이더: 38칸 밖의 적도 점으로 앎'); ok(k.survivor,'생존자 표시'); ok(!!(E.DEFAULT_RULES.armor['방탄복']),'방탄복 재질: 날붙이 '+E.DEFAULT_RULES.armor['방탄복'].vs['날붙이']+' · 둔기 '+E.DEFAULT_RULES.armor['방탄복'].vs['둔기']); }

console.log('G. 밀치는 주먹 · 점점 빨라짐');
{ const W=WF([dummy('근육',10,12,0,{weapon:'맨손',hitKb:1.6,ov:{hp:300,atk:30}})],[dummy('적',11.4,12,1,{ov:{hp:900,atk:5}})]); const [m,e]=W.units; hold(e); m.target=e; m.state='fight'; const x0=e.x; run(W,2.5); ok(e.x>x0+0.6||m.x>10.5,'근육의 주먹은 상대를 조금 밀어냄 (+'+(e.x-x0).toFixed(1)+'칸)'); }
{ const W=WF([dummy('먹이',10,12,0,{ov:{hp:9000,atk:1}})],[dummy('기형',24,12,1,{weapon:'맨손',ramp:{from:2.2,to:4,t:20},ov:{hp:500,atk:20,spd:2.2}})]); const [f,g]=W.units; const sp=[]; run(W,25,(Wd)=>{ if(Math.round(Wd.t*30)%150===0) sp.push(+g.spd.toFixed(2)); }); console.log('    걸음 '+sp.join(' → ')); ok(sp.length>=3&&sp[sp.length-1]>=3.8&&sp[0]<=2.6,'기형 망자: 느리게 시작해 점점 빨라짐 ('+sp[0]+' → '+sp[sp.length-1]+')'); }

console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
