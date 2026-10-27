# PIE.PE — supplied wallpaper sources (v2.1)

**Status:** user-generated reference/source artwork approved. On 2026-10-27 the owner REPLACED the old mobile image with a superior near-9:16 portrait. **Source PNG binaries still need to be confirmed in GitHub** before rendering. A fresh complete ZIP with the approved desktop and replacement mobile source has been supplied to the owner. The owner supplied both images to ChatGPT on 2026-10-27. GitHub API from this integration allows text-file writes, not direct forwarding of conversation binary attachments. Upload the two binary PNGs to this directory in GitHub. This README is intentionally committed now so the target folder exists and Codex knows exact filenames.

## Incoming binaries

| Filename | Expected pixels | Actual original dimensions | Description |
| --- | --- | --- | --- |
| `piepe-wallpaper-desktop-source.png` | 2048 × 1143 | 2048 × 1143, RGBA, 3,733,323 bytes | Wide atmospheric spruce forest, broken ancient tree center, small amber bracket fungi, dark left area for desktop icons |
| `piepe-wallpaper-mobile-source.png` | 1143 × 2048 | 1143 × 2048, RGBA, 3,773,735 bytes | OWNER-APPROVED FINAL mobile image: close-up old mossy trunk with layered amber shelf fungi, dark forest above and quiet foreground; nearly exact 9:16 |

These two originals have *no baked logo*, which is intentional. Do not commit the phone crop preview in place of the source master; it is only a cropping test.

## Required next implementation (after PIE.PE 2.0 completes)

Follow [wallpaper & palette brief](../../docs/WALLPAPER_AND_PALETTE.md) and [Issue #3](https://github.com/aigars-avotins/piepe/issues/3).

1. Reuse **these actual owner-provided images**, NOT substitute AI renders or unrelated stock forest.
2. Make 4K/5K desktop and high-resolution phone wallpaper versions with **only** the official styled fungus SVG mark (`design/piepe-mark.svg`) and subtle `pie.pe` branding; no additional slogan or quote.
3. Desktop source is ~16:9 but is NOT native 4K/5K. Apply appropriate crop and careful superresolution/upscale; judge result at 100% before claiming retina quality.
4. **SUPERSEDED:** the previous 1529×2048 3:4 phone image has been REPLACED with a new **1143×2048, almost 9:16** owner-approved image. Its aspect ratio is 0.5581 vs exact 9:16 0.5625; a tiny 8px top and bottom crop makes exact 9:16 without altering the fungus. For the requested 1440×3120 (9:19.5) final lock-screen wallpaper, either carefully extend top/bottom to preserve scene and give extra phone-clock room, or crop with focal-safe framing so the fungus remains fully visible. Do not use the superseded 3:4 image or the previous large horizontal crop. Inspect the small pie.pe logo lockup against clock/UI safe zones.
5. The original approved palette: forest `#0B1712`, moss `#7D9075`, amber `#A96D3B`, ivory `#F2D7A2`. Do not aggressively recolor actual photographic pixels.
6. Final downloadable JPGs + lazy preview images go to `public/wallpapers/` only as part of v2.1 rollout, not during ongoing 2.0 development.

**No production website changes from this README.**
