# v9.9.1 페이지 — page9250.py v1.0 (v1.0: 관계 칸에 '🛡 보호' — 고른 아군이 지킬 아군을 누르면 보호 (같은 대상 다시 = 풀림) · 휴대폰 막대에도 · 관계 풀기는 보호도 풂 · 관계 표시 (🛡 지킴 · 지켜 줌) · 로그 글 (보호 · 기다림) · 이유 글 (보호 · 대장 등 뒤 · 함께 기다림) · 엔진 patch9200)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9240.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.0 (2026-10-25)', '<!-- 굴의 전투판 v9.9.1 (2026-10-25)')
rep('     v9.9.0: 막기 자동', '''     v9.9.1: 관계 다시 — 부하는 대장 등 뒤에 비비듯 (대장이 싸우면 닿는 부하는 같이 치고 · 발 빠른 부하는 상대 등 뒤로 · 치유는 한 걸음 뒤) · 전우는 짝이 제자리면 옆에서 기다림 · 🛡 보호 (평소엔 자유 · 대상이 노려지면 사이로) · 대장을 거친 명령은 더 빠르고 확실
     v9.9.0: 막기 자동''')
for a, b in (('h1::after{content:" v9.9.0"', 'h1::after{content:" v9.9.1"'), ('<footer>굴의 전투판 v9.9.0', '<footer>굴의 전투판 v9.9.1'), ('return `굴의 전투판 v9.9.0 · ${title}', 'return `굴의 전투판 v9.9.1 · ${title}'),
             ("copyText('굴의 전투판 v9.9.0 자동 판 기록", "copyText('굴의 전투판 v9.9.1 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.0 — ${C.run", "o.push(`굴의 전투판 v9.9.1 — ${C.run"),
             ('의 버전 기록에 — v9.9.0 막기 자동', '의 버전 기록에 — v9.9.1 관계 다시 (추종 · 보호) / v9.9.0 막기 자동'),
             ('">v9.9.0 막기 자동 · 돌격 한 가지 · 인주도 부하 가능 · 역장 · 화살비 · 길찾기</span>', '">v9.9.1 부하는 대장 등 뒤 · 🛡 보호 · 전우는 함께 기다림 · 막기 자동 · 돌격 한 가지</span>'),
             ("ver: '9.9.0', kind:", "ver: '9.9.1', kind:"), ("RULES_MIG = '9.9.0',", "RULES_MIG = '9.9.1',")):
    rep(a, b)
# 관계 칸 단추
i = s.index('<button class="btn" type="button" data-ord="relcut" ${hasMate || hasChief ? \'\' : \'disabled\'}')
s = s[:i] + '<button class="btn ${relPick === \'prot\' ? \'on\' : \'\'}" type="button" data-ord="prot" title="보호: 고른 아군이 지킬 아군을 눌러요 — 평소엔 자유롭게 싸우다가 그 아군이 노려지면 사이로 들어가 몸 · 방패로 막아요 (같은 대상을 다시 누르면 풀림)">🛡 ${relPick === \'prot\' ? \'지킬 아군을 누르세요…\' : \'보호\'}</button>' + s[i:]
rep('<button class="btn" type="button" data-ord="relcut" ${hasMate || hasChief ? \'\' : \'disabled\'}', '<button class="btn" type="button" data-ord="relcut" ${hasMate || hasChief || L.some(u => u.protOf != null) ? \'\' : \'disabled\'}')
rep("  if (k === 'relcut'){ const n = cgLeave(W, L) + chiefClear(W, L);", "  if (k === 'relcut'){ const n = cgLeave(W, L) + chiefClear(W, L) + L.filter(u => u.protOf != null).length; L.forEach(u => { u.protOf = null; });")
rep("  if (k === 'chief'){\n    const Fo = L.slice();", """  if (k === 'prot'){ if (!L.length){ toast('지켜 줄 아군을 먼저 고르세요'); return; }   /* v9.9.1 보호 */
    relPick = relPick === 'prot' ? null : 'prot'; relBase = L.map(u => u.i); toast(relPick ? `🛡 ${relNames(L)} — 지킬 아군을 누르세요 (평소엔 자유롭게 싸우다 그 아군이 노려지면 사이로 들어가 막아요 · Esc 취소)` : '보호 연결을 취소했어요'); hud(); return; }
  if (k === 'chief'){
    const Fo = L.slice();""")
