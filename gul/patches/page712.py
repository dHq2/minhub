# v7.12.0 페이지 — page712.py v1
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
rep('<!-- 굴의 전투판 v7.11.0 (2026-10-17)', '<!-- 굴의 전투판 v7.12.0 (2026-10-17)')
rep('     v7.11.0: ', '''     v7.12.0: 1칸 = 1M 로 정함. 포복 v2 — 일어남은 순식간 (0.2초 · 기동 0.15초) · 카리우스 ([개조된 신체]) 는 몸 구조상 못 엎드림 · 적도 엎드림 (자세는 화면에 안 보임).
         스스로 엎드림 (아군 · 적 같음, 카리우스 빼고): 곁 5칸 안에 동료가 없는데 3초 안에 두 발 넘게 날아와 스치거나 맞고 · 쏜 자를 못 보면 (어디선가) 일단 엎드림 — 총을 든 몸은 보이는 사수에게도 엎드려 맞쏨.
         사격이 6초 멎으면 일어남 · 근접이 4칸 안이면 안 엎드림 · 명령으로 일어나면 8초 · 치려고 일어나면 4초 동안은 다시 안 엎드림. 이동 · 공격 이동 명령 중에는 안 엎드림.
         곡사 면 제압 (활): 견제사격을 활로 하면 높이 쏘아 자리 둘레에 떨굼 — 든 방패는 머리 위를 못 막음 (방패벽 무시) · 바위 너머 (굴 천장) 는 못 넘김 · 떨어질 둘레의 아군만 피함 · 화살 낭비를 감수.
         적 지휘관은 날아온 쪽 말고도, 숨은 아군 사수 (8초 안에 쏨) 를 지금 아무도 못 보는데 4초 안에 정확히 안 자리 (총구 화염 · 놓치기 전) 에 궁수의 곡사 면 제압을 시킴. 엎드린 몸은 위에서 넓어 떨어지는 화살에 더 걸림 (×1.3).
         청광묵 (기동 근접): 공격 명령이면 돌격을 아끼지 않고 씀 (빈틈 · 대치를 따지지 않음) · 팜 버스트하러 갈 때도 돌격이 있으면 씀. 측후방 도약: 나를 앞으로 보고 선 근접 상대의 옆 (110°) · 뒤 (150°) 로 뛰어 들어감 (3초마다, 내려앉을 자리에 다른 적의 손이 닿으면 안 함).
         모바일: 태세 · 정찰 방침 창의 빈 곳을 눌러도 고르기가 풀리지 않음.
         우회: Shift + 오른쪽 클릭 (이동) · Shift + 적 클릭 (공격) · Shift + A 클릭 (공격 이동) — 아는 적이 적은 쪽으로 크게 돌아가는 경유점을 거쳐 감 (모바일 · 명령 칸: ↪ 우회 켜고 이동 · 공격). 경유점까지는 싸우지 않음.
     v7.11.0: ''')
rep('h1::after{content:" v7.11.0"', 'h1::after{content:" v7.12.0"')
rep('<footer>굴의 전투판 v7.11.0', '<footer>굴의 전투판 v7.12.0')
rep('return `굴의 전투판 v7.11.0 · ${title}', 'return `굴의 전투판 v7.12.0 · ${title}')
rep("copyText('굴의 전투판 v7.11.0 자동 판 기록", "copyText('굴의 전투판 v7.12.0 자동 판 기록")
rep('의 버전 기록에 — v7.11.0 포복', '의 버전 기록에 — v7.12.0 포복 v2 · 스스로 엎드림 · 곡사 면 제압 · 측후방 도약 · 우회 / v7.11.0 포복')
rep('">v7.11.0 · 🦎 포복 (엎드림)</span>', '">v7.12.0 · 스스로 엎드림 · 곡사 면 제압 · ↪ 우회</span>')
rep("RULES_MIG = '7.11.0'", "RULES_MIG = '7.12.0'")

