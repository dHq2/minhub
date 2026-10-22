// v8.3.0 UI 시험 — ui8300.js v1.3 (v1.3: 붉은 번개창 시험은 성해포를 낀 이가 보는 빈 바닥에 적을 세움 (오른쪽 4칸이 바위일 수 있음) · v1.2: 적뢰 v2.0 — 원작 패턴 (대리석 피부 · 주먹 · 천벌 · 번개비 · 날아차기 · 즉사 · 정면 / 바닥 창 · 2페이즈 하늘 · 붉은 창 · 내려꽂힘 · 폭우) · v1.1: 날라차기 시험은 맵 가운데 빈 곳에서 · v1.0: 히든보스 적뢰: 1S "↓ 굴 밖으로" (2S · 여정에선 없음) → 대화 → 30초 → 폭우 → 붉은 원 → 낙하 (즉사 · 둘레) → 날라차기 · 붉은 번개창 · 천벌 · 2페이즈 · 낙인 (수전증 · 신성 면함) · 이김 → 성해포 (재생 · 신성E · 낙인 있는 이는 번개창) · 오딜 낙인 지우기 · 기록 · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }";
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.dismiss());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 console.log('== '+vw.nm);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); }); await p.waitForTimeout(300);
 await p.evaluate((TE)=>{ eval(TE); if (typeof ldEnd==='function') ldEnd(true); campBarRender(true); }, TALKEND);
 // 1. 1S 단추 → 대화 → 기다림
 const a = await p.evaluate(()=>({ btn: !!document.querySelector('#campBar [data-jr8="ask"]'), s: S.camp.s }));
 ok(a.btn&&a.s===1,'1S 캠페인 띠에 "↓ 굴 밖으로"');
 await p.evaluate(()=>document.querySelector('#campBar [data-jr8="ask"]').click()); await p.waitForTimeout(100);
 const w = await p.evaluate((TE)=>{ const ask=TK&&TK.lines.find(l=>l.ask); eval(TE); const W=world; return { ask: ask&&ask.ask.map(x=>x[0]), st: W.jr8&&W.jr8.st, orders: W.units.filter(u=>u.side===0&&u.alive).every(u=>u.order&&u.order.k==='move'&&u.order.y>W.map.H-2), bar: document.getElementById('campBar').textContent }; }, TALKEND);
 console.log('    기다림', JSON.stringify(w)); ok(w.st==='wait'&&w.orders,'굴로 돌아간다 → 모두 아래쪽 틈으로 · 기다림'); ok(/⏳ \d+초/.test(w.bar),'띠에 남은 시간');
 // 2. 30초 → 폭우 → 붉은 원 → 낙하
 const f = await p.evaluate(()=>{ const W=world, J=W.jr8; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } paused=true; J.t0=W.t-30.1; jrTickAll(W); const rain=W.rain, st1=J.st; J.t1=W.t-3.1; jrTickAll(W); const st2=J.st, mk=J.mark&&{...J.mark};
   const al=W.units.filter(u=>u.side===0&&u.alive); const v1=al[0], v2=al[1], v3=al[2]; v1.x=mk.x; v1.y=mk.y; v2.x=mk.x+2.5; v2.y=mk.y; v3.x=mk.x+6; v3.y=mk.y; v2.down=false; const hp2=v2.hp, hp3=v3.hp;
   W.t=mk.t+0.01; jrTickAll(W); const b=W.units[J.bi]; while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   return { rain, st1, st2, mk: !!mk, st3: J.st, boss: b&&b.name, h: b&&b.h, max: b&&b.max, dead1: !v1.alive||v1.down, hurt2: v2.hp<hp2, safe3: v3.hp===hp3, holy: b&&b.traits.includes('신성A') }; });
 console.log('    낙하', JSON.stringify(f)); ok(f.rain===1&&f.st1==='rain','30초 → 폭우'); ok(f.st2==='fall'&&f.mk,'3초 뒤 붉은 원 (떨어질 자리)'); ok(f.st3==='fight'&&f.boss==='적뢰'&&f.h>=5&&f.holy,'적뢰 낙하 (키 5M · 신성A)'); ok(f.dead1&&f.hurt2&&f.safe3,'떨어진 자리 즉사 · 둘레 피해 · 멀면 무사');
 // 3. v1.2 원작 패턴 (2D · 3D) — 엔진을 돌리지 않고 시간만 흘려 (자리 고정) 한 가지씩
 const pt = await p.evaluate(()=>{ const W=world, J=W.jr8, b=W.units[J.bi]; const al=W.units.filter(u=>u.side===0&&u.alive); const out={}; const R0=Math.random;
   const run=(s)=>{ for (let i=0;i<Math.round(s/0.05);i++){ W.t+=0.05; jrTickAll(W); } };
   let cx=Math.floor(W.map.W/2)+0.5, cy=Math.floor(W.map.H/2)+0.5; const clear=(x,y)=>{ for (let dx=-6;dx<=6;dx+=1) if (rock(W.map,x+dx,y)||rock(W.map,x+dx,y-1)||rock(W.map,x+dx,y+1)) return false; return true; };
   for (let k=0;k<200&&!clear(cx,cy);k++){ cx=7.5+Math.floor(Math.random()*(W.map.W-15)); cy=2.5+Math.floor(Math.random()*(W.map.H-5)); } out.open=clear(cx,cy);
   const reset=()=>{ b.x=cx; b.y=cy; b.jrC=null; b.jrFly=false; b.jrInv=0; b.stunT=-9; b.saT=-9; b.kb=null; b.down=false; Object.assign(J,{ puT:1e9, kickT:1e9, stormT:1e9, thT:1e9, lsT:1e9, jpT:1e9, bkT:1e9, tg:null }); for (const o of al){ o.x=1.5; o.y=1.5; o.order=null; o.jrWF=null; o.jrSh=null; o.stunT=-9; o.kb=null; o.down=false; o.proneT=-9; } W.jrStorm=[]; W.jrq=[]; };
   const plain=al.filter(u=>!u.modBody&&!u.undying), T=plain[0]||al[0], T2=plain[1]||al.find(u=>u!==T);
   const put=(u,dx,dy)=>{ u.x=cx+dx; u.y=cy+dy; u.alive=true; u.hp=u.max; u.down=false; };
   // 대리석 피부: 강공 → 스텝 · 약한 것 → 59% 받아 냄 · 넘어지지 않음
   reset(); b.mStepT=-9; const x0=b.x; let r1=marbleHit(W,T,b,80,{}); out.step=r1===0&&Math.hypot(b.x-x0,b.y-cy)>1.5; b.x=cx; b.y=cy; const r0w=W.rand; W.rand=()=>0.1; const r2=marbleHit(W,T,b,20,{}); W.rand=r0w; out.block=r2===6; knockDown(W,b,2,T.i,'시험'); out.noProne=!prone(W,b);
   // 대리석 주먹: 2.8칸 안 → 0.22초 파고들어 30 · 땅울림
   reset(); put(T,2.4,0); put(T2,2.9,0.6); Math.random=()=>0.99; J.puT=W.t; let h1=T.hp, h2=T2.hp; jrTickAll(W); out.punch=b.jrC&&b.jrC.k==='punch'; run(0.35); out.punchHit=T.hp<h1; out.quake=T2.hp<h2; out.lunge=b.x>cx+0.3;
   // 천벌: 2초 겨눔 → 직격 90 · 감전 (적뢰) · 방사 20
   reset(); put(T,3,0); put(T2,4,0); h1=T.hp; h2=T2.hp; jrStart(W,J,b,{ ...jrThPick(W,b), tg:T.i, x:T.x, y:T.y }); run(2.1); out.thDirect=h1-T.hp; out.thShock=T.jrSh&&T.jrSh.kind; out.thArea=h2-T2.hp;
   // 번개비: 0.8초 시전 → 3번 · 2~4개
   reset(); put(T,3,0); jrStart(W,J,b,{ k:'storm', pin:true }); run(0.9); out.storm=(W.jrStorm||[]).length; run(4); out.bolts=W.log.filter(l=>l.k==='hit'&&/번개비/.test(l.tag||'')).length+'/'+W.jrHits.filter(h=>h.cross).length;
   // 날아차기: 웅크림 → 날아감 → 확정 치명 120 (갑옷) · 벽까지 날아감
   reset(); put(T,3.5,0); const mx0=T.max; T.max=T.hp=400; h1=T.hp; Math.random=()=>0.5; jrStart(W,J,b,jrKickPlan(W,b,T)); out.kickWarn=!!(b.jrC&&b.jrC.ph==='prep'); run(1.6); out.kickDmg=h1-T.hp; out.kickFly=!!T.jrWF||(T.stunT>W.t); run(3); out.kickWall=!T.jrWF; T.max=mx0; T.hp=mx0;
   // 5% 머리가 터짐 (즉사)
   reset(); put(T2,1.5,0); T2.raised=false; Math.random=()=>0.01; jrKickHit(W,b,T2,{ dx:1, dy:0, ex:b.x+5, ey:b.y, wall:false, hit:[] }); out.kill=(!T2.alive&&T2.deathKind==='crush')||!!T2.down; T2.alive=true; T2.hp=T2.max; T2.deathKind=null; Math.random=()=>0.99;
   // 정면 창 · 바닥 창 (3D)
   reset(); put(T,6,0); h1=T.hp; jrStart(W,J,b,{ k:'laser', pin:true, tg:T.i }); run(1.0); out.laser=h1-T.hp;
   reset(); put(T,5,0); h1=T.hp; jrStart(W,J,b,{ k:'jump', pin:true, tg:T.i, x:T.x, y:T.y }); run(0.5); out.jumpAir=!!b.jrFly; run(0.8); out.jump=h1-T.hp; run(1); out.jumpLand=!b.jrFly;
   Math.random=R0; reset(); for (const o of al){ o.x=cx-3+Math.random(); o.y=cy+2; }
   out.txt=['대리석 주먹','천벌','번개비','날아차기','정면','바닥 창'].every(k=>W.log.some(l=>(l.k==='r8'&&l.s.includes(k))||(l.k==='hit'&&(l.tag||'').includes(k)))); return out; });
 console.log('    패턴', JSON.stringify(pt));
 ok(pt.step&&pt.block&&pt.noProne,'[대리석 피부] — 강공은 스텝으로 흘림 · 약한 것은 받아 냄 (×0.3) · 넘어지지 않음');
 ok(pt.punch&&pt.punchHit&&pt.quake&&pt.lunge,'대리석 주먹 — 파고들어 침 · 둘레 땅울림');
 ok(pt.thDirect===90&&pt.thShock==='red'&&pt.thArea===20,'천벌 — 직격 90 · 감전 (적뢰) · 방사 20');
 ok(pt.storm===1&&/^[0-9]+\/(\d+)$/.test(pt.bolts)&&+pt.bolts.split('/')[1]>=6,'번개비 — 3번에 걸쳐 쏟아짐 ('+pt.bolts+')');
 ok(pt.kickWarn&&pt.kickDmg>=60&&pt.kickFly&&pt.kickWall,'날아차기 — 예고선 → 확정 치명 → 벽까지 날아감 ('+pt.kickDmg+')');
 ok(pt.kill,'날아차기 5% — 머리가 터짐 (즉사)');
 ok(pt.laser>0&&pt.jump>0&&pt.jumpAir&&pt.jumpLand,'정면 창 · 바닥 창 (뛰어오른 동안 하늘)');
 ok(pt.txt,'서술 (주먹 · 천벌 · 번개비 · 날아차기 · 창)');
 // 4. 낙인 · 신성 면함 · 수전증
 const br = await p.evaluate(()=>{ const W=world; const al=W.units.filter(u=>u.side===0&&u.alive); const k=al.find(u=>u.ref==='C-003')||W.units.find(u=>u.ref==='C-003'); const o=al.find(u=>u.ref!=='C-003'&&!u.traits.some(t=>/^신성/.test(t)));
   const r0=Math.random; Math.random=()=>0.01; if (k){ k.alive=true; jrBrand(W,k); } jrBrand(W,o); Math.random=r0; const pk=k&&S.units.find(x=>x.id===k.pid), po=S.units.find(x=>x.id===o.pid);
   return { kBrand: pk ? (pk.curses||[]).includes('낙인:적뢰') : null, oBrand: (po.curses||[]).includes('낙인:적뢰'), trem: o.tremor, name: o.name }; });
 console.log('    낙인', JSON.stringify(br)); ok(br.kBrand===false,'카리우스 (신성) — 낙인이 남지 않음'); ok(br.oBrand&&br.trem,'다른 동료 — [낙인:적뢰] · 수전증 ('+br.name+')');
 const tr = await p.evaluate(()=>{ const W=world, o=W.units.find(u=>u.side===0&&u.tremor&&u.alive); const r0=W.rand; W.rand=()=>0.01; o.tremCd=-9; o.act=null; const e=W.units.find(u=>u.side===1&&u.alive); startAct(W,o,e,'시험'); W.rand=r0; const L=W.log.filter(l=>l.k==='tremor'); return { n: L.length, stun: (o.stunT||0)>W.t, narr: L.length&&narrOf(W,L[L.length-1]).s }; });
 ok(tr.n>=1&&tr.stun&&/손이 떨린다/.test(tr.narr||''),'수전증 — 행동이 나가지 않고 잠깐 멈춤 · 서술');
 // 5. v1.2 2페이즈 (55%): 떠오름 (닿지 않음) → 하늘 (근접 닿지 않음 · 원거리는 닿음) · 폭우 (천벌이 맵 전체) · 붉은 창 · 내려와 숨 고름
 const p2 = await p.evaluate(()=>{ const W=world, J=W.jr8, b=W.units[J.bi]; const run=(s)=>{ for (let i=0;i<Math.round(s/0.05);i++){ W.t+=0.05; jrTickAll(W); } }; const out={}; const al=W.units.filter(u=>u.side===0&&u.alive); const T=al[0];
   b.hp=b.max*0.5; b.jrC=null; b.stunT=-9; b.down=false; jrTickAll(W); out.asc=b.jrC&&b.jrC.k==='asc'; run(1); out.inv=marbleHit(W,T,b,50,{ far:true })===0;
   run(1.6); out.p2=J.p2; out.rain=W.rain; out.fly=b.jrFly; out.melee=marbleHit(W,T,b,50,{})===0; out.far=marbleHit(W,T,b,20,{ far:true })>0;
   J.spT=W.t; J.thT=1e9; J.dT=1e9; jrTickAll(W); out.spears=(W.jrq||[]).filter(e=>e.k==='circ').length;
   run(2); J.dT=W.t; J.spT=1e9; jrTickAll(W); out.desc=b.jrC&&b.jrC.k==='desc'; run(1.2); out.landed=!b.jrFly; run(5.3); out.up=b.jrFly&&!b.jrC;
   b.jrC=null; const far=al.find(u=>!u.modBody&&!u.undying)||al[0]; far.alive=true; far.down=false; far.x=Math.max(1.5,Math.min(W.map.W-1.5,b.x+7)); far.y=b.y; far.hp=far.max; far.jrSh=null; const h=far.hp; const R0=Math.random; Math.random=()=>0.99; jrThunder(W,b,{ x:b.x+0.2, y:b.y, tg:-1 }); Math.random=R0; out.rainAll=h-far.hp;
   return out; });
 console.log('    2페이즈', JSON.stringify(p2));
 ok(p2.asc&&p2.inv,'55% — 떠오름 (그동안 무엇도 닿지 않음)');
 ok(p2.p2&&p2.rain===2&&p2.fly&&p2.melee&&p2.far,'2페이즈 — 하늘 (근접 닿지 않음 · 원거리는 닿음) · 폭우');
 ok(p2.spears>=1,'붉은 창 — 동료 발밑에 원 ('+p2.spears+')');
 ok(p2.desc&&p2.landed&&p2.up,'10초마다 내려꽂힘 → 4초 숨 고름 (땅) → 다시 떠오름');
 ok(p2.rainAll===20,'폭우 — 천벌 방사가 맵 전체 (멀리 있는 동료도 20)');
 // 6. 이김 → 성해포
 await p.evaluate((TE)=>{ const W=world, J=W.jr8, b=W.units[J.bi]; W.jrq=[]; b.alive=false; b.hp=0; jrTickAll(W); eval(TE); }, TALKEND); await p.waitForTimeout(100);
 const g = await p.evaluate(()=>({ st: S.camp.jr8.st, n: document.querySelectorAll('[data-jrg]').length }));
 ok(g.st==='won'&&g.n>=1,'적뢰를 쓰러뜨림 → 성해포를 누구에게 ('+g.n+'명)');
 const eq = await p.evaluate(()=>{ const btns=[...document.querySelectorAll('[data-jrg]')]; const b=btns.find(x=>/낙인/.test(x.textContent))||btns[0]; const nm=b.querySelector('b').textContent; b.click(); const p=S.units.find(x=>x.name===nm); const u=world.units.find(x=>x.pid===p.id);
   return { nm, tr: p.trinket, holy: (p.traits||[]).includes('신성E'), regen: u&&u.regenHp, trem: u&&u.tremor, branded: (p.curses||[]).includes('낙인:적뢰') }; });
 console.log('    성해포', JSON.stringify(eq)); ok(eq.tr==='성해포'&&eq.holy&&eq.regen===1.5&&eq.trem===false,'성해포 — 신성E · 재생 1.5 · 수전증 없음 ('+eq.nm+')');
 const sp = await p.evaluate(()=>{ const W=world; const u=W.units.find(x=>x.side===0&&x.alive&&S.units.find(p=>p.id===x.pid&&p.trinket==='성해포')); if (!u) return null; const e={ ...foeOf('검기사'), id: uid(), x: u.x+4, y: u.y }; S.units.push(e); const eu=addUnit(W,e); eu.seenBy=true; { const m=W.map; let c=null, any=null; for (let y=1;y<m.H-1&&!c;y++) for (let x=1;x<m.W-1;x++){ const cx=x+0.5, cy=y+0.5, d=Math.hypot(cx-u.x,cy-u.y); if (m.t[y*m.W+x]!==0||d<2.5||d>6||!losClear(m,u.x,u.y,cx,cy)||boxRock(W,cx,cy,0.45)) continue; eu.x=cx; eu.y=cy; if (canSee(W,u,eu)){ c={x:cx,y:cy}; break; } any=any||{x:cx,y:cy}; } const q=c||any; if (q){ eu.x=q.x; eu.y=q.y; } } u.jrS=null; u.down=false; u.act=null; u.stunT=-9; jrTickAll(W); W.t+=6.1; u.act=null; jrTickAll(W); return { spear: u.jrS, q: (W.jrq||[]).some(q=>q.k==='spear'&&q.src===u.i) }; });
 if (eq.branded) ok(sp&&sp.spear&&sp.q,'낙인 + 성해포 — 붉은 번개창을 스스로 씀');
 // 7. 새 판에서도 (엔진): 성해포 재생 · 낙인 수전증
 const nb = await p.evaluate(()=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.stages[2]={ seed:3, tseed:3 }; C.s=2; campBuild(2,'down',party); const W=world; const w1=W.units.find(u=>{ const p=S.units.find(x=>x.id===u.pid); return p&&p.trinket==='성해포'; }); const w2=W.units.find(u=>{ const p=S.units.find(x=>x.id===u.pid); return p&&(p.curses||[]).includes('낙인:적뢰')&&p.trinket!=='성해포'; });
   const bar=document.getElementById('campBar').innerHTML; return { regen: w1&&w1.regenHp, trem: w2 ? w2.tremor : 'none', btn2: /data-jr8/.test(bar) }; });
 ok(nb.regen===1.5&&(nb.trem===true||nb.trem==='none')&&!nb.btn2,'다음 맵 — 성해포 재생 · 낙인 수전증 그대로 · 2S 엔 "굴 밖으로" 없음');
 // 8. 오딜이 낙인을 지움
 const cu = await p.evaluate((TE)=>{ const L=jrBranded().map(p=>p.name); const E={ teaDrunk:true }; const ask=odTalkAsk(E).ask.map(x=>x[0]); r8Act('jrCure'); eval(TE); return { before: L, ask, after: jrBranded().length }; }, TALKEND);
 console.log('    오딜', JSON.stringify(cu)); ok((cu.before.length===0||cu.ask.includes('낙인을 지워 달라고 한다'))&&cu.after===0,'오딜의 방 — "낙인을 지워 달라고 한다" → 낙인이 지워짐');
 // 9. 기록 · 여정에선 없음
 const rec = await p.evaluate(()=>prologRec(S.camp, S.units.filter(u=>u.side===0)));
 ok(/적뢰/.test(rec)&&/성해포/.test(rec),'프롤로그 기록에 적뢰 · 성해포');
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
