// v8.3.0 UI 시험 — ui8300.js v1.1 (v1.1: 날라차기 시험은 맵 가운데 빈 곳에서 · v1.0: 히든보스 적뢰: 1S "↓ 굴 밖으로" (2S · 여정에선 없음) → 대화 → 30초 → 폭우 → 붉은 원 → 낙하 (즉사 · 둘레) → 날라차기 · 붉은 번개창 · 천벌 · 2페이즈 · 낙인 (수전증 · 신성 면함) · 이김 → 성해포 (재생 · 신성E · 낙인 있는 이는 번개창) · 오딜 낙인 지우기 · 기록 · 휴대폰)
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
 // 3. 날라차기 · 번개창 · 천벌
 const pt = await p.evaluate(()=>{ const W=world, J=W.jr8, b=W.units[J.bi]; const al=W.units.filter(u=>u.side===0&&u.alive); const out={};
   let cx=Math.floor(W.map.W/2)+0.5, cy=Math.floor(W.map.H/2)+0.5; for (let k=0;k<40&&(rock(W.map,cx,cy)||rock(W.map,cx+3,cy)||rock(W.map,cx+1.5,cy));k++){ cx=2.5+Math.floor(Math.random()*(W.map.W-8)); cy=2.5+Math.floor(Math.random()*(W.map.H-5)); } b.x=cx; b.y=cy; b.act=null; b.kb=null; const t=al[0]; for (const o of al) if (o!==t){ o.x=1.5; o.y=1.5; } t.x=cx+3; t.y=cy; t.down=false; t.kb=null; b.down=false; b.stunT=-9; J.kickT=W.t; J.spearT=W.t+99; J.boltT=W.t+99; jrTickAll(W); out.kick=!!J.kick; const hp=t.hp; for (let i=0;i<40&&J.kick;i++){ W.t+=0.05; J.lastT=W.t-0.05; jrTickAll(W); } out.kickHit=t.hp<hp; out.kickDown=prone(W,t)||!t.alive;
   const t2=al.find(u=>u!==t&&u.alive)||t; t2.x=b.x-6; t2.y=b.y; t2.down=false; J.spearT=W.t; J.kickT=W.t+99; const n0=(W.jrq||[]).length; jrTickAll(W); out.spearQ=(W.jrq||[]).length>n0; const hp2=t2.hp; W.t+=0.85; jrTickAll(W); out.spearHit=t2.hp<hp2; out.stun=(t2.stunT||0)>W.t-0.1; out.mini=(W.jrq||[]).some(e=>e.mini);
   J.boltT=W.t; J.spearT=W.t+99; jrTickAll(W); out.bolts=(W.jrq||[]).filter(e=>e.k==='bolt'&&!e.mini).length;
   const L=W.log.filter(l=>l.k==='r8').map(l=>l.s).join('\n'); out.txt=/날라차기/.test(L)&&/붉은 번개창/.test(L)&&/천벌이 겨눠진다/.test(L); return out; });
 console.log('    패턴', JSON.stringify(pt)); ok(pt.kick&&pt.kickHit&&pt.kickDown,'날라차기 — 예고 뒤 돌진 · 맞고 넘어짐'); ok(pt.spearQ&&pt.spearHit&&pt.stun&&pt.mini,'붉은 번개창 — 예고선 → 맞음 · 감전 · 작은 천벌'); ok(pt.bolts===2,'천벌 — 붉은 원 둘 (1페이즈)'); ok(pt.txt,'서술 (날라차기 · 번개창 · 천벌)');
 // 4. 낙인 · 신성 면함 · 수전증
 const br = await p.evaluate(()=>{ const W=world; const al=W.units.filter(u=>u.side===0&&u.alive); const k=al.find(u=>u.ref==='C-003')||W.units.find(u=>u.ref==='C-003'); const o=al.find(u=>u.ref!=='C-003'&&!u.traits.some(t=>/^신성/.test(t)));
   const r0=Math.random; Math.random=()=>0.01; if (k){ k.alive=true; jrBrand(W,k); } jrBrand(W,o); Math.random=r0; const pk=k&&S.units.find(x=>x.id===k.pid), po=S.units.find(x=>x.id===o.pid);
   return { kBrand: pk ? (pk.curses||[]).includes('낙인:적뢰') : null, oBrand: (po.curses||[]).includes('낙인:적뢰'), trem: o.tremor, name: o.name }; });
 console.log('    낙인', JSON.stringify(br)); ok(br.kBrand===false,'카리우스 (신성) — 낙인이 남지 않음'); ok(br.oBrand&&br.trem,'다른 동료 — [낙인:적뢰] · 수전증 ('+br.name+')');
 const tr = await p.evaluate(()=>{ const W=world, o=W.units.find(u=>u.side===0&&u.tremor&&u.alive); const r0=W.rand; W.rand=()=>0.01; o.tremCd=-9; o.act=null; const e=W.units.find(u=>u.side===1&&u.alive); startAct(W,o,e,'시험'); W.rand=r0; const L=W.log.filter(l=>l.k==='tremor'); return { n: L.length, stun: (o.stunT||0)>W.t, narr: L.length&&narrOf(W,L[L.length-1]).s }; });
 ok(tr.n>=1&&tr.stun&&/손이 떨린다/.test(tr.narr||''),'수전증 — 행동이 나가지 않고 잠깐 멈춤 · 서술');
 // 5. 2페이즈
 const p2 = await p.evaluate(()=>{ const W=world, J=W.jr8, b=W.units[J.bi]; const s0=b.spd; b.hp=b.max*0.49; b.down=false; jrTickAll(W); J.boltT=W.t; J.spearT=W.t+99; J.kickT=W.t+99; const n0=(W.jrq||[]).filter(e=>e.k==='bolt'&&!e.mini).length; jrTickAll(W); return { p2: J.p2, spd: b.spd>s0, rain: W.rain, bolts: (W.jrq||[]).filter(e=>e.k==='bolt'&&!e.mini).length-n0 }; });
 ok(p2.p2&&p2.spd&&p2.rain===2&&p2.bolts===3,'2페이즈 — 빨라짐 · 큰 비 · 천벌 셋');
 // 6. 이김 → 성해포
 await p.evaluate((TE)=>{ const W=world, J=W.jr8, b=W.units[J.bi]; W.jrq=[]; b.alive=false; b.hp=0; jrTickAll(W); eval(TE); }, TALKEND); await p.waitForTimeout(100);
 const g = await p.evaluate(()=>({ st: S.camp.jr8.st, n: document.querySelectorAll('[data-jrg]').length }));
 ok(g.st==='won'&&g.n>=1,'적뢰를 쓰러뜨림 → 성해포를 누구에게 ('+g.n+'명)');
 const eq = await p.evaluate(()=>{ const btns=[...document.querySelectorAll('[data-jrg]')]; const b=btns.find(x=>/낙인/.test(x.textContent))||btns[0]; const nm=b.querySelector('b').textContent; b.click(); const p=S.units.find(x=>x.name===nm); const u=world.units.find(x=>x.pid===p.id);
   return { nm, tr: p.trinket, holy: (p.traits||[]).includes('신성E'), regen: u&&u.regenHp, trem: u&&u.tremor, branded: (p.curses||[]).includes('낙인:적뢰') }; });
 console.log('    성해포', JSON.stringify(eq)); ok(eq.tr==='성해포'&&eq.holy&&eq.regen===1.5&&eq.trem===false,'성해포 — 신성E · 재생 1.5 · 수전증 없음 ('+eq.nm+')');
 const sp = await p.evaluate(()=>{ const W=world; const u=W.units.find(x=>x.side===0&&x.alive&&S.units.find(p=>p.id===x.pid&&p.trinket==='성해포')); if (!u) return null; const e={ ...foeOf('검기사'), id: uid(), x: u.x+4, y: u.y }; S.units.push(e); const eu=addUnit(W,e); eu.seenBy=true; u.jrS=null; u.down=false; u.act=null; u.stunT=-9; jrTickAll(W); W.t+=6.1; u.act=null; jrTickAll(W); return { spear: u.jrS, q: (W.jrq||[]).some(q=>q.k==='spear'&&q.src===u.i) }; });
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
