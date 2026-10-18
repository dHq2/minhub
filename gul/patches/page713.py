# v7.13.0 페이지 — page713.py v1
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
rep('<!-- 굴의 전투판 v7.12.0 (2026-10-17)', '<!-- 굴의 전투판 v7.13.0 (2026-10-17)')
rep('     v7.12.0: ', '''     v7.13.0: 지휘망 = 그물 — 받은 이가 곁의 못 받은 이에게 거듭 전함 (6단계까지 · 이중 · 삼중 길). 받을 확률 = 1 − (지휘관에게 직접 못 받음) × Π (곁의 동료가 전해 주지 못함) — 사람이 많을수록 잘 닿음.
         전달자의 지휘 점수마다 더 확실히 (+6%) · 더 빨리 (−12%) · 더 멀리 (지휘 거리). 적도 같은 그물 (견제사격 · 암살조 · 돌격 명령도). 판의 📡 지휘망에 곁의 동료끼리 닿는 줄을 흐리게 그림.
         편대: 시작 배치에서 정함 (인물을 고르면 '편대' 줄) — 본대 (인주 · 레베카 · 카리우스) · 2편대 (노먼 · 청광묵, 편대장 노먼). 2편대장은 누구든 정할 수 있음 — 지휘 스킬이 없으면 지휘 D.
         청광묵을 기본 배치에 넣음. 편대장 자율 지시: 아는 적마다 '지금 치면 이득일 확률' (편대 화력으로 몇 초에 쓰러뜨리나 · 사수 · 다침 · 나를 노림 − 둘레의 적 · 거구 · 방패) 을 셈 →
         35% 넘는 가장 좋은 수를 명령 없는 편대원에게 지휘망으로 지시 (대장의 명령을 받은 이 · 교전 규칙이 막는 이는 건드리지 않음) · 편대장을 노리는 근접은 떼어 냄. 지휘 D = 지시 못 함 ·
         C = 3초마다 기본 셈만 (판단이 많이 흔들림) · B = 2초 · 본대에 붙들린 · 고립된 · 지휘하는 적까지 봄 · A · S 는 더 빠르고 덜 흔들림. 명령을 받은 편대장도 편대를 지휘함.
         우회 · 공격도 더블클릭 (빠르게) 이면 경유점까지 전속력. 서둘러 이동 (더블클릭) 은 엎드렸어도 일어나 뜀 · 빠르게 공격 (총) 은 엎드린 채 먼저 쏨.
         검토 반영: 밀치기 · 휘두르기를 피한 뒤 그 일격이 떨어지기 전엔 그 손 안으로 다시 걸어 들어가지 않음 (명령이어도 — 피하고도 맞던 것) · 교전 규칙이 막는 아군은 약속 (막아 주기 · 붙들기 · 몰기) 에 끌려가지 않음 ·
         넘어진 · 너무 가벼운 몸 (상대 무게 30% 아래 · 방패 없음) 은 모루로 치지 않음 · 엎드림을 '넘어짐 — 전열이 끊김' 대신 '엎드림' 으로 · 공격 명령이 끝났을 때 옛 자리가 4칸 넘게 멀면 지금 자리를 지킴 ·
         명령이 지금 닿지 않을 아군이 있으면 (0%) 줄 때 바로 알림.
     v7.12.0: ''')
rep('h1::after{content:" v7.12.0"', 'h1::after{content:" v7.13.0"')
rep('<footer>굴의 전투판 v7.12.0', '<footer>굴의 전투판 v7.13.0')
rep('return `굴의 전투판 v7.12.0 · ${title}', 'return `굴의 전투판 v7.13.0 · ${title}')
rep("copyText('굴의 전투판 v7.12.0 자동 판 기록", "copyText('굴의 전투판 v7.13.0 자동 판 기록")
rep('의 버전 기록에 — v7.12.0 포복 v2', '의 버전 기록에 — v7.13.0 지휘망 그물 · 편대장 자율 지시 · 편대 배치 / v7.12.0 포복 v2')
rep('">v7.12.0 · 스스로 엎드림 · 곡사 면 제압 · ↪ 우회</span>', '">v7.13.0 · 지휘망 그물 · 노먼 자율 지시 · 편대</span>')
rep("RULES_MIG = '7.12.0'", "RULES_MIG = '7.13.0'")

