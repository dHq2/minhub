# v9.9.9 페이지 — page9320.py v1.0 (v1.0: 보호 = 대장 관계의 두 번째 종류 — 🎖 대장 (따를이: 대장이 싸우면 적극 가담) · 🛡 보호 (보호받을이: 대장 등 뒤에 붙어 안전하게 후방 지원). 둘 다 '고른 아군 → 단추 → 대장을 누름'. 같은 대장 · 같은 종류를 다시 누르면 풀림 · 다른 종류면 바뀜. 옛 '보호 (지킬 아군 누르기 · 뛰어들기)' 없앰. 이름표 · 카드 · 상세 · 판의 선 (따를이 = 금빛 점선 · 보호받을이 = 청록 점선 + 🛡) 모두 종류대로 · 풀기 개수도 · 엔진 patch9270)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9310.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.8 (2026-10-26)', '<!-- 굴의 전투판 v9.9.9 (2026-10-26)')
rep("     v9.9.8: '🏳 부지휘'", '''     v9.9.9: 보호 = 대장 관계의 두 번째 종류 — 🎖 대장 (따를이 · 적극 가담) / 🛡 보호 (보호받을이 · 대장 등 뒤 후방 지원) · 둘 다 대장을 누름
     v9.9.8: '🏳 부지휘\'''')
for a, b in (('h1::after{content:" v9.9.8"', 'h1::after{content:" v9.9.9"'), ('<footer>굴의 전투판 v9.9.8', '<footer>굴의 전투판 v9.9.9'), ('return `굴의 전투판 v9.9.8 · ${title}', 'return `굴의 전투판 v9.9.9 · ${title}'),
             ("copyText('굴의 전투판 v9.9.8 자동 판 기록", "copyText('굴의 전투판 v9.9.9 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.8 — ${C.run", "o.push(`굴의 전투판 v9.9.9 — ${C.run"),
             ('의 버전 기록에 — v9.9.8 부지휘 이름표 없앰', '의 버전 기록에 — v9.9.9 보호 = 대장 관계 (보호받을이) / v9.9.8 부지휘 이름표 없앰'),
             ('">v9.9.8 부지휘 이름표 없앰', '">v9.9.9 보호 = 대장의 보호받을이 (등 뒤 후방 지원) · v9.9.8 부지휘 이름표 없앰'),
             ("ver: '9.9.8', kind:", "ver: '9.9.9', kind:"), ("RULES_MIG = '9.9.8',", "RULES_MIG = '9.9.9',")):
    rep(a, b)
# 공통 도우미
rep("const relNames = L => L.map(u => u.name).join(' · ');", "const relNames = L => L.map(u => u.name).join(' · ');\nconst kindNm = u => coverU(u) ? '보호받을이' : '따를이';   /* v9.9.9 대장 관계의 종류 */")
# 판 아래 막대
rep('data-cmd="chief" title="대장-부하 — 고른 아군이 부하가 돼요. 누른 뒤 대장이 될 아군을 눌러요"><span class="ic">🎖</span><span class="nm">대장</span><span class="sb">${relPick === \'chief\' ? \'대장 누르기\' : \'연결\'}</span></button>',
    'data-cmd="chief" title="대장 — 따를이: 고른 아군이 대장을 따름 (평소엔 대장 약간 뒤 · 대장이 싸우면 적극 가담 · 발 빠르면 상대 등 뒤로). 누른 뒤 대장을 눌러요 (같은 대장을 다시 = 풀림)"><span class="ic">🎖</span><span class="nm">대장</span><span class="sb">${relPick === \'chief\' ? \'대장 누르기\' : \'따를이\'}</span></button>')
rep('data-cmd="prot" title="보호 — 고른 아군이 지킬 아군을 눌러요. 평소엔 자유롭게 싸우다 그 아군이 노려지면 사이로 들어가 막아요 (같은 대상을 다시 누르면 풀림)"><span class="ic">🛡</span><span class="nm">보호</span><span class="sb">${relPick === \'prot\' ? \'지킬 이 누르기\' : L.some(u => u.protOf != null) ? \'지킴\' : \'연결\'}</span></button>',
    'data-cmd="prot" title="보호 — 보호받을이: 고른 아군이 대장 등 뒤에 딱 붙어 가능한 한 안전하게 후방 지원 (치료 · 사격 · 창이면 어깨 너머 찌르기 — 쫓아가지 않음 · 겨눠지면 대장을 방패로). 누른 뒤 대장을 눌러요 (같은 대장을 다시 = 풀림)"><span class="ic">🛡</span><span class="nm">보호</span><span class="sb">${relPick === \'prot\' ? \'대장 누르기\' : \'보호받을이\'}</span></button>')
