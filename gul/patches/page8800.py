# v8.8.0 페이지 — page8800.py v1.4 (v1.4: 지도 아래 여백을 단추 띠 높이만큼 (휴대폰에서 ▲ · ▼ 가 더해져 두 줄이 되면 맨 아래 동료 칸을 가리던 것) · v1.3: 여정 정산 머리글에도 ✦ 성장 N (예전엔 얻은 것 글이 덮어써 안 보임) · v1.2: [방어X] 는 막는 재능의 바닥 (C 0.7 · B 0.8 · A 0.9 · S 1 — 베테랑 · 반사신경과 같은 틀) · 이미 그 바닥을 넘는 몸은 그 다음 등급부터 (방어 성장은 막는 재능 gT 로) · v1.1: 출구 단추의 알림 · 명령 기록 글도 여정에선 ▲ 올라가는 계단 · ▼ 출구 (서둘러도 계단이면 계단) · v1.0: 위층으로 (명세 A8 · 민수 L2 — 둘 다) · 한 일대로 성장 (명세 I17 · 민수 L3) —
#   층 지도 ▲ 위층 · ▼ 아래층 (층마다 남긴 상태 R.fms · 처음 들어설 때만 회복 · 카드 · 뽑기 · 다시 온 층의 안 간 칸) · 싸움판 안 '▲ 올라가는 계단' (그림 · 단추 · 명령 글) ·
#   성장 갈래 넷 (방어 ← 막아 낸 공격 · 의학 ← 치유 · 은신 ← 들키지 않은 걸음 · 지휘 ← 닿은 명령) · 많이 한 일부터 · [방어X] 등급 (글 · 아이콘 · 등급표) ·
#   함께 고친 것: 다시 불러오면 층 정의를 되살림 · 수련 · 이야기 성장이 보인 것보다 더 자라던 것 · 여정 기록의 나간 동료 · 30층 칸의 '아래에서 올라옴')
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8790.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.7.9 (2026-10-23)', '<!-- 굴의 전투판 v8.8.0 (2026-10-23)')
rep('     v8.7.9: ', '''     v8.8.0: 위층으로 (명세 A8 · 민수 L2 — 둘 다) · 한 일대로 성장 (명세 I17 · 민수 L3):
         층 지도의 ▲ 위층: 지난 층으로 돌아감 — 층마다 남긴 그대로 (칸 · 마친 칸 · 선 자리) · 처음 들어설 때만 층 회복 · 층 카드 · 뽑기 (다시 오면 짧은 글만) ·
         다시 온 층 (계단 칸을 마친 층) 에선 안 간 칸이 빛남 (마친 칸에 이어진 칸) · ▼ 아래층: 가 본 아래층의 떠난 자리로 (계단 칸을 다시 싸우지 않음) · 3층을 오가면 비늘조각 셈에 듦.
         싸움판 안의 올라가는 계단: 들어온 자리를 '▲ 올라가는 계단' 으로 그림 · 단추 (예전 '↩ 물러나기') — 같은 층 앞 칸으로 (이 칸은 다시 고를 수 있음 · 첫 칸이면 층 처음으로) ·
         명령 글도 (▲ 올라가는 계단으로 · ▼ 출구로 — 예전엔 1F 의 '아래 맵으로 · 위 맵으로').
         한 일대로 성장: 맞힌 사격 → 사격 · 막아 낸 공격 → 방어 (새 등급 [방어X] = 막는 재능의 바닥 C 0.7 · B 0.8 · A 0.9 · S 1 — 베테랑 · 반사신경과 같은 틀 · 막을 수 있는 몸만 · 이미 넘는 몸은 그 다음부터) · 치유 → 의학 (없으면 C 와 같아 B 부터) ·
         들키지 않은 걸음 (숨은 채 걸은 거리 · 숨을 수 없는 몸은 셈하지 않음) → 은신 (타고난 솜씨 다음 등급부터) · 닿은 명령 (내가 내리거나 전한 명령이 동료에게 닿은 수) → 지휘 ·
         그대로: 피함 → 회피 · 걸음 → 속력 · 근접 피해 → 근력 · 받은 피해 → 체력 — 상한 A · 많이 한 일부터 (넘은 몫이 큰 순) · 한 판에 둘까지 · 인물마다 재능 · 정산에 숨어 걸음 · 명령 닿음.
         함께 고친 것: 다시 불러오면 층 정의 (주제 · 숨은 층) 를 저장된 대로 되살림 (예전엔 v8.0 의 옛 층 표를 읽어 맵 · 무리가 어긋남) ·
         수련 · 이야기 성장이 보인 것보다 더 자라던 것 (보인 하나 · 둘만 자람) · 여정 기록의 나간 동료 (출구로 · 올라가는 계단으로) · 30층 칸에 '아래에서 올라옴' 이 붙던 것.
     v8.7.9: ''')
