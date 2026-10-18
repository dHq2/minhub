import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.8.7 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.8.8 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.8.8: 로그에 지휘를 남김 — 실제 지휘관의 결정처럼 되짚어 볼 수 있게.
             · ▶ 유저 지휘: 준 명령마다 (진행 중 · 멈춘 채 · 시작 행동) 누구에게 무엇을 · 연타 · 서두름, 그리고 그 순간의 상황
               (내 체력 · 자리 · 하던 동작 · 2칸 안 적 수 / 대상과의 간격 · 보였나 · 대상 체력 · 상대 기준 정면 · 옆 · 뒤 · 태세 · 공격 준비 중 / 돌진이면 도움닫기 거리 · 대기).
               막기 모드 · 휘두르기 · 횃불 · 명령 취소도. 대상이 안 보였으면 상태는 적지 않음 (지휘관이 몰랐던 것).
             · ⏸ ▶ ⏭ 유저: 멈춤 · 재생 · 한 턴 — 멈춰서 생각한 시간 (실제 초) 도.
             · 적 지휘 · 아군 지휘 (자동): 대치 · 교전 · 진형 풀림 · 조 나누기를 누가 (지휘관) 했는지.
             · 로그 끝에 '유저 지휘 요약': 명령 수 · 종류 · 인물별 · 멈춤 · 생각한 시간 · 돌진 명령의 결과 (들이받음 · 태세에 막힘 · 밀치기).
