def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:80], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
rep(T, "  if (setup.randStart) startScenario(W);   // v6.1 판마다 다른 시작", "  if (setup.randStart && !(opt && opt.noStart)) startScenario(W);   // v6.1 판마다 다른 시작 (배치 칸 미리보기는 놓은 자리 그대로)")
rep(P, "  preview = createWorld(S, rules, 1, { headless: true });", "  preview = createWorld(S, rules, 1, { headless: true, noStart: true });")
# 켜고 끄기
rep(P, '            <button class="btn" id="newMapBtn" type="button">새 맵</button>\n          </div>',
       '            <button class="btn" id="newMapBtn" type="button">새 맵</button>\n          </div>\n          <div class="row"><label class="ck" for="randStart"><input id="randStart" type="checkbox"> 적 시작 무작위 (판마다 다름 — 정면 대치 · 양쪽 협공 · 매복 · 후방 기습 · 행군 중 조우)</label></div>')
rep(P, "  $('autoTorchBtn').hidden = isGrid(S.type);\n}", "  $('autoTorchBtn').hidden = isGrid(S.type);\n  $('randStart').checked = !!S.randStart;   // v6.1\n}\n$('randStart').addEventListener('change', e => { S.randStart = e.target.checked; changed(); toast(S.randStart ? '적 시작 무작위 — 판마다 적의 시작 자리가 달라요 (아군 자리는 그대로)' : '적은 놓은 자리에서 시작해요'); });")
# 새 판 · 이전: 적 시작 무작위를 켬
s=open(P,encoding='utf8').read()
n=s.count("type: 'grid', W: 20, H: 14, mapC: false, seed: 1618")
s=s.replace("type: 'grid', W: 20, H: 14, mapC: false, seed: 1618", "type: 'grid', W: 20, H: 14, mapC: false, randStart: true, seed: 1618"); print('rand defaults', n)
open(P,'w',encoding='utf8').write(s)
rep(P, "Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: L.type === 'gridC', seed: L.seed, flips: [], units: L.units, torches: L.torches, draft: L.draft });\n  selId = null; renderDraft(); rebuildMap(); setMapUI(); changed(); centerStart(); hud();",
       "Object.assign(S, { type: L.type, W: L.W, H: L.H, mapC: L.type === 'gridC', randStart: L.randStart !== false, seed: L.seed, flips: [], units: L.units, torches: L.torches, draft: L.draft });\n  selId = null; renderDraft(); rebuildMap(); setMapUI(); changed(); centerStart(); hud();")
