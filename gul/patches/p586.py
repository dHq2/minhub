import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.8.5 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.8.6 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.8.6: 아주 가까우면 돌진이 아니라 밀치기.
             · 돌진 명령인데 상대가 1.5칸 (돌격 거리) 안이면 돌진하지 않고 다가가 밀침 — 방패가 있으면 방패 밀치기, 없으면 몸 (어깨) 밀치기 (피해 · 자세 깎기 ½ · 미는 힘 ¾). 돌진 대기는 쓰지 않음.
             · 달린 거리가 1칸도 안 되고 부딪히면 (상대가 마주 들어와 도움닫기가 끊김 등) 밀치기 수준 — 휘청 없음 · 덜 눌림.
               그 위로는 휘청이 달려온 만큼 (1칸 ½ → 3칸 전력질주 1배). 짧은 돌격의 피해 바닥도 ×0.5 → ×0.25.
""",'notes')
rep('<span class="ver">v5.8.5 · 기술 대기 ½','<span class="ver">v5.8.6 · 가까우면 밀치기 · v5.8.5 · 기술 대기 ½','ver')
rep("<footer>굴의 전투판 v5.8.5","<footer>굴의 전투판 v5.8.6",'footer')
rep("return `굴의 전투판 v5.8.5 · ${title}","return `굴의 전투판 v5.8.6 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.8.5\";","body.mob .top h1::after{content:\" v5.8.6\";",'mobver')
rep("  S.v585 = true; }",
    "  S.v585 = true; }\nif (!S.v586){ for (const g of ['charge', 'bash']){ const c = S.rules[g], d = DEFAULT_RULES[g]; if (c && d) for (const j in d) if (c[j] === undefined) c[j] = d[j]; } S.v586 = true; }   // v5.8.6 밀치기 수준 · 몸 밀치기",'migr')
rep("  if (a.k === 'bash') return a.ph === 'wind' ? `방패 밀치기 → ${b ? b.name : ''}` : '방패 밀친 뒤';",
    "  if (a.k === 'bash') return a.ph === 'wind' ? `${a.body ? '몸 밀치기' : '방패 밀치기'} → ${b ? b.name : ''}` : (a.body ? '몸으로 밀친 뒤' : '방패 밀친 뒤');",'actLabel')
rep("const liveAct = (Wd, u) => u.act ? { k: u.act.k, ph: u.act.phase,","const liveAct = (Wd, u) => u.act ? { body: !!u.act.body, k: u.act.k, ph: u.act.phase,",'liveAct')
rep("  '방패 밀치기': '방패 밀치기',","  '방패 밀치기': '방패 밀치기', '몸 밀치기': '몸 밀치기', '밀치러': '밀치러',",'mood')
rep("bash: '방패로 밀침', charge:","bash: '방패로 밀침', body: '어깨로 밀침', charge:",'shoveLog')
rep("      if (e.tag === '방패 밀치기') return null;","      if (e.tag === '방패 밀치기' || e.tag === '몸 밀치기') return null;",'hitNarr')
rep("        if (e.bash){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 방패 밀치기 준비${e.why ? ' · ' + e.why : ''}`); break; }",
    "        if (e.bash){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.body ? '몸 (어깨) 밀치기' : '방패 밀치기'} 준비${e.why ? ' · ' + e.why : ''}`); break; }",'windLog')
rep("      if (e.bash) return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} 방패를 앞세워",
    "      if (e.bash && e.body) return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} 어깨를 낮추고 ${reul(b.name)} 밀쳐 내려 한다${e.why === '돌진하기엔 가까움' ? ' — 달려들기엔 너무 가깝다.' : '.'}` };   // v5.8.6\n      if (e.bash) return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} 방패를 앞세워",'windNarr')
# 너무 가까움 · 밀치기 수준 부딪힘
rep("      case 'chargeMiss': out.push(",
    "      case 'tooClose': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 돌진하기엔 너무 가까움 (${e.gap}칸 < ${(Wd.rules.charge || {}).min || 1.5}칸) — 다가가 밀침`); break;   // v5.8.6\n      case 'chargeMiss': out.push(",'tooCloseLog')
rep("    case 'chargeMiss': return {",
    "    case 'tooClose': return e.vis ? { c: 'dim', s: `${n(e.b)}${jong(n(e.b)) ? '이' : '가'} 너무 가깝다 — ${ga(n(e.a))} 달려드는 대신 밀치러 간다.` } : null;   // v5.8.6\n    case 'chargeMiss': return {",'tooCloseNarr')
rep("      if (e.trained) return { c: U(e.b).side",
    "      if (e.push) return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 제대로 달리지 못한 채 ${reul(n(e.b))} 밀어붙인다 — 밀치는 정도다.` };   // v5.8.6 도움닫기가 1칸도 안 됨\n      if (e.trained) return { c: U(e.b).side",'pushNarr')
rep("${e.vr ? ' (부딪힌 속력 ' + e.vr + (e.run != null ? ' · ' + e.run + '칸 달림' + (e.full ? ' · 전력질주' : '') : '') + ')' : ''}",
    "${e.vr ? ' (부딪힌 속력 ' + e.vr + (e.run != null ? ' · ' + e.run + '칸 달림' + (e.full ? ' · 전력질주' : e.push ? ' · 밀치기 수준 (휘청 없음)' : '') : '') + ')' : ''}",'impLog')
rep("· 준비 ${(Wd.rules.charge || {}).wind}초 · 대기 ${(Wd.rules.charge || {}).cd}초",
    "· 준비 ${(Wd.rules.charge || {}).wind}초 · 대기 ${(Wd.rules.charge || {}).cd}초 · ${(Wd.rules.charge || {}).min || 1.5}칸보다 가까우면 돌진 대신 ${u.shield ? '방패' : '몸 (어깨)'} 밀치기 · 1칸도 못 달리고 부딪히면 밀치는 정도 (휘청 없음)",'detTxt')
open(P,'w').write(s); print('ok')
