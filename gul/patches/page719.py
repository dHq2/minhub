# v7.19.0 페이지 — page719.py v1.2 (v1.2: 옐로 설계에 ◆저주:맥아의 파생 · 제약 특성도 적음 (특성 검사) · v1.1: 나달 · 가윤 속력을 레베카 · 인주 쪽으로 · 2단계 인물: 탕아 · 딸기 · 옐로 · 트라카 · 쟝 · 나달 · 가윤 · 간두 · 모닝스타 설계 칸 · 프로필 (뽑기 · 도감으로 놓아도 같게) · 정체성 · 끝없는 치유 표시 · 서술 · 옛 저장 한 번 맞춤)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.18.0 (2026-10-18)', '<!-- 굴의 전투판 v7.19.0 (2026-10-18)')
rep('     v7.18.0: ', '''     v7.19.0: 2단계 인물 (설계 칸 · 동료 뽑기 · 도감 모두 같게). 공통 기술 · 등급 특성으로 짜고, 고유는 그 인물다운 것만 (공중제비 · 머리 찍기 · 영거리 사격 · 철퇴 기술 · 역장 · 열매 · 뿌리 벽은 v7.19.1 ~).
         탕아 (용사 · 대검 두 손 · 베테랑 · 영웅 · 지휘B · 사격B · 회피B · 투구 없는 갑옷) · 딸기 (대정령 서포터 · 마력 치유 끝없음 — 처음 12% (8 ~ 20) + 0.5초마다 3 × 6 · 3.5칸 밖에서도 · 대지 마법 6칸 (흙덩이 — 갑옷 판정 · 약한 넉백) · 약한 재생 1.2%/초)
         옐로 (의학B — 양동이 약 ×1.15 · 약이 초당 4씩 다시 참 · 2연속 도약) · 트라카 (고블린 궁수 · 단궁 4칸 속사 (2 ~ 3발) · 사격B · 회피A · 도약) · 쟝 (장도리 · 회피A · 급소A · 후각B · 야시B · 체력 95 · 일반인)
         나달 (여기사 190cm 중형 · 나달의 낡은 장검 0.62 + 키 리치 · 판금 · 베테랑) · 가윤 (간호사 · 소형 · 체력 70 · 의학A · 지혈 · 약 20번 — 처음 30% (15 ~ 45) × 1.3 · 빠름) · 간두 (권총 연사 12발 탄창 · 탄 100 · 사격A · 회피B · 190cm 중형 · 체력 110)
         모닝스타 (슈퍼스타 · 철퇴 1.3칸 (긴 근접) · 맞으면 밀림 · 괴력A · 경갑 · 회피C). 새 무기 6 · 수치표 이전 7.19.0 (지형 · 새 무기 칸).
     v7.18.0: ''')
rep('h1::after{content:" v7.18.0"', 'h1::after{content:" v7.19.0"')
rep('<footer>굴의 전투판 v7.18.0', '<footer>굴의 전투판 v7.19.0')
rep('return `굴의 전투판 v7.18.0 · ${title}', 'return `굴의 전투판 v7.19.0 · ${title}')
rep("copyText('굴의 전투판 v7.18.0 자동 판 기록", "copyText('굴의 전투판 v7.19.0 자동 판 기록")
rep('의 버전 기록에 — v7.18.0 언덕 · 더미 · 엄폐 (1F 1.5단계)', '의 버전 기록에 — v7.19.0 새 인물 아홉 (2단계) / v7.18.0 언덕 · 더미 · 엄폐 (1F 1.5단계)')
rep('">v7.18.0 · 언덕 · 더미 · 엄폐</span>', '">v7.19.0 · 새 인물 아홉</span>')
rep("RULES_MIG = '7.17.0'", "RULES_MIG = '7.19.0'")

