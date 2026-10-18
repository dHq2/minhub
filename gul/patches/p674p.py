def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
P = 'page10.tpl.html'
rep(P, "<!-- 굴의 전투판 v6.7.3 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v6.7.4 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v6.7.4: [도약] = 앞 · 뒤 · 옆 어디로든 단숨에 (1.7칸) 뛰는 이동 기술. 명령: 기술 칸 3 (숫자키 3) 을 누르고 바닥 (그 자리로 — 닿은 뒤 그 자리를 지킴) 이나 적 (그 적에게 뛰어들어 몸 바로 앞에 내림) 을 누름 · 대기 중이면 기다렸다 뜀.
             스스로: 근접 상대가 오면 뒤로 (사수) · 다쳐서 빠질 때 뒤로 · 나를 노린 돌진 예고선에서 옆으로 · 달아나는 사수 · 다른 이를 치려는 빈틈 · 넘어진 상대에게 앞으로 (근접, 내릴 자리 둘레에 다른 적이 둘 넘게 있으면 안 함) · 막고 선 방패 옆으로 돌아 들어감.
""")
rep(P, 'body.mob .top h1::after{content:" v6.7.3";', 'body.mob .top h1::after{content:" v6.7.4";')
rep(P, '<span class="ver">v6.7.3 · ', '<span class="ver">v6.7.4 · 도약 = 앞 · 뒤 · 옆 · v6.7.3 · ')
rep(P, '<footer>굴의 전투판 v6.7.3 —', '<footer>굴의 전투판 v6.7.4 —')
rep(P, "return `굴의 전투판 v6.7.3 · ${title}", "return `굴의 전투판 v6.7.4 · ${title}")
s = open(P).read(); i = s.index("  '도약': '뒤로 뛰어 단숨에 거리를 벌림"); j = s.index("\n", i)
s = s[:i] + "  '도약': '앞 · 뒤 · 옆 어디로든 단숨에 1.7칸 뛰는 이동 기술 (1.1초마다). 명령: 기술 칸 3 → 바닥을 누르면 그 자리로 (닿은 뒤 그 자리를 지킴) · 적을 누르면 그 적에게 뛰어들어 몸 바로 앞에 내림. 스스로: 근접 상대가 2칸 안으로 오면 뒤로 (사수) · 다쳐서 빠질 때 뒤로 · 나를 노린 돌진 예고선에서 옆으로 · 달아나는 사수 · 빈틈 · 넘어진 상대에게 앞으로 (근접) · 막고 선 방패 옆으로 돌아 들어감'," + s[j:]
open(P, 'w').write(s)
# pick state
rep(P, "chargePick = null, palmPick = null, amovePick = false;", "chargePick = null, palmPick = null, leapPick = null, amovePick = false;   // v6.7.4 leapPick = 도약할 곳 고르기")
rep(P, "  if (S2.k === 'leap'){ const cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); return '도약' + (cd > 0 ? ' (' + f2(cd) + '초)' : ''); }",
       "  if (S2.k === 'leap'){ const cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); return leapPick ? '뛸 곳 (바닥 · 적) 을 누르세요' : '도약' + (cd > 0 ? ' (' + f2(cd) + '초)' : ''); }")
rep(P, "  else if (S2.k === 'leap'){ st.cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); st.cdMax = (R.leap || {}).cd || 1.1; }",
       "  else if (S2.k === 'leap'){ st.cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t)); st.cdMax = (R.leap || {}).cd || 1.1; st.on = !!leapPick; st.ord = ordOf2('leap'); st.sb = st.on ? '바닥 · 적을 누름' : ''; }   // v6.7.4")
rep(P, "const SLOT_IC = { charge: '💨', throw: '🔱', leap: '↩',", "const SLOT_IC = { charge: '💨', throw: '🔱', leap: '⤴',")
rep(P, "  if (S2.k === 'leap'){ C.forEach(u => { u.order = { k: 'leap' }; }); noteOrders(C); toast('뒤로 도약'); hud(); return; }",
       "  if (S2.k === 'leap'){ leapPick = leapPick ? null : C.map(u => u.i); chargePick = throwPick = skillPick = palmPick = null; if (leapPick) toast(C.some(u => world.t < u.leapCd) ? `도약은 ${f2(Math.max(...C.map(u => u.leapCd - world.t)))}초 뒤 — 뛸 곳을 누르면 기다렸다 뜀` : '뛸 곳을 누르세요 — 바닥 (그 자리로 · 앞 · 뒤 · 옆 어디든) · 적 (그 적에게 뛰어듦) · Esc 취소'); hud(); return; }   // v6.7.4")
rep(P, "// v6.7 팜 버스트 대상: 고른 아군 (palmPick)",
"""// v6.7.4 도약: 고른 아군 (leapPick) 이 그 적에게 뛰어들거나 (giveLeap) 찍은 바닥으로 뜀 (giveLeapPt) — 앞 · 뒤 · 옆 어디든 1.7칸까지
function giveLeap(t){
  const C = (leapPick || []).map(i => world.units[i]).filter(u => u && u.alive && u.canLeap && !u.crawl); leapPick = null;
  if (!C.length){ hud(); return; }
  if (!t.seenBy){ toast('안 보이는 적에게는 뛰어들 수 없어요'); hud(); return; }
  C.forEach(u => { u.order = { k: 'leap', b: t.i }; }); noteOrders(C); toast(`${C.map(u => u.name).join(' · ')} → ${t.name}에게 도약!`); hud();
}
function giveLeapPt(x, y){
  const C = (leapPick || []).map(i => world.units[i]).filter(u => u && u.alive && u.canLeap && !u.crawl); leapPick = null;
  if (!C.length){ hud(); return; }
  if (rock(world.map, x, y)){ toast('바위로는 뛸 수 없어요'); hud(); return; }
  C.forEach((u, k) => { const a = k * 2.4, rr = k ? 0.7 : 0; u.order = { k: 'leap', x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr }; }); noteOrders(C); toast(`${C.map(u => u.name).join(' · ')} → ${coord(x, y)} 쪽으로 도약 (1.7칸까지)`); hud();
}
// v6.7 팜 버스트 대상: 고른 아군 (palmPick)""")
rep(P, "    : o.k === 'leap' ? ['↩ 도약', '#8ccaff'] :", "    : o.k === 'leap' ? [o.b != null ? '⤴ ' + tn : o.x != null ? '⤴ 도약 (자리)' : '↩ 도약', '#8ccaff'] :")
rep(P, "(n === 4 && skillPick) || (n === 5 && palmPick);", "(n === 4 && skillPick) || (n === 5 && palmPick) || (n === 3 && leapPick);")
rep(P, "    else if (Lp.length){ Lp.forEach(u => { u.order = { k: 'leap' }; }); noteOrders(Lp); toast('뒤로 도약'); }", "    else if (Lp.length){ leapPick = leapPick ? null : Lp.map(u => u.i); if (leapPick) toast('뛸 곳을 누르세요 — 바닥 · 적 (Esc 취소)'); }   // v6.7.4")
rep(P, "const armedNow = () => !!(armed || chargePick || throwPick || skillPick || palmPick);", "const armedNow = () => !!(armed || chargePick || throwPick || skillPick || palmPick || leapPick);")
rep(P, "skillPick ? 'skill' : palmPick ? 'palm' : null; if (!k) return '';", "skillPick ? 'skill' : palmPick ? 'palm' : leapPick ? 'leap' : null; if (!k) return '';")
rep(P, "palm: '💥 팜 버스트: 적을 탭',", "palm: '💥 팜 버스트: 적을 탭', leap: '⤴ 도약: 뛸 바닥이나 뛰어들 적을 탭',")
rep(P, "  closeRing(); chargePick = throwPick = skillPick = palmPick = null; armed = null;", "  closeRing(); chargePick = throwPick = skillPick = palmPick = leapPick = null; armed = null;")
rep(P, "function clearSel(){ const had = sel.size || armedNow() || amovePick || !!focus; chargePick = throwPick = skillPick = palmPick = null;", "function clearSel(){ const had = sel.size || armedNow() || amovePick || !!focus; chargePick = throwPick = skillPick = palmPick = leapPick = null;")
rep(P, "function cancelArmed(why){ chargePick = throwPick = skillPick = palmPick = null;", "function cancelArmed(why){ chargePick = throwPick = skillPick = palmPick = leapPick = null;")
rep(P, "k = armed ? armed.k : chargePick ? 'charge' : throwPick ? 'throw' : palmPick ? 'palm' : 'skill';", "k = armed ? armed.k : chargePick ? 'charge' : throwPick ? 'throw' : palmPick ? 'palm' : leapPick ? 'leap' : 'skill';")
rep(P, "  if (k === 'palm'){ if (u && u.side === 1){ givePalm(u); return done(); }", "  if (k === 'leap'){ if (u && u.side === 1) giveLeap(u); else giveLeapPt(w.x, w.y); return done(); }   // v6.7.4\n  if (k === 'palm'){ if (u && u.side === 1){ givePalm(u); return done(); }")
rep(P, "  if (k === 'pickx'){ skillPick = null; throwPick = null; chargePick = null; palmPick = null;", "  if (k === 'pickx'){ skillPick = null; throwPick = null; chargePick = null; palmPick = null; leapPick = null;")
rep(P, "if (palmPick){ palmPick = null; hud(); return; } sel = new Set(); hud(); }", "if (palmPick){ palmPick = null; hud(); return; } if (leapPick){ leapPick = null; hud(); return; } sel = new Set(); hud(); }")
rep(P, "  if (u && u.side === 0 && skillPick){ giveSkill(u); return; }\n", "  if (u && u.side === 0 && skillPick){ giveSkill(u); return; }\n  if (leapPick){ if (u && u.side === 1) giveLeap(u); else giveLeapPt(w.x, w.y); return; }   // v6.7.4 도약: 적 = 뛰어듦 · 그 밖 (바닥 · 아군 자리) = 그쪽으로\n")
rep(P, "  skillPick = null; throwPick = null; chargePick = null; palmPick = null;\n", "  skillPick = null; throwPick = null; chargePick = null; palmPick = null; leapPick = null;\n")
# labels / logs / narration
rep(P, "  if (o[0] === 'palm') return `${Wd.units[o[1]].name}에게 팜 버스트`;   // v6.7", "  if (o[0] === 'palm') return `${Wd.units[o[1]].name}에게 팜 버스트`;   // v6.7\n  if (o[0] === 'leap') return `${Wd.units[o[1]].name}에게 도약`;   // v6.7.4\n  if (o[0] === 'leapPt') return `${ro(coord(o[1], o[2]))} 도약`;\n  if (o[0] === 'leap0') return '뒤로 도약';")
rep(P, "  if (a.k === 'leap') return '뒤로 도약';", "  if (a.k === 'leap') return { fwd: '앞으로 도약', side: '옆으로 도약', pt: '도약' }[a.dir] || '뒤로 도약';   // v6.7.4")
rep(P, "left: Math.max(0, u.act.end - Wd.t), why: u.act.why || '' } : null;", "left: Math.max(0, u.act.end - Wd.t), why: u.act.why || '', dir: u.act.dir || '' } : null;")
rep(P, "      case 'leap': out.push(`${T(e)}${n(e.a)} 뒤로 도약 (${n(e.b)}에게서)`); break;",
       "      case 'leap': out.push(`${T(e)}${n(e.a)} ${{ fwd: '앞으로 도약', side: '옆으로 도약', pt: '도약' }[e.dir] || '뒤로 도약'}${e.b != null ? (e.dir === 'fwd' ? ' → ' + n(e.b) : ' (' + n(e.b) + '에게서)') : ''}${e.x != null ? ' · ' + coord(e.x, e.y) + (e.len ? ' (' + e.len + '칸)' : '') : ''}${e.why && e.why !== '명령' ? ' · ' + e.why : e.why === '명령' ? ' · 명령' : ''}`); break;   // v6.7.4")
rep(P, "    case 'leap': return e.vis || U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 뒤로 훌쩍 뛰어 거리를 벌린다.` } : null;",
       "    case 'leap': if (!(e.vis || U(e.a).side === 0)) return null; return e.dir === 'fwd' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 훌쩍 뛰어 ${e.b != null ? n(e.b) + '에게' : '앞으로'} 달려든다!` } : e.dir === 'side' ? { c: 'dim', s: `${ga(n(e.a))} 옆으로 훌쩍 뛴다${e.why === '돌진 길에서 옆으로' ? ' — 돌진 길에서 벗어난다' : e.why === '방패 옆으로 돌아 들어감' ? ' — 방패 옆으로 돌아 들어간다' : ''}.` } : e.dir === 'pt' ? { c: 'dim', s: `${ga(n(e.a))} 훌쩍 뛰어 자리를 옮긴다.` } : { c: 'dim', s: `${ga(n(e.a))} 뒤로 훌쩍 뛰어 거리를 벌린다.` };   // v6.7.4")
print('page ok')
