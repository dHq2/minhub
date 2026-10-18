s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:80],s.count(a)); s=s.replace(a,b)

# 1 header / version
rep("""<!-- 굴의 전투판 v3.4 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
""","""<!-- 굴의 전투판 v4.0 (2026-10-10) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v4.0: 사선 · 방어 자세 · 경계 AI. '적 발견 → 즉시 공격' 대신 '발견 → 경계 → 기회가 있을 때 공격'.
           사선: 날아가는 공격은 선 위에 먼저 걸리는 몸 (방패 · 대검 · 사람) 이 맞음. 방어 자세로 앞을 보고 있으면 막고, 아군이면 오사.
           아군 사수는 동료가 사선에 있으면 쏘지 않음 (공격 명령이어도). 막힌 사선이면 옆으로 자리를 옮겨 다른 사선을 찾음.
           방어 자세 (방패 · 대검): 앞에서 오는 공격 피해 ×0.2, 막을 때마다 자세 −30 (100 중), 0 이 되면 2초 동안 무너짐. 대검은 자기 공격 중엔 못 막음.
           탄약 (총 8 · 저격총 5 · 샷건 4 · 활 12, 마법은 무한) · 총성 (총 · 저격총 · 샷건): 쏜 자리에 '!' 이 3초 남고, 10칸 안에서 쏜 쪽을 못 보던 상대가 그 자리를 앎 (쏜 쪽을 따라붙지는 않음).
           원거리 명중률: 가까우면 95%, 사거리 끝이면 무기마다 (총 45% · 저격총 80% · 활 50%). 움직이는 상대는 덜 맞음.
           죽기 쉬움: 피해 ×2. 맞은 부위 (머리 · 몸통 · 팔 · 다리) 로 피해 · 상처가 흔들림 — 머리 ×2 (옆 · 뒤 · 공격 중이면 더 잘 맞음), 팔 = 공격 줄어듦, 다리 = 느려짐. 맞으면 잠깐 움찔 (느려짐).
           AI: 살아남기 (막아서기 · 숨기 · 물러남) · 기다리기 (사선이 막힘 · 아군 오사 위험 · 맞힐 확률이 낮음) · 노리기 (상대가 공격 중 · 옆이나 뒤 · 자세 무너짐).
           대담함 (0~1, 인물마다): 옐로 0.8 · 짐승 0.75 · 기동 0.7 · 근접 0.5 · 지휘 0.4 · 원거리 0.35 · 치유 0.2 · 저격총 0.15. 높을수록 짧은 기회에도 뛰어듦.
           어둠 속 AI 는 보이는 모습과 마지막으로 본 자리 · 총성 자리만으로 판단 (숨은 상대의 방어 자세는 모름). 몸이 닿을 만큼 붙으면 어둠 속에서도 앎.
           화면: 기분 (경계 · 자리 잡기 · 사선에 아군 · 막아서기 · 물러남 …) 을 카드 · 판 · 설명 상자에, 탄약 · 자세 막대 · 상처, 총성 '!'. '사선 예제' 배치 (포렌 g3 · 옐로 h3 · 인주 h2 · 저격총수 h9).
""")
rep("""<span class="ver">v3.4 · 한 턴씩 · 도감 2026-10-10 기준</span>""","""<span class="ver">v4.0 · 한 턴씩 · 사선 · 경계 · 도감 2026-10-10 기준</span>""")
rep("""<p class="lede">도감에서 뽑은 동료 둘과 주인공이 횃불 하나로 싸우는 실험판. 한 턴 동안 모두가 동시에 움직이고, 턴이 끝나면 멈춰서 명령을 받아요. 아군은 빛 안의 적만 보고, 적은 야시라 어둠 속에서도 봐요.</p>""",
"""<p class="lede">도감에서 뽑은 동료 둘과 주인공이 횃불 하나로 싸우는 실험판. 한 턴 동안 모두가 동시에 움직이고, 턴이 끝나면 멈춰서 명령을 받아요. 날아가는 공격은 사선에 먼저 걸리는 몸이 맞고, 모두가 경계하다가 기회가 올 때 쳐요. 죽기 쉬우니 막고 숨고 거리를 두세요.</p>""")
rep("""  <footer>굴의 전투판 v3.4 — ""","""  <footer>굴의 전투판 v4.0 — """)
rep("""copyText('굴의 전투판 v3.4 자동 판 기록""","""copyText('굴의 전투판 v4.0 자동 판 기록""")

