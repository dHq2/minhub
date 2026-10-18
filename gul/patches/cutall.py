# 새 대화 그림 배경 지우기 묶음 — cutall.py v1.0 (도감 dogam_dl2/img/talk → _cut/ · 사람마다 설정: 세르파는 흰 옷이라 섬 지우기 끔 · 가까운 색 좁게)
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from talkcut import cut
D = os.path.dirname(os.path.abspath(__file__)) + '/'
OPT = { 'serpa': dict(near=12, isl=False), 'bel': dict(isl=False), 'rebecca': dict(near=18, isl=False) }
n = sys.argv[1]
k = n.split('_')[0]
print(n, cut(D + 'dogam_dl2/img/talk/' + n + '.webp', D + '_cut/' + n + '.webp', **OPT.get(k, {})))
