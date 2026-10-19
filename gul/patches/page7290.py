# v7.29.0 페이지 — page7290.py v1.2 (v1.2: 공중제비 6칸 설명 · 수치표 이전 7.29.0 (새 칸 · 공중제비 거리) · 세자르 다리도 잘 안 부러짐 (노트) · v1.1: 갑피 밑에 쓴 왕관도 [★권위E] 표시 · v1.0: 싸움 바로잡기: 모닝스타 철퇴 오사 · 돌격 안 함 (PC 태세 줄 · 휴대폰 단추 · 다음 판에도) · 탕아는 공중제비로 · 세자르 버팀 (2D 판처럼) · 노인의 왕관 [★권위E] · 로그 · 상세 칸)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7280.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.28.0 (2026-10-18)', '<!-- 굴의 전투판 v7.29.0 (2026-10-18)')
rep('     v7.28.0: ', '''     v7.29.0: 싸움 바로잡기 — 모닝스타의 철퇴는 투사체: 깊이 겹친 동료도 맞음 (던질 때 · 거둘 때 · 머리 위로 돌리기는 빼고). 거두는 공도 길의 적을 맞힘 (× 0.6 · 가끔 넘어뜨림).
         돌격 성향: 모닝스타는 중거리를 지키다 드물게 · 탕아는 돌격 대신 공중제비 (6칸 — 먼 데서 순식간에 떨어짐). 아군마다 🚫 돌격 안 함 (태세 줄 · 휴대폰 단추 · 다음 판에도).
         세자르 (2D 판처럼): 넘어짐 · 휘청 · 다리 · 팔 부러짐을 85% 버팀 · 덜 밀림 · 붙으면 대개 원형 베기 → 몇 초 뒤 돌진해서 다시 원형 베기. 노인의 왕관 [★권위E]: 맵의 모든 신성 상대 효과 15% 약화.
     v7.28.0: ''')
rep('h1::after{content:" v7.28.0"', 'h1::after{content:" v7.29.0"')
rep('<footer>굴의 전투판 v7.28.0', '<footer>굴의 전투판 v7.29.0')
rep('return `굴의 전투판 v7.28.0 · ${title}', 'return `굴의 전투판 v7.29.0 · ${title}')
rep("copyText('굴의 전투판 v7.28.0 자동 판 기록", "copyText('굴의 전투판 v7.29.0 자동 판 기록")
rep("ver: '7.28.0', kind: '1F 여정 기록'", "ver: '7.29.0', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v7.28.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v7.29.0 — 1F 프롤로그 여정 기록'")
rep('의 버전 기록에 — v7.28.0 연출 (카메라 · 치명타 · 진동) /', '의 버전 기록에 — v7.29.0 싸움 바로잡기 (철퇴 오사 · 돌격 안 함 · 세자르 버팀 · 권위E) / v7.28.0 연출 (카메라 · 치명타 · 진동) /')
rep('">v7.28.0 · 연출</span>', '">v7.29.0 · 싸움 바로잡기</span>')

# ---------- 인물 ----------
rep("weapon: '대검', sm: 1.38, height: 1.82, weight: 82, bold: 0.6, nv: true,", "weapon: '대검', sm: 1.38, height: 1.82, weight: 82, bold: 0.6, noChg: true, nv: true,")   # 탕아: 돌격 대신 공중제비
rep("tactic: '용사 · 대검 (두 손) · 공중제비', note: '무감정하지만 정의로운 장군 출신 용사. 대검을 두 손으로 써 방패는 못 듦 (대검으로 막음).",
    "tactic: '용사 · 대검 (두 손) · 공중제비 (돌격 대신)', note: '무감정하지만 정의로운 장군 출신 용사. 대검을 두 손으로 써 방패는 못 듦 (대검으로 막음). 스스로 돌격하지 않고 공중제비로 파고듦 (돌진 명령은 따름).")
rep("weapon: '모닝스타', sm: 1.12, height: 1.72, weight: 62, bold: 0.65, nv: true,", "weapon: '모닝스타', sm: 1.12, height: 1.72, weight: 62, bold: 0.65, chgBias: 2, nv: true,")
rep("날아가는 공이 처음 닿는 적을 맞힘 (피할 수 있음 · 방패 정면은 막힘 · 동료는 비껴감) · 공이 돌아와야 다음. 붙으면 가끔 휘두름 · 맞으면 밀림 (괴력). 전선에서 싸우는 게 좋음.",
    "날아가는 공이 처음 닿는 몸을 맞힘 (피할 수 있음 · 방패 정면은 막힘 · 투사체라 깊이 겹친 동료도 맞음 — 던질 때도 거둘 때도) · 거두는 공도 길의 적을 침 (가끔 넘어뜨림) · 공이 돌아와야 다음. 동료가 공 길에 서 있으면 기다림 (명령이면 감수). 붙으면 가끔 휘두름 · 맞으면 밀림 (괴력). 중거리를 지키는 인원 — 돌격은 드물게.")