# ---------- 설계 칸: 새 인물 ----------
rep("  { key: '검방패기사', side: 1,", """  // v7.19 2단계 인물 (design_1F N · 도감 설정) — 공통 기술 · 등급 특성 위주
  { key: '탕아', side: 0, ref: 'C-221', name: '탕아', tier: 2, cls: '근접', role: '공격수', weapon: '대검', sm: 1.38, height: 1.82, weight: 82, bold: 0.6, nv: true, nvG: 'B', ov: { hp: 150, atk: 34 }, traits: ['베테랑', '영웅', '지휘B', '사격B', '회피B', '은신C'], gear: { 몸: { name: '용사의 갑옷', mat: '판금', tier: 2 } }, race: '인간 (용사)', origin: '판타지계 — 전투 중 죽어서 떨어짐', tactic: '용사 · 대검 (두 손) · 공중제비', note: '무감정하지만 정의로운 장군 출신 용사. 대검을 두 손으로 써 방패는 못 듦 (대검으로 막음). 회피가 좋은 근접 전투원 · 사격 재능도 있음 (권총 · 샷건은 한 손이라 명중이 떨어짐). 투구 없는 갑옷' },
  { key: '딸기', side: 0, ref: 'C-218', name: '딸기', tier: 2, cls: '치유', role: '지원', weapon: '대지 마법', sm: 0.97, height: 1.7, weight: 58, bold: 0.3, nv: true, nvG: 'B', ov: { hp: 120, atk: 22 }, regenK: 0.012, traits: ['은신C'], skill: { name: '딸기 정령술', kit: true, inf: true, pool: 99, pct: 0.12, min: 8, cap: 20, hot: 3, hotN: 6, hotGap: 0.5, cd: 2.4, wind: 0.45, rec: 0.3, rng: 3.5, auto: 0.55 }, race: '정령 (딸기 계열 대정령)', origin: '정령계', tactic: '서포터 · 마력 치유 (끝없음) · 대지 마법', note: '딸기 계열 정령 중 강한 축 — 본질은 만능 서포터. 마력으로 끝없이 치유 (3.5칸 밖에서도 · 처음 조금 + 이어서 돌봄). 대지 마법 (바위 · 흙덩이 — 갑옷 판정 · 약한 넉백). 레베카보다 약한 재생 (불사 아님)' },
  { key: '옐로', side: 0, ref: 'C-008', name: '옐로', tier: 2, cls: '기동', role: '미드필더', weapon: '맨손', height: 1.55, weight: 52, nv: true, nvG: 'B', ov: { hp: 110, atk: 26 }, traits: ['의학B', '은신B', '사족보행', '속력A', '괴력B', '제약:총포류', '제약:활'], unique: ['저주:맥아'], active: ['도약'], leapN: 2, skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.5, rec: 0.4, rng: 0.8, regen: 4 }, tactic: '기동 · 2연속 도약 · 양동이 약', note: '침식 중인 소녀. 손발이 날붙이 (짐승의 이빨처럼) · 네 발로 달리면 가장 빠름 · 도약 2연속. 의학 B (전문 지식은 있으나 의사는 아님) — 양동이 약은 몸에서 계속 다시 참 (초당 4)' },
  { key: '트라카', side: 0, ref: 'C-107', name: '트라카', tier: 2, cls: '원거리', role: '사수', weapon: '단궁', ammo: 40, sm: 1.38, height: 1.25, weight: 34, nv: true, nvG: 'B', ov: { hp: 80, atk: 20, wind: 0.4, rec: 0.5 }, traits: ['사격B', '회피A', '은신B'], active: ['도약'], race: '고블린', origin: '청광묵과 같은 세계 (서로 모름) — 청광묵보다 먼저 다른 곳에서 떨어짐', tactic: '고블린 궁수 · 단궁 속사 · 도약', note: '단궁으로 짧게 (4칸) 빠르게 두세 발씩. 작고 잘 피함. 사격 B — 도약하며 쏘지 못하고, 움직이며 쏘면 덜 맞음' },
  { key: '쟝', side: 0, ref: 'C-262', name: '쟝', tier: 2, cls: '기동', role: '미드필더', weapon: '장도리', sm: 0.81, height: 1.8, weight: 72, bold: 0.75, nv: true, nvG: 'B', ov: { hp: 95, atk: 30 }, traits: ['회피A', '급소A', '후각B', '은신B', '일반인'], race: '인간', origin: '인간계 (회사원) — 굴 초반층을 떠도는 야인', tactic: '치고 빠지기 · 장도리 · 머리 찍기', note: '끌레도르라고 소개하지만 본명은 잭. 본인도 몰랐던 격투 재능 — 잘 피하고 잘 때림, 치명이 잦음. 근력은 세지 않음. 미친 듯 달려들다 살아남은 이레귤러' },
  { key: '나달', side: 0, ref: 'C-198', name: '나달', tier: 2, cls: '근접', role: '전선', weapon: '나달의 낡은 장검', sm: 0.99, height: 1.9, weight: 78, sizeCls: '중형', nv: true, nvG: 'C', ov: { hp: 130, atk: 30 }, traits: ['베테랑', '은신D'], gear: { 몸: { name: '나달의 판금 갑옷', mat: '판금', tier: 3 } }, race: '인간 (여기사)', origin: '판타지계', tactic: '여기사 · 장검 (긴 리치)', note: '금기사 나달. 190cm — 키만큼 장검이 멀리 닿음 (리치). 판금 갑옷 · 투구는 따로. 다른 이가 나달의 낡은 장검을 들면 리치가 약간 길어짐' },
  { key: '가윤', side: 0, ref: 'C-018', name: '가윤', tier: 2, cls: '치유', role: '지원', weapon: '맨손', sm: 0.94, height: 1.55, weight: 46, sizeCls: '소형', bold: 0.2, nv: true, nvG: 'D', ov: { hp: 70, atk: 8 }, traits: ['의학A', '일반인', '은신C'], skill: { name: '지혈 · 약', kit: true, pool: 20, pct: 0.3, min: 15, cap: 45, hot: 0, hotN: 0, hotGap: 0.4, cd: 1.4, wind: 0.35, rec: 0.25, rng: 0.8, auto: 0.6 }, race: '인간', origin: '인간계 — 오래전 전쟁터에서 죽어서 옴 (젊은 간호사)', tactic: '치료 몰빵 · 지혈과 약 (20번)', note: '치유에만 몰빵 — 빠르고 많이 (정확한 부위에 지혈과 약, 바로 회복). 20번 (인카운터 · 루팅으로 보급). 근접 · 공격 · 근력 · 야시 모두 약함' },
  { key: '간두', side: 0, ref: 'C-195', name: '간두', tier: 2, cls: '원거리', role: '사수', weapon: '권총', ammo: 100, sm: 1.38, height: 1.9, weight: 85, sizeCls: '중형', nv: true, nvG: 'B', ov: { hp: 110, atk: 26 }, traits: ['사격A', '회피B', '은신C'], race: '인간', origin: '인간계와 비슷한 어느 곳 — 항쟁 끝에 하수구로 도망쳐 당도', tactic: '권총 연사 · 샷건 영거리 사격 (특수탄)', note: '갱스터. 권총을 빠르게 연사 (12발 탄창 · 일반탄 100). 엎드려 쏠 수 있음. 회피가 좋고 근접에도 재능. 샷건 영거리 사격 (특수탄 100) 은 v7.19.1' },
  { key: '모닝스타', side: 0, ref: 'C-005', name: '모닝스타', tier: 2, cls: '근접', role: '공격수', weapon: '모닝스타', sm: 1.12, height: 1.72, weight: 62, bold: 0.65, nv: true, nvG: 'C', ov: { hp: 140, atk: 30 }, traits: ['괴력A', '회피C', '은신D'], gear: { 몸: { name: '경갑', mat: '경갑', tier: 1 } }, race: '인간 (초인계)', origin: '판타지계', tactic: '슈퍼스타 · 철퇴 (긴 근접) · 넉백', note: '"슈퍼스타". 철퇴를 신나게 휘두름 — 1.3칸까지 닿고 맞으면 밀림 (괴력). 전선에서 싸우는 게 좋음. 투구 없는 경갑' },
  { key: '검방패기사', side: 1,""")
