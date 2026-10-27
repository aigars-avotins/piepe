# PIE.PE 2.1 — Brand palette & downloadable wallpapers

Status: **design brief only**. Do not begin or deploy PIE.PE 2.1 until Codex finishes and deploys v2.0 (#2). This document is part of [Issue #3](https://github.com/aigars-avotins/piepe/issues/3).

## 1. Canonical identity palette — approved site-wide

The brand-icon palette is now the **canonical design language across the website**, not just the favicon:

| Design token | HEX | Usage |
| --- | --- | --- |
| `--color-forest` | `#0B1712` | Deep forest foundation / video fallback / main background |
| `--color-moss` | `#7D9075` | Secondary accents, understated controls, nature |
| `--color-amber` | `#A96D3B` | Bracket-fungus warmth / a single restrained interactive highlight |
| `--color-ivory` | `#F2D7A2` | Warm label/highlight tones / fungus ridges |
| `--color-offwhite` | `#EAE8DF` | Reading text / readable editorial typography |
| `--color-amber-alt` | `#B8824B` | Second-layer amber when needed for brand illustration |

Derived darker/lighter shades permitted for contrast and states, but do not introduce unrelated neon hues, generic gradients or glossy UI palettes. Review all sections, video/still overlays, typography, navigational controls, discovery microinteractions, accessible focus, language switch, SEO facts, outro, icons, metadata/theme color, social sharing preview and wallpaper previews for visual consistency. Preserve actual forest video grading; never apply aggressive CSS filters to make the footage match nominal hex colors.

Source of the mark:
- `design/piepe-mark.svg`
- `design/piepe-favicon.svg`
- `design/piepe-mark-monochrome.svg`

## 2. Wallpaper feature — quiet final gift

Place an unobtrusive **wallpaper gallery/download section near the very bottom**, after the core experience and educational discovery, before the footer or integrated into the outro. This is a small gift to visitors, **not** a sales funnel, modal, newsletter form or large product grid.

Editorial UI:
- Latvian default: heading e.g. `Paņem gabaliņu meža līdzi.`; small optional supporting label `Tapetes tavam ekrānam.` (refine in editorial context).
- English: `Take a little forest with you.`; `Wallpapers for your screen.`
- Exactly two elegantly presented choices: **Datoram / Desktop** and **Telefonam / Phone**.
- One restrained preview each with a clear accessible direct download control. Support keyboard and mobile touch. No unnecessary descriptive paragraphs.
- Keep the website's art-first, quiet design and responsive composition; don't compete with the cinematic outro.

### Finished downloadable image aesthetic
- Use the **same real PIE.PE forest imagery** (original video frames, forest-mobile reference) and matching grading. Prefer one coherent wallpaper series rather than unrelated AI forest images or fake photorealistic renders.
- **No inspirational quote, slogan, UI text, or extra captions baked into the images.**
- Only the **original PIE.PE stylized bracket-fungus brand icon** plus a very discreet `pie.pe` signature (the URL/domain exactly, not an oversized tagline or additional text). Compositionally integrate mark and URL as a single small signed lockup in a dark quiet corner; appropriate contrast but unobtrusive. Use original vector mark, not raster-upscaled favicon; avoid covering actual fungus or foreground detail.
- Desktop composition: dramatic high-res photo with the visible fungus as focal subject, ample dark forest negative space for desktop icons, logo signature in a quiet lower corner with **minimum ~4% edge safe area**, test against common Mac/Windows icon/dock/taskbar placement.
- Mobile composition: vertical photo with fungus preserved, dark/relatively quiet top ~25–30% (clock, widgets) and bottom ~12–15% (lockscreen controls/gesture), logo+domain located outside clock/lock controls and outside the fungus; visually test iPhone-style lockscreen and Android-style desktop crop. Do not bake phone UI overlays into wallpapers.
- Respect the original cinematic dark-forest/amber/moss palette.

### Output dimensions and formats
Generate *real image files* at these pixel dimensions (not screenshots of the site):
- **Desktop 5K**: `public/wallpapers/piepe-forest-desktop-5120x2880.jpg` (5120×2880, 16:9).
- **Desktop 4K**: `public/wallpapers/piepe-forest-desktop-3840x2160.jpg` (3840×2160, 16:9), either generated from 5K master or same master source.
- **Mobile Retina**: `public/wallpapers/piepe-forest-mobile-1440x3120.jpg` (1440×3120, 9:19.5). May additionally ship a 9:16 2160×3840 option only if it improves compatibility and doesn't clutter UI.
- Preview thumbnails in `public/wallpapers/previews/` as optimized WebP/AVIF; lazy loaded, set width/height to avoid CLS. Keep full downloadable images out of preload and out of the initial video critical path.
- Save asset source/processing notes, design tokens, and a screenshot of preview placement. Use deterministic repeatable generation/build scripts if feasible; no hidden external generation dependency on deployment.

**Source-resolution honesty:** Existing footage is primarily 1920×1080 and `forest-mobile.webp` ~1143×2048; output 4K/5K/mobile dimensions require careful upscaling or new high-resolution creative work. A simple naive resize does NOT add real detail. Use quality-aware superresolution/upscale where available and inspect actual 100% crops for blur, AI hallucinated mushroom geometry, compression and banding. Do not claim *native 5K* if material was enlarged. If suitable enlargement cannot be made in Codex's environment, report this before deploying the wallpaper feature; request owner-produced high-res assets if necessary rather than publishing substandard files.

### Delivery and interaction
- Direct links should download files without registration, emails, third-party redirects or trackers, e.g. `<a href="/wallpapers/piepe-forest-desktop-5120x2880.jpg" download>`.
- Desktop selection may default to 5K; offer 4K as a small secondary resolution choice, not an additional major gallery card.
- Clicking download must not reset the scene, replay intro, switch language, or navigate away from the experience. On browsers that render the image instead, offer a compact "save image" hint after user action.
- Keep both LV/EN UI localized through site i18n. Signature baked into wallpaper remains `pie.pe` in both.
- Static files under `/wallpapers/` should be served through existing Cloudflare Workers Static Assets unchanged; no new Worker, no API/backend, and no breaking changes to `/media/*` byte ranges or /en/ SEO.
- Choose appropriate cache headers; large image files must not be prefetched on the hero. Direct GET returns 200, correct `image/jpeg`, correct dimensions; mobile Safari/desktop Chrome/Firefox fallback verified.

## 3. Done when

- Palette is consistent throughout all v2.1 UI and graphical identity and remains accessible.
- Wallpaper section feels like a small thoughtful gift, near page's end, two minimal options, complete LV/EN.
- Finished art uses the original forest and official fungus mark with only a small `pie.pe` signature, no extra text.
- Output sizes 5120×2880, 3840×2160, 1440×3120 verified by image inspection; sharpness/quality inspected at 100%.
- Visitors can download without account; filenames, mime, 200, actual image bytes, direct link, mobile usability all tested.
- Lazy previews, no large downloads on landing entry, correct sitemap/SEO unaffected.
- Production rollout remains **blocked until #2 completed and deployed**; after that, apply new v2.1 work to latest main, build/test and deploy only existing `piepe` Worker.
