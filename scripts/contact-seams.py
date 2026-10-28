"""Optional Pillow/FFmpeg QA tool: compare browser recordings, never regenerate artwork.
Usage: python3 scripts/contact-seams.py --root review-results/seams --after after
"""
import argparse
import json
import subprocess
import tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--root', type=Path, default=Path('review-results/seams'))
parser.add_argument('--before', default='before')
parser.add_argument('--after', default='after')
parser.add_argument('--sequence', action='store_true', help='Also inspect every recorded frame around MacBook/compact seams')
args = parser.parse_args()
out = args.root / 'comparisons'
out.mkdir(parents=True, exist_ok=True)
font = ImageFont.truetype('DejaVuSans.ttf', 16)
offsets = [-200, 0, 100, 250, 500, 1000]

def board(entries, path, width=320, height=225, columns=6):
    result = Image.new('RGB', (width * columns, (height + 30) * ((len(entries) + columns - 1) // columns)), '#0b1712')
    draw = ImageDraw.Draw(result)
    for i, (file, label) in enumerate(entries):
        image = ImageOps.contain(Image.open(file).convert('RGB'), (width, height))
        x, y = i % columns * width, i // columns * (height + 30)
        draw.text((x + 6, y + 5), label, font=font, fill='#eae8df')
        result.paste(image, (x + (width - image.width) // 2, y + 30))
    result.save(path, quality=91)

for size in ['1440x900', '1512x982', '2560x1080', '390x844', '390x664']:
    phone = size.startswith('390')
    for seam in ['intro', 'click', 'awakening', 'macro']:
        entries = [(args.root / stage / size / f'exact-{seam}-{ms}.png', f'{label} {ms:+}ms') for stage, label in [(args.before, 'before'), (args.after, 'after')] for ms in offsets]
        if all(path.exists() for path, _ in entries):
            board(entries, out / f'{size}-{seam}.jpg', 195 if phone else 320, 422 if phone else 225)
    if not args.sequence or size not in ['1512x982', '390x664']:
        continue
    for stage in [args.before, args.after]:
        folder = args.root / stage / size
        events = json.loads((folder / 'events.json').read_text())['events']
        first = json.loads((folder / 'frame-times.json').read_text())['frames'][0]['time']
        for seam in ['click', 'awakening', 'macro']:
            if seam == 'click':
                event = next(e for e in events if e['type'] == 'click')
            elif seam == 'macro':
                event = next((e for e in events if e['type'] == 'macro-entry'), None)
                if not event:
                    continue
            else:
                event = next(e for e in events if e['type'] == 'ended' and e.get('src', '').endswith('awakening.mp4'))
            start = max(0, event['wall'] / 1000 - first - .2)
            with tempfile.TemporaryDirectory() as temp:
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(start), '-i', str(folder / 'transition.mp4'), '-vf', 'fps=30', '-frames:v', '42', str(Path(temp) / '%03d.png')], check=True)
                entries = [(path, f'{-200 + i * 1000 / 30:+.0f}ms') for i, path in enumerate(sorted(Path(temp).glob('*.png')))]
                board(entries, out / f'{stage}-{size}-{seam}-30fps.jpg', 195 if phone else 320, 332 if phone else 208)
print(f'Saved timestamp comparisons to {out}')
