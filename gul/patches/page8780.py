# v8.7.8 페이지 — page8780.py v1.2 (v1.2: 굿윌 글의 조사 (가/이 · 를/을 — ga · reul) · 빗나간 손바닥의 빈틈은 그 사람 이름으로 · v1.1: 감전 ⚡ 는 모든 판에서 그림 (전엔 적뢰 그림 안에 있어 적뢰 판에서만 보였음) · 보이는 몸만 · 몸 위에 / 아이콘 딱 · 딱딱딱 · ◆푸른 번개 (아이콘 판 44 · 45 — 새로 그림 ico878/mkico.py) / 내려찍기 기록은 상대가 없어도 · v1.0: 굿윌 (명세 C5 — 2D 미궁 프롤로그 그대로) — 설계 · 도감 정체성 · 기술 글 · 기록 · 서술 · 그림 효과 (잔상 · 표식 · 천둥 · 진동 고리) · 기술 명령 칸 ·
#   감전 한 틀 (엔진 zapOn — 적뢰의 감전도 같은 틀 · 표시 ⚡ 푸른 · 붉은 · 주황) · 뽑기 희귀도 (도감 별이 높을수록 드묾 — 5성 0.3 · 6성 0.15 · 7성 0.08)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8770.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.7.7 (2026-10-23)', '<!-- 굴의 전투판 v8.7.8 (2026-10-23)')
rep('     v8.7.7: ', '''     v8.7.8: 굿윌 (명세 C5 — 2D 그대로 · 뽑기에서만 · 5성): 맨손일 때만 — 평소 3 ~ 5칸에서 번개로 괴롭히며 상대의 옆 · 뒤 (사각) 로 팟팟 순간이동 · 치려 하면 이미 뒤로 쓩 ·
         2.6초마다 등 뒤로 파고들어 한두 대 치고 빠짐 · 사각 (등 뒤에서 친 근접은 막지 못함) · 손바닥 (표식 0.45초 — 벗어나면 빗나가고 빈틈) · 니킥 (빈틈이면 헤드샷 60% — 확정 치명 ·
         갑옷 · 막기 무시 · 넘어뜨림) · 딱 · 딱딱딱 (원거리 천둥 — 피하거나 방패로 막을 수 있음 · 갑옷 무시) · 내려찍기 (떠 있는 동안 무적 · 둘레 2.5칸) · 올려차기 · 싸움을 시작할 때 기술마다 대기 (2D).
         감전 한 틀 (푸른 번개 · 적뢰 · 잔류 — 1초마다 피해 × 중첩 · 최대 5). 뽑기 희귀도: 도감 별이 높을수록 드묾.
     v8.7.7: ''')
for a, b in (('h1::after{content:" v8.7.7"', 'h1::after{content:" v8.7.8"'), ('<footer>굴의 전투판 v8.7.7', '<footer>굴의 전투판 v8.7.8'), ('return `굴의 전투판 v8.7.7 · ${title}', 'return `굴의 전투판 v8.7.8 · ${title}'),
             ("copyText('굴의 전투판 v8.7.7 자동 판 기록", "copyText('굴의 전투판 v8.7.8 자동 판 기록"), ("o.push(`굴의 전투판 v8.7.7 — ${C.run", "o.push(`굴의 전투판 v8.7.8 — ${C.run"),
             ('의 버전 기록에 — v8.7.7 유물 34 · 노먼 전직 / v8.7.6 인벤토리 v2 (장비 탭 · 이름표 · 전리품 비교)', '의 버전 기록에 — v8.7.8 굿윌 · 감전 한 틀 / v8.7.7 유물 34 · 노먼 전직'),
             ('">v8.7.7 · 유물 34 · 노먼 전직</span>', '">v8.7.8 · 굿윌 · 감전 한 틀</span>'),
             ("ver: '8.7.7', kind:", "ver: '8.7.8', kind:")):
    rep(a, b)
rep("RULES_MIG = '8.7.7',", "RULES_MIG = '8.7.8',")   # 수치표: gw · zap · spec (gpalm · knee · snap · snap3 · gslam · rise) 새 칸

