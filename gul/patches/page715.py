# v7.15.0 페이지 — page715.py v1.2 (v1.2: 돌진 줄 // 주석 → /* */ · v1.1: 가는 중인 명령도 도착해서 쓸 것을 흐리게)
# 회피기동 기록 · 시작 때 편대 지정 상자 · 지시 점 (대장 금색 · 편대장 하늘색 · 함께 외침 고리) · 팜 버스트 · 돌진 우회 · 돌진 화살표 · 특수기 색 고리 · 도착해서 쓸 것
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.14.1 (2026-10-17)', '<!-- 굴의 전투판 v7.15.0 (2026-10-17)')
rep('     v7.14.1: ', '''     v7.15.0: 회피기동 (아군 · 적 같은 규칙) — 사수 · 기동 사수 (노먼 · 친칠라): 근접이 나를 노리고 3칸 안으로 오면 쏜 다음 2.2칸씩 물러남 (동료 쪽 · 다른 근접 손 닿는 곳은 피함) ·
         코앞 (2.4칸) 이면 쏘기 전에도 · 1.6칸 안이면 상대를 보며 뒷걸음 (등을 안 보임) · 이미 맞붙었으면 안 물러남 · 도약이 있으면 뒤로 뜀 · 사이에 근접 동료가 막아 주면 그 자리에서 쏨 ·
         물러나도 따라붙으면 (2.5초) 6초 동안 그 자리에서 쏨. 기동 근접 [회피X] (청광묵): 흘려 빠지기 — 나를 노린 일격 준비를 보면 (회피 A 80% 로 읽음 · 왼눈 사각은 못 봄) 손 밖 옆 · 등 쪽으로
         빠졌다가 (도약이 있으면 뜀) 일격이 떨어진 뒤 그 상대를 침 · 포위 빠지기 — 근접 둘 넘게 2칸 안에서 노리면 빈 쪽으로 빠져나감 (3초마다). '제자리' · 이동 · 급한 명령 중엔 안 함.
         편대 지정: 배치 탭 · 싸움 전 (0초) 전투 탭에 '편대' 상자 — 아군마다 본대 / 2편대 · ★ 2편대장 (하나). 0초에 바꾸면 그 판에도 바로.
         지시 점: 명령이 실제로 거쳐 간 길을 따라 점이 날아감 — 금색 = 대장 (인주) 의 명령 · 하늘색 = 편대장 (노먼) 의 자율 지시 · 속 빈 고리 = 같은 명령을 함께 외친 동료 (예: 카리우스가 인주의 명령을 노먼에게 한 번 더) · 닿으면 고리가 퍼짐.
         팜 버스트 · 돌진도 우회 (Shift · ↪) — 옆으로 돌아 들어가 씀 (돌진은 돌진 거리 밖에서 돌아 들어감). 돌진 = 파란 굵은 화살표 (준비 중 점선 · 적은 붉게) · 팜 버스트 (주황) · 약 (초록) · 투창 (보라) 은 그 색 고리로 진행 중 표시.
         도착해서 쓸 것: 명령선 끝 (노린 상대) 에 무엇을 쓸지 — ⚔ 공격 · 🎯 사격 · 💥 팜 버스트 · 💨 돌진 · 🔱 투창 · ✚ 약. 명령 없이 스스로 노리는 상대도 흐리게.
     v7.14.1: ''')
rep('h1::after{content:" v7.14.1"', 'h1::after{content:" v7.15.0"')
rep('<footer>굴의 전투판 v7.14.1', '<footer>굴의 전투판 v7.15.0')
rep('return `굴의 전투판 v7.14.1 · ${title}', 'return `굴의 전투판 v7.15.0 · ${title}')
rep("copyText('굴의 전투판 v7.14.1 자동 판 기록", "copyText('굴의 전투판 v7.15.0 자동 판 기록")
rep('의 버전 기록에 — v7.14.1 엎드린 동료 위로 쏨', '의 버전 기록에 — v7.15.0 회피기동 · 편대 지정 · 지시 점 · 팜 · 돌진 우회 · 도착해서 쓸 것 / v7.14.1 엎드린 동료 위로 쏨')
rep('">v7.14.1 · 엎드린 동료 위로 쏨 · 징검다리 지휘</span>', '">v7.15.0 · 회피기동 · 편대 지정 · 지시 점</span>')
rep("RULES_MIG = '7.14.1'", "RULES_MIG = '7.15.0'")

