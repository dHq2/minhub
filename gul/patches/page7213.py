# v7.21.3 페이지 — page7213.py v1.0 (로그 저장: S 가 끝날 때마다 그 맵의 로그를 gzip 으로 줄여 (base64) 이 브라우저에 임시로 — 캠페인이 끝날 때까지 · 끝 화면 '로그 받기' (파일 하나) · '로그 복사' · 새 캠페인 · 그만두기 때 지움)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.21.2 (2026-10-18)', '<!-- 굴의 전투판 v7.21.3 (2026-10-18)')
rep('     v7.21.2: ', '''     v7.21.3: 로그 저장 — S 가 끝날 때마다 그 맵의 로그를 gzip 으로 줄여 이 브라우저에 임시로 보관 (캠페인이 끝날 때까지 · 3MB 넘으면 오래된 것부터).
         캠페인 띠 '로그' · 끝 화면 '로그 받기' (모든 맵 · 캠페인 요약을 JSON 파일 하나로) · '로그 복사'. 새 캠페인 · 그만두기 때 지움.
     v7.21.2: ''')
rep('h1::after{content:" v7.21.2"', 'h1::after{content:" v7.21.3"')
rep('<footer>굴의 전투판 v7.21.2', '<footer>굴의 전투판 v7.21.3')
rep('return `굴의 전투판 v7.21.2 · ${title}', 'return `굴의 전투판 v7.21.3 · ${title}')
rep("copyText('굴의 전투판 v7.21.2 자동 판 기록", "copyText('굴의 전투판 v7.21.3 자동 판 기록")
rep('의 버전 기록에 — v7.21.2 맵마다 정산 · 성장', '의 버전 기록에 — v7.21.3 로그 압축 저장 · 받기 / v7.21.2 맵마다 정산 · 성장')
rep('">v7.21.2 · 1F 캠페인 · 정산 · 성장</span>', '">v7.21.3 · 1F 캠페인 · 로그 저장</span>')

rep("function campPlace(m, units, y0, y1, x0, x1){", r"""// v7.21.3 로그 저장: 맵마다 gzip → base64 로 이 브라우저에 임시 (캠페인이 끝날 때까지) — 받기 · 복사로 한데 모음
const CLOG_LS = 'gul-camp-logs';
const clogGet = () => { try { const L = JSON.parse(localStorage.getItem(CLOG_LS) || '[]'); return Array.isArray(L) ? L : []; } catch (e) { return []; } };
const clogClear = () => { try { localStorage.removeItem(CLOG_LS); } catch (e) {} };
async function gzB64(str){ if (typeof CompressionStream === 'undefined') return null; const u8 = new Uint8Array(await new Response(new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()); let b = ''; for (let i = 0; i < u8.length; i += 0x8000) b += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(b); }
async function gunB64(b64){ const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'))).text(); }
let clogBusy = Promise.resolve();
function campLogSave(W, s){
  const raw = JSON.stringify(W.log || []), meta = { s, t: +W.t.toFixed(1), res: W.result, n: (W.log || []).length, raw: raw.length, at: Date.now() };
  clogBusy = clogBusy.then(() => gzB64(raw)).then(z => { const L = clogGet(); L.push({ ...meta, z: z || null, j: z ? null : raw.slice(0, 200000) }); let tot = 0;
    for (let i = L.length - 1; i >= 0; i--){ tot += (L[i].z || L[i].j || '').length; if (tot > 3e6){ L.splice(0, i + 1); break; } }
    try { localStorage.setItem(CLOG_LS, JSON.stringify(L)); } catch (e) {} }).catch(() => {});
  return clogBusy;
}
async function campLogAll(){
  await clogBusy; const L = clogGet(), stages = [];
  for (const x of L){ let log = null; try { log = x.z ? JSON.parse(await gunB64(x.z)) : JSON.parse(x.j || '[]'); } catch (e) {} stages.push({ s: x.s, t: x.t, res: x.res, n: x.n, log }); }
  const C = S.camp || {}; return { game: '굴의 전투판', ver: '7.21.3', at: new Date().toISOString(), camp: { s: C.s, end: C.end || null, pick: C.pick, fallen: C.fallen, lost: C.lost, log: C.log }, stages };
}
async function campLogDownload(){
  const out = await campLogAll(); if (!out.stages.length){ toast('아직 저장된 맵 로그가 없어요 (맵을 넘어가면 쌓여요)'); return; }
  const blob = new Blob([JSON.stringify(out)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `gul_1F_log_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); toast(`맵 ${out.stages.length}개의 로그를 파일로 받았어요`);
}
async function campLogCopy(){ const out = await campLogAll(); if (!out.stages.length){ toast('아직 저장된 맵 로그가 없어요'); return; } copyText(JSON.stringify(out), `맵 ${out.stages.length}개의 로그를 복사했어요`); }
function campPlace(m, units, y0, y1, x0, x1){""")
rep("  const s = C.s, party = [], dirs = {}, rows = stageStats(W);", "  const s = C.s, party = [], dirs = {}, rows = stageStats(W); campLogSave(W, s);   // v7.21.3 그 맵의 로그를 줄여 보관")
rep("  S.camp = { v: 1, s: 1, pick,", "  clogClear();   // v7.21.3 새 캠페인 — 지난 로그는 지움\n  S.camp = { v: 1, s: 1, pick,")
rep("  const B = S.campBak; delete S.camp; delete S.campBak;", "  clogClear();   // v7.21.3\n  const B = S.campBak; delete S.camp; delete S.campBak;")
rep('id="campDone">캠페인 끝내기 (원래 배치로)</button></div>', 'id="campDone">캠페인 끝내기 (원래 배치로)</button><button class="btn" type="button" id="campLogBtn" title="모든 맵의 로그 · 캠페인 요약을 JSON 파일 하나로">로그 받기</button><button class="btn" type="button" id="campLogCp">로그 복사</button></div>')
rep("  b.hidden = false; $('campDone').onclick = campQuit;", "  b.hidden = false; $('campDone').onclick = campQuit; $('campLogBtn').onclick = campLogDownload; $('campLogCp').onclick = campLogCopy;")
rep("<button class=\"btn sm\" type=\"button\" data-cquit=\"1\">그만두기</button></span>`;", "<button class=\"btn sm\" type=\"button\" data-clog=\"1\" title=\"지금까지 넘어간 맵의 로그를 파일로\">로그</button><button class=\"btn sm\" type=\"button\" data-cquit=\"1\">그만두기</button></span>`;")
rep("  if (b.dataset.cquit){ if (confirm(", "  if (b.dataset.clog){ campLogDownload(); return; }   // v7.21.3\n  if (b.dataset.cquit){ if (confirm(")

open(F, 'w', encoding='utf-8').write(s)
print('page7213 OK')
