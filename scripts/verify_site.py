#!/usr/bin/env python3
"""Sanity checks for a static portfolio before GitHub/Vercel release."""
from pathlib import Path
from html.parser import HTMLParser
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
issues = []
required = ['index.html','main.js','styles.css','site-config.js','assets/portrait/faliq-main.webp','assets/Faliq_Azhar_CV.pdf','motion-v15.js','assets/icons.svg']
for name in required:
    if not (ROOT/name).is_file(): issues.append(f'Missing: {name}')

class RefParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        key = 'src' if tag in ('img','script') else 'href' if tag in ('a','link') else None
        if key and attrs.get(key):
            link = attrs[key].split('?',1)[0].split('#',1)[0]
            if link and not link.startswith(('http:','https:','mailto:','tel:','data:','//','/')):
                if not (ROOT/link).is_file(): issues.append(f'Missing referenced file: {link}')

html = (ROOT/'index.html').read_text(encoding='utf-8')
js = (ROOT/'main.js').read_text(encoding='utf-8')
config = (ROOT/'site-config.js').read_text(encoding='utf-8')
RefParser().feed(html)
sprite = ROOT / 'assets/icons.svg'
if sprite.is_file():
    try:
        symbols = {element.get('id') for element in ET.parse(sprite).iter() if element.tag.endswith('symbol')}
        for name in re.findall(r'href="assets/icons\.svg#([^\"]+)"', html):
            if name not in symbols: issues.append(f'Missing SVG icon: {name}')
    except ET.ParseError as error:
        issues.append(f'Invalid SVG sprite: {error}')
for asset in re.findall(r'assets/gallery/[^\"\']+\.webp',js):
    if not (ROOT/asset).is_file(): issues.append(f'Missing gallery asset {asset}')
for asset in re.findall(r'assets/certificates/[^\"\']+\.webp',js):
    if not (ROOT/asset).is_file(): issues.append(f'Missing certificate asset {asset}')
for target in ('https://wa.me/6281395118142','mailto:faliqazhar94@gmail.com','https://www.instagram.com/ar_faliq/'):
    if target not in html: issues.append(f'Contact link absent from HTML: {target}')
for target in ('faliqazhar94@gmail.com', '6281395118142', 'ar_faliq'):
    if target not in config: issues.append(f'Contact config mismatch: {target}')
if not re.search(r'id="detailModal"',html): issues.append('Detail popup missing')
if issues:
    print('FAILED:',*issues,sep='\n- ')
    sys.exit(1)
print('PASS: required files, referenced assets, SVG icons, popup and contact URLs verified.')
