import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
# replace v5.4 방진 block
a=s.index("    // v5.4 방진: 대치 중인 편의 붙어 선 동료끼리 얇은 선\n")
b=s.index("      ctx.restore(); }\n", a)+len("      ctx.restore(); }\n")
s=s[:a]+"    drawBattleLines(Wd, ox, oy, ts, see);   // v5.7 전열 (v5.4 방진 선을 대신함)\n"+s[b:]
# drawBattleLines function before drawLinks
rep("function drawLinks(Wd, ox, oy, ts, see){", r"""// v5.7 전열: 마디의 앞면을 잇는 곡선 · 관절 점 (방패를 든 마디는 네모) · 앞쪽 옅은 띠 (쥐고 있는 영역 — 마디가 많을수록 진함) · 양 끝 눈금 (약한 곳) · 끊긴 자리 (붉은 ✕)
// 지킬 사람 (금빛 점선 고리) · 막기 모드 (유지 🛡 · 공격 위주 ⚔ 작은 표)
function drawBattleLines(Wd, ox, oy, ts, see){
  ctx.save(); ctx.setLineDash([]); ctx.lineCap = 'round';
  for (const ln of Wd.lines || []){
    const M = ln.ids.map(i => Wd.units[i]).filter(u => u && u.alive);
    if (M.length < 2 || (ln.side === 1 && !see && !M.some(u => u.seenBy))) continue;
    const fx = Math.cos(ln.face), fy = Math.sin(ln.face), col = ln.side ? '255,130,100' : '140,200,255';
    const P = M.map(u => ({ x: ox + (u.x + fx * u.r * 0.95) * ts, y: oy + (u.y + fy * u.r * 0.95) * ts, sh: u.shield && u.raised }));
    const band = Math.min(1.3, 0.6 + 0.15 * M.length) * ts;
    ctx.fillStyle = `rgba(${col},${(0.06 + 0.035 * Math.min(4, M.length)).toFixed(3)})`;
    ctx.beginPath(); P.forEach((p, k) => k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    for (let k = P.length - 1; k >= 0; k--) ctx.lineTo(P[k].x + fx * band, P[k].y + fy * band);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = `rgba(${col},.85)`; ctx.lineWidth = 2 + Math.min(3, M.length * 0.6);
    ctx.beginPath(); ctx.moveTo(P[0].x, P[0].y);
    for (let k = 1; k < P.length - 1; k++) ctx.quadraticCurveTo(P[k].x, P[k].y, (P[k].x + P[k + 1].x) / 2, (P[k].y + P[k + 1].y) / 2);
    ctx.lineTo(P[P.length - 1].x, P[P.length - 1].y); ctx.stroke();
    for (const p of P){ ctx.fillStyle = `rgba(${col},.95)`; if (p.sh) ctx.fillRect(p.x - 3.5, p.y - 3.5, 7, 7); else { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.283); ctx.fill(); } }
    ctx.strokeStyle = 'rgba(255,215,120,.85)'; ctx.lineWidth = 2;
    for (const [p, q] of [[P[0], P[1]], [P[P.length - 1], P[P.length - 2]]]){ const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + dx / d * 9, p.y + dy / d * 9); ctx.stroke(); }
  }
  for (const g of Wd.lineGaps || []){ const a = Math.max(0, 1 - (Wd.t - g.t0) / 1.6); if (a <= 0 || (g.side === 1 && !see && !litAt(Wd, g.x, g.y))) continue;
    const x = ox + g.x * ts, y = oy + g.y * ts, r = ts * 0.22; ctx.strokeStyle = `rgba(255,70,60,${a.toFixed(2)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.stroke(); }
  const wd = Wd.ward && Wd.ward[0] != null ? Wd.units[Wd.ward[0]] : null;
  if (wd && wd.alive){ ctx.strokeStyle = 'rgba(255,215,110,.8)'; ctx.lineWidth = 1.8; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(ox + wd.x * ts, oy + wd.y * ts, wd.r * ts + 6, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }
  for (const u of Wd.units){ if (!u.alive || u.side !== 0 || !u.canGuard || !u.guardMode || u.guardMode === 'auto') continue;
    const t = u.guardMode === 'hold' ? '🛡' : '⚔', x = ox + (u.x + u.r * 0.85) * ts, y = oy + (u.y - u.r * 0.85) * ts;
    ctx.fillStyle = u.guardMode === 'hold' ? 'rgba(20,40,70,.9)' : 'rgba(70,30,20,.9)'; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.fill();
    ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText(t, x, y + 0.5); }
  ctx.restore();
}
function drawLinks(Wd, ox, oy, ts, see){""",'dbl')
# logLines cases
rep("      case 'stun': out.push(`${T(e)}💫 ${n(e.b)} 휘청",
"""      case 'lineForm': out.push(`${T(e)}▬ ${e.side ? '적 ' : ''}전열 ${e.n}마디: ${e.ids.map(n).join(' · ')}`); break;   // v5.7
      case 'lineLeave': out.push(`${T(e)}▬ ${n(e.a)} 전열 이탈 — 틈 (${e.n}마디였음)`); break;
      case 'lineFall': out.push(`${T(e)}▬ ${n(e.a)} 쓰러짐 — 전열이 끊김`); break;
      case 'lineFill': out.push(`${T(e)}▬ ${n(e.a)} → 쓰러진 ${n(e.b)}의 자리를 메우러 감`); break;
      case 'opportunity': out.push(`${T(e)}⚔ ${n(e.a)} 손 닿는 곳에서 빠지는 ${n(e.b)}에게 공짜 일격 (교전 구속 ×${(Wd.rules.line || {}).opp})`); break;
      case 'headLost': out.push(`${T(e)}✚ ${n(e.b)} 머리 하나를 잃음 (남은 머리 ${e.left} · 눈 둘) (${n(e.a)})`); break;
      case 'guardMode': out.push(`${T(e)}🛡 ${n(e.a)} 막기: ${GM_SHORT[e.m] || e.m}${e.why ? ' (' + e.why + ')' : ''}`); break;
      case 'ward': out.push(`${T(e)}♛ 지킬 사람: ${n(e.a)} (노출 ×${e.v} — 탱커가 먼저 감쌈)`); break;
      case 'stun': out.push(`${T(e)}💫 ${n(e.b)} 휘청""",'ll')
