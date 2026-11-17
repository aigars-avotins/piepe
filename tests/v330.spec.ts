import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { localePath, readingPath } from '../src/i18n'
import { fieldNotesPath, notePath, wallpapersPath } from '../src/forestPaths'
import { aboutPath, siteRoutes } from '../src/routes'
import { colophonPeople, siteCopy } from '../src/siteCopy'
import { mediaVersion } from '../src/release'

// 3.3 regressions. Each case names the audited defect it guards.
test('3.3 atlas loupe never requests an owner JPEG; explicit zoom requests exactly the chosen one', async ({ page }) => {
  const originals: string[] = []
  page.on('request', request => { const path = new URL(request.url()).pathname; if (/\/images\/interactive\/atlas-[a-z]+\.jpg$/.test(path)) originals.push(path) })
  await page.goto(readingPath('en') + '#surface-atlas')
  const pictures = page.locator('.atlas-picture')
  await expect(pictures).toHaveCount(3)
  for (let index = 0; index < 3; index++) {
    const picture = pictures.nth(index), image = picture.locator('img[data-interactive-image]')
    await picture.scrollIntoViewIfNeeded(); await expect(image).toHaveAttribute('data-image-state', 'ready')
    const box = (await image.boundingBox())!
    await page.mouse.move(box.x + box.width * .4, box.y + box.height * .5); await page.mouse.move(box.x + box.width * .6, box.y + box.height * .5)
    await expect(picture.locator('.atlas-loupe')).toBeVisible()
    await expect.poll(() => picture.locator('.atlas-loupe img').evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0 && element.currentSrc)).toMatch(/\/responsive\/atlas-[a-z]+-(960|1600|2400)\.(?:avif|webp)$/)
  }
  expect(originals).toEqual([])
  await page.locator('[data-atlas-open]').nth(1).click()
  const dialog = page.locator('[data-atlas-dialog]')
  await expect(dialog).toBeVisible(); await expect(dialog.locator('img')).toHaveCount(3)
  await expect(dialog.locator('img').first()).toHaveAttribute('loading', 'eager')
  await expect.poll(() => dialog.locator('img').first().evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth)).toBe(2400)
  await expect(dialog.locator('img').nth(1)).toHaveAttribute('loading', 'lazy'); await expect(dialog.locator('img').nth(2)).toHaveAttribute('srcset', /responsive\/atlas-[a-z]+-960\.(?:avif|webp) 960w/)
  expect(originals).toEqual(['/images/interactive/atlas-gills.jpg'])
})

const mediaImages = (page: Page) => { const seen: string[] = []; page.on('request', request => { const path = new URL(request.url()).pathname; if (request.resourceType() === 'image' && path.startsWith('/media/')) seen.push(path) }); return seen }

test('3.3 a first visit preloads and fetches only the opening frame it paints', async ({ page }) => {
  const seen = mediaImages(page)
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('head link[rel=preload][as=image]')).toHaveCount(1)
  await expect(page.locator('head link[rel=preload][as=image]')).toHaveAttribute('href', `/media/forest-poster.jpg?v=${mediaVersion}`)
  await expect(page.locator('.world')).not.toHaveClass(/prerendered/)
  await expect(page.locator('.forest-still')).toHaveAttribute('src', `/media/forest-poster.jpg?v=${mediaVersion}`)
  // The settled forest is needed when the film ends (low priority); the two later plates are not requested yet.
  expect(seen).toContain('/media/forest-poster.jpg'); expect(seen).not.toContain('/media/forest-breathing-poster.jpg')
})

