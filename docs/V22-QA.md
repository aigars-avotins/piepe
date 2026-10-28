# PIE.PE 2.2 — cinematic continuity and release evidence

Date: 2026-10-28. Implementation starts from `52a7487`; the subsequent documentation updates through `431bc98772b163a6e82bd0c90e10c5645943344f` were fetched and fast-forwarded without discarding work. `docs/ISSUE_4_FULL_SPEC.md` is authoritative. After the environment was restored, the live 2.1 module `/assets/index-CDLhGDet.js` was confirmed to match the frozen before-build. Production access and authenticated Cloudflare/GitHub API access now work.

## Awakening → Understory: primary handoff

The additional owner feedback is preserved in [V22_OWNER_POLISH.md](V22_OWNER_POLISH.md). The 2.1 chapter observer mounted a new opaque fullscreen composition at an intersection threshold. Its replacement was exposed before matching camera/foreground timing and media readiness, producing a full-frame cut between deliberately different compositions.

The macro now prepares and decodes its stills before the entrance envelope, then starts filmed movement after the existing camera scrub settles, and remains invisible until a poster or real video frame is ready. Its persistent layer sits behind the original moving bark foreground and the common grading. The existing native-scroll camera provides the optical push; a restrained 1.08→1 macro settling motion follows the same reversible scroll progress. The bark provides an occlusion carrier between the two deliberately different compositions and leaves the picture when the macro becomes opaque. The common forest vignette remains above the films; old multiply/screen color-light layers and duplicate decorative atmosphere remain behind them. CSS atmosphere and offstage fungus-edge painting pause while film content is active. The wide shot reaches full opacity before its camera settles, avoiding expensive compositing through a nearly transparent earlier forest. This directly addresses the large-viewport frame drops measured during review. Leaving/re-entering retains a held still and never remounts a fullscreen stage. Late or unavailable media leaves the forest visible instead of exposing a blank stage. No blur, scroll hijack or new animation library was added. Comparing an initial 2.2 compositing draft with the optimized 2.2 candidate (not a 2.1/2.2 benchmark), the recorded software-rendered profile improved macro dropped frames from 48→1 at 1512×982 and 76→1 at 2560×1080; the outro improved from 59→5 and 86→7 respectively (145 decoded frames per clip). Phone results remained approximately 16.7ms at the 95th percentile, with one dropped macro/outro frame each. These are single local observations, not device or field guarantees.

## Reveal, awakening and discovery

The visible jump was primarily a compositing/lifecycle defect. Clicking the fungus immediately opened a top-layer dialog, removing the original forest grading, header and title and mounting another fullscreen stage. Equal cover dimensions did not preserve the visible scene: lighting and surrounding layers changed before a decoded video frame was guaranteed. At the other end, a fullscreen shot was replaced by a separately cropped note photograph.

The first decoded awakening frame already matches the held forest remarkably closely. Local SIFT registration of the fungus ROI `(890,370)–(1680,900)` found 676 inliers and median displacement **0.188 source pixels** (the earlier preflight with different detector settings found 704 / 0.188). This is local feature registration, not a global mean-RGB acceptance test. The actual reveal ending has a small source difference: 531 inliers, median displacement 1.98 pixels, approximately 1.0123 relative scale. Its existing short settling dissolve is retained. The source footage does not warrant replacement generation.

