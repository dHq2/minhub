// 옛 저장 (C자 14×10 · 옛 적 수치) → 새로 읽으면 개활지 20×14 · 베테랑 기사조 · 인주 85
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  await p.evaluate(()=>{ S.type = 'gridC'; S.W = 14; S.H = 10; S.mapC = true; delete S.randStart; S.flips = ['3,4'];
    const pos = { '인주': [7.5, 8.5], '노먼': [6.5, 8.5], '레베카': [7.5, 7.5], '카리우스': [8.5, 7.5], '검방패기사': [7.5, 2.5], '창병': [6.5, 1.5], '곤봉적': [8.5, 2.5], '검기사': [5.5, 2.5], '궁수': [7.5, 0.5] };
    for (const u of S.units){ const q = pos[u.name] || [7, 1]; u.x = q[0]; u.y = q[1]; if (u.side === 1){ u.ov = { ...(u.ov || {}), hp: 106, atk: 26 }; u.gear = { 몸: { name: '사슬', mat: '사슬', tier: 1 } }; u.traits = (u.traits || []).filter(t => t !== '베테랑'); } if (u.ref === 'C-001') u.ov = {}; if (u.ref === 'C-007') u.traits = u.traits.filter(t => t !== '베테랑'); }
    delete S.v610; save(); });
  await p.reload(); const seen = []; for (let k = 0; k < 32; k++){ await p.waitForTimeout(100); const t = await p.evaluate(()=>document.getElementById('toast').textContent); if (t && !seen.includes(t)) seen.push(t); }
  console.log('toasts', JSON.stringify(seen));
  console.log(await p.evaluate(()=>JSON.stringify({ type: S.type, W: S.W, H: S.H, rand: S.randStart, flips: S.flips, units: S.units.map(u => `${u.name}@${coord(u.x, u.y)} hp${(u.ov || {}).hp || '-'}/${(u.ov || {}).atk || '-'} ${(u.traits || []).includes('베테랑') ? '베테랑' : ''}`) })));
  await p.evaluate(()=>start()); await p.waitForTimeout(200);
  console.log('battle', await p.evaluate(()=>world.units.map(u => `${u.name} ${u.max}${u.vet ? '·V' : ''}`).join(' | ') + ' · start ' + (world.start && world.start.k)));
  console.log('errors', errs); await b.close(); })();
