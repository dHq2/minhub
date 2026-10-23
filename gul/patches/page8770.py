# v8.7.7 페이지 — page8770.py v1.0 (v1.0: 유물 34 · 지닌 이 (둘째 쪽 page8770b) · 노먼 전직 (H — 닥터 노먼 · 선봉장 노먼 · 동료 정리 ⭐) · 이름 · 등급 (G — 로켈 · 탕아 3성 · 옮김) ·
#   야전병원 간호사장: 천막마다 한 번 (치료 · 바이올린 · 이야기 — 예전엔 끝없이 눌러 약이 쌓이고 인연이 올랐음) · 의학 등급이 실제로 오름 (의학 C → B …) · 가윤 (1성 간호사) 도 간호사로 셈 (예전엔 이름이 달라 모자 · 의료 기술을 못 받았음) ·
#   만남 '야전 천막' 도 같은 인연 · 같은 의료 기술 (예전엔 노먼만 한 번 약 +2) · 약은 가득으로)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8760.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.7.6 (2026-10-23)', '<!-- 굴의 전투판 v8.7.7 (2026-10-23)')
rep('     v8.7.6: ', '''     v8.7.7: 유물 34 — 새 유물 16 (랑팡의 나침반 · 탄탄만의 숫돌 · 노라의 탄띠 · 아이텐의 토끼발 · 셰도르의 단검집 · 호레이쇼의 군기 · 페흐토의 청염 조각 · 세르파의 젤리 · 인공천사 벨의 깃털 ·
         마리의 약초 주머니 · 로지나의 리본 · 테헤라의 모래시계 · 각혈의 핏방울 · 망각의 데이터 조각 · 붉은암석의 핵 · 도굴꾼의 열쇠) · 지닌 이 (끼운 인물만 — 왐의 머리촛대 · 간호사장의 모자 (간호사 전용) ·
         가뮤의 대검 (중대형 이상) · 로켈의 갑옷 · 모란의 가면 · 비늘조각 · 오딜의 눈물 · 청염 조각 — 지도의 유물 칸을 눌러 고름) · 뽑기 풀 24 (가뮤의 대검 · 비늘조각 · 모자 · 바이올린 · 오딜의 눈물은 얻는 길만).
         효과가 걸리지 않던 것 고침 ([가호:오딜] · 로켈의 갑옷 · 왕관 조각 · 눈물의 횃불 · 비늘조각) · 촛대로 일어나면 중상이 나음 · 삼신의 심판은 판마다 그 신의 유물 (눈물은 마지막 판에만) · 3층을 자주 오가면 비늘조각.
         노먼 전직 (야전병원 간호사장에게 의료 기술을 배운 뒤 — 동료 정리 ⭐): 닥터 노먼 (의학 A · 응급처치 강화) · 선봉장 노먼 (대방패 + 소총 — 쏘는 동안에도 방패를 듦 · 방호 160).
         간호사장 이야기는 천막마다 한 번 · 의학 등급이 실제로 오름 · 가윤도 간호사로 셈. 이름 · 등급: 로켈 (삼신 · 갑옷) · 탕아 3성 · 인공천사 벨 · 가뮤
     v8.7.6: ''')
for a, b in (('h1::after{content:" v8.7.6"', 'h1::after{content:" v8.7.7"'), ('<footer>굴의 전투판 v8.7.6', '<footer>굴의 전투판 v8.7.7'), ('return `굴의 전투판 v8.7.6 · ${title}', 'return `굴의 전투판 v8.7.7 · ${title}'),
             ("copyText('굴의 전투판 v8.7.6 자동 판 기록", "copyText('굴의 전투판 v8.7.7 자동 판 기록"), ("o.push(`굴의 전투판 v8.7.6 — ${C.run", "o.push(`굴의 전투판 v8.7.7 — ${C.run"),
             ('의 버전 기록에 — v8.7.6 인벤토리 v2 (장비 탭 · 이름표 · 전리품 비교)', '의 버전 기록에 — v8.7.7 유물 34 · 노먼 전직 / v8.7.6 인벤토리 v2 (장비 탭 · 이름표 · 전리품 비교)'),
             ('">v8.7.6 · 인벤토리 v2 (장비 탭 · 이름표 · 전리품 비교)</span>', '">v8.7.7 · 유물 34 · 노먼 전직</span>'),
             ("ver: '8.7.6', kind:", "ver: '8.7.7', kind:")):
    rep(a, b)
