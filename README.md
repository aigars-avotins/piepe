# PIE.PE 3.3 — The living forest / Dzīvais mežs

A bilingual cinematic forest encounter about bracket fungi: Latvian at `/`, English at `/en/`, live at https://pie.pe.

- **Cinema.** A six-second introduction, a clickable fungus with a field-note dialog, a six-film portal into an imagined mycelial world with an optional guided thread, and two scroll-reached environmental films. Native scrolling throughout; no scroll hijack, WebGL or particle engine.
- **Reading.** Twenty-two prerendered documents (guide, six field notes, note index, wallpaper collection and the About / Colophon page, in both languages) that work without JavaScript, with interactive photographs: x-ray view, surface atlas with loupe, and a deadwood timeline.
- **Stack.** React 19, TypeScript, Vite, GSAP; static HTML prerendered at build time; Cloudflare Workers Static Assets, with a small Worker that adds byte-range streaming for `/media/*`; strict Content-Security-Policy with build-generated hashes.
- **One site.** The same menu ("Takas / Trails"), footer and small-light motif frame the cinema, the reading pages, the 404 page and the portal. `src/routes.ts` is the single route table: pages, the sitemap with `lastmod`, per-route social images and structured data are generated from it.
- **Fallbacks.** Reduced motion, Save-Data, paused motion, hidden tabs, failed playback and disabled storage all have explicit paths. Unknown addresses receive a designed bilingual `404.html`.

Release history lives in the versioned documents under `docs/`. Start with [V320-AWWWARD-CANDIDATE](docs/V320-AWWWARD-CANDIDATE.md) for the creative stance, [V330-EXPERIENCE](docs/V330-EXPERIENCE.md) for what 3.3 changed and why, [V330-QA](docs/V330-QA.md) for what was tested, and [V330-AWWWARDS-SUBMISSION](docs/V330-AWWWARDS-SUBMISSION.md) for the submission kit. [V320-EXPERIENCE](docs/V320-EXPERIENCE.md) and [V320-PERFORMANCE](docs/V320-PERFORMANCE.md) describe the cinema itself. Architecture background: [V23-ARCHITECTURE](docs/V23-ARCHITECTURE.md), [V21-ARCHITECTURE](docs/V21-ARCHITECTURE.md), [V23-MEDIA](docs/V23-MEDIA.md).

The cinematic imagery is AI-made artwork, not species-identification evidence; the scientific explanations are separate and sourced.

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

On a Mac with Google Chrome installed, `npx playwright install ffmpeg && npx playwright test --project=chrome-desktop` runs the Chromium suite locally (about an hour; keep the machine otherwise idle, several tests measure frame timing). Historical tests pin the hashes of protected files; when a release changes one on purpose, review the diff and run `node scripts/pin-reviewed-sources.mjs <path>` to record it in `docs/qa/v330/reviewed-sources.json`.

If the cloud image already has system Chromium, use it without changing source or installing another browser:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test -- --project=chrome-desktop
```

`npm run build` checks TypeScript, regenerates media sizes, builds the client and prerenders the complete App for both locales, retaining the server-painted DOM through React hydration. It also writes the localized field notes, the sitemap and the social images into `dist/` (nothing tracked is rewritten) and one CSP hash, for the small inline boot script; JSON-LD is a data block and needs none. The original media Worker is unchanged. Tests start `scripts/preview-worker.mjs` on port 4173; plain Vite preview does not reproduce media range behavior. `node scripts/qa-server.mjs` is an optional local-only fault injector on port 4174, excluded from deployment.

Run `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture-review.mjs` for actual Chromium screencast recording, desktop/mobile screenshots and lab metrics. It requires FFmpeg and writes ignored `review-results/`. Browser-emulated viewports do not establish physical handset/Safari testing. Do not run separate Playwright commands concurrently into the same output directory.

## Assets and design

The ten delivery films and their matched original-frame stills stay in `public/media/`. Supplied masters stay under `source/` (the six portal masters in `source/portal/`) and are never deployed. Extra serving copies of still images (AVIF/WebP) come from the optional `node scripts/image-derivatives.mjs`; films are never re-encoded. `src/media-sizes.ts` must match all actual public media; streaming handles 206/416/If-Range/HEAD without buffering full films, including versioned media URLs. Unknown assets keep legal full-response behavior. `python scripts/encode-v23.py` creates three review candidates per master in ignored `review-results/`; it never overwrites supplied masters or public files.

Typed LV/EN copy lives in `src/i18n.ts`, `src/siteCopy.ts` (menu, footer, About), `src/portalCopy.ts`, `src/threadCopy.ts`, `src/experienceCopy.ts`, `src/reading.ts` and `src/forestKnowledge.ts`; components carry no visible strings. One `mediaVersion` in `src/release.ts` is the cache-buster for every `/media/` URL in TypeScript, CSS and HTML. `Story.tsx` is rendered within the same App for the interactive page and initial HTML. Language links keep current playback, scroll, dialog state and the selected note. Notes and facts are generated from the same content, avoiding a separate translation drift.

Run `CAPTURE_LABEL=after PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture-seams.mjs` for decoded-readiness events, before/after seam frames and actual 30fps browser recordings at the five required sizes. `TEST_URL`, `PIEPE_REVIEW_DIR` and `CAPTURE_SIZES` select an exported baseline or another verified target. `capture-review.mjs` also records reverse scrolling; `JOURNEY_VIEWPORT='[390,664]'` selects a compact viewport and `SKIP_STATIC_VIEWS=1` omits duplicate static screenshots. All these recordings are local unless the target explicitly points to production.

See `docs/BRAND_IDENTITY.md` for the optional deterministic artwork pipeline and source-resolution/crop limits, `docs/V21-ARCHITECTURE.md` for scene lifecycles and integration decisions, and `docs/V21-SEO.md` for scientific-source review and Google Search Console owner steps. A quiet CC0 birds recording uses one native Web Audio loop with autoplay/first-interaction recovery, localized mute in both forest and dialog, persisted preference and hidden-tab suspension. The waveform is prepared by the optional `scripts/forest-audio.py`; source/license are in `public/audio/CREDITS.txt`. No new frontend framework, WebGL, audio or React Bits runtime was added.

For 2.3 native wheel/touch recordings, run `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture-v23.mjs`. `SIZES`, `MODES`, `STAGE`, `TEST_URL` and `PIEPE_REVIEW_DIR` select viewports, scenarios and a preserved baseline. This captures actual browser frames and timestamps plus decoder/readiness/crop traces; phone scrolling uses trusted touch input. It does not simulate a physical iPhone. The offline quality wipe viewer and capture commands are documented in [V23-MEDIA](docs/V23-MEDIA.md).

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

After deploying that validated build, select `validation: production` for both real LV/EN production smoke tests and retained browser recordings, without repeating the already completed local suites. The existing `production_smoke: true` option still runs both full suites plus live smoke when desired. These checks verify the application fingerprint, natural films, downloads, language/focus recovery, media ranges and strict 404 behavior. Production smoke deliberately runs after rollout, rather than comparing new source with old production. This workflow does not deploy or alter Cloudflare settings. Keep credentials out of Git; the existing Worker, `_headers` and security policy are unchanged.

Branch protection was checked when introducing these filters: `main` reports `protected: false`, with no required status checks (rechecked 2026-10-28 UTC). If protection is enabled later, do not require this path-filtered workflow on every PR without an always-triggered gate that also succeeds for excluded changes; GitHub leaves required checks pending when an entire workflow is filtered out.
