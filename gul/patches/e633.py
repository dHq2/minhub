import re
def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
s=open(T,encoding='utf-8').read()
a=s.index('// v6.3.2 지휘관의 돌진 명령'); b=s.index('function planWedge(W, mine, known){')
NEW = r"""// v6.3.2 지휘관의 돌진 명령: 전열을 지키는 마디는 스스로 돌진하지 않음 (v6.3.1) — 지휘관이 빈틈을 보고 '들이받아!' 하면 대열을 박차고 돌격.
// 명령이 닿아야 함 (들리는 거리 · 말 못 하는 지휘관은 보여야 함). 마디가 빠지면 전열에 구멍이라 스스로 돌진할 때보다 값을 더 따짐.
// v6.3.3 유연하게 — 정해진 틀 (한 명 · 3초) 대신 지휘관이 그때 상황을 읽음 (cmdSit): 우세 · 열세, 상대 총이 장전 중인지 겨누는지, 상대 전열이 무너졌는지,
// 대치가 길어지는지, 우리가 맞고만 있는지, 많이 잃었는지, 지난 돌격이 막혔는지, 작전 (밀어붙임 · 버팀 · 유인 · 후퇴). 기회가 크면 여럿을 한꺼번에 (함께 돌격),
// 불리하면 참게 함 (참은 까닭도 로그). 후퇴 중엔 쫓아오는 놈만 되받아침. 다음 명령까지의 틈도 상황 따라 (1.5 ~ 5초)
const cmdChgWhy = (W, u, f) => { const p = []; if (W.focus && W.focus.b === f.i) p.push('표적'); if (isFar(f)) p.push('사수'); if (f.act && f.act.k === 'reload') p.push('재장전 중'); else if (f.act && f.act.phase === 'wind') p.push('공격 준비 중'); const sd = sideOf(W, f, u); if (sd !== 'front') p.push(sd === 'back' ? '등 뒤' : '옆구리'); if (pHp(W, 1, f) < 0.5) p.push('다친 듯'); if (!f.canGuard || f.guardMode === 'off' || W.t < f.brokenT) p.push('막을 게 없음'); return p.join(' · ') || '빈틈'; };
function cmdSit(W, mine, known, C){
  const S = W.stance[1] || {}, pk = W.plan && W.plan.k, R = [], foes = W.units.filter(f => f.alive && f.side !== 1 && iKnow(W, 1, f));
  let d = 0, wave = 0;
  const ours = mine.reduce((s, u) => s + u.hp / u.max * (u.giant ? 2 : 1), 0), theirs = foes.reduce((s, f) => s + pHp(W, 1, f) * (f.giant ? 2 : 1), 0), ratio = ours / Math.max(0.5, theirs);
  if (ratio >= 1.6){ d -= 0.5; R.push('우리가 우세'); if (ratio >= 2.2) wave++; } else if (ratio < 0.8){ d += 0.5; R.push('열세'); }
  const guns = known.filter(f => isFar(f) && f.loud && (f.ammoMax == null || f.ammoMax > 0));
  if (guns.length && guns.every(g => (g.act && g.act.k === 'reload') || (g.ammoMax != null && g.ammo === 0))){ d -= 0.6; R.push(guns.some(g => g.ammo === 0) ? '상대 총이 빔' : '상대 총이 장전 중'); wave++; }
  const tanks = foes.filter(f => f.role === '전선' && !isFar(f));
  if (tanks.length && tanks.every(t => W.t < t.proneT || W.t < t.brokenT || W.t < (t.stunT || -9) || t.crawl)){ d -= 0.5; R.push('상대 탱커가 무너짐'); wave++; }
  if (S.k === 'hold'){ if (W.t - S.t0 < 6){ d += 0.5; R.push('대치 중'); } else { d -= 0.2; R.push('대치가 길어짐 — 깨야 함'); } }
  if ((W.farDmg[1] || 0) > 30){ d -= 0.3; R.push('맞고만 있을 순 없음'); }
  const dead = W.units.filter(u => u.side === 1 && !u.alive).length; if (dead >= 2 && ratio < 1.2){ d += 0.3; R.push(`${dead}명을 잃음 — 아낌`); }
  const LR = W.cmdChgLast; if (LR && W.t - LR.t < 8){ const u = W.units[LR.u], im = W.log.find(x => x.t >= LR.t && x.a === LR.u && (x.k === 'impact' || x.k === 'chargeMiss'));
    if (!u.alive || u.down || (im && (im.k === 'chargeMiss' || im.held))){ d += 0.4; R.push('지난 돌격이 막힘'); } else if (im && (im.setBroke || im.full)){ d -= 0.2; R.push('지난 돌격이 먹힘'); } }
  if (pk === 'assault' || pk === 'wedge'){ d -= 0.3; R.push('작전: ' + PLAN[pk].n); } else if (pk === 'hold' || pk === 'bait'){ d += pk === 'bait' && !(W.plan.lured) ? 0.6 : 0.3; R.push('작전: ' + PLAN[pk].n); }
  return { d, R, wave: wave >= 1 && ratio >= 0.9 ? Math.min(3, 1 + wave) : 1, ratio, wd: pk === 'withdraw' };
}
function cmdCharge(W, mine, known){
  if (W.t < (W.cmdChgT || 0)) return; const R = W.rules.charge || {};
  const C = mine.filter(u => u.cmd && !u.down && W.t >= u.proneT && W.t >= (u.stunT || -9)).sort((a, b) => b.cmd - a.cmd)[0]; if (!C) return;
  const M = mine.filter(u => u.line && u.canCharge && !u.act && !u.kb && !u.crawl && W.t >= u.chargeCd && W.t >= u.proneT && W.t >= u.brokenT && W.t >= (u.stunT || -9) && (u === C || (C.mute ? canSee(W, u, C) : dist(u, C) <= (W.rules.hear || 9))));   // 명령이 닿는 마디만
  if (!M.length) return;
  const sit = cmdSit(W, mine, known, C), base = (R.worth != null ? R.worth : 1.8) + 0.3 - C.cmd * 0.1, need0 = base + sit.d;
  const opts = [];
  for (const u of M) for (const f of known){ if (!iKnow(W, 1, f)) continue; const g = gap(u, f); if (g < (R.min || 1.5) || g > (R.max || 5) || !(canSee(W, u, f) || canSee(W, C, f))) continue;
    let v = chargeValue(W, u, f) + (W.focus && W.focus.b === f.i ? 0.8 : 0) + (1 - pHp(W, 1, f)) * 0.8, need = need0; const why = [];
    if (sit.wd){ if (!mine.some(m => m !== u && gap(m, f) < (f.rng || 0.5) + 1.2)) continue; need = base + 0.3; why.push('쫓아오는 놈을 되받아침'); }   // 후퇴 중: 동료에게 붙은 놈만
    if (mine.some(m => m !== u && (m.down || W.t < m.proneT || m.crawl) && gap(m, f) < (f.rng || 0.5) + 0.6)){ v += 0.6; why.push('쓰러진 동료를 구함'); }
    const gd = isFar(f) ? 0 : gunDanger(W, u, f.x, f.y); if (gd > 0){ need += 0.35 * gd; why.push('총이 겨눔'); }
    opts.push({ u, f, v, need, why }); }
  opts.sort((a, b) => (b.v - b.need) - (a.v - a.need));
  const go = [], usedU = new Set(), perF = {};
  for (const o of opts){ if (go.length >= sit.wave) break; if (usedU.has(o.u) || (perF[o.f.i] || 0) >= 2 || o.v < o.need) continue; go.push(o); usedU.add(o.u); perF[o.f.i] = (perF[o.f.i] || 0) + 1; }
  if (!go.length){ const o = opts[0];   // 노릴 만했는데 참게 함 — 까닭을 남김 (6초에 한 번)
    if (o && o.v >= base && W.t >= (W.cmdHoldT || 0)){ W.cmdHoldT = W.t + 6; L(W, { k: 'cmdHold', side: 1, a: C.i, b: o.u.i, c: o.f.i, why: [...sit.R, ...o.why].join(' · ') || '값이 모자람', vis: true }); }
    return; }
  let n = 0;
  for (const o of go){ const k0 = W.log.length; if (!tryCharge(W, o.u, o.f, true)) continue; n++;
    L(W, { k: 'cmdCharge', side: 1, a: C.i, b: o.u.i, c: o.f.i, why: cmdChgWhy(W, o.u, o.f), sit: [...sit.R, ...o.why].join(' · '), wave: go.length, k: 'cmdCharge', mute: !!C.mute, self: C === o.u, obs: !!o.u.seenBy, cobs: !!C.seenBy, vis: true });
    W.log.splice(k0, 0, W.log.pop());   // 명령이 먼저, 돌진이 뒤
    W.cmdChgLast = { u: o.u.i, t: W.t }; }
  if (!n) return;
  W.cmdChgT = W.t + (sit.R.includes('열세') || sit.R.some(x => /잃음|막힘/.test(x)) ? 5 : n > 1 || sit.d < -0.5 ? 1.5 : 3);
  if (W.fxOn && !go.every(o => o.u === C)) W.fx.push({ k: 'say', a: C.i, s: C.mute ? (n > 1 ? '👉👉💢' : '👉💢') : n > 1 ? '모두 들이받아!' : '들이받아!', t0: W.t });
}
"""
s=s[:a]+NEW+s[b:]
open(T,'w',encoding='utf-8').write(s)
rep(T,"module.exports = { cmdCharge, intelTick,","module.exports = { cmdSit, cmdCharge, intelTick,")
# page: 로그 · 이야기 · 복기
rep(P,"""      case 'cmdCharge': out.push(`${T(e)}◆ 적 지휘 (${n(e.a)}): ${e.self ? '지휘관이 직접 대열을 박차고 ' + n(e.c) + '에게 돌진' : n(e.b) + '에게 돌진 명령 → ' + n(e.c)} (${e.why}) — 전열에서 뛰쳐나감 (마디가 빠진 자리는 구멍)`); break;   // v6.3.2""","""      case 'cmdCharge': out.push(`${T(e)}◆ 적 지휘 (${n(e.a)}): ${e.self ? '지휘관이 직접 대열을 박차고 ' + n(e.c) + '에게 돌진' : n(e.b) + '에게 돌진 명령 → ' + n(e.c)} (${e.why})${e.wave > 1 ? ' · 함께 돌격 ' + e.wave + '명' : ''} — 전열에서 뛰쳐나감${e.sit ? ' · 그때 상황: ' + e.sit : ''}`); break;   // v6.3.2 · v6.3.3 상황
      case 'cmdHold': out.push(`${T(e)}◆ 적 지휘 (${n(e.a)}): ${n(e.b)}의 돌격을 참게 함 — ${reul(n(e.c))} 노릴 만했지만 (${e.why})`); break;   // v6.3.3""")
