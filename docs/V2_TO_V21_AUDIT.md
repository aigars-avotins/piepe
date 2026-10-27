# PIE.PE 2.0 → 2.1 — Verified source audit and safe integration plan

Audit date: 2026-10-27. **Issue #2 is CLOSED; 2.0 reported deployed.** Read with [Issue #3](https://github.com/aigars-avotins/piepe/issues/3), [2.0 release QA](V2-QA.md), [cinematic motion guide](CREATIVE_MOTION_GUIDE.md), [React Bits evaluation](REACT_BITS_EVALUATION.md), and [wallpapers and palette](WALLPAPER_AND_PALETTE.md).

**Source-of-truth note:** This audit directly inspected the latest GitHub `main` source, issue #2 completion report, v2 QA, tree and media. Production could not be independently fetched by the reviewer; 2.0 **Codex/CI reported** successful deployment and browser production smoke tests. Do not confuse that with this review reproducing a physical-browser test.

## Baseline facts — protect these features

- 2.0 production Worker **`piepe`**, https://pie.pe; release **`70a6954d-f95c-4703-a142-985829809650`** per 2.0 QA. Final QA commit `9c7e25ad1d6d465bb82104aa57716e7a0436c2d4`; functional/test commit `e6c6cbac55fe0fd69a338684e8177a7bc269f354`. Some later commits added wallpaper/design assets; **always work from current main**, not a pinned 2.0 commit.
- v2.0 is an interactive four-scene forest journey. `src/App.tsx` drives arrival/understory/encounter/return, `src/useForestMotion.ts` drives native-scroll GSAP camera transformations, `src/ForestScene.tsx` composes photography/mist/foreground layers.
- `src/Discovery.tsx` implements a keyboard-accessible modal with three tabbed observations, properly closed/focus-restored, collection status, and `/field-note.txt` downloadable souvenir. **Do not scrap these to play the new awakening video**. Integrate film and factual content *into or adjacent to* existing accessible discovery, preserving focus, Escape, Home/End/arrow keys, touch and field-note flow.
- `src/IntroFilm.tsx` plays the original 6.041667 s first-visit film; skip, explicit replay, failure watchdog, reduced-motion and data-saving fallback exist. Must preserve session-once semantics and matching poster/last still.
- `src/worker.ts` + `src/media-sizes.ts` implement tested bounded-stream HTTP Range (206/416/If-Range/HEAD), handling Cloudflare ASSETS missing `Content-Length`. **Do not simplify/rewrite away** these fixes while adding route localization.
- 2.0 QA: 10 worker, 35 browser and 2 production smoke tests reported; macOS WebKit emulation checked, not physical iPhone. Adopt and expand existing tests under `tests/`, preserve CI and security headers.

## Concrete v2.0 → v2.1 gaps found in ACTUAL source

### P0 — New cinematic videos exist but are not referenced in the UI
- `public/media/forest-awakening.mp4` (1,540,797 bytes), `forest-understory.mp4` (1,372,024 bytes), `forest-breathing.mp4` (1,552,941 bytes) and their stills are already in current `main`.
- `src/App.tsx` and `src/ForestScene.tsx` reference only `forest-reveal.mp4`, `forest-final.jpg`, `forest-poster.jpg` (plus dialog static photo). `src/useForestMotion.ts` only animates static camera layers.
- **Implement** click-triggered one-shot awakening shot, scroll-arriving macro understory, and measured breathing/outro; retain v2's narrative, native scroll and modal keyboard behavior.
- Before changing state: define scene state machine and media lifecycle (poster → video → exact end still; onstage preload only; visibility pause; ended/error/reduced motion fallback; avoiding multiple active decoders). The fungus hotspot MUST stay matched to the actual source framing on portrait, desktop and resized viewports. Never layer two unmatched moving mushrooms through a casual crossfade; inspect recorded transition frames on mobile and desktop.
- The background-film CSS uses absolute positioning with `width:100%;height:100%` within aspect-correct `.media-plane`; new films have independent focal points. Build **per-scene `object-fit:cover`/media-plane and tested object-position** as appropriate to fill entire viewport. **No visible side bars** on MacBook or ultrawide, no distortion/stretching, no clipping of the main fungus. Do not blindly reuse v2 original source-plane geometry for the macro video.

### P0 — Full bilingual UI needed, not just translation of headings
- 2.0 `index.html` sets `<html lang="en">` and English-only title/metadescription/canonical. `src/App.tsx`, `src/Discovery.tsx`, `src/content.ts`, `public/field-note.txt`, fallback/no-script strings and accessible aria-labels are English.
- Implement centralized typed LV/EN messages, **LV as default**; real crawlable `/` and `/en/` with localized **initial response HTML**, reciprocal hreflang, self canonical, sitemap and readable, factual text. Keep SPA enhancements interactive, maintain linkable scene fragments where possible. Language switching must not replay intro unexpectedly or leave focus lost.
- Preserve the existing downloaded field note as a **localized artifact**. Deliver `/field-note-lv.txt` and `/field-note-en.txt` or equivalent, and correct accessible labels/filename. Add regression tests for both locales.
- Important routing: `wrangler.jsonc` sets `assets.not_found_handling: "404-page"` and `run_worker_first: ["/media/*"]`. English deep links must reliably serve 200; **do not globally turn on catch-all SPA fallback, harm 404 or video Range behavior**. A build-time `dist/en/index.html` + localized prerendered static HTML is promising; test exact Worker deployment semantics, static source/asset security and direct refresh.

