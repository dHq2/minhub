p='page10.tpl.html'; s=open(p).read()
def rep(a,b,n=1):
    global s; c=s.count(a); assert c==n,(c,a[:80]); s=s.replace(a,b)
rep("""header.top{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 14px;margin-bottom:8px}""","""header.top{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 14px;margin-bottom:8px}
.assist{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap} .assist .asb{font:700 12px var(--sans,inherit);padding:3px 9px;border-radius:999px;border:1px solid #5a6b52;background:#1f2a1c;color:#cfe8c0;cursor:pointer}
.assist .asb.off{border-color:#7a4a40;background:#2a1714;color:#ffb8a8;text-decoration:line-through} .assist .asm{font:600 11px var(--mono,monospace);color:var(--dim,#a99)}
.lk{font:700 10.5px var(--mono,monospace);padding:0 4px;border-radius:4px;margin-left:4px;white-space:nowrap} .lk.g{background:#1c3a22;color:#8fe0a0} .lk.y{background:#3a3218;color:#ffd77a} .lk.r{background:#3a1c18;color:#ff9b85} .lk.c{background:#3a3010;color:#ffd56a} .lk.q{background:#1c2a3a;color:#9fd0ff}""")
rep("""body.mob .top .ver,body.mob .top .lede{display:none}""","""body.mob .top .ver,body.mob .top .lede{display:none} body.mob .assist .asb{padding:2px 7px;font-size:11px} body.mob .assist .asm{display:none}""")
rep("""    <h1>굴의 전투판</h1><span class="ver">""","""    <h1>굴의 전투판</h1><span class="assist" id="assist" aria-label="보조 (멈춤 · 슬로우)"></span><span class="ver">""")
rep("""$('speedSeg').addEventListener('click', e => { const b = e.target.closest('[data-sp]'); if (!b) return;""","""// v7.4 마지막 혜택 제한 (토글): 멈춤 · 슬로우를 끄면 전장은 멈추지 않고 1× 아래로 느려지지 않음 (모바일 꾹 누름 슬로우도 없음). 싸움 전 (0초) 작전 회의는 그대로
const assistMode = () => S.noPause && S.noSlow ? '실전 지휘' : S.noPause ? '하드코어 (멈춤 없음)' : S.noSlow ? '슬로우 없음' : '보조 지휘';
const noPauseNow = () => !!S.noPause && !!world && mode !== 'edit' && !world.over && world.t > 1e-6;
function renderAssist(){ const a = $('assist'); if (!a) return; a.innerHTML = `<button type="button" class="asb ${S.noPause ? 'off' : ''}" data-as="pause" title="멈춤 (Space · 한 턴씩) 을 쓸 수 있는지">⏸ 멈춤</button><button type="button" class="asb ${S.noSlow ? 'off' : ''}" data-as="slow" title="½× · 꾹 누름 슬로우를 쓸 수 있는지">⏳ 슬로우</button><span class="asm">${assistMode()}</span>`; }
$('assist').addEventListener('click', e => { const b = e.target.closest('[data-as]'); if (!b) return;
  if (b.dataset.as === 'pause') S.noPause = !S.noPause; else S.noSlow = !S.noSlow; save();
  if (noPauseNow()){ paused = false; cont = true; if (mode === 'plan') nextTurn(); }
  if (S.noSlow && speed < 0.25){ const sb = $('speedSeg').querySelector('[data-sp="0.25"]'); if (sb) sb.click(); }
  renderAssist(); hud(); if (world) logEv(world, { k: 'assist', p: !S.noPause, s: !S.noSlow, live: mode === 'run' && !paused });
  toast(`${assistMode()} — 멈춤 ${S.noPause ? '끔 (전장은 멈추지 않음)' : '켬'} · 슬로우 ${S.noSlow ? '끔 (1× 아래 · 꾹 누름 슬로우 없음)' : '켬'}`); });
renderAssist();
$('speedSeg').addEventListener('click', e => { const b = e.target.closest('[data-sp]'); if (!b) return; if (S.noSlow && +b.dataset.sp < 0.25){ toast('슬로우를 끈 판이에요 — 1× 아래로는 못 내려요'); return; }""")
rep("""const slowNow = () => MOB && !!world && !world.over && (!!focus || armedNow());""","""const slowNow = () => MOB && !S.noSlow && !!world && !world.over && (!!focus || armedNow());   // v7.4 슬로우를 끄면 없음""")
rep("""  if (mode === 'run'){ paused = !paused; if (!paused) cont = true; logTempo(paused ? 'pause' : 'play'); hud(); return; }
  cont = true; nextTurn();""","""  if (mode === 'run'){ if (!paused && noPauseNow()){ toast('멈춤을 끈 판이에요 — 전장은 멈추지 않아요 (머리글 ⏸ 로 켤 수 있음)'); return; } paused = !paused; if (!paused) cont = true; logTempo(paused ? 'pause' : 'play'); hud(); return; }   // v7.4
  cont = true; nextTurn();""")