# ---------- 굿윌: 설계 (뽑기에서만 — 명세 C5) ----------
GW_DES = ("  { key: '굿윌', side: 0, ref: 'C-010', name: '굿윌', tier: 2, cls: '기동', role: '공격수', weapon: '맨손', shield: false, sm: 1.1, height: 1.85, weight: 70, nv: true, nvG: 'A', noChg: true, dcounter: 0.45, "
          "ov: { hp: 360, atk: 46 }, traits: ['속력A', '회피A', '급소B', '반사신경', '전투센스'], unique: ['푸른 번개'], active: ['니킥', '내려찍기', '손바닥', '딱', '딱딱딱', '올려차기'], "
          "tactic: '스프린터 · 사각 · 치고 빠지기', note: '맨손일 때 가장 셈 (무기를 들면 보통 근접). 3 ~ 5칸에서 번개로 괴롭히며 상대의 옆 · 뒤로 팟팟 순간이동 · 치려 하면 이미 뒤로 쓩 · 2.6초마다 등 뒤로 파고들어 한두 대 치고 빠짐. 기술 칸 1 = 니킥 · 2 = 내려찍기 (나머지는 스스로)' },   /* v8.7.8 굿윌 (명세 C5 · 2D 그대로 — 체력 300 → 360 · 공격 28 → 46 (모닝스타를 옮길 때와 같은 비)) */\n")
n0 = s.index("  { key: '모닝스타', side: 0, ref: 'C-005'")
n1 = s.index('\n', n0) + 1
s = s[:n1] + GW_DES + s[n1:]
# 도감 (명단) 에서 놓아도 같은 몸 (정체성 감사)
rep("const PROFILE = {\n", "const PROFILE = {\n  'C-010': { cls: '기동', role: '공격수', weapon: '맨손', shield: false, sm: 1.1, height: 1.85, weight: 70, unique: ['푸른 번개'], active: ['니킥', '내려찍기', '손바닥', '딱', '딱딱딱', '올려차기'], traits: ['속력A', '회피A', '급소B', '반사신경', '전투센스'], ov: { hp: 360, atk: 46 }, dcounter: 0.45, noChg: true, allyNv: 'A', tactic: '스프린터 · 사각 · 치고 빠지기' },   // v8.7.8 굿윌\n")
rep("  for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells', 'alt']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]);",
    "  for (const k of ['sizeCls', 'regenK', 'leapN', 'race', 'origin', 'shells', 'alt', 'dcounter', 'noChg']) if (pf[k] != null && u[k] == null) u[k] = clone(pf[k]);   /* v8.7.8 피하며 반격 · 돌격 안 함도 도감에서 */")
rep("  'C-221': { traits: ['영웅'], active: ['공중제비'] }, ", "  'C-221': { traits: ['영웅'], active: ['공중제비'] }, 'C-010': { unique: ['푸른 번개'], active: ['니킥', '내려찍기', '손바닥', '딱', '딱딱딱', '올려차기'] }, ")