rep('title="관계 풀기 — 고른 아군의 전우조 · 대장 · 보호를 모두 풂 (대장을 고르면 그 부하들도 · 지켜지는 이를 고르면 지키던 이도)"', 'title="관계 풀기 — 고른 아군의 전우조 · 대장 관계 (따를이 · 보호받을이) 를 모두 풂 (대장을 고르면 그 따를이 · 보호받을이도)"')
# 오른쪽 칸 관계 단추
rep('title="대장-부하: 고른 아군이 부하가 돼요 — 누른 뒤 대장이 될 아군을 눌러요. 부하는 인주 대신 대장을 따르고, 대장의 말은 바로 닿아요. 같은 대장이면 풀려요">🎖 ${relPick === \'chief\' ? \'대장을 누르세요…\' : \'대장 연결\'}</button>',
    'title="대장 — 따를이: 누른 뒤 대장을 눌러요. 대장을 따르고 대장이 싸우면 적극 가담 (같은 대장이면 풀림)">🎖 ${relPick === \'chief\' ? \'대장을 누르세요…\' : \'대장 (따를이)\'}</button>')
rep('title="보호: 고른 아군이 지킬 아군을 눌러요 — 평소엔 자유롭게 싸우다가 그 아군이 노려지면 사이로 들어가 몸 · 방패로 막아요 (같은 대상을 다시 누르면 풀림)">🛡 ${relPick === \'prot\' ? \'지킬 아군을 누르세요…\' : \'보호\'}</button>',
    'title="보호 — 보호받을이: 누른 뒤 대장을 눌러요. 대장 등 뒤에 붙어 안전하게 후방 지원 (같은 대장이면 풀림)">🛡 ${relPick === \'prot\' ? \'대장을 누르세요…\' : \'보호 (보호받을이)\'}</button>')
