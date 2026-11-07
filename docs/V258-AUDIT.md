# PIE.PE 2.5.8 — verified audit

Review: 2026-11-07, Europe/Riga. Baseline: released 2.5.7, `d95b1d30ecd9f02046ea83c1a1bb006b23723be5`. Branch: `codex/piepe-v258-forest-experience`. **Candidate only: no main merge or production deployment is authorized for 2.5.8.** Read Issue [#25](https://github.com/aigars-avotins/piepe/issues/25), including [the seven-domain review](https://github.com/aigars-avotins/piepe/issues/25#issuecomment-6704173286) and [the six-concept addendum](https://github.com/aigars-avotins/piepe/issues/25#issuecomment-6704214859), in full before editing.

## Production diagnostics before feature changes

Fresh production verification: **144 checks pass** through the managed environment's verified-TLS proxy, using real curl requests without a forged Googlebot identity. [105 route/asset results](qa/v258/baseline-http.json), [39 resource/redirect results](qa/v258/baseline-resources.json), [media security headers](qa/v258/baseline-media-headers.json). Raw responses/commands are retained in the execution workspace `/workspace/piepe258-qa`; concise public receipts are committed here.

- All **20 canonical URLs** return GET **200** and HEAD **200**, correct HTML MIME, one H1, original built title/canonical/reciprocal lv/en/x-default, JSON-LD and exact CSP. Every nested note route is actual HTML, not a homepage fallback or challenge page. Original guide revision markers remain 2.5.6 in this baseline, intentionally.
- All **19 non-root slashless variants** return GET/HEAD **307** to the corresponding slash URL. A real query probe preserves `?from=audit`. The canonical forms are consistent across head/sitemap/internal links. HTTP→HTTPS returns **301**, including a deep note URL.
- Robots/sitemap are available and match the release; six unknown routes return actual **404**. All **17 unique stylesheet/icon/manifest/font preload resources** found in real heads return **200**; no empty head href is present. No missing nested index or Rollup route input is reproduced.
- Four films return exact initial source bytes with **206** and correct **416** for unsatisfiable ranges. Media responses actually retain CSP, nosniff and one-day revalidation cache policy, including generated range responses. We verified this rather than assume `_headers` automatically affects every Worker response.
- Fingerprinted assets/fonts have the existing one-year immutable policy. Stable wallpaper URLs retain one-day `must-revalidate`; no unsafe immutable rule was added. The 22 recorded non-movie public assets have exact baseline SHA-256 matches; four movies have matching size and requested bytes.

This proves accessibility from this execution network at the recorded time. It does **not** prove every crawler is authorized or that Google has indexed a page. The external fetcher's reported PERMISSION_DENIED is not reproduced as a website 403/404. A second independent network check is reserved for final native CI; genuine Google URL Inspection requires the owner's account. No WAF, DNS, Worker routing, SSL or security setting is changed.

Permanent slash redirects were evaluated: existing 307 redirects are coherent and finite, and canonical signals are correct. No observed indexing/route failure justifies modifying the routing integration for a generic 301 preference. The correct nested build pattern is retained.

## Findings across the supplied review

| Supplied concern | Verified status / decision |
| --- | --- |
| Broken nested routes, missing robots/sitemap, SPA fallback | **Verified existing** — all 20 GET/HEAD plus genuine 404s pass. External fetch restriction is not evidence of a product defect. |
| Empty stylesheet/touch-icon/manifest URLs | **Verified existing** — actual generated and live heads/resources are correct. |
| Missing Vite multi-entry routing | **Rejected with evidence** — existing prerender already generates 20 nested HTML documents. No route architecture/Rollup input changes. |
| Two-part brand logo | **Verified intentional identity** — mark and wordmark remain unchanged; no speculative inline conversion. |
| LV/EN home links / corresponding note switches | **Verified existing** — central localized paths and pre-release live HTML agree. The candidate retains this inventory. |
| Static-page skip links | **Verified existing** — all 18 static documents tested without JS; Enter focuses `main#reading`, one H1 and no phone overflow. |
| Native modal / custom focus trap | **Verified existing** — actual `:modal`, Escape and exact opener restoration work. Interactive Tab stops stay in the modal; Chromium can transition through browser chrome (`BODY` as activeElement), without focusing a background control. No custom trap is introduced. |
| Repeated audio announcements | **Not reproduced** — two controls exist in DOM because one belongs to a closed native dialog; only one is accessible. One description, no live-region audio spam. Necessary descriptions are retained. |
| Field-note card names | **Verified existing** — number, short heading and one poetic motif form meaningful accessible names. No arbitrary character limit or stretched-link rewrite. |
| Offscreen/duplicate video playback | **Verified existing** — one playing film maximum in sampled journey, zero videos after returning to the forest. A finished intro may remain paused for its existing 650ms handoff; that is not simultaneous playback. No conflicting observer or camera rewrite. |
| Audio initialization/depth | **Measured extension** — baseline creates one suspended context before a gesture, but makes no audio request. Candidate defers context creation to a trusted gesture and adds a gentle optional low-pass in the same graph. Filter failure retains the original unfiltered recording. |
| Font preloads / Latin Extended | **Verified existing / measured** — original fonts/coverage retained. The paired mobile waterfall confirms Latin and Latin Extended font requests in LV; no measured reason for speculative preload removal or `size-adjust`. |
| Stable wallpaper immutable caching | **Rejected** — filenames are stable; existing one-day revalidation remains. |
| Source references / numbering | **Editorial/accessibility improvement** — old IDs and source mappings are correct. First appearances were [1][3] before [2]; reorder the same bibliography to first-use order. Source LI targets scroll correctly but leave focus on BODY; add `tabindex=-1` and a visible target/focus treatment. |
| Reading-guide ending | **Approved navigation enhancement** — add restrained matching-language collection/gallery links beside the original return. |
| Note 001 scientific framing | **Verified existing** — three original literary observations and exact downloads remain literary; no invented field record. |
| Extra Latvian source for ranking | **Rejected** — no artificial local-authority signal. Existing local species notes remain sourced; new generic explanatory biology uses suitable botanical/ecological references. |
| Gallery structured data | **Verified existing** — two truthful ImageObjects already match real dimensions/captions; no duplicates or unsupported creator. |
| BreadcrumbList | **Supported enhancement** — six notes have a real visible collection → note trail. Candidate labels the current note explicitly and adds that same two-step hierarchy to the existing WebPage document. No invented gallery/article hierarchy. |
| x-default Latvian | **Verified existing** — intentional default language, not an SEO error. |
| Audio continuity across documents | **Rejected** — no router, reading-page autoplay or SPA conversion. |
| Original iOS wallpaper saving | **Verified existing** — original links/hint plus gallery's device-neutral saving instructions retained. No UA sniffing. |
| CSP / security headers | **Verified existing in production** — exact baseline policy and expected headers, also on sampled media/ranges. Candidate extends only hashes required for its authored scripts/data. No unsafe script directive. |
| HSTS preload/includeSubDomains | **Requires separate owner decision** — not enabled. Current HTTPS works; no unsupported claim that all subdomains were independently assessed. |
| External new-tab links | **Audit retained** — scientific references use ordinary same-tab links; existing download tabs use noopener. No blanket attribute changes. |
| Search indexing / Google tools | **Requires owner account** — no GSC action, Rich Results browser submission, indexing or AI-citation claim. |

## Measurement and accessibility limits

[Baseline browser findings](qa/v258/baseline-browser.json): 18 JS-disabled skip checks, 16 guide/note layouts across LV/EN and 390/540/800/1440, real accessible card names/audio state and native dialog behavior. Baseline desktop main-thread heap/node snapshot is observational; GPU allocation and whole-system decoder CPU are not exposed by these browser APIs. Do not call it a GPU-memory measurement or leak test.

[Cold homepage baseline samples](qa/v258/performance-before.json): three contexts per language, Chromium 390×844 DPR1, 4× CPU slowdown, local unthrottled network, actual complete intro and a locale interaction. These are lab observations, not Lighthouse, field CWV or 75th-percentile INP. Matched candidate and throttled reading/mobile results are still required before the PR is marked ready.

Chromium's oversized element screenshot can capture a fixed skip link that remains above the real viewport. We reproduced the capture artifact: the link is not focused and its bottom is −43px both before/after capture; a normal viewport screenshot shows no overlay. Final evidence uses real viewport/full-page captures rather than changing working skip-link CSS to conceal a tooling artifact.

Native macOS Playwright WebKit is not physical Safari/iPhone or spoken VoiceOver verification. Actual VoiceOver output, physical matte/high-glare displays, hardware GPU usage, Google crawling/indexing and field CWV cannot be certified from a Linux/browser accessibility-tree audit. Existing long native camera-cadence limitations from earlier releases are not claimed fixed by these new reading features.

## Candidate validation

### Local checks and HTTP

- `npm ci`, TypeScript, ESLint, production build and **11/11 Worker unit tests pass**. No dependency changes; package version only.
- Real local Wrangler/Miniflare with the unchanged `piepe` configuration: **127/127 HTTP checks pass** — all 20 GET/HEAD documents, exact built CSP and inline hashes, 19 slashless redirects, six real 404s, four films' 206/416 handling, 22 preserved non-movie asset hashes/four movie sizes, robots/sitemap, and all distinct head/module dependencies with actual MIME/cache/ETag/security headers. [Receipt](qa/v258/candidate-http.json). Commands: `npm run build`; `XDG_CONFIG_HOME=/workspace/piepe258-qa/wrangler-config CLOUDFLARE_SEND_METRICS=false npx wrangler dev --local --ip 127.0.0.1 --port 4282`; curl GET/HEAD/range requests as detailed in the receipt. Restart the development server after a clean Vite build: its watched asset manifest can temporarily retain the build's empty intermediate directory. That transient local dev-server state is not a production routing defect.
- Focused local Chromium: **89 passed, one CI-only independent-network check intentionally skipped, zero failures/flaky tests**, 2.7min. [Individual results](qa/v258/chromium-results.json). Covers legacy 2.5.5–2.5.7 SEO/content/routes/downloads, first-paint/hydration/Replay at desktop and phone in LV/EN, actual intro playback, discovery keyboard/Escape/download, retained camera edge anchors, environmental compositor readiness/visibility/replay/native scroll budget, original sound/retry/save-data, and all new controls/real audio fallback/SSR/storage/touch behaviour.
- Browser filter, reused once for native macOS validation: `2\.5\.8|2\.5\.7|2\.5\.6|2\.5\.5|real sitemap|useful educational copy|one connected schema|educational reading fits|decoded frame can reach|opening poster owns every paint|actual film plays once|skip is immediate|discovery is a complete three-step|the decoded first frame retains local fungus edge anchors|sound waits for permission|save-data never starts|native journey.*wheel/keyboard|films pause on a hidden-document`.

Existing static-page tests now allow **only** the exact whitelisted preference bootstrap and the exact locally fingerprinted reading-tools module, while retaining the narrow known production-analytics exception. Arbitrary app/remote/inline injection rejection remains tested. Original guides now have approved extra HTML, so their obsolete whole-document byte assertion is replaced by an **exact full original factual-copy fixture**. Source-hash exceptions are restricted to the explicitly approved reading renderer, bibliography order/focus CSS and audio hook; all other protected cinema files and every protected original media/note file still match. The new all-document DOM/SVG-ID assertion caught and fixed a real gradient/detail namespace collision during development. A genuine touch drag caught a hotspot intercepting the handle; the 44px targets now clear its central sweep. Neither assertion was relaxed to obtain a pass.

### Matched mobile lab measurements

[Full 48-sample dataset](qa/v258/performance-paired.json), [summary and payload/font inventory](qa/v258/performance-summary.json). Chromium 390×844, DPR1, 4× CPU slowdown, isolated cold contexts, alternating before/after order. Three local-network samples per locale/route/version; one additional exploratory 1.6Mbit/s, 150ms RTT sample per combination. Observe through the actual intro end/bounded fallback, fonts, two paints and a 500ms observer-delivery window. No concurrent browser test/build work during sampling.

| Route / language | Local median LCP before → after | Slow4G LCP before → after | CLS before → after |
| --- | --- | --- | --- |
| Cinema LV | 8504 → 8564ms | 15180 → 15240ms | .001355 → .001355 |
| Cinema EN | 8568 → 8640ms | 15308 → 15396ms | .002324 → .002324 |
| Guide LV | 168 → 244ms | 1096 → 1260ms | 0 → 0 |
| Guide EN | 180 → 272ms | 952 → 1140ms | 0 → 0 |
| Note 005 LV | 160 → 256ms | 1116 → 1464ms | 0 → 0 |
| Note 005 EN | 172 → 264ms | 976 → 1308ms | 0 → 0 |

The cinema's LCP observes its deliberate evolving film/final poster; do not interpret it as a conventional text-page first render or claim good field LCP. Slow4G triggers the **existing** intro `load-timeout` in both versions; this release does not conceal that limitation or lower media quality. Local median observed blocking time varies (LV135→204ms, EN123→103ms); this small noisy sample does not establish a CPU improvement. Recorded candidate reading interactions stay ≤40ms in these samples; cinema samples reach144ms. Event Timing only reports entries over16ms and this is **not field INP**.

The homepage adds234 gzip bytes of HTML, 402 of shared CSS and1168 of app JS (Python gzip, consistent method). The static controls module is3790 raw/1324 gzip bytes; experience CSS8491/2401. LV guide HTML rises3636→11640 gzip bytes; note0053516→13469, primarily original inline SVGs and all SSR captions. Those additions are confined to the educational pages and do not load new films/audio. The guide reuses an existing lazy, low-priority158KB poster. Font display remains `swap`; real LV requests include both Latin and Latin Extended subsets. Removing these without a demonstrated benefit risks Latvian glyph coverage and first-paint metrics.

### Visual review

Both languages reviewed at390/540/800/1440px, including a540px foldable-style viewport at DPR2; no horizontal overflow or page errors. [Layout/hero-pixel receipt](qa/v258/visual-review.json). Original Morning hero pixels match the baseline in the sampled image region. Nightfall changes accents; an unobstructed reference image region is exactly equal, and the larger comparison region differs by at most one RGB level after scrolling back, without a media filter or brightness reduction.

Before: [LV guide](qa/v258/before-lv-guide-390.webp), [EN guide](qa/v258/before-en-guide-1440.webp), [note005](qa/v258/before-lv-deadwood-390.webp). After: [LV reveal phone](qa/v258/after-lv-xray-390.webp), [EN reveal800px](qa/v258/after-en-xray-800.webp), [LV capsule desktop](qa/v258/after-lv-time-1440.webp), [EN capsule phone](qa/v258/after-en-time-390.webp), [expanded pores](qa/v258/lv-atlas-0-1440.webp), [smooth/teeth phone](qa/v258/en-atlas-2-390.webp), [Morning](qa/v258/home-after-morning-390.webp), [Nightfall](qa/v258/home-after-night-390.webp).

Capture refinement: full-page guide images are taken from real `scrollY=0` before cropping to the recorded module coordinates. This avoids the fixed off-viewport skip-link raster artifact without changing product CSS or hiding a control. The actual viewport recordings are the authority for interaction/compositing.

Final native macOS results, independent public-network receipt, short interaction/cinema recordings and cadence observations are appended after the one focused native run. This is still a review candidate; production remains2.5.7.
