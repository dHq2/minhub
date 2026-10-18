s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
rep("""<!-- 굴의 전투판 v4.5 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
""","""<!-- 굴의 전투판 v4.6 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v4.6: ◆고유특성 (하나뿐인 특성): 설정 글 · 효과 · 파생특성 · 제약을 함께 가짐. 첫 번째: 옐로 ◆[저주:맥아].
           근접 타격이 날붙이 판정 (맨손 · 발톱이어도 날붙이 → 암살 치명상이 됨), 파생특성 [사족보행] [속력A] [괴력B], 제약 [제약:총포류] [제약:활].
           등급 특성: [속력X] 이동 속력 × (S 1.35 · A 1.2 · B 1.1 · C 1.05), [괴력X] 공격 × (S 1.6 · A 1.45 · B 1.3 · C 1.15) · 막힐 때 상대 자세도 그만큼 더 깎음.
           옐로의 공격 배율 ×1.35 · '원거리 못 다룸' 은 [괴력B] · 제약으로 바뀜 (옐로: 공격 27 · 속력 4.2, 네 발로 5.9).
           무기 종류 (날붙이 · 둔기 · 맨손 · 짐승 · 총포류 · 활 · 마법) — 제약이 그 종류를 무기 고르기에서 막음. 수치 탭에 등급표 · 무기 종류.
""")
for a,b in [("""<span class="ver">v4.5 · 한 턴씩""","""<span class="ver">v4.6 · 한 턴씩"""),("""  <footer>굴의 전투판 v4.5 — ""","""  <footer>굴의 전투판 v4.6 — """),("""copyText('굴의 전투판 v4.5 자동 판 기록""","""copyText('굴의 전투판 v4.6 자동 판 기록"""),("""  return `굴의 전투판 v4.5 · ${title}""","""  return `굴의 전투판 v4.6 · ${title}""")]: rep(a,b)
# UNIQUE table + helpers (before PROFILE)
rep("""// tac (엔진이 읽는 전술): pack = 포위 사냥, stalk = 어둠 속 우회. nv 는 적일 때만""","""// ◆고유특성: 하나뿐인 특성. 설정 글 (lore) · 효과 · 파생특성 · 제약 · 판정 (flags) 을 함께 가짐. who = 그 특성을 가진 단 한 사람
const UNIQUE = {
  '저주:맥아': { who: 'C-008',
    lore: ['옐로는 할 수 있는 만큼은 자비를 베풀었고, 그녀 자신은 아무 능력 없는 소녀에 불과했다.', '한 괴인을 돌봐주고, 옐로는 점점 침식당했다.', '그녀 자신도 모르는 사이에 저주는 그녀를 좀먹었고, 그녀의 손과 온몸에는 금이 가고 진액이 흐르게 되었다.', '옐로 본인은 다정하고 착하다고 느낄 수 있겠지만, 그 내면이 어떤지는 잘 모를 것이다.', '옐로는 굴에서 너무 오래 착했다.'],
    effects: ['근접 타격이 날붙이 판정을 받음 (맨손 · 발톱이어도 날붙이 — 무방비한 등에 들어가면 암살 치명상)'],
    derived: ['사족보행', '속력A', '괴력B'], limits: ['제약:총포류', '제약:활'], flags: { bladeHands: true } },
};
function applyUnique(u){
  for (const name of u.unique || []){ const d = UNIQUE[name]; if (!d) continue;
    u.traits = [...new Set([...(u.traits || []), ...d.derived, ...d.limits])];
    if (d.flags && d.flags.bladeHands) u.bladeHands = true; }
  return u;
}
// 등급 특성 설명 ([속력A] · [괴력B] …) 과 보통 특성 설명
const GRADE_KEYS = ['속력', '괴력'];
function traitDesc(t){
  const m = /^(속력|괴력)([SABC])$/.exec(t);
  if (m){ const k = rules.grades && rules.grades[m[1]] ? rules.grades[m[1]][m[2]] : 1; return m[1] === '속력' ? `이동 속력 ×${k}` : `공격 ×${k} · 막히면 상대 자세를 ×${k} 더 깎음`; }
  return TRAITS[t] || '';
}
// 이 인물이 이 무기를 쓸 수 있나 (제약)
function weaponOk(p, w){
  const W = rules.weapons[w] || {}, tr = p.traits || [];
  if (tr.includes('제약:총포류') && W.kind === '총포류') return false;
  if (tr.includes('제약:활') && W.kind === '활') return false;
  if (p.noRanged && W.rng > 1) return false;
  return true;
}
// tac (엔진이 읽는 전술): pack = 포위 사냥, stalk = 어둠 속 우회. nv 는 적일 때만""")
rep("""  '사족보행': '가끔 네 발로 짐승처럼 뛰어다님: 2칸 넘게 달릴 때 속력 ×1.4 (공격하려면 일어섬)',""","""  '사족보행': '가끔 네 발로 짐승처럼 뛰어다님: 2칸 넘게 달릴 때 속력 ×1.4 (공격하려면 일어섬)',
  '제약:총포류': '총 · 저격총 · 샷건을 못 다룸',
  '제약:활': '활을 못 다룸',""")
