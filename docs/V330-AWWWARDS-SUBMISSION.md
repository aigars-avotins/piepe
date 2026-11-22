# PIE.PE 3.3 — Awwwards submission kit

Material for the owner to review, edit and submit. Nothing has been submitted and no award, score or ranking is claimed. Changes are described in [V330-EXPERIENCE](V330-EXPERIENCE.md); test results in [V330-QA](V330-QA.md).

## What Awwwards asks for (checked 16 November 2026)

Confirmed on Awwwards' own pages:

- **Fee.** Standard submission €65 per site; "Standard + User Pro" €150 per year. Submissions are final and non-refundable. ([submit](https://www.awwwards.com/submit/), [terms](https://www.awwwards.com/terms/))
- **Images.** Main thumbnail 1600×1200 px. Additional images and videos: "ideal dimensions are 1600x1200px"; videos are recommended. ([FAQ](https://www.awwwards.com/faqs/))
- **Scoring.** Design 40%, Usability 30%, Creativity 20%, Content 10%. At least 18 jurors vote over five days and the three scores furthest from the average are dropped. Honorable Mention needs 6.5 or more. Site of the Day goes to the highest-scored sites. ([evaluation](https://www.awwwards.com/about-evaluation/))
- **Developer Award.** Judged after Site of the Day; above 7 earns it. The published guideline (v0.7, 2016, so possibly out of date) weights performance 20%, responsive 20%, semantics/SEO 20%, markup/metadata 15%, animations/transitions 15%, accessibility 10%.
- **Process.** Credits are added by Awwwards username in step one. Nothing can be edited once the submission is under review. Approval can take up to a week, then five days of voting. Template-based sites are not accepted. ([FAQ](https://www.awwwards.com/faqs/))

**Not confirmed** (the form is behind login and payment): character limits for the title and description, how many categories and tags may be chosen, accepted image formats and file-size limits, video duration and size limits, and whether separate phone screenshots have their own size. Check these in the form before exporting; the sizes below follow the one confirmed figure, 1600×1200.

## Listing text

**Title:** PIE.PE — The living forest

**Short description (155 characters):**
A slow, cinematic walk into a bracket fungus: ten short films, one small light that follows your attention, and sourced field notes in Latvian and English.

**Long description:**
PIE.PE begins with one invitation: enter the fungus. "Piepe" is the Latvian word for a bracket fungus, the shelf on a trunk that most of us walk past. Ten short films carry the visitor from morning light on an old tree, through a single pore, into an imagined world of mycelium and back out again. You can stay with the image, or follow a thread: a small light answers your pointer or finger while three short passages connect wood, fungus and the forest's cycles.

The site is built on restraint. It scrolls natively, with no scroll hijacking, WebGL or particle engine. The film never pauses for a lesson, sound is never required, and every scene can be left with one action. Visitors who prefer reduced motion or are saving data get the same story in stills and text, and no film is requested.

Beyond the cinema, interactive photographs and bilingual field notes continue the curiosity: a view beneath bark, a surface atlas with a loupe, deadwood across time, and six sourced notes that read without JavaScript. The imagery is AI-made artwork and says so on every page; the explanations are written separately and cite their sources.

**Suggested categories** (from the public filter list; confirm in the form): Art & Illustration, Culture & Education, Film & TV, Experimental, Web & Interactive.

**Suggested tags:** Storytelling, Video, Photo & Video, Scrolling, Typography, Minimal, Clean, Microinteractions, Transitions, Interaction Design, Sound-Audio, Responsive Design, Web Fonts, Fullscreen.

**Technologies:** React, TypeScript, Vite, GSAP, HTML5 video, Web Audio, View Transitions API, Cloudflare Workers.

**Credits:** to be supplied by the owner as Awwwards usernames (concept and direction, design, development, writing in Latvian and English). Typefaces: Cormorant Garamond (Christian Thalmann) and Manrope (Mikhail Sharanda), SIL Open Font License. Sound: "Birds" by kvgarlic (CC0), as edited for Blanket; details in `public/audio/CREDITS.txt`. State in the listing that the films and images are AI-made.

## Shot list

Capture from production after this branch is merged and deployed, at 1600×1200 (the confirmed size), sound icon and menu pill visible, no browser chrome. `node scripts/capture-v330.mjs <dir>` produces review screenshots at the audit sizes and is a starting point, not the final export.

| # | Shot | Language | Notes |
|---|---|---|---|
| 1 | **Thumbnail.** Hero after the opening film: wordmark, fungus, invitation | LV | The identifying frame; keep the Latvian wordmark line. |
| 2 | Field-note dialog over the awakened fungus | EN | Shows typography over photography. |
| 3 | Portal threshold with "Enter the fungus" | EN | |
| 4 | The living world with the movable light and one thread passage open | EN | The signature idea. |
| 5 | Understory plateau mid-scroll | LV | Film plus chapter typography. |
| 6 | Guide: surface atlas with the loupe over the pores | EN | |
| 7 | Field note 005: deadwood timeline mid-blend | LV | |
| 8 | Footer with the menu open | EN | Navigation and the closing thought. |
| 9 | About page opening | EN | |
| 10 | Phone, 390 wide: hero, portal, one reading page | LV / EN | Compose three phone frames side by side on a 1600×1200 canvas unless the form asks for a separate phone size. |
| 11 | The 404 page | both | Optional. |

## Screen capture storyboard (about 50 seconds, sound on, steady pointer)

| Time | Action |
|---|---|
| 0–6 s | Load the Latvian home page. First light, then the opening film resolves into the hero. Do not touch anything. |
| 6–11 s | Move to the fungus; the edge light travels. Click. The awakening plays and the field note docks. Close it. |
| 11–15 s | Click "Enter the fungus". The photograph opens into the threshold. Begin. |
| 15–30 s | Let two films cut through. In the living world choose "Follow a thread", move the light slowly across the frame, open one passage. |
| 30–36 s | "Return to forest": the authored way back to the ancient tree. |
| 36–44 s | Scroll, at an even speed, through Understory into the light. |
| 44–50 s | Open "Trails", choose the guide (the page dissolves), move the loupe over the pores. End on the heading. |

Record at 1600×1200 if the form accepts video at that size; otherwise 1920×1080 and crop. Keep it under a minute.

## Lighthouse (laboratory, local production build)

Filled in from the final build; see [V330-QA](V330-QA.md) for method and limits.

LIGHTHOUSE_TABLE

## Before and after

Pairs are embedded in [V330-EXPERIENCE](V330-EXPERIENCE.md#before-and-after) and stored in `docs/qa/v330/before/` and `docs/qa/v330/after/`.

## Owner checklist — what automation cannot verify

Before merging into `main` (a push to `main` deploys to production through Workers Builds)
- [ ] Fill in `colophonPeople` in `src/siteCopy.ts` (name or studio, roles, a contact link or address). The About page shows no credits or contact until you do.
- [ ] Read the Latvian About page and footer as a native speaker and adjust the wording to your own voice.
- [ ] Confirm the wallpaper terms on the About page ("free to download and use on your own screens; ask first for anything else"). They are a conservative default, not something you told anyone.
- [ ] Run **Actions → Forest QA → Run workflow** with `validation: release` on this branch (full Chromium on Linux and native macOS WebKit).

After the merge has deployed
- [ ] `validation: production` smoke workflow.
- [ ] Open an unknown address: the designed 404 page appears with status 404.
- [ ] Wrangler's uploaded-asset count has dropped (six masters and three stray files are no longer in `public/`), and `https://pie.pe/media/portal-02-faststart.mp4` still plays.
- [ ] Paste the home page, one field note and the About page into a social-card preview tool (or a private chat) and confirm each shows its own image.
- [ ] Search Console: resubmit `sitemap.xml` (it now carries `lastmod` and the two About pages) and run the Rich Results test on a field note and the wallpaper page.
- [ ] Lighthouse on production for `/`, `/en/` and one field note, phone and desktop; replace the laboratory table above.

By hand, on real devices
- [ ] iPhone (Safari) and Android (Chrome): opening film, portal, the menu pill, sound toggle, loupe by touch, language switch, the footer links, safe-area insets in landscape.
- [ ] VoiceOver and TalkBack: hero invitation (one stop, named), the menu (opens, lists five pages, closes with Escape or a tap outside), the field-note dialog, portal controls, a reading page.
- [ ] Listen to the ambience entering and leaving the portal with headphones.
- [ ] Real-network playback on a slow connection: the opening film, the first portal film, and the "still loading" messages.
- [ ] A browser without View Transitions (Firefox at the time of writing): pages navigate normally.

Decisions that are yours
- [ ] HSTS: the Cloudflare zone already sends `max-age=2592000`. Raising it to one year, or adding `includeSubDomains`, is a zone setting.
- [ ] Whether the wordmark may appear during the opening film. Today it waits for the film, which makes it the Largest Contentful Paint at about the film's length on a first visit.
- [ ] Categories, tags and the collaborator usernames in the form.
