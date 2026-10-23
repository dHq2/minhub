# v8.8.4 페이지 — page8840.py v1.0 (v1.0: 옐로 — 돌진 출발은 남들과 같게 · 달라붙기 3 ~ 5타 + 저항 게이지 · 도약 스택제)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8830.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.8.3 (2026-10-23)', '<!-- 굴의 전투판 v8.8.4 (2026-10-23)')
rep('     v8.8.3: 양동이 뿌리기 다시 (', '''     v8.8.4: 옐로 (민수 — "돌진도 동일한 배율로 스타트, 남들보다 훨씬 빨라져야 해" · "잡아서 할퀴는 건 최대 5타, 3 ~ 5타, 상대도 게이지로 저항" · "도약은 스택제 — 멀게 하면 두 개 다, 짧으면 하나"):
         돌진: 출발 ×1.2 (남들과 같음) → 3.5칸에서 ×4.0 (남들 최고 ×2.6) — 어느 거리에서도 남들보다 느리지 않음.
         달라붙기 난도질: 3 ~ 5타 (0.4초마다 한 번 · 마지막 타가 가장 셈) · 상대가 저항 게이지 (붙은 상대 둘레의 고리 + 아래 막대) 를 채우며 버팀 — 가볍고 약할수록 오래 (5타) · 무겁고 힘세면 빨리 풀려남 (3타).
         연속 도약: 스택 둘 · 쿨 2.2초마다 하나씩 충전 · 짧게 뛰면 하나 (1.7칸) · 멀리 찍으면 둘 다 써서 한 번에 (3.4칸) · 기술 칸에 ●○ 로 표시.
     v8.8.3: 양동이 뿌리기 다시 (''')
for a, b in (('h1::after{content:" v8.8.3"', 'h1::after{content:" v8.8.4"'), ('<footer>굴의 전투판 v8.8.3', '<footer>굴의 전투판 v8.8.4'), ('return `굴의 전투판 v8.8.3 · ${title}', 'return `굴의 전투판 v8.8.4 · ${title}'),
             ("copyText('굴의 전투판 v8.8.3 자동 판 기록", "copyText('굴의 전투판 v8.8.4 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.3 — ${C.run", "o.push(`굴의 전투판 v8.8.4 — ${C.run"),
             ('의 버전 기록에 — v8.8.3 양동이 뿌리기 다시 /', '의 버전 기록에 — v8.8.4 옐로 (돌진 · 3~5타 · 도약 스택) / v8.8.3 양동이 뿌리기 다시 /'),
             ('">v8.8.3 · 양동이 뿌리기 다시</span>', '">v8.8.4 · 옐로 돌진 · 3~5타 · 도약 스택</span>'),
             ("ver: '8.8.3', kind:", "ver: '8.8.4', kind:"), ("RULES_MIG = '8.8.3',", "RULES_MIG = '8.8.4',"),
             ("1.5 ~ 8칸 · 처음엔 살짝 느리다 끝에서 엄청 빨라짐 ·", "1.5 ~ 8칸 · 출발은 남들과 같은 도움닫기 (×1.2) 인데 달릴수록 남들 (최고 ×2.6) 보다 훨씬 빨라져 ×4.0 (3.5칸에서 최고) ·")):
    rep(a, b)
# 글
s = re.sub(r"  '연속 도약': '옐로 — [^\n]*',   /\* v8\.8\.2 \*/",
           "  '연속 도약': '옐로 — 도약 스택 둘: 쿨 2.2초마다 하나씩 충전 · 가까운 곳 (1.7칸 안) 은 스택 하나 · 멀리 (3.4칸까지) 찍으면 둘 다 써서 한 번에 멀리 뜀 · 스택이 남아 있으면 0.3초 뒤 또 뜀 · 기술 칸에 ●● 로 남은 스택. 명령: 기술 칸 3 → 바닥 · 적을 누름. 스스로도 자주: 붙지 못한 상대에게 뛰어듦 (멀면 둘 다 · 가까우면 하나 — 멀리서 돌진이 준비돼 있으면 돌진 먼저) · 측후방 도약 · 나를 노린 돌진 피하기.',   /* v8.8.4 */", s, count=1)
s = re.sub(r"  '달라붙기 난도질': '옐로 — [^\n]*',   /\* v8\.8\.2 \*/",
           "  '달라붙기 난도질': '옐로 — 특수 잡기: 1.3칸 안의 상대에게 달려들어 몸에 달라붙음 (몸을 비틀어 피할 수 있음 · 초대형은 못 붙잡음) → 0.4초마다 손발의 날붙이로 할큄 (막을 수 없음) — 3 ~ 5타, 마지막 타가 가장 셈. 상대는 저항 게이지 (둘레의 고리 + 아래 막대) 를 채우며 버티고, 가득 차면 풀려남 (가볍고 약한 상대일수록 오래 — 5타 · 무겁고 힘센 상대는 3타). 붙은 옐로가 최대 체력의 20% 를 맞으면 놓침. 14초마다.',   /* v8.8.4 */", s, count=1)