for (const [name, prepare] of [
  ['reduced motion', async (page: Page) => { await page.emulateMedia({ reducedMotion: 'reduce' }) }],
  ['a returning visit', async (page: Page) => { await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1')) }],
] as const) test(`3.3 ${name} never fetches the film's opening frame`, async ({ page }) => {
  const seen = mediaImages(page)
  await prepare(page); await page.goto('/')
  await expect(page.locator('head link[rel=preload][as=image]')).toHaveAttribute('href', `/media/forest-final.jpg?v=${mediaVersion}`)
  await expect(page.locator('.world')).toHaveAttribute('data-intro-state', 'complete')
  await expect(page.locator('.forest-still')).toHaveAttribute('src', `/media/forest-final.jpg?v=${mediaVersion}`)
  await expect.poll(() => page.locator('.wide-environment>img').getAttribute('src'), { timeout: 8000 }).toContain('forest-breathing-poster')
  expect(seen).not.toContain('/media/forest-poster.jpg')
})

test('3.3 without JavaScript the hero shows the settled forest from CSS and requests no opening frame', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  try {
    const page = await context.newPage(), seen = mediaImages(page)
    await page.goto('/en/')
    expect(await page.locator('.base-camera>.media-plane').evaluate(element => getComputedStyle(element, '::before').backgroundImage)).toContain('forest-final.jpg')
    await expect(page.locator('#hero-title')).toBeVisible()
    expect(seen).not.toContain('/media/forest-poster.jpg')
  } finally { await context.close() }
})

for (const locale of ['lv', 'en'] as const) {
  const t = siteCopy[locale]
  test(`3.3 ${locale}: the Trails menu reaches every page and both languages from a reading page`, async ({ page }) => {
    await page.goto(readingPath(locale))
    const menu = page.locator('details[data-site-menu]'), summary = menu.locator('summary')
    await expect(menu).toHaveCount(1); await expect(summary).toBeVisible(); await expect(summary).toHaveAccessibleName(t.menu.open)
    const box = (await summary.boundingBox())!; expect(box.height).toBeGreaterThanOrEqual(44); expect(box.width).toBeGreaterThanOrEqual(44)
    await summary.focus(); await page.keyboard.press('Enter'); await expect(menu).toHaveAttribute('open', '')
    const links = menu.locator('nav a'); await expect(links).toHaveCount(5)
    expect(await links.evaluateAll(items => items.map(item => item.getAttribute('href')))).toEqual([localePath(locale), readingPath(locale), fieldNotesPath(locale), wallpapersPath(locale), aboutPath(locale)])
    await expect(menu.locator('nav a[aria-current=page]')).toHaveText(new RegExp(t.menu.items.guide.replace('?', '\\?')))
    await expect(menu.locator('.site-menu-languages a[hreflang=lv]')).toHaveAttribute('href', readingPath('lv')); await expect(menu.locator('.site-menu-languages a[hreflang=en]')).toHaveAttribute('href', readingPath('en'))
    await page.keyboard.press('Escape'); await expect(menu).not.toHaveAttribute('open', ''); await expect(summary).toBeFocused()
    await summary.click(); await page.mouse.click(20, 200); await expect(menu).not.toHaveAttribute('open', '')
    await summary.click(); await links.nth(4).click(); await expect(page).toHaveURL(new RegExp(aboutPath(locale) + '$'))
    await expect(page.locator('h1')).toHaveText(t.about.heading)
  })
  test(`3.3 ${locale}: the menu works without JavaScript and the footer is the same on every document`, async ({ browser, request }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    try {
      const page = await context.newPage(); await page.goto(notePath(locale, '003'))
      const menu = page.locator('details[data-site-menu]'); await menu.locator('summary').click(); await expect(menu.locator('nav a').first()).toBeVisible()
      await menu.locator('nav a').nth(2).click(); await expect(page).toHaveURL(new RegExp(fieldNotesPath(locale) + '$'))
    } finally { await context.close() }
    for (const route of siteRoutes) {
      const html = await (await request.get(route.paths[locale])).text()
      expect(html.match(/<footer class="site-footer"/g), route.key).toHaveLength(1); expect(html.match(/data-site-menu/g), route.key).toHaveLength(1)
      expect(html).toContain(t.footer.thought); expect(html).toContain(t.footer.art); expect(html.match(/<h1[\s>]/g), route.key).toHaveLength(1)
    }
  })
  test(`3.3 ${locale}: the home menu, footer and portal menu share the same destinations`, async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
    await page.goto(localePath(locale)); await expect(page.locator('.world')).toHaveAttribute('data-intro-state', 'complete')
    const menu = page.locator('.world>details[data-site-menu]'); await menu.locator('summary').click(); await expect(menu.locator('nav a')).toHaveCount(5)
    await expect(menu.locator('nav a[aria-current=page]')).toHaveText(new RegExp(t.menu.items.home)); await page.keyboard.press('Escape'); await expect(menu).not.toHaveAttribute('open', '')
    const footer = page.locator('footer.site-footer'); await footer.scrollIntoViewIfNeeded()
    await expect(footer.locator('.site-footer-thought')).toHaveText(t.footer.thought); await expect(footer.locator('.motion-toggle')).toBeVisible()
    await expect(footer.locator(`a[href="${aboutPath(locale)}"]`)).toBeVisible(); await expect(footer.locator(`a[href="${fieldNotesPath(locale)}"]`)).toBeVisible()
    await page.locator('#encounter').evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.locator('[data-portal-entry]').click()
    const portal = page.locator('.fungus-portal'); await expect(portal).toHaveAttribute('data-portal-still-presented', 'true')
    const inner = portal.locator('details[data-site-menu]'); await inner.locator('summary').click(); await expect(inner.locator('nav a')).toHaveCount(5)
    // Escape closes the open menu first; the portal itself stays.
    await page.keyboard.press('Escape'); await expect(inner).not.toHaveAttribute('open', ''); await expect(portal).toHaveCount(1)
    await expect(portal.locator(`.portal-art a[href="${aboutPath(locale)}#${t.about.films.id}"]`)).toHaveText(t.about.films.heading)
  })
  test(`3.3 ${locale}: About states the idea, the ten films in words and the AI-made imagery; no invented credits`, async ({ page }) => {
    const response = await page.goto(aboutPath(locale)); expect(response!.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', locale); await expect(page).toHaveTitle(t.about.title)
    await expect(page.locator('.about-films li')).toHaveCount(10); await expect(page.locator('.about-films li h3').first()).toHaveText(t.about.films.items[0].name)
    for (const section of t.about.sections) await expect(page.locator('#' + section.id)).toHaveText(section.heading)
    await expect(page.locator('#credits')).toHaveCount(colophonPeople.filter(person => person.name).length ? 1 : 0)
    const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() as string)
    expect(data['@type']).toBe('AboutPage'); expect(data.mainEntity['@type']).toBe('Article'); expect(data.mainEntity.datePublished).toMatch(/^\d{4}-\d\d-\d\d$/)
  })
}

