p='ui8710.js'; s=open(p,encoding='utf-8').read()
a=" ok(!errs.length,'페이지 오류 없음 '+errs.slice(0,3).join(' | '));"
b=""" const cs = await p.evaluate(()=>{ world=null; const R=R8S(); const n=R.fm.rows[2][0]; n.t='enc'; n.card8='ENC-riddle'; R.at=n.id; r8Card(n); const el=document.getElementById('tkCard8'); return { shown: !!el&&!el.hidden, w: el?el.clientWidth:0, h: el?el.clientHeight:0, bg: el?el.style.backgroundImage:'' }; });
 await wait(p,600); await p.screenshot({ path: 'shots/v871_card.png' }); await p.evaluate(()=>{ while (TK) talkClose(); });
 ok(cs.shown&&cs.h>100&&/atlas/.test(cs.bg),'도감 카드 — 묶음 그림에서 그 칸을 가운데 크게 '+JSON.stringify(cs));
"""+a
assert s.count(a)==1; s=s.replace(a,b,1); open(p,'w',encoding='utf-8').write(s)