# ---------- 편대: 설계 · 기본 배치 ----------
rep("'cry', 'mute', 'rank'];", "'cry', 'mute', 'rank', 'sq'];")
rep("weapon: '소총', bold: 0.5, rank: '부대장',", "weapon: '소총', bold: 0.5, rank: '부대장', sq: 'B',")
rep("{ key: '청광묵', side: 0, ref: 'C-004', name: '청광묵', tier: 2, cls: '기동',", "{ key: '청광묵', side: 0, ref: 'C-004', name: '청광묵', tier: 2, sq: 'B', cls: '기동',")
rep("  put('인주', 'q3'); put('노먼', 'p3'); put('레베카', 'q4'); put('카리우스', 'r4');", "  put('인주', 'q3'); put('노먼', 'p3'); put('레베카', 'q4'); put('카리우스', 'r4'); put('청광묵', 'o3');   // v7.13 2편대 (노먼 · 청광묵)")
rep("  put: [['인주', 'q4'], ['노먼', 'r4'], ['카리우스', 'q5'], ['레베카', 'r5'],", "  put: [['인주', 'q4'], ['노먼', 'r4'], ['청광묵', 's4'], ['카리우스', 'q5'], ['레베카', 'r5'],")
# 고른 아군의 편대 줄
rep("    <div class=\"row\"><label class=\"ck\" for=\"selNv\">",
    """    ${p.side === 0 && !p.hero ? (() => { const sq = p.sq === 'B' ? 'B' : 'A', ld = S.units.find(x => x.side === 0 && x.rank === '부대장'), hn = (S.units.find(x => x.side === 0 && x.hero) || {}).name || '주인공', cg = (p.traits || []).map(t => (t.match(/^지휘([SABC])$/) || [])[1]).find(Boolean) || 'D';   // v7.13 편대
      return `<div class="row"><span class="brush">편대</span><span class="seg"><button type="button" class="${sq === 'A' ? 'on' : ''}" data-psq="A">본대 (${esc(hn)})</button><button type="button" class="${sq === 'B' ? 'on' : ''}" data-psq="B">2편대${ld ? ' (' + esc(ld.name) + ')' : ''}</button></span>${sq === 'B' ? `<label class="ck" for="selSqLead"><input id="selSqLead" type="checkbox" ${p.rank === '부대장' ? 'checked' : ''}> 2편대장 — 지휘 ${cg}${cg === 'D' ? ' (지휘 스킬이 없어 스스로 지시 못 함)' : cg === 'C' ? ' (기본 지시만 · 제대로 지휘하려면 B 이상)' : ''}</label>` : ''}</div>`; })() : p.side === 0 && p.hero ? '<div class="row"><span class="brush">편대</span> 본대장 (지휘관)</div>' : ''}
    <div class="row"><label class="ck" for="selNv">""")
rep("  const s = e.target.closest('[data-pside]'); if (s){ p.side = +s.dataset.pside; if (p.side === 1) p.hero = false; changed(); return; }",
    "  const s = e.target.closest('[data-pside]'); if (s){ p.side = +s.dataset.pside; if (p.side === 1) p.hero = false; changed(); return; }\n  const q = e.target.closest('[data-psq]'); if (q){ p.sq = q.dataset.psq; if (p.sq === 'A' && p.rank === '부대장') p.rank = ''; if (p.sq === 'B' && !S.units.some(x => x.side === 0 && x.rank === '부대장')) p.rank = '부대장'; changed(); return; }   // v7.13 편대")
rep("  if (e.target.id === 'selTier'){ p.tier = +e.target.value; changed(); return; }",
    "  if (e.target.id === 'selTier'){ p.tier = +e.target.value; changed(); return; }\n  if (e.target.id === 'selSqLead'){ if (e.target.checked){ for (const x of S.units) if (x.side === 0 && x.rank === '부대장') x.rank = ''; p.rank = '부대장'; p.sq = 'B'; } else p.rank = ''; changed(); return; }   // v7.13 2편대장 (하나)")

# ---------- 판: 그물 ----------
rep("  if (!ed && $('netShow').checked && Wd.t > 0.01){   // v7.9.5 지휘망: 지휘관 → 각 아군 (확률 색 · 길 모양 · 가는 중인 명령)",
    """  if (!ed && $('netShow').checked && Wd.t > 0.01 && Wd.mesh0){   // v7.13 지휘망 그물: 곁의 동료끼리 닿는 줄 (흐리게)
    ctx.save(); ctx.setLineDash([]); ctx.lineWidth = Math.max(1, ts * 0.03);
    for (const [a, b, p] of Wd.mesh0.edges){ const A = Wd.units[a], B = Wd.units[b]; if (!A || !B || !A.alive || !B.alive || hidA(Wd, A) || hidA(Wd, B)) continue; ctx.strokeStyle = `rgba(150,200,255,${(0.1 + 0.22 * p).toFixed(2)})`; ctx.beginPath(); ctx.moveTo(ox + A.x * ts, oy + A.y * ts); ctx.lineTo(ox + B.x * ts, oy + B.y * ts); ctx.stroke(); }
    ctx.restore(); }
  if (!ed && $('netShow').checked && Wd.t > 0.01){   // v7.9.5 지휘망: 지휘관 → 각 아군 (확률 색 · 길 모양 · 가는 중인 명령)""")

# ---------- 더블클릭 우회 = 전속력 ----------
rep("  lastRC = { t: now, key, x: w.x, y: w.y };\n  groupMove(L, w.x, w.y, 'move', hurry, !!sh || detourArm);",
    "  const det = !!sh || detourArm || (hurry && !!(lastRC && lastRC.det));   // v7.13 두 번째 클릭도 같은 우회 (전속력)\n  lastRC = { t: now, key, x: w.x, y: w.y, det };\n  groupMove(L, w.x, w.y, 'move', hurry, det);")
