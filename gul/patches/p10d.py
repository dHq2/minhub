s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
# ---- narration
rep("""    case 'wind': { const a = U(e.a), b = U(e.b);
      if (e.heal) return a.side === 0 ? { s: `${ga(a.name)} ${b.name}에게 다가가 상처를 살핀다.` } : null;
      if (a.side === 1 && b.side === 0) return e.hid ? null : { c: 'bad', s: a.rng > 1 ? `${ga(a.name)} ${reul(b.name)} 겨눈다.` : `${ga(a.name)} ${reul(b.name)} 향해 공격을 준비한다.` };
      return null; }""","""    case 'wind': { const a = U(e.a), b = U(e.b), far = a.rng > 1;
      if (e.heal) return a.side === 0 ? { s: `${ga(a.name)} ${b.name}에게 다가가 상처를 살핀다.` } : null;
      if (a.side === 1 && b.side === 0){
        if (e.hid) return null;
        const w = { '틈을 노림': `${ga(a.name)} 틈을 노려 ${reul(b.name)} ${far ? '겨눈다' : '덮친다'}.`, '측면 공격': `${ga(a.name)} ${b.name}의 옆으로 파고든다.`, '방어 무너뜨리기': `${ga(a.name)} ${b.name}의 방어를 무너뜨리려 겨눈다.`, '이동 막기': `${ga(a.name)} 다가오는 ${reul(b.name)} 겨눈다.`, '밀어붙임': `${ga(a.name)} 막고 선 ${reul(b.name)} 밀어붙인다.`, '자세 무너짐': `${ga(a.name)} 자세가 무너진 ${reul(b.name)} 노린다.` }[e.why];
        return { c: 'bad', s: w || (far ? `${ga(a.name)} ${reul(b.name)} 겨눈다.` : `${ga(a.name)} ${reul(b.name)} 향해 공격을 준비한다.`) };
      }
      if (a.side === 0 && b.side === 1){
        const w = { '틈을 노림': `${ga(a.name)} 틈을 보고 ${b.name}에게 ${far ? '총구를 돌린다' : '달려든다'}.`, '측면 공격': `${ga(a.name)} ${b.name}의 옆을 잡았다.`, '방어 무너뜨리기': `${ga(a.name)} ${b.name}의 방어를 두들긴다.`, '자세 무너짐': `${ga(a.name)} 무너진 ${b.name}에게 달려든다.` }[e.why];
        return w ? { c: 'good', s: w } : null;
      }
      return null; }""")
