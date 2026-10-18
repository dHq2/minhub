def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
P = 'page10.tpl.html'
# ---- 5th slot: palm
rep(P, "skillPick = null, throwPick = null, chargePick = null, amovePick = false;   // v5.4.2", "skillPick = null, throwPick = null, chargePick = null, palmPick = null, amovePick = false;   // v6.7 palmPick = 팜 버스트 대상 고르기 · v5.4.2")
rep(P, "  { k: 'skill', name: '약', has: u => !!u.skill },\n];", "  { k: 'skill', name: '약', has: u => !!u.skill },\n  { k: 'palm', name: '팜 버스트', has: u => !!u.palm && !u.noArms },   // v6.7 청광묵\n];")
rep(P, "  if (S2.k === 'leap'){ const cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); return '도약' + (cd > 0 ? ' (' + f2(cd) + '초)' : ''); }\n",
       "  if (S2.k === 'leap'){ const cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); return '도약' + (cd > 0 ? ' (' + f2(cd) + '초)' : ''); }\n  if (S2.k === 'palm'){ const cd = Math.max(0, ...C.map(u => u.palmCd - Wd.t)), po = C.find(u => u.order && u.order.k === 'palm'); return palmPick ? '손바닥을 댈 적을 누르세요' : '팜 버스트' + (po ? ' ▶ ' + Wd.units[po.order.b].name : '') + (cd > 0 ? ' (' + f2(cd) + '초)' : ''); }   // v6.7\n")
rep(P, "const SLOT_IC = { charge: '💨', throw: '🔱', leap: '↩', skill: '✚' };", "const SLOT_IC = { charge: '💨', throw: '🔱', leap: '↩', skill: '✚', palm: '💥' };")
rep(P, "  else if (S2.k === 'leap'){ st.cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); st.cdMax = (R.leap || {}).cd || 1.1; }\n",
       "  else if (S2.k === 'leap'){ st.cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); st.cdMax = (R.leap || {}).cd || 1.1; }\n  else if (S2.k === 'palm'){ st.cd = Math.max(0, ...C.map(u => u.palmCd - Wd.t)); st.cdMax = (R.palm || {}).cd || 5; st.on = !!palmPick; st.ord = ordOf2('palm'); st.sb = st.on ? '적을 누름' : ''; }   // v6.7\n")
rep(P, "  else if (S2.k === 'throw'){ st.on = !!throwPick; st.ord = ordOf2('throw'); const held = C.some(u => u.spearHeld); st.sb = st.on ? '적을 누름' : held ? '' : '창 없음 · E 줍기'; if (!held) st.cd = 1, st.cdMax = 1; }",
       "  else if (S2.k === 'throw'){ const kn = C.every(u => isKnife(Wd, u)); if (kn){ st.ic = '🗡'; st.nm = '투척'; } st.on = !!throwPick; st.ord = ordOf2('throw'); const held = C.some(u => u.spearHeld); st.sb = st.on ? '적을 누름' : held ? '' : (kn ? '단검 없음' : '창 없음') + ' · E 줍기'; if (!held) st.cd = 1, st.cdMax = 1; }   // v6.7 단검이면 투척")
rep(P, "`아군을 고르세요<small>숫자키 1 ~ 4 = 기술</small>`;\n  const html = `<div class=\"who\">${who}</div>` + [1, 2, 3, 4].map(n =>",
       "`아군을 고르세요<small>숫자키 1 ~ ${SLOTS.length} = 기술</small>`;\n  const html = `<div class=\"who\">${who}</div>` + SLOTS.map((_, i) => i + 1).map(n =>")
