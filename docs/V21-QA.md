# PIE.PE 2.1 — implementation validated locally; production pending

Date: 2026-10-28. Base: latest `main`, `0d529239d42388e44dcf7d5c7b01176cb39e4656`, including the complete local Issue #3 specification. The completed 2.0 release was preserved; this report does not claim a new production deployment.

## Implemented

- Original intro, watchdog/skip/replay/session behavior and the native GSAP four-state camera retained. Original media, design sources, Worker range code and `wrangler.jsonc` are unchanged.
- On-fungus awakening → accessible three-observation note; distinct scroll-entering moss macro and wide breathing conclusion. One-shot page/session history, no overlapping playing streams, offstage release, hidden-tab pause, preference/failure recovery and still-image fallbacks.
- Complete typed LV/EN interface, stories, labels, error copy and field notes. Explicit language links preserve the current introduction, dialog/observation and scroll; browser back/forward and storage denial are covered.
- Crawlable LV `/` and EN `/en/`, localized source HTML and metadata, reciprocal alternates, sitemap, truthful JSON-LD and matching CSP hashes. Strict 404 behavior retained.
- Approved vector mark, palette, genuine multi-resolution ICO, Apple/mobile icons, social image, three wallpaper JPEGs and two lazy previews. Original PNG sources preserved; outputs are transparently described as enlargements.

## Checks

| Check | Observed result |
| --- | --- |
| TypeScript, ESLint, production build | Passed |
| Existing + extended Worker suite | 11 passed |
| Full Chromium suite | 33 passed, 1 intentionally skipped CI-only recording |
| Final mobile typography/touch-area viewport recheck | Passed in both locales over the complete matrix |
| Release smoke tests against local Workers runtime | 2 passed, LV and EN |
| Workers static routes / security / assets | LV+EN 200, unknown/source routes 404, actual CSP-enforced app interaction passed |
| All four media streams | Natural playback plus 206/416 exact ranges passed locally |
| Clip ending fidelity | Actual decoded frames compared with final stills; all below the test's 10/255 mean-channel-error bound |
| Active playback | Maximum one playing film, in the automated journey and recorded review |
| Dictionary/source HTML | Key parity, localized facts, canonicals/alternates/JSON-LD and no-JS reading passed |
| Downloads | Localized note filenames, collected/focus state, JPEG MIME and exact 5K/4K/phone dimensions passed |
| axe WCAG A/AA | No violations in LV and EN pages or dialogs (4 states) |
| Wrangler deploy packaging | Dry-run passed; no upload or production mutation |

Chromium is Linux system Chromium 154.0.8037.57 with Playwright 1.64.1 and Node 24.19.0. Desktop/mobile sizes are browser emulation, **not physical MacBook/iPhone testing**. Matrix: 1440×900, 1512×982, 390×844, 390×664, 320×690, 430×932, 844×390, plus 2560×1080 ultrawide. Original 2.0 tests remain, scoped to English URLs and isolated from first-time awakening where they specifically exercise the original note; separate tests exercise the new film.

The release smoke command was run with `TEST_URL=http://127.0.0.1:4177`, **not pie.pe**. It verifies exact app module, real intro/awakening/macro/outro completion, localized note and wallpaper downloads, focus/replay/language behavior, all four ranges and 404. A live Wrangler watcher temporarily retained a stale English asset manifest after the build replaced dist; restarting the locally started server against the completed build restored the correct route. Final release checks passed after restart. Production deploy reads the completed build rather than the transient watch state.

## Visual review and performance

The task retains before screenshots from an exported 2.0 baseline and final desktop/mobile/compact screenshots, a real-browser full-journey MP4, 100% wallpaper subject/signature crops, an icon-size board and JSON reports under `/workspace/piepe-qa/implementation` (preflight crops under `/workspace/piepe-qa/wallpapers`). The recording uses actual Chromium CDP screencast frames and browser timestamps, encoded by FFmpeg; it is not a simulated timeline of static images. The script to reproduce it is `scripts/capture-review.mjs`.

Review corrected reduced-motion macro/outro backgrounds, the return heading's subject-safe placement, startup frame/typography flash, image fallback, offstage image loading and minimum 12px/44px mobile language/replay controls. The supplied reveal ending and awakening opening are close but not identical artwork; the implementation uses identical source-plane geometry and an interaction-motivated cut rather than blending two differently framed moving fungi. Pixel-identical source geometry cannot be claimed.

Local Lighthouse mobile simulation after optimization: **Performance 88, Accessibility 100, Best Practices 100, SEO 100**. Simulated FCP 1.0s, LCP 3.9s, TBT 10ms and CLS 0; observed unthrottled LCP in that trace was 252ms. The same-session 2.0 baseline scored 100 for performance, with observed LCP 187ms. This is a real simulation-score regression, not a universal field-speed claim. Bilingual fonts/HTML add network work; the cinematic wordmark also intentionally arrives late. Initial transfer in those runs was about 2266KiB versus 2148KiB. No full wallpaper download or lower-scene film is fetched on arrival. Final app JS is approximately 127.20KiB gzip versus 121.79KiB for 2.0; no frontend dependency was added. These are local lab observations, not production Core Web Vitals or physical mobile frame-rate measurements.

Full-JPEG dimensions/bytes: 5120×2880 / 2,380,472; 3840×2160 / 1,524,282; 1440×3120 / 962,977. At 100% these remain source-limited enlargements; no native-5K detail or AI superresolution is claimed. The final phone crop keeps the real subject and signature outside the clock/control areas.

## Release blockers and remaining work

1. **Cloudflare authentication is absent.** Final `wrangler whoami` reports unauthenticated and `CLOUDFLARE_API_TOKEN` is absent. No deployment or rollback query can be completed securely. The configuration draft declares the required token for `api.cloudflare.com`; supply its value only in secure environment settings, scoped to the existing account/Worker/domain.
2. **Runtime network policy blocks production.** Final `https://pie.pe/` request returned proxy 403. Required domains were added to the environment draft, but a draft save does not apply runtime access. Review/save those settings and publish the environment as required by the product. Then recheck the actual operation before retrying rollout.
3. **Native WebKit/Safari is unverified for 2.1.** Browser downloads returned 403; obtaining the official Playwright container also failed at its layer download. Chromium success does not establish Safari codec/focus/download success. The macOS WebKit CI job is retained and must be checked before rollout. No physical iOS hardware was tested.
4. **Independent scientific-source retrieval is blocked.** The copy is species-agnostic and follows the owner's supplied biological outline and references, but the cited live sources could not be retrieved through this proxy. Complete the independent fact-check before claiming it is finished; see `V21-SEO.md`.
5. The owner's approved assets contain small source-frame differences at the reveal/awakening seam; exact identity is not achievable merely by equal CSS geometry. Review the supplied recording rather than assuming a pixel-perfect source match.
6. Search Console ownership, DNS verification, sitemap submission and real field performance have not been performed. Owner steps are in `V21-SEO.md`.

No new Cloudflare deployment version exists from this work. The previously documented 2.0 version `70a6954d-f95c-4703-a142-985829809650` is historical information, **not a fresh query of the current rollout or verified rollback state**. Do not call 2.1 deployed or fully release-verified yet.

When access is available: verify the source references and macOS CI; record the actual current deployment/rollback version; deploy the already authorized release to **existing Worker `piepe` only**; run the LV/EN smoke tests against `https://pie.pe`; compare all public asset hashes, media ranges and CSP/security behavior; publish actual version/results and update Issue #3. No new Worker, Pages project, domain, certificate or binding change is needed.