rep("'C-008': { cls: '기동', race: '괴물 + 인간 (지금은 괴물에 가까움 · 침식 중)', origin: '일반적 인간계', unique: ['저주:맥아'], skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.5, rec: 0.4, rng: 0.8 }",
    "'C-008': { cls: '기동', race: '괴물 + 인간 (지금은 괴물에 가까움 · 침식 중)', origin: '일반적 인간계', unique: ['저주:맥아'], skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.5, rec: 0.4, rng: 0.8, regen: 4 }")
rep("for (const k of ['role', 'weapon', 'height', 'weight', 'sm', 'ammo', 'bold', 'cry', 'rank', 'sq']) if (pf[k] === undefined && d[k] !== undefined) pf[k] = clone(d[k]);",
    "for (const k of ['role', 'weapon', 'height', 'weight', 'sm', 'ammo', 'bold', 'cry', 'rank', 'sq', 'cls', 'sizeCls', 'regenK', 'leapN', 'race', 'origin']) if (pf[k] === undefined && d[k] !== undefined) pf[k] = clone(d[k]);   /* v7.19 몸 · 재생 · 2연속 도약 · 종족 */\n  if (d.side === 0 && d.name && pf.name === undefined && RBY[d.ref] && RBY[d.ref][1] !== d.name) pf.name = d.name;   /* v7.19 도감 이름 (산딸기 (3성) …) 대신 */")
