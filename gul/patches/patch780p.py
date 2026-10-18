p='page10.tpl.html'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(a[:90],c); s=s.replace(a,b)
rep("""<!-- 굴의 전투판 v7.7.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.7.0:""","""<!-- 굴의 전투판 v7.8.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.8.0: 야전 — 밤의 진 · 잠 · 불빛 (아군 · 적 같은 규칙).
             ① 야영지: 적 진 (조우 전 시작) 가운데 모닥불 (빛 4.5칸). 깨어 있는 본대는 불가 (1.4칸) 에서 불을 보고 쉼 — 등은 어둠 쪽. 지휘관 아닌 본대의 반은 불빛 바로 밖 어스름에서 잠듦.
               초병은 불빛 밖 (빛 + 1.2칸) 어둠에서 바깥을 봄 (불을 보지 않음 — 눈이 어둠에 익은 채). 순찰조는 진 둘레를 돎. 모닥불은 멀리서도 보임 (판에 늘 그려짐).
             ② 잠과 깨어남: 잠든 몸은 아무것도 보지 못하고 누워 있음 (치면 넘어진 몸처럼 크게 · 급소). 깨는 때: 맞음 (0.5초 만에 벌떡) · 경보 · 동료의 외침 · 총성 (들리는 거리 × 0.8) · 비명 · 둘레 싸움 소리 · 숨지 않은 상대의 발소리 (1.2칸 안).
               깨면 1.2 ~ 2.6초 (베테랑 × 0.7) 뒤에 일어남 — 그 사이는 누워 있음. 소리 없는 암살은 아무도 깨우지 않음. 잠든 몸은 어느 쪽에서든 암살할 수 있음 (등 뒤가 아니어도).
             ③ 화광 실명: 밝은 빛 (밝기 0.35 넘음 — 횃불 · 모닥불 3.5칸쯤 안) 에 선 눈은 어둠에 적응하지 못함 — 빛 밖 어둠 속을 야시 A 는 5칸까지, B · C 는 야시 거리 × 0.6 (B 3칸 · C 1.5칸). 어스름 속 실루엣은 보는 거리 × 0.8.
               불가에 앉은 적은 어둠 속 침입자를 잘 못 봄 (야습의 틈). 우리 횃불 곁도 같음 — 자동으로 따라가는 야시 사수 (노먼) 는 횃불에서 3.9칸 떨어져 걸음, 사수가 자리를 고를 땐 빛 밖을 고름.
             ④ 횃불 던지기 (🔥 · I): 횃불을 든 아군이 7칸까지 던져 그 둘레를 밝힘 (흩어져 떨어짐 · 바위 앞에 멈춤). 여분 횃불이 있으면 불을 옮겨 붙여 던지고 든 것은 그대로, 없으면 든 횃불을 던짐 (손엔 빛이 없어짐 — 떨어진 횃불은 주울 수 있음).
               적: 경보 뒤 모닥불 곁의 몸이 보이지 않는 위협 (소리 · 냄새 · 날아온 방향으로 아는 쪽) 의 어둠으로 불붙은 장작을 던짐 (빛 3칸 · 40초 뒤 꺼짐 · 한 판 3번 · 4초마다).
             ⑤ 전투 일지: 판이 끝나면 굵직한 장면 (진의 모습 · 먼저 본 쪽 · 소리 없는 처치 · 던진 불 · 쓰러진 이 · 가장 많이 쓰러뜨린 이 · 마지막) 을 짧게 남김 (이야기 끝 · 로그 끝).
             ⑥ 버그: 주인공 (횃불을 든 지휘관) 이 쓰러지면 남은 동료가 서로를 기다리며 멈춰 시간이 끝나던 것 고침 (1층 20판에 한 번꼴).
             측정: (아래 v7.8 측정 줄)
     v7.7.0:""")
