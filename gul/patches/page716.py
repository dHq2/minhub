# v7.16.0 페이지 — page716.py v1.1 (v1.1: v7.15 돌진 명령 줄의 // 주석이 알림 · 화면 갱신을 삼키던 것 고침 · 견제사격 · 지역사격 나눔 · 베테랑 또는 사격 A 이상 · 친칠라 공격 25 · 하얀 나무 관통력 70)
import json
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.15.1 (2026-10-17)', '<!-- 굴의 전투판 v7.16.0 (2026-10-17)')
rep('     v7.15.1: ', '''     v7.16.0: 견제사격 · 지역사격을 나눔 — 견제사격 (J) = 그 자리 쪽으로 곧게 (직사 · 탄이 모임 · 방패 · 몸에 막히고 엎드린 몸 위로 넘어감) ·
         지역사격 (P) = 바닥을 찍은 자리에 곡사로 떨굼 (활만 — 방패 너머 · 엎드린 몸을 노림 · 흩어짐 · 바위 너머 (굴 천장) 는 못 넘김). 총은 지역사격 = 견제사격 (곧게).
         적도 같은 규칙 — 적 궁수는 숨은 사수의 안 자리 · 사선에 동료나 방패가 있으면 지역사격, 아니면 견제사격. 적 총수도 숨은 사수의 안 자리에 견제사격.
         견제 · 지역사격은 베테랑 또는 [사격A] 이상 (친칠라도). 친칠라: 하얀 나무 관통력 55 → 70 (활과 같음 — 궁수와의 차이는 사격 S 솜씨 · 틈 노려 쏘기) · 공격 24 → 25 (궁수 30).
         2성 판금을 뚫는 비율 15% → 약 40% · 궁수와 1대1 (빛 9칸 40판) 약 45 : 55 — 궁수가 살짝 우세.
     v7.15.1: ''')
rep('h1::after{content:" v7.15.1"', 'h1::after{content:" v7.16.0"')
rep('<footer>굴의 전투판 v7.15.1', '<footer>굴의 전투판 v7.16.0')
rep('return `굴의 전투판 v7.15.1 · ${title}', 'return `굴의 전투판 v7.16.0 · ${title}')
rep("copyText('굴의 전투판 v7.15.1 자동 판 기록", "copyText('굴의 전투판 v7.16.0 자동 판 기록")
rep('의 버전 기록에 — v7.15.1 카리우스 체력 700', '의 버전 기록에 — v7.16.0 견제사격 · 지역사격 · 친칠라 관통력 / v7.15.1 카리우스 체력 700')
rep('">v7.15.1 · 카리우스 체력 700 · 겹친 물건 줍기</span>', '">v7.16.0 · 견제사격 · 지역사격 · 친칠라 관통력</span>')
rep("RULES_MIG = '7.15.0'", "RULES_MIG = '7.16.0'")

# ---------- 친칠라 공격 25 ----------
rep("nv: true, nvG: 'S', ov: { hp: 100, atk: 24 }, traits: ['사격A', '은신S', '가호:바다', '축복:바다']", "nv: true, nvG: 'S', ov: { hp: 100, atk: 25 }, traits: ['사격A', '은신S', '가호:바다', '축복:바다']")
rep("// v7.15.1 카리우스 체력 450 → 700", """// v7.16 친칠라 공격 24 → 25 — 저장된 판 · 내 설계 · 층에도 한 번만 (옛 기본값 24 인 것만)
const fixChi716 = p => { if (!p || p.ref !== 'C-106' || !p.ov || +p.ov.atk !== 24) return false; p.ov.atk = 25; return true; };
if (!S.v716c){ for (const u of S.units) fixChi716(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixChi716(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixChi716(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v716c = true; }
// v7.15.1 카리우스 체력 450 → 700""")