# ---------- 편대 지정 상자 ----------
rep('        <div class="box draft" id="draftBox"></div>\n', '        <div class="box draft" id="draftBox"></div>\n        <div class="box sqbox" id="sqBoxP"></div>\n')
rep('        <p class="sublab">아군 · 누르면 고르기 (Shift 누르고 = 더하기 · 숫자키 1 2 3)</p>', '        <div class="box sqbox" id="sqBoxF" hidden></div>\n        <p class="sublab">아군 · 누르면 고르기 (Shift 누르고 = 더하기 · 숫자키 1 2 3)</p>')
rep('        <p class="sublab">적 · 보이는 것만</p>', '        <p class="sublab ordleg">지시 점: <span style="color:#ffd66e">●</span> 대장 · <span style="color:#5fe0ff">●</span> 편대장 (자율 지시) · ○ 같은 명령을 함께 외친 동료</p>\n        <p class="sublab">적 · 보이는 것만</p>')
rep('.tabs{display:flex;border-bottom:1px solid var(--line)}', '.tabs{display:flex;border-bottom:1px solid var(--line)}\n.sqbox .sqrows{display:flex;flex-direction:column;gap:4px}.sqbox .sqrow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0}.sqbox .sqn{min-width:64px;font-weight:700}.sqbox .btn.on{border-color:#5fe0ff;color:#5fe0ff}   /* v7.15 편대 */')
rep("function renderSel(){\n", """// v7.15 편대 지정 (배치 탭 · 싸움 전 0초 전투 탭): 아군마다 본대 / 2편대 · ★ 2편대장 (하나) — 0초면 판에도 바로
const sqGradeOf = p => (p.traits || []).map(t => (t.match(/^지휘([SABC])$/) || [])[1]).find(Boolean) || 'D';
function sqBoxHtml(){
  const A = S.units.filter(p => p.side === 0); if (!A.length) return '';
  const ld = A.find(p => p.rank === '부대장'), g = ld ? sqGradeOf(ld) : null;
  return `<p class="lab">편대 — 본대 (대장) · 2편대 (${ld ? '편대장 ' + esc(ld.name) + ' · 지휘 ' + g + (g === 'D' ? ' — 스스로 지시 못 함' : g === 'C' ? ' — 기본 지시만' : '') : '편대장 없음'})</p><div class="sqrows">` +
    A.map(p => { const k = S.units.indexOf(p), sq = p.sq === 'B' ? 'B' : 'A';
      return `<div class="row sqrow"><span class="sqn">${esc(p.name)}</span>${p.hero ? '<span class="lb">대장 · 본대</span>' : `<span class="seg"><button type="button" class="${sq === 'A' ? 'on' : ''}" data-sqk="${k}" data-sqv="A">본대</button><button type="button" class="${sq === 'B' ? 'on' : ''}" data-sqk="${k}" data-sqv="B">2편대</button></span>${sq === 'B' ? `<button type="button" class="btn sm ${p.rank === '부대장' ? 'on' : ''}" data-sqlead="${k}" title="2편대장은 하나">${p.rank === '부대장' ? '★ 편대장' : '☆ 편대장으로'}</button>` : ''}`}</div>`; }).join('') +
    '</div><p class="note">지휘 스킬이 없으면 지휘 D (스스로 지시 못 함) · C 는 기본 지시만 · 제대로 지휘하려면 B 이상. 편대장의 지시는 판에 하늘색 점으로 보여요.</p>';
}
function renderSqBox(){ const h = sqBoxHtml(); for (const id of ['sqBoxP', 'sqBoxF']){ const b = $(id); if (b && b._h !== h){ b._h = h; b.innerHTML = h; } } const f = $('sqBoxF'); if (f) f.hidden = !(mode === 'plan' && world && world.t < 1e-6); }
function sqApply(){
  if (world && mode === 'plan' && world.t < 1e-6){ const W = world; save();
    S.units.forEach((p, k) => { const u = W.units[k]; if (u && u.side === 0) u.rank = p.rank != null ? p.rank : ''; });
    const Dp = W.units.find(u => u.side === 0 && u.alive && u.rank === '부대장');
    S.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0 || u.hero) return; if (Dp && u !== Dp && p.sq === 'B'){ u.sqLead = Dp.i; u.sqFix = true; u.sqAuto = false; } else { u.sqLead = null; u.sqFix = false; } });
    W.meshC = {}; renderSqBox(); hud(); toast('편대를 바꿨어요 — 이번 판에도 바로'); return; }
  changed(); renderSqBox();
}
function renderSel(){
  renderSqBox();   // v7.15
""")
rep("function hud(){\n", "function hud(){\n  { const f = $('sqBoxF'); if (f) f.hidden = !(mode === 'plan' && world && world.t < 1e-6); }   // v7.15 편대 상자는 싸움 전 (0초) 에만\n")
rep("$('traitRecheck').addEventListener('click', () => { renderTraitsTab(); toast('특성을 다시 검사했어요'); });   // v7.14",
    """$('traitRecheck').addEventListener('click', () => { renderTraitsTab(); toast('특성을 다시 검사했어요'); });   // v7.14
document.addEventListener('click', e => { const b = e.target.closest('[data-sqk],[data-sqlead]'); if (!b || !b.closest('#sqBoxP, #sqBoxF')) return;   // v7.15 편대 상자
  if (mode === 'run' || (world && mode === 'plan' && world.t > 1e-6)){ toast('편대는 싸움 전 (0초) 이나 배치에서 바꿔요'); return; }
  if (b.dataset.sqk != null){ const p = S.units[+b.dataset.sqk]; if (!p) return; p.sq = b.dataset.sqv; if (p.sq === 'A' && p.rank === '부대장') p.rank = ''; if (p.sq === 'B' && !S.units.some(x => x.side === 0 && x.rank === '부대장')) p.rank = '부대장'; }
  else { const p = S.units[+b.dataset.sqlead]; if (!p) return; const on = p.rank !== '부대장'; for (const x of S.units) if (x.side === 0 && x.rank === '부대장') x.rank = ''; if (on){ p.rank = '부대장'; p.sq = 'B'; } }
  sqApply(); });""")