rep("""<span class="ver">v7.7.0 · 보이지 않으면""","""<span class="ver">v7.8.0 · 야영지 (모닥불 · 잠 · 불빛 밖 초병) · 야습 · 화광 실명 · 횃불 던지기 🔥 · 적의 장작 · 전투 일지 · v7.7.0 · 보이지 않으면""")
rep("""RULES_MIG = '7.7.0';""","""RULES_MIG = '7.8.0';""")
rep("""  <footer>굴의 전투판 v7.5.0 —""","""  <footer>굴의 전투판 v7.8.0 —""")
rep("""  return `굴의 전투판 v7.5.0 · ${title}""","""  return `굴의 전투판 v7.8.0 · ${title}""")
rep("""  copyText('굴의 전투판 v5.5.1 자동 판 기록""","""  copyText('굴의 전투판 v7.8.0 자동 판 기록""")
# 횃불 · 모닥불 · 장작 그림
rep("""  for (const t of Wd.torches) drawFlame(ox + t.x * ts, oy + t.y * ts, ts * 0.32, t.dropped);""","""  for (const t of Wd.torches){ const tx = ox + t.x * ts, ty = oy + t.y * ts;   // v7.8 모닥불 · 장작 · 꺼진 횃불
    if (t.off){ ctx.fillStyle = 'rgba(70,48,32,.85)'; ctx.fillRect(tx - ts * 0.1, ty - ts * 0.03, ts * 0.2, ts * 0.06); continue; }
    if (t.fire){ ctx.fillStyle = 'rgba(120,110,100,.9)'; for (let k = 0; k < 8; k++){ const a = k * 0.785; ctx.beginPath(); ctx.arc(tx + Math.cos(a) * ts * 0.36, ty + Math.sin(a) * ts * 0.36 + ts * 0.12, ts * 0.07, 0, 6.283); ctx.fill(); } drawFlame(tx - ts * 0.13, ty + ts * 0.05, ts * 0.38, false); drawFlame(tx + ts * 0.14, ty + ts * 0.07, ts * 0.34, false); drawFlame(tx, ty, ts * 0.55, false); continue; }
    drawFlame(tx, ty, ts * (t.brand ? 0.24 : 0.32), t.dropped || t.brand); }""")
# 날아가는 횃불 · 장작
rep("""  if (!ed) for (const f of Wd.fx){
    const age = now - f.t0; if (age < 0) continue;
    if (f.k === 'shot'){""","""  if (!ed) for (const f of Wd.fx){
    const age = now - f.t0; if (age < 0) continue;
    if (f.k === 'flare'){ if (age < f.dur){ const q = age / f.dur, x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q - Math.sin(q * Math.PI) * 1.3; drawFlame(ox + x * ts, oy + y * ts, ts * 0.26, true); } continue; }   // v7.8 불꽃이 호를 그림
    if (f.k === 'shot'){""")
# 잠 · 깨는 중 표시
rep("""    if (lying && vis && ts >= 22){ const t = u.koT && now < u.koT ?""","""    if (lying && vis && ts >= 22){ const t = u.sleep ? '💤 잠' : u.wakeT && now < u.wakeT ? '깨는 중' : u.koT && now < u.koT ?""")
# 명령 글
rep("""  if (o[0] === 'supp') return `${ro(coord(o[1], o[2]))} 견제사격`;   // v7.7""","""  if (o[0] === 'supp') return `${ro(coord(o[1], o[2]))} 견제사격`;   // v7.7
  if (o[0] === 'flare') return `${ro(coord(o[1], o[2]))} 횃불 던지기`;   // v7.8""")
rep("""const ordOf = u => u.order && u.order.k === 'supp' ?""","""const ordOf = u => u.order && u.order.k === 'flare' ? ['flare', u.order.x, u.order.y] : u.order && u.order.k === 'supp' ?""")
rep(""": o.k === 'supp' ? ['🎯 견제', '#ffc860'] :""",""": o.k === 'supp' ? ['🎯 견제', '#ffc860'] : o.k === 'flare' ? ['🔥 던지기', '#ffb347'] :""")
rep("""  if (a.k === 'supp') return a.ph === 'wind' ? '견제사격 — 당김' : '견제사격 뒤';   // v7.7""","""  if (a.k === 'supp') return a.ph === 'wind' ? '견제사격 — 당김' : '견제사격 뒤';   // v7.7
  if (a.k === 'flare') return a.ph === 'wind' ? '던지려 함' : '던짐';   // v7.8""")
