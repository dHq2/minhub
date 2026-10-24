// v9.1.0 전우조 · 대장-부하 UI 시험 — ui9010.js v1.0 (배치 상자 · 옛 2편대 = 부대장의 부하 · 명령 칸 🤝 🎖 ✂ · 여럿 고르기 / 한 명 + 짝 누르기 · 같은 관계 다시 = 풀림 · 파란 굵은 선 · 로그 · 저장 · 휴대폰 단추)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const mkp = async (vw)=>{ const ctx=await b.newContext({viewport:vw||{width:1280,height:860}}); const p=await ctx.newPage(); p.errs=[]; p.on('pageerror',e=>p.errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true'); await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900); return p; };
 const p = await mkp();
 console.log('A. 배치 상자 (옛 2편대 → 부대장의 부하)');
 const a = await p.evaluate(()=>{ renderSqBox(); const k=n=>S.units.findIndex(u=>u.name===n); const box=document.getElementById('sqBoxP');
   return { ch: ['청광묵','친칠라','레베카','노먼'].map(n=>n+':'+relChiefName(S.units[k(n)])).join(' · '), sel: box.querySelectorAll('select[data-relchief]').length, mate: box.querySelectorAll('select[data-relmate]').length, old: !!box.querySelector('[data-sqk]'), txt: box.innerText.includes('2편대') }; });
 console.log('    ', JSON.stringify(a)); ok(a.ch==='청광묵:노먼 · 친칠라:노먼 · 레베카: · 노먼:','청광묵 · 친칠라는 노먼의 부하 · 나머지는 인주'); ok(a.sel>=5&&a.mate>=5&&!a.old&&!a.txt,'대장 · 전우 고르기 상자 (본대 / 2편대 단추는 없어짐)');
 console.log('B. 상자에서 고르기 (배치)');
 const bb = await p.evaluate(()=>{ const k=n=>S.units.findIndex(u=>u.name===n); const fire=(sel,v)=>{ const el=document.querySelector('#sqBoxP '+sel); el.value=v; el.dispatchEvent(new Event('change',{bubbles:true})); };
   fire('select[data-relmate="'+k('레베카')+'"]','카리우스'); const r=S.units[k('레베카')], c=S.units[k('카리우스')];
   const mateOk = r.cg && r.cg===c.cg; fire('select[data-relchief="'+k('친칠라')+'"]','레베카');
   const chOk = S.units[k('친칠라')].chiefNm==='레베카' && S.units[k('청광묵')].chiefNm==='노먼';
   return { mateOk, chOk, cg:r.cg }; });
 ok(bb.mateOk,'레베카 ↔ 카리우스 전우조 (배치 칸 cg '+bb.cg+')'); ok(bb.chOk,'친칠라의 대장을 레베카로 · 청광묵은 노먼 그대로 (옛 편대가 이름표로 바뀜)');
 console.log('C. 판에서 (start)');
 await p.evaluate(()=>{ start(); }); await p.waitForTimeout(500);
 const c = await p.evaluate(()=>{ const W=world, N=n=>W.units.find(u=>u.name===n); const r=N('레베카'), k=N('카리우스'), ch=N('친칠라'), g=N('청광묵'), n=N('노먼');
   let err=null; try { draw(); } catch(e){ err=e.message; }
   return { mate: r.cg&&r.cg===k.cg, ch: ch.sqLead===r.i&&ch.chiefLk, g: g.sqLead===n.i&&g.chiefLk, slot: Math.abs(r.slot-k.slot), err, mode }; });
 console.log('    ', JSON.stringify(c)); ok(c.mate&&c.ch&&c.g,'판에 그대로: 전우조 · 친칠라→레베카 · 청광묵→노먼'); ok(c.slot===1,'전우는 서는 자리도 이웃'); ok(!c.err,'관계 선 그리기 오류 없음 '+(c.err||''));
 await p.screenshot({ path:'ui9010_a.png' }).catch(()=>{});
 console.log('D. 명령 칸 🤝 🎖 ✂');
 await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); sel=new Set([N('노먼').i, N('청광묵').i]); hud(); });
 await p.waitForTimeout(200);
 const d0 = await p.evaluate(()=>({ rels: !!document.querySelector('#orders .rels'), mate: !!document.querySelector('#orders [data-ord="mate"]'), chief: !!document.querySelector('#orders [data-ord="chief"]'), cut: !!document.querySelector('#orders [data-ord="relcut"]'), txt: document.querySelector('#orders .rels')?.innerText }));
 console.log('    ', JSON.stringify(d0)); ok(d0.rels&&d0.mate&&d0.chief&&d0.cut,'명령 칸에 관계 줄 (🤝 🎖 ✂)');
 // 둘 이상 골라 🤝 → 바로 맺음
 await p.click('#orders [data-ord="mate"]'); await p.waitForTimeout(150);
 const d1 = await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); const a=N('노먼'), g=N('청광묵'); return { on: !!a.cg&&a.cg===g.cg, saved: S.units[a.i].cg===a.cg&&!!a.cg, log: world.log.some(l=>l.k==='cgOn'), toast: document.getElementById('toast')?.innerText||'' }; });
 ok(d1.on,'노먼 · 청광묵을 골라 🤝 → 바로 전우조'); ok(d1.saved,'배치 칸에 적힘 (다음 판 · 다음 층에도)'); ok(d1.log,'로그에 전우조 기록');
 // 다시 → 풀림
 await p.click('#orders [data-ord="mate"]'); await p.waitForTimeout(150);
 ok(await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); return !N('노먼').cg&&!N('청광묵').cg; }),'같은 둘에게 🤝 를 또 누르면 풀림');
 // 한 명 고르고 🤝 → 짝을 누름
 await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); sel=new Set([N('카리우스').i]); hud(); }); await p.waitForTimeout(150);
 await p.click('#orders [data-ord="mate"]'); await p.waitForTimeout(100);
 ok(await p.evaluate(()=>relPick==='mate'),'한 명이면 연결 모드 (짝을 누르세요)');
 await p.click('#party [data-ally="'+(await p.evaluate(()=>world.units.find(u=>u.name==='친칠라').i))+'"]'); await p.waitForTimeout(150);
 const d2 = await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); const k=N('카리우스'), c=N('친칠라'), r=N('레베카'); return { pair: !!c.cg&&c.cg===k.cg, relPick, rLeft: r.cg!==k.cg }; });
 console.log('    ', JSON.stringify(d2)); ok(d2.pair&&!d2.relPick,'카리우스 → 친칠라를 누르니 전우조 (연결 모드 끝)'); ok(d2.rLeft,'카리우스가 레베카 곁을 떠나 친칠라와 (한 사람은 한 전우조)');
 // 🎖: 부하를 고르고 → 대장 누름
 await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); sel=new Set([N('카리우스').i]); hud(); }); await p.waitForTimeout(150);
 await p.click('#orders [data-ord="chief"]'); await p.waitForTimeout(100);
 ok(await p.evaluate(()=>relPick==='chief'),'부하를 고르고 🎖 → 대장을 누르세요');
 await p.click('#party [data-ally="'+(await p.evaluate(()=>world.units.find(u=>u.name==='노먼').i))+'"]'); await p.waitForTimeout(150);
 const d3 = await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); const k=N('카리우스'), n=N('노먼'); return { ok: k.sqLead===n.i&&k.chiefLk, saved: S.units[k.i].chiefNm==='노먼', lead: leadOf(world,k)===n }; });
 console.log('    ', JSON.stringify(d3)); ok(d3.ok&&d3.saved&&d3.lead,'카리우스가 노먼의 부하 (인주 대신 노먼을 따름 · 배치 칸에 적힘)');
 // 인주를 누르면 풀림
 await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); sel=new Set([N('카리우스').i]); hud(); }); await p.waitForTimeout(100);
 await p.click('#orders [data-ord="chief"]'); await p.waitForTimeout(100);
 await p.click('#party [data-ally="'+(await p.evaluate(()=>world.units.find(u=>u.hero).i))+'"]'); await p.waitForTimeout(150);
 ok(await p.evaluate(()=>{ const k=world.units.find(u=>u.name==='카리우스'); return k.sqLead==null&&!k.chiefLk&&S.units[k.i].chiefNm===''; }),'인주를 대장으로 누르면 부하 관계가 풀림 (기본으로)');
 // ✂ 관계 풀기
 await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); sel=new Set([N('카리우스').i, N('친칠라').i]); hud(); }); await p.waitForTimeout(100);
 await p.click('#orders [data-ord="relcut"]'); await p.waitForTimeout(100);
 ok(await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); return !N('카리우스').cg&&!N('친칠라').cg&&!N('친칠라').chiefLk&&N('친칠라').sqLead==null; }),'✂ 관계 풀기: 전우조도 대장도 풀림');
 // 연결 모드 Esc
 await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); sel=new Set([N('카리우스').i]); hud(); }); await p.click('#orders [data-ord="chief"]'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
 ok(await p.evaluate(()=>relPick===null),'Esc 로 연결 모드 취소');
 console.log('E. 카드 줄 표시 · 판 위 선');
 await p.evaluate(()=>{ const W=world, N=n=>W.units.find(u=>u.name===n); cgJoin(W,[N('레베카'),N('카리우스')]); chiefSet(W,[N('친칠라')],N('노먼')); relSave(); sel=new Set([N('레베카').i]); hud(); });
 await p.waitForTimeout(300);
 const e = await p.evaluate(()=>({ card: document.getElementById('party').innerHTML.includes('🤝'), crown: document.getElementById('party').innerHTML.includes('부하'), err: (()=>{ try { draw(); return null; } catch(x){ return x.message; } })() }));
 ok(e.card,'카드 줄에 🤝 전우 표시'); ok(e.crown,'카드 줄에 대장 · 부하 표시'); ok(!e.err,'그리기 오류 없음');
 await p.screenshot({ path:'ui9010_b.png' }).catch(()=>{});
 // 판 위 선: 스크린샷에서 굵은 파란 선 픽셀을 셈 (캔버스는 file:// 이라 읽을 수 없음)
 await p.evaluate(()=>{ const W=world, N=n=>W.units.find(u=>u.name===n), a=N('레베카'), k=N('카리우스'); k.x=a.x+3; k.y=a.y; draw(); });
 await p.screenshot({ path:'ui9010_c.png' });
 const px = +require('child_process').execFileSync('python3',['-c',"from PIL import Image\nim=Image.open('ui9010_c.png').convert('RGB')\nn=0\nfor r,g,b in im.getdata():\n  if r<110 and 120<g<190 and b>230: n+=1\nprint(n)"]).toString().trim();
 console.log('    파란 선 픽셀', px); ok(px>200,'전우 사이에 굵은 파란 선이 그려짐 ('+px+' 픽셀)');
 console.log('F. 다음 판에도 (저장된 배치로 다시 시작)');
 await p.evaluate(()=>{ world=null; mode='edit'; }); await p.evaluate(()=>{ start(); }); await p.waitForTimeout(400);
 const f = await p.evaluate(()=>{ const N=n=>world.units.find(u=>u.name===n); return { mate: !!N('레베카').cg&&N('레베카').cg===N('카리우스').cg, ch: N('친칠라').sqLead===N('노먼').i && N('청광묵').sqLead===N('노먼').i }; });
 ok(f.mate&&f.ch,'다시 시작해도 관계가 그대로');
 ok(!p.errs.length,'페이지 오류 없음 '+JSON.stringify(p.errs.slice(0,3)));
 console.log('G. 휴대폰 단추');
 const m = await mkp({width:412,height:880}); await m.evaluate(()=>{ start(); }); await m.waitForTimeout(500); await m.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='레베카').i]); hud(); }); await m.waitForTimeout(300);
 const mm = await m.evaluate(()=>({ mate: !!document.querySelector('[data-dk="mate"]'), chief: !!document.querySelector('[data-dk="chief"]'), old: !!document.querySelector('[data-dk="squad"]') }));
 ok(mm.mate&&mm.chief&&!mm.old,'휴대폰 조작판에 🤝 · 🎖 (옛 편대 단추는 없어짐)'); ok(!m.errs.length,'휴대폰 오류 없음 '+JSON.stringify(m.errs.slice(0,2)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
