def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
FN = r"""// v6.3.2 지휘관의 돌진 명령: 전열을 지키는 마디는 스스로 돌진하지 않음 (v6.3.1) — 지휘관이 빈틈을 보고 '들이받아!' 하면 대열을 박차고 돌격.
// 명령이 닿아야 함 (들리는 거리 · 말 못 하는 지휘관은 보여야 함). 한 번에 한 마디 · 3초에 한 번. 마디가 빠지면 전열에 구멍이라 스스로 돌진할 때보다 값을 더 따지고, 대치 · 버팀 · 후퇴 중이면 더 엄격
const cmdChgWhy = (W, u, f) => { const p = []; if (W.focus && W.focus.b === f.i) p.push('표적'); if (isFar(f)) p.push('사수'); if (f.act && f.act.k === 'reload') p.push('재장전 중'); else if (f.act && f.act.phase === 'wind') p.push('공격 준비 중'); const sd = sideOf(W, f, u); if (sd !== 'front') p.push(sd === 'back' ? '등 뒤' : '옆구리'); if (pHp(W, 1, f) < 0.5) p.push('다친 듯'); if (!f.canGuard || f.guardMode === 'off' || W.t < f.brokenT) p.push('막을 게 없음'); return p.join(' · ') || '빈틈'; };
function cmdCharge(W, mine, known){
  if (W.t < (W.cmdChgT || 0)) return; const R = W.rules.charge || {};
  const C = mine.filter(u => u.cmd && !u.down && W.t >= u.proneT && W.t >= (u.stunT || -9)).sort((a, b) => b.cmd - a.cmd)[0]; if (!C) return;
  let best = null;
  for (const u of mine){ if (!u.line || !u.canCharge || u.act || u.kb || u.crawl || W.t < u.chargeCd || W.t < u.proneT || W.t < u.brokenT || W.t < (u.stunT || -9)) continue;
    if (u !== C && !(C.mute ? canSee(W, u, C) : dist(u, C) <= (W.rules.hear || 9))) continue;   // 명령이 닿는 마디만
    for (const f of known){ if (!iKnow(W, 1, f)) continue; const g = gap(u, f); if (g < (R.min || 1.5) || g > (R.max || 5) || !(canSee(W, u, f) || canSee(W, C, f))) continue;
      const v = chargeValue(W, u, f) + (W.focus && W.focus.b === f.i ? 0.8 : 0) + (1 - pHp(W, 1, f)) * 0.8;
      if (!best || v > best.v) best = { u, f, v }; } }
  const S = W.stance[1] || {}, need = (R.worth != null ? R.worth : 1.8) + 0.3 + (S.k === 'hold' ? 0.5 : 0) + ((planOf(W, 1) || {}).chg || 0) - C.cmd * 0.1;
  if (!best) return; const k0 = W.log.length;
  if (best.v < need || !tryCharge(W, best.u, best.f, true)) return;
  W.cmdChgT = W.t + 3;
  L(W, { k: 'cmdCharge', side: 1, a: C.i, b: best.u.i, c: best.f.i, why: cmdChgWhy(W, best.u, best.f), mute: !!C.mute, self: C === best.u, obs: !!best.u.seenBy, cobs: !!C.seenBy, vis: true });
  W.log.splice(k0, 0, W.log.pop());   // 명령이 먼저, 돌진이 뒤
  if (W.fxOn && C !== best.u) W.fx.push({ k: 'say', a: C.i, s: C.mute ? '👉💢' : '들이받아!', t0: W.t });
}
function planWedge(W, mine, known){"""
rep(T,"function planWedge(W, mine, known){",FN)
rep(T,"if (side === 1 && known.length && awake){ planFocus(W, mine, known); planWedge(W, mine, known); planEncircle(W, mine, known); }   // v6.1 약한 고리 · 쐐기 · 포위","if (side === 1 && known.length && awake){ planFocus(W, mine, known); planWedge(W, mine, known); planEncircle(W, mine, known); if (!AI6.includes('cmdchg')) cmdCharge(W, mine, known); }   // v6.1 약한 고리 · 쐐기 · 포위 · v6.3.2 지휘관의 돌진 명령")
# 정보: 돌진을 시키는 놈 = 지휘
rep(T,"(l.side === 1 && (l.k === 'plan' || l.k === 'focus' || ((l.k === 'wedge' || l.k === 'env') && l.s === 'form')))","(l.side === 1 && (l.k === 'plan' || l.k === 'focus' || (l.k === 'cmdCharge' && !l.self) || ((l.k === 'wedge' || l.k === 'env') && l.s === 'form')))")
rep(T,"iTag(W, S, c, '지휘', c.mute ? (l.k === 'focus' ? '표적을 가리키며 포효' : '포효 · 몸짓에 무리가 따라 움직임')","iTag(W, S, c, '지휘', l.k === 'cmdCharge' ? (c.mute ? '가리키며 포효하자 ' + W.units[l.b].name + (jongE(W.units[l.b].name) ? '이' : '가') + ' 돌진' : '\"들이받아!\" — ' + W.units[l.b].name + (jongE(W.units[l.b].name) ? '이' : '가') + ' 돌진') : c.mute ? (l.k === 'focus' ? '표적을 가리키며 포효' : '포효 · 몸짓에 무리가 따라 움직임')")
rep(T,"module.exports = { intelTick,","module.exports = { cmdCharge, intelTick,")
# page
rep(P,"      case 'intel': out.push(","""      case 'cmdCharge': out.push(`${T(e)}◆ 적 지휘 (${n(e.a)}): ${e.self ? '지휘관이 직접 대열을 박차고 ' + n(e.c) + '에게 돌진' : n(e.b) + '에게 돌진 명령 → ' + n(e.c)} (${e.why}) — 전열에서 뛰쳐나감 (마디가 빠진 자리는 구멍)`); break;   // v6.3.2
      case 'intel': out.push(""")
