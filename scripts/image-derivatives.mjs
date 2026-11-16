// Optional tooling, not part of the build: node scripts/image-derivatives.mjs
// Writes additional serving copies beside the audited originals. No original, film or
// film-derived matching frame is modified; committed derivatives are what deploys.
import sharp from 'sharp'
import { stat, readdir } from 'node:fs/promises'

const report = []
async function derive(source, target, width, format, options) {
  const image = sharp(source).resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
  await (format === 'avif' ? image.avif(options) : image.webp(options)).toFile(target)
  report.push(`${String((await stat(target)).size).padStart(8)}  ${target}`)
}

// Portal threshold: the 2.9 MB PNG stays the last-resort source and the audited original.
for (const width of [960, 1672]) {
  await derive('public/media/01_Start.png', `public/images/portal/threshold-${width}.avif`, width, 'avif', { quality: 62, effort: 6, chromaSubsampling: '4:4:4' })
}
await derive('public/media/01_Start.png', 'public/images/portal/threshold-1672.webp', 1672, 'webp', { quality: 88, effort: 6 })

// Quiet living world: sized copies of the reviewed native first frame of film 05.
for (const width of [960, 1920]) {
  await derive('public/media/portal-05-first.webp', `public/images/portal/living-${width}.avif`, width, 'avif', { quality: 58, effort: 6 })
  await derive('public/media/portal-05-first.webp', `public/images/portal/living-${width}.webp`, width, 'webp', { quality: 82, effort: 6 })
}

// Study photographs: AVIF beside every existing WebP serving width.
const responsive = 'public/images/interactive/responsive'
for (const file of (await readdir(responsive)).filter(name => name.endsWith('.webp')).sort()) {
  const [, name, width] = /^(.+)-(\d+)\.webp$/.exec(file)
  await derive(`public/images/interactive/${name}.jpg`, `${responsive}/${name}-${width}.avif`, Number(width), 'avif', { quality: 55, effort: 6 })
}
console.log(report.join('\n'))
