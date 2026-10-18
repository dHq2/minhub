# v7.21.4 페이지 — page7214.py v1.0 (로그 받기를 artifact 의 downloads 기능으로: 보는 곳에서 받기를 쓸 수 있을 때만 '로그 받기' 단추 (확인 창 · 거절 · 바쁨 처리) · 못 쓰면 숨기고 '로그 복사' 로 · 캠페인 띠 '로그' 도 같은 규칙)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.21.3 (2026-10-18)', '<!-- 굴의 전투판 v7.21.4 (2026-10-18)')
rep('     v7.21.3: ', '''     v7.21.4: 로그 받기를 보는 곳의 받기 기능 (downloads) 으로 — 확인 창에서 받음 · 거절해도 괜찮음.
         받기를 쓸 수 없는 곳에서는 '로그 받기' 를 숨기고 '로그 복사' 로 (캠페인 띠 '로그' 단추도 같은 규칙).
     v7.21.3: ''')
rep('h1::after{content:" v7.21.3"', 'h1::after{content:" v7.21.4"')
rep('<footer>굴의 전투판 v7.21.3', '<footer>굴의 전투판 v7.21.4')
rep('return `굴의 전투판 v7.21.3 · ${title}', 'return `굴의 전투판 v7.21.4 · ${title}')
rep("copyText('굴의 전투판 v7.21.3 자동 판 기록", "copyText('굴의 전투판 v7.21.4 자동 판 기록")
rep('의 버전 기록에 — v7.21.3 로그 압축 저장 · 받기', '의 버전 기록에 — v7.21.4 로그 받기 (받기 기능) / v7.21.3 로그 압축 저장 · 받기')
rep('">v7.21.3 · 1F 캠페인 · 로그 저장</span>', '">v7.21.4 · 1F 캠페인 · 로그 받기</span>')
rep("ver: '7.21.3', at:", "ver: '7.21.4', at:")

# 받기 기능: claude.use('downloads') — null 이면 받기 단추를 숨기고 복사로
rep("""async function campLogDownload(){
  const out = await campLogAll(); if (!out.stages.length){ toast('아직 저장된 맵 로그가 없어요 (맵을 넘어가면 쌓여요)'); return; }
  const blob = new Blob([JSON.stringify(out)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `gul_1F_log_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); toast(`맵 ${out.stages.length}개의 로그를 파일로 받았어요`);
}""", """// v7.21.4 받기는 보는 곳의 downloads 기능으로만 (확인 창 · 거절 가능) — 쓸 수 없으면 (null) 받기 단추를 숨기고 복사로
let dlNs = null;
function dlShow(){ const b = $('campLogBtn'); if (b) b.hidden = !dlNs; campBarRender(true); }
const dlReady = (window.claude && typeof window.claude.use === 'function' ? Promise.resolve().then(() => window.claude.use('downloads')).catch(() => null) : Promise.resolve(null)).then(n => { dlNs = n || null; dlShow(); return dlNs; });
let dlBusy = false;
async function campLogDownload(){
  if (dlBusy) return;
  const out = await campLogAll(); if (!out.stages.length){ toast('아직 저장된 맵 로그가 없어요 (맵을 넘어가면 쌓여요)'); return; }
  const dl = dlNs || await dlReady; if (!dl){ campLogCopy(); return; }
  dlBusy = true;
  try { await dl.save({ filename: `gul_1F_log_${new Date().toISOString().slice(0, 10)}.json`, data: new Blob([JSON.stringify(out)]) }); toast(`맵 ${out.stages.length}개의 로그를 파일로 받았어요`); }
  catch (e) { const c = e && e.code;
    if (c === 'declined') toast('받기를 그만뒀어요 — 로그는 그대로 있어요');
    else if (c === 'rate_limited') toast('받기 확인 창이 이미 떠 있어요 — 잠시 뒤에 다시');
    else if (c === 'too_large') toast('파일이 너무 커요 — 로그 복사를 써 보세요');
    else { dlNs = null; dlShow(); toast('여기서는 파일 받기를 쓸 수 없어요 — 로그 복사를 써 보세요'); } }
  finally { dlBusy = false; }
}""")
# 끝 화면: 받기를 쓸 수 있을 때만 '로그 받기'
rep('<button class="btn" type="button" id="campLogBtn" title="모든 맵의 로그 · 캠페인 요약을 JSON 파일 하나로">로그 받기</button>', '<button class="btn" type="button" id="campLogBtn" title="모든 맵의 로그 · 캠페인 요약을 JSON 파일 하나로"${dlNs ? \'\' : \' hidden\'}>로그 받기</button>')
# 캠페인 띠: 받기를 쓸 수 있으면 '로그' (파일) · 아니면 '로그 복사'
rep('<button class="btn sm" type="button" data-clog="1" title="지금까지 넘어간 맵의 로그를 파일로">로그</button>', '${dlNs ? \'<button class="btn sm" type="button" data-clog="1" title="지금까지 넘어간 맵의 로그를 파일로">로그</button>\' : \'<button class="btn sm" type="button" data-clog="cp" title="지금까지 넘어간 맵의 로그를 복사">로그 복사</button>\'}')
rep("  if (b.dataset.clog){ campLogDownload(); return; }   // v7.21.3", "  if (b.dataset.clog){ if (b.dataset.clog === 'cp') campLogCopy(); else campLogDownload(); return; }   // v7.21.4 받기 기능이 없으면 복사")

open(F, 'w', encoding='utf-8').write(s)
print('page7214 OK')
