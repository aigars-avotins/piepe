// Build-time 1200×630 social image for every route and language, written to dist/og/.
// Text is set in the site's own typefaces (the @fontsource files), over existing artwork.
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const cache = resolve('node_modules/.cache/piepe-social')
await mkdir(cache, { recursive: true })
await writeFile(`${cache}/fonts.conf`, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>` +
  `<dir>${resolve('node_modules/@fontsource/cormorant-garamond/files')}</dir><dir>${resolve('node_modules/@fontsource/manrope/files')}</dir><cachedir>${cache}/fontconfig</cachedir></fontconfig>`)
// Must be set before libvips starts, so the same fonts render on every machine.
process.env.FONTCONFIG_FILE = `${cache}/fonts.conf`
const { default: sharp } = await import('sharp')

const artwork = {
  home: ['public/media/forest-final.jpg', 'east'], guide: ['public/images/interactive/atlas-pores.jpg', 'centre'], wallpapers: ['public/wallpapers/piepe-forest-desktop-3840x2160.jpg', 'centre'],
  notes: ['public/media/forest-understory-final.jpg', 'centre'], 'note-001': ['public/media/forest-awakening-final.jpg', 'east'], 'note-002': ['public/images/interactive/xray-bark-surface.jpg', 'centre'],
  'note-003': ['public/images/interactive/atlas-smooth.jpg', 'centre'], 'note-004': ['public/images/interactive/atlas-gills.jpg', 'centre'], 'note-005': ['public/images/interactive/deadwood-stage-03.jpg', 'centre'],
  'note-006': ['public/media/portal-02-first.webp', 'north'], about: ['public/media/portal-05-first.webp', 'centre'],
}
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const text = (markup, font, width) => sharp({ text: { text: markup, font, width, rgba: true, dpi: 72, spacing: 6 } }).png().toBuffer({ resolveWithObject: true })
// A left-hand shade for the words and the site's one small light, drawn once.
const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs>
  <linearGradient id="s" x1="0" x2="1"><stop offset="0" stop-color="#040f09" stop-opacity=".84"/><stop offset=".58" stop-color="#040f09" stop-opacity=".5"/><stop offset="1" stop-color="#040f09" stop-opacity=".12"/></linearGradient>
  <radialGradient id="l"><stop offset="0" stop-color="#f2d7a2" stop-opacity=".95"/><stop offset=".18" stop-color="#e5ad57" stop-opacity=".5"/><stop offset="1" stop-color="#e5ad57" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#s)"/><rect y="430" width="1200" height="200" fill="#040f09" opacity=".28"/><circle cx="96" cy="118" r="46" fill="url(#l)"/></svg>`)

export async function renderSocialImages(server, routes) {
  const { messages } = await server.ssrLoadModule('/src/i18n.ts'), { readings } = await server.ssrLoadModule('/src/reading.ts')
  const { collectionCopy, fieldNote } = await server.ssrLoadModule('/src/forestKnowledge.ts'), { siteCopy } = await server.ssrLoadModule('/src/siteCopy.ts')
  const words = (key, locale) => key === 'home' ? [messages[locale].forest, messages[locale].heroThought]
    : key === 'guide' ? [readings[locale].label, readings[locale].heading]
    : key === 'wallpapers' ? ['PIE.PE', collectionCopy[locale].wallpapersHeading]
    : key === 'notes' ? ['PIE.PE', collectionCopy[locale].indexHeading]
    : key === 'about' ? [siteCopy[locale].about.label, siteCopy[locale].about.heading]
    : [`${collectionCopy[locale].noteLabel} ${key.slice(5)}`, fieldNote(locale, key.slice(5)).heading]
  await mkdir('dist/og', { recursive: true })
  const brand = await text('<span foreground="#EAE8DF">pie<span foreground="#F2D7A2">.</span>pe</span>', 'Cormorant Garamond 46', 300)
  for (const route of routes) {
    const [source, position] = artwork[route.key]
    const base = await sharp(source).resize(1200, 630, { fit: 'cover', position }).modulate({ brightness: 1.04 }).toBuffer()
    for (const locale of ['lv', 'en']) {
      const [label, heading] = words(route.key, locale)
      const title = await text(`<span foreground="#EAE8DF">${escape(heading)}</span>`, `Cormorant Garamond ${heading.length > 34 ? 68 : 84}`, 820)
      const kicker = await text(`<span foreground="#F2D7A2" letter_spacing="3200">${escape(label.toUpperCase())}</span>`, 'Manrope 21', 900)
      await sharp(base).composite([
        { input: shade, left: 0, top: 0 }, { input: kicker.data, left: 162, top: 106 },
        { input: title.data, left: 76, top: Math.round(330 - title.info.height / 2) }, { input: brand.data, left: 76, top: 540 },
      ]).jpeg({ quality: 84, mozjpeg: true }).toFile(`dist/og/${route.key}-${locale}.jpg`)
    }
  }
}
