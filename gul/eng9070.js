// v9.5.1 엔진 시험 — eng9070.js v1.0 (암계 장비 드랍 그림 이름표: 암계 병사의 장검 · 활 · 방패 · 흉갑 · 투구가 전리품이 되면 암계 이름 + art 이름표 / 암계 아닌 이의 것은 그대로)
const {E,R,U,DES,mk,W_,REB}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const base={...REB,shield:false,weapon:'장검',ov:{hp:300,atk:20},traits:[],gear:{},nv:true};
const dummy=(name,x,y,side,ex)=>mk({...base,name,...(ex||{})},side,x,y);
const WF=(al,fo)=>{ const units=[...al,...(fo||[])]; const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,1,{headless:true}); W.amb=1; E.computeLight(W); return W; };
const GEAR={ 몸:{name:'암계 흉갑',mat:'판금',tier:3}, 머리:{name:'암계 투구',mat:'투구',tier:3} };
const step=(W,n)=>{ for(let i=0;i<n;i++) E.stepWorld(W,1/30); };
console.log('A. 암계 병사 (방패 · 검)');
{ const W=WF([dummy('나',10,10,0)],[dummy('방패병',12,10,1,{origin:'암계',weapon:'장검',shield:true,shSize:'대형',gear:GEAR}),dummy('창방패병',14,10,1,{origin:'암계',weapon:'창',shield:true,shSize:'중형',gear:GEAR}),dummy('궁병',16,10,1,{origin:'암계',weapon:'활',ammo:20,gear:{몸:{name:'암계 흉갑',mat:'경갑',tier:2}}}),dummy('보통 검병',18,10,1,{weapon:'장검',gear:{}})]);
  const [me,a,b,c,d]=W.units; for(const u of [a,b,c,d]) u.ref='T-'+u.name; ok(a.origin==='암계'&&!d.origin,'유닛에 출신 (origin) — 암계');
  W.lootRoll={}; for(const u of [a,b,c]) for(const sl of ['몸','머리']) W.lootRoll['a'+u.i+sl]=0;
  for(const u of [a,b,c,d]){ u.hp=1; E.applyDmg(W,me,u,999,{tag:'시험'}); } step(W,3); const L=E.lootOf(W);
  const find=(f)=>L.find(f); const sw=find(x=>x.k==='weapon'&&x.name==='장검'&&x.art==='eq_sword'), bow=find(x=>x.k==='weapon'&&x.name==='활'), tw=find(x=>x.k==='shield'&&x.art==='eq_tower'), kt=find(x=>x.k==='shield'&&x.art==='eq_kite'), ch=find(x=>x.k==='armor'&&x.art==='eq_chest'), hm=find(x=>x.k==='helm'&&x.art==='eq_helm'), plain=find(x=>x.k==='weapon'&&x.name==='장검'&&!x.art);
  console.log('    '+L.map(x=>x.k+':'+(x.label||x.name)+(x.art?'['+x.art+']':'')).join(' · '));
  ok(sw&&/암계 장검$/.test(sw.label),'암계 병사의 장검 → "암계 장검" 그림 eq_sword'); ok(bow&&/암계 장궁$/.test(bow.label)&&bow.art==='eq_bow','활 → "암계 장궁" 그림 eq_bow');
  ok(tw&&/암계 탑 방패$/.test(tw.label),'대형 방패 → "암계 탑 방패" eq_tower'); ok(kt&&/암계 연형 방패$/.test(kt.label),'중형 방패 → "암계 연형 방패" eq_kite');
  ok(ch&&hm,'암계 흉갑 · 암계 투구 에 그림 이름표 (eq_chest · eq_helm)'); ok(plain&&!/암계/.test(plain.label),'암계가 아닌 이의 장검은 그대로 (그림 없음)');
  ok(sw&&sw.dur>0&&sw.name==='장검','이름 (name) 은 그대로 장검 — 능력 · 규칙은 안 바뀜'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
