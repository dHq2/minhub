# h2_poses.py v1.7 — (v1.7: v1.6 에서 기수 숫자가 묶음 변수 g 를 덮어써 칸이 엉뚱한 묶음으로 가던 것 고침 (돌리기 전에 찾음) · 4기 — 4기 새 동작 묶음 (cave-3d/src/h2_mov4.js, tools/g4_moves.py) 을 O-h2m4-<인물>-<동작> 칸으로 · 세르파 소환물 · 수정 거품게는 세르파 묶음 · 도감에 이미 초상화가 있는 인물 (노트 codex_face 0) 은 초상화를 새로 안 만듦 · 4기 동작 이름 (g4_names.py)) (v1.6: 4기 준비 — 노트 gen 4 이상이면 메모 머리가 '4기 멤버 1차' (전엔 2기로 적힘) · 노트에 date 가 있으면 그 날짜) (v1.5: 쥐 베테랑을 쥐 기사 묶음에서 떼어 제 인물 번호로 · 잉끌레이도르는 노트의 codex_g 로 잭 (장도리 h3x 묶음) 에 붙음 — 둘 다 민수 도감 설정 2026-10-09) (v1.4: 원래 칸을 쓰레기통에 다 넣은 묶음 (쥐 기사) 도 묶음 · 인물 번호를 지킴 · 1차 업뎃 새 동작 프레임 (cave-3d/src/h2_mov.js) — 동작마다 한 장 (프레임을 줄지어, 칸 높이 220) O-h2m-<slug>-<동작> · img/h2m. 도감 움짤에서 온 동작 (용묘화 · 테헤라) 은 그 움짤 칸에 '게임:' 줄만. 옐로 옛 동작은 '(옛 디자인)' 표시) (v1.3: 민수 확인 — 마도사녀 = 마도사 · 쥐 베테랑은 쥐 기사 묶음 · 도감에 이미 있던 묶음 9곳에 이어 붙임) v1.2 — (v1.2: 3기-2 — codex_g 가 있는 1기 인물 (마리 · 모닝스타 · 옐로 …)은 도감의 그 사람 묶음 끝에 붙임 · 변신 / 소환물 묶음 (아해 · 슬라) · 메모에 batch) (v1.1: 3기 — 등급 이름 늘림 (강적 · 중간급 · 장군 · 거대괴수 …) · 메모에 기수) v1.0 — 2기 멤버 (드라이브 '2기멤버 동료,적 모음', cave-3d v0.60)를 도감 인물 칸에 넣음
#  · 인물마다 새 묶음 (g = h2_<slug>, cid = 새 인물 번호). 같은 인물의 다른 모습은 한 묶음: 가람 + 망토 갑옷 · 히라리 + 변신 · 레비 + 소환수
#  · F-h2-<slug> 기본 초상화 (img/face, 256 → 160) · P-h2-<slug> 원화 (img/h2, 높이 420) · O-h2-<slug>-<동작> 동작 그림 (img/h2, 높이 300)
#  · 은신 웅크림 (은신.png) 7장 · 연금술사 (이름 모름, 낱장 연금술.png) · 벨 쌍권총 그림도 같이
#  · 게임 속 쓰임 (game): 그 동작을 쓰는 기술 이름 · 패시브 (cave-3d/src/h2.js H2K에서 읽음). spec은 비워 둠 (민수가 확정하는 칸)
#  · 이미 있으면 이름 · 쓰는 곳만 고침 (체크 · 메모는 id에 붙어 있어 그대로). cid는 처음 정한 것을 유지
# 실행: python3 codex/tools/h2_poses.py  (그다음 python3 codex/tools/pack.py)
import os, sys, json, re, subprocess
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); C3 = os.path.join(os.path.dirname(ROOT), 'cave-3d')
sys.path.insert(0, HERE)
from g4_names import PN4, ENG4
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
      'command': '지휘', 'pistol': '권총', 'rod': '조율봉', 'talk': '말하기', 'armor_idle': '갑옷 기본', 'armor_ready': '갑옷 태세', 'fly': '날기', 'slam': '내려찍기', 'aim': '조준', 'attack4': '공격 4', 'attack_b': '공격 (뒤)', 'back': '뒷모습', 'bind': '휘감아 묶기', 'block_up': '방패 들어 막기', 'bow': '인사', 'broll_fall': '뒷구르기 1', 'broll_flip': '뒷구르기 2', 'broll_land': '뒷구르기 3', 'cast2': '시전 2', 'cast3': '시전 3', 'claw': '할퀴기', 'cover': '방패 덮기', 'curl': '웅크려 말기', 'dash2': '돌진 2', 'dig': '파내기', 'dive': '뛰어들기', 'down2': '쓰러짐 2', 'down3': '쓰러짐 3', 'drift': '떠다니기', 'flip': '공중제비', 'float': '떠 있기', 'front2': '정면 2', 'grab': '붙잡기', 'guard2': '방진', 'heal': '치료', 'helmet': '투구 고쳐 쓰기', 'idle_b': '기본 (뒤)', 'jump2': '도약 2', 'kick2': '발차기 2', 'knee': '무릎', 'kneel': '무릎 꿇기', 'leap': '뛰어오르기', 'low2': '낮은 자세 2', 'plunge': '내리꽂기', 'prowl': '살금살금', 'pull': '끌어오기', 'reach': '손 뻗기', 'ready2': '태세 2', 'ready3': '태세 3', 'rise': '떠오르기', 'roar': '포효', 'roll_flip': '구르기 2', 'roll_in': '구르기 1', 'roll_land': '구르기 3', 'salute': '경례', 'shield_push': '방패 밀기', 'sit': '앉기', 'sit2': '앉기 2', 'slash': '베기', 'smoke': '담배', 'spin': '회전', 'stance': '겨눔', 'summon3': '소환 3', 'swing': '휘두르기', 'sword_attack': '검 베기', 'sword_back': '검 뒤로', 'sword_cry': '검 들고 외침', 'sword_kneel': '검 짚고 무릎', 'sword_low': '검 낮게', 'sword_raise': '검 들기', 'sword_ready': '검 태세', 'sword_thrust': '검 찌르기', 'sword_windup': '검 예고', 'throw': '던지기', 'throw2': '던지기 2', 'tumble': '구르기', 'walk2': '걷기 2', 'walk3': '걷기 3', 'walk_b': '걷기 (뒤)', 'wave': '손 흔들기'}
