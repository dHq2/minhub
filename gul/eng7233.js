// v7.23.3 시험 — eng7233.js v1.0 ([갑피] 가 덮은 장비: 갑피보다 낮은 장비는 아래에 씀 (under) — 막는 건 갑피 3성 · 무게 없음 · 쓰러지면 그 장비가 전리품 / 갑피보다 좋은 장비는 그대로 그 칸)
const {E,R,DES,INJ,KAR,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const CZ={ref:'C-045',name:'세자르',tier:6,cls:'근접',role:'공격수',weapon:'노인의 검',height:2.1,weight:70,sizeCls:'중대형',ov:{hp:2000,atk:62},traits:['보스','베테랑','갑피'],gear:{머리:{name:'노인의 왕관',mat:'투구',tier:1}}};
{ const W=W_([mk(INJ,0,11,8,{hero:true,ov:{hp:4000}})],[mk(CZ,1,12,8)],1,'hold'); const [a,k]=W.units, g=k.gear['머리'];
  ok(g.innate&&g.tier===3&&g.under&&g.under.name==='노인의 왕관','세자르 머리 — 막는 건 갑피 3성 · 그 아래에 노인의 왕관');
  ok(E.gearW?E.gearW(k.gear,W.rules)===0:true,'갑피 · 그 아래 왕관 — 무게 없음');
  E.applyDmg(W,a,k,99999,{}); const L=E.lootOf(W).map(x=>x.label||x.name); console.log('      ',JSON.stringify(L));
  ok(!k.alive&&L.includes('노인의 왕관')&&L.includes('노인의 검'),'쓰러지면 — 노인의 왕관 · 노인의 검이 전리품'); ok(!L.includes('갑피'),'갑피는 전리품이 아님'); }
{ const KH={...JSON.parse(JSON.stringify(KAR)),gear:{머리:{name:'좋은 투구',mat:'투구',tier:4}}}; const W=W_([mk(KH,0,11,8)],[mk(INJ,1,20,8)],1,'hold'); const c=W.units[0], g=c.gear['머리'];
  ok(!g.innate&&g.name==='좋은 투구'&&g.tier===4&&!g.under,'갑피보다 좋은 장비 (4성) — 그대로 그 칸'); ok(c.gear['몸'].innate&&!c.gear['몸'].under,'빈 칸은 갑피만'); }
console.log(fails?`${fails} FAIL`:'ALL 7233 OK');