for a, b in (('h1::after{content:" v8.7.9"', 'h1::after{content:" v8.8.0"'), ('<footer>굴의 전투판 v8.7.9', '<footer>굴의 전투판 v8.8.0'), ('return `굴의 전투판 v8.7.9 · ${title}', 'return `굴의 전투판 v8.8.0 · ${title}'),
             ("copyText('굴의 전투판 v8.7.9 자동 판 기록", "copyText('굴의 전투판 v8.8.0 자동 판 기록"), ("o.push(`굴의 전투판 v8.7.9 — ${C.run", "o.push(`굴의 전투판 v8.8.0 — ${C.run"),
             ('의 버전 기록에 — v8.7.9 펄 · 각펄 (고대 폐허의 만남) / v8.7.8', '의 버전 기록에 — v8.8.0 위층으로 · 한 일대로 성장 / v8.7.9 펄 · 각펄 (고대 폐허의 만남) / v8.7.8'),
             ('">v8.7.9 · 펄 · 각펄 (고대 폐허)</span>', '">v8.8.0 · 위층으로 · 한 일대로 성장</span>'),
             ("ver: '8.7.9', kind:", "ver: '8.8.0', kind:")):
    rep(a, b)
rep("RULES_MIG = '8.7.9',", "RULES_MIG = '8.8.0',")   # 수치표: grades 방어 새 칸

# ======================================================================
# A8 위층으로
# ======================================================================
# 층에 들어설 때 떠나는 층을 남김
rep("function r8FloorEnter(f){\n  const R = R8S(); if (!R) return; R.f = f; R.at = null; R.done = []; R.fm = r8Gen(f); R.floorT = Date.now();",
    "function r8FloorEnter(f){\n  const R = R8S(); if (!R) return; if (R.fm && R.f && R.f !== f) (R.fms = R.fms || {})[R.f] = { fm: R.fm, done: R.done, at: R.at };   /* v8.8.0 떠나는 층을 남김 (▲ 위층으로 돌아올 수 있게) */\n  R.f = f; R.at = null; R.done = []; R.fm = r8Gen(f); R.floorT = Date.now();")
