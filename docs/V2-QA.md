# PIE.PE 2.0 — verified production release

PIE.PE 2.0 is live at **https://pie.pe**. Verified on 2026-10-27 against the actual production domain and the built application, including natural video completion and a real field-note download in Chromium and macOS WebKit.

- Existing Worker: `piepe`.
- Production version: `70a6954d-f95c-4703-a142-985829809650`, serving 100% of traffic.
- Verified implementation/test commit: `e6c6cbac55fe0fd69a338684e8177a7bc269f354`.
- Existing custom-domain record, certificate, compatibility settings, bindings and disabled workers.dev/previews preserved and compared through Cloudflare's API.
- V1 rollback version: `60ff21da-3dd1-4bd1-86d1-8ed481859e05`; availability checked with `wrangler versions view`.

## Experience and preserved assets

Four connected photographic states replace the fixed-background text sequence: arrival, bark close-up with foreground depth, fungus encounter, and a wider return to morning light. Native scrolling drives the camera and lighting. No WebGL or new frontend libraries were added.

The actual fungus has a shaped hit target, traced shelf-edge feedback, a photographic discovery view, three original observations, an imagined line map and a downloadable field note. Collection persists for the tab session. Generic placeholder notes were removed. There are no invented projects, biography or destination links.

The optimized 1,723,128-byte H.264 film remains the original 6.041667s rendition, byte-identical to V1, with the same poster and end still. The accidental public source-master replacement introduced while work was in progress was restored to that optimized rendition. The master remains in Git under source/. All ten supplemental public media blobs uploaded during implementation were preserved and hash-checked. Concurrent staged brand SVGs under design/ were also preserved without publishing them into the 2.0 interface.

## Test results

[Final green CI run](https://github.com/aigars-avotins/piepe/actions/runs/40566807529):

| Check | Result |
| --- | --- |
| Clean npm ci | Passed in Linux and macOS jobs |
| TypeScript / ESLint / production build | Passed |
| Media Worker tests | 10 passed |
| Chromium regressions, including scroll recording | 18 passed |
| macOS WebKit iPhone-size regressions | 17 passed; duplicate recording intentionally skipped |
| Actual pie.pe production smoke tests | 2 passed, one per browser |
| Combined browser checks | 37 passed |
| Live public assets | All 28 match local SHA-256 hashes |
| Live initial and suffix ranges | Exact 206 bodies and Content-Range |
| Live invalid range | 416 |
| Live If-Range mismatch / HEAD | Correct full response / length |
| Unknown page, source, script and reserved-header URLs | 404 |

Production smoke tests check the exact built application module, natural film ending, discovery, a real download, focus restoration, return navigation, refresh suppression and explicit replay. The preserved CSP blocks Cloudflare's platform-injected analytics module; the application fingerprint check is scoped to the actual app module. No security policy was weakened.

Regressions additionally cover autoplay rejection, missing video/still, pending playback, an actual paused/stalled film, reduced motion with no automatic MP4 request, save-data, keyboard arrows/Home/End/Escape, collection persistence, camera changes, pause/resume, runtime motion preference changes and animation setup failure.

The real in-app browser also verified production playback, keyboard discovery, collection, focus restoration, mobile scrolling, browser back navigation, refresh and explicit replay. No application page errors were observed.

## Mobile and visual QA

Before screenshots were captured at 1440×900, 390×844 and 320×690. Final screenshot/geometry checks cover 320×690, 360×780, 390×844, 430×932 and 844×390, including visible glyph bounds, overflow, 44px controls and a fixed close control while discovery scrolls.

The final iPhone-size WebKit visible viewport is 390×664 when its browser controls consume part of the emulated 390×844 screen. This revealed a title/fungus overlap missed by the first desktop-viewport review. The final compact composition omits the decorative kicker and adjusts heading spacing/size; a regression now asserts the hero copy stays above the real fungus. A separate actual-production Chromium capture provides the full 390×844 CSS viewport.

Intermediate hard cutout edges and overlapping fungus fades were removed after reviewing recordings. The final scroll uses one continuous photographic camera with a separate bark foreground. The downloadable final desktop recording contains a genuine 15-second native scroll, with a short opening hold; it is not a simulated image sequence.

A local natural-playback run measured CLS 0.00436 and LCP 292ms. These are local lab observations, not field or handset performance claims. The preserved still's mean RGB difference from the decoded ending was 4.67/255, with no visible flash. Final JavaScript is approximately 121.79KB gzip; CSS approximately 6.33KB gzip.

## Media delivery correction

Live verification caught an important platform difference: ASSETS omits Content-Length internally even when the outward HTTP response includes it. The initial unknown-size fallback returned a full response instead of ranges. The final handler requests a full asset representation, uses build-generated sizes when the header is absent, slices the stream and cancels after the requested range. It does not buffer the full MP4.

`scripts/media-sizes.mjs` regenerates `src/media-sizes.ts` on each build. Tests reproduce the missing-header case with the actual movie, validate suffix/416 behavior, check all generated sizes against disk, and verify a 1KB range consumes at most two 64KB chunks from a simulated 10MB source and cancels upstream. Temporary diagnostic headers were removed before the final deployment.

## Artifacts and limits

- [Final Chromium results, live desktop/mobile screenshots and recordings](https://github.com/aigars-avotins/piepe/actions/runs/40566807529/artifacts/12763815874).
- [Final macOS WebKit results and live screenshots](https://github.com/aigars-avotins/piepe/actions/runs/40566807529/artifacts/12762504563).
- [Canonical V1-to-V2 before/after recordings captured before rollout](https://github.com/aigars-avotins/piepe/actions/runs/40558976777/artifacts/12756819860). Later CI recordings naturally show the current production site as their starting reference.
- Local JPEG/PNG screenshots, silent H.264 MP4s, JSON verification reports and a linked QA report are delivered in this Codex task's outputs/v2 directory. GitHub artifacts have 14-day retention; the delivered local files are retained separately.

**Not verified on physical iPhone/iOS hardware.** macOS WebKit emulation and native media playback were tested. A full manual branded-Safari run was not completed because the user was working in that browser. Local automated browser subprocesses were blocked by the macOS sandbox; the successful automated results above ran in supported CI. Linux WebKit stalled on H.264 in its platform media stack; that failure was recorded, and Safari-relevant media verification ran on macOS as recommended by [Playwright's browser guidance](https://playwright.dev/docs/browsers#webkit).
