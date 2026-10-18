import re,json
s=open('page10.tpl.html').read()
eng=open('rt3.js').read(); eng=eng[:eng.index("if (typeof module !== 'undefined')")]
roster=open('roster4.json').read().replace('</','<\\/')
fi=json.load(open('build/faces_idx.json'))
out=s.replace('/*ENGINE*/',eng).replace('/*ROSTER*/',roster).replace('/*OLDDEF*/',open('oldrules.json').read()).replace('/*FACES*/',json.dumps({'S':fi['S'],'COLS':fi['COLS']}))
open('build/gul-battle.html','w').write(out)
js=re.search(r"<script>\n'use strict';(.*)</script>",out,re.S).group(1)
open('page10_check.js','w').write("'use strict';"+js)
print(len(out))
