p='page10.tpl.html'; s=open(p).read()
def rep(a,b,n=1):
    global s; c=s.count(a); assert c==n,(c,a[:80]); s=s.replace(a,b)
# --- 명령 이름
rep("""const ordOf = u => u.order && u.order.k === 'lret' ? ['lret', u.order.id] :""","""const ordOf = u => u.order && u.order.k === 'scout' ? ['scout', u.order.x, u.order.y] : u.order && u.order.k === 'lret' ? ['lret', u.order.id] :""")
rep("""  if (o[0] === 'lret') return '전열 후퇴';   // v7.2""","""  if (o[0] === 'lret') return '전열 후퇴';   // v7.2
  if (o[0] === 'scout') return `${ro(coord(o[1], o[2]))} 정찰`;   // v7.5""")
rep("""o.k === 'lret' ? ['🛡 전열 후퇴', '#9fd0ff'] :""","""o.k === 'lret' ? ['🛡 전열 후퇴', '#9fd0ff'] : o.k === 'scout' ? ['🔭 정찰', '#b9e0a0'] :""")
rep("""lret: '🛡 전열 후퇴: 전열이 물러설 곳 (바닥) 을 탭 — 전열 모두가 방패를 앞으로 든 채 함께',""","""lret: '🛡 전열 후퇴: 전열이 물러설 곳 (바닥) 을 탭 — 전열 모두가 방패를 앞으로 든 채 함께', scout: '🔭 정찰: 살펴볼 곳 (바닥) 을 탭 — 숨어서 가 보고 지휘관 곁으로 돌아와 보고',""")
# --- 명령: 정찰 · 은신 · 횃불
rep("""  else if (k === 'lret'){   // v7.2 전열 조직 후퇴""","""  else if (k === 'scout'){ armed = armed && armed.k === 'scout' ? null : { k: 'scout', cas: L.filter(u => !u.crawl).map(u => u.i) }; if (armed){ const bad = L.filter(u => u.stealthE < 0.5); toast(armedTxt() + (bad.length ? ` — ${bad.map(u => u.name).join(' · ')}: 크고 무거워 숨기 어려움 (숨는 솜씨 ${bad.map(u => Math.round(u.stealthE * 100) + '%').join(' · ')})` : '')); } }   // v7.5 정찰
  else if (k === 'stealth'){ const on = !L.every(u => u.stealth); L.forEach(u => { u.stealth = on; }); logEv(world, { k: 'stealthMode', a: L.map(u => u.i), on, live: mode === 'run' && !paused }); const tl = L.filter(u => u.torch && !u.torchOff);   // v7.5 은신 켜고 끔 (자세 — 바로)
    toast(`${L.map(u => u.name).join(' · ')} 은신 ${on ? '켬 — 숨어 걸음 (×' + ((world.rules.stealth || {}).spd || 0.6) + ') · 숨는 솜씨 ' + L.map(u => Math.round(u.stealthE * 100) + '%').join(' · ') + (tl.length ? ' · 횃불을 켠 ' + tl.map(u => u.name).join(' · ') + '은 숨지 못함' : '') : '끔'}`); }
  else if (k === 'lret'){   // v7.2 전열 조직 후퇴""")
rep("""  if (k === 'lret'){ const u0 = Wd.units[armed.cas[0]];   // v7.2 전열 조직 후퇴""","""  if (k === 'scout'){ if (u && u.alive){ toast('정찰: 살펴볼 바닥을 탭 · 아래로 쓸면 취소'); return; }   // v7.5 정찰: 지휘관이 지금 있는 자리로 돌아옴
    const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done(); const C = cmdBoss(Wd, 0);
    L2.forEach(x => { x.order = { k: 'scout', x: w.x, y: w.y, hx: (C || x).x, hy: (C || x).y }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', '정찰');
    toast(`${L2.map(x => x.name).join(' · ')} 정찰 — 숨어서 가 보고 돌아옴. 나가 있는 동안 본 것은 돌아와야 알 수 있어요`); return done(); }
  if (k === 'lret'){ const u0 = Wd.units[armed.cas[0]];   // v7.2 전열 조직 후퇴""")
rep("""  if (armed && armed.k === 'lret'){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥
  if (leapPick){""","""  if (armed && (armed.k === 'lret' || armed.k === 'scout')){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥   // v7.5 정찰: 살펴볼 바닥
  if (leapPick){""")
