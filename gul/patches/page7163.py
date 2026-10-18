# v7.16.3 페이지 — page7163.py v1 (모순 점검: 도감 · 동료 뽑기로 놓은 아군이 설계 칸과 같게 (노먼 응급처치 · 부대장 · 2편대 · 야시) · 뽑기 칸의 '지금 동료' · 설명 글 숫자 (후각 · 노먼 · 친칠라 · 포렌) · 응급처치 편집 칸)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.16.2 (2026-10-17)', '<!-- 굴의 전투판 v7.16.3 (2026-10-17)')
rep('     v7.16.2: ', '''     v7.16.3: 모순 점검 — 같은 인물을 어디서 놓든 같게 · 창마다 같은 숫자.
         ① 도감 (붓) · 동료 뽑기로 놓은 노먼이 옛 응급처치 (처음 체력 40% · 최대 100 · 돌봄 없음) 였음 → 설계대로 (처음 10 ~ 30 + 0.4초마다 4 × 5). 이미 그렇게 놓인 노먼도 한 번 고침.
         ② 도감 · 뽑기로 놓으면 노먼이 2편대장 (부대장) 이 아니고 청광묵 · 친칠라도 2편대가 아니었음 → 설계대로 (바꾸는 건 자유).
         ③ 동료 뽑기로 들어온 아군은 야시가 모두 꺼졌음 (인주 C · 노먼 A · 레베카 A · 카리우스 B · 청광묵 B · 친칠라 S 가 밤에 못 봄) → 설계대로. 이미 놓인 아군도 한 번 되돌림.
         ④ 동료 뽑기 칸의 '지금 동료' 가 처음 뽑기 기록 (노먼 · 레베카 · 카리우스) 만 보여 줘서 실제 배치 (청광묵 · 친칠라 포함) 와 달랐음 → 실제 배치대로.
         ⑤ 설명 글 숫자: [높은후각] '9칸 · 3초마다' → 수치표대로 (14칸 · 2초마다 — 수치표를 바꾸면 따라 바뀜) · 편집 칸 후각 A 도 · 포렌 설명 '3초마다' → '2초마다'.
            노먼 설명 '다친 동료 50% 아래면 스스로' → 치료 방침대로 (명령으로 · 스스로는 동료가 죽기 직전일 때만). 친칠라 설명 '화살이 약하고' → 관통력은 활과 같고 근력 · 사격 솜씨가 한 단계 아래.
         ⑥ 편집 칸의 응급처치: '총량 · 한 번에' (양동이 약 칸) 가 나오던 것 → '횟수' 와 회복량 (처음 · 돌봄) 을 보여 줌.
     v7.16.2: ''')
rep('h1::after{content:" v7.16.2"', 'h1::after{content:" v7.16.3"')
rep('<footer>굴의 전투판 v7.16.2', '<footer>굴의 전투판 v7.16.3')
rep('return `굴의 전투판 v7.16.2 · ${title}', 'return `굴의 전투판 v7.16.3 · ${title}')
rep("copyText('굴의 전투판 v7.16.2 자동 판 기록", "copyText('굴의 전투판 v7.16.3 자동 판 기록")
rep('의 버전 기록에 — v7.16.2 카리우스 체력 700 /', '의 버전 기록에 — v7.16.3 모순 점검 (도감 · 뽑기 · 설명 글) / v7.16.2 카리우스 체력 700 /')
rep('">v7.16.2 · 카리우스 체력 700</span>', '">v7.16.3 · 모순 점검</span>')

# ---------- ① 노먼 응급처치: 프로필의 옛 값을 빼면 설계 칸 (KIT) 이 프로필로 들어감 ----------
rep("gear: { 몸: { name: '방탄복', mat: '방탄', tier: 2 } }, skill: { name: '응급처치', kit: true, pool: 7, pct: 0.4, cap: 100, cd: 2.2, wind: 0.5, rec: 0.3, rng: 0.8, auto: 0.5 }, tactic: '기동 소총사수 · 응급처치'",
    "gear: { 몸: { name: '방탄복', mat: '방탄', tier: 2 } }, tactic: '기동 소총사수 · 응급처치'")   # v7.16.3 응급처치는 설계 칸 (KIT) 에서
