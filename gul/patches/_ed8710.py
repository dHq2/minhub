p='ui8710.js'; s=open(p,encoding='utf-8').read()
a=" // 10. 화면: 맵 위 NPC (천막)"
b=""" // 11. 자기 검토: 페흐토 손님 · 죽이면 고급 투구 · 망토 · 노라의 짐 · 죽은 단독 개체는 맵에 다시 안 나옴 · 빈 회랑에서 대장이 나가면 모두 따라감
 const au = await p.evaluate(()=>{ const R=R8S(), o={}; const rr=Math.random;
   world=null; R.f=8; F8[8]=null; R.themes[8]='medieval'; R.fm=r8Gen(8); R.flags.pehtoDead=0; R.party=R.party.filter(q=>q.name!=='페흐토'); const n=R.fm.rows[0][0]; n.ms='fight'; n.npc8=null; R.at=null; R.done=[]; Math.random=()=>0.01; try { r8Enter(n); } finally { Math.random=rr; } while (TK) talkAdv();
   o.guest=world.units.some(u=>u.side===0&&u.r8guest==='pehto'&&u.name==='페흐토');
   world=null; const m=R.fm.rows[2][0]; m.t='enc'; R.at=m.id; r8XFight('x_pehto','ruina',{}); while (TK) talkAdv(); const W=world, pe=W.units.find(u=>u.side===1&&u.name==='페흐토'); pe.alive=false; pe.hp=0; r8Tick(W);
   o.drops=W.items.filter(it=>it.how==='pehto').map(it=>it.k+':'+it.tier); o.dead=!!R.flags.pehtoDead; world=null;
   R.npcDone=[]; let pr=0; for (let t=0;t<200;t++){ const q={ id:'tp'+t, t:'enc' }; R.fm.rows[2].push(q); R.at=q.id; r8Enc(q); while (TK) talkClose(); if (q.enc==='x:pehtoR') pr++; R.fm.rows[2].pop(); world=null; } r8Hide(); o.pehtoR=pr;
   const g0=R.gold, rew=[]; r8NoraLoot(rew); o.nora={ gold: R.gold-g0, txt: rew[0] };
   R.dead=[...R.dead,'마리']; R.party=R.party.filter(q=>q.name!=='마리'); let mar=0; for (let t=0;t<60;t++){ world=null; const k=R.fm.rows[0][0]; k.npc8=undefined; k.ms='fight'; R.at=null; R.done=[]; Math.random=()=>0.05; try { r8Enter(k); } finally { Math.random=rr; } while (TK) talkAdv(); if (k.npc8==='marie') mar++; } o.marie=mar;
   world=null; R.hid={17:'hargen'}; R.f=17; F8[17]=null; R.fm=r8Gen(17); R.at=null; R.done=[]; r8Enter(R.fm.rows[0][0]); while (TK) talkAdv(); const W2=world, al=W2.units.filter(u=>u.side===0&&u.alive), h=al.find(u=>u.hero)||al[0];
   leaveMap(W2,h,'up'); for (let i=0;i<120&&!W2.over;i++){ stepWorld(W2,0.05); r8Tick(W2); } o.follow={ n: al.length, gone: al.filter(u=>u.gone==='up').length, over: !!W2.over }; R.hid={}; world=null; return o; });
 console.log('    자기 검토', JSON.stringify(au));
 ok(au.guest,'페흐토가 가끔 보통 싸움에 손님으로 끼어듦');
 ok(au.drops.includes('helm:3')&&au.drops.includes('armor:3')&&au.dead&&au.pehtoR===0,'페흐토를 죽이면 고급 투구 · 망토 갑주 · 그 뒤 유적의 페흐토 안 나옴');
 ok(au.nora.gold===120&&/탄 가득/.test(au.nora.txt),'노라를 쓰러뜨리면 상품 모두 ('+au.nora.txt+')');
 ok(au.marie===0,'죽은 마리는 맵 위에 다시 안 나옴');
 ok(au.follow.gone===au.follow.n||au.follow.over,'비전투 회랑: 대장이 나가면 모두 따라 나감 '+JSON.stringify(au.follow));
 // 10. 화면: 맵 위 NPC (천막)"""
assert s.count(a)==1; s=s.replace(a,b)
s=s.replace("ui8710.js v1.1 (v1.1:","ui8710.js v1.2 (v1.2: 자기 검토 — 페흐토 손님 · 고급 드랍 · 노라의 짐 · 죽은 단독 개체 · 비전투 회랑 따라 나감 · v1.1:")
open(p,'w',encoding='utf-8').write(s)
