# v7.17.1 페이지 — page7171.py v1.1 (v1.1: 그림이 오기 전엔 특성 이름 풀이도 안 함 — GRADE_RE 가 아직 없을 때 · 특성 · 기술 아이콘: 굴의 도감 아이콘 한 장 (icons.webp) · 등급은 테두리 색 · 상세 · 특성 탭 · 기술 막대 · 조작판 · 부채 · 고리 · 동료 카드)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
import json
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
IX = json.load(open(D + 'icons_idx.json', encoding='utf-8'))

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.17.0 (2026-10-18)', '<!-- 굴의 전투판 v7.17.1 (2026-10-18)')
rep('     v7.17.0: ', '''     v7.17.1: 특성 · 기술 아이콘 — 굴의 도감 아이콘 (icons.webp 한 장 · 35개) 을 특성 · 공통 기술에 붙임. 등급은 테두리 색 (S 금빛 · A 핏빛 · B 청록 · C 보라 · D 초록 · E 회색).
         보이는 곳: 상세 정보의 특성 줄 · 고유특성 · 특성 탭 (등급표 · 특성표 · 액티브) · 기술 막대 · 모바일 조작판 · 꾹 누름 부채 · 머리 위 고리 · 동료 카드 (특성 띠). 아이콘이 없는 특성은 글자 그대로.
     v7.17.0: ''')
rep('h1::after{content:" v7.17.0"', 'h1::after{content:" v7.17.1"')
rep('<footer>굴의 전투판 v7.17.0', '<footer>굴의 전투판 v7.17.1')
rep('return `굴의 전투판 v7.17.0 · ${title}', 'return `굴의 전투판 v7.17.1 · ${title}')
rep("copyText('굴의 전투판 v7.17.0 자동 판 기록", "copyText('굴의 전투판 v7.17.1 자동 판 기록")
rep('의 버전 기록에 — v7.17.0 1F 1단계', '의 버전 기록에 — v7.17.1 특성 · 기술 아이콘 (도감 · 등급 테두리) / v7.17.0 1F 1단계')
rep('">v7.17.0 · 1F 1단계 (스텝 · 기습 · 궁수 12칸)</span>', '">v7.17.1 · 특성 · 기술 아이콘</span>')

# ---------- 아이콘 표 · 그리기 ----------
ico_js = json.dumps({'cols': IX['cols'], 'rows': IX['rows'], 'map': IX['map']}, ensure_ascii=False)
rep("function faceCss(idx, px){", """// v7.17.1 특성 · 기술 아이콘 (굴의 도감 아이콘 · icons.webp 한 장 — icons7171.py 가 만듦) · 등급은 테두리 색
const ICO = """ + ico_js + """, ICO_GC = { S: '#f2dc96', A: '#ff8a70', B: '#6fe0d0', C: '#9b7fd0', D: '#3fbf6a', E: '#a39a8c' };
const icoImg = new Image(); let icoOK = false; icoImg.onload = () => { icoOK = true; try { hud(); } catch (e) {} }; icoImg.src = 'icons.webp';
function icoKey(t){ const m = GRADE_RE.exec(t); if (m) return [m[1], m[2]]; if (t === '높은후각') return ['후각', '']; if (/^실명/.test(t)) return ['실명', '']; if (/^공통스킬:/.test(t)) return [t.slice(5), '']; return ICO.map[t] != null ? [t, ''] : null; }
function ico(lab, g, tip){ const i = ICO.map[lab]; if (i == null || !icoOK) return ''; return `<span class="tico" style="--ix:${i % ICO.cols};--iy:${(i / ICO.cols) | 0}${g && ICO_GC[g] ? ';--gc:' + ICO_GC[g] : ''}"${tip ? ` title="${esc(tip)}"` : ''}></span>`; }
const icoT = (t, g) => { if (!icoOK) return ''; const k = icoKey(t); return k ? ico(k[0], g || k[1], '[' + t + ']') : ''; };
const icOf = x => (x.ix && ico(x.ix)) || x.ic;
// 동료 카드 특성 띠: 등급 특성 · 눈에 띄는 특성 (일반인 · 제약 · 가호 · 축복은 뺌) — 6개까지
function traitStrip(u){ if (!icoOK) return ''; const L = []; if (u.nv) L.push(['야시', u.nvG || 'B', '[야시 ' + (u.nvG || 'B') + ']']);
  for (const t of u.traits || []){ if (/^(제약|가호|축복):|^일반인$|^야시$/.test(t)) continue; const k = icoKey(t); if (k) L.push([k[0], t === '높은후각' ? (u.smellG || 'A') : k[1], '[' + t + ']']); }
  for (const n of u.unique || []) if (ICO.map[n] != null) L.push([n, '', '◆' + n]);
  return L.slice(0, 6).map(([k, g, tip]) => ico(k, g, tip)).join(''); }
function faceCss(idx, px){""")
rep(".fc.palmOn{", ".tico{--s:1.3em;--gc:#6b5f4f;display:inline-block;width:var(--s);height:var(--s);vertical-align:-.32em;margin-right:4px;border-radius:4px;flex:none;background:#14120f url(icons.webp) no-repeat;background-size:calc(var(--s) * " + str(IX['cols']) + ") calc(var(--s) * " + str(IX['rows']) + ");background-position:calc(var(--s) * var(--ix) * -1) calc(var(--s) * var(--iy) * -1);box-shadow:0 0 0 1.5px var(--gc)}   /* v7.17.1 특성 · 기술 아이콘 */\n.ic .tico{--s:1.2em;margin:0;vertical-align:middle} .tis{display:inline-flex;gap:3px;margin-left:5px;vertical-align:middle} .tis .tico{--s:15px;margin:0;box-shadow:0 0 0 1px var(--gc)} body.mob .tis{display:none}\n.fc.palmOn{")

