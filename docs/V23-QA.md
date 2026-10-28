# PIE.PE 2.3 — candidate evidence and validation

**Candidate review, not a production deployment. Do not merge/push main until the owner's explicit final visual approval.** Production remains the accepted 2.2 baseline (`552389b`, recorded Worker `34c2dc25-664d-4e28-9351-98d6f8a184c1`). Development is on `codex/piepe-v23`.

The runtime implementation is `b19881df1025ef7d3447eb3d3c5c29bd0730c97e`; browser-context correction `9788213e9985714c75ba8fe6898ffdf21cdb663b` changes only desktop test user agents. The first full manual [Chromium + native macOS WebKit run](https://github.com/aigars-avotins/piepe/actions/runs/40745513408) passed Chromium (84 tests, one opt-in capture skipped), but WebKit had 76 passes and eight failures. Four failures were unsupported mobile wheel input, two exposed a late anchor/restoration race, and two exposed photo camera sampling/synchronization concerns. The subsequent `bb03a3e` correction preserves native mobile keyboard input, resolves explicit anchors after restoration without restarting an ongoing native scroll, and prepares all paused photo animations before assigning their shared start time. Focused native verification is in progress; this is not yet a release-validation claim. `production_smoke=false` intentionally avoids testing 2.3 assertions against the unchanged live 2.2.

## What the recordings establish

The frozen 2.2 baseline and 2.3 were recorded in real Chromium browsers using ordinary wheel input and trusted native touch events. The script does not animate scroll offsets. Both versions approach the same semantic sections and offsets; the larger 2.3 plateaus naturally require more scrolling. Movies play at their normal rate. CDP screenshot timestamps reconstruct real elapsed time, with held captures repeated when exporting 30fps; the export is not a claim of 30 distinct captures per second. Recording/readback adds overhead on this Linux software-rendered environment.

| Real journey | 2.2 before | 2.3 after |
| --- | --- | --- |
| MacBook-like 1512×982, DPR2 | [Recording](qa/v23/before-scroll-macbook.mp4) | [Recording](qa/v23/after-scroll-macbook.mp4) |
| Compact phone 390×664, DPR3, actual touch input | [Recording](qa/v23/before-scroll-phone.mp4) | [Recording](qa/v23/after-scroll-phone.mp4) |

All five required sizes were captured before/after for both ordinary scrolling and the complete natural Awakening→photo→Dziļāk→Tālāk→return path: **1440×900, 1512×982, 2560×1080, 390×844, 390×664**. Twenty baseline/journey/photo scenario traces have zero page errors and are archived in [browser-traces.json.gz](qa/v23/browser-traces.json.gz). Full recordings for the additional sizes remain in the execution workspace; the portable [capture script](../scripts/capture-v23.mjs) reproduces them. Only representative movies are committed.

The 2.2 footage confirms that the films can decode: Understory is moving only briefly while the scrolling text leaves it, and later returns have no environmental video element. The 2.3 footage shows a stationary full-screen composition across a broad range of scroll positions, advancing films, an intentional forward replay while staying, free exit and moving film on return. Native scrolling is always available. An additional [actual touch recording](qa/v23/three-returns-phone.mp4) covers the initial visit and three returns to **each** film, with eight advancing unpaused visit samples. The desktop repeated-return recording and both detailed traces are also retained; all 22 completed recordings have zero page errors. Full test traces also sample actual cropped video pixels, presented-frame timestamps and opacity/coverage, not just a DOM node's existence.

The photo's original second movement comes from re-enabling the CSS crop transition during cleanup. The measured 2.2 post-cleanup projected source movement was approximately 134.6 CSS pixels at 1512×982 and 21.2 at 390×664; the P0 fix holds the committed crop at zero drift in that measurement. The [frame comparison](qa/v23/photo-settling.jpg) shows real recorded frames at completion, +500ms and +1500ms. In the 1440×900 recording, local SIFT registration measured a roughly 50px sideways excursion at +500ms before returning, versus less than 0.3px after the fix. This uses local fungus features rather than a whole-frame average. The initial native camera and observation/return transitions are preserved.

## Original-master quality review

See [V23-MEDIA](V23-MEDIA.md) for verified original hashes, all twelve candidates, exact settings, sizes, scorecard, clean-edge crop and remaining source limitations. Each browser A/B wipe compares the old and new film at the same crop/time, in normal moving playback. Every original/new player reached 145 decoded frames and 6.041667s; compressed recordings complement the 100% subject sheets and actual MP4 files.

| Shot | Desktop A/B | Phone A/B |
| --- | --- | --- |
| Reveal | [Watch](qa/v23/quality-reveal-macbook.mp4) | [Watch](qa/v23/quality-reveal-phone.mp4) |
| Awakening | [Watch](qa/v23/quality-awakening-macbook.mp4) | [Watch](qa/v23/quality-awakening-phone.mp4) |
| Understory | [Watch](qa/v23/quality-understory-macbook.mp4) | [Watch](qa/v23/quality-understory-phone.mp4) |
| Breathing | [Watch](qa/v23/quality-breathing-macbook.mp4) | [Watch](qa/v23/quality-breathing-phone.mp4) |

Raw browser endpoints and screen-capture timestamps are in [quality-browser.json.gz](qa/v23/quality-browser.json.gz). The offline viewer is excluded from production assets. The larger delivery editions prioritize source fidelity; they cannot restore detail absent from the supplied compressed masters. No VMAF score is claimed.

## Checks

- Local TypeScript, ESLint, production build, all 11 Worker unit tests and Wrangler dry-run passed. The dry-run required a writable temporary XDG configuration path in this managed environment; it did not deploy anything.
- Initial complete local Chromium run: 79 passed, five failures, one opt-in recording test skipped. The five affected cases then passed after correcting initial anchor navigation, translated-key ordering and test synchronization/sampling. No acceptance assertion was removed. An initial extra touch-recording attempt timed out without a retained diagnostic trace; the recording helper now saves failure state, verifies the arrival position and logs each visit. The instrumented desktop and touch reruns completed all eight visits. This does not waive media readiness or frame assertions. The added anchor/reload restoration case also passed after the final guard. The full remote candidate run is the authoritative final all-suite result.
- Existing checks retain LV/EN prerendered HTML and metadata, canonical/alternates/sitemap, strict 404/CSP, all download files, collection, keyboard/focus/Escape, once-per-session intro/Awakening, blocked/pending/stalled media, sound preference, storage denial, save-data and reduced motion. The viewport matrix also includes 320×690, 430×932 and landscape 844×390.
- New regressions verify both languages at desktop/phone sizes, broad plateau positions, visible distinct cropped frames, advancing media time, replay cycles, three revisits per film, reload, one playing film, explicit pause/Escape/retry, changing language and expanded glossary layout, and a stable photograph after the initial camera movement.

Twenty WCAG A/AA axe scans passed with zero violations and page errors: expanded glossary and dialog in both languages at desktop, compact phone and landscape sizes, plus both live cinema stages at desktop/phone sizes. The scan found insufficient contrast in inactive journey numbers; their approved-color opacity was raised from .4 to .75 and the full scan repeated successfully. Supporting mobile Lighthouse measurements and the final CI outcomes are being added at the final evidence checkpoint. A green automated check does not replace review of the actual recordings.

## Limits and approval boundary

Native macOS WebKit means the Playwright WebKit engine/codecs on the macOS runner with desktop and phone contexts. It is not a physical iPhone or the Safari application. The local Chromium recordings are browser emulation, not handset measurements. Physical iPhone/Safari-app testing and owner-only Search Console indexing status cannot be claimed here.

The source environmental films are not perfectly cyclic camera paths. Their short end-frame bridge/forward dissolve is intentional; new media generation is not required for the activation/replay fix. Portrait footage necessarily excludes some horizontal field of view; [the asset brief](V23-ASSET-BRIEF.md) supplies genuine first/last source references and optional future portrait/scientific-image requirements. No new AI footage or 2.4 scene is introduced.

No main push, production deployment, domain/security/rollback change or new Worker/Pages project is part of this candidate work. After owner approval, validate the exact final release revision, use the existing `piepe` production path, and run both live locale/media smoke tests against the deployed version. Until then, the PR is the review surface.
