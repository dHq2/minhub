def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
FN = r"""// v6.3 초전 복기 (로그 끝): 처음 상황 · 누가 먼저 봤나 · 경보 · 작전 · 표적 · 첫 피 · 갈림길 · 양쪽이 그때 알게 된 것 · 판단
function reviewSummary(Wd){
  const G = Wd.log, U = i => Wd.units[i], n = i => U(i) ? U(i).name : '?', at = e => f2(e.t) + '초', ff = f => G.find(f), isX = e => U(e.a) && U(e.b) && U(e.a).side !== U(e.b).side;
  const st = ff(e => e.k === 'start'), se = ff(e => e.k === 'sentry'), co = ff(e => e.k === 'contact');
  if (!st && !se && !co) return '';
  const o = ['', '── 초전 복기 (어떻게 처음 만났고 어떻게 흘러갔나) ──'], who = e => e.sentry ? '초병' : e.patrol ? '순찰조' : '본대';
  if (st) o.push(`적의 처음 상황 (그때 우리는 몰랐음): ${st.desc}`);
  o.push('누가 먼저 봤나');
  if (se) o.push(`  ${at(se)} 적 ${who(se)} ${ga(n(se.a))} ${se.light ? n(se.b) + '의 횃불을 봄' : reul(n(se.b)) + ' 직접 봄'}${se.d != null ? ' (' + se.d + '칸)' : ''}${se.surprise ? ' — 그때 우리는 적을 못 봄' : ' — 서로 봄'}`);
  if (co) o.push(`  ${at(co)} 우리 ${co.a != null ? ga(n(co.a)) : '누군가'} 처음 적을 봄 — ${n(co.b)} (${co.dir}쪽 ${co.d}칸)`);
  o.push(se && co ? `  → ${se.t < co.t - 0.05 ? `적이 ${(co.t - se.t).toFixed(1)}초 먼저 앎${se.light ? ' (횃불)' : ''}` : co.t < se.t - 0.05 ? `우리가 ${(se.t - co.t).toFixed(1)}초 먼저 봄` : '거의 동시에 봄'}` : se ? '  → 우리는 적을 한 번도 먼저 보지 못함' : '  → 적은 우리를 끝까지 알아채지 못함');
  const al = ff(e => e.k === 'alarm'), pl = ff(e => e.k === 'plan' && e.side === 1), fo = ff(e => e.k === 'focus'), h1 = ff(e => e.k === 'hit' && isX(e)), k1 = ff(e => (e.k === 'die' || e.k === 'down') && isX(e));
  if (al || pl || fo){ o.push('적이 움직이기 시작함 (우리는 몰랐음)');
    if (al) o.push(`  ${at(al)} 경보 — ${(al.n || []).map(n).join(' · ') || '모두 이미 움직이는 중'} → 본 그 자리로`);
    if (pl) o.push(`  ${at(pl)} 첫 작전: ${PLAN_K[pl.p] || pl.p}${pl.why ? ' (' + pl.why + ')' : ''}`);
    if (fo) o.push(`  ${at(fo)} 첫 표적: ${n(fo.b)} — ${fo.why}`); }
  if (h1 || k1){ o.push('첫 피');
    if (h1) o.push(`  ${at(h1)} ${n(h1.a)} → ${n(h1.b)} −${h1.dmg}${h1.dark ? ' (보이지 않는 곳에서)' : ''}${h1.dir === 'back' ? ' · 뒤' : h1.dir === 'side' ? ' · 측면' : ''} — ${U(h1.a).side ? '적이 먼저 피를 냄' : '우리가 먼저 피를 냄'}`);
    if (k1) o.push(`  ${at(k1)} 처음 쓰러짐: ${n(k1.b)} (${n(k1.a)})${k1.k === 'down' ? ' — [불사]' : ''}`); }
  // 갈림길: 작전 · 표적이 바뀜, 쐐기 · 포위 · 매복, 진형이 풀림, 쓰러짐 · 일어남
  const tp = [];
  for (const e of G){ let s = null;
    if (e.k === 'plan' && e.side === 1 && e !== pl) s = `◆ 적 작전 ${e.was ? (PLAN_K[e.was] || e.was) + ' → ' : ''}${PLAN_K[e.p] || e.p}${e.why ? ' (' + e.why + ')' : ''}`;
    else if (e.k === 'focus' && e !== fo) s = `◆ 적 표적 ${e.was != null ? n(e.was) + ' → ' : ''}${n(e.b)} (${e.why})`;
    else if (e.k === 'wedge') s = `◆ 쐐기 ${e.s === 'form' ? '모임 — 끝 ' + n(e.tip) : e.s === 'breach' ? '박힘 — ' + n(e.b) + ' 쪽' : '끝 (' + e.why + ')'}`;
    else if (e.k === 'env') s = `◆ 포위 ${e.s === 'form' ? '벌림' : e.s === 'rear' ? '— ' + ga(n(e.a)) + ' 뒤로 들어옴' : '끝 (' + e.why + ')'}`;
    else if (e.k === 'ambush') s = `◆ 매복이 터짐 (${e.why === 'hit' ? '들켜 맞음' : e.why === 'near' ? '곁으로 옴' : '때가 됨'})`;
    else if (e.k === 'stance' && e.s === 'free') s = `${e.side ? '◆ 적' : '◇ 우리'} 진형 풀림${e.why ? ' — ' + e.why : ''}`;
    else if ((e.k === 'die' || e.k === 'down') && U(e.b)) s = `✕ ${n(e.b)} ${e.k === 'down' ? '쓰러짐 ([불사])' : '쓰러짐'}${e.a !== e.b && U(e.a) ? ' (' + n(e.a) + ')' : ''}`;
    else if (e.k === 'rise') s = `↑ ${n(e.a)} 다시 일어남`;
    if (s) tp.push(`  ${padW(at(e), 8)} ${s}`); }
  if (tp.length){ o.push('흐름 (갈림길)'); o.push(...tp.slice(0, 30)); if (tp.length > 30) o.push(`  … ${tp.length - 30}줄 더 (위 로그)`); }
  // 양쪽이 알게 된 것 — 짐작한 체력과 진짜가 얼마나 달랐는지도
  for (const S of [1, 0]){ const I = (Wd.intel || [])[S] || {};
    o.push(S ? '적이 우리에 대해 알게 된 것' : '우리가 적에 대해 알게 된 것');
    for (const f of Wd.units.filter(x => x.side !== S)){ const r = I[f.i];
      if (!r || r.seenT == null){ o.push(`  ${padW(f.name, 14)} 끝까지 못 봄`); continue; }
      const f0 = ff(e => e.k === 'intel' && e.side === S && e.b === f.i && e.first), ev = G.filter(e => e.k === 'intel' && e.side === S && e.b === f.i && !e.first).map(e => `${f2(e.t)}초 ${e.tag}`);
      o.push(`  ${padW(f.name, 14)} ${f2(r.seenT)}초 처음 봄${f0 ? ' (' + f0.tag + ')' : ''}${ev.length ? ' · ' + ev.join(' · ') : ''} · 짐작 체력 ${r.guess} (진짜 ${f.max}) · 준 피해 ${Math.round(r.dmg)}${r.dealt ? ' · 받은 피해 ' + Math.round(r.dealt) : ''}${r.kills ? ' · 쓰러뜨림 ' + r.kills : ''}`); }
    const js = G.filter(e => e.k === 'judge' && e.side === S);
    if (js.length) o.push(`  판단: ${js.slice(-6).map(e => `${f2(e.t)}초 위험 ${e.d != null ? n(e.d) : '?'} · 중심 ${e.c != null ? n(e.c) : '?'}`).join(' → ')}${js.length > 6 ? ` (앞의 ${js.length - 6}번은 위 로그)` : ''}`); }
  return o.join('\n') + '\n';
}
// 기술 대상 고르기: 고른 시전자 (skillPick) 에게 '그 아군에게 약' 명령"""
rep(P,"// 기술 대상 고르기: 고른 시전자 (skillPick) 에게 '그 아군에게 약' 명령",FN)
