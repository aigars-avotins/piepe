# PIE.PE 2.0 — The Living Forest

## Live baseline audit

Baseline main: 89884ee032510c16cb9bad412715557040a720b1. All local source/media blob hashes checked against the remote repository tree. Entire source, tests, QA harness, Worker and hosting config reviewed.

The live production page was opened in the real Chromium browser, including the actual film, desktop 1440×900, 390×844 portrait and 320×690 composition. Before artifacts are kept with the task outputs. The supplied film ends normally. Its engineering stays.

V1's weaknesses: nearly identical fixed framing throughout the scroll, large title crowding the fungus edge at some desktop ratios, tiny mobile supporting type, an oversized elliptical hit area, a discovery sheet that removes the photographic subject, and three generic placeholder rows. Motion does little to change visual space.

## Recommendation

Make PIE.PE a complete digital art encounter, rather than an empty portfolio. The single worthwhile destination is an interactive field note about looking beneath the visible surface. No fictional projects, links, biography or personal claims.

## Four connected scenes

1. **Arrival / Surface.** Preserve the unmodified 6.041667s film and matching still geometry. A spacious left wordmark, quiet caption and object-attached discovery label. Mobile puts lettering above the illuminated shelves.
2. **Beneath the bark.** The camera moves laterally and closer into real bark detail; a photographic foreground trunk passes at a different speed, light narrows and the scene cools. A short original text turns attention from the visible object to hidden growth. No text-only fade sequence.
3. **Encounter / What remains unseen.** The fungus returns as a large photographic close-up with the surrounding bark intact. A travelling ivory edge light invites interaction. Activation becomes a close photographic encounter, not a generic information sheet.
4. **Return / A different way of seeing.** The close layers separate, wider forest re-enters, morning light returns. A small completed field-note mark stays for the tab session. Optional replay is explicit, never triggered by scrolling.

## Discovery payoff

A three-part original micro-story, “A small atlas of attention”: Surface → Beneath → Beyond. Visitors move between three observations using accessible buttons/arrow keys. A photographic crop and a restrained, original branching-line diagram respond to the selected observation. The last note completes the encounter; a downloadable plain-text field note is a real take-away. Text is poetic observation, not a species identification or unsupported biological claim. Latvian “piepe — bracket fungus” remains a small complete bilingual touch.

## Motion and resilience

Use existing GSAP only for the environmental camera/layer timeline, with native scroll. Transforms and opacity dominate; no WebGL, video scroll scrubbing, large filters or permanent animation frame loop. Idle particles are sparse and pause for hidden documents and user motion controls. Reduced motion provides distinct static scene compositions and immediate discovery transitions. Save-data reduces atmospheric layers. All meaningful content remains HTML.

Mobile art direction uses viewport-specific camera paths, safe areas and readable 12px+ supporting controls. The hotspot follows a traced fungus silhouette with a minimum 44px explicit fallback button. Typography stays inside visible glyph bounds at 320, 360, 390 and 430 widths.

## Media delivery audit

The deployed V1 binding ignored Range, requiring the existing handler. Optimize the handler to slice a stream with bounded memory and cancel after the requested range; preserve 206/416/If-Range behavior under tests. Prefer forwarding native 206 if the binding supports it in future. Do not change custom-domain routes or introduce resources.
