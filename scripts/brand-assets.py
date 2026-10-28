"""Reproduce approved artwork outputs. Requires Python/Pillow and installed npm Playwright.
Use PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH for a system Chromium; no image-generation service.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import subprocess
import os
import tempfile

root = Path(__file__).resolve().parent.parent
os.chdir(root)
with tempfile.TemporaryDirectory() as tmp:
    os.environ['PIEPE_ART_TMP'] = tmp
    subprocess.run(['node', '--input-type=module', '-e', '''
import { chromium } from 'playwright'; import { readFile } from 'node:fs/promises';
const browser=await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {});
try {for(const [file,out] of [['piepe-mark.svg','mark'],['piepe-favicon.svg','icon']]){
 const page=await browser.newPage({viewport:{width:512,height:512}});
 await page.setContent('<style>body{margin:0;background:transparent}svg{display:block;width:512px;height:512px}</style>'+await readFile('design/'+file,'utf8'));
 await page.screenshot({path:process.env.PIEPE_ART_TMP+'/'+out+'.png',omitBackground:true}); await page.close();
}} finally {await browser.close()}
'''], check=True)
    out = root / 'public'
    (out / 'wallpapers/previews').mkdir(parents=True, exist_ok=True)
    mark = Image.open(Path(tmp) / 'mark.png').convert('RGBA')
    font = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    for kind, w, h in [('desktop', 5120, 2880), ('desktop', 3840, 2160), ('mobile', 1440, 3120)]:
        src = Image.open(f'design/wallpapers/piepe-wallpaper-{kind}-source.png').convert('RGB')
        sw, sh = src.size
        if sw / sh > w / h:
            cw = round(sh * w / h); x = round((sw - cw) * (.60 if kind == 'mobile' else .5))
            src = src.crop((x, 0, x + cw, sh))
        else:
            ch = round(sw * h / w); y = (sh - ch) // 2; src = src.crop((0, y, sw, y + ch))
        im = src.resize((w, h), Image.Resampling.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=4))
        size = round(w * (.022 if kind == 'desktop' else .045)); fs = round(w * (.012 if kind == 'desktop' else .025)); gap = round(size * .12)
        m = mark.resize((size, size), Image.Resampling.LANCZOS); f = ImageFont.truetype(font, fs)
        d = ImageDraw.Draw(im); textw = d.textlength('pie.pe', font=f)
        x = round(w * .95 - size - gap - textw) if kind == 'desktop' else round(w * .06)
        y = round(h * (.89 if kind == 'desktop' else .82))
        im.paste(m, (x, y), m); d.text((x + size + gap, y + size * .36), 'pie.pe', font=f, fill='#EAE8DF', anchor='lt')
        im.save(out / f'wallpapers/piepe-forest-{kind}-{w}x{h}.jpg', quality=94, subsampling=0, optimize=True)
        if w != 3840:
            im.thumbnail((800, 800)); im.save(out / f'wallpapers/previews/{kind}.webp', quality=85, method=6)
    icon = Image.open(Path(tmp) / 'icon.png').convert('RGBA')
    icon.save(out / 'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
    for name, size in [('apple-touch-icon', 180), ('icon-192', 192), ('icon-512', 512)]:
        icon.resize((size,size), Image.Resampling.LANCZOS).save(out / f'{name}.png')
    (out / 'favicon.svg').write_bytes((root / 'design/piepe-favicon.svg').read_bytes())
    (out / 'brand-mark.svg').write_bytes((root / 'design/piepe-mark.svg').read_bytes())
    social = Image.open(out / 'wallpapers/piepe-forest-desktop-5120x2880.jpg')
    w, h = social.size; target_h = round(w * 630 / 1200); social = social.crop((0, (h-target_h)//2, w, (h+target_h)//2)).resize((1200,630), Image.Resampling.LANCZOS)
    social.save(out / 'social-preview.jpg', quality=91, optimize=True)
print('Generated approved icons, three enlarged wallpapers, two previews and social image')
