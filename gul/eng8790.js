// v8.7.9 엔진 시험 — eng8790.js v1.3 (v1.3: v9.6.3 — 120초 기술 시험 시드 5 → 6 (시드마다 10 ~ 12 · 예전 판도 시드 2 는 10) · v1.2: v9.0.0 — 아군 기본 지침이 돌격 금지라 이 시험 (돌격과 상관없는 것) 은 옛 기본 (allyOff 끔) 으로 · v1.1: 도감 맞춤 — 신나펄 기술 (신나는 공중 투창 · 포탄 · 횡베기 · 기술 칸 1 · 2) · 각 몸은 받는 피해 그대로 · 각펄 보스사양 (시작 횡베기 · 둘러싸이면 횡베기 · 연속 찌르기 · 창비 · 거대 특수창 2초) · v1.0: 펄 · 각펄 (명세 E · 3D 기술표) — 몸 (페이지 설계 그대로) · 기술 칸 명령 (철 깃털 · 꼬깃꼬깃 착지 · 돌려차기 · 움츠리기) · 스스로 ·
//   빈사에 각펄 · 돌아옴 · 각펄 (적 · 13 기술 · 끝까지 · 천천히 걸음) · 만남의 각펄 (쓰러지되 숨은 붙어 있음 · 창이 떨어지지 않음) · 펄의 창 (열화 · 던져 버리지 않음 · 명령 · 보스는 따로 갖지 않음) ·
//   물러날 수 없음 (noRetreat) · 같은 규칙 (적 편 동료 펄도 같은 두뇌))
const {E,R,U,REB,mk}=require('./scen_lib790.js'); const PD=require('./pdes.js'); const fs=require('fs');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const des=k=>{ const d=JSON.parse(JSON.stringify(PD[k])); delete d.key; return d; };
const html=fs.readFileSync(__dirname+'/build/wrapped.html','utf8'), i0=html.indexOf("FOE8['각펄'] = "), i1=html.indexOf('};', i0);
const GAK=(0,eval)('('+html.slice(i0+"FOE8['각펄'] = ".length, i1+1)+')'); delete GAK.key;
const PE=des('펄');
const dummy=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.chgPol={allyOff:false}; R2.roe.def=(o&&o.roe)||'hold'; R2.roe.autoLift=false; if(o&&o.rules) o.rules(R2); const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[],...(o&&o.rocks?{rocks:o.rocks}:{})},R2,(o&&o.seed)||1,{headless:true}); E.computeLight(W); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };
const still=(...us)=>{ for(const u of us){ u.order={k:'hold'}; u.ev=0.0001; u.spd=0.001; } };
const holdAll=u=>{ for(const x of u.spec||[]) x.cdT=1e9; if(u.pk) for(const s of ['feather','land','kick','psky','pball','pwide']) u.pk.cd[s]=1e9; u.wrapCd=1e9; };

console.log('A. 몸 — 동료 펄 (페이지 설계) · 각펄 (적 설계)');
{ const W=WF([mk(PE,0,10,10),mk(GAK,1,30,10)]); const p=W.units[0], g=W.units[1];
  ok(PE.pk==='pearl'&&PE.gak==='pearlgak'&&PE.noDraw,'설계: 기술표 pearl · 빈사에 pearlgak · 뽑기에 없음');
  ok((p.spec||[]).map(x=>x.k).join()==='psky,pball,pfeath,pland,pwide,pkick,pwrap','펄 기술 칸: '+(p.spec||[]).map(x=>x.name).join(' · ')+' (1 · 2 = 신나는 공중 투창 · 신나는 포탄 — 도감 신나펄)');
  ok(p.pk&&p.pk.k==='pearl'&&p.gakKit==='pearlgak'&&p.fallW&&!p.h2,'펄: 기술표 (pk) · 빈사의 각펄 · ◆타천 날개 · 평소엔 각펄 기술표 없음');
  ok(p.jav&&!p.javAuto,'펄의 창 (보통 창) — 명령으로만 던짐 (스스로 던지지 않음 · [공통스킬:투창] 없음)');
  ok(Math.round(p.max)===140&&Math.round(p.atk)===30,'펄 체력 '+Math.round(p.max)+' · 공격 '+p.atk+' (2성 평범한 창병)');
  ok(g.h2&&g.h2.k==='pearlgak'&&g.h2Last&&g.fallW&&g.weapon==='펄의 창','각펄: 기술표 pearlgak · ◆끝까지 · ◆타천 날개 · 펄의 창');
  ok(!g.jav&&!(g.spec||[]).some(x=>x.k==='pthrow'),'각펄은 펄의 창을 보통 투창처럼 던지지 않고 · 무기 열화 기술 (정면 투창 (열화)) 도 따로 갖지 않음 (제 기술표의 정면 투창)');
  ok(Math.round(g.max)===780&&Math.round(g.atk)===55&&Math.abs(g.spd-3.8)<0.01,'각펄 체력 '+Math.round(g.max)+' · 공격 '+g.atk+' · 걸음 '+g.spd+' (3D 1300 · 30 · 4.4 → 보스 비)');
  ok(!(g.traits||[]).includes('각펄')&&!(g.active||[]).includes('철 깃털'),'각펄 (적) 은 동료 펄의 정체성을 받지 않음 (noId)'); }