# ---------- 기술 · 고유 글 ----------
rep("const ACTIVE = {\n", """const ACTIVE = {
  '니킥': '굿윌 (2D 그대로) — 6칸 안의 상대에게: 뒤로 살짝 물러났다가 반동으로 박차고 보이지 않는 속도로 상대의 옆 · 뒤 (사각) 에 꽂힘 (공격 × 3 · 1초 경직). 빈틈 (공격 준비 중 · 휘청 · 넘어짐) 을 노리면 헤드샷 60% (아니면 25%) — 확정 치명 · 갑옷 · 막기 무시 (공격 × 1.67 · 머리) · 무게 600 아래는 2.2초 넘어짐. 대기 6초. 명령: 기술 칸 1 → 적을 탭',
  '내려찍기': '굿윌 — 거의 유일한 광역기: 5칸 안의 상대에게 뛰어올라 (0.55초 — 떠 있는 동안 무적 · 슈퍼아머 · 돌격도 밑으로 지나감) 내리꽂음 → 둘레 2.5칸의 적 모두 (공격 × 1.6 · 감전 · 1.4초 경직 — 막으면 경직 없음 · 몸을 비틀어 피할 수 있음). 대기 7초. 명령: 기술 칸 2 → 적을 탭',
  '손바닥': '굿윌 (잡기) — 4.5칸 안의 상대 발밑에 푸른 표식 → 0.45초 뒤 순간이동하듯 붙어 손바닥을 대고 터트림 (공격 × 2.6 · 회피 · 막기 무시 · 감전 · 튕겨 냄). 표식이 뜬 사이 0.9칸 넘게 벗어나면 허공을 치고 굿윌이 0.9초 빈틈. 대기 7초',
  '딱': '굿윌 — 손가락을 튕기면 Z자 천둥이 7칸 안의 보이는 상대에게 곧장 내리꽂힘 (원거리 — 피할 수 있고 방패로 막힘 · 갑옷 무시 · 공격 × 2.4 · 감전 · 0.5초 경직). 대기 6초',
  '딱딱딱': '굿윌 — 약한 천둥 세 번 (0.22초 간격 · 공격 × 0.75 씩 · 감전이 쌓임 · 짧은 경직) — 전기로 계속 괴롭힘. 대기 4초',
  '올려차기': '굿윌 — 붙은 상대를 차올림 (공격 × 1.5) · 35% 로 0.9초 넘어짐 (무게 600 아래). 대기 4.5초',
""")
rep("const UNIQUE = {\n", """const UNIQUE = {
  '푸른 번개': { who: 'C-010',   // v8.7.8 굿윌 (명세 C5 — 2D 미궁 프롤로그 그대로)
    lore: ['굿 윌. 마법계 + SF계열 출신 — 그의 세계에서 가장 강한 이들 중 한 명이었다. 적뢰급은 아니지만 매우 강한 전격을 지녔다.', '초속 니킥이 특징. 굴에서 어찌저찌 살아가고, 무뚝뚝해 보이지만 지구 기준으로 가장 선한 성향을 지닌 인물 중 하나.', '누가 오더라도 비빌 수 있다 — 6성이든 7성이든, 유효타와 비빌 기회는 있다.'],
    effects: ['맨손일 때만 (가장 셈) — 무기를 들면 기술 · 순간이동이 꺼지고 보통 근접처럼 싸움 · 스스로 무기를 줍지 않음',
      '스프린터: 평소 3 ~ 5칸에서 번개로 괴롭히며 1.7초마다 상대의 옆 · 뒤 (사각) 로 팟팟 순간이동 (2.4 ~ 3.6칸 · 0.16초 — 그 사이 근접 · 탄을 피함 · 벽 · 몸 너머로는 못 감)',
      '치려 하면 이미 뒤로 쓩 (나를 노리고 준비 중인 근접 — 0.55초마다 2.8칸) · 2.6초마다 등 뒤로 파고들어 한두 대 치고 빠짐 (상대가 휘청이면 한 대 더)',
      '사각: 등 뒤에서 친 근접은 막을 수 없음 · 피하면 45% 로 바로 되받아침',
      '싸움을 시작할 때 기술마다 대기 (2D): 올려차기 1 · 니킥 1.2 · 손바닥 2 · 딱딱딱 2 · 딱 3 · 내려찍기 5초',
      '감전 (푸른 번개): 1초마다 6 × 중첩 · 4초 (겹치면 중첩 +1 · 최대 5 — 적뢰의 감전과 같은 틀)'],
    derived: [], limits: [], flags: {} },
""")
rep('"근력": 43}}', '"근력": 43, "손바닥": 5, "니킥": 34, "내려찍기": 35, "올려차기": 39, "딱": 44, "딱딱딱": 45, "푸른 번개": 44}}')   # v8.7.8 굿윌 (가까운 그림 · 딱 · 딱딱딱 · 푸른 번개는 새 그림 44 · 45)
import shutil; shutil.copy(D + 'ico878/icons_v878.webp', D + 'build/icons.webp')   # v1.1 아이콘 판 (44 딱 · 45 딱딱딱 — mkico.py v1.1)
rep("const SPEC_TGT = { ", "const SPEC_TGT = { knee: '🦵 니킥: 적을 탭 (6칸 — 사각에 꽂힘 · 빈틈이면 헤드샷)', gslam: '👊 내려찍기: 적을 탭 (5칸 — 뛰어올라 둘레 2.5칸 · 떠 있는 동안 무적)', gpalm: '✋ 손바닥: 적을 탭 (4.5칸 — 표식에서 벗어나면 빗나감)', snap: '⚡ 딱: 보이는 적을 탭 (7칸)', snap3: '⚡ 딱딱딱: 보이는 적을 탭 (7칸)', rise: '🦶 올려차기: 붙은 적을 탭', ")

