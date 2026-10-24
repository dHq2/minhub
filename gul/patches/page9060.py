# v9.5.0 페이지 — page9060.py v1.1 (v1.1: 싸움 자리를 들어선 곳에서 6 ~ 9칸으로 · 암계 병사 셋만 붙고 · 심계 둘은 받는 피해 × 0.7 (달려갈 시간) · v1.0: 2층 대규모 업데이트 6단계 — 제3세력 심계 (명세 C4 · D8): 유적 입구에서 헌팅나이프 · 카밀라가 먼저 암계 병사와 싸우는 중 (난입 · 구조 — 내버려두면 죽을 수 있음) → 싸움이 끝나고 둘이 살아 있으면 말 걸기 (같이 가자 · 내버려둔다 · 공격한다) · 둘 다 영입 (처음부터 전우조) / 망자 맵 (❓ — 망자만 나오는 싸움))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9050.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.4.1 (2026-10-24)', '<!-- 굴의 전투판 v9.5.0 (2026-10-24)')
rep('     v9.4.1: 소모품 특수 스킬', '''     v9.5.0: 2층 대규모 업데이트 6단계 — 제3세력 심계 (명세 C4 · D8) · 망자 맵:
         · 2층 유적 입구: 헌팅나이프 · 카밀라 (심계 낙오자 · 처음부터 전우조) 가 먼저 암계 병사들과 싸우는 중 — 다쳐 있고 (70 · 80%) 둘러싸여 있음 · 난입해 돕거나 내버려두면 죽을 수 있음
         · 싸움이 끝났을 때 살아 있으면 말 걸기: 헌팅나이프 "하핫! 덕분에 살았구만." · 카밀라 "대단하네 너희." → 같이 가자 / 내버려둔다 (그래도 따라옴) = 둘 다 영입 · 공격한다 = 둘이 적이 됨 (싸움)
         · ❓ 망자 맵: 그 층의 맵 한 곳에 망자만 (일반 많이 · 사족 · 근육 · 뚱보 적게 · 기형 아주 드물게) — 피할 수 없는 싸움 (쉬기 없음)
     v9.4.1: 소모품 특수 스킬''')
for a, b in (('h1::after{content:" v9.4.1"', 'h1::after{content:" v9.5.0"'), ('<footer>굴의 전투판 v9.4.1', '<footer>굴의 전투판 v9.5.0'), ('return `굴의 전투판 v9.4.1 · ${title}', 'return `굴의 전투판 v9.5.0 · ${title}'),
             ("copyText('굴의 전투판 v9.4.1 자동 판 기록", "copyText('굴의 전투판 v9.5.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.4.1 — ${C.run", "o.push(`굴의 전투판 v9.5.0 — ${C.run"),
             ('의 버전 기록에 — v9.4.1 오래된 약병', '의 버전 기록에 — v9.5.0 심계 제3세력 · 망자 맵 / v9.4.1 오래된 약병'),
             ('">v9.4.1 · 오래된 약병 (특수 스킬) · ❓ 만남 구조</span>', '">v9.5.0 · 심계 제3세력 (헌팅나이프 · 카밀라) · 망자 맵</span>'),
             ("ver: '9.4.1', kind:", "ver: '9.5.0', kind:"), ("RULES_MIG = '9.4.1',", "RULES_MIG = '9.5.0',")):
    rep(a, b)

# 무리: 망자 · 심계 (공격할 때)
rep("  stair1: () => [...Array(10).fill('암계 창방패병'), ...Array(4).fill('암계 장궁병')],",
    """  dead: (n, R) => { const nP = R.party.length, P = [['일반 망자', 6], ['사족 망자', 2.4], ['근육 망자', 2.2], ['뚱보 망자', 1], ['기형 망자', 0.22]]; const n0 = Math.max(5, Math.min(11, Math.round(nP * 1.0 + 2.5 + Math.random() * 2)));
    const out = []; for (let i = 0; i < n0; i++){ let k = r8WPick(P); if (k === '기형 망자' && out.includes(k)) k = '일반 망자'; if (k === '뚱보 망자' && out.filter(x => x === k).length >= 2) k = '일반 망자'; out.push(k); } return out; },   /* v9.5.0 망자들 (명세 D9) */
  simfoe: () => ['헌팅나이프', '카밀라'],   /* v9.5.0 심계 둘을 공격함 */
  stair1: () => [...Array(10).fill('암계 창방패병'), ...Array(4).fill('암계 장궁병')],""")
