p='page10.tpl.html'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(a[:70],c); s=s.replace(a,b)

# 버전 · 노트
rep("""<!-- 굴의 전투판 v7.5.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.5.0:""","""<!-- 굴의 전투판 v7.6.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.6.0: 암살 (아군 · 적 같음) — 숨은 채 (은신 · 매복 · 어둠 속 우회) 아무에게도 들키지 않고, 상대가 알아채지 못하고, 경계가 강하지 않을 때 등 뒤를 잡으면 소리 없이 숨을 끊음.
             ① 조건: 숨어 있음 (은신을 켬 · 횃불 끔 · 방금 치지 않음 · 서두르지 않음) · 상대의 등 뒤 (바라보는 쪽에서 120° 넘게) · 손 닿음 (사수는 단검 — 0.35칸까지 붙어야) · 상대가 알아채지 못함 · 상대 편 누구도 나를 보지 못함.
               거구 · 개조된 몸 · 최대 체력 300 이상은 한 번에 끊지 못함 (보통 공격 — 기습).
             ② 암살 솜씨 = 직업 (기동 0.9 · 원거리 0.7 · 근접 0.65 · 치유 · 지휘 0.5) × √숨는 솜씨 × 베테랑 1.1 × 급소 등급 (S 1.2 · A 1.15 · B 1.1 · C 1.05) × 일반인 0.6 × 거구 · 개조된 몸 0.25 (최대 95%).
               노먼 95% · 청광묵 95% · 레베카 48% · 인주 33% · 카리우스 3%. 적 기사 · 창병 48% · 궁수 69% · 곤봉적 3%.
             ③ 경계 (확률을 깎음): 우리를 알고 있음 (적은 경보 · 사냥 · 수색 중) 25% · 곁 (2.5칸) 의 동료 하나마다 15% (45% 까지) · 경계 자세 (방패를 듦 · 막기 유지) · 초병 15% · 두리번거림 (수색 중 · 3초 안에 맞음) 20%.
               다른 상대와 맞붙어 손이 묶였으면 −10%. 알고 있음 + 동료 둘 이상 + 경계 (자세 · 두리번거림) = 불가능. 성공 확률 = 암살 솜씨 × (1 − 경계).
             ④ 성공: 소리 없이 숨을 끊음 — 전장 소음 · 비명 · 경보 없음 · 드러나지 않음. 보는 동료 (앞 · 옆으로 피해자를 봄) 가 있으면 쓰러지는 걸 봄 → 그쪽을 경계 · 수색 (적은 경보).
               아무도 못 봤으면 시신을 동료가 볼 때 발견 (몇 초 뒤). 실패: 몸부림 — 기습 일격 (등 뒤 ×3, 사수의 단검은 ×0.6) · 외침 · 2초 드러남 · 둘레가 나를 앎.
             ⑤ 숨은 몸은 등 뒤에서는 보이지 않음 (발소리도 죽임 — 후각은 맡음). 앞 · 옆으로는 예전처럼 들킬 거리 × (어둠 · 빛).
             ⑥ 암살 명령 (🗡 · U): 고른 아군이 은신을 켜고 그 적의 등 뒤로 돌아 들어감 (앞에 있으면 옆으로 크게 돌아) → 손 닿으면 처치. 들키면 · 놓치면 · 경계가 2초 넘게 안 풀리면 그만두고 자동 전투. 해내면 숨은 채 그 자리.
               상세정보에 '암살 솜씨'. 기존 '암살' 표시 (알아차리지 못한 상대의 등 뒤를 친 보통 일격) 는 '기습' 으로 이름을 바꿈.
             ⑦ 자동 전투 (아군 · 적 같음): 암살 솜씨 40% 이상인 근접이 어둠 속에서 아무에게도 안 보이고 맞붙지 않았으면, 7칸 안의 등이 열린 상대를 숨어서 노림 (들키면 그만둠). 어둠 속 우회 (적의 그림자 사냥꾼) 도 숨은 몸.
             측정: (아래 v7.6 측정 줄)
     v7.5.0:""")
rep("""<span class="ver">v7.5.0 · 정찰""","""<span class="ver">v7.6.0 · 암살 (숨은 채 등 뒤 · 아무도 못 봄 · 경계가 약할 때 — 소리 없이, 아군 · 적 같음) · 암살 명령 🗡 · 등 뒤의 은신은 안 보임 · 시신 발견 · v7.5.0 · 정찰""")
rep("""RULES_MIG = '7.5.0';""","""RULES_MIG = '7.6.0';""")

