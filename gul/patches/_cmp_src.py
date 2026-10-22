import sys,re
lines=open('wiki/src_chars.txt',encoding='utf-8').read().split('\n')
start=int(sys.argv[1]); end=int(sys.argv[2])
cur=None; out=[]
ents=[]
for l in lines:
    if l.startswith('## '):
        cur={'id':l[3:],'name':'','pics':'','memo':[],'game':[],'other':[]}; ents.append(cur); continue
    if cur is None: continue
    if l.startswith('이름 줄:'): cur['name']=l[5:].strip()
    elif l.startswith('그림 이름:'): cur['pics']=l[6:].strip()
    elif l.startswith('명단'): pass
    elif l.startswith('- 메모:'): cur['memo'].append(l[6:].strip())
    elif l.startswith('- 게임:'): cur['game'].append(l[6:].strip().replace('게임: ',''))
    elif l.strip(): cur['other'].append(l)
for e in ents:
    m=re.match(r'C-(\d+)',e['id'])
    if m and not (start<=int(m.group(1))<=end): continue
    print('##',e['id'],'|',e['name'])
    p=e['pics']
    print('  PICS:',p[:350]+(' ...(+%d)'%(len(p)-350) if len(p)>350 else ''))
    # dedupe memos by removing trailing sheet names
    seen=[]
    for mm in e['memo']:
        k=re.sub(r"· 시트 '.*'$|#\d+.*$","",mm)
        if k not in seen: seen.append(k)
    groups={}
    order=[]
    for k in seen:
        if ' · ' in k and k.count(' · ')>=1 and ('업뎃' in k):
            pre,_,suf=k.rpartition(' · ')
        else: pre,suf=k,''
        if pre not in groups: groups[pre]=[]; order.append(pre)
        if suf: groups[pre].append(suf)
    for pre in order:
        sufs=groups[pre]
        print('  MEMO:',pre[:400], ('-> '+' | '.join(x.replace(' (원래 파일 그대로)','') for x in sufs))[:600] if sufs else '')
    g=[]
    for x in e['game']:
        if x not in g: g.append(x)
    if g: print('  GAME:',' / '.join(g)[:1100])
    for o in e['other']: print('  OTHER:',o[:400])