rep("const PAIR8 = { ban: ['반', '테리'], boss: ['흑익', '하류'] };", "const PAIR8 = { ban: ['반', '테리'], boss: ['흑익', '하류'], simfoe: ['헌팅나이프', '카밀라'] };")
# 유적 입구에 심계
rep("{ t: 'fight', ms: 'pass', src8: 'ruin2a', comp: 'abyss', npc8: null, bare: true }", "{ t: 'fight', ms: 'pass', src8: 'ruin2a', comp: 'abyss', third: 'sim', npc8: null, bare: true }")
rep("  if (n.pearl8) r8PearlHook(W);   /* v8.7.9 각펄 */", "  if (n.pearl8) r8PearlHook(W);   /* v8.7.9 각펄 */\n  if (n.third) r8ThirdSpawn(W, n);   /* v9.5.0 제3세력 (심계) */")
# 싸움이 끝난 뒤
rep("    if (typeof r8AfterSurr === 'function' && W.r8 && W.r8.surr && !W.r8.surrDone){ W.r8.surrDone = 1; if (r8AfterSurr(W, after)) return; }   /* v8.7.1 항복 */",
    "    if (typeof r8AfterSurr === 'function' && W.r8 && W.r8.surr && !W.r8.surrDone){ W.r8.surrDone = 1; if (r8AfterSurr(W, after)) return; }   /* v8.7.1 항복 */\n    if (W.r8 && W.r8.third && !W.r8.thirdDone){ W.r8.thirdDone = 1; if (r8AfterThird(W, node, after)) return; }   /* v9.5.0 심계 */")
