# PIE.PE 3.3 — Awwwards submission kit

Draft material for the owner to review and edit before submitting. Nothing here has been submitted, and no award or ranking is claimed.

## Listing text

**Title:** PIE.PE — The living forest

**Short description (157 characters):**
A cinematic walk into a bracket fungus: six films, one small light that follows your attention, and bilingual field notes about the hidden life of forests.

**Long description:**
PIE.PE begins with a single invitation: enter the fungus. Six films carry the visitor from tree bark into an imagined mycelial world. You can stay with the image, or follow a thread — a small light answers your attention while three short passages connect wood, fungus and the forest's cycles. An authored return closes the circle. Outside the cinema, interactive photographs and sourced field notes in Latvian and English continue the curiosity: an x-ray view beneath bark, a surface atlas with a loupe, and deadwood across time. The site scrolls natively, never requires sound, and gives reduced-motion and Save-Data visitors the same story without video. "Piepe" is the Latvian word for bracket fungus.

**Suggested categories:** Art & Illustration; Culture & Education; Photography / Film & TV. Check the current category list on the submission form.

**Suggested tags:** storytelling, video, nature, minimal, typography, scrolling, interaction design, bilingual, accessibility, React, GSAP.

**Technologies:** React, TypeScript, Vite, GSAP, HTML5 video, Web Audio, View Transitions, Cloudflare Workers.

**Credits:** owner to supply names and roles (concept, design, development, copy in Latvian and English, sound). The ambient recording credit is in `public/audio/CREDITS.txt`. State that the cinematic imagery is AI-made artwork.

## Imagery and video

Check Awwwards' current submission guidelines for exact image sizes and counts before exporting; they are not reproduced here because they change.

Shot list (capture from production, both languages where text is visible):
1. Hero with the wordmark and fungus invitation — desktop 16:10 and phone.
2. Field-note dialog over the awakened fungus.
3. Portal threshold, then the mycelial world with the movable light and one thread passage.
4. Understory and Breathing plateaus mid-scroll.
5. Guide page: x-ray view open on a hotspot; surface atlas with the loupe; deadwood timeline.
6. A field note (for example 003) showing the typographic system.
7. Wallpaper collection.
8. The 404 page.

Screen-capture storyboard (45 seconds, no cursor jitter, sound on):
- 0–6 s: introduction film resolves into the hero.
- 6–12 s: hover and open the fungus; field note appears.
- 12–26 s: enter the portal; one cut through the films; move the light; open one thread passage.
- 26–32 s: authored return to the forest.
- 32–40 s: scroll through Understory into Breathing.
- 40–45 s: guide page, loupe over the atlas, end on a field-note heading.

## Owner checklist before submitting

- [ ] Deploy 3.3 and run the production smoke workflow (GitHub Actions → Forest QA → `validation: production`).
- [ ] On the first deploy, confirm Wrangler's uploaded-asset count dropped (the six film masters and `forest-mobile.webp` are now excluded by `public/.assetsignore`) and that `https://pie.pe/media/portal-02-faststart.mp4` still plays.
- [ ] Open an unknown address in production and confirm the designed 404 page appears with status 404.
- [ ] Physical iPhone (Safari) and Android (Chrome): intro, portal, sound toggle, loupe by touch, language switch.
- [ ] VoiceOver and TalkBack: hero, dialog, portal controls, reading pages.
- [ ] Lighthouse on production for `/`, `/en/` and one field note, mobile and desktop; record the scores here.
- [ ] Decide whether to add `Strict-Transport-Security` (it is not in `public/_headers`; check whether the Cloudflare zone already sends it).
- [ ] Search Console: resubmit the sitemap after deploy.
- [ ] Fill in credits and choose categories.
