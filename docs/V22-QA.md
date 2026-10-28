# PIE.PE 2.2 — cinematic continuity and release evidence

Date: 2026-10-28. Implementation starts from `52a7487`; the subsequent documentation updates through `431bc98772b163a6e82bd0c90e10c5645943344f` were fetched and fast-forwarded without discarding work. `docs/ISSUE_4_FULL_SPEC.md` is authoritative. After the environment was restored, the live 2.1 module `/assets/index-CDLhGDet.js` was confirmed to match the frozen before-build. Production access and authenticated Cloudflare/GitHub API access now work.

## Awakening → Understory: primary handoff

The additional owner feedback is preserved in [V22_OWNER_POLISH.md](V22_OWNER_POLISH.md). The 2.1 chapter observer mounted a new opaque fullscreen composition at an intersection threshold. Its replacement was exposed before matching camera/foreground timing and media readiness, producing a full-frame cut between deliberately different compositions.

The macro now prepares and decodes its stills before the entrance envelope, then starts filmed movement after the existing camera scrub settles, and remains invisible until a poster or real video frame is ready. Its persistent layer sits behind the original moving bark foreground and the common grading. The existing native-scroll camera provides the optical push; a restrained 1.08→1 macro settling motion follows the same reversible scroll progress. The bark provides an occlusion carrier between the two deliberately different compositions and leaves the picture when the macro becomes opaque. The common forest vignette remains above the films; old multiply/screen color-light layers and duplicate decorative atmosphere remain behind them. CSS atmosphere and offstage fungus-edge painting pause while film content is active. The wide shot reaches full opacity before its camera settles, avoiding expensive compositing through a nearly transparent earlier forest. This directly addresses the large-viewport frame drops measured during review. Leaving/re-entering retains a held still and never remounts a fullscreen stage. Late or unavailable media leaves the forest visible instead of exposing a blank stage. No blur, scroll hijack or new animation library was added. Comparing an initial 2.2 compositing draft with the optimized 2.2 candidate (not a 2.1/2.2 benchmark), the recorded software-rendered profile improved macro dropped frames from 48→1 at 1512×982 and 76→1 at 2560×1080; the outro improved from 59→5 and 86→7 respectively (145 decoded frames per clip). Phone results remained approximately 16.7ms at the 95th percentile, with one dropped macro/outro frame each. These are single local observations, not device or field guarantees.

## Reveal, awakening and discovery

The visible jump was primarily a compositing/lifecycle defect. Clicking the fungus immediately opened a top-layer dialog, removing the original forest grading, header and title and mounting another fullscreen stage. Equal cover dimensions did not preserve the visible scene: lighting and surrounding layers changed before a decoded video frame was guaranteed. At the other end, a fullscreen shot was replaced by a separately cropped note photograph.

The first decoded awakening frame already matches the held forest remarkably closely. Local SIFT registration of the fungus ROI `(890,370)–(1680,900)` found 676 inliers and median displacement **0.188 source pixels** (the earlier preflight with different detector settings found 704 / 0.188). This is local feature registration, not a global mean-RGB acceptance test. The actual reveal ending has a small source difference: 531 inliers, median displacement 1.98 pixels, approximately 1.0123 relative scale. Its existing short settling dissolve is retained. The source footage does not warrant replacement generation.

- **World → awakening:** mount the video inside the existing `.base-camera .media-plane`, under the same `.forest-shade` and camera transforms. Hold `forest-final.jpg` throughout loading. Expose only a decoded/presented frame using `loadeddata` plus `requestVideoFrameCallback` (RAF fallback). A short 160ms opacity refinement follows that gate; it does not substitute for correcting geometry. Hero text leaves only once the frame is ready. No modal or independent crop is introduced on activation.
- **Awakening → note:** retain the actual ending and move one source image into the observational crop. The native dialog opens for the note after playback. WAAPI animates a fixed overflow clipper with inverse image transforms and two grading opacities for 1000ms. Their combined image matrix stays uniform in world coordinates; the existing world grading is counter-transformed while the destination grading follows the aperture. No `clip-path`, `width`, `height`, `left`, `top` or `object-position` is animated. Text becomes readable after settling; instant skip remains available. Closing reverses from the current frame, including Escape halfway through the move. A generation guard prevents an interrupted completion from resetting the new animation.
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

