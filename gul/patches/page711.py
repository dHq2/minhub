# v7.11.0 포복 v1 (페이지) — page711.py v1
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.10.6 (2026-10-14)', '<!-- 굴의 전투판 v7.11.0 (2026-10-17)')
rep('     v7.10.6: ', '''     v7.11.0: 포복 (엎드림) v1 — C 키 · 🦎 포복 단추 (명령 칸 · 모바일 아래 칸). 엎드림 0.6초 · 일어남 0.9초 (기동 0.55초), 바꾸는 동안 아무것도 못 함.
         엎드리면 기어서만 감 (×0.25) · 막기 · 피하기 · 전열 없음 · 근접에 약함 (넘어진 몸과 같음 — 짓밟기 · 치명). 엎드려서는 총만 쏨 (남은 빗나감 −35%) — 활 · 근접 · 기술은 일어나서.
         엎드린 몸은 1.8칸 밖에서 덜 맞음 (직사 ×0.55 · 곡사 · 투창 ×0.85 · 스치는 탄은 몸 폭 ×0.6 — 엎드린 아군 위로 쏘기 쉬움).
         아직 모르는 적에게는 가까이서만 보임: 빛 ×0.9 · 어스름 ×0.55 · 어둠 (야시 등급 거리) ×0.35. 그 밖 (본래 보이는 거리 안) 은 관측 기회에만 굴림 (기본 5% —
         빛 ×5 · 어스름 ×2 · 수상함 ×3 · 후각 ×3 · 베테랑 ×1.5 · 기는 중 ×3 · 큰 몸 ×3 · 은신 솜씨). 기회 = 처음 · 보는 쪽이 1.5칸 · 엎드린 몸이 0.8칸 움직임 · 6초마다 다시 훑음 · 새로 수상함.
         이미 보던 적은 계속 봄 — 다만 엎드릴 때 5칸 넘게 · 빛 밖에서 보던 눈은 30~50% (멀수록) 로 놓침 (마지막 자리는 기억해 그쪽을 뒤짐) · 시선이 4초 끊겨도 놓침.
         엎드려 쏜 총의 화염: 시야 ×1.6 안 · 트인 · 이쪽을 보는 적은 자리를 앎. 스스로 판단: 근접에 맞거나 근접이 노리고 3칸 안이면 일어남 · 원거리가 노리면 엎드린 채 버팀 (👁 들킨 듯).
         모르는 거구 · 무거운 몸 (180kg 넘게) 이 빠르게 지나가면 모르고 밟음 (무게 × 빠르기). 명령: 이동 · 공격 이동 · 제자리 · 사주경계는 엎드린 채 (이동 = 기어감), 총의 공격 · 견제도 엎드린 채,
         그 밖 (돌진 · 도약 · 정찰 · 암살 · 전열 …) 은 먼저 일어남. 명령 없이 엎드린 몸은 그 자리 (스스로 돌진 · 도약 · 투창 안 함, 손이 닿는 적은 일어나 침). 적은 아직 엎드리지 않음 (v1).
     v7.10.6: ''')
rep('h1::after{content:" v7.10.6"', 'h1::after{content:" v7.11.0"')
rep('<footer>굴의 전투판 v7.10.6', '<footer>굴의 전투판 v7.11.0')
rep('return `굴의 전투판 v7.10.6 · ${title}', 'return `굴의 전투판 v7.11.0 · ${title}')
rep("copyText('굴의 전투판 v7.10.6 자동 판 기록", "copyText('굴의 전투판 v7.11.0 자동 판 기록")
rep('의 버전 기록에 — v7.10.6 PC 명령 단추 · 휘두르기 줄 / ', '의 버전 기록에 — v7.11.0 포복 (엎드림 · 은폐 · 놓침 · 화염 · 밟힘) / v7.10.6 PC 명령 단추 · 휘두르기 줄 / ')
rep('">v7.10.6 · PC 명령 단추 고침 · 휘두르기 줄</span>', '">v7.11.0 · 🦎 포복 (엎드림)</span>')
rep("RULES_MIG = '7.10.3'", "RULES_MIG = '7.11.0'")

