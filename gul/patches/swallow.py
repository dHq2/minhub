# 바뀐 줄에서 줄 중간 // 뒤에 코드가 삼켜졌는지
import re,sys
old,new=sys.argv[1],sys.argv[2]
pre=set(open(old).read().split('\n')); cur=open(new).read().split('\n')
for i,l in enumerate(cur):
    if l in pre: continue
    for m in re.finditer(r'(?<![:"\'`/\\])//\s', l):
        tail=l[m.end():]
        if re.search(r'(;\s*(if|const|let|return|for|ctx|\w+\s*[=(.])|\)\s*\{|\bcontinue\b|\bbreak\b|=>)', tail): print(new, i+1, 'SUSPECT:', tail[:120])
