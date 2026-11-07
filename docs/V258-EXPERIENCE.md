# PIE.PE 2.5.8 — experience and implementation

Candidate for Issue [#25](https://github.com/aigars-avotins/piepe/issues/25), including both addenda; reviewed 2026-11-07, Europe/Riga. Based on released 2.5.7, `d95b1d3`. **PR review only: do not merge or deploy until the owner approves.** The evidence-first production, accessibility, SEO and performance findings are in [V258-AUDIT.md](V258-AUDIT.md).

## What the six concepts actually do

| Concept | Implemented experience | Deliberate boundary |
| --- | --- | --- |
| Beneath the bark | Both reading guides contain a split illustration. A native range and directly draggable handle reveal an original coded hyphal diagram beneath the existing forest artwork. Three numbered links open and focus wood, hyphae and fruiting-body explanations. | Explicitly illustrative, not microscopy, an X-ray, a species image or a measured scale. Existing artwork is disclosed as AI-generated; no new AI media. |
| Scale of attention | The existing desktop chapter navigation shows one short perspective cue derived from the existing four scene states. | Qualitative tree → small surfaces → bracket/beneath → wider view. No fictitious optical magnification or extra camera timeline. Hidden at widths ≤1100px. |
| Depth-reactive sound | After a trusted gesture, the existing single loop gains a gentle low-pass: surface 20kHz, close 10kHz, beneath 4.6kHz, with a 1.2s exponential target. Existing gain, recording and mute preference remain. | No extra recording, tap sound or reading-page autoplay. Unsupported filtering retains the original unfiltered graph. Unavailable Web Audio falls back to the same native HTML audio recording after consent. A permission rejection remains a waiting state, never an autoplay bypass. |
| Deadwood time capsule | Note 005 in both languages has four ecological stages, an illustration, four buttons and a native four-stop range. Every factual caption remains in the initial HTML. | No universal 1/5/15/40-year prediction. Stages may overlap; species, moisture, climate, size and position alter decay. The seedling is a possible continuation, not every log's promised outcome. |
| Morning / Nightfall | A small footer choice changes warm/cool accent colours and remembers the manual preference. It works across full-document navigation and browser history. Stored Nightfall is applied before styled content is painted. | Morning preserves the original default. Neither mode filters or dims the videos/photos. No geolocation, solar/weather simulation, time claim, second soundtrack or new fixed mobile control. |
| Surface atlas | Three native expandable cards compare pores, gills and other surfaces. The selected original SVG enlarges; Escape/Close restores its summary focus when JS is available. | Smooth surfaces and teeth are drawn separately, not presented as one taxonomic group. Clearly an observation guide, not a species-identification instrument or authentic specimen photographs. |

All six have an implemented, integrated scope. Photorealistic microscopy, calibrated magnification, real-time ecology and PIE.PE 3.0 are outside this release. Decorative hover/tap audio is omitted: there is no approved separate sample or useful need to add it.

## Architecture and preservation

- The cinematic app retains its original GSAP/camera and media lifecycle. `useForestMotion`, `MotionClip`, `EnvironmentalFilm`, `IntroFilm`, `ForestScene`, `Discovery`, `usePhotoHandoff` and the original `style.css` retain their baseline hashes. The scene cue consumes the current App state; it installs no competing observer/ScrollTrigger.
- The 18 reading/collection/gallery documents remain prerendered multipage HTML, with no React hydration/root, video or audio runtime. The existing Vite build compiles one small independent `readingClient.ts` module with the already installed transformer. Its fingerprinted URL is allowed by the existing self-only script policy. No router or dependency is added.
- All important new biology and caveats are server-rendered text. Native atlas/details work without JS. Enhancement-only theme/range/stage controls stay hidden until bound; no dead buttons in the JS-disabled experience. The capsule retains one static illustration plus all four captions without JS.
- New experience CSS loads only on the two guides and note 005 in both languages. Shared accent/footer CSS is separate from the original cinematic stylesheet. Coded SVGs require no new downloaded image pack.
- The shared, whitelisted manual preference has an exact CSP-authorized prepaint bootstrap. The policy includes 22 hashes for the 20 authored JSON-LD documents and two bootstraps. No `unsafe-inline`/`unsafe-eval` script permission or remote script origin is introduced. Tests still reject injected inline/arbitrary external scripts.
- All four films, audio, existing illustrations, brand files, wallpapers and note downloads retain exact hashes. Worker source, routing, compatibility date, security configuration, `_headers`, build integration and workflow concurrency are unchanged.

## Scientific and editorial review

The original guide's complete `readings` content and every original field note are retained and checked against the released source. The guide's same three bibliography entries are reordered to first-use order. New concise explanations link directly to verified sources:

- Australian National Botanic Gardens: [mycelium](https://www.anbg.gov.au/fungi/mycelium.html), [spore release/dispersal](https://www.anbg.gov.au/fungi/dispersal.html), [boletes/polypores](https://www.anbg.gov.au/fungi/types-boletes.html), [fruiting-body structures](https://www.anbg.gov.au/fungi/types-of-fungi.html), [smooth and finely toothed surfaces](https://www.anbg.gov.au/fungi/types-stereoid-paint.html).
- Note 005 retains its existing [Forest Research deadwood habitat guidance](https://www.forestresearch.gov.uk/publications/managing-deadwood-in-forests-and-woodlands/) and peer-reviewed decay references. The new stage captions link to these actual bibliography entries.

The sources support branching, extracellular digestion/absorption, fruiting-body spore production, tube/plate/surface differences and variable deadwood habitats. They do not supply the illustration geometry: all diagrams are original schematic code. No copied scientific photo, invented Latvian species, medical promise, fabricated field observation or ranking-oriented authority claim is added.

## Accessibility and reading flow

Ranges have labels, native keyboard behaviour, value text and visible focus. The overlaid handle mirrors the native range; horizontal pointer capture starts after direction/intent is established, while vertical panning and pinch zoom remain available. Numbered hotspots have 44px targets clear of the central handle. Each corresponding explanation is readable in native details and reachable by a real fragment link.

Stage buttons expose the selected state, retain normal Tab order, and additionally support arrows/Home/End. The illustration's reserved geometry stays fixed. No carousel clock, auto-advance, scroll trap or live-region announcement is introduced. Reduced-motion and data-saving preferences disable decorative pulses/transitions. The optional hyphal pulse is finite, not continuous.

Citation targets now accept programmatic fragment focus and have visible focus/target treatment. The guide ends with matching-language notes/gallery/home links. Six notes display a real collection → current-note trail, mirrored by a two-item `BreadcrumbList` inside the existing WebPage JSON-LD. Existing gallery ImageObjects and all 20 canonical/hreflang/sitemap routes remain intact.

The existing native discovery modal, audio description and field-card accessible names were audited before changing them; no unsupported custom focus trap, blanket `aria-hidden` or card-name truncation is introduced.

## Visual and validation evidence

Final images, real interaction recordings, paired mobile lab results and browser/Worker validation receipts are listed in [the audit](V258-AUDIT.md#candidate-validation). Review the recordings as aesthetic evidence as well as the automated assertions. A controlled DOM visibility event tests audio lifecycle without being represented as a physical background-tab/GPU measurement.

Native macOS WebKit can validate Apple browser/media behaviour but does not certify spoken VoiceOver, physical iPhone/glare, GPU allocation, field CWV, Google indexing or rich-result eligibility. Those limits must remain explicit in the final PR. Production stays on the approved 2.5.7 version until the owner reviews this candidate.
