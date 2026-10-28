"""Outline the existing Cormorant brand text to remove a cold webfont dependency.
Optional tooling: pip install fonttools. Font artwork is the same OFL Cormorant face already shipped.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

root = Path(__file__).resolve().parent.parent
font = TTFont(root / 'node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
advance = 0
paths = []
boxes = []
for char in 'pie.pe':
    name = cmap[ord(char)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)
    bounds = BoundsPen(glyphs)
    glyphs[name].draw(bounds)
    x0, y0, x1, y1 = bounds.bounds
    boxes.append((x0 + advance, y0, x1 + advance, y1))
    paths.append(f'<path transform="translate({advance} 0)" d="{pen.getCommands()}"/>')
    advance += font['hmtx'][name][0] - round(font['head'].unitsPerEm * .06)
x0 = min(b[0] for b in boxes) - 8
y0 = min(b[1] for b in boxes) - 8
x1 = max(b[2] for b in boxes) + 8
y1 = max(b[3] for b in boxes) + 8
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {-y1} {x1-x0} {y1-y0}"><g fill="#EAE8DF" transform="scale(1 -1)">{"".join(paths)}</g></svg>\n'
(root / 'public/brand-wordmark.svg').write_text(svg)
print('Outlined existing brand glyphs:', len(svg), 'bytes')
