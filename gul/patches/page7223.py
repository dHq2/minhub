# v7.22.3 페이지 — page7223.py v1.1 (v1.1: 기술 설명 넷 · 5단계 인카운터 4: 히든보스 각혈 — 1S · 2S 에 처음 들어설 때 드물게 (캠페인에 한 번) · 맵이 시작되고 6 ~ 14초 뒤 일행에게서 먼 쪽 끝에서 나타나 쫓음 · 사각형 창 "피할 수 없는 죽음이 찾아왔습니다." · 핏빛 장판 · 피의 검기 그림 · 로그 · 이야기 · 각혈의 장검 · 갑옷)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.22.2 (2026-10-18)', '<!-- 굴의 전투판 v7.22.3 (2026-10-18)')
rep('     v7.22.2: ', '''     v7.22.3: 히든보스 각혈 — 1S · 2S 에 처음 들어설 때 드물게 (캠페인에 한 번). 맵이 시작되고 6 ~ 14초 뒤 일행에게서 먼 쪽 끝에서 나타나 쫓음.
         사각형 창 "피할 수 없는 죽음이 찾아왔습니다." 6성 · 중갑 (각혈갑) · 빠름 · 체력 3200 · [보스].
         혈영보 (순간이동 — 상대 등 뒤로 · 둘러싸이면 먼 사수에게) · 혈염 (둘레 3칸을 태움) · 핏빛 장판 (타는 웅덩이 · 느려짐 · 본 쪽은 피함) · 피의 검기 (8칸 · 둘까지 꿰뚫음).
         이기면 각혈의 장검 (한 손 · 베면 불이 붙음 · 피의 검기 열화판) · 각혈의 갑옷 (판금보다 가볍고 단단함) · 각혈의 투구.
     v7.22.2: ''')
rep('h1::after{content:" v7.22.2"', 'h1::after{content:" v7.22.3"')
rep('<footer>굴의 전투판 v7.22.2', '<footer>굴의 전투판 v7.22.3')
rep('return `굴의 전투판 v7.22.2 · ${title}', 'return `굴의 전투판 v7.22.3 · ${title}')
rep("copyText('굴의 전투판 v7.22.2 자동 판 기록", "copyText('굴의 전투판 v7.22.3 자동 판 기록")
rep('의 버전 기록에 — v7.22.2 대장군 호레이쇼', '의 버전 기록에 — v7.22.3 히든보스 각혈 / v7.22.2 대장군 호레이쇼')
rep('">v7.22.2 · 1F 인카운터 · 대장군</span>', '">v7.22.3 · 1F 인카운터 · 각혈</span>')
rep("ver: '7.22.2', at:", "ver: '7.22.3', at:")

# 인물 설계: 각혈 (적 · 히든보스)
rep("const ACTIVE = {", "const ACTIVE = {\n  '혈영보': '각혈 — 핏빛 안개로 흩어졌다가 9칸 안 상대의 등 뒤 (막히면 옆 · 앞) 에 나타남. 셋 넘게 둘러싸이면 먼 상대 (사수 먼저) 에게. 5초마다',\n  '혈염': '각혈 — 둘레 3칸을 피의 불길로 태움 (가까울수록 셈 · 화상 두 겹 · 동료도). 9초마다',\n  '핏빛 장판': '각혈 — 7칸 안 찍은 자리에 2칸 웅덩이 6초: 안에 선 모두 0.5초마다 화상 · 걸음 0.7 배 (본 쪽은 밖으로 피함). 12초마다',\n  '피의 검기': '각혈 — 검을 휘둘러 8칸을 곧게 날아가는 검기 (둘까지 꿰뚫음 · 화상). 각혈의 장검을 든 이는 열화판 (× 0.6). 4초마다',   // v7.22.3")
rep("  { key: '곤봉적', side: 1,", "  { key: '각혈', side: 1, ref: 'C-097', name: '각혈', tier: 6, cls: '근접', role: '공격수', weapon: '각혈의 장검', height: 2.1, weight: 120, sizeCls: '중대형', nv: true, nvG: 'S', bold: 0.9, ov: { hp: 3200, atk: 70 }, traits: ['보스', '베테랑', '속력A', '회피A', '발화A', '괴력B', '망자', '은신B'], gear: { 몸: { name: '각혈의 갑옷', mat: '각혈갑', tier: 3 }, 머리: { name: '각혈의 투구', mat: '투구', tier: 3 } }, active: ['혈영보', '혈염', '핏빛 장판', '피의 검기'], tactic: '히든보스 · 순간이동 · 피의 불길 · 장판 · 검기', note: '각 층의 기본 맵에 드물게 나타나는 히든 도깨비 — 피할 수 없는 죽음. 중갑 · 빠름 · 높은 체력. 혈영보 (상대 등 뒤로 순간이동) · 혈염 (둘레를 태우는 넓은 화염) · 핏빛 장판 (타는 웅덩이) · 피의 검기 (곧게 날아가는 원거리기). 이기면 각혈의 장검 (한 손 · 화염 · 검기 열화판) · 각혈의 갑옷' },   // v7.22.3\n  { key: '곤봉적', side: 1,")

