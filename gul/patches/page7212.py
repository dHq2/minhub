# v7.21.2 페이지 — page7212.py v1.2 (v1.2: 넘어간 판의 일지 끝맺음 · v1.1: 정산 창이 뜨면 캠페인 띠는 숨김 (제목이 가리던 것) · 넘어간 판의 상태 줄 · '다시' 는 다음 맵으로 · 맵마다 정산 · 성장: 맵을 넘어가면 그 맵의 정산 창 (초상화 · 처치 · 준 / 받은 피해 · 막음 · 맞힘 · 피함 · 치유 · 걸음) + 성장 (그 맵에서 싸운 대로 — 사격 · 회피 · 속력 · 괴력 등급 한 단계 · 체력 +5, 인물마다 재능이 다름 · 정해진 범위 안) → '다음 맵으로')
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.21.1 (2026-10-18)', '<!-- 굴의 전투판 v7.21.2 (2026-10-18)')
rep('     v7.21.1: ', '''     v7.21.2: 맵마다 정산 · 성장 — 맵을 넘어가면 정산 창 (초상화 · 처치 · 준 / 받은 피해 · 막음 · 맞힘 · 피함 · 치유 · 걸음).
         성장은 그 맵에서 싸운 대로: 많이 맞힘 → 사격 · 많이 피함 → 회피 · 많이 움직임 → 속력 · 근접으로 많이 줌 → 괴력 (한 단계씩 · 사격 · 회피는 A · 속력 · 괴력은 B 까지) · 많이 버팀 → 체력 +5 (+20 까지).
         인물마다 재능 (0.7 ~ 1.3 배) 이 달라 같은 싸움에도 오르는 게 다름. 한 맵에 둘까지.
     v7.21.1: ''')
rep('h1::after{content:" v7.21.1"', 'h1::after{content:" v7.21.2"')
rep('<footer>굴의 전투판 v7.21.1', '<footer>굴의 전투판 v7.21.2')
rep('return `굴의 전투판 v7.21.1 · ${title}', 'return `굴의 전투판 v7.21.2 · ${title}')
rep("copyText('굴의 전투판 v7.21.1 자동 판 기록", "copyText('굴의 전투판 v7.21.2 자동 판 기록")
rep('의 버전 기록에 — v7.21.1 뽑기 연출', '의 버전 기록에 — v7.21.2 맵마다 정산 · 성장 / v7.21.1 뽑기 연출')
rep('">v7.21.1 · 1F 캠페인 · 뽑기</span>', '">v7.21.2 · 1F 캠페인 · 정산 · 성장</span>')