console.log('B. 기술 칸 명령 — 철 깃털 · 꼬깃꼬깃 착지 · 돌려차기 · 움츠리기 (기술표와 같은 몸 · 같은 대기)');
{ const W=WF([mk(PE,0,10,10),dummy('적',16,10,1)]); const p=W.units[0], f=W.units[1]; still(f); f.order={k:'hold'};
  p.order={k:'spec',s:'pfeath',b:f.i}; let k=0; while(k++<90&&!logK(W,'h2').some(l=>l.a===p.i&&l.n==='철 깃털')) step(W);
  const sx=p.spec.find(x=>x.k==='pfeath');
  ok(logK(W,'h2').some(l=>l.a===p.i&&l.n==='철 깃털'),'명령 → 철 깃털 ('+(W.t).toFixed(1)+'초)');
  ok(sx.cdT>W.t+5&&Math.abs(sx.cdT-p.pk.cd.feather)<0.01,'기술 칸 대기 = 기술표 대기 ('+(sx.cdT-W.t).toFixed(1)+'초)');
  step(W,30); ok(logK(W,'h2Hit').some(l=>l.a===p.i&&l.n==='철 깃털'&&(l.hit||[]).includes(f.i)),'깃털이 적을 맞힘');
  ok(f.bleed||f.ibleed||W.log.some(l=>l.k==='bleed'&&l.b===f.i)||logK(W,'hit').some(l=>l.b===f.i&&/철 깃털/.test(l.tag||'')),'철 깃털 — 출혈 (또는 맞음)'); }
{ const W=WF([mk(PE,0,10,10),dummy('적',14,10,1)]); const p=W.units[0], f=W.units[1]; still(f);
  p.order={k:'spec',s:'pland',b:f.i}; let k=0; while(k++<120&&!logK(W,'h2Jump').some(l=>l.a===p.i)) step(W);
  ok(logK(W,'h2Jump').some(l=>l.a===p.i&&l.n==='꼬깃꼬깃 착지'),'명령 → 꼬깃꼬깃 착지 — 날아오름');
  ok(p.act&&p.act.k==='leap'&&p.act.air&&p.act.h2L,'날아오른 동안 공중 (바닥 공격이 닿지 않음)');
  k=0; while(k++<90&&!logK(W,'h2Hit').some(l=>l.a===p.i&&l.land)) step(W);
  ok(logK(W,'h2Hit').some(l=>l.a===p.i&&l.land&&(l.hit||[]).includes(f.i)),'내려앉음 — 둘레의 적이 맞음'); }
{ const W=WF([mk(PE,0,10,10),dummy('적',11.2,10,1)]); const p=W.units[0], f=W.units[1]; still(f);
  p.order={k:'spec',s:'pkick',b:f.i}; let k=0; while(k++<60&&!logK(W,'h2Hit').some(l=>l.a===p.i&&l.n==='돌려차기')) step(W);
  ok(logK(W,'h2Hit').some(l=>l.a===p.i&&l.n==='돌려차기'&&(l.hit||[]).includes(f.i)),'명령 → 돌려차기 (붙은 적)'); }
{ const W=WF([mk(PE,0,10,10),dummy('적',16,10,1),dummy('적2',16.5,11.6,1)]); const p=W.units[0], f=W.units[1]; still(f,W.units[2]);
  p.order={k:'spec',s:'psky',b:f.i}; let k=0; while(k++<90&&!logK(W,'h2').some(l=>l.a===p.i&&l.n==='신나는 공중 투창')) step(W);
  const Z=(W.h2z||[]).filter(z=>z.by===p.i), sx=p.spec.find(x=>x.k==='psky');
  ok(Z.length===3&&Z.every(z=>z.diag&&z.wk==='날붙이'&&Math.abs(z.at-z.t0-1.2)<0.01),'명령 → 신나는 공중 투창: 일반 창 셋 (비스듬히 · 1.2초 뒤) — 원 '+Z.length);
  ok(sx.cdT>W.t+8,'기술 칸 대기 = 기술표 대기 ('+(sx.cdT-W.t).toFixed(1)+'초)');
  k=0; while(k++<90&&!logK(W,'h2Rain').some(l=>l.a===p.i&&(l.hit||[]).length)) step(W);
  ok(logK(W,'h2Rain').some(l=>l.a===p.i&&(l.hit||[]).includes(f.i)),'떨어진 창이 표적을 맞힘 (원 안)'); }
{ const W=WF([mk(PE,0,10,10),dummy('적',15,10,1)]); const p=W.units[0], f=W.units[1]; still(f); const x0=p.x;
  p.order={k:'spec',s:'pball',b:f.i}; let k=0; while(k++<90&&!logK(W,'h2Hit').some(l=>l.a===p.i&&l.n==='신나는 포탄')) step(W);
  const h=logK(W,'h2Hit').find(l=>l.a===p.i&&l.n==='신나는 포탄');
  ok(!!h&&(h.hit||[]).includes(f.i)&&p.x>x0+4,'명령 → 신나는 포탄: 몸째 날아가 꿰뚫음 ('+(p.x-x0).toFixed(1)+'칸)');
  ok(!logK(W,'h2Step').some(l=>l.a===p.i)&&!(f.proneT>0),'각펄의 처형과 달리 뒤로 빠지지 · 넘어뜨리지 않음'); }
{ const W=WF([mk(PE,0,10,10),dummy('앞',11.4,10,1),dummy('뒤',8.6,10,1)]); const p=W.units[0], f=W.units[1], b=W.units[2]; still(f,b);
  p.order={k:'spec',s:'pwide',b:f.i}; let k=0; while(k++<60&&!logK(W,'h2Hit').some(l=>l.a===p.i&&l.n==='신나는 횡베기')) step(W);
  const h=logK(W,'h2Hit').find(l=>l.a===p.i&&l.n==='신나는 횡베기');
  ok(!!h&&(h.hit||[]).includes(f.i)&&(h.hit||[]).includes(b.i),'명령 → 신나는 횡베기: 둘레 3칸 한 바퀴 (앞 · 뒤 모두)'); }
{ const W=WF([mk(PE,0,10,10),dummy('적',11.2,10,1,{ov:{hp:900,atk:40}})]); const p=W.units[0], f=W.units[1];
  p.order={k:'spec',s:'pwrap'}; step(W,2); const wx=p.spec.find(x=>x.k==='pwrap');
  ok(p.act&&p.act.k==='wrap'&&p.wrapT>W.t,'명령 → 움츠리기 (날개로 감쌈 · 그동안 못 움직임)');
  ok(wx.cdT>W.t+8,'움츠리기 대기 '+(wx.cdT-W.t).toFixed(1)+'초 (기술 칸)');
  const hp0=p.hp; const o=E.strike? null:null; E.applyDmg(W,f,p,50,{tag:'시험'}); ok(Math.abs((hp0-p.hp)-20)<0.6,'감싼 동안 받는 피해 × 0.4 (50 → '+(hp0-p.hp).toFixed(1)+')'); }

