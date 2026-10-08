# sync_names.py v1.0 — 도감 본명 → 게임 이름 (2026-10-08)
#  본명 = 도감에서 고친 이름 (marks[C-…].name) > 도감 목록 이름 (catalog sub 첫 칸). 괄호 ( … ) 는 꼬리표라 뗌 (3성 · 보스 · 펫 …)
#  어느 게임 인물이 어느 도감 인물인지: 2 · 3기 = 도감 그림 번호 'X-h2-<slug>' · 적 그림 = tools/foe_art.py 의 원본 · 2D 옛 적 = 'O-<키>-' · 나머지는 아래 MAP
#  출력: src/names.js — const BONMYEONG = { 게임 키: 본명 } + 불러올 때 DEFS · H2R · HERO_DEF 이름을 바꿔 씀
#  실행: python3 tools/sync_names.py [도감 marks 내려받은 폴더]   (폴더를 주면 도감에서 고친 이름을 먼저 씀)
import os, re, json, sys, glob
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); CODEX = os.path.join(os.path.dirname(ROOT), 'codex')
MAP = {   # 그림 번호로 못 잇는 게임 인물 → 도감 인물 번호
    'player': 'C-001', 'cheong': 'C-004', 'cheongAlly': 'C-004', 'cheongNpc': 'C-004', 'karius': 'C-003', 'kariusAlly': 'C-003',
    'rebeccaAlly': 'C-002', 'goodwill': 'C-010', 'foeDevil': 'C-068', 'foeFairy': 'C-069', 'foeCultist': 'C-064', 'foeJelly': 'C-065',
    'ratKnight': 'C-059', 'ratKnightV': 'C-059', 'ratV': 'C-270', 'goldknightAlly': 'C-198', 'snail': 'C-037',
}
KEEP = {'h2:ratvet', 'h2:ahae_wraith', 'h2:levi_beast'}   # 게임만의 변형 · 소환수 이름은 그대로 (쥐 베테랑 = 쥐 기사가 자란 것)
base = lambda n: re.sub(r'\s*\([^)]*\)', '', n).strip()

def main():
    s = open(os.path.join(CODEX, 'catalog.js'), encoding='utf-8').read(); cat = json.loads(s[s.index('['):s.rindex(']') + 1])
    sub, src2cid, h2c, old = {}, {}, {}, {}
    for e in cat:
        c = e.get('cid')
        if not c: continue
        sub.setdefault(c, e['sub'].split(' · ')[0]); src2cid[e['src']] = c
        m = re.match(r'^[OPF]-h2-([A-Za-z0-9]+?)(?:-|$)', e['id'])
        if m: h2c.setdefault(m.group(1), c)
        m = re.match(r'^O-([A-Za-z]+)-', e['id'])
        if m and m.group(1) != 'h2': old.setdefault(m.group(1), set()).add(c)
    marks = {}
    if len(sys.argv) > 1:
        for f in glob.glob(os.path.join(sys.argv[1], '**', 'C-*.json'), recursive=True):
            v = json.load(open(f, encoding='utf-8')); d = v.get('data', v)
            if d.get('name'): marks[os.path.basename(f)[:-5]] = d['name']
    name = lambda c: base(marks.get(c) or sub[c])
    out = {}
    r = open(os.path.join(ROOT, 'src', 'h2_roster.js'), encoding='utf-8').read(); H2R = json.loads(r[r.index('{'):r.rindex('}') + 1])
    for slug in H2R:
        if 'h2:' + slug in KEEP or slug not in h2c: continue
        out['h2:' + slug] = name(h2c[slug])
    fa = open(os.path.join(HERE, 'foe_art.py'), encoding='utf-8').read()
    for k, pose, p in re.findall(r"\('(\w+)', '(\w+)', '([^'@][^']*)'\)", fa):
        c = src2cid.get('img/' + p)
        if c and k not in out: out[k] = name(c)
    for k, cs in old.items():
        if len(cs) == 1 and k not in out: out[k] = name(next(iter(cs)))
    for k, c in MAP.items():
        if c in sub: out[k] = name(c)
    js = ('/* names.js v1.0 — tools/sync_names.py 가 만듦 (손으로 고치지 말 것). 도감 본명 → 게임 이름\n'
          '   본명 = 도감에서 고친 이름 > 도감 목록 이름, 괄호 꼬리표는 뗌. 2 · 3기 명단 (H2R)은 이름 뒤 설명 괄호를 그대로 둠 */\n'
          "'use strict';\n"
          'const BONMYEONG = ' + json.dumps(dict(sorted(out.items())), ensure_ascii=False, separators=(',', ':')) + ';\n'
          '(function(){\n'
          "  const swap = (old, nm) => { const m = /^(.*?)\\s*(\\(.*\\))?\\s*$/.exec(old || ''), b = m[1], tail = m[2] || '', extra = b !== nm && b.startsWith(nm) ? b.slice(nm.length).trim() : '';\n"
          "    return nm + (extra || tail ? ' (' + [extra, tail.slice(1, -1)].filter(Boolean).join(' · ') + ')' : ''); };\n"
          '  for (const [k, nm] of Object.entries(BONMYEONG)){\n'
          "    if (k.startsWith('h2:')){ const s = k.slice(3); if (typeof H2R === 'undefined' || !H2R[s]) continue;\n"
          "      const was = H2R[s].name; H2R[s].name = swap(was, nm);\n"
          "      for (const p of ['h2_', 'h2e_']) if (DEFS[p + s]) DEFS[p + s].name = nm;\n"
          "      if (typeof SOLP !== 'undefined' && SOLP['h2_' + s] && SOLP['h2_' + s].pas && SOLP['h2_' + s].pas[0] === was) SOLP['h2_' + s].pas[0] = H2R[s].name; }\n"
          '    else if (DEFS[k]) DEFS[k].name = nm;\n'
          '  }\n'
          "  if (typeof HERO_DEF !== 'undefined') for (const h of Object.values(HERO_DEF)) if (h.unit && BONMYEONG[h.unit]) h.name = BONMYEONG[h.unit];\n"
          '})();\n')
    open(os.path.join(ROOT, 'src', 'names.js'), 'w', encoding='utf-8').write(js)
    print(f'게임 인물 {len(out)}명 · 도감에서 고친 이름 {len(marks)}명')

if __name__ == '__main__': main()
