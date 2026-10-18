# v7.10.0 페이지: 부대장 (직책 배지 · 편대 단추 · 로그 · 선) + 전파 로그
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
rep("'weight', 'modBody', 'cry', 'mute', 'vg'];","'weight', 'modBody', 'cry', 'mute', 'vg', 'rank'];")
rep("{ key: '노먼', side: 0, ref: 'C-007', name: '노먼', tier: 2, cls: '기동', role: '사수', weapon: '소총', bold: 0.5,","{ key: '노먼', side: 0, ref: 'C-007', name: '노먼', tier: 2, cls: '기동', role: '사수', weapon: '소총', bold: 0.5, rank: '부대장',")
# 배지
rep("  if (u !== C && u.cmd > 0 && u.alive) return `<span class=\"lk c\" title=\"부지휘관","  const sqN = Wd.units.filter(m => m.alive && m.sqLead === u.i).length;\n  if (u !== C && u.rank === '부대장' && u.alive) return `<span class=\"lk c\" title=\"공식 부대장 (지휘 점수 ${u.cmd}) — 지휘관의 말을 못 들은 이에게 2차로 전하고, 지휘관이 쓰러지면 바로 이어받고, 편대를 이끌어 스스로 표적을 외침\">🎖 부대장${sqN ? ' · 편대 ' + sqN : ''}</span>` + (u.sqFall && Wd.t < u.sqFall ? `<span class=\"lk y\" title=\"힘이 모자라 편대를 이끌고 본대로 물러나는 중\">↩ 물러남</span>` : '') + (u.ordPend ? `<span class=\"lk q\">⏳ ${f2(Math.max(0, u.ordPend.at - Wd.t))}초</span>` : '');   // v7.10\n  if (u !== C && u.cmd > 0 && u.alive) return `<span class=\"lk c\" title=\"부지휘관")
rep("  return isoB + nf + hm + xm + dv + `<span class=\"lk ${cl}\"","  const sqB = u.sqLead != null && Wd.units[u.sqLead] ? `<span class=\"lk c\" title=\"부대장 ${esc(Wd.units[u.sqLead].name)}의 편대 — 주인공 대신 그를 따르고, 그가 외친 표적을 함께 노려요${u.sqAuto ? ' (지휘관과 닿지 않아 스스로 들어감 — 닿으면 본대로)' : ''}\">🎖 ${esc(Wd.units[u.sqLead].name)} 편대</span>` : '';   // v7.10\n  return sqB + isoB + nf + hm + xm + dv + `<span class=\"lk ${cl}\"")
# 직책 줄
rep("    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) ? (() => { const lit = u.torch && !u.torchOff, S3 = Wd.rules;","    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) && (u.rank === '부대장' || u.sqLead != null) ? `<span class=\"tr\"><span class=\"lb\">직책</span> ${u.rank === '부대장' ? '🎖 공식 부대장 — 편대 ' + Wd.units.filter(m => m.alive && m.sqLead === u.i).length + '명' + (u.sqFocus && Wd.t - u.sqFocus.t < 6 && Wd.units[u.sqFocus.b] ? ' · 표적 ' + esc(Wd.units[u.sqFocus.b].name) : '') : '🎖 ' + esc((Wd.units[u.sqLead] || {}).name || '?') + ' 편대' + (u.sqAuto ? ' (스스로 들어감)' : '')}</span>` : ''}\n    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) ? (() => { const lit = u.torch && !u.torchOff, S3 = Wd.rules;")
# 편대 단추
rep("      + (L.some(u => !u.crawl && !isFar(u)) ? `<button type=\"button\" class=\"db ${armed && armed.k === 'flank' ? 'on' : ''}\" data-dk=\"flank\">","      + (() => { const Dp = deputyOf(Wd, 0), T = Dp ? L.filter(u => u.alive && !u.hero && u !== Dp) : []; return T.length ? `<button type=\"button\" class=\"db ${T.every(u => u.sqLead === Dp.i) ? 'on' : ''}\" data-dk=\"squad\" title=\"부대장 ${esc(Dp.name)}의 편대에 넣거나 본대로 돌려요\"><span class=\"ic\">🎖</span>편대<small>${T.every(u => u.sqLead === Dp.i) ? esc(Dp.name) + ' 편대' : '본대'}</small></button>` : ''; })()   // v7.10\n      + (L.some(u => !u.crawl && !isFar(u)) ? `<button type=\"button\" class=\"db ${armed && armed.k === 'flank' ? 'on' : ''}\" data-dk=\"flank\">")
rep("  if (k === 'boxsel'){ ordKey('boxsel'); return; }","  if (k === 'squad'){ squadKey(selUnits(world)); return; }   // v7.10\n  if (k === 'boxsel'){ ordKey('boxsel'); return; }")
rep("// v7.9 교전 규칙 · 치료 방침: 고른 아군에게","""// v7.10 편대 배속: 부대장의 편대에 넣거나 본대로 (지휘관을 거쳐 닿음 — 못 들을 수 있음)
function squadKey(L){
  const W = world; if (!W) return; const Dp = deputyOf(W, 0); if (!Dp){ toast('부대장이 없어요'); return; }
  const T = L.filter(u => u.alive && !u.hero && u !== Dp); if (!T.length){ toast('편대에 넣을 아군을 골라 주세요 (주인공 · 부대장 빼고)'); return; }
  const val = T.every(u => u.sqLead === Dp.i) ? 'main' : 'dep';
  sendPosture(W, T, 'sq', val, {});
  const pend = T.filter(u => (u.posPend || []).some(q => q.key === 'sq'));
  toast(`🎖 ${T.map(u => u.name).join(' · ')} → ${val === 'dep' ? Dp.name + ' 편대 (주인공 대신 부대장을 따르고 그가 외친 표적을 노려요)' : '본대 (주인공을 따름)'}${pend.length ? ` — ${pend.map(u => u.name).join(' · ')}은(는) 지휘관을 거쳐 전해지는 중` : ''}`);
  hud();
}
// v7.9 교전 규칙 · 치료 방침: 고른 아군에게""")
# 로그
rep("      case 'chaseEnd': out.push(","""      case 'sqJoin': out.push(`${T(e)}🎖 ${n(e.a)} 지휘관과 닿지 않아 ${n(e.b)} 편대에 듦`); break;   // v7.10
      case 'sqLeave': out.push(`${T(e)}🎖 ${n(e.a)} 지휘관과 닿아 본대로 돌아감`); break;
      case 'sqFall': out.push(`${T(e)}↩ ${n(e.a)} 편대 ${e.n + 1}명 — 힘이 적의 ${Math.round(e.odds * 100)}% 라 본대로 물러남`); break;
      case 'sqCall': out.push(`${T(e)}🎖 ${n(e.a)} → 편대 ${e.n}명: ${n(e.b)} 먼저 치라고 외침`); break;
      case 'succeed': out.push(`${T(e)}🚩 ${n(e.a)} ${e.deputy ? '부대장으로서 ' : ''}지휘를 이어받음 (${n(e.from)} 쓰러짐)`); break;
      case 'chaseEnd': out.push(""")