# ---------- 지시 점 ----------
rep("    u.ordPend = { o: nu, m2: lk.m2, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: lk.c, m: lk.m, t0: W.t }; });",
    "    u.ordPend = { o: nu, m2: lk.m2, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: lk.c, m: lk.m, t0: W.t, legs: !!(lk.legs && lk.ok) }; if (C) ordFxAdd(W, u, lk, C.i, false); });   // v7.15 지시 점")
rep("        if (u.ordPend){ const P = u.ordPend, q = Math.max(0, Math.min(1, (Wd.t - P.t0)", "        if (u.ordPend && !u.ordPend.legs){ const P = u.ordPend, q = Math.max(0, Math.min(1, (Wd.t - P.t0)")
rep("  if (!ed && Wd.rally && Wd.t < Wd.rally.until){", """  if (!ed && Wd.ordFx && Wd.ordFx.length){   // v7.15 지시 점: 명령이 실제로 거쳐 간 길 — 금색 = 대장 · 하늘색 = 편대장 (자율 지시) · 속 빈 고리 = 같은 명령을 함께 외친 동료 · 닿으면 고리가 퍼짐
    ctx.save(); ctx.setLineDash([]);
    const dot = (a, b, s0, s1, col, echo, F) => { const A = Wd.units[a], B = Wd.units[b], tt = Wd.t - F.t0; if (!A || !B || hidA(Wd, A) || hidA(Wd, B) || tt < s0 || tt > s1 + 0.35) return;
      const ax = ox + A.x * ts, ay = oy + A.y * ts, bx = ox + B.x * ts, by = oy + B.y * ts;
      if (tt > s1){ const k = (tt - s1) / 0.35; ctx.strokeStyle = `rgba(${col},${(0.8 * (1 - k)).toFixed(2)})`; ctx.lineWidth = echo ? 1.2 : 2; ctx.beginPath(); ctx.arc(bx, by, B.r * ts + 3 + k * ts * 0.5, 0, 6.283); ctx.stroke(); return; }
      const q = (tt - s0) / Math.max(0.05, s1 - s0), x = ax + (bx - ax) * q, y = ay + (by - ay) * q, rr = Math.max(3, ts * (echo ? 0.11 : 0.14));
      ctx.strokeStyle = `rgba(${col},.25)`; ctx.lineWidth = Math.max(1, ts * 0.03); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      if (echo){ ctx.strokeStyle = `rgba(${col},.95)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.stroke(); }
      else { ctx.fillStyle = `rgba(${col},.98)`; ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(10,8,12,.85)'; ctx.lineWidth = 1; ctx.stroke(); } };
    for (const F of Wd.ordFx){ if (Wd.t > F.end || Wd.t < F.t0) continue; const col = F.dep ? '95,224,255' : '255,214,110'; for (const l of F.legs) dot(l[0], l[1], l[2], l[3], col, false, F); for (const l of F.echo) dot(l[0], l[1], l[2], l[3], col, true, F); }
    ctx.restore(); }
  if (!ed && Wd.rally && Wd.t < Wd.rally.until){""")

