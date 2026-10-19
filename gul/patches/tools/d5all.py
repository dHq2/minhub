# d5all.py v1.0 — tool-results 의 드라이브 받기 결과를 모두 d5/raw/<제목>.png 로 풀고 미리보기 (가로 900 jpg) · 이미 푼 것은 건너뜀 · 다 푼 결과 파일은 지움
import sys, json, base64, io, os, glob, re
from PIL import Image
T = '/root/.claude/projects/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/tool-results/'
O = sys.argv[1]; os.makedirs(O + '/raw', exist_ok=True); os.makedirs(O + '/pv', exist_ok=True)
for f in sorted(glob.glob(T + 'mcp-Google_Drive-download_file_content-*.txt')):
    try: d = json.load(open(f))
    except Exception as e: print('skip', f, e); continue
    t = re.sub(r'[\\/:*?"<>|]', '_', d.get('title') or d['id']).strip()
    raw = base64.b64decode(d['content']); p = O + '/raw/' + t
    open(p, 'wb').write(raw)
    im = Image.open(io.BytesIO(raw)); w = 900; h = int(im.size[1] * w / im.size[0])
    im.convert('RGB').resize((w, h)).save(O + '/pv/' + t.rsplit('.', 1)[0] + '.jpg', quality=78)
    print(t, im.size); os.remove(f)