rep(P,"""    case 'cmdCharge': return !e.obs ? null : { c: 'bad', s: e.self ? `${ga(n(e.a))} 대열을 박차고 직접 뛰쳐나온다!` : e.cobs ? `${ga(n(e.a))} ${e.mute ? '포효하며 가리키자' : '"들이받아!" 외치자'} ${ga(n(e.b))} 대열을 박차고 ${n(e.c)}에게 달려든다!` : `어디선가 명령이 떨어진 듯 — ${ga(n(e.b))} 대열을 박차고 ${n(e.c)}에게 달려든다!` };   // v6.3.2""","""    case 'cmdCharge': { if (!e.obs) return null; const k = 'cc' + e.t; if (narr.ccT === k) return null; narr.ccT = k;   // 함께 돌격은 한 줄로
      const who = e.wave > 1 ? Wd.log.filter(x => x.k === 'cmdCharge' && x.t === e.t).map(x => n(x.b)).join(' · ') : n(e.b);
      return { c: 'bad', s: e.self && e.wave < 2 ? `${ga(n(e.a))} 대열을 박차고 직접 뛰쳐나온다!` : e.cobs ? `${ga(n(e.a))} ${e.mute ? '포효하며 가리키자' : e.wave > 1 ? '"모두 들이받아!" 외치자' : '"들이받아!" 외치자'} ${ga(who)} 대열을 박차고 ${e.wave > 1 ? '한꺼번에 달려든다!' : n(e.c) + '에게 달려든다!'}` : `어디선가 명령이 떨어진 듯 — ${ga(who)} 대열을 박차고 ${e.wave > 1 ? '한꺼번에 달려든다!' : n(e.c) + '에게 달려든다!'}` }; }   // v6.3.2 · v6.3.3 함께 돌격
    case 'cmdHold': return null;   // v6.3.3 참은 까닭은 로그만""")
