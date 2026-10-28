# CODEX — PIE.PE 2.2: SMOOTH CINEMATIC CONTINUITY, POLISH AND AMBIENT ATMOSPHERE

You are taking over the live PIE.PE 2.1 website.

Your role is to act as a senior frontend engineer, cinematic motion designer, UX polish specialist, accessibility reviewer and Cloudflare deployment engineer.

The site is already live, but the owner has identified several important quality issues.

## Repository and production

Repository:
https://github.com/aigars-avotins/piepe

Production:
https://pie.pe

Existing Cloudflare Worker:
`piepe`

Fetch the latest `origin/main` and preserve any uncommitted work.

Read the existing local documentation/specification files in the repository, including:

- `docs/ISSUE_4_FULL_SPEC.md`
- `docs/V22_MOTION_SKILLS_REVIEW.md`
- `docs/V21-ARCHITECTURE.md`
- `docs/V21-QA.md`

Treat those as the baseline, then incorporate the new owner feedback below.

---

## HIGHEST PRIORITY — P0

The single biggest owner complaint is this:

### The transition from Awakening to Understory is not smooth.

Right now, when the experience moves from the **Awakening** scene to the **Understory** scene, it feels like a sudden jump from one video/image to another.

This is currently the most important visual problem in the product.

You must redesign and implement this transition so it feels cinematic, deliberate and coherent.

Do not “fix” it with a weak generic fade alone.

Investigate and solve:
- scene timing
- media readiness
- first/last frame continuity
- crop/framing continuity
- section activation timing
- GSAP / scroll handoff timing
- visual continuity between end-still and next moving scene
- overlay/text timing
- mount/unmount behavior of media containers

Also re-check the reveal → awakening transition and awakening → discovery transition, but **Awakening → Understory is the top visual priority**.

The entire experience should feel like one continuous journey through the forest.

---

## ADDITIONAL REQUIRED CHANGES

### 1. Remove unnecessary wallpaper helper text
In both languages, remove the small helper/footer line equivalent to:

- EN: “Carefully enlarged from the original artwork.”
- LV equivalent

This text is unnecessary and should not appear.

### 2. Make wallpaper branding more visible
On the downloadable wallpapers, increase the size/visibility of:
- the logo
- the `pie.pe` text

It should still remain tasteful, elegant and premium, but more noticeable than now.

Do not make it crude or oversized. Improve visibility while preserving brand quality.

### 3. Fix the dead `+` icon
Near the phrase:

- LV: “Redzamais ir tikai sākums”
- EN equivalent

there is a `+` icon that looks clickable but currently does nothing.

This is bad UX.

Fix it so that it either:
- triggers a meaningful action (expand/reveal/open additional content), or
- is removed completely.

There must be no dead controls.

### 4. Add ambient forest sound
Add a calm, subtle background forest ambience with gentle birdsong.

Requirements:
- enabled automatically by default
- visitor can clearly turn it off / mute it
- subtle volume
- premium, non-annoying atmosphere
- must not overpower the visuals or text

Important implementation constraints:
- respect browser autoplay rules
- if autoplay with sound is blocked, begin automatically on first user interaction
- provide an accessible mute/unmute button
- persist user preference if appropriate
- avoid intrusive loops or abrupt restarts
- respect reduced-distraction / accessibility principles as appropriate

This should make the site feel more alive, but still calm.

### 5. Increase tiny support text size
Some of the smallest text, for example:

“Piepe uz mizas. Trīs vērojumi. Citāds skatiens.”

is too small.

Audit all very small supporting text in both Latvian and English and make it slightly larger / more readable.

Do not break the cinematic look, but improve legibility.

### 6. Open external sources in new tab
The “Lasīt vairāk / Read more” educational links, including:
- Woodland Trust
- University of Edinburgh

must open in a new browser tab/window instead of taking the user away from PIE.PE.

Use safe external link behavior:
- `target="_blank"`
- `rel="noopener noreferrer"`

Audit all similar educational/source links and apply the same behavior consistently.

---

## PRESERVE EXISTING 2.1 CAPABILITIES

Preserve and do not regress:
- the four-part cinematic concept
- LV default and EN secondary language
- crawlable localized HTML at `/` and `/en/`
- fungus discovery interaction
- accessibility and keyboard support
- existing wallpaper downloads
- branding and approved palette
- SEO and content quality
- Cloudflare Worker deployment architecture
- reduced motion / graceful fallback behavior
- mobile and Safari compatibility

Do not create another Worker or Pages project.

Deploy only to the existing Cloudflare Worker:
`piepe`

---

## VISUAL QA REQUIREMENTS

Before changing code:
- reproduce the current visual issues
- record the problematic transitions in a real browser

After implementation:
- record the same transitions again
- compare before vs after
- ensure the owner-facing visual defects are genuinely fixed

Test at minimum:
- desktop
- MacBook-like viewport
- ultrawide
- mobile portrait
- compact mobile viewport

Pay special attention to:
- Awakening → Understory
- awakening ending → discovery content
- wallpaper section polish
- sound control behavior
- tiny text readability
- dead `+` icon behavior
- external links opening in a new tab

---

## DEPLOYMENT

I explicitly authorize deployment of PIE.PE 2.2 after implementation and successful testing.

After the work is complete:

1. Commit and push to `main`
2. Deploy to the EXISTING Cloudflare Worker `piepe`
3. Verify actual production:
   - https://pie.pe/
   - https://pie.pe/en/
4. Verify the transitions in production
5. Verify sound behavior
6. Verify wallpaper section
7. Verify external links
8. Verify no regressions in localization, SEO and accessibility

If a real blocker prevents safe deployment, report it clearly instead of pretending completion.

---

## FINAL REPORT

At the end, report:
- what caused the abrupt Awakening → Understory transition
- exactly how you fixed it
- before/after recordings or screenshots
- GitHub commit SHA
- Cloudflare deployment version
- test results
- any remaining limitations

Success means PIE.PE feels smoother, calmer, more polished and more immersive — not more complicated.