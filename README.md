# PIE.PE 2.1 — The living forest / Dzīvais mežs

An interactive forest encounter in Latvian at `/` and English at `/en/`. React, TypeScript, Vite and the original native-scroll GSAP camera; Cloudflare Workers Static Assets with bounded media streaming. The 2.0 production history is retained in `docs/V2-QA.md`; current implementation and remaining release checks are in `docs/V21-QA.md`.

The original six-second introduction retains its once-per-tab, skip/replay and recovery behavior. The shaped fungus target opens a one-shot awakening followed by the preserved native dialog, three keyboard-navigable observations and a localized downloadable field note. The scroll journey moves into the moss macro film and returns to a quiet wide breathing shot. Reduced motion, save-data, pause, visibility changes, failed playback and disabled storage have explicit fallbacks. Only one film plays at a time; scenes do not scrub or loop on every scroll.

Short educational observations explain fruiting bodies, fungal threads, pores/spores in many brackets, and wood decay without identifying a species from the artistic AI-generated imagery. Both languages have visible initial-HTML content, metadata, reciprocal alternates and a sitemap. The approved bracket-fungus mark, real ICO/touch icons, palette and two lazy wallpaper previews complete the identity. Download art is carefully enlarged from the approved sources, not claimed to be native 5K.

## Develop and verify

Use Node.js 24. Keep the existing checkout; cloud tasks are already isolated.

```sh
npm ci
npm run dev
npm run lint
npm run test:worker
npm run build
npx playwright install chromium webkit
PLAYWRIGHT_HEADLESS_SHELL=1 npm test
```

If the cloud image already has system Chromium, use it without changing source or installing another browser:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test -- --project=chrome-desktop
```

`npm run build` checks TypeScript, regenerates media sizes, builds the client and prerenders both locale pages from the shared dictionary/Story component. It also generates localized field notes and exact CSP hashes for the two JSON-LD payloads. The original media Worker is unchanged. Tests start `scripts/preview-worker.mjs` on port 4173; plain Vite preview does not reproduce media range behavior. `node scripts/qa-server.mjs` is an optional local-only fault injector on port 4174, excluded from deployment.

Run `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture-review.mjs` for actual Chromium screencast recording, desktop/mobile screenshots and lab metrics. It requires FFmpeg and writes ignored `review-results/`. Browser-emulated viewports do not establish physical handset/Safari testing. Do not run separate Playwright commands concurrently into the same output directory.

## Assets and design

The four supplied H.264 clips and their images stay in `public/media/`. The original master stays under `source/` and is never deployed. `src/media-sizes.ts` must match all actual public media; streaming handles 206/416/If-Range/HEAD without buffering full films. Unknown assets keep legal full-response behavior.

Typed LV/EN copy lives in `src/i18n.ts`. `Story.tsx` is shared between the interactive app and initial HTML. Language links keep current playback, scroll, dialog state and the selected note. Notes and facts are generated from the same content, avoiding a separate translation drift.

See `docs/BRAND_IDENTITY.md` for the optional deterministic artwork pipeline and source-resolution/crop limits, `docs/V21-ARCHITECTURE.md` for scene lifecycles and integration decisions, and `docs/V21-SEO.md` for scientific-source review and Google Search Console owner steps. No new frontend framework, WebGL or React Bits runtime was added.

## Existing production infrastructure

Existing Worker **piepe**, custom domain **https://pie.pe**, Workers Static Assets. `wrangler.jsonc` preserves account, custom domain, compatibility date, bindings, disabled workers.dev/previews and strict 404 handling. `dist` is the sole public deployment directory. Only `/media/*` invokes the Worker; localized pages and wallpapers are ordinary static assets. No Pages project or extra Worker is needed.

Before rollout, verify Cloudflare authentication, record the actual current version and inspect the rollback version. Run all relevant checks and visual review first:

```sh
npx wrangler deployments list
npx wrangler versions view PREVIOUS_VERSION_ID
npm run deploy
npx wrangler deployments list
PRODUCTION_SMOKE=1 TEST_URL=https://pie.pe PLAYWRIGHT_HEADLESS_SHELL=1 npm test -- tests/production.spec.ts
```

The **Forest QA** workflow runs Chromium and macOS WebKit on source changes. After deploying that exact build, run it manually with `production_smoke: true` to validate real LV/EN production, application fingerprint, natural films, downloads, language/focus recovery, media ranges and strict 404 behavior. The production checks deliberately run after rollout, rather than comparing new source against old production before deployment. Keep credentials out of Git. `_headers` security policy is preserved and extended only with hashes of the generated non-executable structured data.