# 2 traits / profile / bold
rep("""  '방패': '앞쪽에서 받는 피해가 줄고, 방패 뒤로 날아오는 공격을 막아 줌',
};""","""  '방패': '방어 자세: 앞에서 오는 공격을 막음 (피해 ×0.2, 막을 때마다 자세가 깎임). 사선에 서면 뒤의 아군을 가려 줌. 자기 공격 중에도 막음',
  '방어 자세': '방패 · 대검: 앞에서 오는 공격을 막음 (피해 ×0.2, 자세가 깎임 · 0 이면 잠깐 무너짐). 사선에 서면 뒤의 아군을 가려 줌',
};""")
rep("""const EXTRA_TRAITS = Object.keys(TRAITS).filter(k => k !== '야시' && k !== '방패');""","""const EXTRA_TRAITS = Object.keys(TRAITS).filter(k => k !== '야시' && k !== '방패' && k !== '방어 자세');""")
rep("""  'C-076': { nv: false, traits: ['높은후각'], tactic: '포위 전술', note: '무리를 지어 상대의 옆과 뒤로 돌아 들어오는 것을 즐겨 씀 (지금은 설명만, 움직임은 다른 적과 같음)' },
};""","""  'C-076': { nv: false, traits: ['높은후각'], tactic: '포위 전술', note: '무리를 지어 상대의 옆과 뒤로 돌아 들어오는 것을 즐겨 씀 (v4.0: 다른 편과 맞붙은 상대에게는 옆 · 뒤로 돌아 들어감 — 모든 인물 공통 규칙)' },
};
// 대담함 (0~1): 인물마다 따로 정한 값. 없으면 엔진이 무기 · 직업으로 정함 (짐승 0.75 · 기동 0.7 · 근접 0.5 · 지휘 0.4 · 원거리 0.35 · 치유 0.2 · 저격총 0.15)
const BOLD_REF = { 'C-008': 0.8 };   // 옐로: 짧은 기회에도 뛰어듦""")
rep("""function unitFromRef0(ref, side, extra){ const r = RBY[ref]; return { id: uid(), ref, name: r[1], tier: r[3] || 1, cls: r[4], sm: r[9] || 1, shield: !!r[10], weapon: r[11] || '', side, x: 0, y: 0, nv: side === 1, hero: false, ov: {}, grp: uid(), ...extra }; }""",
"""function unitFromRef0(ref, side, extra){ const r = RBY[ref]; return { id: uid(), ref, name: r[1], tier: r[3] || 1, cls: r[4], sm: r[9] || 1, shield: !!r[10], weapon: r[11] || '', side, x: 0, y: 0, nv: side === 1, hero: false, ov: {}, grp: uid(), ...(BOLD_REF[ref] != null ? { bold: BOLD_REF[ref] } : {}), ...extra }; }""")

# 3 example line preset (after example())
rep("""// 아군은 시작 자리 둘레로, 적은 무리째 멀리. torches = 벽 횃불도 다시""","""// 사선 예제 (민수 화면): 포렌 g3 (대검) · 옐로 h3 · 인주 h2 (창) ↔ 저격총수 h9 · 검사 d8 · 똥개 k8
const at = (S, c) => ({ x: 'abcdefghijklmnopqrstuvwxyz'.indexOf(c[0]) + 0.5, y: S.H - (+c.slice(1)) + 0.5 });
function exampleLine(){
  const S = { v: 3, v4: true, type: 'gridC', W: 14, H: 10, mapC: true, seed: 1618, flips: [], units: [], torches: [], rules: clone(DEFAULT_RULES), hist: [], draft: { cands: [], picks: ['C-006', 'C-008'], done: true } };
  const put = (ref, side, c, ex) => S.units.push({ ...unitFromRef(ref, side, ex), ...at(S, c) });
  put('C-001', 0, 'h2', { hero: true, nv: false, weapon: '창' }); put('C-006', 0, 'g3', { nv: false, weapon: '대검' }); put('C-008', 0, 'h3', { nv: false });
  put('C-159', 1, 'h9'); put('C-052', 1, 'd8'); put('C-076', 1, 'k8');
  for (const u of S.units) u.face = u.side ? Math.PI / 2 : -Math.PI / 2;
  S.torches = autoTorches(buildMap(S), S.seed, Math.round(S.W * S.H / 420));
  return S;
}
// 아군은 시작 자리 둘레로, 적은 무리째 멀리. torches = 벽 횃불도 다시""")

# 4 migrations
rep("""if (!S.draft) S.draft = { ...newDraft(), done: true,""","""// v4.0: 무기표에 탄약 · 총성 · 방어 · 명중을 채움 (한 번만), 방패 앞쪽 피해 규칙은 방어 자세로 바뀜, 옐로 대담함
if (!S.v4){
  for (const w in DEFAULT_RULES.weapons){ if (!S.rules.weapons[w]) S.rules.weapons[w] = clone(DEFAULT_RULES.weapons[w]); else for (const k in DEFAULT_RULES.weapons[w]) if (S.rules.weapons[w][k] === undefined) S.rules.weapons[w][k] = DEFAULT_RULES.weapons[w][k]; }
  delete S.rules.shieldFront;
  for (const u of S.units) if (u.bold === undefined && BOLD_REF[u.ref] != null) u.bold = BOLD_REF[u.ref];
  S.v4 = true;
}
if (!S.draft) S.draft = { ...newDraft(), done: true,""")
rep("""function example(){
  const S = { v: 3, type: 'gridC',""","""function example(){
  const S = { v: 3, v4: true, type: 'gridC',""")
open('page10.tpl.html','w').write(s)
print('ok')
