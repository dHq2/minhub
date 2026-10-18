p='page10.tpl.html'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(a[:80],c); s=s.replace(a,b)
# 머리말 노트 · 버전
rep("""<!-- 굴의 전투판 v7.6.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.6.0:""","""<!-- 굴의 전투판 v7.7.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.7.0: 보이지 않으면 겨누지 못함 · 견제사격 · 횃불 실루엣 · 사주경계 · 적 암살조 (아군 · 적 같은 규칙).
             ① 총 · 활의 사거리는 보일 때만 — 못 보는 상대에게는 조준 자체를 못 함 (엔진이 이미 그렇게 함 · 확인: 30판 원거리 공격 463번 중 못 보는 상대를 겨눈 것 0).
             ② 견제사격 (🎯 · J · 베테랑 사수만 · 명령으로만): 화살 · 총알이 날아온 쪽 어둠 (바닥) 을 탭 → 그 둘레에 3발 (거리만큼 흩어짐). 맞히기보다 움찔하게 — 스치면 0.6초 움찔 (걸음 ×0.4 · 조준 ↓).
               쏘면 드러남 (총은 총성으로 자리를 알림). 사선에 아군이 있으면 기다리다 3초 넘으면 그만둠. 적 지휘관도 보이지 않는 사수에게 맞으면 날아온 방향으로 짐작해 베테랑 궁수에게 시킴 (지휘 전달 공식).
             ③ 날아온 방향: 쏜 자를 아무도 못 보면 맞거나 스친 쪽은 방향만 앎 — 판에 붉은 점선 (날아온 쪽 · 4초) · 로그 '○쪽 어둠에서 화살이 날아옴'.
             ④ 횃불 실루엣: 빛 반경 × 1.6 까지 어스름 — 야시가 없어도 실루엣은 보임 (누구인지 · 체력 · 무장은 모름, 판에 검은 그림자 + ?). 실루엣만 보고 쏘면 ×0.75. 어스름에서는 숨기도 덜 좋음 (×0.6).
               인주 (지휘관 · 야시 C) 처럼 어둠에 익숙하지 않은 눈에게 횃불이 주는 것. 적에게도 같은 어스름이 보임 (횃불은 양날).
             ⑤ 사주경계: 맞붙지 않은 몸은 가끔 뒤를 돌아봄 (4~8초마다 0.5초 · 베테랑 ×0.7 · 일반인 ×1.5 · 적이 있는 줄 모를 땐 ×1.5 · 초병 ×0.6). 돌아보는 동안 시선은 뒤 (앞은 비움) — 숨어 다가오는 몸 (들킬 거리 × 0.6) 과 등 뒤 기습을 알아챔.
               사주경계 명령 (👁 · O): 고른 아군이 그 자리에서 바깥을 나눠 보고 섬 (둘레를 고르게), 두 배로 자주 돌아봄. 숨는 솜씨 20% 아래 (거구 · 개조된 몸) 는 숨지 못함.
             ⑥ 적 암살조 (프로): 우리를 알게 된 적 지휘관이 맞붙지 않은 · 안 보이는 근접 하나 (암살 솜씨 40% 이상) 를 등이 비는 아군 (경계가 약할수록 · 사수 · 치유를 먼저) 에게 숨어서 보냄. 하나씩, 들키거나 · 맞붙거나 · 25초면 그만두고 8초 뒤 다시.
             측정: (아래 v7.7 측정 줄)
     v7.6.0:""")
rep("""<span class="ver">v7.6.0 · 암살""","""<span class="ver">v7.7.0 · 보이지 않으면 조준 불가 · 견제사격 🎯 (베테랑 · 명령) · 날아온 방향 · 횃불 실루엣 (어스름) · 사주경계 👁 (뒤돌아봄 · 명령) · 적 암살조 · v7.6.0 · 암살""")
rep("""RULES_MIG = '7.6.0';""","""RULES_MIG = '7.7.0';""")
# 실루엣 그림 (적, 어스름 속 — 누구인지 모름)
rep("""    let px = ox + u.x * ts, py = oy + u.y * ts; const r = u.r * ts;
    if (!isFar(u) && now - u.atkT < 0.14)""","""    if (!ed && !see && u.side === 1 && u.sil){ const sx = ox + u.x * ts, sy = oy + u.y * ts, rr = u.r * ts; ctx.save(); const g = ctx.createRadialGradient(sx, sy, rr * 0.2, sx, sy, rr * 1.3); g.addColorStop(0, 'rgba(4,3,6,.95)'); g.addColorStop(0.75, 'rgba(4,3,6,.8)'); g.addColorStop(1, 'rgba(4,3,6,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, rr * 1.3, 0, 6.283); ctx.fill();   // v7.7 실루엣 (어스름 속 — 누구인지 모름)
      ctx.strokeStyle = 'rgba(255,150,120,.5)'; ctx.lineWidth = 1.4; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(sx, sy, rr, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(255,200,180,.85)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '800 ' + Math.max(10, rr * 0.9 | 0) + 'px IBM Plex Sans KR, sans-serif'; ctx.fillText('?', sx, sy); if (ts >= 26){ ctx.font = '600 9.5px IBM Plex Sans KR, sans-serif'; ctx.fillText('실루엣', sx, sy + rr + 8); } ctx.restore(); continue; }
    let px = ox + u.x * ts, py = oy + u.y * ts; const r = u.r * ts;
    if (!isFar(u) && now - u.atkT < 0.14)""")