assert s.count('/* v8.8.4 */') >= 2
rep("yclaw: '🐾 달라붙기 난도질: 붙은 적을 탭 (1.3칸 — 2초 동안 몸에 달라붙어 마구 할큄 · 맞으면 놓침 · 초대형은 못 붙잡음)'", "yclaw: '🐾 달라붙기 난도질: 붙은 적을 탭 (1.3칸 — 몸에 달라붙어 3 ~ 5타 · 상대가 저항 게이지로 버팀 · 맞으면 놓침 · 초대형은 못 붙잡음)'")
rep("연속 도약 (두 번 이어서) · ", "연속 도약 (스택 둘 — 짧게 뛰면 하나 · 멀리 뛰면 둘 다) · ", 2)
rep("돌진: 느리게 출발해 끝에서 폭발 — 5칸 넘게", "돌진: 남들과 같은 출발에서 훨씬 빨라지는 — 5칸 넘게", 2)
rep("달라붙기 난도질 (붙잡고 마구 할큄) · ", "달라붙기 난도질 (붙잡고 3 ~ 5타 — 상대가 저항 게이지로 버팀) · ", 2)
# 그림: 저항 게이지 (붙은 상대 둘레의 고리 + 아래 막대)
rep("A.k === 'spec' && A.s === 'tear' && A.phase === 'run'){ const gx = ox + g.x * ts, gy = oy + g.y * ts, q = 1 - Math.max(0, A.end - now) / Math.max(0.1, SPR(Wd, 'tear').hold || 2.2); ctx.save();",
    "A.k === 'spec' && (A.s === 'tear' || A.s === 'yclaw') && A.phase === 'run'){ const gx = ox + g.x * ts, gy = oy + g.y * ts, q = A.s === 'yclaw' ? (A.res || 0) : 1 - Math.max(0, A.end - now) / Math.max(0.1, SPR(Wd, 'tear').hold || 2.2); ctx.save();")
rep("const t = u.side ? '✊ 붙잡힘' : '✊ 붙잡힘 — 쳐서 끊을 것';", "const t = A.s === 'yclaw' ? `🐾 저항 ${Math.round((A.res || 0) * 100)}% · ${A.hn || 0}/${A.n}타` : u.side ? '✊ 붙잡힘' : '✊ 붙잡힘 — 쳐서 끊을 것';")
rep("ctx.fillText(t, px, ly + 0.5); ctx.restore(); }   /* v8.7.4 잡아찢기: 손 · 찢기까지 남은 고리 */",
    "ctx.fillText(t, px, ly + 0.5); if (A.s === 'yclaw'){ const bw = Math.max(26, r * 2.4); ctx.fillStyle = 'rgba(20,10,8,.92)'; ctx.fillRect(px - bw / 2, ly + 9, bw, 6); ctx.fillStyle = '#ffb347'; ctx.fillRect(px - bw / 2, ly + 9, bw * Math.max(0, Math.min(1, A.res || 0)), 6); ctx.strokeStyle = 'rgba(255,220,170,.8)'; ctx.lineWidth = 1; ctx.strokeRect(px - bw / 2, ly + 9, bw, 6); } ctx.restore(); }   /* v8.7.4 잡아찢기: 손 · 찢기까지 남은 고리 · v8.8.4 달라붙기: 저항 게이지 */")
rep("q = age / 0.3; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(f.ang); ctx.lineCap = 'round';", "q = age / 0.3; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(f.ang); ctx.lineCap = 'round'; if (f.big) ctx.scale(1.55, 1.55);")
rep("붙잡고 마구 할큄 (${e.sec}초 · 맞히면 놓침)", "붙잡고 할큄 (${e.n}타까지 · 상대는 저항 게이지로 버팀 · 맞히면 놓침)")
# 도약 스택 표시 (칸 이름 옆에 ●○ — 명령 글이 바뀌어도 남음)
rep("st.ix = C.some(u => u.leapN >= 2) ? '연속 도약' : '도약'; st.nm = st.ix;",
    "st.ix = C.some(u => u.leapN >= 2) ? '연속 도약 ' + C.filter(u => u.leapN >= 2).map(u => { const k = u.stk == null ? u.leapN : u.stk; return '●'.repeat(k) + '○'.repeat(u.leapN - k); }).join(' ') : '도약'; st.nm = st.ix;   /* v8.8.4 스택 */")
rep("st.ord = ordOf2('leap'); st.sb = st.on ? '바닥 · 적을 누름' : ''; }   // v6.7.4", "st.ord = ordOf2('leap'); st.sb = st.on ? '바닥 · 적을 누름 (멀리 찍으면 스택 둘)' : ''; }   // v6.7.4")
open(F, 'w', encoding='utf-8').write(s)
print('page8840 OK')
