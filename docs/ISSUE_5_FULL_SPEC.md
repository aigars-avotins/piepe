# Local snapshot of GitHub Issue #5

Source: https://github.com/aigars-avotins/piepe/issues/5
Updated: 2026-10-28T14:48:29Z

# OWNER UPDATE — 2.3 EXECUTION AUTHORIZED, FULL CINEMATIC SCROLL + REPLAY P0 (2026-10-28)

**Latest owner's observation overrides any conflicting older instructions below.** The site was tested in a fresh incognito window: **Understory and Breathing DO contain working videos. Their moving frames appear only if the visitor stops scrolling at an extremely narrow exact position.** This is primarily a **scroll/activation-window and replay lifecycle UX defect**, not proof that the assets cannot decode. The owner is happy with the current visual Awakening→Understory transition, but wants the cinematic scene to visibly play under natural scrolling.

**The owner NOW explicitly authorizes Codex to implement ALL of PIE.PE 2.3, starting with the existing 2.2 bugs. Do NOT require an extra owner signoff between solving the three P0 bugs and starting the four high-fidelity encodes.** Implement in one 2.3 feature branch. **Still STOP before merging/publishing to Cloudflare production until separate explicit final owner approval**, since pushing main auto-deploys.

## P0.0 — Smooth scroll, cinematic full-viewport staging, EVERY-VISIT video playback

### Required visitor experience
1. Natural smooth downward page scroll remains. As visitor approaches **Understory**, the view **gently settles at a cinematic stop** so the moving video fills the visible viewport (edge-to-edge, no borders), with text positioned safely. The visitor must not have to stop the wheel or touch gesture at exactly the right pixel. The scene must be clearly seen moving.
2. After the intentional cinematic moment, visitor can smoothly continue scrolling to the next content. Repeat the same behavior for **Breathing** near Return. The page must never permanently trap a visitor, hijack wheel events, jump abruptly, or yank scroll backwards; Escape/skip/intentional user scroll must be honored. Avoid indiscriminate document-wide mandatory snap points. Use a carefully scoped approach (e.g. well-tuned GSAP ScrollTrigger pinned/sticky cinematic plateau with bounded hold and gentle threshold/optional scroll snap) that works with true native wheel/touch/inertial scrolling and browser chrome changes. The design should offer a visible full-frame cinema plateau without a jarring automatic camera snap, and user must be able to skip/continue.
3. Understory and Breathing should be **moving video every time their scene is revisited** — first visit, repeated scroll down/up, navigating back to section, switching LV↔EN and a later return in the same session. **Never permanently replace a successfully playable environmental clip with a static end image just because it has once completed or was briefly offstage**.
4. If the visitor remains on the cinematic plateau after a 6s clip completes, keep motion alive: choose a source-appropriate **seamless loop while visible**, or a tasteful intentional replay with no black flash. If the existing first/last frames are not loop-compatible, diagnose this and propose an acceptable brief hold/restart that is still **perceptibly moving**, not a forever static image. **On each re-entry/revisit it must replay** from the beginning or a deliberate synchronized segment. Do not accidentally restart repeatedly at noisy intersection boundaries.
5. Only **one** cinematic video plays at a time. On leaving scene or backgrounding the tab, pause/release resources cleanly; on re-entry recreate/restart moving film predictably. While decoding, use matching high-quality held frame/poster; once decoded, video must take over with an actual presented frame. Fallback stills are only for actual errors, explicit reduced-motion/save-data preference, or intentional interruption. No hidden "played this session" suppression for Understory/Breathing.
6. The fixed visual area really fills the **visible** viewport on desktop MacBook 16:10/Retina, ultrawide, mobile 390x844, compact 390x664, landscape 844x390, including safe areas and dynamic 100svh/100dvh variations. The visual subject must not be awkwardly cropped or text cut off. Do not interpret "whole video fits" as letterboxing the entire 16:9 source: keep full-bleed cover and correct focal composition, no sidebars.
7. **Do not make scrolling dependent on finishing all 6 seconds** if visitor intentionally advances, uses keyboard navigation, skip, reduced motion or assistive navigation. Balanced user control and cinematic immersion; no motion sickness or scroll lock. Preserve normal links, anchors, browser back, tab focus, reduced-motion static experience and bilingual content.