# 1S · 2S 등장 · 나타남
rep("  if (s === 3 && !st.seen && !st.e3) st.e3 = encPick(C, party).k;   // v7.22 3S 만남은 들어설 때 뽑음",
    "  if (s === 3 && !st.seen && !st.e3) st.e3 = encPick(C, party).k;   // v7.22 3S 만남은 들어설 때 뽑음\n  if ((s === 1 || s === 2) && !st.seen && !C.kh && (C.khForce || Math.random() < KH_P)){ C.kh = s; st.khT = 6 + Math.random() * 8; delete C.khForce; }   // v7.22.3 히든보스 각혈 (캠페인에 한 번)")
rep("function encRise(Wd, E){", r"""// v7.22.3 히든보스 각혈: 1S · 2S 에 처음 들어설 때 KH_P 확률 (캠페인에 한 번) — 맵이 시작되고 khT 초 뒤 일행에게서 먼 쪽 끝에서 나타나 가까운 이를 쫓음
const KH_P = 0.07;
function khTick(Wd){
  const C = S.camp; if (!C || C.end || !Wd.camp || Wd.over || TK) return; const st = (C.stages || {})[C.s]; if (!st || st.khT == null || st.khDone || Wd.t < st.khT) return;
  st.khDone = true; const al = Wd.units.filter(u => u.alive && u.side === 0); if (!al.length) return;
  const cy = al.reduce((a, u) => a + u.y, 0) / al.length, top = cy > Wd.map.H / 2, p = { ...foeOf('각혈'), x: Wd.map.W / 2, y: top ? 1.3 : Wd.map.H - 1.3 };
  lockIdentity(p); S.units.push(p); const u = addUnit(Wd, p);
  let a = null, d0 = 99; for (const o of al){ const q = Math.hypot(o.x - u.x, o.y - u.y); if (q < d0){ d0 = q; a = o; } }
  if (a){ u.state = 'hunt'; u.target = a; u.last = { x: a.x, y: a.y }; u.searchT = 30; u.sense[a.i] = { x: a.x, y: a.y, t: Wd.t, exact: true }; }   // 피할 수 없는 죽음 — 처음 노린 이는 앎
  logEv(Wd, { k: 'khCome', a: u.i }); save(); campBarRender(true); talkLines([{ box: '피할 수 없는 죽음이 찾아왔습니다.' }]);
}
function encRise(Wd, E){""")
rep("  if (Wd && mode !== 'edit' && Wd.camp) encTick(Wd);   // v7.22 장면 인물", "  if (Wd && mode !== 'edit' && Wd.camp){ encTick(Wd); khTick(Wd); }   // v7.22 장면 인물   // v7.22.3 각혈")
# 그림: 핏빛 장판 · 피의 검기
rep("  if (!ed) for (const S2 of Wd.spins || []){ if (!(see || litAt(Wd, S2.x, S2.y))) continue; const sx = ox + S2.x * ts, sy = oy + S2.y * ts;",
    r"""  if (!ed) for (const P of Wd.pools || []){ const px = ox + P.x * ts, py = oy + P.y * ts, R = P.r * ts, a = Math.min(1, Math.max(0, P.until - Wd.t) / 1.2), now2 = performance.now();   /* v7.22.3 핏빛 장판 */
    ctx.fillStyle = `rgba(140,8,24,${(0.32 * a + 0.06).toFixed(3)})`; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.fill(); ctx.setLineDash([3, 5]); ctx.strokeStyle = `rgba(255,70,80,${(0.8 * a).toFixed(3)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, R, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = `rgba(255,120,110,${(0.5 * a).toFixed(3)})`; for (let k = 0; k < 6; k++){ const q = ((now2 / 700) + k / 6) % 1, ang = k * 1.7 + P.t0; ctx.beginPath(); ctx.arc(px + Math.cos(ang) * R * 0.6 * ((k % 3) / 3 + 0.3), py + Math.sin(ang) * R * 0.6 * ((k % 3) / 3 + 0.3), ts * 0.06 * (1 - q) + 1, 0, 6.283); ctx.fill(); } }
  if (!ed) for (const S2 of Wd.spins || []){ if (!(see || litAt(Wd, S2.x, S2.y))) continue; const sx = ox + S2.x * ts, sy = oy + S2.y * ts;
    if (S2.wave){ ctx.save(); ctx.translate(sx, sy); ctx.rotate(Math.atan2(S2.dy, S2.dx)); ctx.strokeStyle = S2.weak ? 'rgba(255,120,120,.8)' : 'rgba(255,50,60,.95)'; ctx.lineWidth = Math.max(3, ts * (S2.weak ? 0.08 : 0.13)); ctx.beginPath(); ctx.arc(-ts * 0.15, 0, ts * 0.5, -1.1, 1.1); ctx.stroke(); ctx.strokeStyle = 'rgba(255,200,180,.75)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-ts * 0.22, 0, ts * 0.44, -0.9, 0.9); ctx.stroke(); ctx.restore(); continue; }   /* v7.22.3 피의 검기 */""")
