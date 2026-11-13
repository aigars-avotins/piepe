# PIE.PE 3.0 — Media audit

## Verified repository inventory

Latest main `9ebf669` contains all seven sources. Source 06 had a double `.mp4.mp4` extension; it is renamed without changing any byte. All six movie SHA-256 values match the November 7 Issue #6 manifest, including the selected 06 (`cd9f9a40` candidate). No substitute, new generation, visual recompression or upscale is used.

The current repository start PNG is **2,856,790 bytes**, not the earlier conversation manifest’s 3,450,914 bytes / `a159ef…` hash. Its dimensions remain 1672×941. The actual committed image is preserved exactly; this discrepancy is recorded for owner review rather than replacing the uploaded image.

| Source (in `public/media/`) | Bytes | SHA-256 |
|---|---:|---|
| `01_Start.png` | 2,856,790 | `876278ac80aea5ca6f34f249ea7631f1bad78ab8cb948f853c822cd48bc4c857` |
| `02_Zoom_in.mp4` | 12,288,853 | `82bb1fc5ad6641306b40dae34e96c7c66684337d937d92b61c0ee0f169059ebd` |
| `03_Entering_fungus.mp4` | 8,140,310 | `5fef0a228648d5c0b21007e78d0036cc019521f9d196bbd66015443b201cf304` |
| `04_Inside_fungus.mp4` | 14,210,210 | `468d28d33a57402d83cf412f02e84f5191cd8508d9e5915cc1cee8267e4e64ed` |
| `05_Fungus_world.mp4` | 5,931,498 | `32c74d65d6d4225343ef5066e9ec4d7de9b1f0d00e754bbfd7f9e3e5b05b6f6d` |
| `06_Leaving_fungus.mp4` | 11,193,121 | `1bf2c8253ee549f1d06c14010cc639dd929aa67bad0ecbb8275b1f84bcd881c0` |
| `07_Zoom_out.mp4` | 13,238,074 | `cf75c370a943e585441b454586ece04cd50a23171931c6cd1fde21fe2af5e94b` |

Full ffprobe stream/container/atom records: [sources.json](qa/v300/sources.json). All six movies are **1920×1080, 24 fps, H.264 High, yuv420p, AAC**. They are 1080p, not native 4K. Video duration is 9.958333s for 02/03/04/06/07 and 7.833333s for 05 (audio/container approximately 9.963s and 7.850s). Combined originals: 61.99 MiB. Original color metadata and audio/video streams are preserved. AAC is muted in the portal.

## Lossless serving derivatives

Every source has `moov` after `mdat`. Separate `portal-02-faststart.mp4` … `portal-07-faststart.mp4` use only:

```sh
ffmpeg -i INPUT.mp4 -map 0 -c copy -movflags +faststart OUTPUT.mp4
```

The original files remain present with the hashes above. Each original/remux H.264 stream was extracted with `-map 0:v:0 -c copy -f h264` and AAC with `-map 0:a:0 -c copy -f adts`; **all twelve SHA-256 stream comparisons are identical**. Container hashes differ as expected. [derivatives.json](qa/v300/derivatives.json) records derivative sizes/hashes and the verified shared elementary-stream hashes. Native first-frame PNG decodes were converted to **lossless 1920×1080 WebP** for first-paint coverage; no encoded movie frame is altered. The quiet-world still is the same 05 first-frame image.

A real Chromium 02 startup comparison used the same range server, 120ms response latency and 2.5MB/s throughput, three alternating samples each. Median first playable frame: original **852.0ms**, fast-start **540.8ms** (about **36.5% less**). Original needed three range requests to locate metadata; remux needed one. These are controlled local observations, not a production/Core Web Vitals promise. [Raw measurement](qa/v300/faststart-benchmark.json).

Trade-off: approximately 62 MiB of duplicate serving containers plus lossless posters in checkout/deployment. Clients request only the serving copy, and nothing until deliberate Begin; originals are retained for fidelity/audit. No file exceeds the Worker static-asset per-file limit. This added repository weight is justified by the measured metadata/startup improvement and the explicit source-preservation requirement.

The inexpensive production build checks every expected source/derivative/poster hash and size via `scripts/verify-portal-media.mjs`; missing or changed assets fail CI without launching browser jobs.

## Native-resolution continuity

Fresh decoded first/last PNG frames were compared at 1920×1080 using FFmpeg SSIM. Only the still is resized to that comparison plane; the served start PNG is untouched. Native texture changes make these scores different from the earlier downscaled/JPEG measurements. Similarity is diagnostic, not a seamlessness certificate.

| Boundary | Native SSIM | Treatment / source constraint |
|---|---:|---|
| 01 → 02 | 0.622027 | 420ms still-to-first-frame handoff; tree/fungus have small source offsets. |
| 02 → 03 | 0.557296 | 180ms held-frame dissolve; pore arrangement and perspective differ. A brief geometric change remains perceptible. |
| 03 → 04 | 0.445108 | 220ms held-frame dissolve; tunnel walls/strand arrangement differ materially. No long ghosted blend can reconstruct matching geometry. |
| 04 → 05 | 0.878413 | 90ms handoff into the matched vista. No added travel zoom. |
| 05 → 05 | 0.923038 | Native continuous loop, no static replacement. Real moving frame/cycle evidence required. |
| 05 → 06 | 0.743104 | 200ms handoff after the tiny user gaze recentres; outgoing 05 may be at any loop frame. |
| 06 → 07 | 0.909252 | 90ms handoff at the recognizable underside. |
| 07 → 01 | 0.594136 | 520ms final handoff to the actual original still, 450ms quiet beat, then 360ms doorway close. Tree/root/fungus geometry is similar but not identical. |

[Native analysis values](qa/v300/native-ssim.json). Boundary images and real stitched browser recordings are linked in [QA](V300-QA.md). No universal fade, blur, color shift, playback-rate change or invented camera path is applied. Poster/video coverage is gated by real readiness; a slow next source retains the current scene instead of revealing black.

**Remaining media limitation:** 02→03 and 03→04 are not mathematically or visually identical camera continuations. The short authored joins are the best non-destructive treatment used here; they do not make a false perfect-seam claim. If owner review requires literal geometric continuity, replacement 03 should begin from the exact decoded final 02 frame and end on the exact first 04 composition (or replacement 04 should start from 03’s final frame). 07 would likewise need an end frame conditioned on the exact 01 image. No new media or generation credits were used; such regeneration requires separate approval.