### Explicit source-level suspects, to verify rather than assume
- `src/useForestMotion.ts`: `startSettledCinema()` refuses to activate clips while `camera.scrollTrigger.getTween()?.isActive()` — scrolling may move through the narrow eligible interval before the scrub settles. `macro`/`breathing` start/end thresholds and `onToggle` may turn eligibility off before the video can play.
- `src/MotionClip.tsx`: `rememberClip(name)` happens at start (before presentation), `done` reads `hasPlayedClip(name)`, `finish('offstage')` cements a permanent still; current state machine may never return to movie after a revisit. This **must be changed for environmental films**, while preserving the intentional once-per-session INTRO and Awakening behavior.
- `src/App.tsx` `cinemaMounted`/`cinemaActive` conditional and stage ownership; `src/ForestScene.tsx` fixed wide/macro background layers, `src/style.css` opacity/z-index and viewport cover.
- Decode stalls, Range, autoplay and session errors must be distinguished from normal scrolling/lifecycle. User's incognito observation indicates video playback **can succeed**.

### Automated and manual acceptance (mandatory, not just static screenshots)
- In a fresh private session with ordinary continuous trackpad/wheel and touch swipes, Understory and Breathing each reach a stable full-screen **video-presented** state without precise hand-timing; verify `HTMLVideoElement.currentTime` increases, `paused === false`, `readyState >= 2`, and multiple distinct **presented video frames** in real time, at the actual visible/cropped screen (not hidden under a poster).
- Scroll down past and back into each stage **at least three times in the same session** and again after reload; video is visibly moving on every visit. No unwanted replays of the once-per-session intro.
- Slow scrolling, fast scrolling, rapid reverse, mobile inertial swipes, direct #anchor, keyboard PageDown/Space/Arrow, scroll restoration, browser back, language switch while near a stage. No scroll hijack, sudden teleport, indefinite pinned trap or unresponsive controls.
- Record before/after 20–40s **real browser** screencasts covering full normal journey with motion, scroll approach and leaving/returning, plus diagnostic trace of trigger eligibility, mount, ready, frame presentation, and repeated playback.
- Preserve accessibility with `prefers-reduced-motion` (static intentional view) and `saveData`, touch safety, user skip and robust autoplay-rejected behavior. Report remaining physical iPhone limitations honestly.

## P0.1 — Discovery entry: NO second flash / 1cm movement after picture settles

The owner reports click `Aplūko piepi tuvāk` produces the correct beautiful camera approach, then an **unwanted flash and a second ~1cm nudge** after the first field-note view has settled; `Dziļāk`, `Tālāk`, back-to-forest work well and must be preserved.

Review `src/usePhotoHandoff.ts` final `animations.cancel(); restore(); node.classList.remove('photo-moving')` vs destination CSS state in `src/Discovery.tsx` / `src/style.css`. Verify exact source crop/projected transform and frame at completion before and after cleanup. Fix the endpoint mismatch at its source; no generic fade to hide an extra snap. Capture real-time before/after and close/reopen tests in LV/EN desktop/compact phone.

## Execution order — proceed through ALL 2.3 coding after P0

1. **First** reproduce and fix P0.0 Understory/Breathing scroll plateau + unlimited natural revisits and P0.1 photo nudge. Run focused tests and visual browser review.
2. **Then continue autonomously, without waiting for extra approval**, with the entire remaining approved 2.3 scope in the full specification below: re-encode **all four** delivered masters from `source/forest-*-original.mp4` to genuinely high-fidelity, browser-compatible editions; quality A/B before/after; mobile framing; refined emotional ending, subtle interaction affordances, accurate small educational layer if high-quality sources are available, typography/a11y/SEO polish. Do not generate unapproved new AI footage or fabricate scientific imagery.
3. Do NOT start the **2.4 “ieiet piepē”** spores/pores macro journey. It remains a separate saved concept: https://github.com/aigars-avotins/piepe/issues/6.
4. Save work/QA in 2.3 feature branch, create a PR. Run focused local tests during development, then one full manual Chromium + native macOS WebKit release validation for final candidate; do not trigger heavy CI after each edit. Do not falsely assert physical iPhone testing.
5. **STOP before merge/deploy**: share comparison captures and PR, get final owner approval. Cloudflare automatically deploys pushes to `main`; no direct `wrangler deploy` or interim pushes to `main` now.