ENG = {'idle': '서 있을 때 · 숨쉬기', 'walk': '걸을 때', 'run': '걸을 때 (뛰기)', 'down': '쓰러졌을 때', 'dead': '죽었을 때', 'hurt': '맞았을 때', 'guard': '막기 자세 · 맞을 때 (맞음 그림 대신)',
       'windup': '공격 예고', 'attack': '기본 공격', 'crouch': '숙이기 (G) · 은신', 'sneak': '숙이기 (G) · 은신'}
GROUP = {'garam2': 'garam', 'hirari2': 'hirari', 'levi_beast': 'levi', 'ahae2': 'ahae', 'ahae_wraith': 'ahae', 'slra2': 'slra', 'magusgirl': 'madosa',
         **{k: 'serpa' for k in ('gula', 'tulin', 'pin', 'mong', 'maidA', 'maidB', 'unitFight', 'unitTank', 'unitMid', 'unitFar', 'crab')}}   # v1.7 세르파 소환물 · 수정 거품게 (자원 유닛) 는 세르파 묶음   # v1.5 쥐 베테랑은 쥐 기사와 따로 (민수 도감 설정: 베테랑 4성 · 쥐 기사 1성)
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
mine = lambda e: e['id'].startswith(('O-h2-', 'F-h2-', 'P-h2-', 'O-h2m-', 'O-h2m4-'))
cat0 = list(cat); old = {e['id']: e for e in cat if mine(e)}; cat = [e for e in cat if not mine(e)]
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
# v1.4 1차 업뎃 새 동작 (cave-3d/src/h2_mov.js · tools/h2_mov_sources.json)
ms = open(os.path.join(C3, 'src', 'h2_mov.js'), encoding='utf-8').read(); MOV = json.loads(ms[ms.index('{'):ms.rindex('}') + 1])
MSRC = json.load(open(os.path.join(C3, 'tools', 'h2_mov_sources.json'), encoding='utf-8'))
WHO = {}   # slug → (묶음 g, cid, sub, 이름)
for slug, o in R.items():
    g = 'h2_' + GROUP.get(slug, slug); base = R[GROUP.get(slug, slug)]
    cg = base.get('codex_g'); hit = next((e for e in cat if cg and e.get('g') == cg), None) or next((e for e in old.values() if cg and e.get('g') == cg), None)   # v1.4 원래 칸을 다 지워도 (쓰레기통) 그 묶음 · 번호 그대로
    if hit: g = cg; cidOf[g] = hit.get('cid') or cidOf.get(g)   # 1기 인물: 도감에 있던 묶음으로
    if g not in cidOf or not cidOf[g]: cidOf[g] = f'C-{nxt:03d}'; nxt += 1
    cid = cidOf[g]; rl = role(GROUP.get(slug, slug), base)
    rank = str(base.get('rank') or ''); rk = re.match(r'[1-5]성|4|보스|강적|중간급|암계장군|악마대장군|초강자|장군|거대괴수|정예|병사', rank)
    sub = f"{clean(base['name'])}{' (' + (rk.group(0) + ('성' if rk.group(0) == '4' else '')) + ')' if rk else ''} · {rl} · 동작 그림"
    if hit: sub = hit['sub']
    nm = clean(o['name']); pas = K.get(slug, {}).get('pas'); WHO[slug] = (g, cid, sub, nm)
    kit = ' · '.join(x['n'] for x in K.get(slug, {}).get('sk', []))
    gn = o.get('gen') or 0; note = f"{o.get('batch') or ('3기' if gn == 3 else f'{gn}기' if gn >= 4 else '2기') + ' 멤버 1차'} (드라이브, {o.get('date', '2026-10-06')}) · {o.get('rank', '')} · {o.get('role', '')} · 보직 {o.get('role_job', '-')} · 키 {o.get('tall', '?')}m · 분석: cave-3d/art/h2/notes/{slug}.md"
    gsum = f"게임 (훈련장 P → 2기): 기술 {kit or '-'}" + (f" · 패시브 {pas[0]} — {pas[1]}" if pas else '')
    if o.get('face') and slug not in GROUP and o.get('codex_face', 1) != 0:   # v1.7 도감에 초상화가 이미 있는 인물 (codex_face 0) 은 그대로
        put(o['face'], os.path.join(FACE, f'h2_{slug}.webp'), sq=160)
        ent(f'F-h2-{slug}', cat='char', sub=sub, cid=cid, g=g, name=f'{nm} 기본 초상화', src=f'img/face/h2_{slug}.webp', note=note, game=gsum)
    if o.get('portrait'):
        put(o['portrait'], os.path.join(OUT, f'{slug}__portrait.webp'), h=420)
        ent(f'P-h2-{slug}', cat='char', sub=sub, cid=cid, g=g, name=f'{nm} · 원화', src=f'img/h2/{slug}__portrait.webp', note=note, on=False)
    for k, p in o['poses'].items():
        put(p['src'], os.path.join(OUT, f'{slug}__{k}.webp'))
        use = skillsFor(slug, k); eng = ENG.get(k)
        game = '게임: ' + ' · '.join(([eng] if eng else []) + ([f'기술 {", ".join(use)}'] if use else [])) if (eng or use) else '게임: 아직 안 씀 (예비 동작)'
        old_d = slug in MOV and MOV[slug].get('replace')   # v1.4 리뉴얼로 옛 그림을 안 쓰는 인물 (옐로)
        if old_d: game = '게임: 안 씀 — 1차 업뎃 (v0.77) 리뉴얼 새 그림으로 바뀜'
        ent(f'O-h2-{slug}-{k}', cat='char', sub=sub, cid=cid, g=g, name=f'{nm} · {PN.get(k, k)}' + (' (옛 디자인)' if old_d else ''), src=f'img/h2/{slug}__{k}.webp', note=note, game=game)
    order.append(g)
