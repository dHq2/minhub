import subprocess,re
src=open('patch690p.py').read()
src=src.replace("p='page10.tpl.html'; s=open(p).read()","p='page10.tpl.html'; s=open('page10_pre690.tpl.html').read()\nimport subprocess\nK=[0]")
src=src.replace("    assert s.count(a)==n,(a[:80],s.count(a)); s=s.replace(a,b)","    assert s.count(a)==n,(a[:80],s.count(a)); s=s.replace(a,b)\n    K[0]+=1; open(p,'w').write(s); r=subprocess.run('python3 build10.py >/dev/null && node wrap.js >/dev/null && node --check page10_check.js',shell=True,capture_output=True)\n    print(K[0], 'OK' if r.returncode==0 else 'FAIL', a[:60].replace(chr(10),' '))\n    if r.returncode: raise SystemExit")
exec(src)
