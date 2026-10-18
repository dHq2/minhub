import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    s=s.replace(a,b)
def cut(a,b,new):
    global s
    i=s.index(a); j=s.index(b,i); s=s[:i]+new+s[j+len(b):]
rep("toast(on ? '🔥 횃불을 켬 — 빛 안은 식별이 좋지만 눈이 부셔 빛 밖 어둠은 ×0.6, 불꽃은 18칸 밖에서도 보임 (켜는 데 0.8초)' : '🌑 횃불을 끔 — 불꽃은 숨지만 빛 밖 어둠은 밤 시력만큼만 보임 (인주: 형체 9 · 식별 4)');","toast(on ? '🔥 횃불을 켬 — 보이지만 들킴 (켜는 데 0.8초)' : '🌑 횃불을 끔 — 어둠 속에선 야시 · 후각이 있는 쪽만 봄');")
rep("속력 ${u.spd} · 밤 ${vgOf(u)}${u.shield","속력 ${u.spd}${u.nv ? ' · 야시' : ''}${u.shield")
rep("const traits = [...(u.armShield","const traits = [...(u.nv ? ['야시'] : []), ...(u.armShield")
rep("${u.hero ? ' 🔥' : ''}</td>","${u.hero ? ' 🔥' : ''}${u.nv ? ' · 야시' : ''}</td>")
rep("${u.hero ? '(주인공)' : ''}${Object.keys","${u.hero ? '(주인공)' : ''}${u.nv ? '(야시)' : ''}${Object.keys")
rep("[${e.torch ? '횃불 켬' : '횃불 없음/꺼짐'}","[${e.nv ? '야시 있음' : '야시 없음'} · ${e.torch ? '횃불 켬' : '횃불 없음/꺼짐'}")
rep("e.nv ? ' (어둠 속에서 형체를 봄)' : ''","e.nv ? ' (야시: 어둠 속에서 봄)' : ''")
rep("['sight', '보는 거리 (칸)', 0.5], ['heroLight'","['sight', '보는 거리 (칸)', 0.5], ['nvB', '야시 B: 어둠 속에서 보는 거리 (칸, A 는 보는 거리 전부)', 0.5], ['nvC', '야시 C: 어둠 속에서 보는 거리 (칸)', 0.5], ['heroLight'")
cut("['night.C.0',","['night.senseErr', '기척의 자리 오차 (거리 × 이 값, 최대 3.5칸)'],","['nvC', '야시 C: 어둠 속에서 보는 거리 (칸)'], ")
rep("  '야시': '(v7.10 부터 모두 어둠에 적응한 눈 — 설정의 밤 시력 칸 C · B · A · S 로 대신함) 기척 · 형체 · 식별 세 단계 거리',","  '야시': 'A: 어둠 속에서도 보는 거리 전부 (9칸). B: 어둠 속에서는 5칸까지. 야시가 없으면 빛 없는 칸의 상대는 몸이 닿아야 겨우 알고, 거의 못 맞힘',")
rep("note: '밤 시력 B (형체 11 · 식별 6) · 횃불은 멀리서도 봄.","note: '야시 B (어둠 속 5칸) · 횃불은 멀리서도 봄.")
rep("note: '밤 시력 A (형체 14 · 식별 7) · 횃불은 멀리서도 봄.","note: '야시 A (어둠 속에서도 다 봄) · 횃불은 멀리서도 봄.")
rep("('어둠 속 형체 ' + glareReach(Wd, u).toFixed(1) + '칸까지')","(u.nv ? '어둠 속 ' + glareReach(Wd, u).toFixed(1) + '칸까지' : '어둠은 안 보임')")
rep("'🔥 횃불 켬 — 빛 안은 식별 ' + (S3.night || {}).litIdent + '칸 · 눈이 부셔 빛 밖은 ×' + (S3.night || {}).glare + ' · 불꽃은 ' + (S3.night || {}).flame + '칸 밖에서도 보임'","'🔥 횃불 켬 — 빛 ' + S3.heroLight + '칸 안은 보임 (멀리서도 보임)'")
rep("nightTxt(Wd, u)","u.nv ? '야시 ' + (u.nvG || 'B') + ' — 어둠 속 ' + (u.nvG === 'A' ? S3.sight : u.nvG === 'C' ? S3.nvC : S3.nvB) + '칸' : '야시 없음 — 빛 밖은 거의 안 보임 (몸에 닿는 것만)'")
cut("const VGN = {","function linkBadge(Wd, u){","function linkBadge(Wd, u){")
rep("""<label class="ck" for="selVg">밤 시력</label><select id="selVg" aria-label="밤 시력 등급 (기척 · 형체 · 식별)">${['C', 'B', 'A', 'S'].map(g => `<option value="${g}" ${vgOf(p) === g ? 'selected' : ''}>${g} ${VGN[g]} — ${((rules.night || {})[g] || []).join(' · ')}</option>`).join('')}</select>""",
"""<label class="ck" for="selNv"><input id="selNv" type="checkbox" ${p.nv ? 'checked' : ''}> 야시 (어둠 속에서도 봄)</label>${p.nv ? `<select id="selNvG" aria-label="야시 등급"><option value="A" ${p.nvG === 'A' ? 'selected' : ''}>야시 A (9칸)</option><option value="B" ${p.nvG !== 'A' && p.nvG !== 'C' ? 'selected' : ''}>야시 B (${rules.nvB || 5}칸)</option><option value="C" ${p.nvG === 'C' ? 'selected' : ''}>야시 C (${rules.nvC || 2.5}칸)</option></select>` : ''}""")
rep("  if (e.target.id === 'selVg'){ p.vg = e.target.value; changed(); return; }   // v7.10 밤 시력 등급","  if (e.target.id === 'selNv'){ p.nv = e.target.checked; if (p.nv && !p.nvG) p.nvG = 'B'; changed(); return; }\n  if (e.target.id === 'selNvG'){ p.nvG = e.target.value; changed(); return; }")
rep("'weight', 'modBody', 'cry', 'mute', 'vg', 'rank'];","'weight', 'modBody', 'cry', 'mute', 'rank'];")
cut("      case 'presence': out.push(","\n","")
cut("    case 'presence': return {","\n","")
cut("  if (!ed && !see){   // v7.10 기척:","    ctx.restore(); }\n","")
# 버전
rep("<!-- 굴의 전투판 v7.10.1 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n","<!-- 굴의 전투판 v7.10.2 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v7.10.2: 야시만 v7.9.5 설정으로 되돌림 — 기척 · 형체 · 식별 3단계 · 밤 시력 등급 (C · B · A · S) · 기척 감지 (? 고리) · 불꽃 18칸 · 식별 못 하면 피하기 ↓ 를 없애고, 야시 A · B · C (어둠 속 9 · 5 · 2.5칸, 화광 실명, 어둠 속 명중 ×) 그대로. 아군 야시는 설계대로 (인주 C · 노먼 A · 레베카 A · 카리우스 B · 청광묵 B), 적은 도감 설정. 유지: 횃불 로그 (꺼진 채 떨어짐 · 0초 끄기 기록) · 🕊 교전 금지 표시 · 명령 전파 파동 · 부대장 노먼 편대. (아래 v7.10.0 · v7.10.1 의 야간 시야 글은 되돌린 기록.)\n")
rep("바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.1 등급 배정 / v7.10.0 야간","바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.2 야시 되돌림 · 전파 · 부대장 / v7.10.1 · v7.10.0 야간")
rep(">v7.10.1 · 밤 시력 등급 확정 · 야간 시야 3단계</span>",">v7.10.2 · 야시 되돌림 · 전파 파동 · 부대장</span>")
rep('h1::after{content:" v7.10.1"','h1::after{content:" v7.10.2"')
rep("<footer>굴의 전투판 v7.10.1","<footer>굴의 전투판 v7.10.2")
rep("return `굴의 전투판 v7.10.1 · ${title}","return `굴의 전투판 v7.10.2 · ${title}")
rep("copyText('굴의 전투판 v7.10.1 자동 판 기록","copyText('굴의 전투판 v7.10.2 자동 판 기록")
open(f,'w').write(s); print('page ok')
