# Implementation QA — 2026-10-27

## Checks completed before deployment

- Dependency installation: successful. Production dependency audit: zero vulnerabilities.
- TypeScript: passed (`npm run typecheck`).
- Production build: passed (`npm run build`).
- ESLint: passed (`npm run lint`).
- Real browser: Codex's Chromium in-app browser, desktop 1280×720 and mobile 390×844.
- Actual H.264 MP4: duration **6.041667 s**, **1920×1080**, natural `ended` lifecycle, no loop, unmounted after exit.
- Original prepared assets: all three local Git blob hashes match existing repository assets byte for byte.
- Final frame/still: browser canvas comparison at 192×108 gives mean absolute channel difference **4.67 / 255**, consistent with the supplied near-final JPEG and lossy video compression. Shared cover geometry prevents a crop jump.
- Desktop and mobile fungus click, keyboard Enter, modal focus, Escape, restored focus, native scroll, expandable notes and return-to-top: verified interactively.
- Mobile: portrait composition visually inspected, text moved above the first illuminated shelf, no horizontal overflow at 390×844.
- Scrolling back to the forest leaves video unmounted; no replay.
- Immediate intro skip: `skipped` state and usable keyboard discovery confirmed.

## Fault-injection checks in the same real browser

`node scripts/qa-server.mjs` serves the **production dist** with local-only test instrumentation. It is never deployed or imported by the application. Example: `http://127.0.0.1:4174/?qa=blocked`.

| Scenario | Observed result |
| --- | --- |
| `natural` | `ended`, video removed, interactive still |
| `blocked` | Rejected play promise → `autoplay-blocked`, usable fungus |
| `stall` | Actual playback paused at 0.5094s → `stalled`, video removed |
| `pending` | Server withholds video response → `load-timeout`, video removed |
| `missing-video` | HTTP 404 → bounded `load-timeout`, usable fungus |
| `missing-still` | HTTP 404 → `image-error`, readable text and interaction |
| `reduced` | Simulated reduced-motion preference → no video element or MP4 request |
| `save-data` | Simulated data-saving preference → no video element or MP4 request |

No JavaScript runtime errors were recorded by the natural, blocked, stall, pending, reduced-motion or data-saving harnesses. Missing-media HTTP errors are expected in injected failure cases.

## Performance measurements and limits

Local, unthrottled mobile browser, natural intro: LCP **304 ms**, CLS **0.0043**. These are local lab observations, not production field metrics or a slow-network claim. Data-saving path: LCP 188 ms. Unresponsive-media path recovers after 4s and the title finishes its transition later; no infinite loading state.

Production build: JavaScript 350.38 kB raw / 119.09 kB gzip; CSS 17.55 kB raw / 5.00 kB gzip; video 1.72 MB; final image 126.97 kB; start poster 156.20 kB. Self-hosted font subsets only, no external font requests, WebGL, analytics, backend or lower-page media downloads. Mobile removes grain and halves decorative particles.

## Explicit remaining validation limitation

The committed 20-case Playwright matrix was **not executed successfully** in this host sandbox: Chrome, Chrome Headless Shell and WebKit processes abort before a page opens because macOS denies application/Mach service registration (`bootstrap_check_in … Permission denied`). This is a browser-launch/environment failure, not a passing test result. The interactive and fault-injection browser checks above were performed through the working in-app browser instead.

Actual Safari/iOS hardware and throttled mobile performance remain unverified. The supplied H.264 video and playsInline/muted attributes are compatible choices, but this report does not claim a native Safari test. The same Playwright suite is ready to run in an unrestricted local or CI environment.

Project entries intentionally remain clearly labelled early field notes until the owner supplies real projects, as allowed by Issue #1.
