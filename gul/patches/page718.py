# v7.18.0 페이지 — page718.py v1.2 (v1.2: 언덕이 더 잘 보이게 — 높이 색 · 명암 진하게 · 등고선 가늘고 매끈 (2px) · 꼭대기에 ▲높이 · v1.1: 붙여 넣기 줄의 주석은 /* */ · 1F 1.5단계: 지형 그림 (언덕 명암 · 등고선 · 갑옷 무더기 · 굳은 시체) · 맵 칸 '지형' (평지 · 1F · 언덕 많음 · 다시 굴리기) · 편집 도구 (더미 · 언덕) · 1층 = 1F 지형 · 상세 (언덕 위 · 웅크림 · 엄폐 곁) · 저장 · 복사)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.17.1 (2026-10-18)', '<!-- 굴의 전투판 v7.18.0 (2026-10-18)')
rep('     v7.17.1: ', '''     v7.18.0: 1F 1.5단계 — 언덕 · 더미 · 엄폐 (양쪽 같은 규칙).
         ① 언덕: 높이 (M) 가 있는 부드러운 봉우리. 그림은 높이만큼 밝게 · 왼쪽 위 빛의 명암 · 0.5M 등고선. 마루 너머는 안 보임 (눈높이 → 몸 꼭대기 사이를 가림).
         ② 고저 보정: 높이차 1M 당 시야 +0.6칸 (높은 쪽이 멀리 보고 · 멀리서 보임) · 원거리 명중 ±5% · 근접 피해 ±8%. 오르막은 느리고 (기울기 0.4 에 ×0.76) 내리막은 조금 빠름. 비탈을 뛰면 가끔 미끄러져 넘어짐 (내리막이 더 위험).
         ③ 더미 (1F 장애물 — 못 지나가고 못 치움): 갑옷 무더기 (1.1M · 3 ~ 5칸이 모임) · 굳은 시체 (0.6M · 한 칸). 시야 · 탄은 높이로 봄 — 서 있으면 머리 · 어깨가 드러나 맞을 수 있고, 웅크리면 (은신 · 가만히) 무더기 뒤에 다 가려짐. 낮은 시체 뒤는 엎드려야 가려짐.
         ④ 엄폐 사격: 드러난 몫만큼 명중 (0.2 + 0.8 × 드러남) · 곡사는 위에서 떨어져 0.8 까지. 겨눔은 맞았는데 엄폐가 가린 몫이면 '갑옷 무더기에 막힘 (엄폐)'. 무더기 바로 뒤에 선 사수는 넘어 쏨 — 쏘는 동안은 일어서서 드러남.
         ⑤ 맵 칸 '지형': 평지 · 1F (가끔 언덕 · 갑옷 무더기 · 굳은 시체) · 언덕 많음 · 다시 굴리기. 편집 도구 '더미' (빈 칸 → 갑옷 → 시체 → 없음 · 무작위 더미는 누르면 뺌) · '언덕' (누르면 봉우리 · 꼭대기를 다시 누르면 높아짐 · 지우개로 뺌). 1층 놓기 = 1F 지형.
     v7.17.1: ''')
rep('h1::after{content:" v7.17.1"', 'h1::after{content:" v7.18.0"')
rep('<footer>굴의 전투판 v7.17.1', '<footer>굴의 전투판 v7.18.0')
rep('return `굴의 전투판 v7.17.1 · ${title}', 'return `굴의 전투판 v7.18.0 · ${title}')
rep("copyText('굴의 전투판 v7.17.1 자동 판 기록", "copyText('굴의 전투판 v7.18.0 자동 판 기록")
rep('의 버전 기록에 — v7.17.1 특성 · 기술 아이콘', '의 버전 기록에 — v7.18.0 언덕 · 더미 · 엄폐 (1F 1.5단계) / v7.17.1 특성 · 기술 아이콘')
rep('">v7.17.1 · 특성 · 기술 아이콘</span>', '">v7.18.0 · 언덕 · 더미 · 엄폐</span>')