# ---------- 키 · 명령 ----------
rep("i: 'flare', z: 'stealth', x: 'cancel'", "i: 'flare', z: 'stealth', c: 'lie', x: 'cancel'")
rep("""  else if (k === 'lret'){   // v7.2 전열 조직 후퇴""", """  else if (k === 'lie'){ const ok = L.filter(u => u.alive && !u.down && !u.crawl); if (!ok.length){ toast('엎드릴 수 있는 아군이 없어요 (기어다니는 몸은 이미 바닥에)'); return; }   // v7.11 포복 (자세 — 바로)
    const on = !ok.every(u => u.lie && !(u.lieSw && !u.lieSw.to)); ok.forEach(u => lieSet(world, u, on, '명령')); logEv(world, { k: 'lieMode', a: ok.map(u => u.i), on, live: mode === 'run' && !paused });
    const LR = world.rules.lie || {}, nm = ok.map(u => u.name).join(' · '), gun = ok.filter(u => gunOf(world, u)), bow = ok.filter(u => isFar(u) && !gunOf(world, u));
    toast(on ? `${nm} 엎드림 (${LR.down}초) — 기어서만 감 ×${LR.spd} · 모르는 적에겐 가까이서만 보임 (어두울수록) · 멀리서 덜 맞음${gun.length ? ' · ' + gun.map(u => u.name).join(' · ') + ' 엎드려 쏨 (더 정확)' : ''}${bow.length ? ' · ' + bow.map(u => u.name).join(' · ') + ' 활은 일어나야 쏨' : ''} · 근접에 약함 · C 로 일어남` : `${nm} 일어남 (${LR.up}초${ok.some(u => u.cls === '기동') ? ' · 기동 ' + LR.upFast + '초' : ''})`); }
  else if (k === 'lret'){   // v7.2 전열 조직 후퇴""")
rep("""🥷 은신 <kbd>Z</kbd></button>""", """🥷 은신 <kbd>Z</kbd></button><button class="btn ${L.length && L.every(u => u.lie) ? 'on' : ''}" type="button" data-ord="lie" title="포복 — 엎드려 기어 감 · 모르는 적에겐 가까이서만 보임 · 멀리서 덜 맞음 · 총은 엎드려 쏨 (더 정확) · 근접에 약함">🦎 포복 <kbd>C</kbd></button>""")
rep("""'flare', 'stealth', 'guard', 'pick', 'swing', 'cancel', 'torch'].includes(k)){ ordKey(k); hud(); return; }""",
    """'flare', 'stealth', 'lie', 'guard', 'pick', 'swing', 'cancel', 'torch'].includes(k)){ ordKey(k); hud(); return; }""")
# 모바일 아래 칸
a = """'들킴' : '끔'}</small></button>` : '')"""
rep(a, a + """
      + (L.some(u => !u.crawl) ? `<button type="button" class="db ${L.every(u => u.lie) ? 'on' : ''}" data-dk="lie"><span class="ic">🦎</span>포복<small>${L.some(u => u.lieSw) ? (L.some(u => u.lieSw && u.lieSw.to) ? '엎드리는 중' : '일어나는 중') : L.every(u => u.lie) ? '엎드림' : L.some(u => u.lie) ? '일부' : '서 있음'}</small></button>` : '')   // v7.11 포복""")

# ---------- 단축키 표 ----------
rep("['Z', '은신']", "['Z', '은신'], ['C', '포복 (엎드림 · 일어남)']")

# ---------- 그림 ----------
rep("lying = !ed && (u.crawl || now < u.proneT || !!u.kb);", "lying = !ed && (u.crawl || (now < u.proneT && !(u.lie && u.side)) || !!u.kb || (!!u.lie && !u.side));   // v7.11 엎드린 아군 (적의 자세는 안 보여 줌)")
rep(": u.kb ? '밀려남' : '넘어짐'; ctx.font =", ": u.lie && !u.side && !(u.koT && now < u.koT) ? (u.lieSw ? (u.lieSw.to ? '엎드리는 중' : '일어나는 중') : u.lieFeelT != null && now - u.lieFeelT < 4 ? '🦎 엎드림 · 들킨 듯' : '🦎 엎드림') : u.kb ? '밀려남' : '넘어짐'; ctx.font =")