# ---------- 포복: 카리우스 · 적 자세 숨김 ----------
rep("  else if (k === 'lie'){ const ok = L.filter(u => u.alive && !u.down && !u.crawl); if (!ok.length){ toast('엎드릴 수 있는 아군이 없어요 (기어다니는 몸은 이미 바닥에)'); return; }",
    "  else if (k === 'lie'){ const ok = L.filter(u => u.alive && !u.down && !u.crawl && !u.modBody), mb = L.filter(u => u.modBody); if (!ok.length){ toast(mb.length ? `${mb.map(u => u.name).join(' · ')}${jong(mb[0].name) ? '은' : '는'} 몸 구조상 엎드릴 수 없어요` : '엎드릴 수 있는 아군이 없어요 (기어다니는 몸은 이미 바닥에)'); return; }   // v7.12 [개조된 신체]")
rep(" · 근접에 약함 · C 로 일어남` : `${nm} 일어남 (${LR.up}초", "${mb.length ? ' · ' + mb.map(u => u.name).join(' · ') + ' 은 몸 구조상 못 엎드림' : ''} · 근접에 약함 · C 로 일어남` : `${nm} 일어남 (${LR.up}초")
rep("      + (L.some(u => !u.crawl) ? `<button type=\"button\" class=\"db ${L.every(u => u.lie) ? 'on' : ''}\" data-dk=\"lie\">",
    "      + (L.some(u => !u.crawl && !u.modBody) ? `<button type=\"button\" class=\"db ${L.every(u => u.lie) ? 'on' : ''}\" data-dk=\"lie\">")
rep("    ${!ed && u.lie && u.alive ? (() => { const LR = Wd.rules.lie || {}", "    ${!ed && u.lie && u.alive && !u.side ? (() => { const LR = Wd.rules.lie || {}")

# ---------- 우회 ----------
rep("let lastRC = null;", "let lastRC = null, detourArm = false;   // v7.12 ↪ 우회 (모바일 · 명령 칸으로 켬 — PC 는 Shift)")
rep("function rightClick(w){", "function rightClick(w, sh){")
rep("  groupMove(L, w.x, w.y, 'move', hurry); if (hurry)", "  groupMove(L, w.x, w.y, 'move', hurry, !!sh || detourArm); if (hurry)")
rep("else if (d.right) rightClick(w); else playClick(w, e.shiftKey);", "else if (d.right) rightClick(w, e.shiftKey); else playClick(w, e.shiftKey);")
rep("function groupMove(L, wx, wy, kind, hurry){", "function groupMove(L, wx, wy, kind, hurry, det){")
rep("  if (L.length === 1){ L[0].order = { k: kind, x: tx, y: ty, ...(hurry ? { hurry: true } : {}) }; noteOrders(L); return; }",
    "  if (L.length === 1){ L[0].order = { k: kind, x: tx, y: ty, ...(hurry ? { hurry: true } : {}) }; if (det) applyDetour(L, tx, ty); noteOrders(L); return; }")
rep("    taken.add(gx + ',' + gy); u.order = { k: kind, x: gx + 0.5, y: gy + 0.5, ...(hurry ? { hurry: true } : {}) };\n  }\n  noteOrders(L);",
    "    taken.add(gx + ',' + gy); u.order = { k: kind, x: gx + 0.5, y: gy + 0.5, ...(hurry ? { hurry: true } : {}) };\n  }\n  if (det) applyDetour(L, tx, ty);\n  noteOrders(L);")