# 고를 수 있는 칸: 다시 온 층 (계단 칸을 마친 층) 은 마친 칸에 이어진 안 간 칸 (첫 줄은 언제나)
rep("function r8Avail(){ const R = R8S(); if (!R || !R.fm) return []; if (!R.at) return R.fm.rows[0].map(n => n.id); const cur = r8Node(R.at); return cur && R.done.includes(cur.id) ? cur.next.slice() : [R.at]; }",
    """function r8Avail(){ const R = R8S(); if (!R || !R.fm) return []; const cur = R.at ? r8Node(R.at) : null; if (R.at && !(cur && R.done.includes(cur.id))) return [R.at];   // 들어가 있는 칸
  if (r8Passed()){ const all = R.fm.rows.flat(); return all.filter(n => !R.done.includes(n.id) && (n.r === 0 || all.some(m => R.done.includes(m.id) && m.next.includes(n.id)))).map(n => n.id); }   /* v8.8.0 다시 온 층: 마친 칸에 이어진 안 간 칸 */
  return cur ? cur.next.slice() : R.fm.rows[0].map(n => n.id); }
const r8Passed = () => { const R = R8S(); if (!R || !R.fm || !R.fm.rows.length) return false; return (R.fm.rows[R.fm.rows.length - 1] || []).some(n => R.done.includes(n.id)); };   /* v8.8.0 계단 칸 (마지막 줄) 을 마친 층 */
// v8.8.0 가 본 층으로 (▲ 위층 · ▼ 아래층): 층마다 남긴 그대로 · 처음 들어설 때만 층 회복 · 층 카드 · 뽑기 (다시 오면 짧은 글만) · 3층을 오가면 비늘조각 셈
function r8FloorGo(g){
  const R = R8S(); if (!R) return; const M = R.fms || (R.fms = {}), K = M[g]; if (!K){ r8FloorEnter(g); return; }
  const from = R.f; if (R.fm) M[from] = { fm: R.fm, done: R.done, at: R.at };
  delete M[g]; R.f = g; R.fm = K.fm; R.done = K.done || []; R.at = K.at || null; r8Sel = null;
  try { r8FloorDef(g); } catch (e) {}   // 층 정의 (주제 · 숨은 층은 저장된 대로)
  if (g === 3) R.flags.f3n = (R.flags.f3n || 0) + 1;
  const up = g < from, F = F8[g] || {}; R.log.push({ f: g, t: Date.now(), k: up ? 'up' : 'down', from, name: F.name });
  try { const C = S.camp, J = C.jr || (C.jr = { v: 1, visits: [] }); J.visits.push({ n: J.visits.length + 1, s: 0, name: `${g}층 ${up ? '▲ 위층으로' : '▼ 아래층으로'}`, kind: F.name || '', at: Date.now(), panel: true, talk: [], r8: { f: g, zone: F.name || null, node: up ? 'up' : 'down', id: null }, relics: R.relics.slice(), gold: R.gold }); J.cur = J.visits.length - 1; } catch (e) {}   // 여정 기록
  save(); world = null; mode = 'plan';
  toast(`${up ? '▲' : '▼'} ${g}층 · ${F.name || ''} — ${r8Passed() ? (r8Avail().length ? '다시 온 층: 안 간 칸이 빛나요' : '다시 온 층: 남은 칸이 없어요') : '떠난 자리 그대로'}`);
  r8MapShow();
}""")
# 지도: 다시 온 층의 길 · 글 · ▲ / ▼ 단추
rep("const on = R.done.includes(n.id) && (R.at === n.id) && av.includes(id);",
    "const on = R.done.includes(n.id) && (R.at === n.id || r8Passed()) && av.includes(id);   /* v8.8.0 다시 온 층은 마친 칸 모두에서 */")
rep("'빛나는 칸을 누르면 무엇이 있는지 보여요.'",
    "(r8Passed() ? (av.length ? '다시 온 층 — 안 간 칸이 빛나요. ' : '다시 온 층 — 남은 칸이 없어요. ') + ((R.fms || {})[R.f + 1] ? `▼ ${R.f + 1}층으로 돌아가요.` : '') : '빛나는 칸을 누르면 무엇이 있는지 보여요.')")
rep('<button class="btn" type="button" data-r8="party">동료 정리</button>',
    '${R.f > 2 && !F.final && (R.fms || {})[R.f - 1] ? `<button class="btn" type="button" data-r8="up" title="지난 층 (${R.f - 1}층) 으로 — 안 간 칸을 고를 수 있어요 · 이 층은 남긴 그대로">▲ ${R.f - 1}층으로</button>` : \'\'}${(R.fms || {})[R.f + 1] ? `<button class="btn${r8Passed() && !av.length ? \' go\' : \'\'}" type="button" data-r8="down" title="가 본 아래층 (${R.f + 1}층) 의 떠난 자리로">▼ ${R.f + 1}층으로</button>` : \'\'}<button class="btn" type="button" data-r8="party">동료 정리</button>')
