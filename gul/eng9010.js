// v9.1.0 엔진 시험 — eng9010.js v1.1 (v1.1: v9.6.4 — 멀리 간 전우 곁 판정을 x 비교에서 거리로 · 전우조 · 대장-부하: 관계 API · 대장의 말은 바로 · 저절로 드는 편대는 없음 · 멀리 간 전우 곁으로 · 위급한 전우 구원 · 측면 협공 · 대장이 싸우는 적을 함께 봄)
const {E,R,U,DES,GOB,INJ,NOR,REB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,fn)=>{ const n=Math.round(sec*30); for(let i=0;i<n&&!W.over;i++){ E.stepWorld(W,1/30); if(fn&&fn(W)) break; } };
const SP={ref:'C-196',name:'창병A',tier:1,cls:'근접',role:'공격수',weapon:'장검',nv:true,nvG:'B',ov:{hp:120,atk:20},traits:['회피C']};
const mkW=(al,fo,seed)=>{ const W=W_(al,fo,seed||3,'free'); W.amb=1; E.computeLight(W); return W; };

console.log('A. 관계 API (바로 · 지휘망을 거치지 않음)');
{ const W=mkW([mk(INJ,0,6,8,{hero:true}),mk(REB,0,8,8),mk(GOB,0,8,10),mk(NOR,0,6,10)],[mk(DES['창병'],1,26,8,{spdMul:0})]); const [h,r,g,n]=W.units;
  let o=E.cgJoin(W,[r,g]); ok(o.ok&&o.on&&r.cg&&r.cg===g.cg,'전우조 맺음 ('+r.name+' · '+g.name+')'); ok(E.matesOf(W,r).length===1&&E.matesOf(W,r)[0]===g,'서로가 전우');
  o=E.cgJoin(W,[r,g]); ok(o.ok&&!o.on&&!r.cg&&!g.cg,'같은 둘을 다시 → 풀림');
  E.cgJoin(W,[r,g]); E.cgLeave(W,[g]); ok(!g.cg&&r.cg,'한 명만 빠짐 (남은 이는 짝 없음)');
  o=E.chiefSet(W,[g,n],r); ok(o.ok&&o.on&&g.sqLead===r.i&&n.sqLead===r.i&&g.chiefLk&&n.chiefLk,'대장 레베카 ← 청광묵 · 노먼');
  o=E.chiefSet(W,[r],g); ok(!o.ok,'서로가 서로의 부하는 안 됨 ('+(o.why||'')+')');
  o=E.chiefSet(W,[h],r); ok(!o.ok,'인주는 부하가 될 수 없음');
  const lk=(()=>{ const far=mk(GOB,0,28,2); return null; })();
  r.x=2; r.y=2; g.x=28; g.y=14; const l1=E.cmdLinkX?null:null;
  o=E.chiefSet(W,[g,n],r); ok(o.ok&&!o.on&&g.sqLead==null&&!g.chiefLk,'같은 관계를 다시 → 풀림');
  E.chiefSet(W,[g],r); const setup={units:W.units.map(()=>({}))}; E.relSync(W,setup); ok(setup.units[g.i].chiefNm==='레베카'&&setup.units[g.i].cg===''&&setup.units[r.i].chiefNm==='','관계가 배치 칸에 적힘 (다음 판에도)'); }

console.log('B. 시작 배치에서 읽음 (cg · chiefNm)');
{ const W=mkW([mk(INJ,0,6,8,{hero:true}),mk(REB,0,8,8,{cg:'a'}),mk(GOB,0,8,10,{cg:'a',chiefNm:'노먼'}),mk(NOR,0,6,10)],[mk(DES['창병'],1,26,8,{spdMul:0})]); const [h,r,g,n]=W.units;
  ok(r.cg==='a'&&g.cg==='a','전우조 읽음'); ok(g.sqLead===n.i&&g.chiefLk,'대장 노먼 읽음'); ok(Math.abs(r.slot-g.slot)===1,'전우는 서는 자리도 이웃 (슬롯 '+r.slot+' · '+g.slot+')'); }

console.log('C. 대장의 말은 바로 닿고 · 저절로 드는 편대는 없음');
{ const W=mkW([mk(INJ,0,3,3,{hero:true}),mk(NOR,0,20,12,{rank:'부대장'}),mk(GOB,0,22,14,{chiefNm:'노먼'}),mk(REB,0,6,6)],[mk(DES['창병'],1,28,2,{spdMul:0})]); const [h,n,g,r]=W.units;
  E.stepWorld(W,1/30); const lk=E.cmdLink?E.cmdLink(W,n,g):null; if(lk) ok(lk.p===1&&lk.t<=0.06,'노먼 → 청광묵 (대장 → 부하): 확률 '+lk.p+' · '+lk.t+'초 · '+lk.via); else console.log('  (cmdLink 내보내기 없음 — 건너뜀)');
  run(W,25); ok(r.sqLead==null,'지휘망 밖이어도 레베카는 저절로 편대에 들지 않음 (sqLead '+r.sqLead+')'); ok(g.sqLead===n.i,'청광묵은 노먼의 부하 그대로'); }

