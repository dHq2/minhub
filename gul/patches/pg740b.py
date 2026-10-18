p='page10.tpl.html'; s=open(p).read()
def rep(a,b,n=1):
    global s; c=s.count(a); assert c==n,(c,a[:80]); s=s.replace(a,b)
# 지휘관 깃발 · 지휘 거리
rep("""  // 효과
  if (!ed) for (const f of Wd.fx){""","""  // v7.4 지휘관 깃발 (아군 금색 · 적 붉은색 — 보일 때만, 임시 지휘관은 빈 깃발) · 아군을 고르면 지휘가 닿는 거리 (외침 · 손짓)
  if (!ed) for (const side of [0, 1]){ const C = cmdBoss(Wd, side); if (!C || (side === 1 && !C.seenBy && !see) || hid0(C)) continue;
    const fx0 = ox + C.x * ts, fy0 = oy + C.y * ts - C.r * ts - 6, col = side ? '#ff7a6a' : '#ffd56a';
    ctx.save(); ctx.strokeStyle = 'rgba(10,8,6,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(fx0, fy0); ctx.lineTo(fx0, fy0 - 18); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(fx0, fy0); ctx.lineTo(fx0, fy0 - 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx0, fy0 - 18); ctx.lineTo(fx0 + 12, fy0 - 14); ctx.lineTo(fx0, fy0 - 10); ctx.closePath(); if (C.cmdTmp){ ctx.lineWidth = 1.4; ctx.stroke(); } else { ctx.fillStyle = col; ctx.fill(); }
    if (side === 0 && sel.size && mode !== 'edit'){ const R = cmdRange(Wd, C), hr = Math.min(hearR(Wd, C, null), R); ctx.setLineDash([6, 5]); ctx.strokeStyle = 'rgba(255,213,106,.45)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(fx0, oy + C.y * ts, hr * ts, 0, 6.283); ctx.stroke();
      ctx.setLineDash([2, 6]); ctx.strokeStyle = 'rgba(255,213,106,.28)'; ctx.beginPath(); ctx.arc(fx0, oy + C.y * ts, R * 1.2 * ts, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,225,150,.8)'; ctx.fillText(`외침 ${hr.toFixed(1)}칸 · 손짓 ${(R * 1.2).toFixed(0)}칸`, fx0, oy + C.y * ts - hr * ts - 4); }
    ctx.restore(); }
  // 효과
  if (!ed) for (const f of Wd.fx){""")
