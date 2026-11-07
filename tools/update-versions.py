#!/usr/bin/env python3
"""Refresh the ?v=... cache-busting numbers in every page.

GitHub Pages lets browsers keep a file for 10 minutes. Each page loads its CSS/JS as
"assets/<file>?v=<first 8 chars of the file's md5>", so a changed file gets a new address and
visitors download it at once. Run this after editing anything in assets/ and before committing:

    python3 tools/update-versions.py
"""
import hashlib, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
pattern = re.compile(r'(assets/[\w./-]+\.(?:css|js))\?v=\w+')

def digest(rel):
    return hashlib.md5((root / rel).read_bytes()).hexdigest()[:8]

for page in sorted(root.glob('*.html')):
    text = page.read_text(encoding='utf-8')
    new = pattern.sub(lambda m: f'{m.group(1)}?v={digest(m.group(1))}', text)
    if new != text:
        page.write_text(new, encoding='utf-8')
        print('updated', page.name)
    for m in pattern.finditer(new):
        print(f'  {page.name}: {m.group(0)}')