# ---------- 성장 ----------
rep("function campPlace(m, units, y0, y1, x0, x1){", r"""// v7.21.2 성장: 그 맵에서 싸운 대로 (by = 셈) · need 를 넘으면 한 단계 (재능 0.7 ~ 1.3 배로 나눔) · cap 까지 · 체력은 step 씩 max 까지 · 한 맵에 둘까지
const GROW = { 사격: { need: 8, cap: 'A', by: 'hits' }, 회피: { need: 4, cap: 'A', by: 'dodges' }, 속력: { need: 140, cap: 'B', by: 'moved' }, 괴력: { need: 160, cap: 'B', by: 'meleeDealt' }, 체력: { need: 90, step: 5, max: 20, by: 'taken' } };
const GRADE_UP = { '': 'C', C: 'B', B: 'A', A: 'S' }, GRADE_N = { '': 0, C: 1, B: 2, A: 3, S: 4 };
const talent = (ref, k) => { let h = 2166136261; for (const c of String(ref) + '|' + k) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return 0.7 + ((h >>> 0) % 1000) / 1000 * 0.6; };   // 인물마다 · 갈래마다 다른 재능 (시드)
const stageStats = W => W.units.filter(u => u.side === 0).map(u => ({ pid: u.pid, name: u.name, ref: u.ref, gone: u.gone || '', alive: u.alive || (!!u.gone && u.gone !== 'left'), kills: u.kills || 0, dealt: Math.round(u.dealt || 0), taken: Math.round(u.taken || 0), blocked: u.blocked || 0, shots: u.shots || 0, hits: Math.max(0, (u.shots || 0) - (u.miss || 0)), healed: Math.round(u.healed || 0), moved: Math.round(u.moved || 0), dodges: (W.log || []).filter(l => l.k === 'dodge' && l.a === u.i).length, meleeDealt: isRangedW((W.rules.weapons || {})[(u.kit0 && u.kit0.weapon) || u.weapon] || {}) ? 0 : Math.round(u.dealt || 0) }));
function growFor(p, st){
  const out = [], key = p.ref || p.name; p.traits = p.traits || [];
  for (const k of ['사격', '회피', '속력', '괴력']){ const G = GROW[k], v = st[G.by] || 0; if (out.length >= 2 || v < G.need / talent(key, k)) continue;
    const cur = (p.traits.find(t => t.length === k.length + 1 && t.startsWith(k)) || '').slice(-1); if (GRADE_N[cur] >= GRADE_N[G.cap]) continue;
    const nx = GRADE_UP[cur]; p.traits = [...p.traits.filter(t => !(t.length === k.length + 1 && t.startsWith(k))), k + nx]; out.push(`${k} ${cur || '없음'} → ${nx}`); }
  const H = GROW.체력; if (out.length < 2 && st.taken >= H.need / talent(key, '체력') && (p.growHp || 0) < H.max){ p.ov = p.ov || {}; const base = p.ov.hp != null ? +p.ov.hp : statsOf({ ...p, ov: {} }, rules).hp; p.ov.hp = base + H.step; p.growHp = (p.growHp || 0) + H.step; if (p.hpNow != null) p.hpNow += H.step; out.push(`체력 +${H.step} (${p.ov.hp})`); }
  if (out.length) p.grown = [...(p.grown || []), ...out];
  return out;
}
function campResult(rows, s, btn, go){
  const b = $('banner'), def = CAMP_S[s] || { name: s + 'S' };
  b.className = 'banner win';
  b.innerHTML = `<b>${def.name} 정산</b><span>${esc(def.kind || '')} · 넘어간 이 ${rows.filter(r => r.alive).length}${rows.some(r => r.grow && r.grow.length) ? ' · ✦ 성장' : ''}</span>
    <div class="cres">${rows.map(r => `<div class="cr${r.alive ? '' : ' dead'}"><i style="${faceCss(faceOf(r.ref), 44)}"></i><div><b>${esc(r.name)}${r.alive ? '' : r.gone === 'left' ? ' · 버림' : ' · 쓰러짐'}</b><small>처치 ${r.kills} · 준 피해 ${r.dealt} · 받은 피해 ${r.taken}${r.blocked ? ' · 막음 ' + r.blocked : ''}${r.shots ? ' · 맞힘 ' + r.hits + '/' + r.shots : ''}${r.dodges ? ' · 피함 ' + r.dodges : ''}${r.healed ? ' · 치유 ' + r.healed : ''} · 걸음 ${r.moved}</small>${r.grow && r.grow.length ? `<em>✦ ${esc(r.grow.join(' · '))}</em>` : ''}</div></div>`).join('')}</div>
    <div class="row"><button class="btn go" type="button" id="campNext">${esc(btn)}</button></div>`;
  b.hidden = false; $('campNext').onclick = () => { b.hidden = true; go(); };
}
function campPlace(m, units, y0, y1, x0, x1){""")
# 넘어갈 때: 셈 → 반영 → 성장 → 정산 창 → 다음 맵
rep("  const s = C.s, party = [], dirs = {};", "  const s = C.s, party = [], dirs = {}, rows = stageStats(W);   // v7.21.2 정산 셈")
rep("  if (W.result === 'lose' || !party.length){ campEnd('wipe'); return; }\n  const dir = (dirs.up || 0) >= (dirs.down || 0) ? 'up' : 'down', ns = s + (dir === 'up' ? 1 : -1);\n  if (ns > 5){ C.s = 6; S.units = party; campEnd('clear'); return; }\n  C.s = Math.max(1, ns); campBuild(C.s, dir === 'up' ? 'down' : 'up', party);",
    """  if (W.result === 'lose' || !party.length){ campEnd('wipe'); return; }
  for (const r of rows){ const p = party.find(x => x.id === r.pid); r.grow = p ? growFor(p, r) : []; }   // v7.21.2 성장 (넘어간 이만)
  const dir = (dirs.up || 0) >= (dirs.down || 0) ? 'up' : 'down', ns = s + (dir === 'up' ? 1 : -1); save();
  if (ns > 5){ campResult(rows, s, '계단으로', () => { C.s = 6; S.units = party; campEnd('clear'); }); return; }
  campResult(rows, s, (CAMP_S[Math.max(1, ns)] || {}).name + ' 로', () => { C.s = Math.max(1, ns); campBuild(C.s, dir === 'up' ? 'down' : 'up', party); });""")
