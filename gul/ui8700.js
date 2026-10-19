// v8.7.0 UI 시험 — ui8700.js v1.4 (v1.4: 지나가기 시험은 봉인 없는 씨앗 (봉인은 ui8711) · v1.3: 히든 층 (v8.7.1 · 무작위) 은 이 시험에서 끔 · v1.2: 30층 링 (stadium) 은 구획으로 안 씀 — 구획 시험에서 뺌 · v1.1: 챔피언 로드 관중 통로 · v1.0: 여정 구조 v2: 층 흐름 · 고정층 · 지대 · 맵 166장 모두로 구획 (모든 갈래) · 지나가기 · 칼데라 · 층 보스 → 아래층 · 도감 적 설계 100 · 지대마다 짧은 싸움 · 화면 찍기)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 // 1. 프롤로그 끝 → 2층
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,250); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; const h=(R.hid||{})[R.f]; R.hid={}; if (h&&h!=='none'){ F8[R.f]=null; R.fm=r8Gen(R.f); r8MapShow(); } });   // 히든 층 끔 (무작위)
 const f2 = await p.evaluate(()=>{ const R=R8S(), F=F8[2], rows=R.fm.rows; return { theme: F.theme, name: F.name, fixed: F.fixed8, plan: rows.map(r=>r.map(n=>n.ms?'ms:'+n.ms:n.s?'s:'+n.t:n.t).join('/')), v: R.fm.v, sub: document.querySelector('#run8 .r8sub').textContent }; });
 console.log('    2층', JSON.stringify(f2));
 ok(f2.v===2&&f2.plan.length===8&&f2.plan[0].startsWith('ms')&&f2.plan[1].startsWith('ms')&&f2.plan[2].startsWith('s:')&&f2.plan[5].split('/').length===3&&f2.plan[7]==='elite','층 흐름 MS-MS-S-MS-S-(갈림 셋)-S-층 보스');
 ok(!f2.fixed&&/무작위 지대/.test(f2.sub)&&THEMEOK(f2.theme),'2층 = 무작위 지대 ('+f2.name+')');
 function THEMEOK(t){ return ['sewer','cave','dream','crystal','forest','medieval','caldera'].includes(t); }
 // 2. 고정층 · 층마다 지대 (3 ~ 29)
 const fl = await p.evaluate(()=>{ const R=R8S(), out={}; for (let f=3; f<=30; f++){ R.f=f; const g=r8Gen(f); const F=F8[f]; out[f]={ th: F.theme, fx: F.fixed8, n: g.rows.length, top: g.rows[g.rows.length-1][0].t, b: F.boss||F.fixed||'' }; } R.f=2; R.fm=r8Gen(2); return out; });
 console.log('    층', JSON.stringify(fl));
 ok(fl[3].fx&&fl[3].top==='fixed'&&fl[5].fx&&fl[5].b==='serpa'&&fl[10].fx&&fl[10].n===1&&fl[15].b==='neo'&&fl[20].n===1&&fl[25].n===1&&fl[30].top==='final','고정층 3 · 5 · 10 · 15 · 20 · 25 · 30');
 const rnd=[4,6,7,8,9,11,12,13,14,16,17,18,19,21,22,23,24,26,27,28,29];
 ok(rnd.every(f=>!fl[f].fx&&fl[f].th&&fl[f].n===8&&fl[f].top==='elite'),'무작위 층 21 — 모두 지대 · 8줄 · 층 보스');
 ok(rnd.every(f=>fl[f].th!==fl[f-1].th),'바로 위층과 같은 지대가 이어지지 않음');
 ok(!rnd.some(f=>f>9&&fl[f].th==='caldera'),'칼데라는 2 ~ 9층만');
 // 3. 맵 166장 모두로 구획 — 모든 갈래 (싸움 · 진지 · 지나가기 · 보스) × 씨앗 3
 const sec = await p.evaluate(()=>{ const bad=[], st={ n:0, props:0, fort:0, sizes:[] }; const base=Object.keys(MAPS8).filter(k=>!MAPS8[k].sec&&k!=='stadium');
   const themeOf=id=>Object.keys(THEME8).find(k=>THEME8[k].maps.includes(id))||'cave';
   for (const id of base) for (const kind of ['fight','fort','pass','boss']) for (const seed of [11,222,3333]){
     let M; try { M=r8Sec(id, seed, { kind, theme: themeOf(id) }); } catch(e){ bad.push(id+' '+kind+' '+e.message); continue; }
     if (!M){ bad.push(id+' null'); continue; } st.n++;
     const W=M.NX, H=M.NY, rows=M.rows, at=(x,y)=>rows[y]&&rows[y][x];
     let inF=0; for (let y=M.in[1];y<=M.in[3];y++) for (let x=M.in[0];x<=M.in[2];x++) if (at(x,y)==='.') inF++;
     const d=r8Dist(rows,W,H,[[...Array(1)].map(()=>{ for (let y=M.in[1];y<=M.in[3];y++) for (let x=M.in[0];x<=M.in[2];x++) if (at(x,y)==='.') return [x,y]; })[0]]);
     const fl=rows.join('').split('').filter(c=>c==='.').length; let reach=0; for (let y=0;y<H;y++) for (let x=0;x<W;x++) if (d[y*W+x]>=0) reach++;
     if (inF<7) bad.push(id+' '+kind+' in '+inF);
     if (at(M.out[0],M.out[1])!=='.'||d[M.out[1]*W+M.out[0]]<0) bad.push(id+' '+kind+' out');
     if (reach<fl) bad.push(id+' '+kind+' 끊긴 바닥 '+(fl-reach));
     if (fl<80) bad.push(id+' '+kind+' 바닥 '+fl);
     st.props+=M.props.length; if (kind==='fort') st.fort+=M.props.length; st.sizes.push(W*H); }
   st.sizes.sort((a,b)=>a-b); return { bad: bad.slice(0,30), nb: bad.length, n: st.n, base: base.length, props: st.props, fort: st.fort, min: st.sizes[0], med: st.sizes[st.sizes.length>>1], max: st.sizes[st.sizes.length-1] }; });
 console.log('    구획', JSON.stringify(sec));
 ok(sec.base>=160&&sec.n===sec.base*12,'맵 (30층 링 빼고) '+sec.base+'장 × 갈래 4 × 씨앗 3 = 구획 '+sec.n);
 ok(sec.nb===0,'모든 구획: 들어선 곳 7칸+ · 출구 바닥 · 들어선 곳에서 모든 바닥에 닿음 · 바닥 80+ (문제 '+sec.nb+')');
 ok(sec.props>sec.n*1.5&&sec.fort>0,'소품 (엄폐 · 진지) 놓임 — 모두 '+sec.props+' · 진지 '+sec.fort);
 const pimg = await p.evaluate(async ()=>{ const ids=[...new Set(Object.values(PROPSET8).flat(2).filter(x=>typeof x==='string'&&/^(H|P3)-/.test(x)))].concat(['H-120']); let okN=0, badL=[]; await Promise.all(ids.map(id=>new Promise(r=>{ const im=new Image(); im.onload=()=>{ okN++; r(); }; im.onerror=()=>{ badL.push(id); r(); }; im.src=`art/prop/${id}.webp`; }))); return { n: ids.length, okN, badL }; });
 ok(pimg.okN===pimg.n,'소품 그림 '+pimg.okN+'/'+pimg.n+' 불러옴 '+pimg.badL.join(' '));
 // 4. 첫 MS 칸 — 구획 싸움판
 const bt = await p.evaluate(()=>{ const R=R8S(); const n=R.fm.rows[0][0]; n.ms='fort'; r8Enter(n); const W=world, M=MAPS8[S.art8], al=W.units.filter(u=>u.side===0), fo=W.units.filter(u=>u.side===1);
   const onFloor=W.units.every(u=>M.rows[Math.floor(u.y)][Math.floor(u.x)]==='.'); return { art: S.art8, sec: !!M.sec, base: M.base, NX: M.NX, NY: M.NY, W: S.W, H: S.H, al: al.length, fo: fo.length, onFloor, props: M.props.length, lock: W.exitLock, st: !!W.stairs }; });
 console.log('    MS', JSON.stringify(bt));
 ok(bt.sec&&bt.art.startsWith('~')&&bt.W===bt.NX&&bt.H===bt.NY&&bt.fo>=3&&bt.onFloor&&bt.lock,'MS 칸 = 확대한 맵의 구획 ('+bt.base+' '+bt.NX+'×'+bt.NY+') · 모두 바닥 위 · 출구 잠김');
 await p.evaluate(TALKEND); await wait(p,700);
 await p.evaluate(()=>{ const W=world, al=W.units.filter(u=>u.side===0); const a=al[0]; selId=a.i; const M=MAPS8[S.art8]; camX=null; }); await wait(p,300);
 await p.screenshot({ path: 'shots/v870_ms.png' });
 const sv = await p.evaluate(()=>{ const k=S.art8; delete MAPS8[k]; drawArt8(world,0,0,20); return !!MAPS8[k]&&MAPS8[k].NX===S.W; }); ok(sv,'다시 열 때 같은 씨앗으로 구획을 다시 만듦');
 // 짧게 돌려 봄
 const run = await p.evaluate(()=>{ const W=world; for (let i=0;i<200&&!W.over;i++) stepWorld(W,0.05); return { t: +W.t.toFixed(1), alive: W.units.filter(u=>u.alive).length }; }); ok(run.t>=9,'구획 판 10초 돌림 ('+JSON.stringify(run)+')');
 // 이기고 출구 → 다음 칸
 const win = await p.evaluate(()=>{ const W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } W.cleared=true; for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); checkEnd(W); W.over=true; W.result=W.result||'exit'; mode='plan'; onOver(); return R8S().done.slice(); });
 await p.evaluate(TALKEND); await p.evaluate(()=>{ const b=[...document.querySelectorAll('#banner button')].find(x=>/지도로/.test(x.textContent)); if (b) b.click(); }); await wait(p,200);
 ok(win.includes('n0_0'),'MS 를 이기면 칸 끝 ('+win.join(',')+')');
 // 5. 지나가기: 출구가 열려 있음 → 안 싸우고 빠져나가면 동전 적음 · 다음 칸
 const ps = await p.evaluate(()=>{ const R=R8S(); world=null; const n=R.fm.rows[1][0]; n.ms='pass'; n.seed=n.seed-(n.seed%100)+60; n.stitch=null; R.at='n0_0'; r8Enter(n); const W=world, lock=W.exitLock, pass=W.r8.pass; const bar=document.getElementById('campBar').innerHTML; const g0=R.gold;
   for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); W.over=true; W.result='exit'; mode='plan'; onOver(); return { lock, pass, exitBtn: /▼ 출구로/.test(bar), gold: R.gold-g0, done: R.done.includes(n.id) }; });
 await p.evaluate(TALKEND); console.log('    지나가기', JSON.stringify(ps));
 ok(!ps.lock&&ps.pass&&ps.exitBtn&&ps.done&&ps.gold>0&&ps.gold<=Math.ceil(22*0.4*1.5)+1,'지나가기 — 출구가 처음부터 열림 · 싸우지 않고 빠져나감 (동전 '+ps.gold+' · 40%)');
 // 6. 층 보스 (정예) 이기면 아래층
 const tb = await p.evaluate(()=>{ const R=R8S(); world=null; const rows=R.fm.rows; const top=rows[rows.length-1][0]; R.at=rows[rows.length-2][0].id; R.done.push(R.at); r8Enter(top); const W=world, foes=W.units.filter(u=>u.side===1).map(u=>u.name); for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } W.cleared=true; for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); checkEnd(W); W.over=true; W.result=W.result||'exit'; mode='plan'; onOver(); return { e: top.e, foes, stair: top.stair }; });
 await p.evaluate(TALKEND); await p.evaluate(()=>{ const b=[...document.querySelectorAll('#banner button')].find(x=>/아래층으로/.test(x.textContent)); if (b) b.click(); }); await wait(p,300); await p.evaluate(TALKEND); await wait(p,100);
 const nf = await p.evaluate(()=>({ f: R8S().f, cards: document.querySelectorAll('#run8 [data-r8d]').length }));
 console.log('    층 보스', JSON.stringify(tb), JSON.stringify(nf));
 ok(tb.stair&&tb.foes.length>=2&&nf.f===3,'층 보스 ('+(ELITE8_NAME=tb.e)+') 를 이기면 3층으로');
 // 7. 3층 고정 (여신의 호수) → 칸 끝나면 4층
 const g3 = await p.evaluate(()=>{ const R=R8S(); if (R.drawCards) r8DrawTake(R.drawCards); const rows=R.fm.rows, top=rows[rows.length-1][0]; R.at=rows[rows.length-2][0].id; R.done.push(R.at); r8Enter(top); return top.t; });
 await p.evaluate(TALKEND); await wait(p,100);
 const g4 = await p.evaluate(()=>R8S().f); ok(g3==='fixed'&&g4===4,'3층 고정 (여신의 호수) 를 마치면 4층 ('+g3+' → '+g4+')');
 // 8. 칼데라 — 큰 맵 · 침대 출구 · 처음부터 열림
 const cd = await p.evaluate(()=>{ const R=R8S(); world=null; R.f=6; R.themes[6]='caldera'; R.fm=r8Gen(6); const n=R.fm.rows[R.fm.rows.length-1][0]; R.at=R.fm.rows[R.fm.rows.length-2][0].id; R.done.push(R.at); r8Enter(n); const W=world, M=MAPS8[S.art8];
   return { e: n.e, NX: M.NX, NY: M.NY, bed: M.props.some(p=>p.id==='H-120'), lock: W.exitLock, fo: W.units.filter(u=>u.side===1).length }; });
 console.log('    칼데라', JSON.stringify(cd)); await p.evaluate(TALKEND); await wait(p,400); await p.screenshot({ path: 'shots/v870_caldera.png' });
 ok(cd.e==='calderabed'&&cd.NX>=60&&cd.bed&&!cd.lock&&cd.fo>=8,'칼데라 — '+cd.NX+'×'+cd.NY+' 큰 맵 · 침대가 출구 · 처음부터 열림 · 강적 '+cd.fo);
 // 8b. 챔피언 로드 (21 ~ 29층): MS 하나는 관중 통로
 const ch = await p.evaluate(()=>{ const R=R8S(); world=null; R.f=22; R.themes[22]=null; F8[22]=null; R.fm=r8Gen(22); const n=R.fm.rows.flat().find(x=>x.champ); if (!n) return null; R.at=null; R.done=[]; r8Enter(n); const M=MAPS8[S.art8]; return { base: M.base, NX: M.NX, NY: M.NY, fo: world.units.filter(u=>u.side===1).length }; });
 console.log('    관중 통로', JSON.stringify(ch)); await p.evaluate(TALKEND); await wait(p,500); await p.screenshot({ path: 'shots/v870_champ.png' });
 ok(ch&&ch.base==='champ'&&ch.NY>ch.NX*2&&ch.fo>=3,'챔피언 로드 — 22층 MS 하나는 관중 통로 (민수 그림 · 세로 긴 길)');
 // 9. 도감 적 설계 — 모두 몸을 만들 수 있고 지대마다 10초 싸움
 const fx = await p.evaluate(()=>{ const bad=[]; for (const k of Object.keys(FOE8)){ try { const d=foe8(k,10); const u=fromDesign(d,1); if (!u||!(u.ov?true:true)) bad.push(k); } catch(e){ bad.push(k+': '+e.message); } }
   const miss=[]; for (const [t,T] of Object.entries(THEME8)) for (const [k] of T.band) if (k!=='@saved'&&!FOE8[k]) miss.push(t+':'+k);
   for (const [e,E] of Object.entries(ELITE8)) for (const [k] of E.foes) if (k!=='@saved'&&!FOE8[k]) miss.push('정예 '+e+':'+k);
   return { n: Object.keys(FOE8).length, bad, miss }; });
 ok(fx.n>=150&&!fx.bad.length&&!fx.miss.length,'적 설계 '+fx.n+' — 모두 몸이 됨 · 지대 무리 · 정예가 모두 있는 설계 '+JSON.stringify(fx.bad.concat(fx.miss).slice(0,8)));
 const tf = await p.evaluate(()=>{ const R=R8S(), out={}; for (const tk of Object.keys(THEME8)){ world=null; R.themes[R.f=7]=tk; F8[7]=null; R.fm=r8Gen(7); const n=R.fm.rows[0][0]; R.at=null; R.done=[]; r8Enter(n); const W=world; if (!W){ out[tk]='판 없음'; continue; } for (let i=0;i<200&&!W.over;i++) stepWorld(W,0.05); const fo=W.units.filter(u=>u.side===1); out[tk]=fo.length+'/'+fo.filter(u=>!u.alive).length+' t'+W.t.toFixed(0)+' '+(MAPS8[S.art8]||{}).base; } return out; });
 console.log('    지대', JSON.stringify(tf));
 ok(Object.values(tf).every(v=>/^\d+\/\d+ t1[0-9]/.test(v)),'지대 25 — 첫 MS 를 10초씩 돌림 (적/쓰러짐 · 맵)');
 ok(!errs.length,'페이지 오류 없음 '+errs.slice(0,3).join(' | '));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