# ---------- 팜 버스트 · 돌진 우회 ----------
rep("function giveCharge(t){", "function giveCharge(t, det){")
rep("  C.forEach(u => { u.order = { k: 'charge', b: t.i }; u.last = { x: t.x, y: t.y }; }); noteOrders(C);", "  C.forEach(u => { u.order = { k: 'charge', b: t.i }; u.last = { x: t.x, y: t.y }; }); if (det) applyDetour(C, t.x, t.y); noteOrders(C); /* v7.15 우회 돌진 */")
rep("function giveChargePt(x, y){", "function giveChargePt(x, y, det){")
rep("  C.forEach((u, k) => { const a = k * 2.4, rr = k ? 0.7 : 0; u.order = { k: 'charge', x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr }; }); noteOrders(C);", "  C.forEach((u, k) => { const a = k * 2.4, rr = k ? 0.7 : 0; u.order = { k: 'charge', x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr }; }); if (det) applyDetour(C, x, y); noteOrders(C);")
rep("function givePalm(t){", "function givePalm(t, det){")
rep("  for (const u of C) u.order = { k: 'palm', b: t.i };\n  noteOrders(C);", "  for (const u of C) u.order = { k: 'palm', b: t.i };\n  if (det) applyDetour(C, t.x, t.y);   // v7.15 우회 팜 버스트\n  noteOrders(C);")
rep("  if (u && u.side === 1 && palmPick){ givePalm(u); return; }   // v6.7\n  if (u && u.side === 1 && chargePick){ giveCharge(u); return; }",
    "  if (u && u.side === 1 && palmPick){ givePalm(u, add || detourArm); return; }   // v6.7   // v7.15 Shift · ↪ = 우회\n  if (u && u.side === 1 && chargePick){ giveCharge(u, add || detourArm); return; }")
rep("  if (chargePick){ giveChargePt(w.x, w.y); return; }   // v5.5.3 바닥 = 그 자리로 돌격", "  if (chargePick){ giveChargePt(w.x, w.y, add || detourArm); return; }   // v5.5.3 바닥 = 그 자리로 돌격")
rep("  if (k === 'charge'){ if (u && u.side === 1){ giveCharge(u); return done(); } if (!u){ giveChargePt(w.x, w.y); return done(); }", "  if (k === 'charge'){ if (u && u.side === 1){ giveCharge(u, detourArm); return done(); } if (!u){ giveChargePt(w.x, w.y, detourArm); return done(); }")
rep("  if (k === 'palm'){ if (u && u.side === 1){ givePalm(u); return done(); }", "  if (k === 'palm'){ if (u && u.side === 1){ givePalm(u, detourArm); return done(); }")
rep("  detourArm = false; const M = L.filter(u => u.order && ['move', 'amove', 'attack'].includes(u.order.k)); if (!M.length) return;", "  detourArm = false; const M = L.filter(u => u.order && ['move', 'amove', 'attack', 'palm', 'charge'].includes(u.order.k)); if (!M.length) return;   // v7.15 팜 버스트 · 돌진도")

# ---------- 명령선: 돌진 · 팜 색 · 도착해서 쓸 것 ----------
rep("        if (u.order.k === 'throw') ctx.strokeStyle = `rgba(201,168,255,${al})`;   // v5.5.1 투창 명령 = 보라 선\n",
    "        if (u.order.k === 'throw') ctx.strokeStyle = `rgba(201,168,255,${al})`;   // v5.5.1 투창 명령 = 보라 선\n        if (u.order.k === 'charge') ctx.strokeStyle = `rgba(140,202,255,${Math.max(al, .7)})`;   // v7.15 돌진 명령 = 파란 선\n")