rep("""    case 'hit': { const a = U(e.a), b = U(e.b), far = a.rng > 1, v = ` (−${e.dmg}${e.dir === 'back' ? ', 뒤' : e.dir === 'side' ? ', 측면' : ''})`;
      if (b.side === 0 && e.dark) return { c: 'bad', s: far ? `어둠 속에서 날아온 공격이 ${reul(b.name)} 맞힌다${v}.` : `어둠 속의 무언가가 ${reul(b.name)} 할퀸다${v}.` };
      if (e.sh) return { c: b.side === 0 ? 'good' : '', s: `${ga(b.name)} 방패로 ${a.name}의 공격을 받아낸다${v}.` };
      if (e.dir === 'back') return { c: a.side === 0 ? 'good' : 'bad', s: `${ga(a.name)} ${b.name}의 등 뒤를 친다${v}.` };
      if (e.dir === 'side') return { c: a.side === 0 ? 'good' : 'bad', s: `${ga(a.name)} ${b.name}의 옆구리를 파고든다${v}.` };
      return { c: b.side === 0 ? 'bad' : '', s: far ? `${a.name}의 공격이 ${reul(b.name)} 맞힌다${v}.` : `${a.name}의 일격이 ${b.name}에게 들어간다${v}.` }; }""",
"""    case 'hit': { const a = U(e.a), b = U(e.b), far = !!e.far, v = ` (−${e.dmg}${e.part && e.part !== '몸통' ? ', ' + e.part : ''}${e.dir === 'back' ? ', 뒤' : e.dir === 'side' ? ', 측면' : ''})`;
      const wd = e.wound === '팔' ? ` ${ga(b.name)} 팔을 다쳤다.` : e.wound === '다리' ? ` ${ga(b.name)} 다리를 절기 시작한다.` : '';
      if (e.ff) return { c: 'bad', s: `${a.name}의 ${far ? '탄환' : '공격'}이 사선에 끼어든 ${b.name}에게 맞는다!${v.replace(')', ', 아군 오사)')}` };
      if (e.block) return { c: b.side === 0 ? (e.broke ? 'bad' : 'good') : (e.broke ? 'good' : ''), s: `${ga(b.name)} ${ro(guardName(b))} ${a.name}의 ${far ? '탄환' : '공격'}을 막아낸다 (−${e.dmg}).${e.broke ? ' 자세가 무너진다!' : ''}` };
      if (e.meant != null) return { c: b.side === 0 ? 'bad' : 'good', s: `${ga(b.name)} 사선에 먼저 걸려 대신 맞는다${v}.${wd}` };
      if (b.side === 0 && e.dark) return { c: 'bad', s: (far ? `어둠 속에서 날아온 공격이 ${reul(b.name)} 맞힌다${v}.` : `어둠 속의 무언가가 ${reul(b.name)} 할퀸다${v}.`) + wd };
      if (e.part === '머리') return { c: a.side === 0 ? 'good' : 'bad', s: `${a.name}의 ${far ? '탄환' : '일격'}이 ${b.name}의 머리를 스친다${v}.${wd}` };
      if (e.dir === 'back') return { c: a.side === 0 ? 'good' : 'bad', s: `${ga(a.name)} ${b.name}의 등 뒤를 친다${v}.${wd}` };
      if (e.dir === 'side') return { c: a.side === 0 ? 'good' : 'bad', s: `${ga(a.name)} ${b.name}의 옆구리를 파고든다${v}.${wd}` };
      return { c: b.side === 0 ? 'bad' : '', s: (far ? `${a.name}의 공격이 ${reul(b.name)} 맞힌다${v}.` : `${a.name}의 일격이 ${b.name}에게 들어간다${v}.`) + wd }; }
    case 'noise': return e.vis ? null : { c: 'bad', s: `어둠 속에서 총성이 울린다. 소리 난 자리에 '!'.` };
    case 'ammoOut': return U(e.a).side === 0 ? { c: 'bad', s: `${n(e.a)}의 탄약이 떨어졌다. 이제 맨손이다.` } : e.vis ? { c: 'good', s: `${n(e.a)}의 탄약이 떨어진 듯하다.` } : null;
    case 'guardBack': return U(e.a).side === 0 ? { c: 'good', s: `${ga(n(e.a))} 자세를 다시 잡는다.` } : e.vis ? { s: `${ga(n(e.a))} 다시 방어 자세를 잡는다.` } : null;
    case 'mood': { const a = n(e.a), b = e.b != null ? n(e.b) : '', al = U(e.a).side === 0;
      if (al) return { '사선에 아군': { c: 'dim', s: `${ga(a)} 사격을 멈춘다. ${ga(b)} 사선에 있다.` }, '막아서기': { c: 'good', s: `${ga(a)} ${b} 앞을 막아선다.` }, '숨기': { c: 'dim', s: `${ga(a)} 사선을 피해 몸을 숨긴다.` }, '물러남': { c: 'dim', s: `${ga(a)} 한발 물러난다.` }, '회복': { c: 'dim', s: `${ga(a)} ${b} 쪽으로 물러난다.` }, '막힘': { c: 'dim', s: `${ga(a)} ${b}의 방어에 막혀 사선을 찾는다.` } }[e.m] || null;
      if (!e.vis) return null;
      return { '경계': { c: 'dim', s: `${ga(a)} 거리를 두고 ${reul(b)} 노려본다.` }, '자리 잡기': { s: `${ga(a)} 사선을 찾아 옆으로 움직인다.` }, '막힘': { c: 'good', s: `${ga(a)} ${b}의 방어 앞에서 머뭇거린다.` }, '협공': { c: 'bad', s: `${ga(a)} ${b}의 옆으로 돌아 들어온다.` }, '뛰어듦': { c: 'bad', s: `${ga(a)} ${reul(b)} 향해 뛰어든다.` },
        '물러남': { c: 'good', s: `${ga(a)} 물러난다.` }, '막아서기': { s: `${ga(a)} 동료 앞을 막아선다.` }, '사선에 아군': { c: 'dim', s: `${ga(a)} 머뭇거린다. 동료가 사선에 있다.` }, '수색': { c: 'dim', s: `${ga(a)} 소리 난 쪽을 살핀다.` }, '숨기': { s: `${ga(a)} 몸을 숨긴다.` } }[e.m] || null; }""")
