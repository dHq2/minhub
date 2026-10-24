# v9.5.2 페이지 — page9080.py v1.3 (v1.3: 비전투 맵 (만남) 을 걸어 나갈 때 싸움 보상 (동전 · 유물) 이 없음 · v1.2: 비전투 맵의 천막 · 노라는 처음부터 보임 · v1.1: 사람 ❓ (왐 · 로지나 · 대장장이 · 마리 · 야전의사) 도 그 층의 비전투 맵에서 (명세 C1 — 본인 맵이 없는 만남은 그 층 맵 중 하나를 써서 소환) · v1.0: 두건 (명세 C6) — 노인의 왕관을 찬 이가 있으면 첫 대사가 ".......오오..위대한 자의 것이구나" 로 바뀜)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9070.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.5.1 (2026-10-24)', '<!-- 굴의 전투판 v9.5.2 (2026-10-24)')
rep('     v9.5.1: 암계 장비 드랍 그림', '''     v9.5.2: 사람 ❓ (왐 · 로지나 · 대장장이 · 마리 · 야전의사) 도 그 층의 비전투 맵에서 만남 (맵 위 NPC — 야전의사는 천막과 함께 숨었다 나옴) · 두건 (명세 C6) — 노인의 왕관을 찬 이가 일행에 있으면 첫 대사가 ".......오오..위대한 자의 것이구나" 로 (없으면 "..........오오...많이도 짊어졌구나")
     v9.5.1: 암계 장비 드랍 그림''')
for a, b in (('h1::after{content:" v9.5.1"', 'h1::after{content:" v9.5.2"'), ('<footer>굴의 전투판 v9.5.1', '<footer>굴의 전투판 v9.5.2'), ('return `굴의 전투판 v9.5.1 · ${title}', 'return `굴의 전투판 v9.5.2 · ${title}'),
             ("copyText('굴의 전투판 v9.5.1 자동 판 기록", "copyText('굴의 전투판 v9.5.2 자동 판 기록"), ("o.push(`굴의 전투판 v9.5.1 — ${C.run", "o.push(`굴의 전투판 v9.5.2 — ${C.run"),
             ('의 버전 기록에 — v9.5.1 암계 장비 그림', '의 버전 기록에 — v9.5.2 두건의 왕관 대사 / v9.5.1 암계 장비 그림'),
             ('">v9.5.1 · 암계 장비 그림 · 심계 제3세력 · 망자 맵</span>', '">v9.5.2 · 두건의 왕관 대사 · 암계 장비 그림 · 심계 제3세력</span>'),
             ("ver: '9.5.1', kind:", "ver: '9.5.2', kind:"), ("RULES_MIG = '9.5.1',", "RULES_MIG = '9.5.2',")):
    rep(a, b)
rep("r8T('hood', [{ t: '..........오오...많이도 짊어졌구나', name: '두건', who: 'C-171' }, { ask: [['⛺ 곁에서 쉰다 (모두 25% 회복)', '!r8:mnHoodRest'], ['⚔ 공격한다', '!r8:mnHoodHit'], ['지나간다', '']] }]);",
    """{ const HASK = { ask: [['⛺ 곁에서 쉰다 (모두 25% 회복)', '!r8:mnHoodRest'], ['⚔ 공격한다', '!r8:mnHoodHit'], ['지나간다', '']] };
  r8T('hood', [{ t: '..........오오...많이도 짊어졌구나', name: '두건', who: 'C-171' }, HASK]);
  TALK.m_hood.crown = [{ t: '.......오오..위대한 자의 것이구나', name: '두건', who: 'C-171' }, HASK];   /* v9.5.2 노인의 왕관을 찬 이가 있을 때 */
  NPC.m_hood.node = () => (world && world.units.some(u => u.side === 0 && u.alive && !u.summon && crownOn(u))) ? 'crown' : 'start'; }""")
rep("  if (k.startsWith('p:')){ r8PeaceMap(n, k.slice(2)); return; }", "  const PM9 = { 't:wam': 'wam', 't:rosina': 'rosina', 't:smith': 'smith', 't:marie': 'marie', 't:nurse': 'tent' };   /* v9.5.2 본인 맵이 없는 사람 만남은 그 층의 비전투 맵에서 (명세 C1) */\n  if (PM9[k]){ r8PeaceMap(n, PM9[k]); return; }\n  if (k.startsWith('p:')){ r8PeaceMap(n, k.slice(2)); return; }")
rep("st: M.hide ? 'hidden' : 'sit', x: c.x + 0.5, y: c.y + 0.5, seen: false, n: 0, r8: k, hide: !!M.hide }", "st: M.hide && !n.peace ? 'hidden' : 'sit', x: c.x + 0.5, y: c.y + 0.5, seen: false, n: 0, r8: k, hide: !!M.hide && !n.peace }")   # 비전투 맵에서는 천막도 처음부터 보임 (숨을 적이 없음)
rep("* cm.mul * ((W.r8 || {}).pass && !W.cleared ? 0.4 : 1)) + cm.add; R.gold += gold;", "* cm.mul * (node.peace ? 0 : (W.r8 || {}).pass && !W.cleared ? 0.4 : 1)) + cm.add; R.gold += gold;")   # 비전투 맵은 걸어 나가도 동전 없음
rep("  if (!((W.r8 || {}).pass && !W.cleared) && (node.t === 'elite' || (node.t === 'fight' && Math.random() < 0.18))) relic =", "  if (!node.peace && !((W.r8 || {}).pass && !W.cleared) && (node.t === 'elite' || (node.t === 'fight' && Math.random() < 0.18))) relic =")   # 유물도 없음
open(F, 'w', encoding='utf-8').write(s)
print('page9080 OK')