rep("if (d.side === 1 && d.nvG && pf.nv === undefined){ pf.nv = true; pf.nvG = d.nvG; } }", "if (d.side === 1 && d.nvG && pf.nv === undefined){ pf.nv = true; pf.nvG = d.nvG; } if (d.side === 0 && d.nvG && pf.allyNv === undefined) pf.allyNv = d.nvG; }")
rep("  if (pf.ammo != null && u.ammo == null) u.ammo = pf.ammo;", "  if (pf.ammo != null && u.ammo == null) u.ammo = pf.ammo;\n  for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]); if (pf.name && u.side === 0) u.name = pf.name; if (pf.skill && !u.skill && u.side === 0) u.skill = clone(pf.skill);   /* v7.19 */")
rep("'unique', 'am', 'smellG', 'bladeHands', 'noRanged', 'active', 'weight', 'modBody', 'cry', 'mute', 'rank', 'sq'];", "'unique', 'am', 'smellG', 'bladeHands', 'noRanged', 'active', 'weight', 'modBody', 'cry', 'mute', 'rank', 'sq', 'sizeCls', 'regenK', 'leapN'];   /* v7.19 */")
rep("'C-052': { traits: ['망자'] }, 'C-053'", "'C-221': { traits: ['영웅'] }, 'C-218': { skill: true }, 'C-018': { skill: true, traits: ['일반인'] }, 'C-262': { traits: ['일반인'] },   /* v7.19 */\n  'C-052': { traits: ['망자'] }, 'C-053'")