rep("  if (k === 'party'){ r8PartyPanel(); return; }",
    "  if (k === 'up' || k === 'down'){ const R = R8S(); if (R) r8FloorGo(R.f + (k === 'up' ? -1 : 1)); return; }   /* v8.8.0 ▲ 위층 · ▼ 아래층 */\n  if (k === 'party'){ r8PartyPanel(); return; }")
rep('data-r8="quit">그만두기</button></div>`;\n}',
    'data-r8="quit">그만두기</button></div>`;\n  { const go = el.querySelector(\'.r8go\'); el.style.paddingBottom = go ? Math.max(90, go.offsetHeight + 14) + \'px\' : \'\'; }   /* v8.8.0 아래 여백 = 단추 띠 높이 (휴대폰에서 두 줄이면 맨 아래 동료 칸을 가리던 것) */\n}')
rep("function r8Panel(html){ r8Css(); const el = $('run8') || (() => { const d = document.createElement('div'); d.id = 'run8'; d.className = 'r8'; document.body.appendChild(d); return d; })(); el.hidden = false; el.innerHTML = html; return el; }",
    "function r8Panel(html){ r8Css(); const el = $('run8') || (() => { const d = document.createElement('div'); d.id = 'run8'; d.className = 'r8'; document.body.appendChild(d); return d; })(); el.hidden = false; el.style.paddingBottom = ''; el.innerHTML = html; return el; }   /* v8.8.0 지도의 아래 여백을 되돌림 */")
# 다음 층: 가 본 아래층이면 떠난 자리로
rep("function r8Next(){ const R = R8S(); if (!R) return; if (R.f >= F8_MAX){ r8End('true'); return; } r8FloorEnter(R.f + 1); }",
    "function r8Next(){ const R = R8S(); if (!R) return; if (R.f >= F8_MAX){ r8End('true'); return; } if ((R.fms || {})[R.f + 1]){ r8FloorGo(R.f + 1); return; } r8FloorEnter(R.f + 1); }   /* v8.8.0 가 본 아래층이면 떠난 자리로 */")
# 다시 불러오면 층 정의 (F8) 를 저장된 대로 (주제 · 숨은 층) — 예전엔 v8.0 의 옛 층 표를 읽음
rep("function r8Boot(){ if (!run8On()) return; const R = R8S();",
    "function r8Boot(){ if (!run8On()) return; const R = R8S(); if (R && R.fm && R.f >= 2 && !(F8[R.f] && 'fixed8' in F8[R.f])) try { r8FloorDef(R.f); } catch (e) {}   /* v8.8.0 다시 불러오면 층 정의를 되살림 */")
# 여정 기록에 위층 · 아래층
rep("const NODE8 = { fight: { ic: '⚔', nm: '싸움' },", "const NODE8 = { up: { ic: '▲', nm: '위층으로' }, down: { ic: '▼', nm: '아래층으로' }, fight: { ic: '⚔', nm: '싸움' },")

# 싸움판 안의 올라가는 계단 (들어온 자리)
rep('<button class="btn sm" type="button" data-cexit="down" title="들어온 자리로 물러남 (그 칸은 다시 고를 수 있어요)">↩ 물러나기</button>',
    '<button class="btn sm" type="button" data-cexit="down" title="들어온 자리의 올라가는 계단으로 — 같은 층 앞 칸으로 돌아감 (이 칸은 다시 고를 수 있어요)">▲ 올라가는 계단</button>')
rep("toast('물러났어요 — 그 칸은 다시 고를 수 있어요');",
    "R.log.push({ f: R.f, k: 'back', node: node.id, nt: node.t, t: Date.now() }); toast('▲ 올라가는 계단으로 — 앞 칸으로 돌아왔어요 (이 칸은 다시 고를 수 있어요)');")
