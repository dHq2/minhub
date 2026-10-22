# v8.7.2 페이지 — page8720.py v1.1 (v1.1: 지휘 재능은 둘 이상일 때만 (1대1 링의 특수능력 봉인을 깨던 것) · v1.0: 바로잡기 — page8710.py 를 먼저 돌린 뒤: 지휘관이 없으면 동료 하나가 지휘의 재능을 발견 ([지휘C] — 무작위 · 다음 판에도) · 훈련장에서도 2층 · 각혈은 캠페인에 한 번 낮은 확률로 정해지고 (1S · 2S 가운데 하나 · 언제 올지 모름) 맵을 다시 시작해도 적으로 남지 않음 · 처음 동료 뽑기 셋 · 가윤 지혈 최소 50 (큰 몸은 비율) · 모닝스타 · 가윤 돌격 안 함 · 트라카 빠른 연사 · 근력은 없던 것이 새로 생기지 않음 (공격 +2) · 돌진 준비 중엔 공격 단추로 표적을 바꿈 · 가까이 가면 상호작용 단추 (관을 연다 · 말 걸기) 가 화면 아래에 · 출구 명령 · 회피 로그 고침)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8710.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v8.7.1 (2026-10-19)', '<!-- 굴의 전투판 v8.7.2 (2026-10-21)')
rep('     v8.7.1: ', '''     v8.7.2: 바로잡기 — 지휘관이 없으면 동료 하나가 지휘의 재능을 발견 ([지휘C] · 무작위 · 이어짐) · 지휘관 없는 판도 임시 지휘 · 훈련장에서도 2층 · 각혈은 캠페인에 한 번 낮은 확률 (언제 올지 모름 · 다시 시작해도 남지 않음) · 처음 동료 뽑기 셋 · 가윤 지혈 최소 50 · 큰 몸은 비율 · 가윤 · 모닝스타 · 치유는 돌격 안 함 (지휘관 명령은 따름) · 더 가까운 적을 지나쳐 돌격하지 않음 · 돌진 준비 중 공격 단추로 표적 바꿈 · 돌진 · 공중제비 살짝 유도 · 리치 = 몸 + 무기 · 움직이는 중에도 후각 · 세자르 원형 베기는 빠르고 약한 견제 · 트라카 빠른 연사 · 근력은 새로 생기지 않음 · 상호작용 단추가 화면 아래에 · 출구 명령 · 회피 로그 고침
     v8.7.1: ''')