# 죽음 모습 · 까닭
rep("""incap: '전투불능', bleed: '과다 출혈', burn: '화상', shock: '쇼크' };""","""incap: '전투불능', bleed: '과다 출혈', burn: '화상', shock: '쇼크', assn: '소리 없이 숨이 끊김 (암살)' };""")
rep("""  if (k === 'throat' || k === 'neck'){ const q = { x: p.x + fx * hr * 0.95, y: p.y + fy * hr * 0.95 }; if (k === 'throat') cut(""","""  if (k === 'throat' || k === 'neck' || k === 'assn'){ const q = { x: p.x + fx * hr * 0.95, y: p.y + fy * hr * 0.95 }; if (k === 'throat' || k === 'assn') cut(""")
rep("""  throat: (A, B) => `${B}의 목이 베인다 — 피를 쏟으며 쓰러진다.`,""","""  throat: (A, B) => `${B}의 목이 베인다 — 피를 쏟으며 쓰러진다.`,
  assn: (A, B, a, b) => b && b.side === 0 ? [`${B}${jong(B) ? '이' : '가'} 소리 없이 무너진다 — 어둠 속, 아무도 보지 못했다.`, `${B}의 숨이 소리 없이 끊긴다 — 등 뒤의 그림자.`] : [`${A ? A + '의 단검이 ' : ''}${B}의 목을 소리 없이 긋는다 — 그대로 주저앉는다.`, `${A ? ga(A) + ' ' : ''}${B}의 입을 막고 숨을 끊는다 — 아무 소리도 나지 않는다.`],   // v7.6 암살""")

# 상세정보: 암살 솜씨
rep("""${u.torch && !u.torchOff ? ' · 횃불을 켜면 숨지 못함' : ''}</span>` : ''}""","""${u.torch && !u.torchOff ? ' · 횃불을 켜면 숨지 못함' : ''}</span>` : ''}
    ${!ed && known && u.assnE != null ? `<span class="tr"><span class="lb">암살</span> 암살 솜씨 ${Math.round(u.assnE * 100)}%${u.assnE >= 0.7 ? ' — 믿을 만함' : u.assnE >= 0.4 ? ' — 그럭저럭' : u.assnE >= 0.15 ? ' — 서툶' : ' — 맡기기 어려움'} · 숨은 채 등 뒤 · 아무도 못 볼 때 (× (1 − 상대의 경계))${u.assnN ? ' · 이 판에서 ' + u.assnN + '번' : ''}</span>` : ''}""")

# 명령 글
rep("""  if (o[0] === 'scout') return `${ro(coord(o[1], o[2]))} 정찰`;   // v7.5""","""  if (o[0] === 'scout') return `${ro(coord(o[1], o[2]))} 정찰`;   // v7.5
  if (o[0] === 'assn') return `${Wd.units[o[1]].name} 암살`;   // v7.6""")
rep("""const ordOf = u => u.order && u.order.k === 'scout' ?""","""const ordOf = u => u.order && u.order.k === 'assn' ? ['assn', u.order.b] : u.order && u.order.k === 'scout' ?""")
rep("""  if (a.k === 'palm') return a.ph === 'wind' ?""","""  if (a.k === 'assn') return a.ph === 'wind' ? `암살 → ${b ? b.name : ''} (${f2(a.left)}초)` : '암살 뒤';   // v7.6
  if (a.k === 'palm') return a.ph === 'wind' ?""")
rep(""": o.k === 'scout' ? ['🔭 정찰', '#b9e0a0'] :""",""": o.k === 'scout' ? ['🔭 정찰', '#b9e0a0'] : o.k === 'assn' ? ['🗡 ' + tn, '#c9a0ff'] :""")