rep("${hasMate || hasChief || L.some(u => u.protOf != null) ? '' : 'disabled'}", "${relCount(Wd, L) ? '' : 'disabled'}")
# 휴대폰 막대
rep("data-dk=\"prot\"><span class=\"ic\">🛡</span>보호<small>${relPick === 'prot' ? '누르세요' : L.some(u => u.protOf != null) ? '지킴' : ''}</small></button>", "data-dk=\"prot\"><span class=\"ic\">🛡</span>보호<small>${relPick === 'prot' ? '대장 누르기' : '보호받을이'}</small></button>")
# 풀기 · 개수
rep("+ (u.chiefLk ? 1 : 0) + (u.protOf != null ? 1 : 0) + Wd.units.filter(m => m.alive && m.side === u.side && ((m.chiefLk && m.sqLead === u.i) || m.protOf === u.i) && !L.includes(m)).length, 0);", "+ (u.chiefLk ? 1 : 0) + Wd.units.filter(m => m.alive && m.side === u.side && m.chiefLk && m.sqLead === u.i && !L.includes(m)).length, 0);")
rep("    const up = L.filter(u => u.chiefLk); if (up.length) said.push('대장 (' + relNames(up) + ')');", "    const up = L.filter(u => u.chiefLk); if (up.length) said.push(up.map(u => (W.units[u.sqLead] || {}).name + '의 ' + kindNm(u) + ' ' + u.name).join(' · '));")
rep("if (fl.length) said.push('부하 ' + relNames(fl));", "if (fl.length) said.push(fl.map(m => kindNm(m) + ' ' + m.name).join(' · '));")
rep("    const pr = L.filter(u => u.protOf != null), pb = W.units.filter(m => m.alive && m.protOf != null && L.includes(W.units[m.protOf]) && !L.includes(m)); if (pr.length || pb.length) said.push('보호 ' + relNames([...pr, ...pb]));\n", "")
rep("cgLeave(W, L); chiefClear(W, [...L, ...fl]); [...pr, ...pb].forEach(u => { u.protOf = null; }); relPick = null; relSave();", "cgLeave(W, L); chiefClear(W, [...L, ...fl]); relPick = null; relSave();")
# 단추 → 대장 누르기 (두 종류)
rep("toast(relPick ? `🛡 ${relNames(L)} — 지킬 아군을 누르세요 (평소엔 자유롭게 싸우다 그 아군이 노려지면 사이로 들어가 막아요 · Esc 취소)` : '보호 연결을 취소했어요');", "toast(relPick ? `🛡 ${relNames(L)} — 지켜 줄 대장을 누르세요 (그 대장 등 뒤에 붙어 안전하게 후방 지원 · 같은 대장이면 풀림 · Esc 취소)` : '연결을 취소했어요');")
rep("toast(relPick ? `🎖 ${relNames(Fo)}의 대장을 누르세요 — 부하는 인주 대신 대장을 따르고, 대장의 말은 바로 닿아요 (지금 대장을 다시 누르면 풀려요 · 다 풀려면 ✂ 풀기 · Esc 취소)`", "toast(relPick ? `🎖 ${relNames(Fo)}의 대장을 누르세요 — 따를이는 대장을 따르고 대장이 싸우면 적극 가담해요 (같은 대장이면 풀림 · 다 풀려면 ✂ 풀기 · Esc 취소)`")
rep("  if (mode0 === 'prot'){ const on = !base.every(u => u.protOf === U.i); base.forEach(u => { u.protOf = on ? U.i : null; }); relSave(); toast(on ? `🛡 ${relNames(base)} → ${U.name}을(를) 지킴` : `🛡 ${relNames(base)} — 보호를 풀었어요`); hud(); return true; }   /* v9.9.1 */",
    "  if (mode0 === 'prot'){ const o = chiefSet(W, base, U, 'cover'); relSave(); toast(o.ok ? (o.on ? `🛡 ${relNames(base)} → ${U.name}의 보호받을이 — 등 뒤에 붙어 안전하게 후방 지원` : `🛡 ${relNames(base)} — ${U.name}의 보호받을이에서 풀렸어요`) : o.why); hud(); return true; }   /* v9.9.9 보호 = 대장 관계 (보호받을이) */")
rep("  else { const o = chiefSet(W, base, U); relSave(); toast(o.ok ? (o.on ? `🎖 ${U.name} ← 부하 ${relNames(base)} — 이제 인주 대신 ${U.name}을(를) 따라요` : `🎖 ${relNames(base)} — ${U.name}의 부하에서 풀렸어요 (다시 인주를 따름)`) : o.why); }",
    "  else { const o = chiefSet(W, base, U, 'follow'); relSave(); toast(o.ok ? (o.on ? `🎖 ${relNames(base)} → ${U.name}의 따를이 — 대장을 따르고 싸우면 적극 가담` : `🎖 ${relNames(base)} — ${U.name}의 따를이에서 풀렸어요 (다시 인주를 따름)`) : o.why); }")
# 카드 · 상세 · 관계 줄
rep("const sqB = u.sqLead != null && Wd.units[u.sqLead] ? `<span class=\"lk c\" title=\"대장 ${esc(Wd.units[u.sqLead].name)}의 부하 — 인주 대신 대장을 따르고, 대장의 말은 바로 닿고, 대장이 싸우는 적을 함께 노려요\">🎖 ${esc(Wd.units[u.sqLead].name)}의 부하</span>` : '';",
    "const sqB = u.sqLead != null && Wd.units[u.sqLead] ? `<span class=\"lk c\" title=\"${coverU(u) ? '보호받을이 — 대장 등 뒤에 붙어 안전하게 후방 지원' : '따를이 — 대장을 따르고 대장이 싸우면 적극 가담'}\">${coverU(u) ? '🛡' : '🎖'} ${esc(Wd.units[u.sqLead].name)}의 ${kindNm(u)}</span>` : '';   /* v9.9.9 */")