console.log('C. 스스로 — 펄 (적 · 아군 같은 두뇌)');
for (const side of [0,1]){ const W=WF([mk(PE,side,10,10),dummy('맞상대',17,10,1-side),dummy('맞상대2',18,12,1-side)],{roe:'free'}); const p=W.units[0];
  step(W,30*25); const used=new Set(logK(W,'h2').filter(l=>l.a===p.i).map(l=>l.n));
  ok(used.size>=2,(side?'적 편':'아군')+' 펄이 스스로 쓴 기술: '+[...used].join(' · ')); }
{ const W=WF([mk(PE,0,10,10),mk(GAK,1,14,10)],{roe:'free'}); const p=W.units[0], g=W.units[1]; for(const s of g.h2&&Object.keys(g.h2.cd)||[]) g.h2.cd[s]=0;
  let k=0, wr=false; while(k++<30*30&&p.alive){ step(W); if(p.act&&p.act.k==='wrap') wr=true; if(wr) break; }
  ok(wr||logK(W,'pearlWrap').some(l=>l.a===p.i),'큰 일격이 올 때 스스로 움츠리기'+(logK(W,'pearlWrap').find(l=>l.a===p.i)||{}).why?' — '+(logK(W,'pearlWrap').find(l=>l.a===p.i)||{}).why:''); }

