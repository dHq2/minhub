# v9.7.4 페이지 — page9190.py v1.1 (v1.1: hid0 를 함수 안에 / v1.0: 판 위 겹쳐 보기 토글 4개 (리모델 3.5) — 🧱 전열 (닿은 몸끼리 굵은 선 · 실제 버팀 배율) · 🎯 사선 (고른 사수 → 아는 적: 트임 초록 · 제 편이 끼면 주황 · 막힘 회색 점선) · 💨 돌격 (달리는 돌격의 길 · 첫 접촉 = 무기 / 몸) · 👁 감각 (아군이 마지막으로 안 적의 자리 — 점선 원 · 몇 초 전) · 이 브라우저에 기억)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9180.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.7.3 (2026-10-25)', '<!-- 굴의 전투판 v9.7.4 (2026-10-25)')
rep('     v9.7.3: 공격돌격 / 방어돌격 시험판', '''     v9.7.4: 겹쳐 보기 (판 위 가운데 단추) — 🧱 전열 (닿은 몸 · 실제 버팀 배율) · 🎯 사선 (고른 사수의 트임 · 제 편 · 막힘) · 💨 돌격 (돌격 길 · 첫 접촉) · 👁 감각 (아군이 마지막으로 안 적의 자리)
     v9.7.3: 공격돌격 / 방어돌격 시험판''')
for a, b in (('h1::after{content:" v9.7.3"', 'h1::after{content:" v9.7.4"'), ('<footer>굴의 전투판 v9.7.3', '<footer>굴의 전투판 v9.7.4'), ('return `굴의 전투판 v9.7.3 · ${title}', 'return `굴의 전투판 v9.7.4 · ${title}'),
             ("copyText('굴의 전투판 v9.7.3 자동 판 기록", "copyText('굴의 전투판 v9.7.4 자동 판 기록"), ("o.push(`굴의 전투판 v9.7.3 — ${C.run", "o.push(`굴의 전투판 v9.7.4 — ${C.run"),
             ('의 버전 기록에 — v9.7.3 공격돌격', '의 버전 기록에 — v9.7.4 겹쳐 보기 (전열 · 사선 · 돌격 · 감각) / v9.7.3 공격돌격'),
             ('">v9.7.3 시험판 · 돌격 방식 (기본 · 공격 · 방어) · 🧱 뭉침 (돌격 방어) · 버팀은 닿은 몸만 · 지금 하는 일 보임</span>', '">v9.7.4 시험판 · 겹쳐 보기 (전열 · 사선 · 돌격 · 감각) · 돌격 방식 · 🧱 뭉침 · 버팀은 닿은 몸만</span>'),
             ("ver: '9.7.3', kind:", "ver: '9.7.4', kind:"), ("RULES_MIG = '9.7.3',", "RULES_MIG = '9.7.4',")):
    rep(a, b)
rep('        <div class="ovl" id="ovl"></div>', '        <div class="ovl" id="ovl"></div>\n        <div class="ovtog" id="ovTog" role="group" aria-label="겹쳐 보기"></div>')
rep(".row.sst{", """.ovtog{position:absolute;left:50%;top:6px;transform:translateX(-50%);display:flex;gap:4px;z-index:4}
.ovtog button{font:600 11.5px var(--mono),monospace;color:#d8cfc0;background:rgba(12,10,16,.72);border:1px solid rgba(216,207,192,.25);border-radius:6px;padding:3px 8px;cursor:pointer}
.ovtog button.on{color:#14110c;background:#e8c46a;border-color:#e8c46a}
body.mob .ovtog button{font-size:10px;padding:2px 6px}
.row.sst{""")
rep("""  for (const u of Wd.units){ if (!u.alive || hid0(u)) continue; const ic = wpIcon(Wd, u); if (!ic) continue; const vis = u.side === 0 || ed || u.seenBy; if (!vis && !see) continue;
    ctx.globalAlpha = vis ? 1 : 0.42; weaponMark(ox + u.x * ts, oy + u.y * ts, u.r * ts, u.face || 0, ic, SIDEC[u.side]); ctx.globalAlpha = 1; }""",
"""  for (const u of Wd.units){ if (!u.alive || hid0(u)) continue; const ic = wpIcon(Wd, u); if (!ic) continue; const vis = u.side === 0 || ed || u.seenBy; if (!vis && !see) continue;
    ctx.globalAlpha = vis ? 1 : 0.42; weaponMark(ox + u.x * ts, oy + u.y * ts, u.r * ts, u.face || 0, ic, SIDEC[u.side]); ctx.globalAlpha = 1; }
  if (!ed) drawOvl(Wd, ox, oy, ts, see);   /* v9.7.4 겹쳐 보기 */""")
