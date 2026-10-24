# v9.1.0 페이지 — page9010.py v1.0 (v1.0: 2층 대규모 업데이트 2단계 — 전우조 · 대장-부하 연결 UI (편대를 대신함) · 굵은 파란 선 · 금빛 점선 + ♛ · 배치 상자 · 상세 칸 · 로그)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9000.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
def cut(a, b, new):   # a 로 시작해 b 앞까지를 new 로
    global s
    i = s.find(a); assert i >= 0 and s.count(a) == 1, ('cut-a', a[:60])
    j = s.find(b, i + len(a)); assert j > i, ('cut-b', b[:60])
    s = s[:i] + new + s[j:]
# ----- 버전
rep('<!-- 굴의 전투판 v9.0.0 (2026-10-24)', '<!-- 굴의 전투판 v9.1.0 (2026-10-24)')
rep('     v9.0.0: 2층 대규모 업데이트 1단계', '''     v9.1.0: 2층 대규모 업데이트 2단계 — 전우조 · 대장-부하 (옛 편대를 대신함, 민수 2026-10-24 "편대는 사실상 죽은 기능, 이게 자연스럽게 대체"):
         · 🤝 전우조 (cg) = 동등한 짝 (둘 이상): 서로 붙어 다님 (명령으로 멀리 간 전우 곁으로) · 위급한 전우를 노리는 적에게 달려듦 (돌격 금지여도 구하러는 돌진) · 전우가 붙든 적의 옆구리를 침 · 전우의 표적을 함께 노림 · 치유는 전우 먼저
         · 🎖 대장-부하 (sqLead): 부하는 인주 대신 대장을 따름 · 대장의 말은 바로 닿음 (지휘망 안 거침) · 대장이 싸우는 적은 부하도 앎 · 대장의 자율 지시 (옛 편대장 두뇌) 를 받음 — 부하를 둔 대장은 지휘 스킬이 없어도 기본 지시는 함
         · 지휘망 밖이면 저절로 편대에 드는 일은 없어짐 (rules.sq.auto = false) — 모든 관계는 손으로 정함. 둘은 별개 (한 사람이 둘 다 가질 수 있음) · 공식 부대장 (노먼) 은 따로
         · 연결: 명령 칸의 🤝 / 🎖 / ✂ — 여럿을 골라 🤝 (Shift) 또는 한 명 고르고 🤝 → 짝을 누름 · 부하를 고르고 🎖 → 대장을 누름 · 같은 짝을 다시 이으면 풀림 · 싸움 도중에도 바로 (지휘망 안 거침) · 배치 상자 / 상세 칸에서도
         · 판 위: 전우 사이는 굵은 파란 선, 대장-부하는 금빛 점선 + 대장 머리 위 ♛ · 카드 줄에 🤝 / 🎖 표시 · 관계는 배치 칸 (cg · chiefNm) 에 적혀 다음 판 · 다음 층에도
     v9.0.0: 2층 대규모 업데이트 1단계''')
for a, b in (('h1::after{content:" v9.0.0"', 'h1::after{content:" v9.1.0"'), ('<footer>굴의 전투판 v9.0.0', '<footer>굴의 전투판 v9.1.0'), ('return `굴의 전투판 v9.0.0 · ${title}', 'return `굴의 전투판 v9.1.0 · ${title}'),
             ("copyText('굴의 전투판 v9.0.0 자동 판 기록", "copyText('굴의 전투판 v9.1.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.0.0 — ${C.run", "o.push(`굴의 전투판 v9.1.0 — ${C.run"),
             ('의 버전 기록에 — v9.0.0 공통 규칙 /', '의 버전 기록에 — v9.1.0 전우조 · 대장-부하 / v9.0.0 공통 규칙 /'),
             ('">v9.0.0 · 공통 규칙 (돌격 금지 기본 · 던지기 · 회색 피해 · 스텝 · 미라)</span>', '">v9.1.0 · 전우조 · 대장-부하 (편대 대신)</span>'),
             ("ver: '9.0.0', kind:", "ver: '9.1.0', kind:"), ("RULES_MIG = '9.0.0',", "RULES_MIG = '9.1.0',")):
    rep(a, b)