rep("const OLD_DEFAULTS = /*OLDDEF*/, RULES_MIG = '8.7.6',", "const OLD_DEFAULTS = /*OLDDEF*/, RULES_MIG = '8.7.7',")   # 수치표: pen.pavise (대방패 방호) 새 칸

# ---------- G 이름 · 등급 ----------
rep("['마신족 병사', 3, '모켈']", "['마신족 병사', 3, '로켈']")   # 삼신 — 갑옷의 주인은 로켈 (민수 명세 G · 열쇠 mokel 은 저장과 맞추려 그대로)
rep('뿔 달린 모켈.', '뿔 달린 로켈.')
rep('라비스 · 모켈 · 모란이 고른', '라비스 · 로켈 · 모란이 고른')
rep("{ key: '탕아', side: 0, ref: 'C-221', name: '탕아', tier: 2,", "{ key: '탕아', side: 0, ref: 'C-221', name: '탕아', tier: 3,")   # 탕아 3성 (도감 희귀도 3 · 예전 설계 2)
rep("S.v620k = true; }\n",
    "S.v620k = true; }\n"
    "if (!S.v877t){ const fx = u => { if (u && u.ref === 'C-221' && +u.tier === 2){ u.tier = 3; return true; } return false; };   /* v8.7.7 탕아 3성 — 저장된 판 · 내 설계 · 내 층 · 여정 동료도 한 번 */\n"
    "  for (const u of S.units || []) fx(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fx(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}\n"
    "  try { const Fl = myFloors(); let fc = false; for (const f of Fl) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fx(u)) fc = true; if (fc) saveMyFloors(Fl); } catch (e) {}\n"
    "  try { const C = S.camp; if (C){ for (const p of (C.run && C.run.party) || []) fx(p); for (const p of C.lostP || []) fx(p); } } catch (e) {} S.v877t = true; }\n")

