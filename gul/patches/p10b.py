s=open('page10.tpl.html').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:90],s.count(a)); s=s.replace(a,b)
rep("""  for (const u of S.units) u.face = u.side ? Math.PI / 2 : -Math.PI / 2;
""","")
# guard arc
rep("""    if (u.shield){ ctx.strokeStyle = '#e9e4da'; ctx.lineWidth = Math.max(3, r * 0.2); ctx.beginPath(); ctx.arc(px, py, r + 1, fa - 0.75, fa + 0.75); ctx.stroke(); }
    ctx.fillStyle = u.shield ? '#e9e4da' : SIDEC[u.side];""","""    // 방어 자세 (방패 · 대검): 앞쪽 테두리에 은색 호. 무너졌거나 (대검) 공격 중이라 못 막으면 붉은 점선
    const gOn = u.canGuard && (ed || guardOn(Wd, u));
    if (u.canGuard){ ctx.strokeStyle = gOn ? '#e9e4da' : 'rgba(255,120,95,.85)'; ctx.lineWidth = Math.max(3, r * 0.2); if (!gOn) ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(px, py, r + 1, fa - 0.75, fa + 0.75); ctx.stroke(); ctx.setLineDash([]); }
    ctx.fillStyle = u.canGuard ? (gOn ? '#e9e4da' : '#ff8a70') : SIDEC[u.side];""")
# posture bar + mood tag + ammo
rep("""      if (u.side === 1 && !u.engaged){ ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]); ctx.strokeRect(bx - 1, by - 1, bw + 2, 6); ctx.setLineDash([]); }
    }""","""      if (u.side === 1 && !u.engaged){ ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]); ctx.strokeRect(bx - 1, by - 1, bw + 2, 6); ctx.setLineDash([]); }
      // 자세 막대 (방어 자세가 있는 인물): 흰 줄, 무너지면 붉게
      if (u.canGuard && !ed){ ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(bx - 1, by + 5, bw + 2, 4); ctx.fillStyle = Wd.t < u.brokenT ? '#ff6b57' : '#ddd6c8'; ctx.fillRect(bx, by + 6, bw * Math.max(0, Math.min(1, u.post / 100)), 2); }
      // 기분 (경계 · 자리 잡기 · 사선에 아군 …): 체력 줄 위에 작은 글씨
      if (!ed && ts >= 30 && u.mood && !u.act && MOOD_TAG[u.mood]){ ctx.font = '600 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; const t = MOOD_TAG[u.mood], tw = ctx.measureText(t).width;
        ctx.fillStyle = 'rgba(10,8,12,.7)'; ctx.fillRect(px - tw / 2 - 3, by - 14, tw + 6, 12); ctx.fillStyle = u.side ? '#ffb8a8' : '#bfe0ff'; ctx.fillText(t, px, by - 2.5); }
    }
    // 탄약: 오른쪽 아래 작은 숫자 (적은 교전 뒤부터)
    if (u.ammo != null && (ed || u.side === 0 || u.engaged || see)){ ctx.font = '700 9.5px IBM Plex Mono, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const t = u.ammo ? '탄' + u.ammo : '탄0', tw = ctx.measureText(t).width + 6, ax = px + r * 0.78, ay = py + r * 0.82;
      ctx.fillStyle = u.ammo ? 'rgba(20,16,10,.85)' : 'rgba(120,30,20,.9)'; ctx.fillRect(ax - tw / 2, ay - 6, tw, 12); ctx.fillStyle = u.ammo > 2 ? '#f1d27a' : '#ff8a70'; ctx.fillText(t, ax, ay + 0.5); }""")
# noise markers before fx
rep("""  // 효과
  if (!ed) for (const f of Wd.fx){""","""  // 총성 '!': 쏜 자리에 noiseTime 동안 남음 (쏜 쪽이 옮겨 가도 그 자리에). 소리라 어둠 속이어도 보임
  if (!ed) for (const n of Wd.noises || []){
    const age = now - n.t0, k = Math.max(0, 1 - age / Wd.rules.noiseTime), p = { x: ox + n.x * ts, y: oy + n.y * ts };
    ctx.strokeStyle = `rgba(255,211,77,${0.6 * k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, ts * (0.35 + Math.min(0.5, age * 1.2)), 0, 6.283); ctx.stroke();
    ctx.globalAlpha = 0.35 + 0.65 * k; ctx.font = `800 ${Math.max(14, ts * 0.6)}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(0,0,0,.8)'; ctx.lineWidth = 4; ctx.strokeText('!', p.x, p.y - ts * 0.55); ctx.fillStyle = n.side ? '#ffd34d' : '#fff1b0'; ctx.fillText('!', p.x, p.y - ts * 0.55); ctx.globalAlpha = 1;
  }
  // 효과
  if (!ed) for (const f of Wd.fx){""")
