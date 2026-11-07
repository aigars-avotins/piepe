import { releaseVersion } from '../src/release'
import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { forestMetadata } from '../src/ForestPage'
import { fieldNote } from '../src/forestKnowledge'
import { forestPages, forestPath, notePath, fieldNotesPath, wallpapersPath, forestNavigation } from '../src/forestPaths'
import { messages, readingPath, localePath } from '../src/i18n'
import { readings } from '../src/reading'
import { checkStaticMarkup, checkReadingResources } from './readingChecks'

const origin = 'https://pie.pe', digest = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex')

for (const locale of ['lv', 'en'] as const) for (const document of forestPages) for (const javaScriptEnabled of [false, true]) {
  const path = forestPath(locale, document)
  test(`2.5.7 ${path} JS=${javaScriptEnabled}: static content, metadata, responsive layout and reciprocal language navigation`, async ({ browser, request }, testInfo) => {
    const response = await request.get(path), html = await response.text(), meta = forestMetadata(locale, document)
    expect(response.status()).toBe(200); expect(response.headers()['content-type']).toContain('text/html')
    expect(response.headers()['x-robots-tag'] || '').not.toMatch(/noindex|none|nosnippet/i)
    expect(html).toContain('<main id="reading"')
    expect(html).not.toMatch(/<meta[^>]*name="robots"[^>]*content="[^"]*(?:noindex|nosnippet|max-snippet:0)/i)
    const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 390, height: 844 } })
    try {
      const page = await context.newPage(), errors: string[] = []; page.on('pageerror', e => errors.push(e.message))
      await page.goto(path)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('body')).toHaveAttribute('data-version', releaseVersion)
      await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('h1')).toHaveText(meta.heading)
      await expect(page.locator('.reading-lead')).toHaveText(meta.lead)
      await expect(page).toHaveTitle(meta.title)
      for (const [selector, value] of Object.entries({ 'meta[name="description"]': meta.description, 'meta[property="og:title"]': meta.title, 'meta[property="og:description"]': meta.description, 'meta[property="og:url"]': origin + path, 'meta[name="twitter:title"]': meta.title, 'meta[name="twitter:description"]': meta.description, 'meta[property="og:image"]': origin + '/social-preview.jpg' })) {
        await expect(page.locator(selector)).toHaveCount(1); await expect(page.locator(selector)).toHaveAttribute('content', value)
      }
      await expect(page.locator('title')).toHaveCount(1)
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + path)
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3)
      for (const lang of ['lv', 'en', 'x-default'] as const) await expect(page.locator(`link[hreflang="${lang}"]`)).toHaveAttribute('href', origin + forestPath(lang === 'en' ? 'en' : 'lv', document))
      const scripts = page.locator('script[type="application/ld+json"]'); await expect(scripts).toHaveCount(1)
      const data = JSON.parse((await scripts.textContent())!)
      expect(data).toMatchObject({ '@type': document.kind === 'index' ? 'CollectionPage' : 'WebPage', '@id': origin + path + '#webpage', url: origin + path, inLanguage: locale, name: meta.title, description: meta.description, isPartOf: { '@type': 'WebSite', '@id': origin + '/#website' } })
      const types: string[] = [], ids: string[] = []
      const visit = (v: unknown) => { if (v && typeof v === 'object') for (const [key, item] of Object.entries(v)) { if (key === '@type') types.push(String(item)); else if (key === '@id') ids.push(String(item)); else { expect(key).not.toMatch(/^(?:datePublished|dateModified|author|review|aggregateRating)$/); visit(item) } } }
      visit(data); expect(types).not.toEqual(expect.arrayContaining(['FAQPage'])); expect(types).not.toEqual(expect.arrayContaining(['Person'])); expect(types).not.toEqual(expect.arrayContaining(['Organization']))
      expect(ids.length).toBe(new Set(ids).size)
      await checkStaticMarkup(page)
      await expect(page.locator('main h1, main .reading-lead').locator('xpath=ancestor::*[@data-nosnippet]')).toHaveCount(0)
      for (const [width, height] of [[390, 844], [800, 900], [1440, 900]]) {
        await page.setViewportSize({ width, height }); await page.evaluate(() => document.fonts.ready)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        for (const box of await page.locator('main h1, main h2, main p').evaluateAll(es => es.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, right: r.right } }))) { expect(box.x).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width + 1) }
        if (javaScriptEnabled && width !== 800 && (document.kind !== 'note' || ['001', '006'].includes(document.number))) {
          const name = `${locale}-${document.kind}${document.kind === 'note' ? '-' + document.number : ''}-${width}`
          const screenshot = testInfo.outputPath(`${name}.png`)
          await page.screenshot({ path: screenshot, fullPage: true })
          await testInfo.attach(name, { path: screenshot, contentType: 'image/png' })
        }
      }
      if (document.kind === 'note') {
        const note = fieldNote(locale, document.number)
        for (const section of note.sections) for (const text of section.paragraphs) await expect(page.locator('main')).toContainText(text)
        await expect(page.locator('.knowledge-care')).toContainText(note.care)
        for (const href of await page.locator('a[href^="#"]').evaluateAll(es => es.map(e => (e as HTMLAnchorElement).hash.slice(1)))) await expect(page.locator(`[id="${href}"]`)).toHaveCount(1)
      }
      if (document.kind === 'wallpapers') {
        for (const img of await page.locator('.knowledge-gallery img').all()) {
          await img.scrollIntoViewIfNeeded(); await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true)
          const size = await img.evaluate((e: HTMLImageElement) => ({ width: e.naturalWidth, height: e.naturalHeight, declaredWidth: e.width, declaredHeight: e.height, alt: e.alt }))
          expect(size.width).toBe(Number(await img.getAttribute('width'))); expect(size.height).toBe(Number(await img.getAttribute('height')))
          expect(size.alt).toMatch(/mākslīgā intelekta|AI-generated/)
        }
        await expect(page.locator('.knowledge-downloads a[download]')).toHaveCount(3)
        expect(data.image.map((image: { width: number; height: number }) => [image.width, image.height])).toEqual([[5120, 2880], [1440, 3120]])
        const captions = await page.locator('.knowledge-gallery>article>p').allTextContents()
        for (const caption of captions) expect(caption).toMatch(/mākslīgā intelekta|AI-generated/i)
        expect(data.image.map((image: { caption: string }) => image.caption)).toEqual(captions)
      }
      await checkReadingResources(page,javaScriptEnabled)
      const other = locale === 'lv' ? 'en' : 'lv'
      await page.locator(`.reading-languages a[lang="${other}"]`).click()
      await expect(page).toHaveURL(new RegExp(forestPath(other, document) + '$'))
      await expect(page.locator('h1')).toHaveText(forestMetadata(other, document).heading)
      await page.goBack(); await expect(page).toHaveTitle(meta.title)
      expect(errors).toEqual([])
    } finally { await context.close() }
  })
}