- **World → awakening:** mount the video inside the existing `.base-camera .media-plane`, under the same `.forest-shade` and camera transforms. Hold `forest-final.jpg` throughout loading. Expose only a decoded/presented frame using `loadeddata` plus `requestVideoFrameCallback` (RAF fallback). A short 160ms opacity refinement follows that gate; it does not substitute for correcting geometry. Hero text leaves only once the frame is ready. No modal or independent crop is introduced on activation.
- **Awakening → note:** retain the actual ending and move one source image into the observational crop. The native dialog opens for the note after playback. WAAPI animates a fixed overflow clipper with inverse image transforms and two grading opacities for 1000ms. All four effects share an explicit native animation start time. Their combined image matrix stays uniform in world coordinates; the existing world grading is counter-transformed while the destination grading follows the aperture. No `clip-path`, `width`, `height`, `left`, `top` or `object-position` is animated. Text becomes readable after settling; instant skip remains available. Closing reverses from the current frame, including Escape halfway through the move. A generation guard prevents an interrupted completion from resetting the new animation.
- **Recovery and return:** missing end images use a capture of the actual decoded video frame. Media failures and skip open the accessible note; Escape cancels to the current held forest and restores the real opener after React commits the visible state. Reduced motion/save-data/pause bypass the cinematic move; changing reduced motion during a move settles it. Natural endings retain the awakened forest instead of cutting back to the earlier camera. The original focus, tabs, note collection, localized download and replay paths remain.
- **Macro/outro:** persistent environmental layers share existing grading/cameras. ScrollTrigger supplies reversible opacity envelopes for the distinct macro composition; breathing sits in the original wide-return camera. IntersectionObserver now identifies navigation chapters only. It cannot arbitrarily mount a replacement fullscreen background. Native scroll is preserved. Films load on stage, play once, pause when hidden, release their decoder/source and never overlap active playback.
- **Arrival performance:** prerender the complete App with React text boundaries and hydrate it, retaining the server-painted controls. Previously `createRoot` discarded the crawlable HTML and created the late LCP control again. Initial CSS cover geometry now agrees with measured geometry, preventing a startup layout shift. Inline the tiny boot script with its exact CSP hash. Outline the existing Cormorant header/footer wordmark as a small SVG and preload only critical Manrope subsets. This preserves the approved fungus mark and typography; it adds no runtime dependency.

All supplied film/still bytes, original wallpaper sources, biological copy/translations, media Worker and `wrangler.jsonc` are unchanged. Download wallpapers and their previews have the larger signature explicitly requested in the new feedback. The original intro playback component is unchanged. Strict 404, same-origin CSP, custom domain, account, bindings and disabled preview/workers.dev settings remain intact. CSP adds exact boot/JSON-LD hashes, not an unsafe-inline script exception.

## Owner polish and sound

- Removed the wallpaper enlargement helper from LV/EN page HTML; resolution/source limitations remain documented, without a needless product footer line.
- Increased the approved desktop signature by approximately 40% and phone signature by approximately 33%, keeping the original artwork, palette, download dimensions and safe placement. Versioned download/preview URLs avoid stale cached signatures. `scripts/brand-assets.py --wallpapers-only` regenerates only the three downloads and two previews.
- The encounter plus was covered by the positioned full-width text layer. Its button now sits above that layer and opens the existing accessible observations, with `aria-haspopup=dialog` and focus restoration. Native pointer-click tests cover both languages. A separate 390×664 Chromium touch-emulation check covers real taps, initial native audio activation and mute inside the note.
- Supporting paragraphs are 16px; quieter labels/captions/footnotes are generally 13px, with 12px counters/control labels and existing 44px tap areas.
- Both educational source links open a separate tab with `noopener noreferrer`. A browser popup test verifies that the original forest remains open and `window.opener` is null; that controlled navigation test does not claim the live external article was fetched.
- Added real CC0 birdsong from the pinned Blanket source, credited in [public/audio/CREDITS.txt](../public/audio/CREDITS.txt). A 63-second stereo loop has a three-second tail/head crossfade prepared offline and plays through a single native Web Audio graph. The decoded loop, gradual gain, persistent mute, hidden-tab suspension and unchanged source across scene/language changes avoid abrupt restarts. No audio or synthesis library was added.
- Sound is enabled by default. If the browser blocks autoplay, the graph waits for a genuine interaction before fetching/decoding the 505kB recording. A clear localized mute control remains available both in the forest and inside the native top-layer note. An explicit preference is saved locally; save-data defaults to silence until the visitor enables it. Storage denial and an unavailable recording recover without blocking the experience.

## Browser evidence

