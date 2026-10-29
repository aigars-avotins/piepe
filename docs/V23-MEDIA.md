# PIE.PE 2.3 — original-master and delivery review

This is the proposed delivery edition for owner review, not a production deployment. Sizes below are decimal MB. Masters are already compressed supplied films, not RAW footage; re-encoding cannot restore detail absent from them.

## Verified inputs and three candidates per film

All four original Git blob hashes match the authoritative Issue #5 values. Full SHA-256, codecs, dimensions, frame counts and delivery hashes are recorded in [master-verification.json](qa/v23/master-verification.json). Every selected output is H.264 High Level 4.1/yuv420p, 24fps, 145 frames, 6.041667 seconds, with no audio. No master bytes changed.

| Shot | Original | 2.2 web | CRF 20 film | CRF 18 grain | Selected CRF 16 grain |
| --- | --- | ---: | ---: | ---: | ---: |
| Reveal | HEVC 10-bit, 1920×1080, 19.07 MB | 1.72 | 4.22 | 6.79 | **9.21** |
| Awakening | H.264, 1920×1080, 9.50 MB | 1.54 | 3.59 | 5.45 | **8.24** |
| Understory | H.264, 1996×1036, 7.06 MB | 1.37 | 2.64 | 4.07 | **5.85** |
| Breathing | H.264, 1920×1080, 9.25 MB | 1.55 | 3.51 | 4.94 | **7.03** |

All use libx264 `-preset slow`, GOP 48/min-keyint 24, Rec.709 tags, limited-range video, `+faststart`, native frame rate and no trimming. Selected tune `grain` preserves existing texture; it **does not add grain**. Reveal uses `zscale=dither=error_diffusion,format=yuv420p,setsar=1` for 10→8-bit compatibility. Other films use `format=yuv420p,setsar=1`. Understory adds `crop=1900:988:48:24`: the original contains a rounded black edge, so the crop removes those embedded pixels without stretching or scaling. The 2.2 Understory was a valid centered 16:9 crop, not a stretched source.

Reproduce the 12 final candidates without overwriting any public asset:

```sh
python scripts/encode-v23.py --out review-results/v23-encodes
```

The offline script checks the exact original blobs first and records full FFmpeg commands/ffprobe output. Candidate files stay outside the production build. For clarity, the three preliminary uncropped Understory trials were rejected for their visible baked-in edge; only the three clean-edge candidates appear above.

## Perceptual scorecard

The contact sheets compare **original / 2.2 / CRF16 / CRF18 / CRF20** at matching 0, 3 and 5.5s, with two 360×260 subject regions at native source-pixel scale. Understory's old 16:9 edition is registered back into the master field of view for comparison (approximately scale .9593, x=75.94, y=0), then the same clean-edge crop is applied. That analysis necessarily resamples the old edition slightly. Source and new candidates share native geometry. Inspect the sheets at 100%, not merely the reduced GitHub preview.

| Film and inspected detail | Old edition | 20 film / 18 grain | Selected 16 grain and remaining limit |
| --- | --- | --- | --- |
| [Reveal](qa/v23/reveal-100percent.jpg): bark ridges, fern veins, mist and light | Fine bark/foliage smears during the approach; dark regions simplify into patches | 20 still smooths fine foliage; 18 retains much more texture | Closest of the candidates to source bark and fern texture. 8-bit compatibility can still quantize very shallow gradients |
| [Awakening](qa/v23/awakening-100percent.jpg): bracket rims, pores/texture, moss rim | Soft bracket edges and coarse shadow texture | 20 improves outlines but loses microtexture; 18 is convincing | 16 best retains the source's pale rough rim and lit moss without a sharpening halo; bright source highlights remain bright |
| [Understory](qa/v23/understory-100percent.jpg): droplet edges, stalks, moss, bokeh | Macro texture dissolves into softer blocks | 20 loses delicate stalk detail; 18 is close | 16 keeps the clearest source stalk/drop edges and moss transitions. Background remains intentionally out of focus; baked edge is removed |
| [Breathing](qa/v23/breathing-100percent.jpg): moving fern edges, trunk grain, haze | Texture swims/smears through motion | 20/18 improve fine forest structure with progressively less smoothing | 16 retains the most source texture and quiet haze. It cannot improve the already compressed master |

The choice is visual fidelity, with about 30.32 MB of film payload for all four if all are visited, versus 6.19 MB before. Loading remains staged: lower movies mount only on approach, one plays at a time, and byte-range delivery is preserved. A slow connection can use the matched still/retry; reduced-motion/save-data request no movies. These are deliberate quality/bandwidth tradeoffs, not a claim that larger files are free.

Real moving browser comparisons and continuity evidence are indexed in [V23-QA](V23-QA.md). The desktop viewer renders at DPR2 and the phone viewer at DPR3; exported screen video is CSS-resolution evidence. The native-pixel contact sheets are the texture reference. A screen recording itself is compressed and cannot replace inspection of the actual MP4. The optional local wipe viewer is `BASELINE_DIR=/path/to/2.2 node scripts/review-v23-quality.mjs`; `scripts/capture-v23-quality.mjs` records it. No comparison viewer or candidates ship in `dist`.

## Matched stills and source limits

Posters use original frame zero; Awakening/Understory/Breathing endings use actual frame 144. JPEGs use quality 96, 4:4:4, explicit Rec.709→RGB extraction and the same Understory crop. `forest-final.jpg` is Awakening's opening, preserving the 2.2 shared-plane registration. The ending carrier uses the actual decoded frame during replay and during a failed still-image handoff. New media cache URLs and regenerated Worker size metadata prevent an old cached film/still mix.

The six-second sources have differing first/last camera positions. The environmental restart is a short held-frame forward dissolve, not a perfect cyclic source loop. The portrait edition keeps the best available source crop; it does not invent a larger field of view. See [V23-ASSET-BRIEF](V23-ASSET-BRIEF.md) for precise optional portrait/scientific asset requests. No new image/video generation is needed to fix the activation or photo-settling defects.