# ---------- 칩 · 카드 ----------
rep("const roeChip = (Wd, u) => {", "const lieChip = (Wd, u) => { if (!u.lie || !u.alive || hidA(Wd, u)) return ''; const bl = u.lieFeelT != null && Wd.t - u.lieFeelT < 4; return `<i class=\"stb lie ${bl ? 'blown' : ''}\" title=\"${u.lieSw ? (u.lieSw.to ? '엎드리는 중' : '일어나는 중') : '엎드림 (포복)' + (bl ? ' — 들킨 듯' : '')}\">${bl ? '👁' : '🦎'}</i>`; };   // v7.11\nconst roeChip = (Wd, u) => {")
rep("${ed ? '' : stlChip(Wd, u)}${ed ? '' : roeChip(Wd, u)}", "${ed ? '' : stlChip(Wd, u)}${ed ? '' : lieChip(Wd, u)}${ed ? '' : roeChip(Wd, u)}")
rep(".dchip .stb.roe{", ".dchip .stb.lie{left:19px;top:31px;box-shadow:0 0 0 1.5px #6ee7b7} .dchip .stb.lie.blown{box-shadow:0 0 0 1.5px #ff6b5a}\n.dchip .stb.roe{")
rep("""'🥷' + (si.k === 'off' ? ' ' + esc(si.why) : '')}</i>` : ''; })()}""", """'🥷' + (si.k === 'off' ? ' ' + esc(si.why) : '')}</i>` : ''; })()}${mode !== 'edit' && u.lie && u.alive && !hidA(Wd, u) ? ` <i class="stb lie">🦎 ${u.lieSw ? (u.lieSw.to ? '엎드리는 중' : '일어나는 중') : u.lieFeelT != null && Wd.t - u.lieFeelT < 4 ? '엎드림 · 들킨 듯' : '엎드림'}</i>` : ''}""")
rep(".pm .stb{font-style:normal;margin-left:3px}", ".pm .stb{font-style:normal;margin-left:3px} .pm .stb.lie{color:#6ee7b7}")

# ---------- 상세 ----------
rep("    ${!ed && (u.crawl || Wd.t < u.proneT) ? `<span class=\"tr\" style=\"color:#ff9a86\"><span class=\"lb\">넘어짐</span>",
    "    ${!ed && u.lie && u.alive ? (() => { const LR = Wd.rules.lie || {}, gun = gunOf(Wd, u), bl = u.lieFeelT != null && Wd.t - u.lieFeelT < 6; return `<span class=\"tr\" style=\"color:#86efac\"><span class=\"lb\">포복</span> ${u.lieSw ? (u.lieSw.to ? '엎드리는 중 ' : '일어나는 중 ') + f2(Math.max(0, u.lieSw.at - Wd.t)) + '초 (아무것도 못 함)' : '엎드림'} — 기는 속력 ×${LR.spd} · ${LR.near}칸 밖에서 맞을 확률 ×${LR.hitFar} (곡사 · 투창 ×${LR.hitArc}) · ${gun ? '엎드려 쏨 — 남은 빗나감 −' + Math.round((LR.aim || 0) * 100) + '%' : isFar(u) ? '활은 일어나야 쏨' : '치려면 일어남'} (${u.cls === '기동' ? LR.upFast : LR.up}초) · 근접에 약함 · 모르는 적에겐 빛 ×${LR.lit} · 어스름 ×${LR.dim} · 어둠 ×${LR.dark} 거리 안만 보임${bl ? ' · 👁 들킨 듯' : ''}</span>`; })() : ''}\n    ${!ed && (u.crawl || (Wd.t < u.proneT && !u.lieSw)) ? `<span class=\"tr\" style=\"color:#ff9a86\"><span class=\"lb\">넘어짐</span>")

# ---------- 수치표 ----------
rep("    ['leap.near', '[도약]: 근접 상대가", """    ['lie.down', '포복: 엎드리는 데 (초)'], ['lie.up', '포복: 일어나는 데 (초)'], ['lie.upFast', '포복: 기동이 일어나는 데 (초)'], ['lie.spd', '포복: 기는 속력 ×'], ['lie.aim', '포복: 엎드려 쏘는 총 — 남은 빗나감을 줄이는 몫'], ['lie.hitFar', '포복: 엎드린 몸이 멀리서 맞을 확률 × (직사)'], ['lie.hitArc', '포복: 같은 (곡사 · 투창)'], ['lie.hitR', '포복: 스치는 탄에 엎드린 몸 폭 ×'], ['lie.near', '포복: 이 거리 (칸) 안은 그냥 보이고 그냥 맞음'],
    ['lie.lit', '포복: 모르는 눈 — 빛 속 보는 거리 ×'], ['lie.dim', '포복: 어스름 ×'], ['lie.dark', '포복: 어둠 (야시 등급 거리) ×'], ['lie.spot', '포복: 관측 기회마다 알아볼 확률 (기본)'], ['lie.spotLit', '포복: 알아봄 × 빛'], ['lie.spotDim', '포복: 알아봄 × 어스름'], ['lie.spotSus', '포복: 알아봄 × 수상함 (소리 · 기억)'], ['lie.spotSmell', '포복: 알아봄 × 후각'], ['lie.spotVet', '포복: 알아봄 × 베테랑'], ['lie.spotMove', '포복: 알아봄 × 기는 중'], ['lie.spotBig', '포복: 알아봄 × 큰 몸 (2.2M 넘음)'], ['lie.rescan', '포복: 가만히 있어도 다시 훑는 간격 (초)'],
    ['lie.loseD', '포복: 엎드릴 때 이보다 멀리 (칸) 서 보던 눈은 놓칠 수 있음'], ['lie.lose.0', '포복: 놓칠 확률 (loseD 에서)'], ['lie.lose.1', '포복: 놓칠 확률 (보는 거리 끝)'], ['lie.mem', '포복: 아는 눈도 시선이 이만큼 (초) 끊기면 놓침'], ['lie.flash', '포복: 총구 화염이 보이는 거리 (시야 ×)'], ['lie.rise', '포복: 근접이 노리고 이 거리 (칸) 안이면 스스로 일어남'], ['lie.trample.mass', '포복: 이 무게 (kg) 넘는 몸은 모르고 밟음 (거구는 늘)'], ['lie.trample.v', '포복: 밟는 빠르기 (칸/초) 이상'], ['lie.trample.k', '포복: 밟힘 피해 × 무게 × 빠르기/2'],
    ['leap.near', '[도약]: 근접 상대가""")

