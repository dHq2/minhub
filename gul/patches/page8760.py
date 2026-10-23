# v8.7.6 페이지 — page8760.py v1.3 (v1.3: 버전 글에 갑피 위 · 함께 오는 탄 · 접힌 패널 · v1.2: I 키는 접힌 PC 상세 패널을 펼침 · v1.1: 갑피 위의 장비가 망가지면 기록에 '벗겨져 갑피가 드러남' · v1.0: 인벤토리 v2 — 상세 칸 '🎒 장비 · 가방' 탭 (D2 · I24: 인물마다 무기 · 방패 · 몸 · 머리 칸 + 가방 칸 (빈 칸도 보임) · 고르면 설명 · 지금 것과 비교 · 들기 · 입기 · 벗기 · 마시기 · 건네기 · 내려놓기 · 두 번 누르면 바로 · 가까운 땅의 무구 줍기 · I 키) ·
#   판 위 이름표 (D3: 떨어진 무구 · 던진 창 위에 이름 — 누르면 상세 칸 (누가 주울지) · 장면 인물 이름표를 누르면 말 걸기) · 전리품 창 (J8: 받는 이의 지금 장비와 비교 ▲▼ · 끼우기 · 맵 위에선 판의 몸에 바로 (땅의 것은 사라짐 — 두 번 줍지 않게) · 출처 열쇠로 고름) ·
#   나가기 전 전리품 (J11: 끝난 맵에서 출구로 나가려 하면 남은 전리품을 한 번 보여 줌) · 카리우스 무기 칸 (J10: 두 손 무기 2칸) · 정산이 싸우는 중 갈아입은 갑옷 · 벗은 방패를 명단에 · 페흐토 투구 · 갑주는 땅이 아니라 전리품으로 (D1) · 기록 · 서술 · 글 고침)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8751.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.7.5 (2026-10-23)', '<!-- 굴의 전투판 v8.7.6 (2026-10-23)')
rep('     v8.7.5: ', '''     v8.7.6: 인벤토리 v2 — 상세 칸에 '🎒 장비 · 가방' 탭 (I): 무기 · 방패 · 몸 · 머리 칸과 가방 칸 (빈 칸도) · 고르면 설명과 지금 것과 비교 ▲▼ · 싸우는 중에도 들기 · 입기 (투구 1.5초 · 갑옷 4초 — 그동안 못 싸우고 휘청이면 끊김) ·
         벗기 · 마시기 · 곁의 동료에게 건네기 · 무기 · 방패 내려놓기 · 두 번 누르면 바로 (명령은 지휘망으로) · 가까운 땅의 무구 줍기. 판 위 이름표: 떨어진 무구 · 던진 창 위에 이름 — 누르면 누가 주울지 · 장면 인물 이름표를 누르면 말 걸기.
         전리품: 받는 이의 지금 장비와 비교 · 끼우기 · 맵 위에선 판의 몸에 바로 · 쓰러진 동료의 것도 · 진짜 시체만 · 줍거나 쓰러지면 다시 셈 · 끝난 맵에서 나가려 하면 남은 전리품을 한 번 보여 줌.
         카리우스: 무기 칸 넷 (한 손 1칸 · 두 손 2칸). 싸우는 중엔 무기 · 방패만 땅에 (페흐토의 투구 · 갑주도 싸움이 끝나면 전리품으로).
         갑피 위에 입은 장비는 판을 넘어가도 갑피 위 (벗거나 망가지면 갑피로) · 맵 위에서 챙긴 땅의 무기는 남은 화살 · 탄과 함께 · PC 상세 패널이 접혀 있으면 I · 이름표가 펼침
     v8.7.5: ''')