rep(P, "  if (S2.k === 'leap'){ C.forEach(u => { u.order = { k: 'leap' }; }); noteOrders(C); toast('뒤로 도약'); hud(); return; }\n  ordKey('skill');\n}",
"""  if (S2.k === 'leap'){ C.forEach(u => { u.order = { k: 'leap' }; }); noteOrders(C); toast('뒤로 도약'); hud(); return; }
  if (S2.k === 'palm'){ palmPick = palmPick ? null : C.map(u => u.i); chargePick = throwPick = skillPick = null; if (palmPick) toast(C.some(u => world.t < u.palmCd) ? `팜 버스트는 ${f2(Math.max(...C.map(u => u.palmCd - world.t)))}초 뒤 — 붙어 싸우며 기다려요 · 손바닥을 댈 적을 누르세요` : '손바닥을 댈 적을 누르세요 (Esc 취소)'); hud(); return; }   // v6.7
  ordKey('skill');
}
// v6.7 팜 버스트 대상: 고른 아군 (palmPick) 에게 '그 적에게 붙어 손바닥을 대' 명령
function givePalm(t){
  if (!palmPick || !world) return false;
  if (!t.seenBy){ toast('안 보이는 적에게는 못 써요'); return true; }
  const C = palmPick.map(i => world.units[i]).filter(u => u.alive && u.palm && !u.noArms);
  for (const u of C) u.order = { k: 'palm', b: t.i };
  noteOrders(C); palmPick = null; toast(`${t.name}에게 팜 버스트`); hud(); return true;
}""")
rep(P, "const C = throwPick.map(i => world.units[i]).filter(u => u.alive && u.jav && u.spearHeld);\n  for (const u of C) u.order = { k: 'throw', b: t.i };\n  noteOrders(C); throwPick = null; toast(`${t.name}에게 창을 던지라고 했어요`);",
       "const C = throwPick.map(i => world.units[i]).filter(u => u.alive && u.jav && u.spearHeld);\n  for (const u of C) u.order = { k: 'throw', b: t.i };\n  noteOrders(C); throwPick = null; toast(`${t.name}에게 ${C.every(u => isKnife(world, u)) ? '단검을' : '창을'} 던지라고 했어요`);")
rep(P, "o.k === 'throw' ? ['🔱 ' + tn, '#c9a8ff'] :", "o.k === 'throw' ? ['🔱 ' + tn, '#c9a8ff'] : o.k === 'palm' ? ['💥 ' + tn, '#ffa860'] :")
rep(P, "${[1, 2, 3, 4].map(n => { const lb = slotLabel(Wd, L, n), on = (n === 1 && chargePick) || (n === 2 && throwPick) || (n === 4 && skillPick);",
       "${SLOTS.map((_, i) => i + 1).map(n => { const lb = slotLabel(Wd, L, n), on = (n === 1 && chargePick) || (n === 2 && throwPick) || (n === 4 && skillPick) || (n === 5 && palmPick);")
rep(P, "const armedNow = () => !!(armed || chargePick || throwPick || skillPick);", "const armedNow = () => !!(armed || chargePick || throwPick || skillPick || palmPick);")
rep(P, "function armedTxt(){ const k = armed ? armed.k : chargePick ? 'charge' : throwPick ? 'throw' : skillPick ? 'skill' : null; if (!k) return '';",
       "function armedTxt(){ const k = armed ? armed.k : chargePick ? 'charge' : throwPick ? 'throw' : skillPick ? 'skill' : palmPick ? 'palm' : null; if (!k) return '';")
rep(P, "throw: '🔱 투창: 적을 탭', skill: '✚ 약: 아군을 탭',", "throw: '🔱 투창 · 투척: 적을 탭', skill: '✚ 약: 아군을 탭', palm: '💥 팜 버스트: 적을 탭',")
rep(P, "  const lp = slotState(Wd, C, 3); if (!lp.off) out.push({ k: 'leap', ic: '↩', nm: '도약', cd: lp.cd });\n",
       "  const lp = slotState(Wd, C, 3); if (!lp.off) out.push({ k: 'leap', ic: '↩', nm: '도약', cd: lp.cd });\n  const pm = slotState(Wd, C, 5); if (!pm.off) out.push({ k: 'palm', ic: '💥', nm: '팜 버스트', cd: pm.cd });   // v6.7\n")
rep(P, "  if (C.some(u => u.jav && u.spearHeld)) out.push({ k: 'throw', ic: '🔱', nm: '투창' });\n  else if (C.some(u => u.jav && !u.spearHeld && mySpear(Wd, u))) out.push({ k: 'pickSpear', ic: '🔱', nm: '창 줍기' });",
       "  if (C.some(u => u.jav && u.spearHeld)) out.push(C.every(u => !u.jav || isKnife(Wd, u)) ? { k: 'throw', ic: '🗡', nm: '투척' } : { k: 'throw', ic: '🔱', nm: '투창' });\n  else if (C.some(u => u.jav && !u.spearHeld && mySpear(Wd, u))) out.push({ k: 'pickSpear', ic: '🔱', nm: C.every(u => !u.jav || isKnife(Wd, u)) ? '단검 줍기' : '창 줍기' });")
rep(P, "  closeRing(); chargePick = throwPick = skillPick = null; armed = null;", "  closeRing(); chargePick = throwPick = skillPick = palmPick = null; armed = null;")
rep(P, "  else if (k === 'skill') skillPick = C.filter(u => u.skill && u.skill.left > 0).map(u => u.i);\n",
       "  else if (k === 'skill') skillPick = C.filter(u => u.skill && u.skill.left > 0).map(u => u.i);\n  else if (k === 'palm') palmPick = C.filter(u => u.palm && !u.noArms).map(u => u.i);   // v6.7\n")
