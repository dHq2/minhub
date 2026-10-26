# v9.9.7 페이지 — page9300.py v1.0 (v1.0: 공식 부대장 없앰 — 노먼 설계의 부대장 · 2편대 (청광묵 · 친칠라 · 노먼) 기본값 · 배치 칸의 '공식 부대장' 체크 · 관계 상자의 ★ 부대장 단추 · 카드의 🎖 부대장 표시 · 상세의 직책 줄 (부대장 부분) · 편대 나누기의 부대장 자동 지정 · 점검의 '부대장 둘' 경고 · 부하 기본값 (2편대 → 부대장) · 대형 창 안내 글을 모두 뺌 · 한 번만: 저장된 판의 직책을 지우고, 2편대 기본값으로 생긴 '노먼의 부하' 관계도 풂 (손으로 맺은 관계는 그대로) · 엔진 patch9260)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9290.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.6 (2026-10-26)', '<!-- 굴의 전투판 v9.9.7 (2026-10-26)')
rep('     v9.9.6: 횃불은', '''     v9.9.7: 공식 부대장 없앰 — 지휘는 [지휘X] 점수와 대장-부하 관계로만 (노먼 · 청광묵 · 친칠라 2편대 기본값도 없앰)
     v9.9.6: 횃불은''')
for a, b in (('h1::after{content:" v9.9.6"', 'h1::after{content:" v9.9.7"'), ('<footer>굴의 전투판 v9.9.6', '<footer>굴의 전투판 v9.9.7'), ('return `굴의 전투판 v9.9.6 · ${title}', 'return `굴의 전투판 v9.9.7 · ${title}'),
             ("copyText('굴의 전투판 v9.9.6 자동 판 기록", "copyText('굴의 전투판 v9.9.7 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.6 — ${C.run", "o.push(`굴의 전투판 v9.9.7 — ${C.run"),
             ('의 버전 기록에 — v9.9.6 관계 단추', '의 버전 기록에 — v9.9.7 공식 부대장 없앰 / v9.9.6 관계 단추'),
             ('">v9.9.6 판 아래 관계 단추', '">v9.9.7 공식 부대장 없앰 · v9.9.6 판 아래 관계 단추'),
             ("ver: '9.9.6', kind:", "ver: '9.9.7', kind:"), ("RULES_MIG = '9.9.6',", "RULES_MIG = '9.9.7',")):
    rep(a, b)
# 설계 기본값
rep("weapon: '소총', bold: 0.5, rank: '부대장', sq: 'B',", "weapon: '소총', bold: 0.5,")
rep("{ key: '청광묵', side: 0, ref: 'C-004', name: '청광묵', tier: 2, sq: 'B',", "{ key: '청광묵', side: 0, ref: 'C-004', name: '청광묵', tier: 2,")
rep("{ key: '친칠라', side: 0, ref: 'C-106', name: '친칠라', tier: 2, sq: 'B',", "{ key: '친칠라', side: 0, ref: 'C-106', name: '친칠라', tier: 2,")
rep("  if (u.side === 0){ if (pf.rank && u.rank === undefined) u.rank = pf.rank; if (pf.sq && u.sq === undefined) u.sq = pf.sq; }", "  if (u.side === 0){ if (pf.sq && u.sq === undefined) u.sq = pf.sq; }   /* v9.9.7 직책은 옮기지 않음 */")
rep(" if (d.rank && u.rank === undefined && !S.units.some(x => x.side === 0 && x.rank === d.rank)){ u.rank = d.rank; fx.add(u.name); } }", " }   /* v9.9.7 직책 없음 */")
# 한 번만: 저장된 직책 · 2편대 기본 관계 지우기
rep("  S.v7192k = true; if (n) setTimeout(() => { save(); toast(`딸기에 역장 · 뿌리 벽 · 열매 맺기를 붙였어요 (${n}곳)`); }, 2100); }", """  S.v7192k = true; if (n) setTimeout(() => { save(); toast(`딸기에 역장 · 뿌리 벽 · 열매 맺기를 붙였어요 (${n}곳)`); }, 2100); }
if (!S.v997r){ const Dp = S.units.find(x => x.side === 0 && x.rank === '부대장'); let n = 0;   /* v9.9.7 공식 부대장 없앰 — 2편대 기본값으로 생긴 부대장의 부하 관계만 풂 */
  for (const p of S.units){ if (p.side !== 0) continue; if (p.rank){ p.rank = ''; n++; } if (p.sq === 'B'){ if (Dp && p !== Dp && (p.chiefNm === undefined || p.chiefNm === Dp.name)){ p.chiefNm = ''; n++; } delete p.sq; } }
  S.v997r = true; if (n) setTimeout(() => { save(); toast('공식 부대장을 없앴어요 — 2편대 기본 관계 (부대장의 부하) 도 풀었어요'); }, 2300); }""")
