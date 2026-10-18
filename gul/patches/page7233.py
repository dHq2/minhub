# v7.23.3 페이지 — page7233.py v1.2 (v1.2: 끝난 뒤엔 세자르 컷인 · 권위 창을 띄우지 않음 · v1.1: 갑피 아래에 쓴 장비를 상세 칸에 · 6단계 프롤로그 끝: 끝 화면의 '프롤로그 기록' — 맵마다 걸린 시간 · 처치 · 3S 만남과 그 끝 · 각혈 · 세자르 (싸운 시간) · 전리품 (누구 것을 누가) · 2F 는 다음에)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7232.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.23.2 (2026-10-18)', '<!-- 굴의 전투판 v7.23.3 (2026-10-18)')
rep('     v7.23.2: ', '''     v7.23.3: 프롤로그 끝 — 끝 화면에 프롤로그 기록 (맵마다 걸린 시간 · 처치 · 3S 만남과 그 끝 · 각혈 · 세자르와 싸운 시간 · 전리품은 누구 것을 누가 · 2F 는 다음에).
         갑피가 덮은 장비도 남음 (세자르의 노인의 왕관 — 막는 건 갑피 · 쓰러지면 전리품 · 상세 칸에 "… 씀").
     v7.23.2: ''')
rep('h1::after{content:" v7.23.2"', 'h1::after{content:" v7.23.3"')
rep('<footer>굴의 전투판 v7.23.2', '<footer>굴의 전투판 v7.23.3')
rep('return `굴의 전투판 v7.23.2 · ${title}', 'return `굴의 전투판 v7.23.3 · ${title}')
rep("copyText('굴의 전투판 v7.23.2 자동 판 기록", "copyText('굴의 전투판 v7.23.3 자동 판 기록")
rep('의 버전 기록에 — v7.23.2 세자르의 필살 · 권위', '의 버전 기록에 — v7.23.3 프롤로그 끝 · 기록 / v7.23.2 세자르의 필살 · 권위')
rep('">v7.23.2 · 1F 세자르 · 6단계</span>', '">v7.23.3 · 1F 프롤로그 끝 · 6단계</span>')
rep("ver: '7.23.2', at:", "ver: '7.23.3', at:")

# 세자르와 싸운 시간 (맵을 나갔다 와도 이어서 셈)
rep("  E.st = 'fight'; Wd.holdClear = true;", "  E.st = 'fight'; Wd.holdClear = true; E.tR = Wd.t; E.fs0 = 0; E.fs = 0;   /* v7.23.3 싸운 시간 */")
rep("  if (E.st === 'fight'){ const k = Wd.units.find(u => u.brain === 'cesar'); if (!k || !k.alive) czFall(Wd, E); }",
    "  if (E.st === 'fight'){ E.fs = +((E.fs0 || 0) + Wd.t - (E.tR || 0)).toFixed(1); const k = Wd.units.find(u => u.brain === 'cesar'); if (!k || !k.alive) czFall(Wd, E); }   /* v7.23.3 싸운 시간 */")
rep("  const HL = def.hall ? hallLayout() : null; if (HL && !st.cz) st.cz = { st: 'coffin', t0: null, near: false };",
    "  const HL = def.hall ? hallLayout() : null; if (HL && !st.cz) st.cz = { st: 'coffin', t0: null, near: false }; if (HL && st.cz.st === 'fight'){ st.cz.fs0 = st.cz.fs || 0; st.cz.tR = 0; }   /* v7.23.3 다시 들어오면 이어서 셈 */")
# 각혈: 그 맵을 나설 때 쓰러뜨렸는지
rep("  C.log.push({ s, t: +W.t.toFixed(1), res: W.result, kills: (W.kills || [0])[0], party: party.map(p => p.name) });\n  if (W.result === 'lose' || !party.length){ campEnd('wipe'); return; }",
    "  C.log.push({ s, t: +W.t.toFixed(1), res: W.result, kills: (W.kills || [0])[0], party: party.map(p => p.name) });\n  if (C.kh === s && C.stages[s].khDone){ const k = W.units.find(u => u.side === 1 && u.ref === 'C-097'); if (k) C.khRes = k.alive ? 'live' : 'down'; }   /* v7.23.3 프롤로그 기록 */\n  if (W.result === 'lose' || !party.length){ campEnd('wipe'); return; }")
# 끝 화면: 프롤로그 기록
rep("<p class=\"note\">${C.log.map(l => `${CAMP_S[l.s].name} ${l.t}초 ${l.res === 'exit' ? '→ 넘어감' : '전멸'}`).join(' · ')}</p></div>",
    "${kind === 'clear' ? prologRec(C, al) : `<p class=\"note\">${C.log.map(l => `${CAMP_S[l.s].name} ${l.t}초 ${l.res === 'exit' ? '→ 넘어감' : '전멸'}`).join(' · ')}</p>`}</div>")