""",'notes')
rep('<span class="ver">v5.8.7 · 돌격 받기 (태세)','<span class="ver">v5.8.8 · 로그에 유저 지휘 · v5.8.7 · 돌격 받기 (태세)','ver')
rep("<footer>굴의 전투판 v5.8.7","<footer>굴의 전투판 v5.8.8",'footer')
rep("return `굴의 전투판 v5.8.7 · ${title}","return `굴의 전투판 v5.8.8 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.8.7\";","body.mob .top h1::after{content:\" v5.8.8\";",'mobver')

# 1) noteOrders → 유저 지휘 기록
rep("""function noteOrders(list){
  if (!world) return;
  for (const u of list){ preempt(world, u); const [s2, c2] = ACK(u.order); world.fx = world.fx.filter(f => !(f.k === 'ack' && f.a === u.i)); world.fx.push({ k: 'ack', a: u.i, s: s2, c: c2, t0: world.t }); }
  if (mode === 'run') for (const u of list) logEv(world, { k: 'order', a: u.i, o: orderTxt(u.order, u) });
}""",
"""function noteOrders(list, by, note){
  if (!world) return;
  for (const u of list){ preempt(world, u); const [s2, c2] = ACK(u.order); world.fx = world.fx.filter(f => !(f.k === 'ack' && f.a === u.i)); world.fx.push({ k: 'ack', a: u.i, s: s2, c: c2, t0: world.t }); }
  if (list.length) logCmd(world, list, { by: by || 'user', note, o: list.map(u => orderTxt(u.order, u)), f: list.map(u => (u.order && u.order.hurry ? 'h' : '') + (u.order && u.order.now ? 'n' : '')) });   // v5.8.8 유저 지휘
}
// v5.8.8 유저 지휘 기록: 누구에게 무엇을 + 그 순간 상황 (지휘관이 알던 만큼) — 로그에서 지휘를 되짚어 보려고
function logCmd(Wd, list, o){ logEv(Wd, { k: 'cmd', a: list.map(u => u.i), live: mode === 'run' && !paused, turn: Wd.turn, ctx: cmdCtx(Wd, list), ...o }); }
function cmdCtx(Wd, list){
  const C = Wd.rules.charge || {};
  return list.map(u => {
    const o = u.order, p = [`체력 ${Math.round(u.hp / u.max * 100)}%`, coord(u.x, u.y)];
    if (u.act) p.push(u.act.k === 'charge' ? '돌진 중' : u.act.k === 'reload' ? '재장전 중' : u.act.phase === 'wind' ? '공격 준비 중' : '회복 중');
    if (Wd.t < (u.stunT || -9)) p.push('휘청 중'); if (u.down) p.push('쓰러져 있음');
    const near = Wd.units.filter(f => f.alive && f.side !== u.side && f.seenBy && gap(u, f) < 2).length; if (near) p.push(`2칸 안 적 ${near}`);
    const t = o && o.b != null ? Wd.units[o.b] : null;
    if (t && t.side !== u.side){ const g = gap(u, t), q = [`간격 ${g.toFixed(1)}칸`];
      if (!t.seenBy) q.push('안 보임 (마지막으로 본 자리)');
      else { q.push(`체력 ${Math.round(t.hp / t.max * 100)}%`); const sd = sideOf(Wd, t, u); q.push(sd === 'front' ? '상대 정면' : sd === 'side' ? '상대 옆' : '상대 뒤');
        if (setFor(Wd, t, u)) q.push('상대 태세 (손이 빔 · 이쪽을 막음)'); else if (t.act && t.act.k === 'atk') q.push(t.act.phase === 'wind' ? '상대 공격 준비 중' : '상대 회복 중 (틈)'); else if (t.act && t.act.k === 'charge') q.push('상대 돌진 중'); else if (t.act && t.act.k === 'reload') q.push('상대 재장전 중'); else if (Wd.t < t.brokenT) q.push('상대 자세 무너짐'); else if (Wd.t < (t.stunT || -9)) q.push('상대 휘청 중');
        const f = focusOf(Wd, t); if (f && f !== u) q.push(`상대는 ${f.name}${jong(f.name) ? '과' : '와'} 싸우는 중`); }
      if (o.k === 'charge'){ q.push(g < (C.min || 1.5) ? '돌격 거리 안 됨 → 밀치기' : g >= (C.full || 3) ? '전력질주 거리' : `도움닫기 ${g.toFixed(1)}칸 (전력질주 ${C.full || 3}칸)`); if (Wd.t < u.chargeCd) q.push(`돌진 대기 ${f2(u.chargeCd - Wd.t)}초 남음`); }
      p.push(`→ ${t.name} [${q.join(' · ')}]`);
    } else if (t) p.push(`→ ${t.name} [체력 ${Math.round(t.hp / t.max * 100)}% · 간격 ${gap(u, t).toFixed(1)}칸]`);
    else if (o && o.x != null) p.push(`→ ${coord(o.x, o.y)} (${Math.hypot(o.x - u.x, o.y - u.y).toFixed(1)}칸)`);
    return p.join(' · ');
  });
}
// 유저 지휘 요약 (로그 끝): 명령 수 · 종류 · 인물별 · 멈춤 · 생각한 시간 · 돌진 명령의 결과
function cmdSummary(Wd){
  const cm = Wd.log.filter(e => e.k === 'cmd'), gm = Wd.log.filter(e => e.k === 'guardMode' && e.why === '명령'), tp = Wd.log.filter(e => e.k === 'tempo');
  if (!cm.length && !gm.length && !tp.length) return '';
  const kinds = {}, who = {}, add = (m, k, v) => { m[k] = (m[k] || 0) + (v || 1); };
  const KN = { move: '이동', amove: '공격 이동', attack: '공격', charge: '돌진', chargePt: '돌격 (자리)', throw: '투창', skill: '약 · 구급', hold: '제자리', auto: '자동', line: '전열', pick: '줍기', pickItem: '줍기', pickSpear: '창 줍기', leap: '도약' };
  let rapid = 0, hurry = 0;
  for (const e of cm){ if (e.kind === 'swing'){ add(kinds, '휘두르기'); e.a.forEach(i => add(who, Wd.units[i].name)); continue; }
    e.o.forEach((o, k) => { add(kinds, e.note === '명령 취소' ? '취소' : KN[o && o[0]] || (o && o[0]) || '자동'); add(who, Wd.units[e.a[k]].name); if ((e.f || [])[k] && e.f[k].includes('n')) rapid++; if ((e.f || [])[k] && e.f[k].includes('h')) hurry++; }); }
  for (const e of gm){ add(kinds, '막기 모드'); add(who, Wd.units[e.a].name); }
  const n = cm.reduce((s, e) => s + e.a.length, 0) + gm.length, live = cm.filter(e => e.live).length, op = cm.filter(e => e.by === 'opener').length;
  const th = tp.filter(e => e.think != null), tsum = th.reduce((s, e) => s + e.think, 0), tmax = th.reduce((m, e) => e.think > m.think ? e : m, { think: 0 });
  // 돌진 명령 → 그 인물의 다음 부딪힘 · 밀치기
  const res = {}; for (const e of cm) e.o.forEach((o, k) => { if (!o || o[0] !== 'charge') return; const a = e.a[k], r = Wd.log.find(x => x.t >= e.t && x.a === a && (x.k === 'impact' || x.k === 'tooClose' || (x.k === 'wind' && x.bash)));
    add(res, !r ? '부딪히지 못함' : r.k === 'tooClose' || r.k === 'wind' ? '가까워 밀치기' : r.held ? '태세에 막힘 (내가 당함)' : r.setBroke ? '태세를 무너뜨림' : r.push ? '밀치기 수준' : r.full ? '전력질주로 들이받음' : '들이받음'); });
  const J = m => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ');
  return `\\n유저 지휘 요약: 명령 ${n}번 (진행 중에 ${live} · 멈춘 채 ${cm.length - live - op} · 시작 행동 ${op}${gm.length ? ' · 막기 모드 ' + gm.length : ''}) · 턴당 ${(n / Math.max(1, Wd.turn)).toFixed(1)}번\\n` +
    `  종류: ${J(kinds)}${rapid ? ` (연타 ${rapid})` : ''}${hurry ? ` (서두름 ${hurry})` : ''}\\n  인물별: ${J(who)}\\n` +
    (tp.length ? `  멈춤 · 재생 ${tp.length}번 · 멈춰서 생각한 시간 합 ${Math.round(tsum)}초${tmax.think ? ` (가장 길게 ${Math.round(tmax.think)}초, ${f2(tmax.t)}초 때)` : ''}\\n` : '') +
    (Object.keys(res).length ? `  돌진 명령의 결과: ${J(res)}\\n` : '');
}""",'noteOrders')
rep("  if (n) noteOrders(Wd.units.filter(u => u.side === 0 && u.order));\n  return n;",
    "  if (n) noteOrders(Wd.units.filter(u => u.side === 0 && u.order), 'opener');\n  return n;",'opener')
rep("  throwPick = null; skillPick = null; noteOrders(C); toast(`${C.map(u => u.name).join(' · ')} 명령 취소 — 스스로 판단`); hud();",
    "  throwPick = null; skillPick = null; noteOrders(C, 'user', '명령 취소'); toast(`${C.map(u => u.name).join(' · ')} 명령 취소 — 스스로 판단`); hud();",'cancel')
rep("  if (k === 'auto'){ L.forEach(u => { u.order = null; u.stay = null; }); noteOrders(L); }",
    "  if (k === 'auto'){ L.forEach(u => { u.order = null; u.stay = null; }); noteOrders(L, 'user', '자동 (자리를 풀고 주인공을 따라감)'); }",'auto')
rep("logEv(world, { k: 'guardMode', a: u.i, m: nx, why: '명령' }); });",
    "logEv(world, { k: 'guardMode', a: u.i, m: nx, why: '명령', live: mode === 'run' && !paused, ctx: cmdCtx(world, [u])[0] }); });",'guard')
rep("    C.forEach(u => { u.swing = nx || null; });\n",
    "    C.forEach(u => { u.swing = nx || null; }); logCmd(world, C, { by: 'user', kind: 'swing', m: nx || '자동' });   // v5.8.8\n",'swing')
# 2) 멈춤 · 재생 · 한 턴 (생각한 시간)
rep("function nextTurn(){\n  if (mode === 'edit' || (world && world.over)){ start(); return; }\n  if (mode === 'run' && paused){ paused = false; cont = false; hud(); return; }   // 멈춘 턴을 끝까지\n  if (mode !== 'plan') return;",
    "// v5.8.8 유저 지휘: 멈춤 · 재생 · 한 턴 — 멈춰서 생각한 실제 시간도 남김\nlet thinkFrom = null;\nconst thinkSec = () => thinkFrom == null ? null : +((performance.now() - thinkFrom) / 1000).toFixed(1);\nfunction logTempo(s){ if (!world) return; logEv(world, { k: 'tempo', s, think: s === 'pause' ? null : thinkSec() }); thinkFrom = s === 'pause' ? performance.now() : null; }\nfunction nextTurn(){\n  if (mode === 'edit' || (world && world.over)){ start(); return; }\n  if (mode === 'run' && paused){ paused = false; cont = false; logTempo('step'); hud(); return; }   // 멈춘 턴을 끝까지\n  if (mode !== 'plan') return;\n  logTempo(cont ? 'play' : 'step');",'nextTurn')
rep("  if (mode === 'run'){ paused = !paused; if (!paused) cont = true; hud(); return; }\n  cont = true; nextTurn();",
    "  if (mode === 'run'){ paused = !paused; if (!paused) cont = true; logTempo(paused ? 'pause' : 'play'); hud(); return; }\n  cont = true; nextTurn();",'toggle')
rep("      else if (cont) beginTurn(world);\n      else mode = 'plan';",
    "      else if (cont) beginTurn(world);\n      else { mode = 'plan'; thinkFrom = performance.now(); }   // v5.8.8 명령 차례 — 여기서부터 생각한 시간",'plan')
rep("  mode = 'plan'; cont = false; paused = false; selId = null;\n  const nOp = applyOpeners(world);",
    "  mode = 'plan'; cont = false; paused = false; selId = null; thinkFrom = performance.now();\n  const nOp = applyOpeners(world);",'startThink')
# 3) 기록 글
rep("      case 'order': out.push(`${T(e)}${n(e.a)} 새 명령 → ${orderLabel(Wd, e.o)}`); break;",
    """      case 'order': out.push(`${T(e)}${n(e.a)} 새 명령 → ${orderLabel(Wd, e.o)}`); break;
      case 'cmd': {   // v5.8.8 유저 지휘
        const tag = `▶ 유저 지휘${e.by === 'opener' ? ' (시작 행동)' : e.live ? '' : ' (멈춘 채)'}`, who = e.a.map(n).join(' · ');
        if (e.kind === 'swing'){ out.push(`${T(e)}${tag} · ${who} 휘두르기 → ${e.m}`); break; }
        const lab = (o, f) => (e.note || orderLabel(Wd, o) || '자동') + ((f || '').includes('n') ? ' · 연타 (바로)' : '') + ((f || '').includes('h') ? ' · 서두름' : '');
        const same = e.o.every((x, k) => JSON.stringify(x) === JSON.stringify(e.o[0]) && (e.f || [])[k] === (e.f || [])[0]);
        out.push(`${T(e)}${tag} · ${same ? who + ' → ' + lab(e.o[0], (e.f || [])[0]) : e.a.map((i, k) => n(i) + ' → ' + lab(e.o[k], (e.f || [])[k])).join(' / ')}`);
        (e.ctx || []).forEach((c, k) => out.push(`${' '.repeat(10)}└ ${n(e.a[k])}: ${c}`)); break; }
      case 'tempo': out.push(`${T(e)}${{ pause: '⏸ 유저: 멈춤', play: '▶ 유저: 재생', step: '⏭ 유저: 한 턴' }[e.s] || e.s}${e.think != null ? ` (멈춰서 생각 ${e.think}초)` : ''}`); break;""",'cmdLog')
rep("      case 'guardMode': out.push(`${T(e)}🛡 ${n(e.a)} 막기: ${GM_SHORT[e.m] || e.m}${e.why ? ' (' + e.why + ')' : ''}`); break;",
    "      case 'guardMode': if (e.why === '명령'){ out.push(`${T(e)}▶ 유저 지휘${e.live === false ? ' (멈춘 채)' : ''} · ${n(e.a)} 막기 → ${GM_SHORT[e.m] || e.m}`); if (e.ctx) out.push(`${' '.repeat(10)}└ ${n(e.a)}: ${e.ctx}`); break; }\n        out.push(`${T(e)}🛡 ${n(e.a)} 막기: ${GM_SHORT[e.m] || e.m}${e.why ? ' (' + e.why + ')' : ''}`); break;",'guardLog')
rep("      case 'torch': out.push(`${T(e)}${ga(n(e.a))} 횃불을 내려놓음 (${coord(e.x, e.y)})`); break;",
    "      case 'torch': out.push(`${T(e)}▶ 유저 지휘 · ${ga(n(e.a))} 횃불을 내려놓음 (${coord(e.x, e.y)} · 남은 횃불 ${Wd.spare})`); break;",'torchLog')
rep("`명령: ${e.orders.map(([i, o]) => `${n(i)} ${orderLabel(Wd, o)}`).join(' · ') || '없음'}`",
    "`명령 상태: ${e.orders.map(([i, o]) => `${n(i)} ${orderLabel(Wd, o)}`).join(' · ') || '없음'}`",'turnLine')
rep("      case 'stance': out.push(`${T(e)}${e.side ? '적' : '아군'} ${{ hold:",
    "      case 'stance': out.push(`${T(e)}${e.side ? '◆ 적 지휘' : '◇ 아군 지휘 (자동)'}${(() => { const b = Wd.units.filter(u => u.side === e.side && u.cmd && (u.alive || u.down)).sort((a, c) => c.cmd - a.cmd)[0]; return b ? ' (' + b.name + ')' : ''; })()}: ${{ hold:",'stanceLog')
rep("      case 'squad': out.push(`${T(e)}적이 조를 나눔:",
    "      case 'squad': out.push(`${T(e)}◆ 적 지휘: 조를 나눔 —",'squadLog')
rep("  box.textContent = logHeader(Wd, logTitle) + logLines(Wd).join('\\n') + resultLine(Wd);",
    "  box.textContent = logHeader(Wd, logTitle) + logLines(Wd).join('\\n') + resultLine(Wd) + cmdSummary(Wd);   // v5.8.8 유저 지휘 요약",'box')
open(P,'w').write(s); print('ok')