**This new P0 update overrides earlier text below that incorrectly requires a separate owner approval before re-encoding. The owner has already authorized the full 2.3 implementation, including re-encoding, once the bug fixes are done.**

---

---

# PIE.PE 2.3 — THE FOREST, REFINED
**Status: READY FOR CODEX IMPLEMENTATION — owner authorized starting 2.3 on 2026-10-28.**

### Release gate (critical)
PIE.PE 2.2 was published and accepted by the owner, with passing [full Chromium + native macOS WebKit CI](https://github.com/aigars-avotins/piepe/actions/runs/40696511644) and [release evidence](https://github.com/aigars-avotins/piepe/blob/main/docs/V22-QA.md). Final recorded baseline commit: `552389b8b799bc2ddafbf828fbcfafdfa22029ed`; Worker `piepe` active version recorded: `34c2dc25-664d-4e28-9351-98d6f8a184c1`.

**Owner authorized development now, not immediate production replacement.** Work from latest `main` on a separate **2.3 feature branch**, preserve existing tested 2.2 in production, and prepare a PR plus visual before/after media evidence. **Ask for the owner's explicit final quality approval before merging/deploying 2.3**, especially for new web video encodes. Cloudflare Git integration automatically deploys pushes to `main`, so **do not push interim work to main or run `wrangler deploy` during implementation**. Once approved, run full release validation and then merge/deploy to the EXISTING Cloudflare Worker `piepe`; never create a Pages project or a new Worker.

## Creative north star (owner's highest priority)
**“Skaistāk un īstāk ir svarīgāk nekā dažus punktus ātrāk.”**

The owner reports **severe visible compression artifacts in the four currently served MP4 films. These are an unacceptable quality defect**. Preserve genuinely excellent cinematic detail in bark, bracket-fungus shape, moss, mist, dark gradients, warm highlights, water drops, organic grain and motion. **Visual fidelity, photorealism and shot continuity matter more than maximising Lighthouse scores and squeezing each video into ~1.5 MB.** Still provide sensible loading/playback and robust fallbacks; no black screen or excessive waiting.

## P0 — Safeguard masters and RE-ENCODE ALL FOUR web films from originals
Four original delivery masters have already been backed up in GitHub **outside `public/`**. **These are the authoritative input files; the old `public/media/*.mp4` are NOT masters. No owner re-upload needed.** Verify actual contents, blob hashes, codec, duration and frame rates before work:

| Shot | Source master — AUTHORITATIVE | Git blob SHA | Current low-quality web path |
| --- | --- | --- | --- |
| Reveal | `source/forest-reveal-original.mp4` | `b6532f81fe9fe067dbf3f5f035fdbbd94928dd62` | `public/media/forest-reveal.mp4` |
| Awakening | `source/forest-awakening-original.mp4` | `88fd1cef74de6abd57bd15c8d456e2ee857325d7` | `public/media/forest-awakening.mp4` |
| Understory | `source/forest-understory-original.mp4` | `156f5401893f2690a02aa4b35b36edff3cc89507` | `public/media/forest-understory.mp4` |
| Breathing | `source/forest-breathing-original.mp4` | `d08ed1d04652b5abe4cd8e34a3c5cb3879357385` | `public/media/forest-breathing.mp4` |

Input measurements from previous audit: Reveal 19.07 MB, 1920×1080 24 fps **10-bit HEVC**; Awakening 9.50 MB, 1920×1080 24 fps H.264; Understory 7.06 MB, **1996×1036** 24 fps H.264 (different ~1.927 aspect ratio, crop intentionally, do not stretch); Breathing 9.25 MB, 1920×1080 24 fps H.264. Masters are delivered compressed source masters, not RAW camera footage. Preserve all master bytes.

**Quality process (mandatory):**
1. With `ffprobe`/FFmpeg prepare **2–3 candidate high-quality browser-compatible encodes PER SHOT** from original masters; content-specific quality settings (CRF/bitrate) and faststart/range-friendly MP4. H.264 8-bit compatibility is a sensible baseline for Safari/Chrome; alternative sources/codecs only if compatible and objectively valuable. Do not use the original HEVC alone as public playback.
2. Prepare old web vs source master vs candidate **aligned timecode / identical crop / 100% subject-region contact sheets**, plus real-time split-screen playback comparisons on desktop retina/16:10 and 9:16 mobile crops. Evaluate actual moving fungus edges, wood grain, fine moss, fog gradients, banding, blocking, washed highlights and color changes. Report exact encodes, parameters, sizes, visual tradeoffs and frame continuity. SSIM/VMAF/PSNR may supplement but cannot replace perceptual inspection. The owner must be able to judge the difference.
3. Choose a **substantially better** delivery edition for all four. **No arbitrary 1–3 MB cap or performance-score optimization at the expense of image quality.** Larger files are acceptable if visibly superior. Avoid artificial sharpening, AI hallucinated detail, unearned 4K claims or altered source color grading. Do not merely rename/copy existing low-quality files.
4. Preserve compatible poster/final-still luminance, frame timing, exact first/last shot continuity, present-frame readiness, existing reveal→awakening→note and **awakening→understory** reversible GSAP handoffs. Higher-quality stills/posters may be regenerated **from original frames** only if needed for matched quality and smooth transitions.
5. Keep the full masters under `source/` (not in Vite's `public/` or built Cloudflare assets). Preserve original checksums. Don't ship analysis candidates/test masters in production assets. Update worker media size manifest/build handling and verify HTTP Range 206/416, Content-Length, 404 and CSP.
6. Never claim visual improvement before comparing actual full-size moving footage. Save A/B previews and a written QA scorecard with source paths in the feature branch/PR; avoid huge QA videos in git if GitHub artifacts or links suffice.

## P0 — Mobile-first cinematic art direction
- Inspect **real 2.2 production** on a phone or equivalent viewport, and source frames. Aim for a deliberately composed portrait visual, not just blindly using `object-fit:cover`.
- Preserve bracket-fungus focal geometry and text safe areas across 320×690, 390×664, 390×844, 430×932 and rotation. Re-evaluate 16:10 MacBook, 1440×900 and 2560×1080 side-bar/cropping.
- If the original 16:9 footage intrinsically lacks necessary portrait field of view, **do not invent true 9:16 detail by destructive cropping or naive upscale**. Prepare precise first/last-frame references and an owner-approved brief for a matched portrait Reveal + Awakening pair, then additional Understory/Breathing only if justified. **Do not auto-generate new AI media or replace the owner's originals without approval**. In the meantime implement the best elegant crop/focal adjustment.
- Real device testing, macOS WebKit and real Safari when available. Clearly distinguish emulation from physical handset and server QA from live production.

## P1 — The Forest, Refined: restrained visual and UX improvements
1. **Emotional ending:** meaningful quiet pause and return to the SAME forest, subtle closure; creative copy seed “Mežs paliek. Skatiens mainās.” (develop elegant LV/EN wording). Maximum two natural next actions: return / wallpapers. Avoid generic marketing CTAs.
2. **Reveal the interactivity:** gentle, accessible touch/hover/focus hints for the fungus hotspot, field-note and scroll. Never animate incessantly, never create dead '+' icons, preserve 44px hit targets and keyboard navigation.
3. **Optional small educational micro-explainer:** premium, minimal, species-agnostic explanation for fruiting body, underside pores (where appropriate), hyphae and the role in wood decomposition, with verified facts and scientifically faithful real macro photo/illustration when feasible. **If high-quality trustworthy media is missing, present a storyboard/asset request rather than publishing fake scientific imagery.** Don't turn this into an encyclopedia or heavy modal.
4. **Refine existing type and identity:** keep Manrope + Cormorant Garamond, the approved deep forest/moss/amber/ivory/off-white palette and approved icon. Adjust real mobile readability, line height, letter spacing and small captions; delicate pore/hypha motif ONLY if it improves atmosphere. Do not film-grain-overlay a video to disguise compression.
5. **SEO, accessibility and real-user performance:** inspect actual Google indexability/Search Console status with owner, preserve already implemented sitemap, localized SSR-like prerender, hreflang/canonical, OG/Twitter, WebPage JSON-LD, alt conventions and focus behavior. Don't rebuild existing SEO. Diagnose serious errors or TBT/INP regression without downgrading movie quality; optional lightweight privacy-respecting analytics and error boundary only if genuinely needed. Cloudflare DNS TXT / Search Console ownership is owner-only unless explicitly authorized.
6. Preserve all 2.2 native audio behavior, LV default and `/en/`, downloadable 5K/4K/phone wallpapers with larger signature, working +, localized note and external links opening in new tabs.

## Deliberately OUT OF SCOPE
- The **2.4 “ieiet piepē”** scientifically-grounded spores/pores macro-film concept is tracked separately in [Issue #6](https://github.com/aigars-avotins/piepe/issues/6). Do not implement/generate it in 2.3.
- No fungoid species database, blog infrastructure, accounts/community photo uploads, subscription, AI wallpaper generation, huge audio mixer, offline full-film PWA, gratuitous 3D/WebGL/animation framework, new Worker or new domain.

## Implementation and release workflow
1. Create `codex/piepe-v23` (or equivalent) from latest `origin/main`; preserve unrelated work. Confirm last known 2.2 production revision/version and take a rollback reference.
2. **Solve video quality first**. Do not spend the budget on microanimations before source quality is visibly improved. Build multiple encoder candidates from `source/`. Produce a scored A/B pack and select the best compatible output. Implement media loading and poster continuity changes with no visual regression.
3. Build mobile-specific visual direction. Apply evidence-backed P1 polish as time permits; if an asset requires new generation, create precise owner request and skip until approval. Keep change scope cohesive.
4. Run local typecheck, lint, Worker, build, targeted Playwright throughout development (prefer local tests). **The GitHub CI was intentionally optimised:** auto pushes run lightweight checks, full Chromium+native macOS WebKit **manual release validation only**, not on each intermediate commit. Test real-world slow/fast connection, decode readiness, audio policy, scroll interruptions, keyboard, both languages, and same-origin security.
5. Save before/after **real browser recordings and matched source-vs-optimized image/video comparisons** for MacBook retina/16:10, 1440×900, ultrawide, portrait+compact phone; report frame drop and banding. Publish a PR and concise comparison for the owner.
6. **STOP before merging/deploying.** Ask owner for **explicit visual quality signoff and production approval**. Do not push 2.3 interim commits to `main`: existing Cloudflare Git integration automatically deploys `main` before the full manual CI. Do not run `wrangler deploy` without approval.
7. After owner approval: run full manual release CI **Chromium + native macOS WebKit** for exact release SHA; merge once passing; allow existing Cloudflare Git integration to deploy; verify `https://pie.pe/` and `https://pie.pe/en/` in live browsers, four films and media ranges, mobile artwork, metadata, wallpapers and sound. Record exact deployment version and rollback; update Issue #5 and QA.

## Required final status report
- Actual original-master verification (source checksums/resolutions/codecs).
- Four old-vs-new visually inspected video comparisons with compression settings and file sizes.
- Before/after cinematography (desktop and mobile) and any changes to poster/frame handoffs.
- Actual new educational image requirements, if any, instead of inventing them.
- QA / native WebKit status, Lighthouse performance only as supporting data, live status.
- PR/commit link and **explicit owner approval checkpoint** before production.