rep("        if (e.ff) tags.push('아군 오사');",
"""        if (e.ff) tags.push('아군 오사');
        if (e.cover != null) tags.push(`옆 마디 ${n(e.cover)}${jong(n(e.cover)) ? '이' : '가'} 가림 (측면 아님)`);   // v5.7
        if (e.bareArm) tags.push(`맨팔로 받아 냄 ×${(R.guard || {}).bareDmg} (팔 위험)`);
        if (e.vital) tags.push('급소: ' + e.vital);""",'lltags')
# narrOf
rep("    case 'stun': return { c: U(e.b).side ? 'good' : 'bad', s: `${ga(n(e.b))} 휘청인다!` };   // v5.5.3",
"""    case 'lineForm': { const nm = e.ids.map(i => U(i).name).join(' · '); return e.side === 0 ? { c: 'dim', s: `${nm} — 전열을 이룬다 (${e.n}마디).` } : e.vis ? { c: 'dim', s: `적이 전열을 이룬다 (${nm}).` } : null; }   // v5.7
    case 'lineLeave': return U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 전열을 벗어난다 — 틈이 생겼다.` } : e.vis && e.n >= 3 ? { c: 'dim', s: `적 전열에서 ${ga(n(e.a))} 빠져나온다.` } : null;
    case 'lineFall': return U(e.a).side === 0 ? { c: 'bad', s: `${ga(n(e.a))} 쓰러져 전열이 끊긴다!` } : e.vis ? { c: 'good', s: `적 전열의 ${ga(n(e.a))} 쓰러진다 — 틈이 열렸다!` } : null;
    case 'lineFill': return U(e.a).side === 0 || e.vis ? { c: 'dim', s: `${ga(n(e.a))} ${n(e.b)}의 빈자리를 메운다.` } : null;
    case 'opportunity': return e.vis ? { c: U(e.a).side === 0 ? 'good' : 'bad', s: `${ga(n(e.a))} 빠져나가는 ${reul(n(e.b))} 놓치지 않고 친다!` } : null;
    case 'headLost': return { c: U(e.b).side ? 'good' : 'bad', s: `${ga(n(e.b))} 머리 하나를 잃는다! (남은 머리 ${e.left})` };
    case 'ward': return { c: 'dim', s: `${ga(n(e.a))} 지킬 사람이다 — 탱커가 먼저 감싼다.` };
    case 'guardMode': return null;
    case 'stun': return { c: U(e.b).side ? 'good' : 'bad', s: `${ga(n(e.b))} 휘청인다!` };   // v5.5.3""",'narr')
rep("      if (e.tag && /꿰뚫림/.test(e.tag)) return",
"""      if (e.tag && /머리에 박힘/.test(e.tag)) return { c: b.side === 0 ? 'bad' : 'good', s: `${a.name}의 ${e.jav ? '창' : /총알/.test(e.tag) ? '총알' : '화살'}이 ${b.name}의 머리에 박힌다 — 즉사!` };   // v5.7 급소
      if (e.bareArm) return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 맨팔로 ${a.name}의 일격을 받아 낸다${v}.` };
      if (e.tag && /^옆 동료/.test(e.tag)) return { c: 'dim', s: `옆의 ${U(e.cover).name}${jong(U(e.cover).name) ? '이' : '가'} 방패로 ${reul(b.name)} 가려 막는다.` };
      if (e.vital && !e.block) return { c: b.side === 0 ? 'bad' : 'good', s: `급소! ${a.name}의 ${e.jav ? '투창' : far ? (/총/.test(a.weapon || '') ? '총알' : '화살') : '일격'}이 ${b.name}의 ${e.vital === '머리' ? (e.tag && /하나/.test(e.tag) ? '머리 하나를' : '머리를') : '심장을'} 꿰뚫는다${v}.` };
      if (e.tag && /꿰뚫림/.test(e.tag)) return""",'narrhit')
