def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:80], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
P = 'page10.tpl.html'
# 도우미: 이 판에서 주워 든 것
rep(P, "const shTxt = u => u.armShield ? '팔 방패' : u.shield ? '방패' : '방패 없음';   // v5.9.8 팔 방패 (카리우스)\n",
       "const shTxt = u => u.armShield ? '팔 방패' : u.shield ? '방패' : '방패 없음';   // v5.9.8 팔 방패 (카리우스)\n// v5.9.9 이 판에서 주워 든 것 (처음 든 것과 다른 무기 · 방패). 판에서만 쓰고, 다음 판은 늘 설계대로 시작\nconst pickedOf = u => { const k = u && u.kit0; if (!k) return null; const w0 = k.weapon || '맨손', w = u.weaponGone ? null : (u.weapon || '맨손'), r = [];\n  if (w && w !== w0 && !ITEM_NATURAL.includes(w)) r.push(w); if (u.shield && !u.armShield && !k.shield) r.push('방패'); return r.length ? { items: r, w0 } : null; };\nconst pickedTxt = u => { const pk = pickedOf(u); return pk ? `${pk.items.join(' + ')} (원래 ${pk.w0}${u.kit0.arm ? ' + 팔 방패' : u.kit0.shield ? ' + 방패' : ''})` : ''; };\n")
# 상세 칸: 주운 것 줄
rep(P, "    ${u.gear && Object.keys(u.gear).length && known ? `<span class=\"tr\"><span class=\"lb\">방어구</span>",
       "    ${!ed && pickedOf(u) && known ? `<span class=\"tr\" style=\"color:#ffd27a\"><span class=\"lb\">주운 것</span> ✋ ${esc(pickedTxt(u))} — 이 판에서만 · 다음 판엔 설계대로</span>` : ''}\n    ${u.gear && Object.keys(u.gear).length && known ? `<span class=\"tr\"><span class=\"lb\">방어구</span>")
# 판: 무기 글씨 · 작은 ✋ 표
rep(P, "if (k >= 1 && u.weapon){ const t = `${u.weaponNow || u.weapon} ${u.rng}칸", "if (k >= 1 && u.weapon){ const t = `${pickedOf(u) ? '✋ ' : ''}${u.weaponNow || u.weapon} ${u.rng}칸")
rep(P, "  for (const u of Wd.units){ if (!u.alive || u.side !== 0 || !u.canGuard || !u.guardMode || u.guardMode === 'auto') continue;\n",
       "  for (const u of Wd.units){ if (!u.alive || !(u.side === 0 || see || u.seenBy) || !pickedOf(u)) continue;   // v5.9.9 주워 든 것이 있으면 왼쪽 위에 ✋\n    const x = ox + (u.x - u.r * 0.85) * ts, y = oy + (u.y - u.r * 0.85) * ts; ctx.fillStyle = 'rgba(90,70,20,.92)'; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.fill();\n    ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('✋', x, y + 0.5); }\n  for (const u of Wd.units){ if (!u.alive || u.side !== 0 || !u.canGuard || !u.guardMode || u.guardMode === 'auto') continue;\n")
# 로그 줄: 줍기
rep(P, "case 'pickItem': out.push(`${T(e)}${n(e.a)} ${e.name} ${e.own ? '다시 ' : ''}주움${e.from != null && !e.own && Wd.units[e.from] ? ' (' + ga(n(e.from)) + ' 떨어뜨린 것)' : ''}${e.item === 'shield' ? ' — 방패가 없던 손에 듦 (방어 자세 · 밀치기 · 방패 돌진)' : ''} · ${coord(e.x, e.y)}`); break;",
       "case 'pickItem': { const pu = Wd.units[e.a], w0 = (pu.kit0 && pu.kit0.weapon) || '맨손', fw = e.item === 'weapon' && isRangedW((Wd.rules.weapons || {})[e.name] || {}) && !isRangedW((Wd.rules.weapons || {})[w0] || {});\n        out.push(`${T(e)}✋ ${n(e.a)} ${e.name} ${e.own ? '다시 ' : ''}주움${e.from != null && !e.own && Wd.units[e.from] ? ' (' + ga(n(e.from)) + ' 떨어뜨린 것)' : ''}${e.item === 'shield' ? ' — 방패가 없던 손에 듦 (방어 자세 · 밀치기 · 방패 돌진)' : e.item === 'weapon' && e.name !== w0 ? ' — ' + w0 + ' → ' + e.name + (fw ? ' (이제 멀리서 쏨)' : '') : ''}${e.own ? '' : ' · 이 판에서만 (다음 판엔 설계대로)'} · ${coord(e.x, e.y)}`); break; }   // v5.9.9")
# 판 결과: 주운 장비 요약
rep(P, "${u.ff ? ' · 아군 오사 ' + u.ff : ''}`).join('\\n');", "${u.ff ? ' · 아군 오사 ' + u.ff : ''}${pickedOf(u) ? ' · ✋ 주운 것 ' + pickedTxt(u) : ''}`).join('\\n') + (Wd.units.some(pickedOf) ? '\\n  ✋ 주운 장비는 이 판에서만 — 다음 판은 설계대로 시작' : '');")
# 판이 끝날 때 알림
rep(P, "<span>${world.turn}턴 · ${f2(world.t)}초 · 살아남은 아군 ${alive} · 처치 ${world.kills[0]}</span>", "<span>${world.turn}턴 · ${f2(world.t)}초 · 살아남은 아군 ${alive} · 처치 ${world.kills[0]}</span>${world.units.some(u => u.side === 0 && pickedOf(u)) ? `<span>✋ 주운 장비 (${world.units.filter(u => u.side === 0 && pickedOf(u)).map(u => u.name + ' ' + pickedOf(u).items.join(' + ')).join(' · ')}) 는 이 판에서만 — 다음 판은 설계대로</span>` : ''}")
# 버전
rep(P, "     v5.9.9: (고침) 처음부터 맨손인 카리우스가 무기를 잃은 것으로 여겨져 떨어진 활 · 창 · 인주의 어부의 창을 스스로 주워 들던 것 — 스스로 줍는 건 무기를 던졌거나 떨어뜨린 쪽만. 줍기 명령은 그대로 됨.\n",
       "     v5.9.9: 주운 장비 표시 — 판 위 ✋ 표 · 무기 글씨 앞 ✋, 상세 칸 \"주운 것\" (원래 든 것), 로그 줄 \"✋ … 주움 — 원래 → 이제 · 이 판에서만\", 판 결과 · 끝 알림에 주운 장비 요약.\n             줍기는 그대로 (무기가 없으면 — 처음부터 맨손인 카리우스도 — 안전할 때 5칸 안 무기를 스스로 주움). 주운 장비는 그 판에서만, 다음 판은 늘 설계대로 시작.\n")
rep(P, '<span class="ver">v5.9.9 · 카리우스가 스스로 무기를 줍지 않음 · v5.9.8 · ', '<span class="ver">v5.9.9 · 주운 장비 표시 (✋ · 이 판에서만) · v5.9.8 · ')
print('ok')
