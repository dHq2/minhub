def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
# 판 위: 지침 😓 · 탈진 🥵 · 숨이 참 😮‍💨 (초상화 오른쪽 위)
rep(P,"    // v5.5 부위: 실명은 얼굴에 검은 띠,","""    // v6.6 지침 😓 · 탈진 🥵 (깜빡임) · 질주 숨이 참 😮‍💨 — 초상화 오른쪽 위
    if (!ed && vis && u.alive && (u.tired || u.exhausted || u.winded)){ const fs = Math.max(11, Math.min(17, r * 0.55)), x = px + r * 0.62, y = py - r * 0.62, ex = !!u.exhausted;
      ctx.save(); ctx.globalAlpha = ex ? 0.7 + 0.3 * Math.sin(now * 6) : 0.95; ctx.fillStyle = ex ? 'rgba(255,214,200,.95)' : 'rgba(255,244,230,.92)'; ctx.strokeStyle = ex ? '#c2410c' : '#a16207'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(x, y, fs * 0.7, 0, 7); ctx.fill(); ctx.stroke(); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#1a0a0c'; ctx.fillText(ex ? '🥵' : u.tired ? '😓' : '😮‍💨', x, y + 0.5); ctx.restore(); }
    // v5.5 부위: 실명은 얼굴에 검은 띠,""")
# 카드
rep(P,"  return `${u.winded ? ' · 숨이 참' : u.sta != null && u.sta < 95 ? ' · 숨 ' + Math.round(u.sta) : ''}","  return `${u.exhausted ? ' · 🥵 탈진' : u.tired ? ' · 😓 지침 ' + Math.round(u.fat) : ''}${u.winded ? ' · 😮‍💨 숨이 참' : u.sta != null && u.sta < 95 ? ' · 숨 ' + Math.round(u.sta) : ''}")
# 상세정보 줄 (숨 줄 위에)
rep(P,"    ${!ed && u.alive && u.sta != null && (u.side === 0 || see || u.seenBy) ?","""    ${!ed && u.alive && (u.side === 0 || see || u.seenBy) && Wd.rules.fatigue ? (() => { const F = Wd.rules.fatigue, f = Math.round(u.fat || 0); return `<span class="tr"${u.exhausted ? ' style="color:#ff9a86"' : u.tired ? ' style="color:#ffd27a"' : ''}><span class="lb">지침</span> ${u.exhausted ? '🥵 탈진' : u.tired ? '😓 지침' : '괜찮음'} ${f}/100${u.exhausted ? ` — 막아도 ${Math.round(F.ex.block * 100)}% 뚫림 · 급소 +${Math.round(F.ex.crit * 100)}% · 넘어짐 ×${F.ex.down} · 피하기 ×${F.ex.dodge} · 준비 ×${F.ex.wind} · 질주 못 함 (숨 고르기) · ${F.out} 아래로 풀려야 벗어남` : u.tired ? ` — 준비 ×${F.ti.wind} · 피하기 ×${F.ti.dodge} (아직 뛸 수 있음)` : ''} · 휘두름 · 돌진 · 밀치기 · 활 · 맞음으로 쌓이고 (막기 · 걷기는 안 침${u.vet ? ', 베테랑 ×' + F.vet : ''}) 맞붙지 않고 걸으면 −${F.recWalk}/초 · 서 있으면 −${F.recRest}/초</span>`; })() : ''}
    ${!ed && u.alive && u.sta != null && (u.side === 0 || see || u.seenBy) ?""")
# 로그
rep(P,"      case 'winded': out.push(","""      case 'tired': out.push(`${T(e)}${n(e.a)} 😓 지침 (${e.fat}) — 준비가 조금 느려지고 덜 피함 (아직 뛸 수 있음)`); break;   // v6.6
      case 'exhaust': out.push(`${T(e)}${n(e.a)} 🥵 탈진 — 막아도 ${Math.round(((Wd.rules.fatigue || {}).ex || {}).block * 100)}% 뚫림 · 급소에 더 맞고 · 잘 넘어지고 · 덜 피하고 · 준비가 느림 · 질주 못 함 (숨 고르기)`); break;
      case 'unexhaust': out.push(`${T(e)}${n(e.a)} 숨을 돌림 — 탈진에서 벗어남`); break;
      case 'winded': out.push(""")
rep(P,"    case 'winded': return !e.vis ? null :","""    case 'tired': return !e.vis || U(e.a).side ? null : { c: 'dim', s: `${ga(n(e.a))} 지쳐 간다 😓` };   // v6.6
    case 'exhaust': return !e.vis ? null : U(e.a).side ? { c: 'good', s: `${ga(n(e.a))} 탈진했다 🥵 — 칼끝이 떨린다!` } : { c: 'bad', s: `${ga(n(e.a))} 탈진했다 🥵 — 팔이 무겁게 처진다. 숨을 골라야 한다!` };
    case 'unexhaust': return !e.vis || U(e.a).side ? null : { c: 'dim', s: `${ga(n(e.a))} 겨우 숨을 돌린다.` };
    case 'winded': return !e.vis ? null :""")