rep("\n}\n\n// 칸 끝: 층 보스 · 고정 칸을 마치면 아래층으로",
    """
  if (Wd.entry && Wd.r8 && !Wd.duel){ const E0 = Wd.entry, x = ox + E0.x * ts, y = oy + E0.y * ts, rr = ts * Math.min(1.2, (E0.r || 1.2) * 0.75), shut = !!Wd.noRetreat; ctx.save(); ctx.strokeStyle = shut ? 'rgba(150,140,140,.45)' : 'rgba(150,200,255,.6)'; ctx.lineWidth = Math.max(2, ts * 0.06); ctx.setLineDash([ts * 0.22, ts * 0.16]); ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = shut ? 'rgba(170,160,150,.75)' : 'rgba(175,215,255,.92)'; ctx.font = `bold ${Math.max(11, ts * 0.34)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('▲ 올라가는 계단' + (shut ? ' 🔒' : ''), x, y - rr - ts * 0.2); ctx.restore(); }   /* v8.8.0 들어온 자리 = 올라가는 계단 (같은 층 앞 칸으로 · 각펄은 닫힘) */
}

// 칸 끝: 층 보스 · 고정 칸을 마치면 아래층으로""")
# 명령 글: 여정에선 ▲ 올라가는 계단으로 · ▼ 출구로 (1F 는 그대로)
rep("if (o[0] === 'exit') return (o[1] === 'down' ? '아래 맵으로' : '위 맵으로') + (o[2] ? ' (서둘러)' : '');",
    "if (o[0] === 'exit') return (run8On() ? (o[1] === 'down' ? '▲ 올라가는 계단으로' : '▼ 출구로') : o[1] === 'down' ? '아래 맵으로' : '위 맵으로') + (o[2] ? ' (서둘러)' : '');   /* v8.8.0 여정 */")
rep("o.k === 'exit' ? [(o.dir === 'down' ? '↓ 아래 맵으로' : '↑ 위 맵으로') + (o.hurry ? ' — 서둘러!' : ''), '#b9e0a0']",
    "o.k === 'exit' ? [(run8On() ? (o.dir === 'down' ? '▲ 올라가는 계단으로' : '▼ 출구로') : o.dir === 'down' ? '↓ 아래 맵으로' : '↑ 위 맵으로') + (o.hurry ? ' — 서둘러!' : ''), '#b9e0a0']")
rep("else if (o && o.k === 'exit') p.push(o.dir === 'down' ? '↓ 아래 맵으로 (출구)' : '↑ 위 맵으로 (출구)');",
    "else if (o && o.k === 'exit') p.push(run8On() ? (o.dir === 'down' ? '▲ 올라가는 계단으로 (같은 층 앞 칸)' : '▼ 출구로') : o.dir === 'down' ? '↓ 아래 맵으로 (출구)' : '↑ 위 맵으로 (출구)');   /* v8.8.0 여정 */")
rep("noteOrders(L, 'user', (hur ? '서둘러 ' : '') + (look ? '출구 찾기' : '모두 ' + (dir === 'up' ? '위' : '아래') + ' 맵으로'), !!world.cleared);",
    "noteOrders(L, 'user', (hur ? '서둘러 ' : '') + (look ? '출구 찾기' : run8On() ? (dir === 'up' ? '모두 ▼ 출구로' : '모두 ▲ 올라가는 계단으로') : '모두 ' + (dir === 'up' ? '위' : '아래') + ' 맵으로'), !!world.cleared);   /* v8.8.0 여정 */")
rep("toast(hur ? '모두 출구로 — 서둘러! (방패를 내리고 뜀)' : look ? '🔎 출구를 아직 못 찾았어요 — 대장을 따라 안 가 본 곳을 뒤져요 (찾으면 곧장 · 한 번 더 누르면 서둘러)' : `모두 ${dir === 'up' ? '위' : '아래'} 맵으로 (한 번 더 누르면 서둘러)`);",
    "toast(hur ? (run8On() && dir === 'down' ? '모두 ▲ 올라가는 계단으로 — 서둘러! (방패를 내리고 뜀)' : '모두 출구로 — 서둘러! (방패를 내리고 뜀)') : look ? '🔎 출구를 아직 못 찾았어요 — 대장을 따라 안 가 본 곳을 뒤져요 (찾으면 곧장 · 한 번 더 누르면 서둘러)' : run8On() ? `모두 ${dir === 'up' ? '▼ 출구로' : '▲ 올라가는 계단으로 (같은 층 앞 칸)'} (한 번 더 누르면 서둘러)` : `모두 ${dir === 'up' ? '위' : '아래'} 맵으로 (한 번 더 누르면 서둘러)`);   /* v8.8.0 여정 */")