rep(P, "if (toOpen6(S)) setTimeout(", "if (S.randStart === undefined) S.randStart = true;   // v6.1 판마다 다른 시작 (기본 켬)\nif (toOpen6(S)) setTimeout(")
# 작전 이름
rep(P, "const PLAN_K = { assault: '밀어붙임', hold: '버팀', bait: '유인', hunt: '사냥', withdraw: '후퇴' };", "const PLAN_K = { assault: '밀어붙임', hold: '버팀', bait: '유인', hunt: '사냥', withdraw: '후퇴', wedge: '쐐기 돌파', encircle: '산개 포위' };")
rep(P, "hunt: '고립된 상대를 노림', withdraw:", "hunt: '고립된 상대를 노림', wedge: '가장 무거운 몸이 끝, 방패가 어깨 — 전열의 관절을 뚫고 뒤로 쏟아져 들어감', encircle: '방패 · 거구가 정면을 붙드는 사이 둘로 갈라져 옆으로 벌렸다 뒤로 돌아 들어감 · 궁수는 십자 사격', withdraw:")
rep(P, "hunt: '혼자 떨어진 쪽을 노린다.' };", "hunt: '혼자 떨어진 쪽을 노린다.', wedge: '무거운 놈을 앞세워 쐐기꼴로 모인다 — 한곳을 뚫으려 한다.', encircle: '넓게 흩어진다 — 옆으로 돌아 뒤를 감싸려 한다.' };")
START_K = "const START_K = { front: '정면 대치', pincer: '양쪽 협공', ambush: '매복', rear: '후방 기습', column: '행군 중 조우' };\n"
rep(P, "function pactTxt(Wd, e){", START_K + "function pactTxt(Wd, e){")
# 로그 줄
LOG = r"""      case 'start': out.push(`${T(e)}📋 적의 시작: ${e.desc}`); break;   // v6.1
      case 'focus': out.push(`${T(e)}◆ 적 지휘: 표적 ${n(e.b)} — 약한 고리 (${e.why})${e.was != null ? ' · ' + n(e.was) + '에서 바꿈' : ''} → 궁수 · 공격수가 몰리고, 방패 · 거구는 우리 탱커를 붙듦`); break;
      case 'wedge': out.push(`${T(e)}📋 쐐기 돌파: ${e.s === 'form' ? `끝 ${n(e.tip)} · 어깨 ${e.sh.map(n).join(' · ') || '없음'} · 몸통 ${e.body.map(n).join(' · ') || '없음'} → ${e.desc}` : e.s === 'breach' ? `${n(e.tip)}${jong(n(e.tip)) ? '이' : '가'} ${n(e.b)}에 부딪힘 — 뚫린 곳으로 ${e.body.map(n).join(' · ') || '몸통'}${e.body.length ? (jong(n(e.body[e.body.length - 1])) ? '이' : '가') : '이'} 뒤의 표적에게 쏟아져 들어감` : '끝 — ' + e.why}`); break;
      case 'env': out.push(`${T(e)}📋 산개 포위: ${e.s === 'form' ? `왼쪽 ${e.left.map(n).join(' · ') || '없음'} · 오른쪽 ${e.right.map(n).join(' · ') || '없음'} 이 넓게 벌려 뒤로 · 궁수 ${e.arch.map(n).join(' · ') || '없음'} 십자 사격 · 정면을 붙듦 ${e.hold.map(n).join(' · ') || '없음'}` : e.s === 'rear' ? `${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 뒤로 돌아 들어옴` : '끝 — ' + e.why}`); break;
      case 'ambush': out.push(`${T(e)}📋 매복이 터짐 — ${e.why === 'hit' ? n(e.a) + '이 들켜 맞음' : e.why === 'near' ? n(e.b) + '이 ' + n(e.a) + ' 곁 (4.5칸) 으로 옴' : '때가 됨 (10초)'} → 다 같이 뛰쳐나옴`); break;
      case 'plan': out.push("""
rep(P, "      case 'plan': out.push(", LOG)
NARR = r"""    case 'start': return { c: 'bad', s: e.s === 'ambush' ? '사방이 고요하다. 너무 고요하다…' : e.s === 'pincer' ? '적이 두 무리로 나뉘어 양옆 앞에 서 있다.' : e.s === 'rear' ? '앞에 적의 본대 — 그리고 뒤에서도 발소리가 난다!' : e.s === 'column' ? '길게 늘어선 적의 행렬과 마주쳤다.' : '적이 한 덩어리로 마주 서 있다.' };   // v6.1
    case 'focus': return { c: 'bad', s: `적의 눈이 모두 ${n(e.b)}에게 쏠린다 — ${e.why}.` };
    case 'wedge': return e.s === 'form' ? { c: 'bad', s: `${ga(n(e.tip))} 앞장서고 방패들이 어깨를 붙인다 — 쐐기다! ${e.desc.replace(/ \(.*\)$/, '')}를 노린다.` } : e.s === 'breach' ? { c: 'bad', s: `쐐기가 박혔다 — ${n(e.b)} 쪽이 뚫리며 적이 뒤로 쏟아져 들어온다!` } : null;
    case 'env': return e.s === 'form' ? { c: 'bad', s: `적이 넓게 흩어진다 — 양옆으로 돌아 뒤를 감싸려 한다.` } : e.s === 'rear' ? { c: 'bad', s: `${ga(n(e.a))} 뒤로 돌아 들어왔다!` } : null;
    case 'ambush': return { c: 'bad', s: e.why === 'hit' ? '어둠 속에 숨어 있던 적이 들켰다 — 양옆에서 일제히 뛰쳐나온다!' : '매복이다! 양옆 어둠에서 적이 뛰쳐나온다!' };
    case 'plan': return { c:"""
rep(P, "    case 'plan': return { c:", NARR)
print('ok')