# 은신 웅크림 (은신.png) · 벨 쌍권총 · 하리 원화 전신 · 연금술사
MISC = os.path.join('art', 'h2', '_misc')
for slug in ('goldknight', 'gundevil', 'hari', 'inclador', 'kanya', 'rook'):
    g, cid_s, sub, nm = WHO[slug]   # v1.5 다른 묶음에 붙은 인물도 (잉끌레이도르 → 잭 묶음)
    put(os.path.join(MISC, f'stealth_{slug}.webp'), os.path.join(OUT, f'{slug}__stealth.webp'))
    ent(f'O-h2-{slug}-stealth', cat='char', sub=sub, cid=cid_s, g=g, name=f'{nm} · 은신 웅크림', src=f'img/h2/{slug}__stealth.webp', note='낱장 은신.png (시트의 \'은신\' 칸) — 은신 되는 인물 목록으로 보임. 배율 임시', game='게임: 아직 안 씀 (숙이기 그림 후보)', on=False)
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
# v1.4 1차 업뎃 새 동작: 동작마다 한 장 (묶음 그림의 그 칸 — 프레임 줄 · 격자 그대로, 칸 높이 220 까지 줄임)
PN2 = {'walkB': '뒤로 걷기', 'stun': '기절', 'kneel': '무릎 꿇고 일어남', 'plunge': '내리꽂기', 'heal': '치유', 'jump2': '뛰어오름', 'attackB': '공격 (번갈아)', 'charge': '모으기',
       'smash': '내려치기', 'dig': '파내기 (들어가기)', 'dig2': '파내기 (퍼올리기)', 'sit': '앉아 쉬기', 'hurt2': '맞음 2'}
