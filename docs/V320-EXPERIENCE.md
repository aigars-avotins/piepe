# PIE.PE 3.2 — experience and architecture

Scope: [Issue #36](https://github.com/aigars-avotins/piepe/issues/36), fully read including its no-new-video and automatic-release requirements. Baseline: production 3.1.1, `8a210b23e423a94a29fc28f7101656e753c77ad2`. Art direction: **follow one thread, leave room for the forest**.

## Audit: preserve what already works

The two-slot `PortalCinema`, native frame-readiness gates, bounded slow-source observer/recovery, 1× playback, repeated living loop, authored return, native dialog history and exact opener restoration already work. They are preserved byte-for-byte. So are the original intro, environmental film/scroll architecture, photograph handoff, all twenty prerendered routes, security/routing, downloads and approved brightness. The definitive 7:4 gateway photograph window fixed in 3.1.1 remains; captions stay in normal flow. The existing audio graph already provides one gesture-owned buffer, smooth scene-dependent low-pass/gain transitions and visibility/mute handling; no speculative processing was added.

Real shortcomings: three similarly quiet first actions without a visible primary portal label; a 480px minimum hero in a 390px landscape viewport; repeated Encounter lead; generic paired-card presentation; initial high-priority requests for two invisible future forest layers competing with the actual opening image. These are distinct from the new optional interpretive feature.

## Two live prototypes, one decision

Actual 3.1.1 browser prototypes were compared in LV at 1512×982 and EN at 390×844. They used the existing moving 05 film at native 1920×1080, playbackRate 1. Matched screenshots briefly hold the same existing frame at 2s for comparison; the full before/after journeys never seek or accelerate. See [QA evidence](V320-QA.md).

**Living World A, chosen:** one small movable photographic light and an optional three-beat text passage. **B, rejected:** three persistent reveal circles. B competes with the authored image, repeats the three text controls and can suggest scientific markers attached to AI-generated objects. A leaves the image clear, works anywhere in the touch surface and has no exact-point target. This is a restrained light reveal, not an optical microscope or claimed new detail. Prototype idle rAF/memory samples are retained, not treated as device certification.

**Editorial A, chosen:** an asymmetric photographic diptych, with the second view lower and smaller. **B, rejected:** alternating sequential photo essays. B requires substantially more scrolling on desktop. A gives both photographs more presence together while preserving caption flow, descriptive links, responsive sources and the mobile single column. There are no global scroll effects, new assets or runtime imports in static reading pages.

## Implementation

- Hero: one visible **Ienāc piepē / Enter the fungus** link, source-accurate preview and quiet six-film hint. An ordinary activation opens that exact portal immediately. Its real `#encounter` href remains the native no-JS/modified-click fallback. The fungus Discovery invitation remains a quieter secondary action; scroll, intro skip/replay and Field Note remain independent and available. A short landscape hero now fits the visible screen.
- Living World: **Atklāj pavedienu / Follow a thread** is opt-in; nothing automatically covers the loop. `LivingThread.tsx` adds one bounded local light, attached to the existing view. It never duplicates, filters or fetches a film. Pointer events coalesce into one animation frame; there is no idle animation loop. Touch release/cancel, pointer leave/blur, resize, visibility and cleanup remove the light. Existing gaze scale stays stable; its input is disabled during thread exploration, avoiding competing transforms.
- Three bilingual factual beats: wood decay/nutrition; mycelium/hyphae versus fruiting body; nutrient circulation/habitat, with living-tree nuance. Existing artistic disclosure remains visible. Numeric choices expose pressed state; changes are politely announced. Arrows move the light, Enter advances, Home recentres/resets. Close/Escape immediately restores cinema and focus; the next Escape or native Back closes the portal normally. Pause/Exit remain in the top bar, Return stays reachable. Clean mode clears exploration and restores the unadorned loop.
- Quiet/reduced-motion/Save-Data: the same three texts and existing 05 still, without a light, moving film or additional exploration request. Explicit full-quality opt-in remains. Text and actions share normal flow, including longer translated/static copy; landscape uses two columns. Feathered local photographic contrast has no rectangular CTA backplate.
- Sound: only the new hero-portal entry is added to the existing portal gesture exclusion. Entering the journey does not inadvertently activate ambient sound; its dedicated sound control still can. Audio payload/DSP and remembered preferences are unchanged.
- Loading: preload the actual opening `forest-poster.jpg`; mark the invisible wide/foreground/asset-monitor images low-priority/lazy to prevent React's automatic high-priority preloads. No image source is replaced or compressed; scene readiness/recovery remains tested.

## Deliberate non-changes / future media-dependent work

02→03 pore geometry and 03→04 tunnel geometry differ in the supplied footage. Native source strips, prior twelve 1× timing A/B recordings and this release's actual moving journeys do not support a better non-destructive crop, exposure shift or shorter fade. Keep the authored 180/220ms handoffs rather than introduce a new camera jump/ghost. 04→05, 06→07 and the authored 07→01 return remain intact. Literal matching would require owner-supplied matching future footage: **none is generated for 3.2**.

The four 3.1.1 wallpaper PNG originals remain 1672×941 desktop / 852×1846 phone; upsized JPEG downloads remain labelled honestly. Inspect native texture crops and previews; resizing cannot invent native detail. A genuine native-high-resolution artwork follow-up is optional and was not commissioned. No paid services, libraries, trackers, new production movies, re-encoding, codec changes or PIE.PE 3.0 redesign were introduced.

All 107 original media/image/audio files, all 20 original/serving/master MP4s and protected player/camera/security/config files are pinned in [preserved-assets.json](qa/v320/preserved-assets.json). The two deliberately reviewed source-pin changes are image priority and the new CTA's audio exclusion, separately pinned in [reviewed-sources.json](qa/v320/reviewed-sources.json).
