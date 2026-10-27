# PIE.PE 2.0 verification

## Baseline and preserved behavior

Main baseline `89884ee032510c16cb9bad412715557040a720b1`, Cloudflare rollback version `60ff21da-3dd1-4bd1-86d1-8ed481859e05`. Source/media hashes checked against the complete remote repository tree. Original MP4 and both JPEGs remain unchanged. Existing Worker/domain/certificate/settings inspected through the authenticated Cloudflare API; no DNS/resource changes planned.

Before screenshots: desktop 1440×900, mobile 390×844 and 320×690, plus discovery and lower-page flow. The baseline was actually opened and tested; observations are not inferred solely from source.

## Local checks

- `npm ci`: passed.
- TypeScript, ESLint, production build: passed on current implementation.
- Worker tests: 8 passed, including bounded reads and upstream cancellation for a 1KB range from a simulated 10MB stream.
- Local browser launcher: macOS sandbox prevents Chrome/WebKit processes registering their application/Mach services. The resulting launch failures are not app test failures or passes.
- A GitHub Actions browser matrix is supplied so the full tests and real 15-second recordings can run in a supported Linux browser environment before main/production rollout.

## Real-browser review (in progress)

The first real film still reaches `ended`. Four camera states, photographic field-note view, micro-story tabs and mobile hero/dialog have been visually reviewed. Supporting mobile labels were enlarged. No fake project rows remain. Duplicate/translucent fungus layers identified in the first draft were removed; foreground uses only actual bark, and the photographic specimen retains a trunk/moss connection.

Final viewport, fault-injection, CI and production results will be added after completion. Physical iPhone/iOS is not available; do not infer a hardware test from an emulated viewport.