# ---------- 지형 그림 ----------
rep("    const r = MAP.t[y * S.W + x];\n    if (!r && isGrid(S.type)){", "    const r = MAP.t[y * S.W + x] === 1 ? 1 : 0;   // v7.18 더미 칸은 바닥 위에 따로 그림\n    if (!r && isGrid(S.type)){")
rep("""      if (open(-1, 0)) g.fillRect(x * P, y * P, 3, P);
    }
  }
}
function rebuildPreview(){""", """      if (open(-1, 0)) g.fillRect(x * P, y * P, 3, P);
    }
  }
  drawTerrain(g, P);   // v7.18
}
// v7.18 지형 그림: 언덕 = 높이만큼 밝게 · 왼쪽 위 빛의 명암 · 0.5M 등고선 / 더미 = 갑옷 무더기 · 굳은 시체 (그림자)
function drawTerrain(g, P){
  const m = MAP; if (!m || (!m.hills && !m.piles)) return;
  if (m.hills){ const Q = 2, N = P / Q, lv = (x, y) => Math.floor(gH(m, x, y) / 0.5);
    for (let y = 0; y < S.H * N; y++) for (let x = 0; x < S.W * N; x++){ const wx = (x + 0.5) / N, wy = (y + 0.5) / N; if (m.t[(wy | 0) * S.W + (wx | 0)] === 1) continue;
      const h = gH(m, wx, wy); if (h < 0.04) continue; const [gx, gy] = gGrad(m, wx, wy), sh = Math.max(-1, Math.min(1, (gx + gy) * 0.9));
      g.fillStyle = `rgba(214,186,128,${Math.min(0.42, h * 0.14).toFixed(3)})`; g.fillRect(x * Q, y * Q, Q, Q);
      if (Math.abs(sh) > 0.02){ g.fillStyle = sh > 0 ? `rgba(255,238,205,${Math.min(0.42, sh * 0.45).toFixed(3)})` : `rgba(0,0,0,${Math.min(0.5, -sh * 0.5).toFixed(3)})`; g.fillRect(x * Q, y * Q, Q, Q); }
      const l0 = lv(wx, wy); if (l0 > 0 && (lv(wx + 1 / N, wy) !== l0 || lv(wx, wy + 1 / N) !== l0)){ g.fillStyle = 'rgba(40,26,10,.42)'; g.fillRect(x * Q, y * Q, Q, Q); } }
    g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; for (const k of m.hills){ const hh = gH(m, k.x, k.y); if (hh < 0.6 || k.x < 0 || k.y < 0 || k.x >= S.W || k.y >= S.H) continue; const t = '▲' + hh.toFixed(1) + 'M'; g.fillStyle = 'rgba(0,0,0,.55)'; g.fillText(t, k.x * P + 1, k.y * P + 5); g.fillStyle = 'rgba(255,232,190,.85)'; g.fillText(t, k.x * P, k.y * P + 4); } }
  if (m.piles) for (let y = 0; y < S.H; y++) for (let x = 0; x < S.W; x++){ const k = pileAt(m, x + 0.5, y + 0.5); if (!k) continue;
    const R = mulberry32(x * 131 + y * 977 + 5), cx = x * P + P / 2, cy = y * P + P / 2;
    g.fillStyle = 'rgba(0,0,0,.38)'; g.beginPath(); g.ellipse(cx + 3, cy + 4, P * 0.5, P * 0.36, 0, 0, 6.283); g.fill();
    if (k === 1){ g.fillStyle = '#33343b'; g.beginPath(); g.ellipse(cx, cy + 2, P * 0.54, P * 0.42, 0, 0, 6.283); g.fill();   /* 갑옷 무더기: 판금 조각 · 투구 · 녹 */
      for (let i = 0; i < 8; i++){ const px = cx + (R() - 0.5) * P * 0.8, py = cy + (R() - 0.5) * P * 0.62, w = P * (0.18 + R() * 0.16), hh = P * (0.11 + R() * 0.12);
        g.save(); g.translate(px, py); g.rotate((R() - 0.5) * 1.6); g.fillStyle = ['#6d6f78', '#868893', '#53555e', '#7a6a58'][R() * 4 | 0]; g.fillRect(-w / 2, -hh / 2, w, hh); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(-w / 2 + 1, -hh / 2 + 1, w - 2, 1.5); g.restore(); }
      const hx = cx + (R() - 0.5) * 9, hy = cy - 3; g.fillStyle = '#90929d'; g.beginPath(); g.arc(hx, hy, P * 0.14, Math.PI, 0); g.fill(); g.fillStyle = '#17181c'; g.fillRect(hx - P * 0.12, hy - 2, P * 0.24, 2.5);
    } else { const a = R() * Math.PI; g.save(); g.translate(cx, cy); g.rotate(a); g.fillStyle = '#4e4339'; g.strokeStyle = '#4e4339';   /* 굳은 시체: 뻣뻣이 누운 몸 */
      g.beginPath(); g.ellipse(0, 0, P * 0.34, P * 0.13, 0, 0, 6.283); g.fill(); g.beginPath(); g.arc(P * 0.38, 0, P * 0.1, 0, 6.283); g.fill();
      g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(P * 0.12, 0); g.lineTo(P * 0.24, P * 0.26); g.moveTo(-P * 0.02, 0); g.lineTo(P * 0.1, -P * 0.27); g.moveTo(-P * 0.28, P * 0.03); g.lineTo(-P * 0.5, P * 0.12); g.moveTo(-P * 0.28, -P * 0.03); g.lineTo(-P * 0.5, -P * 0.1); g.stroke();
      g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-P * 0.2, -2); g.lineTo(P * 0.15, 2); g.stroke(); g.restore(); }
  }
}
function rebuildPreview(){""")
rep("    mctx.fillStyle = MAP.t[i] ? (e === 2 ? '#2b2530' : '#1a161d') : lit ?", "    mctx.fillStyle = MAP.t[i] === 2 ? '#5d5248' : MAP.t[i] ? (e === 2 ? '#2b2530' : '#1a161d') : lit ?")

