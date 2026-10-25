# v9.7.0 페이지 — page9150.py v1.2 (v1.2: 검 · 단검은 글꼴 대신 직접 그림 (흐리게 보이던 것) / v1.1: 무기 그림 바탕을 밝은 양피지색으로 (검은 칼이 안 보이던 것) · 거구 맨손은 👊 / v1.0: 리모델 P0 UI 1단계: 판 위 무기 그림 (방패 반대 손 · 바라보는 쪽) · 명령 칸 층 나눔 (핵심 / 전술 / 고급 접기) · 횃불 단추 숨김 (단축키는 그대로) · 고른 아군 상태 줄 · 일행 상한 12 없앰)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9140.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# --- 버전
rep('<!-- 굴의 전투판 v9.6.5 (2026-10-24)', '<!-- 굴의 전투판 v9.7.0 (2026-10-25)')
rep('     v9.6.5: 전우조는 한 몸처럼', '''     v9.7.0: 리모델 시험판 UI 1단계 — 판 위 무기 그림 (방패 반대 손 · 바라보는 쪽) · 명령 칸을 핵심 / 전술 / 고급으로 (접기) · 횃불 단추 숨김 (T · I 단축키는 그대로) · 고른 아군 상태 줄 (체력 · 숨 · 자세 · 막기 · 태세) · 일행 상한 없앰
     v9.6.5: 전우조는 한 몸처럼''')
for a, b in (('h1::after{content:" v9.6.5"', 'h1::after{content:" v9.7.0"'), ('<footer>굴의 전투판 v9.6.5', '<footer>굴의 전투판 v9.7.0'), ('return `굴의 전투판 v9.6.5 · ${title}', 'return `굴의 전투판 v9.7.0 · ${title}'),
             ("copyText('굴의 전투판 v9.6.5 자동 판 기록", "copyText('굴의 전투판 v9.7.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.6.5 — ${C.run", "o.push(`굴의 전투판 v9.7.0 — ${C.run"),
             ('의 버전 기록에 — v9.6.5 전우조는', '의 버전 기록에 — v9.7.0 시험판 UI (무기 그림 · 명령 칸 정리) / v9.6.5 전우조는'),
             ('">v9.6.5 · 전우조는 한 몸처럼 (1 ~ 1.5칸 · 연동) · 돌격하면 옆구리로 · 두 번 눌러 서둘러 줍기</span>', '">v9.7.0 시험판 · 판 위 무기 그림 · 명령 칸 정리 (핵심 / 전술 / 고급) · 일행 상한 없음</span>'),
             ("ver: '9.6.5', kind:", "ver: '9.7.0', kind:"), ("RULES_MIG = '9.6.5',", "RULES_MIG = '9.7.0',")):
    rep(a, b)

# --- 1. 판 위 무기 그림: 방패 (왼손 fa - 0.75) 반대쪽 오른손 (fa + 0.75)
rep("""    ctx.globalAlpha = vis ? 1 : 0.42; shieldMark(ox + u.x * ts, oy + u.y * ts, u.r * ts, u.face || 0, !ed && guardOn(Wd, u), !ed && Wd.t < u.brokenT, SIDEC[u.side]); ctx.globalAlpha = 1; }""",
"""    ctx.globalAlpha = vis ? 1 : 0.42; shieldMark(ox + u.x * ts, oy + u.y * ts, u.r * ts, u.face || 0, !ed && guardOn(Wd, u), !ed && Wd.t < u.brokenT, SIDEC[u.side]); ctx.globalAlpha = 1; }
  // v9.7.0 무기 그림: 든 무기를 오른손 (바라보는 쪽) 에 — 병종 · 지금 무기를 판에서 바로
  for (const u of Wd.units){ if (!u.alive || hid0(u)) continue; const ic = wpIcon(Wd, u); if (!ic) continue; const vis = u.side === 0 || ed || u.seenBy; if (!vis && !see) continue;
    ctx.globalAlpha = vis ? 1 : 0.42; weaponMark(ox + u.x * ts, oy + u.y * ts, u.r * ts, u.face || 0, ic, SIDEC[u.side]); ctx.globalAlpha = 1; }""")