rep("베테랑 정규군. 점사 · 재장전 · 구급상자 (다친 동료 50% 아래면 스스로)",
    "베테랑 정규군. 점사 · 재장전 · 응급처치 (명령으로 — 스스로는 동료가 죽기 직전일 때만 뛰쳐나감 · 치료 방침으로 바꿀 수 있음)", 2)

# ---------- ② 편대 (2편대 · 부대장) 도 설계 칸에서 프로필로 ----------
rep("for (const k of ['role', 'weapon', 'height', 'weight', 'sm', 'ammo', 'bold', 'cry'])",
    "for (const k of ['role', 'weapon', 'height', 'weight', 'sm', 'ammo', 'bold', 'cry', 'rank', 'sq'])")   # v7.16.3
rep("  if (pf.ammo != null && u.ammo == null) u.ammo = pf.ammo;",
    "  if (pf.ammo != null && u.ammo == null) u.ammo = pf.ammo;\n  if (u.side === 0){ if (pf.rank && u.rank === undefined) u.rank = pf.rank; if (pf.sq && u.sq === undefined) u.sq = pf.sq; }   /* v7.16.3 도감 · 뽑기로 놓아도 설계대로 (노먼 2편대장 · 청광묵 · 친칠라 2편대) */")

# ---------- ③ 동료 뽑기: 야시를 끄지 않음 ----------
rep("unitFromRef('C-001', 0, { hero: true, nv: false })", "unitFromRef('C-001', 0, { hero: true })", 2)   # 뽑기 판 · 다시 짜기
rep("D.picks.forEach(c => S.units.push(unitFromRef(c, 0, { nv: false })));", "D.picks.forEach(c => S.units.push(unitFromRef(c, 0)));   /* v7.16.3 야시를 끄지 않음 (설계대로) */")
rep("statsOf(unitFromRef(c, 0, { nv: false }), rules)", "statsOf(unitFromRef(c, 0), rules)")
rep("put('C-001', 0, 'h2', { hero: true, nv: false, weapon: '창' });", "put('C-001', 0, 'h2', { hero: true, weapon: '창' });")
rep("put('C-001', 0, 'h2', { hero: true, nv: false });", "put('C-001', 0, 'h2', { hero: true });")

# ---------- ④ 뽑기 칸의 '지금 동료' = 실제 배치 ----------
rep("지금 동료: <b>${esc(names.join(' · ') || '없음')}</b>", "지금 동료: <b>${esc(S.units.filter(u => u.side === 0 && !u.hero).map(u => u.name).join(' · ') || '없음')}</b>")

# ---------- ⑤ 설명 글 숫자 ----------
rep("  '높은후각': 'A: 빛이 없어도 4칸 안은 냄새로 정확히, 9칸까지는 대략적인 방향과 거리. S: 맵 전체를 대략. 바위 너머도 맡음. 아군이면 3초마다 동료에게 브리핑',",
    "  '높은후각': 'A: 빛이 없어도 4칸 안은 냄새로 정확히, 14칸까지는 대략적인 방향과 거리. S: 맵 전체를 대략. 바위 너머도 맡음. 아군이면 2초마다 동료에게 브리핑',   // v7.16.3 수치표대로 (특성 탭은 수치표를 따라감)")
rep("  return TRAITS[t] || '';\n}",
    "  if (t === '높은후각') return `A: 빛이 없어도 ${rules.smell || 4}칸 안은 냄새로 정확히, ${rules.smellFar || 14}칸까지는 대략적인 방향과 거리. S: 맵 전체를 대략. 바위 너머도 맡음. 아군이면 ${rules.briefT || 2}초마다 동료에게 브리핑`;   /* v7.16.3 수치표를 따라감 */\n  return TRAITS[t] || '';\n}")