rep('<span style="color:#ffd66e">●</span> 대장 · <span style="color:#5fe0ff">●</span> 편대장 (자율 지시)', '<span style="color:#ffd66e">●</span> 인주 (지휘관) · <span style="color:#5fe0ff">●</span> 대장 (부하에게 자율 지시)')
# ----- CSS
rep(".lk{font:700 10.5px var(--mono,monospace)", ".lk.b{background:#16294a;color:#8fb8ff} .rels .lbl{opacity:.8} .sqbox .rl{display:inline-flex;gap:4px;align-items:center;font-size:12px} .sqbox select{max-width:120px}\n.lk{font:700 10.5px var(--mono,monospace)")
# ----- 명령 칸: 관계 줄
rep('    <div class="row postures" title="교전 규칙', '    ${relRowHtml(Wd, L)}\n    <div class="row postures" title="교전 규칙')
rep("  if (k === 'squad'){ squadKey(L); return; }   // v7.10\n", "  if (k === 'mate' || k === 'chief' || k === 'relcut'){ relKey(k); return; }   // v9.1 전우조 · 대장\n")
rep("  if (k === 'squad'){ squadKey(selUnits(world)); return; }   // v7.10\n", "  if (k === 'mate' || k === 'chief'){ relKey(k); return; }   // v9.1\n")
rep("function pickAlly(i, add){ { const U0", "function pickAlly(i, add){ if (relPick && world && relApply(i)) return; { const U0")
rep("if (sel.size === 1 && sel.has(u.i)){ clearSel(); return; } pickAlly(u.i, false);", "if (sel.size === 1 && sel.has(u.i) && !relPick){ clearSel(); return; } pickAlly(u.i, false);")
rep("if (askSt){ askScoutDone('x'); return; } if (boxArm){ boxArm = false; hud(); return; }", "if (askSt){ askScoutDone('x'); return; } if (relPick){ relPick = null; toast('연결을 취소했어요'); hud(); return; } if (boxArm){ boxArm = false; hud(); return; }")
rep("  if (k === 'pickx'){ boxArm = false;", "  if (k === 'pickx'){ relPick = null; boxArm = false;")
# ----- 편대 배속 함수 → 연결 함수
cut("// v7.10 편대 배속: 부대장의 편대에 넣거나 본대로", "// v7.9 교전 규칙 · 치료 방침: 고른 아군에게 (진행 중엔", r'''// v9.1 전우조 · 대장-부하 연결 (옛 편대 배속을 대신함) — 지휘망을 거치지 않고 바로. 관계는 배치 칸 (cg · chiefNm) 에도 적음
let relPick = null, relBase = [];   // 연결 모드: 'mate' | 'chief' (다음에 누르는 아군과 이음) · 먼저 고른 이들
const relNames = L => L.map(u => u.name).join(' · ');
function relSave(){ try { relSync(world, S); if (typeof save === 'function') save(); } catch (e) {} }
function relRowHtml(Wd, L){
  const hasMate = L.some(u => u.cg), hasChief = L.some(u => u.chiefLk), same = L.length >= 2 && L.every(u => u.cg && u.cg === L[0].cg);
  const tag = L.length === 1 ? (() => { const u = L[0], ms = matesOf(Wd, u), C = chiefOfU(Wd, u), fl = Wd.units.filter(m => m.alive && m.chiefLk && m.sqLead === u.i);
    return (ms.length ? `<span class="lk b" title="전우조">🤝 ${esc(ms.map(m => m.name).join(' · '))}</span>` : '') + (C ? `<span class="lk c" title="대장">🎖 대장 ${esc(C.name)}</span>` : '') + (fl.length ? `<span class="lk c" title="부하">🎖 부하 ${esc(fl.map(m => m.name).join(' · '))}</span>` : ''); })() : '';
  return `<div class="row rels" title="전우조 (동등한 짝) · 대장-부하 — 바로 맺고 바로 풀려요 (지휘망을 거치지 않아요)"><span class="lbl">관계</span><button class="btn ${relPick === 'mate' ? 'on' : ''}" type="button" data-ord="mate" title="전우조: 서로 붙어 다니고 · 위급하면 구하고 · 옆구리를 쳐 줘요. 둘 이상을 고르면 바로 맺고 (Shift 로 여럿), 한 명이면 누른 뒤 짝을 눌러요. 같은 짝이면 풀려요">🤝 ${same ? '전우조 풀기' : L.length >= 2 ? '전우조 맺기' : relPick === 'mate' ? '짝을 누르세요…' : '전우 고르기'}</button><button class="btn ${relPick === 'chief' ? 'on' : ''}" type="button" data-ord="chief" title="대장-부하: 고른 아군이 부하가 돼요 — 누른 뒤 대장이 될 아군을 눌러요. 부하는 인주 대신 대장을 따르고, 대장의 말은 바로 닿아요. 같은 대장이면 풀려요">🎖 ${relPick === 'chief' ? '대장을 누르세요…' : '대장 연결'}</button><button class="btn" type="button" data-ord="relcut" ${hasMate || hasChief ? '' : 'disabled'} title="고른 아군의 전우조 · 대장 관계를 풀어요">✂ 관계 풀기</button>${tag}</div>`;
}
function relKey(k){
  const W = world; if (!W || mode === 'edit') return; const L = selUnits(W);
  if (k === 'relcut'){ const n = cgLeave(W, L) + chiefClear(W, L); relPick = null; relSave(); toast(n ? `✂ ${relNames(L)} — 전우조 · 대장 관계를 풀었어요` : '풀 관계가 없어요'); hud(); return; }
  if (k === 'mate'){
    if (L.length >= 2){ const o = cgJoin(W, L); relPick = null; relSave(); toast(o.ok ? (o.on ? `🤝 ${relNames(L)} — 전우조! 서로 붙어 다니고, 위급하면 구하고, 옆구리를 쳐 줘요` : `🤝 ${relNames(L)} — 전우조를 풀었어요`) : o.why); hud(); return; }
    if (L.length === 1){ relPick = relPick === 'mate' ? null : 'mate'; relBase = L.map(u => u.i); toast(relPick ? `🤝 ${L[0].name}의 전우를 누르세요 — 아군을 누르면 짝이 돼요 (이미 짝이면 풀려요 · Esc 취소)` : '연결을 취소했어요'); hud(); return; }
    toast('전우조로 이을 아군을 둘 이상 (Shift 로 여럿) 또는 한 명 고르세요'); return; }
  if (k === 'chief'){
    const Fo = L.filter(u => !u.hero); if (!Fo.length){ toast('부하로 삼을 아군을 먼저 고르세요 (인주는 부하가 될 수 없어요)'); return; }
    relPick = relPick === 'chief' ? null : 'chief'; relBase = Fo.map(u => u.i); toast(relPick ? `🎖 ${relNames(Fo)}의 대장을 누르세요 — 부하는 인주 대신 대장을 따르고, 대장의 말은 바로 닿아요 (인주를 누르면 풀려요 · Esc 취소)` : '연결을 취소했어요'); hud(); return; }
}
function relApply(i){   // 연결 모드에서 아군을 누름 — 처리했으면 true
  const W = world, U = W.units[i], mode0 = relPick, base = relBase.map(j => W.units[j]).filter(u => u && u.alive);
  if (!U || U.side !== 0 || !U.alive || !base.length){ relPick = null; return false; }
  if (base.includes(U)){ toast('다른 아군을 눌러 주세요 (Esc 취소)'); return true; }
  relPick = null;
  if (mode0 === 'mate'){ const o = cgJoin(W, [...base, U]); relSave(); sel = new Set([...base, U].map(u => u.i)); toast(o.ok ? (o.on ? `🤝 ${relNames(base)} · ${U.name} — 전우조!` : `🤝 ${relNames(base)} · ${U.name} — 전우조를 풀었어요`) : o.why); }
  else { const o = chiefSet(W, base, U); relSave(); toast(o.ok ? (o.on ? `🎖 ${U.name} ← 부하 ${relNames(base)} — 이제 인주 대신 ${U.name}을(를) 따라요` : `🎖 ${relNames(base)} — 대장 관계를 풀었어요 (인주를 따름)`) : o.why); }
  hud(); return true;
}
// 판 위의 관계 선: 전우 사이는 굵은 파란 선 (셋 이하는 서로 모두, 넷 이상은 가까운 순으로 이음) · 대장-부하는 금빛 점선 + 대장 머리 위 ♛
function drawRel(Wd, ox, oy, ts){
  const live = Wd.t > 0.01, al = Wd.units.filter(u => u.side === 0 && u.alive && !u.summon && !u.gone && !(live && hidA(Wd, u))); if (!al.length) return;
  const g = {}; for (const u of al) if (u.cg) (g[u.cg] = g[u.cg] || []).push(u);
  ctx.save(); ctx.lineCap = 'round';
  for (const k in g){ const m = g[k]; if (m.length < 2) continue; const pairs = [];
    if (m.length <= 3){ for (let a = 0; a < m.length; a++) for (let b = a + 1; b < m.length; b++) pairs.push([m[a], m[b]]); }
    else { const rest = m.slice(); let cur = rest.shift(); while (rest.length){ rest.sort((p, q) => Math.hypot(p.x - cur.x, p.y - cur.y) - Math.hypot(q.x - cur.x, q.y - cur.y)); const nx = rest.shift(); pairs.push([cur, nx]); cur = nx; } }
    for (const [a, b] of pairs){ const x1 = ox + a.x * ts, y1 = oy + a.y * ts, x2 = ox + b.x * ts, y2 = oy + b.y * ts, w = Math.max(4.5, ts * 0.2);
      ctx.setLineDash([]); ctx.strokeStyle = 'rgba(40,110,255,.25)'; ctx.lineWidth = w * 2.3; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = 'rgba(86,156,255,.95)'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.fillStyle = '#d6e6ff'; ctx.beginPath(); ctx.arc((x1 + x2) / 2, (y1 + y2) / 2, Math.max(4, ts * 0.17), 0, 6.283); ctx.fill(); } }
  const crowned = new Set();
  for (const u of al){ if (u.sqLead == null || u.hero) continue; const C = Wd.units[u.sqLead]; if (!C || !C.alive || C === u || !(u.chiefLk || u.sqFix) || (live && hidA(Wd, C))) continue;
    ctx.setLineDash([Math.max(4, ts * 0.22), Math.max(3, ts * 0.14)]); ctx.strokeStyle = 'rgba(255,214,110,.82)'; ctx.lineWidth = Math.max(1.5, ts * 0.06); ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(ox + C.x * ts, oy + C.y * ts); ctx.stroke(); crowned.add(C); }
  ctx.setLineDash([]); ctx.font = `700 ${Math.max(11, ts * 0.5)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const C of crowned){ ctx.fillStyle = '#ffd66e'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 2; ctx.strokeText('♛', ox + C.x * ts, oy + C.y * ts - ts * 0.95); ctx.fillText('♛', ox + C.x * ts, oy + C.y * ts - ts * 0.95); }
  ctx.restore();
}
''')
# ----- 판 위: 옛 청록 점선 → 관계 선
cut("  if (!ed && $('netShow').checked && Wd.t > 0.01){   // v7.10 편대: 부대장 ↔ 편대원 (청록 점선)", "  if (!ed && $('netShow').checked && Wd.t > 0.01 && Wd.mesh0){", "  drawRel(Wd, ox, oy, ts);   /* v9.1 전우조 (굵은 파란 선) · 대장-부하 (금빛 점선 · ♛) — 옛 편대 점선을 대신함 */\n")
# ----- 모바일 조작판 단추
cut("      + (() => { const Dp = deputyOf(Wd, 0), T = Dp ? L.filter(", "// v7.10\n", "      + (L.length ? `<button type=\"button\" class=\"db ${relPick === 'mate' ? 'on' : ''}\" data-dk=\"mate\" title=\"전우조: 여럿을 골랐으면 바로 맺고, 한 명이면 짝을 눌러요\"><span class=\"ic\">🤝</span>전우조<small>${L.length >= 2 && L.every(u => u.cg && u.cg === L[0].cg) ? '풀기' : relPick === 'mate' ? '짝 누르기' : '맺기'}</small></button><button type=\"button\" class=\"db ${relPick === 'chief' ? 'on' : ''}\" data-dk=\"chief\" title=\"고른 아군을 부하로 — 누른 뒤 대장을 눌러요\"><span class=\"ic\">🎖</span>대장<small>${relPick === 'chief' ? '대장 누르기' : '연결'}</small></button>` : '')   ")
# ----- 카드 줄 표시
rep("  const sqN = Wd.units.filter(m => m.alive && m.sqLead === u.i).length;\n", "  const sqN = Wd.units.filter(m => m.alive && m.sqLead === u.i).length;\n  const mt = u.cg ? Wd.units.filter(m => m !== u && m.alive && m.cg === u.cg) : [], relB = (mt.length ? `<span class=\"lk b\" title=\"전우조 ${esc(mt.map(m => m.name).join(' · '))} — 서로 붙어 다니고, 위급하면 구하고, 옆구리를 쳐 줘요\">🤝 ${esc(mt.map(m => m.name).join(' · '))}</span>` : '') + (sqN && u.rank !== '부대장' ? `<span class=\"lk c\" title=\"대장 — 부하 ${sqN}명이 따르고, 이 사람의 말은 바로 닿아요\">🎖 대장 · 부하 ${sqN}</span>` : '');   // v9.1\n")
rep("u.alive) return `<span class=\"lk c\" title=\"공식 부대장", "u.alive) return relB + `<span class=\"lk c\" title=\"공식 부대장")
rep("${sqN ? ' · 편대 ' + sqN : ''}</span>`", "${sqN ? ' · 부하 ' + sqN : ''}</span>`")
rep("title=\"공식 부대장 (지휘 점수 ${u.cmd}) — 지휘관의 말을 못 들은 이에게 2차로 전하고, 지휘관이 쓰러지면 바로 이어받고, 편대를 이끌어 스스로 표적을 외침\"", "title=\"공식 부대장 (지휘 점수 ${u.cmd}) — 지휘관의 말을 못 들은 이에게 2차로 전하고, 지휘관이 쓰러지면 바로 이어받고, 부하가 있으면 이끌어 스스로 표적을 외침\"")
rep("if (u !== C && u.cmd > 0 && u.alive) return `<span", "if (u !== C && u.cmd > 0 && u.alive) return relB + `<span")
rep("  if (u === C) return `<span class=\"lk c\" title=\"지휘관 — 명령은", "  if (u === C) return relB + `<span class=\"lk c\" title=\"지휘관 — 명령은")
cut("  const sqB = u.sqLead != null && Wd.units[u.sqLead]", "  return sqB + isoB + nf", "  const sqB = u.sqLead != null && Wd.units[u.sqLead] ? `<span class=\"lk c\" title=\"대장 ${esc(Wd.units[u.sqLead].name)}의 부하 — 인주 대신 대장을 따르고, 대장의 말은 바로 닿고, 대장이 싸우는 적을 함께 노려요\">🎖 ${esc(Wd.units[u.sqLead].name)}의 부하</span>` : '';   // v9.1\n")
rep("  return sqB + isoB + nf", "  return relB + sqB + isoB + nf")
# ----- 배치 상자 · 상세 칸 · 감사
cut("function sqBoxHtml(){", "function renderSqBox(){", r'''const relChiefName = p => { if (p.chiefNm !== undefined) return p.chiefNm || ''; const Dp = S.units.find(x => x.side === 0 && x.rank === '부대장'); return p.sq === 'B' && Dp && Dp !== p && !p.hero ? Dp.name : ''; };   // v9.1 옛 2편대 = 부대장의 부하
const relMatesP = p => p.cg ? S.units.filter(x => x !== p && x.side === 0 && x.cg === p.cg) : [];
function relSelects(p, idc, idm){
  const A = S.units.filter(x => x.side === 0 && x !== p && !x.summon), hn = (S.units.find(x => x.side === 0 && x.hero) || {}).name || '인주', ch = relChiefName(p), ms = relMatesP(p).map(x => x.name);
  return `<label class="rl">🎖 대장 <select ${idc}><option value="">${esc(hn)} (기본)</option>${A.filter(x => !x.hero).map(x => `<option value="${esc(x.name)}" ${ch === x.name ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label><label class="rl">🤝 전우 <select ${idm}><option value="">없음</option>${A.map(x => `<option value="${esc(x.name)}" ${ms.includes(x.name) ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label>`;
}
function sqBoxHtml(){
  const A = S.units.filter(p => p.side === 0 && !p.summon); if (!A.length) return '';
  const ld = A.find(p => p.rank === '부대장'), g = ld ? sqGradeOf(ld) : null;
  return `<p class="lab">관계 — 🤝 전우조 (동등한 짝) · 🎖 대장-부하 (부하는 대장을 따름) · ★ 공식 부대장${ld ? ' ' + esc(ld.name) + ' (지휘 ' + g + ')' : ''}</p><div class="sqrows">` +
    A.map(p => { const k = S.units.indexOf(p);
      return `<div class="row sqrow"><span class="sqn">${esc(p.name)}</span>${p.hero ? '<span class="lb">인주 — 모두의 기본 대장</span>' : relSelects(p, `data-relchief="${k}"`, `data-relmate="${k}"`) + `<button type="button" class="btn sm ${p.rank === '부대장' ? 'on' : ''}" data-sqlead="${k}" title="공식 부대장은 하나 — 지휘관의 말을 못 들은 이에게 2차로 전하고, 지휘관이 쓰러지면 바로 이어받아요">${p.rank === '부대장' ? '★ 부대장' : '☆ 부대장으로'}</button>`}</div>`; }).join('') +
    '</div><p class="note">싸우는 중에도 아군을 골라 명령 칸의 🤝 / 🎖 로 바꿀 수 있어요. 판에는 전우 사이가 굵은 파란 선, 대장-부하는 금빛 점선 (대장 머리 위 ♛) 으로 보여요. 지휘 스킬이 없는 대장도 부하에게 기본 지시는 해요.</p>';   /* v9.1 편대를 대신함 */
}
''')
cut("function sqApply(){", "// v7.20 소지품 (배치): 장비 네 칸", r'''// v9.1 관계를 판에 다시 입힘 (배치 칸 cg · chiefNm 기준) — 싸움 도중에도 됨
function relReapply(W){
  const Dp = W.units.find(u => u.side === 0 && u.alive && u.rank === '부대장');
  S.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0) return; u.rank = p.rank != null ? p.rank : u.rank; if (u.hero) return; u.cg = null; u.sqLead = null; u.sqFix = false; u.chiefLk = false; });
  S.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0 || u.hero) return; if (Dp && u !== Dp && p.sq === 'B' && p.chiefNm === undefined){ u.sqLead = Dp.i; u.sqFix = true; u.sqAuto = false; u.chiefLk = true; } });
  chiefInit(W, S); W.meshC = {};
}
function relMaterialize(){ for (const p of S.units) if (p.side === 0 && p.chiefNm === undefined) p.chiefNm = relChiefName(p); }
function relNormalize(){ const n = {}; for (const p of S.units) if (p.side === 0 && p.cg) n[p.cg] = (n[p.cg] || 0) + 1; for (const p of S.units) if (p.side === 0 && p.cg && n[p.cg] < 2) p.cg = ''; }
function relEditP(p, kind, value){   // kind: 'chief' | 'mate'
  relMaterialize();
  if (kind === 'chief') p.chiefNm = value || '';
  else { const q = value ? S.units.find(x => x.side === 0 && x !== p && x.name === value) : null;
    if (!q) p.cg = ''; else { const key = q.cg || 'g' + Date.now().toString(36) + Math.floor(Math.random() * 99); q.cg = key; p.cg = key; } }
  relNormalize(); sqApply();
}
function sqApply(){
  if (world && mode !== 'edit'){ save(); relReapply(world); renderSqBox(); hud(); toast('관계를 바꿨어요 — 이번 판에도 바로'); return; }
  changed(); renderSqBox();
}
''')
cut("document.addEventListener('click', e => { const b = e.target.closest('[data-sqk],[data-sqlead]');", "// v7.14 특성 검사: 중복", r'''document.addEventListener('click', e => { const b = e.target.closest('[data-sqlead]'); if (!b || !b.closest('#sqBoxP, #sqBoxF')) return;   // v7.15 부대장 상자
  if (mode === 'run' || (world && mode === 'plan' && world.t > 1e-6)){ toast('공식 부대장은 싸움 전 (0초) 이나 배치에서 바꿔요'); return; }
  const p = S.units[+b.dataset.sqlead]; if (!p) return; const on = p.rank !== '부대장'; for (const x of S.units) if (x.side === 0 && x.rank === '부대장') x.rank = ''; if (on) p.rank = '부대장';
  sqApply(); });
document.addEventListener('change', e => { const t = e.target; if (!t || !t.matches || !t.matches('[data-relchief],[data-relmate]') || !t.closest('#sqBoxP, #sqBoxF')) return;   // v9.1 관계 고르기
  const p = S.units[+(t.dataset.relchief != null ? t.dataset.relchief : t.dataset.relmate)]; if (p) relEditP(p, t.dataset.relchief != null ? 'chief' : 'mate', t.value); });
''')
# 상세 칸 (인물 설계)
cut("    ${p.side === 0 && !p.hero ? (() => { const sq = p.sq === 'B' ? 'B' : 'A', ld =", "    <div class=\"row\"><label class=\"ck\" for=\"selNv\">", r'''    ${p.side === 0 && !p.hero ? (() => { const cg = (p.traits || []).map(t => (t.match(/^지휘([SABC])$/) || [])[1]).find(Boolean) || 'D';   // v9.1 관계 (옛 편대)
      return `<div class="row"><span class="brush">관계</span>${relSelects(p, 'id="selRelChief"', 'id="selRelMate"')}<label class="ck" for="selSqLead"><input id="selSqLead" type="checkbox" ${p.rank === '부대장' ? 'checked' : ''}> 공식 부대장 — 지휘 ${cg}${cg === 'D' ? ' (지휘 스킬이 없어도 부하를 두면 기본 지시는 해요)' : cg === 'C' ? ' (기본 지시만 · 제대로 지휘하려면 B 이상)' : ''}</label></div>`; })() : p.side === 0 && p.hero ? '<div class="row"><span class="brush">관계</span> 인주 — 모두의 기본 대장</div>' : ''}
''')
cut("  const q = e.target.closest('[data-psq]'); if (q){", "  { const ib = e.target.closest('[data-ibag]')", "")
rep("  if (e.target.id === 'selSqLead'){ if (e.target.checked){ for (const x of S.units) if (x.side === 0 && x.rank === '부대장') x.rank = ''; p.rank = '부대장'; p.sq = 'B'; } else p.rank = ''; changed(); return; }   // v7.13 2편대장 (하나)",
    "  if (e.target.id === 'selSqLead'){ if (e.target.checked){ for (const x of S.units) if (x.side === 0 && x.rank === '부대장') x.rank = ''; p.rank = '부대장'; } else p.rank = ''; changed(); return; }   // v7.13 공식 부대장 (하나)\n  if (e.target.id === 'selRelChief'){ relEditP(p, 'chief', e.target.value); renderSel(); return; }   // v9.1\n  if (e.target.id === 'selRelMate'){ relEditP(p, 'mate', e.target.value); renderSel(); return; }")