# ---------- 견제사격 · 지역사격 명령 ----------
rep("  else if (k === 'supp'){ const ok = L.filter(u => isFar(u) && u.vet && !u.crawl && u.ammo !== 0); if (!ok.length){ toast('견제사격은 베테랑 사수만 (탄이 있어야) — 고른 아군 중 없어요'); return; } armed = armed && armed.k === 'supp' ? null : { k: 'supp', cas: ok.map(u => u.i) }; if (armed) toast(armedTxt() + ' — ' + ok.map(u => u.name).join(' · ') + (ok.length < L.length ? ' (나머지는 베테랑 사수가 아니라 빠짐)' : '')); }   // v7.7 견제사격",
    """  else if (k === 'supp' || k === 'area'){ const ok = L.filter(u => suppOK(u)); if (!ok.length){ toast('견제 · 지역사격은 베테랑 또는 사격 A 이상 사수만 (탄이 있어야) — 고른 아군 중 없어요'); return; } armed = armed && armed.k === k ? null : { k, cas: ok.map(u => u.i) }; if (armed) toast(armedTxt() + ' — ' + ok.map(u => u.name + (k === 'area' && !u.lob ? ' (총: 곧게)' : '')).join(' · ') + (ok.length < L.length ? ' (나머지는 빠짐)' : '')); }   // v7.7 견제사격   // v7.16 지역사격 (활은 곡사)""")
rep("  if (k === 'supp'){ const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done();   // v7.7 견제사격: 바닥 (또는 그 자리) 둘레에\n    L2.forEach(x => { x.order = { k: 'supp', x: w.x, y: w.y, n: (Wd.rules.supp || {}).n || 3 }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', '견제사격');\n    toast(`${L2.map(x => x.name).join(' · ')} 견제사격 → ${coord(w.x, w.y)} 둘레에 ${(Wd.rules.supp || {}).n || 3}발 — 쏘면 자리가 드러나요`); return done(); }",
    """  if (k === 'supp' || k === 'area'){ const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done();   // v7.7 견제사격: 바닥 (또는 그 자리) 둘레에   // v7.16 지역사격 = 활은 곡사
    const ar = k === 'area', nm = ar ? '지역사격' : '견제사격'; L2.forEach(x => { x.order = { k: 'supp', x: w.x, y: w.y, n: (Wd.rules.supp || {}).n || 3, arc: ar }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', nm);
    toast(`${L2.map(x => x.name).join(' · ')} ${nm} → ${coord(w.x, w.y)} 둘레에 ${(Wd.rules.supp || {}).n || 3}발${ar ? (L2.some(x => x.lob) ? ' — 활은 곡사로 떨굼' : ' — 총은 곧게 (견제사격과 같음)') : ' — 곧게'} · 쏘면 자리가 드러나요`); return done(); }""")
for a in ["armed.k === 'supp' || armed.k === 'flare'"]:
    rep(a, "armed.k === 'supp' || armed.k === 'area' || armed.k === 'flare'", 2)
rep("  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'flank', 'assn', 'supp', 'watch',", "  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'flank', 'assn', 'supp', 'area', 'watch',")
rep("u: 'assn', j: 'supp', o: 'watch',", "u: 'assn', j: 'supp', p: 'area', o: 'watch',")
rep("['J', '견제사격'],", "['J', '견제사격 (곧게)'], ['P', '지역사격 (활: 곡사로 바닥에 떨굼 · 총: 견제사격과 같음)'],")
rep("supp: '🎯 견제사격: 화살 · 총알이 날아온 쪽 (바닥) 을 탭 — 그 둘레에 3발'", "supp: '🎯 견제사격: 화살 · 총알이 날아온 쪽 (바닥) 을 탭 — 그 둘레에 곧게 3발', area: '🏹 지역사격: 바닥을 탭 — 활은 곡사로 그 둘레에 떨굼 (방패 너머 · 엎드린 몸) · 총은 견제사격과 같음'")
rep("      + (L.some(u => isFar(u) && u.vet && !u.crawl && u.ammo !== 0) ? `<button type=\"button\" class=\"db\" data-dk=\"supp\"><span class=\"ic\">🎯</span>견제</button>` : '')   // v7.7",
    "      + (L.some(u => suppOK(u)) ? `<button type=\"button\" class=\"db\" data-dk=\"supp\"><span class=\"ic\">🎯</span>견제</button>` : '') + (L.some(u => suppOK(u) && u.lob) ? `<button type=\"button\" class=\"db\" data-dk=\"area\"><span class=\"ic\">🏹</span>지역</button>` : '')   // v7.7   // v7.16 지역사격 (활)")
