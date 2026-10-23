# v8.7.5 페이지 — page8751.py v1.1 (v1.1: 시작할 때 단추 설명 — 대형 자리로는 훈련장 (여정은 대장 둘레에서 시작해 싸움이 시작되면 대형으로) · v1.0: page8750.py 를 먼저 돌린 뒤 — 편성 창 · 준비 창 (K5): 편대 나누기 (배치 · 0초 — 편대 상자와 같은 규칙) · ★ 기준 · 모양 여섯 · 미리 보기 (공세선 · 칼 · 창 · 사수 · 치유 자리) ·
#   두 사람을 차례로 눌러 자리 맞바꾸기 · 자유 대형은 끌어 놓기 · 자리 되돌리기 · 버프 미리 보기 (진형 버프 + 지금 동료로 이룰 수 있는 조합 버프 — 도감 근거 · 모자란 것) · 시작할 때 (대형 자리로 · 놓인 자리 그대로) ·
#   싸울 때 (편대마다 대형 지킴 · 맞붙으면 각자) · 시작 교전 규칙 · 이 브라우저에 기억 · 0초엔 판에도 바로 (자리까지) · 싸우는 중에 열면 잠깐 멈춤 (멈춤을 끈 판은 그대로) · 휴대폰 한 줄 배치)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8750.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep(".fmrow .nm{", ".fmrow .fcx{width:24px;height:24px;border-radius:50%;flex:none;background-color:#2a3246;box-shadow:0 0 0 2px #3a4a66}\n.fmrow .nm{")

