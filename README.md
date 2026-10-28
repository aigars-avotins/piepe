# PIE.PE 2.2 — The living forest / Dzīvais mežs

An interactive forest encounter in Latvian at `/` and English at `/en/`. React, TypeScript, Vite and the original native-scroll GSAP camera; Cloudflare Workers Static Assets with bounded media streaming. The 2.0 production history is retained in `docs/V2-QA.md`; 2.1 history is in `docs/V21-QA.md`; the current cinematic architecture, recordings, lab measurements and release limits are in `docs/V22-QA.md`.

The original six-second introduction retains its once-per-tab, skip/replay and recovery behavior. The shaped fungus target plays a one-shot awakening in the original graded forest plane, then moves its held final frame into the native dialog, three keyboard-navigable observations and a localized downloadable field note. The next scene prepares behind the existing bark foreground and grading before its reversible native-scroll entrance. The scroll journey moves into the moss macro film and returns to a quiet wide breathing shot. Reduced motion, save-data, pause, visibility changes, failed playback and disabled storage have explicit fallbacks. Only one film plays at a time; scenes do not scrub or loop on every scroll.

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

`npm run build` checks TypeScript, regenerates media sizes, builds the client and prerenders the complete App for both locales, retaining the server-painted DOM through React hydration. It also generates localized field notes and exact CSP hashes for the small inline boot script and both JSON-LD payloads. The original media Worker is unchanged. Tests start `scripts/preview-worker.mjs` on port 4173; plain Vite preview does not reproduce media range behavior. `node scripts/qa-server.mjs` is an optional local-only fault injector on port 4174, excluded from deployment.

Run `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture-review.mjs` for actual Chromium screencast recording, desktop/mobile screenshots and lab metrics. It requires FFmpeg and writes ignored `review-results/`. Browser-emulated viewports do not establish physical handset/Safari testing. Do not run separate Playwright commands concurrently into the same output directory.

## Assets and design

The four supplied H.264 clips and their images stay in `public/media/`. The original master stays under `source/` and is never deployed. `src/media-sizes.ts` must match all actual public media; streaming handles 206/416/If-Range/HEAD without buffering full films. Unknown assets keep legal full-response behavior.

Typed LV/EN copy lives in `src/i18n.ts`. `Story.tsx` is rendered within the same App for the interactive page and initial HTML. Language links keep current playback, scroll, dialog state and the selected note. Notes and facts are generated from the same content, avoiding a separate translation drift.

Run `CAPTURE_LABEL=after PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture-seams.mjs` for decoded-readiness events, before/after seam frames and actual 30fps browser recordings at the five required sizes. `TEST_URL`, `PIEPE_REVIEW_DIR` and `CAPTURE_SIZES` select an exported baseline or another verified target. `capture-review.mjs` also records reverse scrolling; `JOURNEY_VIEWPORT='[390,664]'` selects a compact viewport and `SKIP_STATIC_VIEWS=1` omits duplicate static screenshots. All these recordings are local unless the target explicitly points to production.

See `docs/BRAND_IDENTITY.md` for the optional deterministic artwork pipeline and source-resolution/crop limits, `docs/V21-ARCHITECTURE.md` for scene lifecycles and integration decisions, and `docs/V21-SEO.md` for scientific-source review and Google Search Console owner steps. A quiet CC0 birds recording uses one native Web Audio loop with autoplay/first-interaction recovery, localized mute in both forest and dialog, persisted preference and hidden-tab suspension. The waveform is prepared by the optional `scripts/forest-audio.py`; source/license are in `public/audio/CREDITS.txt`. No new frontend framework, WebGL, audio or React Bits runtime was added.

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

The **Forest QA** workflow automatically runs TypeScript, ESLint, Worker unit tests and the production build for relevant code/configuration/runtime-asset pushes to `main` and pull requests targeting `main`. Documentation, `source/` masters, `*-original.*` master uploads and unrelated files do not trigger it. Newer commits cancel obsolete automatic/diagnostic runs for the same branch or PR.

Before a major release, open **Actions → Forest QA → Run workflow**, select the release branch and `validation: release` (the default). Both full Chromium and native macOS WebKit suites must succeed, and the real cinematic transitions, media readiness and LV/EN experience still need visual review before deployment. Single-browser `chromium`/`webkit` modes are diagnostic runs and do not establish release approval. Each release validation has a unique concurrency group and cannot be canceled by a newer push or another release.

After deploying that exact build, run **Forest QA** with `production_smoke: true`. This always runs both full browser suites and both real LV/EN production smoke tests, checking the application fingerprint, natural films, downloads, language/focus recovery, media ranges and strict 404 behavior. Production smoke deliberately runs after rollout, rather than comparing new source with old production. This workflow does not deploy or alter Cloudflare settings. Keep credentials out of Git; the existing Worker, `_headers` and security policy are unchanged.

Branch protection was checked when introducing these filters: `main` reports `protected: false`, with no required status checks. If protection is enabled later, do not require this path-filtered workflow on every PR without an always-triggered gate that also succeeds for excluded changes; GitHub leaves required checks pending when an entire workflow is filtered out.
