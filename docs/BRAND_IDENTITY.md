# PIE.PE identity

The approved source is `design/piepe-mark.svg`: layered amber brackets attached to a moss-colored bark stroke. The source artwork remains unchanged. `public/brand-mark.svg` is the transparent site mark; `public/favicon.svg` uses the approved forest background.

| Token | Value | Use |
| --- | --- | --- |
| Forest | `#0B1712` | Ground, fallback, editorial sections |
| Moss | `#7D9075` | Quiet accents; avoid small text on forest |
| Amber | `#A96D3B` | Illustrated fungus, restrained accents |
| Ivory | `#F2D7A2` | Interactive highlights, editorial emphasis |
| Off-white | `#EAE8DF` | Reading text |

Use lighter derived moss for secondary text and ivory/off-white for functional labels. Do not recolor the films to match hex values. Keep at least one-quarter mark width of clear space, except for the compact header lockup. The header uses a 30–40px canvas; the wallpaper signature is deliberately small. Do not use the mark as a repeating decoration.

`favicon.ico` is a real ICO with 16, 32, 48, 64, 128 and 256px entries. SVG is listed after ICO so modern browsers select the smaller scalable resource. Apple Touch is 180px; manifest icons are 192/512px. The manifest is browser mode, with neutral brand-only name. The social image is a 1200×630 crop of the approved desktop artwork with the same signature.

Reproduce the committed images with Python/Pillow, DejaVu Sans and the installed npm Playwright package:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium python3 scripts/brand-assets.py
```

Omit the executable override when bundled Chromium is installed. Artwork processing is optional tooling, not a production dependency; image generation is not part of deployment. Approved SVG is rasterized by Chromium; wallpaper crops use Lanczos with a mild unsharp mask and JPEG quality 94 / 4:4:4. No external generative service, additional slogan, species label or invented forest image is used.

The desktop sources are 2048×1143 and the phone source is 1143×2048. The 5K/4K and 1440×3120 files are careful enlargements, **not native high-resolution photographs or AI superresolution**. Desktop is center-cropped by a few source pixels. Phone retains a 945×2048 crop at approximately source x=119…1064, keeping the fungus intact. For 2.2, the owner requested a more visible signature: the mark spans 3.1% of desktop width and 6% of phone width; the word size is 1.65%/3.3% respectively. This is approximately 40%/33% larger than 2.1. The signature sits at 82% height on the phone, outside clock and lockscreen-control areas. Desktop has a 5% right margin and roughly 5.5% bottom safety. Inspect 100% subject/signature crops whenever regenerating; no resize can recover absent source detail.

The gallery uses two lazy WebP previews and direct same-origin downloads. Large JPEGs are never preloaded. A localized save-image hint appears only after a download action. Site screenshots and full-resolution crop review are recorded in the task's review artifacts; see the release QA document for the tested environment and limits.
