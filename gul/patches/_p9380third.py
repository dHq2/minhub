# v9.14.0 제3세력 심계 (page9380.py 에 붙임) — v1.0
rep("const p = { ...fromDesign({ ...clone(d), side: 0, traits: (d.traits || []).filter(t => t !== '보스') }, 0), id: uid(), summon: true, r8guest: 'sim', x: q.x, y: q.y, cg: 'sim' };",
    "const p = { ...fromDesign({ ...clone(d), side: 2, traits: (d.traits || []).filter(t => t !== '보스') }, 2), side: 2, id: uid(), summon: true, r8guest: 'sim', x: q.x, y: q.y, cg: 'sim', peace0: true };   /* v9.14.0 제3세력 (2편 · 각혈처럼) · 우리 편에 비선공 */")
rep("u.summon = true; u.r8guest = 'sim'; u.cg = 'sim'; u.hp =", "u.summon = true; u.r8guest = 'sim'; u.cg = 'sim'; u.side = 2; u.peace0 = true; u.prov0 = false; u.hp =")
rep("  logEv(W, { k: 'r8', s: '⚔ 입구 안쪽에서 이미 싸움이 벌어지고 있다 — 낯선 둘이 암계 병사들에게 둘러싸여 버티고 있다. (돕거나, 지켜보거나 — 내버려두면 쓰러질 수 있다)', c: 'good', vis: true });",
    "  logEv(W, { k: 'r8', s: '⚔ 입구 안쪽에서 이미 싸움이 벌어지고 있다 — 낯선 둘이 암계 병사들에게 둘러싸여 버티고 있다. (제3세력 — 이쪽엔 덤비지 않음 · 공격하면 둘 다 적대 · 돕거나, 지켜보거나 — 내버려두면 쓰러질 수 있다)', c: 'good', vis: true });")
rep("  const R = R8S(), T = W.r8.third; if (!T) return false; const alive = W.units.filter(u => u.r8guest === 'sim' && u.alive && !u.gone);\n",
    """  const R = R8S(), T = W.r8.third; if (!T) return false; const alive = W.units.filter(u => u.r8guest === 'sim' && u.alive && !u.gone);
  if (W.units.some(u => u.r8guest === 'sim' && u.prov0)){ R.flags.simGone = 1; save(); R8T = then; talkLines([{ narr: alive.length ? '낯선 이들은 등을 맞댄 채 물러난다 — 이쪽을 노려보며 어둠 속으로 사라졌다.' : '먼저 칼을 겨눈 건 이쪽이었다. 낯선 둘은 끝까지 등을 맞대고 싸웠다.' }, { go: '!r8:then' }]); return true; }   /* v9.14.0 적대한 뒤엔 영입 없음 */
""")
rep("function giveAttack(t, det){\n  const L = selUnits(world);\n  if (!L.length){ toast('먼저 명령할 아군을 고르세요'); return; }\n  if (!t.seenBy){ toast('안 보이는 적은 노릴 수 없어요'); return; }\n",
    "function giveAttack(t, det){\n  const L = selUnits(world);\n  if (!L.length){ toast('먼저 명령할 아군을 고르세요'); return; }\n  if (!t.seenBy){ toast('안 보이는 적은 노릴 수 없어요'); return; }\n  if (t.peace0 && !t.prov0){ provoke0(world, t, L[0]); toast(`⚔ ${t.name} — 제3세력을 공격 · 전우조까지 함께 적대해요`); }   /* v9.14.0 지정해 공격하면 적대 */\n")