# 로그 줄
rep("""      case 'stealthMode': out.push(`${T(e)}🥷 ${e.a.map(n).join(' · ')} 은신 ${e.on ? '켬' : '끔'}`); break;""","""      case 'stealthMode': out.push(`${T(e)}🥷 ${e.a.map(n).join(' · ')} 은신 ${e.on ? '켬' : '끔'}`); break;
      case 'assnGo': out.push(`${T(e)}🗡 ${n(e.a)} 암살하러 감 → ${n(e.b)} (은신을 켬 · 암살 솜씨 ${Math.round((e.e || 0) * 100)}%)`); break;   // v7.6
      case 'assn': out.push(`${T(e)}🗡 ${n(e.a)} → ${n(e.b)} 소리 없이 숨을 끊음 — 암살 (확률 ${Math.round((e.p || 0) * 100)}%${e.why ? ' · 경계: ' + e.why : ''})${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;
      case 'assnFail': out.push(`${T(e)}🗡 ${n(e.a)} → ${n(e.b)} 암살 실패 — ${e.why || '몸부림'}${e.p ? ' (확률 ' + Math.round(e.p * 100) + '%)' : ''} · 외침 · 드러남${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;
      case 'assnAbort': out.push(`${T(e)}🗡 ${n(e.a)} 암살을 그만둠 — ${e.why} → 자동 전투`); break;
      case 'assnAI': out.push(`${T(e)}🗡 ${n(e.a)} 어둠 속에서 ${n(e.b)}의 등을 노림 (숨음 · 확률 ~${Math.round((e.p || 0) * 100)}%)${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;
      case 'assnAIend': out.push(`${T(e)}🗡 ${n(e.a)} 노리기를 그만둠 — ${e.why}${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;
      case 'assnSeen': out.push(`${T(e)}👁 ${n(e.a)}: ${n(e.b)}${jong(n(e.b)) ? '이' : '가'} 쓰러지는 걸 봄${e.see ? ' — 친 자 (' + n(e.by) + ') 도 봄' : ' — 친 자는 못 봄'} → 경계${U0(e.a).side ? ' · 경보' : ''}`); break;
      case 'assnFound': out.push(`${T(e)}👁 ${n(e.a)}: ${n(e.b)}의 시신을 발견 (${e.sec}초 뒤)${U0(e.a).side ? ' → 경보 · 수색' : ''}`); break;""")
rep("""        if (e.ambush) tags.push(`암살 (알아차리지 못함) ×${R.ambushMul} · 비명`);""","""        if (e.ambush) tags.push(`기습 (알아차리지 못함) ×${R.ambushMul} · 비명`);
        if (e.assn) tags.push('암살 — 소리 없음');""")

# 이야기
rep("""    case 'scout': return { c: 'dim', s: `${ga(n(e.a))} 몸을 낮춰 어둠 속으로 사라진다.` };""","""    case 'scout': return { c: 'dim', s: `${ga(n(e.a))} 몸을 낮춰 어둠 속으로 사라진다.` };
    case 'assnGo': return { c: 'dim', s: `${ga(n(e.a))} 몸을 낮추고 ${n(e.b)}의 등 뒤로 돌아간다.` };   // v7.6 암살
    case 'assn': return null;   // 쓰러짐 줄 (어떻게 = 암살) 에서
    case 'assnFail': return U(e.a).side === 0 ? { c: 'bad', s: `${ga(n(e.a))} ${n(e.b)}의 등 뒤를 잡았지만 — 몸부림친다! 외침이 울린다.` } : { c: U(e.b).side === 0 ? 'good' : 'dim', s: `${n(e.b)}의 등 뒤에서 누군가 덮친다 — 몸부림쳐 떨쳐 낸다!` };
    case 'assnAbort': return { c: 'dim', s: `${ga(n(e.a))} 암살을 그만둔다 — ${e.why}.` };
    case 'assnAI': return U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 어둠 속에서 ${n(e.b)}의 등을 노린다.` } : null;
    case 'assnAIend': return null;
    case 'assnSeen': return U(e.a).side === 0 ? { c: 'bad', s: `${ga(n(e.a))} ${n(e.b)}${jong(n(e.b)) ? '이' : '가'} 소리 없이 쓰러지는 걸 봤다!` } : e.hid ? null : { c: 'bad', s: `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 동료가 쓰러지는 걸 봤다 — 경계한다.` };
    case 'assnFound': return U(e.a).side === 0 ? { c: 'bad', s: `${ga(n(e.a))} ${n(e.b)}의 시신을 발견했다 — 언제 당했는지 아무도 몰랐다.` } : e.hid ? null : { c: 'bad', s: `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 동료의 시신을 발견했다 — 수색을 시작한다.` };""")
rep("""      if (e.palm) return e.hid ? null : { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} ${b.name}에게 바싹 붙어""","""      if (e.assn) return null;   // v7.6 암살은 소리 없이 (결과만)
      if (e.palm) return e.hid ? null : { c: a.side ? 'bad' : 'good', s: `${ga(a.name)} ${b.name}에게 바싹 붙어""")
rep("""    case 'hit': { const a = U(e.a), b = U(e.b), far = !!e.far, v =""","""    case 'hit': if (e.assn) return null; { const a = U(e.a), b = U(e.b), far = !!e.far, v =""")

