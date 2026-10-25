# v9.9.4 페이지 — page9270.py v1.0 (v1.0: 모닝스타 (철퇴형 특수무기) 는 예전 그림 그대로 — 손에 든 막대 그림 (v9.7.0 무기 그림) 을 빼고 사슬 + 공만 · 마우스를 올리거나 고르면 사거리 원 (바깥 = 던지기 — 원래 원 · 안쪽 점선 = 휘두르기 · 아래 글) · 엔진 patch9230 (철퇴형은 돌격도 예전 그대로 · 대기 몸짓 끄기 u.noFid))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9260.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.9.3 (2026-10-25)', '<!-- 굴의 전투판 v9.9.4 (2026-10-25)')
rep('     v9.9.3: 지원 추종', '''     v9.9.4: 모닝스타 (철퇴형) 는 예전 그대로 — 막대 그림 없이 사슬 + 공 · 돌격도 예전 방식 · 마우스를 올리거나 고르면 사거리 원 (던지기 · 휘두르기)
     v9.9.3: 지원 추종''')
for a, b in (('h1::after{content:" v9.9.3"', 'h1::after{content:" v9.9.4"'), ('<footer>굴의 전투판 v9.9.3', '<footer>굴의 전투판 v9.9.4'), ('return `굴의 전투판 v9.9.3 · ${title}', 'return `굴의 전투판 v9.9.4 · ${title}'),
             ("copyText('굴의 전투판 v9.9.3 자동 판 기록", "copyText('굴의 전투판 v9.9.4 자동 판 기록"), ("o.push(`굴의 전투판 v9.9.3 — ${C.run", "o.push(`굴의 전투판 v9.9.4 — ${C.run"),
             ('의 버전 기록에 — v9.9.3 지원 추종', '의 버전 기록에 — v9.9.4 모닝스타 예전 그대로 / v9.9.3 지원 추종'),
             ('">v9.9.3 빼꼼 사격 · 지원 추종', '">v9.9.4 모닝스타 사거리 원 · 빼꼼 사격 · 지원 추종'),
             ("ver: '9.9.3', kind:", "ver: '9.9.4', kind:"), ("RULES_MIG = '9.9.3',", "RULES_MIG = '9.9.4',")):
    rep(a, b)
# 막대 그림 빼기 + 사거리 원
rep("  for (const u of Wd.units){ if (!u.alive || hid0(u)) continue; const ic = wpIcon(Wd, u); if (!ic) continue; const vis = u.side === 0 || ed || u.seenBy; if (!vis && !see) continue;\n    ctx.globalAlpha = vis ? 1 : 0.42; weaponMark2(Wd, u, ox, oy, ts, ic); ctx.globalAlpha = 1; }",
    """  for (const u of Wd.units){ if (!u.alive || hid0(u)) continue; const ic = wpIcon(Wd, u); if (!ic) continue; const vis = u.side === 0 || ed || u.seenBy; if (!vis && !see) continue;
    if (flailOf(Wd, u)){ if (!ed && (u.pid === hoverPid || sel.has(u.i))){ const FL = flailOf(Wd, u), px = ox + u.x * ts, py = oy + u.y * ts;   /* v9.9.4 철퇴형: 막대 그림 없이 (사슬 + 공은 drawFlails) · 올리거나 고르면 사거리 원 */
        ctx.save(); ctx.globalAlpha = vis ? 1 : 0.5; ctx.setLineDash([2, 4]); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(255,200,130,.7)'; ctx.beginPath(); ctx.arc(px, py, (u.r + (FL.sw || 1.3)) * ts, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
        if (ts >= 16){ ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd29a'; ctx.fillText(`🌀 던지기 ${(+u.rng).toFixed(1)}M · 안쪽 점선 = 휘두르기 ${(FL.sw || 1.3).toFixed(1)}M`, px, py + (u.r + u.rng) * ts + 13); }
        ctx.restore(); } continue; }
    ctx.globalAlpha = vis ? 1 : 0.42; weaponMark2(Wd, u, ox, oy, ts, ic); ctx.globalAlpha = 1; }""")
open(F, 'w', encoding='utf-8').write(s)
print('page9270 OK')
