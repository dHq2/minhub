# v7.19.2 페이지 — page7192.py v1.3 (v1.3: 고유 기술 동작 이름표 — 대상 없는 쓸어치기 · 역장에서 멈추던 것 · v1.2: 역장 로그 이름 wardOn · v1.1: 뿌리 벽 그림은 ed 가 정해지기 전이라 mode 로 · 딸기 역장 · 뿌리 벽 · 열매 맺기 + 공통 무기 잡기: 설계 · 정체성 · 특성 · 액티브 설명 · 기술 칸 · 명령 · 그림 (역장 고리 · 뿌리 벽 · 열매) · 로그 · 서술 · 아이콘 · 옛 저장)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
import json, re
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
IX = json.load(open(D + 'icons_idx.json', encoding='utf-8'))

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.19.1 (2026-10-18)', '<!-- 굴의 전투판 v7.19.2 (2026-10-18)')
rep('     v7.19.1: ', '''     v7.19.2: 딸기 고유 + 공통 무기 잡기.
         딸기 [역장] (칸 6): 둘레 1.6칸 원형 보호막 6초 — 상대 탄 3발을 막음 (투창 · 총알 · 센 탄은 40% 뚫음) · 곡사도 위에서 막음 (14초). 스스로: 둘레 동료가 사격받으면.
         딸기 [뿌리 벽] (칸 7): 5칸 안 찍은 자리에 2칸짜리 뿌리 벽 — 못 지나가고 탄 · 시야도 막음 (엄폐물) · 솟는 칸 위의 적은 맞고 밀려남 · 붙은 적이 뜯어내면 부서짐 (120) · 둘까지 유지 (12초). 스스로: 다가오는 근접 앞에.
         딸기 [열매 맺기] (특성): 20초마다 곁에 딸기 열매 (판에 셋까지) — 아군이 지나가며 먹으면 5 ~ 10 회복.
         무기 잡기 (공통 · 적 · 아군 같음): 창 · 철퇴를 막거나 피하면 5% (회피 등급 · 베테랑만큼 더 · 15% 까지 · 2.5초에 한 번) 로 자루를 잡아 뺏어 곁 바닥에 떨굼 — 뺏긴 쪽은 맨손 (주우면 다시).
     v7.19.1: ''')
rep('h1::after{content:" v7.19.1"', 'h1::after{content:" v7.19.2"')
rep('<footer>굴의 전투판 v7.19.1', '<footer>굴의 전투판 v7.19.2')
rep('return `굴의 전투판 v7.19.1 · ${title}', 'return `굴의 전투판 v7.19.2 · ${title}')
rep("copyText('굴의 전투판 v7.19.1 자동 판 기록", "copyText('굴의 전투판 v7.19.2 자동 판 기록")
rep('의 버전 기록에 — v7.19.1 고유 기술 다섯', '의 버전 기록에 — v7.19.2 딸기 역장 · 뿌리 벽 · 열매 · 무기 잡기 / v7.19.1 고유 기술 다섯')
rep('">v7.19.1 · 고유 기술 다섯</span>', '">v7.19.2 · 딸기 역장 · 뿌리 벽 · 무기 잡기</span>')
rep("RULES_MIG = '7.19.1'", "RULES_MIG = '7.19.2'")

# ---------- 아이콘 표 (뒤에 셋) · 줄 수 ----------
s, nn = re.subn(r"const ICO = \{.*?\}, ICO_GC = ", lambda m: "const ICO = " + json.dumps({'cols': IX['cols'], 'rows': IX['rows'], 'map': IX['map']}, ensure_ascii=False) + ", ICO_GC = ", s, count=1, flags=re.S)
assert nn == 1
rep("calc(var(--s) * 8) calc(var(--s) * 5)", "calc(var(--s) * " + str(IX['cols']) + ") calc(var(--s) * " + str(IX['rows']) + ")")

