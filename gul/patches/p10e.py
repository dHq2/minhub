s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
rep("""hist: [], draft: { cands: [], picks: ['C-006', 'C-008'], done: true } };""","""hist: [], draft: { cands: ['C-006', 'C-008'], picks: ['C-006', 'C-008'], done: true } };""")
# buttons
rep("""            <button class="btn" id="scatterBtn" type="button">적 무리 다시 흩기</button>""","""            <button class="btn" id="lineExBtn" type="button">사선 예제 놓기</button>
            <button class="btn" id="scatterBtn" type="button">적 무리 다시 흩기</button>""")
rep("""$('scatterBtn').addEventListener('click', () => { placeAll(S, false, true); afterMap(); toast('적 무리를 다시 흩었어요'); });""",
"""$('scatterBtn').addEventListener('click', () => { placeAll(S, false, true); afterMap(); toast('적 무리를 다시 흩었어요'); });
$('lineExBtn').addEventListener('click', () => {
  if (mode !== 'edit'){ toast('⟲ 배치로를 누른 뒤에 놓을 수 있어요'); return; }
  const L = exampleLine();
  Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: true, seed: L.seed, flips: [], units: L.units, torches: L.torches, draft: L.draft });
  selId = null; renderDraft(); rebuildMap(); setMapUI(); changed(); centerStart(); hud();
  toast('사선 예제: 포렌 g3 (대검) · 옐로 h3 · 인주 h2 (창) ↔ 저격총수 h9 · 검사 d8 · 똥개 k8');
});""")
rep("""<p class="note">격자는 바위 없는 판이에요.""","""<p class="note">사선 예제 = 포렌 g3 (대검, 방어 자세) · 옐로 h3 · 인주 h2 (창) 와 저격총수 h9 · 검사 d8 · 똥개 k8. 격자는 바위 없는 판이에요.""")
# rules tab boxes
rep("""        <div class="box"><p class="lab">무기표 (사거리 = 공격 범위, 몸 가장자리끼리 칸)</p><div class="tw"><table class="tbl" id="wpnTbl"></table></div></div>""",
"""        <div class="box"><p class="lab">무기표 (사거리 = 공격 범위, 몸 가장자리끼리 칸 · 탄약 빈칸 = 무한 · 명중 빈칸 = 규칙의 사거리 끝 명중률)</p><div class="tw"><table class="tbl" id="wpnTbl"></table></div></div>
        <div class="box"><p class="lab">사선 · 방어 자세 · 죽기 쉬움 (v4.0)</p><div class="tw"><table class="tbl" id="v4Tbl"></table></div></div>
        <div class="box"><p class="lab">맞은 부위 (비율 · 피해 ×) — 옆 · 뒤 · 공격 중이면 머리 비율 두 배</p><div class="tw"><table class="tbl" id="partTbl"></table></div></div>""")
rep("""  $('wpnTbl').innerHTML = '<thead><tr><th class="l">무기</th><th>사거리</th><th class="l">쓰는 인물 (명단)</th></tr></thead><tbody>' + Object.keys(rules.weapons).map(w => `<tr><td class="l">${esc(w)}</td><td>${n(`weapons.${w}.rng`, rules.weapons[w].rng, 0.05)}</td><td class="l">${ROSTER.filter(r => r[11] === w).length}명</td></tr>`).join('') + '</tbody>';""",
"""  const o = (path, v, step, ph) => `<input type="number" step="${step}" data-r="${path}" data-opt="1" value="${v != null ? v : ''}" placeholder="${ph}" aria-label="${path}">`;
  const ck = (path, v) => `<input type="checkbox" data-rb="${path}" ${v ? 'checked' : ''} aria-label="${path}">`;
  $('wpnTbl').innerHTML = '<thead><tr><th class="l">무기</th><th>사거리</th><th>탄약</th><th>끝 명중</th><th>총성</th><th>방어</th><th class="l">명단</th></tr></thead><tbody>' + Object.keys(rules.weapons).map(w => { const W = rules.weapons[w], far = W.rng > 1; return `<tr><td class="l">${esc(w)}</td><td>${n(`weapons.${w}.rng`, W.rng, 0.05)}</td><td>${far ? o(`weapons.${w}.ammo`, W.ammo, 1, '무한') : ''}</td><td>${far ? o(`weapons.${w}.aim`, W.aim, 0.05, rules.aimFar) : ''}</td><td>${far ? ck(`weapons.${w}.loud`, W.loud) : ''}</td><td>${far ? '' : ck(`weapons.${w}.guard`, W.guard)}</td><td class="l">${ROSTER.filter(r => r[11] === w).length}명</td></tr>`; }).join('') + '</tbody>';
  $('v4Tbl').innerHTML = '<tbody>' + [['lethal', '피해 배율 (죽기 쉬움, 모든 공격 ×)', 0.1], ['blockMul', '방어 자세로 막으면 받는 피해 ×', 0.05], ['postCost', '막을 때마다 깎이는 자세 (100 중)', 5], ['postRegen', '자세 회복 (초당, 1초 동안 안 막으면)', 5], ['breakTime', '자세가 무너지면 못 막는 시간 (초)', 0.25], ['aimNear', '원거리 명중률: 아주 가까이', 0.05], ['aimFar', '원거리 명중률: 사거리 끝 (무기표가 비었을 때)', 0.05], ['hear', '총성이 들리는 거리 (칸)', 0.5], ['noiseTime', "총성 '!' 이 남는 시간 (초)", 0.5], ['pinTime', '맞으면 움찔 (이동 ×0.4) 하는 시간 (초)', 0.1]].map(row).join('') + '</tbody>';
  $('partTbl').innerHTML = '<thead><tr><th class="l">부위</th><th>비율</th><th>피해 ×</th><th class="l">상처 (체력 10% 넘게 맞으면)</th></tr></thead><tbody>' + Object.keys(rules.parts).map(k => `<tr><td class="l">${esc(k)}</td><td>${n(`parts.${k}.w`, rules.parts[k].w, 0.02)}</td><td>${n(`parts.${k}.mul`, rules.parts[k].mul, 0.1)}</td><td class="l">${k === '팔' ? '공격 ×0.85' : k === '다리' ? '속력 ×0.8' : '―'}</td></tr>`).join('') + '</tbody>';""")