These are **real local Chromium browser recordings**, not production captures or rendered mockups. The screencast MP4s are silent; sound behavior is checked separately with the real native audio graph and the supplied recording. CDP JPEG frames retain browser timestamps and are encoded at 30fps; the pointer ring is a QA annotation. The same supplied films play at their normal speed. Screencast exports are silent; audio decoding, native playback, mute and persistence are covered by the browser tests. Scrolling in the capture is scripted through the native document scroll position; the app does not intercept wheel/touch scrolling. Event logs distinguish loaded data, playback, presented frames, endings and dialog state. CDP frames are sorted by capture timestamp before encoding because screenshot delivery can arrive out of order. The encoder preserves millisecond durations before producing a 30fps export; it repeats held captures without inventing intermediate imagery. The source capture cadence varies, so a 30fps export does not establish 30 distinct rendered frames per second or exact 33ms visual timing.

| Viewport | Before | After |
| --- | --- | --- |
| Awakening → Understory, 1512×982 | [recording](qa/v22/before-understory-macbook.mp4) | [recording](qa/v22/after-understory-macbook.mp4) |
| Awakening → Understory, 390×664 | [recording](qa/v22/before-understory-phone.mp4) | [recording](qa/v22/after-understory-phone.mp4) |
| Reveal → Awakening → note, 1512×982 | [recording](qa/v22/before-macbook.mp4) | [recording](qa/v22/after-macbook.mp4) |

Full-size recordings at **1440×900, 1512×982, 2560×1080, 390×844 and 390×664**, every event log, screenshots and timestamped `−200, 0, +100, +250, +500, +1000ms` extracts are retained in `/workspace/piepe22-qa/before/` and `/workspace/piepe22-qa/delivery/`. Representative committed before/after comparisons and viewport contact sheets are available under [qa/v22](qa/v22). The full forward/reverse macro/outro journeys are retained in `/workspace/piepe22-qa/journey-before-{standard,desktop,ultrawide,mobile,phone}/` and `/workspace/piepe22-qa/delivery/{1440x900,1512x982,2560x1080,390x844,390x664}/`.

Live production recordings, using the same normal-speed capture method:

| Actual target | Recording |
| --- | --- |
| `https://pie.pe/`, 1512×982, reveal → awakening → note | [production recording](qa/v22/production-reveal-note-macbook.mp4) |
| `https://pie.pe/`, 1512×982, awakening → understory | [production recording](qa/v22/production-understory-macbook.mp4) |
| `https://pie.pe/en/`, 390×664, reveal → awakening → note | [production recording](qa/v22/production-reveal-note-phone.mp4) |

The complete live LV journey also includes the breathing outro and reverse return. Its event log records all four natural film endings, one active video at a time, no page errors and the tested bundle fingerprint. [Capture manifest](qa/v22/recordings.json), [MacBook production frames](qa/v22/production-macbook-seams.jpg) and [phone production frames](qa/v22/production-phone-seams.jpg) are committed alongside both production event logs. Local production captures used the environment's explicit proxy with trust limited to its provided CA public-key pin; CI production smoke used the GitHub runners' ordinary network. No site TLS/security setting was changed.

Reproduce with `scripts/capture-seams.mjs` and `scripts/capture-review.mjs`; see README for target/output/viewport options. Keep an exported, unchanged baseline separate from working source. The before baseline predates only documentation changes on main; it has the same 2.1 runtime implementation.

## Validation