rep("""      if (/방패/.test(e.why)) return { c: 'good', s: `${a.name}의 공격이 ${e.why.replace('에 막힘', '')}에 막혀 튕겨 나간다.` };
""","")
# ---- cards
rep("""    const what = !u.alive ? '쓰러짐' : ed ? `${u.tier}등급 ${u.cls} · 속력 ${u.spd}${u.shield ? ' · 방패' : ''}${u.hero ? ' · 주인공' : ''}` : u.act ? actLabel(Wd, u, liveAct(Wd, u)) : (u.path && u.path.length ? '이동 중' : stateLabel(u) || '서 있음');""",
"""    const what = !u.alive ? '쓰러짐' : ed ? `${u.tier}등급 ${u.cls} · 속력 ${u.spd}${u.shield ? ' · 방패' : u.canGuard ? ' · 방어 자세' : ''}${u.hero ? ' · 주인공' : ''} · 대담함 ${u.bold}` : u.act ? actLabel(Wd, u, liveAct(Wd, u)) : moodLabel(Wd, u) || (u.path && u.path.length ? '이동 중' : stateLabel(u) || '서 있음');""")
rep("""      <span class="st">${Math.ceil(u.hp)}/${u.max}${ed ? '' : ' · 명령 ' + orderLabel(Wd, ordOf(u))}</span>""","""      <span class="st">${Math.ceil(u.hp)}/${u.max}${gearTxt(Wd, u)}${ed ? '' : ' · 명령 ' + orderLabel(Wd, ordOf(u))}</span>""")
rep("""      ${!ed && (u.engaged || see) ? `<span class="hb"><i style="width:${Math.max(0, u.hp / u.max * 100)}%"></i></span><span class="st">${Math.ceil(u.hp)}/${u.max}${u.engaged ? '' : ' (모두 보기)'}</span>` : `<span class="st">체력 ? · ${ed ? '배치 중' : '아직 교전 전'}</span>`}
      ${ed ? '' : bar(Wd, u)}<span class="at">${ed ? `${u.tier}등급 ${u.cls} · 속력 ${u.spd}${u.nv ? ' · 야시' : ''}${u.shield ? ' · 방패' : ''}` : u.act ? esc(actLabel(Wd, u, liveAct(Wd, u))) : esc(stateLabel(u))}</span></span></div>`).join('')""",
"""      ${!ed && (u.engaged || see) ? `<span class="hb"><i style="width:${Math.max(0, u.hp / u.max * 100)}%"></i></span><span class="st">${Math.ceil(u.hp)}/${u.max}${gearTxt(Wd, u)}${u.engaged ? '' : ' (모두 보기)'}</span>` : `<span class="st">체력 ? · ${ed ? '배치 중' : '아직 교전 전'}</span>`}
      ${ed ? '' : bar(Wd, u)}<span class="at">${ed ? `${u.tier}등급 ${u.cls} · 속력 ${u.spd}${u.nv ? ' · 야시' : ''}${u.shield ? ' · 방패' : u.canGuard ? ' · 방어 자세' : ''} · 대담함 ${u.bold}` : u.act ? esc(actLabel(Wd, u, liveAct(Wd, u))) : esc(moodLabel(Wd, u) || stateLabel(u))}</span></span></div>`).join('')""")
rep("""function hud(){
  const Wd = W_(); if (!Wd) return;""","""// 탄약 · 자세 · 상처 (카드 한 줄)
function gearTxt(Wd, u){
  if (!u.alive) return '';
  return `${u.ammo != null ? ' · 탄 ' + u.ammo + '/' + u.ammoMax : ''}${u.canGuard ? ' · 자세 ' + (mode !== 'edit' && Wd.t < u.brokenT ? '무너짐' : Math.round(u.post)) : ''}${u.wounds && u.wounds.length ? ' · 상처 ' + u.wounds.length : ''}`;
}
function hud(){
  const Wd = W_(); if (!Wd) return;""")
# ---- tooltip
rep("""  const traits = [...(u.nv ? ['야시'] : []), ...(u.shield ? ['방패'] : []), ...(p.traits || [])];""","""  const traits = [...(u.nv ? ['야시'] : []), ...(u.shield ? ['방패'] : u.canGuard ? ['방어 자세'] : []), ...(p.traits || [])];
  const known = u.side === 0 || ed || u.engaged || see;""")