rep("function groupMove(L, wx, wy, kind, hurry, det){", """// v7.12 우회: 아는 적이 적은 쪽으로 크게 돌아가는 경유점 (무리는 같은 쪽 · 제 자리만큼 벌려) — 명령에 붙여 함께 전함
function applyDetour(L, tx, ty){
  detourArm = false; const M = L.filter(u => u.order && ['move', 'amove', 'attack'].includes(u.order.k)); if (!M.length) return;
  const v = detourVia(world, M, tx, ty);
  if (!v){ toast('↪ 우회할 만큼 멀지 않거나 돌아갈 길이 없어요 — 곧장 감'); return; }
  const cx = M.reduce((a, u) => a + u.x, 0) / M.length, cy = M.reduce((a, u) => a + u.y, 0) / M.length;
  for (const u of M){ let ox = u.x - cx, oy = u.y - cy; const d = Math.hypot(ox, oy); if (d > 1.2){ ox *= 1.2 / d; oy *= 1.2 / d; } let x = v.x + ox, y = v.y + oy; if (rock(MAP, x, y)){ x = v.x; y = v.y; } u.order.via = { x: +x.toFixed(2), y: +y.toFixed(2) }; }
  logEv(world, { k: 'detour', a: M.map(u => u.i), x: v.x, y: v.y, side: v.side, near: v.near, known: v.known, alt: v.alt, live: mode === 'run' && !paused });
  toast(`↪ 우회: ${v.side > 0 ? '오른쪽' : '왼쪽'}으로 크게 돌아감 (${coord(v.x, v.y)} 거쳐) — ${v.known ? (v.alt ? '적이 적은 쪽이 막혀 반대쪽' : '아는 적이 적은 쪽') : '아는 적이 없음'} · 거치기 전엔 싸우지 않음`);
}
function groupMove(L, wx, wy, kind, hurry, det){""")
rep("  if (u && u.side === 1){ giveAttack(u); return; }\n  // v5.4.2 빈 바닥 왼쪽 클릭", "  if (u && u.side === 1){ giveAttack(u, add || detourArm); return; }\n  // v5.4.2 빈 바닥 왼쪽 클릭")
rep("  if (amovePick){ amovePick = false; if (!L.length){ toast('먼저 명령할 아군을 고르세요'); hud(); return; } groupMove(L, w.x, w.y, 'amove'); hud(); return; }\n  if (L.length){ sel = new Set(); hud(); }",
    "  if (amovePick){ amovePick = false; if (!L.length){ toast('먼저 명령할 아군을 고르세요'); hud(); return; } groupMove(L, w.x, w.y, 'amove', false, add || detourArm); hud(); return; }\n  if (L.length){ sel = new Set(); hud(); }")
rep("  if (amovePick){ amovePick = false; if (!L.length){ toast('먼저 명령할 아군을 고르세요'); hud(); return; } groupMove(L, w.x, w.y, 'amove'); hud(); return; }\n  if (!L.length){ toast('아군을 먼저 고르세요",
    "  if (amovePick){ amovePick = false; if (!L.length){ toast('먼저 명령할 아군을 고르세요'); hud(); return; } groupMove(L, w.x, w.y, 'amove', false, detourArm); hud(); return; }\n  if (!L.length){ toast('아군을 먼저 고르세요")
rep("  if (u && u.side === 1){ giveAttack(u); return; }\n  rightClick(w);", "  if (u && u.side === 1){ giveAttack(u, detourArm); return; }\n  rightClick(w);")
rep("function giveAttack(t){", "function giveAttack(t, det){")
rep("  L.forEach(u => { u.order = { k: 'attack', b: t.i, ...(rush ? { now: true, ...(isFar(u) ? {} : { hurry: true }) } : {}) }; u.last = { x: t.x, y: t.y }; }); noteOrders(L); hud();",
    "  L.forEach(u => { u.order = { k: 'attack', b: t.i, ...(rush ? { now: true, ...(isFar(u) ? {} : { hurry: true }) } : {}) }; u.last = { x: t.x, y: t.y }; }); if (det) applyDetour(L, t.x, t.y); noteOrders(L); hud();")
