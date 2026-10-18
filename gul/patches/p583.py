import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.8.2 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.8.3 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.8.3: 정체성 누락 전수 점검 — 인물을 만드는 모든 길 (도감 · 설계 · 동료 뽑기 · 옛 저장) 이 같은 정체성을 갖게.
             · 카리우스를 도감 · 뽑기로 놓으면 체력 144 (설계는 450) — 주석이 기본 수치 덮어쓰기 (ov) 를 삼키던 버그 (v5.4.1 부터) 고침.
             · 기본 설계가 있는 인물은 도감에서 뽑아도 설계와 같게: 궁수 [도약] · 사수 · 탄 40, 곤봉적 [거구] · [지휘B] · 키 2.5, 기사들의 키 · 갑옷.
             · 정체성 고정 (뺄 수 없음, 옛 저장도 되돌림): 레베카 [불사] · [재생] · 카리우스 ◆개조된 신체 ([거구] · [갑피] · [괴력A] · [머리 넷]) · 액티브 [돌진] ·
               인주 [일반인] · 노먼 [응급처치] · 포렌 [높은후각] · [반사신경] · 옐로 ◆저주:맥아 · [양동이 약]. 장비 · 체력 · 등급처럼 고친 것은 그대로 둠.
""",'notes')
rep('<span class="ver">v5.8.2 · 탭하면 기술 고리','<span class="ver">v5.8.3 · 정체성 전수 고정 · 탭하면 기술 고리','ver')
rep("<footer>굴의 전투판 v5.8.2","<footer>굴의 전투판 v5.8.3",'footer')
rep("return `굴의 전투판 v5.8.2 · ${title}","return `굴의 전투판 v5.8.3 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.8.2\";","body.mob .top h1::after{content:\" v5.8.3\";",'mobver')
# 1) applyProfile ov swallowed + ammo
rep("u.nv = true; u.nvG = pf.allyNv; }   // v5.4.1 if (pf.ov) u.ov = { ...pf.ov, ...(u.ov || {}) };   // v5.2",
    "u.nv = true; u.nvG = pf.allyNv; }   // v5.4.1\n  if (pf.ov) u.ov = { ...pf.ov, ...(u.ov || {}) };   // v5.2 (v5.8.3: 주석에 삼켜져 있던 것을 되살림)\n  if (pf.ammo != null && u.ammo == null) u.ammo = pf.ammo;",'ov')
# 2) PROFILE <- DESIGN_DEFAULTS merge, right after DESIGN_DEFAULTS
i=s.index("const DESIGN_DEFAULTS = [")
j=s.index("\n];\n", i)+4
s=s[:j]+"""// v5.8.3 도감에서 뽑아도 설계 칸과 같게 (기본 설계가 있는 모든 인물): 몸 · 역할 · 무기 · 탄 · 장비 · 기본 수치 · 특성 · 고유 · 액티브 · 기술 — 도감 쪽 프로필에 이미 있으면 그쪽이 먼저
for (const d of DESIGN_DEFAULTS){ if (!d.ref) continue; const pf = PROFILE[d.ref] = PROFILE[d.ref] || {};
  for (const k of ['role', 'weapon', 'height', 'weight', 'sm', 'ammo', 'bold', 'cry']) if (pf[k] === undefined && d[k] !== undefined) pf[k] = clone(d[k]);
  if (d.shield === false && pf.shield === undefined) pf.shield = false;
  if (d.gear && !pf.gear) pf.gear = clone(d.gear); if (d.ov) pf.ov = { ...clone(d.ov), ...(pf.ov || {}) }; if (d.skill && !pf.skill) pf.skill = clone(d.skill);
  for (const k of ['traits', 'unique', 'active']) if (d[k] && d[k].length) pf[k] = [...new Set([...(pf[k] || []), ...d[k]])];
  if (pf.tactic === undefined && d.tactic){ pf.tactic = d.tactic; pf.note = d.note; } }
