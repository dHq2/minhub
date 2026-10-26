const {E,R}=require('./t4.js'); const {base}=require('./t52.js');
const N=+process.argv[2]||100;
const kinds={}, moods={}, stance={}, sideK=[{},{}], whyHit={front:0,side:0,back:0}, res={}; let T=0, amb=0, hits=0, ffHits=0, ffDmg=0;
for (let j=0;j<N;j++){ const W=E.runAuto(base(),R,j*7+11); res[W.result]=(res[W.result]||0)+1; T+=W.t;
  for (const l of W.log){ kinds[l.k]=(kinds[l.k]||0)+1; const a=l.a!=null&&W.units[l.a]?W.units[l.a]:null;
    if (a && ['charge','sweep','stomp','bash','dodge','peel','pinDown','throw','hold','leap','squad','impact','stun','maim','cripple','pickItem','shove','prone','retarget','spot','brief','cover','shout'].includes(l.k)) sideK[a.side][l.k]=(sideK[a.side][l.k]||0)+1;
    if (l.k==='mood') moods[(W.units[l.a].side?'적:':'아:')+l.m]=(moods[(W.units[l.a].side?'적:':'아:')+l.m]||0)+1;
    if (l.k==='stance') stance[(l.side?'적 ':'아 ')+l.s+(l.why?'('+l.why+')':'')]=(stance[(l.side?'적 ':'아 ')+l.s+(l.why?'('+l.why+')':'')]||0)+1;
    if (l.k==='hit' && !l.block && l.dir){ whyHit[l.dir]++; hits++; if (l.ambush) amb++; if (l.ff){ ffHits++; ffDmg+=l.dmg; } }
  } }
const f=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+':'+(v/N).toFixed(2)).join('  ');
console.log('결과',JSON.stringify(res),'평균',(T/N).toFixed(1)+'s');
console.log('\n[아군 행동/판]', f(sideK[0])); console.log('\n[적 행동/판]', f(sideK[1]));
console.log('\n[대치]', f(stance));
console.log('\n[맞은 방향] 앞',(whyHit.front/hits*100).toFixed(0)+'% 옆',(whyHit.side/hits*100).toFixed(0)+'% 뒤',(whyHit.back/hits*100).toFixed(0)+'%  암살',amb,'오사',ffHits,'(피해 '+ffDmg+')');
const top=Object.entries(moods).sort((a,b)=>b[1]-a[1]);
console.log('\n[아군 의도 상위]', top.filter(x=>x[0].startsWith('아:')).slice(0,28).map(([k,v])=>k.slice(2)+':'+(v/N).toFixed(1)).join('  '));
console.log('\n[적 의도 상위]', top.filter(x=>x[0].startsWith('적:')).slice(0,28).map(([k,v])=>k.slice(2)+':'+(v/N).toFixed(1)).join('  '));
