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

## Visual review and validation

Final evidence and measured results are being collected for the review candidate. This section will contain the actual test counts, performance comparison and native WebKit run before the PR is marked ready.

QA limitations: automated native macOS WebKit is not a physical iPhone, Safari UI or VoiceOver session. Local Linux WebKit is compatibility coverage, not native Apple verification. Lab LCP/CLS comparisons do not establish field Core Web Vitals. Scientific illustrations are not species-identification evidence.