rep("""  if (armed && armed.k === 'lret'){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥""","""  if (armed && (armed.k === 'lret' || armed.k === 'scout')){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥""")
# 횃불 원터치
rep("""// v7.4 마지막 혜택 제한 (토글)""","""// v7.5 횃불 원터치: 든 이가 켜거나 끔 (켜는 데 0.8초 · 끄는 데 0.2초). 든 이가 지휘관이 아니면 명령처럼 닿아야 함
function toggleTorch(){
  const W = world; if (!W || mode === 'edit' || W.over) return; const H = W.units.filter(u => u.alive && u.side === 0 && u.torch); if (!H.length){ toast('횃불을 든 아군이 없어요'); return; }
  const on = H.some(h => h.torchOff && !(h.torchSw && !h.torchSw.on)), C = cmdBoss(W, 0);
  for (const h of H){ const lk = W.t <= 1e-6 || h === C ? { p: 1, t: 0, via: 'self' } : cmdLink(W, C, h);
    if (W.rand() >= lk.p){ logEv(W, { k: 'cmdMiss', side: 0, a: h.i, c: C ? C.i : null, via: lk.via, why: lk.why, p: +lk.p.toFixed(2), o: ['torch', on ? 1 : 0] }); toast(`${h.name}에게 횃불 ${on ? '켜' : '꺼'} 라는 말이 닿지 않았어요 (${lk.why || '닿지 않음'})`); continue; }
    torchSet(W, h, on, lk.t); }
  if (W.t <= 1e-6) for (const h of H){ if (h.torchSw){ h.torchOff = !h.torchSw.on; h.torchSw = null; } } computeLight(W);
  toast(on ? '🔥 횃불을 켬 — 보이지만 들킴 (켜는 데 0.8초)' : '🌑 횃불을 끔 — 어둠 속에선 야시 · 후각이 있는 쪽만 봄'); hud(); }
// v7.4 마지막 혜택 제한 (토글)""")
rep("""  if (k === 't' && mode !== 'edit' && world && !world.over){ if (world.spare > 0){ dropTorch(world); renderLog(); hud(); } else toast('남은 횃불이 없어요'); }""","""  if (k === 't' && mode !== 'edit' && world && !world.over){ if (!e.shiftKey){ toggleTorch(); } else if (world.spare > 0){ dropTorch(world); renderLog(); hud(); } else toast('남은 횃불이 없어요'); }   // v7.5 T = 횃불 켜고 끔 · Shift+T = 내려놓기""")
rep("""l: 'line', k: 'lret', x: 'cancel',""","""l: 'line', k: 'lret', y: 'scout', z: 'stealth', x: 'cancel',""")
rep("""  if (['amove', 'hold', 'auto', 'line', 'lret', 'guard', 'pick', 'swing', 'cancel', 'torch'].includes(k)){ ordKey(k); hud(); return; }""","""  if (k === 'torchT'){ toggleTorch(); return; }   // v7.5
  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'stealth', 'guard', 'pick', 'swing', 'cancel', 'torch'].includes(k)){ ordKey(k); hud(); return; }""")
rep("""      + (L.some(u => u.hero) && Wd.spare > 0 ? `<button type="button" class="db" data-dk="torch"><span class="ic">🔥</span>횃불<small>${Wd.spare}개</small></button>` : '')""","""      + `<button type="button" class="db" data-dk="scout"><span class="ic">🔭</span>정찰</button>`   // v7.5
      + `<button type="button" class="db ${L.every(u => u.stealth) ? 'on' : ''}" data-dk="stealth"><span class="ic">🥷</span>은신<small>${L.every(u => u.stealth) ? '켬' : '끔'}</small></button>`
      + (L.some(u => u.hero) && Wd.spare > 0 ? `<button type="button" class="db" data-dk="torch"><span class="ic">🔥</span>내려놓기<small>${Wd.spare}개</small></button>` : '')""")
rep("""      + `<button type="button" class="db" data-dk="speed">""","""      + (Wd && Wd.units.some(u => u.alive && u.side === 0 && u.torch) ? `<button type="button" class="db ${Wd.units.some(u => u.alive && u.side === 0 && u.torch && !u.torchOff) ? 'on' : ''}" data-dk="torchT"><span class="ic">${Wd.units.some(u => u.alive && u.side === 0 && u.torch && !u.torchOff) ? '🔥' : '🌑'}</span><small>횃불 ${Wd.units.some(u => u.alive && u.side === 0 && u.torch && !u.torchOff) ? '켬' : '끔'}</small></button>` : '')   // v7.5 원터치
      + `<button type="button" class="db" data-dk="speed">""")