# ---------- 기술 칸: 아이콘 이름 ----------
rep("  if (S2.k === 'charge'){ const sh = C.some(u => u.shield && !u.armShield); st.ic = sh ? '🛡' : '💨'; st.nm = sh ? '방패 돌진' : '돌진';",
    "  if (S2.k === 'charge'){ const sh = C.some(u => u.shield && !u.armShield); st.ic = sh ? '🛡' : '💨'; st.nm = sh ? '방패 돌진' : '돌진'; st.ix = C.some(u => u.modBody) ? '돌진' : sh ? '방패 돌진' : '돌격';")
rep("  else if (S2.k === 'throw'){ const kn = C.every(u => isKnife(Wd, u)); if (kn){ st.ic = '🗡'; st.nm = '투척'; }",
    "  else if (S2.k === 'throw'){ const kn = C.every(u => isKnife(Wd, u)); if (kn){ st.ic = '🗡'; st.nm = '투척'; } else st.ix = '투창';")
rep("  else if (S2.k === 'leap'){ st.cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t));", "  else if (S2.k === 'leap'){ st.ix = '도약'; st.cd = Math.max(0, ...C.map(u => u.leapCd - Wd.t));")
rep("  else if (S2.k === 'palm'){ st.cd = Math.max(0, ...C.map(u => u.palmCd - Wd.t));", "  else if (S2.k === 'palm'){ st.ix = '팜 버스트'; st.cd = Math.max(0, ...C.map(u => u.palmCd - Wd.t));")
rep("  else { const K = C[0].skill; st.nm = K.name;", "  else { const K = C[0].skill; st.nm = K.name; st.ix = K.kit ? '응급처치' : '약';")
# 기술 막대 · 조작판 · 고리 · 부채
rep('data-sk="${n}" title="${esc(s2.nm)} (숫자키 ${n})" ${s2.off ? \'disabled\' : \'\'}><kbd>${n}</kbd><span class="ic">${s2.ic}</span>', 'data-sk="${n}" title="${esc(s2.nm)} (숫자키 ${n})" ${s2.off ? \'disabled\' : \'\'}><kbd>${n}</kbd><span class="ic">${icOf(s2)}</span>')
rep('data-dk="sk${n}"><span class="ic">${s2.ic}</span>', 'data-dk="sk${n}"><span class="ic">${icOf(s2)}</span>')
rep('><span class="ic">${x.ic}</span>${esc(x.nm.length > 4 ? x.nm.slice(0, 4) : x.nm)}', '><span class="ic">${icOf(x)}</span>${esc(x.nm.length > 4 ? x.nm.slice(0, 4) : x.nm)}')
rep('style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px"><span class="ic">${it.ic}</span>', 'style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px"><span class="ic">${icOf(it)}</span>')
rep("  const ch = slotState(Wd, C, 1); if (!ch.off) out.push({ k: 'charge', ic: ch.ic, nm: '돌진', cd: ch.cd });", "  const ch = slotState(Wd, C, 1); if (!ch.off) out.push({ k: 'charge', ic: ch.ic, ix: ch.ix, nm: '돌진', cd: ch.cd });")
rep(": { k: 'throw', ic: '🔱', nm: '투창' });", ": { k: 'throw', ic: '🔱', ix: '투창', nm: '투창' });")
rep("if (!lp.off) out.push({ k: 'leap', ic: '↩', nm: '도약', cd: lp.cd });", "if (!lp.off) out.push({ k: 'leap', ic: '↩', ix: '도약', nm: '도약', cd: lp.cd });")
rep("if (!pm.off) out.push({ k: 'palm', ic: '💥', nm: '팜 버스트', cd: pm.cd });", "if (!pm.off) out.push({ k: 'palm', ic: '💥', ix: '팜 버스트', nm: '팜 버스트', cd: pm.cd });")
rep("out.push({ k: 'skill', ic: '✚', nm: (sk.nm || '약').slice(0, 4), cd: sk.cd }); }", "out.push({ k: 'skill', ic: '✚', ix: sk.ix, nm: (sk.nm || '약').slice(0, 4), cd: sk.cd }); }")
rep("out.push({ k: 'guard', ic: '🛡', nm: '막기→'", "out.push({ k: 'guard', ic: '🛡', ix: '막기', nm: '막기→'")

