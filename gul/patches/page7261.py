# v7.26.1 페이지 — page7261.py v1.0 (↑ · ↓ 맵 단추는 모두에게 (끝난 맵이면 바로 닿음) · 대장을 따라 나감 로그 / 갑옷 · 투구 아이콘은 작은 판에서도 (크게) /
#   두 총을 지닌 이 (간두) 는 탄 칸에 지금 든 총 이름 (권총 · 샷건 — 샷건은 주황) · 바꿔 드는 동안 '🔁 샷건으로' 띠 / 제자리 단추 이름에 (정지))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(D + 'page10_v7260.tpl.html', encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.26.0 (2026-10-18)', '<!-- 굴의 전투판 v7.26.1 (2026-10-18)')
rep('     v7.26.0: ', '''     v7.26.1: ↑ · ↓ 맵 단추는 모두에게 · 대장이 넘어가면 남은 동료도 따라감 (제자리 명령은 그대로) · 고립 (6칸 안에 동료 없이 4초) 이면 스스로 합류 ·
         간두는 코앞 (2.6칸 · 나를 노리면 3.4칸) 이면 겨누던 중에도 샷건으로 · 지금 든 총이 탄 칸에 보임 · 갑옷 아이콘이 작은 판에서도 보임 · 좁은 문에서 덜 낌.
     v7.26.0: ''')
rep('h1::after{content:" v7.26.0"', 'h1::after{content:" v7.26.1"')
rep('<footer>굴의 전투판 v7.26.0', '<footer>굴의 전투판 v7.26.1')
rep('return `굴의 전투판 v7.26.0 · ${title}', 'return `굴의 전투판 v7.26.1 · ${title}')
rep("copyText('굴의 전투판 v7.26.0 자동 판 기록", "copyText('굴의 전투판 v7.26.1 자동 판 기록")
rep("ver: '7.26.0', kind: '1F 여정 기록'", "ver: '7.26.1', kind: '1F 여정 기록'")
rep("o.push('굴의 전투판 v7.26.0 — 1F 프롤로그 여정 기록'", "o.push('굴의 전투판 v7.26.1 — 1F 프롤로그 여정 기록'")
rep('의 버전 기록에 — v7.26.0 오딜의 방', '의 버전 기록에 — v7.26.1 맵 이동 · 고립 합류 · 간두 샷건 · 갑옷 표시 · 문 / v7.26.0 오딜의 방')
rep('">v7.26.0 · 오딜의 방</span>', '">v7.26.1 · 이동 · 합류 · 샷건</span>')
rep("RULES_MIG = '7.26.0'", "RULES_MIG = '7.26.1'")   # 새 칸 sepSoft · camp.follow · inv.altWatch / 바뀐 기본값 rejoin · altIn · altOut

# ↑ · ↓ 맵: 모두
rep("  if (b.dataset.cexit){ const dir = b.dataset.cexit, L0 = selUnits(world).filter(u => u.alive), L = L0.length ? L0 : world.units.filter(u => u.side === 0 && u.alive && !u.down);\n"
    "    if (!L.length) return; for (const u of L) u.order = { k: 'exit', dir, x: u.x }; noteOrders(L); toast(`${L.map(u => u.name).join(' · ')} — ${dir === 'up' ? '위' : '아래'} 맵으로 (끝 띠에 닿으면 넘어감)`); hud(); return; }",
    "  if (b.dataset.cexit){ const dir = b.dataset.cexit, L = world.units.filter(u => u.side === 0 && u.alive && !u.down);   /* v7.26.1 고른 이만이 아니라 모두 (끝난 맵이면 말이 바로 닿음 · 못 들은 이도 대장이 넘어가면 따라감) */\n"
    "    if (!L.length) return; for (const u of L) u.order = { k: 'exit', dir, x: u.x }; noteOrders(L, 'user', '모두 ' + (dir === 'up' ? '위' : '아래') + ' 맵으로', !!world.cleared); toast(`모두 ${dir === 'up' ? '위' : '아래'} 맵으로 (끝 띠에 닿으면 넘어감)`); hud(); return; }")