for a, b in (('h1::after{content:" v8.7.5"', 'h1::after{content:" v8.7.6"'), ('<footer>굴의 전투판 v8.7.5', '<footer>굴의 전투판 v8.7.6'), ('return `굴의 전투판 v8.7.5 · ${title}', 'return `굴의 전투판 v8.7.6 · ${title}'),
             ("copyText('굴의 전투판 v8.7.5 자동 판 기록", "copyText('굴의 전투판 v8.7.6 자동 판 기록"), ("o.push(`굴의 전투판 v8.7.5 — ${C.run", "o.push(`굴의 전투판 v8.7.6 — ${C.run"),
             ('의 버전 기록에 — v8.7.5 대형 (공세선 · 진형 · 조합 · 편성 창)', '의 버전 기록에 — v8.7.6 인벤토리 v2 (장비 탭 · 이름표 · 전리품 비교) / v8.7.5 대형 (공세선 · 진형 · 조합 · 편성 창)'),
             ('">v8.7.5 · 대형 (공세선 · 진형 버프 · 조합 버프 · 편성 창)</span>', '">v8.7.6 · 인벤토리 v2 (장비 탭 · 이름표 · 전리품 비교)</span>'),
             ("ver: '8.7.5', kind:", "ver: '8.7.6', kind:")):
    rep(a, b)
rep("const OLD_DEFAULTS = /*OLDDEF*/, RULES_MIG = '8.7.5',", "const OLD_DEFAULTS = /*OLDDEF*/, RULES_MIG = '8.7.6',")   # 수치표: inv.gearT · giveR · giveT · dropT 새 칸

# ---------- 장비 명령 (inv): 확인 글 · 명령 줄 글 · 지금 명령 ----------
rep("o.k === 'swap' ? ['🎒 꺼내 듦', '#e6d3a3'] :", "o.k === 'swap' ? ['🎒 꺼내 듦', '#e6d3a3'] : o.k === 'inv' ? ['🎒 ' + invOrdTxt(o), '#e6d3a3'] :")
rep("  if (o[0] === 'swap') return '가방에서 꺼내 듦';   // v7.20", "  if (o[0] === 'swap') return '가방에서 꺼내 듦';   // v7.20\n  if (o[0] === 'inv') return invOrdTxt({ op: o[1], uid: o[2], slot: o[3], to: o[4] }, Wd);   /* v8.7.6 */")
rep("u.order && u.order.k === 'swap' ? ['swap', u.order.uid] :", "u.order && u.order.k === 'swap' ? ['swap', u.order.uid] : u.order && u.order.k === 'inv' ? ['inv', u.order.op, u.order.uid != null ? u.order.uid : null, u.order.slot || null, u.order.to != null ? u.order.to : null] :")

# ---------- J10 카리우스 무기 칸 (두 손 무기 2칸) ----------
rep("const bagWpns = p => (p.bag || []).filter(x => x.k === 'weapon').length + (p.weapon && !ITEM_NATURAL.includes(p.weapon) ? 1 : 0);",
    "const wTwoP = n => ((rules.weapons || {})[n] || {}).two ? 2 : 1;   /* v8.7.6 J10 두 손 무기 (대검 · 대장군의 도끼) 는 무기 칸 둘 */\n"
    "const bagWpns = p => (p.bag || []).filter(x => x.k === 'weapon').reduce((s, x) => s + wTwoP(x.name), 0) + (p.weapon && !ITEM_NATURAL.includes(p.weapon) ? wTwoP(p.weapon) : 0);")
rep("if (it && it.k === 'weapon' && E.wmax && bagWpns(p) >= E.wmax) return '무기는 ' + E.wmax + '개까지';",
    "if (it && it.k === 'weapon' && E.wmax && bagWpns(p) + wTwoP(it.name) > E.wmax) return '무기 칸이 참 (' + bagWpns(p) + '/' + E.wmax + ' — 두 손 무기는 2칸)';")
rep("' · 무기 ' + bagWpns(p) + '/' + E.wmax + '개'", "' · 무기 칸 ' + bagWpns(p) + '/' + E.wmax + ' (두 손 무기 2칸)'")