# 돌아봄 (사주경계) 눈 표시
rep("""      if (WATCH.has(u.mood) && !u.act) iconEye(px - r * 0.82, py - r * 0.82, is, u.side ? '#ffb8a8' : '#bfe0ff');""","""      if (WATCH.has(u.mood) && !u.act) iconEye(px - r * 0.82, py - r * 0.82, is, u.side ? '#ffb8a8' : '#bfe0ff');
      if (u.look && now < u.look.until) iconEye(px + Math.cos(u.look.a) * (r + is), py + Math.sin(u.look.a) * (r + is), is, u.side ? '#ffd0c0' : '#e0f0ff');   // v7.7 뒤를 돌아봄 (사주경계)""")
# 날아온 방향 · 견제사격 자리
rep("""  // v7.4 지휘관 깃발 (아군 금색 · 적 붉은색""","""  // v7.7 날아온 방향 (쏜 자를 못 봄 — 붉은 점선, 4초) · 견제사격 자리 (아군 명령)
  if (!ed){ for (const r0 of Wd.inc || []){ if ((r0.side !== 0 && !see) || Wd.t - r0.t > 4) continue; const k = 1 - (Wd.t - r0.t) / 4, x0 = ox + r0.x * ts, y0 = oy + r0.y * ts, x1 = ox + (r0.x + r0.dx * 4) * ts, y1 = oy + (r0.y + r0.dy * 4) * ts; ctx.save(); ctx.globalAlpha = 0.25 + 0.6 * k; ctx.strokeStyle = r0.side ? '#ffb070' : '#ff6a5a'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = r0.side ? '#ffd0a0' : '#ffb0a8'; ctx.font = '800 12px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', x1, y1); ctx.restore(); }
    for (const u of Wd.units){ const o = u.order; if (!u.alive || u.side !== 0 || !o || o.k !== 'supp') continue; const SU = Wd.rules.supp || {}, d = Math.hypot(o.x - u.x, o.y - u.y), rr = ((SU.spread || 0.45) + (SU.spreadD || 0.09) * d) * ts, cx = ox + o.x * ts, cy = oy + o.y * ts; ctx.save(); ctx.strokeStyle = 'rgba(255,200,90,.85)'; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(cx - rr * 0.5, cy); ctx.lineTo(cx + rr * 0.5, cy); ctx.moveTo(cx, cy - rr * 0.5); ctx.lineTo(cx, cy + rr * 0.5); ctx.stroke(); ctx.restore(); } }
  // v7.4 지휘관 깃발 (아군 금색 · 적 붉은색""")
# 적 목록: 실루엣
rep("""      <span class="nm">${esc(u.name)} <i>${coord(u.x, u.y)}${!ed && !u.seenBy ? ' · 안 보임' : ''}</i></span>""","""      <span class="nm">${!ed && !see && u.sil ? '실루엣 (누구인지 모름)' : esc(u.name)} <i>${coord(u.x, u.y)}${!ed && !u.seenBy ? ' · 안 보임' : ''}</i></span>""")
# 상세정보: 시선 (사주경계)
rep("""    ${!ed && known && u.assnE != null ?""","""    ${!ed && known && Wd.rules.watch && u.alive ? (() => { const R2 = Wd.rules.watch, g = R2.gap || [4, 8], calm = u.side === 1 ? !Wd.alarm1 && u.state !== 'hunt' && u.state !== 'search' : !Wd.contact0, m = (u.vet ? R2.vet || 1 : 1) * ((u.traits || []).includes('일반인') ? R2.layman || 1 : 1) * (u.sentry ? R2.sentry || 1 : 1) * (u.order && u.order.k === 'watch' ? R2.ring || 1 : 1) * (calm ? R2.calm || 1 : 1); return `<span class="tr"><span class="lb">시선</span> 맞붙지 않으면 약 ${((g[0] + g[1]) / 2 * m).toFixed(1)}초마다 뒤를 돌아봄 (사주경계)${u.order && u.order.k === 'watch' ? ' · 사주경계 명령' : ''}${u.look && Wd.t < u.look.until ? ' · 지금 돌아봄' : ''}${u.nv ? ' · 야시 ' + (u.nvG || 'A') : ' · 야시 없음 (어스름 속은 실루엣만)'}</span>`; })() : ''}
    ${!ed && known && u.assnE != null ?""")
