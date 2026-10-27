# PIE.PE — Creative motion rules for Codex

## Scope
These rules apply to the **live interactive PIE.PE site** (React/GSAP/Cloudflare Workers) and to any offline precalculated video transition, not a mandate to install a new runtime dependency.

## Source of inspiration
- HeyGen HyperFrames: https://github.com/heygen-com/hyperframes
- Motion doctrine (internal authoring guidance, not an installed public skill): https://github.com/heygen-com/hyperframes/blob/main/.agents/skills/motion-doctrine/SKILL.md
- Seam craft: https://github.com/heygen-com/hyperframes/blob/main/.agents/skills/seam-craft/SKILL.md
- Cut the curve: https://github.com/heygen-com/hyperframes/blob/main/.agents/skills/cut-the-curve/SKILL.md

Read for concepts; do not copy internal HyperFrames source code into PIE.PE or assume `npx hyperframes skills update` installs these internal skills. Apache-2.0 project; use concepts and original implementation.

## Adopt
1. **Shot continuity is king.** Existing forest film ends in `forest-final.jpg`. The first frame of `forest-awakening.mp4` MUST match the existing ending in composition, fungus geometry, lighting, and crop. Check actual frames, not only descriptions.
2. **Match camera momentum / vector** from one scene to another if making a cinematic cut, ideally with a focal carrier: same fungus, bark, foreground fern or light shaft. Do not abruptly reverse screen direction.
3. **No flashing seams or exposed default white/black backgrounds.** Use an opaque stage ground matched to the imagery; test mid-transition frames at different browsers/sizes; avoid abrupt exposure jumps and opacity dips.
4. **Motion needs a cause.** User click, hover/focus or scroll progress drives reveals. Prioritize one signature moment over an excess of loops.
5. **Prefer editable real-time GSAP/CSS** for interactive scroll, hover and focus effects. Use HyperFrames *only optionally in an isolated offline tool* to pre-render complex, deterministic overlays, if that demonstrably improves visual quality. It is NOT a runtime framework for PIE.PE.
6. **Frame alignment**: derive all poster images and segment trims from final media, test a short timeline capture at 24 or 30 FPS for beginning, transitions and end. Use coherent color/exposure across scenes. Never invent a fake matching frame.
7. **Performance & accessibility**: native scroll, lazy-load lower scenes, only one media stream active, no autoplay audio, pause offscreen, honor reduced motion/save data and maintain keyboard/touch alternatives.

## Do NOT adopt blindly
- HyperFrames is an HTML-to-MP4 rendering system, not an AI video generator and not a website scroll engine.
- Do not package the entire HyperFrames repo or seven skills into client bundle.
- Do not turn the whole PIE.PE page into a single baked MP4; preserve actual interactive fungus controls and native content.
- Treat internal guidance as inspiration, not absolute rules that overrule natural forest visual continuity: some crossfades can be appropriate for fog/light as long as exposure stays stable.

## Creative bar
Even with no visible text, a silent 15-second screen recording of first entrance → fungus click → forest scroll → outro should have clear spatial changes and a meaningful discovery, not merely fade-ins on one static frame.
