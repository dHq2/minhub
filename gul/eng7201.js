// v7.20.1 시험 — eng7201.js v1.1 (v1.1: v7.25.2 부터 방어구는 낮은 확률 · 망가짐 — 여기선 규칙 칸을 '늘 · 그대로' 로 맞추고 이름 · 체급 · 내구도를 봄 (확률은 ui7252) · 전리품: 쓰러진 적의 무기 · 방패 · 갑옷 · 투구 (루팅 이름 · 체급 · 내구도) · 남은 화살은 따로 · 아군 제 것은 빠짐 · 망가진 갑옷은 빠짐)
const {E,DES,INJ,REB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const W=W_([mk(REB,0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['검방패기사'],1,9,3),mk(DES['궁수'],1,12,12),mk(DES['창병'],1,20,3)],1,'hold');
const r=W.units[0], k=W.units[2], a=W.units[3], sp=W.units[4];
a.ammo=17; k.gear['몸'].dur=40; sp.gear['몸'].dur=0;
for (const u of [k,a,sp]){ u.hp=0; u.alive=false; E.dropOnDeath(W,u); }
E.dropItem(W,r,'weapon',r.weapon,E.heldItem(r),'grab');   // 레베카가 떨어뜨린 제 것
W.rules.loot = { armorP: 1, helmP: 1, worn: [100, 100] };   // v1.1 방어구 늘 · 내구 그대로
const L=E.lootOf(W); console.log('   ', JSON.stringify(L.map(x=>[x.k,x.label||x.name,x.n||x.dur,x.size||''])));
ok(L.some(x=>x.k==='shield'&&x.label==='검방패기사의 방패'),'검방패기사의 방패');
ok(L.some(x=>x.k==='weapon'&&/^궁수의 /.test(x.label)&&x.ammo===0)&&L.some(x=>x.k==='ammo'&&x.at==='화살'&&x.n===17),'궁수의 활 (탄은 떼어) + 화살 17 따로');
ok(L.some(x=>x.k==='armor'&&x.label==='검방패기사의 갑옷'&&x.dur===40&&x.size==='중대형'),'검방패기사의 갑옷 (내구 40 · 중대형)');
ok(!L.some(x=>x.label==='창병의 갑옷'),'망가진 갑옷은 빠짐'); ok(!L.some(x=>x.own==='C-002'),'레베카가 떨어뜨린 제 것은 빠짐 (저절로 돌아옴)');
ok(E.lootOf(W)===L,'한 번 만든 목록을 그대로 씀');
console.log(fails?`\n${fails} FAIL`:'\nALL 7201 OK');