# 카드 표시
rep("  if (u !== C && u.rank === '부대장' && u.alive) return relB +", "  if (false) return relB +")   # v9.9.7 부대장 표시 없음
# 편대 나누기
rep("  const p = x.p; p.sq = q; if (q === 'A' && p.rank === '부대장') p.rank = ''; if (q === 'B' && !S.units.some(y => y.side === 0 && y.rank === '부대장')) p.rank = '부대장';", "  const p = x.p; p.sq = q;   /* v9.9.7 부대장 자동 지정 없음 */")
# 상세 직책 줄
rep("(u.rank === '부대장' || u.sqLead != null) ? `<span class=\"tr\"><span class=\"lb\">직책</span> ${u.rank === '부대장' ? '🎖 공식 부대장 — 편대 ' + Wd.units.filter(m => m.alive && m.sqLead === u.i).length + '명' + (u.sqFocus && Wd.t - u.sqFocus.t < 6 && Wd.units[u.sqFocus.b] ? ' · 표적 ' + esc(Wd.units[u.sqFocus.b].name) : '') : '🎖 ' + esc((Wd.units[u.sqLead] || {}).name || '?') + ' 편대' + (u.sqAuto ? ' (스스로 들어감)' : '')}</span>` : ''}",
    "u.sqLead != null ? `<span class=\"tr\"><span class=\"lb\">대장</span> 🎖 ${esc((Wd.units[u.sqLead] || {}).name || '?')}의 부하</span>` : ''}")
# 관계 상자
rep(" · ★ 공식 부대장${ld ? ' ' + esc(ld.name) + ' (지휘 ' + g + ')' : ''}</p>", "</p>")
rep("  const ld = A.find(p => p.rank === '부대장'), g = ld ? sqGradeOf(ld) : null;\n", "")
rep("""${relSelects(p, `data-relchief="${k}"`, `data-relmate="${k}"`) + `<button type="button" class="btn sm ${p.rank === '부대장' ? 'on' : ''}" data-sqlead="${k}" title="공식 부대장은 하나 — 지휘관의 말을 못 들은 이에게 2차로 전하고, 지휘관이 쓰러지면 바로 이어받아요">${p.rank === '부대장' ? '★ 부대장' : '☆ 부대장으로'}</button>`}""", """${relSelects(p, `data-relchief="${k}"`, `data-relmate="${k}"`)}""")
rep("  S.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0) return; u.rank = p.rank != null ? p.rank : u.rank; u.cg = null;", "  S.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0) return; u.cg = null;")
# 배치 칸 체크
rep("""<label class="ck" for="selSqLead"><input id="selSqLead" type="checkbox" ${p.rank === '부대장' ? 'checked' : ''}> 공식 부대장 — 지휘 ${cg}${cg === 'D' ? ' (지휘 스킬이 없어도 부하를 두면 기본 지시는 해요)' : cg === 'C' ? ' (기본 지시만 · 제대로 지휘하려면 B 이상)' : ''}</label>""", """<span class="brush">지휘 ${cg}${cg === 'D' ? ' (지휘 스킬이 없어도 부하를 두면 기본 지시는 해요)' : cg === 'C' ? ' (기본 지시만 · 제대로 지휘하려면 B 이상)' : ''}</span>""")
rep("  if (e.target.id === 'selSqLead'){ if (e.target.checked){ for (const x of S.units) if (x.side === 0 && x.rank === '부대장') x.rank = ''; p.rank = '부대장'; } else p.rank = ''; changed(); return; }   // v7.13 공식 부대장 (하나)\n", "")
# 부대장 상자 단추 처리
i = s.index("document.addEventListener('click', e => { const b = e.target.closest('[data-sqlead]');"); j = s.index("\n", s.index("const p = S.units[+b.dataset.sqlead];", i)); k = s.index("\n", j + 1)
print('REMOVED:', s[i:k + 1][:400].replace('\n', ' | '))
s = s[:i] + "/* v9.9.7 공식 부대장 단추 없앰 */\n" + s[k + 1:]
# 점검
rep("  if (ld.length > 1) add('bad', ld.map(p => p.name).join(' · '), '공식 부대장이 둘 넘음 — 하나만');\n", "")
rep(", ld = S0.filter(p => p.rank === '부대장');", ";")
rep("const relChiefName = p => { if (p.chiefNm !== undefined) return p.chiefNm || ''; const Dp = S.units.find(x => x.side === 0 && x.rank === '부대장'); return p.sq === 'B' && Dp && Dp !== p && !p.hero ? Dp.name : ''; };", "const relChiefName = p => p.chiefNm || '';   /* v9.9.7 부대장 기본값 없음 */")
rep("  const Dp = W.units.find(u => u.side === 0 && u.alive && u.rank === '부대장');\n", "")
rep("  S.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0) return; if (Dp && u !== Dp && p.sq === 'B' && p.chiefNm === undefined){ u.sqLead = Dp.i; u.sqFix = true; u.sqAuto = false; u.chiefLk = true; } });\n", "")
rep("2편대의 지휘 (부대장 · 명령 전달) 는 배치 탭의 편대 상자에서.", "대장 · 부하 관계는 판 아래 막대 (🎖 대장) 나 배치 탭에서.")
open(F, 'w', encoding='utf-8').write(s)
print('page9300 OK')
