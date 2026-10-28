<!-- Updated 2026-10-28: motion skills added to Issue #4 and to this mirror. Read docs/V22_MOTION_SKILLS_REVIEW.md alongside this complete specification. -->

<!-- Canonical editable snapshot of PIE.PE 2.2 Issue #4 for Codex environments without GitHub Issues API access.
Source: https://github.com/aigars-avotins/piepe/issues/4
If Issue #4 later changes, refresh this mirror after edits. -->

# [PIE.PE 2.2 / P0] Fix reveal→awakening jump, seamless cinematic handoffs & performance

# PIE.PE 2.2 — Seamless Cinema, Continuity & Performance Polish

## Motion craftsmanship reference — curated Emil Kowalski skills (added 2026-10-28)

The owner suggested https://github.com/emilkowalski/skills. I reviewed the repository and selected only skills genuinely relevant to the 2.2 video seams.

**Read [docs/V22_MOTION_SKILLS_REVIEW.md](https://github.com/aigars-avotins/piepe/blob/main/docs/V22_MOTION_SKILLS_REVIEW.md)** and, if accessible, the linked upstream skill instructions.

- **P0 `review-animations`:** review the *actual first→second video and awakening→dialog seams*, plus final diff and real browser recording.
- **P0 `animate`:** design/implement the right spatially continuous, interruption-safe handoff with existing GSAP / React.
- **P0 `animation-performance`:** diagnose frame drops, media readiness/decoding and GPU/layout overhead, including mobile.
- **P1 `mobile-native`:** verify Safari viewport, touch, safe-area, fixed control and dialog behavior.
- **Optional `improve-animations`:** planning-only broader audit after fixing reported P0.

**Important:** These are third-party design guidance files, **NOT a reason to install a new animation runtime**, not instructions to execute arbitrary installer scripts. Do not import every skill. Ordinary UI durations below ~300ms do not constrain the deliberately longer cinematic film sequence. Correct visual continuity and media readiness before considering opacity/blur camouflage.


**Product:** https://pie.pe/ (LV default), https://pie.pe/en/ (English)  
**Existing Cloudflare Worker:** `piepe` — deploy to existing Worker only, do not create Pages/new Worker.  
**Base:** latest `main` after 2.1. The owner says 2.1 is live; **verify actual production first**. Previous `docs/V21-QA.md` is a *predeployment* report, so do not rely on it as proof of live release.

## Goal

Make PIE.PE 2.1 feel like ONE uninterrupted, believable cinematic journey. **The owner reports a clearly visible, ugly jump between video 1 (`forest-reveal.mp4`) and video 2 (`forest-awakening.mp4`).** Removing this visual discontinuity is the non-negotiable P0. Fix its *cause*, not merely add a generic fade/filter.

Preserve the entire delivered 2.1 concept: 4 videos, immersive forest visual art, LV default/EN, true per-language HTML SEO, 3-part fungus discovery, nature facts, clean original fungus branding, approved palette, accessible site, free desktop/mobile wallpapers and Cloudflare Workers reliability.

## Stage 0 — Production confirmation and reproducible evidence

1. `git fetch origin`; inspect current `main`, `docs/V21-QA.md`, `src/App.tsx`, `src/Discovery.tsx`, `src/ForestScene.tsx`, `src/MotionClip.tsx`, `src/IntroFilm.tsx`, `src/useForestMotion.ts`, `src/style.css`, `tests/v21.spec.ts`, `scripts/capture-review.mjs` and `wrangler.jsonc`. Preserve any unsaved local Codex changes; no force reset.
2. Verify **actual live** `https://pie.pe/` and `/en/` (real browser, not just source). Capture production commit/module fingerprint, Worker version if access allows, status, screenshots, console/network errors and a real-time screen recording. Never claim actual production was checked if the network/tool blocks it. Production may have been deployed separately from the earlier QA.
3. Reproduce the discontinuity **in real time** at 1440x900, MacBook 1512x982, 2560x1080, 390x844 and compact 390x664. Include initial intro ending → held `forest-final.jpg` → visitor taps/clicks fungus → first decoded `forest-awakening.mp4` frame → ongoing awakening → last frame → discovery note. Also capture the understory and breathing entry/exit seams, scrolling both ways.
4. Export **before screenshots/frames** at `t=-200ms,0,+100,+250,+500,+1000ms` for each seam, plus 15–30s real-browser MP4 (show pointer/click and full transition) and a compact contact sheet. Require media `loadeddata`/decoded readiness evidence, not arbitrary fixed-time sleeps. Consider slowed playback only for QA; don't slow user-facing experience.
5. Compare actual decoded media first/last frames, associated posters and end-stills, crop at multiple aspect ratios, gamma/exposure, subject silhouette, camera speed/direction, text/overlay positions and modal enter choreography.

## P0 — Fix REAL root cause: reveal → awakening

**Source audit already shows likely causes:**
- `src/App.tsx` calls `setDiscovery(true)` and `dialog.current?.showModal()` immediately on fungus click. The new `Discovery` modal uses `awakening-stage` and an independently created `awakening-plane`, swapping out the visible hero context abruptly.
- `MotionClip.tsx` mounts a separate `<video>` with a poster and first decoded frame; initial render/decoder readiness can cause a frame change even if source frames are close.
- The original ending and awakening opening are **similar, not pixel-identical**. `docs/V21-ARCHITECTURE.md` reports mean ~4.989/255; mean RGB error alone cannot detect an objectionable fungus silhouette/position mismatch.
- After the awakening shot, `Discovery.tsx` immediately replaces the full-frame cinematic world with a cropped `specimen-photo` image in a different part of the dialog; this can create ANOTHER visible jump.
- Additional `scene-cinema` is mounted when the `IntersectionObserver` reports a new section; the fixed media image changes rather than following a guaranteed GSAP transition boundary.

**Required implementation:**
1. Create a coherent scene transition architecture: hero/end-still → awakening shot should keep the **same perceptual framing, cover crop, focal anchor, transform-origin and exposure**. Avoid changing from an ordinary document layer to the top-layer native dialog *during the critical visual seam*. It's fine to retain the native dialog for **actual discovery content**, opened only after the shot or following an intentionally designed transition. Preserve accessibility and a visibly reachable instant skip.
2. Keep the final hero frame visible while the new video/preload resource is being decoded. **Do not expose** an unrelated poster, an empty/dark frame, a late decoded first frame or text popping off before media is ready. Start playback on a controlled, ready-state-aware handoff; ensure true user-gesture-compatible play and autoplay fallback.
3. Before revealing the awakening clip, compare the reference `forest-final.jpg`, actual last reveal frame, `forest-awakening-poster.jpg` and first decoded awakening frame. Use a **non-destructive, original-quality** visual bridge such as precisely aligned, localized masked/opacity compositing or a subtle user-click-motivated optical push, taking care not to display two different visible fungus shapes as ghosted double brackets. Correct geometry first; mask/temporal dissolve is a last refinement, not the sole fix.
4. If the footage itself has irreconcilable camera/fungus geometry, prepare a clear two-frame evidence comparison and specify an **optional owner-produced 0.5–1.5 s bridge clip** with exact start/end references and prompt. **Do not demand new AI generation upfront**; prefer solving this with the supplied media/code. No inventing a matching fungus frame or hallucinated fake detail.
5. Continue the camera sensation into the discovery info: preserve `forest-awakening-final.jpg` and animate the layout/crop deliberately toward the observational sheet (e.g. one consistent source frame transformed to its final crop). The photo must not snap instantaneously to a different viewport left 66% while the video disappears. The text/facts may appear once the visual transition has settled.
6. Explicit replay/return paths must look correct; intro still only plays once per session until explicit replay. Motion preferences, tab hidden, network stall, failed video, skip and mobile Safari all have deterministic still fallbacks without flashes.
7. Refactor responsibly: avoid overcomplex double video compositors, giant full-screen blur, GPU-burning continuous effects and new libraries where simple CSS/GSAP state orchestration works. All scene resources released after use; maximum one playing video at a time. Maintain keyboard and focus restoration.

### P0 acceptance — owner-observable quality
- On an ordinary real-time screen recording, the fungus keeps a stable visual anchor from the end of reveal to the beginning of awakening, without sudden jump in position/size, double silhouette, blank frame, flash or exposed poster.
- No visible cut when awakening ends and the three-step discovery content takes over.
- Working skip, touch, keyboard, close/Escape, focus return, LV↔EN switching within the experience.
- At least one **before vs after** 10–20s browser capture of the exact owner-reported seam. A passing frame-MAE unit test **is not sufficient**.

## P1 — Align environmental scene transitions

- Revisit `App.tsx`'s `IntersectionObserver` section switching and `scene-cinema` fixed container. Do not mount video + swap 100% backgrounds at a random intersection threshold. Use scroll-based GSAP choreography with safe handoff from previous still to the new scene; keep natural scroll. Preserve full-bleed cover and subject framing across 16:9, 16:10, ultrawide, 390x844, 390x664, 320x690 and landscape 844x390.
- Understory and breathing clips should not interrupt browsing when people scroll backward or rapidly. Match first/end stills with actual frames; avoid abrupt white/black flash on section entry or exit, and abrupt changes in tint.
- If macro and breathing shots have genuinely distinct compositions, an **intentional art-directed transition** can be used; do not claim spatial continuity that doesn't exist. Prioritize elegant cut timing and lighting, not forced fake camera continuity.
- Verify CSS background layers behind video don't disappear when a clip unmounts. Use pause/visibility handling and no stale state from sessionStorage.

## P1 — Mobile, visual and performance polish

- `docs/V21-QA.md` reports **local simulated mobile Lighthouse Performance 88** vs v2.0 **100** in the same test context (not field data); FCP ~1.0s, simulated LCP ~3.9s, JS ~127.44kB gzip. Investigate the regression. Aim to restore ≥90 (ideally much better) in the **same lab environment**, without reducing the emotional quality. Report comparable before/after traces and field-vs-lab distinction. Avoid preload of downstream videos/full wallpapers, minimize decode churn, review fonts and transition JS.
- Evaluate typography critically and remove/relocate any text obstructing fungus/movie, especially first video final frame and Awakening; maintain restrained deep LV+EN copy, approved `#0B1712/#7D9075/#A96D3B/#F2D7A2/#EAE8DF` palette.
- Re-evaluate waterfall, 4 media requests, poster dimensions and the scene's late render. Ensure no horizontal overflow, touch areas >=44px and crisp logo at 16px.
- Check the existing 2.1 5K/4K/phone wallpaper download, preview quality and genuine sizes, but **do not regenerate user-approved wallpaper art** unless defective and owner explicitly requests it.

## P1 — Verify product readiness and release truth

- Current `docs/V21-QA.md` explicitly says **production pending, no authenticated Cloudflare deployment, no native WebKit check**, while the owner now reports having published 2.1. Confirm the actual 2.1 production version and fix documentation only once live evidence exists.
- MacOS Safari/WebKit is **not** verified in the existing 2.1 report. Run available native macOS WebKit CI, specifically media decode, dialog focus, download behavior and 16:10/compact viewports. Do not claim physical iPhone tests without physical hardware.
- Independently check linked scientific sources and correct any unsupported claims. Cross-check `/` Latvian and `/en/` English initial response HTML, metadata, hreflang, canonical, accessible language switch, sitemap and all text/facts.
- Search Console property/verification submission is an **owner-only step unless access is granted**; do not claim completion otherwise. Preserve strict 404, CSP and Worker `/media/*` HTTP ranges 206/416 with low-memory streaming.

## Engineering + deployment contract

1. Baseline actual live state, take screenshots/recordings, save reproducible notes; compare to latest local/remote code.
2. Implement surgical fixes on latest `main`. Preserve 2.1 localization and existing branding, storyboard, facts, downloads, reduced motion and 2.0 session logic. No unnecessary dependencies.
3. Add Playwright regression tests specifically for **the seam**: collect video frames and screenshot diff regions across t=0..1s, verify media readiness and scene geometry before fade/portal switch; test fallback and repeat/cancel pathways. **Do not use a weak global RGB threshold to declare visual smoothness.** Include mobile + 16:10 desktop + ultrawide. Retain Worker tests, lint, typecheck and full CI.
4. Capture actual browser video for visual review. Inspect it, iterate until the seam is visually polished; clear/explicitly disclose environmental limitations.
5. Commit/push main. Owner authorizes production deployment of 2.2 **after passing tests** to the EXISTING Cloudflare Worker `piepe` at `https://pie.pe` only. Confirm current Cloudflare version and rollback path before deploy; preserve existing custom domain and account. Test **actual live** `/` + `/en/`, real intro/awakening/understory/breathing flow, wallpaper downloads, HTTP 206/416, language switch, Safari/macOS CI. Never claim deploy success if token/network missing.
6. Update this issue with commit, before/after capture links, version, regression test results, Lighthouse comparatives and remaining limits. Optionally close Issue #3 once its real production verification is documented; don't silently rewrite historical evidence.

## Acceptance summary

- [ ] User-reported reveal → awakening seam fixed and visually verified in real-time footage.
- [ ] Awakening → discovery text/photo transition genuinely smooth.
- [ ] Understory/outro handoffs smooth on MacBook and mobile; no side bars or incorrect crop.
- [ ] All 2.1 features working in LV(default) and EN, with accessible keyboard/touch behavior.
- [ ] Mobile performance optimized/reported with comparable lab methodology.
- [ ] Genuine 2.1/2.2 production version and macOS WebKit status verified or transparently disclosed.
- [ ] Tests, screen recordings, screenshots and deployed `https://pie.pe` results attached or clearly linked.

**No new videos required from the owner unless frame analysis actually demonstrates an unfixable source discontinuity.**

