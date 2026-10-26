// v7.16.2 점검 — audit7162.js v1.2 (v1.2: 뽑기는 v7.16.3 처럼 야시를 끄지 않고 부름 · v1.1: 전술 · 설명 · 외침 등도 비교 · 같은 인물이 놓는 길마다 같은가: 설계 칸 · 도감 (붓) · 동료 뽑기 · 1층 · 예시 판 / 편집 미리보기 수치 vs 판의 실제 수치 / 카드 표시)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const out = await p.evaluate(()=>{
   const pick = u => { const st = statsOf(u, rules); const sk = u.skill ? Object.entries(u.skill).filter(([k])=>['name','kit','pool','pct','min','cap','hot','hotN','per'].includes(k)).map(([k,v])=>k+'='+v).join(',') : '';
     return { tier:u.tier, cls:u.cls, role:u.role||'', weapon:u.weapon, ammo:u.ammo, sm:u.sm, h:u.height, w:u.weight, nv:u.nv?u.nvG||'B':'-', ov:JSON.stringify(u.ov||{}), traits:[...(u.traits||[])].sort().join(' '), active:(u.active||[]).join(' '), unique:(u.unique||[]).join(' '), gear:JSON.stringify(u.gear||null), shield:!!u.shield, sq:u.sq||'', rank:u.rank||'', bold:u.bold, skill:sk, race:u.race||'', tac:u.tac||'', tactic:u.tactic||'', note:(u.note||'').slice(0,40), cry:u.cry||'', mute:!!u.mute, am:u.am, smellG:u.smellG||'', modBody:!!u.modBody, hero:!!u.hero, hp:st.hp, atk:st.atk, spd:+(+st.spd).toFixed(2), rng:st.rng }; };
   const res = {};
   for (const d of DESIGN_DEFAULTS){
     const R = { design: pick(fromDesign(d, d.side)) };
     if (d.ref) R.roster = pick(unitFromRef(d.ref, d.side));
     if (d.ref && d.side === 0) R.draft = pick(unitFromRef(d.ref, 0, d.ref === 'C-001' ? { hero: true } : {}));
     res[d.key] = R; }
   // 예시 판 · 1층
   const ex = exampleBase(); for (const u of ex.units){ const k = DESIGN_DEFAULTS.find(d => d.ref === u.ref && d.side === u.side); if (k && res[k.key] && !res[k.key].example) res[k.key].example = pick(u); }
   const f1 = FLOOR_DEFAULTS.find(f => f.name === '1층'); let fl = [];
   try { const S0 = floorSetup(f1); fl = (S0 && S0.units) || []; } catch (e) { res._floorErr = String(e); }
   for (const u of fl){ const k = DESIGN_DEFAULTS.find(d => d.ref === u.ref && d.side === u.side); if (k && res[k.key] && !res[k.key].floor1) res[k.key].floor1 = pick(u); }
   // 편집 미리보기 (statsOf) vs 판의 실제 수치 (예시 판)
   start(); const W = world, cmp = [];
   for (const wu of W.units){ const pu = S.units.find(x => x.id === wu.id) || S.units.find(x => x.ref === wu.ref && x.side === wu.side); if (!pu) continue; const st = statsOf(pu, rules);
     const card = ([...document.querySelectorAll('#party [data-ally]')].map(e => e.innerText.replace(/\s+/g, ' ')).find(s => s.includes(wu.name)) || '');
     cmp.push({ n: wu.name, prevHp: st.hp, hp: wu.max, prevAtk: st.atk, atk: wu.atk, prevSpd: +(+st.spd).toFixed(2), spd: +wu.spd.toFixed(2), prevRng: st.rng, rng: wu.rng, card: (card.match(/(\d+)\/(\d+)/) || [])[0] || '', nvG: wu.nv ? wu.nvG : '-', stl: wu.stealthG || '', ammo: wu.ammo, mass: Math.round(wu.mass || 0) }); }
   res._world = cmp; return res; });
 const fields = ['tier','cls','role','weapon','ammo','sm','h','w','nv','ov','traits','active','unique','gear','shield','sq','rank','bold','skill','race','tac','tactic','note','cry','mute','am','smellG','modBody','hero','hp','atk','spd','rng'];
 for (const [k, R] of Object.entries(out)){ if (k.startsWith('_')) continue; const base = R.design; const diffs = [];
   for (const [path, v] of Object.entries(R)){ if (path === 'design') continue; for (const f of fields){ if (String(v[f]) !== String(base[f])) diffs.push(`${path}.${f}: ${v[f]}  ≠ 설계 ${base[f]}`); } }
   console.log(`== ${k} (${Object.keys(R).join('/')})${diffs.length ? '' : '  같음'}`); for (const d of diffs) console.log('   ' + d); }
 console.log('== 미리보기 vs 판'); for (const c of out._world){ const bad = []; if (c.prevHp !== c.hp) bad.push('체력 ' + c.prevHp + '→' + c.hp); if (c.prevAtk !== c.atk) bad.push('공격 ' + c.prevAtk + '→' + c.atk); if (Math.abs(c.prevSpd - c.spd) > 0.01) bad.push('속도 ' + c.prevSpd + '→' + c.spd); if (c.prevRng !== c.rng) bad.push('사거리 ' + c.prevRng + '→' + c.rng); if (c.card && c.card !== c.hp + '/' + c.hp) bad.push('카드 ' + c.card);
   console.log(`   ${c.n}: hp ${c.hp} atk ${c.atk} spd ${c.spd} rng ${c.rng} 야시 ${c.nvG} 은신 ${c.stl} 탄 ${c.ammo} 무게 ${c.mass}${bad.length ? '  ← ' + bad.join(' · ') : ''}`); }
 if (out._floorErr) console.log('floorErr', out._floorErr); console.log('errs', JSON.stringify(errs)); await b.close(); })();