# ---------- 글 고침: 들던 무기는 가방에 (자리가 없으면 발밑에) ----------
rep(" — 들던 무기는 발밑에 내려놓음</span>", " — 들던 무기는 가방에 (자리가 없으면 발밑에)</span>")
rep("(들던 ' + u.weapon + (jong(u.weapon) ? '은' : '는') + ' 발밑에 내려놓음)'", "(들던 ' + u.weapon + (jong(u.weapon) ? '은' : '는') + ' 가방에 — 자리가 없으면 발밑에)'")

# ---------- 정산: 싸우는 중 갈아입은 갑옷 · 벗은 방패도 명단에 ----------
rep("for (const sl of GEAR_SLOTS){ const g = (u.gear || {})[sl]; if (g && !g.innate && p.gear && p.gear[sl]) p.gear[sl].dur = +(+g.dur).toFixed(1); }",
    "for (const sl of GEAR_SLOTS){ const g = (u.gear || {})[sl]; p.gear = p.gear || {};   /* v8.7.6 싸우는 중 입고 벗은 것도 명단에 (갑피 위 · 갑피 아래는 그대로) */\n"
    "      if (g && !g.innate) p.gear[sl] = { name: g.name, mat: g.mat, tier: g.tier, dur: +(+(g.dur != null ? g.dur : 100)).toFixed(1), ...(g.size ? { size: g.size } : {}), ...(g.own ? { own: g.own } : {}) };\n"
    "      else if (g && g.innate && g.under){ if (p.gear[sl]) p.gear[sl].dur = +(+(g.under.dur != null ? g.under.dur : 100)).toFixed(1); }\n"
    "      else delete p.gear[sl]; }")
rep("else if (u.shield && !u.armShield){ p.shield = true; p.sDur = +(+u.sDur).toFixed(1); if (u.sName) p.sName = u.sName; }",
    "else if (u.shield && !u.armShield){ p.shield = true; p.sDur = +(+u.sDur).toFixed(1); if (u.sName) p.sName = u.sName; if (u.sOwn) p.sOwn = u.sOwn; }\n"
    "    else if (u.sOff && !u.shield && p.shield){ p.shield = false; delete p.sName; delete p.sDur; delete p.sOwn; }   /* v8.7.6 싸우는 중 벗어 가방에 넣은 방패 (가방 쪽에 있음) */")

# ---------- D1 페흐토: 투구 · 갑주는 땅이 아니라 전리품으로 ----------
rep("      try { dropItem(W, u, 'helm', '페흐토의 투구', { mat: '판금', tier: 3, dur: 100, label: '페흐토의 투구 (고급)' }, 'pehto'); dropItem(W, u, 'armor', '페흐토의 망토 갑주', { mat: '사슬', tier: 3, dur: 100, label: '페흐토의 망토 갑주 (고급)' }, 'pehto'); } catch (e) {}\n"
    "      logEv(W, { k: 'r8', s: '페흐토가 쓰러졌다. 청염이 꺼진 투구와 망토가 바닥에 남는다.', c: 'dim', vis: true }); }",
    "      u.gear = u.gear || {}; u.gear['머리'] = { name: '페흐토의 투구 (고급)', mat: '투구', tier: 3, dur: 100 }; u.gear['몸'] = { name: '페흐토의 망토 갑주 (고급)', mat: '사슬', tier: 3, dur: 100 }; W.lootSig = null;   /* v8.7.6 D1 싸우는 중엔 무기 · 방패만 땅에 — 투구 · 갑주는 싸움이 끝나면 전리품으로 (예전엔 땅에 떨어져 줍지도 못하고 시체에서 또 나왔음) */\n"
    "      logEv(W, { k: 'r8', s: '페흐토가 쓰러졌다. 청염이 꺼진 투구와 망토 갑주 — 싸움이 끝나면 전리품으로.', c: 'dim', vis: true }); }")