These are **real local Chromium browser recordings**, not production captures or rendered mockups. The screencast MP4s are silent; sound behavior is checked separately with the real native audio graph and the supplied recording. CDP JPEG frames retain browser timestamps and are encoded at 30fps; the pointer ring is a QA annotation. The same supplied films play at their normal speed. Scrolling in the capture is scripted through the native document scroll position; the app does not intercept wheel/touch scrolling. Event logs distinguish loaded data, playback, presented frames, endings and dialog state. The timing extracts are quantized to the recording frame interval (roughly 33ms), rather than claiming sub-frame precision.

| Viewport | Before | After |
| --- | --- | --- |
| Awakening → Understory, 1512×982 | [recording](qa/v22/before-understory-macbook.mp4) | [recording](qa/v22/after-understory-macbook.mp4) |
| Awakening → Understory, 390×664 | [recording](qa/v22/before-understory-phone.mp4) | [recording](qa/v22/after-understory-phone.mp4) |
| Reveal → Awakening → note, 1512×982 | [recording](qa/v22/before-macbook.mp4) | [recording](qa/v22/after-macbook.mp4) |

Full-size recordings at **1440×900, 1512×982, 2560×1080, 390×844 and 390×664**, every event log, screenshots and timestamped `−200, 0, +100, +250, +500, +1000ms` extracts are retained in `/workspace/piepe22-qa/before/` and `/workspace/piepe22-qa/delivery/`. Representative committed before/after comparisons and viewport contact sheets are available under [qa/v22](qa/v22). The full forward/reverse macro/outro journeys are retained in `/workspace/piepe22-qa/journey-before-{standard,desktop,ultrawide,mobile,phone}/` and `/workspace/piepe22-qa/delivery/{1440x900,1512x982,2560x1080,390x844,390x664}/`.

Reproduce with `scripts/capture-seams.mjs` and `scripts/capture-review.mjs`; see README for target/output/viewport options. Keep an exported, unchanged baseline separate from working source. The before baseline predates only documentation changes on main; it has the same 2.1 runtime implementation.

## Validation

| Check | Result |
| --- | --- |
| TypeScript, ESLint, production build, whitespace check | Passed |
| Worker unit tests | 11 passed |
| Axe WCAG 2 A/AA and 2.1 A/AA | 8 page/dialog states across LV/EN and desktop/phone, zero violations |
| Full Chromium regression suite | 51 passed, 1 deliberately skipped CI-only production recording |
| Release smoke against actual local Workers runtime | 2 passed, LV and EN, `TEST_URL=http://127.0.0.1:4194` |
| Wrangler deployment package | Dry-run passed, 62 static files; **no upload** |
| Cinematic geometry/readiness | Delayed network, identical world DOM/grade/crop at 0–1s; three local fungus edge anchors; portrait/16:10/ultrawide |
| Photo handoff | Aperture trajectory continuity and uniform image scale; desktop/phone, reverse, halfway Escape, missing ending image |
| Interaction | Language change during decoding, skip/cancel/repeat, blocked autoplay/stall/load timeout, denied storage, session/replay, focus restoration |
| Existing 2.1 contract | LV/EN raw HTML/no-JS facts/metadata/hreflang, dictionary parity, note collection/download, exact 5K/4K/phone wallpaper sizes, lazy full assets |
| Native-scroll and responsive layout | Both languages at 1440×900, 1512×982, 2560×1080, 390×844, 390×664, 320×690, 430×932, 844×390; no horizontal overflow |
| Actual local Workers media/security | All four films complete; exact 206/416 and strict 404; CSP-enforced interaction and exact build module |

The full suite includes 13 added cinematic/hydration cases (including transient frame-readiness recovery and forward/reverse scene envelopes) and five owner-polish cases covering actual source popups, the formerly occluded plus control, macro readiness, native audio playback, autoplay recovery, persistent mute, save-data and missing-audio retry. The unchanged CI-only comparison recording intentionally requires CI and production connectivity; the separately captured local before/after evidence above covers this task. The explicit release-smoke file has “production” in its name, but this run targeted the **local** Workers runtime and does not establish production success.

## Mobile lab comparison

Measurements use Lighthouse mobile simulation against local `wrangler dev --local`: same Linux Chromium 154, Lighthouse version/configuration, default simulated mobile CPU/network and fresh browser profiles. After restoring the environment, three sequential final runs and three sequential baseline runs were made on the same host without concurrent browser testing/recording. The table uses this complete replacement series rather than selecting the earlier faster observations. These are **lab measurements, not field Core Web Vitals or physical-phone results**.

| Release | Mobile performance (3 runs) | Median FCP | Median LCP | Median TBT | CLS | A11y / Best practices / SEO |
| --- | --- | --- | --- | --- | --- | --- |
| 2.1 | 81, 86, 82 | 1.06s | 4.41s | 104ms | 0 | 100 / 100 / 100 |
| 2.2 | 95, 98, 88 | 0.89s | 0.89s | 175ms | 0 | 100 / 100 / 100 |

