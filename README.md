# pie.pe — Into the forest

A continuous, cinematic forest experience built with React, TypeScript, Vite and restrained GSAP motion. The real shelf fungus is the main interaction; no WebGL, generated replacement imagery, third-party embeds, analytics or backend.

## Develop and verify

Requires Node 22.12+ (Node 24 used for this implementation).

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npx playwright install webkit
npm test
```

The test matrix uses installed Google Chrome and Playwright WebKit with an iPhone 13 viewport. `TEST_URL=https://pie.pe npm test` runs the same browser checks against production. Browser binaries require an environment that permits GUI/browser subprocesses. Linux CI can remove `channel: 'chrome'` and install Chromium instead.

## Actual media and composition

- `public/media/forest-reveal.mp4`: supplied optimized 1920×1080 H.264/yuv420p, muted, faststart, 1,723,128 bytes, approximately 6.05 seconds. Plays once per tab session.
- `public/media/forest-final.jpg`: supplied matching end still, 126,965 bytes.
- `public/media/forest-poster.jpg`: supplied starting poster, 156,196 bytes.
- `source/forest-reveal-original.mp4`: original backup already in the repository; never copied to `dist`.

The three public asset Git blob hashes match the supplied ZIP exactly. Keep their filenames and replace them together if replacing the film. The still and film share one 1920×1080 cover plane. Desktop focal point is 50%; mobile is 64%. The interactive fungus center is mapped from the actual frame at 66.5% / 57%, with a generous keyboard/touch target. Change these values in `src/App.tsx` only after inspecting replacement media.

`IntroFilm.tsx` owns the one-shot lifecycle. Text enters from actual playback time 4.5s. End, skip, rejected autoplay, media error, no initial progress (4s), a stall (2.4s), deadline (9.5s), or backgrounding all recover to the preloaded final still. The video then unmounts. A session flag prevents replay on reload and native scrolling never controls playback. Reduced motion, data saving and 2G preferences avoid creating the video element entirely. The interactive still and all content are available without video; a basic forest fallback is included for JavaScript-disabled visitors.

Native `<dialog>` provides a focus trap and Escape support. Closing restores focus to the fungus. Native `<details>` provides expandable field notes. The atmosphere can be paused; reduced motion removes continuous effects and scroll animation. Fonts are self-hosted.

## Content

Edit `src/content.ts` to replace the three clearly labelled early field notes with real work. These are honest placeholders, not fake project links. Tagline, discovery and outro copy follow GitHub Issue #1 v1.1. The owner's later build/deploy brief supersedes the issue's original review-only and Cloudflare Pages instructions.

## Existing Cloudflare Worker

Production is **https://pie.pe**, served by the pre-existing Worker **piepe** using Workers Static Assets. `wrangler.jsonc` deploys `dist`, preserves the existing `pie.pe` custom domain and keeps workers.dev and preview URLs disabled. No Pages project, DNS records or unrelated resources are created. The previous Worker had no bindings, routes, logging or placement configuration to migrate. Configuration was inspected through the authenticated Cloudflare API before deployment.

```sh
npx wrangler whoami
npm run deploy
```

Use an authenticated Wrangler login or a properly scoped `CLOUDFLARE_API_TOKEN`. Never put credentials in source. `_headers` sets security and cache policy for static assets; hashed application files are immutable, media revalidates daily. If changing media, deploy all matching files together. Unknown paths return 404 instead of HTML masquerading as missing media.

For rollback, use `npx wrangler deployments list` then `npx wrangler rollback <VERSION_ID>`. Check the domain and media after any deploy or rollback. Avoid `wrangler pages deploy`: this is an existing Workers deployment.
