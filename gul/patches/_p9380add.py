rep("  return !o ? ['자동', '#d8cfc0'] : o.k === 'swap' ?", "  return !o ? ['자동', '#d8cfc0'] : o.k === 'fatk' ? ['🗡 역장 치기', '#c9a6ff'] : o.k === 'swap' ?")
rep("      case 'hamb': out.push(", """      case 'bwave': out.push(`${T(e)}🛡💥 ${n(e.a)} 방패 파동 — 앞의 ${e.n}명을 밀어냄`); break;   /* v9.14.0 */
      case 'fieldHit': out.push(`${T(e)}🗡 ${n(e.a)} → ${n(e.b)}의 역장 −${e.n} (남은 내구 ${e.left})`); break;
      case 'hambKill': out.push(`${T(e)}☠ ${n(e.a)} 암습 — 끝까지 들키지 않아 ${n(e.b)}${jong(n(e.b)) ? '을' : '를'} 단숨에 끝냄`); break;
      case 'chgFollow': out.push(`${T(e)}💨 ${n(e.a)} — 무기를 박고도 멈추지 못해 몸까지 들이닥침 (남은 속력 ${e.v}칸/초)`); break;
      case 'hamb': out.push(""")
rep("    case 'hamb': return {", """    case 'bwave': return { c: 'bad', s: `${ga(n(e.a))} 방패를 내지르자 파동이 앞을 쓸어 낸다.` };   /* v9.14.0 */
    case 'hambKill': return { c: 'bad', s: `${n(e.b)}${jong(n(e.b)) ? '은' : '는'} 무엇이 다가왔는지도 모른 채 쓰러진다.` };
    case 'chgFollow': return { c: '', s: `${ga(n(e.a))} 무기를 박고도 멈추지 못한다 — 몸이 그대로 들이닥친다.` };
    case 'hamb': return {""")
rep("  '밀치기 돌진': '암계 창방패병", "  '방패 파동': '암계 방패병 — 제자리에서 방패를 내질러 앞 (±70° · 몸 + 1.9칸) 의 적을 밀어냄 (가벼울수록 멀리) · 피해는 작고 (공격 × 0.35) 휘청 0.3초 · 자세 −25 — 붙은 진형을 무너뜨리는 기술. 대기 9초.',\n  '밀치기 돌진': '암계 창방패병")
rep("active: ['암계 역장'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 3 }, 머리: { name: '암계 투구', mat: '투구', tier: 3 } } }, '", "active: ['암계 역장', '방패 파동'], gear: { 몸: { name: '암계 흉갑', mat: '판금', tier: 3 }, 머리: { name: '암계 투구', mat: '투구', tier: 3 } } }, '")
rep("  ['헌팅나이프', 'C-290', 4, { cls: '기동', weapon: '단검', height: 1.85,", "  ['헌팅나이프', 'C-290', 4, { cls: '기동', role: '미드필더', weapon: '단검', height: 1.85,")
rep("  ['헌팅나이프', 'C-290', 4, { cls: '기동', weapon: '단검', height: 2.0,", "  ['헌팅나이프', 'C-290', 4, { cls: '기동', role: '미드필더', weapon: '단검', height: 2.0,")
rep("{ key: '나달', side: 0, ref: 'C-198', name: '나달', tier: 2, cls: '근접', role: '전선',", "{ key: '나달', side: 0, ref: 'C-198', name: '나달', tier: 2, cls: '근접', role: '공격수',")
rep("  if (u && u.side !== 0){ giveAttack(u, add || detourArm); return; }\n  // v5.4.2", """  if (u && u.side !== 0){ giveAttack(u, add || detourArm); return; }
  { const F = fieldAt(world, w.x, w.y); if (F && selUnits(world).length){ giveFieldAtk(F); return; } }   /* v9.14.0 역장을 누르면 역장 치기 */
  // v5.4.2""")
rep("function giveAttack(t, det){", """// v9.14.0 역장 = 따로 칠 수 있는 몸: 누른 자리 가까이 (두께 + 0.35칸) 의 상대 편 역장
function fieldAt(Wd, x, y){ return (Wd && Wd.sf8 || []).find(F => F.k === 'wall' && F.hard && F.side !== 0 && Wd.t < F.until && wallQ(F, x, y).d <= (F.th || 0.8) / 2 + 0.35) || null; }
function giveFieldAtk(F){ const L = selUnits(world).filter(u => u.side === 0 && u.alive); if (!L.length){ toast('먼저 명령할 아군을 고르세요'); return; }
  const M = L.filter(u => !isFar(u)), G = L.filter(isFar); M.forEach(u => { u.order = { k: 'fatk', f: F.id }; }); noteOrders(M); hud();
  toast(M.length ? `${M.map(u => u.name).join(' · ')} → ${(world.units[F.by] || {}).name || ''}의 역장 치기 (내구 ${Math.round(F.hp)})${G.length ? ' · 사수는 쏘면 역장이 깎여요' : ''}` : '사수는 역장을 쏘면 깎여요 — 근접을 골라 치게 하세요'); }
function giveAttack(t, det){""")
