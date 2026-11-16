# Task: PIE.PE 3.3 — Awwwards submission readiness

## Goal

Bring https://pie.pe (repository `aigars-avotins/piepe`, currently release 3.2.0) to a state where the owner can submit it to Awwwards with confidence. Awwwards juries score four criteria: **Design 40%, Usability 30%, Creativity 20%, Content 10%**. Raise the weakest of these without diluting what already makes the site distinctive.

Work on a new branch. Do not deploy and do not open a pull request unless the owner asks; the owner deploys manually with `npm run deploy` after reviewing.

## What the site is

A bilingual (Latvian at `/`, English at `/en/`) cinematic forest experience about bracket fungi: a six-second intro film, a clickable fungus that opens a six-clip "portal" journey, scroll-driven environmental films, interactive photographs (atlas loupe, deadwood stages, x-ray), 20 prerendered reading routes, and wallpaper downloads. React 19, TypeScript, Vite, GSAP, prerendered HTML, Cloudflare Workers Static Assets with a strict CSP.

Read these first: `README.md`, `docs/V320-AWWWARD-CANDIDATE.md`, `docs/V320-EXPERIENCE.md`, `docs/V320-PERFORMANCE.md`, `docs/V320-QA.md`, `docs/BRAND_IDENTITY.md`, `docs/CREATIVE_MOTION_GUIDE.md`.

## Constraints that must hold

- **Keep the creative stance** in `docs/V320-AWWWARD-CANDIDATE.md`: restraint, native scrolling, no scroll hijack, no WebGL or particle engine, no new frontend framework, film never pauses for a compulsory lesson, sound never required.
- **Do not regenerate, re-encode or replace the cinematic footage** or change its hashes (`scripts/verify-portal-media.mjs` enforces this). Images may gain additional optimised derivatives.
- **Keep the strict CSP** in `public/_headers` (no third-party origins, no inline script beyond the hashed boot script).
- **Keep LV/EN parity.** Every string goes through the typed copy modules (`src/i18n.ts`, `src/experienceCopy.ts`, `src/portalCopy.ts`, and so on); no hard-coded visible text.
- **Keep the fallbacks**: reduced motion, Save-Data, no-JS reading pages, disabled storage, failed playback.
- **Keep honest attribution**: the imagery is AI-made artwork, not species evidence. Do not invent user studies, awards, testimonials or metrics.
- `npm run lint`, `npm run test:worker`, `npm run build` and the Chromium Playwright suite must pass at the end. Update tests whose assertions you intentionally change; do not delete coverage to get green.

## Phase 1 — Fix known defects (verified in a November 2026 audit)

Correctness
1. `src/EnvironmentalFilm.tsx` (~line 44): every `play()` rejection is treated as `autoplay-blocked`, including the `AbortError` caused by the component's own `pause()` on tab hide. Switching tabs while a film buffers latches the failed state and shows "Play film again" permanently. Ignore `AbortError`, as `src/portalCinema.ts` already does.
2. `src/IntroFilm.tsx`: the `error` listener is on `<video>`, but the source is a child `<source>`, whose load errors do not bubble. A missing intro film is only caught by the 4-second watchdog. Listen on the `<source>` as well.
3. `src/RasterImage.tsx` (~line 13): `data-alternate-src` points to `/images/interactive/<name>.webp`, which does not exist, so the fallback chain always makes one guaranteed 404 request. Point it at a real responsive derivative or remove it.