# detail rows
rep("키 ${u.h}m · 무게 ${u.mass}kg · 돌아서기","키 ${u.h}m · 무게 ${u.mass}kg${u.massEst ? ' (어림 — 키 · 무게를 정하면 정확해짐)' : ''} · 돌아서기",'mass')
rep("""    ${u.canGuard && known ? `<span class="tr"><span class="lb">방어</span> 바라보는 방향 ±${u.gArc}°""",
"""    ${!ed && u.alive && !isFar(u) ? `<span class="tr"><span class="lb">전열</span> ${u.line ? `${u.line.n}마디 중 ${u.line.k + 1}번째${u.line.k === 0 || u.line.k === u.line.n - 1 ? ' (끝 — 바깥 옆이 약한 곳)' : ' (가운데 — 양옆 마디가 가려 측면이 없음)'} · 덜 밀리고 덜 넘어짐 · 손 닿는 곳에서 빠지는 적에게 일격` : '전열 밖 — 옆 · 뒤가 열려 있음'}${cmdOf(Wd, u.side) ? ' · 자석 전열 (지휘가 있어 흩어지지 않고 같이 나아감)' : ' · 지휘가 없어 전열은 우연히만'} (<kbd>L</kbd>)</span>` : ''}
    ${!ed && u.alive && Wd.ward && Wd.ward[u.side] === u.i && (u.side === 0 || see) ? `<span class="tr" style="color:#ffe196"><span class="lb">지킬 사람</span> ${[u.skill && u.skill.left > 0 ? '약' : '', isFar(u) ? '사수' : '', u.cmd ? '지휘' : ''].filter(Boolean).join(' · ')} — 탱커가 먼저 막아서고, 막기 자동은 이 사람을 노리는 적도 위협으로 봄 (노출 ×${wardMul(Wd, u).toFixed(2)})</span>` : ''}
    ${!u.canGuard && !isFar(u) && u.side === 0 && known ? `<span class="tr"><span class="lb">방어</span> 막을 방패 · 대검이 없음 — 맨몸으로 창칼을 막지 않고 움직여 피함 (막는 역할은 방패병 · 갑옷만 받아 냄)</span>` : ''}
    ${u.canGuard && known ? `<span class="tr"><span class="lb">방어</span> 막기 ${GM_SHORT[u.guardMode || 'auto']}${u.side === 0 ? ' (<kbd>B</kbd>)' : ''} · 지금 ${!ed && u.raised ? (Wd.t >= u.raiseAt ? '들고 있음' : '드는 중') : '내림 (갑옷만)'}${bareGuard(Wd, u) ? ' · 맨몸 — 무기를 막으면 팔이 받아 낼 수 있음 (자동은 무기를 막지 않음)' : ''} · 바라보는 방향 ±${u.gArc}°""",'guardrow')
# rules rows: after call.err row
rep("['call.r', '아군 시야 연동: 불러 주는 거리 (칸)'], ['call.err', '아군 시야 연동: 자리 오차 (칸)']]",
"""['call.r', '아군 시야 연동: 불러 주는 거리 (칸)'], ['call.err', '아군 시야 연동: 자리 오차 (칸)'],
    ['guard.raise', '막기: 드는 데 (초)'], ['guard.walk', '막기: 든 채 걸음 ×'], ['guard.keep', '막기: 위협이 잠깐 안 보여도 들고 있는 (초)'], ['guard.wall', '방패벽: 나란히 막으면 막는 폭 +°'], ['guard.bare', '맨몸 막기: 무기를 막으면 팔이 받아 낼 확률'], ['guard.bareDmg', '맨몸 막기: 팔로 받은 피해 ×'], ['guard.bareMaim', '맨몸 막기: 팔이 잘리거나 부러질 확률'],
    ['vital.head', '급소: 머리를 꿰뚫으면 최대 체력의 몫'], ['vital.heart', '급소: 심장을 꿰뚫으면 최대 체력의 몫'], ['vital.heartP', '급소: 몸통에 꿰뚫으면 심장일 확률'], ['vital.javKill', '급소: 투창이 머리에 박히면 즉사 확률'], ['vital.arrowKill', '급소: 화살 · 총이 머리에 박히면 즉사 확률'], ['vital.headLoss', '머리 넷: 머리 하나를 잃으면 최대 체력의 몫'],
    ['line.link', '전열: 관절 거리 (칸)'], ['line.opp', '전열: 빠지는 적에게 일격 ×'], ['line.fill', '전열: 쓰러진 자리를 메우러 오는 거리 (칸)'], ['line.gap', '전열 명령: 마디 간격 (칸)'], ['line.walk', '자석 전열: 같이 나아가는 걸음 ×'], ['run', '서두르기 (연달아 준 이동): 속력 ×'],
    ['ward.medic', '지킬 사람: 남은 약 ×'], ['ward.shooter', '지킬 사람: 사수 ×'], ['ward.at', '지킬 사람: 이 값을 넘는 가장 큰 쪽']]""",'rules')
open(P,'w').write(s); print('ok part2')
