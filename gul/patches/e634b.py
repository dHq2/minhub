def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
P='page10.tpl.html'
rep(P,"'방향을 틂 — ' + n(e.a) + '가 싸우는 ' + n(e.b) + ' 쪽'","'방향을 틂 — ' + ga(n(e.a)) + ' 싸우는 ' + n(e.b) + ' 쪽'")
rep(P,"e.why === 'near' ? ga(n(e.b)) + ' ' + n(e.a) + ' 곁 (4.5칸) 으로 옴' : '때가 됨 (10초)'","e.why === 'near' ? ga(n(e.b)) + ' ' + n(e.a) + ' 곁 (4.5칸) 으로 옴' : e.why === 'mate' ? ga(n(e.b)) + ' 곁에서 싸우기 시작함 — 기다리지 않음' : '때가 됨 (10초)'")
rep(P,"e.why === 'near' ? '곁으로 옴' : '때가 됨'","e.why === 'near' ? '곁으로 옴' : e.why === 'mate' ? '동료가 싸우기 시작함' : '때가 됨'")
