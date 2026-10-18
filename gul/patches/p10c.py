s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
# ---- log header
rep("""  const who = s => Wd.units.filter(u => u.side === s).map(u => `  ${padW(u.name, 14)} ${padW(coord(u.home.x, u.home.y), 4)} ${u.tier}등급 ${padW(u.cls, 6)} 체력 ${u.max} · 공격 ${u.atk} · 속력 ${u.spd}칸/초 (이동 ${(u.spd * R.turn).toFixed(1)}칸/턴) · 준비 ${u.wind} + 회복 ${u.rec}초 · ${u.weapon ? u.weapon + ' ' : ''}사거리 ${u.rng}${u.hero ? ' · 주인공 (횃불 ' + R.heroLight + '칸)' : ''}${u.nv ? ' · 야시' : ''}${u.shield ? ' · 방패' : ''}${(u.traits || []).map(t => ' · [' + t + ']').join('')}`).join('\\n');
  return `굴의 전투판 v3.4 · ${title}\\n맵: ${m} · 한 턴 ${R.turn}초 · 보는 거리 ${R.sight}칸 · 놓인 횃불 ${Wd.torches.length}개 · 근접 빗나감 여유 ${R.reach}칸\\n방향: 앞 ±${R.frontArc}° · 측면 피해 ×${R.flankSide} · 뒤 ×${R.flankBack} · 방패 앞쪽 피해 ×${R.shieldFront}\\n아군\\n${who(0)}\\n적\\n${who(1)}\\n`;""",
"""  const who = s => Wd.units.filter(u => u.side === s).map(u => `  ${padW(u.name, 14)} ${padW(coord(u.home.x, u.home.y), 4)} ${u.tier}등급 ${padW(u.cls, 6)} 체력 ${u.max} · 공격 ${u.atk} · 속력 ${u.spd}칸/초 (이동 ${(u.spd * R.turn).toFixed(1)}칸/턴) · 준비 ${u.wind} + 회복 ${u.rec}초 · ${u.weapon ? u.weapon + ' ' : ''}사거리 ${u.rng}${u.ammo != null ? ' · 탄 ' + u.ammo + (u.loud ? ' (총성)' : '') : ''} · 대담함 ${u.bold}${u.hero ? ' · 주인공 (횃불 ' + R.heroLight + '칸)' : ''}${u.nv ? ' · 야시' : ''}${u.shield ? ' · 방패 (방어 자세)' : u.canGuard ? ' · 방어 자세 (' + u.weapon + ')' : ''}${(u.traits || []).map(t => ' · [' + t + ']').join('')}`).join('\\n');
  return `굴의 전투판 v4.0 · ${title}\\n맵: ${m} · 한 턴 ${R.turn}초 · 보는 거리 ${R.sight}칸 · 놓인 횃불 ${Wd.torches.length}개 · 근접 빗나감 여유 ${R.reach}칸\\n방향: 앞 ±${R.frontArc}° · 측면 피해 ×${R.flankSide} · 뒤 ×${R.flankBack}\\n죽기 쉬움: 피해 ×${R.lethal} · 방어 자세로 막으면 ×${R.blockMul} (자세 −${R.postCost}/100, 0 이면 ${R.breakTime}초 무너짐) · 명중률 가까이 ${Math.round(R.aimNear * 100)}% → 사거리 끝 ${Math.round(R.aimFar * 100)}% (무기마다 다름) · 총성 들리는 거리 ${R.hear}칸\\n아군\\n${who(0)}\\n적\\n${who(1)}\\n`;""")