# 로그 줄
rep("""      case 'supp': out.push(""","""      case 'rouse': out.push(`${T(e)}💤 ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} 잠에서 깸 — ${e.why} (${e.sec}초 뒤 일어남)${Wd.units[e.a].side && !e.vis ? ' [아군에겐 안 보임]' : ''}`); break;   // v7.8
      case 'flare': out.push(`${T(e)}🔥 ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} ${e.brand ? '모닥불에서 불붙은 장작을 꺼내 던짐' : e.own ? '든 횃불을 던짐 (손엔 빛이 없음)' : '여분 횃불에 불을 옮겨 붙여 던짐 (남은 여분 ' + e.spare + ')'} → ${coord(e.x, e.y)}`); break;
      case 'flareFail': out.push(`${T(e)}🔥 ${n(e.a)} 던지지 못함 — ${e.why}`); break;
      case 'brandOut': out.push(`${T(e)}🔥 던진 장작 하나가 다 타서 꺼짐`); break;
      case 'supp': out.push(""")
# 이야기
rep("""    case 'incoming': return e.side ?""","""    case 'rouse': return U(e.a).side === 0 ? { c: 'bad', s: `${ga(n(e.a))} 잠에서 깬다.` } : e.vis ? { c: 'bad', s: e.why === '맞음' ? `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 비명을 지르며 벌떡 일어난다!` : `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} ${e.why === '경보' || e.why === '외침' ? '외침에' : e.why === '총성' ? '총성에' : '소리에'} 눈을 뜬다 — 아직 누워 있다.` } : null;   // v7.8
    case 'flare': return e.brand ? { c: 'bad', s: `적이 모닥불에서 불붙은 장작을 꺼내 이쪽 어둠으로 던진다 — 불꽃이 호를 그린다!` } : U(e.a).side === 0 ? { c: 'good', s: `${ga(n(e.a))} 횃불을 던진다 — 불꽃이 호를 그리며 어둠을 가른다.${e.own ? ' 손엔 이제 빛이 없다.' : ''}` } : null;
    case 'flareFail': return null;
    case 'brandOut': return { c: 'dim', s: '던져진 장작 하나가 사그라든다.' };
    case 'incoming': return e.side ?""")
