p='run8_i.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
rep('/* ===== run8_i.js v1.2 — v8.7.1','/* ===== run8_i.js v1.3 — v8.7.1')
rep("   v1.2: 자기 검토","   v1.3: 비전투 맵 (남은 적 없음) 에선 대장이 나가면 모두 함께 나간 것으로 침 (기다리지 않음 · 명세 A9)\n   v1.2: 자기 검토")
rep("""function r8NpcTick(W){""","""function r8FollowTick(W){   // 명세 A9: 비전투 맵 — 대장이 방 · 길로 들어서면 모두 들어선 것으로 침
  if (W.over || W.r8fol) return; const h = W.units.find(u => u.side === 0 && u.hero); if (!h || (h.gone !== 'up' && h.gone !== 'down')) return;
  if (W.units.some(u => u.side === 1 && u.alive)) return; W.r8fol = 1;
  const L = W.units.filter(u => u.side === 0 && u.alive && !u.down && !u.r8guest); for (const u of L) leaveMap(W, u, h.gone);
  if (L.length) logEv(W, { k: 'r8', s: '남은 이들도 함께 넘어간다.', c: 'dim', vis: true }); try { checkEnd(W); } catch (e) {}
}
function r8NpcTick(W){
  r8FollowTick(W);""")
open(p,'w',encoding='utf-8').write(s)
