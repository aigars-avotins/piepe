# pie.pe 2.0 — The Living Forest

An intimate digital art encounter around the owner's original six-second forest film. React, TypeScript, Vite and GSAP; no WebGL, generated replacement media, database or external fonts.

## The experience

Four connected camera states: arrival, beneath the bark, fungus encounter, return to daylight. Native scrolling drives photographic framing, a foreground trunk, a continuous fungus close-up, cool shadow and warm return light. The returning wide frame is the original film's start poster. CSS transforms/opacity do the work; there is no video scrubbing or permanent JavaScript animation loop.

The fungus opens a photographic field encounter: three keyboard/touch observations (Surface, Beneath, Beyond), an original micro-story and a real downloadable plain-text field note. The line map is explicitly an imagined map of attention, not a species identification. No placeholder projects or invented biography/links. A session mark records that the visitor collected the note; no data is transmitted.

The original 6.041667s, 1920×1080 H.264 intro and its three public assets remain byte-for-byte unchanged. Automatic playback stays once per tab session. “Replay film” is explicit. Skip, end, autoplay rejection, missing media, no initial progress (4s), stall (2.4s), deadline (9.5s) and hidden-page exits converge on the matched still. Reduced-motion/save-data visitors bypass automatic video. Explicit replay remains available by user choice.

The native dialog retains focus trapping and Escape. Closing restores focus to the actual opener. Arrow/Home/End keys navigate observations. Return-to-forest updates the anchor and focus. Safe-area mobile layouts are authored separately. Reduced motion and paused atmosphere provide distinct static scene compositions. Fonts and all content are self-hosted. No new media or frontend libraries were added for 2.0.

## Develop and verify

Node 24 used; Node 22.12+ required by Vite.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run test:worker
npm run build
npx playwright install chromium webkit
npm test
```

Local Chrome is the default desktop test target; `PLAYWRIGHT_HEADLESS_SHELL=1` uses bundled Chromium. CI uses Chromium + iPhone-size WebKit, runs the full suite and retains screenshots, traces and silent 15-second before/after scroll recordings. `TEST_URL=https://pie.pe npm test` targets production (the recording test is intended for pre-deployment CI).

The local sandbox may deny browser subprocess startup; that is an environment failure, not a passing result. The in-app browser can still perform visual/interaction checks. See `docs/V2-QA.md` for actual outcomes and limitations, and `docs/V2-STORYBOARD.md` for audit/creative decisions.

A local-only fault injector serves the production build:

```sh
node scripts/qa-server.mjs
# http://127.0.0.1:4174/?qa=natural
```

Scenarios: natural, blocked, stall, pending, missing-video, missing-still, reduced, save-data. This script and source backup are excluded from deployed dist.

## Media and art direction

- `public/media/forest-reveal.mp4`: supplied optimized 1,723,128-byte film; muted H.264/yuv420p faststart.
- `public/media/forest-final.jpg`: supplied near-final still, 126,965 bytes.
- `public/media/forest-poster.jpg`: supplied initial poster, 156,196 bytes.
- `source/forest-reveal-original.mp4`: original backup in GitHub, never publicly deployed.

Film, still and hero hit target use the same 1920×1080 cover geometry, desktop focal point 50%, portrait 64%. Traced shelf edge paths live in `src/content.ts`; the photographic layers are in `ForestScene.tsx`; camera choreography in `useForestMotion.ts`. Replace the three media assets together and revalidate trace coordinates if the film changes.

The narrative is in `src/content.ts`; its take-away is `public/field-note.txt`. Keep both consistent when editing. Do not add unapproved project links.

## Existing production infrastructure

**https://pie.pe** · existing Worker **piepe** · Workers Static Assets.

`wrangler.jsonc` preserves the existing account, custom domain, compatibility date, disabled workers.dev/previews and route configuration. `dist` is the only public deployment directory. Only `/media/*` invokes the Worker; application files use Static Assets directly. No Pages project, DNS edits or extra resources.

The range handler requests a full representation from ASSETS, then slices its stream, retains only a source chunk and cancels when the requested range ends. The production binding omits Content-Length, so `scripts/media-sizes.mjs` generates `src/media-sizes.ts` from the actual public media on every build. Header length takes priority when supplied. This serves 206/416/If-Range without reading the full MP4 into an ArrayBuffer. Ten tests cover bounded/open/suffix/clamped ranges, HEAD, missing metadata, exact build sizes, missing assets and upstream cancellation. Unknown assets with no usable size legally receive the full response.

```sh
npx wrangler whoami
npm run deploy
npx wrangler deployments list
npx wrangler rollback VERSION_ID
```

Keep credentials out of Git. `_headers` supplies security policy and caching. Existing 404 behavior is preserved. Before deployment, record the current production version for rollback; after deployment verify the custom domain, exact asset hashes, 206/416 responses and real-browser interactions.