# 여정 기록: 나간 동료 (여정은 출구로 · 올라가는 계단으로) · 30층 칸에 '아래에서 올라옴' 이 붙던 것
rep("how: u.gone === 'up' ? '위로' : u.gone === 'down' ? '아래로' :",
    "how: u.gone === 'up' ? (W.r8 ? '출구로' : '위로') : u.gone === 'down' ? (W.r8 ? '올라가는 계단으로' : '아래로') :")
rep("partyEnd: (last.out || []).filter(o => o.how === '위로' || o.how === '아래로' || o.how === '남음').map(o => o.name)",
    "partyEnd: (last.out || []).filter(o => o.how !== '버림' && o.how !== '쓰러짐').map(o => o.name)")
rep("v.r8 = { f: R.f, zone: F.name || null, node: t, id: R.at || null, ms: (nd && nd.ms) || null };",
    "v.r8 = { f: R.f, zone: F.name || null, node: t, id: R.at || null, ms: (nd && nd.ms) || null }; v.from = null;   /* v8.8.0 30층 칸은 위에서 들어섬 (1F 의 '아래에서 올라옴' 이 붙던 것) */")

# ======================================================================
# I17 한 일대로 성장
# ======================================================================
rep("const GROW = { 사격: { need: 8, cap: 'A', by: 'hits' }, 회피: { need: 4, cap: 'A', by: 'dodges' }, 속력: { need: 140, cap: 'B', by: 'moved' }, 근력: { need: 160, cap: 'B', by: 'meleeDealt' }, 체력: { need: 90, step: 5, max: 20, by: 'taken' } };",
    """// v8.8.0 한 일대로 (I17 · 민수 L3): 맞힌 사격 → 사격 · 막아 낸 공격 → 방어 · 치유 → 의학 · 들키지 않은 걸음 → 은신 · 닿은 명령 → 지휘 (그대로: 피함 → 회피 · 걸음 → 속력 · 근접 피해 → 근력 · 받은 피해 → 체력) — 상한 A · 많이 한 일부터 · 한 판에 둘까지
const GROW = { 사격: { need: 8, cap: 'A', by: 'hits' }, 회피: { need: 4, cap: 'A', by: 'dodges' }, 속력: { need: 140, cap: 'B', by: 'moved' }, 근력: { need: 160, cap: 'B', by: 'meleeDealt' }, 방어: { need: 12, cap: 'A', by: 'blocked' }, 의학: { need: 60, cap: 'A', by: 'healed', base: 'C' }, 은신: { need: 30, cap: 'A', by: 'sneak' }, 지휘: { need: 40, cap: 'A', by: 'cmds' }, 체력: { need: 90, step: 5, max: 20, by: 'taken' } };   // 의학: 없으면 C 와 같음 (×1) → B 부터""")
rep("const GRADE_UP = { '': 'C', C: 'B', B: 'A', A: 'S' }, GRADE_N = { '': 0, C: 1, B: 2, A: 3, S: 4 };",
    "const GRADE_UP = { '': 'C', E: 'D', D: 'C', C: 'B', B: 'A', A: 'S' }, GRADE_N = { '': 0, E: -2, D: -1, C: 1, B: 2, A: 3, S: 4 };   // v8.8.0 은신 E · D\n"
    "const grOf = (p, k) => ((p.traits || []).find(t => t.length === k.length + 1 && t.startsWith(k) && 'SABCDE'.includes(t.slice(-1))) || '').slice(-1);   /* v8.8.0 등급 특성만 (지휘관 같은 이름은 빼고) */")
