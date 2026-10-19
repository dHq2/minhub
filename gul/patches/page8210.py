# v8.2.1 페이지 — page8210.py v1.1 (v1.1: 자동 시험 스위치 window.__askAuto — 켜면 확인 창이 바로 답함 (예전 dialog 자동 수락과 같게) · v1.0: 확인 · 입력 창을 판 위의 창으로: 아티팩트 화면은 브라우저 confirm · prompt 를 막아 그만두기 등이 눌러도 아무 일이 없었음. page8200.py 를 먼저 돌림)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8200.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.2.0 (2026-10-19)', '<!-- 굴의 전투판 v8.2.1 (2026-10-19)')
rep('     v8.2.0: ', '''     v8.2.1: 고침 — 그만두기 (프롤로그 · 여정 · 첫 화면) · 새로 시작 · 모드 바꾸기 · 아군 두고 가기 · 동료 떠나보냄 · 인카운터 시험 · 층 저장 · 설계 붙여넣기가 눌러도 아무 일이 없던 것.
         아티팩트 화면은 브라우저의 확인 · 입력 창을 막음 → 판 위에 직접 그리는 확인 · 입력 창으로 바꿈 (Enter = 예 · Esc = 아니오).
     v8.2.0: ''')
for a, b in (('h1::after{content:" v8.2.0"', 'h1::after{content:" v8.2.1"'), ('<footer>굴의 전투판 v8.2.0', '<footer>굴의 전투판 v8.2.1'), ('return `굴의 전투판 v8.2.0 · ${title}', 'return `굴의 전투판 v8.2.1 · ${title}'),
             ("copyText('굴의 전투판 v8.2.0 자동 판 기록", "copyText('굴의 전투판 v8.2.1 자동 판 기록"), ("ver: '8.2.0', kind: '1F 여정 기록'", "ver: '8.2.1', kind: '1F 여정 기록'"),
             ("o.push('굴의 전투판 v8.2.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v8.2.1 — 1F 프롤로그 여정 기록'"),
             ('의 버전 기록에 — v8.2.0 30층 결승', '의 버전 기록에 — v8.2.1 그만두기 고침 (확인 창) / v8.2.0 30층 결승'),
             ('">v8.2.0 · 30층 결승</span>', '">v8.2.1 · 그만두기 고침</span>')):
    rep(a, b)

# ---------- 판 위의 확인 · 입력 창 ----------
rep("function toast(msg){", r"""/* v8.2.1 판 위의 확인 · 입력 창 — 아티팩트 화면 (sandbox) 은 브라우저 confirm · prompt 를 막음 (바로 '아니오' · 빈 값) */
let askOpen = null;
function askBox(msg, ok, no, input){
  return new Promise(res => {
    if (askOpen) askOpen(null); let el = $('askBox'); if (el) el.remove();
    if (!$('askCss')){ const st = document.createElement('style'); st.id = 'askCss'; st.textContent = `.askbox{position:fixed;inset:0;z-index:300;background:rgba(4,3,8,.62);display:flex;align-items:center;justify-content:center;padding:16px}
.askbox .askin{background:#17141f;color:#ece6da;border:1px solid #3b3350;border-radius:14px;padding:16px;max-width:440px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,.6)}
.askbox p{margin:0 0 12px;line-height:1.5;font-size:15px;white-space:pre-wrap}.askbox .row{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
.askbox input,.askbox textarea{width:100%;box-sizing:border-box;margin:0 0 12px;padding:8px;border-radius:8px;border:1px solid #4a4160;background:#0e0c14;color:#ece6da;font:inherit}.askbox textarea{min-height:140px}`; document.head.appendChild(st); }
    el = document.createElement('div'); el.id = 'askBox'; el.className = 'askbox';
    el.innerHTML = `<div class="askin" role="dialog" aria-modal="true"><p></p>${input ? (input.big ? '<textarea></textarea>' : '<input type="text">') : ''}<div class="row"><button class="btn" type="button" data-ask="0"></button><button class="btn go" type="button" data-ask="1"></button></div></div>`;
    el.querySelector('p').textContent = msg; el.querySelector('[data-ask="1"]').textContent = ok || '예'; el.querySelector('[data-ask="0"]').textContent = no || '아니오';
    const fld = el.querySelector('input, textarea'); if (fld) fld.value = input.def || '';
    document.body.appendChild(el);
    const key = e => { if (!askOpen) return; e.stopPropagation(); if (e.key === 'Escape'){ e.preventDefault(); done(false); } else if (e.key === 'Enter' && !(fld && fld.tagName === 'TEXTAREA' && !e.ctrlKey)){ e.preventDefault(); done(true); } };
    const done = v => { if (!askOpen) return; askOpen = null; window.removeEventListener('keydown', key, true); const val = fld ? (v ? fld.value : null) : !!v; el.remove(); res(val); };
    askOpen = v => done(v);
    window.addEventListener('keydown', key, true);
    el.addEventListener('click', e => { const b = e.target.closest('[data-ask]'); if (b) done(b.dataset.ask === '1'); else if (e.target === el) done(false); });
    setTimeout(() => { (fld || el.querySelector('[data-ask="1"]')).focus(); if (fld && fld.select) fld.select(); }, 0);
  });
}
const askNow = v => ({ then(f){ f(v); return this; } });   // 자동 시험 (window.__askAuto) — 바로 답함
const askYes = (msg, ok, no) => window.__askAuto != null ? askNow(!!window.__askAuto) : askBox(msg, ok, no);
const askText = (msg, def, big) => window.__askAuto != null ? askNow(window.__askAuto ? (def || '') : null) : askBox(msg, '확인', '취소', { def: def || '', big: !!big });
function toast(msg){""")

