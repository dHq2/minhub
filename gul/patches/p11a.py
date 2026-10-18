s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
# header
rep("""<!-- 굴의 전투판 v4.0 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
""","""<!-- 굴의 전투판 v4.1 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v4.1: 감각 · 정보 · expert 적. 같은 정보 · 이동 · 공격 규칙을 인물마다 다르게 씀.
           후각 A (4칸 안은 정확히, 9칸까지는 대략적인 방향 · 거리) · S (맵 전체). 포렌 [높은후각 A]: 3초마다 보이지 않는 적을 브리핑 ("오른쪽 뒤, 둘 — 가까이. 가까워진다"),
           판에 보라색 부채꼴로 표시. 브리핑 · 짖는 소리 · 총성으로 안 방향은 '감지' 일 뿐 공격을 막아 주지 않음. 경계 중인 아군은 감지한 방향들을 번갈아 살핌 (자동).
           방어 = '어느 방향을 얼마나 지키나'. 막는 폭 (±도): 방패 60 · 대검 40 · 포렌 [반사신경] 맨몸 20 · [반사신경] + 대검 55 (자세도 덜 깎임). 판에 방어 방향 부채꼴.
           돌아서는 데 시간이 걸림 (초당 300°). 둘이 다른 방향에서 오면 한쪽을 골라야 함.
           적은 expert: 불리한 교전을 피하고 (상대 둘레에 상대 편이 더 많으면 손 닿는 거리 밖에서 위협 · 다가오면 물러섬), 유리한 자리를 찾고, 빈틈이 생기면 침. 지루해서 돌진하지 않음.
           개 (포위 사냥): 앞의 개가 짖으며 붙잡아 두고 다른 개는 빈 옆 · 뒤로. 틈 (공격 중 · 등 · 막는 폭 밖 · 움찔) 이 나면 물고 곧바로 거리를 벌림. 짖는 소리는 위치를 드러냄 ('멍!').
           검사 · 저격총수: 야시 없음, 불빛 (주인공 횃불은 멀리서도) 으로 위치를 앎. 자기 자리가 어두우면 '안 보일 것' 이라 믿고 (포렌의 코 · 새 횃불로 틀릴 수 있음) 뒤쪽 어둠으로 돎.
           상대 둘레에 상대 편이 둘 이상이면 들어가지 않고 갈라지는 순간을 기다림. 친 뒤 몰려들면 어둠으로 빠짐.
           암살: 옆 · 뒤에서, 알아차리지 못한 (못 봄 · 감지 없음 · 공격 동작에 묶임 · 앞의 상대와 맞붙음) 상대에게 근접 무기가 들어가면 치명상 ×3. 비명으로 둘레 동료가 친 자리를 앎.
           판 왼쪽 위 이야기 상자는 위아래로 올려 지난 일을 볼 수 있음 (맨 아래에 있으면 새 줄을 따라감).
""")
rep("""<span class="ver">v4.0 · 한 턴씩 · 사선 · 경계 · 도감 2026-10-10 기준</span>""","""<span class="ver">v4.1 · 한 턴씩 · 사선 · 감각 · expert 적 · 도감 2026-10-10 기준</span>""")
rep("""  <footer>굴의 전투판 v4.0 — ""","""  <footer>굴의 전투판 v4.1 — """)
rep("""copyText('굴의 전투판 v4.0 자동 판 기록""","""copyText('굴의 전투판 v4.1 자동 판 기록""")
rep("""  return `굴의 전투판 v4.0 · ${title}""","""  return `굴의 전투판 v4.1 · ${title}""")
# traits / profile
rep("""  '높은후각': '빛이 없어도 가까운 상대 (기본 4칸) 는 냄새로 찾아냄. 바위 너머도 맡음',""","""  '높은후각': 'A: 빛이 없어도 4칸 안은 냄새로 정확히, 9칸까지는 대략적인 방향과 거리. S: 맵 전체를 대략. 바위 너머도 맡음. 아군이면 3초마다 동료에게 브리핑',
  '반사신경': '반사신경과 직감: 방패 없이도 바라보는 좁은 방향 (±20°) 의 공격을 믿을 만하게 막음. 대검 · 방패를 들면 ±55° 로 넓어짐. 자세가 덜 깎임',""")