rep("    case 'chaseEnd': return","""    case 'sqJoin': return { c: 'dim', s: `${ga(n(e.a))} 지휘관의 말이 닿지 않자 ${n(e.b)}의 편대를 따른다.` };   // v7.10
    case 'sqLeave': return { c: 'dim', s: `${ga(n(e.a))} 지휘관의 말이 다시 닿아 본대로 돌아간다.` };
    case 'sqFall': return { c: 'bad', s: `${ga(n(e.a))} 힘이 모자란 것을 보고 편대를 이끌어 본대 쪽으로 물러난다.` };
    case 'sqCall': return { c: 'dim', s: `${ga(n(e.a))} 편대에 "${n(e.b)} 먼저!" 하고 외친다.` };
    case 'succeed': return { c: 'bad', s: `${ga(n(e.a))} ${e.deputy ? '부대장으로서 ' : ''}지휘를 이어받는다.` };
    case 'chaseEnd': return""")
rep("    case 'posture': return { c: 'dim', s:","    case 'posture': if (e.key === 'sq') return { c: 'dim', s: e.val === 'dep' ? `${ga(n(e.a))} ${n(e.b)}의 편대에 든다.` : `${ga(n(e.a))} 본대로 돌아간다.` };\n      return { c: 'dim', s:")
rep("      case 'posture': out.push(`${T(e)}","      case 'posture': if (e.key === 'sq'){ out.push(`${T(e)}🎖 ${n(e.a)} ${e.val === 'dep' ? n(e.b) + ' 편대에 배속' : '본대로 복귀'}`); break; }\n        out.push(`${T(e)}")
rep("['impulse', 'regroup', 'healDefer', 'healRisk', 'healAbort', 'pushNo', 'offAct', 'flankMis', 'rally', 'netBack', 'chaseEnd', 'rejoin']","['impulse', 'regroup', 'healDefer', 'healRisk', 'healAbort', 'pushNo', 'offAct', 'flankMis', 'rally', 'netBack', 'chaseEnd', 'rejoin', 'sqFall', 'sqCall', 'sqJoin', 'sqLeave', 'succeed']")
# 편대 선
rep("  if (!ed && $('netShow').checked && Wd.t > 0.01){   // v7.9.5 지휘망","""  if (!ed && $('netShow').checked && Wd.t > 0.01){   // v7.10 편대: 부대장 ↔ 편대원 (청록 점선)
    const Dp = deputyOf(Wd, 0); if (Dp && Dp.alive){ ctx.save(); ctx.setLineDash([2, 5]); ctx.lineWidth = Math.max(1.3, ts * 0.045); ctx.strokeStyle = 'rgba(110,225,235,.75)';
      for (const u of Wd.units){ if (u.side !== 0 || !u.alive || u.sqLead !== Dp.i || hidA(Wd, u)) continue; ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(ox + Dp.x * ts, oy + Dp.y * ts); ctx.stroke(); } ctx.restore(); } }
  if (!ed && $('netShow').checked && Wd.t > 0.01){   // v7.9.5 지휘망""")
open(f,'w').write(s); print('ok')