rep("""  const now = ed ? '' : u.act ? actLabel(Wd, u, liveAct(Wd, u)) : (() => { const t = aimOf(Wd, u); return t ? `${t.name} 쪽을 보고 있음` : stateLabel(u) || '서 있음'; })();""",
"""  const now = ed ? '' : u.act ? actLabel(Wd, u, liveAct(Wd, u)) : moodLabel(Wd, u) || (() => { const t = aimOf(Wd, u); return t ? `${t.name} 쪽을 보고 있음` : stateLabel(u) || '서 있음'; })();
  const boldTxt = b => b >= 0.7 ? '짧은 기회에도 뛰어듦' : b >= 0.45 ? '기회를 보며 들어감' : b >= 0.25 ? '신중함 · 확실할 때 침' : '아주 확실한 기회만 기다림';
  const wnd = (u.wounds || []).length ? [u.atkMul < 1 ? `팔 (공격 ×${u.atkMul.toFixed(2)})` : '', u.spdMul < 1 ? `다리 (속력 ×${u.spdMul.toFixed(2)})` : ''].filter(Boolean).join(' · ') : '';""")
rep("""    <span class="tr"><span class="lb">무기</span> ${esc(u.weapon || '없음')} · 공격 범위 ${u.rng}칸${u.rng > 1 ? ' (멀리서 쏨)' : u.rng >= 0.9 ? ' (한 칸 떨어져서도 닿음)' : ''}</span>""",
"""    <span class="tr"><span class="lb">무기</span> ${esc(u.weaponNow ? u.weaponNow + ' (' + u.weapon + ' 탄약이 떨어짐)' : u.weapon || '없음')} · 공격 범위 ${u.rng}칸${u.rng > 1 ? ` (멀리서 쏨 · 명중 가까이 ${Math.round(Wd.rules.aimNear * 100)}% → 끝 ${Math.round((u.aim != null ? u.aim : Wd.rules.aimFar) * 100)}%)` : u.rng >= 0.9 ? ' (한 칸 떨어져서도 닿음)' : ''}</span>
    ${u.ammo != null && known ? `<span class="tr"><span class="lb">탄약</span> ${u.ammo}/${u.ammoMax}${u.loud ? ' · 쏘면 총성 (그 자리에 !)' : ' · 소리 없음'}</span>` : ''}
    ${u.canGuard && known ? `<span class="tr"><span class="lb">자세</span> ${!ed && Wd.t < u.brokenT ? '무너짐 (' + f2(u.brokenT - Wd.t) + '초 뒤 다시 잡음)' : Math.round(u.post) + '/100'}${!u.shield ? ' · 대검은 자기 공격 중엔 못 막음' : ''}</span>` : ''}
    <span class="tr"><span class="lb">대담함</span> ${u.bold} · ${boldTxt(u.bold)}</span>
    ${wnd && known ? `<span class="tr"><span class="lb">상처</span> ${esc(wnd)}</span>` : ''}""")
rep("""  const fx = ed ? [] : [ (Wd.light[(u.y | 0) * S.W + (u.x | 0)] > 0.12 ? '빛 안' : '어둠 속'), ...(u.side === 0 && Wd.t - u.unseenHitT < 1.5 ? ['어둠 속에서 맞는 중'] : []),""",
"""  const fx = ed ? [] : [ (Wd.light[(u.y | 0) * S.W + (u.x | 0)] > 0.12 ? '빛 안' : '어둠 속'), ...(u.side === 0 && Wd.t - u.unseenHitT < 1.5 ? ['어둠 속에서 맞는 중'] : []), ...(Wd.t < u.pinT ? ['움찔 (느려짐)'] : []),""")
# keys help text
rep("""테두리 밖 삼각형 = 바라보는 방향, 은색 호 = 방패.""","""테두리 밖 삼각형 = 바라보는 방향, 은색 호 = 방어 자세 (방패 · 대검, 붉은 점선 = 지금 못 막음), 체력 줄 아래 흰 줄 = 자세. 머리 위 작은 글씨 = 지금 기분 (경계 · 자리 잡기 · 사선에 아군 · 막아서기 …), 오른쪽 아래 '탄' = 남은 탄약, 노란 ! = 총성 난 자리. 날아가는 공격은 사선에 먼저 걸리는 몸이 맞아요 (아군도). 사수는 동료가 사선에 있으면 쏘지 않아요.""")
rep("""옅은 파랑 = 방패 든 아군을 골랐을 때 그 뒤 안전한 칸 (앞에서 오는 화살을 막음).""","""옅은 파랑 = 방패 · 대검 든 아군을 골랐을 때 그 뒤 안전한 칸 (앞에서 오는 사선을 가려 줌).""")
open('page10.tpl.html','w').write(s)
print('ok')
