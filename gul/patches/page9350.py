# v9.11.0 페이지 — page9350.py v1.0 (v1.0: 버전 v9.11.0 · 엔진 patch9300 · 지휘관 임명 단추 (0초에만) · ⚜ 표시 · 빼꼼 (총안) 표시 · 던진 창은 손에서 사라지고 장비 칸에 '던짐' · 훈련장 동료 뽑기 없앰)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9340.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.10.1 (2026-10-28)', '<!-- 굴의 전투판 v9.11.0 (2026-10-28)')
rep('     v9.10.1: 움직임 점검', '''     v9.11.0: 빼꼼은 맞닿은 전열 등 뒤에서만 (총안 표시) · 몸 사이 좁은 틈으로 못 쏨 · 보호받을이 사수는 서둘러 대장 등 뒤로 · 사수는 돌아 들어가지 않고 바로 쫓음 · 지휘관 임명 (0초 · ⚜) · 던진 창 표시 · 전리품에 제 것 · 훈련장 동료 뽑기 없앰
     v9.10.1: 움직임 점검''')
for a, b in (('h1::after{content:" v9.10.1"', 'h1::after{content:" v9.11.0"'), ('<footer>굴의 전투판 v9.10.1', '<footer>굴의 전투판 v9.11.0'), ('return `굴의 전투판 v9.10.1 · ${title}', 'return `굴의 전투판 v9.11.0 · ${title}'),
             ("copyText('굴의 전투판 v9.10.1 자동 판 기록", "copyText('굴의 전투판 v9.11.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.10.1 — ${C.run", "o.push(`굴의 전투판 v9.11.0 — ${C.run"),
             ('의 버전 기록에 — v9.10.1 움직임 점검', '의 버전 기록에 — v9.11.0 빼꼼 · 지휘관 임명 / v9.10.1 움직임 점검'),
             ('">v9.10.1 비비지 않는', '">v9.11.0 총안 (빼꼼) · 지휘관 임명 ⚜ · 던진 창 · v9.10.1 비비지 않는'),
             ("ver: '9.10.1', kind:", "ver: '9.11.0', kind:"), ("RULES_MIG = '9.10.1',", "RULES_MIG = '9.11.0',")):
    rep(a, b)