rep("          badge(p.x - r * 0.9 - 4 * (allyNo(Wd, u) - 1) * 3, p.y + r * 0.9, allyNo(Wd, u), al); } }\n      }\n",
    """          badge(p.x - r * 0.9 - 4 * (allyNo(Wd, u) - 1) * 3, p.y + r * 0.9, allyNo(Wd, u), al); } }
        if (u.order.k === 'palm' && u.order.b != null){ const t = Wd.units[u.order.b]; if (t && t.alive && (t.seenBy || see)){ const p = { x: ox + t.x * ts, y: oy + t.y * ts }; ctx.strokeStyle = `rgba(255,140,70,${Math.max(al, .7)})`; ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); if (u.order.via && !u.order.viaOK) ctx.lineTo(ox + u.order.via.x * ts, oy + u.order.via.y * ts); ctx.lineTo(p.x, p.y); ctx.stroke(); } }   // v7.15 팜 버스트 명령 = 주황 선
      }
      Wd._itN = {}; for (const u of Wd.units){ if (!u.alive || u.side !== 0 || hid0(u)) continue; const it = intentOf(Wd, u, see); if (it) intentTag(Wd, it, ox, oy, ts); }   // v7.15 도착해서 쓸 것
""")
rep("/* ---------- 상황판 (아군 카드 · 명령 · 적 카드) ---------- */", """// v7.15 도착해서 쓸 것: 명령 (또는 스스로 노리는 상대) 의 끝에 무엇을 쓸지 — ⚔ 공격 · 🎯 사격 · 💥 팜 버스트 · 💨 돌진 · 🔱 투창 · ✚ 약. 명령 없이 스스로면 흐리게
function intentOf(Wd, u, see){ const r = intentOf0(Wd, u, see); if (r && !u.order && u.ordPend) r.auto = true; return r; }
function intentOf0(Wd, u, see){
  const pend = !u.order && u.ordPend && u.ordPend.ok ? u.ordPend.o : null, o = u.order || pend, tgt = b => { const t = b != null ? Wd.units[b] : null; return t && t.alive && (t.side === 0 || t.seenBy || see) ? t : null; };
  if (o && o.k !== 'hold'){
    const t = tgt(o.b);
    if (o.k === 'palm' && t) return { t, ic: '💥', lab: '팜 버스트', col: '255,140,70' };
    if (o.k === 'charge') return t ? { t, ic: u.shield ? '🛡' : '💨', lab: '돌진', col: '140,202,255' } : o.x != null ? { x: o.x, y: o.y, ic: u.shield ? '🛡' : '💨', lab: '돌진', col: '140,202,255' } : null;
    if (o.k === 'throw' && t) return { t, ic: '🔱', lab: '투창', col: '201,168,255' };
    if (o.k === 'skill' && t) return { t, ic: '✚', lab: u.skill ? u.skill.name : '약', col: '111,224,143' };
    if (o.k === 'attack' && t) return { t, ic: isFar(u) ? '🎯' : '⚔', lab: isFar(u) ? '사격' : '공격', col: o.dep != null ? '95,224,255' : '217,169,78' };
    return null; }
  if (pend) return null;
  const m = u.mood || '', t = tgt(u.moodB); if (!t || t.side === 0 || Wd.t - (u.moodT || 0) > 4) return null;
  const ic = /팜/.test(m) ? ['💥', '팜 버스트', '255,140,70'] : /돌진|돌격/.test(m) ? ['💨', '돌진', '140,202,255'] : /투창|던/.test(m) ? ['🔱', '투창', '201,168,255'] : /도약/.test(m) ? ['⤴', '도약', '140,202,255'] : isFar(u) ? ['🎯', '사격', '217,169,78'] : ['⚔', '공격', '217,169,78'];
  return { t, ic: ic[0], lab: ic[1], col: ic[2], auto: true };
}
function intentTag(Wd, it, ox, oy, ts){
  const x = ox + (it.t ? it.t.x : it.x) * ts, y = oy + (it.t ? it.t.y : it.y) * ts, r = (it.t ? it.t.r : 0.3) * ts;
  const k = (Wd._itN = Wd._itN || {}), key = it.t ? it.t.i : Math.round(x) + ':' + Math.round(y), n = k[key] = (k[key] || 0) + 1, fs = Math.max(10, Math.min(15, ts * 0.42)), yy = y - r - fs * 0.9 - (n - 1) * (fs + 3);
  ctx.save(); ctx.globalAlpha = it.auto ? 0.55 : 0.95; ctx.setLineDash([]); ctx.font = `700 ${fs - 2}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lab = it.ic + (ts >= 22 ? ' ' + it.lab : ''), w = ctx.measureText(lab).width + 10;
  ctx.fillStyle = 'rgba(14,12,18,.85)'; ctx.fillRect(x - w / 2, yy - fs / 2 - 1, w, fs + 2); ctx.strokeStyle = `rgba(${it.col},.95)`; ctx.lineWidth = 1.2; ctx.strokeRect(x - w / 2 + 0.5, yy - fs / 2 - 0.5, w - 1, fs + 1); ctx.fillStyle = '#fff'; ctx.fillText(lab, x, yy + 0.5); ctx.restore();
}
/* ---------- 상황판 (아군 카드 · 명령 · 적 카드) ---------- */""")
rep("    // v5.5.1 준비 띠: 무엇을 준비하는지 (아이콘 · 이름 · 대상) + 진행 막대 — 이름 밑\n", """    if (!ed && u.act && u.act.k === 'charge' && !hid0(u)){   // v7.15 돌진 = 파란 굵은 화살표 (준비 중엔 점선 · 적은 붉게)
      const A = u.act, tb = A.b != null ? Wd.units[A.b] : null, tx = tb ? ox + tb.x * ts : A.px != null ? ox + A.px * ts : null, ty = tb ? oy + tb.y * ts : A.py != null ? oy + A.py * ts : null;
      if (tx != null && Math.hypot(tx - px, ty - py) > r + 4){ const run = A.phase === 'run', col = u.side ? '255,110,90' : '120,190,255', ang = Math.atan2(ty - py, tx - px), hw = Math.max(3, ts * (run ? 0.16 : 0.09)), ex = tx - Math.cos(ang) * hw * 2.2, ey = ty - Math.sin(ang) * hw * 2.2;
        ctx.save(); ctx.globalAlpha = 1; ctx.strokeStyle = `rgba(${col},${run ? .9 : .6})`; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = hw; ctx.lineCap = 'round'; ctx.setLineDash(run ? [] : [hw * 1.2, hw]);
        ctx.beginPath(); ctx.moveTo(px + Math.cos(ang) * r, py + Math.sin(ang) * r); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ex - Math.cos(ang - 1.57) * hw * 1.6, ey - Math.sin(ang - 1.57) * hw * 1.6); ctx.lineTo(ex + Math.cos(ang - 1.57) * hw * 1.6, ey + Math.sin(ang - 1.57) * hw * 1.6); ctx.closePath(); ctx.fill(); ctx.restore(); } }
    if (!ed && u.act && !hid0(u) && ['palm', 'skill', 'heal', 'throw'].includes(u.act.k)){ const col = u.act.k === 'palm' ? '255,140,70' : u.act.k === 'throw' ? '201,168,255' : '111,224,143';   // v7.15 특수기는 그 색 고리로 진행 중
      ctx.save(); ctx.globalAlpha = 1; ctx.setLineDash([]); ctx.strokeStyle = `rgba(${col},${(0.6 + 0.35 * Math.sin(now * 12)).toFixed(2)})`; ctx.lineWidth = Math.max(2, ts * 0.08); ctx.beginPath(); ctx.arc(px, py, r + Math.max(3, ts * 0.12), 0, 6.283); ctx.stroke(); ctx.restore(); }
    // v5.5.1 준비 띠: 무엇을 준비하는지 (아이콘 · 이름 · 대상) + 진행 막대 — 이름 밑
""")

