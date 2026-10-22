# v8.7.3 페이지 — page8730.py v1.19 (v1.19: 휴대폰 — 판 아래쪽 인물을 탭해 고르면 조작판이 커지며 이야기 띠가 그 자리로 올라와, 같은 터치에서 뒤따르는 클릭이 '빈 곳 탭' 으로 읽혀 고르기가 바로 풀리던 것 (옛 빌드부터 · 레베카가 아래에 서면 8번에 5번) — 판 탭 뒤 0.5초 클릭은 빈 곳 탭이 아님 (조작판 단추의 dockEatT 와 같은 방식) · 머리 주석에도 적음 · v1.18: 늦게 띄우는 것 (ldAfter — 맵에 들어선 나레이션 · 따라온 이 · 알림 · 오딜의 방) 은 건 때의 맵이 아직 그대로일 때만 — 새 여정 · 다른 맵으로 넘어간 뒤 앞 맵의 나레이션이 뜨던 것 · 머리 주석의 v8.7.3 줄에 대화 막이 · 늦은 나레이션을 이어 적음 · v1.17: 막 닫힌 대화 (0.45초) 거르기는 누르는 자리 (💬 단추 · 판의 인물 클릭) 에서만 — 대화 함수 안에 두어 '닫고 곧바로 다음 대화' 가 막히던 것 (대화가 이어지는 만남 · 시험) · v1.16: 머리 주석의 v8.7.3 줄에 바로잡기 3 · 4 와 판정 어긋남 아홉을 이어 적음 · v1.15: 사수가 막힌 표적 대신 다른 표적의 각을 잡음 (기록 altAim) · v1.14: 이어진 휘청을 버팀 — '버팀 — 연달아 묶이지 않음' · v1.13: 괴력으로 버틴 밀림은 '버텨 밀려남' · 들이받힘 기록에 '괴력으로 버팀 (휘청 없음)' · v1.12: 받쳐 준 동료가 날아온 몸을 받아 줌 (기록 · 이야기 caught) · v1.11: 막고도 쓰러지면 '막았으나 버티지 못함' (기록 · 이야기) — '막힘 92 (0/92)' 처럼 막았다면서 죽던 글 · v1.10: 밀림 기록 — 친 것의 무게 (던진 도끼 · 날아온 몸) · 날아온 것 (산탄 · 흙덩이 · 뿌리) 은 받은 몸만 · 버팀 배수 · 무엇에 밀렸나 (도끼에 쓸려 나감 등) · v1.9: 여정 맵은 createWorld 에 camp 를 넘김 (엔진이 0초 보임 · 시작 채움을 앎) · v1.8: 처음 배치는 들어서는 곳 (30층 사각형 · 1층 띠) 안의 칸을 먼저 — 대장은 그 안에서 둘레가 가장 트인 칸 · 나머지는 대장에게 가까운 순 · v1.7: 여정 맵은 대기 화면 (0초) 의 적 보임도 엔진의 0.3초 규칙에 맞춤 · v1.6: 적 진형 글은 그때의 지휘관 (죽은 곤봉적이 '지휘한다' 던 것) · 상처 목록 묶음 (팔 ×2, 오른팔 파괴) · 전리품 화살 수가 두 번 붙던 것 · 이야기 되풀이 줄임 (몸을 돌린다 · 숨이 차 · 모습도 소리도 끊겼다 · 전열 이룸 / 흩어짐) · 치료 도구 글 (양동이는 옐로만 · 노먼 · 가윤은 구급상자) · 전투 일지의 '동료의 상처' 에서 자기 치료 뺌 · 대화가 열려 있거나 막 닫힌 때 또 열리던 것 · 노라 글 · 세르파 소개 글 · v1.5: 처음 배치는 대장 둘레 반지름 1.5칸 (30층 · 1층 캠페인 같은 함수 · 시작 흔들기도 그 안) · 여정의 대기 화면 (⟲ 맵 처음부터) 에서 끌기 · 지우기 · 놓기 · 배치 칸 잠금 · 카메라: 확대 · 축소로 따라가기가 꺼지지 않음 · 끌어서 둘러본 뒤 10초 손대지 않으면 다시 따라가고 원래 배율로 천천히 · 30층 지도 화면에서 훈련장으로 바꾸면 지도가 판을 덮던 것 (접고 · 돌아오면 다시 폄) · v1.4: 화살통 · 탄 크기 (ammoMax) 를 남은 탄과 따로 저장 (옛 저장은 설계 · 무기 기본 탄으로 되살림) · 간두가 샷건을 든 채 맵이 끝나면 권총으로 돌려 둠 · 노라의 '탄 가득' 이 판 밖 동료에게도 실제로 채움 (쓰이지 않던 ammoLeft) · 원거리 무기는 무기 표로 가림 (단궁 · 하얀 나무 가 근접으로 잡혀 활 전리품 · 노라의 총 손질 · 대장장이에서 어긋나던 것) · v1.3: 바로잡기 4 — 쏜 것 · 던진 것의 이름 (활 = 화살 · 총 = 탄환 · 마법 = 마탄 · 투창 = 창 · 투척 = 단검 · 회전 = 도끼) · 활의 연사 글 · 회피기동 이야기의 undefined · 받침 글 · 소수 · 영어 · 기호 · 100초 넘는 시각 띄어쓰기 · 간격 음수 · 방 지킴이 이름 · 바꿔 드는 중 · 이미 쓰러짐 · 쓰러진 주인 · 목이 꿰뚫림 · 탄이 떨어져도 가방에 있으면 · 세르파 · 하딤 그림 (대사 이름 → 인물) · 전리품 탭부터 · 쓸 사람이 없으면 나누지 않음 · 던진 단검은 주인에게 (가방이 가득해도) · 간호사장 모자 한 번만 · 록토 로브 은신 E · 30층 무리의 1층 설계를 도감의 다른 인물로 · 괴수 A → 동굴 괴수 · 동료 · 펫의 별은 도감 희귀도 (뽑기 카드 · 30층 뽑기 · 동료 창) · 30층 여정 기록 (층 · 지대 · 칸 · 유물 · 동전 · 상인 · 쉼터 · 만남 칸의 대화 고름 · 머리글 · 결과) · 오딜 만남 수는 판을 넘어 쌓인 인연 · 방 구경 · 합류 이동은 '자동' · v1.2: 바로잡기 3 — [무장기] 특성 글 · 붉은암석 (키 3M · 맨손 (손) · [무장기] · 도약 강타 · 공격 52) · 세르파 보스판 체력 600 · 예고 회피 '!' · 투창 → 찌르기 · 내려앉을 자리 피함 글 · v1.1: 바로잡기 2 — 공중제비 · 뿌리 벽을 동료 곁 바닥에 찍어도 바닥으로 (그 동료를 고른 것으로 처리되던 것) · 철퇴 후리기 준비 중 단추를 한 번 더 = 그만둠 · 태세 막힘 · 후리기 경고 · 그만둠 · 철퇴 · 도약 사격 멈춤 글 · 활은 '방아쇠' 가 아니라 '시위' · v1.0: page8720.py 를 먼저 돌린 뒤 — 바로잡기 1: 명령 줄 (가는 명령은 모두 도착 · 같은 명령 한 번 · 바로 걸린 명령은 옛 줄을 지움) · 30층 보통 맵은 출구가 처음부터 열림 (정예 · 보스 · 봉인만 잠금) · 출구는 발견해야 보임 (발견 전 출구 단추 = 찾기) · 출구 단추 두 번 = 서둘러 · 시작 행동은 같은 맵에서만 (설정은 이어짐) · 나간 대장을 따라 넘어감 · 고유 기술 명령 글 · 지휘 넘김 · 출구 찾음 글)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8720.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.7.2 (2026-10-21)', '<!-- 굴의 전투판 v8.7.3 (2026-10-22)')
rep('     v8.7.2: ', '''     v8.7.3: 바로잡기 2 (여정 기록 검토) — 우리 편의 기준 = 주인공, 없으면 지휘관 (자동 · 따라감 · 탐험 · 출구로 따라 나감 · 낙오자 합류) · 지휘관이 먼저 나가면 끊김 없이 이어받음 (나감 ≠ 쓰러짐) · 명령 줄 (가는 명령은 모두 도착 · 같은 명령 한 번 · 옛 명령이 새 명령을 덮지 않음) · 30층 보통 맵 출구는 처음부터 열림 · 출구는 발견해야 보임 (발견 전 = 찾으러) · 대장은 마지막에 나감 · 출구 두 번 = 서둘러 · 시작 행동은 같은 맵에서만 · 끝난 맵의 옛 지킴 자리 풂 · 고유 기술 명령 글 · 막힌 공중제비 알림
     v8.7.2: ''')
