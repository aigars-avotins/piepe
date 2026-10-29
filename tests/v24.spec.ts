import { test, expect } from '@playwright/test'
import { messages } from '../src/i18n'

const hydrated = async (page: import('@playwright/test').Page) => {
  await page.waitForFunction(() => !document.querySelector('.world')!.classList.contains('prerendered'))
}
const moving = async (page: import('@playwright/test').Page, name = 'understory') => {
  const video = page.locator(`[data-clip=${name}] video`)
  await expect(page.locator(`[data-clip=${name}]`)).toHaveAttribute('data-clip-ready', 'true')
  const time = await video.evaluate((v: HTMLVideoElement) => v.currentTime)
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(time + .1)
}

for (const locale of ['lv', 'en'] as const) test(`${locale}: discovered and downloaded notes retain distinct session progress`, async ({ page }) => {
  const t = messages[locale], other = locale === 'lv' ? 'en' : 'lv'
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(locale === 'lv' ? '/' : '/en/')
  const status = page.locator('.encounter-status'), dialog = page.getByRole('dialog')
  await expect(status).toHaveText(t.waiting)
  await page.getByRole('button', { name: t.closer, exact: true }).click()
  await expect(dialog.getByRole('heading')).toBeVisible()
  await expect(status).toHaveText(t.discoveredShort)
  await expect(dialog.locator('.collected-message')).toHaveCount(0)
  await page.getByRole('button', { name: t.closeDiscovery, exact: true }).click()
  await expect(status).toHaveText(t.discoveredShort)
  await page.locator('header .language-switch').getByRole('link', { name: other.toUpperCase(), exact: true }).click()
  await expect(status).toHaveText(messages[other].discoveredShort)
  await page.goBack()
  await expect(status).toHaveText(t.discoveredShort)
  await page.reload(); await hydrated(page)
  await expect(status).toHaveText(t.discoveredShort)
  await page.locator('#encounter .line-link').click()
  await dialog.getByRole('tab').first().focus(); await page.keyboard.press('End')
  const download = page.waitForEvent('download')
  await dialog.getByRole('link', { name: t.keepNote, exact: true }).click()
  expect((await download).suggestedFilename()).toBe(`piepe-field-note-001-${locale}.txt`)
  await expect(dialog.locator('.collected-message')).toHaveText(t.collected)
  await expect(dialog.getByRole('link', { name: t.anotherCopy })).toBeVisible()
  await page.getByRole('button', { name: t.closeDiscovery, exact: true }).click()
  await expect(status).toHaveText(t.collectedShort)
  await page.reload(); await hydrated(page)
  await expect(status).toHaveText(t.collectedShort)
  await page.locator('#encounter .line-link').click()
  await expect(status).toHaveText(t.collectedShort) // Opening must never downgrade a collection.
})

test('storage denial keeps in-memory progress through close, locale and history', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message))
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width: 390, height: 664 })
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Unavailable', 'SecurityError') }
    Storage.prototype.setItem = () => { throw new DOMException('Unavailable', 'SecurityError') }
  })
  await page.goto('/en/#encounter'); await hydrated(page)
  await page.locator('.specimen-invitation').click()
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.discoveredShort)
  await page.getByRole('dialog').getByRole('link', { name: 'LV', exact: true }).click()
  await page.getByRole('button', { name: messages.lv.closeDiscovery, exact: true }).click()
  await expect(page.locator('.encounter-status')).toHaveText(messages.lv.discoveredShort)
  await page.goBack()
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.discoveredShort)
  await page.locator('#encounter .line-link').click()
  await page.getByRole('dialog').getByRole('tab').first().focus(); await page.keyboard.press('End')
  // Collection records the explicit action, not whether the OS saved a file.
  await page.locator('.observation-actions a').evaluate(e => e.addEventListener('click', event => event.preventDefault()))
  await page.getByRole('link', { name: messages.en.keepNote, exact: true }).click()
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.collectedShort)
  expect(errors).toEqual([])
})

test('legacy 2.3 collection survives restoration and reopening', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => sessionStorage.setItem('piepe-note-found', '1'))
  await page.goto('/en/'); await hydrated(page)
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.collectedShort)
  await page.getByRole('button', { name: messages.en.closer, exact: true }).click()
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.collectedShort)
})

test('cancelled film preparation stays unseen; a readable fallback counts as discovered', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  await page.route('**/media/forest-awakening.mp4*', () => {})
  await page.goto('/en/'); await hydrated(page)
  const open = page.getByRole('button', { name: messages.en.closer, exact: true })
  await open.click()
  await expect(page.locator('.world')).toHaveAttribute('data-awakening', 'preparing')
  await page.keyboard.press('Escape')
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.waiting)
  expect(await page.evaluate(() => sessionStorage.getItem('piepe-note-discovered'))).toBeNull()
  await open.click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.getByRole('dialog').getByRole('heading')).toBeVisible()
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.discoveredShort)
  await expect(page.locator('video')).toHaveCount(0)
})