test('3.3 every route has its own title, description and 1200×630 social image; dates and sitemap agree', async ({ request }) => {
  const titles = new Set<string>(), descriptions = new Set<string>(), images = new Set<string>()
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const route of siteRoutes) for (const locale of ['lv', 'en'] as const) {
    const path = route.paths[locale], html = await (await request.get(path)).text()
    const title = /<title>([^<]+)<\/title>/.exec(html)![1], description = /<meta name="description" content="([^"]+)"/.exec(html)![1], image = /<meta property="og:image" content="([^"]+)"/.exec(html)![1]
    expect(titles.has(title), title).toBe(false); titles.add(title); expect(descriptions.has(description), description).toBe(false); descriptions.add(description)
    // Decoded lengths: long enough to say something, short enough not to be cut in a result or a card.
    const plain = (value: string) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
    expect(plain(title).length, `${path} title`).toBeGreaterThanOrEqual(20); expect(plain(title).length, `${path} title`).toBeLessThanOrEqual(70)
    expect(plain(description).length, `${path} description`).toBeGreaterThanOrEqual(70); expect(plain(description).length, `${path} description`).toBeLessThanOrEqual(165)
    expect(image).toBe(`https://pie.pe/og/${route.key}-${locale}.jpg`); expect(images.has(image)).toBe(false); images.add(image)
    expect(html).toContain(`<meta name="twitter:image" content="${image}"`)
    const card = await request.get(new URL(image).pathname); expect(card.status()).toBe(200)
    const { width, height } = await sharp(await card.body()).metadata(); expect([width, height]).toEqual([1200, 630])
    const data = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)![1])
    expect(data.dateModified).toBe(route.modified); expect(data.datePublished).toBe(route.published); expect(data.isPartOf['@type']).toBe('WebSite')
    expect(sitemap).toContain(`<loc>https://pie.pe${path}</loc><lastmod>${route.modified}</lastmod>`)
    if (route.key.startsWith('note-') || route.key === 'guide') { expect(data.mainEntity['@type']).toBe('Article'); expect(data.mainEntity.dateModified <= route.modified).toBe(true) }
    if (route.key.startsWith('note-')) expect(data.breadcrumb['@type']).toBe('BreadcrumbList')
    if (route.key === 'home') { expect(data.video).toHaveLength(10); for (const video of data.video) { expect(video['@type']).toBe('VideoObject'); expect((await request.head(new URL(video.contentUrl).pathname + new URL(video.contentUrl).search)).status()).toBe(200) } }
    if (route.key === 'wallpapers') for (const item of data.image) { expect(item.license).toBe(`https://pie.pe${aboutPath(locale)}#wallpapers`); expect(item.digitalSourceType).toContain('trainedAlgorithmicMedia') }
  }
  expect(titles.size).toBe(siteRoutes.length * 2)
})

