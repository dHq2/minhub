old="await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; R.hid={}; });   // 히든 층 끔 (무작위)"
new="await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; const h=(R.hid||{})[R.f]; R.hid={}; if (h&&h!=='none'){ F8[R.f]=null; R.fm=r8Gen(R.f); r8MapShow(); } });   // 히든 층 끔 (무작위)"
for p in ['ui8700.js','ui8711.js']:
    s=open(p,encoding='utf-8').read(); assert s.count(old)==1,p; s=s.replace(old,new); open(p,'w',encoding='utf-8').write(s)
p='ui8710.js'; s=open(p,encoding='utf-8').read()
a="document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });"
assert s.count(a)==1
s=s.replace(a,a+"\n "+new)
s=s.replace("ui8710.js v1.2 (v1.2:","ui8710.js v1.3 (v1.3: 히든 층은 히든 시험에서만 (나머지는 끔) · v1.2:")
# 히든 시험 구간은 R.hid 를 직접 정하므로 그대로. 확률 시험은 flags 를 0 으로 되돌려 셈
open(p,'w',encoding='utf-8').write(s)