ENG2 = {'idle': '서 있을 때', 'ready': '싸움 태세 (적이 가까울 때)', 'walk': '걸을 때', 'walkB': '카메라에서 멀어지며 걸을 때 (뒷모습)', 'run': '뛸 때', 'hurt': '맞았을 때 (두 가지 번갈아)',
        'hurt2': '맞았을 때 (두 가지 번갈아)', 'stun': '오래 휘청일 때 (기절)', 'kneel': '넘어졌다 일어날 때', 'down': '넘어졌을 때 · 죽었을 때', 'dead': '죽었을 때', 'guard': '막기',
        'crouch': '숙이기 · 은신', 'attack': '기본 공격', 'attackB': '기본 공격 (번갈아)', 'windup': '공격 예고', 'sit': '둘레에 적 없이 8초 가만히 있을 때'}
H2M = os.path.join(ROOT, 'img', 'h2m'); os.makedirs(H2M, exist_ok=True)
WHO['poren'] = ('poren', 'C-006', next((e['sub'] for e in cat if e.get('cid') == 'C-006'), '포렌 · 동료 · 동작 그림'), '포렌')
sheets = {}
for slug, M in MOV.items():
    if slug not in WHO: continue
    g, cid, sub, nm = WHO[slug]; seen = {}
    for k, q in M['poses'].items():
        key = (q.get('src') or M['src'], tuple(q['rect']))
        if key in seen: continue   # 다른 이름으로 같은 칸 (옐로 dash = run …)
        seen[key] = k
        use = skillsFor(slug, k); eng = ENG2.get(k); n = q.get('n', 1)
        game = '게임: ' + ' · '.join(([eng] if eng else []) + ([f'기술 {", ".join(use)}'] if use else [])) if (eng or use) else '게임: 아직 안 씀 (예비 동작)'
        game += f" ({n}장{' · 초당 ' + str(q['fps']) + '장' if q.get('fps') else ''}{' · 한 번' if q.get('once') else ''})" if n > 1 else ''
        srcs = MSRC['src'].get(slug, {}).get(k, [])
        if srcs and all(x.startswith('codex:') for x in srcs):   # 도감 움짤에서 온 동작 → 그 움짤 칸에 '게임:' 줄
            for x in srcs:
                path, rng = x[6:].rsplit(' ', 1); hit = next((e for e in cat if e.get('src') == path), None)
                if hit:
                    lines = [l for l in (hit.get('game') or '').split(' / ') if l and not l.startswith(f'게임 ({nm} {k}')]
                    hit['game'] = ' / '.join(lines + [f"게임 ({nm} {k}, {rng.replace('-', '~')}번 장): " + game[4:]])
            continue
        sp = q.get('src') or M['src']
        if sp not in sheets: sheets[sp] = Image.open(os.path.join(C3, sp)).convert('RGBA')
        x, y, w, h, W, H = q['rect']; im = sheets[sp].crop((x, y, x + w, y + h)); kk = min(1.0, 220 / q['h'])
        if kk < 1: im = im.resize((max(1, round(w * kk)), max(1, round(h * kk))), Image.LANCZOS)
        im.save(os.path.join(H2M, f'{slug}__{k}.webp'), 'WEBP', quality=80, method=4)
        note = "1차 업뎃 (드라이브 '10.08 1차업뎃', 2026-10-09) · 원본 " + ' · '.join(dict.fromkeys(x.rsplit(' ', 1)[0] for x in srcs)) + ' · 게임 묶음 cave-3d/art/h2/mov (tools/h2_moves.py)'
        ent(f'O-h2m-{slug}-{k}', cat='char', sub=sub, cid=cid, g=g, name=f"{nm} · {PN2.get(k, PN.get(k, k))}{f' ({n}장)' if n > 1 else ''} · 1차 업뎃", src=f'img/h2m/{slug}__{k}.webp', note=note, game=game)
