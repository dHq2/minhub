// v8.7.1 맵 장치 UI 시험 — ui8711.js v1.3 (v1.3: 설비 쏘기 시험은 설비 가까운 빈 바닥에 세움 · v1.2: 히든 층은 끔 · v1.1: 설비 시험은 고정층이 아닌 층 · 실제 판처럼 r8Tick 도 돌림 · v1.0: 돌벽 토막 (구획 안 · 길을 안 끊음) · 두 맵 이은 싸움판 (모든 지대 · 씨앗 셋 · 이어짐) · 봉인된 출구 (문양 셋) · 진지 설비 (움직이지 않음 · 쏨 · 부술 수 있음) · 화면)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,250); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; const h=(R.hid||{})[R.f]; R.hid={}; if (h&&h!=='none'){ F8[R.f]=null; R.fm=r8Gen(R.f); r8MapShow(); } });   // 히든 층 끔 (무작위)
 // 판 검사: 들어선 곳 바닥 · 출구가 닿음 · 모든 바닥 이어짐
 await p.evaluate(()=>{ window.__chk = (M) => { const W=M.NX, H=M.NY, rows=M.rows, at=(x,y)=>rows[y]&&rows[y][x]; let s0=null, inF=0; for (let y=M.in[1];y<=M.in[3];y++) for (let x=M.in[0];x<=M.in[2];x++) if (at(x,y)==='.'){ inF++; if (!s0) s0=[x,y]; }
   if (!s0) return 'in 없음'; const d=r8Dist(rows,W,H,[s0]); const fl=rows.join('').split('').filter(c=>c==='.').length; let reach=0; for (let i=0;i<W*H;i++) if (d[i]>=0) reach++;
   if (inF<7) return 'in '+inF; if (at(M.out[0],M.out[1])!=='.'||d[M.out[1]*W+M.out[0]]<0) return 'out'; if (reach<fl) return '끊김 '+(fl-reach); return ''; }; });
 // 1. 돌벽 토막 — 구획 안 · 길을 안 끊음
 const wl = await p.evaluate(()=>{ let n=0, sec=0, bad=[]; for (const id of Object.keys(MAPS8).filter(k=>!MAPS8[k].sec&&k!=='stadium')) for (const seed of [5,66]){ const M=r8Sec(id, seed, { kind: 'fight', theme: 'medieval' }); if (!M) continue; sec++; const w=M.props.filter(p=>p.id==='wall'); n+=w.length; for (const p of w) for (let y=p.y;y<p.y+p.h;y++) for (let x=p.x;x<p.x+p.w;x++) if (M.rows[y][x]!=='#') bad.push(id+' 벽칸'); const e=__chk(M); if (e) bad.push(id+' '+e); } return { n, sec, bad: bad.slice(0,6), nb: bad.length }; });
 console.log('    돌벽', JSON.stringify(wl));
 ok(wl.n>=wl.sec&&!wl.nb,'돌벽 토막 '+wl.n+' / 구획 '+wl.sec+' — 모두 막힘 칸 · 길은 그대로');
 // 2. 두 맵 이은 싸움판 — 지대마다 (맵 둘 넘는 지대) × 씨앗 셋
 const st = await p.evaluate(()=>{ const out={ n:0, bad:[], maxW:0, cut:0 }; for (const [tk,T] of Object.entries(THEME8)){ const L=T.maps.filter(r8MapOk); if (L.length<2) continue; for (const seed of [3,44,555]){ const a=L[seed%L.length], c=L[(seed+1)%L.length]; const M=r8Stitch(a,c,seed,{ kind:'fight', theme: tk }); if (!M||!M.parts){ out.bad.push(tk+' 못 이음'); continue; } out.n++; out.maxW=Math.max(out.maxW,M.NX); out.cut+=M.cut.length; const e=__chk(M); if (e) out.bad.push(tk+' '+a+'+'+c+' '+e); if (M.out[0] < M.parts[1].ox) out.bad.push(tk+' 출구가 왼쪽'); } } return out; });
 console.log('    이은 맵', JSON.stringify(st));
 ok(st.n>=40&&!st.bad.length,'두 맵 이은 싸움판 '+st.n+' — 들어선 곳 (왼쪽) 에서 통로를 지나 출구 (오른쪽) 까지 이어짐 '+st.bad.slice(0,4).join(' | '));
 // 3. 이은 맵으로 싸움 — 판 · 그림 둘 · 다시 열기
 const sb = await p.evaluate(()=>{ const R=R8S(); world=null; R.f=8; R.themes[8]='medieval'; F8[8]=null; R.fm=r8Gen(8); const n=R.fm.rows[0][0]; n.ms='fight'; n.npc8=null; n.stitch='med2'; n.src8='med1'; R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv();
   const W=world, M=MAPS8[S.art8]; const on=W.units.every(u=>M.rows[Math.floor(u.y)][Math.floor(u.x)]==='.'); for (let i=0;i<200&&!W.over;i++) stepWorld(W,0.05);
   const k=S.art8; delete MAPS8[k]; drawArt8(W,0,0,20); return { parts: (M.parts||[]).length, base: M.base, base2: M.base2, NX: M.NX, on, t: +W.t.toFixed(1), re: !!MAPS8[k]&&!!MAPS8[k].parts }; });
 console.log('    이은 맵 싸움', JSON.stringify(sb)); await wait(p,600); await p.screenshot({ path: 'shots/v871_stitch.png' });
 ok(sb.parts===2&&sb.on&&sb.t>=9&&sb.re,'이은 맵 ('+sb.base+' + '+sb.base2+' · '+sb.NX+'칸) 에서 싸움 10초 · 다시 열어도 같은 판');
 const freq = await p.evaluate(()=>{ const R=R8S(); let n=0, s=0; for (let t=0;t<120;t++){ R.f=8; R.themes[8]='medieval'; F8[8]=null; R.fm=r8Gen(8); for (const nd of R.fm.rows.flat().filter(x=>x.t==='fight'&&x.ms==='fight')){ world=null; n++; r8MapFor(nd); if (nd.stitch) s++; } } return s/n; });
 ok(freq>0.07&&freq<0.25,'보통 MS 싸움의 이은 맵 비율 '+(freq*100).toFixed(0)+'%');
 // 4. 봉인된 출구 — 문양 셋을 밟으면 열림
 const sl = await p.evaluate(()=>{ const R=R8S(); let n=null; for (let t=0;t<50&&!n;t++){ world=null; R.f=8; F8[8]=null; R.fm=r8Gen(8); const c=R.fm.rows[1][0]; c.ms='pass'; c.npc8=null; c.stitch=null; if ((c.seed%100)<35) n=c; } R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv(); const W=world, L=W.r8.seals||[];
   const o={ n: L.length, lock0: W.exitLock, foes: W.units.filter(u=>u.side===1).length }; const h=W.units.find(u=>u.side===0&&u.alive);
   for (const s of L){ h.x=s.x; h.y=s.y; for (let i=0;i<20;i++){ W.t+=0.05; r8Tick(W); } } o.on=L.filter(s=>s.on).length; o.lock1=W.exitLock; o.bar=/출구로/.test(document.getElementById('campBar').innerHTML); return o; });
 console.log('    봉인', JSON.stringify(sl));
 ok(sl.n===3&&sl.lock0&&sl.on===3&&!sl.lock1,'봉인된 출구 — 문양 셋 · 처음엔 잠김 · 다 밟으면 열림');
 const sl2 = await p.evaluate(()=>{ const R=R8S(); let n=null; for (let t=0;t<50&&!n;t++){ world=null; R.f=8; F8[8]=null; R.fm=r8Gen(8); const c=R.fm.rows[1][0]; c.ms='pass'; c.npc8=null; c.stitch=null; if ((c.seed%100)<35) n=c; } R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv(); const W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } checkEnd(W); r8Tick(W); return { cleared: W.cleared, open: !!W.r8.sealOpen }; });
 ok(sl2.cleared&&sl2.open,'봉인된 출구 — 적을 다 쓰러뜨려도 열림');
 await p.evaluate(()=>{ const R=R8S(); let n=null; for (let t=0;t<50&&!n;t++){ world=null; R.f=8; F8[8]=null; R.fm=r8Gen(8); const c=R.fm.rows[1][0]; c.ms='pass'; c.npc8=null; c.stitch=null; if ((c.seed%100)<35) n=c; } R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv(); const W=world, s=W.r8.seals[0], h=W.units.find(u=>u.side===0&&u.alive); camX=null; selId=h.i; }); await wait(p,700); await p.screenshot({ path: 'shots/v871_seal.png' });
 // 5. 진지 설비 — 팩션마다 · 움직이지 않음 · 쏨 · 부술 수 있음
 const tr = await p.evaluate(()=>{ const R=R8S(), out={}; for (const tk of Object.keys(THEME8).filter(k=>THEME8[k].fort)){ let got=null; for (let t=0;t<6&&!got;t++){ world=null; R.f=[...Array(30).keys()].find(f=>f>=Math.max(THEME8[tk].d[0],2)&&!FIX8[f]); R.themes[R.f]=tk; F8[R.f]=null; R.fm=r8Gen(R.f); const n=R.fm.rows[0][0]; n.ms='fort'; n.npc8=null; n.stitch=null; R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv(); const T=world.units.filter(u=>u.turret8); if (T.length) got=T; }
     if (!got){ out[tk]='없음'; continue; } const W=world, u=got[0], x0=u.x, y0=u.y; const h=W.units.find(a=>a.side===0&&a.alive), m=W.map; let spot=null; for (let r=2;r<=4&&!spot;r++) for (let a=0;a<16&&!spot;a++){ const x=Math.floor(u.x+Math.cos(a*0.39)*r), y=Math.floor(u.y+Math.sin(a*0.39)*r); if (x>0&&y>0&&x<m.W&&y<m.H&&m.t[y*m.W+x]===0) spot=[x+0.5,y+0.5]; } if (spot){ h.x=spot[0]; h.y=spot[1]; } h.order={k:'hold'}; for (const o of W.units) if (o.side===1&&!o.turret8){ o.alive=false; o.hp=0; }
     for (let i=0;i<200&&!W.over;i++){ stepWorld(W,0.05); r8Tick(W); } out[tk]={ n: got.length, name: u.name, w: u.weapon, moved: +Math.hypot(u.x-x0,u.y-y0).toFixed(2), shots: u.shots||0, hp: Math.round(u.hp) }; }
   return out; });
 console.log('    설비', JSON.stringify(tr));
 const tv=Object.values(tr); ok(tv.length>=5&&tv.every(v=>v!=='없음'),'진지 MS 마다 설비 (팩션 '+tv.length+') '+Object.keys(tr).filter(k=>tr[k]==='없음').join(' '));
 ok(tv.every(v=>v==='없음'||v.hp<=0||v.moved<0.3),'설비는 움직이지 않음 (살아 있는 설비)');
 ok(tv.filter(v=>v!=='없음'&&v.shots>0).length>=Math.ceil(tv.length*0.6),'설비가 가까운 적에게 쏨');
 await p.evaluate(()=>{ const R=R8S(); world=null; R.f=22; R.themes[22]='war'; F8[22]=null; R.fm=r8Gen(22); const n=R.fm.rows[0][0]; n.ms='fort'; n.npc8=null; n.stitch=null; n.champ=false; R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv(); const u=world.units.find(q=>q.turret8)||world.units.find(q=>q.side===0); camX=null; }); await wait(p,700); await p.screenshot({ path: 'shots/v871_turret.png' });
 ok(!errs.length,'페이지 오류 없음 '+errs.slice(0,3).join(' | '));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