# ---------- 설계 · 정체성 · 특성 · 액티브 ----------
rep("regenK: 0.012, traits: ['은신C'], skill: { name: '딸기 정령술'", "regenK: 0.012, traits: ['은신C', '열매 맺기'], active: ['역장', '뿌리 벽'], skill: { name: '딸기 정령술'")
rep("'C-218': { skill: true },", "'C-218': { skill: true, traits: ['열매 맺기'], active: ['역장', '뿌리 벽'] },")
rep("  '영웅': '각 부대의 영웅", "  '열매 맺기': '딸기 정령 — 20초마다 곁 (1.4칸) 에 작은 딸기 열매가 맺힘 (판에 셋까지). 같은 편이 지나가며 먹으면 5 ~ 10 회복',   // v7.19.2\n  '영웅': '각 부대의 영웅")
rep("  '공중제비': '탕아의 고유", """  '역장': '딸기 — 둘레 1.6칸에 원형의 약한 보호막 6초: 밖에서 날아드는 상대 탄 3발을 막음 (곡사도 위에서) · 투창 · 총알 · 센 탄은 40% 로 뚫음. 근접은 못 막음. 14초마다. 스스로: 둘레 동료가 사격받으면',
  '뿌리 벽': '딸기 — 5칸 안 찍은 자리에 2칸 길이 뿌리를 솟게 함: 못 지나가고 탄 · 시야도 막는 벽 (엄폐물) · 솟는 칸 위의 적은 맞고 (×1.2) 밀려남 · 동료는 비켜 세움. 계속 유지 — 붙은 적이 뜯어내면 부서짐 (단단함 120). 둘까지 · 12초마다. 스스로: 다가오는 근접 앞 1.5칸에',
  '공중제비': '탕아의 고유""")

# ---------- 기술 칸 · 명령 ----------
rep("const SPEC_IC = { flip: '🤸', head: '🔨', pb: '💥', sweep: '🌀', hurl: '☄' };", "const SPEC_IC = { flip: '🤸', head: '🔨', pb: '💥', sweep: '🌀', hurl: '☄', ward: '🛡', root: '🌱' };")
rep("hurl: '☄ 휘둘러 치기: 후려칠 적을 탭 (3.6칸까지)' };", "hurl: '☄ 휘둘러 치기: 후려칠 적을 탭 (3.6칸까지)', root: '🌱 뿌리 벽: 세울 곳 (바닥 · 5칸 안) 을 탭 · 적을 탭하면 그 앞에' };")
rep("    if (sp.k === 'sweep'){ D.forEach(u => { u.order = { k: 'spec', s: 'sweep' }; }); noteOrders(D); toast(`${D.map(u => u.name).join(' · ')}: 철퇴 후리기 — 둘레를 한 바퀴 (동료도 맞을 수 있어요)`); hud(); return; }",
    "    if (sp.k === 'sweep' || sp.k === 'ward'){ D.forEach(u => { u.order = { k: 'spec', s: sp.k }; }); noteOrders(D); toast(`${D.map(u => u.name).join(' · ')}: ${sp.k === 'ward' ? '역장 — 둘레 1.6칸의 상대 탄 세 발을 막음 (6초)' : '철퇴 후리기 — 둘레를 한 바퀴 (동료도 맞을 수 있어요)'}`); hud(); return; }")
rep("    if (!u && A0.s === 'flip'){", "    if (!u && A0.s === 'root'){ C.forEach(x => { x.order = { k: 'spec', s: 'root', x: w.x, y: w.y }; }); noteOrders(C); toast(`${C.map(x => x.name).join(' · ')}: ${coord(w.x, w.y)} 에 뿌리 벽`); return done(); }   // v7.19.2\n    if (!u && A0.s === 'flip'){")

