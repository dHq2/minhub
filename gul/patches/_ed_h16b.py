p='run8_h.js'; s=open(p,encoding='utf-8').read()
a="""  const cut = []; for (const y of [best.y, best.y + 1]) for (let x = best.ax; x <= A.NX + gap + best.bx; x++) if (g[y][x] !== '.'){ g[y][x] = '.'; cut.push([x, y]); }
  const off = A.NX + gap, props = [...A.props, ...B.props.map(p => ({ ...p, x: p.x + off }))];"""
b="""  const off = A.NX + gap, props = [...A.props, ...B.props.map(p => ({ ...p, x: p.x + off }))], pc = new Set(); for (const p of props) for (let yy = p.y; yy < p.y + p.h; yy++) for (let xx = p.x; xx < p.x + p.w; xx++) pc.add(xx + ',' + yy);
  const cut = [], span = y => { const L = []; for (let x = best.ax; x <= off + best.bx; x++) L.push(x); return L; };
  for (const y of [best.y, best.y + 1]){ const L = span(y); if (y !== best.y && L.some(x => pc.has(x + ',' + y))) continue; for (const x of L) if (g[y][x] !== '.' && !pc.has(x + ',' + y)){ g[y][x] = '.'; cut.push([x, y]); } }"""
assert s.count(a)==1; s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