# ---------- 맵 칸: 지형 ----------
rep("""          <div class="row">
            <button class="btn go" id="baseExBtn" type="button">기본 판 놓기</button>""", """          <div class="row"><label class="brush" for="terrSel">지형</label><select id="terrSel" aria-label="지형"><option value="">평지</option><option value="1F">1F — 가끔 언덕 · 갑옷 무더기 · 굳은 시체</option><option value="hills">언덕 많음</option></select><button class="btn" id="terrRoll" type="button">지형 다시 굴리기</button><button class="btn warn" id="terrClr" type="button">손으로 고친 지형 빼기</button></div>
          <p class="note" id="terrNote">지형 (v7.18): 언덕은 높이만큼 밝고 등고선이 있어요 — 마루 너머는 안 보이고, 높은 쪽이 멀리 보며 잘 맞히고 (근접도), 오르막은 느리고 비탈을 뛰면 미끄러질 수 있어요. 더미 (갑옷 무더기 · 굳은 시체) 는 못 지나가는 낮은 엄폐 — 서 있으면 머리가 드러나고, 웅크리면 (은신하고 가만히) 무더기 뒤에 다 가려져요. 편집: '더미' · '언덕' 도구.</p>
          <div class="row">
            <button class="btn go" id="baseExBtn" type="button">기본 판 놓기</button>""")