rep("""  'C-008': { cls: '기동', am: 1.35, traits: ['사족보행'], noRanged: true, skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.8, rec: 0.4, rng: 0.8 }, tactic: '기동 · 양동이 약', note: '기형적인 손이라 총 · 활은 못 다룸. 가끔 네 발로 짐승처럼 뛰어다니고, 공격이 셈. 양동이에 담은 자기 세계의 약으로 모두 합쳐 500 만큼 회복 (한 번에 최대 120) — 평소엔 명령으로, 동료가 아주 위급하면 (체력 25% 아래) 스스로' },""",
"""  'C-008': { cls: '기동', unique: ['저주:맥아'], skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.8, rec: 0.4, rng: 0.8 }, tactic: '기동 · 양동이 약', note: '양동이에 담은 자기 세계의 약으로 모두 합쳐 500 만큼 회복 (한 번에 최대 120) — 평소엔 명령으로, 동료가 아주 위급하면 (체력 25% 아래) 스스로' },""")
rep("""if (pf.tac) u.tac = pf.tac; if (pf.cls) u.cls = pf.cls; if (pf.am) u.am = pf.am; if (pf.noRanged) u.noRanged = true;""","""if (pf.tac) u.tac = pf.tac; if (pf.cls) u.cls = pf.cls; if (pf.am) u.am = pf.am; if (pf.noRanged) u.noRanged = true; if (pf.unique){ u.unique = pf.unique.slice(); applyUnique(u); }""")
# EXTRA_TRAITS: graded handled separately (not in TRAITS anyway)
# migration v46
rep("""// v4.4: 옐로 = 기동 · 공격 ×1.35 · [사족보행] · 총 · 활 못 다룸""","""// v4.6: 옐로 ◆[저주:맥아] — 공격 ×1.35 · '원거리 못 다룸' 을 [괴력B] · 제약으로 바꿈
if (!S.v46){ for (const u of S.units) if (u.ref === 'C-008'){ const pf = PROFILE['C-008']; if (u.am === 1.35) delete u.am; delete u.noRanged; u.unique = pf.unique.slice(); applyUnique(u); u.note = pf.note; u.tactic = pf.tactic; }
  if (S.rules.grades === undefined) S.rules.grades = clone(DEFAULT_RULES.grades);
  for (const w in DEFAULT_RULES.weapons) if (S.rules.weapons[w] && !S.rules.weapons[w].kind) S.rules.weapons[w].kind = DEFAULT_RULES.weapons[w].kind;
  S.v46 = true; }
// v4.4: 옐로 = 기동 · 공격 ×1.35 · [사족보행] · 총 · 활 못 다룸""")
s=s.replace("""v42: true, v43: true, v44: true,""","""v42: true, v43: true, v44: true, v46: true,""")
# editor: weapon filter + unique block + grades + limits
rep("""<select id="selWeapon" aria-label="무기">${Object.keys(rules.weapons).filter(w => !p.noRanged || rules.weapons[w].rng <= 1).map(w =>""","""<select id="selWeapon" aria-label="무기">${Object.keys(rules.weapons).filter(w => weaponOk(p, w) || w === p.weapon).map(w =>""")
rep("""    ${p.noRanged ? '<p class="note">기형적인 손: 총 · 활 같은 원거리 무기는 못 다뤄요 (무기 목록에서 빠짐)</p>' : ''}""","""    ${(p.unique || []).map(name => { const d = UNIQUE[name]; return d ? `<div class="uniq"><b>◆[${esc(name)}]</b> <small>고유특성 · 하나뿐</small><p class="lore">${d.lore.map(esc).join('<br>')}</p><p class="note">${d.effects.map(esc).join(' · ')}<br>파생특성 ${d.derived.map(t => '[' + esc(t) + ']').join(' ')} · ${d.limits.map(t => '[' + esc(t) + ']').join(' ')}</p></div>` : ''; }).join('')}
    <div class="row">${GRADE_KEYS.map(k => { const cur = ((p.traits || []).find(t => t.length === k.length + 1 && t.startsWith(k)) || '').slice(-1); return `<label class="brush" for="gr-${k}">${k} <select id="gr-${k}" data-grade="${k}"><option value="">없음</option>${['C', 'B', 'A', 'S'].map(g => `<option ${g === cur ? 'selected' : ''}>${g}</option>`).join('')}</select></label>`; }).join('')}</div>""")