# ---------- 기록 (글) ----------
ZAPN = "{ blue: '푸른 번개', red: '적뢰', res: '잔류', redHalf: '적뢰 (약)', resHalf: '잔류 (약)' }"
rep("      case 'czAuth': out.push(`${T(e)}❄ 권위 발동 — 눈이 내리고 신성이 막힘`); break;   // v7.23.2",
    "      case 'czAuth': out.push(`${T(e)}❄ 권위 발동 — 눈이 내리고 신성이 막힘`); break;   // v7.23.2\n"
    "      case 'gwHop': out.push(`${T(e)}⚡ ${n(e.a)} 팟 — ${e.why || '순간이동'} (${e.d}칸)${e.b != null ? ' · ' + n(e.b) + ' 곁' : ''}`); break;   // v8.7.8 굿윌\n"
    "      case 'gwOpen': out.push(`${T(e)}👁 ${n(e.a)} — ${n(e.b)}의 빈틈을 봄 (니킥 헤드샷 60%)`); break;\n"
    "      case 'gwPalm': out.push(`${T(e)}✋ ${n(e.a)}의 손바닥 — ${n(e.b)}에게 붙어 터트림 (회피 · 막기 무시)`); break;\n"
    "      case 'gwMiss': out.push(`${T(e)}✋ ${n(e.a)}의 손바닥 — 허공 (${ga(n(e.b))} 표식에서 벗어남) · ${n(e.a)} 빈틈 0.9초`); break;\n"
    "      case 'gwKnee': out.push(`${T(e)}🦵 ${n(e.a)}의 니킥 → ${n(e.b)}${e.head ? ' — 헤드샷! (확정 치명 · 갑옷 무시)' : ''}`); break;\n"
    "      case 'gwRise': out.push(`${T(e)}🦶 ${n(e.a)}의 올려차기 → ${n(e.b)}`); break;\n"
    "      case 'gwZap': out.push(`${T(e)}⚡ ${n(e.a)} ${e.big ? '딱' : '딱 (약)'} → ${n(e.b)}`); break;\n"
    "      case 'gslam': out.push(`${T(e)}👊 ${n(e.a)} 뛰어오름 — 내려찍기${e.b != null ? ' → ' + n(e.b) : ''} (떠 있는 동안 무적)`); break;\n"
    "      case 'gslamHit': out.push(`${T(e)}👊⚡ 내려찍기 — 둘레 ${e.r}칸 ${e.n}명 감전 · 경직`); break;\n"
    f"      case 'zap': out.push(`${{T(e)}}⚡ ${{n(e.b)}} 감전 (${{({ZAPN})[e.kind] || e.kind}}) ×${{e.st}} — 1초마다 ${{e.dps}} · ${{e.n}}초`); break;   // v8.7.8 감전 한 틀")
rep("{ melee: '일격', shot: '사격', arc: '곡사', jav: '투창', charge: '돌진', leap: '도약', spin: '회전 도끼', sweep: '휘두르기' }[e.how]",
    "{ melee: '일격', shot: '사격', arc: '곡사', jav: '투창', charge: '돌진', leap: '도약', spin: '회전 도끼', sweep: '휘두르기', zap: '천둥' }[e.how]")
rep("{ melee: '일격', charge: '돌진', shot: '탄', arc: '곡사' }[e.how]", "{ melee: '일격', charge: '돌진', shot: '탄', arc: '곡사', zap: '천둥' }[e.how]")

# ---------- 서술 ----------
rep("    case 'czAuth': return { c: 'bad', s: '❄ 권위 — 눈이 내리고 신성이 막힌다.' };   // v7.23.2",
    "    case 'czAuth': return { c: 'bad', s: '❄ 권위 — 눈이 내리고 신성이 막힌다.' };   // v7.23.2\n"
    "    case 'gwKnee': if (!e.head || !(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `🦵 ${n(e.a)}의 니킥이 ${n(e.b)}의 머리에 꽂힌다 — 빠아악!!` };   // v8.7.8 굿윌\n"
    "    case 'gwPalm': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `✋ ${n(e.a)}의 손바닥 — ${reul(n(e.b))} 붙잡아 터트린다. 파직!` };\n"
    "    case 'gwMiss': if (!(e.vis || U(e.a).side === 0)) return null; return { c: U(e.a).side ? 'good' : 'dim', s: `${n(e.a)}의 손바닥이 허공을 친다 — 빈틈!` };\n"
    "    case 'gslamHit': if (!e.n) return null; return { c: U(e.a).side ? 'bad' : 'good', s: `👊⚡ ${ga(n(e.a))} 내리꽂는다 — 둘레 ${e.n}명에게 푸른 번개!` };")

