# PIE.PE 3.2 visual evidence

All images here are actual browser screenshots, comparison contact sheets or crops of actual QA recordings. All MP4 and WebM recordings are **QA-only browser evidence**, never new production movies and never included in `public/` or `dist/`. The WebMs are unmodified browser captures. Portal films remain 1920×1080 at their original quality; environmental streams retain their individual native dimensions (Understory 1900×988), recorded in the codec ledger; the desktop browser capture is 1280×832 from a 1512×982 viewport, and the phone capture is 390×844. Playback uses original 1× timing, with no seeks in either complete journey.

## Before / after recordings

| Experience | Production 3.1.1 | Candidate 3.2 |
|---|---|---|
| LV, desktop | [Before](recordings/before-lv-1512.mp4) | [After](recordings/after-lv-1512.mp4) |
| EN, phone | [Before](recordings/before-en-390.mp4) | [After](recordings/after-en-390.mp4) |

Each contains all six portal films, repeated moving living world, pure cinema, authored return and re-entry. Candidate includes all three optional passages, keyboard and phone touch. [Desktop proof](receipts/after-lv-1512-journey.json), [phone proof](receipts/after-en-390-journey.json), [recording hashes](receipts/recordings.json). Captured against source `d735e79`; later history/Encounter/test corrections do not change this portal rendering or media. Native final-candidate evidence is recorded separately in the linked Actions reports.

Fresh first-visit opening, original speed and natural end: [LV before](recordings/fresh-before-lv-1512.webm) / [after](recordings/fresh-after-lv-1512.webm), [EN phone before](recordings/fresh-before-en-390.webm) / [after](recordings/fresh-after-en-390.webm). [Callback/source receipts](receipts/fresh-opening.json), [ended-frame comparison](screens/fresh-opening-before-after.webp). Twelve native frame callbacks per visit, no competing film or page error.

Native macOS final-candidate screenshots: [LV desktop moving thread](screens/native-moving-lv-1512.webp), [EN phone moving thread](screens/native-moving-en-390.webp), [quiet landscape](screens/native-en-844x390.webp), [200%-equivalent quiet layout](screens/native-lv-756x491.webp). These UI passes do not override the separately documented environmental-film cadence failures.

## Design decisions and actual rendered layouts

- [Desktop Living World A/B/baseline](screens/prototypes-lv-1512-living.webp) and [phone](screens/prototypes-en-390-living.webp): movable light chosen over permanent marker zones.
- [Desktop editorial A/B/baseline](screens/prototypes-lv-1512-editorial.webp) and [phone](screens/prototypes-en-390-editorial.webp): photographic diptych chosen over long sequential essays.
- [Hero before](screens/before-lv-1512-hero.webp) / [after](screens/after-lv-1512-hero.webp); [phone before](screens/before-en-390-hero.webp) / [after](screens/after-en-390-hero.webp).
- [LV thread](screens/after-lv-1512-thread-02.webp), [EN thread](screens/after-en-390-thread-02.webp), [pure cinema](screens/after-en-390-living-clean.webp).
- [320px phone](screens/layout-lv-320-thread.webp), [landscape](screens/layout-lv-844-thread.webp), [2048px](screens/layout-en-2048-thread.webp), [200%-equivalent LV](screens/lv-200percent-equivalent.webp) / [EN](screens/en-200percent-equivalent.webp).

Prototype stills briefly hold the same actual source frame at 2s solely for matched A/B comparison. This is distinct from the uninterrupted 1× journey recordings.

## Final environmental films

After identity compositor promotion, [desktop LV](recordings/environment-after-lv-1512.webm) and [phone EN](recordings/environment-after-en-390.webm) show native wheel entry, full-screen Understory and Breathing, natural loop, exit and a second actual moving visit to each scene at 1×. [Desktop frame review](screens/environment-lv-1512-review.webp) / [phone](screens/environment-en-390-review.webp), [desktop callback proof](receipts/environment-after-lv-1512.json) / [phone](receipts/environment-after-en-390.json). Twenty chronological frames per recording were visually inspected; no new side border, black intermediary or duplicated subject was observed. The source footage and camera remain unchanged.

## Frame review

[24fps frame-by-frame index](frames/seams-24fps-index.json) additionally links 192 chronological samples across the two constrained seams, before/after and both viewports. These sample actual browser frames without motion interpolation.

`frames/` contains seven transitions per locale, five successive source-recording samples per transition, before and after. The matching JSON indexes identify sampled times. In particular compare [02→03 before](frames/before-lv-1512-boundary-1.webp) / [after](frames/after-lv-1512-boundary-1.webp) and [03→04 before](frames/before-lv-1512-boundary-2.webp) / [after](frames/after-lv-1512-boundary-2.webp). Original geometric mismatches remain honestly documented; authored timing is retained, with no invented matching footage or blanket fade.

## Receipts

`receipts/` contains publishable summaries only: source/media hashes/codecs, 1× callback timing, Lighthouse samples, resource/CPU/heap proxies, contrast samples and test results. Raw Playwright configuration, private API responses and credentials are excluded. See [QA](../../V320-QA.md) and [performance](../../V320-PERFORMANCE.md) for scope and limitations.
