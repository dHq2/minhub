# h2_poses.py v1.2 — (v1.2: 3기-2 — codex_g 가 있는 1기 인물 (마리 · 모닝스타 · 옐로 …)은 도감의 그 사람 묶음 끝에 붙임 · 변신 / 소환물 묶음 (아해 · 슬라) · 메모에 batch) (v1.1: 3기 — 등급 이름 늘림 (강적 · 중간급 · 장군 · 거대괴수 …) · 메모에 기수) v1.0 — 2기 멤버 (드라이브 '2기멤버 동료,적 모음', cave-3d v0.60)를 도감 인물 칸에 넣음
#  · 인물마다 새 묶음 (g = h2_<slug>, cid = 새 인물 번호). 같은 인물의 다른 모습은 한 묶음: 가람 + 망토 갑옷 · 히라리 + 변신 · 레비 + 소환수
#  · F-h2-<slug> 기본 초상화 (img/face, 256 → 160) · P-h2-<slug> 원화 (img/h2, 높이 420) · O-h2-<slug>-<동작> 동작 그림 (img/h2, 높이 300)
#  · 은신 웅크림 (은신.png) 7장 · 연금술사 (이름 모름, 낱장 연금술.png) · 벨 쌍권총 그림도 같이
#  · 게임 속 쓰임 (game): 그 동작을 쓰는 기술 이름 · 패시브 (cave-3d/src/h2.js H2K에서 읽음). spec은 비워 둠 (민수가 확정하는 칸)
#  · 이미 있으면 이름 · 쓰는 곳만 고침 (체크 · 메모는 id에 붙어 있어 그대로). cid는 처음 정한 것을 유지
# 실행: python3 codex/tools/h2_poses.py  (그다음 python3 codex/tools/pack.py)
import os, json, re, subprocess
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); C3 = os.path.join(os.path.dirname(ROOT), 'cave-3d')
OUT = os.path.join(ROOT, 'img', 'h2'); FACE = os.path.join(ROOT, 'img', 'face')
os.makedirs(OUT, exist_ok=True)
s = open(os.path.join(C3, 'src', 'h2_roster.js'), encoding='utf-8').read(); R = json.loads(s[s.index('{'):s.rindex('}') + 1])
# 기술표 (H2K)는 JS라 node로 꺼냄
K = json.loads(subprocess.check_output(['node', '-e', """
const fs = require('fs'); const src = fs.readFileSync(process.argv[1], 'utf8'); const a = src.indexOf('const sk ='), b = src.indexOf('h2Build();', a);
const H2K = eval(src.slice(a, b) + '; H2K'); const o = {};
for (const [k, v] of Object.entries(H2K)) o[k] = { pas: v.pas || null, boss: !!v.boss, sk: (v.sk || []).map(s => ({ n: s.n, pose: s.pose, pose2: s.pose2, type: s.type })) };
console.log(JSON.stringify(o));""", os.path.join(C3, 'src', 'h2.js')]))
PN = {'idle': '기본', 'idle2': '기본 2', 'idle3': '기본 3', 'walk': '걷기', 'run': '달리기', 'attack': '공격', 'attack2': '공격 2', 'attack3': '공격 3', 'windup': '예고 (준비)', 'windup2': '예고 2',
      'guard': '막기', 'guardfront': '정면 막기', 'down': '쓰러짐', 'dead': '죽음', 'hurt': '맞음', 'hurt2': '맞음 2', 'hurt3': '맞음 3', 'crouch': '웅크림', 'low': '낮은 자세', 'jump': '도약',
      'shoot': '사격', 'special': '필살', 'skill': '기술', 'cast': '시전', 'finisher': '확인사살', 'backstep': '뒤로 빠짐', 'dash': '돌진', 'rest': '쉬기', 'stand': '선 자세', 'ready': '태세',
      'kick': '발차기', 'bash': '방패 치기', 'front': '정면', 'taunt': '도발', 'crawl': '포복', 'prone': '엎드려 쏘기', 'land': '착지', 'sneak': '은신 걸음', 'summon': '소환', 'summon2': '소환 2',
      'command': '지휘', 'pistol': '권총', 'rod': '조율봉', 'talk': '말하기', 'armor_idle': '갑옷 기본', 'armor_ready': '갑옷 태세', 'fly': '날기', 'slam': '내려찍기'}
ENG = {'idle': '서 있을 때 · 숨쉬기', 'walk': '걸을 때', 'run': '걸을 때 (뛰기)', 'down': '쓰러졌을 때', 'dead': '죽었을 때', 'hurt': '맞았을 때', 'guard': '막기 자세 · 맞을 때 (맞음 그림 대신)',
       'windup': '공격 예고', 'attack': '기본 공격', 'crouch': '숙이기 (G) · 은신', 'sneak': '숙이기 (G) · 은신'}