rep("<span class=\"lb\">대장</span> 🎖 ${esc((Wd.units[u.sqLead] || {}).name || '?')}의 부하</span>", "<span class=\"lb\">대장</span> ${coverU(u) ? '🛡' : '🎖'} ${esc((Wd.units[u.sqLead] || {}).name || '?')}의 ${kindNm(u)}</span>")
rep("    const pg = u.protOf != null && Wd.units[u.protOf] && Wd.units[u.protOf].alive ? Wd.units[u.protOf] : null, pb = Wd.units.filter(m => m.alive && m.protOf === u.i);\n", "")
rep("    return (pg ? `<span class=\"lk c\" title=\"보호\">🛡 ${esc(pg.name)} 지킴</span>` : '') + (pb.length ? `<span class=\"lk c\" title=\"보호받음\">🛡 ${esc(pb.map(m => m.name).join(' · '))}이 지켜 줌</span>` : '') + (ms.length",
    "    return (ms.length")
rep("(C ? `<span class=\"lk c\" title=\"대장\">🎖 대장 ${esc(C.name)}</span>` : '') + (fl.length ? `<span class=\"lk c\" title=\"부하\">🎖 부하 ${esc(fl.map(m => m.name).join(' · '))}</span>` : '')",
    "(C ? `<span class=\"lk c\" title=\"대장\">${coverU(u) ? '🛡' : '🎖'} ${esc(C.name)}의 ${kindNm(u)}</span>` : '') + (fl.filter(m => !coverU(m)).length ? `<span class=\"lk c\" title=\"따를이\">🎖 따를이 ${esc(fl.filter(m => !coverU(m)).map(m => m.name).join(' · '))}</span>` : '') + (fl.filter(coverU).length ? `<span class=\"lk c\" title=\"보호받을이\">🛡 보호받을이 ${esc(fl.filter(coverU).map(m => m.name).join(' · '))}</span>` : '')")
# 판의 선: 보호받을이 = 청록 점선 + 🛡 (대장 선 대신)
rep("    ctx.setLineDash([Math.max(5, ts * 0.26), Math.max(3, ts * 0.14)]); ctx.strokeStyle = 'rgba(255,214,110,.9)';", "    const cv0 = coverU(u); ctx.setLineDash(cv0 ? [Math.max(2, ts * 0.08), Math.max(3, ts * 0.12)] : [Math.max(5, ts * 0.26), Math.max(3, ts * 0.14)]); ctx.strokeStyle = cv0 ? 'rgba(90,220,210,.9)' : 'rgba(255,214,110,.9)';   /* v9.9.9 보호받을이는 청록 */")
i = s.index("  for (const u of al){ if (u.protOf == null) continue;"); j = s.index("\n", s.index("ctx.fillText('🛡', x1 + (x2 - x1) * 0.75", i))
s = s[:i] + "  for (const u of al){ if (!u.chiefLk || !coverU(u)) continue; const C = Wd.units[u.sqLead]; if (!C || !C.alive || (live && hidA(Wd, C))) continue; ctx.setLineDash([]); ctx.font = `${Math.max(10, ts * 0.36)}px sans-serif`; ctx.fillText('🛡', ox + (u.x * 0.7 + C.x * 0.3) * ts, oy + (u.y * 0.7 + C.y * 0.3) * ts); }   /* v9.9.9 보호받을이 표시 */" + s[j:]
rep("      const C = u.chiefLk && u.sqLead != null ? Wd.units[u.sqLead] : null; if (C && C.alive) tag(u, C, '대장', '#ffd66e');\n      for (const m of al) if (m.chiefLk && m.sqLead === u.i) tag(u, m, '부하', '#ffd66e');",
    "      const C = u.chiefLk && u.sqLead != null ? Wd.units[u.sqLead] : null; if (C && C.alive) tag(u, C, '대장', coverU(u) ? '#7fe6dc' : '#ffd66e');\n      for (const m of al) if (m.chiefLk && m.sqLead === u.i) tag(u, m, kindNm(m), coverU(m) ? '#7fe6dc' : '#ffd66e');")
rep("      const P = u.protOf != null ? Wd.units[u.protOf] : null; if (P && P.alive) tag(u, P, '지킬 이', '#7fe6dc');\n      for (const m of al) if (m.protOf === u.i) tag(u, m, '지켜 줌', '#7fe6dc'); } }", "    } }")
open(F, 'w', encoding='utf-8').write(s)
print('page9320 OK')
