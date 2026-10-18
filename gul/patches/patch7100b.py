import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    return s.replace(a,b)
m=open(D+'rt3_mid.js').read()
m=rep(m,"if (u.sightMul != null && u.sightMul < 1 && d > W.rules.sight * u.sightMul) return false;","if (u.sightMul != null && u.sightMul < 1 && glowAt(W, t.x, t.y) && d > W.rules.sight * u.sightMul) return false;")
open(D+'rt3_mid.js','w').write(m)
t=open(D+'rt3_tail.js').read()
t=rep(t,"u.sightMul = 1 - (1 - (M.oneEye != null ? M.oneEye : 0.75)) * 2 / u.eyes;","u.sightMul = 1 - (1 - (M.oneEye != null ? M.oneEye : 0.75)) * 2 / u.eyes; u.sm0 = u.sightMul;")
t=rep(t,"  m *= Math.hypot(t.vx || 0, t.vy || 0) > 0.5 ? N.move || 1.25 :","  m *= Math.hypot(t.vx || 0, t.vy || 0) > 0.5 || t.act ? N.move || 1.25 :")
t=rep(t,"  return { pres: g[0] * m, form: g[1] * m * gl, ident: g[2] * m * gl };","  const ey = u.sightMul != null && u.sm0 ? Math.min(1, u.sightMul / u.sm0) : 1;   // 싸우다 눈을 더 잃으면 (태어날 때부터의 사각은 등급에 이미 들어 있음)\n  return { pres: g[0] * m, form: g[1] * m * gl * ey, ident: g[2] * m * gl * ey };")
open(D+'rt3_tail.js','w').write(t); print('ok')