rep("""['flankBack', '뒤에서 친 피해 ×', 0.05], ['shieldFront', '방패: 앞쪽에서 받는 피해 ×', 0.05], ['jitter',""","""['flankBack', '뒤에서 친 피해 ×', 0.05], ['jitter',""")
rep("""$('pane-rules').addEventListener('change', e => {
  const path = e.target.dataset.r; if (!path) return;
  let v = +e.target.value; if (!isFinite(v) || v < 0) return;
  const ks = path.split('.'); let o = rules; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
  const last = ks[ks.length - 1];""","""$('pane-rules').addEventListener('change', e => {
  const pb = e.target.dataset.rb;
  if (pb){ const ks = pb.split('.'); let o = rules; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]]; if (e.target.checked) o[ks[ks.length - 1]] = true; else delete o[ks[ks.length - 1]]; S.rules = rules; save(); rebuildPreview(); renderSel(); if (world) toast('수치는 다음 판부터 적용돼요'); return; }
  const path = e.target.dataset.r; if (!path) return;
  if (e.target.dataset.opt && e.target.value.trim() === ''){ const ks = path.split('.'); let o = rules; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]]; delete o[ks[ks.length - 1]]; S.rules = rules; save(); rebuildPreview(); renderRules(); return; }
  let v = +e.target.value; if (!isFinite(v) || v < 0) return;
  const ks = path.split('.'); let o = rules; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
  const last = ks[ks.length - 1];""")
rep("""<p class="note">거리는 칸 단위, 속도는 초당 칸.""","""<p class="note">대담함 기본값 (인물마다 고칠 수 있음): 짐승 (이빨·발톱) 0.75 · 기동 0.7 · 근접 0.5 · 지휘 0.4 · 원거리 0.35 · 치유 0.2 · 저격총 0.15 · 옐로 0.8. 대담할수록 상대가 막고 있어도 밀어붙이고, 맞힐 확률이 낮아도 쏘고, 겁이 많으면 체력 30% 아래에서 물러나요.</p>
        <p class="note">거리는 칸 단위, 속도는 초당 칸.""")
# editor bold + shield label
rep("""<label class="ck" for="selShield"><input id="selShield" type="checkbox" ${p.shield ? 'checked' : ''}> 방패</label>""","""<label class="ck" for="selShield"><input id="selShield" type="checkbox" ${p.shield ? 'checked' : ''}> 방패 (방어 자세)</label>""")
rep("""    <div class="grid6">${f('hp', '체력')}""","""    <div class="row"><label class="brush" for="selBold">대담함 (0~1) <input id="selBold" type="number" min="0" max="1" step="0.05" value="${p.bold != null ? p.bold : ''}" placeholder="${boldOf({ ...p, bold: null })}"></label><span class="brush">${(rules.weapons[p.weapon] || {}).guard && !p.shield ? '대검: 방어 자세 (자기 공격 중엔 못 막음)' : ''}</span></div>
    <div class="grid6">${f('hp', '체력')}""")
rep("""  if (e.target.id === 'selShield'){ p.shield = e.target.checked; changed(); return; }""","""  if (e.target.id === 'selShield'){ p.shield = e.target.checked; changed(); return; }
  if (e.target.id === 'selBold'){ const v = e.target.value.trim(); if (v === '' || !isFinite(+v)) delete p.bold; else p.bold = Math.max(0, Math.min(1, +v)); changed(); return; }""")
open('page10.tpl.html','w').write(s)
print('ok')