rep(P,"    else if (e.k === 'cmdCharge') s = `◆ 지휘 돌진 명령 (${n(e.a)}) — ${e.self ? '직접' : n(e.b)} → ${n(e.c)} (${e.why})`;","    else if (e.k === 'cmdCharge') s = `◆ 지휘 돌진 명령 (${n(e.a)}) — ${e.self ? '직접' : n(e.b)} → ${n(e.c)} (${e.why})${e.wave > 1 ? ' · 함께 ' + e.wave + '명' : ''}${e.sit ? ' · ' + e.sit : ''}`;")
# 복기: 지휘관의 돌격 판단 요약
rep(P,"""  if (tp.length){ o.push('흐름 (갈림길)');""","""  { const cc = G.filter(e => e.k === 'cmdCharge'), ch = G.filter(e => e.k === 'cmdHold');   // v6.3.3 적 지휘관의 돌격 판단
    if (cc.length || ch.length){ const top = L => { const m = {}; for (const e of L) for (const x of (e.sit || e.why || '').split(' · ').filter(Boolean)) m[x] = (m[x] || 0) + 1; return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'; };
      o.push(`적 지휘관의 돌격 판단: 명령 ${new Set(cc.map(e => e.t)).size}번 (마디 ${cc.length}명${cc.some(e => e.wave > 1) ? ' · 함께 돌격 ' + new Set(cc.filter(e => e.wave > 1).map(e => e.t)).size + '번' : ''}) · 참게 함 ${ch.length}번`);
      if (cc.length) o.push(`  명령할 때 본 상황: ${top(cc)}`); if (ch.length) o.push(`  참게 한 까닭: ${top(ch)}`); } }
  if (tp.length){ o.push('흐름 (갈림길)');""")
