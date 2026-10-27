#!/usr/bin/env python3
"""dist/battle.html 을 Artifact 게시용 조각(<title>+<style>+본문)으로 바꾼다.
게시 도구가 doctype/html/head/body 를 직접 감싸므로 그 태그들은 뺀다.  출력: dist/battle.artifact.html"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / 'dist' / 'battle.html').read_text(encoding='utf-8')
style = re.search(r'<style>.*?</style>', src, re.S).group(0)
body = re.search(r'<body>(.*)</body>', src, re.S).group(1)
out = '<title>굴 전투판</title>\n' + style + '\n' + body
(root / 'dist' / 'battle.artifact.html').write_text(out, encoding='utf-8')
print('artifact 조각 생성: dist/battle.artifact.html', round(len(out.encode()) / 1e6, 2), 'MB')