rep("""  if (e.target.dataset.trait){""","""  if (e.target.dataset.grade){ const k = e.target.dataset.grade; p.traits = (p.traits || []).filter(t => !(t.length === k.length + 1 && t.startsWith(k))); if (e.target.value) p.traits.push(k + e.target.value); changed(); return; }
  if (e.target.dataset.trait){""")
rep(""".grid6{display:grid;""",""".uniq{border:1px solid color-mix(in srgb,var(--accent) 55%,var(--line));border-radius:8px;padding:8px 10px;background:color-mix(in srgb,var(--accent) 7%,var(--bg))}
.uniq b{color:var(--accent);font:700 14px var(--display)} .uniq small{color:var(--dim);font-size:11px} .uniq .lore{margin:6px 0;font:italic 12.5px/1.6 var(--body);color:var(--fg)}
.tip .uq{color:#f0c96a;font-weight:700} .tip .lore{display:block;color:#cfc6b8;font-style:italic;margin:2px 0 3px}
.grid6{display:grid;""")
# tooltip: unique block + trait desc
rep("""    ${traits.length ? traits.map(t => `<span class="tr"><i>[${esc(t === '높은후각' ? t + ' ' + (u.smellG || 'A') : t === '야시' ? t + ' ' + (u.nvG || 'B') : t)}]</i> ${esc(TRAITS[t] || '')}</span>`).join('') : '<span class="tr lb">특성 없음</span>'}""",
"""    ${(p.unique || []).map(name => { const d = UNIQUE[name]; return d ? `<span class="tr"><span class="uq">◆[${esc(name)}]</span> 고유특성<span class="lore">${esc(d.lore[d.lore.length - 1])}</span>${esc(d.effects.join(' · '))}</span>` : ''; }).join('')}
    ${traits.length ? traits.map(t => { const dv = (p.unique || []).some(nm => UNIQUE[nm] && (UNIQUE[nm].derived.includes(t) || UNIQUE[nm].limits.includes(t))); return `<span class="tr"><i>[${esc(t === '높은후각' ? t + ' ' + (u.smellG || 'A') : t === '야시' ? t + ' ' + (u.nvG || 'B') : t)}]</i>${dv ? ' <span class="lb">(◆ 파생)</span>' : ''} ${esc(traitDesc(t))}</span>`; }).join('') : '<span class="tr lb">특성 없음</span>'}""")
# log header: unique
rep("""${u.skill ? ' · [' + u.skill.name + ' ' + u.skill.pool + ', 한 번에 ' + u.skill.per + ']' : ''}${(u.traits || []).map(t => ' · [' + t + ']').join('')}`).join('\\n');""","""${u.skill ? ' · [' + u.skill.name + ' ' + u.skill.pool + ', 한 번에 ' + u.skill.per + ']' : ''}${(((S.units.find(x => x.id === u.pid) || {}).unique) || []).map(t => ' · ◆[' + t + ']').join('')}${(u.traits || []).map(t => ' · [' + t + ']').join('')}`).join('\\n');""")
rep("""        if (e.ambush) tags.push(`암살 (알아차리지 못함) ×${R.ambushMul} · 비명`);""","""        if (e.blade) tags.push('날붙이 판정');
        if (e.ambush) tags.push(`암살 (알아차리지 못함) ×${R.ambushMul} · 비명`);""")
# weapons table: kind column; grades table
rep("""<th>탄속</th><th>총성</th><th>방어</th><th class="l">명단</th></tr></thead>""","""<th>탄속</th><th>총성</th><th>방어</th><th class="l">종류</th><th class="l">명단</th></tr></thead>""")
rep("""<td>${far ? '' : ck(`weapons.${w}.guard`, W.guard)}</td><td class="l">${ROSTER.filter(r => r[11] === w).length}명</td></tr>`;""","""<td>${far ? '' : ck(`weapons.${w}.guard`, W.guard)}</td><td class="l">${esc(W.kind || '')}</td><td class="l">${ROSTER.filter(r => r[11] === w).length}명</td></tr>`;""")
rep("""        <div class="box"><p class="lab">맞은 부위""","""        <div class="box"><p class="lab">등급 특성 ([속력X] 이동 속력 × · [괴력X] 공격 × , 막힐 때 상대 자세도 ×)</p><div class="tw"><table class="tbl" id="gradeTbl"></table></div></div>
        <div class="box"><p class="lab">맞은 부위""")
rep("""  $('partTbl').innerHTML =""","""  $('gradeTbl').innerHTML = '<thead><tr><th class="l">특성</th><th>S</th><th>A</th><th>B</th><th>C</th></tr></thead><tbody>' + GRADE_KEYS.map(k => `<tr><td class="l">${k}</td>${['S', 'A', 'B', 'C'].map(g => `<td>${n(`grades.${k}.${g}`, rules.grades[k][g], 0.05)}</td>`).join('')}</tr>`).join('') + '</tbody>';
  $('partTbl').innerHTML =""")
open('page10.tpl.html','w').write(s)
print('ok')