# ---------- 그림: 뿌리 벽 · 역장 · 열매 ----------
rep("  // 시체 (v6.9 어떻게 쓰러졌는지 보임", """  // v7.19.2 뿌리 벽: 칸마다 엉킨 뿌리 (단단함 막대)
  if (mode !== 'edit') for (const r of Wd.roots || []){ for (const [cx, cy] of r.cells){ const x = ox + cx * ts, y = oy + cy * ts, R0 = mulberry32(cx * 31 + cy * 17 + r.id);
      ctx.fillStyle = '#3b2a1c'; ctx.fillRect(x + ts * 0.06, y + ts * 0.06, ts * 0.88, ts * 0.88); ctx.lineCap = 'round';
      for (let k = 0; k < 6; k++){ ctx.strokeStyle = ['#6b4a2c', '#83603a', '#5a3d24'][k % 3]; ctx.lineWidth = Math.max(2, ts * (0.08 + R0() * 0.06)); ctx.beginPath(); ctx.moveTo(x + ts * R0(), y + ts); ctx.quadraticCurveTo(x + ts * R0(), y + ts * 0.5, x + ts * R0(), y); ctx.stroke(); }
      ctx.fillStyle = '#4caf50'; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.ellipse(x + ts * (0.2 + R0() * 0.6), y + ts * (0.15 + R0() * 0.6), ts * 0.08, ts * 0.04, R0() * 3, 0, 6.283); ctx.fill(); } }
    const c0 = r.cells[0]; if (c0 && r.hp < r.max){ ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(ox + c0[0] * ts + 2, oy + c0[1] * ts - 5, ts - 4, 3); ctx.fillStyle = '#8bc34a'; ctx.fillRect(ox + c0[0] * ts + 2, oy + c0[1] * ts - 5, (ts - 4) * Math.max(0, r.hp / r.max), 3); } }
  // 시체 (v6.9 어떻게 쓰러졌는지 보임""")
rep("  // 벽 횃불 불꽃\n", """  // v7.19.2 역장: 시전자 둘레의 고리 (남은 막을 수만큼 점)
  if (!ed) for (const w of Wd.wards || []){ const c = Wd.units[w.by]; if (!c || !c.alive || (c.side === 1 && !see && !c.seenBy)) continue; const p = { x: ox + c.x * ts, y: oy + c.y * ts }, rr = w.r * ts, f = 0.5 + 0.5 * Math.sin(performance.now() / 260);
    ctx.fillStyle = c.side ? `rgba(255,120,110,${(0.08 + 0.04 * f).toFixed(3)})` : `rgba(120,235,160,${(0.08 + 0.04 * f).toFixed(3)})`; ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 6.283); ctx.fill();
    ctx.strokeStyle = c.side ? 'rgba(255,140,120,.7)' : 'rgba(150,255,180,.75)'; ctx.lineWidth = Math.max(1.5, ts * 0.05); ctx.setLineDash([ts * 0.25, ts * 0.12]); ctx.stroke(); ctx.setLineDash([]);
    for (let k = 0; k < w.left; k++){ const a = -Math.PI / 2 + (k - (w.left - 1) / 2) * 0.35; ctx.fillStyle = '#c8ffd8'; ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr, Math.max(2.5, ts * 0.07), 0, 6.283); ctx.fill(); } }
  // 벽 횃불 불꽃
""")
rep("  if (!ed) for (const it of Wd.items || []){ const p = { x: ox + it.x * ts, y: oy + it.y * ts }, o = Wd.units[it.owner];", """  if (!ed) for (const it of Wd.items || []){ const p = { x: ox + it.x * ts, y: oy + it.y * ts }, o = Wd.units[it.owner];
    if (it.k === 'berry'){ const rr = Math.max(4, ts * 0.12); ctx.fillStyle = '#e53950'; ctx.beginPath(); ctx.moveTo(p.x, p.y + rr * 1.2); ctx.quadraticCurveTo(p.x - rr * 1.3, p.y, p.x - rr * 0.6, p.y - rr * 0.6); ctx.lineTo(p.x + rr * 0.6, p.y - rr * 0.6); ctx.quadraticCurveTo(p.x + rr * 1.3, p.y, p.x, p.y + rr * 1.2); ctx.fill();   // v7.19.2 딸기 열매
      ctx.fillStyle = '#ffe9a8'; for (let k = 0; k < 4; k++) ctx.fillRect(p.x - rr * 0.4 + (k % 2) * rr * 0.6, p.y - rr * 0.15 + (k > 1 ? rr * 0.45 : 0), 1.5, 1.5); ctx.fillStyle = '#4caf50'; ctx.beginPath(); ctx.ellipse(p.x, p.y - rr * 0.7, rr * 0.7, rr * 0.25, 0, 0, 6.283); ctx.fill(); continue; }""")