rep("""  if (mode !== 'plan') return;
  logTempo(cont ? 'play' : 'step');""","""  if (mode !== 'plan') return;
  if (S.noPause && world && world.t > 1e-6) cont = true;   // v7.4 멈춤을 끈 판은 한 턴씩 없이 이어감
  logTempo(cont ? 'play' : 'step');""")
rep("""      else if (cont) beginTurn(world);""","""      else if (cont || noPauseNow()) beginTurn(world);   // v7.4 멈춤을 끈 판은 턴 끝에 서지 않음""")
rep("""data-dk="step" ${playing ? 'disabled' : ''}>""","""data-dk="step" ${playing || noPauseNow() ? 'disabled' : ''}>""")
rep("""  if (k === 'speed'){ const L2 = [0.125, 0.25, 0.5, 1], v = L2[(L2.indexOf(speed) + 1) % L2.length];""","""  if (k === 'speed'){ const L2 = S.noSlow ? [0.25, 0.5, 1] : [0.125, 0.25, 0.5, 1], v = L2[(L2.indexOf(speed) + 1) % L2.length];""")
rep("""if (![0.125, 0.25, 0.5, 1].includes(speed)) speed = speed > 1 ? 1 : 0.25;""","""if (![0.125, 0.25, 0.5, 1].includes(speed)) speed = speed > 1 ? 1 : 0.25; if (S.noSlow && speed < 0.25) speed = 0.25;""")
rep("""function noteOrders(list, by, note){
  if (!world) return;
  for (const u of list){ preempt(world, u); const [s2, c2] = ACK(u.order); world.fx = world.fx.filter(f => !(f.k === 'ack' && f.a === u.i)); world.fx.push({ k: 'ack', a: u.i, s: s2, c: c2, t0: world.t }); }
  if (list.length) logCmd(world, list, { by: by || 'user', note, o: list.map(u => orderTxt(u.order, u)), f: list.map(u => (u.order && u.order.hurry ? 'h' : '') + (u.order && u.order.now ? 'n' : '')) });   // v5.8.8 유저 지휘
}""","""// v7.4 명령 전달: 지휘관 (깃발) 이 외치거나 손짓해 닿을 때 받음 — 확률 · 늦음 (지휘 등급 · 소음 · 빛 · 야시 · 맞붙음). 못 받으면 하던 대로 (자동 전투). 지휘관 자신 · 싸움 전 (0초) 은 바로
function noteOrders(list, by, note, raw){
  if (!world) return;
  const W = world, C = cmdBoss(W, 0), pre = W.t <= 1e-6;
  const lks = list.map(u => raw || pre ? { p: 1, t: 0, via: 'self' } : cmdLink(W, C, u));
  list.forEach((u, k) => { const [s2, c2] = ACK(u.order), lk = lks[k]; W.fx = W.fx.filter(f => !(f.k === 'ack' && f.a === u.i)); W.fx.push({ k: 'ack', a: u.i, s: (lk.via === 'self' || raw ? '' : '📣 ') + s2, c: lk.via === 'self' || raw ? c2 : '#cfc6b8', t0: W.t }); });
  if (list.length) logCmd(W, list, { by: by || 'user', note, o: list.map(u => orderTxt(u.order, u)), f: list.map(u => (u.order && u.order.hurry ? 'h' : '') + (u.order && u.order.now ? 'n' : '')), lk: lks.map(l => [+l.p.toFixed(2), l.via, +l.t.toFixed(1), l.why || '']) });   // v5.8.8 유저 지휘   // v7.4 전달
  list.forEach((u, k) => { const lk = lks[k];
    if (raw){ if (!u.lretId || (u.order && u.order.k === 'lret')) preempt(W, u); return; }
    if (lk.via === 'self'){ preempt(W, u); u.ordLive = u.order; u.ordPend = null; return; }
    const nu = u.order; u.order = u.ordLive !== undefined ? u.ordLive : null;
    u.ordPend = { o: nu, at: W.t + lk.t, ok: W.rand() < lk.p, p: lk.p, via: lk.via, why: lk.why, c: lk.c, m: lk.m, t0: W.t }; });
}
// 전달 확률 표시 (아군 칸): 🚩 지휘관 · 📣 % (초록 · 노랑 · 빨강) · ⏳ 전달 중 · 위치 모름
function linkBadge(Wd, u){
  if (mode === 'edit' || !Wd || !u.alive) return '';
  const C = cmdBoss(Wd, 0);
  if (u.ordPend) return `<span class="lk q" title="명령이 가는 중 (${u.ordPend.via === 'relay' ? '동료를 거쳐' : u.ordPend.via === 'sign' ? '손짓' : '외침'})">⏳ ${f2(Math.max(0, u.ordPend.at - Wd.t))}초</span>`;
  if (!C) return '<span class="lk r" title="지휘할 사람이 없음 — 각자 싸움 (임시 지휘관이 서기까지)">지휘관 없음</span>';
  if (u === C) return `<span class="lk c" title="지휘관 — 명령은 여기서 나감 (지휘 거리 ${cmdRange(Wd, C)}칸)">🚩 ${C.cmdTmp ? '임시 ' : ''}지휘</span>`;
  const lk = cmdLink(Wd, C, u), pc = Math.round(lk.p * 100), cl = lk.p >= 0.8 ? 'g' : lk.p >= 0.45 ? 'y' : 'r';
  return `<span class="lk ${cl}" title="${esc((lk.via === 'voice' ? '외침' : lk.via === 'sign' ? '손짓' : lk.via === 'relay' ? '전달' : '닿지 않음') + (lk.why ? ' · ' + lk.why : ''))}">📣 ${pc}%</span>${u.posUnk ? '<span class="lk r" title="지휘관이 보지도 듣지도 못함 — 마지막으로 안 자리">위치 모름</span>' : ''}`;
}""")
rep("""    } else if (f.k === 'ack' && age < 1.4){   // v5.5.1 명령을 받음:""","""    } else if (f.k === 'ack' && age < 1.4){   // v5.5.1 명령을 받음:
      if (f.s == null && f.o !== undefined){ const [s3, c3] = ACK(f.o); f.s = '✓ ' + s3; f.c = c3; }   // v7.4 명령이 닿음""")