# ---------- 그림 효과: 잔상 (푸른) · 표식 · 천둥 · 진동 고리 ----------
rep("      const a = Wd.units[f.a]; if (a && (a.side === 0 || a.seenBy || $('seeAll').checked)){ ctx.fillStyle = `rgba(170,200,255,${(0.35 * (1 - age / 0.3)).toFixed(2)})`;",
    "      const a = Wd.units[f.a]; if (a && (a.side === 0 || a.seenBy || $('seeAll').checked)){ ctx.fillStyle = f.gw ? `rgba(127,212,255,${(0.55 * (1 - age / 0.3)).toFixed(2)})` : `rgba(170,200,255,${(0.35 * (1 - age / 0.3)).toFixed(2)})`;   /* v8.7.8 굿윌 순간이동 잔상 (푸른) */")
rep("    } else if (f.k === 'num' && age < 0.9){\n",
    "    } else if (f.k === 'gwMark' && age < (f.dur || 0.45)){   // v8.7.8 굿윌 손바닥 — 노린 자리의 푸른 표식\n"
    "      const q = age / (f.dur || 0.45), p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.strokeStyle = `rgba(127,212,255,${(0.9 - 0.4 * q).toFixed(2)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, ts * (0.9 - 0.5 * q), 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.arc(p.x, p.y, ts * 0.12, 0, 6.283); ctx.fillStyle = 'rgba(127,212,255,.8)'; ctx.fill();\n"
    "    } else if (f.k === 'zbolt' && age < (f.big ? 0.9 : 0.45)){   // v8.7.8 Z자 천둥 (하늘에서 노린 자에게)\n"
    "      const L0 = f.big ? 0.9 : 0.45, q = age / L0, p = { x: ox + f.x * ts, y: oy + f.y * ts }, H = ts * (f.big ? 3.2 : 2.2), sg = ((f.x * 7.3 + f.y * 3.1) % 1 + 1) % 1; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - q);\n"
    "      ctx.strokeStyle = '#e8faff'; ctx.shadowColor = '#7fd4ff'; ctx.shadowBlur = f.big ? 14 : 8; ctx.lineWidth = f.big ? 3.5 : 2; ctx.beginPath(); ctx.moveTo(p.x + ts * 0.3 * (sg - 0.5), p.y - H);\n"
    "      for (let i = 1; i <= 5; i++){ const k = i / 5, w = (i % 2 ? 1 : -1) * ts * (f.big ? 0.32 : 0.22) * (1 - k * 0.6); ctx.lineTo(p.x + w, p.y - H * (1 - k)); } ctx.stroke(); ctx.restore();\n"
    "    } else if (f.k === 'quake' && age < 0.5){   // v8.7.8 내려찍기 — 둘레 고리\n"
    "      const q = age / 0.5, p = { x: ox + f.x * ts, y: oy + f.y * ts }; ctx.strokeStyle = `rgba(127,212,255,${(0.8 * (1 - q)).toFixed(2)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, (f.r || 2.5) * ts * (0.3 + 0.7 * q), 0, 6.283); ctx.stroke();\n"
    "    } else if (f.k === 'num' && age < 0.9){\n")
rep("f.c === 'g' ? '#ffd27a' : '#f2e9da';", "f.c === 'g' ? '#ffd27a' : f.c === 'd' ? '#ffd35a' : f.c === 'w' ? '#bfefff' : '#f2e9da';")   # v8.7.8 빠아악 (금빛) · 천둥을 피함

# ---------- 감전 한 틀: 페이지의 적뢰 감전 (jrSh) → 엔진 zapOn (u.zap) ----------
rep("""function jrShock(W, o, kind, src){
  const K = JR8.shock[kind]; if (!K || !o.alive) return; const s = o.jrSh;
  if (s && s.n > 0){ if (K[0] > JR8.shock[s.kind][0]) s.kind = kind; s.st = Math.min(JR8.shock.max, s.st + 1); s.n = Math.max(s.n, K[1]); }
  else o.jrSh = { kind, n: K[1], st: 1, next: W.t + 1, src: src.i };
}
function jrShockTick(W){
  for (const o of W.units){ const s = o.jrSh; if (!s) continue; if (!o.alive){ o.jrSh = null; continue; } if (W.t < s.next) continue;
    s.next = W.t + 1; s.n--; const K = JR8.shock[s.kind], src = W.units[s.src] || o; applyDmg(W, src, o, Math.max(1, K[0] * s.st), { tag: '감전', dot: true, jrOwn: true, ff: src.side === o.side });
    if (s.n <= 0) o.jrSh = null; }
}""", """function jrShock(W, o, kind, src){ return zapOn(W, o, kind, src); }   /* v8.7.8 감전 한 틀 — 엔진 (zapOn · 수치표 zap) · 굿윌의 푸른 번개와 같은 틀 */
function jrShockTick(W){}   /* v8.7.8 엔진의 stepWorld 가 셈 (zapTick) */""")
rep("  shock: { red: [10, 5, '감전: 적뢰'], res: [5, 5, '잔류'], redHalf: [7, 5, '감전: 적뢰 (약)'], resHalf: [4, 5, '잔류 (약)'], max: 5 },   // SHOCKS: 초당 피해 · 초 · 중첩 최대 5 (틱 × 중첩)",
    "  /* v8.7.8 감전 수치는 엔진 수치표 zap 으로 옮김 (푸른 번개 · 적뢰 · 잔류 한 틀) */")
