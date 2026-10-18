import re
def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
# engine: 쓰러뜨림 ([불사] 쓰러짐 포함) · 직접 본 초병도 거리
rep(T,"else if (l.k === 'die' && a && b && a.side !== b.side && sees(b.side, a)) iRec(W, b.side, a).kills++;","else if ((l.k === 'die' || l.k === 'down') && a && b && a.side !== b.side && sees(b.side, a)) iRec(W, b.side, a).kills++;")
rep(T,"L(W, { k: 'sentry', side: 1, a: u.i, b: seen[0].i, sentry: !!u.sentry, patrol: !!u.patrol, surprise: W.alarm1.surprise, vis: true });","L(W, { k: 'sentry', side: 1, a: u.i, b: seen[0].i, sentry: !!u.sentry, patrol: !!u.patrol, surprise: W.alarm1.surprise, d: +dist(u, seen[0]).toFixed(1), vis: true });")
# page: 로그 줄
rep(P,"      case 'plan': out.push(","""      case 'intel': out.push(`${T(e)}${e.side ? '◆ 적이 알게 됨' : '◇ 우리가 알게 됨'}: ${n(e.b)} — ${e.first ? '처음 봄 · 겉모습 ' + e.tag : e.tag + ' (' + e.why + ')'}`); break;   // v6.3 양쪽 다 본 것 · 겪은 것만 앎
      case 'judge': out.push(`${T(e)}${e.side ? '◆ 적의 판단' : '◇ 우리 판단 (자동)'}: 가장 위험 ${e.d != null ? n(e.d) + ' (' + e.dWhy + ')' : '아직 모름'} · 전장의 중심 ${e.c != null ? n(e.c) + ' (' + e.cWhy + ')' : '아직 모름'}`); break;
      case 'plan': out.push(""")
rep(P,"case 'sentry': out.push(`${T(e)}📋 적의 ${e.sentry ? '초병' : e.patrol ? '순찰조' : '본대'} ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} ${e.light ? n(e.b) + '의 횃불을 봄 (' + e.d + '칸)' : reul(n(e.b)) + ' 봄'}","case 'sentry': out.push(`${T(e)}📋 적의 ${e.sentry ? '초병' : e.patrol ? '순찰조' : '본대'} ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} ${e.light ? n(e.b) + '의 횃불을 봄 (' + e.d + '칸)' : reul(n(e.b)) + ' 봄' + (e.d != null ? ' (' + e.d + '칸)' : '')}")
# page: 이야기 (적이 아는 것 · 판단은 우리가 모름. 우리 쪽은 지휘하는 놈만)
rep(P,"    case 'plan': return null;   // v6.2","""    case 'judge': return null;   // v6.3 판단은 로그만
    case 'intel': return e.side || e.tag !== '외침' ? null : { c: 'dim', s: `${ga(n(e.b))} 자꾸 소리친다 — 저놈이 지휘하는 것 같다.` };
    case 'plan': return null;   // v6.2""")
rep(P,"box.textContent = logHeader(Wd, logTitle) + logLines(Wd).join('\\n') + resultLine(Wd) + cmdSummary(Wd);   // v5.8.8 유저 지휘 요약","box.textContent = logHeader(Wd, logTitle) + logLines(Wd).join('\\n') + resultLine(Wd) + cmdSummary(Wd) + reviewSummary(Wd);   // v5.8.8 유저 지휘 요약 · v6.3 초전 복기")
