# v8.9.3 페이지 — page8930.py v1.0 (v1.0: 대화용 스프라이트 다섯 — 노숙악마 · 헌팅나이프 · 카밀라 (도감에 원래 있던 인물) + 암계 중간보스 반 · 테리 — 대화 그림표 (TALK_ART) 와 이름표 (TALK_WHO) 에 등록만 · 싸움에는 안 걸었음 · 버전)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8920.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.9.2 (2026-10-23)', '<!-- 굴의 전투판 v8.9.3 (2026-10-23)')
rep('     v8.9.2: 각펄 전용맵 (', '''     v8.9.3: 대화용 스프라이트 다섯 (민수 — "노숙악마, 심계소령 헌팅나이프, 카밀라는 도감에 원래 있음. 대화용 스프라이트야 + 프로필용" · "암계중간보스 반 / 테리 — 반이 대검, 테리가 망치"):
         노숙악마 (C-145) · 헌팅나이프 (C-290) · 카밀라 (C-291) · 반 (C-322) · 테리 (C-323) 의 투명 바탕 그림을 대화 그림표 (TALK_ART) 에, 이름 → 인물 (TALK_WHO) 에 올림. 이름만 있는 대사 줄이 이 그림을 씀. 반 · 테리는 도감에 새 인물 (암계 중간보스) — 싸움 · 층 · 무리에는 아직 안 걸었음 (abyss_draft_v1.1.js 초안만).
     v8.9.2: 각펄 전용맵 (''')
for a, b in (('h1::after{content:" v8.9.2"', 'h1::after{content:" v8.9.3"'), ('<footer>굴의 전투판 v8.9.2', '<footer>굴의 전투판 v8.9.3'), ('return `굴의 전투판 v8.9.2 · ${title}', 'return `굴의 전투판 v8.9.3 · ${title}'),
             ("copyText('굴의 전투판 v8.9.2 자동 판 기록", "copyText('굴의 전투판 v8.9.3 자동 판 기록"), ("o.push(`굴의 전투판 v8.9.2 — ${C.run", "o.push(`굴의 전투판 v8.9.3 — ${C.run"),
             ('의 버전 기록에 — v8.9.2 각펄 전용맵 /', '의 버전 기록에 — v8.9.3 대화용 스프라이트 다섯 / v8.9.2 각펄 전용맵 /'),
             ('">v8.9.2 · 각펄 전용맵 (무너진 다리)</span>', '">v8.9.3 · 대화용 스프라이트 다섯 (노숙악마 · 헌팅나이프 · 카밀라 · 반 · 테리)</span>'),
             ("ver: '8.9.2', kind:", "ver: '8.9.3', kind:"), ("RULES_MIG = '8.9.2',", "RULES_MIG = '8.9.3',")):
    rep(a, b)
rep("'C-215': ['talk/pearl_t1', 'talk/pearl_t2', 'talk/pearl_t3', 'talk/pearl_t4'] });", "'C-215': ['talk/pearl_t1', 'talk/pearl_t2', 'talk/pearl_t3', 'talk/pearl_t4'],\n  'C-145': ['talk/nosuk_t1'], 'C-290': ['talk/huntknife_t1'], 'C-291': ['talk/kamilla_t1'], 'C-322': ['talk/ban_t1'], 'C-323': ['talk/teri_t1'] });   /* v8.9.3 노숙악마 · 헌팅나이프 · 카밀라 · 암계 중간보스 반 · 테리 (도감 v2.17 — 투명 바탕 · abyss/make2.py) */")
rep("'페흐토': 'C-108' };", "'페흐토': 'C-108', '노숙악마': 'C-145', '헌팅나이프': 'C-290', '카밀라': 'C-291', '반': 'C-322', '테리': 'C-323' };")
open(F, 'w', encoding='utf-8').write(s)
print('page8930 OK')
