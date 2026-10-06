# analyze.py v1.0 — 투기장 판 결과 (r*.json) → arena.json (순위 · 쌍 점수 · 기록). 사용: python3 analyze.py <결과 폴더>
import json, sys, glob, subprocess, os
D = sys.argv[1]; C3 = '/home/user/minhub/cave-3d'
legs = []
for f in sorted(glob.glob(D + '/r*.json')): legs += [r for r in json.load(open(f))['res'] if not r.get('err') and r.get('w') != 'stuck']
s = open(C3 + '/src/h2_roster.js').read(); R = json.loads(s[s.index('{'):s.rindex('}') + 1])
K = json.loads(subprocess.check_output(['node', '-e', """
const fs = require('fs'); const src = fs.readFileSync(process.argv[1], 'utf8'); const a = src.indexOf('const sk ='), b = src.indexOf('h2Build();', a);
const H2K = eval(src.slice(a, b) + '; H2K'); const o = {};
for (const [k, v] of Object.entries(H2K)) o[k] = { pas: v.pas || null, boss: !!v.boss, phase: !!v.phase, hp: (v.st || {}).hp, atk: (v.st || {}).atk, sk: (v.sk || []).map(s => s.n) };
console.log(JSON.stringify(o));""", C3 + '/src/h2.js']))
FIX = {'garam2': '가람 (망토 갑옷)', 'hirari2': '히라리 (변신)', 'ahae2': '아해 (각성)', 'slra2': '슬라 (전투)'}
import re
nm = {k: FIX.get(k, re.sub(r'\s*\(.*\)\s*$', '', v.get('name', k))) for k, v in R.items()}
def leg(r, me):   # 내 쪽에서 본 판 점수
    mine = 'a' if r['A'] == me else 'b'; oth = 'b' if mine == 'a' else 'a'
    if r.get('ko') and r['w'] != 'draw':
        return (0.5 + 0.5 * r[mine]) if r['w'] == me else -(0.5 + 0.5 * r[oth])
    return r[mine] - r[oth]
pair = {}
st = {k: {'ko': 0, 'kot': [], 'dmg': [], 'casts': [], 'allyw': 0, 'enw': 0, 'lw': 0, 'legs': 0} for k in R}
for r in legs:
    A, B = r['A'], r['B']
    for me, side in ((A, 'a'), (B, 'b')):
        o = B if me == A else A; x = st[me]; x['legs'] += 1; x['dmg'].append(r['dmg'][side]); x['casts'].append(r['dmg'][side + 'c'])
        pair.setdefault((me, o), 0); pair[(me, o)] += leg(r, me)
        if r['w'] == me:
            x['lw'] += 1
            if side == 'a': x['allyw'] += 1
            else: x['enw'] += 1
            if r.get('ko'): x['ko'] += 1; x['kot'].append(r['t'])
rows = []
for k in R:
    sc = [(o, round(v, 2)) for (m, o), v in pair.items() if m == k]
    if not sc: continue
    avg = sum(v for _, v in sc) / len(sc); x = st[k]; kk = K.get(k, {})
    sc.sort(key=lambda t: -t[1])
    rows.append({'slug': k, 'name': nm[k], 'gen': R[k].get('gen', 2), 'batch': R[k].get('batch', ''), 'boss': kk.get('boss', False), 'hp': kk.get('hp'), 'atk': kk.get('atk'), 'avg': round(avg, 3),
                 'pw': sum(v > 0.05 for _, v in sc), 'pd': sum(abs(v) <= 0.05 for _, v in sc), 'pl': sum(v < -0.05 for _, v in sc), 'lw': x['lw'], 'legs': x['legs'], 'ko': x['ko'],
                 'kot': round(sum(x['kot']) / len(x['kot']), 1) if x['kot'] else 0, 'dmg': round(sum(x['dmg']) / max(1, len(x['dmg']))), 'casts': round(sum(x['casts']) / max(1, len(x['casts'])), 1),
                 'allyw': x['allyw'], 'enw': x['enw'], 'best': [[nm[o], v] for o, v in sc[:3]], 'worst': [[nm[o], v] for o, v in sc[::-1][:3]],
                 'rankstr': str(R[k].get('rank') or ''), 'role': R[k].get('role_job', ''), 'sk': kk.get('sk', []), 'pas': kk.get('pas') or [], 'phase': kk.get('phase', False)})
rows.sort(key=lambda r: -r['avg'])
for i, r in enumerate(rows): r['rank'] = i + 1
M = {f'{a}|{b}': round(v, 2) for (a, b), v in pair.items() if a < b}
json.dump({'rows': rows, 'matrix': M, 'order': [r['slug'] for r in rows], 'names': nm}, open(D + '/arena.json', 'w'), ensure_ascii=False)
print(len(legs), 'legs', len(rows), 'rows', sum(1 for r in legs if r.get('ko')), 'ko', sum(1 for r in legs if r['w'] == r['A']), 'allyw', sum(1 for r in legs if r['w'] == r['B']), 'enw')
for r in rows: print(r['rank'], r['name'], r['avg'], f"{r['pw']}-{r['pd']}-{r['pl']}", '*' if r['batch'] else '')
