p='run8_i.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
rep("""  for (const p of P){""","""  if (!P.length && M.out) P = [{ x: M.out[0] - 1, y: M.out[1] - 1, w: 2, h: 2 }];   // 소품이 하나도 없는 진지: 출구를 지키는 설비
  for (const p of P){""")
rep("""u.turret8 = true; u.mass = Math.max(u.mass || 0, 2000); n++; }""","""u.turret8 = true; u.mass = Math.max(u.mass || 0, 2000); u.anchor8 = { x: u.x, y: u.y }; n++; }""")
rep("""function r8GuestTick(W){
  for (const u of W.units){""","""function r8GuestTick(W){
  for (const u of W.units){
    if (u.anchor8 && u.alive){ u.x = u.anchor8.x; u.y = u.anchor8.y; u.vx = 0; u.vy = 0; if (u.kb) u.kb = null; }   // 진지 설비는 박혀 있음 (밀려도 제자리)""")
open(p,'w',encoding='utf-8').write(s)