rep("""<span class="st">${Math.ceil(u.hp)}/${u.max}${gearTxt(Wd, u)}${ed ? '' : ' · 명령 ' + orderLabel(Wd, ordOf(u))}""","""<span class="st">${Math.ceil(u.hp)}/${u.max}${gearTxt(Wd, u)}${ed ? '' : ' · 명령 ' + orderLabel(Wd, ordOf(u))}${linkBadge(Wd, u)}""")
rep("""<span class="dn"><span><b>${allyNo(Wd, u)}</b>${esc(u.name)}</span>""","""<span class="dn"><span><b>${allyNo(Wd, u)}</b>${esc(u.name)}${linkBadge(Wd, u)}</span>""")
rep("""  for (const u of Wd.units){
    if (!u.alive) continue;
    const vis = u.side === 0 || ed || u.seenBy;
    if (!vis && !see) continue;
    let px = ox + u.x * ts, py = oy + u.y * ts; const r = u.r * ts;""","""  for (const u of Wd.units){
    if (!u.alive) continue;
    const vis = u.side === 0 || ed || u.seenBy;
    if (!vis && !see) continue;
    if (hid0(u)){ const gx = ox + u.posK.x * ts, gy = oy + u.posK.y * ts, rr = u.r * ts; ctx.save(); ctx.globalAlpha = 0.5; ctx.setLineDash([4, 3]); ctx.strokeStyle = '#9fd0ff'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(gx, gy, rr, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#cfe6ff'; ctx.font = '800 ' + Math.max(11, rr | 0) + 'px IBM Plex Sans KR, sans-serif'; ctx.fillText('?', gx, gy); ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.fillText(`${u.name} · ${Math.round(Wd.t - u.posK.t)}초 전 자리`, gx, gy + rr + 9); ctx.restore(); continue; }   // v7.4 위치 모름 — 마지막으로 안 자리
    let px = ox + u.x * ts, py = oy + u.y * ts; const r = u.r * ts;""")
rep("""  const see = $('seeAll').checked, ed = mode === 'edit';
  if (!lightImg || lightCv.width !== S.W""","""  const see = $('seeAll').checked, ed = mode === 'edit', hid0 = u => !ed && u.side === 0 && !!u.posUnk && !!u.posK && !see;   // v7.4 지휘관이 모르는 아군
  if (!lightImg || lightCv.width !== S.W""")
rep("""  for (const u of Wd.units){ if (!u.alive || !u.shield) continue; const vis = u.side === 0 || ed || u.seenBy; if (!vis && !see) continue;""","""  for (const u of Wd.units){ if (!u.alive || !u.shield || hid0(u)) continue; const vis = u.side === 0 || ed || u.seenBy; if (!vis && !see) continue;""")
rep("""    for (const u of Wd.units){
      if (!u.alive || !u.act || u.act.phase !== 'wind') continue;""","""    for (const u of Wd.units){
      if (!u.alive || !u.act || u.act.phase !== 'wind' || hid0(u)) continue;""")
rep("""      for (const u of Wd.units){
        if (!u.alive || u.side !== 0 || !u.order || u.order.k === 'hold') continue;""","""      for (const u of Wd.units){
        if (!u.alive || u.side !== 0 || !u.order || u.order.k === 'hold' || hid0(u)) continue;""")
open(p,'w').write(s)
print('ok')
