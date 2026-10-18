// v5.8.3 정체성 감사 (자동 시험): 도감 · 설계 · 뽑기 · 옛 저장 — 어긋나면 MISMATCH
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(600);
  const res = await p.evaluate(()=>{
    const eng = u => { const w = createWorld({ type:'gridC', W:14, H:10, seed:1, flips:[], torches:[], units:[{...u, x:2.5, y:2.5}] }, rules, 1, { headless:true }).units[0];
      return { flags: [w.undying?'불사':'', w.regen>0?'재생':'', w.giant?'거구':'', w.heads>1?'머리'+w.heads:'', w.modBody?'개조':'', w.canLeap?'도약':'', w.bladeHands?'날붙이손':'', w.skill?w.skill.name:'', w.human?'일반인':'', w.smell?'후각':'', w.reflex?'반사':'', w.fire?'발화':'', w.blindL?'좌안':'', w.palm?'팜':'', w.ev>1?'회피':'', w.vit>0?'급소':'', w.undead?'망자':''].filter(Boolean).join(','), hp: w.max, role: w.role, tr: [...(u.traits||[])].sort().join(','), act: (u.active||[]).join(','), un: (u.unique||[]).join(',') }; };
    const out = [], bad = [];
    for (const d of DESIGN_DEFAULTS){ if (!d.ref) continue;
      const des = eng(fromDesign(d, d.side)), dg = eng(unitFromRef(d.ref, d.side));
      out.push(`${d.key} 설계 [${des.flags}] hp${des.hp} ${des.role} | 도감 [${dg.flags}] hp${dg.hp} ${dg.role}`);
      const tierSame = fromDesign(d, d.side).tier === unitFromRef(d.ref, d.side).tier; if (des.flags !== dg.flags || (tierSame && des.hp !== dg.hp) || des.role !== dg.role) bad.push(`${d.key}: 설계 [${des.flags}] hp${des.hp} ${des.role} ≠ 도감 [${dg.flags}] hp${dg.hp} ${dg.role}`);
      if (d.side === 0){ const dr = eng(unitFromRef(d.ref, 0, { nv:false })); if (dr.flags !== des.flags) bad.push(`${d.key}: 뽑기 [${dr.flags}] ≠ 설계 [${des.flags}]`); }
      // 옛 저장 (v5.2 전 도감 원본, 특성 빈 칸) → 읽을 때 고침
      const raw = unitFromRef0(d.ref, d.side, { nv:false }); raw.traits = []; fixOldRebecca(raw); lockIdentity(raw);
      const I = identityOf(d.ref);
      if (I){ const r2 = eng(raw), need = { 'C-001':['일반인'], 'C-002':['불사','재생'], 'C-003':['거구','머리4','개조'], 'C-006':['후각','반사'], 'C-007':['응급처치'], 'C-008':['양동이 약'], 'C-004':['발화','좌안','팜','후각'], 'C-052':['망자'], 'C-053':['망자'], 'C-054':['망자'], 'C-055':['망자'], 'C-056':['망자'] }[d.ref] || [];
        const miss = need.filter(x => !r2.flags.split(',').includes(x)); out.push(`   옛 저장 → [${r2.flags}] 액티브[${r2.act}]`); if (miss.length) bad.push(`${d.key}: 옛 저장에서 빠짐 ${miss.join(',')}`);
        if (I.active && !I.active.every(a => (raw.active||[]).includes(a))) bad.push(`${d.key}: 옛 저장 액티브 빠짐`); }
    }
    // 정체성이 있는 도감 인물 (설계가 없는 포렌 · 옐로) 도
    for (const ref of ['C-006', 'C-008']){ if (!RBY[ref]) continue; const u = eng(unitFromRef(ref, 0)); out.push(`${RBY[ref][1]} 도감 [${u.flags}]`); const raw = unitFromRef0(ref, 0, { nv:false }); raw.traits = []; lockIdentity(raw); const r2 = eng(raw); out.push(`   옛 저장 → [${r2.flags}]`); }
    return { out, bad }; });
  res.out.forEach(l => console.log(l)); console.log(res.bad.length ? 'MISMATCH\n  ' + res.bad.join('\n  ') : 'ALL OK — 정체성 누락 없음');
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