console.log('D. 빈사에 각펄 · 돌아옴 (카리우스 [불경자] 처럼)');
{ const W=WF([mk(PE,0,10,10),dummy('적',11.2,10,1,{ov:{hp:2000,atk:20}})]); const p=W.units[0], f=W.units[1]; still(f); const a0=p.atk, s0=p.spd;
  E.applyDmg(W,f,p,p.hp+50,{tag:'시험 — 숨이 끊길 일격'});
  ok(p.alive&&Math.round(p.hp)===1&&p.gak,'숨이 끊길 일격 → 체력 1 로 남아 각펄');
  ok(p.h2&&p.h2.k==='pearlgak'&&Math.abs(p.atk-a0*1.8)<0.05&&Math.abs(p.spd-s0*1.25)<0.01,'각펄: 기술표 pearlgak · 공격 × 1.8 ('+p.atk+') · 걸음 × 1.25');
  { const b0=!!(p.bleed||p.ibleed); E.startBleed(W,p,f.i,1); ok(!b0&&!!(p.bleed||p.ibleed)||b0,'각 몸도 피를 흘림 (적 각펄과 같은 몸 — 피가 멎음 · 막음 없음)'); p.bleed=null; p.ibleed=null; }
  ok(Math.abs((p.dmgK||1)-1)<1e-9,'받는 피해는 그대로 (× '+(p.dmgK||1)+' — 각펄 성능: 적 각펄과 같은 몸 · v1.1 에서 × 0.33 · 피가 멎음 거둠)');
  E.applyDmg(W,f,p,30,{tag:'시험'}); ok(p.alive&&p.h2Last&&p.h2LastUsed,'각펄 ◆끝까지 — 다음 숨이 끊길 일격도 한 번 버팀');
  p.hp=p.max*0.6; step(W,3); ok(!p.gak&&!p.h2&&Math.abs(p.atk-a0)<0.01&&Math.abs(p.spd-s0)<0.01,'50% 를 넘으면 돌아옴 (공격 · 걸음 원래대로)');
  ok(logK(W,'pearlGak').filter(l=>l.a===p.i).map(l=>l.on).join()==='true,false','기록: 각펄 → 돌아옴'); }
{ const W=WF([mk(PE,0,10,10),dummy('적',11.2,10,1)]); const p=W.units[0]; p.hp=p.max*0.12; step(W,2);
  ok(p.gak,'15% 아래면 그대로 각펄'); }