rep("function shieldMark(x, y, r, fa, on, broke, sc){", """// v9.7.0 든 무기 → 그림 (맨손 · 이빨 · 발톱은 그리지 않음)
function wpIcon(Wd, u){ const n = u.weapon || ''; if (!n || n === '맨손') return u.canSweep ? '👊' : null; const w = (Wd.rules.weapons || {})[n] || {}, k = w.kind || '';
  if (k === '맨손') return u.canSweep ? '👊' : null; if (k === '짐승') return null; if (k === '활') return '🏹'; if (k === '총포류') return '🔫'; if (k === '마법') return '🪄'; if (k === '둔기') return '🔨';
  if (w.axe || /도끼$/.test(n)) return '🪓'; if (/단검$|나이프$|칼$/.test(n)) return '🔪'; if (/창$/.test(n) || (w.rng || 0) >= 1.4) return '🔱'; return '🗡'; }
function weaponMark(x, y, r, fa, ic, sc){
  const a = fa + 0.75, s = Math.max(10, r * 0.78), cx = x + Math.cos(a) * r * 1.02, cy = y + Math.sin(a) * r * 1.02;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, s * 0.62, 0, 6.283); ctx.fillStyle = 'rgba(236,229,214,.94)'; ctx.fill(); ctx.lineWidth = Math.max(1.2, s * 0.12); ctx.strokeStyle = sc; ctx.stroke();
  if (ic === '🗡' || ic === '🔪'){ const L = s * (ic === '🗡' ? 0.5 : 0.36); ctx.translate(cx, cy); ctx.rotate(-0.785);   // 칼은 글꼴마다 흐려서 직접 그림 (검 · 단검)
    ctx.lineCap = 'round'; ctx.strokeStyle = '#2a2026'; ctx.lineWidth = Math.max(3, s * 0.2); ctx.beginPath(); ctx.moveTo(-L * 0.55, L * 0.55); ctx.lineTo(L * 0.62, -L * 0.62); ctx.stroke();
    ctx.strokeStyle = '#b9c3cf'; ctx.lineWidth = Math.max(1.6, s * 0.1); ctx.beginPath(); ctx.moveTo(-L * 0.2, L * 0.2); ctx.lineTo(L * 0.62, -L * 0.62); ctx.stroke();
    ctx.strokeStyle = '#7a4a22'; ctx.lineWidth = Math.max(2, s * 0.13); ctx.beginPath(); ctx.moveTo(-L * 0.55, L * 0.55); ctx.lineTo(-L * 0.25, L * 0.25); ctx.stroke();
    ctx.strokeStyle = '#2a2026'; ctx.lineWidth = Math.max(1.8, s * 0.11); ctx.beginPath(); ctx.moveTo(-L * 0.45, -L * 0.05); ctx.lineTo(L * 0.05, L * 0.45); ctx.stroke(); ctx.restore(); return; }
  ctx.font = `${Math.round(s * 0.82)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ic, cx, cy + s * 0.04); ctx.restore();
}
function shieldMark(x, y, r, fa, on, broke, sc){""")

# --- 2. 명령 칸 층 나눔
row0 = s[s.index('    <div class="row"><button class="btn" type="button" data-ord="auto"'):]
row0 = row0[:row0.index('</div>\n') + 7]
body = row0[len('    <div class="row">'):-len('</div>\n')]
marks = ['<button class="btn" type="button" data-ord="auto"', '<button class="btn" type="button" data-ord="hold"', '<button class="btn" type="button" data-ord="scout"', '<button class="btn" type="button" data-ord="assn"',
         '<button class="btn" type="button" data-ord="supp"', '<button class="btn" type="button" data-ord="area"', '<button class="btn" type="button" data-ord="watch"', '<button class="btn" type="button" data-ord="flare"',
         '<button class="btn ${L.every(u => u.stealth)', '<button class="btn ${L.length && L.every(u => u.lie)', '<button class="btn ${detourArm', '<button class="btn" type="button" data-ord="torchT"',
         '${L.some(u => lretLine(Wd, u))', '<button class="btn" type="button" data-ord="cancel"', '${L.some(u => u.hero) ? `<button class="btn" type="button" data-ord="torch">', '${L.some(u => u.jav && !u.spearHeld && mySpear(Wd, u)) ?',
         '${L.some(u => u.canSweep)', '<button class="btn ${amovePick', '<button class="btn" type="button" data-ord="line"', '${L.some(u => u.canGuard)', '<button class="btn" type="button" data-ord="all">', '<button class="btn" type="button" data-ord="none">']
idx = [body.index(m) for m in marks]
assert idx == sorted(idx) and idx[0] == 0, idx
P = {}
names = ['auto', 'hold', 'scout', 'assn', 'supp', 'area', 'watch', 'flare', 'stealth', 'lie', 'detour', 'torchT', 'lret', 'cancel', 'torch', 'pick', 'swing', 'amove', 'line', 'guard', 'all', 'none']
for j, nm in enumerate(names):
    P[nm] = body[idx[j]: idx[j + 1] if j + 1 < len(idx) else len(body)]
assert ''.join(P[n] for n in names) == body
# 태세 줄 끝의 squad · resend · flank · sac · boxsel 을 떼어 전술 / 고급으로
pr = s[s.index('    <div class="row postures"'):]
pr = pr[:pr.index('</div>\n') + 7]
k1 = pr.index("${(() => { const Dp = deputyOf(Wd, 0)")
k2 = pr.index("${(Wd.units.some(u => u.side === 0 && u.alive && u.missT != null && u.missO))")
k3 = pr.index('<button class="btn ${armed && armed.k === \'flank\'')
k4 = pr.index('<button class="btn" type="button" data-ord="sac"')
k5 = pr.index('<button class="btn ${boxArm')
k6 = pr.rindex('</div>')
squad, resend, flank, sac, boxsel = pr[k1:k2], pr[k2:k3], pr[k3:k4], pr[k4:k5], pr[k5:k6]
pr2 = pr[:k1] + pr[k6:]
def grp(g, lab, inner):
    return '    <div class="row ogrp"><button class="btn ghd ${ordGrp.%s ? \'on\' : \'\'}" type="button" data-ord="grp:%s">${ordGrp.%s ? \'▾\' : \'▸\'} %s</button>${ordGrp.%s ? `%s` : \'\'}</div>\n' % (g, g, g, lab, g, inner)