# ---- log lines
rep("""      case 'wind': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비 (${f2(e.end)}초에 ${e.heal ? '치유' : '맞음'})${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;
      case 'hit': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 명중 ${e.dmg} (${n(e.b)} ${e.hp}/${Wd.units[e.b].max})${e.dir === 'side' ? ' · 측면 ×' + Wd.rules.flankSide : e.dir === 'back' ? ' · 뒤 ×' + Wd.rules.flankBack : ''}${e.sh ? ' · 방패로 막아 ×' + Wd.rules.shieldFront : ''}${e.led ? ' · 지휘 버프' : ''}${e.dark ? ` · 어둠 속에서 맞음 (${n(e.b)}에겐 ${ga(n(e.a))} 안 보임)` : ''}`); break;""",
"""      case 'wind': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비 (${f2(e.end)}초에 ${e.heal ? '치유' : '맞음'})${e.why && e.why !== '공격' ? ' · ' + e.why : ''}${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;
      case 'hit': {
        const b = Wd.units[e.b], R = Wd.rules, tags = [];
        if (e.block) tags.push(`${guardName(b)}로 막음 ×${R.blockMul}${e.broke ? ' · 자세 무너짐!' : ''}`);
        else { if (e.part) tags.push(e.part + (R.parts && R.parts[e.part] ? ' ×' + R.parts[e.part].mul : '')); if (e.dir === 'side') tags.push('측면 ×' + R.flankSide); if (e.dir === 'back') tags.push('뒤 ×' + R.flankBack); }
        if (e.wound) tags.push(e.wound === '팔' ? '팔 상처 (공격 ×0.85)' : '다리 상처 (속력 ×0.8)');
        if (e.p) tags.push('명중률 ' + Math.round(e.p * 100) + '%');
        if (e.meant != null) tags.push(`${reul(n(e.meant))} 노렸으나 사선에 먼저 걸림`);
        if (e.ff) tags.push('아군 오사');
        if (e.led) tags.push('지휘 버프');
        if (e.dark) tags.push(`어둠 속에서 맞음 (${n(e.b)}에겐 ${ga(n(e.a))} 안 보임)`);
        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.block ? '막힘' : '명중'} ${e.dmg} (${n(e.b)} ${e.hp}/${b.max})${tags.length ? ' · ' + tags.join(' · ') : ''}`); break; }
      case 'noise': out.push(`${T(e)}! 총성 — ${n(e.a)} (${coord(e.x, e.y)})${e.heard.length ? ' · 들은 쪽: ' + e.heard.map(n).join(', ') + ' (그 자리를 앎)' : ''}${e.vis ? '' : ' [쏜 쪽은 아군에겐 안 보임]'}`); break;
      case 'ammoOut': out.push(`${T(e)}${n(e.a)} 탄약 떨어짐 (${e.w}) → 맨손`); break;
      case 'mood': out.push(`${T(e)}${n(e.a)} [${e.m}]${e.b != null && e.b !== e.a ? ' ' + n(e.b) : ''}${e.vis ? '' : ' [아군에겐 안 보임]'}`); break;
      case 'guardBack': out.push(`${T(e)}${n(e.a)} 자세를 다시 잡음`); break;""")
rep("""      case 'die': out.push(`${T(e)}✕ ${n(e.b)} 쓰러짐 (${n(e.a)}의 공격)`); break;""","""      case 'die': out.push(`${T(e)}✕ ${n(e.b)} 쓰러짐 (${n(e.a)}의 공격${e.ff ? ', 아군 오사' : ''})`); break;""")
rep("""          out.push(`  ${tag} ${padW(u.name, 14)} ${padW(coord(s.x, s.y), 4)} ${padW(s.hp + '/' + u.max, 10)} ${u.side && !s.seen ? '[안 보임] ' : ''}${what}${u.side === 0 ? ' · 명령 ' + orderLabel(Wd, s.order) : ''}`);""",
"""          const gear = `${s.mood && !s.act ? ' · [' + s.mood + ']' : ''}${s.ammo != null ? ' · 탄 ' + s.ammo : ''}${s.post != null ? ' · 자세 ' + (s.broken ? '무너짐' : s.post) : ''}${s.wounds && s.wounds.length ? ' · 상처 ' + s.wounds.join(' ') : ''}`;
          out.push(`  ${tag} ${padW(u.name, 14)} ${padW(coord(s.x, s.y), 4)} ${padW(s.hp + '/' + u.max, 10)} ${u.side && !s.seen ? '[안 보임] ' : ''}${what}${u.side === 0 ? ' · 명령 ' + orderLabel(Wd, s.order) : ''}${gear}`);""")
rep("""· 빗나감 ${u.miss} · 처치 ${u.kills}${u.healed ? ' · 치유 ' + u.healed : ''}`).join('\\n');""","""· 빗나감 ${u.miss} · 처치 ${u.kills}${u.healed ? ' · 치유 ' + u.healed : ''}${u.shots ? ' · 쏜 횟수 ' + u.shots + (u.ammo != null ? ' (남은 탄 ' + u.ammo + ')' : '') : ''}${u.blocked ? ' · 막음 ' + u.blocked : ''}${u.ff ? ' · 아군 오사 ' + u.ff : ''}`).join('\\n');""")
# guardName helper (before logHeader)
rep("""/* ---------- 로그: 엔진 기록 (W.log) → 사람이 읽는 글 ---------- */""","""/* ---------- 로그: 엔진 기록 (W.log) → 사람이 읽는 글 ---------- */
const guardName = u => u.shield ? '방패' : u.weapon || '무기';""")
open('page10.tpl.html','w').write(s)
print('ok')
