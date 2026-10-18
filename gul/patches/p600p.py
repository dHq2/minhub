def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:80], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
P='page10.tpl.html'
LOG = r"""      case 'plan': out.push(`${T(e)}📋 적의 작전: ${e.was ? (PLAN_K[e.was] || e.was) + ' → ' : ''}${PLAN_K[e.p] || e.p}${e.why ? ' (' + e.why + ')' : ''} — ${PLAN_D[e.p] || ''}`); break;   // v6.0
      case 'pact': out.push(`${T(e)}🤝 약속: ${pactTxt(Wd, e)}`); break;   // v6.0 짧은 역할 약속
      case 'pactEnd': out.push(`${T(e)}🤝 약속 끝 (${n(e.a)} · ${n(e.b)}) — ${e.why}`); break;
      case 'squad': out.push("""
rep(P, "      case 'squad': out.push(", LOG)
NARR = r"""    case 'plan': return { c: e.p === 'withdraw' ? 'good' : 'bad', s: e.p === 'withdraw' ? `적이 물러난다 — ${e.why}. 쫓는 쪽은 다른 놈이 막아선다.` : e.was === 'withdraw' ? `물러났던 적이 다시 모여 진형을 갖춘다.` : `적의 움직임이 바뀐다: ${PLAN_N[e.p] || ''}` };   // v6.0
    case 'pact': { if (!e.vis) return null; const A = n(e.a), B = n(e.b), X = n(e.x); const s = e.p === 'pin' ? `${ga(A)} ${reul(X)} 붙드는 사이, ${ga(B)} ${e.r != null ? '뒤의 ' + reul(n(e.r)) + ' 노린다' : '옆으로 돈다'}.` : e.p === 'block' ? `${ga(A)} 내려칠 준비를 하자 ${ga(B)} ${X}의 뒤를 막는다.` : e.p === 'press' ? `${ga(A)} ${reul(X)} 겨누고, ${ga(B)} ${X}에게 다가간다.` : e.p === 'screen' ? `${ga(A)} 물러나고, ${ga(B)} 쫓는 ${reul(X)} 막아선다.` : e.p === 'cover' ? `${ga(A)} 뒤로 뛰자 ${ga(B)} 쫓는 ${reul(X)} 겨눈다.` : '';
      return s ? { c: U(e.a).side ? 'bad' : 'good', s } : null; }
    case 'pactEnd': return null;
    case 'squad': return e.vis ?"""
rep(P, "    case 'squad': return e.vis ?", NARR)
# 도우미: 작전 · 약속 글
rep(P, "function logHeader(Wd, title){", r"""// v6.0 적의 작전 · 약속 (로그 · 이야기)
const PLAN_K = { assault: '밀어붙임', hold: '버팀', bait: '유인', hunt: '사냥', withdraw: '후퇴' };
const PLAN_D = { assault: '대치를 짧게, 돌격을 더 씀', hold: '진형을 오래 지키며 궁수가 깎음 · 우위일 때만 들어감', bait: '앞줄이 물러서며 궁수 사거리로 끌어들인 뒤 들어감', hunt: '고립된 상대를 노림', withdraw: '물러나 다시 모임 · 쫓는 놈은 동료가 견제 · 붙들린 쪽은 맞섬' };
const PLAN_N = { assault: '밀어붙이려 한다.', hold: '진형을 굳히고 버틴다.', bait: '앞줄이 슬금슬금 물러선다 — 끌어들이려는 것 같다.', hunt: '혼자 떨어진 쪽을 노린다.' };
function pactTxt(Wd, e){ const n = i => Wd.units[i] ? Wd.units[i].name : '?', A = n(e.a), B = n(e.b), X = n(e.x);
  return e.p === 'pin' ? `${ga(A)} ${reul(X)} 붙듦 → ${B}${jong(B) ? '은' : '는'} ${e.r != null ? '후열 ' + n(e.r) + ' 위협' : '측면으로'}`
    : e.p === 'block' ? `${ga(A)} ${X}에게 내려치기 준비 → ${B}${jong(B) ? '은' : '는'} 퇴로를 막음 (아무도 밀쳐 내지 않음)`
    : e.p === 'press' ? `${ga(A)} ${reul(X)} 겨눔 → ${B}${jong(B) ? '은' : '는'} 사선을 비켜 ${X}에게 다가가 압박`
    : e.p === 'screen' ? `${ga(A)} 물러남 → ${ga(B)} 쫓는 ${reul(X)} 견제`
    : e.p === 'cover' ? `${ga(A)} 뒤로 도약 → ${ga(B)} 쫓는 ${reul(X)} 겨눔 (교대 엄호)` : e.p; }
function logHeader(Wd, title){""")
print('ok')