rep("  if (mode0 === 'mate'){ const o = cgJoin(W, [...base, U]);", "  if (mode0 === 'prot'){ const on = !base.every(u => u.protOf === U.i); base.forEach(u => { u.protOf = on ? U.i : null; }); toast(on ? `🛡 ${relNames(base)} → ${U.name}을(를) 지킴` : `🛡 ${relNames(base)} — 보호를 풀었어요`); hud(); return true; }   /* v9.9.1 */\n  if (mode0 === 'mate'){ const o = cgJoin(W, [...base, U]);")
rep("  if (k === 'mate' || k === 'chief' || k === 'relcut'){ relKey(k); return; }", "  if (k === 'mate' || k === 'chief' || k === 'relcut' || k === 'prot'){ relKey(k); return; }")
rep("  if (k === 'mate' || k === 'chief'){ relKey(k); return; }   // v9.1", "  if (k === 'mate' || k === 'chief' || k === 'prot'){ relKey(k); return; }   // v9.1")
rep("      + (L.some(u => !u.crawl && !isFar(u)) ? `<button type=\"button\" class=\"db ${armed && armed.k === 'flank'", "      + (L.length ? `<button type=\"button\" class=\"db ${relPick === 'prot' ? 'on' : ''}\" data-dk=\"prot\"><span class=\"ic\">🛡</span>보호<small>${relPick === 'prot' ? '누르세요' : L.some(u => u.protOf != null) ? '지킴' : ''}</small></button>` : '')   /* v9.9.1 */\n      + (L.some(u => !u.crawl && !isFar(u)) ? `<button type=\"button\" class=\"db ${armed && armed.k === 'flank'")
# 관계 표시
rep("    return (ms.length ? `<span class=\"lk b\" title=\"전우조\">🤝 ${esc(ms.map(m => m.name).join(' · '))}</span>` : '')", "    const pg = u.protOf != null && Wd.units[u.protOf] && Wd.units[u.protOf].alive ? Wd.units[u.protOf] : null, pb = Wd.units.filter(m => m.alive && m.protOf === u.i);\n    return (pg ? `<span class=\"lk c\" title=\"보호\">🛡 ${esc(pg.name)} 지킴</span>` : '') + (pb.length ? `<span class=\"lk c\" title=\"보호받음\">🛡 ${esc(pb.map(m => m.name).join(' · '))}이 지켜 줌</span>` : '') + (ms.length ? `<span class=\"lk b\" title=\"전우조\">🤝 ${esc(ms.map(m => m.name).join(' · '))}</span>` : '')")
# 로그 · 이유
rep("      case 'pairGo': out.push(", "      case 'protGo': out.push(`${T(e)}🛡 ${n(e.a)} — ${n(e.b)}을(를) 노리는 ${n(e.c)} 앞을 막아섬 (보호)`); break;   /* v9.9.1 */\n      case 'pairGo': out.push(")
rep("    case 'pairGo': return e.how === 'keep'", "    case 'protGo': return { c: 'good', s: `${ga(n(e.a))} ${n(e.b)} 앞으로 뛰어들어 ${n(e.c)}을(를) 막아선다.` };   /* v9.9.1 */\n    case 'pairGo': return e.how === 'keep'")
rep("'mateRescue', 'stayShot', 'pairGo', 'cbrace'].includes(e.k)", "'mateRescue', 'stayShot', 'pairGo', 'cbrace', 'protGo'].includes(e.k)")
rep("cbrace: `🧱 ${n(e.a)} ${n(e.c)}의 돌격 → ${n(e.b)} 뒤를 받침`,", "cbrace: `🧱 ${n(e.a)} ${n(e.c)}의 돌격 → ${n(e.b)} 뒤를 받침`, protGo: `🛡 ${n(e.a)} → ${n(e.b)} 보호 (${n(e.c)} 앞을 막음)`,")
rep("CLUMP: '뭉침 — 어깨를 붙여 버팀', BRACE_CHARGE: '돌격 방어 — 동료 뒤를 받침' };", "CLUMP: '뭉침 — 어깨를 붙여 버팀', BRACE_CHARGE: '돌격 방어 — 동료 뒤를 받침', PROTECT: '보호 — 앞을 막음', PAIR_WAIT: '전우와 함께 기다림', PAIR_BACK: '대장 등 뒤', PAIR_PROT: '보호 대상 곁으로' };")
open(F, 'w', encoding='utf-8').write(s)
print('page9250 OK')