for (const mode of ['reduce', 'save-data']) test(`${mode}: static preferences also prevent explicit replay`, async ({ page }) => {
  const movies: string[] = []; page.on('request', r => { if (/\.mp4(?:\?|$)/.test(r.url())) movies.push(r.url()) })
  if (mode === 'reduce') await page.emulateMedia({ reducedMotion: 'reduce' })
  else await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }))
  let release!: () => void
  const bundle = new Promise<void>(resolve => { release = resolve })
  await page.route('**/assets/*.js', async route => { await bundle; await route.continue() })
  try {
    await page.goto('/en/', { waitUntil: 'commit' })
    await expect(page.locator('html')).toHaveClass(/preference-static/)
    await expect(page.locator('.motion-toggle')).toHaveCount(1)
    await expect(page.locator('.motion-toggle')).toBeHidden()
    await expect(page.locator('.hero-copy')).toBeVisible()
    await expect(page.locator('.hero-copy .title-enter').first()).toHaveCSS('opacity', '1')
  } finally { release() }
  await hydrated(page)
  await expect(page.locator('.replay-intro')).toBeHidden()
  await expect(page.locator('.motion-toggle')).toBeHidden()
  await page.locator('.replay-intro').evaluate((e: HTMLButtonElement) => e.click())
  for (const id of ['understory', 'return']) {
    await page.locator('#' + id).scrollIntoViewIfNeeded()
    await expect(page.locator('video')).toHaveCount(0)
  }
  expect(movies).toEqual([])
  await page.locator('#encounter .line-link').click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('live reduced-motion and data-saving toggles suspend and restore scenes without losing the note', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('piepe-entered', '1')
    Object.defineProperty(navigator, 'connection', { configurable: true, value: Object.assign(new EventTarget(), { saveData: false }) })
  })
  await page.goto('/en/'); await hydrated(page)
  await page.locator('#encounter .line-link').click()
  await page.getByRole('button', { name: messages.en.closeDiscovery, exact: true }).click()
  await page.locator('#understory').scrollIntoViewIfNeeded(); await moving(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.locator('.world')).toHaveClass(/static-preference/)
  await page.locator('#encounter .line-link').click()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.discoveredShort)
  await page.getByRole('button', { name: messages.en.closeDiscovery, exact: true }).click()
  await page.locator('#understory').scrollIntoViewIfNeeded(); await moving(page)
  for (const saving of [true, false]) {
    await page.evaluate(value => {
      const connection = (navigator as Navigator & { connection: EventTarget & { saveData: boolean } }).connection
      connection.saveData = value; connection.dispatchEvent(new Event('change'))
    }, saving)
    if (saving) { await expect(page.locator('video')).toHaveCount(0); await expect(page.locator('.world')).toHaveClass(/static-preference/) }
    else { await expect(page.locator('.world')).not.toHaveClass(/static-preference/); await moving(page) }
  }
  await expect(page.locator('video.forest-film')).toHaveCount(0)
  await expect(page.locator('.encounter-status')).toHaveText(messages.en.discoveredShort)
})

test('a paused failed scene offers Resume and can actually play again', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('piepe-entered', '1'))
  await page.route('**/media/forest-breathing.mp4*', route => route.abort())
  await page.goto('/en/#return'); await hydrated(page)
  await expect(page.locator('[data-clip=breathing]')).toHaveAttribute('data-clip-state', 'error')
  await page.keyboard.press('Escape')
  const control = page.locator('#return .cinema-pause')
  await expect(control).toHaveText(messages.en.resumeFilm)
  await page.unroute('**/media/forest-breathing.mp4*')
  await control.click(); await moving(page, 'breathing')
  await expect(control).toHaveText(messages.en.pauseFilm)
})

for (const locale of ['lv', 'en'] as const) test(`${locale}: mobile note invitation, optional learning and social preview stay coherent`, async ({ page, request }) => {
  const t = messages[locale], path = locale === 'lv' ? '/' : '/en/'
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const html = await (await request.get(path)).text()
  expect(html.match(/name="twitter:image:alt"/g)).toHaveLength(1)
  expect(html).toContain(t.wallpaperAltDesktop)
  await page.goto(path); await hydrated(page); await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', t.wallpaperAltDesktop)
  for (const [width, height] of [[1512, 982], [390, 844], [390, 664], [320, 690], [844, 390]]) {
    await page.setViewportSize({ width, height })
    const invitation = page.locator('.specimen-invitation')
    await invitation.scrollIntoViewIfNeeded()
    await expect(invitation).toHaveAccessibleName(`${t.openNote} — ${t.noteLabel}`)
    await expect(invitation.locator('span').last()).toBeVisible()
    const geometry = await invitation.evaluate(e => {
      const box = e.getBoundingClientRect(), label = e.lastElementChild!.getBoundingClientRect()
      return { width: box.width, height: box.height, left: label.left, right: label.right, overflow: document.documentElement.scrollWidth > innerWidth }
    })
    expect(geometry.width).toBeGreaterThanOrEqual(44); expect(geometry.height).toBeGreaterThanOrEqual(44)
    expect(geometry.left).toBeGreaterThanOrEqual(0); expect(geometry.right).toBeLessThanOrEqual(width)
    expect(geometry.overflow).toBe(false)
  }
  await expect(page.locator('.vocabulary-note')).toBeHidden()
  await page.locator('.fungus-vocabulary summary').focus(); await page.keyboard.press('Enter')
  await expect(page.locator('.vocabulary-note')).toHaveText(t.glossaryObservation)
  await page.locator('header .language-switch').getByRole('link', { name: locale === 'lv' ? 'EN' : 'LV', exact: true }).click()
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveCount(1)
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', messages[locale === 'lv' ? 'en' : 'lv'].wallpaperAltDesktop)
})
