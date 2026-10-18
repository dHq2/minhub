def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
P = 'page10.tpl.html'
rep(P, "  if (o[0] === 'throw') return `${Wd.units[o[1]].name}에게 ${isKnife(Wd, Wd.units[o[1]]) ? '투창' : '투창'}`;\n", "  if (o[0] === 'throw') return `${Wd.units[o[1]].name}에게 투창`;\n")
# ---- log text
rep(P, "      case 'dodge': out.push(`${T(e)}${n(e.a)} 피함 (${n(e.b)}의 ${e.mate ? '휘두르기 — 동료' : '공격'}${e.wall ? ' · 벽을 등지고도' : ''})`); break;\n",
"""      case 'dodge': out.push(`${T(e)}${n(e.a)} 피함 (${n(e.b)}의 ${e.mate ? '휘두르기 — 동료' : '공격'}${e.wall ? ' · 벽을 등지고도' : ''})`); break;
      case 'evade': out.push(`${T(e)}💨 회피! ${n(e.b)} — ${e.why}${e.a != null ? ' (' + n(e.a) + '의 ' + ({ melee: '일격', charge: '돌진', shot: '탄', arc: '곡사' }[e.how] || '공격') + ')' : ''} · 회피 확률 ${Math.round(e.p * 100)}%`); break;   // v6.7
      case 'burn': out.push(`${T(e)}🔥 ${n(e.b)} 화상 — 초당 ${e.dps} · ${(Wd.rules.burn || {}).t || 3}초 (${n(e.a)}의 손바닥 · [발화])`); break;
      case 'burnStop': out.push(`${T(e)}${n(e.a)} 화상이 가라앉음`); break;
      case 'palm': out.push(`${T(e)}💥 ${n(e.a)} → ${n(e.b)} 팜 버스트 — ${e.block ? '막는 쪽에 대고 터뜨림 (자세를 크게 깎음)' : e.skin ? '맨살에 닿음 (큰 피해 · 화상 두 겹)' : '갑옷 위로 충격 (갑옷이 막는 몫 절반 무시 · 화상 한 겹)'}`); break;
""")
rep(P, "      case 'throw': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창! (명중률 ${Math.round(e.p * 100)}%) → 맨손`); break;",
       "      case 'throw': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.kn ? '단검 투척' : '투창'}!${e.arc ? ' 높이 던져 ' + (e.over != null && e.over !== e.b ? n(e.over) + ' 너머로' : '방패 너머로') + ' (곡사)' : ''} (명중률 ${Math.round(e.p * 100)}%) → 맨손${e.kn && Wd.units[e.a].fire ? ' (손바닥이 닿으면 화상)' : ''}`); break;   // v6.7 곡사 · 단검")
rep(P, "      case 'wind': if (e.jav){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창 조준", "      case 'wind': if (e.palm){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 팜 버스트 준비 — 손바닥을 댐 (${f2(e.end)}초에 터짐)${e.why && e.why !== '팜 버스트' ? ' · ' + e.why : ''}`); break; }   // v6.7\n        if (e.jav){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.kn ? '투척' : '투창'} 조준")
rep(P, "        if (e.jav) tags.push('투창 ×' + R.javelin.mul);\n        if (e.arc) tags.push('곡사 ×' + ((R.arc || {}).mul || 0.85));   // v5.8.4\n        if (e.crit) tags.push('치명 ×' + R.javelin.critMul);",
       "        if (e.jav) tags.push(e.kn ? '투척 ×' + ((R.knife || {}).mul || 0.8) : '투창 ×' + R.javelin.mul);\n        if (e.arc) tags.push('곡사 ×' + (e.jav ? ((R.javelin.arc || {}).mul || 0.95) : ((R.arc || {}).mul || 0.85)));   // v5.8.4 · v6.7 곡사 투창\n        if (e.crit && e.jav) tags.push('치명 ×' + (e.kn ? ((R.knife || {}).critMul || 1.5) : R.javelin.critMul));")