Payload and performance
4. `src/experienceControls.ts` (~lines 78–98): the atlas loupe sets the magnifier to the full 3.4–3.6 MB original JPEG on plain pointer move or keyboard focus, so brushing over three cards downloads about 10 MB; the lightbox then eagerly loads all three again. Use a sized derivative for the loupe and load the original only on explicit zoom.
5. `src/FungusPortal.tsx` (~lines 81–83): the "quiet" portal for Save-Data and reduced-motion visitors still downloads `/media/01_Start.png` (2.9 MB PNG) plus `portal-living-still.webp` (1.9 MB). Serve appropriately sized WebP/AVIF stills. `portal-living-still.webp` is byte-identical to `portal-05-first.webp`; serve one URL.
6. About 65 MB of unreferenced files are published from `public/`: `public/media/02_Zoom_in.mp4` through `07_Zoom_out.mp4` (only the `portal-0N-faststart.mp4` versions are played), `public/media/forest-mobile.webp`, `public/field-note.txt`, and the 1-byte `public/images/interactive/aaaa`. Move the masters to `source/` (updating `docs/qa/v300/sources.json`, `scripts/verify-portal-media.mjs` and `scripts/media-sizes.mjs` accordingly) and delete the junk.
7. `index.html` preloads `forest-poster.jpg` (660 KB) unconditionally, including for static-preference visitors who are then shown `forest-final.jpg`; the built HTML also carries a duplicate preload. `loading="lazy"` in `src/ForestScene.tsx` is ineffective on fixed in-viewport layers, so two more ~400 KB stills load immediately. Fix the loading order so first paint fetches only what it shows.
8. Cache-busters are stale and inconsistent: `?v=2.3` is hand-copied in `src/mediaUrl.ts`, `index.html` and nine places in `src/style.css`; `src/Story.tsx` uses `?v=2.2` while `src/ForestPage.tsx` uses the same files with no query; portal media bypasses `mediaUrl`. Derive one value from `src/release.ts` at build time.

Platform
9. `wrangler.jsonc` sets `not_found_handling: "404-page"` but no `404.html` is built. Add a designed, bilingual, on-brand 404 page (prerendered, CSP-compliant) — juries do check this.
10. `scripts/prerender.mjs` adds a CSP hash for every JSON-LD block. JSON-LD is a data block and needs no `script-src` hash; the CSP line is already 1,369 characters against Cloudflare's 2,000-character `_headers` line limit and grows by about 106 characters per new field note. Hash only the executable boot script.
11. `scripts/prerender.mjs` rewrites the tracked `public/field-note-{lv,en}.txt` on every build. Write only to `dist/`.

Accessibility
12. `src/SoundControl.tsx` and the toggle in `src/Story.tsx` change both `aria-pressed` and the label, so state is announced twice and contradictorily. Use one mechanism.
13. `src/Story.tsx` (~lines 27–28): the visible Latvian text "Aplūkot tuvāk" is hard-coded and differs from the `aria-label` (label-in-name failure), and the same action has two tab stops.

Housekeeping
14. Remove unused copy keys in `src/i18n.ts` (`stay`, `lookCloser`, `encounterBody`, `openNote`, `mediaUnavailable`) and the uncalled `snapshot()` in `src/portalCinema.ts`.
15. `README.md` still describes release 2.3; rewrite it for the current release.
16. `tests/scroll-recording.spec.ts` fails in the default local Chromium run; make it skip cleanly when its prerequisites are absent.

## Phase 2 — Awwwards-level polish

Audit the real pages in a browser at 390×844, 768×1024, 1440×900 and 2560×1080, in both languages, before changing anything. Capture before screenshots. Then propose and implement improvements in these areas, each justified against a jury criterion:

**Design (40%)**
- Typographic system: scale, rhythm, measure, Latvian diacritics, widows and orphans, consistent use of Cormorant Garamond and Manrope across cinema and reading pages.
- Layout consistency between the cinematic home page and the 20 reading routes, so they feel like one authored site rather than an experience plus a blog.
- Micro-interactions: hover, focus, pressed and loading states for every control; a considered custom cursor or pointer affordance only if it survives the restraint test.
- Page-to-page transitions between home and reading routes (consider the View Transitions API with a no-support fallback).
- A deliberate first-load moment (loader or reveal) that masks media readiness without delaying content.
- Footer, credits and colophon designed to the same standard as the hero.

