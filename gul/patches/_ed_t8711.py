p='ui8711.js'; s=open(p,encoding='utf-8').read()
a="R.f=Math.max(THEME8[tk].d[0],2);"
assert s.count(a)==1; s=s.replace(a,"R.f=[...Array(30).keys()].find(f=>f>=Math.max(THEME8[tk].d[0],2)&&!FIX8[f]);")
a="for (let i=0;i<200&&!W.over;i++) stepWorld(W,0.05); out[tk]={"
assert s.count(a)==1; s=s.replace(a,"for (let i=0;i<200&&!W.over;i++){ stepWorld(W,0.05); r8Tick(W); } out[tk]={")
s=s.replace("ui8711.js v1.0 (v1.0:","ui8711.js v1.1 (v1.1: 설비 시험은 고정층이 아닌 층 · 실제 판처럼 r8Tick 도 돌림 · v1.0:")
open(p,'w',encoding='utf-8').write(s)