rep(P, "겨 나감', bowl: '부딪혀 밀려남' }[e.how] || '밀침'}", "겨 나감', bowl: '부딪혀 밀려남', '팜 버스트': '팜 버스트로 날려 보냄' }[e.how] || '밀침'}")
# ---- narration
rep(P, "    case 'throw': return e.vis ? { c: U(e.a).side === 0 ? 'good' : 'bad', s: `${ga(n(e.a))} ${n(e.b)}에게 창을 던진다!` } : { c: 'bad', s: '어둠 속에서 무언가 날아온다!' };",
       "    case 'throw': return e.vis ? { c: U(e.a).side === 0 ? 'good' : 'bad', s: e.kn ? `${ga(n(e.a))} ${n(e.b)}에게 단검을 던진다!` : e.arc ? `${ga(n(e.a))} 창을 높이 던진다 — ${e.over != null && e.over !== e.b ? n(e.over) + ' 너머의 ' : '방패 너머 '}${n(e.b)}에게 떨어진다!` : `${ga(n(e.a))} ${n(e.b)}에게 창을 던진다!` } : { c: 'bad', s: '어둠 속에서 무언가 날아온다!' };   // v6.7")
rep(P, "    case 'dodge': { const k = 'd' + e.a;",
"""    case 'evade': { const b = U(e.b), k = 'v' + e.b; if (!(e.vis || b.side === 0)) return null; if (narr.seenEv && Wd.t - (narr.seenEv[k] || -99) < 1.5) return null; (narr.seenEv = narr.seenEv || {})[k] = Wd.t;   // v6.7 회피
      return { c: b.side === 0 ? 'good' : 'bad', s: `${ga(b.name)} ${e.how === 'melee' ? (e.a != null ? U(e.a).name + '의 일격을 ' : '') + '몸을 비틀어 흘린다' : e.how === 'charge' ? (e.a != null ? U(e.a).name + '의 돌진을 ' : '') + '옆으로 흘려 보낸다' : e.why} — 회피!` }; }
    case 'burn': return e.vis ? { c: U(e.b).side ? 'good' : 'bad', s: `${n(e.b)}의 살이 ${n(e.a)}의 손바닥에 그을린다 — 화상!` } : null;
    case 'burnStop': return null;
    case 'palm': return e.vis ? { c: U(e.a).side ? 'bad' : 'good', s: e.block ? `${ga(n(e.a))} ${n(e.b)}의 방어에 손바닥을 대고 터뜨린다 — 쾅! 자세가 크게 흔들린다.` : e.skin ? `${ga(n(e.a))} ${n(e.b)}의 맨살에 손바닥을 대고 터뜨린다 — 살이 타들어 간다!` : `${ga(n(e.a))} ${n(e.b)}의 갑옷에 손바닥을 대고 터뜨린다 — 충격이 갑옷 속으로 번진다!` } : null;
    case 'dodge': { const k = 'd' + e.a;""")
rep(P, "      if (e.ffRisk && a.side === 0) return { c: 'bad', s: `${ga(a.name)} 명령대로 동료 너머 ${reul(b.name)} ${e.jav ? '겨눠 창을 든다' : '겨눈다'}",
       "      if (e.palm) return e.hid ? null : { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} ${b.name}에게 바싹 붙어 손바닥을 내민다 — 손바닥이 달아오른다!` };   // v6.7 팜 버스트\n      if (e.ffRisk && a.side === 0) return { c: 'bad', s: `${ga(a.name)} 명령대로 동료 너머 ${reul(b.name)} ${e.jav ? '겨눠 창을 든다' : '겨눈다'}")
rep(P, "      if (e.jav && !e.block) return { c: b.side === 0 ? 'bad' : 'good', s: `창이 ${b.name}에게 꽂힌다${e.crit ? ' — 치명!' : ''}${v}.${wd}` };",
       "      if (e.jav && !e.block) return { c: b.side === 0 ? 'bad' : 'good', s: `${e.kn ? '단검이' : e.arc ? '떨어진 창이' : '창이'} ${b.name}에게 꽂힌다${e.crit ? ' — 치명!' : ''}${v}.${wd}` };   // v6.7")
rep(P, "      if (e.arc && e.block) return { c: b.side === 0 ? 'good' : '', s: `${ga(b.name)} ${e.gn === '팔' ? '팔을' : '방패를'} 머리 위로 들어 떨어지는 화살을 막는다 (−${e.dmg}).` };",
       "      if (e.arc && e.block) return { c: b.side === 0 ? 'good' : '', s: `${ga(b.name)} ${e.gn === '팔' ? '팔을' : '방패를'} 머리 위로 들어 떨어지는 ${e.jav ? '창을' : '화살을'} 막는다 (−${e.dmg}).` };")
