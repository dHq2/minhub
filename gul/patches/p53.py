import sys
P='page10.tpl.html'
s=open(P,encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('MISMATCH',c,a[:140]); sys.exit(1)
    s=s.replace(a,b)

rep("""<!-- 굴의 전투판 v5.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.""",
"""<!-- 굴의 전투판 v5.3 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.3: 돌격 = 보병 · 탱커 공통 기술 (외침 "이야아아!" · 카리우스 "크아아!" · 말 없는 적은 이모지). 운동량 충돌 (마주 돌격은 합쳐짐 · 가벼운 쪽이 튕겨 나감) · 방진 버팀 (훈련된 방진은 잘 안 밀림 → 빈틈을 노림).
           무거울수록 천천히 돎 · 근접은 몸이 상대를 봐야 들어감. 카리우스 [머리 넷] (사방을 봄 · 몸은 천천히 돎). 인주 = 창 보병 — 창 2열 (동료 옆 · 뒤에서 찌름).""")
rep("""<span class="ver">v5.2 · 몸으로 싸우기""", """<span class="ver">v5.3 · 돌격 · 몸으로 싸우기""")
rep("""<footer>굴의 전투판 v5.2 —""", """<footer>굴의 전투판 v5.3 —""")
rep("""  return `굴의 전투판 v5.2 · ${title}""", """  return `굴의 전투판 v5.3 · ${title}""")
rep("""copyText('굴의 전투판 v5.2 자동 판 기록""", """copyText('굴의 전투판 v5.3 자동 판 기록""")
rep("""<kbd>F</kbd> 액티브 스킬 (돌진 · 도약)""", """<kbd>F</kbd> 액티브 스킬 (돌격 · 돌진 · 도약)""")

# 특성 · 액티브 · 고유특성
rep("""  '거구': '몸이 큼 (×1.3)""", """  '머리 넷': '머리가 넷 (카이로스 경 · 광대 · 노인 · 슬픈 여자): 시야를 나눠 사방을 봄 — 등 뒤도 알아챔 (암살 · 몰래 다가가기가 안 통함). 몸 (공격 방향) 은 무거워 천천히 돎',
  '거구': '몸이 큼 (×1.3)""")
rep("""  '돌진': '1.5 ~ 5칸 앞의 상대에게 곧게 돌진해 들이받음""", """  '돌격': '보병 · 탱커의 공통 기술 — 1.5 ~ 5칸 앞으로 전력질주해 들이받음. 무게 × 속력으로 부딪힘 (둘 다 달려오면 합쳐짐 · 가벼운 쪽이 튕겨 나감 · 빠르면 넘어짐). 버티는 방진 (뒤 · 옆 동료 · 막고 선 전선) 은 잘 안 밀려서 빈틈 (옆 · 뒤 · 사수 · 준비 중 · 벽 쪽) 을 노림. 8초마다',
  '돌진': '카리우스의 돌격 — 1.5 ~ 5칸 앞의 상대에게 곧게 돌진해 들이받음""")
rep("""    effects: ['받는 피해 ×0.7 (수치표 [개조된 신체])', '움찔 · 넘어짐 시간 절반', '3M 융합 거구 — 몸이 방패, 무게 300'],
    derived: ['거구', '갑피', '괴력A'], limits: [], flags: { modBody: true } },""",
"""    effects: ['받는 피해 ×0.7 (수치표 [개조된 신체])', '움찔 · 넘어짐 시간 절반', '3M 융합 거구 — 몸이 방패, 무게 300', '머리 넷 — 시야를 나눠 사방을 봄 (몸은 천천히 돎)'],
    derived: ['거구', '갑피', '괴력A', '머리 넷'], limits: [], flags: { modBody: true } },""")

# 설계 칸 기본값 · 프로필
rep("""  { key: '인주', side: 0, ref: 'C-001', name: '인주', tier: 2, hero: true, weapon: '어부의 창', height: 1.6, nv: true, nvG: 'C', traits: ['일반인'], tactic: '주인공 · 어부의 창', note: '가장 최근에 떨어진 일반 인간계 사람. 횃불을 듦' },""",
    """  { key: '인주', side: 0, ref: 'C-001', name: '인주', tier: 2, hero: true, cls: '근접', role: '공격수', weapon: '어부의 창', height: 1.6, nv: true, nvG: 'C', traits: ['일반인'], tactic: '보병 · 창 (2열)', note: '가장 최근에 떨어진 일반 인간계 사람. 횃불을 듦. 창 보병 — 전선 뒤 · 옆에서 찌름' },""")
rep("""traits: ['거구', '갑피', '괴력A'], unique: ['개조된 신체'], modBody: true, active: ['돌진'], tactic: '중전차 · 돌진',""",
    """traits: ['거구', '갑피', '괴력A', '머리 넷'], unique: ['개조된 신체'], modBody: true, active: ['돌진'], cry: '크아아!', tactic: '중전차 · 돌진',""")
rep("""  'C-003': { unique: ['개조된 신체'], shield: false, weapon: '맨손', weight: 300, height: 3, ov: { hp: 450, atk: 40, rng: 0.6 }, active: ['돌진'], sm: 0.75,""",
    """  'C-003': { unique: ['개조된 신체'], shield: false, weapon: '맨손', weight: 300, height: 3, ov: { hp: 450, atk: 40, rng: 0.6 }, active: ['돌진'], cry: '크아아!', sm: 0.75,""")
rep("""if (pf.active) u.active = pf.active.slice();""", """if (pf.active) u.active = pf.active.slice(); if (pf.cry) u.cry = pf.cry;""")
rep("""'noRanged', 'active', 'weight', 'modBody'];""", """'noRanged', 'active', 'weight', 'modBody', 'cry', 'mute'];""")

# 옮기기 v5.3
rep("""// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)""", """// v5.3: 카리우스 [머리 넷] · 외침, 돌격 수치 (새 칸) · 돌진 속력 2.6 → 2.2
if (!S.v53){ for (const u of S.units){ if ((u.unique || []).length) applyUnique(u); if (u.ref === 'C-003' && (u.unique || []).includes('개조된 신체') && !u.cry) u.cry = '크아아!'; if (u.ref === 'C-001' && u.weapon === '어부의 창' && !u.role) u.role = '공격수'; }
  const c = S.rules.charge, d = DEFAULT_RULES.charge; if (c){ for (const j in d) if (c[j] === undefined) c[j] = d[j]; if (c.spd === 2.6) c.spd = d.spd; }
  S.v53 = true; }
// v5.0: 역할 (프로필에 정해진 인물만, 나머지는 장비 · 직업으로 자동)""")
rep("""v50: true, v51: true, v52: true, type: 'gridC'""", """v50: true, v51: true, v52: true, v53: true, type: 'gridC'""")

# 배치 편집: 외침 · 말 없음
rep("""<label class="brush" for="selWeight">무게 (kg)""", """<label class="brush" for="selCry">외침 <input id="selCry" type="text" style="width:6.5em" value="${esc(p.cry || '')}" placeholder="${p.side ? '🏃💨' : '이야아아!'}"></label><label class="ck" for="selMute"><input id="selMute" type="checkbox" ${(p.mute != null ? p.mute : p.side === 1) ? 'checked' : ''}> 말 없음 (외침이 이모지)</label><label class="brush" for="selWeight">무게 (kg)""")
rep("""  if (e.target.id === 'selWeight'){""", """  if (e.target.id === 'selCry'){ const v = e.target.value.trim(); if (v) p.cry = v; else delete p.cry; changed(); return; }
  if (e.target.id === 'selMute'){ p.mute = e.target.checked; changed(); return; }
  if (e.target.id === 'selWeight'){""")

# 명령 단추: 돌격 · 돌진 이름
rep("""L.some(u => u.canCharge) ? '돌진' + (L.filter""", """L.some(u => u.canCharge) ? L.find(u => u.canCharge).chargeName + (L.filter""")
rep("""toast(C.some(u => world.t < u.chargeCd) ? `돌진은 ${f2(""", """toast(C.some(u => world.t < u.chargeCd) ? `${C[0].chargeName}은 ${f2(""")

# 설명 상자
rep("""    <span class="tr"><span class="lb">몸</span> 키 ${u.h}m · 무게 ${u.mass}kg""", """    <span class="tr"><span class="lb">몸</span> 키 ${u.h}m · 무게 ${u.mass}kg · 돌아서기 ×${turnMul(Wd, u).toFixed(2)}${u.heads > 1 ? ' · 머리 ' + u.heads + ' (사방을 봄 — 등 뒤도 알아챔)' : ''}""")
rep("""    ${(u.active || []).length ? `<span class="tr"><span class="lb">액티브</span>""", """    ${u.canCharge && !(u.active || []).length ? `<span class="tr"><span class="lb">돌격</span> 보병 · 탱커 공통 기술 — 전력질주해 들이받음 (무게 × 속력) · 외침 "${esc(chargeCry(Wd, u))}"${!ed && Wd.t < u.chargeCd ? ` · ${f2(u.chargeCd - Wd.t)}초 뒤` : ''} (<kbd>F</kbd>)</span>` : ''}
    ${(u.active || []).length ? `<span class="tr"><span class="lb">액티브</span>""")

# 시선 부채꼴: [머리 넷] 은 등 뒤도
rep("""      fan(fa0 - F, fa0 + F, strong ? 0.42 : 0.3); fan(fa0 + F, fa0 + Sd, strong ? 0.18 : 0.12); fan(fa0 - Sd, fa0 - F, strong ? 0.18 : 0.12);""",
    """      fan(fa0 - F, fa0 + F, strong ? 0.42 : 0.3); fan(fa0 + F, fa0 + Sd, strong ? 0.18 : 0.12); fan(fa0 - Sd, fa0 - F, strong ? 0.18 : 0.12);
      if (u.heads > 1) fan(fa0 + Sd, fa0 + 2 * Math.PI - Sd, strong ? 0.16 : 0.1);   // v5.3 [머리 넷]: 등 뒤도 봄""")
rep("""        if (ts >= 30){ const ba = fa0 + Math.PI, t = '등 뒤 (못 알아챔)'""", """        if (ts >= 30 && !(u.heads > 1)){ const ba = fa0 + Math.PI, t = '등 뒤 (못 알아챔)'""")
# 넓게 휘두르기 예고: 몸이 보는 쪽
rep("""b = Wd.units[u.act.b], a0 = Math.atan2(b.y - u.y, b.x - u.x), k = Math.min(1""", """b = Wd.units[u.act.b], a0 = u.face || 0, k = Math.min(1""")

# 기분 이름
rep("""'우회 (조)': '우회 조' };""", """'우회 (조)': '우회 조', '2열': '2열 (창)', '돌격': '돌격!' };""")

# 로그 (자세히)
rep("""      case 'charge': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 돌진!`); break;""", """      case 'charge': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.name || '돌진'}! "${e.cry || ''}"`); break;""")
rep("""      case 'impact': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 들이받음${e.block ? ' (방패로 받음 · 자세 크게 깎임)' : ''}${e.broke ? ' · 자세 무너짐' : ''} · 밀려남 · 움찔`); break;""",
    """      case 'impact': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.clash ? '마주 돌격 — 정면 충돌' : '들이받음'}${e.vr ? ' (부딪힌 속력 ' + e.vr + ')' : ''}${e.block ? ' · 방패로 받음 (자세 크게 깎임)' : ''}${e.broke ? ' · 자세 무너짐' : ''}${e.trained ? ' · 훈련된 방진이 버팀' : e.braced ? ' · 뒤 동료가 받쳐 줌' : ''} · 움찔`); break;""")
rep("""{ sweep: '휘둘러 날려 보냄', bash: '방패로 밀침', charge: '들이받아 날려 보냄', bowl: '부딪혀 밀려남' }[e.how]""", """{ sweep: '휘둘러 날려 보냄', bash: '방패로 밀침', charge: '들이받아 날려 보냄', clash: '마주 부딪혀 밀려남', recoil: '튕겨 나감', bowl: '부딪혀 밀려남' }[e.how]""")

# 이야기
rep("""    case 'charge': return e.vis || U(e.a).side === 0 ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 땅을 울리며 ${reul(n(e.b))} 향해 돌진한다!` } : null;""",
    """    case 'charge': if (!(e.vis || U(e.a).side === 0)) return { c: 'dim', s: '어둠 속에서 무언가 달려오는 발소리가 난다!' };
      return { c: U(e.a).side ? 'bad' : 'good', s: e.mute ? `${ga(n(e.a))} ${e.cry || ''} ${reul(n(e.b))} 향해 전력질주한다!` : `${n(e.a)}: "${e.cry || '이야아아!'}" — ${reul(n(e.b))} 향해 ${U(e.a).giant ? '땅을 울리며 ' : ''}${e.name || '돌격'}!` };""")
rep("""    case 'impact': return""", """    case 'impact': if (e.clash) return { c: '', s: `${ga(n(e.a))} 마주 달려온 ${wa(n(e.b))} 정면으로 부딪힌다!` };
      if (e.trained) return { c: U(e.b).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(n(e.b))} 들이받지만 — 훈련된 방진이 버틴다!` };
      return""")
rep("""      if ((e.how === 'sweep' || e.how === 'charge') && e.len >= 1) return { s: `${ga(n(e.b))} ${e.len}칸을 날아간다!` }; return null;""",
    """      if ((e.how === 'sweep' || e.how === 'charge' || e.how === 'clash') && e.len >= 1) return { s: `${ga(n(e.b))} ${e.len}칸을 날아간다!` };
      if (e.how === 'recoil' && e.len >= 0.3) return { c: 'dim', s: `${ga(n(e.b))} 튕겨 나온다.` }; return null;""")
rep("""    case 'shout': if (e.s === '비켜!') return U(e.a).side === 0 ? { c: 'dim', s: `${n(e.a)}: "비켜!" — 크게 휘두르려 한다.` } : U(e.a).seenBy ? { c: 'bad', s: `${n(e.a)}: "비켜!" — 동료까지 휩쓸 기세로 휘두르려 한다!` } : null;""",
    """    case 'shout': if (e.mute) return U(e.a).seenBy || U(e.a).side === 0 ? { c: U(e.a).side ? 'bad' : 'good', s: e.s === '비켜!' ? `${ga(n(e.a))} 크게 휘두르려 한다 — 동료까지 휩쓸 기세다!` : `${ga(n(e.a))} 말없이 방패를 세운다.` } : null;
      if (e.s === '비켜!') return U(e.a).side === 0 ? { c: 'dim', s: `${n(e.a)}: "비켜!" — 크게 휘두르려 한다.` } : U(e.a).seenBy ? { c: 'bad', s: `${n(e.a)}: "비켜!" — 동료까지 휩쓸 기세로 휘두르려 한다!` } : null;""")
rep("""      if (/손이 안 닿음/.test(e.why)) return""", """      if (/돌리지 못함/.test(e.why)) return { c: 'dim', s: `${ga(a.name)} 몸을 다 돌리지 못해 헛친다.` };
      if (/손이 안 닿음/.test(e.why)) return""")

# 수치표
rep("""['charge.min', '[돌진]: 가장 가까운 거리 (칸)'], ['charge.max', '[돌진]: 가장 먼 거리 (칸)'], ['charge.spd', '[돌진]: 속력 ×'], ['charge.dmg', '[돌진]: 공격 ×'], ['charge.post', '[돌진]: 막은 방패 자세 깎임'], ['charge.push', '[돌진]: 밀치는 거리 (칸)'], ['charge.pin', '[돌진]: 움찔 (초)'], ['charge.cd', '[돌진]: 다시 쓰기 (초)']""",
    """['charge.min', '[돌격 · 돌진]: 가장 가까운 거리 (칸)'], ['charge.max', '[돌격 · 돌진]: 가장 먼 거리 (칸)'], ['charge.spd', '[돌격 · 돌진]: 전력질주 속력 ×'], ['charge.dmg', '[돌격 · 돌진]: 공격 × (부딪힌 속력 4.5 기준)'], ['charge.post', '[돌격 · 돌진]: 막은 방패 자세 깎임'], ['charge.pin', '[돌격 · 돌진]: 움찔 (초)'], ['charge.cd', '[돌격 · 돌진]: 다시 쓰기 (초)'],
    ['charge.e', '충돌: 튕김 (0 = 붙어 감 · 1 = 완전 탄성)'], ['charge.kb', '충돌: 부딪힌 뒤 속력 × 이 초만큼 날아감'], ['charge.downV', '충돌: 이 속력 넘게 튕겨 나가면 넘어짐'], ['charge.brace', '방진: 뒤 · 옆 동료 무게가 받쳐 주는 몫'], ['charge.trained', '방진: 이쪽을 막고 선 전선 (훈련된 방진) 버팀 ×'], ['charge.worth', '돌격할 만한 기준 (− 대담함 × 0.8)'], ['turnMass', '돌아서기: √(이 값 ÷ 무게) 배 (무거울수록 느림)'], ['faceArc', '근접: 몸이 상대 쪽 ±도 안을 봐야 들어감']""")

open(P,'w',encoding='utf-8').write(s)
print('ok')
