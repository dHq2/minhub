import json, math
from PIL import Image
D='artifact-files/19b948dc-6a33-4150-9b19-956f18dac694/'
fm=json.load(open('facemap.json'))
roster=json.load(open('roster.json'))
order=[r[0] for r in roster]
S=80; COLS=16
rows=math.ceil(len(order)/COLS)
atlas=Image.new('RGBA',(COLS*S,rows*S),(0,0,0,0))
cache={}
def load(p):
    if p not in cache: cache[p]=Image.open(D+p).convert('RGBA')
    return cache[p]
idx={}
for i,cid in enumerate(order):
    f=fm[cid]
    if f['pack']:
        sh,x,y,w,h=f['pack']; im=load(sh).crop((x,y,x+w,y+h))
    else: im=load(f['src'])
    bb=im.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox() or (0,0,im.width,im.height)
    bx0,by0,bx1,by1=bb; bw,bh=bx1-bx0,by1-by0
    if f['face']:
        side=max(bw,bh); cx=(bx0+bx1)/2; cy=(by0+by1)/2
        box=(cx-side/2,cy-side/2,cx+side/2,cy+side/2)
    else:
        side=min(bw, bh*0.42) if bh>bw*1.15 else min(bw,bh)
        cx=(bx0+bx1)/2
        box=(cx-side/2,by0,cx+side/2,by0+side)
    box=tuple(int(round(v)) for v in box)
    sq=Image.new('RGBA',(box[2]-box[0],box[3]-box[1]),(0,0,0,0))
    sq.paste(im.crop((max(0,box[0]),max(0,box[1]),min(im.width,box[2]),min(im.height,box[3]))),(max(0,-box[0]),max(0,-box[1])))
    sq=sq.resize((S,S),Image.LANCZOS)
    atlas.paste(sq,((i%COLS)*S,(i//COLS)*S))
    idx[cid]=i
atlas.save('build/faces.webp','WEBP',quality=86,method=6)
json.dump({'S':S,'COLS':COLS,'idx':idx},open('build/faces_idx.json','w'))
# 확인용 판 (어두운 바탕)
bg=Image.new('RGBA',atlas.size,(30,26,32,255)); bg.alpha_composite(atlas); bg.convert('RGB').save('contact.jpg',quality=80)
import os; print(atlas.size, os.path.getsize('build/faces.webp'))