# 셈: 숨어 걸음 · 명령 닿음 · 타고난 숨는 솜씨 (갑옷 빼고 — 몸 · 직업 · 체격)
rep(" ? 0 : Math.round(u.dealt || 0) }));",
    " ? 0 : Math.round(u.dealt || 0), sneak: Math.round(u.sneakMv || 0), cmds: u.cmdOk || 0, stB: stlBase(W, u), gT: u.gTal != null ? u.gTal : null }));   /* v8.8.0 들키지 않은 걸음 · 닿은 명령 · 타고난 숨는 솜씨 · 막는 재능 */\n"
    "const stlBase = (W, u) => { const S0 = (W.rules || rules).stealth || {}; return Math.max(0, Math.min(1, ((S0.cls || {})[u.cls] != null ? S0.cls[u.cls] : 0.75) * ((u.h || 1.7) < 1.5 ? (S0.small || 1.1) : 1) * (u.giant || u.modBody || u.bodyShield ? (S0.giant || 0.1) : 1))); };   /* v8.8.0 엔진 stealthOf0 의 등급 없는 몫 (갑옷은 빼고 — 등급은 갑옷과 상관없이 씀) */")
rep("""function growFor(p, st){
  const out = [], key = p.ref || p.name; p.traits = p.traits || [];
  for (const k of ['사격', '회피', '속력', '근력']){ const G = GROW[k], v = st[G.by] || 0; if (out.length >= 2 || v < G.need / talent(key, k)) continue;
    const cur = (p.traits.find(t => t.length === k.length + 1 && t.startsWith(k)) || '').slice(-1); if (GRADE_N[cur] >= GRADE_N[G.cap]) continue;""",
    """function growFor(p, st, lim){
  const out = [], key = p.ref || p.name, L = lim || 2; p.traits = p.traits || [];
  const did = k => (st[GROW[k].by] || 0) * talent(key, k) / GROW[k].need;   /* v8.8.0 한 일의 몫 (1 을 넘으면 자람) */
  for (const k of Object.keys(GROW).filter(k => k !== '체력' && did(k) >= 1).sort((a, b) => did(b) - did(a))){ const G = GROW[k]; if (out.length >= L) break;   /* v8.8.0 많이 한 일부터 */
    const cur = grOf(p, k); if (cur && GRADE_N[cur] >= GRADE_N[G.cap]) continue;""")
rep("""    const nx = GRADE_UP[cur]; p.traits = [...p.traits.filter(t => !(t.length === k.length + 1 && t.startsWith(k))), k + nx]; out.push(cur ? `${k} ${cur} → ${nx}` : `${k} ${nx} 새로 얻음`); }
  const H = GROW.체력; if (out.length < 2 && """,
    """    let nx = GRADE_UP[cur || G.base || ''];
    if (k === '은신' && !cur){ const S0 = rules.stealth || {}, e = st.stB != null ? st.stB : 0.75, Gs = (rules.grades || {})['은신'] || {}; if (e < (S0.min || 0.2)) continue; let g0 = ''; for (const g of 'EDCBAS') if (Gs[g] != null && Gs[g] <= e + 1e-9) g0 = g; nx = g0 ? GRADE_UP[g0] : 'E'; }   /* v8.8.0 은신: 타고난 숨는 솜씨의 다음 등급 · 숨을 수 없는 몸 (거구 · 개조된 몸) 은 자라지 않음 */
    if (k === '방어' && st.gT != null){ const Gd = (rules.grades || {})['방어'] || {}; let g0 = cur; for (const g of 'CBAS') if (Gd[g] != null && Gd[g] <= st.gT + 1e-9 && GRADE_N[g] > GRADE_N[g0 || '']) g0 = g; nx = GRADE_UP[g0 || '']; }   /* v8.8.0 방어: 막는 재능이 이미 넘는 바닥은 건너뜀 (베테랑 · 반사신경 0.9 = A · 전선 1 = S — 상한 밖) */
    if (!nx || GRADE_N[nx] > GRADE_N[G.cap]) continue;
    p.traits = [...p.traits.filter(t => !(t.length === k.length + 1 && t.startsWith(k) && 'SABCDE'.includes(t.slice(-1)))), k + nx]; out.push(cur ? `${k} ${cur} → ${nx}` : `${k} ${nx} 새로 얻음`); }
  const H = GROW.체력; if (out.length < L && """)