# ---------- 상세 정보 · 특성 탭 ----------
rep('return `<span class="tr"><i>[${esc(t === \'높은후각\' ? t + \' \' + (u.smellG || \'A\') : t === \'야시\' ? t + \' \' + (u.nvG || \'B\') : t)}]</i>',
    'return `<span class="tr">${icoT(t, t === \'높은후각\' ? u.smellG || \'A\' : t === \'야시\' ? u.nvG || \'B\' : \'\')}<i>[${esc(t === \'높은후각\' ? t + \' \' + (u.smellG || \'A\') : t === \'야시\' ? t + \' \' + (u.nvG || \'B\') : t)}]</i>')
rep('return d ? `<span class="tr"><span class="uq">◆[${esc(name)}]</span>', 'return d ? `<span class="tr">${ico(name, \'\', \'◆\' + name)}<span class="uq">◆[${esc(name)}]</span>')
rep("GS.map(g => `<th class=\"l\">${g}</th>`).join('') + '</tr></thead><tbody>' + GK.map(k => `<tr><td class=\"l\">${k}</td>",
    "GS.map(g => `<th class=\"l\" style=\"color:${ICO_GC[g]}\">${g}</th>`).join('') + '</tr></thead><tbody>' + GK.map(k => `<tr><td class=\"l\">${ico(k, '', k)}${k}</td>")
rep("Object.keys(TRAITS).filter(t => !isG(t)).map(t => `<tr><td class=\"l\">[${esc(t)}]</td>", "Object.keys(TRAITS).filter(t => !isG(t)).map(t => `<tr><td class=\"l\">${icoT(t)}[${esc(t)}]</td>")
rep("return `<tr><td class=\"l\">◆${esc(k)}</td>", "return `<tr><td class=\"l\">${ico(k, '', '◆' + k)}◆${esc(k)}</td>")
rep("Object.keys(ACTIVE).map(a => `<tr><td class=\"l\">액티브 · ${esc(a)}</td>", "Object.keys(ACTIVE).map(a => `<tr><td class=\"l\">${ico(a, '', a)}액티브 · ${esc(a)}</td>")
# 동료 카드: 이름 뒤 특성 띠 (데스크톱)
rep('<span class="nm"><b class="no">${allyNo(Wd, u)}</b> ${esc(u.name)}${u.torch', '<span class="nm"><b class="no">${allyNo(Wd, u)}</b> ${esc(u.name)}<span class="tis">${traitStrip(u)}</span>${u.torch')

open(F, 'w', encoding='utf-8').write(s)
print('page7171 OK')
