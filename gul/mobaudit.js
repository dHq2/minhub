// mobaudit v1.2 (v1.2: 누르기 전에 그 자리에 그 단추가 있는지 확인 · 단추마다 태세 창을 닫고 시작 (가로 화면에선 태세 창이 조작판 위에 떠서 다음 단추 대신 태세 칸이 눌렸음) · v1.1: 탭 사이 조작판이 움직여 판을 누른 경우 한 번 더 눌러 봄) — v7.8.4 모바일 전수 점검: 화면 크기별 조작판 (화면 밖 단추 · 줄 수) · 칩 이름 잘림 · 가로 넘침 · 단추마다 눌러 봄 (켜짐 · 엉뚱한 고르기 풀림) · 토스트가 조작판을 가림 · 오류
const { chromium } = require('playwright');
const VPS = [['note20', 412, 915], ['small', 360, 780], ['land', 915, 412]];
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const issues = [];
  for (const [nm, w, h] of VPS){
    const ctx = await b.newContext({viewport:{width:w,height:h}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true});
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(800);
    const box = s => p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; e.scrollIntoView({ inline: 'nearest', block: 'center' }); const q=e.getBoundingClientRect(), x=q.left+q.width/2, y=q.top+q.height/2, h=document.elementFromPoint(x,y); return {x,y,hit:!!(h&&(h===e||e.contains(h)))}; }, s);
    const tap = async s => { let r = await box(s); for (let k = 0; r && !r.hit && k < 3; k++){ await p.waitForTimeout(200); r = await box(s); } if(!r) return false; await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(260); return true; };
    const I = (k, s) => issues.push(`[${nm}] ${k}: ${s}`);
    // 배치 화면 가로 넘침
    let ov = await p.evaluate(() => document.scrollingElement.scrollWidth - innerWidth); if (ov > 1) I('가로 넘침 (배치)', ov + 'px');
    await tap('#dPlay [data-dk="start"]'); await p.waitForTimeout(300);
    ov = await p.evaluate(() => document.scrollingElement.scrollWidth - innerWidth); if (ov > 1) I('가로 넘침 (판)', ov + 'px');
    const A = await p.evaluate(() => world.units.filter(u => u.side === 0).map(u => [u.i, u.name]));
    // 칩 이름 잘림
    const cut = await p.evaluate(() => [...document.querySelectorAll('#dChips .dchip')].map(c => { const s = c.querySelector('.cnm') || c.querySelector('.dn > span'); return s && s.scrollWidth > s.clientWidth + 1 ? s.textContent : null; }).filter(Boolean));
    if (cut.length) I('칩 이름 잘림', cut.join(', '));
    const geo = await p.evaluate(() => { const d = document.getElementById('dock').getBoundingClientRect(), c = document.getElementById('cv').getBoundingClientRect(), n = document.getElementById('narr'); const nr = n ? n.getBoundingClientRect() : null; return { dockTop: Math.round(d.top), dockH: Math.round(d.height), cvH: Math.round(c.height), narrH: nr ? Math.round(nr.height) : 0, narrVis: nr ? Math.round(Math.max(0, Math.min(nr.bottom, d.top) - Math.max(nr.top, 0))) : 0 }; });
    console.log(nm, 'geo', JSON.stringify(geo));
    for (const sel of [...A.map(a => [a]), A]){
      await p.evaluate(ids => { sel = new Set(ids); armed = null; hud(); }, sel.map(a => a[0])); await p.waitForTimeout(150);
      const lay = await p.evaluate(() => { const a = document.getElementById('dActs'); const bs = [...a.querySelectorAll('[data-dk]')]; const rows = new Set(bs.map(b => Math.round(b.getBoundingClientRect().top))); const off = bs.filter(b => { const q = b.getBoundingClientRect(); return q.right > innerWidth + 1 || q.left < -1; }).map(b => b.dataset.dk); return { n: bs.length, rows: rows.size, off, keys: bs.map(b => b.dataset.dk) }; });
      const ovl = await p.evaluate(() => { const dk = document.getElementById('dock'); dk.scrollTop = 0; const bs = [...document.querySelectorAll('#dock .db, #dock .dchip')].filter(b => b.offsetParent && !b.closest('#dPlay')); const R = bs.map(b => b.getBoundingClientRect()); const out = []; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++){ const a = R[i], c = R[j]; const ix = Math.min(a.right, c.right) - Math.max(a.left, c.left), iy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top); if (ix > 3 && iy > 3) out.push((bs[i].dataset.dk || bs[i].dataset.dc) + '×' + (bs[j].dataset.dk || bs[j].dataset.dc)); } return out; });
      const clip = await p.evaluate(() => [...document.querySelectorAll('#dActs .db')].filter(b => b.scrollWidth > b.clientWidth + 2 || b.scrollHeight > b.clientHeight + 2).map(b => b.dataset.dk));
      const who = sel.length > 1 ? '모두' : sel[0][1];
      if (ovl.length) I('단추 겹침 (' + who + ')', ovl.slice(0, 8).join(', '));
      const nc = await p.evaluate(() => { if (document.body.classList.contains('land')) return null; window.scrollTo(0, document.scrollingElement.scrollHeight); const n = document.getElementById('narr'), d = document.getElementById('dock'); if (!n || n.hidden) return null; const a = n.getBoundingClientRect(), b = d.getBoundingClientRect(); return { hid: Math.round(Math.max(0, a.bottom - b.top)), h: Math.round(a.height) }; });
      if (nc && nc.hid > nc.h * 0.5) I('이야기 띠가 조작판에 덮임 (' + who + ')', JSON.stringify(nc));
      if (clip.length) I('단추 글씨 넘침 (' + who + ')', clip.join(','));
      console.log(nm, who, 'acts', lay.n, 'rows', lay.rows, lay.off.length ? 'OFF: ' + lay.off.join(',') : '');
      if (lay.off.length) I('화면 밖 단추 (' + who + ')', lay.off.join(','));
      // 단추마다 눌러 봄 (명령을 실제로 주는 건 빼고 켜지는 것만): 대기형은 armed, 나머지는 고르기가 남아 있어야
      for (const k of lay.keys){ if (/^sk\d$/.test(k) || ['hold', 'auto', 'cancel', 'watch', 'pick', 'line', 'torch'].includes(k)) continue;
        await p.evaluate(ids => { if (pstOpen){ document.getElementById('ask').hidden = true; pstOpen = false; } sel = new Set(ids); armed = null; amovePick = false; hud(); }, sel.map(a => a[0])); await p.waitForTimeout(120);
        let ok = await tap(`#dActs [data-dk="${k}"]`); await p.waitForTimeout(500);
        let r = await p.evaluate(() => ({ armed: armed && armed.k, amove: amovePick, sel: sel.size, toast: (document.querySelector('#toast') || {}).textContent || '' }));
        if (ok && r.sel === 0 && /고르기를 모두 풀었어요/.test(r.toast)){ /* v1.1 한 번 더 */ await p.evaluate(ids => { sel = new Set(ids); armed = null; amovePick = false; hud(); }, sel.map(a => a[0])); await p.waitForTimeout(300);
          ok = await tap(`#dActs [data-dk="${k}"]`); await p.waitForTimeout(500); r = await p.evaluate(() => ({ armed: armed && armed.k, amove: amovePick, sel: sel.size, toast: (document.querySelector('#toast') || {}).textContent || '' })); }
        const expArm = ['scout', 'assn', 'supp', 'flare', 'lret'].includes(k);
        if (!ok) I('단추 못 누름', who + ' ' + k);
        else if (expArm && r.armed !== k) I('대기 안 켜짐', `${who} ${k} → ${JSON.stringify(r).slice(0, 140)}`);
        else if (r.sel === 0 && k !== 'all') I('고르기가 풀림', `${who} ${k} → ${r.toast.slice(0, 60)}`);
        if (k === 'amove' && !r.amove) I('공격 이동 안 켜짐', who);
        if (k === 'stealth'){ await p.evaluate(ids => { for (const i of ids) world.units[i].stealth = false; }, sel.map(a => a[0])); }
      }
    }
    // 토스트가 조작판을 가리나
    await p.evaluate(() => toast('시험 토스트 — 길게 써 봄 길게 써 봄 길게 써 봄 길게 써 봄 길게 써 봄')); await p.waitForTimeout(200);
    const tc = await p.evaluate(() => { const t = document.getElementById('toast').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(); const ix = Math.min(t.right, d.right) - Math.max(t.left, d.left), iy = Math.min(t.bottom, d.bottom) - Math.max(t.top, d.top); return { t: [Math.round(t.left), Math.round(t.top), Math.round(t.right), Math.round(t.bottom)], d: [Math.round(d.left), Math.round(d.top)], over: ix > 2 && iy > 2 && t.height > 0 }; });
    if (tc.over) I('토스트가 조작판을 가림', JSON.stringify(tc));
    // 메뉴 · 상세 열고 닫기
    await tap('#dPlay [data-dk="menu"]'); const mo = await p.evaluate(() => menuOpen()); await tap('#dPlay [data-dk="menu"]'); const mc = await p.evaluate(() => menuOpen()); if (!mo || mc) I('메뉴 열고 닫기', `${mo} → ${mc}`);
    await tap('#dPlay [data-dk="info"]'); const dO = await p.evaluate(() => { const d = document.getElementById('detail'); const q = d.getBoundingClientRect(); return { open: d.classList.contains('open'), vis: q.height > 40 && q.top < innerHeight }; }); if (!dO.open || !dO.vis) I('상세 열기', JSON.stringify(dO)); await tap('#dPlay [data-dk="info"]');
    await p.screenshot({ path: `mobaudit_${nm}.png` });
    if (errs.length) I('오류', errs.join(' | ').slice(0, 300));
    await ctx.close();
  }
  console.log('\n== 찾은 것 ' + issues.length); for (const s of issues) console.log(' - ' + s);
  await b.close(); })();
