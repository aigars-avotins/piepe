# PIE.PE 2.4 — The Final Polish
**Status: owner-authorized Codex implementation. Small, quality-first polish of LIVE 2.3; NOT PIE.PE 3.0.**
**Base:** latest `main`, production PIE.PE 2.3, merged PR #7 / release commit `8bc02c58aa77bfc91adb3ff8de8740c46864e14d` (refresh HEAD before starting).
**Deployment gate:** implement in a new branch `codex/piepe-v24`; open PR; **DO NOT merge to main, change Cloudflare settings, or deploy without explicit owner approval**. Keep production untouched until QA review.

## Purpose / art direction
Make the current cinematic forest experience a little more coherent, accessible, and polished, **without altering its character or building the 3.0 micro-world early**. Preserve warm natural palette, cinematic movement, photorealism and original-master-quality video. The user prioritizes beautiful image and film quality over synthetic speed metrics. No extra AI imagery/video, paid subscriptions, big redesign or new bulky runtime packages.

## Context — what is ALREADY implemented (don't “fix” it blindly)
- In `src/Story.tsx`, several `<img alt="">` live inside composited, `aria-hidden` scenery, posters and held frame layers. Their empty alt is **deliberate** and often correct under WCAG: descriptive alt on every img would flood a screen reader with duplicates. The two wallpaper previews already use localized meaningful alt; interactive fungus triggers have accessible button labels. **Audit image roles, not alt counts.**
- `src/usePreferences.ts` already uses reactive `matchMedia('(prefers-reduced-motion: reduce)')` via `useSyncExternalStore`; `src/App.tsx` disables cinema under reduced motion/save-data, `public/boot.js` sets pre-hydration static preference, CSS has reduced-motion rules. **Verify runtime behavior and preference changes**; only fix proven gaps.
- 2.3 already fixes the discovery photo's second nudge; Understory/Breathing have broad native sticky viewing plateaus, per-visit replay, and real movie frame presentation. **Do not regress them**.
- `src/prerender.tsx` already emits Open Graph image/title/description, `og:image:alt`, `twitter:card=summary_large_image`, localized canonical/hreflang and schema. `src/seo.ts` updates localized head values. Check generated LV/EN responses; **don't add duplicate meta tags**.
- Mobile currently uses focal-positioned 16:9 source footage with cover; no true 9:16 masters exist. **No 9:16 generation** in 2.4.
- Scene `#encounter` offers `t.openNote` and a big specimen-invitation both opening the same `Discovery` dialog as the hero. This intended upcoming **3.0** portal CTA `Ienāc piepē` is separately specified in Issue #6. **Do not create a new macro journey or confuse the existing note CTA.**

## P0 — meaningful note-state semantics (tiny behavior fix)
Current `src/Story.tsx` shows `t.waiting` (`Meža piezīme 001 · Vēl neatklāta`) until `collected` is true, but `src/App.tsx` only flips `collected` after downloading the note. Reading it alone still appears “not discovered”.

1. Implement three semantically distinct states: **unseen → discovered (first successful open / encounter) → collected (explicit download)**. LV e.g. `Vēl neatklāta`, `Atklāta`, `Saglabāta`; English accurate equivalents. Discovered must not pretend the file was saved. Avoid resetting discovered when dialog closes or switching LV/EN; persist appropriately within existing safe session storage conventions (handle storage denied).
2. Keep all existing note actions, tab semantics, keyboard/focus and downloadable localized `field-note-*.txt` files intact.
3. Add a **very short, optional, accessible progressive-disclosure layer** inside the existing note or existing `Trīs vārdi tuvākam skatienam` (choose one, not both). 1–2 informative sentences grounded in current glossary/facts about bracket pores, hyphae and wood; do not repeat current facts word-for-word, invent species, add a new modal, or replace poetic LV/EN copy with encyclopedia-length content. If nothing genuinely improves understanding, prefer no extra prose, but explain the decision in PR. Responsive and keyboard accessible.
4. A discovery opened by clicking hero / `Atvērt meža piezīmi` should update status correctly. Downloading marks collected even if an existing browser download behavior varies; do not claim filesystem persistence.

## P1 — surgical accessibility validation, NOT an alt-text campaign
1. Inventory all rendered content-bearing images, decorative images, poster/film frame/canvas layers and their ancestor `aria-hidden`. Classify each (content, functional, decorative/redundant). Audit localized wallpaper alt and meaningful fungus-trigger accessible names, site logo/link, scene headings and accessible fallback if media fails.
2. Preserve `alt=""` and `aria-hidden` for decorative layered scenery and video. Add localized alt or scene explanation **only if informative visual content is otherwise inaccessible**; avoid announcing 10 duplicate layers. Explain any changed semantics in `docs/V24-QA.md`.
3. Verify default `prefers-reduced-motion` on initial render and while page is open (both reduce→no-preference and vice versa), also save-data. Under reduced motion do not load or autoplay cinematic videos, provide useful still content, preserve links, dialog, navigation, no rapid transforms, no hidden/trapped content, and avoid hydration flashes. Existing pause controls must continue to work in regular mode.
4. Run targeted axe WCAG A/AA plus keyboard screen-reader-friendly interaction checks. Automated axe 0 violations is NOT proof of full accessibility.