**Usability (30%)**
- First-visit clarity: within five seconds a newcomer must know what this is, that the fungus is interactive, and how to proceed. Review the invitation, scroll cue and control labels.
- Navigation: a persistent, unobtrusive way to reach reading pages, wallpapers, language switch and sound from anywhere, including inside the portal.
- Touch ergonomics: 44 px minimum targets, safe-area insets, no hover-only functionality (the atlas loupe in particular).
- Performance budgets on the home page, mobile throttled: LCP under 2.5 s, CLS under 0.1, INP under 200 ms, Lighthouse performance 90+ on reading pages. The main bundle is currently 459 KB (155 KB gzipped) in one chunk — split the portal, discovery dialog and GSAP-dependent code so reading-first visitors do not pay for them. Add AVIF derivatives where they beat WebP.
- WCAG 2.2 AA throughout: contrast over moving imagery, focus visibility, dialog semantics, captions or a text equivalent for the films' narrative, keyboard-complete journeys.

**Creativity (20%)**
- Strengthen the one signature idea (attention as a small movable light) rather than adding new effects. Look for two or three places where it can recur as a motif: loader, 404 page, reading-page headers, link hovers.
- Sound design: confirm the ambience transition into and out of the portal feels authored.

**Content (10%)**
- Tighten microcopy in both languages; have the Latvian read as original writing, not a translation.
- An "About / Colophon" section or page: concept, process, tools, credits, AI-imagery statement, contact. Juries and visitors look for it.

**SEO and sharing**
- Unique `og:image` per route (currently every page shares `social-preview.jpg`), generated at build time, 1200×630.
- Richer structured data: `Article` with `datePublished`/`dateModified` and `BreadcrumbList` on field notes, `ImageObject` with licence on wallpapers, `VideoObject` for the films, `WebSite` on the home page.
- `lastmod` in `public/sitemap.xml`, generated from the same route table as the pages instead of maintained by hand.
- Unique, length-checked titles and descriptions per route; internal linking between field notes; descriptive `alt` text review.
- Web manifest: add `description`, `lang`, maskable icon and screenshots.
- Add `Strict-Transport-Security`, `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` to `public/_headers` if not already set at the zone.

## Phase 3 — Submission kit

Create `docs/V330-AWWWARDS-SUBMISSION.md` containing:
- Site title, a 160-character description and a longer one, in English; suggested categories and tags; technologies list; credits.
- A shot list for the required imagery (desktop and mobile screenshots at the sizes Awwwards currently requests — check their submission guidelines, do not guess) and a storyboard for a 30–60 second screen capture.
- Final Lighthouse scores for home and one reading page (mobile and desktop), and the before/after screenshot pairs.
- An owner checklist for what cannot be verified in automation: physical iPhone and Android, VoiceOver and TalkBack, Search Console, real-network playback.

## Deliverables and definition of done

- One branch with focused commits: Phase 1 fixes first (one commit per numbered item or small group), then Phase 2 changes grouped by area.
- `docs/V330-EXPERIENCE.md` (what changed and why, with before/after screenshots), `docs/V330-QA.md` (what was tested, exact results, known limitations) and the submission kit.
- Keep new QA evidence small: screenshots and short clips only, no multi-megabyte JSON traces (the repository already carries 656 MB under `docs/qa/`).
- `package.json` and `src/release.ts` bumped to 3.3.0.
- Lint, unit tests, build and the Chromium suite pass; state plainly anything that was not run (the native macOS WebKit suite needs the owner's GitHub Actions release workflow).
- Finish with a short report: what improved per Awwwards criterion, what was deliberately left alone, and what the owner must decide or check by hand.

When a design decision is a matter of taste with real trade-offs (new navigation, loader, cursor, colophon page), build the option you recommend, show screenshots, and note the alternative — do not stop to ask before every change.