rep("    if (p.side === 0 && p.rank === '부대장' && p.sq !== 'B') add('warn', nm, '2편대장인데 편대가 본대'); }", "    if (p.side === 0 && p.chiefNm && !list.some(x => x.side === 0 && x !== p && x.name === p.chiefNm)) add('warn', nm, `대장 ${p.chiefNm} 이(가) 배치에 없음 (인주를 따름)`);   // v9.1\n    if (p.side === 0 && p.cg && list.filter(x => x.side === 0 && x.cg === p.cg).length < 2) add('warn', nm, '전우조인데 짝이 없음'); }")
cut("  if (!ld.length && S0.some(p => p.sq === 'B')) add(", "  return out;\n}\nfunction auditGroup", "")
rep("  if (ld.length > 1) add('bad', ld.map(p => p.name).join(' · '), '2편대장이 둘 넘음 — 하나만');", "  if (ld.length > 1) add('bad', ld.map(p => p.name).join(' · '), '공식 부대장이 둘 넘음 — 하나만');")
# ----- 로그 · 서술
rep("      case 'sqJoin': out.push(", """      case 'cgOn': out.push(`${T(e)}🤝 전우조 — ${e.ids.map(n).join(' · ')}`); break;   // v9.1
      case 'cgOff': out.push(`${T(e)}🤝 전우조 풀림 — ${e.ids.map(n).join(' · ')}`); break;
      case 'chiefOn': out.push(`${T(e)}🎖 대장 ${n(e.b)} ← 부하 ${e.ids.map(n).join(' · ')}`); break;
      case 'chiefOff': out.push(`${T(e)}🎖 대장-부하 풀림 — ${e.ids.map(n).join(' · ')}`); break;
      case 'mateRescue': out.push(`${T(e)}🛟 ${n(e.a)} — 위급한 전우 ${n(e.v)}을(를) 노리는 ${n(e.b)}에게 달려듦`); break;
      case 'sqJoin': out.push(""")
rep("    case 'sqJoin': return { c: 'dim'", """    case 'cgOn': return { c: 'dim', s: `${e.ids.map(n).join(' · ')}, 서로 등을 맡기기로 한다.` };   // v9.1
    case 'cgOff': return { c: 'dim', s: `${e.ids.map(n).join(' · ')}, 각자 제 길로 선다.` };
    case 'chiefOn': return { c: 'dim', s: `${e.ids.map(n).join(' · ')} — ${n(e.b)}의 말을 따르기로 한다.` };
    case 'chiefOff': return { c: 'dim', s: `${e.ids.map(n).join(' · ')} — 대장의 곁을 떠난다.` };
    case 'mateRescue': return { c: 'good', s: `${ga(n(e.a))} 쓰러져 가는 ${n(e.v)} 곁으로 달려든다 — "${n(e.b)}!"` };
    case 'sqJoin': return { c: 'dim'""")
open(F, 'w', encoding='utf-8').write(s)
print('page9010 OK')