# ❓ : 망자 맵
rep("  if (k.startsWith('p:')){ r8PeaceMap(n, k.slice(2)); return; }", "  if (k.startsWith('p:')){ r8PeaceMap(n, k.slice(2)); return; }\n  if (k.startsWith('f:')){ r8FightEnc(n, k.slice(2)); return; }   /* v9.5.0 망자 맵 */")
rep("  if (!pre8 && !n.restAsk){", "  if (!pre8 && !k.startsWith('f:') && !n.restAsk){")
rep("ENC8.push(['p:hobo', 0.7, 2, 30], ['p:hood', 0.55, 3, 30]);", "ENC8.push(['p:hobo', 0.7, 2, 30], ['p:hood', 0.55, 3, 30], ['f:dead', 0.8, 2, 30]);   /* v9.5.0 f: = 피할 수 없는 싸움 (망자) */")
rep("function r8PeaceMap(n, key){", """function r8FightEnc(n, key){   // v9.5.0 ❓ 가 싸움 (망자만) — 그 층의 맵 한 곳 (낙사 · 계단 · 보스룸 제외)
  const R = R8S(), F = F8[R.f] || {}; (R.npcDone = R.npcDone || []).push('f:' + key);
  const L = (F.maps || []).filter(k => r8MapOk(k) && !MAPS8[k].fall && !MAPS8[k].stairs && !/boss/.test(k));
  n.t = 'fight'; n.comp = key; n.ms = 'pass'; n.npc8 = null; n.stitch = null; n.bare = false; n.narr8 = '썩은 냄새가 먼저 온다. 무기도 들지 않은 것들이 — 조직도 없이, 이성도 없이 — 이쪽을 향해 몰려든다.'; if (L.length) n.src8 = r8Pick(L);
  save(); r8Hide(); r8Battle(n);
}
function r8PeaceMap(n, key){""")
# 심계 낙오자
rep("function r8GuestTick(W){", """// v9.5.0 심계 낙오자 (명세 C4 · D8): 유적 입구에서 헌팅나이프 · 카밀라가 먼저 암계 병사와 싸우는 중 (이쪽 편 손님 — 다쳐 있고 둘러싸임). 내버려두면 죽을 수 있음
function r8ThirdSpawn(W, n){
  const R = R8S(); if (!W || !R) return; R.flags = R.flags || {};
  if (R.flags.simGone || R.party.some(p => p.name === '헌팅나이프' || p.name === '카밀라') || R.dead.includes('헌팅나이프') || R.dead.includes('카밀라')) return;
  const foes = W.units.filter(u => u.side === 1 && u.alive && !isFar(u)); if (foes.length < 3) return;
  const hero = W.units.find(u => u.side === 0 && u.hero) || W.units.find(u => u.side === 0); if (!hero) return;
  // 싸움 자리: 들어선 곳에서 6 ~ 9칸 (달려가면 닿을 만큼) 의 트인 바닥 — 가장 가까운 암계 병사 셋을 그리로 옮겨 놓고 그 곁에 둘이 버팀 (나머지 병사는 제자리 · 소리를 듣고 오는 중)
  const m = W.map, h0 = { x: hero.x, y: hero.y }; let best = null;
  for (let k = 0; k < 80; k++){ const x = 1.5 + Math.floor(Math.random() * (m.W - 3)), y = 1.5 + Math.floor(Math.random() * (m.H - 3)), d = Math.hypot(x - h0.x, y - h0.y); if (d < 6 || d > 9.5 || boxRock(W, x, y, 0.5)) continue;
    let free = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (!boxRock(W, x + dx, y + dy, 0.35)) free++; if (!best || free > best.free) best = { x, y, free }; }
  const c0 = best || foes.slice().sort((a, b) => Math.hypot(a.x - h0.x, a.y - h0.y) - Math.hypot(b.x - h0.x, b.y - h0.y))[0];
  const near = foes.slice().sort((a, b) => Math.hypot(a.x - c0.x, a.y - c0.y) - Math.hypot(b.x - c0.x, b.y - c0.y)).slice(0, 3);
  near.forEach((f, i) => { const q = r8Spot(W, { x: c0.x + 1.4, y: c0.y + (i - 1) * 1.1 }, 0.45); f.x = q.x; f.y = q.y; });
  const mk = (key, hpK, dx) => { const d = foe8(key, R.f), q = r8Spot(W, { x: c0.x - 0.9 - dx, y: c0.y + dx * 0.3 }, 0.45); const p = { ...fromDesign({ ...clone(d), side: 0, traits: (d.traits || []).filter(t => t !== '보스') }, 0), id: uid(), summon: true, r8guest: 'sim', x: q.x, y: q.y, cg: 'sim' };
    lockIdentity(p); S.units.push(p); const u = addUnit(W, p); u.summon = true; u.r8guest = 'sim'; u.cg = 'sim'; u.hp = Math.max(1, Math.round(u.max * hpK)); u.dmgK = (u.dmgK || 1) * 0.7; return u; };   /* 버팀 — 받는 피해 × 0.7 (이쪽이 달려갈 시간) */
  const A = mk('헌팅나이프', 0.7, 0), B = mk('카밀라', 0.8, 1.6);
  near.forEach((f, i) => { f.state = 'hunt'; f.target = i === 2 ? B : A; f.alert = 1; if (f.sense) for (const g of [A, B]) f.sense[g.i] = { x: g.x, y: g.y, t: W.t, exact: true, sight: true }; });
  for (const g of [A, B]){ g.state = 'fight'; g.target = near[0]; g.alert = 1; if (g.sense) for (const f of near) g.sense[f.i] = { x: f.x, y: f.y, t: W.t, exact: true, sight: true }; }
  W.r8.third = { keys: ['헌팅나이프', '카밀라'] };
  logEv(W, { k: 'r8', s: '⚔ 입구 안쪽에서 이미 싸움이 벌어지고 있다 — 낯선 둘이 암계 병사들에게 둘러싸여 버티고 있다. (돕거나, 지켜보거나 — 내버려두면 쓰러질 수 있다)', c: 'good', vis: true });
}
function r8AfterThird(W, node, then){
  const R = R8S(), T = W.r8.third; if (!T) return false; const alive = W.units.filter(u => u.r8guest === 'sim' && u.alive && !u.gone);
  if (!alive.length){ R.flags.simGone = 1; save(); R8T = then; talkLines([{ narr: '입구 바닥에 낯선 이들의 흔적이 남아 있다 — 부러진 단검과 빈 탄피. 한발 늦었다.' }, { go: '!r8:then' }]); return true; }
  const ln = alive.find(u => u.name === '헌팅나이프'), cm = alive.find(u => u.name === '카밀라'); R.flags.simNow = alive.map(u => ({ name: u.name, hp: Math.round(u.hp) }));
  const L = [{ narr: '싸움이 끝났다. 입구의 낯선 ' + (alive.length > 1 ? '둘이 ' : '이가 ') + '무기를 내린다.' }];
  if (ln) L.push({ t: '하핫! 덕분에 살았구만.', name: '헌팅나이프', who: 'C-290' });
  if (cm) L.push({ t: '대단하네 너희.', name: '카밀라', who: 'C-291' });
  if (alive.length > 1) L.push({ narr: '둘은 서로 모르는 사이라는데 — 등을 맞대고 싸우던 호흡은 오래된 전우 같았다.' });
  L.push({ ask: [['👥 따라오라고 한다 (영입)', '!r8:simJoin'], ['내버려둔다 — 그래도 따라온다 (영입)', '!r8:simJoin2'], ['⚔ 공격한다', '!r8:simFight']] }); R8T = then; talkLines(L); return true;
}
function r8SimRecruit(txt, then){
  const R = R8S(), now = R.flags.simNow || []; R.flags.simGone = 1; const names = now.map(x => x.name);
  const give = (i) => { if (i >= names.length){ R.party.filter(p => names.includes(p.name)).forEach(p => { p.cg = 'sim'; const m = now.find(x => x.name === p.name); if (m){ p.hpNow = Math.max(1, m.hp); } }); save(); then && then(); return; }
    const ref = names[i] === '헌팅나이프' ? 'C-290' : 'C-291'; r8Recruit(ref, i === 0 ? txt : '', () => give(i + 1), true); };
  give(0);
}
function r8GuestTick(W){""")
rep("  surrJoin(){", """  simJoin(){ const cont = R8T; r8SimRecruit('"따라오라고?" 헌팅나이프가 단검을 거꾸로 쥐고 웃는다. 카밀라가 샷건을 어깨에 걸친다. "…짐은 되지 않겠다."', cont); },   /* v9.5.0 */
  simJoin2(){ const cont = R8T; r8SimRecruit('내버려두려 했지만 — 둘은 말없이 한두 걸음 뒤에 붙는다. "혼자보단 낫지."', cont); },
  simFight(){ const R = R8S(), n = r8Node(R.at); if (!n){ r8MapShow(); return; } R.flags.simGone = 1; save(); n.comp = 'simfoe'; n.t = 'fight'; n.ms = undefined; n.third = undefined; n.lay = undefined; n.npc8 = null; n.bare = true; n.stitch = null; delete n.preKeys; R.done = R.done.filter(x => x !== n.id);
    R8T = null; talkLines([{ narr: '무기를 다시 든다. 헌팅나이프의 웃음이 사라진다.' }, { t: '…그래, 그런 거였나.', name: '헌팅나이프', who: 'C-290' }, { go: '!r8:battle' }]); },
  surrJoin(){""")
open(F, 'w', encoding='utf-8').write(s)
print('page9060 OK')
