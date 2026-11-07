PIE.PE 2.5.8.2 — Complete Visual Overhaul, SVG Cartoon Removal, New-Tab Link Rule & Atmosphere Fix

Repository: https://github.com/aigars-avotins/piepe
Target branch: 2.5.8.2

CRITICAL OWNER REVIEW OF CURRENT PRODUCTION

The current implementation has four unacceptable defects that must be fixed completely:
1. **Amateur procedural SVG cartoons:** The custom-coded SVG diagrams/animations in `#beneath-bark`, `#surface-atlas`, and `#deadwood-time` look like a 3-year-old's cartoon animations and ruin PIE.PE's photorealistic cinema aesthetic. All schematic SVG artwork must be deleted and replaced with photorealistic raster image stages.
2. **Redundant Scale Journey indicator:** The scale-of-observation indicator (`Skatiena mērogs` / `Scale Journey`) is completely unnecessary and clutters the screen. Remove it entirely.
3. **Weak Morning/Nightfall mode:** Switching between `Rīta gaisma` and `Nakts krēsla` currently changes almost nothing visually, and the control is hidden or buried.
4. **Links must open in a new tab:** Every external link and every link that opens another page/article must open in a new tab (`target="_blank"`). This is a strict project law.

Execute all five phases below cleanly and autonomously.

⸻

PHASE 1 — DELETE THE SCALE JOURNEY INDICATOR COMPLETELY

1. Remove the Scale Journey (`Skatiena mērogs` / `Scale Journey`) component, its state, CSS rules, tests, and all DOM markup from both the Latvian (`/`) and English (`/en/`) homepages.
2. Keep only the original clean `01 Virsma` — `04 Atgriešanās` (`01 Surface` — `04 Return`) chapter navigation.

⸻

PHASE 2 — STRICT LAW: ALL PAGE & EXTERNAL LINKS OPEN IN A NEW TAB

Enforce `target="_blank" rel="noopener noreferrer"` across the entire application:
1. **All external links** (scientific sources, Woodland Trust, University of Edinburgh, UC IPM, Forest Research, DOI links, ANBG) MUST have `target="_blank" rel="noopener noreferrer"`.
2. **All internal links that navigate to another route/page** (e.g., links from the homepage to `/kas-ir-piepe/`, `/meza-piezimes/`, `/meza-foni/`, `/meza-piezimes/001/`–`006`, wallpaper file downloads, and cross-page navigation cards at the bottom of articles) MUST ALSO open in a new tab (`target="_blank" rel="noopener noreferrer"`).
3. **Only two exceptions stay in the same tab:**
   - Same-page hash jumps (`href="#..."` on the current page, such as `#reading`, `#source-...`, or homepage chapter scroll triggers).
   - The top `LV / EN` language switcher and the header brand logo returning home.

⸻

PHASE 3 — MAKE `RĪTA GAISMA / NAKTS KRĒSLA` VISUALLY DRAMATIC & VISIBLE

1. **Un-hide and position the toggle:**
   - Remove any `hidden` attribute from the atmosphere selector (`Krāsu noskaņa` / `Atmosphere`).
   - Place a sleek, visible pill toggle (`☀ Rīta gaisma` | `☾ Nakts krēsla` / `☀ Morning Light` | `☾ Nightfall`) in the top header bar on reading pages and in the bottom HUD bar on the homepage.
2. **Make the visual change unmistakable across the whole viewport:**
   - **Rīta gaisma (`data-atmosphere="morning"`):**
     - Warm golden-hour forest light: warm sunlit moss and bark surfaces (`--bg-primary: #172017`, `--bg-elevated: #222e21`, `--bg-card: rgba(36, 48, 34, 0.82)`).
     - Warm parchment-cream text (`--text-primary: #f7f2e7`, `--text-secondary: #d8ceb8`) and rich golden-amber accents (`--accent: #e5ad57`).
     - Add a warm golden sunlight ambient radial gradient overlay at the top of the viewport (`radial-gradient(circle at 50% 0%, rgba(235, 180, 90, 0.18), transparent 70%)`).
     - Apply a subtle warm morning optical grade to background videos and image stages: `filter: brightness(1.08) saturate(1.14) sepia(0.08)`.
   - **Nakts krēsla (`data-atmosphere="nightfall"`):**
     - Deep boreal moonlit night: abyssal midnight-indigo and cold pine-slate surfaces (`--bg-primary: #05080d`, `--bg-elevated: #0a1019`, `--bg-card: rgba(11, 18, 29, 0.88)`).
     - Crisp silver-moonlight text (`--text-primary: #dde7f4`, `--text-secondary: #9ab0c7`) and cool moonlight cyan-silver accents (`--accent: #82aee0`).
     - Add a cool nocturnal moonlight vignette and top glow (`radial-gradient(circle at 50% 0%, rgba(110, 160, 220, 0.16), rgba(4, 7, 12, 0.65) 80%)`).
     - Apply a distinct nocturnal color grade to background videos and image stages: `filter: brightness(0.82) saturate(0.75) contrast(1.12) hue-rotate(-18deg)`.
   - Animate the transition smoothly over `600ms cubic-bezier(0.22, 1, 0.36, 1)`.

⸻

PHASE 4 — REPLACE ALL CARTOON SVGS WITH PHOTOREALISTIC RASTER STAGES

