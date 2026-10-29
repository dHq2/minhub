// ui8800.js v1.1 (v1.1 · v9.14.3: 층 회복 확인 — 새로 합류한 동료 (층 뽑기에 꼭 한 장 · v9.14.2) 는 체력 기록이 없음 = 가득 · 그대로 통과)
// (v8.8.7: 2층이 고정층 (무너진 유적) 이 되어, 옛 2층 흐름을 쓰는 이 시험은 FIX8[2] 를 지우고 시작)
// v8.8.0 UI 시험 — ui8800.js v1.0 (v1.0: 위층으로 — 층 지도 ▲ · ▼ (층마다 남긴 상태 · 처음 들어설 때만 회복 · 카드 · 뽑기 · 다시 온 층의 안 간 칸 · 3층 오감 셈 ·
//   가 본 아래층은 떠난 자리 · 다시 불러와도 층 정의 그대로) · 싸움판 안 ▲ 올라가는 계단 (단추 · 그림 · 명령 글 · 나가면 앞 칸 · 여정 기록) ·
//   한 일대로 성장 (방어 · 의학 · 은신 · 지휘 · 많이 한 일부터 · 상한 A · 수련은 보인 하나만) · [방어X] 글 · 아이콘 · 정산 글 · 닿은 명령 (진짜 명령 길))
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const dir = process.argv[2]||'build', url='file://'+process.cwd()+'/'+dir+'/wrapped.html';
 const TALKEND = "{ let g=0; while (TK && g++<200){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); } }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1200); await p.evaluate(()=>{ delete FIX8[2]; });   /* v8.8.7 옛 2층 (무작위 지대) 흐름으로 시험 */

 // 0) [방어X] · 성장 갈래 (설계에 바로)
 const g0 = await p.evaluate(()=>{ const d=traitDesc('방어A');
   return { keys: GRADE_KEYS.includes('방어'), re: traitKnown('방어A')&&traitKnown('방어C')&&!traitKnown('방어E'), d, ico: ICO.map['방어'], G: JSON.stringify(rules.grades['방어']), up: NODE8.up&&NODE8.down&&NODE8.up.ic+NODE8.down.ic,
     grow: Object.keys(GROW).join(','), gk: icoKey('방어B').join('') }; });
 console.log('    ', JSON.stringify(g0));
 ok(g0.keys&&g0.re&&g0.ico===8&&g0.gk==='방어B'&&g0.G==='{"S":1,"A":0.9,"B":0.8,"C":0.7}','[방어X] 등급: 등급 목록 · 검사 (S ~ C) · 아이콘 (막기 8) · 수치표 바닥 '+g0.G);
 ok(/적어도 0\.9/.test(g0.d)&&/막는 폭 ×0\.96/.test(g0.d)&&/받는 피해 ×0\.28/.test(g0.d)&&/자세 ×1\.1/.test(g0.d)&&/상한 A/.test(g0.d),'[방어A] 글: '+g0.d.slice(0,90)+'…');
 ok(g0.grow==='사격,회피,속력,근력,방어,의학,은신,지휘,체력','성장 갈래 '+g0.grow);

 const gr = await p.evaluate(()=>{ const mk=(k,tr)=>{ const q={ ...clone(fromDesign(designByKey(k),0)) }; q.traits=tr.slice(); return q; };
   const o={};
   { const a=mk('레베카',[]); o.d1=growFor(a,{ blocked:60, gT:0.5 }).join(); o.d1t=a.traits.join(); }
   { const a=mk('레베카',['방어C']); o.d2=growFor(a,{ blocked:60, gT:0.7 }).join(); }
   { const a=mk('레베카',[]); o.d3=growFor(a,{ blocked:60, gT:0.85 }).join(); }
   { const a=mk('레베카',['베테랑']); o.d4=growFor(a,{ blocked:60, gT:0.9 }).join(); }
   { const a=mk('레베카',['방어A']); o.d5=growFor(a,{ blocked:999, gT:0.9 }).join(); }
   { const a=mk('레베카',[]); o.d6=growFor(a,{ blocked:3, gT:0.5 }).join(); }
   { const a=mk('노먼',[]); o.h1=growFor(a,{ healed:400 }).join(); o.h1t=a.traits.join(); }
   { const a=mk('노먼',['의학B']); o.h2=growFor(a,{ healed:400 }).join(); }
   { const a=mk('노먼',['의학A']); o.h3=growFor(a,{ healed:4000 }).join(); }
   { const a=mk('인주',[]); o.s1=growFor(a,{ sneak:200, stB:0.7 }).join(); }
   { const a=mk('인주',[]); o.s2=growFor(a,{ sneak:200, stB:0.88 }).join(); }
   { const a=mk('인주',[]); o.s3=growFor(a,{ sneak:200, stB:0.07 }).join(); }
   { const a=mk('인주',['은신D']); o.s4=growFor(a,{ sneak:200, stB:0.7 }).join(); o.s4t=a.traits.join(); }
   { const a=mk('인주',[]); o.s5=growFor(a,{ sneak:200, stB:0.25 }).join(); }
   { const a=mk('인주',[]); o.c1=growFor(a,{ cmds:400 }).join(); }
   { const a=mk('인주',['지휘B']); o.c2=growFor(a,{ cmds:400 }).join(); }
   { const a=mk('인주',['지휘A']); o.c3=growFor(a,{ cmds:4000 }).join(); }
   { const a=mk('인주',['지휘관']); o.c4=growFor(a,{ cmds:400 }).join(); o.c4t=a.traits.join(); }
   { const a=mk('인주',[]); o.x=growFor(a,{ healed:600, blocked:40, gT:0.5, hits:9 }); }
   { const a=mk('인주',[]), t0=a.traits.slice(); const out=growFor(a,{ hits:99, dodges:99, moved:999, meleeDealt:999, taken:0 },1); o.t1=out.join(); o.t1d=a.traits.filter(z=>!t0.includes(z)).join(); }
   { const a=mk('인주',[]), t0=a.traits.slice(); const out=growFor(a,{ hits:99, dodges:99, moved:999, meleeDealt:999, taken:0 }); o.t2=out.length; o.t2d=a.traits.filter(z=>!t0.includes(z)).length; }
   return o; });
 console.log('    ', JSON.stringify(gr));
 ok(gr.d1==='방어 C 새로 얻음'&&/방어C/.test(gr.d1t)&&gr.d2==='방어 C → B'&&gr.d3==='방어 A 새로 얻음'&&gr.d4===''&&gr.d5===''&&gr.d6==='','방어: 막아 낸 공격 → C · C → B · 이미 0.85 면 B 를 건너 A · 베테랑 (0.9 = A) 은 상한 밖 · A 에서 멈춤 · 적게 막으면 그대로');
 ok(gr.h1==='의학 B 새로 얻음'&&gr.h2==='의학 B → A'&&gr.h3==='','의학: 치유 → 없으면 (= C ×1) B · B → A · A 에서 멈춤');
 ok(gr.s1==='은신 A 새로 얻음'&&gr.s2===''&&gr.s3===''&&gr.s4==='은신 D → C'&&/은신C/.test(gr.s4t)&&!/은신D/.test(gr.s4t)&&gr.s5==='은신 E 새로 얻음','은신: 타고난 솜씨 0.7 → A · 0.88 (A 넘음) 그대로 · 거구 (숨을 수 없음) 그대로 · D → C · 0.25 → E');
 ok(gr.c1==='지휘 C 새로 얻음'&&gr.c2==='지휘 B → A'&&gr.c3===''&&gr.c4==='지휘 C 새로 얻음'&&/지휘관/.test(gr.c4t),'지휘: 닿은 명령 → C · B → A · A 에서 멈춤 · [지휘관] 같은 이름은 등급이 아님 (그대로 둠)');
 ok(gr.x.length===2&&/^의학/.test(gr.x[0])&&/^방어/.test(gr.x[1]),'많이 한 일부터 · 한 판에 둘까지: '+gr.x.join(' · '));
 ok(gr.t1&&gr.t1d.split(',').length===1&&gr.t2===2&&gr.t2d===2,'수련 (하나) — 보인 것만 자람 ('+gr.t1+' · 바뀐 특성 '+gr.t1d+') · 둘 자리면 둘');

 // 1) 30층 여정으로
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 const draw = async () => { await p.evaluate(TALKEND); await p.waitForSelector('#r8dGo', { state: 'attached', timeout: 15000 }); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); }); await wait(p,150); await p.evaluate(TALKEND); await p.evaluate(()=>{ if (!$('run8') || $('run8').hidden || !$('run8').querySelector('.r8map')) r8MapShow(); }); await wait(p,100); };
 await draw();
 await p.evaluate(()=>{ const R=R8S(); R.flags.calderapSeen=1; R.flags.hargenSeen=1; if (R.hid && R.hid[2] && R.hid[2]!=='none'){ R.hid[2]='none'; R.fm=r8Gen(2); } save(); r8MapShow(); });
 const btn = () => p.evaluate(()=>{ const el=$('run8'); const q=s=>el.querySelector(s); return { up: q('[data-r8="up"]') ? q('[data-r8="up"]').textContent : '', down: q('[data-r8="down"]') ? q('[data-r8="down"]').textContent : '', av: [...el.querySelectorAll('.r8n.av')].map(x=>x.dataset.r8n).sort().join(','), desc: (q('#r8desc')||{}).textContent||'' }; });
 const f2 = await p.evaluate(()=>({ f: R8S().f, fms: Object.keys(R8S().fms||{}).join() }));
 const b2 = await btn();
 ok(f2.f===2&&!b2.up&&!b2.down,'2층 (여정의 첫 층) — ▲ 위층 없음 · ▼ 없음 ('+JSON.stringify(b2.up+b2.down)+')');

 // 2층을 마침 (첫 줄부터 한 칸씩 · 갈림 줄은 첫 칸) → 3층 (처음: 회복 · 카드 · 뽑기)
 const pass = () => p.evaluate(()=>{ const R=R8S(), rows=R.fm.rows; R.done=rows.map(r=>r[0].id); R.at=rows[rows.length-1][0].id; for (const q of R.party) q.hpNow=1; save(); r8Next(); });
 await pass(); await draw();
 const f3 = await p.evaluate(()=>{ const R=R8S(); return { f: R.f, fms: Object.keys(R.fms||{}).join(), hp: R.party.every(q=>q.hpNow==null||q.hpNow>1), keep: !!(R.fms[2]&&R.fms[2].done.length===R.fms[2].fm.rows.length), f3n: R.flags.f3n||0, name: (F8[3]||{}).name }; });
 const b3 = await btn();
 ok(f3.f===3&&f3.fms==='2'&&f3.keep&&f3.hp,'3층 처음 — 2층을 남김 (마친 칸 그대로) · 층 회복 · 뽑기 ('+f3.name+')');
 ok(b3.up==='▲ 2층으로'&&!b3.down,'3층 지도: ▲ 2층으로 · ▼ 없음');

 // ▲ 2층으로: 회복 · 카드 · 뽑기 없음 · 다시 온 층의 안 간 칸
 await p.evaluate(()=>{ for (const q of R8S().party) q.hpNow=1; $('run8').querySelector('[data-r8="up"]').click(); });
 await wait(p,200);
 const u2 = await p.evaluate(()=>{ const R=R8S(), all=R.fm.rows.flat(); const exp=all.filter(n=>!R.done.includes(n.id)&&(n.r===0||all.some(m=>R.done.includes(m.id)&&m.next.includes(n.id)))).map(n=>n.id).sort().join(',');
   return { f: R.f, fms: Object.keys(R.fms||{}).join(), hp1: R.party.every(q=>q.hpNow===1), passed: r8Passed(), av: r8Avail().slice().sort().join(','), exp, draw: !!$('r8dGo'), card: !$('ldFx') || $('ldFx').hidden, toast: [...document.querySelectorAll('.toast,#toast')].map(x=>x.textContent).join(' | '), log: R.log.slice(-1)[0], jr: ((S.camp.jr||{}).visits||[]).slice(-1)[0] }; });
 const b2b = await btn();
 console.log('    ', JSON.stringify({ ...u2, jr: u2.jr && u2.jr.name }));
 ok(u2.f===2&&u2.fms==='3'&&u2.hp1&&!u2.draw&&u2.card,'▲ 2층 — 3층을 남김 · 회복 없음 · 층 카드 · 뽑기 없음');
 ok(u2.passed&&u2.av&&u2.av===u2.exp&&b2b.av===u2.exp,'다시 온 층: 안 간 칸 (마친 칸에 이어진) 이 빛남 — '+u2.av);
 ok(/다시 온 층/.test(b2b.desc)&&b2b.down==='▼ 3층으로'&&!b2b.up,'글 "'+b2b.desc.slice(0,30)+'…" · ▼ 3층으로 · (2층이라 ▲ 없음)');
 ok(u2.log&&u2.log.k==='up'&&u2.log.from===3&&u2.jr&&/2층 ▲ 위층으로/.test(u2.jr.name),'여정 기록 · 로그에 위층으로');

 // 안 간 칸 하나를 들름 (쉼터로 바꿔서) → 남은 칸이 하나 줄어듦
 const rest = await p.evaluate(()=>{ const R=R8S(), id=r8Avail()[0], n=r8Node(id); n.t='rest'; delete n.e; r8Enter(n); const okp=!!$('r8rest'); $('r8rest').click(); return { okp, done: R.done.includes(id), av: r8Avail().length, f: R.f, map: !!$('run8').querySelector('.r8map') }; });
 ok(rest.okp&&rest.done&&rest.f===2&&rest.map&&rest.av===u2.av.split(',').length-1,'안 간 칸 (쉼터) 을 들르면 마친 칸이 되고 지도로 (남은 칸 '+rest.av+')');

 // ▼ 3층으로: 떠난 자리 그대로 · 3층을 오감 (f3n +1) · 회복 없음
 const f3n0 = await p.evaluate(()=>R8S().flags.f3n||0);
 await p.evaluate(()=>{ for (const q of R8S().party) q.hpNow=1; $('run8').querySelector('[data-r8="down"]').click(); });
 await wait(p,150);
 const d3 = await p.evaluate(()=>{ const R=R8S(); return { f: R.f, fms: Object.keys(R.fms||{}).join(), hp1: R.party.every(q=>q.hpNow===1), f3n: R.flags.f3n||0, at: R.at, done: R.done.length, draw: !!$('r8dGo') }; });
 ok(d3.f===3&&d3.fms==='2'&&d3.hp1&&!d3.draw&&d3.f3n===f3n0+1,'▼ 3층 — 떠난 자리 그대로 · 회복 · 뽑기 없음 · 3층을 오간 수 +1 ('+f3n0+' → '+d3.f3n+')');

 // 3층을 마침 → 4층 (처음) · 4층에서 ▲ ▲ ▼ ▼ (상태 그대로 · 3층 오감 셈)
 await pass(); await draw();
 const f4 = await p.evaluate(()=>{ const R=R8S(); window.__fm4=JSON.stringify(R.fm); window.__nm4=(F8[4]||{}).name; return { f: R.f, fms: Object.keys(R.fms||{}).sort().join(), n: R.flags.f3n||0 }; });
 ok(f4.f===4&&f4.fms==='2,3','4층 처음 — 2층 · 3층을 남김');
 const hop = await p.evaluate(()=>{ const R=R8S(), seq=[]; const go=k=>{ $('run8').querySelector(`[data-r8="${k}"]`).click(); seq.push(R.f+':'+(R.flags.f3n||0)); };
   go('up'); go('up'); go('down'); go('down'); return { seq: seq.join(' '), same: JSON.stringify(R.fm)===window.__fm4, fms: Object.keys(R.fms||{}).sort().join() }; });
 ok(hop.seq===`3:${f4.n+1} 2:${f4.n+1} 3:${f4.n+2} 4:${f4.n+2}`&&hop.same&&hop.fms==='2,3','▲▲▼▼ — '+hop.seq+' (3층에 닿을 때마다 셈) · 4층 지도 그대로');
 // 다음 층 (r8Next) 이 가 본 층이면 떠난 자리로 (뽑기 없음)
 const nx = await p.evaluate(()=>{ const R=R8S(); r8FloorGo(3); r8Next(); return { f: R.f, same: JSON.stringify(R.fm)===window.__fm4, draw: !!$('r8dGo') }; });
 ok(nx.f===4&&nx.same&&!nx.draw,'가 본 아래층으로 이어지는 계단 (r8Next) — 새로 만들지 않고 떠난 자리로');

 // 다시 불러오기: 층 정의 (F8) 를 저장된 대로
 await p.evaluate(()=>save()); await p.reload(); await wait(p,1600); await p.evaluate(TALKEND);
 const rl = await p.evaluate(()=>{ const R=R8S(); return { f: R.f, def: !!(F8[R.f]&&'fixed8' in F8[R.f]), name: (F8[R.f]||{}).name, nm4: null, same: JSON.stringify(R.fm), map: !!($('run8')&&!$('run8').hidden&&$('run8').querySelector('.r8map')), up: !!($('run8')&&$('run8').querySelector('[data-r8="up"]')) }; });
 const nm4 = f4.n; // (이름은 앞에서 window 에 둠 — 다시 불러오면 사라지므로 아래에서 견줌)
 ok(rl.f===4&&rl.def&&rl.map&&rl.up,'다시 불러오기 — 4층 정의를 되살림 ('+rl.name+') · 지도 · ▲');

 // 2) 싸움판 안 ▲ 올라가는 계단
 const bt = await p.evaluate(()=>{ const R=R8S(), av=r8Avail(), n=av.map(r8Node).find(x=>x.t==='fight'&&!x.champ); if (!n) return { err: 'no fight' }; window.__n=n.id; n.ms='fight'; r8Enter(n); return { id: n.id }; });
 await wait(p,600); await p.evaluate(TALKEND); await wait(p,300); await p.evaluate(TALKEND);
 const b1 = await p.evaluate(()=>{ const W=world; if (!W) return { err: 'no world' }; campBarRender(true); const bar=$('campBar').innerHTML; const lb=[orderLabel(W,['exit','down']), orderLabel(W,['exit','up'])];
   return { r8: !!W.r8, entry: !!W.entry, btn: /data-cexit="down"[^>]*>▲ 올라가는 계단</.test(bar), old: /물러나기/.test(bar), lb: lb.join(' | ') }; });
 ok(b1.r8&&b1.entry&&b1.btn&&!b1.old,'싸움판 띠: ▲ 올라가는 계단 (예전 ↩ 물러나기 없음)');
 ok(b1.lb==='▲ 올라가는 계단으로 | ▼ 출구로','명령 글 (여정): '+b1.lb);
 // 그림: 들어온 자리에 ▲ 올라가는 계단
 await p.evaluate(()=>{ window.__txt=[]; const f0=CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText=function(t,...a){ window.__txt.push(String(t)); return f0.call(this,t,...a); }; });
 await wait(p,500);
 const dr = await p.evaluate(()=>({ up: window.__txt.some(t=>/▲ 올라가는 계단/.test(t)), n: window.__txt.length, art: S.art8 }));
 ok(dr.up||!dr.art,'그림: 들어온 자리에 "▲ 올라가는 계단" ('+(dr.art?'그림 맵':'그림 없음')+')');
 // 닿은 명령 (진짜 명령 길 — noteOrders)
 const cm = await p.evaluate(()=>{ const W=world, C=cmdBoss(W,0), L=W.units.filter(u=>u.side===0&&u.alive&&!u.summon&&u!==C).slice(0,3); if (!C||!L.length) return { err: 'no boss' }; { const was=paused; paused=true; for (let i=0;i<20;i++) stepWorld(W,0.05); paused=was; }   /* 0초 (싸움 전 작전 회의) 명령은 바로 걸림 — 전달이 아니라 셈하지 않음 */ for (const u of L) u.order={ k:'move', x:u.x+0.5, y:u.y };
   noteOrders(L,'user'); const was=paused; paused=true; for (let i=0;i<120;i++) stepWorld(W,0.05); paused=was; return { c: C.cmdOk||0, n: L.length, recv: W.log.filter(l=>l.k==='cmdRecv').length }; });
 ok(cm.c>=1&&cm.c<=cm.recv,'지휘관의 명령이 닿은 수 (cmdOk) '+cm.c+' / 닿은 명령 '+cm.recv+' (명령 '+cm.n+'명)');
 // 계단 단추 → 모두 들어온 자리로 → 앞 칸 (이 칸은 다시 고를 수 있음)
 const back = await p.evaluate(()=>{ const W=world, bb=$('campBar').querySelector('[data-cexit="down"]'); bb.click(); const tx=[...document.querySelectorAll('.toast,#toast')].map(x=>x.textContent).join(' | ');
   for (const u of W.units) if (u.side===0&&u.alive&&!u.summon){ u.x=W.entry.x; u.y=W.entry.y; }
   const was=paused; paused=true; for (let i=0;i<60&&!W.over;i++){ stepWorld(W,0.05); checkEnd(W); } paused=was; if (W.over && !W.r8done){ mode='plan'; onOver(); }
   const R=R8S(); return { tx, over: W.over, gone: W.units.filter(u=>u.side===0&&!u.summon).map(u=>u.gone||'').join(), at: R.at, done: R.done.includes(window.__n), av: r8Avail().includes(window.__n), log: R.log.slice(-1)[0], map: !$('run8').hidden }; });
 await wait(p,300);
 const tx2 = await p.evaluate(()=>[...document.querySelectorAll('.toast,#toast')].map(x=>x.textContent).join(' | '));
 console.log('    ', JSON.stringify(back), tx2.slice(0,160));
 ok(/모두 ▲ 올라가는 계단으로/.test(back.tx),'단추 → "모두 ▲ 올라가는 계단으로" 알림');
 ok(back.over&&!back.done&&back.av&&back.log&&back.log.k==='back'&&/▲ 올라가는 계단으로 — 앞 칸으로/.test(tx2),'모두 올라감 → 앞 칸 (그 칸은 다시 고를 수 있음) · 로그 · 알림');

 // 3) 같은 칸에서 이기면 정산에 한 일대로 성장 · 숨어 걸음 · 명령 닿음
 await p.evaluate(()=>{ r8Enter(r8Node(window.__n)); }); await wait(p,600); await p.evaluate(TALKEND); await wait(p,200); await p.evaluate(TALKEND);
 const win = await p.evaluate(()=>{ const W=world; if (!W) return { err: 'no world' }; const al=W.units.filter(u=>u.side===0&&u.alive&&!u.summon);
   const sh=al.find(u=>u.canGuard&&u.gTal<0.7), C=cmdBoss(W,0)||al[0], hi=al.find(u=>u!==C&&u!==sh)||al[0];
   if (sh) sh.blocked=80; C.cmdOk=500; hi.sneakMv=300; hi.healed=900;
   for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } W.cleared=true; W.exitSeen=true; for (const u of al) leaveMap(W,u,'up'); checkEnd(W); W.over=true; W.result=W.result||'exit'; mode='plan'; onOver();
   const bn=$('banner'); const t0=bn.textContent; const tabs=[...bn.querySelectorAll('[data-crt]')]; const sum=tabs.find(x=>x.dataset.crt==='sum'); if (sum) sum.click(); const body=($('crBody')||{}).textContent||'';
   const P=R8S().party, nm=u=>P.find(q=>q.name===u.name)||{}; return { sh: sh?sh.name:null, shTr: sh?(nm(sh).traits||[]).filter(t=>/^방어/.test(t)).join():'', C: C.name, cTr: (nm(C).traits||[]).filter(t=>/^지휘[SABC]$/.test(t)).join(), hi: hi.name, hiTr: (nm(hi).traits||[]).filter(t=>/^(은신|의학)[SABCDE]$/.test(t)).join(), grow: /✦ 성장/.test(t0), body: body.slice(0,400), sneak: /숨어 걸음 300/.test(body), cmds: /명령 닿음 500/.test(body) }; });
 console.log('    ', JSON.stringify(win));
 ok(win.grow&&win.sneak&&win.cmds,'정산: ✦ 성장 · 숨어 걸음 · 명령 닿음 셈이 보임');
 ok(/지휘[CBA]/.test(win.cTr)||/^지휘A$/.test(win.cTr),'닿은 명령 500 → '+win.C+' 의 지휘 등급 '+win.cTr);
 ok(/(은신|의학)/.test(win.hiTr),'숨어 걸음 · 치유 → '+win.hi+' 의 '+win.hiTr);
 ok(!win.sh||/방어C/.test(win.shTr),'막아 낸 공격 80 → '+(win.sh||'(막을 몸 없음)')+' '+win.shTr);
 const nx2 = await p.evaluate(()=>{ const bs=[...document.querySelectorAll('#banner button')].find(x=>/지도로|아래층/.test(x.textContent)); if (bs) bs.click(); const R=R8S(); return { done: R.done.includes(window.__n), map: !$('run8').hidden }; });
 ok(nx2.done&&nx2.map,'정산 뒤 지도로 — 이긴 칸은 마친 칸');

 ok(!errs.length,'페이지 오류 없음'+(errs.length?' — '+errs.slice(0,3).join(' / '):''));
 console.log(fails?`\n${fails} FAIL`:'\nALL OK'); await b.close(); process.exitCode=fails?1:0;
})();
