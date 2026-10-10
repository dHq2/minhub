# blobs.py v1.0 (2026-10-10) — 도감 자산 보관함 (아티팩트 assets, 1GiB · 5000개) 지도: 무거운 그림은 한 판 (256MiB · 511개) 대신 보관함에
#  · 보관함에 두는 것: 묶이지 않은 움직이는 그림 (img/** 의 여러 장 webp) + 꽉 찬 화면용 원본 묶음 hi/*.webp
#  · blobs.json = { 경로: {id, sha, size} } → blobs.js (const BLOBS = { 경로: id }) — 도감 화면은 '/_blob/' + id 로 읽음 (index.html U())
#  사용:
#    python3 codex/tools/blobs.py plan      → 올릴 것 (새로 · 바뀜) 경로 목록과, 바뀌어서 지울 옛 id 를 찍음 (blobs_plan.json)
#    (Artifact 도구로 올림: url=도감, asset: true, file_paths=올릴 것 25개씩 — 결과 글을 그대로 파일에 저장)
#    python3 codex/tools/blobs.py add <결과글 파일>…   → 결과에서 경로 · id 를 읽어 blobs.json · blobs.js 고침
#    python3 codex/tools/blobs.py check <보관함 목록 글 파일> → 보관함 목록 (id · 크기) 과 blobs.json 크기 대조
#  게시: blobs.js 를 files 로 보냄. 판에 남아 있던 옛 경로는 files 에 null (처음 옮길 때 한 번) — publish_files.py 는 보관함 경로를 뺌
import os, sys, json, re, hashlib
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = os.path.join(ROOT, 'blobs.json')
def load(): return json.load(open(J, encoding='utf-8')) if os.path.exists(J) else {}
def sha(p): return hashlib.sha256(open(os.path.join(ROOT, p), 'rb').read()).hexdigest()
def write_js(B):
    js = ('/* blobs.js — tools/blobs.py 가 만듦 (손으로 고치지 않음). 도감 자산 보관함: 그림 경로 → 보관함 id (화면은 "/_blob/" + id 로 읽음) */\n'
          'const BLOBS = ' + json.dumps({k: v['id'] for k, v in sorted(B.items())}, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(os.path.join(ROOT, 'blobs.js'), 'w', encoding='utf-8').write(js)
def wanted():
    cat = json.loads(open(os.path.join(ROOT, 'catalog.js'), encoding='utf-8').read().split('const CATALOG = ', 1)[1].strip().rstrip(';'))
    packed = set(json.loads(re.search(r'const PACKED = (\{.*\});', open(os.path.join(ROOT, 'packs.js'), encoding='utf-8').read()).group(1)))
    out = []
    for e in cat:
        s = e['src']
        if s in packed or not s.startswith('img/') or not s.endswith('.webp') or s in out: continue
        p = os.path.join(ROOT, s)
        if not os.path.exists(p): continue
        try: n = getattr(Image.open(p), 'n_frames', 1)
        except Exception: n = 1
        if n > 1: out.append(s)
    hs = open(os.path.join(ROOT, 'hipacks.js'), encoding='utf-8').read()
    out += json.loads(re.search(r'const HIPACKS = (\[.*?\]);', hs, re.S).group(1))
    return out
def plan():
    B = load(); W = wanted(); up = []; stale = []
    for p in W:
        h = sha(p)
        if p not in B or B[p]['sha'] != h:
            up.append(p)
            if p in B: stale.append(B[p]['id'])
    gone = [p for p in B if p not in W]
    stale += [B[p]['id'] for p in gone]
    json.dump({'upload': up, 'stale_ids': stale, 'gone': gone}, open(os.path.join(ROOT, 'tools', 'blobs_plan.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(f'보관함에 둘 그림 {len(W)}개 · 올릴 것 {len(up)}개 ({sum(os.path.getsize(os.path.join(ROOT, p)) for p in up) / 2**20:.1f}MiB) · 지울 옛 id {len(stale)}개 · 빠진 경로 {len(gone)}개')
    for i in range(0, len(up), 25): print(f'묶음 {i // 25 + 1}:', json.dumps([os.path.join(ROOT, p) for p in up[i:i + 25]], ensure_ascii=False))
def add(files):
    B = load(); n = 0
    for f in files:
        t = open(f, encoding='utf-8').read()
        # 결과 글 예: "…/codex/img/char/x.webp" … id 0123…(32자) … url /_blob/0123…
        for line in t.splitlines():
            m = re.search(r'codex/((?:img|hi)/[^\s"\'()]+?\.webp)', line); i = re.search(r'\b([0-9a-f]{32})\b', line)
            if m and i:
                p = m.group(1); B[p] = {'id': i.group(1), 'sha': sha(p), 'size': os.path.getsize(os.path.join(ROOT, p))}; n += 1
    json.dump(B, open(J, 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True); write_js(B)
    print('읽은 줄', n, '· 지도', len(B), '개')
def check(files):
    B = load(); sizes = {}
    for f in files:
        for line in open(f, encoding='utf-8').read().splitlines():
            i = re.search(r'\b([0-9a-f]{32})\b', line); s = re.search(r'(\d+) bytes', line)
            if i and s: sizes[i.group(1)] = int(s.group(1))
    bad = [(p, v['size'], sizes.get(v['id'])) for p, v in B.items() if sizes.get(v['id']) != v['size']]
    print('지도', len(B), '· 보관함 목록', len(sizes), '· 크기 안 맞음', len(bad)); [print(' ', b) for b in bad[:20]]
if __name__ == '__main__':
    a = sys.argv[1:] or ['plan']
    {'plan': lambda: plan(), 'add': lambda: add(a[1:]), 'check': lambda: check(a[1:])}[a[0]]()