rep("poise: 6, sizeCls: '중대형', nv: true, nvG: 'S', bold: 1, ov: { hp: 500, atk: 62 },", "poise: 6, ccRes: 0.85, sizeCls: '중대형', nv: true, nvG: 'S', bold: 1, ov: { hp: 500, atk: 62 },")
rep("gear: { 머리: { name: '노인의 왕관', mat: '투구', tier: 1 } }, unique: ['권위'],", "gear: { 머리: { name: '노인의 왕관', mat: '투구', tier: 1, auth: 'E' } }, unique: ['권위'],")
rep("'brain', 'poise', 'dcounter', 'frostP', 'severP'];", "'brain', 'poise', 'dcounter', 'frostP', 'severP', 'ccRes', 'chgBias', 'noChg'];   /* v7.29.0 버팀 · 돌격 성향 */")

rep("적을 누르면 3.2칸까지 뛰어올라 그 몸 바로 앞에 내려찍음", "적을 누르면 6칸까지 (먼 데서 순식간에) 뛰어올라 그 몸 바로 앞에 내려찍음")
rep("RULES_MIG = '7.27.0'", "RULES_MIG = '7.29.0'")   # 새 칸 (cz.spinP · rspin · cc · flail.ff … · modBody.authW) · 공중제비 3.2 → 6

# ---------- 돌격 안 함 (PC 태세 줄 · 휴대폰 단추 · 단축키 없음) ----------
rep("""`).join('') : ''}${(() => { const Dp = deputyOf(Wd, 0),""",
    """`).join('') : ''}${L.some(u => u.canCharge) ? `<button class="btn ${L.filter(u => u.canCharge).every(u => u.noChg) ? 'on' : ''}" type="button" data-ord="nochg" title="스스로 돌격하지 않음 (지휘관의 돌격 명령 · 자동 돌격 모두) — 유저의 돌진 명령은 따름 · 다음 판에도 이어짐">🚫 돌격 안 함</button>` : ''}${(() => { const Dp = deputyOf(Wd, 0),""")   # v7.29.0
rep("  else if (k === 'stealth'){ const on = !L.every(u => u.stealth);",
    "  else if (k === 'nochg'){ const C = L.filter(u => u.canCharge); if (!C.length){ toast('돌격할 수 있는 아군을 고르세요'); return; } const on = !C.every(u => u.noChg); C.forEach(u => { u.noChg = on; }); logEv(world, { k: 'noChg', a: C.map(u => u.i), on, live: mode === 'run' && !paused });   // v7.29.0 돌격 안 함 (성향 — 바로)\n"
    "    toast(`${C.map(u => u.name).join(' · ')} — ${on ? '🚫 스스로 돌격하지 않음 (돌진 명령은 따름)' : '돌격을 스스로 판단'}`); }\n"
    "  else if (k === 'stealth'){ const on = !L.every(u => u.stealth);")
rep("""      + (gu ? `<button type="button" class="db ${gu.guardMode === 'hold' ? 'on' : ''}" data-dk="guard">""",
    """      + (L.some(u => u.canCharge) ? `<button type="button" class="db ${L.filter(u => u.canCharge).every(u => u.noChg) ? 'on' : ''}" data-dk="nochg"><span class="ic">🚫</span>돌격 안 함<small>${L.filter(u => u.canCharge).every(u => u.noChg) ? '켬' : '끔'}</small></button>` : '')   // v7.29.0
      + (gu ? `<button type="button" class="db ${gu.guardMode === 'hold' ? 'on' : ''}" data-dk="guard">""")
rep("'stealth', 'lie', 'detour', 'guard', 'pick', 'swing', 'cancel', 'torch'].includes(k)){ ordKey(k);", "'stealth', 'lie', 'detour', 'guard', 'pick', 'swing', 'cancel', 'torch', 'nochg'].includes(k)){ ordKey(k);")
rep("hp: u.healPol && u.healPol !== 'dying' ? u.healPol : null };", "hp: u.healPol && u.healPol !== 'dying' ? u.healPol : null, nc: u.noChg !== u.noChg0 ? (u.noChg ? 1 : 0) : null };   /* v7.29.0 돌격 안 함 (타고난 성향과 다를 때만) */")
rep("}).filter(x => x.o || x.gm || x.sw || x.st || x.tf || x.ro || x.hp);", "}).filter(x => x.o || x.gm || x.sw || x.st || x.tf || x.ro || x.hp || x.nc != null);")
rep("    if (wh.length) logEv(Wd, { k: 'opener', a: u.i, what: wh });",
    "    if (op.nc != null && u.canCharge){ u.noChg = !!op.nc; did = true; wh.push(op.nc ? '돌격 안 함' : '돌격 스스로'); }   // v7.29.0\n"
    "    if (wh.length) logEv(Wd, { k: 'opener', a: u.i, what: wh });")

