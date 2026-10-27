# PIE.PE 2.0 verification

## Baseline and preserved behavior

Main baseline `89884ee032510c16cb9bad412715557040a720b1`, Cloudflare rollback version `60ff21da-3dd1-4bd1-86d1-8ed481859e05`. Source/media hashes checked against the complete remote repository tree. Original MP4 and both JPEGs remain unchanged. Existing Worker/domain/certificate/settings inspected through the authenticated Cloudflare API; no DNS/resource changes planned.

Before screenshots: desktop 1440×900, mobile 390×844 and 320×690, plus discovery and lower-page flow. The baseline was actually opened and tested; observations are not inferred solely from source.

## Local checks

- `npm ci`: passed.
- TypeScript, ESLint, production build: passed on current implementation.
- Worker tests: 8 passed, including bounded reads and upstream cancellation for a 1KB range from a simulated 10MB stream.
- Local browser launcher: macOS sandbox prevents Chrome/WebKit processes registering their application/Mach services. The resulting launch failures are not app test failures or passes.
- GitHub Actions runs Chromium in the version-matched Playwright container and WebKit on macOS. Both use a local server exercising the actual production media Worker. The workflow retains test results, traces, screenshots and genuine silent 15-second before/after scroll recordings.

## Real-browser review

The first real film still reaches `ended`. Four camera states, photographic field-note view, micro-story tabs and mobile hero/dialog have been visually reviewed. Supporting mobile labels were enlarged. No fake project rows remain. Hard cutout edges and a ghosted fungus transition identified in intermediate recordings were removed. The final camera moves through one continuous photograph; a separate foreground layer contains only bark. Supporting mobile labels are 12px or larger except decorative numbering.

Actual in-app checks include natural 6.041667s completion, autoplay rejection, an actual paused/stalled film, keyboard observation selection, focus restoration, session collection, four scene framings and mobile/landscape. The natural run measured CLS 0.00436 and LCP 292ms locally; these are local lab observations, not field metrics. End-frame mean RGB difference against the preserved still was 4.67/255 (compression-level difference), with no visible flash.

Viewport glyph bounds and overflow checked at 320×690, 360×780, 390×844, 430×932 and 844×390. Tests now measure the fixed environment box and observe its actual resize; this avoids WebKit's discrepancy between its layout and visual viewport heights. Mobile discovery keeps its 44px close target fixed while the body scrolls.

Early CI found and fixed skip focus occurring before the enabled control committed; completion now uses a first-signal guard and focus follows the committed state. All eight media Worker tests pass. Vite preview lacked the production byte-range path, so browser tests now use the actual Worker. Linux WebKit still stalled on H.264 after ~0.2s; its bounded fallback worked. WebKit media verification moved to macOS, following Playwright's platform-codec guidance: https://playwright.dev/docs/browsers#webkit. This is not represented as a passing Linux playback test.

Main advanced to `108829d84d0a9fccb9b7bdf9b9a0e3d371d54261` during implementation. The merge preserves every new document/media file, with all ten supplemental public media blobs hash-verified. The accidental 19MB public source-master replacement is restored to the original optimized V1 H.264 blob (1,723,128 bytes); the source master remains under source/. Supplemental 2.1 media is preserved without adding it to the 2.0 experience.

Physical iPhone/iOS is not available: **not verified on hardware**. macOS Safari was opened, but the user continued working in that browser; a complete manual Safari smoke test is not claimed. Final native WebKit CI and production results follow below.