rep('<button class="btn" type="button" data-ord="supp" title="베테랑 사수만 — 누른 뒤 화살 · 총알이 날아온 쪽 바닥을 클릭 (보이지 않는 상대는 겨눌 수 없음 · 쏘면 드러남)">🎯 견제사격 <kbd>J</kbd></button>',
    '<button class="btn" type="button" data-ord="supp" title="베테랑 · 사격 A 이상 사수 — 누른 뒤 화살 · 총알이 날아온 쪽 바닥을 클릭 · 곧게 쏨 (보이지 않는 상대는 겨눌 수 없음 · 쏘면 드러남)">🎯 견제사격 <kbd>J</kbd></button><button class="btn" type="button" data-ord="area" title="활: 누른 뒤 바닥을 클릭 — 곡사로 그 둘레에 떨굼 (방패 너머 · 엎드린 몸 · 흩어짐) · 총: 견제사격과 같음">🏹 지역사격 <kbd>P</kbd></button>')
# 표시 · 기록
rep("ordOf = u => u.order && u.order.k === 'flank' ? ['flank', u.order.b] :", "ordOf = u => u.order && u.order.k === 'supp' && u.order.arc ? ['area', u.order.x, u.order.y] : u.order && u.order.k === 'flank' ? ['flank', u.order.b] :")
rep("  if (o[0] === 'supp') return `${ro(coord(o[1], o[2]))} 견제사격`;   // v7.7", "  if (o[0] === 'supp') return `${ro(coord(o[1], o[2]))} 견제사격`;   // v7.7\n  if (o[0] === 'area') return `${ro(coord(o[1], o[2]))} 지역사격`;   // v7.16")
rep("o.k === 'supp' ? ['🎯 견제', '#ffc860']", "o.k === 'supp' ? (o.arc ? ['🏹 지역', '#ffb070'] : ['🎯 견제', '#ffc860'])")
rep("const SU = Wd.rules.supp || {}, d = Math.hypot(o.x - u.x, o.y - u.y), rr = ((SU.spread || 0.45) + (SU.spreadD || 0.09) * d) * ts,",
    "const SU = Wd.rules.supp || {}, d = Math.hypot(o.x - u.x, o.y - u.y), rr = (u.lob && o.arc !== false ? (SU.arcSpread || 1) + (SU.arcSpreadD || 0.1) * d : (SU.spread || 0.45) + (SU.spreadD || 0.09) * d) * ts,   /* v7.16 지역사격 (곡사) 은 더 넓게 */")
rep("      case 'supp': out.push(`${T(e)}🎯 ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} 견제사격 → ", "      case 'supp': out.push(`${T(e)}${e.arc ? '🏹' : '🎯'} ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} ${e.arc || e.area ? '지역사격' : '견제사격'} → ")

rep("noteOrders(C);   // v7.15 우회 돌진 toast(", "noteOrders(C); /* v7.15 우회 돌진 */ toast(")   # v1.1
open(F, 'w', encoding='utf-8').write(s)
O = json.load(open(D + 'oldrules.json', encoding='utf-8'))
if not any(tuple(p) == ('weapons', '하얀 나무', 'P') for p, _ in O): O.append([["weapons", "하얀 나무", "P"], [55]])
if not any(tuple(p) == ('weapons', '하얀 나무', 'pen') for p, _ in O): O.append([["weapons", "하얀 나무", "pen"], [0.55]])
json.dump(O, open(D + 'oldrules.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('page716 OK')