rep("      case 'bwave': out.push(", "      case 'provoke': out.push(`${T(e)}⚔ ${e.a != null ? n(e.a) + '의 공격 — ' : ''}${n(e.b)}${e.n > 1 ? ' 와 전우조' : ''} 적대 (제3세력)`); break;   /* v9.14.0 */\n      case 'bwave': out.push(")
# 리트라이 (다시 하기 · 배치로 돌아가 다시 시작) — 예전엔 start() 만 다시 돌아 r8 판 설정 (출구 · 입구 · 제3세력 · 손님) 이 모두 빠졌음
a0 = "  r8Post(world);\n  if (world){ world.explored && world.explored.fill(2);"; i0 = s.index(a0); assert s.count(a0) == 1
e0 = "if (typeof r8BattleHook === 'function') r8BattleHook(n, M); }\n"; i1 = s.index(e0, i0) + len(e0)
B = s[i0:i1]; s = s[:i0] + "  r8Last = { id: n.id, waveK, rule }; r8Post8(n, M, inn, waveK, rule);\n" + s[i1:]
rep("function r8PlaceIn(m, units, inn){", "// v9.14.0 판을 만든 뒤의 r8 설정 (출구 · 입구 · 잠금 · 손님 · 제3세력 …) — 처음 들어설 때와 다시 하기 (리트라이) 가 같은 길\nlet r8Last = null, r8Busy = false;\nfunction r8Post8(n, M, inn, waveK, rule){ const R = R8S();\n" + B + "}\n// 다시 하기 (같은 맵을 처음부터): start() 만 다시 돌면 r8 설정이 빠졌음 (제3세력 · 손님 · 출구가 사라짐) — 같은 칸이면 다시 얹음 (자리는 다시 무작위)\nfunction r8Again(){ if (r8Busy || !world || world.r8 || typeof run8On !== 'function' || !run8On()) return; const R = R8S(), n = R && R.at ? r8Node(R.at) : null; if (!n || !['fight', 'elite', 'boss'].includes(n.t) || (n.t === 'boss' && n.b === 'regina')) return;\n  const L = r8Last && r8Last.id === n.id ? r8Last : null; if (!L && !S.art8) return; const M = S.art8 ? MAPS8[S.art8] : null, inn = M && M.in ? M.in : [Math.floor(S.W / 2) - 5, S.H - 3, Math.floor(S.W / 2) + 5, S.H - 1];\n  try { r8Post8(n, M, inn, L ? L.waveK : 0, L ? L.rule : null); logEv(world, { k: 'r8', s: '↺ 같은 맵을 처음부터 다시', c: 'dim', vis: true }); } catch (e) { console.warn('r8Again', e); } }\nfunction r8PlaceIn(m, units, inn){")
rep("selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors(); pre(); save();", "selId = null; rebuildMap(); setMapUI(); save(); r8Busy = true; try { start(); } finally { r8Busy = false; } renderFloors(); pre(); save();")
rep("  if (nOp) toast(`시작 행동 ${nOp}명을", "  if (typeof r8Again === 'function') r8Again();   /* v9.14.0 다시 하기에도 r8 설정 (제3세력 · 손님 · 출구) */\n  if (nOp) toast(`시작 행동 ${nOp}명을")
# 등장 보장: 근접 암계 병사가 셋이 안 되면 (10판에 1판쯤) 예전엔 둘이 아예 안 나왔음 → 있는 병사 (사수 포함) 로 둘러싸고 · 없어도 둘은 나옴
rep("  const foes = W.units.filter(u => u.side === 1 && u.alive && !isFar(u)); if (foes.length < 3) return;",
    "  let foes = W.units.filter(u => u.side === 1 && u.alive && !isFar(u)); if (foes.length < 3) foes = foes.concat(W.units.filter(u => u.side === 1 && u.alive && isFar(u)));   /* v9.14.0 셋이 안 돼도 나옴 (예전엔 안 나옴) */")
rep("  const c0 = best || foes.slice().sort(", "  const c0 = best || (!foes.length ? { x: h0.x, y: h0.y - 6 } : null) || foes.slice().sort(")
rep("for (const g of [A, B]){ g.state = 'fight'; g.target = near[0]; g.alert = 1;", "for (const g of [A, B]){ g.state = near.length ? 'fight' : 'idle'; g.target = near[0] || null; g.alert = 1;")
