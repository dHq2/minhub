# h2_roster.py v1.0 — 2기 멤버 노트 (art/h2/notes/*.json) → src/h2_roster.js (게임이 읽는 목록)
#  · 노트마다 그림 (동작) · 키 · 무게 · 적성 · 성향 · 보직 · 배낭 · 기술 제안을 한데 모음
#  · 그림 파일이 실제로 있는 것만 넣음 (없는 건 빠진 동작으로)
#  · 같은 인물을 두 작업자가 다른 slug로 쓴 경우는 ALIAS로 합침
import os, json, glob
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
NOTES = os.path.join(ROOT, 'art', 'h2', 'notes'); OUT = os.path.join(ROOT, 'src', 'h2_roster.js')
ALIAS = {}
def main():
    R = {}
    for p in sorted(glob.glob(os.path.join(NOTES, '*.json'))):
        try: o = json.load(open(p, encoding='utf-8'))
        except Exception as e: print('skip', p, e); continue
        if isinstance(o, list): items = o
        else: items = [o]
        for o in items:
            slug = ALIAS.get(o.get('slug'), o.get('slug'))
            if not slug: continue
            poses = {}
            for k, v in (o.get('poses') or {}).items():
                if not isinstance(v, dict) or not v.get('src'): continue
                if not os.path.exists(os.path.join(ROOT, v['src'])): print('  missing file', slug, k, v['src']); continue
                poses[k] = {kk: v[kk] for kk in ('src', 'w', 'h', 'ax', 'ay', 'orig') if kk in v}
            if not poses: print('no poses', slug)
            keep = {k: o.get(k) for k in ('name', 'rank', 'folder', 'role', 'tall', 'weight', 'palette', 'missing', 'kit', 'apt', 'tag', 'role_job', 'bag', 'stats', 'hp', 'atk', 'spd', 'desc') if o.get(k) is not None}
            for k in ('portrait', 'face'):
                v = o.get(k)
                if isinstance(v, str) and os.path.exists(os.path.join(ROOT, v)): keep[k] = v
            if slug in R: R[slug]['poses'].update(poses); continue
            R[slug] = {'slug': slug, **keep, 'poses': poses}
    js = '/* h2_roster.js — 자동 생성 (tools/h2_roster.py). 손으로 고치지 말 것: art/h2/notes/*.json을 고치고 다시 돌림 */\n\'use strict\';\nconst H2R = ' + json.dumps(R, ensure_ascii=False, indent=0) + ';\n'
    open(OUT, 'w', encoding='utf-8').write(js)
    print(len(R), 'characters →', OUT)
    for s, o in R.items(): print(f"  {s:14} {o.get('name','?'):12} {o.get('rank','?')!s:4} {o.get('role','?')!s:10} poses={','.join(o['poses'])}")
if __name__ == '__main__': main()