console.log('D. 명령으로 멀리 간 전우 곁으로 (붙어 다님)');
{ const trial=(mate)=>{ const W=mkW([mk(INJ,0,4,8,{hero:true}),mk(REB,0,6,8,mate?{cg:'m'}:{}),mk(GOB,0,6,10,mate?{cg:'m'}:{})],[mk(DES['창병'],1,29,2,{spdMul:0,hold:true})]); const [h,r,g]=W.units; E.stepWorld(W,1/30); g.order={k:'move',x:24,y:12}; r.state='follow'; let d0=null; run(W,12,()=>{ if(W.t>3.5&&d0==null) d0=Math.hypot(r.x-g.x,r.y-g.y); }); return { d: Math.hypot(r.x-g.x,r.y-g.y), rx: r.x, hx: h.x }; };
  const a=trial(true), b=trial(false); console.log('    전우: 간 전우와 '+a.d.toFixed(1)+'칸 · 레베카 x '+a.rx.toFixed(1)+' / 아닌 경우 '+b.d.toFixed(1)+'칸 · x '+b.rx.toFixed(1));
  ok(a.d<=3.3&&a.d<b.d-1,'전우는 간 전우 곁 3칸 안 ('+a.d.toFixed(1)+'칸 · 전우가 아니면 '+b.d.toFixed(1)+'칸)'); }   /* v1.1 x 비교 → 거리 (v9.6.4 짝 붙어 다니기 — 전우가 아닌 쪽도 인주를 따라 오른쪽으로 감) */

console.log('E. 위급한 전우 구원 (돌격 금지여도 구하러는 돌진)');
{ const W=mkW([mk(INJ,0,4,8,{hero:true}),mk(REB,0,14,8,{cg:'m'}),mk(GOB,0,12,8,{cg:'m',hp0:1})],[mk(SP,1,13,10,{spdMul:1}),mk(SP,1,24,8,{spdMul:0})]); const [h,r,g,f1,f2]=W.units;
  g.hp=Math.round(g.max*0.2); f1.target=g; f1.state='hunt'; f1.x=g.x+1.1; f1.y=g.y; r.x=20; r.y=8; r.state='follow'; E.stepWorld(W,1/30);
  ok(r.noChg,'레베카는 기본 돌격 금지'); let pick=null,rg=false,ch=false; run(W,4,()=>{ if(r.target===f1) pick=pick||W.t; if(r.rescueGo&&r.rescueGo>W.t) rg=true; if(r.act&&r.act.k==='charge') ch=true; });
  ok(pick!=null,'위급한 청광묵을 치는 적을 표적으로 ('+(pick!=null?pick.toFixed(2)+'초':'못 함')+')'); ok(rg,'구원 표시 (rescueGo)'); ok(ch,'기본 돌격 금지인데도 구하러는 돌진 (rescueGo)');
  const W2=mkW([mk(INJ,0,4,8,{hero:true}),mk(REB,0,20,8),mk(GOB,0,12,8)],[mk(SP,1,13,10,{spdMul:1}),mk(SP,1,24,8,{spdMul:0})]); const [h2,r2,g2,f3]=W2.units; g2.hp=Math.round(g2.max*0.2); f3.target=g2; f3.x=g2.x+1.1; f3.y=g2.y; r2.state='follow'; let rg2=false,ch2=false; run(W2,3,()=>{ if(r2.rescueGo&&r2.rescueGo>W2.t) rg2=true; if(r2.act&&r2.act.k==='charge') ch2=true; }); ok(!rg2&&!ch2,'전우가 아니면 구원 표시도 돌진도 없음 (대조)'); }

console.log('F. 전우가 붙든 적의 옆구리 (약속 pin)');
{ const W=mkW([mk(INJ,0,4,8,{hero:true}),mk(REB,0,12,8,{cg:'m'}),mk(GOB,0,9,10,{cg:'m'})],[mk(SP,1,13.4,8,{spdMul:0}),mk(SP,1,26,3,{spdMul:0})]); const [h,r,g,f]=W.units; r.target=f; r.state='fight'; g.state='follow'; let got=null; run(W,6,()=>{ const P=(W.pacts||[]).find(p=>p.mate&&p.b===g.i); if(P) got=got||{t:W.t,k:P.k}; });
  ok(got&&got.k==='pin','레베카가 붙들자 청광묵이 측면 약속을 맺음 ('+(got?got.t.toFixed(2)+'초':'없음')+')'); }

console.log('G. 대장이 싸우는 적을 부하도 앎 (시야 공유)');
{ const W=mkW([mk(INJ,0,4,8,{hero:true}),mk(REB,0,16,8),mk(GOB,0,6,12,{chiefNm:'레베카'})],[mk(SP,1,19,8,{spdMul:0})]); const [h,r,g,f]=W.units; r.target=f; r.state='fight'; let s=null; run(W,3,()=>{ r.target=f; r.state='fight'; if(g.sense[f.i]&&g.sense[f.i].shared) s=s||W.t; });
  ok(s!=null,'부하가 대장의 적을 앎 ('+(s!=null?s.toFixed(2)+'초':'못 함')+')'); }

console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