rep("  $('randStart').checked = !!S.randStart;   // v6.1", "  $('randStart').checked = !!S.randStart;   // v6.1\n  $('terrSel').value = S.terr || '';   // v7.18")
rep("$('newMapBtn').addEventListener('click', () => {", """// v7.18 지형: 평지 · 1F · 언덕 많음 (같은 지형 씨앗이면 같은 지형) · 다시 굴리기 · 손으로 고친 것 빼기
const terrName = () => ({ '1F': '1F', hills: '언덕 많음' }[S.terr] || '평지') + ((S.piles || []).length || (S.hills || []).length ? ' + 손질' : '');
$('terrSel').addEventListener('change', e => { S.terr = e.target.value; if (!S.tseed) S.tseed = 1 + Math.floor(Math.random() * 999999); rebuildMap(); changed(); toast(`지형: ${terrName()} — 더미 ${MAP.piles}칸 · 언덕 ${MAP.hills ? MAP.hills.length : 0}`); });
$('terrRoll').addEventListener('click', () => { if (!S.terr){ toast('지형을 1F 나 언덕 많음으로 고른 뒤에 굴려요'); return; } S.tseed = 1 + Math.floor(Math.random() * 999999); S.pileOff = []; rebuildMap(); changed(); toast(`지형을 다시 굴렸어요 — 더미 ${MAP.piles}칸 · 언덕 ${MAP.hills ? MAP.hills.length : 0}`); });
$('terrClr').addEventListener('click', () => { if (!(S.piles || []).length && !(S.hills || []).length && !(S.pileOff || []).length){ toast('손으로 고친 지형이 없어요'); return; } S.piles = []; S.hills = []; S.pileOff = []; rebuildMap(); changed(); toast('손으로 놓은 더미 · 언덕을 뺐어요'); });
$('newMapBtn').addEventListener('click', () => {""")

# ---------- 편집 도구: 더미 · 언덕 ----------
rep('<button type="button" data-tool="rock">바위</button>', '<button type="button" data-tool="rock">바위</button><button type="button" data-tool="pile">더미</button><button type="button" data-tool="hill">언덕</button>')
rep("  if (tool === 'rock'){\n    const cx = Math.floor(w.x), cy = Math.floor(w.y);", """  if (tool === 'pile'){   // v7.18 더미: 빈 칸 → 갑옷 무더기 → 굳은 시체 → 없음 · 무작위로 생긴 더미는 누르면 뺌
    const cx = Math.floor(w.x), cy = Math.floor(w.y); if (cx < 0 || cy < 0 || cx >= S.W || cy >= S.H) return;
    if (MAP.t[cy * S.W + cx] === 1){ toast('바위 칸이에요'); return; }
    if (S.units.some(u => Math.floor(u.x) === cx && Math.floor(u.y) === cy)){ toast('누가 서 있는 칸엔 더미를 못 놓아요'); return; }
    const k0 = cx + ',' + cy, P0 = S.piles = S.piles || [], i = P0.findIndex(k => k.startsWith(k0 + ','));
    if (i >= 0){ const t = +P0[i].split(',')[2]; if (t === 1) P0[i] = k0 + ',2'; else P0.splice(i, 1); }
    else if (pileAt(MAP, cx + 0.5, cy + 0.5)) (S.pileOff = S.pileOff || []).push(k0);
    else { S.pileOff = (S.pileOff || []).filter(k => k !== k0); P0.push(k0 + ',1'); }
    S.torches = S.torches.filter(t => !(Math.floor(t.x) === cx && Math.floor(t.y) === cy));
    rebuildMap(); changed(); const now = pileAt(MAP, cx + 0.5, cy + 0.5); toast(now === 1 ? '갑옷 무더기 (1.1M · 엄폐)' : now === 2 ? '굳은 시체 (0.6M · 엎드려야 가려짐)' : '더미를 뺐어요'); return;
  }
  if (tool === 'hill'){   // v7.18 언덕: 누르면 봉우리 (반지름 3.5 · 1.5M) · 손으로 놓은 꼭대기를 다시 누르면 0.75M 높아짐 (3M 까지) · 지우개로 뺌
    const H0 = S.hills = S.hills || [], h = H0.find(k => Math.hypot(k.x - w.x, k.y - w.y) < 1.2);
    if (h) h.h = Math.min(3, +(h.h + 0.75).toFixed(2)); else H0.push({ x: +w.x.toFixed(2), y: +w.y.toFixed(2), r: 3.5, h: 1.5 });
    rebuildMap(); changed(); toast(`언덕 ${h ? '높임' : '놓음'} — 꼭대기 ${gH(MAP, w.x, w.y).toFixed(1)}M (지우개로 꼭대기를 누르면 뺌)`); return;
  }
  if (tool === 'rock'){
    const cx = Math.floor(w.x), cy = Math.floor(w.y);""")