rep("""const PROFILE = {
  'C-076': { nv: false, traits: ['높은후각'], tactic: '포위 전술', note: '무리를 지어 상대의 옆과 뒤로 돌아 들어오는 것을 즐겨 씀 (v4.0: 다른 편과 맞붙은 상대에게는 옆 · 뒤로 돌아 들어감 — 모든 인물 공통 규칙)' },
};""","""// tac (엔진이 읽는 전술): pack = 포위 사냥, stalk = 어둠 속 우회. nv 는 적일 때만
const PROFILE = {
  'C-076': { nv: false, traits: ['높은후각'], tac: 'pack', tactic: '포위 사냥', note: '한 마리가 앞에서 짖으며 붙잡아 두고, 다른 개는 빈 옆 · 뒤로 돈다. 등을 보이거나 공격 중 · 움찔하면 물고 곧바로 거리를 벌려 계속 괴롭힘. 틈이 없으면 거리를 유지' },
  'C-159': { nv: false, tac: 'stalk', tactic: '어둠 속 저격', note: '야시는 없지만 불빛으로 위치를 앎. 어두운 자리에서만, 사선이 열리고 확실할 때 쏨. 막는 방향으로는 쏘지 않고 다른 사선을 찾거나 보호 밖으로 나오길 기다림' },
  'C-052': { nv: false, tac: 'stalk', tactic: '우회 · 암살', note: '야시는 없지만 불빛으로 위치를 앎. 셋에게 혼자 들어가지 않음. 어둠으로 돌아 등 뒤를 노리고, 갈라지는 순간 들어감. 무방비한 등에 들어가면 치명상' },
  'C-006': { traits: ['높은후각', '반사신경'], tactic: '브리핑 · 일점 방어', note: '냄새로 맡은 적의 대략적인 방향 · 거리를 3초마다 동료에게 알림. 반사신경으로 바라보는 좁은 방향을 믿을 만하게 막음 (대검이면 넓어짐)' },
};
function applyProfile(u, keepNv){ const pf = PROFILE[u.ref]; if (!pf) return u; if (pf.nv !== undefined && u.side === 1 && !keepNv) u.nv = pf.nv; if (pf.traits) u.traits = [...new Set([...(u.traits || []), ...pf.traits])]; if (pf.tac) u.tac = pf.tac; u.tactic = pf.tactic; u.note = pf.note; return u; }""")
rep("""function unitFromRef(ref, side, extra){ const u = unitFromRef0(ref, side, extra), pf = PROFILE[ref]; if (pf && side === 1){ if (pf.nv !== undefined && !(extra && 'nv' in extra)) u.nv = pf.nv; u.traits = pf.traits.slice(); u.tactic = pf.tactic; u.note = pf.note; } return u; }""",
"""function unitFromRef(ref, side, extra){ return applyProfile(unitFromRef0(ref, side, extra), !!(extra && 'nv' in extra)); }""")
rep("""for (const u of S.units) if (u.traits === undefined){ u.traits = []; const pf = PROFILE[u.ref]; if (pf && u.side === 1){ if (pf.nv !== undefined) u.nv = pf.nv; u.traits = pf.traits.slice(); u.tactic = pf.tactic; u.note = pf.note; } }   // 예전 배치에 특성""",
"""for (const u of S.units) if (u.traits === undefined){ u.traits = []; applyProfile(u); }   // 예전 배치에 특성
// v4.1: 전술 (포위 사냥 · 어둠 속 우회) · 포렌 후각 · 반사신경 · 검사 · 저격총수 야시 없음
if (!S.v41){ for (const u of S.units) applyProfile(u); S.v41 = true; }""")
rep("""  const S = { v: 3, v4: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: newDraft() };""","""  const S = { v: 3, v4: true, v41: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: newDraft() };""")
rep("""  const S = { v: 3, v4: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: { cands:""","""  const S = { v: 3, v4: true, v41: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: { cands:""")
# example line: two dogs like the user's map
rep("""  put('C-159', 1, 'h9'); put('C-052', 1, 'd8'); put('C-076', 1, 'k8');""","""  put('C-159', 1, 'h9'); put('C-052', 1, 'd8'); put('C-076', 1, 'k8'); put('C-076', 1, 'l7');""")
rep("""// 사선 예제 (민수 화면): 포렌 g3 (대검) · 옐로 h3 · 인주 h2 (창) ↔ 저격총수 h9 · 검사 d8 · 똥개 k8""","""// 사선 예제 (민수 화면): 포렌 g3 (대검) · 옐로 h3 · 인주 h2 (창) ↔ 저격총수 h9 · 검사 d8 · 똥개 k8 · l7""")
rep("""  toast('사선 예제: 포렌 g3 (대검) · 옐로 h3 · 인주 h2 (창) ↔ 저격총수 h9 · 검사 d8 · 똥개 k8');""","""  toast('사선 예제: 포렌 g3 (대검) · 옐로 h3 · 인주 h2 (창) ↔ 저격총수 h9 · 검사 d8 · 똥개 k8 · l7');""")
rep("""<p class="note">사선 예제 = 포렌 g3 (대검, 방어 자세) · 옐로 h3 · 인주 h2 (창) 와 저격총수 h9 · 검사 d8 · 똥개 k8.""","""<p class="note">사선 예제 = 포렌 g3 (대검, 반사신경 · 후각 A) · 옐로 h3 · 인주 h2 (창) 와 저격총수 h9 · 검사 d8 · 똥개 k8 · l7.""")