FMWIN_JS = r'''// v8.7.5 편성 창 · 준비 창 (K5): 이렇게 저렇게 움직여 진형을 미리 짜 보고 버프를 확인 · 시작할 때 어떻게 모일지 · 싸울 때 어떤 식으로 싸울지 — 이 브라우저에 기억 · 0초엔 판에도 바로
let fmSel = null, fmTab = 'A', fmDrag = null, fmWasRun = false;   // 맞바꿀 첫 사람 · 보는 편대 · 끌고 있는 사람 · 열 때 싸움이 돌던 중이었나
function fmOpen(){
  const el = $('fmWin'); if (!el.hidden){ fmClose(); return; }
  fmSel = null; fmDrag = null; el.hidden = false;
  if (mode === 'run' && !paused && !noPauseNow()){ paused = true; fmWasRun = true; logTempo('pause'); }   // 싸우는 중에 열면 잠깐 멈춤 (멈춤을 끈 판은 그대로)
  fmRender(); hud();
}
function fmClose(){
  $('fmWin').hidden = true; fmSel = null; fmDrag = null;
  if (fmWasRun && mode === 'run' && paused){ paused = false; cont = true; logTempo('play'); } fmWasRun = false; hud();
}
// 지금 판 (싸우는 중) 또는 배치 (미리 보기) 의 아군 — { u: 엔진 몸, p: 배치 칸, key: 이름표, sq: 편대, hero, alive }
function fmRoster(){
  const live = !!world && mode !== 'edit';
  if (!live){ const W = preview; if (!W) return { W: null, L: [], live }; return { W, live, L: S.units.map((p, k) => ({ p, u: W.units[k] })).filter(x => x.p.side === 0 && x.u && !x.p.summon).map(x => ({ ...x, key: fkeyOf(x.p), sq: fsqOf(x.p), hero: !!x.p.hero, alive: true })) }; }
  return { W: world, live, L: world.units.filter(u => u.side === 0 && !u.summon && !u.gone).map(u => ({ u, p: S.units[u.i] || null, key: u.fkey || fkeyOf(S.units[u.i] || u), sq: u.fsq || 'A', hero: !!u.hero, alive: u.alive && !u.down && !u.crawl })) };
}
function fmLeadOf(R, q){
  const M = R.L.filter(x => x.sq === q && x.alive); if (!M.length) return null; const C = form8Cfg();
  if (R.live && world.form && world.form[q] && world.form[q].lead != null){ const x = M.find(y => y.u.i === world.form[q].lead); if (x) return x; }
  const pk = C[q].lead != null ? M.find(x => x.key === C[q].lead) : null; if (pk) return pk;
  const u = formLeadPick(R.W, M.map(x => x.u), q); return M.find(x => x.u === u) || M[0];
}
// 미리 보기 자리: 엔진의 formLayout 그대로 (판과 같은 자리 · 맞바꾼 자리 · 자유 자리)
function fmLayout(R, q, shape){
  const ldx = fmLeadOf(R, q); if (!ldx) return null; const C = form8Cfg()[q], M = R.L.filter(x => x.sq === q && x.alive);
  M.forEach(x => { x.u.fkey = x.key; });
  const sh = shape || C.shape, WF = R.live && world.form ? world.form[q] : null;
  const F = { sq: q, lead: ldx.u.i, shape: sh, swaps: C.swaps, pin: sh === '자유' ? C.pin : null, face: WF && WF.face != null ? WF.face : -Math.PI / 2, slots: {} };
  formLayout(R.W, F, M.map(x => x.u));
  return { F, M, ldx };
}
// 자유 대형의 첫 자리: 바로 앞 모양 (없으면 편대 기본) 의 자리 그대로
function fmPinSeed(q, fresh){
  const R = fmRoster(); if (!R.W) return null; const C = form8Cfg(), prev = C[q].shape === '자유' ? (C[q].prevShape || (q === 'A' ? '삼각' : '산개')) : C[q].shape;
  const save = C[q].swaps; if (fresh) C[q].swaps = [];
  const Lo = fmLayout(R, q, prev); C[q].swaps = save; if (!Lo) return null; const pin = {};
  for (const x of Lo.M){ const s2 = Lo.F.slots[x.u.i]; if (s2 && x.u.i !== Lo.F.lead) pin[x.key] = { f: +s2.f.toFixed(2), l: +s2.l.toFixed(2) }; }
  return pin;
}
// 바꾼 자리 (맞바꾸기 · 자유 자리) 를 판에도
function fmApply(q){ const C = form8Cfg()[q], W = world && mode !== 'edit' ? world : null; if (W && W.form && W.form[q]){ formSet(W, q, { swaps: C.swaps || [], ...(C.shape === '자유' && C.pin ? { pin: C.pin } : {}) }); fmPlace0(W); } }
// 편대 나누기 (배치 · 0초만 — 편대 상자와 같은 규칙: 2편대에 처음 들어간 이가 지휘 (부대장))
function fmSetSq(key, q){
  const R = fmRoster(), x = R.L.find(y => y.key === key); if (!x || x.hero || !x.p) return;
  const t0 = R.live && mode === 'plan' && world.t < 1e-6; if (R.live && !t0){ toast('편대 나누기는 싸움 전 (배치 · 0초) 에만 — 싸우는 중엔 모양 · 기준 · 자리만'); return; }
  const p = x.p; p.sq = q; if (q === 'A' && p.rank === '부대장') p.rank = ''; if (q === 'B' && !S.units.some(y => y.side === 0 && y.rank === '부대장')) p.rank = '부대장';
  if (t0){ sqApply(); form8Setup(S); formInit(world, S); for (const u of world.units) if (u.side === 0) u.fdet = false; fmPlace0(world); } else { changed(); renderSqBox(); }
  fmRender(); hud();
}
function fmSetLead(key){
  const R = fmRoster(), x = R.L.find(y => y.key === key); if (!x || !x.alive) return; const C = form8Cfg(), q = x.sq;
  if (!R.live && C[q].lead === key){ C[q].lead = null; form8Save(); toast(`${FSQ_NM[q]} 기준 — 스스로 (가장 단단한 전선)`); fmRender(); return; }
  if (R.live){ form8Lead(x.u); fmRender(); return; }
  C[q].lead = key; form8Save(); toast(`★ ${x.u.name} — ${FSQ_NM[q]} 기준 (다음 판부터)`); fmRender();
}
function fmRender(){
  const el = $('fmC'); if (!el || $('fmWin').hidden) return;
  const R = fmRoster(), C = form8Cfg(), t0 = R.live && mode === 'plan' && world.t < 1e-6, canSq = !R.live || t0, sqs = ['A', 'B'];
  const head = `<h3>⚑ 편성 · 준비 <small>${R.live ? (t0 ? '싸움 전 (0초) — 바꾸면 판에도 바로' : '싸우는 중 — 모양 · 기준 · 자리 · 싸울 때 방식은 바로 (편대 나누기 · 시작할 때는 다음 판부터)') : '배치 — 다음 판부터 (이 브라우저에 기억)'}</small><button type="button" class="btn sm fmx" data-fmx="1">✕ 닫기 <kbd>Esc</kbd></button></h3>`;
  if (!R.W || !R.L.length){ el.innerHTML = head + '<p class="fmnote">아군이 없어요 — 배치 탭에서 놓거나 여정을 시작한 뒤에 열어요.</p>'; return; }
  const q = R.L.some(x => x.sq === fmTab && x.alive) ? fmTab : R.L.some(x => x.sq === 'A' && x.alive) ? 'A' : 'B'; fmTab = q;
  const CN = { front: '칼', spear: '창', back: '사수' }, ld = { A: fmLeadOf(R, 'A'), B: fmLeadOf(R, 'B') };
  const left = `<div class="fmsec"><h4>👥 편대 · ★ 기준</h4>${R.L.map(x => { const k = fClass(R.W, x.u), isL = ld[x.sq] && ld[x.sq].key === x.key;
      return `<div class="fmrow"><span class="fcx" style="${faceCss(faceOf(x.u.ref), 24)}"></span><span class="nm" title="${esc(x.u.name)}">${esc(x.u.name)}${x.alive ? '' : ' <small>(쓰러짐)</small>'}</span><span class="ck">${k === 'back' && x.u.cls === '치유' ? '치유' : CN[k]}</span><span class="seg2">${sqs.map(s2 => `<button type="button" class="${x.sq === s2 ? 'on' : ''}" data-fmsq="${esc(x.key)}|${s2}" ${x.hero || !canSq ? 'disabled' : ''} title="${x.hero ? '대장 (주인공) 은 본대' : !canSq ? '편대 나누기는 싸움 전 (배치 · 0초) 에만' : FSQ_NM[s2] + '로'}">${FSQ_NM[s2]}</button>`).join('')}</span><button type="button" class="star ${isL ? 'on' : ''}" data-fmld="${esc(x.key)}" ${x.alive ? '' : 'disabled'} title="${FSQ_NM[x.sq]}의 기준 — 대형이 이 사람에 맞춰 섬 · 이동 명령을 받음${isL && !R.live && C[x.sq].lead === x.key ? ' (한 번 더 누르면 스스로 고름)' : ''}">★</button></div>`; }).join('')}
    <p class="fmnote">★ 기준 (기준병) = 대형이 맞춰 서는 사람 — 고르지 않으면 가장 단단한 전선 (주 방어대장). 고른 무리에 기준이 있으면 이동 명령은 기준에게 가고 같은 편대원은 대형으로 따라가요. 따로 명령한 편대원은 떼어 맡김 — 🚩 모여 (W) 로 돌아와요. 2편대의 지휘 (부대장 · 명령 전달) 는 배치 탭의 편대 상자에서.</p></div>`;
  const cq = C[q], nOf = s2 => R.L.filter(x => x.sq === s2 && x.alive).length;
  const mid = `<div class="fmsec"><h4>🧭 모양 <span class="seg2">${sqs.map(s2 => `<button type="button" class="${s2 === q ? 'on' : ''}" data-fmtab="${s2}" ${nOf(s2) ? '' : 'disabled'}>${FSQ_NM[s2]} ${nOf(s2)}</button>`).join('')}</span><span class="seg2"><button type="button" class="${cq.on ? 'on' : ''}" data-fmon="${q}" title="대형 켜고 끔 — 끄면 예전처럼 각자 (주인공 · 편대장을 따라감)">⏻ ${cq.on ? '켬' : '끔'}</button></span></h4>
    <div class="fmsh">${FSH_ALL.map(sh => `<button type="button" class="${cq.shape === sh ? 'on' : ''}" data-fmsh="${q}:${sh}" title="${esc(FSH_TXT[sh])}">${FSH[sh]} ${sh}</button>`).join('')}</div>
    <canvas class="fmcv" id="fmCv" aria-label="대형 미리 보기"></canvas>
    <p class="fmnote">${cq.shape === '자유' ? '✥ 자유 — 사람을 끌어 놓아 자리를 정해요 (★ 기준은 가운데 고정).' : '두 사람을 차례로 누르면 자리를 맞바꿔요 (★ 기준은 그대로 — 기준을 바꾸려면 왼쪽 ★).'} ${esc(cq.shape)} — ${esc(FSH_TXT[cq.shape])}.</p>
    <div class="row"><button type="button" class="btn sm" data-fmreset="${q}" title="맞바꾼 자리${cq.shape === '자유' ? ' · 끌어 놓은 자리' : ''}를 되돌림">↺ 자리 되돌리기</button>${(cq.swaps || []).length ? ` <small class="fmnote">맞바꾼 자리 ${cq.swaps.length}</small>` : ''}</div></div>`;
  const RW = R.W.rules, BT = FBUF_TXT(RW), nmB = FBUF[cq.shape], al = R.L.filter(x => x.alive).map(x => x.u);
  const cbs = COMBO.map(Cb => { const who = al.filter(Cb.who), ok = who.length >= Cb.min && (!Cb.need || who.some(Cb.need)); return { Cb, who, ok }; }).filter(x => x.who.length);
  const right = `<div class="fmsec"><h4>✦ 버프 미리 보기</h4>
    <div class="fmbuf ${nmB ? '' : 'off'}"><b>진형 — ${nmB ? esc(nmB) : '없음'}</b><br>${nmB ? esc(BT[nmB]) : '자유 대형엔 진형 버프가 없어요'}<br><small>대형이 ${Math.round(((RW.form8 || {}).need || 0.7) * 100)}% 넘게 갖춰지고 제 자리 ${(RW.fbuf || {}).slot || 1.3}칸 안 (또는 맞붙음) 일 때 · 적도 같은 규칙 (적의 대치 진형 = 방패벽 · 쐐기 돌파 = 쐐기 돌파)</small></div>
    ${cbs.length ? cbs.map(({ Cb, who, ok }) => `<div class="fmbuf cb ${ok ? '' : 'off'}"><b>🤝 ${esc(Cb.nm)}${ok ? '' : ' — ' + (who.length < Cb.min ? Cb.min + '명부터' : '꼭 있어야 할 이가 없음')}</b><br>${esc(Cb.fx)}<br><small>${esc(Cb.why)} · 지금: ${esc(who.map(u => u.name).join(' · '))} · 서로 ${(RW.combo || {}).link || 5}칸 안에 이어져 있을 때 (편대가 달라도)</small></div>`).join('') : '<p class="fmnote">지금 동료로 이룰 조합 버프가 없어요 (도감의 무리 — 고블린즈 · 갱스터 파라다이스 · 굴에 떨어진 이들 · 노먼의 2편대).</p>'}</div>`;
  const foot = `<div class="fmfoot"><span class="lab">시작할 때</span><span class="seg2"><button type="button" class="${C.start !== 'loose' ? 'on' : ''}" data-fmstart="form" title="훈련장: 기준 둘레 6칸 안의 편대원이 제 자리에서 시작 (멀리 놓인 이는 그 자리를 지킴 — 떼어 맡김) · 여정은 대장 둘레에서 시작해 싸움이 시작되면 대형으로">⚑ 대형 자리로 모여서</button><button type="button" class="${C.start === 'loose' ? 'on' : ''}" data-fmstart="loose" title="놓인 자리 그대로 시작 — 싸움이 시작되면 제 자리로 걸어감">놓인 자리 그대로</button></span>
    <span class="lab">싸울 때</span>${sqs.map(s2 => `<span class="seg2" title="${FSQ_NM[s2]}">${[['keep', '대형 지킴'], ['loose', '맞붙으면 각자']].map(([v, t]) => `<button type="button" class="${C[s2].style === v ? 'on' : ''}" data-fmstyle="${s2}:${v}" title="${v === 'keep' ? '맞붙은 이만 그 자리에서 싸우고 나머지는 대형을 지킴 — 끝나면 제 자리로' : '아는 적이 있는 동안은 대형을 풀고 예전처럼 각자 — 싸움이 끝나면 다시 모임'}">${FSQ_NM[s2]} ${t}</button>`).join('')}</span>`).join('')}
    <span class="lab">시작 교전 규칙</span><span class="seg2">${[['', '그대로'], ['free', '⚔ 자유'], ['smart', '⚖ 판단'], ['hold', '🕊 금지'], ['nofire', '🔇 사격 금지']].map(([v, t]) => `<button type="button" class="${(C.roe || '') === v ? 'on' : ''}" data-fmroe="${v}" title="${v ? ROE_NM[v] + ' — ' + ROE_DESC[v] : '저마다의 교전 규칙 그대로 (지난 판 0초 선택 · 기본 판단 교전)'}">${t}</button>`).join('')}</span></div>`;
  el.innerHTML = head + `<div class="fmgrid">${left}${mid}${right}</div>` + foot;
  const cv = $('fmCv'); if (cv){ cv._fmSc = null; cv._fmMid = null; fmDraw(cv, R, q); }
}
// 미리 보기 그림: 앞이 위 · 공세선 (굵은 선) · 칼 (회색) · 창 (갈색) · 사수 · 치유 (파랑) · ★ 기준 (금색 테) · 맞바꿀 첫 사람 (붉은 테) · 끌고 있는 사람
function fmDraw(cv, R, q){
  if (!cv) return null; const Lo = fmLayout(R, q), g = cv.getContext('2d'), dpr = window.devicePixelRatio || 1, cw = cv.clientWidth || 320, ch = Math.round(Math.min(340, Math.max(210, cw * 0.72)));
  cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); cv.style.height = ch + 'px'; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, cw, ch);
  if (!Lo){ g.fillStyle = '#9fb0c8'; g.font = '600 12px IBM Plex Sans KR, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(`${FSQ_NM[q]}에 아무도 없어요 — 왼쪽에서 편대를 나눠요`, cw / 2, ch / 2); cv._fm = null; return null; }
  const col = FSQ_COL[q], pts = Lo.M.map(x => ({ x, s: x.u.i === Lo.F.lead ? { f: 0, l: 0, k: 'lead' } : Lo.F.slots[x.u.i] || { f: 0, l: 0, k: fClass(R.W, x.u) } }));
  if (fmDrag && fmDrag.sq === q){ const p = pts.find(p2 => p2.x.key === fmDrag.key); if (p) p.s = { ...p.s, f: fmDrag.f, l: fmDrag.l }; }
  let sc = cv._fmSc, mid = cv._fmMid;
  if (!sc || !fmDrag){ const fs = pts.map(p => p.s.f), ls = pts.map(p => p.s.l), fMin = Math.min(...fs, 0) - 1.2, fMax = Math.max(...fs, 0) + 1.5, lMin = Math.min(...ls, 0) - 1.2, lMax = Math.max(...ls, 0) + 1.2;
    sc = Math.min(cw / (lMax - lMin), (ch - 20) / (fMax - fMin), 46); mid = [(lMin + lMax) / 2, (fMin + fMax) / 2]; }
  const X = l => cw / 2 + (l - mid[0]) * sc, Y = f => 10 + (ch - 20) / 2 - (f - mid[1]) * sc;
  g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 1;
  for (let l = Math.ceil(mid[0] - cw / 2 / sc); l <= mid[0] + cw / 2 / sc; l++){ g.beginPath(); g.moveTo(X(l), 0); g.lineTo(X(l), ch); g.stroke(); }
  for (let f = Math.ceil(mid[1] - ch / 2 / sc); f <= mid[1] + ch / 2 / sc; f++){ g.beginPath(); g.moveTo(0, Y(f)); g.lineTo(cw, Y(f)); g.stroke(); }
  const bins = new Map(); for (const p of pts){ const k = Math.round(p.s.l / 0.6), f = p.s.f + (p.x.u.r || 0.4) + 0.45, cur = bins.get(k); if (!cur || f > cur.f) bins.set(k, { f, l: p.s.l }); }
  const fl = [...bins.values()].sort((a, b) => a.l - b.l);
  if (fl.length >= 2){ g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); fl.forEach((p, k) => k ? g.lineTo(X(p.l), Y(p.f)) : g.moveTo(X(p.l), Y(p.f))); g.strokeStyle = 'rgba(8,10,16,.9)'; g.lineWidth = 7; g.stroke(); g.strokeStyle = `rgb(${col})`; g.lineWidth = 4; g.stroke(); }
  g.fillStyle = 'rgba(207,227,255,.78)'; g.font = '700 10.5px IBM Plex Sans KR, sans-serif'; g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText('▲ 앞 (가는 쪽 · 적 쪽) — 굵은 선 = 공세선', 6, 4);
  const hit = [];
  for (const p of pts){ const u = p.x.u, cx = X(p.s.l), cy = Y(p.s.f), r = Math.max(10, Math.min(17, (u.r || 0.4) * sc)), k = p.s.k, isL = u.i === Lo.F.lead, isS = fmSel && fmSel.sq === q && fmSel.key === p.x.key, isD = fmDrag && fmDrag.key === p.x.key;
    g.fillStyle = isL ? '#3e3418' : k === 'back' ? '#22405e' : k === 'spear' ? '#4a3a1c' : '#363842'; g.strokeStyle = isL ? '#ffd76a' : isS || isD ? '#ff9a86' : `rgb(${col})`; g.lineWidth = isL || isS || isD ? 3 : 2;
    g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.fill(); g.stroke();
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `700 ${Math.round(Math.max(9, Math.min(12, r * 0.75)))}px IBM Plex Sans KR, sans-serif`; g.fillText((u.name || '?').slice(0, 2), cx, cy + 0.5);
    g.font = '600 9.5px IBM Plex Sans KR, sans-serif'; g.fillStyle = isL ? '#ffd76a' : '#9fb0c8'; g.fillText(isL ? '★ 기준' : k === 'back' ? (u.cls === '치유' ? '치유' : '사수') : k === 'spear' ? '창' : '칼', cx, cy + r + 8);
    hit.push({ key: p.x.key, x: cx, y: cy, r, lead: isL, s: p.s }); }
  cv._fm = { hit, sq: q, sc, mid, cw, ch }; cv._fmSc = sc; cv._fmMid = mid;
  return Lo;
}
const fmPt = (cv, e) => { const r0 = cv.getBoundingClientRect(); return { x: e.clientX - r0.left, y: e.clientY - r0.top }; };
const fmFL = (M, x, y) => { let l = (x - M.cw / 2) / M.sc + M.mid[0], f = M.mid[1] - (y - 10 - (M.ch - 20) / 2) / M.sc; l = Math.max(-7, Math.min(7, Math.round(l * 4) / 4)); f = Math.max(-7, Math.min(3, Math.round(f * 4) / 4)); if (Math.abs(f) < 0.6 && Math.abs(l) < 0.6) f = -0.75; return { f, l }; };
$('fmWin').addEventListener('pointerdown', e => {
  const cv = e.target.closest('#fmCv'); if (!cv || !cv._fm) return; const M = cv._fm, P = fmPt(cv, e), H = M.hit.find(h => Math.hypot(h.x - P.x, h.y - P.y) <= h.r + 5), q = M.sq, C = form8Cfg();
  e.preventDefault();
  if (!H){ if (fmSel){ fmSel = null; fmDraw(cv, fmRoster(), q); } return; }
  if (H.lead){ toast('★ 기준은 대형의 가운데 — 다른 사람을 기준으로 하려면 왼쪽의 ★'); return; }
  if (C[q].shape === '자유'){ fmDrag = { sq: q, key: H.key, f: H.s.f, l: H.s.l, moved: false }; try { cv.setPointerCapture(e.pointerId); } catch (er){} fmDraw(cv, fmRoster(), q); return; }
  if (!fmSel || fmSel.sq !== q){ fmSel = { sq: q, key: H.key }; fmDraw(cv, fmRoster(), q); toast('맞바꿀 다른 사람을 누르세요 (같은 사람 = 그만)'); return; }
  if (fmSel.key === H.key){ fmSel = null; fmDraw(cv, fmRoster(), q); return; }
  C[q].swaps = [...(C[q].swaps || []), [fmSel.key, H.key]].slice(-24); fmSel = null; form8Save(); fmApply(q); fmRender(); toast('자리를 맞바꿨어요');
});
$('fmWin').addEventListener('pointermove', e => { if (!fmDrag) return; const cv = $('fmCv'); if (!cv || !cv._fm) return; const P = fmPt(cv, e), v = fmFL(cv._fm, P.x, P.y); if (v.f !== fmDrag.f || v.l !== fmDrag.l){ fmDrag.f = v.f; fmDrag.l = v.l; fmDrag.moved = true; fmDraw(cv, fmRoster(), fmDrag.sq); } });
const fmDrop = () => { if (!fmDrag) return; const C = form8Cfg(), q = fmDrag.sq, d = fmDrag; fmDrag = null;
  if (d.moved){ C[q].pin = { ...(C[q].pin || {}), [d.key]: { f: d.f, l: d.l } }; form8Save(); fmApply(q); }
  fmRender(); };
$('fmWin').addEventListener('pointerup', fmDrop); $('fmWin').addEventListener('pointercancel', fmDrop);
$('fmWin').addEventListener('click', e => {
  if (e.target === $('fmWin')){ fmClose(); return; }
  const b = e.target.closest('button'); if (!b || b.disabled) return; const d = b.dataset, C = form8Cfg();
  if (d.fmx){ fmClose(); return; }
  if (d.fmtab){ fmTab = d.fmtab; fmSel = null; fmRender(); return; }
  if (d.fmsh){ const [q, sh] = d.fmsh.split(':'); form8Shape(q, sh); fmRender(); return; }
  if (d.fmon){ form8Toggle(d.fmon); fmRender(); return; }
  if (d.fmreset){ const q = d.fmreset; C[q].swaps = []; if (C[q].shape === '자유') C[q].pin = fmPinSeed(q, true); form8Save(); fmApply(q); toast(`${FSQ_NM[q]} 자리를 되돌렸어요`); fmRender(); return; }
  if (d.fmstart){ C.start = d.fmstart; form8Save(); if (C.start === 'form') fmPlace0(world); toast(C.start === 'form' ? '시작할 때 대형 자리로 모여서' : '시작할 때 놓인 자리 그대로 (다음 판부터)'); fmRender(); hud(); return; }
  if (d.fmstyle){ const [q, v] = d.fmstyle.split(':'); C[q].style = v; form8Save(); if (world && mode !== 'edit' && world.form && world.form[q]) formSet(world, q, { style: v }); toast(`${FSQ_NM[q]} 싸울 때 — ${v === 'loose' ? '맞붙으면 각자 (싸움이 끝나면 다시 모임)' : '대형 지킴 (맞붙은 이만 그 자리에서 싸움)'}`); fmRender(); hud(); return; }
  if (d.fmroe != null){ C.roe = d.fmroe; form8Save(); if (world && mode === 'plan' && world.t < 1e-6 && C.roe) for (const u of world.units) if (u.side === 0 && u.alive) u.roe = C.roe; toast(C.roe ? `시작 교전 규칙 — ${ROE_NM[C.roe]}` : '시작 교전 규칙 — 저마다 그대로'); fmRender(); hud(); return; }
  if (d.fmsq){ const k = d.fmsq.lastIndexOf('|'); fmSetSq(d.fmsq.slice(0, k), d.fmsq.slice(k + 1)); return; }
  if (d.fmld){ fmSetLead(d.fmld); return; }
});
document.addEventListener('click', e => { const b = e.target.closest('[data-fopen]'); if (b && !b.closest('#fmbar')) fmOpen(); });   // 편대 상자 · 다른 곳의 ⚑ 편성 단추
window.addEventListener('resize', () => { if (!$('fmWin').hidden) fmRender(); });
'''
rep("\n/* ---------- 턴 진행 ---------- */\nlet lastTs = 0, cont = false;", "\n" + FMWIN_JS + "\n/* ---------- 턴 진행 ---------- */\nlet lastTs = 0, cont = false;")

open(F, 'w', encoding='utf-8').write(s)
print('page8751 OK')