# ---------- H 노먼 전직 ----------
JOB_JS = r'''// v8.7.7 전직 (H) — 지금은 노먼만 (다른 동료는 JOB8 에 더하면 됨 · 도감: "닥터" 노먼 · "선봉" 노먼). 조건: 야전병원 간호사장에게서 의료 기술을 배운 뒤 (R.flags.normanMed)
const JOB8 = { 'C-007': { needTxt: '야전병원 간호사장에게서 의료 기술을 배운 뒤 (천막의 간호사장 이야기 · 인연 2부터)', need: R => !!(R.flags || {}).normanMed, jobs: {
  doc: { name: '닥터 노먼', img: 'talk/norman_doc', d: '의무 — 의학 A (이미 A 이상이면 그대로) · 응급처치 강화: 약 +3 · 처음 30% (15 ~ 60) · 돌봄 6 × 5 · 대기 1.6초 · 소총은 그대로', line: '총은 그대로 들게. 대신 — 이제 아무도 내 앞에서 죽게 두지 않아.',
    apply: p => { const cur = (p.traits || []).find(t => /^의학[SABCDE]$/.test(t)), g = cur ? cur.slice(-1) : 'E'; if (!['S', 'A'].includes(g)) p.traits = [...(p.traits || []).filter(t => t !== cur), '의학A'];
      const k = p.skill || {}; p.skill = { ...k, name: k.name || '응급처치', kit: true, pool: (+k.pool || 7) + 3, pct: Math.max(+k.pct || 0.2, 0.3), min: Math.max(+k.min || 10, 15), cap: Math.max(+k.cap || 30, 60), hot: Math.max(+k.hot || 4, 6), hotN: Math.max(+k.hotN || 5, 5), hotGap: +k.hotGap || 0.4, cd: Math.min(+k.cd || 2.2, 1.6), auto: Math.max(+k.auto || 0.5, 0.5) };
      if (p.skLeft != null) p.skLeft = +p.skLeft + 3; p.tactic = '닥터 — 응급처치 (의무) · 소총'; } },
  van: { name: '선봉장 노먼', img: 'talk/norman_van', d: '선봉 — 대방패 + 소총: 쏘는 동안에도 방패를 듦 (방호 160 — 화살 · 총알을 막음) · 전열에 섬 · 방패만큼 걸음이 느림', line: '앞은 내가 선다. 다들 — 내 방패 뒤로.',
    apply: p => { p.shield = true; p.sName = '대방패'; p.sDur = 100; delete p.sOwn; p.traits = [...new Set([...(p.traits || []), '대방패'])]; p.role = '전선'; p.tactic = '선봉장 — 대방패 뒤에서 소총'; } } } } };
const jobOf8 = p => p && p.job && JOB8[p.ref] ? JOB8[p.ref].jobs[p.job] || null : null;
const jobNm8 = p => { const j = jobOf8(p); return j ? j.name : (p && p.name) || ''; };
const jobCan8 = p => !!(p && JOB8[p.ref] && !p.job && JOB8[p.ref].need(R8S() || {}));
function r8JobPanel(i){
  const R = R8S(), p = R && R.party[i], J = p && JOB8[p.ref]; if (!J || p.job) return;
  const el = r8Panel(`<h2>⭐ 전직 — ${esc(p.name)}</h2><div class="r8sub">${esc(J.needTxt)} · 한 번 고르면 되돌릴 수 없어요.</div><div class="r8pan" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">${Object.entries(J.jobs).map(([k, j]) => `<div class="r8card" style="width:230px;min-height:auto"><span class="r8jimg" style="background-image:url(art/${j.img}.webp)"></span><b>${esc(j.name)}</b><small>${esc(j.d)}</small><button class="btn go" type="button" data-r8job="${k}" style="margin-top:6px;min-height:40px">이 길로</button></div>`).join('')}<div class="row" style="width:100%;justify-content:center"><button class="btn" type="button" id="r8jX">나중에</button></div></div>`);
  el.querySelectorAll('[data-r8job]').forEach(b => b.onclick = () => { const k = b.dataset.r8job, j = J.jobs[k]; askYes(`${p.name} — ${j.name} (으)로 전직할까요? (되돌릴 수 없음)`, '전직한다').then(y => { if (!y) return;
    j.apply(p); p.job = k; (R.log = R.log || []).push({ f: R.f, k: 'job', who: p.name, job: j.name, t: Date.now() }); save(); r8Hide(); R8T = () => r8PartyPanel();
    talkLines([{ t: j.line, name: j.name, img: j.img }, { box: `⭐ ${j.name} — ${j.d}` }, { go: '!r8:then' }]); }); });
  $('r8jX').onclick = () => r8PartyPanel();
}
'''
rep("function r8PartyPanel(){\n", JOB_JS + "function r8PartyPanel(){\n")
rep("<b>${esc(p.name)}</b> ${RAR_STAR(p)} <small>${hp}/${mx}",
    "<b>${esc(jobNm8(p))}</b> ${RAR_STAR(p)}${r8HeldIc(p)} <small>${hp}/${mx}${JOB8[p.ref] && !p.job && !jobCan8(p) ? ' · ⭐ 전직 — ' + esc(JOB8[p.ref].needTxt) : ''}")
rep("</small></div>${p.hero ? '' : `<button class=\"btn sm warn\" type=\"button\" data-r8kick=\"${i}\">떠나보냄</button>`}</div>`; }).join('')}",
    "</small></div>${jobCan8(p) ? `<button class=\"btn sm go\" type=\"button\" data-r8job0=\"${i}\">⭐ 전직</button>` : ''}${p.hero ? '' : `<button class=\"btn sm warn\" type=\"button\" data-r8kick=\"${i}\">떠나보냄</button>`}</div>`; }).join('')}")
