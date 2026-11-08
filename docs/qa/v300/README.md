# PIE.PE 3.0 review package

Start with [the QA report](../../V300-QA.md), [architecture](../../V300-MASTER-PLAN.md) and [media audit](../../V300-MEDIA-AUDIT.md). The feature is ready for owner visual review; it is not deployed.

## Watch

- [LV desktop, complete journey](lv-1512-full-journey.webm)
- [EN phone, complete journey](en-390-full-journey.webm)
- [Native source-boundary contact sheet](boundary-contact.webp)

The final recordings use application revision `2c8bcb4f2e004d55de86cca53bc5ff8fda3af700`, with no test-only acceleration. Their JSON companions include phase timestamps, requested media, advancing loop-frame callbacks and the actual opener scroll position. Full recordings show two loop seams and the authored return, focus restoration and repeat entry. Desktop capture is 1280×832 from a 1512×982 viewport; phone capture is 390×844. The compressed 25fps recordings are review evidence; the delivered source films remain 1920×1080 at 24fps.

`*-frames.webp` sheets inspect approximately 1.1 seconds around each observed transition, one recorded frame at a time. Phase events and recording clocks are approximate alignment aids. `*-native.webp` pairs use full-resolution decoded source endpoints; 01 alone is resampled to the analysis plane. The returned original PNG itself is unchanged. Source geometry differences are documented rather than described as perfectly seamless.

## Verification receipts

- `sources.json`, `derivatives.json`: originals, separate fast-start containers, lossless posters and exact elementary-stream identity.
- `preserved-sources.json`: protected baseline assets/controllers.
- `http.json`: 172 local Wrangler checks, including all 20 original documents, security/404 behavior and movie ranges. This is not production verification.
- `local-test-history.json`: focused local Chromium results, including investigated failures and the final 24/24 portal run.
- `native-test-history.json`: focused standard-runner macOS WebKit results and diagnostic history. This is not physical iPhone/Safari.app certification or a single full-site suite run.
- `recording-analysis.json`: every captured portal frame checked for near-black full frames, plus advancing loop callbacks. Numbers supplement visual inspection.
- `faststart-benchmark.json`, `payload-comparison.json`, `slow-network.json`: controlled startup comparison, built payloads and the honestly reported constrained-network recovery limit.

`baseline-*-encounter.webp` shows 2.5.8.2 before a portal existed. The two `before-*.webm` clips and `before-doorway-presentation.webp` instead show defects found in early development candidates; they are not mislabeled production behavior. No new AI imagery was generated, and no original movie was recompressed.
