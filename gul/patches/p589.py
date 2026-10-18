import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.8.8 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.8.9 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.8.9: 규칙 확정 (로그 분석에서 나온 넷).
             · 플레이어 명령이 자동 치료보다 먼저: 명령 (이동 · 공격 · 돌진 · 줍기 …) 을 받은 동안엔 스스로 치료하러 가지 않음 ('제자리' 면 그 자리에서 닿을 때만).
               대신 로그에 '✚ 치료 보류 — 이동 명령 중 (레베카 30%)' 를 그 명령마다 한 번. 명령이 끝나면 (자리에 닿음 · 취소 · 자동) 다시 스스로 치료.
             · 자세 무너짐 (2초) = 몸을 실어야 하는 것을 못 함: 막기 · 태세 · 방패 밀치기 · 돌진. 걷기 · 보통 공격은 됨. 돌진 명령은 추스를 때까지 기다림 (로그에 '돌진 대기 — 자세 무너짐').
             · 조를 나눠 우회시키는 것은 지휘: 가장 높은 지휘관이 B (지휘B) 부터. 지휘관이 쓰러지거나 낮으면 새 우회 조 없음, 있던 우회 조도 흩어짐 (로그에 남김).
             · 들고 있는 것을 로그 머리에 분명히 (무기 · 방패 있음 / 없음 · 막는 폭 · 막는 것). 줍기는 누구 것을 주웠는지 · 방패가 없던 손인지까지.
               (방패를 든 인물은 방패를 주우러 갈 수 없음 — 명령 · 자동 모두 막힘. 줍기 전 방패가 사라졌다면 그 앞에 '방패 떨어뜨림 (팔을 잃어 · 쓰러지며)' 이 남음)
""",'notes')
rep('<span class="ver">v5.8.8 · 로그에 유저 지휘','<span class="ver">v5.8.9 · 명령이 자동 치료보다 먼저 · 자세 무너짐 규칙 · 조 나누기는 지휘 · v5.8.8 · 로그에 유저 지휘','ver')
rep("<footer>굴의 전투판 v5.8.8","<footer>굴의 전투판 v5.8.9",'footer')
rep("return `굴의 전투판 v5.8.8 · ${title}","return `굴의 전투판 v5.8.9 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.8.8\";","body.mob .top h1::after{content:\" v5.8.9\";",'mobver')
rep("' · 방어 ±' + u.gArc + '°' + (u.shield ? ' (방패)' : '')",
    "' · 막는 폭 ±' + Math.round(guardArc(Wd, u)) + '° (' + guardName(u) + ')'",'hdrGuard')
rep("${u.weapon ? u.weapon + ' ' : ''}사거리 ${u.rng0 != null ? u.rng0 : u.rng}",
    "든 것 ${u.weapon || '맨손'} + ${u.shield ? '방패' : '방패 없음'} · 사거리 ${u.rng0 != null ? u.rng0 : u.rng}",'hdrGear')
rep("      case 'pickItem': out.push(`${T(e)}${n(e.a)} ${e.name} ${e.own ? '다시 ' : ''}주움${e.item === 'shield' ? ' — 방패를 듦 (방어 자세 · 밀치기 · 방패 돌진)' : ''} · ${coord(e.x, e.y)}`); break;",
    "      case 'pickItem': out.push(`${T(e)}${n(e.a)} ${e.name} ${e.own ? '다시 ' : ''}주움${e.from != null && !e.own && Wd.units[e.from] ? ' (' + n(e.from) + '이 떨어뜨린 것)' : ''}${e.item === 'shield' ? ' — 방패가 없던 손에 듦 (방어 자세 · 밀치기 · 방패 돌진)' : ''} · ${coord(e.x, e.y)}`); break;",'pickLog')
rep("      case 'pickFail': out.push(`${T(e)}${n(e.a)} ${e.name} 못 집음`); break;",
    """      case 'pickFail': out.push(`${T(e)}${n(e.a)} ${e.name} 못 집음`); break;
      case 'healHeld': out.push(`${T(e)}✚ ${n(e.a)} 치료 보류 — ${{ move: '이동', amove: '공격 이동', attack: '공격', charge: '돌진', throw: '투창', pick: '줍기', line: '전열', hold: '제자리', leap: '도약' }[e.o] || e.o} 명령 중 (${n(e.b)} 체력 ${e.hp}%${e.bleed ? ' · 피 흘림' : ''}${e.down ? ' · 쓰러짐' : ''}) — 명령이 먼저. 치료하려면 약 명령, 명령이 끝나면 다시 스스로`); break;   // v5.8.9
      case 'chargeWait': out.push(`${T(e)}${n(e.a)} 돌진 대기 — ${e.why} (${e.sec}초 뒤 추스름 · 그때 뜀)`); break;
      case 'squadEnd': out.push(`${T(e)}◆ 적 지휘: 우회 조가 흩어짐 — ${e.why} (${e.a.map(n).join(' · ')} 각자 싸움)`); break;""",'logs')
rep("    case 'tooClose': return e.vis ?",
    """    case 'healHeld': return { c: 'dim', s: `${ga(n(e.a))} 명령대로 움직인다 — ${n(e.b)}(${e.hp}%)${e.down ? '는 쓰러져 있다' : ''}를 돌보려면 따로 명령해야 한다.` };   // v5.8.9
    case 'chargeWait': return e.vis && U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 무너진 자세를 추스른다 — 아직 달려들 수 없다.` } : null;
    case 'squadEnd': return e.vis ? { c: 'good', s: `지휘를 잃은 적의 우회 조가 흩어진다 — 이제 각자 싸운다.` } : null;
    case 'tooClose': return e.vis ?""",'narr')
rep("  '방패 밀치기': '방패 밀치기', '몸 밀치기': '몸 밀치기',","  '자세를 추스름': '추스르는 중', '방패 밀치기': '방패 밀치기', '몸 밀치기': '몸 밀치기',",'mood')
# 유저 지휘 상황: 줍기면 든 것 · 물건
rep("    else if (o && o.x != null) p.push(`→ ${coord(o.x, o.y)} (${Math.hypot(o.x - u.x, o.y - u.y).toFixed(1)}칸)`);",
    "    else if (o && o.k === 'pick' && o.id != null){ const it = (Wd.items || []).find(x => x.id === o.id); p.push(`든 것: ${u.weaponNow || u.weapon || '맨손'} + ${u.shield ? '방패' : '방패 없음'}`); if (it) p.push(`→ ${it.name}${it.owner != null && Wd.units[it.owner] && it.owner !== u.i ? ' (' + Wd.units[it.owner].name + '이 떨어뜨린 것)' : ''} · ${Math.hypot(it.x - u.x, it.y - u.y).toFixed(1)}칸`); }   // v5.8.9\n    else if (o && o.x != null) p.push(`→ ${coord(o.x, o.y)} (${Math.hypot(o.x - u.x, o.y - u.y).toFixed(1)}칸)`);",'ctxPick')
open(P,'w').write(s); print('ok')