rep("(u.order && u.order.now ? 'n' : '')", "(u.order && u.order.now ? 'n' : '') + (u.order && u.order.via ? 'd' : '')")
# 명령 칸 · 모바일 단추 · 키
rep("function ordKey(k){\n  const L = selUnits(world);\n", "function ordKey(k){\n  const L = selUnits(world);\n  if (k === 'detour'){ detourArm = !detourArm; toast(detourArm ? '↪ 우회 켬 — 다음 이동 · 공격 · 공격 이동은 아는 적이 적은 쪽으로 크게 돌아감 (PC 는 Shift 를 누른 채 클릭해도 됨)' : '↪ 우회를 껐어요'); hud(); return; }   // v7.12\n")
rep("""🦎 포복 <kbd>C</kbd></button>""", """🦎 포복 <kbd>C</kbd></button><button class="btn ${detourArm ? 'on' : ''}" type="button" data-ord="detour" title="다음 이동 · 공격을 아는 적이 적은 쪽으로 크게 돌아가게 — PC 는 Shift + 오른쪽 클릭 · Shift + 적 클릭">↪ 우회 <kbd>Shift</kbd></button>""")
rep('data-dk="amove"><span class="ic">⚔</span>공격 이동</button>', 'data-dk="amove"><span class="ic">⚔</span>공격 이동</button><button type="button" class="db ${detourArm ? \'on\' : \'\'}" data-dk="detour"><span class="ic">↪</span>우회<small>${detourArm ? \'다음 이동\' : \'끔\'}</small></button>')
rep("'flare', 'stealth', 'lie', 'guard', 'pick', 'swing', 'cancel', 'torch'].includes(k)){ ordKey(k); hud(); return; }",
    "'flare', 'stealth', 'lie', 'detour', 'guard', 'pick', 'swing', 'cancel', 'torch'].includes(k)){ ordKey(k); hud(); return; }")
rep("['C', '포복 (엎드림 · 일어남)']", "['C', '포복 (엎드림 · 일어남)'], ['Shift + 오른쪽 클릭', '우회 이동 (아는 적이 적은 쪽으로 크게 돌아감)'], ['Shift + 적 클릭', '우회 공격']")
# 그림: 경유점
rep("          ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(p.x, p.y); ctx.stroke();\n          // 목적지: 흐린 얼굴 + 번호",
    "          ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); if (u.order.via && !u.order.viaOK) ctx.lineTo(ox + u.order.via.x * ts, oy + u.order.via.y * ts); ctx.lineTo(p.x, p.y); ctx.stroke();   // v7.12 우회 경유점\n          if (u.order.via && !u.order.viaOK){ ctx.save(); ctx.setLineDash([]); ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = ctx.strokeStyle; ctx.fillText('↪', ox + u.order.via.x * ts, oy + u.order.via.y * ts); ctx.restore(); }\n          // 목적지: 흐린 얼굴 + 번호")
rep("live && (t.seenBy || see)){ const p = { x: ox + t.x * ts, y: oy + t.y * ts }, r = t.r * ts; ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(p.x, p.y); ctx.stroke();",
    "live && (t.seenBy || see)){ const p = { x: ox + t.x * ts, y: oy + t.y * ts }, r = t.r * ts; ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); if (u.order.via && !u.order.viaOK) ctx.lineTo(ox + u.order.via.x * ts, oy + u.order.via.y * ts); ctx.lineTo(p.x, p.y); ctx.stroke();")