# 첫 줄 (모닥불이 보임)
rep("""  if (narr.W !== Wd){ narr = { W: Wd, i: 0, lines: [{ c: 'dim', s: '횃불 하나에 의지해 어둠 속으로 들어선다.' }] }; }""","""  if (narr.W !== Wd){ narr = { W: Wd, i: 0, lines: [{ c: 'dim', s: '횃불 하나에 의지해 어둠 속으로 들어선다.' }] }; if (Wd.campFire) narr.lines.push({ c: 'dim', s: `멀리 ${coord(Wd.campFire.x, Wd.campFire.y)} 쪽에 모닥불이 일렁인다 — 적의 진이다.` }); }   // v7.8""")
# 전투 일지: 이야기 끝 · 로그 끝
rep("""  if (Wd.over && !narr.done){ narr.done = true; narr.lines.push(Wd.result === 'win' ? { c: 'good', s: '마지막 적이 쓰러지고, 횃불 소리만 남는다.' } : { c: 'bad', s: '횃불이 바닥에 떨어져 꺼져 간다…' }); }""","""  if (Wd.over && !narr.done){ narr.done = true; narr.lines.push(Wd.result === 'win' ? { c: 'good', s: '마지막 적이 쓰러지고, 횃불 소리만 남는다.' } : { c: 'bad', s: '횃불이 바닥에 떨어져 꺼져 간다…' }); const ch = chronicle(Wd); if (ch.length){ narr.lines.push({ c: 'tn', s: '— 전투 일지 —' }); for (const s2 of ch) narr.lines.push({ c: 'dim', s: s2 }); } }   // v7.8 전투 일지""")
rep("""  box.textContent = logHeader(Wd, logTitle) + logLines(Wd).join('\\n') + resultLine(Wd) + cmdSummary(Wd) + reviewSummary(Wd);""","""  box.textContent = logHeader(Wd, logTitle) + logLines(Wd).join('\\n') + resultLine(Wd) + (Wd.over ? '\\n전투 일지\\n' + chronicle(Wd).map(x => '  ' + x).join('\\n') + '\\n' : '') + cmdSummary(Wd) + reviewSummary(Wd);   // v7.8 전투 일지""")
rep("""function resultLine(Wd){""","""// v7.8 전투 일지: 판이 끝나면 굵직한 장면만 짧게
function chronicle(Wd){
  if (!Wd.over) return [];
  const G = Wd.log, U2 = i => Wd.units[i], nm = i => U2(i) ? U2(i).name : '?', iga = w => w + (jong(w) ? '이' : '가'), out = [], ts2 = e => Math.round(e.t) + '초';
  const st = Wd.start;
  if (st) out.push(st.k === 'patrol' && Wd.campFire ? `밤. ${st.desc.split(' — ')[0]} — 모닥불 곁에 적이 쉬고 있었다${(st.sleep || []).length ? ' (잠든 이 ' + st.sleep.length + ')' : ''}.` : `${st.desc}.`);
  const c0 = G.find(e => e.k === 'contact'), s0 = G.find(e => e.k === 'sentry');
  if (c0 && (!s0 || c0.t <= s0.t)) out.push(`${ts2(c0)}, 우리가 먼저 보았다 — ${iga(nm(c0.a))} 어둠 속의 ${nm(c0.b)}를.`);
  else if (s0) out.push(`${ts2(s0)}, 적 ${iga(nm(s0.a))} 먼저 우리를 보았다${s0.corpse ? ' (동료의 시신 곁에서)' : ''} — 경보.`);
  const sl = new Set(st && st.sleep || []), roused = new Set(G.filter(e => e.k === 'rouse').map(e => e.a)), sk = G.filter(e => e.k === 'die' && sl.has(e.b) && !roused.has(e.b));
  if (sk.length) out.push(`잠든 채 숨이 끊긴 적 ${sk.length} — ${sk.map(e => nm(e.b)).join(' · ')}.`);
  for (const e of G.filter(e => e.k === 'assn').slice(0, 3)) out.push(`${ts2(e)}, ${iga(nm(e.a))} ${nm(e.b)}의 숨을 소리 없이 끊었다.`);
  const fl = G.filter(e => e.k === 'flare'), fa = fl.filter(e => !e.brand), fb = fl.filter(e => e.brand);
  if (fa.length) out.push(`${ts2(fa[0])}, ${iga(nm(fa[0].a))} 횃불을 던져 어둠을 갈랐다${fa.length > 1 ? ' (모두 ' + fa.length + '번)' : ''}.`);
  if (fb.length) out.push(`적이 모닥불에서 장작을 꺼내 던졌다 (${fb.length}번).`);
  const sp = G.filter(e => e.k === 'supp' && U2(e.a) && U2(e.a).side === 0); if (sp.length) out.push(`견제사격 ${sp.length}번 — 보이지 않는 쪽으로 쏟아부었다.`);
  const sh = G.filter(e => e.k === 'shadowEnd'); if (sh.length) out.push(`적 암살조가 ${sh.length}번 어둠을 돌았다${sh.filter(e => /^들킴/.test(e.why || '')).length ? ' — 들킨 것 ' + sh.filter(e => /^들킴/.test(e.why || '')).length + '번' : ''}.`);
  for (const e of G.filter(e => e.k === 'die' && U2(e.b) && U2(e.b).side === 0)) out.push(`${ts2(e)}, ${nm(e.b)} 쓰러짐${e.how && DK_TXT[e.how] ? ' — ' + DK_TXT[e.how] : ''}${e.a !== e.b && U2(e.a) ? ' (' + nm(e.a) + ')' : ''}.`);
  const al = Wd.units.filter(u => u.side === 0), best = al.slice().sort((a, b) => (b.kills || 0) - (a.kills || 0) || b.dealt - a.dealt)[0];
  if (best && best.kills) out.push(`가장 많이 쓰러뜨린 이: ${best.name} (${best.kills}).`);
  const hl = al.filter(u => u.healed > 0).sort((a, b) => b.healed - a.healed)[0]; if (hl) out.push(`${iga(hl.name)} 동료의 상처를 ${Math.round(hl.healed)} 만큼 메웠다.`);
  const live = al.filter(u => u.alive);
  if (Wd.result === 'win') out.push(live.length === 1 ? `홀로 남은 ${iga(live[0].name)} 끝을 냈다 — ${Math.round(Wd.t)}초.` : `살아남은 이: ${live.map(u => u.name).join(' · ')} — ${Math.round(Wd.t)}초.`);
  else if (Wd.result === 'lose'){ const ld = G.filter(e => e.k === 'die' && U2(e.b) && U2(e.b).side === 0).pop(); if (ld) out.push(`마지막으로 쓰러진 이: ${nm(ld.b)} (${ts2(ld)}). 횃불이 꺼졌다.`); }
  else out.push('시간이 다 됐다 — 끝을 보지 못했다.');
  return out.slice(0, 14);
}
function resultLine(Wd){""")
# 조작: 횃불 던지기 (I)
rep("""  else if (k === 'supp'){ const ok = L.filter(""","""  else if (k === 'flare'){ const ok = L.filter(u => u.torch && !u.torchOff && !u.crawl); if (!ok.length){ toast('불이 붙은 횃불을 든 아군이 없어요 (꺼져 있으면 T 로 켠 뒤)'); return; } armed = armed && armed.k === 'flare' ? null : { k: 'flare', cas: [ok[0].i] }; if (armed) toast(armedTxt() + ` — ${ok[0].name} · ${world.spare > 0 ? '여분 횃불에 불을 옮겨 던짐 (남은 여분 ' + world.spare + ')' : '여분이 없어 든 횃불을 던짐 — 손엔 빛이 없어져요'}`); }   // v7.8 횃불 던지기
  else if (k === 'supp'){ const ok = L.filter(""")
