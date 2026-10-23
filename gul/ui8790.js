// (v8.9.2: 각펄 싸움 맵이 고대 폐허 → 각펄 전용맵 pearl1 · ui8790 v1.3)
// (v8.8.7: 2층이 고정층 (무너진 유적) 이 되어, 옛 2층 흐름을 쓰는 이 시험은 FIX8[2] 를 지우고 시작)
// v8.7.9 UI 시험 — ui8790.js v1.2 (v1.2: 도감 맞춤 — 신나펄 기술 (신나는 공중 투창 · 포탄 · 횡베기) · 기술 칸 1 신나는 공중 투창 · 2 신나는 포탄 · 기술 칸 그림 · 겨눌 곳 글 · v1.1: 전멸 확인은 한 번 버티는 몸 (근성 · 동료 펄의 각펄) 까지 거듭 쳐서 · 기술 칸 시험은 시작 뒤 자리를 다시 놓음 (훈련장 시작 배치가 자리를 옮김) · v1.0: 펄 · 각펄 (명세 E) — 설계 · 도감 프로필 · 정체성 · 글 · 아이콘 판 8 × 12 · 뽑기에 없음 · 대화 그림 ·
//   고대 폐허의 만남: 우왓 깜짝이얏! · 지나감 · 귀엽게 → 죄 하나씩 → 각펄 (음영 줄) → 머뭇거림 → 10 … 0 초읽기 → 천천히 걸어옴 → 싸움 (물러날 길 없음 · 출구 닫힘 · 만남의 각펄) ·
//   이기면 무릎 → 데려간다 (설계 그대로의 펄) · 숨을 끊는다 (펄의 창 → 가방) · 지면 무조건 전멸 (모래시계도 듣지 않음 · 펄의 글) · 초읽기 중 떠난다 ·
//   기술 칸 (신나는 공중 투창 · 신나는 포탄 · 움츠리기 바로) · 그림 (내려앉을 원 · 날아간 창 · 각펄의 기운 · 움츠린 날개 — 오류 없음) · 기록 · 서술 (빈 값 없음))
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const dir = process.argv[2]||'build', url='file://'+process.cwd()+'/'+dir+'/wrapped.html';
 const TALKEND = "{ let g=0; while (TK && g++<200){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); } }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1200); await p.evaluate(()=>{ delete FIX8[2]; });   /* v8.8.7 옛 2층 (무작위 지대) 흐름으로 시험 */
 const PE_ACT=['신나는 공중 투창','신나는 포탄','철 깃털','꼬깃꼬깃 착지','신나는 횡베기','돌려차기','움츠리기'], GK_ACT=['찍고 빼기','정면 투창','도약 찍기','스텝 찌르기','3연속 베기','솟는 거대 창','공중 투창 (창비)','반경 10m 횡베기','정면 처형','창 대포','날아 투창','초대형 치명타','처형 내리꽂기'];
 // 0) 설계 · 프로필 · 정체성 · 글 · 아이콘 · 대화 그림
 const v0 = await p.evaluate(({PE_ACT,GK_ACT})=>{ const same=(a,b)=>(a||[]).join(',')===b.join(','), d=designByKey('펄'), P=PROFILE['C-215']||{}, I=identityOf('C-215')||{}, g=unitFromRef('C-215',0,{}), G=FOE8['각펄']||{}, gu=foe8('각펄',6);
   const ALL=[...PE_ACT,...GK_ACT,'정면 투창 (열화)'];
   return { d: !!d&&d.weapon==='창'&&d.pk==='pearl'&&d.gak==='pearlgak'&&d.noDraw===true&&same(d.active,PE_ACT)&&(d.unique||[]).includes('타천 날개')&&(d.traits||[]).includes('각펄'),
     p: P.weapon==='창'&&P.pk==='pearl'&&P.gak==='pearlgak'&&same(P.active,PE_ACT), i: same(I.active,PE_ACT)&&(I.unique||[]).includes('타천 날개')&&(I.traits||[]).includes('각펄'),
     g: g.weapon==='창'&&g.pk==='pearl'&&g.gak==='pearlgak'&&same(g.active,PE_ACT), hp: [d&&d.ov.hp, d&&d.ov.atk].join('/'),
     G: G.h2==='pearlgak'&&G.noId&&G.weapon==='펄의 창'&&same(G.active,GK_ACT)&&(G.unique||[]).join()==='끝까지,타천 날개', gu: [gu.name, (gu.traits||[]).includes('각펄'), (gu.active||[]).includes('철 깃털'), gu.h2].join('|'),
     noAct: ALL.filter(x=>!ACTIVE[x]), noUn: ['타천 날개','끝까지'].filter(x=>!UNIQUE[x]||!(UNIQUE[x].effects||[]).length), tr: !!TRAITS['각펄'],
     noIco: [...ALL,'타천 날개','끝까지','각펄'].filter(x=>ICO.map[x]==null), ico: ['타천 날개','끝까지','철 깃털','꼬깃꼬깃 착지','돌려차기','움츠리기','정면 투창','각펄','솟는 거대 창','공중 투창 (창비)','반경 10m 횡베기','정면 처형','창 대포','날아 투창','초대형 치명타','처형 내리꽂기'].map(x=>ICO.map[x]).join(','),
     rows: ICO.rows, img: [icoImg.naturalWidth, icoImg.naturalHeight].join('x'), css: [...document.styleSheets].some(s=>{ try { return [...s.cssRules].some(r=>/calc\(var\(--s\) \* 12\)/.test(r.cssText)); } catch(e){ return false; } }),
     ic: ['psky','pball','pwide','pfeath','pland','pkick','pwrap','pthrow'].every(k=>SPEC_IC[k]), tgt: ['psky','pball','pwide','pfeath','pland','pkick','pthrow'].every(k=>SPEC_TGT[k])&&!!SUP_SELF_TX.pwrap,
     art: (TALK_ART['C-215']||[]).join(','), who: TALK_WHO['펄']+'/'+TALK_WHO['각펄'], enc: JSON.stringify(ENC8.find(e=>e[0]==='x:pearl')), nm: ENC8_NM['x:pearl']+' · '+ENC8_NM['x:bell'], el: JSON.stringify(ELITE8.x_pearl) }; }, {PE_ACT,GK_ACT});
 console.log('    ', JSON.stringify(v0));
 ok(v0.d&&v0.p&&v0.i&&v0.g&&v0.hp==='140/30','펄: 설계 · 도감 프로필 · 정체성 · 도감에서 바로 놓아도 같음 (창 · 기술표 pearl · 빈사에 pearlgak · 기술 넷 · ◆타천 날개 · [각펄]) · 체력/공격 '+v0.hp+' · 뽑기에 없음');
 ok(v0.G&&v0.gu==='각펄|false|false|pearlgak','각펄 (적 설계): 기술표 pearlgak · 펄의 창 · 13 기술 · ◆끝까지 · ◆타천 날개 — 동료 펄의 정체성은 받지 않음');
 ok(!v0.noAct.length&&!v0.noUn.length&&v0.tr,'기술 글 21 (신나펄 셋 더함) · 고유 둘 (타천 날개 · 끝까지) · [각펄] 글'+(v0.noAct.length?' — 없음 '+v0.noAct:''));
 ok(!v0.noIco.length&&v0.ico==='80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95'&&v0.rows===12&&v0.img==='384x576'&&v0.css&&v0.ic&&v0.tgt,'아이콘 판 8 × 12 ('+v0.img+' · 새 그림 80 ~ 95 · 글씨 크기 칸도 12줄) · 기술 칸 그림 · 겨눌 곳 글 · 움츠리기는 바로');
 ok(v0.art==='talk/pearl_t1,talk/pearl_t2,talk/pearl_t3,talk/pearl_t4'&&v0.who==='C-215/C-215'&&v0.enc==='["x:pearl",0.45,4,16]'&&/고대 폐허의 펄/.test(v0.nm)&&/인공천사 벨/.test(v0.nm)&&/각펄/.test(v0.el),'대화 그림 넷 · 이름 → 그림 · 만남 (4 ~ 16층) · 만남 목록 이름 ('+v0.nm+')');
 const imgs = await p.evaluate(()=>Promise.all([1,2,3,4].map(i=>new Promise(r=>{ const im=new Image(); im.onload=()=>r(im.naturalWidth+'x'+im.naturalHeight); im.onerror=()=>r('ERR'); im.src='art/talk/pearl_t'+i+'.webp'; }))));
 ok(imgs.every(x=>x!=='ERR'),'대화 그림 파일 넷 열림 ('+imgs.join(' · ')+')');
 // 0b) 뽑기 풀 (1층 · 여정 · 저장된 도전자) 에 없음
 const v1 = await p.evaluate(()=>{ const seen=[]; const R0=rarPick; window.rarPick = pool => { seen.push(pool.map(d=>d && (d.key||d.name))); return R0(pool); };
   let bad=0; for (let i=0;i<60;i++){ const d=foe8('@saved',3); if (/펄/.test(d.name)) bad++; }
   setMode('story'); campStart({ direct: true }); window.rarPick = R0; const flat=seen.flat(); return { camp: flat.length, inCamp: flat.filter(k=>/펄/.test(k||'')), bad }; });
 ok(v1.camp>0&&!v1.inCamp.length&&!v1.bad,'뽑기에 없음 — 1층 뽑기 풀 ('+v1.camp+') · 저장된 도전자 60번');
 await p.evaluate(TALKEND);
 // 1) 여정 시작
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,250); await p.waitForSelector('#r8dAll', { state: 'attached', timeout: 15000 }); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; R.party=R.party.slice(0,4); R.dead=['쟝']; S.camp.lost=['딸기']; R.flags.pehtoDead=1; window.__node = (i) => { const n=R.fm.rows.flat()[i]; R.at=n.id; R.done=R.done.filter(x=>x!==n.id); world=null; return n; }; });
 // 2) 만남 — 지나감 · 귀엽게 → 죄 하나 → 그만 가 본다 (싸움 없음)
 const m1 = await p.evaluate((TE)=>{ const R=R8S(), n=__node(0); r8XEvent(n,'pearl'); const L=TK.lines, cg=(L[0]||{}).cg, wow=L.some(x=>x.t==='우왓 깜짝이얏!'), ask=(L.find(x=>x.ask)||{}).ask||[];
   talkPick('!r8:x_pearlAsk'); const cute=TK.lines.some(x=>x.t&&/진짜아/.test(x.t)); talkPick('!r8:x_pearlMore'); const sin0=(TK.lines[0]||{}).t||''; const sins=R.flags.pearlSins||[];
   talkPick('!r8:x_pearlBye'); eval(TE); return { cg, wow, ask: ask.map(a=>a[1]).join(','), cute, sin0, sins, done: R.done.includes(n.id), world: !!world, npc: (R.npcDone||[]).includes('x:pearl') }; }, TALKEND);
 console.log('    죄', JSON.stringify(m1.sins));
 ok(m1.cg==='s_ancient'&&m1.wow&&/x_pearlAsk/.test(m1.ask)&&/!r8:done/.test(m1.ask),'고대 폐허 장면 · "우왓 깜짝이얏!" · 같이 가자고 한다 / 그냥 지나간다');
 ok(m1.cute&&m1.sins.length>=3&&m1.sins.length<=4&&m1.sin0===m1.sins[0]&&/화면 밖/.test(m1.sins[m1.sins.length-1])&&m1.sins.some(s=>/쟝|딸기|항복/.test(s)),'귀엽게 → 죄를 하나씩 ('+m1.sins.length+' — 이 여정의 기록 · 마지막은 화면 밖의 손가락)');
 ok(m1.done&&!m1.world&&m1.npc,'그만 가 본다 — 싸움 없이 끝 (칸 끝남 · 여정에 한 번)');
 // 3) 만남 — 끝까지 듣기 → 각펄 (음영) → 머뭇거림 → 10 … 0 → 천천히 걸어옴 → 싸움
 const m2 = await p.evaluate(()=>{ const R=R8S(), n=__node(1); window.__n2=n.id; window.__tkMs=25; r8XEvent(n,'pearl'); talkPick('!r8:x_pearlAsk'); let g=0, dark=false, line='';
   while (g++<30){ const L=(TK.lines||[]).find(x=>x.ask); talkPick('!r8:x_pearlMore'); if (TK && TK.lines.some(x=>x.dark)) break; }
   for (let k=0;k<20&&TK;k++){ const L=TK.lines[TK.i]; if (L&&L.t&&/오만하게/.test(L.t)){ dark=$('talk').classList.contains('tk-dark'); line=L.t; } if (L&&L.ask) break; if (TK.timer) talkDone(); else talkAdv(); }
   const ask=TK&&TK.lines[TK.i]; return { dark, line, ask: ask&&ask.ask&&ask.ask.map(a=>a[1]).join(','), wait: ask&&ask.wait, then: ask&&ask.then, flag: R.flags.pearlDark }; });
 ok(m2.dark&&m2.line==='인간아, 오만하게 살아왔구나. 네 여행을 떠나렴.'&&m2.flag,'눈치채 보면 각펄 — 음영 줄 (무거운 분위기): "'+m2.line+'"');
 ok(/x_pearlLeave/.test(m2.ask||'')&&/x_pearlCount/.test(m2.ask||'')&&m2.wait===7&&/x_pearlCount/.test(m2.then||''),'떠난다 / 말을 건다 · 머뭇거리면 (7초) 초읽기');
 await p.waitForFunction(()=>TK&&TK.lines[TK.i]&&TK.lines[TK.i].count===10&&/10 … 9/.test($('tkText').textContent), null, { timeout: 5000 }).catch(()=>{});   /* 머뭇거림 (7 × 25ms) → 초읽기 줄 (글자가 찍히는 동안 · 그 뒤 10 … ) */
 const c1 = await p.evaluate(()=>({ cnt: !!(TK&&TK.lines.some(x=>x.count===10)), txt: $('tkText').textContent, dark: $('talk').classList.contains('tk-dark'), btn: [...document.querySelectorAll('#tkCh button')].map(x=>x.textContent).join(',') }));
 await p.waitForFunction(()=>TK&&TK.lines.some(x=>x.narr==='펄이 천천히 걸어온다.'), null, { timeout: 5000 }).catch(()=>{});
 const c2 = await p.evaluate(()=>({ walk: !!(TK&&TK.lines.some(x=>x.narr==='펄이 천천히 걸어온다.')) }));
 ok(c1.cnt&&/10 … 9/.test(c1.txt)&&c1.dark&&c1.btn==='떠난다','머뭇거리니 초읽기 — "'+c1.txt.split('\n').pop()+'" · 단추는 떠난다 하나');
 ok(c2.walk,'0 까지 — "펄이 천천히 걸어온다."');
 const f1 = await p.evaluate(()=>{ for (let k=0;k<10&&TK;k++){ if (TK.timer) talkDone(); else talkAdv(); } return 1; });
 await p.waitForFunction(()=>world&&world.r8&&world.r8.pearl, null, { timeout: 8000 }).catch(()=>{}); await wait(p, 200);
 const f2 = await p.evaluate((TE)=>{ const W=world, g=W&&W.units.find(u=>u.side===1&&u.name==='각펄'); const intro=(TK&&TK.lines||[]).map(x=>x.box||x.narr||'').join(' / '); eval(TE); campBarRender(true); const bar=$('campBar').innerHTML;
   const a=W.units.find(u=>u.side===0&&u.alive); a.order={k:'exit',dir:'down'}; for (let i=0;i<30;i++) stepWorld(W,1/30);
   return { w: !!W, pearl: W&&W.r8&&W.r8.pearl, nr: W&&W.noRetreat, lock: W&&W.exitLock, g: !!g, spare: g&&g.spare8, sense: g&&Object.keys(g.sense||{}).length, state: g&&g.state, h2: g&&g.h2&&g.h2.k, art: S.art8, src: (S.art8sec||{}).src, intro, down: /data-cexit="down"/.test(bar), gone: a.gone||'', mood: a.mood||'', node: R8S().at===__n2 }; }, TALKEND);
 console.log('    싸움', JSON.stringify(f2));
 ok(f2.w&&f2.pearl&&f2.g&&f2.spare&&f2.h2==='pearlgak'&&f2.src==='pearl1'&&f2.state==='hunt'&&f2.sense>=3,'싸움 — 각펄 전용맵 (무너진 다리 · pearl1) · 만남의 각펄 (쓰러지되 숨) · 처음부터 우리를 앎 (천천히 걸어옴)');
 ok(f2.nr&&f2.lock&&!f2.down&&!f2.gone&&/지면 무조건 전멸/.test(f2.intro),'물러날 길 없음 — 물러나기 단추 없음 · 들어온 자리로 가는 명령도 듣지 않음 · 소개 "'+f2.intro.slice(0,40)+'…"');
 // 4) 그림 · 기록 · 서술 (각펄 싸움 판에서)
 const d1 = await p.evaluate(()=>{ const W=world, g=W.units.find(u=>u.name==='각펄'), a=W.units.find(u=>u.side===0&&u.alive); W.amb=1; computeLight(W); g.seenBy=1; cam.x=g.x; cam.y=g.y; cam.z=1; cam.follow=false;
   const seen=[]; const P=CanvasRenderingContext2D.prototype, F=P.fillText; P.fillText=function(t,x,y,m){ seen.push(String(t)); return F.call(this,t,x,y,m); }; let err='';
   try { const s=H2K.pearlgak.sk.find(x=>x.id==='pounce'); g.act={ k:'leap', phase:'run', air:true, t0:W.t, end:W.t+0.6, fx:g.x, fy:g.y, tx:a.x, ty:a.y, dir:'fwd', b:a.i, h2L:{ s, n:s.n } }; W.fxOn=true; W.fx.push({ k:'h2Shot', x:g.x, y:g.y, ang:1.2, len:10, side:1, jav:true, t0:W.t }); W.fx.push({ k:'h2Shot', x:a.x, y:a.y, ang:0.3, len:6, side:0, jav:false, t0:W.t }); a.wrapT=W.t+1.5; draw(); } catch(er){ err=er.message+' @ '+(er.stack||'').split('\n')[1]; } finally { P.fillText=F; }
   const lab=actLabel(W,g,liveAct(W,g)); g.act=null; a.wrapT=null; return { leap: seen.some(s=>/🦅 도약 찍기/.test(s)), lab, err }; });
 ok(d1.leap&&/도약 찍기 — 날아오름/.test(d1.lab)&&!d1.err,'그림: 내려앉을 원 (이름표 "🦅 도약 찍기") · 날아간 창 · 깃털 · 각펄의 기운 · 움츠린 날개 — 오류 없음 · 동작 이름 "'+d1.lab+'"'+(d1.err?' — '+d1.err:''));
 const l1 = await p.evaluate(()=>{ const W=world, t=W.t, n0=W.log.length, g=W.units.find(u=>u.name==='각펄'), a=W.units.find(u=>u.side===0&&u.alive);
   const E=[{k:'h2',a:g.i,b:a.i,s:'throw',n:'정면 투창'},{k:'h2Hit',a:g.i,s:'pounce',n:'도약 찍기',hit:[a.i],land:true},{k:'h2Jump',a:g.i,b:a.i,n:'도약 찍기',x:10.2,y:20.5},{k:'h2Up',a:g.i,n:'초대형 치명타'},{k:'h2Twirl',a:g.i,n:'창 대포',hit:[a.i]},{k:'h2Last',a:a.i,b:g.i},
     {k:'pearlGak',a:a.i,on:true},{k:'pearlGak',a:a.i,on:false},{k:'pearlWrap',a:a.i,b:g.i,why:'각펄의 큰 일격이 온다'},{k:'spare8',a:a.i,b:g.i}];
   for (const x of E) W.log.push({ t, vis: true, ...x });
   let lines=[], thrown=''; try { lines=logLines(W, n0); } catch(er){ thrown=er.message; }
   const nar=E.map(x=>{ try { return narrOf(W, { t, vis: true, ...x }); } catch(er){ return 'ERR '+er.message; } });
   return { thrown, lines, bad: lines.filter(s=>/undefined|NaN|\[object/.test(s)), feather: lines.filter(s=>/🪶/.test(s)).length, nar: nar.filter(Boolean).map(x=>x.s||x), narBad: nar.filter(x=>x&&/undefined|NaN|ERR/.test(x.s||x)) }; });
 console.log('    로그', JSON.stringify(l1.lines)); console.log('    서술', JSON.stringify(l1.nar));
 ok(!l1.thrown&&l1.lines.length>=10&&!l1.bad.length&&l1.feather>=3,'기록 글 ('+l1.lines.length+'줄) — 빈 값 없음 · 펄 · 각펄의 기술표는 깃털 그림');
 ok(l1.nar.length>=7&&!l1.narBad.length,'서술 글 ('+l1.nar.length+'줄) — 빈 값 없음');
 // 5) 이기면 — 무릎 → 데려간다 (설계 그대로의 펄)
 const w1 = await p.evaluate(()=>{ const W=world, g=W.units.find(u=>u.name==='각펄'), a=W.units.find(u=>u.side===0&&u.alive);
   applyDmg(W,a,g,g.hp+999,{tag:'시험'}); const last=g.h2LastUsed; applyDmg(W,a,g,999,{tag:'시험'}); const fell=g.fell8!=null&&g.alive; r8GuestTick(W);
   const surr=W.r8.surr&&W.r8.surr.key, gone=g.gone, drop=(W.items||[]).some(it=>it.name==='펄의 창'); checkEnd(W); const cl=!!W.cleared;
   for (const u of W.units) if (u.side===0&&u.alive){ u.gone='up'; u.alive=false; } W.over=true; W.result='exit';   /* 출구로 나감 (여정 판은 다 쓰러뜨려도 나가야 끝) */
   return { last, fell, surr, gone, drop, cl }; });
 ok(w1.last&&w1.fell&&w1.surr==='각펄'&&w1.gone==='surr'&&!w1.drop&&w1.cl,'◆끝까지 → 다시 숨이 끊길 일격 → 쓰러지되 숨 (무릎) · 펄의 창은 땅에 없음 · 판을 끝냄 (출구가 열림)');
 await p.evaluate(()=>{ r8Over(); }); await wait(p,300);
 const w2 = await p.evaluate(()=>{ const bt=[...document.querySelectorAll('#banner button')].find(x=>/지도로|아래층으로/.test(x.textContent)); if (bt) bt.click(); const L=TK&&TK.lines||[]; return { bt: !!bt, ask: (L.find(x=>x.ask)||{ask:[]}).ask.map(a=>a[1]).join(','), dark: L.some(x=>x.dark), back: L.some(x=>x.t&&/나 졌어/.test(x.t)) }; });
 ok(w2.bt&&/pearlJoin/.test(w2.ask)&&/pearlKill/.test(w2.ask)&&w2.back,'싸움 뒤 — 펄이 돌아옴 ("…으, 응? 나 졌어?") · 데려간다 / 숨을 끊는다');
 const w3 = await p.evaluate((TE)=>{ const R=R8S(), n0=R.party.length; talkPick('!r8:pearlJoin'); eval(TE); const pe=R.party.find(p0=>p0.ref==='C-215');
   return { n: R.party.length-n0, kit: pe?[pe.name,pe.weapon,pe.pk,pe.gak,(pe.active||[]).join(','),(pe.unique||[]).join(','),(pe.traits||[]).join(',')].join(' | '):'', won: R.flags.pearlWon }; }, TALKEND);
 ok(w3.n===1&&w3.kit==='펄 | 창 | pearl | pearlgak | 신나는 공중 투창,신나는 포탄,철 깃털,꼬깃꼬깃 착지,신나는 횡베기,돌려차기,움츠리기 | 타천 날개 | 각펄,은신D'&&w3.won==='join','데려간다 — 설계 그대로의 펄 합류 ('+w3.kit+')');
 // 7) 숨을 끊는다 → 펄의 창 (가방) · 8) 초읽기 중 떠난다 · 9) 지면 무조건 전멸 (모래시계도 듣지 않음 · 근성 · 동료 펄의 각펄처럼 한 번 버티는 몸은 거듭 쳐서 쓰러뜨림)
 const k2 = await p.evaluate((TE)=>{ const R=R8S(); if (!R) return { err: 'no run' }; R.on=true; const n=__node(2); world=null; r8XFight('x_pearl','ancient',{ pearl8:true }); return { w: !!world }; }, TALKEND);
 await p.waitForFunction(()=>world&&world.r8&&world.r8.pearl, null, { timeout: 8000 }).catch(()=>{}); await wait(p, 200);
 const k3 = await p.evaluate((TE)=>{ eval(TE); const R=R8S(), W=world, g=W.units.find(u=>u.name==='각펄'), a=W.units.find(u=>u.side===0&&u.alive); const hero=R.party.find(p0=>p0.hero)||R.party[0]; hero.bag=(hero.bag||[]).filter(it=>it.name!=='펄의 창');
   applyDmg(W,a,g,g.hp+999,{tag:'시험'}); applyDmg(W,a,g,999,{tag:'시험'}); r8GuestTick(W); checkEnd(W); for (const u of W.units) if (u.side===0&&u.alive){ u.gone='up'; u.alive=false; } W.over=true; W.result='exit'; r8Over(); const bt=[...document.querySelectorAll('#banner button')].find(x=>/지도로|아래층으로/.test(x.textContent)); if (bt) bt.click();
   talkPick('!r8:pearlKill'); const box=(TK&&TK.lines||[]).map(x=>x.box||'').join(''); eval(TE); const who=R.party.find(p0=>(p0.bag||[]).some(it=>it.k==='weapon'&&it.name==='펄의 창'));
   return { box, who: who&&who.name, won: R.flags.pearlWon, wp: !!rules.weapons['펄의 창'] }; }, TALKEND);
 ok(/펄의 창/.test(k3.box||'')&&k3.who&&k3.won==='kill'&&k3.wp,'숨을 끊는다 — 펄의 창이 '+k3.who+'의 가방에 ("'+(k3.box||'').slice(0,30)+'…")');
 const c3 = await p.evaluate(()=>{ const R=R8S(), n=__node(3); window.__tkMs=25; R.flags.pearlI=99; R.flags.pearlSins=['a']; r8XEvent(n,'pearl'); talkPick('!r8:x_pearlAsk'); talkPick('!r8:x_pearlMore'); talkPick('!r8:x_pearlCount'); return 1; });
 await p.waitForFunction(()=>TK&&TK.lines[TK.i]&&TK.lines[TK.i].count===10&&/10 … /.test($('tkText').textContent), null, { timeout: 5000 }).catch(()=>{});
 const c4 = await p.evaluate((TE)=>{ const R=R8S(), mid=/10 … /.test($('tkText').textContent); talkPick('!r8:x_pearlLeave'); eval(TE); return { mid, left: R.flags.pearlLeft, world: !!world, done: R.done.includes(R.at) }; }, TALKEND);
 await wait(p,500);
 const c5 = await p.evaluate(()=>({ world: !!world, talk: !!TK }));
 ok(c4.mid&&c4.left&&!c4.world&&c4.done&&!c5.world,'초읽기 중 떠난다 — 싸움 없이 끝 (초읽기가 멈춤 · 0 이 되어도 싸움이 열리지 않음)');
 const z1 = await p.evaluate(()=>{ const R=R8S(), n=__node(4); world=null; if (!R.relics.includes('glass')) R.relics.push('glass'); r8XFight('x_pearl','ancient',{ pearl8:true }); return { w: !!world }; });
 await p.waitForFunction(()=>world&&world.r8&&world.r8.pearl, null, { timeout: 8000 }).catch(()=>{}); await wait(p, 200);
 const z2 = await p.evaluate((TE)=>{ eval(TE); const R=R8S(), W=world; R.glassSnap=JSON.parse(JSON.stringify(R.party)); const pk=W.units.find(x=>x.name==='각펄'); for (let k=0;k<6&&W.units.some(u=>u.side===0&&u.alive);k++) for (const u of W.units) if (u.side===0&&u.alive){ u.undying=false; if (k>=2){ u.grit=null; u.gakKit=null; u.colKit=null; if (W.crown) W.crown[0]=0; } applyDmg(W, pk, u, u.hp+999, {tag:'시험'}); } checkEnd(W); const res=W.result; r8Over();
   return { res, end: R.end, cend: S.camp.end, glass: R.relics.includes('glass'), panel: ($('run8')||{}).textContent||'' }; }, TALKEND);
 console.log('    전멸', JSON.stringify(z2));
 ok(z2.res==='lose'&&z2.end==='wipe'&&z2.cend==='wipe'&&z2.glass&&/네 여행은 여기까지야/.test(z2.panel)&&/고대 폐허/.test(z2.panel),'지면 무조건 전멸 — 모래시계도 듣지 않음 · "…네 여행은 여기까지야." ('+(z2.panel||'').slice(0,40)+'…)');
 // 6) 펄의 기술 칸 (판에서) — 칸 1 신나는 공중 투창 · 칸 2 신나는 포탄 (도감 신나펄) · 움츠리기는 바로
 const k1 = await p.evaluate(()=>{ setMode('train'); resetToEdit(); S.units=[{ ...fromDesign(designByKey('펄'),0), x:10, y:10, id:uid() },{ ...fromDesign(designByKey('검기사'),1), x:16, y:10, id:uid() }]; start(); paused=true; const W=world, pe=W.units[0], e=W.units[1]; [[pe,10,10],[e,16,10]].forEach(([u,x,y])=>{ u.x=x; u.y=y; u.order=null; u.stay=null; }); e.order={k:'hold'}; e.spd=0.001; W.amb=1; computeLight(W); markExplored(W); e.seenBy=1;
   const s1=specAt(pe,'spec1').k, s2=specAt(pe,'spec2').k; sel=new Set([0]); useSlot(6); const arm=armed&&[armed.k,armed.s].join(':'); touchTap({x:e.x,y:e.y}); const o=pe.order||(pe.ordPend&&pe.ordPend.o);
   let cast=false; for (let i=0;i<120&&!cast;i++){ stepWorld(W,0.025); cast=W.log.some(l=>l.k==='h2'&&l.a===pe.i&&l.n==='신나는 공중 투창'); }
   const wp=pe.spec.find(x=>x.k==='pwrap'); pe.spec=[wp,...pe.spec.filter(x=>x!==wp)]; pe.act=null; pe.order=null; sel=new Set([0]); useSlot(6); const o2=pe.order||(pe.ordPend&&pe.ordPend.o); for (let i=0;i<20;i++) stepWorld(W,0.025);
   console.log; return { s1, s2, arm, o: o&&[o.k,o.s,o.b!=null].join(':'), cast, o2: o2&&[o2.k,o2.s].join(':'), wrap: !!(pe.act&&pe.act.k==='wrap')||W.log.some(l=>l.k==='pearlWrap'&&l.a===pe.i) }; });
 console.log('    기술 칸', JSON.stringify(k1));
 ok(k1.s1==='psky'&&k1.s2==='pball'&&k1.arm==='spec:psky'&&/spec:psky:true/.test(k1.o||'')&&k1.cast,'기술 칸 1 = 신나는 공중 투창 · 2 = 신나는 포탄 — 칸 1 → 적을 탭 → 신나는 공중 투창');
 ok(/spec:pwrap/.test(k1.o2||'')&&k1.wrap,'움츠리기는 칸을 누르자마자 (제자리)');
 ok(!errs.length,'페이지 오류 없음'+(errs.length?' — '+errs.slice(0,3).join(' / '):''));
 await b.close(); console.log(fails?`FAIL ${fails}`:'ALL ui8790 OK'); process.exit(fails?1:0); })();
