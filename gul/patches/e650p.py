def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
# 기동 문장
rep(P,"    : e.m === 'recall' ?","""    : e.m === 'rejoin' ? `순찰조 합류 (본능): ${ga(n(e.a))} 경보를 듣고 본대로 (${e.d}칸) — 하나씩 부딪히지 않게`
    : e.m === 'rally' ? `집결 (지휘): 본대 ${(e.ids || []).map(n).join(' · ')}${(e.ids || []).length ? '' : ''} — 순찰조 ${e.n}명이 모일 때까지 기다림`
    : e.m === 'bguard' ? `몸으로 막는 호위 (지휘): ${ga(n(e.a))} ${n(e.b)}${jong(n(e.b)) ? '과' : '와'} ${n(e.c)} 사이 사선 위에 서서 방패를 듦`
    : e.m === 'kite' ? `거리 벌림 (본능): ${ga(n(e.a))} 쏘고 나서 다가오는 ${reul(n(e.b))} 피해 한 걸음 물러남`
    : e.m === 'recall' ?""")
rep(P,"    : e.m === 'swap' ? `교대 (지휘): ${ga(n(e.a))} 빠지고 (체력 ${e.hp}%)","    : e.m === 'swap' ? `교대 (지휘): ${ga(n(e.a))} 빠지고 (${e.why || '체력 ' + e.hp + '%'})")
# 사수 몰이 로그
rep(P,"      case 'javHold':","""      case 'hunt': out.push(`${T(e)}📋 사수 몰이: ${e.s === 'start' ? `${n(e.b)}${jong(n(e.b)) ? '이' : '가'} ${e.why} → 끊을 조 ${e.ids.map(n).join(' · ')}${jong(n(e.ids[e.ids.length - 1])) ? '이' : '가'} 퇴로 쪽으로 돌아감 · 쫓던 ${(e.chase || []).map(n).join(' · ') || '없음'} · 궁수는 ${n(e.b)}` : e.s === 'close' ? `조여 들어감 (${e.why}) — ${(e.ids || []).map(n).join(' · ')} 함께` : '끝 — ' + e.why}`); break;   // v6.5
      case 'javHold':""")
# 쐐기: 맞닿음 · 돌파
rep(P,"e.s === 'breach' ? `${n(e.tip)}${jong(n(e.tip)) ? '이' : '가'} ${n(e.b)}에 부딪힘 — 뚫린 곳으로 ${e.body.map(n).join(' · ') || '몸통'}${e.body.length ? (jong(n(e.body[e.body.length - 1])) ? '이' : '가') : '이'} 뒤의 표적에게 쏟아져 들어감` : (e.s === 'drop' ?","e.s === 'contact' ? `${ga(n(e.tip))} ${n(e.b)}에 맞닿음 — 아직 뚫지 못함 (5초 안에 전열 너머로 들어가야 돌파)` : e.s === 'breach' ? (e.thru ? `돌파 — ${e.why}${e.thru.length ? ' (' + e.thru.map(n).join(' · ') + ')' : ''} → 몸통이 뒤의 표적에게` : `${n(e.tip)}${jong(n(e.tip)) ? '이' : '가'} ${n(e.b)}에 부딪힘 — 뚫린 곳으로 ${e.body.map(n).join(' · ') || '몸통'}${e.body.length ? (jong(n(e.body[e.body.length - 1])) ? '이' : '가') : '이'} 뒤의 표적에게 쏟아져 들어감`) : (e.s === 'drop' ?")
rep(P,"else if (e.k === 'wedge') s = `◆ 쐐기 ${e.s === 'form' ? '모임 — 끝 ' + n(e.tip) : e.s === 'breach' ? '박힘 — ' + n(e.b) + ' 쪽' :","else if (e.k === 'wedge') s = `◆ 쐐기 ${e.s === 'form' ? '모임 — 끝 ' + n(e.tip) : e.s === 'contact' ? '맞닿음 — ' + n(e.b) + ' (아직 못 뚫음)' : e.s === 'breach' ? '돌파 — ' + (e.why || n(e.b) + ' 쪽') :")
rep(P,"    else if (e.k === 'cmdCharge') s = `◆ 지휘 돌진 명령","    else if (e.k === 'hunt') s = `📋 사수 몰이 ${e.s === 'start' ? '시작 — ' + n(e.b) + ' (끊을 조 ' + e.ids.map(n).join(' · ') + ')' : e.s === 'close' ? '조여 들어감 — ' + (e.ids || []).map(n).join(' · ') : '끝 (' + e.why + ')'}`;\n    else if (e.k === 'cmdCharge') s = `◆ 지휘 돌진 명령")
# 이야기
rep(P,"      if (e.m === 'recall') return","""      if (e.m === 'bguard') return { c: 'bad', s: `${ga(A)} ${n(e.c)} 앞을 막아서며 ${n(e.b)} 쪽으로 방패를 든다.` };
      if (e.m === 'rejoin') return { c: 'dim', s: `${ga(A)} 물러나 본대 쪽으로 간다.` };
      if (e.m === 'kite') return { c: 'dim', s: `${ga(A)} 쏘고 나서 한 걸음 물러난다.` };
      if (e.m === 'recall') return""")
rep(P,"    case 'cmdHold': return null;   // v6.3.3 참은 까닭은 로그만","    case 'cmdHold': return null;   // v6.3.3 참은 까닭은 로그만\n    case 'hunt': return e.s === 'start' && Wd.units[e.b] && Wd.units[e.b].side === 0 && (e.ids || []).some(i => Wd.units[i].seenBy) ? { c: 'bad', s: `적 몇이 크게 돌아 ${n(e.b)}의 뒤쪽으로 간다 — 빠질 길을 막으려 한다!` } : e.s === 'close' && (e.ids || []).some(i => Wd.units[i].seenBy) ? { c: 'bad', s: `사방에서 ${n(e.b)}에게 조여 온다!` } : null;   // v6.5")
rep(P,"· 노출 병력 회수 ${c('recall')} · 보조 맞춤 ${c('pace')} · 합류 ${c('rush')}","· 노출 병력 회수 ${c('recall')} · 보조 맞춤 ${c('pace')} · 합류 ${c('rush')} · 순찰조 합류 ${c('rejoin')} · 거리 벌림 ${c('kite')} · 몸으로 막는 호위 ${c('bguard')}${G.some(e => e.k === 'hunt') ? ' / 사수 몰이 ' + G.filter(e => e.k === 'hunt' && e.s === 'start').length + '번 (쓰러뜨림 ' + G.filter(e => e.k === 'hunt' && e.s === 'end' && e.why === '쓰러뜨림').length + ')' : ''}")
rep(P,"    else if (e.k === 'mvr' && !['jink', 'near', 'scatter', 'pace', 'rush'].includes(e.m)","    else if (e.k === 'mvr' && !['jink', 'near', 'scatter', 'pace', 'rush', 'rejoin', 'rally', 'kite'].includes(e.m)")
