# PIE.PE 2.5.8.1 — Cinematic Visual Showpiece & Homepage Discovery

Feature branch: `codex/piepe-v2581-visual-showpiece`. Baseline: released 2.5.8, main `55263f5a3b8864a5b1a44148a6d1e7d819782f11` (PR #26). Scope: Issue #27 and Visual Showpiece addendum. **Review candidate only: no merge or production deployment is authorized for this milestone.** Package/build version `2.5.9` is valid SemVer; `data-milestone="2.5.8.1"` identifies the editorial milestone.

## Where visitors find the six experiences

After the intro, **Ieskaties zem mizas / See beneath the bark** appears in the first viewport’s existing bottom rail. It leads directly to the working homepage X-Ray at `#forest-xray`, inside `#fungus-facts`. Drag the boundary or use the native range; three numbered links open sourced explanations. Below it, actual atlas and deadwood previews lead to expanded explorations. Morning/Nightfall sits beside this exploration and in reading headers. The desktop chapter rail shows the changing scale of attention. The existing sound button gently explains that the sound shifts as visitors explore.

| Entry | LV | EN |
|---|---|---|
| Hero → actual homepage reveal | `/#forest-xray` | `/en/#forest-xray` |
| Extended reveal and scientific context | `/kas-ir-piepe/#beneath-bark` | `/en/what-is-a-bracket-fungus/#beneath-bark` |
| Three surface studies | `/kas-ir-piepe/#surface-atlas` | `/en/what-is-a-bracket-fungus/#surface-atlas` |
| Four ecological stages | `/meza-piezimes/005-kritalas-un-laiks/#deadwood-time` | `/en/field-notes/005-deadwood-and-time/#deadwood-time` |

Existing Field Notes, glossary, factual observations, sources and wallpaper navigation remain available.

## Audit and design decisions

The released controls already worked: the static progressive module binds handlers before revealing controls, the native atlas expands without JS, the four stage descriptions are prerendered, the saved colour preference is applied before paint, and the audio uses one original recording. Their `hidden` attributes were deliberate fallbacks, not bugs. The homepage had no embedded reveal or obvious route to the new experiences. Modest diagram sizes, flat materials and a footer-only atmosphere choice made the work hard to discover.

Three layout approaches were considered before implementation. A floating drawer would cover the forest and require another focus mechanism. Replacing the fungus activation would disrupt the existing cinematic journey. The selected composition uses the existing hero bottom rail, the existing factual section, a primary full reveal, and two secondary editorial entries. It adds no modal, scroll lock, scene, observer or competing ScrollTrigger.

The small poetic word-meaning line moves to the footer to make room in the hero rail. The original scroll cue, edition and fungus activation remain. The invitation reserves its space while the intro runs; CSS visibility reveals it after completion or skip, without stealing the skip action’s original focus. Without JS the native link is visible. The desktop exploration reserves the existing right-hand chapter/scale rail; mobile uses a single column.

## Materials and scientific honesty

All approved raster sources were inspected, including full-size wallpapers, posters and stills. They are existing cinematic AI artwork. **There is no authenticated pore/gill macro photograph or photographic fallen-log sequence in the repository.** These composites are artistic educational interpretations, not photorealistic scientific observations.

- The reveal combines a sharp downsample of the approved awakening final still with an actual wood-texture crop and fine connected ivory/amber hyphal paths. The boundary clips the surface spatially; it is not an opacity slider. There are no arbitrary spore particles or claims of natural luminescence.
- The atlas has three original directionally lit SVG material studies: recessed pore openings, curved gill plates, and explicitly separate smooth/toothed surfaces. Expanded native panels render the scalable geometry at a substantially larger size.
- A separate pointer-following loupe was considered and rejected: it would add another small-screen gesture/overlay over conceptual geometry, without revealing additional specimen evidence. The large expansion, native keyboard operation, Escape/close and focus restoration provide the useful inspection step. No optical factor or calibrated scale is claimed.
- The 16:9 deadwood scene combines approved forest/bark/moss materials with four different trunk silhouettes, fractures, cavities, fungal forms, forest-floor fragments and possible plant growth. It is a constructed illustration, not a real time-lapse. Original text explicitly rejects universal dates and the idea that every log grows a tree.
- The two homepage thumbnails are raster previews of these actual rendered experiences, not substitute stock images.

[Asset provenance, crop coordinates, dimensions, byte sizes and SHA-256 hashes](qa/v2581/derived-assets.json). Crops were rotated/downsampled without upsampling their source pixels. All original assets retain their checksums. Real licensed macro photographs and a consistently framed, verified deadwood sequence would be needed for a genuinely photographic future treatment; none were invented or requested as a blocker.

## Implementation and progressive enhancement

`renderXray` supplies both placements with distinct prefixed IDs and appropriate heading levels. `bindXray` supplies one pointer/range/hotspot controller, including scoped listener cleanup, native form restoration and vertical touch scrolling. The React wrapper binds after mounting and remounts cleanly on locale changes; pointer movement does not rerender React.

The static reading client now bundles its shared DOM controller using Vite’s existing build API. The result is one self-contained fingerprinted module without React, GSAP, routing, cinema or audio. All meaningful prose, images, native details and fragment destinations remain real HTML. Hidden range/stage/mood controls are revealed only after initialization. No new dependency or third-party runtime was introduced.

Mood controls move rather than duplicate. Their header/toolbar space is reserved before JS so enhancement does not shift the reading title. The existing whitelist/prepaint/persistence/storage-denial behavior remains. Morning/Nightfall changes UI accents and a small header wash; it does not filter or dim films. The mobile scale indicator remains omitted because adding it over the film would cause clutter. The sound hint is limited to the hero; the audio graph, trusted-gesture behavior and original recording are unchanged.

`useForestMotion`, all media players, first-frame/handoff code, the global cinematic stylesheet, Worker, routing, headers, Wrangler configuration and workflow are unchanged. Expanding native details uses the existing layout refresh handler. New content increases the factual section’s height; chapter transition distances still use the original viewport-relative anchors. The original 20 canonical pages, metadata, reciprocal hreflang, schema and sitemap remain intact.

## Visual review

Real Chromium before/after captures cover LV and EN at 390 × 844, 800 × 900 and 1440 × 900. They include the full intro ending, homepage entry → actual reveal, 0/50/100% states, mouse dragging, real CDP touch dragging, opened hotspots, all three atlas expansions, all four time stages and both moods at the same viewport. Dragging changed the native value from 55 to 30 on the phone, 75 on the tablet and 68 on desktop. The six captures recorded no browser page errors; geometry is retained in the adjacent JSON files.

Screenshots and sampled recording frames were inspected manually. Refinements after inspection fixed a broken thumbnail URL, restored the same fully settled post-intro capture point, softened material joins, made log silhouettes/cavities more organic, limited the audio hint outside the hero, and reserved the desktop/tablet chapter rail. The drawings remain visibly constructed illustrations; these captures do not establish photorealism or a subjective “world-class” result.

| Evidence | Files |
|---|---|
| First viewport, before/after | [Desktop LV](qa/v2581/screens/home-desktop.webp) · [Mobile EN](qa/v2581/screens/home-mobile.webp) · [Tablet LV/EN](qa/v2581/screens/home-tablet.webp) |
| Actual homepage exploration | [Embedded reveal and gateways](qa/v2581/screens/home-exploration.webp) |
| Covered / midpoint / exposed | [Three spatial reveal states](qa/v2581/screens/reveal-states.webp) |
| Atlas overview and expansion | [Before/after and larger inspections](qa/v2581/screens/atlas.webp) |
| Time capsule | [All four stages](qa/v2581/screens/deadwood.webp) · [Mobile before/after](qa/v2581/screens/deadwood-before-after.webp) |
| Reading header mood | [Morning/Nightfall, same mobile viewport](qa/v2581/screens/atmosphere.webp) |
| Mobile interaction states | [English reveal, hotspot and atlas](qa/v2581/screens/mobile-interactions.webp) |
| Real desktop browser recordings | [Before LV](qa/v2581/recordings/before-lv-1440.webm) · [After LV](qa/v2581/recordings/after-lv-1440.webm) |
| Real phone browser recordings | [Before EN](qa/v2581/recordings/before-en-390.webm) · [After EN: actual touch drag](qa/v2581/recordings/after-en-390.webm) |

Recordings are automated real-browser journeys at 25 fps, with a deliberately fast sequence of controls; screenshots provide the readable states. Desktop recordings scale the 1440 × 900 viewport to 1280 × 800. Phone recordings retain 390 × 844. These are QA artifacts, not new production films.

## Performance against released 2.5.8

Alternating before/after Chromium runs used fresh isolated contexts, the immutable baseline build, actual full intro playback, no simultaneous browser/build work and three samples per viewport. Unthrottled local loopback is a controlled comparison, **not field CWV, Lighthouse or an iPhone GPU measurement**. The artistic intro’s late title presentation still contributes to the absolute LCP.

| Metric / viewport | 2.5.8 median | Final candidate median |
|---|---:|---:|
| LCP / 390 × 844 | 6,700 ms | 6,776 ms |
| CLS / 390 × 844 | 0.001355 | 0.001355 |
| LCP / 1440 × 900 | 6,820 ms | 6,812 ms |
| CLS / 1440 × 900 | 0.000230 | 0.000230 |

The 76 ms mobile and −8 ms desktop differences are within the variation of this small lab sample. No material regression was observed; this is not proof of a universal performance equivalence.

| Authored resource | 2.5.8 gzip bytes | Candidate gzip bytes |
|---|---:|---:|
| Homepage JS | 137,585 | 144,424 |
| Shared CSS | 11,105 | 14,558 |
| Homepage HTML | 6,815 | 17,641 |
| Standalone reading controls | 1,330 | 1,505 |
| LV guide HTML | 11,674 | 26,913 |
| LV deadwood-note HTML | 13,574 | 16,543 |

The trade-off is +6,839 bytes of JS, +3,453 bytes of CSS and +10,826 bytes of homepage HTML gzip for the embedded factual content, accessible controls and material drawing. Six new derivative/preview files total **274,282 bytes**; the eagerly referenced bark texture is 38,322 bytes. Surface/preview HTML images are lazy. The hero preview reuses the already loaded original final still. All original film/audio/wallpaper bytes and quality are unchanged. [Raw samples and payloads](qa/v2581/performance.json).

## Verification and honest failure accounting

- TypeScript and ESLint pass without warnings; production build prerenders all 20 documents. Worker unit tests: **11 passed**.
- Local Wrangler: **133 HTTP scenarios passed**, including GET/HEAD of all 20 canonical URLs, 19 slash redirects, six genuine 404s, all four films’ 206/416 behavior, original download hashes/dimensions, six new assets, MIME/cache/security headers and every exact inline CSP hash. [HTTP evidence](qa/v2581/local-http.json).
- Chromium focused candidate: **61 passed, one CI-only public-network test skipped**. The later rail/download check passed **8/8**, including both actual note/wallpaper downloads, original dimensions, focus restoration and all six first-viewport/language contexts. That represents **63 distinct passing Chromium scenarios**, with six already-covered homepage cases rechecked after the tablet margin refinement.
- Native macOS WebKit first focused run: **60 passed / 4 failed** on the standard `macos-15-intel` runner, [run 42382172784](https://github.com/aigars-avotins/piepe/actions/runs/42382172784), code `49f8aea`. All cold first-frame, reverse-scroll, actual moving-frame/replay, docking, short Understory, audio and static-content checks passed. Two failures were old unscoped `getByRole('status')` selectors, now made specific to their actual dialog/download message without removing any assertion. Two 1440px journey cases exhausted the 20-second test budget while making three synthetic 4320px screenshots under the iPhone project's 3× scale. The tests now capture the same three real painted states at CSS-pixel resolution, retain the distinct-image hashes and keep the same deadline. A focused follow-up covers those four failures and the final tablet/desktop rail geometry; results will be recorded before the PR is ready.
- Local Linux WebKit: **14 passed / 2 failed**. Both intro-completion failures were `load-timeout`, not falsely accepted as successful film playback. A separate baseline/candidate probe reproduced exactly the same `readyState=0`, `networkState=3`, time=0 and timeout on released 2.5.8 and this candidate, despite `canPlayType()` returning `probably`. The process warned that GL video-sink dependencies were unavailable. This local media-pipeline limitation remains unresolved; no product code or media/assertion was changed to conceal it. The workspace supplies official Debian GLES libraries; only their system-registry presence check was skipped because the workspace library directory is not indexed by `ldconfig`. This is Linux compatibility coverage, **not native Safari verification**. [Baseline/candidate diagnostic](qa/v2581/linux-media-probe.json).

The first manual native run is deliberately retained with its failures. Only affected tests are being rechecked; there is no second full suite, larger runner, workflow/integration change, merge or deployment.

QA limitations: automated native macOS WebKit is not a physical iPhone, Safari UI or VoiceOver session. Scientific illustrations are not species-identification evidence. No new production URL is claimed for an unapproved feature branch; Cloudflare's existing feature-branch Worker-name guard is not worked around.