# 로그 · 이야기
rep("      case 'arrive': out.push(`${T(e)}${n(e.a)} 목적지 도착 → 자동",
    "      case 'followOut': out.push(`${T(e)}${e.dir === 'up' ? '↑' : '↓'} 대장 ${n(e.a)} 이(가) 넘어감 → 남은 ${(e.n || []).map(n).join(' · ')} 따라감`); break;   /* v7.26.1 */\n"
    "      case 'repath': out.push(`${T(e)}${n(e.a)} 길이 막혀 다시 찾음 (${e.d}칸 남음)`); break;\n"
    "      case 'arrive': out.push(`${T(e)}${n(e.a)} 목적지 도착${e.near ? ' (끝자리가 차서 ' + e.near + '칸 앞)' : ''} → 자동")
rep("    case 'odAct': return { c: 'dim', s: e.s };   /* v7.26.0 오딜의 방 */",
    "    case 'odAct': return { c: 'dim', s: e.s };   /* v7.26.0 오딜의 방 */\n"
    "    case 'followOut': return { c: 'dim', s: `${ga(n(e.a))} 길을 나서자 남은 이들도 뒤를 따른다.` };   /* v7.26.1 */")
# 갑옷 · 투구 아이콘: 작은 판에서도 · 조금 크게
rep("    if (vis && ts >= 26 && u.gear){ const gs = Math.max(5.5, Math.min(9, r * 0.3)), gx = px + r + gs * 0.55;",
    "    if (vis && ts >= 12 && u.gear){ const gs = Math.max(6, Math.min(10, r * 0.36)), gx = px + r + gs * 0.55;   /* v7.26.1 작은 판에서도 보임 */")
# 두 총: 지금 든 총 이름
rep("const t = u.magMax ? '탄' + u.mag + '·' + u.ammo : u.ammo ? '탄' + u.ammo : '탄0', tw = ctx.measureText(t).width + 6, ax = px + r * 0.78, ay = py + r * 0.82;",
    "const gn = u.alt ? (u.weapon === '샷건' ? '샷건 ' : (w => w.length <= 3 ? w : w.slice(-2))(u.weapon || '') + ' ') : '탄', t = u.magMax ? gn + u.mag + '·' + u.ammo : u.ammo ? gn + u.ammo : gn + '0', tw = ctx.measureText(t).width + 6, ax = px + r * 0.78, ay = py + r * 0.82;   /* v7.26.1 두 총을 지니면 든 총 이름 */")
rep("ctx.fillStyle = u.ammo ? 'rgba(20,16,10,.85)' : 'rgba(120,30,20,.9)'; ctx.fillRect(ax - tw / 2, ay - 6, tw, 12); ctx.fillStyle = u.ammo > 2 ? '#f1d27a' : '#ff8a70'; ctx.fillText(t, ax, ay + 0.5); }",
    "ctx.fillStyle = u.ammo ? (u.alt && u.weapon === '샷건' ? 'rgba(150,62,14,.92)' : 'rgba(20,16,10,.85)') : 'rgba(120,30,20,.9)'; ctx.fillRect(ax - tw / 2, ay - 6, tw, 12); ctx.fillStyle = u.alt && u.weapon === '샷건' ? '#fff1dc' : u.ammo > 2 ? '#f1d27a' : '#ff8a70'; ctx.fillText(t, ax, ay + 0.5); }")
rep("k === 'reload' ? '⟳ 재장전' : k === 'atk' ? (isFar(u)", "k === 'reload' ? '⟳ 재장전' : k === 'altSwap' ? '🔁 ' + (u.alt ? u.alt.name : '') + '으로' : k === 'atk' ? (isFar(u)")
rep('<button class="btn" type="button" data-ord="hold">제자리 <kbd>H</kbd></button>', '<button class="btn" type="button" data-ord="hold" title="그 자리에 멈춰 지킴 — 고립돼도 합류하지 않고 대장이 넘어가도 남음">제자리 (정지) <kbd>H</kbd></button>')

open(F, 'w', encoding='utf-8').write(s)
print('page7261 OK')
