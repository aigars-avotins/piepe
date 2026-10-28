# PIE.PE 2.1 — bilingual search handoff

Latvian is always `/`; English is `/en/`. The explicit URL wins over browser language. Both return real HTML with one semantic H1, visible bracket-fungus facts, localized title/description, self-canonical, reciprocal LV/EN/x-default alternates, OG/Twitter metadata and truthful WebPage/WebSite JSON-LD. The app changes language through real links enhanced with history state, preserving scroll, playback, the open dialog and selected observation. Back/forward updates the locale.

The build renders the shared `Story` component from the same typed dictionary used by React. It writes `dist/index.html`, `dist/en/index.html`, localized field notes and exact CSP hashes for the two JSON-LD blocks. It does not enable a catch-all SPA or send arbitrary paths to the home page. The existing media Worker and strict static-asset 404 policy remain in place. The tiny self-hosted boot script aligns the pre-JavaScript frame with first/return visits; content remains readable with JavaScript disabled.

Factual copy distinguishes fruiting body from fungal hyphae, describes pores in many polypore-type brackets, and distinguishes wood decay/nutrient recycling from decay of living trees. There is no species identification, edibility/medical advice or claimed real filming location. Sources selected by the owner are linked openly, and the AI-film context is disclosed. **External scientific-source retrieval was blocked by the onboarding proxy; independent live source verification remains a release requirement.** These references must be checked before claiming the fact-check is complete:

- https://www.woodlandtrust.org.uk/blog/bracket-fungi-identification/
- https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/habitats/deadwood/
- https://growwild.kew.org/plants/chicken-woods
- https://archive.bio.ed.ac.uk/jdeacon/FungalBiology/bracket.htm

## Google Search Console — owner action

1. Open Google Search Console under the owner's Google account and add a **Domain** property for `pie.pe`.
2. Copy Google's exact TXT verification record into the domain's existing DNS zone. Preserve all current Worker, certificate, MX and other records. Do not invent the verification value.
3. Verify ownership in Search Console after DNS propagation.
4. Under **Sitemaps**, submit `https://pie.pe/sitemap.xml`.
5. Use URL Inspection → **Test live URL** for `https://pie.pe/` and `https://pie.pe/en/`. Check the rendered text, indexability and selected canonical; request indexing after a successful production release.
6. Monitor Page Indexing for unexpected exclusions and duplicate canonicals, Performance by Latvian/English queries and device/country, and Core Web Vitals once sufficient field data exists.

Search Console access, DNS verification and sitemap submission have **not** been performed. Technical eligibility does not guarantee indexing, rankings or a rich result. Structured data describes a page/site only; there are no fabricated organizations, people, reviews or ratings.