# 끝 화면에 성장 모음
rep("<small>${p.hpNow != null ? '피 ' + p.hpNow : ''}</small></span>`).join('') : ''}", "<small>${p.hpNow != null ? '피 ' + p.hpNow : ''}${(p.grown || []).length ? ' · ✦ ' + esc(p.grown.join(' · ')) : ''}</small></span>`).join('') : ''}")

rep("/* v7.21.1 뽑기 연출 */", """/* v7.21.2 정산 창 */
.banner .cres{margin-top:8px;display:flex;flex-direction:column;gap:6px;text-align:left;max-height:min(50vh,380px);overflow:auto}
.banner .cr{display:flex;gap:8px;align-items:center;padding:4px 0;border-bottom:1px dashed #3a3240}
.banner .cr.dead{opacity:.55}
.banner .cr i{flex:0 0 44px;width:44px;height:44px;border-radius:6px;border:1px solid #3a3240}
.banner .cr b{display:block;font:700 13px var(--body);color:#ece4d6}
.banner .cr small{display:block;font:500 11px var(--mono);color:#a39a8c}
.banner .cr em{display:block;font-style:normal;font:600 12px var(--body);color:#d9a94e}
/* v7.21.1 뽑기 연출 */""")

rep("  if (!C || C.end){ if (!el.hidden || force){ el.hidden = true; el.innerHTML = ''; campBarH = ''; } return; }", "  if (!C || C.end || (world && world.over && !$('banner').hidden)){ if (!el.hidden || force){ el.hidden = true; el.innerHTML = ''; campBarH = ''; } return; }   // v7.21.2 정산 · 끝 창이 뜨면 숨김")
rep("${Wd.result === 'win' ? '적을 모두 쓰러뜨렸어요' : '전멸했어요'} — 다시 하거나 배치로. 이야기 · 로그는 아래에", "${Wd.result === 'exit' ? '맵을 넘어감 — 정산 창에서 다음 맵으로' : Wd.result === 'win' ? '적을 모두 쓰러뜨렸어요' : '전멸했어요'}${Wd.result === 'exit' ? '' : ' — 다시 하거나 배치로'}. 이야기 · 로그는 아래에")
rep("  if (mode === 'edit' || (world && world.over)){ start(); return; }", "  if (world && world.over && world.camp && S.camp && !S.camp.end && $('campNext')){ $('campNext').click(); return; }   // v7.21.2 캠페인: 넘어간 판의 '다시' = 다음 맵으로\n  if (mode === 'edit' || (world && world.over)){ start(); return; }", 2)
rep("  else out.push('시간이 다 됐다 — 끝을 보지 못했다.');", "  else if (Wd.result === 'exit') out.push('일행은 어둠 속 다음 길로 빠져나갔다.');   // v7.21.2 캠페인: 맵을 넘어감\n  else out.push('시간이 다 됐다 — 끝을 보지 못했다.');")
open(F, 'w', encoding='utf-8').write(s)
print('page7212 OK')
