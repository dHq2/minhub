# m10_poses.py v1.0 — 잡몹 10명 동작 그림 (드라이브 '10.08 1차업뎃 / 1차적 10인' 34장) 을 도감 인물 칸에 넣음
#  · 그림: img/m10/<키>__<동작>.webp (자른 칸 그대로, 긴 변 520 넘으면 줄임) — cave-3d/tools/mob10_art.py 가 이 그림으로 게임 묶음 그림을 만듦
#  · 항목: O-m10-<키>-<동작> — 그 인물이 원래 있던 묶음 (cid · g) 끝에 붙음
#  · 처음 한 번: python3 codex/tools/m10_poses.py <자른 칸 폴더> <map10.json>  (자르기: 1차 업뎃 cut.py v1.6 · map10.py)
#    그 뒤: python3 codex/tools/m10_poses.py  (그림은 그대로 두고 항목만 다시 씀)
#  · 뺀 칸: 워킹3 (그림체가 다름) · 옆 인물 무기가 겹쳐 잘린 칸 (검사 · 검방패병 점프 · 공격3, 다섯 명 필살2) · 민수가 X 친 칸 (5인 필살기 효과판 검사 · 궁수)
import os, sys, json
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(ROOT, 'img', 'm10')
MOBS = {   # 게임 키 → (도감 인물 번호, 도감 묶음 g)
    'swordsman': ('C-052', 'swordsman'), 'shieldman': ('C-054', 'shieldman'), 'archer': ('C-056', 'archer'), 'spearman': ('C-053', 'spearman'),
    'foeCultist': ('C-064', 'cultist'), 'foeDevil': ('C-068', 'little_devil'), 'bkShield': ('C-141', 'N-005'), 'bkSpear': ('C-164', 'N-056'),
    'gwangnyang': ('C-092', 'kwangnyang'), 'bluefat': ('C-079', 'bluefat')}
PN = {'idle': ('기본', '기본'), 'walk1': ('걷기 1', '워킹확정1'), 'walk2': ('걷기 2', '워킹확정2'), 'walk4': ('걷기 3', '워킹44'), 'walk5': ('걷기 4', '투명 배경의 오른쪽을 보는 10종'),
      'run1': ('질주 1', '질주1'), 'run2': ('질주 2', '질주2'), 'run3': ('달리기', '오른쪽을 향한 10인 전투'), 'jump': ('점프 · 뛰기 중간', '점프&뛰기중간'),
      'ready': ('공격 대기', '공격대기'), 'windup': ('공격 준비', '10인 전투 캐릭터의 공격 준비'), 'attack1': ('기본 공격 1', '10인 기본 공격'), 'attack2': ('기본 공격 2', '기본공격'),
      'attack3': ('기본 공격 3', '10인 판타지 전투 캐릭터'), 'recover': ('공격 후 회복', '공격 후 무기들의 회복 자세'), 'spwind': ('특수 준비', '특공준비'), 'special2': ('특수 공격', '특공2'),
      'pose3': ('포즈 3', '포즈3'), 'fin1': ('필살 1', '필살포즈1'), 'fin2': ('필살 2', '필살포즈2'), 'ult': ('궁극기', '고풍스러운 5인 궁극기'), 'ultfx': ('궁극기 (효과)', '다섯 전사의 필살기'),
      'hurt1': ('맞음 1', '피격1'), 'hurt2': ('맞음 2', '피격2'), 'stun': ('기절', '스턴'), 'guard': ('방어', '방어'), 'guard2': ('확실 가드', '확실 가드'), 'crouch': ('웅크림', '크라우치'),
      'rest1': ('쉬기 1', '쉼1'), 'rest2': ('쉬기 2', '쉼2'), 'rest3': ('휴식', '열 전사의 개성 넘치는 휴식'), 'dead': ('쓰러짐', '바닥에 누운 열 명'), 'dead2': ('사망', '사망2')}
SKIP = {('swordsman', 'jump'), ('swordsman', 'attack3'), ('shieldman', 'jump'), ('shieldman', 'attack3'), ('swordsman', 'ultfx'), ('archer', 'ultfx'),
        ('spearman', 'fin2'), ('foeCultist', 'fin2'), ('bkSpear', 'fin2'), ('gwangnyang', 'fin2'), ('bluefat', 'fin2')}