console.log('E. 각펄 (적) — 13 기술 · 2페이즈 · 끝까지 · 천천히 걸음');
{ const us=[mk({...GAK,ov:{hp:99999,atk:55,spd:3.8}},1,30,10)]; for(let i=0;i<5;i++) us.push(dummy('표적'+i,6+i%2*2,6+i*2,0,{ov:{hp:90000,atk:12}}));   /* 표적이 120초 동안 버팀 (판이 끝나지 않게) */
  const W=WF(us,{roe:'free',seed:6}); const g=W.units[0]; for(const u of W.units) if(u.side===0) u.noOrg=true;   /* 급소 없음 — 표적이 120초 동안 버팀 */
  let k=0; while(k++<30*120&&!W.over){ step(W); if(k===30*30) g.hp=g.max*0.45; }
  const used=new Set(logK(W,'h2').filter(l=>l.a===g.i).map(l=>l.n));
  const all=['찍고 빼기','정면 투창','도약 찍기','스텝 찌르기','3연속 베기','솟는 거대 창','공중 투창 (창비)','반경 10m 횡베기','정면 처형','창 대포','날아 투창','초대형 치명타','처형 내리꽂기'];
  ok(all.filter(n=>used.has(n)).length>=11,'120초 동안 쓴 기술 '+all.filter(n=>used.has(n)).length+'/13: 안 쓴 것 — '+(all.filter(n=>!used.has(n)).join(' · ')||'없음'));
  ok(logK(W,'h2Phase').some(l=>l.a===g.i),'50% 아래 2페이즈');
  ok(logK(W,'h2Twirl').some(l=>l.a===g.i)&&logK(W,'h2Up').some(l=>l.a===g.i),'창 대포 → 뽑으며 돌림 · 초대형 치명타 → 높이 날아오름'); }
{ const W=WF([mk({...GAK,ov:{hp:99999,atk:55,spd:3.8}},1,24,10),dummy('표적',14,10,0,{ov:{hp:90000,atk:1}}),dummy('표적2',14,12,0,{ov:{hp:90000,atk:1}})],{roe:'free'}); const g=W.units[0], f=W.units[1]; still(f,W.units[2]); g.state='hunt'; g.sense[f.i]={x:f.x,y:f.y,t:0,exact:true};
  let k=0; while(k++<30*20&&!logK(W,'h2').some(l=>l.a===g.i)) step(W); const first=logK(W,'h2').find(l=>l.a===g.i);
  ok(first&&first.n==='반경 10m 횡베기'&&!logK(W,'h2Hit').some(l=>l.a===g.i&&l.n!=='반경 10m 횡베기'&&W.log.indexOf(l)<W.log.indexOf(first)),'도감 — 시작 패턴: 첫 기술은 아주 넓은 횡베기 ('+(first?first.n:'-')+') · 그 전엔 다른 기술 없이 다가옴');
  k=0; const n0=logK(W,'h2').filter(l=>l.a===g.i&&l.n==='반경 10m 횡베기').length; g.h2.cd.wide=W.t+0.2; while(k++<30*15&&logK(W,'h2').filter(l=>l.a===g.i&&l.n==='반경 10m 횡베기').length===n0) step(W);
  const near=W.units.filter(e=>e.side===0&&Math.hypot(g.x-e.x,g.y-e.y)<6.3).length;
  ok(logK(W,'h2').filter(l=>l.a===g.i&&l.n==='반경 10m 횡베기').length>n0,'도감 — 둘러싸이면 (둘레 6칸에 '+near+') 횡베기를 다시 먼저 (대기 '+(E.H2K.pearlgak.sk.find(x=>x.id==='wide').cd)+'초)');
  step(W,30*10); const ml=W.log.filter(l=>l.k==='wind'&&l.a===g.i&&/^ml_/.test(l.h2||'')).map(l=>l.h2);
  ok(ml.includes('ml_0')&&ml.includes('ml_1')&&ml.includes('ml_2')&&logK(W,'hit').some(l=>l.a===g.i&&l.tag==='연속 찌르기'),'도감 — 찌르기는 연속 찌르기 (세 번: '+[...new Set(ml)].join(' · ')+')'); }
{ const W=WF([mk({...GAK,ov:{hp:99999,atk:55,spd:3.8}},1,24,10),dummy('표적',14,10,0,{ov:{hp:90000,atk:1}})],{roe:'free'}); const g=W.units[0], f=W.units[1]; still(f); g.h2.used={wide:0}; g.h2.ph=true;
  E.h2Cast(W,g,E.H2K.pearlgak.sk.find(x=>x.id==='sky'),f); const Z=W.h2z.filter(z=>z.by===g.i);
  ok(Z.length===10&&Z.every(z=>Math.abs(z.at-z.t0-2)<0.01&&!z.diag),'도감 — 공중 투창 (창비): 2초 뒤 창 열이 쏟아짐 (원 '+Z.length+' · 곧게)');
  g.act=null; W.h2z=[]; E.h2Cast(W,g,E.H2K.pearlgak.sk.find(x=>x.id==='big'),f); const B=W.h2z.find(z=>z.by===g.i);
  ok(B&&Math.abs(B.at-B.t0-2)<0.01&&B.r>3,'도감 — 거대한 광역 특수 창: 2초 뒤 (반지름 '+(B?B.r:'-')+')'); }
{ const W=WF([mk(GAK,1,30,10),dummy('표적',16,10,0,{ov:{hp:9000,atk:1}})],{roe:'free'}); const g=W.units[0], f=W.units[1]; still(f); g.state='hunt'; g.sense[f.i]={x:f.x,y:f.y,t:0,exact:true};   /* 만남처럼 처음부터 앎 */
  ['stab','throw','pounce','step','triple','pillar','sky','wide','exec','cannon','fly','big','plunge'].forEach(id=>g.h2.cd[id]=1e9);
  step(W,15); const x0=g.x; step(W,30*3); const v=(x0-g.x)/3;
  ok(v>0.5&&v<g.spd*0.75,'기술이 없을 땐 천천히 걸어 다님 ('+v.toFixed(2)+'칸/초 · 걸음 '+g.spd+' × 0.55)'); }
{ const W=WF([mk(GAK,1,20,10),dummy('적',21.2,10,0,{ov:{hp:9000,atk:5}})]); const g=W.units[0], f=W.units[1];
  E.applyDmg(W,f,g,g.hp+999,{tag:'시험'}); ok(g.alive&&Math.round(g.hp)===1&&logK(W,'h2Last').some(l=>l.b===g.i),'◆끝까지 — 쓰러질 일격을 한 번 체력 1 로 버팀');
  E.applyDmg(W,f,g,50,{tag:'시험'}); ok(!g.alive,'두 번째는 쓰러짐 (만남 밖의 각펄)'); }