test('2.5.7 route graph, CSP hashes, honest species facts and all internal resources remain coherent', async ({ request, page }) => {
  const policy = /script-src ([^;]+)/.exec(await readFile('dist/_headers', 'utf8'))![1]
  expect(policy).not.toMatch(/unsafe-inline|unsafe-eval/)
  expect([...policy.matchAll(/sha256-/g)]).toHaveLength(22)
  const paths = ['/', '/en/', readingPath('lv'), readingPath('en'), ...forestPages.flatMap(p => [forestPath('lv', p), forestPath('en', p)])]
  expect(new Set(paths).size).toBe(20)
  const links = new Set<string>(), titles = new Set<string>()
  for (const path of paths) {
    const response = await request.get(path), html = await response.text(); expect(response.status()).toBe(200)
    const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    expect(data).toHaveLength(1); expect(policy).toContain(`'sha256-${createHash('sha256').update(data[0][1]).digest('base64')}'`)
    const title = /<title>([^<]+)<\/title>/.exec(html)![1]; expect(titles.has(title)).toBe(false); titles.add(title)
    const found = await page.evaluate(html => { const d = new DOMParser().parseFromString(html, 'text/html'); return [...d.querySelectorAll('a[href^="/"], img[src^="/"]')].map(e => e.getAttribute('href') || e.getAttribute('src')!) }, html)
    for (const link of found) links.add(link.split('#')[0])
  }
  for (const link of links) expect((await request.head(link || '/')).status(), link).toBe(200)
  for (const path of ['/meza-piezimes/007/', '/en/field-notes/002-chaga/missing/', '/meza-foni/missing/', '/en/forest-wallpapers/missing/']) expect((await request.get(path)).status()).toBe(404)
  const expectations = [
    ['002', ['Inonotus obliquus', 'Fomitopsis betulina']], ['003', ['Laetiporus sulphureus']],
    ['004', ['Fomes fomentarius', 'Fomitopsis pinicola', 'Ganoderma applanatum']], ['006', ['Ganoderma lucidum', 'Ganoderma lingzhi', 'VU', '9.27.']],
  ] as const
  for (const locale of ['lv', 'en'] as const) {
    for (const [number, names] of expectations) { const html = await (await request.get(notePath(locale, number))).text(); for (const name of names) expect(html).toContain(name) }
    const html = await (await request.get(notePath(locale, '001'))).text()
    for (const observation of messages[locale].observations) { expect(html).toContain(observation.text); expect(html).toContain(observation.footnote) }
  }
  const home = await (await request.get('/')).text(), entry = /src="(\/assets\/[^"]+\.js)"/.exec(home)![1]
  const bundle = await readFile('dist' + entry, 'utf8')
  for (const number of ['002', '003', '004', '005', '006'] as const) expect(bundle).not.toContain(fieldNote('lv', number).lead)
})