# ---------- 로그 ----------
rep("${e.ai ? ' (지휘관이 시킴 — 날아온 쪽을 짐작)' : ''}", "${e.arc ? ' — 곡사 면 제압 (방패 너머 · 위에서)' : ''}${e.ai ? (e.hid ? ' (지휘관이 시킴 — 숨은 사수의 안 자리)' : ' (지휘관이 시킴 — 날아온 쪽을 짐작)') : ''}")
rep("    case 'supp': return U(e.a).side === 0 ?", "    case 'supp': return U(e.a).side === 0 ? { c: 'good', s: `${ga(n(e.a))} ${coord(e.x, e.y)} 쪽 어둠에 견제사격을 퍼붓는다 — 겨눈 게 아니라 고개를 못 들게.` } : e.vis && e.arc ? { c: 'bad', s: `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 하늘로 화살을 쏘아 올린다 — ${coord(e.x, e.y)} 둘레로 쏟아진다!` } : U(e.a).side === 0 ?")
rep("      case 'lieDone': out.push(`${T(e)}🦎 ${n(e.a)} 다 엎드림${e.seen.length || e.lost.length ? ' [아군에겐 안 보임: 계속 보는 적 ' + (e.seen.map(n).join(' · ') || '없음') + (e.lost.length ? ' · 놓친 적 ' + e.lost.map(n).join(' · ') : '') + ']' : ''}`); break;",
    "      case 'lieDone': { const es = Wd.units[e.a].side; out.push(`${T(e)}🦎 ${es ? '적 ' : ''}${n(e.a)} 다 엎드림${e.seen.length || e.lost.length ? (es ? ' — 계속 보는 아군 ' : ' [아군에겐 안 보임: 계속 보는 적 ') + (e.seen.map(n).join(' · ') || '없음') + (e.lost.length ? (es ? ' · 놓친 아군 ' : ' · 놓친 적 ') + e.lost.map(n).join(' · ') : '') + (es ? '' : ']') : ''}`); break; }")
rep("      case 'lieRoll': if (e.ok) out.push(`${T(e)}👁 적 ${n(e.a)} — 엎드린 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 알아봄 (${e.d}칸 · ${e.why} · ${Math.round(e.p * 100)}%) [아군에겐 안 보임]`); break;",
    "      case 'lieRoll': if (e.ok) out.push(Wd.units[e.a].side ? `${T(e)}👁 적 ${n(e.a)} — 엎드린 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 알아봄 (${e.d}칸 · ${e.why} · ${Math.round(e.p * 100)}%) [아군에겐 안 보임]` : `${T(e)}👁 ${n(e.a)} — 바닥에 엎드린 적 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 알아봄 (${e.d}칸 · ${e.why} · ${Math.round(e.p * 100)}%)`); break;")
rep("      case 'lieMode': out.push(", """      case 'detour': out.push(`${T(e)}↪ ${e.a.map(n).join(' · ')} 우회 — ${e.side > 0 ? '오른쪽' : '왼쪽'}으로 ${coord(e.x, e.y)} 거쳐 (아는 적 ${e.known}${e.known ? ' · 경유점에서 가장 가까운 적 ' + e.near + '칸' : ''}${e.alt ? ' · 적은 쪽이 막혀 반대쪽' : ''})`); break;   // v7.12
      case 'viaDone': out.push(`${T(e)}↪ ${n(e.a)} 우회 경유점 — ${e.why}`); break;
      case 'lieMode': out.push(""")
rep("    case 'lieDown': return U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 몸을 낮춰 바닥에 엎드린다.` } : null;",
    "    case 'lieDown': return U(e.a).side === 0 ? (/고립/.test(e.why || '') ? { c: 'bad', s: `${ga(n(e.a))} 홀로 어딘가에서 쏟아지는 사격에 노출됐다 — 몸을 던져 엎드린다.` } : { c: 'dim', s: `${ga(n(e.a))} 몸을 낮춰 바닥에 엎드린다.` }) : null;   // 적의 자세는 안 보여 줌\n    case 'detour': case 'viaDone': return null;")

# ---------- 모바일: 태세 · 정찰 방침 창의 빈 곳을 눌러도 고르기가 풀리지 않게 ----------
rep("canvas, .fan, .ring, #detail, #dMenu, #side, .tbl,", "canvas, .fan, .ring, #detail, #dMenu, #side, #ask, .tbl,")   # v7.12

open(F, 'w', encoding='utf-8').write(s)

# ---------- 옛 기본값 (수치 이전) ----------
O = json.load(open(D + 'oldrules.json', encoding='utf-8'))
keys = [tuple(p) for p, _ in O]
for p, v in [(["lie", "up"], [0.9]), (["lie", "upFast"], [0.55])]:
    if tuple(p) not in keys: O.append([p, v])
json.dump(O, open(D + 'oldrules.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('page712 OK')