# ---------- 로그 · 서술 ----------
rep("      case 'stealthMode': out.push(`${T(e)}🥷 ${e.a.map(n).join(' · ')} 은신 ${e.on ? '켬' : '끔'}`); break;",
    "      case 'stealthMode': out.push(`${T(e)}🥷 ${e.a.map(n).join(' · ')} 은신 ${e.on ? '켬' : '끔'}`); break;\n"
    "      case 'noChg': out.push(`${T(e)}▶ 유저 지휘${e.live === false ? ' (멈춘 채)' : ''} · 🚫 ${e.a.map(n).join(' · ')} 돌격 ${e.on ? '안 함' : '스스로 판단'}`); break;   // v7.29.0\n"
    "      case 'ccRes': out.push(`${T(e)}🗿 ${n(e.b)} 버팀 — ${e.what === 'stun' ? '휘청이지 않음' : '넘어지지 않음'}${e.a !== e.b ? ' (' + n(e.a) + ')' : ''}`); break;\n"
    "      case 'flailFF': out.push(`${T(e)}⚠ 오사 — ${n(e.a)}의 ${e.back ? '돌아오는 ' : ''}철퇴가 ${n(e.b)}에게`); break;")
rep("    case 'czBreak': return { c: 'good', s: `세자르의 ${CZ_NM[e.s] || e.s} — 끊겼다!` };",
    "    case 'czBreak': return { c: 'good', s: `세자르의 ${CZ_NM[e.s] || e.s} — 끊겼다!` };\n"
    "    case 'flailFF': return { c: 'bad', s: `${ga(n(e.a))} ${e.back ? '거둬들이던' : '던진'} 철퇴가 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 친다 — 오사!` };   // v7.29.0\n"
    "    case 'ccRes': return U(e.b).cz && W0ccNar(e) ? { c: 'bad', s: `세자르는 ${e.what === 'stun' ? '흔들리지 않는다' : '버티고 선다'}.` } : null;")

# 세자르 버팀 서술은 8초에 한 번만
rep("const CZ_NM = { spin: '원형 베기',", "let ccNarT = -99; const W0ccNar = e => { if (e.t - ccNarT < 8) return false; ccNarT = e.t; return true; };   // v7.29.0 세자르 버팀 서술 (8초에 한 번)\nconst CZ_NM = { spin: '원형 베기',")

# ---------- 상세 칸 ----------
rep("${esc(u.gear[k].name)} ${u.gear[k].tier}성 (${esc(u.gear[k].mat)})${u.gear[k].under ?",
    "${esc(u.gear[k].name)} ${u.gear[k].tier}성 (${esc(u.gear[k].mat)})${[u.gear[k], u.gear[k].under].some(x => x && (x.auth || x.name === '노인의 왕관')) ? ' [★권위E]' : ''}${u.gear[k].under ?")
rep("    ${u.alt ? `<span class=\"tr\">🔁 <i>[두 번째 총]</i>",
    "    ${known && crownOn(u) ? `<span class=\"tr\">👑 <i>[★권위E]</i> 노인의 왕관 — 맵의 모든 신성 상대 ([개조된 신체]) 효과 ${Math.round(((Wd.rules.modBody || {}).authW != null ? Wd.rules.modBody.authW : 0.15) * 100)}% 약화</span>` : ''}${known && u.ccRes ? `<span class=\"tr\">🗿 <i>[버팀]</i> 넘어짐 · 휘청을 ${Math.round(u.ccRes * 100)}% 버팀 · 덜 밀려남</span>` : ''}${u.side === 0 && u.canCharge && (u.noChg || u.chgBias) ? `<span class=\"tr\">🚫 <i>[돌격 성향]</i> ${u.noChg ? '스스로 돌격하지 않음 (돌진 명령은 따름)' : '돌격을 아낌 — 중거리를 지키다 드물게'}</span>` : ''}${u.alt ? `<span class=\"tr\">🔁 <i>[두 번째 총]</i>")   # v7.29.0

open(F, 'w', encoding='utf-8').write(s)
print('page7290 OK')