# 명령 글
rep("""  if (o[0] === 'assn') return `${Wd.units[o[1]].name} 암살`;   // v7.6""","""  if (o[0] === 'assn') return `${Wd.units[o[1]].name} 암살`;   // v7.6
  if (o[0] === 'supp') return `${ro(coord(o[1], o[2]))} 견제사격`;   // v7.7
  if (o[0] === 'watch') return '사주경계';""")
rep("""const ordOf = u => u.order && u.order.k === 'assn' ? ['assn', u.order.b] :""","""const ordOf = u => u.order && u.order.k === 'supp' ? ['supp', u.order.x, u.order.y] : u.order && u.order.k === 'watch' ? ['watch'] : u.order && u.order.k === 'assn' ? ['assn', u.order.b] :""")
rep(""": o.k === 'assn' ? ['🗡 ' + tn, '#c9a0ff'] :""",""": o.k === 'assn' ? ['🗡 ' + tn, '#c9a0ff'] : o.k === 'supp' ? ['🎯 견제', '#ffc860'] : o.k === 'watch' ? ['👁 사주경계', '#bfe0ff'] :""")
rep("""  if (a.k === 'assn') return a.ph === 'wind' ?""","""  if (a.k === 'supp') return a.ph === 'wind' ? '견제사격 — 당김' : '견제사격 뒤';   // v7.7
  if (a.k === 'assn') return a.ph === 'wind' ?""")
# 로그 줄
rep("""      case 'assnGo': out.push(""","""      case 'supp': out.push(`${T(e)}🎯 ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} 견제사격 → ${coord(e.x, e.y)} 둘레 어둠에 ${e.n}발${e.ai ? ' (지휘관이 시킴 — 날아온 쪽을 짐작)' : ''}${Wd.units[e.a].side && !e.vis ? ' [아군에겐 안 보임]' : ''}`); break;   // v7.7
      case 'suppEnd': out.push(`${T(e)}🎯 ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} 견제사격 끝 — ${e.n}발 · 맞힘 ${e.hit}${e.why ? ' · ' + e.why : ''}`); break;
      case 'incoming': out.push(e.side ? `${T(e)}🏹 적 ${n(e.b)} — ${e.dir}쪽에서 ${e.gun ? '총알' : '화살'}이 날아옴 (쏜 자를 못 봄${e.supp ? ' · 견제사격' : ''})` : `${T(e)}🏹 ${n(e.b)}에게 ${e.gun ? '총알' : '화살'}이 날아옴 — ${e.dir}쪽 어둠에서 (쏜 자는 안 보임${e.supp ? ' · 견제사격' : ''})`); break;
      case 'shadow': out.push(`${T(e)}🗡 적 ${n(e.a)} — 지휘관의 지시로 숨어서 ${n(e.b)}의 등 뒤로 (암살조)${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;
      case 'shadowEnd': out.push(`${T(e)}🗡 적 ${n(e.a)} 암살조 끝 — ${e.why}${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;
      case 'assnGo': out.push(""")
# 이야기
rep("""    case 'assnGo': return { c: 'dim', s:""","""    case 'incoming': return e.side ? (e.vis ? { c: 'good', s: `적 ${n(e.b)}${jong(n(e.b)) ? '이' : '가'} 어디서 날아왔는지 모를 ${e.gun ? '총알' : '화살'}에 몸을 움츠린다.` } : null) : { c: 'bad', s: `${e.dir}쪽 어둠에서 ${e.gun ? '총알' : '화살'}이 날아온다 — 쏜 자는 보이지 않는다.` };   // v7.7
    case 'supp': return U(e.a).side === 0 ? { c: 'good', s: `${ga(n(e.a))} ${coord(e.x, e.y)} 쪽 어둠에 견제사격을 퍼붓는다 — 겨눈 게 아니라 고개를 못 들게.` } : e.vis ? { c: 'bad', s: `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 이쪽 어둠으로 화살을 쏟아붓는다 — 보고 쏘는 게 아니다.` } : null;
    case 'suppEnd': return null;
    case 'shadow': return e.hid ? null : { c: 'bad', s: `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 몸을 낮추더니 어둠 속으로 사라진다 — 누군가의 등을 노린다!` };
    case 'shadowEnd': return /^들킴/.test(e.why || '') ? { c: 'good', s: `숨어 다가오던 적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 들켰다!` } : null;
    case 'assnGo': return { c: 'dim', s:""")
