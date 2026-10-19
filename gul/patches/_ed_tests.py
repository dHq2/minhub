import re
for p,old,new in [('ui8700.js',"ui8700.js v1.2 (v1.2:","ui8700.js v1.3 (v1.3: 히든 층 (v8.7.1 · 무작위) 은 이 시험에서 끔 · v1.2:"),('ui8711.js',"ui8711.js v1.1 (v1.1:","ui8711.js v1.2 (v1.2: 히든 층은 끔 · v1.1:")]:
    s=open(p,encoding='utf-8').read(); assert s.count(old)==1; s=s.replace(old,new)
    a="document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });"
    assert s.count(a)==1, p
    s=s.replace(a,"document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });\n await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; R.hid={}; });   // 히든 층 끔 (무작위)")
    open(p,'w',encoding='utf-8').write(s)
s=open('runui.sh',encoding='utf-8').read()
s=s.replace('# UI 묶음 시험 — runui.sh v5.3 (v5.3:','# UI 묶음 시험 — runui.sh v5.4 (v5.4: ui8711 더함 · v5.3:').replace('ui8710 ui7100','ui8710 ui8711 ui7100')
open('runui.sh','w',encoding='utf-8').write(s)