test('2.5.7 original factual prose, notes, core cinema and every media/download asset remain preserved', async () => {
  const baseline = JSON.parse(await readFile('docs/qa/v257/baseline-inventory.json', 'utf8'))
  expect(readings).toEqual(JSON.parse(await readFile('docs/qa/v258/reading-copy-baseline.json','utf8')))
  for (const [path, hash] of Object.entries({ ...baseline.preservedAssets, ...baseline.preservedNotes })) expect(digest(await readFile('dist/' + path)), path).toBe(hash)
  // 2.5.8 explicitly enhances these four sources; full prose and real audio-graph
  // regressions replace obsolete byte-equality, all other immutable guards remain.
  const approved=new Set(['src/reading.ts','src/ReadingPage.tsx','src/reading.css','src/useForestAudio.ts'])
  for (const [path, hash] of Object.entries(baseline.preservedSource)) if(!approved.has(path))expect(digest(await readFile(path)), path).toBe(hash)
})

for (const locale of ['lv', 'en'] as const) test(`2.5.7 ${locale}: selective supported snippet labels preserve primary content, links and mobile control text`, async ({ page, request }) => {
  const t = messages[locale], response = await request.get(localePath(locale)), html = await response.text()
  const scan = await page.evaluate(html => {
    const d = new DOMParser().parseFromString(html, 'text/html')
    return { tags: [...d.querySelectorAll('[data-nosnippet]')].map(e => e.tagName), excludedFacts: !!d.querySelector('#facts-title')?.closest('[data-nosnippet]'), excludedLinks: [...d.querySelectorAll('.facts-context a, #wallpapers a')].filter(e => e.closest('[data-nosnippet]')).length, skip: d.querySelector('.skip-content [data-nosnippet]')?.textContent, intro: d.querySelector('.skip-intro [data-nosnippet]')?.textContent }
  }, html)
  expect(scan.tags.length).toBeGreaterThan(10); expect(scan.tags.every(t => ['SPAN', 'DIV', 'SECTION'].includes(t))).toBe(true)
  expect(scan.excludedFacts).toBe(false); expect(scan.excludedLinks).toBe(0); expect(scan.skip).toBe(t.skipContent); expect(scan.intro).toBe(t.skipIntro)
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(localePath(locale))
  const skip = page.getByRole('button', { name: t.skipIntro, exact: true }); await expect(skip).toBeVisible()
  const label = skip.locator('span[data-nosnippet]')
  const geometry = await label.evaluate(e => { const r = document.createRange(); r.selectNodeContents(e); return { width: r.getBoundingClientRect().width, height: r.getBoundingClientRect().height, font: getComputedStyle(e).fontSize, parentFont: getComputedStyle(e.parentElement!).fontSize } })
  expect(geometry.width).toBeGreaterThan(20); expect(geometry.height).toBeGreaterThan(8); expect(geometry.font).toBe(geometry.parentFont)
  await skip.click(); await expect(page.getByRole('button', { name: t.closer, exact: true })).toBeFocused()
  await expect(page.locator('.site-header').getByRole('link', { name: locale === 'lv' ? 'EN' : 'LV', exact: true })).toBeVisible()
  const notes = page.getByRole('link', { name: forestNavigation[locale].notes, exact: true }); await expect(notes).toHaveAttribute('href', fieldNotesPath(locale))
  await notes.click(); await expect(page).toHaveURL(new RegExp(fieldNotesPath(locale) + '$'))
  await page.goto(localePath(locale)); const gallery = page.getByRole('link', { name: forestNavigation[locale].wallpapers, exact: true }); await expect(gallery).toHaveAttribute('href', wallpapersPath(locale)); await gallery.click()
  await expect(page.locator('.knowledge-gallery')).toBeVisible()
})

test('2.5.7 JS-free wallpaper and original-note links download the real existing files', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage(); await page.goto(wallpapersPath('lv'))
    for (const link of await page.locator('.knowledge-downloads a').all()) {
      const waiting = page.waitForEvent('download'); await link.click(); const download = await waiting
      expect(download.suggestedFilename()).toBe((await link.getAttribute('href'))!.split('/').pop())
      expect(await download.failure()).toBeNull()
    }
    for (const locale of ['lv', 'en'] as const) {
      await page.goto(notePath(locale, '001')); const waiting = page.waitForEvent('download'); await page.locator('.knowledge-original').click()
      const download = await waiting; expect(download.suggestedFilename()).toBe(`field-note-${locale}.txt`)
      expect(await download.failure()).toBeNull()
    }
  } finally { await context.close() }
})