## P1 — mobile cinematic / affordance review, tiny corrections only
1. Test LV/EN at 1512×982 (MacBook), 390×844, 390×664, 320×690, plus 844×390 landscape. Validate full-bleed video stage with no black sidebars, correct focal placement, note close and tabs, readable text contrast, tap target spacing, safe areas, no unintended clipping. Check hero fungus CTA and **the third screen's specimen-invitation**: CSS currently hides its text at widths <=1100px (`src/style.css`), making discoverability weaker. Find a subtle mobile-safe way to make the existing note link understandable **without introducing a 3.0 portal promise**.
2. Spot-check Understory and Breathing normal scroll visits/revisits; zero second photo nudge, no need to stop scrolling at an exact pixel, no stuck video. Do NOT tamper with the proven 2.3 camera timelines simply to improve a Lighthouse score.
3. Only adjust CSS copy placement/contrast/hotspot affordance if observed problems exist. No generated footage, no structural section redesign, no forced scroll snapping, no 3D.
4. Test Firefox/Chromium and WebKit/Safari where feasible; explicitly distinguish simulated browser, macOS native WebKit and **physical iPhone**. Never claim physical hardware testing without actually doing it.

## P2 — controls and social metadata: verify, micro-polish only
- Keep existing `Apturēt filmu` / `Turpināt filmu`, retry and sound toggle. Check pause/resume labels/state under fast scroll, scene change, error and reduced motion. If users cannot tell play/pause/error state, add a **single, understated accessible state cue** near current controls. **No** permanent “film breathing”, HUD overlays, blinking dots, extra player chrome, spinners or distracting labels.
- Verify rendered initial HTML for `https://pie.pe/` and `https://pie.pe/en/` or local Worker-equivalent, both Open Graph and `twitter:card` large preview, localized titles/descriptions, 1200×630 image, `og:image:alt`, canonical, hreflang, JSON-LD, sitemap/robots. Optionally add localized `twitter:image:alt` if correct and missing; fix only factual gaps. Do not claim Search Console indexing or social platform cache state without evidence.

## Explicit OUT OF SCOPE
- PIE.PE 3.0 Issue #6: new amber tree artwork, same fungus across keyframes, `Ienāc piepē`, Kling films, 2.5D/Three.js, spores/mycelium world, navigation portal or new screen.
- No re-encoding the four 2.3 video masters, reduced bitrate/quality, new AI videos/images, new 9:16 films, paid Higgsfield/Kling usage, logo/brand overhaul, wallpaper regeneration, new content site/blog, user-generated submissions, analytics/trackers, new dependencies, Cloudflare domain/config/security edits.
- No unnecessary wholesale alt filling, reduced-motion rewrite, repeated full browser test suites, or visual elements that undermine cinematic minimalism.

## Engineering and QA workflow — be economical with CI
1. Create `codex/piepe-v24` from freshly fetched `main` (don't overwrite ongoing Codex work). Read `docs/V23-ARCHITECTURE.md`, `docs/V23-QA.md`, `docs/V23-MEDIA.md`, `docs/ISSUE_5_FULL_SPEC.md` and this spec first.
2. First audit and write a **brief findings matrix: confirmed bug / already correct / optional taste** with code pointers. Fix only actual issues and the explicitly requested note-state semantics.
3. Work with small, cohesive commits on the feature branch. During development: focused tests, typecheck, ESLint, Worker tests/build only as needed; **do not run expensive full native macOS WebKit + Chromium suites on every push**. Respect docs/master-only automatic CI filters and keep large evidence out of Git if not needed.
4. Add regression tests: note unseen/discovered/collected incl LV/EN, navigation/download/session-storage denial, reduced motion during state change, key media interactions, metadata for both locales, mobile invitation visibility/accessible name. Keep pre-existing cinematic continuity tests intact.
5. One **full Chromium + native macOS WebKit manual release validation only at the final candidate**, assuming GitHub Actions budget is available. At most 1 necessary retry after diagnosis. If CI is blocked, clearly report it and ask owner; **do not silently bypass or pretend a focused test is full release validation**. Local targeted review and real camera recordings suffice during development.
6. Create `docs/V24-QA.md` with concise before/after screenshots of actual rendered site (desktop + phone, LV/EN), what changed/what deliberately did not, relevant evidence, no-broken-cinema confirmation, performance/media unchanged, any testing limitations and remaining issues. If possible, include a brief real browser screencast only when motion actually changed.
7. Open PR against `main`; link Issue #8, summarize changes/risks/QA. **STOP BEFORE MERGE OR DEPLOY** until explicit owner acceptance. Keep existing production PIE.PE 2.3 unchanged.

## Acceptance
- All three note statuses are distinct and localized; reading marks discovered, downloading marks collected; no false “unseen” after visiting.
- Decorative cinematics remain quiet in accessibility tree; useful information and controls stay perceivable and keyboard accessible.
- Reduced motion reacts to system preference, and dynamic switches have graceful fallbacks; no videos for reduced motion/save-data.
- 2.3 videos retain native cinematic smoothness, full-viewport cover, repeating on return, no second photo nudge; original media bytes unchanged.
- Mobile layout and CTA remain understandable without clutter; no new 3.0 UI/films.
- OG/Twitter/hreflang content present and correct; no duplicate tags.
- A clean PR, concise QA and owner review before publication; economical testing.

Owner taste: **Apple-quality restraint, real forest atmosphere, cinematic detail, dark moss/amber brand, excellent imagery/video**. Better to ship three immaculate small fixes than twelve noisy “improvements”.