rep("  $('r8pX').onclick = () => r8MapShow();\n}",
    "  el.querySelectorAll('[data-r8job0]').forEach(b => b.onclick = () => r8JobPanel(+b.dataset.r8job0));   /* v8.7.7 전직 */\n  $('r8pX').onclick = () => r8MapShow();\n}")

# ---------- 야전병원 간호사장 (천막 · 만남) ----------
MED_JS = r'''// v8.7.7 간호사장에게서 의료 기술을 배움 — 의학 한 등급 (S 까지) · 약 +2 · 치유량 ↑ · 노먼은 전직 조건 / 천막의 치료 · 바이올린 · 이야기는 천막마다 한 번
const MED_UP8 = { E: 'D', D: 'C', C: 'B', B: 'A', A: 'S' };
function r8MedUp(L){
  const R = R8S(), out = [];
  for (const p of L){ if (p.ref === 'C-007') R.flags.normanMed = 1; const cur = (p.traits || []).find(t => /^의학[SABCDE]$/.test(t)), g = cur ? cur.slice(-1) : null, nx = g ? MED_UP8[g] : 'D'; if (!nx) continue;
    p.traits = [...(p.traits || []).filter(t => t !== cur), '의학' + nx];
    if (p.skill && +p.skill.pool > 0){ p.skill.pool = +p.skill.pool + 2; p.skill.pct = Math.min(0.4, (+p.skill.pct || 0.12) + 0.03); }
    p.medUp = (p.medUp || 0) + 1; out.push(`${p.name} 의학 ${g || '없음'} → ${nx}`); }
  return out;
}
const r8TentUsed = k => { const C = S.camp, E = C && C.stages && C.stages[1] && C.stages[1].enc; if (!E || E.r8 !== 'tent') return false; E.used = E.used || []; if (E.used.includes(k)) return true; E.used.push(k); return false; };
'''
rep("const r8Who = () => { const R = R8S(); return r8Pick(R.party.filter(p => !p.hero).concat(R.party)); };\n",
    "const r8Who = () => { const R = R8S(); return r8Pick(R.party.filter(p => !p.hero).concat(R.party)); };\n" + MED_JS)
rep("  mnTentHeal(){ r8HealAll(0.5); const R = R8S();",
    "  mnTentHeal(){ if (r8TentUsed('heal')) return r8Say([{ t: '방금 꿰맸잖아요. 다음 천막에서 봐요.', name: '간호사장', img: IMG8.lumi }], () => campBarRender(true)); r8HealAll(0.5); const R = R8S();")
rep("  mnTentRest(){ r8HealAll(0.2); const R = R8S();",
    "  mnTentRest(){ if (r8TentUsed('rest')) return r8Say([{ t: '바이올린은 한 번이면 충분해요. 또 와요.', name: '간호사장', img: IMG8.lumi }], () => campBarRender(true)); r8HealAll(0.2); const R = R8S();")
rep("    if (R.flags.lumi >= 5 && !R.relics.includes('violin')){ R.relics.push('violin');", "    if (R.flags.lumi >= 5 && r8AddRelic('violin')){")
rep("  mnTentTalk(){ const R = R8S(); R.flags.lumi = (R.flags.lumi || 0) + 1;",
    "  mnTentTalk(){ const R = R8S(); if (r8TentUsed('talk')) return r8Say([{ t: '오늘 이야기는 여기까지. 다친 사람이 기다려요.', name: '간호사장', img: IMG8.lumi }], () => campBarRender(true)); R.flags.lumi = (R.flags.lumi || 0) + 1;")
