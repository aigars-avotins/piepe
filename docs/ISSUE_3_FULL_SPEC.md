<!--
READ THIS FIRST IN CODEX IF THE GITHUB ISSUE API RETURNS FORBIDDEN.
Full local mirror of GitHub Issue #3.
Source: https://github.com/aigars-avotins/piepe/issues/3
Snapshot created 2026-10-28.
The Issue may receive later edits. Before starting, also read docs/V2_TO_V21_AUDIT.md.
-->

# [PIE.PE 2.1 / READY] New cinematic videos + LV/EN SEO + premium identity + 5K wallpapers

# PIE.PE 2.1 — Cinematic asset-driven interactive forest & production deployment

## ✅ 2.0 COMPLETED — 2.1 UNBLOCKED — AUDIT OF ACTUAL CODE (2026-10-27)

**Owner confirmation:** Codex 2.0 is finished. GitHub Issue #2 is CLOSED, and its documented live Worker `piepe` production release is `70a6954d-f95c-4703-a142-985829809650`. Main QA commit `9c7e25ad1d6d465bb82104aa57716e7a0436c2d4`; source has newer design and wallpaper commits, **so fetch current `main`**.

**MANDATORY: read [docs/V2_TO_V21_AUDIT.md](https://github.com/aigars-avotins/piepe/blob/main/docs/V2_TO_V21_AUDIT.md) FIRST**, then this issue, #2, V2-QA, Creative Motion, React Bits, Brand/Wallpaper specs. This audited transition document is authoritative whenever older issue comments or requirements still describe 2.0 as unfinished or wallpaper/video files as missing.

### Specific 2.0 deficiencies now to fix in 2.1
1. **Cinematic media integration:** 2.0 `App.tsx`, `ForestScene.tsx` and `useForestMotion.ts` animate static images. Three new, optimized MP4s, their posters/end-stills and mobile hero are **already in `public/media/`**, UNUSED. Add a robust one-shot `forest-awakening` on fungus activation, a separate macro `forest-understory` scroll scene and a quiet `forest-breathing` outro with frame-aligned still recovery, intentional pacing and full-bleed cover. Preserve the existing native-scroll GSAP sophistication; don't simply replace it with unconnected clips.
2. **Preserve completed 2.0 discovery UX:** `Discovery.tsx` has three keyboard-controlled observations, focus/Escape recovery and a real downloadable field-note, plus session collection status. **Do NOT throw these away** in favor of a new video-only click. Integrate the Awakening video and the short factual `Kas ir piepe?` section into this experience, while keeping meaningful on-page crawlable text. Update field-note download for LV/EN.
3. **Bilingual SEO:** Current `index.html` and visitor-facing UI remain English. Implement LV-default `/` and truly initial-HTML crawlable English `/en/`; real localized title/meta/noscript/H1/fungus facts, canonical/hreflang/sitemap and accessible LV/EN switch. No language toggle replaying/reinitializing the intro or losing discovery state; retain working static Worker routing and 404/206.
4. **Brand & palette:** New fungus vector mark exists under `design/` but live `public/favicon.svg` is still old. Implement identity in real `.ico`, SVG/touch PNG/header, with the owner's approved forest/moss/amber/ivory palette in the entire site.
5. **Wallpapers:** Owner's FINAL DESKTOP + near-9:16 MOBILE PNGs **are now already in GitHub** at `design/wallpapers/piepe-wallpaper-desktop-source.png` (3,733,323 bytes) and `design/wallpapers/piepe-wallpaper-mobile-source.png` (3,773,735 bytes, 1143x2048). Old instructions saying PNGs must be uploaded are OBSOLETE. Create two beautiful footer preview/download choices with real high-quality output files and subtle official fungus logo + `pie.pe` signature only. Do not request reupload or regenerate random forest images.
6. **Video compatibility:** `public/media/forest-reveal.mp4` has ALREADY been RESTORED by 2.0 to optimized 1,723,128-byte H.264. Old 19MB regression alert is OBSOLETE — **DO NOT replace it unnecessarily**. Retain working `src/worker.ts` bounded-stream 206/416 implementation, `scripts/media-sizes.mjs`, range tests and original intro poster matching.
7. **Editorial direction:** 2.0's copy is coherent but lengthy and entirely English; `src/content.ts` poetic notes are not yet real educational fungus facts. Reduce distracting hero overlays while keeping narrative sophistication; write evocative short LV/EN editorial lines plus concise, useful, species-agnostic natural-history facts accessible in actual HTML.
8. **Regression-safe rollout:** Preserve 2.0's intro once-per-session + replay/skip/timeouts, shaped hotspot, keyboard dialog navigation, focus restore, field-note download, collected state, atmosphere pause/reduced-motion/save-data, mobile/compact Safari layout, no fake projects, CSP and strict 404. Reuse and extend CI: reported 10 worker + 35 browser + 2 production checks. Physical iPhone not yet verified; never claim it was.

**Execution is NOW AUTHORIZED.** Start with latest main, inspect current deployment, implement full 2.1, test, push main, deploy **ONLY** existing Worker `piepe` and verify real LV/EN production HTTP + browser flows. Report commit, version, live checks, screenshots/video and any remaining limitations. Do not redeploy stale 2.0 code or invent QA results.

---


## FINAL MOBILE WALLPAPER APPROVED — REPLACES OLD 3:4 ART

The owner approved a NEW **near-9:16 portrait** Higgsfield mobile wallpaper and explicitly selected it over the earlier 3:4 composition.

- **Source path to use:** `design/wallpapers/piepe-wallpaper-mobile-source.png`.
- **New original dimensions:** **1143 × 2048** PNG (approximately 9:16; trim just **8px top + 8px bottom** to get exact 9:16 if needed).
- Composition: recognizable amber/ivory shelf-fungus cluster lower-middle/right, dramatic aged mossy trunk, dark left forest and generous clean upper space for lockscreen clock.
- **Discard the previous 1529 × 2048 mobile wallpaper source.** Do not use it even if a previous chat/export exists.
- The final downloadable mobile output is a separate **1440 × 3120** target; this is taller than 9:16, so DO NOT merely distort the approved source or crop away the shelf fungus. Prefer careful top/bottom outpainting, or documented focal-safe crop with reference visuals; test phone lockscreen overlays.
- The **2048 × 1143 desktop artwork remains approved and unchanged**.
- Both final source PNGs were verified in the current GitHub tree. No additional upload required.
- Official logo and small `pie.pe` signature are overlaid at compositing time, no other baked text. 2.0 completion is confirmed; 2.1 may proceed.

---

## REVIEWED OWNER WALLPAPER ART — 2026-10-27

The owner has now supplied both **actual Higgsfield artwork sources**. Visual review approved them; no need to generate alternative images.

**Approved original source files (both now committed as binary PNGs):** [`design/wallpapers/README.md`](https://github.com/aigars-avotins/piepe/blob/main/design/wallpapers/README.md).

- `design/wallpapers/piepe-wallpaper-desktop-source.png` — **2048 × 1143**, serene wide forest, aged mossy stump with shelf fungi, suitable as composition for desktop wallpaper.
- `design/wallpapers/piepe-wallpaper-mobile-source.png` — **1143 × 2048**, owner-approved REPLACEMENT near 9:16 portrait; the earlier 1529 × 2048 3:4 version is obsolete. Preserve the same fungus while composing the taller 1440 × 3120 target.
- The files are **not yet uploaded to GitHub** as binary image objects. A prepared archive was delivered to the owner to place them in `design/wallpapers/`. Wait for these exact source paths before final wallpaper rendering. Do not invent a different wallpaper or mark the assets uploaded prematurely.
- Desktop/phone download art should contain only the existing `design/piepe-mark.svg` and a discreet `pie.pe` signature, composed after the fact — not embedded in the AI source image. Actual file resolution is not 4K/5K; appropriately upscale, examine 100% crop, and avoid misleading claims.
- 2.0 has completed; 2.1 may now proceed.

---


## APPROVED BRAND PALETTE + RETINA WALLPAPER GIFT (owner update 2026-10-27)

**The illustrated PIE.PE icon's colors are now the approved SITE-WIDE palette, across every page/state.** Add a small, premium end-of-page wallpaper download experience for visitors, using our authentic forest imagery and official bracket-fungus logo.

**MANDATORY full specification and deliverables:** [`docs/WALLPAPER_AND_PALETTE.md`](https://github.com/aigars-avotins/piepe/blob/main/docs/WALLPAPER_AND_PALETTE.md). Read and implement it as part of #3; it supersedes inconsistent color recommendations elsewhere in this issue.

**Palette:** forest `#0B1712`, moss `#7D9075`, fungus amber `#A96D3B`, warm ivory `#F2D7A2`, editorial off-white `#EAE8DF`. These tones should unify typography, overlays, controls, focus states, headers, FAQ/facts, bilingual selector, identity, social preview and downloadable art — without artificially recoloring the source movie.

**Wallpaper feature — no extra text in the artwork:**
- Beautiful, professional, faithful-to-PIE.PE photographic forest wallpapers with **only the original stylized fungus icon + a small `pie.pe` web address** in a quiet corner (no quotes or promotional copy).
- One **Desktop/Datoram** and one **Phone/Telefonam** preview near the footer, localized to LV(default)/EN, accessible real download links and mobile-friendly layout.
- Actual downloads: desktop **5K 5120×2880**, desktop **4K 3840×2160**, mobile **1440×3120**. Deliver genuine image files with verified dimensions and high-quality detail; choose original footage/forest-mobile visual base and carefully upscale or re-render. **Do not misrepresent resized 1080p frames as native 5K** or publish obviously blurry files.
- Reuse SVG mark from `design/piepe-mark.svg`, do not paste in the preview board. Place mark + `pie.pe` discreetly, avoiding fungus, desktop icons, mobile clock and controls. No giant watermark.
- Store files under `public/wallpapers/`, optimize separate lazy preview thumbnails and avoid preloading full wallpaper on page entry. Test direct download and exact resolution, HTTP status/mime, Safari Chrome mobile/desktop, and fallback if browser opens image.
- Deliver a coherent brand style, never generic illustration, unrelated stock forest or AI-invented alternate fungus. If true quality cannot be achieved with existing source/tool access, report missing high-resolution source as a blocker to *this feature* rather than substituting low-quality images.

**Updated:** 2.0 has completed. The 2.1 implementation is authorized, preserving the finished 2.0 behavior.

---


## CREATIVE COPY, MEANINGFUL FUNGUS DISCOVERY & NEW PIE.PE BRAND ICON — owner instructions (2026-10-27)

**NEW HARD REQUIREMENT: Text must amplify the forest's WOW effect, never cover or compete with video. The nature/fungus facts are genuine visitor value, NOT just SEO filler. The website must have an original, stylized shelf-fungus identity mark usable both as favicon.ico and across the visual system.**

### A. Cinematic editorial direction — short, deep, not clichéd

- Treat words like quiet, intentional cinematographic moments: one thought per scene, precise timing and deliberate blank space. Maintain a powerful visual hierarchy; do not put paragraphs in the hero or overlay content on the real bracket fungus.
- Main intro (original 6.04s): **no large copy fighting with the film**. Only reveal a concise brand wordmark + at most one short thought toward the end (~last 1–1.5s) or after it holds. Place text in verified safe space independently for desktop/mobile.
- Example LV/EN **creative starting points** (rewrite if a substantially stronger original thought is found; preserve meaning and editorial simplicity):
  - Hero: **LV:** `Paskaties tuvāk.` / **EN:** `Look closer.`
  - Fungus activated: **LV:** `Redzamais ir tikai sākums.` / **EN:** `What you see is only the beginning.`
  - Moss/understory: **LV:** `Arī klusumā viss turpinās.` / **EN:** `Even in stillness, life goes on.`
  - Outro: **LV:** `Tas, kas beidzas, dod vietu jaunam.` / **EN:** `Every ending makes room for something new.`
- Avoid derivative `Awwwards` placeholder prose (`crafted with passion`, `we create experiences`, `discover the unexpected`, etc.), fake profound quotes, repeated abstract slogans, SEO word-salad or fake claims that the user owns certain projects.
- A screen recording of the site with **text layers hidden** should still deliver the main visual story. With text visible, it should gain meaning, never reduce immersion. At least a first-run/return-visitor and desktop/mobile typography review.

### B. Give visitors authentic, enjoyable insight about bracket fungi

Use a small, art-directed section titled e.g. **`Kas ir piepe?` / `What is a bracket fungus?`**, introduced *after* the major cinematic reveal, not during the intro. Present brief, digestible factual discoveries with image details, intuitive tap/scroll interactions and meaningful microcopy; not an SEO paragraph dump, long encyclopedia, or popups blocking the video.

Recommended three curiosity beats (keep informational text crawlable, semantic and accessible, not exclusively hidden behind a click):
1. **The visible part / redzamā daļa:** A bracket is a fungus's visible fruiting body, frequently attached to a trunk or branch. Much of the fungus may extend within the wood. `Ko tu patiesībā redzi?` / `What are you really seeing?`
2. **The forest recycler / meža aprite:** Many wood-decay fungi break down wood and contribute to nutrient cycling, while some bracket fungi also occur on living trees and may damage wood. `Kas notiek ar koku?` / `What happens to the wood?`
3. **The hidden underside / neredzamā puse:** Many polypore-type brackets release spores through tiny pores beneath the shelf. `Kas slēpjas apakšpusē?` / `What's underneath?`

Suggested concise Latvian editorial explanation (NOT to plaster across hero; refine wording and translate naturally):
> `Piepe nav tikai izaugums uz koka. Tā ir redzamā daļa no sēnes, kas bieži turpina augt koksnē. Daudzām piepēm apakšpusē ir sīkas poras, pa kurām izplatās sporas. Daudzas koksnē dzīvojošās sēnes noārda koksni un palīdz mežā apritēt barības vielām.`

Suggested EN draft:
> `A bracket fungus is more than a shape on a tree. What we see is its fruiting body; much of the organism can remain hidden within wood. Many brackets have tiny pores underneath that release spores. Wood-decay fungi also help break down timber, returning nutrients to the forest.`

**Accuracy guardrails:** These user-supplied forest videos are AI generated: DO NOT identify a specific fungus species from the visuals, pretend the footage documents a real named location, suggest edibility/medicinal benefits, or imply all bracket fungi behave identically. Distinguish `many/some` from `all`. Verify ecology/biology claims against reputable resources, e.g.:
- https://www.woodlandtrust.org.uk/blog/bracket-fungi-identification/
- https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/habitats/deadwood/
- https://growwild.kew.org/plants/chicken-woods
- https://archive.bio.ed.ac.uk/jdeacon/FungalBiology/bracket.htm

The educational section should contribute real user value AND support honest LV/EN SEO, without sacrificing the cinematic focus. Metadata must correspond to **visible factual content**. Make the source HTML indexable via the pre-rendered / and /en/ implementation specified above.

### C. A real brand identity mark already drawn, vector sources committed

A new **PIE.PE bracket-fungus identity mark** was created for v2.1: three layered, amber/ivory shelf-fungus fans growing sideways from a mossy tree-bark stroke; no stem-and-cap icon and no cartoon mushroom.

**Prepared vector source files now in this repo** (do not assume production favicon is already replaced):
- [`design/piepe-mark.svg`](https://github.com/aigars-avotins/piepe/blob/main/design/piepe-mark.svg) — transparent main brand mark.
- [`design/piepe-favicon.svg`](https://github.com/aigars-avotins/piepe/blob/main/design/piepe-favicon.svg) — rounded deep forest background.
- [`design/piepe-mark-monochrome.svg`](https://github.com/aigars-avotins/piepe/blob/main/design/piepe-mark-monochrome.svg) — ivory monochrome alternative.

These are an **original V1 icon candidate** provided for this site. Use the supplied paths as the visual basis, not an unrelated generated emoji/template. Refine small-size rendering if necessary while retaining distinct shelf-fungus silhouette and premium restrained palette.

Deliverables once v2.0 is finished:
- New production `public/favicon.svg` and **real binary** `public/favicon.ico` including legible 16x16, 32x32, 48x48+ resolutions.
- `public/apple-touch-icon.png` (180x180), `public/icon-192.png` and `public/icon-512.png`, and update site head/manifest metadata appropriately. Use optimized real formats; do not just rename PNG as ICO.
- Reuse the same icon in header/brand lockup, optional discovery seal, footer and social icon context without excessive repetition; allow icon-only and icon + `pie.pe` wordmark variations.
- Keep colors consistent with site: forest `#0B1712`, moss `#7D9075`, warm amber `#A96D3B`, ivory highlight `#F2D7A2`; test transparent/dark/light applications.
- Inspect screenshots at 16, 32, 64, 180, 512px and evaluate recognizable silhouette and contrast. If small favicons blur, use a deliberately simplified variant rather than shrinking complex lines.
- Document brand colors, icon usage, clear space, minimum size and SVG source in `docs/BRAND_IDENTITY.md`. Supply at least one site screenshot showing icon in-context.
- **Do not change production favicon now while #2 is underway**; these are staged design assets for the v2.1 implementation only.

### D. Acceptance checks added
- [ ] Every scene has one meaningful thought, with nothing obscuring the star video/fungus on desktop or mobile.
- [ ] Complete professional LV/EN editorial voice, Latvian first, not English leftovers.
- [ ] Fungus facts are genuinely informative, engaging, verified, species-agnostic and present in visible crawlable HTML in both languages.
- [ ] New original bracket-fungus mark integrated across identity and output as genuine SVG, favicon.ico, mobile touch icons and other sizes; recognizable at 16px.
- [ ] Existing #2 finish-before-#3 condition, Cloudflare Workers deployment and live checks still apply.

---

## DELIVERY ORDER & DEPENDENCY — RESOLVED: PIE.PE 2.0 COMPLETE (2026-10-27)

**RESOLVED 2026-10-27:** Issue #2 is CLOSED, and its production deployment is documented in `docs/V2-QA.md`; **2.1 IS NOW UNBLOCKED**. Do not work from an outdated base; pull latest `main`.

Issue #2 is completed and closed. Fetch current `main`, inspect current production and completed v2.0 output and implement #3 on top of that exact codebase. Never reset/revert, overwrite or force-push v2.0 work. Coordinate one production deploy at a time.

The previous 2.0 dependency is satisfied. The owner has explicitly requested preparation to start Codex 2.1.

## MANDATORY SEO & GOOGLE DISCOVERABILITY — LV + EN (owner requirement, 2026-10-27)

**Goal:** Make the real interactive forest website discoverable for its own name **PIE.PE** and relevant searches, including Latvian **"piepe", "piepes", "piepe uz koka", "kas ir piepe"** and English **"bracket fungus", "shelf fungus", "polypore", "fungus growing on tree", "interactive forest"**, *only where the actual page content genuinely answers the query*. Build long-term organic search foundations without overpromising rankings. Generic species/biology keywords are highly competitive and may need more genuine editorial content over time.

### URL and multilingual indexing strategy — overrides earlier simple ?lang=en preference
- **Canonical LV page:** `https://pie.pe/` — content in Latvian, rendered as Latvian **on the initial HTTP response**, with `<html lang="lv">`.
- **Canonical EN page:** `https://pie.pe/en/` — genuinely localized English content, 200 on direct deep link/refresh, with `<html lang="en">`.
- Use stable, **self-referencing canonicals** (LV → `/`, EN → `/en/`), and reciprocal alternate `hreflang="lv"`, `hreflang="en"`, optional `x-default` → `/`. Every localized page must name itself and its counterpart. Do NOT canonicalize English to Latvian or dynamically rewrite a different initial canonical with JS.
- If `?lang=en` from an earlier version exists, redirect or otherwise canonically consolidate it to `/en/` without redirect loops. Avoid duplicate equivalent URLs and legacy fragment language routes.
- The language switch is an accessible **real crawlable `<a href>` link** to the alternate canonical URL; preserve intent / scroll or interaction if technically safe, but **do not block crawler visibility** with locale cookies or automatic Accept-Language redirects. Respect user language selections through explicit URLs/bookmarks and an optional preference, while allowing `/` to remain reliably LV in crawled HTML. Do not auto-redirect search crawlers.
- **Key implementation challenge:** existing site is React/Vite SPA using Cloudflare Workers Static Assets. Do NOT claim localization complete if both URL responses return the same empty English-language `index.html` shell and all language/meta changes happen only in client JS. Prefer lightweight build-time pre-rendered **real, meaningful HTML** for each locale (or justified server-rendering/Worker handling), followed by React hydration/interactive enhancement. Preserve existing Workers Static Assets routing, `/media/*` streaming/206 support and meaningful 404s. Test no-JS fetch, rendered browser and Googlebot-style HTML inspection.

### Search-facing content and intent
- Provide **one intentional, crawlable main heading/structure** and meaningful, non-generic **indexable body copy** in both locales, visible within the normal design (not keyword-stuffed, hidden or only in video/canvas/dialog). Examples:
  - LV: a succinct explanation **"Kas ir piepe?"**, recognizing a bracket fungus found on wood, tied truthfully to the photographic subject and why observing its forms inspires the forest experience.
  - EN: natural equivalent **"What is a bracket fungus?"**, plus concise authentic forest experience description.
- Make educational text accurate and restrained: do **not** identify a specific fungus species from AI-generated footage, assert unsupported biological facts, or misrepresent this artistic website as an authoritative scientific reference. If covering facts beyond basic description, use credible supporting external sources. Avoid several fake doorway pages merely to target keywords.
- Keep the immersive look and story; informational copy should enhance the experience rather than turn it into a generic SEO blog. Explain what PIE.PE *actually offers*. No repetitive hidden keywords, fake projects or boilerplate filler.
- Choose page titles and descriptions by locale; for example **LV**: `Piepe — interaktīvs meža piedzīvojums | pie.pe`, **EN**: `Bracket Fungus — An Interactive Forest Experience | pie.pe` (copy is a starting point, refine naturally). Meta descriptions must be unique, compelling, faithful to page. Brand should remain recognisable.
- Images: meaningful localized `alt` attributes for informational photographs, decorative imagery `alt=""`, correct dimensions/responsive images, loading priorities, WebP where appropriate; don't use alt as keyword spam. Ensure core facts are text, not just within videos/images.

### Metadata, structured data and site infrastructure
- Each localized URL gets appropriate **HTTP-delivered** title, meta description, canonical, hreflang, OG (title/description/url/image/locale), Twitter cards, `html lang`, and accessible semantic heading hierarchy.
- Refresh `https://pie.pe/sitemap.xml` to include **both canonical URLs** with correct reciprocal `xhtml:link` language alternatives if using sitemap hreflang; avoid duplicate/contradictory alternate declarations. Existing `robots.txt` should stay crawl-friendly and reference sitemap; no `noindex` or accidental environment-wide blocking.
- Include minimal valid `WebSite`/`WebPage` JSON-LD only where truthful; no fake `Organization`, invented ratings, reviews, persons, addresses, or promised rich snippets. Validate structured data; do not expect rich-results eligibility if schema type does not support it.
- Favicons and a deliberate social-share preview image that actually reflects PIE.PE. Avoid huge LCP images or preloading all cinematic videos. Keep performance, video optimizations, CSP/security and accessibility.
- Preserve correct 404 for nonexistent URLs. Audit Cloudflare Workers custom domain, static asset routing and direct `/en/` response carefully.

### Discovery, monitoring and acceptance tests
- Recommend adding and verifying domain `pie.pe` in **Google Search Console** (ownership verification may require owner DNS access) and submitting `https://pie.pe/sitemap.xml`. Use URL Inspection/Live Test and monitor Page Indexing, Performance queries by country/device and Core Web Vitals. Do NOT claim Search Console ownership verified or sitemap submitted unless authenticated access/actions actually occurred. Provide exact manual next steps if owner involvement needed.
- Test using `curl`/raw HTTP **without JavaScript**: `/` contains LV title, description and meaningful Latvian text; `/en/` contains English equivalents; both 200 with correct canonical/alternate; unknown paths 404. Test rendered pages, mobile, link switching, refresh/direct entry, localStorage disabled, preserved video behavior, keyboard, share previews and sitemap/robots XML validity.
- Run Lighthouse SEO/accessibility/performance (or similar), report real tested scores and limitations, no fabricated 100/100 or promise of #1 ranking.
- Compare production source responses with expectations after deployment. Confirm Google Search Console steps have been documented.

**SEO done when:** `/` is LV-first and crawlable, `/en/` is genuinely English and crawlable with distinct localized content, each has self canonical + reciprocal alternate relations, sitemap includes both canonical pages, real on-page subject descriptions are indexed in markup, no accidental `noindex`, media/performance works, and live HTTP/browser checks are documented.

Google primary guidance:
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/title-link

---

## MANDATORY BILINGUAL WEBSITE — LATVIAN DEFAULT, ENGLISH OPTIONAL (owner requirement)

All **visitor-facing website content**, including the full cinematic experience and all subsequent interactive states, MUST be fully localized in both **Latvian (lv-LV)** and **English (en)**.

1. **Default is Latvian** for first-time visitors, regardless of browser language. Opening `https://pie.pe/` with no prior preference displays Latvian. Never default to English based on UI templates.
2. Add a restrained, accessible and discoverable **LV / EN** language selector (header or equivalently visible navigation), on desktop and mobile. Indicate active locale; support keyboard, touch and screen readers.
3. Translate ALL visible UI: hero tagline, section titles, cinematic copy, discovery story/dialog, project labels (if any), buttons, nav, skip-intro, replay, return, loading/error/media fallbacks, status notes, footer and video captions if added. Do not leave a mixture of English/Latvian in the LV view. Brand `pie.pe` remains the same in both.
4. Use idiomatic, professionally written Latvian (correct diacritics and natural tone). For example, "piepe" is an actual Latvian name for a bracket fungus, not a random brand word. English may use natural editorial prose rather than literal word-for-word translation. Avoid machine-sounding marketing filler.
5. Introduce a **typed, centralized i18n dictionary** (for example `src/i18n/{lv,en}.ts`), not scattered inline conditionals. Every key must have both translations, with tests for parity; render semantic headings and aria-labels from this dictionary. Set `document.documentElement.lang` to `lv` / `en`.
6. Use **dedicated, canonical, search-indexable locale URLs**: Latvian at `/`, English at `/en/` (see mandatory SEO section). Use real crawlable LV/EN navigation links. Explicit URL language always wins; do not depend on localStorage/cookies/Accept-Language to make English discoverable. Support remembering language via explicit chosen URLs/bookmarks and optional stored preference without hiding either indexed version or automatically redirecting crawlers. Do not break existing Cloudflare Workers routing or non-media 404 behavior.
7. **Language switching must not replay or reset the six-second introduction**, restart cinema, interrupt fungus interaction, reset scroll position or lose visible content. Re-render translated strings while preserving view/state; update `<html lang>`, page title and metadata. Ensure accessibility and layout still work with longer translations.
8. SEO: sensible per-language titles/descriptions, translated Open Graph metadata where practical; canonical/hreflang strategy consistent with the real URL scheme. Do not claim both languages indexable at separate URLs unless they actually are.
9. QA: fresh visitor opens `/` in Latvian, switches to EN, persists preference; test shared language URLs, browser back/forward, refresh, cookies/storage disabled, keyboard and mobile layouts, dialog/error paths, iOS Safari where possible. Check every copy source for untranslated English in Latvian mode.
10. If some content cannot be faithfully translated, write an editorially coherent version in both languages; **no lorem ipsum or TODO copy in production**.

**Acceptance criteria:** Two complete languages, **LV default**, accessible LV/EN selector, all interactive states translated, no unwanted playback reset, no Cloudflare routing regressions, live verification in both languages.

---


## 2026-10-27 FINAL PRE-CODEX AUDIT — assets present; React Bits reviewed

**All required owner-provided assets are NOW in `public/media/` on latest `main`.** Confirmed `forest-awakening.mp4` (~1.54MB), `forest-understory.mp4` (~1.37MB), `forest-breathing.mp4` (~1.55MB), matched posters/last frames, and `forest-mobile.webp` (~121KB). Earlier comments saying media upload is pending are superseded. **All media is available; 2.0 has completed, and Codex may start 2.1 immediately**, without requesting files again.

**Critical P0 regression discovered:** `public/media/forest-reveal.mp4` currently has the EXACT Git blob SHA `b6532f81fe9fe067dbf3f5f035fdbbd94928dd62` as `source/forest-reveal-original.mp4` and weighs **19,070,653 bytes**. The earlier ~1.72 MB web H.264 file has been overwritten by the original HEVC clip. Before polishing visuals or deploying: inspect codecs, restore/encode a muted H.264 yuv420p faststart 6.04s web version, retain original in `source/`, confirm near-exact frame alignment and run range/autoplay/reduced-motion Safari tests. Avoid accidental replacement of the matched JPGs.

**React Bits suitability reviewed:** https://github.com/DavidHDev/react-bits — worthwhile only for selective animation principles, not the full component library. Mandatory audit and decisions: [docs/REACT_BITS_EVALUATION.md](https://github.com/aigars-avotins/piepe/blob/main/docs/REACT_BITS_EVALUATION.md). Adopt GSAP-native ScrollReveal patterns for narrative copy and possibly restrained FadeContent for section transitions. Optional minimal Magnet on desktop CTA only, not on fungus hotspot. LightRays WebGL is experimental and **off by default** unless profiled. Reject neon/glitch/particles/click-spark/animated UI grids. Preserve attribution/license if copying code; MIT + Commons Clause permits use inside websites but prohibits reselling components themselves.

**No generic library import and no duplicate GSAP timeline.** Audit the latest `main`; the guide/docs commits are already present. The owner explicitly authorized commit/push/deploy of this production upgrade in the existing issue, after tests. Preserve Cloudflare Workers Static Assets Worker `piepe` and `https://pie.pe` domain.

---


**Scope:** implement the next measurable visual upgrade to https://pie.pe, supplementing [issue #2](https://github.com/aigars-avotins/piepe/issues/2).  
**Repo:** `aigars-avotins/piepe`, branch `main`.  
**Production target:** EXISTING Cloudflare Worker **`piepe`**, custom domain `https://pie.pe` (Workers Static Assets, NOT Cloudflare Pages).  
**Source of truth for motion:** [docs/CREATIVE_MOTION_GUIDE.md](https://github.com/aigars-avotins/piepe/blob/main/docs/CREATIVE_MOTION_GUIDE.md) — added to repo before this issue.

### Why
Current v1 uses one 6.04s clip ending at `forest-final.jpg`; static image, CSS fog and GSAP text fades do not yet create a multi-scene nature experience. A few intentional clips are more valuable than implementing arbitrary special effects. Respect the original species shape and continuity. Do not add generic cards or fake project links.

### HyperFrames skill evaluation — ADOPT PARTIALLY
Read https://github.com/heygen-com/hyperframes and especially:
- `motion-doctrine`: same-axis/direction continuity and movement with visible cause;
- `seam-craft`: dark background continuity, no white/black flash at transitions;
- `cut-the-curve`: selective GSAP easing, matched perceived motion at scene changes.

These are HyperFrames **repo-internal skills**, not guaranteed part of the public CLI skill installer. Translate the ideas into existing React/GSAP code. **Do not** install the full video rendering framework in the production website bundle. An isolated offline render experiment is optional only if it produces provably superior transition material.

## Required new media — OWNER TO PRODUCE BEFORE FINAL MEDIA-DEPENDENT DEPLOYMENT

Existing in repo — preserve:
- `public/media/forest-reveal.mp4` (actual 6.04s H.264 intro)
- `public/media/forest-final.jpg` (reference frame for clip 2)
- `public/media/forest-poster.jpg` (reference frame for closing ambience)

New assets (must be **real video**, not placeholder, and validated after delivery):
1. **P0 `public/media/forest-awakening.mp4`** — 5–6 s, 16:9, 1080p ideally, silent H.264 (transcode from archival master if required); FIRST frame generated from `forest-final.jpg` using Image-to-Video START FRAME. Almost locked camera, gentle sweep of natural morning light across exactly the SAME layered ivory/ochre bracket fungi, floating dust, small controlled push-in. No fungi morph/growth/camera cuts. Plays ONCE on fungus activation; align first frame with held hero ending before transition.
2. **P0 `public/media/forest-understory.mp4`** — 5–6 s, 16:9, 1080p; original detailed moss/fern/dew macro, same forest climate/grade/light direction; motion restrained lateral glide, no texture morph. Start from a coherent photorealistic image composed FIRST using the original forest frames as style references. Bring into the scroll-led second scene.
3. **P1 `public/media/forest-breathing.mp4`** — 5–6 s, 16:9, 1080p, atmospheric wide forest, preferably using `forest-poster.jpg` as Start Frame. Nearly locked camera, delicate natural fog/sun shafts/foreground fern sway. For outro or visual return. **Optional**; if absent, use a static frame + light CSS movement instead of blocking the whole project.
4. **P1 `public/media/forest-mobile.webp`** — 9:16, min 1080×1920; same fungus from `forest-final.jpg` using reference-guided vertical outpainting. Do not substitute a different fungus.

Codex: check the media paths actually exist before treating the related scene as complete. Asset names above are a delivery contract, NOT proof that files have already been uploaded. Extract matching end frames/posters for each supplied video; create optimized web encodings; archive masters outside the served dist or source them from separate owner-provided paths.

## UX & visual behavior (P0)
1. **Arrival:** keep existing 6.04s intro, skip/stall/one-play-per-session behavior and frame-matched final poster; refine left text entrance without covering fungus.
2. **Discovery click/tap/keyboard:** from still hero to `forest-awakening`; light starts precisely at user interaction, hold same fungus in consistent screen position. Include a significant payoff (short original narrative/micro-detail and interaction); avoid just opening a generic pane. User controls must remain semantic and accessible.
3. **Understory scroll:** a genuinely different depth scale with supplied macro video, carefully timed entry/exit, image posterior hold, and native scroll-linked framing. No sudden exposure/color jump, and do not force video playback on every scroll direction change.
4. **Outro:** return to wide forest, optional breathing clip, sparse compelling typography, clean return action; no abrupt static cut.
5. **Content:** replace generic filler from `src/content.ts` with purposeful, minimal interactive content. Do not invent user biography, real project URLs or unavailable products; where no confirmed projects exist, center a complete discovery story instead of three empty rows.
6. **Mobile:** deliberate mobile art direction at 320/360/390/430 widths, iPhone safe areas, readable 12px+ functional labels, responsive subject crop, 44px+ touch areas; use mobile still if supplied. Desktop video may be cropped only when fungus remains visible. Avoid CSS interpolation mismatch between video and still. 
7. **Performance:** target below ~3 MB per 6-second web clip when possible without obvious degradation; lazy-load below-the-fold clips and only decode one stream at a time; poster first, no indefinite loader or black/white flash; video disabled gracefully for reduced motion/save-data/weaker devices.

## Detailed execution
- Audit latest `main`, #1 and #2, original media, current production (screenshots at 1440×900, 390×844 and 320×690). Work from latest commit; no destructive reset.
- Verify which owner-generated clips have actually been committed. **If either P0 clip is missing, you may prepare implementation and run tests, but DO NOT deploy a supposedly completed cinematic v2.1 with placeholder/fabricated video. State precisely what media is missing and wait for it.**
- Implement scene orchestration robustly with React/GSAP; avoid adding HyperFrames runtime.
- Browser-check real playback, first/end frame fidelity, zoom/crops, skip, click & Escape, reduced-motion, data-saver, autoplay denial and stalled/404 media recovery.
- Run `npm ci`, typecheck, lint, worker tests, production build and relevant Playwright tests in a browser-capable environment. Report unavailable hardware/mobile testing honestly.
- Produce before/after screenshots and, if possible, ~15–20 s full-page screen recording.
- **User authorizes production rollout after both P0 assets are present and checks pass**: commit, push to `main`, deploy existing `piepe` Cloudflare Worker, verify live `https://pie.pe` and media HTTP range support; retain rollback version. Do not deploy to Pages or create a new Worker. If access blocked, report exact blocker and never claim success.
- Update this issue with commit SHA, deployment version, live verification, screenshot links (if produced), media inventory and remaining limitations.

### Acceptance criteria
- [ ] SEO in both languages: crawlable LV `/` and EN `/en/`, localized source HTML, self canonicals, reciprocal hreflang, sitemap, accurate on-page fungus-related text and Search Console handoff.
- The fungi in the end of `forest-reveal` and START of `forest-awakening` visually match.
- The background truly evolves through distinct forest/macro scenes, not only text fades.
- Interactive fungal discovery is rewarding and works by keyboard, mouse and touch.
- No generic placeholder projects, no fake assets, no visible cut/glitch or mismatched forest.
- Static fallback/performance/responsive/SEO/accessibility preserved.
- Deployment actually verified at `https://pie.pe`, after required clips provided.

**LATEST STATUS (2026-10-27): 2.0 FINISHED AND VERIFIED per release QA. Videos and final wallpapers are in GitHub. Original H.264 intro already fixed. Implement LV-default + EN SEO, new cinematic media, authentic fungus story, brand/favicon, wallpapers; preserve 2.0 behavior, test and deploy to existing Worker.**