rep("<option value=\"A\" ${p.smellG !== 'S' ? 'selected' : ''}>후각 A (대략 9칸)</option>", "<option value=\"A\" ${p.smellG !== 'S' ? 'selected' : ''}>후각 A (대략 ${rules.smellFar || 14}칸)</option>")
rep("냄새로 맡은 적의 대략적인 방향 · 거리를 3초마다 동료에게 알림", "냄새로 맡은 적의 대략적인 방향 · 거리를 2초마다 동료에게 알림")
rep("다만 화살이 궁수의 활보다 느리고 약하고 근력도 약해, 역전의 명사수인 궁수와 1대1 로 맞쏘면 질 수 있음",
    "관통력은 활과 같지만 화살이 궁수의 활보다 느리고 근력 · 사격 솜씨 (A 대 S) 가 한 단계 아래라, 역전의 명사수인 궁수와 1대1 로 맞쏘면 살짝 밀림")

# ---------- ⑥ 편집 칸의 응급처치 ----------
rep("${p.skill ? `<div class=\"row\"><span class=\"brush\">기술 <b>${esc(p.skill.name)}</b></span><label class=\"brush\" for=\"skPool\">총량 <input id=\"skPool\" type=\"number\" min=\"0\" step=\"10\" value=\"${p.skill.pool}\"></label>",
    "${p.skill && p.skill.kit ? `<div class=\"row\"><span class=\"brush\">기술 <b>${esc(p.skill.name)}</b></span><label class=\"brush\" for=\"skPool\">횟수 <input id=\"skPool\" type=\"number\" min=\"0\" step=\"1\" value=\"${p.skill.pool}\"></label><span class=\"brush\">처음 최대 체력의 ${Math.round((p.skill.pct || 0) * 100)}%${p.skill.cap != null ? ' (' + (p.skill.min || 0) + ' ~ ' + p.skill.cap + ')' : ''}${p.skill.hot > 0 ? ' + ' + (p.skill.hotGap || 0.4) + '초마다 ' + p.skill.hot + ' × ' + (p.skill.hotN || 1) : ''}</span></div>` : p.skill ? `<div class=\"row\"><span class=\"brush\">기술 <b>${esc(p.skill.name)}</b></span><label class=\"brush\" for=\"skPool\">총량 <input id=\"skPool\" type=\"number\" min=\"0\" step=\"10\" value=\"${p.skill.pool}\"></label>")   # v7.16.3

# ---------- 이미 놓인 아군 (한 번): 옛 응급처치 · 꺼진 야시 · 빠진 편대 ----------
rep("// v7.16.2 카리우스 체력은 700 (민수)",
    """// v7.16.3 도감 · 동료 뽑기로 놓였던 아군을 설계대로 (한 번): 노먼 옛 응급처치 · 꺼진 야시 · 빠진 편대 (편대를 손으로 바꾼 적이 있으면 그대로)
if (!S.v7163k){ const fx = new Set();
  for (const u of S.units){ if (u.side !== 0) continue; if (fixKit73(u)) fx.add(u.name);
    const d = DESIGN_DEFAULTS.find(x => x.side === 0 && x.ref && x.ref === u.ref); if (!d) continue;
    if (!u.nv && d.nv){ u.nv = true; u.nvG = d.nvG || 'B'; fx.add(u.name); }
    if (d.sq && u.sq === undefined){ u.sq = d.sq; fx.add(u.name); } if (d.rank && u.rank === undefined && !S.units.some(x => x.side === 0 && x.rank === d.rank)){ u.rank = d.rank; fx.add(u.name); } }
  S.v7163k = true; if (fx.size) setTimeout(() => { save(); toast(`설계대로 맞췄어요: ${[...fx].join(' · ')} (도감 · 동료 뽑기로 놓였을 때 빠졌던 응급처치 · 야시 · 편대)`); }, 1200); }
// v7.16.2 카리우스 체력은 700 (민수)""")

open(F, 'w', encoding='utf-8').write(s)
print('page7163 OK')
