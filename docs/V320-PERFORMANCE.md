# PIE.PE 3.2 — performance evidence

This is laboratory evidence, not CrUX, field INP, battery-life or Google ranking certification. Preserve original film/image fidelity. No new production video, media compression, animation library, tracker or Cloudflare infrastructure change.

## Controlled fresh-first-visit Lighthouse

Lighthouse 13.6, local Chromium, frozen production 3.1.1 versus candidate, same Node static serving helper invoking the unchanged real media Worker and built CSP/headers. Fresh storage, normal desktop (provided network, CPU1) and actual DevTools Slow4G mobile (562.5ms request latency, 1474.56Kbps down/675Kbps up, CPU4). These helpers serve raw JS/CSS rather than Cloudflare's production compression; transfer/LCP numbers are not production predictions. One initial sample per profile; scores vary and do not establish causation.

| Profile | 3.1.1 | 3.2 candidate |
|---|---:|---:|
| Desktop FCP | 463ms | 381ms |
| Desktop LCP | 8456ms | 8455ms |
| Desktop TBT | 43ms | 30ms |
| Desktop CLS | 0.00562 | see raw result |
| Desktop performance score | 70 | 71 |
| Slow4G mobile FCP | 3634ms | 3237ms |
| Slow4G mobile LCP | 19222ms | 18420ms |
| Slow4G mobile TBT | 109ms | 216ms |
| Slow4G mobile CLS | 0.00135 | see raw result |
| Slow4G mobile performance score | 58 | 56 |

Accessibility, best practices and SEO are 100 in all four audits. These audits cover the homepage, not every modal/interaction. The slower mobile TBT/score is reported, not hidden; additional controlled evidence and interaction profiling are recorded in final QA before release.

The long fresh-visit LCP is the deliberately late typography during the original opening film, not a broken image. The baseline mobile LCP element was the hero label, with about19.2s render delay on this slow profile. The original authored intro is preserved, not shortened or hidden to game the score. Good field LCP<2.5s/INP≤200ms/CLS≤0.1 remain goals, not achieved-field claims.

## Evidence-based loading change

The baseline competed for THREE high-priority forest images: final396,424B, breathing poster463,839B and real opening poster660,060B. On Slow4G the future-layer images completed before the opening poster. Preload the actual opening image; make the invisible future layers lazy/low-priority. Bytes/quality remain identical. React no longer emits high-priority preloads for those invisible layers; this is covered by SSR regression tests. It is a priority change, not a claim to remove all future image requests.

## Interaction, media and resource budget

Final normal/Slow4G returning-visit profiles, first presented native frame, rAF/frame stalls, main-thread CPU proxy, heap/request/byte counts and event-duration latency proxy are linked from [QA](V320-QA.md). Event Timing is a lab interaction proxy, not field INP. CDP task/script/layout duration and rAF gaps are CPU/render proxies, not measured GPU utilization or battery draw. Headless software rendering and one laboratory host cannot certify a physical iPhone's thermal behavior.

The opt-in thread has one local composited light, no continuous idle rAF and no new media request. Original two-slot bounds remain one playing movie plus one staged source. All portal films stay request-free before intent. Quiet exploration requests no new resources. Static articles retain the independent small reading-tools bundle and no global React/GSAP/video runtime. Exact final JS/CSS/gzip deltas, original-speed source details and raw receipts are recorded with the release QA.