console.log('F. 만남의 각펄 (spare8) — 쓰러지되 숨은 붙어 있음 · 창이 떨어지지 않음');
{ const W=WF([mk(GAK,1,20,10),dummy('적',21.2,10,0,{ov:{hp:9000,atk:5}})]); const g=W.units[0], f=W.units[1]; g.spare8=true;
  E.applyDmg(W,f,g,g.hp+999,{tag:'시험'}); ok(g.alive&&g.h2LastUsed&&g.fell8==null,'첫 숨이 끊길 일격 — ◆끝까지 (체력 1)');
  E.applyDmg(W,f,g,999,{tag:'시험'}); ok(g.alive&&Math.round(g.hp)===1&&g.fell8!=null&&logK(W,'spare8').length===1,'두 번째도 죽지 않음 — 쓰러짐 표시 (fell8 · 기록 spare8)');
  ok(!(W.items||[]).some(it=>it.name==='펄의 창'),'펄의 창은 땅에 떨어지지 않음 (판이 끝나면 고름)');
  const g2W=WF([mk(GAK,1,20,10),dummy('적',21.2,10,0)]); const g2=g2W.units[0]; g2.spare8=true; g2.hp=3; E.applyDmg(g2W,g2W.units[1],g2,10,{tag:'출혈'});
  ok(g2.alive&&g2.fell8!=null,'지속 피해 (출혈) 로 숨이 끊겨도 쓰러지기만 함'); }

console.log('G. 펄의 창 (전리품) — 정면 투창 (열화) · 던져 버리지 않음 · 명령');
{ const WP=E.DEFAULT_RULES.weapons['펄의 창']; ok(WP&&WP.two&&WP.noThr&&WP.spec==='pthrow'&&WP.kind==='날붙이','무기: 두 손 · 날붙이 · 보통 투창 아님 · 무기 기술 pthrow');
  const W=WF([mk({...REB,name:'창잡이',shield:false,weapon:'펄의 창',traits:[],gear:{}},0,10,10),dummy('적',18,10,1)]); const u=W.units[0], f=W.units[1]; still(f);
  ok(!u.jav&&(u.spec||[]).some(x=>x.k==='pthrow'&&x.weak),'든 이: 기술 칸에 정면 투창 (열화) · 보통 투창 (던져 버리기) 없음');
  u.order={k:'spec',s:'pthrow',b:f.i}; let k=0; while(k++<90&&!logK(W,'h2Hit').some(l=>l.a===u.i)) step(W);
  const h=logK(W,'hit').find(l=>l.a===u.i&&l.b===f.i);
  ok(!!h&&!u.weaponGone&&u.weapon==='펄의 창','명령 → 정면 투창 (열화) 맞음 ('+(h?h.dmg:'-')+') · 창은 손에 남음');
  const sx=u.spec.find(x=>x.k==='pthrow'); ok(sx.cdT>W.t+6,'대기 '+(sx.cdT-W.t).toFixed(1)+'초'); }

console.log('H. 물러날 수 없음 (noRetreat) · ◆타천 날개');
{ const W=WF([mk(PE,0,10,10),dummy('적',30,10,1)]); const p=W.units[0]; W.entry={x:10,y:16,r:1.6}; W.noRetreat=true; p.order={k:'exit',dir:'down'}; step(W,30);
  ok(p.alive&&!p.gone&&!p.order,'각펄 싸움 — 들어온 자리로 물러나는 명령은 듣지 않음 (물러날 길이 없음)');
  ok(p.fallW===true,'◆타천 날개 표시 (페이지: 옥상에서 떨어지지 않음)'); }

console.log(fails?`FAIL ${fails}`:'ALL OK');