# ---------- 끝없는 치유 · 표시 ----------
rep("st.ix = K.kit ? '응급처치' : '약';", "st.ix = K.inf ? '재생' : K.kit ? '응급처치' : '약';")
rep("' (남은 ' + C.map(u => u.skill.left).join('·')", "' (남은 ' + C.map(u => skLeft(u.skill)).join('·')")
rep("st.sb = st.on ? '아군을 누름' : '남은 ' + C.map(u => u.skill.left).join('·');", "st.sb = st.on ? '아군을 누름' : '남은 ' + C.map(u => skLeft(u.skill)).join('·');")
rep("const SLOT_IC = {", "const skLeft = K => K.inf ? '∞' : Math.round(K.left);   // v7.19 마력 치유 (딸기) 는 끝없음\nconst SLOT_IC = {")
rep("${u.skill ? (u.skill.kit ? ' · 구급 ' : ' · 약 ') + u.skill.left : ''}", "${u.skill ? (u.skill.inf ? ' · 마력 ∞' : (u.skill.kit ? ' · 구급 ' : ' · 약 ') + Math.round(u.skill.left)) : ''}")
rep("<i>[${esc(u.skill.name)}]</i> 구급상자 ${u.skill.left}/${u.skill.pool} ·", "<i>[${esc(u.skill.name)}]</i> ${u.skill.inf ? '마력 (끝없음)' : (u.skill.name === '응급처치' ? '구급상자 ' : '남은 ') + u.skill.left + '/' + u.skill.pool} ·")
rep("case 'skill': if (e.kit) return { c: 'good', s: `${ga(n(e.a))} 구급상자로 ${e.revive", "case 'skill': if (e.kit) return { c: 'good', s: `${ga(n(e.a))} ${e.name && e.name !== '응급처치' ? ro(e.name) : '구급상자로'} ${e.revive")
rep("(+${e.amt}, 남은 구급상자 ${e.left}).", "(+${e.amt}${U(e.a).skill && U(e.a).skill.inf ? '' : `, 남은 ${e.name && e.name !== '응급처치' ? '약' : '구급상자'} ${e.left}`}).")

# ---------- 옛 저장 한 번: 도감 · 뽑기로 놓였던 새 인물을 설계대로 · 옐로에 의학B · 다시 차는 약 · 2연속 도약 ----------
rep("// v7.16.3 도감 · 동료 뽑기로 놓였던 아군을 설계대로", """// v7.19 2단계 인물 (한 번): 도감 기본값 (프로필 없음) 으로 놓였던 새 인물은 설계대로 · 옐로는 의학B · 다시 차는 약 · 2연속 도약만 더함
const NEW719 = ['C-221', 'C-218', 'C-107', 'C-262', 'C-198', 'C-018', 'C-195', 'C-005'];
const fix719 = p => { if (!p || (p.side || 0) !== 0) return false; let c = false;
  if (NEW719.includes(p.ref) && !p.tactic){ const d = DESIGN_DEFAULTS.find(x => x.ref === p.ref); if (d){ const keep = { id: p.id, x: p.x, y: p.y, side: 0, grp: p.grp, hero: !!p.hero }; for (const k of Object.keys(p)) if (!(k in keep)) delete p[k]; Object.assign(p, fromDesign(d, 0), keep); c = true; } }
  if (p.ref === 'C-008'){ const tr = p.traits || (p.traits = []); if (!tr.some(x => /^의학/.test(x))){ tr.push('의학B'); c = true; } if (p.skill && !p.skill.kit && !p.skill.regen){ p.skill.regen = 4; c = true; } if (!p.leapN){ p.leapN = 2; c = true; } if (!(p.active || []).includes('도약')){ p.active = [...(p.active || []), '도약']; c = true; } }
  return c; };
if (!S.v719k){ let n = 0; for (const u of S.units) if (fix719(u)) n++; try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fix719(d)){ dc = true; n++; } if (dc) saveMyDesigns(mine); } catch (e) {}
  S.v719k = true; if (n) setTimeout(() => { save(); toast(`새 인물 설정으로 맞췄어요 (${n}곳 — 2단계 인물 · 옐로 의학B · 2연속 도약)`); }, 1700); }
// v7.16.3 도감 · 동료 뽑기로 놓였던 아군을 설계대로""")

open(F, 'w', encoding='utf-8').write(s)
print('page719 OK')