# 게임에서 쓰는 곳 (cave-3d/tools/mob10_art.py 의 USE 와 맞춤)
GAME = {'idle': '서 있을 때', 'ready': '싸움 중 서 있을 때', 'walk1': '걷기 (4장 중 둘째)', 'walk2': '걷기 (넷째)', 'walk4': '걷기 (첫째)', 'walk5': '걷기 (셋째)',
        'run1': '달리기', 'run2': '달리기', 'run3': '달리기 (점프 그림이 없을 때)', 'jump': '달리기 가운데 · 뒤로 도약', 'windup': '공격 예고', 'attack2': '공격 (치는 순간)', 'attack3': '공격 (다른 모양)',
        'recover': '공격 뒤', 'spwind': '고유 기술 예고', 'hurt1': '맞음', 'hurt2': '맞음 (다른 모양)', 'stun': '기절 · 오래 휘청', 'guard': '막기 (정면에서 막을 때)', 'crouch': '웅크림 · 쉬다 일어날 때',
        'rest1': '모닥불 곁에서 쉼', 'rest2': '모닥불 곁에서 쉼', 'rest3': '모닥불 곁에서 쉼', 'dead': '죽음 (누움)', 'dead2': '죽음 (다른 모양)'}
SPECIAL = {'swordsman': 'ult', 'shieldman': 'ultfx', 'archer': 'fin1', 'spearman': 'ultfx', 'foeCultist': 'ultfx', 'foeDevil': 'special2', 'bkShield': 'special2', 'bkSpear': 'special2', 'gwangnyang': 'special2', 'bluefat': 'special2'}

def main():
    P = os.path.join(ROOT, 'catalog.js'); s = open(P, encoding='utf-8').read(); key = 'const CATALOG = '
    head = s[:s.index(key) + len(key)]; cat = json.loads(s[len(head):].strip().rstrip(';'))
    old = {e['id']: e for e in cat if e['id'].startswith('O-m10-')}; cat = [e for e in cat if not e['id'].startswith('O-m10-')]
    if len(sys.argv) > 2:   # 자른 칸 → img/m10
        CUT, MAP = sys.argv[1], json.load(open(sys.argv[2], encoding='utf-8')); os.makedirs(OUT, exist_ok=True); n = 0
        for k, poses in MAP.items():
            for p, q in poses.items():
                if p not in PN or (k, p) in SKIP: continue
                im = Image.open(os.path.join(CUT, q['src'])).convert('RGBA'); m = max(im.size)
                if m > 520: im = im.resize((round(im.width * 520 / m), round(im.height * 520 / m)), Image.LANCZOS)
                im.save(os.path.join(OUT, f'{k}__{p}.webp'), 'WEBP', quality=90, method=4); n += 1
        print('그림', n, '장 →', OUT)
    # 항목: 인물 묶음마다 원래 항목 바로 뒤에 붙임
    new = {}
    for k, (cid, g) in MOBS.items():
        base = next((e for e in cat if e.get('cid') == cid), None); sub = base['sub'] if base else ''
        nm = (base['sub'].split(' · ')[0] if base else k)
        for p, (label, sheet) in PN.items():
            f = os.path.join(OUT, f'{k}__{p}.webp')
            if not os.path.exists(f): continue
            use = GAME.get(p) or ('고유 기술 (치는 순간)' if SPECIAL.get(k) == p else None)
            e = dict(old.get(f'O-m10-{k}-{p}', {})); keep = {x: e[x] for x in ('on', 'pin') if x in e}
            e.update({'id': f'O-m10-{k}-{p}', 'cat': 'char', 'sub': sub, 'cid': cid, 'g': g, 'name': f'{nm} · {label}', 'src': f'img/m10/{k}__{p}.webp',
                      'note': f"1차 업뎃 (드라이브 '10.08 1차업뎃 / 1차적 10인', 2026-10-08) · 시트 '{sheet}'", 'rank': '', 'on': True,
                      'game': '게임: ' + use if use else '게임: 아직 안 씀 (예비 동작)'})
            e.update(keep); new.setdefault(cid, []).append(e)
    last = {}
    for i, e in enumerate(cat):
        if e.get('cid') in new: last[e['cid']] = i
    out = []
    for i, e in enumerate(cat):
        out.append(e)
        for c, j in last.items():
            if j == i: out.extend(new[c])
    for c, es in new.items():
        if c not in last: out.extend(es)
    if 'v1.89:' not in head: head = head.replace('/* catalog.js v1.88 — ', "/* catalog.js v1.89 — v1.89: 잡몹 10명 동작 그림 (드라이브 '1차적 10인', tools/m10_poses.py). ", 1)
    open(P, 'w', encoding='utf-8').write(head + json.dumps(out, ensure_ascii=False, indent=0) + ';\n')
    print('항목', sum(len(v) for v in new.values()), '· 전체', len(out))

if __name__ == '__main__': main()