rep("    const nu = R.party.filter(p => /간호사|노먼/.test(p.name)); if (R.flags.lumi >= 2 && nu.length){ for (const p of nu){ if (p.skill){ p.skill.pool = (p.skill.pool || 0) + 2; p.skill.pct = Math.min(0.4, (p.skill.pct || 0.12) + 0.03); } p.medUp = (p.medUp || 0) + 1; if (/노먼/.test(p.name)) R.flags.normanMed = 1; } L.push({ narr: `간호사장이 ${nu.map(p => p.name).join(' · ')} 에게 손놀림을 가르친다.` }, { box: '의료 기술 등급 업 (약 +2 · 치유량 ↑)' + (R.flags.normanMed ? ' · 노먼 — 전직 조건을 채움' : '') }); }",
    "    const nu = R.party.filter(p => isNurse8(p) || p.ref === 'C-007'); if (R.flags.lumi >= 2 && nu.length){ const was = !!R.flags.normanMed, up = r8MedUp(nu); if (up.length) L.push({ narr: `간호사장이 ${nu.map(p => p.name).join(' · ')} 에게 손놀림을 가르친다.` }, { box: '의료 기술 등급 업 — ' + up.join(' · ') + ' (약 +2 · 치유량 ↑)' }); if (!was && R.flags.normanMed) L.push({ box: '⭐ 노먼 — 전직할 수 있음 (동료 정리 → ⭐ 전직: 닥터 노먼 · 선봉장 노먼)' }); }")
rep("    if (R.flags.lumi >= 3 && R.party.some(p => /간호사/.test(p.name)) && !R.relics.includes('nurse')){ R.relics.push('nurse'); L.push({ box: '⛑ 간호사장의 모자 — 간호사에게 (치유하는 동료의 약이 두 번 더)' }); }",
    "    if (R.flags.lumi >= 3 && R.party.some(isNurse8) && r8AddRelic('nurse')) L.push({ box: '⛑ 간호사장의 모자 — 간호사 전용 (지닌 간호사의 약 +3 · 치유량 +30%)' });")
rep("  if (a === 'nurseHeal'){ for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow != null ? p.hpNow : mx) + Math.round(mx * 0.6)); if (p.skill && p.skill.pool){ p.skLeft = p.skill.pool; } } const nu = R.party.find(p => /간호사|가윤|노먼/.test(p.name)); if (nu && !R.flags.nurseUp){ R.flags.nurseUp = 1; if (nu.skill) nu.skill.pool = (nu.skill.pool || 0) + 2; } say([{ narr: '간호사장이 바이올린을 켠다. 잠깐 굴을 잊는다.' }, { box: '모두 회복' + (nu ? ` · ${nu.name} 의 약 +2` : '') }]); save(); return; }",
    "  if (a === 'nurseHeal'){ for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow != null ? p.hpNow : mx) + Math.round(mx * 0.6)); if (p.skill && p.skill.pool) delete p.skLeft; }   /* v8.7.7 약은 가득 (지닌 유물의 몫까지 — 싸울 때 셈) */\n"
    "    R.flags.lumi = (R.flags.lumi || 0) + 1; const was = !!R.flags.normanMed, up = R.flags.lumi >= 2 ? r8MedUp(R.party.filter(p => isNurse8(p) || p.ref === 'C-007')) : [];   /* v8.7.7 천막과 같은 인연 · 같은 의료 기술 (예전엔 노먼 · 간호사 하나만 한 번 약 +2) */\n"
    "    say([{ narr: '간호사장이 바이올린을 켠다. 잠깐 굴을 잊는다.' }, { box: '모두 회복 · 약 가득' + (up.length ? ' · 의료 기술 등급 업 — ' + up.join(' · ') : '') }, ...(!was && R.flags.normanMed ? [{ box: '⭐ 노먼 — 전직할 수 있음 (동료 정리 → ⭐ 전직)' }] : [])]); save(); return; }")

exec(open(D + 'page8770b.py', encoding='utf-8').read())   # 유물 34 · 지닌 이 (둘째 쪽)

open(F, 'w', encoding='utf-8').write(s)
print('page8770 OK')