rep(P, "      if (e.arc && !e.vital && !e.ff) return { c: b.side === 0 ? 'bad' : 'good', s: `하늘에서 떨어진 ${a.name}의 화살이",
       "      if (e.tag && /^팜 버스트|^맨살에 팜 버스트/.test(e.tag)) return null;   // v6.7 팜 버스트는 'palm' 줄에서\n      if (e.tag === '화상') return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 화상을 견디지 못하고 쓰러진다.` };\n      if (e.arc && !e.vital && !e.ff && !e.jav) return { c: b.side === 0 ? 'bad' : 'good', s: `하늘에서 떨어진 ${a.name}의 화살이")
rep(P, "      if ((e.how === 'sweep' || e.how === 'charge' || e.how === 'clash') && e.len >= 1) return { s: `${ga(n(e.b))} ${e.len}칸을 날아간다!` };",
       "      if ((e.how === 'sweep' || e.how === 'charge' || e.how === 'clash') && e.len >= 1) return { s: `${ga(n(e.b))} ${e.len}칸을 날아간다!` };\n      if (e.how === '팜 버스트' && e.len >= 0.5) return { s: `폭발에 ${ga(n(e.b))} ${e.len}칸 밀려난다!` };   // v6.7")
# ---- hit log: kn flag needs engine; fx colour; board flame; gearTxt; detail rows
rep(P, "f.c === 'b' ? '#dcd6ff' : '#f2e9da';", "f.c === 'b' ? '#dcd6ff' : f.c === 'v' ? '#8ff0ff' : '#f2e9da';   // v6.7 회피! (하늘색)")
rep(P, "    // v5.5 부위: 실명은 얼굴에 검은 띠,", "    if (!ed && vis && u.alive && u.burn && now < u.burn.until){ const fs = Math.max(11, Math.min(16, r * 0.5)); ctx.save(); ctx.globalAlpha = 0.7 + 0.3 * Math.sin(now * 9); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🔥', px + r * 0.62, py + r * 0.55); ctx.restore(); }   // v6.7 화상 (초상화 오른쪽 아래)\n    // v5.5 부위: 실명은 얼굴에 검은 띠,")
rep(P, "  return `${u.exhausted ? ' · 🥵 탈진' : u.tired ? ' · 😓 지침 ' + Math.round(u.fat) : ''}", "  return `${u.burn && Wd.t < u.burn.until ? ' · 🔥 화상' : ''}${u.exhausted ? ' · 🥵 탈진' : u.tired ? ' · 😓 지침 ' + Math.round(u.fat) : ''}")
rep(P, "    <span class=\"tr\"><span class=\"lb\">몸</span> 키 ${u.h}m · 무게 ${u.mass}kg",
"""    ${!ed && u.alive && known && Wd.rules.evade ? (() => { const cd = u.evadeCd; u.evadeCd = -9; const pm = evadeP(Wd, u, null, 'melee'), pa = evadeP(Wd, u, null, 'shot', { sp: ((Wd.rules.weapons || {})['활'] || {}).vel || 32 }), pj = evadeP(Wd, u, null, 'shot', { sp: (Wd.rules.javelin || {}).vel || 18 }), pg = evadeP(Wd, u, null, 'shot', { sp: ((Wd.rules.weapons || {})['총'] || {}).vel || 85 }); u.evadeCd = cd; return `<span class="tr"><span class="lb">회피</span> 지금 근접 ${Math.round(pm * 100)}% · 화살 ${Math.round(pa * 100)}% · 투창 ${Math.round(pj * 100)}% · 총알 ${Math.round(pg * 100)}%${(u.evN || 0) ? ` · 이 판에서 ${u.evN}번 피함` : ''}${Wd.t < (cd || -9) ? ` · 다음 회피까지 ${f2(cd - Wd.t)}초` : ''} — 민첩 (속력 ÷ 3)^1.3 × 몸집 (무게 ${u.mass}kg)${(u.ev || 1) > 1 ? ' × [회피] ' + u.ev : ''} × 지침 · 숨 (알아차린 상대만 · 자기도 공격 준비 중이면 절반)</span>`; })() : ''}   <!-- v6.7 -->
    ${!ed && u.alive && u.burn && Wd.t < u.burn.until ? `<span class="tr" style="color:#ff9a86"><span class="lb">화상</span> 🔥 초당 ${u.burn.dps.toFixed(1)} · ${f2(u.burn.until - Wd.t)}초 남음 (${esc(Wd.units[u.burn.by] ? Wd.units[u.burn.by].name : '')})</span>` : ''}
    <span class="tr"><span class="lb">몸</span> 키 ${u.h}m · 무게 ${u.mass}kg""")
print('part3 ok')
