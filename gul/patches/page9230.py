# v9.8.2 페이지 — page9230.py v1.0 (v1.0: 역장 그림 새로 — 방패 앞 보랏빛 직사각형 장벽 · 시간 게이지 (흰) · 내구 게이지 (보라) · 깎이면 흔들림 / 화살비 그림 — 쏜 이 위로 화살 하나가 솟음 · 붉은 원 예고 (남은 시간이 차오름) · 떨어지는 동안 점선 / 로그 글 (역장 · 깨짐 · 화살비) · 설명 글 · 엔진 patch9180)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9220.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.8.1 (2026-10-25)', '<!-- 굴의 전투판 v9.8.2 (2026-10-25)')
rep('     v9.8.1: 길찾기 개선', '''     v9.8.2: 암계 역장 새로 (방패 앞 보랏빛 직사각형 장벽 · 6초 · 내구 160 — 막은 탄 · 근접 · 미는 몸만큼 깎이고 0 이면 깨짐 · 곡사는 넘어감) · 화살비 새로 (화살 하나가 솟고 붉은 원 1초 예고 → 10발이 원 안에 1 ~ 2발씩 · 곡사 판정 · 원을 보면 달아남 — 활의 지역사격 · 어둠의 화살비)
     v9.8.1: 길찾기 개선''')
for a, b in (('h1::after{content:" v9.8.1"', 'h1::after{content:" v9.8.2"'), ('<footer>굴의 전투판 v9.8.1', '<footer>굴의 전투판 v9.8.2'), ('return `굴의 전투판 v9.8.1 · ${title}', 'return `굴의 전투판 v9.8.2 · ${title}'),
             ("copyText('굴의 전투판 v9.8.1 자동 판 기록", "copyText('굴의 전투판 v9.8.2 자동 판 기록"), ("o.push(`굴의 전투판 v9.8.1 — ${C.run", "o.push(`굴의 전투판 v9.8.2 — ${C.run"),
             ('의 버전 기록에 — v9.8.1 길찾기 개선', '의 버전 기록에 — v9.8.2 역장 · 화살비 새로 / v9.8.1 길찾기 개선'),
             ('">v9.8.1 길찾기 개선 · 무기 = 사거리 · 세포막 무리 · 돌격 방어 · 판을 깨끗하게</span>', '">v9.8.2 역장 (보랏빛 장벽) · 화살비 (붉은 원) · 길찾기 개선 · 무기 = 사거리 · 세포막</span>'),
             ("ver: '9.8.1', kind:", "ver: '9.8.2', kind:"), ("RULES_MIG = '9.8.1',", "RULES_MIG = '9.8.2',")):
    rep(a, b)
