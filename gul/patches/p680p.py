def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
P = 'page10.tpl.html'
rep(P, "      case 'focus': out.push(`${T(e)}◆ 적 지휘: 표적 ${n(e.b)} —",
"""      case 'cmdLost': out.push(`${T(e)}${e.side ? '◆ 적' : '◇ 아군'} 지휘가 끊김 — 공동 표적 · 협동 기동 · 지휘관의 돌진 명령이 멈추고 각자 싸움 (2.5초 뒤 가장 노련한 이가 임시 지휘)`); break;   // v6.8
      case 'acting': out.push(`${T(e)}${e.side ? '◆ 적' : '◇ 아군'} 임시 지휘: ${n(e.a)} — 지휘를 이어받음 (지휘C 만큼${e.n > 1 ? ' · ' + e.n + '번째' : ''})`); break;
      case 'focusLost': out.push(`${T(e)}◆ 적: 지휘가 끊겨 공동 표적 (${n(e.b)}) 이 사라짐 — 각자 가까운 · 약한 상대를 침`); break;
      case 'focusDown': out.push(`${T(e)}◆ 적 ${e.by != null ? '지휘 (' + n(e.by) + ')' : ''}: 표적 ${n(e.b)} 쓰러뜨림 — 다음 표적을 고름`); break;
      case 'opFail': out.push(`${T(e)}📋 작전 실패 판정: ${PLAN_K[e.p] || e.p} — ${e.why} → ${PLAN_K[e.next] || e.next} (${e.how})`); break;
      case 'opCheck': out.push(`${T(e)}📋 작전 점검: ${PLAN_K[e.p] || e.p} — ${e.why}, 그래도 그대로 (${e.how})`); break;
      case 'focus': out.push(`${T(e)}◆ 적 ${e.by != null ? (e.tmp ? '임시 지휘 (' : '지휘 (') + n(e.by) + ')' : '지휘'}: 표적 ${n(e.b)} —""")
rep(P, "    case 'plan': return null;   // v6.2 적의 작전",
"""    case 'acting': return e.vis ? { c: e.side ? 'bad' : 'good', s: `${ga(n(e.a))} 소리친다 — 무너진 지휘를 이어받는다!` } : null;   // v6.8
    case 'cmdLost': return e.side ? (Wd.units.some(u => u.side === 1 && u.alive && u.seenBy) ? { c: 'good', s: '적의 지휘가 끊겼다 — 적이 저마다 따로 움직인다.' } : null) : { c: 'bad', s: '우리 지휘가 끊겼다 — 각자 싸운다.' };
    case 'opFail': return Wd.units.some(u => u.side === 1 && u.alive && u.seenBy) ? { c: 'good', s: e.next === 'withdraw' ? '적의 계획이 무너졌다 — 적이 물러나 대열을 다시 짠다.' : '적의 계획이 틀어졌다 — 적이 움직임을 바꾼다.' } : null;
    case 'focusLost': case 'focusDown': case 'opCheck': return null;
    case 'plan': return null;   // v6.2 적의 작전""")
rep(P, "    else if (e.k === 'focus' && e !== fo) s = `◆ 적 표적 ${e.was != null ? n(e.was) + ' → ' : ''}${n(e.b)} (${e.why})`;",
       "    else if (e.k === 'focus' && e !== fo) s = `◆ 적 표적 ${e.was != null ? n(e.was) + ' → ' : ''}${n(e.b)} (${e.why})`;\n    else if (e.k === 'opFail') s = `◆ 작전 실패 판정 ${PLAN_K[e.p] || e.p} — ${e.why} → ${PLAN_K[e.next] || e.next}`;   // v6.8\n    else if (e.k === 'acting') s = `${e.side ? '◆ 적' : '◇ 아군'} 임시 지휘 ${n(e.a)}`;\n    else if (e.k === 'cmdLost') s = `${e.side ? '◆ 적' : '◇ 아군'} 지휘가 끊김`;")
rep(P, "<!-- 굴의 전투판 v6.7.6 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v6.8.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v6.8.0: ① 고침: 체력이 반올림해 0 (0.5 아래) 이면 쓰러짐 — 0/150 으로 몇 초 더 움직이다 '피해 0' 을 받고서야 쓰러지던 것.
             ② 지휘 붕괴: 지휘관이 쓰러지면 공동 표적 · 쐐기 · 포위 · 지휘관의 돌진 명령 · 협동 기동이 멈추고 각자 싸움 → 2.5초 뒤 가장 노련한 병사 (베테랑 · 등급 · 체력) 가 임시 지휘 (지휘C). 로그는 '지휘 (곤봉적)' · '임시 지휘 (검방패기사)' · '지휘가 끊김' 으로 누가 정했는지 구별.
             ③ 작전 실패 판정: 작전을 떠받치던 것이 무너지면 (방패 전열 전멸 · 지휘관 쓰러짐 · 짧은 사이 둘 넘게 잃음) '작전 실패 판정 — 이유 → 새 작전 (까닭)' 을 남기고 다시 짬 (재편: 궁수를 남은 거구 · 근접 뒤로 모음 · 밀어붙임 · 사냥 · 버팀). 같은 작전을 고르면 '작전 점검 — 그래도 그대로'. 6초에 한 번까지 (계획의 관성). 표적을 쓰러뜨리면 '표적 쓰러뜨림 — 다음 표적'.
""")
rep(P, 'body.mob .top h1::after{content:" v6.7.6";', 'body.mob .top h1::after{content:" v6.8.0";')
rep(P, '<span class="ver">v6.7.6 · ', '<span class="ver">v6.8.0 · HP 0 = 쓰러짐 · 지휘 붕괴 · 임시 지휘 · 작전 실패 판정 · v6.7.6 · ')
rep(P, '<footer>굴의 전투판 v6.7.6 —', '<footer>굴의 전투판 v6.8.0 —')
rep(P, "return `굴의 전투판 v6.7.6 · ${title}", "return `굴의 전투판 v6.8.0 · ${title}")
print('ok')