for a, b in (('h1::after{content:" v8.7.1"', 'h1::after{content:" v8.7.2"'), ('<footer>굴의 전투판 v8.7.1', '<footer>굴의 전투판 v8.7.2'), ('return `굴의 전투판 v8.7.1 · ${title}', 'return `굴의 전투판 v8.7.2 · ${title}'),
             ("copyText('굴의 전투판 v8.7.1 자동 판 기록", "copyText('굴의 전투판 v8.7.2 자동 판 기록"), ("ver: '8.7.1', kind: '1F 여정 기록'", "ver: '8.7.2', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.7.1 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.7.2 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.7.1 인카운터', '의 버전 기록에 — v8.7.2 바로잡기 / v8.7.1 인카운터'),
             ('">v8.7.1 · 인카운터 · 맵 위 NPC · 맵 장치</span>', '">v8.7.2 · 바로잡기 (지휘 · 각혈 · 돌격 · 리치)</span>'),
             ("RULES_MIG = '8.7.1'", "RULES_MIG = '8.7.2'")):
    rep(a, b)
# P1 훈련장 (인카운터 시험) 에서도 2층으로
rep("${kind === 'clear' && !C.run && !C.test ? '<button class=\"btn go\" type=\"button\" id=\"campRun8\"", "${kind === 'clear' && !C.run ? '<button class=\"btn go\" type=\"button\" id=\"campRun8\"")
rep("<button class=\"btn${kind === 'clear' && !C.run && !C.test ? '' : ' go'}\" type=\"button\" id=\"campDone\">", "<button class=\"btn${kind === 'clear' && !C.run ? '' : ' go'}\" type=\"button\" id=\"campDone\">")
# P2 각혈: 캠페인을 시작할 때 한 번 (낮은 확률) — 오면 1S · 2S 가운데 하나, 들어서고 6 ~ 46초 사이 (그 전에 떠나면 못 봄)
rep("const KH_P = 0.07;", "const KH_P = 0.08;   /* v8.7.2 캠페인에 한 번 정함 */")
rep("  if ((s === 1 || s === 2) && !st.seen && !C.kh && (C.khForce || Math.random() < KH_P)){ C.kh = s; st.khT = 6 + Math.random() * 8; delete C.khForce; }",
    "  if (C.khWill == null) C.khWill = Math.random() < KH_P ? (Math.random() < 0.5 ? 1 : 2) : 0;   /* v8.7.2 올지 말지 먼저 · 오면 어느 맵 */\n"
    "  if ((s === 1 || s === 2) && !st.seen && !C.kh && (C.khForce || C.khWill === s)){ C.kh = s; st.khT = C.khForce ? 6 + Math.random() * 8 : 6 + Math.random() * 40; delete C.khForce; }")
rep("`${Math.round(KH_P * 100)}% (캠페인에 한 번)`", "`${Math.round(KH_P * 100)}% (캠페인에 한 번 — 둘 가운데 한 맵 · 언제 올지 모름)`")
rep("1S · 2S 에 처음 들어설 때 ${Math.round(KH_P * 100)}% (캠페인에 한 번)", "캠페인에 한 번 ${Math.round(KH_P * 100)}% — 오면 1S · 2S 가운데 한 맵, 들어서고 6 ~ 46초 사이 (그 전에 떠나면 못 봄)")
# 판 도중에 나타난 각혈은 맵을 다시 시작하면 빠짐 (그 맵의 운명은 다시 — 같은 때에 다시 옴)
rep("  lockIdentity(p); S.units.push(p); const u = addUnit(Wd, p);\n  let a = null, d0 = 99;", "  p.midSpawn = 'kh'; lockIdentity(p); S.units.push(p); const u = addUnit(Wd, p);   /* v8.7.2 */\n  let a = null, d0 = 99;")
rep("  S.units = S.units.filter(p => !p.summon);   /* v8.4.0 지난 판의 소환 (슬라임) 은 남지 않음 */",
    "  S.units = S.units.filter(p => !p.summon);   /* v8.4.0 지난 판의 소환 (슬라임) 은 남지 않음 */\n"
    "  if (S.units.some(p => p.midSpawn === 'kh')){ S.units = S.units.filter(p => p.midSpawn !== 'kh'); const st = S.camp && (S.camp.stages || {})[S.camp.s]; if (st && st.khT != null) st.khDone = false; }   /* v8.7.2 다시 시작한 맵에 각혈이 적으로 남던 것 */\n"
    "  const cmdNew = cmdFind();   /* v8.7.2 지휘의 재능 */")
rep("  if (nOp) toast(`시작 행동 ${nOp}명을 다시 걸었어요",
    "  if (cmdNew){ logEv(world, { k: 'r8', s: `📣 ${cmdNew} — 지휘관이 없다. 누군가는 외쳐야 한다. ${cmdNew}의 목소리에 모두가 돌아본다 — 지휘의 재능을 발견 [지휘C]`, c: 'good', vis: true }); setTimeout(() => toast(`📣 ${cmdNew}, 지휘의 재능을 발견 — [지휘C] (이제 명령이 그를 거쳐 닿아요)`), 600); }\n"
    "  if (nOp) toast(`시작 행동 ${nOp}명을 다시 걸었어요")
rep("// v5.8.8 유저 지휘: 멈춤 · 재생 · 한 턴",
    "// v8.7.2 캠페인 · 여정에서 우리 편에 지휘할 이가 없으면 (인주가 쓰러짐 …) 남은 동료 가운데 무작위 하나가 지휘의 재능을 발견 — [지휘C] 를 얻고 다음 판에도 지님\n"
    "function cmdFind(){ const C = S.camp; if (!C || C.end) return null; const A = S.units.filter(p => p.side === 0 && !p.summon && !p.gone && !(p.hpNow != null && +p.hpNow <= 0));\n"
    "  if (A.length < 2 || (typeof duel8On === 'function' && duel8On()) || A.some(p => (p.traits || []).some(t => /^지휘[SABCDE]$/.test(t)))) return null;   /* 혼자 (1대1 링 · 혼자 남음) 는 지휘할 이가 없음 */\n"
    "  const p = A[Math.floor(Math.random() * A.length)]; p.traits = [...(p.traits || []), '지휘C']; p.cmdFound = 1;\n"
    "  if (typeof R8S === 'function' && C.run){ try { const R = R8S(), q = R && (R.party || []).find(x => x.id === p.id || x.name === p.name); if (q && q !== p){ q.traits = [...new Set([...(q.traits || []), '지휘C'])]; q.cmdFound = 1; } } catch (e) {} }\n"
    "  return p.name; }\n"
    "// v5.8.8 유저 지휘: 멈춤 · 재생 · 한 턴")
# P3 처음 동료: 확정 셋 + 뽑기 셋
rep("  if (!(opt && opt.party)) while (pick.length < 2 && pool.length)", "  if (!(opt && opt.party)) while (pick.length < 3 && pool.length)   /* v8.7.2 뽑기 셋 */")
# E5 가윤: 순수 힐러 — 한 번에 최소 50 · 큰 몸은 최대 체력의 30% (상한 250) / 돌격 안 함
rep("skill: { name: '지혈 · 약', kit: true, pool: 20, pct: 0.3, min: 15, cap: 45,", "noChg: true, skill: { name: '지혈 · 약', kit: true, pool: 20, pct: 0.3, min: 50, cap: 250,")
# E3 모닝스타: 철퇴로는 돌격하지 않음 (명령이면 따름)
rep("weapon: '모닝스타', sm: 1.12, height: 1.72, weight: 62, bold: 0.65, chgBias: 2,", "weapon: '모닝스타', sm: 1.12, height: 1.72, weight: 62, bold: 0.65, noChg: true,")
# E9 트라카: 단궁 빠른 연사 (약하게)
rep("weapon: '단궁', ammo: 40, sm: 1.38, height: 1.25, weight: 34, nv: true, nvG: 'B', ov: { hp: 80, atk: 20, wind: 0.4, rec: 0.5 }", "weapon: '단궁', ammo: 60, sm: 1.38, height: 1.25, weight: 34, nv: true, nvG: 'B', ov: { hp: 80, atk: 13, wind: 0.2, rec: 0.22 }")
# 이미 저장된 동료 (여정 · 캠페인) 의 옛 값도
rep("// v5.8.8 유저 지휘: 멈춤 · 재생 · 한 턴",
    "// v8.7.2 저장된 동료의 옛 설계 값 (가윤 지혈 · 모닝스타 돌격 · 트라카 연사)\n"
    "function fix872(p){ if (!p || p.side !== 0) return; if (p.name === '가윤' && p.skill && +p.skill.min === 15 && +p.skill.cap === 45){ p.skill.min = 50; p.skill.cap = 250; p.noChg = true; }\n"
    "  if (p.name === '모닝스타' && +p.chgBias === 2 && !p.noChg){ p.chgBias = 0; p.noChg = true; } if (p.name === '트라카' && p.ov && +p.ov.wind === 0.4 && +p.ov.rec === 0.5){ p.ov.wind = 0.2; p.ov.rec = 0.22; p.ov.atk = 13; } }\n"
    "// v5.8.8 유저 지휘: 멈춤 · 재생 · 한 턴")
rep("  const cmdNew = cmdFind();   /* v8.7.2 지휘의 재능 */", "  S.units.forEach(fix872);   /* v8.7.2 */\n  const cmdNew = cmdFind();   /* v8.7.2 지휘의 재능 */")
# E10 성장: 근력은 없던 것이 새로 생기지 않음 — 대신 공격 +2 (10까지)
rep("    const cur = (p.traits.find(t => t.length === k.length + 1 && t.startsWith(k)) || '').slice(-1); if (GRADE_N[cur] >= GRADE_N[G.cap]) continue;",
    "    const cur = (p.traits.find(t => t.length === k.length + 1 && t.startsWith(k)) || '').slice(-1); if (GRADE_N[cur] >= GRADE_N[G.cap]) continue;\n"
    "    if (k === '근력' && !cur){ if ((p.growAtk || 0) >= 10) continue; p.ov = p.ov || {}; const b0 = p.ov.atk != null ? +p.ov.atk : statsOf({ ...p, ov: {} }, rules).atk; p.ov.atk = b0 + 2; p.growAtk = (p.growAtk || 0) + 2; out.push(`공격 +2 (${p.ov.atk})`); continue; }   /* v8.7.2 근력은 새로 생기지 않음 */")
# E11 돌진 준비 (명령을 받고 가는 중 · 노려보는 중) 엔 공격 단추로 표적을 바꿈 — 달리기 시작하면 그대로
rep("  L.forEach(u => { u.order = { k: 'attack', b: t.i, ...(rush ?",
    "  { const Ch = L.filter(u => (u.act && u.act.k === 'charge') || (u.order && u.order.k === 'charge' && u.order.b != null)); if (Ch.length){ const run = [];   /* v8.7.2 돌진 표적 바꾸기 */\n"
    "      for (const u of Ch){ if (u.act && u.act.k === 'charge' && u.act.phase !== 'wind'){ run.push(u.name); continue; } if (u.act && u.act.k === 'charge'){ u.act.b = t.i; u.act.px = null; u.act.py = null; u.fg = u.face = Math.atan2(t.y - u.y, t.x - u.x); } u.order = { k: 'charge', b: t.i }; u.last = { x: t.x, y: t.y }; }\n"
    "      const re = Ch.filter(u => !run.includes(u.name)); if (re.length){ noteOrders(re); logEv(world, { k: 'r8', s: `↪ ${re.map(u => u.name).join(' · ')} 돌진 표적 → ${t.name}`, vis: true }); }\n"
    "      toast(re.length ? `${re.map(u => u.name).join(' · ')} → ${t.name} 돌진 표적을 바꿈${run.length ? ' (' + run.join(' · ') + '은 이미 달림)' : ''}` : `${run.join(' · ')}은 이미 달리고 있어요 — 바꿀 수 없음`);\n"
    "      const rest = L.filter(u => !Ch.includes(u)); if (!rest.length){ hud(); return; } L.length = 0; L.push(...rest); } }\n"
    "  L.forEach(u => { u.order = { k: 'attack', b: t.i, ...(rush ?")
rep("C.forEach(u => { u.noChg = on; });", "C.forEach(u => { u.noChg = on; u.noChgUser = on; });   /* v8.7.2 유저가 켬 = 명령 돌격도 막음 */")
# P5 출구 명령은 자리 대신 '출구' · 엔진 회피 (evaded) 로그
rep("    else if (o && o.x != null) p.push(`→ ${coord(o.x, o.y)} (",
    "    else if (o && o.k === 'exit') p.push(o.dir === 'down' ? '↓ 아래 맵으로 (출구)' : '↑ 위 맵으로 (출구)');   /* v8.7.2 */\n    else if (o && o.x != null && o.y != null) p.push(`→ ${coord(o.x, o.y)} (")
rep("      case 'evade': out.push(`${T(e)}${e.m === 'slip'",
    "      case 'evade': if (e.m == null && e.how){ out.push(`${T(e)}💨 ${n(e.b)} 피함 ← ${e.a != null ? n(e.a) + '의 ' : ''}${{ melee: '일격', shot: '사격', arc: '곡사', jav: '투창' }[e.how] || e.how}${e.p != null ? ' (' + Math.round(e.p * 100) + '%)' : ''}`); break; }   /* v8.7.2 */\n"
    "        out.push(`${T(e)}${e.m === 'slip'")
# P4 상호작용 단추: 가까이 가면 화면 아래 가운데에 (관을 연다 · 말 걸기 · 쉬기 …) — 캠페인 띠의 같은 단추를 누름
rep('<div class="campbar" id="campBar" hidden></div>', '<div class="campbar" id="campBar" hidden></div><div class="actpr" id="actPr" hidden></div>')
rep(".campbar{position:absolute;", ".actpr{position:absolute;left:50%;bottom:72px;transform:translateX(-50%);z-index:4;pointer-events:auto}.actpr .btn{font-size:15px;padding:9px 18px;box-shadow:0 0 0 2px rgba(255,214,120,.55),0 6px 18px rgba(0,0,0,.5);animation:actpr 1.6s ease-in-out infinite}.actpr small{opacity:.7;font-size:11px;margin-left:6px}@keyframes actpr{50%{box-shadow:0 0 0 5px rgba(255,214,120,.25),0 6px 18px rgba(0,0,0,.5)}}body.mob .actpr{bottom:118px}\n.campbar{position:absolute;")
rep("  if (h !== campBarH || el.hidden){ campBarH = h; el.innerHTML = h; el.hidden = false; }\n  campNarrTop();\n}",
    "  if (h !== campBarH || el.hidden){ campBarH = h; el.innerHTML = h; el.hidden = false; }\n  campNarrTop(); actPrompt();\n}\n"
    "function actPrompt(){ const P = $('actPr'), el = $('campBar'); if (!P) return; const b = el && !el.hidden && world && !world.over ? el.querySelector('button.go:not([data-cexit]):not([data-cabandon]):not([data-cquit])') : null;   /* v8.7.2 */\n"
    "  const k = b ? b.outerHTML : ''; if (P.dataset.k === k) return; P.dataset.k = k; if (!b){ P.hidden = true; P.innerHTML = ''; return; }\n"
    "  P.innerHTML = `<button class=\"btn go\" type=\"button\">${esc(b.textContent.trim())}<small>가까이 있음</small></button>`; P.hidden = false; P.firstChild.onclick = () => { const q = $('campBar').querySelector('button.go:not([data-cexit]):not([data-cabandon]):not([data-cquit])'); if (q) q.click(); actPrompt(); }; }")
rep("  if (!C || C.end || (world && world.over && !$('banner').hidden) || (!$('banner').hidden && $('banner').classList.contains('shop'))){ if (!el.hidden || force){ el.hidden = true; el.innerHTML = ''; campBarH = ''; campNarrTop(); } return; }",
    "  if (!C || C.end || (world && world.over && !$('banner').hidden) || (!$('banner').hidden && $('banner').classList.contains('shop'))){ if (!el.hidden || force){ el.hidden = true; el.innerHTML = ''; campBarH = ''; campNarrTop(); } actPrompt(); return; }")
open(F, 'w', encoding='utf-8').write(s)
print('page8720 OK')