rep("""<button class="btn" type="button" data-ord="hold">제자리 <kbd>H</kbd></button>""","""<button class="btn" type="button" data-ord="hold">제자리 <kbd>H</kbd></button><button class="btn" type="button" data-ord="scout" title="숨어서 가 보고 돌아와 보고 — 누른 뒤 살펴볼 바닥을 클릭">🔭 정찰 <kbd>Y</kbd></button><button class="btn ${L.every(u => u.stealth) ? 'on' : ''}" type="button" data-ord="stealth" title="숨어 걸음 — 들킬 거리 ↓ (작은 기동병이 잘 숨음)">🥷 은신 <kbd>Z</kbd></button><button class="btn" type="button" data-ord="torchT" title="횃불 켜고 끔 (Shift+T 는 내려놓기)">🔥 횃불 켬/끔 <kbd>T</kbd></button>""")
rep("""  if (k === 'none'){ sel = new Set(); hud(); return; }
  if (world.over) return;
  ordKey(k);""","""  if (k === 'none'){ sel = new Set(); hud(); return; }
  if (world.over) return;
  if (k === 'torchT'){ toggleTorch(); return; }   // v7.5
  ordKey(k);""")
# --- 소식 없음: 아군 칸 · 시체 · 유령
rep("""function linkBadge(Wd, u){
  if (mode === 'edit' || !Wd || !u.alive) return '';""","""function linkBadge(Wd, u){
  if (mode === 'edit' || !Wd) return '';
  if (u.posUnk && u.posK && !$('seeAll').checked) return `<span class="lk r" title="지휘관과 닿지 않음 — 무슨 일이 있는지 모름">소식 없음 ${Math.round(Wd.t - u.posK.t)}초</span>`;   // v7.5
  if (!u.alive) return '';""")
rep("""  for (const u of Wd.units) if (!u.alive && (u.side === 0 || litAt(Wd, u.x, u.y) || $('seeAll').checked)) drawCorpse(Wd, u, ox, oy, ts);""","""  for (const u of Wd.units) if (!u.alive && !(u.side === 0 && u.posUnk && mode !== 'edit' && !$('seeAll').checked) && (u.side === 0 || litAt(Wd, u.x, u.y) || $('seeAll').checked)) drawCorpse(Wd, u, ox, oy, ts);   // v7.5 소식 없는 동료의 시신은 찾기 전엔 안 보임""")
rep("""  for (const u of Wd.units){
    if (!u.alive) continue;
    const vis = u.side === 0 || ed || u.seenBy;
    if (!vis && !see) continue;
    if (hid0(u)){""","""  for (const u of Wd.units){
    if (!u.alive && !(hid0(u) && !u.down)) continue;   // v7.5 소식 없이 쓰러진 동료도 마지막 자리 (? ) 로
    const vis = u.side === 0 || ed || u.seenBy;
    if (!vis && !see) continue;
    if (hid0(u)){""")
# 정찰 실루엣 · 은신 표시
rep("""  // v7.4 지휘관 깃발""","""  // v7.5 정찰 보고: 본 적의 실루엣 (대략의 무장 · 본 그때의 자리를 흔들어 · 몇 초 전) — 누구인지 · 지금 어디인지는 모름
  if (!ed && Wd.scoutMarks && Wd.scoutMarks.length){ const keep = (Wd.rules.scout || {}).mark || 40; Wd.scoutMarks = Wd.scoutMarks.filter(m => Wd.t - m.at < keep);
    for (const m of Wd.scoutMarks){ const mx = ox + m.x * ts, my = oy + m.y * ts, k = 1 - (Wd.t - m.at) / keep, rr = ts * 0.34; ctx.save(); ctx.globalAlpha = 0.25 + 0.5 * k;
      ctx.fillStyle = 'rgba(30,22,26,.85)'; ctx.strokeStyle = '#d9a0a0'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(mx, my, rr, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#ffd0c8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '800 ' + Math.max(10, rr | 0) + 'px IBM Plex Sans KR, sans-serif'; ctx.fillText(m.smell ? '~' : '?', mx, my);
      if (ts >= 22){ ctx.font = '600 9.5px IBM Plex Sans KR, sans-serif'; ctx.fillText(`${(m.look || []).slice(0, 2).join(' · ')} · ${Math.round(Wd.t - m.t)}초 전`, mx, my + rr + 8); } ctx.restore(); } }
  // v7.4 지휘관 깃발""")