# ---------- 기록 · 서술 ----------
rep("      case 'leapShot': out.push(", """      case 'evade': out.push(`${T(e)}${e.m === 'slip' || e.m === 'out' ? '🌀' : '↩'} ${n(e.a)} — ${({ kite: '거리 벌림 (쏘고 물러남)', leap: '뒤로 도약해 거리를 벌림', stuck: '물러나도 따라붙음 — 그 자리에서 쏨', slip: '흘려 빠지기' + (e.back ? ' (등 쪽으로)' : ' (손 밖 옆으로)') + (e.leap ? ' · 도약' : '') + (e.left != null ? ' · 일격까지 ' + e.left + '초' : ''), out: '포위 빠지기 (' + (e.n || 2) + '명에게 몰림)' + (e.leap ? ' · 도약' : '') })[e.m] || e.m}${e.b != null ? ' ← ' + n(e.b) : ''}`); break;   // v7.15 회피기동
      case 'leapShot': out.push(""")
rep("    case 'leapShot': if (!(e.vis || U(e.a).side === 0)) return null;", """    case 'evade': if (!(e.vis || U(e.a).side === 0)) return null; return e.m === 'slip' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${n(e.b)}의 일격을 흘려 빠진다!` } : e.m === 'out' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 몰려드는 적들 사이를 빠져나간다.` } : e.m === 'leap' || e.m === 'kite' ? { c: 'dim', s: `${ga(n(e.a))} 거리를 벌린다.` } : null;   // v7.15
    case 'leapShot': if (!(e.vis || U(e.a).side === 0)) return null;""")

open(F, 'w', encoding='utf-8').write(s)
print('page715 OK')