rep(P, "function clearSel(){ const had = sel.size || armedNow() || amovePick || !!focus; chargePick = throwPick = skillPick = null;", "function clearSel(){ const had = sel.size || armedNow() || amovePick || !!focus; chargePick = throwPick = skillPick = palmPick = null;")
rep(P, "function cancelArmed(why){ chargePick = throwPick = skillPick = null;", "function cancelArmed(why){ chargePick = throwPick = skillPick = palmPick = null;")
rep(P, "k = armed ? armed.k : chargePick ? 'charge' : throwPick ? 'throw' : 'skill';", "k = armed ? armed.k : chargePick ? 'charge' : throwPick ? 'throw' : palmPick ? 'palm' : 'skill';")
rep(P, "  if (k === 'throw'){ if (u && u.side === 1){ giveThrow(u); return done(); } toast('투창: 적을 탭 · 아래로 쓸면 취소'); return; }\n",
       "  if (k === 'throw'){ if (u && u.side === 1){ giveThrow(u); return done(); } toast('투창: 적을 탭 · 아래로 쓸면 취소'); return; }\n  if (k === 'palm'){ if (u && u.side === 1){ givePalm(u); return done(); } toast('팜 버스트: 적을 탭 · 아래로 쓸면 취소'); return; }   // v6.7\n")
rep(P, "const any = [1, 2, 3, 4].some(n => !slotState(world, [u], n).off);", "const any = SLOTS.map((_, i) => i + 1).some(n => !slotState(world, [u], n).off);")
rep(P, "  const st = [1, 2, 3, 4].map(n => slotState(world, [u], n)).filter(x => !x.off);", "  const st = SLOTS.map((_, i) => i + 1).map(n => slotState(world, [u], n)).filter(x => !x.off);")
rep(P, "  if (k === 'pickx'){ skillPick = null; throwPick = null; chargePick = null;", "  if (k === 'pickx'){ skillPick = null; throwPick = null; chargePick = null; palmPick = null;")
rep(P, "    const sk = [1, 2, 3, 4].map(n => { const s2 = slotState(Wd, L, n);", "    const sk = SLOTS.map((_, i) => i + 1).map(n => { const s2 = slotState(Wd, L, n);")
rep(P, "  if (/^[1-4]$/.test(e.code ? e.code.replace('Digit', '') : k)", "  if (/^[1-5]$/.test(e.code ? e.code.replace('Digit', '') : k)")
rep(P, "if (throwPick){ throwPick = null; hud(); return; } if (skillPick){ skillPick = null; hud(); return; } sel = new Set(); hud(); }",
       "if (throwPick){ throwPick = null; hud(); return; } if (skillPick){ skillPick = null; hud(); return; } if (palmPick){ palmPick = null; hud(); return; } sel = new Set(); hud(); }")
rep(P, "  if (u && u.side === 1 && throwPick){ giveThrow(u); return; }\n", "  if (u && u.side === 1 && throwPick){ giveThrow(u); return; }\n  if (u && u.side === 1 && palmPick){ givePalm(u); return; }   // v6.7\n")
rep(P, "  if (throwPick){ throwPick = null; toast('투창을 취소했어요'); hud(); return; }\n", "  if (throwPick){ throwPick = null; toast('투창을 취소했어요'); hud(); return; }\n  if (palmPick){ palmPick = null; toast('팜 버스트를 취소했어요'); hud(); return; }\n")
rep(P, "  skillPick = null; throwPick = null; chargePick = null;\n", "  skillPick = null; throwPick = null; chargePick = null; palmPick = null;\n")
# orderLabel / actLabel
rep(P, "  if (o[0] === 'throw') return `${Wd.units[o[1]].name}에게 투창`;\n", "  if (o[0] === 'throw') return `${Wd.units[o[1]].name}에게 ${isKnife(Wd, Wd.units[o[1]]) ? '투창' : '투창'}`;\n  if (o[0] === 'palm') return `${Wd.units[o[1]].name}에게 팜 버스트`;   // v6.7\n")
rep(P, "  if (a.k === 'dodge') return '몸을 빼 피함';\n", "  if (a.k === 'dodge') return '몸을 빼 피함';\n  if (a.k === 'palm') return a.ph === 'wind' ? `팜 버스트 → ${b ? b.name : ''} (${f2(a.left)}초 뒤 터짐)` : `팜 버스트 뒤 (${f2(a.left)}초 남음)`;   // v6.7\n")
print('part2 ok')