# num colour for block
rep("""      ctx.fillStyle = f.c === 'h' ? '#6fe08f' : f.c === 'o' ? '#ff8a70' : f.c === 'm' ? '#b8b0a6' : '#f2e9da';""","""      ctx.fillStyle = f.c === 'h' ? '#6fe08f' : f.c === 'o' ? '#ff8a70' : f.c === 'm' ? '#b8b0a6' : f.c === 'b' ? '#dcd6ff' : '#f2e9da';""")
# tactics: guard
rep("""  // 방패 뒤 안전한 칸: 고른 아군 중 방패 든 이의 뒤쪽 (바라보는 반대편) 1.8칸 안
  for (const b of selUnits(Wd).filter(u => u.shield)){""","""  // 방어 자세 뒤 안전한 칸: 고른 아군 중 방패 · 대검 든 이의 뒤쪽 (바라보는 반대편) 1.8칸 안. 앞에서 오는 사선을 가려 줌
  for (const b of selUnits(Wd).filter(u => u.canGuard)){""")
rep("""      if (ts >= 44 && !occ.has(key(x, y))) tileTag(sx, sy + ts - 16, '방패 뒤', 'rgba(180,220,255,.95)');""","""      if (ts >= 44 && !occ.has(key(x, y))) tileTag(sx, sy + ts - 16, '방어 뒤', 'rgba(180,220,255,.95)');""")
rep("""<span><i class="ls"></i>방패 뒤 안전한 칸</span>""","""<span><i class="ls"></i>방어 자세 뒤 (사선을 가려 줌)</span><span><i class="ln">!</i>총성 난 자리</span>""")
rep(""".legend2 .ls{border:1.5px solid rgba(150,205,255,.75);background:rgba(90,163,220,.35)}""",""".legend2 .ls{border:1.5px solid rgba(150,205,255,.75);background:rgba(90,163,220,.35)} .legend2 .ln{font:800 12px/12px var(--body);color:#ffd34d;text-align:center;width:12px}""")
# range label
rep("""  if (k >= 1 && u.weapon){ const t = `${u.weapon} ${u.rng}칸`;""","""  if (k >= 1 && u.weapon){ const t = `${u.weaponNow || u.weapon} ${u.rng}칸${u.ammo != null ? ' · 탄 ' + u.ammo : ''}`;""")
# MOOD_TAG + moodLabel near stateLabel
rep("""function stateLabel(u){""","""// 기분 (엔진 u.mood): 판 위 작은 글씨 · 카드 · 설명 상자
const MOOD_TAG = { '경계': '경계', '자리 잡기': '자리 잡기', '사선에 아군': '사선에 아군', '막힘': '사선 막힘', '막아서기': '막아서기', '숨기': '숨기', '물러남': '물러남', '회복': '회복하러', '협공': '협공', '뛰어듦': '뛰어듦', '다가감': '다가감', '추적': '추적', '수색': '수색', '거리 벌리기': '거리 벌리기', '지킴': '지킴' };
function moodLabel(Wd, u){ if (!u.mood || u.mood === '이동') return ''; const b = u.moodB != null ? Wd.units[u.moodB] : null; return b && b !== u ? `${u.mood} · ${b.name}` : u.mood; }
function stateLabel(u){""")
# actLabel why
rep("""  if (a.ph === 'wind') return a.k === 'heal' ? `치유 준비 → ${b.name} (${f2(a.left)}초 뒤)` : `공격 준비 → ${b.name} (${f2(a.left)}초 뒤 ${u.rng > 1 ? '쏨' : '내려침'})`;""",
"""  if (a.ph === 'wind') return a.k === 'heal' ? `치유 준비 → ${b.name} (${f2(a.left)}초 뒤)` : `공격 준비 → ${b.name} (${f2(a.left)}초 뒤 ${u.rng > 1 ? '쏨' : '내려침'})${a.why && a.why !== '공격' ? ' · ' + a.why : ''}`;""")
rep("""const liveAct = (Wd, u) => u.act ? { k: u.act.k, ph: u.act.phase, b: u.act.b, left: Math.max(0, u.act.end - Wd.t) } : null;""",
"""const liveAct = (Wd, u) => u.act ? { k: u.act.k, ph: u.act.phase, b: u.act.b, left: Math.max(0, u.act.end - Wd.t), why: u.act.why || '' } : null;""")
open('page10.tpl.html','w').write(s)
print('ok')
