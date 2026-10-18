# v7.26.2 페이지 — page7262.py v1.2 (v1.2: 대화가 열려 있어도 ▶ 는 대화를 닫고 바로 · v1.1: 시험 중 훈련장으로 가면 시험 맵을 접고 맡긴 프롤로그를 돌려놓음 · 인카운터 목록 ▶: 확인 창 · 뽑기 없이 지금 배치된 아군 그대로 · 로딩 뒤 그 만남으로 바로 /
#   진행 중인 스토리 프롤로그는 잠시 맡겨 두고, 시험을 그만두면 훈련장 배치로 돌아오며 프롤로그도 그대로 돌려놓음)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7261.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.26.1 (2026-10-18)', '<!-- 굴의 전투판 v7.26.2 (2026-10-18)')
rep('     v7.26.1: ', '''     v7.26.2: 인카운터 목록 ▶ — 지금 배치된 아군 그대로 로딩 뒤 그 만남으로 바로 (확인 · 뽑기 없음 · 진행 중인 프롤로그는 그대로 남음).
     v7.26.1: ''')
rep('h1::after{content:" v7.26.1"', 'h1::after{content:" v7.26.2"')
rep('<footer>굴의 전투판 v7.26.1', '<footer>굴의 전투판 v7.26.2')
rep('return `굴의 전투판 v7.26.1 · ${title}', 'return `굴의 전투판 v7.26.2 · ${title}')
rep("copyText('굴의 전투판 v7.26.1 자동 판 기록", "copyText('굴의 전투판 v7.26.2 자동 판 기록")
rep("ver: '7.26.1', kind: '1F 여정 기록'", "ver: '7.26.2', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v7.26.1 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v7.26.2 — 1F 프롤로그 여정 기록'")
rep('의 버전 기록에 — v7.26.1 맵 이동', '의 버전 기록에 — v7.26.2 인카운터 바로 해 보기 (배치 그대로) / v7.26.1 맵 이동')
rep('">v7.26.1 · 이동 · 합류 · 샷건</span>', '">v7.26.2 · 인카운터 바로 해 보기</span>')

# campStart: 정해 준 일행 (opt.party)
rep("  while (pick.length < 2 && pool.length) pick.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);\n  const party = [",
    "  if (!(opt && opt.party)) while (pick.length < 2 && pool.length) pick.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);\n  const party = opt && opt.party ? opt.party : [")   # v7.26.2

# 인카운터 시험: 지금 배치 그대로
rep("""function encTry(k){
  if (!confirm('스토리에서 새 프롤로그를 열고 이 만남으로 바로 갈까요? (진행 중인 프롤로그는 사라져요)')) return;
  const cS = ($('encBtC') || {}).value || '', sS = ($('encBtS') || {}).value || '';
  if (S.mode !== 'story' && !setMode('story')) return;
  if (S.camp) campQuit(true); if (mode !== 'edit') resetToEdit();
  const party = campStart({ direct: true }); if (!party) return; const C = S.camp;""",
"""// v7.26.2 인카운터 시험: 지금 배치된 아군 그대로 · 확인 없이 · 로딩 뒤 그 만남으로. 진행 중인 프롤로그 (스토리) 는 맡겨 두었다가 시험을 그만두면 돌려놓음
function encTry(k){
  if (TK) talkClose();   // 대화가 열려 있어도 시험은 바로
  const cS = ($('encBtC') || {}).value || '', sS = ($('encBtS') || {}).value || '';
  let keep = S.story || null;
  if (S.camp && S.camp.test){ keep = S.camp.test.keep || keep; S.camp.test = null; campQuit(true); }   // 시험 중에 다른 만남을 누름 — 배치로 돌아온 뒤 다시
  else if (S.camp && !S.camp.end && S.mode === 'story'){ if (!confirm('진행 중인 프롤로그를 맡겨 두고 인카운터 시험을 할까요? (시험을 그만두면 돌아와요)')) return; storyStash(); keep = S.story || keep; }
  if (mode !== 'edit') resetToEdit();
  const P0 = S.units.filter(u => u.side === 0); if (!P0.length){ toast('먼저 아군을 배치하세요'); return; }
  delete S.story; if (S.mode !== 'story' && !setMode('story')){ if (keep) S.story = keep; return; }
  const hasHero = P0.some(u => u.hero || u.ref === 'C-001');
  const mine = P0.map((u, i) => ({ ...clone(u), id: uid(), hero: hasHero ? !!(u.hero || u.ref === 'C-001') : i === 0 }));
  const party = campStart({ direct: true, party: mine }); if (!party){ if (keep) S.story = keep; return; } const C = S.camp; C.test = { keep, k };""")
rep("  S.units = P; C.s = ts; campGo(ts, 'down', P); toast(`🧪 인카운터 시험 — ${ts}S`);\n}",
    "  S.units = P; C.s = ts; campGo(ts, 'down', P); toast(`🧪 인카운터 시험 — ${ts}S · 지금 배치 그대로`);\n}")
# 시험을 그만두면: 훈련장 배치 · 맡긴 프롤로그
rep("function campQuit(q){\n  if (S.camp && S.camp.jr && (S.camp.jr.visits || []).length){", "function campQuit(q){\n  const TT = S.camp && S.camp.test;   /* v7.26.2 인카운터 시험 (지난 여정 기록은 건드리지 않음) */\n  if (S.camp && !TT && S.camp.jr && (S.camp.jr.visits || []).length){")
rep("  if (q !== true) toast(S.mode === 'story' ? '프롤로그를 접었어요 — 다시 시작할 수 있어요' : '캠페인을 끝내고 원래 배치로 돌아왔어요');\n}",
    "  if (TT){ if (S.mode !== 'train') setMode('train'); if (TT.keep && !S.story) S.story = TT.keep; save(); if (q !== true) toast('🧪 시험을 마치고 훈련장 배치로 돌아왔어요' + (TT.keep ? ' (프롤로그는 그대로)' : '')); return; }\n"
    "  if (q !== true) toast(S.mode === 'story' ? '프롤로그를 접었어요 — 다시 시작할 수 있어요' : '캠페인을 끝내고 원래 배치로 돌아왔어요');\n}")
rep("▶ 해 보기 = 스토리에서 새 프롤로그를 열고 그 만남으로 바로 (진행 중인 프롤로그는 사라짐).",
    "▶ 해 보기 = 지금 배치된 아군 그대로, 로딩 뒤 그 만남으로 바로 (그만두기를 누르면 훈련장 배치로 · 진행 중인 프롤로그는 그대로 남음).")

# 시험 중에 훈련장으로 가면: 시험 맵은 접고 (맡긴 프롤로그를 돌려놓음) — 시험을 프롤로그처럼 맡기지 않음
rep("function storyStash(){ if (!S.camp) return; S.story = ",
    "function storyStash(){ if (!S.camp) return; if (S.camp.test){ const T = S.camp.test, B = S.campBak; delete S.camp; delete S.campBak; if (B) boardSet(B); if (T.keep) S.story = T.keep; return; }   /* v7.26.2 인카운터 시험은 접음 */\n  S.story = ")
open(F, 'w', encoding='utf-8').write(s)
print('page7262 OK')