Delete 100% of the schematic/procedural `<svg>` illustrations inside `#beneath-bark`, `#surface-atlas`, and `#deadwood-time`. Do NOT draw bark, hyphae lines, pores, gills, logs, or trees with SVG paths or CSS shapes.

Instead, wire all three interactive stages to the dedicated photorealistic image assets in `public/images/interactive/` (provide clean fallback handling to `/wallpapers/previews/desktop.webp` if a local dev environment hasn't copied a file yet, and support both `.webp` and `.jpg` extensions):

### 4.1 Mizas rentgens (`#beneath-bark`) — Photorealistic Split-Screen & Lens Reveal
Used on `/kas-ir-piepe/#beneath-bark`, `/en/what-is-a-bracket-fungus/#beneath-bark`, AND embedded directly in the homepage `"Kas ir piepe?"` section (`/` and `/en/`):
* **Assets (16:9 aligned pair):**
  - Outer Bark Surface: `/images/interactive/xray-bark-surface.webp`
  - Inner Wood & Mycelium Cutaway: `/images/interactive/xray-wood-mycelium.webp`
* **Visual & Interaction Design:**
  - Full-width cinematic stage (`aspect-ratio: 16 / 9`, `border-radius: 16px`, subtle glass border and deep forest shadow).
  - Stack both high-resolution photos in exact registration (`object-fit: cover`).
  - Use a smooth, GPU-accelerated CSS `clip-path: inset(0 calc(100% - var(--xray-split, 50%)) 0 0)` controlled by dragging anywhere on the stage or using the range slider / keyboard arrows.
  - Along the vertical split line (`left: var(--xray-split)`), render a refined optical glow divider (a `1.5px` warm amber light beam with a subtle `backdrop-filter: blur(6px)` pill handle `◄ PAVELC SLĀNI · DRAG LAYER ►`).
  - Place 3 clean, numbered glassmorphic hotspot buttons (`01`, `02`, `03`) over the stage that highlight the corresponding factual explanation card directly beneath the image.

### 4.2 Piepju virsmu mini-atlants (`#surface-atlas`) — Photographic Macro Loupe
Used on `/kas-ir-piepe/#surface-atlas` and `/en/what-is-a-bracket-fungus/#surface-atlas`:
* **Assets (4:3 macro photography):**
  - Card 1 (Poras / Pores): `/images/interactive/atlas-pores.webp`
  - Card 2 (Lapiņas / Gills): `/images/interactive/atlas-gills.webp`
  - Card 3 (Gluda vai citāda virsma / Smooth & ridged): `/images/interactive/atlas-smooth.webp`
* **Visual & Interaction Design:**
  - Display the 3 macro photographs in a 3-column grid (`aspect-ratio: 4 / 3` viewports).
  - **Optical Magnifier Loupe:** When hovering or dragging a finger across any macro photo, show a circular `2.5x` optical zoom lens (`140px` diameter, crisp glass rim, subtle inner shadow) that magnifies the exact coordinates of that high-resolution macro photo.
  - Clicking a card opens a clean full-resolution lightbox comparison view.

### 4.3 Kritalas laika kapsula (`#deadwood-time`) — 4-Stage Photographic Cross-Dissolve
Used on `/meza-piezimes/005-kritalas-un-laiks/#deadwood-time` and `/en/field-notes/005-deadwood-and-time/#deadwood-time`:
* **Assets (16:9 sequential aligned series):**
  - Stage 01 (Nesen kritis): `/images/interactive/deadwood-stage-01.webp`
  - Stage 02 (Agrīna noārdīšanās): `/images/interactive/deadwood-stage-02.webp`
  - Stage 03 (Attīstīta trupe): `/images/interactive/deadwood-stage-03.webp`
  - Stage 04 (Aprites turpinājums): `/images/interactive/deadwood-stage-04.webp`
* **Visual & Interaction Design:**
  - Remove the `hidden` attribute from the stage selector controls permanently.
  - Build a large `16:9` photographic viewport where all 4 aligned stage photographs are layered on top of each other.
  - Provide both a continuous scrub slider (`0%` to `100%`) and 4 prominent stage buttons (`01 Nesen kritis`, `02 Agrīna noārdīšanās`, `03 Attīstīta trupe`, `04 Aprites turpinājums`) directly above/below the viewport.
  - Scrubbing or clicking smoothly cross-dissolves (`opacity` + subtle scale breathing `1.0` -> `1.015`) between the 4 aligned photographs so the fallen tree visibly transforms in place.

⸻

PHASE 5 — BUILD, PRERENDER & QUALITY VERIFICATION

1. Run `npm run typecheck`, `npm run lint`, `npm run build`, and `scripts/prerender.mjs`.
2. Verify in the generated `dist/**/*.html` files that:
   - Zero schematic `<svg>` diagrams exist inside `#beneath-bark`, `#surface-atlas`, or `#deadwood-time`.
   - Zero `hidden` attributes exist on the deadwood timeline controls or atmosphere switcher.
   - The Scale Journey component is completely gone.
   - All content/article and external `<a>` tags have `target="_blank" rel="noopener noreferrer"`.
3. Capture desktop and mobile screenshots of the new photographic stages and the Morning vs. Nightfall modes and include them in the PR.