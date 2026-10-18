# v7.10.0 페이지: 옛 야시 문구 정리 · 수치표에 밤 시력 칸
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
rep("toast(on ? '🔥 횃불을 켬 — 보이지만 들킴 (켜는 데 0.8초)' : '🌑 횃불을 끔 — 어둠 속에선 야시 · 후각이 있는 쪽만 봄');","toast(on ? '🔥 횃불을 켬 — 빛 안은 식별이 좋지만 눈이 부셔 빛 밖 어둠은 ×0.6, 불꽃은 18칸 밖에서도 보임 (켜는 데 0.8초)' : '🌑 횃불을 끔 — 불꽃은 숨지만 빛 밖 어둠은 밤 시력만큼만 보임 (인주: 형체 9 · 식별 4)');")
rep("속력 ${u.spd}${u.nv ? ' · 야시' : ''}${u.shield","속력 ${u.spd} · 밤 ${vgOf(u)}${u.shield")
rep("const traits = [...(u.nv ? ['야시'] : []), ...(u.armShield","const traits = [...(u.armShield")
rep("${u.hero ? ' 🔥' : ''}${u.nv ? ' · 야시' : ''}</td>","${u.hero ? ' 🔥' : ''}</td>")
rep("${u.hero ? '(주인공)' : ''}${u.nv ? '(야시)' : ''}","${u.hero ? '(주인공)' : ''}")
rep("[${e.nv ? '야시 있음' : '야시 없음'} · ${e.torch ?","[${e.torch ?")
rep("e.nv ? ' (야시: 어둠 속에서 봄)' : ''","e.nv ? ' (어둠 속에서 형체를 봄)' : ''")
rep("['nvB', '야시 B: 어둠 속에서 보는 거리 (칸, A 는 보는 거리 전부)', 0.5], ['nvC', '야시 C: 어둠 속에서 보는 거리 (칸)', 0.5], ","")
nl=[]
for g,nm in (('C','일반인'),('B','정규군'),('A','감각 특화'),('S','개조체')):
    for i,w in enumerate(('기척','형체','식별')):
        nl.append("['night.%s.%d', '밤 시력 %s (%s): %s 거리 (칸)']"%(g,i,g,nm,w))
nl+= ["['night.big', '밤 시력: 거구 (키 2.2m 이상) 보정 ×']","['night.small', '밤 시력: 작은 몸 (키 1.4m 이하) 보정 ×']","['night.move', '밤 시력: 움직이는 · 공격 중인 상대 ×']","['night.still', '밤 시력: 1.5초 넘게 가만히 있는 상대 ×']","['night.glare', '밤 시력: 빛 속에 선 눈 (눈부심) 의 빛 밖 형체 · 식별 ×']","['night.flame', '횃불 불꽃이 보이는 거리 (칸, 바위가 가리면 안 보임)']","['night.litIdent', '빛 안 상대를 식별하는 거리 (칸)']","['night.dimIdent', '어스름 띠 속 상대 식별 거리 ×']","['night.idDodge', '식별 못 하면 (형체만) 피하기 ×']","['night.senseErr', '기척의 자리 오차 (거리 × 이 값, 최대 3.5칸)']"]
rep("['nvC', '야시 C: 어둠 속에서 보는 거리 (칸)'], ['giantBlock',", ", ".join(nl)+", ['giantBlock',")
rep("  '야시': 'A: 어둠 속에서도 보는 거리 전부 (9칸). B: 어둠 속에서는 5칸까지. 야시가 없으면 빛 없는 칸의 상대는 몸이 닿아야 겨우 알고, 거의 못 맞힘',","  '야시': '(v7.10 부터 모두 어둠에 적응한 눈 — 설정의 밤 시력 칸 C · B · A · S 로 대신함) 기척 · 형체 · 식별 세 단계 거리',")
rep("note: '야시 B (어둠 속 5칸) · 횃불은 멀리서도 봄.","note: '밤 시력 B (형체 11 · 식별 6) · 횃불은 멀리서도 봄.")
rep("note: '야시 A (어둠 속에서도 다 봄) · 횃불은 멀리서도 봄.","note: '밤 시력 A (형체 14 · 식별 7) · 횃불은 멀리서도 봄.")
open(f,'w').write(s); print('ok')