rep("    if (u.jrSh){ ctx.fillStyle = /red/.test(u.jrSh.kind) ? '#ff4a4a' : '#ffb45a'; ctx.font = `${Math.max(9, ts * 0.28)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(`⚡${u.jrSh.st > 1 ? '×' + u.jrSh.st : ''}`, px + u.r * ts, py - u.r * ts); }",
    "    /* v8.7.8 감전 ⚡ 는 draw() 에서 (모든 판 · 보이는 몸만) */")
rep("  // 총성 '!': 쏜 자리에 noiseTime 동안 남음", "  // v8.7.8 감전 ⚡ (한 틀 — 푸른 번개 · 적뢰 · 잔류): 모든 판에서 · 보이는 몸만 · 몸 위에\n"
    "  if (!ed) for (const u of Wd.units){ if (!u.alive || !u.zap || hid0(u) || !(u.side === 0 || see || u.seenBy)) continue; ctx.fillStyle = u.zap.kind === 'blue' ? '#7fd4ff' : /red/.test(u.zap.kind) ? '#ff4a4a' : '#ffb45a'; ctx.font = `${Math.max(9, ts * 0.28)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(`⚡${u.zap.st > 1 ? '×' + u.zap.st : ''}`, ox + (u.x + u.r) * ts, oy + (u.y - u.r) * ts); }\n"
    "  // 총성 '!': 쏜 자리에 noiseTime 동안 남음")

# ---------- 뽑기 희귀도 (도감 별이 높을수록 드묾 — 1층 첫 뽑기 · 여정 뽑기 같은 규칙) ----------
rep("const RAR_STAR = p => { const n = RAR_OF(p); return n ? '★'.repeat(Math.min(7, n)) : ''; };",
    "const RAR_STAR = p => { const n = RAR_OF(p); return n ? '★'.repeat(Math.min(7, n)) : ''; };\n"
    "/* v8.7.8 뽑기 희귀도: 별 (도감 희귀도) 이 높을수록 드묾 — 1 ~ 3성 1 · 4성 0.6 · 5성 0.3 · 6성 0.15 · 7성 0.08 (무게) */\n"
    "const RAR_W = d => { const r = d && d.ref && RBY[d.ref]; const n = r && ALLY(r[2]) ? r[3] || 0 : 0; return n >= 7 ? 0.08 : n === 6 ? 0.15 : n === 5 ? 0.3 : n === 4 ? 0.6 : 1; };\n"
    "function rarPick(pool){ const W0 = pool.map(RAR_W), T = W0.reduce((a, b) => a + b, 0); let x = Math.random() * T; for (let i = 0; i < pool.length; i++){ x -= W0[i]; if (x <= 0) return i; } return pool.length - 1; }")
rep("  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !CAMP_FIX.includes(d.key) && !CAMP_NO.includes(d.key)).map(d => d.key), pick = [];\n"
    "  if (!(opt && opt.party)) while (pick.length < 3 && pool.length)   /* v8.7.2 뽑기 셋 */ pick.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);",
    "  const pool = DESIGN_DEFAULTS.filter(d => d.side === 0 && !CAMP_FIX.includes(d.key) && !CAMP_NO.includes(d.key)).map(d => d.key), pick = [];\n"
    "  if (!(opt && opt.party)) while (pick.length < 3 && pool.length)   /* v8.7.2 뽑기 셋 · v8.7.8 희귀도 */ pick.push(pool.splice(rarPick(pool.map(k => designByKey(k))), 1)[0]);")
rep("const d = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; return d ? { k: 'ally', key: d.key, ref: d.",
    "const d = pool.splice(rarPick(pool), 1)[0]; return d ? { k: 'ally', key: d.key, ref: d.")   # v8.7.8 희귀도

open(F, 'w', encoding='utf-8').write(s)
print('page8780 OK')