rep("if (sp) sp.textContent = `${R.f}층 · ${(NODE8[node.t] || {}).nm} · 얻은 것: ${rew.join(' · ')}`; }",
    "if (sp){ const nG = rows.filter(r => r.grow && r.grow.length).length; sp.textContent = `${R.f}층 · ${(NODE8[node.t] || {}).nm} · 얻은 것: ${rew.join(' · ')}${nG ? ' · ✦ 성장 ' + nG : ''}`; } }   /* v8.8.0 여정 정산 머리글에도 성장 (얻은 것 글이 덮어쓰던 것) */")
# 수련 · 이야기 성장: 보인 하나만 자라게 (예전엔 둘이 자라고 하나만 보임)
n0 = s.count('}).slice(0, 1)')
s2 = re.sub(r"growFor\((p|q), (\{[^{}]*\})\)\.slice\(0, 1\)", r"growFor(\1, \2, 1).slice(0, 1)", s)
n1 = s2.count(', 1).slice(0, 1)') - s.count(', 1).slice(0, 1)'); assert n1 >= 5, n1
s = s2
# 정산 글: 숨어 걸음 · 명령 닿음
rep("${r.healed ? ' · 치유 ' + r.healed : ''} · 걸음 ${r.moved}</small>", "${r.healed ? ' · 치유 ' + r.healed : ''}${r.sneak ? ' · 숨어 걸음 ' + r.sneak : ''}${r.cmds ? ' · 명령 닿음 ' + r.cmds : ''} · 걸음 ${r.moved}</small>")
rep("${r.healed ? ' · 치유 ' + r.healed : ''}</small></div></div>`; }).join('')}</div>`;", "${r.healed ? ' · 치유 ' + r.healed : ''}${r.sneak ? ' · 숨어 걸음 ' + r.sneak : ''}${r.cmds ? ' · 명령 닿음 ' + r.cmds : ''}</small></div></div>`; }).join('')}</div>`;")
# [방어X] 등급: 등급 목록 · 검사 · 글 · 아이콘
rep("const GRADE_KEYS = ['속력', '근력', '괴력', '지휘', '사격', '회피', '급소', '은신', '의학'];", "const GRADE_KEYS = ['속력', '근력', '괴력', '지휘', '사격', '회피', '급소', '은신', '의학', '방어'];   // v8.8.0 방어 (막아 낸 공격으로 자람)")
rep("const GRADE_RE = /^(속력|근력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학|신성|갑피)(SS|[SABCDE])$/", "const GRADE_RE = /^(속력|근력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학|신성|갑피|방어)(SS|[SABCDE])$/")
rep("  const m = /^(속력|근력|괴력|지휘|사격|회피|급소|의학)([SABC])$/.exec(t);",
    "  const m = /^(속력|근력|괴력|지휘|사격|회피|급소|의학|방어)([SABC])$/.exec(t);\n"
    "  if (m && m[1] === '방어'){ const k = rules.grades && rules.grades['방어'] ? rules.grades['방어'][m[2]] : 0.8, bm = rules.blockMul != null ? rules.blockMul : 0.2; return `막는 솜씨 — 막는 재능을 적어도 ${k} 로 (방패 · 막는 무기 · 받아넘기는 무기를 든 몸만 · 역할 공격수 · 사수 · 지원 0.5 · 미드필더 0.6 · 베테랑 0.9 · 전선 1): 막는 폭 ×${+(0.6 + 0.4 * k).toFixed(2)} · 막을 때 받는 피해 ×${+(1 - (1 - bm) * k).toFixed(2)} · 깎이는 자세 ×${+(2 - k).toFixed(2)}. 막아 낸 공격이 쌓여 자람 (상한 A)`; }   /* v8.8.0 */")
rep('"막기": 8,', '"막기": 8, "방어": 8,')

open(F, 'w', encoding='utf-8').write(s)
print('page8800 OK')