# 탭 판정: 위치 모르는 아군은 마지막 자리
rep("""function unitNear(Wd, x, y){ const ts = TS * cam.z; let best = null, bd = 1e9; for (const u of Wd.units){ if (!u.alive) continue; if (u.side === 1 && !u.seenBy && !$('seeAll').checked) continue; const d = Math.hypot(u.x - x, u.y - y);""","""function unitNear(Wd, x, y){ const ts = TS * cam.z; let best = null, bd = 1e9; for (const u of Wd.units){ if (!u.alive) continue; if (u.side === 1 && !u.seenBy && !$('seeAll').checked) continue; const q = u.side === 0 && u.posUnk && u.posK && !$('seeAll').checked && mode !== 'edit' ? u.posK : u, d = Math.hypot(q.x - x, q.y - y);""")
rep("""  for (const u of Wd.units){ if (!u.alive) continue; if (!any && u.side === 1 && !u.seenBy && !$('seeAll').checked) continue; const d = Math.hypot(u.x - x, u.y - y); if (d < u.r + 0.35 && d < bd){ bd = d; best = u; } }""","""  for (const u of Wd.units){ if (!u.alive) continue; if (!any && u.side === 1 && !u.seenBy && !$('seeAll').checked) continue; const q = u.side === 0 && u.posUnk && u.posK && !$('seeAll').checked && mode !== 'edit' ? u.posK : u, d = Math.hypot(q.x - x, q.y - y); if (d < u.r + 0.35 && d < bd){ bd = d; best = u; } }   // v7.4""")
# 전열 후퇴는 엔진이 신호를 나눔
rep("""    const M = r.ids.map(i => Wd.units[i]); sel = new Set(M.map(x => x.i)); noteOrders(M, 'user', r.back ? '전열 후퇴' : '전열 이동');""","""    const M = r.ids.map(i => Wd.units[i]); sel = new Set(M.map(x => x.i)); noteOrders(M, 'user', r.back ? '전열 후퇴' : '전열 이동', true);   // v7.4 신호 · 늦음은 엔진이 (lretStart)""")
rep("""    const r = lretStart(Wd, u0, w.x, w.y, 'user', ''); if (!r){ toast('그쪽으로는 전열째 갈 자리가 없어요 (바위 · 판 끝 · 너무 가까움)'); return; }""","""    const r = lretStart(Wd, u0, w.x, w.y, 'user', ''); if (!r){ toast(!cmdBoss(Wd, 0) ? '지휘할 사람이 없어요 — 전열 후퇴 신호를 낼 수 없음' : '그쪽으로는 전열째 갈 자리가 없거나, 신호가 닿은 마디가 둘이 안 돼요'); return done(); }""")
# 로그
rep("""      case 'tend': out.push(""","""      case 'cmdRecv': out.push(`${T(e)}📣 ${n(e.a)} 명령 받음 (${{ voice: '외침', sign: '손짓 · 깃발', relay: '동료를 거쳐', self: '지휘관' }[e.via] || e.via}${e.sec ? ' · ' + e.sec + '초 걸림' : ''}${e.p != null && e.p < 1 ? ' · 확률 ' + Math.round(e.p * 100) + '%' : ''}): ${e.o && e.o[0] === 'lret' ? '전열 후퇴' : orderLabel(Wd, e.o)}`); break;   // v7.4 지휘 전달
      case 'cmdMiss': out.push(e.side ? `${T(e)}◆ 적 ${n(e.a)} — 지휘를 못 들음 (${e.why || '닿지 않음'} · 확률 ${Math.round((e.p || 0) * 100)}%) — 하던 대로` : `${T(e)}📣✕ ${n(e.a)} — 명령이 닿지 않음 (${e.why || '닿지 않음'} · 확률 ${Math.round((e.p || 0) * 100)}%) → 하던 대로 · 못 받은 명령: ${e.o && e.o[0] === 'lret' ? '전열 후퇴' : orderLabel(Wd, e.o)}`); break;
      case 'posLost': out.push(`${T(e)}👁 ${n(e.a)} — 지휘관${e.c != null ? ' (' + n(e.c) + ')' : ''}이 보지도 듣지도 못함: 위치 모름 (마지막으로 안 자리만)`); break;
      case 'posBack': out.push(`${T(e)}👁 ${n(e.a)} — 다시 보임 · 들림 (위치를 앎)`); break;
      case 'assist': out.push(`${T(e)}⚙ 보조: 멈춤 ${e.p ? '켬' : '끔'} · 슬로우 ${e.s ? '켬' : '끔'}`); break;
      case 'tend': out.push(""")
rep("""        (e.ctx || []).forEach((c, k) => out.push(`${' '.repeat(10)}└ ${n(e.a[k])}: ${c}`)); break; }""","""        (e.ctx || []).forEach((c, k) => { const l = (e.lk || [])[k]; out.push(`${' '.repeat(10)}└ ${n(e.a[k])}: ${c}${l && l[1] !== 'self' ? ` · 📣 전달 ${Math.round(l[0] * 100)}% (${{ voice: '외침', sign: '손짓', relay: '동료를 거쳐', none: '닿지 않음' }[l[1]] || l[1]}${l[2] ? ' · ' + l[2] + '초' : ''}${l[3] ? ' · ' + l[3] : ''})` : ''}`); }); break; }   // v7.4""")
rep("""    case 'tend': return e.why ?""","""    case 'cmdMiss': return e.side ? (e.vis ? { c: 'good', s: `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 지휘를 놓친다.` } : null) : { c: 'bad', s: `${ga(n(e.a))} 명령을 받지 못한다 — ${e.why && /소음/.test(e.why) ? '외침이 소음에 묻혔다' : e.why && /안 보임|어둠/.test(e.why) ? '지휘관이 보이지 않는다' : '닿지 않았다'}. 하던 대로 싸운다.` };   // v7.4
    case 'posLost': return { c: 'dim', s: `${n(e.a)}의 모습도 소리도 끊겼다 — 어디 있는지 모른다.` };
    case 'tend': return e.why ?""")
# 로그 머리
rep("""  return `굴의 전투판 v7.3.0 · ${title}""","""  return `굴의 전투판 v7.4.0 · ${title} · 보조: ${assistMode()}`""" if False else """  return `굴의 전투판 v7.3.0 · ${title}""")
open(p,'w').write(s)
print('ok')
