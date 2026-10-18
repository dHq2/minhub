# v7.0 page: 쏘기 방식 · 튕김 · 박힘 · 출혈 출처 · 교전 구속 · 낯선 무기 · 급소 서술
p='page10.tpl.html'; s=open(p).read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:90],s.count(a)); s=s.replace(a,b)
# 로그: 준비 줄 꼬리 (쏘기 방식 · 이동 사격 · 근접에 붙들림 · 낯선 무기)
rep("""        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비${!e.heal && e.w ? ' [' + e.w + ']' : ''} (${f2(e.end)}초에 ${e.heal ? '치유' : '맞음'})${e.why && e.why !== '공격' ? ' · ' + e.why : ''}""",
    """        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비${!e.heal && e.w ? ' [' + e.w + ']' : ''} (${f2(e.end)}초에 ${e.heal ? '치유' : '맞음'})${e.sm === 'aimed' ? ' · 조준사격 (관통 ×1.5 · 준비 ×1.5)' : e.sm === 'rapid' ? ' · 속사 (준비 ×0.6 · 관통 ×0.85)' : ''}${e.mv ? ' · 이동 사격 (옆으로 걸으며)' : ''}${e.tied ? ' · 근접 상대가 붙어 활이 더딤 ×1.5' : ''}${e.alien ? ' · 낯선 무기 (조준 ×0.6 · 준비 ×1.4)' : ''}${e.why && e.why !== '공격' ? ' · ' + e.why : ''}""")
# 로그: 출혈로 숨이 끊긴 마지막 피해는 '명중' 이 아님
rep("""        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.block ? '막힘' : '명중'} ${e.dmg} (${n(e.b)} ${e.hp}/${b.max})${tags.length ? ' · ' + tags.join(' · ') : ''}`); break; }""",
    """        if (e.tag === '출혈' || e.tag === '내출혈'){ out.push(`${T(e)}🩸 ${n(e.b)} ${e.tag} ${e.dmg} (${n(e.b)} ${e.hp}/${b.max}) — ${n(e.a)}${e.a === e.b ? '' : '이(가) 낸 상처'}${e.a !== e.b && !Wd.units[e.a].alive ? ' (' + n(e.a) + '은(는) 이미 쓰러짐)' : ''}`); break; }   // v7.0 명중이 아님
        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.block ? (e.dmg ? '막힘' : '막아 냄') : '명중'} ${e.dmg} (${n(e.b)} ${e.hp}/${b.max})${tags.length ? ' · ' + tags.join(' · ') : ''}`); break; }""")
rep("""        if (e.block) tags.push(`${ro(e.gn || guardName(b))} ${e.parry ? '받아 냄 ×' + ((R.parry || {}).mul || 0.5) : '막음 ×' + R.blockMul}${e.broke ? ' · 자세 무너짐!' : ''}`);""",
    """        if (e.block && !e.deflect) tags.push(`${ro(e.gn || guardName(b))} ${e.parry ? '받아 냄 ×' + ((R.parry || {}).mul || 0.5) : '막음 ×' + R.blockMul}${e.broke ? ' · 자세 무너짐!' : ''}`);
        else if (e.block && e.broke) tags.push('자세 무너짐!');""")
# 로그: 교전 구속 (모든 근접)
rep("""      case 'opportunity': out.push(`${T(e)}⚔ ${n(e.a)} 손 닿는 곳에서 빠지는 ${n(e.b)}에게 공짜 일격 (교전 구속 ×${(Wd.rules.line || {}).opp})`); break;""",
    """      case 'opportunity': out.push(`${T(e)}⚔ ${n(e.a)} 손 닿는 곳에서 ${e.line === false ? '등을 보이고 ' : ''}빠지는 ${n(e.b)}에게 공짜 일격 (교전 구속 ×${(Wd.rules.line || {}).opp}${e.line === false ? ' — 도약 · 피하기로 빠지면 안 맞음' : ''})`); break;""")