Full protected manual release run [40696511644](https://github.com/aigars-avotins/piepe/actions/runs/40696511644) succeeded at **`d61ad69bc94b4edd0a47449d9f9065334f1bf3cd`**, with `validation=release` and `production_smoke=true`. The production module is **`/assets/index-CsRgw6CV.js`**, matching the tested build. Subsequent evidence/recorder-only updates do not change that bundle.


| Check | Result |
| --- | --- |
| TypeScript, ESLint, production build, whitespace check | Passed |
| Worker unit tests | 11 passed |
| Axe WCAG 2 A/AA and 2.1 A/AA | 8 page/dialog states across LV/EN and desktop/phone, zero violations |
| Full Chromium regression suite | **75 passed**, no failures/flakiness |
| Native macOS WebKit regression suite | **74 passed**, one intentionally Chromium-only recording skipped; no failures/flakiness |
| Actual live production smoke | **2 Chromium + 2 native macOS WebKit passed**, LV and EN at `https://pie.pe` |
| Release smoke against actual local Workers runtime | 2 passed, LV and EN, `TEST_URL=http://127.0.0.1:4194` |
| Existing Cloudflare Worker | Existing Git integration published the tested bundle to `piepe`; domain/settings retained |
| Cinematic geometry/readiness | Delayed network, identical world DOM/grade/crop at 0–1s; three local fungus edge anchors; portrait/16:10/ultrawide |
| Photo handoff | Aperture trajectory continuity and uniform image scale; desktop/phone, reverse, halfway Escape, missing ending image |
| Interaction | Language change during decoding, skip/cancel/repeat, blocked autoplay/stall/load timeout, denied storage, session/replay, focus restoration |
| Existing 2.1 contract | LV/EN raw HTML/no-JS facts/metadata/hreflang, dictionary parity, note collection/download, exact 5K/4K/phone wallpaper sizes, lazy full assets |
| Native-scroll and responsive layout | Both languages at 1440×900, 1512×982, 2560×1080, 390×844, 390×664, 320×690, 430×932, 844×390; no horizontal overflow |
| Actual local Workers media/security | All four films complete; exact 206/416 and strict 404; CSP-enforced interaction and exact build module |

The full suite covers decoded readiness, matching plane/grade, local edge anchors, forward/reverse scene envelopes, interrupted photo moves, scroll retention, responsive crops, accessible tabs/focus, both languages, denied storage, media errors and recovery, real source popups, the formerly occluded plus control, native audio, autoplay recovery and persistent mute. The browser recording case is Chromium-only by design; native WebKit skips that single case and runs every functional/media test.

Production smoke navigated the actual LV/EN routes in both browser engines, compared the live module against the built module, let all four films finish, exercised discovery/focus, downloaded the note and phone wallpaper, changed language, returned/replayed/skipped, checked all four media assets for 206/416 and verified strict 404/favicon behavior. Full compressed regression/production reports for both engines are under [qa/v22](qa/v22).

## Mobile lab comparison

Measurements use Lighthouse mobile simulation against local `wrangler dev --local`: same Linux Chromium 154, Lighthouse version/configuration, default simulated mobile CPU/network and fresh browser profiles. The final three runs and a refreshed three-run 2.1 baseline were measured in the 13:41–13:47 UTC window on the same host, without concurrent browser testing, recording or encoding. Every run is retained, including the slow final observation. The table uses this complete replacement series rather than selecting the earlier faster observations. These are **lab measurements, not field Core Web Vitals or physical-phone results**.

| Release | Mobile performance (3 runs) | Median FCP | Median LCP | Median TBT | CLS | A11y / Best practices / SEO |
| --- | --- | --- | --- | --- | --- | --- |
| 2.1 | 92, 81, 81 | 1.12s | 4.43s | 140ms | 0 | 100 / 100 / 100 |
| 2.2 | 91, 87, 68 | 0.99s | 0.99s | 426ms | 0 | 100 / 100 / 100 |

[Full measurements and settings](qa/v22/performance.json); compressed Lighthouse and regression reports are adjacent.

The late LCP candidate in the old waterfall was a newly client-created header control. Hydration keeps its initial paint; the full-screen background/video is not a reliable LCP candidate. A high score therefore does not measure film quality, imply instant completion of the intentional six-second film, or prove a phone GPU frame rate. TBT increased in the replacement series and varied considerably (final 241–2144ms; median 426ms versus 140ms on 2.1); median LCP improved, but blocking time remains a regression in this lab series. The host calibration also varied substantially (benchmark index 827–1561.5 across the six runs). Further main-thread work and physical-device profiling remain useful. Full JPEG wallpapers and downstream videos are not requested on arrival. Final client JS is approximately 132kB gzip (2.1 approximately 127.44kB); no dependency was added.

The final playback profile is measured separately from screen recording; see `qa/v22/playback-before-compositing.json` and `qa/v22/playback-after-compositing.json`. It describes this Linux headless environment, not a native Mac GPU or physical phone.

## Motion review references

Read [the owner's curated review](V22_MOTION_SKILLS_REVIEW.md) and the selected upstream `review-animations`/`STANDARDS`, `animate`/modal/WAAPI recipes, `animation-performance` and `mobile-native` at `emilkowalski/skills` commit `2d228630ba1446365f614a108cb8252f1feda202`. They were used as design/review guidance, not installed/executed code. The cinematic 1000ms camera move is deliberately distinct from a frequently used UI entrance; no spring/blur/runtime was added.

| Before | After | Why |
| --- | --- | --- |
| Modal replaces the forest on activation | Same graded world plane until the shot ends | Preserve the fungus anchor and exposure before any overlay change |
| Poster/empty decode window can become visible | Held image until a presented video frame | Make media readiness a condition of exposure |
| Shot replaced by separately cropped photo | One uniform source image and clipping aperture | Continue the camera sensation without a double silhouette |
| Closing mid-move can restart from an endpoint | Capture current transform/aperture before reversing | Make Escape interruption safe |
| Touch can retain rotating hover decoration | Rotation gated by hover/fine-pointer capability | Avoid sticky touch hover motion |
| Server content discarded and cover resized on boot | Matching App hydration and initial cover geometry | Remove the measured LCP delay and startup shift |

Motion review approves the recorded Chromium handoffs. Native macOS WebKit regression and live LV/EN smoke also passed; this is distinct from physical-device or manual Safari application testing.

## Native WebKit follow-up

The first source commit `691a38c` passed all **52 Chromium CI tests**. Its native macOS job exposed ten failed cases: three were already present on the 2.1 baseline; seven were new cinematic checks. The downloaded reports and traces were inspected rather than treating the action's Node.js warning as the cause.

A real compact-phone language switch moved the document by 51px when translated facts changed height. The selected scroll position is now restored in the locale commit, with an added LV→EN→LV→EN regression. The decoded full-frame photograph is painted before its camera clock starts, avoiding elapsed animation time during initial surface preparation. Photo animation layers receive temporary compositor hints, restored on completion, and the retained world stops painting while the opaque top-layer photograph owns the viewport. The world becomes visible in the same layout commit before the native dialog closes.

Continuous trace screenshots at Retina/ultrawide dimensions took 12–21 seconds on the macOS runner and consumed the intentionally bounded four-second media loading window. Readiness tests now record geometry/timestamps without holding media hostage to screenshot encoding; DOM/network traces and failure screenshots remain, and the independent real before/after recordings are retained. Keyboard focus retention uses keyboard activation, respecting Safari's pointer-focus behavior. The sixteen static locale/viewport checks and eight real media checks retain every assertion as isolated cases, with correct 1× ultrawide, 2× Retina desktop and 3× phone contexts; they no longer stretch a 3× iPhone into an eight-thousand-pixel desktop rendering. Resize checks await the actual cover-plane update before assessing overlap. The natural photo frame-count, uniform-scale, speed and interruption assertions remain enabled. The scale check bounds the measured difference to less than one rendered CSS pixel across the 1920px source width; the previous four-decimal scale tolerance allowed only 0.096 CSS pixels. Local unforced WebKit measurements showed up to 0.58 CSS pixels; forcing style synchronization stalled the renderer, so the test retains natural playback and logs its maximum measured error. They sample the actual moving interval separately from decoded-surface preparation, without pausing/seeking the animation or relaxing the frame count. A second macOS run improved from ten to six failures and exposed the remaining clip-path painting cost. The final camera therefore uses only native transform/opacity keyframes, with a fixed overflow clipper and inverse source-image transforms; no per-frame layout or React update is used. A standalone Linux WebKit check of the real returning-visitor photo path observed 22 desktop and 35 phone moving frames; it is software-renderer evidence, not a physical-device or macOS result. CI actions use their official Node 24-based v7 releases, and the Chromium host is pinned to Ubuntu 24.04 alongside its existing Noble browser container.

The final protected run passed **74 native macOS WebKit tests** plus **both live production locales**. Its natural photo move produced 29 sampled moving frames on the MacBook context and 25 on the compact phone context; maximum measured scale errors were 0.0080 and 0.0450 CSS pixels across the source width (the archived console initially labels this unit “source pixels”; its formula is `abs(width/1920 - height/1080) * 1920`, which yields CSS pixels). Chromium produced 58/60 moving samples. These are runner observations, not physical display frame-rate guarantees.

The preceding `e8d8799` run passed 73 native tests and failed the old four-decimal shape assertion on the phone; it also encountered browser-download timeouts and failed artifact upload with `ENOTFOUND`. Its recovered job log was inspected. The final `d61ad69` run successfully uploaded both engines' reports and passed without retries or unexpected/flaky tests.

## CI usage optimization

Commit **`a9841d0888eae17147042b78c3a043534b602f20`** contains only the workflow and README changes. Relevant `main` pushes and PRs now run TypeScript, ESLint, Worker tests and the production build on Linux. Docs, source masters and unrelated uploads do not trigger it. Full browser suites run from **Actions → Forest QA → Run workflow → release**; diagnostic single-browser choices are explicitly not release validation. `production_smoke=true` always selects both full suites and both live locale checks. Newer commits cancel obsolete automatic/diagnostic runs; unique manual release groups cannot be canceled by pushes.

Automatic run [40696510441](https://github.com/aigars-avotins/piepe/actions/runs/40696510441) passed its lightweight job in **31 seconds**, with both browser jobs skipped. Earlier browser jobs used approximately **5.6 Linux + 6.4 macOS minutes** per push. Each normal source push now avoids both browser jobs; the five recent master-only uploads would avoid five entire workflows/ten browser jobs. Savings depend on future commit frequency, and deliberate release runs still pay for both engines. No deployment behavior, security/media assertions or runtime assets were removed. `main` currently has no required checks (`protected:false`), so excluded PRs do not strand protection checks. README documents the need for an always-on gate if protection is enabled later.

## Release status and remaining limits

GitHub and Cloudflare authentication are working. The owner's existing Cloudflare Git integration automatically publishes pushes to the existing Worker **`piepe`**; it published the 2.2 candidate before the final release run finished. No manual deployment, extra Worker, Pages project, domain change or security-setting change was made by this task. This report distinguishes automatic publication from validation: **release validation is established by the final successful full regression and real production run above**, not the earlier upload alone.

The checked production version at the final validation checkpoint is **`6302a555-9244-4b58-bead-0597bcda7de3`**, serving `/assets/index-CsRgw6CV.js` at both `/` and `/en/`. Earlier stable 2.1 version **`c16231d7-e628-43b7-86de-e772e94bf066`** remains in the existing rollback history. A later evidence-only commit can trigger the owner's unchanged Git deployment again while serving the same tested runtime bundle. Live checks confirm CSP, canonical language routes, strict unknown-asset 404, the audio asset and that original video masters are not published.

Linux WebKit was usable for an additional still-photo camera probe after extracting host libraries outside the repository, but its local GStreamer cache permissions prevented reliable video decoding. It is not represented as a passing full media test. The successful native macOS CI uses the real WebKit engine and macOS media stack; it does not establish a manual Safari application session, a physical iPhone, Android GPU performance or field Core Web Vitals.

The existing Edinburgh reference returns 200. Woodland Trust returned 403 to the independent retrieval attempt; the UI's opener-safe external link and accurate existing bilingual biological content remain preserved. Search Console/DNS/index submission remains the owner process in [V21-SEO.md](V21-SEO.md).
