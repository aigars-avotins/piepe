# PIE.PE 3.0 — Enter the Fungus

Issue #6, including the two November 7 integration/asset comments, and the owner's complete 3.0 brief supersede the older speculative generation plan. Base: `9ebf669d929a7adfbeb4d428309b3134821d1663`, with the completed 2.5.8.2 site (npm 2.5.10) and all seven subsequently uploaded sources.

**Release boundary: feature branch and review PR only. No merge, production deployment, new Worker, or paid generation is authorized.**

## Product integration

- The existing small first-viewport invitation now foreshadows another world and links to `#encounter`. Reusing this one slot avoids adding another competing hero control. The photographic X-Ray remains in `#fungus-facts`, directly addressable at `#forest-xray`; its controller, guide and educational links remain available.
- Encounter replaces its duplicate Field Note actions with one large bilingual **Ienāc piepē / Enter the fungus** button. The original hero fungus interaction still opens Field Note 001, with its original Awakening, tabs, download and progress states.
- Explicit entry opens the original ancient-tree still. Begin is a second deliberate choice; scrolling never starts the portal. A visitor may exit at every stage.
- 02 → 03 → 04 arrives in the real, indefinitely looping 05. Stay focuses the small gaze region; Return plays 06 → 07, hands back to the exact 01 still, then closes to the saved Encounter position/focus. Early Exit is immediate and does not pretend to complete the return films.

## Isolated architecture

`FungusPortal.tsx` owns native `<dialog>` semantics, bilingual controls, original-image readiness/retry, preference opt-in, gaze, visibility pause and history/focus restoration. A portal-only history entry makes browser Back close the doorway; locale changes replace that entry and preserve the selected language when closing.

`PortalCinema` owns an explicit state machine: portal-ready, entering, deepening, arriving, living-world, returning, finished, error. Absence of the mounted component is closed. Each asynchronous operation has an epoch/abort lifetime; Exit removes sources and cancels transitions. Failed preparation and stalled active playback expose recovery rather than silently freezing.

Two bounded slots hold the current scene and at most one paused, prepared next scene. A source-native lossless first-frame image covers each incoming surface until the browser presents video. The outgoing scene stays visible while preparation is pending. Only one movie plays at a time. Per-boundary short handoffs are authored independently; playback remains 1×. At 2.5 seconds remaining, only the next entry film is prepared. Return film 06 is not fetched until Return is chosen. Source-quality films never load on an ordinary homepage or on the opening still alone.

05 uses actual native video looping, not a session-history still. Presented-frame callbacks measure repeat cycles. Gaze is a bounded CSS 2.5D presentation of 05 only (1.6% overscan, at most ±6/4px); it is not reconstructed 3D. Return recentres before the first outgoing handoff. Resizing recentres; reduced motion disables gaze.

The existing App/GSAP camera remains mounted and unchanged underneath. Portal opening suspends the original environmental film decoders and inerts the main content; closing restores their existing behavior. No competing ScrollTrigger or animation library is added.

## Preferences, audio and accessibility

- Native modal focus containment, Escape, browser Back, always-visible Exit, explicit Begin, Pause/Resume, Skip and Retry. The opener is captured before main becomes inert and restored with `preventScroll` after native history restoration.
- Reduced motion and Save-Data start with an explicit still-world alternative. Full-quality films remain an informed opt-in; no inferior mobile encode. A change to quiet preferences during loading cancels the moving sequence safely.
- All six source AAC tracks stay muted. The existing single forest ambience graph remains optional, using its existing smooth low-pass depth treatment. Portal interactions do not silently activate sound; its sound control can explicitly activate a waiting graph. Muting survives Exit.
- Portal media is outside the Morning/Nightfall filter; the supplied amber grade is displayed unchanged. Existing mood selection stays intact beneath the doorway.
- The artistic nature of the micro-world is disclosed. It is not microscopy or species-identification evidence.

## Fidelity and review gate

All original source bytes remain unchanged; only the duplicate 06 filename extension is normalized. Separate fast-start stream-copy files improve measured startup without re-encoding. Native-resolution first-frame posters are lossless. See [media audit](V300-MEDIA-AUDIT.md) for hashes, measurements, per-boundary decisions and unavoidable source differences.

Acceptance requires a full real-browser journey, genuine moving/repeating 05 frames, desktop/mobile LV/EN review, focused Chromium/native macOS WebKit, original-site regressions, all 20 routes and Worker range/security checks. Evidence and remaining limits belong in [QA](V300-QA.md). Owner visual review precedes production publication.
