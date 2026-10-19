p='run8_i.js'; s=open(p,encoding='utf-8').read()
a="""  for (let k = 0; k < 200 && S0.length < 3; k++){ const c = L[Math.floor(Math.random() * L.length)]; if (!c) break; if (S0.some(o => Math.hypot(o.x - c[0], o.y - c[1]) < 7)) continue;"""
b="""  for (let k = 0; k < 600 && S0.length < 3; k++){ const c = L[Math.floor(Math.random() * L.length)]; if (!c) break; const gap = k < 200 ? 7 : k < 400 ? 5 : 3; if (S0.some(o => Math.hypot(o.x - c[0], o.y - c[1]) < gap)) continue;   // 좁은 맵은 문양 사이를 좁힘"""
assert s.count(a)==1; s=s.replace(a,b)
s=s.replace("/* ===== run8_i.js v1.4 —","/* ===== run8_i.js v1.5 —").replace("   v1.4: v8.7.1.1 맵 장치","   v1.5: 좁은 지나가기 맵에도 봉인 문양 셋 (사이 7 → 5 → 3칸)\n   v1.4: v8.7.1.1 맵 장치")
open(p,'w',encoding='utf-8').write(s)
p='ui8711.js'; s=open(p,encoding='utf-8').read()
a="const h=W.units.find(a=>a.side===0&&a.alive); h.x=u.x-3.2; h.y=u.y;"
b="const h=W.units.find(a=>a.side===0&&a.alive), m=W.map; let spot=null; for (let r=2;r<=4&&!spot;r++) for (let a=0;a<16&&!spot;a++){ const x=Math.floor(u.x+Math.cos(a*0.39)*r), y=Math.floor(u.y+Math.sin(a*0.39)*r); if (x>0&&y>0&&x<m.W&&y<m.H&&m.t[y*m.W+x]===0) spot=[x+0.5,y+0.5]; } if (spot){ h.x=spot[0]; h.y=spot[1]; } h.order={k:'hold'};"
assert s.count(a)==1; s=s.replace(a,b)
s=s.replace("ui8711.js v1.2 (v1.2:","ui8711.js v1.3 (v1.3: 설비 쏘기 시험은 설비 가까운 빈 바닥에 세움 · v1.2:")
open(p,'w',encoding='utf-8').write(s)
