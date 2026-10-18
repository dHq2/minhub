def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
rep(T,"    if (G.spd * (G.spdMul || 1) * (W.rules.run || 1.3) <= u.spd * (u.spdMul || 1) * (W.rules.run || 1.3) * 1.05) continue;   // 따라잡을 수 있으면 쫓음","    if ((G.winded ? Math.min(G.spd * (G.spdMul || 1), (W.rules.stamina || {}).jog || 99) : G.spd * (G.spdMul || 1) * (W.rules.run || 1.3)) <= u.spd * (u.spdMul || 1) * (u.winded ? 1 : (W.rules.run || 1.3)) * 1.05) continue;   // 따라잡을 수 있으면 쫓음 (숨이 찬 사수는 잡힘)")
# 페이지: 숨 표기
rep(P,"function gearTxt(Wd, u){\n  if (!u.alive) return '';\n  return `","function gearTxt(Wd, u){\n  if (!u.alive) return '';\n  return `${u.winded ? ' · 숨이 참' : u.sta != null && u.sta < 95 ? ' · 숨 ' + Math.round(u.sta) : ''}")
rep(P,"      case 'javHold':","      case 'winded': out.push(`${T(e)}${n(e.a)} 숨이 참 — ${(Wd.rules.stamina || {}).back || 40}까지 찰 때까지 못 뛰고 ${(Wd.rules.stamina || {}).jog || 2.4}칸/초로 묶임`); break;   // v6.5 질주 숨\n      case 'breath': out.push(`${T(e)}${n(e.a)} 숨을 고름 — 다시 뛸 수 있음`); break;\n      case 'javHold':")
rep(P,"    case 'cmdHold': return null;   // v6.3.3 참은 까닭은 로그만","    case 'cmdHold': return null;   // v6.3.3 참은 까닭은 로그만\n    case 'winded': return !e.vis ? null : U(e.a).side ? { c: 'good', s: `${ga(n(e.a))} 숨이 차 걸음이 느려진다.` } : { c: 'bad', s: `${ga(n(e.a))} 숨이 차 속도가 떨어진다 — 잠시 뛸 수 없다.` };   // v6.5\n    case 'breath': return null;")
