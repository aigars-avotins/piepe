import { createServer, build } from 'vite'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { renderPage, renderHead, renderNote } = await server.ssrLoadModule('/src/prerender.tsx')
  const { renderReadingDocument } = await server.ssrLoadModule('/src/ReadingPage.tsx')
  const { renderForestDocuments } = await server.ssrLoadModule('/src/ForestPage.tsx')
  const { readingPath } = await server.ssrLoadModule('/src/i18n.ts')
  const template = await readFile('dist/index.html', 'utf8')
  if (!template.includes('<!-- locale:start -->')) throw new Error('Run a fresh Vite build before prerendering')
  const assets = await readdir('dist/assets')
  const appStyles = [...template.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(match => match[1])
  if (!appStyles.length) throw new Error('Missing shared typography stylesheet')
  const readingCss = await readFile('src/reading.css', 'utf8')
  const readingStyle = `/assets/reading-${createHash('sha256').update(readingCss).digest('hex').slice(0, 16)}.css`
  await writeFile(`dist${readingStyle}`, readingCss)
  const forestCss = await readFile('src/forestKnowledge.css', 'utf8')
  const forestStyle = `/assets/forest-knowledge-${createHash('sha256').update(forestCss).digest('hex').slice(0, 16)}.css`
  await writeFile(`dist${forestStyle}`, forestCss)
  const experienceCss = await readFile('src/readingExperiences.css', 'utf8')
  const experienceStyle = `/assets/forest-experience-${createHash('sha256').update(experienceCss).digest('hex').slice(0,16)}.css`
  await writeFile(`dist${experienceStyle}`,experienceCss)
  // A standalone progressive module, not a second application or route entry.
  const result = await build({configFile:false, publicDir:false, logLevel:'warn', build:{write:false,emptyOutDir:false,target:'es2022',minify:true,lib:{entry:'src/readingClient.ts',formats:['es']}}})
  const chunks=(Array.isArray(result)?result[0]:result).output.filter(item=>item.type==='chunk')
  if(chunks.length!==1||chunks[0].imports.length)throw new Error('Reading tools must be a self-contained progressive module')
  const client=chunks[0]
  const readingClient = `/assets/reading-tools-${createHash('sha256').update(client.code).digest('hex').slice(0,16)}.js`
  await writeFile(`dist${readingClient}`,client.code)
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
    // Static educational text stays usable without JS. Only the small progressive
    // controls module is loaded; never boot.js, #root or the cinema application.
    const readingFonts = assets.filter(name => /^(?:manrope|cormorant-garamond)-latin-400-normal-.*\.woff2$/.test(name) || (locale === 'lv' && /^(?:manrope|cormorant-garamond)-latin-ext-400-normal-.*\.woff2$/.test(name)))
    const readingHtml = renderReadingDocument(locale, [...appStyles, readingStyle,experienceStyle], readingFonts.map(name => `/assets/${name}`),readingClient)
    const readingData = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(readingHtml)[1]
    hashes.push(`'sha256-${createHash('sha256').update(readingData).digest('base64')}'`)
    const readingDir = `dist${readingPath(locale)}`
    await mkdir(readingDir, { recursive: true }); await writeFile(`${readingDir}index.html`, readingHtml)
    for (const document of renderForestDocuments(locale, [...appStyles, readingStyle, forestStyle], readingFonts.map(name => `/assets/${name}`),readingClient,experienceStyle)) {
      const data = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(document.html)[1]
      hashes.push(`'sha256-${createHash('sha256').update(data).digest('base64')}'`)
      await mkdir(`dist${document.path}`, { recursive: true })
      await writeFile(`dist${document.path}index.html`, document.html)
    }
  }
  const headers = await readFile('public/_headers', 'utf8')
  await writeFile('dist/_headers', headers.replace("script-src 'self'", `script-src 'self' ${hashes.join(' ')}`))
  console.log('Prerendered 20 localized cinema, guide, wallpaper and field-note documents with CSP hashes')
} finally { await server.close() }