[Full measurements and settings](qa/v22/performance.json); compressed Lighthouse and regression reports are adjacent.

The late LCP candidate in the old waterfall was a newly client-created header control. Hydration keeps its initial paint; the full-screen background/video is not a reliable LCP candidate. A high score therefore does not measure film quality, imply instant completion of the intentional six-second film, or prove a phone GPU frame rate. TBT increased in the replacement series and varied considerably (final 150–460ms); the LCP improvement is reproducible, but further main-thread work and physical-device profiling remain useful. Full JPEG wallpapers and downstream videos are not requested on arrival. Final client JS is approximately 132kB gzip (2.1 approximately 127.44kB); no dependency was added.

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

Local motion review: **approve the visually reviewed Chromium handoffs**. Native macOS/physical-device and production release verification remain pending for the concrete access reasons below.

## Native WebKit follow-up

The first source commit `691a38c` passed all **52 Chromium CI tests**. Its native macOS job exposed ten failed cases: three were already present on the 2.1 baseline; seven were new cinematic checks. The downloaded reports and traces were inspected rather than treating the action's Node.js warning as the cause.

A real compact-phone language switch moved the document by 51px when translated facts changed height. The selected scroll position is now restored in the locale commit, with an added LV→EN→LV→EN regression. The decoded full-frame photograph is painted before its camera clock starts, avoiding elapsed animation time during initial surface preparation. Photo animation layers receive temporary compositor hints, restored on completion, and the retained world stops painting while the opaque top-layer photograph owns the viewport. The world becomes visible in the same layout commit before the native dialog closes.

Continuous trace screenshots at Retina/ultrawide dimensions took 12–21 seconds on the macOS runner and consumed the intentionally bounded four-second media loading window. Readiness tests now record geometry/timestamps without holding media hostage to screenshot encoding; DOM/network traces and failure screenshots remain, and the independent real before/after recordings are retained. Keyboard focus retention uses keyboard activation, respecting Safari's pointer-focus behavior. The sixteen static locale/viewport checks and eight real media checks retain every assertion as isolated cases, with correct 1× ultrawide, 2× Retina desktop and 3× phone contexts; they no longer stretch a 3× iPhone into an eight-thousand-pixel desktop rendering. Resize checks await the actual cover-plane update before assessing overlap. The natural photo frame-count, uniform-scale, speed and interruption assertions remain enabled. They sample the actual moving interval separately from decoded-surface preparation, without pausing/seeking the animation or relaxing the frame count. A second macOS run improved from ten to six failures and exposed the remaining clip-path painting cost. The final camera therefore uses only native transform/opacity keyframes, with a fixed overflow clipper and inverse source-image transforms; no per-frame layout or React update is used. A standalone Linux WebKit check of the real returning-visitor photo path observed 22 desktop and 35 phone moving frames; it is software-renderer evidence, not a physical-device or macOS result. CI actions use their official Node 24-based v7 releases, and the Chromium host is pinned to Ubuntu 24.04 alongside its existing Noble browser container.

The follow-up native CI result must be observed before describing this release as Safari-verified.

## Release status and remaining limits

Authenticated access was recovered on 2026-10-28. `https://pie.pe/` returns 200 and its 2.1 module matches the frozen local baseline. `wrangler deployments list` succeeded for existing Worker `piepe`; the current rollback version before release is `c16231d7-e628-43b7-86de-e772e94bf066`. GitHub API confirms push/administration access. The previous proxy/token blockers are resolved.

At this source-review checkpoint, **2.2 has not yet been deployed**. Commit/push, native macOS CI, existing-Worker deployment, exact-build LV/EN production smoke and real production recordings follow. Their actual results will be recorded after release; successful local tests are not a production claim.

Linux WebKit 27.2 now downloads successfully, but its GTK/GStreamer host dependencies are absent. The repository's native macOS WebKit job is the relevant Safari media verification. No physical iPhone or mid-range Android GPU test is claimed. Earlier main's macOS job already failed, so its new result must be inspected rather than presumed successful.

The existing Edinburgh reference returns 200. Woodland Trust returns 403 from the remote site, so that article could not be independently retrieved. Existing species-agnostic bilingual biological content and the AI-media disclosure are preserved; no new biological claim was introduced. Search Console/DNS/index submission remains the owner-only process in [V21-SEO.md](V21-SEO.md).
