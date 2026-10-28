import { createServer } from 'vite'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { renderPage, renderHead, renderNote } = await server.ssrLoadModule('/src/prerender.tsx')
  const template = await readFile('dist/index.html', 'utf8')
  if (!template.includes('<!-- locale:start -->')) throw new Error('Run a fresh Vite build before prerendering')
  const assets = await readdir('dist/assets')
  const boot = await readFile('public/boot.js', 'utf8')
  const hashes = [`'sha256-${createHash('sha256').update(boot).digest('base64')}'`]
  for (const locale of ['lv', 'en']) {
    const criticalFonts = assets.filter(name => /^manrope-latin-400-normal-.*\.woff2$/.test(name) || (locale === 'lv' && /^manrope-latin-ext-400-normal-.*\.woff2$/.test(name)))
    const head = renderHead(locale) + criticalFonts.map(name => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${name}"/>`).join('')
    const data = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(head)[1]
    hashes.push(`'sha256-${createHash('sha256').update(data).digest('base64')}'`)
    const html = template.replace('<script src="/boot.js"></script>', `<script>${boot}</script>`).replace(/<html lang="[^"]+"/, `<html lang="${locale}"`).replace(/<!-- locale:start -->[\s\S]*?<!-- locale:end -->/, head).replace('<div id="root"></div>', `<div id="root">${renderPage(locale)}</div>`)
    if (!html.includes(locale === 'lv' ? 'Kas ir piepe?' : 'What is a bracket fungus?')) throw new Error('Missing rendered content')
    await writeFile(`dist/field-note-${locale}.txt`, renderNote(locale))
    await writeFile(`public/field-note-${locale}.txt`, renderNote(locale))
    const dir = locale === 'en' ? 'dist/en' : 'dist'
    await mkdir(dir, { recursive: true }); await writeFile(`${dir}/index.html`, html)
  }
  const headers = await readFile('public/_headers', 'utf8')
  await writeFile('dist/_headers', headers.replace("script-src 'self'", `script-src 'self' ${hashes.join(' ')}`))
  console.log('Prerendered LV / and EN /en/ with localized metadata, visible content and CSP hashes')
} finally { await server.close() }