### P0 — V2 poetic story doesn't yet teach real fungus facts
- `src/content.ts` has three poetic observations, but no actual `Kas ir piepe?` explanation, bracket/polypore pores, spores or wood decay/ecosystem contribution. Beautiful copy alone doesn't satisfy user's educational wish or keyword intent.
- Keep existing poetic attention journey as a **signature**, but introduce a **short, factual, gracefully revealed 'Kas ir piepe? / What is a bracket fungus?'** section (true crawlable text visible in page, not purely locked in dialog) ideally in macro-understory/encounter. Fact-check without guessing species from AI video. Natural LV editorial writing, matching EN meaning; preserve negative space and avoid text over central fungus. Meta keywords must correspond to the actual on-page content.
- `/field-note.txt` currently offers only English poetic notes. Localize and evolve it as optional companion; don't lose collection logic.

### P1 — Brand mark staged but NOT live; palette inconsistencies
- The actual `public/favicon.svg` is old minimal three-stroke icon, while the owner's newly approved layered fungus SVG marks exist under `design/piepe-mark.svg`, `design/piepe-favicon.svg`, `design/piepe-mark-monochrome.svg`.
- Stage `public/favicon.svg`, actual multi-resolution `favicon.ico`, Apple touch and PWA icons, a consistent small mark + `pie.pe` lockup and app/site identity. Verify 16×16 readability and do not overwrite originals under `design/`.
- Existing CSS uses `#08140f`, `#06110c`, `#eae8df` etc; consolidate CSS design tokens around approved **`#0B1712`, `#7D9075`, `#A96D3B`, `#F2D7A2`, `#EAE8DF`**. Keep appropriate derived tints/shades and high-contrast text. No heavy recoloring video.

### P1 — Wallpaper sources NOW exist in GitHub; earlier instructions are obsolete
- **Confirmed in latest tree** `design/wallpapers/piepe-wallpaper-desktop-source.png` (**3,733,323 bytes**, 2048×1143) and `design/wallpapers/piepe-wallpaper-mobile-source.png` (**3,773,735 bytes**, approved 1143×2048 near-9:16 version). No need to request upload again.
- Source files have NO brand/text overlay. Apply exact brand SVG + discreet `pie.pe`; develop ~5K/4K desktop and portrait high-resolution wallpaper assets, 2 preview choices + working downloads near footer; no newsletter, no redundant content.
- Honest image quality: upscaled source is not native 5K; inspect crops. Fit mobile fungus and phone clock safe area without masking or distorting.
- Lazy-load only previews; never preload original PNG or huge final wallpaper. Test download in desktop/Mac WebKit/mobile and no inadvertent intro replay.

### P0 — Don't add complexity for its own sake
- Existing v2 forest already has light shafts, CSS mist, sparse animated spores, a custom GSAP timeline and a sophisticated dialog. React Bits: only selectively use GSAP-native scroll typography/mist reveal *if a demonstrated improvement*. Avoid duplicated scroll triggers, high-GPU LightRays shaders over forest video, fake particles, full-screen blur or all-purpose visual libraries. No HyperFrames runtime; apply editorial seam principles.
- The story should be **felt first, explained second**. Reduce conspicuous overlaid labels over hero, maintain quiet space and responsive typography, make locale controls unobtrusive.
- Preserve optional pause atmosphere and session collection; transition animations should remain pausable/reduced-motion-aware.

## v2.1 regression / acceptance test checklist
- [ ] Source start/end frames matched: intro → still → awakening (interactive) → poster → understory → breathing/wide outro; each full-bleed on 1440×900, 1512×982, 390×844, 390×664, 320×690, 430×932, 844×390; no side bars/camera flashes.
- [ ] 2.0 preserved: intro once / skip / replay / stall fallback, native scroll state, mouse/touch/keyboard fungus activation, dialog tab keyboard semantics, focus/Escape, collection session state, field note download, pause/reduced motion/save-data and proper 206/416/HEAD.
- [ ] Locale: '/' truly LV without JS, '/en/' truly EN without JS; actual per-locale title/meta, good SEO content, self-canonical and reciprocal hreflang, sitemap, HTML lang; all visible messages plus field-note downloads localized; toggling locale does not unwittingly restart the intro.
- [ ] Brand + accessible palette + recognisable icon at 16px; no unused demo effects, no app bundle/GPU regressions.
- [ ] Both actual wallpaper sources are used, wallpaper quality and sizes verified, correct embedded brand and pie.pe only; lazy preview, functioning binary downloads.
- [ ] Quality/performance: per-scene JS/video lazy preload; video memory/network, LCP/CLS and mobile CPU monitored. Don't regress reported v2.0 performance (local v2 QA LCP 292ms / CLS .00436, **lab observations**, not universal thresholds).
- [ ] Browser CI on Chromium and macOS WebKit, existing Worker regression tests, live Workers custom-domain smoke test. Physical iOS device unverified unless actual device tests are performed.
- [ ] Only after ALL passing, commit/push `main`, deploy existing Worker **`piepe`** (never a new Pages project/Worker), confirm version + live both languages and media ranges, retain rollback.