# 버전
rep(P,"<!-- 굴의 전투판 v6.3.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v6.3.3 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v6.3.3: 적 지휘관의 돌진 명령을 유연하게 — 정해진 틀 (한 명 · 3초) 대신 그때 상황을 읽음: 우세 · 열세 (짐작한 힘), 상대 총이 장전 중 · 비었는지 · 겨누는지, 상대 탱커가 무너졌는지, 대치가 길어지는지, 맞고만 있는지, 많이 잃었는지, 지난 돌격이 막혔는지 · 먹혔는지, 작전. 기회가 크면 여럿이 함께 돌격 (최대 3명), 쓰러진 동료 곁의 적은 구하러, 후퇴 중엔 쫓아오는 놈만 되받아침, 불리하면 참게 하고 까닭을 로그에. 다음 명령까지 1.5 ~ 5초도 상황 따라. 초전 복기에 '적 지휘관의 돌격 판단' 요약.\n")
rep(P,'body.mob .top h1::after{content:" v6.3.2";','body.mob .top h1::after{content:" v6.3.3";')
rep(P,'<span class="ver">v6.3.2 · 적 지휘관의 돌진 명령 · ','<span class="ver">v6.3.3 · 지휘관의 돌진 명령은 상황 따라 (함께 돌격 · 참음) · v6.3.2 · ')
rep(P,'<footer>굴의 전투판 v6.3.2 —','<footer>굴의 전투판 v6.3.3 —')
rep(P,"return `굴의 전투판 v6.3.2 · ${title}","return `굴의 전투판 v6.3.3 · ${title}")