# --- 로그 · 이야기
rep("""      case 'tend': out.push(""","""      case 'scout': out.push(`${T(e)}🔭 ${n(e.a)} 정찰 나감 → ${coord(e.x, e.y)} (숨는 솜씨 ${Math.round((e.e || 0) * 100)}%)`); break;   // v7.5
      case 'scoutFlee': out.push(`${T(e)}🔭 ${n(e.a)} 들킴 — 뛰어 도망`); break;
      case 'scoutLost': out.push(`${T(e)}🔭 ${n(e.a)} 어둠 속 귀환 길을 헤맴 (${e.sec}초 · 후각 없음)`); break;
      case 'scoutRep': out.push(`${T(e)}🔭 정찰 보고 (${n(e.a)} · ${e.sec}초 다녀옴${e.lost ? ' · 길을 헤맨 ' + e.lost + '초' : ''}): ${e.n ? '적 ' + e.n + ' — ' + Object.entries(e.cnt || {}).map(([k2, v]) => k2 + (v > 1 ? ' ' + v : '')).join(' · ') + ' (본 때 ' + e.age[0] + '~' + e.age[1] + '초 전 · 자리는 대략)' : '본 적 없음'}`); break;
      case 'scream': out.push(`${T(e)}🔊 멀리서 비명 — ${e.dir}쪽 ${e.d}칸 언저리 (누구인지 모름)`); break;
      case 'deathFound': out.push(`${T(e)}👁 ${n(e.a)} — 쓰러진 채 발견됨`); break;
      case 'torchSw': out.push(`${T(e)}🔥 ${n(e.a)} 횃불을 ${e.on ? '켜는 중' : '끄는 중'}`); break;
      case 'torch': out.push(`${T(e)}${e.on ? '🔥' : '🌑'} ${n(e.a)} 횃불 ${e.on ? '켬' : '끔'}`); break;
      case 'stealthMode': out.push(`${T(e)}🥷 ${e.a.map(n).join(' · ')} 은신 ${e.on ? '켬' : '끔'}`); break;
      case 'tend': out.push(""")
rep("""    case 'cmdMiss': return e.side ?""","""    case 'scoutRep': return { c: 'good', s: `${ga(n(e.a))} 돌아왔다 — ${e.n ? '적 ' + e.n + '. ' + Object.entries(e.cnt || {}).map(([k2, v]) => k2 + (v > 1 ? ' ' + v : '')).join(' · ') + '. 어디 있는지는 그때의 대략.' : '아무것도 보지 못했다.'}` };   // v7.5
    case 'scream': return { c: 'bad', s: `멀리 ${e.dir}쪽에서 비명이 들린다.` };
    case 'deathFound': return { c: 'bad', s: `${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 쓰러져 있다.` };
    case 'torch': return { c: 'dim', s: e.on ? `${ga(n(e.a))} 횃불을 켠다 — 둘레가 드러난다.` : `${ga(n(e.a))} 횃불을 끈다 — 어둠이 덮친다.` };
    case 'scout': return { c: 'dim', s: `${ga(n(e.a))} 몸을 낮춰 어둠 속으로 사라진다.` };
    case 'cmdMiss': return e.side ?""")
rep("""  for (; narr.i < Wd.log.length; narr.i++){ const l = narrOf(Wd, Wd.log[narr.i]);""","""  for (; narr.i < Wd.log.length; narr.i++){ if (Wd.log[narr.i].unk && !$('seeAll').checked) continue; const l = narrOf(Wd, Wd.log[narr.i]);   // v7.5 그때 몰랐던 일은 이야기에 안 나옴""")
rep("""  for (let k = from || 0; k < Wd.log.length; k++){
    const e = Wd.log[k];
    switch (e.k){""","""  for (let k = from || 0; k < Wd.log.length; k++){
    const e = Wd.log[k];
    if (e.unk && !Wd.over && !$('seeAll').checked) continue;   // v7.5 지휘관과 닿지 않던 아군의 일은 싸움이 끝나야 로그에 (그때는 몰랐음)
    switch (e.k){""")
# --- 청광묵 [후각B]
rep("""traits: ['회피A', '급소A', '발화E', '실명:좌안'], active: ['도약', '팜 버스트'], race: '고블린',""","""traits: ['회피A', '급소A', '발화E', '실명:좌안', '후각B'], active: ['도약', '팜 버스트'], race: '고블린',""")
rep("""'C-004': { traits: ['발화E', '실명:좌안'], active: ['팜 버스트'] } })[ref] || null; }""","""'C-004': { traits: ['발화E', '실명:좌안', '후각B'], active: ['팜 버스트'] } })[ref] || null; }""")
rep("""const fixGob671 = p =>""","""// v7.5 청광묵 (고블린) 의 종특 [후각B] — 저장된 판 · 내 설계 · 층에도 (한 번만)
const fixGob75 = p => { if (!p || p.ref !== 'C-004' || (p.traits || []).some(x => /^후각[SABC]$|^높은후각$/.test(x))) return false; p.traits = [...(p.traits || []), '후각B']; return true; };
if (!S.v750g){ for (const u of S.units) fixGob75(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixGob75(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixGob75(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v750g = true; }
const fixGob671 = p =>""")
rep("RULES_MIG = '7.4.0';","RULES_MIG = '7.5.0';")
open(p,'w').write(s)
print('ok')