GROUP = {'garam2': 'garam', 'hirari2': 'hirari', 'levi_beast': 'levi', 'ahae2': 'ahae', 'ahae_wraith': 'ahae', 'slra2': 'slra'}
def role(slug, o):
    r = str(o.get('role') or '') + ' ' + str(o.get('rank') or '')
    if K.get(slug, {}).get('boss') or r.startswith('보스') or '강적' in r or o.get('role', '').startswith('적'): return '적 · 보스'
    if o.get('role', '').startswith('NPC'): return 'NPC'
    return '동료'
def clean(n): return re.sub(r'\s*\(.*\)\s*$', '', n or '')
def put(src, dst, h=300, sq=0):
    im = Image.open(os.path.join(C3, src)).convert('RGBA')
    if sq: m = min(im.size); im = im.crop(((im.width - m) // 2, 0, (im.width - m) // 2 + m, m)).resize((sq, sq), Image.LANCZOS)
    else: im = im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=86, method=4)
P = os.path.join(ROOT, 'catalog.js'); s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
mine = lambda e: e['id'].startswith(('O-h2-', 'F-h2-', 'P-h2-'))
old = {e['id']: e for e in cat if mine(e)}; cat = [e for e in cat if not mine(e)]
used = {int(e['cid'][2:]) for e in cat if e.get('cid', '').startswith('C-')}
cidOf = {}
for e in old.values():
    if e.get('g', '').startswith('h2_') and e.get('cid'): cidOf[e['g']] = e['cid']
nxt = max(used | {int(c[2:]) for c in cidOf.values()} | {187}) + 1
new = []
def ent(id_, **kw):
    e = dict(old.get(id_, {})); keep = {k: e[k] for k in ('on',) if k in e}
    e.update({'id': id_, 'rank': '', 'on': True, **kw}); e.update(keep); new.append(e)
def skillsFor(slug, pose):
    return [x['n'] for x in K.get(slug, {}).get('sk', []) if pose in (x.get('pose'), x.get('pose2'))]
order = []
for slug, o in R.items():
    g = 'h2_' + GROUP.get(slug, slug); base = R[GROUP.get(slug, slug)]
    cg = base.get('codex_g'); hit = next((e for e in cat if cg and e.get('g') == cg), None)
    if hit: g = cg; cidOf[g] = hit.get('cid') or cidOf.get(g)   # 1기 인물: 도감에 있던 묶음으로
    if g not in cidOf or not cidOf[g]: cidOf[g] = f'C-{nxt:03d}'; nxt += 1
    cid = cidOf[g]; rl = role(GROUP.get(slug, slug), base)
    rank = str(base.get('rank') or ''); rk = re.match(r'[1-5]성|4|보스|강적|중간급|암계장군|악마대장군|초강자|장군|거대괴수|정예|병사', rank)
    sub = f"{clean(base['name'])}{' (' + (rk.group(0) + ('성' if rk.group(0) == '4' else '')) + ')' if rk else ''} · {rl} · 동작 그림"
    if hit: sub = hit['sub']
    nm = clean(o['name']); pas = K.get(slug, {}).get('pas')
    kit = ' · '.join(x['n'] for x in K.get(slug, {}).get('sk', []))
    note = f"{o.get('batch') or ('3기' if o.get('gen') == 3 else '2기') + ' 멤버 1차'} (드라이브, 2026-10-06) · {o.get('rank', '')} · {o.get('role', '')} · 보직 {o.get('role_job', '-')} · 키 {o.get('tall', '?')}m · 분석: cave-3d/art/h2/notes/{slug}.md"
    gsum = f"게임 (훈련장 P → 2기): 기술 {kit or '-'}" + (f" · 패시브 {pas[0]} — {pas[1]}" if pas else '')
    if o.get('face') and slug not in GROUP:
        put(o['face'], os.path.join(FACE, f'h2_{slug}.webp'), sq=160)
        ent(f'F-h2-{slug}', cat='char', sub=sub, cid=cid, g=g, name=f'{nm} 기본 초상화', src=f'img/face/h2_{slug}.webp', note=note, game=gsum)
    if o.get('portrait'):
        put(o['portrait'], os.path.join(OUT, f'{slug}__portrait.webp'), h=420)
        ent(f'P-h2-{slug}', cat='char', sub=sub, cid=cid, g=g, name=f'{nm} · 원화', src=f'img/h2/{slug}__portrait.webp', note=note, on=False)
    for k, p in o['poses'].items():
        put(p['src'], os.path.join(OUT, f'{slug}__{k}.webp'))
        use = skillsFor(slug, k); eng = ENG.get(k)
        game = '게임: ' + ' · '.join(([eng] if eng else []) + ([f'기술 {", ".join(use)}'] if use else [])) if (eng or use) else '게임: 아직 안 씀 (예비 동작)'
        ent(f'O-h2-{slug}-{k}', cat='char', sub=sub, cid=cid, g=g, name=f'{nm} · {PN.get(k, k)}', src=f'img/h2/{slug}__{k}.webp', note=note, game=game)
    order.append(g)
# 은신 웅크림 (은신.png) · 벨 쌍권총 · 하리 원화 전신 · 연금술사
MISC = os.path.join('art', 'h2', '_misc')
for slug in ('goldknight', 'gundevil', 'hari', 'inclador', 'kanya', 'rook'):
    g = 'h2_' + slug; nm = clean(R[slug]['name']); sub = next(e['sub'] for e in new if e['g'] == g)
    put(os.path.join(MISC, f'stealth_{slug}.webp'), os.path.join(OUT, f'{slug}__stealth.webp'))
    ent(f'O-h2-{slug}-stealth', cat='char', sub=sub, cid=cidOf[g], g=g, name=f'{nm} · 은신 웅크림', src=f'img/h2/{slug}__stealth.webp', note='낱장 은신.png (시트의 \'은신\' 칸) — 은신 되는 인물 목록으로 보임. 배율 임시', game='게임: 아직 안 씀 (숙이기 그림 후보)', on=False)
sub = next(e['sub'] for e in new if e['g'] == 'h2_bel')
put(os.path.join(MISC, 'bel_dualshoot.webp'), os.path.join(OUT, 'bel__dualshoot.webp'))
ent('O-h2-bel-dualshoot', cat='char', sub=sub, cid=cidOf['h2_bel'], g='h2_bel', name='인공천사 벨 · 쌍권총 (전신 원화)', src='img/h2/bel__dualshoot.webp', note='낱장 1000017866.png (검은 바탕)', game='게임: 아직 안 씀 (연사 그림 후보)', on=False)
if 'h2_alchemist' not in cidOf: cidOf['h2_alchemist'] = f'C-{nxt:03d}'; nxt += 1
sub = '연금술사 (이름 모름) · 역할 미정 · 원화 + 연출'
put(os.path.join(MISC, 'alchemist_face.webp'), os.path.join(FACE, 'h2_alchemist.webp'), sq=160)
put(os.path.join(MISC, 'alchemist_idle.webp'), os.path.join(OUT, 'alchemist__idle.webp'))
put(os.path.join(MISC, 'alchemist_portrait.webp'), os.path.join(OUT, 'alchemist__portrait.webp'), h=420)
an = '낱장 연금술.png · 원화들.png (2026-10-06). 이름 · 등급 · 역할을 민수가 정해야 함'
ent('F-h2-alchemist', cat='char', sub=sub, cid=cidOf['h2_alchemist'], g='h2_alchemist', name='연금술사 기본 초상화', src='img/face/h2_alchemist.webp', note=an, on=False)
ent('O-h2-alchemist-idle', cat='char', sub=sub, cid=cidOf['h2_alchemist'], g='h2_alchemist', name='연금술사 · 기본', src='img/h2/alchemist__idle.webp', note=an, on=False)
ent('P-h2-alchemist', cat='char', sub=sub, cid=cidOf['h2_alchemist'], g='h2_alchemist', name='연금술사 · 원화', src='img/h2/alchemist__portrait.webp', note=an, on=False)
# 묶음 안 순서: 초상화 → 원화 → 기본 → 나머지 동작
rk = lambda e: (0 if e['id'].startswith('F-') else 1 if e['id'].startswith('P-') else 2 if e['id'].endswith('-idle') else 3)
new.sort(key=lambda e: (e['g'], rk(e)))
# 인물 칸 끝 (마지막 char 뒤)에 넣음
ext = [e for e in new if not e['g'].startswith('h2_')]; new = [e for e in new if e['g'].startswith('h2_')]
for gg in dict.fromkeys(e['g'] for e in ext):
    idx = [i for i, e in enumerate(cat) if e.get('g') == gg]; add = [e for e in ext if e['g'] == gg]
    cat[idx[-1] + 1:idx[-1] + 1] = add
at = max(i for i, e in enumerate(cat) if e['cat'] == 'char') + 1
cat[at:at] = new
if 'v1.82:' not in head: head = head.replace('/* catalog.js v1.81 — ', '/* catalog.js v1.82 — v1.82: 2기 멤버 41명 (38인물 + 연금술사) 초상화 · 원화 · 동작 그림 (tools/h2_poses.py). ', 1)
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print(len(new), 'entries (+', len(ext), 'in 1기 groups),', len({e['g'] for e in new}), 'people,', len(cat), 'total; cid', min(cidOf.values()), '~', max(cidOf.values()))