# ---------- 로그 · 서술 ----------
rep("      case 'flip': out.push(", """      case 'wardOn': out.push(`${T(e)}🛡 ${n(e.a)} 역장 — 둘레의 상대 탄 ${e.n}발을 막음 (${e.sec}초)`); break;   // v7.19.2
      case 'wardPierce': out.push(`${T(e)}🛡 ${n(e.a)}의 탄이 ${n(e.b)}의 역장을 뚫음`); break;
      case 'root': out.push(`${T(e)}🌱 ${n(e.a)} 뿌리 벽 (${e.n}칸) — ${coord(e.x, e.y)}`); break;
      case 'rootChew': out.push(`${T(e)}🌱 ${n(e.a)} 뿌리 벽을 뜯어냄 (남은 ${e.hp})`); break;
      case 'rootBreak': out.push(`${T(e)}🌱 ${n(e.a)}의 뿌리 벽이 부서짐`); break;
      case 'berrySpawn': out.push(`${T(e)}🍓 ${n(e.a)} 곁에 딸기 열매가 맺힘`); break;
      case 'berry': out.push(`${T(e)}🍓 ${n(e.a)} 딸기 열매를 먹음 +${e.amt} (${e.hp})`); break;
      case 'grab': out.push(`${T(e)}✊ ${n(e.a)} ${e.how === 'block' ? '막으며' : '피하며'} ${n(e.b)}의 ${e.w} 자루를 잡아 뺏어 떨굼 — ${n(e.b)} 맨손`); break;
      case 'flip': out.push(""")
rep("    case 'slam': return e.n ?", """    case 'wardOn': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 손을 펼치자 은은한 역장이 둘레를 감싼다.` };   // v7.19.2
    case 'root': return { c: U(e.a).side ? 'bad' : 'good', s: `땅이 갈라지며 ${n(e.a)}의 뿌리가 벽처럼 솟아오른다!` };
    case 'grab': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${n(e.b)}의 ${e.w} 자루를 낚아채 바닥에 내던진다!` };
    case 'slam': return e.n ?""")

# ---------- 옛 저장 한 번: 딸기에 역장 · 뿌리 벽 · 열매 맺기 ----------
rep("// v7.19.1 고유 기술 (한 번):", """// v7.19.2 딸기 (한 번): 역장 · 뿌리 벽 · [열매 맺기]
const fix7192 = p => { if (!p || (p.side || 0) !== 0 || p.ref !== 'C-218') return false; let c = false; const tr = p.traits || (p.traits = []); if (!tr.includes('열매 맺기')){ tr.push('열매 맺기'); c = true; } for (const a of ['역장', '뿌리 벽']) if (!(p.active || []).includes(a)){ p.active = [...(p.active || []), a]; c = true; } return c; };
if (!S.v7192k){ let n = 0; for (const u of S.units) if (fix7192(u)) n++; try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fix7192(d)){ dc = true; n++; } if (dc) saveMyDesigns(mine); } catch (e) {}
  S.v7192k = true; if (n) setTimeout(() => { save(); toast(`딸기에 역장 · 뿌리 벽 · 열매 맺기를 붙였어요 (${n}곳)`); }, 2100); }
// v7.19.1 고유 기술 (한 번):""")

# ---------- v1.3 고유 기술 동작 이름표 ----------
rep("  if (a.k === 'charge') return `돌진 → ${b ? b.name : ''}`;", "  if (a.k === 'charge') return `돌진 → ${b ? b.name : ''}`;\n  if (a.k === 'spec'){ const sk = a.s || (u.act && u.act.s), sp = (u.spec || []).find(x => x.k === sk), nm = sp ? sp.name : '고유 기술'; return a.ph === 'wind' ? `${nm}${b ? ' → ' + b.name : ''} (${f2(a.left)}초)${a.why && a.why !== '명령' ? ' · ' + a.why : ''}` : `${nm} 뒤 (${f2(a.left)}초 남음)`; }   // v7.19.2")
rep("why: u.act.why || '', dir: u.act.dir || '' } : null;", "why: u.act.why || '', dir: u.act.dir || '', s: u.act.s || '' } : null;")
open(F, 'w', encoding='utf-8').write(s)
print('page7192 OK')