core = '    <div class="row core"><span class="lbl">핵심</span>' + P['amove'] + P['guard'] + P['line'] + P['hold'] + P['auto'] + P['cancel'] + P['pick'] + P['swing'] + resend + '</div>\n'
tac = grp('tac', '전술', P['scout'] + P['assn'] + P['supp'] + P['area'] + P['watch'] + flank + P['lret'] + P['stealth'] + P['lie'] + P['detour'] + squad + sac)
adv = grp('adv', '고르기 · 그 밖', P['all'] + P['none'] + boxsel)
# 횃불 단추 (torchT · torch · flare) 는 그리지 않음 — T · Shift+T · I 단축키는 그대로
rep(row0, core)
rep(pr, pr2 + tac + adv)
# 상태 줄 (한 명 고를 때)
rep("""    ${relRowHtml(Wd, L)}
    <div class="row core">""", """    ${L.length === 1 ? selStateHtml(Wd, L[0]) : ''}
    ${relRowHtml(Wd, L)}
    <div class="row core">""")
rep("function renderOrders0(Wd){", """// v9.7.0 명령 칸 접기 (전술 · 고급) — 이 브라우저에만 기억
const ordGrp = (() => { try { return Object.assign({ tac: false, adv: false }, JSON.parse(localStorage.getItem('gulOrdGrp') || '{}')); } catch (e){ return { tac: false, adv: false }; } })();
// v9.7.0 고른 아군 상태 줄 (읽기 전용): 체력 · 숨 · 자세 · 막기 · 태세 · 돌격 안 함
function selStateHtml(Wd, u){
  const q = v => Math.round(v / 5) * 5, g = [];
  g.push(`❤ ${Math.max(0, Math.round(u.hp))}/${Math.round(u.max)}`);
  if (u.sta != null) g.push(`<span title="숨 (기력) — 뛰면 줄고 쉬면 참">💨 숨 ${q(u.sta)}${u.winded ? ' (헐떡임)' : ''}</span>`);
  if (u.canGuard) g.push(`<span title="자세 — 막을 때마다 깎이고 0이면 막기가 깨짐">🛡 자세 ${q(u.post)}${Wd.t < u.brokenT ? ' (깨짐)' : ''}</span>`, `<span title="막기">막기 ${GM_SHORT[u.guardMode || 'auto']}${guardOn(Wd, u) ? ' · 들었음' : ''}</span>`);
  g.push(`<span title="교전 규칙">${ROE_IC[roeOf(Wd, u)]} ${ROE_NM[roeOf(Wd, u)]}</span>`);
  if (u.canCharge && u.noChg) g.push('🚫 돌격 안 함');
  if (u.lie) g.push('🦎 포복'); if (u.stealth) g.push('🥷 은신');
  return `<div class="row sst">${g.join(' · ')}</div>`;
}
function renderOrders0(Wd){""")
rep("  if (k === 'none'){ sel = new Set(); hud(); return; }\n  if (world.over) return;", "  if (k === 'none'){ sel = new Set(); hud(); return; }\n  if (k.startsWith('grp:')){ const g = k.slice(4); ordGrp[g] = !ordGrp[g]; try { localStorage.setItem('gulOrdGrp', JSON.stringify(ordGrp)); } catch (e){} hud(); return; }   // v9.7.0 접기 (판이 끝나도)\n  if (world.over) return;")
rep(".row.postures .lbl{align-self:center;font-size:11px;color:var(--dim);margin-right:4px}", """.row.postures .lbl{align-self:center;font-size:11px;color:var(--dim);margin-right:4px}
.row.core .lbl{align-self:center;font-size:11px;color:var(--accent);margin-right:4px;font-weight:700}
.row.ogrp .ghd{font-weight:700;color:var(--dim)} .row.ogrp .ghd.on{color:var(--accent)}
.row.sst{font-size:12px;color:var(--dim);gap:4px 6px;padding:2px 0}""")

# --- 3. 일행 상한 없앰
rep("const R8 = { cap: 12,", "const R8 = { cap: Infinity,   /* v9.7.0 일행 상한 없앰 (옛 12) */")
rep("<span>동료 <b>${R.party.length}</b>/${R8.cap}</span>", "<span>동료 <b>${R.party.length}</b></span>")
rep("<div class=\"r8sub\">최대 ${R8.cap}명. 떠나보낸 동료는 돌아오지 않아요.</div>", "<div class=\"r8sub\">떠나보낸 동료는 돌아오지 않아요.</div>")
open(F, 'w', encoding='utf-8').write(s)
print('page9150 OK')