rep("""  const ti = S.torches.findIndex(t => Math.hypot(t.x - w.x, t.y - w.y) < 0.8);
  if (ti >= 0){ S.torches.splice(ti, 1); changed(); toast('횃불 뺌'); }
}""", """  const ti = S.torches.findIndex(t => Math.hypot(t.x - w.x, t.y - w.y) < 0.8);
  if (ti >= 0){ S.torches.splice(ti, 1); changed(); toast('횃불 뺌'); return; }
  const hi = (S.hills || []).findIndex(k => Math.hypot(k.x - w.x, k.y - w.y) < 1.2);   // v7.18 손으로 놓은 언덕 · 더미
  if (hi >= 0){ S.hills.splice(hi, 1); rebuildMap(); changed(); toast('언덕 뺌'); return; }
  const k0 = Math.floor(w.x) + ',' + Math.floor(w.y), pi = (S.piles || []).findIndex(k => k.startsWith(k0 + ','));
  if (pi >= 0){ S.piles.splice(pi, 1); rebuildMap(); changed(); toast('더미 뺌'); return; }
  if (pileAt(MAP, w.x, w.y)){ (S.pileOff = S.pileOff || []).push(k0); rebuildMap(); changed(); toast('더미 뺌'); }
}""")
rep("tool === 'rock' ? '칸을 누르면 바위가 되고, 다시 누르면 바닥으로. 바위는 빛과 시야를 가려요' :",
    "tool === 'rock' ? '칸을 누르면 바위가 되고, 다시 누르면 바닥으로. 바위는 빛과 시야를 가려요' : tool === 'pile' ? '더미: 빈 칸 → 갑옷 무더기 (1.1M) → 굳은 시체 (0.6M) → 없음. 무작위로 생긴 더미는 누르면 빠져요. 못 지나가는 낮은 엄폐' : tool === 'hill' ? '언덕: 누르면 봉우리 (1.5M) · 꼭대기를 다시 누르면 높아짐 (3M 까지) · 지우개로 꼭대기를 누르면 빠져요' :")

# ---------- 1층 = 1F 지형 · 저장 · 복사 ----------
rep("const FLOOR_DEFAULTS = [{ name: '1층', note: '개활지 32×20 · 바위 · 벽 · 횃불 없음 · 적 여덟 (적 시작 무작위를 끄면 맞붙기까지 두 칸)', torches: 0,",
    "const FLOOR_DEFAULTS = [{ name: '1층', note: '개활지 32×20 · 1F 지형 (가끔 언덕 · 갑옷 무더기 · 굳은 시체 — 놓을 때마다 다름) · 횃불 없음 · 적 여덟 (적 시작 무작위를 끄면 맞붙기까지 두 칸)', torches: 0, terr: '1F',")
rep("  const L = { type: 'grid', W: 32, H: 20, mapC: false, randStart: true, seed: 1618, flips: [], units: [], torches: [], draft: { cands: newDraft().cands, picks: ['C-007', 'C-002', 'C-003'], done: true } };\n  for (const [k, c] of f.put)",
    "  const L = { type: 'grid', W: 32, H: 20, mapC: false, randStart: true, seed: 1618, flips: [], units: [], torches: [], terr: f.terr || '', tseed: 1 + Math.floor(Math.random() * 999999), draft: { cands: newDraft().cands, picks: ['C-007', 'C-002', 'C-003'], done: true } };   // v7.18 1F 지형 (놓을 때마다 다름)\n  for (const [k, c] of f.put)")
rep("  Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: L.mapC !== false, seed: L.seed, flips: L.flips || [], units: L.units.map(u => ({ ...u, id: uid() })), torches: L.torches || [], draft: L.draft || S.draft });\n  selId = null; renderDraft(); rebuildMap(); setMapUI(); changed(); centerStart(); hud(); renderFloors();",
    "  Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: L.mapC !== false, seed: L.seed, flips: L.flips || [], units: L.units.map(u => ({ ...u, id: uid() })), torches: L.torches || [], draft: L.draft || S.draft, terr: L.terr || '', tseed: L.tseed || 1, piles: L.piles || [], hills: L.hills || [], pileOff: L.pileOff || [] });   // v7.18 지형\n  selId = null; renderDraft(); rebuildMap(); setMapUI(); changed(); centerStart(); hud(); renderFloors();")