rep("const now0 = performance.now(), key = L.map(u => u.i).join(',') + '>' + t.i, rush = !!(lastAC && now0 - lastAC.t < 700 && lastAC.key === key); lastAC = { t: now0, key };",
    "const now0 = performance.now(), key = L.map(u => u.i).join(',') + '>' + t.i, rush = !!(lastAC && now0 - lastAC.t < 700 && lastAC.key === key); if (rush && lastAC.det) det = true; lastAC = { t: now0, key, det: !!det };   // v7.13 우회 공격도 더블클릭 = 전속력")
rep("  for (const u of M){ let ox = u.x - cx, oy = u.y - cy; const d = Math.hypot(ox, oy); if (d > 1.2){ ox *= 1.2 / d; oy *= 1.2 / d; } let x = v.x + ox, y = v.y + oy; if (rock(MAP, x, y)){ x = v.x; y = v.y; } u.order.via = { x: +x.toFixed(2), y: +y.toFixed(2) }; }",
    "  const fast = M.some(u => u.order.hurry || u.order.now);   // v7.13 더블클릭이면 경유점까지 전속력 (사수도)\n  for (const u of M){ let ox = u.x - cx, oy = u.y - cy; const d = Math.hypot(ox, oy); if (d > 1.2){ ox *= 1.2 / d; oy *= 1.2 / d; } let x = v.x + ox, y = v.y + oy; if (rock(MAP, x, y)){ x = v.x; y = v.y; } u.order.via = { x: +x.toFixed(2), y: +y.toFixed(2) }; if (fast) u.order.hurry = true; }")
rep("· 거치기 전엔 싸우지 않음`);\n}", "· 거치기 전엔 싸우지 않음${fast ? ' · 전속력' : ''}`);\n}")

# ---------- 0% 명령 알림 ----------
rep("  if (list.length) logCmd(W, list, {", "  { const z = list.filter((u, k) => lks[k].via !== 'self' && lks[k].p < 0.05); if (z.length && !raw && !pre) toast(`📣✕ ${z.map(u => u.name).join(' · ')}: 지금은 명령이 닿지 않아요 (${(lks[list.indexOf(z[0])].why || '지휘관과 끊김').split(' · ')[0]}) — 다가가거나 손짓이 보이는 곳에서 다시`); }   // v7.13\n  if (list.length) logCmd(W, list, {")

# ---------- 로그 ----------
rep(": ${e.o && e.o[0] === 'lret' ? '전열 후퇴' : orderLabel(Wd, e.o)}`); break;   // v7.4 지휘 전달",
    ": ${e.o && e.o[0] === 'lret' ? '전열 후퇴' : orderLabel(Wd, e.o)}${e.dep ? ' — ' + n(e.c) + '의 지시 (편대장)' : ''}`); break;   // v7.4 지휘 전달   // v7.13 편대장의 지시")
rep("      case 'lieMode': out.push(", """      case 'sqDec': out.push(`${T(e)}🧭 ${n(e.a)} (편대장 · 지휘 ${'DCBAS'[e.g]}) — ${e.dk === 'peel' ? '나를 노리는 ' + n(e.b) + '을 떼어 내라' : n(e.b) + '을 치라'} · 이득 확률 ${Math.round(e.p * 100)}%${e.why ? ' (' + e.why + (e.tK ? ' · 약 ' + e.tK + '초' : '') + ')' : ''} → ${e.to.length ? e.to.map(n).join(' · ') : '받을 편대원 없음 (모두 명령 중)'}${e.alt && e.alt.length ? ' | 다음 수: ' + e.alt.map(([k, b, p]) => (k === 'hold' ? '하던 대로' : n(b)) + ' ' + Math.round(p * 100) + '%').join(' · ') : ''}`); break;   // v7.13
      case 'sqWeak': out.push(`${T(e)}🧭 ${n(e.a)} — 편대장이지만 지휘 D (스킬 없음): 편대를 스스로 지휘하지 못함`); break;
      case 'lieMode': out.push(""")
rep("    case 'lieDown': return U(e.a).side === 0 ?", "    case 'sqDec': return U(e.a).side === 0 ? { c: 'good', s: e.dk === 'peel' ? `${ga(n(e.a))} 외친다 — \"${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 떼어 내!\"` : `${ga(n(e.a))} 편대에 손짓한다 — ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 먼저.` } : null;   // v7.13\n    case 'sqWeak': return null;\n    case 'lieDown': return U(e.a).side === 0 ?")
open(F, 'w', encoding='utf-8').write(s)

O = json.load(open(D + 'oldrules.json', encoding='utf-8'))
if not any(tuple(p) == ('cmdLinkW', 'hops') for p, _ in O): O.append([["cmdLinkW", "hops"], [3]])
json.dump(O, open(D + 'oldrules.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('page713 OK')