# ---------- 로그 ----------
rep("      case 'stealthMode': out.push(", """      case 'lieMode': out.push(`${T(e)}🦎 ${e.a.map(n).join(' · ')} ${e.on ? '엎드려 (포복)' : '일어나'} — 명령`); break;   // v7.11 포복
      case 'lieDown': out.push(`${T(e)}🦎 ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} 엎드림 (${e.sec}초)${e.why && e.why !== '명령' ? ' — ' + e.why : ''}`); break;
      case 'lieDone': out.push(`${T(e)}🦎 ${n(e.a)} 다 엎드림${e.seen.length || e.lost.length ? ' [아군에겐 안 보임: 계속 보는 적 ' + (e.seen.map(n).join(' · ') || '없음') + (e.lost.length ? ' · 놓친 적 ' + e.lost.map(n).join(' · ') : '') + ']' : ''}`); break;
      case 'lieUp': out.push(`${T(e)}🦎 ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} 일어남 (${e.sec}초)${e.why && e.why !== '명령' ? ' — ' + e.why : ''}`); break;
      case 'lieRoll': if (e.ok) out.push(`${T(e)}👁 적 ${n(e.a)} — 엎드린 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 알아봄 (${e.d}칸 · ${e.why} · ${Math.round(e.p * 100)}%) [아군에겐 안 보임]`); break;
      case 'lieBlown': out.push(`${T(e)}👁 ${n(e.a)} (엎드림) — 들킨 듯 (${e.why === '맞음' ? '맞음' : e.b != null ? n(e.b) + '이 이쪽을 노림' : '시선'}) · 엎드린 채 버팀`); break;
      case 'lieFlash': out.push(`${T(e)}💥 ${n(e.a)} 엎드려 쏨 — 총구 화염에 자리가 드러남${e.n ? ' [아군에겐 안 보임: 본 적 ' + e.n + ']' : ''}`); break;
      case 'trample': out.push(`${T(e)}🦶 ${Wd.units[e.a].side ? '적 ' : ''}${n(e.a)} — 엎드린 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 모르고 밟음 (${e.sp}칸/초)`); break;
      case 'stealthMode': out.push(""")
rep("    case 'stealthBlown': return U(e.a).side === 0 ?", """    case 'lieDown': return U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 몸을 낮춰 바닥에 엎드린다.` } : null;   // v7.11 포복
    case 'lieUp': { const hot = /맞음|다가오는/.test(e.why || ''); return U(e.a).side === 0 ? { c: hot ? 'bad' : 'dim', s: hot ? `${ga(n(e.a))} 들켰다 — 벌떡 일어난다! (${e.why})` : `${ga(n(e.a))} 몸을 일으킨다.` } : null; }
    case 'lieBlown': return U(e.a).side === 0 ? { c: 'bad', s: `${ga(n(e.a))} 엎드린 채 시선을 느낀다 — 들킨 것 같다.` } : null;
    case 'trample': return e.vis ? { c: U(e.b).side === 0 ? 'bad' : 'good', s: `${ga(n(e.a))} 어둠 속 바닥의 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 모르고 짓밟는다!` } : null;
    case 'lieMode': case 'lieDone': case 'lieRoll': case 'lieFlash': return null;
    case 'stealthBlown': return U(e.a).side === 0 ?""")

open(F, 'w', encoding='utf-8').write(s)
print('page711 OK')