# 조작: 견제사격 (J) · 사주경계 (O)
rep("""  else if (k === 'assn'){ armed = armed && armed.k === 'assn' ? null :""","""  else if (k === 'supp'){ const ok = L.filter(u => isFar(u) && u.vet && !u.crawl && u.ammo !== 0); if (!ok.length){ toast('견제사격은 베테랑 사수만 (탄이 있어야) — 고른 아군 중 없어요'); return; } armed = armed && armed.k === 'supp' ? null : { k: 'supp', cas: ok.map(u => u.i) }; if (armed) toast(armedTxt() + ' — ' + ok.map(u => u.name).join(' · ') + (ok.length < L.length ? ' (나머지는 베테랑 사수가 아니라 빠짐)' : '')); }   // v7.7 견제사격
  else if (k === 'watch'){   // v7.7 사주경계: 그 자리에서 바깥을 나눠 보고 섬
    const L2 = L.filter(u => !u.crawl); if (!L2.length) return; const cx = L2.reduce((a, u) => a + u.x, 0) / L2.length, cy = L2.reduce((a, u) => a + u.y, 0) / L2.length;
    if (L2.length === 1) L2[0].order = { k: 'watch', f: L2[0].face || 0 };
    else { const S2 = L2.map(u => ({ u, a: Math.atan2(u.y - cy, u.x - cx) })).sort((p, q) => p.a - q.a); S2.forEach((p, j) => { p.u.order = { k: 'watch', f: S2[0].a + j * 2 * Math.PI / S2.length }; }); }
    sel = new Set(L2.map(u => u.i)); noteOrders(L2, 'user', '사주경계'); toast(`${L2.map(u => u.name).join(' · ')} 사주경계 — ${L2.length > 1 ? '바깥을 나눠 보고 섬' : '그 자리를 지키며'} · 자주 뒤를 돌아봄`); }
  else if (k === 'assn'){ armed = armed && armed.k === 'assn' ? null :""")
rep("""assn: '🗡 암살: 노릴 적을 탭 — 숨어서 등 뒤로 돌아 소리 없이',""","""assn: '🗡 암살: 노릴 적을 탭 — 숨어서 등 뒤로 돌아 소리 없이', supp: '🎯 견제사격: 화살 · 총알이 날아온 쪽 (바닥) 을 탭 — 그 둘레에 3발',""")
rep("""  if (k === 'assn'){ if (!(u && u.side === 1)){ toast('암살: 적을 탭 · 아래로 쓸면 취소'); return; }   // v7.6 암살""","""  if (k === 'supp'){ const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done();   // v7.7 견제사격: 바닥 (또는 그 자리) 둘레에
    L2.forEach(x => { x.order = { k: 'supp', x: w.x, y: w.y, n: (Wd.rules.supp || {}).n || 3 }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', '견제사격');
    toast(`${L2.map(x => x.name).join(' · ')} 견제사격 → ${coord(w.x, w.y)} 둘레에 ${(Wd.rules.supp || {}).n || 3}발 — 쏘면 자리가 드러나요`); return done(); }
  if (k === 'assn'){ if (!(u && u.side === 1)){ toast('암살: 적을 탭 · 아래로 쓸면 취소'); return; }   // v7.6 암살""")
rep("""  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'assn', 'stealth',""","""  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'assn', 'supp', 'watch', 'stealth',""")
rep("""      + `<button type="button" class="db" data-dk="assn"><span class="ic">🗡</span>암살</button>`   // v7.6""","""      + `<button type="button" class="db" data-dk="assn"><span class="ic">🗡</span>암살</button>`   // v7.6
      + `<button type="button" class="db" data-dk="supp"><span class="ic">🎯</span>견제</button>`   // v7.7
      + `<button type="button" class="db" data-dk="watch"><span class="ic">👁</span>사주경계</button>`""")
rep("""y: 'scout', u: 'assn', z: 'stealth',""","""y: 'scout', u: 'assn', j: 'supp', o: 'watch', z: 'stealth',""")
rep("""🗡 암살 <kbd>U</kbd></button>""","""🗡 암살 <kbd>U</kbd></button><button class="btn" type="button" data-ord="supp" title="베테랑 사수만 — 누른 뒤 화살 · 총알이 날아온 쪽 바닥을 클릭 (보이지 않는 상대는 겨눌 수 없음 · 쏘면 드러남)">🎯 견제사격 <kbd>J</kbd></button><button class="btn" type="button" data-ord="watch" title="그 자리에서 바깥을 나눠 보고 섬 · 자주 뒤를 돌아봄">👁 사주경계 <kbd>O</kbd></button>""")
rep("""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn')){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥   // v7.5 정찰: 살펴볼 바닥   // v7.6 암살: 노릴 적""","""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp')){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥   // v7.5 정찰: 살펴볼 바닥   // v7.6 암살: 노릴 적   // v7.7 견제사격: 바닥""")
rep("""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn')){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥""","""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp')){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥""")
open(p,'w').write(s)
print('ok')