# 줍기: 낯선 무기
i=s.index("      case 'pickItem': { const pu = Wd.units[e.a]"); j=s.index("break; }",i); line=s[i:j]
assert "${e.own ? '' : ' · 이 판에서만 (다음 판엔 설계대로)'}" in line
line=line.replace("${e.own ? '' : ' · 이 판에서만 (다음 판엔 설계대로)'}","${e.own ? '' : ' · 이 판에서만 (다음 판엔 설계대로)'}${pu.alien && e.item === 'weapon' && !e.own ? ' · 낯선 무기 (조준 ×' + ((Wd.rules.alien || {}).aim || 0.6) + ' · 준비 ×' + ((Wd.rules.alien || {}).wind || 1.4) + ' · 점사 못 함 · 재장전 ×' + ((Wd.rules.alien || {}).reload || 1.5) + ')' : ''}",1)
s=s[:i]+line+s[j:]
# 이야기: 쏘기 방식 · 튕김 · 박힘 · 출혈 · 급소
rep("""    case 'wind': { const a = U(e.a), b = U(e.b), far = isFar(a);""", """    case 'wind': { const a = U(e.a), b = U(e.b), far = isFar(a);
      if (e.sm === 'aimed' && (a.side === 0 || !e.hid)) return { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} 시위를 끝까지 당겨 ${reul(b.name)} 겨눈다 — 갑옷을 꿰뚫을 한 발이다.` };   // v7.0 조준사격""")
rep("""      if (e.tag === '부딪힘') return { c: 'dim', s: `${ga(b.name)} 부딪혀 다친다 (−${e.dmg}).` };""",
    """      if (e.tag === '부딪힘') return { c: 'dim', s: `${ga(b.name)} 부딪혀 다친다 (−${e.dmg}).` };
      if (e.tag === '출혈' || e.tag === '내출혈') return null;   // v7.0 출혈로 숨이 끊김 → '쓰러짐' 에서
      if (e.deflect && (b.side === 0 || b.seenBy)){ const w = e.jav ? '창' : a.loud || /총/.test(a.weapon || '') ? '탄환' : '화살'; return { c: b.side === 0 ? 'good' : 'bad', s: `${a.name}의 ${w}이 ${b.name}의 ${e.block ? (e.gn === '팔' ? '팔 갑피' : '방패') : e.part === '머리' ? '투구' : '갑옷'}에 ${e.deflect === '튕김' ? '튕겨 나간다' : '박혀 멈춘다'}${e.dmg ? ' (−' + e.dmg + ', 충격)' : ''}.` }; }   // v7.0 못 뚫음
      if (e.shieldPen && (b.side === 0 || b.seenBy)) return { c: b.side === 0 ? 'bad' : 'good', s: `${a.name}의 ${e.jav ? '창' : a.loud ? '탄환' : '화살'}이 ${b.name}의 ${e.gn === '팔' ? '팔 갑피' : '방패'}를 꿰뚫고 들어간다 (−${e.dmg})!` };""")
rep("""      if (e.vital && !e.block) return { c: b.side === 0 ? 'bad' : 'good', s: `급소! ${a.name}의 ${e.jav ? '투창' : far ? (/총/.test(a.weapon || '') ? '총알' : '화살') : '일격'}이 ${b.name}의 ${e.vital === '머리' ? (e.tag && /하나/.test(e.tag) ? '머리 하나를' : '머리를') : '심장을'} 꿰뚫는다${v}.` };""",
    """      if (e.vital && !e.block) return e.hp > 0 ? { c: b.side === 0 ? 'bad' : 'good', s: `급소! ${a.name}의 ${e.jav ? '투창' : far ? (/총/.test(a.weapon || '') ? '총알' : '화살') : '일격'}이 ${b.name}의 ${e.vital === '머리' ? (e.tag && /하나/.test(e.tag) ? '머리 하나를' : '머리를') : '가슴 한가운데를'} 맞힌다${v}.` } : null;   // v7.0 꿰뚫음 · 즉사는 숨을 끊었을 때 '쓰러짐' 이 말함""")
open(p,'w').write(s); print('ok')