rep("// v9.7.0 든 무기 → 그림", r"""// v9.7.4 겹쳐 보기 (리모델 3.5): 켠 것만 그림 — 적 정보는 아군이 아는 만큼 (모두 보기면 다)
const OVL = (() => { const d = { line: false, lane: false, chg: false, sense: false }; try { return Object.assign(d, JSON.parse(localStorage.getItem('gulOvl') || '{}')); } catch (e){ return d; } })();
const OVL_NM = [['line', '🧱 전열', '닿은 몸끼리 굵은 선 · 실제로 계산된 버팀 배율 (적 쪽을 볼 때)'], ['lane', '🎯 사선', '고른 사수 (없으면 모든 아군 사수) → 아는 적: 초록 = 트임 · 주황 = 제 편이 사선에 (오사 위험) · 회색 점선 = 다른 몸 · 방패에 막힘'], ['chg', '💨 돌격', '달리는 돌격의 길과 첫 접촉 (무기 / 몸)'], ['sense', '👁 감각', '지금은 안 보이지만 아군이 마지막으로 안 적의 자리 (점선 · 몇 초 전)']];
function renderOvTog(){ const el = $('ovTog'); if (!el) return; el.innerHTML = OVL_NM.map(([k, nm, tt]) => `<button type="button" class="${OVL[k] ? 'on' : ''}" data-ovl="${k}" title="${tt}">${nm}</button>`).join(''); }
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-ovl]'); if (!b) return; const k = b.dataset.ovl; OVL[k] = !OVL[k]; try { localStorage.setItem('gulOvl', JSON.stringify(OVL)); } catch (er){} renderOvTog(); if (typeof draw === 'function') draw(); });
setTimeout(renderOvTog, 0);
function drawOvl(Wd, ox, oy, ts, see){
  if (!OVL.line && !OVL.lane && !OVL.chg && !OVL.sense) return;
  const hid0 = u => u.side === 0 && !!u.posUnk && !!u.posK && !see;   /* draw 안의 것과 같음 (지휘관이 모르는 아군) */
  const X = x => ox + x * ts, Y = y => oy + y * ts, vis = u => u.side === 0 || see || u.seenBy, live = Wd.units.filter(u => u.alive && !u.down && !hid0(u) && vis(u));
  const tag = (x, y, s, c) => { ctx.font = `700 ${Math.max(10, ts * 0.26)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(s).width + 8, h = Math.max(13, ts * 0.32); ctx.fillStyle = 'rgba(12,10,16,.82)'; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.fillStyle = c; ctx.fillText(s, x, y); };
  ctx.save();
  if (OVL.line){
    ctx.lineCap = 'round';
    for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++){ const a = live[i], b = live[j]; if (a.side !== b.side) continue; const g = Math.hypot(a.x - b.x, a.y - b.y) - a.r - b.r; if (g > 0.2) continue;
      ctx.strokeStyle = SIDEC[a.side]; ctx.globalAlpha = 0.85; ctx.lineWidth = Math.max(3, ts * 0.12); ctx.beginPath(); ctx.moveTo(X(a.x), Y(a.y)); ctx.lineTo(X(b.x), Y(b.y)); ctx.stroke(); }
    ctx.globalAlpha = 1;
    for (const u of live){ if (isFar(u)) continue; const f = Wd.units.filter(e => e.alive && !e.down && e.side !== u.side && vis(e) && Math.hypot(e.x - u.x, e.y - u.y) < 6).sort((p, q) => Math.hypot(p.x - u.x, p.y - u.y) - Math.hypot(q.x - u.x, q.y - u.y))[0]; if (!f) continue;
      const d = Math.hypot(u.x - f.x, u.y - f.y) || 1, br = braceOf(Wd, u, f, (u.x - f.x) / d, (u.y - f.y) / d), m = br.mass / Math.max(1, u.mass * (u.poise || 1));
      if (m > 1.04 || u.line) tag(X(u.x), Y(u.y + u.r + 0.32), `버팀 ×${m.toFixed(1)}`, m >= 1.5 ? '#9fe0a8' : m > 1.04 ? '#e8c46a' : '#c9b9a6'); } }
  if (OVL.lane){
    const L0 = selUnits(Wd).filter(u => u.side === 0 && isFar(u)), S = (L0.length ? L0 : Wd.units.filter(u => u.side === 0 && u.alive && !u.down && isFar(u)));
    for (const s of S) for (const f of Wd.units){ if (!f.alive || f.down || f.side === 0 || !vis(f) || Math.hypot(f.x - s.x, f.y - s.y) > s.rng + 1) continue;
      const B = lineBodies(Wd, s, f, s), fb = B.length ? B[0][1] : null, wall = !losClear(Wd.map, s.x, s.y, f.x, f.y);
      const c = wall ? '#7d7466' : !fb ? '#5fd08a' : fb.side === s.side ? '#f0a040' : '#9a9184'; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.globalAlpha = 0.85; ctx.setLineDash(wall || (fb && fb.side !== s.side) ? [5, 5] : []);
      ctx.beginPath(); ctx.moveTo(X(s.x), Y(s.y)); ctx.lineTo(X(f.x), Y(f.y)); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      if (fb && fb.side === s.side) tag(X(fb.x), Y(fb.y - fb.r - 0.3), '⚠ 오사', '#f0a040'); } }
  if (OVL.chg){
    for (const u of Wd.units){ if (!u.alive || !u.act || u.act.k !== 'charge' || !vis(u)) continue; const t = u.act.b != null ? Wd.units[u.act.b] : null, tx = t && t.alive ? t.x : u.act.px, ty = t && t.alive ? t.y : u.act.py; if (tx == null) continue;
      ctx.strokeStyle = u.side === 0 ? '#7cc4ff' : '#ff6a5a'; ctx.lineWidth = Math.max(3, ts * 0.1); ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(X(u.x), Y(u.y)); ctx.lineTo(X(tx), Y(ty)); ctx.stroke();
      const a = Math.atan2(ty - u.y, tx - u.x), hx = X(tx) - Math.cos(a) * ts * 0.45, hy = Y(ty) - Math.sin(a) * ts * 0.45; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - Math.cos(a - 0.5) * ts * 0.3, hy - Math.sin(a - 0.5) * ts * 0.3); ctx.lineTo(hx - Math.cos(a + 0.5) * ts * 0.3, hy - Math.sin(a + 0.5) * ts * 0.3); ctx.closePath(); ctx.fillStyle = ctx.strokeStyle; ctx.fill(); ctx.globalAlpha = 1;
      const md = u.act.mode || u.chgMode; tag((X(u.x) + X(tx)) / 2, (Y(u.y) + Y(ty)) / 2 - ts * 0.3, md === 'atk' ? '첫 접촉: 무기' : md === 'def' ? '첫 접촉: 몸 · 방패' : '첫 접촉: 몸', u.side === 0 ? '#7cc4ff' : '#ff8a7a'); } }
  if (OVL.sense){
    for (const f of Wd.units){ if (!f.alive || f.side === 0 || f.seenBy || f.gone) continue; let best = null;
      for (const a of Wd.units){ if (a.side !== 0 || !a.alive || !a.sense) continue; const k = a.sense[f.i]; if (k && (!best || k.t > best.t)) best = k; }
      if (!best || Wd.t - best.t > 30) continue; const age = Math.max(0, Wd.t - best.t);
      ctx.strokeStyle = '#c9b9a6'; ctx.globalAlpha = Math.max(0.35, 1 - age / 30); ctx.lineWidth = 1.6; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(X(best.x), Y(best.y), Math.max(8, f.r * ts * 1.1), 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      tag(X(best.x), Y(best.y), `? ${age < 1 ? '방금' : Math.round(age) + '초 전'}`, '#c9b9a6'); ctx.globalAlpha = 1; } }
  ctx.restore();
}
// v9.7.0 든 무기 → 그림""")
open(F, 'w', encoding='utf-8').write(s)
print('page9190 OK')