"""+s[j:]
# 3) identity generalized
rep("""function identityOf(ref){ return ref === 'C-002' ? ['불사', '재생'] : null; }   // 함수라 어디서든 (저장을 읽기 전에도) 부를 수 있음
function lockIdentity(p){ const need = p && identityOf(p.ref); if (!need) return false; const tr = p.traits || [], miss = need.filter(t => !tr.includes(t)); if (!miss.length) return false; p.traits = [...tr, ...miss]; return true; }""",
"""// 정체성: 그 인물이 그 인물인 까닭 (특성 · ◆고유 · 액티브 · 기술). 장비 · 체력 · 등급 · 무기처럼 바꿀 수 있는 것은 넣지 않음
function identityOf(ref){ return ({ 'C-001': { traits: ['일반인'] }, 'C-002': { traits: ['불사', '재생'] }, 'C-003': { unique: ['개조된 신체'], active: ['돌진'] },
  'C-006': { traits: ['높은후각', '반사신경'] }, 'C-007': { skill: true }, 'C-008': { unique: ['저주:맥아'], skill: true } })[ref] || null; }   // 함수라 어디서든 (저장을 읽기 전에도) 부를 수 있음
function idTraits(ref){ const I = identityOf(ref); return I ? [...(I.traits || []), ...(I.unique || []).flatMap(n => UNIQUE[n] ? [...UNIQUE[n].derived, ...UNIQUE[n].limits] : [])] : []; }
function lockIdentity(p){ const I = p && identityOf(p.ref); if (!I) return false; let ch = false;
  const add = (k, list) => { const cur = p[k] || [], miss = (list || []).filter(x => !cur.includes(x)); if (miss.length){ p[k] = [...cur, ...miss]; ch = true; } };
  add('traits', I.traits); add('unique', I.unique); add('active', I.active);
  if (I.unique){ const n0 = (p.traits || []).length; applyUnique(p); if ((p.traits || []).length !== n0) ch = true; }
  if (I.skill && !p.skill && PROFILE[p.ref] && PROFILE[p.ref].skill){ p.skill = clone(PROFILE[p.ref].skill); ch = true; }
  return ch; }""",'ident')
# load-time: report names
rep("""{ let ch = false; for (const u of S.units){ if (fixOldRebecca(u)) ch = true; if (lockIdentity(u)) ch = true; }
  try { const mine = myDesigns(); let dc = false; for (const d of mine){ if (lockIdentity(d)) dc = true; } if (dc) saveMyDesigns(mine); } catch (e) {}
  if (ch) setTimeout(() => { save(); toast('레베카에게 정체성 [불사] · [재생] 을 되돌렸어요 (옛 판에 빠져 있었음)'); }, 600); }""",
"""{ const fixed = new Set(); for (const u of S.units){ if (fixOldRebecca(u)) fixed.add(u.name); if (lockIdentity(u)) fixed.add(u.name); }
  try { const mine = myDesigns(); let dc = false; for (const d of mine){ if (lockIdentity(d)) dc = true; } if (dc) saveMyDesigns(mine); } catch (e) {}
  if (fixed.size) setTimeout(() => { save(); toast(`정체성을 되돌렸어요: ${[...fixed].join(' · ')} (옛 판에 빠져 있었음)`); }, 600); }""",'load')
# editor: traits locked via idTraits, actives locked
s=s.replace("(identityOf(p.ref) || []).includes(t)","idTraits(p.ref).includes(t)")
assert "(identityOf(p.ref) || [])" not in s
rep("""data-active="${a}" ${(p.active || []).includes(a) ? 'checked' : ''}> 액티브 [${a}]</label>`""",
    """data-active="${a}" ${(p.active || []).includes(a) ? 'checked' : ''} ${((identityOf(p.ref) || {}).active || []).includes(a) ? 'disabled' : ''}> 액티브 [${a}]${((identityOf(p.ref) || {}).active || []).includes(a) ? ' <small>(정체성)</small>' : ''}</label>`""",'actui')
rep("  if (e.target.dataset.active){ const a = e.target.dataset.active;","  if (e.target.dataset.active){ const a = e.target.dataset.active; if (((identityOf(p.ref) || {}).active || []).includes(a) && !e.target.checked){ e.target.checked = true; toast(`[${a}] 은 ${p.name}의 정체성이라 뺄 수 없어요`); return; }",'acth')
open(P,'w').write(s); print('ok')