# ---- narration box: scrollable, keeps history
rep(""".narr{position:absolute;left:8px;top:8px;width:min(340px,48%);display:flex;flex-direction:column;gap:3px;font:500 12.5px/1.45 var(--body);color:#ece4d6;background:rgba(12,10,16,.66);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:7px 10px;pointer-events:none;z-index:2}""",
""".narr{position:absolute;left:8px;top:8px;width:min(360px,48%);max-height:min(190px,32%);overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:3px;font:500 12.5px/1.45 var(--body);color:#ece4d6;background:rgba(12,10,16,.7);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:7px 10px;z-index:2;scrollbar-width:thin;scrollbar-color:rgba(236,228,214,.35) transparent}
.narr::-webkit-scrollbar{width:6px} .narr::-webkit-scrollbar-thumb{background:rgba(236,228,214,.3);border-radius:3px}
.narr .old{opacity:.7}""")
rep("""  const L = narr.lines.slice(-7);
  box.hidden = false;
  box.innerHTML = L.map((l, k) => `<p class="${l.c || ''}" style="opacity:${(0.45 + 0.55 * (k + 1) / L.length).toFixed(2)}">${esc(l.s)}</p>`).join('');
}""","""  box.hidden = false;
  // 지난 일은 위로 올려 볼 수 있음. 맨 아래를 보고 있을 때만 새 줄을 따라 내려감
  if (narr.shown === narr.lines.length && box.childElementCount) return;
  if (narr.lines.length > 400) narr.lines = narr.lines.slice(-400);
  const atEnd = !narr.shown || box.scrollTop + box.clientHeight >= box.scrollHeight - 12, n = narr.lines.length;
  box.innerHTML = narr.lines.map((l, k) => `<p class="${l.c || ''}${k < n - 6 ? ' old' : ''}">${esc(l.s)}</p>`).join('');
  narr.shown = n;
  if (atEnd) box.scrollTop = box.scrollHeight;
}""")
rep("""        <div class="narr" id="narr" hidden></div>""","""        <div class="narr" id="narr" hidden aria-label="전투 이야기 (위아래로 올려 지난 일 보기)" tabindex="0"></div>""")
open('page10.tpl.html','w').write(s)
print('ok')