rep(P,"    case 'judge': return null;   // v6.3 판단은 로그만","""    case 'judge': return null;   // v6.3 판단은 로그만
    case 'cmdCharge': return !e.obs ? null : { c: 'bad', s: e.self ? `${ga(n(e.a))} 대열을 박차고 직접 뛰쳐나온다!` : e.cobs ? `${ga(n(e.a))} ${e.mute ? '포효하며 가리키자' : '"들이받아!" 외치자'} ${ga(n(e.b))} 대열을 박차고 ${n(e.c)}에게 달려든다!` : `어디선가 명령이 떨어진 듯 — ${ga(n(e.b))} 대열을 박차고 ${n(e.c)}에게 달려든다!` };   // v6.3.2""")
rep(P,"    else if (e.k === 'ambush') s = `◆ 매복이 터짐","    else if (e.k === 'cmdCharge') s = `◆ 지휘 돌진 명령 (${n(e.a)}) — ${e.self ? '직접' : n(e.b)} → ${n(e.c)} (${e.why})`;\n    else if (e.k === 'ambush') s = `◆ 매복이 터짐")
rep(P,"${u.canCharge ? ' · 스스로는 돌진 안 함 (돌진 명령은 됨)' : ''}","${u.canCharge ? (u.side ? ' · 스스로는 돌진 안 함 (지휘관이 명령하면 돌격)' : ' · 스스로는 돌진 안 함 (돌진 명령은 됨)') : ''}")
# 버전
rep(P,"<!-- 굴의 전투판 v6.3.1 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v6.3.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v6.3.2: 적 지휘관의 돌진 명령 — 전열을 지키는 적 마디도 지휘관이 빈틈 (사수 · 재장전 · 공격 준비 · 옆 · 뒤 · 표적 · 다친 듯 · 막을 게 없음) 을 보고 명령하면 대열을 박차고 돌격. 명령이 닿아야 함 (들리는 거리, 말 못 하는 지휘관은 보여야), 한 번에 한 마디 · 3초에 한 번, 마디가 빠진 구멍까지 따져 스스로 돌진보다 엄격 (대치 · 버팀 · 후퇴 중이면 더). 지휘관이 쓰러지면 명령도 없음. 로그 · 이야기 · 초전 복기에 기록, 우리 쪽은 명령하는 모습을 보면 지휘관을 알게 됨.\n")
rep(P,'body.mob .top h1::after{content:" v6.3.1";','body.mob .top h1::after{content:" v6.3.2";')
rep(P,'<span class="ver">v6.3.1 · ','<span class="ver">v6.3.2 · 적 지휘관의 돌진 명령 · v6.3.1 · ')
rep(P,'<footer>굴의 전투판 v6.3.1 —','<footer>굴의 전투판 v6.3.2 —')
rep(P,"return `굴의 전투판 v6.3.1 · ${title}","return `굴의 전투판 v6.3.2 · ${title}")
