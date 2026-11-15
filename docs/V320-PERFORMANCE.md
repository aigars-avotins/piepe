# PIE.PE 3.2 — performance evidence

These are laboratory comparisons with production 3.1.1 (`8a210b2`), not CrUX, field INP, battery-life or ranking certification. Original image/film fidelity and all production media bytes are unchanged. No new dependency, tracker or infrastructure was added.

## Fresh visits

Lighthouse 13.6 / Chromium, same local serving helper invoking the unchanged real media Worker and built security headers. Fresh storage. Desktop: normal network, CPU1. Phone: actual DevTools Slow 4G, 562.5ms latency, 1474.56/675Kbps down/up, CPU4. Helpers serve raw JS/CSS rather than production compression. Desktop is one sample per version; mobile values below are medians of three alternating samples per version. [All mobile samples](qa/v320/receipts/mobile-lighthouse-samples.json).

| Metric | Desktop 3.1.1 → 3.2 | Slow 4G phone 3.1.1 → 3.2 |
|---|---:|---:|
| FCP | 463 → 381ms | 3634 → 3118ms |
| LCP | 8456 → 8455ms | 19277 → 18334ms |
| TBT | 43 → 30ms | 125 → 216ms |
| CLS | 0.00562 → 0.00562 | 0.00135 → 0.00135 |
| Speed Index | — | 12176 → 11282ms |
| Performance score | 70 → 71 | 57 → 56 |

Accessibility, best practices and SEO scored 100 in these homepage audits; this is not certification of every interaction. Mobile TBT increased, and the score decreased by one point. TBT samples varied substantially: baseline 109/125/508ms, candidate 216/107/267ms. A brief parallel typecheck during the second baseline sample adds host noise; do not infer precise causation or perfect isolation. The later history restoration, Encounter spacing correction and environmental-only compositor promotion do not affect this fresh initial-page comparison; their functionality was tested separately.

Fresh-visit LCP is the deliberately late hero typography during the original opening film. Do not shorten or hide approved cinema to game the score. Good field LCP <2.5s / INP ≤200ms / CLS ≤0.1 remain goals, not achieved-field claims.

## Measured changes and cost

Baseline requested three forest images at high priority, allowing future layers to finish before the opening poster on Slow 4G. Candidate preloads the actual 660,060-byte opening image and gives invisible future layers lazy/low priority. Their sources and quality remain unchanged. This fixes priority competition, not every future image request.

| Homepage entry payload | 3.1.1 raw / gzip | Final 3.2 raw / gzip |
|---|---:|---:|
| JavaScript | 452,251 / 152,021B | 458,829 / 153,955B |
| CSS | 82,714 / 17,036B | 87,405 / 17,773B |

Gzip uses the same local Python settings, not Cloudflare transfer receipts. Added cost is 1,934 compressed JS bytes and 737 compressed CSS bytes. Static reading documents still load their independent small reading-tools module, with no homepage React/GSAP/video runtime.

## Returning visits and the optional thread

[Raw interaction/resource/CPU/heap samples](qa/v320/receipts/interaction-profile.json) compare normal and Slow 4G returning visits, without the fresh intro. Returning LCP: 228 → 160ms normal; 3948 → 3004ms Slow 4G. First presented portal frame: 142 → 218ms normal; 7937 → 7941ms Slow 4G. The tiny normal-network increase is reported without claiming a statistically established regression or improvement.

No portal movie is requested before intent; opening/exploring the thread requests no additional media. Existing bounds remain one playing film and one staged source. Thread lighting coalesces pointer input into one requested frame and has no idle animation loop. A normal 2.2s input sample contained 133 animation frames, maximum gap 16.8ms and none >50ms. Slow samples recorded 0/4/8 total dropped video frames; these are not described as zero-drop playback.

CDP task duration during equal observation windows: cinema/thread idle/input 0.096/0.091/0.084s normal, 0.217/0.166/0.301s at CPU4. Initial heap changed 5.34 → 5.39MiB normal and 5.70 → 5.73MiB slow; a normal cinema/thread/after-input sample used about 7.3/7.6/7.9MiB. These are short samples, not a long-session leak proof. Event Timing maximum was 64ms for both normal profiles and 160 → 48ms slow: a lab latency proxy, not field INP. CPU task/rAF/heap observations do not measure GPU utilization, physical-device thermals or battery drain.

No further video compression, re-encoding, fidelity reduction or speculative processing was used to improve scores. Physical iPhone and real-user performance remain explicit follow-up checks.
