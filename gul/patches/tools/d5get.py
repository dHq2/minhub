# d5get.py v1.0 — 드라이브 받기 결과 (JSON · base64) 를 그림 파일로 풀고 미리보기 (가로 900) 를 만듦
import sys, json, base64, io
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
d = json.load(open(src)); raw = base64.b64decode(d['content'])
open(dst, 'wb').write(raw)
im = Image.open(io.BytesIO(raw)); print(d.get('title'), im.size, im.mode)
w = 900; h = int(im.size[1] * w / im.size[0]); im.convert('RGB').resize((w, h)).save(dst.rsplit('.', 1)[0] + '_pv.jpg', quality=80)