# 로그 · 이야기
rep("      case 'quake': out.push(", """      case 'khCome': out.push(`${T(e)}☠ ${n(e.a)} 나타남 — 피할 수 없는 죽음`); break;   // v7.22.3
      case 'blink': out.push(`${T(e)}🩸 ${n(e.a)} 혈영보 → ${n(e.b)}의 ${e.back ? '등 뒤' : '곁'} (${coord(e.x, e.y)})`); break;
      case 'pyre': out.push(`${T(e)}🔥 ${n(e.a)} 혈염 — 둘레 ${e.n}명을 태움`); break;
      case 'pool': out.push(`${T(e)}🩸 ${n(e.a)} 핏빛 장판 — ${coord(e.x, e.y)} (${e.r}칸 · ${e.sec}초)`); break;
      case 'poolFlee': out.push(`${T(e)}🏃 ${n(e.a)} 핏빛 장판에서 피함`); break;
      case 'wave': out.push(`${T(e)}🩸 ${n(e.a)} 피의 검기${e.weak ? ' (열화)' : ''}${e.b != null ? ' → ' + n(e.b) + ' 쪽' : ''}`); break;
      case 'waveEnd': out.push(`${T(e)}🩸 ${n(e.a)}의 검기가 흩어짐 (맞은 ${e.n})`); break;
      case 'quake': out.push(""")
rep("    case 'quake': return e.vis ?", """    case 'khCome': return { c: 'bad', s: '피할 수 없는 죽음이 찾아왔다.' };   // v7.22.3
    case 'blink': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 핏빛 안개로 흩어졌다가 ${n(e.b)}의 ${e.back ? '등 뒤' : '곁'}에 나타난다!` };
    case 'pyre': return { c: U(e.a).side ? 'bad' : 'good', s: '피의 불길이 둘레를 휩쓴다!' };
    case 'pool': return { c: U(e.a).side ? 'bad' : 'good', s: '발밑에 핏빛 웅덩이가 번져 간다.' };
    case 'wave': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 검을 휘두르자 붉은 검기가 곧게 날아간다!` };
    case 'quake': return e.vis ?""")

open(F, 'w', encoding='utf-8').write(s)
print('page7223 OK')
