p='run8_i.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
rep("""  for (const p of (M.props || []).filter(q => q.big).slice(0, 2)){""","""  const dIn = q => Math.hypot(q.x + q.w / 2 - cx, q.y + q.h / 2 - cy); let P = (M.props || []).filter(q => q.big).slice(0, 2);
  if (!P.length) P = (M.props || []).filter(q => q.id && q.id !== 'wall' && !q.decor && !q.npc8).sort((a, b) => dIn(b) - dIn(a)).slice(0, 1);   // 큰 설비를 못 놓은 좁은 진지: 가장 먼 바리케이드 뒤
  for (const p of P){""")
rep("ov: { hp: 150 + R.f * 8, atk: 24 + R.f, spd: 0.04 }","ov: { hp: 240 + R.f * 10, atk: 24 + R.f, spd: 0.01 }")
rep("""S.units.push(u0); const u = addUnit(W, u0); u.turret8 = true; n++; }""","""S.units.push(u0); const u = addUnit(W, u0); u.turret8 = true; u.mass = Math.max(u.mass || 0, 2000); n++; }""")
open(p,'w',encoding='utf-8').write(s)
p='ui8711.js'; s=open(p,encoding='utf-8').read()
s=s.replace("ok(tv.length>=5&&tv.every(v=>v!=='없음'),'진지 MS 마다 설비 (팩션 '+tv.length+')');","ok(tv.length>=5&&tv.every(v=>v!=='없음'),'진지 MS 마다 설비 (팩션 '+tv.length+') '+Object.keys(tr).filter(k=>tr[k]==='없음').join(' '));")
s=s.replace("ok(tv.every(v=>v==='없음'||v.moved<0.6),'설비는 움직이지 않음');","ok(tv.every(v=>v==='없음'||v.hp<=0||v.moved<0.3),'설비는 움직이지 않음 (살아 있는 설비)');")
open(p,'w',encoding='utf-8').write(s)