test('3.3 unknown addresses get the designed 404 page; security headers and the manifest are complete', async ({ page, request }) => {
  const response = await page.goto('/no-such-trail/'); expect(response!.status()).toBe(404)
  await expect(page.locator('h1')).toHaveCount(2); await expect(page.locator('details[data-site-menu]')).toHaveCount(1); await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex')
  const home = await request.get('/'), card = await request.get('/og/home-lv.jpg')
  expect(home.headers()['cross-origin-opener-policy']).toBe('same-origin'); expect(home.headers()['cross-origin-resource-policy']).toBe('same-origin'); expect(card.headers()['cross-origin-resource-policy']).toBe('cross-origin')
  const csp = home.headers()['content-security-policy']; expect([...csp.matchAll(/'sha256-/g)]).toHaveLength(1); expect(csp).not.toMatch(/https?:|unsafe-eval/)
  for (const line of (await readFile('dist/_headers', 'utf8')).split('\n')) expect(line.length).toBeLessThan(2000)
  const manifest = await (await request.get('/site.webmanifest')).json()
  expect(manifest.description.length).toBeGreaterThan(40); expect(manifest.lang).toBe('lv'); expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose === 'maskable')).toBe(true)
  for (const file of [...manifest.icons, ...manifest.screenshots]) expect((await request.get(file.src)).status(), file.src).toBe(200)
  expect(manifest.screenshots.map((shot: { form_factor: string }) => shot.form_factor).sort()).toEqual(['narrow', 'wide'])
})

test('3.3 no page raises a CSP violation or a console error, and the fixed controls keep 44px targets on a phone', async ({ page }) => {
  const problems: string[] = []
  page.on('console', message => { if (message.type() === 'error') problems.push(message.text()) }); page.on('pageerror', error => problems.push(String(error)))
  await page.addInitScript(() => { sessionStorage.setItem('piepe-entered', '1'); document.addEventListener('securitypolicyviolation', event => console.error('CSP ' + event.violatedDirective + ' ' + event.blockedURI)) })
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/', readingPath('en'), notePath('lv', '005'), wallpapersPath('en'), aboutPath('lv')]) {
    await page.goto(path); await page.evaluate(() => document.fonts.ready)
    const summary = page.locator('details[data-site-menu]>summary').first(), box = (await summary.boundingBox())!
    expect(box.width, path).toBeGreaterThanOrEqual(44); expect(box.height, path).toBeGreaterThanOrEqual(44); expect(box.x + box.width, path).toBeLessThanOrEqual(390)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} has no horizontal scroll`).toBe(true)
  }
  await page.goto('/#encounter'); await expect(page.locator('.world')).toHaveAttribute('data-scene', /encounter|understory/)
  const sound = (await page.locator('.world>.sound-control').boundingBox())!
  expect(sound.width).toBeLessThanOrEqual(60); expect(sound.width).toBeGreaterThanOrEqual(44); expect(sound.height).toBeGreaterThanOrEqual(44)
  await expect(page.locator('.world>.sound-control')).toHaveAccessibleName(/.+/)
  expect(problems).toEqual([])
})