rep("""supp: '🎯 견제사격: 화살 · 총알이 날아온 쪽 (바닥) 을 탭 — 그 둘레에 3발',""","""supp: '🎯 견제사격: 화살 · 총알이 날아온 쪽 (바닥) 을 탭 — 그 둘레에 3발', flare: '🔥 횃불 던지기: 밝힐 곳 (바닥, 7칸까지) 을 탭',""")
rep("""  if (k === 'supp'){ const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done();   // v7.7 견제사격""","""  if (k === 'flare'){ const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done();   // v7.8 횃불 던지기
    L2.forEach(x => { x.order = { k: 'flare', x: w.x, y: w.y }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', '횃불 던지기');
    toast(`${L2[0].name} → ${coord(w.x, w.y)} 쪽으로 횃불을 던짐${Math.hypot(w.x - L2[0].x, w.y - L2[0].y) > ((Wd.rules.flare || {}).rng || 7) ? ' (7칸 넘으면 다가가서)' : ''}`); return done(); }
  if (k === 'supp'){ const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done();   // v7.7 견제사격""")
rep("""  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'assn', 'supp', 'watch', 'stealth',""","""  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'assn', 'supp', 'watch', 'flare', 'stealth',""")
rep("""      + `<button type="button" class="db" data-dk="watch"><span class="ic">👁</span>사주경계</button>`""","""      + `<button type="button" class="db" data-dk="watch"><span class="ic">👁</span>사주경계</button>`
      + `<button type="button" class="db" data-dk="flare"><span class="ic">🔥</span>던지기</button>`   // v7.8""")
rep("""y: 'scout', u: 'assn', j: 'supp', o: 'watch', z: 'stealth',""","""y: 'scout', u: 'assn', j: 'supp', o: 'watch', i: 'flare', z: 'stealth',""")
rep("""👁 사주경계 <kbd>O</kbd></button>""","""👁 사주경계 <kbd>O</kbd></button><button class="btn" type="button" data-ord="flare" title="횃불을 든 아군이 던져 저 어둠을 밝힘 — 누른 뒤 바닥을 클릭 (여분이 있으면 여분을, 없으면 든 횃불을)">🔥 횃불 던지기 <kbd>I</kbd></button>""")
rep("""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp')){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥   // v7.5 정찰: 살펴볼 바닥   // v7.6 암살: 노릴 적   // v7.7 견제사격: 바닥""","""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp' || armed.k === 'flare')){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥   // v7.5 정찰: 살펴볼 바닥   // v7.6 암살: 노릴 적   // v7.7 견제사격: 바닥   // v7.8 횃불 던지기""")
rep("""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp')){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥""","""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp' || armed.k === 'flare')){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥""")
# 상세정보 시선: 화광 실명
rep("""${u.nv ? ' · 야시 ' + (u.nvG || 'A') : ' · 야시 없음 (어스름 속은 실루엣만)'}</span>`; })() : ''}""","""${u.nv ? ' · 야시 ' + (u.nvG || 'A') : ' · 야시 없음 (어스름 속은 실루엣만)'}${glareAt(Wd, u) ? ' · 밝은 빛 속 — 어둠에 눈이 멂 (' + (u.nv ? '어둠 속 ' + glareReach(Wd, u).toFixed(1) + '칸까지' : '어둠은 안 보임') + ')' : ''}${u.sleep ? ' · 💤 잠듦 (아무것도 못 봄)' : ''}</span>`; })() : ''}""")
open(p,'w').write(s)
print('ok')