# 역장 그림
i0 = s.index("      if (F.hard){ const nx = F.nx || 0, ny = F.ny || 0;   /* v9.6.0 암계 역장"); i1 = s.index("      else {\n      ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(110,190,255,.35)'", i0)
s = s[:i0] + r"""      if (F.hard){ const nx = F.nx || 0, ny = F.ny || 0, hw = (F.th || 0.8) / 2 * ts, hpF = F.hpMax ? Math.max(0, F.hp / F.hpMax) : 1, tF = Math.max(0, (F.until - now) / Math.max(0.1, F.until - (F.t0 || now)));   /* v9.8.2 보랏빛 직사각형 장벽 · 시간 · 내구 게이지 */
        const sh = now - (F.blkT || -9) < 0.15 ? (Math.random() - 0.5) * 2.5 : 0, P = [[x0 - nx * hw, y0 - ny * hw], [x1 - nx * hw, y1 - ny * hw], [x1 + nx * hw, y1 + ny * hw], [x0 + nx * hw, y0 + ny * hw]].map(([a, b]) => [a + sh, b + sh]);
        ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let k = 1; k < 4; k++) ctx.lineTo(P[k][0], P[k][1]); ctx.closePath();
        ctx.fillStyle = `rgba(150,80,230,${(0.16 + 0.22 * hpF).toFixed(2)})`; ctx.fill(); ctx.strokeStyle = `rgba(200,150,255,${(0.55 + 0.4 * hpF).toFixed(2)})`; ctx.lineWidth = 2.2; ctx.stroke();
        ctx.strokeStyle = 'rgba(235,215,255,.35)'; ctx.lineWidth = 1; const len = Math.hypot(x1 - x0, y1 - y0), nR = Math.max(3, Math.round(len / (ts * 0.7)));
        for (let k = 1; k < nR; k++){ const q = ((k / nR + now * 0.12) % 1), px = x0 + (x1 - x0) * q, py = y0 + (y1 - y0) * q; ctx.beginPath(); ctx.moveTo(px - nx * hw * 0.8, py - ny * hw * 0.8); ctx.lineTo(px + nx * hw * 0.8, py + ny * hw * 0.8); ctx.stroke(); }
        const bx = (x0 + x1) / 2 - nx * (hw + 7), by2 = (y0 + y1) / 2 - ny * (hw + 7), bw = Math.min(len * 0.6, ts * 2.4), ux2 = (x1 - x0) / (len || 1), uy2 = (y1 - y0) / (len || 1);
        const bar = (off, f, col) => { const ax = bx - nx * off - ux2 * bw / 2, ay = by2 - ny * off - uy2 * bw / 2; ctx.lineCap = 'butt'; ctx.strokeStyle = 'rgba(10,8,16,.85)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + ux2 * bw, ay + uy2 * bw); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + ux2 * bw * f, ay + uy2 * bw * f); ctx.stroke(); };
        bar(0, hpF, '#c69cff'); bar(6, tF, '#f0eadc'); }
""" + s[i1:]
rep("const t = `${F.k === 'wall' && F.hard ? '🛡 암계 역장' : SF_NM[F.k] || F.k} ${Math.ceil(left)}초`", "const t = `${F.k === 'wall' && F.hard ? '🛡 역장' + (F.hpMax ? ' ' + Math.ceil(F.hp) + '/' + F.hpMax : '') : SF_NM[F.k] || F.k} ${Math.ceil(left)}초`")
# 화살비 그림 (판 위 · 몸 위)
rep("  if (!ed && Wd.sup8) drawSupWarn(Wd, ox, oy, ts);", "  if (!ed && Wd.sup8) drawSupWarn(Wd, ox, oy, ts);\n  if (!ed && Wd.vol8 && Wd.vol8.length) drawVolley(Wd, ox, oy, ts, $('seeAll').checked);   /* v9.8.2 화살비 */")
rep("function drawSupWarn(Wd, ox, oy, ts){", r"""// v9.8.2 화살비: 쏜 이 위로 솟는 화살 (0.7초) · 붉은 원 예고 (차오르는 띠 = 남은 시간) · 떨어지는 동안 붉은 점선
function drawVolley(Wd, ox, oy, ts, see){
  const now = Wd.t; ctx.save();
  for (const V of Wd.vol8){ const by = Wd.units[V.by], show = V.side === 0 || see || (by && by.seenBy) || Wd.units.some(u => u.side === 0 && u.alive && Math.hypot(u.x - V.x, u.y - V.y) < V.R + 3); if (!show) continue;
    const cx = ox + V.x * ts, cy = oy + V.y * ts, R = V.R * ts;
    if (now - V.t0 < 0.7 && by){ const q = (now - V.t0) / 0.7, ax = ox + V.sx * ts, ay = oy + V.sy * ts - q * ts * 2.2; ctx.globalAlpha = 1 - q; ctx.strokeStyle = '#f0e6d4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay + ts * 0.5); ctx.lineTo(ax, ay); ctx.stroke(); ctx.fillStyle = '#d6dde6'; ctx.beginPath(); ctx.moveTo(ax, ay - 6); ctx.lineTo(ax - 4, ay + 2); ctx.lineTo(ax + 4, ay + 2); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
    if (now < V.at){ const f = Math.max(0, Math.min(1, (now - V.t0) / Math.max(0.1, V.at - V.t0))), pl = 0.5 + 0.5 * Math.sin(now * 14);
      ctx.fillStyle = `rgba(255,50,40,${(0.1 + 0.12 * f).toFixed(2)})`; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();
      ctx.strokeStyle = `rgba(255,70,55,${(0.7 + 0.3 * pl).toFixed(2)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,200,180,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R + 4, -Math.PI / 2, -Math.PI / 2 + 6.283 * f); ctx.stroke(); }
    else { ctx.strokeStyle = 'rgba(255,70,55,.6)'; ctx.lineWidth = 1.6; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); } }
  ctx.restore();
}
function drawSupWarn(Wd, ox, oy, ts){""")
# 로그
rep("      case 'bfield': out.push(`${T(e)}🛡 ${n(e.a)} — 암계 역장 (${e.len}칸 · 3초)`); break;   // v9.2.0", "      case 'bfield': out.push(`${T(e)}🛡 ${n(e.a)} — 역장 (방패 앞 장벽 · ${e.len}칸)`); break;   // v9.2.0\n      case 'bfieldBreak': out.push(`${T(e)}💥 ${n(e.a)}의 역장이 깨짐 (${e.why || ''})`); break;   /* v9.8.2 */\n      case 'volley': out.push(`${T(e)}🏹 ${n(e.a)} — ${e.tag || '화살비'} (붉은 원 · ${e.n}발)`); break;   /* v9.8.2 */")
rep("    case 'bfield': return { c: 'bad', s: `${ga(n(e.a))} 방패를 땅에 박는다 — 보이지 않는 벽이 곧게 펼쳐진다!` };", "    case 'bfield': return { c: 'bad', s: `${ga(n(e.a))} 방패를 땅에 박는다 — 보랏빛 장벽이 앞을 막는다!` };\n    case 'bfieldBreak': return { c: 'good', s: `${n(e.a)}의 역장이 깨진다!` };\n    case 'volley': return { c: 'bad', s: `${ga(n(e.a))} 하늘로 화살을 쏘아 올린다 — 땅에 붉은 원이 번진다!` };")
rep("  '암계 역장': '암계 방패병 (명세 D5) — 앞쪽으로 곧은 선 (5 ~ 7칸) 을 3초 펼침: 상대 편은 선을 못 넘고 (몸이 걸림) · 선 너머 근접 일격은 막히고 · 곧은 탄 (화살 · 총알) 도 막힘. 곡사는 못 막음 · 같은 편은 지나감. 다가오는 근접 적 둘 이상 · 사격 준비하는 적 사수를 보면 스스로 씀. 대기 12초',",
    "  '암계 역장': '암계 방패병 — 방패 바로 앞에 보랏빛 장벽 (길이 5칸 · 두께 0.8칸) 을 6초 세움: 상대 편 몸은 못 넘고 · 근접 일격 · 곧은 탄 (화살 · 총알) 도 막음. 곡사는 넘어감 · 같은 편은 지나감. 내구 160 — 막은 탄 · 근접 · 밀어붙이는 몸만큼 깎이고 0 이면 깨짐 (보라 게이지 = 내구 · 흰 게이지 = 남은 시간). 다가오는 근접 적 둘 이상 · 사격 준비하는 적 사수를 보면 스스로 씀. 대기 14초',")
rep("  '어둠의 화살비': '암계 장궁병 — 하늘로 쏘면 작은 원 일곱이 적 둘레에 차례로 생기고 1.1초 뒤 어둠의 화살이 쏟아짐: 피아 구분 없이 (동료도 맞음 — 동료가 낀 곳은 피함). 6칸 밖 · 적이 몰린 곳. 대기 14초',",
    "  '어둠의 화살비': '암계 장궁병 — 화살 하나를 하늘로 쏘아 올리면 붉은 원 (반지름 1.5칸) 이 1초 예고되고, 그 뒤 1초 동안 화살 10발이 원 안 무작위 자리에 1 ~ 2발씩 떨어짐 (곡사와 같은 판정 · 피아 구분 없음). 원을 본 몸은 달아남. 6칸 밖 · 적이 몰린 곳. 대기 14초',")
open(F, 'w', encoding='utf-8').write(s)
print('page9230 OK')