rep("    const snap = clone({ type: S.type, W: S.W, H: S.H, mapC: S.mapC, seed: S.seed, flips: S.flips || [], units: S.units, torches: S.torches || [], draft: S.draft });",
    "    const snap = clone({ type: S.type, W: S.W, H: S.H, mapC: S.mapC, seed: S.seed, flips: S.flips || [], units: S.units, torches: S.torches || [], draft: S.draft, terr: S.terr || '', tseed: S.tseed || 1, piles: S.piles || [], hills: S.hills || [], pileOff: S.pileOff || [] });   // v7.18 지형도")
rep("copyText(JSON.stringify({ v: 3, type: S.type, W: S.W, H: S.H, seed: S.seed, flips: S.flips || [], units: S.units, torches: S.torches, rules }), '지금 배치를 글자로 복사했어요')",
    "copyText(JSON.stringify({ v: 3, type: S.type, W: S.W, H: S.H, seed: S.seed, flips: S.flips || [], units: S.units, torches: S.torches, terr: S.terr || '', tseed: S.tseed || 1, piles: S.piles || [], hills: S.hills || [], pileOff: S.pileOff || [], rules }), '지금 배치를 글자로 복사했어요')")
rep("    Object.assign(S, { type: d.type || 'cave', W: d.W, H: d.H, seed: d.seed, flips: d.flips || [], units: d.units, torches: d.torches || [] });",
    "    Object.assign(S, { type: d.type || 'cave', W: d.W, H: d.H, seed: d.seed, flips: d.flips || [], units: d.units, torches: d.torches || [], terr: d.terr || '', tseed: d.tseed || 1, piles: d.piles || [], hills: d.hills || [], pileOff: d.pileOff || [] });   /* v7.18 지형 */")

# ---------- 상세 · 위 글 ----------
rep("  const fx = ed ? [] : [ (Wd.light[(u.y | 0) * S.W + (u.x | 0)] > 0.12 ? '빛 안' : '어둠 속'),",
    "  const fx = ed ? [] : [ (Wd.light[(u.y | 0) * S.W + (u.x | 0)] > 0.12 ? '빛 안' : '어둠 속'), ...terrFx(Wd, u),")
rep("function unitDetailHtml(Wd, u){", """// v7.18 지형 상태: 언덕 위 (높이) · 웅크림 · 엄폐 곁 (둘레 칸의 더미)
function terrFx(Wd, u){ if (!terrOn(Wd)) return []; const out = [], h = gH(Wd.map, u.x, u.y); if (h >= 0.3) out.push(`언덕 위 ${h.toFixed(1)}M`);
  if (crouching(Wd, u)) out.push(`웅크림 (키 ×${(Wd.rules.terrain || {}).crouch || 0.55} — 더미 뒤면 가려짐)`);
  let pk = 0; for (let dy = -1; dy <= 1 && !pk; dy++) for (let dx = -1; dx <= 1 && !pk; dx++) pk = pileAt(Wd.map, u.x + dx, u.y + dy); if (pk) out.push(pk === 2 ? '엄폐 곁 (굳은 시체 0.6M)' : '엄폐 곁 (갑옷 무더기 1.1M)');
  return out; }
function unitDetailHtml(Wd, u){""")
rep("? `적 ${left} · ${gridName(S)} · 바위 ${(S.flips || []).length} · 횃불 ${Wd.torches.length}`", "? `적 ${left} · ${gridName(S)} · 바위 ${(S.flips || []).length} · 지형 ${terrName()} (더미 ${MAP ? MAP.piles : 0}) · 횃불 ${Wd.torches.length}`")

open(F, 'w', encoding='utf-8').write(s)
print('page718 OK')