# ---------- 기록 · 서술 ----------
rep("case 'stow': out.push(", """case 'gearOn': out.push(`${T(e)}🎒 ${n(e.a)} ${e.slot === '머리' ? '투구' : '갑옷'} ${e.w} ${e.tier}성 입음${e.from ? ' (' + e.from + ' 은 가방에)' : ''}${e.spd != null ? ' · 걸음 ' + (+e.spd).toFixed(2) : ''}`); break;   /* v8.7.6 싸우는 중 장비 */
      case 'gearOff': out.push(`${T(e)}🎒 ${n(e.a)} ${e.slot === 'shield' ? '방패' : e.slot === '머리' ? '투구' : '갑옷'} ${e.w} 벗음 (가방에)${e.spd != null ? ' · 걸음 ' + (+e.spd).toFixed(2) : ''}`); break;
      case 'give': out.push(`${T(e)}🤝 ${n(e.a)} → ${n(e.b)}에게 ${e.w} 건넴`); break;
      case 'invBreak': out.push(`${T(e)}✋ ${n(e.a)} ${{ wear: '입던', off: '벗던', give: '건네던', drop: '내려놓던' }[e.op] || '하던'} ${e.w || (e.slot === 'shield' ? '방패' : e.slot === '머리' ? '투구' : e.slot ? '갑옷' : '것')} 끊김 — ${e.why}`); break;
      case 'stow': out.push(""")
rep("{ death: ' (쓰러지며)', arm: ' (팔을 잃어)', arms: ' (두 팔을 잃어)', swap: ' (바꿔 들며)' }[e.how]", "{ death: ' (쓰러지며)', arm: ' (팔을 잃어)', arms: ' (두 팔을 잃어)', swap: ' (바꿔 들며)', put: ' (내려놓음)' }[e.how]")
rep("    case 'bagSwap': return e.vis ?", """    case 'gearOn': return e.vis ? { c: 'dim', s: `${ga(n(e.a))} 서둘러 ${reul(e.w)} 걸쳐 입는다.` } : null;   /* v8.7.6 */
    case 'give': return e.vis ? { c: 'good', s: `${ga(n(e.a))} ${n(e.b)}에게 ${reul(e.w)} 건넨다.` } : null;
    case 'bagSwap': return e.vis ?""")

rep("      case 'aBreak': out.push(`${T(e)}💥 ${n(e.a)}의 ${e.slot} ${ga(e.name)} 망가짐 — 이제 막지 못함`); break;",
    "      case 'aBreak': out.push(`${T(e)}💥 ${n(e.a)}의 ${e.slot} ${ga(e.name)} 망가짐 — ${e.bare ? '벗겨져 갑피가 드러남' : '이제 막지 못함'}`); break;")   # v1.1 엔진 v1.2

# ---------- I 키 · 단축키 표 ----------
rep("  if (k === 'd' && !e.ctrlKey && !e.metaKey){ e.preventDefault(); fmOpen(); return; }   /* v8.7.5 편성 창 */",
    "  if (k === 'd' && !e.ctrlKey && !e.metaKey){ e.preventDefault(); fmOpen(); return; }   /* v8.7.5 편성 창 */\n"
    "  if (k === 'i' && !e.ctrlKey && !e.metaKey && mode !== 'edit'){ e.preventDefault(); detTab = detTab === 'eq' ? 'info' : 'eq'; detPick = null; if (MOB) openDet(true); else if (detTab === 'eq') detShowPc(); renderDetail(); return; }   /* v8.7.6 장비 · 가방 탭 (PC 상세 패널이 접혀 있으면 펼침) */")
rep("['D', '⚑ 편성 창 (편대 · 기준 · 모양 · 자리 · 버프 · 시작 · 싸울 때)']", "['D', '⚑ 편성 창 (편대 · 기준 · 모양 · 자리 · 버프 · 시작 · 싸울 때)'], ['I', '🎒 상세 칸의 장비 · 가방 탭 (싸우는 중 들기 · 입기 · 벗기 · 건네기)']")

exec(open(D + 'page8760b.py', encoding='utf-8').read())   # 장비 탭 · 이름표 · 전리품 (둘째 쪽)

open(F, 'w', encoding='utf-8').write(s)
print('page8760 OK')