# 조작: 키 U · 버튼 · 무장 탭
rep("""  else if (k === 'scout'){ armed = armed && armed.k === 'scout' ? null :""","""  else if (k === 'assn'){ armed = armed && armed.k === 'assn' ? null : { k: 'assn', cas: L.filter(u => !u.crawl).map(u => u.i) }; if (armed) toast(armedTxt() + ' — 암살 솜씨 ' + L.map(u => u.name + ' ' + Math.round((u.assnE || 0) * 100) + '%').join(' · ')); }   // v7.6 암살
  else if (k === 'scout'){ armed = armed && armed.k === 'scout' ? null :""")
rep("""scout: '🔭 정찰: 살펴볼 곳 (바닥) 을 탭 — 숨어서 가 보고 지휘관 곁으로 돌아와 보고',""","""scout: '🔭 정찰: 살펴볼 곳 (바닥) 을 탭 — 숨어서 가 보고 지휘관 곁으로 돌아와 보고', assn: '🗡 암살: 노릴 적을 탭 — 숨어서 등 뒤로 돌아 소리 없이',""")
rep("""  if (k === 'scout'){ if (u && u.alive){ toast('정찰: 살펴볼 바닥을 탭 · 아래로 쓸면 취소'); return; }""","""  if (k === 'assn'){ if (!(u && u.side === 1)){ toast('암살: 적을 탭 · 아래로 쓸면 취소'); return; }   // v7.6 암살
    const L2 = armed.cas.map(i => Wd.units[i]).filter(x => x && x.alive); if (!L2.length) return done();
    L2.forEach(x => { x.order = { k: 'assn', b: u.i }; }); sel = new Set(L2.map(x => x.i)); noteOrders(L2, 'user', '암살');
    const big = u.giant || u.modBody || u.bodyShield || u.max >= ((Wd.rules.assn || {}).big || 300);
    toast(`${L2.map(x => x.name + ' (' + Math.round((x.assnE || 0) * 100) + '%)').join(' · ')} → ${u.name} 암살 — 숨어서 등 뒤로.${big ? ' 한 번에 끊을 수 없는 몸 — 기습 일격만 들어가요' : ' 들키면 그만두고 자동 전투'}`); return done(); }
  if (k === 'scout'){ if (u && u.alive){ toast('정찰: 살펴볼 바닥을 탭 · 아래로 쓸면 취소'); return; }""")
rep("""  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'stealth',""","""  if (['amove', 'hold', 'auto', 'line', 'lret', 'scout', 'assn', 'stealth',""")
rep("""      + `<button type="button" class="db" data-dk="scout"><span class="ic">🔭</span>정찰</button>`   // v7.5""","""      + `<button type="button" class="db" data-dk="scout"><span class="ic">🔭</span>정찰</button>`   // v7.5
      + `<button type="button" class="db" data-dk="assn"><span class="ic">🗡</span>암살</button>`   // v7.6""")
rep("""y: 'scout', z: 'stealth', x: 'cancel',""","""y: 'scout', u: 'assn', z: 'stealth', x: 'cancel',""")
rep("""data-ord="scout" title="숨어서 가 보고 돌아와 보고 — 누른 뒤 살펴볼 바닥을 클릭">🔭 정찰 <kbd>Y</kbd></button>""","""data-ord="scout" title="숨어서 가 보고 돌아와 보고 — 누른 뒤 살펴볼 바닥을 클릭">🔭 정찰 <kbd>Y</kbd></button><button class="btn" type="button" data-ord="assn" title="숨어서 등 뒤로 — 누른 뒤 노릴 적을 클릭 (아무도 못 보고 · 상대가 알아채지 못하고 · 경계가 약할 때 소리 없이)">🗡 암살 <kbd>U</kbd></button>""")
rep("""  if (armed && (armed.k === 'lret' || armed.k === 'scout')){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥   // v7.5 정찰: 살펴볼 바닥""","""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn')){ armedTap(w); return; }   // v7.2 전열 후퇴: 물러설 바닥   // v7.5 정찰: 살펴볼 바닥   // v7.6 암살: 노릴 적""")
rep("""  if (armed && (armed.k === 'lret' || armed.k === 'scout')){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥""","""  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn')){ armedTap(w); return; }   // v7.2 전열 후퇴: 오른쪽 클릭도 물러설 바닥""")
open(p,'w').write(s)
print('ok')