for a, b in (('h1::after{content:" v8.7.2"', 'h1::after{content:" v8.7.3"'), ('<footer>굴의 전투판 v8.7.2', '<footer>굴의 전투판 v8.7.3'), ('return `굴의 전투판 v8.7.2 · ${title}', 'return `굴의 전투판 v8.7.3 · ${title}'),
             ("copyText('굴의 전투판 v8.7.2 자동 판 기록", "copyText('굴의 전투판 v8.7.3 자동 판 기록"), ("ver: '8.7.2', kind: '1F 여정 기록'", "ver: '8.7.3', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.7.2 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.7.3 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.7.2 바로잡기', '의 버전 기록에 — v8.7.3 바로잡기 2 (여정 기록) / v8.7.2 바로잡기'),
             ('">v8.7.2 · 바로잡기 (지휘 · 각혈 · 돌격 · 리치)</span>', '">v8.7.3 · 바로잡기 2 (지휘 기준 · 명령 줄 · 출구)</span>'),
             ("RULES_MIG = '8.7.2'", "RULES_MIG = '8.7.3'")):
    rep(a, b)

# ---------- 명령 줄 ----------
rep("    if (raw){ if (!u.lretId || (u.order && u.order.k === 'lret')) preempt(W, u); return; }",
    "    if (raw){ if (!u.lretId || (u.order && u.order.k === 'lret')) preempt(W, u); u.ordPend = null; u.ordQ = null; u.ordT0 = W.t; u.ordLive = u.order; return; }   /* v8.7.3 바로 걸린 명령은 옛 줄을 지움 (늦게 온 옛 명령이 출구 명령을 덮던 것) */")
rep("    if (lk.via === 'self'){ preempt(W, u); u.ordLive = u.order; u.ordPend = null; if (!u.order) lieFree(W, u); return; }   /* v7.16.1 */",
    "    if (lk.via === 'self'){ preempt(W, u); u.ordLive = u.order; u.ordPend = null; u.ordQ = null; u.ordT0 = W.t; if (!u.order) lieFree(W, u); return; }   /* v7.16.1 */   /* v8.7.3 */")
rep("    u.ordPend = { o: nu, m2: lk.m2, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: lk.c, m: lk.m, t0: W.t, legs: !!(lk.legs && lk.ok) }; if (C) ordFxAdd(W, u, lk, C.i, false); });",
    "    ordPush(W, u, { o: nu, m2: lk.m2, at: W.t + lk.t, ok: lk.ok !== undefined ? lk.ok : W.rand() < lk.p, hop: lk.hop, p: lk.p, via: lk.via, why: lk.why, c: lk.c, m: lk.m, t0: W.t, legs: !!(lk.legs && lk.ok) }); if (C) ordFxAdd(W, u, lk, C.i, false); });   /* v8.7.3 명령 줄 (가던 명령도 도착) */")

# ---------- 30층 출구: 보통 맵은 열림 · 발견해야 보임 ----------
rep("world.r8 = { node: n.id, t: n.t, wave: waveK || 0, rule }; world.exitLock = true;",
    "world.r8 = { node: n.id, t: n.t, wave: waveK || 0, rule }; world.exitLock = n.t === 'elite' || n.t === 'boss'; world.exitHide = true;   /* v8.7.3 보통 맵은 처음부터 열림 (싸울지 지나갈지 고름) · 정예 · 보스 · 봉인만 잠금 · 출구는 누가 봐야 앎 */")
rep("  const st = Wd.stairs; if (st && (Wd.cleared || !Wd.exitLock)){ const x = ox + st.x * ts, y = oy + st.y * ts, t = performance.now() / 600; ctx.save(); ctx.strokeStyle = `rgba(240,200,110,${0.55 + 0.35 * Math.sin(t)})`;",
    "  const st = Wd.stairs, stOpen = Wd.cleared || !Wd.exitLock; if (st && (!Wd.exitHide || Wd.exitSeen) && (stOpen || Wd.exitSeen)){ const x = ox + st.x * ts, y = oy + st.y * ts, t = performance.now() / 600; ctx.save(); ctx.strokeStyle = stOpen ? `rgba(240,200,110,${0.55 + 0.35 * Math.sin(t)})` : 'rgba(170,160,150,.55)';   /* v8.7.3 찾은 출구만 · 잠긴 출구는 흐리게 */")
rep("ctx.fillText(F8[(R8S() || {}).f] && F8[R8S().f].theme === 'caldera' ? '🛏 침대 (출구)' : '▼ 출구', x, y - ts * 0.95); ctx.restore(); }",
    "ctx.fillText((F8[(R8S() || {}).f] && F8[R8S().f].theme === 'caldera' ? '🛏 침대 (출구)' : '▼ 출구') + (stOpen ? '' : ' 🔒'), x, y - ts * 0.95); ctx.restore(); }")
rep("else if (S.art8){ h = (W.cleared || !W.exitLock) ? h.replace(/(<button[^>]*data-cexit=\"up\"[^>]*>)[^<]*/, '$1▼ 출구로')",
    "else if (S.art8){ h = (W.cleared || !W.exitLock) ? h.replace(/(<button[^>]*data-cexit=\"up\"[^>]*>)[^<]*/, W.exitHide && !W.exitSeen ? '$1🔎 출구 찾기' : '$1▼ 출구로')")
# 출구 단추: 두 번 = 서둘러 · 못 찾았으면 찾으러
rep("    if (!L.length) return; for (const u of L) u.order = { k: 'exit', dir, x: u.x }; noteOrders(L, 'user', '모두 ' + (dir === 'up' ? '위' : '아래') + ' 맵으로', !!world.cleared); toast(`모두 ${dir === 'up' ? '위' : '아래'} 맵으로 (끝 띠에 닿으면 넘어감)`); hud(); return; }",
    "    if (!L.length) return; const nowT = performance.now(), hur = !!(exitTap && exitTap.dir === dir && nowT - exitTap.t < 1500); exitTap = { dir, t: nowT };   /* v8.7.3 두 번 = 서둘러 */\n"
    "    const look = dir === 'up' && world.exitHide && !world.exitSeen && world.stairs;\n"
    "    for (const u of L) u.order = { k: 'exit', dir, x: u.x, ...(hur ? { hurry: true } : {}) }; noteOrders(L, 'user', (hur ? '서둘러 ' : '') + (look ? '출구 찾기' : '모두 ' + (dir === 'up' ? '위' : '아래') + ' 맵으로'), !!world.cleared);\n"
    "    toast(hur ? '모두 출구로 — 서둘러! (방패를 내리고 뜀)' : look ? '🔎 출구를 아직 못 찾았어요 — 대장을 따라 안 가 본 곳을 뒤져요 (찾으면 곧장 · 한 번 더 누르면 서둘러)' : `모두 ${dir === 'up' ? '위' : '아래'} 맵으로 (한 번 더 누르면 서둘러)`); hud(); return; }")
rep("$('campBar').addEventListener('click', e => {", "let exitTap = null;   /* v8.7.3 출구 단추 두 번 */\n$('campBar').addEventListener('click', e => {")
# 비전투 맵: 나간 대장 (주인공이 없으면 지휘관) 을 따라 모두 넘어감
rep("  if (W.over || W.r8fol) return; const h = W.units.find(u => u.side === 0 && u.hero); if (!h || (h.gone !== 'up' && h.gone !== 'down')) return;",
    "  if (W.over || W.r8fol) return; const h = W.units.find(u => u.side === 0 && u.hero) || (W.ancLeft ? W.units[W.ancLeft.i] : null); if (!h || (h.gone !== 'up' && h.gone !== 'down')) return;   /* v8.7.3 주인공이 없으면 대장 */")

# ---------- 시작 행동: 같은 맵에서만 (설정은 이어짐) ----------
rep("function saveOpeners(Wd){\n  const pidOf = i => (Wd.units[i] || {}).pid;",
    "const opKey = () => [S.type, S.W, S.H, S.seed, S.tseed || 0, S.art8 || '', S.camp ? S.camp.s : ''].join('|');   /* v8.7.3 시작 행동 (0초 명령) 은 같은 맵 (다시 하기 · 훈련장) 에서만 — 다음 맵에 옛 좌표 명령이 걸리던 것 */\n"
    "function saveOpeners(Wd){\n  const pidOf = i => (Wd.units[i] || {}).pid; S.openersK = opKey();")
rep("    if (op.o){ const o = { ...op.o }; let ok = true;", "    if (op.o && S.openersK === opKey()){ const o = { ...op.o }; let ok = true;")

# ---------- 명령 글 · 응답 ----------
rep("  if (o[0] === 'exit') return o[1] === 'down' ? '아래 맵으로' : '위 맵으로';   // v7.21",
    "  if (o[0] === 'exit') return (o[1] === 'down' ? '아래 맵으로' : '위 맵으로') + (o[2] ? ' (서둘러)' : '');   // v7.21\n"
    "  if (o[0] === 'spec'){ const nm = SPEC_NM(o[1]), t = o[2] != null && Wd.units[o[2]] ? Wd.units[o[2]].name : null; return t ? `${t}에게 ${nm}` : o[3] != null ? `${ro(coord(o[3], o[4]))} ${nm}` : o[5] != null ? `${nm} (${o[5]}M)` : nm; }   /* v8.7.3 고유 기술 (제자리로 찍히던 것) */\n"
    "  if (o[0] === 'alt') return '총 바꿔 듦';")
rep(": o.k === 'exit' ? [o.dir === 'down' ? '↓ 아래 맵으로' : '↑ 위 맵으로', '#b9e0a0'] :",
    ": o.k === 'exit' ? [(o.dir === 'down' ? '↓ 아래 맵으로' : '↑ 위 맵으로') + (o.hurry ? ' — 서둘러!' : ''), '#b9e0a0'] : o.k === 'spec' ? [(SPEC_IC[o.s] || '✦') + ' ' + SPEC_NM(o.s) + (tn ? ' → ' + tn : o.R ? ' ' + o.R + 'M' : ''), '#ffcf6e'] : o.k === 'alt' ? ['🔫 총 바꿔 듦', '#e6d3a3'] :")

# ---------- 로그 · 이야기 글 ----------
rep("      case 'succeed': out.push(`${T(e)}🚩 ${n(e.a)} ${e.deputy ? '부대장으로서 ' : ''}지휘를 이어받음 (${n(e.from)} 쓰러짐)`); break;",
    "      case 'succeed': out.push(`${T(e)}🚩 ${n(e.a)} ${e.deputy ? '부대장으로서 ' : ''}지휘를 이어받음 (${n(e.from)} ${e.left ? '먼저 올라감' : '쓰러짐'})`); break;\n"
    "      case 'exitFound': out.push(`${T(e)}🚪 ${e.a != null ? n(e.a) + ' — ' : ''}출구를 찾음 ${coord(e.x, e.y)}${e.lock ? ' (잠김 — 적을 모두 쓰러뜨려야 열림)' : ''}`); break;   /* v8.7.3 */\n"
    "      case 'exitSearch': out.push(`${T(e)}🔎 ${n(e.a)} 출구를 찾아 안 가 본 곳으로 (아직 못 찾음)`); break;\n"
    "      case 'exitWait': out.push(`${T(e)}⏳ ${n(e.a)} 출구 앞에서 오는 동료를 기다림 (${(e.n || []).map(n).join(' · ')}) — 대장은 마지막에`); break;\n"
    "      case 'specFail': out.push(`${T(e)}✗ ${n(e.a)} ${SPEC_NM(e.s)} 못 함 — ${e.why || '막힘'}`); break;")
rep("      case 'acting': out.push(`${T(e)}${e.side ? '◆ 적' : '◇ 아군'} 임시 지휘: ${n(e.a)} — 지휘를 이어받음 (지휘C 만큼${e.n > 1 ? ' · ' + e.n + '번째' : ''})`); break;",
    "      case 'acting': out.push(`${T(e)}${e.side ? '◆ 적' : '◇ 아군'} 임시 지휘: ${n(e.a)} — 지휘를 이어받음 (${e.left != null ? n(e.left) + ' 먼저 올라감 · ' : ''}지휘C 만큼${e.n > 1 ? ' · ' + e.n + '번째' : ''})`); break;")
rep("      case 'focusDown': out.push(`${T(e)}◆ 적 ${e.by != null ? '지휘 (' + n(e.by) + ')' : ''}: 표적 ${n(e.b)} 쓰러뜨림 — 다음 표적을 고름`); break;",
    "      case 'focusDown': out.push(`${T(e)}◆ 적${e.by != null ? ' 지휘 (' + n(e.by) + ')' : ''}: 표적 ${n(e.b)} 쓰러뜨림 — 다음 표적을 고름`); break;")
rep("    case 'succeed': return { c: 'bad', s: `${ga(n(e.a))} ${e.deputy ? '부대장으로서 ' : ''}지휘를 이어받는다.` };",
    "    case 'succeed': return e.left ? { c: 'dim', s: `${ga(n(e.from))} 먼저 올라가자 ${ga(n(e.a))} 지휘를 이어받는다.` } : { c: 'bad', s: `${ga(n(e.a))} ${e.deputy ? '부대장으로서 ' : ''}지휘를 이어받는다.` };\n"
    "    case 'exitFound': return { c: 'good', s: e.a != null ? `${ga(n(e.a))} 출구를 찾았다!${e.lock ? ' — 하지만 닫혀 있다.' : ''}` : `출구가 보인다!${e.lock ? ' — 하지만 닫혀 있다.' : ''}` };   /* v8.7.3 */\n"
    "    case 'exitSearch': return { c: 'dim', s: `${ga(n(e.a))} 출구를 찾아 안 가 본 쪽으로 앞장선다.` };\n"
    "    case 'exitWait': return { c: 'dim', s: `${ga(n(e.a))} 출구 앞에서 뒤따라오는 동료들을 기다린다.` };\n"
    "    case 'specFail': return { c: 'bad', s: `${ga(n(e.a))} 뛰려다 멈춘다 — 내려앉을 자리가 막혔다.` };")
rep("    case 'acting': return e.vis ? { c: e.side ? 'bad' : 'good', s: `${ga(n(e.a))} 소리친다 — 무너진 지휘를 이어받는다!` } : null;   // v6.8",
    "    case 'acting': return e.vis ? (e.left != null ? { c: 'dim', s: `${ga(n(e.left))} 먼저 올라가며 ${n(e.a)}에게 지휘를 넘긴다.` } : { c: e.side ? 'bad' : 'good', s: `${ga(n(e.a))} 소리친다 — 무너진 지휘를 이어받는다!` }) : null;   // v6.8   /* v8.7.3 나감 */")

# ---------- 바로잡기 2: 공중제비 바닥 · 후리기 그만둠 · 글 ----------
rep("    if (!u && A0.s === 'root'){", "    if ((!u || (u.side === 0 && !C.includes(u))) && A0.s === 'root'){   /* v8.7.3 동료 곁 바닥도 바닥 */")
rep("    if (!u && A0.s === 'flip'){ if (rock(Wd.map, w.x, w.y)){", "    if ((!u || (u.side === 0 && !C.includes(u))) && A0.s === 'flip'){ if (rock(Wd.map, w.x, w.y)){   /* v8.7.3 동료 곁 바닥에 찍어도 그쪽으로 빠짐 (그 동료를 고르던 것) */")
rep("    if (sp.k === 'sweep' && armed && armed.k === 'spec' && armed.s === 'sweep'){",
    "    { const W0 = D.filter(u => u.act && u.act.k === 'spec' && u.act.s === sp.k && u.act.phase === 'wind'); if (W0.length){ W0.forEach(u => { u.order = { k: 'specCancel', s: sp.k }; }); armed = null; noteOrders(W0, 'user', sp.name + ' 그만둠'); toast(`✋ ${W0.map(u => u.name).join(' · ')}: ${sp.name} 그만둠 (준비 중에 멈춤)`); hud(); return; } }   /* v8.7.3 준비 중에 한 번 더 = 그만둠 */\n"
    "    if (sp.k === 'sweep' && armed && armed.k === 'spec' && armed.s === 'sweep'){")
rep("  if (o[0] === 'alt') return '총 바꿔 듦';", "  if (o[0] === 'alt') return '총 바꿔 듦';\n  if (o[0] === 'specCancel') return SPEC_NM(o[1]) + ' 그만둠';")
rep(": o.k === 'alt' ? ['🔫 총 바꿔 듦', '#e6d3a3'] :", ": o.k === 'alt' ? ['🔫 총 바꿔 듦', '#e6d3a3'] : o.k === 'specCancel' ? ['✋ 그만', '#d8cfc0'] :")
rep("      case 'slam': out.push(`${T(e)}🤸 ${n(e.a)} 내려찍기 — ${e.n ? e.n + '명이 세로로 맞음' : '아무도 없음'}`); break;",
    "      case 'slam': out.push(`${T(e)}🤸 ${n(e.a)} 내려찍기 — ${e.n ? e.n + '명이 세로로 맞음' : e.held != null ? '태세에 막힘' : '아무도 없음'}`); break;\n"
    "      case 'slamHeld': out.push(`${T(e)}🛡 ${n(e.b)} 태세 — ${n(e.a)}의 내려찍기를 ${e.how}로 막음 (${n(e.a)} 짧게 휘청)`); break;   /* v8.7.3 */\n"
    "      case 'sweepWarn': out.push(`${T(e)}⚠ ${n(e.a)} — ${n(e.b)}의 철퇴 원 안 → \"!\" 비켜섬`); break;\n"
    "      case 'specCancel': out.push(`${T(e)}✋ ${n(e.a)} ${SPEC_NM(e.s)} 그만둠 (준비 중)`); break;")
rep("      case 'hold': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.jav ? '던지려다' : '쏘려다'} 멈춤:",
    "      case 'hold': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.jav || e.flail ? '던지려다' : e.leap ? '뛰어오르며 쏘려다' : '쏘려다'} 멈춤:")
rep("      return a.side === 0 ? { c: 'good', s: `${ga(a.name)} ${e.jav ? '창을 던지려다' : '방아쇠를 당기려다'} 멈춘다 — ${ga(by.name)} 사선에 들어왔다.` } : { c: 'dim', s: `${ga(a.name)} ${e.jav ? '창을 던지려다' : '쏘려다'} 멈춘다. 동료가 사선에 들어왔다.` }; }",
    "      const how = e.flail ? '철퇴를 던지려다' : e.jav ? '창을 던지려다' : e.leap ? '뛰어오르며 쏘려다' : /총/.test(a.weapon || '') ? '방아쇠를 당기려다' : '시위를 놓으려다';   /* v8.7.3 활은 시위 */\n"
    "      return a.side === 0 ? { c: 'good', s: `${ga(a.name)} ${how} 멈춘다 — ${ga(by.name)} ${e.flail ? '철퇴 길' : '사선'}에 들어왔다.` } : { c: 'dim', s: `${ga(a.name)} ${how} 멈춘다. 동료가 ${e.flail ? '철퇴 길' : '사선'}에 들어왔다.` }; }")
rep("    case 'slam': return e.n ? {",
    "    case 'slamHeld': return { c: U(e.b).side ? 'bad' : 'good', s: `${ga(n(e.b))} 버티고 서서 ${n(e.a)}의 내려찍기를 ${ro(e.how)} 받아 낸다! ${ga(n(e.a))} 휘청인다.` };   /* v8.7.3 태세 막힘 */\n"
    "    case 'sweepWarn': return { c: 'dim', s: `\"!\" — ${ga(n(e.a))} ${n(e.b)}의 철퇴가 도는 원 밖으로 몸을 뺀다.` };\n"
    "    case 'specCancel': return { c: 'dim', s: e.s === 'sweep' ? `${ga(n(e.a))} 머리 위로 돌리던 철퇴를 거둔다.` : `${ga(n(e.a))} ${reul(SPEC_NM(e.s))} 멈춘다.` };\n"
    "    case 'slam': return e.n ? {")

# ---------- 바로잡기 3: 보스 · 예고 회피 글 ----------
rep("  '갑피': '피부가 갑옷 + 투구:", "  '무장기': '장기가 없는 몸 (바위 · 마족 · 슬라임): 급소 (머리 · 가슴) · 꿰뚫어 즉사 · 머리 직격 즉사 · 출혈 · 내출혈 · 실명 · 장기 상처가 없음 — 팔다리는 잘리고 부서짐 (깎아 내려야 쓰러짐)',   /* v8.7.3 */\n  '갑피': '피부가 갑옷 + 투구:")
rep("  ['붉은암석', 'C-245', 4, { weapon: '둔기', height: 2.4, weight: 600, sizeCls: '대형', ov: { hp: 760, atk: 44 }, traits: ['갑피', '거구'] }, '매우 단단한 바위 거인'],",
    "  ['붉은암석', 'C-245', 4, { weapon: '맨손', height: 3.0, weight: 900, sizeCls: '대형', ov: { hp: 760, atk: 52 }, traits: ['갑피', '거구', '무장기'], active: ['도약 강타'] }, '매우 단단한 바위 거인 — 손으로 짓뭉갬 · 뛰어올라 찍음 (그림자를 보면 피할 것)'],   /* v8.7.3 키 3M · 손 · 장기 없음 · 점프 찍기 */")
rep("if (FOE8['세르파']){ FOE8['세르파'].ov = { ...FOE8['세르파'].ov, hp: 240 };", "if (FOE8['세르파']){ FOE8['세르파'].ov = { ...FOE8['세르파'].ov, hp: 600 };   /* v8.7.3 240 → 600 (머리 두 방에 끝나던 보스) */")
rep("      case 'quakeFlee': out.push(`${T(e)}🏃 ${n(e.a)} 내려앉을 자리에서 피함`); break;",
    "      case 'quakeFlee': out.push(`${T(e)}🏃 ${n(e.a)} 내려앉을 자리에서 피함`); break;\n"
    "      case 'tgDodge': out.push(`${T(e)}❗ ${n(e.a)} — ${n(e.b)}의 ${e.what}을(를) 보고 몸을 날려 피함`); break;   /* v8.7.3 예고 회피 */\n"
    "      case 'tgLate': out.push(`${T(e)}… ${n(e.a)} — ${n(e.b)}의 ${e.what}을(를) 봤지만 늦음`); break;\n"
    "      case 'ordSwap': out.push(`${T(e)}↪ ${n(e.a)} 투창 → 찌르기 (${e.why})`); break;")
rep("    case 'slamHeld': return {",
    "    case 'tgDodge': return { c: U(e.a).side ? 'dim' : 'good', s: `\"!\" — ${ga(n(e.a))} ${n(e.b)}의 ${e.what}을(를) 보고 몸을 날려 피한다.` };   /* v8.7.3 */\n"
    "    case 'quakeFlee': return { c: U(e.a).side ? 'dim' : 'good', s: `${ga(n(e.a))} 드리운 그림자를 보고 내려앉을 자리에서 몸을 뺀다.` };\n"
    "    case 'ordSwap': return { c: 'dim', s: `${ga(n(e.a))} 던지기엔 너무 가깝다 — 창을 쥔 채 찌른다.` };\n"
    "    case 'slamHeld': return {")

# ---------- 바로잡기 4: 희귀도 별 · 30층 여정 기록 ----------
rep("const TIER_STAR = t => '★'.repeat(Math.max(1, Math.min(7, t || 1)));",
    "const TIER_STAR = t => '★'.repeat(Math.max(1, Math.min(7, t || 1)));\n"
    "// v8.7.3 동료 · 펫의 별 (★) = 도감 희귀도 (친칠라 ★4 · 카리우스 ★5) — 전투 등급 (동료는 늘 2) 이 아님\n"
    "const RAR_OF = p => { const r = p && p.ref && RBY[p.ref]; return r && ALLY(r[2]) ? r[3] || 0 : 0; };\n"
    "const RAR_STAR = p => { const n = RAR_OF(p); return n ? '★'.repeat(Math.min(7, n)) : ''; };")
rep("<small>${TIER_STAR(p.tier)} · ${esc(p.cls || '')}", "<small>${RAR_STAR(p) ? RAR_STAR(p) + ' · ' : ''}${esc(p.cls || '')}")
rep("<small>${TIER_STAR(c.tier)} · 동료</small>", "<small>${RAR_STAR(c) ? RAR_STAR(c) + ' · ' : ''}동료</small>")
rep("<b>${esc(p.name)}</b> ${TIER_STAR(p.tier)} <small>", "<b>${esc(p.name)}</b> ${RAR_STAR(p)} <small>")
# 30층 여정 기록: 1S · 3S 가 아니라 층 · 지대 · 칸 (그때의 유물 · 동전) · 상인 · 쉼터 · 만남 글 칸도 (대화 고름)
rep("  J.visits.push(v); J.cur = J.visits.length - 1;\n}\nfunction jrTalk(o)",
    "  if (typeof run8On === 'function' && run8On()) jrR8(J, v, E3);   /* v8.7.3 30층 */\n"
    "  J.visits.push(v); J.cur = J.visits.length - 1;\n}\n"
    "// v8.7.3 30층 여정 기록: 들어선 칸 (층 · 지대 · 칸 종류) · 그때의 유물 · 동전 — 만남 칸에서 열린 맵은 그 칸의 빈 기록 자리를 이어 씀\n"
    "function jrR8(J, v, E3){\n"
    "  const R = R8S(); if (!R) return; const nd = R.at ? r8Node(R.at) : null, F = F8[R.f] || {}, t = nd ? nd.t : null;\n"
    "  v.name = `${R.f}층 ${t ? (NODE8[t] || {}).nm || t : ''}`.trim(); v.kind = t === 'elite' ? (ELITE8[nd.e] || {}).name || '정예' : t === 'boss' ? r8BossName(nd.b) : E3 ? E3.name : F.name || ''; v.back = false;\n"
    "  v.r8 = { f: R.f, zone: F.name || null, node: t, id: R.at || null, ms: (nd && nd.ms) || null }; v.relics = R.relics.slice(); v.gold = R.gold;\n"
    "  const pv = J.visits[J.visits.length - 1]; if (pv && pv.panel && pv.r8 && pv.r8.id === v.r8.id && !(pv.talk || []).length){ J.visits.pop(); v.n = J.visits.length + 1; }\n"
    "}\n"
    "function jrPanel(n){\n"
    "  const C = S.camp, R = R8S(); if (!C || !R || !n) return; const J = C.jr || (C.jr = { v: 1, visits: [] }), F = F8[R.f] || {};\n"
    "  J.visits.push({ n: J.visits.length + 1, s: 0, name: `${R.f}층 ${(NODE8[n.t] || {}).nm || n.t}`, kind: F.name || '', at: Date.now(), panel: true, talk: [], r8: { f: R.f, zone: F.name || null, node: n.t, id: n.id }, relics: R.relics.slice(), gold: R.gold }); J.cur = J.visits.length - 1;\n"
    "}\nfunction jrTalk(o)")
rep("  if (n.t === 'rest'){ r8RestPanel(n); return; }", "  if (['rest', 'shop', 'chest', 'enc', 'fixed', 'final'].includes(n.t)) try { jrPanel(n); } catch (e) {}   /* v8.7.3 여정 기록에 칸 (대화 고름 · 유물) */\n  if (n.t === 'rest'){ r8RestPanel(n); return; }")
rep("const JR_END = { clear: '계단 — 1F 프롤로그 끝', wipe: '전멸' };", "const JR_END = { clear: '계단 — 1F 프롤로그 끝', wipe: '전멸' };\nconst JR8_END = { wipe: '전멸', out10: '10층 생환', out20: '20층 생환', lose30: '30층 결전 — 짐', true: '진엔딩 — 30층 끝' };   /* v8.7.3 30층 여정의 끝 */")
rep("result: C.end ? JR_END[C.end] || C.end : ", "result: C.run ? (C.run.end ? JR8_END[C.run.end] || '여정 끝 (' + C.run.end + ')' : `진행 중 — ${C.run.f}층`) : C.end ? JR_END[C.end] || C.end : ")
rep("maps: M.length, time:", "maps: M.filter(m => !m.panel).length, time:")
rep("  o.push('굴의 전투판 v8.7.3 — 1F 프롤로그 여정 기록', ", "  o.push(`굴의 전투판 v8.7.3 — ${C.run ? '30층 여정 기록' : '1F 프롤로그 여정 기록'}`, ")
rep("  M.forEach((m, i) => {\n    o.push(`════════ ${i + 1}. ${m.name || m.s + 'S'} · ${m.kind || ''}${m.enc ? ' — ' + m.enc : ''}${m.btl ? ' — ' + m.btl.comp + ' · ' + m.btl.sit : ''}${m.npc ? ' (' + m.npc + ')' : ''} — ${m.back ? '다시 들어섬' : '처음'}",
    "  let prevRel = [];   /* v8.7.3 30층: 그 사이 얻은 유물 */\n  M.forEach((m, i) => {\n    o.push(`════════ ${i + 1}. ${m.name || m.s + 'S'} · ${m.kind || ''}${m.enc && m.enc !== m.kind ? ' — ' + m.enc : ''}${m.btl ? ' — ' + m.btl.comp + ' · ' + m.btl.sit : ''}${m.npc ? ' (' + m.npc + ')' : ''} — ${m.panel ? '들름' : m.back ? '다시 들어섬' : '처음'}")
rep("    if (m.at) o.push(`들어선 때: ${jrTime(m.at)}`); if ((m.foes || []).length)",
    "    if (m.r8){ o.push(`30층: ${m.r8.f}층 · ${m.r8.zone || '—'} · ${(NODE8[m.r8.node] || {}).nm || m.r8.node || '—'}${m.r8.ms ? ' (' + m.r8.ms + ')' : ''}${m.gold != null ? ' · 동전 ' + m.gold : ''}`);\n"
    "      if (m.relics){ const nw = m.relics.filter(k => !prevRel.includes(k)); if (nw.length && i > 0) o.push('그 사이 얻은 유물: ' + nw.map(k => (RELIC8[k] || {}).name || k).join(' · ')); prevRel = m.relics; } }\n"
    "    if (m.at) o.push(`들어선 때: ${jrTime(m.at)}`); if ((m.foes || []).length)")
rep("  return { game: '굴의 전투판', ver: '8.7.3', kind: '1F 여정 기록', at:",
    "  if (J) for (const pv of (J.visits || []).filter(q => q.panel)){ const k = M.findIndex(m => m.n != null && m.n > pv.n); M.splice(k < 0 ? M.length : k, 0, { ...pv }); }   /* v8.7.3 30층 칸 (상인 · 쉼터 · 만남 글) */\n"
    "  return { game: '굴의 전투판', ver: '8.7.3', kind: C.run ? '30층 여정 기록' : '1F 여정 기록', at:")
rep("    camp: { s: C.s, end: C.end || null, pick: C.pick, fallen: C.fallen, lost: C.lost, log: C.log }, stages:",
    "    camp: { s: C.s, end: C.end || null, pick: C.pick, fallen: C.fallen, lost: C.lost, log: C.log, run: C.run ? { f: C.run.f, end: C.run.end || null, relics: (C.run.relics || []).slice(), gold: C.run.gold } : null }, stages:")
rep("S.jrLast = { jr: clone(C.jr), camp: { s: C.s, end: C.end || null, pick: C.pick, fallen: C.fallen, lost: C.lost, log: C.log, t0: C.t0, t1: C.t1 || Date.now() } };",
    "S.jrLast = { jr: clone(C.jr), camp: { s: C.s, end: C.end || null, pick: C.pick, fallen: C.fallen, lost: C.lost, log: C.log, t0: C.t0, t1: C.t1 || Date.now(), run: C.run ? { f: C.run.f, end: C.run.end || null, relics: (C.run.relics || []).slice(), gold: C.run.gold } : null } };")
rep("filename: `gul_1F_journey_${", "filename: `gul_${out.kind === '30층 여정 기록' ? '30F' : '1F'}_journey_${")
# 오딜: 만남 수는 판을 넘어 쌓인 인연 (이 맵의 '처음' 과 다름)
rep("      case 'odMeet': out.push(`${T(e)}🫖 오딜과의 만남 ${e.n}번째${e.n === 3 ? ' — 장미장식을 줄 때' : ''}`); break;",
    "      case 'odMeet': out.push(`${T(e)}🫖 오딜과의 만남 ${e.n}번째 (판을 넘어 쌓인 인연)${e.n === 3 ? ' — 장미장식을 줄 때' : ''}`); break;")
# 방 구경 · 합류 이동은 유저 명령이 아님 (명령 칸 '자동')
rep("const ordOf = u => u.order && u.order.k === 'exit' ?", "const ordOf = u => u.order && (u.order.room || u.order.rejoin) ? ['auto'] : u.order && u.order.k === 'exit' ?")

# ---------- 바로잡기 4: 글 묶음 ----------
# 쏜 것 · 던진 것의 이름
rep("const ga = w => w + (jong(w) ? '이' : '가'), reul = w => w + (jong(w) ? '을' : '를'), wa = w => w + (jong(w) ? '과' : '와');",
    "const ga = w => w + (jong(w) ? '이' : '가'), reul = w => w + (jong(w) ? '을' : '를'), wa = w => w + (jong(w) ? '과' : '와');\n"
    "// v8.7.3 쏜 것 · 던진 것의 이름 — 활 = 화살 · 총 = 탄환 · 마법 = 마탄 · 투창 = 창 · 투척 = 단검 · 회전 투척 = 도끼 (활을 총으로 · 도끼를 화살로 쓰던 것)\n"
    "function shotNm(Wd, a, e){\n"
    "  if (e && /도끼/.test(e.tag || '')) return '도끼'; if (e && e.jav) return e.kn ? '단검' : '창';\n"
    "  const WP = (Wd && Wd.rules && Wd.rules.weapons) || (typeof rules !== 'undefined' && rules.weapons) || {}, wn = (a && (a.weaponNow && a.weaponNow !== '맨손' ? a.weaponNow : a.weapon)) || '', k = (WP[wn] || {}).kind;\n"
    "  return k === '활' || /활|궁/.test(wn) ? '화살' : k === '총포류' || /총|샷건/.test(wn) ? '탄환' : k === '마법' || /마법/.test(wn) ? '마탄' : '화살';\n"
    "}")
rep("const w = e.jav ? '창' : a.loud || /총/.test(a.weapon || '') ? '탄환' : '화살';", "const w = shotNm(Wd, a, e);")
rep("${a.name}의 ${e.jav ? '창' : a.loud ? '탄환' : '화살'}이 ${b.name}의", "${a.name}의 ${ga(shotNm(Wd, a, e))} ${b.name}의")
rep("${a.name}의 ${e.jav ? '창' : '화살'}이 ${b.name}의 투구째", "${a.name}의 ${ga(shotNm(Wd, a, e))} ${b.name}의 투구째")
rep("${a.name}의 ${far ? '탄환' : '공격'}이 사선에 끼어든", "${a.name}의 ${ga(far ? shotNm(Wd, a, e) : '공격')} 사선에 끼어든")
rep("${a.name}의 ${far ? '탄환' : '공격'}을 ${e.parry ? '받아 낸다' : '막아낸다'}", "${a.name}의 ${reul(far ? shotNm(Wd, a, e) : '공격')} ${e.parry ? '받아 낸다' : '막아낸다'}")
rep("${a.name}의 ${e.fired ? (e.jav ? '창' : /총/.test(a.weapon || '') ? '탄환' : '화살') : '공격'}을 피한다", "${a.name}의 ${reul(e.fired ? shotNm(Wd, a, e) : '공격')} 피한다")
rep("급소! ${a.name}의 ${e.jav ? '투창' : far ? (/총/.test(a.weapon || '') ? '총알' : '화살') : '일격'}이", "급소! ${a.name}의 ${ga(e.jav ? (e.kn ? '단검' : '투창') : far ? shotNm(Wd, a, e) : '일격')}")
rep("${ga(a.name)} 틈을 보고 ${b.name}에게 ${far ? '총구를 돌린다' : '달려든다'}.", "${ga(a.name)} 틈을 보고 ${b.name}에게 ${far ? (shotNm(Wd, a) === '탄환' ? '총구를 돌린다' : '겨눈다') : '달려든다'}.")
rep("case 'burst': return e.vis || U(e.a).side === 0 ? { c: U(e.a).side ? 'bad' : 'good', s: `\"드르르륵!\" ${ga(n(e.a))} ${reul(n(e.b))} 향해 길게 긁어 쏜다!` } : null;",
    "case 'burst': return e.vis || U(e.a).side === 0 ? { c: U(e.a).side ? 'bad' : 'good', s: shotNm(Wd, U(e.a)) === '탄환' ? `\"드르르륵!\" ${ga(n(e.a))} ${reul(n(e.b))} 향해 길게 긁어 쏜다!` : `${ga(n(e.a))} ${reul(n(e.b))} 향해 ${shotNm(Wd, U(e.a)) === '화살' ? '시위를 연달아 당긴다' : '연달아 쏜다'}!` } : null;   /* v8.7.3 활 · 마법은 드르르륵이 아님 */")
rep("case 'burst': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 긴 점사 ${e.n}발 \"드르르륵!\"`); break;",
    "case 'burst': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${shotNm(Wd, Wd.units[e.a]) === '탄환' ? '긴 점사 ' + e.n + '발 \"드르르륵!\"' : '연사 ' + e.n + '발'}`); break;")
rep("case 'spearDrop': out.push(`${T(e)}${n(e.a)}의 창이 ", "case 'spearDrop': out.push(`${T(e)}${n(e.a)}의 ${ga(e.kn ? e.w || '단검' : '창')} ")
rep("    case 'spearDrop': return e.how === 'block' ? { s: `창이 방어에 막혀 튕겨 나간다.` } : e.how === 'miss' ? { c: 'dim', s: `창이 빗나가 땅에 꽂힌다.` } : null;",
    "    case 'spearDrop': { const w = e.kn ? '단검' : '창'; return e.how === 'block' ? { s: `${ga(w)} 방어에 막혀 튕겨 나간다.` } : e.how === 'miss' ? { c: 'dim', s: `${ga(w)} 빗나가 땅에 꽂힌다.` } : null; }")
# 회피기동 (a = 피하는 이) 은 첫 case 에서 — 둘째 case 는 닿지 않아 '…undefined — 회피!' 가 나오던 것
rep("    case 'evade': { const b = U(e.b), k = 'v' + e.b; if (!(e.vis || b.side === 0)) return null;",
    "    case 'evade': { if (e.m != null){ if (!(e.vis || U(e.a).side === 0)) return null; return e.m === 'slip' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${n(e.b)}의 일격을 흘려 빠진다!` } : e.m === 'out' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 몰려드는 적들 사이를 빠져나간다.` } : e.m === 'leap' || e.m === 'kite' ? { c: 'dim', s: `${ga(n(e.a))} 거리를 벌린다.` } : null; }   /* v8.7.3 회피기동 */\n"
    "      const b = U(e.b), k = 'v' + e.b; if (!(e.vis || b.side === 0)) return null;")
rep("    case 'evade': if (!(e.vis || U(e.a).side === 0)) return null; return e.m === 'slip' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${n(e.b)}의 일격을 흘려 빠진다!` } : e.m === 'out' ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 몰려드는 적들 사이를 빠져나간다.` } : e.m === 'leap' || e.m === 'kite' ? { c: 'dim', s: `${ga(n(e.a))} 거리를 벌린다.` } : null;   // v7.15\n", "")
rep("{ melee: '일격', shot: '사격', arc: '곡사', jav: '투창' }[e.how] || e.how", "{ melee: '일격', shot: '사격', arc: '곡사', jav: '투창', charge: '돌진', leap: '도약', spin: '회전 도끼', sweep: '휘두르기' }[e.how] || '공격'")
# 받침
rep("(${n(e.b)}을(를) 계속 겨눔)", "(${reul(n(e.b))} 계속 겨눔)")
rep("정찰 중 홀로 있는 ${n(e.b)}를 봄", "정찰 중 홀로 있는 ${reul(n(e.b))} 봄")
rep("${NPC[e.npc].who} 을(를) 발견", "${reul(NPC[e.npc].who)} 발견")
rep("${n(e.a)} ${n(e.b)}가 안 보인 채", "${n(e.a)} — ${ga(n(e.b))} 안 보인 채")
rep("${n(e.a)}이(가) ${coord(e.x, e.y)}로 부름", "${ga(n(e.a))} ${ro(coord(e.x, e.y))} 부름")
rep("${n(e.a)} ${n(e.b)}를 놓침", "${n(e.a)} — ${reul(n(e.b))} 놓침")
rep("밤. 망자 ${Wd.units.filter(u => u.side === 1).length}이 어둠", "밤. 망자 ${ga(String(Wd.units.filter(u => u.side === 1).length))} 어둠")
rep("오랜 대치 끝에 ${who}이 먼저 움직인다!", "오랜 대치 끝에 ${ga(who)} 먼저 움직인다!")
rep("`${C[0].chargeName}은 ", "`${C[0].chargeName + (jong(C[0].chargeName) ? '은' : '는')} ")
rep("${L.map(u => u.name).join(' · ')} 을(를) 두고 갈까요?", "${reul(L.map(u => u.name).join(' · '))} 두고 갈까요?")
rep("${RELIC8[k].name} 을(를) 잃었다", "${reul(RELIC8[k].name)} 잃었다")
rep("${p.name} 을(를) 떠나보낼까요?", "${reul(p.name)} 떠나보낼까요?")
rep("${o.name}이(가) 날아와 ${e.name}와(과) 부딪힘", "${ga(o.name)} 날아와 ${wa(e.name)} 부딪힘")
rep("슬라임 ${left.length}이 하나로", "슬라임 ${ga(String(left.length))} 하나로")
rep("너희는 지금까지 ${kills} 을(를) 죽였어", "너희는 지금까지 ${kills}명을 죽였어")
rep("${e.what}을(를)", "${reul(e.what)}", 3)
rep("'모루 — ' + n(e.b) + '를 붙듦'", "'모루 — ' + reul(n(e.b)) + ' 붙듦'")
rep("'⚓ 모루 — ' + esc(Wd.units[u.hm.b].name) + '를 붙", "'⚓ 모루 — ' + esc(reul(Wd.units[u.hm.b].name)) + ' 붙")
rep("a.weapon && a.weapon !== '맨손' ? a.weapon + '을' : '거대한 팔을'", "a.weapon && a.weapon !== '맨손' ? reul(a.weapon) : '거대한 팔을'")
rep("우리가 먼저 보았다 — ${iga(nm(c0.a))} 어둠 속의 ${nm(c0.b)}를.", "우리가 먼저 보았다 — ${iga(nm(c0.a))} 어둠 속의 ${reul(nm(c0.b))}.")
# 소수 · 영어 · 기호 · 띄어쓰기
rep("case 'heal': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 치유 +${e.amt} (", "case 'heal': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 치유 +${Math.round((+e.amt || 0) * 10) / 10} (")
rep("의 상처를 돌본다 (+${e.amt}).", "의 상처를 돌본다 (+${Math.round((+e.amt || 0) * 10) / 10}).")
rep("const n = i => Wd.units[i].name, out = [], T = e => padW(f2(e.t) + '초', 8);",
    "const n = i => Wd.units[i].name, out = [], T = e => { const s = padW(f2(e.t) + '초', 8); return / $/.test(s) ? s : s + ' '; };   /* v8.7.3 100초가 넘어도 띄어 씀 */\n"
    "  let DT = null; const dieT = i => { if (!DT){ DT = {}; for (const x of Wd.log) if (x.k === 'die' && DT[x.b] == null) DT[x.b] = x.t; } return DT[i]; };   /* v8.7.3 그때 이미 쓰러졌나 (나간 이는 쓰러짐이 아님) */")
rep("{ move: '이동', amove: '공격 이동', attack: '공격', charge: '돌진', throw: '투창', pick: '줍기', line: '전열', hold: '제자리', leap: '도약' }[e.o] || e.o",
    "{ move: '이동', amove: '공격 이동', attack: '공격', charge: '돌진', throw: '투창', pick: '줍기', line: '전열', hold: '제자리', leap: '도약', exit: '출구로', spec: '고유 기술', specCancel: '고유 기술', alt: '무기 바꾸기', swap: '바꿔 들기', scout: '정찰', assn: '암살', supp: '견제 사격', watch: '사주경계', flare: '횃불 던지기', torchGet: '횃불 줍기', flank: '우회', lret: '전열 후퇴', skill: '치료' }[e.o] || '다른'")
rep("const g = gap(u, t), q = [`간격 ${g.toFixed(1)}칸`];", "const g = gap(u, t), q = [g <= 0.05 ? '맞붙음' : `간격 ${g.toFixed(1)}칸`];")
rep("[체력 ${Math.round(t.hp / t.max * 100)}% · 간격 ${gap(u, t).toFixed(1)}칸]", "[체력 ${Math.round(t.hp / t.max * 100)}% · ${gap(u, t) <= 0.05 ? '맞붙음' : '간격 ' + gap(u, t).toFixed(1) + '칸'}]")
rep("🚪 ${e.room ? e.room + ' 방' : ''} 지킴이 ${e.n} 덮침", "🚪 ${e.room ? String(e.room).replace(/^R/, '') + '번 방 ' : ''}지킴이 ${e.n}명 덮침")
rep("  if (a.k === 'bagAmmo') return `가방에서 탄을 꺼내는 중 (${f2(a.left)}초)`;", "  if (a.k === 'bagAmmo') return `가방에서 탄을 꺼내는 중 (${f2(a.left)}초)`;\n  if (a.k === 'altSwap') return `무기를 바꿔 드는 중 (${f2(a.left)}초)`;   /* v8.7.3 '공격 준비 → ?' 이던 것 */")
rep("return a.k === 'heal' ? `치유 준비 → ${b ? b.name : '?'} (${f2(a.left)}초 뒤)` : `공격 준비 → ${b ? b.name : '?'} (",
    "return a.k === 'heal' ? `치유 준비${b ? ' → ' + b.name : ''} (${f2(a.left)}초 뒤)` : `공격 준비${b ? ' → ' + b.name : ''} (")
rep("${e.a !== e.b && !Wd.units[e.a].alive ? ' (' + n(e.a) + (jong(n(e.a)) ? '은' : '는') + ' 이미 쓰", "${e.a !== e.b && dieT(e.a) != null && dieT(e.a) <= e.t ? ' (' + n(e.a) + (jong(n(e.a)) ? '은' : '는') + ' 이미 쓰")
rep("${o ? o.name + '의 것' + (o.alive || o.down ? '' : ' (쓰러짐)') : ''}", "${o ? o.name + '의 것' + ((e.snap || []).some(q => q.i === it.owner && !q.alive) ? ' (쓰러짐)' : '') : ''}")
# 목이 꿰뚫림 (총 · 화살 · 찌름)
rep("throat: '목이 베임', ", "throat: '목이 베임', throatP: '목이 꿰뚫림', ", 1)
rep("decap: 1.7, throat: 1.6, ", "decap: 1.7, throat: 1.6, throatP: 1.5, ")
rep("if (k === 'throat' || k === 'neck' || k === 'assn'){", "if (k === 'throat' || k === 'throatP' || k === 'neck' || k === 'assn'){")
rep("  throat: (A, B) => `${B}의 목이 베인다 — 피를 쏟으며 쓰러진다.`,", "  throat: (A, B) => `${B}의 목이 베인다 — 피를 쏟으며 쓰러진다.`,\n  throatP: (A, B) => `${B}의 목이 꿰뚫린다 — 피를 쏟으며 쓰러진다.`,")
# 탄이 떨어져도 가방에 있으면 맨손이 아님
rep("case 'ammoOut': return U(e.a).side === 0 ? { c: 'bad', s: `${n(e.a)}의 탄약이 떨어졌다. 이제 맨손이다.` }",
    "case 'ammoOut': return e.bag > 0 ? (U(e.a).side === 0 ? { c: 'dim', s: `${n(e.a)}의 ${shotNm(Wd, U(e.a)) === '화살' ? '화살통이' : '탄창이'} 비었다 — 가방에서 꺼내 채운다.` } : null) : U(e.a).side === 0 ? { c: 'bad', s: `${n(e.a)}의 탄약이 떨어졌다. 이제 맨손이다.` }")
# 대사의 그림: 이름만 있는 줄도 그 인물의 그림 (세르파 · 하딤 …)
rep("{ t: '여긴 내 왕국이야. 나가.', name: '세르파' }", "{ t: '여긴 내 왕국이야. 나가.', name: '세르파', who: 'C-277' }")
rep("{ t: '오랜만에 위로 올라온 먹잇감이군.', name: '하딤' }", "{ t: '오랜만에 위로 올라온 먹잇감이군.', name: '하딤', who: 'C-201' }")
rep("  const hero = (S.units.find(u => u.side === 0 && u.hero) || {}).ref || 'C-001', ally = L.who ?",
    "  if (!L.who && !L.img && !L.narr && !L.box && L.name && !N && TALK_WHO[L.name]) L.who = TALK_WHO[L.name];   /* v8.7.3 이름만 있는 대사 줄 → 그 인물의 그림 */\n"
    "  const hero = (S.units.find(u => u.side === 0 && u.hero) || {}).ref || 'C-001', ally = L.who ?")
rep("function talkShow(){", "// v8.7.3 이름만 있는 대사 줄의 인물 (그림 · 도감 얼굴)\nconst TALK_WHO = { '세르파': 'C-277', '하딤': 'C-201', '간호사장': 'C-095', '단달로': 'C-058', '두건': 'C-171', '랑팡': 'C-207', '로지나': 'C-028', '마리': 'C-022', '배신자 셰도르': 'C-219', '아이텐': 'C-033', '아해': 'C-082', '왐': 'C-020', '콜라이더': 'C-175', '테헤라': 'C-016', '페흐토': 'C-108' };\nfunction talkShow(){")
# 전리품: 쓸 사람이 없으면 나누지 않음 · 주인 있는 무기는 주인에게 · 정산은 전리품 탭부터
rep("  for (const p of PL){ if (lootWhy(p, it)) continue; let s = -((p.bag || []).length) * 0.3;",
    "  for (const p of PL){ if (lootWhy(p, it)) continue; let s = -((p.bag || []).length) * 0.3; if (it.own && it.own === (p.ref || ('#' + p.name))) s += 50;   /* v8.7.3 주인에게 */")
rep("    if (s > bs){ bs = s; best = p; } }\n  return best;\n}", "    if (s > bs){ bs = s; best = p; } }\n  return bs > 0.5 ? best : null;   /* v8.7.3 쓸 사람이 없으면 억지로 나누지 않음 (활 → 소총수 등) */\n}")
rep("crCtx = { rows, party, W }; crTab = 'sum'; const nL = W ? lootOf(W).filter(x => !x.taken).length : 0, nG = rows.filter(r => r.grow && r.grow.length).length;",
    "crCtx = { rows, party, W }; crTab = 'sum'; const nL = W ? lootOf(W).filter(x => !x.taken).length : 0, nG = rows.filter(r => r.grow && r.grow.length).length; if (nL) crTab = 'loot';   /* v8.7.3 남은 전리품이 있으면 전리품부터 (못 보고 넘어가던 것) */")
rep("<button type=\"button\" data-crt=\"sum\" class=\"on\">정산", "<button type=\"button\" data-crt=\"sum\"${crTab === 'sum' ? ' class=\"on\"' : ''}>정산")
rep("<button type=\"button\" data-crt=\"loot\">전리품", "<button type=\"button\" data-crt=\"loot\"${crTab === 'loot' ? ' class=\"on\"' : ''}>전리품")
rep("    for (const it of Wd.items || []) if ((it.k === 'weapon' || it.k === 'shield') && it.own === ownKey(u) && !(it.k === 'weapon' && it.name === p.weapon && !u.wBroken) && !(it.k === 'shield' && p.shield)) bagPut(p, {",
    "    for (const it of Wd.items || []) if ((it.k === 'weapon' || it.k === 'shield') && it.own === ownKey(u) && !(it.k === 'weapon' && it.name === p.weapon && !u.wBroken) && !(it.k === 'shield' && p.shield)) bagPutOwn(p, {")
rep("function bagPut(p, it){", "// v8.7.3 제 것 (던진 단검 · 바꿔 들며 내려놓은 무기) 은 가방이 가득해도 돌아옴\nfunction bagPutOwn(p, it){ const r = bagPut(p, it); if (r){ const { taken, auto, ...o } = it; (p.bag = p.bag || []).push(o); } return 0; }\nfunction bagPut(p, it){")
# 유물: 간호사장 모자 (+2 는 한 번만) · 록토 로브 (은신 E 도)
rep("if (r8Has('rokto')) for (const p of party){ const cur = (p.traits || []).find(t => /^은신[SABCD]$/.test(t)); const up = { D: 'C', C: 'B', B: 'A', A: 'S', S: 'S' }",
    "if (r8Has('rokto')) for (const p of party){ const cur = (p.traits || []).find(t => /^은신[SABCDE]$/.test(t)); const up = { E: 'D', D: 'C', C: 'B', B: 'A', A: 'S', S: 'S' }")
rep("if (r8Has('nurse')) for (const p of party) if (p.skill && p.skill.pool){ const s0 = p.skill.pool; p.skill.pool += 2; if (p.skLeft != null) p.skLeft += 2; undo.push(() => { p.skill.pool = s0; }); }",
    "if (r8Has('nurse')) for (const p of party) if (p.skill && p.skill.pool){ const s0 = p.skill.pool; p.skill.pool += 2; if (!p.nurse2){ p.nurse2 = true; if (p.skLeft != null) p.skLeft += 2; } undo.push(() => { p.skill.pool = s0; }); }   /* v8.7.3 남은 약 +2 는 한 번만 (맵마다 쌓이던 것) */\n"
    "  for (const p of party) if (p.skill && p.skill.pool && p.skLeft != null && p.skLeft > p.skill.pool) p.skLeft = p.skill.pool;   /* v8.7.3 쌓였던 약은 최대까지 */")
# 30층 무리: 1층 설계 (C-052 ~ C-056 · 똥개) 를 도감의 다른 인물로
rep("band: [['똥개', 3], ['굴 개', 1.5],", "band: [['굴 개', 3], ['들쥐', 1.5],")
rep("band: [['검사', 2], ['창병', 2], ['검방패병', 1.5], ['붉은 망토 궁수', 1], ['광신도', 1.5], ['낙오 방랑자', 1.5], ['곤봉 거한', 0.6], ['샷건병', 0.5]]",
    "band: [['적기사', 2], ['창병2', 2], ['방패곤봉', 1.5], ['저격총수', 0.8], ['광신도', 1.5], ['낙오 방랑자', 1.5], ['철의 잔재', 0.6], ['샷건병', 0.5]]")
rep("['곤봉 거한', 1.5], ['흑우', 0.8], ['검방흑기사', 1], ['보라빛 대낫 괴수', 1], ['붉은 망토 궁수', 1.5]", "['철의 잔재', 1.5], ['흑우', 0.8], ['검방흑기사', 1], ['보라빛 대낫 괴수', 1], ['저격총수', 1.5]")
rep("['괴수 A', 'C-070', 3, { weapon: '이빨·발톱',", "['괴수 A', 'C-070', 3, { name: '동굴 괴수', weapon: '이빨·발톱',")

# ---------- (v1.4) 화살통 · 탄 크기 = 설계 (남은 탄과 따로) ----------
# 정산 때 남은 탄만 적어 다음 맵의 크기가 줄던 것 (트라카 60 → 13 · 6 · 5) — 크기 (ammoMax) 를 따로 적고, 옛 저장은 설계 (같은 무기) 또는 무기 기본 탄으로 되살림
rep("function fix872(p){",
    "// v8.7.3 화살통 · 탄 크기 (ammoMax) — 남은 탄 (ammo) 과 따로. 옛 저장은 설계 (같은 무기) 또는 무기 기본 탄으로\n"
    "function ammoCapOf(p){ const w = (S.rules.weapons || rules.weapons || {})[p.weapon] || {}; if (!isRangedW(w)) return null; const d = p.ref ? designList().find(x => x.ref === p.ref && x.weapon === p.weapon && x.ammo != null && x.ammo !== '') : null; return Math.max(Math.round(+p.ammo) || 0, d ? Math.round(+d.ammo) || 0 : Math.round(+w.ammo) || 0); }\n"
    "function fix873(p){ if (!p || (p.side || 0) !== 0 || p.ammo == null || p.ammo === '' || p.ammoMax != null) return; const c = ammoCapOf(p); if (c != null) p.ammoMax = c; }\n"
    "function fix872(p){")
rep("S.units.forEach(fix872);   /* v8.7.2 */", "S.units.forEach(fix872);   /* v8.7.2 */\n  S.units.forEach(fix873);   /* v8.7.3 화살통 크기 */")
rep("delete p.wOwn; delete p.ammo; if (p.natRng != null){ p.ov = p.ov || {}; p.ov.rng = p.natRng; } }",
    "delete p.wOwn; delete p.ammo; delete p.ammoMax; if (p.natRng != null){ p.ov = p.ov || {}; p.ov.rng = p.natRng; } }")
rep("    else if (!u.weaponGone && !nat){ if (u.weapon !== p.weapon){",
    "    else if (!u.weaponGone && !nat && p.alt && u.alt && u.alt.name === p.weapon && u.weapon === p.alt.name){ if (u.alt.ammo != null) p.ammo = Math.max(0, u.alt.ammo); if (u.alt.ammoMax != null) p.ammoMax = u.alt.ammoMax; }   /* v8.7.3 두 번째 총 (샷건) 을 든 채 끝남 — 원래 총으로 돌려 둠 (권총을 잃고 둘 다 샷건이 되던 것) */\n"
    "    else if (!u.weaponGone && !nat){ if (u.weapon !== p.weapon){")
rep("      if (u.ammoMax != null) p.ammo = Math.max(0, u.ammo || 0); }",
    "      if (u.ammoMax != null){ p.ammo = Math.max(0, u.ammo || 0); p.ammoMax = u.ammoMax; } }   /* v8.7.3 화살통 크기도 따로 */")
rep("if (!p.role || p.role === '사수') p.role = '공격수'; delete p.ammo;", "if (!p.role || p.role === '사수') p.role = '공격수'; delete p.ammo; delete p.ammoMax;")
rep("delete p.wOwn; delete p.ammo; return it; }", "delete p.wOwn; delete p.ammo; delete p.ammoMax; return it; }")
rep("&& it.ammo != null) p.ammo = it.ammo; else delete p.ammo; if (p.ov) delete p.ov.rng; return old; }",
    "&& it.ammo != null) p.ammo = it.ammo; else delete p.ammo; delete p.ammoMax; if (p.ov) delete p.ov.rng; return old; }")
rep("else p.ammo = Math.max(0, Math.round(+v)); changed(); return; }", "else p.ammo = Math.max(0, Math.round(+v)); delete p.ammoMax; changed(); return; }")
# 노라: '모두 탄 가득' 이 판 밖의 동료에겐 아무것도 안 하던 것 (쓰이지 않는 ammoLeft) — 화살통 크기까지 채움 · 판 안이면 두 번째 총도
rep("for (const p of R.party) if (p.ammo) p.ammoLeft = p.ammo;",
    "for (const p of R.party) if (p.ammo != null && p.ammo !== ''){ fix873(p); if (p.ammoMax != null) p.ammo = Math.max(+p.ammo || 0, +p.ammoMax); }   /* v8.7.3 탄 가득 (쓰이지 않던 ammoLeft) */", 2)
rep("if (world && world.r8) for (const u of world.units) if (u.side === 0 && u.ammoMax) u.ammo = u.ammoMax;",
    "if (world && world.r8) for (const u of world.units) if (u.side === 0 && u.alive){ if (u.ammoMax) u.ammo = u.ammoMax; const pa = (S.units.find(x => x.id === u.pid) || {}).alt; if (u.alt && pa && pa.name === u.alt.name && pa.ammo != null) u.alt.ammo = Math.max(u.alt.ammo || 0, +pa.ammo); }")

# 원거리 무기 가리기: 이름 글자 (활 · 총 …) 로 보던 것 → 무기 표 (단궁 · 하얀 나무 가 근접으로 잡혀 활 전리품 · 노라의 총 손질에서 빠지던 것)
rep("const isFarD = p => /활|총|저격|소총|권총|마법/.test(p.weapon || '');",
    "// v8.7.3 원거리 무기인가 — 무기 표로 (이름 글자로 보면 단궁 · 하얀 나무 가 빠짐). 표에 없는 이름만 글자로\n"
    "function farW(w){ const wp = (S.rules.weapons || rules.weapons || {})[w]; return wp ? isRangedW(wp) : /활|궁|총|저격|마법|석궁/.test(w || ''); }\n"
    "const isFarD = p => farW(p.weapon);")
rep("const lootFar = w => /활|총|저격|소총|권총|마법|석궁/.test(w || '');", "const lootFar = w => farW(w);   /* v8.7.3 무기 표로 */")
rep("R.party.filter(p => /총|활|저격|소총|권총/.test(p.weapon || ''))", "R.party.filter(p => farW(p.weapon))", 2)

# ---------- (v1.5) 처음 배치 · 대기 화면 · 카메라 ----------
# 처음 배치: 대장 (주인공 → 지휘 등급이 높은 이) 둘레 반지름 1.5칸 안 (아홉 칸이 모자라면 이어진 바닥 가운데 가까운 칸) — 30층 · 1층 캠페인 같은 함수
R8IN_OLD = open(D + 'pr873/r8placein_old.txt', encoding='utf-8').read()
rep(R8IN_OLD,
    "function r8PlaceIn(m, units, inn){   // 들어서는 곳의 바닥 칸 → 대장 둘레에 모여 섬 (v8.7.3 — 넓은 칸에 흩어져 5 ~ 8칸 벌어지던 것) · 바닥이 없으면 그 가운데에서 가까운 바닥\n"
    "  const ok = (x, y) => x >= 0 && y >= 0 && x < m.W && y < m.H && m.t[y * m.W + x] === 0, inR = [];\n"
    "  for (let y = inn[1]; y <= inn[3]; y++) for (let x = inn[0]; x <= inn[2]; x++) if (ok(x, y)) inR.push([x, y]);\n"
    "  if (!inR.length){ const cx = Math.floor((inn[0] + inn[2]) / 2), cy = Math.floor((inn[1] + inn[3]) / 2), seen = new Set([cx + ',' + cy]), q = [[cx, cy]];\n"
    "    for (let i = 0; i < q.length && !inR.length; i++){ const [x, y] = q[i]; if (ok(x, y)){ inR.push([x, y]); break; } for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k) || nx < 0 || ny < 0 || nx >= m.W || ny >= m.H) continue; seen.add(k); q.push([nx, ny]); } } }\n"
    "  packPlace(m, units, inR);\n"
    "}\n"
    "// v8.7.3 처음 배치: 대장 (주인공 → 지휘 등급이 높은 이 → 맨 앞) 을 둘레가 가장 트인 칸 (같으면 무작위) 에, 나머지는 대장에게서 가까운 칸부터 (이어진 바닥 · 모서리를 자르지 않음) — 반지름 1.5칸 안\n"
    "function leadPick(units){ const g = p => { const t = (p.traits || []).find(x => /^지휘[SABCDE]$/.test(x)); return t ? 'EDCBAS'.indexOf(t.slice(-1)) + 1 : 0; }; return units.find(p => p.hero) || units.slice().sort((a, b) => g(b) - g(a))[0] || null; }\n"
    "function packPlace(m, units, cells){\n"
    "  const ok = (x, y) => x >= 0 && y >= 0 && x < m.W && y < m.H && m.t[y * m.W + x] === 0, C = (cells || []).filter(([x, y]) => ok(x, y)); if (!units.length || !C.length) return;\n"
    "  const inC = new Set(C.map(c => c + '')), room = ([x, y]) => { let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (ok(x + dx, y + dy)) n += inC.has((x + dx) + ',' + (y + dy)) ? 1 : 0.4; return n; }, top = Math.max(...C.map(room)), T = C.filter(c => room(c) >= top - 1e-9), a0 = T[Math.floor(Math.random() * T.length)];   /* 들어서는 곳 안에서 둘레가 가장 트인 칸 */\n"
    "  const seen = new Set([a0 + '']), q = [[a0[0], a0[1], 0]], near = [];\n"
    "  for (let i = 0; i < q.length; i++){ const [x, y, st] = q[i]; near.push([x, y]); if (st >= 6) continue; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]){ const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k) || !ok(nx, ny) || (dx && dy && !(ok(x + dx, y) && ok(x, y + dy)))) continue; seen.add(k); q.push([nx, ny, st + 1]); } }\n"
    "  near.sort((p, q) => (inC.has(p + '') ? 0 : 1) - (inC.has(q + '') ? 0 : 1) || Math.hypot(p[0] - a0[0], p[1] - a0[1]) - Math.hypot(q[0] - a0[0], q[1] - a0[1]));   /* 들어서는 곳 안의 칸 먼저 */\n"
    "  const L = leadPick(units), order = L ? [L, ...units.filter(u => u !== L)] : units.slice();\n"
    "  order.forEach((u, i) => { const c = near[Math.min(i, near.length - 1)], j = i >= near.length ? 0.3 : 0; u.x = c[0] + 0.5 + (Math.random() - 0.5) * j; u.y = c[1] + 0.5 + (Math.random() - 0.5) * j; });\n"
    "}\n")
# 1층 캠페인도 (적은 그대로 흩어 놓음)
rep("function campPlace(m, units, y0, y1, x0, x1){",
    "// v8.7.3 우리 편은 띠 안에서 대장 둘레로 모여 (packPlace)\nfunction campPack(m, units, y0, y1, x0, x1){ const C = []; for (let y = Math.max(0, Math.floor(y0)); y < Math.min(m.H, Math.ceil(y1)); y++) for (let x = Math.max(1, Math.floor(x0)); x < Math.min(m.W - 1, Math.ceil(x1)); x++) if (m.t[y * m.W + x] === 0) C.push([x, y]); if (C.length) packPlace(m, units, C); else campPlace(m, units, y0, y1, x0, x1); }\n"
    "function campPlace(m, units, y0, y1, x0, x1){")
rep("  if (S.regina && up) campPlace(m, party, 3.4, 6, 9, 15); else", "  if (S.regina && up) campPack(m, party, 3.4, 6, 9, 15); else")
rep("  if (HL && !up) campPlace(m, party, S.H - 4, S.H - 0.5, 8, 20); else", "  if (HL && !up) campPack(m, party, S.H - 4, S.H - 0.5, 8, 20); else")
rep("  campPlace(m, party, up ? 0.5 : S.H - 3, up ? 3 : S.H - 0.5,", "  campPack(m, party, up ? 0.5 : S.H - 3, up ? 3 : S.H - 0.5,")
# 시작 흔들기: 여정에선 대장은 그대로 · 나머지는 0.35칸 안 · 대장에게서 1.6칸 (원래 더 멀면 그만큼) 을 넘지 않게
rep("  const IN = typeof run8On === 'function' && run8On() && S.art8 && typeof MAPS8 !== 'undefined' && MAPS8[S.art8] ? MAPS8[S.art8].in : null;   // 여정: 들어선 곳 안에서만\n  for (const u of W.units){ if (u.side !== 0 || !u.alive || u.gone) continue;\n    for (let k = 0; k < 10; k++){ const a = Math.random() * 6.283, r = START_JIT * Math.sqrt(Math.random()),",
    "  const IN = typeof run8On === 'function' && run8On() && S.art8 && typeof MAPS8 !== 'undefined' && MAPS8[S.art8] ? MAPS8[S.art8].in : null;   // 여정: 들어선 곳 안에서만\n  const A = S.camp && typeof ancOf === 'function' ? ancOf(W) : null, JR = A ? 0.35 : START_JIT;   /* v8.7.3 여정: 대장 둘레에 모인 채로 (대장은 그대로) */\n  for (const u of W.units){ if (u.side !== 0 || !u.alive || u.gone || u === A) continue; const d0 = A ? Math.max(1.6, Math.hypot(u.x - A.x, u.y - A.y)) : 0;\n    for (let k = 0; k < 10; k++){ const a = Math.random() * 6.283, r = JR * Math.sqrt(Math.random()),")
rep("      if (IN && !(x >= IN[0] && x <= IN[2] + 1 && y >= IN[1] && y <= IN[3] + 1)) continue;",
    "      if (IN && !(x >= IN[0] && x <= IN[2] + 1 && y >= IN[1] && y <= IN[3] + 1)) continue;\n      if (A && Math.hypot(x - A.x, y - A.y) > d0) continue;")
# 대기 화면 (⟲ 맵 처음부터 → 배치 화면) 에서도 여정은 배치를 고칠 수 없음 — 끌기 · 지우기 · 놓기 · 배치 칸
rep("  if (mode === 'edit' && tool === 'select'){ const u = unitAt(preview, w.x, w.y, true); if (u) pd.unit = u.pid; }\n});",
    "  if (mode === 'edit' && tool === 'select'){ const u = unitAt(preview, w.x, w.y, true); if (u && !campLock()) pd.unit = u.pid; else if (u) pd.lockU = true; }   /* v8.7.3 여정에선 처음 자리를 옮기지 않음 */\n});")
rep("  if (mode === 'edit'){ if (d.right) editErase(w); else editClick(w); } else if (d.touch) touchTap(w);",
    "  if (mode === 'edit' && campLock() && (d.right || tool !== 'select')){ campLockSay(); return; }   /* v8.7.3 */\n  if (mode === 'edit'){ if (d.right) editErase(w); else editClick(w); } else if (d.touch) touchTap(w);")
rep("  if (d.long) return;   // 길게 누름 = 상세정보만 (배치 중)",
    "  if (d.long) return;   // 길게 누름 = 상세정보만 (배치 중)\n  if (d.lockU && d.moved) campLockSay();")
rep("function lockUI(on){ $('lockMsg').hidden = !on;",
    "// v8.7.3 여정 (프롤로그 · 30층) 은 처음 자리를 고칠 수 없음 — 대장 둘레에서 시작 (인카운터 시험은 그대로)\n"
    "function campLock(){ return !!(S.camp && !S.camp.end && !S.camp.test); }\n"
    "let campLockT = 0; function campLockSay(){ const n = performance.now(); if (n - campLockT < 3000) return; campLockT = n; toast('여정에선 처음 자리를 고칠 수 없어요 — 대장 둘레에서 시작해요'); }\n"
    "function lockUI(on){ $('lockMsg').textContent = on && mode === 'edit' && campLock() ? '여정에선 처음 자리를 고칠 수 없어요 — 대장 둘레에서 시작해요. ▶ 전투 시작으로 다시 해요.' : '싸우는 중에는 배치를 바꿀 수 없어요. ⟲ 처음으로를 누르면 다시 고칠 수 있어요.'; $('lockMsg').hidden = !on;")
rep("  closeRing(); mode = 'edit'; world = null; cont = false; paused = false; if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); }); $('banner').hidden = true; lockUI(false);",
    "  closeRing(); mode = 'edit'; world = null; cont = false; paused = false; if (MOB) requestAnimationFrame(() => { layoutMob(); mobFit(); }); $('banner').hidden = true; lockUI(campLock());   /* v8.7.3 여정은 배치 칸도 잠금 */")
# 카메라: 손으로 확대 · 축소해도 따라가기는 그대로 · 끌어서 둘러보면 잠깐 멈춤 → 10초 손대지 않으면 다시 따라가고 원래 배율로 천천히
rep("function zoom(k){ camUser(); cam.z = Math.min(4, Math.max(0.45, cam.z * k)); }",
    "function zoom(k){ camUser(); camMark(); cam.z = Math.min(4, Math.max(0.45, cam.z * k)); }")
rep("camUser(); pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: cam.z, w0: toWorld(mx, my) }; cam.follow = false; return; }",
    "camUser(); camMark(); pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: cam.z, w0: toWorld(mx, my) }; return; }   /* v8.7.3 집기 (확대) 로는 따라가기를 끄지 않음 */")
rep("    cam.x = pinch.w0.x - (mx - r.left - r.width / 2) / ts; cam.y = pinch.w0.y - (my - r.top - r.height / 2) / ts; return;",
    "    cam.x = pinch.w0.x - (mx - r.left - r.width / 2) / ts; cam.y = pinch.w0.y - (my - r.top - r.height / 2) / ts; CD.userT = performance.now(); return;")
rep("const ts = TS * cam.z; cam.x = pd.cx - (e.clientX - pd.x) / ts; cam.y = pd.cy - (e.clientY - pd.y) / ts; cam.follow = false;",
    "const ts = TS * cam.z; cam.x = pd.cx - (e.clientX - pd.x) / ts; cam.y = pd.cy - (e.clientY - pd.y) / ts; if (cam.follow) CD.panOff = true; cam.follow = false; camMark();   /* v8.7.3 10초 뒤 다시 따라감 */")
rep("cam.y = (e.clientY - r.top) / r.height * S.H; cam.follow = false; });",
    "cam.y = (e.clientY - r.top) / r.height * S.H; if (cam.follow) CD.panOff = true; cam.follow = false; camMark(); });")
rep("$('followBtn').addEventListener('click', () => { cam.follow = true; });", "$('followBtn').addEventListener('click', () => { cam.follow = true; CD.panOff = false; });")
rep("  if (k === 'follow'){ cam.follow = !cam.follow;", "  if (k === 'follow'){ cam.follow = !cam.follow; CD.panOff = false;")
rep("function mobFit(){\n", "function mobFit(){\n  CD.homeZ = null; CD.userT = null; CD.panOff = false;   /* v8.7.3 맞춤이 배율을 새로 정함 */\n")
rep("function camUser(off){",
    "// v8.7.3 손으로 확대 · 축소 · 끌기: 처음 배율을 기억 → 10초 손대지 않으면 (끌어서 꺼진) 따라가기를 다시 켜고 그 배율로 천천히\n"
    "function camMark(){ if (CD.homeZ == null) CD.homeZ = cam.z; CD.userT = performance.now(); }\n"
    "function camIdleTick(dt){\n"
    "  if (CD.userT == null || pd || pinch || performance.now() - CD.userT < (FXR.idleMs || 10000)) return;\n"
    "  if (CD.panOff){ CD.panOff = false; if (!small() && !(MOB && zoomAll)) cam.follow = true; }\n"
    "  if (CD.homeZ == null || Math.abs(cam.z - CD.homeZ) < 0.004){ if (CD.homeZ != null) cam.z = CD.homeZ; CD.homeZ = null; CD.userT = null; return; }\n"
    "  cam.z += (CD.homeZ - cam.z) * Math.min(1, dt * 1.6);\n"
    "}\n"
    "function camUser(off){")
rep("  if (Wd && mode !== 'edit') camZoomTick(dt);   /* v7.28.0 다가감 (확대 배율) */",
    "  if (Wd && mode !== 'edit'){ camIdleTick(dt); camZoomTick(dt); }   /* v7.28.0 다가감 (확대 배율) · v8.7.3 10초 뒤 원래 배율 */")
rep("  if (Wd && cam.follow && mode !== 'edit' && !small() && !MOB){", "  if (Wd && cam.follow && mode !== 'edit' && !small() && !MOB && !pinch){")

# 30층 지도 화면에서 훈련장으로 바꾸면 30층 지도가 훈련장 판을 덮은 채 남던 것 — 접고, 스토리로 돌아오면 다시 폄
rep("  applyMode(true); hud(); toast(m === 'story' ? (S.camp ?",
    "  if (m === 'train') r8Hide(); else if (m === 'story') r8Boot();   /* v8.7.3 30층 지도 화면 접기 · 다시 펴기 */\n  applyMode(true); hud(); toast(m === 'story' ? (S.camp ?")

# ---------- (v1.6) 글 남은 것: 지휘관 · 상처 묶음 · 전리품 개수 · 이야기 되풀이 · 치료 도구 · 자기 치료 · 대화 겹침 · 노라 · 세르파 ----------
rep("boss = Wd.units.filter(u => u.side === e.side && u.cmd).sort((a, b) => b.cmd - a.cmd)[0];",
    "boss = e.by != null ? U(e.by) : null;   /* v8.7.3 그때의 지휘관 (판이 끝난 뒤 명단에서 고르면 죽은 이가 '지휘한다') */")
rep("s.wounds && s.wounds.length ? ' · 상처 ' + s.wounds.join(' ') : ''", "s.wounds && s.wounds.length ? ' · 상처 ' + woundTxt(s.wounds) : ''")
rep("${itName(x)}${x.k === 'ammo' && x.n0 ? ' ' + x.n0 : ''} → ${x.taken}", "${itName(x)} → ${x.taken}")   # 이름에 이미 수가 있음 ('화살 39 39' 이던 것)
rep("function narrOf(Wd, e){",
    "// v8.7.3 상처 목록: 같은 것은 묶어 (팔 ×2, 오른팔 파괴) — '팔 팔 오른팔 파괴' · '머리 하나를 잃음 머리 하나를 잃음' 이던 것\n"
    "const woundTxt = L => { const c = new Map(); for (const w of L || []) c.set(w, (c.get(w) || 0) + 1); return [...c].map(([w, n]) => n > 1 ? w + ' ×' + n : w).join(', '); };\n"
    "// v8.7.3 이야기의 되풀이 줄이기: 같은 이가 '몸을 돌린다' 는 6초 · '숨이 차' · '모습도 소리도 끊겼다' 는 20초 · 한 편의 전열 이룸 · 흩어짐은 6초에 한 번 (처음 읽은 차례로 정해 이야기 칸 · 여정 기록이 같음)\n"
    "const NQ = new WeakMap(), NQ_W = { retarget: 6, winded: 20, posLost: 20, lineForm: 6, lineBreak: 6 };\n"
    "function narrQuiet(Wd, e){ const win = NQ_W[e.k]; if (!win || e.t == null) return false; if (NQ.has(e)) return NQ.get(e);\n"
    "  const key = e.k === 'lineForm' || e.k === 'lineBreak' ? 'ln' + e.side : e.k + ':' + e.a, M = Wd._nqM || (Wd._nqM = {}), q = M[key] != null && e.t - M[key] < win; if (!q) M[key] = e.t; NQ.set(e, q); return q; }\n"
    "// v8.7.3 치료 도구 글: 양동이는 옐로의 '양동이 약' 만 — 노먼 · 가윤은 구급상자 · 그 밖은 기술 이름 (딸기 정령술 · 슬라임 치유)\n"
    "const healTool = u => { const K = u && u.skill; if (!K) return ''; if (!K.kit && /양동이/.test(K.name || '')) return '양동이'; if (!K.name || /응급처치|지혈|구급/.test(K.name)) return '구급상자'; return K.name; };\n"
    "const healRun = (u, b) => { const t = healTool(u); return t === '양동이' || t === '구급상자' ? `${reul(t)} 들고 ${b}에게 달려간다!` : `${b}에게 달려간다${t ? ' — ' + t : ''}!`; };\n"
    "const healPour = (u, who) => { const t = healTool(u); return t === '양동이' ? `쓰러져 가는 ${who}에게 양동이를 기울인다!` : t === '구급상자' ? `쓰러져 가는 ${who}에게 구급상자를 연다!` : `쓰러져 가는 ${who}에게 ${reul(t || '약')} 쓴다!`; };\n"
    "function narrOf(Wd, e){\n  if (narrQuiet(Wd, e)) return null;")
rep("'응급': { c: 'good', s: `${ga(a)} 양동이를 들고 ${b}에게 달려간다!` }", "'응급': { c: 'good', s: `${ga(a)} ${healRun(U(e.a), b)}` }")
rep("if (e.skill) return e.auto && a.side === 0 ? { c: 'good', s: `${ga(a.name)} 쓰러져 가는 ${e.a === e.b ? '자기 몸' : b.name}에게 양동이를 기울인다!` } : null;",
    "if (e.skill) return e.auto && a.side === 0 ? { c: 'good', s: `${ga(a.name)} ${healPour(a, e.a === e.b ? '자기 몸' : b.name)}` } : null;")
rep("const hl = al.filter(u => u.healed > 0).sort((a, b) => b.healed - a.healed)[0]; if (hl) out.push(`${iga(hl.name)} 동료의 상처를 ${Math.round(hl.healed)} 만큼 메웠다.`);",
    "const hO = u => u.healed - (u.healedSelf || 0), hl = al.filter(u => hO(u) > 0).sort((a, b) => hO(b) - hO(a))[0]; if (hl) out.push(`${iga(hl.name)} 동료의 상처를 ${Math.round(hO(hl))} 만큼 메웠다.`);   /* v8.7.3 자기 치료는 빼고 */")
# 대화가 열려 있거나 막 닫힌 때 (0.45초) 또 누르면 겹쳐 열리던 것 (대장장이 대화가 0.3초에 세 번)
rep("let TK = null;", "let TK = null, talkShutT = 0;   /* v8.7.3 막 닫힌 때 */")
rep("function talkClose(){ if (!TK) return; clearInterval(TK.timer); const pv = TK.prev; TK = null;", "function talkClose(){ if (!TK) return; clearInterval(TK.timer); const pv = TK.prev; TK = null; talkShutT = performance.now();")
rep("function encTalk(E){\n", "function encTalk(E){\n  if (TK || performance.now() - talkShutT < 450) return;   /* v8.7.3 대화가 열려 있거나 막 닫힘 */\n")
# 노라: 메모 같은 글 → 이야기 글
rep("seen: '그림자가 일어선다. 검은 꼬리 — 상인 노라다. (싸움 동안 어디 있었는지 모른다)'", "seen: '그림자가 일어선다. 검은 꼬리 — 상인 노라다. 싸우는 내내 어디 숨어 있었는지, 아무도 보지 못했다.'")
rep("logEv(W, { k: 'r8', s: `${MNPC8[E.r8].who} — 숨어 있다가 나온다`, c: 'dim', vis: true });", "logEv(W, { k: 'r8', s: `${ga(MNPC8[E.r8].who)} 어둠 속에서 걸어 나온다.`, c: 'dim', vis: true });")
# 세르파: 조직은 싸우면서 자람 (처음부터 넷이 있는 게 아님)
rep("{ narr: '바닥의 젤리가 일어서서 기사 · 방패 · 저격수 · 치유사가 된다.' }", "{ narr: '바닥의 젤리가 꿈틀댄다 — 모이고 엉기면 기사 · 방패 · 저격수 · 치유사가 된다.' }")

# 여정 맵: 엔진이 들어선 첫 0.3초엔 서로 발견하지 않음 — 대기 화면 (0초) 의 보임 표시도 그에 맞춤 (createWorld 는 camp 를 모르고 셈)
rep("world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0); if (S.camp && !S.camp.end){ world.camp = true; world.over = false; world.result = null; checkEnd(world); }",
    "world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0); if (S.camp && !S.camp.end){ world.camp = true; world.over = false; world.result = null; checkEnd(world); for (const e of world.units) if (e.side === 1){ e.seenBy = world.units.some(a => a.alive && a.side === 0 && canSee(world, a, e)); e.visLog = e.seenBy; } }   /* v8.7.3 0초엔 발견 없음 */")

# 여정 맵은 만들 때부터 camp (엔진이 0초 보임 · 시작 채움을 앎) — 앞서 덧붙인 보임 다시 셈은 엔진이 함
rep("world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0); if (S.camp && !S.camp.end){ world.camp = true; world.over = false; world.result = null; checkEnd(world); for (const e of world.units) if (e.side === 1){ e.seenBy = world.units.some(a => a.alive && a.side === 0 && canSee(world, a, e)); e.visLog = e.seenBy; } }   /* v8.7.3 0초엔 발견 없음 */",
    "world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0, S.camp && !S.camp.end ? { camp: true } : undefined); if (S.camp && !S.camp.end){ world.camp = true; world.over = false; world.result = null; checkEnd(world); }   /* v8.7.3 여정 맵은 만들 때부터 (0초엔 발견 없음 · 가방 탄으로 채우고 시작) */")

# 밀림 기록: 친 것의 무게 (던진 도끼 → 도끼 · 날아와 부딪힌 몸 → 그 몸) · 날아온 것 (산탄 · 흙덩이 · 뿌리) 은 받은 몸 무게만 · 버팀 (poise) 배수 · how 가 없으면 무엇에 밀렸나 (tag)
rep("'팜 버스트': '팜 버스트로 날려 보냄' }[e.how] || '밀침'} ${e.len}칸 (무게 ${Wd.units[e.a].mass} → ${Wd.units[e.b].mass}kg)`); break;",
    "'팜 버스트': '팜 버스트로 날려 보냄' }[e.how] || e.tag || '밀침'} ${e.len}칸 (${(() => { const B = Wd.units[e.b], tm = B.mass + 'kg' + ((B.poise || 1) > 1 ? ' · 버팀 ×' + B.poise : ''); return e.fix ? '받은 몸 ' + tm : (e.via != null ? '날아온 ' + n(e.via) + ' ' : e.wn ? e.wn + ' ' : '무게 ') + (e.am != null ? e.am : Wd.units[e.a].mass) + ' → ' + tm; })()})`); break;   /* v8.7.3 친 것의 무게 */")

# 막고도 쓰러짐: 기록은 '막았으나 버티지 못함' · 이야기는 '막으려 하지만 버티지 못한다'
rep("${e.block ? (e.dmg ? '막힘' : '막아 냄') : '명중'}", "${e.block ? (e.dmg && e.hp <= 0 ? '막았으나 버티지 못함' : e.dmg ? '막힘' : '막아 냄') : '명중'}")
rep("${e.parry ? '받아 낸다' : '막아낸다'} (−${e.dmg}).${e.broke ? ' 자세가 무너진다!' : ''}` };",
    "${e.dmg && e.hp <= 0 ? (e.parry ? '받아 내려' : '막으려') + ' 하지만 버티지 못한다' : e.parry ? '받아 낸다' : '막아낸다'} (−${e.dmg}).${e.broke && e.hp > 0 ? ' 자세가 무너진다!' : ''}` };   /* v8.7.3 막고도 쓰러짐 */")

# 받아 줌 (caught): 기록 · 이야기
rep("      case 'bowl': out.push(`${T(e)}날아가던 ${ga(n(e.b))} ${wa(n(e.c))} 부딪힘 — 둘 다 다침`); break;",
    "      case 'bowl': out.push(`${T(e)}날아가던 ${ga(n(e.b))} ${wa(n(e.c))} 부딪힘 — 둘 다 다침`); break;\n      case 'caught': out.push(`${T(e)}🤝 ${ga(n(e.a))} 밀려난 ${reul(n(e.b))} 받아 줌 — 받쳐 준 동료라 부딪히지 않음 · 넘어지지 않음`); break;   /* v8.7.3 */")
rep("    case 'bowl': return { s: `날아간 ${ga(n(e.b))} ${wa(n(e.c))} 부딪힌다!` };",
    "    case 'bowl': return { s: `날아간 ${ga(n(e.b))} ${wa(n(e.c))} 부딪힌다!` };\n    case 'caught': return { c: U(e.b).side ? '' : 'good', s: `${ga(n(e.a))} 밀려난 ${reul(n(e.b))} 몸으로 받아 준다.` };   /* v8.7.3 */")

# 괴력으로 버팀: 밀림 기록 · 들이받힘 기록
rep("${n(e.a)} → ${n(e.b)} ${{ sweep: '휘둘러 날려 보냄',", "${n(e.a)} → ${n(e.b)} ${e.mt ? '버텨 밀려남' : { sweep: '휘둘러 날려 보냄',")
rep("${e.trained ? ' · 훈련된 방진이 버팀' : e.braced ? ' · 뒤 동료가 받쳐 줌' : ''} · 움찔`); break;",
    "${e.trained ? ' · 훈련된 방진이 버팀' : e.braced ? ' · 뒤 동료가 받쳐 줌' : ''}${e.mt ? ' · 괴력으로 버팀 (휘청 없음)' : ''} · 움찔`); break;")

# 이어진 휘청을 버팀 (ccRes what 'chain')
rep("${e.what === 'stun' ? '휘청이지 않음' : '넘어지지 않음'}", "${e.what === 'stun' ? '휘청이지 않음' : e.what === 'chain' ? '연달아 묶이지 않음 (방금 풀림)' : '넘어지지 않음'}")

# 사수가 막힌 표적 대신 다른 표적 (altAim)
rep("      case 'peel': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 떼어 내러 감 (${n(e.v)}에게 붙어 있음)`); break;",
    "      case 'peel': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 떼어 내러 감 (${n(e.v)}에게 붙어 있음)`); break;\n      case 'altAim': out.push(`${T(e)}🎯 ${n(e.a)} → ${n(e.b)} 다른 표적의 각을 잡음 (${n(e.was)}${jong(n(e.was)) ? '은' : '는'} 동료에게 둘러싸여 사선이 막힘)`); break;   /* v8.7.3 */")

# 머리 주석: v8.7.3 줄에 바로잡기 3 · 4 · 판정 어긋남을 이어 적음
rep(" · 고유 기술 명령 글 · 막힌 공중제비 알림\n     v8.7.2: ",
    " · 고유 기술 명령 글 · 막힌 공중제비 알림 · 바로잡기 3 · 4 — [무장기] (장기 없는 몸) · 붉은암석 · 세르파 보스판 600 · 벽 짓눌림은 밀린 힘만큼 · 회전 투척 도끼 넓게 관통 · 큰 공격 예고에 '!' 하고 비킴 · 마지막 순간 추적 · 샷건 산탄 부채꼴 · 철퇴는 2열 찌르기에서 뺌 · 공중제비는 태세에 막힘 · 화살통 크기 · 맵 시작 채움 · 쏜 것 이름 · 글 묶음 · 별 = 도감 희귀도 · 30층 여정 기록 · 처음 배치 1.5칸 · 대기 화면 잠금 · 시작 0.3초 발견 없음 · 카메라 · 판정 어긋남 아홉 (넉백 무게 · 막아도 즉사 · 받쳐 줌 · 버팀 · 미리 비켜서기 · 기습 · 하나뿐인 창 · 이어진 휘청 · 사수의 다른 표적)\n     v8.7.2: ")

# 막 닫힌 대화 거르기는 누르는 자리에서만 (같은 누름이 닫고 · 또 여는 것만 막음) — 대화 함수는 열려 있을 때만 막음
rep("  if (TK || performance.now() - talkShutT < 450) return;   /* v8.7.3 대화가 열려 있거나 막 닫힘 */",
    "  if (TK) return;   /* v8.7.3 대화가 열려 있으면 (막 닫힌 때는 누르는 자리에서 거름) */")
rep("function encClick(w){ const E = encAll().find(q => encLive(q) && (q.seen || $('seeAll').checked) && Math.hypot(w.x - q.x, w.y - q.y) <= 0.8); if (!E) return false; encTalk(E); return true; }",
    "function encClick(w){ const E = encAll().find(q => encLive(q) && (q.seen || $('seeAll').checked) && Math.hypot(w.x - q.x, w.y - q.y) <= 0.8); if (!E) return false; if (performance.now() - talkShutT >= 450) encTalk(E); return true; }   /* v8.7.3 막 닫은 누름은 다시 열지 않음 */")
rep("  if (b.dataset.ctalk){ encTalk(); return; }   // v7.22", "  if (b.dataset.ctalk){ if (performance.now() - talkShutT >= 450) encTalk(); return; }   // v7.22   /* v8.7.3 막 닫은 누름은 다시 열지 않음 */")

# 늦게 띄우는 것은 건 때의 맵 (world) 이 그대로일 때만 — 새 여정 · 다른 맵으로 넘어가면 버림
rep("function ldAfter(fn, ms){ if (LD) LD.q.push(fn); else setTimeout(fn, ms == null ? 350 : ms); }",
    "function ldAfter(fn, ms){ const w0 = world, g = () => { if (world === w0) fn(); }; if (LD) LD.q.push(g); else setTimeout(g, ms == null ? 350 : ms); }   /* v8.7.3 맵이 바뀌면 앞 맵의 늦은 나레이션 · 알림은 버림 */")
rep("사수의 다른 표적)\n     v8.7.2: ", "사수의 다른 표적) · 대화 다시 열림은 누르는 곳에서만 막음 · 맵이 바뀌면 앞 맵의 늦은 나레이션은 버림\n     v8.7.2: ")

# 휴대폰: 판 탭 뒤따르는 클릭 (고르기로 조작판이 커져 이야기 띠가 그 자리로 옴) 은 빈 곳 탭이 아님
rep("dmTap = null, dockEatT = -1e9;", "dmTap = null, dockEatT = -1e9, cvTapT = -1e9;   /* v8.7.3 판을 탭한 때 */")
rep("cv.addEventListener('pointerup', e => {\n  touches.delete(e.pointerId); clearTimeout(lpT);\n",
    "cv.addEventListener('pointerup', e => {\n  touches.delete(e.pointerId); clearTimeout(lpT); if (e.pointerType === 'touch') cvTapT = performance.now();\n")
rep("  if (performance.now() - dockEatT < 500) return;",
    "  if (performance.now() - cvTapT < 500) return;   /* v8.7.3 판 탭에 뒤따르는 클릭 — 고르면 조작판이 커져 이야기 띠가 탭한 자리로 올라옴 (빈 곳 탭이 아님) */\n  if (performance.now() - dockEatT < 500) return;")
rep("맵이 바뀌면 앞 맵의 늦은 나레이션은 버림\n     v8.7.2: ", "맵이 바뀌면 앞 맵의 늦은 나레이션은 버림 · 휴대폰에서 판 아래쪽 인물을 탭해 고르면 바로 풀리던 것\n     v8.7.2: ")

open(F, 'w', encoding='utf-8').write(s)
print('page8730 OK')