# 층 저장 (입력)
rep("    const name = (prompt('층 이름 (같은 이름이면 덮어써요)', k + '층') || '').trim(); if (!name) return;",
    "    askText('층 이름 (같은 이름이면 덮어써요)', k + '층').then(nm => { const name = (nm || '').trim(); if (!name) return;   /* v8.2.1 판 위의 입력 창 */")
rep("    if (saveMyFloors(mine)){ renderFloors(); toast(`지금 배치를 '${name}' 으로 저장했어요`); }\n  }\n});",
    "    if (saveMyFloors(mine)){ renderFloors(); toast(`지금 배치를 '${name}' 으로 저장했어요`); } });\n  }\n});")
# 설계 붙여넣기 (입력)
rep("    const t = prompt('설계 JSON 을 붙여넣으세요 (설계 복사로 얻은 글)'); if (!t) return;",
    "    askText('설계 JSON 을 붙여넣으세요 (설계 복사로 얻은 글)', '', true).then(t => { if (!t) return;   /* v8.2.1 */")
rep("    } catch (err) { toast('읽을 수 없는 글이에요'); }\n  }\n});", "    } catch (err) { toast('읽을 수 없는 글이에요'); } });\n  }\n});")
# 새 프롤로그
rep("  if (S.camp && !S.camp.end && !confirm('진행 중인 캠페인을 버리고 새로 시작할까요?')) return;",
    "  if (S.camp && !S.camp.end && !(opt && opt.ok)){ askYes('진행 중인 캠페인을 버리고 새로 시작할까요?', '새로 시작').then(y => { if (y) campStart({ ...(opt || {}), ok: true }); }); return; }   /* v8.2.1 */")
# 캠페인 띠: 그만두기 · 두고 가기
rep("  if (b.dataset.cquit){ if (confirm(S.mode === 'story' ? '프롤로그를 그만둘까요? (이 진행은 사라져요)' : '캠페인을 그만두고 원래 배치로 돌아갈까요? (이 캠페인은 사라져요)')) campQuit(); return; }",
    "  if (b.dataset.cquit){ askYes(S.mode === 'story' ? '프롤로그를 그만둘까요? (이 진행은 사라져요)' : '캠페인을 그만두고 원래 배치로 돌아갈까요? (이 캠페인은 사라져요)', '그만둔다').then(y => { if (y){ if (typeof r8Hide === 'function') r8Hide(); if (typeof duel8Ui === 'function') duel8Ui(false); campQuit(); } }); return; }   /* v8.2.1 */")
rep("  if (b.dataset.cabandon){ const L = world.units.filter(u => u.side === 0 && u.alive); if (!L.length || !confirm(`${L.map(u => u.name).join(' · ')} 을(를) 두고 갈까요? (이후 나오지 않음)`)) return;\n",
    "  if (b.dataset.cabandon){ const L = world.units.filter(u => u.side === 0 && u.alive); if (!L.length) return; askYes(`${L.map(u => u.name).join(' · ')} 을(를) 두고 갈까요? (이후 나오지 않음)`, '두고 간다').then(y => { if (!y || !world) return;   /* v8.2.1 */\n")
rep(" checkEnd(world); if (world.over){ mode = 'plan'; cont = false; paused = false; onOver(); } hud(); return; }\n  if (b.dataset.cloot)",
    " checkEnd(world); if (world.over){ mode = 'plan'; cont = false; paused = false; onOver(); } hud(); }); return; }\n  if (b.dataset.cloot)")
# 인카운터 시험
rep("function encTry(k){", "function encTry(k, ok){")
rep("if (!confirm('진행 중인 프롤로그를 맡겨 두고 인카운터 시험을 할까요? (시험을 그만두면 돌아와요)')) return;",
    "if (!ok){ askYes('진행 중인 프롤로그를 맡겨 두고 인카운터 시험을 할까요? (시험을 그만두면 돌아와요)', '시험한다').then(y => { if (y) encTry(k, true); }); return; }   /* v8.2.1 */")
# 모드 바꾸기
rep("function setMode(m){", "function setMode(m, ok){")
rep("  if (world && mode !== 'edit' && !world.over && world.t > 0.5 && !confirm(S.camp ? `${MODE_NM[m]}으로 갈까요? 이 맵은 나중에 들어온 때부터 다시 해요 (동료 · 진행은 그대로)` : `${MODE_NM[m]}으로 갈까요? 지금 판은 접어요`)) return false;",
    "  if (world && mode !== 'edit' && !world.over && world.t > 0.5 && !ok){ askYes(S.camp ? `${MODE_NM[m]}으로 갈까요? 이 맵은 나중에 들어온 때부터 다시 해요 (동료 · 진행은 그대로)` : `${MODE_NM[m]}으로 갈까요? 지금 판은 접어요`, '간다').then(y => { if (y) setMode(m, true); }); return false; }   /* v8.2.1 */")
# 첫 화면 그만두기
rep("  if (k === 'quit'){ if (S.camp && (S.camp.end || confirm('프롤로그를 그만둘까요? (이 진행은 사라져요)'))) campQuit(); return; }",
    "  if (k === 'quit'){ if (!S.camp) return; if (S.camp.end){ campQuit(); return; } askYes('프롤로그를 그만둘까요? (이 진행은 사라져요)', '그만둔다').then(y => { if (y && S.camp){ if (typeof r8Hide === 'function') r8Hide(); campQuit(); } }); return; }   /* v8.2.1 */")

assert 'confirm(' not in s.replace('confirmed', ''), [l[:120] for l in s.split('\n') if 'confirm(' in l]
assert 'prompt(' not in s, [l[:120] for l in s.split('\n') if 'prompt(' in l]
open(F, 'w', encoding='utf-8').write(s)
print('page8210 OK')