rep("function campQuit(){", """// v7.23.3 프롤로그 기록: 맵마다 걸린 시간 (여러 번 들렀으면 더함) · 처치 · 3S 만남과 그 끝 · 각혈 (나타났을 때만) · 세자르 · 전리품 (살아남은 이가 지닌 남의 것) · 2F 는 다음에
const ENC_END = { joined: '동료가 됨', followed: '따라와 동료가 됨', declined: '거절함', foe: '싸움', rise: '싸움' };
function prologRec(C, al){
  const st = C.stages || {}, by = {}, mmss = t => t >= 60 ? `${Math.floor(t / 60)}분 ${Math.round(t % 60)}초` : `${Math.round(t)}초`, rows = [];
  for (const l of C.log || []) (by[l.s] = by[l.s] || []).push(l);
  const ss = [1, 2, 3, 4, 5].filter(k => by[k]), tot = (C.log || []).reduce((a, l) => a + (l.t || 0), 0), kills = (C.log || []).reduce((a, l) => a + (l.kills || 0), 0);
  rows.push(['맵', ss.map(k => `${CAMP_S[k].name} ${mmss(by[k].reduce((a, l) => a + (l.t || 0), 0))}${by[k].length > 1 ? ` (${by[k].length}번)` : ''}`).join(' · ') + ` — 모두 ${mmss(tot)} · 처치 ${kills}`]);
  if (st[3] && st[3].seen){ const E3 = enc3Of(C), e = st[3].enc, won = st[3].cleared;
    rows.push(['만남', `${esc(E3.name)}${e && e.name ? ' (' + esc(e.name) + ')' : ''} — ${!e ? (won ? '모두 쓰러뜨림' : '지나침') : e.st === 'foe' || e.st === 'rise' ? (won ? '싸워 이김' : '싸움 — 남겨 둠') : ENC_END[e.st] || '그냥 지나침'}`]); }
  if (C.kh && (st[C.kh] || {}).khDone) rows.push(['각혈', `${CAMP_S[C.kh].name} 에서 피할 수 없는 죽음이 찾아옴 — ${C.khRes === 'down' ? '쓰러뜨림' : '살아서 빠져나옴'}`]);
  const cz = (st[5] || {}).cz; if (cz && cz.st === 'stairs') rows.push(['세자르', `관 속의 왕이 일어섰다가 무너짐${cz.fs ? ' — 싸운 시간 ' + mmss(cz.fs) : ''}`]);
  const nmOf = k => k[0] === '#' ? k.slice(1) : ((designList().find(d => d.ref === k) || {}).name || k), tr = [];
  for (const p of al){ const me = ownKey(p), add = (nm, own) => { if (own && own !== me && nm) tr.push(`${esc(nm)} <small>← ${esc(nmOf(own))} · ${esc(p.name)}</small>`); };
    add(p.wName || p.weapon, p.wOwn); add(p.sName || '방패', p.sOwn); for (const sl in p.gear || {}){ const g = p.gear[sl]; if (g) add(g.name, g.own); }
    for (const x of p.bag || []) if (x.k !== 'ammo') add(x.label || x.name, x.own); }
  if (tr.length) rows.push(['전리품', tr.join(' · ')]);
  return `<div class="prec"><h4>프롤로그 기록</h4>${rows.map(([a, b]) => `<div><em>${a}</em><span>${b}</span></div>`).join('')}<p class="pnext">계단 아래는 아직 어둡습니다 — 2F 는 다음에.</p></div>`;
}
function campQuit(){""")
rep(".banner .cend p{width:100%;margin:4px 0 0;font:500 12px var(--body);color:#a39a8c}", """.banner .cend p{width:100%;margin:4px 0 0;font:500 12px var(--body);color:#a39a8c}
/* v7.23.3 프롤로그 기록 */
.banner .cend .prec{width:100%;max-width:560px;margin:8px auto 0;padding:8px 12px;border:1px solid #3a3240;border-radius:8px;background:rgba(12,10,16,.55);text-align:left;box-sizing:border-box}
.banner .cend .prec h4{margin:0 0 6px;font:700 13px var(--display);color:#e8d9b8;letter-spacing:3px;text-align:center}
.banner .cend .prec div{display:flex;gap:10px;padding:2px 0;font:500 12px/1.55 var(--body);color:#d6ccba}
.banner .cend .prec div em{flex:none;width:46px;font-style:normal;color:#8d8475}
.banner .cend .prec div span{min-width:0;overflow-wrap:anywhere}
.banner .cend .prec small{color:#9a9080}
.banner .cend .prec .pnext{margin:6px 0 0;text-align:center;font-style:italic;color:#b4a68a}""")
# 끝난 뒤 (프롤로그 끝 화면 위) 엔 컷인 · 권위 창을 띄우지 않음
rep("  const L = Wd.log, i0 = Wd._czI || 0; if (i0 >= L.length){ Wd._czI = L.length; return; } Wd._czI = L.length;", "  const L = Wd.log, i0 = Wd._czI || 0; if (i0 >= L.length){ Wd._czI = L.length; return; } Wd._czI = L.length; if (Wd.over || (S.camp && S.camp.end)) return;   /* v7.23.3 끝난 뒤엔 띄우지 않음 */")
# 상세 칸: 갑피 아래에 쓴 장비
rep("${k} ${esc(u.gear[k].name)} ${u.gear[k].tier}성 (${esc(u.gear[k].mat)})${u.gear[k].dur != null", "${k} ${esc(u.gear[k].name)} ${u.gear[k].tier}성 (${esc(u.gear[k].mat)})${u.gear[k].under ? ' · ' + esc(u.gear[k].under.name) + ' 씀' : ''}${u.gear[k].dur != null")
open(F, 'w', encoding='utf-8').write(s)
print('ok')