# v1.7 4기 새 동작 (cave-3d/src/h2_mov4.js · tools/g4_moves.py): 동작마다 한 장 (묶음 그림의 그 칸, 칸 높이 220 까지 줄임) — 움짤에서 뽑은 동작도 칸 줄로
ms4 = open(os.path.join(C3, 'src', 'h2_mov4.js'), encoding='utf-8').read(); i4 = ms4.index('const H2MOV4 = ') + len('const H2MOV4 = '); MOV4 = json.loads(ms4[i4:ms4.index('};', i4) + 1])
H2M4 = os.path.join(ROOT, 'img', 'h2m4'); os.makedirs(H2M4, exist_ok=True)
for f in os.listdir(H2M4): os.remove(os.path.join(H2M4, f))
for slug, M in MOV4.items():
    if slug not in WHO: continue
    g, cid, sub, nm = WHO[slug]; seen = {}
    for k, q in M['poses'].items():
        key = (q.get('src') or M['src'], tuple(q['rect']))
        if key in seen: continue
        seen[key] = k
        use = skillsFor(slug, k); eng = ENG2.get(k) or ENG4.get(k); n = q.get('n', 1)
        game = '게임: ' + ' · '.join(([eng] if eng else []) + ([f'기술 {", ".join(use)}'] if use else [])) if (eng or use) else '게임: 아직 안 씀 (예비 동작)'
        game += f" ({n}장{' · 초당 ' + str(q['fps']) + '장' if q.get('fps') else ''}{' · 한 번' if q.get('once') else ''})" if n > 1 else ''
        sp = q.get('src') or M['src']
        if sp not in sheets: sheets[sp] = Image.open(os.path.join(C3, sp)).convert('RGBA')
        x, y, w, h, W, H = q['rect']; im = sheets[sp].crop((x, y, x + w, y + h)); kk = min(1.0, 220 / q['h'])
        if kk < 1: im = im.resize((max(1, round(w * kk)), max(1, round(h * kk))), Image.LANCZOS)
        im.save(os.path.join(H2M4, f'{slug}__{k}.webp'), 'WEBP', quality=80, method=4)
        note = "4기 업뎃 (드라이브 '1010 4기 업뎃', 2026-10-10) · 게임 묶음 cave-3d/art/h2/mov4 (tools/g4_moves.py — 시트 칸 · 움짤 프레임)"
        ent(f'O-h2m4-{slug}-{k}', cat='char', sub=sub, cid=cid, g=g, name=f"{nm} · {PN4.get(k) or PN2.get(k) or PN.get(k, k)}{f' ({n}장)' if n > 1 else ''} · 4기", src=f'img/h2m4/{slug}__{k}.webp', note=note, game=game)
# 묶음 안 순서: 초상화 → 원화 → 기본 → 나머지 동작 → 1차 업뎃 새 동작 → 4기 새 동작
rk = lambda e: (0 if e['id'].startswith('F-') else 1 if e['id'].startswith('P-') else 5 if e['id'].startswith('O-h2m4-') else 4 if e['id'].startswith('O-h2m-') else 2 if e['id'].endswith('-idle') else 3)
new.sort(key=lambda e: (e['g'], rk(e)))
# 인물 칸 끝 (마지막 char 뒤)에 넣음
ext = [e for e in new if not e['g'].startswith('h2_')]; new = [e for e in new if e['g'].startswith('h2_')]
for gg in dict.fromkeys(e['g'] for e in ext):
    idx = [i for i, e in enumerate(cat) if e.get('g') == gg]; add = [e for e in ext if e['g'] == gg]
    if idx: at_i = idx[-1] + 1
    else:   # v1.4 묶음에 이 도구 칸만 있던 경우: 예전 자리에
        j = next((k for k, e in enumerate(cat0) if e.get('g') == gg), None)
        prev = next((e for e in reversed(cat0[:j]) if not mine(e)), None) if j is not None else None   # 예전에 바로 앞에 있던 (이 도구 것이 아닌) 칸의 묶음 끝 뒤
        ii = [i for i, e in enumerate(cat) if (e.get('g') == prev.get('g') if prev.get('g') else e['id'] == prev['id'])] if prev else []
        at_i = ii[-1] + 1 if ii else max(i for i, e in enumerate(cat) if e['cat'] == 'char') + 1
    cat[at_i:at_i] = add
at = max(i for i, e in enumerate(cat) if e['cat'] == 'char') + 1
cat[at:at] = new
if 'v1.82:' not in head: head = head.replace('/* catalog.js v1.81 — ', '/* catalog.js v1.82 — v1.82: 2기 멤버 41명 (38인물 + 연금술사) 초상화 · 원화 · 동작 그림 (tools/h2_poses.py). ', 1)
open(P, 'w', encoding='utf-8').write(head + json.dumps(cat, ensure_ascii=False, indent=0) + ';\n')
print(len(new), 'entries (+', len(ext), 'in 1기 groups),', len({e['g'] for e in new}), 'people,', len(cat), 'total; cid', min(cidOf.values()), '~', max(cidOf.values()))
