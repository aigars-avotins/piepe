# PIE.PE 2.1 — React Bits suitability and implementation guide

## Verdict
React Bits is suitable as a selective **source of interaction patterns** for this existing React 19 + TypeScript + GSAP site. Use 1–3 small ideas in a production-tested way. It is **not** a new site framework, forest renderer or cinematic asset generator.

Source: https://github.com/DavidHDev/react-bits (reviewed 2026-10-27) and https://reactbits.dev

**License:** MIT + Commons Clause; using/adapting code in a website is permitted, including commercial sites, but DO NOT sell/redistribute the components themselves. When copying substantial source, include author/license notice from their `LICENSE.md`. The GitHub API's SPDX field says NOASSERTION; refer to the actual `LICENSE.md` instead.

## Approved candidate techniques (use only if better than current implementation)

| Priority | Candidate | Source | Use in PIE.PE | Cautions |
| --- | --- | --- | --- | --- |
| P0 | **ScrollReveal** | https://reactbits.dev/text-animations/scroll-reveal | Subtle staggered words/lines in *Understory* and discovery story, scroll-coordinated. Existing GSAP/ScrollTrigger already in app; adapt rather than add duplicate animation controller. | Keep headings accessible to screen readers; no opacity-zero content stuck if JS fails. Respect reduced-motion. |
| P1 | **FadeContent** | https://reactbits.dev/animations/fade-content | Gentle section-enter effects, selectively an atmospheric mist-like mask or light fade to blend media/still sections. | Original component has GSAP, SVG noise masks and filter paths; avoid costly whole-screen animated blur/turbulence, especially on mobile. Existing GSAP may suffice. |
| P1 | **Magnet** | https://reactbits.dev/animations/magnet | Almost imperceptible magnet effect on small desktop CTA/control *only*, if it improves discoverability. | Do NOT move fungus photo, its interactive hotspot or essential focus target. Never disable keyboard or touch controls. |
| P2 experimental | **LightRays** | https://reactbits.dev/backgrounds/light-rays | Optional subtle light shaft in one non-video scene, carefully matched to original video’s sunlight direction. | WebGL2 continuous canvas; likely redundant over existing sunlit footage. Default **OFF** unless A/B quality + performance tests justify. WebGL fallback, low DPR/pixel budget, offscreen pause, no overlapping video decoders. |

## Intentionally reject
- `Particles`: WebGL instanced particles, unnecessary with existing 14 CSS spores; avoid decorative GPU work on video.
- `ClickSpark`, `SplashCursor`, `Aurora`, `DarkVeil`, `Ribbons`, `LetterGlitch`, `PixelTransition`, `GlareHover`, `MagicBento`, card grids: clash with realistic forest style; look like visual demos/gamification.
- `BlurText` currently uses `motion/react`, a new animation stack, while the site already has GSAP; prefer GSAP-native `ScrollReveal` principle instead.
- `SplitText` imports `@gsap/react` and `gsap/SplitText`; consider only if tested and no unnecessary dependency/DOM churn.
- Do not add global animated gradients, autoplay sound or transition overlays that obscure actual bracket fungus.

## Implementation standards
1. Inspect actual React Bits TypeScript/CSS implementation and dependencies before copying. Use small, locally owned components or original GSAP adaptation. The project uses CSS rather than Tailwind.
2. Reuse existing GSAP register and life-cycle. No duplicate ScrollTrigger-driven enters from old `[data-reveal]` **and** adapted code on the same element. Scope timelines and revert/kill on unmount, preference changes and navigation.
3. Video hero and fungus interaction take precedence over aesthetic extras. No wrong depth lighting, unnatural bloom, or permanent cursor trails.
4. Perf budget: monitor frame stability, LCP, JS payload, video network transfers and GPU on 390px mobile. Prefer native CSS/media masking where convincing.
5. Respect `prefers-reduced-motion`, data saving, semantic content and clear focus state; readable small type.
6. QA: before/after screenshots, desktop + mobile, 320px, low-power, unsupported WebGL, keyboard/touch and Safari if possible. Compare total experience **with and without** optional effects and retain only improvements.
7. **Do NOT add `react-bits` as an entire dependency or copy the full library.** Extract only what is selected and document provenance/license. Dependencies must be justified.

## P0 media regression found in latest main
On 2026-10-27, `public/media/forest-reveal.mp4` blob `b6532f81fe9fe067dbf3f5f035fdbbd94928dd62` is **byte-for-byte identical** to `source/forest-reveal-original.mp4` (19,070,653 bytes). This accidentally replaced the previous H.264/yuv420p web rendition (~1,723,128 bytes), and likely reintroduced HEVC/browser compatibility and load costs.

**MUST fix before deployment:** inspect via ffprobe; restore or re-encode from the master to H.264 yuv420p, faststart, muted, ~6.04s, preserve actual matching first/end frames, and verify `forest-final.jpg` / `forest-poster.jpg` remain aligned with decoded optimized MP4. Target ~1.5–3MB. Preserve original only under `source/`. Retest Worker byte-range 206/416 and Safari playback.

New files `forest-awakening.mp4`, `forest-understory.mp4`, `forest-breathing.mp4`, posters and `forest-mobile.webp` ARE already present under `public/media/`. Do not ask the owner to re-upload them or fabricate replacements.