# 던진 창: 손에서 사라짐 · 장비 칸
rep("function wpIcon(Wd, u){ const n = u.weapon || '';", "function wpIcon(Wd, u){ const n = (u.jav && !u.spearHeld) || u.weaponGone ? (u.weaponNow && u.weaponNow !== u.weapon ? u.weaponNow : '맨손') : u.weapon || '';   /* v9.11.0 던진 창 · 놓친 무기는 손에 그리지 않음 */")
rep("if (u.weaponGone) return { k: 'none', label: '맨손 (' + u.weapon + ' 놓침)' };", "if (u.weaponGone) return { k: 'none', label: '맨손 (' + u.weapon + ' 놓침)' }; if (u.jav && !u.spearHeld) return { k: 'none', label: (u.javSide && u.weaponNow === u.javSide ? u.javSide : '맨손') + ' (' + (u.wName || u.weapon) + ' 던짐 — 땅에 · 주우면 다시 · 판이 끝나면 저절로 돌아옴)' };   /* v9.11.0 */")
# 훈련장 동료 뽑기 없앰
rep('<div class="box draft" id="draftBox"></div>', '<div class="box draft" id="draftBox" hidden></div>')
rep("function renderDraft(){\n  const D = S.draft, box = $('draftBox');", "function renderDraft(){\n  const D = S.draft, box = $('draftBox'); box.innerHTML = ''; box.hidden = true; if (D) D.done = true; return;   /* v9.11.0 훈련장 동료 뽑기 없앰 (배치는 도감 붓 · 설계로) */")
rep("  if (!S.draft.done){ toast('먼저 배치 탭의 동료 뽑기에서 2명을 고르세요'); return false; }\n", "")
rep("(S.draft.done ? 'fight' : 'place')", "('fight')", 2)
# 지휘관 임명
rep("if (k === 'mate' || k === 'chief' || k === 'relcut' || k === 'prot'){ relKey(k); return; }   // v9.1 전우조 · 대장", "if (k === 'hat'){ hatKey(); return; }   /* v9.11.0 지휘관 임명 */\n  if (k === 'mate' || k === 'chief' || k === 'relcut' || k === 'prot'){ relKey(k); return; }   // v9.1 전우조 · 대장")
rep("<span class=\"sb\">${relCount(Wd, L)}개</span></button>` : ''}", "<span class=\"sb\">${relCount(Wd, L)}개</span></button>` : ''}${L.length === 1 && L[0].side === 0 && Wd.t < 0.001 ? `<button type=\"button\" class=\"sk cmd rel${L[0].cmdHat ? ' on' : ''}\" data-cmd=\"hat\" title=\"지휘관 임명 — 싸움을 시작하기 전 (0초) 에 한 번. 이 판의 지휘 (진형 · 교전 판단 · 지휘망의 중심) 를 맡김 · 지휘 재능이 없으면 기본 (C) · 다음 판에도 먼저 세움\"><span class=\"ic\">⚜</span><span class=\"nm\">지휘관</span><span class=\"sb\">${L[0].cmdHat ? '임명됨' : '임명'}</span></button>` : ''}")
rep("function relKey(k){", """function hatKey(){ const Wd = world; if (!Wd) return; const L = selUnits(Wd).filter(u => u.side === 0 && u.alive);   /* v9.11.0 지휘관 임명 — 0초에만 */
  if (L.length !== 1){ toast('지휘관으로 세울 아군 한 명을 고르세요'); return; }
  if (Wd.t > 0.001){ const c = Wd.units.filter(u => u.side === 0 && u.alive && u.cmd).sort(cmdSort)[0]; toast('지휘관은 싸움을 시작하기 전 (0초) 에만 정해요' + (c ? ' — 지금 지휘: ' + c.name : '')); return; }
  appointCmdr(Wd, L[0]); S.cmdHat = L[0].pid; save(); toast('⚜ ' + L[0].name + ' — 지휘관 (이 판의 지휘 · 다음 판도 먼저 세움)'); hud(); }
function relKey(k){""")
rep("for (const u of Wd.units) if (u.side === 0 && u.torch && !u.torchOff){ u.torchOff = true; } computeLight(Wd);", "for (const u of Wd.units) if (u.side === 0 && u.torch && !u.torchOff){ u.torchOff = true; } computeLight(Wd);\n  if (S.cmdHat){ const h = Wd.units.find(x => x.pid === S.cmdHat && x.side === 0 && x.alive); if (h) appointCmdr(Wd, h); }   /* v9.11.0 지난 판의 지휘관을 먼저 세움 (0초에 바꿀 수 있음) */")
rep("const b = Wd.units.filter(u => u.side === e.side && u.cmd && (u.alive || u.down)).sort((a, c) => c.cmd - a.cmd)[0];", "const b = Wd.units.filter(u => u.side === e.side && u.cmd && (u.alive || u.down)).sort(cmdSort)[0];")
rep("      case 'hitCover': out.push(", "      case 'cmdHat': out.push(`${T(e)}⚜ 지휘관 임명 — ${n(e.a)} (지휘 ${['', 'C', 'B', 'A', 'S'][e.c] || e.c})`); break;   /* v9.11.0 */\n      case 'hitCover': out.push(")
rep("    case 'hitCover': return {", "    case 'cmdHat': return { c: '', s: `${ga(n(e.a))} 지휘를 맡는다.` };   /* v9.11.0 */\n    case 'hitCover': return {")
# ⚜ · 총안 표시
rep("ctx.globalAlpha = vis ? 1 : 0.42; weaponMark2(Wd, u, ox, oy, ts, ic); ctx.globalAlpha = 1; }", """ctx.globalAlpha = vis ? 1 : 0.42; weaponMark2(Wd, u, ox, oy, ts, ic); ctx.globalAlpha = 1; }
  if (!ed) for (const u of Wd.units){ if (!u.alive || hid0(u)) continue; const vis = u.side === 0 || u.seenBy; if (!vis && !see) continue; const x = ox + u.x * ts, y = oy + u.y * ts, r = u.r * ts;   /* v9.11.0 ⚜ 지휘관 · 총안 (빼꼼) */
    if (u.cmdHat){ ctx.save(); ctx.globalAlpha = vis ? 1 : 0.5; ctx.font = `700 ${Math.max(11, Math.round(ts * 0.42))}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(20,16,8,.85)'; ctx.strokeText('⚜', x - r * 0.95, y - r * 0.95); ctx.fillStyle = '#ffd76a'; ctx.fillText('⚜', x - r * 0.95, y - r * 0.95); ctx.restore(); }
    const B = isFar(u) ? peekState(Wd, u) : null; if (!B) continue;
    const a = Math.atan2(B.y - u.y, B.x - u.x), cx = x + Math.cos(a) * r * 1.02, cy = y + Math.sin(a) * r * 1.02, nx = -Math.sin(a), ny = Math.cos(a), w = r * 0.8;
    ctx.save(); ctx.globalAlpha = vis ? 0.95 : 0.5; ctx.strokeStyle = '#ffb347'; ctx.lineWidth = Math.max(2, ts * 0.08); ctx.beginPath(); ctx.moveTo(cx + nx * w, cy + ny * w); ctx.lineTo(cx + nx * w * 0.35, cy + ny * w * 0.35); ctx.moveTo(cx - nx * w * 0.35, cy - ny * w * 0.35); ctx.lineTo(cx - nx * w, cy - ny * w); ctx.stroke();
    if (ts >= 14){ ctx.font = '700 9.5px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(20,14,6,.85)'; ctx.strokeText('총안', x, y + r + 11); ctx.fillStyle = '#ffcf8a'; ctx.fillText('총안', x, y + r + 11); }
    ctx.restore(); }""")
open(F, 'w', encoding='utf-8').write(s)
print('page9350 OK')
